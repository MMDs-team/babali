import datetime, requests
from django.contrib.auth import get_user_model
from django.db import connection, transaction
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.mixins import ListModelMixin, RetrieveModelMixin
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet

from bus.filters import TicketFilter
from bus.models import Ticket, Travel
from bus.serializers.ticket_serializers import TicketSerializer
from consts import PENDING_TICKET_MINS, PRINT_TICKETS_URL, BUS_TICKET_TYPE


class TicketViewSet(ListModelMixin, RetrieveModelMixin, GenericViewSet):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer

    filter_backends = [DjangoFilterBackend]
    filterset_class = TicketFilter


    @action(detail=False, methods=['post'])
    def bulk_create(self, request):
        data = request.data
        if len(data) == 0: return Response({'error': 'There is no ticket data to process.'}, status=status.HTTP_400_BAD_REQUEST)

        user = data[0].get('user')
        if user is None: return Response({'error': 'Missing user field.'}, status=status.HTTP_400_BAD_REQUEST)
        User = get_user_model()
        if not User.objects.filter(pk=user).exists():
            User.objects.create(pk=user, username=user, password=user)

        serializer = self.get_serializer(data=data, many=True)
        serializer.is_valid(raise_exception=True)
        
        validated_data = serializer.validated_data
        tickets_to_create = []
        with transaction.atomic():
            # with connection.cursor() as cursor:
            #     cursor.execute("LOCK TABLES bus_ticket WRITE;")

            try:
                latest_serial_no = Ticket.objects.latest('serial').serial
            except Ticket.DoesNotExist:
                latest_serial_no = -1

            travel = validated_data[0]['travel'] 
            travel.capacity -= len(validated_data)
            travel.save()
                
            payment_due_datetime = datetime.datetime.now() + datetime.timedelta(minutes=PENDING_TICKET_MINS)
            curr_serial_no = latest_serial_no + 1
            for item_data in validated_data:
                tickets_to_create.append(
                    Ticket(
                        **item_data,
                        serial=curr_serial_no,
                        payment_due_datetime=payment_due_datetime
                    )
                )

                travel.seat_stat[item_data['seat_no']] = {
                    'user_phone': item_data['user'].phone,
                    "gender": "M" if item_data['gender'] else "F"
                }
                travel.save()
                
            tickets = Ticket.objects.bulk_create(tickets_to_create)
            response_serializer = self.get_serializer(tickets, many=True)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)

        return Response({'error': "Transaction failed."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


    @action(detail=False, methods=['patch'])
    def verify(self, request):
        serial = self.request.query_params.get('serial')
        transaction_status = self.request.query_params.get('status')

        if serial is not None and transaction_status in ('OK', 'NOK'):
            ticket_status = Ticket.STATUS_ACCEPTED if transaction_status == 'OK' else Ticket.STATUS_REJECTED
            verbose_name = dict(Ticket.STATUS_CHOICES)[ticket_status]
            Ticket.objects.filter(serial=serial).update(status=ticket_status)
            return Response({'serial': serial, 'status': verbose_name}, status=status.HTTP_200_OK)

        return Response({'error': 'You have to supply both serial & status query params.'}, status=status.HTTP_406_NOT_ACCEPTABLE)

    
    @action(detail=False, methods=['patch'])
    def cancel(self, request):
        serial = request.data['serial']
        tickets = Ticket.objects.filter(serial=serial, status='A', canceled=False)
        if len(tickets):
            travel = tickets[0].travel
            for ticket in tickets:
                seat_no = str(ticket.seat_no)

                if seat_no in travel.seat_stat:
                    del travel.seat_stat[seat_no]['user_phone']
                    travel.seat_stat[seat_no]['gender'] = 'E'

            travel.capacity += len(tickets)
            travel.save()
            tickets.update(canceled=True)
            # TODO: Logic for payment rollback.

            return Response({'msg': f'Tickets with serial={serial} have been canceled successfully.'})

        return Response({'error': f'There is no ticket with serial={serial} to cancel.'})


    @action(detail=False, methods=['post'])
    def print(self, request):
        serial = request.data['serial']
        tickets = Ticket.objects.filter(serial=serial, status='A', canceled=False).select_related('travel') \
                                                                                  .values('first_name',
                                                                                          'last_name',
                                                                                          'serial',
                                                                                          'ssn',
                                                                                          'birth_date',
                                                                                          'gender',
                                                                                          'user',
                                                                                          'travel_id',
                                                                                          'seat_no')
        tickets = list(tickets)
        if len(tickets):
            travel_id = tickets[0]['travel_id']
            travel = Travel.objects.filter(pk=travel_id).select_related('terminal', 'cooperative') \
                                                        .values('date_time',
                                                                'origin',
                                                                'dest',
                                                                'terminal__name',
                                                                'cooperative__name',
                                                                'price',
                                                                'description')[0]

            travel['date_time'] = travel['date_time'].isoformat()
            tickets = [{**ticket, **travel} for ticket in tickets]
            for i in range(len(tickets)):
                if tickets[i].get('birth_date') is not None:
                    tickets[i]['birth_date'] = tickets[i]['birth_date'].isoformat()

            try:
                payload = {
                    'tickets_type': BUS_TICKET_TYPE,
                    'tickets_data': tickets,
                    'output_name': serial
                }
                response = requests.post(PRINT_TICKETS_URL, json=payload)
                response.raise_for_status()

                response_data = response.json()
                tickets_pdf_path = response_data['path']
                return Response({'path': tickets_pdf_path}, status=status.HTTP_201_CREATED)

            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        else: return Response({'error': 'There is no valid ticket to print'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
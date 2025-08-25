import datetime
from django.db import connection, transaction
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.mixins import ListModelMixin, RetrieveModelMixin
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet

from babali.utils.tickets import GENERATOR
from babali.consts import FLIGHT_TICKET_TYPE
from flight.models import Ticket, Travel
from flight.serializers.ticket_serializers import TicketSerializer
from consts import PENDING_TICKET_MINS


FLIGHT_TEMPLATE_NAME = 'flight.html'
FLIGHT_PLACEHOLDER_MAP = {
    '<1>': 'first_name',
    '<2>': 'last_name',
    '<3>': 'ssn',
    '<4>': 'date_time',
    '<5>': 'flight_type',
    '<6>': 'flight_class',
    '<7>': 'price',
    '<8>': 'origin',
    '<9>': 'dest',
    '<10>': 'seat_no',
    '<11>': 'return_ticket',
    '<12>': 'airport__name',
    '<13>': 'terminal_no',
    '<14>': 'flight_agency__name'
}


class TicketViewSet(ListModelMixin,
                    RetrieveModelMixin,
                    GenericViewSet):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer

    @action(detail=False, methods=['post'])
    def bulk_create(self, request):
        serializer = self.get_serializer(data=request.data, many=True)
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

                seat_no = travel.get_next_seat()
                travel.seat_stat[str(seat_no)] = {
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

    
    # TODO: Test this endpoint then integrate.
    # @action(detail=False, methods=['patch'])
    # def cancel(self, request):
    #     serial = request.data['serial']
    #     tickets = Ticket.objects.filter(serial=serial, status='A', canceled=False)
    #     if len(tickets):
    #         travel = tickets[0].travel
    #         for ticket in tickets:
    #             seat_no = str(ticket.seat_no)

    #             del travel.seat_stat[seat_no]['phone']
    #             travel.seat_stat[seat_no]['gender'] = 'E'

    #         tickets.update(canceled=True)
    #         # TODO: Logic for payment rollback.

    #         return Response({'msg': f'Tickets with serial={serial} have been canceled successfully.'})

    #     return Response({'error': f'There is no ticket with serial={serial} to cancel.'})


    @action(detail=False, methods=['post'])
    def print(self, request):
        serial = request.data['serial']
        tickets = Ticket.objects.filter(serial=serial, status='A').select_related('travel') \
                                                                  .values('first_name',
                                                                          'last_name',
                                                                          'serial',
                                                                          'ssn',
                                                                          'birth_date',
                                                                          'gender',
                                                                          'user',
                                                                          'travel_id',
                                                                          'return_ticket',
                                                                          'seat_no')
        tickets = list(tickets)

        if len(tickets):
            travel_id = tickets[0]['travel_id']
            travel = Travel.objects.filter(pk=travel_id).select_related('airport', 'flight_agency') \
                                                        .values('date_time',
                                                                'flight_type',
                                                                'flight_class',
                                                                'terminal_no',
                                                                'origin',
                                                                'dest',
                                                                'price',
                                                                'airport__name',
                                                                'flight_agency__name',
                                                                'description')[0]

            tickets = [{**ticket, **travel} for ticket in tickets]
            tickets_pdf = GENERATOR.generate_tickets_pdf(ticket_template_name=FLIGHT_TEMPLATE_NAME, placeholders_map=FLIGHT_PLACEHOLDER_MAP,
                                                         data_list=tickets, ticket_type=FLIGHT_TICKET_TYPE, output_name=str(serial))
            if tickets_pdf is not None:
                return Response({'tickets_pdf': tickets_pdf}, status=status.HTTP_201_CREATED)
            else: 
                return Response({'error': "There was a problem in pdf generation task."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response({'error': "There is no valid ticket to print."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
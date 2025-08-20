import datetime
from django.db import connection, transaction
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.mixins import ListModelMixin, CreateModelMixin, RetrieveModelMixin
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet

from babali.utils.tickets import GENERATOR
from train.models import Ticket, Travel
from train.serializers.ticket_serializers import TicketSerializer
from consts import PENDING_TICKET_MINS


TRAIN_TEMPLATE_NAME = 'train.html'
TRAIN_TICKET_TYPE = 'train'
TRAIN_PLACEHOLDER_MAP = {
    '<1>': 'first_name',
    '<2>': 'last_name',
    '<3>': 'ssn',
    '<6>': 'date_time',
    '<7>': 'price',
    '<8>': 'route__origin_city',
    '<9>': 'route__dest_city',
    '<10>': 'compartment_no',
    '<11>': 'seat_no',
    '<12>': 'cooperative__name',
    '<13>': 'serial'
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
            with connection.cursor() as cursor:
                cursor.execute("LOCK TABLES train_ticket WRITE;")

            try:
                latest_serial_no = Ticket.objects.latest('serial').serial
            except Ticket.DoesNotExist:
                latest_serial_no = -1
                
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
                
            tickets = Ticket.objects.bulk_create(tickets_to_create)
            response_serializer = self.get_serializer(tickets, many=True)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)

        return Response({'error': "Transaction failed."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


    @action(detail=False, methods=['patch'])
    def verify(self, request):
        serial = self.request.query_params.get('Serial')
        status = self.request.query_params.get('Status')
        if status == 'OK':
            Ticket.objects.filter(serial=serial).update(status=Ticket.STATUS_ACCEPTED)
            return Response({'serial': serial}, status=status.HTTP_200_OK)

        return Response({'error': 'Payment is not verified.'}, status=status.HTTP_406_NOT_ACCEPTABLE)

    
    @action(detail=False, methods=['get'])
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
                                                                          'compartment_no',
                                                                          'seat_no')
        tickets = list(tickets)

        if len(tickets):
            travel_id = tickets[0]['travel_id']
            travel = Travel.objects.filter(pk=travel_id).select_related('route').select_related('cooperative') \
                                                                                .values('date_time',
                                                                                        'route__origin_city',
                                                                                        'route__dest_city',
                                                                                        'cooperative__name',
                                                                                        'price',
                                                                                        'description')[0]
            print(travel)

            tickets = [{**ticket, **travel} for ticket in tickets]
            tickets_pdf = GENERATOR.generate_tickets_pdf(ticket_template_name=TRAIN_TEMPLATE_NAME, placeholders_map=TRAIN_PLACEHOLDER_MAP,
                                                         data_list=tickets, ticket_type="train", output_name=str(serial))
            if tickets_pdf is not None:
                return Response({'tickets_pdf': tickets_pdf}, status=status.HTTP_201_CREATED)
            else: 
                return Response({'error': "There was a problem in pdf generation task."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response({'error': "There is no valid ticket to print."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
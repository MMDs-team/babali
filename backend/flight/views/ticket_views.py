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
                                                                          'return_ticket',
                                                                          'seat_no')
        tickets = list(tickets)

        if len(tickets):
            travel_id = tickets[0]['travel_id']
            travel = Travel.objects.filter(pk=travel_id).values('date_time',
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
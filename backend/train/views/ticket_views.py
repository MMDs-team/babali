import datetime
from django.db import connection, transaction
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.mixins import ListModelMixin, CreateModelMixin, RetrieveModelMixin
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet

from train.models import Ticket
from train.serializers.ticket_serializers import TicketSerializer
from consts import PENDING_TICKET_MINS


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
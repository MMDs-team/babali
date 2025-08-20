import datetime, math
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

        serializer = self.get_serializer(data=request.data['tickets'], many=True)
        serializer.is_valid(raise_exception=True)
        
        validated_data = serializer.validated_data
        tickets_to_create = []

        get_full_com = request.data['get_full_com']
        travel = validated_data[0]['travel'] 
        compartment_capacity = travel.train.compartment_capacity
        compartment_count = travel.train.compartment_count
        capacity = compartment_capacity * compartment_count

        with transaction.atomic():
            # with connection.cursor() as cursor:
            #     cursor.execute("LOCK TABLES train_ticket WRITE;")

            try:
                latest_serial_no = Ticket.objects.latest('serial').serial
            except Ticket.DoesNotExist:
                latest_serial_no = -1
            payment_due_datetime = datetime.datetime.now() + datetime.timedelta(minutes=PENDING_TICKET_MINS)
            curr_serial_no = latest_serial_no + 1

            next_seat_number = travel.get_next_seat(get_full_com)
                
            for item_data in validated_data:

                compartment_num = math.ceil(next_seat_number / compartment_capacity)

                tickets_to_create.append(
                    Ticket(
                        **item_data,
                        seat_no = next_seat_number,
                        compartment_no = compartment_num,
                        serial=curr_serial_no,
                        payment_due_datetime=payment_due_datetime
                    )
                )

                travel.seat_stat[next_seat_number] = {}
                travel.seat_stat[next_seat_number]['user_phone'] = item_data['user'].phone
                travel.seat_stat[next_seat_number]['full_com'] = get_full_com 

                next_seat_number += 1

            travel.capacity -= compartment_capacity if get_full_com else len(validated_data)
            travel.save()

            tickets = Ticket.objects.bulk_create(tickets_to_create)
            response_serializer = self.get_serializer(tickets, many=True)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)

        return Response({'error': "Transaction failed."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
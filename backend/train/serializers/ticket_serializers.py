from rest_framework import serializers
from train.models import Ticket


class TicketSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Ticket
        fields = [
            'ticket_id',
            'travel',
            'user',
            'first_name',
            'last_name',
            'ssn',
            'birth_date',
            'gender',
            'serial',
            'seat_no',
            'get_full_compartment',
            'compartment_no',
            'status',
            'payment_due_datetime',
            'canceled',
        ]

        read_only_fields = [
            'ticket_id',
            'serial',
            'payment_due_datetime',
        ]
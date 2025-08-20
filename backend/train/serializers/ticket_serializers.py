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
            'compartment_no',
            'status',
            'payment_due_datetime',
        ]

        read_only_fields = [
            'ticket_id',
            'serial',
            'payment_due_datetime',
        ]
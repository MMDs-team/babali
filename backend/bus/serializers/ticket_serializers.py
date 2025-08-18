from rest_framework import serializers

from bus.models import Ticket


class TicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = [
            'ticket_id',
            'user',
            'travel',
            'first_name',
            'last_name',
            'ssn',
            'birth_date',
            'gender',
            'serial',
            'seat_no',
            'status',
            'payment_due_datetime',
        ]

        read_only_fields = [
            'ticket_id',
            'serial',
            'payment_due_datetime',
        ]
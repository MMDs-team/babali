from rest_framework import serializers

from flight.models import Travel


class TravelSerializer(serializers.ModelSerializer):

    class Meta:
        model = Travel
        fields = [
            'travel_id',
            'airport',
            'airplane',
            'flight_agency',
            'capacity',
            'date_time',
            'price',
            'dest',
            'origin',
            'terminal_no',
            'flight_type',
            'description',
            'flight_class',
            'max_loggage_weight',
        ]
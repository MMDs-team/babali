from rest_framework import serializers

from bus.models import Travel


class TravelSerializer(serializers.ModelSerializer):

    class Meta:
        model = Travel
        fields = [
            'travel_id',
            'bus',
            'terminal',
            'cooperative',
            'origin',
            'dest',
            'date_time',
            'price',
            'description',
            'capacity',
        ]
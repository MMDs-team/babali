from rest_framework import serializers

from flight.models import Travel


class TravelSerializer(serializers.ModelSerializer):
    flight_agency = serializers.SerializerMethodField() 
    airport = serializers.SerializerMethodField() 
    airplane = serializers.SerializerMethodField() 

    class Meta:
        model = Travel
        fields = [
            'travel_id',
            'airport',
            'airplane',
            'flight_agency',
            'date_time',
            'price',
            'dest',
            'origin',
            'terminal_no',
            'flight_type',
            'description',
            'flight_class',
            'max_loggage_weight',
            'capacity',
            'seat_stat'
        ]

    def get_flight_agency(self, obj):
        return obj.flight_agency.name

    def get_airport(self, obj):
        return obj.airport.name

    def get_airplane(self, obj):
        return obj.airplane.model
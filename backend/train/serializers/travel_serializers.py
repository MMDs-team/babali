from rest_framework import serializers
from train.models import Travel, RouteEdge
from train.utils import train_time


class TravelSerializer(serializers.ModelSerializer):
    route = serializers.SerializerMethodField() 
    compartment_capacity = serializers.SerializerMethodField()
    empty_compartment = serializers.SerializerMethodField() 
    cooperative = serializers.SerializerMethodField() 
    departure_time = serializers.SerializerMethodField() 
    arrival_time = serializers.SerializerMethodField() 
    star = serializers.SerializerMethodField() 

    class Meta:
        model = Travel
        fields = [
            'travel_id',
            'train',
            'route', 
            'cooperative',
            'compartment_capacity',
            'capacity',
            'description',
            'price',
            'departure_time',
            'arrival_time',
            'empty_compartment',
            'star'
        ]

    def get_route(self, obj):
        cities = []

        edge_ids = set(
            edge_id
            for edge_id in obj.route.edge_identifiers
        )

        edges_qs = RouteEdge.objects.filter(route_edge_id__in=edge_ids)

        edges = {}
        for edge in edges_qs:
            edges[edge.route_edge_id] = edge
        
        for edge_id in obj.route.edge_identifiers:
            cities.append(edges[edge_id].origin_city)
        cities.append(edges[edge_id].dest_city)

        return cities

    def get_compartment_capacity(self, obj):
        return obj.train.compartment_capacity

    def get_departure_time(self, obj):
        origin_city = self.context.get("origin_city")
        departure = train_time(obj, origin_city, True)
        return departure

    def get_arrival_time(self, obj):
        dest_city = self.context.get("dest_city")
        arrival = train_time(obj, dest_city, False)
        return arrival 

    def get_empty_compartment(self, obj):
        next_seat = obj.get_next_seat(full_compartment=True)

        if next_seat == None:
            return False 
        
        return True

    def get_cooperative(self, obj):
        return obj.cooperative.name

    def get_star(self, obj):
        return obj.train.stars

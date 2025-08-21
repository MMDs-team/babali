from train.utils import leave_time
from rest_framework import serializers
from train.models import Travel, RouteEdge


class TravelSerializer(serializers.ModelSerializer):
    route = serializers.SerializerMethodField() 
    leave_time = serializers.SerializerMethodField() 
    empty_compartment = serializers.SerializerMethodField() 

    class Meta:
        model = Travel
        fields = [
            'travel_id',
            'train',
            'route', 
            'cooperative',
            'capacity',
            'description',
            'price',
            'leave_time',
            'empty_compartment'
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

    def get_leave_time(self, obj):
        origin_city = self.context.get("origin_city")

        if origin_city:
            arrival = leave_time(obj, origin_city)
            return arrival if arrival else None
        
        return obj.date_time

    def get_empty_compartment(self, obj):
        next_seat = obj.get_next_seat(full_compartment=True)

        if next_seat == None:
            return False 
        
        return True
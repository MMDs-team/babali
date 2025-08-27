from django_filters import rest_framework as filters
from bus.models import Travel

class TravelFilter(filters.FilterSet):
    id = filters.CharFilter(field_name='travel_id', lookup_expr='exact')
    origin = filters.CharFilter(field_name='origin', lookup_expr='exact')
    destination = filters.CharFilter(field_name='dest', lookup_expr='exact')
    date = filters.DateFilter(field_name='date_time', lookup_expr='date')

    class Meta:
        model = Travel
        fields = ['id', 'origin', 'destination', 'date']
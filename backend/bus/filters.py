from django_filters import rest_framework as filters
from bus.models import Travel

class TravelFilter(filters.FilterSet):
    origin = filters.CharFilter(field_name='origin', lookup_expr='exact')
    destination = filters.CharFilter(field_name='dest', lookup_expr='exact')
    date = filters.DateFilter(field_name='date_time', lookup_expr='date')

    class Meta:
        model = Travel
        fields = ['origin', 'destination', 'date']
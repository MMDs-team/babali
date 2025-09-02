from django_filters import rest_framework as filters
from bus.models import Travel, Ticket

class TravelFilter(filters.FilterSet):
    id = filters.CharFilter(field_name='travel_id', lookup_expr='exact')
    origin = filters.CharFilter(field_name='origin', lookup_expr='exact')
    destination = filters.CharFilter(field_name='dest', lookup_expr='exact')
    date = filters.DateFilter(field_name='date_time', lookup_expr='date')
    serial = filters.CharFilter(field_name='tickets__serial', lookup_expr='exact')

    class Meta:
        model = Travel
        fields = ['id', 'origin', 'destination', 'date', 'serial']

class TicketFilter(filters.FilterSet):
    user = filters.CharFilter(field_name='user__phone', lookup_expr='exact')
    serial = filters.CharFilter(field_name='serial', lookup_expr='exact')

    class Meta:
        model = Ticket
        fields = ['user', 'serial']
from django_filters import rest_framework as filters, FilterSet
from train.models import Travel, RouteEdge, Ticket

class TravelFilter(FilterSet):

    class Meta:
        model = Travel
        fields = []

    def filter_queryset(self, queryset):

        id = self.data.get("id")
        org = self.data.get("origin")
        dest = self.data.get("destination")
        date = self.data.get("date")
        serial = self.data.get("serial")

        if serial:
            travel_ids = set(Ticket.objects.filter(serial=serial).values_list("travel_id", flat=True))

            return Travel.objects.filter(travel_id__in=travel_ids)
        
        else: 
            edge_ids = set(
                edge_id
                for travel in queryset
                for edge_id in travel.route.edge_identifiers
            )

            edges_qs = RouteEdge.objects.filter(route_edge_id__in=edge_ids)

            edges = {}
            for edge in edges_qs:
                edges[edge.route_edge_id] = edge

            travel_ids = []

            for travel in queryset:
                org_pass = dest_pass = False

                curr_time = travel.date_time

                if id:
                    if id == str(travel.travel_id):
                        travel_ids.append(travel.travel_id)
                    break

                for edge_id in travel.route.edge_identifiers:       
                    edge = edges.get(edge_id)

                    if not org or (org.lower() == edge.origin_city.lower() and (not date or date == str(curr_time.date()))):
                        org_pass = True

                    curr_time += edge.duration

                    if org_pass and (not dest or (dest.lower() == edge.dest_city.lower() and (not date or org or date == str(curr_time.date())))):
                        dest_pass = True

                    if org_pass and dest_pass :
                        travel_ids.append(travel.travel_id)
                        break

            return queryset.filter(travel_id__in=travel_ids)
    
class TicketFilter(filters.FilterSet):
    user = filters.CharFilter(field_name='user__phone', lookup_expr='exact')
    serial = filters.CharFilter(field_name='serial', lookup_expr='exact')

    class Meta:
        model = Ticket
        fields = ['user', 'serial']
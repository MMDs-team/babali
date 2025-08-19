import django_filters
from train.models import Travel, RouteEdge


class TravelFilter(django_filters.FilterSet):

    class Meta:
        model = Travel
        fields = []

    def filter_queryset(self, queryset):

        org = self.data.get("origin")
        dest = self.data.get("destination")
        date = self.data.get("date")

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

            arrival_time = travel.date_time

            for edge_id in travel.route.edge_identifiers:       
                edge = edges.get(edge_id)

                if not org or org.lower() == edge.origin_city.lower():
                    org_pass = True

                if not dest or dest.lower() == edge.dest_city.lower():
                    dest_pass = True

                if org_pass and dest_pass and (not date or date == arrival_time.date()):
                    travel_ids.append(travel.travel_id)
                    break

                if org_pass == False:
                    arrival_time += edge.duration

        return queryset.filter(travel_id__in=travel_ids)
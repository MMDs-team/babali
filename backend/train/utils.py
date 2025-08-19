from train.models import RouteEdge

def leave_time(travel, origin_city=None):

    edges_qs = RouteEdge.objects.filter(route_edge_id__in=travel.route.edge_identifiers)

    edges = {}
    for edge in edges_qs:
        edges[edge.route_edge_id] = edge

    current_time = travel.date_time

    for edge_id in travel.route.edge_identifiers:
        edge = edges.get(edge_id)
        if origin_city and edge.origin_city == origin_city:
            return current_time

        current_time += edge.duration

    return None
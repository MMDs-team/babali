from train.models import RouteEdge

def train_time(travel, city, is_origin):

    edges_qs = RouteEdge.objects.filter(route_edge_id__in=travel.route.edge_identifiers)

    if not city and is_origin:
        return travel.date_time

    edges = {}
    for edge in edges_qs:
        edges[edge.route_edge_id] = edge

    current_time = travel.date_time

    for edge_id in travel.route.edge_identifiers:
        edge = edges.get(edge_id)

        if city == edge.origin_city and is_origin == True:
            return current_time

        current_time += edge.duration

        if city == edge.dest_city and is_origin == False:
            return current_time

    if not city and is_origin == False:
        return current_time

    return None
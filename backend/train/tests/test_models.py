import pytest
from datetime import date, datetime, timedelta
from train.models import Cooperative, Train, Route, RouteEdge, Travel, Ticket


@pytest.mark.django_db
@pytest.mark.model
class TestModels:

    def test_cooperative_creation(self, test_data):
        coop = test_data["coop"]
        assert isinstance(coop, Cooperative)
        assert coop.cooperative_id is not None
        assert coop.name == "Cooperative1"
        assert coop.phone == "09123456789"

    def test_train_creation(self, test_data):
        train = test_data["train"]
        assert isinstance(train, Train)
        assert train.train_id is not None
        assert train.stars == 5
        assert train.compartment_capacity == 10
        assert train.compartment_count == 3

    def test_route_creation(self, test_data):
        route = test_data["route"]
        assert isinstance(route, Route)
        assert route.route_id is not None
        assert route.origin_city == "CityA"
        assert route.dest_city == "CityC"
        assert isinstance(route.edge_identifiers, list)
        assert len(route.edge_identifiers) == 2

    def test_route_edge_creation(self, test_data):
        edge1 = test_data["edge1"]
        edge2 = test_data["edge2"]

        assert isinstance(edge1, RouteEdge)
        assert isinstance(edge2, RouteEdge)
        assert edge1.origin_city == "CityA"
        assert edge1.dest_city == "CityB"
        assert edge2.origin_city == "CityB"
        assert edge2.dest_city == "CityC"
        assert isinstance(edge1.duration, timedelta)

    def test_travel_creation_and_capacity(self, test_data):
        travel = test_data["travel"]
        assert isinstance(travel, Travel)
        assert travel.travel_id is not None
        assert travel.train == test_data["train"]
        assert travel.route == test_data["route"]
        assert travel.cooperative == test_data["coop"]

    def test_travel_get_next_seat_empty(self, test_data):
        travel = test_data["travel"]
        assert travel.get_next_seat(full_compartment=False) == 2

    def test_ticket_creation(self, test_data):
        user = test_data["user"]
        travel = test_data["travel"]

        ticket = Ticket.objects.create(
            user=user,
            travel=travel,
            first_name="John",
            last_name="Doe",
            ssn="1234567890",
            birth_date=date(1990, 1, 1),
            gender=True,
            serial=1,
            seat_no=1,
            compartment_no=1,
            get_full_compartment=False,
            status=Ticket.STATUS_PENDING,
            payment_due_datetime=datetime.now() + timedelta(days=1),
            canceled=False
        )

        assert isinstance(ticket, Ticket)
        assert ticket.ticket_id is not None
        assert ticket.user == user
        assert ticket.travel == travel
        assert ticket.first_name == "John"
        assert ticket.last_name == "Doe"
        assert ticket.status == Ticket.STATUS_PENDING
        assert ticket.canceled is False
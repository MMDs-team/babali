import pytest
from datetime import datetime, timedelta
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from train.models import Cooperative, Train, Route, RouteEdge, Travel, Ticket

User = get_user_model()

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def test_data(db):

    user = User.objects.create_user(username="user1", password="pass", phone="09399569132")

    coop = Cooperative.objects.create(
        name="Cooperative1",
        phone="09123456789"
    )

    train = Train.objects.create(
        stars=5,
        compartment_capacity=10,
        compartment_count=3
    )

    edge1 = RouteEdge.objects.create(
        origin_city="CityA",
        dest_city="CityB",
        duration=timedelta(hours=2)
    )
    edge2 = RouteEdge.objects.create(
        origin_city="CityB",
        dest_city="CityC",
        duration=timedelta(hours=3)
    )

    route = Route.objects.create(
        origin_city="CityA",
        dest_city="CityC",
        edge_identifiers=[edge1.route_edge_id, edge2.route_edge_id]
    )

    travel = Travel.objects.create(
        train=train,
        route=route,
        cooperative=coop,
        date_time=datetime.now(),
        price=100,
        seat_stat={"1": {"user_phone": user.phone, "full_com": False}} 
    )

    ticket = Ticket.objects.create(
        first_name="John",
        last_name="Doe",
        ssn="1234567890",
        serial=1,
        user=user,
        travel=travel,
        seat_no=1,
        compartment_no=1,
        status=Ticket.STATUS_ACCEPTED,
        payment_due_datetime=datetime.now() + timedelta(minutes=30),
    )

    return {
        "user": user,
        "coop": coop,
        "train": train,
        "edge1": edge1,
        "edge2": edge2,
        "route": route,
        "travel": travel,
        "ticket": ticket
    }
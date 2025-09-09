import pytest
from datetime import date, datetime, timedelta
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

from flight.models import Agency, Airport, Airplane, Travel, Ticket

User = get_user_model()


@pytest.fixture
def api_client():
    """Returns a DRF APIClient instance for making test requests."""
    return APIClient()


@pytest.fixture
def flight_test_data(db):
    """
    Creates and returns a dictionary of core model instances for the flight app.

    Includes: user, agency, airport, airplane, travel, and ticket.
    """
    user = User.objects.create_user(
        username='testuser',
        password='password123',
        phone='09123456789'
    )

    agency = Agency.objects.create(
        name='Mahan Air',
        phone='09876543210'
    )

    airport = Airport.objects.create(
        name='Imam Khomeini International Airport',
        city='Tehran'
    )

    airplane = Airplane.objects.create(
        model='Boeing 747',
        seat_count=350
    )

    travel = Travel.objects.create(
        airplane=airplane,
        airport=airport,
        flight_agency=agency,
        origin='Tehran',
        dest='Shiraz',
        date_time=datetime.now() + timedelta(days=10),
        price=2500000,
        seat_stat={'1A': {'gender': 'M', 'user_phone': user.phone}}
    )

    ticket = Ticket.objects.create(
        user=user,
        travel=travel,
        first_name='John',
        last_name='Doe',
        ssn='0012345678',
        birth_date=date(1995, 10, 20),
        gender=True, # Assuming True for male
        serial=54321,
        seat_no=22,
        status=Ticket.STATUS_ACCEPTED,
        payment_due_datetime=datetime.now() + timedelta(minutes=30)
    )

    return {
        'user': user,
        'agency': agency,
        'airport': airport,
        'airplane': airplane,
        'travel': travel,
        'ticket': ticket,
    }
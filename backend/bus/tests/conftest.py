import pytest

from datetime import date, datetime, timedelta
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

from bus.models import Cooperative, Terminal, Bus, Travel, Ticket


User = get_user_model()


@pytest.fixture
def api_client():
    '''Returns a DRF APIClient instance for making test requests.'''
    return APIClient()


@pytest.fixture
def bus_test_data(db):
    '''
    Creates and returns a dictionary of core model instances for the bus app.

    Includes: user, cooperative, terminal, bus, travel, and ticket.
    '''
    user = User.objects.create_user(
        username='testuser', 
        password='password123', 
        phone='09123456789'
    )

    coop = Cooperative.objects.create(
        name='Reliable Bus Co.',
        phone='09876543210'
    )

    terminal = Terminal.objects.create(
        name='Central Bus Terminal',
        city='Tehran'
    )
    
    bus = Bus.objects.create(type='vip')

    travel = Travel.objects.create(
        bus=bus,
        terminal=terminal,
        cooperative=coop,
        origin='Tehran',
        dest='Isfahan',
        date_time=datetime.now() + timedelta(days=5),
        price=150000,
        seat_stat={'1': {'gender': 'F', 'user_phone': user.phone}}
    )

    ticket = Ticket.objects.create(
        user=user,
        travel=travel,
        first_name='John',
        last_name='Doe',
        ssn='0012345678',
        birth_date=date(1995, 10, 20),
        gender=True,
        serial=12345,
        seat_no=1,
        status=Ticket.STATUS_ACCEPTED,
        payment_due_datetime=datetime.now() + timedelta(minutes=15)
    )

    return {
        'user': user,
        'cooperative': coop,
        'terminal': terminal,
        'bus': bus,
        'travel': travel,
        'ticket': ticket
    }
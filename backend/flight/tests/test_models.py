import pytest
from datetime import date, datetime

from flight.models import Agency, Airport, Airplane, Travel, Ticket


@pytest.mark.django_db
@pytest.mark.model
class TestFlightModels:
    """Contains unit tests for the flight subsystem's models."""

    def test_agency_creation(self, flight_test_data):
        """Verifies the correct instantiation and attributes of an Agency model."""
        agency = flight_test_data['agency']
        assert isinstance(agency, Agency)
        assert agency.name == 'Mahan Air'
        assert agency.phone == '09876543210'

    def test_airport_creation(self, flight_test_data):
        """Verifies the correct instantiation and attributes of an Airport model."""
        airport = flight_test_data['airport']
        assert isinstance(airport, Airport)
        assert airport.name == 'Imam Khomeini International Airport'
        assert airport.city == 'Tehran'

    def test_airplane_creation(self, flight_test_data):
        """Verifies Airplane creation and its attributes."""
        airplane = flight_test_data['airplane']
        assert isinstance(airplane, Airplane)
        assert airplane.model == 'Boeing 747'
        assert airplane.seat_count == 350

    def test_travel_creation_and_save_logic(self, flight_test_data):
        """Verifies Travel creation and the custom save() method logic for capacity."""
        travel = flight_test_data['travel']
        airplane = flight_test_data['airplane']
        assert isinstance(travel, Travel)
        assert travel.travel_id is not None
        assert travel.airplane == airplane
        assert travel.origin == 'Tehran'
        assert travel.dest == 'Shiraz'
        assert travel.capacity == airplane.seat_count

    def test_ticket_creation(self, flight_test_data):
        """Verifies the correct instantiation and all attributes of a Ticket model."""
        ticket = flight_test_data['ticket']
        user = flight_test_data['user']
        travel = flight_test_data['travel']

        assert isinstance(ticket, Ticket)
        assert ticket.ticket_id is not None
        assert ticket.user == user
        assert ticket.travel == travel
        assert ticket.first_name == 'John'
        assert ticket.last_name == 'Doe'
        assert ticket.ssn == '0012345678'
        assert ticket.birth_date == date(1995, 10, 20)
        assert ticket.gender is True
        assert ticket.serial == 54321
        assert ticket.seat_no == 22
        assert ticket.status == Ticket.STATUS_ACCEPTED
        assert isinstance(ticket.payment_due_datetime, datetime)
        assert ticket.canceled is False
import pytest

from datetime import date, datetime

from bus.models import Cooperative, Terminal, Bus, Travel, Ticket


@pytest.mark.django_db
@pytest.mark.model
class TestBusModels:
    '''Contains unit tests for the bus subsystem's models.'''

    def test_cooperative_creation(self, bus_test_data):
        '''Verifies the correct instantiation and attributes of a Cooperative model.'''
        coop = bus_test_data['cooperative']
        assert isinstance(coop, Cooperative)
        assert coop.name == 'Reliable Bus Co.'
        assert coop.phone == '09876543210'


    def test_terminal_creation(self, bus_test_data):
        '''Verifies the correct instantiation and attributes of a Terminal model.'''
        terminal = bus_test_data['terminal']
        assert isinstance(terminal, Terminal)
        assert terminal.name == 'Central Bus Terminal'
        assert terminal.city == 'Tehran'


    def test_bus_creation_and_save_logic(self, bus_test_data):
        '''Verifies Bus creation and the custom save() method logic for seat_count.'''
        bus = bus_test_data['bus']
        assert isinstance(bus, Bus)
        assert bus.type == 'vip'
        assert bus.seat_count == 25


    def test_travel_creation_and_save_logic(self, bus_test_data):
        '''Verifies Travel creation and the custom save() method logic for capacity.'''
        travel = bus_test_data['travel']
        bus = bus_test_data['bus']
        assert isinstance(travel, Travel)
        assert travel.travel_id is not None
        assert travel.bus == bus
        assert travel.origin == 'Tehran'
        assert travel.dest == 'Isfahan'
        assert travel.capacity == bus.seat_count


    def test_ticket_creation(self, bus_test_data):
        '''Verifies the correct instantiation and all attributes of a Ticket model.'''
        ticket = bus_test_data['ticket']
        user = bus_test_data['user']
        travel = bus_test_data['travel']

        assert isinstance(ticket, Ticket)
        assert ticket.ticket_id is not None
        assert ticket.user == user
        assert ticket.travel == travel
        assert ticket.first_name == 'John'
        assert ticket.last_name == 'Doe'
        assert ticket.ssn == '0012345678'
        assert ticket.birth_date == date(1995, 10, 20)
        assert ticket.gender is True
        assert ticket.serial == 12345
        assert ticket.seat_no == 1
        assert ticket.status == Ticket.STATUS_ACCEPTED
        assert isinstance(ticket.payment_due_datetime, datetime)
        assert ticket.canceled is False
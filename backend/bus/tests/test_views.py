import pytest

from django.urls import reverse
from rest_framework import status

from bus.models import Travel, Ticket


@pytest.mark.django_db
@pytest.mark.api
class TestTravelViewSet:
    '''Contains API tests for the TravelViewSet.'''

    def test_list_travels(self, api_client, bus_test_data):
        '''Ensures that a list of travels can be retrieved.'''
        travel = bus_test_data['travel']
        url = reverse('bus-travel-list')
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 1
        assert response.data[0]['travel_id'] == travel.travel_id


    def test_retrieve_travel(self, api_client, bus_test_data):
        '''Ensures that a single travel can be retrieved by its ID.'''
        travel = bus_test_data['travel']
        url = reverse('bus-travel-detail', args=[travel.travel_id])
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data['travel_id'] == travel.travel_id
        assert response.data['capacity'] == travel.capacity


    @pytest.mark.skip(reason='Not implemented yet.')
    def test_create_travel(self, api_client, bus_test_data):
        '''Ensures that a new travel can be created.'''
        bus = bus_test_data['bus']
        terminal = bus_test_data['terminal']
        cooperative = bus_test_data['cooperative']

        url = reverse('bus-travel-list')
        payload = {
            'bus': bus.bus_id,
            'terminal': terminal.terminal_id,
            'cooperative': cooperative.cooperative_id,
            'price': 200000,
        }

        response = api_client.post(url, payload, format='json')
        
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['price'] == 200000


    @pytest.mark.skip(reason='Not implemented yet.')
    def test_update_travel(self, api_client, bus_test_data):
        '''Ensures that an existing travel's details can be updated.'''
        travel = bus_test_data['travel']
        url = reverse('bus-travel-detail', args=[travel.travel_id])
        payload = {
            'price': 250000,
        }
        response = api_client.patch(url, payload, format='json')

        assert response.status_code == status.HTTP_200_OK
        travel.refresh_from_db()
        assert travel.price == 250000


    @pytest.mark.skip(reason='Not implemented yet.')
    def test_delete_travel(self, api_client, bus_test_data):
        '''Ensures that a travel can be deleted.'''
        travel = bus_test_data['travel']
        url = reverse('bus-travel-detail', args=[travel.travel_id])
        response = api_client.delete(url)

        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert Travel.objects.count() == 0


@pytest.mark.django_db
@pytest.mark.api
class TestTicketViewSet:
    '''Contains API tests for the TicketViewSet.'''

    def test_list_tickets(self, api_client, bus_test_data):
        '''Ensures that a list of tickets can be retrieved.'''
        ticket = bus_test_data['ticket']
        url = reverse('bus-ticket-list')
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 1
        assert response.data[0]['serial'] == ticket.serial


    def test_retrieve_ticket(self, api_client, bus_test_data):
        '''Ensures that a single ticket can be retrieved by its ID.'''
        ticket = bus_test_data['ticket']
        url = reverse('bus-ticket-detail', args=[ticket.ticket_id])
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data['serial'] == ticket.serial
        assert response.data['seat_no'] == ticket.seat_no


    @pytest.mark.skip(reason='Not implemented yet.')
    def test_create_ticket(self, api_client, bus_test_data):
        '''Ensures one or more tickets can be created for a travel.'''
        travel = bus_test_data['travel']
        user = bus_test_data['user']

        url = reverse('bus-ticket-bulk-create')
        payload = {
            'tickets': [
                {
                    'first_name': 'Alice',
                    'last_name': 'Smith',
                    'ssn': '9876543210',
                    'user': user.phone,
                    'travel': travel.travel_id
                }
            ]
        }
        response = api_client.post(url, payload, format='json')

        assert response.status_code == status.HTTP_201_CREATED
        assert len(response.data) == 1
        assert response.data[0]['first_name'] == 'Alice'
        assert response.data[0]['seat_no'] is not None


    def test_verify_ticket(self, api_client, bus_test_data):
        '''Ensures a ticket's status can be updated via a verify action.'''
        ticket = bus_test_data['ticket']
        ticket.status = Ticket.STATUS_PENDING
        ticket.save()
        
        url = reverse('bus-ticket-verify') + f'?serial={ticket.serial}&status=OK'
        response = api_client.patch(url)

        assert response.status_code == status.HTTP_200_OK
        ticket.refresh_from_db()
        assert ticket.status == Ticket.STATUS_ACCEPTED


    def test_cancel_ticket(self, api_client, bus_test_data):
        '''Ensures a ticket can be canceled via a cancel action.'''
        ticket = bus_test_data['ticket']
        url = reverse('bus-ticket-cancel')
        payload = {'serial': ticket.serial}

        response = api_client.patch(url, data=payload, format='json')
        
        assert response.status_code == status.HTTP_200_OK
        ticket.refresh_from_db()
        assert ticket.canceled is True


    @pytest.mark.skip('Not finished yet.')
    def test_print_ticket(self, api_client, bus_test_data):
        '''Ensures a ticket can be printed (or a print request initiated).'''
        ticket = bus_test_data['ticket']
        url = reverse('bus-ticket-print')
        payload = {'serial': ticket.serial}

        response = api_client.post(url, payload, format='json')
        print(response.json())
        
        assert response.status_code == status.HTTP_201_CREATED
import pytest
from django.urls import reverse
from rest_framework import status
from train.models import Travel, Ticket


@pytest.mark.django_db
@pytest.mark.travel
class TestTravelViewSet:

    def test_list_travels(self, api_client, test_data):
        travel = test_data["travel"]
        url = reverse("train-travel-list")
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 1
        assert response.data[0]["travel_id"] == travel.travel_id

    def test_retrieve_travel(self, api_client, test_data):
        travel = test_data["travel"]
        url = reverse("train-travel-detail", args=[travel.travel_id])
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data["travel_id"] == travel.travel_id
        assert response.data["capacity"] == travel.capacity

    @pytest.mark.skip(reason="not implemented yet")
    def test_create_travel(self, api_client, test_data):
        train = test_data["train"]
        route = test_data["route"]
        cooperative = test_data["coop"]

        url = reverse("train-travel-list")
        payload = {
            "train": train.train_id,
            "route": route.route_id,
            "cooperative": cooperative.cooperative_id,
            "capacity": 50,
        }

        response = api_client.post(url, payload, format="json")
        travel_data = response.data

        assert response.status_code == status.HTTP_201_CREATED
        assert travel_data['capacity'] == 50

    @pytest.mark.skip(reason="not implemented yet")
    def test_update_travel(self, api_client, test_data):
        travel = test_data["travel"]
        url = reverse("train-travel-detail", args=[travel.travel_id])
        payload = {
            "travel_id": travel.travel_id,
            "route": travel.route.route_id,
            "train": travel.train.train_id,
            "capacity": 200,
        }
        response = api_client.put(url, payload, format="json")

        assert response.status_code == status.HTTP_200_OK
        travel.refresh_from_db()
        assert travel.capacity == 200

    @pytest.mark.skip(reason="not implemented yet")
    def test_delete_travel(self, api_client, test_data):
        travel = test_data["travel"]
        url = reverse("train-travel-detail", args=[travel.travel_id])
        response = api_client.delete(url)

        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert Travel.objects.count() == 0


@pytest.mark.django_db
@pytest.mark.ticket
class TestTicketViewSet:

    def test_list_tickets(self, api_client, test_data):
        ticket = test_data["ticket"]
        url = reverse("train-ticket-list")
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 1
        assert response.data[0]["serial"] == ticket.serial

    def test_retrieve_ticket(self, api_client, test_data):
        ticket = test_data["ticket"]
        url = reverse("train-ticket-detail", args=[ticket.ticket_id])
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data["serial"] == ticket.serial
        assert response.data["seat_no"] == ticket.seat_no

    @pytest.mark.skip(reason="not implemented yet")
    def test_create_ticket(self, api_client, test_data):
        travel = test_data["travel"]
        user = test_data["user"]

        url = reverse("train-ticket-bulk-create")
        payload = {
            "tickets": [
                {
                    "first_name": "Alice",
                    "last_name": "Smith",
                    "ssn": "9876543210",
                    "user": user.phone,
                    "travel": travel.travel_id
                }
            ],
            "get_full_com": False
        }

        response = api_client.post(url, payload, format="json")
        data = response.data

        assert response.status_code == status.HTTP_201_CREATED
        assert len(data) == 1
        assert data[0]["first_name"] == "Alice"
        assert data[0]["seat_no"] is not None

    def test_verify_ticket(self, api_client, test_data):
        ticket = test_data["ticket"]
        url = reverse("train-ticket-verify") + f"?serial={ticket.serial}&status=OK"

        response = api_client.patch(url)
        assert response.status_code == status.HTTP_200_OK

        ticket.refresh_from_db()
        assert ticket.status == Ticket.STATUS_ACCEPTED

    def test_cancel_ticket(self, api_client, test_data):
        ticket = test_data["ticket"]
        url = reverse("train-ticket-cancel")
        payload = {"serial": ticket.serial}

        response = api_client.patch(url, data=payload, format="json")
        assert response.status_code == status.HTTP_200_OK
        ticket.refresh_from_db()
        assert ticket.canceled is True

    @pytest.mark.skip('Not finished yet.')
    def test_print_ticket(self, api_client, test_data):
        ticket = test_data["ticket"]
        url = reverse("train-ticket-print")
        payload = {"serial": ticket.serial}

        response = api_client.post(url, payload, format="json")
        assert response.status_code == status.HTTP_201_CREATED
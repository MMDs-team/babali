from rest_framework.mixins import ListModelMixin, RetrieveModelMixin
from rest_framework.viewsets import GenericViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import viewsets, status

from flight.serializers.travel_serializers import TravelSerializer
from flight.models import Travel
from flight.filters import TravelFilter

from django_filters.rest_framework import DjangoFilterBackend


class TravelViewSet(ListModelMixin, RetrieveModelMixin, GenericViewSet):
    queryset = Travel.objects.all()
    serializer_class = TravelSerializer

    filter_backends = [DjangoFilterBackend]
    filterset_class = TravelFilter
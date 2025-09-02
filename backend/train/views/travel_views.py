from rest_framework.mixins import ListModelMixin, RetrieveModelMixin
from rest_framework.viewsets import GenericViewSet

from train.serializers.travel_serializers import TravelSerializer
from train.models import Travel
from train.filters import TravelFilter

from django_filters.rest_framework import DjangoFilterBackend


class TravelViewSet(ListModelMixin, RetrieveModelMixin, GenericViewSet):
    queryset = Travel.objects.all()
    serializer_class = TravelSerializer

    filter_backends = [DjangoFilterBackend]
    filterset_class = TravelFilter

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["origin_city"] = self.request.query_params.get("origin")
        context["dest_city"] = self.request.query_params.get("destination")
        return context
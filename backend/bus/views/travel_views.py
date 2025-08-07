from rest_framework.mixins import ListModelMixin, RetrieveModelMixin
from rest_framework.viewsets import GenericViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import viewsets, status

from bus.serializers.travel_serializers import TravelSerializer
from bus.models import Travel

from django_filters.rest_framework import DjangoFilterBackend
from django_filters import rest_framework as filters


class TravelFilter(filters.FilterSet):
    origin = filters.CharFilter(field_name='origin', lookup_expr='exact')
    destination = filters.CharFilter(field_name='dest', lookup_expr='exact')
    date = filters.DateFilter(field_name='date_time', lookup_expr='date')

    class Meta:
        model = Travel
        fields = ['origin', 'destination', 'date']


class TravelViewSet(ListModelMixin, RetrieveModelMixin, GenericViewSet):
    queryset = Travel.objects.all()
    serializer_class = TravelSerializer

    filter_backends = [DjangoFilterBackend]
    filterset_class = TravelFilter

    @action(detail=False, methods=['get'])
    def available(self, request):
        
        origin_city = request.GET.get("origin")
        dest_city = request.GET.get("destination")
        date = request.GET.get("date")

        try:
            travels = Travel.objects.filter(
                origin=origin_city,
                dest=dest_city,
                date_time__date=date
            ).order_by('date_time')

            serializer = TravelSerializer(travels, many=True)
            return Response(serializer.data)

        except Exception as error:
            return Response(
                {'error': str(error)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
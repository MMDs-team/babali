from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status


from bus.models import *
from bus.serializers.travel_serializers import *

@api_view(['GET'])
def get_available_travels(request):

    origin_city = request.GET.get("originCity")
    dest_city = request.GET.get("destinationCity")
    date = request.GET.get("date")

    try:
        travels = Travel.objects.all().filter(origin=origin_city, dest=dest_city, date_time__date=date).order_by('date_time')
        serializers = TravelSerializer(travels, many=True)

        return Response(serializers.data)

    except Exception as error:
        return Response(
            {'error': str(error)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
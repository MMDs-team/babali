from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from printer.utils import GENERATOR
from printer.consts import TICKET_TYPES, TEMPLATE_NAMES, PLACEHOLDER_MAPS

from django.http import FileResponse, Http404
from django.conf import settings
from urllib.parse import unquote
import os


@api_view(['POST'])
def generate_ticket(request):
    data = request.data
    mandatory_fields = ['tickets_type', 'tickets_data', 'output_name']
    for field in mandatory_fields:
        if field not in data:
            return Response({'error': f'Mandatory field {field} is missing.'}, status=status.HTTP_400_BAD_REQUEST)

    tickets_type = data['tickets_type']
    tickets_data = data['tickets_data']
    output_name = data['output_name']
    if tickets_type not in TICKET_TYPES:
        return Response({'error': 'Invalid ticket type.'}, status=status.HTTP_400_BAD_REQUEST)

    if not tickets_data:
        return Response({'error': 'There is no valid ticket to print'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    
    try:
        tickets_pdf_path = GENERATOR.generate_tickets_pdf(tickets_template_name=TEMPLATE_NAMES[tickets_type], 
                                                          placeholders_map=PLACEHOLDER_MAPS[tickets_type], 
                                                          tickets_data=tickets_data,
                                                          tickets_type=TICKET_TYPES[tickets_type],
                                                          output_name=output_name)
        
        return Response({'path': tickets_pdf_path}, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def download_ticket(request):
    file_param = request.GET.get("path")
    if not file_param:
        raise Http404("File parameter is required")

    file_param = unquote(file_param)
    BASE_DIR = settings.BASE_DIR
    file_path = os.path.join(BASE_DIR, file_param)

    if not os.path.exists(file_path):
        raise Http404("File does not exist")

    file_handle = open(file_path, "rb")
    return FileResponse(file_handle, as_attachment=True, filename=os.path.basename(file_path))

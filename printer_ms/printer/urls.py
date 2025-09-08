from django.urls import path

from printer.views import generate_tickets_pdf

urlpatterns = [
    path('', generate_tickets_pdf, name='generate_tickets_pdf')
]
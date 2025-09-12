from django.urls import path

import printer.views as views

urlpatterns = [
    path('generate_ticket', views.generate_ticket, name='generate_ticket'),
    path('download_ticket', views.download_ticket, name='download_ticket')
]
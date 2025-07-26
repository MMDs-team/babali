from django.urls import path
from rest_framework.routers import DefaultRouter

from bus.views import ticket_views, travel_views


router = DefaultRouter()
router.register('tickets', ticket_views.TicketViewSet)

urlpatterns = [
    path('available/', travel_views.get_available_travels, name='get_available_travels'),
] + router.urls
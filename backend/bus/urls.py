from django.urls import path
from rest_framework.routers import DefaultRouter

from bus.views import ticket_views, travel_views


router = DefaultRouter()
router.register('tickets', ticket_views.TicketViewSet)
router.register('travels', travel_views.TravelViewSet)

urlpatterns = router.urls
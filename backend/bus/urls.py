from django.urls import path
import bus.views as views

urlpatterns = [
    path('available/', views.get_available_travels, name='get_available_travels'),
]
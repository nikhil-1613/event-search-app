# api/urls.py

from django.urls import path
from .views import search_events

urlpatterns = [
    path('search/', search_events),
]

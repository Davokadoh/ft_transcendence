# urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet, test

router = DefaultRouter()
router.register(r'player_data', TaskViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('player/<str:nickname>', test, name="player"),
]
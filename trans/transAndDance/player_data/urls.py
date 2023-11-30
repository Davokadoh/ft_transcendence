from django.urls import path
from . import views

urlpatterns = [
    path('player_data/', views.player_data, name='player_data'),
]
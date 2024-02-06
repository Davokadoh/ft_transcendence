from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("accounts/login/", views.loginview, name="loginview"),
    path("accounts/callback/", views.callback, name="callback"),
    path("accounts/profil/", views.profil, name="profil"),
    path("home/", views.home, name="home"),
    path("chat/", views.chat, name="chat"),
    path("play/", views.play, name="play"),
    path("profil/", views.profil, name="profil"),
    path('profil/username/', views.username, name='username'),
    path("lobby/", views.lobby),
    path("lobby/<int:game_id>/", views.lobby),
    path("game/<int:game_id>/", views.game),
]

from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login, name="login"),
    path("callback", views.callback, name="callback"),
    path("home", views.home, name="home"),
    path("game", views.game, name="game"),
    path("chat", views.chat, name="chat"),
    path("profil", views.profil, name="profil"),
]

from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("home", views.home, name="home"),
    path("game", views.game, name="game"),
    path("login", views.login, name="login"),
    path("callback", views.callback, name="callback"),
    path("user", views.user, name="user"),
    path("user/<int:num>", views.user, name="user"),
]

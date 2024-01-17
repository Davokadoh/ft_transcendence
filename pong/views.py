from .backend import CustomAuthenticationBackend
from django.contrib.auth.decorators import login_required
from django.shortcuts import render


def index(request):
    return render(request, "index.html")


def login(request):
    if request.method == "GET":
        return render(request, "login.html")
    elif request.method == "POST":
        return CustomAuthenticationBackend.authenticate(request)


def callback(request):
    return CustomAuthenticationBackend.callback(request)


def home(request):
    return render(request, "home.html")


@login_required
def game(request):
    return render(request, "game.html")


@login_required
def chat(request):
    return render(request, "chat.html")


@login_required
def profil(request):
    return render(request, "profil.html")

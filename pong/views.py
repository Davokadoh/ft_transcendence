# from .backend import CustomAuthenticationBackend
from django.shortcuts import render
import os


def index(request):
    cwd = os.listdir("ftt")
    print(cwd)
    return render(request, "index.html")


def login(request):
    return render(request, "index.html")
    # return CustomAuthenticationBackend.authenticate(request)


def callback(self, request):
    return render(request, "index.html")
    # return CustomAuthenticationBackend.callback(request)


def home(request):
    return render(request, "home.html")


def game(request):
    return render(request, "game.html")


def chat(request):
    return render(request, "chat.html")


def profil(request):
    return render(request, "profil.html")

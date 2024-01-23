from django.http import Http404
from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect, render
from django.contrib.auth import login
from .backend import CustomAuthenticationBackend
from .models import User, Game
from dotenv import load_dotenv
import requests
import os


def index(request):
    return render(request, "index.html")


def loginview(request):
    token = request.headers.get("Authorization")
    if request.user.is_authenticated:
        redirect("/home")
    if request.method == "GET":
        return render(request, "login.html")
    elif request.method == "POST":
        user = CustomAuthenticationBackend.authenticate(request, token)
        if user is not None:
            next = request.POST.get("next")
            return redirect("/home" if next is None else next)
        else:
            load_dotenv()
            state = os.urandom(42)
            auth_url = "{}/oauth/authorize?client_id={}&redirect_uri={}&scope={}&state={}&response_type=code".format(
                os.getenv("OAUTH_URL"),
                os.getenv("OAUTH_ID"),
                "http://localhost:8000/accounts/callback/",
                "public",
                123,  # state
            )
            return redirect(auth_url)


def callback(request):
    code = request.GET.get("code")
    state = request.GET.get("state")
    response = requests.post(
        "{}{}".format(os.getenv("OAUTH_URL"), "/oauth/access_token/"),
        data={
            "grant_type": "authorization_code",
            "client_id": os.getenv("OAUTH_ID"),
            "client_secret": os.getenv("OAUTH_SECRET"),
            "code": code,
            "redirect_uri": "http://localhost:8000/accounts/callback/",
            "state": state,
        },
        headers={"Accept": "application/json"},
    )
    if not response.ok:
        raise Http404("Status code is: " + response.status_code)
    access_token = response.json()["access_token"]
    response = requests.get(
        os.getenv("OAUTH_USER_URL"),
        headers={"Authorization": "Bearer " + access_token},
    )

    try:
        user = User.objects.get(username=response.json()["login"])
    except User.DoesNotExist:
        user = User.objects.create_user(username=response.json()["login"])
        print("USER CREATED")
        user.save()

    user.access_token = access_token
    login(request, user)
    return render(request, "callback.html", {"access_token": access_token})


def home(request):
    return render(request, "home.html")


@login_required
def play(request):
    return render(request, "play.html")


@login_required
def new_lobby(request):
    game = Game.objects.create()
    game.add_team()
    game.add_player(request.user)
    return redirect("/lobby/" + str(game.id))


@login_required
def lobby(request, game_id):
    game = Game.objects.get(pk=game_id)
    context = {"game_id": game_id}
    if request.method == "GET":
        return render(request, "lobby.html", context)
    elif request.method == "POST":
        added_player = request.POST.get("player")
        if added_player is not None:
            game.add_player(added_player)


@login_required
def game(request, game_id):
    game = Game.objects.get(pk=game_id)
    return render(request, "game.html")


@login_required
def chat(request):
    return render(request, "chat.html")


@login_required
def profil(request):
    return render(request, "profil.html")

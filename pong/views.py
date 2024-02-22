import json
from django.http import Http404, HttpResponse, HttpResponseBadRequest
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404, redirect, render
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth import login, logout
from django.http import JsonResponse
from django.contrib import messages
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.core.serializers import serialize
from ftt.settings import STATIC_URL
from .backend import CustomAuthenticationBackend
from .models import GameTeam, Tournament, User, Team, Game
from .forms import ProfilPictureForm, UsernameForm
from dotenv import load_dotenv
import requests
import json
import os


def index(request, page_name=None):
    return render(request, "index.html", page_name)


@login_required
def home(request):
    ajax = request.headers.get("X-Requested-With") == "XMLHttpRequest"
    return render(
        request, "home.html", {
            "template": "ajax.html" if ajax else "index.html"}
    )


@login_required
def play(request):
    ajax = request.headers.get("X-Requested-With") == "XMLHttpRequest"
    return render(
        request, "play.html", {
            "template": "ajax.html" if ajax else "index.html"}
    )


@login_required
def profil(request):
    username_form = UsernameForm(instance=request.user)
    profil_picture_form = ProfilPictureForm(instance=request.user)
    ajax = request.headers.get("X-Requested-With") == "XMLHttpRequest"
    if request.user.profil_picture:
        profil_picture_url = request.user.profil_picture.url
    elif request.user.profil_picture_oauth:
        profil_picture_url = request.user.profil_picture_oauth
    else:
        profil_picture_url = STATIC_URL("img/ajouter-une-image.png")
    return render(
        request,
        "profil.html",
        {
            "template": "ajax.html" if ajax else "index.html",
            "profil_picture_url": profil_picture_url,
            "profil_picture_form": profil_picture_form,
            "username_form": username_form,
        },
    )

@login_required
def user(request, username=None):
    try:
        user = User.objects.get(username=username)
    except ObjectDoesNotExist:
        ajax = request.headers.get("X-Requested-With") == "XMLHttpRequest"
        return render(
            request, "error.html", {
                "template": "ajax.html" if ajax else "index.html"}
            )

    if user.profil_picture:
        profil_picture_url = request.user.profil_picture.url
    elif user.profil_picture_oauth:
        profil_picture_url = request.user.profil_picture_oauth
    else:
        profil_picture_url = "/static/img/profil/image-defaut.png"

    ajax = request.headers.get("X-Requested-With") == "XMLHttpRequest"
    
    context = {
        'messages': messages.get_messages(request),
        "template": "ajax.html" if ajax else "index.html",
        "user": user,
        "profil_picture_url": profil_picture_url
    }
    return render(request, "user.html", context)


# def profil(request):
#     print("URL: " + request.user.profilPictureUrl)
#     user_profile, created = User.objects.get_or_create(user=request.user)
#     if request.method == 'POST':
#         # Suppose que vous avez un formulaire pour ajuster la vitesse des paddles
#         paddle_speed = request.POST.get('paddle_speed')
#         user_profile.paddle_speed = paddle_speed
#         user_profile.save()
#     ajax = request.headers.get("X-Requested-With") == "XMLHttpRequest"
#     return render(
#         request, "profil.html", {"template": "ajax.html" if ajax else "index.html"}
#     )


@login_required
def username(request):
    if request.method == "GET":
        return JsonResponse({"username": request.user.username})
    elif request.method == "POST":
        form = UsernameForm(request.POST, instance=request.user)
        if form.is_valid():
            print(form.cleaned_data)
            form.save()
            return JsonResponse({"message": "Username updated successfully"})
        else:
            return JsonResponse({"error": "New username is required"}, status=400)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=405)


@login_required
def profilPicture(request):
    if request.method == "POST":
        form = ProfilPictureForm(
            request.POST, request.FILES, instance=request.user)
        if form.is_valid():
            form.save()
            return HttpResponse()
        else:
            return HttpResponseBadRequest()


@login_required
def chat(request):
    ajax = request.headers.get("X-Requested-With") == "XMLHttpRequest"
    if request.path == "/chat/chat-tmp/":
        return render(request, "chat-tmp.html")
    else:
        return render(
            request, "chat.html", {
                "template": "ajax.html" if ajax else "index.html"}
        )


@login_required
def lobby(request, game_id=None, invitedPlayer2=None):
    if game_id is None:
        game = Game.objects.create()
        team = Team.objects.create()
        team.save()
        team.users.add(request.user)
        gt = GameTeam(game=game, team=team)
        gt.save()
        return redirect(lobby, game.pk)
    game = get_object_or_404(Game, pk=game_id)
    ajax = request.headers.get("X-Requested-With") == "XMLHttpRequest"
    if request.method == "GET":
        return render(
            request,
            "lobby.html",
            {"template": "ajax.html" if ajax else "index.html", "invitedPlayer2": invitedPlayer2},
        )
    elif request.method == "POST":
        try:
            data = json.loads(request.body)
            user = User.objects.get(username=data.get("username"))
            if (user is None):
                    return JsonResponse({"error_message": "user not found"})
            return JsonResponse({"username": user.username})
        except ObjectDoesNotExist:
            return JsonResponse({"error_message": "Missing valid player 2 username"})

@login_required
def game(request, game_id=None):
    if game_id is None:
        return redirect(home)
    game = Game.objects.get(pk=game_id)
    if game is None:
        return redirect(home)
    ajax = request.headers.get("X-Requested-With") == "XMLHttpRequest"
    return render(
        request,
        "game.html",
        {"template": "ajax.html" if ajax else "index.html", "game_id": game_id},
    )

@login_required
def remLobby(request, remote_id=None, invitedPlayer2=None):
    if remote_id is None:
        game = Game.objects.create()
        team = Team.objects.create()
        team.save()
        team.users.add(request.user)
        gt = GameTeam(game=game, team=team)
        gt.save()
        return redirect(remLobby, game.pk)
    game = get_object_or_404(Game, pk=remote_id)
    ajax = request.headers.get("X-Requested-With") == "XMLHttpRequest"
    if request.method == "GET":
        return render(
            request,
            "remLobby.html",
            {"template": "ajax.html" if ajax else "index.html", "invitedPlayer2": invitedPlayer2},
        )
    elif request.method == "POST":
        try:
            data = json.loads(request.body)
            user = User.objects.get(username=data.get("username"))
            if (user is None):
                    return JsonResponse({"error_message": "user not found"})
            return JsonResponse({"username": user.username})
        except ObjectDoesNotExist:
            return JsonResponse({"error_message": "Missing valid player 2 username"})


@login_required
def remote(request, remote_id=None):
    if remote_id is None:
        return redirect(home)
    remote = Remote.objects.get(pk=remote_id)
    if remote is None:
        return redirect(home)
    ajax = request.headers.get("X-Requested-With") == "XMLHttpRequest"
    return render(
        request,
        "remote.html",
        {
            "template": "ajax.html" if ajax else "index.html",
            "remote_id": remote_id,
        },
    )

@login_required
def tourLobby(request, tournament_id=None):
    if tournament_id is None:
        game = Game.objects.create()
        team = Team.objects.create()
        team.save()
        team.users.add(request.user)
        gt = GameTeam(game=game, team=team)
        gt.save()
        return redirect(tourLobby, game.pk)
    game = get_object_or_404(Game, pk=tournament_id)
    ajax = request.headers.get("X-Requested-With") == "XMLHttpRequest"
    if request.method == "GET":
        return render(
            request,
            "tourLobby.html",
            {
                "template": "ajax.html" if ajax else "index.html",
                "tournament_id": tournament_id,
            },
        )
    elif request.method == "POST":
        try:
            game.teams[request.POST["team"]].add_player(
                request.POST["invited_player"])
        except (KeyError, Team.DoesNotExist, User.DoesNotExist):
            return render(
                request,
                "tourLobby.html",
                {
                    "template": "ajax.html" if ajax else "index.html",
                    "tournament_id": tournament_id,
                    "error_message": "Missing valid team name or user name",
                },
            )


@login_required
def tournament(request, tournament_id=None):
    if tournament_id is None:
        return redirect(home)
    tournament = Tournament.objects.get(pk=tournament_id)
    if tournament is None:
        return redirect(home)
    ajax = request.headers.get("X-Requested-With") == "XMLHttpRequest"
    return render(
        request,
        "tournament.html",
        {
            "template": "ajax.html" if ajax else "index.html",
            "tournament_id": tournament_id,
        },
    )


def logoutview(request):
    logout(request)
    return loginview(request)


def logoutview(request):
    logout(request)
    return loginview(request)


def loginview(request):
    token = request.headers.get("Authorization")
    if request.user.is_authenticated:
        redirect("/home")
    if request.method == "GET":
        ajax = request.headers.get("X-Requested-With") == "XMLHttpRequest"
        return render(
            request,
            "login.html",
            {"template": "ajax.html" if ajax else "index.html"},
        )
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
                requests.utils.quote(
                    "http://localhost:8000/accounts/callback/"),
                "public",
                123,  # state
            )
            return redirect(auth_url)


def callback(request):
    code = request.GET.get("code")
    state = request.GET.get("state")
    response = requests.post(
        "{}{}".format(os.getenv("OAUTH_URL"), os.getenv("OAUTH_TOKEN_URL")),
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
        raise Http404("Status code is: " + str(response.status_code))
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
        try:
            user.profilPictureUrl = response.json()["image"]["link"]
        except KeyError:
            user.profil_picture_oauth = "https://github.com/{}.png".format(
                user.username
            )
        user.save()

    user.access_token = access_token
    login(request, user)
    # return render(request, "callback.html", {"access_token": access_token})
    return redirect(home)


def get_user_info(request, username):
    if request.method == 'GET':
        # username = request.GET.get('username')
        # username = request.GET.get('profil_picture')
        print('username GET =', username)
        try:
            user = User.objects.get(username=username)
            user_info = {
                'username': user.username,
                'nickname': user.nickname,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'profil_picture': '/static/img/triste.png'
                # 'profil_picture': user.profil_picture.url if user.profil_picture else user.profil_picture_oauth,
            }
            return JsonResponse(user_info)
        except User.DoesNotExist:
            return JsonResponse({'error': 'Utilisateur non trouvé'}, status=404)
    elif request.method == 'POST':  # condition pour gérer les requêtes GET
        return JsonResponse({'error': 'Méthode non autorisée'}, status=405)

    # TEST AVEC FAUX USERS


def create_fake_user(request):
    # Créer un faux utilisateur
    fake_user = User.objects.create_user(
        username='user123', email='user123@example.com', password='password123', profil_picture=STATIC_URL('./img/profil/image-defaut.png'))
    fake_user.first_name = 'John'
    fake_user.last_name = 'Doe'
    # fake_user.profil_picture = '../img/profil/image-defaut.png'
    fake_user.save()

    # Renvoyer les informations de l'utilisateur créé
    user_info = {
        'username': fake_user.username,
        'first_name': fake_user.first_name,
        'last_name': fake_user.last_name,
        'email': fake_user.email,
        'profil_picture': 'img/profil/image-defaut.png',
    }
    return JsonResponse(user_info)


@csrf_exempt
def get_users(request):
    if request.method == "GET":
        users = User.objects.all()
        # users = serialize("json", users)
        # users = json.loads(users)
    try:
        user_list = []
        for user in users:
            user_info = {
                "username": user.username,
                "profil_picture": user.profil_picture_oauth,
                # add other field if necessary
            }
            user_list.append(user_info)

        context = {"user_list": user_list}
        return JsonResponse(context, safe=False)
    except User.DoesNotExist:
        return JsonResponse({"error": "User not found"}, status=404)


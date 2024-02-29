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
from django.utils import timezone
from ftt.settings import STATIC_URL
from .backend import CustomAuthenticationBackend
from .models import GameTeam, Tournament, User, Team, Game, Remote
from .forms import ProfilPictureForm, UsernameForm
from dotenv import load_dotenv
import requests
import json
import os
import base64


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
    # settings_form = ProfilSettingsForm(instance=request.user)

    # Calcul des statistiques du joueur
    user_teams = Team.objects.filter(users=request.user)
    games = Game.objects.filter(teams__in=user_teams)
    matches_played = games.count()
    # wins = games.filter(result='win').count()
    wins = games.filter(winner=request.user).count()
    win_ratio = round((wins / matches_played) * 100, 2) if matches_played > 0 else 0

    matches = Game.objects.filter(teams__in=user_teams)

    ajax = request.headers.get("X-Requested-With") == "XMLHttpRequest"
    if request.user.profil_picture:
        profil_picture_url = request.user.profil_picture.url
    elif request.user.profil_picture_oauth:
        profil_picture_url = request.user.profil_picture_oauth
    else:
        profil_picture_url = STATIC_URL("img/profil/image-defaut.png")
    return render(
        request,
        "profil.html",
        {
            "template": "ajax.html" if ajax else "index.html",
            "profil_picture_url": profil_picture_url,
            "profil_picture_form": profil_picture_form,
            "username_form": username_form,
            "matches_played": matches_played,
            "wins": wins,
            "win_ratio": win_ratio,
            "matches": matches,
            # "game_list": Game.objects.filter(players_contains=request.user),
            # "settings_form": settings_form,
        },
    )

def temp(request):
    user_teams = Team.objects.filter(users=request.user)
    games = Game.objects.filter(teams__in=user_teams)
    return JsonResponse(list(games.values()), safe=False)

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
        profil_picture_url = user.profil_picture.url
    elif user.profil_picture_oauth:
        profil_picture_url = user.profil_picture_oauth
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
def lobby(request, gameId=None, invitedPlayer2=None):
    if gameId is None:
        game = Game.objects.create(
            start_time=timezone.now(),  # Utilisez le module timezone pour obtenir l'heure actuelle
            # Récupérez le style à partir des données POST
            # style=request.POST.get('style', ''),
            style="Quick Play",
            # Récupérez l'opposant à partir des données POST
            opponent=request.POST.get('player2', ''),
            # Récupérez le score à partir des données POST, par défaut 0
            score=request.POST.get('scoreText', 0),
            # Récupérez le résultat à partir des données POST
        )
        team = Team.objects.create()
        team.save()
        team.users.add(request.user)
        gt = GameTeam(game=game, team=team)
        gt.save()
        return redirect(lobby, game.pk)
    game = get_object_or_404(Game, pk=gameId)
    ajax = request.headers.get("X-Requested-With") == "XMLHttpRequest"
    if request.method == "GET":
        return render(
            request,
            "lobby.html",
            {"template": "ajax.html" if ajax else "index.html",
                "gameId": gameId, "invitedPlayer2": invitedPlayer2},
        )
    elif request.method == "POST":
        try:
            data = json.loads(request.body)
            username = data.get("username")
            user = User.objects.get(username=username)
            if (user is None):
                return JsonResponse({"error_message": "user not found"})
            team2 = Team.objects.create()
            team2.save()
            team2.users.add(user)
            gt = GameTeam(game=game, team=team2)
            gt.save()
            return JsonResponse({"username": user.username})
        except ObjectDoesNotExist:
            return JsonResponse({"error_message": "Missing valid player username"})


@login_required
def game(request, gameId=None):
    if gameId is None:
        return redirect(home)
    game = Game.objects.get(pk=gameId)
    if game is None:
        return redirect(home)
    ajax = request.headers.get("X-Requested-With") == "XMLHttpRequest"
    return render(
        request,
        "game.html",
        {"template": "ajax.html" if ajax else "index.html", "gameId": gameId},
    )


@login_required
def remLobby(request, remoteId=None, invitedPlayer2=None):
    if remoteId is None:
        game = Game.objects.create()
        team = Team.objects.create()
        team.save()
        team.users.add(request.user)
        gt = GameTeam(game=game, team=team)
        gt.save()
        return redirect(lobby, game.pk)
    game = get_object_or_404(Game, pk=remoteId)
    ajax = request.headers.get("X-Requested-With") == "XMLHttpRequest"
    if request.method == "GET":
        return render(
            request,
            "remLobby.html",
            {"template": "ajax.html" if ajax else "index.html",
                "remoteId": remoteId, "invitedPlayer2": invitedPlayer2},
        )
    elif request.method == "POST":
        try:
            data = json.loads(request.body)
            username = data.get("username")
            user = User.objects.get(username=username)
            if (user is None):
                return JsonResponse({"error_message": "user not found"})
            return JsonResponse({"username": user.username})
        except ObjectDoesNotExist:
            return JsonResponse({"error_message": "Missing valid player username"})


@login_required
def remote(request, remoteId=None):
    if remoteId is None:
        return redirect(home)
    remote = Remote.objects.get(pk=remoteId)
    if remote is None:
        return redirect(home)
    ajax = request.headers.get("X-Requested-With") == "XMLHttpRequest"
    return render(
        request,
        "remote.html",
        {
            "template": "ajax.html" if ajax else "index.html",
            "remoteId": remoteId,
        },
    )


@login_required
def tourLobby(request, tournamentId=None, invitedPlayer2=None, invitedPlayer3=None, invitedPlayer4=None):
    if tournamentId is None:
        tournament = Tournament.objects.create()
        return redirect(tourLobby, tournament.pk)

    tournament = get_object_or_404(Tournament, pk=tournamentId)
    ajax = request.headers.get("X-Requested-With") == "XMLHttpRequest"

    if request.method == "GET":
        return render(
            request,
            "tourLobby.html",
            {
                "template": "ajax.html" if ajax else "index.html", "tournamentId": tournamentId,
                "invitedPlayer2": invitedPlayer2, "invitedPlayer3": invitedPlayer3, "invitedPlayer4": invitedPlayer4
            },
        )
    elif request.method == "POST":
        try:
            data = json.loads(request.body)
            player2Username = data.get("p2Username")
            player3Username = data.get("p3Username")
            player4Username = data.get("p4Username")

            player2 = User.objects.filter(username=player2Username).first()
            player3 = User.objects.filter(username=player3Username).first()
            player4 = User.objects.filter(username=player4Username).first()

            if player2 is None:
                return JsonResponse({"error_message": "Player 2 not found"})
            elif player3 is None:
                return JsonResponse({"error_message": "Player 3 not found"})
            elif player4 is None:
                return JsonResponse({"error_message": "Player 4 not found"})
            return JsonResponse({
                "p2Username": player2.username,
                "p3Username": player3.username,
                "p4Username": player4.username,
            })
        except ObjectDoesNotExist as e:
            return JsonResponse({"error_message": str(e), "invalidUsername": data.get("username")})


@login_required
def tournament(request, tournamentId=None):
    if tournamentId is None:
        return redirect(home)

    try:
        tournament = Tournament.objects.get(pk=tournamentId)
    except Tournament.DoesNotExist:
        raise Http404("Tournament does not exist")

    # if tournament is None:
    #     return redirect(home)
    ajax = request.headers.get("X-Requested-With") == "XMLHttpRequest"
    return render(
        request,
        "tournament.html",
        {
            "template": "ajax.html" if ajax else "index.html",
            "tournamentId": tournamentId,
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
            request.session['state'] = base64.b64encode(
                os.urandom(100)).decode('ascii')
            auth_url = "{}/oauth/authorize?client_id={}&redirect_uri={}&scope={}&state={}&response_type=code".format(
                os.getenv("OAUTH_URL"),
                os.getenv("OAUTH_ID"),
                requests.utils.quote(
                    "http://localhost:8000/accounts/callback/"),
                "public",
                request.session['state'],  # state
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
    if request.method == "GET":
        # username = request.GET.get('username')
        # username = request.GET.get('profil_picture')
        print("username GET =", username)
        try:
            user = User.objects.get(username=username)
            user_info = {
                "username": user.username,
                "nickname": user.nickname,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "profil_picture": "/static/img/triste.png",
                # 'profil_picture': user.profil_picture.url if user.profil_picture else user.profil_picture_oauth,
            }
            return JsonResponse(user_info)
        except User.DoesNotExist:
            return JsonResponse({"error": "Utilisateur non trouvé"}, status=404)
    elif request.method == "POST":  # condition pour gérer les requêtes GET
        return JsonResponse({"error": "Méthode non autorisée"}, status=405)

    # TEST AVEC FAUX USERS


def create_fake_user(request):
    # Créer un faux utilisateur
    fake_user = User.objects.create_user(
        username="user123",
        email="user123@example.com",
        password="password123",
        profil_picture=STATIC_URL("./img/profil/image-defaut.png"),
    )
    fake_user.first_name = "John"
    fake_user.last_name = "Doe"
    # fake_user.profil_picture = '../img/profil/image-defaut.png'
    fake_user.save()

    # Renvoyer les informations de l'utilisateur créé
    user_info = {
        "username": fake_user.username,
        "first_name": fake_user.first_name,
        "last_name": fake_user.last_name,
        "email": fake_user.email,
        "profil_picture": "img/profil/image-defaut.png",
    }
    return JsonResponse(user_info)


def UpdateUserSettingsView(request):
    if request.method == "POST":
        paddle_speed = int(request.POST.get("paddle_speed"))
        ball_speed = int(request.POST.get("ball_speed"))
        paddle_color = request.POST.get("paddle_color")
        ball_color = request.POST.get("ball_color")
        background_color = request.POST.get("background_color")
        request.user.paddleSpeed = paddle_speed
        request.user.ballSpeed = ball_speed
        request.user.paddleColor = paddle_color
        request.user.ballColor = ball_color
        request.user.backgroundColor = background_color

        request.user.save()
        return redirect(profil)
    else:
        return HttpResponseBadRequest("Invalid request method")


@login_required
def getUserData(request):
    data = {
        "ballSpeed": request.user.ballSpeed,
        "paddleSpeed": request.user.paddleSpeed,
        "paddleColor": request.user.paddleColor,
        "ballColor": request.user.ballColor,
        "backgroundColor": request.user.backgroundColor,
    }

    return JsonResponse(data)


def get_usernames(request, gameId=None):
    if gameId is None:
        return JsonResponse({"error": "Invalid request"})
    game = Game.objects.get(pk=gameId)
    player1_username = game.teams.first().users.first().username
    player2_username = game.teams.last().users.first().username
    data = {
        "player1_username": player1_username,
        "player2_username": player2_username,
    }
    return JsonResponse(data)


def get_scores(request, gameId=None):
    if gameId is None:
        return JsonResponse({"error": "Invalid request"})
    game = Game.objects.get(pk=gameId)
    if request.method == "GET":
        data = {
            "player1Score": game.gameteam_set.first().score,
            "player2Score": game.gameteam_set.first().score,
        }
        return JsonResponse(data)
    if request.method == "POST":
        data = json.loads(request.body)
        player1Score = data.get("player1Score")
        player2Score = data.get("player2Score")
        # print("PLAYER 1 ", player1Score)
        # print("PLAYER 2 ", player2Score)
        game.gameteam_set.first().score = player1Score
        game.gameteam_set.last().score = player2Score
        print(f"{game.teams.first().users.first().username}: {player1Score}")
        print(f"{game.teams.last().users.first().username}: {player2Score}")
        game.winner = game.teams.first().users.first() if player1Score > player2Score else game.teams.last().users.first()
        # print(game.winner.username)
        game.save()
        data = {
            "player1Score": game.gameteam_set.first().score,
            "player2Score": game.gameteam_set.first().score,
        }
        return JsonResponse(data)


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


# FOR MATCH HISTORY
def profil_view(request):
    # Récupérer tous les matchs associés à l'utilisateur
    matches = Game.objects.filter(teams__users=request.user)
    return render(request, 'profil.html', {'matches': matches})
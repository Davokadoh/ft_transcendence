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
        request, "home.html", {"template": "ajax.html" if ajax else "index.html"}
    )


@login_required
def play(request):
    ajax = request.headers.get("X-Requested-With") == "XMLHttpRequest"
    return render(
        request, "play.html", {"template": "ajax.html" if ajax else "index.html"}
    )


@login_required
def profil(request):
    username_form = UsernameForm(instance=request.user)
    profil_picture_form = ProfilPictureForm(instance=request.user)
    # settings_form = ProfilSettingsForm(instance=request.user)
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
            # "settings_form": settings_form,
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
        form = ProfilPictureForm(request.POST, request.FILES, instance=request.user)
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
            request, "chat.html", {"template": "ajax.html" if ajax else "index.html"}
        )

@login_required
def lobby(request, gameId=None, invitedPlayer2=None):
    if gameId is None:
        game = Game.objects.create()
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
            {"template": "ajax.html" if ajax else "index.html", "gameId": gameId, "invitedPlayer2": invitedPlayer2},
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
            {"template": "ajax.html" if ajax else "index.html", "remoteId": remoteId, "invitedPlayer2": invitedPlayer2},
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
@login_required
def start_game(request, tournament_id, player_id):
    # Logique pour récupérer les données initiales du jeu pour le joueur spécifié
    # (par exemple, positions initiales des paddles, scores, etc.)
    # ...

    # Renvoie les données au format JSON
    return JsonResponse({
        'player1_username': player1.username,
        'player2_username': player2.username,
        'player3_username': player3.username,
        'player4_username': player4.username,
        'player1_score': player1.score,
        'player2_score': player2.score,
        'player3_score': player3.score,
        'player4_score': player4.score,
    })

@login_required
def end_game(request, tournament_id, player_id):
    # Logique pour enregistrer les scores du joueur spécifié et déterminer si tous les joueurs ont terminé
    # ...

    # Renvoie une réponse au format JSON indiquant si tous les joueurs ont terminé
    return JsonResponse({
        'all_players_finished': all_players_finished,
    })

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
            request.session['state'] = base64.b64encode(os.urandom(100)).decode('ascii')
            auth_url = "{}/oauth/authorize?client_id={}&redirect_uri={}&scope={}&state={}&response_type=code".format(
                os.getenv("OAUTH_URL"),
                os.getenv("OAUTH_ID"),
                requests.utils.quote("http://localhost:8000/accounts/callback/"),
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
    player1Score = game.gameteam_set.first().score
    player2Score = game.gameteam_set.last().score
    data = {
        "player1Score": player1Score,
        "player2Score": player2Score,
    }
    return JsonResponse(data)

def get_fourUsernames(request, tournamentId=None):
    if tournamentId is None:
        return JsonResponse({"error": "Invalid request"})
    
    game = Game.objects.get(pk=tournamentId)
    
    # Récupérer les utilisateurs des équipes
    team1_users = game.teams.first().users.all()
    team2_users = game.teams.last().users.all()

    # Assurez-vous qu'il y a au moins un utilisateur dans chaque équipe
    if not team1_users or not team2_users:
        return JsonResponse({"error": "Not enough users in teams"})

    # Récupérer les noms d'utilisateur pour les joueurs
    player1_username = team1_users.first().username
    player2_username = team2_users.first().username

    # Ajouter les deux joueurs supplémentaires si disponibles
    player3_username = team1_users[1].username if len(team1_users) > 1 else None
    player4_username = team2_users[1].username if len(team2_users) > 1 else None

    data = {
        "player1_username": player1_username,
        "player2_username": player2_username,
        "player3_username": player3_username,
        "player4_username": player4_username,
    }

    return JsonResponse(data)

def get_fourScores(request, tournamentId=None):
    if tournamentId is None:
        return JsonResponse({"error": "Invalid request"})
    game = Game.objects.get(pk=tournamentId)
    # Récupérer les scores des équipes
    team1_scores = game.gameteam_set.filter(team__team_number=1).values_list('score', flat=True)
    team2_scores = game.gameteam_set.filter(team__team_number=2).values_list('score', flat=True)

    # Assurez-vous qu'il y a au moins un score dans chaque équipe
    if not team1_scores or not team2_scores:
        return JsonResponse({"error": "Not enough scores in teams"})

    # Récupérer les scores pour les joueurs
    player1Score = team1_scores[0]
    player2Score = team2_scores[0]

    # Ajouter les deux scores supplémentaires si disponibles
    player3Score = team1_scores[1] if len(team1_scores) > 1 else None
    player4Score = team2_scores[1] if len(team2_scores) > 1 else None

    data = {
        "player1Score": player1Score,
        "player2Score": player2Score,
        "player3Score": player3Score,
        "player4Score": player4Score,
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
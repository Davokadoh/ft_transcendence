import json
from django.http import Http404, HttpResponse, HttpResponseBadRequest
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404, redirect, render
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth import login, logout
from django.http import JsonResponse
from django.contrib import messages
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.utils import timezone
from ftt.settings import STATIC_URL
from .models import GameTeam, Tournament, CustomUser, Team, Game
from .forms import ProfilPictureForm, NicknameForm
from django.urls import reverse
import requests
import os
import base64
from django.dispatch import receiver
from django.contrib.auth.signals import user_logged_in, user_logged_out
from django.dispatch import Signal
from django.views.decorators.cache import never_cache


@receiver(user_logged_in)
def user_logged_in_handler(sender, request, user, **kwargs):
    # Met à jour le statut du userok à "online"
    user.status = "online"
    user.save()


@receiver(user_logged_out)
def user_logged_out_handler(sender, request, user, **kwargs):
    # Met à jour le statut du userok à "offline"
    user.status = "offline"
    user.save()


# Défini un signal pour indiquer que le user est en train de jouer
user_playing_mode = Signal()


@receiver(user_playing_mode)
def user_playing_mode_handler(sender, request, user, **kwargs):
    # request = kwargs.get('request')
    # user = kwargs.get('user')
    user.status = "playing"
    user.save()


# Défini un signal pour indiquer que le user n'est plus en train de jouer
user_stopped_playing_mode = Signal()


@receiver(user_stopped_playing_mode)
def user_stopped_playing_mode_handler(sender, request, user, **kwargs):
    user.status = "online"
    user.save()


@login_required
def update_status(request):
    # Met à jour le statut de l'utilisateur en ligne apres la fonction endGame
    request.user.status = "online"
    request.user.save()
    return JsonResponse({"message": "User status updated successfully"}, status=200)


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
@never_cache
def profil(request):
    ajax = request.headers.get("X-Requested-With") == "XMLHttpRequest"
    try:
        # Calcul des statistiques du joueur
        user_teams = Team.objects.filter(users=request.user)
        matches = (
            Game.objects.filter(teams__in=user_teams)
            .filter(status="END")
            .order_by("-start_time")
        )
        for match in matches:
            try:
                match.opponent = (
                    match.teams.exclude(users=request.user).first().users.first()
                )
                print(f"Opp: {match.opponent}")
                match.score = (
                    match.gameteam_set.first().score,
                    match.gameteam_set.last().score,
                )
                print(f"SCORE = {match.score[0]} - {match.score[1]}")
                if match.winner.users.first() == request.user:
                    match.result = "WIN"
                else:
                    match.result = "LOSE"
            except (AttributeError, IndexError, ObjectDoesNotExist) as e:
                print(f"Error while retrieving match data : {e}")
                pass
    except ObjectDoesNotExist:
        return render(
            request, "error.html", {"template": "ajax.html" if ajax else "index.html"}
        )
    nickname_form = NicknameForm(instance=request.user)
    profil_picture_form = ProfilPictureForm(instance=request.user)

    matches_played = matches.count()
    wins = matches.filter(winner__users=request.user).count()
    win_ratio = round((wins / matches_played) * 100, 2) if matches_played > 0 else 0

    status = request.user.status
    # user_status = request.user.status

    if request.user.profil_picture:
        profil_picture_url = request.user.profil_picture.url
    elif request.user.profil_picture_oauth:
        profil_picture_url = request.user.profil_picture_oauth
    else:
        profil_picture_url = "/static/img/profil/image-defaut.png"
    return render(
        request,
        "profil.html",
        {
            "template": "ajax.html" if ajax else "index.html",
            "profil_picture_url": profil_picture_url,
            "profil_picture_form": profil_picture_form,
            "nickname_form": nickname_form,
            "matches_played": matches_played,
            "wins": wins,
            "win_ratio": win_ratio,
            "matches": matches,
            "status": status,
            # "user_status": user_status,
        },
    )


@login_required
def user(request, nickname=None):
    ajax = request.headers.get("X-Requested-With") == "XMLHttpRequest"
    try:
        user = CustomUser.objects.get(nickname=nickname)
        print(f"User: {user}")
        print(f"nickname: {nickname}")
        # Calcul des statistiques du joueur
        user_teams = Team.objects.filter(users=user)
        matches = (
            Game.objects.filter(teams__in=user_teams)
            .filter(status="END")
            .order_by("-start_time")
        )
        for match in matches:
            try:
                match.opponent = match.teams.exclude(users=user).first().users.first()
                print(f"Opp: {match.opponent}")
                match.score = (
                    match.gameteam_set.first().score,
                    match.gameteam_set.last().score,
                )
                print(f"SCORE = {match.score[0]} - {match.score[1]}")
                # if match.winner == user:
                if match.winner.users.last() == user:
                    match.result = "WIN"
                else:
                    match.result = "LOSE"
            except (AttributeError, IndexError, ObjectDoesNotExist) as e:
                print(f"Error while retrieving match data : {e}")
                pass
    except ObjectDoesNotExist:
        return redirect(errorview)

    matches_played = matches.count()
    wins = matches.filter(winner__users=user).count()
    win_ratio = round((wins / matches_played) * 100, 2) if matches_played > 0 else 0

    if user.profil_picture:
        profil_picture_url = user.profil_picture.url
    elif user.profil_picture_oauth:
        profil_picture_url = user.profil_picture_oauth
    else:
        profil_picture_url = "/static/img/profil/image-defaut.png"
    user_logged = request.user
    context = {
        "user_logged": user_logged,
        "messages": messages.get_messages(request),
        "template": "ajax.html" if ajax else "index.html",
        "user": user,
        "profil_picture_url": profil_picture_url,
        "matches_played": matches_played,
        "wins": wins,
        "win_ratio": win_ratio,
        "matches": matches,
        "nickname": nickname,
    }
    return render(request, "user.html", context)


def errorview(request):
    ajax = request.headers.get("X-Requested-With") == "XMLHttpRequest"
    return render(
        request, "error.html", {"template": "ajax.html" if ajax else "index.html"}
    )


@login_required
def nickname(request):
    if request.method == "GET":
        # return JsonResponse({"username": request.user.username, "nickname": {"nickname": request.user.nickname}})
        return JsonResponse({"nickname": request.user.nickname})
    elif request.method == "POST":
        form = NicknameForm(request.POST, instance=request.user)
        if form.is_valid():
            print(form.cleaned_data)
            form.save()
            return JsonResponse({"message": "Nickname updated successfully"})
        else:
            return JsonResponse({"error": "New nickname is required"}, status=400)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=405)


@login_required
def username(request):
    if request.method == "GET":
        # return JsonResponse({"username": request.user.username, "nickname": {"nickname": request.user.nickname}})
        return JsonResponse({"username": request.user.username})


@login_required
def profilPicture(request):
    if request.method == "POST":
        form = ProfilPictureForm(request.POST, request.FILES, instance=request.user)
        if form.is_valid():
            form.save()
            return HttpResponse()
        else:
            return HttpResponseBadRequest()
    elif request.method == "GET":
        return JsonResponse({"profilPicture": request.user.profil_picture_oauth})


@login_required
def chat(request):
    ajax = request.headers.get("X-Requested-With") == "XMLHttpRequest"
    if request.method == "GET":
        user_chat = request.user
        render(
            request,
            "chat.html",
            {"template": "ajax.html" if ajax else "index.html", "user_chat": user_chat},
        )
    if request.path == "/chat/chat-tmp/":
        return render(request, "chat-tmp.html")
    else:
        if request.user.profil_picture:
            profil_picture_url = request.user.profil_picture.url
        else:
            if request.user.profil_picture_oauth:
                profil_picture_url = request.user.profil_picture_oauth
            else:
                # profil_picture_url = "/chemin/vers/image/par/defaut.png"
                profil_picture_url = "/static/img/profil/image-defaut.png"
        return render(
            request,
            "chat.html",
            {
                "template": "ajax.html" if ajax else "index.html",
                "profil_picture_url": profil_picture_url,
            },
        )


@login_required
def lobby(request, gameId=None, invitedPlayer2=None):
    if gameId is None:
        game = Game.objects.create(
            start_time=timezone.now(),
            style="Quick Play",
            opponent=request.POST.get("player2"),
            score=request.POST.get("scoreText", "0 - 0"),
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
        player1_username = request.user.nickname
        return render(
            request,
            "lobby.html",
            {
                "template": "ajax.html" if ajax else "index.html",
                "gameId": gameId,
                "invitedPlayer2": invitedPlayer2,
                "player1_username": player1_username,
            },
        )
    elif request.method == "POST":
        try:
            data = json.loads(request.body)
            nickname = data.get("nickname")
            user = CustomUser.objects.get(nickname=nickname)
            if user is None:
                return JsonResponse({"error_message": "user not found"})
            team2 = Team.objects.create()
            team2.save()
            team2.users.add(user)
            gt = GameTeam(game=game, team=team2)
            gt.save()
            return JsonResponse({"nickname": user.nickname})
        except ObjectDoesNotExist:
            return JsonResponse({"error_message": "Missing valid player nickname"})


@login_required
def game(request, gameId=None):
    if gameId is None:
        return redirect(home)
    game = Game.objects.get(pk=gameId)
    if game is None:
        return redirect(home)
    ajax = request.headers.get("X-Requested-With") == "XMLHttpRequest"
    # envoi du signal pour le mode de jeu "playing"
    user_playing_mode.send(sender=None, request=request, user=request.user)
    return render(
        request,
        "game.html",
        {"template": "ajax.html" if ajax else "index.html", "gameId": gameId},
    )


@login_required
def remLobby(request, remoteId=None, invitedPlayer2=None):
    if remoteId is None:
        game = Game.objects.create(
            start_time=timezone.now(),
            style="Remote Play",
            # opponent=request.POST.get('player2', ''),
            # score=request.POST.get('scoreText', 0),
        )

        team = Team.objects.filter(users=request.user).first()
        if team is None:
            team = Team.objects.create()
            team.users.add(request.user)
        gt = GameTeam(game=game, team=team)
        gt.save()
        return redirect(remLobby, game.pk)

    game = get_object_or_404(Game, pk=remoteId)
    ajax = request.headers.get("X-Requested-With") == "XMLHttpRequest"
    if request.method == "GET":
        player1_username = request.user.nickname
        return render(
            request,
            "remLobby.html",
            {
                "template": "ajax.html" if ajax else "index.html",
                "remoteId": remoteId,
                "invitedPlayer2": invitedPlayer2,
                "player1_username": player1_username,
            },
        )
    elif request.method == "POST":
        try:
            data = json.loads(request.body)
            nickname = data.get("nickname")
            user = CustomUser.objects.get(nickname=nickname)
            team = ""
            try:
                team = Team.objects.filter(users=user).first()
                if team is None:
                    team = Team.objects.create()
                    team.users.add(user)
                gt = GameTeam(game=game, team=team)
                gt.save()
                return JsonResponse({"nickname": user.nickname})

            except ObjectDoesNotExist:
                gt = GameTeam(game=game, team=team)
                gt.save()
                return JsonResponse({"nickname": user.nickname})

        except ObjectDoesNotExist:
            return JsonResponse({"error_message": "Missing valid player nickname"})


@login_required
def remote(request, remoteId=None):
    ajax = request.headers.get("X-Requested-With") == "XMLHttpRequest"
    if remoteId is None:
        return redirect(home)
    remote = Game.objects.get(pk=remoteId)
    if remote is None:
        return redirect(home)
    players = list()
    for team in remote.teams.all():
        print(team.users.first())
        players.append(team.users.first())
    if request.user not in players:
        return redirect(home)
    return render(
        request,
        "remote.html",
        {
            "template": "ajax.html" if ajax else "index.html",
            "remoteId": remoteId,
        },
    )


@login_required
def tourLobby(request, tournamentId=None):
    if tournamentId is None:
        tournament = Tournament.objects.create()
        return redirect(tourLobby, tournament.pk)
    ajax = request.headers.get("X-Requested-With") == "XMLHttpRequest"
    context = {
        "tournamentId": tournamentId,
        "template": "ajax.html" if ajax else "index.html",
    }
    if request.method == "GET":
        player1_username = request.user.nickname
        context["player1_username"] = player1_username
        return render(request, "tourLobby.html", context)
    elif request.method == "POST":
        try:
            data = json.loads(request.body)
            nicknames = [value for key, value in data.items()]
            nicknames.append(request.user.nickname)
            users = CustomUser.objects.filter(nickname__in=nicknames).distinct()
            if users.count() < 4:
                return JsonResponse({"error_message": "Not enough distinct players"})
            if not users.exists():
                return JsonResponse(
                    {"error_message": "No users found with the provided nicknames"}
                )
            tournament = Tournament.objects.get(pk=tournamentId)
            for user in users:
                team = Team.objects.create()
                team.users.add(user)
                team.save()
                tournament.register_team(team)
            tournament.save()
            print(tournament)
            return JsonResponse(data)
        except ObjectDoesNotExist as e:
            return JsonResponse(
                {"error_message": str(e), "invalidNickname": data.get("nickname")}
            )


@login_required
def tournament_next(request, tournamentId=None):
    try:
        tournament = Tournament.objects.get(pk=tournamentId)
        game = tournament.next_game()
    except Tournament.DoesNotExist or Game.DoesNotExist:
        raise Http404("Game does not exist")
    return redirect(tournament_game, gameId=game.pk)


@login_required
def tournament_game(request, gameId=None):
    ajax = request.headers.get("X-Requested-With") == "XMLHttpRequest"
    try:
        game = Game.objects.get(pk=gameId)
    except Game.DoesNotExist:
        raise Http404("Game does not exist")
    team1 = GameTeam.objects.filter(game=game).first()
    team2 = GameTeam.objects.filter(game=game).last()
    context = {
        "game": game,
        "player1": team1.team.users.first(),
        "player2": team2.team.users.first(),
        "template": "ajax.html" if ajax else "index.html",
    }
    if request.method == "GET":
        return render(request, "tournament.html", context)
    elif request.method == "POST":
        data = json.loads(request.body)
        team1.score = data.get("player1Score")
        team2.score = data.get("player2Score")
        team1.save()
        team2.save()
        game.winner = team1.team if team1.score > team2.score else team2.team
        game.status = "END"
        game.save()
        tournament_round = game.tournament_round
        if tournament_round:
            next = tournament_round.tournament.next_game()
            if next:
                print(f"Next game {next.pk}")
                return JsonResponse({"nextGame": next.pk})
            else:
                return HttpResponseBadRequest()
                # return render(request, "win.html", context)
        return HttpResponseBadRequest()


def logoutview(request):
    try:
        if request.user is not None:
            user_logged_in_handler(sender=None, request=request, user=request.user)
            logout(request)
    except NotImplementedError:
        return redirect(loginview)
    return redirect(loginview)


def loginview(request):
    if request.user.is_authenticated:
        user_logged_in_handler(sender=None, request=request, user=request.user)
        redirect(home)
    if request.method == "GET":
        ajax = request.headers.get("X-Requested-With") == "XMLHttpRequest"
        return render(
            request,
            "login.html",
            {"template": "ajax.html" if ajax else "index.html"},
        )
    elif request.method == "POST":
        request.session["state"] = base64.b64encode(os.urandom(100)).decode("ascii")
        auth_url = "{}/oauth/authorize?client_id={}&redirect_uri={}&scope={}&state={}&response_type=code".format(
            os.getenv("OAUTH_URL"),
            os.getenv("OAUTH_ID"),
            f"https://{os.getenv('DOMAIN')}{reverse(callback)}",
            "public",
            request.session["state"],
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
            "redirect_uri": f"https://{os.getenv('DOMAIN')}{reverse(callback)}",
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
        user = CustomUser.objects.get(username=response.json()["login"])
    except CustomUser.DoesNotExist:
        user = CustomUser.objects.create(username=response.json()["login"])
        try:
            user.profil_picture_oauth = response.json()["image"]["link"]
        except KeyError:
            user.profil_picture_oauth = f"https://github.com/{user.username}.png"
        user.save()

    login(request, user)
    return redirect(home)


def get_user_info(request, nickname):
    if request.method == "GET":
        # nickname = request.GET.get('nickname')
        # nickname = request.GET.get('profil_picture')
        print("nickname GET =", nickname)
        try:
            user = CustomUser.objects.get(nickname=nickname)
            user_info = {
                "username": user.username,
                "nickname": user.nickname,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "profil_picture": "/static/img/triste.png",
                # 'profil_picture': user.profil_picture.url if user.profil_picture else user.profil_picture_oauth,
            }
            return JsonResponse(user_info)
        except CustomUser.DoesNotExist:
            return JsonResponse({"error": "Utilisateur non trouvé"}, status=404)
    elif request.method == "POST":  # condition pour gérer les requêtes GET
        return JsonResponse({"error": "Méthode non autorisée"}, status=405)

    # TEST AVEC FAUX USERS


def create_fake_user(request):
    # Créer un faux utilisateur
    fake_user = CustomUser.objects.create_user(
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
        "profil_picture": "/static/img/profil/image-defaut.png",
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

        data = {
            "ballSpeed": request.user.ballSpeed,
            "paddleSpeed": request.user.paddleSpeed,
            "paddleColor": request.user.paddleColor,
            "ballColor": request.user.ballColor,
            "backgroundColor": request.user.backgroundColor,
        }
        return JsonResponse(data)
    else:
        return HttpResponseBadRequest("Invalid request method")


# @login_required
def getUserData(request):
    data = {
        "ballSpeed": request.user.ballSpeed,
        "paddleSpeed": request.user.paddleSpeed,
        "paddleColor": request.user.paddleColor,
        "ballColor": request.user.ballColor,
        "backgroundColor": request.user.backgroundColor,
    }
    return JsonResponse(data)


def get_nicknames(request, gameId=None):
    if gameId is None:
        return JsonResponse({"error": "Invalid request"})
    game = Game.objects.get(pk=gameId)
    player1_nickname = game.teams.first().users.first().nickname
    player2_nickname = game.teams.last().users.first().nickname
    data = {
        "player1_nickname": player1_nickname,
        "player2_nickname": player2_nickname,
    }
    return JsonResponse(data)


def get_scores(request, gameId=None):
    if gameId is None:
        return JsonResponse({"error": "Invalid request"})
    game = Game.objects.get(pk=gameId)
    if request.method == "GET":
        data = {
            "player1Score": game.gameteam_set.first().score,
            "player2Score": game.gameteam_set.last().score,
        }
        return JsonResponse(data)
    if request.method == "POST":
        data = json.loads(request.body)
        gameteam1 = GameTeam.objects.filter(game=game).first()
        gameteam1.score = data.get("player1Score")
        gameteam1.save()
        gameteam2 = GameTeam.objects.filter(game=game).last()
        gameteam2.score = data.get("player2Score")
        gameteam2.save()
        # game.save()
        # game.refresh_from_db()
        game.winner = (
            gameteam1.team if gameteam1.score > gameteam2.score else gameteam2.team
        )
        game.status = "END"
        game.save()
        data = {
            "player1Score": gameteam1.score,
            "player2Score": gameteam2.score,
        }
        return JsonResponse(data)


@csrf_exempt
def get_users(request):
    if request.method == "GET":
        users = CustomUser.objects.all()
        # users = serialize("json", users)
        # users = json.loads(users)
    try:
        user_list = []
        for user in users:
            user_info = {
                "username": user.username,
                "nickname": user.nickname,
                "profil_picture": user.profil_picture_oauth,
                "status": user.status,
                # add other field if necessary
            }
            user_list.append(user_info)

        context = {"user_list": user_list}
        return JsonResponse(context, safe=False)
    except CustomUser.DoesNotExist:
        return JsonResponse({"error": "User not found"}, status=404)


# FOR MATCH HISTORY
def profil_view(request):
    # Récupérer tous les matchs associés à l'utilisateur
    matches = Game.objects.filter(teams__users=request.user)
    return render(request, "profil.html", {"matches": matches})


def getList(request, prefix, type):
    print("[getList FUNCTION]")
    if request.method == "GET":
        # users = serialize("json", users)
        # users = json.loads(users)
        try:
            if type == "users":
                users = CustomUser.objects.all()
                user_list = []
                for user in users:
                    if user.profil_picture:
                        profil_picture_url = user.profil_picture.url
                    elif user.profil_picture_oauth:
                        profil_picture_url = user.profil_picture_oauth
                    else:
                        profil_picture_url = "/static/img/profil/image-defaut.png"
                    user_info = {
                        # "username": user.username,
                        "nickname": user.nickname,
                        "profil_picture": profil_picture_url,
                        "status": user.status,  # recuperer le status @test Verena
                        # add other field if necessary
                    }
                    user_list.append(user_info)
                context = {"user_list": user_list}
                return JsonResponse(context, safe=False)

            elif type == "friends":
                friends = request.user.friends.all()
                friend_list = []
                for friend in friends:
                    if friend.profil_picture:
                        profil_picture_url = friend.profil_picture.url
                    elif friend.profil_picture_oauth:
                        profil_picture_url = friend.profil_picture_oauth
                    else:
                        profil_picture_url = "/static/img/profil/image-defaut.png"
                    friend_info = {
                        "username": friend.username,
                        "nickname": friend.nickname,
                        "profil_picture": profil_picture_url,
                        "status": friend.status,
                    }
                    friend_list.append(friend_info)
                context = {"friend_list": friend_list}
                return JsonResponse(context, safe=False)

            elif type == "blocked":
                users = request.user.blocked_users.all()
                blocked_list = []
                for user in users:
                    user = {
                        "username": user.username,
                        "nickname": user.nickname,
                    }
                    blocked_list.append(user)
                context = {"users_blocked": blocked_list}
                return JsonResponse(context, safe=False)

        except CustomUser.DoesNotExist:
            return JsonResponse({"error": "User not found"}, status=404)


@csrf_exempt
@require_POST
def manageFriend(request, prefix, action, nickname):
    print("[manageFriend FUNCTION]")
    try:
        target = CustomUser.objects.get(nickname=nickname)
        if target is request.user:
            return JsonResponse({"error": "Can't yourself as a friend"}, status=400)

        if action == "add":
            if not request.user.friends.filter(nickname=target.nickname).exists():
                request.user.friends.add(target)
                print(f"friend: {nickname} added by {request.user.nickname}")
                print("*****:", request.user.friends.all())
                return JsonResponse({"message": "Friend has been added ✔︎"}, status=200)
            else:
                return JsonResponse({"message": "Friend already added ✕"}, status=200)
        elif action == "remove":
            if request.user.friends.filter(nickname=target.nickname).exists():
                request.user.friends.remove(target)
                print("*****:", request.user.friends.all())
                print(f"friend: {nickname} removed by {request.user.nickname}")
                return JsonResponse({"message": "Friend has been removed"}, status=200)
            else:
                return JsonResponse(
                    {"message": "Friend doesn't exist or has been removed"},
                    status=200,
                )
        elif action == "block":
            if (
                request.user.friends.filter(nickname=target.nickname).exists()
                and not request.user.blocked_users.filter(
                    nickname=target.nickname
                ).exists()
            ):
                request.user.blocked_users.add(target)
                print(f"friend: {nickname} was blocked by {request.user.nickname}")
                return JsonResponse({"message": "Friend has been blocked"}, status=200)
            else:
                return JsonResponse(
                    {"message": "Friend is already blocked"},
                    status=200,
                )
        elif action == "unblock":
            if (
                request.user.friends.filter(nickname=target.nickname).exists()
                and request.user.blocked_users.filter(nickname=target.nickname).exists()
            ):
                request.user.blocked_users.remove(target)
                print(f"Friend: {nickname} was unblocked by {request.user.nickname}")
                return JsonResponse(
                    {"message": "Friend have been unblocked"}, status=200
                )
            else:
                return JsonResponse({"message": "Friend is unblocked"}, status=200)
        else:
            return JsonResponse({"message": "action not recognize"}, status=200)
    except CustomUser.DoesNotExist:
        print(f"User not found: {nickname}")
        return JsonResponse({"error": "user not found"}, status=404)


@csrf_exempt
@require_POST
def manageFriendChat(request, prefix, action, username):
    print("[manageFriend FUNCTION]")
    try:
        target = CustomUser.objects.get(username=username)
        if target is request.user:
            return JsonResponse({"error": "Can't yourself as a friend"}, status=400)

        if action == "add":
            if not request.user.friends.filter(username=target.username).exists():
                request.user.friends.add(target)
                print(f"friend: {username} added by {request.user.username}")
                print("*****:", request.user.friends.all())
                return JsonResponse({"message": "Friend have been added"}, status=200)
            else:
                return JsonResponse({"message": "Friend already added ✕"}, status=200)
        elif action == "remove":
            if request.user.friends.filter(username=target.username).exists():
                request.user.friends.remove(target)
                print("*****:", request.user.friends.all())
                print(f"friend: {username} removed by {request.user.username}")
                return JsonResponse({"message": "Friend has been removed"}, status=200)
            else:
                return JsonResponse(
                    {"message": "Friend doesn't exist or has been removed"},
                    status=200,
                )
        elif action == "block":
            if (
                request.user.friends.filter(username=target.username).exists()
                and not request.user.blocked_users.filter(
                    username=target.username
                ).exists()
            ):
                request.user.blocked_users.add(target)
                print(f"friend: {username} was blocked by {request.user.username}")
                return JsonResponse({"message": "Friend has been blocked"}, status=200)
            else:
                return JsonResponse(
                    {"message": "Friend doesn't exist or already blocked"},
                    status=200,
                )
        elif action == "unblock":
            if (
                request.user.friends.filter(username=target.username).exists()
                and request.user.blocked_users.filter(username=target.username).exists()
            ):
                request.user.blocked_users.remove(target)
                print(f"Friend: {username} was unblocked by {request.user.username}")
                return JsonResponse(
                    {"message": "Friend have been unblocked"}, status=200
                )
            else:
                return JsonResponse(
                    {"message": "Friend doesn't exist or isn't blocked"}, status=200
                )
        else:
            return JsonResponse({"message": "Action not recognized"}, status=200)
    except CustomUser.DoesNotExist:
        print(f"User not found: {username}")
        return JsonResponse({"error": "user not found"}, status=404)


def get_user_conversations(request):
    if request.method == "GET":
        user = request.user
        conversations = user.conversations.all()
        serialized_conversations = []

        for conversation in conversations:
            messages = [
                {
                    "type": message.type,
                    "id": message.id_msg,
                    "sender": message.sender.username,
                    "sender_nickname": message.sender.nickname,
                    "target": message.target.username,
                    "target_nickname": message.target.nickname,
                    "message": message.message,
                    "timestamp": message.timestamp,
                }
                for message in conversation.messages.all()
            ]
            serialized_conversations.append(
                {
                    "id": conversation.participants.username,
                    "name": conversation.participants.nickname,
                    "messages": messages,
                    "status": conversation.participants.status,
                    # "unread": conversation.unread,
                }
            )

        context = {"conversations": serialized_conversations}
        return JsonResponse(context)

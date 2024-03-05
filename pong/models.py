from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.auth.models import AbstractBaseUser, UserManager
from django.core.files.storage import FileSystemStorage
from django.conf import settings
from django.db import models
import pathlib
import random
import os


class OverwriteStorage(FileSystemStorage):
    def get_available_name(self, name, max_length):
        if self.exists(name):
            os.remove(os.path.join(settings.MEDIA_ROOT, name))
        return name


def user_directory_path(instance, filename):
    return "profil_pictures/{0}{1}".format(
        instance.username, pathlib.Path(filename).suffix
    )


class User(AbstractBaseUser):
    username = models.CharField(max_length=255, primary_key=True)
    nickname = models.CharField(max_length=255, unique=True, null=True, blank=True)
    access_token = models.CharField(max_length=255)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    groups = models.CharField(max_length=255)
    user_permissions = models.CharField(max_length=255)
    email = models.CharField(max_length=255)
    is_staff = models.CharField(max_length=255)
    is_superuser = models.CharField(max_length=255)
    is_active = models.CharField(max_length=255)
    chats = models.ForeignKey("self", on_delete=models.SET_NULL, null=True, blank=True)
    friends = models.ManyToManyField("self")
    profil_picture_oauth = models.URLField(max_length=255)
    profil_picture = models.ImageField(
        max_length=255,
        upload_to=user_directory_path,
        storage=OverwriteStorage(),
        default=None,
    )
    USERNAME_FIELD = "username"

    objects = UserManager()

    def get_username(self):
        return self.username

    def save(self, *args, **kwargs):
        if not self.nickname:
            self.nickname = self.username
        super().save(*args, **kwargs)

    def __str__(self):
        return self.username


class GameTeam(models.Model):
    team = models.ForeignKey("Team", on_delete=models.CASCADE)
    game = models.ForeignKey("Game", on_delete=models.CASCADE)
    score = models.PositiveSmallIntegerField(default=0)

    def __str__(self):
        return f"Team: {self.team}, Game: {self.game}, Score: {self.score}"


class Team(models.Model):
    name = models.CharField(max_length=255, blank=True)
    users = models.ManyToManyField(settings.AUTH_USER_MODEL)
    max_player = models.PositiveSmallIntegerField(default=2)

    def add_player(self, player_id):
        if self.users.count() < self.max_player:
            self.users.add(player_id)

    def __str__(self):
        return f"Name: {self.name}, Members: {', '.join([user.username for user in self.users.all()])}"


class Game(models.Model):
    STATUS_CHOICES = [
        ("LOBBY", "Lobby"),
        ("PLAY", "Play"),
        ("PAUSE", "Pause"),
        ("END", "End"),
    ]
    status = models.CharField(
        max_length=5,
        choices=STATUS_CHOICES,
        default="LOBBY",
    )
    tournament_round = models.ForeignKey("Round", on_delete=models.CASCADE, null=True)
    teams = models.ManyToManyField(
        Team, through=GameTeam, through_fields=("game", "team")
    )
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(null=True, blank=True)
    max_points = models.PositiveSmallIntegerField(default=5)
    style = models.CharField(max_length=100, default="not defined")
    opponent = models.CharField(max_length=255, null=True, default=None)
    winner = models.ForeignKey(
        Team, on_delete=models.CASCADE, related_name="games_won", null=True
    )

    def __str__(self):
        return f"Game: {self.id}, Status: {self.status}"


class Round(models.Model):
    tournament = models.ForeignKey("Tournament", on_delete=models.CASCADE)
    teams = models.ManyToManyField(Team)

    def create_games(self):
        teams = list(self.teams.all())
        for team1, team2 in zip(teams[::2], teams[1::2]):
            game = Game.objects.create(tournament_round=self)
            game.teams.add(team1, team2)
            game.save()

    def get_winners(self):
        winners = [game.winner for game in self.game_set.all()]
        return winners

    def __str__(self):
        return f"Round: {self.pk}, {self.tournament}"


class Tournament(models.Model):
    STATUS_CHOICES = [
        ("OPEN", "Open"),
        ("CLOSED", "Closed"),
        ("ENDED", "Ended"),
    ]
    status = models.CharField(
        max_length=6,
        choices=STATUS_CHOICES,
        default="OPEN",
    )
    teams = models.ManyToManyField(Team, related_name="joined_tournaments", blank=True)
    max_teams = models.PositiveIntegerField(default=4)

    def register_team(self, team):
        if self.status != "OPEN":
            raise RegistrationClosedException()
        if self.teams.count() >= self.max_teams:
            raise TournamentFullException()
        self.teams.add(team)
        self.save()

    def next_round(self):
        last_round = Round.objects.filter(tournament=self).last()
        winners = last_round.get_winners() if last_round else self.teams.all()
        if len(winners) == 1:
            return None
        next_round = Round.objects.create(tournament=self)
        next_round.teams.set(winners)
        next_round.create_games()
        return next_round

    def next_game(self):
        last_round = Round.objects.filter(tournament=self).last()
        if last_round is None:
            self.start()
            last_round = Round.objects.filter(tournament=self).last()
        next_game = last_round.game_set.filter(status="LOBBY").first()
        if next_game is None:
            last_round = self.next_round()
            if last_round is not None:
                next_game = last_round.game_set.filter(status="LOBBY").first()
        return next_game

    def start(self):
        self.status = "CLOSED"
        self.save()
        first_round = Round.objects.create(tournament=self)
        first_round.teams.set(self.teams.all())
        first_round.create_games()

    def __str__(self):
        return f"Tournament: {self.id}, Status: {self.status}, {[team for team in self.teams.all()]}"


class RegistrationClosedException(Exception):
    def __init__(self, message="Can't add team to tournament: registration is closed"):
        super().__init__(message)


class TournamentFullException(Exception):
    def __init__(self, message="Can't add team to tournament: tournament is full"):
        super().__init__(message)

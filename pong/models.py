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
    nickname = models.CharField(max_length=255, unique=True, null=True)
    access_token = models.CharField(max_length=255)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    profil_picture = models.ImageField(
        max_length=255,
        upload_to=user_directory_path,
        storage=OverwriteStorage(),
        default=None,
    )
    profil_picture_oauth = models.URLField(max_length=255)
    groups = models.CharField(max_length=255)
    user_permissions = models.CharField(max_length=255)
    email = models.CharField(max_length=255)
    is_staff = models.CharField(max_length=255)
    is_superuser = models.CharField(max_length=255)
    is_active = models.CharField(max_length=255)
    chats = models.ForeignKey("self", on_delete=models.SET_NULL, null=True, blank=True)
    conversations = models.ManyToManyField("Conversation")

    channel_name = models.CharField(max_length=255)
    USERNAME_FIELD = "username"
    friends = models.ManyToManyField("self")
    blocked_users = models.ManyToManyField("self")
    status = models.CharField(max_length=10)

    objects = UserManager()

    paddleSpeed = models.IntegerField(
        default=50, validators=[MinValueValidator(1), MaxValueValidator(100)]
    )
    ballSpeed = models.IntegerField(
        default=5, validators=[MinValueValidator(1), MaxValueValidator(10)]
    )
    paddleColor = models.CharField(default="#feffff", max_length=50, blank=True)
    ballColor = models.CharField(default="#feffff", max_length=50, blank=True)
    backgroundColor = models.CharField(default="#000000", max_length=50, blank=True)

    # game settings
    # paddle_speed = models.IntegerField(default=12)
    # ball_speed = models.IntegerField(default=0)
    # paddle_color = models.CharField(max_length=50, blank=True)
    # game_img = models.ImageField(upload_to='game_images/', null=True, blank=True)

    def get_username(self):
        return self.username

    def save(self, *args, **kwargs):
        if not self.nickname:
            self.nickname = self.username
        super().save(*args, **kwargs)

    def __str__(self):
        return self.username


class Conversation(models.Model):
    participants = models.ForeignKey(User, on_delete=models.CASCADE)
    messages = models.ManyToManyField("Message")
    # unread = models.BooleanField(default=True)

    def __str__(self):
        return self.participants


class Message(models.Model):
    sender = models.ForeignKey(
        User, on_delete=models.CASCADE, null=False, blank=False, related_name="sender"
    )
    target = models.ForeignKey(
        User, on_delete=models.CASCADE, null=False, blank=False, related_name="target"
    )
    message = models.TextField(null=False, blank=False)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender}@{self.timestamp}"


class GameTeam(models.Model):
    team = models.ForeignKey("Team", on_delete=models.CASCADE)
    game = models.ForeignKey("Game", on_delete=models.CASCADE)
    score = models.PositiveSmallIntegerField(default=0)

    def __str__(self):
        return f"Team: {self.team}, Game: {self.game}, Score: {self.score}"


class Team(models.Model):
    users = models.ManyToManyField(User)
    max_player = models.PositiveSmallIntegerField(default=2)

    def add_player(self, player_id):
        if self.users.count() < self.max_player:
            self.users.add(player_id)

    # @target(pre_delete, sender=User)
    # def pre_delete_User_in_team(sender, instance, created, **kwargs):
    #     team_list = Team.objects.filter(users=None)
    #     for team in team_list:
    #         team.delete()

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
    max_points = models.PositiveSmallIntegerField(default=5)
    style = models.CharField(max_length=100, default="not defined")
    opponent = models.CharField(max_length=255, null=True, default=None)
    winner = models.ForeignKey(
        Team, on_delete=models.CASCADE, related_name="games_won", null=True
    )

    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(null=True, blank=True)
    style = models.CharField(max_length=100, default="not defined")
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
    # teams = models.ManyToManyField(Team, related_name="joined_tournaments", blank=True)
    # max_teams = models.PositiveIntegerField(null=True, blank=True)
    status = "open"

    def register_team(self, team):
        if self.status != "open":
            raise Exception("Can't add team to tournament: registration is closed")
        if self.teams.count() >= self.max_teams:
            raise Exception("Can't add team to tournament: tournament is full")
        self.teams.add(team)

    def setup_games(self):
        self.status = "closed"
        games = [Game()]
        num_teams = self.max_teams
        while num_teams > 1:
            round_games = [Game() for _ in range(num_teams // 2)]
            games.append(round_games)
            num_teams //= 2
        return games

    def start(self):
        self.games = self.setup_games()
        teams = list(self.teams.all())
        random.shuffle(teams)
        for i in range(0, len(teams), 2):
            self.games[i // 2].add_teams(teams[i], teams[i + 1])

    # @target(post_save, sender=Game)
    # def listen_to_games(self, sender, instance, **kwargs):
    #     if instance.status == "finished":
    #         for round_games in self.games:
    #             if instance in round_games:
    #                 round_index = self.games.index(round_games)
    #                 game_index = round_games.index(instance)
    #                 if round_index < len(self.games) - 1:  # if not the final round
    #                     next_game = self.games[round_index + 1][game_index // 2]
    #                     next_game.add_team(instance.winner)
    #                 break

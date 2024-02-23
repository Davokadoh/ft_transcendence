from django.contrib.auth.models import AbstractBaseUser, UserManager
from django.core.files.storage import FileSystemStorage
from django.db.models.signals import pre_delete
from channels.layers import get_channel_layer
from django.conf import settings
from django.db import models
from .player import Player
from .ball import Ball
import asyncio
import pathlib
import random
import os


class OverwriteStorage(FileSystemStorage):
    def get_available_name(self, name, max_length):
        if self.exists(name):
            os.remove(os.path.join(settings.MEDIA_ROOT, name))
        return name


def user_directory_path(instance, filename):
    return f"profil_pictures/{instance.username}{pathlib.Path(filename).suffix}"


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
    chats = models.ManyToManyField("self")
    friends = models.ManyToManyField("self")
    USERNAME_FIELD = "username"

    objects = UserManager()

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


class Message(models.Model):
    sender = models.ForeignKey(
        User, on_delete=models.CASCADE, null=False, blank=False, related_name="sender"
    )
    target = models.ForeignKey(
        User, on_delete=models.CASCADE, null=False, blank=False, related_name="target"
    )
    message = models.TextField(null=False, blank=False)
    timestamp = models.DateTimeField(auto_now_add=True)


class GameTeam(models.Model):
    team = models.ForeignKey("Team", on_delete=models.CASCADE)
    game = models.ForeignKey("Game", on_delete=models.CASCADE)
    score = models.PositiveSmallIntegerField(default=0)


class Team(models.Model):
    users = models.ManyToManyField(User)
    max_player = 2

    def add_player(self, player_id):
        if self.users.size() < self.max_player:
            self.users.add(player_id)

    # @target(pre_delete, sender=User)
    # def pre_delete_User_in_team(sender, instance, created, **kwargs):
    #     team_list = Team.objects.filter(users=None)
    #     for team in team_list:
    #         team.delete()


Status = models.IntegerChoices("Status", "LOBBY PLAY PAUSE END")

class Tteam():
    def __init__(self):
        self.score = 0
        self.name = ""


class Game(models.Model):
    field = {"width": 800, "height": 600}
    teams = models.ManyToManyField(
        Team, through=GameTeam, through_fields=("game", "team")
    )
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(null=True, blank=True)
    status = models.IntegerField(choices=Status, default=Status.LOBBY)
    max_points = 2
    max_pause_per_player = 1
    players = []
    ball = Ball(field["width"] / 2, field["height"] / 2)
    left_team = Tteam()
    right_team = Tteam()
    state = {}

    async def send(self, content):
        await get_channel_layer().group_send(f"game_{self.pk}", content)

    async def ready(self, player):
        await self.send({"type": "player_ready", "player": player.username})
        await self.play()

    async def start(self):
        for player in self.players:
            player.pos_y = self.field["height"] / 2
        self.ball.pos_x, self.ball.pos_y = (
            self.field["width"] / 2,
            self.field["height"] / 2,
        )

    async def play(self):
        if self.status is Status.PLAY:
            return
        if all(player.ready for player in self.players):
            if self.status is Status.LOBBY:
                await self.start()
            self.status = Status.PLAY
            await self.send({"type": "game_status", "status": self.status})
            asyncio.create_task(self.loop())

    async def pause(self, player):
        if player.pauseLeft <= 0:
            player.consumer.send({"type": "pause_refused"})
            return
        player.pauseLeft -= 1
        self.status = Status.PAUSE
        await self.send({"type": "game_pause", "status": self.status})
        for player in self.players:
            player.ready = False

    async def score(self, team):
        print("SCORE")
        team.score += 1
        await self.send({"type": "game_score", "team": team.name})
        if team.score >= self.max_points:
            self.status = Status.END
            await self.send({"type": "game_status", "status": self.status})
        else:
            self.ball.pos_x, self.ball.pos_y = (
                self.field["width"] / 2,
                self.field["height"] / 2,
            )

    async def loop(self):
        while self.status is Status.PLAY:
            await self.update()

    async def update(self):
        for p in self.players:
            p.pos_y += p.speed_y
            p.pos_y = max(0, min(p.pos_y, self.field["height"] - p.height / 2))

        # Check ball collision with players
        for player in self.players:
            if (
                player.pos_y - player.height / 2 <= self.ball.pos_y + self.ball.radius
                and self.ball.pos_y - self.ball.radius
                <= player.pos_y + player.height / 2
                and player.pos_x - player.width / 2
                <= self.ball.pos_x + self.ball.radius
                and self.ball.pos_x - self.ball.radius
                <= player.pos_x + player.width / 2
            ):
                self.ball.speed_x *= -1

        # Check ball collision with sides
        new_x = self.ball.pos_x + self.ball.speed_x
        if new_x <= self.ball.radius:
            await self.score(self.left_team)
        elif new_x >= self.field["width"] - self.ball.radius:
            await self.score(self.right_team)
        else:
            self.ball.pos_x = new_x

        # Check ball collision with top and bot
        new_y = self.ball.pos_y + self.ball.speed_y
        if (
            new_y <= self.ball.radius
            or self.field["height"] - self.ball.radius <= new_y
        ):
            self.ball.speed_y *= -1
        self.ball.pos_y += self.ball.speed_y

        for player in self.players:
            self.state.update({f"player_{player.consumer.user.username}_y": player.pos_y})
        self.state.update({"ball_x": self.ball.pos_x})
        self.state.update({"ball_y": self.ball.pos_y})

        print(self.state)
        await self.send(
            {
                "type": "game_update",
                "state": self.state,
            }
        )

        await asyncio.sleep(2/1000)
































































#     @receiver(pre_delete, sender=Team)
#     def pre_delete_team_in_game(sender, instance, created, **kwargs):
#         games_list = Game.objects.filter(teams=None)
#         for game in games_list:
#             game.delete()


class Tournament(models.Model):
    teams = models.ManyToManyField(Team, related_name="joined_tournaments", blank=True)
    max_teams = models.PositiveIntegerField()
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

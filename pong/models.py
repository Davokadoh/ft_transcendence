import asyncio
import time
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, UserManager
from django.db.models.signals import pre_delete
import random
from channels.layers import get_channel_layer
from .player import Player
from .ball import Ball
import pathlib
from django.core.files.storage import FileSystemStorage
from django.conf import settings
import os
from django.core.validators import MinValueValidator, MaxValueValidator


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
    USERNAME_FIELD = "username"
    friends = models.ManyToManyField("self")

    objects = UserManager()

    paddleSpeed = models.IntegerField(
        default=50, validators=[MinValueValidator(1), MaxValueValidator(100)]
    )
    ballSpeed = models.IntegerField(
        default=5, validators=[MinValueValidator(1), MaxValueValidator(10)]
    )
    paddleColor = models.CharField(max_length=50, blank=True)
    ballColor = models.CharField(max_length=50, blank=True)
    backgroundColor = models.CharField(max_length=50, blank=True)

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
    left = models.BooleanField(default=True)


class Team(models.Model):
    name = models.CharField(max_length=255)
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


Status = models.TextChoices("Status", "LOBBY PLAY PAUSE END")


class Game(models.Model):
    field = {"width": 800, "height": 450}
    teams = models.ManyToManyField(
        Team, through=GameTeam, through_fields=("game", "team")
    )
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(null=True, blank=True)
    status = models.TextField(choices=Status, default=Status.LOBBY)
    max_points = models.PositiveSmallIntegerField(default=5)
    max_pause_per_player = 1
    players = list()
    ball = Ball(field["width"] / 2, field["height"] / 2)
    state = {}
    background_tasks = set()

    async def send(self, content):
        await get_channel_layer().group_send(f"game_{self.pk}", content)

    async def ready(self, player):
        await self.arefresh_from_db()
        for p in self.players:
            print(f"{p.consumer.user.username}:{' not' if not p.ready else ''} ready")
        print(f"status is {self.status}")
        await self.send({"type": "game_ready", "player": player.username})
        if self.status == Status.LOBBY or self.status == Status.PAUSE:
            await self.play()

    async def play(self):
        if all(player.ready for player in self.players):
            self.left = await self.gameteam_set.afirst()
            self.right = await self.gameteam_set.alast()
            print(f"Play with status: {self.status}")
            if self.status == Status.LOBBY:
                await self.reset()
            self.status = Status.PLAY
            await self.asave()
            await self.send({"type": "game_status", "status": self.status})
            task = asyncio.create_task(self.loop())
            self.background_tasks.add(task)
            task.add_done_callback(self.background_tasks.discard)

    async def pause(self, player=None):
        if player is not None and player.pauseLeft <= 0:
            await self.send(
                {"type": "pause_refused", "player": player.consumer.user.username}
            )
            return
        player.pauseLeft -= 1
        self.status = Status.PAUSE
        await self.asave()
        await self.send({"type": "game_status", "status": self.status})
        for player in self.players:
            player.ready = False

    async def end(self):
        self.status = Status.END
        await self.asave()
        await self.send({"type": "game_status", "status": self.status})
        self.players.clear()
        for p in self.players:
            await p.consumer.leave_game()

    async def reset(self):
        self.players[0].pos_x = 10
        self.players[1].pos_x = self.field["width"] - 10 - self.players[1].width
        for player in self.players:
            player.pos_y = self.field["height"] / 2 - player.height / 2
        self.ball.pos_x = self.field["width"] / 2
        self.ball.pos_y = self.field["height"] / 2
        print("RESET")
        await self.sendUpdate()

    async def score(self, team, side):
        team.score += 1
        await team.asave()
        await self.send({"type": "game_score", "team": side})
        await self.reset()
        print(f"{self.left.score} : {self.right.score}")
        if team.score >= self.max_points:
            await self.end()

    async def loop(self):
        while self.status == Status.PLAY:
            begin = time.time()
            await self.step()
            delta = begin - time.time()
            sleep = max(2 - delta, 0)
            await asyncio.sleep(sleep / 1000)
        print(f"Status: {self.status}")

    async def sendUpdate(self):
        for idx, p in enumerate(self.players):
            self.state.update({f"player_{idx}_x": p.pos_x})
            self.state.update({f"player_{idx}_y": p.pos_y})
        self.state.update({"ball_x": self.ball.pos_x})
        self.state.update({"ball_y": self.ball.pos_y})

        # print(self.state)
        await self.send(
            {
                "type": "game_update",
                "state": self.state,
            }
        )

    async def step(self):
        await self.sendUpdate()
        height = self.field["height"]
        width = self.field["width"]
        left = self.left
        right = self.right
        ball_radius = self.ball.radius
        ball_pos_x = self.ball.pos_x
        ball_pos_y = self.ball.pos_y
        for p in self.players:
            p.pos_y += p.speed_y
            p.pos_y = max(0, min(p.pos_y, height - p.height))

        # Check ball collision with players
        if any(
            p.pos_y <= ball_pos_y <= p.pos_y + p.height
            and p.pos_x <= ball_pos_x <= p.pos_x + p.width
            for p in self.players
        ):
            self.ball.speed_x *= -1

        # Check ball collision with sides
        new_x = ball_pos_x + self.ball.speed_x
        if new_x <= ball_radius:
            await self.score(right, 1)
        elif new_x >= width - ball_radius:
            await self.score(left, 0)
        else:
            self.ball.pos_x = new_x

        # Check ball collision with top and bot
        new_y = ball_pos_y + self.ball.speed_y
        if new_y <= ball_radius or height - ball_radius <= new_y:
            self.ball.speed_y *= -1
        self.ball.pos_y += self.ball.speed_y


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

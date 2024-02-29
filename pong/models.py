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

    paddleSpeed = models.IntegerField(default=50, validators=[MinValueValidator(1), MaxValueValidator(100)])
    ballSpeed = models.IntegerField(default=5, validators=[MinValueValidator(1), MaxValueValidator(10)])
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
    players = list[Player]
    # balls = list[Ball]
    ball = Ball(field["width"] / 2, field["height"] / 2)

    async def send(self, content):
        await get_channel_layer().group_send("game_{}".format(self.pk), content)

    def play(self):
        if all(self.players.ready):
            # await asyncio.sleep(3)
            if self.status is Status.LOBBY:
                self.start()
            self.status = Status.PLAY
            self.send({"type": "game_status", "status": self.status})
            while self.status is Status.PLAY:
                self.update

    def start(self):
        for player in self.players:
            player.y = self.field["height"] / 2
        self.ball.position = self.field["width"] / 2, self.field["height"] / 2

    async def pause(self, src):
        self.status = Status.PAUSE
        await self.send({"type": "game_pause", "by_player": src.username})
        # for player in self.players:
        #     player.ready = False

    def score(self, team):
        team.score += 1
        self.send({"type": "game_score", "status": self.score})
        if team.score >= self.max_points:
            self.status = Status.END
            self.send({"type": "game_status", "status": self.status})
        else:
            self.ball.position = self.field["width"] / 2, self.field["height"] / 2

    def update(self):
        # for item in self.players, self.balls:
        #     item.update()

        for p in self.players:
            p.pos.y += p.speed.y
            p.pos.y = max(0, min(p.pos.y, self.field["height"] - p.height / 2))

        # Check ball collision with players
        for player in self.players:
            if (
                player.pos.y - player.height / 2 <= self.ball.pos.y + self.ball.radius
                and self.ball.pos.y - self.ball.radius
                <= player.pos.y + player.height / 2
                and player.pos.x - player.width / 2
                <= self.ball.pos.x + self.ball.radius
                and self.ball.pos.x - self.ball.radius
                <= player.pos.x + player.width / 2
            ):
                self.ball.speed.x *= -1

        # Check ball collision with sides
        new_x = self.ball.pos.x + self.ball.speed.x
        if new_x <= self.ball.radius:
            self.score(self.left_team)
        elif new_x >= self.field["width"] - self.ball.radius:
            self.score(self.right_team)
        else:
            self.ball.pos.x = new_x

        # Check ball collision with top and bot
        new_y = self.ball.pos.y + self.ball.speed.y
        if (
            new_y <= self.ball.radius
            or self.field["height"] - self.ball.radius <= new_y
        ):
            self.ball.speed.y *= -1
        self.ball.pos.y += self.ball.speed.y

        self.send(
            {
                "type": "game_state",
                "state": {"ball": self.ball, "players": self.players},
            }
        )

    # winners = models.ForeignKey(
    #     settings.AUTH_USER_MODEL,
    #     related_name="games_won",
    #     on_delete=models.SET_NULL,
    #     null=True,
    #     blank=True,
    # )
    # losers = models.ForeignKey(
    #     settings.AUTH_USER_MODEL,
    #     related_name="games_lost",
    #     on_delete=models.SET_NULL,
    #     null=True,
    #     blank=True,
    # )


# class Game(models.Model):
#     teams = models.ManyToManyField(Team)
#     start_time = models.DateTimeField(auto_now_add=True)
#     end_time = models.DateTimeField(null=True, blank=True)

#     winners = models.ForeignKey(
#         settings.AUTH_USER_MODEL,
#         related_name="games_won",
#         on_delete=models.SET_NULL,
#         null=True,
#         blank=True,
#     )
#     losers = models.ForeignKey(
#         settings.AUTH_USER_MODEL,
#         related_name="games_lost",
#         on_delete=models.SET_NULL,
#         null=True,
#         blank=True,
#     )

#     def add_team(self):
#         new_team = Team.objects.create()
#         self.teams.add(new_team)

#     def add_player(self, player_id):
#         self.teams.first().add_player(player_id)

#     @receiver(pre_delete, sender=Team)
#     def pre_delete_team_in_game(sender, instance, created, **kwargs):
#         games_list = Game.objects.filter(teams=None)
#         for game in games_list:
#             game.delete()

# Class Game sur branche tournament :
# class Game(models.Model):
#     field = {"width": 800, "height": 600}
#     teams = models.ManyToManyField(
#         Team, through=GameTeam, through_fields=("game", "team")
#     )
#     start_time = models.DateTimeField(auto_now_add=True)
#     end_time = models.DateTimeField(null=True, blank=True)
#     status = models.IntegerField(choices=Status, default=Status.LOBBY)
#     max_points = 2
#     max_pause_per_player = 1
#     players = list[Player]
#     # balls = list[Ball]
#     ball = Ball(field["width"] / 2, field["height"] / 2)

class Remote(models.Model):
    field = {"width": 800, "height": 600}
    # teams = models.ManyToManyField(
    #     Team, through=GameTeam, through_fields=("game", "team")
    # )
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(null=True, blank=True)
    status = models.IntegerField(choices=Status, default=Status.LOBBY)
    max_points = 2
    max_pause_per_player = 1
    players = list[Player]
    # balls = list[Ball]
    ball = Ball(field["width"] / 2, field["height"] / 2)

class Tournament(models.Model):
    teams = models.ManyToManyField(User, related_name="joined_tournaments", blank=True)
    status = models.CharField(max_length=10, default="open")
    max_teams = models.PositiveIntegerField(null=True, blank=True)

    def setup_matches(self, teams):
        matches = []
        for i in range(0, len(teams), 2):
            match = Match(team1=teams[i], team2=teams[i + 1], tournament=self)
            match.save()
            matches.append(match)
        return matches

    def start_tournament(self):
        teams = list(self.teams.all())
        random.shuffle(teams)

        matches = self.setup_matches(teams)

        for match in matches:
            match.play()

    def playTournament(self):
        # le player 1 joue contre le player 3 dans la teams 1
        # le player 2 joue contre le player 4 dans la teams 2
        # les gagnants de chaque teams jouent l'un contre l'autre
        # Créer les équipes et mélanger les joueurs
        teams = list(self.teams.all())
        random.shuffle(teams)

        # Créer les matchs initiaux
        matches = self.setup_matches(teams)

        # Récupérer les gagnants des matchs initiaux
        winners = []
        for match in matches:
            winner = match.playMatch()
            winners.append(winner)

        # Créer le match final entre les gagnants
        final_match = Match.objects.create(
            tournament=self,
            team1=winners[0],
            team2=winners[1]
        )
        final_match.playMatch()
    


class Match(models.Model):
    tournament = models.ForeignKey(Tournament, related_name="matches", on_delete=models.CASCADE)
    team1 = models.ForeignKey(User, related_name="team1_matches", on_delete=models.CASCADE)
    team2 = models.ForeignKey(User, related_name="team2_matches", on_delete=models.CASCADE)
    winner = models.ForeignKey(User, related_name="won_matches", null=True, blank=True, on_delete=models.CASCADE)
    
    def get_total_score(self):
        # Obtenez la somme des scores de tous les utilisateurs dans l'équipe
        total_score = sum(user.score for user in self.users.all())
        return total_score
    
    def determine_winner(self):
        if self.team1.get_total_score() > self.team2.get_total_score():
            return self.team1.users.first()
        else:
            return self.team2.users.first()
        
    def playMatch(self):
        # Simuler le jeu entre team1 et team2
        # Déterminez le gagnant et mettez à jour le modèle Match
        # Retournez l'utilisateur gagnant
        winner = self.determine_winner()
        self.winner = winner
        self.save()
        return winner


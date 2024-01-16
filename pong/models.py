from django.conf import settings
from django.db import models
from django.contrib.auth.models import AbstractBaseUser
from django.db.models.signals import pre_delete, post_save
from django.dispatch import receiver
import random


class User(AbstractBaseUser):
    username = models.CharField(max_length=255, primary_key=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    groups = models.CharField(max_length=255)
    user_permissions = models.CharField(max_length=255)
    email = models.CharField(max_length=255)
    is_staff = models.CharField(max_length=255)
    is_superuser = models.CharField(max_length=255)
    is_active = models.CharField(max_length=255)
    USERNAME_FIELD = 'username'
    
    # firstname = models.CharField(max_length=255)
    # lastname = models.CharField(max_length=255)

    # def get_games_won(self):
    #     return Game.objects.filter("winners".contains(self)).count()

    # def get_games_lost(self):
    #     return Game.objects.exclude("winners".contains(self)).count()


class Team(models.Model):
    Users = models.ManyToManyField(User)

    @receiver(pre_delete, sender=User)
    def pre_delete_User_in_team(sender, instance, created, **kwargs):
        team_list = Team.objects.filter(Users=None)
        for team in team_list:
            team.delete()


class Game(models.Model):
    teams = models.ManyToManyField(Team, null=True)
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(null=True, blank=True)

    winners = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="games_won",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    losers = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="games_lost",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )

    @receiver(pre_delete, sender=Team)
    def pre_delete_team_in_game(sender, instance, created, **kwargs):
        games_list = Game.objects.filter(teams=None)
        for game in games_list:
            game.delete()


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

    @receiver(post_save, sender=Game)
    def listen_to_games(self, sender, instance, **kwargs):
        if instance.status == "finished":
            for round_games in self.games:
                if instance in round_games:
                    round_index = self.games.index(round_games)
                    game_index = round_games.index(instance)
                    if round_index < len(self.games) - 1:  # if not the final round
                        next_game = self.games[round_index + 1][game_index // 2]
                        next_game.add_team(instance.winner)
                    break
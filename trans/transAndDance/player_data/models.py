from django.db import models

class	Player_data(models.Model):
	firstname = models.CharField(max_length=255, default="placeholder")
	lastname = models.CharField(max_length=255, default="placeholder")
	nickname = models.CharField(max_length=255)


	def __str__(self):
		return f"{self.firstname} {self.lastname}"

class	Game(models.Model):
	player_one = models.ManyToManyField(
		"Player_data",
		related_name='player1'
	)
	player_two = models.ManyToManyField(
		"Player_data",
		related_name='player2'
	)
	point_p1 = models.IntegerField(null=True)
	point_p2 = models.IntegerField(null=True)

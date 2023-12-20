from django.db import models

class	Player_data(models.Model):
	firstname = models.CharField(max_length=255, default="placeholder")
	lastname = models.CharField(max_length=255, default="placeholder")
	email = models.CharField(max_length=255, default="placeholder")
	nickname = models.CharField(max_length=255, unique=True)


	def __str__(self):
		return f"{self.firstname} {self.lastname}"

	#def get(self):
	#	return self.str()

class Game(models.Model):
    # Utilisez des noms plus explicites pour les clés étrangères
    player_one = models.ForeignKey(Player_data, on_delete=models.CASCADE, related_name='player_one')
    player_two = models.ForeignKey(Player_data, on_delete=models.CASCADE, related_name='player_two', null=True)
    point_p1 = models.IntegerField(null=True)
    point_p2 = models.IntegerField(null=True)

    def __str__(self):
        return f"{self.player_one.nickname} vs {self.player_two.nickname}"

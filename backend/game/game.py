import random

class PongGame:
    def __init__(self):
        self.players = {}  # Utiliser un dictionnaire vide pour stocker les positions des joueurs
        self.ball = {'x': 0, 'y': 0, 'speed_x': 1, 'speed_y': 1}  # Position et vitesse de la balle
        self.field_width = 800
        self.field_height = 600
        self.paddle_width = 10
        self.paddle_height = 100

        # Initialiser les positions des joueurs et de la balle
        self.reset_game()

    def reset_game(self):
        # Réinitialiser les positions des joueurs et de la balle
        self.players = {'player1': self.field_height // 2, 'player2': self.field_height // 2}
        self.ball = {'x': self.field_width // 2, 'y': self.field_height // 2, 'speed_x': 1, 'speed_y': 1}

    def update_position(self, player_id, direction):
        # Mettre à jour la position du joueur

        if player_id not in self.players:
            # Ajoutez le joueur avec une position initiale (par exemple, au milieu de l'écran)
            self.players[player_id] = self.field_height // 2
        
        print("position player:", player_id)
        print("direction:", direction)
        if player_id in self.players:
            if direction == 'up':
                print("up")
                self.players[player_id] -= 10  # Ajustez la valeur selon votre besoin
            elif direction == 'down':
                print("down")
                self.players[player_id] += 10  # Ajustez la valeur selon votre besoin

        # Mettre à jour la position de la balle
        self.ball['x'] += self.ball['speed_x']
        self.ball['y'] += self.ball['speed_y']

        # Vérifier les collisions avec les raquettes
        for player, position in self.players.items():
            if (
                position - self.paddle_height / 2 < self.ball['y'] < position + self.paddle_height / 2
                and player_id != player
            ):
                self.ball['speed_x'] *= -1

        # Vérifier les collisions avec les bords du terrain
        if self.ball['y'] <= 0 or self.ball['y'] >= self.field_height:
            self.ball['speed_y'] *= -1

        # Vérifier si la balle est sortie de l'écran
        if self.ball['x'] <= 0 or self.ball['x'] >= self.field_width:
            self.reset_game()

    # Renvoyer l'état actuel du jeu
    def get_state(self):
        return {
            'players': self.players,
            'ball': self.ball,
        }
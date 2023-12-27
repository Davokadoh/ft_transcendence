import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .game import PongGame

class PongConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.game = PongGame()

    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'pong_{self.room_name}'

        # Joindre le groupe de la salle
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Quitter le groupe de la salle lorsqu'une connexion est fermée
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        # Recevoir et traiter les données du client
        data = json.loads(text_data)
        message_type = data['type']

        if message_type == 'key_press':
            # Appeler la méthode handle_key_press avec la touche pressée
            key = data['key']
            player_id = data['player_id']
            await self.handle_key_press(data, key, player_id)

        if message_type == 'start_game':
            # Initialiser le jeu et informer tous les joueurs de commencer
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'game_start',
                }
            )
        elif message_type == 'update_position':
            # Mettre à jour la position du joueur et la logique du jeu
            position = data['position']
            self.game.update_position(self.scope['user'].username, position)

            # Renvoyer l'état du jeu à tous les joueurs
            await self.send(text_data=json.dumps({
                'type': 'game_state',
                'state': self.game.get_state(),
            }))

    async def game_start(self, event):
        # Envoyer un message à tous les joueurs pour indiquer que le jeu a commencé
        await self.send_game_state(event)

    async def send_position(self, event):
        # Envoyer la nouvelle position de la raquette à tous les joueurs
        position = event['position']
        await self.send(text_data=json.dumps({
            'type': 'update_position',
            'position': position,
        }))

    async def send_game_state(self, event):
        # Envoyer l'état actuel du jeu à tous les joueurs
        await self.send(text_data=json.dumps({
            'type': 'game_state',
            'state': self.game.get_state(),
        }))

    async def handle_key_press(self, data, key, player_id):
        # Ajoutez votre logique pour traiter la pression de touche
        # Par exemple, déplacez la raquette en fonction de la touche
        #print('Key pressed:', key)
        #print('player:', player_id)
        if key == 'arrowup' or key == 'w':
            self.game.update_position(player_id, 'up')
        elif key == 'arrowdown' or key == 's':
            self.game.update_position(player_id, 'down')

        # Ensuite, envoyez la mise à jour à tous les clients
        await self.send_state_update_to_group()

    async def send_state_update_to_group(self):
        # Logique pour récupérer l'état du jeu et l'envoyer à tous les clients
        state = self.game.get_state()  # Utilisez la méthode get_state de votre PongGame
        await self.send(text_data=json.dumps({
            'type': 'game_state',
            'state': state,
    }))
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from .models import Chat, Message


class Consumer(AsyncJsonWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.pauseLeft = 1

    async def connect(self):
        # self.game = await Game.objects.aget(
        #     id=self.scope["url_route"]["kwargs"]["game_id"]
        # )
        # self.game_group = "game_{}".format(self.game.id)
        chats = Chat.objects.filter(users=self.scope["user"])
        async for chat in chats:
            await self.channel_layer.group_add(chat.pk, self.channel_name)
        await self.channel_layer.group_add("server", self.channel_name)
        await self.accept()

    async def disconnect(self):
        # if self.game.status is not Status.END:
        #     self.receive_json({"type": "PAUSE"})
        await self.channel_layer.group_discard(self.group, self.channel_name)

    async def receive_json(self, content):
        print(content)
        if content["type"] == "KEY_PRESS":
            await self.handle_key_press(content["key"])
        elif content["type"] == "READY":
            await self.ready()
        elif content["type"] == "PAUSE":
            if self.pauseLeft > 0:
                self.pauseLeft -= 1
                await self.game.pause(self.scope["user"])
            else:
                await self.send_json({"type": "pause_refused"})
        elif content["type"] == "message":
            Message.objects.acreate(content)
            async for chat in self.chats:
                await self.channel_layer.send_group(chat, content)
        elif content["type"] == "game_invite":
            print("Invited received!")

    async def ready(self):
        self.player.status = True
        # self.game.send(
        #     {
        #         "type": "player_status",
        #         "user": self.game.pause(self.scope["user"]),
        #         "status": "READY",
        #     }
        # )
        # self.game.play()

    async def handle_key_press(self, key):
        print("User: {} Key: {}", self.game.pause(self.scope["user"]), key)
        if key == "arrowup" or key == "w":
            self.player.move("UP")
        elif key == "arrowdown" or key == "s":
            self.player.move("DOWN")

    async def game_pause(self, content):
        await self.send_json(content)

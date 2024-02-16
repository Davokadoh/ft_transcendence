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
        self.chats = Chat.objects.filter(users=self.scope["user"])
        # async for chat in self.chats:
        async for chat in Chat.objects.filter(users=self.scope["user"]):
            print("chat_{}".format(chat.pk))
            await self.channel_layer.group_add("chat_{}".format(chat.pk), self.channel_name)
        await self.channel_layer.group_add("server", self.channel_name)
        await self.accept()

    async def disconnect(self):
        # if self.game.status is not Status.END:
        #     self.receive_json({"type": "PAUSE"})
        async for chat in self.chats:
            await self.channel_layer.group_discard("chat_{}".format(chat.pk), self.channel_name)
        await self.channel_layer.group_discard("server", self.channel_name)

    async def receive_json(self, content):
        print(content)
        if "type" not in content:
            print("type field does not exist")
            return
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
        elif content["type"] == "chat_message":
            print("Message received!")
            # content["sender"] = self.scope["user"]
            Message.objects.acreate(**content)
            print("Message created!")
            content["type"] = "send_chat_message"
            async for chat in self.chats:
                print("chat_{}".format(chat.pk))
                await self.channel_layer.send_group("chat_{}".format(chat.pk), content)
        elif content["type"] == "game_invite":
            print("Invited received!")
        else:
            print("type not found")

    async def send_chat_message(self, content):
        print("sending to user {}".format(self.scope["user"]))
        await self.send_json(content)

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

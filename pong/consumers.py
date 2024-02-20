from channels.generic.websocket import AsyncJsonWebsocketConsumer
from .models import Message, User


class Consumer(AsyncJsonWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.user = None
        self.pauseLeft = 1

    async def connect(self):
        self.user = self.scope["user"]
        if not self.user.is_authenticated:
            return
        async for chat in User.objects.filter(chats=self.user):
            await self.channel_layer.group_add(f"chat_{chat.pk}", self.channel_name)
            print("user {} added to user {}'s channel group".format(self.user, chat.pk))
        await self.channel_layer.group_add("server", self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        async for chat in User.objects.filter(chats=self.user):
            await self.channel_layer.group_discard(f"chat_{chat.pk}", self.channel_name)
        await self.channel_layer.group_discard("server", self.channel_name)

    async def receive_json(self, content):
        print(content)
        if "type" not in content:
            return
        if content["type"] == "KEY_PRESS":
            await self.handle_key_press(content["key"])
        elif content["type"] == "READY":
            await self.ready()
        elif content["type"] == "PAUSE":
            await self.game.pause(self.user)
        elif content["type"] == "chat_message":
            await self.receive_chat(content)
        elif content["type"] == "game_invite":
            print("Invited received!")
        else:
            print("Type not found")

    async def receive_chat(self, content):
        print("Message received!")
        # target = content.get("chat")
        target = "Davokadoh"
        chat = await User.objects.aget(username=target)
        if chat is None:
            return
        if self.user.chats is None:
            self.user.chats = chat
        else:
            await self.user.chats.aadd(chat)
        await self.channel_layer.group_add(f"chat_{chat.pk}", self.channel_name)
        await Message.objects.acreate(
            sender=self.user, target=chat, message=content.get("message")
        )
        await self.channel_layer.group_send(f"chat_{chat.pk}", content)

    async def chat_message(self, content):
        print("send message...")
        await self.send_json(content["message"])

    async def ready(self):
        self.player.status = True
        # self.game.send(
        #     {
        #         "type": "player_status",
        #         "user": self.game.pause(self.user),
        #         "status": "READY",
        #     }
        # )
        # self.game.play()

    async def handle_key_press(self, key):
        print("User: {} Key: {}", self.game.pause(self.user), key)
        if key == "arrowup" or key == "w":
            self.player.move("UP")
        elif key == "arrowdown" or key == "s":
            self.player.move("DOWN")

    async def game_pause(self, content):
        await self.send_json(content)
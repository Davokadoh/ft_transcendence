from channels.generic.websocket import AsyncJsonWebsocketConsumer
from .models import Message, User


class Consumer(AsyncJsonWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.user = None

    async def connect(self):
        self.user = self.scope["user"]
        if not self.user.is_authenticated:
            return
        self.user.online = True
        async for chat in User.objects.filter(chats=self.user):
            await self.channel_layer.group_add(f"chat_{chat.pk}", self.channel_name)
            print(f"user {self.user.username} added to user {chat.pk}'s channel group")
        await self.channel_layer.group_send(
            "server", {"type": "connection", "user": self.user.username}
        )
        await self.channel_layer.group_add("server", self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        self.user.online = False
        await self.channel_layer.group_discard("server", self.channel_name)
        await self.channel_layer.group_send(
            "server", {"type": "disconnection", "user": self.user.username}
        )
        async for chat in User.objects.filter(chats=self.user):
            await self.channel_layer.group_discard(f"chat_{chat.pk}", self.channel_name)

    async def receive_json(self, content):
        print(content)
        if "type" not in content:
            return
        if content["type"] == "key_press":
            await self.handle_key_press(content.get("key"))
        elif content["type"] == "player_ready":
            await self.ready()
        elif content["type"] == "player_pause":
            await self.game.pause(self.user)
        elif content["type"] == "chat_message":
            await self.receive_chat(content)
        elif content["type"] == "game_invite":
            print("Invited received!")
        else:
            print(f"Unknown message type: {content['type']}")

    async def receive_chat(self, content):
        target = "Davokadoh"  # content.get("chat")
        chat = await User.objects.aget(username=target)
        await self.channel_layer.group_add(f"chat_{chat.pk}", self.channel_name)
        await Message.objects.acreate(
            sender=self.user, target=chat, message=content.get("message")
        )
        await self.channel_layer.group_send(f"chat_{chat.pk}", content)

    async def connection(self, content):
        await self.send_json(content)

    async def disconnection(self, content):
        await self.send_json(content)

    async def chat_message(self, content):
        await self.send_json(content["message"])

    async def ready(self):
        self.game.send(
            {
                "type": "player_ready",
                "user": self.user.username,
            }
        )
        self.game.play()

    async def game_pause(self, content):
        await self.send_json(content)

    async def handle_key_press(self, key):
        print("User: {} Key: {}", self.game.pause(self.user), key)
        if key == "arrowup" or key == "w":
            self.player.move("UP")
        elif key == "arrowdown" or key == "s":
            self.player.move("DOWN")

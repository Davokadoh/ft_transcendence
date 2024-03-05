from channels.generic.websocket import AsyncJsonWebsocketConsumer
from .models import Message, User, Conversation
from asgiref.sync import sync_to_async
from .engine import Engine
from .player import Player
from datetime import datetime

games = {}


class Consumer(AsyncJsonWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.user = None
        self.pauseLeft = 1

    async def connect(self):
        self.user = self.scope["user"]
        if not self.user.is_authenticated:
            await self.close()
            return
        user = await User.objects.aget(username=self.user.pk)
        user.channel_name = self.channel_name
        await user.asave()
        await self.channel_layer.group_add("server", self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("server", self.channel_name)

    async def receive_json(self, content):
        print(content)
        if "type" not in content:
            return
        if content["type"] == "game_move":
            await self.handle_key_press(content.get("direction"))
        elif content["type"] == "game_join":
            await self.join_game(content)
        elif content["type"] == "player_ready":
            self.player.ready = True
            await self.game.ready(self.user)
        elif content["type"] == "player_pause":
            await self.game.pause(self.player)
        elif content["type"] == "chat_message":
            await self.receive_chat(content)
        elif content["type"] == "manage_conversation":
            await self.manage_conversation(content)
        elif content["type"] == "game_invite":
            print("Invited received!")
        else:
            print(f"Unknown message type: {content['type']}")

    async def receive_chat(self, content):
        time_for_all = datetime.now().strftime("%H:%M")
        target = content["target"]
        target_instance = await User.objects.aget(username=target)

        await self.channel_layer.send(
            self.channel_name,
            {
                "type": "chat_message",
                "sender": self.user.username,
                "target": target,
                "message": content["message"],
                "timestamp": time_for_all,
            },
        )

        blocked_users = await target_instance.blocked_users.filter(
            pk=self.user.pk
        ).aexists()
        # check before send a message if sender was blocked
        if not blocked_users:
            await self.channel_layer.send(
                target_instance.channel_name,
                {
                    "type": "chat_message",
                    "sender": self.user.pk,
                    "target": target,
                    "message": content["message"],
                    "timestamp": time_for_all,
                },
            )

        # save conversations
        messages = await Message.objects.acreate(
            sender=self.user,
            target=target_instance,
            # conversation=conversation,
            message=content["message"],
            timestamp=time_for_all,
        )
        await self.update_or_create_conversation(target_instance, messages)

    async def chat_message(self, event):
        await self.send_json(
            {
                "type": event["type"],
                "sender": event["sender"],
                "target": event["target"],
                "message": event["message"],
                "timestamp": event["timestamp"],
            }
        )

    async def update_or_create_conversation(self, target_instance, messages):
        existing_conversation_sender = await self.user.conversations.filter(
            participants=target_instance
        ).aexists()

        if existing_conversation_sender:
            # update
            existing_conversation = await self.user.conversations.filter(
                participants=target_instance
            ).afirst()
            await existing_conversation.messages.aadd(messages)
        else:
            # create
            new_conversation = await Conversation.objects.acreate(
                participants=target_instance
            )
            await new_conversation.messages.aadd(messages)
            await self.user.conversations.aadd(new_conversation)

        blocked_users = await target_instance.blocked_users.filter(
            pk=self.user.pk
        ).aexists()
        if not blocked_users:
            existing_conversation_target = await target_instance.conversations.filter(
                participants=self.user
            ).aexists()

            if existing_conversation_target:
                # update
                existing_conversation = await target_instance.conversations.filter(
                    participants=self.user
                ).afirst()
                await existing_conversation.messages.aadd(messages)
            else:
                # create
                new_conversation = await Conversation.objects.acreate(
                    participants=self.user
                )
                await new_conversation.messages.aadd(messages)
                await target_instance.conversations.aadd(new_conversation)
        else:
            print("Blocked Users:", blocked_users)
            # displays
            # mess = await sync_to_async(list)(existing_conversation.messages.all())
            # for mes in mess:
            #     print(f"other Sender: [ {await sync_to_async(lambda: mes.sender)()} ")
            #     print(
            #         f"\n\nother Message: {await sync_to_async(lambda: mes.message)()} ]"
            #     )

    async def manage_conversation(self, content):
        print("==manage_conversation==: ")
        target = await User.objects.aget(username=content["target"])

        if content["action"] == "#remove":
            print("In remove conversation: ", content["target"])

            target = await User.objects.aget(username=content["target"])

            exist = await self.user.conversations.filter(participants=target).aexists()

            if exist:
                instance = await self.user.conversations.filter(
                    participants=target
                ).afirst()

                await self.user.conversations.aremove(instance)
                print(
                    f"{self.user.pk}: Conversation with {target.username} was removed"
                )

    async def join_game(self, content):
        game_id = content.get("game_id")
        if game_id not in games:
            games[game_id] = await sync_to_async(Engine)(game_id)
        self.game = games[game_id]
        self.player = Player(self)
        self.game.players.append(self.player)
        await self.channel_layer.group_add(f"game_{game_id}", self.channel_name)

    async def leave_game(self):
        await self.channel_layer.group_discard(
            f"game_{self.game.pk}", self.channel_name
        )

    async def disconnection(self, content):
        await self.send_json(content)

    async def game_ready(self, content):
        await self.send_json(content)

    async def pause_refused(self, content):
        await self.send_json(content)

    async def game_status(self, content):
        await self.send_json(content)

    async def game_update(self, content):
        await self.send_json(content)

    async def game_score(self, content):
        await self.send_json(content)

    async def handle_key_press(self, direction):
        if direction == "UP":
            self.player.speed_y = -1
        elif direction == "DOWN":
            self.player.speed_y = 1

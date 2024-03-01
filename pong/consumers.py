from channels.generic.websocket import AsyncJsonWebsocketConsumer
from .models import Message, User, Conversation
from asgiref.sync import sync_to_async
from datetime import datetime



class Consumer(AsyncJsonWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.user = None
        self.pauseLeft = 1

    async def connect(self):
        self.user = self.scope["user"]
        if not self.user.is_authenticated:
            return
        print("connection: ", self.user.pk)
        # async for chat in User.objects.filter(chats=self.user):
        #     await self.channel_layer.group_add(f"chat_{chat.pk}", self.channel_name)
        #     print("user {} added to user {}'s channel group".format(self.user, chat.pk))
        user = await sync_to_async(User.objects.get)(username=self.user.pk)
        user.channel_name = self.channel_name
        await sync_to_async(user.save)()

        await self.channel_layer.group_add("server", self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        # async for chat in User.objects.filter(chats=self.user):
        #     await self.channel_layer.group_discard(f"chat_{chat.pk}", self.channel_name)
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
        elif content["type"] == "manage_conversation":
            await self.manage_conversation(content)
        elif content["type"] == "game_invite":
            print("Invited received!")
        else:
            print("Type not found")

    async def receive_chat(self, content):
        print("==receive_chat FUNCTION==")

        time_for_all = datetime.now().strftime("%H:%M")
        target = content["target"]
        target_instance = await sync_to_async(User.objects.get)(username=target)

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

        blocked_users = await sync_to_async(
            target_instance.blocked_users.filter(pk=self.user.pk).exists
        )()
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
        messages = await sync_to_async(Message.objects.create)(
            sender=self.user,
            target=target_instance,
            # conversation=conversation,
            message=content["message"],
            timestamp=time_for_all,
        )
        await self.update_or_create_conversation(target_instance, messages)

    async def chat_message(self, event):
        print("send message...")
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
        existing_conversation_sender = await sync_to_async(
            self.user.conversations.filter(participants=target_instance).exists
        )()

        if existing_conversation_sender:
            # update
            existing_conversation = await sync_to_async(
                self.user.conversations.filter(participants=target_instance).first
            )()
            await sync_to_async(existing_conversation.messages.add)(messages)
        else:
            # create
            new_conversation = await sync_to_async(Conversation.objects.create)(
                participants=target_instance
            )
            await sync_to_async(new_conversation.messages.add)(messages)
            await sync_to_async(self.user.conversations.add)(new_conversation)

        blocked_users = await sync_to_async(
            target_instance.blocked_users.filter(pk=self.user.pk).exists
        )()
        if not blocked_users:
            existing_conversation_target = await sync_to_async(
                target_instance.conversations.filter(participants=self.user).exists
            )()

            if existing_conversation_target:
                # update
                existing_conversation = await sync_to_async(
                    target_instance.conversations.filter(participants=self.user).first
                )()
                await sync_to_async(existing_conversation.messages.add)(messages)
            else:
                # create
                new_conversation = await sync_to_async(Conversation.objects.create)(
                    participants=self.user
                )
                await sync_to_async(new_conversation.messages.add)(messages)
                await sync_to_async(target_instance.conversations.add)(new_conversation)
        else:
            await sync_to_async(print)("Blocked Users:", blocked_users)
            # displays
            # mess = await sync_to_async(list)(existing_conversation.messages.all())
            # for mes in mess:
            #     print(f"other Sender: [ {await sync_to_async(lambda: mes.sender)()} ")
            #     print(
            #         f"\n\nother Message: {await sync_to_async(lambda: mes.message)()} ]"
            #     )

    async def manage_conversation(self, content):
        print("==manage_conversation==: ")
        target = await sync_to_async(User.objects.get)(username=content["target"])

        if content["action"] == "#remove":
            print("In remove conversation: ", content["target"])

            target = await sync_to_async(User.objects.get)(username=content["target"])

            exist = await sync_to_async(
                self.user.conversations.filter(participants=target).exists
            )()

            if exist:
                instance = await sync_to_async(
                    self.user.conversations.filter(participants=target).first
                )()

                await sync_to_async(self.user.conversations.remove)(instance)
                print(
                    f"{self.user.pk}: Conversation with {target.username} was removed"
                )

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
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from .models import Message, CustomUser, Conversation, GameTeam, Team, Game
from django.utils import timezone
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
        user = await CustomUser.objects.aget(nickname=self.user.nickname)
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
        elif content["type"] == "game_invitation":
            print("Invited received!")
            await self.game_invitation(content)
        elif content["type"] == "alert_tournament":
            print("Invited received!")
            await self.alert_tournament(content)
        else:
            print(f"Unknown message type: {content['type']}")

    async def receive_chat(self, content):
        time_for_all = datetime.now().strftime("%H:%M")
        target = content["target"]
        target_instance = await CustomUser.objects.aget(username=target)
        sender_instance = await CustomUser.objects.aget(pk=self.user.pk)

        await self.channel_layer.send(
            self.channel_name,
            {
                "type": "chat_message",
                "sender": sender_instance.username,
                "sender_nickname": sender_instance.nickname,
                "target": target_instance.username,
                "target_nickname": target_instance.nickname,
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
                    "sender": sender_instance.username,
                    "sender_nickname": sender_instance.nickname,
                    "target": target_instance.username,
                    "target_nickname": target_instance.nickname,
                    "message": content["message"],
                    "timestamp": time_for_all,
                },
            )

        # save conversations
        messages = await Message.objects.acreate(
            type=content["type"],
            sender=self.user,
            target=target_instance,
            # conversation=conversation,
            message=content["message"],
            timestamp=time_for_all,
        )
        await self.update_or_create_conversation(target_instance, messages)

    async def alert_tournament(self, content):
        time_for_all = datetime.now().strftime("%H:%M")
        sender_instance = await User.objects.aget(pk=self.user.pk)
        targets = content["target"].split(",")

        for target in targets:
            target_instance = await User.objects.aget(nickname=target)
            blocked_users = await target_instance.blocked_users.filter(
                pk=self.user.pk
            ).aexists()
            # check before send a message if sender was blocked
            if not blocked_users:
                await self.channel_layer.send(
                    target_instance.channel_name,
                    {
                        "type": "chat_alert_tournament",
                        "id": content["id"],
                        "sender": sender_instance.username,
                        "sender_nickname": sender_instance.nickname,
                        "target": target_instance.username,
                        "target_nickname": target_instance.nickname,
                        "message": content["message"],
                        "timestamp": time_for_all,
                    },
                )

    async def game_invitation(self, content):
        time_for_all = datetime.now().strftime("%H:%M")
        target = content["target"]
        sender_instance = await CustomUser.objects.aget(pk=self.user.pk)
        target_instance = ""

        if "#invitation" in content["message"]:
            tab = content["message"].split(" ")
            if len(tab) == 2:  # invitation from remLobby
                target_instance = await CustomUser.objects.aget(nickname=target)
            elif len(tab) == 1:  # invitation from chat
                target_instance = await CustomUser.objects.aget(username=target)
                gameId = " " + await self.createGameId(content)
                content["message"] += gameId
        else:
            target_instance = await CustomUser.objects.aget(username=target)

        """
        elif "#decline" in content["message"]:
            tab = content["message"].split(" ")
            gameId = tab[1]
            await self.removeGameId(gameId)
        """

        await self.channel_layer.send(
            self.channel_name,
            {
                "type": "chat_invitation",
                "id": content["id"],
                "sender": sender_instance.username,
                "sender_nickname": sender_instance.nickname,
                "target": target_instance.username,
                "target_nickname": target_instance.nickname,
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
                    "type": "chat_invitation",
                    "id": content["id"],
                    "sender": sender_instance.username,
                    "sender_nickname": sender_instance.nickname,
                    "target": target_instance.username,
                    "target_nickname": target_instance.nickname,
                    "message": content["message"],
                    "timestamp": time_for_all,
                },
            )
        # save conversations
        messages = await Message.objects.acreate(
            id_msg=content["id"],
            type=content["type"],
            sender=self.user,
            target=target_instance,
            # conversation=conversation,
            message=content["message"],
            timestamp=time_for_all,
        )
        await self.update_or_create_conversation(target_instance, messages)

    async def chat_message(self, event):
        print("send message...")
        if event["type"] == "chat_message":
            await self.send_json(
                {
                    "type": event["type"],
                    "sender": event["sender"],
                    "sender_nickname": event["sender_nickname"],
                    "target": event["target"],
                    "target_nickname": event["target_nickname"],
                    "message": event["message"],
                    "timestamp": event["timestamp"],
                }
            )

    async def chat_invitation(self, event):
        print("send message chat invitation...")
        await self.send_json(
            {
                "type": "game_invitation",
                "id": event["id"],
                "sender": event["sender"],
                "sender_nickname": event["sender_nickname"],
                "target": event["target"],
                "target_nickname": event["target_nickname"],
                "message": event["message"],
                "timestamp": event["timestamp"],
            }
        )

    async def chat_alert_tournament(self, event):
        print("send message chat invitation...")
        await self.send_json(
            {
                "type": "alert_tournament",
                "id": event["id"],
                "sender": event["sender"],
                "sender_nickname": event["sender_nickname"],
                "target": event["target"],
                "target_nickname": event["target_nickname"],
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

    async def createGameId(self, content):
        game = await Game.objects.acreate(
            start_time=timezone.now(),
            style="Remote Play",
            # opponent=request.POST.get("player2"),
            # score=request.POST.get("scoreText", "0 - 0"),
        )

        team = await Team.objects.acreate()
        await team.asave()
        await team.users.aadd(self.user)
        gt = GameTeam(game=game, team=team)
        await gt.asave()

        # find by username for request from chat
        target = await CustomUser.objects.aget(username=content["target"])
        team2 = await Team.objects.acreate()
        await team2.asave()
        await team2.users.aadd(target)
        gt = GameTeam(game=game, team=team2)
        await gt.asave()
        await game.asave()

        return str(game.pk)

    async def removeGameId(self, gameId):
        print(gameId)
        remote = await Game.objects.aget(pk=gameId)
        if remote is not None:
            await remote.teams.all().adelete()
            await remote.adelete()
            print(f"GameId: ${gameId}: has been removed!")
        else:
            print(f"GameId: ${gameId}: Doesn't exist!")

    async def manage_conversation(self, content):
        print("==manage_conversation==: ")
        target = await CustomUser.objects.aget(username=content["target"])

        if content["action"] == "#remove":
            print("In remove conversation: ", content["target"])
            exist = await self.user.conversations.filter(participants=target).aexists()

            if exist:
                instance = await self.user.conversations.filter(
                    participants=target
                ).afirst()

                await self.user.conversations.aremove(instance)
                print(
                    f"{self.user.pk}: Conversation with {target.nickname} was removed"
                )

    async def join_game(self, content):
        gameId = content.get("gameId")
        print(gameId)
        if gameId not in games:
            games[gameId] = await sync_to_async(Engine)(gameId)
        self.game = games[gameId]
        self.player = Player(self)
        self.game.players.append(self.player)
        await self.channel_layer.group_add(f"game_{gameId}", self.channel_name)

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

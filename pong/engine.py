from channels.layers import get_channel_layer
from pong.models import Game
from .ball import Ball
import asyncio
import time

Status = {"LOBBY", "PLAY", "PAUSE", "END"}


class Engine:
    def __init__(self, gameId):
        self.game = Game.objects.get(pk=gameId)
        self.left = self.game.gameteam_set.first()
        self.right = self.game.gameteam_set.last()
        self.status = "LOBBY"
        self.width = 800  # Should be getted from game
        self.height = 650
        self.max_points = 5
        self.max_pause_per_player = 1
        self.players = list()
        self.ball = Ball(self.width / 2, self.height / 2)
        self.background_tasks = set()
        self.state = {}

    async def send(self, content):
        await get_channel_layer().group_send(f"game_{self.game.pk}", content)

    async def ready(self, player):
        for p in self.players:
            print(f"{p.consumer.user.username}:{' not' if not p.ready else ''} ready")
        await self.send({"type": "game_ready", "player": player.username})
        if self.status == "LOBBY" or self.status == "PAUSE":
            await self.play()

    async def play(self):
        if all(player.ready for player in self.players):
            if self.status == "LOBBY":
                await self.reset()
            self.status = "PLAY"
            await self.send({"type": "game_status", "status": self.status})
            task = asyncio.create_task(self.loop())
            self.background_tasks.add(task)
            task.add_done_callback(self.background_tasks.discard)

    async def pause(self, player):
        if player.pauseLeft <= 0:
            await self.send(
                {"type": "pause_refused", "player": player.consumer.user.username}
            )
            return
        player.pauseLeft -= 1
        self.status = "PAUSE"
        await self.send({"type": "game_status", "status": self.status})
        for player in self.players:
            player.ready = False

    async def end(self):
        self.status = "END"
        await self.send({"type": "game_status", "status": self.status})
        self.players.clear()
        for p in self.players:
            await p.consumer.leave_game()

    async def reset(self):
        self.players[0].pos_x = 10
        self.players[1].pos_x = self.width - 10 - self.players[1].width
        for player in self.players:
            player.pos_y = self.height / 2 - player.height / 2
        self.ball.pos_x = self.width / 2
        self.ball.pos_y = self.height / 2
        await self.sendUpdate()

    async def score(self, team, side):
        team.score += 1
        await self.send({"type": "game_score", "team": side})
        await self.reset()
        print(f"{self.left.score} : {self.right.score}")
        if team.score >= self.max_points:
            await self.end()

    async def loop(self):
        while self.status == "PLAY":
            begin = time.time()
            await self.step()
            delta = begin - time.time()
            sleep = max(2 - delta, 0)
            await asyncio.sleep(sleep / 1000)
        print(f"Status: {self.status}")

    async def sendUpdate(self):
        for idx, p in enumerate(self.players):
            self.state.update({f"player_{idx}_x": p.pos_x})
            self.state.update({f"player_{idx}_y": p.pos_y})
        self.state.update({"ball_x": self.ball.pos_x})
        self.state.update({"ball_y": self.ball.pos_y})

        # print(self.state)
        await self.send(
            {
                "type": "game_update",
                "state": self.state,
            }
        )

    async def step(self):
        await self.sendUpdate()
        height = self.height
        width = self.width
        left = self.left
        right = self.right
        ball_radius = self.ball.radius
        ball_pos_x = self.ball.pos_x
        ball_pos_y = self.ball.pos_y
        for p in self.players:
            p.pos_y += p.speed_y
            p.pos_y = max(0, min(p.pos_y, height - p.height))

        # Check ball collision with players
        if any(
            p.pos_y <= ball_pos_y <= p.pos_y + p.height
            and p.pos_x <= ball_pos_x <= p.pos_x + p.width
            for p in self.players
        ):
            self.ball.speed_x *= -1

        # Check ball collision with sides
        new_x = ball_pos_x + self.ball.speed_x
        if new_x <= ball_radius:
            await self.score(right, 1)
        elif new_x >= width - ball_radius:
            await self.score(left, 0)
        else:
            self.ball.pos_x = new_x

        # Check ball collision with top and bot
        new_y = ball_pos_y + self.ball.speed_y
        if new_y <= ball_radius or height - ball_radius <= new_y:
            self.ball.speed_y *= -1
        self.ball.pos_y += self.ball.speed_y

    async def syncToDb(self):
        self.game.status = self.status
        self.game.left.score.update(self.left.score)
        self.game.right.score.update(self.right.score)

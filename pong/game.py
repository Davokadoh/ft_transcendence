import asyncio


class Game():
    def __init__(self):
        self.left_team
        self.rigth_team
        self.ballSpeed = 1

    def play(self):
        asyncio.create_task(self.loop())

    def pause(self):
        self.status = "pause"

    def score(self):
        team.score += 1

    def update(self):
        self.ballX = 1
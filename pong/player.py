class Player:
    def __init__(self, consumer, x, y):
        self.consumer = consumer
        self.ready = False
        self.width = 25
        self.height = 100
        self.pos_x = x
        self.pos_y = y
        self.speed_y = 0
        self.pauseLeft = 2

    def move(self, direction):
        if direction == "UP":
            self.speed_y = -1
        elif direction == "DOWN":
            self.speed_y = 1
        print(f"Speed is {self.speed_y}")
class Player:
    def __init__(self, consumer, x, y):
        self.consumer = consumer
        self.ready = False
        self.width = 20
        self.height = 100
        self.pos_x = x
        self.pos_y = y
        self.speed_y = 0
        self.pauseLeft = 2
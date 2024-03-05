class Player:
    def __init__(self, consumer):
        self.consumer = consumer
        self.ready = False
        self.width = 20
        self.height = 100
        self.pos_x = 0
        self.pos_y = 0
        self.speed_y = 0
        self.pauseLeft = 2
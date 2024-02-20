class Player:
    def __init__(self, x, y):
        self.ready = False
        self.width = 10
        self.height = 1
        self.pos_x = x
        self.pos_y = y
        self.speed_y = 0
        self.pauseLeft = 2
        self.connected = False

import * as blessed from 'blessed';

class Paddle {
	private y: number;
	private element: blessed.Widgets.BoxElement;

	constructor(screen: blessed.Widgets.Screen, top: number, left: number) {
	this.y = top;
	this.element = blessed.box({
		top,
		left,
		width: 1,
		height: 5,
		style: { fg: 'white', bg: 'blue' }
	});
	screen.append(this.element);
	}

	moveUp() {
	if (this.y > 0) {
		this.y--;
		this.element.top = this.y;
		}
	}

	moveDown() {
	if (this.y < 15) { // Adjust height as needed
		this.y++;
		this.element.top = this.y;
		}
	}

		getX(): number {
			return this.element.left as number;
		}

		getY(): number {
			return this.y;
		}

		getWidth(): number {
			return this.element.width as number;
		}

		getHeight(): number {
			return this.element.height as number;
		}
	}

class Ball {
	private x: number;
	private y: number;
	private xSpeed: number;
	private ySpeed: number;
	private element: blessed.Widgets.BoxElement;
	private onBallOutOfBounds: () => void;

	constructor(screen: blessed.Widgets.Screen, onBallOutOfBounds: () => void) {
	this.x = 5;
	this.y = 5;
	this.xSpeed = 1;
	this.ySpeed = 1;
	this.onBallOutOfBounds = onBallOutOfBounds;

	this.element = blessed.box({
		top: this.y,
		left: this.x,
		width: 1,
		height: 1,
		style: { fg: 'white', bg: 'red' }
	});

	screen.append(this.element);
	}

	start() {
		// Faites démarrer la balle du centre en direction d'un côté de l'écran
		this.x = 5;
		this.y = 5;
		this.xSpeed = 2;
		this.ySpeed = 1;
	
		// Inversez la direction horizontale aléatoirement
		if (Math.random() < 0.5) {
		  this.xSpeed *= -1;
		}
	}

	move() {
	this.x += this.xSpeed;
	this.y += this.ySpeed;

	this.element.left = this.x;
	this.element.top = this.y;

	// // Rebondissement sur les bords horizontaux
	// if (this.x <= 0 || this.x >= 10) {
	// 	this.xSpeed *= -1;
	// 	}

	// 	// Rebondissement sur les bords verticaux (haut et bas)
	// 	if (this.y <= 0 || this.y >= 9) {
	// 	this.ySpeed *= -1;
	// 	}
	// }

	// Rebondissement sur les bords horizontaux
	if (this.x <= 0) {
		// La balle touche le mur gauche, elle disparait et la manche est perdue
		// Vous pouvez implémenter la logique appropriée ici, par exemple, réinitialiser la balle
		this.start();
	} else if (this.x >= 10) {
		// La balle touche le mur droit, elle disparait et la manche est perdue
		// Vous pouvez implémenter la logique appropriée ici, par exemple, réinitialiser la balle
		this.start();
	} else {
		// La balle est dans les limites horizontales, continuez le rebondissement sur les bords verticaux
		if (this.y <= 0 || this.y >= 9) {
			this.ySpeed *= -1;
		}
	}
}


	checkPaddleCollision(paddle: Paddle) {
		const paddleX = Number(paddle.getX());
		const paddleY = Number(paddle.getY());
		const paddleWidth = Number(paddle.getWidth());
		const paddleHeight = Number(paddle.getHeight());
		
		if (
			this.x === paddleX + paddleWidth &&
			this.y >= paddleY &&
			this.y <= paddleY + paddleHeight
		) {
			this.xSpeed *= -1;
		}
	}
	

	checkOutOfBounds() {
		// Vérifier si la balle est sortie de l'écran
		if (this.x <= 0 || this.x >= 10) {
			// Appeler la fonction de rappel pour signaler que la balle est sortie
			this.onBallOutOfBounds();
			}
		}
	}
	

class PongGame {
	private screen: blessed.Widgets.Screen;
	private paddle1: Paddle;
	private paddle2: Paddle;
	private ball: Ball;

	constructor() {
	this.screen = blessed.screen({
		smartCSR: true,
		title: 'Pong Game'
	});

	// Paddles start postions 
	this.paddle1 = new Paddle(this.screen, 6, 0);
	this.paddle2 = new Paddle(this.screen, 6, 50);
	this.ball = new Ball(this.screen, () => this.onBallOutOfBounds());

	// Appel à la méthode start pour initialiser la balle
	// this.ball.start();
	this.ball.start();
	
	// keyhook
	this.screen.key(['w'], () => this.paddle1.moveUp());
	this.screen.key(['s'], () => this.paddle1.moveDown());
	this.screen.key(['up'], () => this.paddle2.moveUp());
	this.screen.key(['down'], () => this.paddle2.moveDown());
	
	// Ajoutez cette ligne pour gérer la touche "q" pour quitter le jeu
	this.screen.key(['q', 'escape'], () => process.exit(0));
	}

	play() {
		this.screen.render();
		setInterval(() => {
		this.ball.move();
		this.ball.checkPaddleCollision(this.paddle1);
		this.ball.checkPaddleCollision(this.paddle2);
		this.ball.checkOutOfBounds();
		this.screen.render();
		}, 100);
	}

	private onBallOutOfBounds() {
		// La balle est sortie, réinitialisez la position de la balle actuelle
		// this.ball = new Ball(this.screen, () => this.onBallOutOfBounds());
		// Appel à la méthode start pour initialiser la nouvelle balle
		this.ball.start();
	}
}

const pongGame = new PongGame();
pongGame.play();

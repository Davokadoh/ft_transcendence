import socket from './index.js';

export function game(game_id) {
	let gameBoard;
	let ctx;
	let scoreText;
	let gameWidth;
	let gameHeight;
	let paddle1;
	let paddle2;
	let ballX;
	let ballY;
	let ballXDirection;
	let ballYDirection;
	let player1Score;
	let player2Score;
	let ballSpeed;
	const boardBackground = "black";
	const paddle1Color = "white";
	const paddle2Color = "white";
	const paddleBorder = "white";
	const ballColor = "white";
	const ballBorderColor = "white";
	const ballRadius = 12.5;
	const paddleSpeed = 12;
	// const paddleSpeed = {{ paddle_speed }};
	let gameRunning = false;

	function initializeGame() {
		gameBoard = document.getElementById("gameBoard");
		ctx = gameBoard.getContext("2d");
		scoreText = document.getElementById("scoreText");
		gameWidth = gameBoard.width;
		gameHeight = gameBoard.height;
		player1Score = 0;
		player2Score = 0;
		paddle1 = { width: 25, height: 100, x: 10, y: 5 };
		paddle2 = { width: 25, height: 100, x: gameWidth - 35, y: gameHeight - 105 };
		gameRunning = false;
		ballSpeed = 1;
		ballX = gameWidth / 2;
		ballY = gameHeight / 2;
		ballXDirection = 0;
		ballYDirection = 0;
		clearBoard();
		document.getElementsByClassName("close")[0].addEventListener("click", function () {
			document.getElementById("myModalGame").style.display = "none";
			resetGame();
		});
		document.querySelector('.modalButton').addEventListener('click', function () {
			document.getElementById("myModalGame").style.display = "none";
			resetGame();
		});
	}


	function draw() {
		if (!gameRunning) {
			return;
		}

		clearBoard();
		drawPaddles();
		moveBall();
		drawBall(ballX, ballY);
		checkCollision();
		requestAnimationFrame(draw);
	}

	function clearBoard() {
		ctx.fillStyle = boardBackground;
		ctx.fillRect(0, 0, gameWidth, gameHeight);
		ctx.strokeStyle = 'white';
		ctx.beginPath();
		ctx.moveTo(gameWidth / 2, 0);
		ctx.lineTo(gameWidth / 2, gameHeight);
		ctx.stroke();
	}

	function drawPaddles() {
		ctx.strokeStyle = paddleBorder;

		ctx.fillStyle = paddle1Color;
		ctx.fillRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);
		ctx.strokeRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);

		ctx.fillStyle = paddle2Color;
		ctx.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
		ctx.strokeRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
	}

	function moveBall() {
		ballX += ballSpeed * ballXDirection;
		ballY += ballSpeed * ballYDirection;
	}

	function drawBall(ballX, ballY) {
		ctx.fillStyle = ballColor;
		ctx.strokeStyle = ballBorderColor;
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.arc(ballX, ballY, ballRadius, 0, 2 * Math.PI);
		ctx.stroke();
		ctx.fill();
	}

	function createBall() {
		ballSpeed = 2;
		ballXDirection = Math.random() < 0.5 ? -1 : 1;
		ballYDirection = Math.random() < 0.5 ? -1 : 1;

		ballX = gameWidth / 2;
		ballY = gameHeight / 2;
		drawBall(ballX, ballY);
	}

	function checkCollision() {
		if (ballY <= 0 + ballRadius) {
			ballYDirection *= -1;
		}
		if (ballY >= gameHeight - ballRadius) {
			ballYDirection *= -1;
		}
		if (ballX <= 0) {
			player2Score += 1;
			updateScore();
			createBall();
			return;
		}
		if (ballX >= gameWidth) {
			player1Score += 1;
			updateScore();
			createBall();
			return;
		}
		if (ballX <= paddle1.x + paddle1.width + ballRadius) {
			if (ballY > paddle1.y && ballY < paddle1.y + paddle1.height) {
				ballX = paddle1.x + paddle1.width + ballRadius;
				ballXDirection *= -1;
				ballSpeed += 1;
			}
		}
		if (ballX >= paddle2.x - ballRadius) {
			if (ballY > paddle2.y && ballY < paddle2.y + paddle2.height) {
				ballX = paddle2.x - ballRadius;
				ballXDirection *= -1;
				ballSpeed += 1;
			}
		}
		endGame();
	}

	function changeDirection(event) {
		const keyPressed = event.keyCode;
		const paddle1Up = 87;
		const paddle1Down = 83;
		const paddle2Up = 38;
		const paddle2Down = 40;

		if (keyPressed === paddle2Down) {
			event.preventDefault();
		}

		switch (keyPressed) {
			case paddle1Up:
				if (paddle1.y > 0) paddle1.y -= paddleSpeed;
				break;
			case paddle1Down:
				if (paddle1.y < gameHeight - paddle1.height) paddle1.y += paddleSpeed;
				break;
			case paddle2Up:
				if (paddle2.y > 0) paddle2.y -= paddleSpeed;
				break;
			case paddle2Down:
				if (paddle2.y < gameHeight - paddle2.height) paddle2.y += paddleSpeed;
				break;
		}

		socket.send(JSON.stringify({ 'type': 'key_press', 'key': keyPressed }));
	}

	function updateScore() {
		scoreText.textContent = `${player1Score} : ${player2Score}`;
	}

	function resetGame() {
		initializeGame();
		updateScore();
	}

	function startGame() {
		socket.send(JSON.stringify({ 'type': 'player_ready' }));
		if (!gameRunning) {
			gameRunning = true;
			createBall();
			document.getElementById("gameBoard").focus(); // Donner le focus au canevas
			draw();
			// document.getElementById("gameBoard").addEventListener("keydown", changeDirection);
			document.getElementById("gameBoard").onkeydown = function (event) {
				socket.send(JSON.stringify({ 'type': 'key_press', 'key': event.key}));
			};
		}
	}

	function stopGame() {
		gameRunning = false;
	}

	function endGame() {
		if (player1Score >= 1 || player2Score >= 1) {
			stopGame();
			let winnerMessage = "Game Over! ";
			if (player1Score > player2Score) {
				winnerMessage += "Player 1 wins!";
			} else if (player2Score > player1Score) {
				winnerMessage += "Player 2 wins!";
			} else {
				winnerMessage += "It's a draw!";
			}

			document.getElementById("modalGame-message").textContent = winnerMessage;
			document.getElementById("myModalGame").style.display = "block";
		}
	}

	document.getElementById("start-game").addEventListener("click", startGame);
	document.getElementById("start-game").onclick = function () { socket.send(JSON.stringify({ 'type': 'player_ready' })) };
	document.getElementById("stop-game").addEventListener("click", stopGame);
	document.getElementById("reset-game").addEventListener("click", resetGame);

	socket.send(JSON.stringify({ 'type': 'game_join', 'game_id': game_id }));

	function updateGame(data) {
		ballX = data.state.ball_x;
		ballY = data.state.ball_y;
		paddle1.y = data.state.player_Davokadoh_y;
	}

	socket.onmessage = function (event) {
		const data = JSON.parse(event.data);
		console.log(data);
		switch (data.type) {
			case "game_status":
				console.log("Game state");
				break;
			case "player_ready":
				console.log(`Player ${data.player} is ready`);
				break;
			case "game_start":
				startGame();
				console.log("Game start");
				break;
			case "game_pause":
				console.log("Game pause");
				break;
			case "game_resume":
				console.log("Game resume");
				break;
			case "game_update":
				console.log("Game update");
				updateGame(data);
				break;
			case "game_score":
				player1Score = data.
				console.log("Game score");
				break;
			case "game_end":
				console.log("Game end");
				break;
			default:
				console.error(`Unknown message type: ${data.type}`);
				break;
		}
	};

	initializeGame();
	updateScore();
}
import socket from './index.js';

export function game(game_id) {
	let gameBoard = document.getElementById("gameBoard");
	let ctx = gameBoard.getContext("2d");
	let scoreText = document.getElementById("scoreText");
	let gameWidth = gameBoard.width;
	let gameHeight = gameBoard.height;
	let paddle1 = { width: 25, height: 100, x: 10, y: 5 };
	let paddle2 = { width: 25, height: 100, x: gameWidth - 35, y: gameHeight - 105 };
	let ball = { x: gameWidth / 2, y: gameHeight / 2, dx: 0, dy: 0, speed: 1 };
	let score = [0, 0];
	let scoreMax = 1;
	let ballSpeed = 1;
	const boardBackground = "black";
	const ballRadius = 12.5;
	const paddleSpeed = 12;
	let gameRunning = false;

	function draw() {
		if (!gameRunning) return;
		clearBoard();
		drawPaddles();
		drawBall(ball.x, ball.y);
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
		ctx.strokeStyle = 'white';
		ctx.fillStyle = 'white';
		ctx.fillRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);
		ctx.strokeRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);
		ctx.fillStyle = 'white';
		ctx.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
		ctx.strokeRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
	}

	function drawBall() {
		ctx.fillStyle = 'white';
		ctx.strokeStyle = 'white';
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.arc(ball.x, ball.y, ballRadius, 0, 2 * Math.PI);
		ctx.stroke();
		ctx.fill();
	}

	document.getElementById("start-game").onclick = startGame;
	document.getElementById("stop-game").onclick = stopGame;
	// document.getElementById("reset-game").onclick = resetGame;

	function startGame() {
		socket.send(JSON.stringify({ 'type': 'player_ready' }));
		if (!gameRunning) {
			gameRunning = true;
			draw();
			document.getElementById("gameBoard").focus();
			document.getElementById("gameBoard").onkeydown = function (event) {
				if (event.key == 'w' || event.key == 's') socket.send(JSON.stringify({ 'type': 'key_press', 'key': event.key }));
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

	function updateGame(data) {
		ball.x = data.state.ball_x;
		ball.y = data.state.ball_y;
		paddle1.y = data.state.player_Davokadoh_y;
	}

	function updateScore(team) {
		score[team] += 1;
		scoreText.textContent = `${score[0]} : ${score[1]}`;
		if (score[team] >= scoreMax) endGame();
	}

	socket.onmessage = function (event) {
		const data = JSON.parse(event.data);
		console.log(data);
		switch (data.type) {
			case "player_ready":
				console.log(`Player ${data.player} is ready`);
				break;
			case "game_start":
				startGame();
				break;
			case "game_pause":
				break;
			case "game_resume":
				break;
			case "game_update":
				updateGame(data);
				break;
			case "game_score":
				updateScore(data.team)
				break;
			case "game_end":
				endGame();
				break;
		};
	}

	clearBoard();
	updateScore();
	socket.send(JSON.stringify({ 'type': 'game_join', 'game_id': game_id }));
}
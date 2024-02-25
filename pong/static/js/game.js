import socket from './index.js';

export function game(game_id) {
	let gameBoard = document.getElementById("gameBoard");
	let ctx = gameBoard.getContext("2d");
	let scoreText = document.getElementById("scoreText");
	let gameWidth = gameBoard.width;
	let gameHeight = gameBoard.height;
	let paddle1 = { width: 25, height: 100, x: 10, y: 5 };
	let paddle2 = { width: 25, height: 100, x: gameWidth - 35, y: gameHeight - 105 };
	let ball = { x: gameWidth / 2, y: gameHeight / 2, speed: 1 };
	let score = [0, 0];
	const boardBackground = "black";
	const ballRadius = 12.5;
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

	function startGame() {
		socket.send(JSON.stringify({ 'type': 'player_ready' }));
		if (!gameRunning) {
			gameRunning = true;
			draw();
			gameBoard.focus();
			gameBoard.onkeydown = function (event) {
				if (event.key == 'w') socket.send(JSON.stringify({ 'type': 'game_move', 'direction': "UP" }));
				else if (event.key == 's') socket.send(JSON.stringify({ 'type': 'game_move', 'direction': "DOWN" }));
			};
		}
	}

	function stopGame() {
		console.log("Asking for pause");
		socket.send(JSON.stringify({ 'type': 'player_pause' }));
	}

	function endGame() {
		gameRunning = false;
		clearBoard();
		let winnerMessage = "Game Over! ";
		if (score[0] > score[1]) {
			winnerMessage += "Player 1 wins!";
		} else if (score[0] < score[1]) {
			winnerMessage += "Player 2 wins!";
		} else {
			winnerMessage += "It's a draw!";
		}

		document.getElementById("modalGame-message").textContent = winnerMessage;
		// document.getElementById("myModalGame").style.display = "block";
		let myModalGame = new bootstrap.Modal(document.getElementById("myModalGame"), {});
		// const myModalGame = document.getElementById('myModalGame');
		myModalGame.show();
	}

	function updateScore(team) {
		score[team] += 1;
		scoreText.textContent = `${score[0]} : ${score[1]}`;
	}

	function updateGame(state) {
		ball.x = state.ball_x;
		ball.y = state.ball_y;
		paddle1.y = state.player_Davokadoh_y;
	}

	function updateStatus(status) {
		if (status == "PLAY") startGame();
		else if (status == "Pause") stopGame();
		else if (status == "END") endGame();
	}

	socket.onmessage = function (event) {
		const data = JSON.parse(event.data);
		// console.log(data);
		if (data.type == "player_ready") console.log(`Player ${data.player} is ready`);
		else if (data.type == "game_status") updateStatus(data.status);
		else if (data.type == "game_update") updateGame(data.state);
		else if (data.type == "game_score") updateScore(data.team);
	};

	clearBoard();
	updateScore();
	socket.send(JSON.stringify({ 'type': 'game_join', 'game_id': game_id }));
}
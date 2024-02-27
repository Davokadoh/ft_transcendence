export function game(gameId) {
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
	let player1;
	let player2;
	let ballSpeed;
	let paddleSpeed;
	let paddle1Color;
	let paddle2Color;
	let ballColor;
	let boardBackground;
	const paddleBorder = "white";
	const ballBorderColor = "white";
	const ballRadius = 12.5;
	// const paddleSpeed = {{ paddle_speed }};
	let gameRunning = false;
	let keyState = {
		'w': false,
		's': false,
		'ArrowUp': false,
		'ArrowDown': false,
	};

	function initializeGame() {
		fetch('/accounts/profil/settings/data/')
			.then(response => response.json())
			.then(data => {
				console.log(data);
				ballSpeed = data.ballSpeed;
				paddleSpeed = data.paddleSpeed;
				paddle1Color = data.paddleColor;
				paddle2Color = data.paddleColor;
				ballColor = data.ballColor;
				boardBackground = data.backgroundColor;
				console.log("ball speed: ", ballSpeed);
				console.log("paddle speed: ", paddleSpeed);
			})
			.catch(error => {
				// Gérer les erreurs survenues lors de la requête
				console.error('Erreur lors de la requête AJAX :', error);
			});

		fetch(`/game/${gameId}/get-username/`)
			.then(response => response.json())
			.then(data => {
				player1 = data.player1_username;
				player2 = data.player2_username;
				console.log(player1);
				console.log(player2);
				document.getElementById('player1').textContent = player1;
				document.getElementById('player2').textContent = player2;
			})
			.catch(error => {
				// Gérer les erreurs survenues lors de la requête
				console.error('Erreur lors de la requête AJAX :', error);
			});

		fetch(`/game/${gameId}/get-scores/`)
			.then(response => response.json())
			.then(data => {
				player1Score = data.player1Score;
				player2Score = data.player2Score;
				console.log(player1Score);
				console.log(player2Score);
			})
			.catch(error => {
				// Gérer les erreurs survenues lors de la requête
				console.error('Erreur lors de la requête AJAX :', error);
			});

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
		// ballSpeed = 1;
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

	document.getElementById("start-game").addEventListener("click", startGame);
	document.getElementById("stop-game").addEventListener("click", stopGame);
	document.getElementById("reset-game").addEventListener("click", resetGame);


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
		ballX = gameWidth / 2;
		ballY = gameHeight / 2;
		drawBall(ballX, ballY);
		ballXDirection = Math.random() < 0.5 ? -1 : 1;
		ballYDirection = Math.random() < 0.5 ? -1 : 1;
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
		const keyPressed = event.key;

		if (keyPressed in keyState) {
			keyState[keyPressed] = (event.type === 'keydown');

			if (keyState['w'] && !keyState['s']) {
				if (paddle1.y > 0) {
					paddle1.y -= paddleSpeed;
				}
			} else if (!keyState['w'] && keyState['s']) {
				if (paddle1.y < gameHeight - paddle1.height) {
					paddle1.y += paddleSpeed;
				}
			}

			if (keyState['ArrowUp'] && !keyState['ArrowDown']) {
				if (paddle2.y > 0) {
					paddle2.y -= paddleSpeed;
				}
			} else if (!keyState['ArrowUp'] && keyState['ArrowDown']) {
				if (paddle2.y < gameHeight - paddle2.height) {
					paddle2.y += paddleSpeed;
				}
			}
		}
	}

	function updateScore() {
		scoreText.textContent = `${player1Score} : ${player2Score}`;
	}

	// function 

	function resetGame() {
		initializeGame();
		updateScore();
	}

	function startGame() {
		if (!gameRunning) {
			gameRunning = true;
			createBall();
			document.getElementById("gameBoard").focus(); // Donner le focus au canevas
			draw();
			document.getElementById("gameBoard").addEventListener("keydown", changeDirection);
			document.getElementById("gameBoard").addEventListener("keyup", changeDirection);
		}
	}

	function stopGame() {
		gameRunning = false;
	}

	function endGame() {
		const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
		if (!csrftoken) {
			console.error('CSRF token not found');
			return;
		}
		if (player1Score >= 5 || player2Score >= 5) {
			if (player1Score >= 5 || player2Score >= 5) {
				stopGame();
				let winnerMessage = "Game Over! ";
				if (player1Score > player2Score) {
					winnerMessage += player1 + " wins!";
				} else if (player2Score > player1Score) {
					winnerMessage += player2 + " wins!";
				} else {
					winnerMessage += "It's a draw!";
				}
			}
			document.getElementById("modalGame-message").textContent = winnerMessage;
			document.getElementById("myModalGame").style.display = "block";
			var data = {
				player1Score: player1Score,
				player2Score: player2Score
			};

			fetch(`/game/${gameId}/get-scores/`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-Requested-With': 'XMLHttpRequest',
					'X-CSRFToken': csrftoken,
				},
				body: JSON.stringify(data),
			})
				.then(response => response.json())
				.then(result => {
					console.log("score_end:", player1Score);
					console.log("score_end:", player2Score);
				})
				.catch(error => {
					console.error('Error Fetch request :', error);
				});
		}
	}

	document.getElementById("closeRulesButton").addEventListener("click", toggleRules);

	function toggleRules() {
		var rulesContent = document.getElementById("rulesContent");
		var closeButton = document.getElementById("closeRulesButton");
		if (rulesContent.style.display === "none") {
			rulesContent.style.display = "block";
			closeButton.textContent = "✗";
		} else {
			rulesContent.style.display = "none";
			closeButton.textContent = "-";
		}
	}

	initializeGame();
	updateScore();
}
export function startGame(gameId) {
	//gameSocket = new WebSocket("ws://localhost/game/" + gameId);
	const canvas = document.getElementById("board");
	const ctx = canvas.getContext("2d");
	var game;
	const playerHeight = 100;
	const playerWidth = 5;

	game = {
		player: {
			y:canvas.height / 2 - playerHeight / 2,
		},

		computer: {
			y: canvas.height / 2 - playerHeight / 2, 
		},

		ball:{
			x: canvas.width / 2,
			y: canvas.height / 2,
			r: 5,
			speed: {
				x: 2,
				y: 2,
			}
		},
	};
	
	// Mouse move event
	// canvas.addEventListener('mousemove', playerMove);

	// Mouse click event
	// document.querySelector('#start-game').addEventListener('click', playGame);
	// document.querySelector('#stop-game').addEventListener('click', stop);
	// Draw board
	ctx.fillStyle = 'black';
	ctx.fillRect(20, 20, canvas.width, canvas.height);
	
	
	// Draw middle line
	
	ctx.strokeStyle = 'white';
	ctx.beginPath();
	ctx.moveTo(canvas.width / 2, 0);
	ctx.lineTo(canvas.width / 2, canvas.height);
	ctx.stroke();
	
	// Draw players
	
	ctx.fillStyle = 'white';
	ctx.fillRect(20, game.player.y, playerWidth, playerHeight); // 20 en ref au 20 de marge mis dans la creation du board
	ctx.moveTo(canvas.width - playerWidth, 0);
	ctx.fillRect(canvas.width - playerWidth, game.computer.y, playerWidth, playerHeight);
	ctx.fill();
	
	// Draw ball
	
	ctx.beginPath();
	ctx.fillStyle = '#87d300';
	ctx.arc(game.ball.x, game.ball.y, game.ball.r, 0, Math.PI * 2, false);
	ctx.fill();
	
	// requestAnimationFrame(update);
	// document.addEventListener("keyup", movePlayer);
	
	// gameSocket.onmessage = (event) => {
	// 	console.log(event.data);
	// 	updateState(event.data);
	//};

	playGame();

	console.log("end startgame function");
};

// function movePlayer(e) {
// 	if (e.code == "KeyW" || e.code == "ArrowUp") gameSocket.send("up");
// 	else if (e.code == "KeyS" || e.code == "ArrowDown") gameSocket.send("down");
// };

export function playGame() {

	console.log("playeGame fonction");

	  // Nettoyer le canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	game.ball.x += game.ball.speed.x;
    game.ball.y += game.ball.speed.y;

	// Dessinez à nouveau tous les éléments
	ctx.fillStyle = 'black';
	ctx.fillRect(20, 20, canvas.width, canvas.height);
  
	ctx.strokeStyle = 'white';
	ctx.beginPath();
	ctx.moveTo(canvas.width / 2, 0);
	ctx.lineTo(canvas.width / 2, canvas.height);
	ctx.stroke();
  
	ctx.fillStyle = 'white';
	ctx.fillRect(20, game.player.y, playerWidth, playerHeight);
	ctx.moveTo(canvas.width - playerWidth, 0);
	ctx.fillRect(canvas.width - playerWidth, game.computer.y, playerWidth, playerHeight);
	ctx.fill();
  
	ctx.beginPath();
	ctx.fillStyle = '#87d300';
	ctx.arc(game.ball.x, game.ball.y, game.ball.r, 0, Math.PI * 2, false);
	ctx.fill();
  
	// Continuer avec la prochaine trame
	requestAnimationFrame(playGame);
};
    // startGame();
	//playGame();
//     requestAnimationFrame(playGame);
// };


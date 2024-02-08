window.addEventListener("StartGameEvent", () => {
	document.getElementById("start").addEventListener("click", () => {
		console.log("TEST");
		
		StartGame();
		playGame();
	});

	canvas.addEventListener('mousemove', playerMove);
});



export function StartGame() {
	const canvas = document.getElementById("game");
	const ctx = canvas.getContext("2d");
	var play;
	const playerHeight = 100;
	const playerWidth = 5;
	// const playerRight;
	// const playerLeft;
	play = {
		player: {
			y: canvas.height / 2 - playerHeight / 2,
		},

		computer: {
			y: canvas.height / 2 - playerHeight / 2,
		},

		ball: {
			x: canvas.width / 2,
			y: canvas.height / 2,
			r: 5,
			speed:{
				x: 2,
				y: 2,
			}
		},

	};

	// Draw field

	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, canvas.width, canvas.height); // dessine un grand carre noir ou pas (la taille est geree par le html)

	// Draw middle line

	ctx.strokeStyle = 'white';
	ctx.beginPath();
	ctx.moveTo(canvas.width / 2, 0);
	ctx.lineTo(canvas.width / 2, canvas.height);
	ctx.stroke();

	// Draw players

	ctx.fillStyle = '#9016B2';
	ctx.fillRect(0, play.player.y, playerWidth, playerHeight);
	ctx.moveTo(canvas.width - playerWidth, 0);
	ctx.fillRect(canvas.width - playerWidth, play.computer.y, playerWidth, playerHeight);
	ctx.fill();
	
	// Draw ball

	ctx.beginPath();
	ctx.fillStyle = '#87d300';
	ctx.arc(play.ball.x, play.ball.y, play.ball.r, 0, Math.PI * 2, false);
	ctx.fill();

};

// function ballMove() {
//     // Rebounds on top and bottom
//     if (game.ball.y > canvas.height || game.ball.y < 0) {
//         game.ball.speed.y *= -1;
//     }

//     if (game.ball.x > canvas.width - PLAYER_WIDTH) {
//         collide(game.computer);
//     } else if (game.ball.x < PLAYER_WIDTH) {
//         collide(game.player);
//     }
// 	game.ball.x += game.ball.speed.x;
//     game.ball.y += game.ball.speed.y;
// }

export function playerMove(event){

	var canvasLocation = canvas.getBoundingClientRect();
	var mouseLocation = event.clientY - canvasLocation.y;

	console.log("playerMove fonction");

	play.player.y = mouseLocation - playerHeight / 2;
};

export function playGame() {

	game.ball.x += game.ball.speed.x;
    game.ball.y += game.ball.speed.y;

    StartGame();
	playGame();

    requestAnimationFrame(playGame);
};

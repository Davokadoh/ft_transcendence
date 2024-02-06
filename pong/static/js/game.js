window.addEventListener("StartGameEvent", () => {
	document.getElementById("start").addEventListener("click", () => {
		console.log("TEST");
		
		StartGame();
	});
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
		},

	};

	console.log("salut");
	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, canvas.width, canvas.height); // dessine un grand carre noir ou pas (la taille est geree par le html)

	// Draw middle line

	ctx.strokeStyle = 'white';
	ctx.beginPath();
	ctx.moveTo(canvas.width / 2, 0);
	ctx.lineTo(canvas.width / 2, canvas.height);
	ctx.stroke();

	// Draw players
	// ctx.fillStyle = 'white';
	// ctx.fillRect(0, 0, playerWidth, playerHeight);
	// ctx.moveTo(canvas.width - playerWidth, 0);
	// ctx.fillRect(canvas.width - playerWidth, canvas.height - playerHeight, playerWidth, playerHeight);
	// ctx.fillRect(canvas.width - playerWidth, play.computer.y, playerWidth, playerHeight);
	ctx.fillStyle = '#9016B2';
	ctx.fillRect(0, play.player.y, playerWidth, playerHeight);
	ctx.moveTo(canvas.width - playerWidth, 0);
	ctx.fillRect(canvas.width - playerWidth, play.computer.y, playerWidth, playerHeight);

	ctx.beginPath();
	ctx.fillStyle = '#87d30';
	ctx.arc(play.ball.x, play.ball.y, play.ball.r, 0, Math.PI * 2, false);
	ctx.fill();

};

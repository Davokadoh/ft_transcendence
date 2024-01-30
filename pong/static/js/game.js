export function Startparty() {
	const canvas = document.getElementById("game");
	const ctx = canvas.getContext("2d");
	var party;
	const playerHeight = 100;
	const playerWidth = 5;


	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, canvas.width, canvas.height); // dessine un grand carre noir ou pas (la taille est geree par le html)

	// Draw middle line

	ctx.strokeStyle = 'white';
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();

	// Draw players
	ctx.fillStyle = 'white';
	ctx.fillRect(0, party.player.y, playerWidth, playerHeight);
	ctx.fillRect(canvas.width - playerWidth, party.computer.y, playerWidth, playerHeight);

	// Draw ball
	ctx.beginPath();
	ctx.fillStyle = 'white';
	ctx.arc(party.ball.x, party.ball.y, party.ball.r, 0, Math.PI * 2, false);
	ctx.fill();

	// party ={
	// 	player: {
	// 		y: canvas.height / 2 - playerHeight / 2
	// 	},

	// 	computer: {
	// 		y: canvas.height / 2 - playerHeight / 2
	// 	},

	// 	ball: {
	// 		x: canvas.width / 2,
	// 		y: canvas.height / 2,
	// 		r: 5
	// 	}

	// }

};

	// var paddleR = ctx.
	// ctx.lineWidth = 1;
	// ctx.lineCape = lineCap;

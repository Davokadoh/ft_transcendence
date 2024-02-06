window.addEventListener("StartGameEvent", () => {
	document.getElementById("start").addEventListener("click", () => {
		console.log("TEST");
		StartGame();
	});
});



export function StartGame() {
	const canvas = document.getElementById("game");
	const ctx = canvas.getContext("2d");

	console.log("salut");
	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, canvas.width, canvas.height); // dessine un grand carre noir ou pas (la taille est geree par le html)

	// Draw middle line

	ctx.strokeStyle = 'white';
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();

};

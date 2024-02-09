export function startGame(gameId) {
	// const socket = new WebSocket(`ws://${window.location.host}/game/${gameId}/ws/`);
	const canvas = document.getElementById("board");
	const ctx = canvas.getContext("2d");
	ctx.fillRect(20, 20, 150, 100);
	requestAnimationFrame(update);
	document.addEventListener("keyup", movePlayer);

	gameSocket.onmessage = (event) => {
		console.log(event.data);
		updateState(event.data);
	};
};

function movePlayer(e) {
	if (e.code == "KeyW" || e.code == "ArrowUp") gameSocket.send("up");
	else if (e.code == "KeyS" || e.code == "ArrowDown") gameSocket.send("down");
};
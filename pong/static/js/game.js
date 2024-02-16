export function startGame(gameId) {
	// const socket = new WebSocket(`ws://${window.location.host}/game/${gameId}/ws/`);
	const canvas = document.getElementById("board");
	const ctx = canvas.getContext("2d");
	ctx.fillRect(20, 20, 150, 100);
	// requestAnimationFrame(update);
	document.addEventListener("keyup", test);

	socket.onmessage = (event) => {
		console.log("Rcvd: " + event.data);
	};

	function test() {
		console.log("PAUSE");
		let myObj = { type: "PAUSE" };
		socket.send(JSON.stringify(myObj));
	};
};


function movePlayer(e) {
	if (e.code == "KeyW" || e.code == "ArrowUp") socket.send("up");
	else if (e.code == "KeyS" || e.code == "ArrowDown") socket.send("down");
};
window.addEventListener("popstate", router);
window.addEventListener("DOMContentLoaded", router);
window.addEventListener("click", e => {
	if (e.target.matches("[data-link]")) {
		e.preventDefault();
		history.pushState(null, null, e.target.href);
		router();
	}
});

function router() {
	const target = (location.pathname == "/") ? "/home" : location.pathname;
	const access_token = localStorage.getItem("access_token");
	fetch("/page" + target, { "Authorization": access_token })
		.then(response => {
			if (response.redirected) history.pushState(null, null, response.url.replace("/page", ""));
			return response.text();
		})
		.then(html => {
			var parser = new DOMParser();
			var doc = parser.parseFromString(html, "text/html");
			document.title = doc.title;
			document.querySelector("#app").innerHTML = doc.querySelector("#app").innerHTML;
			if (target.startsWith("/game")) startGame(parseInt(target.split("/")[-1]));
		});
};

function startGame(gameId) {
	gameSocket = new WebSocket("ws://localhost/game/" + gameId);
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
}

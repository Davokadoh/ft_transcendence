import { chat } from "./chat.js";
import { profil } from "./profil.js";
import { user } from "./user.js"
import { lobby } from "./lobby.js";
import { remLobby } from "./remLobby.js";
import { tourLobby } from "./tourLobby.js"
import { game } from "./game.js";
import { remote } from "./remote.js";
import { tournament } from "./tournament.js";

export function router() {
	let target = (location.pathname == "/") ? "/home" : location.pathname;
	fetch(target, {
		headers: { "X-Requested-With": "XMLHttpRequest", },
	}).then(response => {
		if (response.redirected) history.replaceState(null, null, response.url);
		target = location.pathname;
		return response.text();
	}).then(html => {
		var parser = new DOMParser();
		var doc = parser.parseFromString(html, "text/html");
		document.title = doc.title;
		document.querySelector("#app").innerHTML = doc.querySelector("#app").innerHTML;
		document.dispatchEvent(new Event("DOMContentLoaded"));
		let gameId = target.split("/");
		gameId.pop();
		gameId = parseInt(gameId.pop());
		if (target.startsWith("/game")) game(gameId);
		else if (target.startsWith("/remote")) remote(gameId);
		else if (target.startsWith("/tournament")) tournament(gameId);
		else if (target.startsWith("/profil")) profil();
		else if (target.startsWith("/chat")) chat();
		else if (target.startsWith("/user")) user();
		else if (target.startsWith("/lobby")) lobby(gameId);
		else if (target.startsWith("/remLobby")) remLobby(gameId);
		else if (target.startsWith("/tourLobby")) tourLobby(gameId);
	});
};
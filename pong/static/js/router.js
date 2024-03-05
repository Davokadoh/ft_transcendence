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
		if (response.redirected) history.pushState(null, null, response.url.replace("/page", ""));
		target = location.pathname;
		return response.text();
	}).then(html => {
		var parser = new DOMParser();
		var doc = parser.parseFromString(html, "text/html");
		document.title = doc.title;
		document.querySelector("#app").innerHTML = doc.querySelector("#app").innerHTML;
		document.dispatchEvent(new Event("DOMContentLoaded"));
		console.log("target: " + target);
		console.log("target split: " + target.split("/"));
		let id = target.split("/");
		id.pop();
		id = parseInt(id.pop());
		console.log("Id: " + id);
		if (target.startsWith("/game")) game(id);
		else if (target.startsWith("/remote")) remote(id);
		else if (target.startsWith("/tournament")) tournament(id);
		else if (target.startsWith("/profil")) profil();
		else if (target.startsWith("/chat")) chat();
		else if (target.startsWith("/user")) user();
		else if (target.startsWith("/lobby")) lobby(id);
		else if (target.startsWith("/remLobby")) remLobby(id);
		else if (target.startsWith("/tourLobby")) tourLobby(id);
	});
};
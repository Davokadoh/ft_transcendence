import { chat } from "./chat.js";
import { profil } from "./profil.js";
import { startGame } from "./game.js";

export function router() {
	const target = (location.pathname == "/") ? "/home" : location.pathname;
	fetch(target, {
		headers: { "X-Requested-With": "XMLHttpRequest", },
	}).then(response => {
		if (response.redirected) history.pushState(null, null, response.url.replace("/page", ""));
		return response.text();
	}).then(html => {
		var parser = new DOMParser();
		var doc = parser.parseFromString(html, "text/html");
		document.title = doc.title;
		document.querySelector("#app").innerHTML = doc.querySelector("#app").innerHTML;
		document.dispatchEvent(new Event("DOMContentLoaded"));
		if (target.startsWith("/game")) startGame(parseInt(target.split("/")[-1]));
		else if (target.startsWith("/profil")) profil();
		else if (target.startsWith("/chat")) chat();
	});
};
import { chat } from "./chat.js";
import { profil } from "./profil.js";
import { game } from "./game.js";
import { startTournament } from "./tournament.js";

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
		let gameid = target.split("/");
		gameid.pop();
		gameid = parseInt(gameid.pop());
		let tournamentid = target.split("/");
		tournamentid.pop();
		tournamentid = parseInt(tournamentid.pop());
		console.log("gameid: " + gameid);
		if (target.startsWith("/game")) game(gameid);
		else if (target.startsWith("/tournament")) startTournament(tournamentid);
		else if (target.startsWith("/profil")) profil();
		else if (target.startsWith("/chat")) chat();
		else if (target.startsWith("/user")) user();
	});
};
// // le code JavaScript, y compris la fonction userLoggedIn et les fonctions Ajax
// function userLoggedIn() {
// 	// ... Logique de connexion ...
// 	// Charger la page de profil après la connexion
// 	loadPage('game');
// 	loadPage('chat');
// 	loadPage('profil');
//   }

//   // Vos autres fonctions JavaScript et gestionnaires d'événements

//   //appeler des fichiers JS et JSX

//   // const { appBarClasses } = require("@mui/material");

import login from "./views/login"
import home from "./views/home"
import game from "./views/game"
import profil from "./views/profil"
import chat from "./views/chat"

import * as chatModule from "./scripts/chat.js"

const routes = {
	"/": {title: "Login", render: login},
	"/home": {title: "Login", render: home},
	"/game": {title: "Game", render: game},
	"/profil": {title: "Profil", render: profil},
	"/chat": {title: "Chat", render: chat},
};

function router() {
	let view = routes[location.pathname];

	if (view) {
		document.title = view.title;
		app.innerHTML = view.render;

		if (location.pathname === "/chat") {
			chatModule.handleChatEvents();
		}

	} else {
		history.replaceState("", "", "/");
        router();
	}
}

window.addEventListener("click", e => {
    if (e.target.matches("[data-link]")) {
        e.preventDefault();
        history.pushState("", "", e.target.href);
        router();
    }
});
window.addEventListener("popstate", router);
window.addEventListener("DOMContentLoaded", router);

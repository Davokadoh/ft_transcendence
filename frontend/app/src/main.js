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
import pong from "./views/pong"

const routes = {
	"/": { title: "Login", render: login },
	"/home": { title: "Login", render: home },
	"/game": { title: "Game", render: game },
	"/profil": { title: "Profil", render: profil },
	"/chat": { title: "Chat", render: chat },
	"/pong": { title: "Pong", render: pong },
};

function router() {
	let view = routes[location.pathname];

	if (view) {
		document.title = view.title;
		document.querySelector('#app').innerHTML = view.render;
		window.document.dispatchEvent(new Event("DOMContentLoaded", {
			bubbles: true,
			cancelable:true
		}));
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
window.addEventListener("DOMContentLoaded", () => {
	console.log("Coucou");
	const canvasContainer = document.getElementById('canvas-container');
	if (!canvasContainer) {
		console.error('Containers not found');
	}
});


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

import home from "./views/login"
import game from "./views/game"

const routes = {
	"/": {title: "Login", render: home},
	"/game": {title: "Game", render: game},
};

function router() {
	let view = routes[location.pathname];

	if (view) {
		document.title = view.title;
		app.innerHTML = view.render;
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
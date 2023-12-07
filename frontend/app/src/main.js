// const { appBarClasses } = require("@mui/material");

import home from "./views/home"
import game from "./views/game"

const routes = {
	"/": {title: "Home", render: home},
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

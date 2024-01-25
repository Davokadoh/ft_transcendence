 
import login from "./views/login"
import home from "./views/home"
import game from "./views/game"
import profil from "./views/profil"
import chat from "./views/chat"
import pong from "./views/pong"

const routes = {
    "/": {title: "Login", render: login},
    "/home": {title: "Login", render: home},
    "/game": {title: "Game", render: game},
    "/profil": {title: "Profil", render: profil},
    "/chat": {title: "Chat", render: chat},
    "/pong": {title: "Pong", render: pong},
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
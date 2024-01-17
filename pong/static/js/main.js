function router() {
	const target = (location.pathname == "/") ? "/home" : location.pathname;
	fetch(target)
		.then(response => {
			if (response.redirected && target != "/home") {
				history.pushState("", "", response.url);
			}
			return response.text();
		})
		.then(html => {
			document.querySelector('#app').innerHTML = html;
		});
}

window.addEventListener("click", e => {
	if (e.target.matches("[data-link]")) {
		e.preventDefault();
		history.pushState("", "", e.target.href);
		router();
	}
});
window.addEventListener("popstate", router());
window.addEventListener("DOMContentLoaded", router());

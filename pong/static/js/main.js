function router() {
	const target = (location.pathname == "/") ? "/home" : location.pathname;
	const access_token = localStorage.getItem("access_token");
	console.log(access_token);
	const headers = { "Authorization": access_token };
	fetch(target, { headers })
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

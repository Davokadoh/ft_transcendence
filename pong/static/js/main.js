function router() {
	const target = (location.pathname == "/") ? "/home" : location.pathname;
	const access_token = localStorage.getItem("access_token");
	console.log("Access_token:" + access_token);
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
			// window.document.dispatchEvent(new Event("DOMContentLoaded", {
			// 	bubbles: true,
			// 	cancelable: true
			// }));
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
window.addEventListener("DOMContentLoaded", () => {
	const container = document.getElementById('container');
	if (!container) {
		console.log("Error!");
	} else {
		console.log("YEEEEEEEEEEEEEEEEEEEAAAAAAAAAAAAAAAAAAAAAAAAAAAAH!");
	}
});

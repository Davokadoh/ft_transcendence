function router() {
	if (location.pathname === '/') {
		fetch('/home')
			.then(response => response.text())
			.then(text => {
				console.log(text);
				document.querySelector('#app').innerHTML = text;
			});
	} else {
		fetch(location.pathname)
			.then(response => response.text())
			.then(text => {
				console.log(text);
				document.querySelector('#app').innerHTML = text;
			});
	}
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

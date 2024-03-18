import { router } from "./router.js";
export var socket = new WebSocket(`wss://${window.location.host}/ws/`);

document.onpopstate = router;
window.addEventListener("popstate", router);
window.addEventListener("DOMContentLoaded", router);
window.addEventListener("click", e => {
	if (e.target.hasAttribute("url")) {
		e.preventDefault();
		history.pushState(null, null, e.target.getAttribute("url"));
		router();
	} else if (e.target.matches("[data-link]")) {
		e.preventDefault();
		history.pushState(null, null, e.target.getAttribute("data-link"));
		router();
	}
});

console.log('index called');


// < !--SCRIPT BOUTON NB / COLOR-- >
document.addEventListener('DOMContentLoaded', function () {
	const toggleSwitch = document.getElementById('toggle-switch');
	const nightModeOn = document.getElementById('nightModeOn');
	const nightModeOff = document.getElementById('nightModeOff');
	const separator = document.querySelector('.separator');
	let nightModeActivated = false;

	nightModeOn.addEventListener('click', function () {
		if (!nightModeActivated) {
			toggleSwitch.checked = true;
			document.body.classList.add('night-mode');
			separator.style.background = 'black';
			toggleSwitch.dispatchEvent(new Event('change'))
			nightModeActivated = true;
		}
	});

	nightModeOff.addEventListener('click', function () {
		if (nightModeActivated) {
			toggleSwitch.checked = false;
			document.body.classList.remove('night-mode');
			separator.style.background = '';
			toggleSwitch.dispatchEvent(new Event('change'));
			nightModeActivated = false;
		}
	});
});

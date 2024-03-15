import { router } from "./router.js";

export var socket = new WebSocket(`wss://${window.location.host}/ws/`);

const waitForOpenConnection = (socket) => {
	return new Promise((resolve, reject) => {
		const maxNumberOfAttempts = 10
		const intervalTime = 1000 //ms

		let currentAttempt = 0
		const interval = setInterval(() => {
			if (currentAttempt > maxNumberOfAttempts - 1) {
				clearInterval(interval)
				reject(new Error('Maximum number of attempts exceeded'))
			} else if (socket.readyState === socket.OPEN) {
				clearInterval(interval)
				resolve()
			}
			currentAttempt++
		}, intervalTime)
	})
}

export const sendMessage = async (socket, msg) => {
	if (socket.readyState !== socket.OPEN) {
		try {
			await waitForOpenConnection(socket)
			socket.send(msg)
		} catch (err) { console.error(err) }
	} else {
		socket.send(msg)
	}
}


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

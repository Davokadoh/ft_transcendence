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

	nightModeOn.addEventListener('click', function () {
		if (!toggleSwitch.checked) {
			toggleSwitch.checked = false;
			document.body.classList.add('night-mode');
			separator.style.background = 'black'; // Change la couleur de la ligne de séparation
			toggleSwitch.dispatchEvent(new Event('change')); // Déclenche l'événement de changement pour activer le mode nuit
		}
	});

	nightModeOff.addEventListener('click', function () {
		if (toggleSwitch.checked) {
			toggleSwitch.checked = true;
			document.body.classList.remove('night-mode');
			separator.style.background = ''; // Change la couleur de la ligne de séparation
			toggleSwitch.dispatchEvent(new Event('change')); // Déclenche l'événement de changement pour désactiver le mode nuit
		}
	});
});

// < !--SCRIPT BOUTON MENU-- >
function toggleNavbar() {
	console.log('Toggle Navbar function called');

	const navbarToggler = document.querySelector('.navbar-toggler');
	const navbarNav = document.querySelector('#navbarNav');

	// Vérifie si le menu est ouvert
	const isOpen = navbarNav.classList.contains('show');

	// Si le menu est ouvert, retire la classe active du bouton
	if (isOpen) {
		navbarToggler.classList.remove('active');
	} else {
		// Si le menu est fermé, ajoute la classe active au bouton
		navbarToggler.classList.add('active');
	}
}
// Fonction pour récupérer le jeton CSRF depuis les cookies
function getCookie(name) {
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) return parts.pop().split(';').shift();
}

// document.addEventListener('DOMContentLoaded', function () {
// 	console.log('index.js lu ok');


// 	function getCookie(name) {
// 		const value = `; ${document.cookie}`;
// 		const parts = value.split(`; ${name}=`);
// 		console.log('index.js fonction getCookies lu ok');
// 		if (parts.length === 2) return parts.pop().split(';').shift();
// 	}

// 	// window.addEventListener('click', function (logout_user) {
// 	// 	if (logout_user.target === logout_user) {
// 	// 		logout_user();
// 	// 	}

// 	window.logout_user = function () {
// 		console.log('index.js fonction logout_user lu ok');
// 		fetch("http://localhost:8000/accounts/logout/", {
// 			method: 'POST',
// 			headers: {
// 				'Content-Type': 'application/x-www-form-urlencoded',
// 				'X-CSRFToken': getCookie('csrftoken'),
// 			},
// 		})
// 			.then(response => {
// 				if (response.ok) {
// 					// Redirige vers la page de connexion après la déconnexion
// 					window.location.href = "/accounts/login/";
// 					// window.location.href = "/accounts/logout/";
// 				} else {
// 					console.error('Erreur lors de la déconnexion');
// 				}
// 			})
// 			.catch(error => {
// 				console.error('Erreur lors de la déconnexion :', error);
// 			});
// 	};
// });
import { router } from "./router.js";

document.addEventListener("popstate", router);
document.onpopstate = router;
document.firstElementChild.onclick = function (event) {
	const target = event.target;
	const link = target.hasAttribute("href") ? target.href : target.getAttribute("data-link");
	if (!!link) {
		history.pushState(null, null, link);
		router();
		event.preventDefault();
		event.stopPropagation();
	} else {
		console.log("HAS NO DATA-LINK")
	}
};

// < !--SCRIPT BOUTON NB / COLOR-- >
const toggleSwitch = document.getElementById('toggle-switch');
toggleSwitch.addEventListener('change', function () {
	console.log('night mode function called');
	document.body.classList.toggle('night-mode', toggleSwitch.checked);
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

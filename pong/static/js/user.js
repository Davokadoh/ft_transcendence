export function user() {
	let user = document.getElementById('user');
	let searched_username = document.getElementById('searchInput');
	searched_username.onchange = function() {
		console.log("searched_username JS = ", searched_username.value);
		console.log("WINDOW HREF = ", window.location.href);
		user.href = `/user/${searched_username.value}/`;
	};
	// user.addEventListener('click', function (event) {
		// event.preventDefault(); // Empêche le comportement par défaut du lien

		// Récupère la valeur du champ de recherche
		// user.href = `/user/${searched_username.value}/`;
		// Envoye une requête POST avec la valeur du nom d'utilisateur
		// fetch('/user/' + searched_username + '/', {
		// 	method: 'GET',
		// 	headers: {
		// 		'Content-Type': 'application/json',
		// 		// Ajouter le jeton CSRF si nécessaire
		// 		// 'X-CSRFToken': getCookie('csrftoken'),
		// 	},
		// }).then(response => {
		// 	if (response.ok) {
		// 		return response.json();
		// 	} else {
		// 		throw new Error('Erreur lors de la récupération des informations de l\'utilisateur');
		// 	}
		// }).then(data => {
		// 	// Traitement des données reçues
		// 	console.log(data);
		// 	let username = document.getElementById("username");
		// 	username.textContent = data.username;
		// 	let profil_picture = document.getElementById('profil-picture');
		// 	profil_picture.src = data.profil_picture;
		// }).catch(error => {
		// 	console.error('Erreur:', error);
		// });
	// });
}


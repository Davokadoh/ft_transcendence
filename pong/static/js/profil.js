window.addEventListener("profilEvent", () => {

	// Code pour ouvrir la modal
	console.log('Script modal profil loaded successfully!');
	var statsBtn = document.getElementById('statsBtn');
	var modal = document.getElementById('statsModal');

	statsBtn.addEventListener('click', function () {
		modal.style.display = 'block';
	});

	// Fonction pour fermer la modal
	function statsModalClose() {
		modal.style.display = 'none';
	}

	// Fermer la modal en cliquant en dehors de celle-ci
	window.addEventListener('click', function (event) {
		if (event.target === modal) {
			statsModalClose();
		}
	});

	console.log('Script Modal loaded successfully!');

	// SCRIPT POUR SETTINGS VITESSE BALLE ET PADDLES
	// Mise à jour des valeurs affichées lorsque les curseurs sont modifiés
	console.log('Script ball speed loaded successfully!');
	var paddleSpeedInput = document.getElementById('paddleSpeed');
	var paddleSpeedValue = document.getElementById('paddleSpeedValue');

	var ballSpeedInput = document.getElementById('ballSpeed');
	var ballSpeedValue = document.getElementById('ballSpeedValue');

	paddleSpeedInput.addEventListener('input', function () {
		paddleSpeedValue.textContent = paddleSpeedInput.value;
	});

	ballSpeedInput.addEventListener('input', function () {
		ballSpeedValue.textContent = ballSpeedInput.value;
	});


	// Code pour restaurer les valeurs par défaut si la modal est fermée sans sauvegarde
	var setModal = document.getElementById('setModal');

	setModal.addEventListener('hidden.bs.modal', function () {
		console.log('Script valeurs par defaut reset chargé avec succès !');
		// Remettre les valeurs par défaut
		paddleSpeedInput.value = 50;
		ballSpeedInput.value = 50;
		paddleSpeedValue.textContent = '50';
		ballSpeedValue.textContent = '50';
		// ... (restaurer ici d'autres paramètres au besoin)
	});

	// Code pour sauvegarder les paramètres lorsqu'on clique sur le bouton "Save" ou "Close"
	var saveButton = document.getElementById('saveButton');

	saveButton.addEventListener('click', function () {
		console.log('Script save infos ou close sans save chargé avec succès !');
		// Récupérer les valeurs modifiées depuis les champs de la modal
		var paddleSpeedValue = paddleSpeedInput.value;
		var ballSpeedValue = ballSpeedInput.value;
		// ... (récupérer d'autres paramètres au besoin)

		// Code de sauvegarde des paramètres à ajouter ici
		// Vous pouvez utiliser localStorage, sessionStorage, AJAX, etc.

		// Fermer la modal
		statsModalClose();
	});

	// Charger les données sauvegardées
	console.log('Script profil username loaded successfully!');
	fetch("/profil/username")
		.then(response => response.json())
		.then(data => {
			var savedUsername = data.username;
			var savedImage = localStorage.getItem('image');

			// Mettre à jour l'image et le nom d'utilisateur si sauvegardés
			var usernameInput = document.getElementById('username');
			var profileImage = document.getElementById('profileImage');

			if (savedUsername) {
				usernameInput.value = savedUsername;
			}

			if (savedImage) {
				profileImage.src = savedImage;
			}
		});

	// Fonction pour gérer le téléchargement d'image
	var modifyImageButton = document.getElementById('modifyImageButton');
	var imageInput = document.getElementById('imageInput');

	modifyImageButton.addEventListener('click', function () {
		imageInput.click();
	});

	imageInput.addEventListener('change', function (event) {
		const fileInput = event.target;
		const profileImage = document.getElementById('profileImage');

		const file = fileInput.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = function (e) {
				const imageData = e.target.result;
				profileImage.src = imageData;
				// Sauvegarder l'image dans le stockage local
				localStorage.setItem('image', imageData);
			};
			reader.readAsDataURL(file);
		}
	});

	// Fonction pour gérer la modification du nom d'utilisateur
	var usernameInput = document.getElementById('username');

	usernameInput.addEventListener('blur', function () {
		const newUsername = usernameInput.value.trim();
		if (newUsername !== '') {
			// Vous pouvez envoyer newUsername à votre serveur ou API pour la mise à jour
			console.log('Nouveau nom d\'utilisateur :', newUsername);
			// Sauvegarder le nom d'utilisateur dans le stockage local
			localStorage.setItem('username', newUsername);
		} else {
			// Réinitialisez la valeur si elle est vide
			console.log('Script profil username empty loaded successfully!');
			fetch("/profil/username")
				.then(response => response.json())
				.then(data => {
					usernameInput.value = data.username;
				});
		}
	});
});
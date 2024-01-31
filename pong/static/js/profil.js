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

	// Fonction pour récupérer le jeton CSRF depuis les cookies
	function getCookie(name) {
		const value = `; ${document.cookie}`;
		const parts = value.split(`; ${name}=`);
		if (parts.length === 2) return parts.pop().split(';').shift();
	}

	// Fonction pour gérer la modification du nom d'utilisateur avec le bouton
	var usernameInput = document.getElementById('username');

	document.getElementById('modifyUsernameButton').addEventListener('click', function () {
		const newUsername = usernameInput.value.trim();

		fetch("/profil/update-username/", {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'X-CSRFToken': getCookie('csrftoken'),
			},
			body: `new_username=${newUsername}`,
		})
			.then(response => response.json())
			.then(data => {
				console.log(data.message);

				// Sauvegarder le nouveau nom d'utilisateur dans le stockage local
				localStorage.setItem('savedUsername', newUsername);

				// Met à jour le champ du formulaire avec le nouveau nom d'utilisateur
				usernameInput.value = newUsername;
				// Ajoute la classe indiquant que le nom d'utilisateur a été mis à jour côté client
				usernameInput.classList.add('username-updated');
			})
			.catch(error => {
				console.error('Erreur lors de la mise à jour du nom d\'utilisateur :', error);
			});
	});

// Charger les données sauvegardées
console.log('Script profil username loaded successfully!');
fetch("/profil/username")
    .then(response => response.json())
    .then(data => {
        var savedUsername = localStorage.getItem('savedUsername');
        var savedImage = localStorage.getItem('image');

        // Mettre à jour l'image et le nom d'utilisateur si sauvegardés
        var profileImage = document.getElementById('profileImage');
        var defaultUsername = data.username; // Récupérer le nom d'utilisateur par défaut depuis la réponse du serveur

        if (savedUsername && !usernameInput.classList.contains('username-updated')) {
            // Mettre à jour le nom d'utilisateur sauvegardé
            usernameInput.value = savedUsername;
        } else if (defaultUsername) {
            // Utiliser le nom d'utilisateur par défaut si aucun nom d'utilisateur n'est sauvegardé
            usernameInput.value = defaultUsername;
        }

        if (savedImage) {
            profileImage.src = savedImage;
        }
    });




});
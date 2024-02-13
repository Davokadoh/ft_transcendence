export function profil() {

	// var statsBtn = document.getElementById('statsBtn');
	// var modal = document.getElementById('statsModal');
	// statsBtn.addEventListener('click', function () { modal.style.display = 'block'; });
	// function statsModalClose() { modal.style.display = 'none'; }
	// window.addEventListener('click', function (event) { if (event.target === modal) statsModalClose(); });

	var paddleSpeedInput = document.getElementById('paddleSpeed');
	var paddleSpeedValue = document.getElementById('paddleSpeedValue');
	paddleSpeedInput.oninput = function () { paddleSpeedValue.innerHTML = this.value; }

	var ballSpeedInput = document.getElementById('ballSpeed');
	var ballSpeedValue = document.getElementById('ballSpeedValue');
	ballSpeedInput.oninput = function () { ballSpeedValue.innerHTML = this.value; }

	var settingsForm = document.getElementById('settingsForm');
	var settingsModal = document.getElementById('settingsModal');
	settingsModal.addEventListener('hidden.bs.modal', function () {
		settingsForm.reset();
		var event = new Event('input');
		paddleSpeedInput.dispatchEvent(event);
		ballSpeedInput.dispatchEvent(event);
	});

	var saveButton = document.getElementById('saveButton');
	saveButton.onclick = function () {
		var paddleSpeedValue = paddleSpeedInput.value;
		var ballSpeedValue = ballSpeedInput.value;
		statsModalClose();
	}

	const profilPictureInput = document.getElementById('profil-picture-input');
	const profilPictureForm = document.getElementById('profil-picture-form');
	const profilPicture = document.getElementById('profil-picture');

	profilPicture.onclick = function () {
		profilPictureInput.click();
	}

	profilPictureInput.onchange = function (event) {
		profilPicture.src = URL.createObjectURL(event.target.files[0]);
		profilPictureForm.requestSubmit();
	};

	profilPictureForm.onsubmit = function (event) {
		event.preventDefault();
		const form = event.currentTarget;
		const url = new URL(form.action);
		const formData = new FormData(form);
		fetch(url, {
			method: form.method,
			body: formData,
			mode: 'same-origin',
		}).then(response => response.json()).then(data => {
			console.log("message: " + data.message);
		});
	}


	var usernameInput = document.getElementById('username');
	function postUsername(newUsername) { newUsername = newUsername.trim(); }

	document.getElementById('modifyUsernameButton').addEventListener('click', function () {
		const newUsername = usernameInput.value.trim();

		fetch("/accounts/profil/update-username/", {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'X-CSRFToken': getCookie('csrftoken'),
			},
			body: `new_username=${newUsername}`,
		}).then(response => response.json()).then(data => {
			console.log(data.message);

			localStorage.setItem('savedUsername', newUsername);

			usernameInput.value = newUsername;
			usernameInput.classList.add('username-updated');
		}).catch(error => {
			console.error('Erreur lors de la mise à jour du nom d\'utilisateur :', error);
		});
	});


	fetch("/accounts/profil/username")
		.then(response => response.json())
		.then(data => {
			var savedUsername = localStorage.getItem('savedUsername');
			var savedImage = localStorage.getItem('image');

			// var profileImage = document.getElementById('profileImage');
			var defaultUsername = data.username;

			if (savedUsername && !usernameInput.classList.contains('username-updated')) usernameInput.value = savedUsername;
			else if (defaultUsername) usernameInput.value = defaultUsername;

			// if (savedImage) profileImage.src = savedImage;
		});

	function getDefaultProfileImage() {
		// fetch("/get_user_image/" + usernameInput.value) // pas en local
		fetch("/get_user_image/" + "vferraro") // pas en local
			.then(response => response.json())
			.then(data => {
				console.log("data:", data);
				const profilImg = data[image][link];

				// Mettre à jour l'image de profil i elle est disponible
				if (profilImg) {
					const profileImage = document.getElementById('profileImage');
					profileImage.src = profilImg;

					// Sauvegarde l'image par défaut dans le stockage local
					localStorage.setItem('defaultImage', profilImg);
				}
				else {
					// Charge une autre image de profil par défaut le cas écheant
					const defaultImageURL = "/static/img/image-defaut.png";
					const profileImage = document.getElementById('profileImage');
					profileImage.src = defaultImageURL;

					// Sauvegarde l'image par défaut alternative dans le stockage local
					localStorage.setItem('defaultImage', defaultImageURL);
				}
			})
			.catch(error => {
				console.error('Erreur lors de la récupération de l\'image par défaut :', error);
				console.log("profilImg: ", profilImg);
			});
	}

	const modifyImageButton = document.getElementById('modifyImageButton');

	modifyImageButton.onclick = function () {
		// Mettez ici le code que vous souhaitez exécuter lorsque le bouton est cliqué
		console.log("Le bouton a été cliqué !");
		profilPictureInput.click(); // Ouvre le sélecteur de fichier pour choisir une nouvelle image
	};
};

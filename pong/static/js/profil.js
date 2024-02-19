export function profil() {
	let paddleSpeedInput = document.getElementById('paddleSpeed');
	let paddleSpeedValue = document.getElementById('paddleSpeedValue');
	paddleSpeedInput.oninput = function () { paddleSpeedValue.innerHTML = this.value; }

	let ballSpeedInput = document.getElementById('ballSpeed');
	let ballSpeedValue = document.getElementById('ballSpeedValue');
	ballSpeedInput.oninput = function () { ballSpeedValue.innerHTML = this.value; }

	let settingsForm = document.getElementById('settingsForm');
	let settingsModal = document.getElementById('settingsModal');
	settingsModal.addEventListener('hidden.bs.modal', function () {
		settingsForm.reset();
		let event = new Event('input');
		paddleSpeedInput.dispatchEvent(event);
		ballSpeedInput.dispatchEvent(event);
	});

	let saveButton = document.getElementById('saveButton');
	saveButton.onclick = function () {
		const paddleSpeedValue = paddleSpeedInput.value;
		const ballSpeedValue = ballSpeedInput.value;
		statsModalClose();
	}

	let profilPictureInput = document.getElementById('id_profil_picture');
	let profilPictureForm = document.getElementById('profil-picture-form');
	let profilPicture = document.getElementById('profil-picture');

	profilPicture.onclick = function () {
		console.log("Clicked!")
		profilPictureInput.click();
	}

	profilPictureInput.onchange = function (event) {
		console.log("Input changed!")
		// profilPicture.src = URL.createObjectURL(event.target.files[0]);
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
		}).then(response => {
			profilPicture.src = URL.createObjectURL(profilPictureInput.files[0]);
			console.log("Img src changed!")
		});
	}

	let usernameInput = document.getElementById('username');
	let usernameForm = document.getElementById('username-form');
	let usernameButton = document.getElementById('modifyUsernameButton');

	usernameButton.onclick = function (event) {
		event.preventDefault();
		usernameForm.requestSubmit();
	}

	usernameForm.onsubmit = function (event) {
		event.preventDefault();
		const form = usernameForm;
		const url = new URL(form.action);
		const formData = new FormData(form);
		fetch(url, {
			method: form.method,
			body: formData,
			mode: 'same-origin',
		}).then(response => response.json()).then(data => {
			console.log("message: " + data.message);
			localStorage.setItem('savedUsername', newUsername);

			usernameInput.value = newUsername;
			usernameInput.classList.add('username-updated');
		}).catch(error => {
			console.error('Erreur lors de la mise à jour du nom d\'utilisateur :', error);
		});
	}


	fetch("/accounts/profil/username")
		.then(response => response.json())
		.then(data => {
			let savedUsername = localStorage.getItem('savedUsername');
			let savedImage = localStorage.getItem('image');

			// let profileImage = document.getElementById('profileImage');
			let defaultUsername = data.username;

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
				let profilImg = data[image][link];

				// Mettre à jour l'image de profil i elle est disponible
				if (profilImg) {
					let profileImage = document.getElementById('profileImage');
					profileImage.src = profilImg;

					// Sauvegarde l'image par défaut dans le stockage local
					localStorage.setItem('defaultImage', profilImg);
				}
				else {
					// Charge une autre image de profil par défaut le cas écheant
					let defaultImageURL = "/static/img/image-defaut.png";
					let profileImage = document.getElementById('profileImage');
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
};
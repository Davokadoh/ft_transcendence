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

	function statsModalClose() { modal.style.display = 'none'; }
	
	let saveButton = document.getElementById('saveButton');
	saveButton.onclick = function () {
		settingsForm.requestSubmit();
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

	// // settings
	//     // Ajoutez l'écouteur d'événement pour le formulaire
	// 	const settingsForm = document.getElementById('settingsForm');
	// 	settingsForm.addEventListener('submit', function(event) {
	// 		event.preventDefault();
	// 		const paddleSpeed = document.getElementById('paddleSpeed').value;
	// 		fetch('/profil', {
	// 			method: 'POST',
	// 			headers: {
	// 				'Content-Type': 'application/x-www-form-urlencoded',
	// 				'X-CSRFToken': getCookie('csrftoken'),
	// 			},
	// 			body: `paddle_speed=${paddleSpeed}`,
	// 		})
	// 		.then(response => {
	// 			if (response.ok) {
	// 				// Gérer la réponse en cas de succès si nécessaire
	// 			} else {
	// 				console.error('Erreur lors de la soumission du formulaire');
	// 			}
	// 		})
	// 		.catch(error => {
	// 			console.error('Erreur lors de la soumission du formulaire :', error);
	// 		});
	// 	});

	let usernameInput = document.getElementById('id_username');
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
			// else if (defaultUsername) usernameInput.value = defaultUsername; // erreur dans la console traiter par creyt
			else if (defaultUsername && usernameInput) {
				usernameInput.value = defaultUsername;
			}

			// if (savedImage) profileImage.src = savedImage;
		});

	const modifyImageButton = document.getElementById('modifyImageButton');

	modifyImageButton.onclick = function () {
		console.log("Le bouton a été cliqué !");
		profilPictureInput.click(); // Ouvre le sélecteur de fichier pour choisir une nouvelle image
	};
	let user = document.getElementById('user');
	let searched_username = document.getElementById('searchInput');
	searched_username.onchange = function () {
		console.log("searched_username JS = ", searched_username.value);
		// console.log("WINDOW HREF = ", window.location.href);
		user.href = `/user/${searched_username.value}/`;
	};

	document.getElementById("ladder").addEventListener("click", () => {
		console.log("click on ladder");

		const action = "add";
		testManageFriend(action);
	});
	//test de Raph:
	function testManageFriend(action) {

		const target = "PongChoRabbit";
		fetch(`manageFriend/${action}/${target}/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then(response => {
				if (!response.ok) {
					throw new Error(response.status);
				}
				return response.json();
			})
			.then(data => {
				// test
				console.log(data.message);
			})
			.catch(error => {
				// Le traitement des erreurs ici
				console.error('Request fetch Error:', error);
			});
	}

};
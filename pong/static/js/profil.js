export function profil() {
	let paddleSpeedInput = document.getElementById('paddleSpeed');
	let paddleSpeedValue = document.getElementById('paddleSpeedValue');
	paddleSpeedInput.oninput = function () { paddleSpeedValue.innerHTML = this.value; }

	let ballSpeedInput = document.getElementById('ballSpeed');
	let ballSpeedValue = document.getElementById('ballSpeedValue');
	ballSpeedInput.oninput = function () { ballSpeedValue.innerHTML = this.value; }

	let settingsForm = document.getElementById('settingsForm');
	let settingsModal = document.getElementById('settingsModal');

	let visibleList = false;
	let templateContactList = document.createElement("template");

	fetchTemplate()
		.then(() => {
			// create list contact directly
			/*createListContact()
				.then(() => {
					console.log("List contacts loaded: ", document.getElementById('listContact').innerHTML);
				})
				.catch(error => {
					console.error('Creation list contact failed :', error);
				});*/
		})
		.catch(error => {
			console.error('fetch template failed :', error);
		});

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

	searched_username.addEventListener("keypress", (e) => {
		if (e.key == "Enter")
			user.click();
	});
	user.addEventListener("click", () => {
		if (searched_username.value)
			user.href = `/user/${searched_username.value}/`;
	});

	document.addEventListener("click", (e) => {
		if (visibleList && !e.target.classList.contains("text")) {
			document.getElementById('listContact').classList.replace("visible-profile-y", "invisible-profile-y");
			visibleList = false;
		}
	});

	searched_username.addEventListener("click", () => {

		console.log("click onsearch");
		if (visibleList == false) {
			createListContact()
				.then(() => {
					document.getElementById('listContact').classList.replace("invisible-profile-y", "visible-profile-y");
					visibleList = true;
				})
				.catch(error => {
					console.error('Erreur lors de la création de la liste de contacts :', error);
				});
		}
		else {
			document.getElementById('listContact').classList.replace("visible-profile-y", "invisible-profile-y");
			visibleList = false;
		}
	});

	document.getElementById("ladder").addEventListener("click", () => {
		console.log("click on ladder");

		testManageFriend("add");
		searched_username.value = "";
	});

	async function fetchTemplate() {
		return new Promise(async (resolve, reject) => {
			try {
				const response = await fetch('/chat/chat-tmp/');

				if (!response.ok)
					throw new Error('fetch chat/template : ERROR');

				const htmlContent = await response.text();
				const parser = new DOMParser();
				const doc = parser.parseFromString(htmlContent, 'text/html');
				templateContactList = doc.querySelector('template[list-contact-template]');
				resolve();
				console.log("fetch: chat-tmp.html: success!");
			} catch (error) {
				reject(error);
				console.error('fetch chat/template : ERROR', error);
			}
		});
	}

	function createListContact() {

		return new Promise((resolve, reject) => {

			console.log("==createListContact FUNCTION==");
			fetch("getList/users", {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				},
			})
				.then(response => {
					if (!response.ok) {
						throw new Error('fetch getList/users : ERROR');
					}
					return response.json();
				})
				.then(data => {

					console.log('Response server _data_ : users/list : ', data.user_list);
					// clear contact list on document
					document.getElementById("listContact").innerHTML = "";
					var myUsername = document.getElementById("id_nickname").value;
					data.user_list.map(user => {

						if (myUsername != user.username) {
							//take template
							var tpl = templateContactList.content.cloneNode(true);
							tpl.querySelector(".contact").id = `${user.username}-contact-id`;
							tpl.querySelector("[data-image]").src = user.profil_picture;
							tpl.querySelector("[data-name]").textContent = user.username;

							//insert contact 
							document.getElementById("listContact").append(tpl);
							handle_click_contact(document.getElementById("listContact").lastElementChild);
						}

					});
					console.log("listContact in doc:  ", document.getElementById("listContact").innerHTML);
					//Listen event about search
					handle_input_steam();
					resolve();

				})
				.catch(error => {
					console.error('request error: Fetch', error);
					reject(error);
				});
		});
	}

	function handle_click_contact(contact) {

		contact.addEventListener('click', () => {

			console.log("CLICK on CONTACT");
			const contactName = contact.querySelector("[data-name]").textContent;
			const img = contact.querySelector("[data-image]").src;
			//console.log(`Clic sur le contact ${contactName}. Image source: ${img}`);
			searched_username.value = contactName;
			searched_username.focus();
			document.getElementById('listContact').classList.replace("visible-profile-y", "invisible-profile-y");
			//isVisibleList = false;
		});
	}

	function handle_input_steam() {

		console.log("Handle input stream Function");
		const contacts = document.querySelectorAll('.contact');

		searchInput.addEventListener("input", function (e) {
			const value = e.target.value;
			contacts.forEach(user => {
				const name = user.querySelector("[data-name]").textContent;
				const isVisible = name.toLowerCase().includes(value.toLowerCase());
				user.classList.toggle("hide", !isVisible);
			});
		});
	}

	//test de Raph:
	function testManageFriend(action) {

		if (searched_username.value != "") {
			fetch(`manageFriend/${action}/${searched_username.value}/`, {
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
	}

};
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
	let modalContactsBtn = document.getElementById("contactsModal");
	let modalBlockedBtn = document.getElementById("modalBlocked");

	fetchTemplate();



	modalContactsBtn.addEventListener("show.bs.modal", () => {
		console.log("display contact modal");
		createListFriends();
	});
	modalBlockedBtn.addEventListener("show.bs.modal", () => {
		console.log("display contact Blocked modal");
		createListBlocked();
	});

	settingsModal.addEventListener('hidden.bs.modal', function () {
		// settingsForm.reset();
		let event = new Event('input');
		paddleSpeedInput.dispatchEvent(event);
		ballSpeedInput.dispatchEvent(event);
	});

	function statsModalClose() {
		const modal = bootstrap.Modal.getInstance('#settingsModal');
		modal.hide();
	}

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

	settingsForm.addEventListener('submit', function (event) {
		event.preventDefault();
		console.log("COUCOU");
		const form = event.currentTarget;
		const url = new URL(form.action);
		const formData = new FormData(form);
		fetch(url, {
			method: form.method,
			body: formData,
			mode: 'same-origin',
		})
			.then(response => response.json())
			.then(data => {
				paddleSpeedInput.value = data.paddleSpeed;
				paddleSpeedValue.value = data.paddleSpeed;
				console.log("paddle speed: ", paddleSpeedInput.value)
				ballSpeedInput.value = data.ballSpeed;
				ballSpeedValue.value = data.ballSpeed;
				console.log("paddle speed: ", ballSpeedInput.value)

			})
			.catch(error => {
				console.error('Erreur lors de la soumission du formulaire :', error);
			});
	});

	let nicknameInput = document.getElementById('nickname-form');
	let nicknameForm = document.getElementById('nickname-form');
	let nicknameButton = document.getElementById('modifyNicknameButton');

	nicknameButton.onclick = function (event) {
		event.preventDefault();
		nicknameForm.requestSubmit();
	}

	nicknameForm.onsubmit = function (event) {
		event.preventDefault();
		const form = nicknameForm;
		const url = new URL(form.action);
		const formData = new FormData(form);
		fetch(url, {
			method: form.method,
			body: formData,
			mode: 'same-origin',
		})
			.then(response => response.json())
			.then(data => {
				console.log("message: " + data.message);
				localStorage.setItem('savedNickname', data.nickname);
				nicknameInput.value = data.nickname;
				nicknameInput.classList.add('nickname-updated');
			}).catch(error => {
				console.error('Erreur lors de la mise à jour du nom d\'utilisateur :', error);
			});
	}


	fetch("/accounts/profil/nickname")
		.then(response => response.json())
		.then(data => {
			let savedNickname = localStorage.getItem('savedNickname');
			let savedImage = localStorage.getItem('image');
			let defaultUsername = data.username;

			if (data && data.username && data.nickname !== null) {
				localStorage.setItem('savedNickname', data.nickname);
				nicknameInput.value = data.nickname;
				nicknameInput.classList.add('nickname-updated');
			}
			// else {
			// 	console.error('Erreur: Aucun utilisateur ou pseudonyme dans la réponse.');
			// }
			console.log(data);
		})
		.catch(error => {
			console.error('Erreur lors de la récupération des données du profil :', error);
		});

	const modifyImageButton = document.getElementById('modifyImageButton');

	modifyImageButton.onclick = function () {
		console.log("Le bouton a été cliqué !");
		profilPictureInput.click(); // Ouvre le sélecteur de fichier pour choisir une nouvelle image
	};

	// POUR LE FORM USER profil et user
	let user = document.getElementById('user');
	let searched_nickname = document.getElementById('searchInput');

	searched_nickname.addEventListener("keypress", (e) => {
		if (e.key == "Enter")
			user.click();
	});
	user.addEventListener("click", () => {
		if (searched_nickname.value)
			user.href = `/user/${searched_nickname.value}/`;
		user.setAttribute("data-link", `/user/${searched_nickname.value}/`);
	});

	document.addEventListener("click", (e) => {
		if (visibleList && !e.target.classList.contains("text")) {
			document.getElementById('listContact').classList.replace("visible-profile-y", "invisible-profile-y");
			visibleList = false;
		}
	});

	searched_nickname.addEventListener("click", () => {

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

	// Function to check if the username is already in the friends list
	function isFriend(nickname, friendsList) {
		return friendsList.includes(nickname);
	}

	document.getElementById("ladder").addEventListener("click", () => {
		console.log("click on ladder");
		const nickname = searched_nickname.value.trim(); //@Verena
		// const currentUser = document.getElementById("current-user").dataset.nickname;
		const currentUser = document.getElementById("ladder").dataset.nickname;
		if (nickname) {
			// Vérifie si l'utilisateur essaie de s'ajouter lui-même
			if (nickname === currentUser) {
				showAlert("You are already your own friend ♥︎");
				return;
			}
			// Appel de createListFriends pour obtenir la liste des amis
			createListFriends().then(friendsList => {
				if (isFriend(nickname, friendsList)) {
					showAlert("Friend already added ✕");
				} else {
					manageFriend("add", nickname);
					// showAlert("Friend added ✔︎"); // @Verena avec msg backend
				}
			}).catch(error => {
				console.error('Error fetching friends list:', error);
				showAlert("Error fetching friends list");
			});
		}
		searched_nickname.value = "";
	});

	async function fetchTemplate() {
		try {
			const response = await fetch('/chat/chat-tmp/');

			if (!response.ok)
				throw new Error('fetch chat/template : ERROR');

			const htmlContent = await response.text();
			const parser = new DOMParser();
			const doc = parser.parseFromString(htmlContent, 'text/html');
			templateContactList = doc.querySelector('template[list-contact-template]');
			console.log("fetch: chat-tmp.html: success!");
		} catch (error) {
			console.error('fetch chat/template : ERROR', error);
		}
	}
	function createListFriends() {
		console.log("==createListFriends FUNCTION==");
		return fetch("getList/friends", {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
		})
			.then(response => {
				if (!response.ok) {
					throw new Error('fetch getList/friends : ERROR');
				}
				return response.json();
			})
			.then(data => {
				console.log('Response server _data_ : users/friends : ', data.friend_list);
				// clear friends list on document
				document.getElementById("modalBodyContact").innerHTML = "";
				let modalTmp = document.createElement("p");
				modalTmp.className = "pseudoBlock d-flex align-items-end"
				data.friend_list.forEach(friend => {
					modalTmp.innerHTML = `
					${friend.nickname}
					<button class="inviteContact" type="button" class="btn" data-bs-toggle="tooltip"
						data-bs-placement="top" title="Invite the contact"
						alt="Button to invite the contact" id="btnInvite"></button>
					<button class="blockBtn" type="button" class="btn" data-bs-toggle="tooltip"
						data-bs-placement="top" title="Block the contact"
						alt="Button to block the contact" id="btnBlock"></button>
					`;
					document.getElementById("modalBodyContact").append(modalTmp);
					//document.getElementById("btnInvite").addEventListener("click", invitationFunct);
					document.getElementById("btnBlock").addEventListener("click", (e) => {
						manageFriend("block", e.target.closest(".modal-body").innerText);
					});
				});
				return data.friend_list.map(friend => friend.nickname); // Return the list of usernames
			})
			.catch(error => {
				console.error('request error: Fetch', error);
				throw error;
			});
	}

	function createListBlocked() {

		console.log("==createListFriends FUNCTION==");
		fetch("getList/blocked", {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
		})
			.then(response => {
				if (!response.ok) {
					throw new Error('fetch getList/blocked : ERROR');
				}
				return response.json();
			})
			.then(data => {

				console.log('Response server _data_ : users/blocked : ', data.users_blocked);
				// clear friends list on document
				document.getElementById("modalBodyBlocked").innerHTML = "";
				let modalTmp = document.createElement("p");
				modalTmp.className = "pseudoBlock d-flex align-items-end"
				data.users_blocked.forEach(user => {

					//let username = truncNickname(friend.username);
					modalTmp.innerHTML = `
						${user.nickname}
						<button class="unblockBtn" type="button" class="btn" data-bs-toggle="tooltip"
							data-bs-placement="top" title="Unblock the contact"
							alt="Button to unblock the contact" id="btnUnblock"></button>
						`
					document.getElementById("modalBodyBlocked").append(modalTmp);
					document.getElementById("btnUnblock").addEventListener("click", (e) => {
						manageFriend("unblock", e.target.closest(".pseudoBlock").innerText);
						e.target.closest(".pseudoBlock").remove();

					});

				})
			})
			.catch(error => {
				console.error('request error: Fetch', error);
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
					data.user_list.map(user => {

						//take template
						var tpl = templateContactList.content.cloneNode(true);
						tpl.querySelector(".contact").id = `${user.nickname}-contact-id`;
						tpl.querySelector("[data-image]").src = user.profil_picture;
						tpl.querySelector("[data-name]").textContent = truncNickname(user.nickname);
						tpl.querySelector("[data-full-name]").textContent = user.nickname;

						// Set the status indicator @Verena Status
						let statusIndicator = tpl.querySelector(".status-indicator");
						statusIndicator.textContent = user.status; // Assuming user.status contains the status
						statusIndicator.setAttribute('data-status', user.status); // Set data-status attribute

						// Modify the status indicator color based on status
						if (user.status === 'online') {
							statusIndicator.classList.add('online');
						} else if (user.status === 'offline') {
							statusIndicator.classList.add('offline');
						} else if (user.status === 'playing') {
							statusIndicator.classList.add('playing');
						} else if (user.status === '') {
							statusIndicator.classList.add('empty');
						}

						//insert contact 
						document.getElementById("listContact").append(tpl);
						handle_click_contact(document.getElementById("listContact").lastElementChild);

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

	function truncNickname(nickname) {

		if (nickname.length > 7) {
			nickname = nickname.substring(0, 7) + "...";
			console.log(`truncNickname: ${nickname}`);
		}
		return nickname;
	}

	function handle_click_contact(contact) {

		contact.addEventListener('click', () => {

			console.log("CLICK on CONTACT");
			const contactName = contact.querySelector("[data-full-name]").textContent;
			const img = contact.querySelector("[data-image]").src;
			//console.log(`Clic sur le contact ${contactName}. Image source: ${img}`);
			searched_nickname.value = contactName;
			searched_nickname.focus();
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
	function manageFriend(action, target) {


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
				showAlert(data.message);
			})
			.catch(error => {
				// Le traitement des erreurs ici
				console.error('Request fetch Error:', error);
			});
	}

	// Fonction pour creer et afficher une alerte personnalisée
	function showAlert(message) {

		// Crée un élément semi-transparent pour recouvrir la page
		var overlay = document.createElement('div');
		overlay.className = 'overlay-alert';
		document.body.appendChild(overlay);

		// Crée un élément d'alerte
		var alertElement = document.createElement('div');
		alertElement.className = 'custom-alert';

		// Crée un élément pour le titre
		var titleElement = document.createElement('div');
		titleElement.className = 'alert-title';
		titleElement.textContent = 'Alert information';

		// Crée un bouton de fermeture
		var closeButton = document.createElement('button');
		closeButton.textContent = 'X';
		closeButton.className = 'close-button';
		closeButton.onclick = function () {
			document.body.removeChild(overlay);
			document.body.removeChild(alertElement);
		};

		// Crée un élément pour le message
		var messageContainer = document.createElement('div');
		messageContainer.className = 'message-container';

		// Ajoute le texte du message à l'élément de message
		var messageElement = document.createElement('div');
		messageElement.textContent = message;

		// Ajoute les éléments au DOM
		titleElement.appendChild(closeButton);
		alertElement.appendChild(titleElement);
		messageContainer.appendChild(messageElement);
		alertElement.appendChild(messageContainer);
		document.body.appendChild(alertElement);
		document.body.appendChild(overlay);
	}
};

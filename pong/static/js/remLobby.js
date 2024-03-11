import { socket } from './index.js';
import { router } from './router.js';

export function remLobby(gameId) {
	let button = document.getElementById('startButton');
	let isNicknameValid = false;

	socket.onmessage = function (event) {
		const data = JSON.parse(event.data);
		if (data.type == "game_invitation" && data.message.includes("#accept")) {
			const gameId = parseInt(data.message.split(' ')[1]);
			history.pushState(null, null, `/remote/${gameId}`);
			router();
		}
	};


	document.getElementById('inviteButton').addEventListener('click', function () {
		var player2Nickname = document.getElementById('player2').value;
		const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
		// Bloque l invitation a soi meme
		console.log("Player 1 Username:", player1_username);
		if (player2Nickname.trim() === document.getElementById('player1_username').value) {
			showAlert("You can't play against yourself !");
			return;
		}
		if (player2Nickname.trim() !== "") {
			var data = {
				nickname: player2Nickname
			};

			fetch(`/remLobby/${gameId}/`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-Requested-With': 'XMLHttpRequest',
					'X-CSRFToken': csrftoken,
				},
				body: JSON.stringify(data),
			})
				.then(response => response.json())
				.then(result => {
					console.log(result);
					if (result.error_message) {
						showAlert(result.error_message);
						isNicknameValid = false;
					} else {
						document.getElementById('onlineFriend').textContent = result.nickname;
						isNicknameValid = true;
						socket.send(JSON.stringify({
							'type': 'game_invitation',
							'id': "id" + Math.random().toString(16).slice(2),
							'target': result.nickname, //nickname target
							'message': `#invitation ${gameId}`
						}));
					}
				})
				.catch(error => {
					console.error('Error Fetch request :', error);
					isNicknameValid = false;
				});

		} else {
			showAlert("Please enter the nickname of player 2 before inviting.");
			isNicknameValid = false;
		}
	});

	button.addEventListener('click', e => {
		if (isNicknameValid == false) {
			e.preventDefault();
			e.stopPropagation();
			showAlert("Please enter a valid nickname first.");
		}
	});

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
}
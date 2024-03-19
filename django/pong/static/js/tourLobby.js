export function tourLobby(tournamentId) {
	let button = document.getElementById('startButton');
	let isNicknameValid = false;

	document.getElementById('inviteButton').addEventListener('click', function () {
		var player2Nickname = document.getElementById('playerInput2').value;
		var player3Nickname = document.getElementById('playerInput3').value;
		var player4Nickname = document.getElementById('playerInput4').value;

		const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

		// Bloque l invitation a soi meme
		console.log("Player 1 Username:", player1_username);
		// if (player2Nickname.trim() === document.getElementById('player1_username').value) {
		// 	showAlert("You can't play against yourself !");
		// 	return;
		// }

		// if (player3Nickname.trim() === document.getElementById('player1_username').value) {
		// 	showAlert("You can't play against yourself !");
		// 	return;
		// }

		// if (player4Nickname.trim() === document.getElementById('player1_username').value) {
		// 	showAlert("You can't play against yourself !");
		// 	return;
		// }

		if (player2Nickname.trim() !== "" && player3Nickname.trim() !== "" && player4Nickname.trim() !== "") {
			var data = {
				p2Nickname: player2Nickname,
				p3Nickname: player3Nickname,
				p4Nickname: player4Nickname,
			};

			fetch(`/tourLobby/${tournamentId}/`, {
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
						showAlert(`Invalid username: ${result.error_message}`);
						isNicknameValid = false;
					} else {
						document.getElementById('onFr2').textContent = result.p2Nickname;
						document.getElementById('onFr3').textContent = result.p3Nickname;
						document.getElementById('onFr4').textContent = result.p4Nickname;
						isNicknameValid = true;
					}
				})
				.catch(error => {
					console.error('Error Fetch request :', error);
					isNicknameValid = false;
				});

		} else {
			showAlert("Please enter the username of the 3 other players before inviting.");
			isNicknameValid = false;
		}
	});

	button.addEventListener('click', e => {

		if (!isNicknameValid) {
			e.preventDefault();
			e.stopPropagation();
			showAlert("Please enter a valid username first.");
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
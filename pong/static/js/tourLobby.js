export function tourLobby(tournamentId) {
	let button = document.getElementById('startButton');
	let isUsernameValid = false;

	document.getElementById('inviteButton').addEventListener('click', function () {
		var player2Username = document.getElementById('playerInput2').value;
		var player3Username = document.getElementById('playerInput3').value;
		var player4Username = document.getElementById('playerInput4').value;

		const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

		if (player2Username.trim() !== "" && player3Username.trim() !== "" && player4Username.trim() !== "") {
			var data = {
				p2Username: player2Username,
				p3Username: player3Username,
				p4Username: player4Username,
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
						isUsernameValid = false;
					} else {
						document.getElementById('onFr2').textContent = result.p2Username;
						document.getElementById('onFr3').textContent = result.p3Username;
						document.getElementById('onFr4').textContent = result.p4Username;
						isUsernameValid = true;
					}
				})
				.catch(error => {
					console.error('Error Fetch request :', error);
					isUsernameValid = false;
				});
		} else {
			showAlert("Please enter the username of the 3 other players before inviting.");
			isUsernameValid = false;
		}
	});

	button.addEventListener('click', e => {
		if (!isUsernameValid) {
			e.preventDefault();
			showAlert("Please enter a valid username first.");
		}
	});

	function showAlert(message) {
		// Créer un élément d'alerte
		var alertElement = document.createElement('div');
		alertElement.className = 'custom-alert'; // Ajouter la classe CSS personnalisée

		// Créer un élément pour le titre
		var titleElement = document.createElement('div');
		titleElement.className = 'alert-title'; // Ajouter une classe pour le titre
		titleElement.textContent = 'Alert information'; // Ajouter le titre ici

		// Créer un bouton de fermeture
		var closeButton = document.createElement('button');
		closeButton.textContent = 'X';
		closeButton.className = 'close-button'; // Ajouter une classe CSS pour le style du bouton
		closeButton.onclick = function () {
			document.body.removeChild(alertElement); // Supprimer l'alerte lorsque le bouton est cliqué
		};

		// Créer un élément pour le message
		var messageContainer = document.createElement('div');
		messageContainer.className = 'message-container'; // Ajouter une classe pour le conteneur de message

		// Ajouter le texte du message à l'élément de message
		var messageElement = document.createElement('div');
		messageElement.textContent = message;

		// Ajouter les éléments au DOM
		titleElement.appendChild(closeButton);
		alertElement.appendChild(titleElement);
		messageContainer.appendChild(messageElement);
		alertElement.appendChild(messageContainer);
		document.body.appendChild(alertElement);
	}
}
export function remLobby(remoteId) {
    let button = document.getElementById('startButton');
    let isUsernameValid = false;

    document.getElementById('inviteButton').addEventListener('click', function () {
        var player2Username = document.getElementById('player2').value;
        const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
        player2Username = player2Username.charAt(0).toUpperCase() + player2Username.slice(1);

        if (player2Username.trim() !== "") {
            var data = {
                username: player2Username
            };

            fetch(`/remLobby/${remoteId}/`, {
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
                        isUsernameValid = false;
                    } else {
                        document.getElementById('onlineFriend').textContent = result.username;
                        isUsernameValid = true;
                    }
                })
                .catch(error => {
                    console.error('Error Fetch request :', error);
                    isUsernameValid = false;
                });

        } else {
            showAlert("Please enter the username of player 2 before inviting.");
            isUsernameValid = false;
        }
    });

    if (button) {
        button.addEventListener('click', function () {
            if (isUsernameValid) {
                window.location.href = `/remote/${remoteId}`;
            } else {
                showAlert("Please enter a valid username first.");
            }
        });
    }
    // ALERTE PERSONNALISEE
    function showAlert(message) {
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
    }
}
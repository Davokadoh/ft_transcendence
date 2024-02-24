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
                        alert(result.error_message);
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
            alert("Please enter the username of player 2 before inviting.");
            isUsernameValid = false;
        }
    });

    if (button) {
        button.addEventListener('click', function () {
            if (isUsernameValid) {
                window.location.href = `/remote/${remoteId}`;
            } else {
                alert("Please enter a valid username first.");
            }
        });
    }
}
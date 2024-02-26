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
                p4Username: player4Username
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
                        alert(`Invalid username: ${result.error_message}`);
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
            alert("Please enter the username of the 3 other players before inviting.");
            isUsernameValid = false;
        }
    });

    if (button) {
        button.addEventListener('click', function () {
            if (isUsernameValid) {
                window.location.href = `/tournament/${tournamentId}`;
            } else {
                alert("Please enter a valid username first.");
            }
        });
    }
}
export function lobby(gameId) {
    let button = document.getElementById('startButton');
    let isNicknameValid = false;

    document.getElementById('inviteButton').addEventListener('click', function () {
        var player2Nickname = document.getElementById('player2').value;
        const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

        if (player2Nickname.trim() !== "") {
            var data = {
                nickname: player2Nickname
            };

            fetch(`/lobby/${gameId}/`, {
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
                    }
                })
                .catch(error => {
                    console.error('Error Fetch request :', error);
                    isNicknameValid = false;
                });

        } else {
            showAlert("Veuillez entrer le pseudonyme du joueur 2 avant d'inviter.");
            isNicknameValid = false;
        }
    });

    button.addEventListener('click', e => {
        if (!isNicknameValid) {
            e.preventDefault();
            e.stopPropagation();
            showAlert("Veuillez d'abord entrer un nom d'utilisateur valide.");
        }
    });

    // Fonction pour créer et afficher une alerte personnalisée
    function showAlert(message) {
        var overlay = document.createElement('div');
        overlay.className = 'overlay-alert';
        document.body.appendChild(overlay);

        var alertElement = document.createElement('div');
        alertElement.className = 'custom-alert';

        var titleElement = document.createElement('div');
        titleElement.className = 'alert-title';
        titleElement.textContent = 'Information d\'alerte';

        var closeButton = document.createElement('button');
        closeButton.textContent = 'X';
        closeButton.className = 'close-button';
        closeButton.onclick = function () {
            document.body.removeChild(overlay);
            document.body.removeChild(alertElement);
        };

        var messageContainer = document.createElement('div');
        messageContainer.className = 'message-container';

        var messageElement = document.createElement('div');
        messageElement.textContent = message;

        titleElement.appendChild(closeButton);
        alertElement.appendChild(titleElement);
        messageContainer.appendChild(messageElement);
        alertElement.appendChild(messageContainer);
        document.body.appendChild(alertElement);
        document.body.appendChild(overlay);
    }

    function createListContactInLobby() {
        fetch("/lobby/getList/users", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('fetch getList/users : ERROR');
                }
				console.log("response", response);
                return response.json();
            })
            .then(data => {
				console.log("data", data);
                document.getElementById("listContact").innerHTML = "";
                data.user_list.map(user => {
                    var tpl = document.createElement("div");
                    tpl.className = "contact";
                    tpl.id = `${user.nickname}-contact-id`;
                    tpl.innerHTML = `
                        <img src="${user.profil_picture}" alt="${user.nickname}" class="contact-image" />
                        <p class="contact-name">${truncNickname(user.nickname)}</p>
                    `;
                    document.getElementById("listContact").appendChild(tpl);
                    handle_click_contact(tpl);
                });
				console.log(document.getElementById("listContact").innerHTML);
                handle_input_steam();
            })
            .catch(error => {
                console.error('request error: Fetch', error);
            });
    }

    function truncNickname(nickname) {
        if (nickname.length > 7) {
            nickname = nickname.substring(0, 7) + "...";
        }
        return nickname;
    }

    function handle_click_contact(contact) {
		contact.addEventListener('click', () => {
			const contactName = contact.querySelector(".contact-name").textContent;
			const img = contact.querySelector(".contact-image").src;
			document.getElementById('player2').value = contactName;
			document.getElementById('listContact').classList.replace("visible-profile-y", "invisible-profile-y");
		});
	}

    function handle_input_steam() {
        const contacts = document.querySelectorAll('.contact');
        document.getElementById('player2').addEventListener("input", function (e) {
            const value = e.target.value;
            contacts.forEach(user => {
                const name = user.querySelector(".contact-name").textContent;
                const isVisible = name.toLowerCase().includes(value.toLowerCase());
                user.classList.toggle("hide", !isVisible);
            });
        });
    }

    createListContactInLobby();
}

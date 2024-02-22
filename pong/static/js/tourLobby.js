export function tourLobby(tournament_id){
	document.getElementById('inviteButton').addEventListener('click', function () {
		var player2Username = document.getElementById('otherplayer').value;
		const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
		if (player2Username.trim() !== "") {
			var data = {
				player2_username: player2Username
			};

			fetch(`/tourLobby/${tournament_id}/`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-Requested-With': 'XMLHttpRequest',
					'X-CSRFToken' : csrftoken,
				},
				body: JSON.stringify(data),
			})
				.then(response => response.json())
				.then(result => {
					console.log(result);
				})
				.catch(error => {
					console.error('Erreur lors de la requête fetch :', error);
				});
		} else {
			alert("Veuillez entrer le nom d'utilisateur du joueur 2 avant d'inviter.");
		}
	});
}
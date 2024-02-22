export function lobby_rem(remote_id){
	document.getElementById('inviteButton').addEventListener('click', function () {
		var inviteUsername = document.getElementById('inviteUsername').value;
	
		if (inviteUsername.trim() !== "") {
			var data = {
				team: 'NomDeVotreEquipe',
				invited_player: inviteUsername
			};
			// let remote_id = document.getElementById('inviteUsername');
			console.log("GAME_ID : ", remote_id);
			console.log("INVIT : ", inviteUsername);
			fetch('/lobby/' + remote_id, { 
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-Requested-With': 'XMLHttpRequest',
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
			alert('Veuillez entrer un nom d\'utilisateur avant d\'inviter.');
		}
	});
}
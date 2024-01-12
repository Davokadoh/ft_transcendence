// script.js

// var statsBtn = document.getElementById('statsBtn');
// var modal = document.getElementById('statsModal');

// statsBtn.addEventListener('click', function() {
//     modal.style.display = 'block';
// });

// function statsModalClose() {
//     modal.style.display = 'none';
// }

// window.addEventListener('click', function(event) {
//     if (event.target === modal) {
//         statsModalClose();
//     }
// });



$('#myModal').on('shown.bs.modal', function () {
	$('#myInput').trigger('focus')
})

console.log('Script Modal loaded successfully!');


$(document).ready(function () {
	// SCRIPT POUR SETTINGS VITESSE BALLE ET PADDLES
// Mise à jour des valeurs affichées lorsque les curseurs sont modifiés
document.getElementById('paddleSpeed').addEventListener('input', function () {
	document.getElementById('paddleSpeedValue').textContent = this.value;
});

document.getElementById('ballSpeed').addEventListener('input', function () {
	document.getElementById('ballSpeedValue').textContent = this.value;
});

// ... Ajoutez des écouteurs pour d'autres paramètres ... 

document.getElementById('saveButton').addEventListener('click', function() {
    // Code de sauvegarde des paramètres
    // ...

    // Fermer la modal
    $('#myModal').modal('hide');
});

// Code pour restaurer les valeurs par défaut si la modal est fermée sans sauvegarde
$('#myModal').on('hidden.bs.modal', function () {
    // Remettre les valeurs par défaut
    document.getElementById('paddleSpeed').value = 50;
    document.getElementById('ballSpeed').value = 50;
    // ... (restaurez d'autres paramètres au besoin)
});

	// Initialiser les info-bulles
	var tooltips = new bootstrap.Tooltip(document.body, {
		selector: '[data-toggle="tooltip"]'
	});


	console.log('Script modif Image chargé avec succès !');
	// Fonction pour gérer le téléchargement d'image
	$('#modifyImageButton').on('click', function () {
		$('#imageInput').click();
	});

	$('#imageInput').on('change', function (event) {
		const fileInput = event.target;
		const profileImage = $('#profileImage');

		const file = fileInput.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = function (e) {
				profileImage.attr('src', e.target.result);
			};
			reader.readAsDataURL(file);
		}
	});

	// Fonction pour gérer la modification du nom d'utilisateur
	$('#username').on('blur', function () {
		console.log('Script fin chargé avec succès !');
		const usernameInput = $('#username');
		const newUsername = usernameInput.val().trim();
		if (newUsername !== '') {
			// Vous pouvez envoyer newUsername à votre serveur ou API pour la mise à jour
			console.log('Nouveau nom d\'utilisateur :', newUsername);
		} else {
			// Réinitialisez la valeur si elle est vide
			usernameInput.val('John Doe');
		}

	});
});

// Placer ce code à la fin de : profil.js pour enregistrer l image et le nom d utilisateur
$(document).ready(function () {
	// Charger les données sauvegardées
	const savedUsername = localStorage.getItem('username');
	const savedImage = localStorage.getItem('image');

	// Mettre à jour l'image et le nom d'utilisateur si sauvegardés
	if (savedUsername) {
		$('#username').val(savedUsername);
	}

	if (savedImage) {
		$('#profileImage').attr('src', savedImage);
	}

	// Fonction pour gérer le téléchargement d'image
	$('#modifyImageButton').on('click', function () {
		$('#imageInput').click();
	});

	$('#imageInput').on('change', function (event) {
		const fileInput = event.target;
		const profileImage = $('#profileImage');

		const file = fileInput.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = function (e) {
				const imageData = e.target.result;
				profileImage.attr('src', imageData);
				// Sauvegarder l'image dans le stockage local
				localStorage.setItem('image', imageData);
			};
			reader.readAsDataURL(file);
		}
	});

	// Fonction pour gérer la modification du nom d'utilisateur
	$('#username').on('blur', function () {
		const usernameInput = $('#username');
		const newUsername = usernameInput.val().trim();
		if (newUsername !== '') {
			// Vous pouvez envoyer newUsername à votre serveur ou API pour la mise à jour
			console.log('Nouveau nom d\'utilisateur :', newUsername);
			// Sauvegarder le nom d'utilisateur dans le stockage local
			localStorage.setItem('username', newUsername);
		} else {
			// Réinitialisez la valeur si elle est vide
			usernameInput.val('John Doe');
		}
	});
});

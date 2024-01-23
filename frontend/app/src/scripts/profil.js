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



$('#setModal').on('shown.bs.modal', function () {
	$('#myInput').trigger('focus')
})

console.log('Script Modal loaded successfully!');


// SCRIPT POUR SETTINGS VITESSE BALLE ET PADDLES
$(document).ready(function () {
	    // Mise à jour des valeurs affichées lorsque les curseurs sont modifiés
		$('#paddleSpeed').on('input', function () {
			$('#paddleSpeedValue').text($(this).val());
		});
	
		$('#ballSpeed').on('input', function () {
			$('#ballSpeedValue').text($(this).val());
		});
	
		console.log('Script Modal loaded successfully!');
	
		// Code pour restaurer les valeurs par défaut si la modal est fermée sans sauvegarde
		$('#setModal').on('hidden.bs.modal', function () {
			console.log('Script valeurs par defaut reset chargé avec succès !');
			// Remettre les valeurs par défaut
			$('#paddleSpeed, #ballSpeed').val(50);
			// ... (restaurer ici d'autres paramètres au besoin)
		});
	
		// Code pour sauvegarder les paramètres lorsqu'on clique sur le bouton "Save" ou "Close"
		$('#saveButton, .modalCloseButton, .modalClose').on('click', function () {
			console.log('Script save infos ou close sans save chargé avec succès !');
			// Récupérer les valeurs modifiées depuis les champs de la modal
			var paddleSpeedValue = $('#paddleSpeed').val();
			var ballSpeedValue = $('#ballSpeed').val();
			// ... (récupérer d'autres paramètres au besoin)
	
			// Code de sauvegarde des paramètres à ajouter ici
			// Vous pouvez utiliser localStorage, sessionStorage, AJAX, etc.
	
			// Fermer la modal
			$('#setModal').modal('hide');
		});
	
		
	// Initialiser les info-bulles non utiliser normallement - a supprimer
	// var tooltips = new bootstrap.Tooltip(document.body, {
	// 	selector: '[data-toggle="tooltip"]'
	// });


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

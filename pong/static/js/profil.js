// // ANCIEN AVEC JQUERY

// // var statsBtn = document.getElementById('statsBtn');
// // var modal = document.getElementById('statsModal');

// // statsBtn.addEventListener('click', function() {
// //     modal.style.display = 'block';
// // });

// // function statsModalClose() {
// //     modal.style.display = 'none';
// // }

// // window.addEventListener('click', function(event) {
// //     if (event.target === modal) {
// //         statsModalClose();
// //     }
// // });


// $('#setModal').on('shown.bs.modal', function () {
// 	$('#myInput').trigger('focus')
// })

// console.log('Script Modal profil loaded successfully!');

// // SCRIPT POUR SETTINGS VITESSE BALLE ET PADDLES
// $(document).ready(function () {
// 	// console.log('Script paddle speed loaded successfully!');
// 	// Mise à jour des valeurs affichées lorsque les curseurs sont modifiés
// 	$('#paddleSpeed').on('input', function () {
// 		$('#paddleSpeedValue').text($(this).val());
// 	});

// 	$('#ballSpeed').on('input', function () {
// 		$('#ballSpeedValue').text($(this).val());
// 	});

// 	console.log('Script ball speed modif loaded successfully!');

// 	// // Code pour restaurer les valeurs par défaut si la modal est fermée sans sauvegarde ne fonctionne pas BE?
// 	// $('#setModal').on('hidden.bs.modal', function () {
// 	// 	console.log('Script valeurs par defaut reset chargé avec succès !');
// 	// 	// Remettre les valeurs par défaut
// 	// 	$('#paddleSpeed, #ballSpeed').val(50);
// 	// 	// ... (restaurer ici d'autres paramètres au besoin)
// 	// });

// 	// Code pour restaurer les valeurs par défaut si la modal est fermée sans sauvegarde
// 	$('#setModal').on('hidden.bs.modal', function () {
// 		console.log('Script valeurs par defaut reset chargé avec succès !');
// 		// Remettre les valeurs par défaut
// 		$('#paddleSpeed, #ballSpeed').val(50);
// 		$('#paddleSpeedValue, #ballSpeedValue').text('50'); // Mettre à jour les valeurs affichées
// 		// ... (restaurer ici d'autres paramètres au besoin)
// 	});

// 	// Code pour sauvegarder les paramètres lorsqu'on clique sur le bouton "Save" ou "Close"
// 	$('#saveButton, .modalCloseButton, .modalClose').on('click', function () {
// 		console.log('Script save infos ou close sans save chargé avec succès !');
// 		// Récupérer les valeurs modifiées depuis les champs de la modal
// 		var paddleSpeedValue = $('#paddleSpeed').val();
// 		var ballSpeedValue = $('#ballSpeed').val();
// 		// ... (récupérer d'autres paramètres au besoin)

// 		// Code de sauvegarde des paramètres à ajouter ici
// 		// Vous pouvez utiliser localStorage, sessionStorage, AJAX, etc.

// 		// Fermer la modal
// 		$('#setModal').modal('hide');
// 	});


// 	// Placer ce code à la fin de : profil.js pour enregistrer l image et le nom d utilisateur
// 	// $(document).ready(function () {
// 	// Charger les données sauvegardées
// 	const savedUsername = localStorage.getItem('username');
// 	const savedImage = localStorage.getItem('image');

// 	// Mettre à jour l'image et le nom d'utilisateur si sauvegardés
// 	if (savedUsername) {
// 		$('#username').val(savedUsername);
// 	}

// 	if (savedImage) {
// 		$('#profileImage').attr('src', savedImage);
// 	}

// 	// Fonction pour gérer le téléchargement d'image
// 	$('#modifyImageButton').on('click', function () {
// 		$('#imageInput').click();
// 	});

// 	$('#imageInput').on('change', function (event) {
// 		const fileInput = event.target;
// 		const profileImage = $('#profileImage');

// 		const file = fileInput.files[0];
// 		if (file) {
// 			const reader = new FileReader();
// 			reader.onload = function (e) {
// 				const imageData = e.target.result;
// 				profileImage.attr('src', imageData);
// 				// Sauvegarder l'image dans le stockage local
// 				localStorage.setItem('image', imageData);
// 			};
// 			reader.readAsDataURL(file);
// 		}
// 	});

// 	// Fonction pour gérer la modification du nom d'utilisateur
// 	$('#username').on('blur', function () {
// 		const usernameInput = $('#username');
// 		const newUsername = usernameInput.val().trim();
// 		if (newUsername !== '') {
// 			// Vous pouvez envoyer newUsername à votre serveur ou API pour la mise à jour
// 			console.log('Nouveau nom d\'utilisateur :', newUsername);
// 			// Sauvegarder le nom d'utilisateur dans le stockage local
// 			localStorage.setItem('username', newUsername);
// 		} else {
// 			// Réinitialisez la valeur si elle est vide
// 			usernameInput.val('John Doe');
// 		}
// 	});
// });




// NOUVEAU EN  JS

// Code pour ouvrir la modal
console.log('Script modal profil loaded successfully!');
var statsBtn = document.getElementById('statsBtn');
var modal = document.getElementById('statsModal');

statsBtn.addEventListener('click', function () {
	modal.style.display = 'block';
});

// Fonction pour fermer la modal
function statsModalClose() {
	modal.style.display = 'none';
}

// Fermer la modal en cliquant en dehors de celle-ci
window.addEventListener('click', function (event) {
	if (event.target === modal) {
		statsModalClose();
	}
});

console.log('Script Modal loaded successfully!');

// SCRIPT POUR SETTINGS VITESSE BALLE ET PADDLES
document.addEventListener('DOMContentLoaded', function () {
	// Mise à jour des valeurs affichées lorsque les curseurs sont modifiés
	var paddleSpeedInput = document.getElementById('paddleSpeed');
	var paddleSpeedValue = document.getElementById('paddleSpeedValue');

	var ballSpeedInput = document.getElementById('ballSpeed');
	var ballSpeedValue = document.getElementById('ballSpeedValue');

	paddleSpeedInput.addEventListener('input', function () {
		paddleSpeedValue.textContent = paddleSpeedInput.value;
	});

	ballSpeedInput.addEventListener('input', function () {
		ballSpeedValue.textContent = ballSpeedInput.value;
	});

	console.log('Script ball speed loaded successfully!');

	// Code pour restaurer les valeurs par défaut si la modal est fermée sans sauvegarde
	var setModal = document.getElementById('setModal');

	setModal.addEventListener('hidden.bs.modal', function () {
		console.log('Script valeurs par defaut reset chargé avec succès !');
		// Remettre les valeurs par défaut
		paddleSpeedInput.value = 50;
		ballSpeedInput.value = 50;
		paddleSpeedValue.textContent = '50';
		ballSpeedValue.textContent = '50';
		// ... (restaurer ici d'autres paramètres au besoin)
	});

	// Code pour sauvegarder les paramètres lorsqu'on clique sur le bouton "Save" ou "Close"
	var saveButton = document.getElementById('saveButton');

	saveButton.addEventListener('click', function () {
		console.log('Script save infos ou close sans save chargé avec succès !');
		// Récupérer les valeurs modifiées depuis les champs de la modal
		var paddleSpeedValue = paddleSpeedInput.value;
		var ballSpeedValue = ballSpeedInput.value;
		// ... (récupérer d'autres paramètres au besoin)

		// Code de sauvegarde des paramètres à ajouter ici
		// Vous pouvez utiliser localStorage, sessionStorage, AJAX, etc.

		// Fermer la modal
		statsModalClose();
	});


	// Placer ce code à la fin de : profil.js pour enregistrer l'image et le nom d'utilisateur
	// Charger les données sauvegardées
	var savedUsername = localStorage.getItem('username');
	var savedImage = localStorage.getItem('image');

	// Mettre à jour l'image et le nom d'utilisateur si sauvegardés
	var usernameInput = document.getElementById('username');
	var profileImage = document.getElementById('profileImage');

	if (savedUsername) {
		usernameInput.value = savedUsername;
	}

	if (savedImage) {
		profileImage.src = savedImage;
	}

	// Fonction pour gérer le téléchargement d'image
	var modifyImageButton = document.getElementById('modifyImageButton');
	var imageInput = document.getElementById('imageInput');

	modifyImageButton.addEventListener('click', function () {
		imageInput.click();
	});

	imageInput.addEventListener('change', function (event) {
		const fileInput = event.target;
		const profileImage = document.getElementById('profileImage');

		const file = fileInput.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = function (e) {
				const imageData = e.target.result;
				profileImage.src = imageData;
				// Sauvegarder l'image dans le stockage local
				localStorage.setItem('image', imageData);
			};
			reader.readAsDataURL(file);
		}
	});

	// Fonction pour gérer la modification du nom d'utilisateur
	usernameInput.addEventListener('blur', function () {
		const newUsername = usernameInput.value.trim();
		if (newUsername !== '') {
			// Vous pouvez envoyer newUsername à votre serveur ou API pour la mise à jour
			console.log('Nouveau nom d\'utilisateur :', newUsername);
			// Sauvegarder le nom d'utilisateur dans le stockage local
			localStorage.setItem('username', newUsername);
		} else {
			// Réinitialisez la valeur si elle est vide
			// usernameInput.value = 'John Doe';
			fetch("/profil/username");
			.then(response => {
				usernameInput.value = response.text();
			})
		}
	});
});

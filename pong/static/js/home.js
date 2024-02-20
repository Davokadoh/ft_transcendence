// document.addEventListener('DOMContentLoaded', function() {
//     const playButton = document.querySelector('.game-btn');
//     const playLink = document.querySelector('.nav-link[data-link]');

//     playButton.addEventListener('click', function() {
//         window.location.href = playLink.getAttribute('href');
//     });
// });

console.log("script home BTN play load with success");
    document.addEventListener('DOMContentLoaded', function () {
        // Récupération du bouton game-btn
        var gameBtn = document.querySelector('.game-btn');
        
        // Ecouteur d'événements sur le clic du bouton game-btn
        gameBtn.addEventListener('click', function () {
            // Création d'une nouvelle requête XMLHttpRequest
            var xhr = new XMLHttpRequest();
			console.log("script BTN PLAY OK");
            // Configuration de la requête
            xhr.open('GET', '/play', true);

            // Gestionnaire d'événement pour la réponse
            xhr.onload = function () {
                if (xhr.status >= 200 && xhr.status < 300) {
                    // Succès de la requête
                    // Remplacer le contenu actuel de la page par le contenu de la page /play
                    document.body.innerHTML = xhr.responseText;
                } else {
                    // Erreur de la requête
                    console.error('Erreur lors du chargement de la page /play');
                }
            };

            // Gestionnaire d'événement pour les erreurs
            xhr.onerror = function () {
                console.error('Erreur lors de la requête vers la page /play');
            };

            // Envoyer la requête
            xhr.send();
        });
    });


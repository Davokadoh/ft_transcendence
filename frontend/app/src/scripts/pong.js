'use strict';

var canvas;

document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('canvas');
    if (!canvas) {
        console.error('Canvas not found');
        return;
    }

    const context = canvas.getContext('2d');
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);
    console.log("salut2");
    // Draw middle line
    context.strokeStyle = 'white';
    context.beginPath();
    context.moveTo(canvas.width / 2, 0);
    context.lineTo(canvas.width / 2, canvas.height);
    context.stroke();
});

// function draw() {
//     console.log("salut1");
//     var context = canvas.getContext('2d');
//     // Draw field
//     context.fillStyle = 'black';
//     context.fillRect(0, 0, canvas.width, canvas.height);
//     console.log("salut2");
//     // Draw middle line
//     context.strokeStyle = 'white';
//     context.beginPath();
//     context.moveTo(canvas.width / 2, 0);
//     context.lineTo(canvas.width / 2, canvas.height);
//     context.stroke();
// }

// document.addEventListener('DOMContentLoaded', function () {
//     console.log('DOM content loaded');
//     canvas = document.getElementById('canvas');
//     draw();
// });

// script ne fonctionne pas
// Sélectionnez les éléments HTML
// const leftPaddle = document.querySelector('.left-paddle');
// const rightPaddle = document.querySelector('.right-paddle');

// // Définissez la vitesse de déplacement des raquettes
// const paddleSpeed = 5;

// // Écoutez les événements clavier
// document.addEventListener('keydown', handleKeyPress);
// document.addEventListener('keyup', handleKeyRelease);

// // Objet pour suivre les touches enfoncées
// const keys = {
//     w: false,
//     s: false,
//     ArrowUp: false,
//     ArrowDown: false,
// };

// // Fonction pour gérer l'appui des touches
// function handleKeyPress(event) {
//     keys[event.key] = true;
// }

// // Fonction pour gérer le relâchement des touches
// function handleKeyRelease(event) {
//     keys[event.key] = false;
// }

// // Fonction de mise à jour de la position des raquettes
// function update() {
//     if (keys['w'] && leftPaddle.offsetTop > 0) {
//         leftPaddle.style.top = `${leftPaddle.offsetTop - paddleSpeed}px`;
//     }
//     if (keys['s'] && leftPaddle.offsetTop + leftPaddle.offsetHeight < 400) {
//         leftPaddle.style.top = `${leftPaddle.offsetTop + paddleSpeed}px`;
//     }
//     if (keys['ArrowUp'] && rightPaddle.offsetTop > 0) {
//         rightPaddle.style.top = `${rightPaddle.offsetTop - paddleSpeed}px`;
//     }
//     if (keys['ArrowDown'] && rightPaddle.offsetTop + rightPaddle.offsetHeight < 400) {
//         rightPaddle.style.top = `${rightPaddle.offsetTop + paddleSpeed}px`;
//     }

//     // Continuez à appeler la fonction update pour mettre à jour la position
//     requestAnimationFrame(update);
// }

// // Démarrez la boucle de mise à jour
// update();

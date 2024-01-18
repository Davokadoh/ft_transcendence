// pong-entry.js
document.addEventListener("DOMContentLoaded", () => {
	console.log("Coucou");
	const canvasContainer = document.getElementById('canvas-container');
	if (!canvasContainer) {
		console.error('Containers not found');
	}
});
// const canvas = document.createElement('canvas');
// canvas.id = 'canvas';  // Ajoutez cette ligne pour définir l'ID du canvas
// canvas.width = 640;
// canvas.height = 480;
// canvasContainer.appendChild(canvas);

// // Chargez le script pong.js après la création du canvas
// const script = document.createElement('script');
// script.src = '/src/scripts/pong.js';
// document.body.appendChild(script);

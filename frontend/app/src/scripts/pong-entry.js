// pong-entry.js
const canvasContainer = document.getElementById('canvas-container');
const canvas = document.createElement('canvas');
canvas.width = 640;
canvas.height = 480;
canvasContainer.appendChild(canvas);

// Chargez le script pong.js après la création du canvas
const script = document.createElement('script');
script.src = '/src/scripts/pong.js';
document.body.appendChild(script);

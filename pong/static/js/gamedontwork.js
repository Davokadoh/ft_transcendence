let gameBoard = document.querySelector("#gameBoard");
const cxt = gameBoard.getContext("2d");
const scoreText = document.querySelector("#scoreText");
// const resetBtn = document.querySelector("#resetBtn");
var anim;
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const boardBackground = "black";
const middleLine = "white";
const paddle1Color = "white";
const paddle2Color = "white";
const ballColor = "white";
const ballRadius = 12.5;
// const paddleSpeed = 50;
// let intervalID;
let ballSpeed;
let ballX = gameWidth / 2;
let ballY = gameHeight / 2;
// let ballXDirection = 0;
// let ballYDirection = 0;
let player1Score = 0;
let player2Score = 0;
let paddle1 = {
    width: 20,
    height: 80,
    x: 0,
    y: 0
};
let paddle2 = {
    width: 20,
    height: 80,
    x: gameWidth - 20,
    y: gameHeight - 80
};

export function startGame() {
    // Assurez-vous que le canvas et le contexte sont initialisés après le chargement du DOM
    // document.addEventListener('DOMContentLoaded', function () {
        gameBoard = document.getElementById('gameBoard');
        // cxt = gameBoard.getContext('2d');
        reset();

        // Mouse click event
        document.querySelector('#start-game').addEventListener('click', play);
        document.querySelector('#stop-game').addEventListener('click', stop);
    // });
}

function drawBoard() {
    
    cxt.fillStyle = boardBackground;
    cxt.fillRect(0, 0, gameWidth, gameHeight);

    cxt.strokeStyle = middleLine;
    cxt.beginPath();
    cxt.moveTo(gameWidth / 2, 0);
    cxt.lineTo(gameWidth / 2, gameHeight);
    cxt.stroke();
};

function drawPaddles(){

    cxt.fillStyle = paddle1Color;
    cxt.fillRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);
    
    cxt.fillStyle = paddle2Color;
    cxt.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
}

function drawBall(ballX, ballY){
    cxt.fillStyle = ballColor;
    cxt.beginPath();
    cxt.arc(ballX, ballY, ballRadius, 0, 2 * Math.PI);
    cxt.fill();
};

function draw() {
    // var cxt = gameBoard.getContext('2d');
    drawBoard();
    drawPaddles();
    drawBall(ballX, ballY);
}

function play() {
    draw();
    anim = requestAnimationFrame(play);
}

function reset() {
    // Set ball and players to the center
    ballX = gameBoard.width / 2;
    ballY = gameBoard.height / 2;
    paddle1 = {
        width: 25,
        height: 100,
        x: 0,
        y: 0
    };
    paddle2 = {
        width: 25,
        height: 100,
        x: gameWidth - 25,
        y: gameHeight - 100
    };
    ballSpeed = 1;
    ballX = 0;
    ballY = 0;
    // ballXDirection = 0;
    // ballYDirection = 0;
}

function stop() {
    cancelAnimationFrame(anim);

    reset();

    // Init score
    player1Score = 0;
    player2Score = 0;

    // document.querySelector('#computer-score').textContent = game.computer.score;
    // document.querySelector('#player-score').textContent = game.player.score;

    draw();
}

// export function startGame() {
//     gameBoard = document.getElementById('gameBoard');
//     reset();

//     // Mouse click event
//     document.querySelector('#start-game').addEventListener('click', play);
//     document.querySelector('#stop-game').addEventListener('click', stop);

// };
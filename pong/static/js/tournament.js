var gameBoard;
var game;
var anim;
const cxt = gameBoard.getContext('2d');
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const boardBackground = "black";
const middleLine = "white";
const paddle1Color = "white";
const paddle2Color = "white";
const paddleBorder = "black";
const ballColor = "white";
const ballBorderColor = "white";
const ballRadius = 12.5;
const paddleSpeed = 50;
let intervalID;
let ballSpeed;
let ballX = gameWidth / 2;
let ballY = gameHeight / 2;
let ballXDirection = 0;
let ballYDirection = 0;
let player1Score = 0;
let player2Score = 0;
let paddle1 = {
    width: 25,
    height: 100,
    x: 0,
    y: 0
};
let paddle2 = {
    width: 25,
    height: 100,
    x: gameWidth - paddle2.witdth,
    y: gameHeight - paddle2.height
};

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
    cxt.strokeStyle = paddleBorder;

    cxt.fillStyle = paddle1Color;
    cxt.fillRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);
    cxt.strokeRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);
    
    cxt.fillStyle = paddle2Color;
    cxt.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
    cxt.strokeRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
};

function drawBall(){
    
    cxt.fillStyle = ballColor;
    cxt.strokeStyle = ballBorderColor;

    cxt.beginPath();
    cxt.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    cxt.strocke();
    cxt.fill();
};

function ballDirection(){
    ballSpeed = 1;
    if(Math.round(Math.random()) == 1){
        ballXDirection =  1; 
    }
    else{
        ballXDirection = -1; 
    }
    if(Math.round(Math.random()) == 1){
        ballYDirection = Math.random() * 1; //more random directions
    }
    else{
        ballYDirection = Math.random() * -1; //more random directions
    }
    ballX = gameWidth / 2;
    ballY = gameHeight / 2;
    drawBall(ballX, ballY);
}

function moveBall(){
    ballX += (ballSpeed * ballXDirection);
    ballY += (ballSpeed * ballYDirection);
};

function checkCollision(){
    if(ballY <= 0 + ballRadius){
        ballYDirection *= -1;
    }
    if(ballY >= gameHeight - ballRadius){
        ballYDirection *= -1;
    }
    if(ballX <= 0){
        player2Score+=1;
        updateScore();
        ballDirection();
        return;
    }
    if(ballX >= gameWidth){
        player1Score+=1;
        updateScore();
        ballDirection();
        return;
    }
    if(ballX <= (paddle1.x + paddle1.width + ballRadius)){
        if(ballY > paddle1.y && ballY < paddle1.y + paddle1.height){
            ballX = (paddle1.x + paddle1.width) + ballRadius; // if ball gets stuck
            ballXDirection *= -1;
            ballSpeed += 1;
        }
    }
    if(ballX >= (paddle2.x - ballRadius)){
        if(ballY > paddle2.y && ballY < paddle2.y + paddle2.height){
            ballX = paddle2.x - ballRadius; // if ball gets stuck
            ballXDirection *= -1;
            ballSpeed += 1;
        }
    }
};

function playerMove(event) {
    const keyPressed = event.keyCode;
    const paddle1Up = 87;
    const paddle1Down = 83;
    const paddle2Up = 38;
    const paddle2Down = 40;
    
    switch(keyPressed){
        case(paddle1Up):
        if(paddle1.y > 0){
            paddle1.y -= paddleSpeed;
        }
        break;
        case(paddle1Down):
        if(paddle1.y < gameHeight - paddle1.height){
            paddle1.y += paddleSpeed;
        }
        break;
        case(paddle2Up):
        if(paddle2.y > 0){
            paddle2.y -= paddleSpeed;
        }
        break;
        case(paddle2Down):
        if(paddle2.y < gameHeight - paddle2.height){
            paddle2.y += paddleSpeed;
        }
        break;
    }
};

function updateScore(){
    scoreText.textContent = `${player1Score} : ${player2Score}`;
};

function play() {
    drawBoard();
    drawPaddles();
    moveBall();
    drawBall(ballX, ballY);
    ballDirection();
    checkCollision();

    anim = requestAnimationFrame(play);
}


function resetGame(){
    player1Score = 0;
    player2Score = 0;
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
    ballXDirection = 0;
    ballYDirection = 0;
    updateScore();
    // clearInterval(intervalID);
    drawBoard();
    drawPaddles();
    moveBall();
    drawBall(ballX, ballY);
    ballDirection();
    checkCollision();
};

function stop() {
    cancelAnimationFrame(anim);
    resetGame();
    drawBoard();
    drawPaddles();
    drawBall(ballX, ballY);
}


export function startGame() {
    gameBoard = document.getElementById('#gameBoard');
    const scoreText = document.querySelector("#scoreText");
    const resetBtn = document.querySelector("#resetBtn");

    resetGame();

    // Mouse move event
    // gameBoard.addEventListener('mousemove', playerMove);

    gameBoard.addEventListener('keydown', playerMove);
    // Mouse click event
    document.querySelector('#start-game').addEventListener('click', play);
    document.querySelector('#stop-game').addEventListener('click', stop);

};
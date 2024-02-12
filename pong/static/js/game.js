var canvas;
var game;
var anim;

const playerHeight = 100;
const playerWidth = 5;

const MAX_SPEED = 12;

function draw() {
    var cxt = canvas.getContext('2d');

    // Draw field
    cxt.fillStyle = 'black';
    cxt.fillRect(0, 0, canvas.width, canvas.height);

    // Draw middle line
    cxt.strokeStyle = 'white';
    cxt.beginPath();
    cxt.moveTo(canvas.width / 2, 0);
    cxt.lineTo(canvas.width / 2, canvas.height);
    cxt.stroke();

    // Draw players
    cxt.fillStyle = 'white';
    cxt.fillRect(0, game.player.y, playerWidth, playerHeight);
    cxt.fillRect(canvas.width - playerWidth, game.computer.y, playerWidth, playerHeight);

    // Draw ball
    cxt.beginPath();
    cxt.fillStyle = 'white';
    cxt.arc(game.ball.x, game.ball.y, game.ball.r, 0, Math.PI * 2, false);
    cxt.fill();
}

function changeDirection(playerPosition) {
    var impact = game.ball.y - playerPosition - playerHeight / 2;
    var ratio = 100 / (playerHeight / 2);

    // Get a value between 0 and 10
    game.ball.speed.y = Math.round(impact * ratio / 10);
}

function playerMove(event) {
    // Get the mouse location in the canvas
    var canvasLocation = canvas.getBoundingClientRect();
    var mouseLocation = event.clientY - canvasLocation.y;

    if (mouseLocation < playerHeight / 2) {
        game.player.y = 0;
    } else if (mouseLocation > canvas.height - playerHeight / 2) {
        game.player.y = canvas.height - playerHeight;
    } else {
        game.player.y = mouseLocation - playerHeight / 2;
    }
}

function computerMove() {
    game.computer.y += game.ball.speed.y * game.computer.speedRatio;
}

function collide(player) {
    // The player does not hit the ball
    if (game.ball.y < player.y || game.ball.y > player.y + playerHeight) {
        reset();

        // Update score
        if (player == game.player) {
            game.computer.score++;
            document.querySelector('#computer-score').textContent = game.computer.score;
        } else {
            game.player.score++;
            document.querySelector('#player-score').textContent = game.player.score;
        }
    } else {
        // Change direction
        game.ball.speed.x *= -1;
        changeDirection(player.y);

        // Increase speed if it has not reached max speed
        if (Math.abs(game.ball.speed.x) < MAX_SPEED) {
            game.ball.speed.x *= 1.2;
        }
    }
}

function ballMove() {
    // Rebounds on top and bottom
    if (game.ball.y > canvas.height || game.ball.y < 0) {
        game.ball.speed.y *= -1;
    }

    if (game.ball.x > canvas.width - playerWidth) {
        collide(game.computer);
    } else if (game.ball.x < playerWidth) {
        collide(game.player);
    }

    game.ball.x += game.ball.speed.x;
    game.ball.y += game.ball.speed.y;
}

function play() {
    draw();

    computerMove();
    ballMove();

    anim = requestAnimationFrame(play);
}

function reset() {
    // Set ball and players to the center
    game.ball.x = canvas.width / 2;
    game.ball.y = canvas.height / 2;
    game.player.y = canvas.height / 2 - playerHeight / 2;
    game.computer.y = canvas.height / 2 - playerHeight / 2;

    // Reset speed
    game.ball.speed.x = 3;
    game.ball.speed.y = Math.random() * 3;
}

function stop() {
    cancelAnimationFrame(anim);

    reset();

    // Init score
    game.computer.score = 0;
    game.player.score = 0;

    document.querySelector('#computer-score').textContent = game.computer.score;
    document.querySelector('#player-score').textContent = game.player.score;

    draw();
}

export function startGame() {
    canvas = document.getElementById('board');
    game = {
        player: {
            score: 0
        },
        computer: {
            score: 0,
            speedRatio: 0.75
        },
        ball: {
            r: 5,
            speed: {}
        }
    };

    reset();

    // Mouse move event
    canvas.addEventListener('mousemove', playerMove);

    // Mouse click event
    document.querySelector('#start-game').addEventListener('click', play);
    document.querySelector('#stop-game').addEventListener('click', stop);

};
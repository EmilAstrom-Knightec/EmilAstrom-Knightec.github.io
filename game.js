const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const birdImage = new Image();
birdImage.src = 'japan_bird.png'; // Add your Japan-themed bird image here

const pipeTopImage = new Image();
pipeTopImage.src = 'pipe_top.png'; // Customize pipe image

const pipeBottomImage = new Image();
pipeBottomImage.src = 'pipe_bottom.png'; // Customize pipe image

const gravity = 0.6;
const bird = {
    x: 50,
    y: canvas.height / 2,
    width: 40,
    height: 30,
    dy: 0,
    draw() {
        ctx.drawImage(birdImage, this.x, this.y, this.width, this.height);
    },
    update() {
        this.dy += gravity;
        this.y += this.dy;

        if (this.y + this.height > canvas.height || this.y < 0) {
            gameOver();
        }
    },
    flap() {
        this.dy = -10;
    }
};

const pipes = [];
const pipeWidth = 80;
const pipeGap = 200;

function addPipe() {
    const pipeHeight = Math.floor(Math.random() * (canvas.height / 2));
    pipes.push({
        x: canvas.width,
        topY: pipeHeight,
        bottomY: pipeHeight + pipeGap,
        width: pipeWidth
    });
}

function drawPipes() {
    pipes.forEach(pipe => {
        ctx.drawImage(pipeTopImage, pipe.x, pipe.topY - pipeTopImage.height, pipeWidth, pipeTopImage.height);
        ctx.drawImage(pipeBottomImage, pipe.x, pipe.bottomY, pipeWidth, pipeBottomImage.height);
    });
}

function updatePipes() {
    pipes.forEach(pipe => {
        pipe.x -= 3;

        // Collision detection
        if (
            bird.x + bird.width > pipe.x &&
            bird.x < pipe.x + pipe.width &&
            (bird.y < pipe.topY || bird.y + bird.height > pipe.bottomY)
        ) {
            gameOver();
        }

        if (pipe.x + pipe.width < 0) {
            pipes.shift();
        }
    });
}

function gameOver() {
    document.getElementById('game-over').style.display = 'block';
    canvas.removeEventListener('click', flap);
    clearInterval(gameInterval);
}

function resetGame() {
    document.getElementById('game-over').style.display = 'none';
    bird.y = canvas.height / 2;
    bird.dy = 0;
    pipes.length = 0;
    addPipe();
    gameInterval = setInterval(gameLoop, 20);
    canvas.addEventListener('click', flap);
}

let gameInterval = setInterval(gameLoop, 20);
addPipe();

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    bird.update();
    bird.draw();
    drawPipes();
    updatePipes();

    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 300) {
        addPipe();
    }
}

function flap() {
    bird.flap();
}

canvas.addEventListener('click', flap);
document.getElementById('game-over').addEventListener('click', resetGame);

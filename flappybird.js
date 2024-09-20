const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 400;
canvas.height = 600;

const bird = {
  x: 50,
  y: 150,
  width: 20,
  height: 20,
  gravity: 0.6,
  lift: -10,
  velocity: 0,
};

const pipes = [];
const pipeWidth = 50;
const pipeGap = 120;
let frameCount = 0;
let score = 0;
let gameOver = false;

document.addEventListener('keydown', () => {
  if (!gameOver) bird.velocity = bird.lift;
});

function drawBird() {
  ctx.fillStyle = 'yellow';
  ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() {
  pipes.forEach(pipe => {
    ctx.fillStyle = 'green';
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
    ctx.fillRect(pipe.x, canvas.height - pipe.bottom, pipeWidth, pipe.bottom);
  });
}

function updatePipes() {
  if (frameCount % 90 === 0) {
    const topHeight = Math.random() * (canvas.height / 2) + 50;
    const bottomHeight = canvas.height - topHeight - pipeGap;
    pipes.push({
      x: canvas.width,
      top: topHeight,
      bottom: bottomHeight,
    });
  }

  pipes.forEach((pipe, index) => {
    pipe.x -= 4;

    // Remove pipes that go off screen
    if (pipe.x + pipeWidth < 0) {
      pipes.splice(index, 1);
      score++;
    }

    // Check for collision
    if (
      bird.x < pipe.x + pipeWidth &&
      bird.x + bird.width > pipe.x &&
      (bird.y < pipe.top || bird.y + bird.height > canvas.height - pipe.bottom)
    ) {
      gameOver = true;
    }
  });
}

function drawScore() {
  ctx.fillStyle = 'black';
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, 10, 25);
}

function updateBird() {
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  if (bird.y + bird.height > canvas.height || bird.y < 0) {
    gameOver = true;
  }
}

function resetGame() {
  bird.y = 150;
  bird.velocity = 0;
  pipes.length = 0;
  score = 0;
  gameOver = false;
  frameCount = 0;
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!gameOver) {
    updateBird();
    updatePipes();
    drawBird();
    drawPipes();
    drawScore();
    frameCount++;
  } else {
    ctx.fillStyle = 'red';
    ctx.font = '30px Arial';
    ctx.fillText('Game Over', canvas.width / 2 - 80, canvas.height / 2);
    ctx.font = '20px Arial';
    ctx.fillText('Press Space to Restart', canvas.width / 2 - 100, canvas.height / 2 + 40);
    
    document.addEventListener('keydown', () => {
      if (gameOver) resetGame();
    });
  }

  requestAnimationFrame(gameLoop);
}

gameLoop();

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
  color: 'orange', // Representing a Koi fish for the player
  score: 0,
  alive: true,
};

const pipes = [];
const pipeWidth = 50;
const pipeGap = 120;
let frameCount = 0;
let gameOver = false;

// Event listener for player
document.addEventListener('keydown', (e) => {
  if (!gameOver && e.code === 'Space') {
    bird.velocity = bird.lift; // Player controls the bird with the space bar
  }
});

function drawBird() {
  if (bird.alive) {
    ctx.fillStyle = bird.color;
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
  }
}

function drawPipes() {
  pipes.forEach(pipe => {
    ctx.fillStyle = 'rgb(102, 51, 0)'; // Bamboo-like pipes (brown)
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
      bird.score++;
    }

    // Check for collision with player (bird)
    if (
      bird.alive &&
      bird.x < pipe.x + pipeWidth &&
      bird.x + bird.width > pipe.x &&
      (bird.y < pipe.top || bird.y + bird.height > canvas.height - pipe.bottom)
    ) {
      bird.alive = false;
      gameOver = true;
    }
  });
}

function drawScore() {
  ctx.fillStyle = 'black';
  ctx.font = '20px Noto Serif JP';
  ctx.fillText(`Score: ${bird.score}`, 10, 25);
}

function updateBird() {
  if (bird.alive) {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y + bird.height > canvas.height || bird.y < 0) {
      bird.alive = false;
      gameOver = true;
    }
  }
}

function resetGame() {
  bird.y = 150;
  bird.velocity = 0;
  bird.score = 0;
  bird.alive = true;
  pipes.length = 0;
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
    // Game over message
    ctx.fillStyle = 'red';
    ctx.font = '30px Noto Serif JP';
    ctx.fillText('ゲームオーバー', canvas.width / 2 - 80, canvas.height / 2); // "Game Over" in Japanese
    ctx.font = '20px Noto Serif JP';
    ctx.fillText('スペースキーでリスタート', canvas.width / 2 - 100, canvas.height / 2 + 40); // "Press Space to Restart"

    // Restart game on space key
    document.addEventListener('keydown', (e) => {
      if (gameOver && e.code === 'Space') resetGame();
    });
  }

  requestAnimationFrame(gameLoop);
}

gameLoop();

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 400;
canvas.height = 600;

const bird = {
  x: 50,
  y: 150,
  width: 20,
  height: 20,
  gravity: 1000,  // Gravity in pixels per second squared
  lift: -300,     // Lift in pixels per second
  velocity: 0,
  color: 'orange', // Representing a Koi fish for the player
  score: 0,
  alive: true,
};

const pipes = [];
const pipeWidth = 50;
const pipeGap = 120;
let gameOver = false;
let lastTime = 0;  // Last timestamp for calculating delta time

// Event listener for any input (key press, mouse click, or touch)
function handleInput() {
  if (!gameOver) {
    bird.velocity = bird.lift; // Apply lift when any input is detected
  }
}

// Add event listeners for any input
document.addEventListener('keydown', handleInput); // Any key press
document.addEventListener('mousedown', handleInput); // Mouse click
document.addEventListener('touchstart', handleInput); // Touch input

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

function updatePipes(deltaTime) {
  if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
    const topHeight = Math.random() * (canvas.height / 2) + 50;
    const bottomHeight = canvas.height - topHeight - pipeGap;
    pipes.push({
      x: canvas.width,
      top: topHeight,
      bottom: bottomHeight,
    });
  }

  pipes.forEach((pipe, index) => {
    pipe.x -= 200 * deltaTime;  // Pipes move at 200 pixels per second

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

function updateBird(deltaTime) {
  if (bird.alive) {
    bird.velocity += bird.gravity * deltaTime;  // Update velocity based on gravity
    bird.y += bird.velocity * deltaTime;  // Update position based on velocity

    // If bird hits the ground or flies off-screen
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
}

function gameLoop(timestamp) {
  let deltaTime = (timestamp - lastTime) / 1000;  // Convert time difference to seconds
  lastTime = timestamp;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!gameOver) {
    updateBird(deltaTime);
    updatePipes(deltaTime);
    drawBird();
    drawPipes();
    drawScore();
  } else {
    // Game over message
    ctx.fillStyle = 'red';
    ctx.font = '30px Noto Serif JP';
    ctx.fillText('ゲームオーバー', canvas.width / 2 - 80, canvas.height / 2); // "Game Over" in Japanese
    ctx.font = '20px Noto Serif JP';
    ctx.fillText('スペースキーでリスタート', canvas.width / 2 - 100, canvas.height / 2 + 40); // "Press Space to Restart"

    // Restart game on any input
    document.addEventListener('keydown', resetGame); // Key press to reset
    document.addEventListener('mousedown', resetGame); // Mouse click to reset
    document.addEventListener('touchstart', resetGame); // Touch input to reset
  }

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);  // Start the game loop

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size based on the screen's width and height
canvas.width = window.innerWidth * 0.9;
canvas.height = window.innerHeight * 0.8;

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
const pipeGap = 150;  // Increased the pipe gap size to make the game easier
let gameOver = false;
let highScore = 0;  // Track the high score
let lastTime = 0;  // Last timestamp for calculating delta time

// Function to handle bird lift for both touch and other inputs
function handleInput() {
  if (!gameOver) {
    bird.velocity = bird.lift; // Apply lift when any input is detected
  }
}

// Function to handle resetting the game
function resetGame() {
  // Only reset the game if it is in the "game over" state
  if (gameOver) {
    bird.y = 150;
    bird.velocity = 0;
    bird.score = 0;
    bird.alive = true;
    pipes.length = 0;
    gameOver = false;
  }
}

// Add event listeners for any input (lift the bird)
document.addEventListener('keydown', handleInput); // Any key press
document.addEventListener('mousedown', handleInput); // Mouse click
document.addEventListener('touchstart', handleInput); // Touch input

// Add event listeners for resetting the game after game over
document.addEventListener('keydown', (e) => {
  if (gameOver) resetGame();  // Key press to reset only when game is over
});
document.addEventListener('mousedown', (e) => {
  if (gameOver) resetGame();  // Mouse click to reset only when game is over
});
document.addEventListener('touchstart', (e) => {
  if (gameOver) resetGame();  // Touch input to reset only when game is over
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
    // Update high score if current score is higher
    if (bird.score > highScore) {
      highScore = bird.score;
    }

    // Game over message and score display
    ctx.fillStyle = 'red';
    ctx.font = '30px Noto Serif JP';
    ctx.fillText('ゲームオーバー', canvas.width / 2 - 80, canvas.height / 2);  // "Game Over"
    ctx.font = '20px Noto Serif JP';
    ctx.fillText('タッチでリスタート', canvas.width / 2 - 100, canvas.height / 2 + 40);  // "Touch to Restart"
    ctx.fillText(`ハイスコア: ${highScore}`, canvas.width / 2 - 100, canvas.height / 2 + 80);  // High Score in Japanese
  }

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);  // Start the game loop

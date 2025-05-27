/**
 * Retro Snake Game
 * A classic snake game with cyberpunk/pixel art aesthetics
 */

export class SnakeGame {
  constructor() {
    this.canvas = document.getElementById("snake-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.gameOverlay = document.getElementById("game-overlay");

    // Game settings
    this.gridSize = 20;
    this.cellSize = 20;
    this.canvasSize = this.gridSize * this.cellSize;

    // Set canvas size
    this.canvas.width = this.canvasSize;
    this.canvas.height = this.canvasSize;

    // Game state
    this.snake = [];
    this.direction = { x: 1, y: 0 };
    this.nextDirection = { x: 1, y: 0 };
    this.food = {};
    this.score = 0;
    this.highScore = parseInt(localStorage.getItem("snakeHighScore") || "0");
    this.level = 1;
    this.gameSpeed = 150;
    this.isRunning = false;
    this.isPaused = false;
    this.gameLoop = null;

    // Sound effects (8-bit style)
    this.sounds = {
      eat: new Audio(
        "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQAAAACAxP//"
      ),
      gameOver: new Audio(
        "data:audio/wav;base64,UklGRjIAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQ4AAAD//wAAUlr//wAA//9aUg=="
      ),
      levelUp: new Audio(
        "data:audio/wav;base64,UklGRjwAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YRgAAAAA/3//f/8AAP//AAD/f/9//wAA//8AAA=="
      ),
    };

    // Colors
    this.colors = {
      snake: "#00ff00",
      snakeStroke: "#008800",
      food: "#ff0080",
      foodGlow: "#ff00ff",
      grid: "#0a0a0a",
      background: "#000000",
    };

    this.init();
  }

  init() {
    // Initialize snake position
    this.resetGame();

    // Set up controls
    this.setupControls();

    // Update high score display
    document.getElementById("snake-high-score").textContent = this.highScore;

    // Draw initial state
    this.draw();
  }

  setupControls() {
    // Keyboard controls
    document.addEventListener("keydown", (e) => {
      if (!this.isRunning && e.code === "Space") {
        this.startGame();
        return;
      }

      if (!this.isRunning || this.isPaused) return;

      const keyMap = {
        ArrowUp: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 },
        KeyW: { x: 0, y: -1 },
        KeyS: { x: 0, y: 1 },
        KeyA: { x: -1, y: 0 },
        KeyD: { x: 1, y: 0 },
      };

      if (keyMap[e.code]) {
        const newDir = keyMap[e.code];
        // Prevent snake from going back into itself
        if (newDir.x !== -this.direction.x || newDir.y !== -this.direction.y) {
          this.nextDirection = newDir;
        }
      }
    });

    // Button controls
    document
      .getElementById("snake-start")
      .addEventListener("click", () => this.startGame());
    document
      .getElementById("snake-pause")
      .addEventListener("click", () => this.togglePause());
    document
      .getElementById("snake-reset")
      .addEventListener("click", () => this.resetGame());
  }

  resetGame() {
    // Clear game loop
    if (this.gameLoop) {
      clearInterval(this.gameLoop);
      this.gameLoop = null;
    }

    // Reset snake
    this.snake = [
      { x: Math.floor(this.gridSize / 2), y: Math.floor(this.gridSize / 2) },
    ];

    // Reset direction
    this.direction = { x: 1, y: 0 };
    this.nextDirection = { x: 1, y: 0 };

    // Reset score and level
    this.score = 0;
    this.level = 1;
    this.gameSpeed = 150;

    // Reset game state
    this.isRunning = false;
    this.isPaused = false;

    // Generate first food
    this.generateFood();

    // Update displays
    this.updateScoreDisplay();

    // Hide game over overlay
    this.gameOverlay.style.display = "none";

    // Redraw
    this.draw();
  }

  startGame() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.isPaused = false;
    this.gameOverlay.style.display = "none";

    // Start game loop
    this.gameLoop = setInterval(() => this.update(), this.gameSpeed);
  }

  togglePause() {
    if (!this.isRunning) return;

    this.isPaused = !this.isPaused;

    if (this.isPaused) {
      clearInterval(this.gameLoop);
      this.gameLoop = null;
    } else {
      this.gameLoop = setInterval(() => this.update(), this.gameSpeed);
    }
  }

  update() {
    if (this.isPaused) return;

    // Update direction
    this.direction = { ...this.nextDirection };

    // Calculate new head position
    const head = { ...this.snake[0] };
    head.x += this.direction.x;
    head.y += this.direction.y;

    // Check wall collision
    if (
      head.x < 0 ||
      head.x >= this.gridSize ||
      head.y < 0 ||
      head.y >= this.gridSize
    ) {
      this.gameOver();
      return;
    }

    // Check self collision
    if (
      this.snake.some((segment) => segment.x === head.x && segment.y === head.y)
    ) {
      this.gameOver();
      return;
    }

    // Add new head
    this.snake.unshift(head);

    // Check food collision
    if (head.x === this.food.x && head.y === this.food.y) {
      this.eatFood();
    } else {
      // Remove tail if no food eaten
      this.snake.pop();
    }

    // Redraw
    this.draw();
  }

  eatFood() {
    // Play sound
    if (this.sounds.eat) {
      this.sounds.eat.currentTime = 0;
      this.sounds.eat.play().catch(() => {});
    }

    // Increase score
    this.score += 10 * this.level;

    // Check for level up
    if (this.score > 0 && this.score % 50 === 0) {
      this.levelUp();
    }

    // Generate new food
    this.generateFood();

    // Update display
    this.updateScoreDisplay();
  }

  levelUp() {
    this.level++;
    this.gameSpeed = Math.max(50, this.gameSpeed - 10);

    // Play sound
    if (this.sounds.levelUp) {
      this.sounds.levelUp.currentTime = 0;
      this.sounds.levelUp.play().catch(() => {});
    }

    // Restart game loop with new speed
    clearInterval(this.gameLoop);
    this.gameLoop = setInterval(() => this.update(), this.gameSpeed);

    // Update display
    document.getElementById("snake-level").textContent = this.level;
  }

  generateFood() {
    do {
      this.food = {
        x: Math.floor(Math.random() * this.gridSize),
        y: Math.floor(Math.random() * this.gridSize),
      };
    } while (
      this.snake.some(
        (segment) => segment.x === this.food.x && segment.y === this.food.y
      )
    );
  }

  gameOver() {
    this.isRunning = false;
    clearInterval(this.gameLoop);
    this.gameLoop = null;

    // Play sound
    if (this.sounds.gameOver) {
      this.sounds.gameOver.currentTime = 0;
      this.sounds.gameOver.play().catch(() => {});
    }

    // Update high score
    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem("snakeHighScore", this.highScore.toString());
      document.getElementById("snake-high-score").textContent = this.highScore;
    }

    // Show game over overlay
    this.gameOverlay.style.display = "flex";
  }

  updateScoreDisplay() {
    document.getElementById("snake-score").textContent = this.score;
    document.getElementById("snake-level").textContent = this.level;
  }

  draw() {
    // Clear canvas
    this.ctx.fillStyle = this.colors.background;
    this.ctx.fillRect(0, 0, this.canvasSize, this.canvasSize);

    // Draw grid
    this.drawGrid();

    // Draw food
    this.drawFood();

    // Draw snake
    this.drawSnake();
  }

  drawGrid() {
    this.ctx.strokeStyle = this.colors.grid;
    this.ctx.lineWidth = 1;

    for (let i = 0; i <= this.gridSize; i++) {
      const pos = i * this.cellSize;

      // Vertical lines
      this.ctx.beginPath();
      this.ctx.moveTo(pos, 0);
      this.ctx.lineTo(pos, this.canvasSize);
      this.ctx.stroke();

      // Horizontal lines
      this.ctx.beginPath();
      this.ctx.moveTo(0, pos);
      this.ctx.lineTo(this.canvasSize, pos);
      this.ctx.stroke();
    }
  }

  drawSnake() {
    this.snake.forEach((segment, index) => {
      const x = segment.x * this.cellSize;
      const y = segment.y * this.cellSize;

      // Draw segment
      this.ctx.fillStyle = this.colors.snake;
      this.ctx.fillRect(x + 2, y + 2, this.cellSize - 4, this.cellSize - 4);

      // Draw border
      this.ctx.strokeStyle = this.colors.snakeStroke;
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(x + 2, y + 2, this.cellSize - 4, this.cellSize - 4);

      // Draw eyes on head
      if (index === 0) {
        this.ctx.fillStyle = "#ffffff";
        const eyeSize = 3;
        const eyeOffset = 5;

        if (this.direction.x === 1) {
          // Right
          this.ctx.fillRect(
            x + this.cellSize - eyeOffset - eyeSize,
            y + eyeOffset,
            eyeSize,
            eyeSize
          );
          this.ctx.fillRect(
            x + this.cellSize - eyeOffset - eyeSize,
            y + this.cellSize - eyeOffset - eyeSize,
            eyeSize,
            eyeSize
          );
        } else if (this.direction.x === -1) {
          // Left
          this.ctx.fillRect(x + eyeOffset, y + eyeOffset, eyeSize, eyeSize);
          this.ctx.fillRect(
            x + eyeOffset,
            y + this.cellSize - eyeOffset - eyeSize,
            eyeSize,
            eyeSize
          );
        } else if (this.direction.y === -1) {
          // Up
          this.ctx.fillRect(x + eyeOffset, y + eyeOffset, eyeSize, eyeSize);
          this.ctx.fillRect(
            x + this.cellSize - eyeOffset - eyeSize,
            y + eyeOffset,
            eyeSize,
            eyeSize
          );
        } else {
          // Down
          this.ctx.fillRect(
            x + eyeOffset,
            y + this.cellSize - eyeOffset - eyeSize,
            eyeSize,
            eyeSize
          );
          this.ctx.fillRect(
            x + this.cellSize - eyeOffset - eyeSize,
            y + this.cellSize - eyeOffset - eyeSize,
            eyeSize,
            eyeSize
          );
        }
      }
    });
  }

  drawFood() {
    const x = this.food.x * this.cellSize;
    const y = this.food.y * this.cellSize;
    const centerX = x + this.cellSize / 2;
    const centerY = y + this.cellSize / 2;

    // Draw glow effect
    const gradient = this.ctx.createRadialGradient(
      centerX,
      centerY,
      0,
      centerX,
      centerY,
      this.cellSize / 2
    );
    gradient.addColorStop(0, this.colors.foodGlow);
    gradient.addColorStop(1, "transparent");

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(x, y, this.cellSize, this.cellSize);

    // Draw food
    this.ctx.fillStyle = this.colors.food;
    this.ctx.fillRect(x + 4, y + 4, this.cellSize - 8, this.cellSize - 8);

    // Add pixel pattern
    this.ctx.fillStyle = "#ffffff";
    this.ctx.fillRect(x + 6, y + 6, 2, 2);
    this.ctx.fillRect(x + this.cellSize - 8, y + this.cellSize - 8, 2, 2);
  }
}

// Initialize game when module is loaded
let snakeGame;

document.addEventListener("DOMContentLoaded", () => {
  snakeGame = new SnakeGame();
});

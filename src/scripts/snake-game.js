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
    this.gameSpeed = 150; // Milliseconds per update
    this.isRunning = false;
    this.isPaused = false;
    this.isGameOver = false;

    // Game loop timing
    this.gameLoopId = null;
    this.lastUpdateTime = 0;

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
    this.resetGame();
    this.setupControls();
    document.getElementById("snake-high-score").textContent = this.highScore;
    this.draw();
  }

  setupControls() {
    document.addEventListener("keydown", (e) => {
      if (!this.isRunning || this.isPaused || this.isGameOver) return;

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
        if (this.snake.length > 1 && (newDir.x === -this.direction.x && newDir.y === -this.direction.y)) {
          // Prevent snake from going back into itself, only if it has more than one segment
        } else {
          this.nextDirection = newDir;
        }
      }
    });

    document.getElementById("snake-start").addEventListener("click", () => this.startGame());
    document.getElementById("snake-pause").addEventListener("click", () => this.togglePause());
    document.getElementById("snake-reset").addEventListener("click", () => this.resetGame());
  }

  resetGame() {
    if (this.gameLoopId) {
      cancelAnimationFrame(this.gameLoopId);
      this.gameLoopId = null;
    }

    this.snake = [
      { x: Math.floor(this.gridSize / 2), y: Math.floor(this.gridSize / 2) },
    ];
    this.direction = { x: 1, y: 0 };
    this.nextDirection = { x: 1, y: 0 };
    this.score = 0;
    this.level = 1;
    this.gameSpeed = 150;
    this.isRunning = false;
    this.isPaused = false;

    this.generateFood();
    this.updateScoreDisplay();
    this.gameOverlay.style.display = "none";
    this.draw();
  }

  startGame() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.isPaused = false;
    this.gameOverlay.style.display = "none";
    this.lastUpdateTime = 0;

    this.gameLoopId = requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
  }

  gameLoop(timestamp) {
    if (!this.isRunning) return;

    this.gameLoopId = requestAnimationFrame((newTimestamp) => this.gameLoop(newTimestamp));

    if (!this.isPaused) {
      if (!this.lastUpdateTime || timestamp - this.lastUpdateTime >= this.gameSpeed) {
        this.lastUpdateTime = timestamp;
        this.update();
      }
    }
    this.draw();
  }

  togglePause() {
    if (!this.isRunning) return;
    this.isPaused = !this.isPaused;
    if (this.isPaused) {
        this.gameOverlay.textContent = "Paused";
        this.gameOverlay.style.display = "flex";
    } else {
        this.gameOverlay.style.display = "none";
    }
  }

  update() {
    if (this.isPaused) return;

    this.direction = { ...this.nextDirection };

    const head = { ...this.snake[0] };
    head.x += this.direction.x;
    head.y += this.direction.y;

    if (
      head.x < 0 ||
      head.x >= this.gridSize ||
      head.y < 0 ||
      head.y >= this.gridSize
    ) {
      this.gameOver();
      return;
    }

    // Check for food first, this determines if the tail moves.
    const ateFood = head.x === this.food.x && head.y === this.food.y;

    // If we didn't eat, the tail moves, so pop it from the end.
    if (!ateFood) {
      this.snake.pop();
    }

    // Now, check for self-collision against the updated body.
    for (const segment of this.snake) {
      if (head.x === segment.x && head.y === segment.y) {
        this.gameOver();
        return;
      }
    }

    // Add the new head and handle food-eating logic.
    this.snake.unshift(head);
    if (ateFood) {
      this.eatFood();
    }
  }

  eatFood() {
    if (this.sounds.eat) {
      this.sounds.eat.currentTime = 0;
      this.sounds.eat.play().catch(() => {});
    }

    this.score += 10 * this.level;

    if (this.score > 0 && this.score % 50 === 0) {
      this.levelUp();
    }

    this.generateFood();
    this.updateScoreDisplay();
  }

  levelUp() {
    this.level++;
    this.gameSpeed = Math.max(50, this.gameSpeed - 15);

    if (this.sounds.levelUp) {
      this.sounds.levelUp.currentTime = 0;
      this.sounds.levelUp.play().catch(() => {});
    }
    
    this.updateScoreDisplay();
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
    if (this.isGameOver) return;
    this.isGameOver = true;
    this.isRunning = false;
    if (this.gameLoopId) {
        cancelAnimationFrame(this.gameLoopId);
        this.gameLoopId = null;
    }

    if (this.sounds.gameOver) {
      this.sounds.gameOver.currentTime = 0;
      this.sounds.gameOver.play().catch(() => {});
    }

    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem("snakeHighScore", this.highScore.toString());
      document.getElementById("snake-high-score").textContent = this.highScore;
    }

    this.gameOverlay.textContent = "Game Over";
    this.gameOverlay.style.display = "flex";
  }

  updateScoreDisplay() {
    document.getElementById("snake-score").textContent = this.score;
    document.getElementById("snake-level").textContent = this.level;
  }

  draw() {
    this.ctx.fillStyle = this.colors.background;
    this.ctx.fillStyle = this.colors.background;
    this.ctx.fillRect(0, 0, this.canvasSize, this.canvasSize);

    // Draw border
    this.ctx.strokeStyle = '#00ff00'; // A bright color for the border
    this.ctx.lineWidth = 4;
    this.ctx.strokeRect(0, 0, this.canvasSize, this.canvasSize);

    this.drawGrid();
    this.drawFood();
    this.drawSnake();
  }

  drawGrid() {
    this.ctx.strokeStyle = this.colors.grid;
    this.ctx.lineWidth = 1;
    for (let i = 0; i <= this.gridSize; i++) {
      const pos = i * this.cellSize;
      this.ctx.beginPath();
      this.ctx.moveTo(pos, 0);
      this.ctx.lineTo(pos, this.canvasSize);
      this.ctx.stroke();
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
      this.ctx.fillStyle = this.colors.snake;
      this.ctx.fillRect(x + 2, y + 2, this.cellSize - 4, this.cellSize - 4);
      this.ctx.strokeStyle = this.colors.snakeStroke;
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(x + 2, y + 2, this.cellSize - 4, this.cellSize - 4);
      if (index === 0) {
        this.ctx.fillStyle = "#ffffff";
        const eyeSize = 3;
        const eyeOffset = 5;
        if (this.direction.x === 1) {
          this.ctx.fillRect(x + this.cellSize - eyeOffset - eyeSize, y + eyeOffset, eyeSize, eyeSize);
          this.ctx.fillRect(x + this.cellSize - eyeOffset - eyeSize, y + this.cellSize - eyeOffset - eyeSize, eyeSize, eyeSize);
        } else if (this.direction.x === -1) {
          this.ctx.fillRect(x + eyeOffset, y + eyeOffset, eyeSize, eyeSize);
          this.ctx.fillRect(x + eyeOffset, y + this.cellSize - eyeOffset - eyeSize, eyeSize, eyeSize);
        } else if (this.direction.y === -1) {
          this.ctx.fillRect(x + eyeOffset, y + eyeOffset, eyeSize, eyeSize);
          this.ctx.fillRect(x + this.cellSize - eyeOffset - eyeSize, y + eyeOffset, eyeSize, eyeSize);
        } else {
          this.ctx.fillRect(x + eyeOffset, y + this.cellSize - eyeOffset - eyeSize, eyeSize, eyeSize);
          this.ctx.fillRect(x + this.cellSize - eyeOffset - eyeSize, y + this.cellSize - eyeOffset - eyeSize, eyeSize, eyeSize);
        }
      }
    });
  }

  drawFood() {
    const x = this.food.x * this.cellSize;
    const y = this.food.y * this.cellSize;
    const centerX = x + this.cellSize / 2;
    const centerY = y + this.cellSize / 2;
    const gradient = this.ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, this.cellSize / 2);
    gradient.addColorStop(0, this.colors.foodGlow);
    gradient.addColorStop(1, "transparent");
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(x, y, this.cellSize, this.cellSize);
    this.ctx.fillStyle = this.colors.food;
    this.ctx.fillRect(x + 4, y + 4, this.cellSize - 8, this.cellSize - 8);
    this.ctx.fillStyle = "#ffffff";
    this.ctx.fillRect(x + 6, y + 6, 2, 2);
    this.ctx.fillRect(x + this.cellSize - 8, y + this.cellSize - 8, 2, 2);
  }
}

let snakeGame;
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("snake-canvas")) {
    snakeGame = new SnakeGame();
  }
});

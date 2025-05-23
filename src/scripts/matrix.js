/**
 * Matrix 数字雨效果类
 * 负责创建和管理赛博朋克风格的数字雨动画
 */
class MatrixRain {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.isRunning = false;
    this.animationId = null;
    this.streams = [];
    this.lastTime = 0;
    this.fps = 60;
    this.frameCount = 0;
    this.lastFpsTime = 0;

    // 配置参数
    this.config = {
      speed: 5,
      density: 10,
      fontSize: 14,
      colors: {
        bright: "#00ff41",
        normal: "#00aa00",
        dim: "#005500",
      },
    };

    // 英文字符集
    this.characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?`~!§±∞÷≠≤≥∑∏∫∆√∝∀∃∂∇∪∩⊂⊃⊆⊇∧∨¬⊥∥∠∴∵∝∞";

    this.init();
  }

  /**
   * 初始化Matrix效果
   */
  init() {
    this.canvas = document.getElementById("matrix-canvas");
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext("2d");
    this.resize();

    this.setupEventListeners();
    this.initStreams();
  }

  /**
   * 设置事件监听器
   */
  setupEventListeners() {
    window.addEventListener("resize", () => this.resize());

    this.canvas.addEventListener("mousemove", (e) => this.handleMouseMove(e));
    this.canvas.addEventListener("click", (e) => this.handleClick(e));

    document.addEventListener("keydown", (e) => {
      if (e.code === "Space" && document.activeElement === document.body) {
        e.preventDefault();
        this.toggle();
      }
    });

    this.setupControls();
  }

  /**
   * 设置控制面板
   */
  setupControls() {
    const toggleBtn = document.getElementById("matrix-toggle");
    const resetBtn = document.getElementById("matrix-reset");
    const speedControl = document.getElementById("speed-control");
    const densityControl = document.getElementById("density-control");

    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => this.toggle());
    }

    if (resetBtn) {
      resetBtn.addEventListener("click", () => this.reset());
    }

    if (speedControl) {
      speedControl.addEventListener("input", (e) => {
        this.config.speed = parseInt(e.target.value);
      });
    }

    if (densityControl) {
      densityControl.addEventListener("input", (e) => {
        this.config.density = parseInt(e.target.value);
        this.initStreams();
      });
    }
  }

  /**
   * 调整画布大小
   */
  resize() {
    if (!this.canvas) return;

    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;

    this.initStreams();
  }

  /**
   * 初始化数字流
   */
  initStreams() {
    if (!this.canvas) return;

    this.streams = [];
    const columns = Math.floor(this.canvas.width / this.config.fontSize);

    for (let i = 0; i < columns; i++) {
      if (Math.random() < this.config.density / 20) {
        this.streams.push(
          new MatrixStream(
            i * this.config.fontSize,
            this.canvas.height,
            this.config.fontSize,
            this.characters
          )
        );
      }
    }

    this.updateStats();
  }

  /**
   * 处理鼠标移动
   */
  handleMouseMove(e) {
    if (!this.isRunning) return;

    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (Math.random() < 0.3) {
      const stream = new MatrixStream(
        x - this.config.fontSize / 2,
        y,
        this.config.fontSize,
        this.characters
      );
      stream.speed = this.config.speed * 2;
      this.streams.push(stream);
    }
  }

  /**
   * 处理鼠标点击
   */
  handleClick(e) {
    if (!this.isRunning) return;

    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    this.createExplosion(x, y);
  }

  /**
   * 创建爆炸效果
   */
  createExplosion(x, y) {
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const stream = new MatrixStream(
        x + Math.cos(angle) * 20,
        y + Math.sin(angle) * 20,
        this.config.fontSize,
        this.characters
      );
      stream.speed = this.config.speed * 3;
      stream.life = 30;
      this.streams.push(stream);
    }
  }

  /**
   * 开始动画
   */
  start() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.lastTime = performance.now();
    this.lastFpsTime = this.lastTime;
    this.frameCount = 0;

    this.updateUIState(true);
    this.animate();
  }

  /**
   * 停止动画
   */
  stop() {
    if (!this.isRunning) return;

    this.isRunning = false;

    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    this.updateUIState(false);
  }

  /**
   * 更新UI状态
   */
  updateUIState(isRunning) {
    const toggleBtn = document.getElementById("matrix-toggle");
    const container = document.querySelector(".matrix-container");

    if (toggleBtn) {
      toggleBtn.innerHTML = isRunning
        ? '<i class="fas fa-pause"></i> Pause Matrix'
        : '<i class="fas fa-play"></i> Start Matrix';
    }

    if (container) {
      container.classList.toggle("active", isRunning);
    }
  }

  /**
   * 切换动画状态
   */
  toggle() {
    if (this.isRunning) {
      this.stop();
    } else {
      this.start();
    }
  }

  /**
   * 重置动画
   */
  reset() {
    this.stop();
    this.clear();
    this.initStreams();
  }

  /**
   * 清空画布
   */
  clear() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * 动画循环
   */
  animate(currentTime = performance.now()) {
    if (!this.isRunning) return;

    const deltaTime = currentTime - this.lastTime;

    if (deltaTime >= 1000 / this.fps) {
      this.update();
      this.render();

      this.lastTime = currentTime;
      this.frameCount++;

      if (currentTime - this.lastFpsTime >= 1000) {
        this.updateFPS();
        this.lastFpsTime = currentTime;
        this.frameCount = 0;
      }
    }

    this.animationId = requestAnimationFrame((time) => this.animate(time));
  }

  /**
   * 更新逻辑
   */
  update() {
    this.streams = this.streams.filter((stream) => {
      stream.update(this.config.speed);
      return (
        stream.y < this.canvas.height + 100 &&
        (stream.life === undefined || stream.life > 0)
      );
    });

    if (Math.random() < 0.1 && this.streams.length < this.config.density * 10) {
      const x = Math.random() * this.canvas.width;
      this.streams.push(
        new MatrixStream(x, -50, this.config.fontSize, this.characters)
      );
    }

    this.updateStats();
  }

  /**
   * 渲染
   */
  render() {
    if (!this.ctx) return;

    this.ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.streams.forEach((stream) =>
      stream.render(this.ctx, this.config.colors)
    );
  }

  /**
   * 更新统计信息
   */
  updateStats() {
    const streamCount = document.getElementById("stream-count");
    if (streamCount) {
      streamCount.textContent = this.streams.length;
    }
  }

  /**
   * 更新FPS显示
   */
  updateFPS() {
    const fpsCounter = document.getElementById("fps-counter");
    if (fpsCounter) {
      fpsCounter.textContent = this.frameCount;
    }
  }
}

/**
 * Matrix数字流类
 */
class MatrixStream {
  constructor(x, y, fontSize, characters) {
    this.x = x;
    this.y = y;
    this.fontSize = fontSize;
    this.characters = characters;
    this.chars = [];
    this.speed = 1;
    this.length = Math.floor(Math.random() * 20) + 10;

    this.initChars();
  }

  /**
   * 初始化字符
   */
  initChars() {
    for (let i = 0; i < this.length; i++) {
      this.chars.push({
        char: this.getRandomChar(),
        opacity: 1 - i / this.length,
        changeTime: Math.random() * 100,
      });
    }
  }

  /**
   * 获取随机字符
   */
  getRandomChar() {
    return this.characters[Math.floor(Math.random() * this.characters.length)];
  }

  /**
   * 更新字符流
   */
  update(globalSpeed) {
    this.y += this.speed * globalSpeed * 0.5;

    this.chars.forEach((char) => {
      char.changeTime--;
      if (char.changeTime <= 0) {
        char.char = this.getRandomChar();
        char.changeTime = Math.random() * 100 + 20;
      }
    });

    if (this.life !== undefined) {
      this.life--;
    }
  }

  /**
   * 渲染字符流
   */
  render(ctx, colors) {
    ctx.font = `${this.fontSize}px 'Share Tech Mono', monospace`;

    this.chars.forEach((char, index) => {
      const charY = this.y - index * this.fontSize;

      if (charY > -this.fontSize && charY < ctx.canvas.height + this.fontSize) {
        let color;
        if (index === 0) {
          color = colors.bright;
        } else if (index < 3) {
          color = colors.normal;
        } else {
          color = colors.dim;
        }

        ctx.fillStyle = color;
        ctx.globalAlpha = char.opacity;

        if (index === 0) {
          ctx.shadowColor = colors.bright;
          ctx.shadowBlur = 10;
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.fillText(char.char, this.x, charY);
      }
    });

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  }
}

// 导出类以供使用
export { MatrixRain, MatrixStream };

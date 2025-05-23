// 等待DOM加载完成
document.addEventListener("DOMContentLoaded", function () {
  // 汉堡菜单切换
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");

  if (hamburger) {
    hamburger.addEventListener("click", function () {
      navLinks.classList.toggle("active");

      // 汉堡菜单动画
      const lines = document.querySelectorAll(".hamburger .line");
      lines[0].classList.toggle("rotate-down");
      lines[1].classList.toggle("hide");
      lines[2].classList.toggle("rotate-up");
    });
  }

  // 平滑滚动
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      if (navLinks.classList.contains("active")) {
        navLinks.classList.remove("active");
      }

      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
        });
      }
    });
  });

  // 打字机效果
  const typedTextElement = document.getElementById("typed-text");
  if (typedTextElement) {
    const texts = [
      "CODE | DESIGN | INNOVATE",
      "LIFELONG TECH LEARNER",
      "KEEP GOING.",
    ];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
      const currentText = texts[textIndex];

      if (isDeleting) {
        typedTextElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
      } else {
        typedTextElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
      }

      if (!isDeleting && charIndex === currentText.length) {
        isDeleting = true;
        typingSpeed = 1000; // 停顿时间
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        typingSpeed = 500; // 切换文本间隔
      }

      setTimeout(type, typingSpeed);
    }

    setTimeout(type, 1000);
  }

  // 滚动动画
  const scannerLine = document.querySelector(".scanner-line");
  if (scannerLine) {
    window.addEventListener("scroll", function () {
      let scrolled = window.scrollY;
      scannerLine.style.opacity = 1 - scrolled / 500;
    });
  }

  // 视差效果
  window.addEventListener("mousemove", function (e) {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;

    const heroContent = document.querySelector(".hero-content");
    if (heroContent) {
      heroContent.style.transform = `translate(${mouseX * 20 - 10}px, ${
        mouseY * 20 - 10
      }px)`;
    }
  });

  // 表单提交处理
  const contactForm = document.querySelector(".contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // 表单数据
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const message = document.getElementById("message").value;

      // 这里可以添加表单验证和发送逻辑
      console.log("表单提交:", { name, email, message });

      // 成功提交效果
      const submitButton = document.querySelector(".submit-button");
      submitButton.innerHTML =
        '<span class="button-text">已发送!</span><span class="button-icon"><i class="fas fa-check"></i></span>';
      submitButton.style.borderColor = "var(--neon-green)";
      submitButton.style.color = "var(--neon-green)";

      // 重置表单
      setTimeout(() => {
        contactForm.reset();
        submitButton.innerHTML =
          '<span class="button-text">发送</span><span class="button-icon"><i class="fas fa-paper-plane"></i></span>';
        submitButton.style.borderColor = "var(--neon-blue)";
        submitButton.style.color = "var(--neon-blue)";
      }, 3000);
    });
  }

  // 故障动画
  const glitchElements = document.querySelectorAll(".glitch");
  glitchElements.forEach((element) => {
    // 确保data-text属性存在
    if (!element.getAttribute("data-text")) {
      element.setAttribute("data-text", element.textContent);
    }

    // 随机故障效果
    setInterval(() => {
      const shouldGlitch = Math.random() > 0.9;
      if (shouldGlitch) {
        element.classList.add("active-glitch");
        setTimeout(() => {
          element.classList.remove("active-glitch");
        }, 200);
      }
    }, 2000);
  });

  // 添加霓虹灯光晕效果
  const neonElements = document.querySelectorAll(".neon-text, .cyber-heading");
  neonElements.forEach((element) => {
    setInterval(() => {
      const intensity = 0.7 + Math.random() * 0.3;
      element.style.textShadow = `0 0 5px rgba(255, 42, 109, ${intensity}), 0 0 10px rgba(255, 42, 109, ${
        intensity * 0.8
      })`;
    }, 100);
  });

  // 终端效果
  const terminalTexts = document.querySelectorAll(".terminal-text");
  terminalTexts.forEach((text) => {
    const originalText = text.textContent;
    text.textContent = "";

    let i = 0;
    const typeTerminal = () => {
      if (i < originalText.length) {
        text.textContent += originalText.charAt(i);
        i++;
        setTimeout(typeTerminal, 50 + Math.random() * 50);
      }
    };

    setTimeout(typeTerminal, 1000 + Math.random() * 1000);
  });

  // 页面加载动画
  const body = document.querySelector("body");
  body.classList.add("loaded");

  // 添加辉光动画
  const addGlow = () => {
    const glow = document.createElement("div");
    glow.className = "glow";
    // Apply essential styles BEFORE appending to prevent layout shift
    glow.style.position = "absolute";
    glow.style.pointerEvents = "none";

    let generatedSize = Math.random() * 100 + 50; // Potential range: 50 to 150

    // Ensure the glow element fits within the viewport dimensions
    // Use 90% of viewport dimensions as max to leave some margin
    const maxWidth = window.innerWidth * 0.9;
    const maxHeight = window.innerHeight * 0.9;

    let effectiveSize = Math.min(generatedSize, maxWidth, maxHeight);
    // Ensure a minimum size (e.g., 20px), but not larger than generatedSize if it was already small
    effectiveSize = Math.max(effectiveSize, Math.min(generatedSize, 20));
    effectiveSize = Math.max(effectiveSize, 1); // Ensure size is at least 1px to avoid issues with 0 or negative

    // Calculate positions ensuring the element stays within bounds
    const x = Math.random() * (window.innerWidth - effectiveSize);
    // Subtract 1 from the available vertical space for y to create a small buffer
    const yMaxPosition = window.innerHeight - effectiveSize - 1;
    const y = Math.random() * Math.max(0, yMaxPosition); // Ensure y is not negative

    glow.style.width = `${effectiveSize}px`;
    glow.style.height = `${effectiveSize}px`;
    // position and pointerEvents already set earlier
    glow.style.left = `${x}px`;
    glow.style.top = `${y}px`;

    // Now append the fully styled element
    // document.body.appendChild(glow); // 暂时注释掉，以排查 glow 元素是否是导致问题的根源

    setTimeout(() => {
      glow.remove();
    }, 2000);
  };

  // setInterval(addGlow, 3000); // 暂时注释掉，以排查 glow 元素是否是导致问题的根源
});

// 添加滚动检测，实现元素渐入效果
window.addEventListener("scroll", function () {
  const elements = document.querySelectorAll(
    ".project-card, .profile-card, .terminal-container, .contact-form"
  );

  elements.forEach((element) => {
    const elementTop = element.getBoundingClientRect().top;
    const elementVisible = 150;

    if (elementTop < window.innerHeight - elementVisible) {
      element.classList.add("fade-in");
    }
  });
});

// 添加3D卡片悬停效果
const cards = document.querySelectorAll(".project-card");
cards.forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const cardRect = card.getBoundingClientRect();
    const cardCenterX = cardRect.left + cardRect.width / 2;
    const cardCenterY = cardRect.top + cardRect.height / 2;

    const mouseX = e.clientX - cardCenterX;
    const mouseY = e.clientY - cardCenterY;

    const rotateX = mouseY / -10;
    const rotateY = mouseX / 10;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) translateZ(0)`;
  });
});

// Matrix 数字雨效果
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

    // 字符集
    this.characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?`~!§±∞÷≠≤≥∑∏∫∆√∝∀∃∂∇∪∩⊂⊃⊆⊇∧∨¬⊥∥∠∴∵∝∞";

    this.init();
  }

  init() {
    this.canvas = document.getElementById("matrix-canvas");
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext("2d");
    this.resize();

    // 事件监听
    this.setupEventListeners();

    // 初始化流
    this.initStreams();
  }

  setupEventListeners() {
    // 窗口大小调整
    window.addEventListener("resize", () => this.resize());

    // 鼠标交互
    this.canvas.addEventListener("mousemove", (e) => this.handleMouseMove(e));
    this.canvas.addEventListener("click", (e) => this.handleClick(e));

    // 键盘交互
    document.addEventListener("keydown", (e) => {
      if (e.code === "Space" && document.activeElement === document.body) {
        e.preventDefault();
        this.toggle();
      }
    });

    // 控制面板
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

  resize() {
    if (!this.canvas) return;

    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;

    // 重新初始化流
    this.initStreams();
  }

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

  handleMouseMove(e) {
    if (!this.isRunning) return;

    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 在鼠标附近添加新的流
    if (Math.random() < 0.3) {
      const stream = new MatrixStream(
        x - this.config.fontSize / 2,
        y,
        this.config.fontSize,
        this.characters
      );
      stream.speed = this.config.speed * 2; // 鼠标附近的流更快
      this.streams.push(stream);
    }
  }

  handleClick(e) {
    if (!this.isRunning) return;

    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 爆炸效果
    this.createExplosion(x, y);
  }

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
      stream.life = 30; // 短寿命
      this.streams.push(stream);
    }
  }

  start() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.lastTime = performance.now();
    this.lastFpsTime = this.lastTime;
    this.frameCount = 0;

    // 更新按钮状态
    const toggleBtn = document.getElementById("matrix-toggle");
    if (toggleBtn) {
      toggleBtn.innerHTML = '<i class="fas fa-pause"></i> Pause Matrix';
    }

    // 激活容器动画
    const container = document.querySelector(".matrix-container");
    if (container) {
      container.classList.add("active");
    }

    this.animate();
  }

  stop() {
    if (!this.isRunning) return;

    this.isRunning = false;

    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    // 更新按钮状态
    const toggleBtn = document.getElementById("matrix-toggle");
    if (toggleBtn) {
      toggleBtn.innerHTML = '<i class="fas fa-play"></i> Start Matrix';
    }

    // 移除容器动画
    const container = document.querySelector(".matrix-container");
    if (container) {
      container.classList.remove("active");
    }
  }

  toggle() {
    if (this.isRunning) {
      this.stop();
    } else {
      this.start();
    }
  }

  reset() {
    this.stop();
    this.clear();
    this.initStreams();
  }

  clear() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  animate(currentTime = performance.now()) {
    if (!this.isRunning) return;

    const deltaTime = currentTime - this.lastTime;

    if (deltaTime >= 1000 / this.fps) {
      this.update();
      this.render();

      this.lastTime = currentTime;
      this.frameCount++;

      // 更新FPS
      if (currentTime - this.lastFpsTime >= 1000) {
        this.updateFPS();
        this.lastFpsTime = currentTime;
        this.frameCount = 0;
      }
    }

    this.animationId = requestAnimationFrame((time) => this.animate(time));
  }

  update() {
    // 更新所有流
    this.streams = this.streams.filter((stream) => {
      stream.update(this.config.speed);
      return (
        stream.y < this.canvas.height + 100 &&
        (stream.life === undefined || stream.life > 0)
      );
    });

    // 随机添加新流
    if (Math.random() < 0.1 && this.streams.length < this.config.density * 10) {
      const x = Math.random() * this.canvas.width;
      this.streams.push(
        new MatrixStream(x, -50, this.config.fontSize, this.characters)
      );
    }

    this.updateStats();
  }

  render() {
    if (!this.ctx) return;

    // 半透明背景实现拖尾效果
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // 渲染所有流
    this.streams.forEach((stream) =>
      stream.render(this.ctx, this.config.colors)
    );
  }

  updateStats() {
    const streamCount = document.getElementById("stream-count");
    if (streamCount) {
      streamCount.textContent = this.streams.length;
    }
  }

  updateFPS() {
    const fpsCounter = document.getElementById("fps-counter");
    if (fpsCounter) {
      fpsCounter.textContent = this.frameCount;
    }
  }
}

// Matrix流类
class MatrixStream {
  constructor(x, y, fontSize, characters) {
    this.x = x;
    this.y = y;
    this.fontSize = fontSize;
    this.characters = characters;
    this.chars = [];
    this.speed = 1;
    this.length = Math.floor(Math.random() * 20) + 10;

    // 初始化字符
    this.initChars();
  }

  initChars() {
    for (let i = 0; i < this.length; i++) {
      this.chars.push({
        char: this.getRandomChar(),
        opacity: 1 - i / this.length,
        changeTime: Math.random() * 100,
      });
    }
  }

  getRandomChar() {
    return this.characters[Math.floor(Math.random() * this.characters.length)];
  }

  update(globalSpeed) {
    this.y += this.speed * globalSpeed * 0.5;

    // 更新字符
    this.chars.forEach((char) => {
      char.changeTime--;
      if (char.changeTime <= 0) {
        char.char = this.getRandomChar();
        char.changeTime = Math.random() * 100 + 20;
      }
    });

    // 减少生命值（如果设置了）
    if (this.life !== undefined) {
      this.life--;
    }
  }

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

        // 添加发光效果给头部字符
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

// 初始化Matrix效果
document.addEventListener("DOMContentLoaded", function () {
  // 等待其他初始化完成后再启动Matrix
  setTimeout(() => {
    window.matrixRain = new MatrixRain();
  }, 500);
});

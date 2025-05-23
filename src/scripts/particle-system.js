class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.particles = [];
    this.mousePos = { x: 0, y: 0 };
    this.isActive = false;
    this.animationId = null;

    // 控制面板拖动相关
    this.isDragging = false;
    this.dragOffset = { x: 0, y: 0 };
    this.controlPanel = null;

    this.setupCanvas();
    this.bindEvents();
    this.setupDragControls();
  }

  setupCanvas() {
    this.resizeCanvas();
    window.addEventListener("resize", () => this.resizeCanvas());
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  setupDragControls() {
    this.controlPanel = document.getElementById("particle-controls");
    if (!this.controlPanel) return;

    const header = this.controlPanel.querySelector("h4");
    if (header) {
      header.style.cursor = "move";
      header.style.userSelect = "none";

      header.addEventListener("mousedown", (e) => this.startDrag(e));
      document.addEventListener("mousemove", (e) => this.drag(e));
      document.addEventListener("mouseup", () => this.endDrag());
    }

    // 添加隐藏/显示按钮
    this.addToggleButton();
  }

  addToggleButton() {
    const toggleBtn = document.createElement("button");
    toggleBtn.innerHTML = "−";
    toggleBtn.className = "panel-toggle-btn";
    toggleBtn.title = "Minimize panel";

    toggleBtn.addEventListener("click", () => this.togglePanel());
    this.controlPanel.appendChild(toggleBtn);
  }

  togglePanel() {
    const content = this.controlPanel.querySelector(
      ".particle-control-content"
    );
    const toggleBtn = this.controlPanel.querySelector(".panel-toggle-btn");

    if (this.controlPanel.classList.contains("minimized")) {
      // 展开面板
      this.controlPanel.classList.remove("minimized");
      if (content) content.style.display = "block";
      toggleBtn.innerHTML = "−";
      toggleBtn.title = "Minimize panel";
    } else {
      // 最小化面板
      this.controlPanel.classList.add("minimized");
      if (content) content.style.display = "none";
      toggleBtn.innerHTML = "+";
      toggleBtn.title = "Expand panel";
    }
  }

  startDrag(e) {
    this.isDragging = true;
    const rect = this.controlPanel.getBoundingClientRect();
    this.dragOffset.x = e.clientX - rect.left;
    this.dragOffset.y = e.clientY - rect.top;

    this.controlPanel.style.transition = "none";
    e.preventDefault();
  }

  drag(e) {
    if (!this.isDragging) return;

    const x = e.clientX - this.dragOffset.x;
    const y = e.clientY - this.dragOffset.y;

    // 限制拖动范围
    const maxX = window.innerWidth - this.controlPanel.offsetWidth;
    const maxY = window.innerHeight - this.controlPanel.offsetHeight;

    const constrainedX = Math.max(0, Math.min(x, maxX));
    const constrainedY = Math.max(0, Math.min(y, maxY));

    this.controlPanel.style.left = constrainedX + "px";
    this.controlPanel.style.top = constrainedY + "px";
    this.controlPanel.style.right = "auto";
  }

  endDrag() {
    if (!this.isDragging) return;

    this.isDragging = false;
    this.controlPanel.style.transition = "all 0.3s ease";
  }

  bindEvents() {
    document.addEventListener("mousemove", (e) => {
      this.mousePos.x = e.clientX;
      this.mousePos.y = e.clientY;

      if (this.isActive) {
        this.createParticle(e.clientX, e.clientY);
      }
    });

    document.addEventListener("click", (e) => {
      // 避免在拖动控制面板时创建爆炸
      if (!this.isDragging) {
        this.createExplosion(e.clientX, e.clientY);
      }
    });

    // 键盘控制
    document.addEventListener("keydown", (e) => {
      if (e.code === "KeyP") {
        this.toggle();
      }
    });
  }

  createParticle(x, y, options = {}) {
    const particle = {
      x: x + (Math.random() - 0.5) * 20,
      y: y + (Math.random() - 0.5) * 20,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      life: 1.0,
      decay: options.decay || 0.02,
      size: options.size || Math.random() * 3 + 1,
      color: options.color || this.getRandomColor(),
      type: options.type || "normal",
      ...options,
    };

    this.particles.push(particle);
  }

  createExplosion(x, y) {
    const particleCount = 15;
    const colors = ["#00ff00", "#ff0080", "#00ffff", "#ffff00", "#ff8000"];

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      const speed = Math.random() * 8 + 2;

      this.createParticle(x, y, {
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        decay: 0.03,
        size: Math.random() * 4 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        type: "explosion",
      });
    }
  }

  getRandomColor() {
    const colors = [
      "#00ff00", // green
      "#ff0080", // pink
      "#00ffff", // cyan
      "#ffff00", // yellow
      "#ff8000", // orange
      "#8000ff", // purple
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  updateParticles() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];

      // 更新位置
      particle.x += particle.vx;
      particle.y += particle.vy;

      // 重力效果
      if (particle.type === "explosion") {
        particle.vy += 0.1;
      }

      // 鼠标吸引效果（仅对普通粒子）
      if (particle.type === "normal") {
        const dx = this.mousePos.x - particle.x;
        const dy = this.mousePos.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          const force = ((100 - distance) / 100) * 0.5;
          particle.vx += (dx / distance) * force * 0.1;
          particle.vy += (dy / distance) * force * 0.1;
        }
      }

      // 衰减
      particle.life -= particle.decay;
      particle.size *= 0.99;

      // 移除死亡粒子
      if (particle.life <= 0 || particle.size < 0.1) {
        this.particles.splice(i, 1);
      }
    }
  }

  renderParticles() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (const particle of this.particles) {
      this.ctx.save();

      // 设置透明度
      this.ctx.globalAlpha = particle.life;

      // 绘制粒子
      this.ctx.fillStyle = particle.color;
      this.ctx.shadowBlur = 10;
      this.ctx.shadowColor = particle.color;

      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fill();

      // 添加内部光晕
      this.ctx.globalAlpha = particle.life * 0.3;
      this.ctx.fillStyle = "#ffffff";
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size * 0.5, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.restore();
    }
  }

  animate() {
    this.updateParticles();
    this.renderParticles();

    if (this.isActive) {
      this.animationId = requestAnimationFrame(() => this.animate());
    }
  }

  start() {
    if (!this.isActive) {
      this.isActive = true;
      this.animate();
    }
  }

  stop() {
    this.isActive = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  toggle() {
    if (this.isActive) {
      this.stop();
    } else {
      this.start();
    }
  }

  clear() {
    this.particles = [];
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

export default ParticleSystem;

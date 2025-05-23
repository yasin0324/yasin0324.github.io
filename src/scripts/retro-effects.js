/**
 * 复古像素风格交互效果
 * 包含音效、视觉反馈和CRT效果
 */

class RetroEffects {
  constructor() {
    this.audioContext = null;
    this.isAudioEnabled = false;
    this.isSoundOn = true;
    this.initAudio();
    this.initVisualEffects();
    this.initKeyboardEffects();
  }

  // 初始化音频上下文
  initAudio() {
    try {
      this.audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      this.isAudioEnabled = true;
    } catch (e) {
      console.log("Web Audio API not supported");
    }
  }

  // 生成复古音效
  playRetroSound(frequency = 440, duration = 100, type = "square") {
    if (!this.isAudioEnabled || !this.audioContext || !this.isSoundOn) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(
      frequency,
      this.audioContext.currentTime
    );
    oscillator.type = type;

    gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.audioContext.currentTime + duration / 1000
    );

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration / 1000);
  }

  // 按钮点击音效
  playButtonClick() {
    this.playRetroSound(800, 50, "square");
  }

  // 悬停音效
  playHoverSound() {
    this.playRetroSound(1200, 30, "square");
  }

  // 错误音效
  playErrorSound() {
    this.playRetroSound(200, 200, "sawtooth");
  }

  // 成功音效
  playSuccessSound() {
    this.playRetroSound(600, 100, "sine");
    setTimeout(() => this.playRetroSound(800, 100, "sine"), 100);
  }

  // CRT开机效果
  bootUpEffect() {
    const body = document.body;
    body.classList.add("crt-boot");

    // 添加开机音效
    if (this.isAudioEnabled) {
      setTimeout(() => this.playRetroSound(100, 500, "sawtooth"), 100);
      setTimeout(() => this.playRetroSound(200, 300, "sine"), 600);
      setTimeout(() => this.playRetroSound(400, 200, "triangle"), 900);
    }
  }

  // 文字打字机效果
  typewriter(element, text, speed = 50) {
    if (!element) return;

    element.textContent = "";
    let index = 0;

    const type = () => {
      if (index < text.length) {
        element.textContent += text.charAt(index);
        // 打字音效
        this.playRetroSound(800 + Math.random() * 400, 20, "square");
        index++;
        setTimeout(type, speed);
      }
    };

    type();
  }

  // 像素化glitch效果
  glitchText(element, duration = 1000) {
    if (!element) return;

    const originalText = element.textContent;
    const chars = "!@#$%^&*()_+-=[]{}|;:,.<>?~`";
    let glitchActive = true;

    const glitch = () => {
      if (!glitchActive) {
        element.textContent = originalText;
        return;
      }

      let glitchedText = "";
      for (let i = 0; i < originalText.length; i++) {
        if (Math.random() < 0.1) {
          glitchedText += chars[Math.floor(Math.random() * chars.length)];
        } else {
          glitchedText += originalText[i];
        }
      }

      element.textContent = glitchedText;

      // Glitch音效
      if (Math.random() < 0.3) {
        this.playRetroSound(150 + Math.random() * 500, 30, "sawtooth");
      }

      setTimeout(glitch, 50);
    };

    glitch();

    setTimeout(() => {
      glitchActive = false;
    }, duration);
  }

  // 屏幕闪烁效果
  screenFlicker(intensity = 0.5, duration = 100) {
    const body = document.body;
    const originalFilter = body.style.filter;

    body.style.filter = `brightness(${1 + intensity}) contrast(${
      1 + intensity * 0.5
    })`;

    setTimeout(() => {
      body.style.filter = originalFilter;
    }, duration);
  }

  // 初始化视觉效果
  initVisualEffects() {
    // 为所有按钮添加像素效果
    document.addEventListener("click", (e) => {
      if (e.target.matches("button, .pixel-button, .cta-button")) {
        this.playButtonClick();
        this.createClickRipple(e.target, e);
      }
    });

    // 悬停效果
    document.addEventListener("mouseover", (e) => {
      if (e.target.matches("button, .pixel-button, .cta-button, .nav-icon")) {
        this.playHoverSound();
        e.target.classList.add("pixel-glow");
      }
    });

    document.addEventListener("mouseout", (e) => {
      if (e.target.matches("button, .pixel-button, .cta-button, .nav-icon")) {
        e.target.classList.remove("pixel-glow");
      }
    });
  }

  // 点击波纹效果
  createClickRipple(element, event) {
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const ripple = document.createElement("div");
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: var(--pixel-green);
      border-radius: 0;
      transform: scale(0);
      animation: pixelRipple 0.3s ease-out forwards;
      pointer-events: none;
      z-index: 9999;
    `;

    // 添加像素化ripple动画
    if (!document.querySelector("#pixel-ripple-style")) {
      const style = document.createElement("style");
      style.id = "pixel-ripple-style";
      style.textContent = `
        @keyframes pixelRipple {
          0% { transform: scale(0); opacity: 0.8; }
          100% { transform: scale(1); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    element.style.position = "relative";
    element.appendChild(ripple);

    setTimeout(() => ripple.remove(), 300);
  }

  // 键盘特效
  initKeyboardEffects() {
    document.addEventListener("keydown", (e) => {
      // 空格键特效
      if (e.code === "Space") {
        this.screenFlicker(0.3, 50);
        this.playRetroSound(400, 100, "square");
      }

      // ESC键特效
      if (e.code === "Escape") {
        this.playErrorSound();
        this.screenFlicker(0.8, 200);
      }

      // 回车键特效
      if (e.code === "Enter") {
        this.playSuccessSound();
      }
    });
  }

  // 初始化页面加载效果
  initPageLoadEffects() {
    // 页面加载完成后的效果
    window.addEventListener("load", () => {
      this.bootUpEffect();

      // 为标题添加打字机效果
      const heroTitle = document.querySelector(".hero h1");
      if (heroTitle) {
        const originalText = heroTitle.textContent;
        setTimeout(() => {
          this.typewriter(heroTitle, originalText, 100);
        }, 1500);
      }

      // 为typed-text元素添加效果
      const typedText = document.getElementById("typed-text");
      if (typedText) {
        const texts = [
          "Welcome to the Matrix...",
          "Initializing systems...",
          "Loading pixel reality...",
          "Enter if you dare...",
        ];

        let textIndex = 0;
        const cycleText = () => {
          this.typewriter(typedText, texts[textIndex], 80);
          textIndex = (textIndex + 1) % texts.length;
          setTimeout(cycleText, 4000);
        };

        setTimeout(cycleText, 2000);
      }
    });
  }

  // 启用音频（需要用户交互）
  enableAudio() {
    if (this.audioContext && this.audioContext.state === "suspended") {
      this.audioContext.resume().then(() => {
        this.isAudioEnabled = true;
        this.playSuccessSound();
      });
    }
  }

  // 切换声音开关
  toggleSound() {
    this.isSoundOn = !this.isSoundOn;

    // 播放反馈音效（如果开启声音）
    if (this.isSoundOn) {
      setTimeout(() => this.playSuccessSound(), 100);
    }

    return this.isSoundOn;
  }

  // 设置声音状态
  setSoundState(enabled) {
    this.isSoundOn = enabled;
    return this.isSoundOn;
  }

  // 获取当前声音状态
  isSoundEnabled() {
    return this.isSoundOn;
  }

  // 静音所有声音
  muteAll() {
    this.isSoundOn = false;
  }

  // 取消静音
  unmuteAll() {
    this.isSoundOn = true;
    this.playSuccessSound();
  }
}

// 创建全局实例
const retroEffects = new RetroEffects();

// 在用户首次交互时启用音频
document.addEventListener(
  "click",
  () => {
    retroEffects.enableAudio();
  },
  { once: true }
);

// 初始化页面效果
retroEffects.initPageLoadEffects();

// 导出到全局作用域
window.retroEffects = retroEffects;

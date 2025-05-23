/**
 * UI效果模块
 * 负责处理网站的各种视觉效果
 */

/**
 * 打字机效果类
 */
class TypewriterEffect {
  constructor(element, texts, options = {}) {
    this.element = element;
    this.texts = texts;
    this.options = {
      typeSpeed: 100,
      deleteSpeed: 50,
      pauseTime: 1000,
      switchInterval: 500,
      ...options,
    };

    this.textIndex = 0;
    this.charIndex = 0;
    this.isDeleting = false;

    this.init();
  }

  init() {
    if (!this.element || !this.texts.length) return;
    setTimeout(() => this.type(), 1000);
  }

  type() {
    const currentText = this.texts[this.textIndex];

    if (this.isDeleting) {
      this.element.textContent = currentText.substring(0, this.charIndex - 1);
      this.charIndex--;

      if (this.charIndex === 0) {
        this.isDeleting = false;
        this.textIndex = (this.textIndex + 1) % this.texts.length;
        setTimeout(() => this.type(), this.options.switchInterval);
        return;
      }

      setTimeout(() => this.type(), this.options.deleteSpeed);
    } else {
      this.element.textContent = currentText.substring(0, this.charIndex + 1);
      this.charIndex++;

      if (this.charIndex === currentText.length) {
        this.isDeleting = true;
        setTimeout(() => this.type(), this.options.pauseTime);
        return;
      }

      setTimeout(() => this.type(), this.options.typeSpeed);
    }
  }
}

/**
 * 故障效果类
 */
class GlitchEffect {
  constructor() {
    this.glitchElements = [];
    this.init();
  }

  init() {
    this.glitchElements = document.querySelectorAll(".glitch");
    this.setupGlitchElements();
    this.startGlitchAnimation();
  }

  setupGlitchElements() {
    this.glitchElements.forEach((element) => {
      if (!element.getAttribute("data-text")) {
        element.setAttribute("data-text", element.textContent);
      }
    });
  }

  startGlitchAnimation() {
    this.glitchElements.forEach((element) => {
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
  }
}

/**
 * 霓虹灯光晕效果类
 */
class NeonGlowEffect {
  constructor() {
    this.neonElements = [];
    this.init();
  }

  init() {
    this.neonElements = document.querySelectorAll(".neon-text, .cyber-heading");
    this.startGlowAnimation();
  }

  startGlowAnimation() {
    this.neonElements.forEach((element) => {
      setInterval(() => {
        const intensity = 0.7 + Math.random() * 0.3;
        element.style.textShadow = `
                    0 0 5px rgba(255, 42, 109, ${intensity}), 
                    0 0 10px rgba(255, 42, 109, ${intensity * 0.8})
                `;
      }, 100);
    });
  }
}

/**
 * 终端效果类
 */
class TerminalEffect {
  constructor() {
    this.terminalTexts = [];
    this.init();
  }

  init() {
    this.terminalTexts = document.querySelectorAll(".terminal-text");
    this.startTerminalAnimation();
  }

  startTerminalAnimation() {
    this.terminalTexts.forEach((text, index) => {
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

      setTimeout(typeTerminal, 1000 + index * 500 + Math.random() * 1000);
    });
  }
}

/**
 * 3D卡片悬停效果类
 */
class Card3DEffect {
  constructor() {
    this.cards = [];
    this.init();
  }

  init() {
    this.cards = document.querySelectorAll(".project-card, .profile-card");
    this.setupCardEffects();
  }

  setupCardEffects() {
    this.cards.forEach((card) => {
      card.addEventListener("mousemove", (e) => this.handleMouseMove(e, card));
      card.addEventListener("mouseleave", () => this.handleMouseLeave(card));
    });
  }

  handleMouseMove(e, card) {
    const cardRect = card.getBoundingClientRect();
    const cardCenterX = cardRect.left + cardRect.width / 2;
    const cardCenterY = cardRect.top + cardRect.height / 2;

    const mouseX = e.clientX - cardCenterX;
    const mouseY = e.clientY - cardCenterY;

    const rotateX = mouseY / -10;
    const rotateY = mouseX / 10;

    card.style.transform = `
            perspective(1000px) 
            rotateX(${rotateX}deg) 
            rotateY(${rotateY}deg) 
            translateZ(10px)
        `;
  }

  handleMouseLeave(card) {
    card.style.transform =
      "perspective(1000px) rotateX(0) rotateY(0) translateZ(0)";
  }
}

/**
 * 视差效果类
 */
class ParallaxEffect {
  constructor() {
    this.heroContent = null;
    this.init();
  }

  init() {
    this.heroContent = document.querySelector(".hero-content");
    if (this.heroContent) {
      this.setupParallax();
    }
  }

  setupParallax() {
    window.addEventListener("mousemove", (e) => {
      const mouseX = e.clientX / window.innerWidth;
      const mouseY = e.clientY / window.innerHeight;

      this.heroContent.style.transform = `
                translate(${mouseX * 20 - 10}px, ${mouseY * 20 - 10}px)
            `;
    });
  }
}

/**
 * 滚动动画效果类
 */
class ScrollAnimationEffect {
  constructor() {
    this.animatedElements = [];
    this.scannerLine = null;
    this.init();
  }

  init() {
    this.animatedElements = document.querySelectorAll(
      ".project-card, .profile-card, .terminal-container, .contact-form"
    );
    this.scannerLine = document.querySelector(".scanner-line");

    this.setupScrollEffects();
  }

  setupScrollEffects() {
    window.addEventListener("scroll", () => {
      this.handleFadeInEffect();
      this.handleScannerEffect();
    });
  }

  handleFadeInEffect() {
    this.animatedElements.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top;
      const elementVisible = 150;

      if (elementTop < window.innerHeight - elementVisible) {
        element.classList.add("fade-in");
      }
    });
  }

  handleScannerEffect() {
    if (this.scannerLine) {
      const scrolled = window.scrollY;
      this.scannerLine.style.opacity = 1 - scrolled / 500;
    }
  }
}

/**
 * UI效果管理器
 * 统一管理所有UI效果的初始化
 */
class UIEffectsManager {
  constructor() {
    this.effects = new Map();
  }

  init() {
    // 初始化打字机效果
    const typedTextElement = document.getElementById("typed-text");
    if (typedTextElement) {
      const texts = [
        "CODE | DESIGN | INNOVATE",
        "LIFELONG TECH LEARNER",
        "KEEP GOING.",
      ];
      this.effects.set(
        "typewriter",
        new TypewriterEffect(typedTextElement, texts)
      );
    }

    // 初始化其他效果
    this.effects.set("glitch", new GlitchEffect());
    this.effects.set("neonGlow", new NeonGlowEffect());
    this.effects.set("terminal", new TerminalEffect());
    this.effects.set("card3D", new Card3DEffect());
    this.effects.set("parallax", new ParallaxEffect());
    this.effects.set("scrollAnimation", new ScrollAnimationEffect());
  }

  getEffect(name) {
    return this.effects.get(name);
  }

  destroy() {
    this.effects.clear();
  }
}

// 导出类和管理器
export {
  TypewriterEffect,
  GlitchEffect,
  NeonGlowEffect,
  TerminalEffect,
  Card3DEffect,
  ParallaxEffect,
  ScrollAnimationEffect,
  UIEffectsManager,
};

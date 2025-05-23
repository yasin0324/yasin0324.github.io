/**
 * ASCII艺术增强器
 * 为ASCII字符画添加动画和交互效果
 */

class ASCIIArtEnhancer {
  constructor() {
    this.asciiElements = [];
    this.init();
  }

  init() {
    this.findASCIIElements();
    this.setupEnhancements();
    this.setupEventListeners();
  }

  // 查找页面中的ASCII艺术元素
  findASCIIElements() {
    this.asciiElements = document.querySelectorAll(".ascii-art");
  }

  // 设置增强效果
  setupEnhancements() {
    this.asciiElements.forEach((element, index) => {
      // 为每个ASCII艺术元素添加唯一ID
      if (!element.id) {
        element.id = `ascii-art-${index}`;
      }

      // 添加鼠标悬停效果
      this.addHoverEffects(element);

      // 添加点击效果
      this.addClickEffects(element);

      // 检查是否需要打字机效果
      if (element.classList.contains("typewriter-effect")) {
        this.addTypewriterEffect(element);
      }
    });
  }

  // 添加悬停效果
  addHoverEffects(element) {
    element.addEventListener("mouseenter", () => {
      element.classList.add("ascii-hover");

      // 播放悬停音效（如果可用）
      if (window.retroEffects) {
        window.retroEffects.playHoverSound();
      }

      // 添加轻微的颜色变化动画
      this.animateColorShift(element);
    });

    element.addEventListener("mouseleave", () => {
      element.classList.remove("ascii-hover");
    });
  }

  // 添加点击效果
  addClickEffects(element) {
    element.addEventListener("click", () => {
      // 播放点击音效
      if (window.retroEffects) {
        window.retroEffects.playButtonClick();
      }

      // 添加点击闪烁效果
      this.flashEffect(element);

      // 触发特殊动画
      this.triggerSpecialAnimation(element);
    });
  }

  // 颜色变化动画
  animateColorShift(element) {
    const colors = [
      "var(--pixel-green)",
      "var(--pixel-cyan)",
      "var(--pixel-yellow)",
      "var(--pixel-magenta)",
    ];

    let colorIndex = 0;
    const interval = setInterval(() => {
      if (!element.matches(":hover")) {
        clearInterval(interval);
        element.style.color = "";
        return;
      }

      element.style.color = colors[colorIndex];
      colorIndex = (colorIndex + 1) % colors.length;
    }, 200);
  }

  // 闪烁效果
  flashEffect(element) {
    element.style.animation = "none";
    element.offsetHeight; // 触发重排
    element.style.animation = "asciiFlash 0.5s ease-in-out";

    // 添加闪烁动画CSS（如果不存在）
    if (!document.querySelector("#ascii-flash-style")) {
      const style = document.createElement("style");
      style.id = "ascii-flash-style";
      style.textContent = `
        @keyframes asciiFlash {
          0%, 100% { 
            filter: brightness(1);
            transform: scale(1);
          }
          50% { 
            filter: brightness(1.5);
            transform: scale(1.02);
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  // 特殊动画效果
  triggerSpecialAnimation(element) {
    // 检查是否是字符画，为其添加特殊效果
    const characterSpans = element.querySelectorAll(".ascii-character");

    characterSpans.forEach((span, index) => {
      setTimeout(() => {
        span.style.animation = "characterBounce 0.6s ease-in-out";
      }, index * 100);
    });

    // 添加弹跳动画CSS
    if (!document.querySelector("#character-bounce-style")) {
      const style = document.createElement("style");
      style.id = "character-bounce-style";
      style.textContent = `
        @keyframes characterBounce {
          0%, 100% { 
            transform: translateY(0);
          }
          50% { 
            transform: translateY(-3px);
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  // 打字机效果
  addTypewriterEffect(element) {
    const text = element.textContent;
    element.textContent = "";
    element.style.borderRight = "2px solid var(--pixel-green)";

    let index = 0;
    const typeInterval = setInterval(() => {
      if (index < text.length) {
        element.textContent += text.charAt(index);

        // 打字音效
        if (window.retroEffects) {
          window.retroEffects.playRetroSound(
            800 + Math.random() * 400,
            20,
            "square"
          );
        }

        index++;
      } else {
        clearInterval(typeInterval);
        // 移除光标
        setTimeout(() => {
          element.style.borderRight = "none";
        }, 1000);
      }
    }, 50);
  }

  // 添加扫描线效果
  addScanlineEffect(element) {
    const scanline = document.createElement("div");
    scanline.className = "ascii-scanline";
    scanline.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background: var(--pixel-green);
      opacity: 0.8;
      animation: asciiScanline 2s linear infinite;
    `;

    element.style.position = "relative";
    element.appendChild(scanline);

    // 添加扫描线动画CSS
    if (!document.querySelector("#ascii-scanline-style")) {
      const style = document.createElement("style");
      style.id = "ascii-scanline-style";
      style.textContent = `
        @keyframes asciiScanline {
          0% { 
            transform: translateY(-2px);
            opacity: 0;
          }
          10%, 90% {
            opacity: 0.8;
          }
          100% { 
            transform: translateY(calc(100% + 2px));
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  // 设置事件监听器
  setupEventListeners() {
    // 监听窗口大小变化，调整ASCII艺术显示
    window.addEventListener("resize", () => {
      this.adjustForViewport();
    });

    // 初始调整
    this.adjustForViewport();
  }

  // 根据视口调整显示
  adjustForViewport() {
    const isMobile = window.innerWidth <= 768;

    this.asciiElements.forEach((element) => {
      if (isMobile) {
        element.classList.add("mobile-optimized");
      } else {
        element.classList.remove("mobile-optimized");
      }
    });
  }

  // 公共方法：手动触发ASCII艺术动画
  animateASCII(selector) {
    const element = document.querySelector(selector);
    if (element) {
      this.triggerSpecialAnimation(element);
    }
  }

  // 公共方法：为ASCII艺术添加扫描线
  addScanlines(selector) {
    const element = document.querySelector(selector);
    if (element) {
      this.addScanlineEffect(element);
    }
  }
}

// 创建全局实例
const asciiArtEnhancer = new ASCIIArtEnhancer();

// 导出到全局作用域
window.asciiArtEnhancer = asciiArtEnhancer;

// 自动初始化
document.addEventListener("DOMContentLoaded", () => {
  asciiArtEnhancer.init();
});

export default ASCIIArtEnhancer;

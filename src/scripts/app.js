/**
 * 应用主入口文件
 * 负责整个应用的初始化和模块协调
 */

// 导入工具模块
import { UIEffectsManager } from "./ui-effects.js";

/**
 * 导航组件类
 */
class Navigation {
  constructor() {
    this.hamburger = null;
    this.navLinks = null;
    this.init();
  }

  init() {
    this.hamburger = document.querySelector(".hamburger");
    this.navLinks = document.querySelector(".nav-links");

    this.setupEventListeners();
    this.setupSmoothScroll();
  }

  setupEventListeners() {
    if (this.hamburger) {
      this.hamburger.addEventListener("click", () => this.toggleMenu());
    }
  }

  toggleMenu() {
    this.navLinks.classList.toggle("active");

    const lines = document.querySelectorAll(".hamburger .line");
    lines[0].classList.toggle("rotate-down");
    lines[1].classList.toggle("hide");
    lines[2].classList.toggle("rotate-up");
  }

  setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        e.preventDefault();

        if (this.navLinks.classList.contains("active")) {
          this.navLinks.classList.remove("active");
        }

        const target = document.querySelector(anchor.getAttribute("href"));
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
        }
      });
    });
  }
}

/**
 * 表单处理类
 */
class ContactForm {
  constructor() {
    this.form = null;
    this.submitButton = null;
    this.init();
  }

  init() {
    this.form = document.querySelector(".contact-form");
    this.submitButton = document.querySelector(".submit-button");

    if (this.form) {
      this.setupEventListeners();
    }
  }

  setupEventListeners() {
    this.form.addEventListener("submit", (e) => this.handleSubmit(e));
  }

  handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(this.form);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    };

    console.log("表单提交:", data);
    this.showSuccessState();

    setTimeout(() => this.resetForm(), 3000);
  }

  showSuccessState() {
    if (this.submitButton) {
      this.submitButton.innerHTML =
        '<span class="button-text">已发送!</span><span class="button-icon"><i class="fas fa-check"></i></span>';
      this.submitButton.style.borderColor = "var(--neon-green)";
      this.submitButton.style.color = "var(--neon-green)";
    }
  }

  resetForm() {
    this.form.reset();

    if (this.submitButton) {
      this.submitButton.innerHTML =
        '<span class="button-text">发送</span><span class="button-icon"><i class="fas fa-paper-plane"></i></span>';
      this.submitButton.style.borderColor = "var(--neon-blue)";
      this.submitButton.style.color = "var(--neon-blue)";
    }
  }
}

/**
 * 主应用类
 */
class App {
  constructor() {
    this.navigation = null;
    this.contactForm = null;
    this.uiEffects = null;
    this.matrixRain = null;

    this.init();
  }

  init() {
    // 等待DOM加载完成
    document.addEventListener("DOMContentLoaded", () => {
      this.initializeComponents();
      this.initializeEffects();
      this.setupPageLoad();
    });
  }

  initializeComponents() {
    // 初始化导航
    this.navigation = new Navigation();

    // 初始化表单
    this.contactForm = new ContactForm();

    // 初始化UI效果
    this.uiEffects = new UIEffectsManager();
    this.uiEffects.init();
  }

  initializeEffects() {
    // 延迟初始化Matrix效果
    setTimeout(() => {
      // 动态导入Matrix模块避免阻塞主线程
      import("./matrix.js")
        .then((module) => {
          const { MatrixRain } = module;
          window.matrixRain = new MatrixRain();
        })
        .catch((error) => {
          console.warn("Matrix模块加载失败:", error);
        });
    }, 500);
  }

  setupPageLoad() {
    // 页面加载动画
    const body = document.querySelector("body");
    body.classList.add("loaded");
  }
}

// 创建应用实例
const app = new App();

// 导出应用实例供调试使用
window.app = app;

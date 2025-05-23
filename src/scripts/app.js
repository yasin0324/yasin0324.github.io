/**
 * Main application entry file
 * Responsible for application initialization and module coordination
 */

// Import utility modules
import { UIEffectsManager } from "./ui-effects.js";

// Import retro effects module
import "./retro-effects.js";

// Import ASCII art enhancer
import "./ascii-art-enhancer.js";

// Import Matrix digital rain
import "./matrix.js";

// Import new feature modules
import ParticleSystem from "./particle-system.js";
import MusicVisualizer from "./music-visualizer.js";

/**
 * Navigation component class
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

    // Setup sound control button
    this.setupSoundToggle();
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

  // Sound control functionality
  setupSoundToggle() {
    const soundToggle = document.getElementById("sound-toggle");
    const soundIcon = document.getElementById("sound-icon");

    if (soundToggle && soundIcon) {
      soundToggle.addEventListener("click", () => {
        if (window.retroEffects) {
          const soundEnabled = window.retroEffects.toggleSound();
          this.updateSoundButton(soundToggle, soundIcon, soundEnabled);
        }
      });

      // Initialize button state
      const initialState = window.retroEffects
        ? window.retroEffects.isSoundEnabled()
        : true;
      this.updateSoundButton(soundToggle, soundIcon, initialState);
    }
  }

  // Update sound button display state
  updateSoundButton(button, icon, soundEnabled) {
    if (soundEnabled) {
      button.classList.remove("muted");
      button.classList.add("active");
      icon.className = "fas fa-volume-up";
      button.title = "Mute Sound";
    } else {
      button.classList.add("muted");
      button.classList.remove("active");
      icon.className = "fas fa-volume-mute";
      button.title = "Enable Sound";
    }
  }
}

/**
 * Contact form handler class
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

    console.log("Form submitted:", data);
    this.showSuccessState();

    setTimeout(() => this.resetForm(), 3000);
  }

  showSuccessState() {
    if (this.submitButton) {
      this.submitButton.innerHTML =
        '<span class="button-text">Sent!</span><span class="button-icon"><i class="fas fa-check"></i></span>';
      this.submitButton.style.borderColor = "var(--neon-green)";
      this.submitButton.style.color = "var(--neon-green)";
    }
  }

  resetForm() {
    this.form.reset();

    if (this.submitButton) {
      this.submitButton.innerHTML =
        '<span class="button-text">Send</span><span class="button-icon"><i class="fas fa-paper-plane"></i></span>';
      this.submitButton.style.borderColor = "var(--neon-blue)";
      this.submitButton.style.color = "var(--neon-blue)";
    }
  }
}

/**
 * Main application class
 */
class App {
  constructor() {
    this.navigation = null;
    this.contactForm = null;
    this.uiEffects = null;
    this.matrixRain = null;
    this.particleSystem = null;
    this.musicVisualizer = null;

    this.init();
  }

  init() {
    // Wait for DOM to load
    document.addEventListener("DOMContentLoaded", () => {
      this.initializeComponents();
      this.initializeEffects();
      this.setupPageLoad();
      this.initializeNewFeatures();
    });
  }

  initializeComponents() {
    // Initialize navigation
    this.navigation = new Navigation();

    // Initialize contact form
    this.contactForm = new ContactForm();
  }

  initializeEffects() {
    // Initialize UI effects manager
    this.uiEffects = new UIEffectsManager();
    this.uiEffects.init();

    // Initialize Matrix rain effect
    if (window.matrixRain) {
      this.matrixRain = window.matrixRain;
    }

    // Initialize retro effects - no need to call init() as it's already initialized
    if (window.retroEffects) {
      // Enable audio on first user interaction
      document.addEventListener(
        "click",
        () => {
          window.retroEffects.enableAudio();
        },
        { once: true }
      );
    }

    // Delay Matrix initialization to avoid blocking main thread
    setTimeout(() => {
      // Dynamic import Matrix module to avoid blocking main thread
      import("./matrix.js")
        .then((module) => {
          const { MatrixRain } = module;
          window.matrixRain = new MatrixRain();
        })
        .catch((error) => {
          console.warn("Matrix module loading failed:", error);
        });
    }, 500);
  }

  initializeNewFeatures() {
    this.initParticleSystem();
    this.initMusicVisualizer();
    this.setupParticleControls();
    this.setupVisualizerControls();
    this.setupNewFeatureInteractions();
  }

  initParticleSystem() {
    const canvas = document.getElementById("particle-canvas");
    if (canvas) {
      this.particleSystem = new ParticleSystem(canvas);
      console.log("Particle system initialized");
    }
  }

  initMusicVisualizer() {
    const canvas = document.getElementById("visualizer-canvas");
    if (canvas) {
      this.musicVisualizer = new MusicVisualizer(canvas);
      console.log("Music visualizer initialized");
    }
  }

  setupParticleControls() {
    const toggleBtn = document.getElementById("particle-toggle");
    const particleCount = document.getElementById("particle-count");
    const particleFps = document.getElementById("particle-fps");

    if (toggleBtn && this.particleSystem) {
      toggleBtn.addEventListener("click", () => {
        this.particleSystem.toggle();

        if (this.particleSystem.isActive) {
          toggleBtn.innerHTML = '<i class="fas fa-stop"></i> Stop Particles';
          toggleBtn.classList.add("active");
        } else {
          toggleBtn.innerHTML = '<i class="fas fa-play"></i> Start Particles';
          toggleBtn.classList.remove("active");
        }
      });

      // Update particle stats
      setInterval(() => {
        if (particleCount) {
          particleCount.textContent = this.particleSystem.particles.length;
        }
        if (particleFps) {
          particleFps.textContent = "60"; // Simplified FPS display
        }
      }, 100);
    }
  }

  setupVisualizerControls() {
    const startBtn = document.getElementById("visualizer-start");
    const demoBtn = document.getElementById("visualizer-demo");
    const stopBtn = document.getElementById("visualizer-stop");

    if (this.musicVisualizer) {
      if (startBtn) {
        startBtn.addEventListener("click", async () => {
          await this.musicVisualizer.startMicrophone();
        });
      }

      if (demoBtn) {
        demoBtn.addEventListener("click", () => {
          this.musicVisualizer.startSimulation();
        });
      }

      if (stopBtn) {
        stopBtn.addEventListener("click", () => {
          this.musicVisualizer.stop();
        });
      }
    }
  }

  setupNewFeatureInteractions() {
    // Particle system interactions with other features
    if (this.particleSystem && this.musicVisualizer) {
      // Create particles when music peaks
      this.musicVisualizer.onBeat = (intensity) => {
        if (this.particleSystem.isActive && intensity > 0.8) {
          const x = Math.random() * window.innerWidth;
          const y = Math.random() * window.innerHeight;
          this.particleSystem.createExplosion(x, y);
        }
      };
    }
  }

  setupPageLoad() {
    // Remove loading class after page loads
    window.addEventListener("load", () => {
      document.body.classList.remove("crt-boot");
      document.body.classList.add("loaded");

      // Initialize typing effect
      this.initTypingEffect();
    });
  }

  initTypingEffect() {
    const typedTextElement = document.getElementById("typed-text");
    if (!typedTextElement) return;

    const texts = [
      "Welcome to my cyberpunk world",
      "Beginner web developer",
      "Learning and growing every day",
      "Building the future with code",
    ];

    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
      const currentText = texts[textIndex];

      if (isDeleting) {
        typedTextElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typedTextElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
      }

      let typeSpeed = isDeleting ? 50 : 100;

      if (!isDeleting && charIndex === currentText.length) {
        typeSpeed = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        typeSpeed = 500;
      }

      setTimeout(type, typeSpeed);
    }

    type();
  }
}

// Initialize application
new App();

/**
 * Terminal Typing Test
 * A cyberpunk-themed typing speed test with various difficulty modes
 */

export class TypingTest {
  constructor() {
    this.targetTextElement = document.getElementById("target-text");
    this.inputElement = document.getElementById("typing-input");
    this.wpmElement = document.getElementById("wpm-count");
    this.accuracyElement = document.getElementById("accuracy");
    this.timeElement = document.getElementById("time-left");
    this.resultsElement = document.getElementById("typing-results");

    // Test state
    this.isRunning = false;
    this.startTime = null;
    this.timeLimit = 60; // seconds
    this.timer = null;
    this.currentText = "";
    this.typedText = "";
    this.totalTyped = 0;
    this.correctTyped = 0;
    this.errors = 0;

    // Text samples for different difficulties
    this.textSamples = {
      easy: [
        "The quick brown fox jumps over the lazy dog. This is a simple typing test.",
        "Hello world! Welcome to the typing speed test. Type as fast as you can.",
        "Practice makes perfect. Keep typing to improve your speed and accuracy.",
        "This is an easy text sample designed for beginners. Take your time.",
        "Type this sentence carefully. Speed will come with practice.",
      ],
      medium: [
        "In the cyberpunk future, neon lights illuminate the dark city streets. Hackers navigate through virtual reality networks, searching for valuable data.",
        "The digital revolution has transformed our world. Artificial intelligence and quantum computers shape the technological landscape of tomorrow.",
        "Through the matrix of interconnected systems, data flows like rivers of light. Each keystroke echoes in the vast digital expanse.",
        "Advanced algorithms process information at incredible speeds. Machine learning models evolve and adapt to new challenges.",
      ],
      hard: [
        "Quantum entanglement phenomena demonstrate non-local correlations between particles, challenging classical physics paradigms. Researchers explore applications in cryptography and computing.",
        "Asymptotic computational complexity analysis reveals algorithmic efficiency boundaries. O(n log n) sorting algorithms optimize large-scale data processing operations.",
        "Blockchain technology utilizes cryptographic hash functions and distributed consensus mechanisms. Decentralized networks enable trustless peer-to-peer transactions.",
      ],
      code: [
        "const fibonacci = (n) => n <= 1 ? n : fibonacci(n - 1) + fibonacci(n - 2);",
        "function quickSort(arr) { if (arr.length <= 1) return arr; const pivot = arr[0]; return [...quickSort(arr.slice(1).filter(x => x < pivot)), pivot, ...quickSort(arr.slice(1).filter(x => x >= pivot))]; }",
        "class BinaryTree { constructor(value) { this.value = value; this.left = null; this.right = null; } insert(val) { if (val < this.value) { this.left ? this.left.insert(val) : this.left = new BinaryTree(val); } else { this.right ? this.right.insert(val) : this.right = new BinaryTree(val); } } }",
        "async function fetchData(url) { try { const response = await fetch(url); if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`); return await response.json(); } catch (error) { console.error('Fetch error:', error); } }",
      ],
    };

    // Sound effects
    this.sounds = {
      keypress: new Audio(
        "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQAAAAA="
      ),
      error: new Audio(
        "data:audio/wav;base64,UklGRjIAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQ4AAAD//wAAUlr//wAA//9aUg=="
      ),
      complete: new Audio(
        "data:audio/wav;base64,UklGRjwAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YRgAAAAA/3//f/8AAP//AAD/f/9//wAA//8AAA=="
      ),
    };

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.selectRandomText("easy");
    this.displayText();
  }

  setupEventListeners() {
    // Start button
    document.getElementById("start-typing").addEventListener("click", () => {
      this.startTest();
    });

    // Reset button
    document.getElementById("reset-typing").addEventListener("click", () => {
      this.resetTest();
    });

    // Difficulty selector
    document
      .getElementById("typing-difficulty")
      .addEventListener("change", (e) => {
        if (!this.isRunning) {
          this.selectRandomText(e.target.value);
          this.displayText();
        }
      });

    // Input field
    this.inputElement.addEventListener("input", (e) => {
      if (this.isRunning) {
        this.handleTyping(e.target.value);
      }
    });

    // Prevent paste
    this.inputElement.addEventListener("paste", (e) => {
      e.preventDefault();
    });
  }

  selectRandomText(difficulty) {
    const texts = this.textSamples[difficulty];
    this.currentText = texts[Math.floor(Math.random() * texts.length)];
  }

  displayText() {
    // Clear previous highlighting
    this.targetTextElement.innerHTML = "";

    // Create spans for each character
    this.currentText.split("").forEach((char, index) => {
      const span = document.createElement("span");
      span.textContent = char;
      span.className = "char";
      span.dataset.index = index;
      this.targetTextElement.appendChild(span);
    });
  }

  startTest() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.startTime = Date.now();
    this.typedText = "";
    this.totalTyped = 0;
    this.correctTyped = 0;
    this.errors = 0;

    // Enable input
    this.inputElement.disabled = false;
    this.inputElement.value = "";
    this.inputElement.focus();

    // Hide results
    this.resultsElement.style.display = "none";

    // Start timer
    this.updateTimer();
    this.timer = setInterval(() => this.updateTimer(), 100);
  }

  handleTyping(value) {
    this.typedText = value;
    this.totalTyped = value.length;

    // Update character highlighting
    const chars = this.targetTextElement.querySelectorAll(".char");

    chars.forEach((char, index) => {
      char.classList.remove("correct", "incorrect", "current");

      if (index < value.length) {
        if (value[index] === this.currentText[index]) {
          char.classList.add("correct");
        } else {
          char.classList.add("incorrect");
          this.errors++;
        }
      } else if (index === value.length) {
        char.classList.add("current");
      }
    });

    // Calculate stats
    this.updateStats();

    // Check if completed
    if (value === this.currentText) {
      this.completeTest();
    }
  }

  updateStats() {
    // Calculate WPM
    const timeElapsed = (Date.now() - this.startTime) / 1000 / 60; // minutes
    const words = this.typedText.trim().split(/\s+/).length;
    const wpm = Math.round(words / timeElapsed) || 0;

    // Calculate accuracy
    this.correctTyped = 0;
    for (
      let i = 0;
      i < this.typedText.length && i < this.currentText.length;
      i++
    ) {
      if (this.typedText[i] === this.currentText[i]) {
        this.correctTyped++;
      }
    }
    const accuracy =
      this.totalTyped > 0
        ? Math.round((this.correctTyped / this.totalTyped) * 100)
        : 100;

    // Update display
    this.wpmElement.textContent = wpm;
    this.accuracyElement.textContent = accuracy;
  }

  updateTimer() {
    const elapsed = (Date.now() - this.startTime) / 1000;
    const remaining = Math.max(0, this.timeLimit - elapsed);

    this.timeElement.textContent = Math.ceil(remaining);

    if (remaining === 0) {
      this.completeTest();
    }
  }

  completeTest() {
    this.isRunning = false;

    // Stop timer
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }

    // Disable input
    this.inputElement.disabled = true;

    // Play complete sound
    if (this.sounds.complete) {
      this.sounds.complete.currentTime = 0;
      this.sounds.complete.play().catch(() => {});
    }

    // Calculate final stats
    const timeElapsed = Math.min(
      (Date.now() - this.startTime) / 1000 / 60,
      this.timeLimit / 60
    );
    const words = this.correctTyped > 0 ? Math.floor(this.correctTyped / 5) : 0; // 5 chars per word
    const finalWpm = Math.round(words / timeElapsed) || 0;
    const finalAccuracy =
      this.totalTyped > 0
        ? Math.round((this.correctTyped / this.totalTyped) * 100)
        : 0;

    // Show results
    this.showResults(finalWpm, finalAccuracy, words);
  }

  showResults(wpm, accuracy, totalWords) {
    document.getElementById("final-wpm").textContent = wpm;
    document.getElementById("final-accuracy").textContent = accuracy + "%";
    document.getElementById("total-words").textContent = totalWords;

    this.resultsElement.style.display = "block";

    // Add performance message
    let message = "";
    if (wpm >= 80) {
      message = "Elite hacker speed! 🚀";
    } else if (wpm >= 60) {
      message = "Professional typist! 💻";
    } else if (wpm >= 40) {
      message = "Good progress! Keep practicing! 👍";
    } else {
      message = "Keep practicing, you'll get faster! 💪";
    }

    // Create or update message element
    let messageEl = this.resultsElement.querySelector(".performance-message");
    if (!messageEl) {
      messageEl = document.createElement("p");
      messageEl.className = "performance-message pixel-text";
      this.resultsElement.appendChild(messageEl);
    }
    messageEl.textContent = message;
  }

  resetTest() {
    this.isRunning = false;

    // Stop timer
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }

    // Reset state
    this.typedText = "";
    this.totalTyped = 0;
    this.correctTyped = 0;
    this.errors = 0;

    // Reset UI
    this.inputElement.value = "";
    this.inputElement.disabled = true;
    this.wpmElement.textContent = "0";
    this.accuracyElement.textContent = "100";
    this.timeElement.textContent = "60";
    this.resultsElement.style.display = "none";

    // Reset text highlighting
    this.displayText();
  }
}

// Add styles for text highlighting
const style = document.createElement("style");
style.textContent = `
  .target-text {
    font-family: 'Courier New', monospace;
    font-size: 1.2em;
    line-height: 1.8;
    letter-spacing: 0.05em;
  }
  
  .target-text .char {
    position: relative;
    transition: all 0.1s ease;
  }
  
  .target-text .char.correct {
    color: #00ff00;
    text-shadow: 0 0 5px #00ff00;
  }
  
  .target-text .char.incorrect {
    color: #ff0080;
    background: rgba(255, 0, 128, 0.2);
    text-shadow: 0 0 5px #ff0080;
  }
  
  .target-text .char.current {
    background: rgba(0, 255, 255, 0.3);
    animation: blink 1s infinite;
  }
  
  @keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0.3; }
  }
  
  .typing-input {
    width: 100%;
    background: #0a0a0a;
    border: 1px solid #00ff80;
    color: #00ff00;
    font-family: 'Courier New', monospace;
    font-size: 1.1em;
    padding: 10px;
    margin-top: 10px;
    resize: none;
    height: 100px;
  }
  
  .typing-input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .performance-message {
    font-size: 1.2em;
    color: #00ff80;
    text-align: center;
    margin-top: 20px;
    text-shadow: 0 0 10px currentColor;
  }
`;
document.head.appendChild(style);

// Initialize when DOM is ready
let typingTest;

document.addEventListener("DOMContentLoaded", () => {
  typingTest = new TypingTest();
});

class TerminalSimulator {
  constructor(container) {
    this.container = container;
    this.commandHistory = [];
    this.historyIndex = -1;
    this.currentPath = "~";
    this.isProcessing = false;

    // 可用命令
    this.commands = {
      help: this.showHelp.bind(this),
      about: this.showAbout.bind(this),
      skills: this.showSkills.bind(this),
      projects: this.showProjects.bind(this),
      contact: this.showContact.bind(this),
      matrix: this.startMatrix.bind(this),
      particles: this.toggleParticles.bind(this),
      visualizer: this.startVisualizer.bind(this),
      clear: this.clearTerminal.bind(this),
      ls: this.listFiles.bind(this),
      cat: this.catFile.bind(this),
      whoami: this.whoami.bind(this),
      date: this.showDate.bind(this),
      pwd: this.showPath.bind(this),
      echo: this.echo.bind(this),
      neofetch: this.neofetch.bind(this),
    };

    this.init();
  }

  init() {
    this.render();
    this.setupEventListeners();
    this.showWelcome();
  }

  render() {
    this.container.innerHTML = `
      <div class="terminal-simulator">
        <div class="terminal-header">
          <div class="terminal-controls">
            <span class="control-btn close"></span>
            <span class="control-btn minimize"></span>
            <span class="control-btn maximize"></span>
          </div>
          <div class="terminal-title">terminal@yasin:~</div>
        </div>
        <div class="terminal-body" id="terminal-output">
          <div class="terminal-line">
<span class="prompt">yasin@cyberpunk:~$</span>
<span class="welcome-text">Welcome to Yasin's Interactive Terminal</span>
          </div>
        </div>
        <div class="terminal-input-line">
          <span class="prompt">yasin@cyberpunk:${this.currentPath}$</span>
          <input type="text" class="terminal-input" id="terminal-input" placeholder="Type 'help' for available commands..." autocomplete="off">
        </div>
      </div>
    `;
  }

  setupEventListeners() {
    const input = document.getElementById("terminal-input");
    const output = document.getElementById("terminal-output");

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        this.processCommand(input.value.trim());
        input.value = "";
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        this.navigateHistory(-1);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        this.navigateHistory(1);
      } else if (e.key === "Tab") {
        e.preventDefault();
        this.autoComplete(input.value);
      }
    });

    // 点击终端区域时聚焦输入框
    this.container.addEventListener("click", () => {
      input.focus();
    });

    // 自动聚焦
    input.focus();
  }

  async processCommand(commandLine) {
    if (this.isProcessing) return;

    this.isProcessing = true;
    const input = document.getElementById("terminal-input");
    const output = document.getElementById("terminal-output");

    // 添加用户输入到输出
    this.addLine(`yasin@cyberpunk:${this.currentPath}$ ${commandLine}`);

    if (!commandLine) {
      this.isProcessing = false;
      return;
    }

    // 添加到历史记录
    this.commandHistory.push(commandLine);
    this.historyIndex = this.commandHistory.length;

    // 解析命令
    const [command, ...args] = commandLine.split(" ");
    const cmd = command.toLowerCase();

    if (this.commands[cmd]) {
      await this.commands[cmd](args);
    } else {
      this.addLine(`bash: ${command}: command not found`, "error");
      this.addLine(`Type 'help' to see available commands.`, "info");
    }

    this.isProcessing = false;
    this.updatePrompt();
  }

  addLine(text, className = "") {
    const output = document.getElementById("terminal-output");
    const line = document.createElement("div");
    line.className = `terminal-line ${className}`;

    if (className === "typing") {
      line.innerHTML = text;
      output.appendChild(line);
      return this.typeText(line, text);
    } else {
      line.textContent = text;
      output.appendChild(line);
      output.scrollTop = output.scrollHeight;
    }
  }

  async typeText(element, text, speed = 30) {
    element.textContent = "";
    for (let i = 0; i < text.length; i++) {
      element.textContent += text[i];
      await new Promise((resolve) => setTimeout(resolve, speed));
    }
  }

  updatePrompt() {
    const promptSpan = document.querySelector(".terminal-input-line .prompt");
    if (promptSpan) {
      promptSpan.textContent = `yasin@cyberpunk:${this.currentPath}$`;
    }
  }

  navigateHistory(direction) {
    const input = document.getElementById("terminal-input");

    if (direction === -1 && this.historyIndex > 0) {
      this.historyIndex--;
      input.value = this.commandHistory[this.historyIndex];
    } else if (
      direction === 1 &&
      this.historyIndex < this.commandHistory.length - 1
    ) {
      this.historyIndex++;
      input.value = this.commandHistory[this.historyIndex];
    } else if (
      direction === 1 &&
      this.historyIndex === this.commandHistory.length - 1
    ) {
      this.historyIndex = this.commandHistory.length;
      input.value = "";
    }
  }

  autoComplete(partial) {
    const matches = Object.keys(this.commands).filter((cmd) =>
      cmd.startsWith(partial.toLowerCase())
    );

    if (matches.length === 1) {
      const input = document.getElementById("terminal-input");
      input.value = matches[0];
    } else if (matches.length > 1) {
      this.addLine(`Available: ${matches.join(", ")}`, "info");
    }
  }

  // 命令实现
  async showWelcome() {
    await new Promise((resolve) => setTimeout(resolve, 500));
    this.addLine("");
    this.addLine("██╗   ██╗ █████╗ ███████╗██╗███╗   ██╗", "ascii");
    this.addLine("╚██╗ ██╔╝██╔══██╗██╔════╝██║████╗  ██║", "ascii");
    this.addLine(" ╚████╔╝ ███████║███████╗██║██╔██╗ ██║", "ascii");
    this.addLine("  ╚██╔╝  ██╔══██║╚════██║██║██║╚██╗██║", "ascii");
    this.addLine("   ██║   ██║  ██║███████║██║██║ ╚████║", "ascii");
    this.addLine("   ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝╚═╝  ╚═══╝", "ascii");
    this.addLine("");
    this.addLine(
      'Welcome to my cyberpunk terminal! Type "help" to get started.',
      "success"
    );
    this.addLine("");
  }

  showHelp() {
    this.addLine("");
    this.addLine("Available commands:", "info");
    this.addLine("  help        - Show this help message");
    this.addLine("  about       - About me");
    this.addLine("  skills      - My technical skills");
    this.addLine("  projects    - My projects");
    this.addLine("  contact     - Contact information");
    this.addLine("  matrix      - Start matrix rain");
    this.addLine("  particles   - Toggle particle system");
    this.addLine("  visualizer  - Start audio visualizer");
    this.addLine("  ls          - List files");
    this.addLine("  cat <file>  - Display file content");
    this.addLine("  whoami      - Display current user");
    this.addLine("  date        - Show current date/time");
    this.addLine("  pwd         - Show current directory");
    this.addLine("  echo <text> - Echo text");
    this.addLine("  neofetch    - System information");
    this.addLine("  clear       - Clear terminal");
    this.addLine("");
    this.addLine("Use ↑↓ arrow keys to navigate command history");
    this.addLine("Use Tab for auto-completion");
    this.addLine("");
  }

  showAbout() {
    this.addLine("");
    this.addLine("About Yasin", "success");
    this.addLine("================", "success");
    this.addLine("Role: Beginner Web Developer");
    this.addLine("Location: China");
    this.addLine("Status: Learning and growing every day");
    this.addLine("Interests: Gaming, Coding, Travel, Music, Movies, Anime");
    this.addLine("");
    this.addLine("A passionate beginner in web development, building");
    this.addLine("cyberpunk-style websites and exploring new technologies.");
    this.addLine("");
  }

  showSkills() {
    this.addLine("");
    this.addLine("Technical Skills", "success");
    this.addLine("==================", "success");
    this.addLine("Frontend Development:");
    this.addLine("  ├── HTML5/CSS3");
    this.addLine("  ├── JavaScript (ES6+)");
    this.addLine("  ├── Vue.js");
    this.addLine("  └── React");
    this.addLine("");
    this.addLine("Development Tools:");
    this.addLine("  ├── Git/GitHub");
    this.addLine("  ├── VS Code");
    this.addLine("  └── Terminal/CLI");
    this.addLine("");
    this.addLine("Currently Learning:");
    this.addLine("  ├── Node.js");
    this.addLine("  ├── Python");
    this.addLine("  └── Database Technologies");
    this.addLine("");
  }

  showProjects() {
    this.addLine("");
    this.addLine("Projects", "success");
    this.addLine("==========", "success");
    this.addLine("1. Cyberpunk Portfolio Website");
    this.addLine("   ├── Interactive particle system");
    this.addLine("   ├── Matrix digital rain effect");
    this.addLine("   ├── 8-bit audio visualizer");
    this.addLine("   └── Terminal simulator");
    this.addLine("");
    this.addLine("2. Future Projects (Coming Soon)");
    this.addLine("   ├── Personal blog system");
    this.addLine("   ├── Web games collection");
    this.addLine("   └── Open source contributions");
    this.addLine("");
  }

  showContact() {
    this.addLine("");
    this.addLine("Contact Information", "success");
    this.addLine("=====================", "success");
    this.addLine("GitHub: https://github.com/yasin0324");
    this.addLine("Email: [Contact through GitHub]");
    this.addLine("");
    this.addLine("Feel free to reach out for collaborations,");
    this.addLine("questions, or just to say hello!");
    this.addLine("");
  }

  startMatrix() {
    this.addLine("");
    this.addLine("Initializing Matrix digital rain...", "success");
    this.addLine("Reality.exe is loading...");
    this.addLine("Choose the red pill or blue pill...");
    this.addLine("");
    // 实际启动Matrix效果
    if (window.matrixRain) {
      window.matrixRain.start();
    }
  }

  toggleParticles() {
    this.addLine("");
    if (window.particleSystem) {
      if (window.particleSystem.isActive) {
        window.particleSystem.stop();
        this.addLine("Particle system deactivated.", "info");
      } else {
        window.particleSystem.start();
        this.addLine("Particle system activated.", "success");
      }
    } else {
      this.addLine("Particle system not found.", "error");
    }
    this.addLine("");
  }

  startVisualizer() {
    this.addLine("");
    this.addLine("Starting audio visualizer...", "success");
    this.addLine("Initializing 8-bit audio analysis...");
    this.addLine("");
    // 滚动到可视化器部分
    document
      .querySelector("#visualizer")
      ?.scrollIntoView({ behavior: "smooth" });
  }

  clearTerminal() {
    document.getElementById("terminal-output").innerHTML = "";
  }

  listFiles() {
    this.addLine("");
    this.addLine("total 7");
    this.addLine("drwxr-xr-x  1 yasin yasin  512 Dec 23 2024 .");
    this.addLine("drwxr-xr-x  1 yasin yasin  512 Dec 23 2024 ..");
    this.addLine("-rw-r--r--  1 yasin yasin   42 Dec 23 2024 about.txt");
    this.addLine("-rw-r--r--  1 yasin yasin  128 Dec 23 2024 skills.json");
    this.addLine("-rw-r--r--  1 yasin yasin   64 Dec 23 2024 projects.md");
    this.addLine("-rw-r--r--  1 yasin yasin   32 Dec 23 2024 contact.info");
    this.addLine("-rwxr-xr-x  1 yasin yasin 2048 Dec 23 2024 matrix.exe");
    this.addLine("");
  }

  catFile(args) {
    const filename = args[0];
    this.addLine("");

    switch (filename) {
      case "about.txt":
        this.addLine("Beginner Web Developer from China");
        this.addLine("Learning and building cool stuff!");
        break;
      case "skills.json":
        this.addLine("{");
        this.addLine('  "frontend": ["HTML", "CSS", "JavaScript"],');
        this.addLine('  "frameworks": ["Vue", "React"],');
        this.addLine('  "learning": ["Node.js", "Python"]');
        this.addLine("}");
        break;
      case "contact.info":
        this.addLine("GitHub: yasin0324");
        this.addLine("Status: Open for collaboration");
        break;
      default:
        this.addLine(`cat: ${filename}: No such file or directory`, "error");
    }
    this.addLine("");
  }

  whoami() {
    this.addLine("yasin");
  }

  showDate() {
    const now = new Date();
    this.addLine("");
    this.addLine(`Current time: ${now.toLocaleString()}`);
    this.addLine(`Unix timestamp: ${Math.floor(now.getTime() / 1000)}`);
    this.addLine(
      `Binary time: ${now.getHours().toString(2).padStart(5, "0")}:${now
        .getMinutes()
        .toString(2)
        .padStart(6, "0")}:${now.getSeconds().toString(2).padStart(6, "0")}`
    );
    this.addLine("");
  }

  showPath() {
    this.addLine(
      `/home/yasin${this.currentPath === "~" ? "" : this.currentPath}`
    );
  }

  echo(args) {
    this.addLine(args.join(" "));
  }

  neofetch() {
    this.addLine("");
    this.addLine("                    yasin@cyberpunk", "success");
    this.addLine("                    ----------------", "success");
    this.addLine("       .--.         OS: CyberpunkOS 2024");
    this.addLine("      |o_o |        Host: Personal Portfolio");
    this.addLine("      |:_/ |        Kernel: WebKit");
    this.addLine("     //   \\ \\       Shell: Terminal Simulator v1.0");
    this.addLine("    (|     | )      Resolution: Responsive");
    this.addLine("   /\\_)   (_/\\      DE: Cyberpunk UI");
    this.addLine("                    Theme: Neon Green");
    this.addLine("                    Terminal: Interactive Shell");
    this.addLine("                    CPU: Learning Engine");
    this.addLine("                    Memory: Growing");
    this.addLine("");
  }
}

export default TerminalSimulator;

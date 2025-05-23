class MusicVisualizer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.audioContext = null;
    this.analyser = null;
    this.dataArray = null;
    this.source = null;
    this.isPlaying = false;
    this.animationId = null;

    // 可视化设置
    this.fftSize = 256;
    this.barCount = 128;
    this.barWidth = 0;
    this.barSpacing = 2;
    this.colors = [
      "#00ff00",
      "#ff0080",
      "#00ffff",
      "#ffff00",
      "#ff8000",
      "#8000ff",
      "#ff4080",
      "#40ff80",
    ];

    this.setupCanvas();
    // Don't initialize audio immediately - wait for user interaction
  }

  setupCanvas() {
    this.resizeCanvas();
    window.addEventListener("resize", () => this.resizeCanvas());
  }

  resizeCanvas() {
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
    this.barWidth = this.canvas.width / this.barCount - this.barSpacing;
  }

  async initAudio() {
    if (this.audioContext) return; // Already initialized

    try {
      // 创建音频上下文
      this.audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();

      // 创建分析器节点
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = this.fftSize;
      this.analyser.smoothingTimeConstant = 0.8;

      // 准备数据数组
      this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);

      // 连接到输出
      this.analyser.connect(this.audioContext.destination);
    } catch (error) {
      console.error("Audio initialization failed:", error);
    }
  }

  async startMicrophone() {
    try {
      // Initialize audio context first
      await this.initAudio();

      if (this.audioContext.state === "suspended") {
        await this.audioContext.resume();
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });

      this.source = this.audioContext.createMediaStreamSource(stream);
      this.source.connect(this.analyser);

      this.isPlaying = true;
      this.animate();

      return true;
    } catch (error) {
      console.error("Microphone access failed:", error);
      // 如果无法访问麦克风，使用模拟数据
      this.startSimulation();
      return false;
    }
  }

  startSimulation() {
    // 创建模拟音频数据
    this.isPlaying = true;
    this.simulateAudio();
  }

  simulateAudio() {
    if (!this.dataArray) {
      this.dataArray = new Uint8Array(this.barCount);
    }

    const time = Date.now() * 0.001;

    for (let i = 0; i < this.barCount; i++) {
      // 创建类似音乐的频率分布
      const frequency = i / this.barCount;
      const bass = Math.sin(time * 2 + frequency * 10) * 30 + 50;
      const mid = Math.sin(time * 4 + frequency * 20) * 20 + 30;
      const treble = Math.sin(time * 8 + frequency * 40) * 15 + 20;

      let value = 0;
      if (frequency < 0.2) {
        value = bass;
      } else if (frequency < 0.6) {
        value = mid;
      } else {
        value = treble;
      }

      // 添加随机变化和节拍
      const beat = Math.sin(time * 3) > 0.7 ? 40 : 0;
      value += Math.random() * 10 + beat;

      this.dataArray[i] = Math.max(0, Math.min(255, value));
    }

    this.animate();
  }

  stop() {
    this.isPlaying = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }

    if (this.source) {
      this.source.disconnect();
      this.source = null;
    }
  }

  animate() {
    if (!this.isPlaying) return;

    // 获取频率数据
    if (this.analyser) {
      this.analyser.getByteFrequencyData(this.dataArray);
    } else {
      // 如果使用模拟模式，继续生成数据
      this.simulateAudio();
      return;
    }

    this.draw();
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  draw() {
    const { width, height } = this.canvas;

    // 清空画布，使用渐变背景
    const gradient = this.ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, "rgba(0, 0, 0, 0.1)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0.3)");
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, width, height);

    // 绘制频谱条
    for (let i = 0; i < this.barCount; i++) {
      const value = this.dataArray[i];
      const barHeight = (value / 255) * height * 0.8;
      const x = i * (this.barWidth + this.barSpacing);
      const y = height - barHeight;

      // 选择颜色（基于频率）
      const colorIndex = Math.floor((i / this.barCount) * this.colors.length);
      const color = this.colors[colorIndex];

      // 绘制主条形
      this.ctx.fillStyle = color;
      this.ctx.fillRect(x, y, this.barWidth, barHeight);

      // 添加发光效果
      this.ctx.shadowBlur = 15;
      this.ctx.shadowColor = color;
      this.ctx.fillRect(x, y, this.barWidth, barHeight);
      this.ctx.shadowBlur = 0;

      // 绘制反射效果
      const reflectionHeight = barHeight * 0.3;
      const reflectionGradient = this.ctx.createLinearGradient(
        0,
        height,
        0,
        height + reflectionHeight
      );
      reflectionGradient.addColorStop(0, color + "40");
      reflectionGradient.addColorStop(1, "transparent");

      this.ctx.fillStyle = reflectionGradient;
      this.ctx.fillRect(x, height, this.barWidth, reflectionHeight);

      // 添加像素化效果
      if (barHeight > height * 0.5) {
        this.drawPixelEffect(x, y, this.barWidth, barHeight, color);
      }
    }

    // 绘制中央波形
    this.drawWaveform();

    // 绘制频率标签
    this.drawFrequencyLabels();
  }

  drawPixelEffect(x, y, width, height, color) {
    const pixelSize = 4;
    const rows = Math.floor(height / pixelSize);

    for (let row = 0; row < rows; row += 2) {
      const pixelY = y + row * pixelSize;
      const alpha = 1 - (row / rows) * 0.5;

      this.ctx.fillStyle =
        color +
        Math.floor(alpha * 255)
          .toString(16)
          .padStart(2, "0");
      this.ctx.fillRect(x, pixelY, width, pixelSize);
    }
  }

  drawWaveform() {
    if (!this.dataArray) return;

    const { width, height } = this.canvas;
    const centerY = height / 2;

    this.ctx.strokeStyle = "#ffffff";
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();

    for (let i = 0; i < this.barCount; i++) {
      const x = (i / this.barCount) * width;
      const value = this.dataArray[i];
      const y = centerY + (value - 128) * 0.5;

      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    }

    this.ctx.stroke();
  }

  drawFrequencyLabels() {
    const { width, height } = this.canvas;

    this.ctx.fillStyle = "#00ff00";
    this.ctx.font = "12px monospace";
    this.ctx.textAlign = "center";

    const labels = ["BASS", "MID", "TREBLE"];
    const positions = [width * 0.15, width * 0.5, width * 0.85];

    labels.forEach((label, index) => {
      this.ctx.fillText(label, positions[index], height - 10);
    });

    // 绘制VU表
    this.drawVUMeter();
  }

  drawVUMeter() {
    if (!this.dataArray) return;

    const { width, height } = this.canvas;

    // 计算平均音量
    const average =
      this.dataArray.reduce((sum, value) => sum + value, 0) /
      this.dataArray.length;
    const vuWidth = 200;
    const vuHeight = 20;
    const vuX = width - vuWidth - 20;
    const vuY = 20;

    // 绘制VU表背景
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    this.ctx.fillRect(vuX, vuY, vuWidth, vuHeight);

    // 绘制VU表边框
    this.ctx.strokeStyle = "#00ff00";
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(vuX, vuY, vuWidth, vuHeight);

    // 绘制音量条
    const vuLevel = (average / 255) * vuWidth;
    const gradient = this.ctx.createLinearGradient(vuX, 0, vuX + vuWidth, 0);
    gradient.addColorStop(0, "#00ff00");
    gradient.addColorStop(0.6, "#ffff00");
    gradient.addColorStop(1, "#ff0000");

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(vuX, vuY, vuLevel, vuHeight);

    // 绘制标签
    this.ctx.fillStyle = "#00ff00";
    this.ctx.font = "10px monospace";
    this.ctx.textAlign = "left";
    this.ctx.fillText("VU", vuX, vuY - 5);
  }

  setVisualizationMode(mode) {
    // 预留不同的可视化模式
    this.mode = mode;
  }

  getAverageFrequency() {
    if (!this.dataArray) return 0;
    return (
      this.dataArray.reduce((sum, value) => sum + value, 0) /
      this.dataArray.length
    );
  }
}

export default MusicVisualizer;

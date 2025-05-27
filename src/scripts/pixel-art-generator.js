/**
 * Pixel Art Generator
 * Convert images to retro pixel art with various color palettes
 */

export class PixelArtGenerator {
  constructor() {
    this.canvas = document.getElementById("pixel-art-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.uploadArea = document.getElementById("upload-area");
    this.fileInput = document.getElementById("image-upload");
    this.previewArea = document.getElementById("pixel-art-preview");

    // Settings
    this.pixelSize = 8;
    this.currentImage = null;
    this.originalImageData = null;

    // Color palettes
    this.palettes = {
      gameboy: [
        "#0f380f", // Darkest green
        "#306230", // Dark green
        "#8bac0f", // Light green
        "#9bbc0f", // Lightest green
      ],
      nes: [
        "#000000",
        "#fcfcfc",
        "#f8f8f8",
        "#bcbcbc",
        "#7c7c7c",
        "#a4e4fc",
        "#3cbcfc",
        "#0078f8",
        "#0000fc",
        "#b8b8f8",
        "#6888fc",
        "#0058f8",
        "#0000bc",
        "#d8b8f8",
        "#9878f8",
        "#6844fc",
      ],
      c64: [
        "#000000",
        "#ffffff",
        "#880000",
        "#aaffee",
        "#cc44cc",
        "#00cc55",
        "#0000aa",
        "#eeee77",
        "#dd8855",
        "#664400",
        "#ff7777",
        "#333333",
        "#777777",
        "#aaff66",
        "#0088ff",
        "#bbbbbb",
      ],
      monochrome: [
        "#000000",
        "#333333",
        "#666666",
        "#999999",
        "#cccccc",
        "#ffffff",
      ],
    };

    this.currentPalette = "gameboy";

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.updatePixelSizeDisplay();
    this.previewArea.style.display = "none";
  }

  setupEventListeners() {
    // Upload area click
    this.uploadArea.addEventListener("click", () => {
      this.fileInput.click();
    });

    // Drag and drop
    this.uploadArea.addEventListener("dragover", (e) => {
      e.preventDefault();
      this.uploadArea.classList.add("drag-over");
    });

    this.uploadArea.addEventListener("dragleave", () => {
      this.uploadArea.classList.remove("drag-over");
    });

    this.uploadArea.addEventListener("drop", (e) => {
      e.preventDefault();
      this.uploadArea.classList.remove("drag-over");

      const files = e.dataTransfer.files;
      if (files.length > 0 && files[0].type.startsWith("image/")) {
        this.loadImage(files[0]);
      }
    });

    // File input change
    this.fileInput.addEventListener("change", (e) => {
      if (e.target.files.length > 0) {
        this.loadImage(e.target.files[0]);
      }
    });

    // Controls
    document.getElementById("pixel-size").addEventListener("input", (e) => {
      this.pixelSize = parseInt(e.target.value);
      this.updatePixelSizeDisplay();
      if (this.currentImage) {
        this.applyPixelEffect();
      }
    });

    document.getElementById("color-palette").addEventListener("change", (e) => {
      this.currentPalette = e.target.value;
      if (this.currentImage) {
        this.applyPixelEffect();
      }
    });

    document.getElementById("apply-pixelate").addEventListener("click", () => {
      if (this.currentImage) {
        this.applyPixelEffect();
      }
    });

    document
      .getElementById("download-pixel-art")
      .addEventListener("click", () => {
        this.downloadImage();
      });

    document.getElementById("clear-pixel-art").addEventListener("click", () => {
      this.clearImage();
    });
  }

  updatePixelSizeDisplay() {
    document.getElementById("pixel-size-value").textContent = this.pixelSize;
  }

  loadImage(file) {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        this.currentImage = img;
        this.displayOriginalImage();
        this.applyPixelEffect();
      };
      img.src = e.target.result;
    };

    reader.readAsDataURL(file);
  }

  displayOriginalImage() {
    // Show preview area
    this.previewArea.style.display = "block";
    this.uploadArea.style.display = "none";

    // Set canvas size
    const maxWidth = 600;
    const maxHeight = 400;

    let width = this.currentImage.width;
    let height = this.currentImage.height;

    // Scale down if necessary
    if (width > maxWidth || height > maxHeight) {
      const ratio = Math.min(maxWidth / width, maxHeight / height);
      width *= ratio;
      height *= ratio;
    }

    this.canvas.width = width;
    this.canvas.height = height;

    // Draw original image
    this.ctx.drawImage(this.currentImage, 0, 0, width, height);

    // Store original image data
    this.originalImageData = this.ctx.getImageData(0, 0, width, height);
  }

  applyPixelEffect() {
    if (!this.currentImage) return;

    const width = this.canvas.width;
    const height = this.canvas.height;

    // Clear canvas
    this.ctx.clearRect(0, 0, width, height);

    // Draw original image
    this.ctx.putImageData(this.originalImageData, 0, 0);

    // Get image data
    const imageData = this.ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    // Create pixelated version
    for (let y = 0; y < height; y += this.pixelSize) {
      for (let x = 0; x < width; x += this.pixelSize) {
        // Get average color for this pixel block
        const avgColor = this.getAverageColor(data, x, y, width, height);

        // Find closest color in palette
        const paletteColor = this.getClosestPaletteColor(avgColor);

        // Fill pixel block
        this.ctx.fillStyle = paletteColor;
        this.ctx.fillRect(x, y, this.pixelSize, this.pixelSize);
      }
    }

    // Add pixel grid effect
    this.drawPixelGrid();
  }

  getAverageColor(data, startX, startY, width, height) {
    let r = 0,
      g = 0,
      b = 0;
    let count = 0;

    for (let y = startY; y < startY + this.pixelSize && y < height; y++) {
      for (let x = startX; x < startX + this.pixelSize && x < width; x++) {
        const index = (y * width + x) * 4;
        r += data[index];
        g += data[index + 1];
        b += data[index + 2];
        count++;
      }
    }

    return {
      r: Math.floor(r / count),
      g: Math.floor(g / count),
      b: Math.floor(b / count),
    };
  }

  getClosestPaletteColor(color) {
    const palette = this.palettes[this.currentPalette];
    let closestColor = palette[0];
    let minDistance = Infinity;

    palette.forEach((paletteColor) => {
      const rgb = this.hexToRgb(paletteColor);
      const distance = this.colorDistance(color, rgb);

      if (distance < minDistance) {
        minDistance = distance;
        closestColor = paletteColor;
      }
    });

    return closestColor;
  }

  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  colorDistance(color1, color2) {
    // Simple RGB distance
    const dr = color1.r - color2.r;
    const dg = color1.g - color2.g;
    const db = color1.b - color2.b;
    return Math.sqrt(dr * dr + dg * dg + db * db);
  }

  drawPixelGrid() {
    this.ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
    this.ctx.lineWidth = 1;

    // Vertical lines
    for (let x = 0; x <= this.canvas.width; x += this.pixelSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.canvas.height);
      this.ctx.stroke();
    }

    // Horizontal lines
    for (let y = 0; y <= this.canvas.height; y += this.pixelSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.canvas.width, y);
      this.ctx.stroke();
    }
  }

  downloadImage() {
    if (!this.currentImage) return;

    const link = document.createElement("a");
    link.download = `pixel-art-${Date.now()}.png`;
    link.href = this.canvas.toDataURL();
    link.click();
  }

  clearImage() {
    this.currentImage = null;
    this.originalImageData = null;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.previewArea.style.display = "none";
    this.uploadArea.style.display = "block";
    this.fileInput.value = "";
  }
}

// Add some CSS for drag-over effect
const style = document.createElement("style");
style.textContent = `
  .upload-area.drag-over {
    background: rgba(0, 255, 128, 0.1);
    border-color: #00ff80;
  }
  
  .pixel-art-preview {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
    background: #0a0a0a;
    position: relative;
  }
  
  #pixel-art-canvas {
    max-width: 100%;
    height: auto;
    image-rendering: pixelated;
    image-rendering: -moz-crisp-edges;
    image-rendering: crisp-edges;
  }
`;
document.head.appendChild(style);

// Initialize when DOM is ready
let pixelArtGenerator;

document.addEventListener("DOMContentLoaded", () => {
  pixelArtGenerator = new PixelArtGenerator();
});

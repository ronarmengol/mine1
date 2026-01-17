const canvas = document.getElementById("hero-canvas");
const context = canvas.getContext("2d");

// --- Optimization Strategy ---
// Using 80 frames instead of 240 (Loading every 3rd frame from sequence)
// This reduces initial network payload from ~9MB to ~3MB while preserving fluidity.
const totalFramesAvailable = 240;
const frameStep = 3;
const frameCount = Math.floor(totalFramesAvailable / frameStep);

const currentFrame = (index) => {
  // Map index to the actual filename (e.g., 1 -> 001, 2 -> 004, 3 -> 007)
  const actualIndex = index * frameStep + 1;
  const fileNameIndex = Math.min(totalFramesAvailable, actualIndex);
  return `./sequence/ezgif-frame-${fileNameIndex.toString().padStart(3, "0")}.jpg`;
};

const images = [];
let lastFrameIndex = -1;

// --- Priority Loading ---
// Load the very first frame immediately to prevent blank hero
const firstImage = new Image();
firstImage.src = currentFrame(0);
firstImage.onload = () => {
  images[0] = firstImage;
  render(0);
  // Once the first frame is ready, start loading others in chunks
  startBackgroundLoading();
};

function startBackgroundLoading() {
  // Load remaining frames with a slight stagger to not choke the browser bandwidth
  for (let i = 1; i < frameCount; i++) {
    const img = new Image();
    img.src = currentFrame(i);
    img.onload = () => {
      images[i] = img;
    };
  }
}

function render(index) {
  const img = images[index];
  if (img && img.complete) {
    // Sync canvas size
    const width = window.innerWidth;
    const height = window.innerHeight;

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    // Object-fit: cover implementation
    const imgWidth = 1158;
    const imgHeight = 770;
    const imgRatio = imgWidth / imgHeight;
    const canvasRatio = canvas.width / canvas.height;

    let drawWidth, drawHeight, offsetX, offsetY;

    if (canvasRatio > imgRatio) {
      drawWidth = canvas.width;
      drawHeight = canvas.width / imgRatio;
      offsetX = 0;
      offsetY = (canvas.height - drawHeight) / 2;
    } else {
      drawWidth = canvas.height * imgRatio;
      drawHeight = canvas.height;
      offsetX = (canvas.width - drawWidth) / 2;
      offsetY = 0;
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  }
}

// --- Scroll Logic ---
window.addEventListener("scroll", () => {
  const scrollSection = document.getElementById("hero-scroll");
  if (!scrollSection) return;

  const scrollTop = window.scrollY;
  const maxScrollTop = scrollSection.scrollHeight - window.innerHeight;

  if (scrollTop >= 0 && scrollTop <= maxScrollTop + 100) {
    const scrollFraction = Math.max(0, Math.min(1, scrollTop / maxScrollTop));
    const frameIndex = Math.min(
      frameCount - 1,
      Math.floor(scrollFraction * frameCount),
    );

    if (frameIndex !== lastFrameIndex) {
      lastFrameIndex = frameIndex;
      requestAnimationFrame(() => {
        render(frameIndex);

        // Dynamic content fade for Main Hero Content
        const heroContent = document.querySelector(".hero__content");
        if (heroContent) {
          const opacity = Math.max(0, 1 - scrollFraction * 4);
          heroContent.style.opacity = opacity;
          heroContent.style.transform = `translateY(${-scrollFraction * 50}px)`;
        }

        // Interactive Step Revealers
        updateSteps(scrollFraction);
      });
    }
  }
});

function updateSteps(progress) {
  const step1 = document.querySelector(".hero__step--1");
  const step2 = document.querySelector(".hero__step--2");

  // Step 1: 0.35 to 0.65
  if (step1) {
    let s1Opacity = 0;
    if (progress > 0.35 && progress < 0.65) {
      s1Opacity = 1 - Math.abs(progress - 0.5) * 6.66;
    }
    step1.style.opacity = Math.max(0, s1Opacity);
    step1.style.transform = `translate(-50%, calc(-50% - ${(progress - 0.5) * 100}px))`;
  }

  // Step 2: 0.65 to 0.95
  if (step2) {
    let s2Opacity = 0;
    if (progress > 0.65 && progress < 0.95) {
      s2Opacity = 1 - Math.abs(progress - 0.8) * 6.66;
    }
    step2.style.opacity = Math.max(0, s2Opacity);
    step2.style.transform = `translate(-50%, calc(-50% - ${(progress - 0.8) * 100}px))`;
  }
}

window.addEventListener("resize", () => {
  render(Math.max(0, lastFrameIndex));
});

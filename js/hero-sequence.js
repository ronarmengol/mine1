const canvas = document.getElementById("hero-canvas");
const context = canvas.getContext("2d");

const frameCount = 240;
const currentFrame = (index) =>
  `./sequence/ezgif-frame-${index.toString().padStart(3, "0")}.jpg`;

const images = [];
let imagesLoaded = 0;
let lastFrameIndex = -1;

// Preload images
for (let i = 1; i <= frameCount; i++) {
  const img = new Image();
  img.src = currentFrame(i);
  img.onload = () => {
    imagesLoaded++;
    if (imagesLoaded === 1) {
      render(0);
    }
  };
  images.push(img);
}

function render(index) {
  if (images[index] && images[index].complete) {
    const img = images[index];

    // Canvas sizing to fill screen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Object-fit: cover implementation for canvas
    const imgRatio = 1158 / 770; // Original aspect ratio of the images
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

window.addEventListener("scroll", () => {
  const scrollSection = document.getElementById("hero-scroll");
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
          const opacity = Math.max(0, 1 - scrollFraction * 4); // Fade out faster
          heroContent.style.opacity = opacity;
          heroContent.style.transform = `translateY(${-scrollFraction * 50}px)`;
        }

        // Logic for Interactive Steps
        const step1 = document.querySelector(".hero__step--1");
        const step2 = document.querySelector(".hero__step--2");

        // Step 1: Appears around 50% (0.5)
        // Range: 0.35 to 0.65
        if (step1) {
          let s1Opacity = 0;
          if (scrollFraction > 0.35 && scrollFraction < 0.65) {
            // simple peak curve logic
            s1Opacity = 1 - Math.abs(scrollFraction - 0.5) * 6.66; // 1 at 0.5, 0 at 0.35/0.65
          }
          step1.style.opacity = Math.max(0, s1Opacity);
          step1.style.transform = `translate(-50%, calc(-50% - ${(scrollFraction - 0.5) * 100}px))`;
        }

        // Step 2: Appears around 80% (0.8)
        // Range: 0.65 to 0.95
        if (step2) {
          let s2Opacity = 0;
          if (scrollFraction > 0.65 && scrollFraction < 0.95) {
            s2Opacity = 1 - Math.abs(scrollFraction - 0.8) * 6.66;
          }
          step2.style.opacity = Math.max(0, s2Opacity);
          step2.style.transform = `translate(-50%, calc(-50% - ${(scrollFraction - 0.8) * 100}px))`;
        }
      });
    }
  }
});

window.addEventListener("resize", () => {
  if (lastFrameIndex >= 0) {
    render(lastFrameIndex);
  } else {
    render(0);
  }
});

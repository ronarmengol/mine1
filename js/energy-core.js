document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) {
        console.error('Canvas element #hero-canvas not found!');
        return;
    }
    const container = canvas.parentElement;
    const ctx = canvas.getContext('2d');

    let width, height, centerX, centerY;
    let mouseX = 0, mouseY = 0;
    let currentSpeedMult = 1;
    let pulses = [];

    // Configuration
    const config = {
        coreSize: 30, // Base size of the solid core
        coreGlow: 100, // Extent of the core's glow
        ringCount: 45, // Number of orbital rings
        speedFactor: 0.002, // Base speed of rotation
        maxSpeedMult: 8,    // Maximum speed multiplier when mouse is close
        // Brand Colors
        // Cyan: #06b6d4 -> H: 189, S: 94%, L: 43%
        // Blue: #3b82f6 -> H: 217, S: 91%, L: 60%
        // Purple: #8b5cf6 -> H: 258, S: 90%, L: 66%
        baseHue: 189,
        hueRange: 70, // Range from Cyan to Purple (189 to ~259)
    };

    class Pulse {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.radius = config.coreSize;
            this.alpha = 0.8;
            this.growthRate = 4;
        }

        update() {
            this.radius += this.growthRate;
            this.alpha -= 0.015;
        }

        draw(ctx) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            // Pulse color matches Accent (Cyan)
            ctx.strokeStyle = `rgba(6, 182, 212, ${this.alpha})`;
            ctx.lineWidth = 2;
            ctx.shadowBlur = 10;
            ctx.shadowColor = "#06b6d4";
            ctx.stroke();
            ctx.restore();
        }
    }

    class Orbit {
        constructor() {
            this.init();
        }

        init() {
            // Random radii to create elliptical shapes
            const sizeScale = Math.min(width, height) * 0.4;

            this.radiusX = (Math.random() * 0.8 + 0.2) * sizeScale * 1.5;
            this.radiusY = (Math.random() * 0.3 + 0.1) * sizeScale;

            // Random orientation (tilt)
            this.tilt = Math.random() * Math.PI;
            // Store base speeds so we can multiply them later
            this.baseTiltSpeed = (Math.random() - 0.5) * config.speedFactor;

            // Random rotation of the ellipse itself (wobble)
            this.rotation = Math.random() * Math.PI * 2;
            this.baseRotationSpeed = (Math.random() - 0.5) * config.speedFactor * 0.5;

            // Transparency and line width
            this.opacity = Math.random() * 0.3 + 0.1;
            this.lineWidth = Math.random() * 1.5 + 0.5;

            // Variation in color tone matching brand (Cyan to Purple)
            this.hue = config.baseHue + (Math.random() * config.hueRange);
        }

        update(speedMultiplier) {
            this.tilt += this.baseTiltSpeed * speedMultiplier;
            this.rotation += this.baseRotationSpeed * speedMultiplier;
        }

        draw(ctx) {
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(this.tilt);

            ctx.beginPath();
            ctx.ellipse(0, 0, this.radiusX, this.radiusY, this.rotation, 0, Math.PI * 2);

            // Dynamic opacity based on speed (brighter when faster)
            let dynamicOpacity = this.opacity * (1 + (currentSpeedMult - 1) * 0.1);
            if (dynamicOpacity > 1) dynamicOpacity = 1;

            ctx.strokeStyle = `hsla(${this.hue}, 90%, 70%, ${dynamicOpacity})`;
            ctx.lineWidth = this.lineWidth;

            ctx.shadowBlur = 5;
            ctx.shadowColor = `hsla(${this.hue}, 90%, 70%, 0.5)`;

            ctx.stroke();
            ctx.restore();
        }
    }

    let orbits = [];

    function resize() {
        if (container) {
            width = canvas.width = container.clientWidth;
            height = canvas.height = container.clientHeight;
        } else {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }

        // Prevent 0 dimension issues
        if (width === 0) width = 1;
        if (height === 0) height = 1;

        centerX = width * 0.5;
        centerY = height * 0.5;

        orbits = [];
        for (let i = 0; i < config.ringCount; i++) {
            orbits.push(new Orbit());
        }
    }

    function handleMouseMove(e) {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
    }

    function handleClick(e) {
        // Create a pulse originating from the core
        pulses.push(new Pulse(centerX, centerY));
    }

    function drawCore() {
        ctx.save();
        ctx.translate(centerX, centerY);

        // Core intensity fluctuates slightly with speed
        let flicker = 1 + Math.random() * 0.05 * currentSpeedMult;
        if (!isFinite(flicker) || flicker <= 0) flicker = 1;

        // 1. Large Outer Glow
        let outerRadius = config.coreGlow * 2.5 * flicker;
        if (!isFinite(outerRadius) || outerRadius <= 0) outerRadius = 1;

        const outerGlow = ctx.createRadialGradient(0, 0, 10, 0, 0, outerRadius);
        // Using Accent Color (Cyan) for glow
        outerGlow.addColorStop(0, 'rgba(6, 182, 212, 0.2)');
        outerGlow.addColorStop(0.5, 'rgba(6, 182, 212, 0.05)');
        outerGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = outerGlow;
        ctx.beginPath();
        ctx.arc(0, 0, outerRadius, 0, Math.PI * 2);
        ctx.fill();

        // 2. Medium Glow
        let innerRadius = config.coreGlow * flicker;
        if (!isFinite(innerRadius) || innerRadius <= 0) innerRadius = 1;

        const innerGlow = ctx.createRadialGradient(0, 0, 5, 0, 0, innerRadius);
        innerGlow.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        innerGlow.addColorStop(0.4, 'rgba(59, 130, 246, 0.4)'); // Primary Blue tint
        innerGlow.addColorStop(1, 'rgba(6, 182, 212, 0)'); // Fade to transparent

        ctx.fillStyle = innerGlow;
        ctx.beginPath();
        ctx.arc(0, 0, innerRadius, 0, Math.PI * 2);
        ctx.fill();

        // 3. Solid White Core
        ctx.shadowBlur = 40;
        ctx.shadowColor = "white";
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(0, 0, config.coreSize * 0.6, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        // --- Interaction Logic ---

        // 1. Calculate distance from core to mouse (relative to canvas)
        const dx = mouseX - centerX;
        const dy = mouseY - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Normalize distance based on container size
        let maxDist = Math.max(width, height) / 1.5;
        if (maxDist === 0) maxDist = 1;

        const proximity = Math.max(0, 1 - (dist / maxDist));

        const targetMult = 1 + (config.maxSpeedMult - 1) * (proximity * proximity);

        if (isFinite(targetMult)) {
            currentSpeedMult += (targetMult - currentSpeedMult) * 0.1;
        }

        // 2. Parallax shift
        // Use container center for parallax reference
        const parallaxX = (mouseX - width/2) * 0.02;
        const parallaxY = (mouseY - height/2) * 0.02;

        ctx.save();
        ctx.translate(parallaxX, parallaxY);

        // Use additive blending for bloom
        ctx.globalCompositeOperation = 'lighter';

        orbits.forEach(orbit => {
            orbit.update(currentSpeedMult);
            orbit.draw(ctx);
        });

        // Draw Pulses
        pulses = pulses.filter(p => p.alpha > 0);
        pulses.forEach(p => {
            p.update();
            p.draw(ctx);
        });

        // Reset blend mode for core
        ctx.globalCompositeOperation = 'source-over';
        drawCore();

        ctx.restore();

        requestAnimationFrame(animate);
    }

    // Initialize & Event Listeners
    window.addEventListener('resize', resize);

    // Attach listeners to canvas/container instead of window where possible,
    // but mousemove needs to be tracked relative to canvas even if outside?
    // Actually, usually interaction is better if it tracks mouse over the element.
    // The original code tracked window mousemove. Let's track window mousemove
    // but calculate position relative to canvas.
    window.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
    });

    canvas.addEventListener('click', handleClick);

    // Touch support
    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        mouseX = e.touches[0].clientX - rect.left;
        mouseY = e.touches[0].clientY - rect.top;
    }, {passive: false});

    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        mouseX = e.touches[0].clientX - rect.left;
        mouseY = e.touches[0].clientY - rect.top;
        handleClick(e.touches[0]);
    }, {passive: false});

    resize();
    // Start mouse at center for a calm initial state
    mouseX = centerX;
    mouseY = centerY;

    animate();
});

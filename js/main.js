document.addEventListener('DOMContentLoaded', () => {

    // --- Cursor Effect ---
    const cursorDot = document.querySelector('[data-cursor-dot]');
    const cursorOutline = document.querySelector('[data-cursor-outline]');

    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // Slight delay for outline
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    // --- Intersection Observer for Scroll Animations ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const hiddenElements = document.querySelectorAll('.hidden-content, .hidden-visual, .hidden-card');
    hiddenElements.forEach((el, index) => {
        // Add staggered delay for cards
        if (el.classList.contains('hidden-card')) {
             // Calculate delay based on index within its container to reset delay for each section if needed
             // Simple hack: use inline style or class for stagger, but here we just rely on CSS transitions natural flow
             // or set a variable delay
             el.style.transitionDelay = `${(index % 3) * 0.1}s`;
        }
        observer.observe(el);
    });

    // --- Hero Code Typing Effect (Simple simulation) ---
    // This just adds a blinking cursor class or simple aesthetic
    // The CSS animation handles most, but we could add dynamic typing if needed.
    // For now, the CSS 'float' and 3D transforms handle the visual interest.

    // --- Header Scroll Effect ---
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(10, 10, 12, 0.95)';
            header.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
        } else {
            header.style.background = 'rgba(10, 10, 12, 0.8)';
            header.style.boxShadow = 'none';
        }
    });

});
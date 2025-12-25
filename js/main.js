document.addEventListener("DOMContentLoaded", () => {
  // --- Cursor Effect ---
  const cursorDot = document.querySelector("[data-cursor-dot]");
  const cursorOutline = document.querySelector("[data-cursor-outline]");

  window.addEventListener("mousemove", (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    // Slight delay for outline
    cursorOutline.animate(
      {
        left: `${posX}px`,
        top: `${posY}px`,
      },
      { duration: 500, fill: "forwards" }
    );
  });

  // --- Intersection Observer for Scroll Animations ---
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.15, // Trigger when 15% of the element is visible
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target); // Only animate once
      }
    });
  }, observerOptions);

  const hiddenElements = document.querySelectorAll(
    ".hidden-content, .hidden-visual, .hidden-card"
  );
  hiddenElements.forEach((el, index) => {
    // Add staggered delay for cards
    if (el.classList.contains("hidden-card")) {
      // Calculate delay based on index within its container to reset delay for each section if needed
      // Simple hack: use inline style or class for stagger, but here we just rely on CSS transitions natural flow
      // or set a variable delay
      el.style.transitionDelay = `${(index % 3) * 0.1}s`;
    }
    observer.observe(el);
  });

  // --- 3D Tilt Effect for Cards ---
  class TiltEffect {
    constructor(cards) {
      this.cards = cards;
      this.init();
    }

    init() {
      this.cards.forEach((card) => {
        card.addEventListener("mousemove", (e) => this.handleMove(e, card));
        card.addEventListener("mouseleave", () => this.handleLeave(card));
        card.addEventListener("mouseenter", () => this.handleEnter(card));
      });
    }

    handleMove(e, card) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -10; // Max rotation deg
      const rotateY = ((x - centerX) / centerX) * 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    }

    handleLeave(card) {
      card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)`;
      card.style.transition = "transform 0.5s ease";
    }

    handleEnter(card) {
      card.style.transition = "none";
    }
  }

  const cards = document.querySelectorAll(".card");
  new TiltEffect(cards);

  // --- Typing Text Effect ---
  const typingTextElement = document.getElementById("typing-text");
  if (typingTextElement) {
    const texts = ["Websites & Apps", "Custom Software", "Mobile Solutions", "Digital Growth"];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
      const currentText = texts[textIndex];

      if (isDeleting) {
        typingTextElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 50;
      } else {
        typingTextElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 100;
      }

      if (!isDeleting && charIndex === currentText.length) {
        isDeleting = true;
        typeSpeed = 2000; // Pause at end
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        typeSpeed = 500; // Pause before new word
      }

      setTimeout(type, typeSpeed);
    }

    // Start typing
    setTimeout(type, 1000);
  }

  // --- Blob Parallax ---
  const heroBg = document.querySelector(".hero__bg");
  if(heroBg) {
      window.addEventListener("mousemove", (e) => {
          const moveX = (e.clientX - window.innerWidth / 2) * 0.02;
          const moveY = (e.clientY - window.innerHeight / 2) * 0.02;
          heroBg.style.transform = `translate(${moveX}px, ${moveY}px)`;
      });
  }

  // --- Header Scroll Effect ---
  const header = document.querySelector(".header");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.style.background = "rgba(10, 10, 12, 0.95)";
      header.style.boxShadow = "0 10px 30px rgba(0,0,0,0.5)";
    } else {
      header.style.background = "rgba(10, 10, 12, 0.8)";
      header.style.boxShadow = "none";
    }
  });

  // --- WhatsApp Form Handler ---
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      console.log("Form submitted!");

      // Get form values
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const message = document.getElementById("message").value;

      console.log("Name:", name);
      console.log("Email:", email);
      console.log("Message:", message);

      // Compose WhatsApp message
      const whatsappMessage = `Hi! My name is ${name}.\n\nEmail: ${email}\n\nMessage: ${message}`;

      // Encode the message for URL
      const encodedMessage = encodeURIComponent(whatsappMessage);

      // WhatsApp number (remove leading 0 and add country code)
      const phoneNumber = "260966232544";

      // Create WhatsApp URL
      const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

      console.log("WhatsApp URL:", whatsappURL);

      // Open WhatsApp
      window.open(whatsappURL, "_blank");

      // Optional: Reset form after submission
      contactForm.reset();
    });
  } else {
    console.error("Contact form not found!");
  }
});

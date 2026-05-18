AOS.init({
  duration: 1000,
  easing: "ease-in-out",
  once: true,
  offset: 100,
});

window.addEventListener("load", function () {
  const loading = document.getElementById("loading");
  if (loading) {
    setTimeout(() => {
      loading.classList.add("hidden");
      setTimeout(() => loading.style.display = "none", 500);
    }, 1000);
  }
});

/* =========================================
   Navigation & Menu Mobile
   ========================================= */
(function () {
  const navbar = document.getElementById("navbar");
  const navLinks = document.getElementById("nav-links");
  const mobileMenu = document.getElementById("mobile-menu");
  const navLinkElements = document.querySelectorAll(".nav-link");
  const scrollTopBtn = document.getElementById("scroll-top");

  if (mobileMenu) {
    mobileMenu.addEventListener("click", function () {
      navLinks.classList.toggle("active");
      this.classList.toggle("active");
    });
  }

  navLinkElements.forEach((link) => {
    link.addEventListener("click", function () {
      if (navLinks) navLinks.classList.remove("active");
      if (mobileMenu) mobileMenu.classList.remove("active");
    });
  });

  /* =========================================
     Navbar Effect + Scroll Top visibility
     ========================================= */
  window.addEventListener("scroll", function () {
    if (navbar) {
      navbar.classList.toggle("scrolled", window.scrollY > 100);
    }
    if (scrollTopBtn) {
      scrollTopBtn.classList.toggle("visible", window.scrollY > 500);
    }
  });

  /* =========================================
     Active nav link on scroll
     ========================================= */
  function setActiveNavLink() {
    const sections = document.querySelectorAll("section[id]");
    const scrollPos = window.scrollY + 200;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinkElements.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === "#" + sectionId) {
            link.classList.add("active");
          }
        });
      }
    });
  }

  if (document.querySelector("section[id]")) {
    window.addEventListener("scroll", setActiveNavLink);
  }

  /* =========================================
     Smooth scroll
     ========================================= */
  document.querySelectorAll("a[href^=\"#\"]").forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  /* =========================================
     Mode sombre
     ========================================= */
  const themeToggle = document.getElementById("theme-toggle");
  const body = document.body;

  const currentTheme = localStorage.getItem("theme") || "dark";
  body.setAttribute("data-theme", currentTheme);

  if (themeToggle) {
    themeToggle.innerHTML = currentTheme === "light"
      ? "<i class=\"fas fa-moon\"></i>"
      : "<i class=\"fas fa-sun\"></i>";

    themeToggle.addEventListener("click", function () {
      const current = body.getAttribute("data-theme");
      const next = current === "dark" ? "light" : "dark";
      body.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
      themeToggle.innerHTML = next === "light"
        ? "<i class=\"fas fa-moon\"></i>"
        : "<i class=\"fas fa-sun\"></i>";
    });
  }

  /* =========================================
     Animation Compétences
     ========================================= */
  const skillsSection = document.getElementById("skills");
  if (skillsSection) {
    function animateSkills() {
      document.querySelectorAll(".skill-progress").forEach((bar) => {
        bar.style.width = bar.getAttribute("data-width") + "%";
      });
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateSkills();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(skillsSection);
  }

  /* =========================================
     Bouton Scroll Top
     ========================================= */
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* =========================================
     Formulaire Contact
     FIX : on laisse le POST Formspree se faire normalement.
     L'animation est uniquement cosmétique côté bouton,
     sans bloquer ni simuler l'envoi.
     ========================================= */
  const contactForm = document.querySelector(".contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function () {
      const submitBtn = this.querySelector("button[type=\"submit\"]");
      if (submitBtn) {
        submitBtn.innerHTML = "<i class=\"fas fa-spinner fa-spin\"></i> Envoi en cours...";
        submitBtn.disabled = true;
      }
    });
  }

  /* =========================================
     Effets visuels (Carte)
     ========================================= */
  document.querySelectorAll(".project-card").forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-10px) rotateX(5deg)";
    });
    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) rotateX(0)";
    });
  });

  /* =========================================
     TypeWriter Hero
     FIX : on masque le titre avant de l'écrire
     pour éviter le FOUC.
     ========================================= */
  function typeWriter(element, text, speed) {
    speed = speed || 100;
    element.style.visibility = "hidden";
    let i = 0;
    element.innerHTML = "";

    setTimeout(function startTyping() {
      element.style.visibility = "visible";
      function type() {
        if (i < text.length) {
          element.innerHTML += text.charAt(i);
          i++;
          setTimeout(type, speed);
        }
      }
      type();
    }, 1500);
  }

  window.addEventListener("load", function () {
    const heroTitle = document.querySelector(".hero-title");
    if (heroTitle) {
      typeWriter(heroTitle, "Mathis Vangi", 150);
    }
  });

  /* =========================================
     Animation flottante hero image
     FIX : requestAnimationFrame à la place de setInterval
     ========================================= */
  const heroImage = document.querySelector(".hero-image img");
  if (heroImage) {
    function floatImage() {
      heroImage.style.transform = "translateY(" + (Math.sin(Date.now() * 0.001) * 10) + "px)";
      requestAnimationFrame(floatImage);
    }
    requestAnimationFrame(floatImage);
  }

  /* =========================================
     Swiper
     ========================================= */
  const swiperContainer = document.querySelector(".mySwiper");
  if (swiperContainer) {
    new Swiper(".mySwiper", {
      loop: true,
      pagination: { el: ".swiper-pagination", clickable: true },
      navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
      keyboard: { enabled: true },
      autoplay: { delay: 5000, disableOnInteraction: false },
    });
  }

  /* =========================================
     Filtres Projets
     ========================================= */
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  if (filterBtns.length > 0) {
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        const filterValue = btn.getAttribute("data-filter");

        projectCards.forEach((card) => {
          const category = card.getAttribute("data-category") || "";

          if (filterValue === "all" || category.includes(filterValue)) {
            card.classList.remove("hidden");
            setTimeout(() => {
              card.style.opacity = "1";
              card.style.transform = "scale(1)";
            }, 50);
          } else {
            card.style.opacity = "0";
            card.style.transform = "scale(0.8)";
            setTimeout(() => card.classList.add("hidden"), 300);
          }
        });
      });
    });
  }

  /* =========================================
     Zoom Image (Lightbox)
     ========================================= */
  const lightbox = document.createElement("div");
  lightbox.id = "lightbox";
  lightbox.className = "lightbox";
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.setAttribute("aria-label", "Aperçu de l'image");
  document.body.appendChild(lightbox);

  const projectImages = document.querySelectorAll(".swiper-slide img");

  if (projectImages.length > 0) {
    projectImages.forEach((image) => {
      image.addEventListener("click", (e) => {
        e.stopPropagation();
        lightbox.classList.add("active");

        while (lightbox.firstChild) lightbox.removeChild(lightbox.firstChild);

        const img = document.createElement("img");
        img.src = image.src;
        img.alt = image.alt;
        lightbox.appendChild(img);
      });
    });
  }

  lightbox.addEventListener("click", (e) => {
    if (e.target === e.currentTarget) lightbox.classList.remove("active");
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.classList.contains("active")) {
      lightbox.classList.remove("active");
    }
  });
})();
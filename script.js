/* FIX : AOS protégé — si le CDN échoue ou que la lib n'est pas chargée
   (ex : page Mentions Légales), le reste du script continue de fonctionner. */
if (typeof AOS !== "undefined") {
  AOS.init({
    duration: 1000,
    easing: "ease-in-out",
    once: true,
    offset: 100,
  });
}

/* FIX : respect de la préférence "réduire les animations" */
const prefersReducedMotion =
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

window.addEventListener("load", function () {
  const loading = document.getElementById("loading");
  if (loading) {
    setTimeout(() => {
      loading.classList.add("hidden");
      setTimeout(() => (loading.style.display = "none"), 500);
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

  /* FIX : aria-expanded + aria-label synchronisés avec l'état réel du menu */
  function setMenuState(isOpen) {
    if (!mobileMenu) return;
    mobileMenu.classList.toggle("active", isOpen);
    mobileMenu.setAttribute("aria-expanded", isOpen ? "true" : "false");
    mobileMenu.setAttribute("aria-label", isOpen ? "Fermer le menu" : "Ouvrir le menu");
  }

  if (mobileMenu && navLinks) {
    mobileMenu.addEventListener("click", function () {
      const isOpen = navLinks.classList.toggle("active");
      setMenuState(isOpen);
    });
  }

  navLinkElements.forEach((link) => {
    link.addEventListener("click", function () {
      if (navLinks) navLinks.classList.remove("active");
      setMenuState(false);
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
     FIX : aria-label du bouton synchronisé avec le thème courant
     ========================================= */
  const themeToggle = document.getElementById("theme-toggle");
  const body = document.body;

  const currentTheme = localStorage.getItem("theme") || "dark";
  body.setAttribute("data-theme", currentTheme);

  function applyThemeUI(theme) {
    if (!themeToggle) return;
    // En mode clair, le bouton propose de passer en sombre (et inversement).
    themeToggle.innerHTML =
      theme === "light"
        ? "<i class=\"fas fa-moon\" aria-hidden=\"true\"></i>"
        : "<i class=\"fas fa-sun\" aria-hidden=\"true\"></i>";
    themeToggle.setAttribute(
      "aria-label",
      theme === "light"
        ? "Basculer vers le mode sombre"
        : "Basculer vers le mode clair"
    );
  }

  applyThemeUI(currentTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      const current = body.getAttribute("data-theme");
      const next = current === "dark" ? "light" : "dark";
      body.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
      applyThemeUI(next);
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
     FIX : on masque le titre avant de l'écrire pour éviter le FOUC.
     FIX : on saute l'animation si l'utilisateur préfère réduire les mouvements
     (le <h1> conserve alors son texte statique présent dans le HTML).
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
    if (heroTitle && !prefersReducedMotion) {
      typeWriter(heroTitle, "Mathis Vangi", 150);
    }
  });

  /* =========================================
     Animation flottante hero image
     FIX : requestAnimationFrame à la place de setInterval
     FIX : l'animation est suspendue quand l'image n'est pas visible (économie CPU)
     et désactivée si l'utilisateur préfère réduire les mouvements.
     ========================================= */
  const heroImage = document.querySelector(".hero-image img");
  if (heroImage && !prefersReducedMotion) {
    let floatRAF = null;
    function floatImage() {
      heroImage.style.transform =
        "translateY(" + Math.sin(Date.now() * 0.001) * 10 + "px)";
      floatRAF = requestAnimationFrame(floatImage);
    }

    const floatObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && floatRAF === null) {
          floatRAF = requestAnimationFrame(floatImage);
        } else if (!entry.isIntersecting && floatRAF !== null) {
          cancelAnimationFrame(floatRAF);
          floatRAF = null;
          heroImage.style.transform = "translateY(0)";
        }
      });
    });
    floatObserver.observe(heroImage);
  }

  /* =========================================
     Swiper
     ========================================= */
  const swiperContainer = document.querySelector(".mySwiper");
  if (swiperContainer && typeof Swiper !== "undefined") {
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
     FIX : images de galerie focusables + activables au clavier (Entrée / Espace),
     gestion du focus (ouverture sur la modale, restitution à la fermeture).
     ========================================= */
  const lightbox = document.createElement("div");
  lightbox.id = "lightbox";
  lightbox.className = "lightbox";
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.setAttribute("aria-label", "Aperçu de l'image");
  lightbox.setAttribute("tabindex", "-1");
  document.body.appendChild(lightbox);

  let lastFocusedBeforeLightbox = null;

  function openLightbox(image) {
    lastFocusedBeforeLightbox = document.activeElement;
    lightbox.classList.add("active");
    while (lightbox.firstChild) lightbox.removeChild(lightbox.firstChild);
    const img = document.createElement("img");
    img.src = image.src;
    img.alt = image.alt;
    lightbox.appendChild(img);
    lightbox.focus();
  }

  function closeLightbox() {
    if (!lightbox.classList.contains("active")) return;
    lightbox.classList.remove("active");
    if (
      lastFocusedBeforeLightbox &&
      typeof lastFocusedBeforeLightbox.focus === "function"
    ) {
      lastFocusedBeforeLightbox.focus();
    }
  }

  const projectImages = document.querySelectorAll(".swiper-slide img");
  projectImages.forEach((image) => {
    image.setAttribute("tabindex", "0");
    image.setAttribute("role", "button");
    if (!image.getAttribute("aria-label")) {
      image.setAttribute(
        "aria-label",
        "Agrandir l'image" + (image.alt ? " : " + image.alt : "")
      );
    }
    image.addEventListener("click", (e) => {
      e.stopPropagation();
      openLightbox(image);
    });
    image.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLightbox(image);
      }
    });
  });

  lightbox.addEventListener("click", (e) => {
    if (e.target === e.currentTarget) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });

  /* =========================================
     Déobfuscation Email (centralisée)
     FIX : logique déplacée ici depuis les scripts inline d'index.html
     et mention-legal.html (source unique, exécutée sur toutes les pages).
     ========================================= */
  document.querySelectorAll(".obfuscated-email").forEach(function (el) {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      const email = this.dataset.user + "@" + this.dataset.domain;
      if (this.tagName === "A" && this.querySelector("i")) {
        window.location.href = "mailto:" + email;
      } else {
        this.href = "mailto:" + email;
        this.textContent = email;
      }
    });
  });
})();

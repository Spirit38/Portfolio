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
      setTimeout(() => loading.style.display = 'none', 500); 
    }, 1000);
  }
});

/* =========================================
  Navigation & Menu Mobile
   ========================================= */
const navbar = document.getElementById("navbar");
const navLinks = document.getElementById("nav-links");
const mobileMenu = document.getElementById("mobile-menu");
const navLinkElements = document.querySelectorAll(".nav-link");

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
   Navbar Effect
   ========================================= */
window.addEventListener("scroll", function () {
  if (navbar) {
    if (window.scrollY > 100) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }
  // Affichage bouton retour haut
  const scrollTopBtn = document.getElementById("scroll-top");
  if (scrollTopBtn) {
    if (window.scrollY > 500) {
      scrollTopBtn.classList.add("visible");
    } else {
      scrollTopBtn.classList.remove("visible");
    }
  }
});

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
        if (link.getAttribute("href") === `#${sectionId}`) {
          link.classList.add("active");
        }
      });
    }
  });
}
if (document.querySelector("section[id]")) {
  window.addEventListener("scroll", setActiveNavLink);
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const targetId = this.getAttribute("href");
    if (targetId === "#") return; // Ignore les liens vides
    
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
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
  if (currentTheme === "light") {
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
  }

  themeToggle.addEventListener("click", function () {
    const currentTheme = body.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    body.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);

    if (newTheme === "light") {
      themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    } else {
      themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
  });
}

/* =========================================
   Animation Compétences
   ========================================= */
const skillsSection = document.getElementById("skills");
if (skillsSection) {
  function animateSkills() {
    const skillBars = document.querySelectorAll(".skill-progress");
    skillBars.forEach((bar) => {
      const width = bar.getAttribute("data-width");
      bar.style.width = width + "%";
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
    { threshold: 0.5 }
  );

  observer.observe(skillsSection);
}

/* =========================================
   Bouton Top
   ========================================= */
const scrollTopBtn = document.getElementById("scroll-top");
if (scrollTopBtn) {
  scrollTopBtn.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

/* =========================================
   Formulaire Contact
   ========================================= */
const contactForm = document.querySelector(".contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    // e.preventDefault(); // Décommentez si vous voulez gérer l'envoi en AJAX
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    submitBtn.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
    submitBtn.disabled = true;

    // Simulation d'envoi (à retirer si le formulaire envoie vraiment la page)
    setTimeout(() => {
      submitBtn.innerHTML = '<i class="fas fa-check"></i> Message envoyé !';
      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }, 2000);
    }, 1000);
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

function typeWriter(element, text, speed = 100) {
  let i = 0;
  element.innerHTML = "";
  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  type();
}

window.addEventListener("load", function () {
  setTimeout(() => {
    const heroTitle = document.querySelector(".hero-title");
    if (heroTitle) {
      typeWriter(heroTitle, "Mathis Vangi", 150);
    }
  }, 1500);
});

const heroImage = document.querySelector(".hero-image img");
if (heroImage) {
  setInterval(() => {
    heroImage.style.transform = `translateY(${
      Math.sin(Date.now() * 0.001) * 10
    }px)`;
  }, 16);
}

window.addEventListener("scroll", function () {
  const scrolled = window.pageYOffset;
  const parallaxElements = document.querySelectorAll(".hero::before");
  if (parallaxElements.length > 0) {
    parallaxElements.forEach((element) => {
      const speed = 0.5;
      element.style.transform = `translateY(${scrolled * speed}px)`;
    });
  }
});

/* =========================================
  Swiper (Photo)
   ========================================= */
const swiperContainer = document.querySelector('.mySwiper');
if (swiperContainer) {
    const swiper = new Swiper('.mySwiper', {
      loop: true,
      pagination: { el: '.swiper-pagination', clickable: true },
      navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
      keyboard: { enabled: true },
      autoplay: { delay: 5000, disableOnInteraction: false },
    });
}


/* =========================================
   Filtres Projets (Animée)
   ========================================= */
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category') || "";

                if (filterValue === 'all' || category.includes(filterValue)) {
                    card.classList.remove('hidden');
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.classList.add('hidden');
                    }, 300);
                }
            });
        });
    });
}

/* =========================================
   Zoom Image Projet
   ========================================= */

const lightbox = document.createElement('div');
lightbox.id = 'lightbox';
lightbox.className = 'lightbox';
document.body.appendChild(lightbox);

const projectImages = document.querySelectorAll('.swiper-slide img');

if (projectImages.length > 0) {
    projectImages.forEach(image => {
        image.addEventListener('click', e => {
            e.stopPropagation(); 
            
            lightbox.classList.add('active');
            
            const img = document.createElement('img');
            img.src = image.src;
            
            while (lightbox.firstChild) {
                lightbox.removeChild(lightbox.firstChild);
            }
            
            lightbox.appendChild(img);
        });
    });
}

lightbox.addEventListener('click', e => {
    if (e.target === e.currentTarget) {
        lightbox.classList.remove('active');
    }
});

document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        lightbox.classList.remove('active');
    }
});
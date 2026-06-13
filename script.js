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
      // Les ancres-commandes du terminal sont gérées par le module terminal
      if (this.classList.contains("term-cmd")) return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        // FIX a11y : preventDefault() annule le déplacement natif du focus ;
        // on le déplace donc manuellement vers la cible (sinon le skip-link et
        // les ancres internes sont inopérants au clavier — WCAG 2.4.1).
        if (!target.hasAttribute("tabindex")) {
          target.setAttribute("tabindex", "-1");
        }
        target.focus({ preventScroll: true });
      }
    });
  });

  /* =========================================
     Mode sombre
     FIX : aria-label du bouton synchronisé avec le thème courant
     ========================================= */
  const themeToggle = document.getElementById("theme-toggle");
  // FIX : thème porté par <html> (documentElement), cohérent avec le script
  // anti-FOUC du <head> qui le pose avant le rendu.
  const root = document.documentElement;

  // FIX : accès localStorage protégé (mode privé / stockage bloqué peut lever
  // une exception qui casserait tout l'IIFE).
  let currentTheme = "dark";
  try { currentTheme = localStorage.getItem("theme") || "dark"; } catch (e) {}
  root.setAttribute("data-theme", currentTheme);

  function applyThemeUI(theme) {
    // FIX : la barre d'UI du navigateur mobile suit le thème (sinon reste sombre en clair)
    const themeColorMeta = document.querySelector("meta[name=\"theme-color\"]");
    if (themeColorMeta) {
      themeColorMeta.setAttribute("content", theme === "light" ? "#ffffff" : "#0b0e14");
    }
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
      const current = root.getAttribute("data-theme");
      const next = current === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
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

  /* Les micro-gadgets (hover rotateX des cartes, typeWriter du titre, flottement
     du portrait en sinus) ont été retirés au profit d'une identité « terminal »
     plus sobre : le <h1> est statique et le hero accueille la fenêtre mathish. */

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
    // FIX : currentSrc => sert le WebP réellement chargé via <picture> (sinon repli PNG)
    img.src = image.currentSrc || image.src;
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
      const email = this.dataset.user + "@" + this.dataset.domain;

      // Vérifie si le lien a déjà été transformé
      if (!this.href.startsWith("mailto:")) {
        e.preventDefault(); // On bloque uniquement le "#" initial
        
        // On met à jour le vrai lien
        this.href = "mailto:" + email; 

        // Si c'est le lien texte, on révèle l'email
        if (!this.querySelector("i")) {
          this.textContent = email;
        }

        // On déclenche l'ouverture de la messagerie
        window.location.href = this.href; 
      }
      // Si l'attribut href commence DÉJÀ par "mailto:", 
      // on ne fait rien et on laisse le navigateur ouvrir l'application mail tout seul au prochain clic.
    });
  });

  /* =========================================================================
     Terminal « mathish » — couche interactive du hero (scopée à l'accueil).
     Le contenu canonique reste dans <main> ; le terminal ne fait que l'afficher
     et proposer la navigation. Aucune dépendance externe.
     ========================================================================= */
  (function initTerminal() {
    const terminal = document.getElementById("terminal");
    if (!terminal) return;
    const input = document.getElementById("term-input");
    const logEl = document.getElementById("term-log");
    if (!input || !logEl) return;

    const PROMPT = "mathis@grenoble:~$";

    function esc(s) {
      return String(s).replace(/[&<>"']/g, function (c) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
      });
    }

    function link(href, label) {
      return '<a href="' + href + '">' + label + "</a>";
    }

    function extlink(href, label) {
      return '<a href="' + href + '" target="_blank" rel="noopener noreferrer">' + label + "</a>";
    }

    function scrollToSection(id) {
      const target = document.getElementById(id);
      if (!target) return;
      target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    }

    const PROJECTS = {
      minigolf: {
        title: "Mini-Golf de Crolles — appli en production",
        href: "project-minigolf.html",
        body:
          "PWA de gestion de scores (stage pro, déployée en production).\n" +
          "  • React/TypeScript · Supabase/PostgreSQL · 5 Edge Functions (Deno)\n" +
          "  • sécurité : RLS sur toutes les tables · autorité serveur · audit &amp; durcissement JWT · RGPD\n" +
          "  • déploiement : domaine · DNS (SPF/DKIM) · en-têtes HSTS/CSP"
      },
      smartcity: {
        title: "SmartCity Infra",
        href: "project-smartcity.html",
        body:
          "Architecture réseau L3 sécurisée & haute disponibilité (projet universitaire).\n" +
          "  • 7 VLANs cloisonnés · cluster VRRP/Keepalived (bascule &lt; 2 s)\n" +
          "  • pare-feu nftables stateful (default drop) · DMZ + reverse proxy Nginx/SSL\n" +
          "  • DNS BIND9 · DHCP Kea · supervision Zabbix · SIEM Wazuh\n" +
          "  essayez : <span class=\"term-out-cyan\">ip a</span>, <span class=\"term-out-cyan\">systemctl status</span>, <span class=\"term-out-cyan\">failover --test</span>"
      },
      aidevous: {
        title: "Aide&amp;Vous — 2ᵉ Prix Meilleur Prototype",
        href: "project-aidevous.html",
        body:
          "Plateforme web sécurisée pour aidants familiaux (médaille d'argent).\n" +
          "  • PHP natif (MVC fait maison) · PostgreSQL · OCR Python (Tesseract)\n" +
          "  • sécurité : AES-256 · Argon2 · protections CSRF/XSS · déploiement Debian\n" +
          "  • travail d'équipe · méthode Agile · contexte RGPD"
      },
      gelpp: {
        title: "GELPP",
        href: "project-gelpp.html",
        body:
          "Application Java/JavaFX de gestion d'événements en copropriété.\n" +
          "  • IHM JavaFX · modélisation UML (Visual Paradigm)\n" +
          "  • équipe de 4-5 · Git · méthodes agiles"
      },
      "site-institutionnel": {
        title: "Site Web Institutionnel",
        href: "project1.html",
        body:
          "Site HTML/CSS/JS sobre & écoresponsable pour la génération Alpha.\n" +
          "  • éco-conception · RGPD · accessibilité\n" +
          "  • (ce portfolio applique les mêmes principes)"
      }
    };
    const PROJECT_ALIASES = { site: "site-institutionnel" };

    const COMMANDS = {
      help: function () {
        return {
          out:
            "Commandes disponibles :\n" +
            "  <span class=\"term-out-cyan\">whoami</span>            qui suis-je\n" +
            "  <span class=\"term-out-cyan\">ls projets</span>        liste des projets\n" +
            "  <span class=\"term-out-cyan\">cat projets/&lt;nom&gt;</span> détail d'un projet\n" +
            "  <span class=\"term-out-cyan\">skills</span>            compétences techniques\n" +
            "  <span class=\"term-out-cyan\">parcours</span>          formation &amp; distinctions\n" +
            "  <span class=\"term-out-cyan\">ip a</span>              interfaces réseau (SmartCity)\n" +
            "  <span class=\"term-out-cyan\">systemctl status</span>  services supervisés (SmartCity)\n" +
            "  <span class=\"term-out-cyan\">failover --test</span>   démo de bascule VRRP\n" +
            "  <span class=\"term-out-cyan\">contact</span>           me contacter\n" +
            "  <span class=\"term-out-green\">sudo hire-me</span>      pourquoi me recruter en alternance\n" +
            "  <span class=\"term-out-cyan\">theme</span>             basculer le thème clair/sombre\n" +
            "  <span class=\"term-out-cyan\">clear</span>             effacer le terminal\n" +
            "<span class=\"term-dim\">↑/↓ historique · Tab autocomplétion</span>"
        };
      },
      whoami: function () {
        return {
          section: "about",
          out:
            "mathis — étudiant en BUT2 Informatique (parcours « déploiement d'applications communicantes et sécurisées »).\n" +
            "Profil hybride : j'aime autant écrire du code que configurer des serveurs.\n" +
            link("#about", "→ voir « À propos »")
        };
      },
      ls: function () {
        return {
          section: "projects",
          out:
            "<span class=\"term-out-cyan\">minigolf/</span>   <span class=\"term-out-cyan\">smartcity/</span>   <span class=\"term-out-cyan\">aidevous/</span>   <span class=\"term-out-cyan\">gelpp/</span>   <span class=\"term-out-cyan\">site-institutionnel/</span>\n" +
            "<span class=\"term-dim\">→ « cat projets/&lt;nom&gt; » pour le détail</span>"
        };
      },
      cat: function (args) {
        const arg = (args[0] || "").toLowerCase();
        if (arg === "about.txt" || arg === "about") return COMMANDS.whoami();
        if (arg === "contact.vcf" || arg === "contact") return COMMANDS.contact();
        const m = arg.match(/^projets\/(.+)$/);
        if (m) {
          const key = PROJECT_ALIASES[m[1]] || m[1];
          const p = PROJECTS[key];
          if (p) {
            return {
              section: "projects",
              out:
                "<span class=\"term-out-strong\">" + p.title + "</span>\n" + p.body + "\n" +
                link(p.href, "→ ouvrir la page détaillée")
            };
          }
          return { out: "<span class=\"term-out-red\">cat: projets/" + esc(m[1]) + ": fichier introuvable</span>\n<span class=\"term-dim\">essayez « ls projets »</span>" };
        }
        return { out: "<span class=\"term-out-red\">cat: " + esc(arg || "?") + ": fichier introuvable</span>" };
      },
      skills: function () {
        return {
          section: "skills",
          out:
            "<span class=\"term-out-strong\">Langages</span>     Java · C/C++ · HTML/CSS (avancé) · PHP · SQL · Python\n" +
            "<span class=\"term-out-strong\">Réseaux/Sys</span>  admin Linux/Debian · réseaux · sécurité &amp; SIEM · virtualisation &amp; HA\n" +
            "<span class=\"term-out-strong\">Outils</span>       Git · Proxmox · Nginx · Keepalived · nftables · Zabbix · Wazuh\n" +
            link("#skills", "→ voir « Compétences »")
        };
      },
      parcours: function () {
        return {
          section: "timeline",
          out:
            "2024–2027  BUT Informatique — IUT2 UGA (parcours B)\n" +
            "2026       Stage développeur — Mini-golf indoor, Crolles\n" +
            "2025–2026  <span class=\"term-out-amber\">2ᵉ Prix Meilleur Prototype</span> (Aide&amp;Vous)\n" +
            "2024       Certification PIX\n" +
            "2021–2024  Bac STI2D option SIN — Vaucanson, Grenoble\n" +
            link("#timeline", "→ voir « Parcours »")
        };
      },
      contact: function () {
        return {
          section: "contact",
          out:
            "Email     <span class=\"term-dim\">cliquez « Me contacter » (anti-spam)</span>\n" +
            "LinkedIn  " + extlink("https://www.linkedin.com/in/mathis-vangi", "mathis-vangi") + "\n" +
            "GitHub    " + extlink("https://github.com/Spirit38", "Spirit38") + "\n" +
            "Lieu      Grenoble, France\n" +
            link("#contact", "→ voir « Contact »")
        };
      },
      ip: function (args) {
        const a = (args[0] || "");
        if (a !== "a" && a !== "addr") return { out: "<span class=\"term-dim\">usage : ip a</span>" };
        const rows = [
          ["eth0.10", "10", "Admin", "10.10.0.1/24"],
          ["eth0.20", "20", "Serveurs", "10.20.0.1/24"],
          ["eth0.30", "30", "IoT", "10.30.0.1/24"],
          ["eth0.40", "40", "Utilisateurs", "10.40.0.1/24"],
          ["eth0.50", "50", "DMZ", "10.50.0.1/24"],
          ["eth0.60", "60", "Supervision", "10.60.0.1/24"],
          ["eth0.99", "99", "Management", "10.99.0.1/24"]
        ];
        let t = "<table class=\"term-table\"><caption class=\"sr-only\">Interfaces VLAN du réseau SmartCity</caption><thead><tr><th>interface</th><th>VLAN</th><th>rôle</th><th>adresse</th></tr></thead><tbody>";
        rows.forEach(function (r) {
          t += "<tr><td class=\"term-out-cyan\">" + r[0] + "</td><td>" + r[1] + "</td><td>" + r[2] + "</td><td>" + r[3] + "</td></tr>";
        });
        t += "</tbody></table>";
        return {
          out:
            "7 interfaces VLAN — cloisonnement du réseau SmartCity :\n" + t +
            "<span class=\"term-dim\">VIP VRRP gérée par keepalived (bascule &lt; 2 s). Représentation d'un projet universitaire.</span>\n" +
            link("project-smartcity.html", "→ détails du projet SmartCity")
        };
      },
      systemctl: function () {
        const services = [
          ["bind9.service", "DNS interne"],
          ["kea-dhcp4.service", "DHCP dynamique"],
          ["nginx.service", "reverse proxy / DMZ"],
          ["keepalived.service", "haute dispo (VRRP)"],
          ["zabbix-server.service", "supervision"],
          ["wazuh-manager.service", "SIEM / détection d'intrusion"]
        ];
        let t = "<table class=\"term-table\"><caption class=\"sr-only\">Services supervisés du projet SmartCity</caption><tbody>";
        services.forEach(function (s) {
          t += "<tr><td class=\"term-out-strong\">" + s[0] + "</td><td class=\"term-out-green\">● active (running)</td><td class=\"term-dim\">" + s[1] + "</td></tr>";
        });
        t += "</tbody></table>";
        return { out: "État des services (projet SmartCity) :\n" + t + link("project-smartcity.html", "→ détails du projet SmartCity") };
      },
      failover: function () { return { animate: true }; },
      clear: function () { logEl.innerHTML = ""; return { silent: true }; },
      sudo: function (args) {
        const rest = args.join(" ").toLowerCase();
        if (rest === "hire-me" || rest === "hireme") {
          return {
            section: "contact",
            out:
              "<span class=\"term-dim\">[sudo] mot de passe pour mathis : ********</span>\n" +
              "<span class=\"term-out-green\">Accès accordé.</span> Poste idéal :\n" +
              "  type         = <span class=\"term-out-cyan\">alternance</span>\n" +
              "  domaine      = administration systèmes / réseaux / cybersécurité\n" +
              "  localisation = Grenoble (ou environs)\n" +
              "  dispo        = 2026\n" +
              "  motivation   = élevée <span class=\"term-out-green\">✓</span>\n" +
              link("#contact", "→ Discutons-en : « Me contacter »")
          };
        }
        return { out: "<span class=\"term-out-red\">mathis is not in the sudoers file. This incident will be reported.</span>" };
      },
      theme: function () {
        const btn = document.getElementById("theme-toggle");
        if (btn) btn.click();
        return { out: "<span class=\"term-dim\">thème basculé.</span>" };
      }
    };
    COMMANDS["?"] = COMMANDS.help;
    COMMANDS.about = COMMANDS.whoami;
    COMMANDS.cls = COMMANDS.clear;

    const COMPLETIONS = [
      "help", "whoami", "ls projets", "cat projets/", "skills", "parcours",
      "ip a", "systemctl status", "failover --test", "contact", "sudo hire-me", "theme", "clear"
    ];

    function appendEntry(cmdText, outHtml) {
      const entry = document.createElement("div");
      entry.className = "term-entry";
      const cmdLine = document.createElement("div");
      cmdLine.className = "term-entry-cmd";
      cmdLine.innerHTML = '<span class="term-prompt-inline" aria-hidden="true">' + PROMPT + "</span> " + esc(cmdText);
      entry.appendChild(cmdLine);
      if (outHtml != null) {
        const outEl = document.createElement("div");
        outEl.className = "term-entry-out";
        outEl.innerHTML = outHtml;
        entry.appendChild(outEl);
      }
      logEl.appendChild(entry);
      logEl.scrollTop = logEl.scrollHeight;
      return entry;
    }

    function runFailover(entry) {
      const outEl = document.createElement("div");
      outEl.className = "term-entry-out";
      entry.appendChild(outEl);
      const steps = [
        "[*] test de bascule VRRP…",
        "[*] MASTER rtr-01 : <span class=\"term-out-red\">DOWN</span> (simulé)",
        "[*] élection VRRP… le BACKUP rtr-02 reprend la VIP",
        "<span class=\"term-out-green\">[✓] failover terminé en 1.8 s — service maintenu</span>"
      ];
      if (prefersReducedMotion) {
        outEl.innerHTML = steps.join("\n");
        logEl.scrollTop = logEl.scrollHeight;
        return;
      }
      let i = 0;
      (function next() {
        // si l'utilisateur a fait « clear » entre-temps, on arrête (noeud détaché)
        if (i >= steps.length || !logEl.contains(outEl)) return;
        outEl.innerHTML += (i ? "\n" : "") + steps[i];
        logEl.scrollTop = logEl.scrollHeight;
        i++;
        setTimeout(next, 600);
      })();
    }

    function execute(raw, opts) {
      opts = opts || {};
      const text = String(raw).trim();
      if (!text) return;
      const parts = text.replace(/\s+/g, " ").split(" ");
      const name = parts[0].toLowerCase();
      const args = parts.slice(1);
      const fn = COMMANDS[name];
      if (!fn) {
        appendEntry(text, "<span class=\"term-out-red\">commande introuvable : " + esc(name) + "</span>\n<span class=\"term-dim\">tapez « help » pour la liste</span>");
        return;
      }
      const res = fn(args) || {};
      if (res.silent) return;
      if (res.animate) { runFailover(appendEntry(text, null)); return; }
      appendEntry(text, res.out);
      if (res.section && opts.scroll) scrollToSection(res.section);
    }

    const history = [];
    let histIndex = 0;

    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        const val = input.value;
        if (val.trim()) { history.push(val); histIndex = history.length; }
        execute(val, { scroll: false });
        input.value = "";
      } else if (e.key === "ArrowUp") {
        if (!history.length) return;
        e.preventDefault();
        histIndex = Math.max(0, histIndex - 1);
        input.value = history[histIndex] || "";
      } else if (e.key === "ArrowDown") {
        if (!history.length) return;
        e.preventDefault();
        histIndex = Math.min(history.length, histIndex + 1);
        input.value = history[histIndex] || "";
      } else if (e.key === "Tab") {
        const val = input.value.trim().toLowerCase();
        if (!val) return; // Tab reste échappable (WCAG 2.1.2)
        const matches = COMPLETIONS.filter(function (c) { return c.indexOf(val) === 0; });
        if (matches.length === 1) {
          e.preventDefault();
          input.value = matches[0];
        } else if (matches.length > 1) {
          e.preventDefault();
          appendEntry(input.value, "<span class=\"term-dim\">" + matches.join("   ") + "</span>");
        }
      }
    });

    // Suggestions cliquables (ancres réelles → fallback no-JS conservé)
    terminal.querySelectorAll(".term-cmd").forEach(function (el) {
      el.addEventListener("click", function (e) {
        const cmd = el.getAttribute("data-cmd");
        if (!cmd) return;
        e.preventDefault();
        execute(cmd, { scroll: true });
      });
    });
  })();
})();

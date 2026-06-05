# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Personal portfolio website for Mathis Vangi (BUT Informatique student). Plain **static HTML5 / CSS3 / vanilla JavaScript** — no build step, no package manager, no test suite, no framework. Content is in **French**.

Live site: https://spirit38.github.io/Portfolio/ — deployed via **GitHub Pages** from the `main` branch. Pushing to `main` is the deploy.

## Running locally

Open `index.html` directly in a browser, or serve the folder statically (e.g. `python -m http.server`). A static server is preferred because the pages reference relative assets and the contact form / CDN scripts behave more predictably over HTTP. There is nothing to build, lint, or test.

## Structure

- `index.html` — the single-page main site (hero, about, timeline, skills, projects, contact). All section anchors (`#home`, `#about`, `#timeline`, `#skills`, `#projects`, `#contact`) live here.
- `project-*.html` — standalone project detail pages (`project-aidevous`, `project-gelpp`, `project-smartcity`) plus the older `project1.html`. Their navbars link back into `index.html` via `index.html#section`.
- `mention-legal.html` — legal notice page.
- `css/style.css` — the **single** stylesheet for every page (~1200 lines).
- `script.js` — the **single** JS file for every page.
- `assets/` — images, icons, and the downloadable CV PDF.

## Architecture notes

**One shared CSS + JS across all pages.** `style.css` and `script.js` are included by every HTML file. `script.js` runs as a single IIFE and is written defensively — every feature is guarded by an `if (element)` existence check, so the same script works on pages that lack certain elements (e.g. Swiper init only fires when `.mySwiper` exists, project filters only when `.filter-btn` exists). When adding interactivity, follow this pattern: query the element, guard it, then bind — never assume an element is present.

**Theming.** Light/dark is driven by a `data-theme` attribute on `<body>`, with all colors defined as CSS custom properties under `:root` (dark) and `[data-theme="light"]` in `style.css`. The choice is persisted in `localStorage` under the key `theme` (default `"dark"`) and toggled by the `#theme-toggle` button in `script.js`. Add new colors as CSS variables in both blocks rather than hardcoding.

**Project filtering.** On `index.html`, `.filter-btn[data-filter]` buttons show/hide `.project-card[data-category]` cards. Filter values in use: `all`, `html`, `java`, `network`, `php`. A card matches when its `data-category` contains the filter value, so a card can belong to multiple categories via a space-separated `data-category`.

**External libraries are loaded from CDNs** (no local copies, no bundling):
- Google Fonts (Montserrat), Font Awesome 6.4.0, AOS 2.3.4 — on all pages.
- Swiper 11 — **only on project detail pages** (image carousels). `script.js` initializes `.mySwiper` if present.
- The contact form on `index.html` posts to **Formspree** (`action="https://formspree.io/f/myzelkkz"`); `script.js` only adds a cosmetic "sending" state and does not intercept the POST.

**Email obfuscation.** Email addresses use `.obfuscated-email` elements with `data-user` / `data-domain` attributes, assembled into a `mailto:` only on click via an inline script at the bottom of `index.html`.

## Conventions

- Code comments and UI text are in French; keep that consistent.
- Inline `FIX:` comments mark deliberate fixes (FOUC/FOIT avoidance, accessibility, performance) — preserve their intent when editing nearby code.
- Accessibility is maintained explicitly: `aria-label`, `aria-expanded`, `aria-controls`, `role` attributes. Keep these in sync when changing markup.

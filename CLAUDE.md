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

**Theming.** Light/dark is driven by a `data-theme` attribute on **`<html>`** (`document.documentElement`), with all colors defined as CSS custom properties under `:root` (dark) and `[data-theme="light"]` in `style.css`. The choice is persisted in `localStorage` under the key `theme` (default `"dark"`) and toggled by the `#theme-toggle` button in `script.js`. A tiny **anti-FOUC inline script** in each page's `<head>` applies the stored theme (and adds an `html.js` class for progressive enhancement) before first paint — guard `localStorage` access with `try/catch` everywhere. The palette is a terminal-flavored ANSI set; the `--term-*` variables describe the **always-dark terminal** and must stay dark in both themes. Add new colors as CSS variables in both `:root` and `[data-theme="light"]` rather than hardcoding.

**Project filtering.** On `index.html`, `.filter-btn[data-filter]` buttons show/hide `.project-card[data-category]` cards. Filter values in use: `all`, `html`, `java`, `network`, `php`. A card matches when its `data-category` contains the filter value, so a card can belong to multiple categories via a space-separated `data-category`.

**External libraries are loaded from CDNs** (no local copies, no bundling):
- Google Fonts (Montserrat), Font Awesome 6.4.0, AOS 2.3.4 — on all pages.
- Swiper 11 — **only on project detail pages** (image carousels). `script.js` initializes `.mySwiper` if present.
- The contact form on `index.html` posts to **Formspree** (`action="https://formspree.io/f/myzelkkz"`); `script.js` only adds a cosmetic "sending" state and does not intercept the POST.

**Email obfuscation.** Email addresses use `.obfuscated-email` elements with `data-user` / `data-domain` attributes, assembled into a `mailto:` only on click. The handler is centralized in `script.js` (runs on every page).

**`mathish` terminal (home only).** The `index.html` hero is a terminal window (`#terminal`) that drives the page. It is a **progressive-enhancement layer, not the only access**: the real content lives in the semantic `<main>` sections, the suggestion chips are **real `<a>` anchors** (`.term-cmd` with `data-cmd`) that navigate without JS, and the typing input (`#term-input` / `.term-prompt-line`) is hidden unless `html.js` is set (and on mobile it stays hidden — reading mode). The command engine lives in an `initTerminal()` IIFE in `script.js`, gated by `if (#terminal)`. Commands are a flat registry returning `{ out, section?, animate?, silent? }`; user input is **HTML-escaped** (`esc()`) before being echoed. All terminal classes use the **`term-` prefix** (never reuse them elsewhere — `style.css`/`script.js` are shared by all pages). The global smooth-scroll handler skips `.term-cmd`. The `ip a` / `systemctl status` outputs are static representations of the SmartCity project — keep their figures accurate (7 VLANs, VRRP &lt; 2 s, etc.).

## Conventions

- Code comments and UI text are in French; keep that consistent.
- Inline `FIX:` comments mark deliberate fixes (FOUC/FOIT avoidance, accessibility, performance) — preserve their intent when editing nearby code.
- Accessibility is maintained explicitly: `aria-label`, `aria-expanded`, `aria-controls`, `role` attributes. Keep these in sync when changing markup.

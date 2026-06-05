# Plan de refonte — Portfolio original de Mathis Vangi

> Issu d'un panel de conception multi-agents (6 concepts originaux → jury recruteur / DA / faisabilité → synthèse → revue adversariale → plan final).

## Classement des 6 concepts évalués

| Rang | Concept | Score | Pitch |
|------|---------|-------|-------|
| 🥇 1 | **mathish — le portfolio qui se pilote au shell** | 56.1 | `$ whoami` → un profil hybride dev + sysadmin, exploré comme une vraie session Unix (ou à la souris, au choix). |
| 2 | SENTINEL — Centre d'Opérations de Sécurité | 55.5 | Auditer le profil comme on supervise une infra (bandeau dispo, KPI, projets = incidents résolus). |
| 3 | Spécimen — le portfolio comme fiche technique | 54.5 | Dev & Infra, une grille, deux disciplines, zéro bruit. |
| 4 | mathisOS — boote comme un système | 53.0 | Une distribution Linux personnelle bootée dans le navigateur. |
| 5 | NetMap — topologie réseau vivante | 52.8 | Le portfolio EST une carte d'infrastructure. |
| 6 | Traceroute — parcours d'un profil hybride | 52.3 | Du Bac STI2D à l'alternance, paquet par paquet. |

Le concept retenu **greffe** les meilleures idées des suivants (bandeau dispo + palette sémantique de SENTINEL ; matrice DEV|INFRA + suppression des % arbitraires de Spécimen).

---

# Plan d'action FINAL — Portfolio Mathis Vangi
## Concept retenu : **mathish — le portfolio qui se pilote au shell**

> Document prêt à suivre. Structure en 9 parties, intégrant les corrections bloquantes de la revue, tempérant la sur-ingénierie, et préservant le concept ORIGINAL — mais réaliste et lisible par un recruteur. Deux sections nouvelles closent le document : **Garde-fous & pièges à éviter** et **Premiers pas (jour 1)**.

---

## 1. Concept retenu

**mathish** — le portfolio comme session de travail Unix.

**Pitch (2 phrases).** Le site est un émulateur de terminal nommé `mathish` (Mathis + shell) posé **par-dessus** un portfolio HTML classique : on pilote la carrière de Mathis avec de vraies commandes (`whoami`, `ls projets/`, `cat projets/smartcity.md`, `sudo hire-me`) exactement comme lui pilote ses serveurs. C'est la seule métaphore qui raconte simultanément ses **deux identités** — le DEV (manipuler du texte/du code) et le SYSADMIN (interroger un système, lire des logs, vérifier des services).

**Pourquoi lui.** Le terminal n'est pas un déguisement : le contenu réel de Mathis *se prête littéralement* à la métaphore (SmartCity → `ip a`/`systemctl status`, le 2e prix → un fichier de distinction, l'objectif alternance → `sudo hire-me`). Inimitable car ancré dans SES projets. Architecture en **paliers indépendamment livrables** : même si le shell interactif n'arrive jamais, le palier 1 (refonte ANSI + MOTD + dettes corrigées) est déjà un site présentable et différenciant.

**Pourquoi pas les autres pistes (1 ligne chacune) :**
- **SENTINEL (SOC)** : superbe, mais le vocabulaire « incident/sévérité » risque d'être mal lu par un RH non technique → on **greffe** ses meilleures idées (bandeau dispo, KPI, palette sémantique, script anti-FOUC).
- **Spécimen (fiche technique)** : excellente rigueur éditoriale mais moins « hybride » → on **greffe** la matrice DEV|INFRA, l'encart métriques, la suppression des % arbitraires.
- **mathisOS (boot d'un OS)** : très proche, mais le « window manager » est lourd/risqué en a11y pour peu de gain.
- **NetMap (topologie réseau)** : le SVG interactif est le poste de risque le plus élevé pour un BUT2 sur quelques semaines.
- **Traceroute (scrollytelling)** : beau mais raconte le *parcours* plus que la *dualité* ; sticky fragile en a11y/mobile.

---

## 2. Parti pris visuel

Esthétique **« dotfiles soignés »** : la station de travail d'un ingénieur rigoureux, **pas** un gadget rétro-CRT. On bannit scanlines, glitch permanent, pluie de glyphes Matrix. Le « wow » vient de la **justesse de la simulation** (sorties plausibles, vraies données) et de la **fluidité**, jamais du bruit visuel.

**Palette ANSI sémantiquement justifiée** (remplace le dégradé indigo/cyan décoratif actuel — enfin une *raison d'être* aux couleurs). À déclarer en variables CSS dans `:root` ET `[data-theme="light"]`.

**Mode sombre « console » :**
| Rôle | Hex | Usage |
|---|---|---|
| Fond terminal | `#0B0E14` | body (presque noir, teinte bleu nuit) |
| Surface fenêtre | `#11151F` | chrome de la fenêtre terminal, cartes |
| Texte principal | `#C9D1D9` | corps |
| Vert prompt/OK | `#3FB950` | prompt, `active (running)`, succès |
| Cyan | `#39C5CF` | commandes, liens (héritier du cyan actuel) |
| Ambre/warning | `#E3B341` | warnings |
| Argent (distinction) | `#C0C0C0` | ruban 2e prix (conservé tel quel) |
| Rouge doux | `#F85149` | `command not found`, bouton fermer |
| Indigo liseré | `#6E7BE6` | liseré discret (continuité identité) |

**Mode clair OBLIGATOIRE et soigné — « Solarized Light »-like** : fond `#FBF7EC`, texte `#3B4252`, accents désaturés.

> **⚠️ CORRECTION BLOQUANTE — bug thème clair.** En `[data-theme="light"]` (style.css l.29-32), `--text-mobile`, `--text-nav2` et `--text-nav` valent `#ffffff`. **Précision** : ces variables servent le texte de la **navbar** et du **menu mobile**, PAS le corps de page — l'invisibilité peut donc être **partielle** selon le fond réel de la navbar en clair. **Ne pas affirmer « blanc sur blanc invisible » sans vérifier le rendu réel.** Fix : leur donner des valeurs sombres (réutiliser `--text-primary` `#1a202c`, ou `#3B4252`) ; **contrôler visuellement** navbar + menu mobile en clair après correction.

> **⚠️ CORRECTION BLOQUANTE — vert en thème clair.** Le vert `#3FB950` sur fond `#FBF7EC` **tombe sous le seuil de contraste AA pour du texte fin**. Ajouter une variable dédiée `--ansi-green` dans `[data-theme="light"]` avec un **vert foncé testé AA**, ex. **`#1A7F37`**.

**Typographie.**
- **Monospace de qualité** (JetBrains Mono *ou* IBM Plex Mono, via Google Fonts `display=swap`) pour TOUT le terminal, commandes, sorties, labels « machine ».
- Fallback système solide : `ui-monospace, 'SF Mono', 'Cascadia Code', Consolas, monospace`.
- **Décision à trancher tôt (anti sur-ingénierie)** : si la prose des fiches projet est confortable en mono, **supprimer Montserrat** = −1 requête CDN. Sinon, la **garder uniquement** pour les longs paragraphes. Ne pas charger deux polices « par défaut ».
- Hiérarchie par **taille/poids/couleur ANSI**, pas par changement de police.

**Curseur-bloc clignotant** ; sous `prefers-reduced-motion` → curseur fixe (mécanisme `prefersReducedMotion` déjà présent dans script.js).

**Ce qui le démarque du site actuel** : couleurs porteuses de sens, mono comme signature, chrome de fenêtre terminal, MOTD en hero au lieu du `typeWriter` + image flottante, suppression des micro-gadgets (cartes `rotateX`).

---

## 3. Architecture de l'information & navigation

**Règle non négociable :** *le terminal est une COUCHE, pas l'accès.* Tout le contenu canonique vit dans un `<main>` HTML sémantique. Les commandes **révèlent** (retrait de `hidden`) + `scrollIntoView` vers du DOM **qui existe déjà** — elles ne génèrent jamais le contenu. Garantit SEO + no-JS + a11y.

> **⚠️ DÉCISION EXPLICITE — comportement par défaut au 1er chargement.** C'est le seul vrai risque « faire fuir un recruteur ». Décision actée pour **tous les écrans** :
> - **Desktop** : MOTD + ligne de statut + fenêtre terminal **visibles en haut**, MAIS le contenu sémantique reste **immédiatement lisible en scrollant en dessous**. **Jamais** un terminal plein écran qui masque tout.
> - **Mobile** : **mode lecture PAR DÉFAUT** (un clavier qui pousse un terminal est pénible). Bouton discret « Ouvrir le terminal ».

**Faux système de fichiers — version REVUE (anti sur-ingénierie).**
- **Socle (Phases 0-1-2) :** un **objet plat** `commande → { sortie, sectionId }` couvre 80 % du besoin. Source unique du mapping commande→section.
- **Bonus (Phase 4) :** SI ET SEULEMENT SI `tree` + `cat chemin/relatif` + autocomplétion de chemins sont réalisés, on promeut l'objet plat en arborescence. **Sinon, le FS arborescent ne doit pas être codé.**
- `/var/log/activite` : **supprimé** (gadget de complétude).

Arborescence de référence (cible bonus uniquement) :
```
/home/mathis/
  about.txt   contact.vcf   cv.pdf
  projets/  smartcity.md  aidevous.md  gelpp.md  site-institutionnel.md
  competences/  langages  reseaux-systemes  outils
/etc/  motd  parcours.log  distinctions
```

**Écran d'accueil = MOTD** (login Unix). Ligne de statut **visible AVANT toute interaction** (test des 30 s) :
> `Étudiant BUT2 — Recherche ALTERNANCE 2026 sysadmin/réseaux/sécu — Grenoble — Dispo : voir uptime`

> **⚠️ SEO/A11Y — bannière ASCII & H1.** La bannière ASCII `MATHIS VANGI` est illisible au lecteur d'écran. **Ne pas faire du H1 de l'ASCII.** Garantir un **`<h1>Mathis Vangi</h1>` textuel réel** + marquer l'art ASCII décoratif **`aria-hidden="true"`**. La ligne de statut doit être du **texte HTML statique** dans le hero — jamais un effet de frappe JS (sinon aperçu Google/OG vide).

puis 3 commandes suggérées **cliquables**.

**Mapping commande → section :**
| Commande | Cible |
|---|---|
| `whoami` / `cat about.txt` | À propos |
| `ls projets` + `cat projets/<nom>.md` | Projets |
| `skills` / `cat competences/*` | Compétences |
| `parcours` / `cat /etc/parcours.log` | Timeline |
| `ip a` / `systemctl status` | Vitrine SmartCity |
| `failover --test` | Démo VRRP (bonus) |
| `contact` / `cat contact.vcf` | Contact |
| `sudo hire-me` | CTA alternance → Contact + CV |
| `help` / `?` | Aide & plan du site |

> `man <cmd>` et `tree` sont **rétrogradés en bonus strict**, voire supprimés.

**Trois voies d'accès au MÊME contenu :**
1. **Terminal** (curieux/tech) : on tape, historique ↑/↓, `clear`, autocomplétion.
2. **Clic** (recruteur pressé) : commandes du MOTD/`help` = vrais `<button>` → cliquer « exécute » sans taper. **Navbar classique toujours présente** + menu raccourcis (≡).
3. **Lecture / sans-JS** : bouton **« Mode lecture / Mode terminal »** très visible ; sans JS, le `<main>` sémantique s'affiche normalement.

**Aide ultra-visible** : texte statique près du champ — « *tapez `help` ou cliquez une commande* ».

**Mobile :** mode lecture par défaut ; terminal optionnel avec **rangée de boutons-commandes tactiles** ; Échap ferme les overlays, focus piégé proprement, skip-link « Aller au contenu ».

---

## 4. Inventaire de contenu (mapping réel)

| Contenu réel | Nouvelle forme |
|---|---|
| **Profil hybride** (« écrire du code » / « configurer des serveurs », « mains dans le cambouis ») | `whoami` (court) / `cat about.txt` (3 paragraphes) — repris quasi mot pour mot |
| **Aide&Vous — 2e Prix** : PHP MVC natif, PostgreSQL, OCR Tesseract Python, AES-256, Argon2, CSRF/XSS, Debian, Agile/RGPD | `cat projets/aidevous.md` + **encart `security:`** + ruban argent conservé |
| **SmartCity Infra** : 7 VLANs, VRRP/Keepalived bascule <2s, nftables stateful default-drop, DMZ + reverse proxy Nginx/SSL, BIND9, Kea, Zabbix, Wazuh SIEM (criticité 10), Proxmox | `cat projets/smartcity.md` + **`ip a`** (VLANs=interfaces) + **`systemctl status`** + **`failover --test`** (bonus) |
| **GELPP** : Java/JavaFX, gestion d'événements copropriété, UML Visual Paradigm, équipe 4-5, Git, agile | `cat projets/gelpp.md` + lien + GitHub |
| **Site institutionnel** : HTML/CSS/JS sobre, écoresponsable, génération Alpha, éco-conception, RGPD, a11y | `cat projets/site-institutionnel.md` (« ce portfolio applique les mêmes principes ») |
| **Parcours STI2D→BUT** : Bac STI2D SIN (Vaucanson 2021-24), BUT Info IUT2 UGA parcours B (2024-27), Stage Mini-golf Crolles (avr-juin 2026), 2e Prix, PIX | `cat /etc/parcours.log` = **journal horodaté** |
| **Compétences** : Java/C++/HTML-CSS avancé, PHP/SQL interm., Python ; admin Linux, réseaux, sécu/SIEM, virtu/HA ; outils | `skills` ; **barres remplacées par niveaux en mots** (Avancé/Intermédiaire) — greffe Spécimen |
| **Dispo alternance** | Ligne MOTD en clair + `uptime` + `sudo hire-me`. **⚠️ Aligner le statut** : « Recherche stage/alternance » → « **Recherche ALTERNANCE 2026** » |
| **Contact** : email obfusqué (`mathis.vangi`), LinkedIn `mathis-vangi`, GitHub `Spirit38`, CV PDF, Formspree, Grenoble | `cat contact.vcf` / `sudo hire-me` → réutilise déobfuscation `.obfuscated-email` + Formspree |
| **Distinctions** | 2e Prix dès le MOTD + dans aidevous.md, ruban argent réutilisé |

---

## 5. Fonctionnalités signature (l'effet « waouh »)

### 5.1 — Le shell interactif (`whoami`, `ls`, `cat`, `sudo hire-me`)
**Pièce maîtresse.** Champ type terminal avec prompt `mathis@grenoble:~$`, curseur-bloc, historique ↑/↓, parseur maison. Chaque commande imprime une sortie plausible PUIS révèle/scrolle vers la section DOM. `command not found` → erreur amicale (« did you mean help? »).

**Périmètre du parseur (anti scope creep — explicite).** Split d'espaces naïf, **SANS quoting, SANS pipes, SANS redirections.** Toute extension est hors scope socle.

**Autocomplétion — périmètre par paliers :**
- **Socle :** autocomplétion **sur les NOMS DE COMMANDES uniquement** (trivial).
- **Bonus (Phase 4) :** autocomplétion sur les **chemins du FS** (chronophage).

> **⚠️ A11Y — Tab non piégeant (WCAG 2.1.2).** Si Tab déclenche l'autocomplétion, il doit rester **échappable** (ex. ne compléter QUE si la ligne est non vide). Jamais de piège clavier.

**Approche technique.** ~200-300 lignes de JS vanilla, **dans le même IIFE défensif** que script.js (pattern query → guard `if(el)` → bind). S'initialise **seulement si `#terminal` existe** → pages projet/mentions inchangées. **Zéro dépendance, aucune lib terminal → aucun nouveau hash SRI.**

> **Anti sur-ingénierie :** **persistance `localStorage` de l'historique = SUPPRIMÉE**. L'historique reste **en mémoire de session**. (Les clés `theme` et la nouvelle `viewmode` restent en `localStorage`.)

**Fallback a11y / sans-JS.** Vrai `<form>` + `<input>` labellisé (label `.sr-only`). Sans JS : formulaire inerte, `<main>` complet affiché. Toute commande **doublée par un bouton/lien cliquable**.

> **⚠️ A11Y — `aria-live` ciblé.** Ne PAS router les sorties ASCII décoratives (bannière, `ip a`, `systemctl`) en `aria-live` brut → cela **spamme** les lecteurs d'écran. Règle : **art ASCII en `aria-hidden="true"`** + annonce d'un **message court** dans la live-region (ex. « 7 interfaces affichées, voir section SmartCity »). Après chaque commande, déplacer le focus sur le titre de la section révélée (`tabindex="-1"`).

### 5.2 — `ip a` + `systemctl status` : vitrine SmartCity « vivante » (bonus)
`ip a` affiche les **7 VLANs comme interfaces** ; `systemctl status` liste les services réels (`bind9`, `kea-dhcp`, `nginx`, `keepalived`, `zabbix-server`, `wazuh-manager`) en vert **`active (running)`**.

**Approche technique.** Sorties **pré-écrites en HTML statique** (pas de fausse simulation temps réel), stylées ANSI via classes CSS. **Honnêteté technique assumée** : l'aide précise « représentation d'un projet universitaire, pas un serveur live ».

**Fallback.** Mêmes données en `<table>` sémantique + liste de services avec badge « running » **écrit en toutes lettres** (couleur jamais seul vecteur, contraste AA). Lien direct vers project-smartcity.html.

> **⚠️ VÉRACITÉ TECHNIQUE — tâche bloquante chiffrée.** Pour CE profil, une sortie système **fausse est PIRE que pas de sortie** : un sysadmin qui repère un format `ip a`/`systemctl status`/séquence VRRP/syntaxe nftables non plausible transforme la signature en handicap. → **Relecture technique = tâche dédiée ≥ 1 ½j, bloquante AVANT mise en ligne.** N'utiliser que des **chiffres réels** (VRRP <2s, 7 VLANs, default-drop, AES-256, Argon2).

### 5.3 — `failover --test` (bonus coupable) + `sudo hire-me` (CTA)
**`failover --test`** : animation textuelle scriptée — « MASTER (rtr-01) DOWN… VIP reprise par BACKUP (rtr-02)… failover en 1.8 s ✓ ». **Bonus coupable** : 2e poste de risque (timing, reduced-motion, fallback). **Ne jamais prioriser avant le socle.** Sous `prefers-reduced-motion` OU sans-JS : **résultat final affiché d'emblée**.

**`sudo hire-me`** (commande-signature) : affiche une « fiche de poste idéale » (type=alternance, domaine=sysadmin/réseaux/sécu, loc=Grenoble, dispo=2026) puis ouvre les actions de contact. **Mappe sur la section Contact existante**.

**Easter eggs : plafonnés à 1-2 max.** `sudo` seul → « *mathis is not in the sudoers file. This incident will be reported.* ». **Fallback** : 100 % du contact est dans `<main>`.

---

## 6. Stack & structure de fichiers

**100 % statique, zéro backend, GitHub Pages depuis `main`.** Aucun build, aucun framework, aucun package manager — on respecte CLAUDE.md.

**On RÉUTILISE tel quel :**
- Architecture **un seul `css/style.css` + un seul `script.js`** partagés ; IIFE défensive query→guard→bind.
- Theming `data-theme` + variables CSS + `localStorage` (clé `theme` + nouvelle clé `viewmode`).
- `prefersReducedMotion`, IntersectionObserver skills, filtres projets, **lightbox accessible**, **déobfuscation email**.
- **SRI/integrity** sur Font Awesome, AOS, Swiper ; **OG/Twitter/JSON-LD Person**, `canonical`, `sitemap.xml`, `robots.txt`.
- Pages `project-*.html` **gardées autonomes** = seules URL canoniques indexables.

> **⚠️ NON-RÉGRESSION ABSOLUE.** `style.css`/`script.js` sont **partagés par les `project-*.html` et `mention-legal.html`** — une régression casse 5 pages d'un coup. Impératifs : **préfixer toutes les nouvelles classes** terminal, **scoper le terminal à la home** (`if(#terminal)`), **garder la garde `if(element)`** avant chaque bind.

**Ce qu'on AJOUTE :**
- Police mono via Google Fonts `display=swap` + fallback système.
- Variables CSS ANSI (`--term-bg`, `--ansi-green`, `--ansi-cyan`, `--ansi-amber`, `--ansi-red`…) dans `:root` ET `[data-theme="light"]` — **avec `--ansi-green` foncé dédié au clair (`#1A7F37`)**.
- Module terminal dans le même IIFE (init conditionnel `if(#terminal)`).
- Objet `commands` (source unique ; objet plat en socle).
- Classe `.sr-only`, skip-link, `:focus-visible` global.

**Ce qu'on REFAIT :**
- Hero index.html → MOTD + fenêtre terminal (+ `<h1>` textuel, ASCII `aria-hidden`).
- Light theme : corriger `--text-nav`/`--text-nav2`/`--text-mobile` — **après vérif du rendu réel**.
- Retirer micro-gadgets : cartes `rotateX`, image hero flottante en `sin` → micro-interactions sobres.
- **Indicateur de focus** (cf. correction ci-dessous).

> **⚠️ CORRECTION — `outline:none`.** Il est **compensé par un `box-shadow` focus**, donc PAS un focus totalement invisible — mais le ring `rgba(79,70,229,0.1)` est **très faible** et peut échouer au contraste (WCAG 2.4.11/2.4.13). Action : **remplacer par `:focus-visible` avec un `outline` réellement visible (≥ 2px, contraste AA)**.

- **Optionnel recommandé (greffe perf) :** retirer AOS au profit de transitions CSS + IntersectionObserver déjà codé → −1 dépendance CDN + −1 hash SRI.

**Structure de fichiers finale :**
```
index.html            # MOTD + terminal + <main> sémantique (sections préservées)
project-*.html        # inchangées (autonomes, canoniques)
mention-legal.html    # inchangée
css/style.css         # + variables ANSI, chrome terminal, .sr-only, fix light theme, :focus-visible
script.js             # + module terminal (commands, parseur) dans l'IIFE
assets/               # + images WebP
sitemap.xml, robots.txt
```

> **Documentation :** noter dans CLAUDE.md la nouvelle clé `localStorage` **`viewmode`** et le **préfixe de classes terminal**.

---

## 7. Accessibilité / SEO / performance / mobile (dès le départ)

**Le contenu existe dans le HTML, pas via JS** → SEO + no-JS + a11y garantis par construction.

**Accessibilité (WCAG AA) :**
- Terminal jamais seul chemin : navbar + menu raccourcis + boutons-commandes + mode lecture/no-JS.
- `<input>` shell labellisé (`.sr-only`), **`aria-live` ciblé** (résumé court, ASCII en `aria-hidden`), focus déplacé sur le titre de section (`tabindex="-1"`).
- **Couleur ANSI jamais unique vecteur** : `running`/`error`/`warning` en toutes lettres. Contrastes vérifiés sombre ET clair (vert clair `#1A7F37`).
- `prefers-reduced-motion` : curseur fixe, pas de frappe animée, `failover`/`systemctl` en statique.
- **Tab échappable** (pas de piège clavier).
- **Zoom 200 % / reflow (WCAG 1.4.10) :** le terminal mono à largeur fixe **déborde à 320px et à fort zoom** → prévoir **`overflow-wrap`/`white-space` maîtrisé ou scroll-x contenu**.
- **Plomberie à créer en premier** : skip-link, `.sr-only`, `:focus-visible` global, indicateur de focus visible, focus-trap réutilisable (lightbox + overlays terminal).

**SEO :** `<h1>` textuel réel + ligne de statut en **texte HTML statique** ; titres/OG/JSON-LD mis à jour (mots-clés recruteur : alternance, administrateur systèmes/réseaux, cybersécurité, Grenoble). Micro-script anti-FOUC du thème **inline dans le `<head>`, minimal (3-4 lignes)**.

**Performance (AVANT la couche visuelle) :** convertir/redimensionner en **WebP** les PNG lourds : `project1.png` (**~3,5 Mo**), `aidevous_landing.png` (**~1,5 Mo**), `photo2.png` (**~920 Ko**, LCP), `zabbix.png` (**~788 Ko**). Conserver `loading="lazy"` + dimensions explicites. `fetchpriority="high"` sur `photo2`. **Passe groupée** : convertir aussi les secondaires (`aidevous_dashboard` ~336 Ko, `schema_reseau` ~167 Ko, `wazuh` ~175 Ko). **Cible : Lighthouse vert sur les 4 axes.**

**Mobile :** mode lecture par défaut ; terminal optionnel avec boutons tactiles ; soigner le layout du champ de saisie.

---

## 8. Plan de réalisation par phases (estimation en demi-journées · ½j)

> Chaque palier est **indépendamment shippable**. **Livrable cible = socle Phases 0+1+2.** Phases 3-4 = **bonus réellement coupables.**

### Phase 0 — Fondations & dettes (≈ 3 ½j) — *à faire en premier*
- Convertir les gros PNG (+ secondaires) en WebP + redimensionner ; `fetchpriority` photo2. (1 ½j)
- Corriger le bug light theme nav/mobile **après vérif du rendu réel** ; ajouter `.sr-only`, skip-link, `:focus-visible`, **remplacer `outline:none` par un focus visible ≥2px AA**. (1 ½j)
- Aligner le statut « Recherche ALTERNANCE 2026 » + script anti-FOUC thème inline minimal. (½j)

### Phase 1 — Refonte visuelle + MOTD (≈ 5 ½j) — *déjà un site présentable*
- Variables ANSI dans les 2 blocs de thème + mode clair Solarized + **`--ansi-green` foncé clair**. (1 ½j)
- Police mono (swap + fallback) ; décision Montserrat (garder/couper). (1 ½j)
- Chrome de fenêtre terminal en CSS + curseur-bloc + **reflow/zoom 200 % maîtrisé**. (1 ½j)
- **MOTD statique** (`<h1>` textuel + ASCII `aria-hidden` + ligne dispo/objectif + 3 commandes cliquables) ; bouton « Mode terminal / Mode lecture » ; **comportement par défaut desktop = contenu lisible sous le terminal**. (1 ½j)

### Phase 2 — Moteur de commandes (≈ 7 ½j) — *le cœur*
- Objet plat `commande → {sortie, sectionId}` (PAS de FS arborescent). (1 ½j)
- Parseur (split naïf) + mini-routeur + `revealSection()` + `scrollIntoView`. (2 ½j)
- `whoami`, `ls`, `cat`, `help`, `clear`, `contact`, `skills`, `parcours`. (2 ½j)
- **Boutons-commandes cliquables** (parité souris) dans MOTD/`help` + aide statique visible. (1 ½j)

### Phase 3 — Autocomplétion (commandes), historique, a11y, CTA (≈ 7 ½j) *(bonus coupable)*
- Autocomplétion **sur noms de commandes** + historique ↑/↓ (en mémoire, **pas** localStorage). (1 ½j)
- **`sudo hire-me`** mappé sur Contact (réutilise déobfuscation + Formspree). (1 ½j)
- **Polish a11y RÉ-ESTIMÉ** : `aria-live` ciblé, focus géré, focus-trap, Échap, Tab échappable — **tester tôt clavier seul + NVDA**. (**3 ½j** : c'est là que 90 % des terminaux web échouent NVDA.)
- `man <cmd>` / `tree` : **optionnels stricts**, à coder seulement si temps. (1 ½j)

### Phase 4 — Bonus (≈ 8 ½j) — *strictement optionnels*
- **Relecture technique (VÉRACITÉ) — tâche BLOQUANTE chiffrée** : `ip a`, `systemctl status`, séquence VRRP, syntaxe nftables vérifiés avant toute mise en ligne. (**1 ½j dédiée**)
- `ip a` / `systemctl status` stylés ANSI (+ fallback `<table>`). (2 ½j)
- Autocomplétion **chemins FS** (promotion objet plat → arborescence SI réalisée). (2 ½j)
- Animation `failover --test` + bouton « Rejouer la démo » + fallback statique. (2 ½j)
- Version tactile mobile, 1-2 easter eggs, tests Lighthouse/NVDA/clavier. (½j)

**Ordre conseillé :** 0 → 1 → 2 → 3 → 4. On déploie après **chaque** phase.

**Total réaliste :** ~**38-40 ½j** si Phases 3-4 incluses. **Socle présentable (0+1+2) ≈ 16 ½j**, crédible pour l'échéance stage avr-juin 2026.

---

## 9. Pièges à éviter

1. **Le gadget qui masque l'info.** → MOTD avec qui/quoi/dispo/objectif en clair, commandes doublées en boutons, navbar permanente, mode lecture en un clic, contenu lisible sous le terminal au 1er chargement desktop.
2. **A11y fragile.** → « Le shell est une couche, pas l'accès » + `aria-live` **ciblé** + focus géré + parité clic/clavier/no-JS. **Tester tôt** clavier seul ET NVDA.
3. **Mobile frustrant.** → Mode lecture par défaut sur petit écran.
4. **Scope creep.** → Objet plat (pas de FS), parseur naïf, autocomplétion commandes seules en socle ; `ip a`/`failover`/chemins/easter eggs = bonus *coupables*.
5. **Fausse impression de serveur live.** → Assumer « projets universitaires » dans l'aide.
6. **Inexactitude technique fatale.** → Relecture technique bloquante chiffrée (≥1 ½j) ; uniquement des chiffres réels.
7. **Perte de SEO.** → Évité par construction (HTML canonique, `<h1>` textuel, statut statique).
8. **Régression sur pages partagées.** → Préfixer classes, scoper `if(#terminal)`, garder `if(element)`.
9. **Crédibilité des compétences.** → Supprimer « 100% Motivation » et les barres de % arbitraires → niveaux en mots (greffe Spécimen).

---

## ✅ Garde-fous & pièges à éviter (consolidé depuis la revue)

**Périmètre & temps (le risque n°1 du projet pour un BUT2) :**
- **Livrable cible = Phases 0+1+2 (~16 ½j).** Phases 3-4 = bonus coupables. Total réaliste 38-40 ½j si tout est fait.
- **Conserver impérativement « chaque palier shippable ».**
- **Anti sur-ingénierie à acter :** objet plat (PAS de FS arborescent en socle) ; `tree`/`man <cmd>`/`/var/log/activite` = bonus ou suppression ; **persistance localStorage de l'historique supprimée** ; autocomplétion chemins = bonus, **commandes seules en socle** ; `failover --test` jamais avant le socle ; easter eggs plafonnés à 1-2 ; **ne pas charger 2 polices par défaut**.

**Corrections bloquantes :**
- **Light theme nav/mobile :** valeurs sombres, MAIS **vérifier le rendu réel**.
- **`outline:none` :** remplacer par **`:focus-visible` + outline visible ≥2px AA**.
- **Vert thème clair :** variable `--ansi-green` dédiée **`#1A7F37`** dans `[data-theme="light"]`.
- **H1 / bannière ASCII :** `<h1>` textuel réel + ASCII `aria-hidden`.
- **`aria-live` :** ASCII en `aria-hidden` + **annonce d'un résumé court**.
- **Tab échappable** (WCAG 2.1.2).
- **Reflow / zoom 200 % (WCAG 1.4.10) :** wrap ou scroll-x maîtrisé.
- **Statut :** « Recherche stage/alternance » → « **Recherche ALTERNANCE 2026** ».
- **VÉRACITÉ TECHNIQUE :** relecture `ip a`/`systemctl`/VRRP/nftables = **tâche dédiée ≥1 ½j, bloquante avant mise en ligne**.

**Non-régression (impératif absolu) :** préfixer classes terminal, `if(#terminal)` à l'init, garde `if(element)` avant chaque bind. Documenter `viewmode` + préfixe dans CLAUDE.md.

---

## 🚀 Premiers pas (jour 1)

**Objectif : zéro fonctionnalité terminal, on solde les dettes et on sécurise le terrain — chaque item est déployable seul.**

1. **Brancher proprement.** Créer une branche de travail depuis `main`. Vérifier que `git status` est clean.
2. **Lire CLAUDE.md** et relever les conventions (CSS/JS uniques, variables dans les 2 blocs de thème, garde `if(element)`, SRI).
3. **Quick win statut (½h) :** corriger le statut → « Recherche ALTERNANCE 2026 ». Commit.
4. **Fix light theme nav/mobile :** ouvrir le site en **mode clair**, **constater le rendu réel** navbar/menu mobile, puis corriger `--text-nav`/`--text-nav2`/`--text-mobile` avec une valeur sombre. Re-vérifier clair ET sombre. Commit.
5. **Indicateur de focus :** remplacer `outline:none` par un `:focus-visible` global avec outline ≥2px AA. Tester **au clavier seul** (Tab). Commit.
6. **Plomberie a11y de base :** ajouter `.sr-only` et un skip-link « Aller au contenu ». Commit.
7. **Passe WebP :** convertir/redimensionner `project1.png`, `aidevous_landing.png`, `photo2.png`, `zabbix.png` (+ secondaires) ; `fetchpriority="high"` à photo2 ; garder dimensions + `loading="lazy"`. **Lighthouse avant/après**. Commit.
8. **Déployer & vérifier en prod (GitHub Pages) :** pousser, confirmer le site intact en **clair + sombre + mobile** et les 5 pages sans régression.

> À la fin du jour 1, le site doit déjà être **plus propre, plus rapide et plus accessible** qu'avant — sans une seule ligne de terminal. C'est le filet de sécurité qui rend tout le reste « bonus ».

---

> **Note sur les références de ligne** : les numéros de ligne cités dans ce document sont indicatifs et peuvent avoir légèrement bougé après les correctifs de l'audit précédent. Vérifie toujours le contenu réel avant d'éditer.

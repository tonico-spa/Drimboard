# drim — Design Brief

This document is a design brief for **drim**, a robotics-kit platform built by Duolab. Use it to understand the existing design language, the structure of each page, and the interaction patterns currently in place. Then help me improve the design — visually, structurally, and in terms of UX clarity.

The current site is live at [www.drim.cl](https://www.drim.cl).

---

## 1. Product context

**drim** is a robotics kit aimed at children and teenagers (~7–14 years old) and at parents, teachers, and schools who want to introduce STEM/robotics without a steep technical learning curve. The kit pairs a physical microcontroller with a browser-based visual block editor (a Blockly fork), so kids can program a robot without installing software, learning syntax, or wiring a breadboard.

The brand promise: **"Crea sin límites" / "Tu mundo, tus reglas"** — *create without limits, your world, your rules*. The voice is playful, encouraging, and Spanish-language (the primary market is Chile and Latin America).

There are three audiences using the site:

1. **Prospects** (kids, parents, teachers) — landing on `/` to learn what drim is and decide to buy or book a workshop.
2. **Kit owners** — logging in with their kit code to access activities, documents, videos, and a community forum at `/materiales`.
3. **Curious visitors** — anyone who wants to try the block editor in-browser without owning a kit, at `/programacion`.

---

## 2. Brand & visual language

### 2.1 Color palette

The brand uses a **playful, primary-color palette** drawn from kids' building blocks. Four hero hues, plus near-black and off-white backgrounds.

| Role | Hex | Used for |
|---|---|---|
| **Pink (primary accent)** | `#F397C1` | CTAs, "actividades" content, accent borders, badge backgrounds |
| Pink (hover) | `#f37ab1` / `#ee7eb0` / `#f07aaf` | Hover states for pink |
| **Green (secondary)** | `#53C68E` | "Videos" content, secondary buttons, scroll indicator fills, login modal border |
| Green (hover) | `#4bb481` / `#429e6e` / `#45a876` | Hover states for green |
| **Yellow-orange (warm)** | `#FFB71A` | "Documentos" content, raised card highlight |
| Yellow (electric) | `#DED900` | Carousel button hover, accent highlights |
| **Sky blue** | `#85d1ec` | Toolbar background in the embedded programming environment |
| Near-black | `#1f150b` | Body text, primary headings, logo fill |
| White | `#FFFFFF` | Card backgrounds, button labels on color |
| Cream / off-white | `#f7f4f1`, `#f7f5f5`, `#f4ede5` | Section backgrounds, hover tints |
| Gray (text) | `#666`, `#555`, `#444` | Secondary text, captions |
| Error red | `#d32f2f` | Form validation |

**Color is semantic in the materials section**: pink = activities, yellow = documents, green = videos. This mapping should be preserved or made more deliberate.

### 2.2 Typography

Two typefaces, both from the Geist family:

- **Geist Mono** — used for almost all display, headings, navigation, buttons, and section titles. Gives the brand a "developer-tooling, technical" feel that contrasts with the playful color palette.
- **Geist (sans)** — used for long-form body copy, descriptions, captions.

The current implementation overuses `font-family: ... !important` to force Geist Mono into nearly every component. This is a code smell that suggests the cascade is being fought — a design decision that should be revisited.

**Type scale** is fluid via `clamp()` rather than discrete steps:
- Display titles: `clamp(1.5rem, 4vw, 33px)` (capped at 33px)
- Section subtitles: `clamp(1.25rem, 3.5vw, 33px)`
- Body: `clamp(0.875rem, 1.5vw, 1.125rem)`
- Captions: 12–14px

The 33px cap on hero titles is deliberately small — the design relies on **white space and color blocks** more than oversized type for impact.

### 2.3 Voice & tone

- **Spanish, informal-but-respectful** ("tu", not "usted"). Welcomes users with `Bienvenid@` (gender-neutral).
- **Imperative, encouraging headlines**: "Crea sin límites", "Juega, Aprende, Repite", "Preparate para el futuro".
- **Concrete kid-aimed CTAs**: "Quiero mi taller" (I want my workshop), "Probar drim" / "Prueba tu drim" (Try drim), "Ver material" (View material).

---

## 3. Information architecture

Three top-level routes:

```
/                  Public marketing landing page
/materiales        Logged-in kit owner content hub (Inicio | Material | Foro)
/programacion      Public block-based programming sandbox (no login needed)
```

A persistent global **navbar** appears on every route. Login is a modal overlay, not a route.

There is a soft authentication gate: users "log in" with their email + a kit code that ships with the physical kit. There is no password — the kit code IS the access token. This is intentional; it's a content gate, not real auth. `/materiales` is currently accessible without login (renders a degraded experience), but ideally would prompt a login modal if the user isn't authenticated.

---

## 4. Page specifications

### 4.1 `/` — Marketing landing

A long, scroll-pinned narrative aimed at prospects. Structure top-to-bottom:

1. **Cover**
   - Full viewport height.
   - Centered hero image (`/auto.png` — a styled illustration of a kid driving a drim-built vehicle).
   - drim logo bottom-left.
   - Subtitle bottom-left under logo: "Preparate para el futuro" with a small pink right-arrow icon to its left.
   - No CTA button on the hero — first interaction is to scroll.

2. **Section 2 — "Tu Mundo, Tus Reglas / Crea Sin Límites"** (4 value-prop cards)
   - Title with a small green square+circle icon on its left.
   - 4 cards with playful SVG illustrations and short captions:
     - **Bloques** ("Código con Bloques") — *¡Arrastra, Suelta y Crea!*
     - **Código** ("Código en Texto") — *El siguiente paso para futuros innovadores*
     - **Escalera** ("Aprendizaje Escalonado") — *Una aventura a tu propio ritmo*
     - **Manos** ("Interviene tu Entorno") — *La magia de lo físico y lo digital*
   - Cards animate in on scroll with a stagger and slight random rotation (the cards look "tossed onto the page"). On hover, the hovered card straightens and scales up; siblings re-randomize their rotation.

3. **Section 3 — "drim v/s otros microcontroladores"** (split-scroll comparison)
   - Pinned section. Left column scrolls through 3 selling points; right column shows a 3D model of the kit.
   - Selling points:
     - "Crea tu primer robot sin saber programar" — drim has a visual interface, vs the standard "download IDE, learn syntax" flow.
     - "Tu imaginación es el límite, no los cables" — drim hides the breadboard/wiring, vs Arduino-style exposed components.
     - "De los bloques al código real" — kids can transition from blocks to text code on the same device.
   - The 3D model rotates as the user scrolls, with a zoom control overlay (+ / − / reset).

4. **Tape divider** — a hand-drawn yellow tape SVG that visually separates sections.

5. **Section 4 — Testimonios** (3-up grid of testimonial cards)
   - Each card: YouTube video embed + name + age & aspiration ("Sofía, 9 años — Futura Botánica") + short quote about how they used the kit.
   - Cards sit on a green-tinted background panel that scales in on scroll.

6. **Tape divider.**

7. **Section 5 — "Usa tu drim" (3 steps)** — *Juega, Aprende, Repite*
   - Two-column. Left: large "Juega / Aprende / Repite" type. Right: 3 numbered step blocks with image + short copy.

8. **Section 6 — "Quiero mi taller" (contact form)**
   - Pink-bordered card. Form with name, email, message. Submit button is pink. Inline status message replaces the old `window.alert`.

9. **Section 7 — "Nuestras Actividades" (image carousel)**
   - Auto-scrolling marquee of 13 photos from real workshops. Pauses on hover. Manual scroll buttons exist but are currently broken (known issue — see §8).

10. **Footer**
    - drim logo + contact info (`hola@duolab.com`).

**Login modal** (overlay): triggered by the navbar Login button. Centered card with pink border, email + kit code fields, "Ingresar" submit. Closes on the `x` in the top-right of the card. **No focus trap, no Escape-to-close** — opportunity for improvement.

### 4.2 `/materiales` — Kit owner content hub

Mounted under the global navbar. The view starts with a tab strip:

```
[ Inicio ]  [ Material ]  [ Foro ]
```

Active tab has a pink underline.

**Tab: Inicio** (default)
- Greeting: `Bienvenid@ {user_name}`.
- Section "Material reciente" — top 3 most recent items across all categories (mixed activities/videos/documents). Each card shows the cover image full-bleed, with a pink-tagged title at the bottom.
- Section "Cursos recientes" — top 5 most recent activities only, same card style.

**Tab: Material**
- Three category sections stacked vertically: Actividades (pink-bordered cards), Documentos (yellow-bordered cards), Videos (green-bordered cards).
- Each section shows up to 5 cards in a 4-column grid; "Ver más" button below opens a modal listing all items in that category.
- Cards are clickable buttons that open the single-course view.

**Tab: Foro**
- A simple discussion board: list of "discusiones" (issues), each with title, author, timestamp, and tag chips.
- Header has filter-by-tag input and a "+" button to create a new discussion.
- Click a discussion to drill down into title + description + tag chips + comment thread + new-comment input.

**Single course view** (overlays the tab content when an item is clicked):
- "Volver" green button at the top-left.
- Below it, content depends on the item's `contentType`:
  - **Actividad** — Embedded Blockly editor (full-width iframe), description block, expandable "Contenido del curso" with PDF + video side-by-side.
  - **Documento** — Download button + full-width PDF iframe + description.
  - **Video** — Full-width YouTube embed + description.
- Below content: "**N comentarios**" header, comment input, then the comment list (most recent at the top, with author name, relative timestamp like "hace 2 horas", and message body).

### 4.3 `/programacion` — Public Blockly sandbox

- Full viewport height under the navbar.
- Single iframe: the Blockly visual programming environment.
- Communicates via `postMessage` and Web Serial API to flash code to a connected ESP32 over USB.
- No login required, no chrome — just the programming surface.

This page is meant to be a frictionless "try before you buy" experience.

---

## 5. Component library

### 5.1 Navbar (global)
- Fixed to top, ~64px tall, frosted-white background (`backdrop-filter: blur(10px)`, `rgba(255,255,255,0.7)`), bottom hairline border.
- Logo on the left (links to `/`).
- Right side: text links (Por que drim / Usa tu drim / Quiero mi taller / Nuestras Actividades / Prueba tu drim) followed by the user/login slot.
- Section-anchor links scroll to sections on `/`; from any other route, they navigate back to `/` with the corresponding hash.
- Logged-in state shows a user avatar that opens a dropdown with "Ver material" and "Logout".

### 5.2 Buttons
Three current variants:
- **Primary CTA (pink)**: `#F397C1` background, white text, pill-rounded, used on form submit and primary actions.
- **Secondary (green)**: `#53C68E` background, white text, used for affirmative actions ("Volver", "Crear", "Ver más").
- **Ghost**: transparent, near-black text, used for nav links.

There is no consistent disabled / loading / focus state across the codebase — design opportunity to define a button system.

### 5.3 Cards (content tiles)
Used in Materials. Pattern:
- Square-ish, `min-height: 200px`, `border-radius: 15px`.
- Cover image as `background-image` with `linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)` overlay so the title is readable.
- Border color codes the content type (pink/yellow/green).
- Title pill at the bottom-left in the matching brand color.
- Hover lifts the card 5px and adds a soft shadow.

### 5.4 Login modal
- Fixed-positioned, centered, 600px max-width.
- White card with a thick pink border (`clamp(3px, 0.75vw, 7px)`).
- 15px rounded corners.
- Close `x` in the top-right of the card.

### 5.5 Forum discussion card
- White background, soft border, rounded corners, padding ~16px.
- Title in Geist Mono medium-bold; tag chips in pink under the title; meta line ("Por X • date") at the bottom.

### 5.6 Tape SVG divider
- A repeating piece of "decorative tape" used between marketing sections to give the page a scrapbook feel.

### 5.7 Custom SVG illustrations
The marketing page leans heavily on custom SVGs whose fills are themable via inline CSS (`Blocks`, `Code`, `Stairs`, `Hands`, `RightArrows`, `SquareCircle`, `MainLogo`, `NavLogo`, `Tape`). Each one is recolored at the call site to match the local section.

---

## 6. Interaction & motion

The site relies heavily on **scroll-driven motion** to keep a long marketing page engaging.

- **Lenis smooth scroll** is initialized at the layout level and runs across all routes.
- **GSAP + ScrollTrigger** drives:
  - Section-by-section fade-up reveals (titles, subtitles, body copy).
  - The Section 2 cards' staggered "tossed-on" entrance and rotation-on-hover game.
  - The Section 3 split-scroll pin (the right column stays fixed while the left scrolls through 3 statements).
  - Background scale-ins on Sections 4 and 6 (the colored panel grows from 95% → 100% as it enters viewport).
- **Three.js / react-three-fiber** renders the 3D kit model in Section 3, rotating subtly as the page scrolls.
- The activities carousel **auto-scrolls** with a CSS keyframe animation, paused on hover.

Interaction patterns to be aware of:

- The site is **single-page-feeling** even though it has 3 routes. Smooth scroll persists across navigations because Lenis is in the layout.
- Animations always **animate-in but never animate-out** — they fire once per scroll into view (`toggleActions: 'play none none none'`).
- The 3D model has its own zoom UI (+ / − / reset) overlaid in the top-right of its panel.

---

## 7. Responsive strategy

Three breakpoints:
- **Mobile**: ≤ 480px
- **Mobile/landscape**: ≤ 768px
- **Tablet**: ≤ 1024px

Heavy reliance on `clamp(min, vw-based, max)` for fluid scaling instead of explicit breakpoints. This works well for type and spacing but causes specific bugs (some `clamp()` ranges are misconfigured — see Known Issues).

Mobile-specific behavior:
- The split-scroll Section 3 stacks vertically (3D model first, then text).
- Section 4 testimonial grid collapses to a single column.
- The 3D model panel has limited rotation control on touch devices (relies on OrbitControls).
- The decorative photo behind the activity cards in Section 4 hides below 768px.

The site needs **a deliberate mobile design pass** — most of the polish today targets desktop.

---

## 8. Known design issues / things to improve

These are pain points I've identified. The design exercise should address as many as possible.

### Visual & layout
1. **Inconsistent button system** — three loose variants, no defined disabled/loading/focus states, no scale.
2. **`!important` on `font-family` everywhere** — suggests the typography cascade isn't well-architected.
3. **Section 2 card hover game is fun but unpolished** — siblings randomize rotation on every hover, can feel jittery. Could be calmer.
4. **Login modal is functional but flat** — no focus trap, no Escape-to-close, no animated entrance.
5. **Materials cards are visually bland in empty/loading states** — placeholders just say "Documento" with a stock icon.
6. **The 3D model controls (+ / − / reset) sit in a small floating column** with inconsistent styling versus the rest of the system.
7. **Activity carousel scroll buttons exist visually but don't function** — the JS mutates `scrollLeft` on a CSS-`transform`-animated element.
8. **No defined spacing scale** — values are ad-hoc (`clamp(1rem, 3vh, 2rem)` over and over with subtle variations).

### Information architecture & UX
9. **Materials section overlap** — "Material reciente" and "Cursos recientes" can show the same items because activities dominate the publishing cadence. (Recently filtered, but the section names still overlap conceptually.)
10. **`/materiales` accessible without login** — should redirect to `/` and open the login modal.
11. **Login modal has no "what's a kit code?" helper text** — users without a kit don't know if they should be there.
12. **Forum is barebones** — no avatars, no upvotes, no rich text in posts, no reply threading, no email notifications.
13. **Single-course view is a state overlay, not a route** — can't share a link to a specific course.
14. **No empty / error states anywhere** beyond a few `console.error` calls.

### Brand & content
15. **Voice mixes informal Spanish ("tu") with developer-tooling type aesthetic (Geist Mono)** — the tension is intentional but could be sharpened. Is drim a *kid's playful tool* or a *future-engineer's serious tool*? Right now it leans both directions.
16. **Color usage is consistent inside `/materiales` (pink/yellow/green = activities/documents/videos) but not on the marketing page** — pink dominates, with green/yellow as supporting accents in seemingly arbitrary places.
17. **Hero illustration is a single static image** — could be animated, parallaxed, or replaced with a 3D scene of the kit.
18. **No SEO/social card imagery** designed yet — basic OG meta tags exist but no custom share image.

### Accessibility
19. **No focus-visible styles defined** anywhere — keyboard users see browser defaults at best.
20. **No skip-to-content link.**
21. **No reduced-motion handling** — Lenis + GSAP animations run for everyone, even users with `prefers-reduced-motion: reduce`.
22. **Color contrast on title pills (white on pink)** is borderline at small sizes.

---

## 9. What I'd love help with

Concretely, I'd like a design pass that addresses, in priority order:

1. **A real design system** — typography scale, color tokens (with semantic names: `--brand-primary`, `--surface`, `--text-secondary`...), spacing scale, button variants, focus states.
2. **A polished mobile experience** — the marketing page especially.
3. **Reduced-motion fallbacks** for the GSAP-heavy sections.
4. **A more cohesive `/materiales` experience** — clearer empty states, login gate, single-course as a real route, richer card states (read/unread, bookmarked, completed).
5. **A login UX that doesn't feel like a 1995 modal** — with clear "what's a kit code?" guidance, animated entrance, ESC support, focus trap.
6. **Sharpening the brand voice** — pick a direction (playful / technical) and lean in. The current contrast is interesting but unresolved.
7. **Interaction polish** — calmer Section 2 card hover, working carousel buttons, smooth modal transitions.
8. **A custom Open Graph card** for social sharing.

---

## 10. Repository orientation (for the curious)

If you want to reference the implementation:

- **Frontend** lives in `drimboard_frontend/` — Next.js 15 (App Router), React 19, plain JS (not TypeScript), CSS Modules per component.
- Path alias `@/*` → `drimboard_frontend/src/*`.
- Pages: `src/app/page.js` (`/`), `src/app/materiales/page.js`, `src/app/programacion/page.js`.
- Components: `src/components/*.js` (top-level for marketing) and `src/components/materials/*.js` (kit-owner area).
- Styles: `src/styles/*.module.css` (one per component, named identically).
- State: `src/store/useAppStore.js` — Zustand, only the `logged` slice is persisted.
- Sanity CMS provides activities/documents/videos content; client at `src/lib/sanity.js`.

The animations live alongside their components — `Main.js` for the marketing scroll-triggered reveals, `SectionTwoCards.js` for the 4-card hover game, `SectionFive.js` for the steps stagger, `ActivitiesCarousel.js` for the auto-scrolling marquee, `SetpViewer.js` for the 3D model.

---

That's the lay of the land. Help me make it tighter, more cohesive, and more delightful.

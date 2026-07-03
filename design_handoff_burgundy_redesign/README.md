# Handoff: One Degree North (FRC 4817) — Homepage/About/Outreach Redesign

## Overview
This is a visual redesign of the One Degree North (FRC Team 4817) marketing site's
Home, About, and Outreach pages — replacing the previous generic template look with
a distinct system: a "blueprint" grid-paper background, bold burgundy color-blocking,
a tilted logo mark, and the team's lat/long coordinates kept as a quiet recurring detail.
It includes a working light/dark mode toggle (persisted via `localStorage`).

## About the Design Files
The files in `designs/` are **design references built as standalone interactive HTML
prototypes** — they demonstrate exact look, spacing, color, typography, and light/dark
behavior. They are **not production code to copy directly**. The task is to recreate
these designs inside the existing **Astro codebase** (see "Target Codebase" below),
using its established patterns: Astro components/pages, `src/data/site.json` for copy,
the shared `Layout.astro` shell, and the existing `PhotoGallery.astro` component for the
"Life on the team" section.

To view a prototype: open `designs/Home.dc.html` (etc.) directly in a browser — no
build step required, `support.js` is a small runtime it depends on (keep both files
together, but don't port `support.js` into the Astro app — it's only a preview harness).

## Fidelity
**High-fidelity.** Colors, typography, spacing, and interaction states (hover, dark
mode) are final — implement pixel-close, not just "in the spirit of."

## Target Codebase
Astro project (see attached `FRC Website` folder):
- `src/pages/index.astro`, `about.astro`, `outreach.astro` — the three pages this
  redesign replaces.
- `src/layouts/Layout.astro` — shared shell (currently imports `@fontsource-variable/archivo`
  and `@fontsource/ibm-plex-mono`; will need updating to the new font stack, see Design
  Tokens below, and to carry the dark/light toggle + persisted theme).
- `src/data/site.json` — holds tagline/intro copy; extend it with the new copy blocks
  (story paragraphs, values, milestones, outreach programs) rather than hardcoding them
  in components.
- `src/components/PhotoGallery.astro` — existing component that auto-renders images
  dropped into `src/assets/gallery/`. Reuse this for the "Life on the team" section
  instead of the dashed placeholder box in the prototype.
- `src/scripts/scroll-animations.js` — existing scroll-reveal script for marketing
  pages; keep using it for consistency, applied to the new sections.

## Screens / Views

### 1. Home (`designs/Home.dc.html`)
**Purpose:** Landing page — hero introduction, team record stats, subteam directory,
photo section.

**Layout:** Single column, max-width 960px, centered. Grid-paper background (a 28×28px
repeating line grid at low opacity) behind the whole page body.

**Header** (sticky-feeling but not actually `position:sticky` in the prototype — recreate
as a normal top bar): logo mark (tilted "1°N" badge, burgundy background, white text,
`rotate(-3deg)`, 8px border-radius) + wordmark "One Degree North" / "FRC TEAM 4817"
eyebrow, right-aligned nav pills (Home/About/Outreach/Lessons) with a solid pill for the
active page, plus a light/dark toggle button on the far right.

**Hero:** Full-width burgundy block (`border-radius:18px`), with a soft translucent gold
circle bleeding off the top-right corner (`opacity:0.35`, 220px circle, positioned
`top:-40px; right:-60px`). Contains: small mono-caps eyebrow "FRC Team 4817 · Singapore ·
1.3521°N 103.8198°E", large display H1 "One Degree North" (58px), one paragraph of intro
copy, two pill CTAs ("Get to know us" solid dark, "Browse our lessons" white/inverted).
A small "Fig. 01 / Hero" mono label sits top-right as a quiet blueprint-style annotation —
this pattern (Fig. 0N / Section) repeats once per major section across all three pages.

**Team record divider:** thin horizontal rule with a centered "TEAM RECORD" mono label
and short accent tick marks at both ends.

**Stats row:** bordered rounded container holding a 5-column grid: 4 dark "block" tiles
(rookie year, seasons, events, awards) + 1 gold tile for "latest" (2025 Hawaii Regional
Winners).

**Subteams section:** bordered rounded card, heading + intro copy, wrapping row of 5 dark
pill buttons (Programming, Mechanical, Electrical, CAD, Business).

**Photo section:** heading "Life on the team" + dashed-border placeholder box (gold dashed
border) — **replace with `PhotoGallery.astro`** in the real build.

**Footer:** full-width dark block. Top row: team name/school + email (left), lat/long
coordinates in mono gold (right). Below a divider: "Follow the team" label + 3 pill links
(Instagram, YouTube, FIRST Inspires) with outlined gold border, filling gold on hover.

### 2. About (`designs/About.dc.html`)
Same header/footer shell. Body:
- Intro card (bordered, rounded): "Fig. 02 / About" label, "Get to know us" eyebrow, H1
  "A team of ~30 students, one degree north of the equator", 3 paragraphs of story copy.
- "What we stand on" section: dark block card containing a 2×2 grid of burgundy tiles,
  one per value (Communication, Collaboration, Innovation, Sportsmanship), each with a
  bold title + one-line detail in white/gold text.
- "Milestones" section: bordered card with a **vertical timeline** — a left rule line,
  small burgundy dot markers per entry, year in bold burgundy mono + event description
  text. Closing line links out to the team's FIRST Inspires profile.

### 3. Outreach (`designs/Outreach.dc.html`)
Same shell. Intro card ("Fig. 03 / Outreach", "Beyond the build season" eyebrow, H1
"Outreach", one caveat line noting the cards are placeholders). 3-column grid of dark
block cards (Community STEM day / Mentorship network / Sponsor partnerships) — **content
is explicitly placeholder text in brackets; the team needs to supply real outreach copy**
before shipping.

## Interactions & Behavior
- **Light/dark toggle:** button in the header, label reads "Dark ☾" / "Light ☀" depending
  on current mode. Toggling swaps a set of CSS custom properties (see Design Tokens) and
  persists the choice to `localStorage` under the key `odn-theme` (values `"dark"` /
  `"light"`); read on page load so the choice survives navigation and reload. Implement
  this the same way in Astro (e.g. a small inline script in `Layout.astro`, or a
  client-side island) so it's consistent across all pages.
- **Hover states:**
  - Nav links: transparent → light paper-tint background.
  - Toggle button: border + text color shift to accent burgundy.
  - Primary hero CTA: darkens toward `--accent`.
  - Secondary hero CTA: shifts to gold (`--accent2`).
  - Subteam pills: dark → burgundy.
  - Outreach cards: 2px burgundy outline appears (offset 2px).
  - Social links: fill gold, text flips to the dark block color.
- No other JS-driven interactions (no carousels, modals, or animated counters) — keep it
  restrained.

## State Management
Only one piece of state needed: `dark: boolean`, initialized from `localStorage.getItem('odn-theme') === 'dark'`, toggled by the header button, and written back to `localStorage` on every toggle. No data fetching.

## Design Tokens

**Color (light mode):**
- `--paper` (page bg): `#fff8f4`
- `--ink` (primary text): `#1a1210`
- `--steel` (muted text): `#6b5d59`
- `--accent` (burgundy, the feature color): `#8c1f3f`
- `--accent-text` (burgundy tuned for text-on-paper contrast): `#8c1f3f` (same as accent in light mode)
- `--accent2` (gold/brass secondary): `#f2b632`
- `--surface` (cards/header bg): `#ffffff`
- `--rule` (borders/dividers): `#ecdfd9`
- `--block` (dark UI block fill — footer, stat tiles, pills): `#1a1210`
- `--grid` (background grid lines): `rgba(140,31,63,0.06)`

**Color (dark mode):**
- `--paper`: `#150b0d`
- `--ink`: `#f5ece7`
- `--steel`: `#c9a8ad`
- `--accent`: `#7a2331`
- `--accent-text`: `#e08a97` (lighter tint so accent-colored text stays readable on the dark paper)
- `--accent2`: `#f2b632` (unchanged)
- `--surface`: `#241016`
- `--rule`: `#3a1e24`
- `--block`: `#2a1015`
- `--grid`: `rgba(242,182,50,0.08)`

**Typography:**
- Display / headings / body: **Space Grotesk** (400/500/600/700)
- Logo badge only: **Bricolage Grotesque** (700/800)
- Mono labels (eyebrows, "Fig. 0N" annotations, stats, coordinates): **JetBrains Mono** (400/500/600)
- H1 hero: 58px/700, `letter-spacing:-0.01em`, `line-height:1.05`
- H1 sub-pages: 34px/700
- Section H2: 20–24px/700
- Body copy: 15–16px, `line-height` inherited from Space Grotesk defaults
- Mono eyebrows/labels: 9–12.5px, `letter-spacing: 0.06–0.14em`, uppercase

**Shape:**
- Card/section radius: 18px
- Tile/pill radius: 14px (tiles), 20–24px (pills/buttons, i.e. fully rounded)
- Logo badge radius: 8px, rotated -3deg
- Borders: 1.5px solid `--rule` on outlined cards

**Spacing:** page content max-width 960px; section vertical rhythm ~32–48px between
major blocks; card internal padding 20–24px; pill button padding `10–12px 20–22px`.

## Assets
No photos are used yet — the "Life on the team" section is an explicit placeholder
(dashed border box) pending real team/robot photography, to be wired into the existing
`PhotoGallery.astro` component. Google Fonts are loaded via `<link>` (Space Grotesk,
JetBrains Mono, Bricolage Grotesque) — for Astro, prefer adding these as `@fontsource`
packages to match how Archivo/IBM Plex Mono are currently loaded in `Layout.astro`.

## Files
- `designs/Home.dc.html` — homepage prototype
- `designs/About.dc.html` — about page prototype
- `designs/Outreach.dc.html` — outreach page prototype (placeholder copy — flag for the
  team to fill in before launch)
- `designs/support.js` — runtime the prototypes need to render in a browser; not part of
  the production implementation
- `screenshots/01-home-light.png`, `02-home-dark.png` — homepage, light and dark mode
- `screenshots/03-about-light.png` — about page
- `screenshots/04-outreach-light.png` — outreach page

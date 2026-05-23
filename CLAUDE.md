# GCSE Revision App — Project Guide

## What This Is

React + Vite GCSE revision app. Mobile-first, dark cinematic theme. Designed to feel like a premium streaming platform, not a school VLE.

## Entry Point

`src/App.jsx` — single large file. All components are defined inline here. Do not split into separate files unless asked.

## Key Components in App.jsx

- `App` — top-level router, manages tab state and session flow
- `BottomNav` — fixed 5-tab nav (Home / Subjects / 90s Quiz / Progress / Exam) with SVG line icons
- `BiologySection` — biology-specific horizontal scroll section with topic group image cards
- `Home` — home screen: greeting, resume card, weak zone, subjects grid, quiz CTA
- `ModulesTab` — subjects/modules browser
- `SubjectSection` — renders a subject heading + its module cards
- `ModuleCard` — individual module card with progress, accent colour, icon
- `ProgressTab` — progress/stats screen
- `TestTab` — quiz/test mode (also used for Exam Mode)
- `ModulePlayer` — imported from `src/ModulePlayer.jsx`; handles in-module lesson flow

## Data Files

| File | Contents |
|------|----------|
| `src/modules.js` | `MODULES` array — all module definitions (id, title, subject, colour, screens, etc.) |
| `src/content.js` | `TOPICS` and `TOPIC_DATA` — History topic content and questions |
| `src/progress.js` | Progress helpers: `getProgress`, `saveSessionResult`, `getSessionDraft`, etc. |
| `src/data/mathsTopics.js` | Maths topic groups and questions |
| `src/data/englishTopics.js` | English topic groups and questions |
| `src/data/sociologyTopics.js` | Sociology topic groups and questions |
| `src/data/chemistryTopics.js` | Chemistry topic groups and questions |
| `src/data/biologyGroups.js` | `BIOLOGY_GROUPS` — 7 Biology topic group definitions with module lists and header images |

## Public Assets

- `/public/logo.png` — RISE logo (teal glow, dark background) — used in ModulesTab header and as favicon
- `/public/headers/` — cinematic header images for subject/module hero cards
  - History: `history-medicine-through-time.png`, `history-elizabethan.png`, `history-usa-conflict.png`, `history-spain-new-world.png`
  - Biology overview: `bio-main.png`
  - Biology topic groups: `bio-buildinglife.png`, `bio-humanmachine.png`, `bio-diseasewars.png`, `bio-energyforlife.png`, `bio-controlsystems.png`, `bio-genetics.png`, `bio-ecosystems.png`
- `/public/mystery-cube.png` — used on locked/mystery module cards
- `/public/figures/` — biology/chemistry diagram images used in question content

Always use `.png` extension for images. Never `.svg` for photos.

## Fonts

Loaded in `index.html` via `<link>` tags:

- **Plus Jakarta Sans** — Google Fonts — all UI text
- **Clash Display** — Fontshare — hero headings and module titles
- **Cormorant Garamond** — Google Fonts — History subject accents

## Brand Rules

See `BRAND.md` for ALL colour, typography, spacing, and component decisions.

**Never improvise design decisions not covered in BRAND.md.** When unsure, choose simpler / darker / calmer / less decorated.

## Commands

```bash
# Development server
./node_modules/.bin/vite

# Production build
./node_modules/.bin/vite build
```

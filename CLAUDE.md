# GCSE Revision App — Project Guide

## What This Is

React + Vite GCSE revision app. Mobile-first, dark cinematic theme. Designed to feel like a premium streaming platform, not a school VLE.

## Entry Point

`src/App.jsx` — single large file. All components are defined inline here. Do not split into separate files unless asked.

## Key Components in App.jsx

- `App` — top-level router, manages tab state and session flow
- `BottomNav` — fixed 4-tab nav (Home / Subjects / 90s Quiz / Exam Mode)
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

## Public Assets

- `/public/headers/` — cinematic header images for subject/module hero cards
  - `history-medicine-through-time.png`
  - `history-elizabethan.png`
  - `history-usa-conflict.png`
  - `history-spain-new-world.png`
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

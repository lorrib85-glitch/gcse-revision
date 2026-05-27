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
- `ModulePlayer` — imported from `src/components/layout/ModulePlayer.jsx`; handles in-module lesson flow

## Component Folders

All standalone components live under `src/components/`. Do not add new `.jsx` files directly to `src/`.

### `src/components/core/`
Foundation components used by many others.
- `AnswerInteraction.jsx` — LOCKED. Universal answer UI (choice, connection, true/false). Owns all answer logic.
- `CardContainer.jsx` — LOCKED. Atmospheric content surface wrapper with optional background image.
- `LearningHeader.jsx` — Floating capsule header shell. Composes ModuleToolbar + LearningProgressHeader.
- `LearningProgressHeader.jsx` — LOCKED. Progress rail + jump sheet (progression display only).
- `ModuleToolbar.jsx` — LOCKED. Back + exit navigation buttons only.

### `src/components/learning/`
Screen-level learning interaction components.
- `CinematicRevealMoment.jsx` — Full-screen cinematic video/image reveal moment.
- `ConceptReveal.jsx` — Concept introduction with atmospheric reveal.
- `ExplainReveal.jsx` — Progressive cause-and-effect reasoning chain, revealed step by step.
- `FaceTheExaminer.jsx` — Examiner-style written question interaction.
- `FillInTheBlanksBlock.jsx` — Inline fill-in-the-blanks chapter block.
- `InteractiveHotspotImage.jsx` — Full-screen image with tappable hotspots (two-phase intro→explore).
- `QuickRecallScreen.jsx` — Rapid-fire retrieval screen (choice + connection questions).
- `RecoveryQuizPlayer.jsx` — Lightweight recovery quiz player (3-4 focused questions).
- `WeakSpotRecovery.jsx` — Full-screen behavioural intervention screen shown when a learner struggles.

### `src/components/layout/`
Module-level orchestration and chapter framing screens.
- `ChapterCompleteScreen.jsx` — End-of-chapter completion screen with score and stats.
- `ChapterHookScreen.jsx` — Chapter intro hook screen with true/false warm-up.
- `ChapterOutcomeScreen.jsx` — Chapter outcome/outcome reveal screen.
- `ModulePlayer.jsx` — In-module lesson flow orchestrator. Routes between all block types.

### `src/components/feedback/`
Question feedback and exam practice components.
- `ExamQuestionFrame.jsx` — Universal exam question component with mark scheme reveal.
- `RetrievalFrame.jsx` — LOCKED. Cinematic wrapper for retrieval moments. Delegates all answer logic to AnswerInteraction.

## Constants

| File | Contents |
|------|----------|
| `src/constants/subjects.js` | `SUBJECT_ACCENTS`, `SUBJECT_PALETTES`, `hexToRgb()` — single source of truth for all subject colours. Always import from here; never redefine locally. |

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
| `src/data/recoveryQuizzes.js` | Recovery quiz definitions keyed by `recoveryQuizId` — used by RecoveryQuizPlayer |

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

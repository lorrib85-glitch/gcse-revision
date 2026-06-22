# PROJECT.md — RISE

## Core Value

A 15-year-old opens RISE by choice after school, revises for 20–30 minutes, and leaves feeling more capable — not just less guilty. The app earns its place on their phone by feeling like it belongs next to Spotify, not Google Classroom.

## One-Line Description

Mobile-first React + Vite GCSE revision app. Cinematic dark theme. Feels like a premium streaming platform, not a school VLE.

## Developer Success Metric

A 15-year-old opens the app by choice, studies, and improves exam performance.

## Target Runtime

Browser — mobile-first, portrait, max-width 420px.

---

## What Exists Now (as of 2026-06-22)

### Fully functional app shell
- 5-tab bottom navigation: Home / Subjects / 90s Quiz / Progress / Exams
- Dark cinematic theme throughout
- Auth flow
- Module lazy-loading (per-subject content chunks)
- Progress tracking and weakness identification (`unifiedWeaknessTracker.js`)
- Adaptive daily plan on Home (`buildTodaysPlan()`, `src/todaysPlan.js`)

### Subjects and modules (30 registered in `src/modules.js`)

**History — Medicine Through Time (14 episodes)**
- Episodes 1–4: fully built (32, 27, 16, 11 screens)
- Episode 5 (London's Year of Terror): 0 screens — canonical files exist
- Episode 6 (Jenner): 1 screen stub
- Episodes 7–9: partially built (10, 7, 10 screens)
- Episode 10 (Nightingale): 0 screens — canonical file exists
- Episodes 11–14: built (11, 9, 11, 19 screens)
- Canonical topic files: all 14 episodes complete (`docs/content/history/Medicine/`)

**History — Spain and the New World (10 episodes)**
- All 10 episodes: 0 screens — no content built
- Canonical topic files: none yet

**History — USA 1954–75 (12 episodes)**
- All 12 episodes: 0 screens — no content built
- Canonical topic files: all 12 complete (`docs/content/history/USA_1954-75/`)

**Biology (8 modules)**
- "Building blocks": 13 screens (built)
- "Plant Cells & Photosynthesis": 9 screens (built)
- Modules 3–8 (topic-group aggregators): 1 screen each (stubs)

**Maths (2 modules)**
- Both built: 8 and 9 screens

**Sociology (5 modules)**
- All 5 built: 12–17 screens each

**Chemistry (4 modules)**
- All 4 at 1 screen (stubs)

### App-level features
- Exam Mode: subject-specific question banks (Maths, English, Sociology, Chemistry, History past papers), `GuidedAnswerCoach` (6 History question types)
- 90s Quiz: `quickQuizData.js` question bank, Pulse Tab
- Progress Tab: session history, weakness tracking
- Home: `buildTodaysPlan()` carousel live, `StreakChip`, weekly trend line
- `WeakSpotRecovery` + `RecoveryQuizPlayer` integrated in module flow
- `canonical-topic` skill: generates per-episode content + architecture files

---

## Decisions

### DEC-01 — Development workflow: two named pipelines (LOCKED)
source: `docs/superpowers/specs/2026-06-12-development-workflow-design.md`
status: **LOCKED**

All code changes follow exactly one of three named pipelines:
- **Minor Edit** — single-file, single-concept, no new pattern or API. Steps: name it → change → `/ponytail-review` → build → commit.
- **Standard Change Pipeline** — improving/refactoring/extending existing screens or components.
- **Big Build Pipeline** — new product areas, new flows, new architecture, new reusable patterns.

Branching policy is main-only. No feature branches, no PRs unless explicitly requested. Every session names the pipeline before starting work. Context compaction does not skip pipeline steps.

### DEC-02 — BackButton: single locked constitutional component
source: `docs/superpowers/specs/2026-06-12-back-button-component-design.md`
status: Implemented

`src/components/core/BackButton.jsx` is the only back-navigation button allowed anywhere. 40×40 touch target (intentional override of 44×44 general rule). All 28 call sites migrated 2026-06-12.

### DEC-03 — Standard Module Spine (SUPERSEDED)
source: `docs/04 Learning Architecture/Standard_Module_Spine.md`
status: **SUPERSEDED** — historical reference only

Superseded by `HISTORY_MODULE_ARCHITECTURE.md` and `SCIENCE_MODULE_BLUEPRINT.md` (both locked in CLAUDE.md).

---

## Constraints

- **CON-01** (Button/Radius tokens): All radii and button dimensions from `RADII` and `BUTTONS` constants. Never invent values. Primary CTAs use `RADII.large` — never pill.
- **CON-02** (History module structure): All History modules follow the locked 6-section structure in `HISTORY_MODULE_ARCHITECTURE.md`. Not negotiable.
- **CON-03** (Motion tokens): All durations and easings from `MOTION` constants. No bounce/spring/confetti.
- **CON-04** (Spacing tokens): All spacing from `SPACING` constants. Screen horizontal padding always 24px (`SPACING.standard`).
- **CON-05** (Subject theme tokens): All subject colours from `SUBJECTS` in `src/constants/subjects.js`. Never duplicate locally.
- **CON-06** (Typography tokens): All type from `TYPE` tokens. Two fonts only: Sora (UI) and IBM Plex Serif (cinematic editorial). Note: `TYPOGRAPHY_SYSTEM.md` still names Cormorant Garamond — CLAUDE.md is the operative authority (IBM Plex Serif).
- **CON-07** (Screen shells): Three canonical shells — `ContentShell` (default), `InteractionShell` (answer mechanics), `CinematicShell` (last resort with written justification).
- **CON-08** (Science module structure): All Biology/Chemistry/Physics modules follow the locked 6-part structure in `SCIENCE_MODULE_BLUEPRINT.md`.
- **CON-09** (Canonical topic schema): Output from `/canonical-topic` must follow the 6-section schema in `docs/superpowers/specs/2026-06-12-topic-brief-skill-design.md`.
- **CON-10** (Home redesign contract): `buildTodaysPlan()` task descriptor shape and navigation wiring as specified in `docs/superpowers/specs/2026-06-14-home-todays-plan-redesign.md`.

---

## Non-Goals (v1)

- No team/multi-user features
- No backend or server-side rendering
- No teacher/parent dashboards
- No gamification rewards (badges, leaderboards, XP)
- No cross-subject weak-spot tag mappings beyond History (deferred)
- No English modules (content bank exists, no modules registered)
- No Physics modules (topic bank exists, no modules registered)
- No bottom nav relabeling
- No new weak→mastered tracking beyond current system

---

## Open Issues

- `TYPOGRAPHY_SYSTEM.md` and `PRODUCT_UI_CONSTITUTION.md` still reference Cormorant Garamond — needs documentation update to IBM Plex Serif (non-blocking; CLAUDE.md is authoritative)
- History Medicine episodes 5 and 10 have 0/1 screens — canonical files exist, content build pending
- Spain and the New World: 10 episodes with 0 screens, no canonical files
- USA 1954–75: 12 episodes with 0 screens, canonical files complete
- Biology modules 3–8: stub only (1 screen each)
- Chemistry modules 1–4: stub only (1 screen each)

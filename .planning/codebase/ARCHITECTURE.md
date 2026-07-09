<!-- refreshed: 2026-07-09 -->
# Architecture

**Analysis Date:** 2026-07-09

## System Overview

```text
┌─────────────────────────────────────────────────────────────┐
│                      Presentation Layer                      │
│  (React components: core, layout, learning, feedback)        │
│                `src/components/`                              │
└────────┬───────────────────────────────────────────┬─────────┘
         │                                           │
         ▼                                           ▼
┌────────────────────────────────────┐    ┌──────────────────────┐
│   Feature Tab Shell Layer           │    │  Overlay Orchestration│
│  (Home, Subjects, Quickfire,        │    │  (Module/Chapter Open)│
│   Pulse, Exams, Planner)            │    │  `src/app/LegacyApp` │
│  `src/features/*/`                  │    │  `src/app/BottomNav` │
└────────┬──────────────────────────┬─┘    └──────────────────────┘
         │                          │
         └──────────────┬───────────┘
                        ▼
┌─────────────────────────────────────────────────────────────┐
│         Core App State & Navigation (LegacyApp.jsx)         │
│  - Tab routing (home/subjects/pulse/quickfire/exams)        │
│  - View state (module/chapter-complete overlays)            │
│  - Module player orchestration                               │
│  - Progress synchronization                                  │
└────────────────────┬──────────────────────────────────────┘
                     │
        ┌────────────┴──────────────┬────────────┐
        ▼                           ▼            ▼
┌──────────────────┐     ┌──────────────────┐  ┌──────────────┐
│   Content Layer   │     │   Data & State   │  │   Auth       │
│                   │     │                  │  │              │
│ • Modules         │     │ • Progress       │  │ • AuthContext│
│ • Screens (30+)   │     │ • Weaknesses     │  │ • authService│
│ • Questions       │     │ • Mastery Engine │  │ • Storage    │
│                   │     │ • Config/const   │  │              │
│ `src/content/`    │     │ `src/progress.js`│  │ `src/auth/`  │
│ `src/modules.js`  │     │ `src/data/`      │  │ `src/lib/`   │
└──────────────────┘     └──────────────────┘  └──────────────┘
         │                        │
         └────────────┬───────────┘
                      ▼
         ┌─────────────────────────┐
         │   localStorage + cache   │
         │   (all user data)        │
         └─────────────────────────┘
```

## Component Responsibilities

| Component | Responsibility | File |
|-----------|----------------|------|
| App | Renders LegacyApp wrapper | `src/App.jsx` |
| LegacyApp | Main app shell, tab routing, overlay orchestration, module loading | `src/app/LegacyApp.jsx` |
| ModulePlayer | In-module lesson flow, screen routing for 30+ screen types | `src/components/layout/ModulePlayer.jsx` |
| Home | Home tab: greeting, streak, weekly trend, task carousel | `src/features/home/Home.jsx` |
| ModulesTab | Subjects/modules browser with cards and progress badges | `src/features/subjects/Subjects.jsx` |
| PulseTab | Progress/stats tab showing improvements and weak spots | `src/features/pulse/Pulse.jsx` |
| TestTab | QuickFire (90s Quiz) mode and Exam Mode orchestrator | `src/features/quickfire/QuickFire.jsx` |
| ExamPractice | Exam Mode: past-paper selection, timed exam runner, debriefing | `src/features/exams/ExamPractice.jsx` |
| BottomNav | Fixed 5-tab navigation (Home/Subjects/90s Quiz/Progress/Exam) | `src/app/BottomNav.jsx` |
| AuthContext | Auth state management (login, onboarding, progress sync) | `src/auth/AuthContext.jsx` |

## Pattern Overview

**Overall:** React SPA with lazy-loaded components, feature-based organization, centralized state via context and localStorage.

**Key Characteristics:**
- **Lazy loading**: ModulePlayer and exam data loaded only when needed to reduce first-load time
- **Content-on-demand**: Module content files (30 lessons) cached in memory and loaded individually
- **State persistence**: All user data (progress, weaknesses, mastery, streak) stored in localStorage with optional Google backup
- **Feature tabs**: Five independent tabs (home, subjects, pulse, quickfire, exams) that coordinate through shared state in LegacyApp
- **Overlay orchestration**: Modules and chapter-complete screens render as full-screen overlays over the tab shell

## Layers

**Presentation Layer (`src/components/`):**
- Purpose: Render all UI to the learner, handle interactions
- Location: `src/components/`
- Contains: React functional components organized by type (core, layout, learning, feedback)
- Depends on: Constants, data passed as props
- Used by: Features (tab screens), ModulePlayer (screen routing)

**Feature Layer (`src/features/`):**
- Purpose: Tab-specific logic, state management, screen orchestration
- Location: `src/features/{home,subjects,pulse,quickfire,exams,planner,streaks}`
- Contains: Tab screens (Home, ModulesTab, PulseTab, TestTab, ExamPractice), planners, loggers
- Depends on: Progress, weakness tracking, content modules, constants
- Used by: LegacyApp (tab routing)

**App Orchestration (`src/app/`):**
- Purpose: Route between tabs, manage overlays, handle module/chapter opening
- Location: `src/app/`
- Contains: LegacyApp (main app shell), BottomNav (navigation), moduleNavigation helpers
- Depends on: Auth, features, ModulePlayer, content modules
- Used by: App.jsx (entry point)

**Content Layer (`src/content/`, `src/modules.js`):**
- Purpose: Store lesson definitions, screen definitions, chapter structures
- Location: `src/content/{history,biology,chemistry,maths,english,sociology}/`, `src/modules.js`
- Contains: Per-module files exporting `{ id, subject, screens, hook, recall, outcomes, intro }`, metadata registry
- Depends on: Nothing
- Used by: LegacyApp (module loading), ModulePlayer (screen routing)

**Data & State (`src/progress.js`, `src/unifiedWeaknessTracker.js`, `src/data/`):**
- Purpose: Track user progress, weaknesses, mastery, and provide question/topic banks
- Location: `src/progress.js`, `src/unifiedWeaknessTracker.js`, `src/data/`
- Contains: Progress helpers, weakness logging, mastery engine, question banks, learning graph
- Depends on: Storage (localStorage wrapper), modules
- Used by: Features (Home, Pulse, QuickFire), ModulePlayer, ExamPractice

**Auth Layer (`src/auth/`):**
- Purpose: Manage login, onboarding, Google account linking, progress sync
- Location: `src/auth/`
- Contains: AuthContext (state provider), authService (login/logout logic), firebaseClient
- Depends on: Storage, progress sync
- Used by: LegacyApp (auth guards), AuthProvider

**Constants & Config (`src/constants/`):**
- Purpose: Centralized design tokens (colours, spacing, motion, typography)
- Location: `src/constants/`
- Contains: subject palettes, spacing/button/motion/typography tokens, theme definitions
- Depends on: Nothing
- Used by: All components, features

**Library (`src/lib/`):**
- Purpose: Low-level utilities for storage and common operations
- Location: `src/lib/`
- Contains: `storage.js` (localStorage wrapper with JSON/array helpers)
- Depends on: Nothing
- Used by: Progress, auth, all state management

## Data Flow

### Primary Request Path (Opening a Module)

1. User taps a module card (`ModuleCard` in ModulesTab)
2. `onOpenModule(mod, screenIndex)` callback → `LegacyApp.openModule()`
3. `LegacyApp.openModulePlayer()` sets `view='module'`, triggers lazy-load of ModulePlayer chunk
4. If module content not cached: `loadModuleContent(mod)` → imports from `MODULE_CONTENT_LOADERS[mod.id]` (or `SUBJECT_MODULE_LOADERS` for legacy) → waits for dynamic import
5. Once content loaded: `setActiveModule(fullMod)`, `setView('module')`
6. `ModulePlayer` renders with full module definition (`{ id, subject, screens, hook, recall, outcomes, intro, examiner?, ... }`)
7. ModulePlayer reads module state from `localStorage[gcse_module_${mod.id}]` to resume or start fresh
8. Screen router in ModulePlayer handles 30+ screen types (read, examQuestion, cinematic, etc.) with corresponding components
9. On chapter complete: `onChapterComplete()` → builds payload → `setChapterCompleteData()` → `setView('chapter-complete')`
10. User continues or returns → `closeOverlay()` → `setView(null)`, progress refreshed

### QuickFire (90s Quiz) Request Path

1. User taps "90s Quiz" in BottomNav or task card → `startQuickfire(origin)` in LegacyApp
2. `setTab('quickfire')` → renders `TestTab mode="quickfire"`
3. TestTab wraps QuickFire component with `testDataContext` (lazy-loads question banks on first render)
4. QuickFire (`src/features/quickfire/QuickFire.jsx`) runs question selector logic (`selectQuestions()`) to pick adaptive question mix
5. Displays questions via `QuickFireQuestionScreen` → AnswerInteraction for each question
6. On answer: logs to `unifiedWeaknessTracker` (right/wrong), updates mastery engine
7. End of round: renders debriefing, synthesizes weakness patterns

### Exam Mode (Timed Practice Papers)

1. User selects exam subject/paper in ExamPractice (`src/features/exams/ExamPractice.jsx`)
2. `setExamAutoStart({ subject, paperQuestions, durationSeconds, ... })` → `setTab('exams')`
3. ExamPractice renders exam browser or auto-starts exam runner if `examAutoStart` set
4. Exam runner (ExamPaperRunner) displays timed questions, marks them in real-time or at end
5. Debriefing (ExamRoundDebrief) logs exam-technique weaknesses via `logExamTechnique()`
6. User can review answers, get model marking, see patterns

### Weakness & Mastery Recording

1. **Learning path (modules)**: User answers question → `onAnswer()` in learning component → logs via `logWrongAnswer()` / `logCorrectAnswer()` in `src/unifiedWeaknessTracker.js` → weakness stored in `gcse_weaknesses_${category}`
2. **QuickFire path**: Answer logged via `masteryRecorder.js` → writes to mastery engine + logs weakness
3. **Exam technique**: `logExamTechnique()` records recurring issue patterns → feeds into recovery quiz selection
4. **Weak spot detection**: `WeakSpotRecovery` component shown when learner scores <50% on a question → logs behavioural intervention
5. Recovery quizzes generated by `buildTodaysPlan()` for next session based on yesterday's weaknesses

**State Management:**
- **Auth state**: `AuthContext` provider (LegacyApp wrapped by AuthProvider in index.jsx)
- **Tab state**: Managed in LegacyApp (`tab`, `setTab`)
- **Overlay state**: Managed in LegacyApp (`view`, `activeModule`, `chapterCompleteData`)
- **Progress state**: Read from localStorage on-demand via `getProgress()` in `src/progress.js`; written via `recordActivity()`, `recordScore()`
- **Weakness state**: Stored per-category key in localStorage; read/written via `unifiedWeaknessTracker.js`
- **Persistence**: All state persisted to localStorage immediately; Google sync (for signed-in users) reconciles cloud snapshot on app load

## Key Abstractions

**Screen Type:**
- Purpose: Defines how a single learning screen is rendered and how the learner interacts with it
- Examples: `read` (text + image), `examQuestion` (question + mark scheme), `cinematic` (full-screen video/image moment), `choice` (single-choice interaction), `truefalse`, `connection`, `matching`, `timelineChain`, etc.
- Pattern: Each screen object has `{ type, content/prompt, outcomes?, ... }` + ModulePlayer routes by type to render appropriate component

**Module:**
- Purpose: Container for one lesson unit, with metadata, chapters, and learner journey
- Examples: "Trust me, I'm following Jupiter" (History), "Photosynthesis in plants" (Biology)
- Pattern: Loaded from `src/content/${subject}/${topic}/episodes/${id}.js` and cached in memory; accessed via `modules.js` metadata array

**Question Bank:**
- Purpose: Reusable collections of questions grouped by subject/topic for exam practice or weak-spot recovery
- Examples: `MATHS_TOPIC_GROUPS` (Maths), `ALL_ENGLISH_QUESTIONS` (English), `QUICK_QUIZ_QUESTIONS` (90s Quiz)
- Pattern: Defined in `src/data/{subject}Topics.js` or `quickQuizData.js`, lazy-loaded via context (TestDataContext) to avoid bloating main bundle

**Learning Graph & Concept Registry:**
- Purpose: Canonical vocabulary of GCSE concepts (e.g., `history:medicine:galen`) for tagging screens, questions, and weaknesses
- Location: `src/data/learningGraph/concepts/` + resolution logic in `src/data/learningGraph/`
- Pattern: Enforces consistent naming across all features; facet tags (e.g., `:understanding`, `:application`) allow fine-grained weakness tracking

**Mastery Engine:**
- Purpose: Record what one learner knows per concept (evidence, timestamp, source)
- Location: `src/data/masteryEngine/`
- Pattern: Pure read-only queries at reporting time; persistence via `masteryStore.js` → `storage.js`; guarded by allowlist in `tests/architecture/mastery-engine.test.js`

## Entry Points

**App (`src/App.jsx`):**
- Location: `src/App.jsx`
- Triggers: React app bootstrap (index.jsx renders App)
- Responsibilities: Minimal wrapper that renders `LegacyApp`

**LegacyApp (`src/app/LegacyApp.jsx`):**
- Location: `src/app/LegacyApp.jsx`
- Triggers: App component render
- Responsibilities: Auth gate (splash → login/onboarding → app shell), tab routing, overlay orchestration, module loading, progress sync

**ModulePlayer (`src/components/layout/ModulePlayer.jsx`):**
- Location: `src/components/layout/ModulePlayer.jsx`
- Triggers: `openModule()` call in LegacyApp sets `view='module'`
- Responsibilities: In-module navigation, screen routing (30+ screen types), persistence, completion handling, progress logging

**Feature Tab Screens:**
- Home (`src/features/home/Home.jsx`): Renders home tab content (greeting, streak, task carousel)
- ModulesTab (`src/features/subjects/Subjects.jsx`): Renders subjects/modules browser
- PulseTab (`src/features/pulse/Pulse.jsx`): Renders progress and improvements
- QuickFire/TestTab (`src/features/quickfire/QuickFire.jsx`): Renders 90s Quiz or Exam Mode
- ExamPractice (`src/features/exams/ExamPractice.jsx`): Renders exam practice flows

## Architectural Constraints

- **Lazy loading of ModulePlayer**: All ~40 learning/feedback components are bundled with ModulePlayer and only downloaded when a user opens a module for the first time. Always use `React.lazy()` + `Suspense` in `App.jsx` if adding large feature-specific components.
- **Exam data context isolation**: Test data (question banks) only lazy-loaded when `tab === 'exams'` via `TestDataContext` to avoid bloating QuickFire tab
- **Content caching**: Once a module's full content is loaded, it's cached in `_contentCache` to avoid re-downloading on subsequent opens within the same session
- **localStorage-only state**: All user data persists to localStorage; no other backend write (Google Firestore backup is best-effort, not required for offline play)
- **Module screen count immutable**: `mod.screenCount` (and `mod.screenTags` array) must stay in sync with `screens.length`; changing screen structure requires rebuilding metadata
- **Subject accent injection**: All cinematic CSS classes expect `style={{ '--cinematic-accent': accent }}` to be injected at render time; never hardcode subject colours
- **Circular imports risk**: `progress.js` imports `modules.js`; avoid adding reverse imports that would create cycles
- **No transform/opacity on cinematic-shell**: Fixed-position children (e.g., SequenceProgress dots) depend on outer `cinematic-screen` being transform-free in resting state

## Anti-Patterns

### Hardcoding Subject Colours

**What happens:** A component defines a colour like `'#65E6C6'` inline instead of importing from the subject palette.

**Why it's wrong:** When updating a subject's theme or branching to a new subject, the inline colour is easy to miss and becomes inconsistent across the UI.

**Do this instead:** Import `SUBJECT_ACCENTS` from `src/constants/subjects.js` and use the subject name as key:
```javascript
import { SUBJECT_ACCENTS } from '../../constants/subjects.js'
const accent = SUBJECT_ACCENTS[subject]
```
Pass accent to component props and inject via `style={{ '--cinematic-accent': accent }}`.

### Creating New Full-Screen Components for Single-Use Screens

**What happens:** A new learning component (e.g., `MedievalDiagnosisScene.jsx`) is created as a top-level export for use only in one module.

**Why it's wrong:** The component is not reusable, bloats the component registry, and duplicates patterns that already exist elsewhere (e.g., `CinematicCarousel` or `InteractiveHotspotImage`).

**Do this instead:** Extend or compose existing components. If a genuinely new interaction is needed (e.g., two-phase intro→explore), create it, but ensure it's reusable across at least 3 modules. All new components require a `.stories.jsx` file and educational justification in the module content.

### Logging Directly to localStorage Without the storage.js Wrapper

**What happens:** Code calls `localStorage.setItem()` or `localStorage.getItem()` directly instead of using `src/lib/storage.js`.

**Why it's wrong:** The wrapper provides consistent error handling (no crash if quota exceeded), type conversion helpers (JSON parse/array handling), and a single point to audit and migrate storage logic.

**Do this instead:** Use `src/lib/storage.js` helpers:
```javascript
import { getObject, setJson, getArray } from '../../lib/storage.js'
const data = getObject('gcse_key')
setJson('gcse_key', { ...data, newField: value })
```

### Logging Weaknesses Without the Unified Tracker

**What happens:** A feature calls its own weakness logging logic or invents a new `weakness` field instead of using `unifiedWeaknessTracker.js`.

**Why it's wrong:** Weaknesses recorded outside the canonical tracker don't feed into WeakSpotRecovery, recovery quiz selection, or Pulse stats. The system fragments.

**Do this instead:** Always log via `src/unifiedWeaknessTracker.js`:
```javascript
import { logWrongAnswer, logCorrectAnswer } from '../../unifiedWeaknessTracker.js'
if (correct) {
  logCorrectAnswer(tag, source)
} else {
  logWrongAnswer(tag, source)
}
```

### Importing Full Question Banks at Module Level

**What happens:** A component imports `MATHS_TOPIC_GROUPS` at the top level instead of reading from `TestDataContext`.

**Why it's wrong:** Even though the import is lazy, it ties the chunk size to that component and defeats lazy loading if the component is imported elsewhere.

**Do this instead:** Inside components that only run in ExamMode, use the context:
```javascript
const { MATHS_TOPIC_GROUPS } = useTestData() || {}
```
TestDataContext ensures the data is only loaded when the exam tab is active.

## Error Handling

**Strategy:** Try/catch for browser API calls (localStorage, scrollTo, etc.); console errors for recoverable issues; graceful fallbacks for missing content.

**Patterns:**
- **Storage**: `getProgress()` catches JSON parse errors and returns default structure
- **Module loading**: Failed content load shows ModuleLoadingScreen (retryable via back/exit)
- **Auth**: `signInWithGoogle()` sets `authError` state, shown in LoginScreen UI
- **Scroll**: `scrollToTop()` tries three fallbacks (window.scrollTo, documentElement, body) before giving up silently

## Cross-Cutting Concerns

**Logging:** Implicit via `recordActivity()` (called on every meaningful interaction, login, activity), `recordScore()` (graded answers), `logWrongAnswer()`/`logCorrectAnswer()` (weaknesses).

**Validation:** Learning graph concepts validated at test time (`learning-graph.test.js`); module screenCount/screenTags validated against screens.length; question ids validated via `questionId.js` in QuickFire.

**Authentication:** AuthContext wraps entire app; guards routes with `user?.loggedIn` and `user?.onboardingComplete` checks; Google signin is optional (guest mode supported).

---

*Architecture analysis: 2026-07-09*

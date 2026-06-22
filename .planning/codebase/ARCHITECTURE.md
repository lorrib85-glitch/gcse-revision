<!-- refreshed: 2026-06-22 -->
# Architecture

**Analysis Date:** 2026-06-22

## System Overview

```text
┌──────────────────────────────────────────────────────────────┐
│                  React App Shell (LegacyApp)                 │
│      Routing, auth state, tab orchestration, overlays        │
│              `src/app/LegacyApp.jsx` (420 lines)             │
└────────────┬─────────────────────────────────────────────────┘
             │
       ┌─────┴────────────────────────────────────────┐
       │                                              │
  ┌────▼─────────┐                    ┌──────────────▼──────┐
  │ Tab Views    │                    │  Module Overlays    │
  │ (5 tabs)     │                    │  (Lazy-loaded)      │
  │              │                    │                     │
  │ Home         │                    │ ModulePlayer        │
  │ Subjects     │                    │ ChapterComplete     │
  │ Pulse (90s)  │                    │ (React.lazy bundle) │
  │ Exams        │                    │                     │
  │ QuickFire    │                    │ `src/components/`   │
  └──────────────┘                    └─────────────────────┘
       │                                       │
       │                                       │
  ┌────▼───────────────────────────────┐     │
  │    Feature Components              │     │
  │    `src/features/*/`               │     │
  │                                    │     │
  │ Home.jsx                           │     │
  │ Subjects.jsx                       │     │
  │ Pulse.jsx                          │     │
  │ ExamPractice.jsx                   │     │
  │ QuickFire.jsx                      │     │
  │ dailyPlanner.js (pure logic)       │     │
  └────┬───────────────────────────────┘     │
       │                                       │
       └───────────────┬───────────────────────┘
                       │
       ┌───────────────▼──────────────────────────────┐
       │        Learning Components Layer             │
       │         (62 .jsx files total)                │
       │                                              │
       │ `src/components/core/` — universal UI        │
       │ `src/components/layout/` — module frames     │
       │ `src/components/feedback/` — question/QA     │
       │ `src/components/learning/` — pedagogy blocks │
       └───────────────┬──────────────────────────────┘
                       │
       ┌───────────────▼──────────────────────────────┐
       │         Data & Persistence                   │
       │                                              │
       │ Module metadata & content:                   │
       │   modules.js (lightweight metadata)          │
       │   modules/<subject>.js (full content)        │
       │                                              │
       │ Weak area tracking:                          │
       │   unifiedWeaknessTracker.js (canonical)      │
       │   recovery data in localStorage              │
       │                                              │
       │ Progress & activity:                         │
       │   progress.js (scores, streaks, activity)    │
       │   lib/storage.js (persistence boundary)      │
       │                                              │
       │ Exam/quiz data:                              │
       │   data/*.js (topic banks, past papers)       │
       │   todaysPlan.js (daily planner logic)        │
       └────────────────────────────────────────────┘
                       │
       ┌───────────────▼──────────────────────────────┐
       │         Browser localStorage                 │
       │    (All learner state persisted here)        │
       └────────────────────────────────────────────┘
```

## Component Responsibilities

| Component | Responsibility | File |
|-----------|----------------|------|
| App | Tiny wrapper, renders LegacyApp | `src/App.jsx` |
| LegacyApp | Auth state, tab routing, module opening, overlay management, splash/login/onboarding flows | `src/app/LegacyApp.jsx` |
| BottomNav | Fixed 5-tab navigation (Home / Subjects / 90s / Exams / None for quickfire) | `src/app/BottomNav.jsx` |
| Home | Homepage: greeting, streak chip, today's task carousel | `src/features/home/Home.jsx` |
| ModulesTab (Subjects) | Module browser: subject sections, cards with progress bars, header images | `src/features/subjects/Subjects.jsx` |
| PulseTab (90s Quiz) | Leaderboard, best score, quick-fire mode launcher | `src/features/pulse/Pulse.jsx` |
| ExamPractice | Exam mode: topic selection, timed paper launch, past-paper browser, coach selection | `src/features/exams/ExamPractice.jsx` |
| TestTab/QuickFire | Question player for both 90s quick-fire and exam modes | `src/features/quickfire/QuickFire.jsx` |
| ModulePlayer | In-module orchestrator: routes screen types, manages chapter progression, handles completion | `src/components/layout/ModulePlayer.jsx` |
| AnswerInteraction | LOCKED. Universal answer UI for choice/connection/true-false. Sole handler of answer logic | `src/components/core/AnswerInteraction.jsx` |
| [40 Learning Components] | Pedagogical interaction screens: carousels, timelines, matching, misconception traps, hot-spots, etc. | `src/components/learning/` |

## Pattern Overview

**Overall:** Feature-driven tab shell with lazy-loaded module orchestration and distributed weakness tracking.

**Key Characteristics:**
- **Monolithic app shell**: Single React tree manages all top-level state (auth, tab, active module, overlays)
- **Lazy loading**: `ModulePlayer` and full module content are code-split; exam data is lazy-loaded via context
- **Distributed learning interactions**: 62 components across 4 semantic layers (core, layout, feedback, learning)
- **Canonical weakness tracking**: Single source of truth in `unifiedWeaknessTracker.js`; all question components log through it
- **localStorage persistence**: All learner data (progress, scores, weakness log, module state) persisted via `src/lib/storage.js` — single swap point for future backend migration
- **Pure logic modules**: `todaysPlan.js` and `dailyPlanner.js` are pure functions; no side effects

## Layers

**App Shell & Routing:**
- Purpose: Auth, navigation, tab state, module lifecycle
- Location: `src/app/LegacyApp.jsx`, `src/App.jsx`, `src/auth/`
- Contains: Main router, tab switching, login/onboarding, module loading screen, overlay management
- Depends on: Feature tabs, ModulePlayer, auth context, progress/weakness modules
- Used by: Browser entry point (`src/main.jsx`)

**Feature Tabs (5 tabs):**
- Purpose: Subject area entry points — each tab is its own vertical/feature
- Location: `src/features/home/`, `src/features/subjects/`, `src/features/pulse/`, `src/features/exams/`, `src/features/quickfire/`
- Contains: Layout grids, card renders, data fetches, local UI state for a tab
- Depends on: Constants (theme, spacing, typography), learning components, data/content files
- Used by: LegacyApp tab router

**Module Orchestration:**
- Purpose: Chapter progression, screen routing, module completion tracking, result synthesis
- Location: `src/components/layout/ModulePlayer.jsx` (1200+ lines)
- Contains: Stage navigation, screen type switch, chapter frame selection, result aggregation
- Depends on: All learning components, layout components, weakness tracker, progress
- Used by: LegacyApp overlay when `view === 'module'`

**Learning Components (4 semantic groups):**
- **Core** (`src/components/core/`): Foundation — buttons, headers, answer logic, progress rail, card container
- **Layout** (`src/components/layout/`): Frame components — chapter screens (hook/outcome/complete), content shells
- **Feedback** (`src/components/feedback/`): Result handling — exam question frame, round debrief, retrieval frame
- **Learning** (`src/components/learning/`): Pedagogy — 40+ interaction types (carousels, timelines, matching, misconception traps, etc.)

**Data Layer:**
- Purpose: Content, progress, weakness logs, exam data, learner state
- Location: `src/modules.js`, `src/modules/<subject>.js`, `src/progress.js`, `src/unifiedWeaknessTracker.js`, `src/data/`, `src/lib/storage.js`
- Contains: Lightweight module metadata (MODULES array), full lesson content per subject, progress calculations, weakness aggregation, exam topic banks
- Depends on: Nothing (pure data)
- Used by: All feature/component layers

**Persistence Boundary:**
- Purpose: Centralized localStorage adapter (ready for backend swap)
- Location: `src/lib/storage.js`
- Contains: `getJson()`, `setJson()`, `removeKey()` helpers
- Depends on: Browser localStorage API
- Used by: progress.js, unifiedWeaknessTracker.js, auth service, every component logging data

## Data Flow

### Primary Request Path: Home → Module → Question → Result

1. User lands on Home (`src/features/home/Home.jsx`) → reads streak and builds today's task carousel via `buildTodaysPlan()` (`src/todaysPlan.js`)
2. User taps a task → `handleTodaysPlanSelect()` resolves destination, opens ModulePlayer if module (`src/app/LegacyApp.jsx:311-328`)
3. `openModulePlayer(mod, screenIndex)` calls `loadModuleContent()` which async `import()`s full module from `src/modules/<subject>.js` (`src/app/LegacyApp.jsx:330-343`)
4. ModuleLoadingScreen shown until content arrives; then ModulePlayer renders with `activeModule` set
5. ModulePlayer reads `module.screens[screenIndex]` and routes by `screen.type` to the correct learning component (`src/components/layout/ModulePlayer.jsx:275+`)
6. Learning component renders the interaction and calls `AnswerInteraction` or its own question logic when learner provides answer
7. Answer → `logWrongAnswer()` or `logCorrectAnswer()` via `src/unifiedWeaknessTracker.js` + `recordScore()` via `src/progress.js`
8. Learner navigates to next screen → ModulePlayer increments `screenIndex`, rinse/repeat
9. Chapter complete → `handleChapterComplete()` builds payload and shows `ChapterCompleteScreen` overlay (`src/app/LegacyApp.jsx:291-294`)
10. User taps "Continue" or "Quiz" → navigate to next chapter/module or switch tab

### Exam Mode Request Path: Exams → Quiz Bank Selection → TestTab → Question → Debrief

1. User opens Exams tab (`src/features/exams/ExamPractice.jsx`) → TestDataProvider lazy-loads `mathsTopics.js`, `englishTopics.js`, etc. via Promise.all dynamic imports
2. Exam data loaded and cached in `TestDataContext` (React Context)
3. User selects a topic/quiz → `setTab('exams')` and pass quiz config to `<TestTab>` mode="exam"
4. TestTab player renders adaptive questions from topic bank
5. User answers question → `logWrongAnswer()` or `logCorrectAnswer()` directly to weakness tracker
6. After round → `ExamRoundDebrief` synthesizes patterns and logs exam-technique issues via `logExamTechnique()`
7. Debrief rendered in TestTab with option to "Return to browser" → back to ExamPractice

### Weakness Recovery Path: Weak Topic Detected → Recovery Suggested → Recovery Quiz → Re-attempt

1. `getWeakTopics()` scans `gcse_wrong_answers` in localStorage (via `unifiedWeaknessTracker.js`)
2. Topics with ≥2 wrong answers flagged as weak
3. `getBiggestWin()` finds the highest-impact weak topic for user's next revision
4. Home's today's-plan carousel includes a "Revisit" card pointing to that topic module
5. User opens module → ModulePlayer may show `WeakSpotRecovery` overlay if learner struggles again on that topic
6. WeakSpotRecovery offers a `RecoveryQuizPlayer` (3–4 focused questions from `src/data/recoveryQuizzes.js`)
7. After recovery quiz → weakness log is updated; re-attempt progress tracked

### State Management

- **Session state (React)**: Tab, activeModule, view (overlay kind), examAutoStart — live in LegacyApp component state
- **Learner data (localStorage)**: Progress (streak, scores, topicProgress), wrong answers, correct answers, exam technique patterns, confidence ratings, module screen state
- **Auth state (Context)**: User object (name, loginStatus, onboarding), managed by `AuthProvider` in `src/auth/AuthContext.jsx`
- **Module state (localStorage)**: Per-module screen index saved to `gcse_module_${moduleId}` when module opens, reloaded on re-enter
- **Exam question bank data (Context via TestDataProvider)**: All exam topic banks lazy-loaded once per session and cached in React Context

## Key Abstractions

**Module Shape:**
- Purpose: Define a learning journey with chapters and screens
- Examples: History modules in `src/modules/history.js`, Biology in `src/modules/biology.js`, etc.
- Pattern: `{ id, subject, series, number, title, icon, color, screenCount, screenTags, hook, outcomes, screens, intro, recall }`
- Each `screen` has `{ type, tag?, …screenTypeData }`; type determines which learning component renders it

**Screen Type System:**
- Purpose: Declarative mapping of content data to pedagogy component
- Examples: `type: 'cinematic'` → CinematicRevealMoment; `type: 'matching'` → MatchingTask; `type: 'hotspot'` → InteractiveHotspotImage
- Pattern: ModulePlayer switch statement routes screen type → component; component reads screen data and renders
- Extensions: New screen types added by creating new learning component + adding case in ModulePlayer switch

**Weakness Tracker Entry:**
- Purpose: Persistent record of misconceptions and exam-technique issues
- Shape: `{ timestamp, date, subject, topic, questionId, questionText, marks, source, questionType }`
- Pattern: Every wrong answer logged immediately; aggregated via `getWeakTopics()`, `getExamTechniquePatterns()`
- Recovery: Weak topics feed Home task carousel and WeakSpotRecovery interventions

**Question Bank (Exam Mode):**
- Purpose: Indexed collection of past-paper/topic questions for quiz/exam practice
- Examples: MATHS_TOPIC_GROUPS in `src/data/mathsTopics.js`, ENGLISH_TOPIC_GROUPS in `src/data/englishTopics.js`
- Pattern: `TOPIC_GROUPS[groupId]` → array of `questions[questionId]` → each question has `text, marks, options, correctAnswer, source`
- Lazy: Loaded via TestDataProvider Context only when Exams tab is active

**Daily Plan:**
- Purpose: Personalized revision schedule built fresh each day based on weakness and progress state
- Shape: Array of task cards `[warmupCard, revisitCard, continueModuleCard?, examCard?, weekendPaperCard?]`
- Logic: Pure function `buildTodaysPlan()` in `src/todaysPlan.js` reads progress/weaknesses and synthesizes recommendations

## Entry Points

**Browser Entry:**
- Location: `src/main.jsx`
- Triggers: App loads, browser points to root URL
- Responsibilities: Mount React tree, wrap with ErrorBoundary and AuthProvider, import CSS

**App Shell:**
- Location: `src/App.jsx` (tiny wrapper) → `src/app/LegacyApp.jsx` (main)
- Triggers: Rendered by main.jsx
- Responsibilities: Route between splash (1.4s) → login → onboarding → app shell with tabs

**Tab Entry Points:**
- Home: `src/features/home/Home.jsx` — renders when `tab === 'home'`
- Subjects: `src/features/subjects/Subjects.jsx` — renders when `tab === 'subjects'`
- Pulse (90s): `src/features/pulse/Pulse.jsx` — renders when `tab === 'pulse'`
- Exams: `src/features/exams/ExamPractice.jsx` — renders when `tab === 'exams'`
- QuickFire: `src/features/quickfire/QuickFire.jsx` (TestTab in 'quickfire' mode) — renders when `tab === 'quickfire'`

**Module Player:**
- Location: `src/components/layout/ModulePlayer.jsx`
- Triggers: User taps module card, home task, or weak-area link → `openModule()` in LegacyApp
- Responsibilities: Screen routing by type, chapter progression, result aggregation, completion overlay

## Architectural Constraints

- **Threading:** Single-threaded event loop; all async operations via native Promises or React state
- **Global state:** 
  - `AuthContext` at root (manages user/auth state)
  - Module state per-module in localStorage (survives session)
  - Weakness log in localStorage (canonical; never in-memory)
  - LegacyApp component state holds tab, activeModule, view overlay — session-only (cleared on hard refresh)
  - No Zustand/Redux; data flows through component props and localStorage reads
- **Circular imports:** None detected; clear layer hierarchy: app → features → components → data → lib
- **Module Naming:** Lightweight metadata in `src/modules.js` always; full content in `src/modules/<subject>.js` (per-subject files to enable code-split lazy loading on module open)
- **Lazy Loading:** ModulePlayer is `React.lazy()` bundle; exam data lazy-loaded via TestDataProvider; full module content async-imported by subject when module opens
- **localStorage Limits:** App targets ~5MB quota; currently ~50KB of progress/weakness data; exam banks total ~150KB (lazy-loaded only when needed)

## Anti-Patterns

### Storing session data in localStorage instead of React state

**What happens:** Previous version stored every tab switch, hover state, form input in localStorage, causing constant disk I/O and false "recovery" on new sessions
**Why it's wrong:** Inflates data, slows down app, makes testing hard, violates separation of concerns (session state ≠ learner data)
**Do this instead:** Session state (tab, activeModule, view, examAutoStart) stays in `src/app/LegacyApp.jsx` component state. Only learner data (progress, weakness logs, module screen position) goes to localStorage via `src/lib/storage.js`

### Importing full module content in modules.js

**What happens:** Importing full `{ hook, outcomes, screens, intro, recall }` for all 30 modules at app startup bloats the main bundle to ~300KB before split
**Why it's wrong:** Home, Subjects, Progress tabs do not need full lesson content; they only need metadata (title, icon, progress %). Learner pays the cost even if they never open a module.
**Do this instead:** `src/modules.js` holds lightweight metadata only (id, title, subject, screenCount, screenTags). Full content lives in `src/modules/<subject>.js` and is dynamically imported in `openModulePlayer()` via `SUBJECT_MODULE_LOADERS`, showing ModuleLoadingScreen while it downloads

### Logging weakness without subject/topic context

**What happens:** Components log `logWrongAnswer()` with incomplete metadata, making weak-area routing impossible
**Why it's wrong:** Recovery can't locate the module to revisit if topic is missing; debrief can't synthesize patterns across questions
**Do this instead:** Every call to `logWrongAnswer()` includes `{ subject, topic, questionId, questionText, marks, source, questionType }`. Weakness tracker aggregates by `${subject}/${topic}` and passes this to `findTaggedScreen()` to locate recovery module

### Creating question components for a single screen type

**What happens:** A new interaction built as a standalone component unique to one module, with its own answer logic and validation
**Why it's wrong:** Duplication of answer validation, logging, and UI; impossible to reuse; increases bundle
**Do this instead:** If the interaction is reusable across ≥3 modules/subjects, build it as a new learning component (e.g., MatchingTask, TimelineChain). If it's a one-off, compose it from existing building blocks (AnswerInteraction for the Q&A, CardContainer for layout)

### Wrapping the entire tab tree in TestDataProvider

**What happens:** All exam data (mathsTopics, englishTopics, etc.) loaded and cached as soon as any component reads TestDataContext, even if user never navigates to Exams tab
**Why it's wrong:** Unnecessary download and memory cost; violates lazy-loading principle
**Do this instead:** TestDataProvider wraps only the `tab === 'exams' ? <ExamPractice /> : null` render path. Exams tab does not load unless user navigates to it; data is never fetched otherwise

## Error Handling

**Strategy:** Graceful degradation with user-facing error boundary + silent fallbacks for data operations

**Patterns:**
- ErrorBoundary in `src/main.jsx` catches render crashes and shows a styled error message with copy-to-share instructions
- localStorage reads wrapped in try-catch, defaulting to empty object/array if JSON parse fails
- `safeGetProgress()` in LegacyApp catches any progress read error and returns sensible defaults
- Async module loads wrapped in try-catch; `loadModuleContent()` returns null if subject loader fails, forcing fallback to lightweight metadata
- Auth service failures in `signInWithGoogle()` allow user to retry; stored user state remains intact if network fails
- Missing screen type in ModulePlayer defaults to rendering generic "Screen not found" rather than crashing

## Cross-Cutting Concerns

**Logging:** No external logging service; console warnings for storage failures only. TODO: Add analytics event tracking (mentioned in login screen comment: `TODO: replace signInWithGoogle() with Firebase`)

**Validation:** 
- Module screen structure validated on render (missing type → fallback screen)
- Question answer options validated by AnswerInteraction before accepting input
- Name entry on onboarding requires ≥2 chars; localStorage read validates JSON before parse

**Authentication:** 
- Google OAuth stub (currently `signInWithGoogle()` in `src/auth/authService.js` is a placeholder; TODO comment indicates Firebase migration pending)
- User object stored in localStorage; `onboardingComplete` flag gates app shell
- Session recovery: If stored user exists on app load, skip login screen; re-render onboarding if `onboardingComplete === false`

**Personalization:** 
- Driven by weakness tracking + progress state
- Today's plan (Home carousel) customized per learner via `buildTodaysPlan()` which reads weak topics and in-progress modules
- Recovery quiz suggested based on `getBiggestWin()` 
- Exam technique coaching in `GuidedAnswerCoach` logs patterns via `logExamTechnique()` and triggers `getExamTechniquePatterns()`
- Tab navigation respects last active tab across sessions (not yet implemented; would require session storage)

---

*Architecture analysis: 2026-06-22*

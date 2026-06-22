# Codebase Structure

**Analysis Date:** 2026-06-22

## Directory Layout

```
gcse-revision/
├── src/                              # React source tree
│   ├── main.jsx                      # Entry point: ErrorBoundary + AuthProvider + App
│   ├── App.jsx                       # Tiny wrapper rendering LegacyApp
│   ├── globals.css                   # Cinematic @layer classes (11KB)
│   ├── styles.css                    # App-wide CSS and theme
│   │
│   ├── app/                          # Shell layer — routing & state management
│   │   ├── LegacyApp.jsx            # Main orchestrator: auth, tabs, overlays (420 lines)
│   │   ├── BottomNav.jsx            # Fixed 5-tab bottom nav bar
│   │   └── moduleNavigation.js       # Router helpers: buildChapterCompletePayload, resolveTaskDestination
│   │
│   ├── auth/                         # Authentication & user identity
│   │   ├── AuthContext.jsx           # React Context: user, signInWithGoogle, completeOnboarding
│   │   └── authService.js            # Auth service stub (Google OAuth placeholder)
│   │
│   ├── components/                   # Reusable UI & pedagogy — 62 .jsx files
│   │   ├── core/                    # Foundation components
│   │   │   ├── AnswerInteraction.jsx    # LOCKED. Universal answer logic (choice/connection/TF)
│   │   │   ├── BackButton.jsx           # LOCKED. Only back button allowed
│   │   │   ├── ExitButton.jsx           # LOCKED. Only exit button allowed
│   │   │   ├── ContinueCTA.jsx          # LOCKED. Primary progression CTA
│   │   │   ├── CinematicContinueCTA.jsx # LOCKED. Cinematic "Continue →" prompt
│   │   │   ├── CardContainer.jsx        # LOCKED. Atmospheric content wrapper
│   │   │   ├── LearningHeader.jsx       # Floating capsule header (Back + Exit + Progress)
│   │   │   ├── LearningProgressHeader.jsx # LOCKED. Progress rail + jump sheet
│   │   │   ├── ModuleToolbar.jsx        # LOCKED. Back/exit navigation only
│   │   │   ├── SequenceProgress.jsx     # Progress dot rail (14 dots max)
│   │   │   ├── ScreenText.jsx           # Reusable heading/body text components
│   │   │   └── AnimatedNumber.jsx       # Animated numeric counter
│   │   │
│   │   ├── layout/                   # Module-level frame components
│   │   │   ├── ModulePlayer.jsx      # Orchestrator: routes screen types, manages chapter flow (1200+ lines)
│   │   │   ├── ChapterHookScreen.jsx # Chapter intro + true/false warm-up
│   │   │   ├── ChapterOutcomeScreen.jsx # Chapter outcome reveal
│   │   │   ├── ChapterCompleteScreen.jsx # End-of-chapter completion overlay
│   │   │   ├── CinematicShell.jsx    # Layout wrapper for cinematic screens
│   │   │   ├── ContentShell.jsx      # Layout wrapper for content blocks
│   │   │   └── InteractionShell.jsx  # Layout wrapper for question interactions
│   │   │
│   │   ├── feedback/                 # Question result handling
│   │   │   ├── ExamQuestionFrame.jsx # Universal exam question + mark scheme reveal
│   │   │   ├── ExamRoundDebrief.jsx  # End-of-round feedback; logs exam-technique patterns
│   │   │   └── RetrievalFrame.jsx    # LOCKED. Cinematic wrapper for retrieval moments
│   │   │
│   │   └── learning/                 # 40+ pedagogy interaction components
│   │       ├── AnswerInteraction.jsx     # [see core/]
│   │       ├── MatchingTask.jsx          # Term-to-description pair matching with SVG lines
│   │       ├── TimelineChain.jsx         # Horizontal scroll-snap chain + connectors
│   │       ├── TimelineCanvas.jsx        # Swipe-to-pan timeline with reveal buttons
│   │       ├── CinematicCarousel.jsx     # Full-screen image carousel with navigation
│   │       ├── CinematicRevealMoment.jsx # Full-screen reveal (video/image)
│   │       ├── InteractiveHotspotImage.jsx # Tappable hotspot image
│   │       ├── CircuitDiagram.jsx        # GCSE Physics circuit (open/closed toggle)
│   │       ├── ColSortBlock.jsx          # Column-sort categorisation task
│   │       ├── ConceptReveal.jsx         # Atmospheric concept intro
│   │       ├── FillInTheBlanksBlock.jsx  # Inline fill-in-the-blanks chapter
│   │       ├── GalensDiagnostic.jsx      # Humour-based four-humours diagnostic
│   │       ├── GraphView.jsx             # Embeddable SVG chart (bar/line/scatter/pie)
│   │       ├── GuidedAnswerCoach.jsx     # Exam-technique coach scaffold (8 stages)
│   │       ├── GuidedExamResponse.jsx    # Guided written-answer scaffold
│   │       ├── GuidedChoiceCarousel.jsx  # Scrollable choice carousel with visual cards
│   │       ├── KeyFigureReveal.jsx       # Portrait-hero screen (key person intro)
│   │       ├── ExaminerExplainsScreen.jsx # Full-screen explanation with word-by-word reveal
│   │       ├── ExplainReveal.jsx         # Progressive cause-and-effect chain
│   │       ├── FaceTheExaminer.jsx       # Examiner-style written question + annotation
│   │       ├── InteractiveCollectionExplorer.jsx # Theme explorer with colour-coded sheets
│   │       ├── EvacuationChainRoute.jsx  # Ordered chain: tap job → tap stage
│   │       ├── FactorWeb.jsx             # Relationship diagram (factors/concepts)
│   │       ├── MedicalTheoryPrescription.jsx # Cause → prescription → reveal flow
│   │       ├── MisconceptionCheck.jsx    # True/false misconception trap
│   │       ├── PriorKnowledgeRecall.jsx  # Free-text recall screen; logs missing concepts
│   │       ├── QuickRecallScreen.jsx     # Rapid-fire retrieval (choice + connection)
│   │       ├── RecoveryQuizPlayer.jsx    # Lightweight recovery quiz (3–4 questions)
│   │       ├── SpotTheError.jsx          # Student identifies + explains error
│   │       ├── SwipeSort.jsx             # Swipe-gesture sorting activity
│   │       ├── SymptomProgression.jsx    # Case-file walkthrough of illness stages
│   │       ├── TheoryCompareBlock.jsx    # Side-by-side theory comparison (staggered reveal)
│   │       ├── TheoryLab.jsx             # Multi-part diagnostic linking belief to outcome
│   │       ├── TieredQuizScreen.jsx      # Adaptive quiz progression (3-tier)
│   │       ├── VisualLearning.jsx        # Click-to-continue cinematic scene sequence
│   │       ├── VisualNarrativeScreen.jsx # Beat-based narrative (portraits/timelines/facts)
│   │       ├── WeakSpotRecovery.jsx      # Behavioural intervention when learner struggles
│   │       ├── BeforeAfterImageSlider.jsx # Horizontal slider for comparison images
│   │       ├── DragToOrderTask.jsx       # Drag-to-sort activity
│   │       └── UnifiedQuestionScreen.jsx # Generic question layout
│   │
│   ├── features/                     # Tab-level features (5 tabs)
│   │   ├── home/
│   │   │   ├── Home.jsx              # Tab: greeting, streak chip, today's task carousel
│   │   │   └── StreakChip.jsx        # Streak counter display
│   │   │
│   │   ├── subjects/
│   │   │   └── Subjects.jsx          # Tab: module browser, subject sections, cards with progress
│   │   │
│   │   ├── pulse/
│   │   │   └── Pulse.jsx             # Tab: 90s quiz leaderboard & best score display
│   │   │
│   │   ├── exams/
│   │   │   └── ExamPractice.jsx      # Tab: topic selection, timed papers, coach selection
│   │   │
│   │   ├── quickfire/
│   │   │   └── QuickFire.jsx         # Question player for 90s & exam modes (multimodal)
│   │   │
│   │   └── planner/
│   │       └── dailyPlanner.js       # Pure functions: buildDailyPlan, processPaperResults, etc.
│   │
│   ├── constants/                    # Design tokens & config
│   │   ├── subjects.js               # SUBJECTS, SUBJECT_ACCENTS, SUBJECT_PALETTES, hexToRgb()
│   │   ├── generalTheme.js           # GENERAL — non-subject page colours (Home, Exams, nav)
│   │   ├── spacing.js                # SPACING token object (all margin/padding values)
│   │   ├── motion.js                 # MOTION — durations, easings, scale values
│   │   ├── radii.js                  # RADII — corner radius values
│   │   ├── buttons.js                # BUTTONS — dimensions, states, corner radii
│   │   ├── typography.js             # TYPE — font families, sizes, weights (spread-ready)
│   │   └── componentStyles.js        # Component style constants (shadows, transitions)
│   │
│   ├── data/                         # Content & topic banks (lazy-loaded in Exams mode)
│   │   ├── mathsTopics.js            # MATHS_TOPIC_GROUPS, ALL_MATHS_QUESTIONS
│   │   ├── mathsGroups.js            # MATHS_GROUPS — topic definitions for Subjects browser
│   │   ├── mathsQuestions.js         # AQA past-paper questions
│   │   ├── englishTopics.js          # ENGLISH_TOPIC_GROUPS, ALL_ENGLISH_QUESTIONS
│   │   ├── sociologyTopics.js        # SOCIOLOGY_TOPIC_GROUPS, questions
│   │   ├── sociologyGroups.js        # SOCIOLOGY_GROUPS — definitions for browser
│   │   ├── chemistryTopics.js        # CHEMISTRY_TOPIC_GROUPS, questions
│   │   ├── chemistryGroups.js        # CHEMISTRY_GROUPS
│   │   ├── chemImages.js             # CHEM_IMAGES — maps diagram IDs to /public/figures/ paths
│   │   ├── physicsTopics.js          # PHYSICS_TOPIC_GROUPS — Foundation past-papers
│   │   ├── biologyGroups.js          # BIOLOGY_GROUPS — 7 topic definitions
│   │   ├── guidedAnswerCoach.js      # GUIDED_COACH_TYPES — exam-technique scaffold content
│   │   ├── medicineExamPapers.js     # Edexcel GCSE History past-paper sources
│   │   ├── quickQuizData.js          # QUICK_QUIZ_QUESTIONS — 90s quiz bank
│   │   ├── recoveryQuizzes.js        # Recovery quiz definitions (3–4 focused questions)
│   │   ├── tagModuleMap.js           # TAG_MODULE_MAP, findTaggedScreen() — weak-area routing
│   │   └── [legacy files]            # Some files may be unused (see CONCERNS.md)
│   │
│   ├── modules/                      # Full module content (subject-specific, lazy-loaded)
│   │   ├── history.js                # HISTORY_MODULES — all History episodes with full screens
│   │   ├── biology.js                # BIOLOGY_MODULES
│   │   ├── maths.js                  # MATHS_MODULES
│   │   ├── sociology.js              # SOCIOLOGY_MODULES
│   │   └── chemistry.js              # CHEMISTRY_MODULES
│   │
│   ├── modules.js                    # MODULES — lightweight metadata for all 30 modules
│   ├── progress.js                   # Progress tracking: getProgress, recordScore, recordActivity
│   ├── unifiedWeaknessTracker.js     # CANONICAL weakness tracker: logWrongAnswer, getWeakTopics
│   ├── todaysPlan.js                 # Pure logic: buildTodaysPlan(), picks daily tasks
│   ├── contentIndex.js               # CONTENT_INDEX — topic tag → section metadata mapping
│   ├── sociologyKeyTerms.js          # AQA GCSE Sociology vocabulary list
│   ├── figures.js                    # FIGURES — figure image paths
│   │
│   └── lib/                          # Utilities & persistence boundary
│       ├── storage.js                # Persistence layer: getJson, setJson, removeKey (localStorage adapter)
│       └── utils.js                  # Miscellaneous helpers
│
├── public/                           # Static assets
│   ├── logo.png                      # RISE logo (teal glow)
│   ├── mystery-cube.png              # Locked/mystery module card image
│   ├── headers/                      # Hero images for module/subject cards
│   │   ├── history-*.png             # History series & per-module cards
│   │   ├── bio-*.png                 # Biology group & overview cards
│   │   ├── pulse-*.png               # Feature cards
│   │   └── [other subjects]
│   └── figures/                      # Inline content diagrams (chemistry, biology)
│       ├── *.png / *.webp
│
├── .planning/                        # GSD planning directory (added by this mapper)
│   └── codebase/
│       ├── ARCHITECTURE.md           # [this file]
│       └── STRUCTURE.md              # [this file]
│
├── .claude/                          # Claude Code configuration
│   ├── skills/                       # Project-specific skills (if any)
│   └── settings.json                 # Claude Code settings
│
├── tests/                            # Vitest test files (optional; see TESTING.md)
│   ├── architecture/                 # Architecture validation tests
│   └── [feature tests]
│
├── .storybook/                       # Storybook config
├── docs/                             # Project documentation (system/, components/, etc.)
├── package.json                      # Dependencies (React, Vite, Radix, Tailwind, etc.)
└── vite.config.js                    # Vite build config
```

## Directory Purposes

**`src/app/`**
- Purpose: Application shell — top-level routing, auth state, tab navigation, overlay management
- Contains: LegacyApp orchestrator, BottomNav component, module navigation helpers
- Key files: `LegacyApp.jsx` (420 lines — main state machine)

**`src/auth/`**
- Purpose: User authentication and identity
- Contains: AuthContext provider, auth service stub (Google OAuth placeholder, TODO: Firebase)
- Key files: `AuthContext.jsx` (manages user state across app)

**`src/components/`**
- Purpose: Reusable UI and pedagogical interaction components (62 .jsx files)
- Contains: 4 semantic layers (core foundation, layout frames, feedback handlers, learning interactions)
- Key constraint: All standalone components live here; do NOT add .jsx files directly to `src/`

**`src/features/`**
- Purpose: Tab-level entry points and feature-specific UI
- Contains: One directory per tab (home, subjects, pulse, exams, quickfire); planner utilities
- Key pattern: Each feature is relatively small; fat logic lives in lib/ and data/ layers
- Key files: `Home.jsx`, `Subjects.jsx`, `ExamPractice.jsx`, `QuickFire.jsx`

**`src/constants/`**
- Purpose: Design tokens and configuration — single source of truth for spacing, colours, motion, typography
- Contains: 8 .js files exporting object tokens (never hardcode magic numbers in components)
- Key constraint: Always import from here; never redefine colours/spacing/radii locally

**`src/data/`**
- Purpose: Content, topic banks, past-paper data, exam configurations
- Contains: 15+ .js files with exported constants (MATHS_TOPIC_GROUPS, ENGLISH_TOPIC_GROUPS, etc.)
- Key pattern: Lazy-loaded via dynamic import in ExamPractice (TestDataProvider); only loaded when Exams tab is active
- Key constraint: No mutation; pure data only

**`src/modules/`**
- Purpose: Full lesson content for modules, split by subject for lazy-loading
- Contains: 5 .js files (history.js, biology.js, maths.js, sociology.js, chemistry.js)
- Key pattern: Each exports SUBJECT_MODULES array with full { id, screens[], hook, outcomes, recall }
- Key constraint: Dynamically imported by `loadModuleContent()` when module opens; not imported at app startup

**`src/lib/`**
- Purpose: Utility functions and persistence boundary
- Contains: `storage.js` (localStorage adapter, ready for backend swap), `utils.js` (misc helpers)
- Key constraint: All learner data reads/writes go through `storage.js`

## Key File Locations

**Entry Points:**
- `src/main.jsx`: React tree root; ErrorBoundary, AuthProvider, App mount
- `src/App.jsx`: Tiny wrapper → LegacyApp
- `src/app/LegacyApp.jsx`: Main orchestrator; auth, tabs, overlays, module lifecycle

**Configuration:**
- `src/globals.css`: Cinematic @layer classes (11KB; foundation for all cinematic screens)
- `src/styles.css`: App-wide CSS
- `src/constants/`: All design tokens (colors, spacing, motion, typography)
- `.storybook/`: Storybook dev environment config

**Core Logic:**
- `src/progress.js`: Progress tracking (streak, scores, activity)
- `src/unifiedWeaknessTracker.js`: Weakness tracking (canonical; all wrong answers logged here)
- `src/todaysPlan.js`: Daily planner (pure logic; builds Home task carousel)
- `src/modules.js`: Lightweight module metadata

**Testing:**
- `src/features/planner/dailyPlanner.js`: Pure functions suitable for unit tests
- `tests/architecture/`: Architecture validation tests

## Naming Conventions

**Files:**
- `.jsx` — React components (one component per file, PascalCase)
- `.js` — Logic/data modules (camelCase)
- `.css` — Stylesheets
- `.stories.jsx` — Storybook stories (paired with component)

**Directories:**
- `src/components/[semantic-layer]/` — Components grouped by role (core, layout, feedback, learning)
- `src/features/[tab-name]/` — Tab-specific features (home, subjects, pulse, exams, quickfire)
- `src/modules/` — Full module content per subject
- `src/data/` — Content/config constants

**Component Naming:**
- PascalCase for all React components (e.g., `AnswerInteraction`, `TimelineChain`, `ModulePlayer`)
- Suffixes for specific types:
  - `*Screen.jsx` — Full-screen components (Chapter screens, splash screen)
  - `*Block.jsx` — Content blocks within screens (FillInTheBlanksBlock)
  - `*Task.jsx` — Interactive activities (MatchingTask, ColSortBlock)
  - `*Frame.jsx` — Question frames (ExamQuestionFrame, RetrievalFrame)
  - `*Carousel.jsx` — Horizontal scroll/swipe (CinematicCarousel, GuidedChoiceCarousel)

**Data/Constants Naming:**
- UPPERCASE with underscores for exported constants (e.g., `MODULES`, `SUBJECTS_ACCENTS`, `SPACING`, `MATHS_TOPIC_GROUPS`)
- camelCase for exported functions (e.g., `buildTodaysPlan`, `getProgress`, `logWrongAnswer`)
- lowercase for internal helpers (e.g., `hexToRgb()`, `todayStr()`)

## Where to Add New Code

**New Learning Component (pedagogy interaction):**
- File location: `src/components/learning/<ComponentName>.jsx`
- Add corresponding story if visual: `src/components/learning/<ComponentName>.stories.jsx`
- If reusable across ≥3 modules/subjects, create here; else compose from existing
- Import core components (AnswerInteraction, CardContainer, LearningHeader)
- Add case in `ModulePlayer.jsx` switch statement to route screen type to component
- Example: A new "matching with images" interaction → `src/components/learning/ImageMatchingTask.jsx`

**New Data/Content File:**
- File location: `src/data/<topicName>.js` (lowercase, dash-separated)
- Export constants in UPPERCASE (e.g., `export const PHYSICS_TOPICS = [...]`)
- For large topic banks used only in Exams tab, use dynamic import in TestDataProvider
- For small/reused content, static import is fine
- Example: Adding GCSE Physics past papers → `src/data/physicsTopics.js`

**New Feature Tab:**
- Scaffold directory: `src/features/<tabName>/`
- Main component: `src/features/<tabName>/<TabName>.jsx` (matches tab id)
- If complex (>400 lines), split into sub-components in same directory
- Add tab object in BottomNav `tabs` array, update NavIcon switch statement
- Update LegacyApp render to include new tab case
- Example: Adding a Study Guides tab → `src/features/guides/Guides.jsx` + BottomNav entry

**New Module Content:**
- Location: `src/modules/<subject>.js` (e.g., `src/modules/physics.js` for new subject)
- Structure: Export `SUBJECT_MODULES = [{ id, subject, title, icon, color, screenCount, screenTags, hook, outcomes, screens, intro, recall }, ...]`
- Add metadata entry to `src/modules.js` (id, title, subject, color, screenCount, screenTags)
- Add subject loader to SUBJECT_MODULE_LOADERS in LegacyApp
- Each screen has { type, tag?, ...screenTypeData }; type routes to learning component
- Example: Adding a Physics module → `src/modules/physics.js` + entry in MODULES + loader

**New Weakness Tracking Category:**
- Extend `src/unifiedWeaknessTracker.js`: Add new logging function (e.g., `logMisconception()`)
- Update tag vocabulary in `src/data/tagModuleMap.js` to route new category to recovery module
- Update `WeakSpotRecovery.jsx` or `ExamRoundDebrief.jsx` to synthesize new patterns
- Example: Tracking "problem setup" errors → Add tag in tagModuleMap, log via new function, suggest recovery

**New Utility/Helper:**
- File location: `src/lib/<moduleName>.js` or extend existing `src/lib/utils.js`
- Pure functions only; no side effects
- Export in UPPERCASE if constant, camelCase if function
- Example: Date helpers → `src/lib/dates.js`

**Storage/Persistence Extension:**
- File location: Extend `src/lib/storage.js` if it's a storage operation
- Do NOT use localStorage directly; go through storage.js helpers
- If adding a new data type, define its key constant at top of the module that uses it
- Example: Adding exam-attempt history → `const EXAM_ATTEMPTS_KEY = 'gcse_exam_attempts'` in progress.js

## Special Directories

**`public/`:**
- Purpose: Static assets served by Vite dev server and bundled in production build
- Generated: No (all committed)
- Committed: Yes
- Structure: `/logo.png`, `/headers/` (hero images), `/figures/` (inline diagrams)
- Note: Both `.png` and `.webp` acceptable; `.webp` preferred for new images

**`.storybook/`:**
- Purpose: Storybook dev environment config
- Generated: No (Storybook CLI creates initial setup)
- Committed: Yes
- Key files: `config.js` (story discovery), `preview.js` (global decorators, theme)

**`tests/`:**
- Purpose: Vitest test files
- Generated: No (manually created)
- Committed: Yes
- Structure: Mirror src/ layout (e.g., `tests/features/` mirrors `src/features/`)

**`.planning/`:**
- Purpose: GSD workspace — planning docs, graphs, phase tracking
- Generated: Yes (by `/gsd-map-codebase`, `/gsd-plan-phase`, etc.)
- Committed: Yes (part of project context)
- Key files: `.planning/codebase/` (ARCHITECTURE.md, STRUCTURE.md, etc.)

**`.claude/`:**
- Purpose: Claude Code harness configuration and project skills
- Generated: Partially (settings.json created by harness; skills by team)
- Committed: Yes
- Key files: `settings.json` (allowlist, hooks), `skills/` (project-specific skill definitions)

---

*Structure analysis: 2026-06-22*

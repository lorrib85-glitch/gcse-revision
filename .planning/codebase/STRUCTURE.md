# Codebase Structure

**Analysis Date:** 2026-07-09

## Directory Layout

```
gcse-revision/
├── .planning/                  # Planning & documentation directory
├── .claude/                    # Claude Code project config
├── .github/                    # GitHub Actions workflows
├── .storybook/                 # Storybook configuration
├── .journey/                   # Project journey/milestones
├── api/                        # API endpoints (Node.js functions)
├── docs/                       # Product & system documentation
├── eslint-rules/               # Custom ESLint rule plugins
├── public/                     # Static assets (logos, headers, figures)
│   ├── logo.png                # RISE teal logo
│   ├── headers/                # Subject/module hero images
│   ├── English/                # English-specific assets
│   ├── figures/                # Chemistry/biology diagrams
│   └── mystery-cube.png        # Locked module placeholder
├── scripts/                    # Build and utility scripts
├── src/                        # Source code (React + helpers)
│   ├── App.jsx                 # Root component wrapper
│   ├── modules.js              # Module metadata registry (all 30 lessons)
│   ├── progress.js             # Progress tracking & streak logic
│   ├── unifiedWeaknessTracker.js  # Weakness logging system
│   ├── todaysPlan.js           # Daily revision planner
│   ├── contentIndex.js         # Concept → module lookup
│   ├── figures.js              # Figure/diagram asset paths
│   ├── sociologyKeyTerms.js    # Sociology GCSE vocabulary
│   │
│   ├── app/                    # App shell & orchestration
│   │   ├── LegacyApp.jsx       # MAIN: Auth gating, tab routing, overlays
│   │   ├── BottomNav.jsx       # Fixed 5-tab navigation
│   │   └── moduleNavigation.js # Screen routing helpers
│   │
│   ├── auth/                   # Authentication
│   │   ├── AuthContext.jsx     # Auth state provider
│   │   ├── authService.js      # Login/logout, Google OAuth
│   │   ├── firebaseClient.js   # Firebase initialization
│   │   └── progressStatus.js   # Auth status helpers
│   │
│   ├── components/             # All React components
│   │   ├── core/               # Foundation components (nav, header, CTAs)
│   │   │   ├── AnswerInteraction.jsx  # LOCKED: universal answer UI
│   │   │   ├── BackButton.jsx         # LOCKED: only back navigation allowed
│   │   │   ├── ContinueCTA.jsx        # LOCKED: primary progression CTA
│   │   │   ├── ExitButton.jsx         # LOCKED: only exit navigation allowed
│   │   │   ├── LearningHeader.jsx     # Floating capsule header + progress
│   │   │   ├── LearningProgressHeader.jsx  # LOCKED: progress rail
│   │   │   ├── KeyPoint.jsx           # Callout box for key concepts
│   │   │   ├── WorkedExample.jsx      # Worked example wrapper
│   │   │   ├── TeachScreenShell.jsx   # Teaching screen container
│   │   │   ├── MediaPlaceholder.jsx   # Image/video placeholder
│   │   │   ├── SequenceProgress.jsx   # Dot indicator for screen order
│   │   │   ├── ScoreNumberLine.jsx    # Score visualization
│   │   │   ├── CircularTimer.jsx      # Countdown timer
│   │   │   ├── AnimatedNumber.jsx     # Number counter animation
│   │   │   └── CardContainer.jsx      # Atmospheric content surface
│   │   │
│   │   ├── layout/             # Module-level orchestration
│   │   │   ├── ModulePlayer.jsx       # MAIN: In-module flow, screen routing
│   │   │   ├── ChapterHookScreen.jsx  # Chapter intro with warm-up
│   │   │   ├── ChapterCompleteScreen.jsx  # Chapter end screen
│   │   │   ├── ChapterOutcomeScreen.jsx   # Learning outcomes reveal
│   │   │   ├── ContentShell.jsx       # Content wrapper
│   │   │   ├── InteractionShell.jsx   # Interaction wrapper
│   │   │   ├── CinematicShell.jsx     # Cinematic rendering wrapper
│   │   │   └── ScreenTextBlock.jsx    # Text content block
│   │   │
│   │   ├── learning/           # 40+ learning interaction components
│   │   │   ├── QuickRecallScreen.jsx      # Rapid-fire retrieval
│   │   │   ├── CinematicRevealMoment.jsx  # Video/image reveal
│   │   │   ├── ConceptReveal.jsx          # Concept intro
│   │   │   ├── ExplainReveal.jsx          # Step-by-step reasoning
│   │   │   ├── TimelineChain.jsx          # Scroll-snap timeline
│   │   │   ├── TimelineCanvas.jsx         # Pan-across timeline
│   │   │   ├── MatchingTask.jsx           # Card-pair matching
│   │   │   ├── EvacuationChainRoute.jsx   # Ordered chain activity
│   │   │   ├── ColSortBlock.jsx           # Column categorization
│   │   │   ├── SwipeSort.jsx              # Swipe gesture sorting
│   │   │   ├── CircuitDiagram.jsx         # Physics circuit SVG
│   │   │   ├── GraphView.jsx              # Embedded charts
│   │   │   ├── MisconceptionCheck.jsx     # True/false trap
│   │   │   ├── SpotTheError.jsx           # Error identification
│   │   │   ├── FaceTheExaminer.jsx        # Written exam Q&A
│   │   │   ├── GuidedExamResponse.jsx     # Guided answer scaffold
│   │   │   ├── InteractiveHotspotImage.jsx # Tap-to-explore image
│   │   │   ├── FillInTheBlanksBlock.jsx   # Inline blanks filling
│   │   │   ├── KeyFigureReveal.jsx        # Portrait hero bio
│   │   │   ├── GuidedChoiceCarousel.jsx   # Single-choice carousel
│   │   │   ├── VisualNarrativeScreen.jsx  # Narrative beat screen
│   │   │   ├── VisualLearning.jsx         # Scene sequence
│   │   │   ├── TheoryCompareBlock.jsx     # Side-by-side compare
│   │   │   ├── TheoryLab.jsx              # Diagnostic scenario
│   │   │   ├── BeforeAfterImageSlider.jsx # Image slider
│   │   │   ├── InteractiveCollectionExplorer.jsx  # Theme explorer
│   │   │   ├── PriorKnowledgeRecall.jsx   # Free-text recall
│   │   │   ├── SymptomProgression.jsx     # Case-file walkthrough
│   │   │   ├── MedievalDiagnosisScene.jsx # SVG chamber + tappable zones
│   │   │   ├── MedicalTheoryPrescription.jsx  # Prescription flow
│   │   │   ├── GalensDiagnostic.jsx       # Humour-based diagnostic
│   │   │   ├── CinematicCarousel.jsx      # Deep-dive carousel
│   │   │   ├── ExaminerExplainsScreen.jsx # Animated reveal + narration
│   │   │   ├── GuidedAnswerCoach.jsx      # Multi-stage exam technique
│   │   │   ├── WeakSpotRecovery.jsx       # Intervention screen
│   │   │   ├── RecoveryQuizPlayer.jsx     # 3–4 focused questions
│   │   │   ├── FactorWeb.jsx              # Causal relationships
│   │   │   ├── ConnectionMap.jsx          # Mind map / concept network
│   │   │   ├── QuoteAnalyser.jsx          # Quote analysis task
│   │   │   ├── TieredQuizScreen.jsx       # Difficulty-tiered Q&A
│   │   │   ├── DragToOrderTask.jsx        # Drag-to-order activity
│   │   │   ├── faceTheExaminer/          # Subcomponents for FaceTheExaminer
│   │   │   │   ├── FaceTheExaminerContainer.jsx
│   │   │   │   ├── FaceTheExaminerMain.jsx
│   │   │   │   ├── FaceTheExaminerIntro.jsx
│   │   │   │   ├── AnswerPanel.jsx
│   │   │   │   ├── MarkingPanel.jsx
│   │   │   │   ├── FaceTheExaminerDone.jsx
│   │   │   │   └── utils.js
│   │   │   └── *.stories.jsx            # Storybook files for components
│   │   │
│   │   └── feedback/            # Question feedback & debriefing
│   │       ├── RetrievalFrame.jsx        # LOCKED: retrieval wrapper
│   │       ├── ExamQuestionFrame.jsx     # Exam question + mark scheme
│   │       └── ExamRoundDebrief.jsx      # End-of-round synthesis
│   │
│   ├── constants/               # Design tokens & configuration
│   │   ├── subjects.js          # Subject palettes & SUBJECT_ACCENTS
│   │   ├── typography.js        # TYPE tokens (Manrope/Sora)
│   │   ├── spacing.js           # SPACING tokens
│   │   ├── motion.js            # MOTION tokens (durations, easings)
│   │   ├── buttons.js           # BUTTONS tokens
│   │   ├── radii.js             # RADII tokens
│   │   ├── generalTheme.js      # Non-subject page theme (Home, Subjects, etc.)
│   │   └── subjectBackdrops.js  # Subject-specific backdrop images
│   │
│   ├── content/                # Lesson content (per-module files)
│   │   ├── history/
│   │   │   ├── medicine/
│   │   │   │   └── episodes/     # e.g., episode-01-trust-me.js (7 episodes)
│   │   │   ├── usa/
│   │   │   │   └── episodes/     # e.g., episode-01-a-nation-born.js
│   │   │   └── spain-new-world/
│   │   │       └── episodes/     # e.g., episode-01-conquistadors.js
│   │   ├── biology/
│   │   │   ├── cell-biology/episodes/
│   │   │   ├── organisation/episodes/
│   │   │   ├── infection-and-response/episodes/
│   │   │   ├── homeostasis/episodes/
│   │   │   ├── inheritance-variation-evolution/episodes/
│   │   │   └── ecology/episodes/
│   │   ├── chemistry/
│   │   │   ├── atomic-structure/episodes/
│   │   │   ├── chemical-changes/episodes/
│   │   │   ├── rates-and-organic/episodes/
│   │   │   └── chemistry-of-the-atmosphere/episodes/
│   │   ├── maths/
│   │   │   └── foundations/episodes/
│   │   ├── english/
│   │   │   └── macbeth/episodes/
│   │   └── sociology/
│   │       └── families/episodes/
│   │
│   ├── data/                   # Question banks & reference data
│   │   ├── tagModuleMap.js         # Weakness tag → module lookup
│   │   ├── guidedAnswerCoach.js    # Exam technique templates
│   │   ├── recoveryQuizzes.js      # Recovery quiz definitions
│   │   ├── quickQuizData.js        # 90s Quiz question bank
│   │   ├── medicineExamPapers.js   # Edexcel History past papers
│   │   │
│   │   ├── mathsTopics.js          # AQA Maths topic groups & questions
│   │   ├── mathsQuestions.js       # Maths formula sheet & questions
│   │   ├── mathsGroups.js          # Maths topic group UI definitions
│   │   │
│   │   ├── englishTopics.js        # AQA English topics & questions
│   │   │
│   │   ├── sociologyTopics.js      # AQA Sociology topics & questions
│   │   ├── sociologyGroups.js      # Sociology topic group UI definitions
│   │   │
│   │   ├── chemistryTopics.js      # AQA Chemistry topics & questions
│   │   ├── chemistryGroups.js      # Chemistry topic group UI definitions
│   │   ├── chemImages.js           # Chemistry diagram asset paths
│   │   │
│   │   ├── physicsTopics.js        # AQA Physics topics & questions
│   │   │
│   │   ├── biologyGroups.js        # Biology topic group UI definitions
│   │   │
│   │   ├── componentFunctions.js   # Utility functions (deprecated pattern)
│   │   │
│   │   ├── contentSupport/        # Concept repair & gap support
│   │   │   └── (concept files)
│   │   │
│   │   ├── examPapers/            # Exam paper structure data
│   │   │   └── sociology/
│   │   │
│   │   ├── learningGraph/         # Concept registry & resolution
│   │   │   ├── concepts/          # Concept id definitions
│   │   │   └── (resolution logic)
│   │   │
│   │   ├── masteryEngine/         # Learner mastery tracking
│   │   │   └── (mastery state)
│   │   │
│   │   ├── progressSync/          # Google user progress sync
│   │   │   └── progressSync.js
│   │   │
│   │   └── questionBanks/         # Organized question data
│   │       ├── english/
│   │       ├── history/
│   │       ├── maths/
│   │       └── science/
│   │           └── biology/
│   │
│   ├── features/                # Feature-specific screens & logic
│   │   ├── home/                # Home tab
│   │   │   ├── Home.jsx         # Home screen: greeting, streak, task carousel
│   │   │   └── StreakChip.jsx   # Streak display component
│   │   │
│   │   ├── subjects/            # Subjects/modules browser
│   │   │   └── Subjects.jsx     # ModulesTab screen
│   │   │
│   │   ├── pulse/               # Progress/stats tab
│   │   │   └── Pulse.jsx        # PulseTab: improvements & weak spots
│   │   │
│   │   ├── quickfire/           # 90s Quiz & Exam Mode
│   │   │   ├── QuickFire.jsx        # TestTab orchestrator
│   │   │   ├── testDataContext.jsx  # Test data lazy-loading context
│   │   │   ├── utils.js             # QuickFire utilities
│   │   │   ├── components/
│   │   │   │   ├── FormulaSheet.jsx         # Maths formula display
│   │   │   │   ├── QuickFireQuestionScreen.jsx  # Question UI
│   │   │   │   └── CircularTimer.jsx       # Round timer
│   │   │   ├── logic/
│   │   │   │   ├── selectQuestions.js      # Adaptive question selection
│   │   │   │   ├── quickFireSelector.js    # Selector state management
│   │   │   │   ├── convertBankQuestion.js  # Question format conversion
│   │   │   │   ├── questionId.js           # Question id parsing
│   │   │   │   ├── masteryRecorder.js      # Mastery recording (Phase 3A)
│   │   │   │   └── questionId.js
│   │   │   └── modes/
│   │   │       ├── QuickFireMode.jsx       # 90s Quiz mode
│   │   │       ├── ExamMode.jsx            # Timed exam mode
│   │   │       ├── TopicPracticeMode.jsx   # Topic-specific practice
│   │   │       ├── MathsBrowser.jsx        # Maths topic browser
│   │   │       ├── MathsTopicView.jsx      # Maths topic questions
│   │   │       └── MathsQuestion.jsx       # Maths question display
│   │   │
│   │   ├── exams/               # Exam practice (past papers)
│   │   │   └── ExamPractice.jsx # Exam browser & auto-start
│   │   │
│   │   ├── exampaper/           # Exam paper runner
│   │   │   ├── ExamPaperRunner.jsx
│   │   │   ├── ExamPaperSection.jsx
│   │   │   ├── ExamPaperQuestion.jsx
│   │   │   ├── ExamPaperMarking.jsx
│   │   │   ├── ExamPaperDebrief.jsx
│   │   │   ├── ExamPaperSource.jsx
│   │   │   └── useExamPaperState.js
│   │   │
│   │   ├── planner/             # Daily revision planner
│   │   │   └── dailyPlanner.js  # Adaptive planner logic
│   │   │
│   │   ├── streaks/             # Streak celebration
│   │   │   ├── StreakCelebrationOverlay.jsx
│   │   │   └── streakCelebrationStorage.js
│   │   │
│   │   └── moduleContentRegistry.js  # MODULE_CONTENT_LOADERS mapping
│   │
│   ├── lib/                    # Utility library
│   │   └── storage.js          # localStorage wrapper (getObject, setJson, etc.)
│   │
│   └── globals.css             # Cinematic CSS classes (@layer components)
│
├── tests/                      # Unit & architecture tests
│   ├── unit/                   # Pure function tests
│   │   ├── app/
│   │   ├── auth/
│   │   ├── modulePlayer/
│   │   ├── planner/
│   │   ├── quickfire/
│   │   ├── streaks/
│   │   ├── contentSupport/
│   │   ├── priorKnowledgeRecall/
│   │   ├── masteryEngine/
│   │   ├── progressSync/
│   │   └── todaysPlan.test.js
│   │
│   └── architecture/           # Contract & constraint tests
│       ├── learning-graph.test.js      # Concept registry validation
│       ├── concept-reveal-contract.test.js
│       ├── mastery-engine.test.js      # Mastery engine allowlist
│       ├── content-support-episode01.test.js
│       └── placeholder-module-safety.test.js
│
├── vite.config.js              # Vite build config
├── vitest.config.js            # Vitest test config
├── eslint.config.js            # ESLint rules
├── index.html                  # HTML entry point
├── jsconfig.json               # JS/JSX path config
├── package.json                # Dependencies & scripts
├── pnpm-lock.yaml              # Lockfile
├── CLAUDE.md                   # Project instructions (THIS FILE)
├── BRAND.md                    # Design & brand reference
├── COMPONENTS.md               # Component registry
├── firestore.rules             # Firestore security rules
└── README.md                   # (if exists)
```

## Directory Purposes

**`.planning/codebase/`:**
- Purpose: Generated codebase analysis documents (ARCHITECTURE.md, STRUCTURE.md, CONVENTIONS.md, etc.)
- Contains: Markdown reference files for the planner/executor
- Key files: ARCHITECTURE.md, STRUCTURE.md, CONVENTIONS.md, TESTING.md, CONCERNS.md

**`api/`:**
- Purpose: Serverless API endpoints (Node.js/Express)
- Contains: Backend logic for auth, progress sync, AI endpoints
- Generated/deployed: Via Vercel or similar

**`docs/`:**
- Purpose: Product design & system architecture documentation
- Key files: `docs/system/PRODUCT_UI_CONSTITUTION.md` (design law), `docs/system/COMPONENT_AUTHORING_RULES.md`, `docs/system/HISTORY_MODULE_ARCHITECTURE.md`, `docs/system/SCIENCE_MODULE_BLUEPRINT.md`

**`public/`:**
- Purpose: Static assets served directly by the web server
- Key files: `logo.png` (RISE teal logo), `headers/` (subject hero images), `figures/` (chemistry/biology diagrams)

**`src/app/`:**
- Purpose: Application shell & orchestration
- Key files: `LegacyApp.jsx` (MAIN), `BottomNav.jsx`, `moduleNavigation.js`

**`src/components/`:**
- Purpose: All React components organized by type
- Subdirs:
  - `core/` (7 LOCKED, 15+ reusable foundation components)
  - `layout/` (module-level orchestration: ModulePlayer, ChapterHookScreen, etc.)
  - `learning/` (40+ learning interaction types: TimelineChain, MatchingTask, etc.)
  - `feedback/` (question feedback & debriefing)

**`src/constants/`:**
- Purpose: Centralized design tokens (no hardcoded values in components)
- Key files: `subjects.js` (colour palettes), `typography.js` (TYPE tokens), `spacing.js`, `motion.js`

**`src/content/`:**
- Purpose: Lesson content definitions (one file per module)
- Structure: `src/content/${subject}/${topic}/episodes/${id}.js` exports `{ id, subject, screens, hook, recall, outcomes, intro }`
- Pattern: All new modules use per-module files. Legacy subject bundles (biology.js, maths.js, etc.) are pending migration.

**`src/data/`:**
- Purpose: Question banks, exam papers, concept registry, mastery engine, reference data
- Key files: `guidedAnswerCoach.js` (exam technique), `recoveryQuizzes.js`, `quickQuizData.js`, `*Topics.js` (subject questions)
- Lazy-loaded: Test data (mathsTopics.js, englishTopics.js, etc.) loaded via TestDataContext only when exam tab is active

**`src/features/`:**
- Purpose: Feature-specific screens and orchestration
- Subdirs: `home/` (Home tab), `subjects/` (ModulesTab), `pulse/` (PulseTab), `quickfire/` (90s Quiz + Exam Mode), `exams/` (Exam Practice), `planner/` (Daily planner), `streaks/` (Celebrations)

**`src/lib/`:**
- Purpose: Low-level utility functions
- Key files: `storage.js` (localStorage wrapper with error handling)

**`tests/`:**
- Purpose: Unit tests (pure functions) and architecture tests (contracts, constraints)
- Subdirs: `unit/` (feature tests), `architecture/` (learning-graph.test.js, mastery-engine.test.js)

## Key File Locations

**Entry Points:**
- `index.jsx` → `src/App.jsx` → `src/app/LegacyApp.jsx` (main app shell)
- `src/features/home/Home.jsx` (Home tab entry)
- `src/features/subjects/Subjects.jsx` (Subjects tab entry)
- `src/features/quickfire/QuickFire.jsx` (90s Quiz / Exam Mode entry)
- `src/components/layout/ModulePlayer.jsx` (in-module orchestration)

**Configuration:**
- `vite.config.js` (build, alias, external-dependency rules)
- `vitest.config.js` (test runner config)
- `eslint.config.js` (linting rules)
- `jsconfig.json` (path aliases)
- `.storybook/` (Storybook config for component previews)

**Core Logic:**
- `src/progress.js` (progress tracking, streak, score recording)
- `src/unifiedWeaknessTracker.js` (weakness logging & retrieval)
- `src/todaysPlan.js` (daily revision planner)
- `src/features/planner/dailyPlanner.js` (planner state & build logic)
- `src/app/moduleNavigation.js` (screen routing helpers)

**Testing:**
- `tests/unit/` (unit tests for pure functions)
- `tests/architecture/` (contract tests: learning-graph.test.js, mastery-engine.test.js)

**Reference & Design:**
- `CLAUDE.md` (project instructions — READ BEFORE ANY WORK)
- `BRAND.md` (design reference)
- `COMPONENTS.md` (component registry)
- `docs/system/PRODUCT_UI_CONSTITUTION.md` (design law)
- `docs/system/HISTORY_MODULE_ARCHITECTURE.md` (History-specific rules)
- `docs/system/SCIENCE_MODULE_BLUEPRINT.md` (Science-specific rules)

## Naming Conventions

**Files:**
- `.jsx` for React components
- `.js` for pure functions / data / utilities
- `.stories.jsx` for Storybook files (one per component, same directory)
- `.test.js` for unit tests
- `kebab-case` for filenames (e.g., `daily-planner.js`, `quick-fire.jsx`)
- Episode content: `episode-NN-slug.js` (e.g., `episode-01-trust-me.js`)

**Directories:**
- `kebab-case` for feature/topic directories (e.g., `src/features/quickfire`, `src/content/chemistry/atomic-structure`)
- `PascalCase` avoided in directory names (use only for component names within JSX files)

**Components:**
- `PascalCase` for component names (e.g., `ModulePlayer`, `QuickRecallScreen`)
- LOCKED components marked in component registry (must not modify internals)
- Reusable components live in `src/components/`; never add `.jsx` files directly to `src/`

**Functions:**
- `camelCase` for all functions (e.g., `recordActivity()`, `getProgress()`)
- Helper functions in same file or co-located utility file
- Exported helpers documented with JSDoc

**Constants:**
- `UPPER_SNAKE_CASE` for exported constants (e.g., `MODULES`, `SUBJECT_ACCENTS`, `SPACING`, `TYPE`)
- Subject accents: `SUBJECT_ACCENTS.Biology`, `SUBJECT_ACCENTS.History`, etc.

**Module IDs:**
- Format: `subject:course:concept` (e.g., `history:medicine:galen`, `biology:cell:mitochondria`)
- Registered in `src/data/learningGraph/concepts/`; never invent new ids outside the registry

## Where to Add New Code

**New Learning Component (30+ screen types):**
- Primary code: `src/components/learning/${ComponentName}.jsx`
- Storybook: `src/components/learning/${ComponentName}.stories.jsx` (required)
- Register in ModulePlayer: Import at top, add to screen type router
- Guidelines: Reusable across 3+ modules, pure learning mechanic, educational justification in module content

**New Feature Tab:**
- Primary code: `src/features/${featureName}/${ScreenName}.jsx`
- Context (if needed): Define provider and hooks alongside
- Register in LegacyApp: Add tab routing, BottomNav entry
- Example: Home tab = `src/features/home/Home.jsx` + `src/features/home/StreakChip.jsx`

**New Data/Content Module:**
- Per-module file: `src/content/${subject}/${topic}/episodes/${id}.js` exporting `{ id, subject, screens, hook, recall, outcomes, intro, examiner?, ... }`
- Metadata entry: Add to `MODULES` array in `src/modules.js` with `id, subject, title, screenCount, screenTags`
- Register loader: Add entry to `MODULE_CONTENT_LOADERS` in `src/content/moduleContentRegistry.js`
- Use `/module-creation <id>` skill to automate this setup

**New Question Bank or Exam Paper:**
- New subject topics: `src/data/${subject}Topics.js` exporting `${SUBJECT}_TOPIC_GROUPS`, `ALL_${SUBJECT}_QUESTIONS`, etc.
- Lazy-load in TestDataContext: Add dynamic import to `testDataContext.jsx`
- Past papers: `src/data/examPapers/${subject}/` (e.g., `medicineExamPapers.js`)

**New Weakness Category or Recovery Quiz:**
- Weakness tag: Add to concept registry `src/data/learningGraph/concepts/`
- Recovery quiz: `src/data/recoveryQuizzes.js` with `recoveryQuizId` entry
- Log via unifiedWeaknessTracker: `logWrongAnswer(tag)`, `logCorrectAnswer(tag)`
- Build recovery quiz selector: Update `buildTodaysPlan()` in `src/features/planner/dailyPlanner.js`

**New Utility Function:**
- Shared helpers: `src/lib/` (e.g., `storage.js`)
- Feature-specific: Co-located with feature (e.g., `utils.js` in feature directory)
- Pure functions: No side effects, fully tested, exported for reuse
- Example: `src/features/quickfire/logic/selectQuestions.js`

**New Test:**
- Unit test: `tests/unit/${area}/${name}.test.js` (pure function tests)
- Architecture test: `tests/architecture/${contract}.test.js` (constraint validation)
- Example: `tests/unit/planner/dailyPlanner.test.js`

## Special Directories

**`.planning/codebase/`:**
- Purpose: Generated documents (read by `/gsd-plan-phase` and `/gsd-execute-phase`)
- Generated: ARCHITECTURE.md, STRUCTURE.md, CONVENTIONS.md, TESTING.md, CONCERNS.md
- Committed: Yes, regenerated when codebase structure changes

**`src/content/*/episodes/`:**
- Purpose: Per-module lesson content files
- Generated: No (authored manually, use `/module-creation` skill to scaffold)
- Committed: Yes
- Pattern: Each `.js` file is one lesson module, named `episode-NN-slug.js`, exports default object

**`public/headers/` and `public/figures/`:**
- Purpose: Static image assets referenced by content
- Generated: No (uploaded manually or via CI)
- Committed: No (stored in `/public`, served by build system)
- Format: `.png` and `.webp` accepted; `.webp` preferred for new assets

**`docs/system/`:**
- Purpose: Product & system design documentation (READ BEFORE ANY UI CHANGE)
- Files: PRODUCT_UI_CONSTITUTION.md (design law), COMPONENT_AUTHORING_RULES.md, HISTORY_MODULE_ARCHITECTURE.md, SCIENCE_MODULE_BLUEPRINT.md
- Committed: Yes
- Authority: These documents override local conventions; consult before any design decision

**`tests/architecture/`:**
- Purpose: Contract tests validating learning graph, mastery engine, and module safety
- Pattern: Ensures concept ids are registered, mastery writes are guarded, module metadata is in sync
- Committed: Yes (run on every commit via pre-commit hook)

---

*Structure analysis: 2026-07-09*

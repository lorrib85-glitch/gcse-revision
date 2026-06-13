# Component Registry

**Last updated:** 2026-06-06  
**Scope:** All standalone components in `src/components/`

---

## How to Use This Registry

Before building anything new, check this registry. If a component already covers your use case — use it. If it doesn't quite fit, adapt it. Only build new components for genuinely distinct learning beats.

---

## `src/components/core/`

Foundation components used by many others. Handle atomic UI concerns.

### AnswerInteraction — **LOCKED**

**File:** `src/components/core/AnswerInteraction.jsx`  
**Purpose:** Universal answer UI for all question types (choice, connection, true/false). The single component that handles all answer logic across the product.  
**Props:** `block`, `subject`, `onAnswer`, `onContinue`  
**Lock reason:** Owns all answer interaction logic. Changing internals risks breaking answer flow across every question type.

---

### BackButton — **LOCKED**

**File:** `src/components/core/BackButton.jsx`  
**Purpose:** The only back-navigation button allowed anywhere in the app. 40×40 pill, near-invisible fill/border, left chevron only, no label, identical hover/press opacity.  
**Props:** `onClick`, `ariaLabel` (default `'Go back'`), `style` (layout overrides only — position/margin/zIndex)  
**Lock reason:** Constitutional rule — every back-navigation control in the product must use this component. No inline back-button implementations are allowed.

---

### CardContainer — **LOCKED**

**File:** `src/components/core/CardContainer.jsx`  
**Purpose:** Atmospheric content surface wrapper. Provides a consistent card shell with optional background image, subject glow, and cinematic atmosphere.  
**Props:** `subject`, `backgroundImage`, `children`, `style`  
**Lock reason:** Visual contract for all content surfaces. Changing it would cascade to all cards in the product.

---

### LearningHeader

**File:** `src/components/core/LearningHeader.jsx`  
**Purpose:** Floating capsule header shell for learning screens. Composes `BackButton` (back navigation) and `LearningProgressHeader` (progress display).  
**Props:** `module`, `progress`, `currentStep`, `totalSteps`, `onBack`, `onExit`  
**Dependencies:** `BackButton`, `LearningProgressHeader`, `SUBJECTS`

---

### LearningProgressHeader — **LOCKED**

**File:** `src/components/core/LearningProgressHeader.jsx`  
**Purpose:** Progress rail and jump sheet display. Shows current position within a module. Display only — owns no interaction logic.  
**Props:** `progress`, `currentStep`, `totalSteps`, `steps`  
**Lock reason:** Core navigation affordance. Visual contract is established and relied upon across learning flow.

---

### ModuleToolbar — **LOCKED**

**File:** `src/components/core/ModuleToolbar.jsx`  
**Purpose:** Back and exit navigation buttons for learning screens. Navigation only — no learning logic. Back button delegates to `BackButton`.  
**Props:** `onBack`, `onExit`  
**Dependencies:** `BackButton`  
**Lock reason:** Navigation contract. Changing button positions or behaviour breaks muscle memory.

---

## `src/components/learning/`

Screen-level learning interaction components. Each is a distinct learning beat.

### CinematicRevealMoment

**File:** `src/components/learning/CinematicRevealMoment.jsx`  
**Purpose:** Full-screen cinematic video or image reveal moment. Atmospheric, single-focus, high-emotion screen.  
**Props:** `block`, `subject`, `onContinue`, `onBack`  
**Dependencies:** `SUBJECTS`, `MOTION`

---

### ConceptReveal

**File:** `src/components/learning/ConceptReveal.jsx`  
**Purpose:** Concept introduction with atmospheric reveal. Introduces a new idea cinematically before quiz questions.  
**Props:** `block`, `subject`, `onContinue`, `onBack`  
**Dependencies:** `SUBJECTS`, `MOTION`

---

### ExplainReveal

**File:** `src/components/learning/ExplainReveal.jsx`  
**What it is:** Progressive step-by-step reasoning chain with tap-to-reveal steps.  
**Best used for:** Teaching cause-and-effect logic (e.g., "Wrong belief → Wrong treatment → Patient harm"). Teaches the reasoning chain, not just facts.  
**Props:** `block`, `subject`, `onContinue`, `onBack`  
**Dependencies:** `SUBJECTS`, `MOTION`

---

### FaceTheExaminer

**File:** `src/components/learning/FaceTheExaminer.jsx`  
**Purpose:** Examiner-style written question interaction. Presents a structured exam question with model answer reveal.  
**Props:** `block`, `subject`, `onContinue`, `onBack`  
**Dependencies:** `SUBJECTS`

---

### FillInTheBlanksBlock

**File:** `src/components/learning/FillInTheBlanksBlock.jsx`  
**Purpose:** Inline fill-in-the-blanks interaction. Learner taps word slots and fills gaps from a word bank.  
**Props:** `block`, `subject`, `onComplete`, `onBack`  
**Dependencies:** `SUBJECTS`, `MOTION`, `RADII`

---

### InteractiveHotspotImage

**File:** `src/components/learning/InteractiveHotspotImage.jsx`  
**Purpose:** Full-screen image with tappable hotspots. Two-phase: intro reveal → explore hotspots. Used for diagrams and labelling tasks.  
**Props:** `block`, `subject`, `onContinue`, `onBack`  
**Dependencies:** `SUBJECTS`, `MOTION`

---

### QuickRecallScreen

**File:** `src/components/learning/QuickRecallScreen.jsx`  
**Purpose:** Rapid-fire retrieval screen for choice and connection questions. Fast-paced sequence with immediate feedback.  
**Props:** `block`, `subject`, `onComplete`, `onBack`  
**Dependencies:** `SUBJECTS`, `AnswerInteraction`

---

### PriorKnowledgeRecall

**File:** `src/components/learning/PriorKnowledgeRecall.jsx`  
**Purpose:** Full-screen chapter-opening recall screen. Student writes free-text recall of the previous chapter. Claude (via `/api/recall`) scores each expected concept 0.0–1.0. Missing concepts (score < 0.3) are logged to the weakness tracker, feeding `WeakSpotRecovery` and future retrieval. Results are shown in three colour-coded groups: recalled (teal), partial (amber), gaps (muted).  
**Props:** `block`, `subject`, `onContinue`, `onBack`  
**Block shape:** `{ type: 'priorKnowledgeRecall', chapterTitle, prompt?, backgroundImage?, concepts: [{ tag, label, keywords[] }] }`  
**Screen type:** `priorKnowledgeRecall`  
**Dependencies:** `SUBJECTS`, `SPACING`, `MOTION`, `RADII`, `TYPE`, `weaknessTracker`, `/api/recall`

---

### RecoveryQuizPlayer

**File:** `src/components/learning/RecoveryQuizPlayer.jsx`  
**Purpose:** Lightweight recovery quiz player (3–4 focused questions). Launched from WeakSpotRecovery for targeted remediation.  
**Props:** `quizId`, `subject`, `onComplete`, `onBack`  
**Dependencies:** `SUBJECTS`, `AnswerInteraction`, `recoveryQuizzes.js`

---

### WeakSpotRecovery

**File:** `src/components/learning/WeakSpotRecovery.jsx`  
**Purpose:** Full-screen behavioural intervention screen shown when a learner struggles. Presents the weak topic with explanation and a recovery CTA. Calm, non-punitive.  
**Props:** `block`, `subject`, `progress`, `onBack`, `onFixWeakSpot`, `onSkip`  
**Dependencies:** `SUBJECTS`, `SPACING`, `MOTION`, `RADII`, `TYPE`

---

### ColSortBlock

**File:** `src/components/learning/ColSortBlock.jsx`  
**What it is:** Interactive categorisation task where learners sort items into labelled columns.  
**Best used for:** Grouping concepts into categories (e.g., "Supernatural vs Natural causes", "Treatments vs Prevention methods"). Tap-to-select with visual feedback.  
**Props:** `block`, `subject`, `onComplete`  
**Dependencies:** `SUBJECTS`, `MOTION`

---

### DragToOrderTask

**File:** `src/components/learning/DragToOrderTask.jsx`  
**What it is:** Drag-to-reorder component for arranging items in sequence.  
**Best used for:** Chronological ordering tasks (e.g., timeline events, historical figures in order, process steps). Uses native HTML5 drag-and-drop. Logs answers to weakness tracker.  
**Props:** `items`, `subject`, `onComplete`, `backgroundImage`  
**Data shape:** `items: [{ id, label, description? }, ...]` (order in array = correct sequence)  
**Dependencies:** `SUBJECTS`, `MOTION`, `SPACING`, `unifiedWeaknessTracker`

---

### ExaminerExplainsScreen

**File:** `src/components/learning/ExaminerExplainsScreen.jsx`  
**Purpose:** Full-screen explanatory screen with animated word-by-word text reveal and atmospheric background image. Used to deliver post-question insight in a cinematic way.  
**Props:** `screen`, `subject`, `onContinue`  
**Dependencies:** `SUBJECTS`, `MOTION`

---

### GalensDiagnostic

**File:** `src/components/learning/GalensDiagnostic.jsx`  
**Purpose:** Humour-based diagnostic scenario that walks learners through Galen's theory of the four humours with animated phases and decision points.  
**Props:** `block`, `subject`, `onContinue`  
**Dependencies:** `SUBJECTS`, `MOTION`, `SPACING`

---

### GraphView

**File:** `src/components/learning/GraphView.jsx`  
**What it is:** Embeddable SVG chart block — bar, line, scatter, or pie — rendered inline within a content screen.  
**Best used for:** Displaying GCSE Maths/Science data (frequency tables, linear/real-life graphs, scatter graphs with line of best fit, proportion/probability pie charts) alongside a question elsewhere on the screen (e.g. an `ExamQuestionFrame`/`quiz` block that says "use the graph to find..."). Purely a data display — does not log to the weakness tracker itself.  
**Props:** `block`, `subject` (defaults to `Maths`)  
**Block shape:** `{ type: 'graphView', graphType: 'bar'|'line'|'scatter'|'pie', title?, caption?, xLabel?, yLabel?, data?: [{label, value}], points?: [{x, y}], lineOfBestFit?: {from: {x,y}, to: {x,y}}, xMin?, xMax?, yMin?, yMax? }`  
**Screen type:** `graphView` (content block, rendered inside `Screen` in `ModulePlayer.jsx`)  
**Dependencies:** `SUBJECTS`, `SPACING`, `MOTION`, `TYPE`, `CardContainer`

---

### GuidedChoiceCarousel

**File:** `src/components/learning/GuidedChoiceCarousel.jsx`  
**Purpose:** Horizontally scrollable single-choice carousel with atmospheric visual option cards. Used for healer/role selection scenes. The chosen option is passed to `onContinue` so downstream screens can personalise content.  
**Props:** `subject`, `headline`, `question`, `helperText`, `promptVisual`, `options`, `onBack`, `onContinue(nextScreenId, selectedOption)`  
**Dependencies:** `SUBJECTS`, `SPACING`, `MOTION`, `RADII`, `TYPE`

---

### InteractiveCollectionExplorer

**File:** `src/components/learning/InteractiveCollectionExplorer.jsx`  
**Purpose:** Theme-based explorer where learners browse colour-coded content sheets. Supports fuzzy-match text input validation for active recall moments.  
**Props:** `screen`, `subject`, `onComplete`  
**Dependencies:** `SUBJECTS`, `MOTION`

---

### MatchingTask

**File:** `src/components/learning/MatchingTask.jsx`  
**What it is:** Card-pair matching activity with visual connector lines.  
**Best used for:** Linking terms to definitions, concepts to examples, or causes to effects (e.g., "Medieval beliefs" ↔ "Treatments"). Splits large sets into rounds. One-retry mechanism.  
**Props:** `screen`, `subject`, `onComplete`  
**Screen data shape:** `{ pairs: [{ id, term, answer, weakGroup }], backgroundImage }`  
**Dependencies:** `MOTION`, `unifiedWeaknessTracker`

---

### MedicalTheoryPrescription

**File:** `src/components/learning/MedicalTheoryPrescription.jsx`  
**Purpose:** Three-phase cause → prescription → reveal flow. Learner selects a theory, fills inputs on a parchment surface (fuzzy-match validated), then sees correct treatments revealed. Personalises heading if a `selectedHealer` prop is passed from GuidedChoiceCarousel.  
**Props:** `screen`, `selectedHealer`, `onComplete`  
**Dependencies:** `SUBJECTS`, `SPACING`, `MOTION`, `TYPE`

---

### MisconceptionCheck

**File:** `src/components/learning/MisconceptionCheck.jsx`  
**What it is:** Cinematic true/false misconception trap checker.  
**Best used for:** Catching common false beliefs (e.g., "Galen was never wrong" — FALSE). Full-screen, one statement at a time. Calm, non-punitive reveals. Logs to weakness tracker.  
**Props:** `block`, `subject`, `onContinue`  
**Block shape:** `{ type: 'misconceptionCheck', statements: [{ statement, answer: true|false, reveal, examTrap? }] }`  
**Dependencies:** `SUBJECTS`, `SPACING`, `MOTION`, `RADII`, `TYPE`, `BUTTONS`, `unifiedWeaknessTracker`

---

### SpotTheError

**File:** `src/components/learning/SpotTheError.jsx`  
**What it is:** Error identification and correction activity — find the mistake, explain it, rewrite correctly.  
**Best used for:** Precision-checking misconceptions or calculation errors. Teaches diagnosis (finding errors) not just recognition (knowing answers). Logs multiple weakness types.  
**Props:** `block`, `subject`, `onContinue`  
**Block shape:** `{ type: 'spotTheError', prompt?, statement, errorTarget, whatWasWrong, examinerNote, correctVersion, commonTrap, keyTerms? }`  
**Dependencies:** `SUBJECTS`, `SPACING`, `MOTION`, `RADII`, `TYPE`, `BUTTONS`, `unifiedWeaknessTracker`

---

### SwipeSort

**File:** `src/components/learning/SwipeSort.jsx`  
**What it is:** Swipe-gesture categorisation activity with cards dragged into zones.  
**Best used for:** Binary or multi-way classification (e.g., "Supernatural vs Natural" causes). Mobile-friendly drag interaction. Fast-paced categorisation tasks.  
**Props:** `block`, `subject`, `onComplete`  
**Dependencies:** `SUBJECTS`, `MOTION`

---

### TheoryCompareBlock

**File:** `src/components/learning/TheoryCompareBlock.jsx`  
**Purpose:** Side-by-side comparison of two historical theories or positions with staggered fade-in animation. Used inside standard content screens as a `theoryCompare` block type.  
**Props:** `block`, `subject`  
**Dependencies:** `SUBJECTS`, `MOTION`

---

### TheoryLab

**File:** `src/components/learning/TheoryLab.jsx`  
**Purpose:** Multi-part diagnostic scenario that links a historical belief to its treatment logic and real-world outcome. Guides learners through the internal reasoning of a theory.  
**Props:** `block`, `subject`, `onContinue`  
**Dependencies:** `SUBJECTS`, `MOTION`, `SPACING`

---

### VisualNarrativeScreen

**File:** `src/components/learning/VisualNarrativeScreen.jsx`  
**Purpose:** Beat-based narrative screen that sequences portrait, timeline, fact, and conclusion beats with tap-through progression. Used for multi-step historical storytelling.  
**Props:** `subject`, `beats`, `onRevealStart`, `onContinue`  
**Dependencies:** `SUBJECTS`, `MOTION`

---

## `src/components/layout/`

Module-level orchestration and chapter framing screens.

### ChapterCompleteScreen

**File:** `src/components/layout/ChapterCompleteScreen.jsx`  
**Purpose:** End-of-chapter completion screen with score and stats. Emotional beat — acknowledges progress without being childish.  
**Props:** `subject`, `chapterTitle`, `score`, `totalQuestions`, `onContinue`, `onReview`  
**Dependencies:** `SUBJECTS`, `MOTION`, `RADII`

---

### ChapterHookScreen

**File:** `src/components/layout/ChapterHookScreen.jsx`  
**Purpose:** Chapter intro hook screen with a true/false warm-up statement. Sets the emotional context before the chapter begins.  
**Props:** `subject`, `chapterNum`, `chapterTitle`, `statement`, `isTrue`, `accentWords`, `explanation`, `onBack`, `onContinue`  
**Dependencies:** `SUBJECTS`, `MOTION`, `RADII`

---

### ChapterOutcomeScreen

**File:** `src/components/layout/ChapterOutcomeScreen.jsx`  
**Purpose:** Chapter outcome reveal screen. Shows learner performance with cinematic context.  
**Props:** `subject`, `chapterTitle`, `onContinue`, `onBack`  
**Dependencies:** `SUBJECTS`

---

### ModulePlayer

**File:** `src/components/layout/ModulePlayer.jsx`  
**Purpose:** In-module lesson flow orchestrator. Routes between all block types based on module screen data.  
**Props:** `moduleId`, `onComplete`, `onBack`  
**Dependencies:** All learning + feedback components

---

## `src/components/feedback/`

Question feedback and exam practice components.

### ExamQuestionFrame

**File:** `src/components/feedback/ExamQuestionFrame.jsx`  
**Purpose:** Universal exam question component with mark scheme reveal. Presents structured exam questions with marks, model answers, and AQA-style formatting.  
**Props:** `block`, `subject`, `onContinue`, `onBack`  
**Dependencies:** `SUBJECTS`

---

### RetrievalFrame — **LOCKED**

**File:** `src/components/feedback/RetrievalFrame.jsx`  
**What it is:** Cinematic wrapper for spaced-retrieval practice questions.  
**Best used for:** Testing knowledge recall in a low-pressure moment. Wraps any question type with atmospheric framing. No penalty for wrong answers.  
**Props:** `block`, `subject`, `progress`, `onAnswer`, `onContinue`, `onBack`  
**Lock reason:** Visual contract for all retrieval screens. Changing it risks inconsistency across all question presentations.  
**Dependencies:** `AnswerInteraction`, `SUBJECTS`

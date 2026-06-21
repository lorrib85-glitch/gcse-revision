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

### CinematicContinueCTA — **LOCKED**

**File:** `src/components/core/CinematicContinueCTA.jsx`  
**Purpose:** The only Cinematic Reveal CTA implementation allowed anywhere in the app — see `docs/system/BUTTON_RADII_SYSTEM.md` "Progression CTA System". Plain centred "Continue →" text, fixed to the bottom of a full-screen cinematic moment, with a fade-in + idle pulse.  
**Props:** `onClick`, `accent`, `animation` (default `'crm-fade 700ms ease both, crm-pulse 2.8s ease-in-out 900ms infinite'`), `style` (layout overrides only — position, animation, zIndex; never new typography, spacing or colour logic)  
**Used by:** `CinematicRevealMoment`, `ExaminerExplainsScreen`  
**Lock reason:** Constitutional rule — every cinematic "Continue →" prompt in the product must use this component. No inline implementations are allowed.

---

### ContinueCTA — **LOCKED**

**File:** `src/components/core/ContinueCTA.jsx`  
**Purpose:** The only Primary Progression CTA implementation allowed anywhere in the app — see `docs/system/BUTTON_RADII_SYSTEM.md` "Progression CTA System". 56px tall, `RADII.large`, solid accent fill, `#0D0F14` text, "Continue" label, with built-in press-scale feedback.  
**Props:** `onClick`, `label` (default `'Continue'`), `accent`, `disabled`, `disabledBackground`, `disabledColor`, `textColor`, `onMouseEnter`, `onMouseLeave`, `style` (layout overrides only — width/flex, margin, position, animation, transition; never new height, radius, font or colour logic)  
**Used by:** every screen-to-screen "Continue" button across `src/components/learning/` and `src/components/feedback/`, plus `ModulePlayer`'s bottom navigation (also covers the "Finish ✓" label via `label`)  
**Lock reason:** Constitutional rule — every Primary Progression CTA in the product must use this component. No inline implementations are allowed.

---

### ExitButton — **LOCKED**

**File:** `src/components/core/ExitButton.jsx`  
**Purpose:** The only exit-navigation button allowed anywhere in the app. 44×44, near-invisible "X" icon, opacity/scale press feedback.  
**Props:** `onClick`, `ariaLabel` (default `'Exit chapter'`), `style` (layout overrides only — position/margin/zIndex)  
**Lock reason:** Constitutional rule — every exit-navigation control in the product must use this component. No inline exit-button implementations are allowed.

---

### LearningHeader

**File:** `src/components/core/LearningHeader.jsx`  
**Purpose:** Single-row floating capsule header shell for learning screens: `[back] [stage rail] [n/total] [exit]`. Composes `BackButton` (back navigation), `LearningProgressHeader` (stage rail) and `ExitButton` (exit navigation).  
**Props:** `module`, `currentStage`, `onBack`, `onExit`, `visible`, `onJumpOpen`, `screenPos`  
**Dependencies:** `BackButton`, `ExitButton`, `LearningProgressHeader`, `SUBJECT_ACCENTS`/`hexToRgb`

---

### LearningProgressHeader — **LOCKED**

**File:** `src/components/core/LearningProgressHeader.jsx`  
**Purpose:** Progress rail and jump sheet display. Shows current position within a module. Display only — owns no interaction logic.  
**Props:** `progress`, `currentStep`, `totalSteps`, `steps`  
**Lock reason:** Core navigation affordance. Visual contract is established and relied upon across learning flow. This is also the only progress-bar implementation allowed for module screens — no inline progress bars.

---

### ModuleToolbar — **LOCKED**

**File:** `src/components/core/ModuleToolbar.jsx`  
**Purpose:** Back and exit navigation buttons for learning screens. Navigation only — no learning logic. Delegates to `BackButton` and `ExitButton`.  
**Props:** `onBack`, `onExit`  
**Dependencies:** `BackButton`, `ExitButton`  
**Lock reason:** Navigation contract. Changing button positions or behaviour breaks muscle memory.

---

### SequenceProgress — **LOCKED CORE UTILITY**

**File:** `src/components/core/SequenceProgress.jsx`  
**Purpose:** Local sequence progress through a short sequence inside a learning component. Provides consistent dot and sash indicators for carousels, image sets, swipe cards, mini-steps, and question sets.  
**Use for:** carousels, image sets, swipe cards, multi-question task progress, mini-step progress inside a learning component, small viewed/current/remaining indicators  
**Do NOT use for:** top module progress rail, chapter navigation, global app progress (use `LearningProgressHeader` for those)  
**Props:** `total`, `current` (zero-based, default 0), `completed` (count, default 0), `viewed` (index array for non-linear flows, default []), `accent`, `accentRgb`, `variant` (`'dots'` | `'sash'`, default `'dots'`), `compact` (boolean, default false), `ariaLabel`  
**Approved variants:**
- `dots` — default. 20×8px accent pill for current, 8px muted-accent circle for done/viewed, 8px muted-white for future. `compact` reduces to 16×6px pill and 6px circles.
- `sash` — thin horizontal segments (3px, or 2px when compact). Accent for current, muted accent for done/viewed, muted white for future. Use where dots are too subtle (longer flows, step interactions).  
**Behaviour:** display only — no navigation. `viewed` array takes priority over `completed` count when supplied. `current` is zero-based.  
**Hard rule:** Never renders numbers, labels, counters, percentages, or "x of y" — no exceptions.  
**Rule:** Do not create local `ProgressDots` or one-off carousel dots anywhere in the codebase. Use this component instead.  
**Used by:** `QuickRecallScreen`, `CinematicCarousel`, `VisualLearning`, `GuidedChoiceCarousel`

---

## `src/components/learning/`

Screen-level learning interaction components. Each is a distinct learning beat.

### CinematicCarousel

**File:** `src/components/learning/CinematicCarousel.jsx`  
**What it is:** Full-screen "deep dive" carousel — one large image at a time (`objectFit: contain`, so any aspect ratio works), with glass prev/next arrow buttons either side. A name + key-facts panel below slides in to match the navigation direction (`key={index}` remount + direction-aware slide-in animation). Progress dots track which items have been viewed; Continue unlocks once every item has been seen at least once.  
**Best used for:** Browsing a small related set of things in turn, each worth a focused look — e.g. the organelles inside a cell, the planets of the solar system, the stages of a specialised cell. Designed for cinematic single-item focus, not for scanning a large list.  
**Props:** `block`, `subject` (defaults to `Biology`), `onContinue`  
**Block shape:** `{ type: 'cinematicCarousel', title?, intro?, items: [{ id, image, label, facts: string[] }] }`  
**Screen type:** `cinematicCarousel` (full-screen, routed directly in `ModulePlayer.jsx` like `TimelineCanvas`)  
**Dependencies:** `SUBJECTS`, `SPACING`, `MOTION`, `RADII`

---

### CinematicRevealMoment

**File:** `src/components/learning/CinematicRevealMoment.jsx`  
**Purpose:** Full-screen cinematic video or image reveal moment. Atmospheric, single-focus, high-emotion screen.  
**Props:** `block`, `subject`, `onContinue`, `onBack`  
**Dependencies:** `SUBJECTS`, `MOTION`

---

### CircuitDiagram

**File:** `src/components/learning/CircuitDiagram.jsx`  
**Purpose:** Renders a GCSE Physics simple series circuit (battery, wire loop, bulb, switch) as inline SVG primitives — not a static image. Open vs closed is driven by a single `closed` prop: when closed the switch arm bridges both contacts, an animated cyan current overlay flows around the loop, and the bulb glows warm amber; when open the arm is raised, the current overlay is hidden, and the bulb is dim. Restrained Physics blue/cyan glow only; the moving current animation is disabled under `prefers-reduced-motion`.  
**Props:** `closed` (boolean)  
**Dependencies:** `SUBJECTS` (Physics palette); injects animation/glow CSS classes once via an `ensureStyles()` `<style>` block (same pattern as `GraphView`).

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

### EvacuationChainRoute

**File:** `src/components/learning/EvacuationChainRoute.jsx`  
**Screen type:** `evacuationChainRoute`  
**What it is:** Ordered chain activity — learner taps a job card then taps the stage slot it belongs to. Amber vertical route line connects numbered nodes on the left; dark military field-tag cards sit to the right. Checks all slots at once; correct slots glow amber, wrong slots dim and can be retried.  
**Best used for:** Recalling the steps or stages of a process in order — evacuation chains, scientific processes, historical sequences.  
**Props:** `screen`, `subject`, `onComplete`  
**Screen data shape:**
```js
{
  type: 'evacuationChainRoute',
  title, subtitle, backgroundImage,
  stages: [{ id, icon, title, clue, answerId }],  // icon: 'helmet'|'cross'|'hut'|'train'
  answers: [{ id, text }],
}
```
**Interaction:** tap pool card to select → tap stage slot to place; tap filled slot (no selection) to unplace; tapping filled slot while selected swaps them. Pool cards ghost at 38% opacity when placed.  
**Dependencies:** `MOTION`, `CinematicShell`, `ContinueCTA`, `unifiedWeaknessTracker`  
**Do not use when:** The relationship between items is unordered (use `MatchingTask` instead).

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

### TimelineCanvas

**File:** `src/components/learning/TimelineCanvas.jsx`  
**What it is:** Full-screen "swipe to pan" canvas — natively horizontally-scrollable wide canvas of step cards connected by curved SVG paths and connector dots; the user pans with a 1:1 finger swipe. Each connector line draws itself in (and its dot lights up) as the pan position passes over it. A bouncing "Swipe to explore →" hint fades once panning begins. Tapping a card's "+" opens a "Why it mattered" detail panel below the canvas (gated continue, like `TimelineChain`).  
**Best used for:** A deliberately different rhythm to `TimelineChain` — an occasional "jarring" interruption to vary pacing between chapter moments, reusing the same kind of causal-chain content. Not for routine use; the spring/bounce motion is an intentional one-off exception to the Motion Rules (documented in-file).  
**Props:** `block`, `subject` (defaults to `History`), `onContinue`  
**Block shape:** `{ type: 'timelineCanvas', title?, intro?, steps: [{ id?, icon?, image?, label, detail, stats?: [string, string] }] }`  
**Screen type:** `timelineCanvas` (full-screen, routed directly in `ModulePlayer.jsx` like `TimelineChain`)  
**Dependencies:** `SUBJECTS`, `SPACING`, `MOTION`, `RADII`

---

### TimelineChain

**File:** `src/components/learning/TimelineChain.jsx`  
**What it is:** Full-screen horizontal scroll-snap chain of flip cards connected by a connector rail (line segments + dot per card).  
**Best used for:** A chapter's "big idea" causal sequence, step by step (e.g. how the Black Death spread). Card fronts show a short step label; tapping flips a card to reveal why that step mattered / how it links to the next. Continue only appears once every card has been flipped.  
**Props:** `block`, `subject` (defaults to `History`), `onContinue`  
**Block shape:** `{ type: 'timelineChain', title, intro?, steps: [{ id?, icon?, image?, label, detail }] }`  
**Screen type:** `timelineChain` (full-screen, routed directly in `ModulePlayer.jsx` like `VisualNarrativeScreen`)  
**Dependencies:** `SUBJECTS`, `SPACING`, `MOTION`, `RADII`

---

### TimelineChainBlock

**File:** `src/components/learning/TimelineChain.jsx` (named export, alongside `TimelineChain`)  
**What it is:** Embedded variant of `TimelineChain` — the same flip-card chain with connector rail, scaled down to sit inline within a normal content screen instead of taking over the full screen. No completion gating; the screen's own Continue/Next controls progression.  
**Best used for:** Slotting a short causal/sequence chain (2–5 steps) into an existing content screen alongside its heading/intro — e.g. recapping a transmission chain just explored elsewhere. Each card front can show a placeholder/illustrative `image` with an overlaid step number, plus a short label; tapping flips to reveal the "why it mattered" detail. An optional `outro` paragraph (e.g. a reflection prompt) renders below the chain.  
**Props:** `block`, `subject` (defaults to `History`)  
**Block shape:** `{ type: 'timelineChain', intro?, steps: [{ id?, icon?, image?, label, detail }], outro? }`  
**Screen type:** `timelineChain` (content block, rendered inside `Screen` in `ModulePlayer.jsx` — same block-type string as the full-screen variant's screen type, but checked on `block.type` rather than `screen.type`)  
**Dependencies:** `SUBJECTS`, `SPACING`, `MOTION`, `RADII`

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

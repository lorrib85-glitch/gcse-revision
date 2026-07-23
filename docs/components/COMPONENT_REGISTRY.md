# Component Registry

**Last updated:** 2026-06-06
**Scope:** All standalone components in `src/components/`

---

## How to Use This Registry

Before building anything new, check this registry. If a component already covers your use case — use it. If it doesn't quite fit, adapt it. Only build new components for genuinely distinct learning beats.

**Function tags:** every learning component's display type is mapped to
pedagogical function tags and an interaction class (`passive` / `reveal` /
`assessed`) in `src/data/componentFunctions.js` — the machine-readable
source of truth. Content builds select components by function, not by
name: see `docs/system/CONTENT_BUILD_TEMPLATE.md`. When adding a component,
register its display type there in the same change (the architecture test
fails otherwise once content uses it).

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

### CheckAnswerCTA

**File:** `src/components/core/CheckAnswerCTA.jsx`
**Story:** `src/components/core/CheckAnswerCTA.stories.jsx`
**Purpose:** The governed shared **non-progression** answer-submit / "check my thinking" action for assessed learning screens. Deliberately distinct from `ContinueCTA` (the progression CTA): uses the `BUTTONS.secondary` token (56px, `RADII.medium`) with a solid subject-accent fill, `GENERAL.textOnAccent` foreground, the governed disabled treatment, and focus-visible + press states — so a "check" step never visually competes with the final "Continue" that advances the flow.
**Props:** `onClick`, `label` (default `'Check my thinking'`), `accent`, `disabled`, `disabledBackground`, `disabledColor`, `textColor`, `style` (layout overrides only — width/flex/margin; never new height, radius, font or colour logic)
**Used by:** `SpotTheError`. Prefer this over rebuilding a bespoke check/submit button in any new assessed component.
**Dependencies:** `BUTTONS`, `MOTION`, `GENERAL`

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

### SaveFailureNotice

**File:** `src/components/core/SaveFailureNotice.jsx`
**Purpose:** The single governed learner-facing surface shown when a *critical* save fails (module progress, screen completion, quiz/exam scores, streaks, planner completion). Calm, subject-neutral, mobile-first; never claims progress was saved.
**Use for:** the app-wide save-failure notice only. Mounted once via `SaveFailureHost` at the app root — features do not render it themselves.
**Do NOT use for:** success confirmation, generic toasts, per-feature error banners.
**Props:** `open`, `retrying` (bool), `onRetry`, `onDismiss`
**Dependencies:** `GENERAL` theme, `TYPE`, `SPACING`, `RADII`, `BUTTONS` tokens; `createPortal`
**Architecture:** presentation only. Which saves are critical, dedupe and retry live in `src/lib/storage.js` (`saveCritical` + `subscribeSaveFailure`) and the pure `src/app/saveFailureController.js`; `src/app/SaveFailureHost.jsx` wires bus → controller → this component.
**Rule:** Do not add separate hardcoded save-error alerts or `window.alert` anywhere. Route critical persistence through `saveCritical` so this one notice handles it. No global success toast for normal saves.

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

### FactorWeb — **LOCKED**

**File:** `src/components/learning/FactorWeb.jsx`
**What it is:** Mobile-first factor exploration and judgement component. It places four to six concise factors in balanced left/right columns around one chapter-owned centre image or governed placeholder, then unlocks a supported relative-importance judgement after all factors are explored.
**Best used for:** Causal or thematic GCSE History questions where learners must explain several plausible factors and judge which mattered most.
**Contract:** `docs/system/component-contracts/factor-web.md`
**Lock:** See `docs/components/LOCKED_COMPONENTS.md`.

---


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

### Infographic

**File:** `src/components/learning/Infographic.jsx`
**Purpose:** Canonical screen for block type `infographic`: a single teaching heading and framing line (owned by the approved `TeachScreenShell`, Route A) then one governed infographic media slot (`MediaPlaceholder`). Owns no heading typography or screen rhythm of its own — it fixes the standard "title + intro + infographic" composition into one named screen so authoring `type: 'infographic'` has a clear build target. The media slot passes through to `MediaPlaceholder`, so the infographic can be a reserved diagram slot (`kind: 'diagram'`) or a progressive quadrant reveal (`kind: 'imageReveal'`).
**Props:** `subject`, `eyebrow`, `heading`, `intro`, `media` (`{ kind, aspect, caption }`)
**Dependencies:** `TeachScreenShell`, `MediaPlaceholder`

---

### InteractiveHotspotImage

**File:** `src/components/learning/InteractiveHotspotImage.jsx`
**Purpose:** Full-screen image with tappable hotspots. Two-phase: intro reveal → explore hotspots. Two variants: `detail` (default — one card of labelled rows per hotspot) and `reveal` (pages through multiple pieces of information per hotspot, `reveals[]`). Optional `synthesis` shows a "collection complete" summary once all hotspots are explored.
**Props:** `subject`, `title`, `introText`, `image`, `imageAlt`, `hotspots`, `ctaLabel`, `variant`, `synthesis`, `onBack`, `onEnterExplore`, `onContinue`
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

### ExaminerExplainsScreen

**File:** `src/components/learning/ExaminerExplainsScreen.jsx`
**Purpose:** Full-screen explanatory screen with animated word-by-word text reveal and atmospheric background image. Used to deliver post-question insight in a cinematic way.
**Props:** `screen`, `subject`, `onContinue`
**Dependencies:** `SUBJECTS`, `MOTION`

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

### MatchingTask

**File:** `src/components/learning/MatchingTask.jsx`
**What it is:** Card-pair matching activity with visual connector lines.
**Best used for:** Linking terms to definitions, concepts to examples, or causes to effects (e.g., "Medieval beliefs" ↔ "Treatments"). Splits large sets into rounds. One-retry mechanism.
**Props:** `screen`, `subject`, `onComplete`
**Screen data shape:** `{ pairs: [{ id, term, answer, weakGroup }], backgroundImage }`
**Dependencies:** `MOTION`, `unifiedWeaknessTracker`

---

### OrderedRouteTask

**File:** `src/components/learning/OrderedRouteTask.jsx`
**Screen type:** `orderedRouteTask`
**What it is:** Ordered chain activity — one job card is shown at a time beneath the heading; the learner taps the stage on the numbered vertical route it belongs to. Correct taps lock the job beneath that stage immediately; wrong taps show a persistent clue-based hint ("Not here — look for the stage near railways.") and allow another tap. Route line, nodes and surfaces derive from the supplied subject's accent.
**Best used for:** Recalling the steps or stages of a process in order — evacuation chains, scientific processes, historical sequences.
**Props:** `screen`, `subject`, `onComplete`
**Screen data shape:**
```js
{
  type: 'orderedRouteTask',
  title, titleHighlight?, subtitle?, prompt?, weakGroup?, completionText?, backgroundImage?,
  stages: [{ id, icon, title, clue, answerId }],  // icon: 'helmet'|'cross'|'hut'|'train'|'ship'
  answers: [{ id, text }],
}
```
**Interaction:** jobs are shuffled and presented one at a time; tap a stage row (a real button, keyboard-focusable) to place. First wrong attempt per job logs a weakness; a clean first-attempt placement logs a correct answer. After the final placement the rebuilt chain stays on screen with `completionText`, then the governed `ContinueCTA` reveals — completion is learner-controlled, never automatic.
**Dependencies:** `TYPE`, `SPACING`, `RADII`, `MOTION`, `SUBJECTS`, `CinematicShell`, `ContinueCTA`, `unifiedWeaknessTracker`
**Do not use when:** The relationship between items is unordered (use `MatchingTask` instead).

---

### CentreImageReveal

**File:** `src/components/learning/CentreImageReveal.jsx`
**Purpose:** Three-phase cause → prescription → reveal flow. Learner selects a theory, fills inputs on a parchment surface (fuzzy-match validated), then sees correct treatments revealed. Personalises heading if a `selectedHealer` prop is passed from GuidedChoiceCarousel. Its select phase opens with the `MedievalDiagnosisScene` hero.
**Props:** `screen`, `selectedHealer`, `onComplete`
**Dependencies:** `SUBJECTS`, `SPACING`, `MOTION`, `TYPE`, `MedievalDiagnosisScene`

---

### MedievalDiagnosisScene

**File:** `src/components/learning/MedievalDiagnosisScene.jsx`
**Purpose:** Cinematic 9:16 SVG hero scene — "Medieval diagnosis chamber". Thomas sits at a candlelit table while the four medieval explanations of illness (God & sin, four humours, miasma, astrology) fade in around him one at a time, each with its treatment symbol, then settle into tappable zones and a calm idle loop (candle flicker, rotating star chart, drifting miasma). Sits above the belief selection in `CentreImageReveal`; zones drive the same selection as the cards. Reduced motion renders the static end state.
**Props:** `theories`, `completedIds`, `onSelectZone`, `playIntro`, `prefersReducedMotion`, `style`
**Dependencies:** `SUBJECTS`, `MOTION`, `RADII`, `TYPE`
**Do not use when:** The screen is not the medieval Medicine cause → treatment context — the scene content is Chapter 1 specific.

---

### MemoryHook

**File:** `src/components/learning/MemoryHook.jsx`
**Purpose:** In-page "make it stick" reminder block. Anchors one hard idea with a memorable analogy or mnemonic, optionally beside a small author-supplied thumbnail. A pencil affordance lets the learner rewrite the hook in their own words (generation effect); the personalised version persists per hook via `src/lib/storage.js` and shows a "Your version" caption.
**Best used for:** Dropping a light, memorable recall aid *within* a page "here and there" — not for stating the screen's rule (use `KeyPoint`) or drilling an acronym interactively (use `AcronymMemorise`). Reusable across all subjects.
**Props:** `block` (`{ id?, label?, hook, image?, imageAlt? }`), `subject`
**Dependencies:** `SUBJECTS`, `GENERAL`, `SPACING`, `RADII`, `MOTION`, `TYPE`, `storage.js`
**Block type:** `memoryHook` (routed in `ModulePlayer`).
**Contract:** `docs/system/component-contracts/memory-hook.md` (composition classification: content).

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
**Scoring logic:** `src/components/learning/spotTheErrorScoring.js` (pure, unit-tested)
**Story:** `src/components/learning/SpotTheError.stories.jsx`
**What it is:** Three-stage diagnostic precision task — locate the wrong word/phrase (contiguous, keyboard-accessible selection), explain why it is wrong, then rewrite it correctly. Full-bleed (owns its own 100dvh scroll + safe-area) so the staged fields and actions stay reachable with the keyboard open.
**Best used for:** Precision-checking misconceptions or calculation errors. Teaches diagnosis and repair, not just recognition. Evaluates and gives specific feedback on all three stages independently, logging `Error identification`, `Scientific precision` and `Error correction` weaknesses.
**Props:** `block`, `subject`, `onContinue`
**Block shape:** `{ type: 'spotTheError', statement, errorTarget, whatWasWrong, correctVersion, examinerNote?, commonTrap?, missHeading?, explanationCriteria?: { anyOf?, allOf?, supportingAnyOf? }, keyTerms? (legacy — treated as explanationCriteria.anyOf), explanationHint?, explanationPraise?, repairKeyTerms?, acceptableRepairs?, repairMustAvoid?, minimumExplanationLength?, minimumRepairLength? }`
**Dependencies:** `SUBJECTS`, `SPACING`, `MOTION`, `RADII`, `TYPE`, `GENERAL`, `CinematicShell`, `ContinueCTA`, `CheckAnswerCTA`, `unifiedWeaknessTracker`, `spotTheErrorScoring`

---

### SwipeSort

**File:** `src/components/learning/SwipeSort.jsx`
**What it is:** Swipe-gesture categorisation activity with cards dragged into zones.
**Best used for:** Binary or multi-way classification (e.g., "Supernatural vs Natural" causes). Mobile-friendly drag interaction. Fast-paced categorisation tasks.
**Props:** `block`, `subject`, `onComplete`
**Dependencies:** `SUBJECTS`, `MOTION`

---

### TheoryCompare

**File:** `src/components/learning/TheoryCompare.jsx`
**Reveal logic:** `src/components/learning/theoryCompare.js` (pure)
**Story:** `src/components/learning/TheoryCompare.stories.jsx`
**Interaction class:** `reveal` (`teach-comparison`) — teaching-first and unassessed. Never a disguised quiz; no right/wrong judgement.
**Pedagogical purpose:** teach a meaningful comparison through progressive reveal, so the learner understands *why* two things differ before any retrieval is expected.
**Props:** `block`, `subject`, `onComplete?`

Side-by-side comparison of any two approaches, people or theories. Two labelled sides kept as compact headers with a central division; one comparison theme revealed at a time; a full-width teaching explanation beneath the columns where needed; example rows within a theme; a single closing takeaway. `emphasisSide` (`'left' | 'right' | 'none'`) gives one side restrained subject-accent emphasis (e.g. the evidence-backed side of a belief-versus-reality comparison); `'none'` keeps both sides visually equal for a neutral concept comparison. All colour derives from the subject accent token — content data carries no raw colours.

Portraits are optional. Supply `image`/`imageAlt` per side (and/or a `heroImage`) for a person-to-person comparison; when none are supplied the two portrait boxes render **empty**, ready for images to be added in future, and the labelled sides carry the comparison on their own.

- **Data shape:**
  ```
  {
    type: 'theoryCompare',
    title?,
    emphasisSide?,               // 'left' | 'right' | 'none' (default 'none')
    heroImage?, heroImageAlt?,   // optional cinematic dual-portrait banner (~30vh) that darkens into the screen; when omitted, two compact circular portrait boxes are used instead
    leftPerson:  { name, subtitle?, image?, imageAlt? },
    rightPerson: { name, subtitle?, image?, imageAlt? },
    comparisons: [
      // single-row theme
      { id, prompt?, left, right, explanation?, emphasisSide? },
      // multi-example theme (optional summary note)
      { id, prompt?, rows: [{ label, left, right }], note?, explanation?, emphasisSide? },
    ],
    takeaway?,
  }
  ```
- **Use it when:**
  - two people, approaches or theories differ meaningfully (method, evidence, conclusion, impact)
  - comparing belief with reality (e.g. Black Death "what people believed → what was actually happening")
  - comparing two concise conceptual models (e.g. animal vs plant cell, eukaryotic vs prokaryotic)
  - the comparison itself explains why knowledge changed
- **Do NOT use it when:**
  - the learner needs to classify answers → use `colsort` / `matchingTask`
  - the learner needs to make an assessed judgement → use `factorWeb` / an exam-technique component
  - the content is a sequence rather than a comparison → use `timelineChain` / `orderedRouteTask`
  - one side is merely correct and the other a cartoonishly foolish distractor (a person-to-person comparison must keep both sides historically fair)
  - the comparison requires long paragraphs in both columns (columns take short parallel phrases; longer teaching goes in the full-width `explanation`)

**Accessibility expectations:** portraits carry meaningful `imageAlt`; each comparison cell exposes its person's name to screen readers via a visually-hidden prefix so the Galen/Vesalius relationship survives colour- and position-only cues; progression uses the governed `ContinueCTA` (keyboard-operable, visible focus); focus moves to the takeaway when it reveals; motion respects `prefers-reduced-motion`; DOM reading order is prompt → left → right → explanation.

**Galen / Vesalius example (Episode 3, "The beginning of doubt"):** compares Galen (animal dissection) and Vesalius (human dissection) across method, evidence-building, anatomical conclusions (jaw, ribs, breastbone) and impact, closing on *"Vesalius did not prove that everything Galen believed was wrong. He proved that old ideas should be checked against evidence."*

**Dependencies:** `SUBJECTS`, `TYPE`, `SPACING`, `RADII`, `MOTION`, `ContinueCTA`

---

### OppositeQualitiesReveal

**File:** `src/components/learning/OppositeQualitiesReveal.jsx`
**Contract:** `docs/system/component-contracts/opposite-qualities-reveal.md`
**Purpose:** Passive, guided reveal for two opposing concepts. Items appear centrally, travel toward the configured left or right concept, then remain grouped under the correct final heading.
**Best used for:** Teaching contrast through visual grouping where the learner watches the relationship form, such as Hot/Cold and Wet/Dry quality symptoms in Medicine Episode 1.
**Do not use for:** Assessed sorting, quiz choices, drag-and-drop, feedback states, or case diagnosis. Use the relevant interaction/diagnostic component instead.
**Accessibility expectations:** Final DOM groups every item under its concept label; movement is decorative and not the only carrier of meaning; reduced motion renders the complete grouped state.

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
**What it is:** Full-screen sequence component with two variants. **`interactive`** (default) — a horizontal scroll-snap chain of flip cards connected by a connector rail (line segments + dot per card). **`reveal`** — a passive vertical sequence that reveals one step at a time behind a "Reveal next" CTA, absorbing the behaviour of the former `VisualNarrativeScreen`.
**Best used for:**
- *Interactive:* A chapter's "big idea" causal sequence the learner explores at will (e.g. how the Black Death spread). Card fronts show a short step label; tapping flips a card to reveal why that step mattered. Continue only appears once every card has been flipped.
- *Reveal:* A short cause→effect narrative delivered one calm statement at a time (e.g. "bad air → sweeten the air → the real cause was microbes"). Each press reveals one more step; the standard `ContinueCTA` replaces "Reveal next" once all steps show; an optional accent takeaway closes it.
**Props:** `block`, `subject` (defaults to `History`), `onContinue`, `variant` (`'interactive'` | `'reveal'`; falls back to `block.variant`, then `'interactive'`)
**Block shape (interactive):** `{ type: 'timelineChain', title, intro?, steps: [{ id?, icon?, image?, label, detail }] }`
**Block shape (reveal):** `{ type: 'timelineChain', variant: 'reveal', title?, intro?, source?, steps: [{ id?, icon?, statement, detail? }], takeaway? }` — `statement`/`detail`/`takeaway` accept a plain string or an array of `{ text, highlight? }` segments for inline subject-accent highlighting. `statement` (not `label`) is the primary field so full-sentence copy is not scanned by the sentence-case heading guard.
**Screen type:** `timelineChain` (full-screen, routed directly in `ModulePlayer.jsx`). Legacy `type: 'visualNarrative'` screens are mapped to the reveal variant at render time via `src/data/visualNarrativeCompat.js`.
**Dependencies:** `SUBJECTS`, `SPACING`, `MOTION`, `RADII`, `ContinueCTA`, `timelineChainReveal.js` (pure reveal logic)

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

> **VisualNarrativeScreen — RETIRED. Do not recreate, restore, or register it.**
> Its beat-based progressive-reveal behaviour was absorbed into `TimelineChain`'s
> `reveal` variant (see above) — that variant is now the **sole** source of truth for
> this interaction pattern.
> - New progressive narrative / statement-sequence screens **must** use `TimelineChain`
>   with `variant: 'reveal'`.
> - Interactive ordering / causal-chain screens continue to use `TimelineChain`'s
>   default `interactive` variant.
> - Legacy `type: 'visualNarrative'` content is mapped to the reveal variant via
>   `src/data/visualNarrativeCompat.js` — this is **migration-only** compatibility code.
>   Never author new content as `visualNarrative`, and never build new features on the
>   compat mapper.
>
> Any older per-module architecture doc that lists `VisualNarrativeScreen` as a
> suggested component is superseded by this entry.

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

---

## `src/components/learning/` (continued)

### QuoteAnalyser

**File:** `src/components/learning/QuoteAnalyser.jsx`
**What it is:** Full-screen quote analysis screen with a cinematic hero quote section (animated word-by-word reveal, optional background image), a ripped-seam SVG divider, and 5 tappable analysis item cards. Each card expands to a full-screen overlay; Continue only unlocks once all 5 items have been seen.
**Best used for:** English Literature close reading — any play, poem, or novel extract where the learner needs to explore word choice, connotations, literary methods, interpretations, and essay construction from a single quotation.
**Props:** `block`, `subject` (defaults to `'English'`), `onContinue`
**Block shape:**
```js
{
  type: 'quoteAnalyser',
  quote: string,            // full quote text including opening/closing marks
  location: string,         // e.g. 'Act I, Scene IV — Macbeth'
  backgroundImage?: string, // optional path for hero background
  items: [{
    id: string,
    icon: 'search' | 'feather' | 'mask' | 'bulb' | 'flame',
    heading: string,
    explainer: string,
    content: {
      title?: string,
      body: string,
      keyWords?: string[],  // renders as accent-coloured chips below body
    },
  }]
}
```
**Screen type:** `quoteAnalyser` (full-screen, routed in `ModulePlayer.jsx`)
**Animation:** word-by-word quote reveal via staggered `opacity` transitions; card entrance via `qa-card-in` CSS keyframe; seen-tick pop via `qa-tick-pop`; expanded overlay via `qa-slide-up`
**Dependencies:** `SUBJECTS`, `RADII`, `TYPE`, `ContinueCTA`

---

### RetrievalFrame — **LOCKED**

**File:** `src/components/feedback/RetrievalFrame.jsx`
**What it is:** Cinematic wrapper for spaced-retrieval practice questions.
**Best used for:** Testing knowledge recall in a low-pressure moment. Wraps any question type with atmospheric framing. No penalty for wrong answers.
**Props:** `block`, `subject`, `progress`, `onAnswer`, `onContinue`, `onBack`
**Lock reason:** Visual contract for all retrieval screens. Changing it risks inconsistency across all question presentations.
**Dependencies:** `AnswerInteraction`, `SUBJECTS`

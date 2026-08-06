# Component Registry

<!--
  GENERATED FILE — DO NOT EDIT.

  Every fact below is authored in src/component-catalogue/records/ and rendered
  by scripts/generate-component-catalogue.mjs. Edit the record, then run
  `pnpm catalogue:generate`. `pnpm catalogue:check` fails if this file and the
  records disagree.
-->

> **Generated file — do not edit.** Change a record in
> `src/component-catalogue/records/`, then run `pnpm catalogue:generate`.

**Scope:** every current standalone component under `src/components/**`, plus
any component outside that tree which current governance already treats as a
governed standalone component. Private family internals are owned by their
public record rather than listed separately.

---

## What an entry here does and does not mean

An entry means one thing: **the component exists and is documented.** This is a
catalogue, not an approval list and not a learner-reachability list.

| Question | Answered by |
|---|---|
| Does this component exist, and what is it? | this file, generated from `src/component-catalogue/records/` |
| May a chapter author use it in a `screens` array? | the **Authoring** block on the entry below, if it has one |
| Which pedagogical function does it serve? | the Pedagogy line in the **Authoring** block below |
| May its internals change without asking? | the **Contract** on each entry below |

**Authoring authority.** A component's authorable screen and block types are
catalogue facts, declared in its record's `authoring` block and shown below.
`src/data/generated/componentAuthoringRegistry.js` is projected from those
declarations by `pnpm authoring:generate`, and `src/data/screenRegistry.js`
re-exports that projection and adds the handwritten helpers. Never add an entry
to `screenRegistry.js`; add it to the owning record and regenerate.

Most components have no Authoring block, and that is not an error — a runtime
shell, a support primitive or an app-level feature is never placed by an author
in a `screens` array.

**Pedagogy authority.** Each authoring entry's pedagogical classification
(function tags and interaction class) is a catalogue fact, declared in the
entry's `pedagogy` block against the vocabulary in
`src/component-catalogue/pedagogyVocabulary.js`.
`src/data/generated/componentPedagogyRegistry.js` is projected from those
blocks by `pnpm pedagogy:generate`, and `src/data/componentFunctions.js` is
a thin compatibility API over that projection. Never add a classification to
`componentFunctions.js`; add it to the owning authoring entry and regenerate.

**Remaining phase boundary.** Component Lab routing stays in
`src/dev/componentReview/` until its own migration phase, and is deliberately
not duplicated here.

Catalogue membership is not based on learner reachability. Component Lab or
Storybook-only components, components still under review, and
superseded-but-retained components are all catalogued. "Not routed yet" is a
status, not a defect — do not route, retire or delete a component merely
because learners cannot currently reach it.

---

## There are no locked components

A rule can be constitutional; a whole component file cannot. Every record
carries a **contract** instead:

- **criticality** — `standard` or `critical`.
- **invariants** — precise behavioural or product rules, each with honest
  evidence (an automated test, a story, or a stated review check).
- **exclusivity** — where a component is the sole implementation of an
  app-wide pattern, and what competing implementations are prohibited.
- **requires a product decision** — the *changes* that need sign-off.

Internal implementation changes that preserve a component's documented
contract are ordinary development work. Sign-off is needed only when a change
affects a documented invariant, an exclusivity rule, the public API, a learner
flow, or product identity.

---

## How to use this registry

Before building anything new, check here. If a component already covers your
use case, use it. If it doesn't quite fit, adapt it. Only build new components
for genuinely distinct learning beats.

**Decision block.** Author-selectable components carry a `Decision` entry — the
fast path for choosing between near-neighbour components while planning a
screen. Five fields: use when, do not use when, choose instead, content shape,
rhythm role. Where a Decision would require a product-level pedagogical
judgement that current source, stories and contracts do not settle, it is
marked *pending* rather than invented. Runtime shells, support primitives and
infrastructure carry none by design: an author never chooses between them and a
learning component.


---

## `src/components/core/`

Foundation components used by many others. They handle atomic UI concerns.

---

### AnswerInteraction

**File:** `src/components/core/AnswerInteraction.jsx`  
**Kind:** support primitive (`support`)  
**Lifecycle:** `active`

**Purpose:** The shared answer interaction for block-based, non-timed learning activities — choice, connection and true/false. It owns selection, the attempt sequence, hint and reveal, and silent weakness logging for the components that delegate to it. It is not the only answer implementation in the product: the QuickFire-style question families (QuickRecallScreen, TieredQuizScreen) own their answer flow through UnifiedQuestionScreen instead.

**Props:** `block`, `subject`, `onAnswer`, `onContinue`

**Notes:**

- 2026-07-05, explicit sign-off, scoped: the hardcoded feedback colour literals (#4DFF88 correct-answer highlight, #C8D0E8 hint/feedback body text) and copy ("Hint — think about this", "Correct — ", "Not quite — the answer was: ") were migrated to the canonical GENERAL.feedbackCorrect / GENERAL.feedbackHint / GENERAL.feedbackText tokens as part of an app-wide answer-feedback consolidation shared with UnifiedQuestionScreen. Scoped strictly to colour, copy and token usage inside the existing hint and feedback blocks — no answer-logic, reveal-timing or API change.

**Authoring**

- **Block type:** `quiz` — Quiz
  - Status: `active`
  - Layout: content
  - Continuation: player-owned
  - Requires: `question`:string, `options`:array
  - Pedagogy: retrieve · assessed

**Contract:** critical

**Why change is costly:** Every block-based question type delegates its answer flow here, so a change is felt across those screens at once — and the failure is silent: the screen still renders, it just teaches differently.

**Invariants:**

- `two-attempt-ceiling` — At most two attempts. An incorrect first attempt shows the hint and allows a retry; an incorrect second attempt reveals the answer, logs the weakness and completes the interaction. Correct on either attempt completes it.
  - Evidence: `review` — Play a choice, a connection and a true/false block: confirm attempt 1 hints, attempt 2 reveals, and no third attempt is offered.
- `question-stays-visible` — The question is never replaced by feedback. Feedback appears below the answer area so the stem stays on screen throughout.
  - Evidence: `review` — Answer incorrectly and confirm the stem is still readable above the feedback at 390px.
- `silent-weakness-logging` — Weakness logging is silent — no "saved to your weak spots" message ever reaches the learner.
  - Evidence: `review` — Answer incorrectly twice and confirm no persistence or tracking copy is shown.
- `untimed-learning-only` — This component serves non-timed, block-based learning activities only. Timed exam flows do not use it and must not gain hints or retries through it.
  - Evidence: `review` — Confirm no timed exam surface imports AnswerInteraction before approving a change.
- `parent-owns-completion` — The parent must wire onComplete. Without it the interaction locks but the surrounding screen never learns that progression is allowed.
  - Evidence: `review` — Check every call site passes a completion handler when adding a new consumer.

**Requires a product decision:**

- Changing answer state logic, the attempt ceiling or reveal timing
- Adding a new answer type
- Changing the public API (block, subject, onAnswer, onContinue)

---

### BackButton

**File:** `src/components/core/BackButton.jsx`  
**Kind:** support primitive (`support`)  
**Lifecycle:** `active`

**Purpose:** The back-navigation button for the whole app: 40×40 pill, near-invisible fill and border, left chevron only, no label, identical hover and press opacity.

**Props:** `onClick`, `ariaLabel (default 'Go back')`, `style (layout overrides only — position/margin/zIndex)`

**Contract:** critical

**Why change is costly:** Back navigation had drifted into at least four divergent inline patterns before this component existed (ghost circles, bordered pills with and without a "Back" label, bare chevron characters). Re-fragmenting it is cheap to do accidentally and expensive to unpick — it was a 28-call-site migration.

**Invariants:**

- `control-appearance` — 40×40 touch target, rgba(255,255,255,0.05) fill, 1px rgba(255,255,255,0.03) border, RADII.pill, left-chevron icon only, never a text label.
  - Evidence: `review` — Compare against the rendered control at 390px; confirm no label and no radius or fill override.
- `press-feedback-parity` — Hover and press render identically at opacity 0.6, via the shared .rise-back-button rule in src/styles.css.
  - Evidence: `review` — Inspect the .rise-back-button rule in src/styles.css: :hover and :active must carry the same opacity.

**Exclusivity — `back-navigation`:** this is the sole implementation of the pattern.

Prohibited alternatives:

- inline back buttons built from a bare chevron character
- feature-owned competing back-button components
- bordered pills carrying a "Back" text label

Evidence: `review` — Before approving a new screen, search it for chevron or back affordances that do not render the BackButton component.

**Requires a product decision:**

- Changing size, fill, border, radius, icon or opacity behaviour
- Adding a text label
- Allowing a competing back-navigation implementation anywhere in the app

---

### CardContainer

**File:** `src/components/core/CardContainer.jsx`  
**Kind:** support primitive (`support`)  
**Lifecycle:** `active`

**Purpose:** Atmospheric content surface wrapper. Provides a consistent card shell with optional background image, subject glow and cinematic atmosphere.

**Props:** `subject`, `backgroundImage`, `children`, `style`

**Contract:** critical

**Why change is costly:** It is the visual contract for every content card surface in the product, so a change to its atmosphere cascades to every card at once and reads as a whole-app restyle rather than a component tweak.

**Invariants:**

- `explicit-variant` — variant is always explicit ('contained' | 'inline' | 'compact' | 'fullBleed'). The component never infers a variant from its content.
  - Evidence: `review` — Confirm no call site relies on an inferred variant, and the component adds no content sniffing.
- `restrained-subject-atmosphere` — Subject atmosphere stays barely-there: tint, glow and shadow opacities live in the 0.06–0.12 range, so the surface never competes with the lesson.
  - Evidence: `review` — Check every tint, glow and shadow opacity value against the 0.06–0.12 range.
- `no-css-filters` — No CSS filters (sepia, hue-rotate and friends) on wrapped content or images.
  - Evidence: `review` — Confirm the component applies no filter property to children or background imagery.

**Requires a product decision:**

- Changing card visual appearance
- Changing glow behaviour
- Altering background image treatment

---

### CinematicContinueCTA

**File:** `src/components/core/CinematicContinueCTA.jsx`  
**Kind:** support primitive (`support`)  
**Lifecycle:** `active`

**Purpose:** The cinematic "Continue →" prompt: plain centred text fixed to the bottom of a full-screen cinematic moment, with a fade-in and idle pulse. See docs/system/BUTTON_RADII_SYSTEM.md "Progression CTA System".

**Props:** `onClick`, `accent`, `animation (default 'crm-fade 700ms ease both, crm-pulse 2.8s ease-in-out 900ms infinite')`, `style (layout overrides only — position, animation, zIndex; never new typography, spacing or colour logic)`

**Used by:** CinematicRevealMoment; ExaminerExplainsScreen

**Contract:** critical

**Why change is costly:** Consolidated in 2026-06-15 from inline implementations in CinematicRevealMoment and ExaminerExplainsScreen. A cinematic moment is the product identity at its most exposed, and a second inline prompt re-opens exactly the drift that consolidation closed.

**Invariants:**

- `plain-centred-prompt` — Plain centred "Continue →" text fixed to the bottom of the cinematic moment, with the fade-in and idle pulse. Never a filled button, never a pill.
  - Evidence: `review` — Render a cinematic screen at 390px and confirm the prompt is bare text, centred and bottom-fixed.
- `stops-propagation` — onClick always calls e.stopPropagation() before invoking the handler, so the prompt can sit inside a tap-to-advance container without triggering the container’s own navigation.
  - Evidence: `review` — Tap the prompt inside a tap-to-advance screen and confirm the screen advances exactly once.

**Exclusivity — `cinematic-reveal-cta`:** this is the sole implementation of the pattern.

Prohibited alternatives:

- inline "Continue →" text prompts inside a cinematic screen
- a component-local cinematic CTA with its own fade or pulse animation

Evidence: `review` — Search any new cinematic screen for a hand-rolled "Continue →" before approving it.

**Requires a product decision:**

- Changing typography, spacing or colour logic
- Allowing an inline cinematic "Continue →" implementation

---

### ContinueCTA

**File:** `src/components/core/ContinueCTA.jsx`  
**Kind:** support primitive (`support`)  
**Lifecycle:** `active`

**Purpose:** The Primary Progression CTA: 56px tall, RADII.large, solid accent fill, #0D0F14 text, "Continue" label, with built-in press-scale feedback. See docs/system/BUTTON_RADII_SYSTEM.md "Progression CTA System".

**Props:** `onClick`, `label (default 'Continue')`, `accent`, `disabled`, `disabledBackground`, `disabledColor`, `textColor`, `onMouseEnter`, `onMouseLeave`, `style (layout overrides only — width/flex, margin, position, animation, transition; never new height, radius, font or colour logic)`

**Used by:** every screen-to-screen "Continue" button across src/components/learning/ and src/components/feedback/; ChapterPlayer's bottom navigation (which also renders the "Finish ✓" label via `label`)

**Contract:** critical

**Why change is costly:** Consolidated in 2026-06-15 from inline implementations across learning/, feedback/ and the chapter runtime. It is the single most-repeated control in the product, so one divergent copy is immediately visible as inconsistency across a chapter.

**Invariants:**

- `fixed-button-geometry` — 56px tall, RADII.large, solid accent fill, #0D0F14 text. Never a pill, never a different height.
  - Evidence: `review` — Measure the rendered CTA at 390px against BUTTONS.continue and RADII.large.
- `press-scale-feedback` — Press feedback is BUTTONS.continue.pressScale, applied on onPointerDown / onPointerUp / onPointerLeave.
  - Evidence: `review` — Press and drag off the button; the scale must return on pointer leave as well as pointer up.
- `governed-disabled-treatment` — The disabled state renders through disabledBackground / disabledColor rather than a locally invented dimmed style.
  - Evidence: `review` — Render the disabled state and confirm it uses the governed tokens.

**Exclusivity — `primary-progression-cta`:** this is the sole implementation of the pattern.

Prohibited alternatives:

- inline "Continue" buttons inside a learning or feedback component
- a feature-owned progression button with its own height, radius or fill

Evidence: `review` — Every screen-to-screen progression control must render the ContinueCTA component; check new screens for a hand-rolled one.

**Requires a product decision:**

- Changing height, radius, font or colour logic
- Allowing an inline progression-button implementation

---

### CheckAnswerCTA

**File:** `src/components/core/CheckAnswerCTA.jsx`  
**Kind:** support primitive (`support`)  
**Lifecycle:** `active`

**Purpose:** The governed shared non-progression answer-submit / "check my thinking" action for assessed learning screens. Deliberately distinct from ContinueCTA: BUTTONS.secondary (56px, RADII.medium) with a solid subject-accent fill, GENERAL.textOnAccent foreground, the governed disabled treatment, and focus-visible and press states — so a check step never visually competes with the Continue that advances the flow.

**Props:** `onClick`, `label (default 'Check my thinking')`, `accent`, `disabled`, `disabledBackground`, `disabledColor`, `textColor`, `style (layout overrides only — width/flex/margin; never new height, radius, font or colour logic)`

**Dependencies:** `BUTTONS`, `MOTION`, `GENERAL`

**Used by:** SpotTheError

**Usage boundary:** Prefer this over rebuilding a bespoke check or submit button in any new assessed component.

**Story:** `src/components/core/CheckAnswerCTA.stories.jsx`

**Contract:** standard

No invariants or exclusivity rules are recorded. Internal changes that keep the documented behaviour are ordinary development work.

---

### ExitButton

**File:** `src/components/core/ExitButton.jsx`  
**Kind:** support primitive (`support`)  
**Lifecycle:** `active`

**Purpose:** The exit-navigation control for the whole app: 44×44 touch target, near-invisible "X" icon, opacity and scale press feedback.

**Props:** `onClick`, `ariaLabel (default 'Exit chapter')`, `style (layout overrides only — position/margin/zIndex)`

**Contract:** critical

**Why change is costly:** Consolidated in 2026-06-15 from the inline exit buttons in the learning header layer. Exiting a chapter is a destructive-feeling action, so its affordance must read the same everywhere the learner meets it.

**Invariants:**

- `exit-control-appearance` — 44×44 touch target with a near-invisible "X" icon at opacity 0.22 at rest.
  - Evidence: `review` — Measure the touch target and rest opacity of the rendered control at 390px.
- `exit-press-feedback` — Press feedback is opacity 0.6 plus scale 0.90, applied on onPointerDown / onPointerUp / onPointerLeave.
  - Evidence: `review` — Press and drag off the control; both opacity and scale must return on pointer leave.

**Exclusivity — `exit-navigation`:** this is the sole implementation of the pattern.

Prohibited alternatives:

- inline "X" or close glyphs used as chapter exits
- a feature-owned exit control with its own size or opacity behaviour

Evidence: `review` — Search a new full-screen surface for close affordances that do not render the ExitButton component.

**Requires a product decision:**

- Changing size, icon, or opacity and press behaviour
- Allowing an inline exit-button implementation

---

### LearningHeader

**File:** `src/components/core/LearningHeader.jsx`  
**Kind:** support primitive (`support`)  
**Lifecycle:** `active`

**Purpose:** Single-row floating capsule header shell for learning screens: [back] [stage rail] [exit]. Composes BackButton, LearningProgressHeader and ExitButton. The stage rail is the only chapter-contents navigation — there is deliberately no numeric n/total counter.

**Props:** `chapter`, `currentStage`, `stageNavigation`, `currentScreen`, `onStageJump`, `onBack`, `onExit`, `visible`

**Dependencies:** `BackButton`, `ExitButton`, `LearningProgressHeader`, `SUBJECT_ACCENTS / hexToRgb`

**Contract:** standard

No invariants or exclusivity rules are recorded. Internal changes that keep the documented behaviour are ordinary development work.

---

### LearningProgressHeader

**File:** `src/components/core/LearningProgressHeader.jsx`  
**Kind:** support primitive (`support`)  
**Lifecycle:** `active`

**Purpose:** Progress rail and jump sheet display for a chapter. Shows the current position within a chapter and owns no interaction logic of its own.

**Props:** `progress`, `currentStep`, `totalSteps`, `steps`

**Contract:** critical

**Why change is costly:** Learners build spatial memory for where progress lives. Moving or restyling the rail costs them that memory across every chapter simultaneously, and the regression is invisible in tests.

**Invariants:**

- `display-only` — Display only — it owns no interaction logic. The jump sheet reports a request; the runtime decides what happens.
  - Evidence: `review` — Confirm the component adds no navigation side effects of its own.
- `stable-rail-position` — The progress rail keeps its established position and appearance inside the header capsule.
  - Evidence: `review` — Compare the rail position and treatment against a current chapter screen at 390px.

**Exclusivity — `chapter-progress-rail`:** this is the sole implementation of the pattern.

Prohibited alternatives:

- inline progress bars on a chapter screen
- a component-local n/total counter standing in for the rail

Evidence: `review` — Every chapter progress display must arrive through LearningHeader; check new screens for a local bar.

**Requires a product decision:**

- Moving the progress bar position or changing the rail appearance
- Adding interaction logic to a display-only component
- Allowing an inline progress-bar implementation for chapter screens

---

### SaveFailureNotice

**File:** `src/components/core/SaveFailureNotice.jsx`  
**Kind:** support primitive (`support`)  
**Lifecycle:** `active`

**Purpose:** The single governed learner-facing surface shown when a critical save fails (chapter progress, screen completion, quiz and exam scores, streaks, planner completion). Calm, subject-neutral, mobile-first; it never claims progress was saved.

**Props:** `open`, `retrying (bool)`, `onRetry`, `onDismiss`

**Dependencies:** `GENERAL theme`, `TYPE`, `SPACING`, `RADII`, `BUTTONS`, `createPortal`

**Usage boundary:** The app-wide save-failure notice only. Mounted once via SaveFailureHost at the app root — features do not render it themselves. Not for success confirmation, generic toasts or per-feature error banners.

**Story:** `src/components/core/SaveFailureNotice.stories.jsx`

**Notes:**

- Presentation only. Which saves are critical, plus dedupe and retry, live in src/lib/storage.js (saveCritical + subscribeSaveFailure) and the pure src/app/saveFailureController.js; src/app/SaveFailureHost.jsx wires bus → controller → this component.

**Contract:** critical

**Why change is costly:** It is the only place the product ever tells a learner that work was not saved. A second alert path anywhere would either double-report a failure or, worse, let one pass silently — and a learner who believes lost progress was saved is the most damaging state this app can reach.

**Invariants:**

- `never-claims-a-save-succeeded` — It reports failure only. It never states or implies that progress was saved, and there is no global success toast for normal saves.
  - Evidence: `review` — Read every string the notice can render for any wording that implies a successful save.
- `presentation-only` — Presentation only. Which saves are critical, plus dedupe and retry, live in src/lib/storage.js (saveCritical + subscribeSaveFailure) and the pure src/app/saveFailureController.js.
  - Evidence: `test` — tests/unit/saveFailure/progressFailureIntegration.test.js
- `mounted-once-at-the-root` — Mounted once via SaveFailureHost at the app root. Features never render it themselves, and it is never rendered inside a chapter.
  - Evidence: `review` — Confirm SaveFailureHost is the only component rendering SaveFailureNotice before approving a new consumer.

**Exclusivity — `save-failure-surface`:** this is the sole implementation of the pattern.

Prohibited alternatives:

- a hardcoded save-error alert inside a feature
- window.alert or a native dialog used to report a failed save
- a per-feature error banner for persistence failures

Evidence: `review` — Search for alert( and any local save-error banner: critical persistence must route through saveCritical so this one notice handles it.

**Requires a product decision:**

- Adding a second learner-facing surface for save failures
- Adding a global success toast for normal saves
- Moving criticality, dedupe or retry decisions into this component

---

### SequenceProgress

**File:** `src/components/core/SequenceProgress.jsx`  
**Kind:** support primitive (`support`)  
**Lifecycle:** `active`

**Purpose:** Local sequence progress through a short sequence inside a learning component. Provides consistent dot and sash indicators for carousels, image sets, swipe cards, mini-steps and question sets.

**Props:** `total`, `current (zero-based, default 0)`, `completed (count, default 0)`, `viewed (index array for non-linear flows, default [])`, `accent`, `accentRgb`, `variant ('dots' | 'sash', default 'dots')`, `compact (boolean, default false)`, `ariaLabel`

**Used by:** QuickRecallScreen; CinematicCarousel; VisualLearning; GuidedChoiceCarousel

**Usage boundary:** Use for carousels, image sets, swipe cards, multi-question task progress, mini-step progress inside a learning component, and small viewed/current/remaining indicators. Do NOT use for the top chapter progress rail, chapter navigation or global app progress — use LearningProgressHeader for those.

**Notes:**

- Approved variants — dots (default): 20×8px accent pill for current, 8px muted-accent circle for done/viewed, 8px muted-white for future; compact reduces to 16×6px pill and 6px circles. sash: thin horizontal segments (3px, or 2px when compact), accent for current, muted accent for done/viewed, muted white for future — use where dots are too subtle (longer flows, step interactions).
- Behaviour: display only, no navigation. The viewed array takes priority over the completed count when supplied. current is zero-based.

**Contract:** critical

**Why change is costly:** Before it existed, one-off ProgressDots and inline carousel dots had drifted across several components. Its no-numbers rule is a product decision about how progress should feel inside a learning beat, and a local counter quietly undoes it.

**Invariants:**

- `never-renders-numbers` — It never renders numbers, labels, counters, percentages or "x of y" — no exceptions.
  - Evidence: `review` — Read the component for any numeric or textual progress output before approving a change.
- `display-only-no-navigation` — Display only: it carries no navigation and no interaction.
  - Evidence: `review` — Confirm the rendered indicators expose no click, tap or keyboard handlers.
- `approved-variants-only` — Only the two approved variants exist — 'dots' and 'sash', each with a compact size.
  - Evidence: `review` — Any third variant is a product decision, not an implementation detail.

**Exclusivity — `local-sequence-progress`:** this is the sole implementation of the pattern.

Prohibited alternatives:

- local ProgressDots components
- one-off carousel dots inside a learning component
- an inline "3 of 5" counter standing in for local progress

Evidence: `review` — Search a new sequenced component for hand-rolled dots or counters before approving it.

**Requires a product decision:**

- Rendering any numeric or textual progress
- Adding navigation or interaction to a display-only indicator
- Adding a new variant
- Allowing a local ProgressDots or one-off carousel-dot implementation

---

### AnimatedNumber

**File:** `src/components/core/AnimatedNumber.jsx`  
**Kind:** support primitive (`support`)  
**Lifecycle:** `active`

**Purpose:** Counts a numeric display up from 0 to value on first scroll into view. Respects prefers-reduced-motion by rendering the final value immediately.

**Props:** `value`, `duration (ms, default 1400)`

**Dependencies:** `none beyond React; IntersectionObserver, requestAnimationFrame`

**Used by:** QuickFireMode

**Usage boundary:** Score and stat reveals only. Do not animate a number the learner must read and act on immediately.

**Contract:** standard

No invariants or exclusivity rules are recorded. Internal changes that keep the documented behaviour are ordinary development work.

---

### CinematicDivider

**File:** `src/components/core/CinematicDivider.jsx`  
**Kind:** support primitive (`support`)  
**Lifecycle:** `active`

**Purpose:** Decorative line–diamond–line separator for cinematic and editorial screens. Owns the motif, the governed line colour and the subject-accent treatment; the caller owns placement via style.

**Props:** `accent (default GENERAL.teal)`, `accentRgb`, `size ('compact' | 'standard' | 'wide', default 'standard')`, `style`

**Dependencies:** `GENERAL`, `hexToRgb`

**Used by:** QuoteAnalyser; TheoryCompare; Component Lab

**Usage boundary:** Presentation only, aria-hidden. Do not build a second inline divider motif; extend the size scale instead.

**Contract:** standard

No invariants or exclusivity rules are recorded. Internal changes that keep the documented behaviour are ordinary development work.

---

### CircularTimer

**File:** `src/components/core/CircularTimer.jsx`  
**Kind:** support primitive (`support`)  
**Lifecycle:** `active`

**Purpose:** Circular countdown ring with a centred value and label. Display only — the caller owns the countdown.

**Props:** `seconds`, `totalSeconds`, `size (default 84)`, `stroke (default 4)`, `label (default 'SEC')`, `color`, `trackColor`, `displayValue`, `valueStyle`, `labelStyle`, `ariaLabel`

**Dependencies:** `GENERAL`, `MOTION`

**Used by:** PriorKnowledgeRecall; QuickFireQuestionScreen (via the QuickFire re-export); Component Lab

**Usage boundary:** Timed flows only (QuickFire, timed recall). Never add a timer to an untimed learning screen — see the cognitive load law in CLAUDE.md.

**Contract:** standard

No invariants or exclusivity rules are recorded. Internal changes that keep the documented behaviour are ordinary development work.

---

### ExamPrompt

**File:** `src/components/core/ExamPrompt.jsx`  
**Kind:** support primitive (`support`)  
**Lifecycle:** `active`

**Purpose:** Cross-subject exam-question prompt primitive: the question stem plus its mark allocation, in Sora rather than a subject-specific face, so one treatment serves prose, quotations, calculations, equations and source questions. Also exports stripTrailingMarks(question, marks), which removes a trailing "(4 marks)" from authored question text so marks are not shown twice.

**Props:** `question`, `marks`, `and layout props`

**Dependencies:** `GENERAL`, `SPACING`, `TYPE`

**Used by:** GuidedExamResponse

**Usage boundary:** The question stem only. Marking, feedback and answer capture stay with the surrounding exam component.

**Contract:** standard

No invariants or exclusivity rules are recorded. Internal changes that keep the documented behaviour are ordinary development work.

---

### InlineNavigationContext

**File:** `src/components/core/InlineNavigationContext.jsx`  
**Kind:** runtime infrastructure (`runtime`)  
**Lifecycle:** `active`

**Purpose:** Lets a learning component running a progressive reveal inside ContentShell own the only visible Continue CTA. ContentShell provides the bridge to the chapter-level navigation action.

**Props:** `exports InlineNavigationContext (React context)`, `exports useInlineNavigationOwner(active) → the chapter continue handler while claimed`

**Dependencies:** `React context only`

**Used by:** ContentShell; TheoryCompare; OppositeQualitiesReveal

**Usage boundary:** The sanctioned alternative to reaching into the DOM for the shell’s Continue button. Components must never query or mutate shell DOM directly.

**Contract:** standard

No invariants or exclusivity rules are recorded. Internal changes that keep the documented behaviour are ordinary development work.

---

### MediaPlaceholder

**File:** `src/components/core/MediaPlaceholder.jsx`  
**Kind:** support primitive (`support`)  
**Lifecycle:** `active`

**Purpose:** The governed reserved slot for an image or diagram the author has not yet supplied, so a screen can be composed and reviewed before art exists. With kind="imageReveal" the same slot becomes a slow quadrant-by-quadrant reveal inside one fixed frame, with optional arrows linking opposite quadrants.

**Props:** `kind (default 'image'; 'diagram', 'imageReveal')`, `aspect (default '16:9')`, `caption`, `subject (default 'History')`

**Data shape:** `Image-reveal config: { intro?, interval?, images: { topLeft, topRight, bottomLeft, bottomRight }, alt?, parts?, opposites?, progressText?, finished? }`

**Dependencies:** `SUBJECTS`, `RADII`, `SPACING`, `TYPE`, `MOTION`

**Usage boundary:** The only approved way to reserve a missing visual. Do not ship an empty box, a grey div or a stand-in stock image instead.

**Story:** `src/components/core/MediaPlaceholder.stories.jsx`

**Authoring**

- **Block type:** `mediaPlaceholder` — Media placeholder
  - Status: `active`
  - Layout: content
  - Continuation: player-owned
  - Requires: `kind`:string
  - Pedagogy: teach-mechanism · passive

**Contract:** standard

No invariants or exclusivity rules are recorded. Internal changes that keep the documented behaviour are ordinary development work.

---

### ProgressRecoveryCard

**File:** `src/components/core/ProgressRecoveryCard.jsx`  
**Kind:** runtime infrastructure (`runtime`)  
**Lifecycle:** `active`

**Purpose:** Shown once, before the login screen, when earlier progress is found on this device that cannot be confirmed as the current learner’s (quarantined legacy data — see accountScope.js). It reveals nothing about the previous learner: no name, scores or subjects, only that some earlier progress exists. The learner chooses "Use this progress" or "Start fresh"; nothing is deleted either way.

**Props:** `onUse`, `onStartFresh`, `busy (default false)`

**Dependencies:** `GENERAL`, `TYPE`, `SPACING`, `RADII`

**Usage boundary:** Mounted once by LegacyApp in the auth flow. Never rendered inside a chapter. No technical wording ("migration", "namespace", "storage", "legacy") may reach the learner.

**Story:** `src/components/core/ProgressRecoveryCard.stories.jsx`

**Contract:** standard

No invariants or exclusivity rules are recorded. Internal changes that keep the documented behaviour are ordinary development work.

---

### ScoreNumberLine

**File:** `src/components/core/ScoreNumberLine.jsx`  
**Kind:** support primitive (`support`)  
**Lifecycle:** `active`

**Purpose:** Draggable and tappable number line for choosing a mark out of a small range. Keyboard and pointer accessible.

**Props:** `value`, `max (default 8)`, `min (default 0)`, `onChange`, `accent`, `label (default 'Score')`, `disabled`

**Dependencies:** `GENERAL`, `RADII`, `TYPE`

**Used by:** FaceTheExaminer (faceTheExaminer/MarkingPanel.jsx); Component Lab

**Usage boundary:** Awarding a mark. Not a general-purpose slider, rating or confidence control — self-reported confidence is not evidence in this product.

**Contract:** standard

No invariants or exclusivity rules are recorded. Internal changes that keep the documented behaviour are ordinary development work.

---

### ScreenText

**File:** `src/components/core/ScreenText.jsx`  
**Kind:** support primitive (`support`)  
**Lifecycle:** `active`

**Purpose:** The text primitives for content inside ContentShell. These are the intentional path — the shell’s scoped CSS handles raw h1/h2/p only as a safety net, while these primitives carry the full intended design.

**Props:** `exports ScreenTitle, ScreenSubtitle, ScreenBody, ScreenIntro, ScreenCaption, ScreenCallout, ScreenList`

**Dependencies:** `TYPE`, `HEADING_LAYOUT`

**Used by:** 18 components across learning/ and layout/ — the most widely shared primitive in the tree

**Usage boundary:** ScreenTitle deliberately ignores typography properties passed through style (fontFamily, fontSize, fontWeight, lineHeight, letterSpacing) so callers cannot create a second screen-title system locally. Layout and colour overrides are allowed.

**Contract:** critical

**Why change is costly:** A second screen-title system crept into this codebase once already, by components re-spreading TYPE.displayScreen on their own heading markup. ScreenTitle exists to make that impossible, and the guard that enforces it is a few lines of prop-stripping that a well-meaning refactor would remove without noticing.

**Invariants:**

- `screen-title-strips-typography-overrides` — ScreenTitle deletes fontFamily, fontSize, fontWeight, lineHeight and letterSpacing from any style passed in, so callers cannot build a second screen-title system locally. Layout and colour overrides remain allowed.
  - Evidence: `test` — tests/architecture/typography-governance.test.js
- `primary-heading-routes-through-display-screen` — Its primary heading spreads TYPE.displayScreen and overrides none of the five typography properties locally.
  - Evidence: `test` — tests/architecture/typography-governance.test.js
- `learning-components-use-the-primitive` — A learning component rendering its own primary non-cinematic heading uses ScreenTitle rather than re-spreading TYPE.displayScreen on local markup.
  - Evidence: `test` — tests/architecture/typography-governance.test.js

**Requires a product decision:**

- Removing or weakening the ScreenTitle typography-override guard
- Changing what TYPE.displayScreen owns for non-cinematic screen titles

---

### SegmentedControl

**File:** `src/components/core/SegmentedControl.jsx`  
**Kind:** support primitive (`support`)  
**Lifecycle:** `active`

**Purpose:** Shared two-or-more option switcher for stable, mutually exclusive views, with roving focus. Disabled options stay visible so the learner can see the sequence without being able to skip it.

**Props:** `options ([{ value, label, disabled? }])`, `value`, `onChange`, `accent`, `ariaLabel (default 'Choose a view')`, `variant ('segmented' | 'tabs', default 'segmented')`

**Dependencies:** `GENERAL`, `RADII`, `TYPE`

**Used by:** FaceTheExaminer (faceTheExaminer/FaceTheExaminerMain.jsx)

**Usage boundary:** Switching between views of the same material. Not an answer control — answers go through AnswerInteraction.

**Contract:** standard

No invariants or exclusivity rules are recorded. Internal changes that keep the documented behaviour are ordinary development work.

---

### TeachScreenShell

**File:** `src/components/core/TeachScreenShell.jsx`  
**Kind:** support primitive (`support`)  
**Lifecycle:** `active`

**Purpose:** Composes a teaching screen with the approved vertical rhythm, so spacing stops being a per-session judgement call. Slots render in a fixed order — eyebrow → heading → intro → body → memoryHook — with token-driven gaps and a calm entrance.

**Props:** `heading (required, sentence case)`, `eyebrow (only when it adds information the heading lacks)`, `intro`, `children (the teaching body, at most one visual)`, `memoryHook`, `subject (default 'History')`

**Dependencies:** `SUBJECTS`, `SPACING`, `MOTION`, `TYPE`, `HEADING_LAYOUT`

**Usage boundary:** This is Route A, the default composition route for new teaching and explanation screens. It owns the screen heading (TYPE.displayScreen) and the vertical rhythm; neither may be overridden locally. It is a composition primitive, not a universal wrapper — do not use it to wrap cinematic/full-screen (Route C) components, interaction engines that own their own screen (Route B), another shell, or another TeachScreenShell.

**Contract doc:** `docs/system/component-contracts/teach-screen-shell.md`

**Story:** `src/components/core/TeachScreenShell.stories.jsx`

**Notes:**

- Sits inside ContentShell — see docs/system/SCREEN_SHELL_SYSTEM.md.
- Governed by docs/system/PATTERN_GOVERNANCE.md.

**Contract:** standard

No invariants or exclusivity rules are recorded. Internal changes that keep the documented behaviour are ordinary development work.

---

## `src/components/learning/`

Screen-level learning interaction components. Each is a distinct learning beat.

---

### FactorWeb

**File:** `src/components/learning/FactorWeb.jsx`  
**Kind:** author-selectable component (`reusable`)  
**Lifecycle:** `active`

**Purpose:** Mobile-first factor exploration and judgement component. It places four to six concise factors in balanced left/right columns around one chapter-owned centre image or governed placeholder, then unlocks a supported relative-importance judgement after all factors are explored.

**Best used for:** Causal or thematic GCSE History questions where learners must explain several plausible factors and judge which mattered most.

**Dependencies:** `InteractionShell`, `ScreenTitle`, `SequenceProgress`, `ContinueCTA`, `src/constants/factorWeb.js`, `src/constants/contentLimits.js`

**Contract doc:** `docs/system/component-contracts/factor-web.md`

**Story:** `src/components/learning/FactorWeb.stories.jsx`

**Authoring**

- **Screen type:** `factorWeb` — Factor web
  - Status: `active`
  - Layout: full-screen
  - Continuation: component-owned
  - Pedagogy: teach-comparison, apply · assessed

**Decision**

- *Pending* — The registry entry has never carried a five-field Decision block; the boundary against TheoryCompare and the causal-chain components is a pedagogical judgement current source, stories and the factor-web contract do not settle.

**Contract:** critical

**Why change is costly:** This is the approved causation-and-judgement pattern for GCSE History factor screens, and its 390px composition has been verified against the FactorWeb contract and the gold register. Changing its internals risks reintroducing the pre-rework failures the rework existed to remove.

**Invariants:**

- `governed-composition` — It composes InteractionShell plus a single ScreenTitle, the shared SequenceProgress and the governed ContinueCTA — never a local heading, progress counter or progression control.
  - Evidence: `test` — tests/architecture/factor-web-governance.test.js
- `no-pre-rework-regressions` — No centre dots, decorative eyebrows, numeric local progress, emoji factor identity, runtime truncation or clamping, and no chapter-specific geometry inside the shared component.
  - Evidence: `test` — tests/architecture/factor-web-governance.test.js
- `balanced-two-column-geometry` — Four to six factors are split into balanced left and right columns around one centre medallion, with the soft localised halo and subtle connector treatment.
  - Evidence: `test` — tests/architecture/factor-web-governance.test.js; `story` — src/components/learning/FactorWeb.stories.jsx
- `chapter-owns-imagery-and-wording` — Topic image paths and figure wording stay chapter-owned; the shared component hardcodes neither.
  - Evidence: `test` — tests/architecture/factor-web-governance.test.js

**Requires a product decision:**

- Redesigning the component geometry, heading route, connector style, centre focal treatment, progress affordance or progression controls
- Reintroducing centre dots, eyebrows, numeric local progress, emoji factor identity or runtime clamping

---

### AcronymMemorise

**File:** `src/components/learning/AcronymMemorise.jsx`  
**Kind:** author-selectable component (`reusable`)  
**Lifecycle:** `active`

**Purpose:** An interactive mnemonic component that introduces an acronym, lets the learner reveal what each letter represents and then switches into an unscored self-test mode in which the answers are hidden again. The learner is prompted to say each meaning before tapping to check it.

**Best used for:** Learning a short, stable set of related ideas that can be encoded naturally through their initial letters.

**Props:** `block`, `subject`

**Data shape:** `{ type: 'acronymMemorise', intro?, memoryTarget?, instruction?, showIntro?, readyText?, testInstruction?, testPrompt?, testCompleteText?, testCtaLabel?, learnCtaLabel?, testRowPrompt?, subject?, items: [{ id?, letter, word, detail }] }`

**Dependencies:** `GENERAL`, `SPACING`, `SUBJECTS`, `TYPE`, `ScreenIntro`

**Governance rules:**

- The self-test is useful retrieval practice, but it is not scored evidence of mastery. Opening every item only shows that the learner checked the answers; it does not prove that they recalled them correctly. Do not feed completion of AcronymMemorise into the weakness tracker as a correct result.

**Authoring**

- **Block type:** `acronymMemorise` — Acronym memorise
  - Status: `active`
  - Layout: content
  - Continuation: player-owned
  - Pedagogy: teach-mechanism · reveal

**Decision**

- **Use when:** A short set of related terms can be represented by a memorable acronym without distorting the subject knowledge. Choose it when recalling the initial letters genuinely helps the learner reconstruct the complete set.
- **Do not use when:** The words have been awkwardly rewritten merely to force an acronym, the order has no stable meaning or each item requires substantial explanation. Do not use it for causal chains, chronological stages, independent question-and-answer pairs or every list the learner encounters.
- **Choose instead:** Use MemoryHook when one concept needs one analogy or association rather than a multi-letter mnemonic. Use TimelineChain or OrderedRouteTask when the sequence itself matters. Use QuickRecallScreen when recall should be objectively marked and recorded. Use MatchingTask when the learner must connect independent terms with corresponding meanings.
- **Content shape:** Normally three to seven letters forming a pronounceable, familiar or otherwise memorable acronym. Every letter must map clearly to one concise word or phrase, followed by a short explanation of why that item matters. The displayed words must remain academically accurate rather than being stretched to fit the letters. The test mode should require recall before reveal, not simply invite repeated tapping.
- **Rhythm role:** teaching, retrieval.

**Contract:** standard

No invariants or exclusivity rules are recorded. Internal changes that keep the documented behaviour are ordinary development work.

---

### AngleExplore

**File:** `src/components/learning/AngleExplore.jsx`  
**Kind:** author-selectable component (`reusable`)  
**Lifecycle:** `reviewing` — Routed for chapter authoring in Phase 4 as block:angleFigure; the component itself is still under review, which is what keeps this lifecycle at reviewing.

**Purpose:** Configuration-driven GCSE angle diagram — the Maths sibling of CircuitDiagram. Shapes and angles render as inline SVG; one learner-controlled value (a draggable ray, or a triangle’s draggable apex) drives live sector values, angle classifications and an angle-fact status line. Five registered presets — angleTypes (drag a ray, watch the value and its acute/right/obtuse/straight/reflex classification), straightLine (two angles summing to 180°), aroundPoint (three angles summing to 360°), verticallyOpposite (equal pairs sharing a colour), triangle (drag the apex, interior angles always total 180°) — plus a compatible-preset-object escape hatch. interactive={false} turns any preset into a static teaching or exam diagram at a fixed value. The drag handle is a keyboard-operable role="slider" (arrow keys / Home / End) with a ≥44px hit target; right angles render the GCSE square marker; values magnetise to 90°/180°/270°. Respects prefers-reduced-motion (and a reducedMotion prop override).

**Best used for:** Teaching and exploring AQA Foundation angle facts where seeing the relationship respond to movement is the point — angle types, angles on a straight line, angles around a point, vertically opposite angles, angles in a triangle. Page-level questions, predictions and marking stay outside the component (compose it like CircuitDiagram).

**Props:** `preset (name or preset object, defaults to angleTypes)`, `value (controlled)`, `defaultValue`, `onChange`, `interactive`, `disabled`, `subject (defaults to Maths)`, `reducedMotion`, `label`, `showStatus`

**Data shape:** `{ type: 'angleFigure', preset: 'angleTypes' | 'straightLine' | 'aroundPoint' | 'verticallyOpposite' | 'parallelLines' | 'parallelAlternate' | 'parallelCoInterior' | 'triangle' | 'triangleTypes' | 'quadrilateral' | 'polygonSum' | 'regularPolygon', value?, defaultValue?, interactive?, label?, showStatus? }`

**Dependencies:** `SUBJECTS`, `GENERAL (via angle/angleVisualRoles.js semantic roles)`, `TYPE`, `SPACING`, `MOTION (injected animation CSS via ensureStyles(), same pattern as CircuitDiagram/GraphView)`, `pure geometry in angle/angleGeometry.js`, `presets in angle/anglePresets.js`

**Story:** `src/components/learning/AngleExplore.stories.jsx`

**Owns these private internals:**

- `src/components/learning/angle` (directory) — Pure angle geometry, preset definitions and semantic colour roles rendered only through AngleExplore. Not separately selectable, and deliberately not an authoring choice.

**Authoring**

- **Block type:** `angleFigure` — Angle figure
  - Status: `active`
  - Layout: content
  - Continuation: player-owned
  - Requires: `preset`:string
  - Pedagogy: teach-mechanism · reveal

**Decision**

- **Use when:** The learning objective is an angle fact or angle vocabulary, and manipulating the diagram makes the relationship visible — the sum staying fixed while parts trade, or a classification changing as the angle grows. Also use its static mode for any accurate, on-theme angle/triangle diagram inside teaching or exam content.
- **Do not use when:** The learner must be assessed on a calculation (compose a question component around a static AngleExplore instead); the content is chart or data interpretation (GraphView); or the diagram is a construction/loci/bearings task the presets cannot express.
- **Choose instead:** Use GraphView when the job is interpreting data rather than angle facts. Use a static figure image when no interaction is needed and the diagram is one-off.
- **Content shape:** Pick the preset matching the angle fact; optionally fix value for a specific worked example. One diagram per screen — the component teaches one relationship at a time.
- **Rhythm role:** teaching, exploration.

**Contract:** standard

No invariants or exclusivity rules are recorded. Internal changes that keep the documented behaviour are ordinary development work.

---

### AreaPerimeterExplore

**File:** `src/components/learning/AreaPerimeterExplore.jsx`  
**Kind:** author-selectable component (`reusable`)  
**Lifecycle:** `reviewing` — Routed for chapter authoring in Phase 4 as block:areaPerimeterFigure; the component itself is still under review, which is what keeps this lifecycle at reviewing.

**Purpose:** Configuration-driven GCSE area and perimeter diagram — the mensuration sibling of AngleExplore, and deliberately separate from it (AngleExplore stays focused on angle relationships). Shapes render as inline SVG in model space (whole centimetres mapped to pixels, never measured back from pixels); learner-controlled dimensions drive a live boundary trace, unit-square grids, decomposition pieces and a stable result → calculation → explanation status area. Six registered presets — rectangle (drag width and height independently, snapping to whole numbers, with a square state that marks equal sides and names side²), fixedPerimeterRectangle (perimeter pinned at 24 cm while area rises to a maximum at the square), triangleArea (slide the apex with the perpendicular height fixed; pair a rotated copy to earn ½ × base × perpendicular height), parallelogramArea (slant does not change area; a triggered cut-and-slide builds the equivalent rectangle), trapeziumArea (duplicate and rotate into a parallelogram of base a + b to derive ½ × (a + b) × h), compositeShape (L-shape with two valid decomposition splits plus a whole-minus-missing-corner method, and a perimeter mode that excludes internal lines and deduces missing outer lengths) — plus a compatible-preset-object escape hatch. focus selects perimeter, area or compare where the preset supports more than one. interactive={false} turns any preset into a static teaching or exam diagram. Drag handles are keyboard-operable role="slider" elements (arrow keys / Home / End) with ≥44px hit targets that never overlap in any reachable state; discrete choices (decomposition method, formula reveal) are real buttons, never disguised sliders. Respects prefers-reduced-motion (and a reducedMotion prop override).

**Best used for:** Teaching the conceptual difference between perimeter and area, and deriving AQA Foundation area formulae from visual reasoning — rectangles and squares, triangles, parallelograms, trapezia, quadrilaterals and composite rectilinear shapes. Use it when seeing the reasoning is the point: perimeter accumulating as edges are traced, area accumulating as square units are counted or rearranged, or the two measures changing differently as one dimension moves. Prediction questions, marking, hints, scores and weakness tracking stay outside the component (compose it like AngleExplore/CircuitDiagram).

**Props:** `preset (name or preset object, defaults to rectangle)`, `focus (perimeter | area | compare)`, `value (controlled dimensions object)`, `defaultValue`, `onChange`, `interactive`, `disabled`, `subject (defaults to Maths)`, `reducedMotion`, `label`, `showStatus`

**Data shape:** `{ type: 'areaPerimeterFigure', preset: 'rectangle' | 'fixedPerimeterRectangle' | 'triangleArea' | 'parallelogramArea' | 'trapeziumArea' | 'compositeShape', focus?: 'area' | 'perimeter' | 'compare', value?, defaultValue?, interactive?, label?, showStatus? }`

**Dependencies:** `SUBJECTS`, `GENERAL (via areaPerimeter/areaPerimeterVisualRoles.js semantic roles)`, `TYPE`, `SPACING`, `RADII`, `MOTION (injected animation CSS via ensureStyles())`, `neutral shared geometry in geometry/shapeGeometry.js (also used by angle/)`, `presets in areaPerimeter/areaPerimeterPresets.js`

**Story:** `src/components/learning/AreaPerimeterExplore.stories.jsx`

**Owns these private internals:**

- `src/components/learning/areaPerimeter` (directory) — Mensuration presets, pure geometry and semantic colour roles rendered only through AreaPerimeterExplore. Not separately selectable, and deliberately not an authoring choice.
- `src/components/learning/geometry` (directory) — Neutral shared shape geometry helpers used by the angle, area/perimeter, number-line and coordinate-plane families. Pure maths with no rendering and no learning behaviour of its own; owned here because AreaPerimeterExplore is its primary consumer.

**Authoring**

- **Block type:** `areaPerimeterFigure` — Area and perimeter figure
  - Status: `active`
  - Layout: content
  - Continuation: player-owned
  - Requires: `preset`:string
  - Pedagogy: teach-mechanism · reveal

**Decision**

- **Use when:** The learning objective is what perimeter or area is, or why an area formula works — and manipulating the shape makes it visible: a sloping side changing while the perpendicular height does not, a fixed boundary enclosing different amounts of space, or an internal construction line helping the area but not the perimeter. Also use its static mode for any accurate, on-theme mensuration diagram inside teaching or exam content.
- **Do not use when:** The learner must be assessed on a calculation (compose a question component around a static instance instead); the task is executing a multi-step method rather than understanding a measure (CalculationBreakdown); or the content is circles, circumference, sectors, surface area or volume — none are implemented, and surface area and volume are explicitly out of scope for this component.
- **Choose instead:** Use AngleExplore for angle facts — do not add area or perimeter modes to it. Use CalculationBreakdown when the job is carrying out a method step by step rather than seeing why a formula holds. Use GraphView for interpreting data. Use a static figure image when no interaction is needed and the diagram is one-off.
- **Content shape:** Pick the preset matching the idea and set focus to the one measure being taught; optionally fix value for a specific worked example. One diagram per screen, one measure at a time — compare is for the moment the difference between the two measures is the lesson, not a way to teach both at once.
- **Rhythm role:** teaching, exploration.

**Contract:** standard

No invariants or exclusivity rules are recorded. Internal changes that keep the documented behaviour are ordinary development work.

---

### FractionRatioExplore

**File:** `src/components/learning/FractionRatioExplore.jsx`  
**Kind:** author-selectable component (`reusable`)  
**Lifecycle:** `reviewing` — Built and catalogued, but not yet routed for chapter authoring — pending component review.

**Purpose:** Configuration-driven GCSE part-whole diagram — the fractions, ratio, proportion and percentage sibling of AngleExplore and AreaPerimeterExplore. One visual grammar runs through every preset: same whole (every bar in a preset shares one x and width; only the number of parts changes), divided parts (bars, 2D grids, circle sectors or discrete counters), linked representations (curved connectors plus a real stacked fraction glyph with a rule line, never 3/4 as flat text), and scaling both sides together (rungs joining two parallel lines, driven by one shared multiplier). That shared grammar is the point of the component: it is what lets a learner recognise 3/4, 3 : 1 and 75% as one idea rather than three topics. Eight registered presets — fractionBar, equivalentFractions, fractionOperations (add/subtract/multiply/divide/of-an-amount, each with its own step sequence), ratioShare, doubleNumberLine, percentageGrid, proportionScale, bestValue — plus a compatible-preset-object escape hatch. Three interaction kinds, all keyboard-operable: drag handles (role="slider", arrow keys / Home / End, ≥44px hit target), stepper rows (− / +, for small discrete counts where dragging on a phone would be cruel), and real buttons for discrete choice (methods, steps). method and step seed the diagram rather than locking it — the visible tabs and step buttons always move; interactive={false} is how you get a fixed teaching or exam figure. Respects prefers-reduced-motion (and a reducedMotion prop override).

**Best used for:** The whole part-whole spine — fractions, equivalent fractions, simplifying, comparing, adding and subtracting, fractions of amounts, ratio as shares, ratio simplification, direct proportion, percentages and fraction–decimal–percentage conversion. Use it when the connection between representations is the learning, or when a method needs its intermediate states shown rather than just its answer. Questions, predictions, marking, scores and weakness tracking stay outside the component.

**Props:** `preset (name or preset object, defaults to fractionBar)`, `method`, `step`, `value (controlled values object)`, `defaultValue`, `onChange`, `onMethodChange`, `onStepChange`, `interactive`, `disabled`, `subject (defaults to Maths)`, `reducedMotion`, `label`, `showStatus`

**Dependencies:** `SUBJECTS`, `GENERAL (via fractionRatio/fractionRatioVisualRoles.js semantic roles)`, `TYPE`, `SPACING`, `RADII`, `MOTION (injected animation CSS via ensureStyles())`, `pure maths in fractionRatio/fractionRatioMath.js`, `pure layout in fractionRatio/fractionRatioGeometry.js (built on shared geometry/shapeGeometry.js)`, `one file per preset under fractionRatio/presets/`

**Story:** `src/components/learning/FractionRatioExplore.stories.jsx`

**Owns these private internals:**

- `src/components/learning/fractionRatio` (directory) — Pure part-whole maths, layout geometry, semantic colour roles and one file per preset, rendered only through FractionRatioExplore. Not separately selectable, and deliberately not an authoring choice.

**Decision**

- **Use when:** The learning objective is what a fraction, ratio, percentage or proportion is, or why a method works — and manipulating the whole makes it visible: parts multiplying while the shaded amount does not, two fractions whose parts are visibly different sizes, a total splitting into named shares, or two quantities that cannot move independently. Also use its static mode for any accurate, on-theme part-whole diagram inside teaching or exam content.
- **Do not use when:** The learner must be assessed on a calculation (compose a question component around a static instance instead); the task is executing a multi-step method with marking (CalculationBreakdown); the content is percentage change, reverse percentages, compound interest or inverse proportion (none are implemented); or the data is a dataset to interpret rather than a whole to divide (GraphView).
- **Choose instead:** Use AreaPerimeterExplore for mensuration — do not add fraction modes to it. Use AngleExplore for angle facts. Use CalculationBreakdown for executing a procedure step by step with a typed answer and marking. Use GraphView for interpreting supplied data, including pie charts.
- **Content shape:** Pick the preset matching the idea, and set defaultValue for a specific worked example. One diagram per screen, one idea at a time — fractionOperations’ method tabs are a bank of related mechanics, not an invitation to teach five operations on one screen; set method to seed the one being taught.
- **Rhythm role:** teaching, exploration.

**Contract:** standard

No invariants or exclusivity rules are recorded. Internal changes that keep the documented behaviour are ordinary development work.

---

### CoordinatePlaneExplore

**File:** `src/components/learning/CoordinatePlaneExplore.jsx`  
**Kind:** author-selectable component (`reusable`)  
**Lifecycle:** `reviewing` — Routed for chapter authoring in Phase 4 as block:coordinatePlaneFigure; the component itself is still under review, which is what keeps this lifecycle at reviewing.

**Purpose:** Configuration-driven GCSE coordinate plane — the coordinate-geometry sibling of AngleExplore, AreaPerimeterExplore, FractionRatioExplore and NumberLineExplore. One visual grammar runs through every preset: one plane (every preset shares an axis system, tick treatment and grid density), points that carry their coordinates (a named point is drawn with its coordinate chip — reading a coordinate is never a separate mode), and a rule made visible as geometry (across-then-up guides, the rise/run triangle, the mirror line, the centre of rotation, the rays from a centre of enlargement). That third clause is why transformations live here rather than in a separate component: a reflection is a rule that moves coordinates, and the coordinate movement is the teaching mechanism, not a finished diagram. Nine registered presets — plotPoint, midpoint, straightLine, tableOfValues, intersection, translate, reflect, rotate, enlarge — plus a compatible-preset-object escape hatch. A three-tier annotation contract governs density: active geometry (full coordinate chip, guide lines and rule geometry), related geometry (compact label only) and context geometry (visible but unannotated), with only one point active by default. Option selections live in the value model, so value/defaultValue/onChange carry the complete state and a static exam figure can specify a reflection in y = x or an enlargement by −1. Capabilities constrain state rather than hiding controls, and controls that cannot affect the current state are absent rather than inert. Axis placement is resolved per axis, so positive-only x against signed y renders correctly. interactive={false} gives a static teaching or exam figure that still carries a descriptive <desc> of the actual figure state. Respects prefers-reduced-motion (and a reducedMotion prop override).

**Best used for:** Coordinates and quadrants, midpoints, straight-line graphs and y = mx + c, tables of values, parallel and perpendicular gradients, solving simultaneous equations graphically, and all four transformations. Because axis labels, units and independent scales are part of the plane API, it also serves science graphs — subject="Physics" with xAxis={{ label: 'Time', unit: 's', min: 0, max: 20 }} gives a usable distance–time frame, not merely a recoloured Maths diagram. Questions, predictions, marking, scores and weakness tracking stay outside the component.

**Props:** `preset (name or preset object, defaults to plotPoint)`, `focus`, `comparisonRule`, `value (controlled values object)`, `defaultValue`, `onChange`, `interactive`, `disabled`, `showGuides ('active' | 'all' | 'none')`, `difficultyCapabilities`, `xAxis`, `yAxis`, `grid`, `subject`, `reducedMotion`, `label`, `showStatus`

**Data shape:** `{ type: 'coordinatePlaneFigure', preset: 'plotPoint' | 'midpoint' | 'straightLine' | 'tableOfValues' | 'intersection' | 'translate' | 'reflect' | 'rotate' | 'enlarge', focus?, comparisonRule?, value?, defaultValue?, interactive?, showGuides?, difficultyCapabilities?, xAxis?, yAxis?, grid?, label?, showStatus? }`

**Dependencies:** `SUBJECTS`, `GENERAL (via coordinatePlane/coordinatePlaneVisualRoles.js semantic roles)`, `TYPE`, `SPACING`, `COMPONENT_SIZE`, `RADII`, `MOTION (injected animation CSS via ensureStyles())`, `pure maths in coordinatePlane/coordinatePlaneMath.js`, `geometry and model-space clipping in coordinatePlane/coordinatePlaneGeometry.js`, `shared label placement in coordinatePlane/pointLabelLayout.js`, `capability and option resolution in coordinatePlane/presets/optionState.js`

**Story:** `src/components/learning/CoordinatePlaneExplore.stories.jsx`

**Owns these private internals:**

- `src/components/learning/coordinatePlane` (directory) — Pure coordinate maths, model-space geometry, label layout, option/capability state and one file per preset, rendered only through CoordinatePlaneExplore. Not separately selectable, and deliberately not an authoring choice.

**Notes:**

- Enforced by tests/architecture/coordinate-plane-{annotation-contract,control-reachability,visible-bounds}.test.js over the shared state space in tests/support/coordinatePlaneStateSpace.js.
- Known design debt: where both axes cross, a plotted point may cover an internal axis number. The coordinate chip still supplies the exact value, so nothing is unreadable, but relocating all axis numbering to the plot edges is a graph-system design decision rather than a safe renderer patch. Revisit when the wider graph system is next reviewed.

**Authoring**

- **Block type:** `coordinatePlaneFigure` — Coordinate plane figure
  - Status: `active`
  - Layout: content
  - Continuation: player-owned
  - Requires: `preset`:string
  - Pedagogy: teach-mechanism · reveal

**Decision**

- **Use when:** Position, movement or a coordinate rule must be understood through one responsive plane — for example plotting, midpoints, straight-line relationships, intersections or transformations.
- **Do not use when:** The learner is interpreting a supplied dataset rather than manipulating coordinates; the task is primarily calculating an answer; or a one-off static image communicates the complete figure without reusable behaviour.
- **Choose instead:** Use GraphView for charts and supplied datasets, NumberLineExplore for one-dimensional position, AngleExplore for angle facts, AreaPerimeterExplore for mensuration, or CalculationBreakdown for executing a numerical method.
- **Content shape:** One preset and one primary coordinate relationship per screen. Configure the values, focus, capabilities and axes needed for that learning beat; place questions, marking and weakness tracking outside the component.
- **Rhythm role:** teaching, exploration.

**Contract:** standard

No invariants or exclusivity rules are recorded. Internal changes that keep the documented behaviour are ordinary development work.

---

### BuilderBlock

**File:** `src/components/learning/BuilderBlock.jsx`  
**Kind:** author-selectable component (`reusable`)  
**Lifecycle:** `active`

**Purpose:** An assessed select-and-place reconstruction task. The learner chooses supplied pieces and places them into exact gaps to rebuild a known equation, reaction, quotation or short piece of text. After an incorrect check, correctly placed pieces remain locked while only the incorrect pieces return for repair.

**Best used for:** Supported reconstruction where understanding the structure and relationships matters, but fully independent recall would create unnecessary cognitive load.

**Props:** `block`, `subject`, `onComplete`

**Data shape:** `{ type: 'builder', label?, instruction?, layout?: 'reaction'|'expression'|'equation'|'calculation'|'text'|'cloze'|'sentence'|'quote', template?, slots?, pieces: Array<string|number|{ id?, label?, text? }>, answer: Array<string|number|{ label?, text? }>, operators?, groupLabels?, contextImage?, completionNoun? }`

**Dependencies:** `SUBJECTS`, `GENERAL`, `BUTTONS`, `COMPONENT_SIZE`, `SPACING`, `RADII`, `TYPE`, `ContinueCTA`, `ScreenBody`, `ScreenTitle`

**Authoring**

- **Block type:** `builder` — Builder block
  - Status: `active`
  - Layout: content
  - Continuation: component-owned
  - Requires one of: `pieces`:array, `options`:array, `items`:array
  - Pedagogy: apply · assessed

**Decision**

- **Use when:** The learner benefits from rebuilding a known structure while choosing from a finite bank of supplied pieces. Choose it for concise chemical reactions, equations, missing mathematical terms, high-value quotations, definitions or process statements where each piece has one defensible position.
- **Do not use when:** The learner should generate the answer independently, pieces belong in broad categories rather than exact positions, several arrangements are equally valid or the response is too long to reconstruct comfortably on mobile.
- **Choose instead:** Use FillInTheBlanksBlock when the learner should type one missing answer without supplied choices. Use MatchingTask for independent one-to-one pairs. Use ColSortBlock for category grouping. Use OrderedRouteTask when ordered stages are the knowledge being tested. Use CalculationBreakdown when the learner needs to understand and execute a complete connected method.
- **Content shape:** One concise structure with a finite bank of plausible pieces and one defensible arrangement. Every piece must contribute meaningful subject knowledge rather than acting as obvious filler. Keep the number of gaps manageable on mobile. Correctly placed pieces should remain locked after an unsuccessful check so the learner repairs only the unresolved gaps.
- **Rhythm role:** practice, retrieval, repair.

**Contract:** standard

No invariants or exclusivity rules are recorded. Internal changes that keep the documented behaviour are ordinary development work.

---

### CalculationBreakdown

**File:** `src/components/learning/CalculationBreakdown.jsx`  
**Kind:** author-selectable component (`reusable`)  
**Lifecycle:** `reviewing` — Full-screen component available in the Component Lab but not yet routed in ChapterPlayer.jsx.

**Purpose:** A staged teaching-and-application component that helps the learner interpret one procedural calculation, choose a useful first move, follow worked transformations, complete part of the method themselves and see why the full solution works. It lives inside the standard interaction frame and owns only the local calculation sequence.

**Best used for:** Multi-step GCSE Maths or Science calculations where understanding the method matters as much as obtaining the final answer — including equations, rearranging formulae, fractions, percentages, substitution, geometry and scientific equations.

**Props:** `block`, `subject (defaults to Maths)`, `accent`, `reducedMotion (test/story override only)`, `onContinue`

**Data shape:** `{ title?, goalPrompt?, problem, understand: { heading?, intro?, whatsHappening?, goal?, whyGoal?, decision?, check? }, steps: [{ mode: 'worked'|'yourTurn', title, why?, transform: { from, leftOp?, rightOp?, to }, whyStep?, check?, answer?, resultExpr?, hint?, reasoning?, cta? }], solution: { celebrateTitle?, celebrateSubtitle?, result, rows?, why? }, presentation?, backgroundImage?, backgroundOpacity? }`

**Dependencies:** `GENERAL`, `SUBJECTS`, `TYPE`, `SPACING`, `RADII`, `MOTION`, `ContinueCTA`, `CheckAnswerCTA`, `InteractionShell`, `ScreenTitle`, `src/components/learning/calculationBreakdown/`

**Story:** `src/components/learning/CalculationBreakdown.stories.jsx`

**Owns these private internals:**

- `src/components/learning/calculationBreakdown` (directory) — Visual models, controls, figures and parts used only to render CalculationBreakdown, plus its pure operation maths and model validation. Not separately selectable, and deliberately not an authoring choice.

**Governance rules:**

- Backwards compatibility is absolute: a block with no presentation field (or variant: 'standard') renders the existing walkthrough unchanged. Every existing algebra, percentage, geometry, fractions and science block is untouched.
- Never a parsed equation. Visual models receive explicit numbers. The only string input is operation, read through a closed token grammar ('÷ 3', '+ 4') that rejects anything else; left/right/resultLeft/resultRight are display strings and are never parsed.
- Invalid models are refused, not repaired. calculationBreakdownValidation.js rejects inexact group splits, group counts outside 2–5, totals over 30, chains that do not solve to a whole number, no-op steps and division by zero. A rejected model logs its reasons in development and falls back to the standard walkthrough — it never draws misleading groups.
- reasoning is optional everywhere. Each variant derives all five explanations from its model; authored copy overrides individual fields. step.reasoning may also be supplied on a generic worked step, where it renders as the same "Why this works" panel.
- Use operation language. "Subtract 4 from both sides", never "move the 4 across and change the sign". The plain relationship comes first, the formal term second: "Division undoes multiplication. These are inverse operations."
- Choreography is fixed: predict → act → observe → explain → check. The learner commits to at least one decision before any final answer appears; wrong choices explain the misunderstanding and re-open immediately, with no scoring, streaks or progress tracker inside the component.

**Notes:**

- Optional algebra reasoning presentations. CalculationBreakdown remains one generic calculation component. block.presentation is an opt-in field that swaps the generic worked-step sequence for a scene sequence built for one specific teaching job — why an algebraic operation is valid, not just which operation to perform. These are not separate components and must not be registered, routed or documented as such; they share this component’s public API, frame, title treatment, stage surface, navigation, CTAs and accessibility behaviour.
- Shape: presentation: { variant: 'standard' | 'algebraWhy' | 'inverseMachine' | 'groupSplit' | 'balance', model: { per-variant }, reasoning?: { goal?, structure?, inverse?, equality?, check? } }.
- algebraWhy builds a coefficient from repeated addition, names the goal, forces a decision against a live subtraction misconception, then divides both sides and checks by substitution — model { variable, coefficient, total, solution? }. inverseMachine treats multi-step equations as actions undone in reverse order, with the reverse chain derived from the forward operations and never authored — model { variable, operations: [{ type, value }], result }. groupSplit makes a coefficient concrete by sharing the total into equal groups by tap, keyboard or one split action — model { variable, groupCount, total, solution? }. balance shows why the same operation goes on both sides; the one-sided move is offered, refused and explained — model { states: [{ left, right, operation, resultLeft, resultRight, misconception? }] }.
- Where the code lives: src/components/learning/calculationBreakdown/ — calculationBreakdownMath.js (pure operation maths), calculationBreakdownValidation.js (model validation and fallback), calculationBreakdownVisualRoles.js (semantic colour roles), calculationBreakdownParts.jsx / calculationBreakdownControls.jsx / calculationBreakdownFigures.jsx (shared display pieces), CalculationVisualModel.jsx (the scene runner) and one file per variant. Maths never lives in JSX; variant rendering is a lookup table, not a switch.

**Authoring**

- **Screen type:** `calculationBreakdown` — Calculation breakdown
  - Status: `active`
  - Layout: full-screen
  - Continuation: component-owned
  - Requires one of: `steps`:array, `presentation`:object
  - Pedagogy: sequence-process, apply · assessed

**Decision**

- **Use when:** A calculation contains several connected operations and the learner needs to understand both what to do and why each move is valid or useful. Choose it when the method should be explicitly modelled before the learner applies part of it.
- **Do not use when:** Only one simple operation is required, a visual model should establish the concept first, the learner is ready for independent exam practice, the content is primarily written analysis or the method varies so widely that one fixed sequence would be misleading.
- **Choose instead:** Use FractionRatioExplore, AreaPerimeterExplore or another visual exploration component when the learner first needs to see why the mathematics works. Use BuilderBlock when the learner should reconstruct a short equation from supplied pieces. Use FillInTheBlanksBlock for one missing value or term. Use ExamQuestionFrame when the learner should attempt the full calculation independently. Use GuidedExamResponse for an extended written response rather than a numerical method.
- **Content shape:** One problem with a clear interpretation, a defined goal, a small number of purposeful steps, an explanation of why each move helps, at least one learner-completed step and a complete final solution with a check or explanation. Avoid breaking obvious arithmetic into patronising micro-steps. Scaffolding should become lighter when stronger learner evidence makes the full support unnecessary.
- **Rhythm role:** teaching, practice, repair.

**Contract:** critical

**Why change is costly:** The algebra presentations were audited against a 390px and 320px render pass and signed off on 2026-07-29. Each rule below was a deliberate outcome of that review, and each is the kind of thing a tidying refactor removes on the way to a shorter file — the component still renders, it just stops teaching why the operation is valid.

**Invariants:**

- `standard-walkthrough-unchanged-without-a-presentation` — A block with no presentation field (or variant: 'standard') renders the existing walkthrough unchanged. Every existing algebra, percentage, geometry, fractions and science block is untouched.
  - Evidence: `test` — tests/unit/calculationBreakdownValidation.test.js; `story` — src/components/learning/CalculationBreakdown.stories.jsx
- `model-stays-visible-through-each-decision` — The concrete visual model stays on screen through every decision scene. A choice screen is never reduced back to a bare equation.
  - Evidence: `review` — Step through each presentation variant at 390px and confirm the model is still drawn on every decision scene.
- `verdict-and-reasoning-stay-distinct` — The verdict panel ("What happened") is situational and the reasoning rail ("Rule to remember") is general. They must not share a heading or repeat a sentence.
  - Evidence: `review` — Compare the two panels on one scene: neither heading nor sentence may be duplicated between them.
- `one-sided-move-breaks-the-balance-visibly` — A one-sided balance move breaks the balance immediately and visibly, never behind an optional reveal.
  - Evidence: `review` — Take the refused one-sided move in the balance variant and confirm the break renders without any further tap.
- `decision-scene-carries-no-extra-support-line` — A decision scene carries one instruction, one question and the options — no support line that restates the question or eliminates a distractor in advance.
  - Evidence: `review` — Read each decision scene for a fourth line of copy beyond instruction, question and options.
- `invalid-models-are-refused-not-repaired` — calculationBreakdownValidation.js rejects inexact group splits, group counts outside 2–5, totals over 30, chains that do not solve to a whole number, no-op steps and division by zero. A rejected model falls back to the standard walkthrough — it never draws misleading groups.
  - Evidence: `test` — tests/unit/calculationBreakdownValidation.test.js
- `never-parses-an-equation` — Visual models receive explicit numbers. The only string input is operation, read through a closed token grammar ('÷ 3', '+ 4') that rejects anything else; left/right/resultLeft/resultRight are display strings and are never parsed.
  - Evidence: `test` — tests/unit/calculationBreakdownValidation.test.js

**Requires a product decision:**

- Re-sequencing, restyling or refactoring the internals of src/components/learning/calculationBreakdown/ without a learning problem to fix
- Changing the fixed predict → act → observe → explain → check choreography
- Adding scoring, streaks or progress tracking inside the component
- Registering, routing or documenting a presentation variant as a separate component

---

### CinematicCarousel

**File:** `src/components/learning/CinematicCarousel.jsx`  
**Kind:** author-selectable component (`reusable`)  
**Lifecycle:** `active`

**Purpose:** Full-screen "deep dive" carousel — one large image at a time (objectFit: contain, so any aspect ratio works), with glass prev/next arrow buttons either side. A name and key-facts panel below slides in to match the navigation direction. Progress dots track which items have been viewed; Continue unlocks once every item has been seen at least once.

**Best used for:** Browsing a small related set of things in turn, each worth a focused look — e.g. the organelles inside a cell, the planets of the solar system, the stages of a specialised cell. Designed for cinematic single-item focus, not for scanning a large list.

**Props:** `block`, `subject (defaults to Biology)`, `onContinue`

**Data shape:** `{ type: 'cinematicCarousel', title?, intro?, items: [{ id, image, label, facts: string[] }] }`

**Dependencies:** `SUBJECTS`, `SPACING`, `MOTION`, `RADII`, `usePrefersReducedMotion`

**Story:** `src/components/learning/CinematicCarousel.stories.jsx`

**Authoring**

- **Screen type:** `cinematicCarousel` — Cinematic carousel
  - Status: `active`
  - Layout: full-screen
  - Continuation: component-owned
  - Requires: `items`:array
  - Pedagogy: teach-mechanism · reveal

**Decision**

- **Use when:** The learner needs to explore a small related collection in which every item deserves its own image, name and focused set of facts. Choose it when viewing each item separately helps the learner notice or understand its individual features.
- **Do not use when:** The items form a chronological or causal sequence, require direct side-by-side comparison, belong in assessed categories or could be understood more clearly when displayed together. Do not use it for one concept, one important person, a large catalogue or a general list of facts with decorative images.
- **Choose instead:** Use TimelineChain when order or causal progression matters. Use TheoryCompare when two items need developed parallel comparison. Use KeyFigureReveal when one important person requires deeper treatment. Use InteractiveHotspotImage when the information concerns different parts of one shared image or object. Use Infographic when the learner benefits from seeing the complete system or dataset together. Use ColSortBlock or SwipeSort when the learner must categorise the items themselves.
- **Content shape:** Usually three to six clearly related and visually distinct items. Every item needs one meaningful image, one concise label and a small number of focused facts. All items should answer the same broad learning question, but each must contribute something different. The order should not carry essential chronological or causal meaning. Avoid long paragraphs, repeated facts and items included only to increase the set size.
- **Rhythm role:** teaching, exploration.

**Contract:** standard

No invariants or exclusivity rules are recorded. Internal changes that keep the documented behaviour are ordinary development work.

---

### CinematicRevealMoment

**File:** `src/components/learning/CinematicRevealMoment.jsx`  
**Kind:** author-selectable component (`reusable`)  
**Lifecycle:** `active`

**Purpose:** Full-screen cinematic video or image reveal moment. Atmospheric, single-focus, high-emotion screen.

**Props:** `block`, `subject`, `onContinue`, `onBack`

**Dependencies:** `SUBJECTS`, `MOTION`, `CinematicContinueCTA`

**Authoring**

- **Screen type:** `cinematic` — Cinematic reveal moment
  - Status: `active`
  - Layout: full-screen
  - Continuation: component-owned
  - Header: cinematic
  - Requires one of: `videoSrc`:string, `fallbackImage`:string
  - Pedagogy: hook-tension · passive

**Decision**

- **Use when:** One powerful image or video can create emotional weight, surprise, tension or a sense of significance that prepares the learner for the teaching that follows. Choose it for a genuine reveal or turning point, not simply because suitable media exists.
- **Do not use when:** The learner needs detailed explanation, several facts, a person profile, a visual collection or an interaction that checks understanding. Do not use it as a substitute for teaching, as a generic chapter title screen or merely to make the chapter feel more cinematic.
- **Choose instead:** Use ConceptReveal when one new idea needs a clear conceptual introduction. Use KeyFigureReveal when the learner must understand an important person and their contribution. Use CinematicCarousel when several related images or objects need individual exploration. Use InteractiveHotspotImage when the learner should inspect meaningful locations within one image. Use a normal teaching component when the media does not materially improve understanding or emotional engagement.
- **Content shape:** One exceptional image or video, one concise framing line and, where needed, one short impact statement. Text must remain minimal so the media retains focus. The next screen must explain, explore or apply why the moment matters; the cinematic reveal must not be left as an isolated spectacle.
- **Rhythm role:** opening.

**Contract:** standard

No invariants or exclusivity rules are recorded. Internal changes that keep the documented behaviour are ordinary development work.

---

### CircuitDiagram

**File:** `src/components/learning/CircuitDiagram.jsx`  
**Kind:** author-selectable component (`reusable`)  
**Lifecycle:** `active` — Routed for chapter authoring in Phase 4 as block:circuitDiagram.

**Purpose:** Renders a GCSE Physics simple series circuit (battery, wire loop, bulb, switch) as inline SVG primitives — not a static image. Open versus closed is driven by a single closed prop: when closed the switch arm bridges both contacts, an animated cyan current overlay flows around the loop, and the bulb glows warm amber; when open the arm is raised, the current overlay is hidden, and the bulb is dim. Restrained Physics blue/cyan glow only; the moving current animation is disabled under prefers-reduced-motion.

**Props:** `closed (boolean)`

**Data shape:** `{ type: 'circuitDiagram', preset: 'simpleSeries' | 'twoSwitchSeries' | 'parallelBranches' | 'measurementCircuit', closed?, defaultClosed?, interactive?, label?, showStatus? }`

**Dependencies:** `SUBJECTS (Physics palette)`, `injects animation/glow CSS classes once via an ensureStyles() <style> block (same pattern as GraphView)`, `circuit/CircuitPrimitives.jsx`, `circuit/circuitVisualRoles.js`

**Story:** `src/components/learning/CircuitDiagram.stories.jsx`

**Owns these private internals:**

- `src/components/learning/circuit` (directory) — Shared SVG circuit primitives and semantic colour roles for the Physics circuit family. Rendered only through CircuitDiagram and CircuitSymbolReference; carries no learning behaviour of its own.

**Notes:**

- Guarded by tests/architecture/circuitDiagramGovernance.test.js and tests/architecture/circuitSwitchAffordance.test.js.

**Authoring**

- **Block type:** `circuitDiagram` — Circuit diagram
  - Status: `active`
  - Layout: content
  - Continuation: player-owned
  - Requires: `preset`:string
  - Pedagogy: teach-mechanism · reveal

**Decision**

- *Pending* — The registry entry has never carried a five-field Decision block. Its boundary against a static figure image and against the Maths Explore family is a pedagogical judgement current source, stories and contracts do not settle.

**Contract:** standard

No invariants or exclusivity rules are recorded. Internal changes that keep the documented behaviour are ordinary development work.

---

### ConceptReveal

**File:** `src/components/learning/ConceptReveal.jsx`  
**Kind:** author-selectable component (`reusable`)  
**Lifecycle:** `active`

**Purpose:** Concept introduction with atmospheric reveal. Introduces a new idea cinematically before quiz questions.

**Props:** `block`, `subject`, `onContinue`, `onBack`

**Dependencies:** `SUBJECTS`, `MOTION`, `CinematicContinueCTA`

**Contract doc:** `docs/system/CONCEPT_REVEAL_CONTRACT.md`

**Authoring**

- **Screen type:** `conceptReveal` — Concept reveal
  - Status: `active`
  - Layout: full-screen
  - Continuation: component-owned
  - Requires: `steps`:array
  - Pedagogy: teach-mechanism · reveal

**Decision**

- **Use when:** The learner needs a clear, memorable introduction to one important new concept before its details, examples or applications are developed. Choose it when the next section depends on the learner first grasping a single central idea.
- **Do not use when:** The content concerns a specific person, several related items, a sequence of connected stages or a dramatic image that carries the emotional meaning by itself. Do not use it as a decorative title screen or repeat it every time a new subtopic begins.
- **Choose instead:** Use KeyFigureReveal when one important person and their contribution need to anchor the learning. Use CinematicRevealMoment when one image or video should create emotional significance before the teaching begins. Use CinematicCarousel when several related items each deserve individual visual focus. Use ExplainReveal when the learner needs to understand how several linked ideas lead from one to the next. Use a standard teaching screen when the idea does not need a distinct conceptual reveal.
- **Content shape:** One central concept expressed through a clear headline, a short framing explanation and one strong takeaway. Supporting visual material should strengthen the concept rather than merely decorate it. Avoid multiple competing ideas, detailed evidence, long paragraphs and lists of loosely related facts.
- **Rhythm role:** opening, teaching.

**Contract:** critical

**Why change is costly:** Its reveal choreography is a written contract, not an implementation detail: the eyebrow, CTA gating and progress rules were each fixed after a specific regression, and each is easy to reintroduce while the screen still looks correct.

**Invariants:**

- `eyebrow-hidden-by-default` — Eyebrows stay hidden unless a step explicitly requests one (showEyebrow === true).
  - Evidence: `test` — tests/architecture/concept-reveal-contract.test.js
- `final-cinematic-continue-only` — Exactly one CinematicContinueCTA is rendered, and only on the final step, after the step gate.
  - Evidence: `test` — tests/architecture/concept-reveal-contract.test.js
- `no-local-progress-dots` — It renders no custom local progress dots and no text-only "tap to continue" hint.
  - Evidence: `test` — tests/architecture/concept-reveal-contract.test.js
- `background-taps-stay-in-screen` — A background tap advances the internal step sequence and never calls onContinue; only the final CTA leaves the screen.
  - Evidence: `test` — tests/architecture/concept-reveal-contract.test.js

**Requires a product decision:**

- Changing the reveal choreography documented in docs/system/CONCEPT_REVEAL_CONTRACT.md
- Adding a local progress indicator or a second progression affordance

---

### ExplainReveal

**File:** `src/components/learning/ExplainReveal.jsx`  
**Kind:** author-selectable component (`reusable`)  
**Lifecycle:** `active`

**Purpose:** Progressive step-by-step reasoning chain with tap-to-reveal steps.

**Best used for:** Teaching cause-and-effect logic (e.g. "Wrong belief → Wrong treatment → Patient harm"). Teaches the reasoning chain, not just facts.

**Props:** `block`, `subject`, `onContinue`, `onBack`

**Dependencies:** `SUBJECTS`, `MOTION`

**Authoring**

- **Block type:** `explainReveal` — Explain reveal
  - Status: `active`
  - Layout: content
  - Continuation: player-owned
  - Pedagogy: teach-mechanism · reveal

**Decision**

- **Use when:** The learner needs to understand a short reasoning chain in which one idea leads directly to the next, such as belief → action → consequence or cause → mechanism → effect. Choose it when the important learning is the logic connecting the steps, not merely remembering their order.
- **Do not use when:** The content is primarily a dated chronology, a series of distinct historical events or a practical process whose stages have their own identities. Do not use it when the learner should place the steps themselves or when the ideas do not form one clear chain.
- **Choose instead:** Use TimelineChain when the learner needs to explore a chronological, causal or procedural sequence made up of distinct events or stages. Use OrderedRouteTask when the sequence has already been taught and the learner must place known stages correctly. Use TheoryCompare when the relationship is a comparison rather than a chain. Use ConceptReveal when only one idea needs introducing rather than several linked steps.
- **Content shape:** A single unbroken reasoning chain, usually three to six concise steps. Each step must clearly cause, explain or lead to the next. The chain should answer one central "how?" or "why?" question. Avoid branches, unrelated facts and stages that could be rearranged without changing the meaning.
- **Rhythm role:** teaching.

**Contract:** standard

No invariants or exclusivity rules are recorded. Internal changes that keep the documented behaviour are ordinary development work.

---

### FaceTheExaminer

**File:** `src/components/learning/FaceTheExaminer.jsx`  
**Kind:** author-selectable component (`reusable`)  
**Lifecycle:** `active`

**Purpose:** A post-teaching examiner simulation built around one prepared sample answer. The learner reads the response, predicts its mark, identifies which criteria it meets, compares that judgement with the examiner’s verdict, edits annotated weak sections and submits the improved answer for re-marking. FaceTheExaminer.jsx is the compatibility export for faceTheExaminer/FaceTheExaminerContainer.jsx.

**Best used for:** Teaching how marks are awarded by making the learner judge and improve a realistic, imperfect response rather than simply reading a model answer.

**Props:** `module`, `examiner`, `onExit`, `onContinue`

**Data shape:** `Examiner shape: { question, marks, sampleAnswer, mark, markScheme, criteriaOptions?, annotations?, subject?, board?, type?, backgroundImage?, videoSrc? }`

**Dependencies:** `FaceTheExaminerIntro`, `FaceTheExaminerMain`, `FaceTheExaminerDone`, `SegmentedControl`, `ContinueCTA`, `SUBJECTS`, `GENERAL`, `/api/examiner`

**Owns these private internals:**

- `src/components/learning/faceTheExaminer` (directory) — Phase components of the FaceTheExaminer flow (intro, main, marking, verdict, done) plus its container. FaceTheExaminer.jsx is the compatibility export authors use; the phases are never placed individually.

**Authoring**

- **Screen type:** `faceExaminer` — Face the examiner
  - Status: `active`
  - Layout: full-screen
  - Continuation: component-owned
  - Requires: `examiner`:object
  - Pedagogy: exam-technique · assessed

**Decision**

- **Use when:** The learner needs to understand how an examiner applies criteria to a whole answer, distinguish genuine strengths from weaknesses and improve specific passages before seeing the answer re-marked. Choose it when judgement and revision of the response are the central learning jobs.
- **Do not use when:** The learner should write their own answer from scratch, the sample is either perfect or completely unusable, the only feedback is generic advice such as "add more detail", or there are no precise weak sections that can be meaningfully edited. Do not use it for one isolated factual error or as a decorative model-answer reveal.
- **Choose instead:** Use ExamQuestionFrame for independent exam-response practice. Use WhatExaminersLookFor for a short success-criteria briefing before writing. Use GuidedExamResponse when the learner needs substantial construction support. Use SpotTheError when one precise sentence-level error should be identified and repaired rather than the whole answer judged.
- **Content shape:** One authentic exam-style question and one plausible, imperfect sample answer containing genuine strengths and a small number of improvable weaknesses. Supply an accurate original mark, learner-friendly criteria, precise annotations, editable weak passages and a defensible re-marking route. The answer must be good enough to reward careful judgement rather than being cartoonishly poor.
- **Rhythm role:** practice, repair.

**Contract:** standard

No invariants or exclusivity rules are recorded. Internal changes that keep the documented behaviour are ordinary development work.

---

### FillInTheBlanksBlock

**File:** `src/components/learning/FillInTheBlanksBlock.jsx`  
**Kind:** author-selectable component (`reusable`)  
**Lifecycle:** `active`

**Purpose:** A short typed-recall activity. The learner supplies one missing word, phrase or numerical value inside meaningful context, receives a hint after the first incorrect attempt and sees the correct answer after a second unsuccessful attempt.

**Best used for:** Generative retrieval where the surrounding sentence provides a useful cue but the learner must still produce the missing answer rather than recognise it from options.

**Props:** `block`, `subject`, `onContinue`

**Data shape:** `{ type: 'fillblanks', sentences: [{ before?, after?, answer, acceptedAnswers?, matchMode?, hint?, hints?, feedback?, placeholder?, ariaLabel?, inputMode? }], wrongMsg?, correctMsg?, placeholder?, backgroundImage?, backgroundPosition?, backgroundOpacity?, backgroundFilter? }`

**Dependencies:** `SequenceProgress`, `CheckAnswerCTA`, `ContinueCTA`, `SUBJECTS`, `subject backdrops`, `GENERAL`, `COMPONENT_SIZE`, `SPACING`, `MOTION`, `RADII`, `TYPE`, `fillInTheBlanksMatching`

**Notes:**

- Guided construction family rule — choose according to what the learner must produce: select supplied pieces and rebuild an exact structure → BuilderBlock; generate and type one missing answer from context → FillInTheBlanksBlock; understand and execute a connected procedural method → CalculationBreakdown. These form a graduated support pathway but are not interchangeable. Do not supply choices when independent recall is the learning goal, and do not reduce a multi-step method to disconnected missing-value questions.

**Authoring**

- **Block type:** `fillblanks` — Fill in the blanks
  - Status: `active`
  - Layout: content
  - Continuation: player-owned
  - Requires: `sentences`:array
  - Pedagogy: retrieve · assessed

**Decision**

- **Use when:** The surrounding sentence gives a useful retrieval cue, but the learner should independently generate and type one missing word, phrase or numerical value. Choose it for precise scientific terminology, a missing historical fact, a quotation fragment, a formula value or one essential word that changes a definition’s meaning.
- **Do not use when:** Several supplied pieces must be arranged, multiple gaps form one larger structure, several answers could reasonably fit, grammar reveals the answer without subject knowledge or the learner needs an extended explanation.
- **Choose instead:** Use BuilderBlock when choices should be supplied and positioned. Use QuickRecallScreen for short objectively marked questions with answer options. Use SpotTheError when the learner must diagnose and repair incorrect wording. Use GuidedExamResponse when the response needs developed writing rather than one precise missing answer.
- **Content shape:** Usually three to six short independent sentences, each containing one meaningful gap and one defensible answer. The surrounding wording must test subject knowledge rather than provide an accidental grammatical clue. Use accepted alternatives only where they are genuinely equivalent, and provide a hint that narrows the concept without simply revealing the answer.
- **Rhythm role:** retrieval, practice, repair.

**Contract:** standard

No invariants or exclusivity rules are recorded. Internal changes that keep the documented behaviour are ordinary development work.

---

### Infographic

**File:** `src/components/learning/Infographic.jsx`  
**Kind:** author-selectable component (`reusable`)  
**Lifecycle:** `active`

**Purpose:** Canonical screen for a single teaching heading and framing line (owned by the approved TeachScreenShell, Route A) followed by one governed infographic media slot (MediaPlaceholder). Owns no heading typography or screen rhythm of its own — it fixes the standard "title + intro + infographic" composition into one named screen so authoring it has a clear build target. The media slot passes through to MediaPlaceholder, so the infographic can be a reserved diagram slot or a progressive quadrant reveal.

**Props:** `subject`, `eyebrow`, `heading`, `intro`, `media ({ kind, aspect, caption })`

**Dependencies:** `TeachScreenShell`, `MediaPlaceholder`

**Story:** `src/components/learning/Infographic.stories.jsx`

**Authoring**

- **Screen type:** `infographic` — Infographic
  - Status: `active`
  - Layout: content
  - Continuation: player-owned
  - Requires: `media`:object
  - Pedagogy: teach-mechanism · passive

**Decision**

- **Use when:** The learner needs to understand a complete system, structure, relationship or summary through one coherent visual. Choose it when seeing the whole picture together is more useful than exploring separate items or reading several text screens. It may also be used for a short progressive visual reveal when the individual revealed parts combine into one meaningful whole.
- **Do not use when:** The learner needs to inspect particular locations within the image, move through a sequence of separate scenes, compare two developed sides or interpret numerical data. Do not use it as a poster containing large amounts of tiny text or as a decorative image beneath a heading.
- **Choose instead:** Use InteractiveHotspotImage when information belongs to specific locations within one image. Use VisualLearning when understanding should build through a sequence of full-screen visual scenes. Use CinematicCarousel when several independent items require focused exploration. Use GraphView when the visual encodes numerical values, trends, correlation or proportion. Use TimelineChain when order or causal progression is the central learning.
- **Content shape:** One clear teaching heading, one short framing line and one primary visual asset: a supplied diagram or infographic, a progressive image reveal whose sections combine into one whole, or a short explanatory clip. The asset must perform one clear learning job and remain legible on a mobile screen. Labels, symbols and relationships must be readable without zooming. Avoid dense poster layouts, long explanatory paragraphs inside the image, multiple unrelated diagrams and decorative imagery that adds no understanding.
- **Rhythm role:** teaching.

**Contract:** standard

No invariants or exclusivity rules are recorded. Internal changes that keep the documented behaviour are ordinary development work.

---

### InteractiveHotspotImage

**File:** `src/components/learning/InteractiveHotspotImage.jsx`  
**Kind:** author-selectable component (`reusable`)  
**Lifecycle:** `active`

**Purpose:** Full-screen image with tappable hotspots. Two-phase: intro reveal → explore hotspots. Two variants: detail (default — one card of labelled rows per hotspot) and reveal (pages through multiple pieces of information per hotspot via reveals[]). An optional synthesis shows a "collection complete" summary once all hotspots are explored.

**Props:** `subject`, `title`, `introText`, `image`, `imageAlt`, `hotspots`, `ctaLabel`, `variant`, `synthesis`, `onBack`, `onEnterExplore`, `onContinue`

**Dependencies:** `SUBJECTS`, `MOTION`

**Notes:**

- Absorbed the former InteractiveCollectionExplorer.

**Authoring**

- **Screen type:** `interactiveImage` — Interactive hotspot image
  - Status: `active`
  - Layout: full-screen
  - Continuation: component-owned
  - Requires: `image`:string, `hotspots`:array
  - Pedagogy: teach-mechanism, apply · reveal

**Decision**

- **Use when:** The learner needs to explore several meaningful locations within one shared image, diagram, source or object. Choose it when understanding depends on connecting each piece of information to where it appears physically, such as parts of a cell, features of a building, evidence within a historical source or structures within an organ.
- **Do not use when:** The information is not genuinely linked to locations in the image, the learner would understand it better by seeing all labels together or the image is merely decorative. Do not use it for a collection of separate objects, a chronological sequence, numerical data or a scored image-identification question.
- **Choose instead:** Use Infographic when the learner needs to see the complete labelled system or summary together. Use VisualLearning when several full-screen visual scenes should build a guided explanation in a fixed order. Use CinematicCarousel when several separate items each deserve individual visual focus. Use GraphView when the visual information is numerical. Pair the image with an assessed question component when the learner must give a right or wrong answer rather than simply explore.
- **Content shape:** One clear, high-quality image with usually three to six meaningful hotspots. Every hotspot must be attached to a defensible physical location and reveal information that is specifically relevant to that location. Each hotspot should have a concise title and either a small set of clearly labelled detail rows or a short progressive series of reveals. Hotspots must not overlap so closely that they are difficult to select on mobile. Avoid arbitrary dot placement, long paragraphs, hidden trivia and information that could be moved to another location without changing its meaning. Use the optional synthesis only when exploring all hotspots leads to a useful overall conclusion.
- **Rhythm role:** teaching, exploration.

**Contract:** standard

No invariants or exclusivity rules are recorded. Internal changes that keep the documented behaviour are ordinary development work.

---

### VisualLearning

**File:** `src/components/learning/VisualLearning.jsx`  
**Kind:** author-selectable component (`reusable`)  
**Lifecycle:** `active`

**Purpose:** A full-screen, tap-through sequence of image-led scenes. Each scene pairs one purposeful background image with a concise headline and short explanation; the sequence can end with a larger synthesis reveal. The learner advances through the scenes in a fixed order, with governed local progress and no scored answer.

**Props:** `block`, `subject`, `onComplete`

**Dependencies:** `SequenceProgress`, `SUBJECTS`, `CinematicShell`, `TYPE`, `GENERAL`, `usePrefersReducedMotion`

**Authoring**

- **Screen type:** `visualLearning` — Visual learning sequence
  - Status: `active`
  - Layout: full-screen
  - Continuation: component-owned
  - Requires one of: `scenes`:array, `steps`:array, `items`:array
  - Pedagogy: hook-tension, teach-mechanism · reveal

**Decision**

- **Use when:** The learner should move through a short, guided sequence of full-screen visual scenes that gradually builds one explanation, narrative or change in understanding. Choose it when each scene adds a new layer and the final scene can synthesise what the learner has just seen. The order should support the intended narrative, but the component is not intended to teach the formal order of named stages.
- **Do not use when:** All the information belongs to different locations within one image, the items form a non-sequential collection or the order of the stages is itself the knowledge being taught. Do not use it for one isolated dramatic image, text-heavy teaching, free exploration or assessment.
- **Choose instead:** Use InteractiveHotspotImage when the learner should inspect different locations within one shared image. Use CinematicCarousel when several related but independent items can be explored individually and in either direction. Use TimelineChain when the identity, order or causal connection of distinct stages is the central learning. Use CinematicRevealMoment when only one powerful visual moment is required. Use ConceptReveal when one idea needs introducing without a multi-scene visual narrative.
- **Content shape:** Usually three to six full-screen scenes. Each regular scene needs one purposeful background image, one concise headline and one short explanatory statement. Each scene must advance the same central explanation rather than repeat it in different words. The final reveal should synthesise the scenes into one clear conclusion or changed understanding. Avoid long paragraphs, fact lists, decorative stock images and scenes that could be removed without weakening the narrative. Do not disguise an ordinary slideshow as visual learning: the images must carry meaningful explanatory or emotional work.
- **Rhythm role:** opening, teaching.

**Contract:** standard

No invariants or exclusivity rules are recorded. Internal changes that keep the documented behaviour are ordinary development work.

---

### KeyFigureReveal

**File:** `src/components/learning/KeyFigureReveal.jsx`  
**Kind:** author-selectable component (`reusable`)  
**Lifecycle:** `active`

**Purpose:** A full-screen, portrait-led introduction to one important person. The learner meets the figure through their name and role, then swipes through focused sections covering their ideas, evidence, contribution, significance or impact. Sections may include concise explanation, supporting imagery, a quotation and a takeaway.

**Props:** `block`, `subject`, `onComplete`

**Dependencies:** `SUBJECTS`, `TYPE`, `SPACING`, `COMPONENT_SIZE`, `RADII`, `GENERAL`, `MOTION`, `CinematicShell`, `ContinueCTA`, `SequenceProgress`

**Notes:**

- Opening family rhythm rule — choose one clear opening treatment per learning job: one concept → ConceptReveal; one emotionally significant moment → CinematicRevealMoment; one important person → KeyFigureReveal; one related visual collection → CinematicCarousel. Do not stack these components simply because they are cinematic. After the opening beat, move promptly into explanation, exploration, practice or retrieval. CinematicRevealMoment should be the rarest of the four because it carries the least teaching content by itself. ChapterHookScreen is also tagged cinematic; when used, it fulfils the chapter’s one cinematic-moment requirement.

**Authoring**

- **Screen type:** `keyFigureReveal` — Key figure reveal
  - Status: `active`
  - Layout: full-screen
  - Continuation: component-owned
  - Pedagogy: introduce-figure · reveal

**Decision**

- **Use when:** One person is important enough to organise the learner’s understanding of the topic, and the learner needs to know who they were, what they contributed and why they mattered. Choose it when the figure is a meaningful conceptual anchor rather than simply a name that appears in the specification.
- **Do not use when:** The person is a minor factual detail, several people need equal coverage, two people need direct comparison or the main learning is a chronology of events rather than the significance of the individual. Do not use it just because a portrait is available.
- **Choose instead:** Use TheoryCompare when two people need developed parallel comparison. Use CinematicCarousel when several people each need a shorter introduction as members of one related set. Use ConceptReveal when the central learning is an idea rather than a person. Use TimelineChain when the important content is a chronological sequence of the person’s work or changing influence. Use a standard teaching screen when only a brief contribution or name needs mentioning.
- **Content shape:** Exactly one significant figure with a strong, relevant portrait, a clear role or identity line and usually two to four focused sections. Each section should have one distinct job, such as background, key idea, evidence, contribution or impact. Keep the sections concise and finish with a clear statement of why the person matters to the topic. Quotes and supporting images must add evidence or meaning rather than atmosphere alone.
- **Rhythm role:** opening, teaching.

**Contract:** standard

No invariants or exclusivity rules are recorded. Internal changes that keep the documented behaviour are ordinary development work.

---

### QuickRecallScreen

**File:** `src/components/learning/QuickRecallScreen.jsx`  
**Kind:** author-selectable component (`reusable`)  
**Lifecycle:** `active`

**Purpose:** Rapid-fire retrieval screen for choice, connection and true/false questions. Presents one short question at a time through UnifiedQuestionScreen, gives immediate feedback and records supported question outcomes in the weakness tracker.

**Props:** `subject`, `chapterNum`, `chapterTitle`, `questions`, `onBack`, `onContinue`, `renderHeader`

**Dependencies:** `UnifiedQuestionScreen`, `unifiedWeaknessTracker`, `SequenceProgress`

**Authoring**

- **Screen type:** `quickRecall` — Quick recall
  - Status: `active`
  - Layout: full-screen
  - Continuation: component-owned
  - Requires: `questions`:array
  - Pedagogy: retrieve · assessed

**Decision**

- **Use when:** The learner needs a fast sequence of short, objectively marked questions that retrieves knowledge already taught. Choose it for low-friction checks of facts, definitions, simple connections, vocabulary or straightforward application.
- **Do not use when:** The learner needs to generate knowledge freely, develop an explanation, repair a complex error or demonstrate extended exam reasoning. Do not use it to introduce new content, test a misconception that deserves targeted corrective feedback or turn a long question bank into a formal test.
- **Choose instead:** Use PriorKnowledgeRecall when the learner should retrieve an earlier topic without answer options. Use MisconceptionCheck when the incorrect belief itself is the learning target. Use ChapterHookScreen when one surprising true/false prediction should open a chapter. Use ExamQuestionFrame or another exam-practice component for mark-scheme application and developed responses. Use SpotTheError when the learner must diagnose and repair an error.
- **Content shape:** Usually three to six independent questions, each testing one clear retrieval target with one defensible correct answer, concise plausible options and useful immediate feedback. Questions should vary the recalled knowledge rather than repeatedly rephrase one fact. Avoid obscure trivia, confusing wording, oversized option sets and questions solvable through wording clues.
- **Rhythm role:** retrieval, practice.

**Contract:** standard

No invariants or exclusivity rules are recorded. Internal changes that keep the documented behaviour are ordinary development work.

---

### PriorKnowledgeRecall

**File:** `src/components/learning/PriorKnowledgeRecall.jsx`  
**Kind:** author-selectable component (`reusable`)  
**Lifecycle:** `active`

**Purpose:** Full-screen chapter-opening free-recall screen. The learner writes what they remember from an earlier topic; /api/recall evaluates the response against expected concepts, and missing concepts feed the weakness tracker and future practice.

**Props:** `block`, `subject`, `onContinue`, `onBack`, `onExit`

**Data shape:** `{ type: 'priorKnowledgeRecall', chapterTitle, prompt?, previousTopic?, backgroundImage?, recallPrompts?, concepts: [{ tag, label, keywords[] }], sourceContent? }`

**Dependencies:** `SUBJECTS`, `SPACING`, `MOTION`, `RADII`, `TYPE`, `unifiedWeaknessTracker`, `CircularTimer`, `ScreenTextBlock`, `/api/recall`

**Notes:**

- Retrieval family rule — choose according to what the learner must do: generate earlier knowledge without options → PriorKnowledgeRecall; answer several short prompted questions → QuickRecallScreen; recognise and correct a known false belief → MisconceptionCheck; make one curiosity-building prediction before new teaching → ChapterHookScreen; present an embedded ordinary retrieval question consistently → RetrievalFrame, selected by implementation rather than by the content author. Do not use true/false interaction as a generic visual pattern, and do not place substantial question-led components back-to-back.

**Authoring**

- **Screen type:** `priorKnowledgeRecall` — Prior knowledge recall
  - Status: `active`
  - Layout: full-screen
  - Continuation: component-owned
  - Pedagogy: retrieve · assessed

**Decision**

- **Use when:** The learner is beginning a chapter or connected section and needs to retrieve what they remember from an earlier topic without seeing possible answers. Choose it when that prior knowledge genuinely supports the new learning and the result can identify specific gaps for later practice.
- **Do not use when:** The learner has not previously been taught the knowledge, the new chapter does not depend meaningfully on it or the task is being added as a routine opening ritual. Do not use it when answer options are needed, a weakness is already known or the response should be a precise exam answer.
- **Choose instead:** Use QuickRecallScreen for several short prompted questions about taught knowledge. Use MisconceptionCheck for a known false belief. Use ChapterHookScreen to create curiosity about the new chapter rather than diagnose prior knowledge. Use WeakSpotRecovery when the weakness is already known and needs targeted repair.
- **Content shape:** One broad free-recall prompt linked to a clearly defined earlier topic, with a bounded set of important expected concepts carrying stable weakness tags. Optional nudges may name broad areas but must not reveal the answers. Avoid insignificant details, trick wording and concepts the system cannot use meaningfully in later practice.
- **Rhythm role:** opening, retrieval.

**Contract:** standard

No invariants or exclusivity rules are recorded. Internal changes that keep the documented behaviour are ordinary development work.

---

### RecoveryQuizPlayer

**File:** `src/components/learning/RecoveryQuizPlayer.jsx`  
**Kind:** author-selectable component (`reusable`)  
**Lifecycle:** `active`

**Purpose:** A short, highly focused verification sequence used after targeted reteaching. It checks whether the learner can now apply the repaired understanding across several closely related questions.

**Best used for:** Testing whether a specific weak concept has improved after the learner has received an explanation, worked example, scaffold or other appropriate repair activity.

**Props:** `recoveryQuizId`, `onComplete`, `onBack`

**Data shape:** `Quiz shape: { id, subject, estimatedTime, topic, questions: [{ type, question, options, correct, explanation, hint? }] } — data source src/data/recoveryQuizzes.js`

**Dependencies:** `AnswerInteraction`, `recoveryQuizzes`, `SUBJECTS`, `SPACING`, `BackButton`, `SequenceProgress`, `TYPE`, `GENERAL`

**Governance rules:**

- Completion is not evidence of repair. The weakness status should change only when the learner meets the defined success threshold, ideally across more than one representation of the concept. An unsuccessful check should trigger simpler reteaching or a different repair strategy rather than repeating the same quiz unchanged.
- Outcome language: successful evidence → "This is looking stronger"; partial evidence → "One part still needs work"; weak evidence → "Let's rebuild this another way". Do not automatically display "Weak spot fixed".

**Notes:**

- Known implementation gap: the current v1 completion screen still displays "Weak spot fixed" when the question sequence ends and does not yet apply a recovery threshold. Treat this as unresolved implementation work; this record does not claim the behaviour is already compliant.

**Decision**

- **Use when:** The learner has already received targeted reteaching for one evidenced weakness and now needs a short check showing whether the corrected understanding transfers across several examples. Choose it as the verification stage of recovery, not as the whole repair.
- **Do not use when:** The weakness has only just been detected, the learner has not yet been shown why their thinking was wrong or the questions simply repeat the original item with different wording. Do not use it as a generic quiz, mix unrelated weak areas together or mark a weak spot as fixed merely because every question was attempted.
- **Choose instead:** Use WeakSpotRecovery to introduce the diagnosed weakness and offer the repair route. Use ExplainReveal, CalculationBreakdown, a worked example or another teaching component when the concept still needs to be rebuilt. Use SpotTheError when the learner must diagnose and correct a precise error. Use QuickRecallScreen for ordinary mixed retrieval outside a repair pathway.
- **Content shape:** Usually three to five tightly focused questions targeting the same underlying weakness through meaningfully different examples or representations. Begin with a simpler check, then test the idea in a changed context so success cannot come from memorising one answer. Every question needs useful corrective feedback. Include a defined success threshold and a fallback route when the learner is still struggling.
- **Rhythm role:** repair, retrieval.

**Contract:** critical

**Why change is costly:** This component decides whether a diagnosed weakness has been repaired. Changing its flow or completion logic changes what the whole weak-area personalisation system believes about the learner, and nothing downstream can detect that the belief is now wrong.

**Invariants:**

- `verification-not-repair` — It verifies a repair that has already been taught; it never stands in for the reteaching itself.
  - Evidence: `review` — Confirm every entry point reaches this component after a repair activity, not straight from detection.
- `threshold-gated-resolution` — A weakness is declared repaired only on the documented success threshold — never because the learner reached the end of the question sequence.
  - Evidence: `review` — Read the completion path for any resolution that fires on sequence end rather than on the threshold. See the known implementation gap recorded above.
- `stable-quiz-data-contract` — The recovery-quiz data contract read from src/data/recoveryQuizzes.js stays stable: adding quizzes uses the existing shape.
  - Evidence: `review` — Add a quiz to src/data/recoveryQuizzes.js using the existing shape and confirm no player change was needed.

**Requires a product decision:**

- Changing the question flow, feedback timing or completion contract
- Changing the public API
- Declaring a weakness repaired on any basis other than the documented success threshold

---

### WeakSpotRecovery

**File:** `src/components/learning/WeakSpotRecovery.jsx`  
**Kind:** author-selectable component (`reusable`)  
**Lifecycle:** `active`

**Purpose:** A calm intervention handoff shown after the weakness tracker has gathered enough behavioural evidence to identify one specific weak concept or recurring error pattern. It explains the diagnosed gap briefly and offers a direct route into an appropriate repair activity.

**Best used for:** Turning an evidenced weakness into an immediate, manageable next action without making the learner feel punished or overwhelmed.

**Props:** `block`, `subject`, `progress`, `onBack`, `onFixWeakSpot`, `onSkip`

**Data shape:** `{ type: 'weakSpotRecovery', subject, topicId, title, explanation, meta?, cta?, skipText?, recoveryQuizId? }`

**Dependencies:** `SUBJECTS`, `SPACING`, `MOTION`, `RADII`, `GENERAL`, `BackButton`, `ScreenTitle`

**Governance rules:**

- WeakSpotRecovery starts a repair pathway. It does not teach enough content by itself and must not mark the weakness as resolved merely because the learner accepts or completes the suggested activity.

**Notes:**

- Weakness repair family rule — choose according to the stage of repair: communicate one evidenced weakness and offer a manageable route → WeakSpotRecovery; rebuild the missing idea → the appropriate teaching, worked-example or scaffold component; practise precise diagnosis and correction → SpotTheError; verify transfer after reteaching → RecoveryQuizPlayer. Detection, reteaching, practice and verification are separate jobs.

**Decision**

- **Use when:** The system has enough evidence to identify one specific weak concept, misconception or recurring error pattern and can offer a suitable next repair activity. Choose it when the learner needs a clear explanation of what is going wrong and one manageable action to address it.
- **Do not use when:** The learner has made one isolated mistake, the weakness is still broad or uncertain, or the system cannot explain what the learner is confusing. Do not trigger it from self-reported confidence alone, use it as a generic encouragement screen or claim that a topic is weak without supporting evidence.
- **Choose instead:** Use MisconceptionCheck when a common false belief should be tested but has not yet been identified as this learner’s weakness. Use PriorKnowledgeRecall when broad missing prior knowledge still needs diagnosing. Use SpotTheError when the learner should locate and repair one precise error. Use QuickRecallScreen when the goal is ordinary retrieval rather than targeted repair.
- **Content shape:** Exactly one specific weak spot with a concise, evidence-based diagnosis of what the learner is mixing up, missing or doing incorrectly. Include one realistic repair route, a short indication of what the activity involves and an optional skip route. Avoid vague labels such as "History" or "Algebra", generic motivational copy and unsupported claims that the learner has mastered or failed a topic.
- **Rhythm role:** repair.

**Contract:** critical

**Why change is costly:** This is the learner-facing face of the weak-area system, the app’s primary personalisation mechanism. Its non-punitive, non-gamified tone and its behavioural (not self-report) basis are product rules, and both are easy to erode one sympathetic copy edit at a time.

**Invariants:**

- `calm-non-gamified-diagnosis` — The diagnosis framing stays calm and non-punitive: no gamified or motivational copy, no streaks, no scores.
  - Evidence: `review` — Read every learner-facing string on the screen for motivational or game-like framing.
- `behavioural-evidence-only` — The intervention is based on behavioural evidence from the weakness tracker, never on self-reported confidence.
  - Evidence: `review` — Confirm no trigger path reaches this screen from a learner self-rating.
- `starts-repair-never-completes-it` — It starts a repair pathway and never marks a weakness resolved from this screen.
  - Evidence: `review` — Confirm no handler on this screen writes a resolved state to the weakness tracker.

**Requires a product decision:**

- Changing the diagnosis framing to gamified or motivational copy
- Basing the intervention on self-reported confidence
- Marking a weakness resolved from this screen
- Changing the component API or block shape

---

### ColSortBlock

**File:** `src/components/learning/ColSortBlock.jsx`  
**Kind:** author-selectable component (`reusable`)  
**Lifecycle:** `active`

**Purpose:** Interactive categorisation task where learners sort items into labelled columns.

**Best used for:** Grouping concepts into categories (e.g. "Supernatural vs Natural causes", "Treatments vs Prevention methods"). Tap-to-select with visual feedback.

**Props:** `block`, `subject`, `onComplete`

**Dependencies:** `SUBJECTS`, `MOTION`

**Owns these private internals:**

- `src/components/learning/ColSortBlockCore.jsx` (file) — The implementation of ColSortBlock, split out for file size only. ColSortBlock is the documented entry point and its sole importer.

**Authoring**

- **Block type:** `colsort` — Column sort
  - Status: `active`
  - Layout: content
  - Continuation: player-owned
  - Requires: `columns`:array, `items`:array
  - Pedagogy: classify · assessed

**Decision**

- **Use when:** The learner needs to place several short statements, examples or concepts into clearly labelled categories and benefit from seeing the completed groups together.
- **Do not use when:** The learner has not yet been taught the distinction between the categories. Do not use it for one-to-one pairs, ordered stages, developed comparisons or items that could reasonably belong in more than one category.
- **Choose instead:** Use SwipeSort when the activity should feel faster and each item can be judged independently without needing to study the completed groups together. Use MatchingTask for one-to-one pairs. Use OrderedRouteTask when sequence matters. Use TheoryCompare when two approaches require developed explanation rather than learner classification. Use OppositeQualitiesReveal when the contrast is being taught through guided visual grouping rather than tested.
- **Content shape:** Two or more clearly labelled categories with several concise items. Every item must have one defensible destination. Category labels must represent meaningful conceptual groups, not arbitrary containers. Keep item wording short enough to scan and compare once placed.
- **Rhythm role:** practice, retrieval.

**Contract:** standard

No invariants or exclusivity rules are recorded. Internal changes that keep the documented behaviour are ordinary development work.

---

### WhatExaminersLookFor

**File:** `src/components/learning/WhatExaminersLookFor.jsx`  
**Kind:** author-selectable component (`reusable`)  
**Lifecycle:** `active`

**Purpose:** A short pre-question examiner briefing. It introduces the upcoming exam skill, progressively reveals up to three high-value priorities and closes with one practical takeaway the learner can use while writing. It does not mark, annotate or score an answer.

**Best used for:** Preparing the learner immediately before independent or guided exam practice by clarifying the small number of things the examiner will reward most.

**Props:** `subject`, `whatExaminersLookFor`, `examinerExplains`, `title`, `label`, `showBack`, `onBack`, `onContinue`

**Data shape:** `{ introduction?, context?, priorities?: [{ id?, title?, explanation? }], takeaway? } — legacy examinerExplains data may still use opening, tips and closing while content migrates.`

**Dependencies:** `CinematicShell`, `BackButton`, `ContinueCTA`, `ScreenTitle`, `SUBJECTS`, `SUBJECT_BACKDROPS`, `GENERAL`, `TYPE`, `SPACING`, `MOTION`

**Authoring**

- **Screen type:** `examinerExplains` — What examiners look for
  - Status: `active`
  - Layout: full-screen
  - Continuation: component-owned
  - Pedagogy: exam-technique · passive

**Decision**

- **Use when:** The learner is about to attempt an exam question and needs a concise reminder of the specific behaviours the examiner rewards, such as selecting precise evidence, explaining a link, analysing a method or supporting a judgement.
- **Do not use when:** The learner has already completed the response, feedback must react to their actual writing, the advice is a generic revision tip or the success criteria require substantial teaching rather than a short briefing. Do not turn it into a dense mark-scheme dump.
- **Choose instead:** Use ExamQuestionFrame when the learner should now write independently. Use FaceTheExaminer when they should inspect and improve an existing answer. Use GuidedExamResponse when they need structured support while constructing the response. Use a normal teaching component when the exam skill itself has not yet been explained clearly enough for three priorities to be useful.
- **Content shape:** One short introduction, usually two or three actionable priorities and one closing takeaway. Every priority must be specific enough to apply during the immediately following question and important enough to affect marks. Avoid vague encouragement, duplicated criteria and lengthy mark-scheme language.
- **Rhythm role:** teaching, practice.

**Contract:** standard

No invariants or exclusivity rules are recorded. Internal changes that keep the documented behaviour are ordinary development work.

---

### ExaminerExplainsScreen

**File:** `src/components/learning/ExaminerExplainsScreen.jsx`  
**Kind:** support primitive (`support`)  
**Lifecycle:** `parked` — Superseded by WhatExaminersLookFor and retained only so existing routes and authored legacy content do not break during migration.

**Purpose:** A re-export of WhatExaminersLookFor. It exists so existing routes and authored content referencing the legacy examinerExplains screen type do not break during migration.

**Usage boundary:** Legacy compatibility only. Do not select or author it as a separate learning component; new code and content must use WhatExaminersLookFor. It is catalogued here because the file still exists — not because it is an available choice. The screen:examinerExplains authoring entry moved to the canonical WhatExaminersLookFor record in Phase 4: a parked alias must not own a live authoring entry, or the Lab shows a deprecated component as an author choice.

**Contract:** standard

No invariants or exclusivity rules are recorded. Internal changes that keep the documented behaviour are ordinary development work.

---

### GraphView

**File:** `src/components/learning/GraphView.jsx`  
**Kind:** author-selectable component (`reusable`)  
**Lifecycle:** `active`

**Purpose:** Embeddable SVG chart block — bar, line, scatter or pie — rendered inline within a content screen.

**Best used for:** Displaying GCSE Maths/Science data (frequency tables, linear and real-life graphs, scatter graphs with line of best fit, proportion and probability pie charts) alongside a question elsewhere on the screen. Purely a data display — it does not log to the weakness tracker itself.

**Props:** `block`, `subject (defaults to Maths)`

**Data shape:** `{ type: 'graphView', graphType: 'bar'|'line'|'scatter'|'pie', title?, caption?, xLabel?, yLabel?, data?: [{label, value}], points?: [{x, y}], lineOfBestFit?: {from: {x,y}, to: {x,y}}, xMin?, xMax?, yMin?, yMax? }`

**Dependencies:** `SUBJECTS`, `SPACING`, `MOTION`, `TYPE`, `CardContainer`

**Story:** `src/components/learning/GraphView.stories.jsx`

**Authoring**

- **Block type:** `graphView` — Graph view
  - Status: `active`
  - Layout: content
  - Continuation: player-owned
  - Pedagogy: teach-mechanism · passive

**Decision**

- **Use when:** The learner needs to see a numerical relationship represented visually, such as quantities across categories, change over time, correlation between variables or proportion of a whole. Choose it when a graph communicates the pattern more clearly than prose or a list of numbers. GraphView displays the data; it does not assess the learner by itself.
- **Do not use when:** The information is qualitative, the values do not form a meaningful visual relationship or the graph is being added merely to make the screen appear academic. Do not use it for a conceptual system, a process diagram, a before-and-after image comparison or an activity that needs its own answer and scoring logic.
- **Choose instead:** Use Infographic for a conceptual model, labelled system or non-numerical summary. Use TimelineChain when stages or causal order matter more than numerical change. Use BeforeAfterImageSlider when the learner needs to inspect visual change between two states. Place GraphView alongside an appropriate quiz or exam-question component when the learner must interpret the data and submit a scored answer.
- **Content shape:** One appropriate graph type: bar chart for comparing categories, line graph for continuous change or trends, scatter graph for relationships or correlation, or pie chart for proportions of a whole. Include a concise title and all labels, units, scales and legends needed to interpret the graph correctly. Keep the number of bars, points and labels manageable on mobile. Axes and intervals must be accurate and must not create a misleading impression. A line of best fit should appear only when it supports the intended scatter-graph learning. Pie-chart values must represent a coherent whole. Any interpretation prompt, calculation or scored response belongs to the surrounding learning or assessment component, not to GraphView itself.
- **Rhythm role:** teaching.

**Contract:** standard

No invariants or exclusivity rules are recorded. Internal changes that keep the documented behaviour are ordinary development work.

---

### GuidedChoiceCarousel

**File:** `src/components/learning/GuidedChoiceCarousel.jsx`  
**Kind:** author-selectable component (`reusable`)  
**Lifecycle:** `active`

**Purpose:** An unscored, full-screen choice experience where the learner browses a small set of visually distinct roles, perspectives or approaches, opens each card for more detail and then chooses one. The selected option is passed forward so later content can noticeably adapt its perspective, example, wording or route.

**Best used for:** Creating meaningful ownership before a scenario or personalised sequence when several defensible choices can lead to genuinely different subsequent content.

**Props:** `subject`, `headline`, `question`, `helperText`, `options`, `onBack`, `onContinue`

**Data shape:** `Option shape: { title, image?, frontItems?, backItems?, revealLines? }`

**Dependencies:** `InteractionShell`, `SequenceProgress`, `ContinueCTA`, `CinematicContinueCTA`, `SUBJECTS`, `GENERAL`, `SPACING`, `MOTION`, `RADII`, `TYPE`, `usePrefersReducedMotion`

**Usage boundary:** The choice is exploratory and unscored; no option is treated as right or wrong.

**Governance rules:**

- Do not offer fake agency. A selection must alter the subsequent perspective, example, wording or route in a way the learner can notice. If every option produces the same experience, use a reveal or comparison component instead.

**Authoring**

- **Screen type:** `guidedChoiceCarousel` — Guided choice carousel
  - Status: `active`
  - Layout: full-screen
  - Continuation: component-owned
  - Requires: `options`:array
  - Pedagogy: apply · assessed

**Decision**

- **Use when:** The learner should adopt one of several plausible roles, perspectives, cases or routes and that choice will create a meaningful change in what follows. Choose it when browsing the alternatives first helps the learner understand their differences and the selected option gives the next teaching or scenario a clearer personal point of view.
- **Do not use when:** One option is objectively correct, every option leads to effectively identical content, the choice changes only a name in the heading or the learner needs to compare all options simultaneously. Do not use it merely to make a passive screen feel interactive, and do not hide long paragraphs on the backs of cards.
- **Choose instead:** Use CinematicCarousel when the learner should explore every item without selecting one. Use TheoryCompare when two options need direct parallel comparison. Use InteractiveHotspotImage when the information belongs to locations within one shared image. Use QuickRecallScreen when there is a correct answer. Use a normal teaching screen when the downstream content will not genuinely change.
- **Content shape:** Usually three to five clearly distinct and defensible options. Each needs a concise title, one purposeful image and a small set of comparable facts or reveal details. Every option should offer a credible reason for selection; avoid one obviously superior "correct" card surrounded by weak or joke alternatives. The subsequent screen must make the consequence of the choice visible.
- **Rhythm role:** opening, exploration.

**Contract:** standard

No invariants or exclusivity rules are recorded. Internal changes that keep the documented behaviour are ordinary development work.

---

### MatchingTask

**File:** `src/components/learning/MatchingTask.jsx`  
**Kind:** author-selectable component (`reusable`)  
**Lifecycle:** `active`

**Purpose:** Card-pair matching activity with visual connector lines.

**Best used for:** Linking terms to definitions, concepts to examples, or causes to effects (e.g. "Medieval beliefs" ↔ "Treatments"). Splits large sets into rounds. One-retry mechanism.

**Props:** `screen`, `subject`, `onComplete`

**Data shape:** `{ pairs: [{ id, term, answer, weakGroup }], backgroundImage }`

**Dependencies:** `MOTION`, `unifiedWeaknessTracker`

**Authoring**

- **Screen type:** `matchingTask` — Matching task
  - Status: `active`
  - Layout: full-screen
  - Continuation: component-owned
  - Requires one of: `items`:array, `pairs`:array, `cards`:array
  - Pedagogy: classify · assessed

**Decision**

- **Use when:** The learner needs to connect each item with one corresponding partner, such as a term with its definition, a cause with its consequence, a person with their contribution or a quotation with its interpretation.
- **Do not use when:** Several items belong under the same category heading, the order between stages matters, an item could reasonably match more than one partner or the relationship requires developed explanation rather than a concise pairing.
- **Choose instead:** Use ColSortBlock when several items must be grouped beneath shared category headings. Use SwipeSort for a faster item-by-item classification check. Use OrderedRouteTask when the learner must place stages in sequence. Use TheoryCompare when two people, theories or approaches require a developed parallel comparison. Use ExplainReveal when the relationship forms a cause-and-effect reasoning chain that still needs to be taught.
- **Content shape:** A set of clear one-to-one pairs. Each item must have one defensible partner and each partner should normally be used once. Both sides should be concise enough to scan while making meaningful connections rather than matching through superficial wording clues. Avoid oversized sets that turn the task into visual searching rather than retrieval.
- **Rhythm role:** retrieval, practice.

**Contract:** standard

No invariants or exclusivity rules are recorded. Internal changes that keep the documented behaviour are ordinary development work.

---

### OrderedRouteTask

**File:** `src/components/learning/OrderedRouteTask.jsx`  
**Kind:** author-selectable component (`reusable`)  
**Lifecycle:** `active`

**Purpose:** Ordered chain activity — one job card is shown at a time beneath the heading; the learner taps the stage on the numbered vertical route it belongs to. Correct taps lock the job beneath that stage immediately; wrong taps show a persistent clue-based hint ("Not here — look for the stage near railways.") and allow another tap. Route line, nodes and surfaces derive from the supplied subject’s accent.

**Best used for:** Recalling the steps or stages of a process in order — evacuation chains, scientific processes, historical sequences.

**Props:** `screen`, `subject`, `onComplete`

**Data shape:** `{ type: 'orderedRouteTask', title, titleHighlight?, subtitle?, prompt?, weakGroup?, completionText?, backgroundImage?, stages: [{ id, icon, title, clue, answerId }] (icon: 'helmet'|'cross'|'hut'|'train'|'ship'), answers: [{ id, text }] }`

**Dependencies:** `TYPE`, `SPACING`, `RADII`, `MOTION`, `SUBJECTS`, `CinematicShell`, `ContinueCTA`, `unifiedWeaknessTracker`

**Story:** `src/components/learning/OrderedRouteTask.stories.jsx`

**Notes:**

- Interaction: jobs are shuffled and presented one at a time; tap a stage row (a real button, keyboard-focusable) to place. The first wrong attempt per job logs a weakness; a clean first-attempt placement logs a correct answer. After the final placement the rebuilt chain stays on screen with completionText, then the governed ContinueCTA reveals — completion is learner-controlled, never automatic.
- Renamed from EvacuationChainRoute.

**Authoring**

- **Screen type:** `orderedRouteTask` — Ordered route task
  - Status: `active`
  - Layout: full-screen
  - Continuation: component-owned
  - Requires one of: `items`:array, `steps`:array, `cards`:array, `stages`:array
  - Pedagogy: sequence-process · assessed

**Decision**

- **Use when:** The learner has already been taught a process or sequence and now needs to recall where each known event, action or stage belongs in the correct order.
- **Do not use when:** The sequence is still being introduced, the learner has not yet seen the stages clearly or the relationship between the items is unordered. Do not use it for matching pairs, category grouping or a chronology where several answers could reasonably fit the same position.
- **Choose instead:** Use TimelineChain to teach or explore the sequence first. Use ExplainReveal when the learner still needs to understand why one step leads to the next. Use MatchingTask when items form one-to-one pairs but order does not matter. Use ColSortBlock or SwipeSort when items belong within shared categories rather than numbered stages.
- **Content shape:** A known sequence with clearly defined stages and one defensible position for every item. Stage headings should provide enough meaning for the learner to reason rather than guess. Items must be concise and should test understanding of the sequence, not reading endurance. Avoid ambiguous placement and stages that overlap substantially.
- **Rhythm role:** practice, retrieval.

**Contract:** standard

No invariants or exclusivity rules are recorded. Internal changes that keep the documented behaviour are ordinary development work.

---

### CentreImageReveal

**File:** `src/components/learning/CentreImageReveal.jsx`  
**Kind:** author-selectable component (`reusable`)  
**Lifecycle:** `active`

**Purpose:** Three-phase cause → prescription → reveal flow. The learner selects a theory, fills inputs on a parchment surface (fuzzy-match validated), then sees correct treatments revealed. It personalises the heading if a selectedHealer prop is passed from GuidedChoiceCarousel. Its select phase opens with the MedievalDiagnosisScene hero.

**Props:** `screen`, `selectedHealer`, `onComplete`

**Dependencies:** `SUBJECTS`, `SPACING`, `MOTION`, `TYPE`, `MedievalDiagnosisScene`

**Owns these private internals:**

- `src/components/learning/MedievalDiagnosisScene.jsx` (file) — The Medicine-specific SVG hero for the CentreImageReveal select phase. It introduces Thomas and the four explanation zones and mirrors its parent’s belief-selection state; explicitly not a standalone learning beat or authoring choice.

**Notes:**

- Renamed from MedicalTheoryPrescription; internals unchanged.

**Authoring**

- **Screen type:** `centreImageReveal` — Centre image reveal
  - Status: `active`
  - Layout: full-screen
  - Continuation: component-owned
  - Pedagogy: apply · assessed

**Decision**

- *Pending* — The registry entry has never carried a five-field Decision block. Its boundary against the other selection-and-reveal components is a pedagogical judgement current source, stories and contracts do not settle.

**Contract:** standard

No invariants or exclusivity rules are recorded. Internal changes that keep the documented behaviour are ordinary development work.

---

### MemoryHook

**File:** `src/components/learning/MemoryHook.jsx`  
**Kind:** author-selectable component (`reusable`)  
**Lifecycle:** `active`

**Purpose:** A compact, passive memory aid embedded inside a normal teaching screen. It connects one difficult idea to one memorable analogy, mental image, word pattern or mnemonic so the learner has an easier way to retrieve it later. It does not own a full screen, ask a question or record progress.

**Best used for:** Giving the learner one memorable handle on an idea that is conceptually important but easy to confuse or forget.

**Props:** `block`, `subject`

**Data shape:** `{ type: 'memoryHook', label?, hook, image?, imageAlt? }`

**Dependencies:** `SUBJECTS`, `GENERAL`, `SPACING`, `COMPONENT_SIZE`, `RADII`, `TYPE`

**Contract doc:** `docs/system/component-contracts/memory-hook.md`

**Story:** `src/components/learning/MemoryHook.stories.jsx`

**Governance rules:**

- Use no more than one MemoryHook on a screen. A second hook competes with the first and makes neither memorable.
- MemoryHook is deliberately passive: it has no editing, persistence, reveal, assessment or progress behaviour.

**Notes:**

- Memory and self-testing family rule — choose according to the structure of the memory aid: one difficult idea anchored by an analogy or association → MemoryHook; one related set encoded through initial letters → AcronymMemorise; objectively marked recall → QuickRecallScreen; one-to-one relationships the learner must connect → MatchingTask. Memory aids must reduce cognitive load; do not force every topic into a mnemonic merely to create variety. The normal maximum of two uses of the same component per chapter still applies.

**Authoring**

- **Block type:** `memoryHook` — Memory hook
  - Status: `active`
  - Layout: content
  - Continuation: player-owned
  - Pedagogy: teach-mechanism · passive

**Decision**

- **Use when:** One already-explained idea would be easier to remember through a concise analogy, mental image, word association or mnemonic. Choose it beside or immediately after the teaching it reinforces, when the learner should leave holding one memorable connection.
- **Do not use when:** The text is merely important, needs visual emphasis or summarises the preceding screen. Do not use it as a generic callout box, key point, definition card or decorative aside. Do not use it to teach several facts, drill an acronym or assess whether the learner can remember the idea.
- **Choose instead:** Use AcronymMemorise when several items are deliberately encoded through their initial letters and should be explored and self-tested. Use a key-point treatment for an essential conclusion that does not need a mnemonic. Use Infographic when a visual system or relationship must be understood together. Use QuickRecallScreen when the learner should actively retrieve and submit an answer.
- **Content shape:** Exactly one memorable hook, normally one or two concise sentences. The connection must be accurate, easy to picture and genuinely useful for retrieval. An optional square image may be supplied only when it strengthens the same memory connection. Avoid generic summaries, forced humour, multiple competing comparisons and images that are merely decorative.
- **Rhythm role:** teaching.

**Contract:** standard

No invariants or exclusivity rules are recorded. Internal changes that keep the documented behaviour are ordinary development work.

---

### NumberLineExplore

**File:** `src/components/learning/NumberLineExplore.jsx`  
**Kind:** author-selectable component (`reusable`)  
**Lifecycle:** `reviewing` — Routed for chapter authoring in Phase 4 as block:numberLineFigure; the component itself is still under review, which is what keeps this lifecycle at reviewing.

**Purpose:** Configuration-driven GCSE number line — the shared visual foundation for number topics, and a sibling of AngleExplore and AreaPerimeterExplore. One line, one interaction model and one status voice cover what would otherwise be six near-identical single-purpose diagrams. The line, its shaded intervals, movement arcs and endpoints render as inline SVG in model space (values are never measured back from pixels); learner-controlled values drive a live status line. Seven registered presets — orderNumbers, negativeMovement, roundingIntervals, inequalityRange, boundsInterval, multiplyPattern, estimateRange — plus a compatible-preset-object escape hatch. interactive={false} turns any preset into a static teaching or exam diagram at fixed values. Draggable markers are keyboard-operable role="slider" elements (arrow keys / Home / End) with ≥44px hit targets; discrete choices (open/closed, direction, precision, jump size) are real buttons, never disguised sliders. Filled markers include an endpoint, open markers exclude it, and a line marker denotes a fixed reference another marker may legitimately sit on. Respects prefers-reduced-motion (and a reducedMotion prop override) — the arc’s draw-in becomes an instantly finished arc.

**Best used for:** Teaching AQA Foundation number topics where position, direction and size are the point — place value, ordering integers/decimals/fractions, negative numbers, addition and subtraction as movement, multiplication patterns with negatives, rounding, estimation ranges, inequalities, upper and lower bounds, and scale reading. Use it when seeing where a number lives is the lesson. Questions, predictions, marking, scoring and weakness tracking stay outside the component.

**Props:** `preset (name or preset object, defaults to orderNumbers)`, `value (controlled values object)`, `defaultValue`, `options (initial discrete choices)`, `onChange`, `interactive`, `disabled`, `subject (defaults to Maths)`, `reducedMotion`, `label`, `showStatus`

**Data shape:** `{ type: 'numberLineFigure', preset: 'orderNumbers' | 'negativeMovement' | 'roundingIntervals' | 'inequalityRange' | 'boundsInterval' | 'multiplyPattern' | 'estimateRange', value?, defaultValue?, options?, interactive?, label?, showStatus? }`

**Dependencies:** `SUBJECTS`, `GENERAL (via numberLine/numberLineVisualRoles.js semantic roles)`, `TYPE`, `SPACING`, `RADII`, `MOTION (injected animation CSS via ensureStyles())`, `pure maths in numberLine/numberLineGeometry.js (which re-exports the neutral geometry/shapeGeometry.js helpers)`, `presets in numberLine/numberLinePresets.js`

**Story:** `src/components/learning/NumberLineExplore.stories.jsx`

**Owns these private internals:**

- `src/components/learning/numberLine` (directory) — Number-line presets, pure model-space maths and semantic colour roles rendered only through NumberLineExplore. Not separately selectable, and deliberately not an authoring choice.

**Authoring**

- **Block type:** `numberLineFigure` — Number line figure
  - Status: `active`
  - Layout: content
  - Continuation: player-owned
  - Requires: `preset`:string
  - Pedagogy: teach-mechanism · reveal

**Decision**

- **Use when:** The learning objective is about where numbers sit relative to each other, or about a movement, interval or bound along the line — and moving a point makes the relationship visible: an ordering re-sorting, a jump landing left of zero, a value crossing a halfway point, an endpoint switching between included and excluded. Also use its static mode for any accurate, on-theme number-line diagram inside teaching or exam content.
- **Do not use when:** The learner must be assessed on the answer (compose a question component around a static instance instead); the content is chart or data interpretation (GraphView); the task is carrying out a multi-step calculation (CalculationBreakdown); or the idea is not positional at all — a number line adds nothing to, say, factorising.
- **Choose instead:** Use AngleExplore for angle facts — do not add number-line modes to it. Use AreaPerimeterExplore for mensuration. Use GraphView for interpreting data rather than number position. Use CalculationBreakdown for executing a method step by step. Use a static figure image when no interaction is needed and the diagram is one-off.
- **Content shape:** Pick the preset matching the idea; optionally fix value and options for a specific worked example. One line per screen — the component teaches one relationship at a time, and its option buttons switch between framings of that same relationship rather than adding a second lesson.
- **Rhythm role:** teaching, exploration.

**Contract:** standard

No invariants or exclusivity rules are recorded. Internal changes that keep the documented behaviour are ordinary development work.

---

### MisconceptionCheck

**File:** `src/components/learning/MisconceptionCheck.jsx`  
**Kind:** author-selectable component (`reusable`)  
**Lifecycle:** `active`

**Purpose:** Full-screen true/false misconception checker. It presents one conceptual trap at a time, reveals the corrected understanding and can explain the related exam trap. Answers are recorded in the weakness tracker.

**Props:** `block`, `subject`, `onContinue`

**Data shape:** `{ type: 'misconceptionCheck', statements: [{ statement, answer: true|false, reveal, examTrap? }] }`

**Dependencies:** `SUBJECTS`, `SPACING`, `MOTION`, `RADII`, `TYPE`, `BUTTONS`, `ContinueCTA`, `unifiedWeaknessTracker`

**Authoring**

- **Block type:** `misconceptionCheck` — Misconception check
  - Status: `active`
  - Layout: content
  - Continuation: component-owned
  - Pedagogy: retrieve, exam-technique · assessed
- **Screen type:** `misconceptionCheck` — Misconception check screen
  - Status: `derived`
  - Layout: full-screen
  - Continuation: component-owned
  - Pedagogy: retrieve, exam-technique · assessed

**Decision**

- **Use when:** The learner needs to confront a specific, common false belief that is likely to damage later understanding or cost marks in an exam. Choose it when recognising and correcting the misconception is more important than testing an ordinary isolated fact.
- **Do not use when:** The statement is simply an ordinary fact written as true or false, the learner has not yet been taught enough to understand the correction or the answer depends on unstated context. Do not use it for minor slips, deceptive wording, debatable interpretations or a generic true/false quiz.
- **Choose instead:** Use ChapterHookScreen when one surprising statement should create curiosity without becoming a tracked weakness. Use QuickRecallScreen for ordinary factual retrieval. Use SpotTheError when the learner must locate, explain and repair the precise error. Use ExplainReveal when the reasoning that makes the belief wrong still needs teaching.
- **Content shape:** One conceptual trap at a time, or a very small set of closely related traps. Each needs a concise unambiguous statement, one defensible answer, a clear explanation of what is wrong and what the learner should think instead, plus an optional exam-trap note. Avoid double negatives, technical loopholes and invented tricks.
- **Rhythm role:** retrieval, repair.

**Contract:** standard

No invariants or exclusivity rules are recorded. Internal changes that keep the documented behaviour are ordinary development work.

---

### SpotTheError

**File:** `src/components/learning/SpotTheError.jsx`  
**Kind:** author-selectable component (`reusable`)  
**Lifecycle:** `active`

**Purpose:** A three-stage diagnostic repair task in which the learner locates one inaccurate word or phrase, explains precisely why it is wrong and rewrites the statement correctly. The three stages are evaluated separately so the system can distinguish recognition, understanding and correction.

**Best used for:** Developing precision in scientific statements, historical explanations, mathematical working and exam answers where one specific error changes the meaning or loses marks.

**Props:** `block`, `subject`, `onContinue`

**Data shape:** `{ type: 'spotTheError', statement, errorTarget, whatWasWrong, correctVersion, examinerNote?, commonTrap?, explanationCriteria?, explanationHint?, explanationPraise?, repairKeyTerms?, acceptableRepairs?, repairMustAvoid?, minimumExplanationLength?, minimumRepairLength?, weaknessAreas? }`

**Dependencies:** `SUBJECTS`, `SPACING`, `MOTION`, `RADII`, `TYPE`, `GENERAL`, `CinematicShell`, `ContinueCTA`, `CheckAnswerCTA`, `unifiedWeaknessTracker`, `spotTheErrorScoring`

**Story:** `src/components/learning/SpotTheError.stories.jsx`

**Governance rules:**

- The three assessment dimensions — error identification (did the learner locate the meaningful error?), explanation precision (did they explain why it is wrong using the relevant subject concept?) and error correction (did they produce an accurate replacement?) — must remain separately tagged in the weakness tracker. A learner who spots the error but cannot explain or repair it has not demonstrated secure understanding.

**Notes:**

- Scoring logic lives in src/components/learning/spotTheErrorScoring.js (pure, unit-tested).

**Authoring**

- **Block type:** `spotTheError` — Spot the error
  - Status: `active`
  - Layout: content
  - Continuation: component-owned
  - Pedagogy: exam-technique, apply · assessed

**Decision**

- **Use when:** One precise error within an otherwise plausible statement, calculation or exam response provides a valuable opportunity to practise identifying the problem, explaining its effect and repairing it accurately. Choose it when correction requires genuine subject understanding rather than simple recognition.
- **Do not use when:** The whole answer is broadly wrong, several independent errors compete for attention or the correction is subjective or debatable. Do not use it for spelling mistakes, trivial slips, an ordinary true-or-false fact or content the learner has not yet been taught well enough to correct.
- **Choose instead:** Use MisconceptionCheck when the learner only needs to recognise and correct a common false belief. Use ExplainReveal when the reasoning behind the correct idea still needs teaching. Use RecoveryQuizPlayer when a repaired weakness should be verified across several examples. Use CalculationBreakdown when the learner needs to understand and execute an entire mathematical procedure. Use an exam-response component when the whole answer needs constructing rather than one error repairing.
- **Content shape:** One concise statement, calculation or response containing one defensible target error. Supply an exact target range, clear criteria describing why it is wrong, one accurate corrected version and reasonable accepted alternatives. The explanation stage must require the learner to state the conceptual problem, not merely say that the selected words are incorrect. The repair must change the meaning accurately without introducing a new error.
- **Rhythm role:** practice, repair.

**Contract:** standard

No invariants or exclusivity rules are recorded. Internal changes that keep the documented behaviour are ordinary development work.

---

### SwipeSort

**File:** `src/components/learning/SwipeSort.jsx`  
**Kind:** author-selectable component (`reusable`)  
**Lifecycle:** `active`

**Purpose:** Swipe-gesture categorisation activity with cards dragged into zones.

**Best used for:** Binary or multi-way classification (e.g. "Supernatural vs Natural" causes). Mobile-friendly drag interaction for fast-paced categorisation tasks.

**Props:** `block`, `subject`, `onComplete`

**Dependencies:** `SUBJECTS`, `MOTION`

**Authoring**

- **Screen type:** `naturalSupernaturalSwipe` — Natural or supernatural swipe sort
  - Status: `active`
  - Layout: full-screen
  - Continuation: component-owned
  - Pedagogy: classify · assessed

**Decision**

- **Use when:** The learner needs a quick, energetic classification check where each short item can be judged independently and moved into one of a small number of clear categories.
- **Do not use when:** The learner needs to compare all items at once, inspect the completed groups carefully, read substantial text, build a sequence or consider nuanced overlap between categories. Do not use it merely to add movement to the chapter.
- **Choose instead:** Use ColSortBlock when seeing the final grouped columns supports understanding or comparison. Use MatchingTask for one-to-one pairs. Use OrderedRouteTask when order matters. Use OppositeQualitiesReveal when the categories are still being taught rather than assessed.
- **Content shape:** A stream of short, independently understandable items with two or a small number of unambiguous destinations. Each item should be readable at a glance. Avoid long explanations, compound statements and examples that require evidence elsewhere on the screen.
- **Rhythm role:** retrieval, practice.

**Contract:** standard

No invariants or exclusivity rules are recorded. Internal changes that keep the documented behaviour are ordinary development work.

---

### TheoryCompare

**File:** `src/components/learning/TheoryCompare.jsx`  
**Kind:** author-selectable component (`reusable`)  
**Lifecycle:** `active`

**Purpose:** Side-by-side comparison of any two approaches, people or theories. Two labelled sides kept as compact headers with a central division; one comparison theme revealed at a time; a full-width teaching explanation beneath the columns where needed; example rows within a theme; a single closing takeaway. emphasisSide gives one side restrained subject-accent emphasis; 'none' keeps both sides visually equal for a neutral concept comparison. All colour derives from the subject accent token — content data carries no raw colours. Teaching-first and unassessed: never a disguised quiz, and no right/wrong judgement.

**Props:** `block`, `subject`, `onComplete?`

**Data shape:** `{ type: 'theoryCompare', title?, emphasisSide? ('left' | 'right' | 'none', default 'none'), heroImage?, heroImageAlt?, leftPerson: { name, subtitle?, image?, imageAlt? }, rightPerson: { name, subtitle?, image?, imageAlt? }, comparisons: [{ id, prompt?, left, right, explanation?, emphasisSide? } | { id, prompt?, rows: [{ label, left, right }], note?, explanation?, emphasisSide? }], takeaway? }`

**Dependencies:** `SUBJECTS`, `TYPE`, `SPACING`, `RADII`, `MOTION`, `ContinueCTA`, `InlineNavigationContext`, `CinematicDivider`

**Story:** `src/components/learning/TheoryCompare.stories.jsx`

**Notes:**

- Reveal logic lives in src/components/learning/theoryCompare.js (pure).
- Portraits are optional. Supply image/imageAlt per side (and/or a heroImage) for a person-to-person comparison; when none are supplied the two portrait boxes render empty, ready for images to be added in future, and the labelled sides carry the comparison on their own.
- Accessibility expectations: portraits carry meaningful imageAlt; each comparison cell exposes its person’s name to screen readers via a visually-hidden prefix so the relationship survives colour- and position-only cues; progression uses the governed ContinueCTA (keyboard-operable, visible focus); focus moves to the takeaway when it reveals; motion respects prefers-reduced-motion; DOM reading order is prompt → left → right → explanation.
- Galen / Vesalius example (Episode 3, "The beginning of doubt"): compares Galen (animal dissection) and Vesalius (human dissection) across method, evidence-building, anatomical conclusions (jaw, ribs, breastbone) and impact, closing on "Vesalius did not prove that everything Galen believed was wrong. He proved that old ideas should be checked against evidence."

**Authoring**

- **Block type:** `theoryCompare` — Theory compare
  - Status: `active`
  - Layout: content
  - Continuation: player-owned
  - Pedagogy: teach-comparison · reveal

**Decision**

- **Use when:** Two approaches, people or models need developed parallel comparison.
- **Do not use when:** Isolated words or short examples are simply placed into opposing groups.
- **Choose instead:** Use OppositeQualitiesReveal for short examples being visually organised into two simple opposing groups. Use ColSortBlock or SwipeSort when the learner must classify items themselves. Use TimelineChain when the relationship is sequential or causal. Use FactorWeb when several plausible factors must be explored and weighed for relative importance.
- **Content shape:** Two labelled sides, one comparison theme revealed at a time as short parallel phrases, with a full-width explanation carrying any developed reasoning, closing on one takeaway; a person-to-person comparison must keep both sides historically fair.
- **Rhythm role:** teaching.

**Contract:** standard

No invariants or exclusivity rules are recorded. Internal changes that keep the documented behaviour are ordinary development work.

---

### OppositeQualitiesReveal

**File:** `src/components/learning/OppositeQualitiesReveal.jsx`  
**Kind:** author-selectable component (`reusable`)  
**Lifecycle:** `active`

**Purpose:** Passive, guided reveal for two opposing concepts. Items appear centrally, travel toward the configured left or right concept, then remain grouped under the correct final heading.

**Dependencies:** `InlineNavigationContext`

**Contract doc:** `docs/system/component-contracts/opposite-qualities-reveal.md`

**Story:** `src/components/learning/OppositeQualitiesReveal.stories.jsx`

**Notes:**

- Accessibility expectations: the final DOM groups every item under its concept label; movement is decorative and not the only carrier of meaning; reduced motion renders the complete grouped state.
- Architecture guarded by tests/architecture/oppositeQualitiesRevealArchitecture.test.js.

**Authoring**

- **Block type:** `oppositeQualitiesReveal` — Opposite qualities reveal
  - Status: `active`
  - Layout: content
  - Continuation: player-owned
  - Pedagogy: teach-comparison · reveal
- **Screen type:** `oppositeQualitiesReveal` — Opposite qualities reveal
  - Status: `active`
  - Layout: full-screen
  - Continuation: player-owned
  - Pedagogy: teach-comparison · reveal

**Decision**

- **Use when:** Several short words, symptoms or qualities clearly belong to one of two opposites.
- **Do not use when:** Each side needs evidence, explanation or developed reasoning.
- **Choose instead:** Use TheoryCompare for a substantial comparison.
- **Content shape:** A handful of short items (words, symptoms, qualities) with no explanation attached, each cleanly belonging to one of two opposing concepts — e.g. Hot/Cold and Wet/Dry quality symptoms in Medicine Episode 1.
- **Rhythm role:** teaching.

**Contract:** standard

No invariants or exclusivity rules are recorded. Internal changes that keep the documented behaviour are ordinary development work.

---

### TimelineCanvas

**File:** `src/components/learning/TimelineCanvas.jsx`  
**Kind:** author-selectable component (`reusable`)  
**Lifecycle:** `active`

**Purpose:** Full-screen "swipe to pan" canvas — a natively horizontally-scrollable wide canvas of step cards connected by curved SVG paths and connector dots; the user pans with a 1:1 finger swipe. Each connector line draws itself in (and its dot lights up) as the pan position passes over it. A bouncing "Swipe to explore →" hint fades once panning begins. Tapping a card’s "+" opens a "Why it mattered" detail panel below the canvas (gated continue, like TimelineChain).

**Best used for:** A deliberately different rhythm to TimelineChain — an occasional interruption to vary pacing between chapter moments, reusing the same kind of causal-chain content. Not for routine use; the spring/bounce motion is an intentional one-off exception to the Motion Rules (documented in-file).

**Props:** `block`, `subject (defaults to History)`, `onContinue`

**Data shape:** `{ type: 'timelineCanvas', title?, intro?, steps: [{ id?, icon?, image?, label, detail, stats?: [string, string] }] }`

**Dependencies:** `SUBJECTS`, `SPACING`, `MOTION`, `RADII`

**Story:** `src/components/learning/TimelineCanvas.stories.jsx`

**Notes:**

- Architecture guarded by tests/architecture/timeline-canvas.architecture.test.js.

**Authoring**

- **Screen type:** `timelineCanvas` — Timeline canvas
  - Status: `active`
  - Layout: full-screen
  - Continuation: component-owned
  - Requires one of: `events`:array, `items`:array, `steps`:array
  - Pedagogy: sequence-process · reveal

**Decision**

- **Use when:** A particularly important sequence benefits from a wide spatial journey that the learner actively pans through, and the chapter needs an occasional change of pace from the standard screen rhythm.
- **Do not use when:** A normal TimelineChain would communicate the sequence just as clearly. Do not use it for routine sequences, very short chains, dense explanations or simply to make the chapter feel more visually varied. It should remain an occasional high-impact interaction rather than the default timeline.
- **Choose instead:** Use TimelineChain for most chronological, causal and procedural sequences. Use ExplainReveal when the focus is a compact reasoning chain rather than distinct events or stages. Use OrderedRouteTask when the learner should demonstrate that they know the correct order.
- **Content shape:** A visually distinct sequence, usually four to seven stages, that benefits from being experienced as a journey across a wider canvas. Each stage needs a short label, a concise explanation and a meaningful place in the overall progression. Avoid long paragraphs, minor facts and stages that are not visually or conceptually distinct.
- **Rhythm role:** exploration.

**Contract:** standard

No invariants or exclusivity rules are recorded. Internal changes that keep the documented behaviour are ordinary development work.

---

### TimelineChain

**File:** `src/components/learning/TimelineChain.jsx`  
**Kind:** author-selectable component (`reusable`)  
**Lifecycle:** `active`

**Purpose:** Full-screen sequence component with two variants. interactive (default) — a horizontal scroll-snap chain of flip cards connected by a connector rail (line segments plus a dot per card). reveal — a passive vertical sequence that reveals one step at a time behind a "Reveal next" CTA, absorbing the behaviour of the former VisualNarrativeScreen.

**Best used for:** Interactive: a chapter’s "big idea" causal sequence the learner explores at will (e.g. how the Black Death spread) — card fronts show a short step label, tapping flips a card to reveal why that step mattered, and Continue only appears once every card has been flipped. Reveal: a short cause→effect narrative delivered one calm statement at a time (e.g. "bad air → sweeten the air → the real cause was microbes") — each press reveals one more step, the standard ContinueCTA replaces "Reveal next" once all steps show, and an optional accent takeaway closes it.

**Props:** `block`, `subject (defaults to History)`, `onContinue`, `variant ('interactive' | 'reveal'; falls back to block.variant, then 'interactive')`

**Data shape:** `Interactive: { type: 'timelineChain', title, intro?, steps: [{ id?, icon?, image?, label, detail }] }. Reveal: { type: 'timelineChain', variant: 'reveal', title?, intro?, source?, steps: [{ id?, icon?, statement, detail? }], takeaway? } — statement/detail/takeaway accept a plain string or an array of { text, highlight? } segments for inline subject-accent highlighting. statement (not label) is the primary field so full-sentence copy is not scanned by the sentence-case heading guard.`

**Dependencies:** `SUBJECTS`, `SPACING`, `MOTION`, `RADII`, `ContinueCTA`, `timelineChainReveal.js (pure reveal logic)`, `TimelineChainIcons.jsx`

**Story:** `src/components/learning/TimelineChain.stories.jsx`

**Owns these private internals:**

- `src/components/learning/TimelineChainIcons.jsx` (file) — The icon set for TimelineChain markers. Imported only by TimelineChain; it carries no learning behaviour of its own and is never placed directly.

**Notes:**

- VisualNarrativeScreen is retired and must not be recreated, restored, registered, refined or locked. Its progressive numbered-reveal behaviour is owned solely by this component’s reveal variant. New progressive narrative or statement-sequence screens must use the reveal variant; interactive ordering and causal-chain screens continue to use the default interactive variant. The migration is complete and the compatibility path is retired: type: 'visualNarrative' is no longer a registered screen type and src/data/visualNarrativeCompat.js has been deleted, so content carrying that type now fails validation as an unregistered type. Do not reintroduce the type, the mapper or a replacement for either. Any older per-module architecture or planning doc that still lists VisualNarrativeScreen under "suggested components", or shows a visualNarrative screen in a built module, is superseded by this rule.

**Authoring**

- **Screen type:** `timelineChain` — Timeline chain
  - Status: `active`
  - Layout: full-screen
  - Continuation: component-owned
  - Requires one of: `events`:array, `steps`:array, `items`:array
  - Pedagogy: sequence-process · reveal

**Decision**

- **Use when:** The learner needs to understand or explore a meaningful sequence of distinct events, stages or developments where the order or causal connection matters. Use the interactive variant when each stage is worth exploring individually. Use the reveal variant for a shorter, calmer narrative that unfolds one linked statement at a time.
- **Do not use when:** The content is merely a list of related facts, the order can be changed without affecting the meaning or the main learning job is comparison, categorisation or relative importance. Do not use it to test whether the learner knows the order.
- **Choose instead:** Use ExplainReveal when the main learning is the reasoning that connects a short cause → mechanism → consequence chain. Use OrderedRouteTask when the sequence has already been taught and should now be assessed. Use TimelineCanvas only when an important sequence benefits from a deliberately different, spatial exploration rhythm. Use TheoryCompare when two sides need parallel comparison rather than sequential explanation.
- **Content shape:** A clear chronological, causal or procedural sequence of distinct stages. Each stage needs a short identifying label or statement and a concise explanation of why it matters. Usually use three to seven stages. Every stage must earn its place in the chain and the sequence should lead towards a clear outcome or takeaway. For the interactive variant, each stage should make sense as an individually explored card. For the reveal variant, each statement should flow naturally into the next and form one calm narrative.
- **Rhythm role:** teaching, exploration.

**Contract:** standard

No invariants or exclusivity rules are recorded. Internal changes that keep the documented behaviour are ordinary development work.

---

### TimelineChainBlock

**File:** `src/components/learning/TimelineChain.jsx`  
**Export:** `TimelineChainBlock` (named export)  
**Kind:** author-selectable component (`reusable`)  
**Lifecycle:** `active`

**Purpose:** Embedded variant of TimelineChain — the same flip-card chain with connector rail, scaled down to sit inline within a normal content screen instead of taking over the full screen. No completion gating; the screen’s own Continue controls progression.

**Best used for:** Slotting a short causal or sequence chain (two to five steps) into an existing content screen alongside its heading and intro — e.g. recapping a transmission chain just explained elsewhere. Each card front can show a placeholder or illustrative image with an overlaid step number, plus a short label; tapping flips to reveal the "why it mattered" detail. An optional outro paragraph (e.g. a reflection prompt) renders below the chain.

**Props:** `block`, `subject (defaults to History)`

**Data shape:** `{ type: 'timelineChain', intro?, steps: [{ id?, icon?, image?, label, detail }], outro? }`

**Dependencies:** `SUBJECTS`, `SPACING`, `MOTION`, `RADII`

**Usage boundary:** A named export alongside TimelineChain, not a separate file. Choose it when the chain belongs inside a composed content screen rather than owning the screen.

**Authoring**

- **Block type:** `timelineChain` — Timeline chain block
  - Status: `active`
  - Layout: content
  - Continuation: player-owned
  - Pedagogy: sequence-process · reveal

**Decision**

- *Pending* — The registry entry has never carried a five-field Decision block; it inherits TimelineChain’s selection guidance and differs only in placement. A separate five-field block would require a product judgement current source and stories do not settle.

**Contract:** standard

No invariants or exclusivity rules are recorded. Internal changes that keep the documented behaviour are ordinary development work.

---

## `src/components/layout/`

Chapter-level orchestration, chapter framing screens and structural shells.

---

### ChapterCompleteScreen

**File:** `src/components/layout/ChapterCompleteScreen.jsx`  
**Kind:** runtime infrastructure (`runtime`)  
**Lifecycle:** `active`

**Purpose:** End-of-chapter completion screen with score and stats. An emotional beat that acknowledges progress without being childish.

**Props:** `subject`, `chapterTitle`, `score`, `totalQuestions`, `onContinue`, `onReview`

**Dependencies:** `SUBJECTS`, `MOTION`, `RADII`, `CinematicShell`

**Usage boundary:** Placed by the chapter runtime at the end of a chapter, not selected by a content author.

**Contract:** standard

No invariants or exclusivity rules are recorded. Internal changes that keep the documented behaviour are ordinary development work.

---

### ChapterHookScreen

**File:** `src/components/layout/ChapterHookScreen.jsx`  
**Kind:** author-selectable component (`reusable`)  
**Lifecycle:** `active`

**Purpose:** Chapter-opening true/false prediction followed by a cinematic explanation or short sequence of reveal beats.

**Props:** `subject`, `chapterNum`, `chapterTitle`, `statement`, `isTrue`, `accentWords`, `explanation`, `revealBeats`, `backgroundImage`, `onBack`, `onContinue`

**Dependencies:** `SUBJECTS`, `MOTION`, `RADII`, `GENERAL`, `SPACING`, `CinematicShell`, `BackButton`

**Notes:**

- Presentation tag: cinematic — this component counts as the chapter’s one cinematic moment. When it is used, do not add another cinematic component merely to satisfy the chapter-rhythm requirement.

**Decision**

- **Use when:** One striking true/false statement can open a chapter by creating curiosity, tension or surprise before revealing the central idea the learner is about to explore. Choose it when making an initial prediction gives the following teaching more meaning.
- **Do not use when:** The purpose is to measure retained knowledge, diagnose a weakness or correct a misconception that should be tracked and revisited. Do not use it as a routine opening for every chapter, for a bland or obvious statement or when another component already owns the chapter’s cinematic moment.
- **Choose instead:** Use MisconceptionCheck when recognising the false belief is an assessed retrieval and repair task. Use PriorKnowledgeRecall when the learner should retrieve knowledge from an earlier topic. Use QuickRecallScreen for several fast checks of taught material. Use ConceptReveal when one new idea needs introducing without a prediction. Use CinematicRevealMoment when an image or video can create the opening significance more effectively.
- **Content shape:** One short, surprising but fair true/false statement connected directly to the chapter’s central question, with one defensible answer and either one clear explanation or a short series of reveal beats. It must be understandable before the teaching and remain useful whether the learner predicts correctly or incorrectly. The response must not be logged as a weakness.
- **Rhythm role:** opening.

**Contract:** standard

No invariants or exclusivity rules are recorded. Internal changes that keep the documented behaviour are ordinary development work.

---

### ChapterOutcomeScreen

**File:** `src/components/layout/ChapterOutcomeScreen.jsx`  
**Kind:** runtime infrastructure (`runtime`)  
**Lifecycle:** `active`

**Purpose:** Chapter outcome reveal screen. Shows learner performance with cinematic context.

**Props:** `subject`, `chapterTitle`, `onContinue`, `onBack`

**Dependencies:** `SUBJECTS`, `CinematicShell`

**Usage boundary:** Placed by the chapter runtime, not selected by a content author.

**Story:** `src/components/layout/ChapterOutcomeScreen.stories.jsx`

**Contract:** standard

No invariants or exclusivity rules are recorded. Internal changes that keep the documented behaviour are ordinary development work.

---

### ContentShell

**File:** `src/components/layout/ContentShell.jsx`  
**Kind:** runtime infrastructure (`runtime`)  
**Lifecycle:** `active`

**Purpose:** The default scrolling content surface for a chapter screen. Provides the subject background, optional background image, safe-area and header clearance, scoped typography as a safety net for raw h1/h2/h3/p, and the inline-navigation bridge that lets a component own the visible Continue CTA.

**Props:** `subject`, `backgroundImage (default null)`, `backgroundOpacity (default 0.13)`, `backgroundPosition (default 'center')`, `header ('learning' clears the fixed 80px LearningHeader; 'none' applies safe-area only)`, `children`

**Dependencies:** `SPACING`, `SUBJECTS`, `InlineNavigationContext`

**Used by:** ChapterPlayer; CentreImageReveal; Component Lab

**Usage boundary:** The default shell. Prefer ScreenText primitives over raw tags inside it — the scoped CSS is a net, not the design. It provides InlineNavigationContext; components claim it through useInlineNavigationOwner() rather than touching shell DOM.

**Notes:**

- The three shells define where a screen’s content lives. They are structural infrastructure, not authoring choices: an author picks a learning component, and the component picks its shell. Full rules — including where TeachScreenShell sits inside ContentShell — are in docs/system/SCREEN_SHELL_SYSTEM.md.

**Contract:** standard

No invariants or exclusivity rules are recorded. Internal changes that keep the documented behaviour are ordinary development work.

---

### InteractionShell

**File:** `src/components/layout/InteractionShell.jsx`  
**Kind:** runtime infrastructure (`runtime`)  
**Lifecycle:** `active`

**Purpose:** Fixed, non-scrolling shell for an interaction engine that owns its whole screen and manages its own internal layout and progression.

**Props:** `subject`, `backgroundImage (default null)`, `backgroundOpacity (default 0.13)`, `backgroundPosition (default 'center')`, `children`

**Dependencies:** `SPACING`, `SUBJECTS`

**Used by:** FactorWeb; CalculationBreakdown; CinematicCarousel; GuidedChoiceCarousel

**Usage boundary:** Use when the interaction must not scroll and the component owns its own progression (Route B). If the content scrolls, use ContentShell instead.

**Contract:** standard

No invariants or exclusivity rules are recorded. Internal changes that keep the documented behaviour are ordinary development work.

---

### CinematicShell

**File:** `src/components/layout/CinematicShell.jsx`  
**Kind:** runtime infrastructure (`runtime`)  
**Lifecycle:** `active`

**Purpose:** Minimal full-viewport fixed container (100dvh, overflow and overscroll locked) for full-screen cinematic moments.

**Props:** `children`, `style`, `plus any DOM props (spread onto the container)`

**Used by:** 16 components, including ChapterHookScreen, ChapterOutcomeScreen, ChapterCompleteScreen, ConceptReveal, TimelineCanvas, KeyFigureReveal

**Usage boundary:** The most restricted shell. Using it requires a comment in the consuming component explaining why ContentShell or InteractionShell cannot be used — that requirement is stated in the file itself. It supplies no background, padding or safe-area handling; the component owns all of that.

**Contract:** standard

No invariants or exclusivity rules are recorded. Internal changes that keep the documented behaviour are ordinary development work.

---

### ScreenTextBlock

**File:** `src/components/layout/ScreenTextBlock.jsx`  
**Kind:** support primitive (`support`)  
**Lifecycle:** `active`

**Purpose:** Small titled text surface with three tones, for a short passage that needs to read as a distinct block within a screen (a source extract, a framing note, a set of instructions).

**Props:** `title`, `children`, `accent`, `tone ('default' | 'quiet' | 'card')`, `inset (default true)`, `framed (default false)`, `style`, `titleStyle`, `bodyStyle`

**Dependencies:** `TYPE`, `SCREEN_TEXT_LAYOUT`

**Used by:** PriorKnowledgeRecall; FaceTheExaminer (faceTheExaminer/FaceTheExaminerMain.jsx)

**Usage boundary:** One short passage inside a screen that already has a heading. Not a screen heading (use ScreenText’s ScreenTitle), and not a way to place a wall of text on a screen.

**Contract:** standard

No invariants or exclusivity rules are recorded. Internal changes that keep the documented behaviour are ordinary development work.

---

### ChapterPlayer

**File:** `src/components/layout/ChapterPlayer.jsx`  
**Kind:** runtime infrastructure (`runtime`)  
**Lifecycle:** `active`

**Purpose:** The internal runtime for one authored chapter. It owns the chapter lifecycle — deciding which opening gate applies (hook, what-you’ll-learn, prior-knowledge recall), navigation between screens, progress persistence to gcse_chapter_<chapterId>, and completion.

**Props:** `chapter (a chapter definition resolved through CHAPTER_CONTENT_LOADERS)`, `onBack`, `onChapterComplete`

**Dependencies:** `ScreenRenderer`, `screenRegistry.js schema validation`, `chapterNavigation.js`, `progress.js`, `LEARNING_SEQUENCES via learnerCurriculum.js`, `its own private family under layout/chapterPlayer/`

**Usage boundary:** Not an authoring choice. Content authors never select ChapterPlayer as a screen or component, and never add a screen type to it. It resolves every screen through ScreenRenderer and holds no component-routing branches of its own.

**Owns these private internals:**

- `src/components/layout/chapterPlayer` (directory) — ChapterPlayer's own runtime JSX, split out of the player: the universal opener gate layer and the fixed bottom-navigation shell. Authors never place either — the runtime decides — so they are deliberately absent from screenRegistry.js, componentFunctions.js and the Component Lab. Guarded by tests/architecture/chapter-player-private-family.test.js.

**Governance rules:**

- No chapter-level examiner or repair diversions. Finishing the last content screen completes the chapter, full stop. Face the Examiner and What Examiners Look For are reached as authored screens routed by ScreenRenderer, never as end-of-chapter overlays; WeakSpotRecovery and RecoveryQuizPlayer have no ChapterPlayer entry point.
- Chapter-building rule: author a canonical Chapter record, reference it from exactly one canonical Module record, create its content file, set contentPath, use registered screens and blocks, then run the curriculum generators. Production reaches the result only through src/data/learnerCurriculum.js; screenCount, screenTags and the loader entry are derived. Adding a normal Chapter must not require editing ChapterPlayer, ScreenRenderer, app navigation or progress persistence. Enforced by tests/architecture/chapter-authoring-boundary.test.js and tests/architecture/authoring-guidance.test.js.

**Contract:** standard

No invariants or exclusivity rules are recorded. Internal changes that keep the documented behaviour are ordinary development work.

---

### ScreenRenderer

**File:** `src/components/layout/ScreenRenderer.jsx`  
**Kind:** runtime infrastructure (`runtime`)  
**Lifecycle:** `active`

**Purpose:** The sole runtime boundary mapping registered screen and block types to approved components. FULL_SCREEN_RENDERER_TYPES and BLOCK_RENDERER_TYPES are proved equal to the active entries of SCREEN_REGISTRY / BLOCK_REGISTRY by tests/architecture/screen-registry.test.js.

**Props:** `screen`, `chapter`, `chapterNum`, `subject`, `plus the runtime callbacks ChapterPlayer supplies`

**Dependencies:** `src/data/screenRegistry.js`, `every routed learning and feedback component`

**Usage boundary:** Not an authoring choice. Authors select entries from screenRegistry.js, never ScreenRenderer directly.

**Owns these private internals:**

- `src/components/layout/deferredFigures.jsx` (file) — Routing machinery, not an author choice: the lazy wrappers, per-block Suspense boundary and reserved-height fallback that let ScreenRenderer load the six figure renderers on demand. A learner never meets it as a component and an author never selects it.
- `src/components/layout/deferredFigureLoaders.js` (file) — The stable per-component dynamic-import thunks behind those routes, kept free of React so the app shell can preload a chapter’s figures without pulling in the rendering layer. Implementation detail of the same routing boundary.
- `src/components/layout/deferredFigureComponentMap.js` (file) — The authoring-type to lazy-component map for those routes, split out so the rendering module exports components only and keeps fast refresh. Read by the architecture guard rather than by the runtime, and part of the same private routing machinery.

**Authoring**

- **Block type:** `examtip` — Exam tip
  - Status: `active`
  - Layout: content
  - Continuation: player-owned
  - Requires one of: `text`:string, `tip`:string
  - Implementation: private `ScreenRenderer` handler `ExamTipBlock`
  - Pedagogy: exam-technique · passive
- **Block type:** `funfact` — Fun fact
  - Status: `active`
  - Layout: content
  - Continuation: player-owned
  - Requires: `text`:string
  - Implementation: private `ScreenRenderer` handler `FunFactBlock`
  - Pedagogy: hook-tension · passive
- **Block type:** `hotspot` — Hotspot block
  - Status: `active`
  - Layout: content
  - Continuation: player-owned
  - Implementation: private `ScreenRenderer` handler `HotspotBlock`
  - Pedagogy: teach-mechanism · reveal
- **Block type:** `keypoint` — Key point
  - Status: `active`
  - Layout: content
  - Continuation: player-owned
  - Requires one of: `text`:string, `points`:array
  - Implementation: private `ScreenRenderer` handler `KeypointBlock`
  - Pedagogy: teach-mechanism · passive
- **Block type:** `misconception` — Misconception reveal
  - Status: `active`
  - Layout: content
  - Continuation: player-owned
  - Requires: `mistakes`:array
  - Implementation: private `ScreenRenderer` handler `MisconceptionBlock`
  - Pedagogy: exam-technique · reveal
- **Block type:** `read` — Read block
  - Status: `active`
  - Layout: content
  - Continuation: player-owned
  - Requires: `text`:string
  - Implementation: private `ScreenRenderer` handler `ReadBlock`
  - Pedagogy: teach-mechanism · passive
- **Block type:** `reveal` — Reveal block
  - Status: `active`
  - Layout: content
  - Continuation: player-owned
  - Requires: `prompt`:string, `answer`:string
  - Implementation: private `ScreenRenderer` handler `RevealBlock`
  - Pedagogy: teach-mechanism · reveal
- **Block type:** `scenario` — Scenario block
  - Status: `active`
  - Layout: content
  - Continuation: player-owned
  - Requires one of: `scenarios`:array, `situation`:string
  - Implementation: private `ScreenRenderer` handler `ScenarioBlock`
  - Pedagogy: apply · assessed
- **Block type:** `timeline` — Timeline block
  - Status: `active`
  - Layout: content
  - Continuation: player-owned
  - Requires: `events`:array
  - Implementation: private `ScreenRenderer` handler `TimelineBlock`
  - Pedagogy: sequence-process · passive
- **Screen type:** `standard` — Standard content screen
  - Status: `active`
  - Layout: content
  - Continuation: player-owned
  - Requires: `blocks`:array
  - Implementation: private `ScreenRenderer` handler `ScreenContentRenderer`
  - Pedagogy: derived from contained blocks
- **Not authorable:** `ChapterSchemaError` — Development-time schema failure surface for a malformed chapter, rendered by ChapterPlayer rather than chosen by an author.
- **Not authorable:** `UnsupportedScreen` — Recovery surface shown when a screen type has no renderer route; it exists to report the defect, never to be authored.
- **Not authorable:** `UnsupportedBlock` — Recovery surface shown when a block type has no renderer route; it exists to report the defect, never to be authored.
- **Not authorable:** `LegacyUnroutedBlock` — Notice rendered in place of a retired block type that authored content still references; the compatibility registry governs which types reach it.
- **Not authorable:** `ScreenContentRenderer` — Named export implementing the standard content layout, already declared as the handler of the standard screen type.

**Contract:** standard

No invariants or exclusivity rules are recorded. Internal changes that keep the documented behaviour are ordinary development work.

---

## `src/components/feedback/`

Question feedback and exam practice components.

---

### ExamQuestionFrame

**File:** `src/components/feedback/ExamQuestionFrame.jsx`  
**Kind:** author-selectable component (`reusable`)  
**Lifecycle:** `active`

**Purpose:** The independent written exam-practice component. It presents an exam-style question with its mark allocation, command word, topic and optional source material, accepts a typed response and sends it to /api/grade for marking against the supplied mark scheme. Feedback can include marks awarded, achieved points, missed points, a summary and an examiner tip; the result can also feed the weakness tracker.

**Best used for:** Realistic GCSE written practice where the learner should construct a complete response independently and receive evidence-based feedback.

**Props:** `block`, `subject`, `mode (default 'practice')`, `questionNum`, `onComplete`, `onSkip`

**Data shape:** `{ id?, questionText?|question, marks?, markPoints?|ms?, commandWord?, topic?, paper?, source?, sourceInstruction? }`

**Dependencies:** `SUBJECTS`, `GENERAL`, `SPACING`, `RADII`, `BUTTONS`, `TYPE`, `ContinueCTA`, `unifiedWeaknessTracker`, `/api/grade`

**Notes:**

- Exam practice and examiner feedback family rule — choose according to the learner’s stage: clarify what earns marks before writing → WhatExaminersLookFor; construct and submit an independent response → ExamQuestionFrame; judge, annotate and improve a prepared response → FaceTheExaminer. These may form a sequence but should not automatically be stacked around every exam question. GuidedExamResponse remains the alternative when the learner needs support during construction rather than before or after it.

**Authoring**

- **Block type:** `boss` — Exam question frame
  - Status: `active`
  - Layout: content
  - Continuation: player-owned
  - Requires: `question`:string
  - Requires one of: `markPoints`:string, `markPoints`:array, `ms`:string, `ms`:array, `markScheme`:string, `markScheme`:array
  - Pedagogy: retrieve, apply · assessed

**Decision**

- **Use when:** The learner has already been taught the relevant knowledge and should independently attempt an authentic written question whose response needs mark-scheme judgement rather than simple right-or-wrong checking. Choose it for developed historical, literary, scientific or sociological responses and source-supported questions.
- **Do not use when:** The learner still needs sentence-by-sentence construction support, the knowledge has not been taught, the task is ordinary factual retrieval, the response can be checked reliably through a simple objective interaction or the learning job is marking somebody else’s answer.
- **Choose instead:** Use GuidedExamResponse when substantial scaffolding is needed. Use WhatExaminersLookFor immediately beforehand when the priorities need clarifying. Use FaceTheExaminer when the learner should judge and improve a prepared answer. Use QuickRecallScreen for short factual retrieval and CalculationBreakdown when a numerical method still needs teaching.
- **Content shape:** One board-accurate exam-style question with a clear command word, defensible mark allocation, sufficient context, any required source or image, a usable mark scheme and stable topic metadata for feedback and weakness evidence. Avoid vague prompts, invented mark-scheme rules and questions that could be marked in several incompatible ways.
- **Rhythm role:** practice.

**Contract:** standard

No invariants or exclusivity rules are recorded. Internal changes that keep the documented behaviour are ordinary development work.

---

### ExamRoundDebrief

**File:** `src/components/feedback/ExamRoundDebrief.jsx`  
**Kind:** runtime infrastructure (`runtime`)  
**Lifecycle:** `active`

**Purpose:** The examiner-voice end-of-round debrief. It synthesises across every answer in an exam round rather than question by question, surfaces one genuinely recurring pattern, quotes real moments from the learner’s own answers in the FaceTheExaminer voice, and logs that pattern so it resurfaces in WeakSpotRecovery.

**Props:** `subject`, `results (the round’s answer records)`

**Dependencies:** `SUBJECTS`, `GENERAL`, `SPACING`, `RADII`, `TYPE`, `logWrongAnswer (unifiedWeaknessTracker)`, `/api/debrief`

**Usage boundary:** Exam Mode only — mounted by src/features/quickfire/modes/ExamMode.jsx at the end of a round. It sits outside ChapterPlayer and has no authorable screen type; a chapter author never places it. One debrief per round, never per question.

**Notes:**

- Relationship to GuidedAnswerCoach: both live in Exam Mode and both feed unifiedWeaknessTracker.js, but they are separate flows and are not composed. This component logs content-knowledge weaknesses via logWrongAnswer; the coach logs exam-technique patterns via logExamTechnique.

**Contract:** standard

No invariants or exclusivity rules are recorded. Internal changes that keep the documented behaviour are ordinary development work.

---

## `src/components/learning/`

Screen-level learning interaction components. Each is a distinct learning beat.

---

### QuoteAnalyser

**File:** `src/components/learning/QuoteAnalyser.jsx`  
**Kind:** author-selectable component (`reusable`)  
**Lifecycle:** `active`

**Purpose:** Full-screen quote analysis screen with a cinematic hero quote section (animated word-by-word reveal, optional background image), a ripped-seam SVG divider, and five tappable analysis item cards. Each card expands to a full-screen overlay; Continue only unlocks once all five items have been seen.

**Best used for:** English Literature close reading — any play, poem or novel extract where the learner needs to explore word choice, connotations, literary methods, interpretations and essay construction from a single quotation.

**Props:** `block`, `subject (defaults to 'English')`, `onContinue`

**Data shape:** `{ type: 'quoteAnalyser', quote: string, location: string, backgroundImage?: string, items: [{ id, icon: 'search'|'feather'|'mask'|'bulb'|'flame', heading, explainer, content: { title?, body, keyWords?: string[] } }] }`

**Dependencies:** `SUBJECTS`, `RADII`, `TYPE`, `ContinueCTA`, `CinematicDivider`, `usePrefersReducedMotion`

**Story:** `src/components/learning/QuoteAnalyser.stories.jsx`

**Notes:**

- Animation: word-by-word quote reveal via staggered opacity transitions; card entrance via the qa-card-in CSS keyframe; seen-tick pop via qa-tick-pop; expanded overlay via qa-slide-up.

**Authoring**

- **Screen type:** `quoteAnalyser` — Quote analyser
  - Status: `active`
  - Layout: full-screen
  - Continuation: component-owned
  - Pedagogy: teach-mechanism · reveal

**Decision**

- *Pending* — The registry entry has never carried a five-field Decision block. Its boundary against the general teaching and reveal components is a pedagogical judgement current source, stories and contracts do not settle.

**Contract:** standard

No invariants or exclusivity rules are recorded. Internal changes that keep the documented behaviour are ordinary development work.

---

## `src/components/feedback/`

Question feedback and exam practice components.

---

### RetrievalFrame

**File:** `src/components/feedback/RetrievalFrame.jsx`  
**Kind:** runtime infrastructure (`runtime`)  
**Lifecycle:** `active`

**Purpose:** Governed presentation infrastructure for an ordinary retrieval interaction embedded within a learning screen. It converts existing retrieval data for AnswerInteraction and provides contained, full-bleed or inline treatments; AnswerInteraction still owns all answer logic.

**Props:** `retrieval`, `variant ('contained' | 'fullBleed' | 'inline')`, `subject`, `topic`, `beatId`, `contextImage`, `contextText`, `label`, `mode`, `onInteractionComplete`, `onContinueReady`

**Dependencies:** `AnswerInteraction`, `SUBJECTS`, `SPACING`, `TYPE`

**Usage boundary:** Use by implementation when a normal multiple-choice retrieval question needs to be woven into a teaching screen with consistent interaction and feedback behaviour. Do not treat it as a selectable learning activity competing with QuickRecallScreen, a free-recall component, misconception repair, a true/false chapter hook, exam practice or a new content schema.

**Governance rules:**

- Content authors select the learning job. Implementation uses RetrievalFrame only where the surrounding screen contract calls for an embedded ordinary retrieval question. It does not handle trueFalse, does not replace ChapterHookScreen and does not count as the chapter’s cinematic moment.

**Notes:**

- Content shape: one existing retrieval object with a concise question, a small answer set, one correct option, a useful explanation, an optional hint and any context required by the surrounding learning beat.

**Contract:** critical

**Why change is costly:** It is the visual and interaction contract for every embedded retrieval moment. Changing it risks inconsistency and duplication across question presentation, and the drift shows up screen by screen rather than as one visible break.

**Invariants:**

- `delegates-answer-logic` — It delegates all answer logic to AnswerInteraction and adds none of its own.
  - Evidence: `review` — Read the component for any selection, scoring or reveal logic that does not pass through AnswerInteraction.
- `three-presentation-variants` — It provides the contained, fullBleed and inline treatments and no locally invented fourth framing.
  - Evidence: `review` — Confirm the variant prop still resolves to exactly those three treatments.

**Requires a product decision:**

- Changing question presentation layout
- Adding answer logic instead of delegating to AnswerInteraction
- Changing the cinematic framing approach

---

## `src/components/learning/`

Screen-level learning interaction components. Each is a distinct learning beat.

---

### GuidedExamResponse

**File:** `src/components/learning/GuidedExamResponse.jsx`  
**Kind:** author-selectable component (`reusable`)  
**Lifecycle:** `active`

**Purpose:** The guided written-answer scaffold. It presents an exam question with its marks, breaks the response into named sections the learner writes into (optionally pre-seeded with sentence starters), submits for marking, then reveals a model answer with a mark-by-mark breakdown. Support can be dialled down across attempts, and recurring technique patterns are logged.

**Props:** `chapter`, `module (default {})`, `exam (default {})`, `onExit`, `onContinue`, `theme ('general' for non-subject branding)`, `embedded (default false)`

**Data shape:** `Exam shape: { board, subject, subjectLabel?, topic, question, marks, sections, markScheme, sources?, beatText?, labels?, supportMode? } where supportMode is 'guided' | 'light' | 'none'`

**Dependencies:** `SPACING`, `COMPONENT_SIZE`, `MOTION`, `TYPE`, `RADII`, `BUTTONS`, `GENERAL`, `SUBJECTS`, `BackButton`, `ContinueCTA`, `ExamPrompt`, `logExamTechnique / getExamTechniquePatterns`, `usePrefersReducedMotion`

**Usage boundary:** Support during construction. Used both as an authorable chapter screen and, with embedded, as the worked-example and write stages inside GuidedAnswerCoach.

**Story:** `src/components/learning/GuidedExamResponse.stories.jsx`

**Authoring**

- **Screen type:** `guidedExamResponse` — Guided exam response
  - Status: `active`
  - Layout: full-screen
  - Continuation: component-owned
  - Requires: `exam`:object
  - Pedagogy: exam-technique · assessed

**Decision**

- **Use when:** The learner must produce a developed written response but cannot yet structure one unaided, so the answer needs breaking into named parts with visible expectations and a model to compare against.
- **Do not use when:** The learner can already construct the response independently — scaffolding a secure skill teaches dependence rather than technique.
- **Choose instead:** Use ExamQuestionFrame once the learner should attempt the question independently. Use WhatExaminersLookFor when only the priorities need clarifying beforehand. Use FaceTheExaminer when the job is judging and improving a prepared answer rather than writing one.
- **Content shape:** One board-accurate question with a defensible mark allocation, sections that correspond to real mark-scheme demands, a usable mark scheme and a model answer whose annotations explain why each part earns marks.
- **Rhythm role:** practice.

**Contract:** standard

No invariants or exclusivity rules are recorded. Internal changes that keep the documented behaviour are ordinary development work.

---

### GuidedAnswerCoach

**File:** `src/components/learning/GuidedAnswerCoach.jsx`  
**Kind:** app-level feature component (`feature`)  
**Lifecycle:** `active`

**Purpose:** The multi-stage exam-technique coach for one question type. It walks the learner through an eight-stage scaffold: the question → what the examiner wants → watching an examiner think → an annotated model answer → write with support → write with light support → write independently → progress debrief. Support is withdrawn stage by stage.

**Props:** `coachType (one entry from GUIDED_COACH_TYPES)`, `onExit`

**Data shape:** `Data source: src/data/guidedAnswerCoach.js (GUIDED_COACH_TYPES, currently TYPE_A–TYPE_F). Worked examples reuse GuidedExamResponse’s exam shape.`

**Dependencies:** `SequenceProgress`, `GuidedExamResponse`, `ContinueCTA`, `ScreenText`, `SPACING`, `MOTION`, `TYPE`, `RADII`, `BUTTONS`, `GENERAL`, `SUBJECTS`, `logCoachTypeResult (unifiedWeaknessTracker)`

**Usage boundary:** A standalone, app-wide feature owned by the Exams tab (src/features/quickfire/modes/ExamMode.jsx), rendered as a full-screen overlay. It sits outside ChapterPlayer entirely and is not bound by the subject module architectures. A chapter author never places it.

**Notes:**

- Subject scope: the component is subject-agnostic (palettes for History, Biology, Chemistry, Physics, Maths, English and Sociology, plus theme="general"); current content is six Edexcel GCSE History (Medicine) question types.
- Adding content: follow the existing TYPE_A–TYPE_F shape and add the entry to GUIDED_COACH_TYPES.

**Decision**

- *Not applicable* — An author never selects it against a learning component; the learner chooses a question type in the Exams tab.

**Contract:** standard

No invariants or exclusivity rules are recorded. Internal changes that keep the documented behaviour are ordinary development work.

---

### UnifiedQuestionScreen

**File:** `src/components/learning/UnifiedQuestionScreen.jsx`  
**Kind:** runtime infrastructure (`runtime`)  
**Lifecycle:** `active`

**Purpose:** The shared single-question presentation used by other question components: stem, options, selection, correct/incorrect state, hint and explanation, over an optional subject backdrop.

**Props:** `question`, `type (default 'choice')`, `options`, `correct`, `hint`, `explanation`, `backgroundImage`, `subject (default 'History')`, `plus completion callbacks`

**Dependencies:** `SUBJECTS`, `MOTION`, `TYPE`, `SPACING`, `GENERAL`, `RADII`

**Usage boundary:** Composed by QuickRecallScreen and TieredQuizScreen. It is not an authorable screen type — authors select the owning component instead.

**Notes:**

- Its answer feedback shares the GENERAL.feedbackCorrect / feedbackHint / feedbackText tokens with AnswerInteraction.

**Contract:** standard

No invariants or exclusivity rules are recorded. Internal changes that keep the documented behaviour are ordinary development work.

---

### TieredQuizScreen

**File:** `src/components/learning/TieredQuizScreen.jsx`  
**Kind:** author-selectable component (`reusable`)  
**Lifecycle:** `active`

**Purpose:** A multi-tier question sequence over a subject backdrop. Each tier is a set of questions rendered through UnifiedQuestionScreen, with shared SequenceProgress and a governed ContinueCTA at the end.

**Props:** `subject (default 'History')`, `backgroundImage`, `tiers (default [])`, `renderHeader`, `onContinue`

**Dependencies:** `UnifiedQuestionScreen`, `SequenceProgress`, `ContinueCTA`, `SUBJECTS`, `GENERAL`, `TYPE`, `SPACING`, `RADII`

**Usage boundary:** Graduated difficulty within one topic. Do not use it as a generic quiz chain — see the anti-patterns list in CLAUDE.md.

**Authoring**

- **Screen type:** `tieredquiz` — Tiered quiz
  - Status: `active`
  - Layout: full-screen
  - Continuation: component-owned
  - Requires: `tiers`:array
  - Pedagogy: retrieve · assessed

**Decision**

- *Pending* — Pending product review. Choosing between this and QuickRecallScreen or RecoveryQuizPlayer is a pedagogical judgement that current source, stories and contracts do not settle.

**Contract:** standard

No invariants or exclusivity rules are recorded. Internal changes that keep the documented behaviour are ordinary development work.

---

### FlashcardsBlock

**File:** `src/components/learning/FlashcardsBlock.jsx`  
**Kind:** author-selectable component (`reusable`)  
**Lifecycle:** `active`

**Purpose:** An unscored prompt/answer reveal grid. Each card flips independently; nothing is marked and nothing is logged.

**Props:** `block (default {})`

**Data shape:** `{ cards: [{ id?, front, back }] }`

**Dependencies:** `GENERAL`, `TYPE`

**Usage boundary:** Self-testing only. Because it is unscored it does not feed the weak-area system — do not use it where the interaction needs to produce evidence.

**Notes:**

- Extracted from ChapterPlayer so the existing runtime pattern could be reviewed in the Component Lab without maintaining a second implementation.

**Authoring**

- **Block type:** `flashcards` — Flashcards
  - Status: `active`
  - Layout: content
  - Continuation: player-owned
  - Requires: `cards`:array
  - Pedagogy: retrieve · reveal

**Decision**

- *Pending* — Pending product review — its relationship to AcronymMemorise, MemoryHook and the scored retrieval components is a product judgement, and the memory and self-testing family rule does not yet cover it.

**Contract:** standard

No invariants or exclusivity rules are recorded. Internal changes that keep the documented behaviour are ordinary development work.

---

### BeforeAfterImageSlider

**File:** `src/components/learning/BeforeAfterImageSlider.jsx`  
**Kind:** author-selectable component (`reusable`)  
**Lifecycle:** `active`

**Purpose:** A draggable before/after image comparison. The learner must push the divider past both the 25% and 75% marks before the takeaway and ContinueCTA are earned — seeing both sides is the learning, not an optional extra.

**Props:** `beforeSrc`, `afterSrc`, `beforeAlt`, `afterAlt`, `beforeLabel (default 'Before')`, `afterLabel (default 'After')`, `heading`, `accent`, `revealText`, `initial (default 50)`, `onComplete`

**Dependencies:** `MOTION`, `RADII`, `TYPE`, `SPACING`, `GENERAL`, `BUTTONS`, `ContinueCTA`, `ScreenText`

**Usage boundary:** Two images of the same subject where the change between them is the GCSE point. Not a general image viewer, and not a way to show two unrelated images.

**Story:** `src/components/learning/BeforeAfterImageSlider.stories.jsx`

**Authoring**

- **Screen type:** `beforeAfterSlider` — Before and after image slider
  - Status: `active`
  - Layout: full-screen
  - Continuation: component-owned
  - Requires: `beforeSrc`:string, `afterSrc`:string
  - Pedagogy: teach-comparison · reveal

**Decision**

- *Pending* — Pending product review. Its boundary against TheoryCompare and OppositeQualitiesReveal needs a product judgement the current stories and source do not settle.

**Contract:** standard

No invariants or exclusivity rules are recorded. Internal changes that keep the documented behaviour are ordinary development work.

---

### CircuitSymbolReference

**File:** `src/components/learning/CircuitSymbolReference.jsx`  
**Kind:** author-selectable component (`reusable`)  
**Lifecycle:** `reviewing` — Routed for chapter authoring in Phase 4 as block:circuitSymbolReference; the component itself is still under review, which is what keeps this lifecycle at reviewing.

**Purpose:** A reference sheet of the GCSE Physics circuit symbols, drawn from the shared circuit/CircuitPrimitives.jsx set so the symbols match those used in live CircuitDiagram figures exactly. The symbol shape is the exam convention; colour is only used to show state inside interactive diagrams.

**Props:** `title (default 'GCSE circuit symbols')`, `description`

**Data shape:** `{ type: 'circuitSymbolReference', title?, description? } — the board is complete in itself, so it requires no authored data. Both fields have component defaults and override the heading and standfirst only.`

**Dependencies:** `circuit/CircuitPrimitives.jsx`, `circuit/circuitVisualRoles.js`, `GENERAL`

**Authoring**

- **Block type:** `circuitSymbolReference` — Circuit symbol reference
  - Status: `active`
  - Layout: content
  - Continuation: player-owned
  - Pedagogy: teach-mechanism · passive

**Decision**

- *Pending* — Not applicable while unrouted: with no authorable screen type there is no authoring choice to guide. Revisit when a chapter needs a symbol reference.

**Contract:** standard

No invariants or exclusivity rules are recorded. Internal changes that keep the documented behaviour are ordinary development work.

---

## Governed components outside `src/components/`

A component outside `src/components/**` is catalogued only when current governance already treats it as a governed standalone component. Ordinary feature screens are not catalogued.

---

### HomeAtmosphere

**File:** `src/features/home/Home.jsx`  
**Export:** `HomeAtmosphere` (named export)  
**Why it is catalogued outside `src/components/`:** Governed app chrome with a standalone product contract: it is the first thing a learner sees and carries the product identity, so it is catalogued even though it lives in a feature file.  
**Kind:** app-level feature component (`feature`)  
**Lifecycle:** `active`

**Purpose:** The three drifting teal SVG wave bands and the constellation network rendered in the 34vh hero section of the Home tab. It is the first thing a learner sees on opening the app.

**Used by:** Home (src/features/home/Home.jsx)

**Usage boundary:** A governed standalone component that lives outside src/components/**. It is catalogued because current live governance already treats it as one; ordinary feature screens are not catalogued.

**Decision**

- *Not applicable* — An author never selects it against a learning component — it is app chrome owned by the Home tab.

**Contract:** critical

**Why change is costly:** It is the first thing a learner sees on opening the app and it carries the product’s "premium streaming platform, not a school VLE" identity. It has been repeatedly at risk of being removed as decorative, which is exactly the change that would be hardest to notice in review.

**Invariants:**

- `component-and-call-site-survive` — Neither the component nor its `<HomeAtmosphere />` call site inside Home may be removed or renamed.
  - Evidence: `review` — Confirm Home.jsx still defines HomeAtmosphere and still renders the `<HomeAtmosphere />` call site in the hero section.
- `wave-and-constellation-structure` — The three drifting SVG wave bands, their gradients and their animation structure, plus the constellation network, stay as they are.
  - Evidence: `review` — Compare the rendered Home hero against the current app before approving any SVG or keyframe change.

**Requires a product decision:**

- Removing or renaming the component, or removing its call site in Home
- Altering the wave, gradient or animation structure

---

## Authoring compatibility appendix

Legacy types that authored content still references but no component
implements. They are owned by
`src/component-catalogue/migrations/authoringCompatibility.js`, not by any
record above, and they render a notice rather than an interaction.

This is a shrinking set, not a tombstone list: a guard fails an entry the
moment its last authored reference disappears. A retired type with no live
content is deleted outright instead of being moved here.

| Type | Level | Author instead | Current handler | Pedagogy | Removal condition |
|---|---|---|---|---|---|
| `appliedscenario` | block | `scenario` | `LegacyUnroutedBlock` | apply · assessed | Delete this entry once no chapter content references type "appliedscenario"; the authored screens move to "scenario" unchanged. |
| `examscored` | block | `boss` | `LegacyUnroutedBlock` | exam-technique · assessed | Delete this entry once no chapter content references type "examscored"; the authored questions move to "boss" with markScheme preserved. |
| `tieredquiz` | block | `quickRecall` | `LegacyUnroutedBlock` | retrieve · assessed | Delete this entry once no chapter content references a block of type "tieredquiz"; the authored tiers move to "quickRecall" questions. |
| `timelinedrag` | block | `orderedRouteTask` | `LegacyUnroutedBlock` | sequence-process · assessed | Delete this entry once no chapter content references type "timelinedrag"; the authored items move to an "orderedRouteTask" screen. |

### Non-authoring classifications

Types that are deliberately not authorable but whose pedagogical
classification a named live consumer still reads. Owned by
`src/component-catalogue/migrations/nonAuthoringPedagogy.js` — the same
shrinking-set discipline: each entry carries its consumer and its way out.

None. Every classification is owned by an authoring entry.

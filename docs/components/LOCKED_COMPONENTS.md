# Locked Components

**Version:** v2  
**Authority:** This file is the **canonical list** of components whose internals
require explicit authorisation. Nothing else defines locked status.

Other files may mirror or enforce what is written here, but must not maintain an
independent list:

- `CLAUDE.md` carries short high-risk reminders only, and points back here.
- `docs/components/COMPONENT_REGISTRY.md` marks an entry `LOCKED` only when it
  appears below.
- Source files carry a `LOCKED COMPONENT` marker comment matching this list.
- `tests/architecture/locked-component-registry.test.js` proves all three
  directions agree.

**Parsing note:** only the `## Locked Component List` section below is canonical.
Each entry is a `### Name` heading followed by a `**File:** \`path\`` line. The
`## Superseded — no longer locked` section is history, not lock status, and is
deliberately excluded by the architecture test.

**Scope note:** the Component Registry only catalogues `src/components/**`. A
locked component living outside that tree (e.g. a feature-level component) is
listed here and carries a source marker, but has no Component Registry entry.

**Documented exception — `ConceptReveal`:** it is governed by its own contract
(`docs/system/CONCEPT_REVEAL_CONTRACT.md`) and its own architecture test
(`tests/architecture/concept-reveal-contract.test.js`) instead of appearing in
this list. That mechanism is asserted by the lock test; do not fold
`ConceptReveal` into the general locked list.

---

## What "Locked" Means

A locked component has an established visual and behavioural contract that other components depend on. Changing its internals risks:

- Breaking answer flow across all question types
- Visual inconsistency across all content surfaces
- Navigation contract violations
- Progress display regressions

**When in doubt about a locked component: defer and report.**

---

## Locked Component List

### AnswerInteraction

**File:** `src/components/core/AnswerInteraction.jsx`

**What it owns:**
- All answer selection logic (choice, connection, true/false)
- Correct/incorrect state transitions
- Answer reveal behaviour
- Score recording

**Answer-flow contract (the behaviour "answer state logic" means here):**
- Maximum two attempts. Attempt 1 incorrect shows the hint and allows a retry;
  attempt 2 incorrect reveals the answer, logs the weakness silently and
  completes the interaction. Correct on either attempt completes it.
- The question is never replaced by feedback, and feedback appears below the
  answer area — the stem stays visible throughout.
- Weakness logging is silent: no "saved to your weak spots" message.
- This component is for non-timed learning activities only. Timed exam flows do
  not use it and must not gain hints or retry through it.
- The parent must wire `onComplete` — without it the component locks but the
  screen never learns that progression is allowed.

**Why locked:**
Every question type in the product delegates answer logic here. If AnswerInteraction's behaviour changes, every quiz flow is affected.

**Allowed changes:**
- Import path corrections
- Token migration (SPACING, MOTION, RADII) where exact matches exist

**Not allowed:**
- Changing answer state logic
- Changing reveal timing
- Adding new answer types without explicit sign-off
- Changing the component API

**2026-07-05 change (explicit sign-off, scoped):** the hardcoded feedback
colour literals (`#4DFF88` correct-answer highlight, `#C8D0E8` hint/feedback
body text) and copy (`💡 Hint — think about this`, `✓ Correct! `, `✗ Nope —
the answer was: `) were migrated to the canonical `GENERAL.feedbackCorrect` /
`GENERAL.feedbackHint` / `GENERAL.feedbackText` tokens and calmer copy
("Hint — think about this", "Correct — ", "Not quite — the answer was: "),
as part of an app-wide answer-feedback consolidation shared with
`UnifiedQuestionScreen`. Scoped strictly to colour/copy/token usage inside
the existing hint and feedback blocks — no answer-logic, reveal-timing, or
API change.

---

### BackButton

**File:** `src/components/core/BackButton.jsx`

**What it owns:**
- The visual design of every back-navigation control in the app: 40×40 touch target, `rgba(255,255,255,0.05)` fill, 1px near-invisible border (`rgba(255,255,255,0.03)`), fully rounded pill (`RADII.pill`), left-chevron icon only, no "Back" label
- The hover/press feedback: identical opacity (0.6) on both `:hover` and `:active`, via the shared `.rise-back-button` rule in `src/styles.css`

**Why locked:**
This is a constitutional, app-wide rule: **BackButton is the only back-navigation button implementation allowed anywhere in the app.** Before this component existed, back buttons had drifted into at least four divergent inline patterns (ghost circles, bordered pills with/without "Back" text, bare chevron characters). All of these have been migrated to this single component (28 call sites across `src/App.jsx` and `src/components/**`).

**Allowed changes:**
- Import path corrections
- Layout-only overrides via the `style` prop (`position`, `top`/`left`/`right`/`bottom`, `margin`, `zIndex`) — these do not change visual identity

**Not allowed:**
- Changing size, fill, border, radius, icon, or opacity behaviour
- Adding a text label
- Creating any new inline back-button implementation instead of using this component — every back-navigation control, in every new screen, must use `<BackButton />`

---

### CardContainer

**File:** `src/components/core/CardContainer.jsx`

**What it owns:**
- Atmospheric content surface appearance
- Background image handling
- Subject glow behaviour
- Surface border and opacity system

**Why locked:**
The visual contract for all content cards. Changing it cascades across every card surface in the product.

**Surface constraints (what "card visual appearance" means here):**
- `variant` is always explicit (`contained` | `inline` | `compact` | `fullBleed`).
  The component never infers a variant from its content.
- Subject atmosphere stays barely-there: tint, glow and shadow opacities live in
  the 0.06–0.12 range. Heavier tinting makes the surface compete with the lesson.
- No CSS filters (sepia, hue-rotate and friends) on wrapped content or images.

**Allowed changes:**
- Import path corrections
- Token migration for exact-match values

**Not allowed:**
- Changing card visual appearance
- Changing glow behaviour
- Altering background image treatment

---

### CinematicContinueCTA

**File:** `src/components/core/CinematicContinueCTA.jsx`

**What it owns:**
- The visual design of every cinematic "Continue →" prompt: plain centred text, fixed to the bottom of a full-screen cinematic moment, `crm-fade`/`crm-pulse` fade-in + idle pulse animation by default
- The `onClick` contract: always calls `e.stopPropagation()` before invoking the handler, so it can sit inside a tap-to-advance container without triggering the container's own navigation

**Why locked:**
Constitutional rule — see `docs/system/BUTTON_RADII_SYSTEM.md` "Progression CTA System". This is the only Cinematic Reveal CTA implementation allowed anywhere in the app. Consolidated from inline implementations in `CinematicRevealMoment` and `ExaminerExplainsScreen` (2026-06-15).

**Allowed changes:**
- Import path corrections
- Layout-only overrides via the `style` prop (`position`, `zIndex`) and the `animation` prop (for screen-specific entrance timing)

**Not allowed:**
- Changing typography, spacing, or colour logic
- Creating any new inline "Continue →" implementation instead of using this component

---

### ContinueCTA

**File:** `src/components/core/ContinueCTA.jsx`

**What it owns:**
- The visual design of every Primary Progression CTA: 56px tall, `RADII.large`, solid accent fill, `#0D0F14` text, "Continue" label by default (overridable via `label`)
- The press-scale feedback: `BUTTONS.continue.pressScale` on `onPointerDown`/`onPointerUp`/`onPointerLeave`
- The `disabled` state appearance (`disabledBackground`/`disabledColor`)

**Why locked:**
Constitutional rule — see `docs/system/BUTTON_RADII_SYSTEM.md` "Progression CTA System". This is the only Primary Progression CTA implementation allowed anywhere in the app. Consolidated from inline implementations across `src/components/learning/`, `src/components/feedback/`, and the chapter runtime's bottom navigation (2026-06-15, when the runtime was still `ModulePlayer.jsx`; it is now `src/components/layout/ChapterPlayer.jsx`).

**Allowed changes:**
- Import path corrections
- Layout-only overrides via the `style` prop (width/flex, margin, position, animation, transition)

**Not allowed:**
- Changing height, radius, font, or colour logic
- Creating any new inline "Continue" button implementation instead of using this component — every screen-to-screen progression button must use `<ContinueCTA />`

---

### ExitButton

**File:** `src/components/core/ExitButton.jsx`

**What it owns:**
- The visual design of every exit-navigation control in the app: 44×44 touch target, near-invisible "X" icon (`opacity: 0.22` at rest)
- The press feedback: opacity 0.6 + scale 0.90 on press, via `onPointerDown`/`onPointerUp`/`onPointerLeave`

**Why locked:**
Constitutional rule: **ExitButton is the only exit-navigation button implementation allowed anywhere in the app.** Consolidated from the inline exit-button implementation previously in `LearningToolbar`/`LearningHeader` (2026-06-15).

**Allowed changes:**
- Import path corrections
- Layout-only overrides via the `style` prop (`position`, `margin`, `zIndex`)

**Not allowed:**
- Changing size, icon, or opacity/press behaviour
- Creating any new inline exit-button implementation instead of using this component

---


### FactorWeb

**File:** `src/components/learning/FactorWeb.jsx`

**What it owns:**
- The mobile two-column factor web geometry for four to six factors
- The central image/placeholder medallion, centre label, soft localised halo, and subtle connector-line treatment
- The explore-every-factor flow, shared `SequenceProgress`, judgement phase, and governed `ContinueCTA` progression

**Why locked:**
This component is now the approved causation-and-judgement pattern for GCSE History factor screens. Its 390px composition has been verified against the FactorWeb contract and gold register. Changing its internals risks reintroducing the pre-rework failures: centre-question cramming, eyebrows, overlong/clamped node labels, heavy connector graphics, centre dots, local progress counters, or chapter-owned geometry.

**Allowed changes:**
- Import path corrections
- Adding a new chapter content block that uses the existing `factorWeb` data contract
- Asset/content updates in chapter files where wording and imagery remain chapter-owned

**Not allowed:**
- Redesigning the component geometry, heading route, connector style, centre focal treatment, progress affordance, or progression controls without explicit sign-off
- Reintroducing centre dots, decorative eyebrows, numeric local progress, emoji factor identity, runtime truncation/clamping, or chapter-specific geometry
- Hardcoding topic image paths or figure wording inside the shared component

---

### HomeAtmosphere

**File:** `src/features/home/Home.jsx`

**Scope:** lives outside `src/components/**`, so it has no Component Registry
entry. The lock is defined here and marked in `Home.jsx`.

**What it owns:**
- The three drifting SVG wave bands and the teal constellation network rendered
  in the 34vh hero section of the Home tab
- Its own call site: `<HomeAtmosphere />` inside `Home`

**Why locked:**
This is the first thing a learner sees on opening the app, and it carries the
product's "premium streaming platform, not a school VLE" identity. It has been
repeatedly at risk of being removed as decorative.

**Allowed changes:**
- Small colour adjustments to the teal values

**Not allowed:**
- Removing or renaming the component
- Altering the wave, gradient or animation structure
- Removing the `<HomeAtmosphere />` call site in `Home`

---

### LearningProgressHeader

**File:** `src/components/core/LearningProgressHeader.jsx`

**What it owns:**
- Progress rail display
- Jump sheet appearance
- Step indicator

**Why locked:**
Core navigation affordance. Learners develop spatial memory for progress location. This is also the only progress-bar implementation allowed for module screens — every module progress display must use `<LearningProgressHeader />` (via `LearningHeader`), not an inline progress bar.

**Allowed changes:**
- Import path corrections

**Not allowed:**
- Moving the progress bar position
- Changing progress rail appearance
- Adding interaction logic (it is display-only)
- Creating any new inline progress-bar implementation instead of using this component

---

### RecoveryQuizPlayer

**File:** `src/components/learning/RecoveryQuizPlayer.jsx`

**What it owns:**
- The post-reteaching verification sequence: rapid focused question flow,
  per-question feedback and the completion state
- The recovery-quiz data contract read from `src/data/recoveryQuizzes.js`

**Why locked:**
This is the component that decides whether a diagnosed weakness has been
repaired. Changing its flow or completion logic changes what the whole weak-area
personalisation system believes about the learner.

**Allowed changes:**
- Import path corrections
- Token migration (SPACING, MOTION, RADII) where exact matches exist
- Adding recovery quizzes in `src/data/recoveryQuizzes.js` using the existing shape

**Not allowed:**
- Changing question flow, feedback timing or the completion contract
- Changing the component API
- Declaring a weakness repaired on any basis other than the documented
  success threshold (see the governance rule in the Component Registry entry)

---

### RetrievalFrame

**File:** `src/components/feedback/RetrievalFrame.jsx`

**What it owns:**
- Cinematic wrapper appearance for retrieval questions
- Question presentation framing
- Delegation pattern to AnswerInteraction

**Why locked:**
Visual contract for all retrieval screens. Every question presentation inherits from this frame.

**Allowed changes:**
- Import path corrections
- Token migration for exact-match values

**Not allowed:**
- Changing question presentation layout
- Adding answer logic (it delegates to AnswerInteraction)
- Changing the cinematic framing approach

---

### SequenceProgress

**File:** `src/components/core/SequenceProgress.jsx`

**What it owns:**
- Every local progress indicator inside a learning component: carousels, image
  sets, swipe cards, mini-steps, question sets
- The two approved variants (`dots`, `sash`) and their `compact` sizes

**Why locked:**
Constitutional rule, in the same class as `BackButton`/`ContinueCTA`: this is the
only local sequence-progress implementation allowed anywhere in the app. Before
it existed, one-off `ProgressDots` and inline carousel dots had drifted across
several components.

**Hard rule:** it never renders numbers, labels, counters, percentages or
"x of y" — no exceptions. That constraint is the reason it is locked.

**Allowed changes:**
- Import path corrections
- Token migration (MOTION, RADII) where exact matches exist

**Not allowed:**
- Rendering any numeric or textual progress
- Adding navigation or any interaction (it is display-only)
- Adding a new variant without explicit sign-off
- Creating any local `ProgressDots` or one-off carousel dots instead of using
  this component

---

### WeakSpotRecovery

**File:** `src/components/learning/WeakSpotRecovery.jsx`

**What it owns:**
- The intervention handoff shown once the weakness tracker has enough
  behavioural evidence: the calm diagnosis framing and the route into repair
- The `weakSpotRecovery` block contract

**Why locked:**
This is the learner-facing face of the weak-area system — the app's primary
personalisation mechanism. Its tone is deliberately non-punitive and
non-gamified, and its behavioural (not self-report) basis is a product rule.

**Allowed changes:**
- Import path corrections
- Token migration (SPACING, MOTION, RADII) where exact matches exist

**Not allowed:**
- Changing the diagnosis framing to gamified or motivational copy
- Basing the intervention on self-reported confidence
- Marking a weakness resolved from this screen (it starts a repair pathway,
  it does not complete one)
- Changing the component API or block shape

---

## Superseded — no longer locked

### LearningToolbar

**File:** `src/components/core/LearningToolbar.jsx`

**Status:** Superseded — retained temporarily; do not use for new work.

**Unlocked 2026-08-01.** `LearningHeader` composes `BackButton` and
`ExitButton` directly, so the navigation contract this entry protected now lives
in those two constitutional components and in `LearningHeader`. `LearningToolbar`
has no production consumer — its only importer is the Component Lab reference
page `src/dev/componentReview/ButtonsAndProgressPage.jsx`. A lock over a
component nothing renders protects nothing and makes the canonical list harder
to trust.

The file and its executable code are unchanged; only the stale lock marker was
removed. The back/exit visual and behavioural contract remains locked via the
`BackButton` and `ExitButton` entries above.

---

## Modification Protocol

If you believe a locked component genuinely needs to change:

1. Document what the change is
2. Document why it's needed
3. Document what the risk is to dependent components
4. Get explicit sign-off before proceeding
5. Test all dependent components after the change

Never make "just a quick tweak" to a locked component.

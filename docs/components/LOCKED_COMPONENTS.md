# Locked Components

**Version:** v1  
**Authority:** These components must not have their internals changed without explicit authorisation.

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
Constitutional rule — see `docs/system/BUTTON_RADII_SYSTEM.md` "Progression CTA System". This is the only Primary Progression CTA implementation allowed anywhere in the app. Consolidated from inline implementations across `src/components/learning/`, `src/components/feedback/`, and `ModulePlayer.jsx`'s bottom navigation (2026-06-15).

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
Constitutional rule: **ExitButton is the only exit-navigation button implementation allowed anywhere in the app.** Consolidated from the inline exit-button implementation previously in `ModuleToolbar`/`LearningHeader` (2026-06-15).

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

### ModuleToolbar

**File:** `src/components/core/ModuleToolbar.jsx`

**What it owns:**
- Back button (delegates to `BackButton` — see above)
- Exit button (delegates to `ExitButton` — see below)
- Navigation button positions

**Why locked:**
Navigation contract. Learners build muscle memory for back/exit button positions.

**2026-06-12 change:** the inline back-button implementation was replaced with `<BackButton onClick={onBack} />` as part of the app-wide BackButton consolidation (constitutional rule — see BackButton entry above). The exit button and toolbar layout are unchanged. Treated as covered by the same sign-off, since this component's back button was explicitly named in scope.

**2026-06-15 change (v2):** the inline exit-button implementation was replaced with `<ExitButton onClick={onExit} />` as part of the app-wide ExitButton consolidation (constitutional rule — see ExitButton entry above). `LearningHeader` was updated the same way. Toolbar layout is unchanged.

**Allowed changes:**
- Import path corrections

**Not allowed:**
- Moving button positions
- Adding buttons to the toolbar
- Changing button visual design
- Reintroducing an inline back-button or exit-button implementation (must use `BackButton`/`ExitButton`)

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

## Modification Protocol

If you believe a locked component genuinely needs to change:

1. Document what the change is
2. Document why it's needed
3. Document what the risk is to dependent components
4. Get explicit sign-off before proceeding
5. Test all dependent components after the change

Never make "just a quick tweak" to a locked component.

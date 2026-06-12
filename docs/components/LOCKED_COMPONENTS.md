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

---

### BackButton

**File:** `src/components/core/BackButton.jsx`

**What it owns:**
- The visual design of every back-navigation control in the app: 44×44 touch target, `rgba(255,255,255,0.05)` fill, 1px near-invisible border, fully rounded pill (`RADII.pill`), left-chevron icon only, no "Back" label
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

### LearningProgressHeader

**File:** `src/components/core/LearningProgressHeader.jsx`

**What it owns:**
- Progress rail display
- Jump sheet appearance
- Step indicator

**Why locked:**
Core navigation affordance. Learners develop spatial memory for progress location.

**Allowed changes:**
- Import path corrections

**Not allowed:**
- Moving the progress bar position
- Changing progress rail appearance
- Adding interaction logic (it is display-only)

---

### ModuleToolbar

**File:** `src/components/core/ModuleToolbar.jsx`

**What it owns:**
- Back button (delegates to `BackButton` — see above)
- Exit button
- Navigation button positions

**Why locked:**
Navigation contract. Learners build muscle memory for back/exit button positions.

**2026-06-12 change:** the inline back-button implementation was replaced with `<BackButton onClick={onBack} />` as part of the app-wide BackButton consolidation (constitutional rule — see BackButton entry above). The exit button and toolbar layout are unchanged. Treated as covered by the same sign-off, since this component's back button was explicitly named in scope.

**Allowed changes:**
- Import path corrections

**Not allowed:**
- Moving button positions
- Adding buttons to the toolbar
- Changing button visual design
- Reintroducing an inline back-button implementation (must use `BackButton`)

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

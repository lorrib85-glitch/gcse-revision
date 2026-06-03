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
- Back button
- Exit button
- Navigation button positions

**Why locked:**
Navigation contract. Learners build muscle memory for back/exit button positions.

**Allowed changes:**
- Import path corrections

**Not allowed:**
- Moving button positions
- Adding buttons to the toolbar
- Changing button visual design

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

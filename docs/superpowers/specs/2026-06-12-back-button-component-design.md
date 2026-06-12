# BackButton — locked, constitutional component

**Date:** 2026-06-12
**Status:** Implemented

## Problem

Back-navigation buttons had drifted into at least four divergent inline
patterns across the app:

- `ModuleToolbar` — a ghost circle with a chevron
- `SubjectBrowser` / `ModulePage` / `HistoryMedicineBrowser` — bordered pills
- Maths / English / Sociology browsers and several learning screens — a bare
  `←` character button
- The Exams "Nail exam technique" / "Sit a full paper" choosers — a bordered
  pill with a "Back" text label

Each had its own size, fill, border, radius, icon and hover/press feedback.
This created visual inconsistency and made every new screen a fresh design
decision.

## Decision

Create a single, locked `BackButton` component
(`src/components/core/BackButton.jsx`) and make it the **only**
back-navigation implementation allowed anywhere in the app.

### Visual contract

- 44×44 touch target
- Fill: `rgba(255,255,255,0.05)`
- Border: 1px, near-invisible (`rgba(255,255,255,0.06)`)
- Fully rounded pill (`RADII.pill`)
- Left chevron icon only — no "Back" text label
- Hover and press produce the **same** opacity value (0.6), via a single
  shared CSS rule (`.rise-back-button:hover, .rise-back-button:active { opacity: 0.6 }`
  in `src/styles.css`), using `MOTION.duration.fast` / `MOTION.easing.gentle`
  timing in spirit (global CSS can't import JS tokens, so the equivalent
  literal values are used with a comment pointing at the source tokens).

### API

```jsx
<BackButton onClick={onBack} />
<BackButton onClick={onBack} style={{ position: 'absolute', top: 22, left: 18, zIndex: 10 }} />
```

`style` is layout-only (`position`, `top`/`left`/`right`/`bottom`, `margin`,
`zIndex`). It must never be used to change fill, border, radius, size, icon
or opacity — those are fixed by the component.

## Scope of migration

All 28 existing back-navigation call sites were migrated in this pass, not
just the four illustrative patterns named at kickoff — the requirement was
"no inline implementations allowed anywhere" / "the only back-button
implementation allowed anywhere in the app", which covers every instance:

- `src/App.jsx` — 14 instances (ModulePage, SubjectBrowser,
  HistoryMedicineBrowser, Maths/English/Sociology/Chemistry browsers and
  questions, Exams "Nail exam technique" / "Sit a full paper" choosers, exam
  round sticky header, TestTab summary and question screens)
- `src/components/core/ModuleToolbar.jsx`
- `src/components/core/LearningHeader.jsx` (the live in-module header — see
  "ModuleToolbar discovery" below)
- `src/components/learning/InteractiveHotspotImage.jsx`
- `src/components/learning/WeakSpotRecovery.jsx`
- `src/components/learning/PriorKnowledgeRecall.jsx`
- `src/components/learning/ExaminerExplainsScreen.jsx`
- `src/components/layout/ChapterHookScreen.jsx`
- `src/components/layout/ChapterOutcomeScreen.jsx`
- `src/components/layout/ChapterCompleteScreen.jsx` ("Go back" button only —
  the adjacent "Menu" button is unrelated and unchanged)
- `src/components/learning/GuidedExamResponse.jsx` — 3 instances
- `src/components/learning/FaceTheExaminer.jsx`
- `src/components/learning/RecoveryQuizPlayer.jsx` (dropped the "← Back"
  text label per the new contract; the unrelated green "Go back" CTA shown
  on the "Quiz not found" error state was left as-is — it's a call-to-action
  button, not a back-navigation control)

Files with a local `BackBtn` wrapper (`ExaminerExplainsScreen`,
`ChapterHookScreen`, `ChapterOutcomeScreen`) kept their wrapper function but
made it delegate entirely to `<BackButton>`, preserving any
`e.stopPropagation()` behaviour from the original — this avoided rewriting
every call site inside those files.

## ModuleToolbar discovery

`ModuleToolbar.jsx` is documented (`CLAUDE.md`) as the back/exit toolbar
composed by `LearningHeader`, and is marked LOCKED with "Not allowed:
Changing button visual design." In practice:

- `ModuleToolbar` has zero external imports — it is dead code.
- `LearningHeader.jsx` (imported ~20+ times via `ModulePlayer.jsx`) has its
  own, separate inline back button — this is the one learners actually see.

Both were migrated to `BackButton`. The user's directive explicitly named
"ModuleToolbar ghost circle" as in-scope, which is treated as the sign-off
required by the LOCKED-component modification protocol for changing
`ModuleToolbar`'s button visual design (now delegated to `BackButton`,
exit button and layout unchanged). `LearningHeader`'s dependency was
corrected from the documented (but inaccurate) "composes ModuleToolbar" to
"composes BackButton" in `docs/components/COMPONENT_REGISTRY.md`.

## Documentation

- `docs/components/LOCKED_COMPONENTS.md` — new `BackButton` entry (locked,
  constitutional); `ModuleToolbar` entry updated to note the delegation and
  sign-off rationale.
- `docs/components/COMPONENT_REGISTRY.md` — new `BackButton` entry;
  `LearningHeader` and `ModuleToolbar` dependency lines corrected.
- `docs/system/COMPONENT_AUTHORING_RULES.md` — new "Back Navigation Rule"
  section: `BackButton` is the only allowed implementation, `style` is
  layout-only.

## Verification

- `./node_modules/.bin/vite build` — passes with 0 errors.
- Codebase search confirms no remaining inline back-button implementations
  (no stray `←`/`‹` buttons, no chevron SVG paths outside `BackButton.jsx`,
  no `aria-label="Back"`/"Go back" outside `BackButton`, all local `BackBtn`
  wrappers delegate to `BackButton`).
- Playwright spot-check across representative screens (module player header,
  SubjectBrowser, Exams choosers, TestTab) at 390×844.

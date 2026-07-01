# Architecture backlog

## Purpose
Track structural, maintainability, and boundary work that should not be mixed into feature/content builds.

---

## A1 — Finish QuickFire architecture hardening

**Status:** Backlog  
**Priority:** Medium  
**Area:** `src/features/quickfire/`, `tests/architecture/`

### Context
QuickFire has been reduced from a large monolith into separate mode/components/data layers:

- `QuickFire.jsx` reduced from 3406 lines to ~621 lines.
- `QuickFireMode.jsx` extracted.
- `TopicPracticeMode.jsx` extracted.
- Maths browser/question modes extracted.
- `ExamMode.jsx` extracted.
- `TestDataProvider` extracted.
- `FormulaSheet` extracted.
- Question banks moved into `src/data/questionBanks/`.
- Boundary tests added with a current `QuickFire.jsx` ceiling of 700 lines.

### Remaining work
- Keep `QuickFire.jsx` as a thin orchestrator.
- Reduce `QuickFire.jsx` ceiling toward 500 lines once the remaining inline Chemistry placeholder code is either removed or properly designed.
- Do not extract Chemistry merely for tidiness until the Chemistry subject/module design is ready.
- Keep the Chemistry quickfire TODO as an intentional exception.
- Review whether any mode file grows beyond a reasonable limit as adaptive selection/content expansion begins.

### Guardrail targets
Eventually enforce:

- Feature orchestrator files: max ~500 lines.
- Mode files: max ~500–800 lines unless justified.
- Question-bank files: exempt from line limits, but should export data only.
- No large embedded question banks inside feature components.
- No speculative Chemistry/Physics/Drama/Music module banks before those subjects are designed.

### Acceptance criteria
- `QuickFire.jsx` remains below its architecture threshold.
- `tests/architecture/quickfire-boundaries.test.js` stays green.
- Any future extraction preserves behaviour and does not redesign UI.
- Chemistry/Physics/Drama/Music structure is only added when real designed content exists.

---

## A2 — Resolve or quarantine legacy architecture test failures

**Status:** Backlog  
**Priority:** Medium  
**Area:** `tests/architecture/`

### Context
During QuickFire stabilisation, new quickfire boundary tests passed, but 9 pre-existing architecture failures were reported as unchanged.

### Why this matters
If known failures remain mixed into normal test output, future regressions become harder to trust.

### Work
- Identify each pre-existing architecture failure.
- Decide whether each should be fixed or explicitly marked as known legacy debt.
- Prefer fixing where small and safe.
- If not fixing immediately, document with a clear TODO and owner area.

### Acceptance criteria
- Architecture test output becomes trustworthy again.
- Known legacy failures are not mistaken for new regressions.
- Future build/test reports can clearly distinguish new failures from accepted legacy debt.

---

## A3 — Remove duplicated subject palette maps from feature files

**Status:** Backlog  
**Priority:** High  
**Area:** `src/features/subjects/Subjects.jsx`, `src/constants/subjects.js`, subject theme helpers, tests

### Context
`Subjects.jsx` currently defines its own local subject palette map with values such as `sand`, `bronze`, `cream`, `espresso`, and `ink` per subject, including values like `#14110E`.

This directly contradicts the governance comment in `src/constants/subjects.js` that says not to duplicate colours or create local palette maps. This is not a simple token swap: it is an architectural ownership problem where a feature file is acting as a second source of truth for subject theme colours.

### Why this matters
- A subject colour update in `subjects.js` may not update `Subjects.jsx`.
- Local palettes can drift from the approved brand system.
- Cross-subject UI can accidentally depend on feature-local colour definitions.
- Duplicate maps make future brand audits noisy and unreliable.
- Values such as `ink`/`espresso` may be meaningful surface roles, not subject colours, and need proper token ownership.

### Work
- Audit the local subject palette map in `Subjects.jsx`.
- Decide which values are true subject identity tokens and which are general surface/chrome tokens.
- Move or derive subject identity values from `src/constants/subjects.js` only.
- Move shared dark/surface roles to the planned `GENERAL.background.*` tokens from brand backlog B9 where appropriate.
- Replace feature-local palette reads with approved imports or helper functions.
- Add an architecture test preventing local subject palette maps in feature files.

### Rules
- Do not create replacement local maps in another feature file.
- Do not blindly move all values into `subjects.js` if they are actually general chrome/surface roles.
- Do not use colour-distance matching to infer ownership.
- Preserve the visual output initially; this is a source-of-truth refactor, not a redesign.

### Acceptance criteria
- `Subjects.jsx` no longer owns a duplicated subject palette map.
- Subject colours resolve through the canonical subject theme source.
- General surface/chrome colours resolve through `GENERAL` tokens where appropriate.
- Architecture tests catch future local subject palette maps.
- Visual behaviour remains unchanged or changes only where an explicit design decision is made.

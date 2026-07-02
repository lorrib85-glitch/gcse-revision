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

**Status:** Resolved  
**Priority:** Medium  
**Area:** `tests/architecture/`

### Context
During QuickFire stabilisation, new quickfire boundary tests passed, but 9 pre-existing architecture failures were reported as unchanged.

### Progress
Architecture tests are now green: `pnpm vitest run tests/architecture` reports 412/412 passing after the recent token and ModulePlayer work.

### Acceptance criteria
- Architecture test output becomes trustworthy again.
- Known legacy failures are not mistaken for new regressions.
- Future build/test reports can clearly distinguish new failures from accepted legacy debt.

---

## A3 — Remove duplicated subject palette maps from feature files

**Status:** In progress  
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

### Progress

Dead-code precursor cleanup is complete:

- Audited all three functions that read `SUBJECT_PALETTES`: `ModulePage`, `SubjectBrowser`, `HistoryMedicineBrowser`. Confirmed via full-`src/`-tree grep that `ModulePage` and `HistoryMedicineBrowser` had zero references anywhere outside their own definitions in `Subjects.jsx` — both were unreachable dead code, carrying the majority of the ~40+ duplicate palette call sites.
- Removed `ModulePage` (was lines 48–409) and `HistoryMedicineBrowser` (was lines 1069–1186) in full — deletion only, no logic or colour values changed.
- Removed the unused `espresso` destructure from `SubjectBrowser` (it was destructured but never read in that function's body).
- `SUBJECT_PALETTES` values themselves were not touched — no colour changed.
- **The live palette surface is now reduced to `SubjectBrowser` only**, which reads exactly three roles: `sand` (aliased `accent`, ~15 sites — eyebrow label, progress ring, active-series border/glow, node fills, CTA text/badges, timeline dots), `bronze` (1 site — dark stop of the CTA gradient), `cream` (1 site — text colour on the current timeline node).
- Ownership for `sand`/`bronze`/`cream` remains **open** — deliberately not decided in this pass:
  - `sand`/`bronze` must **not** be mechanically mapped onto `SUBJECTS[subject].accent`/`accentSecondary` in `constants/subjects.js` — the values differ (only English's `sand` `#6A343D` happens to match its canonical `accent` `#6A343D` exactly; all other 6 subjects diverge, e.g. History canonical `#D69B45` vs local `sand` `#C89B6D`). Doing so would be a real visible colour change, not a safe refactor.
  - `cream` needs a human design-review decision: it's plausibly subject identity (each subject gets a distinct light tint) or plausibly collapsible to a fixed `GENERAL`-style light-neutral token with no visible loss. Neither call can be made mechanically or by colour-distance matching.
- Added a narrow regression test, `Subjects.jsx dead code does not regrow` in `tests/architecture/app-boundaries.test.js`, asserting `ModulePage`/`HistoryMedicineBrowser` are not reintroduced as function names.
- `pnpm vitest run tests/architecture` passed 413/413 (412 + 1 new).
- `pnpm vitest run tests/unit` passed 214 tests with 2 todo (unchanged).
- `pnpm vite build` succeeded.
- Manually verified in a running dev server: Subjects tab renders correctly; tapped into both History and Biology subject browsers — header, progress ring, series picker/active state, gradient CTA, and timeline current node all render identically to before, with correct per-subject accent colours (confirmed via computed glow colour matching each subject's `sand` value).

**First ownership slice (`sand`/`bronze`) complete:**

- Added `subjectBrowserAccent` / `subjectBrowserAccentDark` fields to `SUBJECTS.{History,Sociology,Biology,Chemistry,Physics,English,Maths}` in `src/constants/subjects.js`, carrying the exact former local `sand`/`bronze` hex values unchanged. Not added to Drama/Music (they never had `sand`/`bronze` entries). Explicit code comment on each pair states they are distinct from `accent`/`accentTertiary` by design and must not be converged.
- `Subjects.jsx`'s `SubjectBrowser` now reads `sand`/`bronze` from `SUBJECTS[subjectName]?.subjectBrowserAccent` / `?.subjectBrowserAccentDark`, with the same History-fallback behaviour the old local-map lookup had.
- Removed `sand`, `bronze`, and the already-dead `espresso`/`ink` keys from the local map entirely.
- `cream` was **not** moved. The local map was renamed to `SUBJECT_BROWSER_PENDING_CREAM` (cream-only, one field per subject) with a comment marking it pending human design-review sign-off before it can be relocated or collapsed.
- Extended `tests/architecture/app-boundaries.test.js` with a new describe block asserting `Subjects.jsx` has no local `sand:`/`bronze:` hex-keyed object literal and that it imports/reads its accent pair from `SUBJECTS` in `constants/subjects.js`.
- Did **not** add the migrated hex values to `color-token-governance.test.js`'s `MIGRATED_VALUES` — several of them (`#C89B6D`, `#9B59E8`, `#2DD4BF`, `#3B82F6`, `#C9B07C`) already appear as raw literals in `QuickFire.jsx` and `InteractiveHotspotImage.jsx` for unrelated purposes; gating on them now would fail the test immediately and fixing those call sites means touching `QuickFire.jsx`, which is out of scope for this slice.
- `pnpm vitest run tests/architecture` and `pnpm vitest run tests/unit` pass; `pnpm vite build` succeeds; manual smoke check in dev server confirmed no rendered colour change for History and Biology.

### Work (remaining)
- `cream` still needs a human design-review decision (subject-identity token vs. collapse to a `GENERAL` light-neutral) before it can be moved out of `SUBJECT_BROWSER_PENDING_CREAM` in `Subjects.jsx`.
- Move shared dark/surface roles to the planned `GENERAL.background.*` tokens from brand backlog B9 where appropriate (separate from this slice).
- Once `QuickFire.jsx`'s unrelated reuse of these same hex values is addressed (separately, out of scope here), revisit adding `subjectBrowserAccent`/`subjectBrowserAccentDark` to the colour-token governance migrated list.

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

---

## A4 — ModulePlayer staged extraction

**Status:** In progress  
**Priority:** High  
**Area:** `src/components/layout/ModulePlayer.jsx`, `src/app/moduleNavigation.js`, `tests/unit/modulePlayer/`, future state-machine helpers

### Context
`ModulePlayer.jsx` remains the main bloat and fragile runtime area after the old `src/modules/history.js` bloat was resolved by the per-episode migration. It was around 2423 lines and contains lesson lifecycle state, navigation, gating, persistence, screen routing, and rendering concerns.

### Progress
Phase 1 is complete:

- Commit `b743cb3` extracted pure navigation helpers into `src/app/moduleNavigation.js`:
  - `isFullScreenVideoScreen`
  - `getStageNavigation`
  - `getCurrentStageFromNavigation`
- Added `tests/unit/app/moduleNavigation.test.js` with 16 tests.
- `ModulePlayer.jsx` reduced from 2423 to 2393 lines.
- `scrollToTop`, storage helpers, rendering, and lifecycle logic were deliberately left in place.
- `pnpm vitest run tests/architecture` passed 412/412.
- `pnpm vite build` succeeded and ModulePlayer remained its own lazy chunk.

Phase 2 test scaffolding is documented:

- Commit `34b1e3c` added `tests/unit/modulePlayer/lifecycle.test.js` with 39 `it.todo()` specs across seven behaviour groups:
  - fresh module start
  - resume saved module state
  - stale saved screen index reset
  - go/goTo clamping
  - hook/outcomes/recall gating
  - completed-module reopening
  - final-screen finish decisions
- These are intentionally `todo` specs rather than assertions because the behaviours currently live inside the `ModulePlayer` function closure and cannot be tested in the current node-only unit setup without either extraction or new render infrastructure.
- The todo file is a map of behaviours to unlock as pure helpers are extracted, not a substitute for real coverage.

Phase 2 first extraction is complete:

- Commit `7c3c406` added `computeInitialModuleState(module, saved)` to `src/app/moduleNavigation.js`.
- `ModulePlayer.jsx` now consumes the helper for initial state instead of deriving those values inline.
- Added 17 tests for `computeInitialModuleState` in `tests/unit/app/moduleNavigation.test.js`.
- Converted 20 of the 39 lifecycle todos into real assertions in `tests/unit/modulePlayer/lifecycle.test.js`.
- Remaining lifecycle todos after this extraction: 19.
- `ModulePlayer.jsx` reduced from 2393 to 2387 lines.
- `pnpm vitest run tests/unit/modulePlayer/lifecycle.test.js` passed 20 tests with 19 todo.
- `pnpm vitest run tests/unit/app/moduleNavigation.test.js` passed 33 tests.
- `pnpm vitest run tests/architecture` passed 412/412.
- `pnpm vite build` succeeded and ModulePlayer remained its own lazy chunk.
- `introDone` is currently preserved as hardcoded `true`; this is existing behaviour, not a deliberate fix.

Phase 2 clamp extraction is complete:

- Commit `c35d1af` added `clampScreenIndex(index, total)` to `src/app/moduleNavigation.js`.
- `go()` and `goTo()` now call `clampScreenIndex` while keeping `setScreen`, `setAnimKey`, `scrollToTop`, `recordActivity`, and `setJumpOpen` inside `ModulePlayer.jsx`.
- Added 6 contract-level tests for `clampScreenIndex` in `tests/unit/app/moduleNavigation.test.js`.
- Converted all 7 go/goTo clamping lifecycle todos into real assertions.
- Remaining lifecycle todos after this extraction: 12.
- `ModulePlayer.jsx` stayed at 2387 lines; this extraction improved testability rather than size.
- `pnpm vitest run tests/unit/modulePlayer/lifecycle.test.js` passed 27 tests with 12 todo.
- `pnpm vitest run tests/unit/app/moduleNavigation.test.js` passed 39 tests.
- `pnpm vitest run tests/architecture` passed 412/412.
- `pnpm vite build` succeeded and ModulePlayer remained its own lazy chunk.

Phase 2 `resolveFinishAction` extraction is complete:

- Added `resolveFinishAction(module, options)` to `src/app/moduleNavigation.js`: pure decision for the final-screen finish branch (`showExaminerExplains` / `showExaminer` / `completeModule`), mirroring `handleFinish`'s exact priority order (examinerExplains gate first while unshown, then examiner, then completion).
- `handleFinish()` now calls `resolveFinishAction` and switches on `action.type`; all side effects (`setShowExaminerExplains`, `setShowExaminer`, `detectWeakSpot`/`completeModule`, `scrollToTop`) stay inside `ModulePlayer.jsx` exactly as before.
- Added 7 contract-level tests for `resolveFinishAction` in `tests/unit/app/moduleNavigation.test.js`.
- Converted all 4 final-screen finish decision lifecycle todos into real assertions.
- Remaining lifecycle todos after this extraction: 8 (6 hook/outcomes/recall gating + 2 completed-module reopening/persistence side effects).
- `ModulePlayer.jsx` went from 2387 to 2388 lines (net +1: the extraction traded an inline `if` for a call plus an `action.type` switch).
- `pnpm vitest run tests/unit/modulePlayer/lifecycle.test.js` passed 31 tests with 8 todo.
- `pnpm vitest run tests/unit/app/moduleNavigation.test.js` passed 46 tests.
- `pnpm vitest run tests/architecture` passed 412/412.
- `pnpm vite build` succeeded and ModulePlayer remained its own lazy chunk.

Phase 2 `getModuleGate` extraction is complete:

- Commit `6729877` added `getModuleGate(module, { hookDone, wylDone, recallDone, navTo })` to `src/app/moduleNavigation.js`: pure decision for which universal-opener gate (hook/outcomes/recall) to render, mirroring the exact priority order of ModulePlayer's three gate render blocks (hook first including the `navTo='hook'` override, then outcomes, then recall including the `navTo='recall'` override).
- `ModulePlayer.jsx` now computes `moduleGate = getModuleGate(...)` once and switches on `moduleGate.type` at the three former inline-condition sites; all JSX and side effects (`setHookDone`, `setWylDone`, `setRecallDone`, `setNavTo`, `scrollToTop`, `onBack` handlers) stay exactly as they were.
- Added 8 contract-level tests for `getModuleGate` in `tests/unit/app/moduleNavigation.test.js`.
- Converted all 6 hook/outcomes/recall gating lifecycle todos into real assertions.
- Remaining lifecycle todos after this extraction: 2 (both completed-module reopening/persistence side effects — `completeModule()`'s persistence call and `go(-1)` review-mode behaviour).
- `ModulePlayer.jsx` went from 2388 to 2392 lines (net +4: the extraction traded three inline conditions for a helper call plus a comment).
- `pnpm vitest run tests/unit/modulePlayer/lifecycle.test.js` passed 37 tests with 2 todo.
- `pnpm vitest run tests/unit/app/moduleNavigation.test.js` passed 54 tests.
- `pnpm vitest run tests/unit` passed 214 tests with 2 todo.
- `pnpm vitest run tests/architecture` passed 412/412.
- `pnpm vite build` succeeded and ModulePlayer remained its own lazy chunk.

### Known test cleanup note
Some lifecycle assertions intentionally duplicate `computeInitialModuleState` coverage from `moduleNavigation.test.js` because the lifecycle todo file is acting as a migration map. Do not add more duplicate coverage casually. Future extractions should prefer one canonical unit suite for the helper plus only enough lifecycle tests to prove the todo behaviour is now covered.

### Remaining phases
Phase 2 — navigation/state-machine boundary:
- Remaining lifecycle todos: completed-module side-effect/reopen edge cases (2, tied to `completeModule()`'s persistence call and `go(-1)` review-mode behaviour).
- These 2 remaining todos are persistence-side-effect-adjacent and may belong in Phase 3 instead — decide when picked up.
- Do not start Phase 3 storage extraction until this decision is made.

Phase 3 — persistence side effects:
- Move `getModuleState`, `saveModuleState`, and state-shape-building logic only after storage behaviour is pinned by tests.
- Preserve storage key format `gcse_module_${moduleId}` and saved object shape exactly.
- Update `tests/architecture/storage-boundary.test.js` only when the storage functions are moved.

Phase 4 — rendering split:
- Split screen-type rendering and block sub-renderers only after logic/state is stable.
- This is the highest-risk phase because it touches visual rendering.

### Rules
- Do not combine phases.
- Do not redesign UI during architecture extraction.
- Do not change content module shape.
- Do not change storage keys or saved state shape.
- Do not move weakness tracking into ModulePlayer; it is already delegated to child components.
- Keep each extraction test-backed and boring.
- Convert `it.todo()` specs to real assertions as each pure helper is extracted; do not leave todo specs as permanent coverage.

### Acceptance criteria
- ModulePlayer gradually reduces in size while behaviour remains unchanged.
- Navigation and stage-machine logic becomes testable outside React.
- Architecture tests and build stay green after each phase.
- ModulePlayer remains lazy-loaded as its own chunk.
- Todo lifecycle specs are converted into real tests as the corresponding logic becomes testable.

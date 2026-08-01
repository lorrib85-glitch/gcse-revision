# Architecture backlog

## Purpose
Track structural, maintainability, and boundary work that should not be mixed into feature/content builds.

---

## A5 — Canonical Learning Graph

**Status:** In progress — core registry + Medicine proof of concept shipped
**Priority:** High
**Area:** `src/data/learningGraph/`, `src/modules.js`, `src/data/questionBanks/`, `src/data/medicineExamPapers.js`, `tests/architecture/learning-graph.test.js`

### Context
Every adaptive feature (weak-spot detection, planner, adaptive selection, AI
marking, analytics) needs modules, topics, screens, questions and exam papers
to reference the same knowledge vocabulary. `src/data/learningGraph/` is that
vocabulary: a concept registry (`subject:course:concept` ids), a facet tag
schema, and a pure tag-inheritance resolver
(`resolveEffectiveTags(module.tags, topic.tags, question.tags)`).

Canonical documentation: `docs/system/LEARNING_GRAPH.md`.

### Shipped
- Registry, tag schema, resolver — pure data layer, no React, no app imports
  (enforced by tests).
- ~70 Medicine Through Time concepts + course node; `MEDICINE_TOPICS`
  (th1…th_modern) topic layer; `MEDICINE_SCREEN_TAG_CONCEPTS` bridge from
  legacy `screenTags` to concept ids (no screenTags migration needed).
- Module-level `tags` on all 14 Medicine entries in `src/modules.js`.
- Concept tags appended to every medicine question; June 2023 paper questions
  (`J23_Q*`) and `MEDICINE_2023_PAPER` gained `tags` (previously untagged).
- Course-node stubs for existing Biology/Maths/English bank tags so the
  whole of `ALL_QUESTIONS` validates against the registry.
- `tests/architecture/learning-graph.test.js` — 24 tests: id uniqueness/format,
  registry purity, no escaping imports, resolver behaviour, all tags across
  ALL_QUESTIONS registered, question-id uniqueness, paper tags, screen-tag
  bridge validity.

### Remaining work
- Build Biology concept atoms when the Biology graph is designed (replace
  `topic:` facets in biology banks with concept tags).
- Point consumers at the graph: `selectQuestions.js` (F2 adaptive selection),
  planner, weak-spot repair, analytics.
- Extend tagging to non-Medicine History series (USA, Elizabethan, Spain) as
  their question banks are built.

### Rules
- A concept exists once, in the registry — content references ids, never
  re-spellings. New spellings fail architecture tests.
- `learningGraph/` stays a pure leaf: no React, storage, or app imports.
- No speculative concepts for undesigned subjects.

---

## A6 — Learner Mastery Engine

**Status:** Phase 2 record layer + Phase 3A first consumer (QuickFire, write-only) shipped
**Priority:** High
**Area:** `src/data/masteryEngine/`, `tests/architecture/mastery-engine.test.js`, `tests/unit/masteryEngine/`, `docs/system/MASTERY_ENGINE.md`

### Context
The learning graph (A5) describes the curriculum; the mastery engine describes
one learner's understanding of it. It is the single source of truth for "what
does the learner know?" that QuickFire, Weak Spot Recovery, the Daily Planner,
Pulse, the AI Tutor, Exam Practice, the Parent Dashboard and Analytics will
all consume — replacing per-feature bespoke scores.

Canonical documentation: `docs/system/MASTERY_ENGINE.md`.

### Shipped (Phase 2)
- Pure logic layer at `src/data/masteryEngine/` mirroring the learningGraph
  leaf pattern: `masteryModel.js` (versioned evidence state), `evidence.js`
  (`recordAttempt`/`recordCorrect`/`recordIncorrect`/`mergeEvidence`, all
  immutable), `masteryScore.js` (`calculateMastery`/`calculateConfidence`/
  `calculateStrength`/`getConceptMastery` — derived at read time, never
  stored), `insights.js` (`identifyWeakConcepts`/`identifyStrongConcepts`/
  `identifyNeglectedConcepts`, deterministic ordering), `masteryStore.js`
  (the only impure file; persists via `src/lib/storage.js`, key
  `gcse_mastery_v1`).
- Evidence-not-percentages model: lifetime counters, streak, timestamps, and
  a bounded timestamped recent-results window per concept — decay-ready
  without migration (`MASTERY_STATE_VERSION`).
- Concept ids validated against the learning graph registry; unknown ids
  throw on read and write.
- `tests/architecture/mastery-engine.test.js` — purity (no React/app/feature
  imports, no direct storage outside `masteryStore.js`), registry coupling,
  immutability, public API surface, and a no-consumers-yet guard.
- `tests/unit/masteryEngine/masteryEngine.test.js` — 34 tests: evidence
  accumulation, streaks, window bounds, mastery/confidence behaviour
  (monotonic under success/failure, recency-weighted), strength bands,
  weak/strong/neglected ordering, merge semantics.

### Shipped (Phase 3A — first consumer, QuickFire, write-only)
- `src/features/quickfire/logic/masteryRecorder.js`: resolves effective tags
  (topic layer → question layer), keeps only registry-claimed concept-namespace
  ids (course nodes included — biology/maths/english banks only carry
  course-node concepts today), records via the engine's public API, persists
  load → record → save. Unregistered ids in a concept namespace pass through
  so the engine's validation throws — never silently dropped; untagged
  questions (chemistry placeholders, 90s-quiz conversions) no-op without
  touching storage.
- Wired at the two existing binary marking points only: `QuickFireMode.jsx`
  `onAnswer` and `TopicPracticeMode.jsx` MC check (every checked attempt,
  including a retried first wrong try). `ExamMode.jsx` and selection
  (`selectQuestions.js`) untouched; write-only — nothing reads mastery back.
- AI-graded written answers in TopicPractice are NOT recorded — no binary
  verdict exists; needs the partial-credit evidence extension first.
- Guard test converted to a per-phase consumer allowlist
  (`AUTHORISED_CONSUMERS` in `tests/architecture/mastery-engine.test.js`);
  `tests/unit/quickfire/masteryRecorder.test.js` covers resolution, evidence
  accumulation, facet exclusion, unknown-id throw, and persistence.

### Remaining work (future phases — each needs explicit sign-off)
- Record evidence from AI-graded written answers once a partial-credit
  evidence shape exists (see MASTERY_ENGINE.md extension seams).
- Point insight consumers (planner, weak-spot repair, QuickFire, analytics)
  at `identifyWeakConcepts`/`identifyStrongConcepts`/`identifyNeglectedConcepts`.
- Adaptive question selection (feature backlog F2) reads mastery snapshots —
  selection logic stays out of the engine.
- Memory decay, response-time/confidence-button evidence, AI-marking sources,
  spaced repetition — extension seams documented in `MASTERY_ENGINE.md`.
- Decide the convergence story with `unifiedWeaknessTracker.js` (behavioural
  misconception log) — deliberate phase, not a casual merge.

### Rules
- The engine stays a pure leaf: no React, no UI, no app imports;
  `masteryStore.js` is the only file allowed to touch persistence, via
  `src/lib/storage.js`.
- Mastery/confidence/strength are derived, never persisted.
- Concept vocabulary comes from the learning graph registry only.
- No consumer wiring without an explicit user request in that session.

---

## A7 — Classify and (selectively) migrate `GENERAL.success`/`GENERAL.error` to canonical feedback tokens

**Status:** Resolved
**Priority:** Medium
**Area:** `src/constants/generalTheme.js`, `src/features/quickfire/` (current call sites), any other `GENERAL.success`/`GENERAL.error` call site found at audit time

### Context
A prior session added canonical answer-feedback tokens to `GENERAL` in `src/constants/generalTheme.js` — `feedbackCorrect` (`#4CAF7D`), `feedbackIncorrect` (`#E05A52`), `feedbackHint`, `feedbackText` — and migrated `AnswerInteraction.jsx` and `UnifiedQuestionScreen.jsx` onto them. `GENERAL.success` (`#4DFF88`) and `GENERAL.error` (`#FF5D73`)/`successSoft`/`errorSoft` were deliberately left untouched at the time: they have call sites outside the answer-feedback surface, and a blind rename risks conflating "this answer was correct" with "this system operation failed."

As of this entry, `GENERAL.success`/`GENERAL.error`/`successSoft`/`errorSoft` have 11 call sites, all inside `src/features/quickfire/` (`QuickFire.jsx`, `utils.js`, `modes/MathsQuestion.jsx`). Separately — and out of scope for this item — the raw hex literals these tokens encode (`#4DFF88`, `#FF5D73`, etc.) are hardcoded directly (not via `GENERAL`) in many more places (`ModulePlayer.jsx`, several `src/content/**` and `src/data/**` question-bank files). That's a distinct, larger cleanup; do not fold it into this item.

First-pass read of the 11 known call sites (not a finished classification — confirm at pickup time):
- `QuickFire.jsx:344` and `MathsQuestion.jsx:217` — inline `error &&` API/system error message → looks like **category 2** (system success/error state)
- `QuickFire.jsx:356-357` and `MathsQuestion.jsx:233,236,245,248` — AI-marked feedback "✓ What you got right" / "→ Next time, also include" → looks like **category 1** (answer feedback/marking state)
- `utils.js:6-9` — grade-band styling map (`Excellent`/`Good`/`Needs Work`) → looks like **category 1**, but confirm — this may be a distinct "performance band" concept rather than binary correct/incorrect, in which case it's **category 4**

### Work (remaining)
1. Re-run `grep -rn "GENERAL\.success\|GENERAL\.error\|GENERAL\.successSoft\|GENERAL\.errorSoft" src` at pickup time (call sites may have shifted) and classify every match into one of:
   - **1. Answer feedback / marking state** — migrate to `feedbackCorrect`/`feedbackIncorrect`/`feedbackHint`/`feedbackText`.
   - **2. System success/error state** (API failures, save/load errors, network state) — keep on `GENERAL.success`/`GENERAL.error`; rename only if the current names are actively misleading.
   - **3. Decorative or subject-specific visual** — leave alone; do not touch under this backlog item.
   - **4. Legacy/unclear usage requiring product judgement** — flag for a human decision, do not guess or infer from colour distance.
2. Migrate only category 1 call sites to the feedback tokens.
3. For categories 2-4, leave the token values as-is. Consider renaming `GENERAL.success`/`GENERAL.error` to something more explicit (e.g. `systemSuccess`/`systemError`) only if it measurably reduces future confusion — not required.
4. Once the audit confirms `GENERAL.success`/`GENERAL.error` still serve a genuine non-learning-system role, update the comment above them in `src/constants/generalTheme.js` (and `docs/system/PRODUCT_UI_CONSTITUTION.md` if relevant) to say so explicitly, so future sessions don't mistake them for unmigrated feedback-token debt.
5. Do not touch the larger set of raw hex literals (`#4DFF88`, `#FF5D73`, etc.) outside actual `GENERAL.success`/`GENERAL.error` call sites in this pass — that is separate, larger, content-adjacent work.

### Rules
- Do not bulk-replace `GENERAL.success`/`GENERAL.error` with feedback tokens without classifying each call site first.
- Do not rename or remove `GENERAL.success`/`GENERAL.error` while any call site still depends on their current meaning.
- Do not expand this item into the raw-hex-literal migration (`ModulePlayer.jsx`, content/question-bank files) — that's separate, larger work.
- Preserve visual output for every call site not explicitly re-classified as answer feedback.

### Acceptance criteria
- Every current `GENERAL.success`/`GENERAL.error`/`successSoft`/`errorSoft` call site has an explicit recorded category (1-4), not a silent migration.
- Category 1 call sites use `feedbackCorrect`/`feedbackIncorrect`/`feedbackHint`/`feedbackText`.
- Categories 2-4 either keep their current token or get a deliberate, documented rename — never a silent value change.
- Docs state plainly what `GENERAL.success`/`GENERAL.error` are for once this audit lands.

### Outcome — audit complete

The first-pass guesses above were re-run against current `main` and **partly
corrected**. Actual count was **18 occurrences across 6 files**, not 11 across 3 —
the earlier note missed `ComponentReviewLab.jsx`, `QuoteAnalyser.jsx` and
`GuidedExamResponse.jsx`, and counted lines rather than occurrences.

| # | File | Occurrences | Cat | Rendered purpose | Action |
|---|---|---|---|---|---|
| 1 | `modes/MathsQuestion.jsx:233,236` | 2 × `success` | **1** | "✓ What you got right" — AI marking verdict | → `feedbackCorrect` |
| 2 | `modes/MathsQuestion.jsx:245,248` | 2 × `error` | **1** | "→ Next time, also include" — AI marking verdict | → `feedbackIncorrect` |
| 3 | `QuickFire.jsx:358` | 2 × `success` | **1** | same block inside `ChemistryTopicView` | → `feedbackCorrect` |
| 4 | `QuickFire.jsx:359` | 2 × `error` | **1** | same block inside `ChemistryTopicView` | → `feedbackIncorrect` |
| 5 | `modes/MathsQuestion.jsx:217` | 1 × `error` | **2** | inline strip: submit validation ("Pick an option first") + "Could not reach the grading server" | retained |
| 6 | `QuickFire.jsx:346` | 1 × `error` | **2** | same validation / grading-server strip | retained |
| 7 | `utils.js:6,7,9` | 1 × `success`, 2 × `successSoft`, 2 × `error` | **3** | `GRADE_COLOURS` — Excellent / Good / Developing / Needs Work | retained |
| 8 | `ComponentReviewLab.jsx:67,411` | 2 × `error` | **2** | dev-only lab: "unused" status chip + render error boundary. Not a learner surface | retained |
| 9 | `QuoteAnalyser.jsx:578` | 1 × `errorSoft` | **2** | `checkError` — request timeout / API failure, not the interpretation verdict | retained |
| 10 | `GuidedExamResponse.jsx:555,556` | 1 × `error`, 1 × `errorSoft` | **2** | "Marking failed — your response hasn't been lost." The request failed; no verdict was produced | retained |

**No Category 4.** Every call site was classifiable from its rendered purpose.

**Category 3 decision:** performance bands are retained on the system tokens and
documented as a deliberately distinct third concept. A band summarises how well a
whole answer scored — neither binary answer feedback nor system state. No new
token family was invented, per the rule against speculative tokens.

**Rename decision:** `GENERAL.success`/`error` were **not** renamed. A rename was
optional, and Category 3 means they are not used *solely* for system state, so the
precondition for a safe mechanical rename is not met.

Migrated (Category 1 only): 8 occurrences, 2 files. `#4DFF88` → `#4CAF7D`,
`#FF5D73` → `#E05A52`. Container backgrounds (`#151720` / `#1E2A40`) were not
touched, so only the text and glyph colour changes; both stay above WCAG AA on
that surface (correct 6.58:1, incorrect 4.90:1). No copy, interaction or answer
logic changed.

**Honest limitation on visual verification.** Both Category 1 blocks sit in code
that is **currently unreachable in the running app**. `TestTab` is only ever
mounted as `mode="quickfire"` (with `autoStart`, which goes straight to
`QuickFireMode`) or `mode="exam"` (which returns `ExamMode`), so the
`EXAM_SUBJECTS` landing that opens `MathsBrowser` → `MathsTopicView` →
`MathsQuestion` and `ChemistryBrowser` → `ChemistryTopicView` never renders. When
that landing was temporarily mounted to verify, `MathsBrowser` threw
`Cannot read properties of undefined (reading 'reduce')` — it reads
`MATHS_TOPIC_GROUPS` from `useTestData()`, and `TestDataProvider` only wraps the
Exams tab. So these panels cannot render today even when reached. The live
marking surface a learner actually hits is `ExamQuestionFrame.jsx` ("POINTS TO
ADD"), which never used the legacy tokens; `TopicPracticeMode.jsx` renders a
similar block already on `GENERAL.teal`/`slate`. The migration is still correct
and is guarded by tests, but no 390px screenshot of those two panels is
obtainable without routing work that was explicitly out of scope. Routing/repair
of these components remains open under A1.

**Guard added:** `tests/architecture/feedback-token-governance.test.js` —
an explicit per-file census of every reviewed legacy-token usage (exact
occurrence counts + the classification that justifies each), plus block-level
assertions that the `feedback.achieved` / `feedback.missed` regions avoid
system-status tokens. Deliberately **not** a repo-wide ban: Categories 2 and 3
stay legal at their reviewed counts. Mutation-verified — reverting
QuickFire's "What you got right" to `GENERAL.success` fails 2 tests; adding an
unclassified `GENERAL.error` to `Home.jsx` fails the census test. Both reverted.

**Not resolved by this item:** the larger raw-hex cleanup (`#4DFF88`, `#FF5D73`
etc. hardcoded outside `GENERAL.*` call sites in `src/content/**`, `src/data/**`).
Still open and still explicitly out of scope — see the rule above.

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

**Status:** Resolved  
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

**Final slice (`cream` decision + `SubjectSection`) — closed.**

Two items above were recorded as outstanding but had in fact already landed by the
time this entry was audited. Corrected against the code, not against the notes:

- **`cream` was resolved by collapse, not by per-subject migration.** The design
  review came down on the "collapse to a light neutral" side: the active timeline
  node's text colour is now `GENERAL.softWhite` (`Subjects.jsx:414`) for every
  subject, and `SUBJECT_BROWSER_PENDING_CREAM` is gone. The former per-subject
  cream values are **not recoverable** — this repository's history begins at a
  single root commit (`5bdb10e`) that adds `Subjects.jsx` whole, and no blob in
  any ref contains `SUBJECT_BROWSER_PENDING_CREAM`. Reintroducing subject-tinted
  active-node text is therefore a **design change requiring new colour choices**,
  not an ownership refactor. Guarded by the
  `Subjects.jsx does not regrow a cream/subject-tinted timeline-node token`
  block, which forbids both the old local map and a new `subjectBrowserCream`
  field in `constants/subjects.js`.
- **`SubjectSection` was already deleted.** Full-repo search (`rg SubjectSection`
  across all tracked files, plus a scan of every commit reachable from all refs)
  returns only this backlog entry — zero definitions, zero call sites. The two
  live top-level components in `Subjects.jsx` are `SubjectBrowser` and
  `SubjectsTab`, and nothing else.

Guards hardened in this pass (`tests/architecture/app-boundaries.test.js`):

- `SubjectSection` added to the dead-code regression list alongside `ModulePage`
  and `HistoryMedicineBrowser`, now table-driven.
- New assertion that `Subjects.jsx` declares **exactly** `SubjectBrowser` and
  `SubjectsTab` at top level — catches a fourth dead component, not just the
  three known names.
- New field-presence assertion: every subject listed in the browser's own
  `SUBJECT_DISPLAY_TITLES` must own both `subjectBrowserAccent` and
  `subjectBrowserAccentDark` in `SUBJECTS`, so no subject silently falls through
  to the History fallback. Driven off the browser's list so adding a subject
  there without the fields fails here.
- Mutation-verified: deleting `Biology.subjectBrowserAccentDark` fails the
  field-presence test; re-adding a `function SubjectSection(` stub fails two
  tests. Both reverted.

Rendered output confirmed unchanged at 390px for History, Biology, English and
Maths — active node `rgb(241,250,238)` (`#F1FAEE`, `GENERAL.softWhite`) on all
four; progress-ring stroke exactly each subject's `subjectBrowserAccent`
(History `#C89B6D`, Biology `#4CAF7D`, English `#B96F78`, Maths `#2DD4BF`);
future nodes `rgba(accent,0.55)`; no horizontal overflow; no console errors.

**Status: Resolved.** No local Subject Browser palette remains, both surviving
roles are canonical in `SUBJECTS`, the dead functions are gone, and ownership +
dead-code regression are both guarded.

### Work (remaining — tracked separately, NOT part of A3)
- Move shared dark/surface roles to the planned `GENERAL.background.*` tokens from brand backlog B9 where appropriate (separate from this slice).
- Once `QuickFire.jsx`'s unrelated reuse of these same hex values is addressed (separately, out of scope here), revisit adding `subjectBrowserAccent`/`subjectBrowserAccentDark` to the colour-token governance migrated list. Deliberately not added now: guarding raw-hex uniqueness repo-wide would fail on legitimate other-role uses of the same literals. A3 guards **ownership and field presence**, not colour uniqueness.

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

---

## A8 — Component Review Lab spec drift + verification findings (2026-07-19)

**Status:** Backlog
**Priority:** Low
**Area:** `docs/superpowers/specs/2026-07-13-component-review-lab-design.md`, `src/App.jsx`, `src/dev/componentReview/`

### Context
Findings from the verified build of the lab's "Buttons and progress" reference
page (commit e9f844f): `vite build`, full architecture suite, and a Playwright
walkthrough at 390px all passed; these observations came out of that session.

### Findings

1. **Spec drift — lab access model.** The 2026-07-13 lab design spec still
   says the lab is DEV-only (`import.meta.env.DEV` gate, "the lab chunk is
   not emitted" in production). `src/App.jsx` has since deliberately changed:
   the lab ships in every build, reachable via `?componentReview=true` or the
   "Component review lab" card in the History browser, as its own lazy chunk
   (`ComponentReviewLab-*.js`, ~88 kB / 26 kB gzip in `dist/`). The behaviour
   is intentional (owner-facing, lazy-loaded, `devreview` storage scope), but
   the spec should be updated or an addendum added so the doc and code agree.
   Every new lab page (including "Buttons and progress") grows this
   production-reachable chunk — fine while it stays lazy, worth remembering.

2. **Google Fonts fail closed in proxied/offline environments.** Manrope and
   Sora load from Google Fonts via `index.html`; in a network-restricted dev
   environment every page load logs two `ERR_CONNECTION_RESET` console errors
   and falls back to system fonts. Harmless in production, but self-hosting
   the two font families would remove the external dependency and the noise.

3. **Note — CinematicContinueCTA in-flow rendering.** The reference page
   renders CinematicContinueCTA with `style={{ position: 'static' }}` (a
   permitted layout-only override) so the normally screen-fixed CTA sits in
   the gallery flow. Recorded here as a known sanctioned use of the override,
   not a task.

### Acceptance criteria
- Lab spec updated (or addendum added) to match the actual production-access
  model in `src/App.jsx`.
- Decision recorded on self-hosting Manrope/Sora vs keeping Google Fonts.

---

## A9 — AreaPerimeterExplore story suite: 8 failures from ambiguous `getByText`

**Status:** Backlog
**Priority:** Medium — the suite is red on `main`, so every unrelated change has
to re-prove it was already failing
**Area:** `src/components/learning/AreaPerimeterExplore.stories.jsx`

### Context
`vitest run --project storybook` fails 8 of 19 `AreaPerimeterExplore` stories on
`main`. Confirmed pre-existing and unrelated to the CalculationBreakdown algebra
presentations work (96dc82f) by stashing that change and re-running: same file,
same 8 failures, same count.

Failing stories: Rectangle Area, Rectangle Square State, Rectangle Compare,
Fixed Perimeter, Triangle Area, Triangle Perpendicular Height, Parallelogram
Area, Trapezium Area.

### Root cause (established, not assumed)
Every failure is the same error — `Found multiple elements with the text: …` —
on an `Area = … cm²` / `Perimeter … — area … cm²` status string.

`AreaPerimeterExplore.jsx:373` renders a screen-reader-only
`aria-live="polite"` announcement region (`data-ap-status-announcement`) whose
text duplicates the visible status (`data-ap-status-heading`,
`data-ap-status-calculation`, `data-ap-status-explanation`). The stories query
with `canvas.getByText('Area = 30 cm²')`, which throws when more than one node
matches.

**The component is correct.** The live region is the accessibility behaviour we
want and must not be removed to make the tests pass. This is a test-authoring
problem: the assertions were written before the announcement region existed and
were never updated.

### Fix
Roughly 8 one-line changes in the story file. Either:

- scope the query to the visible node —
  `within(canvasElement.querySelector('[data-ap-status-heading]')).getByText(…)`,
  which also asserts the value landed in the right place; or
- assert presence rather than uniqueness with `getAllByText(…)[0]`.

The first is preferable: it keeps the assertion specific about *which* element
carries the value. `CalculationBreakdown.stories.jsx` uses the second form (an
`expectText` helper) for the same reason and can be aligned either way.

Do not "fix" this by deleting the live region, by removing `aria-live`, or by
making the announcement text differ from the visible text purely to dodge the
matcher.

### Acceptance criteria
- `vitest run --project storybook` passes with 0 failures.
- `AreaPerimeterExplore.jsx` is unchanged — no accessibility behaviour removed.
- A short note in the story file explaining why status queries are scoped, so
  the next person adding a story does not reintroduce the ambiguity.

---

## A10 — Completion hand-off does not check module availability

**Status:** Resolved — Phase 4 (2026-08-01)
**Priority:** Medium
**Area:** `src/app/chapterNavigation.js`, `src/data/modules.js`, `docs/system/CONTENT_HIERARCHY.md`

### The former failure (kept for history)
`buildChapterCompletePayload` resolves "what comes next" by walking the parent
module's `chapterIds`, then falling through to `MODULES[moduleIdx + 1]` and
offering that module's first chapter. Neither step consults
`getChapterAvailability`, so a learner finishing the last chapter of a module
can be handed a `comingSoon` stub they cannot open.

The current mitigation is positional: modules whose chapters are all unbuilt
stubs are parked at the end of the `MODULES` array, with a comment saying so.
That works today and was deliberately preserved through the Phase 2B/2C
hierarchy work, but it encodes build status in array position — a property that
belongs to `availability`, not to ordering.

### Why it matters
- Module array order is meant to be curriculum sequence, not a build-status
  proxy. Anyone reordering modules for curriculum reasons can silently
  reintroduce the dead-end hand-off.
- The rule cannot be stated as authoring guidance without contradicting the
  hierarchy contract, so `CONTENT_HIERARCHY.md` records it as a known gap
  rather than a rule.

### Fix
Filter on availability where the hand-off is computed: skip chapters and
modules with no `available` chapter when choosing the next destination, and
treat "no available successor" as the end-of-subject case that already exists.
Once that lands, module array position carries no build-status meaning and the
"unbuilt modules last" comment in `src/data/modules.js` can go.

### Acceptance criteria
- Finishing the last chapter of a module never offers a chapter that
  `isChapterAvailable` rejects.
- `MODULES` can be reordered on curriculum grounds without changing whether the
  hand-off is reachable.
- The known-gap section in `docs/system/CONTENT_HIERARCHY.md` is removed in the
  same change.

### Resolution — Phase 4
All three acceptance criteria met.

`src/app/chapterNavigation.js` gained `resolveNextAvailableChapter(completedChapter,
{ modules, chapters })`: it skips coming-soon, hidden and missing chapters inside
the parent module rather than stopping at the first one, then scans later modules
in `MODULES` order for the first available chapter, and only ever returns a
chapter whose `subject` matches the completed chapter's. `buildChapterCompletePayload`
now consumes it — including dropping the old `CHAPTERS[idx + 1]` fallback for
chapters with no parent module, which was the widest cross-subject leak. No
available successor returns the existing end-of-journey payload
(`isFinalChapter: true`, `completionType: 'subject'`), which
`ChapterCompleteScreen` already renders without a next-chapter card.

Live behaviour corrected: finishing `math8` offered the first Biology chapter and
now ends the Maths journey; finishing the Western Front offered the unbuilt
`spain-new-world-1` stub and now ends the History journey; finishing
`sci_bio_w1` offered the English Macbeth chapter and now ends the Biology
journey. Mid-module skipping is live too — `history-medicine-surgery-revolution`
hands off past the coming-soon Nightingale chapter to
`history-medicine-accidental-miracle`.

The positional mitigation is gone: the "all-stub modules last" comment was
removed from `src/data/modules.js` with no reordering, and
`docs/system/CONTENT_HIERARCHY.md` now states the durable rule — *completion
hand-off stays within the current subject and only targets an available chapter*
— instead of recording a known gap.

Covered by 13 tests in `tests/unit/app/chapterNavigation.test.js` (fixture
edge cases plus real-catalogue checks). Mutation-verified: deleting the
availability filter fails 7 of them, deleting the same-subject filter fails 5.

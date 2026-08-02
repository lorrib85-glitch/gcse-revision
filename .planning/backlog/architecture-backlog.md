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

**Phase 6 follow-up — why the live census got smaller.** A7 stays resolved; only
its surface shrank. A1 deleted the code both Category 1 blocks lived in: the
`ChemistryTopicView` inside `QuickFire.jsx` and `modes/MathsQuestion.jsx` were
part of the obsolete subject-selection landing, which A7 had already documented
as unreachable. Their census entries were removed rather than zeroed — a
zero-value allowance would licence the legacy tokens back into files that no
longer use them. The Category 2 and Category 3 entries (`utils.js`,
`ComponentReviewLab.jsx`, `QuoteAnalyser.jsx`, `GuidedExamResponse.jsx`) are
untouched at their reviewed counts, and a brand-new unclassified usage anywhere
in `src/` still fails the census. The semantic half of the guard became a
repo-wide scan of the two Category 1 labels rather than a two-file allowlist, so
it survives file deletion; it asserts the ban (never a system-status token) and
not a specific token, because `TopicPracticeMode.jsx` renders the same labels on
`GENERAL.teal`/`slate` — non-system, and re-tinting it is a colour decision
outside A1's structural scope. The A7 limitation about being unable to screenshot
those two panels is now moot: the panels no longer exist.

---

## A1 — Finish QuickFire architecture hardening

**Status:** Resolved (Phase 6)  
**Priority:** Medium  
**Area:** `src/features/quickfire/`, `tests/architecture/`

### Context
QuickFire was reduced from a large monolith into separate mode/components/data layers across Phases 1.5–1.8. That staged extraction stands and is preserved:

- `QuickFire.jsx` reduced from 3406 lines to ~621 lines.
- `QuickFireMode.jsx` extracted.
- `TopicPracticeMode.jsx` extracted.
- Maths browser/question modes extracted.
- `ExamMode.jsx` extracted.
- `TestDataProvider` extracted.
- `FormulaSheet` extracted.
- Question banks moved into `src/data/questionBanks/`.
- Boundary tests added with a then-current `QuickFire.jsx` ceiling of 700 lines.

What that extraction left behind was a broken route rather than a size problem,
which is what Phase 6 closed.

### Resolution (Phase 6)

**Root cause.** `TestTab` destructured the parent `onExit` but forwarded it only
on the exam path. The quickfire path rendered
`<QuickFireMode onExit={() => setQfSessionActive(false)} />` — a local state
setter. Finishing a round therefore flipped local state and fell through to the
old `EXAM_SUBJECTS` subject-selection landing instead of calling
`setTab(quickfireOrigin)`. The learner was stranded on a screen no caller
intends to open, and which could not render anyway: its browsers read
`useTestData()`, and `TestDataProvider` deliberately wraps only the Exams tab.
(This is the same unreachability documented under A7's "honest limitation on
visual verification"; A7's finding was correct and is now acted on.)

**Fix.** `QuickFire.jsx` is now a 38-line mode boundary: `mode="quickfire"` →
`QuickFireMode` with the parent `onExit` passed by identity, `mode="exam"` →
`ExamMode`, anything else → `null`. The unsupported default `mode="test"` is
gone. The landing, `EXAM_SUBJECTS`, the inline `EnglishBrowser` /
`EnglishTopicView` / `SociologyBrowser` / `SociologyTopicView` /
`ChemistryBrowser` / `ChemistryTopicView` / `ChemImage`, and all local
open/selected/session state were deleted. `MathsBrowser.jsx`,
`MathsTopicView.jsx` and `MathsQuestion.jsx` were deleted — the landing was
their only consumer chain. `ExamPractice.jsx` now imports `TestDataProvider`
directly from `testDataContext.jsx` instead of through a `QuickFire.jsx`
re-export.

**Durable rule established:** exam question-bank data loads for Exam Mode, not
for QuickFire.

**Guards.** `tests/architecture/quickfire-boundaries.test.js` rewritten: ceiling
80 lines; the eight deleted landing members cannot be redefined; no `useState`,
no `useTestData`, no landing copy in `QuickFire.jsx`; `QuickFireMode` must
receive `onExit` by identity; the three deleted browser files must stay deleted
and stay unimported; `TestDataProvider` must wrap Exam Mode and must not appear
in `LegacyApp.jsx` or `QuickFire.jsx`. `tests/unit/quickfire/exitContract.test.js`
asserts the delegation behaviourally. Mutation-verified — reverting exit to
local state fails 1 architecture + 2 unit tests; re-adding `EnglishBrowser` fails
1; restoring `MathsBrowser.jsx` fails 2; wrapping the quickfire tab in
`TestDataProvider` fails 1. All reverted.

**Bundle.** Main `index` chunk 998.95 kB → 934.78 kB (gzip 254.44 → 239.91 kB).
The five Exam Mode data modules remain separate lazy chunks.

### Retained, not deleted
- `TopicPracticeMode.jsx` — kept by instruction. Its only route was the landing's
  `startTopic`, so it is currently unrouted. Not a defect introduced here; it
  needs a supported caller before it is live again.
- `FormulaSheet.jsx` — kept. Its only two consumers (`MathsBrowser`,
  `MathsQuestion`) were deleted, so it is likewise unrouted.
- `src/data/sociologyGroups.js` and `src/data/chemImages.js` — data files whose
  only readers were the deleted landing. Left in place (this repo already
  documents several group files with no current consumer); noted in `CLAUDE.md`.

### Explicitly not claimed by this closure
Adaptive question selection, new subject banks, future Chemistry design and
mastery-driven recommendations remain open and untouched. A1 was structural
hardening only.

### Guardrail targets
Still the standing targets for future work:

- Feature orchestrator files: max ~500 lines.
- Mode files: max ~500–800 lines unless justified.
- Question-bank files: exempt from line limits, but should export data only.
- No large embedded question banks inside feature components.
- No speculative Chemistry/Physics/Drama/Music module banks before those subjects are designed.

### Acceptance criteria
- ✅ QuickFire exits through the parent navigation contract.
- ✅ The obsolete subject-grid landing is removed.
- ✅ Dead browser fragments are deleted.
- ✅ `QuickFire.jsx` is a thin mode boundary (38 lines, ceiling 80).
- ✅ Tests enforce the final boundary, with mutation evidence.
- ✅ Exam Mode retains lazy-loaded test data.
- ✅ Live QuickFire and Exam flows verified at 390px.
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

## A4 — ChapterPlayer staged extraction

**Status:** **Resolved (2026-08-01)** — navigation, persistence, dead-render removal, the overlay audit, the live gate extraction and the bottom-navigation extraction are all complete. `ChapterPlayer.jsx` is **273 lines** and reads as runtime orchestration; `ScreenRenderer` remains the authored-screen router. See "Phase 8 — closure" below.  
**Priority:** High  
**Area:** `src/components/layout/ChapterPlayer.jsx`, `src/components/layout/chapterPlayer/`, `src/app/chapterNavigation.js`, `tests/unit/chapterPlayer/`, `tests/architecture/chapter-persistence-boundary.test.js`, `tests/architecture/chapter-player-private-family.test.js`

### Naming note (corrected 2026-08-01)
Phases 1–2 of this item were carried out while the runtime was still called
`ModulePlayer.jsx` and its helper file `moduleNavigation.js`. The module →
chapter migration has since renamed both:

| Then | Now |
|------|-----|
| `src/components/layout/ModulePlayer.jsx` | `src/components/layout/ChapterPlayer.jsx` |
| `src/app/moduleNavigation.js` | `src/app/chapterNavigation.js` |
| `tests/unit/modulePlayer/lifecycle.test.js` | `tests/unit/chapterPlayer/lifecycle.test.js` |
| `computeInitialModuleState` / `getModuleGate` / `completeModule` | `computeInitialChapterState` / `getChapterGate` / `completeChapter` |
| `gcse_module_<id>` storage key | `gcse_chapter_<id>` (legacy keys migrate forward in `progress.js`) |

Historical phase notes below keep their original commit records; the paths and
terminology in the "Remaining phases" and status sections are the current ones.

### Context
`ChapterPlayer.jsx` was the main bloat and fragile runtime area after the old
`src/modules/history.js` bloat was resolved by the per-episode migration. At the
start of this item it was ~2423 lines holding chapter lifecycle state,
navigation, gating, persistence, screen routing and rendering. It is **434
lines** today. Most of the reduction came from the separate `ScreenRenderer`
split and from removing three unreachable inline renderers (`HookContent`,
`IntroScreen`, `JumpSheet`); what remains is the bottom-nav shell, the gate and
overlay branches, and the runtime state orchestration.

### Progress
Phase 1 is complete:

- Commit `b743cb3` extracted pure navigation helpers into the navigation helper
  file (then `moduleNavigation.js`):
  - `isFullScreenVideoScreen`
  - `getStageNavigation`
  - `getCurrentStageFromNavigation`
- Added the navigation helper unit suite with 16 tests.
- The runtime file reduced from 2423 to 2393 lines.
- `scrollToTop`, storage helpers, rendering, and lifecycle logic were deliberately left in place.
- `pnpm vitest run tests/architecture` passed 412/412.
- `pnpm vite build` succeeded and the chapter runtime remained its own lazy chunk.

Phase 2 test scaffolding is documented:

- Commit `34b1e3c` added the lifecycle suite with 39 `it.todo()` specs across seven behaviour groups:
  - fresh chapter start
  - resume saved chapter state
  - stale saved screen index reset
  - go/goTo clamping
  - hook/outcomes/recall gating
  - completed-chapter reopening
  - final-screen finish decisions
- These were intentionally `todo` specs rather than assertions because the behaviours lived inside the runtime's function closure and could not be tested in the node-only unit setup without either extraction or new render infrastructure.
- The todo file was a map of behaviours to unlock as pure helpers were extracted, not a substitute for real coverage.

Phase 2 first extraction is complete:

- Commit `7c3c406` added `computeInitialChapterState(chapter, saved)` (then `computeInitialModuleState`).
- The runtime consumes the helper for initial state instead of deriving those values inline.
- Added 17 tests for the helper.
- Converted 20 of the 39 lifecycle todos into real assertions. Remaining: 19.
- The runtime reduced from 2393 to 2387 lines.
- `pnpm vitest run tests/architecture` passed 412/412; `pnpm vite build` succeeded.
- `introDone` is preserved as hardcoded `true`; this is existing behaviour, not a deliberate fix.

Phase 2 clamp extraction is complete:

- Commit `c35d1af` added `clampScreenIndex(index, total)`.
- `go()` and `goTo()` call it while keeping `setScreen`, `setAnimKey`, `scrollToTop`, `recordActivity` and `setJumpOpen` in the runtime.
- Added 6 contract-level tests; converted all 7 go/goTo clamping todos. Remaining: 12.
- The runtime stayed at 2387 lines; this extraction improved testability rather than size.

Phase 2 `resolveFinishAction` extraction is complete:

- Added `resolveFinishAction(chapter, options)`: pure decision for the final-screen finish branch (`showExaminerExplains` / `showExaminer` / `completeChapter`), mirroring `handleFinish`'s exact priority order.
- All side effects stay in the runtime.
- Added 7 contract-level tests; converted all 4 finish-decision todos. Remaining: 8.
- The runtime went from 2387 to 2388 lines (net +1).

Phase 2 `getChapterGate` extraction is complete:

- Commit `6729877` added `getChapterGate(chapter, { hookDone, wylDone, recallDone, navTo })` (then `getModuleGate`): pure decision for which universal-opener gate to render.
- The runtime computes the gate once and switches on `gate.type` at the three former inline-condition sites; all JSX and side effects unchanged.
- Added 8 contract-level tests; converted all 6 gating todos. Remaining: 2 (both completed-chapter reopening/persistence side effects).
- The runtime went from 2388 to 2392 lines (net +4).

Phase 7 persisted-state-shape extraction is complete (2026-08-01):

- **What this phase was:** extraction of the persisted chapter-state *shapes*
  into pure builders, plus deterministic completion persistence. It was **not** a
  storage rewrite — the storage API was already outside the component. Ownership
  is unchanged: `src/progress.js` owns `getChapterState()` / `saveChapterState()`,
  `src/lib/storage.js` remains the only direct `localStorage` boundary, canonical
  keys remain `gcse_chapter_<chapterId>`, and the `gcse_module_*` migration stays
  in `progress.js`. Nothing moved out of `progress.js`.
- Added two pure builders to `src/app/chapterNavigation.js`:
  - `buildChapterProgressState({ screen, hookDone, wylDone, recallDone, introDone, examinerAttempts, completed })`
    — the regular autosave shape. `completed` is passed through, never inferred
    from screen position, so reviewing a finished chapter can lower `screen` while
    staying complete.
  - `buildCompletedChapterState({ total, examinerAttempts })` — the completion
    shape: `screen: total`, every opener flag `true`, `completed: true`, plus the
    attempts the caller supplies. No existing saved object is merged in.
- `ChapterPlayer.jsx` persistence call sites went from **3 to 2**:
  - the autosave effect now saves `buildChapterProgressState(...)`;
  - `completeChapter(attempts = examinerAttempts)` now saves `buildCompletedChapterState(...)`;
  - the Face the Examiner path's interim progress save was **removed** — it was
    overwritten by the completion write on the very next line. It now calls
    `completeChapter(updated)`, so the new attempt is persisted by the completion
    write itself.
- **Determinism, not a learner-facing data-loss bug.** Before this phase the
  examiner completion wrote the completion snapshot with the *pre-attempt*
  closure copy of `examinerAttempts`, and the autosave effect repaired it on the
  next render. No permanent loss was observed at runtime; the correctness simply
  depended on a subsequent render, which it no longer does.
- Converted the **final 2 lifecycle todos** into real assertions. The lifecycle
  suite now has **0 todos**.
- Deleted `tests/unit/chapterPlayer/lifecycle-regression.test.js` — a
  byte-identical duplicate of `lifecycle.test.js` left behind by the module →
  chapter rename (commit `761db69`), carrying the same 2 todos and no unique
  coverage.
- Added `tests/architecture/chapter-persistence-boundary.test.js`: guards that
  ChapterPlayer imports and uses both builders, defines no inline persisted-state
  object literal, keeps `completeChapter(attempts = …)`, touches no
  `localStorage`, and reads/writes only through the `progress.js` API. Four
  mutations verified (drop `completed`; complete with `screen` instead of `total`;
  examiner completion with stale attempts; inline completion literal) — 6, 5, 1
  and 3 failures respectively, all reverted.
- Extended `tests/unit/progressSync/chapterProgressPersistence.test.js` with one
  round-trip test: completion snapshot saved and read back unchanged, a later
  review save lowering `screen` while keeping `completed: true` and the examiner
  attempts, `getChapterPct()` staying 100, and only `gcse_chapter_*` keys written.
- `ChapterPlayer.jsx` went from 1070 to **1076 lines** (net +6: two builder call
  sites, the `attempts` parameter and their comments). As with earlier
  extractions, the win is testability, not size.
- Gates: `pnpm test:architecture` 1330/1330, `pnpm test:unit` 1179/1179 with 0
  todo, `pnpm test:storybook` 285/285, `pnpm lint` 0 errors, `pnpm build` green
  with ChapterPlayer still its own lazy chunk.
- 390px runtime walkthrough on `history-medicine-great-stink` (real, available):
  fresh start → hook and outcomes gates → forward navigation → exit/reopen resume
  → completion → reopen → backward review → exit/reopen. 25/25 checks passed, no
  console errors, no horizontal overflow, no save-failure notice, completion
  hand-off unchanged.

### Known coverage note
`tests/unit/chapterPlayer/lifecycle.test.js` is a migration map: it proves the
formerly blocked behaviours are now covered and defers field-by-field contracts
to `tests/unit/app/chapterNavigation.test.js`. Keep it that way — do not
duplicate every builder case in both files.

### Known gap — the FaceTheExaminer overlay is unreachable from shipped content
No chapter in `src/content/**` currently defines a top-level `chapter.examiner`,
so the `showExaminer` overlay (and therefore the live examiner-attempt append
path) cannot be reached by a learner today. The `faceExaminer` *screen type* that
several chapters do use is routed through `ScreenRenderer` and does not touch
this path. Phase 7's determinism fix is therefore covered by unit and
architecture tests plus a seeded-state runtime walkthrough, not by driving the
overlay. Worth deciding separately whether the overlay should be wired to content
or retired.

### Remaining phases
Persistence / state-machine boundary — **complete**:
- All lifecycle todos are real tests (0 remaining).
- Persisted state shapes are canonical, pure and shared by every save path.
- Direct completion uses the examiner attempts current at completion time.
- Progress-store integration is covered.

Rendering split, part 1 — dead-render removal — **complete (2026-08-01)**:

The slice was planned as "extract `HookContent` and `IntroScreen` into their own
files". The audit that opened it found all three of the named inline renderers
were **unreachable**, so the phase became a deletion rather than an extraction.
No code was moved and no behaviour changed.

- **`JumpSheet` — deleted** (commit `e31f4cc`). `LearningHeader` rendered its
  contents trigger only when `onJumpOpen && screenPos`; `ChapterPlayer` was the
  only caller and always passed `screenPos: null` (`git log -S` finds no other
  value in ChapterPlayer or its `ModulePlayer` predecessor). `jumpOpen` could
  never become true, so `jumpSheetPortal` was `null` at all 27 `ScreenRenderer`
  sites and the 3 in `ChapterPlayer`. Audited against the six-stage rail before
  deleting: both call `goTo(index)`, the rail is live, locked and always visible,
  and the sheet's only distinct offering was per-screen granularity rendered as
  `01`/`02`/`03` rows behind a `{current}/{total}` header button — the numeric
  progress pattern the header deliberately excludes. Reviving it would have meant
  reintroducing that pattern. The orphaned `onJumpOpen` / `screenPos` branch in
  `LearningHeader` went with it, and the component + registry now record that the
  rail is the only chapter-contents navigation and the absent counter is a
  decision, not a gap.
- **`HookContent` + `useHookPhase` — deleted.** Rendered only when
  `!hookDone && chapter.hook && !chapter.hook.statement`. All 29 chapters that
  define `chapter.hook` also define `hook.statement`, so `getChapterGate` returns
  `{ type: 'hook' }` and `ChapterHookScreen` returns before the shell renders —
  0 of 65 chapter content files could reach it. It was also not reusable: it
  hardcoded the van Helmont willow-tree experiment (growing-tree SVG,
  "1648 — Somewhere in Belgium", "+74 kg", "soil: −57g") inside a nominally
  generic component. Its now-dead branches in `handleNext`, `nextLabel` and
  `isFinishBtn` went with it.
- **`IntroScreen` — deleted.** Rendered only when `!introDone && chapter.intro`.
  `computeInitialChapterState` hardcodes `introDone: true` and `setIntroDone(true)`
  was the only setter, so `introDone` was a permanent `true`. `introDone` is now a
  plain constant read from `initial`, **not** React state — it stays in the
  persisted object so the saved shape is byte-identical to what earlier versions
  wrote. `computeInitialChapterState` and `buildChapterProgressState` are unchanged.

`ChapterPlayer.jsx`: **1076 → 434 lines** (−60%). `ScreenRenderer.jsx`: 1278 → 1251.
Lazy chunk: 75.05 kB → 60.28 kB (gzip 21.64 → 18.03 kB).

Rendering split, part 2 — **complete (2026-08-01)**. Ran in two ordered halves:
an audit of every remaining overlay branch, then extraction of the live renderers.

#### Overlay reachability audit

Five branches were audited before anything was moved. All five were dead; none
had a duplicate-free live capability behind it.

| Branch | Could it activate? | Evidence |
|---|---|---|
| `showWeakSpotRecovery` | No | Only ever `setShowWeakSpotRecovery(false)`. Never set true anywhere in `src/`. |
| `detectedWeakSpot` | No | Initialised `null`; its setter was already named `_setDetectedWeakSpot` and never called. The branch required `showWeakSpotRecovery && detectedWeakSpot`. |
| `recoveryQuizId` | No | Only producer was `onFixWeakSpot` **inside** the unreachable `WeakSpotRecovery` branch. |
| `showExaminer` | No | Required a top-level `chapter.examiner`. **0 of 81** content modules and **0 of 60** `chapters.js` rows define one. |
| `showExaminerExplains` | No | Required a top-level `chapter.examinerExplains`. Same result: 0 of 81, 0 of 60. |

`detectWeakSpot()` was an alias — its whole body was `completeChapter()`.

Both examiner features **do** ship, as authored screens routed by
`ScreenRenderer`: `type: 'faceExaminer'` (5 chapters) and
`type: 'examinerExplains'` (7 chapters). Neither touches the removed paths.
So nothing live was deleted — the removal took away a second, unreachable route
to features the authored-screen route already serves.

#### Deleted from `ChapterPlayer.jsx`

`showWeakSpotRecovery`, `detectedWeakSpot` + its unused setter, `recoveryQuizId`,
`showExaminer`, `showExaminerExplains`, `detectWeakSpot()`, all four overlay
render branches, the three `headerVisible` conditions that only referenced those
states, and the imports used solely by them (`WeakSpotRecovery`,
`RecoveryQuizPlayer`, `FaceTheExaminer`, `ExaminerExplainsScreen`,
`findScreenIndexByType`).

**ChapterPlayer's dormant integration was removed; the standalone component
contracts were not retired.** `WeakSpotRecovery.jsx`, `RecoveryQuizPlayer.jsx`,
`FaceTheExaminer.jsx` and `ExaminerExplainsScreen.jsx` all still exist, are still
catalogued, and the two LOCKED ones are still locked. `RecoveryQuizPlayer` now
has **no importer in `src/`** — that is a documented status ("not routed yet is a
status, not a defect"), not a licence to delete it. `WeakSpotRecovery` is still
rendered by the Component Lab. Their Component Lab `usage` strings were corrected
to stop claiming a ChapterPlayer route that no longer exists.

#### `examinerAttempts` — historical-only, deliberately preserved

The dead module-level overlay was its **only** producer; the authored
`faceExaminer` screen has never written attempts, and no other feature writes
them. The field is therefore historical-only — but it was **not** removed:
`computeInitialChapterState` still reads it back and both persisted-state
builders still write it through, so existing saves round-trip byte-identically
and `src/data/chapterProgress.js`'s merge rule keeps working. It is now a plain
constant in the runtime rather than React state (the same treatment `introDone`
received in part 1). Verified at runtime: the persisted object still has exactly
the seven canonical fields, `examinerAttempts` among them.

#### The finish contract

`resolveFinishAction()` was **removed**, not simplified to a constant. With both
module-level gates gone its only remaining behaviour was an unconditional
`{ type: 'completeChapter' }`, and A4's own rule says not to keep a pure helper
that no longer decides anything. `handleFinish()` now calls `completeChapter()`
directly. The history and the reason are recorded as a comment block in
`chapterNavigation.js` where the function used to be, so the removal is not
re-litigated. `completeChapter()` also lost its `attempts` parameter — Phase 7
added it purely so the examiner overlay could pass a freshly appended attempt in,
and there is no such caller any more.

#### Extracted renderers — a new private family

`src/components/layout/chapterPlayer/` — implementation details of ChapterPlayer,
imported by nothing else:

- **`ChapterGateLayer.jsx`** — renders exactly one of `ChapterHookScreen`,
  `ChapterOutcomeScreen`, `QuickRecallScreen`, plus the recall gate's
  `LearningHeader` render callback. It maps an **already-decided** gate type onto
  a component: `getChapterGate()` stays in `ChapterPlayer`, as does every piece of
  lifecycle state and every callback. It holds no state, reads no storage, creates
  no context.
  Contract: `gateType`, `chapter`, `chapterNum`, `headerProps`, `onExit`,
  `onHookContinue`, `onOutcomeBack`, `onOutcomeContinue`, `onRecallBack`,
  `onRecallContinue`.
- **`ChapterBottomNavigation.jsx`** — the fixed bottom shell verbatim: blurred
  backdrop, safe-area padding, 420px inner column, governed `ContinueCTA`, and the
  reserved placeholder height when a screen's component owns progression. It never
  inspects the chapter or its screens and never calls
  `screenHasComponentOwnedContinuation()`.
  Contract: `visible`, `label`, `isFinish`, `subjectAccent`, `onContinue`.

Extraction only — no token migration, no visual refinement, no copy change.
Neither component is authorable: both are absent from `screenRegistry.js`,
`componentFunctions.js` and the Component Lab, and are covered by the smallest
possible exclusion in `component-registry-completeness.test.js` (a single
`FAMILY_INTERNALS` directory entry naming ChapterPlayer as owner — not a
folder-level loophole).

#### Guards added

`tests/architecture/chapter-player-private-family.test.js` (22 tests) proves:
ChapterPlayer imports and renders both extracted components and does not reabsorb
them; the family is imported only by ChapterPlayer; the family holds no state,
persistence or context; the gate layer keeps hook → outcomes → recall order and
uses the three existing opener components; the bottom shell uses `ContinueCTA`
rather than an inline button and keeps the placeholder height; every deleted
overlay state name is absent; no shipped content or `chapters.js` row defines
top-level examiner metadata; and the authored `faceExaminer` / `examinerExplains`
routes are still registered and still routed by `ScreenRenderer`.
`chapter-runtime-contract.test.js` gained a **300-line ceiling** on
`ChapterPlayer.jsx` (actual: 273 — deliberate headroom for comments and
orchestration edits, not for another render path).

Eleven mutations were run and every one failed the guards, then was reverted:
reintroducing `showExaminer`; reintroducing `recoveryQuizId`; adding a top-level
`chapter.examiner` fixture to a shipped episode; disabling ScreenRenderer's
`faceExaminer` route; reordering the gate layer's branches; replacing
`ContinueCTA` with an inline `<button>`; reabsorbing the bottom shell into
ChapterPlayer; importing the private family from a second file; restoring the
`resolveFinishAction` ladder; pushing ChapterPlayer past its line ceiling; and
adding the family to the Component Lab.

#### Result

`ChapterPlayer.jsx`: **434 → 273 lines** (−37%; 2423 → 273, −89% across all of A4).
Lazy chunk: **60.28 kB → 50.21 kB** (gzip **18.03 → 14.95 kB**).

390px runtime walkthrough, 58/58 checks, 0 console errors, 0 horizontal overflow,
0 save-failure notices, re-run three times: gate order and back/continue behaviour
at each gate on `history-medicine-great-stink`; stage rail position and visibility
unchanged at the recall gate; the full bottom-shell spec measured from computed
styles (blur 16px, `rgba(8,9,13,0.92)`, z-index 20, 420px inner width, safe-area
padding, `Finish ✓` label, green gradient, white text, green glow shadow, 56px
placeholder height on a component-owned screen with no duplicate Continue);
authored `examinerExplains` and `faceExaminer` screens rendering and continuing
through `ScreenRenderer` with no module-level overlay appearing; completion firing
once from both a standard final screen and an authored `examinerExplains` final
screen with no loop back; stage jumping, exit and resume.

#### What is left in `ChapterPlayer.jsx`

Lifecycle state, the autosave effect, `go`/`goTo`, `handleFinish`/`completeChapter`,
`handleNext`/`nextLabel`, `headerOnBack`, the header props object, the
`getChapterGate` call, the route-definition decision, the full-layout
`ScreenRenderer` call, the `LearningHeader + ContentShell + ScreenRenderer`
composition, the two delegated renderers, and a 15-line defensive zero-screen
fallback. That fallback is the only remaining inline JSX of any size and does not
justify keeping A4 open.

### Phase 8 — closure

A4 is closed. The closure checklist, item by item:

- navigation helpers extracted — yes (part 1, `chapterNavigation.js`);
- persistence builders extracted — yes (phase 7, both builders, guarded);
- lifecycle todos are real tests — yes, 0 todos remain;
- dead render paths removed — yes (`JumpSheet`, `HookContent`/`useHookPhase`,
  `IntroScreen` in part 1; the four overlay branches in part 2);
- live gate rendering outside ChapterPlayer — yes (`ChapterGateLayer`);
- bottom-navigation JSX outside ChapterPlayer — yes (`ChapterBottomNavigation`);
- ChapterPlayer is primarily runtime orchestration — yes, 273 lines, ceiling 300;
- `ScreenRenderer` remains the authored-screen router — yes, guarded;
- all gates pass — architecture 1361/1361, unit 1173/1173, storybook 285/285,
  lint 0 errors, build green with ChapterPlayer still its own lazy chunk.

Two things are deliberately **not** reasons to keep A4 open: the short defensive
zero-screen fallback, and the fact that ChapterPlayer still contains JSX calls to
child components — that is what orchestration looks like.

Two follow-ups are recorded as separate decisions, not A4 work:

- **`RecoveryQuizPlayer.jsx` now has no importer in `src/`.** Retained
  deliberately (LOCKED, catalogued, a real future capability). Whether the
  weak-spot → recovery pathway should actually be built is a product decision.
- **Real weak-spot detection was never implemented.** `detectWeakSpot()` was a
  stub from the start. Removing the stub does not remove a capability, but it does
  make the absence explicit: there is currently no in-chapter weakness
  intervention, and building one means designing the trigger, not re-wiring these
  components.

### Content findings raised by the dead-render audit — not architecture work
Deleting `IntroScreen` leaves authored data with no renderer. Both items are
content/product decisions and were deliberately left out of the extraction slice.
Phase 8 did **not** act on either — no goals were merged into outcomes and no
retrieval was re-sited:

- **24 chapters author `intro.learningGoals` that never render.** All 24 also
  define `outcomes`, which *do* render through the reachable
  `ChapterOutcomeScreen` ("In this chapter, you'll learn to"). The two lists
  overlap in intent but are not identical in any of the 24 — the goals are a
  redundant second outcomes list, not unique teaching content. Decide whether to
  merge anything worth keeping into `outcomes` and then strip the `intro` blocks.
- **`sci_bio_w1` is the only chapter with an `intro.retrieval` question**, and it
  has never rendered. This is genuinely lost content, and retrieval sits top of the
  learning hierarchy — worth re-siting as a real recall or retrieval screen rather
  than discarding.

### Rules
- Do not combine phases.
- Do not redesign UI during architecture extraction.
- Do not change chapter content shape.
- Do not change storage keys, the saved state shape, or `progress.js` migration semantics.
- Do not move weakness tracking into ChapterPlayer; it is already delegated to child components.
- Keep each extraction test-backed and boring.
- Convert `it.todo()` specs to real assertions as each pure helper is extracted; do not leave todo specs as permanent coverage.

### Acceptance criteria
- ChapterPlayer gradually reduces in size while behaviour remains unchanged.
- Navigation, lifecycle and persisted-state logic is testable outside React.
- Architecture tests and build stay green after each phase.
- ChapterPlayer remains lazy-loaded as its own chunk.
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

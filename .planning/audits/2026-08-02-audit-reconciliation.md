# Audit reconciliation — 2026-08-02 (Phase 10)

**Purpose.** Return to the original repository audit, establish what actually
remains on current `main`, make only safe evidence-backed corrections, and leave
a reliable final risk register.

**This is not a feature phase.** Nothing adaptive, no new routing, no content
changes, no learner-facing work.

**Reconciled against:** `main` @ `bbc8d3d` (before this phase's commit).

---

## 1. The original audit baseline

There is no single original audit file. The baseline is reconstructed from two
sources, both of which are the audit:

1. **`.planning/codebase/CONCERNS.md`** — the mapped audit of **2026-07-09**
   (tech debt, known bugs, security, performance, fragile areas, scaling limits,
   dependencies at risk, missing features, test coverage gaps), plus its
   **2026-07-10 remediation update** recording what was fixed, what was
   inaccurate and what was deferred.
2. **`.planning/backlog/architecture-backlog.md` A1–A10** — the structural
   findings that became Phases 1–9.

`CONCERNS.md` and `.planning/codebase/STRUCTURE.md` both carry a SUPERSEDED
banner for the content hierarchy — correctly, since they predate the
`Subject → Module → Chapter → Screen → Component` migration. Their pre-migration
file names (`src/modules.js`, `ModulePlayer.jsx`, `moduleContentRegistry.js`)
are stale by design, not by neglect.

**Also stale, and not yet banner-marked:** `.planning/ROADMAP.md` and
`.planning/STATE.md` (both 2026-06-22) still name `src/modules.js` and
`src/modules/<subject>.js` as key file locations. Their *phase* content
(content-build roadmap) is still meaningful; their *file map* is not. Logged in
§6, not corrected here — correcting them is a GSD planning-doc refresh, not
audit hygiene.

---

## 2. Current baseline — re-measured, not inherited

Every number below was produced by rerunning the gate on `main` @ `bbc8d3d`.
None is carried over from a previous report.

| | |
|---|---|
| `git status --short` | clean (no output) |
| `git rev-parse HEAD` | `bbc8d3d514c765c8ed2932bb3aaa806de70804c0` |
| branch | `main` |
| `node --version` | `v22.22.2` |
| `pnpm --version` | `10.33.0` |
| install | `pnpm install --frozen-lockfile` — lockfile honoured, no drift |

### Gate results

| Gate | Result | Files | Tests | Time |
|---|---|---|---|---|
| `pnpm test:architecture` | **pass** | 48 | **1386** | 18.2 s cold |
| `pnpm lint` | **pass** | — | **0 errors, 90 warnings** | 9.2 s |
| `pnpm test:unit` | **pass** | 66 | **1222** | 6.5 s |
| `pnpm test:storybook` | **pass** | 31 | **285** | 58.0 s |
| `pnpm build` | **pass** | — | — | 5.4 s |
| `pnpm verify` | **pass** (all five in sequence) | 145 | **2893** | — |

**Todo / skipped: zero.** No `it.todo`, no `it.skip`, no `describe.skip` in any
project. Every one of the 2893 tests actually executes.

### Cold vs warm

Architecture 18.2 s cold → 14.0–14.7 s warm across five reruns. Storybook is the
long pole at 58 s, dominated by browser setup (11.5 s) and real in-browser test
execution (46.5 s) — inherent to running stories in Chromium, not waste.

### Build output — bundle notes

| Chunk | Raw | Gzip | Note |
|---|---|---|---|
| `index-*.js` | 935.51 kB | 240.13 kB | app shell |
| `QuoteAnalyser-*.js` | 557.01 kB | 156.22 kB | lazy |
| `index.esm-*.js` | 515.64 kB | 135.94 kB | Firebase, lazy |
| `ComponentReviewLab-*.js` | **355.43 kB** | **105.73 kB** | lazy, owner-facing — **4× the 88 kB recorded in July** |
| `ChapterPlayer-*.js` | 50.21 kB | 14.95 kB | lazy boundary intact |

Every chapter, every exam question bank and both lazy boundaries
(`ChapterPlayer`, exam data) emit as separate chunks. No boundary regressed.

---

## 3. The audit ledger — every significant original finding

Classifications: **Resolved** · **Partially resolved** · **Still open —
architecture** · **Still open — test reliability** · **Still open —
documentation** · **Future feature, not audit debt** · **Product/content
decision** · **False positive or superseded**.

| # | Finding | Original evidence | Current state | Resolution / evidence | Classification | Remaining action |
|---|---|---|---|---|---|---|
| 1 | Full `pnpm verify` failing | Gate not runnable end to end | All five gates pass in sequence | `e4172a4` "Restore the full pnpm verify gate"; re-run 2026-08-02 | **Resolved** | none |
| 2 | Architecture-test state unreliable | A2 "legacy architecture test failures" | 48 files / 1386 tests, 0 fail, 5/5 stable reruns | A2 marked Resolved; re-verified | **Resolved** | none |
| 3 | Lint errors and warnings | Lint debt | **0 errors**, 90 warnings, fully categorised | §11 census | **Partially resolved** | 90 warnings triaged; only 20 are candidates, none safe to change blind — see §11 |
| 4 | Storybook failures (A9) | 8 `AreaPerimeterExplore` stories red on `main` | 31 files / 285 tests, 0 fail | `e4503c7`; live region intact at `AreaPerimeterExplore.jsx:374–375` | **Resolved** | A9 closed; stale "main is red" wording removed |
| 5 | Content hierarchy / module ownership unclear | A10 + hierarchy migration | Every non-hidden chapter belongs to exactly one module; enforced by tests | `4eabed4`, `761db69`; `docs/system/CONTENT_HIERARCHY.md` | **Resolved** | none |
| 6 | Documentation / catalogue drift | Docs contradicted code | Active doc layer repaired | `b7ab88f` "Make the active documentation layer tell the truth" | **Partially resolved** | Lab spec fixed this phase (A8); ROADMAP/STATE file maps still stale (§6) |
| 7 | Component registry completeness | Registry incomplete | Catalogue complete | `2a66817` | **Resolved** | none |
| 8 | Lock-list governance | Locks had no single source | `docs/components/LOCKED_COMPONENTS.md` canonical; `locked-component-registry.test.js` enforces | `2a66817` | **Resolved** | none |
| 9 | Completion hand-off safety (A10) | Learner handed an unopenable `comingSoon` stub, and across subjects | `resolveNextAvailableChapter` filters availability **and** subject | `8b4a411`; 13 tests, mutation-verified | **Resolved** | none |
| 10 | Subject Browser theme ownership (A3) | Duplicated palette maps in feature files | No local palette remains; `subjects.js` canonical | A3 Resolved; `166d549` | **Resolved** | none |
| 11 | QuickFire route and exit architecture (A1) | Unreachable landing, broken exit | Landing deleted; round returns to launching tab | `3a744ee`; `quickfire-boundaries.test.js` | **Resolved** | none |
| 12 | ChapterPlayer size and lifecycle boundaries (A4) | 2414-line `ModulePlayer` | `ChapterPlayer.jsx` **273 lines**; `ScreenRenderer` owns routing | `e354ad7` (Phase 8) | **Resolved** | none |
| 13 | Question-bank metadata / schema (F1) | No metadata contract | Canonical schema + `question-bank-schema.test.js` | `bbc8d3d` (Phase 9) | **Resolved** | none |
| 14 | Stale or duplicate source pathways | Mixed loader patterns | **13 dead `EPISODE_LOADERS` registries found and deleted this phase** | §7 | **Resolved** | none |
| 15 | Dead / zero-consumer source files | "possible dead files" | Full 380-file census done; 12 categories assigned | §7, §8, backlog **A16** | **Partially resolved** | 13 deleted; the rest retained with a written reason each |
| 16 | Dependency accuracy | Lock/dependency drift | Census complete: **no missing deps**; 1 stale lockfile, 1 unused package | §10, backlog **A11**, **A12** | **Still open — architecture** | Delete `package-lock.json`; remove `prop-types` |
| 17 | Reduced-motion implementation | Unclear ownership | 4 distinct behavioural sources, 3 private duplicates | §12, backlog **A14** | **Still open — architecture** | Consolidate; needs its own phase (behaviour changes) |
| 18 | Test flakiness (coordinate-plane cold start) | Reported cold-start timeout | **Not reproduced** — 11/11 clean runs | §13, backlog **A15** | **Still open — test reliability** | Logged observed-but-unconfirmed; thin timeout headroom recorded |
| 19 | Stale backlog entries | Records disagreed with code | A8, A9 corrected; A11–A17 opened | §14 | **Resolved** | none |
| 20 | Known content metadata anomalies | Numbering, orphaned goals | 4 confirmed with evidence, **nothing changed** | §9 | **Product/content decision** | Owner decision required |

### Explicitly removed from the audit ledger

These are **future features, not unfinished audit remediation**. Their open
status is correct and is not debt:

- **A5** — Canonical Learning Graph expansion
- **A6** — Learner Mastery Engine read consumers (Phase 3B onward)
- **F2** — Adaptive question selection
- **F3** — Question-bank expansion
- **F4** — Personalised daily planner (see A17 — the engine is *parked by
  decision*, not abandoned)
- **F5** — Streak/personalisation moment
- **F6** — Content expansion
- **F7** — Evidence model enhancements

---

## 4. Findings confirmed resolved

Twelve of the twenty ledger rows are fully resolved: rows 1, 2, 4, 5, 7, 8, 9,
10, 11, 12, 13, 14, 19. Each was re-verified against current source or a rerun
gate this phase, not accepted from the record — including A9, where the record
claimed `main` was red and the suite is in fact green.

## 5. Remaining architecture debt

> **Updated by Phase 11 (2026-08-02).** A11, A12 and A17 are closed — see §17.
> The table below is the Phase 10 state, kept as the record of what this audit
> found; the Status column carries the current position.

| Item | Backlog | Size | Status |
|---|---|---|---|
| `package-lock.json` still committed in a pnpm-only repo | **A11** | two lines | **Closed (Phase 11)** — deleted + guarded |
| `prop-types` unused devDependency | **A12** | one command | **Closed (Phase 11)** — direct declaration removed |
| `index.html` requests 5 unused font families | **A13** | needs a grep pass first | Open — active action |
| Three private reduced-motion hooks that seed `false` | **A14** | own phase — changes first-render behaviour | Open — active action |
| No guard keeping the planner single-sourced | **A17** | ~25-line test | **Closed (Phase 11)** — guard landed |

## 6. Remaining documentation corrections

- `.planning/ROADMAP.md` and `.planning/STATE.md` still list `src/modules.js`
  and `src/modules/<subject>.js` as key files. Both predate the chapter
  migration. Their roadmap content is still useful; the file map is wrong.
  **Recommended:** add the same SUPERSEDED banner `CONCERNS.md` and
  `STRUCTURE.md` already carry, via a GSD planning refresh.
- `.planning/codebase/CONCERNS.md` claims `package-lock.json` was removed. It
  was not (**A11**). The claim becomes true the moment A11 lands.
  **Closed in Phase 11:** A11 landed, so the claim is now true. `CONCERNS.md`
  carries a dated verification note rather than a rewrite, and `STACK.md`'s
  removal date was corrected from 2026-07-10 (the standardisation date) to
  2026-08-02 (the actual deletion). Both now describe reality.

## 7. Files deleted this phase — and the proof for each

**Thirteen files, one finding.** All are `src/content/<subject>/<series>/index.js`
modules exporting `EPISODE_LOADERS` / `EPISODE_IDS`.

Proof, applied to every one of the thirteen:

1. **Zero importers.** A census over all 380 non-story `src/` files plus
   `tests/`, `.storybook/`, `scripts/` and root configs — resolving relative,
   `@/`, `src/`, static, dynamic and `require` specifiers — found no importer.
2. **Zero symbol references.** `EPISODE_LOADERS` and `EPISODE_IDS` appear
   nowhere in `src/` or `tests/` outside the deleted files themselves.
3. **They self-document as superseded.** Every file's line 3 reads
   *"App loading is handled by `src/content/moduleContentRegistry.js`."* That
   file was deleted in the chapter migration. They point at a module that no
   longer exists.
4. **Their function is fully served elsewhere.** Every chapter id they listed is
   present in `CHAPTER_CONTENT_LOADERS`
   (`src/content/chapterContentRegistry.js`), which is the canonical registry per
   `CLAUDE.md` and is enforced by `content-registry.test.js`.
5. **No product decision preserves them.** No backlog entry, no doc, no lock
   list, no Component Lab page, no test.

That is Category **E — confirmed obsolete duplicate implementation**, the only
category this phase was permitted to delete.

| Deleted |
|---|
| `src/content/biology/cell-biology/index.js` |
| `src/content/biology/ecology/index.js` |
| `src/content/biology/homeostasis/index.js` |
| `src/content/biology/infection-and-response/index.js` |
| `src/content/biology/inheritance-variation-evolution/index.js` |
| `src/content/biology/organisation/index.js` |
| `src/content/chemistry/atomic-structure/index.js` |
| `src/content/chemistry/chemical-changes/index.js` |
| `src/content/chemistry/chemistry-of-the-atmosphere/index.js` |
| `src/content/chemistry/rates-and-organic/index.js` |
| `src/content/english/macbeth/index.js` |
| `src/content/maths/foundations/index.js` |
| `src/content/sociology/families/index.js` |

**Not deleted, despite being in the same directory tree:**
`src/content/history/medicine/index.js` — it exports `MEDICINE_EPISODES` and is
imported by `tests/architecture/content-registry.test.js`. Category **B —
approved governance path**. It statically imports all 13 episode files, which is
correct for a test and would break lazy loading if app code imported it.

## 8. Retained zero-consumer files — and why

Full register in backlog **A16**. Summary of the protection rules applied:

- **Locked ≠ dead.** `RetrievalFrame.jsx` has zero importers and stays — it is
  LOCKED and catalogued.
- **Component Lab / Storybook-only ≠ dead.** `RecoveryQuizPlayer`,
  `WeakSpotRecovery`, `CalculationBreakdown`, `AngleExplore`,
  `CoordinatePlaneExplore`, `CircuitDiagram`, `NumberLineExplore`,
  `FractionRatioExplore`, `AreaPerimeterExplore`, `CircuitSymbolReference` all
  reach production only through the lab or stories. All retained.
- **Contract-tested ≠ dead.** `TopicPracticeMode.jsx` and `FormulaSheet.jsx` are
  unrouted but held to live contracts by `quickfire-boundaries.test.js`.
  Category C, reported separately from obsolete duplicates as required.
- **Authored curriculum data is never an architecture deletion.**
  `physicsTopics.js`, `mathsQuestions.js`, `sociologyKeyTerms.js`,
  `contentIndex.js`, `sociologyGroups.js`, `chemImages.js`, `mathsGroups.js`,
  `chemistryGroups.js`, `biologyGroups.js` — all zero-consumer, all retained,
  all routed to the content/product backlog.

## 9. Content and metadata anomalies — audited, nothing changed

| Finding | Affected IDs | Rendered effect | Learner-visible? | Kind | Owner | Recommended decision |
|---|---|---|---|---|---|---|
| Duplicate authored chapter number 4 | `history-medicine-harvey-pare-renaissance-method`, `history-medicine-surgery-anaesthetics` — **both `available`** | Two chapters both present as "4" in the Medicine journey | **Yes** | Editorial | Content owner | Renumber one, or drop the authored number in favour of module order |
| Duplicate authored chapter number 3 | `history-medicine-renaissance-medicine` (**hidden**), `history-medicine-vesalius-beginning-doubt` (available) | None — the hidden legacy bundle never renders | **No** | Architectural residue | Content owner | Leave; it disappears when the legacy bundle is retired |
| Duplicate Biology number 2 | `sci_bio_w1`, `bio_building_life` — **both `available`** | Two Biology chapters both present as "2" | **Yes** | Editorial | Content owner | Decide Biology chapter order, then renumber |
| `intro.learningGoals` authored but never rendered | 20+ files across Medicine, Maths, Sociology | Authored teaching content the learner never sees | **No** (that is the problem) | Editorial | Content owner | Render it, or merge into `outcomes` and delete the field |
| Orphaned retrieval question | `sci_bio_w1` `recall.questions[0]` — *"Animal cells have a cell wall as well as a cell membrane"* | An **animal-cell** question opening a chapter titled *"Plant Cells & Photosynthesis"* | **Yes** | Editorial | Content owner | Move to `bio_building_blocks`, where animal cells are taught |
| `sci_bio_w1` has no routable screens | `screenTags` is 9 nulls; `recallTags` is `[]` | Weak-spot recovery cannot target any screen in this chapter | **Yes**, indirectly | Architectural | Content owner | Populate `screenTags` when the chapter is next edited |

**Nothing above was changed.** No chapter renumbered, no learning goals merged,
no retrieval content relocated, no curriculum order altered, no availability
changed — as instructed.

The one dead content file, `episode-05-great-plague.js` (empty stub, zero
references, superseded by `episode-05-great-plague-1665.js`), was **also left in
place** because deleting an episode file is a content decision. See A16.

## 10. Dependency findings

Census over `package.json`, `pnpm-lock.yaml`, `vite.config.js`,
`vitest.config.js`, `vitest.rules.config.js`, `eslint.config.js`,
`.storybook/main.js`, `.github/workflows/`, `vercel.json` and every bare import
specifier in `src/`, `tests/` and `.storybook/`.

**No missing dependencies.** Every bare specifier resolves to a declared
package. **No wrongly scoped dependency.** All four production dependencies
(`react`, `react-dom`, `firebase`, `motion`) are imported from `src/`; every
devDependency is confined to configs, tests, stories or scripts.

| Package | Classification | Action |
|---|---|---|
| `react` (94 src files), `react-dom`, `firebase` (2), `motion` (3) | Correct production dependency | none |
| `vite`, `vitest`, `@vitejs/plugin-react`, `@tailwindcss/vite`, `@vitest/browser-playwright`, `playwright` | Correct dev dependency (config/plugin slots) | none |
| `eslint`, `@eslint/js`, `eslint-plugin-{react,react-hooks,react-refresh,jsx-a11y}`, `globals` | Correct dev dependency (`eslint.config.js`) | none |
| `storybook`, `@storybook/{react-vite,addon-vitest,addon-a11y,addon-docs,addon-mcp}`, `@chromatic-com/storybook` | Correct dev dependency (`.storybook/main.js` addons + `vitest.config.js`) | none |
| `firebase-tools`, `@firebase/rules-unit-testing` | Correct dev dependency (`test:rules` script + rules tests) | none |
| `glob` | Correct dev dependency — 8 test files | none |
| `tailwindcss`, `tailwindcss-animate` | Correct dev dependency — build-time; `tailwindcss-animate` is loaded via `@plugin` in `src/globals.css` | none — **do not** remove on a text search; the reference is a CSS at-rule |
| **`prop-types`** | **Unused dependency** | Remove — **A12** |
| `@vitest/coverage-v8` | **Requires a build decision** | Keep — no config references it, but it is what `vitest --coverage` needs. Removing trades a small install for a broken command |
| **`package-lock.json`** | **Stale artefact** | Delete — **A11**. CI is pnpm-only; `CONCERNS.md` already claims this was done |

**Nothing was upgraded, no Node or Vite version touched, no broad update run,
and no package added to silence a tool.** `prop-types` and `package-lock.json`
were both deferred to the backlog rather than actioned, because Phase 10's
16-file scope was spent on the dead-registry deletion and the audit record —
neither is urgent and both are one-command fixes.

## 11. Lint warning census

**Before: 0 errors, 90 warnings. After: 0 errors, 90 warnings.**

No warning was fixed. That is a deliberate outcome, not an omission — every
candidate failed the fix boundary. Explanation per group:

| Rule | Count | Where | Risk category | Action |
|---|---:|---|---|---|
| `react-refresh/only-export-components` | **41** | `calculationBreakdown/*` (23), `GraphView` (5), `FactorWeb` (6), `ScreenRenderer` (2), `TimelineChainIcons`, `Infographic`, `ExamPrompt`, `reviewManifest` | **3 — architecture/governance signal** | **Leave.** These flag files that export both components and constants. Fixing means splitting files — a refactor, not hygiene. Silencing the rule destroys the signal |
| `no-unused-vars` | **37** | `dailyPlanner.test.js` (**18**), unused component props across 12 components, `areaPerimeterPresets.js`, `episode-01-…runtime.js` | mixed **1 / 3 / 4** | **Leave — see breakdown below** |
| `custom-rules/no-hardcoded-design-tokens` | **8** | `ExamPaperDebrief` (4), `ExamPaperQuestion` (2), `TopicPracticeMode` (2) | **3 — token enforcement** | **Leave.** This rule exists to be noisy. Fixing means editing padding values — a visual change, out of scope. Never silence |
| `react-hooks/exhaustive-deps` | **3** | `Infographic.jsx:94`, `MatchingTask.jsx:138`, `TimelineCanvas.jsx:349` | **2 — React lifecycle semantics** | **Leave — never fix mechanically.** Call sites recorded below |

### Why the 37 `no-unused-vars` were all left

- **18 in `tests/unit/planner/dailyPlanner.test.js`** — destructured imports
  from the *parked* planner engine (`calculateSubjectPriority`,
  `selectWeakPointRepair`, `PAPER_PRACTICE_WEIGHTS`, …). Removing them would
  hide how much of the engine is untested. Category 3, not 1. Resolve when F4
  activates the engine (noted in **A17**).
- **~14 unused component props** — `mode`, `topic`, `beatId` in
  `AnswerInteraction` / `RetrievalFrame`, `chapterNum` in `ChapterHookScreen` /
  `QuickRecallScreen`, `onBack` in `CinematicRevealMoment`, `currentStage` in
  `LearningProgressHeader`, three in `ExamMode`. These are **API surface on
  locked and near-locked components**. Removing a prop from a locked component's
  signature is a contract change. Category 3.
- **~5 genuine Category 1 candidates** — `progress` (`LegacyApp.jsx:317`),
  `isComplete` (`AnswerInteraction.jsx:37`), `bgStyle`
  (`QuickRecallScreen.jsx:31`), `slopeMid` (`areaPerimeterPresets.js:443`),
  `theoryScreenIndex` (`episode-01-…runtime.js:15`). Two sit inside **LOCKED**
  components (`AnswerInteraction`) and one inside a **content file** — both
  barred this phase. The remaining two are single dead locals worth roughly
  nothing against the risk of touching `LegacyApp` and a preset file in an audit
  phase.
- **1 unused `eslint-disable` directive** — `LegacyApp.jsx:407`, the only
  `--fix`-able warning in the repository. Left because it is inside the app
  shell's effect wiring, adjacent to the Category 2 territory this phase must
  not enter.

### Category 2 call sites, recorded for later behavioural work

| File:line | Missing dependency |
|---|---|
| `src/components/learning/Infographic.jsx:94` | `resolvedMedia` |
| `src/components/learning/MatchingTask.jsx:138` | `currentRound` |
| `src/components/learning/TimelineCanvas.jsx:349` | `geometry.centers`, `segments` (`useLayoutEffect`) |

No rule was disabled globally. No blanket `eslint-disable` was added. Zero
warnings was never the target.

## 12. Reduced-motion conclusion

**The repository does not have one canonical behavioural source — it has four.**
Full detail in backlog **A14**.

- **Canonical:** `src/hooks/usePrefersReducedMotion.js`, used by 10 components.
  Seeds from `matchMedia` *and* subscribes.
- **Third-party:** `useReducedMotion` from `motion/react` in `TimelineCanvas`,
  `TimelineChain`, `FactorWeb` — acceptable; those components already own the
  animation library.
- **Private duplicates (3):** `GuidedExamResponse.jsx:66`,
  `CinematicCarousel.jsx:102`, `QuoteAnalyser.jsx:351`.
  `CinematicCarousel`'s is named **identically** to the canonical hook.
- **One-shot reads (~15):** read `.matches` once, never subscribe.

**Nothing was consolidated.** The rule was: consolidate only when two
implementations are behaviourally identical. They are not — the canonical hook
seeds from the media query, the private ones seed `false` and correct in an
effect, which means one rendered frame with motion enabled for a learner who
asked for none. That is a behaviour change, so it belongs in its own phase.

**No CSS was removed.** The ~35 component-scoped
`@media (prefers-reduced-motion: reduce)` blocks plus `src/globals.css:67` are an
independent accessibility fallback that survives slow, failed or disabled JS.

## 13. Coordinate-plane flake — evidence and outcome

**Outcome: observed-but-unconfirmed. Not reproduced. Nothing changed.**

`tests/architecture/coordinate-plane-annotation-contract.test.js`:

- **5 cold runs alone:** 90/90 passed each time. Wall 15.8–16.4 s, in-test
  12.0–12.5 s, variance under 4%.
- **5 runs inside the `architecture` project:** 48 files / 1386 tests passed
  each time, 14.0–14.7 s.
- **Plus the baseline run.** Eleven consecutive clean runs.

**The one measurement worth keeping.** Slowest individual tests:
`rotate > uses only the three permitted tiers` **2229 ms**,
`enlarge > …` 1704 ms, `rotate > declares a tier…` 1176 ms. Vitest's default
`testTimeout` is 5000 ms and this config does not raise it — so the slowest test
sits at ~45% of budget. A runner ~2.2× slower than this container would tip it
over, which is a credible mechanism for the original report.

**No avoidable work was found to remove.** `reachableStates(preset)` is already
built once per preset at collection time inside `describe.each`, not per test.
No fake-timer misuse, no leaked handles, no duplicate imports, no over-broad
setup. The cost is the contract genuinely walking its state space.

The timeout was **not** raised, no assertion deleted, the contract not weakened,
and `CoordinatePlaneExplore.jsx` not touched. A15 records the ordered fix if it
ever actually fails.

## 14. Backlog and documentation corrections made

| File | Change |
|---|---|
| `docs/superpowers/specs/2026-07-13-component-review-lab-design.md` | SUPERSEDED banner on the stale "Access" section + **"Addendum: the shipped access model (2026-08-02)"** — real access model, re-measured 355 kB chunk, fonts decision |
| `.planning/backlog/architecture-backlog.md` | **A8 → Resolved** (both criteria met, stale 88 kB figure corrected). **A9 → Resolved** (stale "main is red" wording removed, root cause preserved). **A11–A17 opened** |

Every closed entry now separates **historical context** (kept — it explains why
the code looks the way it does) from **current status** and **future follow-up**.
No useful history was deleted. A1, A3, A4, A7, A10 were re-read and contain no
active instruction contradicting their Resolved status.

## 15. Backlog separation

**Architecture / test reliability** — A11 (lockfile), A12 (`prop-types`), A13
(fonts), A14 (reduced-motion), A15 (coordinate-plane headroom), A17 (planner
guard).

**Feature / system development** — A5, A6, F2, F3, F4, F5, F6, F7. Unchanged.
None is audit debt.

**Content / product decisions** — the six §9 anomalies, the
`episode-05-great-plague.js` orphan stub, and whether the nine zero-consumer
data files (`sociologyGroups`, `chemImages`, `mathsGroups`, `chemistryGroups`,
`biologyGroups`, `physicsTopics`, `mathsQuestions`, `sociologyKeyTerms`,
`contentIndex`) should be routed to a surface or retired.

## 16. Recommended next phases, in priority order

1. **Dependency and lockfile hygiene** (A11 + A12) — two commands, removes a
   documented-but-false claim. Half a phase.
2. **Planner single-source guard** (A17) — ~25 lines, before F4 starts rather
   than after. Half a phase, pairs naturally with 1.
3. **Content metadata decisions** (§9) — needs the *owner*, not an engineer.
   Two learner-visible duplicate chapter numbers and a Biology chapter opening
   with an animal-cell question are real learner-facing defects. Blocked on a
   decision, not on work.
4. **Reduced-motion consolidation** (A14) — its own phase; changes first-render
   behaviour on three components and needs per-screen verification.
5. **Font request trim** (A13) — small, but needs a real grep pass over
   `font-family` declarations first.
6. **Only then, feature work** — A6 Phase 3B (mastery read consumers) is the
   natural next feature, with F2 behind it.

Items 1 and 2 are the only ones that should precede feature work. Items 4 and 5
can wait indefinitely without risk.

---

## 17. Phase 11 closure note (2026-08-02)

Phase 11 was a small audit-closure phase: the two dependency-hygiene items and
the one recommended guard. No reduced-motion, font, content or feature work.
Started from `main` @ `5690f92` — five unrelated component/layout commits had
landed after Phase 10, and were left untouched. Every Phase 10 finding this
phase relied on was re-confirmed against that tree before anything changed.

**Closed:**

- **A11 — resolved.** `package-lock.json` deleted; `pnpm-lock.yaml` is the only
  root lockfile. `tests/architecture/package-manager-boundary.test.js` now
  enforces the pinned `pnpm@` package manager, the lockfile's presence, the
  absence of npm/Yarn/Bun lockfiles, and pnpm-only CI installs.
- **A12 — resolved, with a precise claim.** The unused *direct* declaration is
  gone (four-line diff: one line of `package.json`, the three-line
  `pnpm-lock.yaml` importer entry). `prop-types` has **not** left the dependency
  graph — `pnpm why` shows it still resolving transitively through
  `eslint-plugin-react@7.37.5`, which was deliberately not touched.
- **A17 — resolved and guarded.** `tests/architecture/planner-boundary.test.js`
  pins the parked-planner decision: no `src/dailyPlanner.js`, no importer or
  barrel re-export of `src/features/planner/dailyPlanner.js` outside
  `src/features/planner/`, and no coupling in either direction with
  `src/todaysPlan.js`. Neither planner source file was edited. F4 must update
  this guard deliberately to activate the engine — the failure message says so.

**Dependency hygiene no longer remains open.** All five guards were
mutation-verified, and every mutation was reverted byte-exact.

### The remaining register, by kind

The Phase 10 "five open items" framing flattened four different kinds of thing.
They are not comparable and should not be counted together:

| Kind | Item | What it actually asks for |
|---|---|---|
| **Active action** | **A14** reduced-motion consolidation | Real work. Its own phase — changes first-render behaviour on three components, needs per-screen verification. **The next audit item.** |
| **Active action** | **A13** font request trim | Small, but needs a real grep pass over `font-family` declarations first. **Follows A14.** |
| **Preventative guard** | A11, A17 guards | Now landed. Nothing to do; they fail if the decision is violated. |
| **Register** | **A16** zero-consumer files | Not a task. A record of what has no importer *and why it stays*, so a future cleanup does not re-derive it. Review only when an owning decision changes. |
| **Observation-only** | **A15** coordinate-plane cold-run headroom | **Not reproduced** (11/11 clean). Logged as observed-but-unconfirmed with the measured headroom. Nothing to fix; do not open work on it without a fresh reproduction. |

Also still open, and unchanged by this phase: the §9 content/metadata anomalies
(owner decision, not engineering), and the ROADMAP/STATE file-map staleness in
§6 (a GSD planning refresh).

---

## 18. Phase 12 closure note (2026-08-02) — A14 reduced-motion

Started from `main` @ `1483d2e` (Phase 11). The Phase 10 census was **re-run
against that tree**, not carried over — and it corrected one of Phase 10's
claims (below).

### Census — before and after

| Mechanism | Before | After | Change |
|---|---:|---:|---|
| Canonical hook (`src/hooks/usePrefersReducedMotion.js`) | 1 | 1 | Strengthened, not replaced |
| Components importing the canonical hook | 10 | 13 | +3 migrated |
| **Private reactive implementations** | **3** | **0** | All removed |
| Third-party `motion/react` `useReducedMotion` | 3 | 3 | Retained, documented as approved |
| One-shot synchronous readers | 15 | 15 | None migrated; all now registered with a reason |
| Files with a `@media (prefers-reduced-motion: reduce)` rule | 36 | 36 | Unchanged |
| Total `@media (prefers-reduced-motion` occurrences | 36 | 36 | Unchanged |
| Architecture guards for reduced-motion | 0 | 1 file / 10 tests | New |

The Phase 10 "about 15" one-shot estimate turned out to be exact: **15**.

### The correction to the Phase 10 finding

Phase 10 recorded three private hooks that "seed to `false`". Two do
(`GuidedExamResponse`, `QuoteAnalyser`). The third, `CinematicCarousel`, already
seeded synchronously from `matchMedia` — its faults were duplicate ownership
under the canonical hook's exact name, and a privately-held legacy `addListener`
fallback. The historical finding is preserved in the backlog; the corrected
evidence sits beside it.

### Private implementations removed

`GuidedExamResponse.useReducedMotion()`, `QuoteAnalyser`'s local
`reducedMotion` state + `matchMedia` effect, and
`CinematicCarousel.usePrefersReducedMotion()`. In the first two, the dependent
entrance state (`beatVisible`; `visibleWords` / `showAttribution` / `showCTA`)
was **also** re-seeded from the preference — swapping the hook alone would have
left a hidden first frame one level down. The carousel's legacy-listener
compatibility moved into the canonical hook rather than being dropped.

### One-shot readers retained / migrated

**Retained: 15. Migrated: 0.** Each governs a one-time event — a mount-scoped
entrance, one celebration, one counter, or a read taken *at the moment* of a
single scroll/focus move (which is therefore always current). Two are
ring-fenced (`MedievalDiagnosisScene`, `CentreImageReveal`): audited, not
altered. Every retained entry carries a written reason in
`APPROVED_ONE_SHOT_READERS`, and the guard fails on a stale entry, a blank
reason, or a new unclassified reader.

### Third-party hooks retained

`TimelineCanvas`, `TimelineChain`, `FactorWeb` — `motion/react`'s
`useReducedMotion`. Reactive and correct on first render. Documented as approved
delegated implementations in `docs/system/MOTION_SYSTEM.md`; the guard
explicitly permits the import.

### Verification

Gate counts measured on both sides — the "before" column is a real run of the
stashed tree at `1483d2e`, not a figure carried over:

| Gate | Before (files / tests) | After (files / tests) |
|---|---|---|
| `test:architecture` | 50 / **1391** | 51 / **1403** |
| `test:unit` | 66 / **1222** | 67 / **1233** |
| `test:storybook` | 31 / **285** | 33 / **301** |
| `lint` | 0 errors, 90 warnings | 0 errors, 90 warnings |
| `build` | pass | pass |

Unit `+11` and Storybook `+16` are exactly the new tests. Architecture is `+12`
for a 10-test file: the two new `.stories.jsx` files also add two cases to an
existing story-iterating architecture test.
- Real-browser run at **390 px** with Playwright `reducedMotion: 'reduce'`
  applied *before* page load: **26/26** checks across GuidedExamResponse,
  QuoteAnalyser and CinematicCarousel in the Component Review Lab — including a
  live preference toggle on a mounted consumer in **both** directions
  (`reduce → no-preference` restores animation, `no-preference → reduce`
  suppresses it) with no duplicate listener and no console error. Zero
  horizontal overflow, zero page errors, no copy or layout change.
- `imageReveal` mode verified separately against a decorator-free story:
  **7/7**, entrance and CTA animations absent under `reduce`, present under
  `no-preference`.
- **8 mutations** each failed the intended test and were reverted byte-exact:
  private hook name, private reactive subscription, unclassified one-shot
  reader, lost legacy `addListener` fallback, lost lazy initialiser, both
  re-seeded hidden first frames, and a carousel that stops importing the
  canonical hook. The first pass of the two seeding mutations *passed* — the
  behavioural tests were then strengthened with a `MutationObserver` that
  records any element painted at `opacity: 0` and corrected afterwards, which
  catches them.

### A14 status

**Resolved.** Preference source is consistent, known from the first render, and
governed. What is deliberately **not** claimed: that all JavaScript motion runs
through one hook — three approved `motion/react` hooks and 15 registered
one-shot reads remain by design.

### Separate decision recorded, not taken

`CinematicCarousel` `mode: 'imageReveal'` still replaces images on a
`revealInterval` timer under reduced motion. Entrance animation is suppressed;
automatic sequencing is not. Redesigning it (static grid / manual carousel /
new Next control) is a component-contract decision and was deliberately left
alone. Logged in A14 as a follow-up product question; it does not block closure,
because A14 is about where the preference comes from and when it is known.

### Next

**A13 — font request cleanup** is now the next original-audit item. A15 remains
observation-only.

---

*Reconciled 2026-08-02 against `main` @ `bbc8d3d`. Every figure in this document
was produced by rerunning the gate, not carried over from a previous report.
Section 17 added 2026-08-02 (Phase 11), verified against `main` @ `5690f92`.
Section 18 added 2026-08-02 (Phase 12), verified against `main` @ `1483d2e`.*

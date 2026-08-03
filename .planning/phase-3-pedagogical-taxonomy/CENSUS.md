# Phase 3 — pedagogical taxonomy census

Starting SHA: `5fd92ff08830d02221d44e68a1561aa3c98b78a7`.
Planning only — no source, taxonomy, content or generated file changed.
All usage counts are runtime truth: every count comes from loading all 60
registered chapters through `CHAPTER_CONTENT_LOADERS`, not from grep.

---

## 1. Confirmed consumer graph

Every direct and transitive consumer of `FUNCTION_TAGS`,
`SCREEN_TYPE_FUNCTIONS`, `getTypeInfo`, `isPassive`, `isAssessed` and
`componentFunctions.js` itself:

| Consumer | Uses | Classification |
|---|---|---|
| `src/dev/componentReview/reviewManifestCore.jsx:13,949` | `getTypeInfo(entry.contentType)?.interaction` — derives the interaction label for every Lab entry that names a `contentType` (35 entries) | **Production-bundled owner tooling.** The Lab is lazy-loaded from `src/App.jsx:12` behind `?componentReview=true` and ships as a real chunk (`ComponentReviewLab-*.js`, ~355 kB). Learners never fetch it, but per the repo's own boundary doctrine it is production source |
| `src/data/contentQualityChecks.js:15` | `getTypeInfo`, `isPassive`, `isAssessed` — passive-run, stage-assessment and exam-prep guardrails | **Build-time despite living under `src/`.** Its only importers are the regression test and the check script below; it is in no production chunk. Traced, not assumed |
| `tests/architecture/content-quality.test.js:2–8` | imports all five exports directly; asserts the nine tags in order, full-map validity, helper agreement, and content coverage | **Architecture test** (the CI regression floor) |
| `scripts/check-content-quality.mjs:12` | transitive via `contentQualityChecks.js` | **Build script** (what `content-review` runs) |
| `tests/architecture/chapter-player-private-family.test.js:99–108` | reads `componentFunctions.js` **as text** and asserts `ChapterGateLayer` / `ChapterBottomNavigation` never appear in it | **Architecture test (text scan, not an import).** Survives the flip as long as the file exists and stays free of those names |
| `docs/components/COMPONENT_REGISTRY.md` (via `scripts/generate-component-catalogue.mjs:79,94`) | names the file as the answer to "which pedagogical function does it serve?" and as the remaining phase boundary | **Generated documentation** — both lines must change in the flip, exactly as Phase 2's seal changed the authoring lines |
| `.claude/skills/content-review/SKILL.md` | names `componentFunctions.js` | **Claude skill/workflow** — wording update at flip |
| `docs/system/CONTENT_BUILD_TEMPLATE.md`, `PATTERN_GOVERNANCE.md`, `00_SYSTEM_INDEX.md`, `docs/decisions/0001-…`, `CLAUDE.md` (boundary paragraph), `src/component-catalogue/schema.js:15` comment, `src/components/layout/chapterPlayer/ChapterGateLayer.jsx:19` comment, `src/component-catalogue/records/chapter-player.js` prose, two `docs/superpowers/plans/` files, `docs/content/history/Medicine/02_Review_Log.md` | prose references | **Prose-only** — the governance surfaces (`CLAUDE.md`, `00_SYSTEM_INDEX.md`, schema comment, generator preamble) update at flip; review logs and plans are historical |

**No learner-runtime consumer exists.** Nothing on the chapter/learner path
imports the taxonomy. The single production-bundle consumer is the Lab chunk.
The runtime-safe projection is therefore required (settled decision 4), but its
bundle cost lands only in chunks that import `componentFunctions.js` — today,
the Lab chunk.

---

## 2. Taxonomy-to-authoring matrix

52 taxonomy entries. Registry status from the generated authoring registry;
usage = number of chapters using the type at that level (runtime-loaded).

### 2a. Screen-level authoring types (23 taxonomy entries)

| type | functions | interaction | screen status | uses | classification |
|---|---|---|---|---|---|
| `cinematic` | hook-tension | passive | active | 2 | active screen |
| `examinerExplains` | exam-technique | passive | active | 7 | active screen |
| `infographic` | teach-mechanism | passive | active | 1 | active screen (content-layer route) |
| `conceptReveal` | teach-mechanism | reveal | active | 7 | active screen |
| `visualLearning` | hook-tension+teach-mechanism | reveal | active | 4 | active screen |
| `keyFigureReveal` | introduce-figure | reveal | active | 4 | active screen |
| `timelineCanvas` | sequence-process | reveal | active | 1 | active screen |
| `beforeAfterSlider` | teach-comparison | reveal | active | 1 | active screen |
| `cinematicCarousel` | teach-mechanism | reveal | active | 0 | registered but unused |
| `quoteAnalyser` | teach-mechanism | reveal | active | 1 | active screen |
| `quickRecall` | retrieve | assessed | active | 8 | active screen |
| `priorKnowledgeRecall` | retrieve | assessed | active | 6 | active screen |
| `naturalSupernaturalSwipe` | classify | assessed | active | 5 | active screen (alias → SwipeSort) |
| `matchingTask` | classify | assessed | active | 6 | active screen |
| `centreImageReveal` | apply | **assessed** | active | 1 | active screen — **stale-claim candidate (§5)** |
| `guidedChoiceCarousel` | apply | **assessed** | active | 3 | active screen — **stale-claim candidate (§5)** |
| `interactiveImage` | teach-mechanism+apply | reveal | active | 5 | active screen (corrected 2026-07-24, documented in source) |
| `orderedRouteTask` | sequence-process | assessed | active | 1 | active screen |
| `factorWeb` | teach-comparison+apply | **assessed** | active | 3 | active screen — **ambiguity (§5)** |
| `faceExaminer` | exam-technique | assessed | active | 5 | active screen |
| `guidedExamResponse` | exam-technique | assessed | active | 4 | active screen |
| `tieredquiz` | retrieve | assessed | active | 0 | active screen — registered but unused at screen level; **collision (§3)** |
| `timelineChain` | sequence-process | reveal | active | 6 | active screen; **collision (§3)** |

### 2b. Block-level authoring types (24 taxonomy entries)

| type | functions | interaction | block status | uses | classification |
|---|---|---|---|---|---|
| `read` | teach-mechanism | passive | active | 23 | renderer-owned |
| `keypoint` | teach-mechanism | passive | active | 22 | renderer-owned |
| `funfact` | hook-tension | passive | active | 12 | renderer-owned |
| `examtip` | exam-technique | passive | active | 20 | renderer-owned |
| `memoryHook` | teach-mechanism | passive | active | 0 | registered but unused |
| `mediaPlaceholder` | teach-mechanism | passive | active | 0 | registered but unused |
| `explainReveal` | teach-mechanism | reveal | active | 3 | active block |
| `theoryCompare` | teach-comparison | reveal | active | 3 | active block |
| `flashcards` | retrieve | reveal | active | 7 | active block |
| `reveal` | teach-mechanism | reveal | active | 1 | renderer-owned |
| `graphView` | teach-mechanism | passive | active | 0 | registered but unused |
| `misconception` | exam-technique | reveal | active | 2 | renderer-owned |
| `acronymMemorise` | teach-mechanism | reveal | active | 1 | active block |
| `quiz` | retrieve | assessed | active | 22 | active block (AnswerInteraction) |
| `fillblanks` | retrieve | assessed | active | 18 | active block |
| `boss` | retrieve+apply | assessed | active | 17 | active block (ExamQuestionFrame) |
| `colsort` | classify | assessed | active | 11 | active block |
| `misconceptionCheck` | retrieve+exam-technique | assessed | active | 16 | active block; **collision (§3)** |
| `spotTheError` | exam-technique+apply | assessed | active | 1 | active block |
| `builder` | apply | assessed | active | 1 | active block |
| `scenario` | apply | assessed | active | 14 | renderer-owned |
| `appliedscenario` | apply | **assessed** | legacy | 1 | proven-live compatibility — **renders a notice (§5)** |
| `examscored` | exam-technique | **assessed** | legacy | 1 | proven-live compatibility — renders a notice |
| `timelinedrag` | sequence-process | **assessed** | legacy | 1 | proven-live compatibility — renders a notice |

(`tieredquiz` block — legacy compatibility, 9 uses — is counted under §3
collisions; it is the 24th block-level entry.)

### 2c. Taxonomy keys registered in NEITHER authoring namespace (4)

| type | functions | interaction | live consumers | classification |
|---|---|---|---|---|
| `calculationBreakdown` | sequence-process+apply | assessed | **one** — Lab entry `calculation-breakdown` (`reviewManifestCore.jsx:701`) derives its interaction from it | **taxonomy-only / non-authoring, live** — the component exists, is catalogued, has stories, but is not routed and not authorable |
| `choice` | retrieve | assessed | **none** | taxonomy-only, **zero consumers** — see below |
| `truefalse` | retrieve | assessed | **none** | taxonomy-only, zero consumers |
| `connection` | retrieve | assessed | **none** | taxonomy-only, zero consumers |

`choice`/`truefalse`/`connection` are **question-item types**, nested inside
`questions` arrays of `quickRecall` screens and chapter-level `recall` blocks
(86 occurrences in content at that nesting depth). Both the quality guardrails
(`screenTypes()` = `screen.type` + `blocks[].type` only) and the coverage test
(`collectUsedTypes()`, same walk) never look at question-item depth, so these
three taxonomy entries are never consulted by anything. They are not display
types and never were. → **Decision D1.**

### 2d. Authoring entries with NO taxonomy coverage (3)

| entry | status | uses | behavioural consequence today |
|---|---|---|---|
| screen `standard` | active | 0 explicit (every untyped screen resolves to it, but quality checks read raw `screen.type`, which is `undefined` and filtered before lookup — `standard` is never queried) | none in practice; if content ever wrote `type: 'standard'` explicitly, `isPassive('standard')` = false → counted non-passive |
| block `hotspot` | active (renderer-owned) | 0 | a hotspot block would make its screen count as **non-passive** in the passive-run guardrail (unknown → `isPassive` false) — an accident of no coverage, not a decision |
| block `timeline` | active (renderer-owned) | 0 | same accident |

→ **Decision D2** (new facts must be assigned or exempted explicitly; this is
not a mechanical migration question).

---

## 3. Namespace collisions — all of them

Four type strings exist in both authoring namespaces. The flat map serves each
pair with **one** fact today:

| type | screen side | block side | one flat fact safe? |
|---|---|---|---|
| `misconceptionCheck` | derived → MisconceptionCheck | active → MisconceptionCheck | **Yes today** — same component, same semantics at both levels (the screen is synthesised *from* the block) |
| `oppositeQualitiesReveal` | active → OppositeQualitiesReveal | active → OppositeQualitiesReveal | **Yes today** — same component both levels |
| `timelineChain` | active → `TimelineChain` (default export), 6 uses | active → `TimelineChainBlock` (named export), **0 uses** | **Coincidentally yes** — two different implementations sharing one fact (`sequence-process`/reveal). Plausible, but nothing enforces it; must become two independent facts |
| `tieredquiz` | active → TieredQuizScreen, 0 uses | **legacy** → LegacyUnroutedBlock notice, 9 uses | **No** — a real assessed quiz screen and a compatibility notice cannot honestly share `{retrieve, assessed}`. Today's single fact is a latent misclassification of one side or the other |

Correction to the Phase 2 census while here: Phase 2's grep-based counter
attributed 6 *block* uses to `timelineChain`. Runtime loading shows those 6 are
all screen-level; the `timelineChain` **block** type has zero authored uses.

Per settled decision 3: all four pairs initially inherit today's flat values on
both sides — no reinterpretation during the flip.

---

## 4. Function vocabulary audit

Nine tags, all in canonical order, all used by at least one type — no unused
vocabulary:

| tag | types using it | consulted by |
|---|---|---|
| `hook-tension` | 3 | content-quality only via interaction (no per-tag rule); named in build template + pattern governance prose |
| `introduce-figure` | 1 (`keyFigureReveal`) | prose guidance only |
| `teach-mechanism` | 14 | prose guidance |
| `teach-comparison` | 4 | prose guidance |
| `apply` | 10 | prose guidance (the 88 doc hits are dominated by the English word, not the tag) |
| `classify` | 3 | prose guidance |
| `sequence-process` | 5 | prose guidance |
| `retrieve` | 11 | prose guidance |
| `exam-technique` | 8 | **the one tag with executable weight**: `hasAssessedExamTechnique()` (`contentQualityChecks.js:131-136`) requires `interaction === 'assessed' && functions.includes('exam-technique')` for the `EXAM_PREP_NO_ASSESSMENT` guardrail |

The regression test asserts the nine tags **in exact order**
(`content-quality.test.js:69`). No overlap or ambiguity found that requires a
rename; nothing to bring back as a vocabulary decision.

---

## 5. Interaction classification audit

Definitions (`componentFunctions.js:10-12`): passive = reads or taps Continue;
reveal = taps/pans to progress, gives no answer; assessed = answers or decides,
can be right/wrong.

### Exact current facts — mechanically migratable (evidence checked)

All passive display blocks (`read`…`examtip`, `graphView`, `mediaPlaceholder`,
`memoryHook`, `infographic`, `cinematic`, `examinerExplains`); all reveal types
spot-checked (`conceptReveal`, `flashcards`, `misconception`, `acronymMemorise`,
`quoteAnalyser`, `interactiveImage` — the last carrying a dated correction
comment in source); assessed types with hard correctness evidence:
`quiz`/AnswerInteraction (14 correctness refs), `fillblanks` (10),
`builder` (22), SwipeSort (12), `tieredquiz` screen (4), plus the weakness-tracker
loggers: MatchingTask, OrderedRouteTask, GuidedExamResponse, MisconceptionCheck,
PriorKnowledgeRecall, SpotTheError, QuickRecallScreen, ExamQuestionFrame.
`faceExaminer`: marking/judging phase with incorrect-state UI in
`FaceTheExaminerMain.jsx` — assessed supported. `colsort`: ships a
`thinkingPromptMode: 'afterIncorrect'` — correctness path exists.

### Likely stale claims — migrate as-is, return for decision (D4)

| type | claim | evidence against |
|---|---|---|
| `centreImageReveal` | assessed / apply | No correctness reference, no weakness logging, no scoring in `CentreImageReveal.jsx` — interaction is select-a-treatment-tab → view → continue. Looks like `reveal` |
| `guidedChoiceCarousel` | assessed / apply | No correctness reference, no logging in `GuidedChoiceCarousel.jsx` — learner chooses a path, every choice is valid (it routes via `nextId`). Looks like `reveal` |
| `appliedscenario`, `examscored`, `tieredquiz` (block), `timelinedrag` | assessed | All four render the `LegacyUnroutedBlock` notice — no interaction at all. The classifications describe what the content *intended*, not what renders. Note: they currently make their host screens count as non-passive and can satisfy `STAGE_NO_ASSESSMENT` — a legacy notice "counts as assessment" in the guardrails today. Changing that changes quality results → decision, not mechanics (D3) |

### Implementation ambiguity — needs deeper inspection before any correction

| type | question |
|---|---|
| `factorWeb` | `JudgementPhase` asks the learner to select the most important factor and reveals a verdict panel; no right/wrong marking found in the render path. Whether a justified-judgement selection counts as "can be right/wrong" is a pedagogy call, not a grep result |

Nothing in this section blocks the mechanical flip: settled policy is that all
52 entries migrate byte-identically and every candidate above returns as a
separate decision.

---

## 6. Behavioural baselines (captured at `5fd92ff`)

Committed under `baselines/` in this directory:

- **`taxonomy-baseline.json`** — `FUNCTION_TAGS` in order; every type's
  `functions` in order and `interaction`; the full output of `getTypeInfo`,
  `isPassive`, `isAssessed` for all 52 types; unknown-type behaviour
  (`getTypeInfo → null`, helpers → false). sha256
  `151256e6675fccb8cdbba6a62206abae76c1c4d1263a4a35273424ed524b4554`.
- **`quality-output-baseline.json`** — complete ordered quality output for all
  60 loaded chapters: guardrail violation objects (code, location, message,
  grade, fingerprint), sorted fingerprints, sentence-case violations and their
  fingerprints. 170 guardrail + 315 sentence-case violations in total. sha256
  `1515c75ac687953c0d1edc3b9f60ffe13201427954264a8e60af3d21d2a0aeb5`.

Flat-map collision behaviour is baselined implicitly: one shared fact per
colliding type, recorded per-type in `taxonomy-baseline.json`.

---

## 7. Questions requiring a product decision

Recorded in `DECISIONS.md`. D1 and D2 block implementation (they determine what
the projection contains); D3 and D4 do not (settled policy: migrate as-is,
review after).

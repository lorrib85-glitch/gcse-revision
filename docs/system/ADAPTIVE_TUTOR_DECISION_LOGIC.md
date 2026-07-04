# Adaptive Tutor Decision Logic — Design

**Status:** Design only — nothing implemented. No UI, no question-selection
change, no mastery-engine change is authorised by this document.
**Layer:** question result → tutor decision (the layer between the mastery
engine and future adaptive consumers).
**Sibling docs:** `docs/system/MASTERY_ENGINE.md`, `docs/system/LEARNING_GRAPH.md`

## Why this exists

The app can now describe a question richly (workbook-curated metadata), record
what a learner knows (mastery engine), and find the teaching screen that fixes
a concept (concept repair lookup). What it cannot do is answer the tutor's
question: **"they just answered — what should happen next?"**

Without one deciding layer, every consumer (QuickFire, Weak Spot Recovery,
Daily Planner, future AI Tutor) will invent its own if/else over correctness
and silently disagree. This layer gives one deterministic answer, the same way
the mastery engine gives one answer to "how well do they know Galen?".

```
Question metadata + answer + mastery snapshot + support lookup
      ↓
Tutor decision engine (this design)        — pure, deterministic
      ↓ TutorDecision object
Consumers act on it                        — future phases: selection, repair UI, review queue
```

The engine **recommends**; it never renders, routes, selects questions, or
writes state. Consumers may ignore parts of a decision (e.g. Pulse might not
honour `repair` mid-round) — the decision is advice, not a command.

---

## 1. Proposed file/module location

```
src/features/tutor/logic/
  index.js              — public API (the only import surface for consumers)
  decisionEngine.js     — decideAfterAnswer(input) → TutorDecision, plus the
                          stage ladder + window calculus helpers (exported for tests;
                          split into their own file only if a second caller appears)
  constants.js          — TUTOR_ACTIONS, REASON_CODES, thresholds
```

Rationale:

- Not `src/data/masteryEngine/` — the engine describes what a learner *knows*;
  this layer decides what they should *see*. MASTERY_ENGINE.md explicitly
  keeps adaptive behaviour out of the engine.
- Not `src/features/quickfire/logic/` — QuickFire is the first consumer, not
  the owner. The planner, WeakSpotRecovery convergence, and exam practice all
  need the same decisions later.
- `src/features/tutor/logic/` mirrors the existing pure-logic pattern
  (`src/features/planner/dailyPlanner.js`, `src/features/quickfire/logic/`)
  and leaves room for `src/features/tutor/components/` if a tutor surface is
  ever built (not designed here).

Allowed imports (enforced by a new architecture test, see §6):
`src/data/learningGraph/`, `src/data/masteryEngine/index.js` (read API only),
`src/data/contentSupport/conceptRepairLookup.js`, own files. Nothing else — no
React, no storage, no components, no runtime lesson files.

The mastery-engine consumer allowlist
(`tests/architecture/mastery-engine.test.js`) gains one entry for this module,
**read-only** (`getConceptMastery` + insight queries; never the recorders or
`masteryStore`).

---

## 2. Decision object shape

### Input contract

`decideAfterAnswer(input)` — one plain object in, one plain object out. All
data is passed in; the function performs no I/O and never reads the clock.

```js
{
  question: {
    id,                      // bank id, e.g. 'qq_h4'
    primaryConcept,          // registered concept id — required for a full decision
    secondaryConcepts,       // registered concept ids, may be []
    learningStage,           // 'recognise'|'recall'|'understand'|'apply'|'analyse'|'evaluate'
    difficultyLevel,         // 1–5 (DIFFICULTY in questionBanks/questionTypes.js)
    misconception,           // string | undefined (workbook-curated)
    followUpConcept,         // registered concept id | undefined
  },
  result: { correct, at },   // the answer just given; `at` explicit for determinism

  masteryState,              // engine state, ALREADY including this attempt (record-then-decide)

  sessionAttempts,           // this session's prior attempts, oldest→newest, EXCLUDING the
                             // current one. Each: { questionId, primaryConcept, learningStage,
                             // difficultyLevel, correct, at, action? } (`action` = the decision
                             // previously issued, if the consumer kept it — used by guardrails)

  lookups: {                 // injected so tests can stub coverage; defaults to the real
    getSupportForConcepts,   //   conceptRepairLookup functions when omitted
    getBestSupportScreen,
  },

  priority,                  // RESERVED — future exam/concept priority weighting; ignored in v1
}
```

**Record-then-decide contract:** the caller records evidence first (via the
existing `masteryRecorder` pattern), then calls `decideAfterAnswer` with the
post-record state. The engine internally forms each window as
`[...sessionAttempts filtered to concept, current result]`, so the answer just
given always counts. This keeps mastery reads and window maths consistent and
keeps this layer mutation-free.

### Output — `TutorDecision`

```js
{
  action: 'repair',                       // one of TUTOR_ACTIONS (§3)
  reason: 'incorrect-weak-repair',        // one code from a CLOSED enum (REASON_CODES) —
                                          //   machine-readable, table-testable; human copy
                                          //   is a consumer/UI concern, not emitted here
  question: { id, learningStage, difficultyLevel },
  primaryConcept,                         // echoed for consumers
  secondaryConcepts,

  conceptSnapshot: {                      // audit/debug — the evidence the decision saw
    mastery, confidence, strength, streak,
    window: { size, correct, wrong },     // the per-concept recent window used (§3.1)
  },

  misconception: string | null,          // passed through verbatim when the workbook has one;
                                          //   repair copy is generated LATER from this — the
                                          //   engine only carries the contract

  support: null | {                       // present only when action === 'repair'
    kind: 'screen' | 'part',              // exact screen match preferred over broad part match
    moduleId,
    screenIndex,                          // when kind === 'screen'
    partId, screenRange,                  // when kind === 'part'
    label,                                // screen label / part title
    forConcept,                           // usually primaryConcept; may be followUpConcept (§3.5)
  },

  nextQuestionPolicy: {                   // advice for the (future) selector — not enforced here
    preferredConcept,                     // usually primaryConcept
    fallbackConcept,                      // followUpConcept when the workbook provides one
    preferredLearningStage,               // a stage-ladder rung
    preferredDifficultyRange: [min, max], // 1–5
    avoidHigherStagesTemporarily,         // boolean — soft gate, see expiry semantics §3.4
    reviewLater,                          // null | { conceptId, minGapAttempts } — park one
                                          //   concept for spaced revisit; "not before N more
                                          //   questions" is a hint, not a lock
  },

  meta: { decidedAt },                    // decidedAt = result.at — nothing persists decisions
                                          //   yet, so no version field until something does
}
```

`TUTOR_ACTIONS = ['continue', 'reinforce', 'repair', 'step-down', 'stretch', 'review-later']`

Determinism guarantee: same input object → deep-equal output, always. No
`Date.now()`, no `Math.random()`, no module-level mutable state, stable
ordering everywhere (the support lookup already sorts deterministically).

---

## 3. Decision rules

### 3.1 Derived signals (computed first, used by every rule)

All windows are over attempts whose `primaryConcept` matches the current
question's, most recent last, current answer included:

| Signal | Definition |
|---|---|
| `window3`, `window4` | last 3 / last 4 attempts on the concept |
| `repairNeeded` | ≥ 2 wrong in `window3` |
| `secureNow` | ≥ 3 correct in `window4` |
| `developingNow` | ≥ 2 correct in `window3` |
| `strength` | `getConceptMastery(masteryState, primaryConcept).strength` — `unseen\|weak\|developing\|secure\|strong` |
| `slip` | wrong answer while `strength ∈ {secure, strong}` and not `repairNeeded` |
| `sessionWrongCount` | total wrong on this concept this session (incl. current) |
| `alreadyRepairedThisSession` | any prior `sessionAttempts` entry for this concept carries `action: 'repair'` (falls back to `sessionWrongCount ≥ 4` when consumers don't echo actions) |

The engine-side `strength` band and the session-side window signals answer
different questions — *lifetime knowledge* vs *right now, this stage* — and
both are needed because engine evidence does not (yet) carry `learningStage`
(§5, gap 2).

### 3.2 Stage ladder

```
recognise < recall < understand < apply < analyse < evaluate
```

(The exact `VALID_STAGES` order already enforced by
`tests/architecture/quickfire-workbook-sync.test.js`.) `stepDown(stage)` /
`stepUp(stage)` move one rung and clamp at the ends. Difficulty (1–5) is a
secondary axis: policies emit a `preferredDifficultyRange` of
`[max(1, d−1), d]` when consolidating and `[d, min(5, d+1)]` when stretching.

### 3.3 If incorrect — first match wins

| # | Condition | Action | Policy |
|---|---|---|---|
| I0 | `alreadyRepairedThisSession` | `review-later` (reason `incorrect-parked-after-repair`) | Park the concept (`reviewLater: { conceptId, minGapAttempts: 6 }`), `preferredConcept: null` — move on; grinding a broken concept in one sitting is the anti-pattern this row prevents |
| I1 | `repairNeeded` OR `strength ∈ {unseen, weak}` — **and a support target resolves (§3.5)** | `repair` | Point at the support target; `preferredConcept` = primary, `preferredLearningStage` = `stepDown(stage)`, `avoidHigherStagesTemporarily: true` |
| I2 | same trigger as I1 but **no support target** and `stage > recognise` | `step-down` | One rung down, same concept, difficulty `[max(1, d−1), d]`, `avoidHigherStagesTemporarily: true`; `fallbackConcept` = `followUpConcept` (§3.5); consumer may show the question's own `explanation` as the generic fallback copy |
| I3 | same trigger as I1/I2 but already at the `recognise` floor | `reinforce` (reason `incorrect-floor-reinforce`) | Same stage, same concept, easiest difficulty; nothing below to step to |
| I4 | `slip` (wrong once on a secure/strong concept) | `reinforce` | Same stage, same concept, re-queue soon; `avoidHigherStagesTemporarily: false` — one slip does not demote a secure learner |
| I5 | anything else (first wrong on a developing concept) | wrong at `recognise`/`recall` → `reinforce`; wrong at `understand`+ → `step-down` | As I2/I3 policies; `avoidHigherStagesTemporarily: true` |

### 3.4 If correct — first match wins

| # | Condition | Action | Policy |
|---|---|---|---|
| C1 | `strength === 'strong'` AND `secureNow` AND `streak ≥ 4` | `review-later` | Nothing left to learn right now: park with `minGapAttempts: 8`, `preferredConcept: null` (selection free to move on / consult `identifyWeakConcepts`) |
| C2 | `secureNow` AND `strength ∈ {secure, strong}` AND `stage < evaluate` | `stretch` | `preferredLearningStage: stepUp(stage)`, difficulty `[d, min(5, d+1)]`, same concept; at the `evaluate` ceiling this row falls through to C1/C4 |
| C3 | `strength ∈ {unseen, weak}` OR previous attempt on this concept was wrong | `reinforce` | One more at the same stage before moving on — a single correct after struggle is recovery, not security |
| C4 | default | `continue` | `preferredConcept` = primary (no forcing), current stage, `avoidHigherStagesTemporarily: false` |

### 3.4a Soft gating — expiry semantics

`avoidHigherStagesTemporarily` is **derived, never stored**. There is no flag
to clear: every decision recomputes it from the windows, so it "expires" the
moment the learner earns 2 correct from the last 3 on that concept
(`developingNow`). The user-facing rule set:

- 2 correct of last 3 → developing: same-stage questions flow normally,
  higher-stage no longer avoided
- 3 correct of last 4 → secure: eligible for `stretch`
- 2 wrong of last 3 → repair needed

Higher stages are never hard-locked — the gate is only ever the *preference*
emitted in `nextQuestionPolicy`, and the selector remains free to serve a
higher-stage question if the pool demands it. No permanent block exists
anywhere in the design.

### 3.5 Support resolution (for I1/I2)

Resolution order, stopping at the first hit:

1. `getBestSupportScreen(primaryConcept)` → `support.kind: 'screen'`
2. First part from `getSupportForConcept(primaryConcept).parts` → `kind: 'part'`
3. `getBestSupportScreen(followUpConcept)` (when the workbook provides one)
   → `kind: 'screen'`, `forConcept: followUpConcept`
4. Nothing → no `repair`; rule I2/I3 applies instead

Where several screens exist, `getSupportForConcepts([primary,
...secondary])` ranks screens by how many of the question's concepts they
cover; the top-ranked screen wins ties. Secondary concepts thus influence
*which* screen, never *whether* to repair.

Both lookups throw on unregistered ids — the tutor engine lets that
propagate (fail loud, same policy as the mastery recorder).

### 3.6 `followUpConcept` usage

The workbook's `followUpConcept` is the curated "productive next probe":

- **On incorrect** (I2/I5 step-down): emitted as
  `nextQuestionPolicy.fallbackConcept` so selection can probe it at a lower
  stage when no lower-stage question exists for the primary — a diagnostic
  descent chosen by a human, not a heuristic.
- **On repair** (I1): third choice for the support target (§3.5).
- **On stretch** (C2): emitted as `fallbackConcept` so a stretch can extend
  sideways when the primary has no higher-stage question.

It never *triggers* an action by itself.

### 3.7 Primary vs secondary concepts

**Decision evidence: primary only.** Every signal in §3.1 filters on
`primaryConcept`. A wrong answer tells you the primary concept failed; it
cannot tell you which secondary concept (if any) contributed, so secondary
concepts never trigger repair, step-down, or gating.

Secondary concepts are used for exactly three things:

1. **Support-screen ranking** (§3.5) — a screen covering primary + two
   secondaries beats one covering primary alone.
2. **Context in the decision object** — echoed so future repair messaging can
   reference the cluster.
3. **Light mastery evidence — a recording-policy rule, not a decision-engine
   rule:** today `masteryRecorder` records every resolved concept tag with
   equal weight, correct and incorrect alike. The designed target policy is:
   *primary concept records both correct and incorrect; secondary concepts
   record correct answers only* (a correct answer genuinely exercised them; a
   wrong answer is not attributable to them). This is a change to the
   recorder in its own phase (§7, T3) — the decision engine itself never
   records anything. True per-entry evidence weights remain a designed-for
   mastery-engine extension (`MASTERY_ENGINE.md` already reserves a
   `source`/`weight` field) and are **not** required for v1.

### 3.8 Missing metadata

Questions without workbook metadata (legacy rows, other subjects) produce a
degenerate but valid decision: `action: 'continue'`, reason
`insufficient-metadata`, `support: null`, an empty policy. Never guess a
concept from `tag`/`topic` strings — the learning graph is the only
vocabulary. Consumers can count this reason to measure curation coverage.

### 3.9 Misconceptions

When `question.misconception` exists it is passed through verbatim on every
decision (not just repair) — it is workbook-audited copy describing the wrong
idea, and later phases will use it to phrase repair messaging. **This design
deliberately stops at the interface contract:** the field is a `string |
null`; no copy generation, templating, or tone rules are designed here (that
work must go through `TEACHING_VOICE_GUIDE.md` when it happens).

---

## 4. Example flows

**Setup common to all:** caller records the attempt via the mastery recorder,
then calls `decideAfterAnswer` with the post-record state.

### 4.1 Correct easy recall

`qq_h13`-style: `learningStage: 'recall'`, `difficultyLevel: 1`, primary
`history:medicine:miasma`, learner strength `developing`, last attempt on the
concept was correct.

- Incorrect branch skipped. C1 no (not strong), C2 no (`secureNow` false —
  only 2 of last 4), C3 no (not weak, no preceding wrong) → **C4
  `continue`**, reason `correct-developing-continue`. Policy: same concept
  preferred, stage `recall`, no gating. The session simply flows.

### 4.2 Wrong recognise question

`learningStage: 'recognise'`, `difficultyLevel: 1`, primary
`history:medicine:miasma`, strength `weak`, no support screens exist for the
concept yet.

- I0 no, I1 trigger fires (`strength: weak`) but §3.5 resolves nothing →
  I2 no (`stage === recognise` floor) → **I3 `reinforce`**, reason
  `incorrect-floor-reinforce`. Policy: same concept, `recognise`, difficulty
  `[1, 1]`, `avoidHigherStagesTemporarily: true`; the consumer may surface
  the question's own `explanation` as the generic fallback. Misconception
  string passed through.

### 4.3 Wrong understand question with support screen

`qq_h2`-style: `learningStage: 'understand'`, `difficultyLevel: 2`, primary
`history:medicine:four-humours`, secondaries `[hippocrates, galen]`,
`followUpConcept: bloodletting`, misconception "Confusing Four Humours with
miasma or germ theory.", strength `weak`.

- I1 fires: `getSupportForConcepts([four-humours, hippocrates, galen])` ranks
  Episode 1 part-2/part-3 screens; the screen covering the most of the three
  wins → **`repair`**, reason `incorrect-weak-repair`, `support: { kind:
  'screen', moduleId: 'history-medicine-medieval-beliefs-causes',
  screenIndex, label, forConcept: 'history:medicine:four-humours' }`. Policy:
  preferred stage `recall` (one rung down), `fallbackConcept: bloodletting`,
  `avoidHigherStagesTemporarily: true`. Misconception included for future
  repair copy.

### 4.4 Repeated mistakes

Same learner, same concept, third wrong answer this session; a `repair` was
already issued two questions ago (echoed back in `sessionAttempts[].action`).

- **I0 `review-later`**, reason `incorrect-parked-after-repair`. Policy:
  `reviewLater: { conceptId: 'history:medicine:four-humours',
  minGapAttempts: 6 }`, `preferredConcept: null` — the tutor stops grinding,
  moves the session elsewhere, and the parked concept resurfaces later (and
  is independently visible to the planner via `identifyWeakConcepts`).

### 4.5 Secure learner ready for stretch

`learningStage: 'understand'`, `difficultyLevel: 2`, primary
`history:medicine:galen`, strength `secure`, window shows 3 correct of last 4
including this answer, streak 3.

- C1 no (not `strong`/streak < 4) → **C2 `stretch`**, reason
  `correct-secure-stretch`. Policy: `preferredLearningStage: 'apply'`,
  difficulty `[2, 3]`, same concept, `fallbackConcept` = workbook
  `followUpConcept` if present (sideways stretch when no `apply`-stage Galen
  question exists). If the learner gets the stretch question wrong, I4
  (`slip`) catches it gently — reinforce at `apply`, no demotion.

---

## 5. Data-model gaps

1. **Metadata coverage is one subject deep.** Only the History Medicine
   workbook-synced rows carry canonical metadata; Biology/Maths/English banks
   have `tags` at most. Until curated, most decisions outside Medicine will be
   `insufficient-metadata` continues. This is correct behaviour, but it means
   rollout value tracks curation, not code.
2. **Mastery evidence entries don't carry `learningStage`.** Cross-session
   stage-level windows are impossible from the engine alone; v1 compensates
   with the session attempt log (in-session) plus the concept-level strength
   band (cross-session). Designed future extension: record `stage` as an
   extra per-result field on `recent` entries — `MASTERY_ENGINE.md` already
   states extra per-result fields are tolerated without a data migration, but
   actually *writing* it is an engine-adjacent change needing its own phase.
3. **No evidence weights.** "Secondary concepts get lighter evidence" is
   approximated by the correct-only recording rule (§3.7); real weights await
   the engine's reserved `source`/`weight` extension.
4. **Support coverage is Medicine Episodes 1–2 only.** The no-support fallback
   path (step-down + generic explanation) is the *common* path initially —
   design and test it as first-class, not as an edge case.
5. **No exam/concept priority signal yet.** The `priority` input is reserved
   and ignored; when exam-weight data lands, it should bias C1/C4 (park
   low-priority strong concepts sooner, keep high-priority ones cycling) —
   without changing the decision shape.
6. **Two difficulty vocabularies coexist** (`difficulty: 'easy'…'exam'` legacy
   strings vs numeric `difficultyLevel` 1–5). The engine reads
   `difficultyLevel` only; rows lacking it fall into §3.8.
7. **`sessionAttempts[].action` echo is optional.** The I0 guardrail degrades
   to the `sessionWrongCount ≥ 4` fallback when consumers don't echo issued
   decisions back; consumers that can, should.

None of these blocks v1; 2 and 3 are the only ones that would touch the
mastery engine, and both are already anticipated by its designed-for
extensions list.

---

## 6. Required tests

**Unit — `tests/unit/tutor/decisionEngine.test.js`** (table-driven fixtures;
lookups injected as stubs so no real content coverage is needed):

- Determinism: same input called twice → deep-equal decisions; no field ever
  derives from wall-clock time.
- Every rule row I0–I5 and C1–C4 hits at least one fixture, including the
  first-match precedence between adjacent rows (e.g. slip vs repairNeeded;
  stretch vs review-later).
- Window boundary maths: exactly 2-of-3 wrong / 3-of-4 correct / 2-of-3
  correct at the threshold, and one attempt short of each.
- Stage-ladder clamps: wrong at `recognise` floor never emits `step-down`;
  correct at `evaluate` ceiling never emits `stretch`.
- Support resolution order (§3.5): screen beats part beats followUp screen
  beats none; secondary-concept coverage breaks ties.
- Soft-gate expiry: after 2-of-3 correct, the same concept no longer emits
  `avoidHigherStagesTemporarily: true`.
- Repair-loop guardrail: second repair-worthy failure in a session parks the
  concept (I0), both via `action` echo and via the wrong-count fallback.
- Missing metadata → `insufficient-metadata` continue; unregistered concept
  id → the lookup/engine throw propagates (never swallowed).
- Misconception pass-through on every action, `null` when absent.
- Calculus helpers in isolation (exported from `decisionEngine.js`): ladder
  order, step up/down clamps, window maths.

**Architecture — `tests/architecture/tutor-decision.test.js`** (same pattern
as `mastery-engine.test.js`):

- Pure-layer guard: no React/JSX, no `src/lib/storage.js`, no component or
  app imports anywhere under `src/features/tutor/logic/`.
- Import allowlist: only `learningGraph/`, `masteryEngine/index.js`,
  `contentSupport/conceptRepairLookup.js`, own files.
- Read-only mastery guard: the tutor module never imports
  `recordAttempt`/`recordCorrect`/`recordIncorrect`/`saveMasteryState`.
- Consumer allowlist for the tutor engine itself (empty at v1 — no consumer
  authorised until its phase).

**Existing suites extended:** `mastery-engine.test.js` allowlist gains
`src/features/tutor/logic/` as a read-only consumer in the implementation
phase — with the guard above proving "read-only" structurally.

---

## 7. Implementation phases

Each phase is a separate explicit-authorisation Big Build step; this document
authorises none of them.

- **T1 — Decision core.** `constants.js`, `decisionEngine.js` + `index.js`:
  ladder/window calculus, full rule table, unit + architecture tests,
  mastery-engine allowlist extension (read-only). Zero consumers — the module
  is dark code validated purely by tests.
- **T2 — First consumer (QuickFire, advisory).** QuickFire calls
  `decideAfterAnswer` after its existing recorder call and *logs/acts on the
  decision minimally* (e.g. honours `reinforce` re-queue) without changing
  selection ranking. Tutor consumer allowlist gains QuickFire.
- **T3 — Recorder policy for secondary concepts.** `masteryRecorder` adopts
  primary-full / secondary-correct-only recording (§3.7). Pure recorder
  change, own tests; requires the workbook `primaryConcept` field QuickFire
  already forwards.
- **T4 — Selection integration.** `selectQuestions.js` (its own file already
  carries the "phase 2: proficiency-adaptive selection" TODO) consumes
  `nextQuestionPolicy`. This is the explicitly-deferred "change question
  selection" step.
- **T5 — Evidence stage stamping (optional, unblocks cross-session gating).**
  Recorder passes `stage` as an extra per-result field; engine windows can
  then be stage-aware without a migration.

---

## 8. Risks / guardrails

- **Repair loops.** Repeatedly sending a struggling learner to the same
  screen is demoralising and useless. Guardrail: I0 parks a concept after one
  in-session repair; the park is time-boxed (`minGapAttempts`), never a lock.
- **Stage oscillation.** Symmetric thresholds would bounce a learner between
  stretch and step-down. Guardrail: asymmetric hysteresis — moving up needs
  3-of-4, moving down triggers on 2-of-3, and a single slip on a secure
  concept (I4) causes no demotion.
- **Hard gating by accident.** The policy object only ever *prefers*; no
  consumer may treat `avoidHigherStagesTemporarily` as a lock, and the gate
  self-expires by derivation (§3.4a). Document this in the consumer phase and
  test that the flag clears.
- **Second source of truth.** The tutor layer must never cache or persist its
  own mastery-ish numbers — everything derives per-call from the engine
  snapshot plus the session log. The architecture test's storage ban makes
  this structural.
- **Silent metadata starvation.** Uncurated banks make the tutor a no-op. The
  `insufficient-metadata` reason code exists precisely so coverage is
  measurable rather than invisible.
- **`unifiedWeaknessTracker` overlap.** The tracker remains the behavioural
  misconception log feeding today's `WeakSpotRecovery`; this engine does not
  read or write it. Convergence stays a future, deliberate phase
  (MASTERY_ENGINE.md rule 5) — wiring them casually here would create the
  exact double-bookkeeping this layer exists to end.
- **Determinism erosion.** The single input object and closed reason enum are
  the defence: any future rule needing randomness (e.g. variety jitter)
  belongs in the *selector*, never in the decision engine.

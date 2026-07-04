# Learner Mastery Engine

**Status:** Active — Phase 2 record layer + Phase 3A first consumer (QuickFire,
write-only via `src/features/quickfire/logic/masteryRecorder.js`). Nothing
reads mastery back yet; question selection is untouched.
**Code:** `src/data/masteryEngine/`
**Tests:** `tests/architecture/mastery-engine.test.js`, `tests/unit/masteryEngine/masteryEngine.test.js`
**Sibling docs:** `docs/system/LEARNING_GRAPH.md`;
`docs/system/EVIDENCE_MODEL.md` (design) defines what counts as evidence,
event validity and attribution — this engine stays the accumulator and never
needs to know which activity produced an event.

## Why this exists

The learning graph describes the **curriculum** — every concept a GCSE course
contains, named once, canonically. The mastery engine describes **one
learner's understanding of that curriculum**: for each registered concept,
what the evidence says they know.

Without this layer, every adaptive feature invents its own score (a
percentage here, a wrong-answer count there) and they silently disagree.
With it, there is exactly one answer to "how well does the learner know
`history:medicine:galen`?" — and every future consumer reads it from the
same place:

QuickFire · Weak Spot Recovery · Daily Planner · Pulse · AI Tutor ·
Exam Practice · Parent Dashboard · Analytics

```
Learning graph  (what the curriculum contains)      — src/data/learningGraph/
      ↓ concept ids
Mastery engine  (what THIS learner knows of it)     — src/data/masteryEngine/
      ↓ mastery snapshots / weak-strong-neglected rankings
Adaptive features (what to show next)               — future phases, not built yet
```

## How it differs from the learning graph

| | Learning graph | Mastery engine |
|---|---|---|
| Describes | The curriculum | One learner |
| Data | Static, checked into the repo | Dynamic, persisted per learner |
| Changes when | Content is authored | The learner answers something |
| Purity | Pure leaf, no storage ever | Pure leaf **except** `masteryStore.js` |

The engine depends on the graph (concept ids are validated against the
registry — recording against an unregistered id **throws**), never the other
way round.

## The model

```
Learner state  →  Concept mastery  →  Evidence  →  Recommendations
```

Stored state is **evidence, not percentages** (versioned, `MASTERY_STATE_VERSION`):

```js
{
  version: 1,
  concepts: {
    'history:medicine:galen': {
      attempts: 7, correct: 5, incorrect: 2,   // lifetime counters
      streak: 3,                                // current consecutive-correct run
      firstSeen, lastSeen, lastCorrect,         // ms epoch timestamps
      recent: [{ correct: true, at: … }, …],    // last EVIDENCE_WINDOW (10) results
    },
  },
}
```

Each `recent` entry may optionally carry `stage` (one of the canonical
`LEARNING_STAGES` from `src/data/learningGraph/learningStages.js`) and
`source` (producer slug, e.g. `'quickfire'`) — EV1/O1 stage-aware evidence.
Both are provenance for the objective layer and **never influence scoring**;
entries recorded before stamping simply lack them and stay valid, no
migration needed.

Mastery, confidence and strength are **derived at read time, never stored**:

- **mastery (0–1)** — Laplace-smoothed lifetime accuracy blended with the
  newest slice of the recent window, weighted toward recent. One answer never
  reads as 0% or 100%; recent failures matter more than old ones.
- **confidence (0–1)** — how confidently the learner retrieves the concept
  right now: recent success density × evidence volume. Repeated success
  raises it; repeated failure or thin evidence keeps it low.
- **strength** — coarse band over mastery: `unseen | weak | developing |
  secure | strong` (`STRENGTH_BANDS`).

Because scores are derived, the scoring model can change (memory decay,
response-time weighting, AI marking, confidence buttons) **without a data
migration** — the stored evidence already carries per-result timestamps and
tolerates extra per-result fields.

## Public API

Import from `src/data/masteryEngine/index.js`.

**State** — `createEmptyMasteryState()`, `createEmptyConceptEvidence()`,
`isMasteryState(value)`, `MASTERY_STATE_VERSION`, `EVIDENCE_WINDOW`,
`STRENGTH_BANDS`

**Recording (pure, immutable — returns a new state):**

```js
state = recordCorrect(state, 'history:medicine:galen', { at })
state = recordIncorrect(state, 'history:medicine:galen', { at })
state = recordAttempt(state, { conceptId, correct, at, stage?, source? })  // core form
merged = mergeEvidence(stateA, stateB)                     // future device sync
```

`at` defaults to `Date.now()`; pass it explicitly for deterministic replay.
Unknown concept ids throw — register concepts in the learning graph first.
`stage`/`source` are optional and preserved on the stored entry (invalid
values throw); they never affect any derived score.

**Reading (pure):**

```js
getConceptMastery(state, conceptId)  // { conceptId, mastery, confidence, strength, ...evidence }
getAllConceptMastery(state)          // every tracked concept, deterministic order
calculateMastery(evidence) / calculateConfidence(evidence) / calculateStrength(evidence)
```

**Recommendations (pure, deterministic ordering):**

```js
identifyWeakConcepts(state, { limit, minAttempts })       // weakest first
identifyStrongConcepts(state, { limit, minAttempts: 3 })  // strongest first, needs real evidence
identifyNeglectedConcepts(state, { now, staleDays: 7, limit }) // practised but stale, oldest first
getObjectiveEvidence(state, conceptId, stage)  // pure filter over stage-stamped
                                               // events: { conceptId, stage, events,
                                               // count, lastSeen } — no mastery maths
```

**Persistence (the only impure calls):**

```js
state = loadMasteryState()   // validated; malformed/future payloads → empty state
saveMasteryState(state)      // key: MASTERY_STORAGE_KEY ('gcse_mastery_v1')
```

`masteryStore.js` goes through `src/lib/storage.js` — the app-wide
persistence boundary — and is the only file in the engine allowed to.

## How future adaptive systems should consume it

1. **Record through the engine, read through the engine.** When an answer is
   marked, resolve the question's concept tags
   (`resolveEffectiveTags(module.tags, topic.tags, question.tags)`), then
   `recordCorrect`/`recordIncorrect` per concept. Never keep a parallel
   score.
2. **Load once, update in memory, save at a boundary** (end of round/screen),
   not per keystroke.
3. **Rank with the insight queries**, don't re-derive. If a consumer needs a
   ranking the engine can't express, extend `insights.js` — that keeps
   "weak" meaning the same thing in the planner, QuickFire and the parent
   dashboard.
4. **Adaptive question selection is not this layer.** Selection reads
   mastery snapshots and picks questions; it lives with the consumer
   (F2, `selectQuestions.js`) — the engine only ever says what the learner
   knows.
5. The existing `unifiedWeaknessTracker.js` remains the behavioural
   misconception log feeding `WeakSpotRecovery` today. Convergence between
   the two is a future, deliberate phase — do not wire them together
   casually.

## Designed-for extensions (not implemented)

- **Memory decay** — time-weight `recent` entries / discount stale lifetime
  counters inside `calculateMastery`. Evidence already carries timestamps.
- **Response time & confidence buttons** — extra fields on `recent` entries;
  `recordAttempt` already ignores-but-tolerates extra options.
- **AI marking / teacher feedback** — partial-credit evidence sources; add a
  `source`/`weight` field to `recent` entries and a term to the score.
- **Spaced repetition** — schedule from `lastCorrect`, `streak` and
  `identifyNeglectedConcepts`.
- **Device sync** — `mergeEvidence` is the merge primitive (counters sum,
  windows interleave by time; merged `streak` is conservative, capped at the
  evidence window).

Any stored-shape change bumps `MASTERY_STATE_VERSION`; `loadMasteryState`
discards unrecognised payloads rather than guessing.

## Rules (enforced by `tests/architecture/mastery-engine.test.js`)

- Pure logic layer: no React, no JSX, no component/feature/app imports.
- No direct browser storage access anywhere; `masteryStore.js` may import
  only engine files + `src/lib/storage.js`; every other file may import only
  engine files + `learningGraph/`.
- Unknown concept ids are rejected, on read and write.
- Update functions are immutable — recorders never mutate their input.
- Consumers are authorised phase by phase — an allowlist guard test blocks
  any file outside the authorised set from touching the engine. Current
  allowlist: `src/features/quickfire/logic/masteryRecorder.js` (Phase 3A,
  write-only). Extend the allowlist only in a phase that explicitly wires a
  new consumer.

# Evidence Model — Design

**Status:** Design only — no code, no UI, no mastery-engine or tutor-logic
change is authorised by this document.
**Layer:** the canonical definition of learning evidence — the unit every
activity produces and the only thing the mastery engine consumes.
**Sibling docs:** `docs/system/LEARNING_GRAPH.md` (concept identity),
`docs/system/MASTERY_ENGINE.md` (accumulation), `docs/system/LEARNING_OBJECTIVE_LAYER.md`
(the stage dimension), `docs/system/AI_INTERPRETATION_BOUNDARY.md` (how AI
output becomes evidence), `docs/system/PEDAGOGICAL_MODEL.md` (what decisions
evidence feeds), `docs/system/ADAPTIVE_TUTOR_DECISION_LOGIC.md`

## Why this exists

Today the platform thinks *question → correct/incorrect → mastery*. That
works while questions are the only activity, but the roadmap already
contains recall free-writes, guided explanations, exam papers, teach-back
and AI conversation — and each would otherwise invent its own way of
telling the mastery engine what happened. This document fixes the unit once:

```
Learning activity  (any of many, growing)
      ↓ emits 0..n
Evidence events    (one canonical shape — this document)
      ↓ recorded via the engine's public API
Mastery            (accumulation & scoring — MASTERY_ENGINE.md, unchanged)
      ↓ read as snapshots
Tutor decisions    (interpretation — tutor/pedagogical docs, unchanged)
```

A question is one evidence *producer* among many. The mastery engine never
knows or cares which activity produced an event; the tutor never reads
events at all — it reads mastery. Those two ignorances are the architecture.

**Non-duplication rule:** this document defines what evidence *is* and how
producers must emit it. How evidence is *stored and scored* stays in
`MASTERY_ENGINE.md`; how AI output is *validated* stays in
`AI_INTERPRETATION_BOUNDARY.md`; what decisions *follow* stays in the tutor
and pedagogical docs.

---

## 1. The evidence event

One event = **one validated claim that one learner demonstrated (or failed
to demonstrate) one concept at one moment.**

```js
{
  concept: 'history:medicine:four-humours',  // REQUIRED — registered concept id (graph is the gate)
  correct: true | false,                     // REQUIRED — the claim's polarity (see §4 for why binary)
  at: 1730000000000,                         // REQUIRED — ms epoch; explicit for deterministic replay
  stage: 'apply',                            // OPTIONAL — attaches the event to the objective
                                             //   (concept@stage); omitted = concept-level only
  source: 'quickfire',                       // OPTIONAL — producer slug, provenance/telemetry only;
                                             //   MUST NOT influence scoring
  // …tolerated extras (§9): weight, aiConfidence, selfConfidence,
  //   responseMs, misconceptionId — optional, additive, never required
}
```

This is deliberately the shape `recordAttempt({ conceptId, correct, at })`
already accepts — the evidence model is a *discipline over the existing
API*, not a new pipeline. (Precision note: the engine currently accepts but
**drops** extra fields; storing `stage` and other extras on `recent` entries
is the objective layer's O1 extension. Nothing here requires more than
that.)

**Validity rules** (enforced at the producer boundary, exactly as today):
registered concept id (unregistered throws — never silently dropped when
concept-shaped); boolean `correct`; finite numeric `at`; `stage` from
`LEARNING_STAGES` when present. Producers are allowlisted recorders (the
engine's existing consumer-allowlist test is the enforcement point).

---

## 2. What counts as evidence — and what does not

The definitional line, and the sharpest rule in this document:

**Evidence is a demonstration. Activity is not.**

| Counts (emits events) | Does not count (activity record only) |
|---|---|
| Answering any question format | Viewing/completing a support screen |
| A validated free-text/exam interpretation (§5) | Time spent, screens visited, missions started |
| A recall free-write's per-concept scores, thresholded | Skipping a question |
| A teach-back / AI-conversation exchange **after** validation | Being *shown* a misconception correction |
| A verification question at the end of a repair | The repair mission itself completing |

Two consequences worth stating plainly:

- **Completing support content is never evidence of learning.** The
  pedagogical model's repair arc ends in verification *questions*; those
  emit the events. "Support completed" is session/activity state for the
  tutor's flow control, not a mastery input — this deliberately deletes
  `support completed` from the candidate dimension list.
- **A misconception being *corrected* is not a recordable dimension.**
  Correction is demonstrated by subsequent events on the same cell, not
  declared by a flag. A misconception being *observed* rides as an optional
  `misconceptionId` extra on the failed event (and, today, through
  `unifiedWeaknessTracker` until the designed convergence).

Activity records (session attempt log, skips, screen completions) matter —
to the tutor's in-session flow, to telemetry, possibly to future avoidance
detection — but they live in the session layer, not in mastery.

---

## 3. Activity → evidence mapping

How every current and planned activity emits events, without redesign:

| Activity | Events emitted |
|---|---|
| Multiple choice / true-false | Per §6 attribution: 1 primary event (stage-stamped) + secondary events on correct only |
| Matching / ordering / drag-drop / column-sort | Per *item or pair*, each item's concept is its own primary — one event per item resolved deterministically; no secondary attribution |
| Short free text (accepted-answer hit) | Same as MC — deterministic |
| Short free text / exam / essay (AI-interpreted) | Sanitised verdict → events per §5; `unclear` → none |
| Retrieval practice / QuickRecall | Same as the underlying question format |
| Free recall (`PriorKnowledgeRecall`) | Validated per-concept scores pass fixed thresholds → one event per concept above/below the demonstrated/failed lines; mid-band scores emit nothing |
| Guided explanation / worked example (`GuidedExamResponse`, coach stages) | Only the learner-attempt stages emit (their marked attempts); modelled/annotated stages are activity |
| Teach-back, AI conversation | Each validated exchange that makes a checkable claim → events via the AI boundary; conversation itself is activity |
| Interactive diagrams / simulations / practicals (future) | The interaction defines checkable outcomes (hotspot found, circuit closed correctly, prediction right) → each is a deterministic event; exploration without a check is activity |
| Revision missions | Emit nothing themselves — their member questions/verifications emit |

The pattern that makes this future-proof: **any new activity only has to
answer "what checkable claims about registered concepts does this
interaction make, and at what stage?"** If it makes none, it produces
activity, not evidence — and that is allowed.

---

## 4. Evidence quality — stage × consistency, not a quality score

The brief asks how to distinguish guessed MC from confident recall from
complete explanation. The lean answer: **quality is not a stored field.**
Three existing mechanisms already express it:

1. **Stage is the quality axis.** A demonstrated `apply` event *is*
   stronger evidence than a demonstrated `recognise` event — not because it
   carries a bigger number, but because it lives in a higher cell of the
   objective grid. "MC correct but can't explain" isn't one confusing
   signal; it's two clean events in different cells (`recognise/recall`
   demonstrated, `understand` failed). Most "quality" intuitions dissolve
   into stage resolution.
2. **Consistency is the confidence axis.** The engine's smoothing means one
   event never reads as 0% or 100%; thin evidence is never secure. A lucky
   guess is neutralised not by detecting the guess but by requiring the
   claim to be repeated (the tutor's reinforce-after-thin-evidence rules do
   exactly this).
3. **Tolerated extras are the refinement path** (§9): `responseMs`,
   `selfConfidence` ("sure / not sure"), `weight` for partial credit — all
   reserved by the engine's designed-for extensions, none required now.

**Challenging "correct = strong evidence" directly:** a correct answer is a
*weak positive claim at a specific stage*. Its strength comes from what
surrounds it — the stage it was demonstrated at, how often it has been
repeated, how recently, and whether higher cells corroborate it. That is
already how the engine derives mastery; the evidence model just refuses to
pretend a single event can carry quality on its own. Binary `correct`
stays; no quality enum, no strength scalar, no second score.

---

## 5. AI-interpreted evidence

Fully specified in `AI_INTERPRETATION_BOUNDARY.md`; the evidence model adds
only the conversion rule: **AI never emits evidence — validated
interpretations convert to events deterministically.**

- Sanitised `correct` / `incorrect` verdicts → normal events (partial →
  failed event, gentler tutor policy).
- `unclear`, review-needed, fallback self-marked outcomes → **no event**.
- Recall `conceptScores` → events through fixed thresholds (the thresholds
  are validator constants, not AI output).
- `aiConfidence` may ride as a tolerated extra for audit; it **never scales
  mastery** (weighting is a mastery-engine decision, per the boundary doc).

One pipeline, whatever the producer: *interpretation → validation gate →
deterministic conversion → evidence event → engine.*

---

## 6. Attribution — primary vs secondary concepts

Canonicalising the rule already designed across the objective and
pedagogical layers:

| | Primary concept | Secondary concepts |
|---|---|---|
| Correct answer | 1 demonstrated event, **stage-stamped** | 1 demonstrated event each, **concept-level (no stage)** |
| Wrong answer | 1 failed event, stage-stamped | **Nothing** |

Rationale: the question's stage describes the demand on the primary; a
correct answer genuinely exercised the secondaries (light support), but a
wrong answer cannot be attributed to them — suspicion of a secondary is
what `diagnose` exists to test, not assume.

Secondary evidence is ignored entirely when: the answer is wrong; the
secondary is a course node (`history:medicine`) rather than an atom; or the
activity attributes per-item (matching/ordering — every item is its own
primary). No proportional splitting, no fractional credit — attribution is
whole events or no event, keeping every event independently true.

---

## 7. Conflicting evidence

**No producer resolves conflicts. Producers emit; the engine reconciles;
the tutor interprets.** The listed scenarios, through that lens:

- *Correct today, wrong tomorrow* — both events stand; recency-weighted
  blending (engine, unchanged) means the newer result matters more without
  erasing history.
- *MC correct, explanation poor* — not a conflict: two events in different
  cells (§4). The objective grid is the conflict-resolution mechanism for
  cross-stage "contradictions".
- *Exam answer shows deeper understanding than old quizzes* — higher-stage
  demonstrated events populate cells the quizzes never touched; the concept
  reads stronger without rewriting old evidence. Evidence is append-only;
  nothing is retracted or edited.
- *AI confidence low* — resolved before evidence exists: low-confidence
  interpretations degrade to `unclear` at the validation gate and emit
  nothing.
- *Genuinely contradictory same-cell evidence* — thrashing within one cell
  keeps mastery mid-band and confidence low, which is the honest reading;
  the tutor's `diagnose`/repair machinery is the actor that investigates,
  not the evidence layer.

---

## 8. Missing evidence

**Absence is never failure.** No producer may fabricate a negative event
from silence:

- *Skipped question* → no event (an activity record, possibly interesting
  to future avoidance detection — session layer, not mastery).
- *AI unavailable / self-marked fallback* → no event (per the boundary doc).
- *Insufficient evidence* → the engine's `unseen`/thin bands and the
  objective layer's `stageEvidence: 'none'` fallback already express this
  honestly; nothing to add.
- *Objective never tested* → `unseen` at that cell; the tutor treats it as
  unknown (a diagnose/stretch target), never as weak.
- *No support content* → irrelevant to evidence (support is not evidence,
  §2); affects only repair delivery.

---

## 9. Future-proofing — the tolerated-extras policy

New evidence kinds must extend the event, never reshape it. Three tiers:

1. **New `source` values** (teacher upload, speech transcript, OCR'd
   written work, collaborative activity) — free: source is provenance, and
   OCR/speech are just *transport* for answers that follow the normal
   interpretation path. Collaborative work attributes events per learner or
   not at all.
2. **New optional extras** (`selfConfidence`, `responseMs`, `weight`,
   `misconceptionId`, observer notes) — additive on `recent` entries, which
   the engine's stored shape already tolerates carrying. An extra may be
   *recorded* freely; it may only *influence scoring* via an explicit
   mastery-engine extension (its `source`/`weight` designed-for slot) —
   never by a producer's side-channel.
3. **Anything needing new required fields or new stored structure** — a
   `MASTERY_STATE_VERSION` bump and a deliberate engine phase. If a
   proposal lands here, it must justify why tiers 1–2 can't express it.

Low-trust sources (parent observations, unverified teacher notes) should
enter — if ever — as low-`weight` extras under tier 2's scoring rule, not
as ordinary events; until weighting exists in the engine, they are activity
records, not evidence.

---

## 10. Responsibilities of each layer (who owns what)

| Document / layer | Owns | Explicitly does not own |
|---|---|---|
| **EVIDENCE_MODEL (this)** | What evidence is; validity; attribution; activity→event mapping; what is *not* evidence | Storage, scoring, decisions, AI validation |
| LEARNING_GRAPH | Concept identity the `concept` field must match | Anything learner-specific |
| LEARNING_OBJECTIVE_LAYER | The `stage` dimension and per-cell reading | Event emission rules |
| MASTERY_ENGINE | Accumulating events; deriving mastery/confidence/strength; reconciling recency | Where events came from; what to do next |
| AI_INTERPRETATION_BOUNDARY | Turning model output into *validated interpretations* | Turning interpretations into events (this doc, §5) — and everything downstream |
| ADAPTIVE_TUTOR / PEDAGOGICAL_MODEL | Interpreting mastery snapshots into diagnosis, repair, reinforcement, stretch, review-later, missions, spacing | Reading raw events; writing evidence |

How evidence supports the pedagogical machinery, in one line each:
diagnosis reads per-cell events (distractor extras + windows); repair is
*triggered* by failed events and *verified* by later demonstrated ones;
reinforcement exists because single events are weak claims (§4);
stretch fires on consistent demonstrated evidence at a cell; review-later
and spaced retrieval schedule from `lastCorrect`/staleness — all already
designed in their own documents; evidence just guarantees they share one
substrate.

---

## 11. Simplifications recommended (not authorised here)

Writing this definition surfaced four simplifications; they are
recommendations for the relevant future phases:

1. **Unify the session attempt log and the evidence event.** The tutor's
   `sessionAttempts` entry and the evidence event are ~the same record at
   different lifetimes. When implementation comes, use one shape (event +
   activity context fields) rather than two parallel record types — the
   session log is then "today's events plus the non-events (skips,
   unclear)", not a second schema.
2. **Retire per-feature weakness bookkeeping into thresholds-over-events.**
   `PriorKnowledgeRecall`'s score→weakness logging and the
   `unifiedWeaknessTracker` string log are pre-evidence designs; the
   already-planned convergence should land them as ordinary events (+
   `misconceptionId` extras), leaving the tracker as a legacy read surface
   until its consumers migrate. No new mechanism — deletion by adoption.
3. **Drop "support completed" and "misconception corrected" as data.**
   Both were candidate dimensions; both are expressible as *behaviour*
   (verification events) rather than *declarations* (§2). Anything not
   stored cannot drift.
4. **`/api/recall`'s bespoke 0–1 concept scoring stays, but its output
   contract becomes "interpretation"** under the AI boundary schema, so its
   conversion to events uses the same validator constants as everything
   else — one thresholding rule, not per-endpoint judgement.

---

## 12. Implementation phases (each needs its own authorisation)

The evidence model is mostly discipline over existing APIs, so its phases
are thin and largely ride on already-designed work:

- **EV1 — Producer conformance (rides on objective layer O1).** The
  QuickFire recorder emits the §1 shape (stage + source stored as extras);
  attribution rules (§6) applied — this is the pedagogical model's
  secondary-concepts recording change, expressed as evidence discipline.
- **EV2 — AI conversion rule (rides on boundary A1/A4).** Validator-output
  → event conversion with shared threshold constants; `unclear` → no event
  guaranteed by test.
- **EV3 — Session log unification (§11.1, rides on tutor T1).** One record
  shape for events and non-events.
- **EV4 — Tracker convergence (§11.2).** Its own deliberate phase, as
  `MASTERY_ENGINE.md` already requires.

Tests: producer-boundary validity fixtures (unregistered concept throws,
invalid stage rejected); attribution table fixtures (§6, every row);
activity-mapping spot checks (support completion emits nothing; unclear
emits nothing; matching emits per-item); determinism of threshold
conversion; an architecture guard that evidence enters only through the
engine's recorders from allowlisted producers (exists — extended per phase).

---

## 13. Risks and guardrails

- **Evidence inflation.** The cheapest way to corrupt mastery is emitting
  events for non-demonstrations (screen views, mission completions,
  participation). The §2 line is the guardrail; any PR emitting evidence
  from passive activity fails review by definition.
- **Dimension creep.** Every future idea will want a new field. Tier
  policy (§9): extras are optional and non-scoring by default; scoring
  influence requires an engine phase. If a required field is proposed, the
  model has failed — stop.
- **Producer drift.** New activities hand-rolling their own recording
  instead of the canonical shape re-creates the pre-graph tag mess. The
  consumer-allowlist architecture test is the enforcement point; extending
  it is part of authorising any new producer.
- **Over-trusting stage resolution.** §4 leans on stages to express
  quality; where content mislabels stages, quality reads wrong. Mitigation
  is curation (workbook audit already validates stages), not schema.
- **Append-only discipline.** No producer or feature may edit or retract
  events to "fix" history (imports/merges go through `mergeEvidence`).
  Corrections happen by new evidence — same rule for learners and for us.

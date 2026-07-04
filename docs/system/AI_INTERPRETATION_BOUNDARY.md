# AI Interpretation Boundary — Design

**Status:** Design only — no API code, no UI, no mastery-formula change is
authorised by this document. Existing endpoints keep working; this document
defines the contract they migrate to.
**Layer:** the seam between deterministic tutor logic and AI interpretation.
**Sibling docs:** `docs/system/PEDAGOGICAL_MODEL.md` (§7 explanation
principles), `docs/system/ADAPTIVE_TUTOR_DECISION_LOGIC.md`,
`docs/system/LEARNING_OBJECTIVE_LAYER.md`, `docs/system/MASTERY_ENGINE.md`,
`docs/system/LEARNING_GRAPH.md`

## Why this exists

The app already calls AI in five places (`/api/grade`, `/api/recall`,
`/api/examiner`, `/api/guidedExamResponse`, `/api/examRoundDebrief`) — the
boundary exists de facto and is crossed inconsistently. `/api/recall` is the
model citizen: cheap model, clamped scores, a full deterministic local
fallback, never blocks the learner. `/api/grade` is the risk case: the
model's `marksAwarded` is returned to consumers at face value, with no
schema validation, no clamping against marks available, and a hard error
when the call fails. As the tutor, objective layer and pedagogical model
land, AI outputs will start feeding mastery evidence and tutor decisions —
so the seam must be formalised **before** that wiring happens, not after.

**The principle in one line: AI proposes, the engine disposes.** AI is the
app's *perception* — it converts unstructured learner language into
structured, validated claims. Everything that *decides* — evidence,
progression, selection, gating — is deterministic, testable, and explainable.

---

## 1. Ownership map

### Deterministic logic owns (never delegated)

- Correctness for every objective format (MC, true/false, matching,
  sequence, sort, fill-gap with accepted answers)
- Concept tags, `primaryConcept` / `secondaryConcepts`, `learningStage`,
  concept/misconception validity (registry membership)
- Mastery evidence writes and every derived score
- Progression: repair / diagnose / step-down / reinforce / stretch /
  review-later decisions, soft gates, unlocks, next-question policy
- Support screen selection and mission assembly
- Whether a learner is "exam-ready" or any cumulative judgement

### AI owns (interpretation of a single response, nothing cumulative)

- Classifying free-text answers (correct / partial / incorrect / unclear)
- Matching a written answer to *supplied* mark-scheme points
- Suggesting which *supplied* misconception a learner's wording reveals
- Short teacher-style feedback wording (within the §7 contract)
- Concept-presence scoring of free recall against supplied module content
  (the existing `/api/recall` job)
- Later: wording progress summaries whose *facts* are computed
  deterministically from mastery first

The distinction that keeps `/api/recall` legal: AI may interpret **one
response** (including scoring how well one answer evidences each concept);
it may never compute or update **cumulative state**. Deterministic
thresholds turn per-response interpretation into evidence; the mastery
engine remains the only accumulator.

### AI must never decide

Mastery scores · stage unlocks · next question · whether a concept or
misconception exists · exam-readiness · anything a test can't replay.
Structurally enforced: AI outputs pass through a validation gate (§5) that
only emits values from closed enums and supplied candidate lists, and the
tutor consumes the sanitised interpretation as *input*, exactly like a
correct/incorrect flag from a tapped option.

---

## 2. Which answer types use AI

| Answer type | Marking | AI call? |
|---|---|---|
| Multiple choice / true-false | Index/boolean comparison; chosen distractor → misconception via the deterministic `distractorMisconceptions` table (`PEDAGOGICAL_MODEL.md` §2) | **Never** |
| Matching / sequence / sort / column-sort | Structural comparison | **Never** |
| Short text with `acceptedAnswers` (workbook field) or component fuzzy-match | Normalised match against accepted answers first | **Only if the deterministic match is inconclusive** — a hit never calls AI |
| Short free text (no accepted-answer hit) | AI classifies: correct / partial / incorrect / unclear | Yes — small/cheap model tier |
| Free recall (`PriorKnowledgeRecall`) | AI scores concept presence against supplied module content | Yes (already live) — brought under this schema |
| Exam-style paragraph (2–12 marks) | AI matches supplied mark-scheme points, suggests supplied misconceptions | Yes |
| Essay / full-paper answer (16+ marks, levels) | AI proposes level + point matches; `requiresHumanReview` expected more often; never sole basis for readiness claims | Yes — larger model tier |

Rules of thumb: if correctness is computable, computing it is the law — an
AI call on an objective format is a defect, not a preference. And the
deterministic path always runs first where one exists; AI is the fallback
interpreter, not the primary marker.

---

## 3. The structured response schema

One versioned schema for all interpretation endpoints (grade, recall,
examiner, guided response — each uses the subset that applies):

```js
{
  schemaVersion: 1,
  verdict: 'correct' | 'partial' | 'incorrect' | 'unclear',
  confidence: 0.0–1.0,

  // Mark-scheme matching — AI SELECTS, never authors.
  // The request enumerates scheme points with ids; the response may only
  // reference those ids. Each match must carry a verbatim quote from the
  // student's answer as evidence.
  matchedMarkSchemePoints: [ { pointId, quote } ],
  missingMarkSchemePoints: [ pointId ],
  levelClaim: { level } | null,               // level-of-response schemes only; validated
                                              //   against the level count the request supplied

  // Misconception — chosen from the candidate list supplied in the request
  // (registered ids for the question's concepts), or null. Free-text
  // misconception description is not accepted.
  likelyMisconceptionId: string | null,
  misconceptionConfidence: 0.0–1.0,

  // Recall-style concept presence (recall endpoint only)
  conceptScores: [ { conceptId, score: 0.0–1.0 } ],

  studentAnswerSummary: '',      // ≤ 1 sentence, learner's own claim restated
  feedback: '',                  // §7 contract: ≤ 3 sentences
  requiresHumanReview: false,
}
```

Two deliberate differences from today's `/api/grade` shape:

- **No `marksAwarded` from the model.** For point-based schemes, marks are
  *computed deterministically* from validated `matchedMarkSchemePoints`
  (1 point = its scheme value, capped at marks available). For
  level-of-response schemes, the validated `levelClaim` maps to the level's
  mark band deterministically, defaulting to the band midpoint. The model
  identifies *which* points/level; arithmetic and caps are ours.
- **Selection over generation everywhere.** Point ids, misconception ids and
  concept ids in responses must come from the enumerated lists in the
  request. This makes "AI suggested something unregistered" a structural
  near-impossibility rather than a policing problem.

---

## 4. Request assembly — grounding by construction (anti-invention rule 1)

The request contains everything the model may use, and nothing else:

- Workbook question metadata: question text, marks, `markScheme` (as an
  **enumerated, id'd point list**, not a blob), `acceptedAnswers`,
  `misconception` string, `explanation`
- Misconception candidates: registered entries for the question's
  primary/secondary concepts (id + statement + correction)
- Canonical content pack extract for the primary concept
  (`docs/content/...` reference pack material)
- Registered concept ids + labels in scope
- The learner's answer text — and **no other learner data**: no name, no
  identifiers, no history, no mastery state, no other answers (§9)

Facts can then only enter feedback from supplied material. The system prompt
half of grounding ("use only the provided material") is necessary but not
sufficient — the request-side allowlist and the validation gate are what
make it enforceable.

---

## 5. The validation gate (deterministic, shared, runs on every response)

One pure validator module, used by every endpoint before any consumer sees
the result. It emits a **sanitised interpretation** plus a repair log:

1. **Parse & shape.** Strict JSON parse (one bracket-extraction rescue, as
   today); schema-version and field-type check; unknown fields dropped.
2. **Enums & clamps.** `verdict` ∈ enum; all confidences and scores clamped
   to [0, 1]; computed marks capped at marks available; `levelClaim.level`
   within the scheme's levels.
3. **Reference integrity.** Matched/missing point ids ⊆ supplied scheme ids
   (unknown ids dropped); `likelyMisconceptionId` ∈ supplied candidates else
   **nulled**; `conceptScores` ids ⊆ supplied concepts (as `/api/recall`
   already enforces by mapping over the supplied list).
4. **Evidence check.** Each matched point's `quote` must appear (normalised)
   in the student's answer; failing quotes demote the point to unmatched.
   Cheap, deterministic, and the single strongest anti-hallucination check —
   the model cannot "match" a point the student never wrote.
5. **Consistency.** `verdict: 'correct'` with most points missing, or
   `'incorrect'` with all points matched, is contradictory → verdict
   downgraded to `unclear`, `requiresHumanReview: true`.
6. **Feedback caps.** Length limit enforced (truncate at sentence
   boundary); empty/missing feedback is allowed (UI falls back to the
   question's own `explanation` field).

Every repair is recorded (`validation.repairs: ['nulled-misconception',
'dropped-unknown-point', …]`) and counted in telemetry — fail-quiet for the
learner, fail-loud for us. Heavy repair on a response also degrades its
effective confidence (§6).

---

## 6. Failure modes

| Failure | Handling |
|---|---|
| **Low confidence** (below per-field thresholds) | Field-level, not all-or-nothing: verdict below threshold → treated as `unclear`; misconception below threshold → nulled (a wrong misconception repair is worse than none); level claim below threshold → band floor rather than midpoint. Thresholds are named constants in the validator, tunable without touching prompts. |
| **`unclear` verdict** (from the model, from low confidence, or from consistency downgrade) | Never fake certainty. In order: (1) re-run the deterministic accepted-answer match on the normalised text; (2) for short free text, one clarification re-ask ("say a bit more about *why*") — at most one, ever, per question; (3) otherwise mark review-needed: show the mark scheme / model answer for self-comparison (existing UI pattern), record **no mastery evidence**, re-queue the objective for a later attempt. An unclear answer is missing data, not a wrong answer. |
| **Malformed output** (unparseable after rescue) | Same path as AI-unavailable, below. No retry loops — one request, one rescue attempt, then fallback. |
| **AI unavailable** (no key, network, 4xx/5xx, timeout) | Per-type deterministic fallback, generalising `/api/recall`'s local scorer, which is the house pattern: recall → keyword scorer (exists); short text → accepted-answer/keyword match with honest "I couldn't fully check this" framing; exam-style → model-answer reveal + self-mark (UI pattern exists). The app never blocks on AI and never throws marking errors at a learner — `/api/grade`'s current 500-on-failure is explicitly the behaviour this design retires. Evidence recording under fallback: deterministic outcomes record normally; self-marked outcomes record nothing. |
| **Unregistered concept/misconception in output** | Structurally prevented by selection-over-generation; if it appears anyway, the gate nulls/drops it, telemetry counts it, and **nothing is ever auto-registered** — the registries stay human-curated. |

---

## 7. Teacher-style feedback contract

Feedback is a bounded string with a fixed internal shape (aligned with
`PEDAGOGICAL_MODEL.md` §7 and `TEACHING_VOICE_GUIDE.md`):

1. **Key issue, named specifically** — the one thing that most limited the
   answer, not a list.
2. **The correct idea, simply** — one sentence, reasoning over restatement.
3. **Contrast with the misconception** — only when one was confidently
   identified; from the registry's `correction`/`contrastConcept`.
4. **One tiny next step** — a single concrete action ("name the humour
   involved and its opposite quality"), never "revise this topic".

Hard rules: ≤ 3 sentences (≈50 words); no generic flattery ("Great
effort!") — specific acknowledgement only ("You've got the imbalance idea");
hedged phrasing when confidence is medium ("It looks like…"), silence over
guessing when low; never claims about grades, levels or exam-readiness —
those are cumulative judgements and belong to deterministic layers; never
reveals mark-scheme points the learner hasn't attempted when a retest is
scheduled; sentence case throughout.

---

## 8. How the tutor decision engine consumes AI interpretation

The sanitised interpretation becomes **input** to `decideAfterAnswer` — an
optional `interpretation` field alongside `result`, present only for
AI-marked formats. The engine stays pure and deterministic: same
interpretation in, same decision out.

| Sanitised verdict | Evidence recorded (mastery engine) | Tutor treatment |
|---|---|---|
| `correct` | `recordCorrect` on the primary concept (stage-stamped) | Normal correct branch |
| `partial` | `recordIncorrect` — the objective's demand was not met; smoothing keeps one partial from reading as collapse | Gentlest incorrect path: reinforce + delayed retest, never immediate step-down/repair; feedback celebrates matched points |
| `incorrect` | `recordIncorrect` | Normal incorrect branch; a confident `likelyMisconceptionId` short-circuits `diagnose` straight into misconception repair (`PEDAGOGICAL_MODEL.md` §4) |
| `unclear` | **Nothing** | No decision beyond re-queue; the answer never counts for or against |

Additional consumption rules: `matchedMarkSchemePoints` flow into the
feedback surface and (future) per-point concept evidence *only* when scheme
points carry registered concept tags; `conceptScores` convert to
evidence/weakness logs through fixed deterministic thresholds (as
`PriorKnowledgeRecall` does today — the thresholds move into the shared
validator's constants); `requiresHumanReview` parks the answer for the
review surface and records nothing. AI confidence values are consumed
*only* by the validation gate's thresholds — they never scale mastery
evidence (no "0.7-weighted correct"), because evidence weighting is a
mastery-engine designed-for extension that must be decided there, not
smuggled in here.

---

## 9. Safety, privacy, cost

**When not to call AI:** any objective format; blank/too-short answers
(deterministic zero, already implemented); accepted-answer hits; an
identical (question, normalised answer) pair already interpreted this
device (cache hit); offline / fallback mode; and never speculatively — an
AI call happens only when a learner has just submitted interpretable text.

**Data minimisation:** requests carry the answer text and curriculum
material only. No learner name, id, email, streaks, mastery state, weakness
history, or other answers. Nothing in the request may allow cross-session
identification. Telemetry stores validation outcomes and hashes, not answer
text.

**Caching & batching:** cache key `(questionId, normalised answer,
schemaVersion)` — retries, back-navigation and repeat attempts of the same
wording are free; batch end-of-round synthesis into one call
(`/api/examRoundDebrief` already does — keep it the pattern for anything
summarising N answers); future progress summaries are computed
deterministically from mastery first, with one AI call only to *word* them.

**Cost control:** model tiering by job — small/cheap tier for
classification and recall scoring (recall already runs the cheap tier;
grade currently runs a large model for jobs the small tier can do — a
migration target), larger tier only for essay/level marking; `max_tokens`
caps per endpoint (exist); a per-session AI-call budget with deterministic
fallback beyond it; the §2 table itself is the biggest cost lever — most
answers in the app are objective formats and cost nothing.

**Graceful degradation is a product feature:** the learner experience is
designed to be complete without AI (deterministic marking + model-answer
self-comparison + honest framing), so an outage degrades quality of
feedback, never availability of learning.

---

## 10. Implementation phases

Each phase needs its own explicit authorisation; none is authorised here.

- **A1 — Shared validation gate.** The §5 validator as a pure module +
  schema `v1`; retrofit `/api/grade` to recall-parity (clamps, fallback,
  no 500s to learners). Highest value: it fixes today's riskiest path
  without touching prompts or UI behaviour.
- **A2 — Enumerated mark schemes.** Id'd point lists + quote evidencing in
  the grade/examiner request-response contract; deterministic marks
  computation. Content-side: mark schemes stored as point arrays (many
  already are structurally close).
- **A3 — Misconception candidates.** Supply registered candidates in
  requests; `likelyMisconceptionId` flows through the gate into the tutor's
  repair short-circuit. Needs the pedagogical model's P1 registry.
- **A4 — Verdict → evidence wiring.** The §8 consumption table lands with
  the tutor decision engine (T-phases); `unclear` no-evidence rule and the
  single-clarification re-ask.
- **A5 — Feedback contract adoption.** §7 shape enforced across endpoints;
  prompt rewrites are authorised here, not before.
- **A6 — Cache + session budget + model-tier migration.**

Required tests (with A1, extending per phase): validator unit tests —
enum/clamp/reference-integrity/quote-evidence/consistency rules, each with
fixtures; malformed-payload and fallback-path tests per endpoint;
determinism (same raw response → same sanitised result); architecture guard
that no consumer reads a raw AI response (imports must go through the
validator module); tutor-side fixtures for the §8 verdict table, including
`unclear` recording nothing.

---

## 11. Risks and trade-offs

- **The seam drifts.** New features will be tempted to "just ask the model"
  for a decision (selection, gating, readiness). Guard: the §1 never-list
  is testable — decisions must come from pure functions with fixtures; any
  PR routing a progression decision through an AI response fails review by
  definition.
- **Partial answers under-credited.** Mapping `partial` → `recordIncorrect`
  is conservative; per-point concept evidence (A2+, tagged scheme points)
  is the designed refinement if telemetry shows partials dominating.
- **Clarification fatigue.** Bounded at one re-ask per question, ever;
  beyond that, review-needed. If unclear rates run high, the fix is better
  `acceptedAnswers` coverage, not more dialogue.
- **Quote evidencing vs paraphrase.** Requiring verbatim quotes may
  under-match heavily paraphrased answers; normalised matching softens
  this, and a failed quote only demotes one point, never the whole answer.
  Accepted trade-off: under-matching is recoverable (retest), invented
  matches are not.
- **Fallback quality gap.** Local keyword scoring is honest but crude;
  learners in fallback get blunter marking. Mitigated by framing (the
  fallback never pretends to be full marking) and by the objective-format
  majority costing nothing.
- **Existing endpoints predate this contract.** Until A1/A2 land, current
  behaviour (face-value marks from `/api/grade`) persists. The design
  deliberately sequences the validator first so the highest-risk gap closes
  before any new AI consumption is wired.

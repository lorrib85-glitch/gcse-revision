# Learning Objective Layer — Design

**Status:** Design only — nothing implemented. No UI, no question-selection
change, no mastery-formula change is authorised by this document.
**Layer:** concept → learning objective → question → tutor decision.
**Sibling docs:** `docs/system/LEARNING_GRAPH.md`,
`docs/system/MASTERY_ENGINE.md`, `docs/system/ADAPTIVE_TUTOR_DECISION_LOGIC.md`
(updated alongside this doc to add the `diagnose` action).

## Why this exists

Today the app can say a learner is weak on
`history:medicine:four-humours`. It cannot say *what kind* of weak: they can
recite the four humours but can't apply imbalance → treatment choice, or they
can pick the theory out of a list but can't explain it. Those are different
gaps needing different repairs — and the workbook already encodes the
distinction (`primaryConcept` × `learningStage` on every synced row). This
layer names that pair, tracks evidence against it, and lets the tutor act on
it, without inventing a second taxonomy.

```
Learning graph      concepts (what the curriculum contains)
      ↓
Objective layer     concept × stage (what "knowing it" means at each demand level)  ← this design
      ↓
Questions           primaryConcept + learningStage (already authored per workbook row)
      ↓
Mastery engine      evidence per concept, stage-stamped per attempt
      ↓
Tutor decisions     per-objective windows; diagnose / repair / step-down target a stage, not a whole concept
```

---

## 1. Are explicit objective IDs needed?

**Mostly no — objectives should be *derived*, with a small optional registry
for labels and diagnostic hints.**

The decisive facts:

- Every workbook-synced question already carries `(primaryConcept,
  learningStage)`. The question → objective mapping exists today with zero
  new authoring; an objective *registry* as a gatekeeper would add ~77
  concepts × 6 stages = ~460 rows of pure ceremony (the explosion the
  guardrail forbids).
- The mastery engine keys evidence by registered concept id and derives
  everything else at read time. Splitting evidence across six per-stage ids
  would fragment the concept's history (a learner with 12 attempts would look
  `unseen` at five of six stages) and force registering objectives as
  concepts — polluting the registry and breaking "concepts say what
  knowledge, facets say how".
- What *does* need human authoring is small: a learner-facing label for the
  cells that matter ("Apply the Four Humours theory to symptoms or treatment
  choices"), and which stage cells are exam-relevant at all. That is
  enrichment, not identity.

So: **an objective is the pair `(conceptId, stage)`**, valid for any
registered concept and any of the six stages, with a sparse registry that
decorates the cells worth decorating. Nothing is gated on registration;
nothing explodes.

### Rejected alternatives

- **Four-segment concept ids** (`history:medicine:four-humours:apply`):
  collides with the learning graph's reserved fourth segment for
  *sub-scoping* (`use sparingly`), makes stage indistinguishable from
  content, forces full registration, and fragments mastery evidence. Rejected.
- **Free-standing objective registry with its own id scheme**: a third
  vocabulary to keep in sync with two existing ones. Rejected.
- **`learningStage` alone, no objective notion at all**: works for questions
  but leaves nothing to hang per-stage mastery, support-screen stage
  targeting, or diagnostic candidates on. The pair needs a name; it doesn't
  need a bureaucracy.

---

## 2. Objective ID format

Canonical serialisation of the pair, used in decision objects, telemetry,
registry keys and review-later parking:

```
<registered-concept-id>@<stage>
history:medicine:four-humours@apply
```

- `@` deliberately breaks the colon pattern: an objective id is **not** a
  concept tag. It must never appear in a `tags` array, never be recorded as a
  mastery-engine concept id, never enter the concept registry. The visual
  difference makes misuse greppable and testable.
- Parsing is `id.split('@')` → `[conceptId, stage]`; both halves validate
  against existing sources of truth (`isConceptId`, the stage list).
- The stage vocabulary **is** the existing `learningStage` enum —
  `recognise | recall | understand | apply | analyse | evaluate` — reused
  unchanged (requirement: reuse `learningStage` where sensible). One new
  rule: this list must be promoted from its current home (a `Set` inside
  `tests/architecture/quickfire-workbook-sync.test.js`) to an exported
  `LEARNING_STAGES` constant in `src/data/learningGraph/` so the schema, the
  sync test, the objective layer and the tutor all import one list.
- The existing `skill:` facet (`skill:recall`, `skill:application`,
  `skill:analysis`, …) is a *different, older, descriptive* vocabulary and is
  **not** the objective stage axis. It stays a facet; `learningStage` on the
  row is authoritative for objectives. (Gap noted in §6.)

---

## 3. Data model

### 3.1 Derived objectives (the default — no data)

`objectiveOf(question)` ≡ `(question.primaryConcept, question.learningStage)`.
Any `(registered concept, valid stage)` pair is a valid objective. No storage,
no registration, no new file required for the layer to function.

### 3.2 Sparse objective registry (optional enrichment)

```
src/data/learningGraph/objectives/historyMedicine.js   (future file — design only)
```

```js
export const HISTORY_MEDICINE_OBJECTIVES = [
  {
    id: 'history:medicine:four-humours@apply',
    concept: 'history:medicine:four-humours',
    stage: 'apply',
    label: 'Apply the Four Humours theory to symptoms or treatment choices',
  },
  // Registration itself is the exam-relevance signal: curation only adds
  // cells that are genuinely assessed at GCSE.
  // …only cells a human chose to describe. Absent cells remain valid,
  // just unlabelled.
]
```

Rules (mirroring the concept registry's):

- `concept` must be registered; `stage` must be in `LEARNING_STAGES`;
  `id` must equal `concept + '@' + stage`; no duplicates. Guarded by an
  architecture test, same style as `learning-graph.test.js`.
- Registration is **never required** for a question, screen, or decision to
  reference an objective. The registry answers "what should we call this cell
  to a human?" and "did curation judge this cell exam-relevant?" — nothing
  else. Consumers needing a label for an unregistered cell fall back to
  `"<concept label> — <stage>"`.
- Start with Medicine Episode 1 concepts only (§9). Adding cells for a new
  episode is content work, not schema work.

### 3.3 Question mapping (already exists)

- **Primary objective:** `(primaryConcept, learningStage)` — one per synced
  row, derived, nothing to author (§4).
- **Secondary objectives:** deliberately **not** derived as
  `(secondaryConcept, learningStage)`. A question's stage describes the
  demand placed on the *primary* concept; the secondaries are context. If the
  workbook later wants to assert a real secondary objective (rare), it adds
  an explicit optional column (`secondaryObjectives: ['history:medicine:galen@recall']`)
  — until then, secondary concepts carry no stage claim.

### 3.4 Support screen mapping (small additive field)

Support-map screens gain an **optional** `stages` array during their existing
human review pass (`status: 'draft-human-review'`):

```js
{ screenIndex: 5, label: 'Explore the Humours',
  purpose: 'Applies the four humour model to symptoms and treatment logic.',
  conceptTags: ['history:medicine:four-humours', 'history:medicine:bloodletting'],
  stages: ['apply'] }                    // ← new, optional
```

The `purpose` strings already imply stages ("Retrieval check…" → recall,
"Teaches…" → understand, "Applies…" → apply, exam-prep parts → analyse/
evaluate), so curation is transcription, not invention. Screens without
`stages` behave exactly as today (stage-agnostic).

`conceptRepairLookup` gains an optional stage preference —
`getBestSupportScreen(conceptId, { stage })`: exact `(concept, stage)` screen
match → concept match without stage data → parts → null. Deterministic
ordering preserved; the existing one-argument call is unchanged.

### 3.5 Mastery evidence (see §6)

No new store. Objective mastery is a **derived read view** over the existing
per-concept evidence, using the stage stamped on each attempt.

---

## 4. How workbook rows map to objectives

Nothing changes in the workbook or the sync. The mapping is a definition:

| Workbook fields (already synced) | Objective meaning |
|---|---|
| `primaryConcept` + `learningStage` | The row's **primary objective** — the one cell this question is evidence for |
| `secondaryConcepts` | Context only — concept-level, **no stage claim** (§3.3) |
| `difficultyLevel` | Orthogonal to the objective — difficulty *within* a cell (a hard recall question is still recall) |
| `followUpConcept` | Unchanged — a concept, not an objective; the tutor pairs it with a stage at decision time |
| `misconception` | Unchanged — passes through decisions as today |

Existing sync-test invariants (`primary ⊆ tags`, valid stage, registered ids)
already guarantee every synced row yields a well-formed objective. One new
sync-test assertion when the registry exists: any row whose
`(primaryConcept, learningStage)` matches a registered objective cell is
consistent with it (trivially true — the check is that the registry's `id`
composition rule holds).

---

## 5. How content support maps map to objectives

Via §3.4's `stages` field: a screen supports objective `c@s` when
`conceptTags` includes `c` and (`stages` includes `s`, or the screen has no
`stages` data). Parts (stage ranges) stay concept-level only — a six-screen
part is too broad to claim a single cognitive stage honestly.

Worked example (Episode 1, Four Humours):

| Screen | `stages` | Supports |
|---|---|---|
| 4 — "The Four Humours" (teaches balance/imbalance) | `['understand']` | `four-humours@understand` |
| 5 — "Explore the Humours" (applies model to symptoms/treatment) | `['apply']` | `four-humours@apply` |
| 6 — "Hippocrates — quick check" (retrieval) | `['recall']` | `four-humours@recall` |

A repair for `four-humours@apply` now lands on screen 5, not screen 4 — the
crude version of this (concept-only lookup) sends the learner back to theory
they already know.

---

## 6. How mastery evidence evolves

Three small, ordered steps — none changes a formula:

1. **Stage stamping (write side).** The recorder passes the question's
   `learningStage` as an extra per-result field on `recent` entries
   (`{ correct, at, stage }`). `MASTERY_ENGINE.md` already documents that
   extra per-result fields are tolerated without a data migration, and
   `recordAttempt` tolerates extra options. This was already sketched as the
   tutor design's phase T5; this document is its real motivation. Entries
   recorded before stamping simply lack `stage` — they remain valid
   concept-level evidence.
2. **Objective read view (read side).** One new pure read function in the
   engine's insight layer, keeping "weak" defined in one place:
   `getObjectiveMastery(state, conceptId, stage)` → same shape as
   `getConceptMastery` plus `{ stage, stageEvidence: 'exact' | 'none' }`.
   Derived only from `recent` entries stamped with that stage; when no
   stamped entries exist it returns the concept-level snapshot with
   `stageEvidence: 'none'` — honest fallback, never a guess. (A ranking
   query — `identifyWeakObjectives` — is deliberately deferred to whichever
   future phase actually consumes it, e.g. the planner.)
3. **Deferred, explicitly out of scope now:** per-stage lifetime counters
   (would need a `MASTERY_STATE_VERSION` bump — not justified while the
   10-entry window is the only per-stage source), and cross-stage inference
   (success at `apply` implying competence at `recall`; designed-for later —
   the stage ladder is roughly cumulative, but inferring it changes what
   "evidence" means and deserves its own decision).

Storage shape, formulas, and the existing public API are untouched; mastery
and confidence math is reused verbatim on the filtered window.

**Vocabulary gap (flagged, not fixed here):** the legacy `skill:` facet uses
`application`/`analysis` where `learningStage` uses `apply`/`analyse`. The
objective layer reads only `learningStage`; the facet stays descriptive. Any
future reconciliation replaces facet values, never the stage enum.

---

## 7. How tutor decisions consume objectives

The tutor design (`ADAPTIVE_TUTOR_DECISION_LOGIC.md`) already filters its
windows by `primaryConcept` and uses `learningStage` for gating — it was
implicitly objective-shaped. This layer makes it explicit:

- **Windows become per-objective with concept fallback.** Signals
  (`repairNeeded`, `secureNow`, …) compute over attempts matching
  `(primaryConcept, learningStage)` first; when that window has fewer than 2
  entries, fall back to the concept-level window (current behaviour). This
  directly kills the crude assumption: a wrong `four-humours@apply` answer
  drives apply-cell signals, not a verdict on the whole concept.
- **`conceptSnapshot` gains the objective view**: decisions carry
  `objective: { id, stage, stageEvidence }` alongside the existing snapshot,
  so consumers and tests can see which cell the decision was about.
- **Repair targets a cell.** Support resolution passes the stage
  (§3.4/§5); the repair `support` object is unchanged in shape but better
  aimed. Step-down policy already emits a lower stage — now it names the
  lower *objective* (`preferredLearningStage` unchanged, plus the derived id
  in `nextQuestionPolicy` for logging).
- **Stretch/review-later park objectives, not concepts** where stage evidence
  exists: `reviewLater: { objectiveId | conceptId, minGapAttempts }` — a
  learner strong at `four-humours@recall` but untested at `@apply` should be
  parked at recall and probed at apply, not parked wholesale.
- **New action: `diagnose`** (§8) — added to `TUTOR_ACTIONS` in the tutor
  design, updated alongside this document.

---

## 8. How `diagnose` works

**Problem:** a wrong answer on a multi-concept question (e.g. Galen + Four
Humours + Theory of Opposites, stage `apply`) is ambiguous — the gap could be
any of the concepts, or the apply-stage skill itself. Repairing all three is
noise; repairing the primary by default is a guess.

**Definition:** `diagnose` = *before repairing, ask one cheap, targeted,
single-concept question that discriminates between candidate gaps.*

### Trigger (inserted into the incorrect-branch rule table, after the
repeat-park guard and before repair)

Diagnose fires only when the failure is genuinely ambiguous — all of:

1. Answer incorrect.
2. **≥ 2 candidate gaps** exist. Candidates are drawn from, in order:
   - the primary objective `(primaryConcept, learningStage)`;
   - a lower-stage objective of the same concept
     (`primaryConcept@understand`-ish floor probe) when `learningStage ≥
     apply` **and** the lower cell has `stageEvidence: 'none'` — "can't apply
     it" vs "never understood it" is the stage-axis ambiguity;
   - each `secondaryConcept` whose concept-level strength is `unseen`, `weak`
     or `developing` — a secure secondary is not a plausible culprit.
3. **The primary is not already the clear culprit**: primary strength is not
   `weak`/`unseen` (if it is, skip diagnose — repair it directly, as today),
   and no candidate's mastery separates from the rest by more than a
   `DIAGNOSE_SEPARATION` threshold (if one candidate is obviously weakest,
   diagnosis is already done).
4. **Budget available**: fewer than `MAX_DIAGNOSTIC_PROBES = 2` diagnostic
   probes issued for this candidate cluster this session (derived from
   `sessionAttempts[].action` echoes, same mechanism as the repair-loop
   guard).

Otherwise the existing incorrect-branch rules apply unchanged.

### Decision output

```js
{
  action: 'diagnose',
  reason: 'incorrect-ambiguous-diagnose',
  // …standard fields (question, primaryConcept, misconception, …)
  diagnosis: {
    candidates: [                       // deterministic: ascending mastery, then id
      { objectiveId: 'history:medicine:theory-of-opposites@recall', mastery, stageEvidence },
      { objectiveId: 'history:medicine:four-humours@understand',   mastery, stageEvidence },
      { objectiveId: 'history:medicine:galen@recall',              mastery, stageEvidence },
    ],
    probe: {                            // what to ask next
      conceptId: 'history:medicine:theory-of-opposites',   // first candidate
      stage: 'recall',                  // probes are always recognise/recall —
      singleConcept: true,              //   cheap, unambiguous, single-concept
    },
  },
  nextQuestionPolicy: {
    preferredConcept: probe.conceptId,
    preferredLearningStage: probe.stage,
    requireSingleConcept: true,         // NEW policy field: selector should prefer a
                                        //   question with no secondaryConcepts so the
                                        //   result attributes cleanly
    preferredDifficultyRange: [1, 2],
    avoidHigherStagesTemporarily: true,
  },
}
```

### The loop, bounded

1. Probe answered **wrong** → the candidate is confirmed as the gap → next
   decision is a normal `repair`/`step-down` for that candidate's objective
   (the standard rules produce this naturally: the probe's primaryConcept is
   now demonstrably weak).
2. Probe answered **right** → that candidate is exonerated (and, bonus,
   gained positive evidence) → if another candidate remains and the probe
   budget allows, diagnose again with the next candidate; otherwise fall
   through to **repair the weakest remaining candidate anyway** — diagnosis
   must never become a filibuster. Best guess beats no action.
3. `MAX_DIAGNOSTIC_PROBES` caps the cluster per session; the park guard (I0)
   still outranks everything.

### Worked example (the brief's case)

Wrong on a `difficultyLevel 4`, `analyse`-stage question, primary
`history:medicine:galen`, secondaries `[four-humours, theory-of-opposites]`,
learner's Galen strength `developing`, others thin:

- Candidates: `galen@understand` (lower-stage floor probe, no stage
  evidence), `four-humours@understand`, `theory-of-opposites@recall` —
  ordered by ascending mastery.
- Decision: `diagnose`, probe = single-concept recall question on the
  weakest candidate (say theory-of-opposites).
- Wrong → repair points at Episode 1 screen 8 ("Think Like Galen", stages
  `['apply']`) or screen 7 (`['understand']`) per §5's stage-aware lookup.
- Right → next candidate probed once more at most; then repair the weakest.

No instant "repair all three" — exactly the behaviour the brief requires.

---

## 9. Example objective sets (Medicine Episode 1 only)

Sparse by design: only exam-relevant cells get registry entries; everything
else stays derivable but unlabelled. Three or four cells per concept is the
expected ceiling, not the floor.

### `history:medicine:four-humours`

| Cell | Label |
|---|---|
| `@recall` | Name the four humours and state that imbalance was believed to cause illness |
| `@understand` | Explain how humoural imbalance explained symptoms, and balance meant health |
| `@apply` | Apply the Four Humours theory to symptoms or treatment choices (e.g. imbalance → bloodletting/purging) |
| `@analyse` | Analyse why humoural theory persisted as mainstream medicine for centuries |

### `history:medicine:galen`

| Cell | Label |
|---|---|
| `@recall` | Recall who Galen was and that the Theory of Opposites was his |
| `@understand` | Explain why Galen's ideas contained errors (animal dissection) and why the Church endorsed them |
| `@analyse` | Analyse why Galen's authority survived c1,500 years (Church control, banned dissection, book learning) |

### `history:medicine:miasma`

| Cell | Label |
|---|---|
| `@recognise` | Recognise miasma as the "bad air" explanation of disease |
| `@recall` | Recall miasma-driven responses (sweet smells, cleaning streets) |
| `@understand` | Explain how miasma differs from germ theory and why it seemed plausible |

### `history:medicine:god-punishment`

| Cell | Label |
|---|---|
| `@recall` | Recall that disease was explained as God's punishment for sin |
| `@understand` | Explain how the God-punishment belief shaped responses (prayer, pilgrimage, flagellants) |
| `@analyse` | Analyse how religious explanations reinforced continuity in medieval medicine |

(Where an analyse-cell overlaps `church-authority` or `factors-in-change`,
the atom-specific cell stays narrow and the synthesis skill remains the
`factors-in-change` concept — the registry comment in
`concepts/historyMedicine.js` already draws this line.)

Deliberate omissions: `@evaluate` cells are absent — at GCSE, evaluation is
assessed through the 16-mark factor-weighing essays, which the graph already
represents as `factors-in-change` + `exam-type:` facets, not per-atom cells.
`@recognise` appears only where a real recognise-stage question exists
(miasma has one; the others don't yet).

---

## 10. Implementation phases

Each phase needs its own explicit authorisation; this document authorises
none. Ordering reconciles with the tutor design's phases (its T5 becomes O1
here — the tutor doc is updated to cross-reference).

- **O1 — Stage stamping.** `LEARNING_STAGES` exported from
  `learningGraph/` (sync test imports it); recorder stamps `stage` onto
  evidence entries. Smallest possible diff, unlocks everything else.
- **O2 — Objective read view.** `getObjectiveMastery` in the engine's
  insight layer, with the `stageEvidence` fallback contract. Pure read
  addition; formulas reused.
- **O3 — Objective registry (Ep 1).** `objectives/historyMedicine.js` with
  the §9 cells + architecture guard test. Labels only; nothing gates on it.
- **O4 — Stage-aware support.** `stages` arrays curated onto Ep 1–2 support
  screens during their human review; `getBestSupportScreen(conceptId,
  { stage })` preference order.
- **O5 — Tutor consumes objectives + `diagnose`.** Per-objective windows
  with concept fallback, `diagnose` rule row, `requireSingleConcept` policy
  field. Lands with the tutor decision engine build (its T1), not after it —
  designing the windows twice would be waste.
- **O6 — Diagnostic pool curation.** Workbook pass ensuring each Ep 1
  concept has at least one single-concept recognise/recall row for probes
  (most already exist; this is verification plus gap-filling, content work).

---

## 11. Tests required

- **Registry guard (architecture, with O3):** every objective entry has a
  registered concept, valid stage, `id === concept + '@' + stage`, no
  duplicates; the file imports nothing outside `learningGraph/`.
- **Objective id hygiene (architecture):** no `@`-form id ever appears in a
  `tags` array, in the concept registry, or as a recorded mastery concept id
  (grep-style guard, same spirit as the facet-namespace collision test).
- **Engine read view (unit, with O2):** `getObjectiveMastery` uses only
  stage-stamped entries for `stageEvidence: 'exact'`; falls back with
  `'none'` when unstamped; deterministic; mixed stamped/unstamped states
  behave (pre-O1 evidence keeps working).
- **Recorder stamping (unit, with O1):** stamped entries round-trip through
  save/load; old states without stamps load unchanged.
- **Support lookup stage preference (unit, with O4):** exact
  `(concept, stage)` beats stage-agnostic beats parts; one-argument call
  unchanged.
- **Tutor diagnose rules (unit, with O5):** trigger fires only under §8's
  four conditions (each condition has a negative fixture); candidate ordering
  deterministic; probe budget enforced via action echoes; exoneration path
  falls through to repair-weakest; per-objective windows fall back to concept
  windows below 2 entries.
- **Sync test extension (with O3):** registry cells compose correctly against
  synced rows.

---

## 12. Risks and guardrails

- **Taxonomy explosion.** The registry is enrichment, never a gate; start
  Ep 1 only; ~3–4 cells per concept; `@evaluate` deliberately unpopulated.
  If the registry ever needs a row for the layer to *function*, the design
  has drifted — stop.
- **Sparse per-stage evidence.** Ten-entry windows split across six stages
  are thin. Guardrails: `stageEvidence: 'none'` fallback to concept level
  (never fabricate stage confidence), diagnose probes generate stage-stamped
  evidence as a side effect, and per-stage lifetime counters stay deferred
  until the window demonstrably starves decisions.
- **Second source of truth.** Objective mastery is a derived filter over
  concept evidence — no objective store, ever. The engine's existing
  storage-boundary and allowlist tests extend naturally.
- **Diagnose filibuster.** Bounded probes (`MAX_DIAGNOSTIC_PROBES = 2` per
  cluster per session), park guard outranks diagnose, and exhausted budgets
  repair the weakest candidate — the learner always reaches a repair or moves
  on.
- **Diagnostic pool gaps.** A probe needs a single-concept recognise/recall
  question for the candidate; where none exists the diagnose trigger simply
  can't be satisfied by the selector and the decision falls through to
  today's repair-primary behaviour. O6 measures and fills these gaps;
  `requireSingleConcept` is a preference, not a hard filter.
- **Stage vocabulary drift.** One exported `LEARNING_STAGES` list (O1); the
  `skill:` facet is explicitly non-authoritative; any tutor/registry/support
  stage value validates against the single list.
- **Misattributing secondary failures.** Unchanged from the tutor design:
  secondaries never trigger repair directly — diagnose exists precisely so
  suspicion of a secondary is *tested*, not assumed.

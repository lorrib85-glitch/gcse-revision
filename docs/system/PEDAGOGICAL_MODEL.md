# Pedagogical Model — Design

**Status:** Design only — nothing implemented. No UI, no learning-graph,
mastery-engine or tutor-logic change is authorised by this document.
**Layer:** the educational reasoning that sits across concepts → objectives →
questions → support screens → tutor decisions, for **every** subject.
**Sibling docs:** `docs/system/LEARNING_GRAPH.md`,
`docs/system/MASTERY_ENGINE.md`, `docs/system/ADAPTIVE_TUTOR_DECISION_LOGIC.md`,
`docs/system/LEARNING_OBJECTIVE_LAYER.md`,
`docs/system/LEARNING_EXPERIENCE_PRINCIPLES.md`, `docs/system/TEACHING_VOICE_GUIDE.md`

## Why this exists

The stack below this document answers *what*: what the curriculum contains
(graph), what the learner knows of it (mastery), what cell a question tests
(objectives), what to do after one answer (tutor). None of it yet answers
*why* — why the learner got it wrong, and what an experienced teacher would
do about it. A teacher who sees a student pick "humours were germs" doesn't
think "weak on Four Humours, re-teach Four Humours". They think: *that's the
germ-theory back-projection mistake; correct that one wrong idea, contrast it
with the right model, then make them use it.* This document designs that
reasoning — as policy over the existing layers, not as a new engine.

```
Learning graph          what the curriculum contains
Objective layer         what "knowing it" means at each cognitive demand
Questions / screens     the evidence sources and teaching assets
Mastery engine          what this learner's evidence says
Tutor decision engine   what to do after one answer
──────────────────────────────────────────────────────
Pedagogical model       WHY they got it wrong; what a teacher does next   ← this design
```

**Design stance (per the brief, applied throughout):** wherever a new
registry competes with deriving the same information from what already
exists, derive. The model below adds exactly one sparse registry
(misconceptions), a handful of mission *templates*, and policy revisions —
nothing else.

---

## 1. Overall educational architecture

A teacher's loop, mapped onto the existing machinery:

| Teacher's move | System realisation |
|---|---|
| **Notice** the error | Question result + objective cell (`concept@stage`) — exists |
| **Diagnose** why | §4: passive first (which wrong answer was chosen), active probe second (the tutor's `diagnose`) |
| **Choose a treatment** | §5: repair *types* matched to the diagnosis, drawn from existing components |
| **Sequence** the treatment | §3: a short mission assembled from a fixed template — correct the model → re-anchor → retrieve → apply → verify |
| **Space** the verification | §6: delayed retest before repair; post-repair checks pushed to later in the session and to the next session's recall slot |
| **Explain** like a person | §7: contract for future AI explanations, grounded in the canonical content packs |

The learning hierarchy already in CLAUDE.md (retrieval → understanding →
application → exam technique) and the stage ladder (recognise → … →
evaluate) are the same idea at different resolutions; this model uses the
stage ladder as its single axis of cognitive demand and never invents a
second one.

---

## 2. Misconceptions — first-class, but sparse

### Verdict

**Yes — misconceptions become reusable objects, under strict smallness
rules.** Strings on questions stay and keep working forever; ids are added
only where reuse pays.

### Why strings alone are not enough

A misconception is the one place where "what they got wrong" and "why" are
the same fact. Three benefits require identity, and none is achievable with
per-question strings:

1. **Distractor diagnosis (the big one).** A multiple-choice question's
   wrong options can each be tagged with the misconception they reveal.
   The learner who picks "to remove infected blood" on a bloodletting
   question has *told you their wrong model* — diagnosis is instant, free,
   and requires no extra question. Strings can't be matched across
   questions; ids can.
2. **Aggregation.** Two wrong answers on different questions revealing the
   same wrong model ("humours were germs") should accumulate as one belief
   to correct, not two unrelated weak spots.
3. **Reusable correction.** The contrast copy that corrects a misconception
   ("bloodletting wasn't about infection — germs weren't known; it was about
   rebalancing…") is authored once and reused by every question, mission and
   future AI explanation that hits it.

The raw material already exists and is already curated: the canonical
content packs carry per-episode "common exam misconceptions" lists with
truth-status (Episode 1 has four, e.g. *"Physicians treated patients" —
FALSE: physicians diagnosed; barber surgeons and apothecaries treated*), and
every workbook row carries a `misconception` string. Making them
first-class is mostly transcription, not invention.

### Shape

Following the objective layer's precedent — a distinct id syntax marking a
distinct type, owned by a concept, never a tag:

```
<registered-concept-id>~<slug>
history:medicine:four-humours~humours-are-germs
history:medicine:bloodletting~removed-bad-blood
history:medicine:galen~invented-four-humours
```

Sparse per-course registry (future file, design only —
`src/data/learningGraph/misconceptions/historyMedicine.js`):

```js
{
  id: 'history:medicine:four-humours~humours-are-germs',
  concept: 'history:medicine:four-humours',
  statement: 'The four humours were an early idea of germs.',
  correction: 'Humours were believed to be real body fluids whose balance meant health — nothing to do with infection. Germs were unknown until the 1860s.',
  contrastConcept: 'history:medicine:germ-theory',   // optional — powers comparison repair
}
```

Rules: `concept` registered; `id = concept + '~' + slug`; ids never appear
in `tags` arrays, the concept registry, or mastery evidence keys (same
hygiene guard style as objective ids); registration is enrichment — an
untagged misconception string on a question keeps exactly today's behaviour.

Questions gain two **optional** fields when curation reaches them:
`misconceptionId` (upgrading the existing string) and
`distractorMisconceptions` (wrong-option index → misconception id, MC
formats only). Both nullable forever.

**Where evidence lives:** misconception *observations* are recorded through
the existing `unifiedWeaknessTracker` channel in the near term (it is
already the behavioural misconception log). Folding tracker strings onto
registry ids is the long-promised tracker/mastery convergence — this
registry is where that convergence will eventually happen, but that remains
its own deliberate future phase (per `MASTERY_ENGINE.md` rule 5), not part
of this design.

---

## 3. Learning missions — hybrid: hand-authored templates, dynamic filling

### The problem with routing to one screen

"Go re-read screen 5" is not teaching. A teacher runs a short arc: fix the
wrong idea, re-anchor the right one, retrieve it cheaply, use it, verify at
the level that failed. But hand-authoring a mission per concept (~77
concepts × several intents) is the explosion this architecture forbids, and
fully dynamic assembly risks pedagogically incoherent sequences.

### Verdict: hybrid

- **Templates are hand-authored** — a handful, pedagogy in code-shaped form,
  subject-independent. Expected full set is 3–5, e.g.:

| Template | Slots (in order) | Used when |
|---|---|---|
| `repair-model` | misconception correction → explain screen (`c@understand`) → retrieval q (`c@recall`) → apply q (`c@stage`) | diagnosed misconception |
| `rebuild` | explain screen (one stage below failure) → retrieval q → target-stage q | understanding gap, no misconception |
| `refresh` | 2–3 retrieval questions (`c@recall`), no teaching | decayed recall on previously secure cell |
| `stretch` | apply/analyse q → worked example → exam-style q | secure learner moving up |

- **Slots are filled dynamically** at decision time from what exists: the
  stage-aware support lookup supplies screens; the question banks supply
  `(concept, stage)`-matched questions; the misconception registry supplies
  correction/contrast copy. Unfillable slots are **skipped, never blocking**
  — a mission degrades gracefully down to today's single-step repair when
  content is thin (which, outside Medicine Ep 1–2, it will be).
- **Missions are ephemeral and derived** — assembled, executed, discarded.
  No mission store, no mission ids, no authored mission files. A mission is
  just the multi-step generalisation of one tutor decision; the assembler is
  a thin pure layer between the decision engine and the consumer.

**Challenged assumption:** missions do *not* need to be a learner-facing
feature ("Mission: Understand Four Humours" with chrome and progress) to pay
their way. They should first exist as invisible sequencing — the tutor
serving a coherent 3–5 step arc instead of one step. Surface them as a named
UI object only if the sequencing proves valuable; that is a separate,
later product decision.

---

## 4. Diagnostic model

Ordered by cost — the fast, invisible layers do almost all the work, and the
learner is only ever *asked* something when cheaper signals ran out:

1. **Distractor analysis (free, instant).** If the chosen wrong option
   carries a `distractorMisconception`, diagnosis is complete at the moment
   of answering: skip the tutor's `diagnose` probe entirely and go straight
   to `repair` with that misconception attached. The wrong answer *is* the
   diagnosis. This should become the most common diagnostic path as tagging
   coverage grows.
2. **Evidence windows (free, already designed).** The objective layer's
   per-cell windows and `stageEvidence` fallback locate the failure on the
   stage ladder without asking anything.
3. **Active probe (costs one question, budgeted).** The tutor's `diagnose`
   action, unchanged: single-concept recognise/recall probes, max 2 per
   cluster per session, then repair the weakest candidate anyway.

How the six failure modes in the brief are distinguished:

| Failure mode | Signal | Path |
|---|---|---|
| Doesn't recognise | Fails a `recognise`-stage item / probe | rebuild from the floor |
| Can't recall | `recognise` fine, `recall` window weak | `refresh` template |
| Misunderstands | Tagged distractor chosen, or `understand` cell fails while `recall` holds | `repair-model` / `rebuild` |
| Can't apply | Lower cells hold, `apply` cell fails | `rebuild` anchored at apply, worked-example repair (§5) |
| Guessed correctly | **Not directly detectable** — treated structurally: one correct on thin evidence never reads as secure (Laplace smoothing + the tutor's reinforce-after-struggle rule already demand confirmation) | no special path; confirmation question does the work |
| Confused two concepts | Distractor tagged with the *other* concept's misconception (e.g. attributes Theory of Opposites to Hippocrates), or `diagnose` candidates spanning both | comparison repair (§5), probing only if untagged |

**Guessing, challenged:** detecting lucky guesses properly needs response
time or a confidence tap ("sure / not sure" — one optional press, a classic
teacher trick). Both are already reserved as mastery-engine designed-for
extensions (extra per-result fields). They are worth adding *eventually*,
but the structural guard — thin evidence is never secure — already prevents
a guess from unlocking anything, so neither is required for this model to
work. Do not build them for v1.

**Anti-annoyance rules:** never more than one probe between the wrong answer
and *something that helps*; probes are always cheap (recognise/recall,
difficulty 1–2, single-concept); the probe budget and park guard are
inherited from the tutor design; and a diagnosed misconception always
short-circuits probing.

---

## 5. Repair model — repair types, not one repair shape

`support screen → question` is one repair, not the definition of repair. The
repair *type* follows from the diagnosis, and — the lean win — every type
maps onto components that already exist. No new component families:

| Repair type | When (diagnosis) | Existing delivery surface |
|---|---|---|
| Misconception correction | Identified misconception | `MisconceptionCheck` (its exam-trap framing is exactly this job), correction copy from the registry |
| Visual / re-explanation | Understanding gap, no misconception | Stage-aware support screen (`ConceptReveal`, `ExplainReveal`, hotspot/carousel screens) |
| Worked example | Can't apply; procedure subjects (Maths) | `GuidedExamResponse`, `ExaminerExplainsScreen` |
| Comparison | Two concepts confused | `TheoryCompareBlock`; misconception `contrastConcept` supplies the pair |
| Retrieval refresh | Recall decay on previously secure cell | `QuickRecallScreen` / quickfire items — no teaching, just retrieval |
| Exam walkthrough | Technique gap, content fine (`logExamTechnique` patterns) | `GuidedAnswerCoach` |

### The educational sequence (default repair arc)

Order matters and is the same across subjects:

1. **Correct the model first** if a misconception is known — explaining on
   top of an uncorrected wrong belief teaches the wrong belief better.
2. **Re-anchor** — the smallest sufficient explanation, one stage below the
   failure.
3. **Retrieve, low stakes** — one cheap recall success to consolidate and
   restore confidence (Confidence over completion).
4. **Apply** — use the idea, don't re-read it (Genuine interaction over
   decorative).
5. **Verify at the failed stage — later, not immediately** (§6).

The anti-pattern this replaces: *show explanation → immediately re-ask the
failed question*. Passing that retest measures recognition of a page they
just read, not learning.

---

## 6. Long-term memory — delayed repair and spaced retrieval

### Deliberate delay: yes, as the default for first failures

**Challenged assumption:** the tutor design's incorrect branch currently
treats a first wrong answer as something to act on *now* (step-down or
repair). A teacher usually wouldn't. Unless a misconception was identified
(fix wrong beliefs promptly, before they consolidate) or the concept is
already known-weak, the better move for a *single* miss is the brief's
sequence:

```
wrong → continue → 2–4 questions later → retest same objective
     → passed: no repair (it was a slip or a lapse, now re-encoded)
     → failed: NOW repair, with two data points instead of one
```

This is a policy revision to the tutor's incorrect rules (its I2/I5 rows):
first miss on a developing concept emits `reinforce` with
`retestAfterAttempts: 2–4` rather than immediate step-down; escalation to
repair requires the failed retest. It costs nothing to build beyond the rule
change, produces better-attributed evidence, and stops the session lurching
into remediation on every stumble. Immediate repair remains correct for:
identified misconceptions, `repairNeeded` windows, and known-weak concepts.

### Where spaced retrieval fits — three timescales, all with existing homes

| Timescale | Mechanism | Existing home |
|---|---|---|
| Within session (minutes) | Delayed retest above; `reviewLater.minGapAttempts` | Tutor policy — designed |
| Between sessions (days) | Post-repair verification re-queued at next session start; neglect surfacing | `PriorKnowledgeRecall` (History modules already open with a recall slot — the natural surface), `identifyNeglectedConcepts(staleDays)` |
| Pre-exam (weeks) | Weak/stale cells feed planned revision | Daily planner (`buildTodaysPlan`) |

Rule that ties them together: **a repair is not "done" when the repair
mission ends.** It is done when the objective is verified twice — once later
in the same session, once at the start of a subsequent one. Until then the
cell stays flagged. The mastery engine's designed-for spaced-repetition
extension (`lastCorrect`, `streak`, neglected query) is the eventual
scheduler; no new storage is needed to adopt the policy.

---

## 7. Explain like a teacher — contract for future AI explanations

No prompts here — only the interface and the non-negotiable principles any
future generator must satisfy. Where deterministic logic ends and AI
interpretation begins — which answer types AI may mark, the response schema,
the validation gate, and what AI must never decide — is defined in
`docs/system/AI_INTERPRETATION_BOUNDARY.md`; this section governs only the
*voice and shape* of explanations.

**Input contract** (assembled entirely from existing structures): the
question + learner's actual answer, the objective cell, the misconception
(id + correction + contrast if registered, raw string otherwise), the
mastery snapshot, and — critically — **the canonical content pack extract
for the concept** (`docs/content/<subject>/...` reference packs) as grounding
material. Voice constraints come from `TEACHING_VOICE_GUIDE.md`.

**Principles (in delivery order):**

1. **Diagnose out loud, kindly.** Name the specific confusion, not the
   error: "You've treated bloodletting as if germs were known — that's the
   most common trap on this topic."
2. **Explain the why, not the what, and keep it small.** One idea, rebuilt
   from reasoning (Understanding over memorisation; Clarity over
   simplification). If the learner can reconstruct it, they own it.
3. **Contrast wrong model with right model explicitly.** Side-by-side beats
   correction alone — the misconception registry's `correction` and
   `contrastConcept` exist for this.
4. **Reinforce the correct mental model with the concrete anchor** from the
   content pack (a person, a decision, a consequence — Stories over
   abstractions).
5. **End with an immediate, tiny application ask.** Never reveal-and-move-on;
   the explanation's last move is always the learner doing something with it.

**Hard constraints:** grounded only in the canonical content pack (exam
accuracy beats fluency — no invented facts); sentence-case, no patronising
("Respect the learner"); the resulting attempt records through the same
evidence channels as any other answer — AI explanation is a repair delivery
mechanism, not a parallel system.

---

## 8. Integration with the existing layers

What each existing layer contributes and what (if anything) changes in it:

| Layer | Contributes | Change required |
|---|---|---|
| Learning graph | Concept identity; misconception ids attach to concepts | One new sparse per-course registry file kind (misconceptions); id-hygiene guard. Nothing else. |
| Objective layer | The cell (`concept@stage`) every diagnosis and repair targets | None — consumed as designed |
| Mastery engine | Evidence, strength bands, neglect queries | **None.** No formula changes; guess-guarding and spacing hooks already exist as designed-for extensions |
| Question banks | `misconceptionId` / `distractorMisconceptions` optional fields | Additive, optional, sync-test guarded; strings remain valid forever |
| Content support maps | Stage-aware screens fill mission slots | None beyond the objective layer's `stages` field |
| Tutor decision engine | Emits the decision a mission expands | Policy revisions: distractor short-circuit into `repair`; delayed-retest default for first misses (`retestAfterAttempts`); repair decisions carry a `repairType` |
| Components | Deliver every repair type | **None — no new components.** The registry already covers all six repair types |
| unifiedWeaknessTracker | Near-term misconception observation log | None now; the misconception registry is the future convergence point |
| Canonical content packs | Ground truth for AI explanations; source of misconception curation | None — already authored in the required shape |

Subject independence falls out of the keying: everything above keys on
concepts, stages, and component types — none of which are History-shaped.
Concretely: a Maths misconception is a procedural wrong model
(`maths:number~subtracts-before-dividing`), its natural repair is a worked
example; an English Literature "concept" is a theme or character, recall is
quotation retrieval, apply is paragraph-level analysis, comparison repairs
confused characters. Drama and Music slot in the same way once their concept
files exist. **Only content files change per subject** — concepts,
misconceptions, questions, support maps; the model, templates, sequences and
rules are shared. The one soft spot: stage *labels* read most naturally for
knowledge-heavy subjects; for skill-heavy subjects (Maths, English Language)
`apply` dominates and `recognise` is rare — that is a content-distribution
fact, not a schema problem, and needs no schema change.

---

## 9. Implementation roadmap

Ordered by value-per-effort; every phase needs its own explicit
authorisation; none is authorised here. Dependencies on the objective
layer's phases (O1–O6) are noted.

- **P1 — Misconceptions (Medicine Ep 1, one curation pass).** Registry file
  + id hygiene guard; `misconceptionId` on rows whose strings match a
  registered entry; `distractorMisconceptions` on MC rows where wrong
  options genuinely encode distinct wrong models (not all do — never force
  it). Pure content + one guard test; unlocks free diagnosis.
- **P2 — Tutor policy revisions.** Distractor short-circuit; delayed-retest
  default (`retestAfterAttempts`); `repairType` on repair decisions.
  Lands with/after the tutor decision engine build (T1) and reads objective
  cells (needs O1–O2).
- **P3 — Mission templates + assembler.** The 3–5 templates and the
  ephemeral slot-filling layer over support lookup + question pools (needs
  O4's stage-aware support). Invisible sequencing first; no UI.
- **P4 — Spaced verification.** Post-repair re-queue within session and
  into the next session's recall slot; planner picks up still-flagged cells.
- **P5 — AI explanation contract.** The §7 input contract as a typed
  interface + grounding-material resolver from canonical packs. Generation
  itself is a separate product decision.

---

## 10. Risks and trade-offs

- **Registry creep (the death spiral this brief warns against).** Guards:
  one new registry kind only; misconceptions registered only when reused or
  distractor-tagged; missions and diagnoses derived, never stored; if any
  future phase proposes a "mission registry" or "diagnosis store", the
  design has failed — stop.
- **Curation cost of distractor tagging.** Real but bounded: MC rows only,
  Ep 1 first, and only where distractors genuinely encode wrong models.
  Untagged questions lose nothing — they fall back to the probe path.
- **Delayed repair on high-stakes gaps.** Delay is wrong when the exam is
  imminent or the cell is exam-critical; the reserved `priority` input on
  the tutor engine is the override hook (immediate repair when priority is
  high). Also wrong for misconceptions — those repair promptly by rule.
- **Mission incoherence from thin content.** Outside Medicine Ep 1–2 most
  slots won't fill for a while. Graceful degradation to single-step repair
  is designed in; the `insufficient-metadata` reason code already measures
  the coverage frontier.
- **Diagnosis fatigue.** Bounded probes, passive-first ordering, and the
  short-circuit rule keep active diagnosis rare. If telemetry ever shows
  learners hitting 2-probe sequences often, the fix is more distractor
  tagging, not more probes.
- **AI explanation accuracy.** Ungrounded generation is the biggest
  educational risk in the roadmap (confidently wrong > absent). The
  grounding constraint (§7) is non-negotiable; P5 ships the contract before
  any generation exists so the constraint is structural.
- **Two misconception channels during transition.** Workbook strings and
  registry ids coexist by design; the tracker convergence stays deferred.
  Accepted trade-off: mild duplication now beats a forced migration that
  would casually wire together systems `MASTERY_ENGINE.md` explicitly keeps
  apart.
- **Templates as pedagogy lock-in.** A fixed repair arc could fit poorly for
  some subject/skill combinations. Mitigation: templates are data-shaped and
  few; adding or revising one is a content-review decision, not an
  architecture change.

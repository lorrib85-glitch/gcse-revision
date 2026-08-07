# Chapter readiness audit

**Status:** Active authoring and review contract.

**Owners:**

- `content-create` runs the pre-build planning pass and produces the Stage-B
  readiness report as builder evidence.
- `content-review` independently re-runs and verifies the audit during Stage A
  and Stage C.
- Existing canonical, Topic, component, evidence, mastery, weakness and visual
  systems remain the authorities for their own facts. This audit assembles
  their results; it does not redefine them.

## Purpose

A Chapter is not ready merely because it renders or passes unit tests. Before a
new Chapter, or a materially rebuilt Chapter, is described as implemented or
approved, the workflow must show in one place that:

- the canonical syllabus and knowledge are covered;
- every Screen is accounted for;
- Chapter Topic and Chapter metadata are valid where present;
- the component mix supplies the required teaching, processing, retrieval,
  application and exam preparation;
- assessed activity can detect misunderstanding and report it through the
  existing evidence or weakness path;
- support or recovery is available, or an allowed deferral is stated;
- the Chapter works structurally, technically and at the mobile render bar.

This is an orchestration report, not a new data model. Do not add duplicate
Screen fields for component function, interaction class, Chapter identity,
modality, evidence quality or weakness state. Derive them from their existing
owners.

## Three uses of one audit

This document defines one audit with three evidence phases. Do not create a
second readiness checklist for planning, building or approval.

1. **Pre-build planning — `content-create`.** Before authoring the first Screen
   of a new Chapter, show that every required area has a valid planned home,
   check and recovery route. A planning Pass means the plan is complete enough
   to build; it is never evidence that the Chapter has been implemented.
2. **Stage B actual — `content-create`.** Replace planned locations with actual
   Screens, Topics, assessed producers, wiring, command results and renders.
   Record and explain every material deviation from the pre-build plan.
3. **Stage C verified — `content-review`.** Independently reproduce the actual
   report from source, wiring, commands and rendered Screens. Do not accept the
   builder's report as verification.

For an already-built Chapter entering Stage A, `content-review` creates the
baseline from the actual Chapter rather than inventing a retrospective
pre-build plan.

## When the audit is required

Run the **full Chapter audit** for:

- every genuinely new Chapter;
- a Topic migration or change to Topic membership;
- a change to Chapter scope, canonical coverage, Screen order or Screen count;
- a change to assessed evidence, Concept attribution, weakness reporting or
  recovery routing;
- a change to Chapter metadata, parent Module ownership or `stageNavigation`;
- any rebuild broad enough to be presented as a Chapter-level completion or
  approval.

For a narrow Screen-only amendment, audit the changed scope in full and re-run
all Chapter-wide integrity counters. Record unrelated pre-existing failures as
**out of scope**, but do not hide them or claim the entire Chapter is ready.

## Outcomes

Every line in the report receives one outcome:

- **Pass** — the requirement is satisfied and the evidence is named.
- **Review** — a human judgement or an explicit allowed deferral is required.
  State the decision and rationale; never leave `Review` unexplained.
- **Fail** — a required condition is absent or invalid. A new Chapter cannot be
  described as implemented, and a scope cannot be approved, while an in-scope
  `Fail` remains.

In the **pre-build planning phase**, these outcomes apply to the plan rather
than to built content:

- **Pass** — a valid planned home/evidence route exists and is compatible with
  the governing contracts;
- **Review** — the plan depends on an explicit judgement or allowed deferral;
- **Fail** — required coverage, evidence, recovery, structure or ownership has
  no valid planned route.

A pre-build Pass authorises implementation of the confirmed plan only. It must
never be quoted later as proof that the corresponding Screen or wiring exists.

Machine-checkable facts and human judgement must remain distinct. Do not turn a
quality judgement into a weak regex merely to make the report green.

## Pre-build planning pass

Run this before the first Screen is authored for every new Chapter. Run it
again before a material rebuild when the confirmed change alters canonical
coverage, Topic boundaries, learning sequence, assessed evidence,
weakness/recovery routing or Chapter-wide structure. A narrow confirmed
Screen-level amendment whose route is already fully specified by Stage A does
not need a second speculative Chapter plan.

Use the same report sections below, but populate them with **planned evidence**.
At minimum the pre-build pass must show:

- every canonical specification requirement and important Concept has a planned
  Topic or deliberate Chapter-level home;
- every confirmed learner-facing Chapter outcome has a planned teaching
  location and a planned way for the learner to demonstrate it;
- planned Topics collectively cover the Chapter scope without positional or
  duplicate identity;
- Chapter-level opening, synthesis, exam or completion Screens are identified
  separately from Topic-owned learning;
- the sequence obeys the subject architecture and teach-before-test rule;
- every important Concept has a planned assessed check, Concept attribution and
  existing evidence/weakness-reporting route;
- every detected weakness has a planned support/recovery destination or an
  explicitly allowed named deferral;
- required Chapter metadata, parent Module ownership and canonical source are
  known before content authoring starts.

The pre-build pass plans **learning jobs and evidence routes**, not a second
component taxonomy. Exact component selection still follows Pattern
Governance's per-Screen build chain. Do not add placeholder Screens, duplicate
metadata or fake assessed producers merely to make the planning report green.

An in-scope pre-build Fail blocks Screen authoring until the plan is repaired or
the missing canonical/product decision is surfaced. An explained Review may
proceed only when its decision or deferral is recorded.

Stage B must compare the built Chapter with this plan. A changed Topic boundary,
missing planned check, extra unsourced teaching area, moved recovery route or
other material deviation is recorded and re-evaluated; it is not silently
accepted because the pre-build plan once passed.

## 1. Canonical coverage

Compare the built Chapter two ways against its specification and canonical
content/architecture files:

1. Every required specification point, canonical fact, relationship, example,
   named figure, practical requirement and exam payoff has a teaching,
   retrieval or application location.
2. Anything taught in the Chapter but absent from the canonical source is
   listed as unsourced, uncertain or newly approved — never silently accepted.

Also report:

- canonical Concept IDs expected by the Chapter;
- which Chapter Topic or Chapter-level Screen teaches each Concept;
- where understanding of each important Concept is checked;
- each confirmed learner-facing Chapter outcome and where it is taught and
  demonstrated;
- missing Concepts, orphan facts, unsupported outcomes and unsourced additions.

Concept-ID presence alone is not proof of coverage. Human review must confirm
that the actual knowledge is taught accurately and deeply enough for the exam.
If canonical files are unavailable, use the existing degraded-mode rule and
mark canonical coverage **Review — unassessed**, never Pass.

During pre-build planning, replace actual Screen locations with planned Topic,
stage or Screen-job locations and label them clearly as planned.

## 2. Chapter Topic and Screen accountability

When the Chapter authors `topics`, validate them through
`docs/system/CHAPTER_TOPICS.md` and `src/content/chapterTopicSchema.js`:

- Topic ID is a stable semantic lowercase kebab-case ID, such as
  `miasma-and-bad-air`;
- positional IDs such as `topic-1`, `section-2` and `part-3` are forbidden;
- learner-facing title is present;
- every Concept ID is registered;
- estimated minutes are valid;
- every authored Screen `topic` reference resolves to a Topic declared in the
  same Chapter;
- each declared Topic has at least one Screen;
- Topic boundaries form a coherent learning unit and any dependency on earlier
  Chapter context is recorded.

Chapter Topics remain optional at schema level so unmigrated Chapters keep
working. Report the Topic layer as one of:

- **present and valid**;
- **absent by approved design**;
- **not yet migrated**;
- **invalid**.

Generate a complete Screen inventory. Every Screen must appear exactly once as
Topic-owned or deliberately Chapter-level. Do not add a `chapterLevel` field to
content merely to satisfy the report.

Minimum inventory columns:

| Field | Source |
|---|---|
| Screen index and stage | Chapter content + `stageNavigation` |
| Topic or Chapter-level | Screen `topic` / deliberate omission |
| Screen and block type | Chapter content |
| Component function tags | generated Component Pedagogy Registry |
| Interaction class | generated Component Pedagogy Registry |
| Canonical Concepts taught or tested | Topic, Screen/question metadata and canonical review |
| Evidence / weakness path | actual assessed producer wiring |
| Status | Pass / Review / Fail with reason |

Function tags and interaction classes are derived catalogue facts. Never author
a duplicate `learningFunction` or interaction field on the Screen or Topic.

During pre-build planning there is no fake Screen inventory. Use a **planned
Screen-job inventory** instead: planned order/stage, Topic or Chapter-level
ownership, primary learning job/intent, Concepts, planned assessed check and
planned recovery route. Stage B replaces this with the actual indexed Screen
inventory.

## 3. Learning coverage and sequence

Use the Component Registry's function tags and the subject's locked Chapter
architecture to report the functional rhythm. At minimum check:

- teaching occurs before retrieval, application or exam-technique testing;
- no more than two consecutive passive Screens;
- every teaching stage contains assessed activity where the existing content
  quality contract requires it;
- every important taught fact is retrieved or applied later;
- interactions match the content shape and component contract;
- the Chapter includes the subject-specific opening, interleaving, precision,
  synthesis and examiner requirements;
- one primary intent per Screen is preserved;
- the Chapter's story spine or investigative arc is raised, developed and
  resolved.

Do not require every Topic to use every function. Flag the meaningful gap, for
example “teaching and retrieval are present but no application exists,” and
judge whether Chapter-wide application legitimately supplies it.

During pre-build planning, assess the intended rhythm from the planned learning
jobs and subject architecture. Do not invent component function metadata before
a component has been selected; Stage B derives the actual function distribution
from the catalogue.

## 4. Evidence, weakness reporting and recovery readiness

Evidence is a demonstration, not completion. For every important Topic or
Concept, identify:

- the assessed activity that can detect understanding or misunderstanding;
- the Concept attribution used by that activity;
- whether the activity produces valid evidence or reaches the existing
  weakness-reporting path when the learner is wrong;
- whether feedback and progression follow the owning component contract;
- the support Screen, Chapter Topic or later Chapter that can repair the gap;
- whether recovery is immediate, later in the Chapter, or legitimately
  deferred by a subject rule.

Do not create a new weakness store, mastery score or evidence schema for this
audit. Use the existing Evidence Model, Mastery Engine,
`unifiedWeaknessTracker` and support/recovery mapping according to their
current authorised phases.

For a History series opener, detection may Pass while recovery is recorded as
**Review — deferred to a named later Chapter/Topic** under the locked subject
rule. “Deferred” without a named route or rule is a Fail.

A new Chapter fails readiness when an important Concept is taught but no
assessed activity can produce checkable evidence of understanding, unless an
explicit approved reason shows that the Chapter-wide assessment covers it.

During pre-build planning, name the intended assessed producer/job, Concept
attribution, existing evidence/weakness path and intended recovery destination.
Stage B must replace these intentions with the actual producer and wiring.

## 5. Metadata and structural integrity

Report and verify:

- canonical Chapter record exists and its `contentPath` resolves;
- exactly one parent Module owns the visible Chapter;
- subject and pathway relationships are valid;
- authored Topic metadata validates when present;
- all Screen and block types are registered authoring types;
- `stageNavigation` indices are increasing, unique and in bounds;
- generated `screenCount`, Screen tags, loaders and curriculum projections
  match authored content;
- no change required a new `ChapterPlayer` or `ScreenRenderer` routing branch;
- visual asset manifest entries and paths resolve;
- progress identity and existing learner data contracts remain intact.

The report may call existing generators and architecture tests. It must not
reimplement their schemas in a second validator.

During pre-build planning, verify what already exists (canonical record, parent
Module, source path) and mark build-dependent checks as **planned / not yet
applicable** in the evidence column rather than pretending they have passed.
The Pass / Review / Fail status still evaluates whether the plan can satisfy the
requirement.

## 6. Technical and visual readiness

Record the actual results of:

- generated-catalogue checks relevant to the changed content;
- content-quality and architecture tests;
- focused unit tests where behaviour changed;
- lint and production build;
- Chapter open, progression, resume and completion checks where relevant;
- the composed 390px render pass for every new or changed Screen.

The visual evidence must apply the existing strengthened verdict: hierarchy,
density, clipping, reading order, image relevance, interaction clarity,
feedback, CTA visibility and comparison with the named gold example. A
component story in isolation is not Chapter evidence.

These are **not applicable as executed evidence during pre-build planning**.
Instead record the exact checks and render scope that Stage B must run. Do not
mark an unrun command or unseen render as Pass.

## Report format

Use this order in every phase:

1. **Readiness summary** — evidence phase (`pre-build planning`, `Stage B
   actual` or `Stage C verified`), counts of Pass / Review / Fail and whether
   the result describes a full Chapter or a scoped change.
2. **Canonical coverage matrix** — requirement / Concept / learner outcome →
   taught → checked → status.
3. **Topic summary** — Topic metadata, Concepts, Screens, context dependency
   and status; or the recorded reason the Topic layer is absent.
4. **Screen inventory** — planned Screen jobs during pre-build; every actual
   Screen with derived pedagogy and evidence/weakness path in Stage B/C.
5. **Learning coverage** — planned rhythm during pre-build; actual function
   distribution and sequence findings in Stage B/C.
6. **Evidence and recovery coverage** — assessed producer/job, Concept
   attribution, weakness path and support route.
7. **Metadata, technical and visual checks** — planned verification during
   pre-build; exact command/render evidence in Stage B/C.
8. **Open Reviews and Fails** — owner, required decision or repair, and
   whether it blocks authoring, implementation or approval.
9. **Phase comparison** — Stage B records material plan → actual deviations;
   Stage C records builder → independently verified differences.

The report belongs in the Chapter's Review Log when the workflow is persisted.
In `audit-only` mode it is returned to the user but not written.

## Reusable report template

Use this structure rather than inventing a new report shape per Chapter. Remove
rows that are genuinely not applicable; do not remove a section merely because
it contains a Fail.

```markdown
# Chapter readiness report

Chapter: <chapter id — learner title>
Scope: <full Chapter | named scoped change>
Evidence phase: <pre-build planning | Stage B actual | Stage C verified>
Canonical root: <resolved path>
Canonical sources: <Content.md + Architecture.md + specification/source refs>
Content evidence: <not built yet | commit SHA / working tree ref>
Audit contract: docs/system/CHAPTER_READINESS_AUDIT.md @ <commit/ref>

## Readiness summary
Pass: <n>
Review: <n>
Fail: <n>
Overall: <may plan/build/approve | blocked — reason>

## Canonical coverage matrix
| Requirement / Concept / outcome | Topic / Chapter-level home | Teach location | Check / evidence | Recovery | Status | Evidence basis |
|---|---|---|---|---|---|---|

## Topic summary
| Topic ID | Learner title | Concepts | Planned/actual Screens | Context dependency | Est. min | Status |
|---|---|---|---|---|---|---|

## Screen inventory
| Order / index | Stage | Topic / Chapter-level | Screen job/type | Function + interaction | Concepts | Evidence / weakness | Recovery | Status |
|---|---|---|---|---|---|---|---|---|

## Learning coverage
<planned rhythm or actual derived function distribution + sequence findings>

## Evidence and recovery coverage
| Topic / Concept | Assessed producer/job | Concept attribution | Evidence / weakness path | Support / recovery | Status |
|---|---|---|---|---|---|

## Metadata, technical and visual checks
| Check | Planned or actual evidence | Status |
|---|---|---|

## Open Reviews and Fails
| Finding | Owner / decision needed | Blocks | Status |
|---|---|---|---|

## Phase comparison
<pre-build: not applicable; Stage B: plan → actual deviations; Stage C: builder → verified differences>
```

## Create versus review responsibility

### `content-create`

- runs the pre-build planning pass before Screen authoring for every new Chapter
  and for material rebuilds that alter Chapter-wide learning architecture;
- does not start authoring while an in-scope pre-build Fail remains;
- runs the actual audit before hand-off;
- replaces planned locations/routes with actual Screen, Topic, producer and
  wiring evidence;
- records material plan → actual deviations;
- fixes in-scope mechanical Failures;
- surfaces canonical or product-decision gaps instead of inventing around
  them;
- writes the Stage-B readiness report and evidence to the Review Log;
- may say **implemented** only when no in-scope Fail remains;
- never treats its own report as approval.

### `content-review`

- runs a baseline actual audit during Stage A for existing Chapters;
- uses failures to form concrete Screen decisions and amendment briefs;
- independently re-runs the audit during Stage C;
- uses the shared report template rather than a reviewer-specific copy;
- does not copy or accept the builder's statuses without checking the source,
  wiring, commands and rendered Screens;
- may approve the amended scope only when no in-scope Fail remains and every
  Review has an explicit accepted rationale;
- distinguishes scoped approval from whole-Chapter readiness.

## Non-duplication rules

- This document owns only the audit assembly and report shape.
- Canonical files own knowledge and specification coverage.
- `CHAPTER_TOPICS.md` and `chapterTopicSchema.js` own Topic authoring rules.
- Component catalogue records own function tags and interaction classes.
- Pattern Governance owns Screen intent, component selection and composition.
- The Evidence Model owns what counts as evidence.
- The Mastery Engine owns learner mastery accumulation.
- Existing weakness and support systems own their current routing.
- Subject blueprints own subject-specific Chapter structure.
- `content-create` and `content-review` own workflow execution, not new copies
  of these definitions.

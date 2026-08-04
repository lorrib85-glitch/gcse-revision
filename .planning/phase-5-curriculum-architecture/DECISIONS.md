# Phase 5A — decisions

Three lists. **Settled** decisions are made, with the evidence that made them,
and are not reopened during implementation. **Settled by the product owner**
holds the five that Phase 5A could not decide on its own and that were closed
before Stage 0 began. **Open** decisions are genuinely unresolved: each names
what would settle it, who decides, and what the implementation does meanwhile.

An open decision is not a gap in the design. It is a place where the design
deliberately does not decide something it has no authority or evidence to
decide — and every one of them is arranged so that deciding it later is a data
edit, not a redesign.

**Status:** 13 architectural decisions settled in Phase 5A · 5 product decisions
settled before Stage 0 (OD-1, OD-4, OD-5, OD-7, OD-8) · 5 still open (OD-2,
OD-3, OD-6, OD-9, OD-10).

---

## Settled

### D-1 — The curriculum gets its own catalogue, separate from the component catalogue

Same pattern (authored source → validation → generated projections → generated
docs), separate domain, no cross-references in either direction.

*Why:* they answer different questions, change for different reasons, and have
different runtime exposure. `CENSUS.md` §1.2 measures the asymmetry that
motivates it: `pnpm verify` checks four generated artefacts and **all four are
component-domain**. Combining them would give one validator authority over two
unrelated release cadences.

### D-2 — The upper model is relational; `Subject → Specification` is not an ownership tree

Four record types with explicit references: Subject, Specification, Study
pathway, Module.

*Why:* Combined Science 8464 is one specification covering three subjects. Under
a tree it must belong to one of them, and the other two must duplicate or lose
it. `subjectIds` is a list on every specification, so nothing is special-cased.

### D-3 — English is two canonical subjects: `english-language` and `english-literature`

*Why:* decided from qualification, pathway, progress and content-reuse
requirements, not aesthetics (`DESIGN.md` §3.1). Two AQA specifications (8700,
8702), separately certificated; Literature carries text selections and Language
carries none; subject strings are persisted progress identity (A-19) and a
merged "English %" is not actionable; content reuse between them is zero.

The `English` **theme key** stays single and serves both — which is the clearest
demonstration that a theme key is presentation and a subject is identity.

### D-4 — "Study pathway" is the term, not "course"

*Why:* the learning graph already uses "course" at four different levels (A-13):
a specification option, four AQA topics, a content domain, and an exam paper.
Reusing the word would import a measured ambiguity into the one entity that has
to be unambiguous.

### D-5 — Ordering belongs to the relationship, not the entity

`{ moduleId, position }` on a pathway; `{ chapterId, position }` on a module.

*Why:* proved against the code rather than asserted (`DESIGN.md` §3.5).
`chapter.number` already collides three times, twice between two *visible*
chapters (A-3). `resolveNextAvailableChapter` and `buildChapterCompletePayload`
both use `chapterIds.indexOf()` — position. `Subjects.jsx` falls back to
position. 21 of 60 chapters carry no `series`, so a `number` cannot even say
which sequence it numbers within. Position is already the operative fact;
`number` becomes derived.

### D-6 — The Western Front is a separate module, sharing Medicine's selection group

*Why:* it is a distinct specification element of Edexcel Paper 1 (thematic study
**and** historic environment), assessed by the source questions specifically.
`selectionGroup: 'thematic-study-and-historic-environment'` on both module refs
carries the pairing Edexcel requires, so nothing is lost by separating them, and
a different historic environment becomes a pathway edit. Reasoned from the
specification structure, not from the shape of the current `hist_medicine` array
(`MODELS.md` §6.1).

### D-7 — Specification requirement is its own entity, distinct from Concept

*Why:* they answer different questions, change for different reasons, and have
different granularity (`DESIGN.md` §3.8). A requirement such as *"students should
be able to describe how to carry out a required practical"* is mandated coverage
with an assessment method, not a teachable knowledge atom. Merging them means
either inventing pseudo-concepts for assessment rules or losing coverage
reporting.

### D-8 — Every existing chapter id is preserved verbatim

Including the ones that break the naming rules: `spain-new-world-1` (position
number in identity), `soc1`, `math1`, `bio_building_blocks`, `sci_bio_w1`
(underscores).

*Why:* each is a live progress key (`gcse_chapter_<id>`). A clean-looking id is
not worth losing learner progress. The naming rules bind new ids and non-chapter
entities. Where a rename is genuinely wanted later, `LEGACY_CHAPTER_ID_MAP`
already provides the mechanism and six worked precedents.

### D-9 — Concept is not a navigation level, and a concept id is not a curriculum position

The learning graph keeps its design, its files and its ids. Curriculum
membership moves to module records; a concept id becomes a namespace and nothing
more.

*Why:* A-13. Seven two-segment "course" nodes sit at four different curriculum
levels, and 80 of 87 concepts hang off one of them. The id prefix cannot carry
curriculum position consistently, so it stops trying.

### D-10 — No second authored copy is kept so that a test can compare it

Every drift test named in `CENSUS.md` §2 is deleted at migration, not ported.

*Why:* a drift detector is what you build once you have accepted that a fact will
be written down twice. `screenCount` vs `screens.length`, module `subject` vs
chapter `subject`, loader key vs chapter id — all become derived. The
`screenTags` case is the argument in miniature: its *length* is checked and its
*positions* are not, so a tag can already point at the wrong screen while every
test passes.

### D-11 — `MODULES`, `CHAPTERS` and `CHAPTER_CONTENT_LOADERS` keep their names and shapes

They stop being hand-authored and start being generated. Consumers are unchanged
on the day the records land.

*Why:* it makes the migration reversible one stage at a time and keeps the blast
radius of each stage to a single file. `CENSUS.md` §2 traced the consumers; there
are enough of them that a simultaneous rename would be a rewrite, not a
migration.

### D-12 — Records are build-time data; only named projections reach the runtime

`src/curriculum-catalogue/**` must never be imported by `src/**` production code,
proved by a filesystem-derived sweep rather than an allowlist.

*Why:* the same rule and the same proof shape as ADR-0001 Decision 1, which the
repository already runs successfully over ~85 component records.

### D-13 — Three fields were added; three were rejected

Added, each with at least two demonstrated consumers before acceptance:
`paper.assessmentType` (Drama, Music, English Language Spoken Language),
`paper.subjectId` (Combined Science, and retiring `paper:medicine`),
`moduleRef.selectionGroup` (Literature, History, Drama, Music).

Rejected for having no demonstrated requirement: `module.tier` (tier is a
pathway property), `chapterRef.required` (no surface distinguishes required from
optional chapters today), `chapterRef.availabilityOverride` (`chapter.status`
covers every current case).

*Why:* a field without a demonstrated requirement is a field nobody maintains.
Each rejected field is named in `DESIGN.md` §3.6–3.7 so the shape is understood
and the omission is deliberate rather than an oversight.

---

## Settled by the product owner (closed before Stage 0)

These five carry their original `OD-` identifiers because the rest of the
Phase 5A documents reference them by number. They are settled decisions, not
open ones, and are listed separately only so the record of *when* they closed
survives.

### OD-1 — Historical `'English'` progress rows stay exactly as they are — **SETTLED**

**Decision.** Option (b). Rows carrying the persisted subject value `'English'`:

- remain stored exactly as they are — **no historical row is ever rewritten**;
- remain visible in historical activity wherever they are surfaced today;
- are treated as **legacy / unattributed**;
- contribute to **neither** `english-language` nor `english-literature` current
  subject averages;
- are recognisable to the read layer through `legacyProgressNames` on the
  canonical subject records.

A later implementation must make this treatment **explicit** — a named legacy
bucket, not rows that quietly vanish from a total that no longer adds up.

**Rationale.** There is no reliable mechanical way to decide whether an old row
represented Language or Literature. Guessing would fabricate learner data, and
fabricated progress is worse than absent progress.

**Consumed by:** Stage 2 (subject records carry `legacyProgressNames`) and
Stage 5 (the read layer). Not Stage 0 or Stage 1.

### OD-4 — `soc1`–`soc3` move to `sociology-aqa-key-concepts` — **SETTLED**

**Decision.** In the future canonical records:

| Chapter | Module |
|---|---|
| `soc1`, `soc2`, `soc3` | `sociology-aqa-key-concepts` |
| `soc4`, `soc6` | `sociology-aqa-families` |

**Rationale.** `soc1` teaches culture, norms, values and socialisation; `soc2`
teaches sociological approaches; `soc3` teaches feminism, power and life-chance
concepts. These are cross-course foundations rather than substantive Families
content, and the split supports reuse across both AQA Sociology papers.

**Scope.** This concerns **future canonical records only**. Nothing moves in the
current runtime catalogue: `MODULES` keeps all five chapters in `soc_family`
until Stage 4, and no learner sees a change before Stage 5.

**Consumed by:** Stage 2. The census classification is updated now so Stage 2
executes a settled mapping rather than a provisional one.

### OD-5 — `history-medicine-nightingale` stays a distinct chapter — **SETTLED**

**Decision.** Option (a). It remains its own chapter in the Medicine module and
keeps `status: 'planned'` until its content is built. It is **not** absorbed
into `history-medicine-great-stink`.

**Rationale.** Nightingale, nursing and hospital reform form a coherent Edexcel
Medicine development with enough factual content, causation, significance and
exam relevance to justify a separate learner journey. Great Stink and
public-health reform are related but are not the same curriculum unit.

**The broken recovery route is a separate defect.** A-20 records that
`TAG_CHAPTER_MAP` routes `'nightingale'` to Great Stink and lands on screen 0
because Great Stink carries no matching screen tag. That is a routing bug to fix
on its own terms; it is not an argument for collapsing a curriculum unit.

**Consumed by:** Stage 2.

### OD-7 — No Drama or Music records during Stages 0 or 1 — **SETTLED**

**Decision.** Option (b). Do not create Drama or Music subject, specification,
pathway or module records during Stage 0 or Stage 1. `MODELS.md` §8–9 remain
**architecture proofs only**. Real records are created when the first module for
each qualification is ready to be planned or built.

**Rationale.** The models have already done their job by proving the
architecture holds for practical and written assessment. Records for
qualifications with no content would make the catalogue's first commits mostly
fiction, which is the discipline `DESIGN.md` §8 sets out.

**Consumed by:** Stage 1 — nine specifications are authored, not eleven.

### OD-8 — The browser is derived from configured study pathways — **SETTLED**

**Decision.** This **refines** the proposed default. The browser is derived
neither directly from the existence of Subject records nor from a manual
`browsable` field. A canonical subject is shown when **both** hold:

1. it is covered by at least one **non-retired catalogue Study pathway** that is
   included in the app's navigation configuration; **and**
2. that pathway reaches at least one **non-retired Module** for that subject.

Both `active` and `planned` modules are eligible:

- an **active** module can show available or planned chapters;
- a **planned** module can support a subject-level coming-soon experience;
- **retired** modules never make a subject visible.

**Consequences.**

- Chemistry and Physics may remain visible through planned Science modules
  before they contain a single available chapter — which is exactly today's
  behaviour, preserved.
- Drama and Music remain absent, because OD-7 creates no records for them.
- Combined Science can expose Biology, Chemistry and Physics from one
  specification and one pathway **without** assigning that specification to a
  single Subject — the relational model (D-2) doing real work.
- **No `subject.browsable` field is added.** Visibility is derived, never
  authored.
- **Stage 5 must preserve the current seven visible subjects** during the
  authority transfer.
- Later changes to the configured pathways or to module statuses may
  deliberately change that list. That is the point: the list becomes a
  consequence of the curriculum, not a literal someone edits.

**Consumed by:** Stage 5. The schema constraint it creates — no `browsable`
field, ever — is enforced from Stage 0.

---

## Open

### OD-2 — Whether canonical subject ids replace display strings in new progress writes

**The problem.** `recordScore` currently writes `'History'`; the canonical id is
`history`. Switching new writes means the score log holds two vocabularies at
once; not switching means the canonical id never reaches storage and the
mapping is permanent.

**Proposed default:** switch new writes to canonical ids at the same stage the
navigation projection lands, and resolve both vocabularies on read via
`legacyProgressNames`. One-way, no rewrite.

**Who decides:** engineering. **Settles by:** confirming the read path can
resolve both without a schema version bump.
**Meanwhile:** nothing changes; this is a Stage 5 decision.

### OD-3 — What happens to the persisted subject value `'Quick Fire'`

**The problem.** `QuickFireMode.jsx` writes `recordScore({ subject: 'Quick Fire' })`.
That is not a subject. It already pollutes `getWeakestSubject` and
`getImprovements`, and after the migration it will be a value with no subject
record.

**Options.** (a) leave it and filter it out on read; (b) change QuickFire to
write the real subject of each question; (c) add a `source`-based grouping and
stop putting non-subjects in the subject field.

**Proposed default: (b)**, since each QuickFire question already knows its
subject — but this is a **behaviour change to a live feature** and therefore
explicitly out of scope for a planning phase.

**Who decides:** product + engineering. **Settles by:** confirming QuickFire
questions all carry a resolvable subject.
**Meanwhile:** recorded as a known defect (A-19), unfixed.

### OD-6 — Whether the three deferred relationship fields are ever needed

`moduleRef.availabilityOverride`, `chapterRef.required`,
`chapterRef.availabilityOverride`. Named in `DESIGN.md` §3.6–3.7, not built (D-13).

**Settles by:** a real requirement appearing — a module content-complete for one
tier but not another, or a genuinely optional chapter. **Meanwhile:** they do not
exist. Adding a field to a relationship record later is additive and needs no
migration, which is precisely why deferring them is safe.

### OD-9 — Verification of every specification code, paper structure and timing

**The problem.** `MODELS.md` states codes (`8300`, `8464`, `8461`, `8700`,
`8702`, `1HI0`, `8192`, `8261`, `8271`), paper titles, durations and marks. These
are **not repository-measured facts**, unlike everything in `CENSUS.md`, and the
document says so at the top.

**Who decides:** whoever authors each specification record. **Settles by:**
checking each against the current board specification document.
**Meanwhile:** Stage 1 of the implementation plan makes this a blocking task per
specification. The architecture depends on none of these values being right —
only on the shapes — so an error here is a data fix, not a redesign.

### OD-10 — Whether `docs/system/CONTENT_HIERARCHY.md` is rewritten or generated

**The problem.** It is the active governance document for the current hierarchy,
it contains a statement the code does not support (A-17: "Subject owns brand,
specification and overall progress"), and after the migration most of it
describes a system that no longer exists.

**Options.** (a) rewrite it by hand as the curriculum governance doc;
(b) replace it with generated `docs/curriculum/CURRICULUM_MAP.md` plus a short
hand-written rules document; (c) keep it and add a pointer.

**Proposed default: (b)** — the map is generated, the rules are not. It matches
what the component domain did (`COMPONENT_REGISTRY.md` generated,
`COMPONENT_AUTHORING_RULES.md` hand-written).

**Who decides:** engineering, at Stage 6. **Settles by:** the migration
reaching the point where the old document is more wrong than right.
**Meanwhile:** untouched. Rewriting active governance is not a planning-phase
change, which is why A-17 is recorded and not fixed.

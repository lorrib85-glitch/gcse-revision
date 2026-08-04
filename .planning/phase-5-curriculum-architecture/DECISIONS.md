# Phase 5A — decisions

Two lists. **Settled** decisions are made, with the evidence that made them, and
are not reopened during implementation. **Open** decisions are genuinely
unresolved: each names what would settle it, who decides, and what the
implementation does in the meantime.

An open decision is not a gap in the design. It is a place where the design
deliberately does not decide something it has no authority or evidence to
decide — and every one of them is arranged so that deciding it later is a data
edit, not a redesign.

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

## Open

### OD-1 — How historical `'English'` progress rows are attributed after the subject split

**The problem.** `recordScore({ subject })` writes display strings into
`gcse_scores`, and the weakness tracker stores them too (A-19). Existing rows say
`'English'`. After D-3 there are two subjects, and no mechanical rule can decide
which one a historical row belonged to — the only built English chapter is
Literature, but Exam Mode rows could be either.

**Options.** (a) attribute all historical rows to `english-literature`, since
that is the only built content; (b) attribute to neither, report them as legacy,
exclude from per-subject averages; (c) rewrite rows using each row's `source`
field.

**Proposed default: (b).** It is the only option that does not fabricate an
attribution, and the cost is bounded — a learner sees historical English scores
in their history but not in their current per-subject average.

**Who decides:** product. **Settles by:** a decision on whether a slightly
lossy history is preferable to a guessed one.
**Meanwhile:** the subject record carries `legacyProgressNames`, so nothing is
lost and any of the three options remains implementable. No persisted row is
rewritten in any case.

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

### OD-4 — Whether `soc1`–`soc3` move out of the Families module

**The problem.** A-7. `soc_family` is titled "Sociology of the Family" and three
of its five chapters are key concepts and sociological approaches that run across
both AQA papers. `MODELS.md` §7 proposes splitting them into
`sociology-aqa-key-concepts`.

**Why it is open rather than settled.** It is a **curriculum judgement**, not an
architectural one. The architecture expresses either arrangement equally well —
the difference is which module a chapter ref sits in. Deciding it requires
knowing how the content is actually taught, which is the user's call.

**Who decides:** the user (curriculum owner). **Settles by:** a look at the three
chapters against the AQA 8192 content list.
**Meanwhile:** the census records the proposed split with its reasoning, and the
migration keeps all five in one module until the decision is made. Changing it
later is one edit to two module records.

### OD-5 — Whether `history-medicine-nightingale` stays a chapter or is absorbed

**The problem.** It is the one Medicine stub (0 screens) sitting inside otherwise
complete content, and `TAG_CHAPTER_MAP` already routes the `'nightingale'`
weakness tag to `history-medicine-great-stink` — so the recovery system treats a
different chapter as the Nightingale destination. (Great Stink has no
`nightingale` screen tag, so that route lands on screen 0; see A-20.)

**Options.** (a) build it as its own chapter; (b) absorb it into
`history-medicine-great-stink` and retire the id via the alias map.

**Who decides:** the user (curriculum owner). **Settles by:** a content decision.
**Meanwhile:** it becomes `status: 'planned'` like every other stub. Option (b)
remains available at no extra cost because D-8's alias mechanism already exists.

### OD-6 — Whether the three deferred relationship fields are ever needed

`moduleRef.availabilityOverride`, `chapterRef.required`,
`chapterRef.availabilityOverride`. Named in `DESIGN.md` §3.6–3.7, not built (D-13).

**Settles by:** a real requirement appearing — a module content-complete for one
tier but not another, or a genuinely optional chapter. **Meanwhile:** they do not
exist. Adding a field to a relationship record later is additive and needs no
migration, which is precisely why deferring them is safe.

### OD-7 — Whether `Drama` and `Music` subject records are created now or when content starts

**The problem.** Both are target qualifications with theme keys and no curriculum
(A-16). `MODELS.md` §8–9 model their specifications to prove the architecture,
but creating `status: 'planned'` records for them means shipping two subjects a
learner cannot reach.

**Options.** (a) create both now as `planned`, hidden from the browser by status;
(b) create them when their first module is built, and keep §8–9 as
architecture-proof documents only.

**Proposed default: (b).** The models have already done their job by proving the
architecture in this document; records for eleven qualifications when nine have
no content would make the catalogue's first commit mostly fiction. This is the
same discipline as `DESIGN.md` §8.

**Who decides:** engineering, at Stage 2. **Settles by:** deciding how much of
the target scope the first catalogue commit should contain.

### OD-8 — Which subjects the learner browser shows, and on what rule

**The problem.** `SUBJECT_NAMES` is a hardcoded literal of seven with no test
(`CENSUS.md` §2.1). Chemistry and Physics are in it with no module; Drama and
Music are out of it despite being target qualifications. After the migration the
list is derived — but from what rule?

**Options.** (a) subjects with at least one `active` module; (b) subjects with at
least one `available` chapter; (c) an explicit `browsable` flag on the subject
record.

**Proposed default: (a)**, because it preserves today's behaviour for Chemistry
and Physics via `planned` modules and needs no new field. But this is a
**learner-facing behaviour decision**, and getting it wrong silently removes
subjects from the browser.

**Who decides:** product. **Settles by:** confirming the coming-soon experience
for a subject with no content.
**Meanwhile:** the projection preserves the current seven exactly, whatever the
rule turns out to be — Stage 4 is explicitly a no-visible-change stage.

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

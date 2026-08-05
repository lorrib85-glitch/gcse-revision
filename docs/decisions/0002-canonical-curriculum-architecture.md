# 0002 — One canonical curriculum architecture

**Status:** accepted (design); product decisions closed; implementation in progress (Stages 0–1)
**Scope:** curriculum governance — subjects, specifications, study pathways, modules, chapters
**Supersedes at implementation time:** `docs/system/CONTENT_HIERARCHY.md`
**Evidence:** `.planning/phase-5-curriculum-architecture/`

## The problem: two hierarchies, and no catalogue under either

`0001` fixed this exact shape one layer down. A component's identity was
authored in five places, nothing made them agree, and a mirror test kept the
copies equal instead of making there be one. The fix was a central catalogue, a
validator and generated projections.

The curriculum layer above it has the same disease and has not been treated. It
runs two incompatible hierarchy models at once —
`Subject → Module → Chapter → Screen → Component`, and
`Subject → Specification/Course → Module → Topic → Screen/Question` — with
curriculum identity spread across `src/constants/subjects.js`,
`src/data/modules.js`, `src/chapters.js`,
`src/content/chapterContentRegistry.js`, `src/features/subjects/**`,
`src/data/learningGraph/**`, `src/data/tagChapterMap.js`, the question banks,
the exam papers, and eight hardcoded literals inside one React file.

The census measured what that costs. Of the curriculum facts in the system:

- **3** have one authored owner and a test that enforces it;
- **6** are authored twice with a test that keeps the copies equal;
- **11** are authored more than once with no test across the boundary at all.

The consequences are not theoretical. Three chapter numbers collide, two of them
between visible chapters, so a learner sees two chapter 4s. Twenty entries in a
header-image map are unreachable because the value they override always wins.
Thirteen of fifty-four weakness-recovery routes land the learner on screen 0
instead of the screen that fixes their gap, and nothing detects it because only
the *length* of the positional tag array is checked. A subject-browser tab
exists for Elizabethan England with no module, no chapters and no content. Two
theme keys — Drama and Music — are target qualifications with no curriculum
behind them.

None of this is careless work. It is what happens when a domain has consumers
and no catalogue: each fact settles wherever the consumer that first needed it
happened to live.

## Decision 1 — a separate curriculum catalogue, same pattern, no shared authority

`src/curriculum-catalogue/` follows the shape `0001` established — one authored
source, central validation, deterministic generated projections, generated human
documentation — and shares none of the component catalogue's authority.

Neither catalogue may reference the other. A curriculum record must not name a
component; a component record must not name a subject, module or specification.
The join between them already exists and stays where it is: a chapter's content
file authors `type:` values that `ScreenRenderer` routes through the generated
authoring registry.

They are different questions — *what is this component* versus *what is this
learner studying* — with different change cadences and different runtime
exposure. Combining them would give one validator authority over two unrelated
release cycles, which is the mistake `0001` explicitly declined to make when it
left the authoring registry out of the component catalogue.

## Decision 2 — the upper model is relational, not a tree

Four record types with explicit references: **Subject**, **Specification**,
**Study pathway**, **Module** — then Chapter, and Concept unchanged.

`Subject → Specification` is not an ownership hierarchy. AQA Combined Science:
Trilogy is one specification covering Biology, Chemistry and Physics; under a
tree it must belong to one of the three and the other two must duplicate or lose
it. `specification.subjectIds` is a list on every record, so nothing is
special-cased.

The relationships, stated as rules:

- a Specification covers one or more Subjects;
- a Study pathway realises exactly one Specification with a specific set of
  selections;
- a Module has one primary Subject and may be referenced by many pathways;
- a Chapter belongs to exactly one Module.

Two arrows are deliberately absent. Subject does not own Specification —
Combined Science forbids it. Module does not own Specification — a module is
reused across the Foundation and Higher pathways of one specification, and
across Combined and Triple Science.

## Decision 3 — "study pathway", not "course"

A pathway is the exact route a learner follows: tier, option choices, set texts,
and the ordered modules that result.

`course` is avoided because the learning graph already applies it at four
different levels: `history:medicine` is a specification option, the four
`biology:*` nodes are AQA topics, `maths:number` is a content domain, and
`english:language-paper-1` is an exam paper. Reusing the word would import a
measured ambiguity into the one entity that has to be unambiguous.

## Decision 4 — English is two subjects; the theme key stays one

`english-language` and `english-literature` are separate canonical subjects.
Decided from requirements, not aesthetics: two AQA specifications, separately
certificated; Literature carries text selections and Language carries none;
subject strings are persisted progress identity, and a merged "English %" over
Macbeth analysis and unseen-text writing is not a number a learner can act on;
content reuse between them is zero.

Both point at the same `English` theme key. That is the clearest available
demonstration of the distinction this ADR turns on: **a theme key is
presentation, a subject is identity**, and they have been the same string only
by coincidence.

## Decision 5 — ordering belongs to the relationship

`{ moduleId, position }` on a pathway; `{ chapterId, position }` on a module.
`chapter.number` becomes derived.

Proved against the code, not asserted. `chapter.number` already collides three
times. `resolveNextAvailableChapter` and `buildChapterCompletePayload` both
order by `chapterIds.indexOf()`. `Subjects.jsx` falls back to array position
when `number` is absent, which it is for 21 of 60 chapters. Position is already
the operative fact; `number` is a display value that has been allowed to look
like identity.

## Decision 6 — the Western Front becomes its own module

It is a distinct element of Edexcel Paper 1 — *thematic study* **and** *historic
environment* — and it is what the source-utility and source-follow-up questions
assess. Today it is chapter 15 of 15 inside Medicine with nothing marking it as
different, and the app already needs the distinction: `guidedAnswerCoach.js`
defines those two question types, and no curriculum record can say which content
they target.

`selectionGroup: 'thematic-study-and-historic-environment'` on both module refs
carries the pairing Edexcel requires, so separating the modules loses nothing
and makes a different historic environment a pathway edit rather than a Medicine
rewrite.

## Decision 7 — a specification requirement is not a concept

They answer different questions, change for different reasons and have different
granularity. *"Students should be able to describe how to carry out a required
practical"* is mandated coverage with an assessment method, not a teachable
knowledge atom. Merging them means either inventing pseudo-concepts for
assessment rules or losing coverage reporting entirely.

Requirements are authored only for specifications whose content is being built.
No speculative requirement sets.

## Decision 8 — no chapter id is renamed, and the naming rules say so

All 60 existing chapter ids are preserved verbatim, including the ones that
break the rules: `spain-new-world-1` puts a position number in identity;
`soc1`, `math1`, `bio_building_blocks` and `sci_bio_w1` use underscores.

Each is a live progress key. A clean-looking id is not worth losing learner
progress, so the naming rules bind new ids and non-chapter entities only.

Where a rename is genuinely wanted later, the repository already has the
mechanism and six worked precedents: `LEGACY_CHAPTER_ID_MAP` in
`src/data/chapterProgress.js`, with `chapterProgressSourceKeys` folding every
older copy forward monotonically.

Subject ids are the harder case and are treated as a migration rather than a
rename. `recordScore` and the weakness tracker persist display strings, and
`English` is a one-to-two split no mechanical mapping resolves. Subject records
carry `legacyProgressNames`; no persisted row is rewritten.

## Decision 9 — every derived fact is generated, and no copy survives to be compared

`screenCount`, `screenTags`, chapter `number`, chapter `subject`, chapter
`series`, the loader registry, browser tabs, subject titles and descriptions,
coming-soon presentation, and the `examboard:` / `course:` / `paper:` / `tier:`
tags all become projections.

Every drift test that currently keeps two copies equal is **deleted at
migration, not ported**. The `screenTags` case is the argument in miniature: its
length is checked and its positions are not, which is exactly how thirteen
recovery routes came to point at the wrong screen while every test passed.

## Decision 10 — records are build-time data; only named projections ship

`src/curriculum-catalogue/**` must never be imported by production `src/**`,
proved by a filesystem-derived sweep rather than an allowlist — the same rule and
the same proof shape `0001` already runs over 84 component records.

Six projections are permitted: navigation, modules, chapters and chapter content
loaders under `src/data/generated/curriculum/`, plus a generated curriculum map
and specification coverage report under `docs/curriculum/`. Each carries only
the fields its consumers read.

## What this deliberately does not do

**It does not reopen Component Platform v1.** The component catalogue, the four
generated registries, `ChapterPlayer` as chapter-lifecycle owner and
`ScreenRenderer` as the only routing boundary are settled. This ADR was written
against them, not over them.

**It does not move runtime boundaries.** No curriculum record gains a lifecycle
field, names a component, or carries a screen type. No exam-board logic reaches
a component. No subject branch enters `ChapterPlayer`. The migration changes how
a chapter is described, grouped, discovered and resolved — never how it runs.

**It does not implement anything.** Phase 5A produced a baseline, a census of
171 entities, an authority matrix, 20 recorded anomalies, the ontology, eleven
worked qualification models, ID rules, an ownership table, catalogue boundaries
and a six-stage migration. It changed no production behaviour, no authored
content, no learner-facing UI, no progress storage, no component routing and no
generated runtime registry.

**It does not fix the anomalies it found.** A-9 (two hero images pointing at the
wrong subject) and A-10 (20 dead map entries) are one-line fixes and are left
alone. A planning commit that quietly fixes things is a migration hiding inside
a planning commit.

**It does not decide ten things it has no authority to decide.** They are
recorded in `DECISIONS.md` with an owner, a proposed default and what the
implementation does meanwhile. Each is arranged so that deciding it later is a
data edit, not a redesign. Five have since been closed by the product owner —
see Decision 11 — and five remain open (OD-2, OD-3, OD-6, OD-9, OD-10).

## Decision 11 — the five product decisions, closed before implementation

Added after the design was accepted and before curriculum migration Stage 0.
None of them changed the architecture; each settled a question the architecture
was deliberately built to answer either way.

**OD-1 — historical `'English'` progress rows stay exactly as stored.** They are
never rewritten, remain visible in historical activity, are treated as legacy and
unattributed, and contribute to neither `english-language` nor
`english-literature` averages. `legacyProgressNames` on the subject records is how
the read layer recognises them, and the treatment must be made **explicit** rather
than letting rows silently disappear from a total that no longer adds up. There is
no reliable mechanical way to tell whether an old row was Language or Literature,
and guessing would fabricate learner data.

**OD-4 — `soc1`–`soc3` move to `sociology-aqa-key-concepts`;** `soc4` and `soc6`
stay in `sociology-aqa-families`. Culture, norms, values and socialisation;
sociological approaches; feminism, power and life chances — these are
cross-course foundations rather than substantive Families content, and the split
supports reuse across both AQA Sociology papers. Future canonical records only:
nothing moves in the current runtime catalogue.

**OD-5 — `history-medicine-nightingale` stays a distinct chapter**, `planned`
until built, and is not absorbed into `history-medicine-great-stink`. Nightingale,
nursing and hospital reform form a coherent Edexcel Medicine development with
enough factual content, causation, significance and exam relevance to justify a
separate learner journey. A-20's broken recovery route is a routing defect to fix
on its own terms, not an argument for collapsing a curriculum unit.

**OD-7 — no Drama or Music records in Stage 0 or Stage 1.** Their worked examples
stay architecture proofs. Real records arrive when the first module for each
qualification is ready to be planned or built.

**OD-8 — the browser is derived from configured study pathways.** A subject is
shown when a non-retired catalogue study pathway included in the navigation
configuration reaches at least one non-retired module for that subject. Both
`active` and `planned` modules qualify — an active module can show available or
planned chapters, a planned module can carry a subject-level coming-soon
experience — and retired modules never make a subject visible. This refines the
Phase 5A default (`at least one active module`) and matters because it lets
Combined Science expose Biology, Chemistry and Physics from one specification
without assigning that specification to a single subject. **No
`subject.browsable` field is added**: visibility is derived, never authored, and
the schema forbids the field from Stage 0 onwards. Stage 5 must preserve the
current seven visible subjects during the authority transfer.

**Compatibility retirement is sequenced on final consumers, not on the browser.**
The migration's temporary compatibility projection
(`src/curriculum-catalogue/compatibility/`) becomes load-bearing at Stage 4,
when the three runtime files re-export the generated projections. Stage 5 then
*adds* canonical navigation and migrates `Subjects.jsx` — it deletes nothing,
because nine other production consumers still import the compatibility-shaped
`MODULES`, `CHAPTERS` and `CHAPTER_CONTENT_LOADERS`. Every compatibility field
is therefore deleted at **Stage 6**, each one only after its own final consumer
has been migrated or removed, and `runtime-v1.js` only once no generated output
still needs it. A field whose last *reader* is the browser is not thereby
retirable: it is still a key on a live legacy export. `FINAL_CONSUMERS` in
`compatibility/index.js` records the blocking consumer per field;
`docs/system/CURRICULUM_RUNTIME_COMPATIBILITY.md` §7 is the human table.

**A browser destination is not a subject, and gets its own build-time entity.**
OD-8 derives visibility from *configured* study pathways, and Stage 5 found that
no configuration existed and that a subject-keyed projection cannot produce
today's browser: canonical English is two subjects against one English
destination, and one Combined Science pathway reaches three destinations. The
browser destination is therefore configured in
`src/curriculum-catalogue/navigation/` — a sibling of `records/` and
`compatibility/`, and neither. It is **not a seventh curriculum entity**, no
`browsable` field is added to any subject record, `english-language` and
`english-literature` are never merged, and browser copy and imagery stay out of
subject records: a tile's description is true of the tile, not of the
discipline. Stage 5 splits accordingly — **5A** generates an inert navigation
projection, **5B** switches `Subjects.jsx` onto it, and **5C** retires post-cutover naming and dead fallbacks without changing learner behaviour. Contract pack:
`.planning/phase-5-curriculum-architecture/stage-5-navigation/`.

## Consequences

- Adding a chapter becomes one edit to one module's chapter file plus a content
  file. `screenCount`, `screenTags`, the loader entry, the browser card and the
  chapter number all follow.
- Adding a qualification becomes a specification record plus a pathway record.
  Tiers, option choices and set texts are data.
- The old `subjectCatalogue.js` is retired. The accurately named
  `subjectNavigationAdapter.js` remains as the sole production boundary to the
  generated projection; hardcoded browser catalogues and all twelve `cs_*`
  placeholder ids retire.
- `pnpm verify` gains a `curriculum:check` step and loses four drift tests.
- `docs/system/CONTENT_HIERARCHY.md` is updated to distinguish curriculum
  ownership from Browser Entry presentation and generated navigation.

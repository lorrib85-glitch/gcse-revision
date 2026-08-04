# Phase 5A — worked qualification models

Eleven target qualifications, modelled in the entity shapes defined in
`DESIGN.md` §3. These are **architecture tests written as documents**: the
ontology fails if any one of them needs an exception, an overloaded field, or a
special case in the schema.

Each model states what it proves and where it deliberately stops.

> ### Accuracy boundary
>
> Specification codes, paper structures and timings below are stated as the
> architecture requires them and are believed correct, but they are **not
> repository-measured facts** — unlike everything in `CENSUS.md`. Before any
> specification record is authored, each must be verified against the current
> board document. That verification is a task in `IMPLEMENTATION-PLAN.md`
> (Stage 1), not an assumption this phase is allowed to bake in.
>
> The architecture does not depend on any of these numbers being right. It
> depends on the *shapes*: one specification covering many subjects, one
> specification carrying many pathways, modules reused by reference, and
> selections resolved at pathway level.

Shared abbreviations: **Spec** = specification record, **Path** = study pathway
record, **Mod** = module record, **Ch** = chapter record.

---

## 1. AQA Mathematics — tiering

```js
Spec  aqa-gcse-mathematics-8300
      boardId: 'aqa'   qualification: 'gcse'   code: '8300'
      subjectIds: ['mathematics']
      tiers: ['foundation', 'higher']
      papers: [ -8300-paper-1, -8300-paper-2, -8300-paper-3 ]   // each carries its own tier variants

Path  aqa-maths-8300-foundation     tier: 'foundation'   selections: {}
Path  aqa-maths-8300-higher         tier: 'higher'       selections: {}
```

Both pathways reference the same modules:

```js
// aqa-maths-8300-foundation.moduleRefs
[ { moduleId: 'maths-aqa-number',   position: 0, required: true },
  { moduleId: 'maths-aqa-algebra',  position: 1, required: true },
  { moduleId: 'maths-aqa-ratio-proportion', position: 2, required: true },
  { moduleId: 'maths-aqa-geometry-measures', position: 3, required: true },
  { moduleId: 'maths-aqa-probability', position: 4, required: true },
  { moduleId: 'maths-aqa-statistics',  position: 5, required: true } ]

// aqa-maths-8300-higher.moduleRefs — same six modules, plus:
  { moduleId: 'maths-aqa-higher-algebra-extension', position: 6, required: true }
```

**Shared vs tier-specific content.** Three cases, and the model handles each
without a new field:

| Case | Handled by |
|---|---|
| Content identical across tiers | the same chapter, in a module both pathways reference |
| Higher-only content | a module (or chapters within one) referenced only by the Higher pathway |
| Same topic, materially different objectives | **two chapters** in the same module, one referenced by each pathway's module ref chain |

**Tier differences do not automatically duplicate content.** The census supports
this directly: all eight existing Maths chapters are Number content that serves
both tiers, and none carries a tier field today. The rule is *objective-led* —
duplicate a chapter only when the learning objective materially differs
(e.g. surds: Foundation recognises, Higher manipulates), not merely because a
Higher paper can ask a harder question about it.

**Where tier lives.** On the pathway, never on the module or chapter. A learner
moving Foundation → Higher changes which pathway they follow; every chapter they
completed keeps its `gcse_chapter_<id>` progress, because progress is keyed on
chapter (DESIGN.md §3.3).

**Proves:** one specification carrying two pathways; module reuse by reference;
tier as a pathway property.
**Stops at:** only `maths-aqa-number` has content today. The other six modules
are `status: 'planned'` with empty `chapterRefs`.

---

## 2. AQA Combined Science: Trilogy — the multidisciplinary proof

This is the model that disproves `Subject → Specification` as an ownership tree.

```js
Spec  aqa-gcse-combined-science-trilogy-8464
      code: '8464'
      subjectIds: ['biology', 'chemistry', 'physics']     // ← three
      tiers: ['foundation', 'higher']
      papers: [
        { id: '…-paper-1-biology',   subjectId: 'biology'   },
        { id: '…-paper-2-biology',   subjectId: 'biology'   },
        { id: '…-paper-3-chemistry', subjectId: 'chemistry' },
        { id: '…-paper-4-chemistry', subjectId: 'chemistry' },
        { id: '…-paper-5-physics',   subjectId: 'physics'   },
        { id: '…-paper-6-physics',   subjectId: 'physics'   },
      ]

Path  aqa-combined-science-8464-foundation   tier: 'foundation'
Path  aqa-combined-science-8464-higher       tier: 'higher'
```

Under a tree this specification would have to belong to Biology, Chemistry *or*
Physics. Here it belongs to none of them and covers all three; `subjectIds` is a
list for every specification, so nothing is special-cased.

**Discipline-specific modules under one pathway:**

```js
// aqa-combined-science-8464-higher.moduleRefs
{ moduleId: 'biology-aqa-cell-biology',   position: 0 }   // subjectId: 'biology'
{ moduleId: 'biology-aqa-organisation',   position: 1 }
{ moduleId: 'chemistry-aqa-atomic-structure', position: 6 }  // subjectId: 'chemistry'
{ moduleId: 'physics-aqa-energy',         position: 12 }  // subjectId: 'physics'
```

A module keeps exactly one `subjectId` — its discipline — while the pathway
spans three. That is what lets the learner browser group a Combined Science
learner's modules by discipline without any module claiming to be
multidisciplinary.

**Paper grouping** comes from `module.specRefs[].paperIds`, so "which modules
does Paper 3 assess?" is a query, not a maintained list.

**Proves:** one specification covering three subjects; papers carrying their own
`subjectId`; module `subjectId` staying singular under a multidisciplinary
pathway.
**Stops at:** no Combined Science content exists. Every module here is
`planned`, and only the Biology ones have chapter ids reserved (§3).

---

## 3. AQA Triple Science — reuse without duplication

```js
Spec  aqa-gcse-biology-8461     subjectIds: ['biology']
Spec  aqa-gcse-chemistry-8462   subjectIds: ['chemistry']
Spec  aqa-gcse-physics-8463     subjectIds: ['physics']

Path  aqa-biology-8461-higher, aqa-biology-8461-foundation   (and likewise ×2)
```

A learner doing Triple Science follows **three pathways**, one per
specification. A learner doing Combined follows **one**. Nothing in the model
needs a "triple" concept — it is a count of enrolments, not an entity.

**The reuse rule, and how it is expressed.** A Cell Biology module definition
exists **once**:

```js
// modules/biology-aqa-cell-biology.js
{
  id: 'biology-aqa-cell-biology',
  subjectId: 'biology',
  specRefs: [
    { specificationId: 'aqa-gcse-combined-science-trilogy-8464',
      paperIds: ['…-8464-paper-1-biology'],
      requirementIds: [ /* the Combined subset */ ] },
    { specificationId: 'aqa-gcse-biology-8461',
      paperIds: ['aqa-gcse-biology-8461-paper-1'],
      requirementIds: [ /* the fuller Triple set */ ] },
  ],
  chapterRefs: [ … ],
}
```

Both the Combined and the Biology pathway reference `biology-aqa-cell-biology`.
The module is not duplicated because two pathways use it — that prohibition is
explicit in `DESIGN.md` §3.4.

**Where Triple-only material lives.** Two shapes, chosen by size:

- a *few* extra requirements in an otherwise shared module → extra **chapters**
  in that module, referenced only by the Triple pathway;
- a *whole* extra unit → its own module (e.g. `biology-aqa-triple-extension`),
  referenced only by the Triple pathway.

Both are expressible with the confirmed v1 fields. Neither needs a `tripleOnly`
flag, which would be a fact about a relationship stored on an entity.

**Proves:** many-to-many module↔specification via `specRefs`; differing
requirement coverage of one module across two specifications; Triple-only
content without duplicating shared definitions.
**Stops at:** no Triple Science content exists. All records `planned`.

---

## 4. AQA English Language

```js
Spec  aqa-gcse-english-language-8700
      subjectIds: ['english-language']       // ← its own subject, not 'English'
      tiers: []                              // untiered
      papers: [
        { id: '…-8700-paper-1', title: 'Explorations in creative reading and writing' },
        { id: '…-8700-paper-2', title: "Writers' viewpoints and perspectives" },
      ]
      // Spoken Language is a separately-reported endorsement, modelled as a
      // paper record with assessmentType: 'nea-endorsement'.

Path  aqa-english-language-8700   tier: null   selections: {}    // exactly one pathway
```

Modules are **skills**, not texts:

```js
{ moduleId: 'english-language-aqa-reading-fiction',    position: 0 }
{ moduleId: 'english-language-aqa-creative-writing',   position: 1 }
{ moduleId: 'english-language-aqa-reading-non-fiction', position: 2 }
{ moduleId: 'english-language-aqa-viewpoint-writing',  position: 3 }
```

**Why text-selection logic does not apply.** Language sets no texts: every
source is unseen and supplied in the exam. Its pathway therefore has empty
`selections` and no `selectionGroup` on any module ref. This is the model's
control case — it shows the selection machinery is genuinely optional rather
than a field every pathway has to fill in with a placeholder.

**Relationship to "English" branding.** `english-language.themeKey === 'English'`,
the same theme key `english-literature` uses. One palette, two subjects — the
proof that theme key and academic identity are different facts
(`DESIGN.md` §3.1).

**Proves:** an untiered, selection-free specification; two subjects sharing one
theme key.
**Stops at:** no English Language content exists. Four `planned` modules, no
chapters. `english:language-paper-1` remains a placeholder concept namespace
(A-13) until a real Language concept collection is designed.

---

## 5. AQA English Literature — selected texts

```js
Spec  aqa-gcse-english-literature-8702
      subjectIds: ['english-literature']
      tiers: []
      papers: [
        { id: '…-8702-paper-1', title: 'Shakespeare and the 19th-century novel' },
        { id: '…-8702-paper-2', title: 'Modern texts and poetry' },
      ]
      selectionGroups: [
        { id: 'shakespeare-text',      paperId: '…-8702-paper-1', required: true },
        { id: 'nineteenth-century-novel', paperId: '…-8702-paper-1', required: true },
        { id: 'modern-text',           paperId: '…-8702-paper-2', required: true },
        { id: 'poetry-anthology-cluster', paperId: '…-8702-paper-2', required: true },
      ]
```

The specification says **what must be chosen**. The pathway says **what was
chosen**:

```js
Path  aqa-english-literature-8702-macbeth-inspector
      selections: {
        'shakespeare-text':         'macbeth',
        'nineteenth-century-novel': null,              // not yet in app scope
        'modern-text':              'an-inspector-calls',
        'poetry-anthology-cluster': null,
      }
      moduleRefs: [
        { moduleId: 'english-lit-aqa-macbeth',
          position: 0, required: true, selectionGroup: 'shakespeare-text' },
        { moduleId: 'english-lit-aqa-inspector-calls',
          position: 1, required: true, selectionGroup: 'modern-text' },
      ]
```

Text modules are **reusable and board-neutral in content**:
`english-lit-aqa-macbeth` is a module a *different* pathway (a school choosing
Macbeth + Blood Brothers) references without redefinition. Swapping the modern
text is a pathway edit — a different `selections` value and a different
`moduleRef` — and touches no module and no chapter.

**Concrete mapping to what exists today.** `eng_macbeth` (1 chapter, built)
becomes `english-lit-aqa-macbeth`. The six `cs_macbeth_2–4` and
`cs_inspector_1–3` placeholder cards (A-15) become planned chapters and a
planned `english-lit-aqa-inspector-calls` module — which is what finally gives
the `english/inspector` browser tab (A-5's sibling) something real behind it.

**Proves:** selection groups owned by the specification, choices owned by the
pathway; module reuse across text combinations; `selectionGroup` on the module
ref earning its place.
**Stops at:** one built chapter. The 19th-century novel and the poetry cluster
are `null` selections — recorded as unchosen, not invented.

---

## 6. Pearson Edexcel History — the user's route

```js
Spec  pearson-edexcel-gcse-history-1hi0
      boardId: 'pearson-edexcel'   code: '1HI0'
      subjectIds: ['history']      tiers: []
      papers: [
        { id: '…-1hi0-paper-1', title: 'Thematic study and historic environment' },
        { id: '…-1hi0-paper-2', title: 'Period study and British depth study' },
        { id: '…-1hi0-paper-3', title: 'Modern depth study' },
      ]
      selectionGroups: [
        { id: 'thematic-study-and-historic-environment', paperId: '…-paper-1', required: true },
        { id: 'period-study',        paperId: '…-paper-2', required: true },
        { id: 'british-depth-study', paperId: '…-paper-2', required: true },
        { id: 'modern-depth-study',  paperId: '…-paper-3', required: true },
      ]
```

The five assessment elements are **four selection groups over three papers**, and
this is exactly where the current model breaks down — `hist_medicine`,
`hist_spain_new_world` and `hist_usa` are three flat arrays with no statement of
which paper or element any of them serves.

```js
Path  pearson-edexcel-history-1hi0-medicine-spain-elizabethan-usa
      selections: {
        'thematic-study-and-historic-environment': 'medicine-and-western-front',
        'period-study':        'spain-new-world',
        'british-depth-study': 'early-elizabethan-england',
        'modern-depth-study':  'usa-conflict',
      }
      moduleRefs: [
        { moduleId: 'history-edexcel-medicine-britain', position: 0, required: true,
          selectionGroup: 'thematic-study-and-historic-environment' },
        { moduleId: 'history-edexcel-western-front',    position: 1, required: true,
          selectionGroup: 'thematic-study-and-historic-environment' },
        { moduleId: 'history-edexcel-spain-new-world',  position: 2, required: true,
          selectionGroup: 'period-study' },
        { moduleId: 'history-edexcel-early-elizabethan', position: 3, required: true,
          selectionGroup: 'british-depth-study' },
        { moduleId: 'history-edexcel-usa-conflict',     position: 4, required: true,
          selectionGroup: 'modern-depth-study' },
      ]
```

Note that **two module refs share one selection group**. That is deliberate and
is the mechanism the Western Front decision turns on.

### 6.1 The Western Front: a separate module, referenced alongside Medicine

Four options were considered against the specification's structure, not against
the shape of the current `hist_medicine` array:

| Option | Verdict |
|---|---|
| Chapter group inside Medicine (**today**) | Rejected. It is chapter 15 of 15 with nothing marking it as different, yet it is assessed by different question types and is the *only* part of Paper 1 examined by source questions. The array cannot express that. |
| Submodule | Rejected. It would add a fifth level to the hierarchy for one case, and no other target qualification needs one. |
| Separate specification | Rejected. It is a component of 1HI0, not a qualification. |
| **Separate module, same selection group** | **Chosen.** |

Why it holds:

1. **It is a distinct specification element.** Paper 1 is *thematic study* **and**
   *historic environment*. They are named separately, assessed separately, and
   the historic environment is what the source-utility and source-follow-up
   questions target.
2. **The selection group already carries the pairing.** Edexcel pairs the two
   in one option, and `selectionGroup: 'thematic-study-and-historic-environment'`
   on both module refs states exactly that: chosen together, taught as two units.
   Nothing is lost by separating the modules.
3. **A different historic environment becomes a pathway edit**, not a Medicine
   rewrite.
4. **The app already needs the distinction.** `guidedAnswerCoach.js` defines
   `source-utility` and `source-follow-up` as separate exam-technique types.
   Those types map to the historic environment; today nothing in the curriculum
   data says so, because there is no record that could.

`history-medicine-western-front` keeps its id and its content file; only its
module membership changes.

**Element-by-element mapping:**

| Specification element | Paper | Module | Status today |
|---|---|---|---|
| Thematic study | 1 | `history-edexcel-medicine-britain` | 14 chapters — 13 built, `history-medicine-nightingale` still a stub |
| Historic environment | 1 | `history-edexcel-western-front` | 1 chapter, built |
| Period study | 2 | `history-edexcel-spain-new-world` | 10 chapters, all stubs |
| British depth study | 2 | `history-edexcel-early-elizabethan` | **no chapters** — currently a browser tab only (A-5) |
| Modern depth study | 3 | `history-edexcel-usa-conflict` | 12 chapters, all stubs |

**Proves:** four selection groups over three papers; two modules sharing one
selection group; a specification element becoming a first-class module.
**Stops at:** Early Elizabethan England gets a `planned` module with empty
`chapterRefs`. No chapters are invented for it.

---

## 7. AQA Sociology

```js
Spec  aqa-gcse-sociology-8192
      code: '8192'   subjectIds: ['sociology']   tiers: []
      papers: [
        { id: '…-8192-paper-1', code: '8192/1',
          title: 'The sociology of families and education' },
        { id: '…-8192-paper-2', code: '8192/2',
          title: 'The sociology of crime and deviance and social stratification' },
      ]

Path  aqa-sociology-8192   tier: null   selections: {}
      moduleRefs: [
        { moduleId: 'sociology-aqa-key-concepts',        position: 0, required: true },
        { moduleId: 'sociology-aqa-families',            position: 1, required: true },
        { moduleId: 'sociology-aqa-education',           position: 2, required: true },
        { moduleId: 'sociology-aqa-crime-deviance',      position: 3, required: true },
        { moduleId: 'sociology-aqa-social-stratification', position: 4, required: true },
        { moduleId: 'sociology-aqa-research-methods',    position: 5, required: true },
      ]
```

Paper mapping via `specRefs`: Families and Education → Paper 1; Crime and
Deviance and Social Stratification → Paper 2. Key concepts and research methods
map to **both**, which `paperIds` being a list handles without comment — and
which the current single `paper:` tag could not express at all.

**This is where A-7 resolves.** `soc_family` currently contains five chapters,
three of which are not Families:

| Chapter | Actual content | New module |
|---|---|---|
| `soc1` What even is sociology? | culture, norms, values, socialisation | `sociology-aqa-key-concepts` |
| `soc2` Marxism vs Functionalism | sociological approaches | `sociology-aqa-key-concepts` |
| `soc3` Feminism, power and life chances | approaches and stratification concepts | `sociology-aqa-key-concepts` |
| `soc4` Family and households | Families | `sociology-aqa-families` |
| `soc6` Family researchers and theory battles | Families | `sociology-aqa-families` |

The split is proposed, not settled — see OD-4. It is recorded here because the
architecture must be able to express it either way, and it can: the difference
is which module a chapter ref sits in.

**The six existing AQA Sociology exam papers** (`ref: '8192/1'`, A-14) become the
first real link from an exam paper to a specification paper record. That link
does not exist today in any direction.

**Proves:** modules mapping to one paper or to both; specification code and
paper structure moving out of exam-paper records into a specification.
**Stops at:** Education, Crime and Deviance, Social Stratification and Research
Methods are `planned` modules with empty `chapterRefs`.

---

## 8. AQA Drama — entity relationships only

```js
Spec  aqa-gcse-drama-8261
      subjectIds: ['drama']   tiers: []
      papers: [
        { id: '…-8261-component-1', title: 'Understanding drama',
          assessmentType: 'written-exam',
          selectionGroups: ['set-play'] },
        { id: '…-8261-component-2', title: 'Devising drama',
          assessmentType: 'nea-practical' },
        { id: '…-8261-component-3', title: 'Texts in practice',
          assessmentType: 'nea-practical',
          selectionGroups: ['performance-texts'] },
      ]
      selectionGroups: [
        { id: 'set-play',          paperId: '…-component-1', required: true },
        { id: 'performance-texts', paperId: '…-component-3', required: true },
      ]

Path  aqa-drama-8261   status: 'planned'
      selections: { 'set-play': null, 'performance-texts': null }
      moduleRefs: [
        { moduleId: 'drama-aqa-set-play',            position: 0, selectionGroup: 'set-play' },
        { moduleId: 'drama-aqa-live-theatre',        position: 1, required: true },
        { moduleId: 'drama-aqa-devising',            position: 2, required: true },
        { moduleId: 'drama-aqa-texts-in-practice',   position: 3, selectionGroup: 'performance-texts' },
      ]
```

The three structures the architecture must support, and what carries each:

| Requirement | Carried by |
|---|---|
| Set text | `selectionGroup: 'set-play'` — identical machinery to Literature |
| Live theatre evaluation | an ordinary required module; it is examined content |
| Devised / performance work | an ordinary module, distinguished by its paper's `assessmentType` |
| Written **and** practical assessment | `paper.assessmentType` — `written-exam` \| `nea-practical` \| `nea-endorsement` |

`assessmentType` is the one field Drama and Music add, and it earns its place
here: without it, a practical component would be indistinguishable from a
written paper, which would be a false statement about the qualification. It
already has a second consumer in English Language's Spoken Language endorsement.

**Proves:** a specification whose components are not all written papers;
practical assessment without a new entity type.
**Stops at:** everything. No set play is named, no module has chapters, no
requirements are authored. Entity relationships only, exactly as scoped.

---

## 9. AQA Music — entity relationships only

```js
Spec  aqa-gcse-music-8271
      subjectIds: ['music']   tiers: []
      papers: [
        { id: '…-8271-component-1', title: 'Understanding music',
          assessmentType: 'written-exam' },
        { id: '…-8271-component-2', title: 'Performing music',
          assessmentType: 'nea-practical' },
        { id: '…-8271-component-3', title: 'Composing music',
          assessmentType: 'nea-practical' },
      ]
      selectionGroups: [
        { id: 'set-work-study', paperId: '…-component-1', required: true },
      ]

Path  aqa-music-8271   status: 'planned'
      moduleRefs: [
        { moduleId: 'music-aqa-aos-western-classical-1650-1910', position: 0, required: true },
        { moduleId: 'music-aqa-aos-popular-music',               position: 1, required: true },
        { moduleId: 'music-aqa-aos-traditional-music',           position: 2, required: true },
        { moduleId: 'music-aqa-aos-western-classical-since-1910', position: 3, required: true },
        { moduleId: 'music-aqa-performing',                      position: 4, required: true },
        { moduleId: 'music-aqa-composing',                       position: 5, required: true },
      ]
```

| Requirement | Carried by |
|---|---|
| Areas of study | one module each — the exact scope test from `DESIGN.md` §3.4 |
| Set works | `selectionGroup: 'set-work-study'`, resolved on the pathway |
| Listening / appraising | Component 1, `assessmentType: 'written-exam'` |
| Performance | a module whose paper is `nea-practical` |
| Composition | a module whose paper is `nea-practical` |

An area of study is a module: nameable, timetabled as a block, larger than a
chapter, smaller than the subject. It needs no new level, which is the point.

**Proves:** areas of study fitting the module definition unchanged; a
specification with one written component and two practical ones.
**Stops at:** everything. No set works, no chapters, no requirements.

---

## 10. What the eleven models establish

| Property under test | Proved by |
|---|---|
| One specification, many subjects | Combined Science (§2) |
| One specification, many pathways | Maths (§1), Combined (§2), Triple (§3) |
| One specification, one pathway, no selections | English Language (§4), Sociology (§7) |
| Tier as a pathway property, not chapter metadata | Maths (§1) |
| Module reused across pathways without duplication | Maths (§1), Triple/Combined (§2–3) |
| Module reused across *specifications* | Triple vs Combined (§3) |
| Selection groups owned by spec, choices by pathway | Literature (§5), History (§6), Drama (§8) |
| Two modules under one selection group | History — Medicine + Western Front (§6.1) |
| A specification element promoted to a module | History (§6.1) |
| Modules mapping to one paper or several | Sociology (§7) |
| Non-written assessment | Drama (§8), Music (§9) |
| Progress surviving a tier or pathway change | Maths (§1), by keying on chapter |

**No model required a schema exception, an overloaded field, or a subject-specific
branch.** Three fields were added while working through them, each with at least
two consumers before being accepted: `paper.assessmentType` (Drama, Music,
English Language), `paper.subjectId` (Combined Science, and retiring
`paper:medicine`), and `selectionGroup` on the module ref (Literature, History,
Drama, Music).

Three fields were *rejected* for having no demonstrated requirement:
`module.tier`, `chapterRef.required`, `chapterRef.availabilityOverride`.

---

## 11. Aggregate scope check

| Qualification | Modules | Built chapters | Planned chapters |
|---|---:|---:|---:|
| AQA Mathematics 8300 (F + H) | 7 | 8 | 0 |
| AQA Combined Science 8464 | ~18 | 0 | 0 |
| AQA Biology 8461 | 6 | 2 | 6 |
| AQA Chemistry 8462 | 4 | 0 | 0 |
| AQA Physics 8463 | 5 | 0 | 0 |
| AQA English Language 8700 | 4 | 0 | 0 |
| AQA English Literature 8702 | 2 | 1 | 6 |
| Edexcel History 1HI0 | 5 | 14 | 23 |
| AQA Sociology 8192 | 6 | 5 | 0 |
| AQA Drama 8261 | 4 | 0 | 0 |
| AQA Music 8271 | 6 | 0 | 0 |
| **Total** | **~67** | **30** | **35** |

Both totals reconcile with the census exactly:

- **30 built** = the 30 `available` chapters in `CENSUS.md` §1.1
  (Maths 8 · History 14 · Sociology 5 · Biology 2 · English 1).
- **35 planned** = the 29 zero-screen stubs (History 23 — one Medicine stub,
  ten Spain, twelve USA — plus Biology 6) **plus** the six `cs_macbeth_2–4` /
  `cs_inspector_1–3` placeholder cards that become planned chapter records.

The 60th chapter, `history-medicine-renaissance-medicine`, appears in no model:
it is the hidden superseded bundle, and the census classifies it `retired-hidden`
— a progress alias, not a chapter. 30 + 35 − 6 placeholders + 1 hidden = the 60
rows in `CHAPTERS` today.

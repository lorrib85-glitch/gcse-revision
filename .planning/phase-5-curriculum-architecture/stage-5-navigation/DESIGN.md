# The browser-entry contract

How a learner-facing browser destination is described, without making it a
curriculum entity and without pushing browser copy into subject records.

Authority: `docs/decisions/0002-canonical-curriculum-architecture.md` (OD-8).
Measured basis: `CURRENT-BROWSER-CONTRACT.md`. Analysis: `AUDIT.md`.

---

## 1. Where it lives

```
src/curriculum-catalogue/navigation/
  browserEntries.js   the configuration — plain serialisable data, no imports
  index.js            validation, cross-checks against the catalogue
  README.md           the rules, and what must never go in here
```

A sibling of `records/` and `compatibility/`, and neither of them.

- Not under `records/` — a browser destination is not curriculum. There are six
  curriculum entity types and this is not a seventh.
- Not under `compatibility/` — that layer reproduces the *old runtime interface*
  and is deleted at Stage 6. Navigation configuration outlives the migration.
- Under `src/curriculum-catalogue/` so that the existing sweep — production
  source must never import `src/curriculum-catalogue/**` — covers it for free,
  with no new guard and no new exception.

## 2. The entity

A **browser entry** is one destination tile. It is app navigation configuration:
a product decision about what this app offers, expressed over curriculum
records it does not own.

```js
{
  id: 'history',                    // stable navigation id, not a subject id
  position: 0,                      // order among the tiles
  label: 'History',                 // the tile's word, and the theme key
  title: 'Medicine through time',   // the browser's headline for the entry
  description: '…',
  heroImage: '/images/…',
  themeKey: 'History',              // REFERENCES src/constants/subjects.js
  subjectIds: ['history'],          // the canonical subjects this represents
  pathwayIds: ['pearson-edexcel-…'],// configured study pathways (OD-8)
  cardMode: 'chapter',              // 'chapter' | 'module' | 'none'
  comingSoon: null,                 // or a subject-level state, see §4
  sections: [ … ],                  // tabs; null when the entry has none
}
```

A **section** is a tab:

```js
{
  id: 'medicine',
  title: 'Medicine through time',
  shortLabel: 'Medicine',
  heroImage: '/images/…',
  comingSoon: false,
  moduleIds: ['history-edexcel-medicine-britain', 'history-edexcel-western-front'],
}
```

`moduleIds` is a **list**, which is the whole point: one tab may present several
canonical modules. Medicine and the Western Front stay two modules underneath
and one tab above, exactly as today.

### What it must not do

| Prohibition | Enforced by |
|---|---|
| become a seventh curriculum entity | `RECORD_TYPES` / `CURRENT_ENTITY_TYPES` unchanged at six; `LAYOUT` untouched |
| add `browsable` to a subject record | schema `REJECTED_FIELDS`, unchanged |
| contain learner progress | validation rejects unknown keys; no storage import |
| import React | the catalogue purity sweep |
| name components | validation rejects unknown keys |
| duplicate canonical module→chapter relationships | it names module ids only; chapter order is read from the module record |
| enter the runtime compatibility projection | `compatibility/` untouched; navigation is generated separately |
| be imported by production source | the existing `src/curriculum-catalogue/**` sweep |

## 3. English — one destination, two subjects, no merge

The English entry declares:

```js
subjectIds: ['english-literature'],
pathwayIds: ['aqa-english-literature-8702-macbeth-inspector'],
```

`english-language` and `english-literature` remain two separate subject records
and are never merged. The entry states plainly which pathway it currently
presents — Literature's — and English Language is simply not configured yet.

Adding it later is one line in `pathwayIds` plus its sections. It is a
configuration change, not another ontology migration. That is the property this
design exists to buy.

The entry's `label` is `English` because the theme key is `English` and the tile
has always said English. `subjectIds` is what carries academic identity, and it
does not claim Language.

## 4. Three card modes, because the browser has three

| `cardMode` | Cards are | Used by |
|---|---|---|
| `chapter` | the configured modules' chapters, in `position` order | History, Biology, Maths, Sociology, English |
| `module` | one card per configured module | Physics |
| `none` | no cards; `comingSoon` carries the state | Chemistry |

`cardMode: 'chapter'` deliberately yields **nothing** for a module with no
`chapterRefs` — which is why Maths' five empty planned modules stay invisible
and History's Elizabethan tab renders as an empty tab rather than a card.

`cardMode: 'none'` requires `comingSoon: { title, subtitle }`, and that is the
sanctioned subject-level coming-soon state. It is a state on the entry, not a
card and not a pseudo-chapter.

## 5. Presentation ownership — the smallest truthful home

| Fact | Home | Why not elsewhere |
|---|---|---|
| Subject palette / accent | `src/constants/subjects.js` (unchanged) | already single-owner, 85 importers, not curriculum |
| Chapter title, subtitle, era, icon, header image | chapter record | genuinely curriculum; survives a browser redesign |
| Module title, short title, hero image, short description | module record `presentation` | a module is a real curriculum unit with a name |
| Tile title, description, hero image | **browser entry** | true of the tile, not of the discipline. `Chemistry` needs a description only because a tile exists |
| Tab title, short label, hero image | **browser entry section** | a tab may span two modules, so no single module owns its name |
| Printed card number | **browser entry override** | derivable from nothing; see D-5-3 |
| Card label where it differs from the module title | **browser entry override** | three Physics cards; see D-5-5 |

Both override tables are declared **temporary, with a retirement condition**,
and each entry must state the fact it preserves. They are parity scaffolding,
not a new authoring surface.

### Why History's title can be "Medicine through time"

The subject record's `title` is `History`, and it is right: History is the
discipline, it survives a board change, and a learner studying Elizabethan
England is still studying History. The **browser entry** title is
`Medicine through time` because the tile's job is to name what is behind it, and
what is behind it today is overwhelmingly one course.

Those are two different questions with two different answers, so they are two
fields on two entities. Forcing them into one would either rename the subject
(false) or rename the tile (a visible change). When the Spain, Elizabethan and
USA modules have content, the entry title changes and the subject record does
not — which is the test that the split is in the right place.

## 6. The generated projection

`src/data/generated/curriculum/navigation.js`, exporting:

```js
NAVIGATION_ENTRIES              // ordered array
getNavigationEntryById(id)
getNavigationEntryForDisplayName(name)   // the theme name Subjects.jsx uses today
```

`getNavigationEntryForDisplayName` exists so Stage 5B is a substitution rather
than a rewrite: `Subjects.jsx` currently keys everything on `'History'`,
`'Biology'`, … and can keep doing so on the day it switches over.

Each projected entry carries only what the browser draws — identity, copy,
imagery, ordered sections, ordered cards, each card's canonical references and
its openable/planned state. No specification, no assessment objective, no
requirement, no progress.

**It is generated and imported by nothing.** Stage 5A ships it inert; Stage 5B
is the authority switch, and gets its own parity gate against the frozen
`tests/fixtures/subject-browser-v1.json`.

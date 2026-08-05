# Stage 5 audit — what the subject browser actually is

Read `CURRENT-BROWSER-CONTRACT.md` first; it holds the measured numbers. This
document is the analysis: where each fact lives today, and what breaks if
Stage 5 is wired straight into `Subjects.jsx`.

Sources audited at `2ef84c6`: `src/features/subjects/Subjects.jsx` (679 lines),
`src/features/subjects/subjectCatalogue.js`, `src/constants/subjects.js`, the
eight subject records, fourteen pathway records, thirty-six module records and
sixty-five chapter records.

---

## 1. Where the browser's facts live now

| Fact | Lives in | Tested? |
|---|---|---|
| The seven tiles and their order | `SUBJECT_NAMES` literal | no |
| Display titles | `SUBJECT_DISPLAY_TITLES` literal | no |
| Descriptions | `SUBJECT_DESCRIPTIONS` literal | no |
| Tile hero images | `SUBJECT_HEADER_IMGS` literal | no |
| Tile thumbnails | `SUBJECT_TOPIC_IMAGES` literal, randomised at mount | no |
| History tabs | `HISTORY_SERIES` literal | no |
| English tabs | `ENGLISH_SERIES` literal | no |
| Tab membership | `chapter.series` string equality | no |
| Card order | `MODULES[].chapterIds` order, via `subjectCatalogue.js` | partly |
| Card title / subtitle | `CHAPTERS` rows and `cs_*` literals | partly |
| Card number | `chapter.number`, else list index + 1 | no |
| Openable state | `getChapterAvailability` + the `comingSoon` flag | yes |
| Placeholder cards | `subjectCatalogue.js` literals | yes (they must not be openable) |
| `CHAPTER_HEADER_IMAGES` | `Subjects.jsx` literal — **20 entries, all dead** | no |

Eight literal maps carry learner-facing copy and imagery with no test behind
any of them. That is the real reason Stage 5 is worth doing, and also the reason
it cannot be done in one step: there is nothing today that would notice a
regression.

## 2. Three structural blockers

### 2.1 Canonical English is two subjects; the browser has one destination

`english-language` and `english-literature` are two subject records — they
survive a specification change independently and are assessed by different
specifications. The browser has exactly **one** English tile, showing two
English **Literature** set texts. `aqa-english-language-8700` exists, is
`planned`, and holds four modules that appear nowhere in the browser.

A projection keyed on subject id therefore cannot produce today's browser: it
would produce either two English tiles (a visible change) or one tile whose
identity silently merges two academic subjects (a modelling lie that would
propagate into progress attribution, where `'English'` is already an
unattributed legacy string neither subject claims).

**Consequence:** the browser destination cannot be a subject. It needs its own
entity. See DESIGN.md §2.

### 2.2 Descriptions and hero images are not curriculum facts

`SUBJECT_DESCRIPTIONS.Biology` is *"Build your understanding from cells to
ecosystems."* That is marketing copy for a browser tile. It is not true of the
subject `biology` in any sense that survives the browser being redesigned, and
the subject record deliberately carries no such field.

Pushing it into the subject record to unblock `Subjects.jsx` would make the
curriculum catalogue answer a question it does not have — and would give
`chemistry`, which has no browsable content at all, a description it only needs
because a tile exists.

**Consequence:** presentation belongs to the navigation entry, not the subject.
See DESIGN.md §5.

### 2.3 OD-8 requires a navigation configuration that does not exist

OD-8 says a subject is shown when *a non-retired study pathway **included in the
navigation configuration*** reaches a non-retired module for it. There is no
navigation configuration. Deriving visibility from "any active pathway" instead
gives the wrong answer twice over:

- `aqa-english-language-8700` is `planned`, not retired, and holds four modules
  for `english-language` — so English Language would become an **eighth tile**;
- `aqa-combined-science-8464-*` reaches `chemistry` and `physics`, so those
  tiles are legitimate, but the same pathway also reaches `biology` — one
  pathway, three destinations, which no subject-keyed rule can express.

**Consequence:** the configuration is the missing artefact, and it is what
Stage 5A must land. Without it Stage 5 has no way to preserve seven tiles.

## 3. Findings that change the projection's shape

### 3.1 The printed card number is derivable from nothing

Measured against every candidate rule, across all 37 + 8 + 1 + 5 + 8 + 7 + 5
cards:

| Rule | Cards it gets wrong |
|---|---|
| `position + 1` within the canonical module | **24** |
| index within the tab, `+ 1` | **17** |

Examples: `history-medicine-surgery-anaesthetics` prints `4` at position 5;
`soc6` prints `6` at position 1; `history-medicine-western-front` prints `14`
though it is position 0 of its own module; `bio_human_machine` prints `3` at
position 0 of `biology-aqa-organisation`.

The number is a frozen display index with two collisions (`4` twice in medicine,
`2` twice in biology). `DESIGN.md` §5.2 of the parent plan proposed deriving it
from `position + 1` and explicitly called that *"retires the three collisions of
A-3"* — i.e. a deliberate, learner-visible correction.

**Stage 5A is not allowed to make a learner-visible change**, so the projection
must carry the printed number as browser presentation and the correction becomes
its own reviewed change. See DECISIONS.md D-5-3.

### 3.2 Three card modes, not one

The browser presents planned content three different ways, and all three are
load-bearing:

| Mode | Where | What a planned module contributes |
|---|---|---|
| chapter cards | History, Biology, Maths, Sociology, English | its chapters, if it has any; **nothing** if it has none |
| module cards | Physics | **one card per module** |
| subject-level state | Chemistry | **no cards at all**, one "Content coming soon" tile |

Maths proves the first mode is real: `aqa-maths-8300-foundation` holds five
`planned` modules with zero chapters, and the browser shows none of them. If
Physics' rule were applied to Maths, five new cards would appear.

### 3.3 Foundation and Higher are not interchangeable

| Pathway pair | Module sequences | Safe to configure both? |
|---|---|---|
| `aqa-biology-8461-{foundation,higher}` | identical, 6 modules | **yes** — dedupe |
| `aqa-physics-8463-{foundation,higher}` | identical, 5 modules | **yes** — dedupe |
| `aqa-chemistry-8462-{foundation,higher}` | identical, 1 module | **yes** — dedupe |
| `aqa-maths-8300-{foundation,higher}` | **differ** — higher adds `maths-aqa-higher-algebra-extension` | **no** — needs an explicit selection |

Maths is the case the generator must refuse to guess at. Showing the union would
surface a Higher-only module to a Foundation learner; showing the intersection
would hide it from a Higher one. Until a learner pathway preference exists, the
configuration names one tier explicitly and the generator fails if a pair it was
told to merge stops being identical.

### 3.4 Combined Science genuinely spans three destinations

`aqa-combined-science-8464-foundation` holds 11 modules: 6 `biology`,
1 `chemistry`, 4 `physics`. It is the proof that a pathway must be filterable by
module `subjectId` when it contributes to an entry — not a hypothetical.

### 3.5 The Elizabethan tab already has canonical backing

`history-edexcel-early-elizabethan` is a `planned` module with a title, a short
description, a hero image and zero `chapterRefs`. The browser's empty
Elizabethan tab maps onto it exactly. Nothing has to be invented, and no fake
chapter id is involved — the earlier concern does not survive contact with the
records.

### 3.6 The six English placeholders are already canonical, verbatim

Every `cs_macbeth_*` and `cs_inspector_*` card's title and subtitle is
character-identical to a real `planned` chapter record. The mapping is 1:1 and
requires no copy change at all.

### 3.7 Three Physics module titles differ from their placeholder labels

| Placeholder label | Canonical module title |
|---|---|
| Forces & Motion | Forces and motion |
| Waves & Electricity | Waves and electricity |
| Matter & Particles | Matter and particles |

`Energy` and `Space` match. Subtitles match exactly on all five. Adopting the
canonical titles would change visible copy on three cards, which Stage 5A
forbids — so they are carried as explicit, retirable label overrides and listed
as a copy decision. See DECISIONS.md D-5-5.

## 4. What Stage 5B still has to do after 5A

Nothing in 5A touches the browser. 5B remains: point `Subjects.jsx` at
`NAVIGATION_ENTRIES`, delete the eight literal maps and
`CHAPTER_HEADER_IMAGES`, delete `subjectCatalogue.js`, verify the seven
destinations at 390px, and only then remove the old catalogue. The parity
fixture landed in 5A is what makes that switch checkable.

# The current subject-browser contract

**Measured, not recalled.** Every figure below was read out of the running code
at `2ef84c6` by executing `getSubjectChapterList` and `getChapterAvailability`
through the same pipeline `Subjects.jsx` uses, with an empty progress store.

This is the thing Stage 5B must reproduce exactly. Nothing here is a proposal.

---

## 1. The seven destinations

`SUBJECT_NAMES` in `Subjects.jsx`, in this order:

| # | Tile | Cards | Openable | Tile progress denominator |
|---|---|---|---|---|
| 1 | History | 37 | 14 | 38 chapters |
| 2 | Biology | 8 | 2 | 8 chapters |
| 3 | Chemistry | 1 | 0 | 0 chapters |
| 4 | Physics | 5 | 0 | 0 chapters |
| 5 | Maths | 8 | 8 | 8 chapters |
| 6 | English | 7 | 1 | 1 chapter |
| 7 | Sociology | 5 | 5 | 5 chapters |

**Openable total: 30** — the same 30 the runtime reports through
`isChapterAvailable`.

**The tile denominator is not the card count.** It is
`CHAPTERS.filter(c => c.subject === name)`, which is a different set:

- History's 38 includes the **hidden** Renaissance row, which is not a card;
- Chemistry's and Physics' are **0**, so their tile percentage is a hardcoded
  `0` from the `chapters.length ? … : 0` guard, not an average of nothing;
- English's is **1**, because the six placeholder cards are not `CHAPTERS` rows.

A tile percentage is `round(mean(chapterPct(chapter)))` over that set. Stage 5B
must keep the same input set or every tile ring moves.

## 2. Per-destination presentation

Four hardcoded maps in `Subjects.jsx`, keyed by the theme name:

| Tile | Display title | Description | Hero image |
|---|---|---|---|
| History | Medicine through time | Explore how medicine and ideas have shaped the world. | `/images/history/_shared/medicine-through-time.webp` |
| Biology | AQA Biology | Build your understanding from cells to ecosystems. | `/images/biology/_shared/main.png` |
| Chemistry | AQA Chemistry | Master the reactions and patterns behind matter. | `/images/chemistry/_shared/matteratoms.webp` |
| Physics | AQA Physics | Explore the forces and energy that shape our world. | `/images/physics/_shared/forces.webp` |
| Maths | AQA Mathematics | Build number, algebra and problem-solving fluency. | `/images/maths/_shared/numbers.webp` |
| English | AQA English | Sharpen your reading, analysis and writing skills. | `/images/english/_shared/macbeth.webp` |
| Sociology | AQA Sociology | Understand the social forces that shape our lives. | `/images/sociology/_shared/family.webp` |

The tile thumbnail is picked at random per mount from `SUBJECT_TOPIC_IMAGES` —
**not** the hero image, and not deterministic. It is presentation noise and is
excluded from the parity contract.

**`History` displays "Medicine through time".** The tile is the subject; the
title is the one course the app actually teaches. That is why the display title
cannot simply become the subject record's `title` — see DECISIONS.md D-5-4.

## 3. Tabs

Only History and English have tabs. Tab order is declaration order.

### History — `HISTORY_SERIES`

| # | id | Title | Short | Hero image | Coming soon | Cards | Openable |
|---|---|---|---|---|---|---|---|
| 1 | `medicine` | Medicine through time | Medicine | `/images/history/_shared/medicine-through-time.webp` | no | 15 | 14 |
| 2 | `spain-new-world` | Spain and the new world | Spain | `/images/history/_shared/spain-new-world.webp` | no | 10 | 0 |
| 3 | `elizabethan` | Elizabethan England | Elizabethan | `/images/history/_shared/elizabethan.webp` | **yes** | **0** | 0 |
| 4 | `usa` | USA: conflict at home and abroad | USA | `/images/history/_shared/usa-conflict.webp` | no | 12 | 0 |

**The medicine tab holds two canonical modules.** Its 15 cards are the 14
`history-edexcel-medicine-britain` chapters plus
`history-medicine-western-front`, which is the whole of
`history-edexcel-western-front`. One learner tab, two canonical modules — the
Edexcel option pairs them, and the browser has always shown them together.

**The Elizabethan tab renders zero cards.** It is a real tab with a real hero
image and no content. `history-edexcel-early-elizabethan` is a genuine `planned`
module with empty `chapterRefs`, so the tab already has canonical backing; the
`comingSoon: true` flag is browser presentation, not a fake chapter.

### English — `ENGLISH_SERIES`

| # | id | Title | Short | Hero image | Coming soon | Cards | Openable |
|---|---|---|---|---|---|---|---|
| 1 | `macbeth` | Macbeth | Macbeth | `/images/history/_shared/medicine-through-time.webp` | no | 4 | 1 |
| 2 | `inspector` | An Inspector Calls | Inspector | `/images/sociology/_shared/family.webp` | **yes** | 3 | 0 |

Both hero images are **wrong** — Macbeth shows the Medicine artwork and An
Inspector Calls shows the Sociology family artwork (census A-9). They are
reproduced exactly. Fixing them is a content decision, not a migration one.

## 4. Cards

The card list per tab, in order, with the number the browser prints.

### History · medicine

`1` Trust me, I'm Following Jupiter · `2` The day everything changed ·
`3` The beginning of doubt · `4` The man who proved everyone wrong ·
`5` London's year of terror · **`4` Surgery & anatomy** ·
`6` The boy, the cow and the cure · `7` The invisible enemy ·
`8` The great stink · `9` The day surgery changed forever ·
`10` The lady with the lamp *(coming soon)* · `11` The accidental miracle ·
`12` When medicine became magic · `13` Can we beat cancer? ·
`14` Hell in the trenches

Two cards print `4`. `history-medicine-surgery-anaesthetics` sits at canonical
position 5 and prints 4 — census anomaly A-3, reproduced exactly.

### History · spain-new-world

`1`–`10`, all coming soon, in `spain-new-world-1` … `-10` order.

### History · usa

`1`–`12`, all coming soon, in `usa-segregation` … `usa-long-way-out` order.

### Biology

`1` Building blocks · `2` Plant Cells & Photosynthesis · **`2` Building Life** ·
`3` The Human Machine · `4` Disease Wars · `5` Control Systems ·
`6` Genetics & Evolution · `7` Ecosystems

Two cards print `2`. Only the first two are openable.

### Maths

`1`–`8`, all openable, `math1` … `math8`.

### Sociology

`1` What Even is Sociology? · `2` Marxism vs Functionalism ·
`3` Feminism, Power & Life Chances · `4` Family & Households ·
**`6`** Family Researchers & Theory Battles

`soc6` prints `6` at canonical position 1. There is no card `5`.

### Physics — five module-shaped placeholder cards

`1` Forces & Motion · `2` Energy · `3` Waves & Electricity · `4` Space ·
`5` Matter & Particles — all coming soon, subtitles `AQA Physics · Topic …`.

### Chemistry — one subject-level card

`1` **Content coming soon** / *Chemistry*. Not a module, not a chapter — the
`cs_<subject>` fallback in `subjectCatalogue.js`.

### English · macbeth

`1` Power and ambition *(openable)* · `2` Out, damned spot ·
`3` Double, double, toil and trouble · `4` Fair is foul, foul is fair

### English · inspector

`1` We are members of one body · `2` I accept no blame ·
`3` Fire, blood and anguish

## 5. Placeholder identities in use today

Twelve `cs_*` ids, none of which is a chapter:

| Placeholder | What it stands for |
|---|---|
| `cs_macbeth_2` `cs_macbeth_3` `cs_macbeth_4` | three planned Macbeth chapters |
| `cs_inspector_1` `cs_inspector_2` `cs_inspector_3` | three planned Inspector Calls chapters |
| `cs_forces` `cs_energy` `cs_waves` `cs_space` `cs_matter` | five planned Physics **modules** |
| `cs_chemistry` | a subject-level coming-soon **state** |

The six English placeholders match their canonical chapter records' `title` and
`subtitle` **character for character**. The five Physics placeholders match their
modules' `shortDescription` exactly but differ from the module `title` on three.

## 6. Fact classification

| Fact | Kind |
|---|---|
| Which chapters exist, their titles, subtitles, order within a module | **curriculum** |
| Which modules a course contains, and their order | **curriculum** |
| `status` — available / planned | **curriculum** |
| Which seven tiles exist, and their order | **app navigation configuration** |
| Which pathways a tile presents | **app navigation configuration** |
| Which modules group into which tab | **app navigation configuration** |
| Tab order, tab `comingSoon` flag | **app navigation configuration** |
| Display title, description, tile hero image | **browser presentation** |
| Tab title, short label, tab hero image | **browser presentation** |
| Subject accent / palette | **browser presentation** (already owned by `src/constants/subjects.js`) |
| The printed card number | **browser presentation** — see D-5-3, it is derivable from nothing |
| Random tile thumbnail | **browser presentation**, non-deterministic, out of contract |
| Card `status` (`completed` / `in_progress` / `not_started`) and `pct` | **derived learner state** |
| Tile percentage, browser ring percentage, "next up" index | **derived learner state** |
| `series` as the tab-grouping key | **temporary compatibility** |
| The twelve `cs_*` ids | **temporary compatibility** |
| The hidden Renaissance row inside History's tile denominator | **temporary compatibility** |

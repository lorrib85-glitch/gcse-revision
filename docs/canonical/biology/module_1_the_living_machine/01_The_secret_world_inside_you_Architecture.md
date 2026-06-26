# Chapter 1: The secret world inside you — Architecture

## 1. Identity

- **Chapter:** 1
- **Title:** The secret world inside you
- **App module id:** `bio_building_blocks`
- **App module title:** Building blocks
- **Subject:** AQA GCSE Combined Science Trilogy — Biology Paper 1
- **Module:** Module 1 — The living machine
- **Build status:** Built (14 screens, updated June 2026)
- **Content file:** `01_The_secret_world_inside_you_Content.md`

---

## 2. Six-part structure mapping

All chapters follow the six-part science rhythm defined in `docs/system/SCIENCE_MODULE_BLUEPRINT.md`.

### Part 1 — Situation + prediction

**Screens:** 1 (cinematic reveal), 2 (guided choice carousel), 3 (mission)

- Screen 1: cinematic opening — leaf, blood, skin, bark described as completely different, resolving to "every one built from the same thing"
- Screen 2: prediction carousel — four options (Blood / Cells / Organs / Chlorophyll); each wrong answer redirects curiosity rather than penalising
- Screen 3: mission screen — four learning targets including eukaryotic/prokaryotic distinction; brief statement that plant and animal cells are eukaryotic, bacterial cells are prokaryotic

**Components:** `CinematicRevealMoment`, `GuidedChoiceCarousel`, read block

---

### Part 2 — Investigate the evidence

**Screens:** 4 (plant cell hotspot), 5 (animal cell hotspot)

- Screen 4: interactive plant cell explorer — 8 hotspots: cell wall, cell membrane, cytoplasm, nucleus (eukaryotic note), chloroplast (many cells exposed to light), permanent vacuole, mitochondria (energy transferred), ribosomes (protein synthesis)
- Screen 5: interactive animal cell explorer — 5 hotspots: nucleus (eukaryotic note), cytoplasm, cell membrane, mitochondria (energy transferred), ribosomes (protein synthesis)

**Components:** `InteractiveHotspotImage` × 2

**Build note:** The canonical architecture proposed a third hotspot for bacterial cells. In the build, bacterial cell structure is taught via theoryCompare in Part 3 instead. A bacterial cell hotspot remains desirable for a future iteration.

---

### Part 3 — Discover the science

**Screens:** 6 (animal vs plant comparison), 7 (eukaryotic vs prokaryotic comparison)

- Screen 6: theoryCompare — animal cell vs plant cell; shared structures; plant extras (cell wall, chloroplasts, permanent vacuole); takeaway that structures depend on the cell's job
- Screen 7: theoryCompare — eukaryotic (plant and animal) vs prokaryotic (bacterial); nucleus present vs absent; DNA loop; plasmids; size difference; EU/PRO mnemonic takeaway

**Components:** `TheoryCompareBlock` × 2

---

### Part 4 — Check precision

**Screen:** 8 (misconception check — 4 statements)

1. All plant cells contain chloroplasts. → false
2. Both animal and plant cells contain mitochondria. → true
3. All cells are roughly the same size. → false
4. Bacterial cells have DNA inside a nucleus. → false

**Component:** `MisconceptionCheck`

---

### Part 5 — Apply to a real GCSE-style task

**Screens:** 9 (matching task), 10 (fill in blanks), 11 (spot the error)

- Screen 9: `matchingTask` — 10 pairs: nucleus, cell membrane, cytoplasm, mitochondria, ribosome, cell wall, chloroplast, permanent vacuole, single DNA loop, plasmids
- Screen 10: `fillblanks` — 6 sentences: cell membrane / mitochondria / cell wall / chlorophyll / cell sap / prokaryotic
- Screen 11: `spotTheError` — statement: "Bacterial cells have a nucleus that contains their DNA." Error target: "have a nucleus that contains their DNA." Correct version: no nucleus; single DNA loop in the cytoplasm; may contain plasmids

**Components:** `MatchingTask`, `FillInTheBlanksBlock`, `SpotTheError`

---

### Part 6 — Face the examiner + debrief

**Screens:** 12 (guided exam response), 13 (face the examiner), 14 (quick recall)

- Screen 12: `guidedExamResponse` — "Explain two differences between plant cells and animal cells. (4 marks)" with scaffold (Difference 1 starter / Difference 2 starter)
- Screen 13: `faceExaminer` — annotated weak answer (two structures named without explanation); two improvement prompts; mark awarded 2/4
- Screen 14: `quickRecall` — 6 questions: cell membrane function / root hair cell chloroplasts / mitochondria function / plant cell extras / muscle cell mitochondria / prokaryotic cells

**Components:** `GuidedExamResponse`, `FaceTheExaminer`, `QuickRecallScreen`

---

## 3. Active learning interactions

- `InteractiveHotspotImage` × 2: plant cell (8 hotspots) and animal cell (5 hotspots)
- `TheoryCompareBlock` × 2: animal vs plant; eukaryotic vs prokaryotic
- `MisconceptionCheck`: 4 statements including the bacterial nucleus trap
- `MatchingTask`: 10 structure-to-function pairs including prokaryotic structures
- `FillInTheBlanksBlock`: 6 precise vocabulary sentences
- `SpotTheError`: bacterial nucleus misconception
- `GuidedExamResponse`: 4-mark structured write
- `FaceTheExaminer`: annotated student answer with improvement prompts
- `QuickRecallScreen`: 6 retrieval questions

---

## 4. Retrieval points

- Five shared structures in animal and plant cells: nucleus, cytoplasm, cell membrane, mitochondria, ribosomes
- Three extra structures in plant cells: cell wall, chloroplasts, permanent vacuole
- AQA-precise function of each organelle
- Eukaryotic vs prokaryotic: nucleus present vs absent
- Bacterial cell structures: DNA loop, plasmids, cell wall, cell membrane, cytoplasm, ribosomes
- Chloroplasts found only in cells exposed to light (not all plant cells)
- Mitochondria = site of aerobic respiration, energy transferred (not made)
- Ribosomes = site of protein synthesis

---

## 5. Exam skill focus

- 2-mark describe: name and give the function of a named organelle
- 4-mark explain: explain two differences between plant and animal cells (name + function + absent in animal cells)
- 2-mark compare: state one difference between eukaryotic and prokaryotic cells
- Item-style classification: is this cell eukaryotic or prokaryotic? Give one reason.

---

## 6. Build notes

Opening contrast (leaf / blood / skin / bark) resolves effectively to the single answer "cells". The prediction carousel's wrong options (blood, organs, chlorophyll) reveal alternative conceptions rather than punishing errors. The EU/PRO mnemonic in the Part 3 theoryCompare takeaway is the strongest single learning anchor for the eukaryotic/prokaryotic distinction. For a future iteration: add a bacterial cell hotspot screen to give direct hands-on exploration of prokaryotic structure, matching the treatment given to animal and plant cells.

Biology subject palette: `#4FA36C` / `rgba(79,163,108,.15)`.

---

## 7. Chapter completion test

- [ ] Student can name and give the function of all five structures shared by animal and plant cells
- [ ] Student can name and give the function of all three extra structures in plant cells
- [ ] Student knows chloroplasts are only in cells exposed to light (not all plant cells)
- [ ] Student can distinguish eukaryotic from prokaryotic cells using the nucleus criterion
- [ ] Student can name at least three structures in a bacterial cell
- [ ] Student knows bacterial DNA is a single circular loop in the cytoplasm, not in a nucleus
- [ ] Student can write a 4-mark answer explaining two differences between plant and animal cells (name + function + absence)
- [ ] Student can avoid the "all plant cells have chloroplasts" and "bacteria have a nucleus" exam traps
- [ ] Student has practised at least one AQA exam question format with mark scheme feedback

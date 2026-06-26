# Chapter 4: Built for one job — Architecture

## 1. Identity (brief)

- **Chapter number:** 4
- **Title:** Built for one job
- **Subject:** AQA GCSE Combined Science Trilogy — Biology
- **Module:** Module 1 — The living machine
- **Build status:** Not yet built

Content, Core argument, Specification requirements and the full Content reference pack: see `04_Built_for_one_job_Content.md` in this directory.

---

## 2. Architecture checklist (tailored)

### PART 1 — Situation + prediction

**Purpose:** Frame specialisation as purposeful modification of the Ch 1 blueprint.

**Proposed content:**
- Hook: "A sperm cell has to swim through fluid for 15 cm — the equivalent of a human swimming 10 km — to fertilise an egg. A root hair cell stays underground its whole life, never seeing light. A xylem cell is so specialised it is dead. How does the same basic design become all of these?"
- Prediction: "Which of these cells do you think contains the most mitochondria — a cheek cell, a sperm cell, or a root hair cell? Why?"
- You will learn: (1) how six types of specialised cell are adapted to their functions; (2) how to explain any adaptation using structure → function reasoning; (3) the exam traps around root hair cells, xylem and sperm

**Suggested components:**
- `CinematicRevealMoment` — electron micrograph of a sperm cell as the hook image (dramatic, recognisable)
- `ChapterHookScreen` — mitochondria prediction (cheek / sperm / root hair)

---

### PART 2 — Investigate the evidence

**Purpose:** Explore the six cell types before formal teaching — notice adaptations before naming them.

**Proposed content:**
- Six illustrated cell diagrams (sperm, nerve, muscle, root hair, xylem, phloem) — tappable hotspots
- Each hotspot reveals: feature name → the job it does
- No function-to-structure reasoning yet — just notice the structure first

**Suggested components:**
- `CinematicCarousel` — cycle through all 6 specialised cells with large image + key facts panel; acts as the "meet the cells" moment before deeper exploration
- `InteractiveHotspotImage` — selected cells (sperm, root hair cell, xylem) as the highest-priority hotspot diagrams; these are the most frequently examined

---

### PART 3 — Discover the science

**Purpose:** Teach structure → function reasoning systematically for each cell.

**Proposed content:**
- For each cell: structure → "This is because…" → function → exam phrase
- Emphasis on:
  - Root hair cell: no chloroplasts (underground, no light) — the single most examinable fact in this chapter
  - Xylem: dead at maturity; lignified walls (both must be explained)
  - Sperm: tail + mitochondria + acrosome (three adaptations; three functions)
- Comparison: xylem vs phloem (transport direction; living vs dead; sieve plates)

**Suggested components:**
- `ExplainReveal` × 3 — one for sperm (tail → mitochondria → acrosome chain), one for root hair (surface area → no chloroplasts → mitochondria for active transport), one for xylem (dead → hollow → lignified → no end walls)
- `TheoryCompareBlock` — xylem vs phloem (direction; living/dead; key adaptation)
- `KeyFigureReveal` — optional: could be used for "the most extreme cell" reveal — xylem, as the only cell that must die to function

---

### PART 4 — Check precision

**Purpose:** Target the three highest-risk misconceptions.

**Proposed content:**
- Misconception 1: "Xylem cells pump water up using energy" → FALSE (passive; transpiration pull; they're dead)
- Misconception 2: "Root hair cells have chloroplasts for energy to absorb minerals" → FALSE (mitochondria, not chloroplasts; underground so no light)
- Misconception 3: "All nerve cells are very long" → FALSE (only some neurones, e.g. motor neurones to leg muscles, are very long; some neurones are very short)
- Matching task: 6 cells → their key structural adaptation
- SpotTheError: root hair cell description with chloroplasts planted as error

**Suggested components:**
- `MisconceptionCheck` × 3 — one per misconception listed above
- `MatchingTask` — match 6 cells to their defining adaptation (e.g. root hair cell → long extension for increased surface area)
- `SpotTheError` — root hair cell / chloroplast error

---

### PART 5 — Apply to a real GCSE-style task

**Purpose:** Exam-style application questions for each cell type.

**Proposed content:**
- Q1: "Give two ways a sperm cell is adapted for fertilisation. For each, explain how the adaptation helps." (4 marks)
- Q2: "Explain why root hair cells do not contain chloroplasts." (2 marks)
- Q3: "Describe one structural adaptation of a xylem cell and explain how it helps transport water." (2 marks)
- Q4: "Suggest why xylem cells need companion cells." (correction: xylem does NOT need companion cells — phloem does; this is a common confusion, could be used as a spotTheError or MisconceptionCheck)
- Item-style: "A student says: 'Xylem cells are better at transporting water than phloem cells because they are alive and can actively pump it.' Evaluate this statement." (3 marks — two errors to identify)

**Suggested components:**
- `GuidedExamResponse` — Q1 (sperm cell; scaffold: Adaptation 1: ___ / this helps because ___ / Adaptation 2: ___ / this helps because ___)
- `ExamQuestionFrame` — Q2 (root hair cells, chloroplasts) and the evaluate statement
- `ColSortBlock` — sort 8 features into: sperm cell / nerve cell / root hair cell / xylem

---

### PART 6 — Face the examiner + debrief

**Purpose:** Examiner commentary; seal with retrieval.

**Proposed content:**
- Return to opening: "Can you now explain why the sperm cell has so many mitochondria?"
- Examiner contrast: weak ("It has lots of mitochondria for energy") vs strong ("It has many mitochondria so that aerobic respiration can release enough ATP energy to power the flagellum for sustained swimming")
- Mark commentary: "Saying 'for energy' gets 1 mark. To get the second, you need: what produces the energy (aerobic respiration / mitochondria) AND what uses it (the tail / flagellum movement)."
- Retrieval questions (5):
  1. Name one structural adaptation of a root hair cell.
  2. Why do xylem cells not contain cytoplasm at maturity?
  3. What is the function of the acrosome in a sperm cell?
  4. Name the structure in phloem cells that allows sap to flow between cells.
  5. Why does a nerve cell need a long axon?
- Interleave from Ch 1: "Which organelle in the muscle cell releases energy for contraction?" (mitochondria — direct link to Ch 1 organelle functions)

**Suggested components:**
- `FaceTheExaminer` — weak vs strong response to sperm cell adaptation question
- `ExaminerExplainsScreen` — "The examiner needs the CAUSE (mitochondria/respiration) AND the EFFECT (powers tail movement). 'For energy' is too vague."
- `QuickRecallScreen` — 5 retrieval questions
- `ChapterCompleteScreen`

---

### Module Completion Test

- [ ] Students can name and explain at least two adaptations of a sperm cell
- [ ] Students can explain why root hair cells have no chloroplasts (underground; no light; photosynthesis impossible)
- [ ] Students can explain the large surface area of root hair cells and why it aids absorption
- [ ] Students can describe two adaptations of xylem cells (dead; lignified walls) and explain each
- [ ] Students can explain the role of sieve plates and companion cells in phloem
- [ ] Students can describe the adaptations of a nerve cell (axon length; myelin sheath; dendrites)
- [ ] Students can complete a structure → function reasoning chain for any of the six cells
- [ ] Students can distinguish xylem (passive; dead; upward) from phloem (active loading; living; bidirectional)
- [ ] Students have practised at least one AQA-style adaptation question with a full-mark response
- [ ] Students can avoid the three key misconceptions (xylem pumps water; root hair has chloroplasts; all neurones are very long)

---

## 3. Current state & gap analysis

Not yet built — full build from spec.

---

## 4. Build recommendations

1. **Core argument integration:** The "same blueprint, different modifications" theme should be surfaced in Part 1 (prediction — the three cells), made explicit in Part 3 (each ExplainReveal should open with "Start with the basic cell from Chapter 1…"), and sealed in Part 6 (return to the hook image of the sperm cell).

2. **Root hair cell no-chloroplast:** This single fact is the most reliably examined point in this chapter and appears across multiple AQA past papers. It should appear in Part 1 (prediction question about which cells have chloroplasts), Part 3 (ExplainReveal), Part 4 (MisconceptionCheck), Part 5 (exam question), and Part 6 (retrieval). It must be the most-drilled fact in this chapter.

3. **Xylem/phloem TheoryCompareBlock:** The xylem vs phloem comparison is frequently set as a 3–4 mark comparison question. The TheoryCompareBlock should cover: living vs dead; direction of transport; key adaptation; energy requirement.

4. **CinematicCarousel for six cells:** Six cells is a lot for one chapter. The carousel in Part 2 lets students scan all six before formal teaching, reducing cognitive load in Part 3. The carousel should be visually dramatic — electron micrographs where available.

5. **SpotTheError priority:** The root hair cell / chloroplast error is perfect for SpotTheError (a plausible-sounding but incorrect student description). The xylem cell / alive error is the second priority. Both are common exam mistakes.

6. **Interleaving to Ch 1:** Part 6 retrieval should explicitly reference organelle functions from Ch 1 (mitochondria → respiration → energy; no chloroplasts → no photosynthesis). This is the first "payoff" chapter for Module 1's opening unit.

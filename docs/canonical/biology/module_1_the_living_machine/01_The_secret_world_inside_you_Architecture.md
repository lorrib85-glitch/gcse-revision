# Chapter 1: The secret world inside you — Architecture

## 1. Identity (brief)

- **Chapter number:** 1
- **Title:** The secret world inside you
- **Subject:** AQA GCSE Combined Science Trilogy — Biology
- **Module:** Module 1 — The living machine
- **Build status:** Not yet built

Content, Core argument, Specification requirements and the full Content reference pack: see `01_The_secret_world_inside_you_Content.md` in this directory.

---

## 2. Architecture checklist (tailored)

### PART 1 — Situation + prediction

**Purpose:** Hook curiosity and activate prior knowledge before any formal teaching.

**Proposed content for this chapter:**
- Opening scenario: "You are made of 37 trillion cells. Each one is a living machine — far smaller than anything you can see with your eyes. And inside each one, hundreds of reactions are happening right now."
- Hook image: microscope view of human cheek cells (light microscope) — recognisable but mysterious
- Prediction question: "Do you think a plant cell and an animal cell look the same or different? What about a bacterial cell?"
- You will learn: (1) what structures are inside animal, plant and bacterial cells; (2) what each structure does; (3) why plant cells have parts that animal cells don't; (4) what makes bacteria fundamentally different from both

**Suggested components:**
- `CinematicRevealMoment` — full-screen microscope image opening (animal cheek cells, then zoom-in to single cell)
- `ChapterHookScreen` — prediction warm-up (same / different / not sure)

**Science blueprint rule:** Never begin with a definition. Begin with the image, then the question.

---

### PART 2 — Investigate the evidence

**Purpose:** Let the student explore before formal teaching — see the structures first, name them second.

**Proposed content for this chapter:**
- Side-by-side exploration: animal cell diagram with tappable hotspots (nucleus, membrane, cytoplasm, mitochondria, ribosomes)
- Plant cell diagram with tappable hotspots (all animal structures + cell wall, chloroplasts, vacuole)
- Bacterial cell diagram with tappable hotspots (cell wall, membrane, cytoplasm, ribosomes, circular DNA, plasmid, optional flagellum)
- Each hotspot reveals: structure name → one-line function → one exam phrase

**Suggested components:**
- `InteractiveHotspotImage` × 3 (one per cell type) — the primary exploration mechanic; lets students tap-and-discover before the comparison table
- `VisualLearning` — could be used to sequence the three cell type reveals cinematically before hotspot mode

---

### PART 3 — Discover the science

**Purpose:** Formal teaching of the core concept after evidence exploration.

**Proposed content for this chapter:**
- Eukaryotic vs prokaryotic distinction: the defining feature (membrane-bound nucleus)
- Comparison of the three cell types — what is shared; what is unique to plant cells; what is unique (or absent) in bacteria
- Why plant cells have chloroplasts (photosynthesis) but root cells don't (no light)
- Precise GCSE vocabulary for each organelle function
- Endosymbiotic theory as enrichment (optional — mitochondria/chloroplasts originated from bacteria) — NOT examinable at GCSE, label as "fascinating but not in your exam"
- Size comparison: bacteria 1–10 µm; animal/plant cells 10–100 µm

**Suggested components:**
- `TheoryCompareBlock` — animal cell vs plant cell (2-column); then eukaryotic vs prokaryotic (2-column)
- `ConceptReveal` — the eukaryote/prokaryote distinction is a key conceptual step; cinematic reveal of "the nucleus changes everything"
- `CardContainer` — one card per organelle with function; students swipe through

---

### PART 4 — Check precision

**Purpose:** Catch the three most damaging misconceptions before they embed.

**Proposed content for this chapter:**
- Misconception 1: "All plant cells contain chloroplasts" → FALSE — only photosynthetic cells
- Misconception 2: "Mitochondria make energy" → FALSE — they release energy via aerobic respiration
- Misconception 3: "Bacterial cells have no cell wall" → FALSE — they have one, just not made of cellulose
- Matching task: structure → precise GCSE function phrase (nucleus → "controls the activities of the cell")
- SpotTheError: "Bacterial cells are different from animal cells because they have no nucleus, no cell wall, and smaller ribosomes." (error: bacteria DO have a cell wall)

**Suggested components:**
- `MisconceptionCheck` × 3 — one per misconception listed above; cinematic full-screen delivery
- `MatchingTask` — 5 organelles matched to precise function phrases; include distractors
- `SpotTheError` — bacterial cell description with planted error

---

### PART 5 — Apply to a real GCSE-style task

**Purpose:** Move from understanding to exam performance.

**Proposed content for this chapter:**
- AQA-style question: "Compare the structure of an animal cell and a plant cell. Give three differences." (3 marks)
- AQA-style question: "Explain why a root hair cell does not contain chloroplasts." (2 marks)
- Identify structure from unlabelled diagram — pick the cell type (animal / plant / bacterial) and label two structures
- Comparison table completion: fill in ✓/✗ for each structure across the three cell types

**Suggested components:**
- `GuidedExamResponse` — the 3-mark compare question with scaffold (Difference 1: plant cells have ___; animal cells do not have ___; its function is ___)
- `FillInTheBlanksBlock` — the comparison table with blanks
- `ExamQuestionFrame` — 2-mark question on root hair cells / chloroplasts

---

### PART 6 — Face the examiner + debrief

**Purpose:** Show how marks are won and lost; seal the chapter with retrieval.

**Proposed content for this chapter:**
- Return to opening: "Can you now explain why the cell in that microscope image looks different from a bacterium?"
- Examiner contrast: weak answer ("Plant cells are bigger and green") vs strong answer ("Plant cells contain chloroplasts for photosynthesis and a cell wall made of cellulose for support; animal cells have neither")
- Mark commentary: "This gets 1 mark for chloroplasts. To get the second mark you need to state its function — photosynthesis. The cell wall alone is not enough; you must say it's made of cellulose."
- Retrieval questions (5):
  1. Name two structures found in plant cells but not animal cells.
  2. What is the function of the mitochondria?
  3. What is the key difference between a eukaryotic cell and a prokaryotic cell?
  4. Give the function of ribosomes.
  5. What is a plasmid?
- Interleaved question (from later chapters, plant here for Ch 2 hook): "How would you use a microscope to see these cells?" → sets up Ch 2

**Suggested components:**
- `FaceTheExaminer` — weak vs strong answer with mark commentary
- `ExaminerExplainsScreen` — "The examiner needs the function, not just the structure name"
- `QuickRecallScreen` — 5 retrieval questions (mix of recall and short apply)
- `ChapterCompleteScreen` — chapter close

---

### Module Completion Test

- [ ] Students can name and give the function of each organelle in animal cells
- [ ] Students can name and give the function of each organelle in plant cells (including the three structures not in animal cells)
- [ ] Students can name and give the function of each structure in a bacterial cell
- [ ] Students can state the defining difference between eukaryotic and prokaryotic cells
- [ ] Students can explain why plant root cells do not contain chloroplasts
- [ ] Students can use precise GCSE vocabulary for organelle functions (not "makes energy", not "holds DNA")
- [ ] Students can complete a comparison table across all three cell types
- [ ] Students can avoid the three key misconceptions (all plant cells have chloroplasts; mitochondria make energy; bacteria have no cell wall)
- [ ] Students have practised at least one AQA exam-style question
- [ ] Students can answer an examiner-style compare question with correct function reasoning

---

## 3. Current state & gap analysis

Not yet built — full build from spec.

---

## 4. Build recommendations

1. **Core argument integration:** The central claim (eukaryotes vs prokaryotes; plant cells as a "double system") should be surfaced in Part 1 (the prediction), reinforced in Part 3 (the concept reveal), and explicitly revisited in Part 6 (return to opening). The three shared structures (membrane, cytoplasm, ribosomes) should be the recurring thread — they appear in Part 2 (all three hotspot diagrams), Part 3 (comparison block), and Part 5 (fill-in-the-blanks).

2. **InteractiveHotspotImage priority:** Three separate hotspot diagrams (animal / plant / bacterial) are the pedagogical centrepiece of this chapter. Each hotspot should give: name → function → one exam-precise phrase. Source diagram images needed: high-contrast diagrams of each cell type on a dark background. Flag for visual asset planning.

3. **MisconceptionCheck targeting:** The "all plant cells have chloroplasts" trap is the single most common GCSE error in this chapter and directly feeds Chapter 4 (specialised cells). It must appear in Part 4 and be referenced in Part 6's examiner commentary.

4. **FaceTheExaminer anchor:** Focus on the plant/animal compare question (2–4 marks) — this is the most frequently examined format for this topic. Show the difference between naming a structure and explaining its function.

5. **Interleaving forward:** The Part 6 retrieval should include one question that primes Chapter 2 (microscopy): "What instrument would a scientist use to see these cells?" This seeds the transition without teaching Ch 2 content prematurely.

6. **Series throughline:** This chapter establishes the cellular unit — all of Module 1 (and Module 2's organisation hierarchy) depends on it. Build notes should reference this: "Without this chapter, Chapters 4–9 have no foundation."

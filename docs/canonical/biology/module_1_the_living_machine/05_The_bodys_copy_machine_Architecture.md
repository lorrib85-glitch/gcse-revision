# Chapter 5: The body's copy machine — Architecture

## 1. Identity (brief)

- **Chapter number:** 5
- **Title:** The body's copy machine
- **Subject:** AQA GCSE Combined Science Trilogy — Biology
- **Module:** Module 1 — The living machine
- **Build status:** Not yet built

Content, Core argument, Specification requirements and the full Content reference pack: see `05_The_bodys_copy_machine_Content.md` in this directory.

---

## 2. Architecture checklist (tailored)

### PART 1 — Situation + prediction

**Purpose:** Hook with the scale of cell replacement; activate prior knowledge of chromosomes.

**Proposed content:**
- Hook: "Your body is replacing 3.8 million red blood cells every second. Your gut lining replaces itself completely every few days. Every time a cell is replaced, a perfect copy is made — with exactly the right amount of DNA. How?"
- Prediction: "How many chromosomes do you think a human skin cell has?" (46 — sets up the diploid concept)
- You will learn: (1) what chromosomes are and what they carry; (2) how the cell cycle works; (3) what happens during mitosis; (4) how cancer is connected to this process

**Suggested components:**
- `CinematicRevealMoment` — microscope image of cells in various stages of division (mitotic figures visible)
- `ChapterHookScreen` — chromosomes prediction (23 / 46 / 92 / don't know)

---

### PART 2 — Investigate the evidence

**Purpose:** Explore what chromosomes look like and what the cell cycle looks like before formal teaching.

**Proposed content:**
- Chromosomes close-up: karyotype image (arranged human chromosomes) — 23 pairs, 46 total
- Cell cycle diagram: circular with interphase (large), mitosis (smaller section), cytokinesis (brief)
- Time proportions: interphase takes ~90% of the cell cycle; mitosis is brief

**Suggested components:**
- `VisualLearning` — karyotype reveal: "This is every chromosome in a single human cell, arranged by size. Count them." Then reveal: 46.
- `CardContainer` — cell cycle diagram; three sections labelled (interphase → mitosis → cytokinesis) with brief descriptions; student can tap each to see what happens

---

### PART 3 — Discover the science

**Purpose:** Formal teaching of the cell cycle and mitosis sequence.

**Proposed content:**
- What chromosomes are: DNA + protein; genes as sections of DNA that code for proteins
- Human diploid number: 46 (23 pairs)
- Cell cycle: interphase (growth, DNA replication, more growth) → mitosis → cytokinesis
- Mitosis sequence: chromosomes condense → line up at equator → chromatids pulled to poles → nuclear envelopes reform → cytoplasm divides
- Outcomes: 2 genetically identical daughter cells with 46 chromosomes each
- Cancer link: cell cycle control breaks down → uncontrolled mitosis → tumour

**Suggested components:**
- `ExplainReveal` — cell cycle chain: cell grows (G1) → DNA replicated (S phase) → grows again (G2) → chromosomes visible → equator alignment → poles → 2 nuclei → 2 cells
- `ConceptReveal` — "46 chromosomes" concept with the karyotype image; then "why does each daughter get 46?"
- `TimelineChain` — the four stages of mitosis in order: prophase → metaphase → anaphase → telophase, each as a flip card with diagram + key event

---

### PART 4 — Check precision

**Purpose:** Target the mitosis/meiosis confusion and the DNA-copy timing error.

**Proposed content:**
- Misconception 1: "Mitosis produces 4 cells" → FALSE (2 cells; 4 is meiosis)
- Misconception 2: "DNA is copied during mitosis" → FALSE (copied during interphase/S phase)
- Misconception 3: "Daughter cells from mitosis are genetically different" → FALSE (identical)
- SpotTheError: "During mitosis, DNA is copied as the chromosomes line up at the equator." (error: DNA replication is during interphase, not mitosis)
- MatchingTask: stage → key event (interphase → DNA replication; metaphase → chromosomes at equator; anaphase → chromatids pulled to poles)

**Suggested components:**
- `MisconceptionCheck` × 3 — mitosis produces 4 cells; DNA copied during mitosis; genetically different daughters
- `SpotTheError` — DNA replication timing error
- `MatchingTask` — cell cycle stages → events

---

### PART 5 — Apply to a real GCSE-style task

**Purpose:** Exam practice for description and explanation questions.

**Proposed content:**
- Q1: "Describe what happens during mitosis. Include in your answer: what happens to the chromosomes and what the daughter cells are like." (4 marks)
- Q2: "Explain why cells produced by mitosis are genetically identical to the parent cell." (2 marks)
- Q3: "State the number of chromosomes in a human body cell and in a human sperm cell." (2 marks — 46 and 23)
- Q4: "Cancer occurs when cells divide uncontrollably. Explain how this is related to the cell cycle." (2 marks)

**Suggested components:**
- `GuidedExamResponse` — Q1 (describe mitosis; scaffold: chromosomes do ___ → they line up at ___ → chromatids move to ___ → result is ___)
- `ExamQuestionFrame` — Q2 (why identical; requires "DNA replicated in interphase" + "same chromosomes to each daughter")
- `FillInTheBlanksBlock` — Q3 and the cancer link

---

### PART 6 — Face the examiner + debrief

**Purpose:** Seal the chapter with examiner commentary and retrieval.

**Proposed content:**
- Return to opening: "Can you now explain how 3.8 million red blood cells are replaced every second without any genetic errors?"
- Examiner contrast: weak ("The cell divides in half and both cells have DNA") vs strong ("During interphase, the cell's DNA is replicated so that each chromosome is duplicated. During mitosis, the chromosomes line up at the equator and the chromatids are pulled to opposite poles. Two new nuclear envelopes form and the cell divides, producing two genetically identical daughter cells, each with 46 chromosomes.")
- Mark commentary: "Saying 'cell divides' gets 0. The examiner needs: DNA replication mentioned, chromosomes/chromatids, equator, poles, two identical daughter cells."
- Retrieval questions (5):
  1. How many chromosomes does a human body cell have?
  2. During which phase of the cell cycle is DNA replicated?
  3. Describe two things that happen during mitosis.
  4. What is the name for uncontrolled cell division?
  5. Give two reasons why the body needs mitosis.
- Interleave from Ch 4: "A nerve cell rarely divides by mitosis. Suggest why this might be a problem if a nerve cell is damaged." (links Ch 5 to Ch 4's nerve cell and sets up Ch 27)

**Suggested components:**
- `FaceTheExaminer` — weak vs strong mitosis description
- `ExaminerExplainsScreen` — "The examiner needs three things: DNA replication (interphase), chromosome movement (equator → poles), and identical daughter cells. All three for full marks."
- `QuickRecallScreen` — 5 retrieval questions
- `ChapterCompleteScreen`

---

### Module Completion Test

- [ ] Students know that chromosomes are made of DNA and are found in the nucleus
- [ ] Students can state the human diploid chromosome number (46)
- [ ] Students can describe the three stages of the cell cycle (interphase, mitosis, cytokinesis)
- [ ] Students know that DNA replication occurs during interphase (S phase)
- [ ] Students can describe what happens during mitosis in the correct sequence (condense → equator → poles → nuclear envelopes → cytoplasm divides)
- [ ] Students can state that mitosis produces 2 genetically identical daughter cells
- [ ] Students can explain why mitosis is needed (growth, repair, replacement, asexual reproduction)
- [ ] Students can explain the link between uncontrolled mitosis and cancer
- [ ] Students can distinguish mitosis (2 identical cells, 46 chromosomes) from meiosis (4 genetically varied cells, 23 chromosomes)
- [ ] Students have practised writing a full description of mitosis in correct exam language

---

## 3. Current state & gap analysis

Not yet built — full build from spec.

---

## 4. Build recommendations

1. **Core argument integration:** The "precise copy machine" metaphor should thread from Part 1 (hook = scale of replacement) through Part 3 (how the machine works — cell cycle) to Part 6 (return question: "how does it happen without errors?"). The cancer link is the "what happens when the machine breaks" thread — introduced in Part 3, returned to in Part 5.

2. **TimelineChain for mitosis stages:** The four stages of mitosis (prophase → metaphase → anaphase → telophase) are ideally suited to the TimelineChain component — flip cards connecting in sequence, each with a diagram of the cell at that stage. This should be the centrepiece of Part 3.

3. **MisconceptionCheck priority — mitosis vs meiosis:** This is the most damaging error in this chapter; it cascades into Chapter 32 (meiosis). The MisconceptionCheck in Part 4 should be very clear: "Mitosis produces 4 genetically different cells" → FALSE; meiosis is coming in Module 4.

4. **GuidedExamResponse scaffold for "describe mitosis":** This is a 4-mark question that students consistently lose marks on by being too vague. The scaffold should model the four-beat structure: (1) chromosomes condense; (2) line up at equator; (3) chromatids pulled to poles; (4) two genetically identical daughter cells form. Each beat = 1 mark.

5. **Interleaving forward:** Part 6 retrieval should plant a question that seeds Chapter 6: "What would happen if a cell divided but then the daughter cell could not specialise?" — this sets up stem cells.

6. **Visual asset needed:** Diagrams of mitosis stages (preferably circular/cell-shape diagram showing chromosomes at each stage, matching the textbook convention). Also: a karyotype image showing 46 chromosomes in 23 pairs.

# Chapter 10: Cell biology boss level — Architecture

## 1. Identity (brief)

- **Chapter number:** 10
- **Title:** Cell biology boss level
- **Subject:** AQA GCSE Combined Science Trilogy — Biology
- **Module:** Module 1 — The living machine
- **Build status:** Not yet built

Content, Core argument, Specification requirements and the full Content reference pack: see `10_Cell_biology_boss_level_Content.md` in this directory.

---

## 2. Architecture checklist (tailored)

This is an exam practice consolidation chapter. It follows a modified version of the 6-part structure — the teaching parts (2 and 3) are replaced with rapid retrieval and exam technique, since no new content is introduced.

### PART 1 — Situation + prediction

**Purpose:** Frame the boss level as a meaningful challenge, not a repeat; activate the full module in working memory.

**Proposed content:**
- Hook: "Nine chapters. Three types of cell. Two required practicals. Three transport mechanisms. One magnification formula. One exam in approximately 40 weeks. Let's find out what's stuck and what hasn't — and fix the gaps before they cost marks."
- Rapid recall diagnostic: "Without looking back, answer these five questions." (1: name two plant cell structures not in animal cells; 2: define diffusion; 3: what is the human diploid chromosome number?; 4: what is the isotonic point?; 5: define active transport)
- Students rate confidence on each: know it / not sure / blank
- Outcomes feed the weakspot logic — low-confidence answers prioritise content

**Suggested components:**
- `CinematicRevealMoment` — montage of module images (cell, microscope, potato cylinders, particles, mitosis) as the recap reveal
- `PriorKnowledgeRecall` — 5-question diagnostic recall (the five rapid recall questions above); free-text answers scored by keyword matching

---

### PART 2 — Rapid topic-by-topic sweep

**Purpose:** Structured revision sweep across all 9 topics before exam practice.

**Proposed content:**
- Nine mini-cards, one per chapter: each shows the key exam fact, the most common mistake, and the AQA phrase that scores marks
- Student can mark each card as "Got it" or "Need to revisit"
- "Need to revisit" items are routed to a focused recovery sequence

**Suggested components:**
- `QuickRecallScreen` — 9-question rapid sweep (one question per chapter topic); time pressure creates retrieval practice not reading
- `RecoveryQuizPlayer` — for any topic flagged as weak in the diagnostic; focused 3-question mini-quiz per weak topic

---

### PART 3 — Exam question types: all formats

**Purpose:** Practice every AQA question format that appears in B1 Cell biology — in the same order as they typically appear on a paper.

**Format 1 — Short definitions (1–2 marks each):**
- Define diffusion / osmosis / active transport
- State the human diploid chromosome number
- Give two organelle functions

**Format 2 — Calculations (2–3 marks each):**
- Magnification calculation (image 45 mm, actual 0.05 mm → M = 900)
- Percentage change in mass (initial 5.0 g, final 4.3 g → −14%)
- SA:V ratio (3 cm cube → 54/27 = 2:1)

**Format 3 — Adaptations (2–4 marks):**
- Two sperm cell adaptations with explanations
- Why root hair cells have no chloroplasts
- One xylem adaptation with explanation

**Format 4 — Practical method (3–6 marks):**
- Describe how to prepare a plant cell slide
- Describe the osmosis practical method with control variables
- Identify and explain an anomalous result

**Format 5 — Compare/contrast (3–6 marks):**
- Diffusion vs active transport (direction, energy, example)
- Embryonic stem cells vs adult stem cells
- Xylem vs phloem

**Format 6 — Extended response (4–6 marks):**
- Discuss advantages and disadvantages of embryonic stem cells
- Explain how the alveoli are adapted for gas exchange
- Describe what happens during mitosis

**Suggested components:**
- `ExamQuestionFrame` × 6 — one per format listed above; questions drawn from the exam bank in the Content file
- `GuidedExamResponse` × 3 — Format 2 (magnification calculation scaffold), Format 4 (osmosis method scaffold), Format 6 (stem cells discuss scaffold)
- `FillInTheBlanksBlock` × 2 — definitions of diffusion and osmosis; the most mark-lossy definitions in Module 1

---

### PART 4 — Examiner deep dive: the 6 most costly mistakes

**Purpose:** Dedicate a full section to the six errors that cost most marks in B1 on AQA past papers.

**The six errors:**
1. "Mitochondria MAKE energy" → loses marks; correct = "release energy via aerobic respiration"
2. Omitting "passive" from diffusion/osmosis definitions → loses 1 mark
3. Getting the direction of active transport wrong (high→low instead of low→high)
4. Using final mass (not initial) as denominator in % change calculation
5. "All plant cells have chloroplasts" — false generalisation that loses marks and may actively mislead
6. Mixing units in magnification calculations (mm and µm in same division)

**Suggested components:**
- `FaceTheExaminer` × 3 — one for each of the three highest-stakes errors (mitochondria "make" energy; active transport direction; % change calculation)
- `SpotTheError` × 3 — one for each error; student identifies and repairs the mistake
- `MisconceptionCheck` × 2 — "all plant cells have chloroplasts"; "diffusion requires energy"

---

### PART 5 — Three-way transport showdown

**Purpose:** Build the Module 1 exit skill: the three-way comparison of all transport processes.

**Proposed content:**
- Complete comparison table (diffusion / osmosis / active transport × 5 features) from memory
- Five context scenarios: "Which process?" (e.g. "Glucose enters a muscle cell from blood where glucose is higher" → diffusion; "Mineral ions absorbed by root hair cells" → active transport; "Water enters a root hair cell" → osmosis)
- Write a perfect 4-mark "Compare diffusion and active transport" answer

**Suggested components:**
- `ColSortBlock` — sort 10 statements into: diffusion / osmosis / active transport
- `SwipeSort` — 8 biological scenarios: swipe right = diffusion; swipe left = active transport; hold = osmosis
- `GuidedExamResponse` — the 4-mark comparison question with scaffold: "Diffusion: direction ___; energy ___; example ___. Active transport: direction ___; energy ___; example ___."

---

### PART 6 — Face the examiner + module close

**Purpose:** Final examiner session; module completion marker; forward connection to Module 2.

**Proposed content:**
- Full past-paper style question sequence (short and extended mix; 15 marks total; typical B1 section)
- Examiner voice commentary after each question type: "Here's why that answer scores full marks / here's what's missing"
- Module scorecard: how many Chapter checkpoints passed; which topics need more work
- Forward hook: "You now know how cells are built and how they transport substances. In Module 2, you'll see what happens when you organise 37 trillion of those cells into a working human body."

**Suggested components:**
- `FaceTheExaminer` — one final "strong vs weak" contrast for the hardest question in the module (full comparison of diffusion, osmosis, active transport — 4–6 marks)
- `ExaminerExplainsScreen` — "The three-process comparison is worth up to 6 marks on a B1 paper. The examiner needs: direction, energy, and an example for EACH. Six points = 6 marks."
- `RecoveryQuizPlayer` — targeted recovery for any weak topics identified in Part 1 diagnostic
- `ChapterCompleteScreen` — with "Module 1 complete" state; transition forward to Module 2

---

### Module Completion Test

- [ ] Students can define diffusion, osmosis and active transport with all required components, from memory
- [ ] Students can complete the three-way comparison table (diffusion / osmosis / active transport) without prompting
- [ ] Students can perform magnification calculations (M = I/A) with correct unit handling
- [ ] Students can calculate percentage change in mass using the correct formula and denominator
- [ ] Students can calculate SA:V ratio for a cube and explain the trend
- [ ] Students can describe both required practicals (microscopy; osmosis) in method-question format
- [ ] Students can give structure-to-function reasoning for at least 4 of the 6 specialised cells
- [ ] Students can distinguish eukaryotic from prokaryotic cells
- [ ] Students can write a balanced 4–6 mark argument about embryonic stem cells (advantages and disadvantages)
- [ ] Students can identify and repair the 6 most common mark-loss errors in Module 1

---

## 3. Current state & gap analysis

Not yet built — full build from spec.

---

## 4. Build recommendations

1. **No new teaching content in this chapter:** Every interaction here should be retrieval, exam practice, or examiner commentary. Do not introduce new concepts or add detail beyond what Chapters 1–9 taught. The boss level is a performance chapter, not a teaching chapter.

2. **PriorKnowledgeRecall diagnostic as the routing engine:** The 5-question Part 1 diagnostic should determine which RecoveryQuizPlayer tracks are activated in Part 2 and Part 6. Students who blank on "define active transport" should be routed to a Ch 9 recovery track before reaching Part 5's three-way comparison. This requires the diagnostic results to persist through the chapter.

3. **Three-way transport showdown (Part 5) is the centrepiece:** This is the highest-value skill in the module — it appears on virtually every AQA Biology Paper 1 in some form. The ColSortBlock → SwipeSort → GuidedExamResponse sequence in Part 5 should be the longest and most challenging section of this chapter.

4. **FaceTheExaminer × 3 in Part 4:** Three focused FaceTheExaminer instances (one per critical error) is appropriate here — this is the moment where students see exactly why they lose marks. The examiner commentary should be direct and specific: "This answer loses the mark because…"

5. **ChapterCompleteScreen = Module 1 close:** This is the first of four module completion points in the 40-chapter spine. The completion screen should acknowledge the module, not just the chapter — "Module 1 complete. You now understand how cells are built, how they divide, and how substances move in and out."

6. **Forward link to Module 2:** Part 6 should explicitly name Module 2's opening question: "How do cells organise into tissues, organs and systems?" — seeds the hierarchy (Ch 11) and positions Module 1 knowledge (especially specialised cells from Ch 4) as the foundation for everything that follows.

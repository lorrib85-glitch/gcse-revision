# Chapter 6: Medicine's repair kit — Architecture

## 1. Identity (brief)

- **Chapter number:** 6
- **Title:** Medicine's repair kit
- **Subject:** AQA GCSE Combined Science Trilogy — Biology
- **Module:** Module 1 — The living machine
- **Build status:** Not yet built

Content, Core argument, Specification requirements and the full Content reference pack: see `06_Medicines_repair_kit_Content.md` in this directory.

---

## 2. Architecture checklist (tailored)

### PART 1 — Situation + prediction

**Purpose:** Hook with the medical promise of stem cells; surface prior intuitions about ethics.

**Proposed content:**
- Hook: "Imagine you could grow a replacement organ in a lab from the patient's own cells — perfect genetic match, no rejection. Stem cells make this possible. So why is there so much controversy?"
- Prediction: "Do you think scientists should be allowed to use stem cells from human embryos to develop new treatments? Yes / No / It depends" — not graded; opens ethical reasoning
- You will learn: (1) what stem cells are and why they're different from ordinary cells; (2) the differences between embryonic and adult stem cells; (3) what therapeutic cloning is; (4) plant meristems; (5) the ethical arguments for and against

**Suggested components:**
- `CinematicRevealMoment` — image of early human blastocyst embryo (microscope image); dramatic scale (150 µm — smaller than a full stop)
- `ChapterHookScreen` — ethical prediction warm-up (yes / no / depends) — note this is NOT graded; it's curiosity activation

---

### PART 2 — Investigate the evidence

**Purpose:** Introduce the key evidence before the formal science.

**Proposed content:**
- Bone marrow transplant case study: a leukaemia patient receives bone marrow stem cells from a matched donor; the stem cells replace the patient's diseased blood cell production → remission
- Embryonic stem cell potential: a diagram showing one embryonic stem cell → splits into the 200+ cell types in the human body
- Plant meristem: a root tip in culture growing into a full plant (micropropagation context)

**Suggested components:**
- `VisualNarrativeScreen` — bone marrow transplant case study (patient → treatment → outcome) as the concrete, established stem cell success story
- `VisualLearning` — three scenes: (1) blastocyst → pluripotent stem cells → many cell types; (2) adult bone marrow → blood cells; (3) root tip meristem → full plant
- `CardContainer` — three source types (embryonic / adult / meristem) each with: where found, what it can become, current use

---

### PART 3 — Discover the science

**Purpose:** Formal teaching of stem cell types, therapeutic cloning, and meristems.

**Proposed content:**
- Definition: undifferentiated, self-renewing, can differentiate
- Embryonic: pluripotent; from blastocyst; 5–6 days post-fertilisation; can become almost any cell
- Adult: multipotent; from bone marrow/skin etc.; limited range; bone marrow transplant = clinical reality
- Therapeutic cloning: step-by-step (patient nucleus → enucleated egg → embryo → stem cells → matched therapy); why it avoids rejection
- Meristems: shoot tip and root tip; totipotent in plants; micropropagation applications
- Ethics: structured balanced presentation (for and against embryonic use)

**Suggested components:**
- `TheoryCompareBlock` — embryonic stem cells vs adult stem cells (2-column; source, potency, flexibility, ethical status, current clinical use)
- `ExplainReveal` — therapeutic cloning chain: nucleus removed → enucleated egg → stimulated to divide → blastocyst → stem cells extracted → genetically matched → no rejection
- `ConceptReveal` — "undifferentiated → differentiated" concept reveal with the 200+ cell types visual
- `ColSortBlock` — arguments for and against embryonic stem cell use: students sort statements into "supports use" / "opposes use"

---

### PART 4 — Check precision

**Purpose:** Target the most common stem cell misconceptions and ethical oversimplifications.

**Proposed content:**
- Misconception 1: "Stem cells are only in embryos" → FALSE (also adult tissues; meristems in plants)
- Misconception 2: "Therapeutic cloning creates a full human clone" → FALSE (only to blastocyst stage; cells extracted; embryo not implanted)
- Misconception 3: "Embryonic stem cells are the same as adult stem cells, just from a younger source" → FALSE (pluripotent vs multipotent — embryonic are far more flexible)
- SwipeSort: evaluation statements about stem cell therapy — valid scientific concern / ethical objection / inaccurate claim

**Suggested components:**
- `MisconceptionCheck` × 3 — one per misconception listed above
- `SwipeSort` — sort 8 statements about stem cells: valid scientific concern / ethical objection / factual error

---

### PART 5 — Apply to a real GCSE-style task

**Purpose:** Practice the describe, compare, and evaluate question types for this topic.

**Proposed content:**
- Q1: "Explain what is meant by a stem cell." (2 marks)
- Q2: "Describe the process of therapeutic cloning and explain why it is used." (4 marks)
- Q3: "Discuss the advantages and disadvantages of using embryonic stem cells in medicine." (6 marks — balance question)
- Q4: "Explain why scientists use meristems to clone plants." (2 marks)

**Suggested components:**
- `GuidedExamResponse` — Q2 (therapeutic cloning, 4-mark scaffold: nucleus from patient → enucleated egg → embryo → stem cells → matched cells → no rejection)
- `FaceTheExaminer` (preview) — short version of Q3 evaluation question, showing that a one-sided answer gets few marks; full treatment in Part 6
- `ExamQuestionFrame` — Q1 and Q4

---

### PART 6 — Face the examiner + debrief

**Purpose:** Examiner commentary on the evaluate question; seal with retrieval.

**Proposed content:**
- Return to opening: "You said [yes / no / depends] at the start. Has learning the science changed your thinking? Which arguments did you find most compelling?"
- Examiner focus: the 6-mark evaluate question; weak answer = lists benefits only; strong answer = balanced, evidence-based, both sides, conclusion
- Mark commentary: "A one-sided answer on a 'Discuss' question is automatically capped. The examiner needs: at least one benefit, at least one drawback, at least one named condition, and a conclusion — even a brief one."
- Retrieval questions (5):
  1. What is a stem cell?
  2. Name one difference between an embryonic and an adult stem cell.
  3. Describe one step in therapeutic cloning.
  4. Where in a plant are meristems found?
  5. Give one ethical argument against using embryonic stem cells in medicine.
- Interleave from Ch 5: "Why must stem cells be able to carry out mitosis?" (to self-renew and produce daughter cells for differentiation)

**Suggested components:**
- `FaceTheExaminer` — weak vs strong response to the "Discuss advantages and disadvantages of embryonic stem cells" question (6 marks)
- `ExaminerExplainsScreen` — "A 'Discuss' question requires BOTH sides. One paragraph of benefits without evaluation is worth half marks at most."
- `QuickRecallScreen` — 5 retrieval questions
- `ChapterCompleteScreen`

---

### Module Completion Test

- [ ] Students can define a stem cell (undifferentiated; can self-renew; can differentiate)
- [ ] Students can describe where embryonic stem cells come from (blastocyst / early embryo)
- [ ] Students can state that embryonic stem cells are pluripotent (can become almost any cell type)
- [ ] Students can state that adult stem cells are multipotent (limited range of cell types)
- [ ] Students can give a clinical example of adult stem cell use (bone marrow transplant for leukaemia)
- [ ] Students can describe the process of therapeutic cloning (4-step sequence)
- [ ] Students can explain the advantage of therapeutic cloning (genetic match; no rejection)
- [ ] Students can explain where meristems are found in plants and why they are used in cloning
- [ ] Students can construct a balanced argument for and against embryonic stem cell use in medicine
- [ ] Students can write a 'discuss' answer that includes both sides and a conclusion

---

## 3. Current state & gap analysis

Not yet built — full build from spec.

---

## 4. Build recommendations

1. **Core argument integration:** The "blank slate with tradeoffs" theme should run from Part 1 (what is possible?) through Part 3 (the three sources with their tradeoffs) to Part 6 (the student revisits their Part 1 prediction with new knowledge). The Part 1 ethics prediction and Part 6 reflection is a deliberate bookend — one of the few times in GCSE Biology where a personal position is academically appropriate.

2. **ColSortBlock for ethics:** The AQA 6-mark "Discuss" question on stem cells requires a balanced argument. The ColSortBlock in Part 3 (sort arguments for/against) directly trains this skill — students who can sort arguments can write paragraphs about them. This should precede the GuidedExamResponse in Part 5.

3. **TheoryCompareBlock embryonic vs adult:** This comparison appears on virtually every AQA paper that covers stem cells. Two-column format: source | potency | flexibility | ethical status | clinical use. Students should be able to complete this table from memory.

4. **FaceTheExaminer on the discuss question:** The 6-mark evaluate question is the highest-stakes item in this chapter. The FaceTheExaminer should show: (1) a one-sided answer (benefits only → 3/6); (2) a balanced answer (benefits + risks + conclusion → 6/6); (3) explicit commentary on what the examiner awards marks for.

5. **Interleaving to Ch 5:** Part 6 retrieval links stem cells to mitosis (self-renewal = mitosis). This should be explicit: "A stem cell divides by [mitosis/meiosis]?" — returning to Ch 5's core content.

6. **Forward link to Ch 34 (embryo screening):** In Part 3 or Part 6 ethics section, note: "The same ethical questions — does an embryo have moral status? — will return in Chapter 34 when we study embryo screening." This seeds Module 4 without teaching it.

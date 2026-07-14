# Chapter 8: The potato water test — Architecture

## 1. Identity (brief)

- **Chapter number:** 8
- **Title:** The potato water test
- **Subject:** AQA GCSE Combined Science Trilogy — Biology
- **Module:** Module 1 — The living machine
- **Build status:** Not yet built

Content, Core argument, Specification requirements and the full Content reference pack: see `08_The_potato_water_test_Content.md` in this directory.

---

## 2. Architecture checklist (tailored)

### PART 1 — Situation + prediction

**Purpose:** Hook with a visible, concrete osmosis phenomenon; activate prior knowledge of diffusion.

**Proposed content:**
- Hook: "Leave a cucumber slice in salty water and it goes limp. Put a wilted salad leaf in cold water and it goes crisp again. Both of these are the same process. What's happening to the water?"
- Prediction: "A potato cylinder is placed in pure water. Does it get heavier, lighter, or stay the same? Why?"
- You will learn: (1) what osmosis is and how it differs from diffusion; (2) what turgid, flaccid and plasmolysed mean; (3) how to carry out and evaluate the potato osmosis practical; (4) how to calculate percentage change in mass

**Suggested components:**
- `CinematicRevealMoment` — side-by-side: wilted celery vs crisp celery after water soaking; relatable, dramatic, real
- `ChapterHookScreen` — potato cylinder prediction (heavier / lighter / same)

---

### PART 2 — Investigate the evidence

**Purpose:** Explore what osmosis looks like before defining it.

**Proposed content:**
- Animation/image sequence: water molecules on both sides of a partially permeable membrane; more water molecules on left (dilute); net movement from left to right shown as arrows
- Plant cell turgid vs flaccid visual: same cell, two states, vacuole size, cell wall, membrane position
- Potato cylinder results preview: show a table of mass before/after at 5 concentrations — students notice the trend before calculating

**Suggested components:**
- `VisualLearning` — water molecule movement across a partially permeable membrane; frame-by-frame (dilute side → concentrated side); builds intuition before the definition
- `TheoryCompareBlock` — turgid vs flaccid vs plasmolysed (three states; diagram + description for each)
- `CardContainer` — results preview table (one card per concentration showing mass change direction and magnitude)

---

### PART 3 — Discover the science

**Purpose:** Formal teaching of osmosis, turgor/flaccid/plasmolysis, and the practical method.

**Proposed content:**
- Osmosis definition: water molecules, higher water potential → lower water potential, partially permeable membrane, passive
- Distinction from diffusion: osmosis = specifically water; diffusion = any dissolved substance or gas
- Turgid/flaccid/plasmolysed: mechanism chain for each
- Practical method: step-by-step (cut → weigh → immerse → time → dry → reweigh → calculate)
- % change formula: ((final − initial) / initial) × 100; positive = gained water; negative = lost water
- Variables: IV = sucrose concentration; DV = % change in mass; CVs listed

**Suggested components:**
- `ExplainReveal` — osmosis chain: more water molecules (dilute side) → higher water potential → net water movement through membrane → lower water potential (concentrated side) → equilibrium
- `ConceptReveal` — turgid → flaccid → plasmolysed as a progression: "same cell, three different environments"
- `OrderedRouteTask` — order the practical steps: cut cylinders → weigh → add to solutions → wait → remove → dry → reweigh → calculate % change
- `CardContainer` — variables: one card per variable (IV / DV / 4 control variables) with brief explanation of why each must be controlled

---

### PART 4 — Check precision

**Purpose:** Target the most common osmosis errors.

**Proposed content:**
- Misconception 1: "Osmosis moves the dissolved particles (e.g. sucrose) through the membrane" → FALSE: only water moves; sucrose molecules are too large
- Misconception 2: "A turgid plant cell will burst" → FALSE: cell wall prevents bursting (animal cells can burst, not plant cells)
- Misconception 3: "The potato gains mass because it absorbs sucrose" → FALSE: the membrane is partially permeable to water only; mass gain is due to water entering
- SpotTheError: "When placed in a concentrated salt solution, the plant cell takes in water by osmosis and becomes turgid." (error: in concentrated solution, water LEAVES → cell becomes FLACCID)
- Calculation check: student has calculated (5.8 − 5.0) / 5.8 × 100 = 13.8% instead of (5.8 − 5.0) / 5.0 × 100 = 16% — spot the denominator error

**Suggested components:**
- `MisconceptionCheck` × 3 — one per misconception listed above
- `SpotTheError` × 2 — one for the flaccid/turgid direction error; one for the % change calculation denominator error

---

### PART 5 — Apply to a real GCSE-style task

**Purpose:** Exam practice for define, calculate, describe method, and explain results.

**Proposed content:**
- Q1: "Define osmosis." (2 marks)
- Q2: "A potato cylinder has a mass of 4.0 g before and 3.4 g after being placed in sucrose solution. Calculate the percentage change in mass." (2 marks)
- Q3: "Describe how you would use potato cylinders to investigate the effect of sucrose concentration on mass change. Include how you would make the investigation valid." (5 marks)
- Q4: "Explain what happens to a plant cell when it is placed in pure water." (3 marks — turgid chain: water enters by osmosis → vacuole swells → presses against cell wall → turgid)
- Q5: "Explain why percentage change in mass is a better measure than change in mass." (2 marks)

**Suggested components:**
- `GuidedExamResponse` — Q3 (method question; scaffold: cut cylinders of same size → weigh → place in solutions of different concentration → same time → remove and dry → reweigh → calculate % change → state control variables)
- `ExamQuestionFrame` — Q1, Q2, Q4, Q5
- `FillInTheBlanksBlock` — Q1 definition fill-in (blank: "water molecules"; "higher water potential"; "lower water potential"; "partially permeable membrane")

---

### PART 6 — Face the examiner + debrief

**Purpose:** Examiner commentary; seal with retrieval.

**Proposed content:**
- Return to opening: "Can you now explain why the cucumber goes limp in salt water?"
- Examiner contrast: weak ("The potato gets lighter because water comes out") vs strong ("In the concentrated sucrose solution, the water potential of the solution is lower than that of the potato cells. Water molecules therefore move from the potato cells into the solution by osmosis through the partially permeable cell membrane. The cells lose water, the vacuoles shrink, and the cells become flaccid — so the potato cylinder loses mass.")
- Mark commentary: "Three things needed: (1) the direction reasoning (lower water potential outside); (2) osmosis through partially permeable membrane; (3) the outcome (flaccid/loses mass). 'Water comes out' gets 1 mark. Full answer gets 3."
- Retrieval questions (5):
  1. Define osmosis in one sentence.
  2. A potato cylinder changes from 6.0 g to 5.4 g. Calculate the % change in mass.
  3. What does "turgid" mean?
  4. Why are plant cells not burst by osmosis when placed in pure water?
  5. Name the independent variable in the potato osmosis investigation.
- Interleave from Ch 7: "How is osmosis similar to diffusion? How is it different?" (same: passive, high → low; different: osmosis = only water; requires partially permeable membrane)

**Suggested components:**
- `FaceTheExaminer` — weak vs strong answer to "explain why the potato loses mass in concentrated solution"
- `ExaminerExplainsScreen` — "Three marks, three ideas: water potential direction / osmosis / flaccid. Chain them."
- `QuickRecallScreen` — 5 retrieval questions
- `ChapterCompleteScreen`

---

### Module Completion Test

- [ ] Students can define osmosis with all four required elements (water molecules; higher to lower water potential; partially permeable membrane; passive)
- [ ] Students can describe what happens to a plant cell in dilute, isotonic, and concentrated solutions
- [ ] Students can explain the terms turgid, flaccid, and plasmolysis
- [ ] Students can describe the potato cylinder practical method in correct order with control variables
- [ ] Students can calculate percentage change in mass using the correct formula and denominator
- [ ] Students can explain why percentage change (not absolute change) is used
- [ ] Students can draw or sketch a graph showing % change in mass vs sucrose concentration, including the isotonic point
- [ ] Students can identify and explain an anomalous result
- [ ] Students can distinguish osmosis from diffusion (both passive; osmosis = only water through partially permeable membrane)
- [ ] Students can explain why plant cells don't burst in pure water (cell wall resists expansion)

---

## 3. Current state & gap analysis

Not yet built — full build from spec.

---

## 4. Build recommendations

1. **Core argument integration:** "Water goes where solutes are concentrated" — this should be the thread. In Part 1 (cucumber/salad), Part 3 (water potential direction), Part 5 (calculate the effect), and Part 6 (explain the cucumber). The isotonic point should be explicitly named and placed on the graph in Part 3.

2. **OrderedRouteTask for practical method:** Ordering the practical steps is the most common error in method questions. The ordered chain mechanic trains this directly. Steps: cut → weigh → immerse → time → dry → reweigh → calculate. This should appear in Part 3 and be revisited in Part 5's GuidedExamResponse.

3. **SpotTheError × 2 priority:** Two calculation/conceptual errors are particularly common: (a) the flaccid/turgid direction reversal in concentrated solution, and (b) dividing by the final mass instead of the initial mass in the % change formula. Both are high-yield for SpotTheError in Part 4.

4. **GuidedExamResponse for the 5-mark method question:** This is the highest-value item in the chapter. The scaffold should model: (1) cylinders cut to same size; (2) weigh and record; (3) range of sucrose concentrations; (4) same time in solution; (5) dry and reweigh; (6) calculate % change; (7) name the control variables. Seven points → 5 marks.

5. **GraphView for results:** A line graph of % change in mass vs sucrose concentration should appear in Part 3 — both as evidence (here's what happens) and as skill training (reading the isotonic point from where the line crosses the x-axis). Students need to describe trends and identify the isotonic point from the graph.

6. **Interleaving:** Part 6 explicitly compares osmosis to diffusion (both passive; osmosis = water only; membrane required). This is the most commonly examined comparison between the two processes and should appear in retrieval every time osmosis is practised.

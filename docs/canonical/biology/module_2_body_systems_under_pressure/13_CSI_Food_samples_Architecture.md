# Chapter 13: CSI: Food samples — Architecture

## 1. Identity

- **Chapter:** 13
- **Title:** CSI: Food samples
- **Subject:** AQA GCSE Combined Science Trilogy — Biology Paper 1
- **Module:** Module 2 — Body systems under pressure
- **Build status:** Not yet built
- **Content file:** `13_CSI_Food_samples_Content.md`

---

## 2. Six-part structure mapping

### Part 1 — Situation + prediction

- Hook: "A food company claims its protein bar contains no sugar. A nutritionist claims it does. How would you prove who is right?" Crime-scene framing — food analysis as forensic work.
- Prediction: "What do you think you would need to add to the food to find out what's in it?"
- You will learn: four food tests and how to design a valid food-testing investigation.

**Components:** `CinematicRevealMoment`, `ChapterHookScreen`

---

### Part 2 — Investigate the evidence

- Visual walkthrough of each food test: show the starting colour, what to do, and what positive/negative looks like
- Use VisualLearning or CinematicCarousel: one slide per test (Benedict's / iodine / Biuret / Sudan III or emulsion test)
- Emphasis on colour changes as evidence

**Components:** `VisualLearning` or `CinematicCarousel`

---

### Part 3 — Discover the science

- Teach each test in systematic order: reagent → molecule tested → positive result colour → negative result colour → any special conditions (heat for Benedict's)
- ConceptReveal: why a control is needed — distinguishes reagent background colour from a true positive
- Brief link back to Ch 12: these molecules (starch, sugars, proteins, lipids) are exactly what digestive enzymes break down

**Components:** `ConceptReveal`, `VisualNarrativeScreen` or read blocks

---

### Part 4 — Check precision

- MisconceptionCheck: "Benedict's test works on all sugars." → false (only reducing sugars; sucrose is not detected)
- MisconceptionCheck: "A negative result means the food contains nothing." → false
- SpotTheError: "I tested the sample with Benedict's reagent and it turned blue-black, which means it contains reducing sugar." (Error: blue-black is the iodine result for starch; Benedict's goes brick red/orange)

**Components:** `MisconceptionCheck` × 2, `SpotTheError`

---

### Part 5 — Apply to a real GCSE-style task

- MatchingTask: food test → molecule → positive result colour
- GuidedExamResponse: "A student is testing four food samples for the presence of starch and protein. Describe the tests they should carry out and the expected results." (4 marks)
- FillInTheBlanksBlock: colour-change recall — "If Benedict's reagent is added to a glucose solution and heated, the solution turns ___."

**Components:** `MatchingTask`, `GuidedExamResponse`, `FillInTheBlanksBlock`

---

### Part 6 — Face the examiner + debrief

- FaceTheExaminer: student confuses iodine result with Benedict's result in a written answer; mark commentary
- QuickRecallScreen: 5 questions — name the reagent for starch; what colour does Benedict's turn for a positive result; does Benedict's require heating; what does Biuret test for; what is the purpose of a negative control?

**Components:** `FaceTheExaminer`, `QuickRecallScreen`

---

## 3. Active learning interactions

- `VisualLearning` / `CinematicCarousel`: four food tests
- `ConceptReveal`: purpose of a control
- `MisconceptionCheck` × 2: reducing sugars; negative results
- `SpotTheError`: blue-black / brick red colour confusion
- `MatchingTask`: test → molecule → colour
- `GuidedExamResponse`: 4-mark method question
- `FillInTheBlanksBlock`: colour recall
- `FaceTheExaminer`: colour confusion answer
- `QuickRecallScreen`: 5 retrieval questions

---

## 4. Retrieval points

- Four food tests: Benedict's (reducing sugars, brick red), iodine (starch, blue-black), Biuret (protein, purple), Sudan III / emulsion (lipid)
- Benedict's requires heating; Biuret does not
- Purpose of a negative control
- Reducing vs non-reducing sugars (sucrose not detected by Benedict's)

---

## 5. Exam skill focus

- 4-mark method: describe how to test for starch and protein in a food sample
- 2-mark explain: explain why a negative control is needed
- 1-mark recall: state the positive result colour for a named food test

---

## 6. Build notes

The "CSI" framing gives this required practical chapter a strong identity. Every food test screen should show before (reagent colour) and after (positive result colour) clearly. The single most common exam error is confusing Benedict's (brick red) with iodine (blue-black). This confusion needs its own SpotTheError screen. Do not teach all four tests on a single screen — one test per screen in Part 2.

---

## 7. Chapter completion test

- [ ] Student can name the correct reagent for each food molecule (sugars, starch, protein, lipid)
- [ ] Student can state the positive result colour for each test
- [ ] Student knows Benedict's requires heating; Biuret does not
- [ ] Student knows Benedict's only detects reducing sugars (not sucrose)
- [ ] Student can explain why a negative control is needed
- [ ] Student can describe how to carry out two food tests in a written method
- [ ] Student has practised a 4-mark describe/method question

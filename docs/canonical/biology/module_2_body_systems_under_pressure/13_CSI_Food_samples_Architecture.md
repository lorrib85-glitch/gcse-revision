# Chapter 13: CSI: Food samples — Architecture

## 1. Identity

- **Chapter:** 13
- **Module chapter:** Module 2, Chapter 3
- **Title:** CSI: Food samples
- **Subject:** AQA GCSE Combined Science Trilogy — Biology Paper 1
- **Module:** Module 2 — Body systems under pressure
- **Build status:** Canonical reviewed; not yet built
- **Content file:** `13_CSI_Food_samples_Content.md`

---

## 2. Six-part structure mapping

### Part 1 — Situation + prediction

- Hook: "A food company claims its protein bar contains no sugar. A nutritionist claims it does. How would you prove who is right?" Use forensic food analysis, but keep it serious rather than gimmicky.
- Prediction: "Can colour changes prove what is inside a food sample?"
- You will learn: food sample preparation, four food tests, positive/negative results, controls and reliability.

**Components:** `CinematicRevealMoment`, `ChapterHookScreen`, `PriorKnowledgeRecall`

---

### Part 2 — Investigate the evidence

- Visual walkthrough of sample preparation:
  - crush food
  - add distilled water
  - mix
  - filter if needed
  - test the liquid sample
- One visual screen per food test:
  - Benedict's for reducing sugars
  - iodine for starch
  - Biuret for protein
  - lipid test: Sudan III or emulsion test
- Each screen should show:
  - molecule tested
  - reagent/test
  - method
  - positive result
  - negative result
  - exam trap

**Components:** `VisualLearning`, `CinematicCarousel`, `StepSequence`

---

### Part 3 — Discover the science

- Teach food tests in systematic order:
  - reagent → molecule tested → method → positive result → negative result → special condition
- `ConceptReveal`: Benedict's requires heating; iodine and Biuret do not.
- `ConceptReveal`: controls make the result trustworthy.
- Brief link back to Chapter 12: these molecules are the same food molecules enzymes digest.

**Components:** `ConceptReveal`, `VisualNarrative`, `TheoryCompareBlock`

---

### Part 4 — Check precision

- `MisconceptionCheck`: "Benedict's test works on all sugars." → false; GCSE-safe wording: reducing sugars such as glucose.
- `MisconceptionCheck`: "A negative iodine result means the food contains no food molecules." → false; it only means starch was not detected.
- `MisconceptionCheck`: "Biuret needs heating." → false.
- `SpotTheError`: "I added iodine and heated it. It turned brick red, so starch was present." Errors: iodine is not heated; brick red is Benedict's positive result for reducing sugar.

**Components:** `MisconceptionCheck`, `SpotTheError`

---

### Part 5 — Apply to a real GCSE-style task

- `MatchingTask`: food test → molecule → positive result colour.
- `MatchingTask`: test → special condition.
- `GuidedExamResponse`: "Describe how to test a food sample for reducing sugar. (3 marks)"
- `GuidedExamResponse`: "Explain why a negative control is useful. (2 marks)"
- `FillInTheBlanksBlock`: colour-change recall.

**Components:** `MatchingTask`, `GuidedExamResponse`, `FillInTheBlanksBlock`

---

### Part 6 — Face the examiner + debrief

- `FaceTheExaminer`: student confuses iodine result with Benedict's result; mark commentary separates starch vs reducing sugar.
- `FaceTheExaminer`: student concludes "no food molecules" from a negative iodine test; mark commentary explains limits of evidence.
- Quick recall: reagent for starch; Benedict's positive result; which test needs heating; Biuret result; purpose of negative control; lipid positive result.

**Components:** `FaceTheExaminer`, `QuickRecallScreen`

---

## 3. Active learning interactions

- `StepSequence`: preparing a food sample
- `VisualLearning` / `CinematicCarousel`: four food tests, one per screen
- `ConceptReveal`: why Benedict's needs heat
- `ConceptReveal`: positive and negative controls
- `MisconceptionCheck` × 3: reducing sugars; negative result overclaim; Biuret heating
- `SpotTheError`: iodine/Benedict's colour confusion
- `MatchingTask`: test → molecule → colour
- `MatchingTask`: test → special condition
- `GuidedExamResponse`: reducing sugar method
- `GuidedExamResponse`: negative control explanation
- `FillInTheBlanksBlock`: colour recall
- `FaceTheExaminer`: colour confusion answer
- `FaceTheExaminer`: invalid conclusion answer
- `QuickRecallScreen`: 6 retrieval questions

---

## 4. Retrieval points

- Benedict's: reducing sugar, heat, positive green/yellow/orange/brick red
- Iodine: starch, positive blue-black, no heat
- Biuret: protein, positive lilac/purple, no heat
- Lipid: Sudan III red oil layer or emulsion test cloudy white
- Purpose of positive and negative controls
- Negative result only applies to the molecule being tested
- Clean equipment and repeats improve reliability

---

## 5. Exam skill focus

- 3-mark method: test for reducing sugar
- 2-mark method/result: test for protein
- 2-mark explain: why use a negative control
- 2-mark evaluation: why a conclusion is invalid from one negative test
- Table interpretation: conclude which molecule is present from colour changes

---

## 6. Build notes

The "CSI" framing gives this required practical chapter a strong identity, but avoid making it childish. Think forensic lab, not cartoon detective.

Every food test screen should show before and after clearly. The biggest exam risk is colour confusion: Benedict's goes towards brick red after heating; iodine goes blue-black without heating.

Use consistent visual grammar: reagent bottle, sample tube, condition, result colour, conclusion.

---

## 7. Chapter completion test

- [ ] Student can prepare a food sample for testing
- [ ] Student can name the correct reagent/test for reducing sugar, starch, protein and lipid
- [ ] Student can state the positive result for each test
- [ ] Student knows Benedict's requires heating
- [ ] Student knows iodine and Biuret do not require heating
- [ ] Student can explain why a negative control is needed
- [ ] Student can avoid overclaiming from a negative result
- [ ] Student can describe a food test method in exam wording

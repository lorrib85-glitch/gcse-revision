# Chapter 18: Risk, damage and runaway cells — Architecture

## 1. Identity

- **Chapter:** 18
- **Module chapter:** Module 2, Chapter 8
- **Title:** Risk, damage and runaway cells
- **Subject:** AQA GCSE Combined Science Trilogy — Biology Paper 1
- **Module:** Module 2 — Body systems under pressure
- **Build status:** Canonical reviewed; not yet built
- **Content file:** `18_Risk_damage_and_runaway_cells_Content.md`

---

## 2. Six-part structure mapping

### Part 1 — Situation + prediction

- Hook: "A risk factor is not a crystal ball." Show two people exposed to the same risk factor with different outcomes, then a data graph appearing.
- Prediction: "Does a correlation prove causation?"
- You will learn: health, communicable vs non-communicable disease, risk factors, disease interactions, cancer and benign vs malignant tumours.

**Components:** `CinematicRevealMoment`, `ChapterHookScreen`, `PriorKnowledgeRecall`

---

### Part 2 — Investigate the evidence

- `GraphView`: lifestyle factor vs disease rate. Students identify:
  - what the graph shows
  - what it does not prove
  - what extra evidence would strengthen the conclusion
- `VisualNarrative`: benign vs malignant tumour progression.
- `TheoryCompareBlock`: communicable vs non-communicable disease examples.

**Components:** `GraphView`, `VisualNarrative`, `TheoryCompareBlock`

---

### Part 3 — Discover the science

- `ExplainReveal`: health = physical and mental wellbeing, not just absence of disease.
- `ExplainReveal`: disease classification and examples.
- `ConceptReveal`: risk factor = increased probability, not certainty.
- `ConceptReveal`: correlation vs causation and causal mechanism.
- `TheoryCompareBlock`: benign vs malignant tumours.
- `ConceptReveal`: disease interactions: immune defects, viruses and cancer, allergies, physical illness and mental health.

**Components:** `ExplainReveal`, `ConceptReveal`, `TheoryCompareBlock`

---

### Part 4 — Check precision

- `MisconceptionCheck`: "A risk factor means you will definitely get the disease." → false.
- `MisconceptionCheck`: "Correlation proves causation." → false.
- `MisconceptionCheck`: "Benign tumours are always harmless." → false.
- `SpotTheError`: "The graph proves alcohol causes liver disease." Correction: graph shows correlation; causation needs stronger evidence and consideration of other factors.
- `SpotTheError`: "Malignant means the patient will definitely die." Correction: malignant means invasive/cancerous and able to spread.

**Components:** `MisconceptionCheck`, `SpotTheError`

---

### Part 5 — Apply to a real GCSE-style task

- `GuidedExamResponse`: "Compare benign and malignant tumours. (4 marks)"
- `GuidedExamResponse`: "Explain why a correlation does not always prove causation. (3 marks)"
- `GraphView`: interpret a risk-factor graph.
- `MatchingTask`: risk factor → linked disease.
- `FillInTheBlanksBlock`: tumour vocabulary.

**Components:** `GuidedExamResponse`, `GraphView`, `MatchingTask`, `FillInTheBlanksBlock`

---

### Part 6 — Face the examiner + debrief

- `FaceTheExaminer`: student writes "smoking causes lung cancer" without qualifying risk-factor language. Mark commentary improves to "smoking increases the risk" unless the question asks for causal mechanism.
- `FaceTheExaminer`: student compares tumours but misses spreading/secondary tumours. Mark commentary adds the missing high-value point.
- Quick recall: health definition; risk factor; correlation vs causation; benign vs malignant; disease interaction example.

**Components:** `FaceTheExaminer`, `QuickRecallScreen`

---

## 3. Active learning interactions

- `GraphView`: lifestyle factors vs disease rates
- `GraphView`: what can/cannot be concluded from data
- `VisualNarrative`: benign vs malignant tumour progression
- `TheoryCompareBlock`: communicable vs non-communicable disease
- `ExplainReveal`: health definition
- `ConceptReveal`: risk factor = probability
- `ConceptReveal`: correlation vs causation
- `ConceptReveal`: disease interactions
- `MisconceptionCheck` × 3
- `SpotTheError` × 2
- `GuidedExamResponse`: benign vs malignant question
- `GuidedExamResponse`: correlation/causation question
- `MatchingTask`: risk factor → disease
- `FaceTheExaminer`: overclaiming causation
- `QuickRecallScreen`: 6 retrieval questions

---

## 4. Retrieval points

- Health = physical and mental wellbeing, not just absence of disease
- Communicable diseases can spread; non-communicable diseases cannot spread between organisms
- Risk factor = increased probability, not certainty
- Correlation does not automatically prove causation
- Causal claims need stronger evidence and/or biological mechanism
- Cancer = uncontrolled cell growth and division
- Benign = contained, does not invade/spread
- Malignant = invades, spreads via blood/lymph, can form secondary tumours
- Diseases can interact with mental health, immune responses and cancer risk

---

## 5. Exam skill focus

- 1-mark definition: health
- 2-mark explain: risk factor
- 3-mark data interpretation: correlation vs causation
- 4-mark compare: benign vs malignant tumours
- 2-mark examples: disease interactions

---

## 6. Build notes

This chapter must not become a vague lifestyle lecture. It is an exam-precision chapter.

The core skill is **careful claim language**: "increases risk", "shows correlation", "does not prove causation alone". Make students practise replacing overconfident claims with mark-scheme-safe wording.

The tumour comparison needs a clear visual split: benign = contained; malignant = invasive and spreading.

---

## 7. Chapter completion test

- [ ] Student can state the AQA definition of health
- [ ] Student can distinguish communicable and non-communicable disease with examples
- [ ] Student can define risk factor accurately
- [ ] Student can interpret a correlation graph without overclaiming causation
- [ ] Student can compare benign and malignant tumours
- [ ] Student can name at least three cancer risk factors
- [ ] Student can give an example of disease interaction
- [ ] Student has practised a graph interpretation question with mark commentary

# Chapter 18: Risk, damage and runaway cells — Architecture

## 1. Identity

- **Chapter:** 18
- **Title:** Risk, damage and runaway cells
- **Subject:** AQA GCSE Combined Science Trilogy — Biology Paper 1
- **Module:** Module 2 — Body systems under pressure
- **Build status:** Not yet built
- **Content file:** `18_Risk_damage_and_runaway_cells_Content.md`

---

## 2. Six-part structure mapping

### Part 1 — Situation + prediction

- Hook: "Millions of people smoke and never get lung cancer. Millions of people who never smoked do get lung cancer. So does smoking cause cancer?" Cinematic — data appearing, correlation arrow, then a question mark.
- Prediction: "Is a risk factor the same as a cause? True or false?"
- You will learn: the definition of health; communicable vs non-communicable disease; lifestyle risk factors; what cancer is and how it spreads.

**Components:** `CinematicRevealMoment`, `ChapterHookScreen`

---

### Part 2 — Investigate the evidence

- GraphView: data showing correlation between lifestyle factors (smoking, obesity, inactivity) and non-communicable disease rates — students interpret the graph and identify what can/cannot be concluded
- VisualNarrativeScreen: the story of a benign vs malignant tumour — side-by-side growth pattern with spread illustrated

**Components:** `GraphView`, `VisualNarrativeScreen`

---

### Part 3 — Discover the science

- ExplainReveal: health definition (WHO-style: physical + mental + social wellbeing — not just absence of disease); communicable vs non-communicable disease; risk factors
- ConceptReveal: correlation vs causation — a risk factor increases probability but does not guarantee disease; need controlled studies to establish causation
- TheoryCompareBlock: benign vs malignant tumours — growth rate, containment, spread (metastasis), treatability

**Components:** `ExplainReveal`, `ConceptReveal`, `TheoryCompareBlock`

---

### Part 4 — Check precision

- MisconceptionCheck: "A risk factor causes the disease." → false (a risk factor increases probability; does not guarantee disease)
- MisconceptionCheck: "Malignant means fatal." → false (malignant means invasive/able to spread; treatment can be successful, especially if caught early)
- SpotTheError: "Correlation between obesity and type 2 diabetes proves that obesity causes type 2 diabetes." (Error: correlation does not prove causation; other factors could be involved; a causal link requires additional controlled evidence)

**Components:** `MisconceptionCheck` × 2, `SpotTheError`

---

### Part 5 — Apply to a real GCSE-style task

- GuidedExamResponse: "Explain the difference between a benign tumour and a malignant tumour. (3 marks)"
- FillInTheBlanksBlock: "Cancer is caused by ___ cell division. A ___ tumour stays in one place, whereas a ___ tumour can spread to other parts of the body via the ___ or lymph."
- GraphView: rate-of-disease graph — identify a risk factor from data; state what the graph does and does not prove

**Components:** `GuidedExamResponse`, `FillInTheBlanksBlock`, `GraphView`

---

### Part 6 — Face the examiner + debrief

- FaceTheExaminer: student states "smoking causes lung cancer" without qualification; mark commentary explains why "increases the risk of" is more precise and scientifically accurate
- QuickRecallScreen: define health; give one example of a non-communicable disease; what is a risk factor; state one difference between benign and malignant tumours; name one risk factor for cancer other than smoking?

**Components:** `FaceTheExaminer`, `QuickRecallScreen`

---

## 3. Active learning interactions

- `GraphView` × 2: lifestyle factors vs disease rates; risk factor data interpretation
- `VisualNarrativeScreen`: benign vs malignant tumour progression
- `ExplainReveal`: health definition and disease classification
- `ConceptReveal`: correlation vs causation
- `TheoryCompareBlock`: benign vs malignant
- `MisconceptionCheck` × 2: risk factor = cause; malignant = fatal
- `SpotTheError`: correlation/causation error
- `GuidedExamResponse`: 3-mark benign vs malignant question
- `FillInTheBlanksBlock`: tumour vocabulary
- `FaceTheExaminer`: causation language in written answer
- `QuickRecallScreen`: 5 retrieval questions

---

## 4. Retrieval points

- Health: physical, mental and social wellbeing — not just absence of disease
- Communicable disease: caused by pathogens; can be transmitted between organisms
- Non-communicable disease: cannot be passed on (e.g. cancer, CHD, type 2 diabetes)
- Risk factor: increases probability of disease; does not guarantee it; correlation ≠ causation
- Cancer: uncontrolled cell division → tumour
- Benign: slow growing, localised, does not spread
- Malignant: fast growing, invasive, can spread (metastasize) via blood or lymph
- Risk factors for cancer: ionising radiation, smoking (carcinogens), viral infection, genetic mutation

---

## 5. Exam skill focus

- 3-mark explain: explain the difference between benign and malignant tumours
- 2-mark explain: explain what is meant by a risk factor (and why it is not the same as a cause)
- Data interpretation: identify correlations from a graph; state what can and cannot be concluded
- 1-mark define: state the AQA definition of health

---

## 6. Build notes

Correlation vs causation is the central analytical challenge of this chapter and must have a dedicated screen. Students frequently write "X causes Y" when the data only shows correlation — this must be flagged as an exam error. The benign/malignant comparison is a routine 3-mark question and needs clear visual separation. The definition of health (including mental and social wellbeing) is often missed entirely — teach it as a quotable definition. Do not allow the cancer content to overwhelm the risk factor content — both are equally examined.

---

## 7. Chapter completion test

- [ ] Student can state the AQA definition of health (physical, mental and social wellbeing)
- [ ] Student can distinguish between communicable and non-communicable disease with examples
- [ ] Student can explain what a risk factor is and why it is not the same as a cause
- [ ] Student can explain the difference between benign and malignant tumours
- [ ] Student can name at least three risk factors for cancer
- [ ] Student can interpret a graph showing a correlation without overstating causation
- [ ] Student has practised a 3-mark explain question on tumour types

# Chapter 16: The oxygen swap — Architecture

## 1. Identity

- **Chapter:** 16
- **Module chapter:** Module 2, Chapter 6
- **Title:** The oxygen swap
- **Subject:** AQA GCSE Combined Science Trilogy — Biology Paper 1
- **Module:** Module 2 — Body systems under pressure
- **Build status:** Canonical reviewed; not yet built
- **Content file:** `16_The_oxygen_swap_Content.md`

---

## 2. Six-part structure mapping

### Part 1 — Situation + prediction

- Hook: "Every breath moves oxygen across a wall one cell thick." Show a single breath zooming through trachea → bronchi → bronchioles → alveolus → blood.
- Prediction: "When you breathe in, does pressure inside the chest increase or decrease?"
- You will learn: respiratory structures, ventilation mechanics, gas exchange, alveolar adaptations and the difference between breathing and respiration.

**Components:** `CinematicRevealMoment`, `ChapterHookScreen`, `PriorKnowledgeRecall`

---

### Part 2 — Investigate the evidence

- Respiratory route walkthrough:
  - trachea
  - bronchi
  - bronchioles
  - alveoli
- Ventilation sequence:
  - inhalation: diaphragm contracts, ribs up/out, volume increases, pressure decreases, air in
  - exhalation: diaphragm relaxes, ribs down/in, volume decreases, pressure increases, air out
- Alveolus close-up:
  - oxygen arrow alveolus → blood
  - carbon dioxide arrow blood → alveolus
  - capillary network around alveolus

**Components:** `VisualLearning`, `StepSequence`, `ExplainReveal`

---

### Part 3 — Discover the science

- `ExplainReveal`: gas exchange at the alveolus:
  - oxygen diffuses from alveoli into blood
  - carbon dioxide diffuses from blood into alveoli
  - both move down concentration gradients
- `TheoryCompareBlock`: inhalation vs exhalation:
  - diaphragm
  - ribs
  - volume
  - pressure
  - air direction
- `ConceptReveal`: alveolar adaptations:
  - large surface area
  - thin walls
  - moist lining
  - rich blood supply
  - ventilation maintaining gradients
- `ConceptReveal`: breathing/ventilation vs respiration.

**Components:** `ExplainReveal`, `TheoryCompareBlock`, `ConceptReveal`

---

### Part 4 — Check precision

- `MisconceptionCheck`: "We breathe out only carbon dioxide." → false.
- `MisconceptionCheck`: "Gas exchange uses active transport." → false; it uses diffusion.
- `MisconceptionCheck`: "Breathing and respiration mean the same thing." → false.
- `SpotTheError`: "During inhalation, the diaphragm relaxes and pressure increases." Correction: diaphragm contracts, volume increases, pressure decreases.
- `SpotTheError`: "Alveoli have thick walls so they are strong." Correction: alveoli have thin walls for short diffusion distance.

**Components:** `MisconceptionCheck`, `SpotTheError`

---

### Part 5 — Apply to a real GCSE-style task

- `GuidedExamResponse`: "Explain how the alveoli are adapted for efficient gas exchange. (4 marks)"
- `GuidedExamResponse`: "Describe what happens during inhalation. (4 marks)"
- `FillInTheBlanksBlock`: inhalation mechanism.
- `GraphView`: concentration gradients across alveolus/blood boundary.
- `MatchingTask`: adaptation → how it improves diffusion.

**Components:** `GuidedExamResponse`, `FillInTheBlanksBlock`, `GraphView`, `MatchingTask`

---

### Part 6 — Face the examiner + debrief

- `FaceTheExaminer`: student lists alveolar adaptations without explaining why they help. Mark commentary demands structure-function links.
- `FaceTheExaminer`: student says "breathing releases energy." Mark commentary separates ventilation from respiration.
- Quick recall: inhalation sequence; exhalation sequence; oxygen direction; carbon dioxide direction; four alveolar adaptations; breathing vs respiration.

**Components:** `FaceTheExaminer`, `QuickRecallScreen`

---

## 3. Active learning interactions

- `VisualLearning`: respiratory system route
- `StepSequence`: inhalation and exhalation mechanics
- `ExplainReveal`: gas exchange at alveolus
- `TheoryCompareBlock`: inhalation vs exhalation
- `ConceptReveal`: alveolar adaptations
- `ConceptReveal`: breathing vs respiration
- `MisconceptionCheck` × 3
- `SpotTheError` × 2
- `GuidedExamResponse`: 4-mark alveolar adaptations question
- `GuidedExamResponse`: 4-mark inhalation question
- `FillInTheBlanksBlock`: ventilation vocabulary
- `GraphView`: diffusion gradients
- `MatchingTask`: adaptation → function
- `FaceTheExaminer`: adaptation without function answer
- `QuickRecallScreen`: 6 retrieval questions

---

## 4. Retrieval points

- Respiratory route: trachea → bronchi → bronchioles → alveoli
- Inhalation: diaphragm contracts, ribs up/out, volume increases, pressure decreases, air in
- Exhalation: diaphragm relaxes, ribs down/in, volume decreases, pressure increases, air out
- Oxygen diffuses alveoli → blood
- Carbon dioxide diffuses blood → alveoli
- Gas exchange uses diffusion down concentration gradients
- Alveolar adaptations must be linked to diffusion rate
- Breathing/ventilation is not the same as respiration

---

## 5. Exam skill focus

- 4-mark explain: alveolar adaptations for gas exchange
- 4-mark describe: inhalation sequence
- 3-mark explain: breathing vs respiration
- 2-mark explain: blood supply maintaining concentration gradient
- Data interpretation: identify diffusion direction from concentration data

---

## 6. Build notes

The most examined part is alveolar adaptations, but students lose marks when they list without linking to function. Every adaptation screen must use the full chain: structure → effect on diffusion → why this helps gas exchange.

Ventilation mechanics are easy to reverse. Use a simple repeated pattern: volume up = pressure down = air in; volume down = pressure up = air out.

Do not blur breathing and respiration. This distinction should be explicit early and revisited at the end.

---

## 7. Chapter completion test

- [ ] Student can describe what happens to diaphragm, ribcage, volume and pressure during inhalation
- [ ] Student can describe what happens during exhalation
- [ ] Student can state the direction of diffusion for oxygen and carbon dioxide at the alveolus
- [ ] Student can name and explain at least four alveolar adaptations
- [ ] Student can distinguish between ventilation and respiration
- [ ] Student can explain how blood supply maintains a concentration gradient
- [ ] Student has practised a 4-mark alveolar adaptations question with mark commentary

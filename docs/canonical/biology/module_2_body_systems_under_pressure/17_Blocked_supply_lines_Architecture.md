# Chapter 17: Blocked supply lines — Architecture

## 1. Identity

- **Chapter:** 17
- **Module chapter:** Module 2, Chapter 7
- **Title:** Blocked supply lines
- **Subject:** AQA GCSE Combined Science Trilogy — Biology Paper 1
- **Module:** Module 2 — Body systems under pressure
- **Build status:** Canonical reviewed; not yet built
- **Content file:** `17_Blocked_supply_lines_Content.md`

---

## 2. Six-part structure mapping

### Part 1 — Situation + prediction

- Hook: "The heart pumps blood around the body — but the heart muscle needs its own blood supply too." Show coronary arteries narrowing while heart muscle oxygen fades.
- Prediction: "If a coronary artery narrows, would you use a drug, a mesh tube, or a replacement heart?"
- You will learn: coronary heart disease, stents, statins, replacement valves, transplants, artificial hearts and evaluation skills.

**Components:** `CinematicRevealMoment`, `ChapterHookScreen`, `PriorKnowledgeRecall`

---

### Part 2 — Investigate the evidence

- Visual walkthrough of CHD progression:
  - healthy coronary artery
  - fatty material builds up
  - lumen narrows
  - blood flow reduces
  - less oxygen reaches heart muscle
  - less aerobic respiration
  - heart muscle damage/heart attack risk
- Treatment carousel:
  - stent
  - statin
  - biological valve
  - mechanical valve
  - transplant
  - artificial heart

**Components:** `VisualLearning`, `CinematicCarousel`, `StepSequence`

---

### Part 3 — Discover the science

- `ExplainReveal`: CHD chain — fatty material → narrowed coronary artery → reduced oxygen → less aerobic respiration → heart muscle damage.
- `TheoryCompareBlock`: stents vs statins:
  - stent = physical mesh tube, quick restoration of blood flow, procedure risks
  - statin = drug lowering cholesterol, long-term risk reduction, side effects
- `TheoryCompareBlock`: biological vs mechanical valves.
- `ConceptReveal`: transplant vs artificial heart.
- `ConceptReveal`: risk factor means increased probability, not certainty.

**Components:** `ExplainReveal`, `TheoryCompareBlock`, `ConceptReveal`

---

### Part 4 — Check precision

- `MisconceptionCheck`: "Statins cure coronary heart disease." → false.
- `MisconceptionCheck`: "A stent is a drug that dissolves fatty deposits." → false.
- `MisconceptionCheck`: "Artificial hearts are usually permanent cures." → false.
- `SpotTheError`: "Mechanical valves are always better because they last longer." Correction: they may require blood-thinning medication and increase clot risk.
- `SpotTheError`: "Only smokers get coronary heart disease." Correction: there are multiple risk factors.

**Components:** `MisconceptionCheck`, `SpotTheError`

---

### Part 5 — Apply to a real GCSE-style task

- `GuidedExamResponse`: "Explain how coronary heart disease can lead to a heart attack. (4 marks)"
- `GuidedExamResponse`: "Evaluate the use of statins and stents for treating cardiovascular disease. (6 marks)"
- `MatchingTask`: treatment → mechanism.
- `MatchingTask`: treatment → advantage/disadvantage.
- `FillInTheBlanksBlock`: CHD mechanism vocabulary.

**Components:** `GuidedExamResponse`, `MatchingTask`, `FillInTheBlanksBlock`

---

### Part 6 — Face the examiner + debrief

- `FaceTheExaminer`: student explains CHD but misses oxygen/aerobic respiration link. Mark commentary adds the chain needed for full marks.
- `FaceTheExaminer`: student evaluates stents/statins but only gives advantages. Mark commentary explains that evaluation needs benefits, drawbacks and judgement.
- Quick recall: coronary artery function; what narrows in CHD; how stents work; how statins work; valve replacement comparison; transplant rejection; artificial heart risks.

**Components:** `FaceTheExaminer`, `QuickRecallScreen`

---

## 3. Active learning interactions

- `VisualLearning`: CHD progression
- `StepSequence`: fatty material → heart attack risk chain
- `CinematicCarousel`: treatment approaches
- `ExplainReveal`: CHD mechanism
- `TheoryCompareBlock`: stents vs statins
- `TheoryCompareBlock`: biological vs mechanical valves
- `ConceptReveal`: transplant vs artificial heart
- `ConceptReveal`: risk factor = increased probability
- `MisconceptionCheck` × 3
- `SpotTheError` × 2
- `GuidedExamResponse`: 4-mark CHD mechanism question
- `GuidedExamResponse`: 6-mark stents/statins evaluation
- `MatchingTask`: treatment → mechanism
- `MatchingTask`: treatment → advantage/disadvantage
- `FaceTheExaminer`: missing oxygen/aerobic respiration link
- `QuickRecallScreen`: 7 retrieval questions

---

## 4. Retrieval points

- Coronary arteries supply heart muscle with oxygenated blood
- CHD: fatty material narrows coronary arteries → less blood → less oxygen → less aerobic respiration → heart muscle damage
- Stent: metal mesh tube keeps artery open
- Statin: drug lowers cholesterol and reduces future risk
- Biological valves may wear out; mechanical valves last longer but may need blood-thinning drugs
- Heart transplant: donor shortage, rejection risk, immunosuppressant drugs
- Artificial heart: temporary support, clot/infection/mechanical failure risks
- Evaluation requires advantages, disadvantages and judgement

---

## 5. Exam skill focus

- 4-mark explain: how CHD can lead to heart attack
- 3-mark explain: how a stent treats CHD
- 6-mark evaluate: statins vs stents
- 4-mark compare: biological and mechanical valves
- 2-mark explain: why transplant patients need immunosuppressants
- 2-mark recall: artificial heart disadvantages

---

## 6. Build notes

This chapter needs to feel like a medical decision pathway rather than a list of treatments. The learner should understand what problem each treatment solves:

- narrowed artery now → stent
- cholesterol/risk over time → statin
- faulty valve → replacement valve
- failing whole heart → transplant or artificial support

The highest-value exam skill is evaluation. Build at least one screen that forces advantages **and** disadvantages before the student can give a judgement.

---

## 7. Chapter completion test

- [ ] Student can explain what coronary arteries do
- [ ] Student can explain CHD using the full oxygen/aerobic respiration chain
- [ ] Student can describe how a stent works and name one limitation
- [ ] Student can describe what statins do and why they are not a cure
- [ ] Student can compare biological and mechanical replacement valves
- [ ] Student can explain why transplant patients need immunosuppressant drugs
- [ ] Student can name two artificial heart risks
- [ ] Student has practised a 6-mark treatment evaluation question

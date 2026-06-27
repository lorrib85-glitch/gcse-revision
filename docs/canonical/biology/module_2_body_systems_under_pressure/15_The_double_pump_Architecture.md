# Chapter 15: The double pump — Architecture

## 1. Identity

- **Chapter:** 15
- **Module chapter:** Module 2, Chapter 5
- **Title:** The double pump
- **Subject:** AQA GCSE Combined Science Trilogy — Biology Paper 1
- **Module:** Module 2 — Body systems under pressure
- **Build status:** Canonical reviewed; not yet built
- **Content file:** `15_The_double_pump_Content.md`

---

## 2. Six-part structure mapping

### Part 1 — Situation + prediction

- Hook: "Your heart beats roughly 100,000 times a day. Every beat sends blood through two loops, not one." Show a cinematic heart with two routes lighting up: lungs and body.
- Prediction: "Which side sends blood to the lungs — left or right?"
- You will learn: heart chambers, major vessels, valves, double circulation, pacemakers, blood vessels and blood flow calculations.

**Components:** `CinematicRevealMoment`, `ChapterHookScreen`, `PriorKnowledgeRecall`

---

### Part 2 — Investigate the evidence

- Interactive hotspot image of the heart:
  - right atrium
  - right ventricle
  - left atrium
  - left ventricle
  - valves
  - aorta
  - vena cava
  - pulmonary artery
  - pulmonary vein
  - coronary arteries
- Each hotspot should use: structure → direction of blood → oxygenation → why it matters.
- Separate two-loop route walkthrough:
  - body → vena cava → right side → pulmonary artery → lungs
  - lungs → pulmonary vein → left side → aorta → body

**Components:** `InteractiveHotspotImage`, `VisualLearning`, `StepSequence`

---

### Part 3 — Discover the science

- `ExplainReveal`: double circulatory system — blood passes through the heart twice per complete circuit.
- `ExplainReveal`: why the left ventricle has a thicker muscular wall than the right.
- `TheoryCompareBlock`: arteries vs veins vs capillaries — direction, pressure, wall thickness, lumen, valves, exchange.
- `ConceptReveal`: arteries/veins are named by direction, not oxygen content.
- `CalculationBuilder`: rate of blood flow = volume / time.

**Components:** `ExplainReveal`, `TheoryCompareBlock`, `ConceptReveal`, `CalculationBuilder`

---

### Part 4 — Check precision

- `MisconceptionCheck`: "The left side of the heart pumps blood to the lungs." → false.
- `MisconceptionCheck`: "Arteries always carry oxygenated blood." → false.
- `MisconceptionCheck`: "Veins always carry deoxygenated blood." → false.
- `SpotTheError`: "The pulmonary artery carries oxygenated blood from the lungs to the heart." Correction: pulmonary artery carries deoxygenated blood from heart to lungs.
- `SpotTheError`: "Valves push blood forwards." Correction: valves prevent backflow; muscle contraction pushes blood.

**Components:** `MisconceptionCheck`, `SpotTheError`

---

### Part 5 — Apply to a real GCSE-style task

- `GuidedExamResponse`: "Explain why the left ventricle has a thicker wall than the right ventricle. (2 marks)"
- `GuidedExamResponse`: "Describe the route of blood from the vena cava to the aorta. (5 marks)"
- `MatchingTask`: vessel → route/function.
- `MatchingTask`: blood vessel → key feature.
- `CalculationBuilder`: blood flow rate from volume and time.
- `FillInTheBlanksBlock`: right ventricle/pulmonary artery/lungs and left ventricle/aorta/body.

**Components:** `GuidedExamResponse`, `MatchingTask`, `CalculationBuilder`, `FillInTheBlanksBlock`

---

### Part 6 — Face the examiner + debrief

- `FaceTheExaminer`: student confuses pulmonary artery and pulmonary vein. Mark commentary stresses direction first, oxygen content second.
- `FaceTheExaminer`: student says capillaries have thick walls. Mark commentary explains one-cell-thick walls and short diffusion distance.
- Quick recall: four chambers; which side pumps to lungs; vessel returning blood from body; vessel taking blood to body; what valves do; capillary adaptation; blood flow formula.

**Components:** `FaceTheExaminer`, `QuickRecallScreen`

---

## 3. Active learning interactions

- `InteractiveHotspotImage`: heart diagram with major chambers and vessels
- `StepSequence`: route of blood through double circulation
- `ExplainReveal`: double circulatory system logic
- `ExplainReveal`: left ventricle wall thickness
- `TheoryCompareBlock`: arteries vs veins vs capillaries
- `ConceptReveal`: vessel direction vs oxygen content
- `MisconceptionCheck` × 3
- `SpotTheError` × 2
- `GuidedExamResponse`: 2-mark ventricle wall thickness question
- `GuidedExamResponse`: 5-mark blood route question
- `MatchingTask`: vessel → function
- `MatchingTask`: vessel → feature
- `CalculationBuilder`: blood flow rate = volume / time
- `FaceTheExaminer`: pulmonary vessel confusion
- `QuickRecallScreen`: 7 retrieval questions

---

## 4. Retrieval points

- Four chambers: right atrium, right ventricle, left atrium, left ventricle
- Right side: receives deoxygenated blood and pumps it to lungs
- Left side: receives oxygenated blood and pumps it to body
- Vena cava → right atrium → right ventricle → pulmonary artery → lungs → pulmonary vein → left atrium → left ventricle → aorta
- Pulmonary artery carries deoxygenated blood; pulmonary vein carries oxygenated blood
- Arteries carry blood away; veins carry blood towards the heart
- Capillaries are one cell thick for exchange
- Valves prevent backflow
- Rate of blood flow = volume / time

---

## 5. Exam skill focus

- 2-mark explain: left ventricle thicker wall
- 5-mark describe: route of blood through heart and lungs
- 4-mark compare: arteries and veins
- 3-mark explain: capillary adaptation
- 2-mark calculation: blood flow rate
- 2-mark correction: why arteries do not always carry oxygenated blood
- Diagram labelling: heart chambers and vessels

---

## 6. Build notes

Left/right heart confusion is the most frequently lost mark in this topic. Do not rely on one labelled diagram. Use repeated route practice.

The pulmonary artery/vein reversal is the second most common error. The core rule should be: artery/vein names are about direction from the heart, not oxygen content.

Avoid over-teaching valve names. AQA needs the function of valves more than named valve detail here.

Include a calculation screen. Blood flow rate is an easy mark if the formula is practised.

---

## 7. Chapter completion test

- [ ] Student can name all four heart chambers
- [ ] Student can trace blood from vena cava to aorta
- [ ] Student knows pulmonary artery vs pulmonary vein
- [ ] Student can explain why the left ventricle wall is thicker
- [ ] Student can compare arteries, veins and capillaries
- [ ] Student can explain why capillaries have one-cell-thick walls
- [ ] Student can state what valves do
- [ ] Student can calculate blood flow rate from volume and time

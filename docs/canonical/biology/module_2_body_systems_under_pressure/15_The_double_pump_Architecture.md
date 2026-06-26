# Chapter 15: The double pump — Architecture

## 1. Identity

- **Chapter:** 15
- **Title:** The double pump
- **Subject:** AQA GCSE Combined Science Trilogy — Biology Paper 1
- **Module:** Module 2 — Body systems under pressure
- **Build status:** Not yet built
- **Content file:** `15_The_double_pump_Content.md`

---

## 2. Six-part structure mapping

### Part 1 — Situation + prediction

- Hook: "Your heart beats roughly 100,000 times a day. Every beat pumps blood in two separate loops — not one. Why does it need two?" Cinematic — beating heart, two loop paths lighting up.
- Prediction: "Which side of the heart sends blood to the lungs — the left or the right?"
- You will learn: the four-chamber heart structure; the two circulatory loops; the three blood vessel types.

**Components:** `CinematicRevealMoment`, `ChapterHookScreen`

---

### Part 2 — Investigate the evidence

- Interactive hotspot image of the heart: label right atrium, right ventricle, left atrium, left ventricle, septum, valves, aorta, vena cava, pulmonary artery, pulmonary vein
- Each hotspot: structure name → what it does → why it matters
- Separate visual walkthrough of the two circulatory loops (pulmonary and systemic) showing the route blood takes

**Components:** `InteractiveHotspotImage`, `VisualLearning`

---

### Part 3 — Discover the science

- ExplainReveal: the double circulatory system — right side receives deoxygenated blood from body → pumps it to lungs (pulmonary loop) → returns oxygenated to left side → pumps to body (systemic loop)
- TheoryCompareBlock: arteries vs veins vs capillaries — structure, pressure, direction, wall thickness, special features
- ConceptReveal: why a double circulatory system is more efficient than a single loop — blood reaching the body is fully re-oxygenated, not diluted

**Components:** `ExplainReveal`, `TheoryCompareBlock`, `ConceptReveal`

---

### Part 4 — Check precision

- MisconceptionCheck: "The left side of the heart pumps blood to the lungs." → false (right side pumps to lungs; left pumps to body)
- MisconceptionCheck: "Arteries always carry oxygenated blood." → false (pulmonary artery carries deoxygenated blood)
- SpotTheError: "The aorta carries blood from the right ventricle to the body." (Error: the aorta leaves the left ventricle; the pulmonary artery leaves the right ventricle)

**Components:** `MisconceptionCheck` × 2, `SpotTheError`

---

### Part 5 — Apply to a real GCSE-style task

- GuidedExamResponse: "Explain why the left ventricle has a thicker wall than the right ventricle. (2 marks)"
- FillInTheBlanksBlock: "The right ventricle pumps blood to the ___ via the ___. The left ventricle pumps oxygenated blood to the ___ via the ___."
- MatchingTask: blood vessel → key feature (artery/vein/capillary → thick elastic wall / valves to prevent backflow / one cell thick)

**Components:** `GuidedExamResponse`, `FillInTheBlanksBlock`, `MatchingTask`

---

### Part 6 — Face the examiner + debrief

- FaceTheExaminer: student confuses pulmonary artery and pulmonary vein in a written answer; mark commentary stresses direction + oxygen content distinction
- QuickRecallScreen: what are the four chambers of the heart; which side pumps to the lungs; name the vessel that returns blood from the body to the heart; what prevents backflow in veins; what is the function of capillaries?

**Components:** `FaceTheExaminer`, `QuickRecallScreen`

---

## 3. Active learning interactions

- `InteractiveHotspotImage`: heart diagram with all major structures
- `VisualLearning`: two-loop circulatory route walkthrough
- `ExplainReveal`: double circulatory system logic
- `TheoryCompareBlock`: arteries vs veins vs capillaries
- `ConceptReveal`: efficiency of double circulation
- `MisconceptionCheck` × 2: left/right confusion; artery oxygen content
- `SpotTheError`: aorta/right ventricle confusion
- `GuidedExamResponse`: 2-mark ventricle wall thickness question
- `FillInTheBlanksBlock`: loop vocabulary recall
- `MatchingTask`: vessel → feature
- `FaceTheExaminer`: pulmonary vessel confusion
- `QuickRecallScreen`: 5 retrieval questions

---

## 4. Retrieval points

- Four chambers: right atrium, right ventricle, left atrium, left ventricle
- Right side: receives deoxygenated blood → pumps to lungs (pulmonary artery); left side: receives oxygenated blood → pumps to body (aorta)
- Pulmonary artery (deoxygenated, right ventricle → lungs); pulmonary vein (oxygenated, lungs → left atrium)
- Three vessel types: arteries (away from heart, thick elastic walls, high pressure), veins (to heart, thinner walls, valves, low pressure), capillaries (one cell thick, exchange)
- Left ventricle wall thicker than right — pumps blood further (to whole body vs lungs)
- Valves: prevent backflow; found between chambers and at vessel exits; also in veins

---

## 5. Exam skill focus

- 2-mark explain: explain why the left ventricle has a thicker wall than the right ventricle
- 3-mark describe: describe the route taken by a red blood cell from the vena cava to the aorta
- 1-mark recall: state one structural difference between an artery and a vein
- Identification question: label a heart diagram — common exam format

---

## 6. Build notes

Left/right heart confusion is the most frequently lost mark in this topic. The pulmonary artery/vein oxygen content reversal (artery = deoxygenated, vein = oxygenated) is the second-most common error. Both need their own dedicated misconception checks. The hotspot heart diagram is the visual anchor — all structural knowledge should be built from it. The vessel comparison (arteries/veins/capillaries) must show wall structure visually, not just describe it in text.

---

## 7. Chapter completion test

- [ ] Student can name all four heart chambers and state what each does
- [ ] Student can trace the route of blood from the body to the heart, through the lungs, and back (naming all four vessels and chambers)
- [ ] Student knows the pulmonary artery carries deoxygenated blood and the pulmonary vein carries oxygenated blood
- [ ] Student can state three structural differences between an artery and a vein
- [ ] Student can explain why capillary walls are one cell thick
- [ ] Student can explain why the left ventricle wall is thicker than the right
- [ ] Student has practised a 2-mark explain question with mark scheme feedback

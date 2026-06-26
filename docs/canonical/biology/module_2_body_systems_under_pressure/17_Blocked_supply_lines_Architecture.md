# Chapter 17: Blocked supply lines — Architecture

## 1. Identity

- **Chapter:** 17
- **Title:** Blocked supply lines
- **Subject:** AQA GCSE Combined Science Trilogy — Biology Paper 1
- **Module:** Module 2 — Body systems under pressure
- **Build status:** Not yet built
- **Content file:** `17_Blocked_supply_lines_Content.md`

---

## 2. Six-part structure mapping

### Part 1 — Situation + prediction

- Hook: "The heart pumps blood around the body — but the heart itself also needs a blood supply. What happens when that supply gets blocked?" Cinematic — coronary arteries narrowing, heart muscle fading.
- Prediction: "If a doctor needed to fix a blocked coronary artery without surgery, what do you think they might use?"
- You will learn: coronary heart disease; stents, statins and bypass surgery; faulty valves; transplants and artificial hearts.

**Components:** `CinematicRevealMoment`, `ChapterHookScreen`

---

### Part 2 — Investigate the evidence

- Visual walkthrough of CHD progression: healthy coronary artery → fatty plaque building up → narrowed lumen → reduced blood flow → heart muscle oxygen-deprived
- Show the three treatment approaches (stent, bypass, statins) in a CinematicCarousel or VisualLearning — one approach per slide with before/after

**Components:** `VisualLearning`, `CinematicCarousel`

---

### Part 3 — Discover the science

- ExplainReveal: coronary heart disease — fatty deposits narrow coronary arteries → reduced oxygen to heart muscle → pain (angina) or heart attack
- TheoryCompareBlock: three treatments side by side — stent (physical, mechanical, keeps artery open), bypass (surgical, routes around blockage), statins (drug, reduces cholesterol, slows plaque build-up)
- ConceptReveal: heart valve problems — stiff or leaky valves reduce efficiency; biological vs mechanical replacement options and trade-offs

**Components:** `ExplainReveal`, `TheoryCompareBlock`, `ConceptReveal`

---

### Part 4 — Check precision

- MisconceptionCheck: "Statins cure coronary heart disease." → false (statins reduce risk / slow progression; they do not remove existing plaques or cure CHD)
- MisconceptionCheck: "Artificial hearts are permanent replacements." → false (used as a bridge while waiting for a donor heart)
- SpotTheError: "A stent is a drug that dissolves fatty deposits in the coronary arteries." (Error: a stent is a mesh tube inserted mechanically to keep the artery open; it does not dissolve deposits — statins are the drug option)

**Components:** `MisconceptionCheck` × 2, `SpotTheError`

---

### Part 5 — Apply to a real GCSE-style task

- GuidedExamResponse: "Evaluate the use of a stent compared with bypass surgery to treat coronary heart disease. (4 marks)"
- FillInTheBlanksBlock: "Coronary heart disease is caused by fatty ___ narrowing the ___ arteries. This reduces the supply of ___ to the heart muscle."
- MatchingTask: treatment → how it works (stent / bypass / statins → keeps artery open / routes around blockage / lowers cholesterol)

**Components:** `GuidedExamResponse`, `FillInTheBlanksBlock`, `MatchingTask`

---

### Part 6 — Face the examiner + debrief

- FaceTheExaminer: student evaluates stent vs bypass without mentioning risks or limitations of either; mark commentary stresses evaluation = benefits AND drawbacks
- QuickRecallScreen: what are coronary arteries; what causes coronary heart disease; how does a stent work; why do heart transplant patients need immunosuppressant drugs; name one risk factor for CHD?

**Components:** `FaceTheExaminer`, `QuickRecallScreen`

---

## 3. Active learning interactions

- `VisualLearning`: CHD progression (healthy → blocked artery)
- `CinematicCarousel`: three treatment approaches
- `ExplainReveal`: how CHD develops and why it is dangerous
- `TheoryCompareBlock`: stent vs bypass vs statins
- `ConceptReveal`: valve problems and replacement options
- `MisconceptionCheck` × 2: statins cure; artificial hearts are permanent
- `SpotTheError`: stent described as a drug
- `GuidedExamResponse`: 4-mark stent vs bypass evaluation
- `FillInTheBlanksBlock`: CHD mechanism vocabulary
- `MatchingTask`: treatment → mechanism
- `FaceTheExaminer`: evaluation without risks
- `QuickRecallScreen`: 5 retrieval questions

---

## 4. Retrieval points

- CHD: fatty plaques narrow coronary arteries → less oxygen to heart muscle
- Stent: mesh tube inserted into artery to keep it open; mechanical; can re-block
- Bypass surgery: healthy blood vessel grafted to route blood around the blockage
- Statins: drug lowering blood cholesterol; slows plaque build-up; long-term management, not a cure
- Biological valves: from animal/human tissue; more natural but may deteriorate
- Mechanical valves: metal/plastic; durable but require blood-thinning medication
- Heart transplants: limited donors; immune rejection risk; immunosuppressants needed
- Artificial hearts: mechanical bridge; avoids rejection but has mechanical failure risk

---

## 5. Exam skill focus

- 4-mark evaluate: compare two treatments for CHD (advantages + disadvantages of each)
- 2-mark explain: explain how a stent treats coronary heart disease
- 1-mark recall: state one risk associated with a heart transplant
- 3-mark describe: describe what coronary heart disease is and how it develops

---

## 6. Build notes

The evaluate question (stent vs bypass vs statins) is a frequently examined higher-mark question and requires students to give advantages AND disadvantages of at least two options. The distinction between statins (drug; prevention/slowing) and stents/bypass (physical/surgical; treatment) must be taught explicitly. Artificial heart as "bridge not cure" is a commonly examined misconception. Do not bury valve replacement details — it appears as a standalone exam question.

---

## 7. Chapter completion test

- [ ] Student can explain what causes coronary heart disease (fatty deposits → narrowed coronary arteries → reduced oxygen to heart)
- [ ] Student can describe how a stent works and name one limitation
- [ ] Student can describe how bypass surgery differs from stenting
- [ ] Student can explain what statins do and why they are not a cure
- [ ] Student can state one difference between biological and mechanical replacement valves
- [ ] Student can state why heart transplant patients need immunosuppressant drugs
- [ ] Student has practised a 4-mark evaluation question with mark commentary

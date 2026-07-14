# Chapter 3: The microscope mission — Architecture

## 1. Identity (brief)

- **Chapter number:** 3
- **Title:** The microscope mission
- **Subject:** AQA GCSE Combined Science Trilogy — Biology
- **Module:** Module 1 — The living machine
- **Build status:** Not yet built

Content, Core argument, Specification requirements and the full Content reference pack: see `03_The_microscope_mission_Content.md` in this directory.

---

## 2. Architecture checklist (tailored)

### PART 1 — Situation + prediction

**Purpose:** Activate prior knowledge of the microscope; frame the practical as purposeful science, not recipe-following.

**Proposed content:**
- Hook: "Scientists in Leeuwenhoek's time could make slides but had no idea what they were looking at. Today, preparing a slide is a skill — and every step has a scientific reason."
- Prediction: "A student puts a thin slice of onion skin on a slide, adds a coverslip, and looks through the microscope. They see lots of dark circles. What do you think they are?" (air bubbles — introduced as the villain of the chapter)
- You will learn: (1) how to prepare a slide correctly; (2) why each step matters; (3) how to draw what you see scientifically; (4) how to calculate magnification from your drawing

**Suggested components:**
- `ChapterHookScreen` — prediction about air bubble circles
- `CinematicRevealMoment` — image: a badly prepared slide full of air bubbles vs a well-prepared slide with crisp cells

---

### PART 2 — Investigate the evidence

**Purpose:** Show the method in context before teaching it step by step.

**Proposed content:**
- Walk through the practical sequence cinematically: specimen → slide → stain → coverslip → microscope → drawing
- Contrast good vs bad technique at each step (correct coverslip angle vs flat; stained vs unstained; correct focus vs blur)
- Show an example biological drawing alongside a photograph of the same cells — highlight what changes (no shading, ruled labels, stated magnification)

**Suggested components:**
- `VisualLearning` — cinematic step-by-step sequence (6 beats: place sample → add stain → lower coverslip → secure on stage → focus → draw)
- `VisualNarrativeScreen` — good vs bad technique comparison at each step; could show the "before/after" of a correctly vs incorrectly prepared slide

---

### PART 3 — Discover the science

**Purpose:** Teach the why behind each step; embed the biological drawing rules.

**Proposed content:**
- Why stain? Cells are transparent without it; stain increases contrast
- Why iodine? Stains starch blue-black and makes plant cell walls and nuclei visible
- Why methylene blue? Stains nuclei for animal cells (cheek cells)
- Why 45° coverslip? Prevents trapping air bubbles
- Why start at low power? Wide field of view; avoid crashing lens into slide
- Biological drawing rules: pencil, continuous lines, no shading, ruled labels, magnification
- Total magnification = objective × eyepiece
- M = I/A from a drawing

**Suggested components:**
- `ExplainReveal` — causal chain: "transparent cell → add stain → increase contrast → see nucleus and cell wall"
- `ConceptReveal` — biological drawing rules as a set of "why" reveals (e.g. "No shading? Because biological drawings are records, not pictures.")
- `CardContainer` — one card per drawing rule with the reason behind it

---

### PART 4 — Check precision

**Purpose:** Target the most common practical exam errors.

**Proposed content:**
- Misconception: "Use high-power objective first for more detail" → FALSE (low power first)
- Misconception: "Shade the drawing to show 3D shape" → FALSE (outlines only; stippling if needed)
- SpotTheError: A student's method description — "I placed the slide on the stage, selected the highest-power objective, and used the coarse focus knob to get a sharp image." (errors: should start at lowest power; coarse focus at high power risks crashing the lens)
- OrderedRouteTask style: order the steps of the method (place sample → add stain → coverslip at 45° → secure on stage → low power → coarse focus → fine focus → draw)

**Suggested components:**
- `MisconceptionCheck` × 2 — high power first; shading in drawings
- `SpotTheError` — method description with two errors
- `OrderedRouteTask` — sequence the 7 steps of the microscope method in correct order

---

### PART 5 — Apply to a real GCSE-style task

**Purpose:** Exam-style method questions and magnification calculation.

**Proposed content:**
- Q1: "Describe how you would prepare a slide of onion skin cells to observe under a light microscope. Include why you use iodine stain and how you avoid air bubbles." (4 marks)
- Q2: "A student drew a cell 36 mm long. The actual cell was 0.04 mm long. Calculate the magnification of the drawing." (2 marks)
- Q3: "Suggest two rules a student should follow when making a biological drawing." (2 marks)
- Q4: "Suggest one way the student could improve the accuracy of their drawing." (1 mark)

**Suggested components:**
- `GuidedExamResponse` — Q1 (scaffolded 4-mark method question with step prompts)
- `ExamQuestionFrame` — Q2 (calculation) and Q3 (drawing rules)
- `FillInTheBlanksBlock` — complete the drawing rules: "Use a _____ pencil. Draw _____ continuous lines. Do not add _____. Label with _____ lines."

---

### PART 6 — Face the examiner + debrief

**Purpose:** Examiner commentary on method questions; seal with retrieval.

**Proposed content:**
- Return to opening: "Can you now explain what caused those dark circles in the first image?" (air bubbles — coverslip was placed flat)
- Examiner contrast: weak ("I added the stain and put the coverslip on") vs strong ("I added one drop of iodine stain. I then lowered the coverslip at 45° to the slide surface to prevent air bubbles forming. I secured the slide with stage clips.")
- Mark commentary: "Vague steps score 0. The examiner needs: the stain name, the 45° angle, and the air bubble prevention."
- Retrieval questions (5):
  1. What stain would you use to observe onion skin cells? Why?
  2. Why should you start with the lowest-power objective?
  3. Name two rules for making a biological drawing.
  4. A cell is drawn 54 mm long. Actual size is 0.06 mm. Calculate magnification.
  5. What is the total magnification if the eyepiece is ×10 and the objective is ×40?
- Interleave from Ch 2: "What is the maximum resolution of a light microscope?" (seeds the distinction with EM from Ch 2)

**Suggested components:**
- `FaceTheExaminer` — weak vs strong answer to the slide preparation question
- `ExaminerExplainsScreen` — "Vague steps = 0 marks. The examiner needs specifics: which stain, which angle, which lens first."
- `QuickRecallScreen` — 5 retrieval questions
- `ChapterCompleteScreen`

---

### Module Completion Test

- [ ] Students can describe the method for preparing a plant cell slide (onion skin) in correct order
- [ ] Students can describe the method for preparing an animal cell slide (cheek cell) in correct order
- [ ] Students can explain why iodine or methylene blue stain is used
- [ ] Students can explain why the coverslip is lowered at 45°
- [ ] Students can explain why the lowest-power objective is used first
- [ ] Students can state the rules for biological drawing (pencil, no shading, ruled labels, magnification)
- [ ] Students can calculate total magnification (eyepiece × objective)
- [ ] Students can apply M = I/A to find magnification of a drawing
- [ ] Students can identify errors in a given method description
- [ ] Students can suggest improvements to a practical method

---

## 3. Current state & gap analysis

Not yet built — full build from spec.

---

## 4. Build recommendations

1. **Core argument integration:** "Every step has a reason" should be the thread running through Parts 2–4. Every component reveal (ExplainReveal, CardContainer, MisconceptionCheck) should frame the technique as solution-to-problem, not arbitrary step.

2. **OrderedRouteTask priority:** Sequencing the practical steps is one of the hardest exam tasks for students — they know the steps but not the order. The ordered chain mechanic is ideal here and should be a centrepiece of Part 4.

3. **GuidedExamResponse for the 4-mark method question:** This format (Describe how you would…) is one of the most common practical question types across all of GCSE Biology. The scaffold should model: name the reagent → state what it does → name the technique → state why. Four clear numbered steps.

4. **FaceTheExaminer anchor:** Focus on the method description question — weak answers score 0 because they're too vague. The examiner commentary should be explicit: "You must name the stain, give the reason, specify the coverslip angle, name the objective, state the reason."

5. **Visual asset needed:** Microscope diagram labelled with eyepiece, objective, stage, stage clips, coarse focus, fine focus — for reference in Part 3. Also: side-by-side images of a correctly prepared slide vs one with air bubbles.

6. **Interleaving:** Part 4 retrieval should recycle Ch 2 vocabulary (resolution, magnification) and Part 6 should plant one Ch 1 question (identify the structure seen in the drawing: nucleus? cell wall?), bridging all three opening chapters.

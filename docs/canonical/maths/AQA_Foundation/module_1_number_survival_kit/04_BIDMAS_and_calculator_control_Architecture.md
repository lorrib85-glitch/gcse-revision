# Chapter 4: BIDMAS and calculator control — Architecture

## 1. Identity

- **Chapter:** 4 of 10 — Module 1 (Number survival kit)
- **Title:** BIDMAS and calculator control
- **App module id:** `maths-bidmas`
- **Subject:** AQA GCSE Maths Foundation (8300)
- **AQA spec codes:** N3, N6, N7
- **Weakness tags:** `maths:bidmas`, `maths:order-of-operations`, `maths:calculator-use`
- **MATHS_GROUPS mapping:** `maths_bidmas` — confirmed in `src/data/mathsGroups.js`
- **Series pillar:** Number sense
- **Build status:** Not yet built
- **Content file:** `04_BIDMAS_and_calculator_control_Content.md`

---

## 2. Ten-section structure mapping

### Section 1 — Hook / why this matters (1–2 screens)

**Proposed content:**
- Hook: "60 ÷ 2 + 4 = ?" — answer is 34, not 10. The wrong answer appears in AQA mark scheme notes as a specific common error.
- Exam consequence: "This topic appears in Q1–Q5 of every Paper 1 — wrong order = all subsequent marks lost in multi-step questions"
- Misconception warm-up: "3 + 4 × 5 = 35" → false; correct answer is 23

**Suggested components:**
- `ChapterHookScreen`
- `MisconceptionCheck` — 3+4×5 opening trap

---

### Section 2 — Prior knowledge check (1–2 screens)

**Proposed content:**
- Ch2: "Work out 4 × 6 + 3" (multiply before adding — baseline test of whether student already applies correct order)
- Ch3: "Work out (−3)²" (squaring negative, needed for BIDMAS with negative indices)
- Ch2: "What is 5² + 3 × 2?" (does student know √ and × before +?)

**Suggested components:**
- `QuickRecallScreen` — 3 questions; wrong answers log to `maths:four-operations` or `maths:negative-numbers`

---

### Section 3 — Core idea in simple language (2–4 screens)

**Proposed content:**
- BIDMAS/BODMAS mnemonic: B, I, D, M, A, S — in order
- Critical rule: D and M are equal priority (left to right); A and S are equal priority (left to right)
- Brackets override default order
- Powers before multiplication: 3 + 4 × 2² → indices first (4), multiply second (16), add last (19)
- Square roots and cube roots as indices: evaluated at the I step
- Reciprocals: 1/x — evaluated at the I step
- Calculator bracket entry: bracket numerators and denominators when entering fractions; bracket powers
- Estimation before calculating: round to 1 s.f.; mental calculation checks plausibility

**Suggested components:**
- `ExplainReveal` — BIDMAS step-by-step unfolding of a multi-operation expression
- `ConceptReveal` — D and M equal priority (left to right rule); 12 ÷ 4 × 3 = 9, not 1
- `ConceptReveal` — calculator entry rules: when to bracket; common bracket errors
- `VisualLearning` — estimation before calculating: 3-step process (round → calculate → compare)

---

### Section 4 — Worked example (1–2 screens)

**Proposed content:**
- "Work out 3 + 4 × 2² − (6 ÷ 3)" step by step:
  - Brackets: 6 ÷ 3 = 2
  - Indices: 2² = 4
  - Multiplication: 4 × 4 = 16
  - Addition then subtraction: 3 + 16 − 2 = 17
  - Each step shown with mark (M1 for correctly prioritising indices, M1 for correct result, A1 final)

**Suggested components:**
- `GuidedExamResponse` — expression evaluation with each BIDMAS step as a mark

---

### Section 5 — Guided practice (1–2 screens)

**Proposed content:**
- Fill in missing brackets to make 5 + 3 × 4 − 1 = 23 true: needs (5+3) × (4−1)? test several positions
- Evaluate: 2³ + √16 − 4 × 3 (= 8 + 4 − 12 = 0)
- Estimation task: estimate (4.8 × 20.3) ÷ 9.6; round to 1 s.f. → (5 × 20) ÷ 10 = 10

**Suggested components:**
- `FillInTheBlanksBlock` — bracket placement puzzle + evaluation fill-in

---

### Section 6 — Spot the trap / common mistake (1 screen)

**Proposed content:**
- Trap: "A student works out 12 ÷ 4 × 3 = 12 ÷ 12 = 1. Find and explain the error."
  - Error: student treated multiplication as higher priority than division; D and M are equal, so work left to right: 12 ÷ 4 = 3, then 3 × 3 = 9
  - This specific error appears in AQA mark scheme notes

**Suggested components:**
- `SpotTheError` — student's working for 12 ÷ 4 × 3

---

### Section 7 — Maths in the wild (1 screen)

**Proposed content:**
- Context: "A phone plan charges £(3 + 2n) per month where n is the number of extra GB of data. Use BIDMAS to find the charge for 5 extra GB." [3 + 2×5 = £13, not (3+2)×5 = £25]
- Alternative: "Check if a calculator answer of 2 is correct for (3+4)÷(5−2)." [7÷3 ≈ 2.33; answer 2 is rounded, not wrong method]

**Suggested components:**
- `ExamQuestionFrame` — calculator verification question with estimation

---

### Section 8 — Mixed retrieval (1–2 screens)

**Proposed content:**
- Ch1: "Write these in ascending order: 0.9, 0.09, 0.19, 1.9"
- Ch2: "Work out 247 × 8 (show method)"
- Ch3: "Work out (−5) × 3"

**Suggested components:**
- `QuickRecallScreen` — 3 questions; wrong answers log to respective chapter tags

---

### Section 9 — Examiner move (1–2 screens)

**Proposed content:**
- AQA-style (Paper 1): "Work out 5 + 3 × 2² − (6 ÷ 3)" — 3 marks (M1 indices, M1 multiplication, A1 final)
- AO2: "Explain why 60 ÷ 2 + 4 ≠ 10" — must explain division before addition; do NOT say "follow BIDMAS" without showing the steps
- AQA mark scheme: "oe" — full marks for any correct method that demonstrates correct order

**Suggested components:**
- `ExamQuestionFrame` — AO1 multi-step expression
- `FaceTheExaminer` — student who wrote 10 for 60÷2+4 being corrected

---

### Section 10 — Confidence check / next step (1 screen)

**Proposed content:**
- Formulae/rules: BIDMAS order (Category A — must know); perfect squares to 15²; cubes 1³–10³
- Top 3 errors: (1) addition before multiplication; (2) D and M wrong priority (left-to-right rule); (3) calculator bracket errors giving wrong magnitude
- Exam tip: "Write out each BIDMAS step on its own line — this earns M marks even if arithmetic goes wrong later"
- What comes next: Chapter 5 (Rounding) — BIDMAS errors interact with rounding; correct order = correct rounding

**Suggested components:**
- `ChapterCompleteScreen`

---

## 3. Active learning interactions

- `MisconceptionCheck`: 3+4×5 trap (Section 1)
- `ExplainReveal`: BIDMAS expression unfolding (Section 3)
- `ConceptReveal` × 2: D/M equal priority; calculator bracket rules (Section 3)
- `GuidedExamResponse`: multi-step expression with marks (Section 4)
- `FillInTheBlanksBlock`: bracket placement + expression evaluation (Section 5)
- `SpotTheError`: 12÷4×3 priority error (Section 6)
- `ExamQuestionFrame` × 2: calculator context (Section 7) + AQA expression (Section 9)
- `FaceTheExaminer`: 60÷2+4=10 correction (Section 9)
- `QuickRecallScreen` × 2

---

## 4. Retrieval points

- BIDMAS order: B before I before D/M (left to right) before A/S (left to right)
- D and M have equal priority — work left to right, not multiplication first
- Brackets override all — evaluate innermost first
- Perfect squares to 15²: 1,4,9,16,25,36,49,64,81,100,121,144,169,196,225
- Cubes: 1,8,27,64,125,216,343,512,729,1000
- Calculator: bracket numerators and denominators; always estimate first

---

## 5. Exam skill focus

- **1–2 mark BIDMAS evaluation:** multi-operation expression, write each step
- **2-mark bracket insertion:** AO3 — find brackets that make an expression equal to a given value
- **2-mark estimation:** round to 1 s.f., evaluate, compare
- **1-mark explain:** "Why is the answer not X?" — must demonstrate the correct order

---

## 6. Build notes

This is the highest-exam-frequency chapter in Module 1 (appears 7/7 papers in the frequency table). The D/M equal priority rule is the single most commonly misunderstood aspect of BIDMAS at Foundation tier. The calculator bracket entry rules are essential for Papers 2 and 3. The link to estimation (Section 7) previews Chapter 5 content.

MATHS_GROUPS: `maths_bidmas` confirmed in `mathsGroups.js` — no gap to fill.

---

## 7. Chapter completion test

- [ ] Student can state the correct order of operations (BIDMAS) in full
- [ ] Student knows D and M have equal priority — work left to right
- [ ] Student can evaluate any expression with brackets, indices, and mixed operations correctly
- [ ] Student knows perfect squares up to 15² and cubes up to 10³
- [ ] Student can estimate before calculating by rounding to 1 s.f.
- [ ] Student can enter a multi-part expression into a calculator correctly using brackets
- [ ] Student can explain why 60 ÷ 2 + 4 = 34, not 10
- [ ] Student can identify and correct the "M before D" error in a worked example
- [ ] Wrong answers log to `maths:bidmas`, `maths:order-of-operations`, or `maths:calculator-use`

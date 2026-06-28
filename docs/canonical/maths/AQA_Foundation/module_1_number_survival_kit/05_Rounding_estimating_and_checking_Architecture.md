# Chapter 5: Rounding, estimating and checking — Architecture

## 1. Identity

- **Chapter:** 5 of 10 — Module 1 (Number survival kit)
- **Title:** Rounding, estimating and checking
- **App module id:** `maths-rounding`
- **Subject:** AQA GCSE Maths Foundation (8300)
- **AQA spec codes:** N2, N14, N15
- **Weakness tags:** `maths:rounding`, `maths:significant-figures`, `maths:estimation`
- **MATHS_GROUPS mapping:** `maths_rounding` — **not yet in mathsGroups.js**; must be added before building
- **Series pillar:** Number sense
- **Build status:** Not yet built
- **Content file:** `05_Rounding_estimating_and_checking_Content.md`

---

## 2. Ten-section structure mapping

### Section 1 — Hook / why this matters (1–2 screens)

**Proposed content:**
- Hook: "You get 2 marks even if your calculation is wrong — but only if you wrote your estimate first. Here's why."
- Exam consequence: "Estimation questions appear on every paper; showing rounded values earns B marks independently of getting the final answer right"
- Misconception warm-up: "Round 0.00372 to 2 significant figures → 0.004" → false trap

**Suggested components:**
- `ChapterHookScreen` — mark scheme evidence hook (estimation earns B marks independently)
- `MisconceptionCheck` — significant figures warm-up trap

---

### Section 2 — Prior knowledge check (1–2 screens)

**Proposed content:**
- Ch1: "What is the value of the 4 in 24,862?" (place value — needed to identify rounding column)
- Ch4: "Estimate 4.8 × 10 mentally" (×10 decimal shift — connects to rounding mechanics)
- Ch2: "Round 247 to the nearest 10" (baseline rounding check)

**Suggested components:**
- `QuickRecallScreen` — 3 questions; wrong answers log to `maths:place-value`

---

### Section 3 — Core idea in simple language (2–4 screens)

**Proposed content:**
- Rounding to 10/100/1000: identify column, look right, apply ≥5 rule
- Rounding to d.p.: count digits after decimal point, look at next, apply rule
- Significant figures: first non-zero digit = 1st s.f.; leading zeros are NOT significant; trailing zeros before decimal point CAN be significant
- Estimation: round ALL values to 1 s.f., then calculate mentally; this earns B marks independently
- Error intervals (rounding): lower = value − half the rounding unit; upper = value + half the rounding unit (strict <)
- Error intervals (truncation): lower = truncated value; upper = truncated value + rounding unit (strict <)
- "Do NOT round early": AQA penalises premature rounding by 1 mark

**Suggested components:**
- `ExplainReveal` — step-by-step rounding: identify column, look right, apply rule
- `ConceptReveal` — significant figures: what counts and what doesn't (diagram of 0.00372)
- `TheoryCompareBlock` — rounding vs truncation; error interval differences
- `ConceptReveal` — error interval notation: ≤ vs < explained

---

### Section 4 — Worked example (1–2 screens)

**Proposed content:**
- AQA-style estimation: "Estimate the value of (31.4 × 18.6) ÷ (5.1 × 1.9). Show your working."
  - Step 1: round each value to 1 s.f.: 30 × 20 = 600 (top); 5 × 2 = 10 (bottom)
  - Step 2: 600 ÷ 10 = 60
  - Marks: B1 for each rounded value (×4 possible), B1 for correct method using those values, A1 for 60
  - Key teaching point: showing the B1 rounded values is what earns the marks — estimate alone without showing rounded values often loses 1 mark

**Suggested components:**
- `GuidedExamResponse` — estimation question with marks-per-step breakdown

---

### Section 5 — Guided practice (1–2 screens)

**Proposed content:**
- "Round 0.005846 to 3 significant figures" (answer: 0.00585)
- "Round 24,862 to 3 significant figures" (answer: 24,900)
- "Estimate: (8.9 × 3.1) ÷ 1.95 ≈ ?" (round all to 1 s.f.: 9 × 3 ÷ 2 = 13.5 ≈ 14)

**Suggested components:**
- `FillInTheBlanksBlock` — 5 rounding and estimation blanks

---

### Section 6 — Spot the trap / common mistake (1 screen)

**Proposed content:**
- Trap: "A student writes the error interval for l = 8 cm (nearest cm) as 7.5 ≤ l ≤ 8.5"
  - Error: 8.5 rounds up to 9, so 8.5 is not in the range for 8 — upper bound must be strict: 7.5 ≤ l < 8.5

**Suggested components:**
- `SpotTheError` — error interval with incorrect upper bound

---

### Section 7 — Maths in the wild (1 screen)

**Proposed content:**
- Context: "A manufacturer makes bolts measuring 12 mm to the nearest mm. State the range of acceptable lengths."
  - Error interval: 11.5 ≤ l < 12.5
  - Real application: quality control — bolts outside this range are rejected

**Suggested components:**
- `ExamQuestionFrame` — manufacturing quality control error interval question

---

### Section 8 — Mixed retrieval (1–2 screens)

**Proposed content:**
- Ch4: "Work out 3² + 4 × 2 − (6 ÷ 2)" (BIDMAS — estimated during Ch5 Section 3)
- Ch3: "Work out (−4) × 3"
- Ch1: "Order: 0.45, 0.405, 0.54, 0.504 — smallest first"

**Suggested components:**
- `QuickRecallScreen` — 3 retrieval questions from Ch1–Ch4

---

### Section 9 — Examiner move (1–2 screens)

**Proposed content:**
- AQA-style: "A length l is measured as 3.7 cm to 1 d.p. Write the error interval for l." — answer: 3.65 ≤ l < 3.75
- AO2: "A student rounds 0.00562 to 3 s.f. and gets 0.006. Explain the error." — must state that 5 is the 1st s.f., 6 is 2nd, 2 is 3rd; 4th digit is not ≥ 5; answer should be 0.00562 → 0.00562 (already 3 s.f.) → student miscounted leading zeros

**Suggested components:**
- `ExamQuestionFrame` — error interval question with mark scheme
- `FaceTheExaminer` — significant figures annotation

---

### Section 10 — Confidence check / next step (1 screen)

**Proposed content:**
- Top 3 errors: (1) including leading zeros in s.f. count; (2) upper bound ≤ instead of < in error interval; (3) rounding intermediate steps (AQA penalises this)
- Exam tip: "Always show your rounded values for estimation questions — each rounded value earns its own B mark"
- What comes next: Chapter 6 (Factors/primes) — rounding and estimation skills used to check prime factorisation results

**Suggested components:**
- `ChapterCompleteScreen`

---

## 3. Active learning interactions

- `MisconceptionCheck`: s.f. warm-up (Section 1)
- `ExplainReveal`: rounding steps (Section 3)
- `ConceptReveal` × 2: s.f. definition; error interval ≤ vs < (Section 3)
- `TheoryCompareBlock`: rounding vs truncation (Section 3)
- `GuidedExamResponse`: estimation with marks (Section 4)
- `FillInTheBlanksBlock`: 5 rounding/estimation blanks (Section 5)
- `SpotTheError`: error interval upper bound (Section 6)
- `ExamQuestionFrame` × 2: manufacturing context (Section 7) + error interval (Section 9)
- `FaceTheExaminer`: s.f. miscounting (Section 9)
- `QuickRecallScreen` × 2

---

## 4. Retrieval points

- Rounding: look at digit after required position; ≥5 round up, <5 keep
- Significant figures: count from first non-zero digit; leading zeros don't count
- Estimation: round ALL values to 1 s.f. BEFORE calculating; show rounded values
- Error interval (rounding): lower ≤ x < upper (upper is strict <)
- Error interval (truncation): lower ≤ x < (lower + unit) — both truncation direction makes lower the truncated value
- Do not round at intermediate steps

---

## 5. Exam skill focus

- **1-mark rounding:** round a number to stated d.p. or s.f.
- **2–3-mark estimation:** show rounded values (B marks) and calculate
- **2-mark error interval:** write inequality notation with correct bounds

---

## 6. Build notes

The biggest teaching win in this chapter is showing students that estimation earns B marks independently of getting the answer right. This reframes the skill from "secondary" to "essential". The error interval upper bound (strict <) is the most common source of mark loss on these questions. The truncation distinction rarely appears but is in the spec and worth one screen.

MATHS_GROUPS: `maths_rounding` does not yet exist in `mathsGroups.js` — must be added before this chapter is built.

---

## 7. Chapter completion test

- [ ] Student can round any number to a given number of decimal places
- [ ] Student can round any number to a given number of significant figures
- [ ] Student can correctly identify the 1st significant figure in a small decimal (e.g. 0.00372)
- [ ] Student can estimate a calculation by rounding all values to 1 s.f.
- [ ] Student knows to show rounded values explicitly (each earns a B mark)
- [ ] Student can write a correct error interval using ≤ (lower) and < (upper)
- [ ] Student can distinguish between rounding and truncation error intervals
- [ ] Student knows NOT to round at intermediate steps
- [ ] Wrong answers log to `maths:rounding`, `maths:significant-figures`, or `maths:estimation`

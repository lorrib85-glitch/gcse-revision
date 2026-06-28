# Chapter 7: Powers, roots and standard form — Architecture

## 1. Identity

- **Chapter:** 7 of 10 — Module 1 (Number survival kit)
- **Title:** Powers, roots and standard form
- **App module id:** `maths-powers-standard-form`
- **Subject:** AQA GCSE Maths Foundation (8300)
- **AQA spec codes:** N6, N7, N9
- **Weakness tags:** `maths:indices`, `maths:standard-form`, `maths:powers-roots`
- **MATHS_GROUPS mapping:** `maths_indices` — confirmed in `src/data/mathsGroups.js`
- **Series pillar:** Number sense
- **Build status:** Not yet built
- **Content file:** `07_Powers_roots_and_standard_form_Content.md`

---

## 2. Ten-section structure mapping

### Section 1 — Hook / why this matters (1–2 screens)

**Proposed content:**
- Hook: "The Sun is 149,600,000,000 metres from Earth. Scientists write this as 1.496 × 10¹¹. Your calculator writes it as 1.496E11. If you don't understand standard form, you'll misread your calculator — every time."
- Exam consequence: "Standard form appears on 5/7 papers; indices appear on 7/7 papers (as part of BIDMAS and prime factorisation)"
- Misconception warm-up: "12 × 10⁴ is in standard form" → false trap

**Suggested components:**
- `ChapterHookScreen` — science context hook (large/small numbers)
- `MisconceptionCheck` — "A must be between 1 and 10" warm-up

---

### Section 2 — Prior knowledge check (1–2 screens)

**Proposed content:**
- Ch6: "Write 60 as a product of prime factors in index form" (prime factorisation uses index notation)
- Ch4: "Work out 2⁴" (basic power recall — BIDMAS chapter prerequisite)
- Ch1: "How many zeros in 10⁶?" (powers of 10 = number of zeros awareness)

**Suggested components:**
- `QuickRecallScreen` — 3 questions; wrong answers log to `maths:prime-factorisation` or `maths:bidmas`

---

### Section 3 — Core idea in simple language (2–4 screens)

**Proposed content:**
- Perfect squares and cubes: recall tables (must know); square roots and cube roots as inverses
- Powers of 2 (1–1024), powers of 3 (1–243), powers of 10 (10⁰ = 1 through 10⁶)
- Index laws: multiply (add indices), divide (subtract indices), power of power (multiply indices) — only when same base
- Standard form definition: A × 10ⁿ; 1 ≤ A < 10; n is any integer (positive or negative)
- Converting large numbers: move decimal left until A is between 1 and 10; count moves = n (positive)
- Converting small numbers: move decimal right until A is between 1 and 10; count moves = n (negative)
- Calculator display: 1.23E5 = 1.23 × 10⁵; negative exponent display for small numbers
- Standard form arithmetic: multiply A parts and add n parts; check A is still between 1 and 10

**Suggested components:**
- `ConceptReveal` — standard form conversion: large to small with decimal counting animation
- `TheoryCompareBlock` — large number (positive n) vs small number (negative n) in standard form
- `ExplainReveal` — index laws: one law per screen beat (multiply, divide, power-of-power)
- `VisualLearning` — calculator display interpretation

---

### Section 4 — Worked example (1–2 screens)

**Proposed content:**
- "Work out 80,000,000 ÷ 200. Give your answer in standard form."
  - Method 1 (arithmetic): 80,000,000 ÷ 200 = 400,000 = 4 × 10⁵
  - Method 2 (standard form): (8 × 10⁷) ÷ (2 × 10²) = 4 × 10⁷⁻² = 4 × 10⁵
  - Common error: 4 × 10⁶ (off by one power) — mark scheme: M1 for method; A1 for 4 × 10⁵

**Suggested components:**
- `GuidedExamResponse` — standard form division with both methods shown

---

### Section 5 — Guided practice (1–2 screens)

**Proposed content:**
- "Write 0.000037 in standard form" (answer: 3.7 × 10⁻⁵)
- "Write 4.2 × 10³ as an ordinary number" (answer: 4200)
- "Work out (3 × 10⁴) × (2 × 10³) in standard form" (answer: 6 × 10⁷)
- "Work out √225" (answer: 15 — must know perfect squares)

**Suggested components:**
- `FillInTheBlanksBlock` — standard form conversion + calculation blanks

---

### Section 6 — Spot the trap / common mistake (1 screen)

**Proposed content:**
- Trap: "A student converts 149,600,000 to standard form and writes 14.96 × 10⁷."
  - Error: A = 14.96 is NOT between 1 and 10; must adjust: 1.496 × 10⁸
  - Rule: if A ≥ 10 after calculation, divide A by 10 and add 1 to n

**Suggested components:**
- `SpotTheError` — student's standard form where A > 10

---

### Section 7 — Maths in the wild (1 screen)

**Proposed content:**
- Context: "A bacterium is approximately 3 × 10⁻⁶ m in diameter. A human hair is approximately 7 × 10⁻⁵ m wide. How many times wider is the hair than the bacterium?"
  - (7 × 10⁻⁵) ÷ (3 × 10⁻⁶) = (7 ÷ 3) × 10⁻⁵⁻(⁻⁶) = 2.33 × 10¹ ≈ 23 times wider

**Suggested components:**
- `ExamQuestionFrame` — science context standard form division

---

### Section 8 — Mixed retrieval (1–2 screens)

**Proposed content:**
- Ch6: "Find the HCF of 36 and 48"
- Ch5: "Round 3.465 to 2 decimal places"
- Ch4: "Work out 2³ × 2⁴" (index law preview/consolidation)

**Suggested components:**
- `QuickRecallScreen` — 3 questions from Ch4–Ch6

---

### Section 9 — Examiner move (1–2 screens)

**Proposed content:**
- AQA Paper 1 style: "Simplify 8 × 2⁶ × 2⁴, giving your answer as a power of 2." — 8 = 2³; 2³ × 2⁶ × 2⁴ = 2¹³
- AO2: "Explain why 12 × 10⁴ is not written in standard form, and write it correctly." — because A = 12 > 10; 12 × 10⁴ = 1.2 × 10⁵
- Standard form frequency on papers: 5/7 in non-calculator paper; "give answer in standard form" is a 1-mark instruction after a calculation

**Suggested components:**
- `ExamQuestionFrame` — index law question + standard form correction
- `FaceTheExaminer` — student who wrote 12 × 10⁴ being walked through A < 10 rule

---

### Section 10 — Confidence check / next step (1 screen)

**Proposed content:**
- Formulae: perfect squares to 15²; cubes to 10³; standard form definition (1 ≤ A < 10); index laws
- Top 3 errors: (1) A ≥ 10 in standard form answer; (2) power of 10 off by one (÷200 → n decreases by 2 not by 1); (3) √(a+b) ≠ √a + √b
- Exam tip: "After any standard form calculation, always check: is 1 ≤ A < 10? If not, adjust."
- What comes next: Chapter 8 (Fractions) — index work links to exact fraction calculations; standard form links to scientific contexts in Module 3

**Suggested components:**
- `ChapterCompleteScreen`

---

## 3. Active learning interactions

- `MisconceptionCheck`: "12 × 10⁴ is standard form" trap (Section 1)
- `ConceptReveal`: standard form conversion animation (Section 3)
- `TheoryCompareBlock`: large vs small number standard form (Section 3)
- `ExplainReveal`: index laws (Section 3)
- `GuidedExamResponse`: standard form division example (Section 4)
- `FillInTheBlanksBlock`: conversion + calculation blanks (Section 5)
- `SpotTheError`: A > 10 in standard form (Section 6)
- `ExamQuestionFrame` × 2: science context (Section 7) + index law/standard form (Section 9)
- `FaceTheExaminer`: A > 10 annotation (Section 9)
- `QuickRecallScreen` × 2

---

## 4. Retrieval points

- Perfect squares (1–225, i.e. 1²–15²) and cubes (1–1000, i.e. 1³–10³) — must know
- Standard form: A × 10ⁿ; 1 ≤ A < 10; n positive for large, negative for small
- Converting: count places decimal moves; direction determines sign of n
- Index law — multiply same base: add indices; divide: subtract; power of power: multiply
- Calculator: E notation = × 10^; negative E = small number (still positive)

---

## 5. Exam skill focus

- **1-mark recall:** √n or ∛n for perfect squares/cubes
- **1–2-mark standard form conversion:** large or small number ↔ standard form
- **2-mark calculation:** standard form arithmetic; give answer in standard form
- **2-mark index law:** simplify expression as a power of a given base

---

## 6. Build notes

The single most important teaching point is "A must be between 1 and 10" — this is where the most marks are dropped. The distinction between large (positive n) and small (negative n) standard form numbers needs concrete examples. The calculator notation E is not always explained to students and should be explicitly covered.

---

## 7. Chapter completion test

- [ ] Student can recall all perfect squares from 1² to 15² and all cubes from 1³ to 10³
- [ ] Student can convert any large or small number to standard form correctly (1 ≤ A < 10)
- [ ] Student can convert from standard form back to an ordinary number
- [ ] Student can apply index laws (multiply, divide, power of power) with the same base
- [ ] Student knows calculator E notation = × 10ⁿ
- [ ] Student can perform multiplication and division in standard form
- [ ] Student can explain why A ≥ 10 makes a result "not in standard form" and can correct it
- [ ] Wrong answers log to `maths:indices`, `maths:standard-form`, or `maths:powers-roots`

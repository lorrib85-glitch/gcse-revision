# Chapter 3: Negative numbers without panic — Architecture

## 1. Identity

- **Chapter:** 3 of 10 — Module 1 (Number survival kit)
- **Title:** Negative numbers without panic
- **App module id:** `maths-negative-numbers`
- **Subject:** AQA GCSE Maths Foundation (8300)
- **AQA spec codes:** N1, N2
- **Weakness tags:** `maths:negative-numbers`, `maths:ordering-negatives`
- **MATHS_GROUPS mapping:** none (GAP — no group exists for negative numbers; tags route to this chapter)
- **Series pillar:** Number sense
- **Build status:** Not yet built
- **Content file:** `03_Negative_numbers_without_panic_Content.md`

---

## 2. Ten-section structure mapping

### Section 1 — Hook / why this matters (1–2 screens)

**Purpose:** Establish relevance and exam stakes.

**Proposed content:**
- Hook: "(−3) × (−2) = ?" — most students answer −6. It's +6. This distinction appears every paper.
- Exam consequence: "Negative number errors appear in calculation questions, coordinates, sequences and temperature problems — one sign error costs the accuracy mark."
- Misconception warm-up: "(−3) × (−2) = −6" → false

**Suggested components:**
- `ChapterHookScreen` — cinematic hook: temperature/debt contrast
- `MisconceptionCheck` — sign rule warm-up trap

---

### Section 2 — Prior knowledge check (1–2 screens)

**Purpose:** Surface prerequisite gaps.

**Proposed content:**
- Ch1: Order these on a number line: −4, 2, 0, −1 (ordering negatives)
- Ch2: What is 8 × 3? (multiplication fluency — needed for signed multiplication)
- Ch1: Write the correct symbol: −3 __ 1

**Suggested components:**
- `QuickRecallScreen` — 3 questions; wrong answers log to `maths:ordering-numbers` (Ch1) or `maths:four-operations` (Ch2)

---

### Section 3 — Core idea in simple language (2–4 screens)

**Purpose:** Teach the GCSE content from first principles.

**Proposed content:**
- Ordering negatives: number line model; −10 is further left than −2 so −10 < −2
- Adding a negative: a + (−b) = a − b (move left)
- Subtracting a negative: a − (−b) = a + b (double negative flips to addition; move right)
- Multiplying/dividing sign rules: same sign → positive; different signs → negative
- Squaring a negative: (−4)² = +16; contrast with −4² = −16 (brackets matter)
- Real context: temperature change 11 − (−6) = 17°C rise; bank overdraft −£200 + £350 = £150

**Suggested components:**
- `VisualLearning` — animated number line: moving left for subtraction, right for double-negative flip
- `TheoryCompareBlock` — four sign rule combinations with examples
- `ConceptReveal` — (−4)² vs −4²: brackets change everything
- `ExplainReveal` — temperature rise: setting up 11 − (−6) correctly

---

### Section 4 — Worked example (1–2 screens)

**Purpose:** AQA-quality walkthrough.

**Proposed content:**
- "At midnight it is −6°C. By noon it is 11°C. What is the rise in temperature?"
  - Setup: rise = 11 − (−6)
  - Double negative rule: 11 − (−6) = 11 + 6 = 17
  - Mark: M1 for setting up 11 − (−6) or 11 + 6; A1 for 17
- Second example (non-calculator multiplication): "Work out (−3) × (−4)"
  - Sign rule: negative × negative = positive
  - Magnitude: 3 × 4 = 12
  - Answer: +12 (or just 12)

**Suggested components:**
- `GuidedExamResponse` — temperature question with marks shown

---

### Section 5 — Guided practice (1–2 screens)

**Purpose:** Student attempts with scaffolding.

**Proposed content:**
- Fill in: −3 × __ = 12 (answer: −4)
- Fill in: 5 − (−8) = __ (answer: 13)
- Fill in: (−6)² = __ (answer: 36, not −36)
- Fill in: −6² = __ (answer: −36)

**Suggested components:**
- `FillInTheBlanksBlock` — 6 signed arithmetic blanks with bracket examples

---

### Section 6 — Spot the trap / common mistake (1 screen)

**Purpose:** Identify the most dangerous error.

**Proposed content:**
- Trap: "A student writes: (−8)² = −64. Find and correct the error."
  - Error: squaring a negative gives positive; (−8)² = (−8) × (−8) = +64
  - Contrast with −8² = −(8²) = −64 (valid interpretation without brackets)
  - This is a genuine AQA trap: mark schemes often have SC1 for students who write −64 for (−8)²

**Suggested components:**
- `SpotTheError` — annotated student working with brackets misconception

---

### Section 7 — Maths in the wild (1 screen)

**Purpose:** Real-life application.

**Proposed content:**
- Context: "A company's quarterly profits are: −£2400, −£1800, +£950, +£3200. Find the total profit across all four quarters."
  - Total = −2400 + (−1800) + 950 + 3200 = −4200 + 4150 = −£50 (net loss)
  - Or: positives = 4150; negatives = 4200; net = 4150 − 4200 = −50

**Suggested components:**
- `ExamQuestionFrame` — 3-mark finance context question with mark scheme

---

### Section 8 — Mixed retrieval (1–2 screens)

**Purpose:** 2–4 questions from earlier chapters.

**Proposed content:**
- Ch1: Order from smallest: −4.5, −4, −4.05, 0
- Ch2: Work out 248 × 7
- Ch1: Write a number between −3 and −2

**Suggested components:**
- `QuickRecallScreen` — 3 questions; wrong answers log to `maths:place-value` (Ch1) or `maths:four-operations` (Ch2)

---

### Section 9 — Examiner move (1–2 screens)

**Purpose:** Show how this skill appears in AQA questions.

**Proposed content:**
- AQA-style: "Work out (−3)² + 2 × (−4)" — tests both squaring negative (= 9) and sign rule for multiplication (= −8); total = 1; tests BIDMAS × Chapter 4 link
- AO2: "Explain why (−5)² is not equal to −25." — requires precise reasoning about bracket scope
- Mark scheme note: (−3)² = 9 is B1; 2 × (−4) = −8 is M1; 9 + (−8) = 1 is A1

**Suggested components:**
- `ExamQuestionFrame` — AO1+AO2 combined question
- `FaceTheExaminer` — student who wrote −25 for (−5)² being corrected step by step

---

### Section 10 — Confidence check / next step (1 screen)

**Proposed content:**
- Formulae: sign rules (category A — must know): same sign → +; different signs → −
- Top 3 errors: (1) (−a)² gives negative answer; (2) a − (−b) treated as a − b; (3) ordering negatives by magnitude rather than position
- Exam tip: "When squaring a negative, always write out (−a) × (−a) = +a². The brackets protect you."
- What comes next: Chapter 4 (BIDMAS) — order of operations with powers and brackets; negatives appear there too

**Suggested components:**
- `ChapterCompleteScreen`

---

## 3. Active learning interactions

- `MisconceptionCheck`: sign rule warm-up (Section 1)
- `VisualLearning`: number line movement (Section 3)
- `TheoryCompareBlock`: four sign-rule combinations (Section 3)
- `GuidedExamResponse`: temperature question (Section 4)
- `FillInTheBlanksBlock`: 6 signed arithmetic blanks (Section 5)
- `SpotTheError`: (−8)² misconception (Section 6)
- `ExamQuestionFrame` × 2: finance context (Section 7) + exam-style question (Section 9)
- `FaceTheExaminer`: (−5)² = −25 annotation (Section 9)
- `QuickRecallScreen` × 2: prior knowledge (Section 2) + mixed retrieval (Section 8)

---

## 4. Retrieval points

- On a number line: larger magnitude negative = further left = smaller value
- a + (−b) = a − b (move left); a − (−b) = a + b (double negative; move right)
- Sign rules: same → positive; different → negative
- (−a)² = positive; −a² = negative — brackets change the answer
- Temperature rise: larger_temp − smaller_temp, including substituting negative lower bound
- Squaring a negative: always positive (not a mistake, a rule)

---

## 5. Exam skill focus

- **1-mark sign rule:** work out a single multiplication or division involving negatives
- **1-mark ordering:** order negatives correctly on a number line
- **2-mark temperature/context:** set up and solve a rise/fall calculation with a negative
- **1-mark explain:** "Explain why (−a)² ≠ −a²" — requires precise language about brackets

---

## 6. Build notes

The sign-rule misconception "(−a)² = −a²" is worth two dedicated screens (the theoryCompare in Section 3 and the SpotTheError in Section 6). The temperature context in Section 7 is the most exam-frequent application. The preview of coordinates (movement with negatives) should be briefly mentioned in Section 10 as a forward link to Module 3 Ch1.

No MATHS_GROUPS group exists for negative numbers. Tags `maths:negative-numbers` and `maths:ordering-negatives` need `src/data/tagModuleMap.js` entries before building.

---

## 7. Chapter completion test

- [ ] Student can order negative integers and decimals correctly on a number line
- [ ] Student can add and subtract with negative numbers using the double-negative rule
- [ ] Student knows the four sign rules for multiplication and division
- [ ] Student can correctly evaluate (−a)² as positive and distinguish from −a²
- [ ] Student can set up and solve a temperature rise/fall problem involving negatives
- [ ] Student can solve a finance problem involving negative balances
- [ ] Student can write an explanation of why (−5)² ≠ −25 in precise language
- [ ] Wrong answers log to `maths:negative-numbers` or `maths:ordering-negatives`

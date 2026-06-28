# Chapter 2: The four operations — Architecture

## 1. Identity

- **Chapter:** 2 of 10 — Module 1 (Number survival kit)
- **Title:** The four operations
- **App module id:** `maths-four-operations`
- **Subject:** AQA GCSE Maths Foundation (8300)
- **AQA spec codes:** N2, N3
- **Weakness tags:** `maths:four-operations`, `maths:written-methods`
- **MATHS_GROUPS mapping:** `maths_bidmas` (partial — N3 order of operations; BIDMAS gets its own chapter Ch4)
- **Series pillar:** Number sense
- **Build status:** Not yet built
- **Content file:** `02_The_four_operations_Content.md`

---

## 2. Ten-section structure mapping

### Section 1 — Hook / why this matters (1–2 screens)

**Purpose:** Establish relevance and exam stakes. Surface a common misconception as a warm-up trap.

**Proposed content:**
- Hook: "Paper 1 is non-calculator. You have 90 minutes. Can you multiply 47 × 38 without a calculator in under 90 seconds?" — urgency + stakes
- Exam consequence: "Nearly every Paper 1 question involves at least one of the four operations. Method marks only exist if you show working."
- Series pillar: Number sense — fluency here is the engine for every calculation in every topic
- Misconception warm-up: "Multiplying a decimal by 10 just adds a zero" → false trap

**Suggested components:**
- `ChapterHookScreen` — cinematic hook with the Paper 1 non-calculator framing
- `MisconceptionCheck` — decimal multiplication misconception

---

### Section 2 — Prior knowledge check (1–2 screens)

**Purpose:** Surface prerequisite gaps.

**Proposed content:**
- Times tables recall: 7 × 8, 12 × 9, 6 × 7 (baseline fluency check)
- "What is 400 + 276?" (basic addition, checks column understanding from Ch1)
- "Which column does the 3 go in for 4,302?" (Ch1 place value — prerequisite for column methods)

**Suggested components:**
- `QuickRecallScreen` — 3–4 questions; wrong answers log to `maths:times-tables` or `maths:place-value`

---

### Section 3 — Core idea in simple language (2–4 screens)

**Purpose:** Teach formal written methods.

**Proposed content:**
- Column addition: digit alignment by place value; carrying
- Column subtraction: borrowing; always check with inverse (answer + smaller = larger)
- Column multiplication: multiply each digit of bottom number by each digit of top; shift one column left for tens
- Short division: work left to right; carry remainders
- Decimal operations: align decimal points (add/subtract); ignore decimal then reinsert (multiply); count sig figs; convert to integer problem (divide)
- Choosing methods: mental vs written vs calculator (Paper 1 = no calculator)
- Inverse operations as check: subtraction checks addition; division checks multiplication

**Suggested components:**
- `ExplainReveal` — step-by-step column addition with carry animation
- `ExplainReveal` — step-by-step column multiplication (two stages: partial products)
- `ConceptReveal` — decimal point alignment rule; "×10 shifts every digit left"
- `TheoryCompareBlock` — mental vs written methods: when to use which

---

### Section 4 — Worked example (1–2 screens)

**Purpose:** Slow-motion AQA-quality walkthrough.

**Proposed content:**
- AQA-style multi-step cost problem: "400g of cereal at 49p per 100g; 250g of pasta at 14p per 100g. Find total cost in £."
  - Step 1: cereal cost = 4 × 49 = 196p
  - Step 2: pasta cost = 2.5 × 14 = 35p (or 250/100 × 14)
  - Step 3: total = 196 + 35 = 231p = £2.31
  - Marks: M1 for each correct multiplication; A1 for sub-totals; A1 final in £
- Emphasise: showing method earns M marks even if arithmetic is wrong

**Suggested components:**
- `GuidedExamResponse` — 4-mark cost problem with step-by-step marks

---

### Section 5 — Guided practice (1–2 screens)

**Purpose:** Student practises with scaffolding visible.

**Proposed content:**
- Column multiplication: 47 × 38 — blanks for partial products
- Column division: 462 ÷ 6 — blanks for each remainder step
- Decimal addition: 3.4 + 0.06 — decimal point alignment scaffold

**Suggested components:**
- `FillInTheBlanksBlock` — guided column multiplication with blanks for carries and partial products

---

### Section 6 — Spot the trap / common mistake (1 screen)

**Purpose:** Identify the most dangerous mark-losing error.

**Proposed content:**
- Trap: "Work out 3.4 + 0.06 = 3.46" (answer placed as if 34 + 06 = 40, but wrong alignment)
  - Error: decimal points not aligned — 3.40 + 0.06 = 3.46 ✓ (actually correct here)
  - Better trap: 3.4 + 2.15 — students write 3.4 + 2.15 = 5.55 (wrong; should be 3.40 + 2.15 = 5.55 — actually this IS right)
  - Best trap: "4.8 × 10 = 4.80" (correct digits, but student added a zero rather than shifting the decimal)
  - Stated error: 4.8 × 10 = 4.80 (says "just adds a zero") → correct answer is 48 (the decimal shifts left)

**Suggested components:**
- `SpotTheError` — student's working for decimal × 10 showing "add zero" error

---

### Section 7 — Maths in the wild (1 screen)

**Purpose:** Real-life application of the four operations.

**Proposed content:**
- Context: "A shop buys 12 items for £3.60 each and sells them at £5.25 each. Find the total profit."
  - Cost: 12 × £3.60 = £43.20; Revenue: 12 × £5.25 = £63.00; Profit = £63.00 − £43.20 = £19.80
  - Vocabulary used: cost price, selling price, profit

**Suggested components:**
- `ExamQuestionFrame` — 3-mark profit context question with mark scheme reveal

---

### Section 8 — Mixed retrieval (1–2 screens)

**Purpose:** 2–4 questions from earlier chapters.

**Proposed content:**
- Ch1: "Order these from smallest: 2.4, 2.04, 24, 0.24" — place value ordering
- Ch1: "Write the correct symbol between: −2 __ 0" — inequality review
- (Pre-course) "What is 8 × 7?" — times table fluency

**Suggested components:**
- `QuickRecallScreen` — 3 retrieval questions; wrong answers log to `maths:place-value`

---

### Section 9 — Examiner move (1–2 screens)

**Purpose:** Show exactly how this skill appears in AQA questions.

**Proposed content:**
- AQA-style: "Show that 13 × 14 = 182" — written method required; answer alone = 0 marks
- AO2: "Using inverse operations, show that 624 − 438 = 186 is correct" — student uses 186 + 438 = 624
- Mark scheme note: "show that" questions — B1 for showing a correct method; the given answer confirms whether it's right, student must demonstrate the working
- Mark scheme note: ft marks survive arithmetic errors if method is correct

**Suggested components:**
- `ExamQuestionFrame` — "show that" style question (Jun24 Paper 1 Q1 pattern)
- `FaceTheExaminer` — annotated student response that wrote only the answer to a "show that" question, marking it 0

---

### Section 10 — Confidence check / next step (1 screen)

**Purpose:** Close with key facts and next chapter link.

**Proposed content:**
- Formulae required: none for this chapter (operations are tools, not formulae)
- Top 3 errors: (1) not aligning decimal points in column addition/subtraction; (2) forgetting to carry in column multiplication; (3) writing answer-only on "show that" questions (= 0 marks)
- Exam tip: "Write every step of your method. Even if your answer is wrong, correct method earns M marks."
- What comes next: Chapter 3 (Negative numbers) — applies the four operations to negative values

**Suggested components:**
- `ChapterCompleteScreen` — summary with error list and exam tip

---

## 3. Active learning interactions

- `MisconceptionCheck`: decimal × 10 trap (Section 1)
- `ExplainReveal` × 2: column addition, column multiplication (Section 3)
- `GuidedExamResponse`: 4-mark cost problem worked example (Section 4)
- `FillInTheBlanksBlock`: column multiplication guided practice (Section 5)
- `SpotTheError`: decimal multiplication error (Section 6)
- `ExamQuestionFrame` × 2: profit context (Section 7) + "show that" (Section 9)
- `FaceTheExaminer`: 0-mark "show that" annotation (Section 9)
- `QuickRecallScreen` × 2: prior knowledge (Section 2) + mixed retrieval (Section 8)

---

## 4. Retrieval points

- Column addition: align by place value; carry when column exceeds 9
- Column subtraction: borrow from next column; check with inverse
- Column multiplication: multiply each digit pair; shift left for tens; add partial products
- Short division: work left to right; carry remainders
- Decimal operations: align decimal points for +/−; count decimal places for ×
- ×10: shifts all digits one place left (NOT just adds a zero)
- Inverse: subtraction ↔ addition; division ↔ multiplication
- "Show that" questions: working is mandatory; answer alone = 0

---

## 5. Exam skill focus

- **1–2 mark calculation:** standard column arithmetic, shown method
- **3–4 mark multi-step context:** cost/change/profit; each step visible
- **2-mark "show that":** must display full method; answer-only is 0 marks
- **2-mark inverse check:** show that A − B = C using B + C = A

---

## 6. Build notes

The most important teaching moment in this chapter is the "show that" problem — Foundation students routinely lose 2 marks per paper by writing only a final answer. The inverse operations check (Section 9) directly teaches exam technique. The decimal × 10 misconception is worth a dedicated spot-the-error screen because it also causes errors in Chapter 5 (rounding, shifting decimal) and throughout Modules 2–4.

---

## 7. Chapter completion test

- [ ] Student can add and subtract multi-digit integers using column methods with carries/borrows
- [ ] Student can multiply a 2-digit number by a 2-digit number using column multiplication
- [ ] Student can divide a 3-digit number by a single digit using short division
- [ ] Student knows decimal points must align in column addition and subtraction
- [ ] Student can multiply a decimal by 10, 100, 1000 by shifting digits (not adding zeros)
- [ ] Student can use inverse operations to check their answers
- [ ] Student knows "show that" questions require full working — answer alone scores 0
- [ ] Student can solve a 3–4-mark multi-step cost/profit problem, showing each step
- [ ] Wrong answers log to `maths:four-operations` or `maths:written-methods`

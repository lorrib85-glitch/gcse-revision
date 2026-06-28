# Chapter 1: Place value and number sense — Architecture

## 1. Identity

- **Chapter:** 1 of 10 — Module 1 (Number survival kit)
- **Title:** Place value and number sense
- **App module id:** `maths-place-value`
- **Subject:** AQA GCSE Maths Foundation (8300)
- **AQA spec codes:** N1, N2
- **Weakness tags:** `maths:place-value`, `maths:ordering-numbers`
- **MATHS_GROUPS mapping:** none (GAP — no matching group in mathsGroups.js; tags serve as routing)
- **Series pillar:** Number sense
- **Build status:** Not yet built
- **Content file:** `01_Place_value_and_number_sense_Content.md`

---

## 2. Ten-section structure mapping

Architecture source: `docs/canonical/maths/AQA_Foundation/00_AQA_Foundation_Architecture.md`

### Section 1 — Hook / why this matters (1–2 screens)

**Purpose:** Establish relevance and exam stakes. Surface a common misconception as a warm-up trap.

**Proposed content:**
- Opening hook: "Two numbers, same digits, completely different values — is 0.35 bigger or smaller than 0.3?"
- Exam consequence statement: "Place value errors appear in Q1 of almost every paper and cascade into every subsequent calculation"
- Series pillar anchor: Number sense — the foundation every other topic builds on
- Misconception warm-up: "0.9 is smaller than 0.19 because 9 < 19" → false trap

**Suggested components:**
- `ChapterHookScreen` — cinematic hook with the digit-position reveal
- `MisconceptionCheck` — one warm-up trap (decimal ordering misconception)

---

### Section 2 — Prior knowledge check (1–2 screens)

**Purpose:** Surface prerequisite gaps before new content is introduced.

**Proposed content:**
- Count back from 10 to −5 on a number line (baseline negative awareness)
- Identify the tens digit in 4,302 (place value column reading)
- Order single-digit whole numbers (entry-level baseline)

**Suggested components:**
- `QuickRecallScreen` — 3 questions drawing on pre-GCSE number knowledge

**Rules:** Questions must draw on prior knowledge, not Chapter 1 content itself. Wrong answers log to a general `maths:number-basics` tag.

---

### Section 3 — Core idea in simple language (2–4 screens)

**Purpose:** Teach the GCSE content from first principles.

**Proposed content:**
- Place value columns: millions | HTh | TTh | Th | H | T | U | . | tenths | hundredths | thousandths
- Why zero is a placeholder (4,302 vs 432 — completely different numbers)
- Ordering decimals method: align decimal points, compare column by column from left
- Ordering negatives: draw a number line; negative numbers with larger magnitude are further left = smaller
- Inequality symbols: =, ≠, <, >, ≤, ≥ — precise meaning of each; ≤ and ≥ include equality
- Number line placement: proportional positioning between anchor points

**Suggested components:**
- `VisualLearning` — animated place value column demonstration (digit drops into column)
- `ConceptReveal` — ordering decimals method (align → compare left to right)
- `TheoryCompareBlock` — positive vs negative number line; why −10 < −2
- `GraphView` — number line screen with plotted examples

---

### Section 4 — Worked example (1–2 screens)

**Purpose:** Slow-motion walkthrough of one exam-quality problem.

**Proposed content:**
- Worked example: "Write these in order, smallest first: 0.35, 0.09, 0.4, 0.3"
  - Step 1: write all with equal decimal places — 0.35, 0.09, 0.40, 0.30
  - Step 2: compare tenths column: 0 < 3 < 4; 0.09 smallest, then compare 0.30 vs 0.35
  - Step 3: answer — 0.09, 0.30, 0.35, 0.40 (write without trailing zeros: 0.09, 0.3, 0.35, 0.4)
  - Mark: B1 for each correct position (4 marks total); one error usually loses 1 mark only

**Suggested components:**
- `GuidedExamResponse` — step-by-step ordering worked example with marks shown

---

### Section 5 — Guided practice (1–2 screens)

**Purpose:** Student attempts a similar problem with scaffolding visible.

**Proposed content:**
- Order: −3, 1.5, −0.5, 2, −1 on a number line (negatives + decimals combined)
- Fill in symbol: 4.07 __ 4.7 (hundredths vs tenths trap)
- Place 0.07 on a number line from 0 to 1 (requires recognising 0.07 < 0.1)

**Suggested components:**
- `FillInTheBlanksBlock` — inequality symbol completion (5–6 statements)

---

### Section 6 — Spot the trap / common mistake (1 screen)

**Purpose:** Identify and name the most dangerous mark-losing error.

**Proposed content:**
- Trap: "These are in order smallest to largest: 0.3, 0.19, 0.35, 0.4"
  - Error: 0.19 placed after 0.3 because "19 > 3" (ignoring decimal alignment)
  - Student must identify the error and correct it
- AQA mark scheme note: this exact error appears when students compare digit strings not aligned values

**Suggested components:**
- `SpotTheError` — student identifies which number is incorrectly placed and why

---

### Section 7 — Maths in the wild (1 screen)

**Purpose:** Real-life application of place value and ordering.

**Proposed content:**
- Context: Four overnight temperatures — −8°C, 3°C, −1°C, 5°C
- Task: "Order these temperatures from coldest to warmest. Explain why −8°C is colder than −1°C."
- Connection: same skill as ordering numbers on a number line; negatives with larger magnitude = colder

**Suggested components:**
- `ExamQuestionFrame` — 2-mark AQA-style temperature ordering question with mark scheme reveal

---

### Section 8 — Mixed retrieval (1–2 screens)

**Purpose:** 2–4 questions from earlier chapters (this is Chapter 1, so retrieval draws on pre-course knowledge).

**Proposed content:**
- What is the value of the digit 7 in 4,702? (place value reading)
- Write 3,040 in words (reading large integers)
- Which is larger: 2/5 or 0.5? (foreshadows Chapter 10 FDP; pre-knowledge expected)

**Suggested components:**
- `QuickRecallScreen` — 3 retrieval questions; wrong answers log to `maths:place-value`

---

### Section 9 — Examiner move (1–2 screens)

**Purpose:** Show exactly how this skill appears in AQA questions.

**Proposed content:**
- Past-paper style: "Write the correct symbol, < or >, between each pair: 4.7 __ 4.69; −3 __ −5; 0.3 __ 0.30" (1 mark each)
- AO2 task: "Sam says 0.25 > 0.3 because 25 > 3. Explain the error Sam has made." (1 mark — must reference decimal alignment or column comparison)
- Mark scheme notes: symbol-only answers OK for the comparison questions; explanation must be mathematically precise

**Suggested components:**
- `ExamQuestionFrame` — AQA-style multi-part question with mark scheme
- `FaceTheExaminer` — annotation of a student's incorrect explanation with improvement guidance

---

### Section 10 — Confidence check / next step (1 screen)

**Purpose:** Metacognitive close. Key facts summary. What comes next.

**Proposed content:**
- Formulae required: none for this chapter (Category A/B both empty)
- Three most common errors: (1) comparing digits not aligned values in decimal ordering; (2) −3 > −1 because 3 > 1; (3) using ≤ when < is needed
- Exam tip: "Always write all decimals to the same number of decimal places before comparing — add trailing zeros if needed"
- Past papers: ordering/place value appears in Q1–Q3 of almost every Paper 1 (Jun24 Q1–2 involve place value and calculation)
- What comes next: Chapter 2 (The four operations) — place value underpins column methods

**Suggested components:**
- `ChapterCompleteScreen` — summary with formula card, error list, exam tip

---

## 3. Active learning interactions

- `MisconceptionCheck`: decimal ordering trap warm-up (Section 1)
- `GuidedExamResponse`: ordering worked example with marks shown (Section 4)
- `FillInTheBlanksBlock`: inequality symbol practice (Section 5)
- `SpotTheError`: misplaced decimal in an ordered list (Section 6)
- `ExamQuestionFrame`: temperature context AQA question (Section 7) + inequality paper question (Section 9)
- `FaceTheExaminer`: student explanation annotation (Section 9)
- `QuickRecallScreen` × 2: prior knowledge check (Section 2) + mixed retrieval (Section 8)

---

## 4. Retrieval points

- Place value columns: millions through to thousandths
- Why zero is a placeholder — removing it changes the number
- Ordering decimals: align decimal points; compare column by column from left
- Ordering negatives: larger magnitude = further left on number line = smaller value
- Inequality symbols: ≠ means not equal; ≤ includes equality; < does not
- Number line: negatives extend to the left of zero; proportional placement

---

## 5. Exam skill focus

- **1-mark comparison:** choose the correct symbol (< or >) between two values — decimal trap common
- **1–2-mark ordering:** write 4–5 numbers in ascending or descending order
- **1-mark number line:** plot a value at the correct position
- **1-mark explain:** "Explain why [X] is greater/less than [Y]" — requires column-level reasoning
- **2-mark context ordering:** temperature / finance / measurement ordering in a scenario

---

## 6. Build notes

This chapter is the gateway to all other Module 1 content — every calculation depends on knowing which column a digit occupies. The decimal misconception ("0.19 > 0.3 because 19 > 3") is one of the most persistent errors in Foundation tier papers and should be the centrepiece of the misconception work. The temperature context in Section 7 is the most natural real-world hook for negative number ordering and previews Chapter 3.

MATHS_GROUPS gap: no `maths_place_value` group exists. Tags `maths:place-value` and `maths:ordering-numbers` must be added to `src/data/tagModuleMap.js` before building — they route WeakSpotRecovery to this chapter.

---

## 7. Chapter completion test

- [ ] Student can identify the value of any digit in a number up to 7 digits
- [ ] Student can identify the value of any digit in a decimal number to 3 decimal places
- [ ] Student can correctly order 5+ decimals including cases where digit strings are misleading
- [ ] Student can order positive and negative integers and decimals on a number line
- [ ] Student can write the correct inequality symbol (=, ≠, <, >, ≤, ≥) between any two values
- [ ] Student knows ≤ includes the possibility of being equal; < does not
- [ ] Student can explain in words why −8 < −1 (not just state it)
- [ ] Student can place a decimal value (e.g. 0.07) accurately on a number line
- [ ] Student has practised at least one AQA exam question with mark scheme feedback
- [ ] Wrong answers log to `maths:place-value` or `maths:ordering-numbers` in `unifiedWeaknessTracker.js`

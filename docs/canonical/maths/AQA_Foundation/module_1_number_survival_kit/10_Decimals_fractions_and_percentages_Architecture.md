# Chapter 10: Decimals, fractions and percentages — Architecture

## 1. Identity

- **Chapter:** 10 of 10 — Module 1 (Number survival kit)
- **Title:** Decimals, fractions and percentages
- **App module id:** `maths-fdp`
- **Subject:** AQA GCSE Maths Foundation (8300)
- **AQA spec codes:** N10, N12, R9
- **Weakness tags:** `maths:fdp-conversion`, `maths:percentage-of-amount`, `maths:percentage-comparison`
- **MATHS_GROUPS mapping:** `maths_fractions` (partial) + `maths_percentages` (partial) — both confirmed in `src/data/mathsGroups.js`
- **Series pillar:** Number sense
- **Build status:** Not yet built
- **Content file:** `10_Decimals_fractions_and_percentages_Content.md`
- **Special note:** This is the Module 1 diagnostic checkpoint — spine recommends a diagnostic exercise after Ch10 before the student proceeds to Module 2.

---

## 2. Ten-section structure mapping

### Section 1 — Hook / why this matters (1–2 screens)

**Proposed content:**
- Hook: "35%, 7/20, and 0.35 are three names for exactly the same thing. The examiner switches between them to test whether you understand what you're actually measuring — or whether you're just pattern-matching."
- Exam consequence: "FDP conversion and percentage of amount appear in 6/7 recent papers; 'which is greater?' questions (AO2) require conversion to a common form — students who can't convert freely drop 2 marks per question"
- Misconception warm-up: "0.4 = 4%" → false trap (dividing by 10 instead of multiplying by 100)

**Suggested components:**
- `ChapterHookScreen`
- `MisconceptionCheck` — "0.4 = 4%" warm-up

---

### Section 2 — Prior knowledge check (1–2 screens)

**Proposed content:**
- Ch1: "What is the place value of the 5 in 0.35?" (place value — underpins decimal→fraction conversion)
- Ch8: "Simplify 35/100" — HCF=5 → 7/20 (simplifying fractions — needed for decimal→fraction)
- Ch2: "Work out 0.35 × 240" (decimal multiplication — multiplier method for % of amount)

**Suggested components:**
- `QuickRecallScreen` — 3 questions; wrong answers log to `maths:place-value`, `maths:simplifying-fractions`, or `maths:four-operations`

---

### Section 3 — Core idea in simple language (2–4 screens)

**Proposed content:**
- Key equivalents table (must memorise — 15 entries): 1/2=0.5=50%; 1/4=0.25=25%; 3/4=0.75=75%; 1/5–4/5; 1/10, 3/10, 7/10; 1/100; 1/3≈0.333=33⅓%; 2/3≈0.666=66⅔%; 1/8=0.125=12.5%; 3/8=0.375=37.5%
- Fraction → decimal: divide numerator by denominator (bus-stop division on Paper 1)
- Decimal → fraction: place value denominator (0.35 = 35/100; 0.625 = 625/1000); simplify
- Percentage → decimal: divide by 100 (move decimal left 2 places)
- Decimal → percentage: multiply by 100 (move decimal right 2 places)
- Percentage → fraction: write /100 and simplify
- Ordering FDP values: convert all to decimal form, then compare
- Percentage of an amount: multiplier method — 35% of 240 = 0.35 × 240 = 84; OR build-up method (10% first)
- Express as percentage: (part ÷ whole) × 100

**Suggested components:**
- `ConceptReveal` — the six FDP conversion arrows: which direction, which operation
- `TheoryCompareBlock` — multiplier method vs build-up method for percentage of amount
- `ExplainReveal` — decimal→fraction: place value denominator (0.625 → 625/1000 → 5/8)
- `VisualLearning` — key equivalents table as a memorisation reference

---

### Section 4 — Worked example (1–2 screens)

**Proposed content:**
- "Which is greater: 2/5 or 0.45? Show your working." (AQA Jun24 style — 2 marks)
  - 2/5 = 0.40; 0.45 > 0.40 so 0.45 is greater
  - Marks: M1 for converting 2/5 to 0.4 (or equivalent); A1 for correct comparison with reasoning
- "Find 35% of 240." (2 marks)
  - Multiplier method: 0.35 × 240 = 84 (M1 for 0.35 × 240 seen; A1 for 84)
  - Build-up: 10% = 24; 30% = 72; 5% = 12; 35% = 72 + 12 = 84

**Suggested components:**
- `GuidedExamResponse` — FDP comparison + percentage of amount, both methods shown

---

### Section 5 — Guided practice (1–2 screens)

**Proposed content:**
- "Write 0.625 as a fraction in its simplest form" — 625/1000 = 5/8 (HCF=125)
- "Write 13/20 as a percentage" — 13/20 × 100 = 65%
- "Write in order, smallest first: 3/5, 0.65, 55%" — convert: 0.6, 0.65, 0.55 → 55%, 3/5, 0.65
- "Express 54 as a percentage of 80" — (54/80) × 100 = 67.5%

**Suggested components:**
- `FillInTheBlanksBlock` — decimal→fraction + percentage ordering + express as percentage blanks

---

### Section 6 — Spot the trap / common mistake (1 screen)

**Proposed content:**
- Trap: "A student works out 40% of 80 = 40 × 80 = 3200."
  - Error: 40% ≠ 40; 40% = 0.40; 0.40 × 80 = 32; OR 10% = 8, 40% = 4 × 8 = 32
  - Rule: percentage must FIRST be converted to a decimal multiplier (÷100) before multiplying
- Secondary trap: "A student writes 35% as the decimal 3.5 instead of 0.35."
  - Error: divide by 100 (2 places), not 10 (1 place); 35% → 0.35, not 3.5

**Suggested components:**
- `SpotTheError` — percentage of amount where student uses percentage directly as a multiplier

---

### Section 7 — Maths in the wild (1 screen)

**Proposed content:**
- Context: "A jacket costs £85. It has a 20% discount in the sale. What is the sale price?"
  - 20% of £85 = 0.20 × 85 = £17 discount; sale price = £85 − £17 = £68
  - OR: 80% of £85 = 0.80 × 85 = £68 (multiplier method for reduced price)
- Context: "A student scores 24 out of 32 in a test. Express this as a percentage." — (24/32) × 100 = 75%

**Suggested components:**
- `ExamQuestionFrame` — discount context (percentage of amount) + test score context (express as percentage)

---

### Section 8 — Mixed retrieval (1–2 screens)

**Proposed content:**
- Ch9: "Work out 3/4 ÷ 3/8" (fraction division — previous chapter)
- Ch7: "Write 0.0000052 in standard form" — 5.2 × 10⁻⁶
- Ch8: "Write 2¾ as an improper fraction" — 11/4

**Suggested components:**
- `QuickRecallScreen` — 3 questions from Ch7–Ch9

---

### Section 9 — Examiner move (1–2 screens)

**Proposed content:**
- AQA context problem (Jun24 style — 3 marks): "Shona has 14 dresses. 50% are red. She gives 5 to charity and buys 1 new red dress. What percentage of her dresses are now red?"
  - Original red: 50% of 14 = 7; after: total = 14 − 5 + 1 = 10; red = 7 + 1 = 8; percentage = (8/10) × 100 = 80%
  - Key trap: must recalculate total (students who use 14 as total get 57.1% — M1 only)
- AQA wording: "35% and 20% — attempt to convert each to a percentage — B1 for conversion attempt; oe fraction, decimal, percentage" (from Jun24 mark scheme)
- Mark scheme pattern: "oe" — any valid equivalent form accepted unless specific form required

**Suggested components:**
- `ExamQuestionFrame` — 3-mark FDP context update problem (Shona's dresses)
- `FaceTheExaminer` — student who forgot to update the total (14 vs 10)

---

### Section 10 — Confidence check / next step (1 screen)

**Proposed content:**
- Formulae: key equivalents table (15 entries); percentage → decimal = ÷100; decimal → percentage = ×100; fraction → decimal = numerator ÷ denominator; % of amount = multiplier × amount; express as % = (part/whole) × 100
- Top 3 errors: (1) 40% of 80 = 3200 (using % directly as multiplier); (2) 35% → decimal = 3.5 not 0.35 (÷10 not ÷100); (3) forgetting to update totals in context problems
- Exam tip: "When converting percentage to decimal, always divide by 100 — that's two decimal places left, never one."
- Module 1 completion: "You've finished the Number Survival Kit. Before Module 2, check your key equivalents table — these come up in every module from here on."
- What comes next: Module 2 starts with algebra; FDP connects directly to ratio, proportion and probability

**Suggested components:**
- `ChapterCompleteScreen` — with Module 1 completion milestone

---

## 3. Active learning interactions

- `MisconceptionCheck`: "0.4 = 4%" warm-up (Section 1)
- `ConceptReveal`: six FDP conversion arrows (Section 3)
- `TheoryCompareBlock`: multiplier vs build-up method (Section 3)
- `ExplainReveal`: decimal→fraction via place value (Section 3)
- `VisualLearning`: key equivalents table (Section 3)
- `GuidedExamResponse`: FDP comparison + percentage of amount (Section 4)
- `FillInTheBlanksBlock`: conversion + ordering + express as % blanks (Section 5)
- `SpotTheError`: percentage used directly as multiplier (Section 6)
- `ExamQuestionFrame` × 2: discount/test score contexts (Section 7) + Shona's dresses (Section 9)
- `FaceTheExaminer`: updated total omission (Section 9)
- `QuickRecallScreen` × 2

---

## 4. Retrieval points

- Key equivalents: 15 entries — must be instant recall (no calculation needed)
- % → decimal: ÷100; decimal → %: ×100
- Fraction → decimal: numerator ÷ denominator (bus-stop division)
- Decimal → fraction: place value denominator (1 d.p. → /10; 2 d.p. → /100; 3 d.p. → /1000); simplify
- Ordering FDP: convert all to decimal; compare
- % of amount: convert % to decimal (multiplier); multiply
- Express as %: (part ÷ whole) × 100

---

## 5. Exam skill focus

- **1-mark recall:** key equivalents — no calculation; instant recognition
- **1–2-mark conversion:** "Write [fraction/decimal/percentage] as a [fraction/decimal/percentage]"
- **2-mark ordering FDP:** M1 for converting to common form; A1 for correct order
- **2-mark % of amount:** M1 for correct multiplier method seen; A1 for correct answer
- **2-mark express as %:** M1 for (part/whole) × 100; A1 for correct percentage
- **3-mark context update:** M1 for initial calculation; M1 for updated total; A1 for final percentage

---

## 6. Build notes

This chapter is the Module 1 diagnostic checkpoint. The Section 10 screen should explicitly mark Module 1 as complete and signal that the key equivalents table is a permanent reference for all future modules. The most important teaching point is the direction of the conversion (×100 vs ÷100) — a mnemonic or visual arrow diagram should be central to Section 3. The "Shona's dresses" style context update problem (Section 9) is the most complex question type here and must make the "recalculate total" step unmistakable, as this is the most common mark-loss pattern on AQA papers.

---

## 7. Chapter completion test

- [ ] Student can recall all 15 key FDP equivalents without calculation
- [ ] Student can convert between all six FDP directions (fraction↔decimal, decimal↔%, %↔fraction)
- [ ] Student knows decimal → % = ×100; % → decimal = ÷100 (two places, not one)
- [ ] Student can convert a terminating decimal to a fraction using place value and simplify
- [ ] Student can order any mixed set of FDP values by converting to decimals
- [ ] Student can find any percentage of an amount using the multiplier method
- [ ] Student can express one quantity as a percentage of another using (part/whole) × 100
- [ ] Student knows to recalculate the total in context problems before computing a percentage
- [ ] Wrong answers log to `maths:fdp-conversion`, `maths:percentage-of-amount`, or `maths:percentage-comparison`

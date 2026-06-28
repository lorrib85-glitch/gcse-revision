# Chapter 5: Rounding, estimating and checking — Content

## Series: AQA GCSE Maths Foundation — Module 1: Number survival kit

---

## Big question

Why is a "wrong" answer worth 2 marks in AQA maths — and how do you guarantee at least 1 of those marks when your calculation goes wrong?

---

## AQA syllabus coverage

**Spec codes: N2, N14, N15**

- Rounding to the nearest 10, 100, 1000 (N14)
- Rounding to a given number of decimal places (d.p.) (N14)
- Rounding to a given number of significant figures (s.f.) (N14)
- Estimation by rounding (typically to 1 s.f.) and approximate calculation (N14)
- Checking answers by estimation (N14)
- Error intervals due to rounding — inequality notation: e.g. 3.5 ≤ x < 4.5 for x = 4 rounded to nearest integer (N15)
- Truncation and error intervals due to truncation (N15)
- Do NOT round during intermediate steps of a calculation (N14)

---

## Key concepts and vocabulary

- **Rounding:** replacing a number with a nearby, simpler number; direction depends on the digit after the rounding position
- **Round up:** if the digit after the rounding position is 5 or more, increase the rounded digit by 1
- **Round down:** if the digit after the rounding position is 4 or less, keep the rounded digit the same
- **Decimal places (d.p.):** the number of digits after the decimal point; rounding to 2 d.p. means keeping tenths and hundredths
- **Significant figures (s.f.):** the number of meaningful digits starting from the first non-zero digit
  - 0.00372 rounded to 2 s.f. = 0.0037; the leading zeros are NOT significant
  - 24,800 to 3 s.f. = 24,800 (or 2.48 × 10⁴ in standard form — same value)
- **Estimation:** an approximate calculation, usually performed by rounding every number to 1 s.f., to check whether an exact answer is plausible
- **Truncation:** cutting off digits beyond a certain position *without* rounding (always rounds down regardless of the next digit)
  - e.g. truncate 4.79 to 1 d.p. = 4.7 (NOT 4.8)
- **Error interval:** the range of values that, when rounded/truncated to a given accuracy, give a stated value
  - If x = 4 rounded to nearest integer: 3.5 ≤ x < 4.5 (4.5 rounds up to 5, so 4.5 is excluded)
  - If x = 4 truncated to nearest integer: 4 ≤ x < 5 (4.0, 4.1, ..., 4.9 all truncate to 4)
- **Inequality notation for error intervals:** use ≤ for the lower bound (included), < for the upper bound (excluded for rounding)

---

## Prerequisite knowledge

- **Chapter 1:** Place value — knowing which column to round to
- **Chapter 2:** Four operations — estimating requires simplified calculation
- **Chapter 4:** BIDMAS — do not round during intermediate steps

---

## Required methods

### Rounding to nearest 10, 100, 1000
1. Identify the position to round to
2. Look at the digit immediately to the right
3. If ≥ 5: round up (increase the rounding digit by 1); if < 5: keep the rounding digit
4. Replace all digits to the right of the rounding position with zeros

**Examples:**
- 4,762 to nearest 100: look at tens digit (6 ≥ 5): round up → 4,800
- 4,732 to nearest 100: look at tens digit (3 < 5): round down → 4,700

### Rounding to decimal places
1. Count the number of digits after the decimal point needed
2. Look at the next digit
3. If ≥ 5: round up; if < 5: keep
4. Drop all subsequent digits

**Examples:**
- 3.476 to 2 d.p.: look at third decimal (6 ≥ 5) → 3.48
- 3.472 to 2 d.p.: look at third decimal (2 < 5) → 3.47

### Rounding to significant figures
1. Find the first non-zero digit — this is the 1st significant figure
2. Count the required number of significant figures
3. Apply the ≥5/< 5 rule to the next digit
4. Replace subsequent digits with zeros (for integers) or drop (for decimals)

**Examples:**
- 0.004726 to 3 s.f.: 1st s.f. = 4 (position 4 after decimal); 2nd = 7; 3rd = 2; 4th = 6 ≥ 5 → round up → 0.00473
- 24,862 to 3 s.f.: 1st s.f. = 2; 2nd = 4; 3rd = 8; next = 6 ≥ 5 → round 8 up to 9 → 24,900 (no change to leading digits)

### Estimation
1. Round each number to 1 s.f.
2. Perform the simplified calculation mentally
3. Report the estimate (usually to 1 s.f.)
4. Compare to exact answer — if very different, check the calculation

**Example:** (4.83 × 21.7) ÷ 9.2 ≈ (5 × 20) ÷ 10 = 100 ÷ 10 = 10

### Error intervals
- **Rounding to nearest integer:** if rounded value = n, then n − 0.5 ≤ x < n + 0.5
  - Rounded to 1 d.p.: lower bound = −0.05, upper bound = +0.05 (exclusive)
  - Rounded to nearest 10: lower − 5, upper +5 (exclusive)
- **Truncation to nearest integer:** if truncated value = n, then n ≤ x < n + 1

---

## Likely misconceptions (from mark schemes and research)

- **MISCONCEPTION:** Rounding 31.47 to 1 s.f. as 3. Correction: 1st s.f. is 3 (tens column); look at next digit (1 < 5), keep: 30, not 3.
- **MISCONCEPTION:** "0.00372 rounded to 2 s.f. = 0.004 (2 digits total)." Correction: significant figures count from the first non-zero digit; 0.00372 to 2 s.f. = 0.0037 (3 and 7 are the first two significant figures).
- **MISCONCEPTION:** Rounding 31 to 30 but then using 18 → 20 and 30 × 20 = 600 instead of being consistent (rounding both). Correction: for estimation, round ALL values (both 31 → 30 and 18 → 20); in the AQA mark scheme: B1 for correct rounding of numerator, B1 for correct rounding of denominator, B1 for correct calculation from their rounded values.
- **MISCONCEPTION:** Error interval for x = 5 rounded to nearest integer is 4.5 ≤ x ≤ 5.5 (including 5.5). Correction: 5.5 would round up to 6, so it is excluded; upper bound uses strict inequality: 4.5 ≤ x < 5.5.
- **MISCONCEPTION:** Truncation rounds up: truncating 4.79 to 1 d.p. gives 4.8. Correction: truncation always discards digits beyond the required position regardless of what they are; 4.79 truncated to 1 d.p. = 4.7.
- **MISCONCEPTION:** Rounding at intermediate steps. Correction: AQA states "Rounding off too early can lead to inaccuracy in the final answer. This should be penalised by 1 mark."

---

## Exam angles (from AQA past papers)

**How N14/N15 appears in Paper 1 (non-calculator):**

1. **Rounding instruction (1 mark):** "Round 3.4762 to 2 decimal places" — tests basic rounding; answer 3.48
2. **Significant figures (1–2 marks):** "Write 24,862 to 3 significant figures" — answer 24,900; common error: 24,800 (rounds down when digit is 6)
3. **Estimation question (2–3 marks):** "Estimate the value of (31.4 × 18.6) ÷ (5.1 × 1.9). Show your estimate." — B1 for each rounded value (31→30, 19→20, 5→5, 2→2); M1 for using those values; A1 for final estimate (30×20)÷(5×2) = 600÷10 = 60
4. **"Is the answer reasonable?" (2 marks):** "A student says 4.79 × 20.3 ÷ 9.76 ≈ 10. Is this reasonable? Show your working." — AO2; estimate first then evaluate
5. **Error interval (2 marks):** "A length, l cm, is measured as 8 cm rounded to the nearest cm. Write the error interval for l." — answer: 7.5 ≤ l < 8.5
6. **Truncation error interval (2 marks):** "A number n is truncated to 1 decimal place to give 3.4. Write the error interval." — answer: 3.4 ≤ n < 3.5

**AQA wording patterns:**
- "Estimate the value of" — rounding to 1 s.f. expected; "Show your estimate" means show the rounded values
- "Give your answer correct to [n] decimal places / significant figures" — standard follow-on instruction
- "Write the error interval for" — requires inequality notation; upper bound is strict (<), lower bound is inclusive (≤)

**Mark scheme patterns:**
- Estimation: each correctly rounded value often gets its own B1 mark — showing the rounding is worth marks
- Error intervals: B1 for correct lower bound; B1 for correct upper bound; independent marks

---

## Maths in the wild — context bank

- **Shopping estimate:** "Estimate the total cost of 3 items at £4.79, £7.32 and £2.95" → round to £5, £7, £3 = £15
- **Science measurement:** "A rod is measured as 12 cm to the nearest cm. Write the range of possible actual lengths." → error interval 11.5 ≤ l < 12.5
- **Population:** "The population of a town is 24,862. Give this to 3 significant figures." → 24,900
- **Travel time:** "A journey takes approximately 47 minutes. Estimate to nearest 10 minutes." → 50 minutes
- **Newspaper stat:** "A study had 3,824 participants, rounded to the nearest 100. What is the error interval?" → 3,750 ≤ n < 3,850

---

## Formulae status

- **Category A (must memorise):** rounding rules; error interval structure (n − half ≤ x < n + half for rounding)
- **Category B (given in exam):** none for this chapter

---

## Sourcing notes

- **AQA8300SP2015.txt:** N14 and N15 definitions confirm error intervals, estimation, rounding to d.p. and s.f.
- **AQA83001FMSJUN24.txt:** "Rounding off too early can lead to inaccuracy in the final answer. This should be penalised by 1 mark." — verbatim general marking principle; applies to this chapter
- **Series Content file:** estimation misconceptions, error interval upper-bound exclusion, truncation confirmed

## Build status

**Not built.** No content file exists. Target content file: `src/content/maths/maths-rounding.js`.  
App module id: `maths-rounding`. Chapter is M1 Ch5 in the 40-chapter spine.  
MATHS_GROUPS: `maths_rounding` — **not yet in mathsGroups.js**; must be added before building.

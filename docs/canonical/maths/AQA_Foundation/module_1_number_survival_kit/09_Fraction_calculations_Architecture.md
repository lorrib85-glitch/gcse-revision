# Chapter 9: Fraction calculations — Architecture

## 1. Identity

- **Chapter:** 9 of 10 — Module 1 (Number survival kit)
- **Title:** Fraction calculations
- **App module id:** `maths-fraction-calculations`
- **Subject:** AQA GCSE Maths Foundation (8300)
- **AQA spec codes:** N2, N8
- **Weakness tags:** `maths:fraction-add-sub`, `maths:fraction-multiply-divide`, `maths:mixed-number-calculations`
- **MATHS_GROUPS mapping:** `maths_fractions` — confirmed in `src/data/mathsGroups.js`
- **Series pillar:** Number sense
- **Build status:** Not yet built
- **Content file:** `09_Fraction_calculations_Content.md`

---

## 2. Ten-section structure mapping

### Section 1 — Hook / why this matters (1–2 screens)

**Proposed content:**
- Hook: "Why does dividing by 1/2 give you twice as much? Because you're asking 'how many halves fit?' — and flip-and-multiply is the fastest way to answer that without drawing dozens of rectangles."
- Exam consequence: "Fraction calculation questions score 4 marks on Paper 1 (no calculator) and appear in 5/7 recent sittings — mixed number division is the highest-value fraction question type"
- Misconception warm-up: "1/3 + 1/4 = 2/7" → false trap (adding denominators)

**Suggested components:**
- `ChapterHookScreen`
- `MisconceptionCheck` — "add the denominators" warm-up

---

### Section 2 — Prior knowledge check (1–2 screens)

**Proposed content:**
- Ch8: "Write 2⅓ as an improper fraction" (converting mixed numbers — essential prerequisite for division)
- Ch6: "Find the LCM of 4 and 6" (common denominator for addition)
- Ch8: "Simplify 35/12" (or "Write 35/12 as a mixed number") — simplifying after calculation

**Suggested components:**
- `QuickRecallScreen` — 3 questions; wrong answers log to `maths:mixed-numbers` or `maths:hcf-lcm`

---

### Section 3 — Core idea in simple language (2–4 screens)

**Proposed content:**
- Adding and subtracting fractions: must have a common denominator; only numerators are added/subtracted; denominator is NEVER added or subtracted
- Common denominator method: find LCM of denominators; scale each fraction; add/subtract numerators; simplify
- Multiplying fractions: no common denominator needed; numerator × numerator; denominator × denominator; cross-cancel before multiplying to keep numbers small
- Dividing fractions: Keep-Change-Flip (Keep first fraction; Change ÷ to ×; Flip second fraction); then multiply
- Mixed numbers in calculations: ALWAYS convert to improper fraction first — never apply operations directly to the whole-number and fraction parts separately when multiplying or dividing
- Exact answers: when AQA says "exact answer" or "leave as a fraction", the answer is a fraction — NOT a rounded decimal

**Suggested components:**
- `ExplainReveal` — adding fractions: common denominator step-by-step (3/4 + 5/6 → 9/12 + 10/12 = 19/12)
- `ConceptReveal` — Keep-Change-Flip (KCF) for division: why flipping the divisor works
- `TheoryCompareBlock` — adding (needs common denominator) vs multiplying (no common denominator needed)
- `VisualLearning` — mixed number division: convert first, then KCF, then simplify

---

### Section 4 — Worked example (1–2 screens)

**Proposed content:**
- "Work out 2⅓ ÷ 4/5. Give your answer as a mixed number." (from AQA Nov21 — 4 marks)
  - Step 1: Convert 2⅓ to improper: (2×3)+1 = 7 → 7/3 (M1)
  - Step 2: Keep-Change-Flip: 7/3 ÷ 4/5 = 7/3 × 5/4 (M1)
  - Step 3: Multiply: 35/12 (A1)
  - Step 4: Convert to mixed number: 35÷12=2 remainder 11 → 2 and 11/12 (B1)
  - Mark scheme note (verbatim Nov21): "1 (=35/12) final answer is the improper fraction = M1A1B0" — B mark is only for the mixed number form

**Suggested components:**
- `GuidedExamResponse` — 4-mark mixed number division with per-step mark annotation

---

### Section 5 — Guided practice (1–2 screens)

**Proposed content:**
- "Work out 11/18 − 1/3. Give your answer in simplest form." — common denominator 18: 11/18 − 6/18 = 5/18
- "Work out 4/9 × 3/8" — cross-cancel: 4÷4=1, 8÷4=2; 3÷3=1, 9÷3=3 → 1/6
- "Work out 3/4 ÷ 3/8" — KCF: 3/4 × 8/3 = 24/12 = 2

**Suggested components:**
- `FillInTheBlanksBlock` — subtraction with common denominator + multiplication with cross-cancelling blanks

---

### Section 6 — Spot the trap / common mistake (1 screen)

**Proposed content:**
- Trap: "A student works out 2⅓ ÷ 4/5 by dividing the whole number (2÷4) and the fraction (1/3÷5) separately."
  - Error: mixed number MUST be converted to improper fraction before dividing; working with parts separately gives a wrong answer and M0 in the mark scheme
  - Rule: improper fraction conversion is M1 — it's worth a mark on its own; skip it and you lose both M1 and A1
- Secondary trap: "Inverting the wrong fraction: student writes 3/4 ÷ 2/5 = 4/3 × 2/5"
  - Error: flip the SECOND fraction (the divisor), not the first

**Suggested components:**
- `SpotTheError` — mixed number division without converting first

---

### Section 7 — Maths in the wild (1 screen)

**Proposed content:**
- Context: "How many 3/4-hour revision sessions fit into 3⅓ hours?"
  - 3⅓ ÷ 3/4 = 10/3 ÷ 3/4 = 10/3 × 4/3 = 40/9 = 4 and 4/9 sessions
  - Real-world resonance: timetabling — not a full 5th session fits, which raises the remainder question
- Context: "Sam eats 3/4 of a pizza. He shares 2/3 of his portion with Beth. What fraction of the whole pizza does Beth eat?" — 2/3 × 3/4 = 6/12 = 1/2

**Suggested components:**
- `ExamQuestionFrame` — division in time context + multiplication in sharing context

---

### Section 8 — Mixed retrieval (1–2 screens)

**Proposed content:**
- Ch8: "Simplify 18/24" (fraction simplifying — previous chapter)
- Ch7: "Work out 2⁴" (powers — Module 1 consolidation)
- Ch6: "Find the HCF of 24 and 36" (HCF needed in fraction simplification)

**Suggested components:**
- `QuickRecallScreen` — 3 questions from Ch6–Ch8

---

### Section 9 — Examiner move (1–2 screens)

**Proposed content:**
- AQA Nov21 4-mark question: "Work out 2⅓ ÷ 4/5. Give your answer as a mixed number where appropriate." — full mark scheme: M1 for 7/3; M1 for ×5/4 (KCF); A1 for 35/12; B1 for 2 and 11/12
- AQA wording: "Give your answer as a fraction in its simplest form" — AQA specifies simplest form explicitly; unsimplified loses A1
- AQA wording: "Leave your answer as an exact value" — exact = fraction; never a rounded decimal
- AO2 multi-step: "Sam eats 3/4 of a pizza. He shares 2/3 of what he has with Beth. What fraction of the whole pizza does Beth eat?" — fraction × fraction context

**Suggested components:**
- `ExamQuestionFrame` — 4-mark division question with full mark scheme walkthrough
- `FaceTheExaminer` — student who left answer as 35/12 (missing B mark) and student who wrote 2.917 (not exact)

---

### Section 10 — Confidence check / next step (1 screen)

**Proposed content:**
- Formulae: addition/subtraction = common denominator; multiplication = numerator × numerator ÷ denominator × denominator; division = Keep-Change-Flip
- Top 3 errors: (1) adding denominators when adding fractions; (2) not converting mixed number before multiplying/dividing; (3) writing decimal instead of fraction as "exact answer"
- Exam tip: "On any fraction calculation: check your final answer is in simplest form. AQA always requires it — even if the question doesn't say 'simplest form', the mark scheme does."
- What comes next: Chapter 10 (Decimals, fractions and percentages) — fraction ↔ decimal ↔ percentage conversions; percentage of an amount as multiplier method

**Suggested components:**
- `ChapterCompleteScreen`

---

## 3. Active learning interactions

- `MisconceptionCheck`: "1/3 + 1/4 = 2/7" warm-up (Section 1)
- `ExplainReveal`: adding fractions with common denominator (Section 3)
- `ConceptReveal`: Keep-Change-Flip rationale (Section 3)
- `TheoryCompareBlock`: adding vs multiplying (different rules) (Section 3)
- `VisualLearning`: mixed number division full sequence (Section 3)
- `GuidedExamResponse`: 4-mark Nov21 division question (Section 4)
- `FillInTheBlanksBlock`: subtraction + multiplication blanks (Section 5)
- `SpotTheError`: mixed number division without converting (Section 6)
- `ExamQuestionFrame` × 2: time context (Section 7) + 4-mark division (Section 9)
- `FaceTheExaminer` × 2: improper fraction only / decimal instead of exact (Section 9)
- `QuickRecallScreen` × 2

---

## 4. Retrieval points

- Adding/subtracting: find LCM; scale fractions; operate on numerators only; simplify
- Multiplying: numerator × numerator; denominator × denominator; cross-cancel first to reduce
- Dividing: Keep-Change-Flip (multiply by reciprocal of second fraction); simplify
- Mixed numbers: ALWAYS convert to improper fraction before multiplying or dividing
- Exact answer = fraction form; never a rounded decimal

---

## 5. Exam skill focus

- **2-mark addition/subtraction:** M1 for common denominator method; A1 for simplified answer
- **2-mark multiplication:** M1 for numerator × numerator; A1 for simplified answer
- **4-mark mixed number division:** M1 for improper conversion; M1 for KCF; A1 for improper answer; B1 for mixed number form
- **1-mark "exact answer":** fraction form required — recognise "exact" as the instruction to leave as fraction

---

## 6. Build notes

The 4-mark mixed number division question (AQA Nov21) is the highest-value single fraction question type and should be the centrepiece of Section 4. The mark scheme breakdown (M1+M1+A1+B1) is unusual — the B mark for converting back to a mixed number is independent, so students who do the division correctly but leave the answer as an improper fraction drop only B1. This partial-credit structure should be made explicit. The "exact answer = fraction" distinction from "exact answer ≠ decimal" is a Paper 1 (non-calculator) hallmark and should be reinforced in Section 9.

---

## 7. Chapter completion test

- [ ] Student can add fractions with different denominators using LCM method
- [ ] Student can subtract fractions with different denominators
- [ ] Student can multiply fractions using numerator × numerator, denominator × denominator
- [ ] Student can divide fractions using Keep-Change-Flip
- [ ] Student ALWAYS converts mixed numbers to improper fractions before multiplying or dividing
- [ ] Student can identify which fraction to flip in a division question (the second — the divisor)
- [ ] Student understands "exact answer" means fraction, not decimal
- [ ] Student can simplify any fraction result to lowest terms
- [ ] Student can convert an improper fraction answer to a mixed number when asked
- [ ] Wrong answers log to `maths:fraction-add-sub`, `maths:fraction-multiply-divide`, or `maths:mixed-number-calculations`

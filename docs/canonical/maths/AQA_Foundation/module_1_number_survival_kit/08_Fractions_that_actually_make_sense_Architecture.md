# Chapter 8: Fractions that actually make sense — Architecture

## 1. Identity

- **Chapter:** 8 of 10 — Module 1 (Number survival kit)
- **Title:** Fractions that actually make sense
- **App module id:** `maths-fractions-basics`
- **Subject:** AQA GCSE Maths Foundation (8300)
- **AQA spec codes:** N8, N10, R8
- **Weakness tags:** `maths:equivalent-fractions`, `maths:simplifying-fractions`, `maths:fractions-of-amounts`, `maths:mixed-numbers`
- **MATHS_GROUPS mapping:** `maths_fractions` — confirmed in `src/data/mathsGroups.js`
- **Series pillar:** Number sense
- **Build status:** Not yet built
- **Content file:** `08_Fractions_that_actually_make_sense_Content.md`

---

## 2. Ten-section structure mapping

### Section 1 — Hook / why this matters (1–2 screens)

**Proposed content:**
- Hook: "Every fraction question in GCSE Maths — simplifying, ordering, calculating, percentage — connects back to one idea: finding what's common. Master that and you've cracked a quarter of the mark scheme."
- Exam consequence: "Fraction questions appear on every paper; simplifying is the most common dropped mark — losing A1 for leaving 6/8 instead of 3/4"
- Misconception warm-up: "1/4 of £56 = £1.40" → false trap (reading fraction as decimal)

**Suggested components:**
- `ChapterHookScreen`
- `MisconceptionCheck` — "1/4 of Andrew's share = £1.40" warm-up

---

### Section 2 — Prior knowledge check (1–2 screens)

**Proposed content:**
- Ch6: "Find the HCF of 18 and 24" (needed for simplifying fractions)
- Ch6: "Find the LCM of 4 and 6" (needed for ordering fractions by common denominator)
- Ch2: "Work out 56 ÷ 8" (division fluency for fractions of amounts)

**Suggested components:**
- `QuickRecallScreen` — 3 questions; wrong answers log to `maths:hcf-lcm` or `maths:four-operations`

---

### Section 3 — Core idea in simple language (2–4 screens)

**Proposed content:**
- Equivalent fractions: multiply or divide numerator and denominator by the same number; visual area model showing 1/2 = 2/4 = 4/8
- Simplifying to lowest terms: find HCF of numerator and denominator; divide both by HCF; stopping too early loses the A mark
- Improper fractions and mixed numbers: improper = numerator > denominator; mixed number = whole + proper fraction; conversion both directions
- Ordering fractions: convert all to same common denominator; then compare numerators
- Fractions of amounts: divide by denominator (find 1 part), then multiply by numerator; order always matters
- Fractions in ratio (R8/N11): total parts = sum of ratio shares; one share as fraction = that share ÷ total

**Suggested components:**
- `ConceptReveal` — equivalent fractions: multiplying/dividing numerator and denominator equally
- `ExplainReveal` — simplifying: find HCF(18,24)=6; 18÷6=3; 24÷6=4; result 3/4
- `TheoryCompareBlock` — improper fraction vs mixed number: when each form is needed
- `VisualLearning` — fractions of amounts: the divide-then-multiply sequence

---

### Section 4 — Worked example (1–2 screens)

**Proposed content:**
- "Andrew and Bruce share money in the ratio 5:6. What fraction of the total does Bruce receive?"
  - Total parts = 5 + 6 = 11
  - Bruce's fraction = 6/11
  - Common error: student writes "6 out of 5" or "6/5" — misreads which share is being asked for
  - Mark: B1 for 6/11 (simplest form; no further simplification possible as HCF(6,11)=1)
- "Find 3/8 of 56"
  - 56 ÷ 8 = 7 (one part); 7 × 3 = 21
  - M1 for 56 ÷ 8 seen; A1 for 21

**Suggested components:**
- `GuidedExamResponse` — ratio fraction + fraction of amount with step-by-step marks

---

### Section 5 — Guided practice (1–2 screens)

**Proposed content:**
- "Simplify 18/24" — HCF=6; 18÷6=3; 24÷6=4 → 3/4
- "Write 2¾ as an improper fraction" — (2×4)+3=11 → 11/4
- "Write 23/5 as a mixed number" — 23÷5=4 remainder 3 → 4⅗
- "Order 2/3, 5/9, 7/12 smallest first" — common denominator 36: 24/36, 20/36, 21/36 → 5/9 < 7/12 < 2/3

**Suggested components:**
- `FillInTheBlanksBlock` — simplifying + improper↔mixed conversion blanks

---

### Section 6 — Spot the trap / common mistake (1 screen)

**Proposed content:**
- Trap: "A student simplifies 15/20 by dividing only the numerator: 15÷5=3, giving 3/20."
  - Error: divided numerator by 5 but forgot to divide denominator too
  - Rule: the same operation MUST be applied to both numerator and denominator — it's multiplying by 1 (in disguise), not changing the value
- Secondary trap: "A student writes '3 out of 5' as their probability answer."
  - Error: AQA mark scheme requires fraction, decimal or percentage — "3 out of 5" is not accepted

**Suggested components:**
- `SpotTheError` — simplifying only the numerator

---

### Section 7 — Maths in the wild (1 screen)

**Proposed content:**
- Context: "A recipe uses 3/4 of a cup of flour for 6 biscuits. Tom wants to make 10 biscuits. How much flour does he need?"
  - Links to proportion (preview of Ch9): 10/6 × 3/4 = 30/24 = 5/4 = 1¼ cups
  - Connects fractions of amounts to scaling and ratio reasoning (Module 2 preview)

**Suggested components:**
- `ExamQuestionFrame` — proportion context with fraction of amount

---

### Section 8 — Mixed retrieval (1–2 screens)

**Proposed content:**
- Ch7: "Write 3.7 × 10⁻⁵ as an ordinary number" (standard form — previous chapter consolidation)
- Ch6: "Find the LCM of 8 and 12" (needed directly for ordering fractions)
- Ch5: "Round 2.475 to 2 decimal places" (rounding — separate from fractions but Module 1 consolidation)

**Suggested components:**
- `QuickRecallScreen` — 3 questions from Ch5–Ch7

---

### Section 9 — Examiner move (1–2 screens)

**Proposed content:**
- AQA Jun24 style: "Write these fractions in order of size, smallest first: 2/3, 5/9, 7/12" — show method (common denominator 36)
- AO2: "What fraction of 32 students play sport, if 24 play sport? Simplify." — 24/32 = 3/4 (HCF=8)
- Mark scheme pattern: "simplest form required — 6/8 for 3/4 loses A1; 'oe fraction' at intermediate steps"
- Key wording: "Give your answer as a fraction in its simplest form" — this instruction appears on every fraction question

**Suggested components:**
- `ExamQuestionFrame` — fraction ordering + simplifying in context
- `FaceTheExaminer` — student who wrote 24/32 without simplifying

---

### Section 10 — Confidence check / next step (1 screen)

**Proposed content:**
- Formulae: fraction of amount = ÷ denominator × numerator; improper ↔ mixed conversions; ordering = common denominator
- Top 3 errors: (1) simplifying only numerator (or denominator); (2) not simplifying final answer to lowest terms; (3) reading "1/4" as "1.4" in context problems
- Exam tip: "After any fraction answer, ask: can I still simplify? AQA always requires simplest form for the A mark."
- What comes next: Chapter 9 (Fraction calculations) — operations on fractions use everything from this chapter (simplifying, improper conversion, common denominators)

**Suggested components:**
- `ChapterCompleteScreen`

---

## 3. Active learning interactions

- `MisconceptionCheck`: "1/4 = 1.40" warm-up (Section 1)
- `ConceptReveal`: equivalent fractions multiplication/division (Section 3)
- `ExplainReveal`: simplifying via HCF (Section 3)
- `TheoryCompareBlock`: improper vs mixed number (Section 3)
- `VisualLearning`: divide-then-multiply for fractions of amounts (Section 3)
- `GuidedExamResponse`: ratio fraction + fraction of amount (Section 4)
- `FillInTheBlanksBlock`: simplifying + conversion blanks (Section 5)
- `SpotTheError`: numerator-only simplification (Section 6)
- `ExamQuestionFrame` × 2: proportion context (Section 7) + ordering/simplifying (Section 9)
- `FaceTheExaminer`: unsimplified fraction annotation (Section 9)
- `QuickRecallScreen` × 2

---

## 4. Retrieval points

- Equivalent fractions: multiply or divide both parts by the same number
- Simplest form: divide both by HCF; check HCF(numerator, denominator) = 1
- Improper → mixed: divide; quotient = whole; remainder = new numerator
- Mixed → improper: (whole × denominator) + numerator; same denominator
- Ordering: convert all to LCM denominator; compare numerators
- Fraction of amount: ÷ denominator (one part) × numerator
- Ratio fraction (R8): share ÷ total parts

---

## 5. Exam skill focus

- **1-mark simplify:** "Simplify [fraction]" — HCF method; simplest form required
- **1-mark conversion:** "Write as an improper fraction" / "Write as a mixed number"
- **2-mark fraction of amount:** M1 for dividing by denominator; A1 for correct answer
- **2-mark ordering:** M1 for common denominator method; A1 for correct order
- **2-mark ratio fraction:** total parts = sum of shares; one share ÷ total

---

## 6. Build notes

The most common mark-loss on fraction questions is failing to simplify the final answer. The second most common is applying the right method to the wrong quantity (e.g., dividing the denominator instead of the numerator in a fraction of an amount). Both errors should have dedicated SpotTheError/MisconceptionCheck moments. The ratio→fraction link (R8/N11) is important because it bridges Module 1 to Module 2 (ratio and proportion) — Section 7 or Section 9 should make this connection explicit.

---

## 7. Chapter completion test

- [ ] Student can generate equivalent fractions by multiplying or dividing numerator and denominator by the same number
- [ ] Student can simplify any fraction to lowest terms using HCF
- [ ] Student can convert between improper fractions and mixed numbers in both directions
- [ ] Student can order any set of fractions by converting to a common denominator
- [ ] Student can find a fraction of any amount using the ÷ denominator × numerator method
- [ ] Student can express one share of a ratio as a fraction of the total
- [ ] Student knows "simplest form" is required for the A mark and can check by testing HCF = 1
- [ ] Wrong answers log to `maths:equivalent-fractions`, `maths:simplifying-fractions`, `maths:fractions-of-amounts`, or `maths:mixed-numbers`

# Chapter 6: Factors, multiples and primes — Architecture

## 1. Identity

- **Chapter:** 6 of 10 — Module 1 (Number survival kit)
- **Title:** Factors, multiples and primes
- **App module id:** `maths-primes`
- **Subject:** AQA GCSE Maths Foundation (8300)
- **AQA spec codes:** N4
- **Weakness tags:** `maths:prime-numbers`, `maths:hcf-lcm`, `maths:prime-factorisation`
- **MATHS_GROUPS mapping:** `maths_primes` — confirmed in `src/data/mathsGroups.js`
- **Series pillar:** Number sense
- **Build status:** Not yet built
- **Content file:** `06_Factors_multiples_and_primes_Content.md`

---

## 2. Ten-section structure mapping

### Section 1 — Hook / why this matters (1–2 screens)

**Proposed content:**
- Hook: "Every number is secretly a unique fingerprint of primes — and knowing that fingerprint is the fastest route to HCF, LCM, and simplifying fractions."
- Exam consequence: "Prime factorisation questions appear 5/7 papers; HCF/LCM embedded in ratio and fraction questions throughout the course"
- Misconception warm-up: "1 is a prime number" → false trap

**Suggested components:**
- `ChapterHookScreen`
- `MisconceptionCheck` — "1 is prime" warm-up

---

### Section 2 — Prior knowledge check (1–2 screens)

**Proposed content:**
- "List all factors of 12" (baseline factor recognition)
- "List the first 5 multiples of 4" (baseline multiple recognition)
- Ch2: "Is 48 divisible by 6? Show how you know." (division fluency)

**Suggested components:**
- `QuickRecallScreen` — 3 questions; wrong answers log to `maths:four-operations`

---

### Section 3 — Core idea in simple language (2–4 screens)

**Proposed content:**
- Factor pairs method: list factors systematically by testing divisibility; stop when pair factors cross
- Prime numbers: exactly 2 factors only; 1 is NOT prime; 2 is the only even prime; primes up to 50: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47
- Prime factorisation — factor tree method: branch out, circle primes, write in index form
- Prime factorisation — division ladder: divide by 2 repeatedly, then 3, then 5, etc.
- HCF from prime factorisations: shared prime factors using lowest power
- LCM from prime factorisations: all prime factors using highest power
- Venn diagram method: shared factors go in the intersection; HCF = multiply intersection; LCM = multiply everything in the diagram

**Suggested components:**
- `ExplainReveal` — factor tree: 60 → 2×30 → 2×2×15 → 2²×3×5
- `VisualLearning` — prime factorisation Venn diagram for HCF and LCM
- `ConceptReveal` — why 1 is not prime; why 2 is the only even prime
- `TheoryCompareBlock` — HCF vs LCM: what they mean, when to use each

---

### Section 4 — Worked example (1–2 screens)

**Proposed content:**
- "Write 200 as a product of its prime factors in index form."
  - Factor tree: 200 = 2 × 100; 100 = 2 × 50; 50 = 2 × 25; 25 = 5 × 5
  - Prime factorisation: 2³ × 5²
  - Mark: M1 for attempting prime factorisation; M1 for correct prime factors (2 and 5 only); A1 for 2³ × 5² in index form
  - Trap: "8 × 25" is NOT a prime factorisation — no M marks

**Suggested components:**
- `GuidedExamResponse` — prime factorisation with marks per step; explicit trap warning about "8 × 25"

---

### Section 5 — Guided practice (1–2 screens)

**Proposed content:**
- Prime factorisation of 90 (= 2 × 3² × 5) — student fills in factor tree branches
- Find HCF(36, 48) using prime factorisations: 36 = 2² × 3²; 48 = 2⁴ × 3; shared = 2² × 3 = 12
- "Is 19 prime? Give a reason." — student selects correct response; must reference divisibility not just "only has two factors"

**Suggested components:**
- `FillInTheBlanksBlock` — factor tree completion + HCF calculation blanks

---

### Section 6 — Spot the trap / common mistake (1 screen)

**Proposed content:**
- Trap: "A student writes LCM(4, 6) = 24 because 4 × 6 = 24."
  - Error: LCM is the LOWEST common multiple — listing multiples of 4 and 6 shows 12 is a common multiple and is smaller than 24
  - Rule: LCM ≤ product of two numbers; product only equals LCM when the numbers share no common factors

**Suggested components:**
- `SpotTheError` — LCM equals product misconception

---

### Section 7 — Maths in the wild (1 screen)

**Proposed content:**
- Context: "Bus A runs every 8 minutes. Bus B runs every 12 minutes. Both leave at 9:00. When will they next leave together?"
  - LCM(8, 12) = 24 minutes → next joint departure at 9:24
  - Real application: timetabling / scheduling / packaging

**Suggested components:**
- `ExamQuestionFrame` — 2-mark LCM scheduling question

---

### Section 8 — Mixed retrieval (1–2 screens)

**Proposed content:**
- Ch5: "Write 24,862 to 3 significant figures"
- Ch4: "Work out 2³ + 4 × 3" (BIDMAS + powers preview)
- Ch3: "Work out (−2) × (−5)"

**Suggested components:**
- `QuickRecallScreen` — 3 questions from Ch3–Ch5

---

### Section 9 — Examiner move (1–2 screens)

**Proposed content:**
- AQA Nov21 style: "Find the LCM of 90 and 126 using prime factorisation."
  - 90 = 2 × 3² × 5; 126 = 2 × 3² × 7; LCM = 2 × 3² × 5 × 7 = 630
  - Marks: M1 each for prime factorisations; A1 for LCM = 630
- AO2: "Two numbers have HCF = 6 and LCM = 60. What could the two numbers be? Explain how you know."
  - Possible pairs: (6, 60), (12, 30), (20, 18 — no, HCF = 2 not 6)
  - Valid pair: (12, 30) — 12 = 2² × 3; 30 = 2 × 3 × 5; HCF = 2 × 3 = 6; LCM = 2² × 3 × 5 = 60 ✓

**Suggested components:**
- `ExamQuestionFrame` — 3-mark prime factorisation → LCM
- `FaceTheExaminer` — student who wrote "LCM = 6 × 10 = 60" and "HCF = 6" without prime factorisation reasoning

---

### Section 10 — Confidence check / next step (1 screen)

**Proposed content:**
- Top 3 errors: (1) 1 is prime; (2) LCM = product of two numbers; (3) prime factorisation in "product form" instead of index form (loses final A mark)
- Exam tip: "When writing prime factorisation, always check: are ALL factors prime? Write in index form — 2 × 2 × 5 is not the same as 2² × 5 for the A mark."
- What comes next: Chapter 7 (Powers and standard form) — index notation from prime factorisation becomes the foundation for index laws

**Suggested components:**
- `ChapterCompleteScreen`

---

## 3. Active learning interactions

- `MisconceptionCheck`: "1 is prime" warm-up (Section 1)
- `ExplainReveal`: factor tree for 60 (Section 3)
- `VisualLearning`: Venn diagram HCF/LCM (Section 3)
- `ConceptReveal`: why 1 isn't prime; 2 is only even prime (Section 3)
- `TheoryCompareBlock`: HCF vs LCM (Section 3)
- `GuidedExamResponse`: prime factorisation of 200 (Section 4)
- `FillInTheBlanksBlock`: factor tree + HCF blanks (Section 5)
- `SpotTheError`: LCM = product misconception (Section 6)
- `ExamQuestionFrame` × 2: scheduling LCM (Section 7) + 3-mark prime factorisation (Section 9)
- `FaceTheExaminer`: reasoning annotation (Section 9)
- `QuickRecallScreen` × 2

---

## 4. Retrieval points

- Factor: divides exactly; find by testing divisibility systematically in pairs
- Prime: exactly 2 factors (1 and itself); 1 is NOT prime; 2 is the only even prime
- Primes up to 50: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47
- Prime factorisation: factor tree or division ladder → write in index form
- HCF: shared prime factors, lowest power → used in LCM, fractions, simplifying
- LCM: all prime factors, highest power → used in scheduling, fractions, algebra

---

## 5. Exam skill focus

- **2–3 mark prime factorisation:** factor tree or division, write in index form
- **2-mark HCF/LCM:** from prime factorisations or by listing
- **2-mark context LCM:** scheduling / packaging problem
- **2-mark explain:** "Is N prime? Give a reason."

---

## 6. Build notes

The "1 is prime" misconception and "LCM = product" misconception are the two most common errors on these questions. The Venn diagram method for finding HCF and LCM is the clearest visual and should be the primary teaching method. The forward link to Chapter 7 (index notation) and Module 2 Ch3 (factorising algebra) should be explicitly made in Section 10.

---

## 7. Chapter completion test

- [ ] Student knows 1 is NOT prime and can explain why (only one factor)
- [ ] Student can list all factors of any number up to ~100 using factor pairs
- [ ] Student can write the prime factorisation of any number using a factor tree in index form
- [ ] Student can find HCF of two numbers using prime factorisations
- [ ] Student can find LCM of two numbers using prime factorisations
- [ ] Student knows LCM ≤ product of two numbers (not always equal)
- [ ] Student can apply LCM to a scheduling / packaging context problem
- [ ] Student can justify whether a given number is prime
- [ ] Wrong answers log to `maths:prime-numbers`, `maths:hcf-lcm`, or `maths:prime-factorisation`

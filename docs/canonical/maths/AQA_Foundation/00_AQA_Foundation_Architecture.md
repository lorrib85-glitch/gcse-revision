# AQA GCSE Maths Foundation — Architecture Reference

> **Primary consumer:** future Claude sessions building maths modules.  
> **Content, formulae, key terms, misconceptions and exam angles:** see `00_AQA_Foundation_Series_Content.md`.  
> **Series spine (episode table, throughline, spec weightings):** see `00_AQA_Foundation_Series_Map.md`.

---

## 1. Identity (brief)

- **Subject:** Maths
- **Qualification:** AQA GCSE Mathematics (8300), Foundation tier, grades 1–5
- **Series:** AQA GCSE Maths Foundation
- **Series directory:** `docs/canonical/maths/AQA_Foundation/`
- **App subject key:** `Maths`
- **Build status:** Series architecture defined — 23 episodes planned, 0 built to spec (2 legacy stubs `math1`, `math2` exist in `src/modules.js` but do not follow the MATHS_GROUPS module ID pattern)

---

## 2. Existing codebase state

### Files that currently hold maths content

| File | Role | Status |
|------|------|--------|
| `src/data/mathsTopics.js` | AQA past-paper question bank for Exam Mode | Active — 200+ questions organised by topic group |
| `src/data/mathsGroups.js` | `MATHS_GROUPS` — 4 topic groups for ModulesTab browser | Active — defines 23 planned module IDs |
| `src/data/mathsQuestions.js` | `MATHS_FORMULA_SHEET` (formulae) + `DIAGRAMS` (SVG) + AQA past-paper questions | Active — primary exam-mode resource |
| `src/modules.js` (lines 730–763) | Metadata stubs for `math1` and `math2` | Legacy — IDs do not match MATHS_GROUPS pattern |
| `src/modules/maths.js` | Full lesson content for maths modules | Does not exist — maths content not yet built |

### MATHS_GROUPS episode ID map (from `src/data/mathsGroups.js`)

**Group 1 — Numbers & Foundations** (`accent: '#2DD4BF'`, `headerImage: '/headers/maths-numbers.webp'`):
- `maths_bidmas` — Order of Operations
- `maths_fractions` — Fractions & Decimals
- `maths_indices` — Indices & Surds
- `maths_primes` — Primes & Factors
- `maths_percentages` — Percentages

**Group 2 — Algebra & Graphs** (`accent: '#34D399'`, `headerImage: '/headers/maths-algebra.webp'`):
- `maths_expressions` — Expressions & Formulae
- `maths_equations` — Solving Equations
- `maths_inequalities` — Inequalities
- `maths_graphs` — Straight Line Graphs
- `maths_quadratics` — Quadratics & Functions

**Group 3 — Geometry & Measure** (`accent: '#4ADE80'`, `headerImage: '/headers/maths-geometry.webp'`):
- `maths_angles` — Angles & Polygons
- `maths_area` — Area & Perimeter
- `maths_volume` — Volume & Surface Area
- `maths_pythagoras` — Pythagoras & Trig
- `maths_transforms` — Transformations

**Group 4 — Data, Probability & Statistics** (`accent: '#22D3EE'`, `headerImage: '/headers/maths-data.webp'`):
- (additional modules not listed in mathsGroups.js excerpt — check `src/data/mathsGroups.js` for full list)

**Not yet in MATHS_GROUPS but needed:**
- `maths_rounding` — Rounding & Estimation (N14, N15, N16)
- `maths_sequences` — Sequences (A23, A24, A25)
- `maths_ratio` — Ratio & Proportion (R1–R10)
- `maths_speed_density` — Speed, Density & Compound Measures (R1, R11, R13, R14)
- `maths_averages` — Averages & Spread (S4, S5)
- `maths_charts` — Charts & Diagrams (S1, S2, S6)
- `maths_probability` — Probability (P1–P8)
- `maths_constructions` — Constructions & Loci (G2, G13, G15)

---

## 3. Module architecture — per-episode section structure

Every AQA Foundation Maths module follows this 6-part structure. This is the **locked module architecture** for all maths episodes.

### Section 1 — Knowledge hook (1–2 screens)
**Purpose:** Grab attention. Establish why this topic matters in the exam. Surface a common misconception as a "trap" warm-up. Start with something the student thinks they know.
**Typical components:**
- `ChapterHookScreen` — true/false misconception warm-up
- `MisconceptionCheck` — single high-frequency error framed as a trap
**Rules:**
- Every Section 1 must name the exam consequence of the misconception (e.g. "this mistake costs you 3 marks in every paper")
- Reference the series pillar this topic connects to (Number sense / Algebraic thinking / Spatial reasoning / Proportional reasoning / Statistical literacy)

### Section 2 — Core knowledge (2–4 screens)
**Purpose:** Teach the GCSE content clearly. Build understanding from first principles. Use concrete examples before abstract rules. Cover all spec requirements for this module.
**Typical components:**
- `VisualLearning` — cinematic scene sequence for concept introduction
- `ConceptReveal` — progressive reveal with visual and definition
- `ExplainReveal` — cause-and-effect reasoning chain (e.g. WHY alternate angles are equal)
- `TheoryCompareBlock` — side-by-side comparison (e.g. mean vs median vs mode)
- `GraphView` — embedded SVG chart/diagram for visual illustration of relationships
**Rules:**
- Every Section 2 must include at least one worked example with all steps shown (model the method)
- Show working explicitly — model the AO1 behaviour (correct procedure shown step by step)
- Every Section 2 must name the specific spec codes covered (for traceability)

### Section 3 — Active retrieval (2–3 screens)
**Purpose:** Force the student to recall and apply. NOT passive reading. One question type per screen.
**Typical components:**
- `QuickRecallScreen` — rapid-fire choice questions
- `MatchingTask` — match terms to definitions / match steps to methods
- `FillInTheBlanksBlock` — complete a worked example
- `ColSortBlock` — sort numbers/expressions into categories
**Rules:**
- Every question must connect to a spec code from Section 2
- Wrong answers must be logged via `logWrongAnswer(unifiedWeaknessTracker)` with a specific tag
- Tags must map to an entry in `src/data/tagModuleMap.js` for WeakSpotRecovery routing
- Every Section 3 must include at least one question that could appear word-for-word in an AQA paper

### Section 4 — Worked example (1–2 screens)
**Purpose:** Model exam technique. Show the examiner's expectation explicitly. Include mark allocation.
**Typical components:**
- `GuidedExamResponse` — guided written-answer scaffold with mark scheme
- `ExamQuestionFrame` — universal exam question with mark scheme reveal
- `FaceTheExaminer` — examiner-style written question with criteria selection
**Rules:**
- Every Section 4 must show marks allocated per step (M1, A1, B1 style labels or equivalent plain English)
- Must explicitly flag "show working" expectation
- Must reference the AQA question format (Foundation Paper 1 or 2 or 3 as appropriate)
- Should include the specific AQA wording pattern (e.g. "Give your answer as a fraction in its simplest form")

### Section 5 — Exam practice (2–3 screens)
**Purpose:** Independent practice with authentic exam questions. Immediate feedback.
**Typical components:**
- `QuickRecallScreen` — exam-style multiple choice
- `ExamQuestionFrame` — past-paper extracts (sourced from `src/data/mathsTopics.js` or `mathsQuestions.js`)
- `SpotTheError` — identify the error in a worked solution
**Rules:**
- Must include at least one question from the past-paper bank (`mathsTopics.js` or `mathsQuestions.js`)
- Must include at least one "explain why" or "show that" task (AO2 practice)
- Results feed `unifiedWeaknessTracker.js` — log correct/incorrect with topic tag
- Section 5 should cover the FULL mark range for this topic (easy 1-mark → harder 4-5 mark)

### Section 6 — Exam technique summary (1 screen)
**Purpose:** End with a clear revision card. What to remember. What to check. Common errors to avoid.
**Typical components:**
- `ChapterCompleteScreen` — end-of-module completion with key points panel
- `ConceptReveal` — single-screen summary card
**Rules:**
- Every Section 6 must include: (a) the formula(e) this topic requires, (b) the 3 most common errors from mark schemes, (c) a one-line "exam tip" about showing working
- Must NOT introduce new content — summary only
- Should name which past papers contain this topic (e.g. "Appears in Jun22 Q10, Jun23 Q18, Jun24 Q17")

---

## 4. Module completion test (applies to every module)

Before marking any maths module as complete, verify all of the following:

- [ ] Section 1: hook screen names the topic's most common misconception with an exam-consequence statement
- [ ] Section 1: series pillar (Number sense / Algebraic thinking / Spatial reasoning / Proportional reasoning / Statistical literacy) identified
- [ ] Section 2: all relevant spec codes (N_, A_, R_, G_, P_, S_) are covered
- [ ] Section 2: at least one fully worked example with all steps shown
- [ ] Section 3: at least one question requiring active retrieval (not just reading)
- [ ] Section 3: wrong answers log to `unifiedWeaknessTracker.js` with specific tag
- [ ] Section 3: at least one question matching AQA past-paper style
- [ ] Section 4: marks shown per step (M1/A1 or plain English equivalent)
- [ ] Section 4: "show working" expectation made explicit
- [ ] Section 5: at least one authentic past-paper question used
- [ ] Section 5: covers full mark range (1-mark to 4-5-mark)
- [ ] Section 6: formulae listed, top 3 errors listed, exam tip included
- [ ] `src/modules.js` entry added with correct `id`, `screenCount`, `screenTags`
- [ ] `MODULE_CONTENT_LOADERS` entry added in `src/app/LegacyApp.jsx`
- [ ] Content file created at `src/content/maths/<module-id>.js` (per-module pattern, NOT added to legacy subject file)
- [ ] `vitest run tests/architecture` passes

---

## 5. Current state & gap analysis

**Build status:** Not yet built — full build from spec for all 23 episodes.

**Legacy stubs requiring migration:**
- `math1` ("Maths Survival Basics", screenCount: 8) — no content file; metadata exists in `src/modules.js` but ID does not match MATHS_GROUPS. This module overlaps with `maths_bidmas` + `maths_fractions`. Decision needed: migrate + rename, or keep as standalone warm-up module.
- `math2` ("Fraction Foundations", screenCount: 9) — same issue. Overlaps `maths_fractions`.

**MATHS_GROUPS vs modules.js mismatch:** `mathsGroups.js` references module IDs (`maths_bidmas`, `maths_fractions`, etc.) that do not exist in `src/modules.js`. When a user taps a module card in the Maths section of the app, the ModulePlayer will try to load content for these IDs and fail unless both files are updated together. Any build work must add to both files simultaneously.

**Existing exam question bank:** `src/data/mathsTopics.js` and `src/data/mathsQuestions.js` contain substantial past-paper questions already. These should be cross-referenced and reused in Section 5 of each episode rather than duplicating content.

---

## 6. Build recommendations

### Priority order (based on exam frequency and prerequisite relationships)

**Tier 1 — Build first (very high exam frequency, prerequisite for other topics):**

1. `maths_bidmas` (N2, N3) — appears every paper; prerequisite for all algebra
   - Section 4 example source: Jun22 Q6b (60÷2+4), Jun23 Q10 (8×3+2 vs 21−(15−4))
   - Pillar: Number sense
   - Misconception hook: "60 ÷ 2 + 4 = 10" (treated as 60 ÷ 6)

2. `maths_fractions` (N2, N8, N10, N11) — appears every paper; prerequisite for ratio/percentages
   - Section 4 example source: Jun22 Q12 (11/18 − 1/3), Jun23 Q25 (2⅓ ÷ 4/5)
   - Pillar: Number sense + Proportional reasoning
   - Misconception hook: dividing fractions by dividing numerators and denominators separately

3. `maths_percentages` (N12, R9) — appears every paper; high mark value
   - Section 4 example source: Jun22 Q9 (dress percentages), Jun23 Q12 (percentage increase £120→£240)
   - Pillar: Proportional reasoning
   - Misconception hook: percentage increase → not adding back to original

4. `maths_ratio` (R4, R5, R6, R7) — appears every paper; high mark value
   - Section 4 example source: Jun23 Q13 (ratio 5:2:3 bar chart), Jun23 Q19 (Andrew/Bruce ratio)
   - Pillar: Proportional reasoning
   - Misconception hook: dividing by one part of ratio instead of total parts

5. `maths_angles` (G1, G3, G4) — appears every paper; marks often lost on notation
   - Section 4 example source: Jun22 Q10b (isosceles triangle x=3y), Jun23 Q17 (EBD=5×ABE)
   - Pillar: Spatial reasoning
   - Misconception hook: calling alternate angles "Z-angles" (not acceptable in exam)

6. `maths_area` (G16, G17) — appears every paper; composite shape questions high value
   - Section 4 example source: Jun23 Q15 (rectangle with hole, find shaded %)
   - Pillar: Spatial reasoning
   - Misconception hook: using circumference formula (2πr) for area instead of πr²

7. `maths_expressions` (A1, A2, A4, A5) — appears every paper
   - Section 4 example source: Jun23 Q22 (expand and simplify 5(3x+4)−2(x−1))
   - Pillar: Algebraic thinking
   - Misconception hook: sign error on second bracket (−2(x−1) → −2x − 2 not −2x + 2)

8. `maths_averages` (S4) — appears every paper; comparison questions common
   - Section 4 example source: Jun22 Q8 (mode 8, median 12 — construct data set), Jun24 Q9 (Alina vs Sue)
   - Pillar: Statistical literacy
   - Misconception hook: median of even-numbered set = lower middle value (wrong: average the two)

**Tier 2 — Build second (high frequency, build on Tier 1 knowledge):**

9. `maths_equations` (A17, A21) — solve linear equations including set-up from context
   - Section 4 example source: Jun23 Q24 (Sunita/Beth/Joel mean age = 5)
   - Pillar: Algebraic thinking
   - Misconception hook: "one year younger" means add 1 (wrong: subtract 1)

10. `maths_sequences` (A23, A24, A25) — term-to-term and nth term
    - Section 4 example source: Jun22 Q13a (3rd term = 46, multiply by 2, find 1st), Q13b (subtract k rule)
    - Pillar: Algebraic thinking
    - Misconception hook: nth term written as 3n when correct is 3n + 2

11. `maths_indices` (N6, N7, N9) — powers, roots and standard form
    - Section 4 example source: Jun22 Q18 (80,000,000 ÷ 200 in standard form), Q19b (8 × 2⁶ × 2⁴ as power of 2)
    - Pillar: Number sense
    - Misconception hook: 8 × 10⁷ written as 80 × 10⁶ (not valid standard form)

12. `maths_primes` (N4, N5) — HCF, LCM, prime factorisation, systematic listing
    - Section 4 example source: Jun24 Q7a (systematic listing — pizza toppings), Jun23 Q18 (two primes multiplied, answer even between 50 and 60)
    - Pillar: Number sense
    - Misconception hook: 1 is a prime number

13. `maths_probability` (P1–P8) — Venn diagrams, tree diagrams, combined events
    - Section 4 example source: Jun22 Q15 (green discs), Jun22 Q20 (Venn diagram criticism)
    - Pillar: Statistical literacy
    - Misconception hook: multiplying when should add (mutually exclusive events)

14. `maths_graphs` (A8, A9, A10) — straight line graphs, gradient, intersection
    - Section 4 example source: Jun22 Q16 (draw y=2x+1, find intersection with y=7−3x)
    - Pillar: Algebraic thinking
    - Misconception hook: gradient = rise/run confused with run/rise; y-intercept missed

15. `maths_charts` (S2, S4, S6) — pictograms, bar charts, scatter graphs, line of best fit
    - Section 4 example source: Jun23 Q7 (pictogram), Jun23 Q20 (scatter graph, line of best fit, extra lives)
    - Pillar: Statistical literacy
    - Misconception hook: extrapolating far beyond data range; drawing line of best fit through origin

**Tier 3 — Build third (medium frequency, grade 4–5 topics):**

16. `maths_volume` (G12, G16, G17, G18)
17. `maths_rounding` (N14, N15, N16)
18. `maths_speed_density` (R1, R11, R13)
19. `maths_transforms` (G7, G8, G24, G25)
20. `maths_quadratics` (A11, A12, A18)
21. `maths_inequalities` (A22)
22. `maths_pythagoras` (G20, G21)
23. `maths_constructions` (G2, G13, G15)

---

## 7. Integration notes

### Content file location
All maths content files go to `src/content/maths/<module-id>.js` following the per-module pattern.
Example: `src/content/maths/maths_bidmas.js`

### `src/modules.js` entry template
```js
{
  id: "maths_bidmas",
  subject: "Maths",
  number: 1,
  title: "Order of operations",
  subtitle: "BIDMAS, brackets and calculation rules",
  era: "Foundation",
  icon: "🔢",
  color: "#2DD4BF",
  colorLight: "rgba(45,212,191,.12)",
  headerImage: "/headers/maths-numbers.webp",
  screenCount: <screens.length>,
  screenTags: <screens.map(s => s.tag ?? null)>,
},
```

### `LegacyApp.jsx` MODULE_CONTENT_LOADERS entry
```js
maths_bidmas: () => import('../content/maths/maths_bidmas.js'),
```

### Content file export shape
```js
export default {
  id: "maths_bidmas",
  subject: "Maths",
  hook: { ... },
  outcomes: [...],
  recall: { ... },
  screens: [...],
};
```

### Existing question bank reuse
Before writing new questions for Section 5 of any episode, check `src/data/mathsTopics.js` for existing questions on that topic. The structure is:
```js
MATHS_TOPIC_GROUPS → [ { id, title, questions: [{ id, type, question, options, answer, explanation, ... }] } ]
```
Reuse question IDs and mark schemes where possible. Do not duplicate — reference from the lesson instead.

### Weakness tracker tags
Each question in Section 3 and Section 5 must pass a `tag` string to `logWrongAnswer`. Proposed tag namespace for maths:
- `maths:bidmas` — order of operations
- `maths:fractions` — fraction operations
- `maths:percentages` — percentage change/increase/decrease
- `maths:ratio` — ratio sharing and notation
- `maths:angles` — angle rules and polygon properties
- `maths:area` — area and perimeter of 2D shapes
- `maths:circles` — circumference, area, sectors
- `maths:algebra:expressions` — simplify, expand, factorise
- `maths:algebra:equations` — solve linear equations
- `maths:algebra:graphs` — straight line graphs, gradient
- `maths:algebra:sequences` — nth term, term-to-term
- `maths:indices` — powers, roots, standard form
- `maths:primes` — factors, multiples, HCF, LCM
- `maths:probability` — probability scale, combined events, tree diagrams
- `maths:statistics:averages` — mean, median, mode, range
- `maths:statistics:charts` — reading and constructing charts
- `maths:volume` — volume and surface area
- `maths:pythagoras` — Pythagoras' theorem
- `maths:trigonometry` — SOH CAH TOA

Add each tag to `src/data/tagModuleMap.js` as modules are built.

### Legacy module migration
`math1` and `math2` in `src/modules.js` should be marked as deprecated and eventually removed once `maths_bidmas` and `maths_fractions` are built and tested. Do not build new content into `math1`/`math2` — use the `maths_*` ID system.

---

## 8. Series throughline integration

Every episode must reference the series throughline in Section 1 (hook) and Section 6 (summary). The throughline for Maths is:

> "The student who shows method never scores zero. The student who understands WHY a rule works can reconstruct it under pressure."

**Five pillars framing (use in section headings, hook framing, and debrief text):**
1. **Number sense** — episodes: bidmas, fractions, percentages, indices, primes, rounding
2. **Algebraic thinking** — episodes: expressions, equations, inequalities, graphs, quadratics, sequences
3. **Spatial reasoning** — episodes: angles, area, volume, pythagoras, transforms, constructions
4. **Proportional reasoning** — episodes: ratio, percentages (shared with number sense), speed_density
5. **Statistical literacy** — episodes: averages, charts, probability

**Cross-episode connections to flag explicitly:**
- `maths_fractions` → `maths_percentages` → `maths_ratio` (all proportional reasoning; percentage is a special ratio out of 100)
- `maths_indices` → `maths_expressions` → `maths_equations` (laws of indices feed algebraic manipulation)
- `maths_angles` → `maths_area` → `maths_volume` (geometry builds sequentially)
- `maths_averages` → `maths_charts` → `maths_probability` (data/statistics trilogy)

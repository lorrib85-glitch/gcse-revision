# AQA GCSE Maths Foundation — Series Map

## Series identity

- **Series name:** AQA GCSE Maths Foundation
- **Subject:** Maths
- **Exam board / qualification:** AQA GCSE Mathematics (8300), Foundation tier, grades 1–5
- **Series directory:** `docs/canonical/maths/AQA_Foundation/`
- **Canonical content base:** `docs/canonical/maths/`
- **Course structure:** 4 modules × 10 chapters = **40 chapters** (canonical student-facing structure)
- **App subject key:** `Maths`
- **App accent colour:** `#2DD4BF` (teal-green family)
- **Header images:** `/headers/maths-numbers.webp`, `/headers/maths-algebra.webp`, `/headers/maths-geometry.webp`, `/headers/maths-data.webp`
- **Existing data files:** `src/data/mathsTopics.js`, `src/data/mathsGroups.js`, `src/data/mathsQuestions.js`

## Series throughline

**The question every chapter must answer:**
> "What does this topic look like in an AQA Foundation exam — and what do students need to do to not drop marks on it?"

**Throughline statement:**
Every chapter bridges specification knowledge → confident exam execution. Maths is the subject where misconceptions are most punishing (a sign error costs 3 marks; not showing working costs everything). The series teaches students to understand WHY rules work, spot WHERE they go wrong, and build the habit of SHOWING METHOD.

**Five series pillars** (reference these in architecture files):
1. **Number sense** — all topics connect back to fluency with number operations and place value
2. **Algebraic thinking** — identifying structure, generalising, and forming expressions/equations
3. **Spatial reasoning** — visualising shapes, transformations, and geometric relationships
4. **Proportional reasoning** — ratio, percentage, scale, and rate as unified multiplicative thinking
5. **Statistical literacy** — reading and interpreting data, understanding probability and uncertainty

## Specification structure

AQA 8300 Foundation tier topic weightings (approximate):
- Number: 25%
- Algebra: 20%
- Ratio, proportion and rates of change: 25%
- Geometry and measures: 15%
- Probability and statistics (combined): 15%

Paper structure:
- **Paper 1 (Non-calculator):** 80 marks, 1 hr 30 min — all topics
- **Paper 2 (Calculator):** 80 marks, 1 hr 30 min — all topics
- **Paper 3 (Calculator):** 80 marks, 1 hr 30 min — all topics

Formulae provided in exam (on formula sheet — students must recognise not memorise):
- Area of trapezium, Volume of prism, Volume of sphere, Surface area of sphere, Volume of cone, Curved surface area of cone, Kinematics (v=u+at, s=ut+½at², v²=u²+2as)

Formulae students MUST memorise (not given):
- Circumference and area of a circle (2πr, πr²)
- Pythagoras' theorem (a²+b²=c²)
- Trigonometric ratios (sin, cos, tan)
- Quadratic formula, Compound interest formula
- Area of rectangle, triangle, parallelogram, trapezium (½(a+b)h)
- Volume of cuboid

## Assessment objectives

- **AO1** (~50%): Use and apply standard techniques — recall, notation, routine procedures
- **AO2** (~25%): Reason, interpret and communicate — deductions, chains of reasoning, arguments
- **AO3** (~25%): Solve problems — translate, connect, evaluate

---

## Two-layer architecture

### Layer 1 — Canonical student learning journey (40 chapters)

This is the canonical course structure. Future maths module builds must follow this spine.
Source authority: `aqa_gcse_maths_foundation_4_module_spine_UPDATED.txt`

**4 modules × 10 chapters = 40 chapters total.**
Each chapter is a discrete buildable unit that maps to one or more internal MATHS_GROUPS IDs (see Layer 2).
Content files go to `src/content/maths/<chapter-id>.js`, loaded individually via `MODULE_CONTENT_LOADERS`.

### Layer 2 — Internal app/question-bank mapping (MATHS_GROUPS)

The `MATHS_GROUPS` in `src/data/mathsGroups.js` are **internal identifiers only**.
They exist to support: weakness tracking, question bank tagging, retrieval practice, exam practice, planner repair tasks, and legacy `math1`/`math2` migration.

**MATHS_GROUPS IDs are not student-facing course units.**
They must not replace or collapse the 40-chapter structure above.
Do not create modules that map 1:1 to MATHS_GROUPS — build from the 40-chapter spine.

---

## Layer 1: 40-chapter course spine

### Module 1 — Number survival kit
**Goal:** Build the fluency and number confidence needed for every other GCSE Maths topic.

| Ch | Title | AQA links | mapsToMathsGroups | Gap? | studentPath |
|----|-------|-----------|-------------------|------|-------------|
| 1 | Place value and number sense | N1, N2 | *(none)* | **GAP** | `number-survival-kit/place-value-and-number-sense` |
| 2 | The four operations | N2, N3 | `maths_bidmas` (partial: N3 only) | partial | `number-survival-kit/the-four-operations` |
| 3 | Negative numbers without panic | N1, N2 | *(none)* | **GAP** | `number-survival-kit/negative-numbers` |
| 4 | BIDMAS and calculator control | N3, N6, N7 | `maths_bidmas` | ✓ | `number-survival-kit/bidmas-and-calculator-control` |
| 5 | Rounding, estimating and checking | N2, N14, N15 | `maths_rounding`† | †not in mathsGroups.js | `number-survival-kit/rounding-estimating-and-checking` |
| 6 | Factors, multiples and primes | N4 | `maths_primes` | ✓ | `number-survival-kit/factors-multiples-and-primes` |
| 7 | Powers, roots and standard form | N6, N7, N9 | `maths_indices` | ✓ | `number-survival-kit/powers-roots-and-standard-form` |
| 8 | Fractions that actually make sense | N8, N10, R8 | `maths_fractions` | ✓ | `number-survival-kit/fractions-that-actually-make-sense` |
| 9 | Fraction calculations | N2, N8 | `maths_fractions` | ✓ | `number-survival-kit/fraction-calculations` |
| 10 | Decimals, fractions and percentages | N10, N12, R9 | `maths_fractions`, `maths_percentages` (partial) | partial | `number-survival-kit/decimals-fractions-and-percentages` |

---

### Module 2 — Algebra and proportion engine
**Goal:** Make algebra, ratio and percentages feel like usable tools rather than separate mysteries.

| Ch | Title | AQA links | mapsToMathsGroups | Gap? | studentPath |
|----|-------|-----------|-------------------|------|-------------|
| 1 | Algebra is just hidden numbers | A1, A2, A5 | `maths_expressions` | ✓ | `algebra-proportion-engine/algebra-is-just-hidden-numbers` |
| 2 | Simplifying and collecting terms | A1, A3, A4 | `maths_expressions` | ✓ | `algebra-proportion-engine/simplifying-and-collecting-terms` |
| 3 | Expanding, factorising and quadratics | A4, A18 | `maths_expressions`, `maths_quadratics` | ✓ | `algebra-proportion-engine/expanding-factorising-and-quadratics` |
| 4 | Solving equations and simultaneous equations | A17, A19, N3 | `maths_equations` | ✓ | `algebra-proportion-engine/solving-equations-and-simultaneous` |
| 5 | Formulae and rearranging | A2, A5, R11, R13 | `maths_expressions`, `maths_equations` (partial) | partial | `algebra-proportion-engine/formulae-and-rearranging` |
| 6 | Sequences and nth term | A23, A24, A25 | `maths_sequences`† | †not in mathsGroups.js | `algebra-proportion-engine/sequences-and-nth-term` |
| 7 | Ratios as shares | R3, R5, R8 | `maths_ratio`† | †not in mathsGroups.js | `algebra-proportion-engine/ratios-as-shares` |
| 8 | Percentages and money in the real world | R9, R16, N12 | `maths_percentages` | ✓ | `algebra-proportion-engine/percentages-and-money` |
| 9 | Direct proportion and best value | R1, R10, R13 | *(none)* | **GAP** | `algebra-proportion-engine/direct-proportion-and-best-value` |
| 10 | Speed, density and rates | R11, R12, R13, R14 | `maths_speed_density`† | †not in mathsGroups.js | `algebra-proportion-engine/speed-density-and-rates` |

---

### Module 3 — Graphs, shape and movement
**Goal:** Turn visual maths into reliable marks by linking diagrams, coordinates, shapes and measures.

| Ch | Title | AQA links | mapsToMathsGroups | Gap? | studentPath |
|----|-------|-----------|-------------------|------|-------------|
| 1 | Coordinates and straight lines | A8, A9, A12, A19 | `maths_graphs` (partial: linear only, not coordinates) | partial | `graphs-shape-movement/coordinates-and-straight-lines` |
| 2 | Linear graphs | A9, A10, A12, A14 | `maths_graphs` | ✓ | `graphs-shape-movement/linear-graphs` |
| 3 | Real-life and curved graphs | A12, A14, A15, R14 | *(none)* | **GAP** | `graphs-shape-movement/real-life-and-curved-graphs` |
| 4 | Angles everywhere | G3, G4, G6 | `maths_angles` | ✓ | `graphs-shape-movement/angles-everywhere` |
| 5 | Polygons and symmetry | G1, G2, G3 | `maths_angles` (partial: G1, G3; G2 symmetry = partial gap) | partial | `graphs-shape-movement/polygons-and-symmetry` |
| 6 | Transformations | G7, G8 | `maths_transforms` | ✓ | `graphs-shape-movement/transformations` |
| 7 | Perimeter and area basics | G16, G17, G18 | `maths_area` | ✓ | `graphs-shape-movement/perimeter-and-area-basics` |
| 8 | Circles and sectors | G9, G17, G18 | `maths_area` (partial: G17, G18; G9 circles not explicit) | partial | `graphs-shape-movement/circles-and-sectors` |
| 9 | 3D shapes and volume | G12, G13, G16, G17, G18 | `maths_volume` | ✓ | `graphs-shape-movement/3d-shapes-and-volume` |
| 10 | Units, scale and accuracy | N13, N14, N15, G15, G24 | `maths_rounding`† (partial: N14, N15 only; G15, G24 = gap) | **GAP** (G15, G24) | `graphs-shape-movement/units-scale-and-accuracy` |

---

### Module 4 — Data, chance and next-level tools
**Goal:** Cover probability, statistics and the grade 4–5 tools while continuing to mix earlier skills.

| Ch | Title | AQA links | mapsToMathsGroups | Gap? | studentPath |
|----|-------|-----------|-------------------|------|-------------|
| 1 | Probability basics | P1, P2, P3, P4 | `maths_probability`† | †not in mathsGroups.js | `data-chance-next-level/probability-basics` |
| 2 | Probability diagrams | N5, P6, P7 | `maths_probability`† (partial), `maths_primes` (N5 only) | †not in mathsGroups.js | `data-chance-next-level/probability-diagrams` |
| 3 | Tree diagrams and combined probability | P8, P9 | `maths_probability`† | †not in mathsGroups.js | `data-chance-next-level/tree-diagrams-and-combined-probability` |
| 4 | Averages and spread | S2, S4 | `maths_averages`† | †not in mathsGroups.js | `data-chance-next-level/averages-and-spread` |
| 5 | Tables and charts | S2, S3, S4 | `maths_charts`† | †not in mathsGroups.js | `data-chance-next-level/tables-and-charts` |
| 6 | Scatter graphs and correlation | S6 | `maths_charts`† (partial: S6 only) | †not in mathsGroups.js | `data-chance-next-level/scatter-graphs-and-correlation` |
| 7 | Pythagoras | G20, G21 | `maths_pythagoras` | ✓ | `data-chance-next-level/pythagoras` |
| 8 | Trigonometry | G20, G22 | `maths_pythagoras` (partial: G22 trig not a separate group) | partial | `data-chance-next-level/trigonometry` |
| 9 | Constructions, loci and bearings | G2, G15, G24 | `maths_constructions`† | †not in mathsGroups.js | `data-chance-next-level/constructions-loci-and-bearings` |
| 10 | Vectors and mixed problem moves | G25, A22, N5 | `maths_inequalities` (partial: A22 only; G25 vectors = no group) | **GAP** (G25 vectors) | `data-chance-next-level/vectors-and-mixed-problem-moves` |

**†** = ID is needed but not yet in `src/data/mathsGroups.js`. These must be added before those chapters are built.

---

## Layer 2: MATHS_GROUPS internal mapping

These 23 IDs exist in (or are needed by) `src/data/mathsGroups.js` for internal app use only.

| Group | ID | Spec codes | In mathsGroups.js? | Chapters that use it |
|-------|----|------------|-------------------|----------------------|
| Numbers | `maths_bidmas` | N2, N3 | ✓ confirmed | M1 Ch4 (primary), M1 Ch2 (partial) |
| Numbers | `maths_fractions` | N2, N8, N10, N11 | ✓ confirmed | M1 Ch8, M1 Ch9, M1 Ch10 (partial) |
| Numbers | `maths_indices` | N6, N7, N9 | ✓ confirmed | M1 Ch7 |
| Numbers | `maths_primes` | N4, N5 | ✓ confirmed | M1 Ch6, M4 Ch2 (N5 partial) |
| Numbers | `maths_percentages` | N12, R9 | ✓ confirmed | M2 Ch8 (primary), M1 Ch10 (partial) |
| Numbers | `maths_rounding` | N14, N15, N16 | **not yet in mathsGroups.js** | M1 Ch5 (primary), M3 Ch10 (partial) |
| Algebra | `maths_expressions` | A1, A2, A3, A4, A5 | ✓ confirmed | M2 Ch1, M2 Ch2, M2 Ch3 (partial), M2 Ch5 (partial) |
| Algebra | `maths_equations` | A17, A21 | ✓ confirmed | M2 Ch4 (primary), M2 Ch5 (partial) |
| Algebra | `maths_inequalities` | A22 | ✓ confirmed | M4 Ch10 (partial only — no dedicated chapter) |
| Algebra | `maths_graphs` | A8, A9, A10, A14 | ✓ confirmed | M3 Ch2 (primary), M3 Ch1 (partial) |
| Algebra | `maths_quadratics` | A11, A12, A18 | ✓ confirmed | M2 Ch3 (A18), M3 Ch3 (A12) |
| Algebra | `maths_sequences` | A23, A24, A25 | **not yet in mathsGroups.js** | M2 Ch6 |
| Geometry | `maths_angles` | G1, G3, G4, G6 | ✓ confirmed | M3 Ch4 (primary), M3 Ch5 (partial) |
| Geometry | `maths_area` | G14, G15, G16, G17 | ✓ confirmed | M3 Ch7 (primary), M3 Ch8 (partial) |
| Geometry | `maths_volume` | G12, G16, G17, G18 | ✓ confirmed | M3 Ch9 |
| Geometry | `maths_pythagoras` | G20, G21 | ✓ confirmed | M4 Ch7 (primary), M4 Ch8 (partial) |
| Geometry | `maths_transforms` | G7, G8, G24, G25 | ✓ confirmed | M3 Ch6 (primary) |
| Geometry | `maths_constructions` | G2, G13, G15 | **not yet in mathsGroups.js** | M4 Ch9 |
| Data | `maths_averages` | S4, S5 | **not yet in mathsGroups.js** | M4 Ch4 |
| Data | `maths_charts` | S1, S2, S6 | **not yet in mathsGroups.js** | M4 Ch5 (primary), M4 Ch6 (partial) |
| Data | `maths_probability` | P1–P8 | **not yet in mathsGroups.js** | M4 Ch1, M4 Ch2, M4 Ch3 |
| Ratio | `maths_ratio` | R1, R2, R4, R5, R6, R7, R8, R10 | **not yet in mathsGroups.js** | M2 Ch7 |
| Ratio | `maths_speed_density` | R1, R11, R13, R14 | **not yet in mathsGroups.js** | M2 Ch10 |

**IDs with no dedicated chapter in the 40-chapter spine:**
- `maths_inequalities` (A22) — embedded in M4 Ch10 (mixed) and implicitly in M2 Ch4 (equations); no standalone chapter. Flag as a gap during build review.

**Spec codes with no MATHS_GROUPS match:**
- G25 (vectors) — covered in M4 Ch10 but no `maths_vectors` group exists
- A15 (recognising quadratic/cubic/reciprocal shapes) — covered in M3 Ch3 but no exact group
- N13 (significant figures precision in context) — covered in M3 Ch10 but only partially under `maths_rounding`

### Legacy stubs requiring migration

- `math1` ("Maths Survival Basics", screenCount: 8) in `src/modules.js` — ID does not match `maths_*` pattern. Overlaps with M1 Ch4 (BIDMAS) and M1 Ch8/9 (fractions). Superseded by the 40-chapter spine.
- `math2` ("Fraction Foundations", screenCount: 9) — same issue. Overlaps with M1 Ch8 and M1 Ch9. Superseded by the 40-chapter spine.

---

## Exam frequency table (Paper 1 non-calculator, 7 papers: Jun19, Jun22, Jun23, Jun24, Nov20, Nov22, Nov23)

| Topic | Papers | Notes |
|-------|--------|-------|
| Basic arithmetic & BIDMAS | 7/7 | Always Q1-style opener |
| Fractions (all operations) | 7/7 | Mixed numbers, improper, dividing |
| Percentages (find/compare) | 7/7 | Also percentage increase/decrease |
| Ratio (share/simplify) | 7/7 | Often multi-step contextual |
| Averages (mean/median/mode) | 7/7 | Usually includes range |
| Angles (rules, polygons) | 7/7 | Parallel lines, isosceles triangle |
| Area & perimeter | 7/7 | Includes composite shapes |
| Sequences | 6/7 | nth term, term-to-term, arithmetic |
| Algebra (expand/simplify/substitute) | 7/7 | Always present |
| Linear equations | 6/7 | Often in context |
| Charts & graphs | 7/7 | Pictogram, bar, scatter, pie chart |
| Standard form | 5/7 | Often Paper 1 (non-calc) |
| Probability | 6/7 | Listing outcomes, P(not A), fractions |
| Direct proportion/conversion | 6/7 | Unit conversion, best value |
| Straight line graphs | 5/7 | y=mx+c, gradient, intersection |
| Indices (positive integer) | 5/7 | Laws, square/cube numbers |
| Volume (3D shapes) | 5/7 | Cylinders, cuboids |
| Pythagoras' theorem | 4/7 | Paper 1 tested without calculator |
| Systematic listing | 4/7 | Combinations, tree diagrams |
| Transformations | 4/7 | Translation (vector), reflection |
| Statistical comparison | 5/7 | Compare two data sets with stats |
| Scatter graphs | 4/7 | Correlation, line of best fit |
| Venn diagrams | 4/7 | Set notation, criticising diagrams |
| Inequalities | 3/7 | Number line representation |
| Quadratic expressions | 3/7 | Factorising x²+bx+c |
| Trigonometry (SOH CAH TOA) | 3/7 | Grade 4-5, sometimes appears P1 |
| Constructions | 2/7 | Bisectors, loci |
| Vectors | 3/7 | Column vectors, arithmetic |
| Compound interest | 2/7 | Usually calculator papers |

## Module architecture overview

See `00_AQA_Foundation_Architecture.md` in this directory for the full chapter build blueprint — including the 10-section chapter structure, completion checklist, MATHS_GROUPS gap analysis, and integration notes.

Full topic content, specification requirements, misconceptions, formula requirements, and exam angles: see `00_AQA_Foundation_Series_Content.md` in this directory.

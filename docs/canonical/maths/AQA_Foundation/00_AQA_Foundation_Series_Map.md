# AQA GCSE Maths Foundation — Series Map

## Series identity

- **Series name:** AQA GCSE Maths Foundation
- **Subject:** Maths
- **Exam board / qualification:** AQA GCSE Mathematics (8300), Foundation tier, grades 1–5
- **Series directory:** `docs/canonical/maths/AQA_Foundation/`
- **Canonical content base:** `docs/canonical/maths/`
- **App subject key:** `Maths`
- **App accent colour:** `#2DD4BF` (teal-green family)
- **Header images:** `/headers/maths-numbers.webp`, `/headers/maths-algebra.webp`, `/headers/maths-geometry.webp`, `/headers/maths-data.webp`
- **Existing data files:** `src/data/mathsTopics.js`, `src/data/mathsGroups.js`, `src/data/mathsQuestions.js`

## Series throughline

**The question every episode must answer:**
> "What does this topic look like in an AQA Foundation exam — and what do students need to do to not drop marks on it?"

**Throughline statement:**
Every episode bridges specification knowledge → confident exam execution. Maths is the subject where misconceptions are most punishing (a sign error costs 3 marks; not showing working costs everything). The series teaches students to understand WHY rules work, spot WHERE they go wrong, and build the habit of SHOWING METHOD.

**Five series pillars** (equivalent to History's agents of change — reference these in architecture files):
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

## Episode table

Each episode = one RISE Maths module. Grouped by MATHS_GROUPS from `src/data/mathsGroups.js`.

| # | Module ID | Title | Spec refs | Group | Exam priority | Build status |
|---|-----------|-------|-----------|-------|---------------|--------------|
| **GROUP 1: Numbers & Foundations** |
| 1 | `maths_bidmas` | Order of operations | N2, N3 | Numbers | Very high | Not yet built |
| 2 | `maths_fractions` | Fractions & Decimals | N2, N8, N10, N11 | Numbers | Very high | Not yet built |
| 3 | `maths_indices` | Indices & Standard form | N6, N7, N9 | Numbers | High | Not yet built |
| 4 | `maths_primes` | Primes, Factors & Multiples | N4, N5 | Numbers | High | Not yet built |
| 5 | `maths_percentages` | Percentages | N12, R9 | Numbers | Very high | Not yet built |
| 6 | *(new)* `maths_rounding` | Rounding & Estimation | N14, N15, N16 | Numbers | High | Not yet built |
| **GROUP 2: Algebra & Graphs** |
| 7 | `maths_expressions` | Expressions & Formulae | A1, A2, A3, A4, A5 | Algebra | Very high | Not yet built |
| 8 | `maths_equations` | Solving Equations | A17, A21 | Algebra | Very high | Not yet built |
| 9 | `maths_inequalities` | Inequalities | A22 | Algebra | Medium | Not yet built |
| 10 | `maths_graphs` | Straight Line Graphs | A8, A9, A10, A14 | Algebra | High | Not yet built |
| 11 | `maths_quadratics` | Quadratics & Functions | A11, A12, A18 | Algebra | Medium (grade 4–5) | Not yet built |
| 12 | *(new)* `maths_sequences` | Sequences | A23, A24, A25 | Algebra | High | Not yet built |
| **GROUP 3: Geometry & Measure** |
| 13 | `maths_angles` | Angles & Polygons | G1, G3, G4, G6 | Geometry | Very high | Not yet built |
| 14 | `maths_area` | Area & Perimeter | G14, G15, G16, G17 | Geometry | Very high | Not yet built |
| 15 | `maths_volume` | Volume & Surface Area | G12, G16, G17, G18 | Geometry | High | Not yet built |
| 16 | `maths_pythagoras` | Pythagoras & Trigonometry | G20, G21 | Geometry | High (grade 4–5) | Not yet built |
| 17 | `maths_transforms` | Transformations | G7, G8, G24, G25 | Geometry | Medium | Not yet built |
| 18 | *(new)* `maths_constructions` | Constructions & Loci | G2, G13, G15 | Geometry | Lower (grade 4–5) | Not yet built |
| **GROUP 4: Data, Probability & Statistics** |
| 19 | *(new)* `maths_averages` | Averages & Spread | S4, S5 | Data | Very high | Not yet built |
| 20 | *(new)* `maths_charts` | Charts & Diagrams | S1, S2, S6 | Data | High | Not yet built |
| 21 | *(new)* `maths_probability` | Probability | P1–P8 | Data | High | Not yet built |
| **GROUP 5: Ratio & Proportion** |
| 22 | *(new)* `maths_ratio` | Ratio & Proportion | R1, R2, R4, R5, R6, R7, R8, R10 | Ratio | Very high | Not yet built |
| 23 | *(new)* `maths_speed_density` | Speed, Density & Compound Measures | R1, R11, R13, R14 | Ratio | High | Not yet built |

**Note:** Modules `math1` (Maths Survival Basics) and `math2` (Fraction Foundations) exist in `src/modules.js` with different IDs than the planned MATHS_GROUPS structure. These are legacy stubs — their IDs do not match the `maths_*` pattern used in `mathsGroups.js`. They are superseded by the structured episode list above.

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

See `00_AQA_Foundation_Architecture.md` in this directory for the full module build blueprint.

Full topic content, specification requirements, misconceptions, formula requirements, and exam angles: see `00_AQA_Foundation_Series_Content.md` in this directory.

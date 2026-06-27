# AQA GCSE Maths Foundation — Series Content Reference

> **Primary consumer:** future Claude sessions building or auditing maths episodes.  
> **Do not summarise away detail** — this file replaces re-reading the source PDFs.  
> Source materials: AQA 8300 spec (2015), Pixl Formula Sheet (Foundation), AQA qual changes 2022, past papers Jun19/Nov20/Jun22/Nov22/Jun23/Nov23/Jun24 (Paper 1 non-calculator), mark schemes Jun22/Nov21/Nov22/Jun23/Nov23/Jun24/Nov24.

---

## 1. Identity

- **Subject:** Maths
- **Qualification:** AQA GCSE Mathematics (8300), Foundation tier, grades 1–5
- **Series:** AQA GCSE Maths Foundation
- **Course structure:** 4 modules × 10 chapters = **40 chapters** (canonical student-facing structure)
- **Modules:** Module 1 — Number survival kit / Module 2 — Algebra and proportion engine / Module 3 — Graphs, shape and movement / Module 4 — Data, chance and next-level tools
- **Series directory:** `docs/canonical/maths/AQA_Foundation/`
- **Architecture reference:** `00_AQA_Foundation_Architecture.md` (10-section chapter structure, MATHS_GROUPS gap analysis, build checklist)
- **Series spine:** `00_AQA_Foundation_Series_Map.md` (40-chapter table, two-layer architecture, MATHS_GROUPS internal mapping)
- **Note on MATHS_GROUPS:** The 23 IDs in `src/data/mathsGroups.js` are internal app identifiers for weakness tracking and question bank tagging. They are Layer 2 — not the canonical course structure. Do not build modules that map 1:1 to MATHS_GROUPS IDs. Build from the 40-chapter spine.

---

## 2. Series throughline & core argument

**Central claim:**
DRAFT (for user confirmation): Foundation GCSE Maths is not primarily a test of whether you remember rules — it is a test of whether you can show a method under pressure. Every mark scheme rewards process, not just answers. The student who writes working and gets a method mark when the answer is wrong beats the student who gets the right answer by 'magic' with no working shown. The series argues: understanding WHY a technique works is the fastest route to reliably SHOWING HOW it works.

**Evidence for the claim:**
- Mark schemes award M1 (method mark) independently of A1 (accuracy mark) — a student showing correct method with an arithmetic error still scores partial marks
- "Show working" questions (common at grade 4–5) are zero marks for answer-only responses
- AO1 (≈50% of marks): recall and routine procedure — rewards students who practice standard methods to automaticity
- AO2 (≈25%): reasoning and communication — explicitly tested; requires written chains of logic
- AO3 (≈25%): problem solving in context — requires recognising which technique applies, not just executing it
- Mark schemes consistently note "oe" (or equivalent) — alternative valid methods are rewarded; there is usually not one single algorithm

**Five series pillars** (use these to frame connections between episodes):
1. **Number sense** — underpins all other strands; fluency with operations and place value
2. **Algebraic thinking** — identifying structure, generalising, forming/solving equations
3. **Spatial reasoning** — visualising shapes, transformations, geometric relationships
4. **Proportional reasoning** — ratio, percentage, scale, compound measures as unified multiplicative thinking
5. **Statistical literacy** — reading/interpreting data; understanding that probability is a model, not a guarantee

---

## 3. Specification requirements — full topic inventory

Organised by AQA strand. Each spec code (N1, A1, etc.) maps to a Foundation-tier requirement. Three columns in AQA spec: Basic foundation / Additional foundation / Higher only — only Basic and Additional content is included below (Higher-only excluded).

---

### Strand 1: Number (N1–N16)

**Spec weighting: 25% of Foundation tier marks**

#### N1 — Order and comparison
- Order positive and negative integers, decimals and fractions
- Use symbols: =, ≠, <, >, ≤, ≥
- Number line: use to represent values including negatives and decimals
- Notes: see also A22 (inequalities)

#### N2 — Four operations
- Apply four operations (add, subtract, multiply, divide) to: integers, decimals, simple fractions (proper and improper), mixed numbers — all positive and negative
- Understand and use place value (very large/small numbers; decimals)
- Household finance vocabulary: profit, loss, cost price, selling price, debit, credit, balance, income tax, VAT, interest rate
- Notes: questions routinely set in context (shopping, wages, bills)

#### N3 — Order of operations
- Recognise and use relationships between operations including inverse operations (cancellation to simplify)
- Conventional notation for priority: brackets, powers, roots, reciprocals (BIDMAS/BODMAS)

#### N4 — Prime factorisation and factor/multiple vocabulary
- Prime numbers, factors (divisors), multiples, common factors, common multiples, HCF (highest common factor), LCM (lowest common multiple)
- Prime factorisation including product notation and unique factorisation theorem
- Product of prime factors written in index form (e.g. 2³ × 3²)

#### N5 — Systematic listing
- Apply systematic listing strategies (lists, tables, diagrams)
- Note: Higher adds product rule for counting; Foundation requires listing only

#### N6 — Powers and roots
- Positive integer powers and associated real roots (square, cube and higher)
- Recognise powers of 2, 3, 4, 5
- Square numbers up to 15 × 15 (students must know these)
- Know: 1000 = 10³, 1 million = 10⁶
- Estimate powers and roots (Additional foundation)

#### N7 — Integer and fractional indices
- Calculate with roots and with integer indices (Additional foundation)
- Note: fractional indices (e.g. x^(1/2)) are Higher only

#### N8 — Exact calculation with fractions and multiples of π
- Calculate exactly with fractions
- Calculate exactly with multiples of π (Additional foundation) — e.g. leave answer as 6π
- Note: surds (√2 etc.) are Higher only; see also G17, G18 for π in circle calculations

#### N9 — Standard form
- Calculate with and interpret standard form: A × 10ⁿ where 1 ≤ A < 10 and n is an integer
- With and without a calculator
- Interpret calculator displays showing standard form

#### N10 — Fractions and decimals
- Work interchangeably with terminating decimals and corresponding fractions (e.g. 3.5 and 7/2, or 0.375 and 3/8)
- Including ordering fractions and decimals
- Note: converting recurring decimals to fractions is Higher only

#### N11 — Fractions in ratio problems
- Identify and work with fractions in ratio problems (e.g. "what fraction of the total is the first share")
- Notes: see also R8

#### N12 — Percentages as operators
- Interpret fractions and percentages as operators (e.g. "find 35% of 240" using multiplier 0.35)
- Including interpreting percentage problems using a multiplier
- Notes: see also R9

#### N13 — Units of measure
- Standard units: mass, length, time, money and other measures (including compound measures)
- Know and use metric conversion factors for length, area, volume, capacity
- Imperial/metric conversions given in the question (not memorised, except miles/km sometimes tested)

#### N14 — Estimation
- Estimate answers by rounding (usually to 1 s.f. or nearest 10/100)
- Check calculations using approximation and estimation, including answers from technology
- Evaluate whether results are reasonable
- Notes: see also N15

#### N15 — Rounding and error intervals
- Round numbers and measures to specified degree of accuracy (decimal places or significant figures)
- Use inequality notation to specify simple error intervals due to truncation or rounding (Additional foundation)
- e.g. 3.5 ≤ x < 4.5 for x = 4 rounded to nearest integer
- Do NOT round during intermediate steps

#### N16 — Limits of accuracy
- Apply and interpret limits of accuracy (Additional foundation)
- Upper and lower bounds — Higher only

---

### Strand 2: Algebra (A1–A25)

**Spec weighting: 20% of Foundation tier marks**

#### A1 — Algebraic notation
- ab for a × b; 3y for y+y+y; a² for a×a; a³ for a×a×a; a²b for a×a×b
- a/b for a÷b; coefficients as fractions; brackets
- Answers must be given in simplest form without explicit instruction

#### A2 — Substitution
- Substitute numerical values into formulae and expressions, including scientific formulae
- Unfamiliar formulae given in the question

#### A3 — Vocabulary
- Expressions, equations, formulae, inequalities, terms, factors
- Note: identity (≡) is Additional foundation content

#### A4 — Simplifying and manipulating expressions
- Collecting like terms
- Multiplying a single term over a bracket (expanding single brackets)
- Taking out common factors (simple factorisation)
- Simplifying expressions involving sums, products and powers including laws of indices
- Expanding products of two binomials e.g. (x+3)(x−2) (Additional foundation)
- Factorising quadratic expressions x² + bx + c (Additional foundation)
- Difference of two squares (Additional foundation)

#### A5 — Standard formulae and rearrangement
- Understand and use standard mathematical formulae
- Rearrange formulae to change the subject (e.g. make r the subject of C = 2πr)
- Including formulae from other subjects in words or symbols

#### A6 — Equations vs identities
- Know difference between equation and identity (Additional foundation)
- Argue mathematically to show algebraic expressions are equivalent

#### A7 — Functions (input/output)
- Interpret simple expressions as functions with inputs and outputs (function machines)
- Higher only: inverse function, composite function

#### A8 — Coordinates
- Work with coordinates in all four quadrants

#### A9 — Straight line graphs
- Plot graphs of straight-line equations in coordinate plane
- Use y = mx + c to identify parallel lines (Additional foundation)
- Find equation of line through two given points or through one point with given gradient (Additional foundation)

#### A10 — Gradient and intercept
- Identify and interpret gradients and intercepts of linear functions graphically and algebraically

#### A11 — Quadratic functions
- Identify and interpret roots, intercepts and turning points of quadratic functions graphically (Additional foundation)
- Deduce roots algebraically (Additional foundation)
- Note: completing the square for turning points is Higher only

#### A12 — Recognise and sketch graphs
- Recognise, sketch, interpret: linear functions, quadratic functions
- Additional: simple cubic (y = x³), reciprocal (y = 1/x, x ≠ 0)
- Higher: exponential, trig functions

#### A13 — Transformations of graphs — Higher only

#### A14 — Real-context graphs
- Plot and interpret graphs of non-standard functions in real contexts
- Find approximate solutions to problems including kinematics (distance, speed, acceleration)
- Additional: reciprocal graphs

#### A15 — Rates of change from graphs — Higher only for gradient of curves

#### A17 — Solving linear equations
- Solve linear equations in one unknown algebraically, including with unknown on both sides (Additional)
- Find approximate solutions using a graph
- Including use of brackets

#### A18 — Solving quadratic equations
- Solve quadratic equations algebraically by factorising (Additional foundation)
- Find approximate solutions using a graph

#### A19 — Simultaneous equations
- Solve two simultaneous equations in two variables, linear/linear, algebraically (Additional foundation)
- Find approximate solutions graphically

#### A21 — Setting up and solving equations
- Translate situations into algebraic expressions or formulae (Additional foundation)
- Derive equation(s) and interpret solution in context
- Including geometrical problems

#### A22 — Linear inequalities
- Solve linear inequalities in one variable (Additional foundation)
- Represent solution set on number line
- Open circle = strict inequality (<, >); closed circle = included (≤, ≥)
- Dashed line = strict inequality in graphical work; solid line = included

#### A23 — Generating sequences
- Generate terms from a term-to-term rule or position-to-term rule
- Including sequences from patterns and diagrams

#### A24 — Recognising sequence types
- Triangular, square and cube numbers; simple arithmetic progressions
- Fibonacci-type sequences (Additional foundation)
- Quadratic sequences (Additional foundation)
- Simple geometric progressions rⁿ where r is rational > 0 (Additional foundation)

#### A25 — nth term of linear sequences
- Deduce expressions to calculate nth term of linear sequences
- Quadratic sequences — Higher only

---

### Strand 3: Ratio, Proportion and Rates of Change (R1–R16)

**Spec weighting: 25% of Foundation tier marks**

#### R1 — Unit conversions
- Change freely between: time, length, area, volume/capacity, mass, and compound units (speed, rates of pay, prices)
- Additional: compound units — density, pressure — in numerical and algebraic contexts

#### R2 — Scale factors, scale diagrams, maps
- Use scale factors, scale diagrams and maps
- Including geometrical problems

#### R3 — Expressing one quantity as a fraction of another
- Fraction less than 1 or greater than 1 (e.g. "what fraction of 80 is 120?")

#### R4 — Ratio notation
- Use ratio notation; reduce to simplest form (e.g. 15:25 → 3:5)

#### R5 — Dividing into a ratio
- Divide a given quantity into two parts in part:part or part:whole ratio
- Express division as a ratio
- Apply ratio to real contexts: conversion, comparison, scaling, mixing, concentrations
- Including best-buy/better-value problems

#### R6 — Multiplicative relationships
- Express multiplicative relationship between two quantities as a ratio or fraction

#### R7 — Proportion as equality of ratios
- Understand and use proportion as equality of ratios (e.g. if 3 items cost £4.50, 5 items cost…)

#### R8 — Ratio, fractions and linear functions
- Relate ratios to fractions and to linear functions
- See also N11, R14

#### R9 — Percentages — core
- Define percentage as number of parts per hundred
- Interpret percentages and percentage changes as fractions or decimals (multiplicative)
- Express one quantity as a percentage of another
- Compare two quantities using percentages
- Work with percentages > 100%
- Solve problems involving percentage change: increase/decrease and original value problems
- Simple interest in financial maths context

#### R10 — Direct and inverse proportion
- Solve problems involving direct and inverse proportion
- Including graphical and algebraic representations
- Direct: y ∝ x → y = kx; inverse: y ∝ 1/x → y = k/x

#### R11 — Compound units
- Speed, rates of pay, unit pricing (Basic foundation)
- Density and pressure (Additional foundation)
- Formulae: Speed = Distance ÷ Time; Density = Mass ÷ Volume; Pressure = Force ÷ Area

#### R12 — Compare lengths, areas, volumes using ratio
- Scale factors for lengths, areas, volumes
- Make links to similarity (Additional foundation)

#### R13 — Direct and inverse proportion equations
- Understand X inversely proportional to Y ≡ X proportional to 1/Y
- Interpret equations describing direct and inverse proportion (Additional foundation)

#### R14 — Gradient as rate of change
- Interpret gradient of straight-line graph as rate of change (Additional foundation)
- Recognise and interpret graphs illustrating direct and inverse proportion

#### R16 — Growth and decay
- Set up, solve and interpret answers in growth and decay problems including compound interest (Additional foundation)
- Formula: Total = P(1 + r/100)ⁿ (this formula is memorised, not given)

---

### Strand 4: Geometry and Measures (G1–G25)

**Spec weighting: 15% of Foundation tier marks**

#### G1 — Notation and vocabulary
- Points, lines, vertices, edges, planes, parallel lines, perpendicular lines, right angles
- Polygons, regular polygons; reflection and rotation symmetries
- Standard conventions for labelling sides and angles of triangles (lower case for sides, upper case for angles)
- Draw diagrams from written description

#### G2 — Constructions (Additional foundation)
- Standard ruler and compass constructions: perpendicular bisector of a line segment; perpendicular from/to a point; bisecting an angle
- Construct given figures; solve loci problems
- Including constructing 60° angle
- Shortest distance from point to line = perpendicular distance

#### G3 — Angles
- Angles at a point (360°); angles at a point on a straight line (180°); vertically opposite angles
- Alternate and corresponding angles on parallel lines (do NOT call them Z-angles or F-angles in exam)
- Angle sum of triangle = 180°; derive angle sum of any polygon = (n-2) × 180°
- Properties of regular polygons (interior and exterior angles)

#### G4 — Properties of quadrilaterals and triangles
- Square, rectangle, parallelogram, trapezium, kite, rhombus — properties and definitions
- Triangles: isosceles (2 equal sides/angles), equilateral (3 equal), scalene, right-angled, acute, obtuse
- Polygons: pentagon (5), hexagon (6), octagon (8), decagon (10)

#### G5 — Congruence criteria (Additional foundation)
- SSS, SAS, ASA, RHS

#### G6 — Geometric reasoning (Additional foundation)
- Apply angle facts, triangle congruence, similarity, quadrilateral properties to conjecture and derive results
- Including Pythagoras' theorem; base angles of isosceles triangle are equal
- Simple proofs using known results

#### G7 — Congruent and similar shapes
- Identify, describe and construct congruent and similar shapes including on coordinate axes
- By: rotation, reflection, translation, enlargement
- Additional foundation: fractional scale factors

#### G8 — Translations
- Use column vector notation for translations (e.g. (3, -2))

#### G9 — Circle vocabulary
- Centre, radius, chord, diameter, circumference (Basic foundation)
- Additional foundation: tangent, arc, sector, segment

#### G11 — Coordinate geometry
- Solve geometrical problems on coordinate axes (e.g. find midpoint, gradient, length)

#### G12 — 3D shapes
- Properties of faces, surfaces, edges, vertices: cubes, cuboids, prisms, cylinders, pyramids, cones, spheres

#### G13 — Plans and elevations
- Interpret plans and elevations of 3D shapes (Basic)
- Construct plans and elevations (Additional)

#### G14 — Standard units of measure
- Length, area, volume/capacity, mass, time, money

#### G15 — Measurement
- Measure line segments and angles in geometric figures
- Maps and scale drawings; bearings (8 compass points AND three-figure bearings, e.g. 035°)

#### G16 — Area and volume formulae
- Area of triangles (½ base × height), parallelograms (base × height), trapezia (½(a+b)h — formula must be memorised)
- Volume of cuboids (l × w × h) and other right prisms including cylinders (area of cross-section × length)

#### G17 — Circle formulae (MUST MEMORISE)
- Circumference = 2πr = πd
- Area of circle = πr²
- Calculate perimeters of 2D shapes including circles; areas of circles and composite shapes
- Additional: surface area and volume of spheres, pyramids, cones and composite solids (formulae GIVEN in exam)
- Solutions in terms of π may be required

#### G18 — Arc lengths and sectors (Additional foundation)
- Calculate arc lengths, angles and areas of sectors of circles
- Arc length = (θ/360) × 2πr; Sector area = (θ/360) × πr²

#### G19 — Congruence and similarity in context (Additional foundation)
- Apply concepts including relationships between lengths in similar figures

#### G20 — Pythagoras' theorem and trigonometry (Additional foundation)
- Pythagoras: a² + b² = c² where c is hypotenuse — MUST memorise
- Trigonometric ratios: sin = opposite/hypotenuse, cos = adjacent/hypotenuse, tan = opposite/adjacent (MUST memorise)
- Find angles and lengths in right-angled triangles in 2D figures
- Note: SOH CAH TOA mnemonic widely used

#### G21 — Exact trig values (Additional foundation)
- Know exact values of sin and cos for θ = 0°, 30°, 45°, 60°, 90°
- Know exact value of tan for θ = 0°, 30°, 45°, 60°
- Table of exact values:

| θ | sin θ | cos θ | tan θ |
|---|-------|-------|-------|
| 0° | 0 | 1 | 0 |
| 30° | 1/2 | √3/2 | 1/√3 |
| 45° | 1/√2 | 1/√2 | 1 |
| 60° | √3/2 | 1/2 | √3 |
| 90° | 1 | 0 | undefined |

#### G24 — Vectors
- Describe translations as 2D vectors (column vector notation)

#### G25 — Vector arithmetic (Additional foundation)
- Addition and subtraction of vectors; multiplication by scalar
- Diagrammatic and column representations

---

### Strand 5: Probability (P1–P9)

**Spec weighting: Combined with Statistics = 15% of Foundation tier marks**

#### P1 — Recording outcomes
- Record, describe and analyse frequency of outcomes using tables and frequency trees
- Probabilities written as fractions, decimals or percentages (NOT as "1 in 4" or "1 out of 4")

#### P2 — Expected outcomes
- Apply ideas of randomness, fairness and equally likely events
- Calculate expected outcomes of multiple future experiments

#### P3 — Relative frequency
- Relate relative expected frequencies to theoretical probability
- Use the 0-to-1 probability scale correctly

#### P4 — Mutually exclusive and exhaustive events
- Probabilities of an exhaustive set of outcomes sum to 1
- P(A) + P(not A) = 1

#### P5 — Increasing sample size (Additional foundation)
- Empirical unbiased samples tend toward theoretical probability distributions as sample size increases
- Large samples give better estimates of theoretical probability

#### P6 — Enumerating sets
- Enumerate sets and combinations of sets systematically: tables, grids, Venn diagrams
- Additional: including tree diagrams

#### P7 — Theoretical possibility spaces
- Construct theoretical possibility spaces for single and combined experiments (equally likely outcomes)
- Use to calculate theoretical probabilities

#### P8 — Combined events (Additional foundation)
- Calculate probability of independent and dependent combined events
- Including tree diagrams and other representations
- Know when to ADD (mutually exclusive) and when to MULTIPLY (independent events)
- P(A and B) = P(A) × P(B) for independent events

#### P9 — Conditional probability — Higher only

---

### Strand 6: Statistics (S1–S6)

**Spec weighting: Combined with Probability = 15% of Foundation tier marks**

#### S1 — Population and sampling
- Infer properties of populations or distributions from a sample (Additional foundation)
- Know limitations of sampling

#### S2 — Charts and diagrams
- Interpret and construct: frequency tables, bar charts, pie charts, pictograms (categorical data)
- Vertical line charts for ungrouped discrete numerical data
- Know appropriate use of each diagram type
- Additional: tables and line graphs for time series data

#### S3 — Grouped data (Higher only for histograms)
- Note: histograms with unequal class intervals are Higher only

#### S4 — Averages and spread
- Interpret, analyse and compare data distributions through:
  - Graphical representation (discrete, continuous, grouped data)
  - Measures of central tendency: median, mean, mode, modal class
  - Measures of spread: range, including consideration of outliers
  - Know terms: primary data, secondary data, discrete data, continuous data

#### S5 — Describing a population
- Apply statistics to describe a population

#### S6 — Scatter graphs and correlation
- Use and interpret scatter graphs of bivariate data
- Recognise correlation (positive, negative, no correlation; weak, strong)
- Additional: correlation does NOT indicate causation; draw estimated lines of best fit; make predictions; interpolate and extrapolate (and know dangers of extrapolation)

---

## 4. Content reference pack

### 4a. Formulae required by Foundation students

**Category A — Must memorise (not given in exam):**
- Circumference of circle: C = 2πr = πd
- Area of circle: A = πr²
- Pythagoras' theorem: a² + b² = c²
- Trigonometric ratios: sin = opp/hyp, cos = adj/hyp, tan = opp/adj
- Quadratic formula: x = (−b ± √(b²−4ac)) / 2a
- Compound interest: Total = P(1 + r/100)ⁿ
- Area of trapezium: A = ½(a+b)h
- Volume of prism: V = area of cross-section × length
- Speed = Distance ÷ Time
- Density = Mass ÷ Volume
- Pressure = Force ÷ Area

**Category B — Given in exam (on formula sheet):**
- Volume of sphere: V = 4/3 πr³
- Surface area of sphere: A = 4πr²
- Volume of cone: V = 1/3 πr²h
- Curved surface area of cone: A = πrl
- Kinematics: v = u + at; s = ut + ½at²; v² = u² + 2as

**Exact trig values (must memorise):**
- sin 30° = 1/2; cos 30° = √3/2; tan 30° = 1/√3
- sin 45° = 1/√2; cos 45° = 1/√2; tan 45° = 1
- sin 60° = √3/2; cos 60° = 1/2; tan 60° = √3
- sin 90° = 1; cos 90° = 0
- sin 0° = 0; cos 0° = 1; tan 0° = 0

### 4b. Key terms and definitions

**Number:**
- Prime number: a number with exactly two factors (1 and itself). Note: 1 is NOT prime.
- Factor: a number that divides exactly into another
- Multiple: the result of multiplying a number by a positive integer
- HCF (highest common factor): largest number that divides exactly into two or more numbers
- LCM (lowest common multiple): smallest number that is a multiple of two or more numbers
- Prime factorisation: expressing a number as a product of prime factors (e.g. 60 = 2² × 3 × 5)
- Square number: result of multiplying an integer by itself (1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225 — up to 15²=225)
- Cube number: 1, 8, 27, 64, 125, 216, 343, 512, 729, 1000
- Reciprocal: the reciprocal of x is 1/x
- Standard form: A × 10ⁿ where 1 ≤ A < 10 and n is an integer
- Terminating decimal: a decimal with a finite number of digits (e.g. 0.25, 0.375)
- Recurring decimal: a decimal where digits repeat (e.g. 0.333… = 1/3)
- Significant figure: first non-zero digit is the 1st significant figure
- Error interval: range of values that round to a given value; e.g. 4.5 ≤ x < 5.5 for x = 5 rounded to nearest integer

**Algebra:**
- Expression: a combination of terms (e.g. 3x + 4y)
- Equation: a statement that two expressions are equal with an unknown to solve (e.g. 3x + 4 = 10)
- Formula: a rule connecting variables using an equation (e.g. A = πr²)
- Identity: an equation true for all values of the variable (≡ symbol); e.g. 2(x+3) ≡ 2x + 6
- Inequality: a statement comparing two expressions using <, >, ≤, ≥
- Term: a single number or variable or product of numbers and variables
- Like terms: terms with identical variable parts (e.g. 3x and 7x are like terms)
- Coefficient: the numerical factor in a term (e.g. 5 in 5x)
- Expand: remove brackets by multiplying
- Factorise: write as a product of factors (reverse of expanding)
- Simplify: collect like terms / cancel / write in lowest form
- Gradient: the steepness of a line; change in y ÷ change in x = (y₂-y₁)/(x₂-x₁)
- y-intercept: where a line crosses the y-axis (the c in y = mx + c)
- Roots of a function: x-values where f(x) = 0 (where graph crosses x-axis)
- Nth term: a formula for the nth term of a sequence; for arithmetic: a + (n-1)d, or equivalently dn + (a-d)
- Arithmetic sequence: constant difference between consecutive terms
- Geometric sequence: constant ratio between consecutive terms

**Ratio & Proportion:**
- Ratio: a comparison of two or more quantities; e.g. 3:5 means 3 parts to 5 parts
- Proportion: a statement that two ratios are equal; or one quantity varying in relation to another
- Direct proportion: y = kx (as x doubles, y doubles); graph is a straight line through origin
- Inverse proportion: y = k/x (as x doubles, y halves); graph is a curve
- Scale factor: ratio of corresponding lengths in similar figures
- Percentage: number of parts per 100; x% = x/100
- Percentage increase/decrease: (change ÷ original) × 100
- Multiplier: decimal used to find percentage change; e.g. 1.15 for 15% increase, 0.85 for 15% decrease
- Compound interest: interest calculated on both principal and accumulated interest
- Density: mass per unit volume (D = M/V)
- Speed: distance per unit time (S = D/T)
- Pressure: force per unit area (P = F/A)

**Geometry:**
- Parallel lines: lines that never meet (same direction); marked with arrows
- Perpendicular lines: lines that meet at 90°
- Alternate angles: Z-angles (but do NOT call them Z-angles in exam); formed when a transversal crosses parallel lines; alternate angles are equal
- Corresponding angles: F-angles; formed when a transversal crosses parallel lines; corresponding angles are equal
- Co-interior angles: C-angles; sum to 180°
- Bearing: angle measured clockwise from North; always stated as 3 figures (e.g. 045°)
- Sector: a "pie slice" region bounded by two radii and an arc
- Segment: a region bounded by a chord and an arc
- Chord: a straight line joining two points on a circle (not passing through centre)
- Tangent: a line touching a circle at exactly one point; perpendicular to radius at that point
- Arc: part of the circumference of a circle
- Hypotenuse: longest side of a right-angled triangle; opposite the right angle
- Congruent: identical in shape and size (can be reflected/rotated/translated)
- Similar: same shape, different size; corresponding sides in same ratio; corresponding angles equal
- Enlargement: a transformation that changes size; scale factor k means all lengths multiplied by k
- Translation: slide without rotation or reflection; described by column vector
- Rotation: turn about a centre; defined by centre, angle and direction
- Reflection: mirror image; defined by mirror line
- Vector: quantity with magnitude and direction; written as column vector
- Locus (plural: loci): set of all points satisfying a given condition

**Statistics & Probability:**
- Mean: sum of values ÷ number of values
- Median: middle value when data ordered; if even number of values, mean of middle two
- Mode: most frequent value
- Range: largest value − smallest value
- Outlier: a value significantly different from others in a dataset
- Frequency table: table showing how often each value occurs
- Cumulative frequency: running total of frequencies
- Scatter graph: graph showing relationship between two variables
- Correlation: the strength and type of relationship between two variables
- Positive correlation: as x increases, y increases
- Negative correlation: as x increases, y decreases
- No correlation: no discernible pattern
- Line of best fit: a line drawn through the middle of scatter graph points to show the trend
- Interpolation: predicting within the data range (more reliable)
- Extrapolation: predicting outside the data range (less reliable)
- Probability: how likely an event is; P(event) = number of favourable outcomes ÷ total equally likely outcomes
- Relative frequency (experimental probability): frequency of outcome ÷ total trials
- Tree diagram: branching diagram showing probabilities of successive events
- Venn diagram: overlapping circles showing sets and their intersections
- Independent events: P(A and B) = P(A) × P(B)
- Mutually exclusive events: P(A or B) = P(A) + P(B)

### 4c. Common misconceptions (from mark schemes)

**Number:**
- Students give answers to division problems as "30" when answer is "300" — place value errors
- Incorrect order of operations: 60 ÷ 2 + 4 calculated as 60 ÷ 6 = 10 (wrong: should be 30 + 4 = 34)
- Rounding 31 to 30 but then multiplying by 18 rather than rounding 18 to 20 also
- Negative numbers: (−3) × 3 answered as 6 (forgetting negative sign)
- (−8)² answered as −64 (squaring the negative instead of squaring then making positive)
- Dividing a fraction: students invert the wrong fraction
- Mixed number division: not converting to improper fraction first
- Standard form: writing 8 × 10⁷ as answer when calculation requires 2 × 10² (losing track of base-10 arithmetic)
- Percentage of a quantity: treating "40% of 80" as "40 × 80 = 3200"

**Algebra:**
- Expanding brackets: (x+3)(x−2) → students write x² + 6 (forgetting cross terms)
- Substitution with negatives: T = 5P − W, P = −6 → 5 × (−6) = 30 not −30
- Sequences: computing term-to-term correctly but misidentifying nth term (confusing dn with dn + c)
- nth term of arithmetic sequence: writing 3n when it should be 3n + 2 (not adjusting for starting value)
- Setting up equations: "Sunita is x years old, Beth is one year younger" → written as x + 1 not x − 1
- Linear inequalities: reversing inequality sign when multiplying/dividing by positive (should only reverse for negative)
- Equation of line: students write gradient as m in "y = mx + c" correctly but confuse rise/run direction

**Ratio & Proportion:**
- Percentage increase: computing increase amount but not adding it back (£120 + 100% increase → student writes £100 not £240)
- Ratio sharing: sharing £96 in ratio 5:6 → student divides 96 by 5 and 6 separately instead of finding total parts first
- Best value: comparing unit prices but making arithmetic errors in division
- Fraction of an amount: "give 1/4 of Andrew's share" treated as "give £1.4" (decimal confusion)

**Geometry:**
- Angle rules: using "alternate" and "co-interior" angles on non-parallel lines
- Polygon angle sums: applying interior angle sum incorrectly (using exterior angle formula for interior or vice versa)
- Perimeter vs area: computing area when asked for perimeter and vice versa
- Area of composite shapes: counting area of cut-out region rather than subtracting it
- Circle area: calculating 2πr instead of πr² (confusing circumference formula with area)
- Pythagoras: squaring then adding then taking square root correctly, but adding instead of subtracting when finding a shorter side (a² = c² − b²)
- Trigonometry: using wrong ratio; confusing opposite/adjacent labelling
- Transformations: describing as "moved right 3 and up 2" rather than using column vector notation; rotating in wrong direction

**Statistics:**
- Scatter graphs: reading off y-value for given x incorrectly; drawing line through clusters of points rather than through middle
- Averages: finding median of even-numbered data by taking the lower middle value rather than averaging the two middle values
- Mean from frequency table: dividing frequency × value by number of rows instead of total frequency
- Outliers: students identify an outlier value but then include it in range calculation
- Probability: writing probability as "3 out of 5" instead of 3/5 or 0.6
- Combined probability: multiplying when should add (P(A or B) for mutually exclusive) or adding when should multiply (P(A and B) for independent)
- Tree diagram: not multiplying along branches (adding instead)

### 4d. Exam angles (from past paper analysis)

**Most common question formats (Paper 1 non-calculator):**

1. **Multi-step calculation in context** (3–5 marks) — e.g. "Leah buys 400g of cereal at 49p per 100g and 250g of pasta at 14p per 100g. Find total cost in £." Tests N2 + R11 + unit conversion. Mark scheme: M1 for method (correct multiplication), A1 for each correct sub-total, A1 final answer.

2. **Geometric reasoning with unknowns** (3–4 marks) — e.g. "Angle EBD = 5 × angle ABE, angle DBC = 3 × angle ABE. Work out angle EBD." Tests G3 (angles on a straight line). Students must set up equation: 5x + x + 3x = 180.

3. **Percentage problems** (3–4 marks) — e.g. "Shona has 14 dresses. 50% are red. She gives 5 to charity and buys 1 new red. What percentage are now red?" Tests N12 + R9. Common error: not updating total number of dresses.

4. **Ratio multi-step** (4–5 marks) — e.g. "Andrew and Bruce share in ratio 5:6. Bruce gets £96. Andrew gives 1/4 to Carl. Bruce gives 2/3 to Carl. How much does Carl get?" Tests R5 + N11 + N12.

5. **Averages problem** (2–3 marks) — e.g. "Write a set of five numbers with mode 8 and median 12." Tests S4. Mark scheme accepts any valid set; common errors include setting mode = median, or creating bimodal sets.

6. **Probability** (3–4 marks) — e.g. "Bag has red, blue and green discs. P(red)=1/8, P(blue)=2/5. There are 10 red discs. How many green?" Tests P4 + arithmetic with fractions. Students must find total (80), then green = 80 − 10 − 32 = 38.

7. **Standard form** (2 marks) — e.g. "Work out 80,000,000 ÷ 200. Give answer in standard form." Tests N9. Common error: correct value but wrong standard form notation.

8. **Sequences** (3 marks) — e.g. "The term-to-term rule is 'multiply by 2'. The 3rd term is 46. Work out the 1st term." Tests A23. Students must work backwards.

9. **Simultaneous equations / intersection of graphs** (3 marks) — e.g. "Draw y = 2x + 1 on the grid and find approximate solution to 7 − 3x = 2x + 1." Tests A9 + A19 graphically.

10. **Scatter graph with line of best fit** (4 marks) — e.g. "Players score points. Draw line of best fit and estimate lives for Jonah playing 15 hours." Tests S6.

11. **Expanding and solving** (2–5 marks) — e.g. "Expand and simplify 5(3x+4) − 2(x−1)." Tests A4. Common errors: sign error on second bracket (−2 × −1 = −2 not +2).

12. **Venn diagram criticism** (2 marks) — e.g. "25 study both Art and French, 10 study Art only, 41 study French total. Make two criticisms of the diagram." Tests P6/S4. Students must spot specific numeric errors.

13. **Algebraic fractions / mixed numbers division** (4 marks) — e.g. "Work out 2⅓ ÷ 4/5." Tests N8/N2. Students must convert mixed number to improper fraction first.

14. **Indices laws** (2–3 marks) — e.g. "Simplify 8 × 2⁶ × 2⁴. Give answer as a power of 2." Tests N6/N7/A4.

**Mark scheme patterns to teach:**
- "oe" (or equivalent): full marks for equivalent method or equivalent answer
- Method marks survive arithmetic errors: show working = never score zero if correct method
- Special cases (SC): common misconceptions sometimes awarded SC1 (e.g. SC1 for rounding error that leads to specific wrong answer)
- ft (follow through): if a student makes one error, subsequent work using their wrong value often still scored
- "May be seen": marks can be awarded for interim values seen in working even without being labelled

### 4e. 2022 qualification changes

From the AQA qualification changes document (2022 cohort adjustments):

**2022 Paper 1 (Non-calculator) covered:**
- Number: four operations, negatives, order of operations, estimation, fractions, indices, standard form, inequality notation, systematic listing
- Algebra: linear equations, recognise/plot/interpret graphs, sequences, formula, conversions
- Ratio: percentages (amount, as percentage), ratios (fraction, simplest form, to fraction), cost problems, density
- Geometry: shapes (naming), translations, area/perimeter (perimeter, sector), angles (in triangles), constructions (region)
- Statistics: two-way table, averages problem, outlier, probability (problem, Venn diagram)

**Formula sheet provided for all 3 papers in 2022 only** (exceptional measure post-COVID)

**Grade boundaries (typical Foundation):**
- Grade 5: approximately 50–60% of total marks
- Grade 4: approximately 35–45% of total marks
- Grade 1: approximately 10–15% of total marks

### 4f. Sourcing notes

**Files that contributed content to this synthesis:**
- `AQA8300SP2015.txt` — full specification; primary source for all spec codes N1–N16, A1–A25, R1–R16, G1–G25, P1–P9, S1–S6
- `Pixl_GCSE_Maths_Formula_Foundation.txt` — formula sheet; confirmed formula categories, DfE content codes
- `GCSEMathsFoundationQualificationchanges2022.txt` — 2022 changes; topic lists per paper, grade context
- `AQA83001FQPJUN22.txt` — question paper; 25 questions identified with topics
- `AQA83001FQPJUN23.txt` — question paper; 25 questions identified with topics
- `AQA83001FQPJUN24.txt` — question paper; topics identified through Q14
- `AQA83001FMSJUN22.txt` — mark scheme; misconception notes, SC marks, ft patterns
- `AQA83001FMSJUN23.txt` — mark scheme; cross-referenced
- Mark schemes Nov21, Nov22, Nov23, Jun24, Nov24 — used to verify topic frequency counts

**Files not contributing substantive content:**
- `AQAFoundationChecklist1.txt` — extracted as 0 bytes (image-based PDF; pdftotext produced no text)
- `AQA83001FQPNOV20.txt`, `AQA83001FQPNOV22.txt`, `AQA83001FQPNOV23.txt` — extracted successfully but only partially reviewed; topic patterns consistent with above analysis

**MISSING:** Detailed question-by-question analysis of Nov20, Nov22, Nov23 question papers — these would strengthen the exam frequency table but patterns are already well-established from the papers reviewed.

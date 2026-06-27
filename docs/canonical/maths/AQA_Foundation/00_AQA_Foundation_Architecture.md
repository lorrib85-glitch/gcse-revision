# AQA GCSE Maths Foundation — Architecture Reference

> **Primary consumer:** future Claude sessions building maths chapters.  
> **Content, formulae, key terms, misconceptions and exam angles:** see `00_AQA_Foundation_Series_Content.md`.  
> **Series spine (40-chapter table, MATHS_GROUPS mapping, two-layer architecture):** see `00_AQA_Foundation_Series_Map.md`.

---

## 1. Identity (brief)

- **Subject:** Maths
- **Qualification:** AQA GCSE Mathematics (8300), Foundation tier, grades 1–5
- **Series:** AQA GCSE Maths Foundation
- **Course structure:** 4 modules × 10 chapters = **40 chapters**
- **Series directory:** `docs/canonical/maths/AQA_Foundation/`
- **App subject key:** `Maths`
- **Build status:** Architecture defined — 40 chapters planned, 0 built (2 legacy stubs `math1`, `math2` exist in `src/modules.js` but are superseded by the 40-chapter spine)

---

## 2. Two-layer architecture — critical rule

### Layer 1: Student-facing course (40 chapters) — canonical build target

The course is structured as **4 modules × 10 chapters**. Every chapter is a discrete unit with its own content file, `src/modules.js` metadata entry, and `MODULE_CONTENT_LOADERS` registration.

- Module 1 — Number survival kit (`number-survival-kit`)
- Module 2 — Algebra and proportion engine (`algebra-proportion-engine`)
- Module 3 — Graphs, shape and movement (`graphs-shape-movement`)
- Module 4 — Data, chance and next-level tools (`data-chance-next-level`)

**All new maths content must build from the 40-chapter spine, not from MATHS_GROUPS.**

### Layer 2: Internal mapping (MATHS_GROUPS) — support layer only

The `MATHS_GROUPS` in `src/data/mathsGroups.js` are **not course units**. They serve:
- Exam Mode question bank organisation (`mathsTopics.js`, `mathsQuestions.js`)
- Weakness tag routing (`src/unifiedWeaknessTracker.js` → `tagModuleMap.js`)
- Planner repair task classification (`dailyPlanner.js`)
- Legacy `math1`/`math2` migration reference

MATHS_GROUPS IDs are used in weakness tags and question bank references *inside* chapter content files, but they are not the chapter's primary identifier.

---

## 3. Existing codebase state

### Files that currently hold maths content

| File | Role | Status |
|------|------|--------|
| `src/data/mathsTopics.js` | AQA past-paper question bank for Exam Mode | Active — 200+ questions organised by topic group |
| `src/data/mathsGroups.js` | `MATHS_GROUPS` — 4 topic groups for ModulesTab browser (Layer 2) | Active — defines 15 confirmed + 8 needed module IDs |
| `src/data/mathsQuestions.js` | `MATHS_FORMULA_SHEET` + `DIAGRAMS` + AQA past-paper questions | Active — primary exam-mode resource |
| `src/modules.js` (lines 730–763) | Metadata stubs for `math1` and `math2` | Legacy — superseded by 40-chapter spine |
| `src/content/maths/` | Per-chapter content files | Does not exist — maths content not yet built |

### Confirmed MATHS_GROUPS IDs (in `src/data/mathsGroups.js`)

**Group 1 — Numbers & Foundations** (`accent: '#2DD4BF'`, `headerImage: '/headers/maths-numbers.webp'`):
`maths_bidmas`, `maths_fractions`, `maths_indices`, `maths_primes`, `maths_percentages`

**Group 2 — Algebra & Graphs** (`accent: '#34D399'`, `headerImage: '/headers/maths-algebra.webp'`):
`maths_expressions`, `maths_equations`, `maths_inequalities`, `maths_graphs`, `maths_quadratics`

**Group 3 — Geometry & Measure** (`accent: '#4ADE80'`, `headerImage: '/headers/maths-geometry.webp'`):
`maths_angles`, `maths_area`, `maths_volume`, `maths_pythagoras`, `maths_transforms`

**Group 4 — Data, Probability & Statistics** (confirm accent and headerImage in `mathsGroups.js`):
Check `src/data/mathsGroups.js` directly — Group 4 contents not fully captured in this reference.

### MATHS_GROUPS IDs needed but not yet in `src/data/mathsGroups.js`

These must be added to `mathsGroups.js` before any chapter that references them is built:

| Needed ID | Spec codes | Chapter(s) that need it |
|-----------|------------|------------------------|
| `maths_rounding` | N14, N15, N16 | M1 Ch5, M3 Ch10 (partial) |
| `maths_sequences` | A23, A24, A25 | M2 Ch6 |
| `maths_ratio` | R1, R2, R4, R5, R6, R7, R8, R10 | M2 Ch7 |
| `maths_speed_density` | R1, R11, R13, R14 | M2 Ch10 |
| `maths_averages` | S4, S5 | M4 Ch4 |
| `maths_charts` | S1, S2, S6 | M4 Ch5, M4 Ch6 (partial) |
| `maths_probability` | P1–P8 | M4 Ch1, M4 Ch2, M4 Ch3 |
| `maths_constructions` | G2, G13, G15 | M4 Ch9 |

### Spec codes with no MATHS_GROUPS match (gaps to flag during build)

- **G25 (vectors)** — covered in M4 Ch10; no `maths_vectors` group exists → use tag `maths:vectors`
- **A15 (curved graph types)** — covered in M3 Ch3; no exact group → use tag `maths:curved-graphs`
- **A19 (simultaneous equations graphically)** — covered in M2 Ch4 and M3 Ch1 → use tag `maths:simultaneous-equations`
- **R12 (rates of change)** — covered in M2 Ch10 → use tag `maths:rates`
- **N13 (significant figures in context)** — covered in M3 Ch10 → subsume under `maths_rounding` tag

### `maths_inequalities` — chapter coverage note

`maths_inequalities` (A22) has no dedicated 40-chapter spine entry. A22 content is distributed:
- M2 Ch4 (solving equations) — inequalities solved similarly to equations
- M4 Ch10 (vectors and mixed problem moves) — inequality notation included in "mixed"

When building these chapters, ensure A22 content is explicitly covered and tagged `maths:inequalities`. Do not create a standalone inequalities chapter — the spine does not include one.

---

## 4. Chapter internal structure (10-section locked architecture)

Every maths chapter follows this 10-section structure. This replaces the former 6-section module architecture. Source: `aqa_gcse_maths_foundation_4_module_spine_UPDATED.txt`.

### Section 1 — Hook / why this matters (1–2 screens)
**Purpose:** Establish relevance and exam stakes. Surface a common misconception as a warm-up trap.
**Components:** `ChapterHookScreen`, `MisconceptionCheck`
**Rules:**
- Name the exam consequence (e.g. "this costs 3 marks in every paper")
- Name the series pillar this chapter connects to (Number sense / Algebraic thinking / Spatial reasoning / Proportional reasoning / Statistical literacy)

### Section 2 — Prior knowledge check (1–2 screens)
**Purpose:** Surface prerequisite gaps before new content is introduced.
**Components:** `QuickRecallScreen` (2–3 questions on prerequisite topics), `PriorKnowledgeRecall`
**Rules:**
- Questions must draw on spec codes from *earlier* chapters, not the current chapter
- Wrong answers log to `unifiedWeaknessTracker.js` with the prerequisite's tag, not the current chapter's tag
- Prerequisite skills must be stated explicitly in the chapter content file metadata

### Section 3 — Core idea in simple language (2–4 screens)
**Purpose:** Teach the GCSE content from first principles. Concrete before abstract.
**Components:** `VisualLearning`, `ConceptReveal`, `ExplainReveal`, `TheoryCompareBlock`, `GraphView`
**Rules:**
- Cover all spec codes listed in the Series Map for this chapter
- At least one fully worked example with all steps shown (model AO1 behaviour)
- Explicitly state spec codes covered (for traceability)

### Section 4 — Worked example (1–2 screens)
**Purpose:** Slow-motion walkthrough of one exam-quality problem. Show every step.
**Components:** `GuidedExamResponse`, `ExamQuestionFrame`
**Rules:**
- Show marks allocated per step (M1, A1, B1 labels or plain English equivalent)
- Flag "show working" expectation explicitly
- Use AQA wording patterns (e.g. "Give your answer as a fraction in its simplest form")

### Section 5 — Guided practice (1–2 screens)
**Purpose:** Student attempts a similar problem with scaffolding still visible.
**Components:** `FillInTheBlanksBlock`, `ColSortBlock`, `MatchingTask`
**Rules:**
- One interaction type per screen
- Feedback is immediate and specific (not just correct/incorrect)
- Must cover the core method from Section 4

### Section 6 — Spot the trap / common mistake (1 screen)
**Purpose:** Identify and name the most dangerous mark-losing error for this topic.
**Components:** `SpotTheError`, `MisconceptionCheck`
**Rules:**
- Trap must come from AQA mark scheme notes ("common errors") or known misconception patterns
- Student must identify the error, not just be told about it

### Section 7 — Maths in the wild (1 screen)
**Purpose:** Real-life or exam-context application of the chapter skill.
**Components:** `ExamQuestionFrame`, `QuickRecallScreen`, contextual scenario
**Rules:**
- This section is embedded in every chapter — it is NOT a separate module
- Use a genuine real-world hook from the spine (e.g. "Compare supermarket deals" for proportional reasoning)
- Must still test a GCSE skill, not just describe an application

### Section 8 — Mixed retrieval (1–2 screens)
**Purpose:** 2–4 questions from earlier chapters to interleave practice.
**Components:** `QuickRecallScreen`
**Rules:**
- Questions must come from previous chapters in the module or previous modules
- At least one question should be from a chapter not immediately adjacent (spaced retrieval)
- Wrong answers log to the tag of the *earlier chapter*, not the current one

### Section 9 — Examiner move (1–2 screens)
**Purpose:** Show exactly how this skill appears in AQA questions. Exam register and format.
**Components:** `ExamQuestionFrame` (past-paper extract), `FaceTheExaminer`, `GuidedExamResponse`
**Rules:**
- Must include at least one past-paper question from `mathsTopics.js` or `mathsQuestions.js`
- Must include at least one AO2 or AO3 task ("explain why", "show that", "justify")
- Must cover the full mark range for this topic (1-mark → 4–5-mark)
- Results feed `unifiedWeaknessTracker.js` — log correct/incorrect with topic tag

### Section 10 — Confidence check / next step (1 screen)
**Purpose:** Metacognitive close. Key facts summary. What to check. What comes next.
**Components:** `ChapterCompleteScreen`, `ConceptReveal`
**Rules:**
- List the formula(e) required for this chapter (Category A = must memorise, Category B = given)
- List the 3 most common errors from mark schemes
- Name a one-line exam tip about showing working
- Must NOT introduce new content — summary only
- Name which past papers contain this topic (e.g. "Appears in Jun22 Q10, Jun23 Q18")

---

## 5. Chapter completion checklist

Before marking any maths chapter as complete, verify all of the following:

- [ ] Section 1: misconception named with exam-consequence statement; series pillar identified
- [ ] Section 2: prerequisite skills listed; prior knowledge questions from earlier chapters only
- [ ] Section 3: all chapter spec codes (N_, A_, R_, G_, P_, S_) covered; at least one worked example
- [ ] Section 4: marks shown per step; "show working" expectation made explicit; AQA wording used
- [ ] Section 5: guided practice present; one interaction per screen; immediate specific feedback
- [ ] Section 6: trap from mark scheme or known misconception; student identifies error actively
- [ ] Section 7: "Maths in the wild" section present and teaches a GCSE skill in context
- [ ] Section 8: 2–4 mixed retrieval questions from previous chapters
- [ ] Section 9: at least one past-paper question; covers full mark range; AO2/AO3 task included
- [ ] Section 10: formulae listed (A/B category); top 3 errors from mark schemes; exam tip; past papers named
- [ ] Wrong answers throughout log to `unifiedWeaknessTracker.js` with correct topic tag
- [ ] Tags map to entries in `src/data/tagModuleMap.js` for WeakSpotRecovery routing
- [ ] `src/modules.js` entry added with correct `id`, `screenCount`, `screenTags`
- [ ] `MODULE_CONTENT_LOADERS` entry added in `src/app/LegacyApp.jsx`
- [ ] Content file created at `src/content/maths/<chapter-id>.js` (per-chapter pattern — NOT the legacy `src/modules/maths.js`)
- [ ] Any MATHS_GROUPS IDs referenced by this chapter exist in `src/data/mathsGroups.js`

---

## 6. Chapter content file structure

### File location
All maths chapter content files go to `src/content/maths/<chapter-id>.js` following the per-module pattern.
Never add maths content to `src/modules/maths.js` (legacy per-subject bundle — do not extend).

### Chapter ID convention
Format: `maths-<module-slug>-<chapter-slug>`
Examples:
- `maths-number-m1c1` (Module 1 Chapter 1) or descriptive: `maths-place-value`
- The exact ID convention is TBD for the first build — establish it for M1 Ch1 and keep consistent

### `src/modules.js` entry template
```js
{
  id: "maths-<chapter-id>",
  subject: "Maths",
  number: <chapter-number>,          // 1–40 across all modules, or 1–10 within module
  title: "<chapter title>",
  subtitle: "<chapter subtitle>",
  era: "<module name>",              // e.g. "Number survival kit"
  icon: "🔢",                        // or appropriate icon
  color: "#2DD4BF",
  colorLight: "rgba(45,212,191,.12)",
  headerImage: "/headers/maths-numbers.webp",  // pick appropriate header
  screenCount: <screens.length>,
  screenTags: <screens.map(s => s.tag ?? null)>,
},
```

### Content file export template
```js
export default {
  id: "maths-<chapter-id>",
  subject: "Maths",
  module: "<module-slug>",           // e.g. "number-survival-kit"
  moduleNumber: <1-4>,
  chapterNumber: <1-10>,
  title: "<chapter title>",
  aqaLinks: ["N1", "N2"],            // spec codes from Series Map
  mapsToMathsGroups: ["maths_bidmas"],  // Layer 2 internal mapping
  weaknessTags: ["maths:bidmas", "maths:order-of-operations"],
  prerequisiteChapters: [],          // chapter IDs of prior knowledge required
  screens: [
    // Section 1 — Hook (screens 1–2)
    // Section 2 — Prior knowledge check (screens 3–4)
    // Section 3 — Core idea (screens 5–8)
    // Section 4 — Worked example (screens 9–10)
    // Section 5 — Guided practice (screens 11–12)
    // Section 6 — Spot the trap (screen 13)
    // Section 7 — Maths in the wild (screen 14)
    // Section 8 — Mixed retrieval (screens 15–16)
    // Section 9 — Examiner move (screens 17–18)
    // Section 10 — Confidence check (screen 19)
  ],
};
```

---

## 7. Weakness tag system

Tags use the namespace `maths:<topic>`. Each tag must have an entry in `src/data/tagModuleMap.js`.

### Chapter weakness tags (canonical list)

| Chapter | Primary tags |
|---------|-------------|
| M1 Ch1: Place value | `maths:place-value`, `maths:ordering-numbers` |
| M1 Ch2: Four operations | `maths:four-operations`, `maths:written-methods` |
| M1 Ch3: Negative numbers | `maths:negative-numbers`, `maths:ordering-negatives` |
| M1 Ch4: BIDMAS | `maths:bidmas`, `maths:order-of-operations`, `maths:calculator-use` |
| M1 Ch5: Rounding | `maths:rounding`, `maths:significant-figures`, `maths:estimation` |
| M1 Ch6: Factors/primes | `maths:prime-numbers`, `maths:hcf-lcm`, `maths:prime-factorisation` |
| M1 Ch7: Powers/standard form | `maths:indices`, `maths:standard-form`, `maths:powers-roots` |
| M1 Ch8: Fractions basics | `maths:fractions-basic`, `maths:equivalent-fractions`, `maths:mixed-numbers` |
| M1 Ch9: Fraction calculations | `maths:fractions-operations`, `maths:dividing-fractions` |
| M1 Ch10: FDP conversion | `maths:fdp-conversion`, `maths:ordering-fdp` |
| M2 Ch1: Algebra notation | `maths:algebraic-notation`, `maths:substitution` |
| M2 Ch2: Simplifying | `maths:like-terms`, `maths:simplifying-expressions` |
| M2 Ch3: Expanding/factorising | `maths:expanding-brackets`, `maths:factorising`, `maths:quadratics` |
| M2 Ch4: Equations | `maths:linear-equations`, `maths:simultaneous-equations` |
| M2 Ch5: Formulae | `maths:formulae`, `maths:rearranging-formulae` |
| M2 Ch6: Sequences | `maths:sequences`, `maths:nth-term` |
| M2 Ch7: Ratio | `maths:ratio-sharing`, `maths:simplifying-ratios` |
| M2 Ch8: Percentages | `maths:percentages`, `maths:percentage-change`, `maths:compound-interest`, `maths:reverse-percentage` |
| M2 Ch9: Direct proportion | `maths:direct-proportion`, `maths:best-value`, `maths:unitary-method` |
| M2 Ch10: Speed/density | `maths:speed-distance-time`, `maths:density`, `maths:compound-measures` |
| M3 Ch1: Coordinates | `maths:coordinates`, `maths:midpoints` |
| M3 Ch2: Linear graphs | `maths:gradient`, `maths:y-intercept`, `maths:linear-graphs` |
| M3 Ch3: Curved graphs | `maths:distance-time-graphs`, `maths:curved-graphs`, `maths:interpreting-graphs` |
| M3 Ch4: Angles | `maths:angle-rules`, `maths:parallel-lines` |
| M3 Ch5: Polygons | `maths:interior-angles`, `maths:exterior-angles`, `maths:symmetry` |
| M3 Ch6: Transformations | `maths:reflection`, `maths:rotation`, `maths:translation`, `maths:enlargement` |
| M3 Ch7: Area basics | `maths:area`, `maths:perimeter`, `maths:compound-shapes` |
| M3 Ch8: Circles | `maths:circumference`, `maths:area-of-circle`, `maths:arc-length`, `maths:sector-area` |
| M3 Ch9: Volume | `maths:volume`, `maths:surface-area`, `maths:nets` |
| M3 Ch10: Units/scale | `maths:unit-conversion`, `maths:scale-drawings`, `maths:error-intervals` |
| M4 Ch1: Probability basics | `maths:probability-scale`, `maths:simple-probability`, `maths:relative-frequency` |
| M4 Ch2: Probability diagrams | `maths:sample-spaces`, `maths:venn-diagrams`, `maths:frequency-trees`, `maths:systematic-listing` |
| M4 Ch3: Tree diagrams | `maths:tree-diagrams`, `maths:combined-probability`, `maths:independent-events` |
| M4 Ch4: Averages | `maths:mean`, `maths:median`, `maths:mode`, `maths:range`, `maths:comparing-data` |
| M4 Ch5: Tables/charts | `maths:bar-charts`, `maths:pie-charts`, `maths:frequency-tables`, `maths:two-way-tables` |
| M4 Ch6: Scatter graphs | `maths:scatter-graphs`, `maths:correlation`, `maths:line-of-best-fit` |
| M4 Ch7: Pythagoras | `maths:pythagoras`, `maths:hypotenuse` |
| M4 Ch8: Trigonometry | `maths:sohcahtoa`, `maths:missing-sides`, `maths:missing-angles` |
| M4 Ch9: Constructions | `maths:constructions`, `maths:loci`, `maths:bearings` |
| M4 Ch10: Vectors | `maths:vectors`, `maths:column-vectors`, `maths:inequalities` |

---

## 8. Build recommendations

### Recommended build order (from spine authority)

The spine recommends building Module 1 first because weak number fluency blocks almost every other topic.

**Module 1 priority chapters (build first — highest exam frequency, prerequisite for other topics):**

1. **M1 Ch4: BIDMAS and calculator control** (N3, N6, N7)
   - Appears every paper; prerequisite for all algebra
   - MATHS_GROUPS: `maths_bidmas`
   - Exam example: Jun22 Q6b, Jun23 Q10
   - Trap: "60 ÷ 2 + 4 = 10" (treated as 60 ÷ 6)
   - Pillar: Number sense

2. **M1 Ch8+9: Fractions** (N8, N10, N11)
   - Appears every paper; prerequisite for ratio/percentages
   - MATHS_GROUPS: `maths_fractions`
   - Exam example: Jun22 Q12 (11/18 − 1/3), Jun23 Q25 (2⅓ ÷ 4/5)
   - Trap: dividing fractions by dividing numerators and denominators separately
   - Pillar: Number sense + Proportional reasoning

3. **M2 Ch8: Percentages and money** (N12, R9)
   - Appears every paper; high mark value
   - MATHS_GROUPS: `maths_percentages`
   - Exam example: Jun22 Q9, Jun23 Q12
   - Trap: percentage increase → not adding back to original
   - Pillar: Proportional reasoning

4. **M2 Ch7: Ratios as shares** (R3, R5, R8)
   - Appears every paper; often multi-step
   - MATHS_GROUPS: `maths_ratio` (needs adding to mathsGroups.js)
   - Exam example: Jun23 Q13, Jun23 Q19
   - Trap: dividing by one part of ratio instead of total parts
   - Pillar: Proportional reasoning

5. **M3 Ch4: Angles everywhere** (G3, G4, G6)
   - Appears every paper; marks often lost on notation
   - MATHS_GROUPS: `maths_angles`
   - Exam example: Jun22 Q10b, Jun23 Q17
   - Trap: calling alternate angles "Z-angles" (not acceptable in exam)
   - Pillar: Spatial reasoning

6. **M3 Ch7: Perimeter and area basics** (G16, G17, G18)
   - Appears every paper; composite shapes high value
   - MATHS_GROUPS: `maths_area`
   - Exam example: Jun23 Q15
   - Trap: using circumference formula (2πr) for area instead of πr²
   - Pillar: Spatial reasoning

7. **M2 Ch1+2: Algebra (notation, simplifying)** (A1, A2, A3, A4, A5)
   - Appears every paper
   - MATHS_GROUPS: `maths_expressions`
   - Exam example: Jun23 Q22
   - Trap: sign error on second bracket (−2(x−1) → −2x − 2 not −2x + 2)
   - Pillar: Algebraic thinking

8. **M4 Ch4: Averages and spread** (S2, S4)
   - Appears every paper; comparison questions common
   - MATHS_GROUPS: `maths_averages` (needs adding to mathsGroups.js)
   - Exam example: Jun22 Q8, Jun24 Q9
   - Trap: median of even-numbered set = lower middle value
   - Pillar: Statistical literacy

**Add diagnostic checkpoints after chapters M1 Ch3, M1 Ch6, and M1 Ch10** (as noted in spine build notes).

### Before building any chapter, verify:

1. All MATHS_GROUPS IDs referenced by this chapter exist in `src/data/mathsGroups.js` — add them if missing
2. All `weaknessTags` for this chapter have entries in `src/data/tagModuleMap.js`
3. Prerequisite chapters are identified and the prerequisite content is accessible via `MODULE_CONTENT_LOADERS`

---

## 9. Integration notes

### Content file location
All maths chapter content files go to `src/content/maths/<chapter-id>.js`.
Do not create or extend `src/modules/maths.js` (legacy per-subject bundle — do not use for new content).

### `MODULE_CONTENT_LOADERS` entry (in `src/app/LegacyApp.jsx`)
```js
'maths-<chapter-id>': () => import('./content/maths/<chapter-id>.js'),
```

### Exam question bank cross-reference
Before writing exam questions for Section 9, search `src/data/mathsTopics.js` and `src/data/mathsQuestions.js` for existing questions on this topic. Reuse rather than duplicate. The past-paper bank is already substantial.

### Legacy `math1` / `math2` migration
These stubs in `src/modules.js` have no content files and IDs that do not follow the `maths-*` pattern. Do not attempt to build content for them — they are superseded by:
- `math1` → M1 Ch4 (BIDMAS) + M1 Ch8/9 (fractions)
- `math2` → M1 Ch8/9 (fractions)

Once the 40-chapter spine modules exist, the legacy stubs can be removed from `src/modules.js`.

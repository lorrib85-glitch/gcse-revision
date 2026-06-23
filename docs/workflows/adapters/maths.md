# Subject adapter — Maths

Overrides and additions to the canonical topic pipeline for GCSE Maths
(AQA). Read this after Step 3 of the pipeline; apply every override below.

---

## Directory convention

Maths uses the new `docs/canonical/` location, organised by **skill cluster**
or **topic area** (matching AQA's strand organisation).

| Location |
|----------|
| `docs/canonical/maths/<topic>/00_<topic>_series_map.md` |
| `docs/canonical/maths/<topic>/<NN>_<episode>_Content.md` |
| `docs/canonical/maths/<topic>/<NN>_<episode>_Architecture.md` |

**Topic directory names** — lowercase, hyphens, matching AQA strand labels:

| Strand / topic | Directory |
|---------------|-----------|
| Number | `number` |
| Algebra | `algebra` |
| Ratio, proportion & rates of change | `ratio-and-proportion` |
| Geometry & measures | `geometry` |
| Probability | `probability` |
| Statistics | `statistics` |
| Sub-topic (e.g. quadratics within algebra) | `algebra/quadratics` |

For fine-grained topics (e.g. "solving linear equations"), nest under the
parent strand: `algebra/linear-equations`.

---

## Architecture convention

Always use the **two-file split per episode**: one `_Content.md` file and
one `_Architecture.md` file. Do not embed architecture in the spine —
each episode's knowledge and build mapping grow independently.

---

## Episode table columns

| # | Title | Skill focus | Prerequisite skills | Calculator | Tier | Retrieval priority |

- **Skill focus:** The specific mathematical operation or reasoning skill.
- **Prerequisite skills:** What a learner must already know before this
  episode makes sense. List them explicitly — do not assume prior knowledge
  is obvious.
- **Calculator:** `Calculator` / `Non-calculator` / `Both`.
- **Tier:** `Foundation` / `Higher` / `Both`.

---

## Additional spine fields per episode

Beyond the pipeline defaults, add:

- **Prerequisite skills:** Explicit list of what learners must already know.
  If prerequisites are not yet covered in the series, note them as
  `PREREQ MISSING: <skill>`.
- **Method steps:** The algorithm or method, written as numbered steps a
  learner can follow. Not a worked example — the general procedure.
- **Worked examples:** At least one fully worked example with all steps shown.
  Mark the exam trap step (the step most commonly wrong).
- **Calculator vs non-calculator:** Specify which. Different methods apply.
- **Exam traps:** The specific error most likely to cost marks on this topic.
  Write as: "Students often <error> — the correct approach is <correction>."
- **Fluency practice:** 3–5 practice question types (not answers — types) that
  build automaticity on this skill.

---

## Throughline framing

Maths throughline framing is **skill-based, not narrative-based**. Connect
every episode to:

1. **Prerequisite chain** — what earlier skills this episode builds on.
2. **Forward application** — where this skill appears in later topics or
   exam questions (e.g. "solving linear equations appears inside every
   simultaneous equations and inequality question").
3. **Reasoning vs procedure** — does this episode build procedural fluency,
   conceptual understanding, or both? State which.

Frame the throughline connection as: "This skill underpins X and appears
in Y type of exam question."

---

## Named evidence requirements

For every episode, identify:

- **Key formulae** — every formula students must recall or know how to
  apply, flagged `[F]` Foundation / `[H]` Higher / `[FH]` both.
- **Formulae given on the exam** — explicitly note which ones are provided
  on the AQA formula sheet so learners don't waste effort memorising them.
- **AQA exam question styles** — the specific question formats that test
  this skill (e.g. "Given that... find...", "Show that...", "Prove that...",
  "Estimate...").

---

## Validation additions (Maths-specific)

Add these checks to the Step 6 validation:

- [ ] Every AQA specification point in this skill area is mapped to an episode.
- [ ] Prerequisite skills are explicitly listed for every episode — none
  assumed without naming them.
- [ ] At least one worked example per episode with all steps shown.
- [ ] Exam traps are identified for every episode.
- [ ] Calculator and non-calculator methods are distinguished where they differ.
- [ ] Higher-only content is clearly flagged `[H]` throughout.
- [ ] Fluency practice types are listed — not just conceptual explanation.
- [ ] Mixed retrieval is addressed — at least one episode in the topic
  deliberately mixes this skill with a different previously-learned skill.
- [ ] The "show that" and "prove that" question types are addressed where
  the topic warrants them.

---

## Content reference pack sub-headings

Use these sub-headings:

- **Key formulae** (with tier flag, note if on AQA formula sheet)
- **Method steps** (the general procedure, numbered)
- **Worked examples** (fully worked, exam trap step marked)
- **Prerequisite skills** (explicit list)
- **Forward applications** (where this skill appears later)
- **Exam traps** (the specific error and the correct approach)
- **Fluency practice types** (question type descriptions — not answers)
- **Exam angles** (AQA question formats, mark allocations, command words)
- **Sourcing notes**

---

## Brand / style notes

Maths uses the subject palette defined in `src/constants/subjects.js` for
the Maths subject colour. Always import from there.

**Tone:** Precision and confidence. Maths content must never feel
intimidating — the design should feel like a trusted guide, not a test.

**Approach to method:** Step-by-step reasoning is the core UX. Every method
must be broken into steps a 15-year-old can follow on a phone screen.
One step per screen beat, not five steps dumped in one block.

**Avoid:**
- Dense algebra walls with no explanation of what each step achieves
- Assuming "it's obvious" for any step
- Skipping steps that are "trivial" — these are exactly the steps students get wrong
- Worked examples that only show correct answers without modelling the
  thinking process

---

## Global tags (examples)

- `aqa-maths`
- `number` / `algebra` / `geometry` / `ratio` / `statistics` / `probability`
- `calculator` / `non-calculator`
- `foundation` / `higher`
- `fluency` / `reasoning` / `problem-solving`
- `exam-trap`
- `show-that` / `prove-that` / `estimate`

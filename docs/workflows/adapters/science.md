# Subject adapter — Science

Overrides and additions to the canonical topic pipeline for GCSE Science:
Biology, Chemistry, Physics, and Combined Science (AQA). Read this after
Step 3 of the pipeline; apply every override below.

This adapter covers all three sciences. Where a rule is science-specific,
it is labelled **[Biology]**, **[Chemistry]**, **[Physics]**, or
**[Combined]**.

---

## Directory convention

Science uses the new `docs/canonical/` location. Use per-science directories:

| Subject | Location |
|---------|----------|
| Biology | `docs/canonical/biology/<topic>/00_<topic>_series_map.md` |
| Chemistry | `docs/canonical/chemistry/<topic>/00_<topic>_series_map.md` |
| Physics | `docs/canonical/physics/<topic>/00_<topic>_series_map.md` |
| Combined Science | `docs/canonical/combined-science/<topic>/00_<topic>_series_map.md` |

**Topic directory names** — lowercase, hyphens (match AQA chapter/topic
headings where possible):

Examples: `cell-biology`, `atomic-structure`, `forces`, `homeostasis`,
`rates-of-reaction`, `electricity`.

---

## Architecture convention

Architecture is **embedded in the spine by default**.

Create a separate architecture file when the topic is:

- **Interaction-heavy** — complex diagram sequences, multi-stage simulations,
  or required practical walkthroughs that need their own component mapping.
- **Asset-heavy** — multiple diagrams, microscopy images, or circuit drawings
  that require a separate asset list.

Document the reason in the spine if separating.

---

## Episode table columns

| # | Title | AQA spec ref | Required practical | Equations | Retrieval priority |

- **AQA spec ref:** The AQA spec point number (e.g. `4.1.1`, `5.3.2`).
- **Required practical:** Name of required practical if one falls in this
  episode, or `—`.
- **Equations:** Named equations students must recall (Higher / Foundation
  tier flag where relevant).

---

## Additional spine fields per episode

Beyond the pipeline defaults, add:

- **Spec references:** AQA spec point number(s) covered.
- **Required practical:** Full name and method summary if applicable.
- **Equations:** Every equation that must be recalled or applied, flagged
  `[F]` Foundation / `[H]` Higher / `[FH]` both.
- **Diagrams required:** Named diagrams or structures that must be recognised,
  labelled, or drawn.
- **Command words addressed:** Which command words appear in exam questions
  for this topic (e.g. describe, explain, evaluate, calculate, compare).
- **Working scientifically:** Which working scientifically skills this
  episode develops (variables, reliability, validity, graphing, error
  analysis).

---

## Throughline framing

Every episode must connect its content to the **science discipline's big
idea** — the overarching principle the topic is an example of:

- **[Biology]** Life processes require energy, materials, and information.
  Organisms are adapted to their environment through evolution.
- **[Chemistry]** Matter is made of particles; reactions involve rearranging
  atoms and transferring energy. Patterns in the periodic table predict
  behaviour.
- **[Physics]** Energy is conserved and transferred between stores. Forces
  cause changes in motion. Waves transfer energy without transferring matter.
- **[Combined]** Apply whichever of the above is relevant to the topic.

Frame the throughline as: "This episode is an example of [big idea]
because..."

---

## Named evidence requirements

For every episode, identify:

- **Required practicals** — full method, key variables (independent,
  dependent, control), expected results, sources of error.
- **Equations** — with units and standard form, flagged by tier.
- **Named scientists or discoveries** where the spec names them (e.g.
  Mendel, Darwin, Rutherford, Bohr).
- **Key misconceptions** — common student errors on this topic (these feed
  `MisconceptionCheck` components).

---

## Validation additions (Science-specific)

Add these checks to the Step 6 validation:

- [ ] Every AQA spec point number from Step 1c is mapped to an episode.
- [ ] Every required practical (AQA list) falling within this topic area is
  covered with method, variables, and expected results.
- [ ] Every named equation is flagged with tier (F / H / FH) and units.
- [ ] Every named diagram or structure is listed.
- [ ] Command words are distributed — not all "describe" or all "explain."
- [ ] At least one calculation or quantitative reasoning episode is included
  where the topic involves equations.
- [ ] Working scientifically skills are addressed — not purely recall-based.
- [ ] At least three `MisconceptionCheck`-ready statements are identified
  per topic.
- [ ] Higher-tier only content is clearly flagged `[H]` throughout.

---

## Content reference pack sub-headings

Use these sub-headings:

- **Key concepts & definitions** (precise scientific definitions — no
  colloquial paraphrasing)
- **Equations** (with units, tier flag, rearrangement notes)
- **Diagrams & structures** (name, what must be labelled, what must be drawn)
- **Required practicals** (name, method outline, variables, expected results)
- **Mechanism chains** (`X → Y` for biological processes, reaction pathways,
  force diagrams)
- **Exam angles** (command words, calculation types, common question stems)
- **Misconceptions** (precise false statements ready for MisconceptionCheck)
- **Sourcing notes**

---

## Brand / style notes

Science uses the subject palettes defined in `src/constants/subjects.js`.
Always import from there — never redefine locally.

- **[Biology]** Teal/green tones — cellular, living system feel.
- **[Chemistry]** Purple/indigo tones — molecular, structural feel.
- **[Physics]** Blue/cyan tones — energy, force, wave feel.

**Imagery direction:** Real microscopy, real apparatus, real phenomena —
no cartoon beakers or clip-art atoms. Diagrams must be scientifically
accurate.

**Avoid:** Oversimplified diagrams that would create misconceptions (e.g.
drawing electrons as rings rather than clouds). Educational accuracy
always overrides visual simplicity.

---

## Global tags (examples)

- `aqa-biology` / `aqa-chemistry` / `aqa-physics` / `aqa-combined-science`
- `required-practical`
- `higher-tier` / `foundation-tier`
- `equations` / `calculations`
- `working-scientifically`
- `misconception`
- Topic-specific: `cell-biology` / `atomic-structure` / `forces` / etc.

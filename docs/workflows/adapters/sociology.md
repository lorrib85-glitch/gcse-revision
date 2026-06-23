# Subject adapter — Sociology

Overrides and additions to the canonical topic pipeline for GCSE Sociology
(AQA). Read this after Step 3 of the pipeline; apply every override below.

---

## Directory convention

Sociology uses the new `docs/canonical/` location (no legacy content exists).

| Spine type | Location |
|-----------|----------|
| Per-topic spine | `docs/canonical/sociology/<topic>/00_<topic>_series_map.md` |
| Episode content files | `docs/canonical/sociology/<topic>/<NN>_<episode>_Content.md` |
| Episode architecture files | `docs/canonical/sociology/<topic>/<NN>_<episode>_Architecture.md` |

**Topic directory names** — lowercase, spaces → hyphens:

| Topic area | Directory |
|-----------|-----------|
| Families and households | `families` |
| Education | `education` |
| Crime and deviance | `crime-and-deviance` |
| Social stratification | `social-stratification` |
| Research methods | `research-methods` |
| New topic | Derive: `topic-slug` (lowercase, hyphens) |

---

## Architecture convention

Always use the **two-file split per episode**: one `_Content.md` file and
one `_Architecture.md` file. Do not embed architecture in the spine —
each episode's knowledge and build mapping grow independently.

---

## Episode table columns

| # | Title | Topic focus | Perspectives covered | Retrieval priority |

---

## Additional spine fields per episode

Beyond the pipeline defaults, add:

- **Perspectives covered:** Which sociological perspectives are addressed
  (Functionalism, Marxism / Neo-Marxism, Feminism, Interactionism, New Right,
  Postmodernism). At least two contrasting perspectives per episode.
- **Named sociologists:** Every named thinker required for the spec — surname,
  theory/claim in one line.
- **Research methods link:** How this topic connects to research methods
  (which method, which ethical issue, or which piece of evidence was gathered
  how).
- **12-mark argument structure:** The argument spine for this topic's 12-mark
  essay question — thesis, counter-argument, evaluation point.

---

## Throughline framing

Every episode must connect its content to the **AQA question every Sociology
exam asks implicitly:** "How does society shape individuals — and how do
individuals shape society?"

Frame throughline connections as debates between perspectives:
- Functionalists argue X → Marxists counter Y → Feminists add Z.
- The episode's central claim should state which perspective(s) the evidence
  most strongly supports, and why.

---

## Named evidence requirements

For every episode, identify all of the following that the spec requires:

- **Named sociologists** with their theory or key claim (e.g. "Parsons —
  the family performs two irreducible functions").
- **Named studies or research** (e.g. "Willmott and Young — symmetrical
  family thesis").
- **Statistical evidence or trends** (e.g. "divorce rate tripled between
  1961 and 1991").
- **Key concepts** that must be defined by name (e.g. "dark figure of crime",
  "labelling theory", "meritocracy").

If spec material doesn't name a sociologist for a required concept: write
`MISSING: named sociologist for <concept> — source from AQA spec or revision guide`.

---

## Validation additions (Sociology-specific)

Add these checks to the Step 6 validation:

- [ ] At least two contrasting sociological perspectives are represented in
  every episode.
- [ ] Every named sociologist required by the spec appears in at least one
  episode's Named evidence field.
- [ ] Every key concept is defined precisely — no vague or circular definitions.
- [ ] A research methods link is present for every topic area.
- [ ] The 12-mark argument structure is addressed in at least one episode
  per topic area.
- [ ] Statistical trends or empirical evidence supports claims wherever
  possible — not just theoretical assertion.
- [ ] The AQA Sociology assessment objectives are mapped:
  - AO1 (knowledge and understanding) present in every episode
  - AO2 (application) present — applying concepts to scenarios
  - AO3 (analysis and evaluation) present — debate and assessment

---

## Content reference pack sub-headings

Use these sub-headings:

- **Key concepts & definitions**
- **Named sociologists** (surname, perspective, key claim — one line each)
- **Studies & research** (author, method, finding, evaluation point)
- **Statistical evidence & trends**
- **Perspectives comparison** (Functionalist / Marxist / Feminist / Interactionist view on this topic)
- **Exam angles** (2-mark, 4-mark, 6-mark, 12-mark question types)
- **Sourcing notes**

---

## Brand / style notes

Sociology uses a **mature, documentary/case-file aesthetic**. This is a
subject about real social issues, not abstract concepts.

**Palette:** Soft oat (`#F5EFE6`), stone (`#8B7D6B`), olive beige (`#6B7C4E`),
dark slate (`#1C2533`), near-black (`#0A0C0F`). Warm, grounded, serious.

**Tone:** Documentary, evidence-driven. Think social investigation, not
classroom worksheet.

**Avoid:**
- Childish family-tree clip art or cartoon nuclear family icons
- Generic neon styling
- Making sociological theory feel abstract or irrelevant — always ground it
  in real-world examples
- Presenting perspectives as equally valid without critical evaluation

**Imagery direction:** Documentary photography feel — candid, social realist.
Institutions, communities, workplaces, courts.

---

## Global tags (examples)

- `aqa-sociology`
- `families` / `education` / `crime-deviance` / `social-stratification`
- `functionalism` / `marxism` / `feminism` / `interactionism`
- `research-methods`
- `12-mark-essay`
- `named-sociologist`

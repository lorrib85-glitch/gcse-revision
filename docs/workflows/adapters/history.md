# Subject adapter — History

Overrides and additions to the canonical topic pipeline for GCSE History
(Edexcel). Read this after Step 3 of the pipeline; apply every override below.

---

## Directory convention

History uses **legacy locations** established before this pipeline. Do not
move content to `docs/canonical/history/`.

| Spine type | Location |
|-----------|----------|
| Subject-wide series spine | `docs/content/history/HISTORY_SERIES_MAP.md` |
| Episode content files | `docs/content/history/<Series_Dir>/<NN>_<Title>_Content.md` |
| Episode architecture files | `docs/content/history/<Series_Dir>/<NN>_<Title>_Architecture.md` |
| Module architecture doc | `docs/system/HISTORY_MODULE_ARCHITECTURE.md` |

**Series directory names** — fuzzy-match against what exists in
`docs/content/history/` rather than deriving algorithmically. Existing names:

| Series | Directory |
|--------|-----------|
| Medicine Through Time | `Medicine` |
| Spain and the New World | `Spain_and_the_New_World` |
| The USA, 1954–75: Conflict at Home and Abroad | `USA_1954-75` |
| Early Elizabethan England | `Elizabethan_England` |

For any new series: derive from series name (strip punctuation, spaces →
underscores, apply common abbreviations). Confirm with user before creating.

---

## Architecture convention

History uses **two separate files** per episode (not embedded):

- `<NN>_<Title>_Content.md` — knowledge, narrative, exam material
- `<NN>_<Title>_Architecture.md` — build mapping, section placement, gap analysis

The module architecture (Section 1–6 structure + Module Completion Test) lives
in `docs/system/HISTORY_MODULE_ARCHITECTURE.md`. Read this file in full when
building or auditing any History episode. Do not duplicate its content into
each episode file — reference it.

---

## Episode table columns

| # | Episode | GCSE topic | Current module | Notes |

- **GCSE topic** — the spec topic text, including Key Topic reference for
  Series 2–4 (e.g. "The USA in Transition, 1954–63 (Key Topic 1)").
- **Current module** — the `src/modules.js` id(s) that deliver this episode,
  or `—` if not yet built.

---

## Additional spine fields per episode

Beyond the pipeline defaults, add:

- **Era:** Date range (e.g. `c1250–1500`, `1954–63`).
- **Key Topic reference** (Series 2–4 only): full bullet text of Key Topic N
  from the spec structure list in `HISTORY_SERIES_MAP.md`.
- **Agents of change** (Medicine Through Time only): which of the five agents
  (War, Religion, Individuals, Government, Science & technology) this episode
  connects to.
- **Edexcel question types addressed:** `explain-why`, `source-utility`,
  `source-follow-up`, `how-far-do-you-agree`, `describe-two-features`,
  `explain-similar-different`.

---

## Throughline framing

**Medicine Through Time:** Frame every episode's core argument using the five
agents of change. Identify which agent(s) primarily explain the change or
continuity in this episode, and link to earlier/later episodes where the same
agent appears.

**Series 2–4:** Use whatever overarching framing the series section of
`HISTORY_SERIES_MAP.md` provides for that series. If none is present for a
new series, write `MISSING: series-level throughline framing — not yet defined
in HISTORY_SERIES_MAP.md`.

---

## Validation additions (History-specific)

Add these checks to the Step 6 validation:

- [ ] Chronology is accurate — dates and sequences checked against source material.
- [ ] Causation and consequence chains (`X → Y`) are present for all major events.
- [ ] Significance is addressed — why does this episode's content matter to the
  broader historical story?
- [ ] Source skills covered where relevant (source utility, source follow-up,
  interpretation questions).
- [ ] `explain-why` question type is addressed in exam skill focus for at least
  one episode per series (Medicine Through Time requirement).
- [ ] Five agents of change are referenced across the full series (Medicine
  Through Time only).

---

## Content reference pack sub-headings

Use these sub-headings in the content file's Section 4:

- **Dates & timeline**
- **Key people**
- **Key terms & definitions**
- **Case studies / named examples**
- **Causes & effects** (`X → Y` bullets)
- **Exam angles**
- **Sourcing notes**

---

## Brand / style notes

History uses the cinematic dark theme of the main app with no subject-specific
palette override — History modules inherit the default `#08090D` background and
teal accent. Header images are sourced from `/public/headers/history-*.png`.

Do not apply a custom subject palette to History modules.

---

## Global tags (examples)

- `edexcel-history`
- `medicine-through-time` / `elizabethan-england` / `usa-1954-75` / `spain-new-world`
- `causation` / `change-continuity` / `significance` / `source-skills`
- `explain-why` / `source-utility` / `how-far-do-you-agree`

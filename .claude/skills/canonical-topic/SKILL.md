---
name: canonical-topic
description: "Generate the canonical knowledge-source files for a GCSE History episode or series — synthesizes the series map, locked module architecture, current src/modules.js state, and session-provided source material into two structured, exhaustive reference files (a content file and an architecture file) per episode for future build/audit sessions"
argument-hint: "<episode title> | <series name>"
allowed-tools:
  - Read
  - Write
  - Glob
  - Grep
  - Bash
---

# Canonical topic generator

Generates two canonical knowledge-source files per History episode at
`docs/content/history/<Series_Dir>/<NN>_<Title_With_Underscores>_Content.md`
and `..._Architecture.md` — permanent, committed references that a future
Claude session will read *instead of* re-gathering source material, before
building or auditing that chapter.

The split is deliberate: the **content file** is the episode's knowledge
(facts, narrative, exam material) and can be reviewed/corrected on its own
merits; the **architecture file** is the build mapping (Section 1–6
placement, current-state assessment, recommendations) and can change
independently as the build evolves without touching the content record.

Together they synthesize:

1. **Session-provided source material** — spec excerpts, past papers, mark
   schemes, revision notes the user has shared earlier in this conversation
   as PDFs, extracted to plain text and searched per Step 0 below (do not
   `Read` source PDFs directly — see Step 0). Nothing here is copied into
   the repo separately — only the two synthesized files per episode are
   saved. Feeds mainly the content file.
2. `docs/content/history/HISTORY_SERIES_MAP.md` — episode identity, GCSE
   topic, and (Series 1 only) current build status. Feeds both files.
3. `docs/system/HISTORY_MODULE_ARCHITECTURE.md` (LOCKED) — the Section 1–6
   structure, "Typical Components" per section, and the 9-point Module
   Completion Test. Feeds the architecture file.
4. The matching entry/entries in `src/modules.js`, if built. Feeds the
   architecture file.

Only History has both a series map and a locked architecture doc today, so
this skill only runs against History. `$ARGUMENTS` is the episode title or
series name to generate.

## Content philosophy

**The primary consumer of every output file is another LLM** (a future
Claude session), not a human skimming the page. Write accordingly:

- **Completeness over brevity.** Include every fact, date, name, figure,
  cause-and-effect link, and exam-relevant detail found in the
  session-provided material and in the series map / architecture doc. Do
  not summarize away detail "for readability" — a future session reading
  this file should not need to re-read the original source material. If in
  doubt, include the fact.
- **Structure over prose.** Prefer bullet lists, nested bullets, explicit
  `X → Y` relationship lines, and tables over flowing paragraphs. Headings
  and sub-headings should make the file skimmable and greppable.
- **Never silently infer or invent.** If session-provided material doesn't
  cover something the spec/architecture implies is needed, do not fill the
  gap with plausible-sounding invented content:
  - Write `MISSING: <what's needed, and which sub-topic it covers>` —
    derived from the series map's GCSE topic / Key Topic description, so a
    future session knows exactly what to go and source.
  - Write `UNCERTAIN: <the fact, and what's uncertain about it>` for facts
    that are partially supported but not confidently confirmed.
- **Draft interpretive claims, don't assert them as settled.** For
  interpretive/thesis-level content (most notably the Storyline's Core
  takeaway, see Step 4 §2) that is derived rather than explicitly supplied
  by the user, write `DRAFT (for user confirmation): <claim>` rather than
  presenting it as confirmed fact.
- **Flag conflicts, don't resolve them silently.** If two pieces of
  session-provided material disagree (e.g. different dates for the same
  event), present both and write `CONFLICT: <description>` rather than
  picking one.

## Step 0 — Extract source PDFs to text

Source PDFs (specs, past papers, mark schemes, revision guides) are shared
as conversation attachments and can be large and numerous. Reading a PDF via
`Read` renders its pages as images and is expensive at scale — extract to
plain text once per session instead, then search the text.

For each PDF attachment referenced in this conversation that hasn't already
been extracted this session (check whether `/tmp/canonical-topic/<safe-stem>.txt`
already exists first — if so, reuse it and skip re-extraction):

- Derive `<safe-stem>` from the original filename: drop any upload-hash
  prefix and the `.pdf` extension, then replace non-alphanumeric characters
  with `_`.
- Ensure `/tmp/canonical-topic/` exists (`mkdir -p /tmp/canonical-topic`),
  then run
  `pdftotext -layout "<pdf-path>" "/tmp/canonical-topic/<safe-stem>.txt"`
  via Bash. If `pdftotext` is not found, run
  `apt-get update && apt-get install -y poppler-utils` once, then retry.
- Do NOT `Read` the original PDF. Extraction is a local operation and costs
  no model tokens regardless of the PDF's size or page count.

Keep a mental map of `<safe-stem>.txt → original filename / description` for
this session — these extracted files are reused for source-gathering across
every episode processed in this run, however many that is.

## Step 1 — Resolve mode

Read `docs/content/history/HISTORY_SERIES_MAP.md` in full.

Compare `$ARGUMENTS` (trimmed, case-insensitive, ignoring punctuation
differences such as apostrophes/smart quotes/commas/question marks) against:

- The four series titles: "Medicine Through Time", "Spain and the New
  World", "The USA, 1954-75: Conflict at Home and Abroad", "Early
  Elizabethan England".
- Every "Episode" cell across all four episode tables.

- **Series match** → series mode: process every row of that series's
  episode table, in order.
- **Episode match** → episode mode: process that single row.
- **No match** → stop. Tell the user `$ARGUMENTS` didn't match any series or
  episode name, and list the four series titles. Do not guess or invent an
  episode.

## Step 2 — Per-episode data gathering

For each episode being processed:

### 2a. Series map data

From the matched row: episode `#`, title (as written in the table), GCSE
topic / subtitle.

**Key Topic reference** (Series 2–4 only): the GCSE topic cell ends with
`(Key Topic N)`. Find that series's "Specification structure" list above the
episode table and pull Key Topic N's full bullet text as the reference.
Series 1 (Medicine Through Time) has no Key Topic numbering — omit this
field for Series 1 episodes.

### 2b. Build status

Series 1 only — Series 2–4 have no "Current module" column, so every
Series 2–4 episode is `Not yet built`.

Read this episode's "Current module" cell:

- `—` → `Not yet built`.
- Names two or more module ids joined by `+` (e.g. "mod3 + mod6") →
  `Built across <id-1> + <id-2> [+ ...]`.
- Names one module id (with or without a "(shared — see Episode N)"
  annotation) → scan every OTHER row in the Series 1 table for the same
  module id appearing in its "Current module" cell (including inside a
  "+"-joined list):
  - If any other row matches → `Built (shared) as <id> — also covers
    Episode(s) <N, N, ...>` (ascending, excluding this episode).
  - Otherwise → `Built as <id>`.

### 2c. Architecture doc

Read `docs/system/HISTORY_MODULE_ARCHITECTURE.md` in full. You'll reuse:

- The Section 1–6 structure (each section's purpose + "Typical Components").
- The 9-point Module Completion Test.
- The Interleaving Rule, and — for Medicine Through Time — the "five agents
  of change" from `HISTORY_SERIES_MAP.md`.

### 2d. Current src/modules.js entry/entries

If build status names one or more module ids: for each, grep `src/modules.js`
for `id: '<module-id>'` and read that module object's `title`, `subtitle`,
`era`, `hook`, `outcomes`, `recall`, and `screens` (each screen's `id`/`tag`
plus a one-line summary of its type and content).

For `Built (shared)` or `Built across` statuses, only note the
`hook`/`outcomes`/`recall`/screens relevant to *this* episode's GCSE topic —
not the whole module(s).

### 2e. Era

- If built: use the (first, if multiple) module's `era` field verbatim.
- If not built: derive a date range from the GCSE topic text or Key Topic
  reference if one is present (e.g. "Medieval Medicine c1250–1500" →
  `c1250–1500`); otherwise write "Not yet specified".

### 2f. Session-provided source material

Search (don't bulk-read) the files extracted in Step 0 for content relevant
to this episode's GCSE topic:

1. Build a keyword set for this episode from its GCSE topic text (2a), Key
   Topic reference (2a), and any strand/case-study wording already gathered
   for this episode or sibling episodes in the same series.
2. `Grep` each `/tmp/canonical-topic/*.txt` file for those keywords (case
   insensitive, with line numbers) to locate candidate regions.
3. For each match worth pursuing, `Read` only that line range (plus ~10–15
   lines of context) from the extracted `.txt` file — never the whole
   extracted file, and never the original PDF.
4. **Exclusion check**: if another episode in this series owns part of the
   same source content (e.g. Series 1 Episode 2 owns the Black Death case
   study within Key Topic 1, which Episode 1's source material also
   contains), exclude matched regions that clearly belong to that other
   episode's topic per the spec's strand/case-study boundaries. Note under
   "Session-provided source material" that such content exists in the
   source but is reserved for Episode `<N>` — don't duplicate it into this
   episode's file.

Note explicitly, per episode, whether material was found — don't carry
material from one episode's file into another's unless it's clearly
relevant to both.

### 2g. Storyline / core takeaway

Search this conversation for an explicit statement of this episode's central
argument — phrasing like "the core takeaway is...", "the storyline is...",
"the main point/thesis is...". If found, record it **verbatim** — this
becomes the content file's Storyline §Core takeaway, and must not be
paraphrased or "improved."

If no explicit statement exists for this episode:

- Look across 2f's material for a recurring single-cause pattern — especially
  `X → Y` cause/effect chains (Section 4 of the content file) that keep
  tracing back to the same root cause (e.g. multiple chains all rooting in
  "the Church controlled education/ideas"). A root cause repeated across
  several independent chains is a strong candidate for a **draft** takeaway.
- Do not invent a takeaway with no textual basis. See Step 4 §2 for how to
  write up the draft/missing cases.

## Step 3 — Resolve output paths

**Series directory:**

| Series | Directory |
|---|---|
| 1 — Medicine Through Time | `Medicine` |
| 2 — Spain and the 'New World' | `Spain_and_the_New_World` |
| 3 — The USA, 1954–75: Conflict at Home and Abroad | `USA_1954-75` |
| 4 — Early Elizabethan England | `Elizabethan_England` |

**Shared filename stem**, from the episode's title and `#`:

1. Take the title as written in the series map.
2. Strip punctuation: apostrophes, commas, colons, question marks, etc.
3. Replace spaces with underscores.
4. Prefix with the episode's `#`, zero-padded to 2 digits, plus underscore.

This gives `<NN>_<Title_With_Underscores>` — e.g. "Trust Me, I'm Following
Jupiter" (Ep 1) → `01_Trust_Me_Im_Following_Jupiter`. "Can You Win a
Guerrilla War?" (Ep 10, Series 3) → `10_Can_You_Win_a_Guerrilla_War`.

**Two output files per episode**, both in
`docs/content/history/<directory>/`:

- Content: `<stem>_Content.md`
- Architecture: `<stem>_Architecture.md`

E.g. Episode 1 → `docs/content/history/Medicine/01_Trust_Me_Im_Following_Jupiter_Content.md`
and `docs/content/history/Medicine/01_Trust_Me_Im_Following_Jupiter_Architecture.md`.

If either file already exists, overwrite it — each run represents the latest
synthesis. If a combined single-file version from a previous (pre-split) run
exists at `docs/content/history/<directory>/<stem>.md`, delete it after
writing the two new files — it is superseded.

## Step 4 — Write the content file

Write `docs/content/history/<directory>/<stem>_Content.md` as:

```markdown
# Episode <#>: <Title> — Content

## 1. Identity
...

## 2. Storyline
...

## 3. Specification requirements
...

## 4. Content reference pack
...
```

### 1. Identity

A bulleted key:value list: Episode number, Title, Subtitle/GCSE topic, Era
(2e), Key Topic reference (2a — omit for Series 1).

### 2. Storyline

A short narrative-thesis section — the episode's central argument, the "so
what" that ties Sections 3–4 together and that a learner should be able to
articulate by the end of the chapter. This is **content** (a historical
interpretation/claim), not a build decision — how it gets threaded through
screens belongs in the architecture file's Build recommendations.

- **Core takeaway** — 2–4 sentences stating the episode's central argument,
  from 2g:
  - If 2g found an explicit user-supplied statement, reproduce it
    **verbatim**.
  - Else if 2g identified a recurring root-cause pattern, write `DRAFT (for
    user confirmation): <the proposed takeaway>` followed by a one-line note
    on which recurring chains it's drawn from.
  - Else write `MISSING: Storyline / core takeaway — ask the user for this
    episode's central argument before building.`
- **Evidence for the takeaway** — bulleted list (aim for 4–8) of specific
  facts or `X → Y` cause/effect chains from Section 4 below that demonstrate
  the core takeaway. Each bullet should be something a learner could cite as
  exam evidence for the judgement. Skip this if Core takeaway is `MISSING`.
- **Series throughline** — how this episode's takeaway connects to the wider
  series arc:
  - For Medicine Through Time, frame using the five agents of change (War,
    Religion, Individuals, Government, Science & technology) from
    `HISTORY_SERIES_MAP.md`, and name which earlier/later episode(s) this
    takeaway connects to via continuity or change.
  - For Series 2–4, use whatever overarching framing `HISTORY_SERIES_MAP.md`
    gives for that series. If none is given, write `MISSING: series-level
    throughline framing for <series> — not found in HISTORY_SERIES_MAP.md`.
- **Exam framing** — name the specific judgement-style exam questions (e.g.
  "how far do you agree") from Section 4's Exam angles where this takeaway
  *is* the winning argument — a learner who has internalised the Storyline
  already has that answer's spine. Skip if Core takeaway is `MISSING`.

### 3. Specification requirements

An exhaustive bulleted list of every specification requirement for this
topic, drawn from 2f's material — one bullet per sub-topic/concept, with
nested bullets for supporting detail (named examples, date ranges, key
terms). Do not condense multiple spec points into one bullet.

For any sub-topic the series map's GCSE topic / Key Topic description
implies but 2f's material does NOT cover, add a `MISSING:` bullet naming
that sub-topic specifically (e.g. `MISSING: the four humours theory and its
treatments — no spec excerpt covering this was shared`).

If 2f found NO material at all for this episode: state that explicitly as
one line, then list `MISSING:` bullets for every sub-topic implied by the
series map's GCSE topic / Key Topic description, drawing on general
knowledge of the Edexcel specification for that topic — this becomes the
sourcing checklist for the next session.

### 4. Content reference pack

Exhaustive, structured, bulleted, organized under these sub-headings:

- **Dates & timeline** — bulleted chronological list, one bullet per
  date/event.
- **Key people** — one bullet per person: name, role, 1–2 line
  significance.
- **Key terms & definitions** — one bullet per term.
- **Case studies / named examples** — one bullet per case study with the
  specific facts that make it examinable.
- **Causes & effects** — explicit `X → Y` bullets for every cause/effect
  relationship in the source material.
- **Exam angles** — bulleted: common question types for this topic, mark
  scheme patterns/keywords, and misconceptions worth a `MisconceptionCheck`
  (each stated precisely enough to write a true/false statement from later).
- **Sourcing notes** — which extracted source files contributed content,
  and any files/regions that produced nothing usable (e.g. zero-text PDFs,
  out-of-scope content reserved for another episode).

All drawn from 2f. If 2f found no material: state that explicitly as one
line, then list `MISSING:` bullets per sub-heading above, each naming what
kind of source material (spec excerpt / past paper / revision guide) would
fill it.

## Step 5 — Write the architecture file

Write `docs/content/history/<directory>/<stem>_Architecture.md` as:

```markdown
# Episode <#>: <Title> — Architecture

## 1. Identity (brief)
...

## 2. Architecture checklist (tailored)
...

## 3. Current state & gap analysis
...

## 4. Build recommendations
...
```

### 1. Identity (brief)

- Episode number, Title, Build status (2b).
- A pointer line: "Content, Storyline, Specification requirements and the
  full Content reference pack: see `<stem>_Content.md` in this directory."

### 2. Architecture checklist (tailored)

Per `docs/system/HISTORY_MODULE_ARCHITECTURE.md` (LOCKED). For each of
Section 1–6, a bullet block:

- **Section N — <name>**
  - Purpose: <from architecture doc, verbatim or near-verbatim>
  - Proposed content for this episode: bulleted list of every specific
    fact/concept from the content file's Section 3 (Specification
    requirements) and Section 4 (Content reference pack) that belongs in
    this slot — not a single summary sentence.
  - Suggested component(s): one or more from that section's "Typical
    Components" list, each with a one-line note on why it fits this
    episode's content.

End with the architecture doc's 9-point Module Completion Test, reproduced
verbatim as an unchecked Markdown checklist (`- [ ] ...` × 9).

### 3. Current state & gap analysis

- `Not yet built` → write exactly: `Not yet built — full rebuild from spec.`
- Any `Built...` status → a bulleted, screen-by-screen inventory: for each
  relevant hook/outcomes/recall/screen entry from 2d, its `id`/`tag`, a
  bulleted list of the specific facts/concepts it currently teaches, and
  which Section 1–6 slot (from Section 2 above) it maps to. Follow with a
  `GAPS:` bulleted list — every item from Section 2's "Proposed content" not
  covered by any existing screen.
- `Built (shared)` / `Built across` statuses → as above, scoped to only the
  screens/content relevant to *this* episode's topic, plus a `BUNDLING:`
  bullet naming the other episode(s) sharing the module(s) and what content
  belongs to them instead.

### 4. Build recommendations

A numbered, prioritized list. Lead with:

1. **Storyline integration** — how the content file's Storyline §Core
   takeaway should be threaded through the module as a recurring
   interleaving thread: name which Section 1–6 slots (from Section 2 above)
   revisit it, and with what new evidence each time, per the Interleaving
   Rule and the Module Completion Test's "Core chapter message is
   reinforced" point. If the Core takeaway is `MISSING` or `DRAFT`, say so
   here and note that this recommendation is blocked until it's resolved.

Then continue the numbered list combining Section 3's `GAPS:`/`BUNDLING:`
items and Section 2's "Suggested component(s)": what to build or fix next,
which component for each slot, and — for Medicine Through Time — which of
the five agents of change (from `HISTORY_SERIES_MAP.md`) each recommendation
connects to, plus interleaving links to concepts from earlier episodes per
the Interleaving Rule.

## Step 6 — Report back

After writing all files for this invocation, list each full path written —
content file then architecture file, per episode — one per line. For series
mode, also report counts by build status (e.g. "6 built, 4 built (shared), 2
built across two modules, 2 not yet built"), and for each episode note
whether the Storyline's Core takeaway was user-supplied verbatim, `DRAFT`, or
`MISSING`.

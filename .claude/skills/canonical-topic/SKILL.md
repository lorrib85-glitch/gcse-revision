---
name: canonical-topic
description: "Generate the canonical knowledge-source files for any GCSE subject episode or series — synthesizes the series spine, module architecture, current src/modules.js state, and session-provided source material into two structured, exhaustive reference files (a content file and an architecture file) per episode for future build/audit sessions"
argument-hint: "[<subject>: ]<episode title or series name>"
allowed-tools:
  - Read
  - Write
  - Glob
  - Grep
  - Bash
---

# Canonical topic generator

Generates two canonical knowledge-source files per episode at
`docs/content/<subject>/<Series_Dir>/<NN>_<Title_With_Underscores>_Content.md`
and `..._Architecture.md` — permanent, committed references that a future
Claude session will read *instead of* re-gathering source material, before
building or auditing that episode.

The split is deliberate: the **content file** is the episode's knowledge
(facts, narrative, exam material) and can be reviewed/corrected on its own
merits; the **architecture file** is the build mapping (section placement,
current-state assessment, recommendations) and can change independently as
the build evolves without touching the content record.

Together they synthesize:

1. **Session-provided source material** — spec excerpts, past papers, mark
   schemes, revision notes the user has shared earlier in this conversation
   as PDFs, extracted to plain text and searched per Step 0 below (do not
   `Read` source PDFs directly — see Step 0). Nothing here is copied into
   the repo separately — only the two synthesized files per episode are
   saved. Feeds mainly the content file.
2. **The subject's series spine** — the `00_*_Series_Map.md` file (per-text
   spines, e.g. English) or a subject-wide `<SUBJECT>_SERIES_MAP.md` file
   (e.g. History) that defines episode identity and the series throughline.
   Feeds both files.
3. **The module architecture** — either embedded inside the spine (English),
   or in a separate `docs/system/<SUBJECT>_MODULE_ARCHITECTURE.md` file
   (History). Feeds the architecture file.
4. The matching entry/entries in `src/modules.js`, if already built.
   Feeds the architecture file.

`$ARGUMENTS` format: `[<subject>: ]<episode title or series name>` — e.g.
`history: Medicine Through Time`, `english: An Inspector Calls`,
`Macbeth: A respectable room with cracks in it`, or just
`Trust me, I'm following Jupiter` if the episode is unambiguous across
all subjects.

## Content philosophy

**The primary consumer of every output file is another LLM** (a future
Claude session), not a human skimming the page. Write accordingly:

- **Completeness over brevity.** Include every fact, date, name, figure,
  cause-and-effect link, quote, and exam-relevant detail found in the
  session-provided material and in the spine / architecture doc. Do not
  summarize away detail "for readability" — a future session reading this
  file should not need to re-read the original source material. If in
  doubt, include the fact.
- **Structure over prose.** Prefer bullet lists, nested bullets, explicit
  `X → Y` relationship lines, and tables over flowing paragraphs. Headings
  and sub-headings should make the file skimmable and greppable.
- **Never silently infer or invent.** If session-provided material doesn't
  cover something the spec/architecture implies is needed, do not fill the
  gap with plausible-sounding invented content:
  - Write `MISSING: <what's needed, and which sub-topic it covers>` —
    derived from the spine's episode metadata / spec description, so a
    future session knows exactly what to go and source.
  - Write `UNCERTAIN: <the fact, and what's uncertain about it>` for facts
    that are partially supported but not confidently confirmed.
- **Draft interpretive claims, don't assert them as settled.** For
  interpretive/thesis-level content (most notably the Core argument's
  Central claim, see Step 4 §2) that is derived rather than explicitly
  supplied by the user, write `DRAFT (for user confirmation): <claim>`
  rather than presenting it as confirmed fact.
- **Flag conflicts, don't resolve them silently.** If two pieces of
  session-provided material disagree (e.g. different dates for the same
  event, or different readings of a quote), present both and write
  `CONFLICT: <description>` rather than picking one.

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

## Step 1 — Detect subject and resolve spine

### 1a. Parse subject and query from $ARGUMENTS

- If `$ARGUMENTS` contains `: ` (colon-space), split on the first
  occurrence: left side is the subject key (normalise to lowercase, trim),
  right side is the query.
- If no colon is present, treat the whole string as the query and leave the
  subject unknown for now — 1b will determine it from available spines.

### 1b. Discover available spine files

Glob `docs/content/` to find all subject directories. For each subject:

- Look for a **subject-wide spine**: `docs/content/<subject>/<SUBJECT_UPPER>_SERIES_MAP.md`
  (e.g. `docs/content/history/HISTORY_SERIES_MAP.md`).
- Look for **per-series spines**: `docs/content/<subject>/*/00_*_Series_Map.md`
  (e.g. `docs/content/english/An_Inspector_Calls/00_An_Inspector_Calls_Series_Map.md`).

Build a table of all spines found: subject, spine type (subject-wide /
per-series), spine path, series name (from the spine's main heading or
Series identity section), and — for per-series spines — the series
directory (the parent folder of the spine file relative to the subject root).

If a subject was given in 1a, only search that subject's spines. If the
subject was given but no spine is found in `docs/content/<subject>/`, stop
and report what was found.

### 1c. Match query against spines

For each candidate spine, Read it and compare the query (trimmed,
case-insensitive, ignoring apostrophes, commas, colons, question marks, and
other punctuation) against:

- The series name.
- Every episode title in the episode table.

Matching rules:
- **Series match** → series mode: process every episode row in that spine,
  in order.
- **Episode match** → episode mode: process that single row.
- **Ambiguous** (query matches an episode title in more than one spine)
  → stop. Tell the user the query matched in multiple subjects/series and
  list them — ask which one to use.
- **No match anywhere** → stop. Tell the user the query didn't match any
  series or episode name across any subject, and list every subject, series,
  and spine file found. Do not guess or invent an episode.

Record for each matched episode: subject, spine path, series name, series
directory, episode `#`, episode title, and every column of episode-level
metadata the spine's episode table provides.

### 1d. Locate the module architecture

For the matched subject/spine:

1. Check whether the spine contains a "Module architecture" section (heading
   text containing "architecture" or "module architecture",
   case-insensitive). If yes: **architecture is embedded** — reuse the
   already-read spine.
2. If not embedded: look for a separate architecture doc at
   `docs/system/<SUBJECT_UPPER>_MODULE_ARCHITECTURE.md`. If found, Read it.
3. If neither: write
   `MISSING: No module architecture found for <subject> — cannot complete
   the architecture file. Either add a "Module architecture" section to the
   series spine, or create docs/system/<SUBJECT_UPPER>_MODULE_ARCHITECTURE.md.`
   and halt for this subject.

## Step 2 — Per-episode data gathering

For each episode being processed:

### 2a. Spine data

From the matched episode row: episode `#`, title (as written in the spine),
and every column of episode-level metadata the spine provides.

**Common patterns (pull whichever apply):**

- History: GCSE topic text, Key Topic reference (Series 2–4 only — find
  Key Topic N in the spine's "Specification structure" list for that
  series), "Current module" cell, and "Notes".
- English Literature: Primary act/scene, Core focus, Retrieval priority.
- Any subject: record what is there; do not infer columns that aren't
  present.

**Key Topic reference (History, Series 2–4):** The GCSE topic cell ends
with `(Key Topic N)`. Find that series's spec structure list in the History
spine and pull Key Topic N's full bullet text as the reference. Series 1
(Medicine Through Time) has no Key Topic numbering — omit this field.

### 2b. Build status

Check `src/modules.js` for any module whose `title` (case-insensitive,
ignoring punctuation) matches the episode title, to supplement any explicit
"Current module" column in the spine.

Then determine status:

- Spine column absent **and** no `src/modules.js` title match → `Not yet built`.
- Spine column says `—` → `Not yet built`.
- `src/modules.js` has a title match: note the `id` field.
- Spine column lists two or more module ids joined by `+` → `Built across <id-1> + <id-2>`.
- Spine column or `src/modules.js` match names one id:
  - Check whether any other episode in the same spine references the same id.
  - If yes → `Built (shared) as <id> — also covers Episode(s) <N, N, ...>` (ascending, excluding this episode).
  - Otherwise → `Built as <id>`.

### 2c. Architecture sections

From the architecture source located in 1d (embedded in spine or separate
doc), extract:

- The ordered list of module sections (e.g. Section 1–6 for History and
  English), each with its name, purpose, and "Typical components" list.
- The Module Completion Test (numbered or bulleted checklist of pass
  criteria).
- Any interleaving rule or throughline rule.
- Any subject- or series-specific invariants (e.g. "every section must note
  a stagecraft device" for AIC, the Interleaving Rule and five agents of
  change for Medicine Through Time).

### 2d. Current src/modules.js entry/entries

If build status (2b) names one or more module ids: for each, grep
`src/modules.js` for `id: '<module-id>'` and read that module object's
`title`, `subtitle`, plus `hook`, `outcomes`, `recall`, and `screens`
(each screen's `id`/`tag` plus a one-line summary of its type and content).

For `Built (shared)` or `Built across` statuses, only note the
`hook`/`outcomes`/`recall`/screens relevant to *this* episode's content.

### 2e. Era / period

- If built: use the (first, if multiple) module's `era` field verbatim.
- If not built: derive a date range or period from the spine's episode
  metadata (2a):
  - History: from the GCSE topic text or Key Topic reference.
  - English Literature: the play's period (e.g. "Jacobean 1606" or
    "Edwardian 1912 / post-WWII 1945").
  - Other subjects: whatever temporal framing the spine provides.
  - If none: write "Not yet specified".

### 2f. Session-provided source material

Search (don't bulk-read) the files extracted in Step 0 for content
relevant to this episode's topic:

1. Build a keyword set from the episode's metadata (2a): topic text, core
   focus, act/scene, key people, key terms — whatever the spine provides.
2. `Grep` each `/tmp/canonical-topic/*.txt` for those keywords
   (case-insensitive, with line numbers) to locate candidate regions.
3. For each match worth pursuing, `Read` only that line range (plus ~10–15
   lines of context) from the `.txt` file — never the whole extracted file,
   and never the original PDF.
4. **Exclusion check**: if another episode in this spine clearly owns part
   of the same source content (e.g. a case study that belongs to Episode 3
   appearing while sourcing Episode 2), exclude that region and note it as
   "reserved for Episode `<N>`". Do not duplicate it into this episode's
   file.

Note explicitly, per episode, whether material was found — don't carry
material from one episode's file into another's unless it's clearly
relevant to both.

### 2g. Core argument / central takeaway

Search this conversation for an explicit statement of this episode's central
claim — phrasing like "the core takeaway is...", "the central argument
is...", "the storyline is...", "the main point/thesis is...", "the episode
is about...". If found, record it **verbatim**.

If no explicit statement exists:

- **History:** look across 2f's material for a recurring single-cause
  pattern — `X → Y` chains tracing back to the same root cause. A root
  cause repeated across several independent chains is a strong draft
  candidate.
- **English Literature:** look for the dominant interpretive claim about
  the author's method and message in this episode's scenes — e.g.
  "Priestley uses this scene to show that capitalism destroys individuals."
- **Any subject:** look for the "so what" — what a learner should be able
  to articulate about this episode in relation to the spine's series
  throughline.
- Do not invent a takeaway with no textual basis. See Step 4 §2 for how to
  write up the draft/missing cases.

## Step 3 — Resolve output paths

### 3a. Subject directory

`docs/content/<subject>/` where `<subject>` is the detected subject key
(lowercase).

### 3b. Series directory

- **Per-series spine** (a `00_*_Series_Map.md` file): the series directory
  is the parent folder of that spine file, relative to the subject root.
  E.g. spine at `docs/content/english/An_Inspector_Calls/00_...` →
  series dir = `An_Inspector_Calls`. No derivation needed.
- **Subject-wide spine** (e.g. `HISTORY_SERIES_MAP.md`): derive as follows:
  1. Glob existing directories under `docs/content/<subject>/` to find
     what already exists.
  2. Fuzzy-match the series name (strip punctuation, replace spaces with
     underscores, lowercase) against the existing directory names. If
     exactly one match is found, use that directory name verbatim.
  3. If no match is found, derive the name from the series title: strip
     punctuation, replace spaces with underscores, apply common
     abbreviations (e.g. "The USA, 1954-75: Conflict at Home and Abroad"
     → `USA_1954-75`), and create the directory if it doesn't exist.
  4. If multiple directories could match, halt and ask the user which to
     use.

### 3c. Episode filename stem

1. Take the episode title as written in the spine.
2. Strip punctuation: apostrophes, commas, colons, question marks, etc.
3. Replace spaces with underscores.
4. Prefix with episode `#`, zero-padded to 2 digits, plus underscore.
   → `<NN>_<Title_With_Underscores>`
   E.g. "A respectable room with cracks in it" (Ep 1) →
   `01_A_respectable_room_with_cracks_in_it`

### 3d. Output files

Both in `docs/content/<subject>/<series-dir>/`:
- Content: `<stem>_Content.md`
- Architecture: `<stem>_Architecture.md`

If either file already exists, overwrite it — each run represents the
latest synthesis. If a combined single-file version from a previous
(pre-split) run exists at `<stem>.md` (no suffix), delete it after writing
the two new files — it is superseded.

## Step 4 — Write the content file

Write `docs/content/<subject>/<series-dir>/<stem>_Content.md` as:

```markdown
# Episode <#>: <Title> — Content

## 1. Identity
...

## 2. Core argument
...

## 3. Specification requirements
...

## 4. Content reference pack
...
```

### 1. Identity

A bulleted key:value list. Always include: Episode number, Title, Subject,
Qualification / exam board (from spine), Series name. Then add every
episode-level metadata field from 2a — e.g.:

- History: Era (2e), GCSE topic, Key Topic reference (omit for Series 1).
- English Literature: Era/period (2e), Primary act, Core focus.
- Any subject: whatever the spine's episode table provides.

### 2. Core argument

The episode's central interpretive claim — the "so what" that ties Sections
3–4 together and that a learner should be able to articulate after
completing the module. This is **content** (an interpretive/analytical/
historical claim), not a build decision — how it gets threaded through
screens belongs in the architecture file.

- **Central claim** — 2–4 sentences, from 2g:
  - If 2g found an explicit user-supplied statement, reproduce it
    **verbatim**.
  - Else if 2g identified a strong draft candidate (recurring root cause,
    dominant interpretive claim), write `DRAFT (for user confirmation):
    <the proposed claim>` followed by a one-line note on its basis.
  - Else write `MISSING: Core argument — ask the user for this episode's
    central claim before building.`
- **Evidence for the claim** — bulleted list (aim for 4–8) of specific
  facts, quotes, or `X → Y` chains from Section 4 below that demonstrate
  the central claim. Each bullet should be something a learner could cite
  as evidence. Skip if Central claim is `MISSING`.
- **Series throughline connection** — how this episode's claim connects to
  the wider series throughline (from the spine). Use whatever throughline
  framing the spine provides:
  - **History (Medicine Through Time):** frame using the five agents of
    change (War, Religion, Individuals, Government, Science & technology)
    from `HISTORY_SERIES_MAP.md`, and name which earlier/later episode(s)
    this connects to via continuity or change.
  - **English Literature:** frame using the spine's "Series throughline"
    statement and "The question every episode must answer" framing.
  - **Any other subject:** use whatever throughline framing the spine
    defines. If the spine has no throughline framing, write
    `MISSING: series-level throughline framing not found in the series
    spine.`
  - For any subject: name which earlier/later episode(s) this connects
    to via continuity or contrast.
- **Exam framing** — name the specific exam question types (from Section
  4's Exam angles) where this episode's Central claim is the winning
  argument. Skip if Central claim is `MISSING`.

### 3. Specification requirements

An exhaustive bulleted list of every specification requirement for this
topic, drawn from 2f's material — one bullet per sub-topic/concept, with
nested bullets for supporting detail (named examples, date ranges, key
terms, quotes, techniques). Do not condense multiple spec points into one
bullet.

For any sub-topic the spine's episode metadata implies but 2f's material
does NOT cover, add a `MISSING:` bullet naming that sub-topic specifically
(e.g. `MISSING: the four humours theory and its treatments — no spec
excerpt covering this was shared`).

If 2f found NO material at all for this episode: state that explicitly as
one line, then list `MISSING:` bullets for every sub-topic implied by the
spine's episode metadata, drawing on general knowledge of the specification
— this becomes the sourcing checklist for the next session.

### 4. Content reference pack

Exhaustive, structured, bulleted, organized under these sub-headings. Adapt
the heading labels to fit the subject (notes in parentheses):

- **Dates & timeline** (History) / **Scene & act sequence** (English
  Literature) / **Chronology** (any subject) — one bullet per date/event,
  scene beat, or sequence step.
- **Key people / figures** — one bullet per person: name, role/identity,
  1–2 line significance.
- **Key terms & definitions** — one bullet per term. For English: also
  include literary techniques, devices, and critical vocabulary.
- **Case studies / named examples / key scenes** — one bullet per item
  with the specific facts, quotes, or details that make it examinable.
- **Causes & effects / Interpretive chains** — explicit `X → Y` bullets.
  For History: cause/effect. For English: `technique → effect on audience`.
  For Science: mechanism chains. Adapt the label as appropriate.
- **Exam angles** — bulleted: common question types for this topic, mark
  scheme patterns/keywords, and misconceptions worth a `MisconceptionCheck`
  (each stated precisely enough to write a true/false statement from later).
- **Sourcing notes** — which extracted source files contributed content,
  and any files/regions that produced nothing usable (zero-text PDFs,
  out-of-scope content reserved for another episode, etc.).

All drawn from 2f. If 2f found no material: state that explicitly as one
line, then list `MISSING:` bullets per sub-heading naming what kind of
source material (spec excerpt / past paper / revision guide / anthology)
would fill it.

## Step 5 — Write the architecture file

Write `docs/content/<subject>/<series-dir>/<stem>_Architecture.md` as:

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

- Episode number, Title, Subject, Build status (2b).
- A pointer line: "Content, Core argument, Specification requirements and
  the full Content reference pack: see `<stem>_Content.md` in this
  directory."

### 2. Architecture checklist (tailored)

From the module sections extracted in 2c. For each section in the locked
order:

- **Section N — <name>**
  - Purpose: <from the architecture doc/spine, verbatim or near-verbatim>
  - Proposed content for this episode: bulleted list of every specific
    fact/concept/quote/technique from the content file's Section 3
    (Specification requirements) and Section 4 (Content reference pack)
    that belongs in this slot — not a single summary sentence.
  - Suggested component(s): one or more from that section's "Typical
    Components" list, each with a one-line note on why it fits this
    episode's content.
  - Any subject- or series-specific rules for this section (e.g. "every
    Section 2 must note the relevant stagecraft device" for AIC, "every
    Section 3 must name an agent of change" for Medicine Through Time).

End with the Module Completion Test from 2c, reproduced verbatim as an
unchecked Markdown checklist (`- [ ] ...` × N).

### 3. Current state & gap analysis

- `Not yet built` → write exactly: `Not yet built — full build from spec.`
- Any `Built...` status → a bulleted, screen-by-screen inventory: for each
  relevant hook/outcomes/recall/screen from 2d, its `id`/`tag`, a bulleted
  list of the specific facts/concepts/quotes it currently teaches, and
  which section slot (from Section 2 above) it maps to. Follow with a
  `GAPS:` bulleted list — every item from Section 2's "Proposed content"
  not covered by any existing screen.
- `Built (shared)` / `Built across` statuses → as above, scoped to only
  the screens/content relevant to *this* episode's topic, plus a
  `BUNDLING:` bullet naming the other episode(s) sharing the module(s) and
  what content belongs to them instead.

### 4. Build recommendations

A numbered, prioritized list. Lead with:

1. **Core argument integration** — how the content file's Core argument
   should be threaded through the module as a recurring interleaving
   thread: name which section slots revisit it, and with what new
   evidence/quote/analysis each time, per any interleaving rule from 2c.
   If the Central claim is `MISSING` or `DRAFT`, say so and note that this
   recommendation is blocked until it's resolved.

Then continue the numbered list combining Section 3's `GAPS:`/`BUNDLING:`
items and Section 2's "Suggested component(s)": what to build or fix next,
which component for each slot. For each recommendation, note the relevant
connection to the series throughline and any exam technique implications:

- **History (Medicine Through Time):** name which of the five agents of
  change each recommendation connects to, and add interleaving links to
  concepts from earlier episodes per the Interleaving Rule.
- **English Literature:** note how each recommendation connects to the AOs
  (AO1 / AO2 / AO3) and the "question every episode must answer" framing.
- **Any other subject:** use whatever throughline or framework the spine
  defines.

## Step 6 — Report back

After writing all files for this invocation, list each full path written —
content file then architecture file, per episode — one per line. For series
mode, also report counts by build status (e.g. "6 built, 4 built shared,
2 not yet built"), and for each episode note whether the Core argument's
Central claim was user-supplied verbatim, `DRAFT`, or `MISSING`.

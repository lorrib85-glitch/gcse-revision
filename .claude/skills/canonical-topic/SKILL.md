---
name: canonical-topic
description: "Generate the canonical knowledge-source file for a GCSE History episode or series — synthesizes the series map, locked module architecture, current src/modules.js state, and session-provided source material into a structured, exhaustive reference for future build/audit sessions"
argument-hint: "<episode title> | <series name>"
allowed-tools:
  - Read
  - Write
  - Glob
  - Grep
---

# Canonical topic generator

Generates one canonical knowledge-source file per History episode at
`docs/content/history/<Series_Dir>/<NN>_<Title_With_Underscores>.md` — a
permanent, committed reference that a future Claude session will read
*instead of* re-gathering source material, before building or auditing that
chapter. It synthesizes:

1. **Session-provided source material** — spec excerpts, past papers, mark
   schemes, revision notes the user has shared earlier in this conversation
   (read PDFs via page-range `Read` calls for large documents). Nothing here
   is copied into the repo separately — only the synthesized file is saved.
2. `docs/content/history/HISTORY_SERIES_MAP.md` — episode identity, GCSE
   topic, and (Series 1 only) current build status.
3. `docs/system/HISTORY_MODULE_ARCHITECTURE.md` (LOCKED) — the Section 1–6
   structure, "Typical Components" per section, and the 9-point Module
   Completion Test.
4. The matching entry/entries in `src/modules.js`, if built.

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
- **Flag conflicts, don't resolve them silently.** If two pieces of
  session-provided material disagree (e.g. different dates for the same
  event), present both and write `CONFLICT: <description>` rather than
  picking one.

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

Scan the conversation for anything the user has shared relevant to this
episode's GCSE topic. Note explicitly, per episode, whether material was
found — don't carry material from one episode's file into another's unless
it's clearly relevant to both.

## Step 3 — Resolve output path

**Series directory:**

| Series | Directory |
|---|---|
| 1 — Medicine Through Time | `Medicine` |
| 2 — Spain and the 'New World' | `Spain_and_the_New_World` |
| 3 — The USA, 1954–75: Conflict at Home and Abroad | `USA_1954-75` |
| 4 — Early Elizabethan England | `Elizabethan_England` |

**Filename**, from the episode's title and `#`:

1. Take the title as written in the series map.
2. Strip punctuation: apostrophes, commas, colons, question marks, etc.
3. Replace spaces with underscores.
4. Prefix with the episode's `#`, zero-padded to 2 digits, plus underscore.
5. Append `.md`.

Examples: "Trust Me, I'm Following Jupiter" (Ep 1) →
`01_Trust_Me_Im_Following_Jupiter.md`. "Can You Win a Guerrilla War?" (Ep 10,
Series 3) → `10_Can_You_Win_a_Guerrilla_War.md`.

**Full path**: `docs/content/history/<directory>/<filename>`.

If the file already exists, overwrite it — each run represents the latest
synthesis.

## Step 4 — Write the canonical topic file

Write the file as:

```markdown
# Episode <#>: <Title>

## 1. Identity
...

## 2. Specification requirements
...

## 3. Architecture checklist (tailored)
...

## 4. Current state & gap analysis
...

## 5. Content reference pack
...

## 6. Build recommendations
...
```

### 1. Identity

A bulleted key:value list: Episode number, Title, Subtitle/GCSE topic, Era
(2e), Key Topic reference (2a — omit for Series 1), Build status (2b).

### 2. Specification requirements

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

### 3. Architecture checklist (tailored)

For each of Section 1–6 in `HISTORY_MODULE_ARCHITECTURE.md`, a bullet block:

- **Section N — <name>**
  - Purpose: <from architecture doc, verbatim or near-verbatim>
  - Proposed content for this episode: bulleted list of every specific
    fact/concept from section 2 above that belongs in this slot — not a
    single summary sentence.
  - Suggested component(s): one or more from that section's "Typical
    Components" list, each with a one-line note on why it fits this
    episode's content.

End with the architecture doc's 9-point Module Completion Test, reproduced
verbatim as an unchecked Markdown checklist (`- [ ] ...` × 9).

### 4. Current state & gap analysis

- `Not yet built` → write exactly: `Not yet built — full rebuild from spec.`
- Any `Built...` status → a bulleted, screen-by-screen inventory: for each
  relevant hook/outcomes/recall/screen entry from 2d, its `id`/`tag`, a
  bulleted list of the specific facts/concepts it currently teaches, and
  which Section 1–6 slot (from section 3) it maps to. Follow with a `GAPS:`
  bulleted list — every item from section 3's "Proposed content" not covered
  by any existing screen.
- `Built (shared)` / `Built across` statuses → as above, scoped to only the
  screens/content relevant to *this* episode's topic, plus a `BUNDLING:`
  bullet naming the other episode(s) sharing the module(s) and what content
  belongs to them instead.

### 5. Content reference pack

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

All drawn from 2f. If 2f found no material: state that explicitly as one
line, then list `MISSING:` bullets per sub-heading above, each naming what
kind of source material (spec excerpt / past paper / revision guide) would
fill it.

### 6. Build recommendations

A numbered, prioritized list combining section 4's `GAPS:`/`BUNDLING:` items
and section 3's "Suggested component(s)": what to build or fix first, which
component for each slot, and — for Medicine Through Time — which of the five
agents of change (from `HISTORY_SERIES_MAP.md`) each recommendation connects
to, plus interleaving links to concepts from earlier episodes per the
Interleaving Rule.

## Step 5 — Report back

After writing all files for this invocation, list each full path written,
one per line. For series mode, also report counts by build status (e.g. "6
built, 4 built (shared), 2 built across two modules, 2 not yet built").

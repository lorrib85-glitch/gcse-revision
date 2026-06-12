# Topic brief skill implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a project Claude Code skill, `.claude/skills/topic-brief/SKILL.md`, invoked as `/topic-brief <episode-or-series>`, that writes one permanent `docs/content/history/<Series>/<NN>_<Title>.md` brief per History episode by synthesizing the series map, the locked module architecture doc, the current `src/modules.js` entry (if built), and session-provided source material.

**Architecture:** A single SKILL.md containing step-by-step instructions for an LLM to follow: resolve whether `$ARGUMENTS` names a series or a single episode, gather per-episode data from three project docs plus the conversation, resolve the output path via a directory map + filename conversion rule, and write a fixed 6-section Markdown template. No application code changes — this only produces planning documents.

**Tech Stack:** Claude Code project skill (Markdown + YAML frontmatter), no build tooling involved.

**Reference spec:** `docs/superpowers/specs/2026-06-12-topic-brief-skill-design.md`

---

## Task 1: Write the `topic-brief` skill

**Files:**
- Create: `.claude/skills/topic-brief/SKILL.md`

- [ ] **Step 1: Write the skill file**

Create `/home/user/gcse-revision/.claude/skills/topic-brief/SKILL.md` with this exact content:

````markdown
---
name: topic-brief
description: "Generate a topic.md content brief for a GCSE History episode or series, synthesizing the series map, locked module architecture, current src/modules.js state, and session-provided source material"
argument-hint: "<episode title> | <series name>"
allowed-tools:
  - Read
  - Write
  - Glob
  - Grep
---

# Topic brief generator

Generates one `topic.md` per History episode at
`docs/content/history/<Series_Dir>/<NN>_<Title_With_Underscores>.md` — a
permanent, committed pre-build/audit reference synthesizing:

1. **Session-provided source material** — spec excerpts, past papers, mark
   schemes, revision notes the user has shared earlier in this conversation
   (read PDFs via page-range `Read` calls for large documents). Nothing here
   is copied into the repo separately — only the synthesized brief is saved.
2. `docs/content/history/HISTORY_SERIES_MAP.md` — episode identity, GCSE
   topic, and (Series 1 only) current build status.
3. `docs/system/HISTORY_MODULE_ARCHITECTURE.md` (LOCKED) — the Section 1–6
   structure, "Typical Components" per section, and the 9-point Module
   Completion Test.
4. The matching entry/entries in `src/modules.js`, if built.

Only History has both a series map and a locked architecture doc today, so
this skill only runs against History. `$ARGUMENTS` is the episode title or
series name to brief.

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
found — don't carry material from one episode's brief into another's unless
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

## Step 4 — Write topic.md

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

List: episode number, title, subtitle/GCSE topic, era (2e), Key Topic
reference (2a — omit for Series 1), and build status (2b).

### 2. Specification requirements

Summarize what the GCSE specification requires for this topic, drawn from
2f's material. If 2f found nothing, write "No spec material was provided for
this episode in this session." and fall back to summarizing the series map's
GCSE topic / Key Topic reference only.

### 3. Architecture checklist (tailored)

Walk through Section 1–6 from the architecture doc (2c). For each: state its
purpose, propose this episode's content for that slot (derived from section
2), and suggest one component from that section's "Typical Components" list.
End with the architecture doc's 9-point Module Completion Test as an
unchecked Markdown checklist (`- [ ] ...` × 9).

### 4. Current state & gap analysis

- `Not yet built` → write exactly: `Not yet built — full rebuild from spec.`
- `Built as <id>` → summarize the existing `hook`/`outcomes`/`recall`/
  `screens` (2d), map each screen to a Section 1–6 slot from section 3, and
  list what's missing against the Module Completion Test.
- `Built (shared) as <id> — also covers Episode(s) ...` → as above, scoped to
  only this episode's content within the shared module, and explicitly flag
  which other episodes share it.
- `Built across <id-1> + <id-2>` → as above, scoped to this episode's
  content across both modules, and explicitly note the split.

### 5. Content reference pack

Key facts, dates, people, case studies, and exam-angle notes (common
question types, mark scheme patterns, misconceptions worth a
`MisconceptionCheck`) drawn from 2f. If 2f found nothing, write "No source
material was provided for this episode in this session — content not
synthesized." rather than inventing content.

### 6. Build recommendations

A prioritized list combining section 4's gaps and section 3's suggestions:
what to build or fix first, which components to use per slot, and
interleaving links to concepts from earlier episodes (per the Interleaving
Rule, and — for Medicine Through Time — the five agents of change).

## Step 5 — Report back

After writing all files for this invocation, list each full path written,
one per line. For series mode, also report counts by build status (e.g. "6
built, 4 built (shared), 2 built across two modules, 2 not yet built").
````

- [ ] **Step 2: Verify the file structure**

Run:
```bash
grep -E "^(## Step|### 2[a-f]|name:|argument-hint:)" /home/user/gcse-revision/.claude/skills/topic-brief/SKILL.md
```

Expected output (in this order):
```
name: topic-brief
argument-hint: "<episode title> | <series name>"
## Step 1 — Resolve mode
## Step 2 — Per-episode data gathering
### 2a. Series map data
### 2b. Build status
### 2c. Architecture doc
### 2d. Current src/modules.js entry/entries
### 2e. Era
### 2f. Session-provided source material
## Step 3 — Resolve output path
## Step 4 — Write topic.md
## Step 5 — Report back
```

- [ ] **Step 3: Commit**

```bash
git add .claude/skills/topic-brief/SKILL.md
git commit -m "Add topic-brief skill for History chapter content briefs"
git push -u origin main
```

---

## Task 2: Verify episode mode across the three build-status shapes

This task exercises the skill on three Series 1 episodes covering each of
the build-status branches from Step 2b: a single dedicated module (Episode
8), a shared module (Episode 4, where `mod2` also covers Episodes 3 and 5),
and a not-yet-built episode (Episode 10). These three real `topic.md` files
are themselves part of the deliverable (per the design spec, output files
are permanent and committed).

**Files:**
- Create: `docs/content/history/Medicine/08_The_Great_Stink.md`
- Create: `docs/content/history/Medicine/04_The_Man_Who_Proved_Everyone_Wrong.md`
- Create: `docs/content/history/Medicine/10_The_Lady_with_the_Lamp.md`

- [ ] **Step 1: Invoke the skill for Episode 8 ("The Great Stink")**

Use the Skill tool with `skill: "topic-brief"`, `args: "The Great Stink"`.

Verify:
- `docs/content/history/Medicine/08_The_Great_Stink.md` was created.
- It has all six `## N. <Heading>` sections from Step 4's template, in
  order.
- Section 1 states build status `Built as mod5` (per
  `HISTORY_SERIES_MAP.md` row 8, which names only `mod5` and no other Series
  1 row references `mod5`).
- Section 1 has no "Key Topic reference" line (Series 1 episode).
- Section 3 ends with a 9-item unchecked checklist (`- [ ] ...` × 9) matching
  the Module Completion Test in `docs/system/HISTORY_MODULE_ARCHITECTURE.md`.
- Section 4 is not the literal "Not yet built" string — it summarizes
  `mod5`'s `hook`/`outcomes`/`recall`/`screens` and maps them to Section
  1–6 slots.

- [ ] **Step 2: Invoke the skill for Episode 4 ("The Man Who Proved Everyone Wrong")**

Use the Skill tool with `skill: "topic-brief"`, `args: "The Man Who Proved Everyone Wrong"`.

Verify:
- `docs/content/history/Medicine/04_The_Man_Who_Proved_Everyone_Wrong.md` was
  created.
- Section 1 states build status `Built (shared) as mod2 — also covers
  Episode(s) 3, 5` (per `HISTORY_SERIES_MAP.md`'s restructuring notes: `mod2`
  bundles Episodes 3, 4, 5).
- Section 4 explicitly flags that `mod2` is shared with Episodes 3 and 5,
  and focuses on Harvey/circulation-theory content (this episode's GCSE
  topic) rather than Vesalius (Episode 3) or the Great Plague (Episode 5)
  content.

- [ ] **Step 3: Invoke the skill for Episode 10 ("The Lady with the Lamp?")**

Use the Skill tool with `skill: "topic-brief"`, `args: "The Lady with the Lamp?"`.

Verify:
- `docs/content/history/Medicine/10_The_Lady_with_the_Lamp.md` was created
  (note: `?` stripped from the filename).
- Section 1 states build status `Not yet built`.
- Section 4 is exactly the literal string `Not yet built — full rebuild from
  spec.`
- Section 2 either summarizes session-provided Nightingale spec material, or
  — if none was shared in this session — states "No spec material was
  provided for this episode in this session." and falls back to the series
  map's GCSE topic ("Florence Nightingale").
- Section 5 either summarizes session-provided source material, or — if none
  was shared — states "No source material was provided for this episode in
  this session — content not synthesized."

- [ ] **Step 4: Fix any issues found**

If any of the three checks above fail because of ambiguous or incorrect
SKILL.md instructions (not because of a one-off LLM mistake), edit
`.claude/skills/topic-brief/SKILL.md` to clarify, then re-run the affected
invocation(s) from Step 1–3.

- [ ] **Step 5: Commit**

```bash
git add docs/content/history/Medicine/08_The_Great_Stink.md \
        docs/content/history/Medicine/04_The_Man_Who_Proved_Everyone_Wrong.md \
        docs/content/history/Medicine/10_The_Lady_with_the_Lamp.md
git add .claude/skills/topic-brief/SKILL.md
git commit -m "Generate topic briefs for Medicine Through Time Episodes 4, 8, 10"
git push -u origin main
```

(If Step 4 made no SKILL.md changes, the second `git add` is a no-op — that's
fine, `git commit` will just include the three new files.)

---

## Task 3: Verify series mode for the full Medicine Through Time spine

This task runs series mode across all 14 Medicine Through Time episodes —
the skill's primary intended use, and the first full canonical reference set
for the series this skill exists to support.

**Files:**
- Create: `docs/content/history/Medicine/01_Trust_Me_Im_Following_Jupiter.md`
- Create: `docs/content/history/Medicine/02_The_Day_Everything_Changed.md`
- Create: `docs/content/history/Medicine/03_The_Beginning_of_Doubt.md`
- Modify (overwrite): `docs/content/history/Medicine/04_The_Man_Who_Proved_Everyone_Wrong.md`
- Create: `docs/content/history/Medicine/05_Londons_Year_of_Terror.md`
- Create: `docs/content/history/Medicine/06_The_Boy_the_Cow_and_the_Cure.md`
- Create: `docs/content/history/Medicine/07_The_Invisible_Enemy.md`
- Modify (overwrite): `docs/content/history/Medicine/08_The_Great_Stink.md`
- Create: `docs/content/history/Medicine/09_The_Day_Surgery_Changed_Forever.md`
- Modify (overwrite): `docs/content/history/Medicine/10_The_Lady_with_the_Lamp.md`
- Create: `docs/content/history/Medicine/11_The_Accidental_Miracle.md`
- Create: `docs/content/history/Medicine/12_When_Medicine_Became_Magic.md`
- Create: `docs/content/history/Medicine/13_Can_We_Beat_Cancer.md`
- Create: `docs/content/history/Medicine/14_Hell_in_the_Trenches.md`

- [ ] **Step 1: Invoke the skill for the whole series**

Use the Skill tool with `skill: "topic-brief"`, `args: "Medicine Through Time"`.

- [ ] **Step 2: Verify all 14 files exist with correct names**

Run:
```bash
ls /home/user/gcse-revision/docs/content/history/Medicine/
```

Expected: exactly the 14 filenames listed in "Files" above, nothing else.

- [ ] **Step 3: Spot-check Episode 1 ("Trust Me, I'm Following Jupiter")**

Open `docs/content/history/Medicine/01_Trust_Me_Im_Following_Jupiter.md` and
verify:
- All six `## N. <Heading>` sections present, in order.
- Section 1 states build status `Built as
  history-medicine-medieval-beliefs-causes` (this id appears in no other
  Series 1 row).
- Section 4 is not "Not yet built" — it summarizes that module's content.

- [ ] **Step 4: Spot-check Episode 9 ("The Day Surgery Changed Forever") — the two-module case**

Open `docs/content/history/Medicine/09_The_Day_Surgery_Changed_Forever.md`
and verify:
- Section 1 states build status `Built across mod3 + mod6` (per
  `HISTORY_SERIES_MAP.md` row 9, "Current module" = `mod3` + `mod6`).
- Section 4 covers content from both `mod3` and `mod6` (pain/infection/
  blood-loss setup from `mod3`, anaesthetics/antiseptics/Lister from
  `mod6`), and explicitly notes the two-module split.

- [ ] **Step 5: Spot-check Episode 13 ("Can We Beat Cancer?") — the "also covers" case**

Open `docs/content/history/Medicine/13_Can_We_Beat_Cancer.md` and verify:
- Section 1 states build status `Built (shared) as mod9 — also covers
  Episode(s) 12` (per `HISTORY_SERIES_MAP.md` row 13, "Current module" =
  `mod9 (shared — see Episode 12)`, and row 12's "Current module" = `mod8 +
  mod9` which also names `mod9`).
- Section 4 focuses on lung-cancer/lifestyle-disease content (this episode's
  GCSE topic), not the NHS-founding content that belongs to Episode 12.

- [ ] **Step 6: Confirm overwrite behaviour on Episodes 4, 8, 10**

Run:
```bash
git status --porcelain docs/content/history/Medicine/
```

Expected: Episodes 4, 8, 10 show as modified (`M`), all other episodes
(1–3, 5–7, 9, 11–14) show as new/untracked (`??` or `A`).

- [ ] **Step 7: Fix any issues found**

If any spot-check fails because of ambiguous or incorrect SKILL.md
instructions, edit `.claude/skills/topic-brief/SKILL.md` to clarify, then
re-run Step 1 (series mode is idempotent — it overwrites all 14 files) and
repeat the relevant spot-checks.

- [ ] **Step 8: Commit**

```bash
git add docs/content/history/Medicine/
git add .claude/skills/topic-brief/SKILL.md
git commit -m "Generate full Medicine Through Time topic brief set (14 episodes)"
git push -u origin main
```

(If Step 7 made no SKILL.md changes, the second `git add` is a no-op.)

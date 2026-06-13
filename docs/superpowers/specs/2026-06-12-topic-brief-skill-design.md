# Canonical topic generator — design

## Context

History module content development follows a "reorganize now, rebuild
later" plan: `HISTORY_SERIES_MAP.md` defines the 14-episode spine for
Medicine Through Time (plus three more series with no modules built yet),
and `HISTORY_MODULE_ARCHITECTURE.md` (LOCKED) defines the Section 1–6
structure every chapter must follow. Before rebuilding or auditing any
chapter, there's currently no single document that brings together:

- what the GCSE spec requires for that topic,
- what the locked architecture requires structurally,
- what currently exists in `src/modules.js` (if anything), and
- the actual content material (spec excerpts, past papers, revision
  guides) needed to write it.

This design adds a project Skill that synthesizes all of this into one
**canonical topic file** per chapter, on demand, using source material the
user shares in the same session (transient — not stored in the repo). This
file becomes the canonical knowledge source for that chapter — a future
build/audit session reads it *instead of* re-gathering source material.

## Skill

**Name/location:** `.claude/skills/canonical-topic/SKILL.md` (project-level
skill, standard frontmatter + markdown instructions).

**Invocation:** `/canonical-topic <argument>`, where `<argument>` is either:

- a single episode name (e.g. `/canonical-topic The Great Stink`), or
- a series name (e.g. `/canonical-topic Medicine Through Time`) — the skill
  loops over every episode row for that series in the relevant series-map
  doc and writes one canonical topic file per episode.

Both forms are supported by the same skill; it decides which mode based on
whether the argument matches a series name or an episode name in the
series map.

## Inputs

1. **Session-provided source material** — whatever the user has shared in
   the conversation before/with the invocation: spec PDF excerpts, past
   papers, mark schemes, revision-guide content, pasted notes. Read via the
   `Read` tool (PDFs use page-range reads for large documents). Nothing
   here is copied into the repo as a separate artefact — only the
   synthesized output is saved.
2. **The subject's series/spec map** — e.g.
   `docs/content/history/HISTORY_SERIES_MAP.md`. Provides episode number,
   title, subtitle/GCSE topic, and (for History) the "Current module"
   column linking to a `src/modules.js` id.
3. **The subject's locked architecture doc** — e.g.
   `docs/system/HISTORY_MODULE_ARCHITECTURE.md`. Provides the Section 1–6
   structure, typical components per section, and the Module Completion
   Test checklist.
4. **The current `src/modules.js` entry**, if the episode has been built —
   used for the gap analysis in section 4 of the output.

This skill is written generically (subject is a parameter, not hardcoded),
but only History currently has both a series map and a locked architecture
doc, so History is the only subject it can run against today. Other
subjects can use it once they have equivalent docs.

## Output location & naming

**Path:** `docs/content/<subject>/<Series>/<NN>_<Title_With_Underscores>.md`

`<subject>` is lowercase, matching the existing `docs/content/history/`
directory convention (so for History: `docs/content/history/...`).

For History, `<Series>` directory names map from `HISTORY_SERIES_MAP.md`'s
four series as follows:

| Series | Directory |
|---|---|
| 1 — Medicine Through Time | `Medicine` |
| 2 — Spain and the 'New World' | `Spain_and_the_New_World` |
| 3 — The USA, 1954–75: Conflict at Home and Abroad | `USA_1954-75` |
| 4 — Early Elizabethan England | `Elizabethan_England` |

**Filename conversion** (from the series map's "Episode" column):

1. Take the episode title as written.
2. Strip punctuation: apostrophes, commas, colons, question marks, etc.
3. Replace spaces with underscores.
4. Prefix with the episode's `#` from that series' table, zero-padded to 2
   digits, plus underscore.

Examples (Series 1): `01_Trust_Me_Im_Following_Jupiter.md`,
`02_The_Day_Everything_Changed.md`, `03_The_Beginning_of_Doubt.md`.
(Series 3 example): "Can You Win a Guerrilla War?" →
`10_Can_You_Win_a_Guerrilla_War.md`.

Files are **permanent and committed** — they become the canonical
pre-build/audit reference for that chapter.

## Content philosophy

**The primary consumer of every canonical topic file is another LLM** (a
future Claude session doing the actual build/audit), not a human skimming
the page. This governs how every section of the output template below is
written:

- **Completeness over brevity.** Include every fact, date, name, figure,
  cause-and-effect link, and exam-relevant detail available from
  session-provided material and from the series map / architecture doc. Do
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

## Output template

Each canonical topic file has six sections, written per the Content
philosophy above:

### 1. Identity
Episode number, title, subtitle, era, Key Topic reference, and current build
status — either `Built as <module-id>` (with its current title/number in
`src/modules.js`) or `Not yet built`.

- **Era**: from `src/modules.js`'s `era` field if built; if not built, derive
  a date range from the spec material in section 2, or state "Not yet
  specified" if none is available.
- **Key Topic reference**: from the series map's "Specification structure"
  breakdown (Series 2–4 each have Key Topics 1–4). Series 1 (Medicine Through
  Time) has no Key Topic numbering — omit this field for Series 1 episodes.

### 2. Specification requirements
An exhaustive bulleted list of every specification requirement for this
topic, drawn from whatever spec material was shared in the session — one
bullet per sub-topic/concept, with nested bullets for supporting detail
(named examples, date ranges, key terms). For any sub-topic the series map's
GCSE topic / Key Topic description implies but the session material doesn't
cover, add a `MISSING:` bullet naming that sub-topic specifically. If no
spec material was provided at all, state that explicitly, then list
`MISSING:` bullets for every sub-topic implied by the series map's topic
description — this becomes the next session's sourcing checklist.

### 3. Architecture checklist (tailored)
Walk through Section 1–6 from the architecture doc. For each section:
state its purpose (from the architecture doc), then propose *this
chapter's* content for that slot (derived from section 2's requirements)
and a suggested component from that section's "Typical Components" list.
End with the architecture doc's 9-point Module Completion Test, reproduced
as an unchecked checklist for use during build/audit.

### 4. Current state & gap analysis
If built: summarize the existing `hook`/`outcomes`/`recall`/`screens` from
`src/modules.js`, map each existing screen to a Section 1–6 slot from
section 3, and list what's missing against the architecture checklist.
If not built: `Not yet built — full rebuild from spec.`

**Shared/bundled modules** (per the series map's "Restructuring notes" — e.g.
Episodes 3–5 currently bundled into `mod2`, Episodes 12–13 into
`mod8`/`mod9`): note the build status as `Built (shared) as <module-id>`,
summarize and map only the screens/content relevant to *this* episode's
topic, and flag the bundling explicitly so section 6 can recommend the split.

### 5. Content reference pack
Exhaustive, structured, bulleted, organized under sub-headings: dates &
timeline, key people (name/role/significance), key terms & definitions,
case studies/named examples, causes & effects (as explicit `X → Y` bullets),
and exam angles (common question types, mark scheme patterns/keywords, and
misconceptions worth a `MisconceptionCheck`, each stated precisely enough to
write a true/false statement from later) — all drawn from session-provided
source material. If no source material was provided, state that explicitly,
then list `MISSING:` bullets per sub-heading naming what kind of material
(spec excerpt / past paper / revision guide) would fill it, rather than
inventing content.

### 6. Build recommendations
A prioritized list combining gaps from section 4 and suggestions from
section 3 — what to build or fix first, which components to use per slot,
and interleaving links to concepts from earlier episodes (per the
architecture doc's Interleaving Rule, and — for Medicine Through Time —
the five agents of change).

## Edge cases

- **Series argument with some episodes already built, some not**: the
  skill produces a canonical topic file for every episode in the series
  regardless of build status; section 4 differs (gap analysis vs "not yet
  built").
- **No source material for some episodes in a batch**: sections 2 and 5
  note the absence via `MISSING:` bullets rather than failing or skipping
  the file — the file is still useful for its architecture/identity
  sections and as a sourcing checklist for next time.
- **Output file already exists**: the skill overwrites it (each run
  represents the latest synthesis; the user re-runs when they have new
  source material).

## Rollout strategy

This skill is not trusted with a full series run on day one:

1. Build the skill.
2. Run it on **one episode only** — Episode 1, "Trust Me, I'm Following
   Jupiter" (Medicine Through Time).
3. Review the output together with the user.
4. Refine the skill based on that review, then re-run the pilot episode
   until the output quality is approved.
5. Only then run it across the rest of Medicine Through Time (series mode).
6. Only after Medicine Through Time's full output has been reviewed and is
   producing excellent results should this skill be pointed at any other
   subject/series.

## Out of scope

- Storing/cataloguing source PDFs or building an artefact-map config —
  source material is transient per the user's framing.
- Non-History subjects' directory-name mappings — added when those
  subjects get their own series map + architecture doc, and only after the
  Rollout strategy above reaches step 6.
- Any change to `src/modules.js`, components, or app behaviour — this
  skill only produces planning documents.

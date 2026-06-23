# Canonical topic pipeline

Universal process for generating, updating, and validating canonical topic
spines for any GCSE subject. Subject-aware; content-agnostic.

Run this pipeline whenever creating or updating a canonical spine. Load the
subject adapter (Step 3) for subject-specific conventions that override the
defaults here.

---

## Comparison with the `/canonical-topic` skill

| Aspect | `/canonical-topic` skill | This pipeline |
|--------|--------------------------|---------------|
| Trigger | Session shortcut in `.claude/skills/` | Manual process reference |
| Primary output location | `docs/content/<subject>/` | `docs/canonical/<subject>/` (default; adapters may override) |
| Source discovery | PDF extraction only | PDFs + spec scan + knowledge organiser + past papers + existing docs |
| Spine fields | Facts, dates, key people, exam angles | All of the above + big question, active learning interactions, retrieval points, exam skill focus, misconceptions |
| Architecture default | Always two files (Content + Architecture) | Always two files (Content + Architecture) |
| Validation | None | Six-point checklist before commit |
| Subject handling | Inline conditionals in skill body | Separate adapter files per subject |

The skill is optimised for speed during a session. This pipeline is the
authoritative process for quality-controlled spine creation and updates.

---

## Step 1 — Source discovery

Identify all available source materials before drafting anything.

### 1a. Extract uploaded PDFs

For each PDF in this conversation not yet extracted to
`/tmp/canonical-topic/<safe-stem>.txt`:

```bash
mkdir -p /tmp/canonical-topic
pdftotext -layout "<pdf-path>" "/tmp/canonical-topic/<safe-stem>.txt"
```

If `pdftotext` is missing: `apt-get update && apt-get install -y poppler-utils`

Never `Read` a PDF directly — extract once, then grep the text file.

Reuse `/tmp/canonical-topic/<safe-stem>.txt` if it already exists from
earlier in this session.

### 1b. Inventory source types

Tick what is available:

- [ ] Specification / syllabus
- [ ] Course booklet / student guide
- [ ] Knowledge organiser
- [ ] Mark scheme
- [ ] Question paper / past paper
- [ ] Source booklet (for subjects with unseen sources)
- [ ] Other uploaded material
- [ ] Existing canonical docs already in this repo

### 1c. Extract required syllabus coverage

Before drafting any spine, grep extracted source files for:

- The topic name and any numbered spec references
- Required content headings and sub-bullet points
- Named thinkers, texts, events, case studies, or practicals (subject-dependent — see adapter)
- Exam question types, command words, and mark weightings
- Assessment objectives

Build a coverage checklist — every spec point that must appear in at least
one episode. This checklist is the input for Step 6 validation.

### 1d. Scan for existing canonical docs

```bash
find docs/canonical docs/content -type d 2>/dev/null
```

If any files cover this topic: read them. Update in place rather than
recreating from scratch. Preserve content already confirmed by the user.

---

## Step 2 — Existing structure scan

Never create a duplicate directory for a topic that already exists.

### 2a. List existing subject directories

```bash
ls docs/canonical/ 2>/dev/null
ls docs/content/   2>/dev/null   # legacy — History and English live here
```

### 2b. Fuzzy-match the topic name

Strip punctuation from the intended topic name, lowercase it, replace
spaces with underscores. Compare against existing directory names using the
same normalisation.

- **Clear match** → use the existing directory verbatim. Do not create a new one.
- **One plausible match** (e.g. `usa_1954-75` matches "The USA, 1954–75: Conflict at Home and Abroad") → use it; note the match explicitly.
- **Multiple plausible matches** → stop. List the candidates and ask the user which to use.
- **No match** → create a new directory per the subject adapter's naming convention.

### 2c. Check for an existing spine

If the directory exists, list its files. If a spine exists:

- Read it.
- Is it current, partial, or stale?
- Update in place — do not overwrite confirmed content.

---

## Step 3 — Subject adapter selection

Determine the subject and load the relevant adapter before proceeding.

| Subject | Adapter |
|---------|---------|
| English Literature | `docs/workflows/adapters/english-literature.md` |
| History | `docs/workflows/adapters/history.md` |
| Sociology | `docs/workflows/adapters/sociology.md` |
| Biology / Chemistry / Physics / Combined Science | `docs/workflows/adapters/science.md` |
| Maths | `docs/workflows/adapters/maths.md` |
| Unknown subject | Use default convention below |

**Default convention (no adapter exists):**

- Directory: `docs/canonical/<subject>/<topic-slug>/`
- Spine file: `00_<topic-slug>_series_map.md`
- Episode content files: `<NN>_<episode-slug>_Content.md`
- Architecture: embedded in spine unless Step 5 justifies separation.

The adapter overrides any default above where they conflict.

---

## Step 4 — Spine generation

Every canonical spine must include the following. Subject adapters may add
fields or columns; they may not omit required ones.

```markdown
# <Topic Title> — Series map

## Series identity

- **Subject:** <subject>
- **Exam board / spec:** <board and spec code>
- **Assessment:** <paper, section, format>
- **Marks / time:** <marks available> / <time allowed>
- **Episode count:** <N>

---

## Series throughline

<2–4 sentences: the central argument or narrative arc the whole topic
builds toward. What should a learner be able to articulate after all
episodes?>

**The question every episode must answer:** <one framing question>

---

## Module architecture (shared stage rhythm and completion test only)

[Architecture overview embedded here: stage names, purposes, typical
components, and module completion test. Per-episode build detail goes in
each episode's `_Architecture.md` file.]

---

## Episode table

| # | Title | <subject-specific columns — see adapter> |
|---|-------|------------------------------------------|

---

## Episode detail

### Episode <#>: <Title>

- **Big question:** <the one question this episode answers>
- **Syllabus coverage:** <bulleted spec points covered>
- **Key concepts / vocabulary:** <bulleted list>
- **Named evidence:** <thinkers / texts / events / case studies / practicals>
- **Active learning interactions:** <suggested component types>
- **Retrieval points:** <what must be retrievable after this episode>
- **Exam skill focus:** <which question type or skill this episode builds>
- **Likely misconceptions:** <common errors to address>
- **Build notes:** <optional implementation notes>

---

## Validation

[Completed in Step 6 — paste results here before committing]

---

## Global tags

[Subject-specific tags — see adapter]
```

### Flagging conventions

- `MISSING: <what>` — spec implies it but source material doesn't cover it yet
- `UNCERTAIN: <fact>` — partially supported, not confirmed
- `DRAFT (for user confirmation): <claim>` — interpretive claim, not settled
- `CONFLICT: <what>` — two sources disagree; show both

---

## Step 5 — Architecture handling

### Always use the two-file split

Every episode produces two files:

- `<NN>_<stem>_Content.md` — the knowledge file: what the student must know,
  understand, and remember. Subject matter, spec points, named evidence,
  vocabulary, misconceptions.
- `<NN>_<stem>_Architecture.md` — the build file: how the episode is
  taught. Stage mapping, component choices, retrieval points, exam skill
  focus, build notes, module completion test.

The spine (`00_<topic>_series_map.md`) is the **index only**: series
identity, throughline, shared module architecture (stage rhythm and
completion test), episode table with links, exam question bank, validation
checklist, and global tags. It does not contain per-episode detail.

### Architecture content per episode file

Each `_Architecture.md` must include:

- Identity (episode number, title, subject, build status, pointer to content file).
- Stage mapping — the subject's standard stage rhythm (from the spine) applied
  to this episode's content: proposed content per stage + suggested component(s).
- Active learning interactions — the specific interaction types planned for each stage.
- Retrieval points — what students must be able to recall after this episode;
  informs Stage 7 quick-fire content.
- Exam skill focus — which AQA question type(s) this episode builds; informs
  Stage 6 content.
- Build notes — any implementation constraints or design decisions.
- Module completion test — the full checklist reproduced as an unchecked list.

---

## Step 6 — Validation

Before committing, verify every item below. Record each as `PASS` or
`FAIL: <detail>`. All `FAIL` entries must be resolved or converted to
`MISSING:` bullets before the spine is committed.

### Coverage

- [ ] Every spec point from Step 1c maps to at least one episode.
- [ ] All required named thinkers / texts / events / practicals appear in
  at least one episode's "Named evidence" field.

### Episode completeness

- [ ] Every episode has a Big question.
- [ ] Every episode has at least one Syllabus coverage point.
- [ ] Every episode has an Exam skill focus.
- [ ] Every episode has at least one Retrieval point.
- [ ] No episode is purely presentational — every episode requires active
  processing.

### Exam skills

- [ ] Exam skills are distributed across the topic, not all in one episode.
- [ ] The highest-weighted exam question type has at least one episode or
  section dedicated to it.

### Structure

- [ ] No duplicate directory or file created for this topic.
- [ ] File naming follows the subject adapter's convention.
- [ ] Architecture is embedded (with no justification needed) OR separated
  with a documented reason.

### Subject brand

- [ ] Design palette and tone noted in the spine match the subject adapter's
  brand rules.

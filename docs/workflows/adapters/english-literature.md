# Subject adapter — English Literature

Overrides and additions to the canonical topic pipeline for GCSE English
Literature (AQA). Read this after Step 3 of the pipeline; apply every override
below.

---

## Directory convention

English Literature uses **legacy locations** and a **per-text** structure.
Do not move content to `docs/canonical/english/`.

| Spine type | Location |
|-----------|----------|
| Per-text spine (includes architecture) | `docs/content/english/<Text_Dir>/00_<Text>_Series_Map.md` |
| Episode content files | `docs/content/english/<Text_Dir>/<NN>_<Title>_Content.md` |
| Episode architecture files | `docs/content/english/<Text_Dir>/<NN>_<Title>_Architecture.md` |

**Text directory names** — use the text title, spaces → underscores:

| Text | Directory |
|------|-----------|
| An Inspector Calls | `An_Inspector_Calls` |
| Macbeth | `Macbeth` |
| New text | Derive: `Title_With_Underscores` |

---

## Architecture convention

English Literature uses **two separate files** per episode (same pattern as
History). Architecture is **embedded in the series spine** (`00_*_Series_Map.md`)
rather than in a separate doc. Each episode pair (`_Content.md` +
`_Architecture.md`) references the architecture in the spine.

The spine for each text is self-contained — it includes:

- Series identity
- AQA assessment objectives and mark scheme tiers
- Module architecture (Section 1–6, subject rules, completion test)
- Episode table
- Series-wide context reference (biographical, historical, genre)

---

## Episode table columns

| # | Title | Primary act | Core focus | Retrieval priority |

---

## Additional spine fields per episode

Beyond the pipeline defaults, add:

- **Primary act / scene:** Which act or scene(s) the episode primarily covers.
- **Core focus:** The dominant theme, character, or technique addressed.
- **Retrieval priority:** `Very high` / `High` / `Medium`.
- **AOs addressed:** Which assessment objectives (AO1 / AO2 / AO3 / SPaG)
  this episode primarily develops.

---

## Throughline framing

Every episode must connect its central argument to:

1. The spine's **Series throughline** (the overall interpretation of the text).
2. The spine's **"The question every episode must answer"** framing.
3. The author's **purpose** — what they wanted a contemporary audience to
   think or feel.

Frame the series throughline connection as: `"Priestley uses this scene to
show that... / Shakespeare presents this as..."` — author's method + message.

---

## Architecture section rules

Each Section in the module architecture carries an AIC-specific or
Macbeth-specific rule. These are embedded in the spine — read the `00_*` file
for the text being worked on. Common rules:

- **Section 2 (Plot & Dramatic Action):** Must name the stagecraft device
  Priestley / Shakespeare uses in the episode's scenes.
- **Section 3 (Theme & Context):** AO3 context must be integrated into
  thematic interpretation — not presented as a standalone history block.
- **Section 4 (Quote Analysis):** No quote-dump tables. Every quote must be
  taught through active recall, matching, sorting, or paragraph-building.
- **Section 5 (Exam Practice):** Must include at least one AQA-style
  written-response moment with a whole-play link.
- **Section 6 (Retrieval & Wider Play Links):** Must contain at least one
  cross-reference to content from an earlier episode.

---

## Validation additions (English Literature-specific)

Add these checks to the Step 6 validation:

- [ ] AO1 (informed personal response) is addressed in every episode.
- [ ] AO2 (language, form, structure and their effects) is addressed in
  every episode.
- [ ] AO3 (context) appears in at least one episode per act, integrated into
  interpretation — not as a standalone history block.
- [ ] At least one stagecraft device is named per episode (Section 2 rule).
- [ ] At least one whole-play cross-reference appears per episode (Section 6 rule).
- [ ] Extract-based question handling is covered where the exam format requires
  it (Macbeth: extract + whole play; AIC: whole play only — no extract).
- [ ] Quotes taught through active tasks — not passive display.

---

## Content reference pack sub-headings

Use these sub-headings in the content file's Section 4:

- **Scene / act sequence** (not "Dates & timeline")
- **Key people / characters** (include character function and relationships)
- **Key terms & literary devices**
- **Key scenes / key quotes** (with Point → Quote → Analysis → Context ready)
- **Interpretive chains** (`technique → effect on audience`)
- **Exam angles**
- **Sourcing notes**

---

## Brand / style notes

**Palette — An Inspector Calls:** Dark academic. Forest green/charcoal
(`#1A2E1A`), deep slate (`#1C2533`), brass/gold (`#C9A84C`), aged parchment
(`#E8D5A3`), interrogation amber (`#D4A017`), near-black (`#0A0C0F`). Tone:
cinematic tension — dining-room shadows, hard interrogation light.

**Palette — Macbeth:** Dark Scottish tragedy. Deep grey-purple (`#1E1A2E`),
storm charcoal (`#1C1C24`), blood crimson (`#8B1A1A`), candlelight gold
(`#C9A84C`), near-black (`#0A0C0F`). Tone: gothic, atmospheric, royal and
menacing.

**Both texts — avoid:** Detective-cartoon styling, generic "murder mystery"
pastiche, neon crime-board strings, childish ghost styling, magnifying glass
game iconography.

---

## Global tags (examples)

- `aqa-english-literature`
- `paper-1-shakespeare` / `paper-2-modern-text`
- `macbeth` / `an-inspector-calls`
- `ao1-interpretation` / `ao2-language-form-structure` / `ao3-context`
- `stagecraft` / `dramatic-irony` / `whole-play-essay`
- `capitalism-vs-socialism` / `social-responsibility` / `ambition` / `power`

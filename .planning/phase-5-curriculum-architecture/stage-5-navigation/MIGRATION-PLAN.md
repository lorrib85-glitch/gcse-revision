# Stage 5, split into 5A, 5B and 5C

The parent `IMPLEMENTATION-PLAN.md` had Stage 5 as one step: generate the
navigation projection *and* move `Subjects.jsx` onto it. `AUDIT.md` §2 found
three structural problems that all had to be settled before the browser could
move, so the stage splits at the authority boundary — the same shape that made
Stage 4 safe.

```
Stage 5A   define the contract, generate the projection      no runtime change
Stage 5B   switch the browser onto it                        gated visible cutover
Stage 5C   retire post-cutover scaffolding                     no learner change
```

---

## Stage 5A — inert projection

**Lands**

- `src/curriculum-catalogue/navigation/` — the browser-entry configuration,
  validated, build-time only;
- `scripts/generate-curriculum-navigation.mjs`;
- `src/data/generated/curriculum/navigation.js` — **imported by nothing**;
- `docs/curriculum/NAVIGATION_MAP.md`;
- `tests/fixtures/subject-browser-v1.json` — the frozen learner-visible
  semantics of today's browser;
- `pnpm curriculum:navigation:generate` / `:check`, wired into `pnpm verify`.

**Does not touch:** `Subjects.jsx`, `subjectCatalogue.js`, any copy, any
imagery, any chapter's availability, any progress write, `CHAPTERS`, the
compatibility projection.

**Proves:** exactly seven entries in the current order; no `cs_` id anywhere in
the output; every card resolves to a canonical chapter or module; every
configured pathway resolves; one pathway contributing to several entries is
filtered by module `subjectId`; Foundation/Higher duplication is removed and
divergence fails generation; the English entry does not merge subject identity;
no compatibility field enters navigation; nothing imports the projection;
output is deterministic and drift-checked; and the projection reproduces the
frozen browser semantics card for card.

**Reversible by:** deleting a directory and two generated files.

## Stage 5B — the authority switch

**Lands**

| Retired from `Subjects.jsx` | Replaced by |
|---|---|
| `SUBJECT_NAMES` | `NAVIGATION_ENTRIES` order |
| `SUBJECT_DISPLAY_TITLES` | entry `title` |
| `SUBJECT_DESCRIPTIONS` | entry `description` |
| `SUBJECT_HEADER_IMGS` | entry `heroImage` |
| `HISTORY_SERIES`, `ENGLISH_SERIES` | entry `sections` |
| `CHAPTER_HEADER_IMAGES` | retained through the cutover, then removed in 5C after all 20 entries are proved unreachable (A-10) |
| `MACBETH_/INSPECTOR_/PHYSICS_PLACEHOLDERS`, the `cs_<subject>` fallback | canonical cards and the entry-level coming-soon state |

`SUBJECT_TOPIC_IMAGES` stays for now: the tile thumbnail is randomised per
mount, is not in the parity contract, and retiring it is a separate decision.

The original `subjectCatalogue.js` identity is retained through the 390px parity
walkthrough as a thin runtime adapter. Stage 5C then renames that boundary to
`subjectNavigationAdapter.js`; the adapter remains because it joins generated
cards to runtime Chapters without letting UI components import the projection.

**Verification, before the delete:**

- the frozen fixture matches what the browser renders, not just what the
  projection holds;
- seven destinations open at 390px; History's four tabs and English's two tabs
  render with the same titles, labels and imagery;
- the 30 openable chapters are exactly the 30 openable today, and every
  coming-soon card is still unopenable;
- every tile percentage and browser ring percentage is unchanged for a given
  progress store;
- no console or dynamic-import errors.

**Worst case:** a destination disappears or a card moves. **Recovery:** revert
`Subjects.jsx`; the projection stays and stays inert.

## Stage 5C — post-cutover cleanup

**Lands**

- renames the surviving thin runtime boundary to
  `src/features/subjects/subjectNavigationAdapter.js`;
- renames its unit test and updates current architecture guards and documentation;
- removes the 20-entry `CHAPTER_HEADER_IMAGES` fallback only after proving every
  mapped runtime Chapter already owns a canonical `headerImage`;
- adds a guard that the generated navigation projection has exactly one
  production importer and that the old adapter identity cannot regrow.

**Does not touch:** Browser Entry configuration, generated card order, learner
copy, progress reads or writes, Chapter opening, `SUBJECT_TOPIC_IMAGES`, the
compatibility projections, or Stage 6 consumers.

**Proves:** the seven-destination 390px walkthrough still passes; the full
repository verification remains green; and the cleanup changes naming and dead
fallbacks only.

## Stage 6 — unchanged by this split

Stage 6 still migrates the nine remaining legacy runtime consumers and only then
deletes compatibility fields. Two Stage 5 artefacts join its delete list:

- the navigation entry's **display-number override table**, once OD-5-A is
  decided;
- the **card-label override table**, once OD-5-B is decided.

Both are declared temporary at birth, and both must shrink to nothing rather
than quietly becoming the new home of a legacy fact.

## What each stage costs if it goes wrong

| Stage | Worst case | Recovery |
|---|---|---|
| 5A | the projection disagrees with the browser | the parity gate fails; nothing ships |
| 5B | a subject disappears from the browser | revert `Subjects.jsx`; the projection stays |
| 5C | adapter cleanup changes browser behaviour | revert the cleanup commit; the Stage 5B boundary remains valid |

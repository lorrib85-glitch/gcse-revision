# Phase 5A — migration census

> **GENERATED FILE — do not edit.**
> Source: `census/entity-classifications.js` joined against the live repository by
> `scripts/generate-migration-census.mjs`. Regenerate after any classification change.

Every curriculum-bearing entity that exists in the repository today — **171** of them —
with the classification it is proposed to carry in the canonical curriculum ontology.
The generator fails if an entity is unclassified, if a classification names an entity that no
longer exists, or if a classification carries no note. Nothing here is left to inference.

## Totals by classification

| Classification | Entities |
|---|---:|
| `chapter` | 59 |
| `compatibility-only` | 64 |
| `concept` | 9 |
| `facet` | 4 |
| `module` | 7 |
| `presentation-only` | 27 |
| `retired-hidden` | 1 |

## Totals by entity kind

| Kind | Entities |
|---|---:|
| Synthetic browser placeholders | 12 |
| Subject-browser series tabs | 6 |
| Chapters | 60 |
| Chapter content loaders | 60 |
| Chapter `series` values | 4 |
| Concept collections | 2 |
| Learning-graph course nodes | 7 |
| Curriculum-bearing facet tags | 4 |
| Modules | 7 |
| Subject theme keys | 9 |

## Subject theme keys (9)

| Entity | Classification | Target | Note |
|---|---|---|---|
| `Biology` | `presentation-only` | `src/constants/subjects.js (unchanged)` | Visual identity only. It happens to share a spelling with one academic subject today, but the migration stops treating that coincidence as identity: curriculum records reference a subject id, and the theme is resolved from the subject record. |
| `Chemistry` | `presentation-only` | `src/constants/subjects.js (unchanged)` | Visual identity only. It happens to share a spelling with one academic subject today, but the migration stops treating that coincidence as identity: curriculum records reference a subject id, and the theme is resolved from the subject record. |
| `Drama` | `presentation-only` | `src/constants/subjects.js (unchanged)` | Palette with no chapters, no module, no browser entry and no learner-reachable surface. It is branding held in advance, and must not be read as evidence that the subject exists in the curriculum. |
| `English` | `presentation-only` | `src/constants/subjects.js (unchanged)` | One theme serving two academic subjects (English Language, English Literature). This is the clearest proof that a theme key is not a subject: it must keep serving both after the split. |
| `History` | `presentation-only` | `src/constants/subjects.js (unchanged)` | Visual identity only. It happens to share a spelling with one academic subject today, but the migration stops treating that coincidence as identity: curriculum records reference a subject id, and the theme is resolved from the subject record. |
| `Maths` | `presentation-only` | `src/constants/subjects.js (unchanged)` | Visual identity only. It happens to share a spelling with one academic subject today, but the migration stops treating that coincidence as identity: curriculum records reference a subject id, and the theme is resolved from the subject record. |
| `Music` | `presentation-only` | `src/constants/subjects.js (unchanged)` | Palette with no chapters, no module, no browser entry and no learner-reachable surface. It is branding held in advance, and must not be read as evidence that the subject exists in the curriculum. |
| `Physics` | `presentation-only` | `src/constants/subjects.js (unchanged)` | Visual identity only. It happens to share a spelling with one academic subject today, but the migration stops treating that coincidence as identity: curriculum records reference a subject id, and the theme is resolved from the subject record. |
| `Sociology` | `presentation-only` | `src/constants/subjects.js (unchanged)` | Visual identity only. It happens to share a spelling with one academic subject today, but the migration stops treating that coincidence as identity: curriculum records reference a subject id, and the theme is resolved from the subject record. |

## Modules (7)

| Entity | Classification | Target | Note |
|---|---|---|---|
| `hist_medicine` | `module` | `history-edexcel-medicine-britain (+ history-edexcel-western-front)` | Splits. Fourteen thematic-study chapters stay as the Medicine module; `history-medicine-western-front` moves to its own historic-environment module referenced by the same pathway. The current single array cannot express that the two are assessed differently in Paper 1. |
| `soc_family` | `module` | `sociology-aqa-families (+ sociology-aqa-key-concepts)` | Splits. Title says "Sociology of the Family" but only soc4 and soc6 are Families; soc1–soc3 are key concepts and sociological approaches that run across both papers. The split is SETTLED (OD-4). |
| `maths_core` | `module` | `maths-aqa-number` | Renames in scope, not in membership. Titled "GCSE Maths" but every chapter is AQA Number content, so the record currently claims a whole subject and delivers one content domain. The module record takes the honest scope; the subject is expressed by the subject reference. |
| `bio_core` | `module` | `six AQA Biology topic modules` | Splits. Titled "GCSE Biology" but its chapters already live in six per-topic content directories (cell-biology, organisation, infection-and-response, homeostasis, inheritance-variation-evolution, ecology). The directory tree already carries the real module grain; MODULES does not. |
| `eng_macbeth` | `module` | `english-lit-aqa-macbeth` | Correct scope already — one set text is one module. It becomes a text module referenced by an English Literature pathway through a selection group, which is what makes swapping the Shakespeare text a pathway edit rather than a module rewrite. |
| `hist_spain_new_world` | `module` | `history-edexcel-spain-new-world` | Correct scope already — one Edexcel period-study option is one module. |
| `hist_usa` | `module` | `history-edexcel-usa-conflict` | Correct scope already — one Edexcel modern-depth-study option is one module. |

## Chapters (60)

| Entity | Classification | Target | Note |
|---|---|---|---|
| `bio_building_blocks` | `chapter` | `biology-aqa-cell-biology` | Built AQA Cell Biology chapter. `sci_bio_w1` also collides on number 2 with `bio_building_life` — evidence that `chapter.number` is display metadata, not identity (DESIGN.md §5.5). |
| `bio_building_life` | `chapter` | `biology-aqa-cell-biology` | Unbuilt stub whose loader sits in `biology/organisation/` but whose title and subtitle ("Cells, Microscopes & Division") are Cell Biology. Anomaly A-6: the proposed module follows the subject matter, not the directory. |
| `bio_control_systems` | `chapter` | `biology-aqa-homeostasis` | Unbuilt stub. Homeostasis and response content; loader directory agrees. |
| `bio_disease_wars` | `chapter` | `biology-aqa-infection-and-response` | Unbuilt stub. Infection and response content; loader directory agrees. |
| `bio_ecosystems_group` | `chapter` | `biology-aqa-ecology` | Unbuilt stub. Ecology content; loader directory agrees. |
| `bio_genetics_evolution` | `chapter` | `biology-aqa-inheritance-variation-evolution` | Unbuilt stub. Inheritance, variation and evolution content; loader directory agrees. |
| `bio_human_machine` | `chapter` | `biology-aqa-organisation` | Unbuilt stub. Organisation content (organs, digestion, circulation); loader directory agrees. |
| `english-macbeth-power-ambition` | `chapter` | `english-lit-aqa-macbeth` | Built Macbeth chapter (1 screen). Its subject becomes `english-literature`, not the shared `English` theme key — the first entity the English split actually moves. |
| `history-medicine-accidental-miracle` | `chapter` | `history-edexcel-medicine-britain` | Thematic-study chapter. Identity and id are preserved verbatim; its position moves from array order in MODULES to an explicit position on the module-chapter relationship. |
| `history-medicine-black-death` | `chapter` | `history-edexcel-medicine-britain` | Thematic-study chapter. Identity and id are preserved verbatim; its position moves from array order in MODULES to an explicit position on the module-chapter relationship. |
| `history-medicine-cancer` | `chapter` | `history-edexcel-medicine-britain` | Thematic-study chapter. Identity and id are preserved verbatim; its position moves from array order in MODULES to an explicit position on the module-chapter relationship. |
| `history-medicine-germ-theory` | `chapter` | `history-edexcel-medicine-britain` | Thematic-study chapter. Identity and id are preserved verbatim; its position moves from array order in MODULES to an explicit position on the module-chapter relationship. |
| `history-medicine-great-plague-1665` | `chapter` | `history-edexcel-medicine-britain` | Thematic-study chapter. Identity and id are preserved verbatim; its position moves from array order in MODULES to an explicit position on the module-chapter relationship. |
| `history-medicine-great-stink` | `chapter` | `history-edexcel-medicine-britain` | Thematic-study chapter. Identity and id are preserved verbatim; its position moves from array order in MODULES to an explicit position on the module-chapter relationship. |
| `history-medicine-harvey-pare-renaissance-method` | `chapter` | `history-edexcel-medicine-britain` | Thematic-study chapter. Identity and id are preserved verbatim; its position moves from array order in MODULES to an explicit position on the module-chapter relationship. |
| `history-medicine-jenner-vaccination` | `chapter` | `history-edexcel-medicine-britain` | Thematic-study chapter. Identity and id are preserved verbatim; its position moves from array order in MODULES to an explicit position on the module-chapter relationship. |
| `history-medicine-medieval-beliefs-causes` | `chapter` | `history-edexcel-medicine-britain` | Thematic-study chapter. Identity and id are preserved verbatim; its position moves from array order in MODULES to an explicit position on the module-chapter relationship. |
| `history-medicine-modern-medicine` | `chapter` | `history-edexcel-medicine-britain` | Thematic-study chapter. Identity and id are preserved verbatim; its position moves from array order in MODULES to an explicit position on the module-chapter relationship. |
| `history-medicine-nightingale` | `chapter` | `history-edexcel-medicine-britain` | Thematic-study chapter. Identity and id are preserved verbatim; its position moves from array order in MODULES to an explicit position on the module-chapter relationship. |
| `history-medicine-renaissance-medicine` | `retired-hidden` | — | Superseded legacy bundle, explicitly `availability: "hidden"`, and a duplicate of number 3 with `history-medicine-vesalius-beginning-doubt`. It exists only so its progress key stays readable. It gets no curriculum record; its id is registered as a progress alias instead. |
| `history-medicine-surgery-anaesthetics` | `chapter` | `history-edexcel-medicine-britain` | Thematic-study chapter. Identity and id are preserved verbatim; its position moves from array order in MODULES to an explicit position on the module-chapter relationship. |
| `history-medicine-surgery-revolution` | `chapter` | `history-edexcel-medicine-britain` | Thematic-study chapter. Identity and id are preserved verbatim; its position moves from array order in MODULES to an explicit position on the module-chapter relationship. |
| `history-medicine-vesalius-beginning-doubt` | `chapter` | `history-edexcel-medicine-britain` | Thematic-study chapter. Identity and id are preserved verbatim; its position moves from array order in MODULES to an explicit position on the module-chapter relationship. |
| `history-medicine-western-front` | `chapter` | `history-edexcel-western-front` | Moves module. It is the historic environment of Edexcel Paper 1 — assessed by the two source questions, not by the thematic-study questions — so it belongs to a historic-environment module, not to chapter position 15 of Medicine. |
| `math1` | `chapter` | `maths-aqa-number` | AQA Number chapter. Built content. Tier is deliberately NOT recorded on the chapter: these are Foundation-and-Higher content, and tier belongs to the pathway that references the module (see DESIGN.md §5.1). |
| `math2` | `chapter` | `maths-aqa-number` | AQA Number chapter. Built content. Tier is deliberately NOT recorded on the chapter: these are Foundation-and-Higher content, and tier belongs to the pathway that references the module (see DESIGN.md §5.1). |
| `math3` | `chapter` | `maths-aqa-number` | AQA Number chapter. Built content. Tier is deliberately NOT recorded on the chapter: these are Foundation-and-Higher content, and tier belongs to the pathway that references the module (see DESIGN.md §5.1). |
| `math4` | `chapter` | `maths-aqa-number` | AQA Number chapter. Built content. Tier is deliberately NOT recorded on the chapter: these are Foundation-and-Higher content, and tier belongs to the pathway that references the module (see DESIGN.md §5.1). |
| `math5` | `chapter` | `maths-aqa-number` | AQA Number chapter. Built content. Tier is deliberately NOT recorded on the chapter: these are Foundation-and-Higher content, and tier belongs to the pathway that references the module (see DESIGN.md §5.1). |
| `math6` | `chapter` | `maths-aqa-number` | AQA Number chapter. Built content. Tier is deliberately NOT recorded on the chapter: these are Foundation-and-Higher content, and tier belongs to the pathway that references the module (see DESIGN.md §5.1). |
| `math7` | `chapter` | `maths-aqa-number` | AQA Number chapter. Built content. Tier is deliberately NOT recorded on the chapter: these are Foundation-and-Higher content, and tier belongs to the pathway that references the module (see DESIGN.md §5.1). |
| `math8` | `chapter` | `maths-aqa-number` | AQA Number chapter. Built content. Tier is deliberately NOT recorded on the chapter: these are Foundation-and-Higher content, and tier belongs to the pathway that references the module (see DESIGN.md §5.1). |
| `sci_bio_w1` | `chapter` | `biology-aqa-cell-biology` | Built AQA Cell Biology chapter. `sci_bio_w1` also collides on number 2 with `bio_building_life` — evidence that `chapter.number` is display metadata, not identity (DESIGN.md §5.5). |
| `soc1` | `chapter` | `sociology-aqa-key-concepts` | Key-concepts / approaches chapter, not Families content, despite sitting in the `soc_family` module and the `sociology/families/` content directory. Built content. The move is SETTLED (OD-4): these are cross-course foundations, not substantive Families content, and the split supports reuse across both AQA Sociology papers. |
| `soc2` | `chapter` | `sociology-aqa-key-concepts` | Key-concepts / approaches chapter, not Families content, despite sitting in the `soc_family` module and the `sociology/families/` content directory. Built content. The move is SETTLED (OD-4): these are cross-course foundations, not substantive Families content, and the split supports reuse across both AQA Sociology papers. |
| `soc3` | `chapter` | `sociology-aqa-key-concepts` | Key-concepts / approaches chapter, not Families content, despite sitting in the `soc_family` module and the `sociology/families/` content directory. Built content. The move is SETTLED (OD-4): these are cross-course foundations, not substantive Families content, and the split supports reuse across both AQA Sociology papers. |
| `soc4` | `chapter` | `sociology-aqa-families` | Families chapter — AQA Sociology Paper 1 Section A. Built content. Id preserved. |
| `soc6` | `chapter` | `sociology-aqa-families` | Families chapter — AQA Sociology Paper 1 Section A. Built content. Id preserved. |
| `spain-new-world-1` | `chapter` | `history-edexcel-spain-new-world` | Unbuilt stub (0 screens, derived `comingSoon`). It is a real planned chapter with a reserved id, so it becomes a chapter record with `status: planned` rather than a presentation placeholder. |
| `spain-new-world-10` | `chapter` | `history-edexcel-spain-new-world` | Unbuilt stub (0 screens, derived `comingSoon`). It is a real planned chapter with a reserved id, so it becomes a chapter record with `status: planned` rather than a presentation placeholder. |
| `spain-new-world-2` | `chapter` | `history-edexcel-spain-new-world` | Unbuilt stub (0 screens, derived `comingSoon`). It is a real planned chapter with a reserved id, so it becomes a chapter record with `status: planned` rather than a presentation placeholder. |
| `spain-new-world-3` | `chapter` | `history-edexcel-spain-new-world` | Unbuilt stub (0 screens, derived `comingSoon`). It is a real planned chapter with a reserved id, so it becomes a chapter record with `status: planned` rather than a presentation placeholder. |
| `spain-new-world-4` | `chapter` | `history-edexcel-spain-new-world` | Unbuilt stub (0 screens, derived `comingSoon`). It is a real planned chapter with a reserved id, so it becomes a chapter record with `status: planned` rather than a presentation placeholder. |
| `spain-new-world-5` | `chapter` | `history-edexcel-spain-new-world` | Unbuilt stub (0 screens, derived `comingSoon`). It is a real planned chapter with a reserved id, so it becomes a chapter record with `status: planned` rather than a presentation placeholder. |
| `spain-new-world-6` | `chapter` | `history-edexcel-spain-new-world` | Unbuilt stub (0 screens, derived `comingSoon`). It is a real planned chapter with a reserved id, so it becomes a chapter record with `status: planned` rather than a presentation placeholder. |
| `spain-new-world-7` | `chapter` | `history-edexcel-spain-new-world` | Unbuilt stub (0 screens, derived `comingSoon`). It is a real planned chapter with a reserved id, so it becomes a chapter record with `status: planned` rather than a presentation placeholder. |
| `spain-new-world-8` | `chapter` | `history-edexcel-spain-new-world` | Unbuilt stub (0 screens, derived `comingSoon`). It is a real planned chapter with a reserved id, so it becomes a chapter record with `status: planned` rather than a presentation placeholder. |
| `spain-new-world-9` | `chapter` | `history-edexcel-spain-new-world` | Unbuilt stub (0 screens, derived `comingSoon`). It is a real planned chapter with a reserved id, so it becomes a chapter record with `status: planned` rather than a presentation placeholder. |
| `usa-americas-war` | `chapter` | `history-edexcel-usa-conflict` | Unbuilt stub (0 screens, derived `comingSoon`). Becomes a chapter record with `status: planned`. |
| `usa-brown-v-board` | `chapter` | `history-edexcel-usa-conflict` | Unbuilt stub (0 screens, derived `comingSoon`). Becomes a chapter record with `status: planned`. |
| `usa-guerrilla-war` | `chapter` | `history-edexcel-usa-conflict` | Unbuilt stub (0 screens, derived `comingSoon`). Becomes a chapter record with `status: planned`. |
| `usa-how-much-changed` | `chapter` | `history-edexcel-usa-conflict` | Unbuilt stub (0 screens, derived `comingSoon`). Becomes a chapter record with `status: planned`. |
| `usa-i-have-a-dream` | `chapter` | `history-edexcel-usa-conflict` | Unbuilt stub (0 screens, derived `comingSoon`). Becomes a chapter record with `status: planned`. |
| `usa-long-way-out` | `chapter` | `history-edexcel-usa-conflict` | Unbuilt stub (0 screens, derived `comingSoon`). Becomes a chapter record with `status: planned`. |
| `usa-malcolm-x` | `chapter` | `history-edexcel-usa-conflict` | Unbuilt stub (0 screens, derived `comingSoon`). Becomes a chapter record with `status: planned`. |
| `usa-rosa-parks` | `chapter` | `history-edexcel-usa-conflict` | Unbuilt stub (0 screens, derived `comingSoon`). Becomes a chapter record with `status: planned`. |
| `usa-segregation` | `chapter` | `history-edexcel-usa-conflict` | Unbuilt stub (0 screens, derived `comingSoon`). Becomes a chapter record with `status: planned`. |
| `usa-sit-ins` | `chapter` | `history-edexcel-usa-conflict` | Unbuilt stub (0 screens, derived `comingSoon`). Becomes a chapter record with `status: planned`. |
| `usa-war-comes-home` | `chapter` | `history-edexcel-usa-conflict` | Unbuilt stub (0 screens, derived `comingSoon`). Becomes a chapter record with `status: planned`. |
| `usa-why-vietnam` | `chapter` | `history-edexcel-usa-conflict` | Unbuilt stub (0 screens, derived `comingSoon`). Becomes a chapter record with `status: planned`. |

## Chapter content loaders (60)

| Entity | Classification | Target | Note |
|---|---|---|---|
| `bio_building_blocks` | `compatibility-only` | `biology-aqa-cell-biology` | Content-source binding under `src/content/biology/cell-biology/`, which already matches the proposed module. |
| `bio_building_life` | `compatibility-only` | `biology-aqa-cell-biology` | Loader for unbuilt content in a directory that disagrees with the chapter's subject matter. Resolved when the chapter is built, not by a planning-phase file move. |
| `bio_control_systems` | `compatibility-only` | `biology-aqa-homeostasis` | Loader for unbuilt content — resolves to `{ screens: [] }`. |
| `bio_disease_wars` | `compatibility-only` | `biology-aqa-infection-and-response` | Loader for unbuilt content — resolves to `{ screens: [] }`. |
| `bio_ecosystems_group` | `compatibility-only` | `biology-aqa-ecology` | Loader for unbuilt content — resolves to `{ screens: [] }`. |
| `bio_genetics_evolution` | `compatibility-only` | `biology-aqa-inheritance-variation-evolution` | Loader for unbuilt content — resolves to `{ screens: [] }`. |
| `bio_human_machine` | `compatibility-only` | `biology-aqa-organisation` | Loader for unbuilt content — resolves to `{ screens: [] }`. |
| `english-macbeth-power-ambition` | `compatibility-only` | `english-lit-aqa-macbeth` | Content-source binding under `src/content/english/macbeth/`, which already matches the proposed module. |
| `history-medicine-accidental-miracle` | `compatibility-only` | `history-edexcel-medicine-britain` | Content-source binding. Becomes a generated entry in the chapter loader registry, projected from the chapter record's content path rather than hand-maintained alongside it. |
| `history-medicine-black-death` | `compatibility-only` | `history-edexcel-medicine-britain` | Content-source binding. Becomes a generated entry in the chapter loader registry, projected from the chapter record's content path rather than hand-maintained alongside it. |
| `history-medicine-cancer` | `compatibility-only` | `history-edexcel-medicine-britain` | Content-source binding. Becomes a generated entry in the chapter loader registry, projected from the chapter record's content path rather than hand-maintained alongside it. |
| `history-medicine-germ-theory` | `compatibility-only` | `history-edexcel-medicine-britain` | Content-source binding. Becomes a generated entry in the chapter loader registry, projected from the chapter record's content path rather than hand-maintained alongside it. |
| `history-medicine-great-plague-1665` | `compatibility-only` | `history-edexcel-medicine-britain` | Content-source binding. Becomes a generated entry in the chapter loader registry, projected from the chapter record's content path rather than hand-maintained alongside it. |
| `history-medicine-great-stink` | `compatibility-only` | `history-edexcel-medicine-britain` | Content-source binding. Becomes a generated entry in the chapter loader registry, projected from the chapter record's content path rather than hand-maintained alongside it. |
| `history-medicine-harvey-pare-renaissance-method` | `compatibility-only` | `history-edexcel-medicine-britain` | Content-source binding. Becomes a generated entry in the chapter loader registry, projected from the chapter record's content path rather than hand-maintained alongside it. |
| `history-medicine-jenner-vaccination` | `compatibility-only` | `history-edexcel-medicine-britain` | Content-source binding. Becomes a generated entry in the chapter loader registry, projected from the chapter record's content path rather than hand-maintained alongside it. |
| `history-medicine-medieval-beliefs-causes` | `compatibility-only` | `history-edexcel-medicine-britain` | Content-source binding. Becomes a generated entry in the chapter loader registry, projected from the chapter record's content path rather than hand-maintained alongside it. |
| `history-medicine-modern-medicine` | `compatibility-only` | `history-edexcel-medicine-britain` | Content-source binding. Becomes a generated entry in the chapter loader registry, projected from the chapter record's content path rather than hand-maintained alongside it. |
| `history-medicine-nightingale` | `compatibility-only` | `history-edexcel-medicine-britain` | Content-source binding. Becomes a generated entry in the chapter loader registry, projected from the chapter record's content path rather than hand-maintained alongside it. |
| `history-medicine-renaissance-medicine` | `compatibility-only` | — | Loader for a hidden superseded bundle. Retained for the migration window only, and named explicitly in the retirement list so it is removed deliberately rather than forgotten. |
| `history-medicine-surgery-anaesthetics` | `compatibility-only` | `history-edexcel-medicine-britain` | Content-source binding. Becomes a generated entry in the chapter loader registry, projected from the chapter record's content path rather than hand-maintained alongside it. |
| `history-medicine-surgery-revolution` | `compatibility-only` | `history-edexcel-medicine-britain` | Content-source binding. Becomes a generated entry in the chapter loader registry, projected from the chapter record's content path rather than hand-maintained alongside it. |
| `history-medicine-vesalius-beginning-doubt` | `compatibility-only` | `history-edexcel-medicine-britain` | Content-source binding. Becomes a generated entry in the chapter loader registry, projected from the chapter record's content path rather than hand-maintained alongside it. |
| `history-medicine-western-front` | `compatibility-only` | `history-edexcel-western-front` | Content-source binding; follows its chapter into the historic-environment module. The loader path itself does not need to move. |
| `math1` | `compatibility-only` | `maths-aqa-number` | Content-source binding under `src/content/maths/foundations/`. The directory name says "foundations" in the everyday sense, not the Foundation tier — a naming collision recorded as anomaly A-11. |
| `math2` | `compatibility-only` | `maths-aqa-number` | Content-source binding under `src/content/maths/foundations/`. The directory name says "foundations" in the everyday sense, not the Foundation tier — a naming collision recorded as anomaly A-11. |
| `math3` | `compatibility-only` | `maths-aqa-number` | Content-source binding under `src/content/maths/foundations/`. The directory name says "foundations" in the everyday sense, not the Foundation tier — a naming collision recorded as anomaly A-11. |
| `math4` | `compatibility-only` | `maths-aqa-number` | Content-source binding under `src/content/maths/foundations/`. The directory name says "foundations" in the everyday sense, not the Foundation tier — a naming collision recorded as anomaly A-11. |
| `math5` | `compatibility-only` | `maths-aqa-number` | Content-source binding under `src/content/maths/foundations/`. The directory name says "foundations" in the everyday sense, not the Foundation tier — a naming collision recorded as anomaly A-11. |
| `math6` | `compatibility-only` | `maths-aqa-number` | Content-source binding under `src/content/maths/foundations/`. The directory name says "foundations" in the everyday sense, not the Foundation tier — a naming collision recorded as anomaly A-11. |
| `math7` | `compatibility-only` | `maths-aqa-number` | Content-source binding under `src/content/maths/foundations/`. The directory name says "foundations" in the everyday sense, not the Foundation tier — a naming collision recorded as anomaly A-11. |
| `math8` | `compatibility-only` | `maths-aqa-number` | Content-source binding under `src/content/maths/foundations/`. The directory name says "foundations" in the everyday sense, not the Foundation tier — a naming collision recorded as anomaly A-11. |
| `sci_bio_w1` | `compatibility-only` | `biology-aqa-cell-biology` | Content-source binding under `src/content/biology/cell-biology/`, which already matches the proposed module. |
| `soc1` | `compatibility-only` | `sociology-aqa-key-concepts` | Content-source binding whose directory (`sociology/families/`) disagrees with the chapter's subject matter. The directory move is deferred: it is a file move with no learner-facing effect and must not be smuggled into a planning phase. |
| `soc2` | `compatibility-only` | `sociology-aqa-key-concepts` | Content-source binding whose directory (`sociology/families/`) disagrees with the chapter's subject matter. The directory move is deferred: it is a file move with no learner-facing effect and must not be smuggled into a planning phase. |
| `soc3` | `compatibility-only` | `sociology-aqa-key-concepts` | Content-source binding whose directory (`sociology/families/`) disagrees with the chapter's subject matter. The directory move is deferred: it is a file move with no learner-facing effect and must not be smuggled into a planning phase. |
| `soc4` | `compatibility-only` | `sociology-aqa-families` | Content-source binding; the content directory `src/content/sociology/families/` already matches the proposed module. |
| `soc6` | `compatibility-only` | `sociology-aqa-families` | Content-source binding; the content directory `src/content/sociology/families/` already matches the proposed module. |
| `spain-new-world-1` | `compatibility-only` | `history-edexcel-spain-new-world` | Loader for unbuilt content — resolves to `{ screens: [] }`. Under the generated registry a planned chapter with no content file emits no loader entry at all, which removes this whole category. |
| `spain-new-world-10` | `compatibility-only` | `history-edexcel-spain-new-world` | Loader for unbuilt content — resolves to `{ screens: [] }`. Under the generated registry a planned chapter with no content file emits no loader entry at all, which removes this whole category. |
| `spain-new-world-2` | `compatibility-only` | `history-edexcel-spain-new-world` | Loader for unbuilt content — resolves to `{ screens: [] }`. Under the generated registry a planned chapter with no content file emits no loader entry at all, which removes this whole category. |
| `spain-new-world-3` | `compatibility-only` | `history-edexcel-spain-new-world` | Loader for unbuilt content — resolves to `{ screens: [] }`. Under the generated registry a planned chapter with no content file emits no loader entry at all, which removes this whole category. |
| `spain-new-world-4` | `compatibility-only` | `history-edexcel-spain-new-world` | Loader for unbuilt content — resolves to `{ screens: [] }`. Under the generated registry a planned chapter with no content file emits no loader entry at all, which removes this whole category. |
| `spain-new-world-5` | `compatibility-only` | `history-edexcel-spain-new-world` | Loader for unbuilt content — resolves to `{ screens: [] }`. Under the generated registry a planned chapter with no content file emits no loader entry at all, which removes this whole category. |
| `spain-new-world-6` | `compatibility-only` | `history-edexcel-spain-new-world` | Loader for unbuilt content — resolves to `{ screens: [] }`. Under the generated registry a planned chapter with no content file emits no loader entry at all, which removes this whole category. |
| `spain-new-world-7` | `compatibility-only` | `history-edexcel-spain-new-world` | Loader for unbuilt content — resolves to `{ screens: [] }`. Under the generated registry a planned chapter with no content file emits no loader entry at all, which removes this whole category. |
| `spain-new-world-8` | `compatibility-only` | `history-edexcel-spain-new-world` | Loader for unbuilt content — resolves to `{ screens: [] }`. Under the generated registry a planned chapter with no content file emits no loader entry at all, which removes this whole category. |
| `spain-new-world-9` | `compatibility-only` | `history-edexcel-spain-new-world` | Loader for unbuilt content — resolves to `{ screens: [] }`. Under the generated registry a planned chapter with no content file emits no loader entry at all, which removes this whole category. |
| `usa-americas-war` | `compatibility-only` | `history-edexcel-usa-conflict` | Loader for unbuilt content — resolves to `{ screens: [] }`; the generated registry emits nothing for a planned chapter. |
| `usa-brown-v-board` | `compatibility-only` | `history-edexcel-usa-conflict` | Loader for unbuilt content — resolves to `{ screens: [] }`; the generated registry emits nothing for a planned chapter. |
| `usa-guerrilla-war` | `compatibility-only` | `history-edexcel-usa-conflict` | Loader for unbuilt content — resolves to `{ screens: [] }`; the generated registry emits nothing for a planned chapter. |
| `usa-how-much-changed` | `compatibility-only` | `history-edexcel-usa-conflict` | Loader for unbuilt content — resolves to `{ screens: [] }`; the generated registry emits nothing for a planned chapter. |
| `usa-i-have-a-dream` | `compatibility-only` | `history-edexcel-usa-conflict` | Loader for unbuilt content — resolves to `{ screens: [] }`; the generated registry emits nothing for a planned chapter. |
| `usa-long-way-out` | `compatibility-only` | `history-edexcel-usa-conflict` | Loader for unbuilt content — resolves to `{ screens: [] }`; the generated registry emits nothing for a planned chapter. |
| `usa-malcolm-x` | `compatibility-only` | `history-edexcel-usa-conflict` | Loader for unbuilt content — resolves to `{ screens: [] }`; the generated registry emits nothing for a planned chapter. |
| `usa-rosa-parks` | `compatibility-only` | `history-edexcel-usa-conflict` | Loader for unbuilt content — resolves to `{ screens: [] }`; the generated registry emits nothing for a planned chapter. |
| `usa-segregation` | `compatibility-only` | `history-edexcel-usa-conflict` | Loader for unbuilt content — resolves to `{ screens: [] }`; the generated registry emits nothing for a planned chapter. |
| `usa-sit-ins` | `compatibility-only` | `history-edexcel-usa-conflict` | Loader for unbuilt content — resolves to `{ screens: [] }`; the generated registry emits nothing for a planned chapter. |
| `usa-war-comes-home` | `compatibility-only` | `history-edexcel-usa-conflict` | Loader for unbuilt content — resolves to `{ screens: [] }`; the generated registry emits nothing for a planned chapter. |
| `usa-why-vietnam` | `compatibility-only` | `history-edexcel-usa-conflict` | Loader for unbuilt content — resolves to `{ screens: [] }`; the generated registry emits nothing for a planned chapter. |

## Chapter `series` values (4)

| Entity | Classification | Target | Note |
|---|---|---|---|
| `macbeth` | `compatibility-only` | `derived from the chapter→module relationship` | Same as the History series values, plus it is the only one whose value is a set text rather than a specification option — which is exactly the level confusion the module entity removes. |
| `medicine` | `compatibility-only` | `derived from the chapter→module relationship` | A module grouping wearing a presentation name. Once a chapter record names its module, the browser tab is derived from the module and `series` carries no fact of its own. |
| `spain-new-world` | `compatibility-only` | `derived from the chapter→module relationship` | A module grouping wearing a presentation name. Once a chapter record names its module, the browser tab is derived from the module and `series` carries no fact of its own. |
| `usa` | `compatibility-only` | `derived from the chapter→module relationship` | A module grouping wearing a presentation name. Once a chapter record names its module, the browser tab is derived from the module and `series` carries no fact of its own. |

## Synthetic browser placeholders (12)

| Entity | Classification | Target | Note |
|---|---|---|---|
| `cs_chemistry` | `presentation-only` | `generated empty-state` | Not authored anywhere: it is synthesised by `getSubjectChapterList`'s default branch for any subject with no modules. It is a rendering fallback, and after the migration the browser derives the empty state from "this subject has no available modules" rather than fabricating a card id. |
| `cs_forces` | `presentation-only` | `planned Physics modules` | Coming-soon card whose subtitle already names AQA Physics topic numbers ("AQA Physics · Topic 5 & 6"), so it is a module-sized promise rendered as a chapter card. It becomes a planned module, not a planned chapter. |
| `cs_energy` | `presentation-only` | `planned Physics modules` | Coming-soon card whose subtitle already names AQA Physics topic numbers ("AQA Physics · Topic 5 & 6"), so it is a module-sized promise rendered as a chapter card. It becomes a planned module, not a planned chapter. |
| `cs_waves` | `presentation-only` | `planned Physics modules` | Coming-soon card whose subtitle already names AQA Physics topic numbers ("AQA Physics · Topic 5 & 6"), so it is a module-sized promise rendered as a chapter card. It becomes a planned module, not a planned chapter. |
| `cs_space` | `presentation-only` | `planned Physics modules` | Coming-soon card whose subtitle already names AQA Physics topic numbers ("AQA Physics · Topic 5 & 6"), so it is a module-sized promise rendered as a chapter card. It becomes a planned module, not a planned chapter. |
| `cs_matter` | `presentation-only` | `planned Physics modules` | Coming-soon card whose subtitle already names AQA Physics topic numbers ("AQA Physics · Topic 5 & 6"), so it is a module-sized promise rendered as a chapter card. It becomes a planned module, not a planned chapter. |
| `cs_macbeth_2` | `presentation-only` | `chapter records with status: planned` | Coming-soon card with a real authored title and subtitle but no chapter record, no loader and no progress. It is a designed future chapter held outside the catalogue, so it becomes a planned chapter record and the placeholder array disappears. |
| `cs_macbeth_3` | `presentation-only` | `chapter records with status: planned` | Coming-soon card with a real authored title and subtitle but no chapter record, no loader and no progress. It is a designed future chapter held outside the catalogue, so it becomes a planned chapter record and the placeholder array disappears. |
| `cs_macbeth_4` | `presentation-only` | `chapter records with status: planned` | Coming-soon card with a real authored title and subtitle but no chapter record, no loader and no progress. It is a designed future chapter held outside the catalogue, so it becomes a planned chapter record and the placeholder array disappears. |
| `cs_inspector_1` | `presentation-only` | `chapter records with status: planned under english-lit-aqa-inspector-calls` | Coming-soon card for An Inspector Calls — a set text with no module, no chapters and no content directory. It becomes a planned module with planned chapters, which is what makes the second Literature text selectable rather than hardcoded. |
| `cs_inspector_2` | `presentation-only` | `chapter records with status: planned under english-lit-aqa-inspector-calls` | Coming-soon card for An Inspector Calls — a set text with no module, no chapters and no content directory. It becomes a planned module with planned chapters, which is what makes the second Literature text selectable rather than hardcoded. |
| `cs_inspector_3` | `presentation-only` | `chapter records with status: planned under english-lit-aqa-inspector-calls` | Coming-soon card for An Inspector Calls — a set text with no module, no chapters and no content directory. It becomes a planned module with planned chapters, which is what makes the second Literature text selectable rather than hardcoded. |

## Subject-browser series tabs (6)

| Entity | Classification | Target | Note |
|---|---|---|---|
| `history/medicine` | `presentation-only` | `derived from module records` | Hardcoded tab that duplicates a module's title and hero image in a React file. Becomes a projection of the module record. |
| `history/spain-new-world` | `presentation-only` | `derived from module records` | Hardcoded tab that duplicates a module's title and hero image in a React file. Becomes a projection of the module record. |
| `history/elizabethan` | `presentation-only` | `planned module history-edexcel-early-elizabethan` | A tab with no module, no chapters and no `series` value anywhere in CHAPTERS — selecting it renders an empty list. It is a curriculum intention that exists only as UI. Becomes a planned module record. |
| `history/usa` | `presentation-only` | `derived from module records` | Hardcoded tab that duplicates a module's title and hero image in a React file. Becomes a projection of the module record. |
| `english/macbeth` | `presentation-only` | `derived from module records` | Hardcoded tab duplicating the Macbeth module. Its `headerImage` currently points at the History Medicine hero image — anomaly A-9. |
| `english/inspector` | `presentation-only` | `planned module english-lit-aqa-inspector-calls` | Tab for a set text with no module and no chapters, backed only by the `cs_inspector_*` placeholders. Its `headerImage` points at a Sociology image — anomaly A-9. |

## Learning-graph course nodes (7)

| Entity | Classification | Target | Note |
|---|---|---|---|
| `biology:bioenergetics` | `concept` | `concept namespace only` | Named "course" but sized like an AQA Biology topic — i.e. a module. It has no knowledge atoms and exists to make an already-live question-bank tag legal. Keeps its spelling as a namespace; the curriculum level it implies moves to a module record. |
| `biology:building-blocks` | `concept` | `concept namespace only` | Named "course" but sized like an AQA Biology topic — i.e. a module. It has no knowledge atoms and exists to make an already-live question-bank tag legal. Keeps its spelling as a namespace; the curriculum level it implies moves to a module record. |
| `biology:infection-response` | `concept` | `concept namespace only` | Named "course" but sized like an AQA Biology topic — i.e. a module. It has no knowledge atoms and exists to make an already-live question-bank tag legal. Keeps its spelling as a namespace; the curriculum level it implies moves to a module record. |
| `biology:organisation` | `concept` | `concept namespace only` | Named "course" but sized like an AQA Biology topic — i.e. a module. It has no knowledge atoms and exists to make an already-live question-bank tag legal. Keeps its spelling as a namespace; the curriculum level it implies moves to a module record. |
| `english:language-paper-1` | `concept` | `concept namespace only` | Named "course" but sized like an exam PAPER — the sharpest instance of the level confusion. Under the canonical ontology a paper is a specification-owned structure, not a concept namespace and not a course. |
| `history:medicine` | `concept` | `concept namespace; module link via the module record` | Sits at specification-option level and is the only course node with knowledge atoms under it (80 of the registry's 87 concepts). Its id stays as a concept namespace, but it stops implying curriculum membership — that becomes a link from the module record to the concept prefix. |
| `maths:number` | `concept` | `concept namespace only` | Named "course" but sized like one AQA content domain. Same shape as the Biology nodes: a namespace placeholder with no atoms. |

## Concept collections (2)

| Entity | Classification | Target | Note |
|---|---|---|---|
| `courseNodes.js` | `concept` | `unchanged for now; superseded by module records` | Six placeholder namespaces standing in for subjects with no designed graph. It exists to keep live question-bank tags legal. As each subject gains a real concept collection and its module records, entries leave this file; it is not a permanent level in the ontology. |
| `historyMedicine.js` | `concept` | `unchanged` | A real designed knowledge graph for one specification option: 80 atoms plus topic groupings and a legacy screen-tag bridge. It is the model the other subjects have not yet reached, and the migration leaves it alone. |

## Curriculum-bearing facet tags (4)

| Entity | Classification | Target | Note |
|---|---|---|---|
| `course:medicine` | `facet` | `derived from the module reference` | The only `course:` value in the whole app, and it names a specification option. Under the canonical model this fact is carried by a chapter's module and that module's specification link, so the tag becomes derivable rather than authored. |
| `examboard:edexcel` | `facet` | `derived from the specification record` | The only `examboard:` value in use. Board is a property of a specification, so once a chapter resolves to a specification the tag is a projection. Authoring it per chapter is what lets a chapter disagree with its own module. |
| `paper:medicine` | `facet` | `derived from the specification record` | Names a subject option, not a paper — Edexcel 1HI0 Paper 1 carries both Medicine and the Western Front. It becomes a real paper reference owned by the specification. |
| `tier:gcse` | `facet` | `derived from the study pathway` | Uses the `tier:` namespace to record a qualification level, not a tier. The vocabulary already reserves `tier:foundation` / `tier:higher`, so this value is the odd one out; qualification belongs to the specification and tier belongs to the pathway. |


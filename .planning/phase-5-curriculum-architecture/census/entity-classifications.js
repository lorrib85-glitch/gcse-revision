// ─── Phase 5A — authored migration census ───────────────────────────────────
//
// One entry per curriculum-bearing entity that exists in the repository today,
// naming the classification it is proposed to carry in the canonical curriculum
// ontology (see ../DESIGN.md) and the record it is proposed to become.
//
// This file is AUTHORED. `scripts/generate-migration-census.mjs` enumerates the
// live repository, joins it against this map and fails if an entity is
// unclassified, if a classification names an entity that no longer exists, or
// if any entry carries an empty note. That join is what makes "nothing is left
// to inference during implementation" a checked property.
//
// Planning data only: no runtime code imports this, and nothing here changes
// production behaviour. `target` is a PROPOSAL, not a commitment to rename —
// see ../DESIGN.md §6 for the ID and alias rules, which preserve every existing
// chapter id verbatim because chapter ids back learner progress keys.
//
// Classification vocabulary is closed. `unresolved` is a legitimate answer and
// must point at the open decision that settles it (../DECISIONS.md).

export const CLASSIFICATION_VALUES = [
  'subject',
  'specification',
  'study-pathway',
  'module',
  'chapter',
  'concept',
  'facet',
  'presentation-only',
  'compatibility-only',
  'retired-hidden',
  'unresolved',
]

// ─── Helpers ────────────────────────────────────────────────────────────────
// Bulk groups are expanded from a list so the file stays scannable, but every
// group's note states a fact that is true of every member of that group. Where
// a member differs, it is overridden explicitly below the group.

const entries = {}

const put = (key, classification, target, note) => {
  entries[key] = { classification, target, note }
}

const group = (kind, ids, classification, target, note) => {
  for (const id of ids) put(`${kind}:${id}`, classification, target, note)
}

// A chapter and its loader are two facts about the same journey: the chapter
// row is curriculum identity, the loader entry is the content-source binding.
// They are classified separately because the migration moves them to different
// homes — identity to a chapter record, the binding to a generated registry.
const chapterAndLoader = (ids, target, chapterNote, loaderNote) => {
  group('chapter', ids, 'chapter', target, chapterNote)
  group('chapter-loader', ids, 'compatibility-only', target, loaderNote)
}

// ─── 1. Subject theme keys ──────────────────────────────────────────────────
//
// A theme key is a presentation identity: a palette, a browser accent pair and
// a set of hero images. It is NOT an academic subject, and the census keeps the
// two apart deliberately — `English` is one theme key over two qualifications,
// and `Drama` / `Music` are theme keys with no curriculum behind them at all.

group('theme-key', ['Biology', 'Chemistry', 'Physics', 'History', 'Maths', 'Sociology'], 'presentation-only',
  'src/constants/subjects.js (unchanged)',
  'Visual identity only. It happens to share a spelling with one academic subject today, but the migration stops treating that coincidence as identity: curriculum records reference a subject id, and the theme is resolved from the subject record.')

put('theme-key:English', 'presentation-only', 'src/constants/subjects.js (unchanged)',
  'One theme serving two academic subjects (English Language, English Literature). This is the clearest proof that a theme key is not a subject: it must keep serving both after the split.')

group('theme-key', ['Drama', 'Music'], 'presentation-only', 'src/constants/subjects.js (unchanged)',
  'Palette with no chapters, no module, no browser entry and no learner-reachable surface. It is branding held in advance, and must not be read as evidence that the subject exists in the curriculum.')

// ─── 2. Modules ─────────────────────────────────────────────────────────────

put('module:hist_medicine', 'module', 'history-edexcel-medicine-britain (+ history-edexcel-western-front)',
  'Splits. Fourteen thematic-study chapters stay as the Medicine module; `history-medicine-western-front` moves to its own historic-environment module referenced by the same pathway. The current single array cannot express that the two are assessed differently in Paper 1.')

put('module:soc_family', 'module', 'sociology-aqa-families (+ sociology-aqa-key-concepts)',
  'Splits. Title says "Sociology of the Family" but only soc4 and soc6 are Families; soc1–soc3 are key concepts and sociological approaches that run across both papers. The split is SETTLED (OD-4).')

put('module:maths_core', 'module', 'maths-aqa-number',
  'Renames in scope, not in membership. Titled "GCSE Maths" but every chapter is AQA Number content, so the record currently claims a whole subject and delivers one content domain. The module record takes the honest scope; the subject is expressed by the subject reference.')

put('module:bio_core', 'module', 'six AQA Biology topic modules',
  'Splits. Titled "GCSE Biology" but its chapters already live in six per-topic content directories (cell-biology, organisation, infection-and-response, homeostasis, inheritance-variation-evolution, ecology). The directory tree already carries the real module grain; MODULES does not.')

put('module:eng_macbeth', 'module', 'english-lit-aqa-macbeth',
  'Correct scope already — one set text is one module. It becomes a text module referenced by an English Literature pathway through a selection group, which is what makes swapping the Shakespeare text a pathway edit rather than a module rewrite.')

put('module:hist_spain_new_world', 'module', 'history-edexcel-spain-new-world',
  'Correct scope already — one Edexcel period-study option is one module.')

put('module:hist_usa', 'module', 'history-edexcel-usa-conflict',
  'Correct scope already — one Edexcel modern-depth-study option is one module.')

// ─── 3 & 4. Chapters and their content loaders ──────────────────────────────

const MEDICINE_THEMATIC = [
  'history-medicine-medieval-beliefs-causes',
  'history-medicine-black-death',
  'history-medicine-vesalius-beginning-doubt',
  'history-medicine-harvey-pare-renaissance-method',
  'history-medicine-great-plague-1665',
  'history-medicine-surgery-anaesthetics',
  'history-medicine-jenner-vaccination',
  'history-medicine-germ-theory',
  'history-medicine-great-stink',
  'history-medicine-surgery-revolution',
  'history-medicine-nightingale',
  'history-medicine-accidental-miracle',
  'history-medicine-modern-medicine',
  'history-medicine-cancer',
]

chapterAndLoader(MEDICINE_THEMATIC, 'history-edexcel-medicine-britain',
  'Thematic-study chapter. Identity and id are preserved verbatim; its position moves from array order in MODULES to an explicit position on the module-chapter relationship.',
  'Content-source binding. Becomes a generated entry in the chapter loader registry, projected from the chapter record\'s content path rather than hand-maintained alongside it.')

put('chapter:history-medicine-western-front', 'chapter', 'history-edexcel-western-front',
  'Moves module. It is the historic environment of Edexcel Paper 1 — assessed by the two source questions, not by the thematic-study questions — so it belongs to a historic-environment module, not to chapter position 15 of Medicine.')
put('chapter-loader:history-medicine-western-front', 'compatibility-only', 'history-edexcel-western-front',
  'Content-source binding; follows its chapter into the historic-environment module. The loader path itself does not need to move.')

put('chapter:history-medicine-renaissance-medicine', 'retired-hidden', null,
  'Superseded legacy bundle, explicitly `availability: "hidden"`, and a duplicate of number 3 with `history-medicine-vesalius-beginning-doubt`. It exists only so its progress key stays readable. It gets no curriculum record; its id is registered as a progress alias instead.')
put('chapter-loader:history-medicine-renaissance-medicine', 'compatibility-only', null,
  'Loader for a hidden superseded bundle. Retained for the migration window only, and named explicitly in the retirement list so it is removed deliberately rather than forgotten.')

const SPAIN = Array.from({ length: 10 }, (_, i) => `spain-new-world-${i + 1}`)
chapterAndLoader(SPAIN, 'history-edexcel-spain-new-world',
  'Unbuilt stub (0 screens, derived `comingSoon`). It is a real planned chapter with a reserved id, so it becomes a chapter record with `status: planned` rather than a presentation placeholder.',
  'Loader for unbuilt content — resolves to `{ screens: [] }`. Under the generated registry a planned chapter with no content file emits no loader entry at all, which removes this whole category.')

const USA = [
  'usa-segregation', 'usa-brown-v-board', 'usa-rosa-parks', 'usa-sit-ins',
  'usa-i-have-a-dream', 'usa-malcolm-x', 'usa-how-much-changed', 'usa-why-vietnam',
  'usa-americas-war', 'usa-guerrilla-war', 'usa-war-comes-home', 'usa-long-way-out',
]
chapterAndLoader(USA, 'history-edexcel-usa-conflict',
  'Unbuilt stub (0 screens, derived `comingSoon`). Becomes a chapter record with `status: planned`.',
  'Loader for unbuilt content — resolves to `{ screens: [] }`; the generated registry emits nothing for a planned chapter.')

chapterAndLoader(['soc4', 'soc6'], 'sociology-aqa-families',
  'Families chapter — AQA Sociology Paper 1 Section A. Built content. Id preserved.',
  'Content-source binding; the content directory `src/content/sociology/families/` already matches the proposed module.')

chapterAndLoader(['soc1', 'soc2', 'soc3'], 'sociology-aqa-key-concepts',
  'Key-concepts / approaches chapter, not Families content, despite sitting in the `soc_family` module and the `sociology/families/` content directory. Built content. The move is SETTLED (OD-4): these are cross-course foundations, not substantive Families content, and the split supports reuse across both AQA Sociology papers.',
  'Content-source binding whose directory (`sociology/families/`) disagrees with the chapter\'s subject matter. The directory move is deferred: it is a file move with no learner-facing effect and must not be smuggled into a planning phase.')

chapterAndLoader(['math1', 'math2', 'math3', 'math4', 'math5', 'math6', 'math7', 'math8'],
  'maths-aqa-number',
  'AQA Number chapter. Built content. Tier is deliberately NOT recorded on the chapter: these are Foundation-and-Higher content, and tier belongs to the pathway that references the module (see DESIGN.md §5.1).',
  'Content-source binding under `src/content/maths/foundations/`. The directory name says "foundations" in the everyday sense, not the Foundation tier — a naming collision recorded as anomaly A-11.')

chapterAndLoader(['bio_building_blocks', 'sci_bio_w1'], 'biology-aqa-cell-biology',
  'Built AQA Cell Biology chapter. `sci_bio_w1` also collides on number 2 with `bio_building_life` — evidence that `chapter.number` is display metadata, not identity (DESIGN.md §5.5).',
  'Content-source binding under `src/content/biology/cell-biology/`, which already matches the proposed module.')

put('chapter:bio_building_life', 'chapter', 'biology-aqa-cell-biology',
  'Unbuilt stub whose loader sits in `biology/organisation/` but whose title and subtitle ("Cells, Microscopes & Division") are Cell Biology. Anomaly A-6: the proposed module follows the subject matter, not the directory.')
put('chapter-loader:bio_building_life', 'compatibility-only', 'biology-aqa-cell-biology',
  'Loader for unbuilt content in a directory that disagrees with the chapter\'s subject matter. Resolved when the chapter is built, not by a planning-phase file move.')

put('chapter:bio_human_machine', 'chapter', 'biology-aqa-organisation',
  'Unbuilt stub. Organisation content (organs, digestion, circulation); loader directory agrees.')
put('chapter-loader:bio_human_machine', 'compatibility-only', 'biology-aqa-organisation',
  'Loader for unbuilt content — resolves to `{ screens: [] }`.')

put('chapter:bio_disease_wars', 'chapter', 'biology-aqa-infection-and-response',
  'Unbuilt stub. Infection and response content; loader directory agrees.')
put('chapter-loader:bio_disease_wars', 'compatibility-only', 'biology-aqa-infection-and-response',
  'Loader for unbuilt content — resolves to `{ screens: [] }`.')

put('chapter:bio_control_systems', 'chapter', 'biology-aqa-homeostasis',
  'Unbuilt stub. Homeostasis and response content; loader directory agrees.')
put('chapter-loader:bio_control_systems', 'compatibility-only', 'biology-aqa-homeostasis',
  'Loader for unbuilt content — resolves to `{ screens: [] }`.')

put('chapter:bio_genetics_evolution', 'chapter', 'biology-aqa-inheritance-variation-evolution',
  'Unbuilt stub. Inheritance, variation and evolution content; loader directory agrees.')
put('chapter-loader:bio_genetics_evolution', 'compatibility-only', 'biology-aqa-inheritance-variation-evolution',
  'Loader for unbuilt content — resolves to `{ screens: [] }`.')

put('chapter:bio_ecosystems_group', 'chapter', 'biology-aqa-ecology',
  'Unbuilt stub. Ecology content; loader directory agrees.')
put('chapter-loader:bio_ecosystems_group', 'compatibility-only', 'biology-aqa-ecology',
  'Loader for unbuilt content — resolves to `{ screens: [] }`.')

put('chapter:english-macbeth-power-ambition', 'chapter', 'english-lit-aqa-macbeth',
  'Built Macbeth chapter (1 screen). Its subject becomes `english-literature`, not the shared `English` theme key — the first entity the English split actually moves.')
put('chapter-loader:english-macbeth-power-ambition', 'compatibility-only', 'english-lit-aqa-macbeth',
  'Content-source binding under `src/content/english/macbeth/`, which already matches the proposed module.')

// ─── 5. Chapter `series` values ─────────────────────────────────────────────
//
// `series` is doing two jobs at once: it is the browser's tab filter AND the
// only machine-readable statement that these chapters belong together above the
// module level. The migration gives the second job to the module reference and
// leaves `series` with nothing to own.

group('chapter-series', ['medicine', 'spain-new-world', 'usa'], 'compatibility-only',
  'derived from the chapter→module relationship',
  'A module grouping wearing a presentation name. Once a chapter record names its module, the browser tab is derived from the module and `series` carries no fact of its own.')

put('chapter-series:macbeth', 'compatibility-only', 'derived from the chapter→module relationship',
  'Same as the History series values, plus it is the only one whose value is a set text rather than a specification option — which is exactly the level confusion the module entity removes.')

// ─── 6. Synthetic browser placeholders ──────────────────────────────────────

group('browser-placeholder', ['cs_macbeth_2', 'cs_macbeth_3', 'cs_macbeth_4'], 'presentation-only',
  'chapter records with status: planned',
  'Coming-soon card with a real authored title and subtitle but no chapter record, no loader and no progress. It is a designed future chapter held outside the catalogue, so it becomes a planned chapter record and the placeholder array disappears.')

group('browser-placeholder', ['cs_inspector_1', 'cs_inspector_2', 'cs_inspector_3'], 'presentation-only',
  'chapter records with status: planned under english-lit-aqa-inspector-calls',
  'Coming-soon card for An Inspector Calls — a set text with no module, no chapters and no content directory. It becomes a planned module with planned chapters, which is what makes the second Literature text selectable rather than hardcoded.')

group('browser-placeholder', ['cs_forces', 'cs_energy', 'cs_waves', 'cs_space', 'cs_matter'], 'presentation-only',
  'planned Physics modules',
  'Coming-soon card whose subtitle already names AQA Physics topic numbers ("AQA Physics · Topic 5 & 6"), so it is a module-sized promise rendered as a chapter card. It becomes a planned module, not a planned chapter.')

put('browser-placeholder:cs_chemistry', 'presentation-only', 'generated empty-state',
  'Not authored anywhere: it is synthesised by `getSubjectChapterList`\'s default branch for any subject with no modules. It is a rendering fallback, and after the migration the browser derives the empty state from "this subject has no available modules" rather than fabricating a card id.')

// ─── 7. Subject-browser series tabs ─────────────────────────────────────────

group('browser-series-tab', ['history/medicine', 'history/spain-new-world', 'history/usa'], 'presentation-only',
  'derived from module records',
  'Hardcoded tab that duplicates a module\'s title and hero image in a React file. Becomes a projection of the module record.')

put('browser-series-tab:history/elizabethan', 'presentation-only', 'planned module history-edexcel-early-elizabethan',
  'A tab with no module, no chapters and no `series` value anywhere in CHAPTERS — selecting it renders an empty list. It is a curriculum intention that exists only as UI. Becomes a planned module record.')

put('browser-series-tab:english/macbeth', 'presentation-only', 'derived from module records',
  'Hardcoded tab duplicating the Macbeth module. Its `headerImage` currently points at the History Medicine hero image — anomaly A-9.')

put('browser-series-tab:english/inspector', 'presentation-only', 'planned module english-lit-aqa-inspector-calls',
  'Tab for a set text with no module and no chapters, backed only by the `cs_inspector_*` placeholders. Its `headerImage` points at a Sociology image — anomaly A-9.')

// ─── 8. Learning-graph course nodes ─────────────────────────────────────────
//
// This is the level confusion the prompt predicted, measured: the seven
// two-segment "course" ids sit at four different curriculum levels.

put('course-node:history:medicine', 'concept', 'concept namespace; module link via the module record',
  'Sits at specification-option level and is the only course node with knowledge atoms under it (80 of the registry\'s 87 concepts). Its id stays as a concept namespace, but it stops implying curriculum membership — that becomes a link from the module record to the concept prefix.')

group('course-node', ['biology:building-blocks', 'biology:organisation', 'biology:infection-response', 'biology:bioenergetics'],
  'concept', 'concept namespace only',
  'Named "course" but sized like an AQA Biology topic — i.e. a module. It has no knowledge atoms and exists to make an already-live question-bank tag legal. Keeps its spelling as a namespace; the curriculum level it implies moves to a module record.')

put('course-node:maths:number', 'concept', 'concept namespace only',
  'Named "course" but sized like one AQA content domain. Same shape as the Biology nodes: a namespace placeholder with no atoms.')

put('course-node:english:language-paper-1', 'concept', 'concept namespace only',
  'Named "course" but sized like an exam PAPER — the sharpest instance of the level confusion. Under the canonical ontology a paper is a specification-owned structure, not a concept namespace and not a course.')

// ─── 9. Concept collections ─────────────────────────────────────────────────

put('concept-collection:historyMedicine.js', 'concept', 'unchanged',
  'A real designed knowledge graph for one specification option: 80 atoms plus topic groupings and a legacy screen-tag bridge. It is the model the other subjects have not yet reached, and the migration leaves it alone.')

put('concept-collection:courseNodes.js', 'concept', 'unchanged for now; superseded by module records',
  'Six placeholder namespaces standing in for subjects with no designed graph. It exists to keep live question-bank tags legal. As each subject gains a real concept collection and its module records, entries leave this file; it is not a permanent level in the ontology.')

// ─── 10–13. Curriculum-bearing facet tags ───────────────────────────────────

put('curriculum-facet-tag:course:medicine', 'facet', 'derived from the module reference',
  'The only `course:` value in the whole app, and it names a specification option. Under the canonical model this fact is carried by a chapter\'s module and that module\'s specification link, so the tag becomes derivable rather than authored.')

put('curriculum-facet-tag:examboard:edexcel', 'facet', 'derived from the specification record',
  'The only `examboard:` value in use. Board is a property of a specification, so once a chapter resolves to a specification the tag is a projection. Authoring it per chapter is what lets a chapter disagree with its own module.')

put('curriculum-facet-tag:paper:medicine', 'facet', 'derived from the specification record',
  'Names a subject option, not a paper — Edexcel 1HI0 Paper 1 carries both Medicine and the Western Front. It becomes a real paper reference owned by the specification.')

put('curriculum-facet-tag:tier:gcse', 'facet', 'derived from the study pathway',
  'Uses the `tier:` namespace to record a qualification level, not a tier. The vocabulary already reserves `tier:foundation` / `tier:higher`, so this value is the odd one out; qualification belongs to the specification and tier belongs to the pathway.')

export const CLASSIFICATIONS = entries

// ─── Runtime compatibility projection — v1 ──────────────────────────────────
//
// TEMPORARY. BUILD-TIME ONLY. NOT CURRICULUM.
//
// This file exists for one reason: the canonical catalogue describes 8 subjects,
// 14 pathways, 36 modules and 65 chapters, while the pre-cutover runtime
// interface exposes 7 `MODULES`, 60 `CHAPTERS` and 60
// `CHAPTER_CONTENT_LOADERS`. Stage 3 promises EXACT runtime parity, so the
// difference has to be written down somewhere that is visibly not the
// curriculum. This is that somewhere.
//
// It holds the minimum set of facts that:
//
//   - cannot be derived from a canonical record, and
//   - cannot be derived from a content file,
//
// and that the pre-cutover runtime interface nevertheless states. Every one of
// them is legacy presentation or legacy ordering — most are fields the schema
// explicitly REJECTS on a canonical chapter (`REJECTED_FIELDS` names
// `chapter.number` "replaced by position on the chapter reference" and
// `chapter.series` "replaced by module membership"). That is the test of
// whether a fact belongs here: the canonical model refused to own it, and the
// old interface still prints it.
//
// ── The rules this file lives under ────────────────────────────────────────
//
//   1. It is NOT a curriculum entity. There are six, and adding a seventh here
//      would make the compatibility layer part of the thing it exists to
//      retire. `CURRICULUM_ENTITY_TYPES` in schema.js is the list; nothing in
//      this directory appears in it.
//   2. Production source must never import it. Enforced by
//      `tests/architecture/curriculum-compatibility.test.js`.
//   3. It must be plain serialisable data, and it is validated like a record.
//   4. It must never duplicate a fact derivable from a canonical record or a
//      content file. A test proves each declared value is genuinely
//      non-derivable, so this file cannot quietly become a second authority.
//   5. Every field names the stage that deletes it — see `DELETION_STAGES` in
//      `./index.js`. A compatibility field with no death date is permanent
//      architecture wearing a temporary label.
//   6. Nothing here may leak into the future canonical navigation projection
//      (Stage 5). It reproduces the OLD interface and nothing else.
//
// ── What it deliberately does NOT contain ──────────────────────────────────
//
// Chapter title, subtitle, era, icon, headerImage, concept tags, content path,
// subject and module membership — all canonical. `screenCount` and
// `screenTags` — both derived from the content file, exactly, for all 60 rows.
// Legacy module subject — derived from the canonical modules it aggregates.

export default {
  // ── The seven legacy Module ids ──────────────────────────────────────────
  //
  // Each legacy module is an AGGREGATION of canonical modules, in the order
  // given. `chapterIds` is then those modules' `chapterRefs` concatenated in
  // `position` order — never restated here, because it is derivable.
  //
  // `title` is `null` when the legacy title is exactly the title of the single
  // canonical module it aggregates, so the derivable case stays derived. It is
  // a string only where no canonical record says it: an aggregate of several
  // modules has no single title, and two legacy titles differ from their
  // canonical source by capitalisation that the canonical records deliberately
  // corrected ("Medicine Through Time" → "Medicine through time").
  //
  // `subject` is absent by design: it is derived from the aggregated modules'
  // `subjectId` through the subject record's `themeKey`, and the generator
  // fails if the aggregated modules disagree.
  legacyModules: [
    {
      id: 'hist_medicine',
      title: 'Medicine Through Time',
      canonicalModuleIds: ['history-edexcel-medicine-britain', 'history-edexcel-western-front'],
    },
    {
      id: 'soc_family',
      title: 'Sociology of the Family',
      canonicalModuleIds: ['sociology-aqa-key-concepts', 'sociology-aqa-families'],
    },
    {
      id: 'maths_core',
      title: 'GCSE Maths',
      canonicalModuleIds: ['maths-aqa-number'],
    },
    {
      id: 'bio_core',
      title: 'GCSE Biology',
      // Six canonical Biology modules. The order is the current runtime chapter
      // order, which is why Cell biology comes first and Ecology last.
      canonicalModuleIds: [
        'biology-aqa-cell-biology',
        'biology-aqa-organisation',
        'biology-aqa-infection-and-response',
        'biology-aqa-homeostasis',
        'biology-aqa-inheritance-variation-evolution',
        'biology-aqa-ecology',
      ],
    },
    {
      // Derivable: one canonical module, and 'Macbeth' is its title.
      id: 'eng_macbeth',
      title: null,
      canonicalModuleIds: ['english-lit-aqa-macbeth'],
    },
    {
      id: 'hist_spain_new_world',
      title: 'Spain and the New World, c1490–c1555',
      canonicalModuleIds: ['history-edexcel-spain-new-world'],
    },
    {
      // Derivable: one canonical module, and the titles are identical.
      id: 'hist_usa',
      title: null,
      canonicalModuleIds: ['history-edexcel-usa-conflict'],
    },
  ],

  // ── The hidden Renaissance row, and its insertion point ──────────────────
  //
  // `history-medicine-renaissance-medicine` is the superseded Renaissance
  // bundle. It is hidden from every learner surface and has no chapter record —
  // it is not a chapter — but its id is still a live progress destination
  // (`LEGACY_CHAPTER_ID_MAP` folds `mod2` onto it) and its loader entry still
  // exists. It therefore has to be stated in full: there is no canonical record
  // to derive any of it from.
  //
  // `screenCount` and `screenTags` are NOT stated. They derive from
  // `contentPath` exactly as they do for the other 59 rows.
  //
  // This is the former `legacyContentBindings` record, moved here. A binding
  // was never a seventh curriculum entity; it was compatibility data filed
  // under `records/`.
  hiddenChapter: {
    insertAfter: 'history-medicine-black-death',
    contentPath: 'src/content/history/medicine/episodes/episode-03-renaissance-medicine.js',
    supersededBy: 'history-medicine-vesalius-beginning-doubt',
    reason: 'The superseded Renaissance bundle. Hidden from every learner surface and replaced '
      + 'by a narrower chapter, but its id is still a live progress destination — '
      + 'LEGACY_CHAPTER_ID_MAP folds `mod2` onto it — and its loader entry still exists. It is '
      + 'compatibility data rather than a retired chapter record, because a retired chapter '
      + 'record would put it back in the catalogue as a chapter, which is exactly what it is not.',
    row: {
      id: "history-medicine-renaissance-medicine",
      subject: "History",
      series: "medicine",
      number: 3,
      title: "The beginning of doubt",
      subtitle: "Medical Renaissance",
      era: "c.1500–c.1600",
      icon: "🔬",
      color: "#D4950A",
      colorLight: "rgba(212,149,10,.12)",
      headerImage: "/images/history/medicine/headers/renaissance.png",
      tags: [
      "subject:history",
      "course:medicine",
      "examboard:edexcel",
      "period:renaissance",
      "history:medicine:vesalius",
      "history:medicine:printing-press",
      ],
      availability: "hidden",
    },
  },

  // ── Legacy-only Chapter fields ───────────────────────────────────────────
  //
  // Four kinds of fact, none of them derivable:
  //
  //   number      — a frozen display index. It is NOT the canonical chapter
  //                 position: `history-medicine-surgery-anaesthetics` sits at
  //                 canonical position 5 and prints 4, `soc6` at position 1 and
  //                 prints 6. Eighteen of the sixty disagree with position + 1,
  //                 which is why the schema rejects `chapter.number` outright.
  //   series      — a legacy grouping string, present on 39 rows and absent on
  //                 21. Replaced by module membership; the schema rejects it.
  //   color /
  //   colorLight  — per-chapter palette values. Subject palettes live in
  //                 `src/constants/subjects.js`; these are per-row overrides
  //                 with no canonical home and no rule that generates them.
  //   facetTags   — the non-concept prefix of `tags` on the 16 rows that carry
  //                 tags at all (`subject:`, `course:`, `examboard:`,
  //                 `period:`, `theme:`). The CONCEPT portion of `tags` is
  //                 canonical `conceptIds` and is never repeated here.
  //
  // A row is listed only if it has at least one of these. All 59 non-hidden
  // runtime rows do, because every one carries `number`, `color` and
  // `colorLight`.
  chapterFields: {
    "history-medicine-medieval-beliefs-causes": { number: 1, series: "medicine", color: "#F5B700", colorLight: "#f5e6d3", facetTags: ["subject:history", "course:medicine", "examboard:edexcel", "period:medieval"] },
    "history-medicine-black-death": { number: 2, series: "medicine", color: "#8C3A2A", colorLight: "rgba(140,58,42,0.12)", facetTags: ["subject:history", "course:medicine", "examboard:edexcel", "period:medieval"] },
    "history-medicine-vesalius-beginning-doubt": { number: 3, series: "medicine", color: "#D4950A", colorLight: "rgba(212,149,10,.12)", facetTags: ["subject:history", "course:medicine", "examboard:edexcel", "period:renaissance"] },
    "history-medicine-harvey-pare-renaissance-method": { number: 4, series: "medicine", color: "#C47828", colorLight: "rgba(196,120,40,.12)", facetTags: ["subject:history", "course:medicine", "examboard:edexcel", "period:renaissance"] },
    "history-medicine-surgery-anaesthetics": { number: 4, series: "medicine", color: "#C47828", colorLight: "rgba(196,120,40,.12)", facetTags: ["subject:history", "course:medicine", "examboard:edexcel", "period:18th-19th-century", "theme:surgery"] },
    "history-medicine-great-plague-1665": { number: 5, series: "medicine", color: "#9A4820", colorLight: "rgba(154,72,32,.12)", facetTags: ["subject:history", "course:medicine", "examboard:edexcel", "period:renaissance"] },
    "history-medicine-jenner-vaccination": { number: 6, series: "medicine", color: "#BD7224", colorLight: "rgba(189,114,36,.12)", facetTags: ["subject:history", "course:medicine", "examboard:edexcel", "period:18th-19th-century"] },
    "history-medicine-germ-theory": { number: 7, series: "medicine", color: "#B06520", colorLight: "rgba(176,101,32,.12)", facetTags: ["subject:history", "course:medicine", "examboard:edexcel", "period:19th-century", "theme:germ-theory"] },
    "history-medicine-great-stink": { number: 8, series: "medicine", color: "#9A5A18", colorLight: "rgba(154,90,24,.12)", facetTags: ["subject:history", "course:medicine", "examboard:edexcel", "period:19th-century", "theme:public-health"] },
    "history-medicine-surgery-revolution": { number: 9, series: "medicine", color: "#7A4515", colorLight: "rgba(122,69,21,.12)", facetTags: ["subject:history", "course:medicine", "examboard:edexcel", "period:19th-century", "theme:surgery"] },
    "history-medicine-nightingale": { number: 10, series: "medicine", color: "#8B5014", colorLight: "rgba(139,80,20,.12)", facetTags: ["subject:history", "course:medicine", "examboard:edexcel", "period:19th-century"] },
    "history-medicine-accidental-miracle": { number: 11, series: "medicine", color: "#7A4515", colorLight: "rgba(122,69,21,.12)", facetTags: ["subject:history", "course:medicine", "examboard:edexcel", "period:modern"] },
    "history-medicine-modern-medicine": { number: 12, series: "medicine", color: "#1A5276", colorLight: "rgba(26,82,118,.12)", facetTags: ["subject:history", "course:medicine", "examboard:edexcel", "period:modern"] },
    "history-medicine-cancer": { number: 13, series: "medicine", color: "#C47828", colorLight: "rgba(196,120,40,.12)", facetTags: ["subject:history", "course:medicine", "period:modern"] },
    "history-medicine-western-front": { number: 14, series: "medicine", color: "#5A6A4A", colorLight: "rgba(90,106,74,.12)", facetTags: ["subject:history", "course:medicine", "examboard:edexcel", "period:western-front", "theme:war"] },
    "spain-new-world-1": { number: 1, series: "spain-new-world", color: "#C8741C", colorLight: "rgba(200,116,28,.12)" },
    "spain-new-world-2": { number: 2, series: "spain-new-world", color: "#C07018", colorLight: "rgba(192,112,24,.12)" },
    "spain-new-world-3": { number: 3, series: "spain-new-world", color: "#B86A14", colorLight: "rgba(184,106,20,.12)" },
    "spain-new-world-4": { number: 4, series: "spain-new-world", color: "#B06410", colorLight: "rgba(176,100,16,.12)" },
    "spain-new-world-5": { number: 5, series: "spain-new-world", color: "#A85E0C", colorLight: "rgba(168,94,12,.12)" },
    "spain-new-world-6": { number: 6, series: "spain-new-world", color: "#A05808", colorLight: "rgba(160,88,8,.12)" },
    "spain-new-world-7": { number: 7, series: "spain-new-world", color: "#985204", colorLight: "rgba(152,82,4,.12)" },
    "spain-new-world-8": { number: 8, series: "spain-new-world", color: "#8A4C00", colorLight: "rgba(138,76,0,.12)" },
    "spain-new-world-9": { number: 9, series: "spain-new-world", color: "#824600", colorLight: "rgba(130,70,0,.12)" },
    "spain-new-world-10": { number: 10, series: "spain-new-world", color: "#7A4000", colorLight: "rgba(122,64,0,.12)" },
    "usa-segregation": { number: 1, series: "usa", color: "#B82020", colorLight: "rgba(184,32,32,.12)" },
    "usa-brown-v-board": { number: 2, series: "usa", color: "#B02222", colorLight: "rgba(176,34,34,.12)" },
    "usa-rosa-parks": { number: 3, series: "usa", color: "#A82424", colorLight: "rgba(168,36,36,.12)" },
    "usa-sit-ins": { number: 4, series: "usa", color: "#A02626", colorLight: "rgba(160,38,38,.12)" },
    "usa-i-have-a-dream": { number: 5, series: "usa", color: "#982828", colorLight: "rgba(152,40,40,.12)" },
    "usa-malcolm-x": { number: 6, series: "usa", color: "#902A2A", colorLight: "rgba(144,42,42,.12)" },
    "usa-how-much-changed": { number: 7, series: "usa", color: "#882C2C", colorLight: "rgba(136,44,44,.12)" },
    "usa-why-vietnam": { number: 8, series: "usa", color: "#2A4A6A", colorLight: "rgba(42,74,106,.12)" },
    "usa-americas-war": { number: 9, series: "usa", color: "#264468", colorLight: "rgba(38,68,104,.12)" },
    "usa-guerrilla-war": { number: 10, series: "usa", color: "#223E66", colorLight: "rgba(34,62,102,.12)" },
    "usa-war-comes-home": { number: 11, series: "usa", color: "#1E3864", colorLight: "rgba(30,56,100,.12)" },
    "usa-long-way-out": { number: 12, series: "usa", color: "#1A3262", colorLight: "rgba(26,50,98,.12)" },
    "bio_building_blocks": { number: 1, color: "#4FA36C", colorLight: "rgba(79,163,108,.15)" },
    "sci_bio_w1": { number: 2, color: "#38D27A", colorLight: "rgba(56,210,122,.15)" },
    "bio_building_life": { number: 2, color: "#65E6C6", colorLight: "rgba(101,230,198,.15)" },
    "bio_human_machine": { number: 3, color: "#E87B5F", colorLight: "rgba(232,123,95,.15)" },
    "bio_disease_wars": { number: 4, color: "#E84F6B", colorLight: "rgba(232,79,107,.15)" },
    "bio_control_systems": { number: 5, color: "#9B8BE8", colorLight: "rgba(155,139,232,.15)" },
    "bio_genetics_evolution": { number: 6, color: "#7EC8E3", colorLight: "rgba(126,200,227,.15)" },
    "bio_ecosystems_group": { number: 7, color: "#68C18A", colorLight: "rgba(104,193,138,.15)" },
    "math1": { number: 1, color: "#2DD4BF", colorLight: "rgba(45,212,191,.12)" },
    "math2": { number: 2, color: "#2DD4BF", colorLight: "rgba(45,212,191,.12)" },
    "math3": { number: 3, color: "#2DD4BF", colorLight: "rgba(45,212,191,.12)" },
    "math4": { number: 4, color: "#2DD4BF", colorLight: "rgba(45,212,191,.12)" },
    "math5": { number: 5, color: "#2DD4BF", colorLight: "rgba(45,212,191,.12)" },
    "math6": { number: 6, color: "#2DD4BF", colorLight: "rgba(45,212,191,.12)" },
    "math7": { number: 7, color: "#2DD4BF", colorLight: "rgba(45,212,191,.12)" },
    "math8": { number: 8, color: "#2DD4BF", colorLight: "rgba(45,212,191,.12)" },
    "soc1": { number: 1, color: "#D96030", colorLight: "rgba(217,96,48,.12)" },
    "soc2": { number: 2, color: "#D96030", colorLight: "rgba(217,96,48,.12)" },
    "soc3": { number: 3, color: "#D96030", colorLight: "rgba(123,63,140,.12)" },
    "soc4": { number: 4, color: "#D96030", colorLight: "rgba(217,96,48,.12)" },
    "soc6": { number: 6, color: "#D96030", colorLight: "rgba(217,96,48,.12)" },
    "english-macbeth-power-ambition": { number: 1, series: "macbeth", color: "#B84A3A", colorLight: "rgba(184,74,58,.14)" },
  },

  // ── Runtime row order ────────────────────────────────────────────────────
  //
  // The order of `CHAPTERS`. Not derivable: it is neither the canonical module
  // order nor the legacy `MODULES` order. The legacy modules run medicine,
  // sociology, maths, biology, english, spain, usa; these rows run medicine,
  // spain, usa, biology, maths, sociology, english — and within medicine,
  // `surgery-anaesthetics` precedes `great-plague-1665`, the reverse of both
  // the canonical and the legacy module order.
  //
  // This list is also the exclusion boundary. A canonical chapter that is not
  // named here does not enter the Stage 3 projection at all.
  chapterOrder: [
    "history-medicine-medieval-beliefs-causes",
    "history-medicine-black-death",
    "history-medicine-renaissance-medicine",
    "history-medicine-vesalius-beginning-doubt",
    "history-medicine-harvey-pare-renaissance-method",
    "history-medicine-surgery-anaesthetics",
    "history-medicine-great-plague-1665",
    "history-medicine-jenner-vaccination",
    "history-medicine-germ-theory",
    "history-medicine-great-stink",
    "history-medicine-surgery-revolution",
    "history-medicine-nightingale",
    "history-medicine-accidental-miracle",
    "history-medicine-modern-medicine",
    "history-medicine-cancer",
    "history-medicine-western-front",
    "spain-new-world-1",
    "spain-new-world-2",
    "spain-new-world-3",
    "spain-new-world-4",
    "spain-new-world-5",
    "spain-new-world-6",
    "spain-new-world-7",
    "spain-new-world-8",
    "spain-new-world-9",
    "spain-new-world-10",
    "usa-segregation",
    "usa-brown-v-board",
    "usa-rosa-parks",
    "usa-sit-ins",
    "usa-i-have-a-dream",
    "usa-malcolm-x",
    "usa-how-much-changed",
    "usa-why-vietnam",
    "usa-americas-war",
    "usa-guerrilla-war",
    "usa-war-comes-home",
    "usa-long-way-out",
    "bio_building_blocks",
    "sci_bio_w1",
    "bio_building_life",
    "bio_human_machine",
    "bio_disease_wars",
    "bio_control_systems",
    "bio_genetics_evolution",
    "bio_ecosystems_group",
    "math1",
    "math2",
    "math3",
    "math4",
    "math5",
    "math6",
    "math7",
    "math8",
    "soc1",
    "soc2",
    "soc3",
    "soc4",
    "soc6",
    "english-macbeth-power-ambition",
  ],

  // ── Loader key order ─────────────────────────────────────────────────────
  //
  // `CHAPTER_CONTENT_LOADERS` holds the same 60 ids in the same contiguous
  // runs as `chapterOrder`, but sequences the runs differently (sociology and
  // maths before biology). Naming the first id of each run is enough to
  // recover it; repeating all sixty would be a second copy of a fact this file
  // already states, which rule 4 forbids.
  loaderSectionAnchors: [
    'history-medicine-medieval-beliefs-causes',
    'spain-new-world-1',
    'usa-segregation',
    'soc1',
    'math1',
    'bio_building_blocks',
    'english-macbeth-power-ambition',
  ],

  // ── Canonical chapters excluded from the Stage 3 projection ──────────────
  //
  // Six planned English Literature chapters exist canonically and have no
  // runtime row, no content file and no loader. Stage 3 is behaviour-
  // preserving, so they must NOT appear: surfacing six new coming-soon cards
  // is a learner-visible change, and Stage 3 is not allowed to make one.
  //
  // They are listed explicitly rather than filtered by status, so that adding a
  // planned chapter to any other module fails the projection instead of being
  // silently dropped.
  excludedChapterIds: [
    'english-inspector-calls-social-message',
    'english-inspector-calls-responsibility-denial',
    'english-inspector-calls-consequences-resolution',
    'english-macbeth-guilt-consequence',
    'english-macbeth-witches-fate',
    'english-macbeth-appearance-reality',
  ],
}

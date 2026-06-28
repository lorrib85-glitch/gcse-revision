// Module content registry — maps each module ID to its own content file.
// Each loader is a dynamic import so only the requested episode is downloaded.
//
// To add a new module, run /module-creation <id> — it will append the entry
// here automatically. Do not add entries manually without a matching content file.
//
// Subjects not yet split per-module (Biology, Maths, Sociology, Chemistry, English)
// are handled by SUBJECT_MODULE_LOADERS in src/app/LegacyApp.jsx.

export const MODULE_CONTENT_LOADERS = {
  // ── History — Medicine Through Time ─────────────────────────────────────────
  'history-medicine-medieval-beliefs-causes': () => import('./history/medicine/episodes/episode-01-medieval-beliefs-causes.js').then(m => m.default),
  'history-medicine-black-death':             () => import('./history/medicine/episodes/episode-02-black-death.js').then(m => m.default),
  'history-medicine-renaissance-medicine':    () => import('./history/medicine/episodes/episode-03-renaissance-medicine.js').then(m => m.default),
  'history-medicine-surgery-anaesthetics':    () => import('./history/medicine/episodes/episode-04-surgery-anaesthetics.js').then(m => m.default),
  'history-medicine-jenner-vaccination':      () => import('./history/medicine/episodes/episode-06-jenner-vaccination.js').then(m => m.default),
  'history-medicine-germ-theory':             () => import('./history/medicine/episodes/episode-07-germ-theory.js').then(m => m.default),
  'history-medicine-great-stink':             () => import('./history/medicine/episodes/episode-08-great-stink.js').then(m => m.default),
  'history-medicine-surgery-revolution':      () => import('./history/medicine/episodes/episode-09-surgery-revolution.js').then(m => m.default),
  'history-medicine-accidental-miracle':      () => import('./history/medicine/episodes/episode-11-accidental-miracle.js').then(m => m.default),
  'history-medicine-modern-medicine':         () => import('./history/medicine/episodes/episode-12-when-medicine-became-magic.js').then(m => m.default),
  'history-medicine-cancer':                  () => import('./history/medicine/episodes/episode-13-can-we-beat-cancer.js').then(m => m.default),
  'history-medicine-western-front':           () => import('./history/medicine/episodes/episode-14-western-front.js').then(m => m.default),

  // ── Sociology — Families ─────────────────────────────────────────────────────
  'soc1': () => import('./sociology/families/episodes/soc1.js').then(m => m.default),
  'soc2': () => import('./sociology/families/episodes/soc2.js').then(m => m.default),
  'soc3': () => import('./sociology/families/episodes/soc3.js').then(m => m.default),
  'soc4': () => import('./sociology/families/episodes/soc4.js').then(m => m.default),
  'soc6': () => import('./sociology/families/episodes/soc6.js').then(m => m.default),

  // ── Maths — Foundations ──────────────────────────────────────────────────────
  'math1': () => import('./maths/foundations/episodes/math1.js').then(m => m.default),
  'math2': () => import('./maths/foundations/episodes/math2.js').then(m => m.default),
  'math3': () => import('./maths/foundations/episodes/math3.js').then(m => m.default),
  'math4': () => import('./maths/foundations/episodes/math4.js').then(m => m.default),
  'math5': () => import('./maths/foundations/episodes/math5.js').then(m => m.default),
  'math6': () => import('./maths/foundations/episodes/math6.js').then(m => m.default),
  'math7': () => import('./maths/foundations/episodes/math7.js').then(m => m.default),

  // ── Biology — Cell Biology ───────────────────────────────────────────────────
  'bio_building_blocks': () => import('./biology/cell-biology/episodes/bio_building_blocks.js').then(m => m.default),
  'sci_bio_w1':          () => import('./biology/cell-biology/episodes/sci_bio_w1.js').then(m => m.default),

  // ── Biology — Organisation ───────────────────────────────────────────────────
  'bio_building_life': () => import('./biology/organisation/episodes/bio_building_life.js').then(m => m.default),
  'bio_human_machine': () => import('./biology/organisation/episodes/bio_human_machine.js').then(m => m.default),

  // ── Biology — Infection and Response ────────────────────────────────────────
  'bio_disease_wars': () => import('./biology/infection-and-response/episodes/bio_disease_wars.js').then(m => m.default),

  // ── Biology — Homeostasis ────────────────────────────────────────────────────
  'bio_control_systems': () => import('./biology/homeostasis/episodes/bio_control_systems.js').then(m => m.default),

  // ── Biology — Inheritance, Variation and Evolution ───────────────────────────
  'bio_genetics_evolution': () => import('./biology/inheritance-variation-evolution/episodes/bio_genetics_evolution.js').then(m => m.default),

  // ── Biology — Ecology ────────────────────────────────────────────────────────
  'bio_ecosystems_group': () => import('./biology/ecology/episodes/bio_ecosystems_group.js').then(m => m.default),

  // ── Chemistry — Atomic Structure ─────────────────────────────────────────────
  'chem_matter_atoms': () => import('./chemistry/atomic-structure/episodes/chem_matter_atoms.js').then(m => m.default),

  // ── Chemistry — Chemical Changes ─────────────────────────────────────────────
  'chem_reactions': () => import('./chemistry/chemical-changes/episodes/chem_reactions.js').then(m => m.default),

  // ── Chemistry — Rates and Organic Chemistry ──────────────────────────────────
  'chem_rates_organic': () => import('./chemistry/rates-and-organic/episodes/chem_rates_organic.js').then(m => m.default),

  // ── Chemistry — Chemistry of the Atmosphere ──────────────────────────────────
  'chem_earth': () => import('./chemistry/chemistry-of-the-atmosphere/episodes/chem_earth.js').then(m => m.default),

  // ── English — Macbeth ────────────────────────────────────────────────────────
  'english-macbeth-power-ambition': () => import('./english/macbeth/episodes/english-macbeth-power-ambition.js').then(m => m.default),
}

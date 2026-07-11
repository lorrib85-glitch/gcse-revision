// Module content registry — maps each module ID to its own content file.
// Each loader is a dynamic import so only the requested episode is downloaded.
//
// To add a new module, run /module-creation <id> — it will append the entry
// here automatically. Do not add entries manually without a matching content file.
//
// Every module ID in src/modules.js must have an entry here, including
// unbuilt stubs (screenCount: 0) — their loader resolves to { screens: [] }.

export const MODULE_CONTENT_LOADERS = {
  // ── History — Medicine Through Time ─────────────────────────────────────────
  'history-medicine-medieval-beliefs-causes': () => import('./history/medicine/episodes/episode-01-medieval-beliefs-causes.runtime.js').then(m => m.default),
  'history-medicine-black-death':             () => import('./history/medicine/episodes/episode-02-black-death.js').then(m => m.default),
  'history-medicine-renaissance-medicine':    () => import('./history/medicine/episodes/episode-03-renaissance-medicine.js').then(m => m.default), // hidden legacy bundle
  'history-medicine-vesalius-beginning-doubt': () => import('./history/medicine/episodes/episode-03-vesalius-beginning-doubt.js').then(m => m.default),
  'history-medicine-harvey-pare-renaissance-method': () => import('./history/medicine/episodes/episode-04-harvey-pare-renaissance-method.js').then(m => m.default),
  'history-medicine-surgery-anaesthetics':    () => import('./history/medicine/episodes/episode-04-surgery-anaesthetics.js').then(m => m.default),
  'history-medicine-great-plague-1665':       () => import('./history/medicine/episodes/episode-05-great-plague-1665.js').then(m => m.default),
  'history-medicine-jenner-vaccination':      () => import('./history/medicine/episodes/episode-06-jenner-vaccination.js').then(m => m.default),
  'history-medicine-germ-theory':             () => import('./history/medicine/episodes/episode-07-germ-theory.js').then(m => m.default),
  'history-medicine-great-stink':             () => import('./history/medicine/episodes/episode-08-great-stink.js').then(m => m.default),
  'history-medicine-surgery-revolution':      () => import('./history/medicine/episodes/episode-09-surgery-revolution.js').then(m => m.default),
  'history-medicine-nightingale':              () => import('./history/medicine/episodes/episode-10-nightingale.js').then(m => m.default), // unbuilt stub
  'history-medicine-accidental-miracle':      () => import('./history/medicine/episodes/episode-11-accidental-miracle.js').then(m => m.default),
  'history-medicine-modern-medicine':         () => import('./history/medicine/episodes/episode-12-when-medicine-became-magic.js').then(m => m.default),
  'history-medicine-cancer':                  () => import('./history/medicine/episodes/episode-13-can-we-beat-cancer.js').then(m => m.default),
  'history-medicine-western-front':           () => import('./history/medicine/episodes/episode-14-western-front.js').then(m => m.default),

  // ── History — Spain & the New World (unbuilt stubs) ──────────────────────────
  'spain-new-world-1':  () => import('./history/spain-new-world/episodes/spain-new-world-1.js').then(m => m.default),
  'spain-new-world-2':  () => import('./history/spain-new-world/episodes/spain-new-world-2.js').then(m => m.default),
  'spain-new-world-3':  () => import('./history/spain-new-world/episodes/spain-new-world-3.js').then(m => m.default),
  'spain-new-world-4':  () => import('./history/spain-new-world/episodes/spain-new-world-4.js').then(m => m.default),
  'spain-new-world-5':  () => import('./history/spain-new-world/episodes/spain-new-world-5.js').then(m => m.default),
  'spain-new-world-6':  () => import('./history/spain-new-world/episodes/spain-new-world-6.js').then(m => m.default),
  'spain-new-world-7':  () => import('./history/spain-new-world/episodes/spain-new-world-7.js').then(m => m.default),
  'spain-new-world-8':  () => import('./history/spain-new-world/episodes/spain-new-world-8.js').then(m => m.default),
  'spain-new-world-9':  () => import('./history/spain-new-world/episodes/spain-new-world-9.js').then(m => m.default),
  'spain-new-world-10': () => import('./history/spain-new-world/episodes/spain-new-world-10.js').then(m => m.default),

  // ── History — USA: Conflict at Home & Abroad (unbuilt stubs) ─────────────────
  'usa-segregation':      () => import('./history/usa/episodes/usa-segregation.js').then(m => m.default),
  'usa-brown-v-board':    () => import('./history/usa/episodes/usa-brown-v-board.js').then(m => m.default),
  'usa-rosa-parks':       () => import('./history/usa/episodes/usa-rosa-parks.js').then(m => m.default),
  'usa-sit-ins':          () => import('./history/usa/episodes/usa-sit-ins.js').then(m => m.default),
  'usa-i-have-a-dream':   () => import('./history/usa/episodes/usa-i-have-a-dream.js').then(m => m.default),
  'usa-malcolm-x':        () => import('./history/usa/episodes/usa-malcolm-x.js').then(m => m.default),
  'usa-how-much-changed': () => import('./history/usa/episodes/usa-how-much-changed.js').then(m => m.default),
  'usa-why-vietnam':      () => import('./history/usa/episodes/usa-why-vietnam.js').then(m => m.default),
  'usa-americas-war':     () => import('./history/usa/episodes/usa-americas-war.js').then(m => m.default),
  'usa-guerrilla-war':    () => import('./history/usa/episodes/usa-guerrilla-war.js').then(m => m.default),
  'usa-war-comes-home':   () => import('./history/usa/episodes/usa-war-comes-home.js').then(m => m.default),
  'usa-long-way-out':     () => import('./history/usa/episodes/usa-long-way-out.js').then(m => m.default),

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
  'math8': () => import('./maths/foundations/episodes/math8.js').then(m => m.default),

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

  // ── Chemistry ────────────────────────────────────────────────────────────────
  // No Chemistry modules are registered yet. Stub content files exist under
  // ./chemistry/*/episodes/ — when a module is actually built, add its loader
  // entry here AND its metadata entry (with real screenCount/screenTags) to
  // src/modules.js in the same commit. Registering a loader without metadata
  // (or vice versa) fails tests/architecture/module-metadata-integrity.test.js.

  // ── English — Macbeth ────────────────────────────────────────────────────────
  'english-macbeth-power-ambition': () => import('./english/macbeth/episodes/english-macbeth-power-ambition.js').then(m => m.default),
}

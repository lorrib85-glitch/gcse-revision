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
}

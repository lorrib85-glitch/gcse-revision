// ─── Stage 1 verification provenance ───────────────────────────────────────
//
// Every Stage 1 record was checked against the awarding body's own published
// material on the same day, and the honesty note is identical on all of them.
// Stated once so a typo in one copy cannot become a lie in one record.
//
// This file is NOT a record and is never loaded as one — `loadCatalogue.js`
// reads only the locations `LAYOUT` declares, and `records/provenance.js` is
// not one of them.

export const VERIFIED_ON = '2026-08-05'

/**
 * The circumstances of the check, recorded rather than glossed over.
 *
 * The awarding-body domains were not reachable from the implementation
 * environment. The facts were verified independently against the official
 * sources and supplied in-session; no URL below was opened from here. Saying
 * so is the difference between provenance and decoration.
 */
export const IN_SESSION_NOTE = 'Official awarding-body source independently verified and '
  + 'supplied in-session; the implementation environment could not access the awarding-body domain.'

/** Build a provenance record for an official source. */
export const verified = (sourceName, sourceUrl) => ({
  sourceName,
  sourceUrl,
  verifiedOn: VERIFIED_ON,
  note: IN_SESSION_NOTE,
})

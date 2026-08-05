// ─── Academic subjects ─────────────────────────────────────────────────────
//
// A subject is a stable academic discipline: it survives a specification
// change, a board change and a tier change. Eight are authored — the eight the
// app teaches or has authored modules for. `drama` and `music` are canonical
// disciplines in the vocabulary and get no record until their first module is
// ready (OD-7); listing an id creates nothing.
//
// A subject owns no specifications, no modules and no chapters. Coverage runs
// the other way, which is what lets one Combined Science specification cover
// three disciplines without any of them claiming it (D-2).
//
// `themeKey` REFERENCES `src/constants/subjects.js`; it is not identity.
// `english-language` and `english-literature` share the `English` palette and
// are two different subjects — one theme, two academic identities.
//
// ── Persisted progress names (OD-1) ────────────────────────────────────────
//
// Subject strings are written into `gcse_scores` and the weakness tracker, so
// they are progress identity, not display text. The canonical ids differ from
// the strings already on disk, so each subject records which persisted strings
// belong to it.
//
// `'English'` is the case that needs two lists. It was written before Language
// and Literature were separate subjects, and no rule can recover which one an
// old row meant. Both English subjects therefore list it as UNATTRIBUTED: it
// stays readable, stays visible in historical activity, and counts toward
// neither subject's average. Guessing would fabricate learner data, and
// fabricated progress is worse than absent progress.
//
// `'Quick Fire'` is also persisted and is not a subject at all (census A-19).
// It belongs to no subject record and is deliberately absent from both lists.

const subject = (id, title, shortTitle, themeKey, status, legacyProgressNames, unattributedProgressNames = []) => ({
  id,
  title,
  shortTitle,
  themeKey,
  status,
  legacyProgressNames,
  unattributedProgressNames,
})

export default [
  // `active` — the app has at least one module holding a chapter a learner can
  // open today. `planned` — every module for it is still a promise.
  subject('mathematics', 'Maths', 'Maths', 'Maths', 'active', ['Maths']),
  subject('biology', 'Biology', 'Biology', 'Biology', 'active', ['Biology']),
  subject('chemistry', 'Chemistry', 'Chemistry', 'Chemistry', 'planned', ['Chemistry']),
  subject('physics', 'Physics', 'Physics', 'Physics', 'planned', ['Physics']),
  subject('history', 'History', 'History', 'History', 'active', ['History']),
  subject('english-language', 'English language', 'Language', 'English', 'planned', [], ['English']),
  subject('english-literature', 'English literature', 'Literature', 'English', 'active', [], ['English']),
  subject('sociology', 'Sociology', 'Sociology', 'Sociology', 'active', ['Sociology']),
]

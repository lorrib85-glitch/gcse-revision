// ─── Legacy content bindings ───────────────────────────────────────────────
//
// Content files the runtime still loads for ids the curriculum does not own as
// chapters. This is the difference between "the catalogue describes the
// curriculum" and "the catalogue can reproduce the runtime": without these
// records the loader registry would be one entry short and nothing would say
// which entry, or why.
//
// A binding is not a chapter. It has no module, no position, no status and no
// learner surface. It states only that a path is still loaded and why.

export default [
  {
    id: 'history-medicine-renaissance-medicine',
    contentPath: 'src/content/history/medicine/episodes/episode-03-renaissance-medicine.js',
    supersededBy: 'history-medicine-vesalius-beginning-doubt',
    reason: 'The superseded Renaissance bundle. Hidden from every learner surface and replaced '
      + 'by a narrower chapter, but its id is still a live progress destination — '
      + 'LEGACY_CHAPTER_ID_MAP folds `mod2` onto it — and its loader entry still exists. It gets '
      + 'a binding rather than a retired chapter record, because a retired chapter record would '
      + 'put it back in the catalogue as a chapter, which is exactly what it is not.',
  },
]

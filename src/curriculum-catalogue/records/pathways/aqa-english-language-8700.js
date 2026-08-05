// ─── AQA GCSE English language ──────────────────────────────────────────────
//
// The control case for the selection machinery. English Language sets no
// texts — every source is unseen and supplied in the exam — so `selections`
// is genuinely empty rather than a field padded with placeholders. Untiered,
// so exactly one pathway.

export default {
  id: 'aqa-english-language-8700',
  specificationId: 'aqa-gcse-english-language-8700',
  title: 'AQA GCSE English language',
  shortTitle: 'Language',
  tier: null,

  selections: {},

  moduleRefs: [
    { moduleId: 'english-language-aqa-reading-fiction', position: 0, required: true },
    { moduleId: 'english-language-aqa-creative-writing', position: 1, required: true },
    { moduleId: 'english-language-aqa-reading-non-fiction', position: 2, required: true },
    { moduleId: 'english-language-aqa-viewpoint-writing', position: 3, required: true },
  ],

  status: 'planned',
  scope: 'catalogue',
}

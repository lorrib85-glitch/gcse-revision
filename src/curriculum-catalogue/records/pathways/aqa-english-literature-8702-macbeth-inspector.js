// ─── AQA GCSE English literature: Macbeth and An Inspector Calls ────────────
//
// The specification says what must be chosen; this record says what was
// chosen. Two of the four groups are `null` — the 19th-century novel and the
// poetry cluster are not in app scope, and recording them as unchosen is the
// honest form. A `null` is a stated absence; an omitted key would be a
// forgotten question.

export default {
  id: 'aqa-english-literature-8702-macbeth-inspector',
  specificationId: 'aqa-gcse-english-literature-8702',
  title: 'AQA GCSE English literature: Macbeth and An Inspector Calls',
  shortTitle: 'Literature',
  tier: null,

  selections: {
    'shakespeare-text': 'macbeth',
    'nineteenth-century-novel': null,
    'modern-text': 'an-inspector-calls',
    'poetry-anthology-cluster': null,
  },

  moduleRefs: [
    { moduleId: 'english-lit-aqa-macbeth', position: 0, required: true, selectionGroup: 'shakespeare-text' },
    { moduleId: 'english-lit-aqa-inspector-calls', position: 1, required: true, selectionGroup: 'modern-text' },
  ],

  status: 'active',
  scope: 'catalogue',
}

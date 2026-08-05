// ─── Macbeth ────────────────────────────────────────────────────────────────
//
// A text module, not a Shakespeare module. Swapping the set text is a
// pathway edit — a different selection and a different module ref — and
// rewrites nothing here. The hero image stays null: the current tab points
// at the History Medicine artwork (anomaly A-9), and carrying a known-wrong
// image forward would launder it.

export default {
  id: 'english-lit-aqa-macbeth',
  title: 'Macbeth',
  shortTitle: 'Macbeth',
  subjectId: 'english-literature',

  specRefs: [
    {
      specificationId: 'aqa-gcse-english-literature-8702',
      paperIds: [
        'aqa-gcse-english-literature-8702-paper-1',
      ],
      // Empty until the specification authors its requirements.
      requirementIds: [],
    },
  ],

  chapterRefs: [
    { chapterId: 'english-macbeth-power-ambition', position: 0 },
    { chapterId: 'english-macbeth-guilt-consequence', position: 1 },
    { chapterId: 'english-macbeth-witches-fate', position: 2 },
    { chapterId: 'english-macbeth-appearance-reality', position: 3 },
  ],

  status: 'active',
  presentation: {
    heroImage: null,
    shortDescription: 'The Shakespeare text: power, ambition, guilt, fate and appearance against reality.',
  },
}

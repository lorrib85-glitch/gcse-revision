// ─── An Inspector Calls ─────────────────────────────────────────────────────
//
// The modern-text choice, which had a browser tab and three coming-soon
// cards but no module and no chapters. This is what finally puts something
// real behind the tab. Hero image null for the same reason as Macbeth — the
// current tab points at a Sociology image (A-9).

export default {
  id: 'english-lit-aqa-inspector-calls',
  title: 'An Inspector Calls',
  shortTitle: 'Inspector',
  subjectId: 'english-literature',

  specRefs: [
    {
      specificationId: 'aqa-gcse-english-literature-8702',
      paperIds: [
        'aqa-gcse-english-literature-8702-paper-2',
      ],
      // Empty until the specification authors its requirements.
      requirementIds: [],
    },
  ],

  chapterRefs: [
    { chapterId: 'english-inspector-calls-social-message', position: 0 },
    { chapterId: 'english-inspector-calls-responsibility-denial', position: 1 },
    { chapterId: 'english-inspector-calls-consequences-resolution', position: 2 },
  ],

  status: 'planned',
  presentation: {
    heroImage: null,
    shortDescription: "Priestley's modern text: social responsibility, denial and consequence.",
  },
}

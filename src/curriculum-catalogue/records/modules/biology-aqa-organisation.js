// ─── Organisation ───────────────────────────────────────────────────────────

export default {
  id: 'biology-aqa-organisation',
  title: 'Organisation',
  shortTitle: 'Organisation',
  subjectId: 'biology',

  specRefs: [
    {
      specificationId: 'aqa-gcse-combined-science-trilogy-8464',
      paperIds: [
        'aqa-gcse-combined-science-trilogy-8464-biology-paper-1',
      ],
      // Empty until the specification authors its requirements.
      requirementIds: [],
    },
    {
      specificationId: 'aqa-gcse-biology-8461',
      paperIds: [
        'aqa-gcse-biology-8461-paper-1',
      ],
      // Empty until the specification authors its requirements.
      requirementIds: [],
    },
  ],

  chapterRefs: [
    { chapterId: 'bio_human_machine', position: 0 },
  ],

  status: 'planned',
  presentation: {
    heroImage: '/images/biology/_shared/humanmachine.webp',
    shortDescription: 'Tissues, organs and the digestive, circulatory and respiratory systems.',
  },
}

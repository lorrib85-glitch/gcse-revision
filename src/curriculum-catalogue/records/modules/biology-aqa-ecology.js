// ─── Ecology ────────────────────────────────────────────────────────────────

export default {
  id: 'biology-aqa-ecology',
  title: 'Ecology',
  shortTitle: 'Ecology',
  subjectId: 'biology',

  specRefs: [
    {
      specificationId: 'aqa-gcse-combined-science-trilogy-8464',
      paperIds: [
        'aqa-gcse-combined-science-trilogy-8464-biology-paper-2',
      ],
      // Empty until the specification authors its requirements.
      requirementIds: [],
    },
    {
      specificationId: 'aqa-gcse-biology-8461',
      paperIds: [
        'aqa-gcse-biology-8461-paper-2',
      ],
      // Empty until the specification authors its requirements.
      requirementIds: [],
    },
  ],

  chapterRefs: [
    { chapterId: 'bio_ecosystems_group', position: 0 },
  ],

  status: 'planned',
  presentation: {
    heroImage: '/images/biology/_shared/ecosystems.webp',
    shortDescription: 'Adaptation, food chains, cycles, biodiversity and human impact.',
  },
}

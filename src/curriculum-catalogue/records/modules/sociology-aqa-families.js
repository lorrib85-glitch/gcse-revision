// ─── Families ───────────────────────────────────────────────────────────────

export default {
  id: 'sociology-aqa-families',
  title: 'Families',
  shortTitle: 'Families',
  subjectId: 'sociology',

  specRefs: [
    {
      specificationId: 'aqa-gcse-sociology-8192',
      paperIds: [
        'aqa-gcse-sociology-8192-paper-1',
      ],
      // Empty until the specification authors its requirements.
      requirementIds: [],
    },
  ],

  chapterRefs: [
    { chapterId: 'soc4', position: 0 },
    { chapterId: 'soc6', position: 1 },
  ],

  status: 'active',
  presentation: {
    heroImage: '/images/sociology/_shared/family.webp',
    shortDescription: 'Family forms, roles, relationships and the researchers who disagree about them.',
  },
}

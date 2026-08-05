// ─── Key concepts and approaches ────────────────────────────────────────────
//
// Was inside `soc_family`, a module titled "Sociology of the Family" holding
// three chapters that are not about families. The split is settled (OD-4).

export default {
  id: 'sociology-aqa-key-concepts',
  title: 'Key concepts and approaches',
  shortTitle: 'Key concepts',
  subjectId: 'sociology',

  specRefs: [
    {
      specificationId: 'aqa-gcse-sociology-8192',
      paperIds: [
        'aqa-gcse-sociology-8192-paper-1',
        'aqa-gcse-sociology-8192-paper-2',
      ],
      // Empty until the specification authors its requirements.
      requirementIds: [],
    },
  ],

  chapterRefs: [
    { chapterId: 'soc1', position: 0 },
    { chapterId: 'soc2', position: 1 },
    { chapterId: 'soc3', position: 2 },
  ],

  status: 'active',
  presentation: {
    heroImage: '/images/sociology/_shared/main.webp',
    shortDescription: 'Culture, norms, values, socialisation and the sociological approaches that run through both papers.',
  },
}

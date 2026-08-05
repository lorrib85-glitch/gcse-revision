// ─── Cell biology ───────────────────────────────────────────────────────────
//
// Was part of `bio_core`, titled "GCSE Biology". Its chapters already lived
// in six per-topic content directories: the directory tree carried the real
// module grain and `MODULES` did not.

export default {
  id: 'biology-aqa-cell-biology',
  title: 'Cell biology',
  shortTitle: 'Cells',
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
    { chapterId: 'bio_building_blocks', position: 0 },
    { chapterId: 'sci_bio_w1', position: 1 },
    { chapterId: 'bio_building_life', position: 2 },
  ],

  status: 'active',
  presentation: {
    heroImage: '/images/biology/_shared/buildinglife.webp',
    shortDescription: 'Cell structure, microscopy, transport and cell division.',
  },
}

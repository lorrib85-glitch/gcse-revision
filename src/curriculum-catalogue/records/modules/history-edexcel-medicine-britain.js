// ─── Medicine through time ──────────────────────────────────────────────────
//
// Was `hist_medicine`, a fifteen-chapter array whose last entry was the
// Western Front — a different specification element assessed by different
// question types. That module now stops at the thematic study.

export default {
  id: 'history-edexcel-medicine-britain',
  title: 'Medicine through time',
  shortTitle: 'Medicine',
  subjectId: 'history',

  specRefs: [
    {
      specificationId: 'pearson-edexcel-gcse-history-1hi0',
      paperIds: [
        'pearson-edexcel-gcse-history-1hi0-paper-1',
      ],
      // Empty until the specification authors its requirements.
      requirementIds: [],
    },
  ],

  chapterRefs: [
    { chapterId: 'history-medicine-medieval-beliefs-causes', position: 0 },
    { chapterId: 'history-medicine-black-death', position: 1 },
    { chapterId: 'history-medicine-vesalius-beginning-doubt', position: 2 },
    { chapterId: 'history-medicine-harvey-pare-renaissance-method', position: 3 },
    { chapterId: 'history-medicine-great-plague-1665', position: 4 },
    { chapterId: 'history-medicine-surgery-anaesthetics', position: 5 },
    { chapterId: 'history-medicine-jenner-vaccination', position: 6 },
    { chapterId: 'history-medicine-germ-theory', position: 7 },
    { chapterId: 'history-medicine-great-stink', position: 8 },
    { chapterId: 'history-medicine-surgery-revolution', position: 9 },
    { chapterId: 'history-medicine-nightingale', position: 10 },
    { chapterId: 'history-medicine-accidental-miracle', position: 11 },
    { chapterId: 'history-medicine-modern-medicine', position: 12 },
    { chapterId: 'history-medicine-cancer', position: 13 },
  ],

  status: 'active',
  presentation: {
    heroImage: '/images/history/_shared/medicine-through-time.webp',
    shortDescription: 'The thematic study: c1250 to the present, and what changed medicine at each turn.',
  },
}

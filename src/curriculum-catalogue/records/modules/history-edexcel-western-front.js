// ─── The British sector of the Western Front ────────────────────────────────
//
// Chapter 15 of 15 with nothing marking it as different, yet it is the only
// part of Paper 1 examined by source questions — which
// `guidedAnswerCoach.js` already knows, and no curriculum record could say.
// A separate module under the SAME selection group states what Edexcel
// states: chosen together, taught and assessed as two units. The chapter
// keeps its id and its content file; only its module membership changes.

export default {
  id: 'history-edexcel-western-front',
  title: 'The British sector of the Western Front',
  shortTitle: 'Western Front',
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
    { chapterId: 'history-medicine-western-front', position: 0 },
  ],

  status: 'active',
  presentation: {
    heroImage: null,
    shortDescription: 'The historic environment: injuries, treatment and the chain of evacuation, 1914–18.',
  },
}

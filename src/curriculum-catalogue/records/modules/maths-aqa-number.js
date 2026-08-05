// ─── Number ─────────────────────────────────────────────────────────────────
//
// Was `maths_core`, titled "GCSE Maths" while every chapter in it was Number
// content. The record takes the honest scope; the subject is stated by the
// reference, not by the title.

export default {
  id: 'maths-aqa-number',
  title: 'Number',
  shortTitle: 'Number',
  subjectId: 'mathematics',

  specRefs: [
    {
      specificationId: 'aqa-gcse-mathematics-8300',
      paperIds: [
        'aqa-gcse-mathematics-8300-paper-1',
        'aqa-gcse-mathematics-8300-paper-2',
        'aqa-gcse-mathematics-8300-paper-3',
      ],
      // Empty until the specification authors its requirements.
      requirementIds: [],
    },
  ],

  chapterRefs: [
    { chapterId: 'math1', position: 0 },
    { chapterId: 'math2', position: 1 },
    { chapterId: 'math3', position: 2 },
    { chapterId: 'math4', position: 3 },
    { chapterId: 'math5', position: 4 },
    { chapterId: 'math6', position: 5 },
    { chapterId: 'math7', position: 6 },
    { chapterId: 'math8', position: 7 },
  ],

  status: 'active',
  presentation: {
    heroImage: '/images/maths/_shared/numbers.webp',
    shortDescription: 'Place value, the four operations, negatives, BIDMAS, rounding, factors, powers and fractions.',
  },
}

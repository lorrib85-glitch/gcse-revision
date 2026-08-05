// ─── Space ──────────────────────────────────────────────────────────────────
//
// The one Science module that is NOT shared. Space physics (Topic 8) is
// assessed only in separate GCSE Physics; Combined Science: Trilogy does not
// examine it at all. So this module has one `specRef`, and neither Combined
// pathway reaches it.
//
// That asymmetry is the point of `specRefs` being a list rather than a flag: a
// module shared by two specifications and a module belonging to one are the
// same shape, and the difference is stated rather than special-cased.

export default {
  id: 'physics-aqa-space',
  title: 'Space',
  shortTitle: 'Space',
  subjectId: 'physics',

  specRefs: [
    {
      specificationId: 'aqa-gcse-physics-8463',
      paperIds: [
        'aqa-gcse-physics-8463-paper-2',
      ],
      // Empty until the specification authors its requirements.
      requirementIds: [],
    },
  ],

  chapterRefs: [],

  status: 'planned',
  presentation: {
    heroImage: null,
    shortDescription: 'AQA Physics · Topic 8',
  },
}

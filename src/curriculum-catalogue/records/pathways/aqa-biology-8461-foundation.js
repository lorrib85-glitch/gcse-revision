// ─── AQA GCSE Biology, Foundation tier ──────────────────────────────────────
//
// Triple Science is three pathways, one per specification — not a "triple"
// entity. It is a count of enrolments, and the model needs no concept for
// it.

export default {
  id: 'aqa-biology-8461-foundation',
  specificationId: 'aqa-gcse-biology-8461',
  title: 'AQA GCSE Biology, Foundation tier',
  shortTitle: 'Biology (F)',
  tier: 'foundation',

  selections: {},

  moduleRefs: [
    { moduleId: 'biology-aqa-cell-biology', position: 0, required: true },
    { moduleId: 'biology-aqa-organisation', position: 1, required: true },
    { moduleId: 'biology-aqa-infection-and-response', position: 2, required: true },
    { moduleId: 'biology-aqa-homeostasis', position: 3, required: true },
    { moduleId: 'biology-aqa-inheritance-variation-evolution', position: 4, required: true },
    { moduleId: 'biology-aqa-ecology', position: 5, required: true },
  ],

  status: 'active',
  scope: 'catalogue',
}

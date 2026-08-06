// ─── Learner runtime sequence configuration ────────────────────────────────
//
// BUILD-TIME ONLY. Plain serialisable application configuration.
//
// A Learning Sequence is the order in which this app offers Chapters inside a
// coherent learner journey. It is not a seventh curriculum entity: canonical
// Modules still own Chapter membership and Study Pathways still own
// qualification structure. The sequence owns only app-level continuation,
// numbering scope and completion hand-off across one or more canonical Modules.
//
// The seven sequences preserve the learner behaviour previously encoded by the
// seven compatibility-shaped MODULES rows, but use semantic ids and canonical
// Module references. They remain useful after migration: planners and adaptive
// routes need an explicit ordered journey rather than a browser tile or a raw
// catalogue file order.

export default [
  {
    id: 'history-medicine',
    position: 0,
    title: 'Medicine Through Time',
    subjectId: 'history',
    moduleIds: [
      'history-edexcel-medicine-britain',
      'history-edexcel-western-front',
    ],
  },
  {
    id: 'sociology-family',
    position: 1,
    title: 'Sociology of the Family',
    subjectId: 'sociology',
    moduleIds: [
      'sociology-aqa-key-concepts',
      'sociology-aqa-families',
    ],
  },
  {
    id: 'maths-number',
    position: 2,
    title: 'GCSE Maths',
    subjectId: 'mathematics',
    moduleIds: ['maths-aqa-number'],
  },
  {
    id: 'biology-core',
    position: 3,
    title: 'GCSE Biology',
    subjectId: 'biology',
    moduleIds: [
      'biology-aqa-cell-biology',
      'biology-aqa-organisation',
      'biology-aqa-infection-and-response',
      'biology-aqa-homeostasis',
      'biology-aqa-inheritance-variation-evolution',
      'biology-aqa-ecology',
    ],
  },
  {
    id: 'english-macbeth',
    position: 4,
    title: 'Macbeth',
    subjectId: 'english-literature',
    moduleIds: ['english-lit-aqa-macbeth'],
  },
  {
    id: 'history-spain-new-world',
    position: 5,
    title: 'Spain and the New World, c1490–c1555',
    subjectId: 'history',
    moduleIds: ['history-edexcel-spain-new-world'],
  },
  {
    id: 'history-usa-conflict',
    position: 6,
    title: 'USA: conflict at home and abroad',
    subjectId: 'history',
    moduleIds: ['history-edexcel-usa-conflict'],
  },
]

// ─── Course nodes for subjects without a built concept graph yet ────────────
//
// These two-segment nodes document course tags ALREADY live in the question
// banks — they are not speculative content. When a subject's learning graph
// is designed (Biology first, per the backlog), its knowledge atoms are added
// in a concepts/<subjectCourse>.js file of their own, e.g. biology:cell,
// biology:osmosis, maths:factorising, english:macbeth:ambition.
//
// Do NOT add three-segment concept atoms here.

export const COURSE_NODES = [
  { id: 'biology:building-blocks', label: 'Biology — Building blocks of life' },
  { id: 'biology:organisation', label: 'Biology — Organisation' },
  { id: 'biology:infection-response', label: 'Biology — Infection and response' },
  { id: 'biology:bioenergetics', label: 'Biology — Bioenergetics' },
  { id: 'maths:number', label: 'Maths — Number' },
  { id: 'english:language-paper-1', label: 'English Language — Paper 1' },
]

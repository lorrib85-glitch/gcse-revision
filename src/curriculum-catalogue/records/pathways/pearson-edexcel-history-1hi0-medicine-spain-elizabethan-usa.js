// ─── Edexcel GCSE History: Medicine, Spain, Elizabethan England and the USA ───
//
// Two module refs share one selection group. That is the mechanism the
// Western Front split turns on: Edexcel pairs the thematic study and the
// historic environment in a single option, so they are chosen together and
// taught as two units. Saying it here costs one field and keeps Medicine
// from having to absorb a differently-assessed unit.

export default {
  id: 'pearson-edexcel-history-1hi0-medicine-spain-elizabethan-usa',
  specificationId: 'pearson-edexcel-gcse-history-1hi0',
  title: 'Edexcel GCSE History: Medicine, Spain, Elizabethan England and the USA',
  shortTitle: 'History',
  tier: null,

  selections: {
    'thematic-study-and-historic-environment': 'medicine-and-western-front',
    'period-study': 'spain-new-world',
    'british-depth-study': 'early-elizabethan-england',
    'modern-depth-study': 'usa-conflict',
  },

  moduleRefs: [
    { moduleId: 'history-edexcel-medicine-britain', position: 0, required: true, selectionGroup: 'thematic-study-and-historic-environment' },
    { moduleId: 'history-edexcel-western-front', position: 1, required: true, selectionGroup: 'thematic-study-and-historic-environment' },
    { moduleId: 'history-edexcel-spain-new-world', position: 2, required: true, selectionGroup: 'period-study' },
    { moduleId: 'history-edexcel-early-elizabethan', position: 3, required: true, selectionGroup: 'british-depth-study' },
    { moduleId: 'history-edexcel-usa-conflict', position: 4, required: true, selectionGroup: 'modern-depth-study' },
  ],

  status: 'active',
  scope: 'catalogue',
}

// ─── Component function taxonomy ────────────────────────────────────────
// Single source of truth mapping every content display type (screen types
// and block types) to its pedagogical functions and interaction class.
// Consumed by: docs/components/COMPONENT_REGISTRY.md (human view),
// docs/system/CONTENT_BUILD_TEMPLATE.md (beat pattern references
// functions, not components), the content-create / content-review skills
// (component selection + audit), and
// tests/architecture/content-quality.test.js (quality floor).
//
// interaction: 'passive'  — learner only reads or taps Continue
//              'reveal'   — learner taps/pans to progress, gives no answer
//              'assessed' — learner answers or decides; can be right/wrong

export const FUNCTION_TAGS = [
  'hook-tension',
  'introduce-figure',
  'teach-mechanism',
  'teach-comparison',
  'apply',
  'classify',
  'sequence-process',
  'retrieve',
  'exam-technique',
]

export const SCREEN_TYPE_FUNCTIONS = {
  // Passive display blocks
  read: { functions: ['teach-mechanism'], interaction: 'passive' },
  keypoint: { functions: ['teach-mechanism'], interaction: 'passive' },
  funfact: { functions: ['hook-tension'], interaction: 'passive' },
  examtip: { functions: ['exam-technique'], interaction: 'passive' },
  cinematic: { functions: ['hook-tension'], interaction: 'passive' },
  examinerExplains: { functions: ['exam-technique'], interaction: 'passive' },
  visualNarrative: { functions: ['hook-tension', 'teach-mechanism'], interaction: 'passive' },

  // Reveal interactions — active but unassessed
  conceptReveal: { functions: ['teach-mechanism'], interaction: 'reveal' },
  visualLearning: { functions: ['hook-tension', 'teach-mechanism'], interaction: 'reveal' },
  explainReveal: { functions: ['teach-mechanism'], interaction: 'reveal' },
  keyFigureReveal: { functions: ['introduce-figure'], interaction: 'reveal' },
  theoryCompare: { functions: ['teach-comparison'], interaction: 'reveal' },
  timelineCanvas: { functions: ['sequence-process'], interaction: 'reveal' },
  progressionTimeline: { functions: ['sequence-process'], interaction: 'reveal' },
  beforeAfterSlider: { functions: ['teach-comparison'], interaction: 'reveal' },
  collectionExplorer: { functions: ['teach-mechanism'], interaction: 'reveal' },
  flashcards: { functions: ['retrieve'], interaction: 'reveal' },

  // Assessed interactions
  quiz: { functions: ['retrieve'], interaction: 'assessed' },
  choice: { functions: ['retrieve'], interaction: 'assessed' },
  truefalse: { functions: ['retrieve'], interaction: 'assessed' },
  connection: { functions: ['retrieve'], interaction: 'assessed' },
  fillblanks: { functions: ['retrieve'], interaction: 'assessed' },
  tieredquiz: { functions: ['retrieve'], interaction: 'assessed' },
  quickRecall: { functions: ['retrieve'], interaction: 'assessed' },
  priorKnowledgeRecall: { functions: ['retrieve'], interaction: 'assessed' },
  boss: { functions: ['retrieve', 'apply'], interaction: 'assessed' },
  colsort: { functions: ['classify'], interaction: 'assessed' },
  naturalSupernaturalSwipe: { functions: ['classify'], interaction: 'assessed' },
  matchingTask: { functions: ['classify'], interaction: 'assessed' },
  misconceptionCheck: { functions: ['retrieve', 'exam-technique'], interaction: 'assessed' },
  theoryLab: { functions: ['apply'], interaction: 'assessed' },
  medicalTheoryPrescription: { functions: ['apply'], interaction: 'assessed' },
  appliedscenario: { functions: ['apply'], interaction: 'assessed' },
  guidedChoiceCarousel: { functions: ['apply'], interaction: 'assessed' },
  interactiveImage: { functions: ['teach-mechanism', 'apply'], interaction: 'assessed' },
  evacuationChainRoute: { functions: ['sequence-process'], interaction: 'assessed' },
  timelinedrag: { functions: ['sequence-process'], interaction: 'assessed' },
  factorWeb: { functions: ['teach-comparison', 'apply'], interaction: 'assessed' },
  connectionMap: { functions: ['teach-comparison', 'apply'], interaction: 'assessed' },
  faceExaminer: { functions: ['exam-technique'], interaction: 'assessed' },
  guidedExamResponse: { functions: ['exam-technique'], interaction: 'assessed' },
  examscored: { functions: ['exam-technique'], interaction: 'assessed' },
  spotTheError: { functions: ['exam-technique', 'apply'], interaction: 'assessed' },
}

export function getTypeInfo(type) {
  return SCREEN_TYPE_FUNCTIONS[type] ?? null
}

export function isPassive(type) {
  return getTypeInfo(type)?.interaction === 'passive'
}

export function isAssessed(type) {
  return getTypeInfo(type)?.interaction === 'assessed'
}

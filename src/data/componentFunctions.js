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

  // Pattern components (docs/system/PATTERN_GOVERNANCE.md)
  keyPoint: { functions: ['teach-mechanism'], interaction: 'passive' },
  workedExample: { functions: ['teach-mechanism', 'apply'], interaction: 'passive' },
  mediaPlaceholder: { functions: ['teach-mechanism'], interaction: 'passive' },
  // Infographic: TeachScreenShell heading + intro then one governed infographic
  // media slot (a reserved diagram or an auto-building quadrant reveal).
  infographic: { functions: ['teach-mechanism'], interaction: 'passive' },

  // Reveal interactions — active but unassessed
  conceptReveal: { functions: ['teach-mechanism'], interaction: 'reveal' },
  visualLearning: { functions: ['hook-tension', 'teach-mechanism'], interaction: 'reveal' },
  explainReveal: { functions: ['teach-mechanism'], interaction: 'reveal' },
  // Major historical figures should enter through a short full-screen cinematic
  // reveal before the detailed profile, so the learner meets the person before
  // reading their evidence cards. Keep the intro to one name line + one impact line.
  keyFigureReveal: { functions: ['introduce-figure'], interaction: 'reveal' },
  // Two governed modes share this one taxonomy entry: the default simple
  // old→new comparison and the `variant: 'people'` person-to-person comparison
  // (see docs/components/COMPONENT_REGISTRY.md). Both teach a comparison through
  // progressive reveal — same function, same interaction class, one entry.
  theoryCompare: { functions: ['teach-comparison'], interaction: 'reveal' },
  oppositeQualitiesReveal: { functions: ['teach-comparison'], interaction: 'reveal' },
  timelineCanvas: { functions: ['sequence-process'], interaction: 'reveal' },
  timelineChain: { functions: ['sequence-process'], interaction: 'reveal' },
  beforeAfterSlider: { functions: ['teach-comparison'], interaction: 'reveal' },
  collectionExplorer: { functions: ['teach-mechanism'], interaction: 'reveal' },
  flashcards: { functions: ['retrieve'], interaction: 'reveal' },
  // RevealBlock: tap a prompt card to reveal its answer — no scoring
  reveal: { functions: ['teach-mechanism'], interaction: 'reveal' },
  // MisconceptionBlock: tap a wrong statement to reveal why it's wrong — no scoring
  misconception: { functions: ['exam-technique'], interaction: 'reveal' },
  // AcronymMemorise: expand/collapse mnemonic items (e.g. SCARF for uses of glucose)
  acronymMemorise: { functions: ['teach-mechanism'], interaction: 'reveal' },
  // QuoteAnalyser: tap through 5 analysis cards on a quote — no scoring
  quoteAnalyser: { functions: ['teach-mechanism'], interaction: 'reveal' },

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
  centreImageReveal: { functions: ['apply'], interaction: 'assessed' },
  appliedscenario: { functions: ['apply'], interaction: 'assessed' },
  guidedChoiceCarousel: { functions: ['apply'], interaction: 'assessed' },
  interactiveImage: { functions: ['teach-mechanism', 'apply'], interaction: 'assessed' },
  orderedRouteTask: { functions: ['sequence-process'], interaction: 'assessed' },
  timelinedrag: { functions: ['sequence-process'], interaction: 'assessed' },
  factorWeb: { functions: ['teach-comparison', 'apply'], interaction: 'assessed' },
  faceExaminer: { functions: ['exam-technique'], interaction: 'assessed' },
  guidedExamResponse: { functions: ['exam-technique'], interaction: 'assessed' },
  examscored: { functions: ['exam-technique'], interaction: 'assessed' },
  spotTheError: { functions: ['exam-technique', 'apply'], interaction: 'assessed' },
  // BuilderBlock: assemble pieces into slots, checked against an answer
  builder: { functions: ['apply'], interaction: 'assessed' },
  // ScenarioBlock: multiple-choice decision game, scored per scenario
  scenario: { functions: ['apply'], interaction: 'assessed' },
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

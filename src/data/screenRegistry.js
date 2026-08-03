// Governed chapter screen registry.
//
// This is the authoring/runtime contract for chapter screen and nested block
// types. Component rendering lives in ScreenRenderer.jsx, while this file stays
// pure so chapter content can be validated in architecture tests and scripts.

const COMPONENT_REGISTRY = 'docs/components/COMPONENT_REGISTRY.md'

function entry({
  authoringName,
  component,
  level,
  layout = 'content',
  status = 'active',
  replacement = null,
  contract = COMPONENT_REGISTRY,
  required = [],
  requiredAny = [],
  continuation = 'player',
  headerMode = 'standard',
}) {
  return Object.freeze({
    authoringName,
    component,
    level,
    layout,
    status,
    replacement,
    contract,
    required,
    requiredAny,
    continuation,
    headerMode,
  })
}

const screen = (authoringName, component, options = {}) => entry({
  authoringName,
  component,
  level: 'screen',
  ...options,
})

const block = (authoringName, component, options = {}) => entry({
  authoringName,
  component,
  level: 'block',
  ...options,
})

export const SCREEN_REGISTRY = Object.freeze({
  standard: screen('Standard content screen', 'ScreenContentRenderer', {
    required: [{ path: 'blocks', kind: 'array' }],
  }),
  infographic: screen('Infographic', 'Infographic', {
    required: [{ path: 'media', kind: 'object' }],
  }),
  quickRecall: screen('Quick recall', 'QuickRecallScreen', {
    layout: 'full',
    continuation: 'component',
    required: [{ path: 'questions', kind: 'array' }],
  }),
  tieredquiz: screen('Tiered quiz', 'TieredQuizScreen', {
    layout: 'full',
    continuation: 'component',
    required: [{ path: 'tiers', kind: 'array' }],
  }),
  faceExaminer: screen('Face the examiner', 'FaceTheExaminer', {
    layout: 'full',
    continuation: 'component',
    required: [{ path: 'examiner', kind: 'object' }],
  }),
  guidedExamResponse: screen('Guided exam response', 'GuidedExamResponse', {
    layout: 'full',
    continuation: 'component',
    required: [{ path: 'exam', kind: 'object' }],
  }),
  naturalSupernaturalSwipe: screen('Natural or supernatural swipe sort', 'SwipeSort', {
    layout: 'full',
    continuation: 'component',
  }),
  orderedRouteTask: screen('Ordered route task', 'OrderedRouteTask', {
    layout: 'full',
    continuation: 'component',
    requiredAny: [[
      { path: 'items', kind: 'array' },
      { path: 'steps', kind: 'array' },
      { path: 'cards', kind: 'array' },
      { path: 'stages', kind: 'array' },
    ]],
  }),
  matchingTask: screen('Matching task', 'MatchingTask', {
    layout: 'full',
    continuation: 'component',
    requiredAny: [[
      { path: 'items', kind: 'array' },
      { path: 'pairs', kind: 'array' },
      { path: 'cards', kind: 'array' },
    ]],
  }),
  visualLearning: screen('Visual learning sequence', 'VisualLearning', {
    layout: 'full',
    continuation: 'component',
    requiredAny: [[
      { path: 'scenes', kind: 'array' },
      { path: 'steps', kind: 'array' },
      { path: 'items', kind: 'array' },
    ]],
  }),
  keyFigureReveal: screen('Key figure reveal', 'KeyFigureReveal', {
    layout: 'full',
    continuation: 'component',
  }),
  guidedChoiceCarousel: screen('Guided choice carousel', 'GuidedChoiceCarousel', {
    layout: 'full',
    continuation: 'component',
    required: [{ path: 'options', kind: 'array' }],
  }),
  interactiveImage: screen('Interactive hotspot image', 'InteractiveHotspotImage', {
    layout: 'full',
    continuation: 'component',
    required: [
      { path: 'image', kind: 'string' },
      { path: 'hotspots', kind: 'array' },
    ],
  }),
  centreImageReveal: screen('Centre image reveal', 'CentreImageReveal', {
    layout: 'full',
    continuation: 'component',
  }),
  timelineChain: screen('Timeline chain', 'TimelineChain', {
    layout: 'full',
    continuation: 'component',
    requiredAny: [[
      { path: 'events', kind: 'array' },
      { path: 'steps', kind: 'array' },
      { path: 'items', kind: 'array' },
    ]],
  }),
  timelineCanvas: screen('Timeline canvas', 'TimelineCanvas', {
    layout: 'full',
    continuation: 'component',
    requiredAny: [[
      { path: 'events', kind: 'array' },
      { path: 'items', kind: 'array' },
      { path: 'steps', kind: 'array' },
    ]],
  }),
  cinematicCarousel: screen('Cinematic carousel', 'CinematicCarousel', {
    layout: 'full',
    continuation: 'component',
    required: [{ path: 'items', kind: 'array' }],
  }),
  oppositeQualitiesReveal: screen('Opposite qualities reveal', 'OppositeQualitiesReveal', {
    layout: 'full',
  }),
  examinerExplains: screen('What examiners look for', 'ExaminerExplainsScreen', {
    layout: 'full',
    continuation: 'component',
  }),
  priorKnowledgeRecall: screen('Prior knowledge recall', 'PriorKnowledgeRecall', {
    layout: 'full',
    continuation: 'component',
  }),
  conceptReveal: screen('Concept reveal', 'ConceptReveal', {
    layout: 'full',
    continuation: 'component',
    required: [{ path: 'steps', kind: 'array' }],
  }),
  beforeAfterSlider: screen('Before and after image slider', 'BeforeAfterImageSlider', {
    layout: 'full',
    continuation: 'component',
    required: [
      { path: 'beforeSrc', kind: 'string' },
      { path: 'afterSrc', kind: 'string' },
    ],
  }),
  cinematic: screen('Cinematic reveal moment', 'CinematicRevealMoment', {
    layout: 'full',
    continuation: 'component',
    headerMode: 'cinematic',
    requiredAny: [[
      { path: 'videoSrc', kind: 'string' },
      { path: 'fallbackImage', kind: 'string' },
    ]],
  }),
  factorWeb: screen('Factor web', 'FactorWeb', {
    layout: 'full',
    continuation: 'component',
  }),
  quoteAnalyser: screen('Quote analyser', 'QuoteAnalyser', {
    layout: 'full',
    continuation: 'component',
  }),
  misconceptionCheck: screen('Misconception check screen', 'MisconceptionCheck', {
    layout: 'full',
    status: 'derived',
    continuation: 'component',
  }),
})

export const BLOCK_REGISTRY = Object.freeze({
  read: block('Read block', 'ReadBlock', { required: [{ path: 'text', kind: 'string' }] }),
  keypoint: block('Key point', 'KeypointBlock', {
    requiredAny: [[
      { path: 'text', kind: 'string' },
      { path: 'points', kind: 'array' },
    ]],
  }),
  funfact: block('Fun fact', 'FunFactBlock', { required: [{ path: 'text', kind: 'string' }] }),
  examtip: block('Exam tip', 'ExamTipBlock', {
    requiredAny: [[
      { path: 'text', kind: 'string' },
      { path: 'tip', kind: 'string' },
    ]],
  }),
  timeline: block('Timeline block', 'TimelineBlock', { required: [{ path: 'events', kind: 'array' }] }),
  reveal: block('Reveal block', 'RevealBlock', {
    required: [
      { path: 'prompt', kind: 'string' },
      { path: 'answer', kind: 'string' },
    ],
  }),
  quiz: block('Quiz', 'AnswerInteraction', {
    required: [
      { path: 'question', kind: 'string' },
      { path: 'options', kind: 'array' },
    ],
  }),
  flashcards: block('Flashcards', 'FlashcardsBlock', { required: [{ path: 'cards', kind: 'array' }] }),
  hotspot: block('Hotspot block', 'HotspotBlock'),
  misconception: block('Misconception reveal', 'MisconceptionBlock', { required: [{ path: 'mistakes', kind: 'array' }] }),
  acronymMemorise: block('Acronym memorise', 'AcronymMemorise'),
  memoryHook: block('Memory hook', 'MemoryHook'),
  builder: block('Builder block', 'BuilderBlock', {
    continuation: 'component',
    requiredAny: [[
      { path: 'pieces', kind: 'array' },
      { path: 'options', kind: 'array' },
      { path: 'items', kind: 'array' },
    ]],
  }),
  scenario: block('Scenario block', 'ScenarioBlock', {
    requiredAny: [[
      { path: 'scenarios', kind: 'array' },
      { path: 'situation', kind: 'string' },
    ]],
  }),
  boss: block('Exam question frame', 'ExamQuestionFrame', {
    required: [{ path: 'question', kind: 'string' }],
    requiredAny: [[
      { path: 'markPoints', kind: 'string' },
      { path: 'markPoints', kind: 'array' },
      { path: 'ms', kind: 'string' },
      { path: 'ms', kind: 'array' },
      { path: 'markScheme', kind: 'string' },
      { path: 'markScheme', kind: 'array' },
    ]],
  }),
  explainReveal: block('Explain reveal', 'ExplainReveal'),
  mediaPlaceholder: block('Media placeholder', 'MediaPlaceholder', { required: [{ path: 'kind', kind: 'string' }] }),
  fillblanks: block('Fill in the blanks', 'FillInTheBlanksBlock', { required: [{ path: 'sentences', kind: 'array' }] }),
  theoryCompare: block('Theory compare', 'TheoryCompare'),
  oppositeQualitiesReveal: block('Opposite qualities reveal', 'OppositeQualitiesReveal'),
  graphView: block('Graph view', 'GraphView'),
  timelineChain: block('Timeline chain block', 'TimelineChainBlock'),
  colsort: block('Column sort', 'ColSortBlock', {
    required: [
      { path: 'columns', kind: 'array' },
      { path: 'items', kind: 'array' },
    ],
  }),
  spotTheError: block('Spot the error', 'SpotTheError', { continuation: 'component' }),
  misconceptionCheck: block('Misconception check', 'MisconceptionCheck', { continuation: 'component' }),

  // Existing extracted chapters contain these names, but ChapterPlayer never
  // routed them. They stay registered so the migration is explicit and CI can
  // prevent growth; new content must use the named replacement instead.
  appliedscenario: block('Applied scenario (legacy)', 'LegacyUnroutedBlock', {
    status: 'legacy',
    replacement: 'scenario',
    required: [{ path: 'scenarios', kind: 'array' }],
  }),
  examscored: block('Exam scored response (legacy)', 'LegacyUnroutedBlock', {
    status: 'legacy',
    replacement: 'boss',
    required: [
      { path: 'question', kind: 'string' },
      { path: 'markScheme', kind: 'array' },
    ],
  }),
  tieredquiz: block('Tiered quiz block (legacy)', 'LegacyUnroutedBlock', {
    status: 'legacy',
    replacement: 'quickRecall',
    required: [{ path: 'tiers', kind: 'array' }],
  }),
  timelinedrag: block('Timeline drag (legacy)', 'LegacyUnroutedBlock', {
    status: 'legacy',
    replacement: 'orderedRouteTask',
    required: [
      { path: 'people', kind: 'array' },
      { path: 'items', kind: 'array' },
    ],
  }),
})

export const LEGACY_BLOCK_TYPES = Object.freeze(
  Object.fromEntries(Object.entries(BLOCK_REGISTRY)
    .filter(([, definition]) => definition.status === 'legacy')
    .map(([type, definition]) => [type, definition.replacement])),
)

export function getScreenType(screenDefinition) {
  return screenDefinition?.type || 'standard'
}

export function getScreenDefinition(screenDefinition) {
  return SCREEN_REGISTRY[getScreenType(screenDefinition)] ?? null
}

export function getBlockDefinition(type) {
  return BLOCK_REGISTRY[type] ?? null
}

export function resolveScreenDefinition(screenDefinition) {
  const misconceptionBlock = (screenDefinition?.blocks || [])
    .find(blockDefinition => blockDefinition?.type === 'misconceptionCheck')
  if (misconceptionBlock) return SCREEN_REGISTRY.misconceptionCheck
  return getScreenDefinition(screenDefinition)
}

export function screenHasComponentOwnedContinuation(screenDefinition) {
  const route = resolveScreenDefinition(screenDefinition)
  if (route?.continuation === 'component') return true
  return (screenDefinition?.blocks || []).some(blockDefinition =>
    getBlockDefinition(blockDefinition?.type)?.continuation === 'component',
  )
}

export function isCinematicHeaderScreen(screenDefinition) {
  return getScreenDefinition(screenDefinition)?.headerMode === 'cinematic'
}

export function findScreenIndexByType(screens, type) {
  return (screens || []).findIndex(screenDefinition => getScreenType(screenDefinition) === type)
}

function valueAtPath(value, path) {
  return path.split('.').reduce((current, key) => current?.[key], value)
}

function matchesKind(value, kind) {
  if (kind === 'array') return Array.isArray(value) && value.length > 0
  if (kind === 'object') return typeof value === 'object' && value !== null && !Array.isArray(value)
  if (kind === 'string') return typeof value === 'string' && value.trim().length > 0
  if (kind === 'number') return typeof value === 'number' && Number.isFinite(value)
  return value !== undefined && value !== null
}

function describeRequirement(requirement) {
  return `${requirement.path} (${requirement.kind || 'value'})`
}

function validateRequirements(value, definition, location, errors) {
  for (const requirement of definition.required || []) {
    if (!matchesKind(valueAtPath(value, requirement.path), requirement.kind)) {
      errors.push({
        code: 'REQUIRED_FIELD',
        location,
        message: `${location} requires ${describeRequirement(requirement)} for ${definition.authoringName}.`,
      })
    }
  }

  for (const alternatives of definition.requiredAny || []) {
    const satisfied = alternatives.some(requirement =>
      matchesKind(valueAtPath(value, requirement.path), requirement.kind),
    )
    if (!satisfied) {
      errors.push({
        code: 'REQUIRED_FIELD_ALTERNATIVE',
        location,
        message: `${location} requires one of: ${alternatives.map(describeRequirement).join(', ')} for ${definition.authoringName}.`,
      })
    }
  }
}

export function validateChapterDefinition(chapter) {
  const errors = []
  const warnings = []

  if (typeof chapter !== 'object' || chapter === null || Array.isArray(chapter)) {
    return {
      valid: false,
      errors: [{ code: 'CHAPTER_OBJECT', location: 'chapter', message: 'Chapter content must be an object.' }],
      warnings,
    }
  }

  if (typeof chapter.id !== 'string' || chapter.id.trim() === '') {
    errors.push({ code: 'CHAPTER_ID', location: 'chapter.id', message: 'Chapter content requires a stable string id.' })
  }
  if (!Array.isArray(chapter.screens)) {
    errors.push({ code: 'CHAPTER_SCREENS', location: 'chapter.screens', message: 'Chapter content requires a screens array.' })
    return { valid: false, errors, warnings }
  }

  chapter.screens.forEach((screenDefinition, screenIndex) => {
    const screenLocation = `chapter:${chapter.id || '<unknown>'}:screen:${screenIndex}`
    if (typeof screenDefinition !== 'object' || screenDefinition === null || Array.isArray(screenDefinition)) {
      errors.push({ code: 'SCREEN_OBJECT', location: screenLocation, message: `${screenLocation} must be an object.` })
      return
    }

    const type = getScreenType(screenDefinition)
    const definition = SCREEN_REGISTRY[type]
    if (!definition) {
      errors.push({
        code: 'UNREGISTERED_SCREEN_TYPE',
        location: screenLocation,
        message: `${screenLocation} uses unregistered screen type "${type}". Add it to src/data/screenRegistry.js before authoring it.`,
      })
    } else {
      validateRequirements(screenDefinition, definition, screenLocation, errors)
      if (definition.status === 'legacy') {
        warnings.push({
          code: 'LEGACY_SCREEN_TYPE',
          location: screenLocation,
          message: `${screenLocation} uses legacy screen type "${type}"; author "${definition.replacement}" instead.`,
        })
      }
    }

    if (screenDefinition.blocks !== undefined && !Array.isArray(screenDefinition.blocks)) {
      errors.push({ code: 'BLOCKS_ARRAY', location: `${screenLocation}.blocks`, message: `${screenLocation}.blocks must be an array.` })
      return
    }

    ;(screenDefinition.blocks || []).forEach((blockDefinition, blockIndex) => {
      const blockLocation = `${screenLocation}:block:${blockIndex}`
      if (typeof blockDefinition !== 'object' || blockDefinition === null || Array.isArray(blockDefinition)) {
        errors.push({ code: 'BLOCK_OBJECT', location: blockLocation, message: `${blockLocation} must be an object.` })
        return
      }
      const blockType = blockDefinition.type
      const blockContract = BLOCK_REGISTRY[blockType]
      if (!blockContract) {
        errors.push({
          code: 'UNREGISTERED_BLOCK_TYPE',
          location: blockLocation,
          message: `${blockLocation} uses unregistered block type "${blockType || '<missing>'}". Add it to src/data/screenRegistry.js before authoring it.`,
        })
        return
      }
      validateRequirements(blockDefinition, blockContract, blockLocation, errors)
      if (blockContract.status === 'legacy') {
        warnings.push({
          code: 'LEGACY_BLOCK_TYPE',
          location: blockLocation,
          message: `${blockLocation} uses legacy block type "${blockType}"; author "${blockContract.replacement}" instead.`,
        })
      }
    })
  })

  return { valid: errors.length === 0, errors, warnings }
}

export function formatChapterSchemaIssues(issues) {
  return (issues || []).map(issue => `${issue.code} ${issue.location}: ${issue.message}`).join('\n')
}

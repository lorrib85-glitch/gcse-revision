// ColSortBlock — component catalogue record.
//
// Build-time governance data. This record is the single home for what the
// catalogue says about ColSortBlock; `docs/components/COMPONENT_REGISTRY.md`
// is generated from it. Run `pnpm catalogue:generate` after editing.

export default {
  id: 'col-sort-block',
  name: 'ColSortBlock',
  source: 'src/components/learning/ColSortBlock.jsx',
  exportName: null,
  order: 46,
  outOfRootReason: null,
  section: 'learning',
  kind: 'reusable',
  lifecycle: 'active',
  lifecycleReason: null,
  purpose: 'Interactive categorisation task where learners sort items into labelled columns.',
  ownership: {
    internalDirectories: [],
    internalFiles: [
      {
        path: 'src/components/learning/ColSortBlockCore.jsx',
        reason: 'The implementation of ColSortBlock, split out for file size only. ColSortBlock is the documented entry point and its sole importer.'
      }
    ]
  },
  documentation: {
    bestUsedFor: 'Grouping concepts into categories (e.g. "Supernatural vs Natural causes", "Treatments vs Prevention methods"). Tap-to-select with visual feedback.',
    props: [
      'block',
      'subject',
      'onComplete'
    ],
    dataShape: null,
    dependencies: [
      'SUBJECTS',
      'MOTION'
    ],
    usedBy: [],
    usageBoundary: null,
    contractDoc: null,
    story: null,
    governanceRules: [],
    notes: []
  },
  decision: {
    status: 'complete',
    useWhen: 'The learner needs to place several short statements, examples or concepts into clearly labelled categories and benefit from seeing the completed groups together.',
    doNotUseWhen: 'The learner has not yet been taught the distinction between the categories. Do not use it for one-to-one pairs, ordered stages, developed comparisons or items that could reasonably belong in more than one category.',
    chooseInstead: 'Use SwipeSort when the activity should feel faster and each item can be judged independently without needing to study the completed groups together. Use MatchingTask for one-to-one pairs. Use OrderedRouteTask when sequence matters. Use TheoryCompare when two approaches require developed explanation rather than learner classification. Use OppositeQualitiesReveal when the contrast is being taught through guided visual grouping rather than tested.',
    contentShape: 'Two or more clearly labelled categories with several concise items. Every item must have one defensible destination. Category labels must represent meaningful conceptual groups, not arbitrary containers. Keep item wording short enough to scan and compare once placed.',
    rhythmRole: [
      'practice',
      'retrieval'
    ],
    note: null
  },
  contract: {
    criticality: 'standard',
    rationale: null,
    invariants: [],
    exclusivity: null,
    requiresProductDecision: []
  },
  authoring: {
    entries: [
      {
        type: 'colsort',
        level: 'block',
        authoringName: 'Column sort',
        layout: 'content',
        status: 'active',
        replacement: null,
        required: [
          {
            path: 'columns',
            kind: 'array'
          },
          {
            path: 'items',
            kind: 'array'
          }
        ],
        requiredAny: [],
        continuation: 'player',
        headerMode: 'standard',
        handler: null,
        pedagogy: {
          functions: [
            'classify'
          ],
          interaction: 'assessed'
        }
      }
    ]
  }
}

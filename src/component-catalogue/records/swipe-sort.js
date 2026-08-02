// SwipeSort — component catalogue record.
//
// Build-time governance data. This record is the single home for what the
// catalogue says about SwipeSort; `docs/components/COMPONENT_REGISTRY.md`
// is generated from it. Run `pnpm catalogue:generate` after editing.

export default {
  id: 'swipe-sort',
  name: 'SwipeSort',
  source: 'src/components/learning/SwipeSort.jsx',
  exportName: null,
  order: 58,
  scope: {
    location: 'components',
    reason: null
  },
  section: 'learning',
  kind: 'reusable',
  lifecycle: 'active',
  lifecycleReason: null,
  purpose: 'Swipe-gesture categorisation activity with cards dragged into zones.',
  ownership: {
    internalDirectories: [],
    internalFiles: []
  },
  documentation: {
    bestUsedFor: 'Binary or multi-way classification (e.g. "Supernatural vs Natural" causes). Mobile-friendly drag interaction for fast-paced categorisation tasks.',
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
    useWhen: 'The learner needs a quick, energetic classification check where each short item can be judged independently and moved into one of a small number of clear categories.',
    doNotUseWhen: 'The learner needs to compare all items at once, inspect the completed groups carefully, read substantial text, build a sequence or consider nuanced overlap between categories. Do not use it merely to add movement to the chapter.',
    chooseInstead: 'Use ColSortBlock when seeing the final grouped columns supports understanding or comparison. Use MatchingTask for one-to-one pairs. Use OrderedRouteTask when order matters. Use OppositeQualitiesReveal when the categories are still being taught rather than assessed.',
    contentShape: 'A stream of short, independently understandable items with two or a small number of unambiguous destinations. Each item should be readable at a glance. Avoid long explanations, compound statements and examples that require evidence elsewhere on the screen.',
    rhythmRole: [
      'retrieval',
      'practice'
    ],
    note: null
  },
  contract: {
    criticality: 'standard',
    rationale: null,
    invariants: [],
    exclusivity: null,
    requiresProductDecision: []
  }
}

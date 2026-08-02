// MatchingTask — component catalogue record.
//
// Build-time governance data. This record is the single home for what the
// catalogue says about MatchingTask; `docs/components/COMPONENT_REGISTRY.md`
// is generated from it. Run `pnpm catalogue:generate` after editing.

export default {
  id: 'matching-task',
  name: 'MatchingTask',
  source: 'src/components/learning/MatchingTask.jsx',
  exportName: null,
  order: 51,
  outOfRootReason: null,
  section: 'learning',
  kind: 'reusable',
  lifecycle: 'active',
  lifecycleReason: null,
  purpose: 'Card-pair matching activity with visual connector lines.',
  ownership: {
    internalDirectories: [],
    internalFiles: []
  },
  documentation: {
    bestUsedFor: 'Linking terms to definitions, concepts to examples, or causes to effects (e.g. "Medieval beliefs" ↔ "Treatments"). Splits large sets into rounds. One-retry mechanism.',
    props: [
      'screen',
      'subject',
      'onComplete'
    ],
    dataShape: '{ pairs: [{ id, term, answer, weakGroup }], backgroundImage }',
    dependencies: [
      'MOTION',
      'unifiedWeaknessTracker'
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
    useWhen: 'The learner needs to connect each item with one corresponding partner, such as a term with its definition, a cause with its consequence, a person with their contribution or a quotation with its interpretation.',
    doNotUseWhen: 'Several items belong under the same category heading, the order between stages matters, an item could reasonably match more than one partner or the relationship requires developed explanation rather than a concise pairing.',
    chooseInstead: 'Use ColSortBlock when several items must be grouped beneath shared category headings. Use SwipeSort for a faster item-by-item classification check. Use OrderedRouteTask when the learner must place stages in sequence. Use TheoryCompare when two people, theories or approaches require a developed parallel comparison. Use ExplainReveal when the relationship forms a cause-and-effect reasoning chain that still needs to be taught.',
    contentShape: 'A set of clear one-to-one pairs. Each item must have one defensible partner and each partner should normally be used once. Both sides should be concise enough to scan while making meaningful connections rather than matching through superficial wording clues. Avoid oversized sets that turn the task into visual searching rather than retrieval.',
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

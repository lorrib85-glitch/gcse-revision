// ExplainReveal — component catalogue record.
//
// Build-time governance data. This record is the single home for what the
// catalogue says about ExplainReveal; `docs/components/COMPONENT_REGISTRY.md`
// is generated from it. Run `pnpm catalogue:generate` after editing.

export default {
  id: 'explain-reveal',
  name: 'ExplainReveal',
  source: 'src/components/learning/ExplainReveal.jsx',
  exportName: null,
  order: 35,
  scope: {
    location: 'components',
    reason: null
  },
  section: 'learning',
  kind: 'reusable',
  lifecycle: 'active',
  lifecycleReason: null,
  purpose: 'Progressive step-by-step reasoning chain with tap-to-reveal steps.',
  ownership: {
    internalDirectories: [],
    internalFiles: []
  },
  documentation: {
    bestUsedFor: 'Teaching cause-and-effect logic (e.g. "Wrong belief → Wrong treatment → Patient harm"). Teaches the reasoning chain, not just facts.',
    props: [
      'block',
      'subject',
      'onContinue',
      'onBack'
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
    useWhen: 'The learner needs to understand a short reasoning chain in which one idea leads directly to the next, such as belief → action → consequence or cause → mechanism → effect. Choose it when the important learning is the logic connecting the steps, not merely remembering their order.',
    doNotUseWhen: 'The content is primarily a dated chronology, a series of distinct historical events or a practical process whose stages have their own identities. Do not use it when the learner should place the steps themselves or when the ideas do not form one clear chain.',
    chooseInstead: 'Use TimelineChain when the learner needs to explore a chronological, causal or procedural sequence made up of distinct events or stages. Use OrderedRouteTask when the sequence has already been taught and the learner must place known stages correctly. Use TheoryCompare when the relationship is a comparison rather than a chain. Use ConceptReveal when only one idea needs introducing rather than several linked steps.',
    contentShape: 'A single unbroken reasoning chain, usually three to six concise steps. Each step must clearly cause, explain or lead to the next. The chain should answer one central "how?" or "why?" question. Avoid branches, unrelated facts and stages that could be rearranged without changing the meaning.',
    rhythmRole: [
      'teaching'
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

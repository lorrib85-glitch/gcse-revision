// FlashcardsBlock — component catalogue record.
//
// Build-time governance data. This record is the single home for what the
// catalogue says about FlashcardsBlock; `docs/components/COMPONENT_REGISTRY.md`
// is generated from it. Run `pnpm catalogue:generate` after editing.

export default {
  id: 'flashcards-block',
  name: 'FlashcardsBlock',
  source: 'src/components/learning/FlashcardsBlock.jsx',
  exportName: null,
  order: 81,
  outOfRootReason: null,
  section: 'learning',
  kind: 'reusable',
  lifecycle: 'active',
  lifecycleReason: null,
  purpose: 'An unscored prompt/answer reveal grid. Each card flips independently; nothing is marked and nothing is logged.',
  ownership: {
    internalDirectories: [],
    internalFiles: []
  },
  documentation: {
    bestUsedFor: null,
    props: [
      'block (default {})'
    ],
    dataShape: '{ cards: [{ id?, front, back }] }',
    dependencies: [
      'GENERAL',
      'TYPE'
    ],
    usedBy: [],
    usageBoundary: 'Self-testing only. Because it is unscored it does not feed the weak-area system — do not use it where the interaction needs to produce evidence.',
    contractDoc: null,
    story: null,
    governanceRules: [],
    notes: [
      'Extracted from ChapterPlayer so the existing runtime pattern could be reviewed in the Component Lab without maintaining a second implementation.'
    ]
  },
  decision: {
    status: 'pending',
    useWhen: null,
    doNotUseWhen: null,
    chooseInstead: null,
    contentShape: null,
    rhythmRole: [],
    note: 'Pending product review — its relationship to AcronymMemorise, MemoryHook and the scored retrieval components is a product judgement, and the memory and self-testing family rule does not yet cover it.'
  },
  contract: {
    criticality: 'standard',
    rationale: null,
    invariants: [],
    exclusivity: null,
    requiresProductDecision: []
  }
}

// MemoryHook — component catalogue record.
//
// Build-time governance data. This record is the single home for what the
// catalogue says about MemoryHook; `docs/components/COMPONENT_REGISTRY.md`
// is generated from it. Run `pnpm catalogue:generate` after editing.

export default {
  id: 'memory-hook',
  name: 'MemoryHook',
  source: 'src/components/learning/MemoryHook.jsx',
  exportName: null,
  order: 54,
  scope: {
    location: 'components',
    reason: null
  },
  section: 'learning',
  kind: 'reusable',
  lifecycle: 'active',
  lifecycleReason: null,
  purpose: 'A compact, passive memory aid embedded inside a normal teaching screen. It connects one difficult idea to one memorable analogy, mental image, word pattern or mnemonic so the learner has an easier way to retrieve it later. It does not own a full screen, ask a question or record progress.',
  ownership: {
    internalDirectories: [],
    internalFiles: []
  },
  documentation: {
    bestUsedFor: 'Giving the learner one memorable handle on an idea that is conceptually important but easy to confuse or forget.',
    props: [
      'block',
      'subject'
    ],
    dataShape: "{ type: 'memoryHook', label?, hook, image?, imageAlt? }",
    dependencies: [
      'SUBJECTS',
      'GENERAL',
      'SPACING',
      'COMPONENT_SIZE',
      'RADII',
      'TYPE'
    ],
    usedBy: [],
    usageBoundary: null,
    contractDoc: 'docs/system/component-contracts/memory-hook.md',
    story: 'src/components/learning/MemoryHook.stories.jsx',
    governanceRules: [
      'Use no more than one MemoryHook on a screen. A second hook competes with the first and makes neither memorable.',
      'MemoryHook is deliberately passive: it has no editing, persistence, reveal, assessment or progress behaviour.'
    ],
    notes: [
      'Memory and self-testing family rule — choose according to the structure of the memory aid: one difficult idea anchored by an analogy or association → MemoryHook; one related set encoded through initial letters → AcronymMemorise; objectively marked recall → QuickRecallScreen; one-to-one relationships the learner must connect → MatchingTask. Memory aids must reduce cognitive load; do not force every topic into a mnemonic merely to create variety. The normal maximum of two uses of the same component per chapter still applies.'
    ]
  },
  decision: {
    status: 'complete',
    useWhen: 'One already-explained idea would be easier to remember through a concise analogy, mental image, word association or mnemonic. Choose it beside or immediately after the teaching it reinforces, when the learner should leave holding one memorable connection.',
    doNotUseWhen: 'The text is merely important, needs visual emphasis or summarises the preceding screen. Do not use it as a generic callout box, key point, definition card or decorative aside. Do not use it to teach several facts, drill an acronym or assess whether the learner can remember the idea.',
    chooseInstead: 'Use AcronymMemorise when several items are deliberately encoded through their initial letters and should be explored and self-tested. Use a key-point treatment for an essential conclusion that does not need a mnemonic. Use Infographic when a visual system or relationship must be understood together. Use QuickRecallScreen when the learner should actively retrieve and submit an answer.',
    contentShape: 'Exactly one memorable hook, normally one or two concise sentences. The connection must be accurate, easy to picture and genuinely useful for retrieval. An optional square image may be supplied only when it strengthens the same memory connection. Avoid generic summaries, forced humour, multiple competing comparisons and images that are merely decorative.',
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

// TimelineChainBlock — component catalogue record.
//
// Build-time governance data. This record is the single home for what the
// catalogue says about TimelineChainBlock; `docs/components/COMPONENT_REGISTRY.md`
// is generated from it. Run `pnpm catalogue:generate` after editing.

export default {
  id: 'timeline-chain-block',
  name: 'TimelineChainBlock',
  source: 'src/components/learning/TimelineChain.jsx',
  exportName: 'TimelineChainBlock',
  order: 63,
  outOfRootReason: null,
  section: 'learning',
  kind: 'reusable',
  lifecycle: 'active',
  lifecycleReason: null,
  purpose: 'Embedded variant of TimelineChain — the same flip-card chain with connector rail, scaled down to sit inline within a normal content screen instead of taking over the full screen. No completion gating; the screen’s own Continue controls progression.',
  ownership: {
    internalDirectories: [],
    internalFiles: []
  },
  documentation: {
    bestUsedFor: 'Slotting a short causal or sequence chain (two to five steps) into an existing content screen alongside its heading and intro — e.g. recapping a transmission chain just explained elsewhere. Each card front can show a placeholder or illustrative image with an overlaid step number, plus a short label; tapping flips to reveal the "why it mattered" detail. An optional outro paragraph (e.g. a reflection prompt) renders below the chain.',
    props: [
      'block',
      'subject (defaults to History)'
    ],
    dataShape: "{ type: 'timelineChain', intro?, steps: [{ id?, icon?, image?, label, detail }], outro? }",
    dependencies: [
      'SUBJECTS',
      'SPACING',
      'MOTION',
      'RADII'
    ],
    usedBy: [],
    usageBoundary: 'A named export alongside TimelineChain, not a separate file. Choose it when the chain belongs inside a composed content screen rather than owning the screen.',
    contractDoc: null,
    story: null,
    governanceRules: [],
    notes: []
  },
  decision: {
    status: 'pending',
    useWhen: null,
    doNotUseWhen: null,
    chooseInstead: null,
    contentShape: null,
    rhythmRole: [],
    note: 'The registry entry has never carried a five-field Decision block; it inherits TimelineChain’s selection guidance and differs only in placement. A separate five-field block would require a product judgement current source and stories do not settle.'
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
        type: 'timelineChain',
        level: 'block',
        authoringName: 'Timeline chain block',
        layout: 'content',
        status: 'active',
        replacement: null,
        required: [],
        requiredAny: [],
        continuation: 'player',
        headerMode: 'standard',
        handler: null,
        pedagogy: {
          functions: [
            'sequence-process'
          ],
          interaction: 'reveal'
        }
      }
    ]
  }
}

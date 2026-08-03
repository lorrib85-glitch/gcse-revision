// TimelineCanvas — component catalogue record.
//
// Build-time governance data. This record is the single home for what the
// catalogue says about TimelineCanvas; `docs/components/COMPONENT_REGISTRY.md`
// is generated from it. Run `pnpm catalogue:generate` after editing.

export default {
  id: 'timeline-canvas',
  name: 'TimelineCanvas',
  source: 'src/components/learning/TimelineCanvas.jsx',
  exportName: null,
  order: 61,
  outOfRootReason: null,
  section: 'learning',
  kind: 'reusable',
  lifecycle: 'active',
  lifecycleReason: null,
  purpose: 'Full-screen "swipe to pan" canvas — a natively horizontally-scrollable wide canvas of step cards connected by curved SVG paths and connector dots; the user pans with a 1:1 finger swipe. Each connector line draws itself in (and its dot lights up) as the pan position passes over it. A bouncing "Swipe to explore →" hint fades once panning begins. Tapping a card’s "+" opens a "Why it mattered" detail panel below the canvas (gated continue, like TimelineChain).',
  ownership: {
    internalDirectories: [],
    internalFiles: []
  },
  documentation: {
    bestUsedFor: 'A deliberately different rhythm to TimelineChain — an occasional interruption to vary pacing between chapter moments, reusing the same kind of causal-chain content. Not for routine use; the spring/bounce motion is an intentional one-off exception to the Motion Rules (documented in-file).',
    props: [
      'block',
      'subject (defaults to History)',
      'onContinue'
    ],
    dataShape: "{ type: 'timelineCanvas', title?, intro?, steps: [{ id?, icon?, image?, label, detail, stats?: [string, string] }] }",
    dependencies: [
      'SUBJECTS',
      'SPACING',
      'MOTION',
      'RADII'
    ],
    usedBy: [],
    usageBoundary: null,
    contractDoc: null,
    story: 'src/components/learning/TimelineCanvas.stories.jsx',
    governanceRules: [],
    notes: [
      'Architecture guarded by tests/architecture/timeline-canvas.architecture.test.js.'
    ]
  },
  decision: {
    status: 'complete',
    useWhen: 'A particularly important sequence benefits from a wide spatial journey that the learner actively pans through, and the chapter needs an occasional change of pace from the standard screen rhythm.',
    doNotUseWhen: 'A normal TimelineChain would communicate the sequence just as clearly. Do not use it for routine sequences, very short chains, dense explanations or simply to make the chapter feel more visually varied. It should remain an occasional high-impact interaction rather than the default timeline.',
    chooseInstead: 'Use TimelineChain for most chronological, causal and procedural sequences. Use ExplainReveal when the focus is a compact reasoning chain rather than distinct events or stages. Use OrderedRouteTask when the learner should demonstrate that they know the correct order.',
    contentShape: 'A visually distinct sequence, usually four to seven stages, that benefits from being experienced as a journey across a wider canvas. Each stage needs a short label, a concise explanation and a meaningful place in the overall progression. Avoid long paragraphs, minor facts and stages that are not visually or conceptually distinct.',
    rhythmRole: [
      'exploration'
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
        type: 'timelineCanvas',
        level: 'screen',
        authoringName: 'Timeline canvas',
        layout: 'full',
        status: 'active',
        replacement: null,
        required: [],
        requiredAny: [
          [
            {
              path: 'events',
              kind: 'array'
            },
            {
              path: 'items',
              kind: 'array'
            },
            {
              path: 'steps',
              kind: 'array'
            }
          ]
        ],
        continuation: 'component',
        headerMode: 'standard',
        handler: null
      }
    ]
  }
}

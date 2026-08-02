// FactorWeb — component catalogue record.
//
// Build-time governance data. This record is the single home for what the
// catalogue says about FactorWeb; `docs/components/COMPONENT_REGISTRY.md`
// is generated from it. Run `pnpm catalogue:generate` after editing.

export default {
  id: 'factor-web',
  name: 'FactorWeb',
  source: 'src/components/learning/FactorWeb.jsx',
  exportName: null,
  order: 23,
  section: 'learning',
  kind: 'reusable',
  lifecycle: 'active',
  lifecycleReason: null,
  purpose: 'Mobile-first factor exploration and judgement component. It places four to six concise factors in balanced left/right columns around one chapter-owned centre image or governed placeholder, then unlocks a supported relative-importance judgement after all factors are explored.',
  ownership: {
    internalDirectories: [],
    internalFiles: []
  },
  documentation: {
    bestUsedFor: 'Causal or thematic GCSE History questions where learners must explain several plausible factors and judge which mattered most.',
    props: [],
    dataShape: null,
    dependencies: [
      'InteractionShell',
      'ScreenTitle',
      'SequenceProgress',
      'ContinueCTA',
      'src/constants/factorWeb.js',
      'src/constants/contentLimits.js'
    ],
    usedBy: [],
    usageBoundary: null,
    contractDoc: 'docs/system/component-contracts/factor-web.md',
    story: 'src/components/learning/FactorWeb.stories.jsx',
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
    note: 'The registry entry has never carried a five-field Decision block; the boundary against TheoryCompare and the causal-chain components is a pedagogical judgement current source, stories and the factor-web contract do not settle.'
  },
  contract: {
    criticality: 'critical',
    rationale: 'This is the approved causation-and-judgement pattern for GCSE History factor screens, and its 390px composition has been verified against the FactorWeb contract and the gold register. Changing its internals risks reintroducing the pre-rework failures the rework existed to remove.',
    invariants: [
      {
        id: 'governed-composition',
        statement: 'It composes InteractionShell plus a single ScreenTitle, the shared SequenceProgress and the governed ContinueCTA — never a local heading, progress counter or progression control.',
        evidence: [
          {
            kind: 'test',
            reference: 'tests/architecture/factor-web-governance.test.js'
          }
        ]
      },
      {
        id: 'no-pre-rework-regressions',
        statement: 'No centre dots, decorative eyebrows, numeric local progress, emoji factor identity, runtime truncation or clamping, and no chapter-specific geometry inside the shared component.',
        evidence: [
          {
            kind: 'test',
            reference: 'tests/architecture/factor-web-governance.test.js'
          }
        ]
      },
      {
        id: 'balanced-two-column-geometry',
        statement: 'Four to six factors are split into balanced left and right columns around one centre medallion, with the soft localised halo and subtle connector treatment.',
        evidence: [
          {
            kind: 'test',
            reference: 'tests/architecture/factor-web-governance.test.js'
          },
          {
            kind: 'story',
            reference: 'src/components/learning/FactorWeb.stories.jsx'
          }
        ]
      },
      {
        id: 'chapter-owns-imagery-and-wording',
        statement: 'Topic image paths and figure wording stay chapter-owned; the shared component hardcodes neither.',
        evidence: [
          {
            kind: 'test',
            reference: 'tests/architecture/factor-web-governance.test.js'
          }
        ]
      }
    ],
    exclusivity: null,
    requiresProductDecision: [
      'Redesigning the component geometry, heading route, connector style, centre focal treatment, progress affordance or progression controls',
      'Reintroducing centre dots, eyebrows, numeric local progress, emoji factor identity or runtime clamping'
    ]
  }
}

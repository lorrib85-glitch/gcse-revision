// BuilderBlock — component catalogue record.
//
// Build-time governance data. This record is the single home for what the
// catalogue says about BuilderBlock; `docs/components/COMPONENT_REGISTRY.md`
// is generated from it. Run `pnpm catalogue:generate` after editing.

export default {
  id: 'builder-block',
  name: 'BuilderBlock',
  source: 'src/components/learning/BuilderBlock.jsx',
  exportName: null,
  order: 29,
  outOfRootReason: null,
  section: 'learning',
  kind: 'reusable',
  lifecycle: 'active',
  lifecycleReason: null,
  purpose: 'An assessed select-and-place reconstruction task. The learner chooses supplied pieces and places them into exact gaps to rebuild a known equation, reaction, quotation or short piece of text. After an incorrect check, correctly placed pieces remain locked while only the incorrect pieces return for repair.',
  ownership: {
    internalDirectories: [],
    internalFiles: []
  },
  documentation: {
    bestUsedFor: 'Supported reconstruction where understanding the structure and relationships matters, but fully independent recall would create unnecessary cognitive load.',
    props: [
      'block',
      'subject',
      'onComplete'
    ],
    dataShape: "{ type: 'builder', label?, instruction?, layout?: 'reaction'|'expression'|'equation'|'calculation'|'text'|'cloze'|'sentence'|'quote', template?, slots?, pieces: Array<string|number|{ id?, label?, text? }>, answer: Array<string|number|{ label?, text? }>, operators?, groupLabels?, contextImage?, completionNoun? }",
    dependencies: [
      'SUBJECTS',
      'GENERAL',
      'BUTTONS',
      'COMPONENT_SIZE',
      'SPACING',
      'RADII',
      'TYPE',
      'ContinueCTA',
      'ScreenBody',
      'ScreenTitle'
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
    useWhen: 'The learner benefits from rebuilding a known structure while choosing from a finite bank of supplied pieces. Choose it for concise chemical reactions, equations, missing mathematical terms, high-value quotations, definitions or process statements where each piece has one defensible position.',
    doNotUseWhen: 'The learner should generate the answer independently, pieces belong in broad categories rather than exact positions, several arrangements are equally valid or the response is too long to reconstruct comfortably on mobile.',
    chooseInstead: 'Use FillInTheBlanksBlock when the learner should type one missing answer without supplied choices. Use MatchingTask for independent one-to-one pairs. Use ColSortBlock for category grouping. Use OrderedRouteTask when ordered stages are the knowledge being tested. Use CalculationBreakdown when the learner needs to understand and execute a complete connected method.',
    contentShape: 'One concise structure with a finite bank of plausible pieces and one defensible arrangement. Every piece must contribute meaningful subject knowledge rather than acting as obvious filler. Keep the number of gaps manageable on mobile. Correctly placed pieces should remain locked after an unsuccessful check so the learner repairs only the unresolved gaps.',
    rhythmRole: [
      'practice',
      'retrieval',
      'repair'
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
        type: 'builder',
        level: 'block',
        authoringName: 'Builder block',
        layout: 'content',
        status: 'active',
        replacement: null,
        required: [],
        requiredAny: [
          [
            {
              path: 'pieces',
              kind: 'array'
            },
            {
              path: 'options',
              kind: 'array'
            },
            {
              path: 'items',
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

// BeforeAfterImageSlider — component catalogue record.
//
// Build-time governance data. This record is the single home for what the
// catalogue says about BeforeAfterImageSlider; `docs/components/COMPONENT_REGISTRY.md`
// is generated from it. Run `pnpm catalogue:generate` after editing.

export default {
  id: 'before-after-image-slider',
  name: 'BeforeAfterImageSlider',
  source: 'src/components/learning/BeforeAfterImageSlider.jsx',
  exportName: null,
  order: 82,
  section: 'learning',
  kind: 'reusable',
  lifecycle: 'active',
  lifecycleReason: null,
  purpose: 'A draggable before/after image comparison. The learner must push the divider past both the 25% and 75% marks before the takeaway and ContinueCTA are earned — seeing both sides is the learning, not an optional extra.',
  ownership: {
    internalDirectories: [],
    internalFiles: []
  },
  documentation: {
    bestUsedFor: null,
    props: [
      'beforeSrc',
      'afterSrc',
      'beforeAlt',
      'afterAlt',
      "beforeLabel (default 'Before')",
      "afterLabel (default 'After')",
      'heading',
      'accent',
      'revealText',
      'initial (default 50)',
      'onComplete'
    ],
    dataShape: null,
    dependencies: [
      'MOTION',
      'RADII',
      'TYPE',
      'SPACING',
      'GENERAL',
      'BUTTONS',
      'ContinueCTA',
      'ScreenText'
    ],
    usedBy: [],
    usageBoundary: 'Two images of the same subject where the change between them is the GCSE point. Not a general image viewer, and not a way to show two unrelated images.',
    contractDoc: null,
    story: 'src/components/learning/BeforeAfterImageSlider.stories.jsx',
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
    note: 'Pending product review. Its boundary against TheoryCompare and OppositeQualitiesReveal needs a product judgement the current stories and source do not settle.'
  },
  contract: {
    criticality: 'standard',
    rationale: null,
    invariants: [],
    exclusivity: null,
    requiresProductDecision: []
  }
}

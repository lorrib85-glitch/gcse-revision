// GuidedChoiceCarousel — component catalogue record.
//
// Build-time governance data. This record is the single home for what the
// catalogue says about GuidedChoiceCarousel; `docs/components/COMPONENT_REGISTRY.md`
// is generated from it. Run `pnpm catalogue:generate` after editing.

export default {
  id: 'guided-choice-carousel',
  name: 'GuidedChoiceCarousel',
  source: 'src/components/learning/GuidedChoiceCarousel.jsx',
  exportName: null,
  order: 50,
  outOfRootReason: null,
  section: 'learning',
  kind: 'reusable',
  lifecycle: 'active',
  lifecycleReason: null,
  purpose: 'An unscored, full-screen choice experience where the learner browses a small set of visually distinct roles, perspectives or approaches, opens each card for more detail and then chooses one. The selected option is passed forward so later content can noticeably adapt its perspective, example, wording or route.',
  ownership: {
    internalDirectories: [],
    internalFiles: []
  },
  documentation: {
    bestUsedFor: 'Creating meaningful ownership before a scenario or personalised sequence when several defensible choices can lead to genuinely different subsequent content.',
    props: [
      'subject',
      'headline',
      'question',
      'helperText',
      'options',
      'onBack',
      'onContinue'
    ],
    dataShape: 'Option shape: { title, image?, frontItems?, backItems?, revealLines? }',
    dependencies: [
      'InteractionShell',
      'SequenceProgress',
      'ContinueCTA',
      'CinematicContinueCTA',
      'SUBJECTS',
      'GENERAL',
      'SPACING',
      'MOTION',
      'RADII',
      'TYPE',
      'usePrefersReducedMotion'
    ],
    usedBy: [],
    usageBoundary: 'The choice is exploratory and unscored; no option is treated as right or wrong.',
    contractDoc: null,
    story: null,
    governanceRules: [
      'Do not offer fake agency. A selection must alter the subsequent perspective, example, wording or route in a way the learner can notice. If every option produces the same experience, use a reveal or comparison component instead.'
    ],
    notes: []
  },
  decision: {
    status: 'complete',
    useWhen: 'The learner should adopt one of several plausible roles, perspectives, cases or routes and that choice will create a meaningful change in what follows. Choose it when browsing the alternatives first helps the learner understand their differences and the selected option gives the next teaching or scenario a clearer personal point of view.',
    doNotUseWhen: 'One option is objectively correct, every option leads to effectively identical content, the choice changes only a name in the heading or the learner needs to compare all options simultaneously. Do not use it merely to make a passive screen feel interactive, and do not hide long paragraphs on the backs of cards.',
    chooseInstead: 'Use CinematicCarousel when the learner should explore every item without selecting one. Use TheoryCompare when two options need direct parallel comparison. Use InteractiveHotspotImage when the information belongs to locations within one shared image. Use QuickRecallScreen when there is a correct answer. Use a normal teaching screen when the downstream content will not genuinely change.',
    contentShape: 'Usually three to five clearly distinct and defensible options. Each needs a concise title, one purposeful image and a small set of comparable facts or reveal details. Every option should offer a credible reason for selection; avoid one obviously superior "correct" card surrounded by weak or joke alternatives. The subsequent screen must make the consequence of the choice visible.',
    rhythmRole: [
      'opening',
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
        type: 'guidedChoiceCarousel',
        level: 'screen',
        authoringName: 'Guided choice carousel',
        layout: 'full',
        status: 'active',
        replacement: null,
        required: [
          {
            path: 'options',
            kind: 'array'
          }
        ],
        requiredAny: [],
        continuation: 'component',
        headerMode: 'standard',
        handler: null,
        pedagogy: {
          functions: [
            'apply'
          ],
          interaction: 'assessed'
        }
      }
    ]
  }
}

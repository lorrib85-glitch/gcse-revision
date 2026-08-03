// OppositeQualitiesReveal — component catalogue record.
//
// Build-time governance data. This record is the single home for what the
// catalogue says about OppositeQualitiesReveal; `docs/components/COMPONENT_REGISTRY.md`
// is generated from it. Run `pnpm catalogue:generate` after editing.

export default {
  id: 'opposite-qualities-reveal',
  name: 'OppositeQualitiesReveal',
  source: 'src/components/learning/OppositeQualitiesReveal.jsx',
  exportName: null,
  order: 60,
  outOfRootReason: null,
  section: 'learning',
  kind: 'reusable',
  lifecycle: 'active',
  lifecycleReason: null,
  purpose: 'Passive, guided reveal for two opposing concepts. Items appear centrally, travel toward the configured left or right concept, then remain grouped under the correct final heading.',
  ownership: {
    internalDirectories: [],
    internalFiles: []
  },
  documentation: {
    bestUsedFor: null,
    props: [],
    dataShape: null,
    dependencies: [
      'InlineNavigationContext'
    ],
    usedBy: [],
    usageBoundary: null,
    contractDoc: 'docs/system/component-contracts/opposite-qualities-reveal.md',
    story: 'src/components/learning/OppositeQualitiesReveal.stories.jsx',
    governanceRules: [],
    notes: [
      'Accessibility expectations: the final DOM groups every item under its concept label; movement is decorative and not the only carrier of meaning; reduced motion renders the complete grouped state.',
      'Architecture guarded by tests/architecture/oppositeQualitiesRevealArchitecture.test.js.'
    ]
  },
  decision: {
    status: 'complete',
    useWhen: 'Several short words, symptoms or qualities clearly belong to one of two opposites.',
    doNotUseWhen: 'Each side needs evidence, explanation or developed reasoning.',
    chooseInstead: 'Use TheoryCompare for a substantial comparison.',
    contentShape: 'A handful of short items (words, symptoms, qualities) with no explanation attached, each cleanly belonging to one of two opposing concepts — e.g. Hot/Cold and Wet/Dry quality symptoms in Medicine Episode 1.',
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
  },
  authoring: {
    entries: [
      {
        type: 'oppositeQualitiesReveal',
        level: 'block',
        authoringName: 'Opposite qualities reveal',
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
            'teach-comparison'
          ],
          interaction: 'reveal'
        }
      },
      {
        type: 'oppositeQualitiesReveal',
        level: 'screen',
        authoringName: 'Opposite qualities reveal',
        layout: 'full',
        status: 'active',
        replacement: null,
        required: [],
        requiredAny: [],
        continuation: 'player',
        headerMode: 'standard',
        handler: null,
        pedagogy: {
          functions: [
            'teach-comparison'
          ],
          interaction: 'reveal'
        }
      }
    ]
  }
}

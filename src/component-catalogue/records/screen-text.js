// ScreenText — component catalogue record.
//
// Build-time governance data. This record is the single home for what the
// catalogue says about ScreenText; `docs/components/COMPONENT_REGISTRY.md`
// is generated from it. Run `pnpm catalogue:generate` after editing.

export default {
  id: 'screen-text',
  name: 'ScreenText',
  source: 'src/components/core/ScreenText.jsx',
  exportName: null,
  order: 20,
  scope: {
    location: 'components',
    reason: null
  },
  section: 'core',
  kind: 'support',
  lifecycle: 'active',
  lifecycleReason: null,
  purpose: 'The text primitives for content inside ContentShell. These are the intentional path — the shell’s scoped CSS handles raw h1/h2/p only as a safety net, while these primitives carry the full intended design.',
  ownership: {
    internalDirectories: [],
    internalFiles: []
  },
  documentation: {
    bestUsedFor: null,
    props: [
      'exports ScreenTitle, ScreenSubtitle, ScreenBody, ScreenIntro, ScreenCaption, ScreenCallout, ScreenList'
    ],
    dataShape: null,
    dependencies: [
      'TYPE',
      'HEADING_LAYOUT'
    ],
    usedBy: [
      '18 components across learning/ and layout/ — the most widely shared primitive in the tree'
    ],
    usageBoundary: 'ScreenTitle deliberately ignores typography properties passed through style (fontFamily, fontSize, fontWeight, lineHeight, letterSpacing) so callers cannot create a second screen-title system locally. Layout and colour overrides are allowed.',
    contractDoc: null,
    story: null,
    governanceRules: [],
    notes: []
  },
  decision: null,
  contract: {
    criticality: 'critical',
    rationale: 'A second screen-title system crept into this codebase once already, by components re-spreading TYPE.displayScreen on their own heading markup. ScreenTitle exists to make that impossible, and the guard that enforces it is a few lines of prop-stripping that a well-meaning refactor would remove without noticing.',
    invariants: [
      {
        id: 'screen-title-strips-typography-overrides',
        statement: 'ScreenTitle deletes fontFamily, fontSize, fontWeight, lineHeight and letterSpacing from any style passed in, so callers cannot build a second screen-title system locally. Layout and colour overrides remain allowed.',
        evidence: [
          {
            kind: 'test',
            reference: 'tests/architecture/typography-governance.test.js'
          }
        ]
      },
      {
        id: 'primary-heading-routes-through-display-screen',
        statement: 'Its primary heading spreads TYPE.displayScreen and overrides none of the five typography properties locally.',
        evidence: [
          {
            kind: 'test',
            reference: 'tests/architecture/typography-governance.test.js'
          }
        ]
      },
      {
        id: 'learning-components-use-the-primitive',
        statement: 'A learning component rendering its own primary non-cinematic heading uses ScreenTitle rather than re-spreading TYPE.displayScreen on local markup.',
        evidence: [
          {
            kind: 'test',
            reference: 'tests/architecture/typography-governance.test.js'
          }
        ]
      }
    ],
    exclusivity: null,
    requiresProductDecision: [
      'Removing or weakening the ScreenTitle typography-override guard',
      'Changing what TYPE.displayScreen owns for non-cinematic screen titles'
    ]
  }
}

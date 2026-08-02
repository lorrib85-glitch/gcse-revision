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
    governanceRules: [
      'The ScreenTitle typography-override guard is a hard rule: enforced by tests/architecture/typography-governance.test.js, which treats ScreenText.jsx and TeachScreenShell.jsx as the canonical screen-heading components.'
    ],
    notes: []
  },
  decision: null,
  contract: {
    criticality: 'standard',
    rationale: null,
    invariants: [],
    exclusivity: null,
    requiresProductDecision: []
  }
}

// CheckAnswerCTA — component catalogue record.
//
// Build-time governance data. This record is the single home for what the
// catalogue says about CheckAnswerCTA; `docs/components/COMPONENT_REGISTRY.md`
// is generated from it. Run `pnpm catalogue:generate` after editing.

export default {
  id: 'check-answer-cta',
  name: 'CheckAnswerCTA',
  source: 'src/components/core/CheckAnswerCTA.jsx',
  exportName: null,
  order: 6,
  scope: {
    location: 'components',
    reason: null
  },
  section: 'core',
  kind: 'support',
  lifecycle: 'active',
  lifecycleReason: null,
  purpose: 'The governed shared non-progression answer-submit / "check my thinking" action for assessed learning screens. Deliberately distinct from ContinueCTA: BUTTONS.secondary (56px, RADII.medium) with a solid subject-accent fill, GENERAL.textOnAccent foreground, the governed disabled treatment, and focus-visible and press states — so a check step never visually competes with the Continue that advances the flow.',
  ownership: {
    internalDirectories: [],
    internalFiles: []
  },
  documentation: {
    bestUsedFor: null,
    props: [
      'onClick',
      "label (default 'Check my thinking')",
      'accent',
      'disabled',
      'disabledBackground',
      'disabledColor',
      'textColor',
      'style (layout overrides only — width/flex/margin; never new height, radius, font or colour logic)'
    ],
    dataShape: null,
    dependencies: [
      'BUTTONS',
      'MOTION',
      'GENERAL'
    ],
    usedBy: [
      'SpotTheError'
    ],
    usageBoundary: 'Prefer this over rebuilding a bespoke check or submit button in any new assessed component.',
    contractDoc: null,
    story: 'src/components/core/CheckAnswerCTA.stories.jsx',
    governanceRules: [],
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

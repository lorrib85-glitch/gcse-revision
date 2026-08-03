// BackButton — component catalogue record.
//
// Build-time governance data. This record is the single home for what the
// catalogue says about BackButton; `docs/components/COMPONENT_REGISTRY.md`
// is generated from it. Run `pnpm catalogue:generate` after editing.

export default {
  id: 'back-button',
  name: 'BackButton',
  source: 'src/components/core/BackButton.jsx',
  exportName: null,
  order: 2,
  outOfRootReason: null,
  section: 'core',
  kind: 'support',
  lifecycle: 'active',
  lifecycleReason: null,
  purpose: 'The back-navigation button for the whole app: 40×40 pill, near-invisible fill and border, left chevron only, no label, identical hover and press opacity.',
  ownership: {
    internalDirectories: [],
    internalFiles: []
  },
  documentation: {
    bestUsedFor: null,
    props: [
      'onClick',
      "ariaLabel (default 'Go back')",
      'style (layout overrides only — position/margin/zIndex)'
    ],
    dataShape: null,
    dependencies: [],
    usedBy: [],
    usageBoundary: null,
    contractDoc: null,
    story: null,
    governanceRules: [],
    notes: []
  },
  decision: null,
  contract: {
    criticality: 'critical',
    rationale: 'Back navigation had drifted into at least four divergent inline patterns before this component existed (ghost circles, bordered pills with and without a "Back" label, bare chevron characters). Re-fragmenting it is cheap to do accidentally and expensive to unpick — it was a 28-call-site migration.',
    invariants: [
      {
        id: 'control-appearance',
        statement: '40×40 touch target, rgba(255,255,255,0.05) fill, 1px rgba(255,255,255,0.03) border, RADII.pill, left-chevron icon only, never a text label.',
        evidence: [
          {
            kind: 'review',
            reference: 'Compare against the rendered control at 390px; confirm no label and no radius or fill override.'
          }
        ]
      },
      {
        id: 'press-feedback-parity',
        statement: 'Hover and press render identically at opacity 0.6, via the shared .rise-back-button rule in src/styles.css.',
        evidence: [
          {
            kind: 'review',
            reference: 'Inspect the .rise-back-button rule in src/styles.css: :hover and :active must carry the same opacity.'
          }
        ]
      }
    ],
    exclusivity: {
      pattern: 'back-navigation',
      soleImplementation: true,
      prohibitedAlternatives: [
        'inline back buttons built from a bare chevron character',
        'feature-owned competing back-button components',
        'bordered pills carrying a "Back" text label'
      ],
      evidence: [
        {
          kind: 'review',
          reference: 'Before approving a new screen, search it for chevron or back affordances that do not render the BackButton component.'
        }
      ]
    },
    requiresProductDecision: [
      'Changing size, fill, border, radius, icon or opacity behaviour',
      'Adding a text label',
      'Allowing a competing back-navigation implementation anywhere in the app'
    ]
  },
  authoring: null
}

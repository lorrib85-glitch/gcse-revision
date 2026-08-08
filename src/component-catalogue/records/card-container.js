// CardContainer — component catalogue record.
//
// Build-time governance data. This record is the single home for what the
// catalogue says about CardContainer; `docs/components/COMPONENT_REGISTRY.md`
// is generated from it. Run `pnpm catalogue:generate` after editing.

export default {
  id: 'card-container',
  name: 'CardContainer',
  source: 'src/components/core/CardContainer.jsx',
  exportName: null,
  order: 3,
  outOfRootReason: null,
  section: 'core',
  kind: 'support',
  lifecycle: 'active',
  lifecycleReason: null,
  purpose: 'Atmospheric content surface wrapper. Provides a consistent card shell with optional background image, subject glow and cinematic atmosphere.',
  ownership: {
    internalDirectories: [],
    internalFiles: []
  },
  documentation: {
    bestUsedFor: null,
    props: [
      'variant',
      'subject',
      'padding',
      'contextImage',
      'showAtmosphere',
      'children',
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
    rationale: 'It is the visual contract for every content card surface in the product, so a change to its atmosphere cascades to every card at once and reads as a whole-app restyle rather than a component tweak.',
    invariants: [
      {
        id: 'explicit-variant',
        statement: "variant is always explicit ('contained' | 'cinematicOverlay' | 'inline' | 'compact' | 'fullBleed'). The component never infers a variant from its content.",
        evidence: [
          {
            kind: 'review',
            reference: 'Confirm no call site relies on an inferred variant, and the component adds no content sniffing.'
          }
        ]
      },
      {
        id: 'restrained-subject-atmosphere',
        statement: 'Subject atmosphere stays barely-there: tint, glow and shadow opacities live in the 0.06–0.12 range, so the surface never competes with the lesson.',
        evidence: [
          {
            kind: 'review',
            reference: 'Check every tint, glow and shadow opacity value against the 0.06–0.12 range.'
          }
        ]
      },
      {
        id: 'no-css-filters',
        statement: 'No CSS filters (sepia, hue-rotate and friends) on wrapped content or images.',
        evidence: [
          {
            kind: 'review',
            reference: 'Confirm the component applies no filter property to children or background imagery.'
          }
        ]
      }
    ],
    exclusivity: null,
    requiresProductDecision: [
      'Changing card visual appearance',
      'Changing glow behaviour',
      'Altering background image treatment'
    ]
  },
  authoring: null
}

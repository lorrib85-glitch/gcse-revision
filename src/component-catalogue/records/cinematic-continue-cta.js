// CinematicContinueCTA — component catalogue record.
//
// Build-time governance data. This record is the single home for what the
// catalogue says about CinematicContinueCTA; `docs/components/COMPONENT_REGISTRY.md`
// is generated from it. Run `pnpm catalogue:generate` after editing.

export default {
  id: 'cinematic-continue-cta',
  name: 'CinematicContinueCTA',
  source: 'src/components/core/CinematicContinueCTA.jsx',
  exportName: null,
  order: 4,
  scope: {
    location: 'components',
    reason: null
  },
  section: 'core',
  kind: 'support',
  lifecycle: 'active',
  lifecycleReason: null,
  purpose: 'The cinematic "Continue →" prompt: plain centred text fixed to the bottom of a full-screen cinematic moment, with a fade-in and idle pulse. See docs/system/BUTTON_RADII_SYSTEM.md "Progression CTA System".',
  ownership: {
    internalDirectories: [],
    internalFiles: []
  },
  documentation: {
    bestUsedFor: null,
    props: [
      'onClick',
      'accent',
      "animation (default 'crm-fade 700ms ease both, crm-pulse 2.8s ease-in-out 900ms infinite')",
      'style (layout overrides only — position, animation, zIndex; never new typography, spacing or colour logic)'
    ],
    dataShape: null,
    dependencies: [],
    usedBy: [
      'CinematicRevealMoment',
      'ExaminerExplainsScreen'
    ],
    usageBoundary: null,
    contractDoc: null,
    story: null,
    governanceRules: [],
    notes: []
  },
  decision: null,
  contract: {
    criticality: 'critical',
    rationale: 'Consolidated in 2026-06-15 from inline implementations in CinematicRevealMoment and ExaminerExplainsScreen. A cinematic moment is the product identity at its most exposed, and a second inline prompt re-opens exactly the drift that consolidation closed.',
    invariants: [
      {
        id: 'plain-centred-prompt',
        statement: 'Plain centred "Continue →" text fixed to the bottom of the cinematic moment, with the fade-in and idle pulse. Never a filled button, never a pill.',
        evidence: [
          {
            kind: 'review',
            reference: 'Render a cinematic screen at 390px and confirm the prompt is bare text, centred and bottom-fixed.'
          }
        ]
      },
      {
        id: 'stops-propagation',
        statement: 'onClick always calls e.stopPropagation() before invoking the handler, so the prompt can sit inside a tap-to-advance container without triggering the container’s own navigation.',
        evidence: [
          {
            kind: 'review',
            reference: 'Tap the prompt inside a tap-to-advance screen and confirm the screen advances exactly once.'
          }
        ]
      }
    ],
    exclusivity: {
      pattern: 'cinematic-reveal-cta',
      soleImplementation: true,
      prohibitedAlternatives: [
        'inline "Continue →" text prompts inside a cinematic screen',
        'a component-local cinematic CTA with its own fade or pulse animation'
      ],
      evidence: [
        {
          kind: 'review',
          reference: 'Search any new cinematic screen for a hand-rolled "Continue →" before approving it.'
        }
      ]
    },
    requiresProductDecision: [
      'Changing typography, spacing or colour logic',
      'Allowing an inline cinematic "Continue →" implementation'
    ]
  }
}

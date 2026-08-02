// ContinueCTA — component catalogue record.
//
// Build-time governance data. This record is the single home for what the
// catalogue says about ContinueCTA; `docs/components/COMPONENT_REGISTRY.md`
// is generated from it. Run `pnpm catalogue:generate` after editing.

export default {
  id: 'continue-cta',
  name: 'ContinueCTA',
  source: 'src/components/core/ContinueCTA.jsx',
  exportName: null,
  order: 5,
  section: 'core',
  kind: 'support',
  lifecycle: 'active',
  lifecycleReason: null,
  purpose: 'The Primary Progression CTA: 56px tall, RADII.large, solid accent fill, #0D0F14 text, "Continue" label, with built-in press-scale feedback. See docs/system/BUTTON_RADII_SYSTEM.md "Progression CTA System".',
  ownership: {
    internalDirectories: [],
    internalFiles: []
  },
  documentation: {
    bestUsedFor: null,
    props: [
      'onClick',
      "label (default 'Continue')",
      'accent',
      'disabled',
      'disabledBackground',
      'disabledColor',
      'textColor',
      'onMouseEnter',
      'onMouseLeave',
      'style (layout overrides only — width/flex, margin, position, animation, transition; never new height, radius, font or colour logic)'
    ],
    dataShape: null,
    dependencies: [],
    usedBy: [
      'every screen-to-screen "Continue" button across src/components/learning/ and src/components/feedback/',
      'ChapterPlayer\'s bottom navigation (which also renders the "Finish ✓" label via `label`)'
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
    rationale: 'Consolidated in 2026-06-15 from inline implementations across learning/, feedback/ and the chapter runtime. It is the single most-repeated control in the product, so one divergent copy is immediately visible as inconsistency across a chapter.',
    invariants: [
      {
        id: 'fixed-button-geometry',
        statement: '56px tall, RADII.large, solid accent fill, #0D0F14 text. Never a pill, never a different height.',
        evidence: [
          {
            kind: 'review',
            reference: 'Measure the rendered CTA at 390px against BUTTONS.continue and RADII.large.'
          }
        ]
      },
      {
        id: 'press-scale-feedback',
        statement: 'Press feedback is BUTTONS.continue.pressScale, applied on onPointerDown / onPointerUp / onPointerLeave.',
        evidence: [
          {
            kind: 'review',
            reference: 'Press and drag off the button; the scale must return on pointer leave as well as pointer up.'
          }
        ]
      },
      {
        id: 'governed-disabled-treatment',
        statement: 'The disabled state renders through disabledBackground / disabledColor rather than a locally invented dimmed style.',
        evidence: [
          {
            kind: 'review',
            reference: 'Render the disabled state and confirm it uses the governed tokens.'
          }
        ]
      }
    ],
    exclusivity: {
      pattern: 'primary-progression-cta',
      soleImplementation: true,
      prohibitedAlternatives: [
        'inline "Continue" buttons inside a learning or feedback component',
        'a feature-owned progression button with its own height, radius or fill'
      ],
      evidence: [
        {
          kind: 'review',
          reference: 'Every screen-to-screen progression control must render the ContinueCTA component; check new screens for a hand-rolled one.'
        }
      ]
    },
    requiresProductDecision: [
      'Changing height, radius, font or colour logic',
      'Allowing an inline progression-button implementation'
    ]
  }
}

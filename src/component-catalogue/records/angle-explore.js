// AngleExplore — component catalogue record.
//
// Build-time governance data. This record is the single home for what the
// catalogue says about AngleExplore; `docs/components/COMPONENT_REGISTRY.md`
// is generated from it. Run `pnpm catalogue:generate` after editing.

export default {
  id: 'angle-explore',
  name: 'AngleExplore',
  source: 'src/components/learning/AngleExplore.jsx',
  exportName: null,
  order: 25,
  outOfRootReason: null,
  section: 'learning',
  kind: 'reusable',
  lifecycle: 'reviewing',
  lifecycleReason: "Routed for chapter authoring in Phase 4 as block:angleFigure; the component itself is still under review, which is what keeps this lifecycle at reviewing.",
  purpose: 'Configuration-driven GCSE angle diagram — the Maths sibling of CircuitDiagram. Shapes and angles render as inline SVG; one learner-controlled value (a draggable ray, or a triangle’s draggable apex) drives live sector values, angle classifications and an angle-fact status line. Five registered presets — angleTypes (drag a ray, watch the value and its acute/right/obtuse/straight/reflex classification), straightLine (two angles summing to 180°), aroundPoint (three angles summing to 360°), verticallyOpposite (equal pairs sharing a colour), triangle (drag the apex, interior angles always total 180°) — plus a compatible-preset-object escape hatch. interactive={false} turns any preset into a static teaching or exam diagram at a fixed value. The drag handle is a keyboard-operable role="slider" (arrow keys / Home / End) with a ≥44px hit target; right angles render the GCSE square marker; values magnetise to 90°/180°/270°. Respects prefers-reduced-motion (and a reducedMotion prop override).',
  ownership: {
    internalDirectories: [
      {
        path: 'src/components/learning/angle',
        reason: 'Pure angle geometry, preset definitions and semantic colour roles rendered only through AngleExplore. Not separately selectable, and deliberately not an authoring choice.'
      }
    ],
    internalFiles: []
  },
  documentation: {
    bestUsedFor: 'Teaching and exploring AQA Foundation angle facts where seeing the relationship respond to movement is the point — angle types, angles on a straight line, angles around a point, vertically opposite angles, angles in a triangle. Page-level questions, predictions and marking stay outside the component (compose it like CircuitDiagram).',
    props: [
      'preset (name or preset object, defaults to angleTypes)',
      'value (controlled)',
      'defaultValue',
      'onChange',
      'interactive',
      'disabled',
      'subject (defaults to Maths)',
      'reducedMotion',
      'label',
      'showStatus'
    ],
    dataShape: "{ type: 'angleFigure', preset: 'angleTypes' | 'straightLine' | 'aroundPoint' | 'verticallyOpposite' | 'parallelLines' | 'parallelAlternate' | 'parallelCoInterior' | 'triangle' | 'triangleTypes' | 'quadrilateral' | 'polygonSum' | 'regularPolygon', value?, defaultValue?, interactive?, label?, showStatus? }",
    dependencies: [
      'SUBJECTS',
      'GENERAL (via angle/angleVisualRoles.js semantic roles)',
      'TYPE',
      'SPACING',
      'MOTION (injected animation CSS via ensureStyles(), same pattern as CircuitDiagram/GraphView)',
      'pure geometry in angle/angleGeometry.js',
      'presets in angle/anglePresets.js'
    ],
    usedBy: [],
    usageBoundary: null,
    contractDoc: null,
    story: 'src/components/learning/AngleExplore.stories.jsx',
    governanceRules: [],
    notes: []
  },
  decision: {
    status: 'complete',
    useWhen: 'The learning objective is an angle fact or angle vocabulary, and manipulating the diagram makes the relationship visible — the sum staying fixed while parts trade, or a classification changing as the angle grows. Also use its static mode for any accurate, on-theme angle/triangle diagram inside teaching or exam content.',
    doNotUseWhen: 'The learner must be assessed on a calculation (compose a question component around a static AngleExplore instead); the content is chart or data interpretation (GraphView); or the diagram is a construction/loci/bearings task the presets cannot express.',
    chooseInstead: 'Use GraphView when the job is interpreting data rather than angle facts. Use a static figure image when no interaction is needed and the diagram is one-off.',
    contentShape: 'Pick the preset matching the angle fact; optionally fix value for a specific worked example. One diagram per screen — the component teaches one relationship at a time.',
    rhythmRole: [
      'teaching',
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
        // Its own public authoring type, not a mode of an invented figure
        // router. Authors write the type they mean;
        // the four Maths figure families share props, not an identity.
        type: 'angleFigure',
        level: 'block',
        authoringName: 'Angle figure',
        layout: 'content',
        status: 'active',
        replacement: null,
        required: [
          {
            path: 'preset',
            kind: 'string'
          }
        ],
        requiredAny: [],
        continuation: 'player',
        headerMode: 'standard',
        handler: null,
        pedagogy: {
          functions: [
            'teach-mechanism'
          ],
          interaction: 'reveal'
        }
      }
    ]
  }
}

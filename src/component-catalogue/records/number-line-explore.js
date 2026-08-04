// NumberLineExplore — component catalogue record.
//
// Build-time governance data. This record is the single home for what the
// catalogue says about NumberLineExplore; `docs/components/COMPONENT_REGISTRY.md`
// is generated from it. Run `pnpm catalogue:generate` after editing.

export default {
  id: 'number-line-explore',
  name: 'NumberLineExplore',
  source: 'src/components/learning/NumberLineExplore.jsx',
  exportName: null,
  order: 55,
  outOfRootReason: null,
  section: 'learning',
  kind: 'reusable',
  lifecycle: 'reviewing',
  lifecycleReason: "Routed for chapter authoring in Phase 4 as block:numberLineFigure; the component itself is still under review, which is what keeps this lifecycle at reviewing.",
  purpose: 'Configuration-driven GCSE number line — the shared visual foundation for number topics, and a sibling of AngleExplore and AreaPerimeterExplore. One line, one interaction model and one status voice cover what would otherwise be six near-identical single-purpose diagrams. The line, its shaded intervals, movement arcs and endpoints render as inline SVG in model space (values are never measured back from pixels); learner-controlled values drive a live status line. Seven registered presets — orderNumbers, negativeMovement, roundingIntervals, inequalityRange, boundsInterval, multiplyPattern, estimateRange — plus a compatible-preset-object escape hatch. interactive={false} turns any preset into a static teaching or exam diagram at fixed values. Draggable markers are keyboard-operable role="slider" elements (arrow keys / Home / End) with ≥44px hit targets; discrete choices (open/closed, direction, precision, jump size) are real buttons, never disguised sliders. Filled markers include an endpoint, open markers exclude it, and a line marker denotes a fixed reference another marker may legitimately sit on. Respects prefers-reduced-motion (and a reducedMotion prop override) — the arc’s draw-in becomes an instantly finished arc.',
  ownership: {
    internalDirectories: [
      {
        path: 'src/components/learning/numberLine',
        reason: 'Number-line presets, pure model-space maths and semantic colour roles rendered only through NumberLineExplore. Not separately selectable, and deliberately not an authoring choice.'
      }
    ],
    internalFiles: []
  },
  documentation: {
    bestUsedFor: 'Teaching AQA Foundation number topics where position, direction and size are the point — place value, ordering integers/decimals/fractions, negative numbers, addition and subtraction as movement, multiplication patterns with negatives, rounding, estimation ranges, inequalities, upper and lower bounds, and scale reading. Use it when seeing where a number lives is the lesson. Questions, predictions, marking, scoring and weakness tracking stay outside the component.',
    props: [
      'preset (name or preset object, defaults to orderNumbers)',
      'value (controlled values object)',
      'defaultValue',
      'options (initial discrete choices)',
      'onChange',
      'interactive',
      'disabled',
      'subject (defaults to Maths)',
      'reducedMotion',
      'label',
      'showStatus'
    ],
    dataShape: "{ type: 'numberLineFigure', preset: 'orderNumbers' | 'negativeMovement' | 'roundingIntervals' | 'inequalityRange' | 'boundsInterval' | 'multiplyPattern' | 'estimateRange', value?, defaultValue?, options?, interactive?, label?, showStatus? }",
    dependencies: [
      'SUBJECTS',
      'GENERAL (via numberLine/numberLineVisualRoles.js semantic roles)',
      'TYPE',
      'SPACING',
      'RADII',
      'MOTION (injected animation CSS via ensureStyles())',
      'pure maths in numberLine/numberLineGeometry.js (which re-exports the neutral geometry/shapeGeometry.js helpers)',
      'presets in numberLine/numberLinePresets.js'
    ],
    usedBy: [],
    usageBoundary: null,
    contractDoc: null,
    story: 'src/components/learning/NumberLineExplore.stories.jsx',
    governanceRules: [],
    notes: []
  },
  decision: {
    status: 'complete',
    useWhen: 'The learning objective is about where numbers sit relative to each other, or about a movement, interval or bound along the line — and moving a point makes the relationship visible: an ordering re-sorting, a jump landing left of zero, a value crossing a halfway point, an endpoint switching between included and excluded. Also use its static mode for any accurate, on-theme number-line diagram inside teaching or exam content.',
    doNotUseWhen: 'The learner must be assessed on the answer (compose a question component around a static instance instead); the content is chart or data interpretation (GraphView); the task is carrying out a multi-step calculation (CalculationBreakdown); or the idea is not positional at all — a number line adds nothing to, say, factorising.',
    chooseInstead: 'Use AngleExplore for angle facts — do not add number-line modes to it. Use AreaPerimeterExplore for mensuration. Use GraphView for interpreting data rather than number position. Use CalculationBreakdown for executing a method step by step. Use a static figure image when no interaction is needed and the diagram is one-off.',
    contentShape: 'Pick the preset matching the idea; optionally fix value and options for a specific worked example. One line per screen — the component teaches one relationship at a time, and its option buttons switch between framings of that same relationship rather than adding a second lesson.',
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
        // one dimension is a different teaching object from a plane.
        type: 'numberLineFigure',
        level: 'block',
        authoringName: 'Number line figure',
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

// CoordinatePlaneExplore — component catalogue record.
//
// Build-time governance data. This record is the single home for what the
// catalogue says about CoordinatePlaneExplore; `docs/components/COMPONENT_REGISTRY.md`
// is generated from it. Run `pnpm catalogue:generate` after editing.

export default {
  id: 'coordinate-plane-explore',
  name: 'CoordinatePlaneExplore',
  source: 'src/components/learning/CoordinatePlaneExplore.jsx',
  exportName: null,
  order: 28,
  outOfRootReason: null,
  section: 'learning',
  kind: 'reusable',
  lifecycle: 'reviewing',
  lifecycleReason: 'Built and catalogued, but not yet routed for chapter authoring — pending component review.',
  purpose: 'Configuration-driven GCSE coordinate plane — the coordinate-geometry sibling of AngleExplore, AreaPerimeterExplore, FractionRatioExplore and NumberLineExplore. One visual grammar runs through every preset: one plane (every preset shares an axis system, tick treatment and grid density), points that carry their coordinates (a named point is drawn with its coordinate chip — reading a coordinate is never a separate mode), and a rule made visible as geometry (across-then-up guides, the rise/run triangle, the mirror line, the centre of rotation, the rays from a centre of enlargement). That third clause is why transformations live here rather than in a separate component: a reflection is a rule that moves coordinates, and the coordinate movement is the teaching mechanism, not a finished diagram. Nine registered presets — plotPoint, midpoint, straightLine, tableOfValues, intersection, translate, reflect, rotate, enlarge — plus a compatible-preset-object escape hatch. A three-tier annotation contract governs density: active geometry (full coordinate chip, guide lines and rule geometry), related geometry (compact label only) and context geometry (visible but unannotated), with only one point active by default. Option selections live in the value model, so value/defaultValue/onChange carry the complete state and a static exam figure can specify a reflection in y = x or an enlargement by −1. Capabilities constrain state rather than hiding controls, and controls that cannot affect the current state are absent rather than inert. Axis placement is resolved per axis, so positive-only x against signed y renders correctly. interactive={false} gives a static teaching or exam figure that still carries a descriptive <desc> of the actual figure state. Respects prefers-reduced-motion (and a reducedMotion prop override).',
  ownership: {
    internalDirectories: [
      {
        path: 'src/components/learning/coordinatePlane',
        reason: 'Pure coordinate maths, model-space geometry, label layout, option/capability state and one file per preset, rendered only through CoordinatePlaneExplore. Not separately selectable, and deliberately not an authoring choice.'
      }
    ],
    internalFiles: []
  },
  documentation: {
    bestUsedFor: `Coordinates and quadrants, midpoints, straight-line graphs and y = mx + c, tables of values, parallel and perpendicular gradients, solving simultaneous equations graphically, and all four transformations. Because axis labels, units and independent scales are part of the plane API, it also serves science graphs — subject="Physics" with xAxis={{ label: 'Time', unit: 's', min: 0, max: 20 }} gives a usable distance–time frame, not merely a recoloured Maths diagram. Questions, predictions, marking, scores and weakness tracking stay outside the component.`,
    props: [
      'preset (name or preset object, defaults to plotPoint)',
      'focus',
      'comparisonRule',
      'value (controlled values object)',
      'defaultValue',
      'onChange',
      'interactive',
      'disabled',
      "showGuides ('active' | 'all' | 'none')",
      'difficultyCapabilities',
      'xAxis',
      'yAxis',
      'grid',
      'subject',
      'reducedMotion',
      'label',
      'showStatus'
    ],
    dataShape: null,
    dependencies: [
      'SUBJECTS',
      'GENERAL (via coordinatePlane/coordinatePlaneVisualRoles.js semantic roles)',
      'TYPE',
      'SPACING',
      'COMPONENT_SIZE',
      'RADII',
      'MOTION (injected animation CSS via ensureStyles())',
      'pure maths in coordinatePlane/coordinatePlaneMath.js',
      'geometry and model-space clipping in coordinatePlane/coordinatePlaneGeometry.js',
      'shared label placement in coordinatePlane/pointLabelLayout.js',
      'capability and option resolution in coordinatePlane/presets/optionState.js'
    ],
    usedBy: [],
    usageBoundary: null,
    contractDoc: null,
    story: 'src/components/learning/CoordinatePlaneExplore.stories.jsx',
    governanceRules: [],
    notes: [
      'Enforced by tests/architecture/coordinate-plane-{annotation-contract,control-reachability,visible-bounds}.test.js over the shared state space in tests/support/coordinatePlaneStateSpace.js.',
      'Known design debt: where both axes cross, a plotted point may cover an internal axis number. The coordinate chip still supplies the exact value, so nothing is unreadable, but relocating all axis numbering to the plot edges is a graph-system design decision rather than a safe renderer patch. Revisit when the wider graph system is next reviewed.'
    ]
  },
  decision: {
    status: 'complete',
    useWhen: 'Position, movement or a coordinate rule must be understood through one responsive plane — for example plotting, midpoints, straight-line relationships, intersections or transformations.',
    doNotUseWhen: 'The learner is interpreting a supplied dataset rather than manipulating coordinates; the task is primarily calculating an answer; or a one-off static image communicates the complete figure without reusable behaviour.',
    chooseInstead: 'Use GraphView for charts and supplied datasets, NumberLineExplore for one-dimensional position, AngleExplore for angle facts, AreaPerimeterExplore for mensuration, or CalculationBreakdown for executing a numerical method.',
    contentShape: 'One preset and one primary coordinate relationship per screen. Configure the values, focus, capabilities and axes needed for that learning beat; place questions, marking and weakness tracking outside the component.',
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
  authoring: null
}

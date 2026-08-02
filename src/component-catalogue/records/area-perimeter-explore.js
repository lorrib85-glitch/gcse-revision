// AreaPerimeterExplore — component catalogue record.
//
// Build-time governance data. This record is the single home for what the
// catalogue says about AreaPerimeterExplore; `docs/components/COMPONENT_REGISTRY.md`
// is generated from it. Run `pnpm catalogue:generate` after editing.

export default {
  id: 'area-perimeter-explore',
  name: 'AreaPerimeterExplore',
  source: 'src/components/learning/AreaPerimeterExplore.jsx',
  exportName: null,
  order: 26,
  outOfRootReason: null,
  section: 'learning',
  kind: 'reusable',
  lifecycle: 'reviewing',
  lifecycleReason: 'Built and catalogued, but not yet routed for chapter authoring — pending component review.',
  purpose: 'Configuration-driven GCSE area and perimeter diagram — the mensuration sibling of AngleExplore, and deliberately separate from it (AngleExplore stays focused on angle relationships). Shapes render as inline SVG in model space (whole centimetres mapped to pixels, never measured back from pixels); learner-controlled dimensions drive a live boundary trace, unit-square grids, decomposition pieces and a stable result → calculation → explanation status area. Six registered presets — rectangle (drag width and height independently, snapping to whole numbers, with a square state that marks equal sides and names side²), fixedPerimeterRectangle (perimeter pinned at 24 cm while area rises to a maximum at the square), triangleArea (slide the apex with the perpendicular height fixed; pair a rotated copy to earn ½ × base × perpendicular height), parallelogramArea (slant does not change area; a triggered cut-and-slide builds the equivalent rectangle), trapeziumArea (duplicate and rotate into a parallelogram of base a + b to derive ½ × (a + b) × h), compositeShape (L-shape with two valid decomposition splits plus a whole-minus-missing-corner method, and a perimeter mode that excludes internal lines and deduces missing outer lengths) — plus a compatible-preset-object escape hatch. focus selects perimeter, area or compare where the preset supports more than one. interactive={false} turns any preset into a static teaching or exam diagram. Drag handles are keyboard-operable role="slider" elements (arrow keys / Home / End) with ≥44px hit targets that never overlap in any reachable state; discrete choices (decomposition method, formula reveal) are real buttons, never disguised sliders. Respects prefers-reduced-motion (and a reducedMotion prop override).',
  ownership: {
    internalDirectories: [
      {
        path: 'src/components/learning/areaPerimeter',
        reason: 'Mensuration presets, pure geometry and semantic colour roles rendered only through AreaPerimeterExplore. Not separately selectable, and deliberately not an authoring choice.'
      },
      {
        path: 'src/components/learning/geometry',
        reason: 'Neutral shared shape geometry helpers used by the angle, area/perimeter, number-line and coordinate-plane families. Pure maths with no rendering and no learning behaviour of its own; owned here because AreaPerimeterExplore is its primary consumer.'
      }
    ],
    internalFiles: []
  },
  documentation: {
    bestUsedFor: 'Teaching the conceptual difference between perimeter and area, and deriving AQA Foundation area formulae from visual reasoning — rectangles and squares, triangles, parallelograms, trapezia, quadrilaterals and composite rectilinear shapes. Use it when seeing the reasoning is the point: perimeter accumulating as edges are traced, area accumulating as square units are counted or rearranged, or the two measures changing differently as one dimension moves. Prediction questions, marking, hints, scores and weakness tracking stay outside the component (compose it like AngleExplore/CircuitDiagram).',
    props: [
      'preset (name or preset object, defaults to rectangle)',
      'focus (perimeter | area | compare)',
      'value (controlled dimensions object)',
      'defaultValue',
      'onChange',
      'interactive',
      'disabled',
      'subject (defaults to Maths)',
      'reducedMotion',
      'label',
      'showStatus'
    ],
    dataShape: null,
    dependencies: [
      'SUBJECTS',
      'GENERAL (via areaPerimeter/areaPerimeterVisualRoles.js semantic roles)',
      'TYPE',
      'SPACING',
      'RADII',
      'MOTION (injected animation CSS via ensureStyles())',
      'neutral shared geometry in geometry/shapeGeometry.js (also used by angle/)',
      'presets in areaPerimeter/areaPerimeterPresets.js'
    ],
    usedBy: [],
    usageBoundary: null,
    contractDoc: null,
    story: 'src/components/learning/AreaPerimeterExplore.stories.jsx',
    governanceRules: [],
    notes: []
  },
  decision: {
    status: 'complete',
    useWhen: 'The learning objective is what perimeter or area is, or why an area formula works — and manipulating the shape makes it visible: a sloping side changing while the perpendicular height does not, a fixed boundary enclosing different amounts of space, or an internal construction line helping the area but not the perimeter. Also use its static mode for any accurate, on-theme mensuration diagram inside teaching or exam content.',
    doNotUseWhen: 'The learner must be assessed on a calculation (compose a question component around a static instance instead); the task is executing a multi-step method rather than understanding a measure (CalculationBreakdown); or the content is circles, circumference, sectors, surface area or volume — none are implemented, and surface area and volume are explicitly out of scope for this component.',
    chooseInstead: 'Use AngleExplore for angle facts — do not add area or perimeter modes to it. Use CalculationBreakdown when the job is carrying out a method step by step rather than seeing why a formula holds. Use GraphView for interpreting data. Use a static figure image when no interaction is needed and the diagram is one-off.',
    contentShape: 'Pick the preset matching the idea and set focus to the one measure being taught; optionally fix value for a specific worked example. One diagram per screen, one measure at a time — compare is for the moment the difference between the two measures is the lesson, not a way to teach both at once.',
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
  }
}

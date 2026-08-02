// FractionRatioExplore — component catalogue record.
//
// Build-time governance data. This record is the single home for what the
// catalogue says about FractionRatioExplore; `docs/components/COMPONENT_REGISTRY.md`
// is generated from it. Run `pnpm catalogue:generate` after editing.

export default {
  id: 'fraction-ratio-explore',
  name: 'FractionRatioExplore',
  source: 'src/components/learning/FractionRatioExplore.jsx',
  exportName: null,
  order: 27,
  section: 'learning',
  kind: 'reusable',
  lifecycle: 'reviewing',
  lifecycleReason: 'Built and catalogued, but not yet routed for chapter authoring — pending component review.',
  purpose: 'Configuration-driven GCSE part-whole diagram — the fractions, ratio, proportion and percentage sibling of AngleExplore and AreaPerimeterExplore. One visual grammar runs through every preset: same whole (every bar in a preset shares one x and width; only the number of parts changes), divided parts (bars, 2D grids, circle sectors or discrete counters), linked representations (curved connectors plus a real stacked fraction glyph with a rule line, never 3/4 as flat text), and scaling both sides together (rungs joining two parallel lines, driven by one shared multiplier). That shared grammar is the point of the component: it is what lets a learner recognise 3/4, 3 : 1 and 75% as one idea rather than three topics. Eight registered presets — fractionBar, equivalentFractions, fractionOperations (add/subtract/multiply/divide/of-an-amount, each with its own step sequence), ratioShare, doubleNumberLine, percentageGrid, proportionScale, bestValue — plus a compatible-preset-object escape hatch. Three interaction kinds, all keyboard-operable: drag handles (role="slider", arrow keys / Home / End, ≥44px hit target), stepper rows (− / +, for small discrete counts where dragging on a phone would be cruel), and real buttons for discrete choice (methods, steps). method and step seed the diagram rather than locking it — the visible tabs and step buttons always move; interactive={false} is how you get a fixed teaching or exam figure. Respects prefers-reduced-motion (and a reducedMotion prop override).',
  ownership: {
    internalDirectories: [
      {
        path: 'src/components/learning/fractionRatio',
        reason: 'Pure part-whole maths, layout geometry, semantic colour roles and one file per preset, rendered only through FractionRatioExplore. Not separately selectable, and deliberately not an authoring choice.'
      }
    ],
    internalFiles: []
  },
  documentation: {
    bestUsedFor: 'The whole part-whole spine — fractions, equivalent fractions, simplifying, comparing, adding and subtracting, fractions of amounts, ratio as shares, ratio simplification, direct proportion, percentages and fraction–decimal–percentage conversion. Use it when the connection between representations is the learning, or when a method needs its intermediate states shown rather than just its answer. Questions, predictions, marking, scores and weakness tracking stay outside the component.',
    props: [
      'preset (name or preset object, defaults to fractionBar)',
      'method',
      'step',
      'value (controlled values object)',
      'defaultValue',
      'onChange',
      'onMethodChange',
      'onStepChange',
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
      'GENERAL (via fractionRatio/fractionRatioVisualRoles.js semantic roles)',
      'TYPE',
      'SPACING',
      'RADII',
      'MOTION (injected animation CSS via ensureStyles())',
      'pure maths in fractionRatio/fractionRatioMath.js',
      'pure layout in fractionRatio/fractionRatioGeometry.js (built on shared geometry/shapeGeometry.js)',
      'one file per preset under fractionRatio/presets/'
    ],
    usedBy: [],
    usageBoundary: null,
    contractDoc: null,
    story: 'src/components/learning/FractionRatioExplore.stories.jsx',
    governanceRules: [],
    notes: []
  },
  decision: {
    status: 'complete',
    useWhen: 'The learning objective is what a fraction, ratio, percentage or proportion is, or why a method works — and manipulating the whole makes it visible: parts multiplying while the shaded amount does not, two fractions whose parts are visibly different sizes, a total splitting into named shares, or two quantities that cannot move independently. Also use its static mode for any accurate, on-theme part-whole diagram inside teaching or exam content.',
    doNotUseWhen: 'The learner must be assessed on a calculation (compose a question component around a static instance instead); the task is executing a multi-step method with marking (CalculationBreakdown); the content is percentage change, reverse percentages, compound interest or inverse proportion (none are implemented); or the data is a dataset to interpret rather than a whole to divide (GraphView).',
    chooseInstead: 'Use AreaPerimeterExplore for mensuration — do not add fraction modes to it. Use AngleExplore for angle facts. Use CalculationBreakdown for executing a procedure step by step with a typed answer and marking. Use GraphView for interpreting supplied data, including pie charts.',
    contentShape: 'Pick the preset matching the idea, and set defaultValue for a specific worked example. One diagram per screen, one idea at a time — fractionOperations’ method tabs are a bank of related mechanics, not an invitation to teach five operations on one screen; set method to seed the one being taught.',
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

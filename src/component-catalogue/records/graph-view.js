// GraphView — component catalogue record.
//
// Build-time governance data. This record is the single home for what the
// catalogue says about GraphView; `docs/components/COMPONENT_REGISTRY.md`
// is generated from it. Run `pnpm catalogue:generate` after editing.

export default {
  id: 'graph-view',
  name: 'GraphView',
  source: 'src/components/learning/GraphView.jsx',
  exportName: null,
  order: 49,
  outOfRootReason: null,
  section: 'learning',
  kind: 'reusable',
  lifecycle: 'active',
  lifecycleReason: null,
  purpose: 'Embeddable SVG chart block — bar, line, scatter or pie — rendered inline within a content screen.',
  ownership: {
    internalDirectories: [],
    internalFiles: []
  },
  documentation: {
    bestUsedFor: 'Displaying GCSE Maths/Science data (frequency tables, linear and real-life graphs, scatter graphs with line of best fit, proportion and probability pie charts) alongside a question elsewhere on the screen. Purely a data display — it does not log to the weakness tracker itself.',
    props: [
      'block',
      'subject (defaults to Maths)'
    ],
    dataShape: "{ type: 'graphView', graphType: 'bar'|'line'|'scatter'|'pie', title?, caption?, xLabel?, yLabel?, data?: [{label, value}], points?: [{x, y}], lineOfBestFit?: {from: {x,y}, to: {x,y}}, xMin?, xMax?, yMin?, yMax? }",
    dependencies: [
      'SUBJECTS',
      'SPACING',
      'MOTION',
      'TYPE',
      'CardContainer'
    ],
    usedBy: [],
    usageBoundary: null,
    contractDoc: null,
    story: 'src/components/learning/GraphView.stories.jsx',
    governanceRules: [],
    notes: []
  },
  decision: {
    status: 'complete',
    useWhen: 'The learner needs to see a numerical relationship represented visually, such as quantities across categories, change over time, correlation between variables or proportion of a whole. Choose it when a graph communicates the pattern more clearly than prose or a list of numbers. GraphView displays the data; it does not assess the learner by itself.',
    doNotUseWhen: 'The information is qualitative, the values do not form a meaningful visual relationship or the graph is being added merely to make the screen appear academic. Do not use it for a conceptual system, a process diagram, a before-and-after image comparison or an activity that needs its own answer and scoring logic.',
    chooseInstead: 'Use Infographic for a conceptual model, labelled system or non-numerical summary. Use TimelineChain when stages or causal order matter more than numerical change. Use BeforeAfterImageSlider when the learner needs to inspect visual change between two states. Place GraphView alongside an appropriate quiz or exam-question component when the learner must interpret the data and submit a scored answer.',
    contentShape: 'One appropriate graph type: bar chart for comparing categories, line graph for continuous change or trends, scatter graph for relationships or correlation, or pie chart for proportions of a whole. Include a concise title and all labels, units, scales and legends needed to interpret the graph correctly. Keep the number of bars, points and labels manageable on mobile. Axes and intervals must be accurate and must not create a misleading impression. A line of best fit should appear only when it supports the intended scatter-graph learning. Pie-chart values must represent a coherent whole. Any interpretation prompt, calculation or scored response belongs to the surrounding learning or assessment component, not to GraphView itself.',
    rhythmRole: [
      'teaching'
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
        type: 'graphView',
        level: 'block',
        authoringName: 'Graph view',
        layout: 'content',
        status: 'active',
        replacement: null,
        required: [],
        requiredAny: [],
        continuation: 'player',
        headerMode: 'standard',
        handler: null
      }
    ]
  }
}

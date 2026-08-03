// OrderedRouteTask — component catalogue record.
//
// Build-time governance data. This record is the single home for what the
// catalogue says about OrderedRouteTask; `docs/components/COMPONENT_REGISTRY.md`
// is generated from it. Run `pnpm catalogue:generate` after editing.

export default {
  id: 'ordered-route-task',
  name: 'OrderedRouteTask',
  source: 'src/components/learning/OrderedRouteTask.jsx',
  exportName: null,
  order: 52,
  outOfRootReason: null,
  section: 'learning',
  kind: 'reusable',
  lifecycle: 'active',
  lifecycleReason: null,
  purpose: 'Ordered chain activity — one job card is shown at a time beneath the heading; the learner taps the stage on the numbered vertical route it belongs to. Correct taps lock the job beneath that stage immediately; wrong taps show a persistent clue-based hint ("Not here — look for the stage near railways.") and allow another tap. Route line, nodes and surfaces derive from the supplied subject’s accent.',
  ownership: {
    internalDirectories: [],
    internalFiles: []
  },
  documentation: {
    bestUsedFor: 'Recalling the steps or stages of a process in order — evacuation chains, scientific processes, historical sequences.',
    props: [
      'screen',
      'subject',
      'onComplete'
    ],
    dataShape: "{ type: 'orderedRouteTask', title, titleHighlight?, subtitle?, prompt?, weakGroup?, completionText?, backgroundImage?, stages: [{ id, icon, title, clue, answerId }] (icon: 'helmet'|'cross'|'hut'|'train'|'ship'), answers: [{ id, text }] }",
    dependencies: [
      'TYPE',
      'SPACING',
      'RADII',
      'MOTION',
      'SUBJECTS',
      'CinematicShell',
      'ContinueCTA',
      'unifiedWeaknessTracker'
    ],
    usedBy: [],
    usageBoundary: null,
    contractDoc: null,
    story: 'src/components/learning/OrderedRouteTask.stories.jsx',
    governanceRules: [],
    notes: [
      'Interaction: jobs are shuffled and presented one at a time; tap a stage row (a real button, keyboard-focusable) to place. The first wrong attempt per job logs a weakness; a clean first-attempt placement logs a correct answer. After the final placement the rebuilt chain stays on screen with completionText, then the governed ContinueCTA reveals — completion is learner-controlled, never automatic.',
      'Renamed from EvacuationChainRoute.'
    ]
  },
  decision: {
    status: 'complete',
    useWhen: 'The learner has already been taught a process or sequence and now needs to recall where each known event, action or stage belongs in the correct order.',
    doNotUseWhen: 'The sequence is still being introduced, the learner has not yet seen the stages clearly or the relationship between the items is unordered. Do not use it for matching pairs, category grouping or a chronology where several answers could reasonably fit the same position.',
    chooseInstead: 'Use TimelineChain to teach or explore the sequence first. Use ExplainReveal when the learner still needs to understand why one step leads to the next. Use MatchingTask when items form one-to-one pairs but order does not matter. Use ColSortBlock or SwipeSort when items belong within shared categories rather than numbered stages.',
    contentShape: 'A known sequence with clearly defined stages and one defensible position for every item. Stage headings should provide enough meaning for the learner to reason rather than guess. Items must be concise and should test understanding of the sequence, not reading endurance. Avoid ambiguous placement and stages that overlap substantially.',
    rhythmRole: [
      'practice',
      'retrieval'
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
        type: 'orderedRouteTask',
        level: 'screen',
        authoringName: 'Ordered route task',
        layout: 'full',
        status: 'active',
        replacement: null,
        required: [],
        requiredAny: [
          [
            {
              path: 'items',
              kind: 'array'
            },
            {
              path: 'steps',
              kind: 'array'
            },
            {
              path: 'cards',
              kind: 'array'
            },
            {
              path: 'stages',
              kind: 'array'
            }
          ]
        ],
        continuation: 'component',
        headerMode: 'standard',
        handler: null,
        pedagogy: {
          functions: [
            'sequence-process'
          ],
          interaction: 'assessed'
        }
      }
    ]
  }
}

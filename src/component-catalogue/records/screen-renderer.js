// ScreenRenderer — component catalogue record.
//
// Build-time governance data. This record is the single home for what the
// catalogue says about ScreenRenderer; `docs/components/COMPONENT_REGISTRY.md`
// is generated from it. Run `pnpm catalogue:generate` after editing.

export default {
  id: 'screen-renderer',
  name: 'ScreenRenderer',
  source: 'src/components/layout/ScreenRenderer.jsx',
  exportName: null,
  order: 72,
  outOfRootReason: null,
  section: 'layout',
  kind: 'runtime',
  lifecycle: 'active',
  lifecycleReason: null,
  purpose: 'The sole runtime boundary mapping registered screen and block types to approved components. FULL_SCREEN_RENDERER_TYPES and BLOCK_RENDERER_TYPES are proved equal to the active entries of SCREEN_REGISTRY / BLOCK_REGISTRY by tests/architecture/screen-registry.test.js.',
  ownership: {
    internalDirectories: [],
    internalFiles: []
  },
  documentation: {
    bestUsedFor: null,
    props: [
      'screen',
      'chapter',
      'chapterNum',
      'subject',
      'plus the runtime callbacks ChapterPlayer supplies'
    ],
    dataShape: null,
    dependencies: [
      'src/data/screenRegistry.js',
      'every routed learning and feedback component'
    ],
    usedBy: [],
    usageBoundary: 'Not an authoring choice. Authors select entries from screenRegistry.js, never ScreenRenderer directly.',
    contractDoc: null,
    story: null,
    governanceRules: [],
    notes: []
  },
  decision: null,
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
        type: 'examtip',
        level: 'block',
        authoringName: 'Exam tip',
        layout: 'content',
        status: 'active',
        replacement: null,
        required: [],
        requiredAny: [
          [
            {
              path: 'text',
              kind: 'string'
            },
            {
              path: 'tip',
              kind: 'string'
            }
          ]
        ],
        continuation: 'player',
        headerMode: 'standard',
        handler: 'ExamTipBlock'
      },
      {
        type: 'funfact',
        level: 'block',
        authoringName: 'Fun fact',
        layout: 'content',
        status: 'active',
        replacement: null,
        required: [
          {
            path: 'text',
            kind: 'string'
          }
        ],
        requiredAny: [],
        continuation: 'player',
        headerMode: 'standard',
        handler: 'FunFactBlock'
      },
      {
        type: 'hotspot',
        level: 'block',
        authoringName: 'Hotspot block',
        layout: 'content',
        status: 'active',
        replacement: null,
        required: [],
        requiredAny: [],
        continuation: 'player',
        headerMode: 'standard',
        handler: 'HotspotBlock'
      },
      {
        type: 'keypoint',
        level: 'block',
        authoringName: 'Key point',
        layout: 'content',
        status: 'active',
        replacement: null,
        required: [],
        requiredAny: [
          [
            {
              path: 'text',
              kind: 'string'
            },
            {
              path: 'points',
              kind: 'array'
            }
          ]
        ],
        continuation: 'player',
        headerMode: 'standard',
        handler: 'KeypointBlock'
      },
      {
        type: 'misconception',
        level: 'block',
        authoringName: 'Misconception reveal',
        layout: 'content',
        status: 'active',
        replacement: null,
        required: [
          {
            path: 'mistakes',
            kind: 'array'
          }
        ],
        requiredAny: [],
        continuation: 'player',
        headerMode: 'standard',
        handler: 'MisconceptionBlock'
      },
      {
        type: 'read',
        level: 'block',
        authoringName: 'Read block',
        layout: 'content',
        status: 'active',
        replacement: null,
        required: [
          {
            path: 'text',
            kind: 'string'
          }
        ],
        requiredAny: [],
        continuation: 'player',
        headerMode: 'standard',
        handler: 'ReadBlock'
      },
      {
        type: 'reveal',
        level: 'block',
        authoringName: 'Reveal block',
        layout: 'content',
        status: 'active',
        replacement: null,
        required: [
          {
            path: 'prompt',
            kind: 'string'
          },
          {
            path: 'answer',
            kind: 'string'
          }
        ],
        requiredAny: [],
        continuation: 'player',
        headerMode: 'standard',
        handler: 'RevealBlock'
      },
      {
        type: 'scenario',
        level: 'block',
        authoringName: 'Scenario block',
        layout: 'content',
        status: 'active',
        replacement: null,
        required: [],
        requiredAny: [
          [
            {
              path: 'scenarios',
              kind: 'array'
            },
            {
              path: 'situation',
              kind: 'string'
            }
          ]
        ],
        continuation: 'player',
        headerMode: 'standard',
        handler: 'ScenarioBlock'
      },
      {
        type: 'timeline',
        level: 'block',
        authoringName: 'Timeline block',
        layout: 'content',
        status: 'active',
        replacement: null,
        required: [
          {
            path: 'events',
            kind: 'array'
          }
        ],
        requiredAny: [],
        continuation: 'player',
        headerMode: 'standard',
        handler: 'TimelineBlock'
      },
      {
        type: 'standard',
        level: 'screen',
        authoringName: 'Standard content screen',
        layout: 'content',
        status: 'active',
        replacement: null,
        required: [
          {
            path: 'blocks',
            kind: 'array'
          }
        ],
        requiredAny: [],
        continuation: 'player',
        headerMode: 'standard',
        handler: 'ScreenContentRenderer'
      }
    ],
    nonAuthorableHandlers: [
      {
        name: 'ChapterSchemaError',
        reason: 'Development-time schema failure surface for a malformed chapter, rendered by ChapterPlayer rather than chosen by an author.'
      },
      {
        name: 'UnsupportedScreen',
        reason: 'Recovery surface shown when a screen type has no renderer route; it exists to report the defect, never to be authored.'
      },
      {
        name: 'UnsupportedBlock',
        reason: 'Recovery surface shown when a block type has no renderer route; it exists to report the defect, never to be authored.'
      },
      {
        name: 'LegacyUnroutedBlock',
        reason: 'Notice rendered in place of a retired block type that authored content still references; the compatibility registry governs which types reach it.'
      },
      {
        name: 'ScreenContentRenderer',
        reason: 'Named export implementing the standard content layout, already declared as the handler of the standard screen type.'
      }
    ]
  }
}

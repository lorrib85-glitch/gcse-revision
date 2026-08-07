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
    internalFiles: [
      {
        path: 'src/components/layout/deferredFigures.jsx',
        reason: 'Routing machinery, not an author choice: the lazy wrappers, per-block Suspense boundary and reserved-height fallback that let ScreenRenderer load the six figure renderers on demand. A learner never meets it as a component and an author never selects it.'
      },
      {
        path: 'src/components/layout/deferredFigureLoaders.js',
        reason: 'The stable per-component dynamic-import thunks behind those routes, kept free of React so the app shell can preload a chapter’s figures without pulling in the rendering layer. Implementation detail of the same routing boundary.'
      },
      {
        path: 'src/components/layout/deferredFigureComponentMap.js',
        reason: 'The authoring-type to lazy-component map for those routes, split out so the rendering module exports components only and keeps fast refresh. Read by the architecture guard rather than by the runtime, and part of the same private routing machinery.'
      }
    ]
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
    notes: [
      'ExamTipBlock is a passive exam-technique beat. It uses CardContainer cinematicOverlay, takes accent identity from canonical SUBJECTS, and follows docs/system/component-contracts/read-blocks.md; do not create subject-specific exam-tip variants or asset-dependent examiner scenes.'
    ]
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
        handler: 'ExamTipBlock',
        pedagogy: {
          functions: [
            'exam-technique'
          ],
          interaction: 'passive'
        }
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
        handler: 'FunFactBlock',
        pedagogy: {
          functions: [
            'hook-tension'
          ],
          interaction: 'passive'
        }
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
        handler: 'HotspotBlock',
        pedagogy: {
          functions: [
            'teach-mechanism'
          ],
          interaction: 'reveal'
        }
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
        handler: 'KeypointBlock',
        pedagogy: {
          functions: [
            'teach-mechanism'
          ],
          interaction: 'passive'
        }
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
        handler: 'MisconceptionBlock',
        pedagogy: {
          functions: [
            'exam-technique'
          ],
          interaction: 'reveal'
        }
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
        handler: 'ReadBlock',
        pedagogy: {
          functions: [
            'teach-mechanism'
          ],
          interaction: 'passive'
        }
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
        handler: 'RevealBlock',
        pedagogy: {
          functions: [
            'teach-mechanism'
          ],
          interaction: 'reveal'
        }
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
        handler: 'ScenarioBlock',
        pedagogy: {
          functions: [
            'apply'
          ],
          interaction: 'assessed'
        }
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
        handler: 'TimelineBlock',
        pedagogy: {
          functions: [
            'sequence-process'
          ],
          interaction: 'passive'
        }
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
        handler: 'ScreenContentRenderer',
        pedagogy: null,
        pedagogyExemption: {
          kind: 'container-derived',
          reason: 'The screen’s pedagogical classification is determined by its contained blocks.'
        }
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

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
    governanceRules: [
      'ExamTipBlock labels are sentence case and use TYPE.label; uppercase transforms and TYPE.eyebrow are forbidden.',
      'ExamTipBlock uses a short subject-accent rule instead of emoji or decorative iconography; supporting copy is separated by spacing rather than a divider.',
      'Optional phrases render as labelled, passive wording or answer-pattern lines, never pills, chips or controls; phrasesLabel names their purpose when the default Key wording label is not accurate.',
      'ExamTipBlock presentation consumes canonical TYPE, SPACING, GENERAL.examTechnique, GENERAL.contentSurface and SUBJECTS tokens; do not add local type sizing, line heights, spacing arithmetic, raw colours or opacity values.'
    ],
    notes: [
      'ExamTipBlock is a passive exam-technique beat. It uses CardContainer cinematicOverlay, takes accent identity from canonical SUBJECTS, and follows docs/system/component-contracts/read-blocks.md; do not create subject-specific exam-tip variants or asset-dependent examiner scenes.'
    ],
    authoringGuidance: {
      'block:examtip': {
        status: 'complete',
        bestUsedFor: 'A brief bridge from newly taught subject knowledge to the way that knowledge should be used to earn marks in an exam.',
        useWhen: 'A topic or concept has just been covered and the learner needs an immediate connection to its exam use — for example the relevant command word, what earns the marks, the detail that must be included or a common mistake that would waste marks. The block translates freshly learned knowledge into exam behaviour; it does not introduce new subject knowledge.',
        doNotUseWhen: 'The subject knowledge has not yet been taught, the learner needs a substantial explanation or worked method, the advice is generic and unrelated to the topic just covered, or several unrelated exam rules would be bundled together. Do not use it as a mini lesson or as a substitute for actual exam practice.',
        chooseInstead: 'Use WhatExaminersLookFor when the learner needs a fuller explanation of examiner priorities. Use GuidedExamResponse when they need support constructing an answer, FaceTheExaminer when they should judge and improve a prepared response, and ExamQuestionFrame when they are ready to practise independently.',
        contentShape: 'One exam-use rule tied directly to the topic just taught. Lead with the memorable rule; optionally add one short explanation or warning and a small number of labelled wording cues or answer-pattern lines. Use phrasesLabel when Key wording does not describe them accurately. Keep it passive, concise and specific enough that the learner can apply it to the next relevant exam question.'
      }
    }
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

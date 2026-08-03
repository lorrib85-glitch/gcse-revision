// ExaminerExplainsScreen — component catalogue record.
//
// Build-time governance data. This record is the single home for what the
// catalogue says about ExaminerExplainsScreen; `docs/components/COMPONENT_REGISTRY.md`
// is generated from it. Run `pnpm catalogue:generate` after editing.

export default {
  id: 'examiner-explains-screen',
  name: 'ExaminerExplainsScreen',
  source: 'src/components/learning/ExaminerExplainsScreen.jsx',
  exportName: null,
  order: 48,
  outOfRootReason: null,
  section: 'learning',
  kind: 'support',
  lifecycle: 'parked',
  lifecycleReason: 'Superseded by WhatExaminersLookFor and retained only so existing routes and authored legacy content do not break during migration.',
  purpose: 'A re-export of WhatExaminersLookFor. It exists so existing routes and authored content referencing the legacy examinerExplains screen type do not break during migration.',
  ownership: {
    internalDirectories: [],
    internalFiles: []
  },
  documentation: {
    bestUsedFor: null,
    props: [],
    dataShape: null,
    dependencies: [],
    usedBy: [],
    usageBoundary: 'Legacy compatibility only. Do not select or author it as a separate learning component; new code and content must use WhatExaminersLookFor. It is catalogued here because the file still exists — not because it is an available choice.',
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
        type: 'examinerExplains',
        level: 'screen',
        authoringName: 'What examiners look for',
        layout: 'full',
        status: 'active',
        replacement: null,
        required: [],
        requiredAny: [],
        continuation: 'component',
        headerMode: 'standard',
        handler: null,
        pedagogy: {
          functions: [
            'exam-technique'
          ],
          interaction: 'passive'
        }
      }
    ]
  }
}

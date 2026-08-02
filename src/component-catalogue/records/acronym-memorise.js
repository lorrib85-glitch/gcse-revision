// AcronymMemorise — component catalogue record.
//
// Build-time governance data. This record is the single home for what the
// catalogue says about AcronymMemorise; `docs/components/COMPONENT_REGISTRY.md`
// is generated from it. Run `pnpm catalogue:generate` after editing.

export default {
  id: 'acronym-memorise',
  name: 'AcronymMemorise',
  source: 'src/components/learning/AcronymMemorise.jsx',
  exportName: null,
  order: 24,
  scope: {
    location: 'components',
    reason: null
  },
  section: 'learning',
  kind: 'reusable',
  lifecycle: 'active',
  lifecycleReason: null,
  purpose: 'An interactive mnemonic component that introduces an acronym, lets the learner reveal what each letter represents and then switches into an unscored self-test mode in which the answers are hidden again. The learner is prompted to say each meaning before tapping to check it.',
  ownership: {
    internalDirectories: [],
    internalFiles: []
  },
  documentation: {
    bestUsedFor: 'Learning a short, stable set of related ideas that can be encoded naturally through their initial letters.',
    props: [
      'block',
      'subject'
    ],
    dataShape: "{ type: 'acronymMemorise', intro?, memoryTarget?, instruction?, showIntro?, readyText?, testInstruction?, testPrompt?, testCompleteText?, testCtaLabel?, learnCtaLabel?, testRowPrompt?, subject?, items: [{ id?, letter, word, detail }] }",
    dependencies: [
      'GENERAL',
      'SPACING',
      'SUBJECTS',
      'TYPE',
      'ScreenIntro'
    ],
    usedBy: [],
    usageBoundary: null,
    contractDoc: null,
    story: null,
    governanceRules: [
      'The self-test is useful retrieval practice, but it is not scored evidence of mastery. Opening every item only shows that the learner checked the answers; it does not prove that they recalled them correctly. Do not feed completion of AcronymMemorise into the weakness tracker as a correct result.'
    ],
    notes: []
  },
  decision: {
    status: 'complete',
    useWhen: 'A short set of related terms can be represented by a memorable acronym without distorting the subject knowledge. Choose it when recalling the initial letters genuinely helps the learner reconstruct the complete set.',
    doNotUseWhen: 'The words have been awkwardly rewritten merely to force an acronym, the order has no stable meaning or each item requires substantial explanation. Do not use it for causal chains, chronological stages, independent question-and-answer pairs or every list the learner encounters.',
    chooseInstead: 'Use MemoryHook when one concept needs one analogy or association rather than a multi-letter mnemonic. Use TimelineChain or OrderedRouteTask when the sequence itself matters. Use QuickRecallScreen when recall should be objectively marked and recorded. Use MatchingTask when the learner must connect independent terms with corresponding meanings.',
    contentShape: 'Normally three to seven letters forming a pronounceable, familiar or otherwise memorable acronym. Every letter must map clearly to one concise word or phrase, followed by a short explanation of why that item matters. The displayed words must remain academically accurate rather than being stretched to fit the letters. The test mode should require recall before reveal, not simply invite repeated tapping.',
    rhythmRole: [
      'teaching',
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
  }
}

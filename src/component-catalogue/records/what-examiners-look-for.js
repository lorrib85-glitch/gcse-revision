// WhatExaminersLookFor — component catalogue record.
//
// Build-time governance data. This record is the single home for what the
// catalogue says about WhatExaminersLookFor; `docs/components/COMPONENT_REGISTRY.md`
// is generated from it. Run `pnpm catalogue:generate` after editing.

export default {
  id: 'what-examiners-look-for',
  name: 'WhatExaminersLookFor',
  source: 'src/components/learning/WhatExaminersLookFor.jsx',
  exportName: null,
  order: 47,
  outOfRootReason: null,
  section: 'learning',
  kind: 'reusable',
  lifecycle: 'active',
  lifecycleReason: null,
  purpose: 'A short pre-question examiner briefing. It introduces the upcoming exam skill, progressively reveals up to three high-value priorities and closes with one practical takeaway the learner can use while writing. It does not mark, annotate or score an answer.',
  ownership: {
    internalDirectories: [],
    internalFiles: []
  },
  documentation: {
    bestUsedFor: 'Preparing the learner immediately before independent or guided exam practice by clarifying the small number of things the examiner will reward most.',
    props: [
      'subject',
      'whatExaminersLookFor',
      'examinerExplains',
      'title',
      'label',
      'showBack',
      'onBack',
      'onContinue'
    ],
    dataShape: '{ introduction?, context?, priorities?: [{ id?, title?, explanation? }], takeaway? } — legacy examinerExplains data may still use opening, tips and closing while content migrates.',
    dependencies: [
      'CinematicShell',
      'BackButton',
      'ContinueCTA',
      'ScreenTitle',
      'SUBJECTS',
      'SUBJECT_BACKDROPS',
      'GENERAL',
      'TYPE',
      'SPACING',
      'MOTION'
    ],
    usedBy: [],
    usageBoundary: null,
    contractDoc: null,
    story: null,
    governanceRules: [],
    notes: []
  },
  decision: {
    status: 'complete',
    useWhen: 'The learner is about to attempt an exam question and needs a concise reminder of the specific behaviours the examiner rewards, such as selecting precise evidence, explaining a link, analysing a method or supporting a judgement.',
    doNotUseWhen: 'The learner has already completed the response, feedback must react to their actual writing, the advice is a generic revision tip or the success criteria require substantial teaching rather than a short briefing. Do not turn it into a dense mark-scheme dump.',
    chooseInstead: 'Use ExamQuestionFrame when the learner should now write independently. Use FaceTheExaminer when they should inspect and improve an existing answer. Use GuidedExamResponse when they need structured support while constructing the response. Use a normal teaching component when the exam skill itself has not yet been explained clearly enough for three priorities to be useful.',
    contentShape: 'One short introduction, usually two or three actionable priorities and one closing takeaway. Every priority must be specific enough to apply during the immediately following question and important enough to affect marks. Avoid vague encouragement, duplicated criteria and lengthy mark-scheme language.',
    rhythmRole: [
      'teaching',
      'practice'
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

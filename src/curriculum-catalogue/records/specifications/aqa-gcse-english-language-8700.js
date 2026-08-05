// ─── AQA GCSE English Language (8700) ──────────────────────────────────────
//
// The specification that forced weightings to allow 0%.
//
// AO7–AO9 are real, examined assessment objectives. They are assessed through
// the Spoken Language endorsement, which is separately reported and does not
// contribute to the qualification grade — so each is worth 0% of it. The old
// rule required every weighting to be above 0, which left only two ways to
// author this specification, both dishonest: drop three objectives, or invent
// percentages for them.
//
// Spoken Language is likewise a component, not a paper wearing a disguise. It
// is `nea-endorsement` and states no duration and no marks, because it has
// none to state.

import { verified } from '../provenance.js'

const ENDORSEMENT_NOTE = 'Assessed through the separately reported Spoken Language endorsement, '
  + 'which does not contribute to the qualification grade.'

export default {
  id: 'aqa-gcse-english-language-8700',
  boardId: 'aqa',
  qualification: 'gcse',
  code: '8700',
  title: 'GCSE English Language',
  subjectIds: ['english-language'],
  tiers: [],

  papers: [
    {
      id: 'aqa-gcse-english-language-8700-paper-1',
      title: 'Paper 1: explorations in creative reading and writing',
      position: 0,
      subjectId: 'english-language',
      assessmentType: 'written-exam',
      durationMinutes: 105,
      totalMarks: 80,
    },
    {
      id: 'aqa-gcse-english-language-8700-paper-2',
      title: "Paper 2: writers' viewpoints and perspectives",
      position: 1,
      subjectId: 'english-language',
      assessmentType: 'written-exam',
      durationMinutes: 105,
      totalMarks: 80,
    },
    {
      id: 'aqa-gcse-english-language-8700-spoken-language',
      title: 'Spoken language',
      position: 2,
      subjectId: 'english-language',
      assessmentType: 'nea-endorsement',
      note: 'Separately reported endorsement with no fixed duration and no marks. '
        + 'It carries AO7–AO9 and contributes nothing to the qualification grade.',
    },
  ],

  assessmentObjectives: [
    { id: 'ao1', title: 'Identify and interpret information and ideas', weightings: { overall: 10 } },
    { id: 'ao2', title: 'Analyse language and structure', weightings: { overall: 17.5 } },
    { id: 'ao3', title: "Compare writers' ideas and perspectives", weightings: { overall: 10 } },
    { id: 'ao4', title: 'Evaluate texts critically', weightings: { overall: 12.5 } },
    { id: 'ao5', title: 'Communicate clearly and imaginatively', weightings: { overall: 30 } },
    { id: 'ao6', title: 'Vocabulary, sentence structure, spelling and punctuation', weightings: { overall: 20 } },
    { id: 'ao7', title: 'Presentation skills', weightings: { overall: 0 }, note: ENDORSEMENT_NOTE },
    { id: 'ao8', title: 'Listening and responding', weightings: { overall: 0 }, note: ENDORSEMENT_NOTE },
    { id: 'ao9', title: 'Spoken Standard English', weightings: { overall: 0 }, note: ENDORSEMENT_NOTE },
  ],

  selectionGroups: [],

  requirements: [],
  requirementCoverage: 'none',

  status: 'current',
  firstTeaching: '2015',
  firstAssessment: '2017',
  withdrawnFrom: null,

  provenance: verified(
    'AQA GCSE English Language (8700) — Scheme of assessment',
    'https://www.aqa.org.uk/subjects/english/gcse/english-8700/specification/scheme-of-assessment',
  ),
}

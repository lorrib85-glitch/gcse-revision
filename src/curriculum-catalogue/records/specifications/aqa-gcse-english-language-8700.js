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

  // AQA's published wording, verbatim. These are the sentences the mark schemes
  // are written against, so a paraphrase would quietly become a different
  // objective the moment anyone taught from it.
  assessmentObjectives: [
    {
      id: 'ao1',
      title: 'Identify and interpret explicit and implicit information and ideas; '
        + 'select and synthesise evidence from different texts.',
      weightings: { overall: 10 },
    },
    {
      id: 'ao2',
      title: 'Explain, comment on and analyse how writers use language and structure to '
        + 'achieve effects and influence readers, using relevant subject terminology to '
        + 'support their views.',
      weightings: { overall: 17.5 },
    },
    {
      id: 'ao3',
      title: 'Compare writers’ ideas and perspectives, as well as how these are conveyed, '
        + 'across two or more texts.',
      weightings: { overall: 10 },
    },
    {
      id: 'ao4',
      title: 'Evaluate texts critically and support this with appropriate textual references.',
      weightings: { overall: 12.5 },
    },
    {
      id: 'ao5',
      title: 'Communicate clearly, effectively and imaginatively, selecting and adapting tone, '
        + 'style and register for different forms, purposes and audiences. Organise information '
        + 'and ideas, using structural and grammatical features to support coherence and '
        + 'cohesion of texts.',
      weightings: { overall: 30 },
    },
    {
      id: 'ao6',
      title: 'Candidates must use a range of vocabulary and sentence structures for clarity, '
        + 'purpose and effect, with accurate spelling and punctuation.',
      weightings: { overall: 20 },
    },
    {
      id: 'ao7',
      title: 'Demonstrate presentation skills in a formal setting.',
      weightings: { overall: 0 },
      note: ENDORSEMENT_NOTE,
    },
    {
      id: 'ao8',
      title: 'Listen and respond appropriately to spoken language, including to questions and '
        + 'feedback on presentations.',
      weightings: { overall: 0 },
      note: ENDORSEMENT_NOTE,
    },
    {
      id: 'ao9',
      title: 'Use spoken Standard English effectively in speeches and presentations.',
      weightings: { overall: 0 },
      note: ENDORSEMENT_NOTE,
    },
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

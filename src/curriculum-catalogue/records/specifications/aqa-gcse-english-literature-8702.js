// ─── AQA GCSE English Literature (8702) ────────────────────────────────────
//
// Four set-text choices a school makes and this catalogue does not. The
// specification states WHAT must be chosen and which paper assesses it; a
// study pathway records WHAT WAS chosen. Nothing selects a text here, so all
// four groups are deliberately unresolved.

import { verified } from '../provenance.js'

const PAPER_1 = 'aqa-gcse-english-literature-8702-paper-1'
const PAPER_2 = 'aqa-gcse-english-literature-8702-paper-2'

export default {
  id: 'aqa-gcse-english-literature-8702',
  boardId: 'aqa',
  qualification: 'gcse',
  code: '8702',
  title: 'GCSE English Literature',
  subjectIds: ['english-literature'],
  tiers: [],

  papers: [
    {
      id: PAPER_1,
      title: 'Paper 1: Shakespeare and the 19th-century novel',
      position: 0,
      subjectId: 'english-literature',
      assessmentType: 'written-exam',
      durationMinutes: 105,
      totalMarks: 64,
    },
    {
      id: PAPER_2,
      title: 'Paper 2: modern texts and poetry',
      position: 1,
      subjectId: 'english-literature',
      assessmentType: 'written-exam',
      durationMinutes: 135,
      totalMarks: 96,
    },
  ],

  assessmentObjectives: [
    { id: 'ao1', title: 'Response to texts', weightings: { overall: 37.5 } },
    { id: 'ao2', title: 'Language, form and structure', weightings: { overall: 42.5 } },
    { id: 'ao3', title: 'Contexts', weightings: { overall: 15 } },
    { id: 'ao4', title: 'Vocabulary and accuracy', weightings: { overall: 5 } },
  ],

  selectionGroups: [
    {
      id: 'shakespeare-text',
      title: 'Shakespeare text',
      paperId: PAPER_1,
      required: true,
    },
    {
      id: 'nineteenth-century-novel',
      title: '19th-century novel',
      paperId: PAPER_1,
      required: true,
    },
    {
      id: 'modern-text',
      title: 'Modern text',
      paperId: PAPER_2,
      required: true,
    },
    {
      id: 'poetry-anthology-cluster',
      title: 'Poetry anthology cluster',
      paperId: PAPER_2,
      required: true,
    },
  ],

  requirements: [],
  requirementCoverage: 'none',

  status: 'current',
  firstTeaching: '2015',
  firstAssessment: '2017',
  withdrawnFrom: null,

  provenance: verified(
    'AQA GCSE English Literature (8702) — Specification at a glance',
    'https://www.aqa.org.uk/subjects/english/gcse/english-8702/specification/specification-at-a-glance',
  ),
}

// ─── AQA GCSE Biology (8461) ───────────────────────────────────────────────
//
// The separate ("triple") Biology qualification. It shares its assessment
// objectives with Combined Science but is its own specification with its own
// papers, so nothing here is derived from 8464.

import { verified } from '../provenance.js'

export default {
  id: 'aqa-gcse-biology-8461',
  boardId: 'aqa',
  qualification: 'gcse',
  code: '8461',
  title: 'GCSE Biology',
  subjectIds: ['biology'],
  tiers: ['foundation', 'higher'],

  papers: [
    {
      id: 'aqa-gcse-biology-8461-paper-1',
      title: 'Paper 1',
      position: 0,
      subjectId: 'biology',
      assessmentType: 'written-exam',
      durationMinutes: 105,
      totalMarks: 100,
    },
    {
      id: 'aqa-gcse-biology-8461-paper-2',
      title: 'Paper 2',
      position: 1,
      subjectId: 'biology',
      assessmentType: 'written-exam',
      durationMinutes: 105,
      totalMarks: 100,
    },
  ],

  // Identical in both tiers, so stated once.
  assessmentObjectives: [
    { id: 'ao1', title: 'Knowledge and understanding', weightings: { overall: 40 } },
    { id: 'ao2', title: 'Application', weightings: { overall: 40 } },
    {
      id: 'ao3',
      title: 'Analysis, evaluation and experimental procedures',
      weightings: { overall: 20 },
    },
  ],

  selectionGroups: [],

  requirements: [],
  requirementCoverage: 'none',

  status: 'current',
  firstTeaching: '2016',
  firstAssessment: '2018',
  withdrawnFrom: null,

  provenance: verified(
    'AQA GCSE Biology (8461) — Specification at a glance',
    'https://www.aqa.org.uk/subjects/biology/gcse/biology-8461/specification/specification-at-a-glance',
  ),
}

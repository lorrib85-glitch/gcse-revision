// ─── AQA GCSE Sociology (8192) ─────────────────────────────────────────────
//
// Untiered, two written papers of equal weight, no set-text or option choices
// for a study pathway to resolve.

import { verified } from '../provenance.js'

export default {
  id: 'aqa-gcse-sociology-8192',
  boardId: 'aqa',
  qualification: 'gcse',
  code: '8192',
  title: 'GCSE Sociology',
  subjectIds: ['sociology'],
  tiers: [],

  papers: [
    {
      id: 'aqa-gcse-sociology-8192-paper-1',
      title: 'Paper 1: the sociology of families and education',
      position: 0,
      subjectId: 'sociology',
      assessmentType: 'written-exam',
      durationMinutes: 105,
      totalMarks: 100,
    },
    {
      id: 'aqa-gcse-sociology-8192-paper-2',
      title: 'Paper 2: the sociology of crime and deviance and social stratification',
      position: 1,
      subjectId: 'sociology',
      assessmentType: 'written-exam',
      durationMinutes: 105,
      totalMarks: 100,
    },
  ],

  assessmentObjectives: [
    { id: 'ao1', title: 'Knowledge and understanding', weightings: { overall: 40 } },
    { id: 'ao2', title: 'Application', weightings: { overall: 40 } },
    { id: 'ao3', title: 'Analysis and evaluation', weightings: { overall: 20 } },
  ],

  selectionGroups: [],

  requirements: [],
  requirementCoverage: 'none',

  status: 'current',
  firstTeaching: '2017',
  firstAssessment: '2019',
  withdrawnFrom: null,

  provenance: verified(
    'AQA GCSE Sociology (8192) — Specification at a glance',
    'https://www.aqa.org.uk/subjects/sociology/gcse/sociology-8192/specification/specification-at-a-glance',
  ),
}

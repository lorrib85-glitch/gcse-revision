// ─── Pearson Edexcel GCSE (9–1) History (1HI0) ─────────────────────────────
//
// The specification behind the Medicine Through Time chapters, recorded here
// as a whole qualification rather than as the one option the app teaches.
// Four option choices sit unresolved: the paper codes are ranges (1HI0/10–13,
// 1HI0/2A–2W, 1HI0/30–33) precisely because the code depends on the option a
// school picks, and a school's pick is a study pathway's fact, not this one's.
//
// Timings are Issue 6.

import { verified } from '../provenance.js'

const PAPER_1 = 'pearson-edexcel-gcse-history-1hi0-paper-1'
const PAPER_2 = 'pearson-edexcel-gcse-history-1hi0-paper-2'
const PAPER_3 = 'pearson-edexcel-gcse-history-1hi0-paper-3'

export default {
  id: 'pearson-edexcel-gcse-history-1hi0',
  boardId: 'pearson-edexcel',
  qualification: 'gcse',
  code: '1HI0',
  title: 'Pearson Edexcel Level 1/Level 2 GCSE (9–1) in History',
  subjectIds: ['history'],
  tiers: [],

  papers: [
    {
      id: PAPER_1,
      code: '1HI0/10–13',
      title: 'Paper 1: thematic study and historic environment',
      position: 0,
      subjectId: 'history',
      assessmentType: 'written-exam',
      durationMinutes: 80,
      totalMarks: 52,
    },
    {
      id: PAPER_2,
      code: '1HI0/2A–2W',
      title: 'Paper 2: period study and British depth study',
      position: 1,
      subjectId: 'history',
      assessmentType: 'written-exam',
      durationMinutes: 110,
      totalMarks: 64,
    },
    {
      id: PAPER_3,
      code: '1HI0/30–33',
      title: 'Paper 3: modern depth study',
      position: 2,
      subjectId: 'history',
      assessmentType: 'written-exam',
      durationMinutes: 90,
      totalMarks: 52,
    },
  ],

  assessmentObjectives: [
    { id: 'ao1', title: 'Knowledge and understanding', weightings: { overall: 35 } },
    { id: 'ao2', title: 'Second-order concepts', weightings: { overall: 35 } },
    { id: 'ao3', title: 'Contemporary sources', weightings: { overall: 15 } },
    { id: 'ao4', title: 'Historical interpretations', weightings: { overall: 15 } },
  ],

  selectionGroups: [
    {
      id: 'thematic-study-and-historic-environment',
      title: 'Thematic study and historic environment',
      paperId: PAPER_1,
      required: true,
    },
    {
      id: 'period-study',
      title: 'Period study',
      paperId: PAPER_2,
      required: true,
    },
    {
      id: 'british-depth-study',
      title: 'British depth study',
      paperId: PAPER_2,
      required: true,
    },
    {
      id: 'modern-depth-study',
      title: 'Modern depth study',
      paperId: PAPER_3,
      required: true,
    },
  ],

  requirements: [],
  requirementCoverage: 'none',

  status: 'current',
  firstTeaching: '2016',
  firstAssessment: '2018',
  withdrawnFrom: null,

  provenance: verified(
    'Pearson Edexcel Level 1/Level 2 GCSE (9–1) in History (1HI0), Specification Issue 6, June 2024',
    'https://qualifications.pearson.com/content/dam/pdf/GCSE/History/2016/specification-and-sample-assessments/gcse-9-1-history-specification.pdf',
  ),
}

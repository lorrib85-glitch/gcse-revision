// ─── AQA GCSE Combined Science: Trilogy (8464) ─────────────────────────────
//
// The specification that proves coverage is not ownership. One qualification
// covers three disciplines and is assessed by six papers, two per discipline,
// each paper naming the subject it assesses. No subject owns this record — if
// one did, Biology, Chemistry or Physics would have to claim the other two.
//
// Tiered, but the objectives do not differ by tier: 40/40/20 in both. That is
// authored once as `overall`, not twice as identical tier entries.

import { verified } from '../provenance.js'

const DISCIPLINES = ['biology', 'chemistry', 'physics']
const DISCIPLINE_TITLES = { biology: 'Biology', chemistry: 'Chemistry', physics: 'Physics' }

const papers = DISCIPLINES.flatMap((subjectId, discipline) => [1, 2].map(number => ({
  id: `aqa-gcse-combined-science-trilogy-8464-${subjectId}-paper-${number}`,
  title: `${DISCIPLINE_TITLES[subjectId]} paper ${number}`,
  position: discipline * 2 + number - 1,
  subjectId,
  assessmentType: 'written-exam',
  durationMinutes: 75,
  totalMarks: 70,
})))

export default {
  id: 'aqa-gcse-combined-science-trilogy-8464',
  boardId: 'aqa',
  qualification: 'gcse',
  code: '8464',
  title: 'GCSE Combined Science: Trilogy',
  subjectIds: DISCIPLINES,
  tiers: ['foundation', 'higher'],

  papers,

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
    'AQA GCSE Combined Science: Trilogy (8464) — Specification at a glance',
    'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/specification-at-a-glance',
  ),
}

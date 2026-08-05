// ─── AQA GCSE Mathematics (8300) ───────────────────────────────────────────
//
// The specification that forced `weightings` to carry a scope. Foundation and
// Higher assess the same three objectives at different percentages —
// 50/25/25 against 40/30/30 — so a single number would misdescribe one tier
// whichever tier it recorded. This is one specification with two tiers, not
// two specifications.

import { verified } from '../provenance.js'

const paper = (position, calculator) => ({
  id: `aqa-gcse-mathematics-8300-paper-${position + 1}`,
  title: `Paper ${position + 1}: ${calculator}`,
  position,
  subjectId: 'mathematics',
  assessmentType: 'written-exam',
  durationMinutes: 90,
  totalMarks: 80,
})

export default {
  id: 'aqa-gcse-mathematics-8300',
  boardId: 'aqa',
  qualification: 'gcse',
  code: '8300',
  title: 'GCSE Mathematics',
  subjectIds: ['mathematics'],
  tiers: ['foundation', 'higher'],

  papers: [
    paper(0, 'non-calculator'),
    paper(1, 'calculator'),
    paper(2, 'calculator'),
  ],

  assessmentObjectives: [
    { id: 'ao1', title: 'Standard techniques', weightings: { foundation: 50, higher: 40 } },
    { id: 'ao2', title: 'Reasoning and communication', weightings: { foundation: 25, higher: 30 } },
    { id: 'ao3', title: 'Problem solving', weightings: { foundation: 25, higher: 30 } },
  ],

  selectionGroups: [],

  // Requirement mapping belongs to a later stage. Saying so is the point of the
  // field: an empty list that claimed completeness would be the lie.
  requirements: [],
  requirementCoverage: 'none',

  status: 'current',
  firstTeaching: '2015',
  firstAssessment: '2017',
  withdrawnFrom: null,

  provenance: verified(
    'AQA GCSE Mathematics (8300) — Specification at a glance; Scheme of assessment',
    'https://www.aqa.org.uk/subjects/mathematics/gcse/mathematics-8300/specification/scheme-of-assessment',
  ),
}

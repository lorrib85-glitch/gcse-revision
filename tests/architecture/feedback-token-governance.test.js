import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { globSync } from 'glob'

const root = resolve(process.cwd())
const read = (rel) => readFileSync(resolve(root, rel), 'utf8')

// A7 (architecture-backlog.md): GENERAL.success/successSoft/error/errorSoft are
// SYSTEM-STATUS tokens. GENERAL.feedbackCorrect/feedbackIncorrect are
// LEARNING-FEEDBACK tokens. The two must not blur — an unreachable grading
// server and a wrong answer must not render as the same event.
//
// This guard is deliberately NOT a repo-wide ban on the system tokens. Every
// remaining call site below was read and classified; the census pins the exact
// count per file so a Category 1 site cannot quietly regress to a system token,
// and a brand-new unclassified usage anywhere in src/ fails the census.
//
// Categories:
//   2 — system / operational status (API failure, validation, dev-lab errors)
//   3 — performance band (Excellent / Good / Developing / Needs Work)
//
// Phase 6 note: this census used to carry two more entries —
// modes/MathsQuestion.jsx and QuickFire.jsx, each holding one Cat 2 strip. Both
// blocks lived inside the obsolete QuickFire subject-selection landing, which
// Phase 6 deleted along with MathsQuestion.jsx itself. Their allowances are
// removed rather than zeroed: a zero-value entry would licence the tokens back
// into files that no longer use them. The Cat 1 / Cat 2 / Cat 3 distinction is
// unchanged — only the live surface got smaller.
const LEGACY_TOKEN_CENSUS = {
  'src/features/quickfire/utils.js': {
    success: 1, successSoft: 2, error: 2, errorSoft: 0,
    why: 'Cat 3 — GRADE_COLOURS performance bands. A band summarises how well a whole answer scored; it is neither binary answer feedback nor system state, and stays on these tokens by review.',
  },
  'src/dev/componentReview/ComponentReviewLab.jsx': {
    success: 0, successSoft: 0, error: 2, errorSoft: 0,
    why: 'Cat 2 — dev-only lab: "unused" status chip and the render error boundary. Not a learner surface.',
  },
  'src/components/learning/QuoteAnalyser.jsx': {
    success: 0, successSoft: 0, error: 0, errorSoft: 1,
    why: 'Cat 2 — checkError: request timeout / API failure while checking an interpretation, not the interpretation verdict itself.',
  },
  'src/components/learning/GuidedExamResponse.jsx': {
    success: 0, successSoft: 0, error: 1, errorSoft: 1,
    why: 'Cat 2 — "Marking failed — your response hasn\'t been lost." The marking request failed; no marking verdict was produced.',
  },
}

const TOKENS = ['success', 'successSoft', 'error', 'errorSoft']

const countToken = (src, token) =>
  (src.match(new RegExp(`GENERAL\\.${token}\\b`, 'g')) || []).length

const srcFiles = globSync('src/**/*.{jsx,js}', {
  cwd: root,
  ignore: ['**/node_modules/**'],
})

describe('Legacy system-status tokens stay censused', () => {
  it('no file outside the reviewed census uses GENERAL.success/error', () => {
    const offenders = srcFiles.filter(
      (rel) =>
        !(rel in LEGACY_TOKEN_CENSUS) &&
        !rel.endsWith('src/constants/generalTheme.js') &&
        TOKENS.some((t) => countToken(read(rel), t) > 0),
    )
    expect(
      offenders,
      `Unclassified GENERAL.success/error usage. Classify it (A7 categories) and add it to LEGACY_TOKEN_CENSUS, or use GENERAL.feedbackCorrect/feedbackIncorrect if it is answer feedback: ${offenders.join(', ')}`,
    ).toEqual([])
  })

  for (const [rel, expected] of Object.entries(LEGACY_TOKEN_CENSUS)) {
    it(`${rel} keeps exactly its reviewed system-token count`, () => {
      const src = read(rel)
      const actual = Object.fromEntries(TOKENS.map((t) => [t, countToken(src, t)]))
      expect(
        actual,
        `System-token count changed in ${rel}. Reviewed rationale: ${expected.why}`,
      ).toEqual(Object.fromEntries(TOKENS.map((t) => [t, expected[t]])))
    })
  }
})

// Category 1 — AI-marked written feedback. These two labels tell a learner what
// their answer achieved and missed, so they must render on the calm canonical
// feedback tokens, never on the loud system ones. Anchored to the visible copy:
// the label and its colour are authored on the same line.
//
// This is the semantic half of the guard. The census above is the count half —
// it catches a regression that keeps the same number of legacy tokens while
// swapping which role uses them.
//
// Phase 6 made this a repo-wide scan rather than a two-file allowlist. Both
// files it named (QuickFire.jsx's ChemistryTopicView and modes/MathsQuestion.jsx)
// were part of the deleted subject-selection landing, so no live surface renders
// this copy on the canonical feedback tokens today. Scanning src/ keeps the rule
// enforceable wherever AI marking reappears, instead of pinning it to files that
// no longer exist.
//
// The assertion is the ban, not a positive requirement: A7's rule is that a
// marking verdict must never wear a system-status colour. TopicPracticeMode.jsx
// renders the same two labels on GENERAL.teal/slate — a calm, non-system palette
// that satisfies the rule. Re-tinting it is a feedback-colour decision, out of
// scope here, so the guard does not force feedbackCorrect/feedbackIncorrect onto
// every occurrence.
const FEEDBACK_LABELS = [
  { copy: 'What you got right', token: 'feedbackCorrect' },
  { copy: 'Next time, also include', token: 'feedbackIncorrect' },
]

describe('AI-marked answer feedback never uses system-status tokens', () => {
  for (const { copy, token } of FEEDBACK_LABELS) {
    it(`no "${copy}" label renders on a system-status token`, () => {
      const offenders = srcFiles.filter((rel) =>
        read(rel)
          .split('\n')
          .some(
            (line) =>
              line.includes(copy) &&
              /GENERAL\.(success|successSoft|error|errorSoft)\b/.test(line),
          ),
      )
      expect(
        offenders,
        `"${copy}" is learner marking feedback — it must not share a colour with an ` +
        `unreachable grading server. Use GENERAL.${token} (or another non-system ` +
        `token): ${offenders.join(', ')}`,
      ).toEqual([])
    })
  }
})

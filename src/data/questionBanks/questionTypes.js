// `format` = how the learner responds and how the question is rendered.
// `type`   = the assessment / marking family the answer is judged against.
// The two are not interchangeable. See docs/system/QUESTION_BANK_CONTRACT.md.

export const FORMAT = {
  MC: 'mc',
  MC_MULTI: 'mc_multi',
  WRITTEN: 'written',
  TRUE_FALSE: 'truefalse',
}

export const DIFFICULTY = {
  RECALL: 1,
  STANDARD: 2,
  EXPLAIN: 3,
  EXTENDED: 4,
  STRETCH: 5,
}

export const EXAM_TYPE = {
  DESCRIBE_TWO: 'describe-two-features',
  EXPLAIN_WHY: 'explain-why',
  HOW_FAR: 'how-far-do-you-agree',
  SOURCE_UTILITY: 'source-utility',
  SOURCE_FOLLOW_UP: 'source-follow-up',
  EXPLAIN_SIMILAR: 'explain-similar-different',
  MC: 'mc',
  // Generic written family: a marked prose answer with no command-specific
  // mark-scheme family of its own. Used by every written science/maths/English
  // bank question and by the June 2023 Section A/B questions that predate the
  // command-specific families above.
  WRITTEN: 'written',
  WRITTEN_SHORT: 'written-short',
  CALCULATION: 'calculation',
}

# Contract — quickRecall (and inline quiz / choice / truefalse / connection blocks)

**Component:** `src/components/learning/QuickRecallScreen.jsx` (display
type `quickRecall`) plus the inline `quiz`/`choice`/`truefalse`/
`connection` block types rendered through `AnswerInteraction.jsx` ·
functions: `retrieve` · interaction: `assessed`

## The bar

The "Hippocrates — quick check" `quickRecall` screen in Episode 1
(`src/content/history/medicine/episodes/episode-01-medieval-beliefs-causes.js`,
stage "Hippocrates") sets the standard for retrieval alignment:

- All three questions retrieve exactly what the preceding beats taught —
  that Hippocrates believed illness had natural causes, and that illness
  meant the Four Humours were unbalanced — nothing the learner hasn't
  just seen.
- Distractors are plausible period beliefs a medieval or ancient person
  might actually have held ("Angry gods", "Evil spirits", "Witchcraft",
  "Bad smells entered the body"), never a joke option that gives the
  answer away by being obviously silly.
- Each `hint` points at the reasoning the learner needs ("Remember the
  four fluids you just explored"), not at the answer itself.

## Copy standards

- Every question retrieves what *this episode* taught, at the level the
  exam needs — never a fact from a different episode or a level of detail
  beyond GCSE.
- Every wrong answer logs through `unifiedWeaknessTracker.js`
  (`logWrongAnswer`, see `QuickRecallScreen.jsx` line 111) and every
  correct answer through `logCorrectAnswer` (same location). Do not
  build a retrieval interaction that bypasses the weakness tracker.
- Distractors are plausible misconceptions a learner could genuinely
  hold, never jokes or nonsense options that make the correct answer
  obvious by elimination.
- Hints and explanations point at the reasoning, not the answer — a hint
  that names the correct option is not a hint.
- Plain language around the compulsory subject vocabulary, aiming for a
  reading age of 12; vocabulary explained on first use.

## Known failure modes

1. **Retrieval of untaught facts** — a question tests something the
   episode never explained, forcing the learner to guess rather than
   recall.
2. **Giveaway distractors** — one option is absurd, off-topic, or
   obviously wrong on sight, reducing the question to elimination rather
   than retrieval.
3. **Non-explanatory feedback** — on a wrong answer, the explanation
   simply restates the correct option ("The answer was natural causes")
   instead of explaining *why* it's correct in terms of what was taught.

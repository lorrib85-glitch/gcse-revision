# Contract — matchingTask

**Component:** `src/components/learning/MatchingTask.jsx` · display type
`matchingTask` · functions: `classify` · interaction: `assessed`

This is the user's known case of "like the concept, not the execution" —
the pair-matching mechanic is sound, but weak content turns it into a
guessing game. This contract exists to hold the execution to the same bar
as the mechanic.

## The bar

The "Knowledge check" matching screen in Episode 1
(`src/content/history/medicine/episodes/episode-01-medieval-beliefs-causes.js`,
stage "Medieval treatments") is the standard. It works because:

- Every pair requires understanding to match, not surface word
  association — e.g. `Urine chart` → "Used to identify which humour was
  believed to be out of balance" shares no word with the term; the
  learner has to know what a urine chart was *for*.
- All 7 terms (urine chart, Galen, four humours, theory of opposites,
  physician, wise woman, astrology) were taught earlier in the same
  episode — the task retrieves, it doesn't introduce.
- 7 pairs exceeds `MatchingTask.jsx`'s `ROUND_MAX` of 6, so the component
  auto-splits into two balanced rounds rather than overwhelming the
  learner with one 7-card grid.

## Copy standards

- Pairs whose matching requires understanding, not word-overlap — the
  term and its correct answer should never share a distinctive word that
  gives the match away.
- Round sizes stay within the component's split threshold: `ROUND_MAX = 6`
  pairs per round in `MatchingTask.jsx`. Content with more than 6 pairs
  must be written expecting the automatic round split, not fought against.
- Every pair's term appears in a prior teach beat in the same episode —
  this is a retrieval check, not a first introduction to the term.
- Plain language around the compulsory subject vocabulary, aiming for a
  reading age of 12; vocabulary explained on first use.

## Known failure modes

1. **Guessable pairs** — one answer option shares a distinctive word with
   the prompt term (e.g. a term "bloodletting" paired with an answer
   containing the word "blood"), letting the learner match on text
   overlap instead of understanding.
2. **Ordered process mismatch** — `matchingTask` used for a process that
   has a correct sequence. Matching pairs are unordered by design; a
   process with a correct order (e.g. the stages of an evacuation, or a
   chain of cause → effect steps) belongs in `evacuationChainRoute`
   instead. This is the same fit rule documented in the project's
   `CLAUDE.md` for `EvacuationChainRoute` vs `MatchingTask`: use
   `matchingTask` only when the relationship between items is unordered.
3. **Overlong pair text** — term or answer text long enough that the
   cards wrap to multiple lines, pushing the SVG connector line endpoints
   apart from the text they're meant to connect and making the visual
   pairing unreadable on a phone screen.

# Contract — read blocks (`read`, `keypoint`, `examtip`, `funfact`)

**Component:** `src/components/layout/ModulePlayer.jsx` (`ReadBlock`,
`KeypointBlock`, `ExamTipBlock`, `FunFactBlock`) · display types `read`,
`keypoint`, `examtip`, `funfact` · functions: `teach-mechanism` (`read`,
`keypoint`), `exam-technique` (`examtip`), `hook-tension` (`funfact`) ·
interaction: `passive` (all four)

These are the four passive content blocks rendered inside
`CardContainer` on a normal content screen — no separate learner action,
just a label and a body of text. Because every one of them is `passive`,
the hard-floor rule ("never more than 2 consecutive passive screens") in
`docs/system/CONTENT_BUILD_TEMPLATE.md` applies directly to how these are
sequenced.

## The bar

A `read` block that sets up an interaction within the same story unit —
it teaches the one causal chain the next beat is about to test, and
nothing else. It earns its place because removing it would leave the
following interactive payoff untaught, not because it is interesting on
its own.

## Copy standards

- Full sentences. A `read` block teaches at most one causal chain — cause
  → mechanism → consequence — never a second, unrelated fact bolted on.
- Never more than 2 consecutive passive screens (⚙,
  `docs/system/CONTENT_BUILD_TEMPLATE.md` hard floor) — if a `read`/`keypoint`/
  `examtip`/`funfact` block would make a third in a row, it needs an
  assessed or reveal screen in between instead.
- No emoji-bullet fact walls. If the content is genuinely a list of more
  than 3 parallel facts, it belongs in a `classify`-function component
  (`colsort`, `matchingTask`) instead of a `<br/>`-bulleted paragraph.
- Plain language around the compulsory subject vocabulary, aiming for a
  reading age of 12; vocabulary explained on first use.

## Known failure modes

1. **The Episode 12 pattern** — a wall of `<br/>`-bulleted facts, each
   with its own emoji icon, carrying an entire topic passively with no
   interaction to follow it up. Below-bar example: Episode 12
   (`src/content/history/medicine/episodes/episode-12-when-medicine-became-magic.js`),
   screen 1 "From Guesswork to Precision" — the `read` block lists
   exploratory surgery, X-rays, CT, MRI and ultrasound as four
   emoji-bulleted lines inside one `text` string, each carrying its own
   fact with no room to teach *why* imaging mattered before the block
   ends.
2. **The encyclopaedia screen** — information that is interesting but
   carries no exam value: dates, trivia or background detail included
   because it's true, not because a GCSE question depends on it.
3. **Definition-first openings** — a `read` or `keypoint` block that opens
   a story unit with a term and its definition where a tension beat
   (scene, stake, or question) should sit instead. Definitions belong
   inside the teach beat, after the hook, not as the hook itself.

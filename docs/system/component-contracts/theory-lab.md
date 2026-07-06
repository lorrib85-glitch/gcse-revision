# Contract — theoryLab

> **Governed by `docs/system/PATTERN_GOVERNANCE.md`.** This contract predates the 9-field format and uses the earlier 3-part subset (bar / copy standards / failure modes); it upgrades to all nine fields when next touched.

**Component:** `src/components/learning/TheoryLab.jsx` · display type
`theoryLab` · functions: `apply` · interaction: `assessed`

## The bar

The rebuilt "Think like Galen" stretch in Episode 1
(`src/content/history/medicine/episodes/episode-01-medieval-beliefs-causes.js`,
stage "Galen") is the standard. It works because:

- The theory is *taught before it is tested*: the preceding teach beat
  explains cause → mechanism → consequence (humours ↔ qualities ↔
  treatment logic) in full sentences, so the lab is applying knowledge the
  learner actually holds.
- Every stage of the lab (scenario → diagnosis → prescription →
  evaluation) advances one dramatic question rather than presenting
  disconnected mini-tasks.
- The evaluation stage lands the exam payoff: why the theory persisted,
  and what the examiner expects the learner to say about it.

## Copy standards

- `explanation` must carry the full causal chain in complete sentences —
  a two-sentence summary is below the bar. **Known gap:** as of the
  Episode 1 rebuild, `TheoryStage` in `TheoryLab.jsx` does not render
  `theory.explanation` on screen — the stage currently shows only
  `theory.heading`, the `grid` pair, and `theory.tagline`. Write
  `explanation` to the full-chain standard anyway (it is the field a
  future rendering pass will surface, and it is what any readability/
  quality scan reads), but do not rely on it to carry the learner-facing
  teaching load today — that load must sit entirely in the *preceding*
  teach beat, per the "taught before tested" rule above. Fixing the
  render gap is a component change, out of scope for content authoring.
- `outcome.lines` and other short-line fields are for rhythm, not for
  carrying teaching: no load-bearing fact may exist *only* as a fragment.
- Feedback lines explain *why* the answer is right or wrong in terms of
  the theory's logic, not just restate the correct answer.
- Plain language around the compulsory subject vocabulary, aiming for a
  reading age of 12; vocabulary explained on first use.

## Known failure modes

1. **Testing before teaching** — the lab opens with a scenario the learner
   has no tools for. Below-bar example: the pre-rebuild "Think like Galen"
   screen explained the Theory of Opposites in two sentences, then
   immediately tested prescriptions.
2. **Fragment copy** — evaluation and outcome stages collapse into
   two-word fragments ("Too much heat.") that carry teaching weight
   nothing else carries.
3. **Missing exam payoff** — the lab ends at "correct!" without the
   evaluation stage connecting the theory to why it matters in the exam.

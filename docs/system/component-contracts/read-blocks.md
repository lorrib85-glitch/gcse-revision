# Contract — read blocks (`read`, `keypoint`, `examtip`, `funfact`)

> **Governed by `docs/system/PATTERN_GOVERNANCE.md`.** This contract predates the 9-field format and uses the earlier 3-part subset (bar / copy standards / failure modes); it upgrades to all nine fields when next touched.

**Component:** `src/components/layout/ScreenRenderer.jsx` (`ReadBlock`,
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

An `examtip` is a short examiner-facing rule, not a mini lesson. Its first
text beat carries the rule the learner should remember; an optional `tip`
can add the explanation or warning, and optional `phrases` can provide
quiet wording cues or answer-pattern lines. `phrasesLabel` names their purpose
when the default `Key wording` label is not accurate. It must remain passive:
these lines are memory cues, not buttons or a second interaction disguised as
decoration.

The primary sequencing job of `examtip` is **teach → connect to exam use**.
Use it immediately after a topic or concept has been covered when the learner
needs to see how that fresh knowledge translates into marks: the relevant
command word, what earns the marks, the detail that needs including, or the
mistake that would waste marks. It does not introduce new subject knowledge.

## Presentation contract

- `examtip` uses the governed translucent `CardContainer` cinematic-overlay
  surface. The scene or atmospheric background should remain perceptible
  around and faintly through the block; the card must not become an opaque
  dashboard panel or bright glassmorphism treatment.
- Subject identity comes only from the canonical `SUBJECTS` accent. No
  History-specific amber, science-specific green, or other component-local
  colour is permitted.
- The label is sentence case and uses `TYPE.label`, led by a short rule in the
  canonical subject accent. Emoji, uppercase transforms and the deprecated
  eyebrow pattern are forbidden.
- Visual hierarchy is fixed by meaning: label/accent → primary exam rule →
  optional supporting `tip` → optional labelled `phrases`. Do not make
  every line equally loud.
- When both the primary rule and supporting `tip` are present, separate them
  with governed spacing. Do not insert a decorative divider between them.
- Optional `phrases` render as quiet text lines beneath an explicit label, never
  as pills, chips or controls. Use `phrasesLabel` for answer patterns, formulae
  or another purpose that is not accurately described by `Key wording`.
- Typography, spacing, colour, radii and emphasis must come from the shared
  `TYPE`, `SPACING`, `GENERAL.examTechnique`, `GENERAL.contentSurface` and
  canonical subject tokens. Do not introduce local font sizes, line heights,
  spacing arithmetic, raw colours or one-off opacity values in `ExamTipBlock`.
- Glow is restrained to the subject-tinted atmosphere of the surface. It is
  not an achievement, selected state or active-progress signal.
- The presentation remains reusable across subjects and does not require an
  examiner character, illustration, background asset or bespoke screen type.

## Copy standards

- Full sentences. A `read` block teaches at most one causal chain — cause
  → mechanism → consequence — never a second, unrelated fact bolted on.
- An `examtip` should contain one exam-use rule tied directly to the topic just
  taught. It may add one short warning/explanation and a small number of
  labelled wording cues or answer-pattern lines, but it must not become a
  bundle of generic exam advice.
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
4. **Opaque exam-tip card** — treating `examtip` as a heavy standalone panel
   that hides the surrounding scene and makes a passive reminder feel like a
   dashboard widget.
5. **Locally rebuilt styling** — adding an uppercase or emoji label, a decorative
   divider, pill-like wording cues, raw spacing or opacity values, or local
   typography overrides instead of using the governed tokens.
6. **Generic exam advice detached from learning** — dropping an exam tip into a
   chapter without a clear connection to the topic just taught. If the learner
   cannot answer "what did I just learn that this helps me use?", the block is
   in the wrong place.

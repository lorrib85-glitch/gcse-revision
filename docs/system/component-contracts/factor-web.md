# Contract — FactorWeb

> **Governed by `docs/system/PATTERN_GOVERNANCE.md`.** Uses the 9-field format.

**Component:** `src/components/learning/FactorWeb.jsx`  
**Display type:** `factorWeb`  
**Function tags:** `teach-comparison`, `apply`  
**Interaction class:** `reveal`  
**Composition classification:** `interaction-owned` — Route B. The component owns full-screen composition inside `InteractionShell`. It does **not** own a separate typography system. Its primary title uses the canonical non-cinematic `TYPE.displayScreen` route through `ScreenTitle`.

## 1. Purpose

Help learners explore several factors around one causal or thematic question, understand what each factor means and why it mattered, then make a supported judgement about relative importance.

The component is not a decorative mind map. Every factor must add causal teaching, and the final judgement must require the learner to choose between plausible factors.

The web should feel like one composed historical object: a clear central subject, connected evidence around it, and restrained subject-colour emphasis. It should not feel like a generic dashboard diagram dropped beneath a heading.

## 2. When to use

Use when:

- a historical outcome or change had several interacting causes
- learners need to move beyond listing factors into explaining significance
- the relationship between factors matters
- a supported “which mattered most?” judgement is the intended payoff
- between four and six concise factor nodes can represent the content clearly

Typical examples:

- Why could Vesalius challenge Galen?
- Why did ideas about disease change?
- Which factors made a reform successful?

## 3. When NOT to use

Do not use when:

- the learner only needs to browse related ideas without judging importance → use `ConnectionMap`
- the content is chronological → use a timeline or process component
- the learner needs to sort items into categories → use a classification component
- there is one dominant explanation and no genuine factor comparison
- factor labels need long sentences to make sense
- more than six factors are essential on one mobile screen
- the final judgement is formally assessed and needs written-response capture → use an exam-technique component after the web

## 4. Required structure

```js
{
  type: 'factorWeb',
  mode: 'causes' | 'consequences' | 'change' | 'themes' | 'process',

  title: string,                 // required for new content; maximum 42 characters
  instruction?: string,          // optional short framing paragraph when context is useful

  centreLabel?: string,          // 2–3 words; maximum 22 characters
  centreImage?: string,          // optional historical focal image
  centreImageAlt?: string,       // required when centreImage is used
  centreImagePosition?: string,  // optional object-position override

  factors: [{
    id: string,
    title: string,               // full title used in the detail panel
    shortTitle?: string,         // optional node label; maximum 24 characters
    subtitle?: string,
    whatItMeans: string,
    whyItMattered: string,
    linkedFactor?: string,
  }],

  judgementTitle?: string,       // optional; maximum 42 characters
  judgementInstruction?: string,
  judgementPrompt?: string,
  thinkingTip?: string,
}
```

### Compatibility fields

- `question` and `kicker` are legacy heading fields only.
- The component may temporarily promote an old `kicker` or `question` into the one primary heading.
- They must never render as a separate eyebrow.
- New or updated content must use `title` and omit `kicker`.
- `taskPrompt` is legacy supporting copy. It may be used as the judgement paragraph, but never as a long screen heading.

### Explicit text limits

Limits are defined in `src/constants/contentLimits.js` and enforced as authoring constraints.

- main screen title: **42 characters maximum**
- judgement title: **42 characters maximum**
- centre label: **22 characters maximum**
- visible node label (`shortTitle || title`): **24 characters maximum**

These limits must fail governance. The runtime must not silently truncate, clamp, shrink or replace overlong learner copy.

Required interaction order:

1. one concise question appears as the canonical screen heading
2. an optional framing paragraph may appear when context genuinely helps
3. the central historical focal point and factor nodes appear
4. learner explores every factor
5. each factor reveals “What it means” and “Why it mattered”
6. shared `SequenceProgress` shows viewed/current/remaining state without numbers
7. “Make your judgement” unlocks after all factors are explored
8. learner chooses one factor
9. judgement scaffold appears
10. governed `ContinueCTA` unlocks

## 5. Token rules

- Primary heading: `ScreenTitle` → `TYPE.displayScreen`; no local font-size, weight, line-height or letter-spacing overrides.
- Optional framing copy: `TYPE.body`; it is allowed when it adds context and must remain visibly secondary.
- Factor-node labels: `TYPE.label`, sentence case.
- Centre label: `TYPE.titleMedium`, sentence case, 2–3 words.
- Detail title: `TYPE.displayCard`.
- Detail labels: `TYPE.label`, sentence case.
- Detail copy: `TYPE.body` / `TYPE.bodySmall`.
- Buttons: `TYPE.button` and governed `ContinueCTA`.
- Local sequence state: `SequenceProgress`; never `x / y`, percentages or a bespoke rail.
- Colour comes from `SUBJECTS[subject]`; content data does not carry raw presentation colours.
- No emojis or system glyphs as factor identity. Selection and explored states use restrained subject accent only.
- No eyebrows. Do not render `kicker`, `TYPE.eyebrow`, `cinematic-eyebrow` or any small label above the main heading.
- No decorative uppercase or local font families.
- Active glow is restrained and permitted only on the selected node or central subject ring.
- One subtle radial atmosphere treatment is permitted around the central focal point because it explains hierarchy; do not add unrelated glow or decorative gradients elsewhere.

## 6. Motion rules

- Centre, lines and factor nodes enter with restrained fade/scale or path drawing.
- Motion communicates the web relationship; it must not bounce, overshoot or feel arcade-like.
- Connector lines stop at the focal ring and node anchors rather than running through content.
- Detail panels fade and rise gently when the active factor changes.
- The judgement phase uses a calm cross-fade.
- `prefers-reduced-motion` renders all content immediately with no animated travel.

## 7. Gold example

`src/components/learning/FactorWeb.stories.jsx` → **Gold — Vesalius causation**.

At 390px:

- “Why could Vesalius challenge Galen?” is the one dominant heading
- an optional one-sentence framing paragraph remains clearly secondary
- no eyebrow or duplicate label appears above the heading
- Vesalius is the central historical focal image, with his name beneath the medallion
- factor cards feel connected to the central subject rather than floating independently
- connector lines end at small bronze anchor points
- six factor labels remain readable without emoji or clipping
- node cards are restrained and do not dominate the central subject
- detail teaching appears below the web at normal body size
- progress uses the shared dot/pill system with no numbers
- the final phase asks “Which factor mattered most?” and supports a causal judgement

The `LongFactorLabels` story checks the `shortTitle` escape hatch and a second central historical focal image.

## 8. Below-bar counterexample

The pre-rework implementation:

- placed the entire causal question inside an 86px circle
- forced the centre copy to 8.5px uppercase text with a six-line clamp
- rendered factor labels at 8px with two-line truncation
- used blue/multicoloured emoji as factor identity
- displayed a local `x / y factors explored` counter
- used uppercase “WHAT IT MEANS”, “WHY IT MATTERED” and “LINKED FACTOR” labels
- encouraged content writers to pad or distort questions to satisfy an aggregate readability metric
- rendered a small coloured eyebrow above a second, competing heading
- treated the web as a generic radial diagram rather than a composed historical focal object

That implementation passed source-data checks while failing the rendered mobile experience. It must not be recreated.

## 9. Review checks

### Mechanical

- ⚙ Route B uses `InteractionShell`.
- ⚙ Primary heading routes through `ScreenTitle` / `TYPE.displayScreen`.
- ⚙ Main and judgement titles stay within the governed 42-character limit.
- ⚙ Centre and node labels stay within their governed limits.
- ⚙ No runtime truncation, line clamp or automatic font shrinking is used to hide an authoring failure.
- ⚙ No local heading type overrides.
- ⚙ No rendered eyebrow, `textTransform: 'uppercase'`, `TYPE.eyebrow` or `cinematic-eyebrow`.
- ⚙ No `fontFamily` declarations in the component.
- ⚙ No numeric progress copy; `SequenceProgress` is used.
- ⚙ No factor emoji rendering.
- ⚙ `ContinueCTA` owns both progression actions.
- ⚙ Factors have stable IDs.
- ⚙ A `centreImage` always has meaningful `centreImageAlt`.
- ⚙ Reduced motion is respected.

### Render at 390px

- 👁 One clear heading leads the screen and does not exceed three natural lines.
- 👁 Optional framing copy may remain when it adds context, but it does not compete with the heading.
- 👁 No duplicate label appears above the heading.
- 👁 The central focal point is visually dominant without becoming oversized.
- 👁 The centre label is short and fully readable.
- 👁 Every node label is readable without clipping; use `shortTitle` where needed.
- 👁 Nodes do not collide with the centre or screen edge.
- 👁 Connector lines visibly terminate at the centre ring and node anchors.
- 👁 The web reads as one connected composition rather than six separate buttons.
- 👁 The web remains understandable without colour.
- 👁 Active and explored states are distinct but restrained.
- 👁 The information panel is readable without tiny text or nested card clutter.
- 👁 The judgement phase is clearly a new task, not an endless extension of the web.
- 👁 The screen scrolls naturally under the fixed learning header and no CTA is hidden by system chrome.

# Contract — FactorWeb

> **Governed by `docs/system/PATTERN_GOVERNANCE.md`.** Uses the 9-field format.

**Component:** `src/components/learning/FactorWeb.jsx`  
**Display type:** `factorWeb`  
**Function tags:** `teach-comparison`, `apply`  
**Interaction class:** `reveal`  
**Composition classification:** `interaction-owned` — Route B. The component owns full-screen composition: its full interaction layout inside `InteractionShell`. It does **not** own a separate typography system. Its primary title uses the canonical non-cinematic `TYPE.displayScreen` route through `ScreenTitle`.

## 1. Purpose

Help learners explore several factors around one causal or thematic question, understand what each factor means and why it mattered, then make a supported judgement about relative importance.

The component is not a decorative mind map. Every factor must add causal teaching, and the final judgement must require the learner to choose between plausible factors.

## 2. When to use

Use when:

- a historical outcome or change had several interacting causes
- learners need to move beyond listing factors into explaining significance
- the relationship between factors matters
- a supported “which mattered most?” judgement is the intended payoff
- between four and six concise factor nodes can represent the content clearly

Typical examples:

- Why could Vesalius challenge Galen?
- Why did ideas about disease change in the nineteenth century?
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
  question: string,              // the one full screen heading; concise and sentence case
  instruction?: string,          // one short framing line
  centreLabel?: string,          // 2–3 words; never the full question
  factors: [{
    id: string,
    title: string,               // full title used in the detail panel
    shortTitle?: string,         // optional 1–3 word node label
    subtitle?: string,
    whatItMeans: string,
    whyItMattered: string,
    linkedFactor?: string,
  }],
  taskPrompt: string,            // judgement-phase screen heading
  judgementInstruction?: string,
  judgementPrompt?: string,
  thinkingTip?: string,
}
```

`kicker` is a legacy content field only. The component may temporarily treat an old `kicker` value as the main heading when needed for backward compatibility, but it must never render it as a separate eyebrow. New or updated content must use `question` for the screen heading and omit `kicker`.

Required interaction order:

1. full question appears as the canonical screen heading
2. concise centre concept and factor nodes appear
3. learner explores every factor
4. each factor reveals “What it means” and “Why it mattered”
5. shared `SequenceProgress` shows viewed/current/remaining state without numbers
6. “Make your judgement” unlocks after all factors are explored
7. learner chooses one factor
8. judgement scaffold appears
9. governed `ContinueCTA` unlocks

## 5. Token rules

- Primary heading: `ScreenTitle` → `TYPE.displayScreen`; no local font-size, weight, line-height or letter-spacing overrides.
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
- Active glow is restrained and permitted only on the selected node.

## 6. Motion rules

- Centre, lines and factor nodes enter with restrained fade/scale or path drawing.
- Motion communicates the web relationship; it must not bounce, overshoot or feel arcade-like.
- Detail panels fade and rise gently when the active factor changes.
- The judgement phase uses a calm cross-fade.
- `prefers-reduced-motion` renders all content immediately with no animated travel.

## 7. Gold example

`src/components/learning/FactorWeb.stories.jsx` → **Gold — Vesalius causation**.

At 390px:

- “Why could Vesalius challenge Galen?” is the one dominant heading
- no eyebrow or duplicate label appears above the heading
- the full question is never placed inside the centre node
- “Challenge Galen” is the short centre concept
- six factor labels remain readable without emoji or clipping
- detail teaching appears below the web at normal body size
- progress uses the shared dot/pill system with no numbers
- the final phase asks “Which factor mattered most?” and supports a causal judgement

The `LongFactorLabels` story checks the `shortTitle` escape hatch for longer full titles.

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

That implementation passed source-data checks while failing the rendered mobile experience. It must not be recreated.

## 9. Review checks

### Mechanical

- ⚙ Route B uses `InteractionShell`.
- ⚙ Primary heading routes through `ScreenTitle` / `TYPE.displayScreen`.
- ⚙ No local heading type overrides.
- ⚙ No rendered eyebrow, `textTransform: 'uppercase'`, `TYPE.eyebrow` or `cinematic-eyebrow`.
- ⚙ No `fontFamily` declarations in the component.
- ⚙ No numeric progress copy; `SequenceProgress` is used.
- ⚙ No factor emoji rendering.
- ⚙ `ContinueCTA` owns both progression actions.
- ⚙ Factors have stable IDs.
- ⚙ Reduced motion is respected.

### Render at 390px

- 👁 One clear heading leads the screen.
- 👁 No duplicate label appears above the heading.
- 👁 The centre label is short and fully readable.
- 👁 Every node label is readable without clipping; use `shortTitle` where needed.
- 👁 Nodes do not collide with the centre or screen edge.
- 👁 The web remains understandable without colour.
- 👁 Active and explored states are distinct but restrained.
- 👁 The information panel is readable without tiny text or nested card clutter.
- 👁 The judgement phase is clearly a new task, not an endless extension of the web.
- 👁 The screen scrolls naturally under the fixed learning header and no CTA is hidden by system chrome.

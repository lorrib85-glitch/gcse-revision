# Contract — oppositeQualitiesReveal

**Component:** `src/components/learning/OppositeQualitiesReveal.jsx` · intent: *passively reveal two opposing concepts through visual contrast*

**Composition classification:** content

## 1. Purpose

Teach a pair of opposite concepts by showing each configured item centrally, moving it to its configured side, and leaving the final grouped DOM state readable under the correct concept.

This is a guided teaching reveal, not an assessment. The learner observes a classification pattern before later retrieval or sorting components test it.

## 2. When to use

Use when the learner needs to understand a contrast through guided reveal, not answer a question: e.g. symptoms grouped as one quality or its opposite, cause/effect examples, or two opposing interpretations.

## 3. When NOT to use

- Do not use for assessed sorting, drag-and-drop, quiz choices or feedback states; use `ColSortBlock`, `MatchingTask` or another assessment component.
- Do not use for a case diagnosis with treatment reasoning; use an assessed diagnostic component (e.g. `FactorWeb`) where its contract fits.
- Do not use to introduce more than two opposing concepts on one screen.
- Do not add answer state, correctness, scoring or prediction orchestration to this component. Those belong to the page or an assessment component.

## 4. Required structure

Required props are supplied through `block`: `title`, `copy`, `leftConcept`, `rightConcept`, and either each concept's `items` or an explicit `sequence`. Each concept requires `label` and `items`; `sequence` entries require `item` and `side: 'left' | 'right'`.

Optional props:

- concept `icon`;
- `backgroundImage`, `backgroundPosition` and `backgroundOpacity`;
- `closingCaption`;
- `timings`;
- `visualPair`;
- legacy `theme` overrides;
- `accessibility` labels.

Example:

```js
{
  type: 'oppositeQualitiesReveal',
  title: 'Hot or cold?',
  copy: 'Doctors used symptoms to decide which quality was strongest.',
  visualPair: 'warmCool',
  backgroundImage: '/figures/history/medicine/medieval/opposite-qualities-background.svg',
  leftConcept: { label: 'Hot', icon: '☀', items: ['Fever'] },
  rightConcept: { label: 'Cold', icon: '❄', items: ['Chills'] },
  sequence: [{ item: 'Fever', side: 'left' }, { item: 'Chills', side: 'right' }],
  closingCaption: 'Doctors looked at symptoms to judge the quality.'
}
```

## 5. Token rules

Compose the screen through `TeachScreenShell`; the component itself is body content.

Use:

- `TYPE` for typography;
- `SPACING` for layout rhythm;
- `RADII` for the contained stage;
- `MOTION` for reveal timing;
- subject theme tokens for the shared subject identity;
- `CINEMATIC_LAB` for shared dark teaching values;
- `oppositeQualitiesRevealTheme.js` for semantic pair and backdrop roles.

Content selects a governed semantic pair such as `warmCool` or `wetDry`. It must not invent local red/blue palettes or pass raw colour values for ordinary authored screens.

The component must not assemble local hex, RGB or `rgba()` values. Visual decisions belong in the semantic theme layer.

## 6. Cinematic background ownership

A cinematic image is encouraged when it supports the concept. The component renders that image as an **absolute, contained backdrop inside its own reveal stage**.

The component must not:

- mount a fixed viewport background;
- use a negative z-index to escape its parent;
- replace the page shell;
- cover navigation or neighbouring blocks.

This preserves the cinematic moment in both `TeachScreenShell` and the Component Review Lab while keeping page-level layout ownership outside the body component.

## 7. Motion rules

Each item appears in the centre, pauses for readability, travels in the direction derived from `sequence.side`, settles into the side list, then the next item begins. Timing uses `MOTION` tokens by default and `block.timings` for semantic overrides. No bounce, confetti, dotted paths or game feedback.

Reduced motion bypasses travel animation and renders the complete final grouping immediately, preserving reading order and all content.

## 8. Gold example

`OppositeQualitiesReveal.stories.jsx` → **HotCold** and Episode 1 screens “Hot or cold?” / “Wet or dry?”: contained cinematic background, two semantically distinct concept identities, deterministic alternating reveal, final grouped content under the correct labels.

## 9. Below-bar counterexample

A two-column sorting task with answer buttons, feedback states, drag affordances or dashboard cards. That changes the learning intent from guided concept reveal to assessment and fails this contract.

A fixed full-screen background mounted by this body component also fails the contract because it breaks composition ownership.

## 10. Review checks

- ⚙ Both concept labels and all items come from configuration.
- ⚙ Movement direction is derived from side data, not concept names.
- ⚙ `visualPair` selects governed semantic roles; ordinary content does not supply raw colours.
- ⚙ The cinematic background is contained inside the reveal stage.
- ⚙ Reduced motion yields a complete final DOM state.
- ⚙ The old Galen-specific four-quality diagnostic screen is not used for the two passive teaching pages.
- 👁 At 390px, columns do not collide, the active item is readable, and the closing caption stays above navigation/CTA chrome.

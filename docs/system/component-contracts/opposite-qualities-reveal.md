# Contract — oppositeQualitiesReveal

**Component:** `src/components/learning/OppositeQualitiesReveal.jsx` · intent: *passively reveal two opposing concepts through visual contrast*

**Composition classification:** content

## 1. Purpose

Teach a pair of opposite concepts by showing each configured item centrally, moving it to its configured side, and leaving the final grouped DOM state readable under the correct concept.

## 2. When to use

Use when the learner needs to understand a contrast through guided reveal, not answer a question: e.g. symptoms grouped as one quality or its opposite, cause/effect examples, or two opposing interpretations.

## 3. When NOT to use

- Do not use for assessed sorting, drag-and-drop, quiz choices or feedback states; use `ColSortBlock`, `MatchingTask` or another assessment component.
- Do not use for a case diagnosis with treatment reasoning; use an assessed diagnostic component (e.g. `factorWeb`) where its contract fits.
- Do not use to introduce more than two opposing concepts on one screen.

## 4. Required structure

Required props are supplied through `block`: `title`, `copy`, `leftConcept`, `rightConcept`, and either each concept's `items` or an explicit `sequence`. Each concept requires `label` and `items`; `sequence` entries require `item` and `side: 'left' | 'right'`. Optional props: concept `icon`, `backgroundImage`, `closingCaption`, `timings`, `theme`, and `accessibility` labels.

Example:

```js
{
  type: 'oppositeQualitiesReveal',
  title: 'Hot or cold?',
  copy: 'Doctors used symptoms to decide which quality was strongest.',
  leftConcept: { label: 'Hot', icon: '☀', items: ['Fever'] },
  rightConcept: { label: 'Cold', icon: '❄', items: ['Chills'] },
  sequence: [{ item: 'Fever', side: 'left' }, { item: 'Chills', side: 'right' }],
  closingCaption: 'Doctors looked at symptoms to judge the quality.'
}
```

## 5. Token rules

Compose the screen through `TeachScreenShell`; the component itself is body content. Use `TYPE`, `SPACING`, `RADII`, `MOTION`, subject theme tokens and `CINEMATIC_LAB` shared dark teaching tokens. Do not hardcode subject colours or History-specific palette values in the component.

## 6. Motion rules

Each item appears in the centre, pauses for readability, travels in the direction derived from `sequence.side`, settles into the side list, then the next item begins. Timing uses `MOTION` tokens by default and `block.timings` for semantic overrides. No bounce, confetti, dotted paths or game feedback.

Reduced motion bypasses travel animation and renders the complete final grouping immediately, preserving reading order and all content.

## 7. Gold example

`OppositeQualitiesReveal.stories.jsx` → **HotCold** and Episode 1 screens “Hot or cold?” / “Wet or dry?”: two concept columns, deterministic alternating reveal, final grouped content under the correct labels.

## 8. Below-bar counterexample

A two-column sorting task with answer buttons, feedback states, drag affordances or dashboard cards. That changes the learning intent from guided concept reveal to assessment and fails this contract.

## 9. Review checks

- ⚙ Both concept labels and all items come from configuration.
- ⚙ Movement direction is derived from side data, not concept names.
- ⚙ Reduced motion yields a complete final DOM state.
- ⚙ The old Galen-specific four-quality diagnostic screen is not used for the two passive teaching pages.
- 👁 At 390px, columns do not collide, the active item is readable, and the closing caption stays above navigation/CTA chrome.

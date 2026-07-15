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

- concept `icon` (`heat`, `cold`, `wet`, `dry`, or a legacy display fallback);
- `backgroundImage`, `backgroundPosition` and `backgroundOpacity`;
- `backgroundMode: 'screen' | 'stage'`;
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
  backgroundMode: 'screen',
  leftConcept: { label: 'Hot', icon: 'heat', items: ['Fever'] },
  rightConcept: { label: 'Cold', icon: 'cold', items: ['Chills'] },
  sequence: [{ item: 'Fever', side: 'left' }, { item: 'Chills', side: 'right' }],
  closingCaption: 'Doctors looked at symptoms to judge the quality.'
}
```

## 5. Token rules

Compose the screen through `TeachScreenShell`; the component itself is body content.

Use:

- `TYPE` for typography;
- `SPACING` for layout rhythm;
- `RADII` for the contained fallback stage;
- `MOTION` for reveal timing;
- subject theme tokens for the shared subject identity;
- `CINEMATIC_LAB` for shared dark teaching values;
- `oppositeQualitiesRevealTheme.js` for semantic pair, destination and backdrop roles.

Content selects a governed semantic pair such as `warmCool` or `wetDry`. It must not invent local red/blue palettes or pass raw colour values for ordinary authored screens.

The component must not assemble local hex, RGB or `rgba()` values. Visual decisions belong in the semantic theme layer.

## 6. Cinematic background ownership

A cinematic image is encouraged when it supports the concept.

With `backgroundMode: 'screen'` inside ModulePlayer, the component portals its backdrop into the existing fixed `ContentShell`. This gives the teaching screen a genuine full-viewport image while preserving the shell's ownership of:

- clipping;
- header layering;
- scrolling;
- navigation;
- safe areas.

When no `ContentShell` host exists—such as Storybook or the Component Review Lab—the same configuration falls back to an absolute backdrop inside the reveal stage.

The component must not:

- create its own `position: fixed` viewport shell;
- use a negative z-index to escape its parent;
- replace ModulePlayer navigation;
- cover the LearningHeader or neighbouring screens.

## 7. Visual composition

The reveal uses three semantic atmospheric areas:

- left destination;
- neutral centre reveal space;
- right destination.

These are edge-faded washes over the cinematic image, not translucent panels, glass cards or visible columns. There must be no hard vertical boundaries around the concept groups or centre space.

During each movement:

- the target destination strengthens;
- the opposite destination recedes;
- the active word uses the strongest screen-level type token;
- the new settled item enters from the centre-facing direction and receives one brief landing emphasis.

Known semantic icons use governed line SVGs rather than platform-dependent emoji rendering.

## 8. Motion and learner control

The default beat is deliberately calm:

- 900 ms central read;
- 850 ms travel;
- 320 ms settle.

Each item appears in the centre, pauses for readability, travels in the direction derived from `sequence.side`, settles into the side list, then the next item begins. `block.timings` can provide semantic overrides. No bounce, confetti, dotted paths or game feedback.

The sequence starts only after at least 20% of the component is visible. It pauses while the browser tab is hidden.

The learner may tap anywhere on the active stage—or use its keyboard control—to place the current item immediately. This accelerates a guided reveal; it is not an answer submission.

Reduced motion bypasses travel animation and renders the complete final grouping immediately, preserving reading order and all content.

## 9. Completion

Once every item is settled:

- the cinematic spacer is removed;
- the stage contracts to the completed comparison;
- the two groups remain fully readable;
- the closing caption appears beneath them;
- the governed `ContinueCTA` follows without overlapping the comparison.

The completed screen must not preserve a large empty animation area.

## 10. Gold example

`OppositeQualitiesReveal.stories.jsx` → **HotCold** and Episode 1 screens “Hot or cold?” / “Wet or dry?”: full-screen cinematic background in ModulePlayer, safe contained fallback elsewhere, panel-free atmospheric contrast, semantically distinct concept identities, calm deterministic reveal, tap acceleration and a compact readable final grouping.

## 11. Below-bar counterexample

A two-column sorting task with answer buttons, feedback states, drag affordances or dashboard cards. That changes the learning intent from guided concept reveal to assessment and fails this contract.

A component-owned fixed viewport or negative-z background also fails the contract because it bypasses the governed screen shell.

Large translucent rectangles behind the two groups also fail the contract: the image and semantic atmosphere should carry the contrast without turning the teaching moment into a dashboard.

## 12. Review checks

- ⚙ Both concept labels and all items come from configuration.
- ⚙ Movement direction is derived from side data, not concept names.
- ⚙ `visualPair` selects governed semantic roles; ordinary content does not supply raw colours.
- ⚙ `backgroundMode: 'screen'` uses the existing `ContentShell`; standalone previews fall back safely.
- ⚙ Left, centre and right atmosphere remains distinct without panels or hard boundaries.
- ⚙ Target destination response and landing continuity are present.
- ⚙ The sequence starts only when visible and pauses when the document is hidden.
- ⚙ Tap/keyboard acceleration cannot create assessment state.
- ⚙ Completion removes the empty cinematic spacer.
- ⚙ Reduced motion yields a complete final DOM state.
- ⚙ The old Galen-specific four-quality diagnostic screen is not used for the two passive teaching pages.
- 👁 At 390px, columns do not collide, the active item is readable, and the closing caption stays above navigation/CTA chrome.

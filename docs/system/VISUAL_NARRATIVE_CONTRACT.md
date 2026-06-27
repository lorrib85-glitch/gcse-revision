# Visual Narrative Contract

**Status:** locked design contract  
**Component:** `src/components/learning/VisualNarrativeScreen.jsx`  
**Screen type:** `visualNarrative`

This component owns the cinematic hook-story structure used for full-screen narrative beats.

## Locked structure

Any screen using `type: 'visualNarrative'` must keep this structure:

1. **Full-bleed cinematic image**
   - Image reaches all screen edges.
   - Dark gradient is used only to protect readability.
   - No card frame, dashboard panel, glass tile stack, or generic AI-app styling.

2. **No eyebrow by default**
   - Beat labels are hidden unless `showLabel: true` is explicitly set.
   - Do not add all-caps category labels above the title as the default pattern.
   - The opening image/title should do the work.

3. **Large cinematic headline**
   - Headline is the dominant element.
   - Sentence case preferred.
   - Short, punchy, GCSE-useful wording.
   - Avoid title case and decorative labels.

4. **Short supporting copy**
   - One or two lines only.
   - Should tease the idea, not explain the whole lesson.
   - Use the next beats/components for detail.

5. **Cinematic continue only**
   - Opening narrative beats must use `CinematicContinueCTA`.
   - Do not use circular arrow buttons, floating glass buttons, or inline custom continue prompts.
   - The CTA should feel like part of the atmosphere, not a separate app widget.

6. **Top progress rail remains external**
   - VisualNarrativeScreen must not introduce its own progress dots/rails.
   - Module progress stays owned by the learning header/progress system.

## Data guidance

Recommended first beat shape:

```js
{
  image: '/figures/.../image.webp',
  headline: 'Two dead Greeks ran medieval medicine.',
  body: 'For hundreds of years, doctors trusted Hippocrates and Galen more than new evidence.',
}
```

Optional label only when genuinely useful:

```js
{
  showLabel: true,
  label: 'Medieval medicine',
  headline: '...',
  body: '...',
}
```

## Do not

- Do not reintroduce default eyebrows.
- Do not use all-caps labels as decoration.
- Do not add circular next buttons.
- Do not create local progress dots.
- Do not use random glow/neon. Glow should only come from the subject accent or cinematic CTA.
- Do not hardcode subject colours inside episode data when the subject palette can provide them.

## Related locked components

- `CinematicContinueCTA` — only cinematic continue implementation.
- `LearningProgressHeader` — only top module progress rail.
- `SequenceProgress` — only local sequence progress where local progress is genuinely needed.

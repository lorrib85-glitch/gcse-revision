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
   - Each beat may supply its own image. Text-only beats reuse the most recent image.
   - Use `imageMode: 'full'` or `imageMode: 'upper'` only when the default placement is unsuitable.
   - The default upper-image treatment retains faint image texture behind the narrative block rather than ending in a separate black section.
   - The governed vignette may be disabled with `imageVignette: false` when the source image already supplies sufficient focus.

2. **No eyebrow by default**
   - Beat labels are hidden unless `showLabel: true` is explicitly set.
   - Do not add all-caps category labels above the title as the default pattern.
   - The opening image/title should do the work.

3. **Large cinematic headline**
   - Headline is the dominant element without becoming a landing-page hero.
   - It must use `TYPE.displayCinematic` without local typography overrides.
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
   - The shared cinematic CTA sits in the narrative text flow with governed spacing, so it stays connected to the copy and adapts to text length.
   - The CTA should feel like part of the atmosphere, not a separate app widget.
   - The shared CTA contains no decorative arrow.

6. **Top progress rail remains external**
   - VisualNarrativeScreen must not introduce its own progress dots/rails.
   - Module progress stays owned by the learning header/progress system.

7. **Accessible interaction**
   - Narrative progression remains available through the real cinematic CTA.
   - Sequential fact reveals must support Enter and Space as well as touch.
   - New facts and conclusions must be announced through an `aria-live` region.
   - Meaningful teaching imagery should include `imageAlt`.
   - Motion and looping pulses must respect `prefers-reduced-motion`.

8. **Data-driven highlights only**
   - A highlight is optional and must be supplied by the active beat.
   - Do not hardcode a location, era or named place into the component.
   - Highlight glow must use the subject accent unless content explicitly supplies an RGB value.

9. **Token-governed composition**
   - Typography comes from `TYPE`.
   - Spacing comes from `SPACING` or `GENERAL.cinematic.visualNarrative` semantic layout tokens.
   - Image fade, vignette, default crop and narrative placement are defined centrally, not tuned with local component values.
   - Episode data controls the image and words; the reusable component contains no subject-specific copy.

## Data guidance

Recommended first beat shape:

```js
{
  image: '/figures/.../image.webp',
  imageAlt: 'Concise description of the evidence shown in the image',
  headline: 'Two dead Greeks ran medieval medicine.',
  body: 'For hundreds of years, doctors trusted Hippocrates and Galen more than new evidence.',
}
```

Text-only beats reuse the most recent image:

```js
{
  headline: 'The book',
  body: 'One printed volume brought the drawings and explanations together.',
}
```

Optional highlight:

```js
{
  facts: ['The evidence reached doctors across Europe.'],
  conclusion: 'Printing gave the evidence reach.',
  highlight: {
    top: '21%',
    left: '73%',
    size: 52,
  },
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
- Do not hardcode a portrait/timeline/England story model into the reusable component.
- Do not pin the narrative CTA away from its associated copy.
- Do not make a final non-facts beat a dead end.

## Related locked components

- `CinematicContinueCTA` — only cinematic continue implementation.
- `ContinueCTA` — final conclusion progression.
- `LearningProgressHeader` — only top module progress rail.
- `SequenceProgress` — only local sequence progress where local progress is genuinely needed.

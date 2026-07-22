# Concept Reveal Contract

**Status:** locked design contract  
**Component:** `src/components/learning/ConceptReveal.jsx`  
**Screen type:** `conceptReveal`

ConceptReveal owns the single-concept teaching reveal: one idea at a time, explained clearly, with cinematic atmosphere but less drama than VisualLearning.

## Use ConceptReveal when

- The learner needs one new idea introduced clearly.
- The screen is instructional rather than a story opener.
- The concept benefits from a full-screen atmosphere or background image.
- The content can be expressed as a short sequence of simple steps.

## Use VisualLearning instead when

- The screen is a dramatic story beat.
- The goal is emotional hook/storytelling rather than concept teaching.
- The beat needs a full-bleed image sequence with one headline per scene.

## Use the TimelineChain reveal variant instead when

- The content is a short cause→effect chain delivered one calm statement at a
  time (each with optional supporting detail), rather than a single concept.
  (This absorbed the former VisualNarrative sequencing.)

## Locked structure

1. **Full-screen atmosphere**
   - Background can be a full-bleed image or subject gradient.
   - Dark gradient protects readability.
   - No cards, dashboards, glass stacks, or generic AI-app styling.

2. **Eyebrow hidden by default**
   - `step.eyebrow` only renders when `step.showEyebrow === true`.
   - Do not use eyebrows as decoration.
   - Avoid all-caps labels unless they are genuinely required by source/exam convention.

3. **One dominant idea**
   - `mainText` is the visual focus.
   - Keep it short, sentence case where possible, and useful for GCSE understanding.

4. **Short support copy**
   - `supportText` should add one clear explanation.
   - Avoid paragraphs of content; use later screens for depth.

5. **Micro-points only when needed**
   - `microPoints` are for small clarifying details.
   - Do not turn ConceptReveal into a bullet-list screen.

6. **Final cinematic continue only**
   - Intermediate steps advance by tapping/swiping the screen.
   - `CinematicContinueCTA` appears only on the final step.
   - The final CTA is the only way ConceptReveal continues to the next feature/screen.
   - Do not add custom circular next buttons, text-only tap hints, or inline continue prompts.

7. **No local progress dots**
   - ConceptReveal must not render its own dot row.
   - Module progress stays external.
   - If local step orientation ever becomes essential, use the locked `SequenceProgress` component rather than custom dots.

## Recommended data shape

```js
{
  type: 'conceptReveal',
  steps: [
    {
      backgroundImage: '/figures/.../image.webp',
      mainText: 'People still got sick.',
      supportText: 'Doctors could see illness, but they could not yet see microbes.',
      emphasis: 'sick',
    },
  ],
}
```

Optional eyebrow:

```js
{
  showEyebrow: true,
  eyebrow: 'Cause of disease',
  mainText: '...',
}
```

## Do not

- Do not reintroduce default eyebrows.
- Do not use custom local progress dots.
- Do not use text hints like `tap to continue` or `tap to finish`.
- Do not show the continue CTA before the final step.
- Do not let background taps leave ConceptReveal for the next feature.
- Do not create custom continue buttons.
- Do not overfill with long paragraphs.
- Do not use random glow/neon.
- Do not hardcode subject colours when the subject palette can supply them.

## Related locked components

- `CinematicContinueCTA` — only cinematic continue implementation.
- `LearningProgressHeader` — module progress and navigation.
- `SequenceProgress` — only approved local progress component if truly needed.

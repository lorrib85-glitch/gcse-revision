# Contract — keyFigureReveal

> **Governed by `docs/system/PATTERN_GOVERNANCE.md`.**

**Component:** `src/components/learning/KeyFigureReveal.jsx` · display type
`keyFigureReveal` · function: `introduce-figure` · interaction: `reveal`

## 1. Purpose

Introduce one historically or conceptually important person through a portrait-led, full-screen reveal that answers: **who were they, what did they contribute, and why did it matter?**

The component owns Route C cinematic composition because the portrait and the learner-controlled knowledge reveal must remain one visual moment. A normal scrolling teaching shell would separate the person from the explanation.

## 2. When to use

Use when all of the following are true:

- the person is necessary to the unit's causal story or argument, not decorative biography;
- the learner needs two to four distinct ideas about them;
- each idea can be explained in one to three short lines;
- a memorable image, event or consequence helps the learner retain the figure's significance.

## 3. When NOT to use

Do not use for:

- **a single fact or quotation** — use `MemoryHook` or a normal teaching screen;
- **a long biography or chronology** — cut to the ideas that affect the GCSE argument, or use `TimelineCanvas` when sequence is the actual learning job;
- **comparing two people or theories** — use `TheoryCompare`;
- **teaching a concept where the person is incidental** — use `ConceptReveal` or `TeachScreenShell`;
- **more than four knowledge sections** — split the content or move secondary detail to another screen.

## 4. Required structure

Required screen order:

1. full-width portrait hero (`portrait`, `name`, `role`);
2. exactly one active knowledge card from `sections[]`;
3. swipe/arrow navigation and section progress;
4. `ContinueCTA` only on the final section.

Each section requires `title` and one to three full-sentence `lines`. It may include one supporting `image`, one short `quote`, and a final-section `takeaway`.

The knowledge card must size to its content and remain fully readable **without an internal vertical scrollbar**. The portrait is the flexible area: it yields height on shorter viewports so the card, navigation and progression control remain inside the screen. Supporting evidence images use a viewport-responsive height rather than a fixed tall crop.

No eyebrow, biography list, nested card stack, separate page scroll or second primary action.

## 5. Token rules

- Screen title: `TYPE.displayScreen`.
- Role: `TYPE.metadata`.
- Card heading: `TYPE.label`.
- Body: `TYPE.bodySmall` or `TYPE.bodyStrong` for the first non-image line.
- Rhythm: `SPACING` tokens only.
- Card and image corners: `RADII` tokens.
- Touch targets, dividers and focus dimensions: `COMPONENT_SIZE`.
- Subject identity: `SUBJECTS[subject]`; no locally invented subject palette.
- Progression: governed `SequenceProgress` and `ContinueCTA` only.

## 6. Motion rules

- Card change uses the standard `MOTION.duration.standard` and `MOTION.easing.standard` slide/fade.
- Supporting image entrance uses `MOTION.duration.slow`.
- `prefers-reduced-motion` removes card/image animation and progress glow transitions.
- Swipe is horizontal; left/right arrow keys provide equivalent navigation.

## 7. Gold example

**Runtime:** Episode 1, stages **Hippocrates** and **Galen** in
`src/content/history/medicine/episodes/episode-01-medieval-beliefs-causes.js`.

Why this is the bar:

- Hippocrates moves from natural causes to Four Humours, observation and influence — each section has one job.
- Galen uses memorable evidence, especially the squealing-pig demonstration, rather than CV-style facts.
- Both connect the person directly to the medicine-through-time argument.
- At mobile size, the full active card, navigation and progress remain visible together; the portrait compresses before knowledge becomes scrollable.

## 8. Below-bar counterexample

**“Famous scientist profile” misuse:** a birth/death/date list, five or more sections, long paragraphs and a fixed-height card that requires the learner to scroll inside it.

It fails because biography replaces significance, the screen has no single memory structure, and the learner cannot see the complete idea or next action at once.

## 9. Review checks

- **⚙** `sections.length` is between 1 and 4.
- **⚙** every section has a title and one to three non-empty lines.
- **⚙** only the final section renders `ContinueCTA`.
- **⚙** reduced-motion rules disable card and evidence-image animation.
- **⚙** the card content wrapper does not use `overflow-y: auto` or `scroll`.
- **👁** composed runtime render at 390px shows portrait, name/role, the complete active card and navigation without vertical scrolling.
- **👁** repeat at a short mobile viewport (approximately 320 × 568): no clipped copy, hidden CTA, horizontal overflow or unusably small portrait.
- **👁** one element is clearly dominant, the screen's job is understood within three seconds, and the portrait supports rather than competes with the knowledge.
- **👁** compare against the Hippocrates/Galen gold screens and name any trade-off in portrait impact, readability or content density.

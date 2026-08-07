# CinematicDivider contract

**Composition classification:** `content` — a decorative separator rendered inside another screen's layout. It owns no heading, viewport layout, screen-level spacing or progression chrome.

## Purpose

`CinematicDivider` is a small decorative line–diamond–line separator used to create a calm editorial pause between cinematic content regions.

It is decorative only. It must never communicate progress, completion, correctness or hierarchy by itself.

## Source

- Component: `src/components/core/CinematicDivider.jsx`
- Review reference: `src/dev/componentReview/ButtonsAndProgressPage.jsx`

## Use it for

- separating a hero quote from the next interaction
- separating a cinematic reveal from supporting content
- creating a restrained visual pause inside editorial or literary layouts

## Do not use it for

- module progress or local sequence progress
- dividing every card or paragraph
- replacing normal spacing where no thematic pause is needed
- communicating a state that must be available to assistive technology

## Props

```jsx
<CinematicDivider
  accent={subjectAccent}
  accentRgb={subjectAccentRgb}
  size="standard"
  style={{ marginBlock: 22 }}
/>
```

- `accent`: subject accent colour. Defaults to the governed general accent.
- `accentRgb`: optional pre-resolved RGB string. Use the subject token when already available.
- `size`: `compact`, `standard` or `wide`.
- `align`: `center` by default; use `start` only when the composition deliberately calls for an editorial left alignment.
- `style`: placement overrides such as block spacing. Do not use it to rebuild motif colour or sizing.

## Governance

- neutral lines derive from `GENERAL.line.medium`
- the centre diamond derives from the supplied subject accent
- colours must not be hard-coded by consumers
- the component is always `aria-hidden` because it is decorative
- the component owns its default balanced alignment; consumers may opt into start alignment explicitly rather than recreating the motif

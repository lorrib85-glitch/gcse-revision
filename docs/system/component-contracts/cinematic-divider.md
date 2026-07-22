# CinematicDivider contract

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
  style={{ margin: '22px auto 0' }}
/>
```

- `accent`: subject accent colour. Defaults to the governed general accent.
- `accentRgb`: optional pre-resolved RGB string. Use the subject token when already available.
- `size`: `compact`, `standard` or `wide`.
- `style`: placement overrides only, such as margin or alignment.

## Governance

- neutral lines derive from `GENERAL.line.medium`
- the centre diamond derives from the supplied subject accent
- colours must not be hard-coded by consumers
- the component is always `aria-hidden` because it is decorative
- consumers own placement; the component owns motif, sizing and colour treatment

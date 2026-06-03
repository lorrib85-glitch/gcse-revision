# Component Authoring Rules

**Version:** v1 — Mandatory Governance Layer  
**Status:** Required reading before creating or editing any component

---

## Core Principle

This app is a cinematic learning product with a locked design language.

Components are not isolated widgets. They are:
- Authored learning experiences
- Emotional pacing tools
- Reusable cinematic beats

Every component must feel like part of the same product ecosystem.

---

## Required System Imports

All new components must import from shared constants where relevant:

```js
import { SPACING }  from '../../constants/spacing.js'
import { SUBJECTS } from '../../constants/subjects.js'
import { RADII }    from '../../constants/radii.js'
import { BUTTONS }  from '../../constants/buttons.js'
import { MOTION }   from '../../constants/motion.js'
import { TYPE }     from '../../constants/typography.js'
```

---

## What Must Never Be Hardcoded

| Category | Wrong | Right |
|----------|-------|-------|
| Spacing | `marginTop: 72` | `marginTop: SPACING.cinematic` |
| Border radius | `borderRadius: 22` | `borderRadius: RADII.large` |
| Motion timing | `transition: '0.2s ease'` | `transition: \`\${MOTION.duration.fast} \${MOTION.easing.gentle}\`` |
| Typography | `fontSize: 34, fontWeight: 700` | `...TYPE.hero` |
| Subject colour | `color: '#D69B45'` | `color: SUBJECTS[subject].accent` |

---

## Component Location Rules

All standalone components live inside `src/components/`. Never add `.jsx` files directly to `src/`.

```
src/components/
  core/       — primitive UI: buttons, headers, containers
  learning/   — cinematic learning screens and interaction blocks
  layout/     — shells, wrappers, structural composition
  feedback/   — answer states, recovery, assessment
```

---

## Naming Rules

Component names must be explicit and describe the experience.

**Preferred:**
- `WeakSpotRecovery`
- `ExplainReveal`
- `FillInTheBlanksBlock`
- `InteractiveHotspotImage`

**Avoid:**
- `QuizBlock`
- `InteractiveWidget`
- `SmartCard`
- `LearningThing`

---

## Component Design Rules

Every component must:
- Have one dominant purpose
- Have one clear focal interaction
- Preserve breathing room
- Respect cinematic pacing
- Maintain emotional clarity

Avoid:
- Dashboard density
- Multiple competing focal points
- Unnecessary visual chrome
- Too many simultaneous actions

---

## No Redesign During Refactor

Refactor passes must not redesign components.

**Allowed:**
- Token migration
- Import path cleanup
- Spacing standardisation
- Theme centralisation
- Architecture cleanup

**Not allowed:**
- Changing layouts
- Redesigning interactions
- Adding features
- Altering visual hierarchy
- Changing pacing

---

## Locked Component Rules

Some components are contractually locked — their internals must not change.

See `docs/components/LOCKED_COMPONENTS.md` for the full list.

When modifying locked components:
- Preserve behaviour exactly
- Preserve visual hierarchy
- Preserve interaction flow
- Avoid broad rewrites
- If uncertain: defer and report

---

## Motion Rules

Motion must feel cinematic, restrained, and purposeful.

**Use:**
- Opacity fades
- translateY slide-ins
- scale press feedback

**Never use:**
- Bounce or spring physics
- Confetti or particles
- Arcade effects
- Excessive hover motion
- Reward spam animations

---

## Container Rules

Prefer atmospheric separation over visible containers.

**Avoid:**
- Chunky cards everywhere
- Floating glass panels
- Excessive borders
- Dashboard-style layouts

**Use:**
- Spacing tokens
- Opacity hierarchy
- Background layering
- Atmospheric gradients

---

## Subject Theme Rules

All subject-aware components must use `SUBJECTS` from `src/constants/subjects.js`.

```js
import { SUBJECTS } from '../../constants/subjects.js'

const theme = SUBJECTS[subject] || SUBJECTS.History
const accent = theme.accent
const rgb = theme.accentRgb
```

Never:
- Duplicate palette maps locally
- Create local `SUBJECT_ACCENTS` objects
- Tweak subject colours per component

---

## Component Creation Checklist

Before creating a new component:

- [ ] Does a similar component already exist in `COMPONENT_REGISTRY.md`?
- [ ] Is this a distinct, justified learning beat?
- [ ] Does it use spacing tokens (no magic numbers)?
- [ ] Does it use motion tokens (no hardcoded durations)?
- [ ] Does it use typography tokens?
- [ ] Does it use subject theme tokens (if subject-aware)?
- [ ] Is it mobile-first and portrait-oriented?
- [ ] Does it have one clear focal purpose?
- [ ] Does it avoid dashboard density?
- [ ] Does it feel emotionally coherent with the product?

---

## Anti-Vibe-Code Rules

To avoid "AI-generated UI syndrome":

**Never:**
- Overuse glow effects
- Over-round everything with pill radius
- Create glassmorphism panels everywhere
- Stack multiple chunky cards
- Add decorative icons constantly
- Use excessive gradients
- Overcrowd screens
- Create dashboard grid layouts
- Use hyperactive animations
- Create generic SaaS patterns

**The product should feel:** authored, cinematic, immersive, restrained, premium.

---

## Build Verification

After any architectural change:

**Mandatory:**
- Run `./node_modules/.bin/vite build` — must pass with 0 errors
- Verify all imports resolve
- Verify no console errors

**Recommended:**
- Visual mobile viewport inspection
- Subject theme comparison across subjects

---

## Safe Migration Workflow

1. Create shared system token or constant
2. Migrate one safe, modern component
3. Verify build passes
4. Continue gradually

Never mass-migrate all components in one risky pass.

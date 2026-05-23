# GCSE Revision App — Brand & Component Guide

---

## Header Images

`/public/headers/` contains the following cinematic header images:

| File | Description |
|------|-------------|
| `history-medicine-through-time.png` | Medical history from medieval to modern surgery, dark left side |
| `history-elizabethan.png` | Queen Elizabeth I era, warm amber tones, dark left side |
| `history-usa-conflict.png` | USA 1954–75 civil rights era, dark amber tones |
| `history-spain-new-world.png` | Spanish conquistadors, dark left side |
| `history-main.png` | History subject logo / hero image |
| `bio-main.png` | Biology overview hero |
| `bio-buildinglife.png` | Biology: Cells & Building Life |
| `bio-humanmachine.png` | Biology: The Human Machine |
| `bio-diseasewars.png` | Biology: Disease & Immunity |
| `bio-energyforlife.png` | Biology: Energy for Life |
| `bio-controlsystems.png` | Biology: Control Systems |
| `bio-genetics.png` | Biology: Genetics & Evolution |
| `bio-ecosystems.png` | Biology: Ecosystems |
| `maths-main.png` | Maths subject logo / hero image |
| `english-main.png` | English subject logo / hero image |
| `english-macbeth.png` | English: Macbeth |
| `english-inspector.png` | English: An Inspector Calls |
| `english-poetry.png` | English: Poetry |
| `english-reading.png` | English: Reading Between the Lines |
| `sociology-main.png` | Sociology subject logo / hero image |
| `sociology-family.png` | Sociology: Family |
| `sociology-education.png` | Sociology: Education |
| `sociology-crime.png` | Sociology: Crime & Deviance |
| `sociology-stratification.png` | Sociology: Social Stratification |
| `chem-logo.png` | Chemistry subject logo / hero image |
| `physics-main.png` | Physics subject logo / hero image |
| `physics-forces.png` | Physics: Forces & Motion |
| `physics-energy.png` | Physics: Energy & Power |
| `physics-waves.png` | Physics: Waves & Electricity |
| `physics-space.png` | Physics: Space |
| `physics-matter.png` | Physics: Matter & Particles |

Images are already cinematic with dark left sides suitable for text overlay. Always use `.png` extension — never `.svg`.

---

## 1. Product Philosophy

This is a **premium streaming-platform experience** — think Apple TV, Spotify, or Netflix, not Duolingo or a school VLE.

- The interface should feel like something a smart 15-year-old would **choose** to open, not something they are forced to use.
- No cartoon mascots, no confetti, no "Amazing! You're a superstar!", no pastel bubbly buttons.
- Design decisions follow this priority order:
  1. Calm, legible, dark
  2. Premium and intentional
  3. Functional and clear
  4. Subtly engaging (micro-animations only)

---

## 2. Global App Layout

- **Max width:** `420px`, centered
- **Side padding:** `20px` (screens), `16px` (cards inside screens)
- **Bottom padding:** Always account for `env(safe-area-inset-bottom)` + BottomNav height (`~82px`)
- No desktop dashboards, no multi-column layouts, no sidebars
- Every screen is a single scrollable vertical column

---

## 3. Global Colours

### Background Scale

| Token | Hex | Usage |
|-------|-----|-------|
| `bg-primary` | `#08090D` | Page/screen background |
| `bg-secondary` | `#101218` | Section backgrounds |
| `bg-card` | `#151720` | Standard cards |
| `bg-elevated` | `#1B1E27` | Elevated/floating cards, modals |

### Text

| Token | Hex | Usage |
|-------|-----|-------|
| `text-primary` | `#F5F7FF` | Headings, key copy |
| `text-secondary` | `#A89FC2` | Subheadings, labels |
| `text-muted` | `#5E5874` | Captions, timestamps, disabled |

### Status / Accent

| Token | Hex | Usage |
|-------|-----|-------|
| `accent-teal` | `#65E6C6` | Primary interactive accent, nav active |
| `correct` | `#4CAF7D` | Correct answer state |
| `incorrect` | `#E05A52` | Incorrect answer state |
| `weak-zone` | `#E0A84F` | Weak topics, amber highlight |

---

## 4. Typography

### Font Families

| Family | Source | Usage |
|--------|--------|-------|
| **Sora** | Google Fonts | All headings, display text, module titles, buttons, nav labels |
| **Outfit** | Google Fonts | All UI text — body copy, subtitles, chips, captions, input fields |

Load both via Google Fonts in `index.html`:

```html
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
```

### Type Scale

| Name | Size | Weight | Font | Line Height | Letter Spacing | Usage |
|------|------|--------|------|-------------|----------------|-------|
| `display-xl` | 42px | 800 | Sora | 1.05 | -0.02em | Hero screen headings (Home, Subjects greeting) |
| `display-lg` | 32px | 700 | Sora | 1.1 | -0.02em | Section headings, browser headers |
| `heading-md` | 20px | 700 | Sora | 1.2 | -0.01em | Card titles, module names |
| `heading-sm` | 18px | 700 | Sora | 1.25 | -0.01em | Sub-headings, list item titles |
| `button-lg` | 20px | 700 | Sora | 1 | -0.01em | Primary CTA buttons (height 58px) |
| `button-sm` | 16px | 600 | Sora | 1 | normal | Secondary/ghost buttons |
| `body-lg` | 16px | 500 | Outfit | 1.55 | normal | Reading content, descriptions |
| `body-md` | 15px | 400 | Outfit | 1.5 | normal | Standard body copy |
| `label` | 13px | 600 | Outfit | 1.4 | 0.14em | Section labels, category tags (uppercase) |
| `nav` | 13px | 600/500 | Outfit | 1 | normal | Bottom nav labels (600 active, 500 inactive) |
| `caption` | 12px | 500 | Outfit | 1.4 | normal | Chips, timestamps, fine print |

### Rules

- **Never mix Sora and Outfit on the same line** — headings are Sora, supporting copy is Outfit.
- **Sora** is used wherever the element is the primary focal point of a hierarchy level.
- **Outfit** is used for everything that supports or describes, never leads.
- No italic styling in the UI — all text is upright.
- Section labels (`label` style) must be UPPERCASE.

---

## 5. Spacing System

Base unit: **4px**

| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | 4px | Icon padding, micro gaps |
| `space-2` | 8px | Tight gaps within components |
| `space-3` | 12px | Component internal padding |
| `space-4` | 16px | Standard gap, card padding |
| `space-5` | 20px | Screen side padding |
| `space-6` | 24px | Section gaps |
| `space-8` | 32px | Major section breaks |
| `space-12` | 48px | Top-of-screen breathing room |

**Standard rules:**
- Cards: `16px` padding
- Screen edges: `20px` horizontal padding
- Stacked card gap: `12px`
- Section gap: `24px`

---

## 6. Radius System

| Context | Value |
|---------|-------|
| Hero cards / module headers | `28px` |
| Standard cards | `24px` |
| Buttons | `18px` |
| Inputs | `14px` |
| Chips / pills / tags | `999px` |
| Small badges | `999px` |

---

## 7. Shadows, Borders, Blur

### Card Shadows

```css
/* Standard card */
box-shadow: 0 2px 16px rgba(0, 0, 0, 0.36);

/* Elevated card / modal */
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.52), inset 0 1px 0 rgba(255, 255, 255, 0.05);
```

### Borders

```css
/* Subtle card border */
border: 1px solid rgba(255, 255, 255, 0.06);

/* Active / focused border */
border: 1px solid rgba(255, 255, 255, 0.12);

/* Accent border (teal) */
border: 1px solid rgba(101, 230, 198, 0.28);
```

### Backdrop Blur (floating elements)

```css
backdrop-filter: blur(22px);
-webkit-backdrop-filter: blur(22px);
background: rgba(11, 16, 24, 0.92);
```

---

## 8. Buttons

### Primary Button

- Height: `58px`
- Border radius: `18px`
- Background: `linear-gradient(135deg, #1F9E7F 0%, #2BBE9A 100%)`
- Text: `#F5F7FF`, `20px`, weight `700`, Sora, letter-spacing `-0.01em`
- No text shadow, no outer glow unless active

```css
height: 58px;
border-radius: 18px;
background: linear-gradient(135deg, #1F9E7F 0%, #2BBE9A 100%);
color: #F5F7FF;
font-size: 20px;
font-weight: 700;
font-family: 'Sora', sans-serif;
letter-spacing: -0.01em;
border: none;
padding: 0 24px;
```

### Secondary Button

```css
height: 48px;
border-radius: 18px;
background: rgba(255, 255, 255, 0.06);
border: 1px solid rgba(255, 255, 255, 0.1);
color: #F5F7FF;
font-weight: 600;
font-family: 'Sora', sans-serif;
```

### Ghost Button

```css
height: 44px;
border-radius: 14px;
background: transparent;
border: 1px solid rgba(255, 255, 255, 0.12);
color: #A89FC2;
font-weight: 600;
font-family: 'Outfit', sans-serif;
```

### Danger Button

```css
height: 48px;
border-radius: 18px;
background: rgba(224, 90, 82, 0.14);
border: 1px solid rgba(224, 90, 82, 0.32);
color: #E05A52;
font-weight: 700;
font-family: 'Sora', sans-serif;
```

---

## 9. Cards

### Standard Card

```css
background: #151720;
border-radius: 24px;
border: 1px solid rgba(255, 255, 255, 0.06);
padding: 16px;
box-shadow: 0 2px 16px rgba(0, 0, 0, 0.36);
```

### Hero Card

- Height: `190px`
- Border radius: `28px`
- Full-bleed background image
- Dark gradient overlay on left side for text legibility
- Text sits in the dark-left zone

```css
height: 190px;
border-radius: 28px;
overflow: hidden;
position: relative;
background-image: url('/public/headers/...');
background-size: cover;
background-position: center;
```

### Subject Card

```css
height: 148px;
border-radius: 24px;
overflow: hidden;
background: #151720;
border: 1px solid rgba(255, 255, 255, 0.06);
```

### Module Card

```css
background: #151720;
border-radius: 24px;
padding: 16px;
border: 1px solid rgba(255, 255, 255, 0.06);
display: flex;
align-items: flex-start;
gap: 12px;
```

Module card title: `font-family: 'Sora', sans-serif; font-size: 18px; font-weight: 700; letter-spacing: -0.01em;`

### Lesson Content Card (reading/fact block)

```css
background: #1B1E27;
border-radius: 18px;
padding: 16px 18px;
border: 1px solid rgba(255, 255, 255, 0.06);
margin-bottom: 12px;
```

---

## 10. Chips, Tags, Pills

```css
/* Standard chip */
display: inline-flex;
align-items: center;
height: 28px;
padding: 0 12px;
border-radius: 999px;
background: rgba(255, 255, 255, 0.06);
border: 1px solid rgba(255, 255, 255, 0.1);
font-size: 12px;
font-weight: 600;
font-family: 'Outfit', sans-serif;
color: #A89FC2;

/* Active/selected chip */
background: rgba(101, 230, 198, 0.12);
border-color: rgba(101, 230, 198, 0.3);
color: #65E6C6;
```

---

## 11. Inputs and Search

```css
height: 48px;
border-radius: 14px;
background: #151720;
border: 1px solid rgba(255, 255, 255, 0.08);
color: #F5F7FF;
font-size: 15px;
padding: 0 16px;
font-family: 'Outfit', sans-serif;

/* Focus state */
border-color: rgba(101, 230, 198, 0.4);
outline: none;
box-shadow: 0 0 0 3px rgba(101, 230, 198, 0.08);
```

Search input includes a leading search icon (`16px`, stroke `1.75px`). Placeholder text uses `#5E5874`.

---

## 12. Bottom Navigation

5 tabs: **Home**, **Subjects**, **Quick Fire**, **Progress**, **Exam**

```
Container:
  position: fixed, bottom: 12px
  width: calc(100% - 24px), max-width: 480px
  height: ~82px
  border-radius: 26px
  background: rgba(11, 16, 24, 0.92)
  backdrop-filter: blur(22px)
  border: 1px solid rgba(255, 255, 255, 0.08)
  box-shadow: 0 -10px 34px rgba(0, 0, 0, 0.52)
  padding-bottom: env(safe-area-inset-bottom)

Tab item (active):
  color: #65E6C6
  icon: drop-shadow(0 0 6px rgba(101, 230, 198, 0.58))
  indicator: 22×3px pill, background #65E6C6, border-radius 99px
  label: font-family 'Outfit', font-size 13px, font-weight 600

Tab item (inactive):
  color: #8A8795
  label: font-family 'Outfit', font-size 13px, font-weight 500
```

Icons must be **SVG line icons only** — no emoji, no filled icons, no cartoon icons.

---

## 13. Icons

- **Stroke width:** `1.75px` — always
- Style: thin, geometric line icons
- Size context: `20px` for nav, `18px` for card actions, `16px` for inline
- Never use emoji as icons in the UI
- Never use filled/solid icon sets
- Never use cartoon or rounded-bubbly icon styles
- Preferred library style: Lucide, Phosphor (regular/thin), or Heroicons (outline)

---

## 14. Image Style

All header and subject images must feel **cinematic and editorial**:

- Dark left side (or dark region where text overlays sit)
- Slightly desaturated — not hyper-vivid
- Applied CSS filter:

```css
filter: blur(0.4px) saturate(0.92) contrast(0.95);
```

- No stock-photo brightness, no white backgrounds, no illustrated/cartoon imagery
- Images should feel like film stills or documentary photography

---

## 15. Animation and Motion

- **Duration:** `220ms` — standard
- **Easing:** `ease` or `cubic-bezier(0.25, 0.46, 0.45, 0.94)`
- **Transforms used:** `scale`, `translateY`, `opacity`
- **Never:** bouncy spring animations, confetti, particle effects, overshoot easing
- **Hover state:** `scale(1.02)` on cards, `scale(0.97)` on button press
- **Screen transitions:** `opacity` fade, `translateY(8px)` slide-in from below
- Keep all animations subtle — the user should barely notice them

```css
transition: transform 220ms ease, opacity 220ms ease;
```

---

## 16. Progress Components

```css
/* Track */
height: 6px;
border-radius: 999px;
background: rgba(255, 255, 255, 0.08);

/* Fill */
border-radius: 999px;
background: linear-gradient(90deg, #1F9E7F, #65E6C6);
transition: width 400ms ease;
```

No numeric labels on the bar itself. Pair with a caption below if needed.

---

## 17. Quiz Components

Answer option states:

```css
/* Default */
background: #151720;
border: 1px solid rgba(255, 255, 255, 0.08);
color: #F5F7FF;
border-radius: 16px;
padding: 14px 16px;

/* Selected (before reveal) */
background: rgba(101, 230, 198, 0.08);
border-color: rgba(101, 230, 198, 0.4);
color: #65E6C6;

/* Correct */
background: rgba(76, 175, 125, 0.12);
border-color: rgba(76, 175, 125, 0.5);
color: #4CAF7D;

/* Incorrect */
background: rgba(224, 90, 82, 0.1);
border-color: rgba(224, 90, 82, 0.4);
color: #E05A52;
```

No animated mascots, no "BOOM" text, no celebratory graphics on correct answers.

---

## 18. Weak Zone Components

Weak Zone = topics the user is struggling with.

- Accent colour: **`#E0A84F`** (amber/gold)
- Background: `rgba(224, 168, 79, 0.08)`
- Border: `1px solid rgba(224, 168, 79, 0.24)`

Copy tone must be **encouraging and direct**, never shame-based:
- "Worth another look" — not "You failed this"
- "Pick up where you left off" — not "You're behind!"
- "A few more reps on this one" — not "You keep getting this wrong"

---

## 19. Screen Structure Rules

### Home Screen Order

1. Greeting (time-of-day personalised, e.g. "Good evening")
2. Continue / Resume card (if draft session exists)
3. Weak Zone strip (amber, 2–3 topics)
4. Subjects grid
5. Quiz CTA banner (bottom, before nav)

No other section order is acceptable. Do not reorder for aesthetics.

---

## 20. Subject Branding

| Subject | Colour | Hex | Notes |
|---------|--------|-----|-------|
| Maths | Teal | `#2DD4BF` | Clean, logical |
| English | Plum | `#B66DFF` | Rich, literary |
| History | Bronze | `#C89B6D` | Earthy, archival |
| Biology | Sage | `#4F8A5B` | Natural, organic |
| Chemistry | Purple | `#9B59E8` | Scientific depth |
| Physics | Blue | `#3B82F6` | Space, precision |
| Sociology | Pink-red | `#FF5C7A` | Social, bold |
| Drama | Crimson | `#8E2638` | Theatre, emotion |
| Music | Brass | `#C59A42` | Warm gold, acoustic |

Each subject colour is used for:
- Card accent border
- Icon tint
- Progress bar fill
- Active chip state within that subject

---

## 21. Subject Icon Conventions

- One SVG line icon per subject, `24×24px`, stroke `1.75px`
- Icon represents the subject's **core concept**, not a generic book/pen
  - Maths: function symbol or graph
  - English: speech bubble or quill
  - History: hourglass or scroll
  - Biology: leaf or cell
  - Chemistry: flask or atom
  - Physics: orbit or lightning bolt
  - Sociology: group of people
  - Drama: theatre masks
  - Music: music note or waveform
- Never use an emoji as a subject icon in final UI

---

## 22. Copy Tone

- **Direct, calm, and intelligent**
- Write as if to a smart 15-year-old who respects being treated like an adult
- No exclamation mark spam
- No patronising praise ("Amazing!", "You're doing great champ!")
- No cutesy error messages ("Oopsie! Something went wrong")
- Correct: "Something went wrong. Try again."
- Correct: "You've done 3 sessions this week."
- Incorrect: "Wow, 3 sessions! You're smashing it! Keep going superstar!"

---

## 23. Accessibility

- **Minimum tap target:** `44×44px` — no exceptions
- **Text contrast:** All body text must meet WCAG AA (4.5:1 minimum against its background)
- `text-primary` (`#F5F7FF`) on `bg-card` (`#151720`) — passes AAA
- `text-secondary` (`#A89FC2`) on `bg-card` — passes AA
- `text-muted` (`#5E5874`) on `bg-card` — use only for non-essential text (captions, placeholders)
- Focus states must be visible — use `box-shadow: 0 0 0 3px rgba(101, 230, 198, 0.3)` on keyboard focus
- Never convey information by colour alone (always pair with icon or label)

---

## 24. Things Claude Must Not Improvise

- **No new colour palettes** — use the tokens defined in Section 3 and Section 20 only
- **No new fonts** — Sora and Outfit only; no other font families
- **No childish or playful styling** — no rounded bubbly buttons, no pastel fills, no emoji in UI
- **No new layout patterns** — single-column scroll only, max-width 420px
- **No decorative gradients** — gradient use is limited to: primary button fill, progress bar fill, subject header overlays
- **No unsanctioned motion** — no spring physics, no bounce, no confetti
- **No auto-invented component variants** — if a new component is needed, match the closest existing pattern from this guide

When in doubt: go **simpler, darker, calmer, and less decorated**.

---

## 25. Final Build Principle

Before shipping any screen or component, ask:

> **Would a smart 15-year-old voluntarily open this on their phone after school?**

If the answer is "maybe, if they had to" — it needs more work.
If the answer is "yes, this feels like a real product" — ship it.

The bar is: this should feel like it belongs in the App Store next to Spotify and Duolingo Dark Mode, not next to a school homework portal.

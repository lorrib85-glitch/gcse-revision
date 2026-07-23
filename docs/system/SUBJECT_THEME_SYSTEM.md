# Subject Theme System

**Version:** v1 — Locked Foundation Layer  
**Source file:** `src/constants/subjects.js`

---

## Purpose

Defines the permanent emotional world for each subject. Each subject has a locked atmospheric palette — background, accent colours, glow values, and overlay tones. This is the single source of truth for all subject-aware components.

Never duplicate palette maps. Never create local `SUBJECT_ACCENTS` objects. Never tweak subject colours per component.

---

## Import

```js
import { SUBJECTS } from '../../constants/subjects.js'

const theme = SUBJECTS[subject] || SUBJECTS.History
const accent = theme.accent
const rgb = theme.accentRgb
```

---

## Palette Shape

Each subject entry contains:

| Property | Type | Description |
|----------|------|-------------|
| `accent` | hex string | Primary accent — buttons, highlights, active states |
| `accentSecondary` | hex string | Secondary accent — glows, soft highlights |
| `accentTertiary` | hex string | Deep accent — dark tints, pressed states |
| `background` | hex string | Deep subject background colour |
| `backgroundSecondary` | hex string | Slightly lighter surface background |
| `glow` | rgba string | Standard glow value for atmospheric effects |
| `glowStrong` | rgba string | Stronger glow for focal elements |
| `overlay` | rgba string | Screen overlay for background image dimming |
| `progressFill` | hex string | Progress bar fill colour |
| `accentRgb` | rgb string | Accent as `'r,g,b'` for use in rgba() |
| `palette` | object, optional | Named extended palette for subject-specific cinematic design work |

---

## Colour Budget Rules

Subject colour must create identity without taking over the screen. Every subject screen should feel mostly dark, cinematic and readable, with colour used as a controlled signal.

Default colour budget:

| Colour role | Approx. share | Use |
|-------------|---------------|-----|
| Dark neutrals / background | 75% | Page background, cards, overlays, image dimming, atmosphere |
| Primary subject accent | 15% | Primary CTA, active state, progress, key selected/tappable elements |
| Secondary subject accent | 8% | Soft highlights, support states, illustration details, subtle borders |
| Rare highlight / special accent | 2% | High-value moments only: streaks, mastery, important discovery, dramatic reveal |

Rules:

- Never flood a screen with the subject colour.
- Do not tint all headings, labels, cards, icons and buttons at once.
- Body copy should usually remain `text-primary`, parchment, ivory or soft grey rather than subject-coloured.
- Subject colour should indicate meaning: progress, selection, active state, feedback, or a specific subject motif.
- Large background areas should use the subject `background` and `backgroundSecondary`, not the bright accent.
- Glow should be restrained and tied to active progress, selected states, cinematic reveals or subject-specific visual motifs.
- Rare highlight colours must stay rare. If they appear everywhere, they stop feeling premium.
- A primary accent used for text must maintain at least 4.5:1 contrast against both subject backgrounds. Preserve darker brand shades as tertiary or named palette tokens rather than using them for small text.

Anti-pattern examples:

- Purple Chemistry screens where every card, label and button glows purple.
- Green Biology screens that look like a generic health app or childish slime science kit.
- Physics screens that become generic blue tech dashboards.
- History screens that become yellow/orange everywhere instead of candlelit bronze and parchment.
- Sociology screens that become green or golden rather than neutral, observational and grounded.
- Music screens that become Spotify, EDM, synthwave, TikTok audio or gaming RGB.

---

## Subject Palettes

### Maths
```
accent:           #4EA3FF
accentSecondary:  #A7D2FF
accentTertiary:   #1E5F9E
background:       #080B10
backgroundSecondary: #101722
glow:             rgba(78,163,255,0.30)
glowStrong:       rgba(167,210,255,0.18)
progressFill:     #4EA3FF
accentRgb:        78,163,255
```

Extended Maths palette:

| Token | Hex | Usage |
|-------|-----|-------|
| `blueprintBlue` | `#4EA3FF` | Key actions, selection states, progress highlights and important emphasis |
| `gridBlue` | `#A7D2FF` | Supporting lines, soft highlights and calm mathematical clarity |
| `theoremBlue` | `#1E5F9E` | Deep accent for pressed states, diagrams and structured emphasis |
| `graphite` | `#252A31` | Surfaces, cards and overlays to create precision and focus |
| `slate` | `#101722` | Secondary surfaces and dark mathematical space |
| `formulaPaper` | `#EAF2F8` | High-contrast text on dark backgrounds and occasional formula surfaces |
| `ink` | `#080B10` | Deep background and strong contrast anchor |
| `tealAccent` | `#2A9D8F` | Cross-subject consistency and active navigation only |

Maths should feel precise, logical and blueprint-like. Use blue to signal clarity and structure, not sci-fi glow. Avoid making Maths and Physics visually identical by keeping Maths cleaner, flatter and more diagrammatic.

### English
```
accent:           #B96F78
accentSecondary:  #D5A7AC
accentTertiary:   #6A343D
background:       #0D0F10
backgroundSecondary: #1F1C1B
glow:             rgba(185,111,120,0.26)
glowStrong:       rgba(213,167,172,0.18)
progressFill:     #B96F78
accentRgb:        185,111,120
```

Extended English palette:

| Token | Hex | Usage |
|-------|-----|-------|
| `rosewood` | `#B96F78` | Readable key actions, active states, progress and important emphasis on dark English surfaces |
| `oxblood` | `#6A343D` | Deep literary shade for pressed states, imagery, large decorative areas and atmospheric depth |
| `mahogany` | `#4C242B` | Secondary actions, interactive elements and subtle highlights |
| `walnut` | `#3B2626` | Surfaces, cards and overlays to add warmth and depth |
| `dustyRose` | `#D5A7AC` | Supportive elements, subtle highlights and soft accents |
| `parchment` | `#E9E1D3` | Text on dark backgrounds and soft contrasting areas |
| `ink` | `#1F1C1B` | Muted text, icons and disabled states |
| `tealAccent` | `#2A9D8F` | Cross-subject consistency and active navigation only |

English should feel rich, intelligent and literary — dark academic rather than purple neon. Rosewood carries readable interface emphasis; oxblood preserves the deeper literary identity without being used for small text. Do not let teal take over English screens.

### Physics
```
accent:           #22D3EE
accentSecondary:  #F2C14E
accentTertiary:   #3A506B
background:       #0D1321
backgroundSecondary: #1A2332
glow:             rgba(34,211,238,0.26)
glowStrong:       rgba(242,193,78,0.18)
progressFill:     #22D3EE
accentRgb:        34,211,238
```

Extended Physics palette:

| Token | Hex | Usage |
|-------|-----|-------|
| `cosmicNavy` | `#0D1321` | Primary background, deep space, serious atmosphere and subject depth |
| `deepSpace` | `#1A2332` | Secondary background, sections and elevated surfaces |
| `steelBlue` | `#3A506B` | UI elements, charts, navigation support and quiet emphasis |
| `electricTeal` | `#22D3EE` | Key actions, active states, progress highlights and important emphasis |
| `particleGold` | `#F2C14E` | Rare accent for particles, discoveries, positive states and high-value highlights |
| `warmGrey` | `#B7B3A8` | Body text, muted content and supporting elements |
| `lightAsh` | `#E6E2D9` | High-contrast text, clean surfaces and light details |
| `energyPurple` | `#8A5CF6` | Sparing special-state highlight for advanced concepts, waves and energy effects |

Physics should feel cosmic, fundamental and energetic — prism light, particle glow, orbital diagrams, gravity, waves and the laws that shape everything. It must be visibly different from Maths: Maths is blueprint blue and diagrammatic; Physics is deep-space navy with electric teal, particle gold and occasional energy purple. Avoid generic blue tech styling and avoid making Physics look like Maths.

### Biology
```
accent:           #6BAA5B
accentSecondary:  #A8C5A2
accentTertiary:   #4C6B3E
background:       #0D0F10
backgroundSecondary: #1B2520
glow:             rgba(107,170,91,0.30)
glowStrong:       rgba(168,197,162,0.18)
progressFill:     #6BAA5B
accentRgb:        107,170,91
```

Extended Biology palette:

| Token | Hex | Usage |
|-------|-----|-------|
| `leafGreen` | `#6BAA5B` | Key actions, selection states, progress highlights and important emphasis |
| `mossGreen` | `#4C6B3E` | Secondary actions, interactive elements and subtle botanical highlights |
| `forest` | `#2E4A35` | Surfaces, cards and overlays to create depth and focus |
| `sage` | `#A8C5A2` | Supporting elements, gentle highlights and positive states |
| `cellMint` | `#A8C5A2` | Cellular accents, microscopy details and soft biological glow |
| `naturalClay` | `#E6E0CF` | Text on dark backgrounds and soft contrasting areas |
| `stone` | `#2B2B28` | Muted text, icons and disabled states |
| `tealAccent` | `#2A9D8F` | Cross-subject consistency and active navigation only |

Biology should feel organic, cellular and calm — moss, sage, microscopy glass, soft living systems and botanical texture. Use greens with intention so they represent life, growth and clarity. Avoid bright app green, slime green or childish science-lab styling.

### Chemistry
```
accent:           #6D5AA6
accentSecondary:  #7E6D9D
accentTertiary:   #54447A
background:       #0D0F12
backgroundSecondary: #14181A
glow:             rgba(109,90,166,0.28)
glowStrong:       rgba(126,109,157,0.18)
progressFill:     #6D5AA6
accentRgb:        109,90,166
```

Extended Chemistry palette:

| Token | Hex | Usage |
|-------|-----|-------|
| `amethyst` | `#6D5AA6` | Key actions, active states, progress highlights and important emphasis |
| `duskPurple` | `#54447A` | Secondary actions, molecule lines, interactive elements and subtle highlights |
| `mutedLilac` | `#7E6D9D` | Supporting elements, soft highlights and scientific accents |
| `slate` | `#3B3A47` | Surfaces, cards and overlays to add structure without neon intensity |
| `parchment` | `#E8E3D6` | Readable content and paper-based elements on dark backgrounds |
| `softGrey` | `#B8B3BC` | Muted text, icons, disabled states and subtle backgrounds |
| `charcoal` | `#0D0F12` | Deep background and strong contrast anchor |
| `tealAccent` | `#2A9D8F` | Cross-subject consistency and active navigation only |

Chemistry should feel considered, intelligent and quietly scientific — smoked violet glass, laboratory reflections and precise molecular structure. Avoid neon purple, gaming purple and excessive glow.

### History
```
accent:           #D69B45
accentSecondary:  #E2B56D
accentTertiary:   #8A5A1F
background:       #0F0B07
backgroundSecondary: #17110B
glow:             rgba(214,155,69,0.34)
accentRgb:        214,155,69
```

### Sociology
```
accent:           #A79B8C
accentSecondary:  #B8B3AA
accentTertiary:   #7B7366
background:       #0D0F10
backgroundSecondary: #1F1E1C
glow:             rgba(167,155,140,0.22)
glowStrong:       rgba(184,179,170,0.14)
progressFill:     #A79B8C
accentRgb:        167,155,140
```

Extended Sociology palette:

| Token | Hex | Usage |
|-------|-----|-------|
| `taupe` | `#A79B8C` | Key actions, selection states, progress highlights and important emphasis |
| `warmStone` | `#7B7366` | Secondary actions, interactive elements and subtle highlights |
| `clay` | `#5B544A` | Surfaces, cards and overlays to create depth and focus |
| `mink` | `#3D3934` | Supportive elements, subtle highlights and muted accents |
| `parchment` | `#E8E3D6` | Text on dark backgrounds and soft contrasting areas |
| `softGrey` | `#B8B3AA` | Muted text, icons and disabled states |
| `charcoal` | `#1F1E1C` | Strong text, icons and depth when used sparingly |
| `tealAccent` | `#2A9D8F` | Cross-subject consistency and active navigation only |

Sociology should feel neutral, grounded and human — linen, concrete, paper, muted photography and documentary stillness. No green. Do not make it golden like History; keep it quieter, more natural and more observational.

### Drama
```
accent:           #8F1F44
accentSecondary:  #C1456D
accentTertiary:   #4E0F24
background:       #12070B
backgroundSecondary: #1B0C12
glow:             rgba(193,69,109,0.32)
accentRgb:        193,69,109
```

### Music
```
accent:           #6E4253
accentSecondary:  #8A5E3B
accentTertiary:   #4B4745
background:       #161516
backgroundSecondary: #241F1D
glow:             rgba(110,66,83,0.26)
glowStrong:       rgba(138,94,59,0.18)
progressFill:     #6E4253
accentRgb:        110,66,83
```

Extended Music palette:

| Token | Hex | Usage |
|-------|-----|-------|
| `pianoBlack` | `#161516` | Primary background, deep musical atmosphere and contrast anchor |
| `smokedWalnut` | `#4B4745` | Muted surfaces, studio materials, card depth and secondary UI structure |
| `dustyPlum` | `#6E4253` | Key actions, active states, progress highlights and important emphasis |
| `burnishedBrass` | `#8A5E3B` | Rare warm accent for instruments, stage light, achievement and special focus |
| `mutedRose` | `#A06A7B` | Supporting highlights, soft musical accents and expressive details |
| `warmIvory` | `#D8C8B8` | High-contrast text, notation paper, sheet music and clean readable detail |
| `velvetShadow` | `#241F1D` | Secondary background, velvet depth and theatrical-studio atmosphere |
| `tealAccent` | `#2A9D8F` | Cross-subject consistency and active navigation only |

Music should feel sophisticated, analogue and atmospheric — piano black, walnut, brass instruments, vinyl sleeves, sheet music, velvet curtains and a warm studio glow. Avoid Spotify Wrapped, TikTok audio, EDM neon, synthwave, cyan waveforms and gaming RGB. Neon/glow may only appear as restrained reflected stage light or selected-state emphasis.

---

## Backwards Compatibility Exports

For components not yet migrated to the full `SUBJECTS` object:

```js
import { SUBJECT_ACCENTS, SUBJECT_PALETTES, hexToRgb } from '../../constants/subjects.js'
```

- `SUBJECT_ACCENTS` — `{ [subject]: accent }` — single accent hex per subject
- `SUBJECT_PALETTES` — `{ [subject]: { accent, rgb } }` — accent + rgb string
- `hexToRgb(hex)` — converts `'#RRGGBB'` to `'r,g,b'` string

These exports exist for legacy compatibility only. New components must use `SUBJECTS` directly.

---

## Subject Emotional Identities

Each subject palette was designed with a specific emotional character:

| Subject | Emotional Identity |
|---------|--------------------|
| Maths | Precise, logical, blueprint blue, graphite and formula-paper clarity |
| English | Rich, literary, readable rosewood, deep oxblood, parchment and ink |
| Physics | Cosmic, fundamental, electric teal, particle gold and deep space |
| Biology | Organic, cellular, moss, sage, microscopy glass and living systems |
| Chemistry | Considered, intelligent, smoked violet glass and molecular precision |
| History | Archival, earthy, warm bronze |
| Sociology | Neutral, grounded, taupe, stone, clay and human observation |
| Drama | Theatrical, crimson intensity |
| Music | Sophisticated, analogue, piano black, walnut, brass and dusty plum |

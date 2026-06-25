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
accent:           #6A343D
accentSecondary:  #8A6A6E
accentTertiary:   #4C242B
background:       #0D0F10
backgroundSecondary: #1F1C1B
glow:             rgba(106,52,61,0.32)
glowStrong:       rgba(138,106,110,0.20)
progressFill:     #6A343D
accentRgb:        106,52,61
```

Extended English palette:

| Token | Hex | Usage |
|-------|-----|-------|
| `oxblood` | `#6A343D` | Key actions, active states, progress highlights and important emphasis |
| `mahogany` | `#4C242B` | Secondary actions, interactive elements and subtle highlights |
| `walnut` | `#3B2626` | Surfaces, cards and overlays to add warmth and depth |
| `dustyRose` | `#8A6A6E` | Supportive elements, subtle highlights and soft accents |
| `parchment` | `#E9E1D3` | Text on dark backgrounds and soft contrasting areas |
| `ink` | `#1F1C1B` | Muted text, icons and disabled states |
| `tealAccent` | `#2A9D8F` | Cross-subject consistency and active navigation only |

English should feel rich, intelligent and literary — dark academic rather than purple neon. Use oxblood with intention. Do not let teal take over English screens.

### Physics
```
accent:           #3DA5FF
accentSecondary:  #74C7FF
accentTertiary:   #1C5D91
background:       #06111C
backgroundSecondary: #0A1726
glow:             rgba(61,165,255,0.34)
accentRgb:        61,165,255
```

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
| `mossGreen` | `#4C6B3E` | Secondary actions, interactive elements and subtle highlights |
| `forest` | `#2E4A35` | Surfaces, cards and overlays to create depth and focus |
| `sage` | `#A8C5A2` | Supporting elements, gentle highlights and positive states |
| `naturalClay` | `#E6E0CF` | Text on dark backgrounds and soft contrasting areas |
| `stone` | `#2B2B28` | Muted text, icons and disabled states |
| `tealAccent` | `#2A9D8F` | Cross-subject consistency and active navigation only |

Biology should feel calm, fresh and organic. Use greens with intention so they represent life, growth and clarity.

### Chemistry
```
accent:           #8B4DFF
accentSecondary:  #B07CFF
accentTertiary:   #44208A
background:       #0B0717
backgroundSecondary: #120D22
glow:             rgba(139,77,255,0.34)
accentRgb:        139,77,255
```

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
backgroundSecondary: #1B2124
glow:             rgba(167,155,140,0.24)
glowStrong:       rgba(184,179,170,0.16)
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

Sociology should feel natural, grounded and human. Use neutrals with intention so they represent connection, understanding and perspective.

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
accent:           #A34DFF
accentSecondary:  #FF4DA6
accentTertiary:   #3D7CFF
background:       #090814
backgroundSecondary: #121022
glow:             rgba(163,77,255,0.32)
accentRgb:        163,77,255
```

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
| English | Rich, literary, oxblood, parchment and ink |
| Physics | Precise, expansive, electric blue |
| Biology | Natural, organic, leaf green, sage and living systems |
| Chemistry | Scientific depth, violet mystery |
| History | Archival, earthy, warm bronze |
| Sociology | Natural, grounded, taupe, stone and human connection |
| Drama | Theatrical, crimson intensity |
| Music | Vibrant, multi-tonal, electric |

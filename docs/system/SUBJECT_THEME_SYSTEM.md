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

---

## Subject Palettes

### Maths
```
accent:           #2CBFA3
accentSecondary:  #72E6CF
accentTertiary:   #1E8F7A
background:       #071917
backgroundSecondary: #0B2220
glow:             rgba(44,191,163,0.35)
accentRgb:        44,191,163
```

### English
```
accent:           #7A284F
accentSecondary:  #A14A73
accentTertiary:   #4A102C
background:       #12070D
backgroundSecondary: #1A0C14
glow:             rgba(161,74,115,0.34)
accentRgb:        161,74,115
```

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
accent:           #4FA36C
accentSecondary:  #7BD89A
accentTertiary:   #2E6844
background:       #08130C
backgroundSecondary: #102017
glow:             rgba(79,163,108,0.34)
accentRgb:        79,163,108
```

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
accent:           #B8A58F
accentSecondary:  #D2C4B3
accentTertiary:   #756858
background:       #11100E
backgroundSecondary: #191715
glow:             rgba(184,165,143,0.28)
accentRgb:        184,165,143
```

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

## Usage Examples

```js
// Basic subject-aware component
const theme = SUBJECTS[subject] || SUBJECTS.History

// Primary accent colour
const accent = theme.accent

// For rgba() in shadows/glows
const rgb = theme.accentRgb
// usage: `rgba(${rgb}, 0.15)`

// Background colour
const bg = theme.background

// Atmospheric glow
const glow = theme.glow

// Progress bar
<div style={{ background: theme.progressFill }} />

// Screen overlay on background image
<div style={{ background: theme.overlay }} />
```

---

## Subject Emotional Identities

Each subject palette was designed with a specific emotional character:

| Subject | Emotional Identity |
|---------|--------------------|
| Maths | Clean, logical, precise |
| English | Rich, literary, deep plum |
| Physics | Precise, expansive, electric blue |
| Biology | Natural, organic, earthy green |
| Chemistry | Scientific depth, violet mystery |
| History | Archival, earthy, warm bronze |
| Sociology | Warm neutral, understated |
| Drama | Theatrical, crimson intensity |
| Music | Vibrant, multi-tonal, electric |

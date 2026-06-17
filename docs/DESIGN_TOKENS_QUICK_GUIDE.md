# Design Tokens Quick Reference

**Never hardcode font sizes, button heights, or spacing.** Always use these helpers.

---

## Headings: Decision Tree

```
Is this the MAIN page title (Home greeting, Subjects page hero)?
  → Use screenHeading() — 34px, bold

Is this a MAJOR section title (e.g., "Weak zones", "Your modules")?
  → Use sectionHeading() — 28px, 600 weight

Is this a CARD or MODULE title?
  → Use cardHeading() — 22px, 600 weight

Is this a small subsection label (e.g., topic name, quiz round)?
  → Use smallHeading() — 16px, 600 weight

Is this standard reading copy or description?
  → Use bodyText() — 18px, 400 weight

Is this small secondary text (timestamps, metadata)?
  → Use smallText() — 16px, 400 weight

Is this a caption or label (UPPERCASE tags, fine print)?
  → Use metadataText() — 14px, 500 weight, +0.08em spacing

Is this a full-screen cinematic moment or editorial reveal?
  → Use cinematicHeading() — 38px, IBM Plex Serif, bold
```

---

## Buttons: Decision Tree

```
Is this the PRIMARY call-to-action (full-width "Continue →")?
  → Use buttonPrimary(accentColor) — 56px tall, accent background
  → Pass the subject accent color: buttonPrimary('#2BBE9A')

Is this a SUPPORTING action (alternative path, "Skip")?
  → Use buttonSecondary() — 56px tall, subtle background

Is this an INLINE action ("Try again", "Show hint")?
  → Use buttonCompact() — 44px tall, minimal weight

Is this a text link or minimal action?
  → Use buttonText() — no background, just text
```

---

## Code Examples

### ❌ Don't Do This

```jsx
// Hardcoding sizes — creates inconsistencies
<h1 style={{ fontSize: '34px', fontWeight: 700, fontFamily: "'Sora', sans-serif" }}>
  Welcome back
</h1>

<button style={{ 
  height: '56px', 
  fontSize: '18px', 
  borderRadius: '18px',
  background: '#2BBE9A'
}}>
  Continue
</button>
```

### ✅ Do This Instead

```jsx
import { 
  screenHeading, 
  buttonPrimary 
} from '@/constants/componentStyles.js'
import { SUBJECT_ACCENTS } from '@/constants/subjects.js'

export function HomePage() {
  return (
    <div>
      <h1 style={screenHeading()}>Welcome back</h1>
      <button style={buttonPrimary(SUBJECT_ACCENTS.Maths)}>
        Continue
      </button>
    </div>
  )
}
```

---

## Common Patterns

### Page with multiple section headings
```jsx
import { 
  screenHeading, 
  sectionHeading, 
  cardHeading,
  buttonPrimary 
} from '@/constants/componentStyles.js'
import { SPACING } from '@/constants/spacing.js'

export function MyPage() {
  return (
    <div style={{ paddingLeft: SPACING.md, paddingRight: SPACING.md }}>
      {/* Page hero */}
      <h1 style={screenHeading()}>Good evening</h1>
      
      {/* Section 1 */}
      <div style={{ marginTop: SPACING.lg }}>
        <h2 style={sectionHeading()}>Your weak zones</h2>
        {/* Cards here */}
      </div>
      
      {/* Section 2 */}
      <div style={{ marginTop: SPACING.lg }}>
        <h2 style={sectionHeading()}>Continue learning</h2>
        {/* Cards here */}
      </div>
      
      {/* CTA */}
      <button style={buttonPrimary('#2BBE9A')}>
        Start module
      </button>
    </div>
  )
}
```

### Card with heading and button
```jsx
import { cardHeading, buttonCompact } from '@/constants/componentStyles.js'
import { SPACING } from '@/constants/spacing.js'

export function ModuleCard() {
  return (
    <div style={{
      background: '#151720',
      borderRadius: '24px',
      padding: SPACING.md,
      border: '1px solid rgba(255, 255, 255, 0.06)',
    }}>
      <h3 style={cardHeading()}>Trust me, I'm Following Jupiter</h3>
      <p style={{ ...bodyText(), marginTop: SPACING.sm }}>
        Medieval medicine: beliefs and causes of disease
      </p>
      <button style={buttonCompact()}>
        Resume
      </button>
    </div>
  )
}
```

---

## Spacing Rules

Import `SPACING` and use these tokens — **never hardcode `16px` or `24px`**:

```javascript
import { SPACING } from '@/constants/spacing.js'

// Usage examples:
marginTop: SPACING.xs    // 4px — icon padding, micro gaps
marginTop: SPACING.sm    // 8px — tight gaps within components
marginTop: SPACING.md    // 16px — standard padding, card padding
marginTop: SPACING.lg    // 24px — section gaps, major breaks
marginTop: SPACING.xl    // 32px — large section breaks
```

---

## When to Create a New Style Helper

Before adding a new helper function, ask:
1. **Does an existing helper fit?** Use that first.
2. **Will this be used 3+ times** across the codebase?
3. **Is this a heading, button, or spacing pattern?**

If all three are "yes", add it to `src/constants/componentStyles.js` and update this guide.

---

## Questions?

- **Full typography details** → See `BRAND.md` section 4
- **Full button specs** → See `BRAND.md` section 8
- **Color tokens** → See `src/constants/subjects.js` (SUBJECT_ACCENTS)
- **Spacing system** → See `src/constants/spacing.js`

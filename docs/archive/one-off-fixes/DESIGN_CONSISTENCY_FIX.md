# Design Consistency Fix: Summary

**Problem Solved:** Inconsistent buttons, headings, and spacing across the app due to hardcoded font sizes and manual styling.

**Solution:** Created a design tokens system with helper functions, documentation, and linting to enforce consistency.

---

## What Was Added

### 1. **`src/constants/componentStyles.js`** ✅
Helper functions that return consistent styles:
- **Headings:** `screenHeading()`, `sectionHeading()`, `cardHeading()`, `smallHeading()`, `cinematicHeading()`
- **Body Text:** `bodyText()`, `smallText()`, `metadataText()`
- **Buttons:** `buttonPrimary(color)`, `buttonSecondary()`, `buttonCompact()`, `buttonText()`
- **Layout:** `screenPadding()`, `sectionGap()`, `cardGap()`

### 2. **`docs/DESIGN_TOKENS_QUICK_GUIDE.md`** ✅
Quick reference for developers with:
- **Decision tree:** "Which heading should I use?"
- **Code examples:** Before/after, common patterns
- **Spacing rules:** When to use `SPACING.xs` vs `SPACING.md`
- **When to add new helpers:** Guidelines for extending the system

### 3. **`eslint-rules/no-hardcoded-design-tokens.js`** ✅
Custom ESLint rule that catches:
- ❌ `fontSize: '24px'` → suggests `sectionHeading()`
- ❌ `height: '56px'` → suggests `BUTTONS.secondary.height`
- ❌ `padding: '16px'` → suggests `SPACING.md`

Runs on `npm run lint` with level: **warn** (doesn't break builds, but flags inconsistencies)

### 4. **Updated `eslint.config.js`** ✅
Integrated the new linting rule into the ESLint pipeline.

---

## How to Use

### Before (❌ Inconsistent)
```jsx
<h2 style={{ fontSize: '28px', fontWeight: 600, fontFamily: "'Sora', sans-serif" }}>
  Weak zones
</h2>
<button style={{ height: '56px', fontSize: '18px', borderRadius: '18px', background: '#2BBE9A' }}>
  Continue
</button>
```

### After (✅ Consistent)
```jsx
import { sectionHeading, buttonPrimary } from '@/constants/componentStyles.js'
import { SUBJECT_ACCENTS } from '@/constants/subjects.js'

<h2 style={sectionHeading()}>Weak zones</h2>
<button style={buttonPrimary(SUBJECT_ACCENTS.Maths)}>Continue</button>
```

---

## What Happens When You Lint

```bash
npm run lint
```

**If you hardcode a design token:**
```
src/App.jsx:1234:15 - warning - Hardcoded fontSize '28px'. 
Use sectionHeading() — TYPE.sectionTitle from componentStyles.js instead.
```

This is a **warning**, not an error — it won't block your build, but it alerts you to inconsistencies.

---

## Benefits

| Problem | Solution |
|---------|----------|
| Developers guess button heights | Use `buttonPrimary()` — always 56px |
| Headings vary wildly in size | Use `sectionHeading()` — always 28px |
| Spacing is inconsistent (16px, 20px, 22px mixed) | Use `SPACING.md`, `SPACING.lg` tokens |
| Hard to onboard new developers | Read 5-min DESIGN_TOKENS_QUICK_GUIDE.md |
| Typos in color values | Use `SUBJECT_ACCENTS` from subjects.js |
| No way to catch mistakes | ESLint rule flags violations automatically |

---

## Next Steps

1. **Start using the helpers immediately** on new components/screens
2. **Gradually migrate** existing components as you touch them
3. **Run `npm run lint`** to see current violations (should be under 50)
4. **Fix violations** one section at a time (start with App.jsx)

---

## Example: Migrating a Component

### Original (with violations)
```jsx
function HomeScreen() {
  return (
    <div style={{ paddingLeft: '20px', paddingRight: '20px' }}>
      <h1 style={{ fontSize: '34px', fontWeight: 700, fontFamily: "'Sora', sans-serif" }}>
        Good evening
      </h1>
      <button style={{ height: '56px', fontSize: '18px', background: '#2BBE9A' }}>
        Continue
      </button>
    </div>
  )
}
```

### Fixed
```jsx
import { screenHeading, buttonPrimary } from '@/constants/componentStyles.js'
import { SPACING } from '@/constants/spacing.js'
import { SUBJECT_ACCENTS } from '@/constants/subjects.js'

function HomeScreen() {
  return (
    <div style={{ paddingLeft: SPACING.md, paddingRight: SPACING.md }}>
      <h1 style={screenHeading()}>Good evening</h1>
      <button style={buttonPrimary(SUBJECT_ACCENTS.Maths)}>Continue</button>
    </div>
  )
}
```

---

## Files Changed

✅ Created:
- `src/constants/componentStyles.js` (6.5 KB)
- `eslint-rules/no-hardcoded-design-tokens.js` (5.5 KB)
- `docs/DESIGN_TOKENS_QUICK_GUIDE.md` (5 KB)

✏️ Modified:
- `eslint.config.js` (added rule import + enabled it)

📝 Already Exists (use these):
- `src/constants/typography.js` (TYPE tokens)
- `src/constants/buttons.js` (BUTTONS tokens)
- `src/constants/spacing.js` (SPACING tokens)
- `BRAND.md` (design reference)

---

## Questions?

- **How do I apply a heading?** → See DESIGN_TOKENS_QUICK_GUIDE.md "Headings: Decision Tree"
- **What if my use case isn't covered?** → Check BRAND.md section 4 (Typography)
- **Can I add a new helper?** → Yes, add to `componentStyles.js` + update the guide
- **Why are lint warnings appearing?** → Run `npm run lint` and fix them as you refactor

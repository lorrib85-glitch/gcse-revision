import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { globSync } from 'glob'

const root = resolve(process.cwd())
const read = (rel) => readFileSync(resolve(root, rel), 'utf8')

// Collect all .jsx and .js files under src/ (excluding node_modules)
const srcFiles = globSync('src/**/*.{jsx,js}', { cwd: root, ignore: ['**/node_modules/**'] })

// Deprecated TYPE alias names — removed from typography.js in Phase 6
const DEPRECATED_ALIASES = [
  'featureText', 'impactTitle', 'cinematic', 'screenHeading', 'hero',
  'sectionHeading', 'sectionTitle', 'cardTitle', 'overlayTitle', 'overlayBody',
  'overlayEyebrow', 'overlayPrompt', 'bodyText', 'bodySmallText', 'metadataText',
  'captionText', 'buttonText', 'examAnswerText', 'examQuestionText',
]

// Module overview/browser files are high-visibility screens and should not reintroduce
// typography drift after the semantic TYPE refactor. fontSize remains intentionally
// allowed because size variants are still chosen per context. lineHeight is not checked
// here because these files use it for icon/chevron glyph alignment rather than text type.
const MODULE_SCREEN_FILES = [
  'src/features/subjects/Subjects.jsx',
  'src/components/layout/ModulePlayer.jsx',
]

const DISALLOWED_MODULE_TYPOGRAPHY_PROPS = [
  'fontWeight',
  'letterSpacing',
  'fontFamily',
]

const CANONICAL_SCREEN_HEADING_COMPONENTS = [
  'src/components/core/ScreenText.jsx',
  'src/components/core/TeachScreenShell.jsx',
]

const DISALLOWED_SCREEN_HEADING_OVERRIDES = [
  'fontFamily',
  'fontSize',
  'fontWeight',
  'lineHeight',
  'letterSpacing',
]

// Build a single regex that matches any deprecated alias used as TYPE.<alias>
// but NOT inside JS template strings (${TYPE.xxx} in CSS-in-JS <style> tags)
const deprecatedPattern = new RegExp(
  `TYPE\\.(${DEPRECATED_ALIASES.join('|')})\\b`,
  'g',
)

// CSS template-string lines are exempt — they use `${TYPE.xxx}` syntax
// and are not reachable at token-lookup time.
function stripTemplateLiteralLines(src) {
  return src
    .split('\n')
    .filter(line => !line.includes('${TYPE.'))
    .join('\n')
}

function stripStyleTagTemplates(src) {
  return src.replace(/<style>\{`[\s\S]*?`\}<\/style>/g, '')
}

function firstHeadingElement(src) {
  return src.match(/<h[12]\b[\s\S]*?<\/h[12]>/)?.[0] ?? ''
}

describe('Typography governance — no deprecated TYPE aliases in JS/JSX style objects', () => {
  for (const rel of srcFiles) {
    it(`${rel} contains no deprecated TYPE aliases`, () => {
      const src = stripTemplateLiteralLines(read(rel))
      const matches = src.match(deprecatedPattern) ?? []
      expect(
        matches,
        `Found deprecated TYPE aliases in ${rel}: ${[...new Set(matches)].join(', ')}`,
      ).toHaveLength(0)
    })
  }
})

describe('Module screen typography governance — no local typography drift', () => {
  for (const rel of MODULE_SCREEN_FILES) {
    it(`${rel} does not hardcode typography props governed by TYPE`, () => {
      const src = stripTemplateLiteralLines(stripStyleTagTemplates(read(rel)))
      const violations = []

      for (const prop of DISALLOWED_MODULE_TYPOGRAPHY_PROPS) {
        const propPattern = new RegExp(`\\b${prop}\\s*:`, 'g')
        const matches = src.match(propPattern) ?? []
        violations.push(...matches.map(match => match.trim()))
      }

      expect(
        violations,
        `Found local typography drift in ${rel}. Use semantic TYPE spreads instead: ${[...new Set(violations)].join(', ')}`,
      ).toHaveLength(0)
    })
  }
})

describe('Canonical non-cinematic screen headings — one shared token, no local type overrides', () => {
  for (const rel of CANONICAL_SCREEN_HEADING_COMPONENTS) {
    it(`${rel} routes its primary heading through TYPE.displayScreen`, () => {
      const heading = firstHeadingElement(read(rel))
      expect(heading, `${rel} must render a primary h1/h2 heading`).not.toBe('')
      expect(heading, `${rel} primary heading must spread TYPE.displayScreen`).toContain('...TYPE.displayScreen')

      for (const prop of DISALLOWED_SCREEN_HEADING_OVERRIDES) {
        expect(
          heading,
          `${rel} overrides ${prop} on its primary heading. TYPE.displayScreen owns the complete non-cinematic title treatment.`,
        ).not.toMatch(new RegExp(`\\b${prop}\\s*:`))
      }
    })
  }
})

// ─── Primary-heading governance ──────────────────────────────────────────────
// Learning components that render their own primary, non-cinematic feature
// heading must use the shared <ScreenTitle> primitive (src/components/core/
// ScreenText.jsx) rather than recreating TYPE.displayScreen locally or
// hardcoding title typography. ScreenTitle owns the full treatment (family,
// size, weight, line-height, letter-spacing, max readable width); callers may
// only pass layout/colour overrides.

// Components whose primary heading is owned by ScreenTitle. Each must keep
// using the primitive and must not re-spread TYPE.displayScreen on local
// heading markup (that is how the second title system crept in originally).
const SCREEN_TITLE_OWNED_COMPONENTS = [
  'src/components/learning/BeforeAfterImageSlider.jsx',
  'src/components/learning/BuilderBlock.jsx',
  'src/components/learning/CentreImageReveal.jsx',
  'src/components/learning/CinematicCarousel.jsx',
  'src/components/learning/ColSortBlock.jsx',
  'src/components/learning/ExaminerExplainsScreen.jsx',
  'src/components/learning/ExplainReveal.jsx',
  'src/components/learning/GuidedAnswerCoach.jsx',
  'src/components/learning/OrderedRouteTask.jsx',
  'src/components/learning/SpotTheError.jsx',
  'src/components/learning/SwipeSort.jsx',
  'src/components/learning/TimelineCanvas.jsx',
  'src/components/learning/TimelineChain.jsx',
  'src/components/learning/WeakSpotRecovery.jsx',
]

// Documented exceptions to the hardcoded-heading detector below. Each entry
// allows an exact number of flagged headings, with the reason on record.
// Adding to this list requires the same justification bar as a cinematic
// component contract — "it looked better bigger" does not qualify.
const HARDCODED_HEADING_EXEMPTIONS = {
  // The serif topic title is WeakSpotRecovery's deliberate cinematic
  // centrepiece (IBM Plex Serif display moment on a full-screen
  // intervention). The screen's primary heading ("Quick recovery?") uses
  // ScreenTitle; only the serif display treatment remains bespoke.
  'src/components/learning/WeakSpotRecovery.jsx': 1,
}

// Matches an <h1>–<h4> opening tag with an inline style object and captures
// the object body. Heading styles in this codebase do not nest object
// literals, so stopping at the first `}}` is safe.
const HEADING_STYLE_PATTERN = /<h[1-4]\b[^>]*style=\{\{([\s\S]*?)\}\}/g

const HEADING_TYPE_PROPS = ['fontSize', 'fontWeight', 'lineHeight', 'letterSpacing', 'fontFamily']

// A locally declared fontSize at or above this threshold is treated as
// primary-title scale. Small card/reference headings (≤21px) stay legal so
// the check does not block legitimate subordinate headings.
const PRIMARY_SCALE_MIN_PX = 22

function localFontSizePx(styleBody) {
  // numeric: fontSize: 42 — clamp/string: fontSize: 'clamp(24px, 7.5vw, 32px)'
  const numeric = styleBody.match(/\bfontSize\s*:\s*(\d+(?:\.\d+)?)\s*[,\n}]/)
  if (numeric) return Number(numeric[1])
  const clampMin = styleBody.match(/\bfontSize\s*:\s*'clamp\(\s*(\d+(?:\.\d+)?)px/)
  if (clampMin) return Number(clampMin[1])
  const px = styleBody.match(/\bfontSize\s*:\s*'(\d+(?:\.\d+)?)px'/)
  if (px) return Number(px[1])
  return null
}

describe('Primary-heading governance — ScreenTitle owns non-cinematic feature headings', () => {
  for (const rel of SCREEN_TITLE_OWNED_COMPONENTS) {
    it(`${rel} renders its primary heading through ScreenTitle`, () => {
      const src = read(rel)
      expect(src, `${rel} must use the shared <ScreenTitle> primitive`).toContain('<ScreenTitle')
      expect(src, `${rel} must import ScreenTitle from core/ScreenText.jsx`).toMatch(
        /import\s*\{[^}]*\bScreenTitle\b[^}]*\}\s*from\s*'[^']*core\/ScreenText\.jsx'/,
      )
      expect(
        src,
        `${rel} spreads TYPE.displayScreen on local markup. The primary heading treatment ` +
        'is owned by <ScreenTitle> — do not recreate it locally.',
      ).not.toContain('...TYPE.displayScreen')
    })
  }

  const learningFiles = globSync('src/{components,features}/**/*.jsx', {
    cwd: root,
    ignore: ['**/node_modules/**', '**/*.stories.jsx'],
  })

  for (const rel of learningFiles) {
    it(`${rel} declares no hardcoded primary-title typography on heading elements`, () => {
      const src = read(rel)
      const violations = []
      let match
      while ((match = HEADING_STYLE_PATTERN.exec(src))) {
        const body = match[1]
        const declared = HEADING_TYPE_PROPS.filter(prop =>
          new RegExp(`\\b${prop}\\s*:`).test(body),
        )
        const sizePx = localFontSizePx(body)
        // Flag heading-scale titles that locally re-declare typography.
        // A single layout-ish adjustment on a token spread stays legal;
        // two or more declared type props at title scale is local drift.
        if (declared.length >= 2 && sizePx !== null && sizePx >= PRIMARY_SCALE_MIN_PX) {
          violations.push(`h-element declares [${declared.join(', ')}] at ${sizePx}px`)
        }
      }

      const allowed = HARDCODED_HEADING_EXEMPTIONS[rel] ?? 0
      expect(
        violations.length,
        `${rel} hardcodes primary-title typography: ${violations.join('; ')}. ` +
        'Use <ScreenTitle> (src/components/core/ScreenText.jsx) for primary feature headings, ' +
        'or a subordinate TYPE token for section/card headings. Documented cinematic ' +
        'exceptions live in HARDCODED_HEADING_EXEMPTIONS.',
      ).toBeLessThanOrEqual(allowed)
    })
  }
})

describe('Typography token map — canonical names are exported', () => {
  const typographyPath = 'src/constants/typography.js'

  it('exports TYPE with all canonical display tokens', () => {
    const src = read(typographyPath)
    const canonicals = [
      'displayHero', 'displayScreen', 'displaySection', 'displayCard',
      'body', 'bodyStrong', 'bodySmall', 'bodyLarge',
      'eyebrow', 'metadata', 'caption', 'button',
      'examQuestion', 'examAnswer',
    ]
    for (const name of canonicals) {
      expect(src, `Missing canonical token: ${name}`).toMatch(
        new RegExp(`\\b${name}:\\s*_${name}\\b`),
      )
    }
  })

  it('locks the verified 390px reference treatment into TYPE.displayScreen', () => {
    const src = read(typographyPath)
    const match = src.match(/const _displayScreen\s*=\s*\{([\s\S]*?)\n\}/)
    const token = match?.[1] ?? ''

    expect(token).toContain("fontSize: 'clamp(24px, 7.5vw, 32px)'")
    expect(token).toContain('lineHeight: 1.10')
    expect(token).toContain('fontWeight: 560')
    expect(token).toContain("letterSpacing: '-0.015em'")
  })

  it('keeps section headings visibly subordinate to the screen heading', () => {
    const src = read(typographyPath)
    const match = src.match(/const _displaySection\s*=\s*\{([\s\S]*?)\n\}/)
    const token = match?.[1] ?? ''

    expect(token).toContain("fontSize: 'clamp(21px, 5.5vw, 28px)'")
    expect(token).toContain('lineHeight: 1.12')
    expect(token).toContain('fontWeight: 560')
  })

  it('has no deprecated alias entries in the TYPE export', () => {
    const src = read(typographyPath)
    // Extract only the TYPE export block to avoid false positives from HEADING_LAYOUT etc.
    const typeBlockMatch = src.match(/export const TYPE\s*=\s*\{([\s\S]*?)\n\}/)
    const typeBlock = typeBlockMatch ? typeBlockMatch[1] : src
    for (const alias of DEPRECATED_ALIASES) {
      expect(typeBlock, `Deprecated alias still present in TYPE: ${alias}`).not.toMatch(
        new RegExp(`^\\s+${alias}:`, 'm'),
      )
    }
  })
})

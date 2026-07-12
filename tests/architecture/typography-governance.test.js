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

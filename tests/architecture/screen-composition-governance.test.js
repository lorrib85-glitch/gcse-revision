import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'fs'
import { resolve, basename } from 'path'
import { globSync } from 'glob'

// Screen-composition governance
// ─────────────────────────────
// Narrow, reliable guardrails behind docs/system/PATTERN_GOVERNANCE.md →
// "Screen-composition routes". These protect the *new* rules from silent
// erosion; they deliberately do NOT try to machine-check visual hierarchy
// (one focal point, subordinate headings, coherent rhythm, justified
// cinematic ownership) — those remain mandatory 390px render-review (👁)
// checks because source inspection cannot decide them. See the render pass
// in PATTERN_GOVERNANCE.md and the content-review skill.

const root = resolve(process.cwd())
const read = (rel) => readFileSync(resolve(root, rel), 'utf8')

// CSS lives in `${...}` template lines and inside <style>{`...`}</style>; those
// are not token-lookup call sites and are stripped before checking, matching
// tests/architecture/typography-governance.test.js.
function stripTemplateLiteralLines(src) {
  return src.split('\n').filter((line) => !line.includes('${')).join('\n')
}
function stripStyleTagTemplates(src) {
  return src.replace(/<style>\{`[\s\S]*?`\}<\/style>/g, '')
}

// ── Guard 1 ──────────────────────────────────────────────────────────────────
// Governed composition components own the screen heading and rhythm through
// TYPE spreads. They must never hardcode fontFamily/fontWeight — that is
// exactly the "invent your own heading treatment" failure the governance
// forbids. Add a component to this list when its contract makes it a
// composition route (classification `composition-route`).
const GOVERNED_COMPOSITION_COMPONENTS = [
  'src/components/core/TeachScreenShell.jsx',
]

const FORBIDDEN_TYPOGRAPHY_PROPS = ['fontFamily', 'fontWeight']

describe('Screen composition — governed composition components use TYPE spreads, not raw type props', () => {
  for (const rel of GOVERNED_COMPOSITION_COMPONENTS) {
    it(`${rel} does not hardcode fontFamily/fontWeight`, () => {
      const src = stripTemplateLiteralLines(stripStyleTagTemplates(read(rel)))
      const violations = []
      for (const prop of FORBIDDEN_TYPOGRAPHY_PROPS) {
        const matches = src.match(new RegExp(`\\b${prop}\\s*:`, 'g')) ?? []
        violations.push(...matches.map((m) => m.trim()))
      }
      expect(
        violations,
        `${rel} hardcodes screen-title typography. Spread a TYPE token instead: ${[...new Set(violations)].join(', ')}`,
      ).toHaveLength(0)
    })
  }
})

// ── Guard 2 ──────────────────────────────────────────────────────────────────
// Every NEW component contract declares its composition classification, and
// any contract that grants full-screen ownership (interaction-owned /
// cinematic) states that grant explicitly. The ten contracts that predate the
// classification requirement are baselined and add the line when next touched
// (shrink-only — see docs/system/component-contracts/README.md).
const APPROVED_CLASSIFICATIONS = [
  'content',
  'interaction-owned',
  'cinematic',
  'composition-route',
]
const OWNERSHIP_GRANT_PHRASE = 'owns full-screen composition'

// Shrink-only. To remove an entry: add the classification declaration to that
// contract and delete it from this list in the same change. Do not add new
// entries — new contracts must declare their classification.
const PRE_CLASSIFICATION_CONTRACTS = [
  'interactive-hotspot-image.md',
  'key-figure-reveal.md',
  'key-point.md',
  'matching-task.md',
  'media-placeholder.md',
  'quick-recall.md',
  'read-blocks.md',
  'worked-example.md',
]

const classificationRe = /\*\*Composition classification:\*\*\s*`?([a-z-]+)`?/

function contractClassification(src) {
  const m = src.match(classificationRe)
  return m ? m[1] : null
}

const contractFiles = globSync('docs/system/component-contracts/*.md', { cwd: root })
  .map((p) => basename(p))
  .filter((name) => name !== 'README.md')

describe('Screen composition — component contracts declare a composition classification', () => {
  it('baseline lists only real contract files (no stale entries)', () => {
    for (const name of PRE_CLASSIFICATION_CONTRACTS) {
      expect(
        existsSync(resolve(root, 'docs/system/component-contracts', name)),
        `Baselined contract no longer exists: ${name} — remove it from PRE_CLASSIFICATION_CONTRACTS`,
      ).toBe(true)
    }
  })

  it('baseline is shrink-only — a baselined contract must not already declare a classification', () => {
    for (const name of PRE_CLASSIFICATION_CONTRACTS) {
      const cls = contractClassification(read(`docs/system/component-contracts/${name}`))
      expect(
        cls,
        `${name} now declares a classification (${cls}) but is still baselined — remove it from PRE_CLASSIFICATION_CONTRACTS`,
      ).toBeNull()
    }
  })

  for (const name of contractFiles) {
    if (PRE_CLASSIFICATION_CONTRACTS.includes(name)) continue
    it(`${name} declares a valid composition classification`, () => {
      const src = read(`docs/system/component-contracts/${name}`)
      const cls = contractClassification(src)
      expect(
        cls,
        `${name} must declare "**Composition classification:** <${APPROVED_CLASSIFICATIONS.join(' | ')}>"`,
      ).not.toBeNull()
      expect(
        APPROVED_CLASSIFICATIONS,
        `${name} declares an unknown classification: ${cls}`,
      ).toContain(cls)

      // Screen-owning classifications must carry the explicit ownership grant.
      if (cls === 'interaction-owned' || cls === 'cinematic') {
        expect(
          src.includes(OWNERSHIP_GRANT_PHRASE),
          `${name} is ${cls} but does not state "${OWNERSHIP_GRANT_PHRASE}" — full-screen ownership must be granted explicitly`,
        ).toBe(true)
      }
    })
  }
})

// ── Guard 3 ──────────────────────────────────────────────────────────────────
// The typography doc must stay reconciled with the live token names so it
// cannot drift back to the removed hero/cinematic display aliases. Positive
// check only (must document the canonical live display tokens) — deliberately
// not a negative regex, so the doc can still name the removed aliases in its
// "do not reintroduce" list without tripping this guard.
describe('Screen composition — typography doc is reconciled with live tokens', () => {
  const doc = 'docs/system/TYPOGRAPHY_SYSTEM.md'
  const CANONICAL_DISPLAY_TOKENS = ['displayHero', 'displayScreen', 'displaySection', 'displayCard']

  it('documents every canonical live display token', () => {
    const src = read(doc)
    for (const token of CANONICAL_DISPLAY_TOKENS) {
      expect(
        src.includes(token),
        `${doc} must document the live token ${token} (reconcile with src/constants/typography.js)`,
      ).toBe(true)
    }
  })
})

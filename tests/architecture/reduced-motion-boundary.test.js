import { describe, it, expect } from 'vitest'
import { readdirSync, readFileSync, statSync, existsSync } from 'fs'
import { resolve, join, relative } from 'path'

const root = resolve(process.cwd())

// ─── The durable ownership rule ──────────────────────────────────────────────
//
// Reduced-motion has exactly four legitimate mechanisms in this codebase:
//
//   1. CSS safety net       — @media (prefers-reduced-motion: reduce) rules.
//                             Independent of JS. Never a violation. Never
//                             removed because a JS hook "already covers it".
//   2. Canonical React hook — src/hooks/usePrefersReducedMotion.js. The single
//                             app-owned reactive source.
//   3. Third-party hook     — useReducedMotion imported from 'motion/react',
//                             inside components already built on Motion.
//   4. One-shot sync read   — window.matchMedia(...).matches read once, for
//                             genuinely one-time behaviour. Must be registered
//                             below with a reason.
//
// A private reactive re-implementation (matchMedia + a change subscription
// owned by a component) is forbidden. That is what this file guards.

const CANONICAL_HOOK = 'src/hooks/usePrefersReducedMotion.js'
const APPROVED_MOTION_PACKAGE = 'motion/react'

// The three files Phase 12 migrated off private implementations.
const MIGRATED_FILES = [
  'src/components/learning/GuidedExamResponse.jsx',
  'src/components/learning/QuoteAnalyser.jsx',
  'src/components/learning/CinematicCarousel.jsx',
]

// Every file allowed to read the preference synchronously without subscribing.
// Each entry states why mid-session reactivity is not needed. A new direct
// reader that is not listed here fails this guard — classify it deliberately
// (one-time event → add it here with a reason; long-lived or repeatable motion
// → use the canonical hook instead).
const APPROVED_ONE_SHOT_READERS = {
  'src/components/core/AnimatedNumber.jsx':
    'one-time count-up, decided when the number scrolls into view',
  'src/components/layout/ChapterCompleteScreen.jsx':
    'one-time score-ring draw, decided at mount',
  'src/components/layout/ChapterOutcomeScreen.jsx':
    'one-time outcome-list entrance, decided at mount and already seeds its visible state from it',
  'src/components/learning/BeforeAfterImageSlider.jsx':
    'one-time entrance; the slider drag itself is direct manipulation, not animation',
  'src/components/learning/CentreImageReveal.jsx':
    'render-time read for a mount-scoped reveal sequence; ring-fenced screen family',
  'src/components/learning/CinematicRevealMoment.jsx':
    'one-time cinematic reveal; autoplay video decision is made once at mount',
  'src/components/learning/MatchingTask.jsx':
    'read at the moment of a one-time scroll-into-view after a round completes — always current',
  'src/components/learning/MedievalDiagnosisScene.jsx':
    'ring-fenced component; one-time intro decision, and callers may override via the prefersReducedMotion prop',
  'src/components/learning/OppositeQualitiesReveal.jsx':
    'module-scope helper for a mount-scoped reveal; its own architecture test governs the component',
  'src/components/learning/OrderedRouteTask.jsx':
    'read at the moment of a one-time scroll-to-bottom on completion — always current',
  'src/components/learning/SpotTheError.jsx':
    'read at the moment of a one-time scroll-into-view when the explain step opens — always current',
  'src/components/learning/SwipeSort.jsx':
    'one-time gesture-response decision, decided at mount for the whole sort',
  'src/components/learning/TheoryCompare.jsx':
    'read at the moment of a one-time scroll/focus move after a reveal — always current',
  'src/components/learning/WhatExaminersLookFor.jsx':
    'read at the moment of a scroll-to-bottom after a reveal — always current',
  'src/features/streaks/StreakCelebrationOverlay.jsx':
    'one-time celebration overlay; replaying it on a mid-celebration preference change is not wanted',
}

const REDUCED_MOTION_QUERY_LITERAL = 'prefers-reduced-motion: reduce'

function walk(dir, results = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) walk(full, results)
    else if (entry.endsWith('.js') || entry.endsWith('.jsx')) results.push(full)
  }
  return results
}

function relPath(file) {
  return relative(root, file).replace(/\\/g, '/')
}

// Storybook stories legitimately stub window.matchMedia to drive a reduced-motion
// story. They are test fixtures, not production preference sources.
function isStoryFixture(rel) {
  return rel.endsWith('.stories.jsx')
}

const sourceFiles = walk(resolve(root, 'src')).map(file => ({
  rel: relPath(file),
  source: readFileSync(file, 'utf8'),
}))

const productionFiles = sourceFiles.filter(file => !isStoryFixture(file.rel))

// A JS read of the preference — matchMedia against the reduced-motion query.
function readsPreferenceInJs({ source }) {
  return source.includes('matchMedia') && source.includes(REDUCED_MOTION_QUERY_LITERAL)
}

// A change subscription of any vintage: modern 'change' listener or the legacy
// addListener/removeListener pair.
function ownsChangeSubscription({ source }) {
  return /addEventListener\(\s*['"]change['"]/.test(source)
    || /\.addListener\s*\(/.test(source)
}

function declaresFunction(source, name) {
  return new RegExp(`(?:function|const|let|var)\\s+${name}\\b`).test(source)
}

describe('reduced-motion ownership boundary', () => {
  it('the canonical hook exists and exposes its testable core', () => {
    const path = resolve(root, CANONICAL_HOOK)
    expect(existsSync(path)).toBe(true)

    const source = readFileSync(path, 'utf8')
    expect(source).toContain('export default function usePrefersReducedMotion')
    expect(source).toContain(REDUCED_MOTION_QUERY_LITERAL)
    expect(source).toContain('export function readPrefersReducedMotion')
    expect(source).toContain('export function subscribeToReducedMotionPreference')
  })

  it('no file outside the canonical hook declares usePrefersReducedMotion', () => {
    const violations = sourceFiles
      .filter(file => file.rel !== CANONICAL_HOOK)
      .filter(file => declaresFunction(file.source, 'usePrefersReducedMotion'))
      .map(file => file.rel)

    expect(violations).toEqual([])
  })

  it('no file declares a private useReducedMotion — it may only be imported from motion/react', () => {
    const violations = sourceFiles
      .filter(file => declaresFunction(file.source, 'useReducedMotion'))
      .map(file => file.rel)

    expect(violations).toEqual([])
  })

  it('importing useReducedMotion from motion/react stays allowed', () => {
    const motionConsumers = productionFiles
      .filter(file => file.source.includes(APPROVED_MOTION_PACKAGE))
      .filter(file => /import[^\n]*\buseReducedMotion\b[^\n]*from\s*['"]motion\/react['"]/.test(file.source))
      .map(file => file.rel)

    // Delegated to the animation library those components already depend on.
    // Not a private re-implementation, and not something to standardise away.
    expect(motionConsumers.length).toBeGreaterThan(0)
  })

  it('only the canonical hook owns a reactive reduced-motion subscription', () => {
    const violations = productionFiles
      .filter(file => file.rel !== CANONICAL_HOOK)
      .filter(readsPreferenceInJs)
      .filter(ownsChangeSubscription)
      .map(file => file.rel)

    expect(violations).toEqual([])
  })

  it('every one-shot synchronous reader is classified with a reason', () => {
    const unclassified = productionFiles
      .filter(file => file.rel !== CANONICAL_HOOK)
      .filter(readsPreferenceInJs)
      .filter(file => !ownsChangeSubscription(file))
      .filter(file => !(file.rel in APPROVED_ONE_SHOT_READERS))
      .map(file => file.rel)

    expect(unclassified).toEqual([])
  })

  it('the one-shot register has no stale or unexplained entries', () => {
    const currentOneShotReaders = new Set(
      productionFiles
        .filter(file => file.rel !== CANONICAL_HOOK)
        .filter(readsPreferenceInJs)
        .filter(file => !ownsChangeSubscription(file))
        .map(file => file.rel),
    )

    const stale = Object.keys(APPROVED_ONE_SHOT_READERS)
      .filter(rel => !currentOneShotReaders.has(rel))
    expect(stale).toEqual([])

    const missingReason = Object.entries(APPROVED_ONE_SHOT_READERS)
      .filter(([, reason]) => !reason || !reason.trim())
      .map(([rel]) => rel)
    expect(missingReason).toEqual([])
  })

  it('the migrated files import the canonical hook', () => {
    const missing = MIGRATED_FILES.filter(rel => {
      const source = readFileSync(resolve(root, rel), 'utf8')
      return !/import\s+usePrefersReducedMotion\s+from\s*['"][^'"]*hooks\/usePrefersReducedMotion\.js['"]/.test(source)
    })

    expect(missing).toEqual([])
  })

  it('the migrated files hold no private reduced-motion state or listener', () => {
    const violations = MIGRATED_FILES.filter(rel => {
      const source = readFileSync(resolve(root, rel), 'utf8')
      return /set(?:Reduced|Reduce|PrefersReduced)Motion\b/.test(source)
        || source.includes('matchMedia')
    })

    expect(violations).toEqual([])
  })

  it('CSS reduced-motion safety nets are not treated as duplicate ownership', () => {
    const cssRule = /@media\s*\(\s*prefers-reduced-motion:\s*reduce\s*\)/

    const globals = readFileSync(resolve(root, 'src/globals.css'), 'utf8')
    expect(cssRule.test(globals)).toBe(true)

    const componentLocalRules = sourceFiles.filter(file => cssRule.test(file.source))
    expect(componentLocalRules.length).toBeGreaterThan(1)

    // Files whose only reduced-motion handling is a CSS rule are legitimate and
    // must never need a JS classification. Every other test in this file
    // reaches its verdict through readsPreferenceInJs, which they fail — so
    // their existence here is what proves CSS is not treated as JS ownership.
    const cssOnlyFiles = componentLocalRules.filter(file => !readsPreferenceInJs(file))
    expect(cssOnlyFiles.length).toBeGreaterThan(0)
  })
})

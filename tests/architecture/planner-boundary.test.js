/**
 * Architecture guard: one planner source of truth (backlog A17, Phase 11).
 *
 * There are two planner files and they are NOT duplicates:
 *
 *   src/todaysPlan.js
 *     The live, lightweight Home plan/card builder. Home and ExamMode read it.
 *
 *   src/features/planner/dailyPlanner.js
 *     The full scheduling engine — weekday/weekend duration budgeting, weak-point
 *     lifecycle, subject rotation, paper-result processing. Deliberately parked
 *     and unrouted until F4, because it expects `userProfile.selectedSubjects`
 *     and the app has no subject-selection onboarding to populate it.
 *
 * `.planning/backlog/planner-engine-decision.md` is the authoritative decision
 * record: "Do not create two competing planner source-of-truth systems."
 *
 * This guard pins that decision as it stands today. It does not freeze the
 * parked engine forever — F4 may activate it, and doing so means updating this
 * file on purpose rather than discovering months later that the app quietly
 * grew a second planner. Nothing here constrains either planner's contents:
 * no line counts, no export names, no function lists.
 */

import { describe, it, expect } from 'vitest'
import { existsSync, readFileSync } from 'fs'
import { resolve, dirname, join, relative } from 'path'
import { fileURLToPath } from 'url'
import { globSync } from 'glob'

// Resolve from this file, not process.cwd(), so the guard holds however the
// runner is launched.
const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..', '..')

const SRC             = join(root, 'src')
const PLANNER_DIR     = join(SRC, 'features', 'planner')
const PARKED_PLANNER  = join(PLANNER_DIR, 'dailyPlanner.js')
const LIVE_PLAN       = join(SRC, 'todaysPlan.js')
const DUPLICATE_PATH  = join(SRC, 'dailyPlanner.js')

const rel = (abs) => relative(root, abs).replace(/\\/g, '/')

const ACTIVATION_NOTE =
  'Wiring the full engine into the app is an F4 decision, not a refactor. It needs: ' +
  '(1) the F4 product decision, (2) selected-subject onboarding that populates ' +
  '`userProfile.selectedSubjects`, and (3) a deliberate update to this architecture ' +
  'boundary. Until all three exist, `src/todaysPlan.js` is the only planner the app reads.'

// ─── The two files, and the path that must stay gone ──────────────────────────

describe('planner files — canonical locations', () => {
  it('has no src/dailyPlanner.js (the old duplicate path)', () => {
    expect(
      existsSync(DUPLICATE_PATH),
      'src/dailyPlanner.js must not exist. The scheduling engine lives at ' +
      'src/features/planner/dailyPlanner.js; a second copy at the src root is how ' +
      'two competing planners start.',
    ).toBe(false)
  })

  it('keeps the parked scheduling engine at src/features/planner/dailyPlanner.js', () => {
    expect(
      existsSync(PARKED_PLANNER),
      'src/features/planner/dailyPlanner.js is retained on purpose (see ' +
      '.planning/backlog/planner-engine-decision.md) — it is the F4 starting point, ' +
      'not dead code to delete.',
    ).toBe(true)
  })

  it('keeps the live Home plan builder at src/todaysPlan.js', () => {
    expect(
      existsSync(LIVE_PLAN),
      'src/todaysPlan.js builds the live Home plan. Home and ExamMode read it.',
    ).toBe(true)
  })
})

// ─── Import scanning ──────────────────────────────────────────────────────────

/**
 * Every module specifier in a source file: static imports, side-effect imports,
 * `export ... from` re-exports (how a barrel file would leak the planner) and
 * dynamic `import()`.
 */
function specifiersIn(src) {
  const patterns = [
    /import\s+(?:[\s\S]*?\s+from\s+)?['"]([^'"]+)['"]/g,  // import x from '…' / import '…'
    /export\s+(?:\*|\{[\s\S]*?\})\s*from\s*['"]([^'"]+)['"]/g,  // export … from '…'  (barrels)
    /import\s*\(\s*['"]([^'"]+)['"]\s*\)/g,               // import('…')
  ]

  const found = new Set()
  for (const pattern of patterns) {
    for (const [, specifier] of src.matchAll(pattern)) found.add(specifier)
  }
  return [...found]
}

/**
 * Resolve a specifier to an absolute path when it points inside this repo.
 * Handles relative specifiers and the `@` → `src` alias from vite.config.js.
 * Bare package specifiers resolve to null — they can never be the planner.
 */
function resolveSpecifier(specifier, fromFile) {
  if (specifier.startsWith('.')) return resolve(dirname(fromFile), specifier)
  if (specifier.startsWith('@/')) return resolve(SRC, specifier.slice(2))
  return null
}

/** True when a resolved path refers to the parked planner, with or without its extension. */
function isParkedPlanner(resolved) {
  if (!resolved) return false
  const withoutExtension = resolved.replace(/\.jsx?$/, '')
  return withoutExtension === PARKED_PLANNER.replace(/\.js$/, '')
}

const jsFilesUnder = (dir) =>
  globSync('**/*.{js,jsx}', { cwd: dir, ignore: ['**/node_modules/**'], absolute: true })

const srcFiles = jsFilesUnder(SRC)

function importersOfParkedPlanner(files) {
  return files
    .filter((file) => {
      const src = readFileSync(file, 'utf8')
      return specifiersIn(src).some((s) => isParkedPlanner(resolveSpecifier(s, file)))
    })
    .map(rel)
}

// ─── The boundary itself ──────────────────────────────────────────────────────

describe('planner boundary — the parked engine is not wired into the app', () => {
  it('sanity check: the scan can actually see an import of the parked planner', () => {
    // Guards the guard. If specifier resolution ever silently stops matching,
    // every assertion below would pass vacuously. The parked planner's own unit
    // test imports it, so this must find exactly that file.
    const testImporters = importersOfParkedPlanner(jsFilesUnder(join(root, 'tests')))

    expect(
      testImporters,
      'The import scan found no importer of the parked planner anywhere, including ' +
      'its own unit test — resolution is broken and the assertions below prove nothing.',
    ).toContain('tests/unit/planner/dailyPlanner.test.js')
  })

  it('is imported by no source file outside src/features/planner/', () => {
    const outsiders = importersOfParkedPlanner(
      srcFiles.filter((file) => !file.startsWith(PLANNER_DIR + '/')),
    )

    expect(
      outsiders,
      `${outsiders.join(', ')} imports src/features/planner/dailyPlanner.js. The full ` +
      `scheduling engine is parked and must not be reached from app code. ${ACTIVATION_NOTE}`,
    ).toEqual([])
  })

  it('is not re-exported by any barrel file in src/', () => {
    // Covered by the scan above (a barrel's `export … from` is scanned like an
    // import), but asserted separately so a barrel leak fails with its own name:
    // re-exporting the planner would route it into the app without any file
    // appearing to "import" it.
    const barrels = srcFiles.filter(
      (file) => /\/index\.jsx?$/.test(file) && !file.startsWith(PLANNER_DIR + '/'),
    )

    expect(
      importersOfParkedPlanner(barrels),
      'A barrel file re-exports the parked planner, which routes it into the app ' +
      `indirectly. ${ACTIVATION_NOTE}`,
    ).toEqual([])
  })

  it('the live Home plan does not import the parked engine', () => {
    const specifiers = specifiersIn(readFileSync(LIVE_PLAN, 'utf8'))

    expect(
      specifiers.some((s) => isParkedPlanner(resolveSpecifier(s, LIVE_PLAN))),
      'src/todaysPlan.js must not import src/features/planner/dailyPlanner.js. The live ' +
      'Home plan stays lightweight and self-contained; it is not a front end for the ' +
      `parked engine. ${ACTIVATION_NOTE}`,
    ).toBe(false)
  })

  it('the parked engine does not import the live Home plan', () => {
    const specifiers = specifiersIn(readFileSync(PARKED_PLANNER, 'utf8'))
    const livePlanPath = LIVE_PLAN.replace(/\.js$/, '')

    const importsLivePlan = specifiers.some((s) => {
      const resolved = resolveSpecifier(s, PARKED_PLANNER)
      return resolved !== null && resolved.replace(/\.jsx?$/, '') === livePlanPath
    })

    expect(
      importsLivePlan,
      'src/features/planner/dailyPlanner.js must not import src/todaysPlan.js. The two ' +
      'planners have different responsibilities and must not become entangled — coupling ' +
      'them in either direction creates the competing source of truth the decision record forbids.',
    ).toBe(false)
  })
})

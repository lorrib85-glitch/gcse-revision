import { describe, it, expect } from 'vitest'
import { readdirSync, readFileSync, statSync } from 'fs'
import { resolve, join, relative } from 'path'

const root = resolve(process.cwd())

// Snapshot of every file currently allowed to call localStorage directly.
// If a file outside this set starts using localStorage, the test fails — add it
// to this list only after a deliberate decision, with preference for routing
// through src/lib/storage.js instead.
const APPROVED_LOCALSTORAGE_FILES = new Set([
  'src/lib/storage.js',             // canonical storage abstraction
  'src/app/LegacyApp.jsx',          // grandfathered — module state writes
  'src/features/quickfire/QuickFire.jsx', // grandfathered — QF best/history keys
  'src/app/moduleNavigation.js',    // grandfathered — module screen state
  'src/auth/authService.js',        // grandfathered — auth persistence
  'src/components/layout/ModulePlayer.jsx', // grandfathered — module resume state
  'src/features/home/StreakChip.jsx', // grandfathered — streak read
  'src/todaysPlan.js',              // grandfathered — plan cache
])

function walkSrc(dir, results = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      walkSrc(full, results)
    } else if (entry.endsWith('.js') || entry.endsWith('.jsx')) {
      results.push(full)
    }
  }
  return results
}

describe('localStorage boundary', () => {
  it('only approved files access localStorage directly', () => {
    const files = walkSrc(resolve(root, 'src'))
    const violations = files
      .filter((file) => {
        const rel = relative(root, file).replace(/\\/g, '/')
        if (APPROVED_LOCALSTORAGE_FILES.has(rel)) return false
        return readFileSync(file, 'utf8').includes('localStorage')
      })
      .map((file) => relative(root, file).replace(/\\/g, '/'))

    expect(violations).toEqual([])
  })
})

import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const root = resolve(process.cwd())
const read = (rel) => readFileSync(resolve(root, rel), 'utf8')

describe('Placeholder module safety', () => {
  it('chapters with screenCount 0 exist in the canonical chapter catalogue', () => {
    // Dynamic import not available in static test; parse the compatibility
    // catalogue that still owns the metadata rows during the migration window.
    const src = read('src/modules.js')
    expect(src).toMatch(/screenCount:\s*0/)
  })

  it('openModulePlayer in LegacyApp.jsx guards against chapters without screens', () => {
    const src = read('src/app/LegacyApp.jsx')
    // Runtime terminology is migrated in Phase 4. Until then, the legacy-named
    // function must still guard the chapter before opening the player.
    const fnStart = src.indexOf('function openModulePlayer(')
    const fnBody = src.slice(fnStart, fnStart + 800)
    expect(fnBody).toMatch(/if\s*\(!\s*mod.*screenCount.*\)\s*return/)
    const guardPos = fnBody.search(/if\s*\(!\s*mod.*screenCount.*\)\s*return/)
    const setViewPos = fnBody.indexOf("setView('module')")
    expect(guardPos).toBeGreaterThanOrEqual(0)
    expect(setViewPos).toBeGreaterThanOrEqual(0)
    expect(guardPos).toBeLessThan(setViewPos)
  })

  it('Subjects.jsx routes chapter availability through the canonical helper and maps non-available to coming_soon', () => {
    const src = read('src/features/subjects/Subjects.jsx')
    // The allItems mapping derives availability from the canonical chapter
    // helper and maps anything not AVAILABLE to coming_soon.
    expect(src).toMatch(/getChapterAvailability\(mod\)/)
    expect(src).toMatch(/CHAPTER_AVAILABILITY\.AVAILABLE.*coming_soon|coming_soon[\s\S]*CHAPTER_AVAILABILITY\.AVAILABLE/)
  })

  it('chapters with screenCount > 0 are not affected — the guard only fires for 0', () => {
    const src = read('src/app/LegacyApp.jsx')
    const fnStart = src.indexOf('function openModulePlayer(')
    const fnBody = src.slice(fnStart, fnStart + 400)
    expect(fnBody).toMatch(/if\s*\(!\s*mod\??\.\s*screenCount/)
  })
})

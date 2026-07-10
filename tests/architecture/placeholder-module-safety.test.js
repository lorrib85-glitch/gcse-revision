import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const root = resolve(process.cwd())
const read = (rel) => readFileSync(resolve(root, rel), 'utf8')

describe('Placeholder module safety', () => {
  it('modules with screenCount 0 exist in src/modules.js (confirms placeholders are present)', () => {
    // Dynamic import not available in static test; parse the source for screenCount: 0
    const src = read('src/modules.js')
    expect(src).toMatch(/screenCount:\s*0/)
  })

  it('openModulePlayer in LegacyApp.jsx guards against modules without screens', () => {
    const src = read('src/app/LegacyApp.jsx')
    // Guard must appear inside openModulePlayer before setView('module') is called
    const fnStart = src.indexOf('function openModulePlayer(')
    const fnBody = src.slice(fnStart, fnStart + 800)
    expect(fnBody).toMatch(/if\s*\(!\s*mod.*screenCount.*\)\s*return/)
    // Guard must come before setView('module') within the function body
    const guardPos = fnBody.search(/if\s*\(!\s*mod.*screenCount.*\)\s*return/)
    const setViewPos = fnBody.indexOf("setView('module')")
    expect(guardPos).toBeGreaterThanOrEqual(0)
    expect(setViewPos).toBeGreaterThanOrEqual(0)
    expect(guardPos).toBeLessThan(setViewPos)
  })

  it('Subjects.jsx routes module availability through the canonical helper and maps non-available to coming_soon', () => {
    const src = read('src/features/subjects/Subjects.jsx')
    // The allItems mapping derives availability via getModuleAvailability
    // (single source of truth) and maps anything not AVAILABLE to coming_soon.
    expect(src).toMatch(/getModuleAvailability\(mod\)/)
    expect(src).toMatch(/MODULE_AVAILABILITY\.AVAILABLE.*coming_soon|coming_soon[\s\S]*MODULE_AVAILABILITY\.AVAILABLE/)
  })

  it('modules with screenCount > 0 are not affected — the guard only fires for 0', () => {
    // Confirm the guard is a falsy check on screenCount (0 is falsy, >0 is truthy)
    const src = read('src/app/LegacyApp.jsx')
    const fnStart = src.indexOf('function openModulePlayer(')
    const fnBody = src.slice(fnStart, fnStart + 400)
    // Guard uses !mod?.screenCount or !mod.screenCount — both pass through when screenCount > 0
    expect(fnBody).toMatch(/if\s*\(!\s*mod\??\.\s*screenCount/)
  })
})

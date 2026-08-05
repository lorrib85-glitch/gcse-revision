import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const root = resolve(process.cwd())
const read = (rel) => readFileSync(resolve(root, rel), 'utf8')

describe('Placeholder chapter safety', () => {
  it('the canonical chapter catalogue contains governed unbuilt chapters', async () => {
    // Asserted on the exported data, not on the source text: since Stage 4
    // src/chapters.js re-exports the generated projection, so the rows are no
    // longer literals in this file. What matters is unchanged — the catalogue
    // still carries unbuilt chapters and still exposes the availability enum.
    const { CHAPTERS, CHAPTER_AVAILABILITY } = await import('../../src/chapters.js')
    expect(Array.isArray(CHAPTERS)).toBe(true)
    expect(CHAPTERS.filter(chapter => chapter.screenCount === 0).length).toBeGreaterThan(0)
    expect(CHAPTER_AVAILABILITY).toEqual({
      AVAILABLE: 'available', COMING_SOON: 'comingSoon', HIDDEN: 'hidden',
    })
  })

  it('openChapterPlayer guards against chapters without screens before opening the overlay', () => {
    const src = read('src/app/LegacyApp.jsx')
    const fnStart = src.indexOf('function openChapterPlayer(')
    const fnBody = src.slice(fnStart, fnStart + 800)
    const guardPattern = /if\s*\(!\s*chapter\??\.\s*screenCount\s*\)\s*return/
    expect(fnBody).toMatch(guardPattern)
    const guardPos = fnBody.search(guardPattern)
    const setViewPos = fnBody.indexOf("setView('chapter')")
    expect(guardPos).toBeGreaterThanOrEqual(0)
    expect(setViewPos).toBeGreaterThanOrEqual(0)
    expect(guardPos).toBeLessThan(setViewPos)
  })

  it('generated navigation openability maps to browser coming-soon state', () => {
    const adapter = read('src/features/subjects/subjectNavigationAdapter.js')
    const subjects = read('src/features/subjects/Subjects.jsx')
    expect(adapter).toContain('comingSoon: !card.openable')
    expect(adapter).toContain('openable: card.openable')
    expect(subjects).toMatch(/if\s*\(!item\.openable\)[\s\S]*status:\s*'coming_soon'/)
  })

  it('the guard is a falsy screenCount check, so built chapters pass through', () => {
    const src = read('src/app/LegacyApp.jsx')
    const fnStart = src.indexOf('function openChapterPlayer(')
    const fnBody = src.slice(fnStart, fnStart + 400)
    expect(fnBody).toMatch(/if\s*\(!\s*chapter\??\.\s*screenCount/)
  })
})

import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const root = resolve(process.cwd())
const read = (rel) => readFileSync(resolve(root, rel), 'utf8')

describe('Placeholder chapter safety', () => {
  it('the canonical chapter catalogue contains governed unbuilt chapters', () => {
    const metadata = read('src/chapters.js')
    expect(metadata).toContain('export const CHAPTERS = [')
    expect(metadata).toMatch(/screenCount:\s*0/)
    expect(metadata).toContain('export const CHAPTER_AVAILABILITY')
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

  it('Subjects uses canonical chapter availability and maps non-available chapters to coming_soon', () => {
    const src = read('src/features/subjects/Subjects.jsx')
    expect(src).toMatch(/getChapterAvailability\((mod|chapter)\)/)
    expect(src).toMatch(/CHAPTER_AVAILABILITY\.AVAILABLE.*coming_soon|coming_soon[\s\S]*CHAPTER_AVAILABILITY\.AVAILABLE/)
  })

  it('the guard is a falsy screenCount check, so built chapters pass through', () => {
    const src = read('src/app/LegacyApp.jsx')
    const fnStart = src.indexOf('function openChapterPlayer(')
    const fnBody = src.slice(fnStart, fnStart + 400)
    expect(fnBody).toMatch(/if\s*\(!\s*chapter\??\.\s*screenCount/)
  })
})

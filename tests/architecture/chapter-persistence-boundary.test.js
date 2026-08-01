import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

// ChapterPlayer's persistence seam (architecture-backlog A4).
//
// Every chapter-state write the player makes must go through one of the two
// canonical builders in src/app/chapterNavigation.js, and reach storage only
// through the public progress API. These are targeted assertions on imports and
// call sites — deliberately not a source snapshot, so ordinary edits to
// ChapterPlayer's rendering do not fail this file.

const root = resolve(process.cwd())
const read = rel => readFileSync(resolve(root, rel), 'utf8')

const PLAYER = 'src/components/layout/ChapterPlayer.jsx'
const NAVIGATION = 'src/app/chapterNavigation.js'

describe('chapter persistence boundary — canonical builders', () => {
  it('chapterNavigation.js exports both persisted-state builders', () => {
    const source = read(NAVIGATION)
    expect(source).toMatch(/export function buildChapterProgressState\(/)
    expect(source).toMatch(/export function buildCompletedChapterState\(/)
  })

  it('the builders stay pure — chapterNavigation.js never touches storage or the progress store', () => {
    const source = read(NAVIGATION)
    expect(source).not.toMatch(/localStorage/)
    expect(source).not.toMatch(/from\s+['"][^'"]*(?:lib\/storage|progress)\.js['"]/)
  })

  it('ChapterPlayer imports both builders from chapterNavigation.js', () => {
    const source = read(PLAYER)
    const importLine = source.match(/^import \{[^}]*\} from '\.\.\/\.\.\/app\/chapterNavigation\.js'$/m)
    expect(importLine, 'ChapterPlayer must import from ../../app/chapterNavigation.js').toBeTruthy()
    expect(importLine[0]).toContain('buildChapterProgressState')
    expect(importLine[0]).toContain('buildCompletedChapterState')
  })
})

describe('chapter persistence boundary — ChapterPlayer call sites', () => {
  const source = read(PLAYER)
  const saveCalls = [...source.matchAll(/saveChapterState\(\s*chapter\.id\s*,\s*([A-Za-z{[])/g)].map(m => m[1])

  it('the autosave effect saves the regular progress snapshot', () => {
    expect(source).toMatch(/saveChapterState\(chapter\.id, buildChapterProgressState\(\{/)
  })

  it('the completion path saves the completion snapshot', () => {
    expect(source).toMatch(/saveChapterState\(chapter\.id, buildCompletedChapterState\(\{/)
  })

  it('defines no inline persisted-state object literal — every save goes through a builder', () => {
    expect(saveCalls).not.toContain('{')
    expect(saveCalls).not.toContain('[')
    expect(saveCalls.length).toBeGreaterThan(0)
  })

  it('completeChapter accepts the attempts to persist, so an examiner completion cannot save stale attempts', () => {
    expect(source).toMatch(/function completeChapter\(attempts = examinerAttempts\)/)
    expect(source).toMatch(/buildCompletedChapterState\(\{ total, examinerAttempts: attempts \}\)/)
    expect(source).toMatch(/completeChapter\(updated\)/)
  })

  it('reads and writes chapter state only through the public progress API', () => {
    expect(source).toMatch(/import \{[^}]*getChapterState[^}]*saveChapterState[^}]*\} from '\.\.\/\.\.\/progress\.js'/)
    expect(source).not.toMatch(/localStorage/)
  })
})

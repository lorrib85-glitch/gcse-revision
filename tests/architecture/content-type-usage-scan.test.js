import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import {
  contentModulePaths,
  countTypeUsage,
  scanContentTypeUsage,
  usageByAuthoringKey,
} from '../../scripts/scan-content-type-usage.mjs'
import { SCREEN_REGISTRY, BLOCK_REGISTRY } from '../../src/data/screenRegistry.js'

// The content usage scan is the evidence base for every usage figure the
// Component Lab shows, and under D1 it is drift-checked like any other
// generated fact. That makes its accuracy load-bearing: a wrong count is now a
// wrong committed value, not just wrong prose.
//
// It replaces a regex over `type:`, which was wrong in two ways the Phase 4
// census could see and one it could not:
//   • it missed uses authored with the other quoting style entirely;
//   • it could not tell a screen type from a block type;
//   • it counted nested question shapes that are not authoring types at all.

const root = resolve(process.cwd())
const read = path => readFileSync(resolve(root, path), 'utf8')

const scan = await scanContentTypeUsage()
const byKey = usageByAuthoringKey(scan)

describe('the scan is deterministic', () => {
  it('reads a stable, sorted set of content modules', () => {
    const paths = contentModulePaths()
    expect(paths.length).toBeGreaterThan(60)
    expect([...paths].sort()).toEqual(paths)
    expect(paths).not.toContain('src/content/chapterContentRegistry.js')
  })

  it('produces sorted keys and the same result twice', async () => {
    for (const level of ['screens', 'blocks']) {
      const keys = Object.keys(scan[level])
      expect([...keys].sort(), level).toEqual(keys)
    }
    expect(await scanContentTypeUsage()).toEqual(scan)
  })

  it('has no clock, environment read or randomness in the scanner', () => {
    const source = read('scripts/scan-content-type-usage.mjs')
    for (const forbidden of ['new Date', 'Date.now', 'toISOString', 'process.env', 'Math.random']) {
      expect(source, forbidden).not.toContain(forbidden)
    }
  })
})

describe('the scan recognises the authoring syntax accurately', () => {
  // The three the naive regex missed outright, because they are authored in the
  // other quoting style. Loading the modules makes quoting irrelevant.
  it.each([
    ['spotTheError', 1],
    ['builder', 1],
    ['acronymMemorise', 1],
  ])('counts block:%s exactly %i time', (type, expected) => {
    expect(scan.blocks[type]?.occurrences ?? 0).toBe(expected)
  })

  it('confirms the two most-used authorable types', () => {
    expect(scan.blocks.read.occurrences).toBe(261)
    expect(scan.blocks.quiz.occurrences).toBe(224)
  })

  it('excludes nested question shapes, which are not authoring types', () => {
    // These live inside a quiz block's own data, never in a `blocks` array, so
    // the structural walk never reaches them — no exclusion list required.
    for (const type of ['choice', 'truefalse', 'connection']) {
      expect(SCREEN_REGISTRY[type], type).toBeUndefined()
      expect(BLOCK_REGISTRY[type], type).toBeUndefined()
      expect(scan.blocks[type], type).toBeUndefined()
      expect(scan.screens[type], type).toBeUndefined()
    }
  })
})

describe('the scan distinguishes screen and block levels', () => {
  it('splits timelineChain the way the runtime does', () => {
    // The census's regex reported "8 uses, attributed to block:timelineChain".
    // Both halves were wrong: the uses are screens, and there are ten of them.
    expect(scan.screens.timelineChain.occurrences).toBe(10)
    expect(scan.blocks.timelineChain).toBeUndefined()
  })

  it('splits misconceptionCheck the way the runtime does', () => {
    // This is the measurement behind D0: nobody authors the screen type, so the
    // screen entry is a derived route rather than a second authoring choice.
    expect(scan.blocks.misconceptionCheck.occurrences).toBe(21)
    expect(scan.screens.misconceptionCheck).toBeUndefined()
  })

  it('counts an omitted screen type as the standard screen it resolves to', () => {
    // `screen:standard` looked unused under the regex because it is the
    // default. It is in fact the most authored screen in the app.
    expect(scan.screens.standard.occurrences).toBeGreaterThan(200)
  })

  it('keys usage the same way the Lab projection does', () => {
    expect(byKey['block:read']).toEqual(scan.blocks.read)
    expect(byKey['screen:timelineChain']).toEqual(scan.screens.timelineChain)
    expect([...Object.keys(byKey)].sort()).toEqual(Object.keys(byKey))
  })
})

describe('the counting is exercised directly', () => {
  const chapters = [
    {
      path: 'a.js',
      chapter: {
        screens: [
          { type: 'quickRecall', questions: [] },
          { blocks: [{ type: 'read', text: 'x' }, { type: 'read', text: 'y' }] },
          { type: 'standard', blocks: [{ type: 'keypoint' }] },
        ],
      },
    },
    { path: 'b.js', chapter: { screens: [{ blocks: [{ type: 'read', text: 'z' }] }] } },
  ]

  it('counts occurrences and distinct files separately', () => {
    const counted = countTypeUsage(chapters)
    expect(counted.blocks.read).toEqual({ occurrences: 3, files: 2 })
    expect(counted.blocks.keypoint).toEqual({ occurrences: 1, files: 1 })
    expect(counted.screens.standard).toEqual({ occurrences: 3, files: 2 })
    expect(counted.screens.quickRecall).toEqual({ occurrences: 1, files: 1 })
  })

  it('ignores malformed screens and blocks rather than throwing', () => {
    const counted = countTypeUsage([{ path: 'c.js', chapter: { screens: [null, 'x', { blocks: [null, {}, 7] }] } }])
    expect(counted.blocks).toEqual({})
    expect(counted.screens.standard).toEqual({ occurrences: 1, files: 1 })
  })
})

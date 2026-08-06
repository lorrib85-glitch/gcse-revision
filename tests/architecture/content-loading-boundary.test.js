import { describe, expect, it } from 'vitest'
import { readFileSync, readdirSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  CURRICULUM_CHAPTERS,
  CHAPTER_CONTENT_LOADERS,
} from '../../src/data/learnerCurriculum.js'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..')

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) return walk(full)
    return /\.(js|jsx)$/.test(entry.name) ? [full] : []
  })
}

const allSrcFiles = walk(resolve(root, 'src'))
const generated = resolve(root, 'src/data/generated/curriculum/learnerCurriculum.js')
const boundary = resolve(root, 'src/data/learnerCurriculum.js')

describe('content-loading boundary', () => {
  it('keeps the loader registry generated once and exposed through one public boundary', () => {
    const declarers = allSrcFiles.filter(file =>
      /export\s+const\s+CHAPTER_CONTENT_LOADERS\s*=/.test(readFileSync(file, 'utf8')),
    )
    expect(declarers).toEqual([generated])
    expect(readFileSync(boundary, 'utf8')).toContain('CHAPTER_CONTENT_LOADERS')
  })

  it('keeps shell files free of static episode imports', () => {
    for (const rel of ['src/App.jsx', 'src/app/LegacyApp.jsx']) {
      const source = readFileSync(resolve(root, rel), 'utf8')
      expect(source, rel).not.toMatch(/^import\s+.*from\s+['"][^'"]*content[^'"]*episodes/m)
    }
  })

  it('generates one async loader for each of the 59 Chapters with a content file', async () => {
    expect(Object.keys(CHAPTER_CONTENT_LOADERS)).toHaveLength(59)
    for (const [id, loader] of Object.entries(CHAPTER_CONTENT_LOADERS)) {
      expect(loader, id).toBeTypeOf('function')
      const result = loader()
      expect(result, id).toBeInstanceOf(Promise)
      const content = await result
      expect(content.id, id).toBe(id)
      expect(CURRICULUM_CHAPTERS.some(chapter => chapter.id === id), id).toBe(true)
    }
  })

  it('keeps zero-screen source files empty and leaves six fileless planned Chapters without loaders', async () => {
    const missing = []
    for (const chapter of CURRICULUM_CHAPTERS) {
      const loader = CHAPTER_CONTENT_LOADERS[chapter.id]
      if (!loader) {
        missing.push(chapter.id)
        expect(chapter.status, chapter.id).toBe('planned')
        expect(chapter.screenCount, chapter.id).toBe(0)
        continue
      }
      const content = await loader()
      expect(content.screens.length, chapter.id).toBe(chapter.screenCount)
      if (chapter.screenCount === 0) expect(content.screens, chapter.id).toEqual([])
    }
    expect(missing.sort()).toEqual([
      'english-inspector-calls-consequences-resolution',
      'english-inspector-calls-responsibility-denial',
      'english-inspector-calls-social-message',
      'english-macbeth-appearance-reality',
      'english-macbeth-guilt-consequence',
      'english-macbeth-witches-fate',
    ])
  })

  it('does not restore the retired subject-bundle loader pattern', () => {
    const offenders = allSrcFiles
      .filter(file => readFileSync(file, 'utf8').includes('SUBJECT_MODULE_LOADERS'))
      .map(file => file.replace(`${root}/`, ''))
    expect(offenders).toEqual([])
  })
})

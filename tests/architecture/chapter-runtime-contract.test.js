import { describe, expect, it } from 'vitest'
import { readFileSync, readdirSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'

const root = resolve(process.cwd())
const srcRoot = resolve(root, 'src')
const read = path => readFileSync(resolve(root, path), 'utf8')

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) return walk(path)
    return /\.(js|jsx|mjs)$/.test(entry.name) ? [path] : []
  })
}

const sources = walk(srcRoot).map(path => ({
  path: relative(root, path).replaceAll('\\', '/'),
  content: readFileSync(path, 'utf8'),
}))

describe('canonical chapter runtime', () => {
  it('ChapterPlayer is the sole chapter runtime', () => {
    const canonical = read('src/components/layout/ChapterPlayer.jsx')
    expect(canonical).toContain('export default function ChapterPlayer(props)')
    expect(canonical).toContain('function ValidatedChapterPlayer({ chapter, onBack, onChapterComplete })')
    expect(canonical).toContain('computeInitialChapterState(chapter, saved)')
    expect(canonical).toContain('getChapterGate(chapter,')
  })

  it('production source contains no deleted runtime imports', () => {
    const playerViolators = sources
      .filter(source => /from\s+['"][^'"]*ModulePlayer\.jsx['"]|import\(['"][^'"]*ModulePlayer\.jsx['"]\)/.test(source.content))
      .map(source => source.path)
    const navigationViolators = sources
      .filter(source => /from\s+['"][^'"]*moduleNavigation\.js['"]/.test(source.content))
      .map(source => source.path)
    expect(playerViolators).toEqual([])
    expect(navigationViolators).toEqual([])
  })

  it('LegacyApp uses chapter state, actions, loader and overlay names', () => {
    const source = read('src/app/LegacyApp.jsx')
    expect(source).toContain('activeChapter')
    expect(source).toContain('openChapterPlayer')
    expect(source).toContain('loadChapterContent')
    expect(source).toContain("view === 'chapter'")
    expect(source).not.toContain('activeModule')
    expect(source).not.toContain('openModulePlayer')
    expect(source).not.toContain('loadModuleContent')
  })
})

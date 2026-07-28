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
  it('ChapterPlayer owns the runtime and ModulePlayer remains a thin facade', () => {
    const canonical = read('src/components/layout/ChapterPlayer.jsx')
    const legacy = read('src/components/layout/ModulePlayer.jsx')
    expect(canonical).toContain('export default function ChapterPlayer({ chapter, onBack, onChapterComplete })')
    expect(canonical).toContain('computeInitialChapterState(chapter, saved)')
    expect(canonical).toContain('getChapterGate(chapter,')
    expect(legacy).toContain("import ChapterPlayer from './ChapterPlayer.jsx'")
    expect(legacy).not.toContain('useState')
  })

  it('production source does not import the legacy player or navigation implementation', () => {
    const playerViolators = sources
      .filter(source => source.path !== 'src/components/layout/ModulePlayer.jsx')
      .filter(source => /from\s+['"][^'"]*ModulePlayer\.jsx['"]|import\(['"][^'"]*ModulePlayer\.jsx['"]\)/.test(source.content))
      .map(source => source.path)
    const navigationViolators = sources
      .filter(source => source.path !== 'src/app/moduleNavigation.js')
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

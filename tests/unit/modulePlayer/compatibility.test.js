import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = resolve(process.cwd())
const read = path => readFileSync(resolve(root, path), 'utf8')

describe('legacy runtime compatibility', () => {
  it('ModulePlayer is a thin prop-mapping facade over ChapterPlayer', () => {
    const source = read('src/components/layout/ModulePlayer.jsx')
    expect(source).toContain("import ChapterPlayer from './ChapterPlayer.jsx'")
    expect(source).toContain('chapter={chapter || module}')
    expect(source).not.toContain('useState')
    expect(source.split('\n').length).toBeLessThan(20)
  })

  it('moduleNavigation re-exports the canonical helpers under legacy names', () => {
    const source = read('src/app/moduleNavigation.js')
    expect(source).toContain('computeInitialChapterState as computeInitialModuleState')
    expect(source).toContain('getChapterGate as getModuleGate')
    expect(source).toContain('prepareChapterScreenState as prepareModuleScreenState')
    expect(source).not.toContain('function computeInitialModuleState')
  })
})

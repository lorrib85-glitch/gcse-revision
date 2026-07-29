import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { resolve, relative } from 'node:path'
import { describe, expect, it } from 'vitest'

const ROOT = resolve(process.cwd())
const read = path => readFileSync(resolve(ROOT, path), 'utf8')

function filesUnder(dir) {
  const root = resolve(ROOT, dir)
  const files = []
  for (const name of readdirSync(root)) {
    const full = resolve(root, name)
    if (statSync(full).isDirectory()) files.push(...filesUnder(relative(ROOT, full)))
    else files.push(relative(ROOT, full).replaceAll('\\', '/'))
  }
  return files
}

describe('Canonical hierarchy closure', () => {
  it('removes the old chapter-as-module surfaces', () => {
    for (const path of [
      'src/modules.js',
      'src/components/layout/ModulePlayer.jsx',
      'src/app/moduleNavigation.js',
    ]) expect(existsSync(resolve(ROOT, path)), path).toBe(false)
  })

  it('contains no import of the deleted root chapter catalogue', () => {
    const violations = filesUnder('src')
      .filter(path => /\.(js|jsx)$/.test(path))
      .filter(path => {
        const source = read(path)
        return /from\s+['"](?:\.\.\/)+modules\.js['"]/.test(source)
          || /import\(['"](?:\.\.\/)+modules\.js['"]\)/.test(source)
      })
    expect(violations).toEqual([])
  })

  it('does not expose legacy chapter APIs from production source', () => {
    const forbidden = [
      'MODULE_GROUPS', 'getModuleState', 'saveModuleState', 'getModulePct',
      'getContinueModule', 'getInProgressModule', 'LEGACY_CONTENT_NAMES',
      'computeInitialModuleState', 'getModuleGate', 'prepareModuleScreenState',
    ]
    const source = filesUnder('src')
      .filter(path => /\.(js|jsx)$/.test(path))
      .map(path => `${path}\n${read(path)}`)
      .join('\n')
    for (const token of forbidden) expect(source, token).not.toContain(token)
  })

  it('keeps canonical authoring surfaces free of deleted paths and commands', () => {
    const active = [
      'CLAUDE.md',
      'docs/system/CONTENT_HIERARCHY.md',
      'docs/system/DEVELOPMENT_WORKFLOW.md',
      'docs/components/COMPONENT_REGISTRY.md',
      '.claude/skills/chapter-creation/SKILL.md',
      '.claude/skills/gcse-content-registry/SKILL.md',
    ].filter(path => existsSync(resolve(ROOT, path)))
    const text = active.map(path => `${path}\n${read(path)}`).join('\n')
    for (const legacy of [
      'src/modules.js', 'ModulePlayer', 'moduleNavigation', 'module-creation',
      'moduleContentRegistry.js', 'MODULE_CONTENT_LOADERS', 'loadModuleContent',
    ]) expect(text, legacy).not.toContain(legacy)
  })
})

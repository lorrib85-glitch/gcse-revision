import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'

const root = resolve(process.cwd())
const read = (rel) => readFileSync(resolve(root, rel), 'utf8')
const exists = (rel) => existsSync(resolve(root, rel))

describe('App entry point', () => {
  it('src/App.jsx imports ./app/LegacyApp.jsx', () => {
    const src = read('src/App.jsx')
    expect(src).toMatch(/from\s+['"]\.\/app\/LegacyApp\.jsx['"]/)
  })
})

describe('Feature files exist', () => {
  const features = [
    'src/app/LegacyApp.jsx',
    'src/features/home/Home.jsx',
    'src/features/pulse/Pulse.jsx',
    'src/features/subjects/Subjects.jsx',
    'src/features/quickfire/QuickFire.jsx',
  ]

  for (const path of features) {
    it(`${path} exists`, () => {
      expect(exists(path)).toBe(true)
    })
  }
})

describe('LegacyApp.jsx health', () => {
  it('has no placeholder /home/oai/share paths', () => {
    const src = read('src/app/LegacyApp.jsx')
    expect(src).not.toContain('/home/oai/share')
  })

  it('is below 600 lines', () => {
    const lines = read('src/app/LegacyApp.jsx').split('\n').length
    expect(lines).toBeLessThan(600)
  })
})

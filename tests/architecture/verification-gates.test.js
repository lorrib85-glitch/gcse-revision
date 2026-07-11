import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const root = resolve(process.cwd())
const read = (rel) => readFileSync(resolve(root, rel), 'utf8')

// Guards two regressions this repo actually had: `pnpm verify` silently
// skipping unit tests, and CI running only lint+build with no test suite at
// all. Checks behavioural presence (which gates run), not exact command
// formatting or step ordering.
describe('pnpm verify covers every critical local gate', () => {
  const pkg = JSON.parse(read('package.json'))
  const verify = pkg.scripts?.verify || ''

  it.each([
    ['lint', 'pnpm lint'],
    ['architecture tests', 'pnpm test:architecture'],
    ['unit tests', 'pnpm test:unit'],
    ['storybook/browser tests', 'pnpm test:storybook'],
    ['production build', 'pnpm build'],
  ])('runs %s', (_label, command) => {
    expect(verify).toContain(command)
  })

  it('test:rules stays a separate, emulator-backed command (not folded into verify)', () => {
    expect(verify).not.toContain('test:rules')
    const testRules = pkg.scripts?.['test:rules'] || ''
    expect(testRules).toContain('emulators:exec')
    expect(testRules).toContain('firestore')
  })
})

describe('CI enforces the same gates', () => {
  const ci = read('.github/workflows/ci.yml')

  it('runs on push and pull_request to main', () => {
    expect(ci).toMatch(/branches:\s*\[main\]/)
  })

  it.each([
    'pnpm lint',
    'pnpm test:architecture',
    'pnpm test:unit',
    'pnpm test:storybook',
    'pnpm build',
  ])('verify job runs: %s', (command) => {
    expect(ci).toContain(command)
  })

  it('has a dedicated Firestore security-rules job that runs test:rules', () => {
    expect(ci).toContain('pnpm test:rules')
  })

  it('installs dependencies with a frozen lockfile before every gate', () => {
    const installCount = (ci.match(/pnpm install --frozen-lockfile/g) || []).length
    // One per job (verify, firestore-rules) — each job gets a clean checkout.
    expect(installCount).toBeGreaterThanOrEqual(2)
  })
})

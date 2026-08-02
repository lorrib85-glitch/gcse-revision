/**
 * Architecture guard: this repository is pnpm-only (backlog A11, Phase 11).
 *
 * The repository is pnpm-only. A second lockfile creates a dependency graph
 * that CI never installs and must not be committed.
 *
 * `package.json` pins `packageManager: "pnpm@..."`, `pnpm-lock.yaml` is the
 * lockfile every CI job installs from, and Vercel builds from the same tree.
 * A stray `package-lock.json` / `yarn.lock` / bun lockfile is not a harmless
 * duplicate: it resolves versions independently, so anyone (or any tool) that
 * installs with the other package manager gets a dependency graph nobody has
 * tested, while `pnpm install --frozen-lockfile` keeps reporting green.
 *
 * Phase 11 deleted the stale `package-lock.json` this repo had been carrying.
 * This guard exists so it cannot quietly return.
 *
 * Scope note: this only asserts lockfile singularity, the pinned package
 * manager and the install commands CI actually runs. Ordinary prose mentions
 * of "npm" — docs, package metadata, registry URLs — are not policed, and
 * `node_modules` is never scanned.
 */

import { describe, it, expect } from 'vitest'
import { existsSync, readFileSync, readdirSync } from 'fs'
import { resolve, dirname, join } from 'path'
import { fileURLToPath } from 'url'

// Resolve from this file, not process.cwd(), so the guard holds however the
// runner is launched.
const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..', '..')

const rootPath = (name) => join(root, name)
const pkg = JSON.parse(readFileSync(rootPath('package.json'), 'utf8'))

describe('package manager boundary — the repository is pnpm-only', () => {
  it('pins pnpm in package.json "packageManager"', () => {
    expect(
      pkg.packageManager,
      'package.json must pin a pnpm version in "packageManager". CI\'s ' +
      'pnpm/action-setup reads this field to choose the pnpm it installs with.',
    ).toMatch(/^pnpm@/)
  })

  it('keeps pnpm-lock.yaml at the repository root', () => {
    expect(
      existsSync(rootPath('pnpm-lock.yaml')),
      'pnpm-lock.yaml is the only lockfile CI installs from — it must exist at the root.',
    ).toBe(true)
  })

  // One entry per foreign lockfile so a failure names the offending file
  // rather than a list.
  const FOREIGN_LOCKFILES = [
    ['package-lock.json',   'npm'],
    ['npm-shrinkwrap.json', 'npm'],
    ['yarn.lock',           'Yarn'],
    ['bun.lockb',           'Bun'],
    ['bun.lock',            'Bun'],
  ]

  it.each(FOREIGN_LOCKFILES)('does not commit %s', (lockfile, manager) => {
    expect(
      existsSync(rootPath(lockfile)),
      `${lockfile} must not be committed. This repository is pnpm-only: a ${manager} ` +
      'lockfile resolves its own dependency graph, which CI never installs and ' +
      'nobody tests. Delete it and use pnpm-lock.yaml.',
    ).toBe(false)
  })
})

describe('package manager boundary — CI installs with pnpm', () => {
  const workflowsDir = rootPath(join('.github', 'workflows'))

  const workflows = existsSync(workflowsDir)
    ? readdirSync(workflowsDir).filter((f) => f.endsWith('.yml') || f.endsWith('.yaml'))
    : []

  it('has at least one CI workflow to check', () => {
    expect(workflows.length).toBeGreaterThan(0)
  })

  const BANNED_INSTALL_COMMANDS = [
    /\bnpm\s+install\b/,
    /\bnpm\s+ci\b/,
    /\byarn\s+install\b/,
    /\bbun\s+install\b/,
  ]

  it.each(workflows)('%s does not install with a non-pnpm package manager', (workflow) => {
    const lines = readFileSync(join(workflowsDir, workflow), 'utf8').split('\n')

    const offenders = lines
      .map((line, i) => ({ line, number: i + 1 }))
      // Comment lines are dropped first: a workflow may explain *why* pnpm is
      // used instead of npm without that prose tripping the guard. Every
      // remaining line is checked, so commands inside a multi-line `run: |`
      // block are covered as well as single-line `- run:` steps.
      .filter(({ line }) => !/^\s*#/.test(line))
      .filter(({ line }) => BANNED_INSTALL_COMMANDS.some((pattern) => pattern.test(line)))
      .map(({ line, number }) => `${workflow}:${number} — ${line.trim()}`)

    expect(
      offenders,
      'CI must install with `pnpm install --frozen-lockfile`. Installing with npm, ' +
      'Yarn or Bun would resolve a dependency graph that pnpm-lock.yaml does not ' +
      'describe, and would recreate the foreign lockfile this repository deleted.',
    ).toEqual([])
  })
})

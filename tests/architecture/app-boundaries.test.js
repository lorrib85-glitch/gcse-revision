import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'
import { SUBJECTS } from '../../src/constants/subjects.js'

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
    'src/features/progress/Progress.jsx',
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

// A3 cleanup (architecture-backlog.md): ModulePage, HistoryMedicineBrowser and
// SubjectSection were each confirmed unreachable (no references anywhere
// outside their own definitions) and removed, cutting the live subject-palette
// surface down to SubjectBrowser only. Guards against any of them being
// reintroduced as dead weight carrying more duplicate palette call sites.
const REMOVED_DEAD_FUNCTIONS = ['ModulePage', 'HistoryMedicineBrowser', 'SubjectSection']

describe('Subjects.jsx dead code does not regrow', () => {
  for (const name of REMOVED_DEAD_FUNCTIONS) {
    it(`does not reintroduce ${name}`, () => {
      const src = read('src/features/subjects/Subjects.jsx')
      expect(src).not.toMatch(new RegExp(`function\\s+${name}\\s*\\(`))
    })
  }

  it('leaves only the two live top-level components', () => {
    const src = read('src/features/subjects/Subjects.jsx')
    const declared = [...src.matchAll(/^(?:export default )?function\s+(\w+)\s*\(/gm)].map(m => m[1])
    expect(declared).toEqual(['SubjectBrowser', 'SubjectsTab'])
  })
})

// A3 ownership slice (architecture-backlog.md): sand/bronze moved to
// SUBJECTS.*.subjectBrowserAccent / subjectBrowserAccentDark in
// src/constants/subjects.js. Guards against Subjects.jsx regrowing a local
// all-subject hex palette map (the second-source-of-truth problem A3 exists
// to fix) for that ownership. cream was a separate, later decision — see
// the next describe block.
describe('Subjects.jsx does not regrow a local subject accent palette map', () => {
  it('has no local object literal keyed by all seven subject names holding sand/bronze-style hex pairs', () => {
    const src = read('src/features/subjects/Subjects.jsx')
    expect(src).not.toMatch(/sand:\s*['"]#[0-9A-Fa-f]{6}['"]/)
    expect(src).not.toMatch(/bronze:\s*['"]#[0-9A-Fa-f]{6}['"]/)
  })

  it('reads its accent pair from SUBJECTS in constants/subjects.js', () => {
    const src = read('src/features/subjects/Subjects.jsx')
    expect(src).toMatch(/import\s*\{[^}]*SUBJECTS[^}]*\}\s*from\s*['"]\.\.\/\.\.\/constants\/subjects\.js['"]/)
    expect(src).toMatch(/SUBJECTS\[subjectName\]\?\.subjectBrowserAccent\b/)
    expect(src).toMatch(/SUBJECTS\[subjectName\]\?\.subjectBrowserAccentDark\b/)
  })

  // Field presence, not colour uniqueness: every subject the browser can render
  // must own both presentation roles canonically, so no subject silently falls
  // through to the History fallback. Driven off the browser's own subject list
  // so adding a subject there without the fields fails here.
  it('every subject the browser displays owns both presentation roles', () => {
    const browserSrc = read('src/features/subjects/Subjects.jsx')
    const block = browserSrc.match(/const SUBJECT_DISPLAY_TITLES = \{([\s\S]*?)\n\}/)
    expect(block, 'SUBJECT_DISPLAY_TITLES not found in Subjects.jsx').toBeTruthy()
    const browserSubjects = [...block[1].matchAll(/^\s{2}(\w+):/gm)].map(m => m[1])
    expect(browserSubjects.length).toBeGreaterThan(0)

    const missing = browserSubjects.filter(
      name => !SUBJECTS[name]?.subjectBrowserAccent || !SUBJECTS[name]?.subjectBrowserAccentDark,
    )
    expect(
      missing,
      `Subjects missing subjectBrowserAccent/subjectBrowserAccentDark in constants/subjects.js: ${missing.join(', ')}`,
    ).toEqual([])
  })
})

// A3 cream decision (architecture-backlog.md): the subject-tinted cream pending
// map was collapsed to GENERAL.softWhite — a deliberate, human-approved
// simplification, not a preserved-values migration. Guards against either the
// old local pending map or a new per-subject SUBJECTS field being reintroduced
// for this role without a fresh, explicit decision to reverse course.
describe('Subjects.jsx does not regrow a cream/subject-tinted timeline-node token', () => {
  it('has no SUBJECT_BROWSER_PENDING_CREAM map or "cream" identifier', () => {
    const src = read('src/features/subjects/Subjects.jsx')
    expect(src).not.toMatch(/SUBJECT_BROWSER_PENDING_CREAM/)
    expect(src).not.toMatch(/\bcream\b/)
  })

  it('constants/subjects.js has no subjectBrowserCream field', () => {
    const src = read('src/constants/subjects.js')
    expect(src).not.toMatch(/subjectBrowserCream/)
  })
})

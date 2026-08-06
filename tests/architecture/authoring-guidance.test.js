import { describe, expect, it } from 'vitest'
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { resolve, dirname, posix } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const read = rel => readFileSync(resolve(root, rel), 'utf8')
const GUIDANCE_ROOTS = ['CLAUDE.md', 'docs/system', 'docs/components', '.claude/skills', 'src/component-catalogue/records']

function listGuidance() {
  const out = []
  const walk = rel => {
    const absolute = resolve(root, rel)
    if (!existsSync(absolute)) return
    if (!statSync(absolute).isDirectory()) { out.push(rel); return }
    for (const name of readdirSync(absolute)) walk(posix.join(rel, name))
  }
  for (const entry of GUIDANCE_ROOTS) walk(entry)
  return out.filter(file => /\.(md|js)$/.test(file))
}

const guidance = listGuidance()
const retired = /src\/chapters\.js|src\/data\/modules\.js|chapterContentRegistry\.js|curriculum:projections:/

describe('active Chapter authoring guidance', () => {
  it('does not instruct authors to use retired runtime boundaries or commands', () => {
    const offenders = []
    for (const file of guidance) {
      const source = read(file)
      for (const line of source.split('\n')) {
        if (!retired.test(line)) continue
        if (/retired|must not return|do not reintroduce|historical|deleted/.test(line)) continue
        offenders.push(`${file}: ${line.trim()}`)
      }
    }
    expect(offenders).toEqual([])
  })

  it('states the canonical eight-step authoring flow', () => {
    const claude = read('CLAUDE.md')
    expect(claude).toContain('src/data/learnerCurriculum.js')
    const flow = claude.slice(claude.indexOf('#### Adding or changing a chapter'))
    const steps = [
      /1\..*Chapter record/s,
      /2\..*exactly one.*Module/s,
      /3\..*content file/s,
      /4\..*contentPath/s,
      /5\..*concepts/s,
      /6\..*curriculum:runtime:generate/s,
      /7\..*lab:generate/s,
      /8\..*pnpm verify/s,
    ]
    let cursor = 0
    for (const [index, pattern] of steps.entries()) {
      const offset = flow.slice(cursor).search(pattern)
      expect(offset, `authoring step ${index + 1}`).toBeGreaterThanOrEqual(0)
      cursor += offset + 1
    }
  })

  it('states the generated consequences precisely', () => {
    const claude = read('CLAUDE.md')
    for (const claim of [
      /screenCount.*screenTags.*derived/is,
      /Loader entries are generated/i,
      /canonical Modules.*Chapters.*generated/is,
      /never edits `ChapterPlayer`, `ScreenRenderer`/i,
      /planned Chapter.*zero-screen content file/is,
      /Topic metadata.*inside Chapter content/is,
      /status.*authored/is,
    ]) expect(claude, String(claim)).toMatch(claim)
  })

  it('keeps the ChapterPlayer catalogue rule aligned', async () => {
    const record = (await import('../../src/component-catalogue/records/chapter-player.js')).default
    const rule = record.documentation.governanceRules.find(entry => entry.startsWith('Chapter-building rule:'))
    expect(rule).toMatch(/canonical Chapter record/)
    expect(rule).toMatch(/exactly one canonical Module record/)
    expect(rule).toMatch(/learnerCurriculum\.js/)
    expect(rule).toMatch(/screenCount, screenTags and the loader entry are derived/)
    expect(rule).not.toMatch(/src\/chapters\.js|src\/data\/modules\.js|chapterContentRegistry/)
  })
})

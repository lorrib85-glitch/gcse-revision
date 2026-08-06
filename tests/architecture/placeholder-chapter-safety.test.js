import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { CURRICULUM_CHAPTERS } from '../../src/data/learnerCurriculum.js'

const root = resolve(process.cwd())
const read = rel => readFileSync(resolve(root, rel), 'utf8')

describe('planned Chapter safety', () => {
  it('keeps governed unbuilt Chapters canonical and explicitly planned', () => {
    const planned = CURRICULUM_CHAPTERS.filter(chapter => chapter.status === 'planned')
    expect(planned).toHaveLength(35)
    expect(planned.every(chapter => chapter.screenCount === 0)).toBe(true)
    expect(CURRICULUM_CHAPTERS.some(chapter => chapter.id.startsWith('cs_'))).toBe(false)
  })

  it('guards ChapterPlayer opening before changing view', () => {
    const src = read('src/app/LegacyApp.jsx')
    const fnStart = src.indexOf('function openChapterPlayer(')
    const fnBody = src.slice(fnStart, fnStart + 800)
    const guard = /if\s*\(!\s*chapter\??\.\s*screenCount\s*\)\s*return/
    expect(fnBody).toMatch(guard)
    expect(fnBody.search(guard)).toBeLessThan(fnBody.indexOf("setView('chapter')"))
  })

  it('maps generated navigation openability onto browser coming-soon state', () => {
    const adapter = read('src/features/subjects/subjectNavigationAdapter.js')
    const subjects = read('src/features/subjects/Subjects.jsx')
    expect(adapter).toContain('comingSoon: !card.openable')
    expect(adapter).toContain('openable: card.openable')
    expect(subjects).toMatch(/if\s*\(!item\.openable\)[\s\S]*status:\s*'coming_soon'/)
  })
})

import { describe, expect, it } from 'vitest'
import { readFileSync, readdirSync } from 'fs'
import { join, relative, resolve } from 'path'

const root = resolve(process.cwd())
const srcRoot = resolve(root, 'src')

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) return walk(path)
    return /\.(js|jsx|mjs)$/.test(entry.name) ? [path] : []
  })
}

const sources = walk(srcRoot).map(path => ({
  path,
  relativePath: relative(root, path).replaceAll('\\', '/'),
  content: readFileSync(path, 'utf8'),
}))

function importViolators(pattern, allowedPaths) {
  const allowed = new Set(allowedPaths)
  return sources
    .filter(source => pattern.test(source.content))
    .map(source => source.relativePath)
    .filter(path => !allowed.has(path))
    .sort()
}

describe('Legacy content imports are shrink-only', () => {
  it('prevents new direct imports from the legacy chapter catalogue', () => {
    const violators = importViolators(
      /from\s+['"][^'"]*\/modules\.js['"]/,
      [
        'src/chapters.js',
        'src/app/LegacyApp.jsx',
        'src/components/layout/ChapterCompleteScreen.jsx',
        'src/features/planner/dailyPlanner.js',
        'src/features/subjects/Subjects.jsx',
      ],
    )

    expect(
      violators,
      `New code must import CHAPTERS from src/chapters.js: ${violators.join(', ')}`,
    ).toEqual([])
  })

  it('prevents new imports from the legacy loader-registry path', () => {
    const violators = importViolators(
      /from\s+['"][^'"]*moduleContentRegistry\.js['"]/,
      ['src/app/LegacyApp.jsx'],
    )

    expect(
      violators,
      `New code must import from chapterContentRegistry.js: ${violators.join(', ')}`,
    ).toEqual([])
  })

  it('prevents new imports from the legacy recovery-map path', () => {
    const violators = importViolators(
      /from\s+['"][^'"]*tagModuleMap\.js['"]/,
      [
        'src/data/contentSupport/historyMedicineEpisode01.js',
        'src/data/learningGraph/concepts/historyMedicine.js',
        'src/features/quickfire/logic/convertBankQuestion.js',
        'src/features/subjects/Subjects.jsx',
        'src/unifiedWeaknessTracker.js',
      ],
    )

    expect(
      violators,
      `New code must import TAG_CHAPTER_MAP from tagChapterMap.js: ${violators.join(', ')}`,
    ).toEqual([])
  })

  it('prevents new callers from importing the legacy parent-module alias', () => {
    const violators = importViolators(
      /import\s*\{[^}]*\bMODULE_GROUPS\b[^}]*\}\s*from\s*['"][^'"]*progress\.js['"]/s,
      [
        'src/components/layout/ModulePlayer.jsx',
        'src/features/planner/dailyPlanner.js',
      ],
    )

    expect(
      violators,
      `New code must import MODULES from src/data/modules.js: ${violators.join(', ')}`,
    ).toEqual([])
  })

  it('prevents new callers from importing legacy chapter-discovery names', () => {
    const violators = importViolators(
      /import\s*\{[^}]*(getContinueModule|getInProgressModule)[^}]*\}\s*from\s*['"][^'"]*progress\.js['"]/s,
      [
        'src/app/LegacyApp.jsx',
        'src/features/subjects/Subjects.jsx',
      ],
    )

    expect(
      violators,
      `New code must use getContinueChapter/getInProgressChapter: ${violators.join(', ')}`,
    ).toEqual([])
  })
})

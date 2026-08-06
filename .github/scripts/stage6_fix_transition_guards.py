from pathlib import Path


def replace_once(path, old, new):
    path = Path(path)
    text = path.read_text()
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f'{path}: expected one occurrence, found {count}: {old!r}')
    path.write_text(text.replace(old, new, 1))


replace_once(
    'tests/architecture/curriculum-catalogue-integrity.test.js',
    """    // Excluded from the catalogue as a chapter, still whole in the runtime and
    // still the destination `mod2` progress folds onto. Preserved is not the
    // same as given a chapter record.
    const runtime = await import('../../src/chapters.js')
    const hidden = runtime.CHAPTERS.find(chapter => chapter.id === binding.id)
    expect(runtime.getChapterAvailability(hidden)).toBe('hidden')
    const progress = await import('../../src/data/chapterProgress.js')
    expect(progress.LEGACY_CHAPTER_ID_MAP.mod2).toBe(binding.id)
    expect(progress.canonicalChapterId('mod2')).toBe(binding.id)
""",
    """    // The old projection remains only as an independent migration witness in
    // the first Stage 6 cut. Progress no longer targets a hidden non-chapter:
    // both historical ids fold directly onto the canonical replacement.
    const runtime = await import('../../src/chapters.js')
    const hidden = runtime.CHAPTERS.find(chapter => chapter.id === binding.id)
    expect(runtime.getChapterAvailability(hidden)).toBe('hidden')
    const progress = await import('../../src/data/chapterProgress.js')
    expect(progress.LEGACY_CHAPTER_ID_MAP.mod2).toBe('history-medicine-vesalius-beginning-doubt')
    expect(progress.canonicalChapterId('mod2')).toBe('history-medicine-vesalius-beginning-doubt')
    expect(progress.canonicalChapterId(binding.id)).toBe('history-medicine-vesalius-beginning-doubt')
""",
)

replace_once(
    'tests/architecture/curriculum-projection-parity.test.js',
    """  it('rewrote no consumer — every one still imports the public boundary file', () => {
    // The point of the boundary is that the cutover is invisible above it. Any
    // consumer that had been re-pointed at the generated directory would make
    // the revert in the next test a partial one.
    const consumers = [
      'src/progress.js',
      'src/todaysPlan.js',
      'src/app/LegacyApp.jsx',
      'src/app/chapterNavigation.js',
      'src/data/contentHierarchy.js',
      'src/features/progress/Progress.jsx',
      'src/features/subjects/Subjects.jsx',
      'src/features/subjects/subjectNavigationAdapter.js',
      'src/features/planner/dailyPlanner.js',
      'src/components/layout/ChapterPlayer.jsx',
      'src/components/layout/ChapterCompleteScreen.jsx',
    ]
    const reachesBoundary = /(?:from\\s*|import\\s*\\(?\\s*)['\"][^'\"]*(?:data\\/modules|chapters|content\\/chapterContentRegistry)\\.js['\"]/
    for (const consumer of consumers) {
      const source = read(consumer)
      expect(reachesBoundary.test(source), `${consumer} stopped importing the boundary`).toBe(true)
      expect(REACHES_RUNTIME_GENERATED.test(source), `${consumer} was re-pointed at the generated directory`).toBe(false)
    }
  })
""",
    """  it('hands live consumers to the canonical learner boundary without direct generated imports', () => {
    const consumers = [
      'src/progress.js',
      'src/todaysPlan.js',
      'src/app/LegacyApp.jsx',
      'src/app/chapterNavigation.js',
      'src/features/progress/Progress.jsx',
      'src/features/subjects/subjectNavigationAdapter.js',
      'src/features/planner/dailyPlanner.js',
      'src/components/layout/ChapterPlayer.jsx',
      'src/components/layout/ChapterCompleteScreen.jsx',
    ]
    for (const consumer of consumers) {
      const source = read(consumer)
      expect(source, `${consumer} did not migrate to the canonical learner boundary`)
        .toMatch(/from\\s*['\"][^'\"]*learnerCurriculum\\.js['\"]/)
      expect(REACHES_RUNTIME_GENERATED.test(source), `${consumer} imports generated output directly`).toBe(false)
    }
  })
""",
)

replace_once(
    'tests/architecture/curriculum-compatibility.test.js',
    """        expect(
          reachesBoundary.test(source) || source.includes(hiddenId),
          `${field}: ${consumer} neither reaches a runtime boundary file nor names a compatibility id`,
        ).toBe(true)
""",
    """        const reachesCanonicalRuntime = /(?:from\\s*|import\\s*\\(?\\s*)['\"][^'\"]*learnerCurriculum\\.js['\"]/.test(source)
        expect(
          reachesBoundary.test(source) || reachesCanonicalRuntime || source.includes(hiddenId),
          `${field}: ${consumer} reaches neither the transitional nor canonical runtime boundary`,
        ).toBe(true)
""",
)

replace_once(
    'tests/architecture/learner-curriculum-runtime.test.js',
    """    expect(LEARNING_SEQUENCES.map(sequence => sequence.chapterIds)).toEqual(
      LEGACY_MODULES.map(module => module.chapterIds),
    )
""",
    """    // Canonical sequences may already contain planned Chapters. The migration
    // contract is that the live, openable order is identical — not that planned
    // content remains artificially excluded from its real sequence.
    expect(LEARNING_SEQUENCES.map(sequence => sequence.chapterIds
      .map(getCurriculumChapterById)
      .filter(isChapterAvailable)
      .map(chapter => chapter.id))).toEqual(
      LEGACY_MODULES.map(module => module.chapterIds
        .map(id => LEGACY_CHAPTERS.find(chapter => chapter.id === id))
        .filter(isLegacyChapterAvailable)
        .map(chapter => chapter.id)),
    )
""",
)

replace_once(
    'tests/unit/app/chapterNavigation.test.js',
    """const HANDOFF_CHAPTERS = [
  { id: 'p1', title: 'P1', subject: 'Alpha', screenCount: 4 },
  { id: 'p2', title: 'P2', subject: 'Alpha', screenCount: 4 },
  { id: 'p3', title: 'P3', subject: 'Alpha', screenCount: 0 },                         // comingSoon
  { id: 'p4', title: 'P4', subject: 'Alpha', screenCount: 4, availability: 'hidden' },
  { id: 'p5', title: 'P5', subject: 'Alpha', screenCount: 4 },
  { id: 'q1', title: 'Q1', subject: 'Alpha', screenCount: 0 },                         // all-stub module
  { id: 'r1', title: 'R1', subject: 'Beta',  screenCount: 4 },                         // other subject
  { id: 's1', title: 'S1', subject: 'Alpha', screenCount: 0 },
  { id: 's2', title: 'S2', subject: 'Alpha', screenCount: 4 },
]
""",
    """const HANDOFF_CHAPTERS = [
  { id: 'p1', title: 'P1', subject: 'Alpha', status: 'available', screenCount: 4 },
  { id: 'p2', title: 'P2', subject: 'Alpha', status: 'available', screenCount: 4 },
  { id: 'p3', title: 'P3', subject: 'Alpha', status: 'planned', screenCount: 0 },
  { id: 'p4', title: 'P4', subject: 'Alpha', status: 'planned', screenCount: 4 },
  { id: 'p5', title: 'P5', subject: 'Alpha', status: 'available', screenCount: 4 },
  { id: 'q1', title: 'Q1', subject: 'Alpha', status: 'planned', screenCount: 0 },
  { id: 'r1', title: 'R1', subject: 'Beta', status: 'available', screenCount: 4 },
  { id: 's1', title: 'S1', subject: 'Alpha', status: 'planned', screenCount: 0 },
  { id: 's2', title: 'S2', subject: 'Alpha', status: 'available', screenCount: 4 },
]
""",
)
replace_once(
    'tests/unit/app/chapterNavigation.test.js',
    "it('skips a hidden chapter sitting between two available chapters', () => {",
    "it('skips a planned chapter sitting between two available chapters', () => {",
)

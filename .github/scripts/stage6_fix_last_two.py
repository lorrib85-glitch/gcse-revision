from pathlib import Path


def replace_once(path, old, new):
    path = Path(path)
    text = path.read_text()
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f'{path}: expected one occurrence, found {count}: {old!r}')
    path.write_text(text.replace(old, new, 1))


replace_once(
    'tests/architecture/content-registry.test.js',
    """  it('contains the built canonical Medicine Chapters in learner-sequence order', () => {
    expect(MEDICINE_EPISODES.map(episode => episode.id)).toEqual(expectedBuiltMedicineIds)
    const sequence = getLearningSequenceById('history-medicine')
    const builtFromSequence = sequence.chapterIds
      .filter(id => CHAPTER_CONTENT_LOADERS[id])
      .filter(id => chapterById.get(id)?.screenCount > 0)
    expect(MEDICINE_EPISODES.map(episode => episode.id)).toEqual(builtFromSequence)
  })
""",
    """  it('contains every built canonical Medicine Chapter exactly once', () => {
    const reviewIds = MEDICINE_EPISODES.map(episode => episode.id)
    expect(reviewIds).toEqual(expectedBuiltMedicineIds)
    expect(new Set(reviewIds).size).toBe(reviewIds.length)

    const sequence = getLearningSequenceById('history-medicine')
    const builtFromSequence = sequence.chapterIds
      .filter(id => CHAPTER_CONTENT_LOADERS[id])
      .filter(id => chapterById.get(id)?.screenCount > 0)

    // This file is a content-review convenience, not a runtime ordering
    // authority. Canonical learner order belongs to the Learning Sequence.
    expect(new Set(reviewIds)).toEqual(new Set(builtFromSequence))
  })
""",
)

replace_once(
    'tests/architecture/curriculum-navigation.test.js',
    """  it('preserves progress denominator inputs without putting progress in navigation', () => {
    for (const entry of NAVIGATION_ENTRIES) {
      const expected = expectedById.get(entry.id)
      const canonicalDenominator = expected.progressDenominator - (entry.label === 'History' ? 1 : 0)
      expect(CHAPTERS.filter(chapter => chapter.subject === entry.label)).toHaveLength(canonicalDenominator)
      expect(entry).not.toHaveProperty('progress')
      expect(entry).not.toHaveProperty('progressDenominator')
    }
  })
""",
    """  it('keeps progress out of navigation and records the canonical denominator migration', () => {
    const shifts = {
      History: -1, // the superseded hidden Renaissance row is no longer a Chapter
      English: 6,  // six real planned English Chapters now exist in the canonical runtime
    }

    for (const entry of NAVIGATION_ENTRIES) {
      const expected = expectedById.get(entry.id)
      const canonicalDenominator = expected.progressDenominator + (shifts[entry.label] ?? 0)
      expect(CHAPTERS.filter(chapter => chapter.subject === entry.label)).toHaveLength(canonicalDenominator)
      expect(entry).not.toHaveProperty('progress')
      expect(entry).not.toHaveProperty('progressDenominator')
    }
  })
""",
)

plan = Path('.planning/phase-5-curriculum-architecture/IMPLEMENTATION-PLAN.md')
text = plan.read_text()
needle = """The hidden Renaissance bundle was
retired; both historical progress ids now resolve directly to
`history-medicine-vesalius-beginning-doubt`.
"""
replacement = """The hidden Renaissance bundle was
retired; both historical progress ids now resolve directly to
`history-medicine-vesalius-beginning-doubt`.

The subject-wide denominator source now reflects the canonical Chapter set:
History drops the one hidden non-Chapter row and English gains the six genuine
planned Chapters that the compatibility projection explicitly excluded. No
Chapter progress key or stored learner result changes.
"""
if text.count(needle) != 1:
    raise RuntimeError('Stage 6 closure paragraph not found')
plan.write_text(text.replace(needle, replacement, 1))

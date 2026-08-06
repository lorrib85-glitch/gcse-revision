from pathlib import Path
import re


def replace_once(path, old, new):
    path = Path(path)
    text = path.read_text()
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f'{path}: expected one occurrence, found {count}: {old!r}')
    path.write_text(text.replace(old, new, 1))


# Rewrite all simple static and dynamic imports in unit fixtures. Production
# already uses the same public boundary; tests must not preserve a deleted API.
for path in Path('tests/unit').rglob('*'):
    if path.suffix not in {'.js', '.jsx'}:
        continue
    text = path.read_text()

    # Static Chapter imports, preserving any additional named helpers.
    def chapter_import(match):
        names = [name.strip() for name in match.group(1).split(',') if name.strip()]
        converted = []
        for name in names:
            if name == 'CHAPTERS':
                converted.append('CURRICULUM_CHAPTERS as CHAPTERS')
            elif name == 'isChapterAvailable':
                converted.append('isChapterAvailable')
            elif name in {'CHAPTER_AVAILABILITY', 'getChapterAvailability'}:
                # The subject-adapter suite is rewritten explicitly below.
                converted.append(name)
            else:
                raise RuntimeError(f'{path}: unsupported chapters.js import {name}')
        prefix = match.group(2)
        return "import { " + ', '.join(converted) + f" }} from '{prefix}src/data/learnerCurriculum.js'"

    text = re.sub(
        r"import\s*\{([^}]*)\}\s*from\s*['\"]((?:\.\./)+)src/chapters\.js['\"]",
        chapter_import,
        text,
    )

    # Static aggregate Module imports now use semantic Learning Sequences.
    text = re.sub(
        r"import\s*\{\s*MODULES\s*\}\s*from\s*['\"]((?:\.\./)+)src/data/modules\.js['\"]",
        lambda match: f"import {{ LEARNING_SEQUENCES as MODULES }} from '{match.group(1)}src/data/learnerCurriculum.js'",
        text,
    )

    # Dynamic imports used by journey tests and today's-plan fixtures.
    text = re.sub(
        r"const\s*\{\s*CHAPTERS\s*\}\s*=\s*await\s+import\(['\"]((?:\.\./)+)src/chapters\.js['\"]\)",
        lambda match: f"const {{ CURRICULUM_CHAPTERS: CHAPTERS }} = await import('{match.group(1)}src/data/learnerCurriculum.js')",
        text,
    )
    text = re.sub(
        r"const\s*\{\s*MODULES\s*\}\s*=\s*await\s+import\(['\"]((?:\.\./)+)src/data/modules\.js['\"]\)",
        lambda match: f"const {{ LEARNING_SEQUENCES: MODULES }} = await import('{match.group(1)}src/data/learnerCurriculum.js')",
        text,
    )

    text = text.replace(
        "const { MODULES } = await import('../../src/data/modules.js')",
        "const { LEARNING_SEQUENCES: MODULES } = await import('../../src/data/learnerCurriculum.js')",
    )
    text = text.replace(
        'for genuine parent curriculum units in src/data/modules.js, which plan tasks',
        'for canonical parent curriculum units; plan tasks',
    )

    path.write_text(text)

# The adapter suite referenced the deleted compatibility availability enum.
subject_test = Path('tests/unit/subjects/subjectNavigationAdapter.test.js')
text = subject_test.read_text()
text = text.replace(
    "import { CURRICULUM_CHAPTERS as CHAPTERS, CHAPTER_AVAILABILITY, getChapterAvailability } from '../../../src/data/learnerCurriculum.js'",
    "import { CURRICULUM_CHAPTERS as CHAPTERS, isChapterAvailable } from '../../../src/data/learnerCurriculum.js'",
)
old = """      expect(runtime, card.id).toBeTruthy()
      expect(getChapterAvailability(runtime), card.id).toBe(CHAPTER_AVAILABILITY.AVAILABLE)
      expect(card.screenCount, card.id).toBe(runtime.screenCount)
"""
new = """      expect(runtime, card.id).toBeTruthy()
      expect(isChapterAvailable(runtime), card.id).toBe(true)
      expect(card.screenCount, card.id).toBe(runtime.screenCount)
"""
if text.count(old) != 1:
    raise RuntimeError('subject adapter availability assertion not found')
text = text.replace(old, new, 1)
old = """  it('surfaces no hidden runtime Chapter', () => {
    const hidden = SUBJECT_NAVIGATION_NAMES.flatMap(getSubjectChapterList)
      .filter(card => card.chapterId)
      .filter(card => getChapterAvailability(card) === CHAPTER_AVAILABILITY.HIDDEN)
    expect(hidden).toEqual([])
  })
"""
new = """  it('surfaces no superseded Renaissance runtime Chapter', () => {
    const retiredId = 'history-medicine-renaissance-medicine'
    expect(CHAPTERS.some(chapter => chapter.id === retiredId)).toBe(false)
    expect(SUBJECT_NAVIGATION_NAMES.flatMap(getSubjectChapterList)
      .some(card => card.chapterId === retiredId)).toBe(false)
  })
"""
if text.count(old) != 1:
    raise RuntimeError('subject adapter hidden assertion not found')
subject_test.write_text(text.replace(old, new, 1))

# Assert no unit fixture retains any deleted boundary.
offenders = []
for path in Path('tests/unit').rglob('*'):
    if path.suffix not in {'.js', '.jsx'}:
        continue
    text = path.read_text()
    for retired in ['src/chapters.js', 'src/data/modules.js', 'chapterContentRegistry.js']:
        if retired in text:
            offenders.append(f'{path}: {retired}')
if offenders:
    raise RuntimeError('retired unit-test references remain:\n  - ' + '\n  - '.join(offenders))

from pathlib import Path
import re


def replace_once(path: Path, old: str, new: str) -> None:
    text = path.read_text()
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f'{path}: expected one occurrence of {old!r}, found {count}')
    path.write_text(text.replace(old, new, 1))


old_adapter = Path('src/features/subjects/subjectCatalogue.js')
new_adapter = Path('src/features/subjects/subjectNavigationAdapter.js')
if not old_adapter.exists() or new_adapter.exists():
    raise RuntimeError('adapter rename precondition failed')
old_adapter.rename(new_adapter)

old_test = Path('tests/unit/subjects/subjectCatalogue.test.js')
new_test = Path('tests/unit/subjects/subjectNavigationAdapter.test.js')
if not old_test.exists() or new_test.exists():
    raise RuntimeError('adapter test rename precondition failed')
old_test.rename(new_test)

# Current source, tests and living documentation use the accurate adapter name.
roots = [Path('src'), Path('tests'), Path('docs'), Path('scripts')]
files = []
for root in roots:
    files.extend(path for path in root.rglob('*') if path.is_file())
files.append(Path('CLAUDE.md'))
for path in files:
    try:
        text = path.read_text()
    except UnicodeDecodeError:
        continue
    updated = text.replace('subjectCatalogue.js', 'subjectNavigationAdapter.js')
    updated = updated.replace('subjectCatalogue', 'subjectNavigationAdapter')
    if updated != text:
        path.write_text(updated)

adapter = new_adapter
text = adapter.read_text()
text = text.replace(
    'Stage 5B makes the generated navigation projection authoritative for',
    'Stage 5C keeps the generated navigation projection authoritative for',
)
adapter.write_text(text)

subjects = Path('src/features/subjects/Subjects.jsx')
source = subjects.read_text()
pattern = r"\nconst CHAPTER_HEADER_IMAGES = \{[\s\S]*?\n\}\n\n// ─── SubjectBrowser"
replacement = "\nconst DEFAULT_CHAPTER_HEADER_IMAGE = '/images/history/_shared/medicine-through-time.webp'\n\n// ─── SubjectBrowser"
source, removed = re.subn(pattern, replacement, source, count=1)
if removed != 1:
    raise RuntimeError(f'expected to remove one CHAPTER_HEADER_IMAGES map, removed {removed}')

replacements = {
    "navigationEntry?.heroImage || '/images/history/_shared/medicine-through-time.webp'":
        'navigationEntry?.heroImage || DEFAULT_CHAPTER_HEADER_IMAGE',
    'item.headerImage || CHAPTER_HEADER_IMAGES[item.id] || headerImg':
        'item.headerImage || headerImg',
    "continueChapter.headerImage || CHAPTER_HEADER_IMAGES[continueChapter.id] || '/images/history/_shared/medicine-through-time.webp'":
        'continueChapter.headerImage || DEFAULT_CHAPTER_HEADER_IMAGE',
    'biggestWinChapter.headerImage || CHAPTER_HEADER_IMAGES[biggestWinChapter.id]':
        'biggestWinChapter.headerImage || DEFAULT_CHAPTER_HEADER_IMAGE',
}
for old, new in replacements.items():
    count = source.count(old)
    if count != 1:
        raise RuntimeError(f'Subjects.jsx expected one occurrence of {old!r}, found {count}')
    source = source.replace(old, new, 1)

if 'CHAPTER_HEADER_IMAGES' in source:
    raise RuntimeError('CHAPTER_HEADER_IMAGES survived cleanup')
if 'SUBJECT_TOPIC_IMAGES' not in source:
    raise RuntimeError('Stage 5C must not remove the separately governed random tile imagery')
subjects.write_text(source)

unit_test = new_test
text = unit_test.read_text()
text = text.replace("describe('Stage 5B subject-browser adapter'", "describe('Subject-navigation adapter'")
unit_test.write_text(text)

navigation_test = Path('tests/architecture/curriculum-navigation.test.js')
text = navigation_test.read_text().rstrip()
marker = "describe('Stage 5C navigation cleanup boundary'"
if marker in text:
    raise RuntimeError('Stage 5C cleanup boundary test already exists')
cleanup_test = r'''

describe('Stage 5C navigation cleanup boundary', () => {
  it('uses the accurately named adapter as the sole production projection boundary', () => {
    const oldPath = resolve(ROOT, 'src/features/subjects/subjectCatalogue.js')
    const adapterPath = resolve(ROOT, 'src/features/subjects/subjectNavigationAdapter.js')
    expect(existsSync(oldPath)).toBe(false)
    expect(existsSync(adapterPath)).toBe(true)

    const productionFiles = filesUnder('src', ['.js', '.jsx'])
    const generatedImport = /(?:from\s*|import\s*\(\s*)['"][^'"]*generated\/curriculum\/navigation\.js['"]/
    const generatedImporters = productionFiles
      .filter(path => generatedImport.test(readFileSync(resolve(ROOT, path), 'utf8')))
      .sort()
    expect(generatedImporters).toEqual(['src/features/subjects/subjectNavigationAdapter.js'])
  })

  it('keeps the dead image fallback map retired without changing tile imagery', () => {
    const subjects = readFileSync(resolve(ROOT, 'src/features/subjects/Subjects.jsx'), 'utf8')
    expect(subjects).not.toContain('CHAPTER_HEADER_IMAGES')
    expect(subjects).toContain('DEFAULT_CHAPTER_HEADER_IMAGE')
    expect(subjects).toContain('SUBJECT_TOPIC_IMAGES')
    expect(subjects).toContain("from './subjectNavigationAdapter.js'")
  })
})
'''
navigation_test.write_text(text + cleanup_test)

generator = Path('scripts/generate-curriculum-navigation.mjs')
text = generator.read_text()
text = text.replace('// Stage 5B: renders', '// Stage 5C: renders')
text = text.replace("'// Stage 5B: consumed through", "'// Stage 5C: consumed through")
text = text.replace("'Stage 5B makes it load-bearing through", "'Stage 5C keeps it load-bearing through")
generator.write_text(text)

readme = Path('src/curriculum-catalogue/navigation/README.md')
text = readme.read_text().replace('Stage 5B is complete:', 'Stage 5C is complete:')
readme.write_text(text)

migration = Path('.planning/phase-5-curriculum-architecture/stage-5-navigation/MIGRATION-PLAN.md')
text = migration.read_text()
text = text.replace('# Stage 5, split into 5A and 5B', '# Stage 5, split into 5A, 5B and 5C', 1)
text = text.replace(
    'Stage 5B   switch the browser onto it                        gated visible cutover\n',
    'Stage 5B   switch the browser onto it                        gated visible cutover\nStage 5C   retire post-cutover scaffolding                     no learner change\n',
    1,
)
text = text.replace(
    '| `CHAPTER_HEADER_IMAGES` | deleted outright — all 20 entries are already dead (A-10) |',
    '| `CHAPTER_HEADER_IMAGES` | retained through the cutover, then removed in 5C after all 20 entries are proved unreachable (A-10) |',
    1,
)
old_paragraph = '''`subjectCatalogue.js` is deleted **only after** the 390px parity walkthrough
passes — not in the same breath as the switch.
'''
new_paragraph = '''The original `subjectCatalogue.js` identity is retained through the 390px parity
walkthrough as a thin runtime adapter. Stage 5C then renames that boundary to
`subjectNavigationAdapter.js`; the adapter remains because it joins generated
cards to runtime Chapters without letting UI components import the projection.
'''
if old_paragraph not in text:
    raise RuntimeError('Stage 5B adapter paragraph did not match')
text = text.replace(old_paragraph, new_paragraph, 1)

stage6 = '## Stage 6 — unchanged by this split\n'
if stage6 not in text:
    raise RuntimeError('Stage 6 marker missing')
stage5c = '''## Stage 5C — post-cutover cleanup

**Lands**

- renames the surviving thin runtime boundary to
  `src/features/subjects/subjectNavigationAdapter.js`;
- renames its unit test and updates current architecture guards and documentation;
- removes the 20-entry `CHAPTER_HEADER_IMAGES` fallback only after proving every
  mapped runtime Chapter already owns a canonical `headerImage`;
- adds a guard that the generated navigation projection has exactly one
  production importer and that the old adapter identity cannot regrow.

**Does not touch:** Browser Entry configuration, generated card order, learner
copy, progress reads or writes, Chapter opening, `SUBJECT_TOPIC_IMAGES`, the
compatibility projections, or Stage 6 consumers.

**Proves:** the seven-destination 390px walkthrough still passes; the full
repository verification remains green; and the cleanup changes naming and dead
fallbacks only.

'''
text = text.replace(stage6, stage5c + stage6, 1)
text = text.replace(
    '| 5B | a subject disappears from the browser | revert `Subjects.jsx`; the projection stays |',
    '| 5B | a subject disappears from the browser | revert `Subjects.jsx`; the projection stays |\n| 5C | adapter cleanup changes browser behaviour | revert the cleanup commit; the Stage 5B boundary remains valid |',
    1,
)
migration.write_text(text)

live_roots = [Path('src'), Path('tests'), Path('docs'), Path('scripts'), Path('CLAUDE.md')]
leftovers = []
intentional_old_path = 'src/features/subjects/subjectCatalogue.js'
intentional_guard_file = Path('tests/architecture/curriculum-navigation.test.js')
for root in live_roots:
    paths = [root] if root.is_file() else [path for path in root.rglob('*') if path.is_file()]
    for path in paths:
        try:
            value = path.read_text()
        except UnicodeDecodeError:
            continue
        if path == intentional_guard_file:
            count = value.count(intentional_old_path)
            if count != 1:
                raise RuntimeError(
                    f'{intentional_guard_file} must contain exactly one negative-path reference; found {count}'
                )
            value = value.replace(intentional_old_path, '', 1)
        if 'subjectCatalogue' in value:
            leftovers.append(str(path))
if leftovers:
    raise RuntimeError(f'current files still reference subjectCatalogue: {leftovers}')
if old_adapter.exists() or old_test.exists():
    raise RuntimeError('old adapter identity still exists')

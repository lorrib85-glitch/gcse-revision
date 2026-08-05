from pathlib import Path
import re


# The UI adapter does not need a moduleId payload. Module identity remains in
# generated navigation; browser cards use navigationKind plus their canonical id.
adapter = Path('src/features/subjects/subjectCatalogue.js')
source = adapter.read_text()
source = source.replace('      moduleId: card.moduleId ?? null,\n', '')
source = source.replace('      moduleId: null,\n', '')
assert 'moduleId:' not in source
adapter.write_text(source)


# Stage 4 remains strict for the three runtime projections. Navigation is a
# separate Stage 5B projection with its own one-adapter boundary test.
parity = Path('tests/architecture/curriculum-projection-parity.test.js')
source = parity.read_text()
old = "const REACHES_GENERATED = /(?:from\\s*|import\\s*\\(?\\s*)['\"][^'\"]*generated\\/curriculum\\//"
new = "const REACHES_RUNTIME_GENERATED = /(?:from\\s*|import\\s*\\(?\\s*)['\"][^'\"]*generated\\/curriculum\\/(?:modules|chapters|chapterContentLoaders)\\.js/"
assert old in source
source = source.replace(old, new, 1)
source = source.replace('REACHES_GENERATED', 'REACHES_RUNTIME_GENERATED')
source = source.replace(
    "it('is exactly three files wide — only the boundary files import the projections', () => {",
    "it('is exactly three files wide — only the boundary files import the runtime projections', () => {",
)
source = source.replace(
    "'a fourth file reached past the boundary'",
    "'a fourth file reached a Stage 4 runtime projection'",
)
assert 'REACHES_GENERATED' not in source
assert 'REACHES_RUNTIME_GENERATED' in source
parity.write_text(source)


vocabulary = Path('tests/architecture/canonical-vocabulary.test.js')
source = vocabulary.read_text()
old = "const reaches = /(?:from\\s*|import\\s*\\(?\\s*)['\"][^'\"]*generated\\/curriculum\\//"
new = "const reaches = /(?:from\\s*|import\\s*\\(?\\s*)['\"][^'\"]*generated\\/curriculum\\/(?:modules|chapters|chapterContentLoaders)\\.js/"
assert old in source
source = source.replace(old, new, 1)
source = source.replace(
    '// The Stage 4 boundary is exactly three files wide. A fourth importer would\n'
    '    // mean a consumer had been re-pointed past the public files.',
    '// The Stage 4 runtime boundary is exactly three files wide. The separate\n'
    '    // Stage 5B navigation projection is guarded by curriculum-navigation.test.js.',
)
vocabulary.write_text(source)


# Browser subject coverage now comes from generated navigation through the
# adapter, not from the removed display-title object in Subjects.jsx.
app = Path('tests/architecture/app-boundaries.test.js')
source = app.read_text()
import_line = "import { SUBJECTS } from '../../src/constants/subjects.js'\n"
replacement = import_line + "import { SUBJECT_NAVIGATION_NAMES } from '../../src/features/subjects/subjectCatalogue.js'\n"
assert import_line in source
source = source.replace(import_line, replacement, 1)
old_block = """  // Field presence, not colour uniqueness: every subject the browser can render
  // must own both presentation roles canonically, so no subject silently falls
  // through to the History fallback. Driven off the browser's own subject list
  // so adding a subject there without the fields fails here.
  it('every subject the browser displays owns both presentation roles', () => {
    const browserSrc = read('src/features/subjects/Subjects.jsx')
    const block = browserSrc.match(/const SUBJECT_DISPLAY_TITLES = \\{([\\s\\S]*?)\\n\\}/)
    expect(block, 'SUBJECT_DISPLAY_TITLES not found in Subjects.jsx').toBeTruthy()
    const browserSubjects = [...block[1].matchAll(/^\\s{2}(\\w+):/gm)].map(m => m[1])
    expect(browserSubjects.length).toBeGreaterThan(0)

    const missing = browserSubjects.filter(
      name => !SUBJECTS[name]?.subjectBrowserAccent || !SUBJECTS[name]?.subjectBrowserAccentDark,
    )
    expect(
      missing,
      `Subjects missing subjectBrowserAccent/subjectBrowserAccentDark in constants/subjects.js: ${missing.join(', ')}`,
    ).toEqual([])
  })
"""
new_block = """  // Field presence, not colour uniqueness: every generated browser entry
  // must own both presentation roles canonically.
  it('every subject the browser displays owns both presentation roles', () => {
    const browserSubjects = SUBJECT_NAVIGATION_NAMES
    expect(browserSubjects.length).toBeGreaterThan(0)

    const missing = browserSubjects.filter(
      name => !SUBJECTS[name]?.subjectBrowserAccent || !SUBJECTS[name]?.subjectBrowserAccentDark,
    )
    expect(
      missing,
      `Subjects missing subjectBrowserAccent/subjectBrowserAccentDark in constants/subjects.js: ${missing.join(', ')}`,
    ).toEqual([])
  })
"""
assert old_block in source
source = source.replace(old_block, new_block, 1)
app.write_text(source)


# Placeholder history is now frozen in the browser-v1 fixture. The live adapter
# must not retain cs_* identities after Stage 5B.
catalogue = Path('tests/architecture/curriculum-catalogue-integrity.test.js')
source = catalogue.read_text()
old = "    const subjectCatalogue = read('src/features/subjects/subjectCatalogue.js')\n"
new = "    const browserFixture = JSON.parse(read('tests/fixtures/subject-browser-v1.json'))\n"
assert old in source
source = source.replace(old, new, 1)
old = "      expect(subjectCatalogue, `${from} was never a placeholder`).toContain(`id: '${from}'`)"
new = "      expect(browserFixture.placeholderMappings[from], `${from} was never a placeholder`).toBe(to)"
assert old in source
source = source.replace(old, new, 1)
catalogue.write_text(source)


# Browser availability is now governed by generated `openable`; runtime Chapter
# availability remains checked when the projection is generated and adapted.
safety = Path('tests/architecture/placeholder-chapter-safety.test.js')
source = safety.read_text()
old_block = """  it('Subjects uses canonical chapter availability and maps non-available chapters to coming_soon', () => {
    const src = read('src/features/subjects/Subjects.jsx')
    expect(src).toMatch(/getChapterAvailability\\((mod|chapter)\\)/)
    expect(src).toMatch(/CHAPTER_AVAILABILITY\\.AVAILABLE.*coming_soon|coming_soon[\\s\\S]*CHAPTER_AVAILABILITY\\.AVAILABLE/)
  })
"""
new_block = """  it('generated navigation openability maps to browser coming-soon state', () => {
    const adapter = read('src/features/subjects/subjectCatalogue.js')
    const subjects = read('src/features/subjects/Subjects.jsx')
    expect(adapter).toContain('comingSoon: !card.openable')
    expect(adapter).toContain('openable: card.openable')
    expect(subjects).toMatch(/if\\s*\\(!item\\.openable\\)[\\s\\S]*status:\\s*'coming_soon'/)
  })
"""
assert old_block in source
source = source.replace(old_block, new_block, 1)
safety.write_text(source)

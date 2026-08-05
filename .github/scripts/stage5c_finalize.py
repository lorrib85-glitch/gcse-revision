from pathlib import Path
import re


def replace_once(path: Path, old: str, new: str) -> None:
    text = path.read_text()
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f'{path}: expected one occurrence of {old!r}, found {count}')
    path.write_text(text.replace(old, new, 1))


def replace_pattern_once(path: Path, pattern: str, replacement: str) -> None:
    text = path.read_text()
    updated, count = re.subn(pattern, replacement, text, count=1)
    if count != 1:
        raise RuntimeError(f'{path}: expected one pattern match, found {count}')
    path.write_text(updated)


adapter = Path('src/features/subjects/subjectNavigationAdapter.js')
replace_once(
    adapter,
    """  return {
    ...(runtimeChapter ?? {}),
    id: card.id,
    chapterId: card.chapterId ?? null,
    navigationKind: card.kind,
    title: card.title,
    subtitle: card.subtitle,
    number: card.number,
    series,
    headerImage: card.headerImage ?? card.heroImage ?? runtimeChapter?.headerImage ?? null,
    comingSoon: !card.openable,
    openable: card.openable,
    canonical: card.canonical,
  }
""",
    """  return {
    id: card.id,
    chapterId: card.chapterId ?? null,
    navigationKind: card.kind,
    title: card.title,
    subtitle: card.subtitle,
    number: card.number,
    series,
    screenCount: runtimeChapter?.screenCount ?? 0,
    headerImage: card.headerImage ?? card.heroImage ?? runtimeChapter?.headerImage ?? null,
    comingSoon: !card.openable,
    openable: card.openable,
    canonical: card.canonical,
  }
""",
)
replace_once(
    adapter,
    '// runtime Chapter records so existing progress and opening behaviour stay\n// unchanged.',
    '// runtime Chapter screen counts so existing progress calculations stay unchanged.\n// It deliberately does not spread compatibility-shaped Chapter rows into the UI.',
)

unit_test = Path('tests/unit/subjects/subjectNavigationAdapter.test.js')
insert_before = """  it('returns no entry for an unknown destination', () => {
"""
new_test = """  it('does not leak compatibility-shaped Chapter fields into browser cards', () => {
    const card = getSubjectChapterList('History').find(item => item.openable)
    expect(card.screenCount).toBeGreaterThan(0)
    for (const legacyField of ['color', 'colorLight', 'tags', 'era', 'icon', 'subject']) {
      expect(card).not.toHaveProperty(legacyField)
    }
  })

"""
replace_once(unit_test, insert_before, new_test + insert_before)

compatibility = Path('src/curriculum-catalogue/compatibility/index.js')
replace_once(
    compatibility,
    """export const STAGE_5_CONSUMERS = [
  'src/features/subjects/Subjects.jsx',
  'src/features/subjects/subjectNavigationAdapter.js',
]
""",
    """export const STAGE_5_CONSUMERS = [
  'src/features/subjects/Subjects.jsx',
]
""",
)
replace_once(
    compatibility,
    "stage5Consumers: ['src/features/subjects/subjectNavigationAdapter.js'],",
    "stage5Consumers: ['src/features/subjects/Subjects.jsx'],",
)
replace_once(
    compatibility,
    "stage5Consumers: ['src/features/subjects/Subjects.jsx', 'src/features/subjects/subjectNavigationAdapter.js'],",
    "stage5Consumers: ['src/features/subjects/Subjects.jsx'],",
)
replace_once(
    compatibility,
    """  'chapterFields.color': {
    stage5Consumers: ['src/features/subjects/subjectNavigationAdapter.js'],
""",
    """  'chapterFields.color': {
    stage5Consumers: [],
""",
)
replace_once(
    compatibility,
    "reason: 'chapter.color is the per-chapter accent the player themes with and the completion '",
    "reason: 'The subject browser did not read chapter.color. It remains the per-chapter accent the player themes with and the completion '",
)

claude = Path('CLAUDE.md')
replace_once(
    claude,
    "- `SubjectsTab` (`src/features/subjects/Subjects.jsx`) — subject browser; each subject presents its ordered chapter journey, built by `src/features/subjects/subjectNavigationAdapter.js` from the subject's modules. History and English series tabs (labels, hero images, the empty Elizabethan tab) are local presentation in `Subjects.jsx` — a `series` is not a module id",
    "- `SubjectsTab` (`src/features/subjects/Subjects.jsx`) — subject browser. Destination order, copy, sections and card order come from generated canonical navigation through `subjectNavigationAdapter.js`; the adapter joins openable Chapter cards to runtime screen counts without exposing compatibility-shaped rows. `Subjects.jsx` owns rendering, progress reads and chapter opening, not curriculum or navigation configuration",
)
replace_once(
    claude,
    "| `src/features/subjects/subjectNavigationAdapter.js` | **Subject-browser catalogue.** `getSubjectChapterList(subject)` — real chapters resolved from the subject's modules in canonical order, merged with the `cs_*` synthetic placeholder cards. Synthetic cards are browse-surface presentation only: no content, no loader, no progress, never openable, and never added to `CHAPTERS` or `MODULES`. |",
    "| `src/features/subjects/subjectNavigationAdapter.js` | **Sole production boundary for generated subject navigation.** Exposes ordered Browser Entries and adapts their Chapter, Module and subject-state cards to the UI contract. Only Chapter cards receive a runtime `screenCount`; no compatibility-shaped Chapter row is spread into the browser. UI components must use this adapter rather than importing `src/data/generated/curriculum/navigation.js` directly. |",
)

hierarchy = Path('docs/system/CONTENT_HIERARCHY.md')
replace_pattern_once(
    hierarchy,
    r"## Subject browsing\n[\s\S]*?\n## Authoritative files",
    """## Subject browsing

Learner-facing destination order, browser copy, sections and card presentation
are authored in `src/curriculum-catalogue/navigation/browserEntries.js` and
combined with canonical pathway, Module and Chapter records by
`scripts/generate-curriculum-navigation.mjs`. The generated runtime projection
is `src/data/generated/curriculum/navigation.js`.

`src/features/subjects/subjectNavigationAdapter.js` is the projection's sole
production importer. It converts Browser Entries into the UI contract and joins
Chapter cards only to their runtime `screenCount`, preserving progress
calculation without spreading compatibility-shaped `CHAPTERS` rows into the
browser. Module cards and the Chemistry subject-level state remain non-openable.

All 70 card identities are canonical Chapter or Module ids. The former `cs_*`
synthetic placeholder ids are retired; the Chemistry coming-soon state is not a
Chapter and has no Chapter id.

Visible order comes from configured pathways, section `moduleIds`, canonical
Module `chapterRefs` and explicitly governed temporary display overrides. It is
never derived from `CHAPTERS` row order. Sections are navigation presentation,
not curriculum ownership: one section may span several canonical Modules, as
the Medicine section spans Medicine in Britain and the Western Front.

## Authoritative files""",
)
replace_once(
    hierarchy,
    '- `src/features/subjects/subjectNavigationAdapter.js` — subject-browser catalogue assembly.',
    '- `src/curriculum-catalogue/navigation/browserEntries.js` — authored Browser Entry configuration.\n- `src/data/generated/curriculum/navigation.js` — generated browser projection; never hand-edit.\n- `src/features/subjects/subjectNavigationAdapter.js` — sole production projection adapter.',
)

adr = Path('docs/decisions/0002-canonical-curriculum-architecture.md')
replace_once(
    adr,
    "projection, **5B** switches `Subjects.jsx` onto it. Contract pack:",
    "projection, **5B** switches `Subjects.jsx` onto it, and **5C** retires post-cutover naming and dead fallbacks without changing learner behaviour. Contract pack:",
)
replace_once(
    adr,
    """- `src/features/subjects/subjectNavigationAdapter.js` is deleted; eight hardcoded
  literals leave `Subjects.jsx`; all twelve `cs_*` placeholder ids retire.
""",
    """- The old `subjectCatalogue.js` is retired. The accurately named
  `subjectNavigationAdapter.js` remains as the sole production boundary to the
  generated projection; hardcoded browser catalogues and all twelve `cs_*`
  placeholder ids retire.
""",
)
replace_once(
    adr,
    """- `docs/system/CONTENT_HIERARCHY.md` is superseded — including its statement
  that "Subject owns brand, specification and overall progress", which no
  subject record has ever done.
""",
    """- `docs/system/CONTENT_HIERARCHY.md` is updated to distinguish curriculum
  ownership from Browser Entry presentation and generated navigation.
""",
)

runtime_doc = Path('docs/system/CURRICULUM_RUNTIME_COMPATIBILITY.md')
replace_once(
    runtime_doc,
    '| `legacyModules` | `subjectNavigationAdapter.js` | `progress.js`, `chapterNavigation.js`, `dailyPlanner.js`, `ChapterPlayer.jsx` | Stage 6 |',
    '| `legacyModules` | subject browser (`Subjects.jsx`) | `progress.js`, `chapterNavigation.js`, `dailyPlanner.js`, `ChapterPlayer.jsx` | Stage 6 |',
)
replace_once(
    runtime_doc,
    '| `chapterOrder` | `Subjects.jsx`, `subjectNavigationAdapter.js` | `progress.js`, `chapterNavigation.js`, `LegacyApp.jsx`, `dailyPlanner.js`, `todaysPlan.js`, `Progress.jsx`, `ChapterCompleteScreen.jsx`, `contentHierarchy.js` | Stage 6 |',
    '| `chapterOrder` | subject browser (`Subjects.jsx`) | `progress.js`, `chapterNavigation.js`, `LegacyApp.jsx`, `dailyPlanner.js`, `todaysPlan.js`, `Progress.jsx`, `ChapterCompleteScreen.jsx`, `contentHierarchy.js` | Stage 6 |',
)
replace_once(
    runtime_doc,
    '| `chapterFields.color` | `subjectNavigationAdapter.js` | `ChapterPlayer.jsx`, `chapterNavigation.js` | Stage 6 |',
    '| `chapterFields.color` | — (not read by the browser) | `ChapterPlayer.jsx`, `chapterNavigation.js` | Stage 6 |',
)

implementation = Path('.planning/phase-5-curriculum-architecture/IMPLEMENTATION-PLAN.md')
replace_pattern_once(
    implementation,
    r"## Stage 5 — split into 5A and 5B\n[\s\S]*?\n---\n\n## Stage 6",
    """## Stage 5 — canonical subject navigation

Stage 5 is complete in three controlled slices:

- **5A** defines Browser Entries and generates
  `src/data/generated/curriculum/navigation.js` without a runtime import.
- **5B** switches the live subject browser onto that projection through a thin
  adapter, preserving seven destinations, 71 visible items, 30 openable
  Chapters, card copy, numbering, tabs and progress behaviour.
- **5C** renames the surviving boundary to
  `subjectNavigationAdapter.js`, removes the proved-dead 20-entry Chapter image
  fallback, narrows the adapter so compatibility-shaped Chapter rows do not
  leak into the UI, and updates the architecture records. No learner-visible
  behaviour changes.

Browser presentation remains separate from the six curriculum entity types.
`browserEntries.js` owns destination copy, imagery, sections and card mode;
canonical pathway, Module and Chapter records own academic identity and order.
Temporary number and Physics-label overrides remain governed by
`stage-5-navigation/DECISIONS.md`.

The compatibility projection remains intact until Stage 6. Stage 5 migrates the
subject browser only; the remaining runtime consumers still require the legacy
`MODULES`, `CHAPTERS` and `CHAPTER_CONTENT_LOADERS` interfaces.

Full contract pack: `stage-5-navigation/`.

---

## Stage 6""",
)

audit = Path('.planning/phase-5-curriculum-architecture/stage-5-navigation/AUDIT.md')
replace_pattern_once(
    audit,
    r"## 4\. What Stage 5B still has to do after 5A\n[\s\S]*$",
    """## 4. Implementation outcome

Stage 5B switched the live browser to `NAVIGATION_ENTRIES` through a thin
runtime adapter and passed the frozen parity contract plus the seven-destination
390px walkthrough. Browser copy, sections, order, openability and progress
behaviour were preserved; canonical Chapter and Module ids replaced every
`cs_*` placeholder identity.

Stage 5C then renamed the retained boundary to
`subjectNavigationAdapter.js`, proved and removed all 20 dead
`CHAPTER_HEADER_IMAGES` entries, and narrowed the adapter to pass only the
runtime `screenCount` required by the browser. `SUBJECT_TOPIC_IMAGES` remains a
separate presentation decision. The generated projection has exactly one
production importer and no compatibility-shaped Chapter row is spread into the
UI.
""",
)

decisions = Path('.planning/phase-5-curriculum-architecture/stage-5-navigation/DECISIONS.md')
replace_once(
    decisions,
    'not caused by it.\n\n### OD-5-D',
    'not caused by it.\n\n### OD-5-D',
)
replace_once(
    decisions,
    'implement them, and no progress-writing behaviour changes in Stage 5A or 5B\nuntil they are separately settled and authorised.',
    'implement them, and no progress-writing behaviour changes in Stage 5A, 5B or 5C\nuntil they are separately settled and authorised.',
)

# Architecture record: the Stage 5 logical consumer is the browser feature,
# never the new projection adapter. The adapter must also stay narrow.
compatibility_test = Path('tests/architecture/curriculum-compatibility.test.js')
insert_before = """  it('every surviving consumer really consumes the fact', () => {
"""
new_guard = """  it('records the browser feature, not the projection adapter, as the Stage 5 consumer', () => {
    expect(STAGE_5_CONSUMERS).toEqual(['src/features/subjects/Subjects.jsx'])
    for (const entry of Object.values(FINAL_CONSUMERS)) {
      expect(entry.stage5Consumers).not.toContain('src/features/subjects/subjectNavigationAdapter.js')
    }
  })

"""
replace_once(compatibility_test, insert_before, new_guard + insert_before)

# Current documentation must describe the generated boundary, not the retired
# synthetic catalogue model.
nav_test = Path('tests/architecture/curriculum-navigation.test.js')
insert_before = """  it('keeps the dead image fallback map retired without changing tile imagery', () => {
"""
new_guard = """  it('keeps current architecture guidance on the generated navigation model', () => {
    const hierarchy = readFileSync(resolve(ROOT, 'docs/system/CONTENT_HIERARCHY.md'), 'utf8')
    const claude = readFileSync(resolve(ROOT, 'CLAUDE.md'), 'utf8')
    expect(hierarchy).toContain('All 70 card identities are canonical Chapter or Module ids')
    expect(hierarchy).not.toContain('The browser also renders `cs_*`')
    expect(claude).toContain('Sole production boundary for generated subject navigation')
    expect(claude).not.toContain('merged with the `cs_*` synthetic placeholder cards')
  })

"""
replace_once(nav_test, insert_before, new_guard + insert_before)

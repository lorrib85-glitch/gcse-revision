from pathlib import Path
import re

ROOT = Path('.')

# Any architecture suite still importing the chapter catalogue through the old
# path must move to the canonical export and vocabulary.
for path in (ROOT / 'tests/architecture').glob('*.test.js'):
    text = path.read_text(encoding='utf-8')
    if "from '../../src/modules.js'" in text:
        text = text.replace(
            "import { MODULES } from '../../src/modules.js'",
            "import { CHAPTERS } from '../../src/chapters.js'",
        )
        text = re.sub(r'\bMODULES\b', 'CHAPTERS', text)
    text = text.replace(
        "from '../../src/content/moduleContentRegistry.js'",
        "from '../../src/content/chapterContentRegistry.js'",
    )
    text = text.replace('MODULE_CONTENT_LOADERS', 'CHAPTER_CONTENT_LOADERS')
    path.write_text(text, encoding='utf-8')

# The runtime contract now proves that the facades are absent, not thin.
runtime_path = ROOT / 'tests/architecture/chapter-runtime-contract.test.js'
runtime = runtime_path.read_text(encoding='utf-8')
runtime = re.sub(
    r"  it\('ChapterPlayer owns the runtime and ModulePlayer remains a thin facade'.*?\n  \}\)\n",
    """  it('ChapterPlayer is the sole chapter runtime', () => {\n    const canonical = read('src/components/layout/ChapterPlayer.jsx')\n    expect(canonical).toContain('export default function ChapterPlayer(props)')\n    expect(canonical).toContain('function ValidatedChapterPlayer({ chapter, onBack, onChapterComplete })')\n    expect(canonical).toContain('computeInitialChapterState(chapter, saved)')\n    expect(canonical).toContain('getChapterGate(chapter,')\n  })\n""",
    runtime,
    count=1,
    flags=re.S,
)
runtime = runtime.replace(
    "  it('production source does not import the legacy player or navigation implementation', () => {\n"
    "    const playerViolators = sources\n"
    "      .filter(source => source.path !== 'src/components/layout/ModulePlayer.jsx')\n"
    "      .filter(source => /from\\s+['\"][^'\"]*ModulePlayer\\.jsx['\"]|import\\(['\"][^'\"]*ModulePlayer\\.jsx['\"]\\)/.test(source.content))\n"
    "      .map(source => source.path)\n"
    "    const navigationViolators = sources\n"
    "      .filter(source => source.path !== 'src/app/moduleNavigation.js')\n"
    "      .filter(source => /from\\s+['\"][^'\"]*moduleNavigation\\.js['\"]/.test(source.content))\n"
    "      .map(source => source.path)\n"
    "    expect(playerViolators).toEqual([])\n"
    "    expect(navigationViolators).toEqual([])\n"
    "  })",
    """  it('production source contains no deleted runtime imports', () => {\n    const playerViolators = sources\n      .filter(source => /from\\s+['\"][^'\"]*ModulePlayer\\.jsx['\"]|import\\(['\"][^'\"]*ModulePlayer\\.jsx['\"]\\)/.test(source.content))\n      .map(source => source.path)\n    const navigationViolators = sources\n      .filter(source => /from\\s+['\"][^'\"]*moduleNavigation\\.js['\"]/.test(source.content))\n      .map(source => source.path)\n    expect(playerViolators).toEqual([])\n    expect(navigationViolators).toEqual([])\n  })""",
)
runtime_path.write_text(runtime, encoding='utf-8')

# Rename architecture files whose names themselves teach the old model.
renames = {
    'tests/architecture/extracted-module-contract.test.js': 'tests/architecture/extracted-chapter-contract.test.js',
    'tests/architecture/placeholder-module-safety.test.js': 'tests/architecture/placeholder-chapter-safety.test.js',
}
for old, new in renames.items():
    old_path = ROOT / old
    if not old_path.exists():
        continue
    text = old_path.read_text(encoding='utf-8')
    text = text.replace('Module', 'Chapter').replace('module', 'chapter')
    # The canonical catalogue exports CHAPTERS; parent MODULES imports, if any,
    # remain untouched because the replacement above only operates in these old
    # chapter-as-module contracts.
    (ROOT / new).write_text(text, encoding='utf-8')
    old_path.unlink()

# Confirm no architecture test imports deleted runtime/catalogue files.
joined = '\n'.join(p.read_text(encoding='utf-8') for p in (ROOT / 'tests/architecture').glob('*.test.js'))
for forbidden in ["../../src/modules.js", 'ModulePlayer.jsx', 'moduleNavigation.js', 'MODULE_CONTENT_LOADERS']:
    if forbidden in joined:
        raise RuntimeError(f'stale architecture contract survived: {forbidden}')

print('Remaining Phase 6 architecture tests migrated')

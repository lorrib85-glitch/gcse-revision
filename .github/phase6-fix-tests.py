from pathlib import Path
import re

ROOT = Path('.')

# The loader compatibility facade is part of the Phase 6 removal set.
legacy_loader = ROOT / 'src/content/moduleContentRegistry.js'
if legacy_loader.exists():
    legacy_loader.unlink()

# Any architecture suite still importing the chapter catalogue through the old
# path must move to the canonical export and vocabulary. The final anti-regression
# test is excluded because it intentionally quotes the deleted symbols.
for path in (ROOT / 'tests/architecture').glob('*.test.js'):
    if path.name == 'legacy-content-imports.test.js':
        continue
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
    (ROOT / new).write_text(text, encoding='utf-8')
    old_path.unlink()

# The placeholder contract now reads the canonical metadata catalogue directly.
placeholder_path = ROOT / 'tests/architecture/placeholder-chapter-safety.test.js'
placeholder = placeholder_path.read_text(encoding='utf-8')
placeholder_replacement = """  it('the canonical chapter catalogue contains governed unbuilt chapters', () => {
    const metadata = read('src/chapters.js')
    expect(metadata).toContain('export const CHAPTERS = [')
    expect(metadata).toMatch(/screenCount:\s*0/)
    expect(metadata).toContain('export const CHAPTER_AVAILABILITY')
  })
"""
placeholder = re.sub(
    r"  it\('the compatibility metadata source still contains unbuilt chapters'.*?\n  \}\)\n",
    lambda _match: placeholder_replacement,
    placeholder,
    count=1,
    flags=re.S,
)
placeholder_path.write_text(placeholder, encoding='utf-8')

# Remove compatibility assertions from the content loading boundary.
loading_path = ROOT / 'tests/architecture/content-loading-boundary.test.js'
loading = loading_path.read_text(encoding='utf-8')
loading = loading.replace("import { MODULE_CONTENT_LOADERS } from '../../src/content/moduleContentRegistry.js'\n", '')
loading = re.sub(
    r"\n  it\('no file defines a second MODULE_CONTENT_LOADERS registry'.*?\n  \}\)\n\n"
    r"  it\('the compatibility alias is the exact canonical registry object'.*?\n  \}\)\n",
    '\n', loading, count=1, flags=re.S,
)
loading_path.write_text(loading, encoding='utf-8')

# Confirm there are no actual imports of deleted catalogue/runtime files. Quoted
# filenames inside the anti-regression tests themselves are intentional evidence.
for path in (ROOT / 'tests/architecture').glob('*.test.js'):
    text = path.read_text(encoding='utf-8')
    if "from '../../src/modules.js'" in text or "from '../../src/content/moduleContentRegistry.js'" in text:
        raise RuntimeError(f'stale architecture import survived: {path}')
    if re.search(r"from\s+['\"][^'\"]*ModulePlayer\.jsx['\"]", text):
        raise RuntimeError(f'stale ModulePlayer import survived: {path}')
    if re.search(r"from\s+['\"][^'\"]*moduleNavigation\.js['\"]", text):
        raise RuntimeError(f'stale moduleNavigation import survived: {path}')

print('Remaining Phase 6 architecture tests migrated')

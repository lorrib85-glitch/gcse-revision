from pathlib import Path
import re

ROOT = Path('.')

# Migrate unit tests that still import learner-facing chapters through the old
# src/modules.js catalogue. Parent MODULES imports from src/data/modules.js are
# valid and must not be changed.
for path in (ROOT / 'tests/unit').rglob('*.test.js'):
    text = path.read_text(encoding='utf-8')
    original = text

    if "from '../../src/modules.js'" in text or "from '../../../src/modules.js'" in text:
        text = text.replace("from '../../src/modules.js'", "from '../../src/chapters.js'")
        text = text.replace("from '../../../src/modules.js'", "from '../../../src/chapters.js'")
        text = re.sub(r'\bMODULES\b', 'CHAPTERS', text)
        text = text.replace('isModuleAvailable', 'isChapterAvailable')

    if "import('../../src/modules.js')" in text:
        text = text.replace("import('../../src/modules.js')", "import('../../src/chapters.js')")
        text = re.sub(r'\bMODULES\b', 'CHAPTERS', text)

    # Recovery routing is chapter-based after Phase 2; remove the final test-only
    # aliases so the tests assert the canonical public API.
    text = text.replace('TAG_MODULE_MAP', 'TAG_CHAPTER_MAP')
    text = text.replace('findTaggedScreen', 'findTaggedChapterScreen')

    if text != original:
        path.write_text(text, encoding='utf-8')

# Persistence tests continue proving old gcse_module_* keys migrate, but no
# longer call the removed JavaScript compatibility functions.
persistence_path = ROOT / 'tests/unit/progressSync/chapterProgressPersistence.test.js'
persistence = persistence_path.read_text(encoding='utf-8')
persistence = persistence.replace('  getModuleState,\n', '')
persistence = persistence.replace('  saveModuleState,\n', '')
persistence = persistence.replace(
    "  it('all canonical and compatibility saves write only gcse_chapter keys', () => {\n"
    "    expect(saveChapterState('chapter-a', { screen: 2 })).toBe(true)\n"
    "    expect(saveModuleState('chapter-b', { screen: 3 })).toBe(true)\n\n"
    "    expect(JSON.parse(store['guest::gcse_chapter_chapter-a'])).toEqual({ screen: 2 })\n"
    "    expect(JSON.parse(store['guest::gcse_chapter_chapter-b'])).toEqual({ screen: 3 })\n"
    "    expect(Object.keys(store).some(key => key.includes('gcse_module_'))).toBe(false)\n"
    "    expect(getModuleState('chapter-b')).toEqual({ screen: 3 })\n"
    "  })",
    "  it('canonical saves write only gcse_chapter keys', () => {\n"
    "    expect(saveChapterState('chapter-a', { screen: 2 })).toBe(true)\n"
    "    expect(saveChapterState('chapter-b', { screen: 3 })).toBe(true)\n\n"
    "    expect(JSON.parse(store['guest::gcse_chapter_chapter-a'])).toEqual({ screen: 2 })\n"
    "    expect(JSON.parse(store['guest::gcse_chapter_chapter-b'])).toEqual({ screen: 3 })\n"
    "    expect(Object.keys(store).some(key => key.includes('gcse_module_'))).toBe(false)\n"
    "    expect(getChapterState('chapter-b')).toEqual({ screen: 3 })\n"
    "  })",
)
persistence_path.write_text(persistence, encoding='utf-8')

# Fail if any executable unit-test import or call still depends on deleted APIs.
for path in (ROOT / 'tests/unit').rglob('*.test.js'):
    text = path.read_text(encoding='utf-8')
    forbidden_patterns = [
        r"from\s+['\"][^'\"]*src/modules\.js['\"]",
        r"import\(['\"][^'\"]*src/modules\.js['\"]\)",
        r'\bgetModuleState\s*\(',
        r'\bsaveModuleState\s*\(',
        r'\bTAG_MODULE_MAP\b',
        r'\bfindTaggedScreen\b',
    ]
    for pattern in forbidden_patterns:
        if re.search(pattern, text):
            raise RuntimeError(f'stale unit contract {pattern} survived in {path}')

print('Remaining Phase 6 unit tests migrated')

from pathlib import Path
import re


def active_code_files():
    for root in [Path('src'), Path('tests')]:
        for path in root.rglob('*'):
            if path.is_file() and path.suffix in {'.js', '.jsx', '.mjs'}:
                yield path


# Files that import only the chapter catalogue must use CHAPTERS throughout.
# Files that also import src/data/modules.js legitimately keep MODULES for the
# parent curriculum units.
chapter_import = re.compile(r"import\s*\{\s*CHAPTERS\s*\}\s*from\s*['\"][^'\"]*chapters\.js['\"]")
parent_import = re.compile(r"import\s*\{\s*MODULES\s*\}\s*from\s*['\"][^'\"]*data/modules\.js['\"]")
for path in active_code_files():
    text = path.read_text(encoding='utf-8')
    if chapter_import.search(text) and not parent_import.search(text):
        text = re.sub(r'\bMODULES\b', 'CHAPTERS', text)
        text = text.replace('builtModules', 'builtChapters').replace('mod =>', 'chapter =>').replace('mod.id', 'chapter.id')
        text = text.replace('Extracted module content contracts', 'Extracted chapter content contracts')
        text = text.replace('No loader registered for module', 'No loader registered for chapter')
    path.write_text(text, encoding='utf-8')

# Remove compatibility aliases robustly after the first pass renamed both sides.
progress_path = Path('src/progress.js')
lines = progress_path.read_text(encoding='utf-8').splitlines()
self_aliases = {
    'getChapterState', 'saveChapterState', 'getChapterPct',
    'getContinueChapter', 'getInProgressChapter',
}
filtered = []
skip_comment = False
for line in lines:
    stripped = line.strip()
    match = re.fullmatch(r'export const (\w+) = (\w+)', stripped)
    if match and match.group(1) == match.group(2) and match.group(1) in self_aliases:
        continue
    if stripped == 'export const MODULES = MODULES':
        continue
    if stripped.startswith('// Temporary compatibility export') or stripped.startswith('// Temporary compatibility aliases'):
        skip_comment = True
        continue
    if skip_comment and stripped.startswith('//'):
        continue
    skip_comment = False
    filtered.append(line)
progress = '\n'.join(filtered) + '\n'
progress = progress.replace('// percentage still uses its legacy function name until Phase 3.', '// percentage uses the canonical chapter progress API.')
progress_path.write_text(progress, encoding='utf-8')

# The component directory documents both the lifecycle runtime and the governed
# component-routing boundary used by chapter authors.
registry_path = Path('docs/components/COMPONENT_REGISTRY.md')
registry = registry_path.read_text(encoding='utf-8')
if '### ScreenRenderer' not in registry:
    registry += """

---

### ScreenRenderer — **GOVERNED RUNTIME BOUNDARY**

**File:** `src/components/layout/ScreenRenderer.jsx`  
**Purpose:** The only approved route from registered chapter screen and nested block definitions to visual components. Chapter authors compose data through `src/data/screenRegistry.js`; they do not add component-selection branches to `ChapterPlayer`.  
**Inputs:** Current `screen`, `chapter`, subject/runtime context and continuation handlers supplied by `ChapterPlayer`.  
**Contract:** Every active screen or block type must exist in `src/data/screenRegistry.js`, satisfy its required-data schema and have a matching renderer implementation. Legacy entries are shrink-only and cannot be selected for new content.  
**Do not use for:** chapter lifecycle, persistence, opener/outcome gates, progress calculation or content-specific business logic. Those remain outside this routing boundary.  
**Governance:** `tests/architecture/screen-registry.test.js` prevents registry/renderer drift and prevents routing logic returning to `ChapterPlayer`.
"""
registry_path.write_text(registry, encoding='utf-8')

print('Phase 6 final symbol corrections applied')

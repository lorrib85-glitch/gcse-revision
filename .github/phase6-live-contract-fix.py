from pathlib import Path
import re

ROOT = Path('.')

# Replace the generated payload-compatibility test with syntax-safe newline
# handling. The migration script intentionally owns the semantic assertions;
# this pass only corrects their JavaScript representation.
path = ROOT / 'tests/architecture/legacy-content-imports.test.js'
text = path.read_text(encoding='utf-8')
replacement = """  it('contains no chapter-navigation compatibility payloads', () => {
    const source = filesUnder('src')
      .filter(path => /\.(js|jsx)$/.test(path))
      .map(path => `${path}${String.fromCharCode(10)}${read(path)}`)
      .join(String.fromCharCode(10))
    for (const legacy of ["kind: 'module'", 'nextModule:        nextChapter', 'sel.moduleId']) {
      expect(source, legacy).not.toContain(legacy)
    }
  })

"""
text, count = re.subn(
    r"  it\('contains no chapter-navigation compatibility payloads'.*?(?=  it\('keeps canonical authoring surfaces)",
    lambda _match: replacement,
    text,
    count=1,
    flags=re.S,
)
if count != 1:
    raise RuntimeError(f'payload compatibility test: expected one match, found {count}')
path.write_text(text, encoding='utf-8')

# ModuleToolbar was a generic learning-navigation component, so its locked
# registration and architecture test must follow the canonical LearningToolbar
# filename rather than keeping a misleading exception alive.
for rel in [
    'docs/components/LOCKED_COMPONENTS.md',
    'tests/architecture/locked-component-registry.test.js',
    'CLAUDE.md',
    'docs/components/COMPONENT_REGISTRY.md',
]:
    p = ROOT / rel
    if not p.exists():
        continue
    value = p.read_text(encoding='utf-8')
    value = value.replace('ModuleToolbar.jsx', 'LearningToolbar.jsx')
    value = value.replace('ModuleToolbar', 'LearningToolbar')
    p.write_text(value, encoding='utf-8')

print('Final Phase 6 architecture contracts corrected')

from pathlib import Path
import re

ROOT = Path('.')

# Rewrite imports of the deleted root src/modules.js catalogue. Imports from
# src/data/modules.js are the valid parent-module catalogue and must remain.
for path in list((ROOT / 'src').rglob('*.js')) + list((ROOT / 'src').rglob('*.jsx')):
    text = path.read_text(encoding='utf-8')
    original = text

    # Static imports whose relative target is the old root modules.js file.
    pattern = re.compile(
        r"import\s*\{(?P<names>[^}]+)\}\s*from\s*['\"](?P<target>(?:\.\./)+modules\.js)['\"]"
    )
    had_legacy_catalogue_import = bool(pattern.search(text))

    def replace_import(match):
        names = match.group('names')
        names = re.sub(r'\bMODULES\b', 'CHAPTERS', names)
        names = names.replace('isModuleAvailable', 'isChapterAvailable')
        names = names.replace('getModuleAvailability', 'getChapterAvailability')
        names = names.replace('MODULE_AVAILABILITY', 'CHAPTER_AVAILABILITY')
        target = match.group('target').replace('modules.js', 'chapters.js')
        return f"import {{{names}}} from '{target}'"

    text = pattern.sub(replace_import, text)

    # A file importing the old root catalogue used MODULES to mean chapters.
    # Rename both the import specifier and every reference in that same file.
    if had_legacy_catalogue_import:
        text = re.sub(r'\bMODULES\b', 'CHAPTERS', text)
        text = text.replace('isModuleAvailable', 'isChapterAvailable')
        text = text.replace('getModuleAvailability', 'getChapterAvailability')
        text = text.replace('MODULE_AVAILABILITY', 'CHAPTER_AVAILABILITY')

    # Dynamic imports are uncommon in source but close the same escape hatch.
    text = re.sub(
        r"import\((['\"])((?:\.\./)+)modules\.js\1\)",
        lambda match: f"import({match.group(1)}{match.group(2)}chapters.js{match.group(1)})",
        text,
    )

    if text != original:
        path.write_text(text, encoding='utf-8')

# Strengthen the final architecture contract: any source import ending in the
# deleted root modules.js path is forbidden, while ./data/modules.js remains valid.
contract_path = ROOT / 'tests/architecture/legacy-content-imports.test.js'
contract = contract_path.read_text(encoding='utf-8')
anchor = """  it('does not expose legacy chapter APIs from production source', () => {
"""
addition = """  it('contains no import of the deleted root chapter catalogue', () => {
    const violations = filesUnder('src')
      .filter(path => /\.(js|jsx)$/.test(path))
      .filter(path => {
        const source = read(path)
        return /from\s+['\"](?:\.\.\/)+modules\.js['\"]/.test(source)
          || /import\(['\"](?:\.\.\/)+modules\.js['\"]\)/.test(source)
      })
    expect(violations).toEqual([])
  })

"""
if addition not in contract:
    if anchor not in contract:
        raise RuntimeError('legacy import contract anchor missing')
    contract = contract.replace(anchor, addition + anchor, 1)
contract_path.write_text(contract, encoding='utf-8')

# Fail during migration if any source import survived.
for path in list((ROOT / 'src').rglob('*.js')) + list((ROOT / 'src').rglob('*.jsx')):
    text = path.read_text(encoding='utf-8')
    if re.search(r"from\s+['\"](?:\.\./)+modules\.js['\"]", text):
        raise RuntimeError(f'deleted catalogue import survived in {path}')
    if re.search(r"import\(['\"](?:\.\./)+modules\.js['\"]\)", text):
        raise RuntimeError(f'deleted catalogue dynamic import survived in {path}')

print('Final production chapter catalogue imports migrated')

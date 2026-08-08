from pathlib import Path
import re

ROOT = Path('.')
INCLUDE_ROOTS = [
    Path('src'),
    Path('tests'),
    Path('docs/system'),
    Path('docs/components'),
    Path('docs/workflows'),
    Path('docs/canonical'),
    Path('docs/content'),
    Path('.claude/skills'),
]
INCLUDE_FILES = [Path('CLAUDE.md'), Path('COMPONENTS.md')]
EXTENSIONS = {'.js', '.jsx', '.mjs', '.md', '.sh', '.json'}
SKIP_PARTS = {'archive', 'superpowers', 'node_modules', 'dist', 'coverage'}
PATTERNS = {
    'legacy-runtime': re.compile(r'\bModulePlayer\b|\bmoduleNavigation\b'),
    'legacy-catalogue-path': re.compile(r'(?:src/)?modules\.js|from\s+[\'\"][^\'\"]*modules\.js[\'\"]'),
    'legacy-loader-map': re.compile(r'\bmoduleContentRegistry\b|\btagModuleMap\b'),
    'legacy-progress-api': re.compile(r'\bMODULE_GROUPS\b|\bgetModuleState\b|\bsaveModuleState\b|\bgetModulePct\b|\bgetContinueModule\b|\bgetInProgressModule\b'),
    'legacy-runtime-state': re.compile(r'\bactiveModule\b|\bopenModulePlayer\b|\bloadModuleContent\b|\bcompleteModule\b'),
    'ambiguous-module-id': re.compile(r'\bmoduleId\b|\bmoduleIds\b'),
    'ambiguous-module-data': re.compile(r'\bMODULES_BY_|\bBY_MODULE\b|\bMODULE_QUICKFIRE\b|\bmodule bank\b|\bmodule banks\b', re.I),
    'legacy-authoring': re.compile(r'\bmodule creation\b|\bmodule-creation\b|\bmodule builder\b|\bmodule-building\b', re.I),
}


def iter_files():
    seen = set()
    for root in INCLUDE_ROOTS:
        if not root.exists():
            continue
        for path in root.rglob('*'):
            if not path.is_file() or path.suffix not in EXTENSIONS:
                continue
            if any(part in SKIP_PARTS for part in path.parts):
                continue
            if path in seen:
                continue
            seen.add(path)
            yield path
    for path in INCLUDE_FILES:
        if path.exists() and path not in seen:
            yield path


rows = []
for path in sorted(iter_files()):
    try:
        lines = path.read_text(encoding='utf-8').splitlines()
    except UnicodeDecodeError:
        continue
    for number, line in enumerate(lines, 1):
        for category, pattern in PATTERNS.items():
            if pattern.search(line):
                rows.append((category, str(path), number, line.strip()))

report = Path('phase6-audit.txt')
with report.open('w', encoding='utf-8') as handle:
    handle.write('Phase 6 vocabulary audit\n')
    handle.write('=' * 80 + '\n')
    for category in PATTERNS:
        matches = [row for row in rows if row[0] == category]
        handle.write(f'\n[{category}] {len(matches)} matches\n')
        for _, path, number, line in matches:
            handle.write(f'{path}:{number}: {line}\n')

print(report.read_text(encoding='utf-8'))

from pathlib import Path

path = Path('.github/scripts/stage5c_finalize.py')
text = path.read_text()
old = '''replace_once(
    compatibility,
    "stage5Consumers: ['src/features/subjects/subjectNavigationAdapter.js'],",
    "stage5Consumers: ['src/features/subjects/Subjects.jsx'],",
)
'''
new = '''replace_once(
    compatibility,
    """  legacyModules: {
    stage5Consumers: ['src/features/subjects/subjectNavigationAdapter.js'],
""",
    """  legacyModules: {
    stage5Consumers: ['src/features/subjects/Subjects.jsx'],
""",
)
'''
count = text.count(old)
if count != 1:
    raise RuntimeError(f'expected one broad compatibility replacement, found {count}')
path.write_text(text.replace(old, new, 1))

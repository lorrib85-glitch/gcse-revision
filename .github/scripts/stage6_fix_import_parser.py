from pathlib import Path

path = Path('.github/scripts/stage6_retire_fix_tests.py')
text = path.read_text()
old = 'pattern = re.compile(r"import\\s*\\{([\\s\\S]*?)\\}\\s*from\\s*[\'\\\"]" + re.escape(old_source) + r"[\'\\\"]")'
new = 'pattern = re.compile(r"import\\s*\\{([^}]*)\\}\\s*from\\s*[\'\\\"]" + re.escape(old_source) + r"[\'\\\"]")'
if text.count(old) != 1:
    raise RuntimeError('expected one broad import parser')
path.write_text(text.replace(old, new, 1))

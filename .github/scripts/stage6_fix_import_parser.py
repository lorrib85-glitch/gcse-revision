from pathlib import Path

path = Path('.github/scripts/stage6_retire_fix_tests.py')
text = path.read_text()

old_parser = 'pattern = re.compile(r"import\\s*\\{([\\s\\S]*?)\\}\\s*from\\s*[\'\\\"]" + re.escape(old_source) + r"[\'\\\"]")'
new_parser = 'pattern = re.compile(r"import\\s*\\{([^}]*)\\}\\s*from\\s*[\'\\\"]" + re.escape(old_source) + r"[\'\\\"]")'
if text.count(old_parser) != 1:
    raise RuntimeError('expected one broad import parser')
text = text.replace(old_parser, new_parser, 1)

old_substitution = 'updated, count = re.subn(pattern, replacement, text, count=1, flags=flags)'
new_substitution = 'updated, count = re.subn(pattern, lambda _: replacement, text, count=1, flags=flags)'
if text.count(old_substitution) != 1:
    raise RuntimeError('expected one direct regex replacement')
text = text.replace(old_substitution, new_substitution, 1)

path.write_text(text)

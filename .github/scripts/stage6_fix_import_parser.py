from pathlib import Path

# Tighten the generic import parser used by the first end-state test migration.
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

# The first migration has already converted the Learning Graph import before
# the final contract script runs. Verify the semantic target regardless of
# whether the formatter kept the declaration on one line or several.
remaining = Path('.github/scripts/stage6_retire_fix_remaining.py')
source = remaining.read_text()
old = """graph = Path('tests/architecture/learning-graph.test.js')
replace_once(
    graph,
    \"import { CHAPTERS } from '../../src/chapters.js'\",
    \"import { CURRICULUM_CHAPTERS as CHAPTERS } from '../../src/data/learnerCurriculum.js'\",
)
"""
new = """graph = Path('tests/architecture/learning-graph.test.js')
graph_source = graph.read_text()
if 'learnerCurriculum.js' not in graph_source or 'CURRICULUM_CHAPTERS as CHAPTERS' not in graph_source:
    raise RuntimeError('learning-graph.test.js does not import canonical Chapters from learnerCurriculum.js')
"""
if source.count(old) != 1:
    raise RuntimeError('expected one Learning Graph import migration block')
remaining.write_text(source.replace(old, new, 1))

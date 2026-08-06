from pathlib import Path

path = Path('.github/scripts/stage6_retire_fix_remaining.py')
text = path.read_text()
old = """graph = Path('tests/architecture/learning-graph.test.js')
replace_once(
    graph,
    \"import { CHAPTERS } from '../../src/chapters.js'\",
    \"import { CURRICULUM_CHAPTERS as CHAPTERS } from '../../src/data/learnerCurriculum.js'\",
)
"""
new = """graph = Path('tests/architecture/learning-graph.test.js')
graph_source = graph.read_text()
legacy_import = \"import { CHAPTERS } from '../../src/chapters.js'\"
canonical_import = \"import { CURRICULUM_CHAPTERS as CHAPTERS } from '../../src/data/learnerCurriculum.js'\"
if legacy_import in graph_source:
    graph.write_text(graph_source.replace(legacy_import, canonical_import, 1))
elif canonical_import not in graph_source:
    raise RuntimeError('learning-graph.test.js has neither legacy nor canonical Chapter import')
"""
if text.count(old) != 1:
    raise RuntimeError('expected one Learning Graph import migration block')
path.write_text(text.replace(old, new, 1))

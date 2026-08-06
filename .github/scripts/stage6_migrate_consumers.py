from pathlib import Path
import json


def replace_once(path, old, new):
    path = Path(path)
    text = path.read_text()
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f'{path}: expected one occurrence, found {count}: {old!r}')
    path.write_text(text.replace(old, new, 1))


replace_once(
    'src/progress.js',
    "import { CHAPTERS, isChapterAvailable } from './chapters.js'\nimport { MODULES } from './data/modules.js'",
    "import { CURRICULUM_CHAPTERS as CHAPTERS, LEARNING_SEQUENCES as MODULES, isChapterAvailable } from './data/learnerCurriculum.js'",
)

replace_once(
    'src/app/chapterNavigation.js',
    "import { CHAPTERS, isChapterAvailable } from '../chapters.js'\nimport { MODULES } from '../data/modules.js'",
    "import { CURRICULUM_CHAPTERS as CHAPTERS, LEARNING_SEQUENCES as MODULES, isChapterAvailable } from '../data/learnerCurriculum.js'",
)

replace_once(
    'src/features/planner/dailyPlanner.js',
    "import { CHAPTERS, isChapterAvailable } from '../../chapters.js'\nimport { MODULES as PARENT_MODULES } from '../../data/modules.js'",
    "import { CURRICULUM_CHAPTERS as CHAPTERS, LEARNING_SEQUENCES as PARENT_MODULES, isChapterAvailable } from '../../data/learnerCurriculum.js'",
)

replace_once(
    'src/todaysPlan.js',
    "import { CHAPTERS } from './chapters.js'",
    "import { CURRICULUM_CHAPTERS as CHAPTERS } from './data/learnerCurriculum.js'",
)

replace_once(
    'src/features/progress/Progress.jsx',
    "import { CHAPTERS, isChapterAvailable } from '../../chapters.js'",
    "import { CURRICULUM_CHAPTERS as CHAPTERS, isChapterAvailable } from '../../data/learnerCurriculum.js'",
)

replace_once(
    'src/app/LegacyApp.jsx',
    "import { CHAPTER_CONTENT_LOADERS } from '../content/chapterContentRegistry.js'",
    "import { CHAPTER_CONTENT_LOADERS, CURRICULUM_CHAPTERS as CHAPTERS } from '../data/learnerCurriculum.js'",
)
replace_once(
    'src/app/LegacyApp.jsx',
    "import { CHAPTERS } from '../chapters.js'\n",
    "",
)

replace_once(
    'src/components/layout/ChapterPlayer.jsx',
    "import { MODULES } from '../../data/modules.js'",
    "import { LEARNING_SEQUENCES as MODULES } from '../../data/learnerCurriculum.js'",
)

replace_once(
    'src/components/layout/ChapterCompleteScreen.jsx',
    "import { CHAPTERS } from '../../chapters.js'",
    "import { CURRICULUM_CHAPTERS as CHAPTERS } from '../../data/learnerCurriculum.js'",
)

replace_once(
    'src/features/subjects/subjectNavigationAdapter.js',
    "import { CHAPTERS } from '../../chapters.js'",
    "import { CURRICULUM_CHAPTERS as CHAPTERS } from '../../data/learnerCurriculum.js'",
)

replace_once(
    'src/data/chapterProgress.js',
    "  mod2: 'history-medicine-renaissance-medicine',",
    "  mod2: 'history-medicine-vesalius-beginning-doubt',\n  'history-medicine-renaissance-medicine': 'history-medicine-vesalius-beginning-doubt',",
)

package_path = Path('package.json')
package = json.loads(package_path.read_text())
scripts = package['scripts']
ordered = {}
for key, value in scripts.items():
    ordered[key] = value
    if key == 'curriculum:navigation:check':
        ordered['curriculum:runtime:generate'] = 'node scripts/generate-learner-curriculum.mjs'
        ordered['curriculum:runtime:check'] = 'node scripts/generate-learner-curriculum.mjs --check'
ordered['verify'] = ordered['verify'].replace(
    'pnpm curriculum:navigation:check && pnpm test:architecture',
    'pnpm curriculum:navigation:check && pnpm curriculum:runtime:check && pnpm test:architecture',
)
package['scripts'] = ordered
package_path.write_text(json.dumps(package, indent=2) + '\n')

# Update the current authoring boundary description without removing the legacy
# compatibility documentation until the second guarded cut.
replace_once(
    'CLAUDE.md',
    "| `src/curriculum-catalogue/records/` | **The curriculum authority.** Board, subject, specification, study-pathway, module and chapter records. Build-time only — production source never imports it; the generated projections are the runtime's side of the boundary. See `docs/system/CURRICULUM_CATALOGUE.md`. |",
    "| `src/curriculum-catalogue/records/` | **The curriculum authority.** Board, subject, specification, study-pathway, module and chapter records. Build-time only — production source never imports it; generated projections are the runtime side of the boundary. See `docs/system/CURRICULUM_CATALOGUE.md`. |\n| `src/curriculum-catalogue/runtime/learningSequences.js` | **Learner-flow configuration, not curriculum.** Semantic Learning Sequences reference canonical Modules and own only continuation, numbering scope and planner order. Every available Chapter must resolve through exactly one sequence. |\n| `src/data/learnerCurriculum.js` | **Canonical learner runtime boundary.** Progress, planning, ChapterPlayer, completion and content loading import this file. It re-exports the generated canonical Module, Chapter, Learning Sequence and loader query model. |",
)

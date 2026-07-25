from pathlib import Path
import re


def replace_once(text: str, old: str, new: str, label: str) -> str:
    if old not in text:
        raise SystemExit(f'Missing expected marker for {label}')
    return text.replace(old, new, 1)


# 1. Route live flashcard blocks through the extracted standalone component.
module_path = Path('src/components/layout/ModulePlayer.jsx')
module_text = module_path.read_text(encoding='utf-8')

if "import FlashcardsBlock from '../learning/FlashcardsBlock.jsx'" not in module_text:
    module_text = replace_once(
        module_text,
        "import AcronymMemorise from '../learning/AcronymMemorise.jsx'\n",
        "import AcronymMemorise from '../learning/AcronymMemorise.jsx'\nimport FlashcardsBlock from '../learning/FlashcardsBlock.jsx'\n",
        'ModulePlayer FlashcardsBlock import',
    )

inline_pattern = re.compile(
    r"\nfunction FlashcardsBlock\(\{ block \}\) \{.*?\n\}\n\n(?=// ─── HotspotBlock)",
    re.S,
)
module_text, removed = inline_pattern.subn('\n', module_text, count=1)
if removed == 0 and 'function FlashcardsBlock({ block })' in module_text:
    raise SystemExit('Could not remove inline FlashcardsBlock implementation')

module_path.write_text(module_text, encoding='utf-8')


# 2. Add a realistic Component Lab fixture.
fixtures_path = Path('src/dev/componentReview/fixtures.base.js')
fixtures_text = fixtures_path.read_text(encoding='utf-8')

flashcards_fixture = r'''// FlashcardsBlock (History) — independent prompt/answer cards from the surgery topic.
// The component is deliberately unscored: tapping reveals an answer but does not
// prove the learner recalled it before opening the card.
export const flashcardsBlock = {
  cards: [
    {
      id: 'ether',
      front: 'Ether',
      back: 'Publicly demonstrated as a surgical anaesthetic in 1846. It worked, but was flammable and often caused nausea.',
    },
    {
      id: 'chloroform',
      front: 'Chloroform',
      back: 'Introduced by James Simpson in 1847. It acted quickly, but an uncontrolled dose could be fatal.',
    },
    {
      id: 'john-snow',
      front: 'John Snow',
      back: 'Designed an inhaler that controlled the dose of chloroform, making anaesthesia safer and more trusted.',
    },
    {
      id: 'joseph-lister',
      front: 'Joseph Lister',
      back: 'Applied germ theory to surgery by using carbolic acid to reduce infection in wounds, tools and theatres.',
    },
  ],
}'''

if 'export const flashcardsBlock =' not in fixtures_text:
    fixture_marker = '// BuilderBlock (Biology) — tap-to-fill equation builder with distractor pieces.'
    fixtures_text = replace_once(
        fixtures_text,
        fixture_marker,
        f'{flashcards_fixture}\n\n{fixture_marker}',
        'FlashcardsBlock fixture',
    )

fixtures_path.write_text(fixtures_text, encoding='utf-8')


# 3. Register the extracted component in the Component Review Lab.
manifest_path = Path('src/dev/componentReview/reviewManifestCore.jsx')
manifest_text = manifest_path.read_text(encoding='utf-8')

if "import FlashcardsBlock from '../../components/learning/FlashcardsBlock.jsx'" not in manifest_text:
    manifest_text = replace_once(
        manifest_text,
        "import AcronymMemorise from '../../components/learning/AcronymMemorise.jsx'\n",
        "import AcronymMemorise from '../../components/learning/AcronymMemorise.jsx'\nimport FlashcardsBlock from '../../components/learning/FlashcardsBlock.jsx'\n",
        'review manifest FlashcardsBlock import',
    )

flashcards_entry = r'''  {
    id: 'flashcards-block', name: 'FlashcardsBlock', contentType: 'flashcards',
    status: 'comparison', subject: 'History', renderMode: 'inline',
    function: 'Two-column tap-to-reveal prompt and answer cards for a small set of independent facts. Reveal-only: the component does not score recall or log weakness evidence.',
    usage: 'Used across Medicine episodes 4, 7, 8 and 13, block type: flashcards. Extracted from ModulePlayer into a standalone component so the live pattern can be reviewed and refined in the Component Lab.',
    alternative: 'AcronymMemorise for one mnemonic set; QuickRecallScreen for objectively marked retrieval; MatchingTask when the learner must connect paired items.',
    render: (fx) => <FlashcardsBlock block={fx} />,
    fixture: FIX.flashcardsBlock,
  },
'''

if "id: 'flashcards-block'" not in manifest_text:
    entry_marker = "  {\n    id: 'builder-block', name: 'BuilderBlock — reaction'"
    manifest_text = replace_once(
        manifest_text,
        entry_marker,
        f'{flashcards_entry}{entry_marker}',
        'FlashcardsBlock review entry',
    )

manifest_path.write_text(manifest_text, encoding='utf-8')

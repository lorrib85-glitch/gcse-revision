from pathlib import Path
import re

path = Path('docs/components/COMPONENT_REGISTRY.md')
text = path.read_text(encoding='utf-8')

text = text.replace('**Last updated:** 2026-07-24', '**Last updated:** 2026-07-25', 1)

acronym_section = r'''### AcronymMemorise

**File:** `src/components/learning/AcronymMemorise.jsx`
**What it is:** An interactive mnemonic component that introduces an acronym, lets the learner reveal what each letter represents and then switches into an unscored self-test mode in which the answers are hidden again. The learner is prompted to say each meaning before tapping to check it.
**Best used for:** Learning a short, stable set of related ideas that can be encoded naturally through their initial letters.
**Props:** `block`, `subject`
**Block shape:** `{ type: 'acronymMemorise', intro?, memoryTarget?, instruction?, showIntro?, readyText?, testInstruction?, testPrompt?, testCompleteText?, testCtaLabel?, learnCtaLabel?, testRowPrompt?, subject?, items: [{ id?, letter, word, detail }] }`
**Dependencies:** `GENERAL`, `SPACING`, `SUBJECTS`, `TYPE`, `ScreenIntro`

- **Decision**
  - **Use when:** a short set of related terms can be represented by a memorable acronym without distorting the subject knowledge. Choose it when recalling the initial letters genuinely helps the learner reconstruct the complete set.
  - **Do not use when:** the words have been awkwardly rewritten merely to force an acronym, the order has no stable meaning or each item requires substantial explanation. Do not use it for causal chains, chronological stages, independent question-and-answer pairs or every list the learner encounters.
  - **Choose instead:** use `MemoryHook` when one concept needs one analogy or association rather than a multi-letter mnemonic. Use `TimelineChain` or `OrderedRouteTask` when the sequence itself matters. Use `QuickRecallScreen` when recall should be objectively marked and recorded. Use `MatchingTask` when the learner must connect independent terms with corresponding meanings.
  - **Content shape:** normally three to seven letters forming a pronounceable, familiar or otherwise memorable acronym. Every letter must map clearly to one concise word or phrase, followed by a short explanation of why that item matters. The displayed words must remain academically accurate rather than being stretched to fit the letters. The test mode should require recall before reveal, not simply invite repeated tapping.
  - **Rhythm role:** teaching, retrieval.

**Governance rule:** the self-test is useful retrieval practice, but it is not scored evidence of mastery. Opening every item only shows that the learner checked the answers; it does not prove that they recalled them correctly. Do not feed completion of `AcronymMemorise` into the weakness tracker as a correct result.'''

if '### AcronymMemorise\n' in text:
    raise SystemExit('AcronymMemorise already exists in the registry')

marker = '\n---\n\n\n### AngleExplore'
if marker not in text:
    raise SystemExit('Could not find AngleExplore insertion marker')
text = text.replace(marker, f'\n---\n\n\n{acronym_section}\n\n---\n\n\n### AngleExplore', 1)

memory_section = r'''### MemoryHook

**File:** `src/components/learning/MemoryHook.jsx`
**What it is:** A compact, passive memory aid embedded inside a normal teaching screen. It connects one difficult idea to one memorable analogy, mental image, word pattern or mnemonic so the learner has an easier way to retrieve it later. It does not own a full screen, ask a question or record progress.
**Best used for:** Giving the learner one memorable handle on an idea that is conceptually important but easy to confuse or forget.
**Props:** `block`, `subject`
**Block shape:** `{ type: 'memoryHook', label?, hook, image?, imageAlt? }`
**Dependencies:** `SUBJECTS`, `GENERAL`, `SPACING`, `COMPONENT_SIZE`, `RADII`, `TYPE`
**Block type:** `memoryHook` (routed in `ModulePlayer`)
**Contract:** `docs/system/component-contracts/memory-hook.md` (composition classification: content)

- **Decision**
  - **Use when:** one already-explained idea would be easier to remember through a concise analogy, mental image, word association or mnemonic. Choose it beside or immediately after the teaching it reinforces, when the learner should leave holding one memorable connection.
  - **Do not use when:** the text is merely important, needs visual emphasis or summarises the preceding screen. Do not use it as a generic callout box, key point, definition card or decorative aside. Do not use it to teach several facts, drill an acronym or assess whether the learner can remember the idea.
  - **Choose instead:** use `AcronymMemorise` when several items are deliberately encoded through their initial letters and should be explored and self-tested. Use `KeyPoint` for an essential conclusion that does not need a mnemonic. Use `Infographic` when a visual system or relationship must be understood together. Use `QuickRecallScreen` when the learner should actively retrieve and submit an answer.
  - **Content shape:** exactly one memorable hook, normally one or two concise sentences. The connection must be accurate, easy to picture and genuinely useful for retrieval. An optional square image may be supplied only when it strengthens the same memory connection. Avoid generic summaries, forced humour, multiple competing comparisons and images that are merely decorative.
  - **Rhythm role:** teaching.

**Governance rule:** use no more than one `MemoryHook` on a screen. A second hook competes with the first and makes neither memorable. `MemoryHook` is deliberately passive: it has no editing, persistence, reveal, assessment or progress behaviour.

### Memory and self-testing family rule

Choose according to the structure of the memory aid:

- one difficult idea anchored by an analogy or association → `MemoryHook`
- one related set encoded through initial letters → `AcronymMemorise`
- objectively marked recall → `QuickRecallScreen`
- one-to-one relationships that the learner must connect → `MatchingTask`

Memory aids must reduce cognitive load. Do not force every topic into a mnemonic or acronym merely to create variety. A memory component should follow sufficient teaching for the content to make sense; it cannot replace explanation, worked examples or application. The normal maximum of two uses of the same component per module still applies, and `MemoryHook` should appear no more than once on an individual screen.'''

pattern = r'(?ms)^### MemoryHook\n.*?(?=^---\n)'
text, count = re.subn(pattern, memory_section.rstrip() + '\n\n', text, count=1)
if count != 1:
    raise SystemExit(f'Expected one MemoryHook section, found {count}')

path.write_text(text, encoding='utf-8')

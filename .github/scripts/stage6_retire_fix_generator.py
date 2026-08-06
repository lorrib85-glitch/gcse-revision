from pathlib import Path
import re

path = Path('scripts/generate-curriculum-catalogue.mjs')
text = path.read_text()
text = text.replace("import { loadCompatibility } from '../src/curriculum-catalogue/compatibility/index.js'\n", '')

pattern = r"function renderMigration\(lines, catalogue\) \{[\s\S]*?\n\}\n\nexport function renderCurriculumMap"
replacement = """function renderMigration(lines, catalogue) {
  const chapterById = new Map(catalogue.chapters.map(chapter => [chapter.id, chapter]))
  lines.push('## Legacy and placeholder treatment')
  lines.push('')
  lines.push('### Placeholder cards that became chapters')
  lines.push('')
  lines.push('These were coming-soon cards synthesised by the browser. They are now planned')
  lines.push('canonical Chapter records with stable semantic ids. No progress alias exists because')
  lines.push('the old cards were never openable and therefore never stored learner progress.')
  lines.push('')
  lines.push('| Retired card | Canonical chapter | Title |')
  lines.push('|---|---|---|')
  for (const [from, to] of PLACEHOLDER_MIGRATION) {
    lines.push(`| \\`${from}\\` | \\`${to}\\` | ${escape(chapterById.get(to)?.title ?? '—')} |`)
  }
  lines.push('')
  lines.push('### Superseded Renaissance progress ids')
  lines.push('')
  lines.push('The former hidden bundle is no longer a Chapter or loader. Both historical ids map')
  lines.push('directly to the real canonical replacement, preserving old learner progress without')
  lines.push('keeping a compatibility-shaped curriculum row.')
  lines.push('')
  lines.push('- `mod2` → `history-medicine-vesalius-beginning-doubt`')
  lines.push('- `history-medicine-renaissance-medicine` → `history-medicine-vesalius-beginning-doubt`')
  lines.push('')
  lines.push('Every other historical Chapter id is preserved verbatim because it backs a live')
  lines.push('`gcse_chapter_<id>` progress key. A tidier id is not worth a learner’s progress.')
  lines.push('')
}

export function renderCurriculumMap"""
text, count = re.subn(pattern, replacement, text, count=1)
if count != 1:
    raise RuntimeError(f'expected one renderMigration block, found {count}')

text = text.replace('  const bound = boundChapters + 1\n', '')
text = text.replace(
    "  lines.push(`**${bound}** content bindings — ${boundChapters} on chapters plus the one `\n    + 'compatibility binding, which is every entry in the runtime loader registry.')",
    "  lines.push(`**${boundChapters}** canonical content bindings — one generated loader for every chapter with a contentPath.`)",
)
text = text.replace(
    "  lines.push('**No runtime projection exists yet.** This document and the specification catalogue')\n  lines.push('are build-time documentation. `MODULES`, `CHAPTERS` and `CHAPTER_CONTENT_LOADERS`')\n  lines.push('remain hand-authored and untouched.')",
    "  lines.push('The canonical learner runtime is generated separately from these records plus')\n  lines.push('Learning Sequence configuration and derived Chapter screen metadata.')",
)
text = text.replace(
    "  lines.push('- **Runtime `MODULES`, `CHAPTERS` and content loaders** — Stage 3 projections.')\n  lines.push('  The runtime files remain hand-authored and untouched until then.')",
    "  lines.push('- **Learner runtime sequences, Chapters and content loaders** — `LEARNER_CURRICULUM_MAP.md`,')\n  lines.push('  generated from these records plus explicit Learning Sequence configuration.')",
)
path.write_text(text)

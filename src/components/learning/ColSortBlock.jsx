import ColSortBlockCore from './ColSortBlockCore.jsx'
import { SUBJECTS } from '../../constants/subjects.js'

const FOCUS_CSS = `
  .colsort-focus section {
    padding-bottom: 48px !important;
  }

  .colsort-focus section > div:last-child {
    display: flex;
    flex-direction: column;
  }

  .colsort-focus .csb-heading {
    order: 1;
    margin-bottom: 14px !important;
  }

  /* The thinking cue belongs before the choices, where it can guide the sort. */
  .colsort-focus .csb-card-stage {
    display: contents;
  }

  .colsort-focus .csb-card-stage > div:last-child:has(svg) {
    order: 2;
    margin: 0 0 14px !important;
    padding: 8px 2px 8px 12px !important;
    border: 0 !important;
    border-left: 2px solid color-mix(in srgb, var(--colsort-accent) 48%, transparent) !important;
    border-radius: 0 !important;
    background: linear-gradient(90deg, color-mix(in srgb, var(--colsort-accent) 6%, transparent), transparent 72%) !important;
    box-shadow: none !important;
  }

  .colsort-focus .csb-card-stage > div:last-child:has(svg) svg {
    opacity: 0.72;
  }

  .colsort-focus .csb-trays {
    order: 3;
    margin-bottom: 12px !important;
  }

  /* Trays are destinations, not the primary content. Keep them calm until targeted. */
  .colsort-focus .csb-tray {
    border-color: color-mix(in srgb, var(--colsort-frame) 36%, transparent) !important;
    background: linear-gradient(180deg, rgba(255,255,255,0.014), rgba(8,9,13,0.66)) !important;
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.025) !important;
    opacity: 0.86;
  }

  .colsort-focus .csb-tray > div:first-child {
    opacity: 0.82;
    transition: opacity 180ms ease;
  }

  .colsort-focus .csb-tray[style*='translateY(-3px)'] {
    border-color: color-mix(in srgb, var(--colsort-accent) 82%, transparent) !important;
    background: linear-gradient(180deg, color-mix(in srgb, var(--colsort-accent) 12%, transparent), rgba(8,9,13,0.80)) !important;
    box-shadow: 0 0 0 1px color-mix(in srgb, var(--colsort-accent) 18%, transparent), 0 0 22px color-mix(in srgb, var(--colsort-accent) 18%, transparent), inset 0 1px 0 rgba(255,255,255,0.06) !important;
    opacity: 1 !important;
  }

  .colsort-focus .csb-tray[style*='translateY(-3px)'] > div:first-child {
    opacity: 1;
  }

  /* The statement being handled is the visual focus of the interaction. */
  .colsort-focus .csb-current-card {
    order: 4;
    border-color: color-mix(in srgb, var(--colsort-accent) 82%, transparent) !important;
    background:
      radial-gradient(circle at 12% 50%, color-mix(in srgb, var(--colsort-accent) 11%, transparent), transparent 34%),
      linear-gradient(180deg, rgba(26,25,27,0.99), rgba(9,9,12,1)) !important;
    box-shadow:
      0 0 0 1px color-mix(in srgb, var(--colsort-accent) 18%, transparent),
      0 0 28px color-mix(in srgb, var(--colsort-accent) 24%, transparent),
      0 16px 38px rgba(0,0,0,0.48),
      inset 0 1px 0 rgba(255,255,255,0.075) !important;
  }

  .colsort-focus .csb-current-card:active {
    border-color: var(--colsort-accent) !important;
    box-shadow:
      0 0 0 1px color-mix(in srgb, var(--colsort-accent) 34%, transparent),
      0 0 38px color-mix(in srgb, var(--colsort-accent) 34%, transparent),
      0 20px 42px rgba(0,0,0,0.52),
      inset 0 1px 0 rgba(255,255,255,0.09) !important;
  }

  .colsort-focus .csb-current-card + div {
    order: 5;
  }

  .colsort-focus .csb-current-card + div + div {
    order: 6;
  }

  .colsort-focus .csb-completion {
    order: 4;
  }

  /* Keep local progress visible but quiet, centred beneath the whole task. */
  .colsort-focus .csb-progress {
    position: absolute !important;
    left: 50% !important;
    bottom: 8px !important;
    width: 132px !important;
    margin: 0 !important;
    transform: translateX(-50%) !important;
    animation: none !important;
    opacity: 0.76;
    z-index: 2;
  }

  @media (prefers-reduced-motion: reduce) {
    .colsort-focus .csb-tray > div:first-child {
      transition: none !important;
    }
  }
`

function firstLine(value) {
  return String(value ?? '').split('\n')[0].trim().toLowerCase()
}

function inferEvidenceIcon(label) {
  const text = String(label || '').toLowerCase()
  if (/observ|saw|evidence|challenge/.test(text)) return 'observation'
  if (/print|book|diagram|teach|authority/.test(text)) return 'book'
  if (/anatom|body|dissect/.test(text)) return 'anatomy'
  if (/humour|balance/.test(text)) return 'humours'
  if (/treat|bloodlett|purg|cure/.test(text)) return 'treatment'
  return undefined
}

export default function ColSortBlock({ block, ...props }) {
  const subject = props.subject || 'Biology'
  const theme = SUBJECTS[subject] || SUBJECTS.Biology
  const columnNames = (block.columns || []).map(column => firstLine(column.label))
  const changeContinuity = columnNames.includes('changed') && columnNames.includes('continued')
  const itemText = (block.items || []).map(item => item.label).join(' ').toLowerCase()
  const vesaliusContext = subject === 'History'
    && changeContinuity
    && /anatom|ancient books|four humours|galen/.test(itemText)
  const treatmentInsight = /treatment.*(?:slow|much more slowly)/i.test(block.explanation || '')

  // Older ColSort content predates the richer data shape. These defaults keep it
  // cinematic while explicit content props always remain the source of truth.
  const columns = (block.columns || []).map(column => {
    const name = firstLine(column.label)
    if (column.description || !changeContinuity) return column

    if (name === 'changed') {
      return {
        ...column,
        icon: column.icon || 'change',
        description: vesaliusContext
          ? 'Ideas and practices that became different after Vesalius.'
          : 'Ideas and practices that became different.',
      }
    }

    if (name === 'continued') {
      return {
        ...column,
        icon: column.icon || 'continuity',
        description: vesaliusContext
          ? 'Ideas and practices that stayed largely the same after Vesalius.'
          : 'Ideas and practices that stayed largely the same.',
      }
    }

    return column
  })

  const items = (block.items || []).map(item => ({
    ...item,
    icon: item.icon || inferEvidenceIcon(item.label),
  }))

  const resolvedBlock = {
    ...block,
    columns,
    items,
    title: block.title
      || block.question
      || (vesaliusContext
        ? 'What changed after Vesalius?'
        : changeContinuity
          ? 'What changed — and what continued?'
          : 'Sort the evidence'),
    subtitle: block.subtitle
      || block.instruction
      || (changeContinuity
        ? 'Sort each piece of evidence into change or continuity.'
        : 'Sort each statement into the right group.'),
    backgroundImage: block.backgroundImage
      || (vesaliusContext ? '/headers/history-medicine-renaissance.png' : undefined),
    backgroundOpacity: block.backgroundOpacity ?? (vesaliusContext ? 0.1 : undefined),
    thinkingPrompt: block.thinkingPrompt
      || (vesaliusContext
        ? 'Think about what changed in how doctors learned about the body — and what stayed the same.'
        : undefined),
    thinkingPromptMode: block.thinkingPromptMode || (vesaliusContext ? 'always' : 'afterIncorrect'),
    conclusionTitle: block.conclusionTitle
      || (treatmentInsight ? 'Knowledge changed faster than treatment.' : 'Pattern complete'),
  }

  return (
    <div
      className="colsort-focus"
      style={{
        '--colsort-accent': theme.accent,
        '--colsort-frame': theme.accentSecondary || theme.accent,
      }}
    >
      <style>{FOCUS_CSS}</style>
      <ColSortBlockCore block={resolvedBlock} {...props} />
    </div>
  )
}

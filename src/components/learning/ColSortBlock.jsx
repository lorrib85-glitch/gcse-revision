import ColSortBlockCore from './ColSortBlockCore.jsx'

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

  return <ColSortBlockCore block={resolvedBlock} {...props} />
}

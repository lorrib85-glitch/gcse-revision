import ColSortBlockCore from './ColSortBlockCore.jsx'

function firstLine(value) {
  return String(value ?? '').split('\n')[0].trim().toLowerCase()
}

export default function ColSortBlock({ block, ...props }) {
  const columnNames = (block.columns || []).map(column => firstLine(column.label))
  const changeContinuity = columnNames.includes('changed') && columnNames.includes('continued')
  const treatmentInsight = /treatment.*(?:slow|much more slowly)/i.test(block.explanation || '')

  const resolvedBlock = {
    ...block,
    title: block.title
      || block.question
      || (changeContinuity ? 'What changed — and what continued?' : 'Sort the evidence'),
    subtitle: block.subtitle
      || block.instruction
      || (changeContinuity
        ? 'Sort each statement into change or continuity.'
        : 'Sort each statement into the right group.'),
    conclusionTitle: block.conclusionTitle
      || (treatmentInsight ? 'Knowledge changed faster than treatment.' : 'Pattern complete'),
  }

  return <ColSortBlockCore block={resolvedBlock} {...props} />
}

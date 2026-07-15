const DEFAULT_TIMINGS = {
  read: '900ms',
  travel: '850ms',
  settle: '320ms',
}

function ms(value, fallback = 0) {
  if (typeof value === 'number') return value
  if (typeof value !== 'string') return fallback
  if (value.endsWith('ms')) return Number.parseFloat(value)
  if (value.endsWith('s')) return Number.parseFloat(value) * 1000
  return Number.parseFloat(value) || fallback
}

export function getOppositeRevealDurations(timings = {}) {
  const merged = { ...DEFAULT_TIMINGS, ...timings }
  const read = ms(merged.read)
  const travel = ms(merged.travel)
  const settle = ms(merged.settle)
  return { read, travel, settle, nextDelay: read + travel + settle }
}

export function buildOppositeRevealSequence(block = {}) {
  const concepts = {
    left: block.leftConcept || {},
    right: block.rightConcept || {},
  }
  const configured = Array.isArray(block.sequence) && block.sequence.length > 0
    ? block.sequence
    : [
        ...(concepts.left.items || []).map(item => ({ item, side: 'left' })),
        ...(concepts.right.items || []).map(item => ({ item, side: 'right' })),
      ]

  return configured
    .filter(step => step && (step.side === 'left' || step.side === 'right') && step.item)
    .map((step, index) => ({
      id: step.id || `${step.side}-${index}-${step.item}`,
      item: step.item,
      side: step.side,
      direction: step.side,
      conceptLabel: concepts[step.side]?.label || '',
      icon: step.icon || concepts[step.side]?.icon || null,
    }))
}

export function deriveOppositeRevealState(block = {}, options = {}) {
  const sequence = buildOppositeRevealSequence(block)
  if (options.reducedMotion) {
    return {
      sequence,
      active: null,
      leftItems: sequence.filter(step => step.side === 'left').map(step => step.item),
      rightItems: sequence.filter(step => step.side === 'right').map(step => step.item),
      complete: true,
      progress: sequence.length,
    }
  }

  const settledCount = Math.max(0, Math.min(options.settledCount || 0, sequence.length))
  const activeIndex = options.activeIndex ?? settledCount
  const active = activeIndex >= 0 && activeIndex < sequence.length ? sequence[activeIndex] : null
  const settled = sequence.slice(0, settledCount)

  return {
    sequence,
    active,
    leftItems: settled.filter(step => step.side === 'left').map(step => step.item),
    rightItems: settled.filter(step => step.side === 'right').map(step => step.item),
    complete: settledCount >= sequence.length,
    progress: settledCount,
  }
}

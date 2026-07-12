// ─── TheoryCompare "people" variant — pure reveal logic ───────────────────
// Extracted from TheoryCompareBlock so the progressive-reveal ordering can be
// unit-tested in the node project without a DOM (mirrors the pattern of
// partitionRecallConcepts.js). The component owns only the pixels; this file
// owns the sequence.
//
// The "people" variant teaches a comparison between two named people through
// deliberate progressive reveal: one comparison theme at a time, and — where a
// theme lists several paired examples (`rows`) — one example row at a time,
// then an optional summary note, and finally a single closing takeaway.

/** True when a theoryCompare block should render as the person-to-person variant. */
export function isPeopleVariant(block) {
  return !!block && block.variant === 'people'
}

/** A comparison with a non-empty `rows` array reveals its examples one at a time. */
function hasRows(comparison) {
  return Array.isArray(comparison?.rows) && comparison.rows.length > 0
}

/**
 * Flatten the comparisons (plus an optional closing takeaway) into an ordered
 * list of reveal steps. Each Continue press advances the learner by exactly one
 * step, so every step reveals a meaningful new piece of the comparison.
 *
 * Step kinds:
 *   'comparison' — a comparison theme becomes visible. For a rows-comparison
 *                  this also reveals the first example row (rowIndex 0).
 *   'row'        — one further example row within a rows-comparison.
 *   'note'       — the optional summary note beneath a rows-comparison.
 *   'takeaway'   — the single closing historical takeaway.
 */
export function buildPeopleSteps(block) {
  const comparisons = Array.isArray(block?.comparisons) ? block.comparisons : []
  const steps = []

  comparisons.forEach((comparison, ci) => {
    if (hasRows(comparison)) {
      steps.push({ type: 'comparison', comparisonIndex: ci, rowIndex: 0 })
      for (let r = 1; r < comparison.rows.length; r++) {
        steps.push({ type: 'row', comparisonIndex: ci, rowIndex: r })
      }
      if (comparison.note) steps.push({ type: 'note', comparisonIndex: ci })
    } else {
      steps.push({ type: 'comparison', comparisonIndex: ci })
    }
  })

  if (block?.takeaway) steps.push({ type: 'takeaway' })

  return steps
}

/**
 * Given the flat step list and how many steps have been revealed, derive the
 * per-comparison visible state the component renders. Pure — no DOM, no state.
 *
 * @returns {{
 *   comparisons: { index:number, visible:boolean, visibleRows:number, noteVisible:boolean }[],
 *   takeawayVisible: boolean,
 *   complete: boolean,
 * }}
 */
export function deriveVisibleState(block, steps, revealedCount) {
  const comparisons = Array.isArray(block?.comparisons) ? block.comparisons : []
  const count = Math.max(0, Math.min(revealedCount, steps.length))
  const shown = steps.slice(0, count)

  const perComparison = comparisons.map((comparison, ci) => {
    const visible = shown.some(s => s.comparisonIndex === ci && s.type === 'comparison')
    // A rows-comparison reveals row 0 with its 'comparison' step and one more
    // row per 'row' step, so the count of comparison+row steps is the number
    // of example rows currently visible.
    const visibleRows = hasRows(comparison)
      ? shown.filter(s => s.comparisonIndex === ci && (s.type === 'comparison' || s.type === 'row')).length
      : 0
    const noteVisible = shown.some(s => s.comparisonIndex === ci && s.type === 'note')
    return { index: ci, visible, visibleRows, noteVisible }
  })

  return {
    comparisons: perComparison,
    takeawayVisible: shown.some(s => s.type === 'takeaway'),
    complete: count >= steps.length,
  }
}

/**
 * How many comparison themes have been at least partially revealed — used for
 * the thin bronze reveal-progress rail (progress, never a large number score).
 */
export function revealedComparisonCount(block, steps, revealedCount) {
  const { comparisons } = deriveVisibleState(block, steps, revealedCount)
  return comparisons.filter(c => c.visible).length
}

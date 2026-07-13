// ─── TheoryCompare "people" variant — pure reveal logic ───────────────────
// Extracted from TheoryCompareBlock so the progressive-reveal ordering can be
// unit-tested in the node project without a DOM. The component owns the pixels;
// this file owns the sequence.
//
// The comparison builds on one page. Each Continue press adds one complete
// comparison theme beneath the content already revealed. A theme's paired rows,
// note and explanation arrive together so the learner keeps the whole idea in
// working memory rather than stepping through fragments of it.

/** True when a theoryCompare block should render as the person-to-person variant. */
export function isPeopleVariant(block) {
  return !!block && block.variant === 'people'
}

function hasRows(comparison) {
  return Array.isArray(comparison?.rows) && comparison.rows.length > 0
}

/**
 * One reveal step per comparison theme. The closing takeaway is not a separate
 * step: it appears with the final theme, then the screen-level Continue action
 * becomes available at the base of the completed comparison.
 */
export function buildPeopleSteps(block) {
  const comparisons = Array.isArray(block?.comparisons) ? block.comparisons : []
  return comparisons.map((_, comparisonIndex) => ({
    type: 'comparison',
    comparisonIndex,
  }))
}

/**
 * Given the comparison steps and how many have been revealed, derive the state
 * rendered by the component.
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
  const shownComparisonIndexes = new Set(
    steps.slice(0, count).map(step => step.comparisonIndex),
  )

  const perComparison = comparisons.map((comparison, index) => {
    const visible = shownComparisonIndexes.has(index)
    return {
      index,
      visible,
      visibleRows: visible && hasRows(comparison) ? comparison.rows.length : 0,
      noteVisible: visible && !!comparison.note,
    }
  })

  const complete = comparisons.length === 0 || count >= comparisons.length

  return {
    comparisons: perComparison,
    takeawayVisible: complete && !!block?.takeaway,
    complete,
  }
}

/** How many complete comparison themes are currently visible. */
export function revealedComparisonCount(block, steps, revealedCount) {
  const { comparisons } = deriveVisibleState(block, steps, revealedCount)
  return comparisons.filter(comparison => comparison.visible).length
}

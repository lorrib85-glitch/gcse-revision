// ─── TheoryCompare — pure reveal logic ────────────────────────────────────
// Extracted from TheoryCompare so the progressive-reveal ordering can be
// unit-tested in the node project without a DOM. The component owns the pixels;
// this file owns the sequence.
//
// Each Continue press replaces the current comparison theme with the next one.
// The hero, side labels and shared progress marker remain stable, while one
// complete idea occupies the learning area at a time. A theme's paired rows,
// note and explanation arrive together so the learner keeps the whole idea in
// working memory without creating an endlessly long page.

function hasRows(comparison) {
  return Array.isArray(comparison?.rows) && comparison.rows.length > 0
}

/**
 * One reveal step per comparison theme. The closing takeaway is not a separate
 * step: it appears with the final theme, then the screen-level Continue action
 * becomes available at the base of the completed comparison.
 */
export function buildComparisonSteps(block) {
  const comparisons = Array.isArray(block?.comparisons) ? block.comparisons : []
  return comparisons.map((_, comparisonIndex) => ({
    type: 'comparison',
    comparisonIndex,
  }))
}

/**
 * Given the comparison steps and how many have been reached, derive the state
 * rendered by the component. Only the current theme is visible; previous themes
 * are represented by the shared progress marker rather than remaining on page.
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
  const activeComparisonIndex = count > 0
    ? steps[count - 1]?.comparisonIndex ?? -1
    : -1

  const perComparison = comparisons.map((comparison, index) => {
    const visible = index === activeComparisonIndex
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

/** How many comparison themes the learner has reached — used by shared progress. */
export function revealedComparisonCount(block, steps, revealedCount) {
  const comparisons = Array.isArray(block?.comparisons) ? block.comparisons : []
  return Math.max(0, Math.min(revealedCount, steps.length, comparisons.length))
}

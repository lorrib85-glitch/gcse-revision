import ColSortBlockCore from './ColSortBlockCore.jsx'

const POLISH_CSS = `
  .colsort-polish header {
    margin-bottom: 18px !important;
  }

  .colsort-polish header + div {
    margin-bottom: 10px !important;
  }

  .colsort-polish .csb-tray {
    min-height: 138px !important;
  }

  .colsort-polish .csb-tray > div:first-child > span:last-child {
    font-size: 0.92em !important;
    line-height: 1.12 !important;
  }

  .colsort-polish .csb-tray:not(:has(.csb-sorted-tile)) > div:last-child {
    min-height: 54px !important;
    padding: 5px 2px !important;
    border: 0 !important;
    border-radius: 0 !important;
    background: transparent !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 6px !important;
    color: rgba(245,238,225,0.50) !important;
  }

  .colsort-polish .csb-tray:not(:has(.csb-sorted-tile)) > div:last-child::before {
    content: '↓';
    display: block;
    font-size: 14px;
    line-height: 1;
    color: rgba(245,238,225,0.28);
    transition: color 180ms ease, transform 180ms ease;
  }

  .colsort-polish .csb-tray[style*='translateY(-3px)']:not(:has(.csb-sorted-tile)) > div:last-child::before {
    color: currentColor;
    transform: translateY(2px);
  }

  .colsort-polish .csb-current-card {
    isolation: isolate;
  }

  .colsort-polish .csb-current-card::before,
  .colsort-polish .csb-current-card::after {
    content: '';
    position: absolute;
    pointer-events: none;
    border-radius: inherit;
    border: 1px solid rgba(255,255,255,0.08);
    background: rgba(12,12,15,0.88);
    transition: opacity 160ms ease, transform 160ms ease;
  }

  .colsort-polish .csb-current-card::before {
    z-index: -1;
    inset: 5px 7px -6px;
    opacity: 0.72;
  }

  .colsort-polish .csb-current-card::after {
    z-index: -2;
    inset: 10px 13px -11px;
    opacity: 0.42;
  }

  .colsort-polish .csb-current-card:active::before,
  .colsort-polish .csb-current-card:active::after {
    opacity: 0;
    transform: translateY(-3px);
  }

  .colsort-polish .csb-current-card > span[aria-hidden='true'] {
    width: 16px !important;
    height: 22px !important;
    display: block !important;
    background-image: radial-gradient(circle, currentColor 1.35px, transparent 1.55px) !important;
    background-size: 8px 7px !important;
    background-position: 0 0 !important;
    color: rgba(245,238,225,0.38) !important;
  }

  .colsort-polish .csb-current-card > span[aria-hidden='true'] > span {
    display: none !important;
  }

  .colsort-polish .csb-current-card + div {
    color: rgba(245,238,225,0.52) !important;
    font-weight: 500 !important;
    letter-spacing: 0 !important;
  }

  .colsort-polish:has(.csb-current-card:active) .csb-tray {
    opacity: 0.52 !important;
  }

  .colsort-polish:has(.csb-current-card:active) .csb-tray[style*='translateY(-3px)'] {
    opacity: 1 !important;
  }

  @media (prefers-reduced-motion: reduce) {
    .colsort-polish .csb-current-card::before,
    .colsort-polish .csb-current-card::after,
    .colsort-polish .csb-tray:not(:has(.csb-sorted-tile)) > div:last-child::before {
      transition: none !important;
    }
  }
`

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

  return (
    <div className="colsort-polish">
      <style>{POLISH_CSS}</style>
      <ColSortBlockCore block={resolvedBlock} {...props} />
    </div>
  )
}

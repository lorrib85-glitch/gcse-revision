import { useState } from 'react'
import ColSortBlockCore from './ColSortBlockCore.jsx'
import ContinueCTA from '../core/ContinueCTA.jsx'
import SequenceProgress from '../core/SequenceProgress.jsx'
import { SUBJECTS } from '../../constants/subjects.js'
import { TYPE } from '../../constants/typography.js'
import { GENERAL } from '../../constants/generalTheme.js'

const FOCUS_CSS = `
  .colsort-focus {
    position: relative;
  }

  .colsort-focus section {
    padding-top: 28px !important;
    padding-bottom: 82px !important;
  }

  .colsort-focus.is-sorted section {
    padding-bottom: 154px !important;
  }

  .colsort-focus section > div:last-child {
    display: flex;
    flex-direction: column;
  }

  .colsort-focus .csb-heading {
    order: 1;
    margin-bottom: 22px !important;
    animation: none !important;
    transform: none !important;
  }

  /* The thinking cue belongs before the choices, where it can guide the sort. */
  .colsort-focus .csb-card-stage {
    display: contents;
  }

  .colsort-focus .csb-card-stage > div:last-child:has(svg) {
    order: 2;
    margin: 0 0 20px !important;
    padding: 10px 4px 10px 14px !important;
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
    gap: 16px !important;
    margin-bottom: 20px !important;
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
    margin-top: 2px !important;
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
    margin-top: 13px !important;
  }

  .colsort-focus .csb-current-card + div + div {
    order: 6;
  }

  /* Completion is a learner-controlled transition, not another status panel. */
  .colsort-focus .csb-completion {
    display: none !important;
  }

  .colsort-sort-continue {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 48px;
    z-index: 4;
    animation: colsort-continue-in 280ms ease both;
  }

  /* Local sequence progress sits alone at the bottom of the task. */
  .colsort-focus .csb-progress {
    position: absolute !important;
    left: 50% !important;
    bottom: 12px !important;
    width: auto !important;
    margin: 0 !important;
    transform: translateX(-50%) !important;
    animation: none !important;
    opacity: 0.8;
    z-index: 2;
  }

  .colsort-focus .csb-progress > div {
    width: auto !important;
    justify-content: center !important;
    gap: 9px !important;
  }

  .colsort-focus .csb-progress > div > div {
    flex: 0 0 7px !important;
    width: 7px !important;
    max-width: 7px !important;
    height: 7px !important;
    border-radius: 999px !important;
  }

  .colsort-summary {
    position: relative;
    min-height: min(720px, calc(100dvh - 88px));
    overflow: hidden;
    margin: 10px 0 18px;
    padding: 42px 22px 86px;
    border-radius: 20px;
    background: var(--colsort-summary-bg);
    animation: colsort-summary-in 420ms cubic-bezier(.16,1,.3,1) both;
  }

  .colsort-summary::before {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    background-image:
      linear-gradient(180deg, rgba(4,5,8,0.26) 0%, rgba(4,5,8,0.60) 44%, rgba(4,5,8,0.96) 100%),
      var(--colsort-summary-image);
    background-size: cover;
    background-position: center top;
    opacity: var(--colsort-summary-image-opacity);
  }

  .colsort-summary::after {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    background:
      radial-gradient(circle at 18% 12%, color-mix(in srgb, var(--colsort-accent) 12%, transparent), transparent 38%),
      radial-gradient(ellipse at 50% 45%, transparent 32%, rgba(0,0,0,0.56) 100%);
  }

  .colsort-summary-content {
    position: relative;
    z-index: 1;
  }

  .colsort-summary-rule {
    width: 42px;
    height: 2px;
    margin: 0 0 22px;
    border-radius: 999px;
    background: var(--colsort-accent);
    box-shadow: 0 0 14px color-mix(in srgb, var(--colsort-accent) 34%, transparent);
  }

  .colsort-summary-contrast {
    display: grid;
    gap: 18px;
    margin-top: 34px;
  }

  .colsort-summary-point {
    position: relative;
    padding: 2px 0 2px 18px;
  }

  .colsort-summary-point::before {
    content: '';
    position: absolute;
    left: 0;
    top: 2px;
    bottom: 2px;
    width: 2px;
    background: color-mix(in srgb, var(--colsort-accent) 56%, transparent);
    box-shadow: 0 0 12px color-mix(in srgb, var(--colsort-accent) 20%, transparent);
  }

  .colsort-summary-continue {
    position: relative;
    z-index: 2;
    margin-top: 36px;
  }

  .colsort-summary-progress {
    position: absolute;
    left: 50%;
    bottom: 22px;
    z-index: 2;
    transform: translateX(-50%);
  }

  @keyframes colsort-continue-in {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes colsort-summary-in {
    from { opacity: 0; transform: translateY(18px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media (prefers-reduced-motion: reduce) {
    .colsort-focus .csb-tray > div:first-child {
      transition: none !important;
    }

    .colsort-sort-continue,
    .colsort-summary {
      animation: none !important;
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

function ColSortSummary({ block, theme, total, onContinue }) {
  const points = block.summaryPoints || []

  return (
    <section
      className="colsort-summary"
      aria-label={block.summaryTitle || 'What the sort revealed'}
      style={{
        '--colsort-accent': theme.accent,
        '--colsort-summary-bg': theme.background,
        '--colsort-summary-image': block.backgroundImage ? `url(${block.backgroundImage})` : 'none',
        '--colsort-summary-image-opacity': block.backgroundImage ? (block.summaryBackgroundOpacity ?? 0.34) : 0,
      }}
    >
      <div className="colsort-summary-content">
        <div className="colsort-summary-rule" aria-hidden="true" />

        <div style={{
          ...TYPE.label,
          color: `rgba(${theme.accentRgb},0.78)`,
          marginBottom: 12,
        }}>
          What the sort revealed
        </div>

        <h2 style={{
          ...TYPE.displayHero,
          color: GENERAL.cinematic.textPrimary,
          margin: 0,
          maxWidth: 470,
        }}>
          {block.summaryTitle}
        </h2>

        {block.summaryIntro && (
          <p style={{
            ...TYPE.bodyLarge,
            color: GENERAL.cinematic.textSecondary,
            margin: '18px 0 0',
            maxWidth: 500,
          }}>
            {block.summaryIntro}
          </p>
        )}

        {!!points.length && (
          <div className="colsort-summary-contrast">
            {points.map((point, index) => (
              <div className="colsort-summary-point" key={`${point.label}-${index}`}>
                <div style={{
                  ...TYPE.titleMedium,
                  color: theme.accent,
                  marginBottom: 5,
                }}>
                  {point.label}
                </div>
                <div style={{
                  ...TYPE.body,
                  color: GENERAL.cinematic.textFact,
                }}>
                  {point.text}
                </div>
              </div>
            ))}
          </div>
        )}

        {block.summaryClose && (
          <p style={{
            ...TYPE.bodyStrong,
            color: GENERAL.cinematic.textPrimary,
            margin: '34px 0 0',
            maxWidth: 500,
          }}>
            {block.summaryClose}
          </p>
        )}

        {onContinue && (
          <div className="colsort-summary-continue">
            <ContinueCTA onClick={onContinue} accent={theme.accent} />
          </div>
        )}
      </div>

      <div className="colsort-summary-progress">
        <SequenceProgress
          total={total}
          current={Math.max(total - 1, 0)}
          completed={Math.max(total - 1, 0)}
          accent={theme.accent}
          accentRgb={theme.accentRgb}
          compact
          ariaLabel="Sorting complete"
        />
      </div>
    </section>
  )
}

export default function ColSortBlock({ block, onComplete, ...props }) {
  const [sorted, setSorted] = useState(false)
  const [showSummary, setShowSummary] = useState(false)
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
    summaryTitle: block.summaryTitle
      || (vesaliusContext
        ? 'Knowledge changed before treatment did.'
        : treatmentInsight
          ? 'Knowledge changed faster than treatment.'
          : 'The pattern is clear.'),
    summaryIntro: block.summaryIntro
      || (vesaliusContext
        ? 'Vesalius changed how doctors built knowledge: ancient books could now be checked against real human bodies.'
        : block.explanation
          || 'The finished groups show the difference between change and continuity.'),
    summaryPoints: block.summaryPoints
      || (vesaliusContext
        ? [
            {
              label: 'What changed',
              text: 'Observation, human dissection and printed diagrams made anatomy more accurate — and weakened Galen’s authority.',
            },
            {
              label: 'What continued',
              text: 'Doctors still used the four humours, bloodletting and purging. Better knowledge had not yet created better cures.',
            },
          ]
        : columns.map((column, index) => ({
            label: String(column.label || '').split('\n')[0],
            text: items
              .filter(item => item.col === index)
              .slice(0, 3)
              .map(item => item.label)
              .join(' · '),
          })).filter(point => point.label && point.text)),
    summaryClose: block.summaryClose
      || (vesaliusContext
        ? 'The Renaissance transformed medical knowledge first. Everyday treatment took much longer to catch up.'
        : block.explanation),
  }

  function handleSortComplete(result) {
    setSorted(true)
    block.onSortComplete?.(result)
  }

  if (showSummary) {
    return (
      <div
        className="colsort-focus is-summary"
        style={{
          '--colsort-accent': theme.accent,
          '--colsort-frame': theme.accentSecondary || theme.accent,
        }}
      >
        <style>{FOCUS_CSS}</style>
        <ColSortSummary
          block={resolvedBlock}
          theme={theme}
          total={items.length}
          onContinue={onComplete}
        />
      </div>
    )
  }

  return (
    <div
      className={`colsort-focus${sorted ? ' is-sorted' : ''}`}
      style={{
        '--colsort-accent': theme.accent,
        '--colsort-frame': theme.accentSecondary || theme.accent,
      }}
    >
      <style>{FOCUS_CSS}</style>
      <ColSortBlockCore block={resolvedBlock} {...props} onComplete={handleSortComplete} />

      {sorted && (
        <div className="colsort-sort-continue">
          <ContinueCTA onClick={() => setShowSummary(true)} accent={theme.accent} />
        </div>
      )}
    </div>
  )
}

import { useEffect, useId } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'
import { SPACING } from '../../constants/spacing.js'
import { MOTION } from '../../constants/motion.js'
import { TYPE } from '../../constants/typography.js'
import CardContainer from '../core/CardContainer.jsx'

// ─── SVG plot geometry (shared by all graph types) ──────────────────────────
const W = 320
const H = 232
const M = { top: 18, right: 14, bottom: 60, left: 50 }
const PLOT_W = W - M.left - M.right
const PLOT_H = H - M.top - M.bottom
const TARGET_TICK_INTERVALS = 5
const DEFAULT_EMPTY_MESSAGE = 'Graph data unavailable'

const GRAPH_TYPE_LABELS = {
  bar: 'Bar chart',
  line: 'Line graph',
  scatter: 'Scatter graph',
  pie: 'Pie chart',
}

const PIE_PATTERN_TYPES = ['solid', 'diagonal', 'dots', 'crosshatch', 'reverseDiagonal']

const VISUALLY_HIDDEN = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
}

// SVG text needs chart-specific sizing because normal body tokens are too large
// inside a responsive viewBox. Keep these roles centralised rather than tuning
// individual labels independently.
const SVG_TEXT = {
  tick: {
    fill: 'rgba(255,255,255,0.62)',
    fontFamily: "'Sora', sans-serif",
    fontSize: 12,
  },
  axisLabel: {
    fill: 'rgba(255,255,255,0.78)',
    fontFamily: "'Sora', sans-serif",
    fontWeight: 600,
    fontSize: 13,
  },
}

let stylesInjected = false
function ensureStyles() {
  if (stylesInjected) return
  stylesInjected = true
  const el = document.createElement('style')
  el.textContent = `
    @keyframes gv-fade-up {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    @media (prefers-reduced-motion: reduce) {
      .graph-view__content {
        animation: none !important;
        transform: none !important;
      }
    }
  `
  document.head.appendChild(el)
}

// ─── Data preparation ───────────────────────────────────────────────────────

function toFiniteNumber(value) {
  if (value === '' || value === null || value === undefined) return null
  const number = Number(value)
  return Number.isFinite(number) ? number : null
}

export function prepareGraphData({ graphType, data = [], points = [] }) {
  const isPointGraph = graphType === 'line' || graphType === 'scatter'

  if (isPointGraph) {
    const cleanPoints = (Array.isArray(points) ? points : []).flatMap((point) => {
      const x = toFiniteNumber(point?.x)
      const y = toFiniteNumber(point?.y)
      return x === null || y === null ? [] : [{ ...point, x, y }]
    })

    const preparedPoints = graphType === 'line'
      ? cleanPoints
          .map((point, originalIndex) => ({ point, originalIndex }))
          .sort((a, b) => (a.point.x - b.point.x) || (a.originalIndex - b.originalIndex))
          .map(({ point }) => point)
      : cleanPoints

    return {
      data: [],
      points: preparedPoints,
      hasData: preparedPoints.length > 0,
    }
  }

  const cleanData = (Array.isArray(data) ? data : []).flatMap((item) => {
    const label = String(item?.label ?? '').trim()
    const value = toFiniteNumber(item?.value)
    if (!label || value === null) return []
    if (graphType === 'pie' && value <= 0) return []
    return [{ ...item, label, value }]
  })

  return {
    data: cleanData,
    points: [],
    hasData: cleanData.length > 0,
  }
}

export function wrapCategoryLabel(label, maxChars = 13, maxLines = 2) {
  const text = String(label ?? '').trim().replace(/\s+/g, ' ')
  if (!text || text.length <= maxChars) return text ? [text] : []

  const chunks = []
  text.split(' ').forEach((word) => {
    if (word.length <= maxChars) {
      chunks.push(word)
      return
    }

    for (let index = 0; index < word.length; index += maxChars) {
      chunks.push(word.slice(index, index + maxChars))
    }
  })

  const lines = []
  let current = ''

  chunks.forEach((chunk) => {
    const candidate = current ? `${current} ${chunk}` : chunk
    if (candidate.length <= maxChars) {
      current = candidate
      return
    }

    if (current) lines.push(current)
    current = chunk
  })

  if (current) lines.push(current)
  if (lines.length <= maxLines) return lines

  const visible = lines.slice(0, maxLines)
  const overflow = lines.slice(maxLines - 1).join(' ')
  visible[maxLines - 1] = overflow.length > maxChars
    ? `${overflow.slice(0, Math.max(1, maxChars - 1)).trimEnd()}…`
    : overflow

  return visible
}

export function piePatternForIndex(index) {
  const safeIndex = Number.isFinite(index) ? Math.abs(Math.trunc(index)) : 0
  return PIE_PATTERN_TYPES[safeIndex % PIE_PATTERN_TYPES.length]
}

// ─── Axis helpers ────────────────────────────────────────────────────────────

function normaliseNumber(value) {
  const normalised = Number(value.toPrecision(12))
  return Object.is(normalised, -0) ? 0 : normalised
}

function niceStep(range, targetIntervals = TARGET_TICK_INTERVALS) {
  if (!Number.isFinite(range) || range <= 0) return 1

  const roughStep = range / Math.max(targetIntervals, 1)
  const exponent = Math.floor(Math.log10(roughStep))
  const power = Math.pow(10, exponent)
  const fraction = roughStep / power

  let niceFraction
  if (fraction < 1.5) niceFraction = 1
  else if (fraction < 3.5) niceFraction = 2
  else if (fraction < 7.5) niceFraction = 5
  else niceFraction = 10

  return niceFraction * power
}

export function createNiceScale(min, max, targetIntervals = TARGET_TICK_INTERVALS) {
  let lower = Number.isFinite(min) ? min : 0
  let upper = Number.isFinite(max) ? max : lower + 1

  if (lower > upper) [lower, upper] = [upper, lower]

  if (lower === upper) {
    if (lower === 0) {
      upper = 1
    } else {
      const padding = Math.abs(lower) * 0.1
      lower -= padding
      upper += padding
    }
  }

  const step = niceStep(upper - lower, targetIntervals)
  const niceMin = normaliseNumber(Math.floor(lower / step) * step)
  let niceMax = normaliseNumber(Math.ceil(upper / step) * step)

  if (niceMin === niceMax) niceMax = normaliseNumber(niceMin + step)

  const intervalCount = Math.max(1, Math.round((niceMax - niceMin) / step))
  const ticks = Array.from({ length: intervalCount + 1 }, (_, index) => {
    const value = normaliseNumber(niceMin + step * index)
    return { value, label: formatTick(value) }
  })

  return { min: niceMin, max: niceMax, step, ticks }
}

function formatTick(n) {
  const rounded = Math.round(n * 100) / 100
  return Number.isInteger(rounded) ? String(rounded) : String(parseFloat(rounded.toFixed(2)))
}

function asSentence(text) {
  const trimmed = String(text || '').trim()
  if (!trimmed) return ''
  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`
}

export function buildGraphDescription({
  graphType,
  caption,
  xLabel,
  yLabel,
  data = [],
  points = [],
  lineOfBestFit,
}) {
  const captionSentence = asSentence(caption)
  const prefix = captionSentence ? `${captionSentence} ` : ''
  const xAxis = xLabel ? ` X-axis: ${xLabel}.` : ''
  const yAxis = yLabel ? ` Y-axis: ${yLabel}.` : ''
  const itemCount = graphType === 'line' || graphType === 'scatter' ? points.length : data.length
  const graphLabel = GRAPH_TYPE_LABELS[graphType] || 'Graph'

  if (itemCount === 0) return `${prefix}${graphLabel} has no data available.`

  if (graphType === 'pie') {
    return `${prefix}Pie chart with ${data.length} ${data.length === 1 ? 'segment' : 'segments'}. Exact values and percentages are available in the data table.`
  }

  if (graphType === 'bar') {
    return `${prefix}Bar chart with ${data.length} ${data.length === 1 ? 'category' : 'categories'}.${xAxis}${yAxis} Exact values are available in the data table.`
  }

  if (graphType === 'scatter') {
    const bestFit = lineOfBestFit ? ' and a line of best fit' : ''
    return `${prefix}Scatter graph with ${points.length} plotted ${points.length === 1 ? 'point' : 'points'}${bestFit}.${xAxis}${yAxis} Exact values are available in the data table.`
  }

  return `${prefix}Line graph with ${points.length} plotted ${points.length === 1 ? 'point' : 'points'}.${xAxis}${yAxis} Exact values are available in the data table.`
}

// ─── Shared accessible chart metadata ───────────────────────────────────────

function SvgMetadata({ titleId, descriptionId, title, description }) {
  return (
    <>
      <title id={titleId}>{title}</title>
      <desc id={descriptionId}>{description}</desc>
    </>
  )
}

function AccessibleDataTable({ graphType, title, data, points, xLabel, yLabel }) {
  const isPointGraph = graphType === 'line' || graphType === 'scatter'
  const isPie = graphType === 'pie'
  const total = isPie ? data.reduce((sum, item) => sum + item.value, 0) || 1 : 1

  return (
    <table style={VISUALLY_HIDDEN}>
      <caption>{`Data for ${title}`}</caption>
      <thead>
        <tr>
          {isPointGraph ? (
            <>
              <th scope="col">{xLabel || 'X value'}</th>
              <th scope="col">{yLabel || 'Y value'}</th>
            </>
          ) : (
            <>
              <th scope="col">Category</th>
              <th scope="col">Value</th>
              {isPie && <th scope="col">Percentage</th>}
            </>
          )}
        </tr>
      </thead>
      <tbody>
        {isPointGraph
          ? points.map((point, index) => (
              <tr key={`${point.x}-${point.y}-${index}`}>
                <td>{point.x}</td>
                <td>{point.y}</td>
              </tr>
            ))
          : data.map((item, index) => (
              <tr key={`${item.label}-${index}`}>
                <th scope="row">{item.label}</th>
                <td>{item.value}</td>
                {isPie && <td>{`${Math.round((item.value / total) * 100)}%`}</td>}
              </tr>
            ))}
      </tbody>
    </table>
  )
}

// ─── Shared axis chrome — gridlines, ticks, axis labels ─────────────────────

function AxisFrame({ xTicks, yTicks, toX, toY, xLabel, yLabel }) {
  return (
    <>
      {yTicks.map((t, i) => (
        <g key={`y-${i}`}>
          <line x1={M.left} x2={M.left + PLOT_W} y1={toY(t.value)} y2={toY(t.value)} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
          <text
            {...SVG_TEXT.tick}
            x={M.left - 8}
            y={toY(t.value)}
            textAnchor="end"
            dominantBaseline="middle"
          >
            {t.label}
          </text>
        </g>
      ))}

      {xTicks.map((t, i) => {
        const lines = t.lines?.length ? t.lines : [t.label]
        const x = toX(t.value)

        return (
          <text
            {...SVG_TEXT.tick}
            key={`x-${i}`}
            x={x}
            y={M.top + PLOT_H + 22}
            textAnchor="middle"
          >
            {lines.map((line, lineIndex) => (
              <tspan key={`${line}-${lineIndex}`} x={x} dy={lineIndex === 0 ? 0 : 13}>
                {line}
              </tspan>
            ))}
          </text>
        )
      })}

      <line x1={M.left} x2={M.left + PLOT_W} y1={M.top + PLOT_H} y2={M.top + PLOT_H} stroke="rgba(255,255,255,0.18)" strokeWidth={1} />
      <line x1={M.left} x2={M.left} y1={M.top} y2={M.top + PLOT_H} stroke="rgba(255,255,255,0.18)" strokeWidth={1} />

      {xLabel && (
        <text
          {...SVG_TEXT.axisLabel}
          x={M.left + PLOT_W / 2}
          y={H - 9}
          textAnchor="middle"
        >
          {xLabel}
        </text>
      )}
      {yLabel && (
        <text
          {...SVG_TEXT.axisLabel}
          x={13}
          y={M.top + PLOT_H / 2}
          textAnchor="middle"
          transform={`rotate(-90 13 ${M.top + PLOT_H / 2})`}
        >
          {yLabel}
        </text>
      )}
    </>
  )
}

function EmptyGraphState({ message }) {
  return (
    <div
      role="status"
      style={{
        minHeight: 160,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <span style={{ ...TYPE.bodySmall, color: 'rgba(255,255,255,0.56)' }}>
        {message}
      </span>
    </div>
  )
}

// ─── Bar chart ────────────────────────────────────────────────────────────────

function BarChart({ data, accent, xLabel, yLabel, yMax: yMaxProp, a11y }) {
  const n = Math.max(data.length, 1)
  const rawYMax = yMaxProp ?? Math.max(...data.map(d => d.value), 0)
  const yScale = createNiceScale(0, Math.max(rawYMax, 1))

  const toX = i => M.left + (i + 0.5) * (PLOT_W / n)
  const toY = v => M.top + PLOT_H - ((v - yScale.min) / (yScale.max - yScale.min || 1)) * PLOT_H
  const barW = (PLOT_W / n) * 0.55

  const xTicks = data.map((d, i) => ({
    value: i,
    label: d.label,
    lines: wrapCategoryLabel(d.label),
  }))

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-labelledby={`${a11y.titleId} ${a11y.descriptionId}`}
      style={{ width: '100%', height: 'auto', display: 'block' }}
    >
      <SvgMetadata {...a11y} />
      <AxisFrame xTicks={xTicks} yTicks={yScale.ticks} toX={toX} toY={toY} xLabel={xLabel} yLabel={yLabel} />
      {data.map((d, i) => {
        const y = toY(d.value)
        return <rect key={i} x={toX(i) - barW / 2} y={y} width={barW} height={toY(yScale.min) - y} fill={accent} rx={2} />
      })}
    </svg>
  )
}

// ─── Line chart ───────────────────────────────────────────────────────────────

function LineChart({ points, accent, xLabel, yLabel, xMin, xMax, yMin, yMax, a11y }) {
  const rawXLo = xMin ?? Math.min(...points.map(p => p.x))
  const rawXHi = xMax ?? Math.max(...points.map(p => p.x))
  const rawYLo = yMin ?? 0
  const rawYHi = yMax ?? Math.max(...points.map(p => p.y), 0)

  const xScale = createNiceScale(rawXLo, rawXHi)
  const yScale = createNiceScale(rawYLo, rawYHi)

  const toX = x => M.left + ((x - xScale.min) / (xScale.max - xScale.min || 1)) * PLOT_W
  const toY = y => M.top + PLOT_H - ((y - yScale.min) / (yScale.max - yScale.min || 1)) * PLOT_H

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${toX(p.x)} ${toY(p.y)}`).join(' ')

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-labelledby={`${a11y.titleId} ${a11y.descriptionId}`}
      style={{ width: '100%', height: 'auto', display: 'block' }}
    >
      <SvgMetadata {...a11y} />
      <AxisFrame xTicks={xScale.ticks} yTicks={yScale.ticks} toX={toX} toY={toY} xLabel={xLabel} yLabel={yLabel} />
      <path d={pathD} fill="none" stroke={accent} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
      {points.map((p, i) => <circle key={i} cx={toX(p.x)} cy={toY(p.y)} r={3.5} fill={accent} />)}
    </svg>
  )
}

// ─── Scatter chart ──────────────────────────────────────────────────────────

function ScatterChart({ points, accent, lineOfBestFit, xLabel, yLabel, xMin, xMax, yMin, yMax, a11y }) {
  const rawXLo = xMin ?? 0
  const rawXHi = xMax ?? Math.max(...points.map(p => p.x), 0)
  const rawYLo = yMin ?? 0
  const rawYHi = yMax ?? Math.max(...points.map(p => p.y), 0)

  const xScale = createNiceScale(rawXLo, rawXHi)
  const yScale = createNiceScale(rawYLo, rawYHi)

  const toX = x => M.left + ((x - xScale.min) / (xScale.max - xScale.min || 1)) * PLOT_W
  const toY = y => M.top + PLOT_H - ((y - yScale.min) / (yScale.max - yScale.min || 1)) * PLOT_H

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-labelledby={`${a11y.titleId} ${a11y.descriptionId}`}
      style={{ width: '100%', height: 'auto', display: 'block' }}
    >
      <SvgMetadata {...a11y} />
      <AxisFrame xTicks={xScale.ticks} yTicks={yScale.ticks} toX={toX} toY={toY} xLabel={xLabel} yLabel={yLabel} />
      {lineOfBestFit && (
        <line
          x1={toX(lineOfBestFit.from.x)} y1={toY(lineOfBestFit.from.y)}
          x2={toX(lineOfBestFit.to.x)} y2={toY(lineOfBestFit.to.y)}
          stroke={accent} strokeWidth={1.5} strokeDasharray="5 4" opacity={0.7}
        />
      )}
      {points.map((p, i) => <circle key={i} cx={toX(p.x)} cy={toY(p.y)} r={4} fill="none" stroke={accent} strokeWidth={2} />)}
    </svg>
  )
}

// ─── Pie chart ────────────────────────────────────────────────────────────────

function PiePattern({ id, color, type }) {
  return (
    <pattern id={id} patternUnits="userSpaceOnUse" width={8} height={8}>
      <rect width={8} height={8} fill={color} />
      {type === 'diagonal' && (
        <path d="M-2 2 L2 -2 M0 8 L8 0 M6 10 L10 6" stroke="rgba(255,255,255,0.38)" strokeWidth={1.4} />
      )}
      {type === 'reverseDiagonal' && (
        <path d="M-2 6 L2 10 M0 0 L8 8 M6 -2 L10 2" stroke="rgba(255,255,255,0.38)" strokeWidth={1.4} />
      )}
      {type === 'dots' && (
        <>
          <circle cx={2} cy={2} r={1.1} fill="rgba(255,255,255,0.48)" />
          <circle cx={6} cy={6} r={1.1} fill="rgba(255,255,255,0.48)" />
        </>
      )}
      {type === 'crosshatch' && (
        <path d="M0 0 L8 8 M8 0 L0 8" stroke="rgba(255,255,255,0.34)" strokeWidth={1.1} />
      )}
    </pattern>
  )
}

function pieLegendSwatchStyle(color, type) {
  const style = { backgroundColor: color }

  if (type === 'diagonal') {
    style.backgroundImage = 'repeating-linear-gradient(135deg, rgba(255,255,255,0.42) 0 2px, transparent 2px 6px)'
  } else if (type === 'reverseDiagonal') {
    style.backgroundImage = 'repeating-linear-gradient(45deg, rgba(255,255,255,0.42) 0 2px, transparent 2px 6px)'
  } else if (type === 'dots') {
    style.backgroundImage = 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.5) 0 1px, transparent 1.5px)'
    style.backgroundSize = '6px 6px'
  } else if (type === 'crosshatch') {
    style.backgroundImage = 'repeating-linear-gradient(45deg, rgba(255,255,255,0.32) 0 1px, transparent 1px 5px), repeating-linear-gradient(135deg, rgba(255,255,255,0.32) 0 1px, transparent 1px 5px)'
  }

  return style
}

function PieChart({ data, accent, accentSecondary, accentTertiary, a11y }) {
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1
  const pieH = 186
  const cx = W / 2
  const cy = pieH / 2
  const r = Math.min(W, pieH) / 2 - 10
  const colors = [accent, accentSecondary, accentTertiary, 'rgba(255,255,255,0.32)', 'rgba(255,255,255,0.16)']

  let cumulative = 0
  const slices = data.map((d, i) => {
    const startAngle = (cumulative / total) * 2 * Math.PI - Math.PI / 2
    cumulative += d.value
    const endAngle = (cumulative / total) * 2 * Math.PI - Math.PI / 2
    return {
      ...d,
      startAngle,
      endAngle,
      color: colors[i % colors.length],
      patternType: piePatternForIndex(i),
      patternId: `${a11y.titleId}-pattern-${i}`,
    }
  })

  return (
    <>
      <svg
        viewBox={`0 0 ${W} ${pieH}`}
        role="img"
        aria-labelledby={`${a11y.titleId} ${a11y.descriptionId}`}
        style={{ width: '100%', height: 'auto', display: 'block' }}
      >
        <SvgMetadata {...a11y} />
        <defs>
          {slices.map((slice) => (
            <PiePattern
              key={slice.patternId}
              id={slice.patternId}
              color={slice.color}
              type={slice.patternType}
            />
          ))}
        </defs>
        {slices.length === 1 ? (
          <circle cx={cx} cy={cy} r={r} fill={`url(#${slices[0].patternId})`} />
        ) : (
          slices.map((s, i) => {
            const x1 = cx + r * Math.cos(s.startAngle)
            const y1 = cy + r * Math.sin(s.startAngle)
            const x2 = cx + r * Math.cos(s.endAngle)
            const y2 = cy + r * Math.sin(s.endAngle)
            const largeArc = s.endAngle - s.startAngle > Math.PI ? 1 : 0
            return (
              <path
                key={i}
                d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`}
                fill={`url(#${s.patternId})`}
                stroke="rgba(8,9,13,0.9)"
                strokeWidth={1.5}
              />
            )
          })
        )}
      </svg>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(112px, 1fr))',
        columnGap: SPACING.compact,
        rowGap: SPACING.micro,
        marginTop: SPACING.compact,
      }}>
        {slices.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: SPACING.micro, minWidth: 0 }}>
            <div style={{
              width: 12,
              height: 12,
              borderRadius: 3,
              flexShrink: 0,
              ...pieLegendSwatchStyle(s.color, s.patternType),
            }} />
            <span style={{ ...TYPE.bodySmall, fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>
              {s.label} ({Math.round((s.value / total) * 100)}%)
            </span>
          </div>
        ))}
      </div>
    </>
  )
}

// ─── GraphView ──────────────────────────────────────────────────────────────
//
// Embeddable content block for displaying GCSE Maths graphs/charts
// (bar, line, scatter, pie) inline within a content screen.
//
// Block shape:
// {
//   type: 'graphView',
//   graphType: 'bar' | 'line' | 'scatter' | 'pie',
//   title?, caption?, description?, emptyMessage?, xLabel?, yLabel?,
//   data?: [{ label, value }],        // bar, pie
//   points?: [{ x, y }],              // line, scatter
//   lineOfBestFit?: { from: {x,y}, to: {x,y} },  // scatter
//   xMin?, xMax?, yMin?, yMax?,       // requested axis bounds; rounded outward to clean 1/2/5 intervals
// }
export default function GraphView({ block, subject = 'Maths' }) {
  const theme = SUBJECTS[subject] || SUBJECTS.Maths
  const { accent, accentSecondary, accentTertiary } = theme
  const reactId = useId()
  const graphId = `graph-view-${reactId.replace(/:/g, '')}`

  useEffect(() => { ensureStyles() }, [])

  const {
    graphType = 'bar',
    title,
    caption,
    description,
    emptyMessage = DEFAULT_EMPTY_MESSAGE,
    xLabel,
    yLabel,
    data = [],
    points = [],
    lineOfBestFit,
    xMin, xMax, yMin, yMax,
  } = block

  const prepared = prepareGraphData({ graphType, data, points })
  const displayTitle = title || GRAPH_TYPE_LABELS[graphType] || 'Graph'
  const generatedDescription = buildGraphDescription({
    graphType,
    caption,
    xLabel,
    yLabel,
    data: prepared.data,
    points: prepared.points,
    lineOfBestFit,
  })
  const accessibleDescription = description || generatedDescription
  const figureTitleId = `${graphId}-figure-title`
  const figureDescriptionId = `${graphId}-figure-description`
  const a11y = {
    title: displayTitle,
    description: accessibleDescription,
    titleId: `${graphId}-svg-title`,
    descriptionId: `${graphId}-svg-description`,
  }

  return (
    <CardContainer
      variant="contained"
      subject={subject}
      padding={SPACING.standard}
      showAtmosphere={false}
    >
      <figure
        className="graph-view__content"
        aria-labelledby={figureTitleId}
        aria-describedby={figureDescriptionId}
        style={{
          margin: 0,
          animation: `gv-fade-up ${MOTION.duration.slow} ${MOTION.easing.standard} both`,
        }}
      >
        {title ? (
          <h3 id={figureTitleId} style={{
            ...TYPE.titleMedium,
            color: 'rgba(245,245,245,0.92)',
            margin: `0 0 ${SPACING.compact}px`,
          }}>
            {title}
          </h3>
        ) : (
          <span id={figureTitleId} style={VISUALLY_HIDDEN}>{displayTitle}</span>
        )}

        <p id={figureDescriptionId} style={VISUALLY_HIDDEN}>{accessibleDescription}</p>

        {prepared.hasData ? (
          <>
            {graphType === 'bar' && <BarChart data={prepared.data} accent={accent} xLabel={xLabel} yLabel={yLabel} yMax={yMax} a11y={a11y} />}
            {graphType === 'line' && <LineChart points={prepared.points} accent={accent} xLabel={xLabel} yLabel={yLabel} xMin={xMin} xMax={xMax} yMin={yMin} yMax={yMax} a11y={a11y} />}
            {graphType === 'scatter' && <ScatterChart points={prepared.points} accent={accent} lineOfBestFit={lineOfBestFit} xLabel={xLabel} yLabel={yLabel} xMin={xMin} xMax={xMax} yMin={yMin} yMax={yMax} a11y={a11y} />}
            {graphType === 'pie' && <PieChart data={prepared.data} accent={accent} accentSecondary={accentSecondary} accentTertiary={accentTertiary} a11y={a11y} />}
          </>
        ) : (
          <EmptyGraphState message={emptyMessage} />
        )}

        {caption && (
          <figcaption style={{
            ...TYPE.bodySmall,
            color: 'rgba(255,255,255,0.56)',
            marginTop: SPACING.compact,
          }}>
            {caption}
          </figcaption>
        )}

        {prepared.hasData && (
          <AccessibleDataTable
            graphType={graphType}
            title={displayTitle}
            data={prepared.data}
            points={prepared.points}
            xLabel={xLabel}
            yLabel={yLabel}
          />
        )}
      </figure>
    </CardContainer>
  )
}

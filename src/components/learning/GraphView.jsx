import { useEffect } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'
import { SPACING } from '../../constants/spacing.js'
import { MOTION } from '../../constants/motion.js'
import { TYPE } from '../../constants/typography.js'
import CardContainer from '../core/CardContainer.jsx'

// ─── SVG plot geometry (shared by all graph types) ──────────────────────────
const W = 320
const H = 220
const M = { top: 18, right: 14, bottom: 44, left: 46 }
const PLOT_W = W - M.left - M.right
const PLOT_H = H - M.top - M.bottom
const TARGET_TICK_INTERVALS = 5

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
  `
  document.head.appendChild(el)
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

// ─── Shared axis chrome — gridlines, ticks, axis labels ─────────────────────

function AxisFrame({ xTicks, yTicks, toX, toY, xLabel, yLabel }) {
  return (
    <>
      {yTicks.map((t, i) => (
        <g key={`y-${i}`}>
          <line x1={M.left} x2={M.left + PLOT_W} y1={toY(t.value)} y2={toY(t.value)} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
          <text x={M.left - 8} y={toY(t.value)} textAnchor="end" dominantBaseline="middle" fill="rgba(255,255,255,0.46)" fontFamily="'Sora', sans-serif" fontSize={10}>
            {t.label}
          </text>
        </g>
      ))}

      {xTicks.map((t, i) => (
        <text key={`x-${i}`} x={toX(t.value)} y={M.top + PLOT_H + 18} textAnchor="middle" fill="rgba(255,255,255,0.46)" fontFamily="'Sora', sans-serif" fontSize={10}>
          {t.label}
        </text>
      ))}

      <line x1={M.left} x2={M.left + PLOT_W} y1={M.top + PLOT_H} y2={M.top + PLOT_H} stroke="rgba(255,255,255,0.18)" strokeWidth={1} />
      <line x1={M.left} x2={M.left} y1={M.top} y2={M.top + PLOT_H} stroke="rgba(255,255,255,0.18)" strokeWidth={1} />

      {xLabel && (
        <text x={M.left + PLOT_W / 2} y={H - 4} textAnchor="middle" fill="rgba(255,255,255,0.6)" fontFamily="'Sora', sans-serif" fontWeight={600} fontSize={11}>
          {xLabel}
        </text>
      )}
      {yLabel && (
        <text x={12} y={M.top + PLOT_H / 2} textAnchor="middle" fill="rgba(255,255,255,0.6)" fontFamily="'Sora', sans-serif" fontWeight={600} fontSize={11} transform={`rotate(-90 12 ${M.top + PLOT_H / 2})`}>
          {yLabel}
        </text>
      )}
    </>
  )
}

// ─── Bar chart ────────────────────────────────────────────────────────────────

function BarChart({ data, accent, xLabel, yLabel, yMax: yMaxProp }) {
  const n = Math.max(data.length, 1)
  const rawYMax = yMaxProp ?? Math.max(...data.map(d => d.value), 0)
  const yScale = createNiceScale(0, Math.max(rawYMax, 1))

  const toX = i => M.left + (i + 0.5) * (PLOT_W / n)
  const toY = v => M.top + PLOT_H - ((v - yScale.min) / (yScale.max - yScale.min || 1)) * PLOT_H
  const barW = (PLOT_W / n) * 0.55

  const xTicks = data.map((d, i) => ({ value: i, label: d.label }))

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
      <AxisFrame xTicks={xTicks} yTicks={yScale.ticks} toX={toX} toY={toY} xLabel={xLabel} yLabel={yLabel} />
      {data.map((d, i) => {
        const y = toY(d.value)
        return <rect key={i} x={toX(i) - barW / 2} y={y} width={barW} height={toY(yScale.min) - y} fill={accent} rx={2} />
      })}
    </svg>
  )
}

// ─── Line chart ───────────────────────────────────────────────────────────────

function LineChart({ points, accent, xLabel, yLabel, xMin, xMax, yMin, yMax }) {
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
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
      <AxisFrame xTicks={xScale.ticks} yTicks={yScale.ticks} toX={toX} toY={toY} xLabel={xLabel} yLabel={yLabel} />
      <path d={pathD} fill="none" stroke={accent} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
      {points.map((p, i) => <circle key={i} cx={toX(p.x)} cy={toY(p.y)} r={3} fill={accent} />)}
    </svg>
  )
}

// ─── Scatter chart ──────────────────────────────────────────────────────────

function ScatterChart({ points, accent, lineOfBestFit, xLabel, yLabel, xMin, xMax, yMin, yMax }) {
  const rawXLo = xMin ?? 0
  const rawXHi = xMax ?? Math.max(...points.map(p => p.x), 0)
  const rawYLo = yMin ?? 0
  const rawYHi = yMax ?? Math.max(...points.map(p => p.y), 0)

  const xScale = createNiceScale(rawXLo, rawXHi)
  const yScale = createNiceScale(rawYLo, rawYHi)

  const toX = x => M.left + ((x - xScale.min) / (xScale.max - xScale.min || 1)) * PLOT_W
  const toY = y => M.top + PLOT_H - ((y - yScale.min) / (yScale.max - yScale.min || 1)) * PLOT_H

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
      <AxisFrame xTicks={xScale.ticks} yTicks={yScale.ticks} toX={toX} toY={toY} xLabel={xLabel} yLabel={yLabel} />
      {lineOfBestFit && (
        <line
          x1={toX(lineOfBestFit.from.x)} y1={toY(lineOfBestFit.from.y)}
          x2={toX(lineOfBestFit.to.x)} y2={toY(lineOfBestFit.to.y)}
          stroke={accent} strokeWidth={1.5} strokeDasharray="5 4" opacity={0.7}
        />
      )}
      {points.map((p, i) => <circle key={i} cx={toX(p.x)} cy={toY(p.y)} r={3.5} fill="none" stroke={accent} strokeWidth={2} />)}
    </svg>
  )
}

// ─── Pie chart ────────────────────────────────────────────────────────────────

function PieChart({ data, accent, accentSecondary, accentTertiary }) {
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1
  const pieH = H - 34
  const cx = W / 2
  const cy = pieH / 2
  const r = Math.min(W, pieH) / 2 - 10
  const colors = [accent, accentSecondary, accentTertiary, 'rgba(255,255,255,0.32)', 'rgba(255,255,255,0.16)']

  let cumulative = 0
  const slices = data.map((d, i) => {
    const startAngle = (cumulative / total) * 2 * Math.PI - Math.PI / 2
    cumulative += d.value
    const endAngle = (cumulative / total) * 2 * Math.PI - Math.PI / 2
    return { ...d, startAngle, endAngle, color: colors[i % colors.length] }
  })

  return (
    <>
      <svg viewBox={`0 0 ${W} ${pieH}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
        {slices.length === 1 ? (
          <circle cx={cx} cy={cy} r={r} fill={slices[0].color} />
        ) : (
          slices.map((s, i) => {
            const x1 = cx + r * Math.cos(s.startAngle)
            const y1 = cy + r * Math.sin(s.startAngle)
            const x2 = cx + r * Math.cos(s.endAngle)
            const y2 = cy + r * Math.sin(s.endAngle)
            const largeArc = s.endAngle - s.startAngle > Math.PI ? 1 : 0
            return <path key={i} d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`} fill={s.color} stroke="#08090D" strokeWidth={1.5} />
          })
        )}
      </svg>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: SPACING.micro, justifyContent: 'center', marginTop: SPACING.micro }}>
        {slices.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: s.color, flexShrink: 0 }} />
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
//   title?, caption?, xLabel?, yLabel?,
//   data?: [{ label, value }],        // bar, pie
//   points?: [{ x, y }],              // line, scatter
//   lineOfBestFit?: { from: {x,y}, to: {x,y} },  // scatter
//   xMin?, xMax?, yMin?, yMax?,       // requested axis bounds; rounded outward to clean 1/2/5 intervals
// }
export default function GraphView({ block, subject = 'Maths' }) {
  const theme = SUBJECTS[subject] || SUBJECTS.Maths
  const { accent, accentSecondary, accentTertiary } = theme

  useEffect(() => { ensureStyles() }, [])

  const {
    graphType = 'bar',
    title,
    caption,
    xLabel,
    yLabel,
    data = [],
    points = [],
    lineOfBestFit,
    xMin, xMax, yMin, yMax,
  } = block

  return (
    <CardContainer variant="contained" subject={subject} padding={20}>
      <div style={{ animation: `gv-fade-up ${MOTION.duration.slow} ${MOTION.easing.standard} both` }}>
        {title && (
          <h3 style={{
            ...TYPE.titleMedium,
            color: 'rgba(245,245,245,0.92)',
            margin: `0 0 ${SPACING.compact}px`,
          }}>
            {title}
          </h3>
        )}

        {graphType === 'bar' && <BarChart data={data} accent={accent} xLabel={xLabel} yLabel={yLabel} yMax={yMax} />}
        {graphType === 'line' && <LineChart points={points} accent={accent} xLabel={xLabel} yLabel={yLabel} xMin={xMin} xMax={xMax} yMin={yMin} yMax={yMax} />}
        {graphType === 'scatter' && <ScatterChart points={points} accent={accent} lineOfBestFit={lineOfBestFit} xLabel={xLabel} yLabel={yLabel} xMin={xMin} xMax={xMax} yMin={yMin} yMax={yMax} />}
        {graphType === 'pie' && <PieChart data={data} accent={accent} accentSecondary={accentSecondary} accentTertiary={accentTertiary} />}

        {caption && (
          <div style={{
            ...TYPE.bodySmall,
            color: 'rgba(255,255,255,0.56)',
            marginTop: SPACING.micro,
          }}>
            {caption}
          </div>
        )}
      </div>
    </CardContainer>
  )
}

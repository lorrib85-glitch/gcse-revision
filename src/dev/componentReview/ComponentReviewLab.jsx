// ─── Component Review Lab ────────────────────────────────────────────────────
//
// DEVELOPMENT-ONLY inspection environment. Reached only via ?componentReview=true
// in a DEV build (see src/App.jsx gate); never part of learner navigation and
// tree-shaken out of production.
//
// Purpose: view currently unused / orphaned / one-off learning components at a
// realistic ~390px mobile size with realistic GCSE fixtures, alongside a small
// factual review panel — to support a later keep / repurpose / merge / delete
// decision. It changes no production content and writes no learner data.
//
// Learner-state isolation: on mount it switches the storage active scope to an
// isolated 'devreview' namespace, so any component that logs a weakness on
// answer (SpotTheError, MisconceptionCheck, OrderedRouteTask, MatchingTask)
// writes to devreview::… keys — never guest::/uid:… learner data,
// and never anything that syncs to the cloud. The previous scope is restored on
// unmount.

import { Component, useEffect, useMemo, useState } from 'react'
import { getActiveScope, setActiveScope } from '../../lib/storage.js'
import { SUBJECTS } from '../../constants/subjects.js'
import { GENERAL } from '../../constants/generalTheme.js'
import { REVIEW_ENTRIES, REVIEW_QUESTIONS, STATUS_LABELS, GROUP_LABELS } from './reviewManifest.jsx'

const DEV_REVIEW_SCOPE = 'devreview'

const FILTERS = [
  { id: 'all',           label: 'All' },
  { id: 'unused',        label: 'Unused' },
  { id: 'one-off',       label: 'One-off' },
  { id: 'comparison',    label: 'Comparison' },
]

// Which manifest statuses each filter matches.
function matchesFilter(entry, filterId) {
  if (filterId === 'all') return true
  if (filterId === 'unused') return entry.status === 'unused' || entry.status === 'routed-unused'
  if (filterId === 'one-off') return entry.status === 'one-off'
  if (filterId === 'comparison') return entry.status === 'comparison'
  return true
}

const mono = { fontFamily: "'Sora', sans-serif" }

// Leave the lab by dropping the ?componentReview flag and reloading into the
// normal learner app. Used from the index header so production users (the app
// owner) are never trapped in the lab.
function exitToApp() {
  if (typeof window === 'undefined') return
  window.location.assign(window.location.pathname)
}

function StatusChip({ status }) {
  const tone = {
    'unused':        GENERAL.error,
    'routed-unused': GENERAL.coral,
    'one-off':       GENERAL.teal,
    'comparison':    GENERAL.slate,
  }[status] || GENERAL.slate
  return (
    <span style={{
      ...mono, fontSize: 10.5, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
      color: tone, border: `1px solid ${tone}`, borderRadius: 6, padding: '2px 7px', whiteSpace: 'nowrap',
    }}>
      {STATUS_LABELS[status] || status}
    </span>
  )
}

export default function ComponentReviewLab() {
  // ── Learner-state isolation ────────────────────────────────────────────────
  useEffect(() => {
    const prev = getActiveScope()
    setActiveScope(DEV_REVIEW_SCOPE)
    return () => setActiveScope(prev)
  }, [])

  const [filter, setFilter] = useState('all')
  const [activeId, setActiveId] = useState(null)   // null = index view
  const [previewKey, setPreviewKey] = useState(0)  // bump to reset/replay a preview
  const [questionsOpen, setQuestionsOpen] = useState(false)
  const [vw, setVw] = useState(typeof window !== 'undefined' ? window.innerWidth : 0)

  useEffect(() => {
    const onResize = () => setVw(window.innerWidth)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const filtered = useMemo(
    () => REVIEW_ENTRIES.filter(e => matchesFilter(e, filter)),
    [filter]
  )

  const activeIndex = filtered.findIndex(e => e.id === activeId)
  const active = activeIndex >= 0 ? filtered[activeIndex] : null

  function openEntry(id) {
    setActiveId(id)
    setPreviewKey(k => k + 1)
    setQuestionsOpen(false)
  }
  function goToIndex() { setActiveId(null) }
  function step(delta) {
    if (activeIndex < 0) return
    const next = (activeIndex + delta + filtered.length) % filtered.length
    openEntry(filtered[next].id)
  }

  // If the active entry falls out of the current filter, drop back to index.
  useEffect(() => {
    if (activeId && activeIndex < 0) setActiveId(null)
  }, [activeId, activeIndex])

  return (
    <div style={{ minHeight: '100vh', background: GENERAL.backgroundApp, color: GENERAL.softWhite }}>
      {active ? (
        <PreviewView
          key={active.id}
          entry={active}
          previewKey={previewKey}
          position={`${activeIndex + 1} / ${filtered.length}`}
          vw={vw}
          questionsOpen={questionsOpen}
          onToggleQuestions={() => setQuestionsOpen(o => !o)}
          onBack={goToIndex}
          onPrev={() => step(-1)}
          onNext={() => step(1)}
          onReset={() => setPreviewKey(k => k + 1)}
        />
      ) : (
        <IndexView
          filtered={filtered}
          filter={filter}
          onFilter={setFilter}
          onOpen={openEntry}
        />
      )}
    </div>
  )
}

// ─── Index view ──────────────────────────────────────────────────────────────
function IndexView({ filtered, filter, onFilter, onOpen }) {
  const groups = ['group1', 'group2', 'comparison']
  return (
    <div style={{ maxWidth: 420, margin: '0 auto', padding: '20px 16px 64px' }}>
      <header style={{ marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ ...mono, fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: GENERAL.teal }}>
            Development tool
          </div>
          <button onClick={exitToApp} style={{ ...ctrlBtn, flexShrink: 0 }}>Exit to app ✕</button>
        </div>
        <h1 style={{ ...mono, fontSize: 22, fontWeight: 700, margin: '4px 0 6px' }}>Component review lab</h1>
        <p style={{ ...mono, fontSize: 13, lineHeight: 1.5, color: GENERAL.slate, margin: 0 }}>
          Inspect unused, orphaned and one-off learning components with realistic GCSE fixtures.
          Nothing here changes production content or learner data.
        </p>
      </header>

      <div style={{ display: 'flex', gap: 8, marginBottom: 22, flexWrap: 'wrap' }}>
        {FILTERS.map(f => {
          const on = f.id === filter
          return (
            <button key={f.id} onClick={() => onFilter(f.id)} style={{
              ...mono, fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
              padding: '6px 12px', borderRadius: 8,
              background: on ? GENERAL.teal : 'transparent',
              color: on ? GENERAL.backgroundApp : GENERAL.slate,
              border: `1px solid ${on ? GENERAL.teal : GENERAL.line.strong}`,
            }}>
              {f.label}
            </button>
          )
        })}
      </div>

      {groups.map(group => {
        const rows = filtered.filter(e => e.group === group)
        if (!rows.length) return null
        return (
          <section key={group} style={{ marginBottom: 24 }}>
            <div style={{ ...mono, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: GENERAL.slate, marginBottom: 10 }}>
              {GROUP_LABELS[group]}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {rows.map(entry => (
                <button key={entry.id} onClick={() => onOpen(entry.id)} style={{
                  ...mono, textAlign: 'left', cursor: 'pointer',
                  background: GENERAL.backgroundSurface, border: `1px solid ${GENERAL.line.soft}`,
                  borderRadius: 12, padding: '13px 14px', color: GENERAL.softWhite,
                  borderLeft: `3px solid ${(SUBJECTS[entry.subject] || SUBJECTS.History).accent}`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 5 }}>
                    <span style={{ fontSize: 15, fontWeight: 700 }}>{entry.name}</span>
                    <StatusChip status={entry.status} />
                  </div>
                  <div style={{ fontSize: 12.5, lineHeight: 1.45, color: GENERAL.slate }}>{entry.function}</div>
                </button>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}

// ─── Preview view ────────────────────────────────────────────────────────────
function PreviewView({ entry, previewKey, position, vw, questionsOpen, onToggleQuestions, onBack, onPrev, onNext, onReset }) {
  const accent = (SUBJECTS[entry.subject] || SUBJECTS.History).accent
  const [renderError, setRenderError] = useState(null)

  // Fresh error state per component / per replay.
  useEffect(() => { setRenderError(null) }, [entry.id, previewKey])

  const onDone = () => {}  // previews never advance a real flow

  return (
    <div style={{ maxWidth: 420, margin: '0 auto', paddingBottom: 0 }}>
      {/* Control bar */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px',
        background: 'rgba(8,9,13,0.94)', backdropFilter: 'blur(8px)',
        borderBottom: `1px solid ${GENERAL.line.soft}`,
      }}>
        <button onClick={onBack} style={ctrlBtn}>‹ Index</button>
        <button onClick={onPrev} style={ctrlBtn} aria-label="Previous component">Prev</button>
        <button onClick={onNext} style={ctrlBtn} aria-label="Next component">Next</button>
        <button onClick={onReset} style={ctrlBtn} aria-label="Reset / replay preview">↻ Reset</button>
        <span style={{ ...mono, marginLeft: 'auto', fontSize: 11, color: GENERAL.slate }}>{position}</span>
      </div>

      {/* Review information panel */}
      <div style={{ padding: '14px 14px 0' }}>
        <div style={{
          background: GENERAL.backgroundSurface, border: `1px solid ${GENERAL.line.soft}`,
          borderLeft: `3px solid ${accent}`, borderRadius: 12, padding: '14px 15px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 10 }}>
            <span style={{ ...mono, fontSize: 17, fontWeight: 700 }}>{entry.name}</span>
            <StatusChip status={entry.status} />
          </div>
          <Field label="Pedagogical function" value={entry.function} />
          <Field label="Current known usage" value={entry.usage} />
          <Field label="Closest alternative" value={entry.alternative} />

          <button onClick={onToggleQuestions} style={{
            ...mono, fontSize: 12, fontWeight: 600, cursor: 'pointer', marginTop: 4,
            background: 'transparent', border: 'none', color: accent, padding: 0,
          }}>
            {questionsOpen ? '− Hide review questions' : '+ Review questions'}
          </button>
          {questionsOpen && (
            <ol style={{ ...mono, fontSize: 12.5, lineHeight: 1.55, color: GENERAL.slate, margin: '8px 0 2px', paddingLeft: 18 }}>
              {REVIEW_QUESTIONS.map((q, i) => <li key={i} style={{ marginBottom: 4 }}>{q}</li>)}
            </ol>
          )}
        </div>

        <div style={{ ...mono, fontSize: 11, color: GENERAL.slate, margin: '10px 2px 8px', display: 'flex', gap: 12 }}>
          <span>Viewport: <b style={{ color: vw >= 360 && vw <= 430 ? GENERAL.teal : GENERAL.coral }}>{vw}px</b></span>
          <span>Target ~390px</span>
        </div>
      </div>

      {/* Live component preview */}
      <PreviewFrame key={previewKey} entry={entry} onDone={onDone} onError={setRenderError} error={renderError} accent={accent} />
    </div>
  )
}

function Field({ label, value }) {
  return (
    <div style={{ marginBottom: 9 }}>
      <div style={{ ...mono, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: GENERAL.slate, marginBottom: 2 }}>{label}</div>
      <div style={{ ...mono, fontSize: 13, lineHeight: 1.5, color: GENERAL.softWhite }}>{value}</div>
    </div>
  )
}

// A small class error boundary so a single broken component can't blank the lab.
class RenderBoundary extends Component {
  constructor(props) { super(props); this.state = { err: null } }
  static getDerivedStateFromError(err) { return { err: err.message || String(err) } }
  componentDidCatch(err) { this.props.onError?.(err.message || String(err)) }
  componentDidUpdate(prev) { if (prev.resetKey !== this.props.resetKey && this.state.err) this.setState({ err: null }) }
  render() {
    if (this.state.err) {
      return (
        <div style={{ ...mono, padding: 20, color: GENERAL.error, fontSize: 13, lineHeight: 1.5 }}>
          <b>Component threw while rendering:</b>
          <pre style={{ whiteSpace: 'pre-wrap', marginTop: 8, color: GENERAL.slate, fontSize: 12 }}>{this.state.err}</pre>
        </div>
      )
    }
    return this.props.children
  }
}

function PreviewFrame({ entry, onDone, onError, accent }) {
  const fullbleed = entry.renderMode === 'fullbleed'

  // Full-bleed components render position:fixed inset:0 and own the whole
  // screen. We give them a bounded, relatively-positioned stage so they stay
  // inside the 420px review column instead of covering the info panel.
  if (fullbleed) {
    return (
      <div style={{
        position: 'relative', width: '100%', height: '78vh', marginTop: 12,
        border: `1px solid ${GENERAL.line.soft}`, borderTop: `2px solid ${accent}`,
        overflow: 'hidden', background: '#000',
      }}>
        {/* contain: position pins fixed descendants to this box, not the viewport */}
        <div style={{ position: 'absolute', inset: 0, contain: 'layout paint size', overflow: 'auto' }}>
          <RenderBoundary onError={onError} resetKey={entry.id}>
            {entry.render(entry.fixture, { onDone })}
          </RenderBoundary>
        </div>
      </div>
    )
  }

  // Inline blocks flow inside the normal content column.
  return (
    <div style={{ padding: '14px 14px 48px' }}>
      <div style={{
        background: GENERAL.backgroundSunken, border: `1px solid ${GENERAL.line.soft}`,
        borderTop: `2px solid ${accent}`, borderRadius: 12, padding: 14, overflowX: 'auto',
      }}>
        <RenderBoundary onError={onError} resetKey={entry.id}>
          {entry.render(entry.fixture, { onDone })}
        </RenderBoundary>
      </div>
    </div>
  )
}

const ctrlBtn = {
  ...mono, fontSize: 12, fontWeight: 600, cursor: 'pointer',
  background: 'transparent', color: GENERAL.softWhite,
  border: `1px solid ${GENERAL.line.strong}`, borderRadius: 8, padding: '5px 10px',
}

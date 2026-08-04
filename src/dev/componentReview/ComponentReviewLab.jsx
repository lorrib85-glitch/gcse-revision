// ─── Component Lab ───────────────────────────────────────────────────────────
//
// The chapter-building component library. Every item in it is a genuine
// selectable chapter authoring choice: one row per ACTIVE authoring entry,
// keyed `screen:<type>` / `block:<type>`, which is what an author writes.
//
// OWNER TOOL, SHIPPED IN EVERY BUILD. Reached via ?componentReview=true or the
// "Component review lab" card in the History browser. src/App.jsx lazy-imports
// it, so it is its own chunk that learners never download — which is not the
// same thing as being excluded from the production build. It changes no
// production content and writes no learner data.
//
// Three layers, and this file is the third:
//   1. src/data/generated/componentLabRegistry.js — every catalogue fact,
//      generated: name, contract, pedagogy, guidance, lifecycle, usage.
//   2. labAdapters.jsx — every preview fact, handwritten: JSX, fixtures,
//      render callbacks, modes and variants.
//   3. this shell — joins them by authoring key and authors nothing itself.
//
// The join is the enforcement point and it runs both ways: an adapter with no
// active projection row, or an active row with no adapter, fails
// tests/architecture/component-lab-authoring-coverage.test.js. There is no
// allowlist, and there is nothing here for a stale hand-written claim to hide
// in — the two the Phase 4 census found were both in prose this file no longer
// carries.
//
// Runtime and design-system components an author never selects are NOT here.
// They live on the System reference surface (?systemReference=true).
//
// Learner-state isolation: on mount it switches the storage active scope to an
// isolated 'devreview' namespace, so any component that logs a weakness on
// answer (SpotTheError, MisconceptionCheck, OrderedRouteTask, MatchingTask)
// writes to devreview::… keys — never guest::/uid:… learner data, and never
// anything that syncs to the cloud. The previous scope is restored on unmount.

import { useEffect, useMemo, useState } from 'react'
import { getActiveScope, setActiveScope } from '../../lib/storage.js'
import { SUBJECTS } from '../../constants/subjects.js'
import { GENERAL } from '../../constants/generalTheme.js'
import { COMPONENT_LAB_REGISTRY } from '../../data/generated/componentLabRegistry.js'
import { LAB_ADAPTERS, REVIEW_QUESTIONS } from './labAdapters.jsx'
import { PreviewModeTabs, PreviewSurface } from '../labShell.jsx'
import { ctrlBtn, exitToApp, mono } from '../labShellTokens.js'

const DEV_REVIEW_SCOPE = 'devreview'

// ─── Selections ──────────────────────────────────────────────────────────────
//
// One selection per active projection row joined to its adapter. Derived rows
// are deliberately absent: a derived route is the runtime presenting a choice
// the author already made, so it appears as a presentation inside its source
// selection rather than as a row of its own.
const SELECTIONS = Object.values(COMPONENT_LAB_REGISTRY)
  .filter(row => row.status === 'active' && LAB_ADAPTERS[row.key])
  .map(row => ({ ...row, adapter: LAB_ADAPTERS[row.key] }))

const INTERACTION_LABELS = {
  passive: 'Passive — reads or views',
  reveal: 'Reveal — actively explores but isn’t marked',
  assessed: 'Assessed — gives an answer that can be right or wrong',
  container: 'Container — classified by the blocks it holds',
}

const groupOf = selection => selection.pedagogy?.interaction ?? 'container'

// Filters are predicates over generated facts, never over a stored label. The
// two stale statuses the census found — "routed but unused" on a type with a
// real use, "one-off" on a type used eight times — were stored values that had
// gone out of date. A predicate cannot go out of date.
const FILTERS = [
  { id: 'all', label: 'All', match: () => true },
  { id: 'screens', label: 'Screens', match: s => s.level === 'screen' },
  { id: 'blocks', label: 'Blocks', match: s => s.level === 'block' },
  { id: 'unused', label: 'Unused', match: s => s.contentUsage.occurrences === 0 },
  { id: 'one-off', label: 'One-off', match: s => s.contentUsage.occurrences === 1 },
  { id: 'reviewing', label: 'Reviewing', match: s => s.lifecycle === 'reviewing' },
  { id: 'pending', label: 'Decision pending', match: s => s.decisionStatus === 'pending' },
]

const describeUsage = usage => {
  if (usage.occurrences === 0) return 'Not used by any content file yet'
  const uses = usage.occurrences === 1 ? '1 use' : `${usage.occurrences} uses`
  const files = usage.files === 1 ? '1 file' : `${usage.files} files`
  return `${uses} across ${files}`
}

export default function ComponentReviewLab() {
  // ── Learner-state isolation ────────────────────────────────────────────────
  useEffect(() => {
    const prev = getActiveScope()
    setActiveScope(DEV_REVIEW_SCOPE)
    return () => setActiveScope(prev)
  }, [])

  const [filter, setFilter] = useState('all')
  const [activeKey, setActiveKey] = useState(null)   // null = index view
  const [previewKey, setPreviewKey] = useState(0)    // bump to reset/replay a preview
  const [questionsOpen, setQuestionsOpen] = useState(false)
  // Full-bleed display mode lives here (not in PreviewView) so it survives
  // moving between selections — PreviewView remounts per selection.
  const [previewMode, setPreviewMode] = useState('actual')
  const [vw, setVw] = useState(typeof window !== 'undefined' ? window.innerWidth : 0)

  useEffect(() => {
    const onResize = () => setVw(window.innerWidth)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const filtered = useMemo(() => {
    const predicate = FILTERS.find(f => f.id === filter)?.match ?? (() => true)
    return SELECTIONS.filter(predicate)
  }, [filter])

  const activeIndex = filtered.findIndex(s => s.key === activeKey)
  const active = activeIndex >= 0 ? filtered[activeIndex] : null

  function openSelection(key) {
    setActiveKey(key)
    setPreviewKey(k => k + 1)
    setQuestionsOpen(false)
  }
  function step(delta) {
    if (activeIndex < 0) return
    openSelection(filtered[(activeIndex + delta + filtered.length) % filtered.length].key)
  }

  // If the open selection falls out of the current filter, drop back to index.
  useEffect(() => {
    if (activeKey && activeIndex < 0) setActiveKey(null)
  }, [activeKey, activeIndex])

  return (
    <div style={{ minHeight: '100vh', background: GENERAL.backgroundApp, color: GENERAL.softWhite }}>
      {active ? (
        <PreviewView
          key={active.key}
          selection={active}
          previewKey={previewKey}
          position={`${activeIndex + 1} / ${filtered.length}`}
          vw={vw}
          questionsOpen={questionsOpen}
          onToggleQuestions={() => setQuestionsOpen(o => !o)}
          previewMode={previewMode}
          onPreviewMode={setPreviewMode}
          onBack={() => setActiveKey(null)}
          onPrev={() => step(-1)}
          onNext={() => step(1)}
          onReset={() => setPreviewKey(k => k + 1)}
        />
      ) : (
        <IndexView filtered={filtered} filter={filter} onFilter={setFilter} onOpen={openSelection} />
      )}
    </div>
  )
}

// ─── Index view ──────────────────────────────────────────────────────────────
function IndexView({ filtered, filter, onFilter, onOpen }) {
  const groups = ['passive', 'reveal', 'assessed', 'container']
  return (
    <div style={{ maxWidth: 420, margin: '0 auto', padding: '20px 16px 64px' }}>
      <header style={{ marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ ...mono, fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: GENERAL.teal }}>
            Owner tool
          </div>
          <button onClick={exitToApp} style={{ ...ctrlBtn, flexShrink: 0 }}>Exit to app ✕</button>
        </div>
        <h1 style={{ ...mono, fontSize: 22, fontWeight: 700, margin: '4px 0 6px' }}>Component lab</h1>
        <p style={{ ...mono, fontSize: 13, lineHeight: 1.5, color: GENERAL.slate, margin: 0 }}>
          Every screen and block type you can author into a chapter, with realistic GCSE
          fixtures at ~390px. {SELECTIONS.length} choices. Nothing here changes production
          content or learner data.
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
        const rows = filtered.filter(s => groupOf(s) === group)
        if (!rows.length) return null
        return (
          <section key={group} style={{ marginBottom: 24 }}>
            <div style={{ ...mono, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: GENERAL.slate, marginBottom: 10 }}>
              {INTERACTION_LABELS[group]}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {rows.map(selection => {
                const accent = (SUBJECTS[selection.adapter.subject] || SUBJECTS.History).accent
                const extras = (selection.adapter.modes?.length ?? 0)
                  + (selection.adapter.variants?.length ?? 0)
                return (
                  <button key={selection.key} onClick={() => onOpen(selection.key)} style={{
                    ...mono, textAlign: 'left', cursor: 'pointer',
                    background: GENERAL.backgroundSurface, border: `1px solid ${GENERAL.line.soft}`,
                    borderRadius: 12, padding: '13px 14px', color: GENERAL.softWhite,
                    borderLeft: `3px solid ${accent}`,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 5 }}>
                      <span style={{ fontSize: 15, fontWeight: 700 }}>{selection.authoringName}</span>
                      <LevelChip level={selection.level} />
                    </div>
                    <code style={{ fontSize: 11.5, color: accent, display: 'block', marginBottom: 6 }}>{selection.key}</code>
                    {selection.bestUsedFor && (
                      <div style={{ fontSize: 12.5, lineHeight: 1.45, color: GENERAL.slate }}>{selection.bestUsedFor}</div>
                    )}
                    <div style={{ fontSize: 11, color: GENERAL.slate, marginTop: 7, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      <span>{describeUsage(selection.contentUsage)}</span>
                      {extras > 1 && <span style={{ color: accent }}>{extras} previews</span>}
                    </div>
                  </button>
                )
              })}
            </div>
          </section>
        )
      })}
    </div>
  )
}

function LevelChip({ level }) {
  const tone = level === 'screen' ? GENERAL.teal : GENERAL.slate
  return (
    <span style={{
      ...mono, fontSize: 10.5, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
      color: tone, border: `1px solid ${tone}`, borderRadius: 6, padding: '2px 7px', whiteSpace: 'nowrap',
    }}>
      {level}
    </span>
  )
}

// ─── Preview view ────────────────────────────────────────────────────────────
function PreviewView({ selection, previewKey, position, vw, questionsOpen, onToggleQuestions, previewMode, onPreviewMode, onBack, onPrev, onNext, onReset }) {
  const { adapter } = selection
  const accent = (SUBJECTS[adapter.subject] || SUBJECTS.History).accent

  // Modes, variants and presentations are all previews of one selection; the
  // difference is what they mean, not how they render. Modes are authoring
  // choices inside one contract, variants change no content, and a
  // presentation is a derived runtime route the author does not write.
  const previews = useMemo(() => [
    ...(adapter.modes ?? []).map(mode => ({ ...mode, kind: 'mode' })),
    ...(adapter.variants ?? []).map(variant => ({ ...variant, kind: 'variant' })),
    ...(adapter.presentations ?? []).map(presentation => ({
      ...presentation,
      id: presentation.key,
      label: COMPONENT_LAB_REGISTRY[presentation.key]?.authoringName ?? presentation.key,
      kind: 'presentation',
    })),
  ], [adapter])

  const [activePreviewId, setActivePreviewId] = useState(previews[0]?.id ?? null)
  const [renderError, setRenderError] = useState(null)
  const activePreview = previews.find(preview => preview.id === activePreviewId) ?? null
  const isFullbleed = (activePreview?.renderMode ?? adapter.renderMode) === 'fullbleed'

  useEffect(() => { setRenderError(null) }, [selection.key, activePreviewId, previewKey])

  const onDone = () => {}  // previews never advance a real flow

  return (
    <div style={{ maxWidth: 420, margin: '0 auto', paddingBottom: 0 }}>
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

      {/* Authoring panel. Every value here is read from the generated
          projection — the shell states no fact of its own. */}
      <div style={{ padding: '14px 14px 0' }}>
        <div style={{
          background: GENERAL.backgroundSurface, border: `1px solid ${GENERAL.line.soft}`,
          borderLeft: `3px solid ${accent}`, borderRadius: 12, padding: '14px 15px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 4 }}>
            <span style={{ ...mono, fontSize: 17, fontWeight: 700 }}>{selection.authoringName}</span>
            <LevelChip level={selection.level} />
          </div>
          <code style={{ ...mono, fontSize: 12, color: accent, display: 'block', marginBottom: 12 }}>{selection.key}</code>

          <Field label="Component" value={`${selection.componentName}${selection.handler ? ` · ${selection.handler}` : ''}`} />
          <Field label="Required data" value={describeContract(selection)} />
          <Field label="Pedagogy" value={describePedagogy(selection)} />
          <Field label="Continuation" value={selection.continuation === 'component' ? 'Component owns its own Continue' : 'Player owns the Continue'} />
          <Field label="Content usage" value={describeUsage(selection.contentUsage)} />
          {selection.useWhen && <Field label="Use when" value={selection.useWhen} />}
          {selection.doNotUseWhen && <Field label="Do not use when" value={selection.doNotUseWhen} />}
          {selection.chooseInstead && <Field label="Choose instead" value={selection.chooseInstead} />}
          <Field label="Lifecycle" value={`${selection.lifecycle} · contract ${selection.criticality}${selection.decisionStatus ? ` · decision ${selection.decisionStatus}` : ''}`} />

          <button onClick={onToggleQuestions} style={{
            ...mono, fontSize: 12, fontWeight: 600, cursor: 'pointer', marginTop: 4,
            background: 'transparent', border: 'none', color: accent, padding: 0,
          }}>
            {questionsOpen ? '− Hide review questions' : '+ Review questions'}
          </button>
          {questionsOpen && (
            <ol style={{ ...mono, fontSize: 12.5, lineHeight: 1.55, color: GENERAL.slate, margin: '8px 0 2px', paddingLeft: 18 }}>
              {REVIEW_QUESTIONS.map((question, i) => <li key={i} style={{ marginBottom: 4 }}>{question}</li>)}
            </ol>
          )}
        </div>

        {previews.length > 0 && (
          <div style={{ marginTop: 12 }}>
            <div style={{ ...mono, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: GENERAL.slate, margin: '0 2px 7px' }}>
              {previewGroupLabel(previews)}
            </div>
            <div role="tablist" aria-label={`${selection.authoringName} previews`} style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
              {previews.map(preview => {
                const selected = preview.id === activePreviewId
                return (
                  <button
                    key={preview.id}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    onClick={() => { setActivePreviewId(preview.id); setRenderError(null) }}
                    style={{
                      ...mono, fontSize: 11.5, fontWeight: 650, cursor: 'pointer',
                      minHeight: 34, padding: '6px 10px', borderRadius: 8,
                      border: `1px solid ${selected ? accent : GENERAL.line.strong}`,
                      background: selected ? `${accent}1F` : GENERAL.backgroundSurface,
                      color: selected ? accent : GENERAL.slate,
                    }}
                  >
                    {preview.label}
                  </button>
                )
              })}
            </div>
            {activePreview?.kind === 'presentation' && (
              <p style={{ ...mono, fontSize: 11, lineHeight: 1.45, color: GENERAL.coral, margin: '7px 2px 0' }}>
                Derived runtime route ({activePreview.id}) — the author writes {selection.key} and the
                runtime presents it this way. It is not a separate authoring choice.
              </p>
            )}
            {activePreview?.description && (
              <p style={{ ...mono, fontSize: 11.5, lineHeight: 1.45, color: GENERAL.slate, margin: '7px 2px 0' }}>
                {activePreview.description}
              </p>
            )}
          </div>
        )}

        <div style={{ ...mono, fontSize: 11, color: GENERAL.slate, margin: '10px 2px 8px', display: 'flex', gap: 12, alignItems: 'center' }}>
          <span>Viewport: <b style={{ color: vw >= 360 && vw <= 430 ? GENERAL.teal : GENERAL.coral }}>{vw}px</b></span>
          <span>Target ~390px</span>
        </div>

        {isFullbleed && (
          <div style={{ margin: '0 2px 8px' }}>
            <div style={{ ...mono, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: GENERAL.slate, marginBottom: 7 }}>
              Preview display
            </div>
            <PreviewModeTabs previewMode={previewMode} onPreviewMode={onPreviewMode} accent={accent} />
            <p style={{ ...mono, fontSize: 11.5, lineHeight: 1.45, color: GENERAL.slate, margin: '7px 0 0' }}>
              {previewMode === 'actual'
                ? 'Real 390px screen at 100% — scroll the frame to see the whole screen. Use this to compare typography.'
                : 'Whole screen scaled to ~78% so the full interaction fits at once. Smaller text here is preview scaling, not a token difference.'}
            </p>
          </div>
        )}
      </div>

      <PreviewFrame
        key={`${previewKey}:${activePreviewId ?? 'default'}`}
        selection={selection}
        preview={activePreview}
        previewMode={previewMode}
        onDone={onDone}
        onError={setRenderError}
        error={renderError}
        accent={accent}
      />
    </div>
  )
}

const previewGroupLabel = previews => {
  const kinds = new Set(previews.map(preview => preview.kind))
  if (kinds.has('mode')) return 'Authoring mode'
  if (kinds.size === 1 && kinds.has('presentation')) return 'Runtime presentation'
  return 'Preview variant'
}

function describeContract(selection) {
  const required = selection.required.map(requirement => `${requirement.path} (${requirement.kind})`)
  const anyOf = selection.requiredAny.map(alternatives =>
    `one of ${alternatives.map(alternative => `${alternative.path} (${alternative.kind})`).join(' / ')}`)
  const parts = [...required, ...anyOf]
  return parts.length ? parts.join('; ') : 'None — the type is complete without authored data'
}

function describePedagogy(selection) {
  if (!selection.pedagogy) {
    return `${selection.pedagogyExemption ?? 'unclassified'} — taken from the blocks it holds`
  }
  return `${selection.pedagogy.functions.join(', ')} · ${selection.pedagogy.interaction}`
}

function Field({ label, value }) {
  return (
    <div style={{ marginBottom: 9 }}>
      <div style={{ ...mono, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: GENERAL.slate, marginBottom: 2 }}>{label}</div>
      <div style={{ ...mono, fontSize: 13, lineHeight: 1.5, color: GENERAL.softWhite }}>{value}</div>
    </div>
  )
}

function PreviewFrame({ selection, preview, previewMode, onDone, onError, accent }) {
  const { adapter } = selection
  const renderMode = preview?.renderMode ?? adapter.renderMode
  const render = preview?.render ?? adapter.render
  const fixture = Object.prototype.hasOwnProperty.call(preview ?? {}, 'fixture')
    ? preview.fixture
    : adapter.fixture

  return (
    <PreviewSurface
      fullbleed={renderMode === 'fullbleed'}
      previewMode={previewMode}
      accent={accent}
      resetKey={`${selection.key}:${preview?.id ?? 'default'}`}
      onError={onError}
    >
      {render(fixture, { onDone })}
    </PreviewSurface>
  )
}

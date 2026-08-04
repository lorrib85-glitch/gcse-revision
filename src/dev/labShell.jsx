// ─── Owner-surface shell primitives ──────────────────────────────────────────
//
// Shared by the two owner surfaces — the Component Lab (?componentReview=true)
// and System reference (?systemReference=true). They answer different questions
// and have different populations, but a screen has to be framed identically on
// both or the 390px render pass means two different things depending on which
// surface you opened.
//
// Nothing here knows about authoring entries, catalogue records or reference
// items. It is framing only. The tokens it uses live in labShellTokens.js so
// this file exports components and nothing else.

import { Component } from 'react'
import { GENERAL } from '../constants/generalTheme.js'
import { FULLBLEED_PREVIEW_SCALE, FULLBLEED_PREVIEW_WIDTH, PREVIEW_MODES, mono } from './labShellTokens.js'

/** A small class error boundary so one broken component can't blank a surface. */
export class RenderBoundary extends Component {
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

/**
 * Full-screen components still lay themselves out at a genuine 390px mobile
 * viewport and 100dvh height, in both display modes.
 *  • 'fit'    scales the complete virtual screen down to 78% so bottom sheets,
 *             progress and Continue stay visible together in a short frame.
 *  • 'actual' keeps the screen at scale(1) and lets the frame scroll vertically,
 *             so title/intro typography reads at its true 390px size.
 * Either way a transform + contain on the inner box establishes a containing
 * block for the component's position:fixed shell, so its 100dvh layout is
 * captured before any scaling — the production component is never touched.
 *
 * Inline blocks flow directly in the normal content column: the surface must
 * not add a second card treatment around components that already own a frame.
 */
export function PreviewSurface({ fullbleed, previewMode, accent, resetKey, onError, children }) {
  if (!fullbleed) {
    return (
      <div style={{ padding: '14px 14px 48px', overflowX: 'auto' }}>
        <RenderBoundary onError={onError} resetKey={resetKey}>{children}</RenderBoundary>
      </div>
    )
  }

  const actual = previewMode === 'actual'
  const scale = actual ? 1 : FULLBLEED_PREVIEW_SCALE
  return (
    <div
      data-review-preview-mode={actual ? 'actual' : 'fit'}
      data-review-viewport-width={FULLBLEED_PREVIEW_WIDTH}
      data-review-viewport-scale={scale}
      style={{
        position: 'relative', width: '100%', height: '78dvh', marginTop: 12,
        display: 'flex', justifyContent: 'center', alignItems: 'flex-start',
        border: `1px solid ${GENERAL.line.soft}`, borderTop: `2px solid ${accent}`,
        overflowX: 'hidden', overflowY: actual ? 'auto' : 'hidden', background: '#000',
      }}
    >
      <div style={{
        position: 'relative', width: FULLBLEED_PREVIEW_WIDTH, height: '100dvh',
        flex: '0 0 auto', transform: `scale(${scale})`, transformOrigin: 'top center',
        contain: 'layout paint size', overflow: 'hidden',
      }}>
        <RenderBoundary onError={onError} resetKey={resetKey}>{children}</RenderBoundary>
      </div>
    </div>
  )
}

/** The shared display-mode toggle for a full-bleed preview. */
export function PreviewModeTabs({ previewMode, onPreviewMode, accent }) {
  return (
    <div role="tablist" aria-label="Preview display mode" style={{ display: 'flex', gap: 7 }}>
      {PREVIEW_MODES.map(mode => {
        const selected = mode.id === previewMode
        return (
          <button
            key={mode.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onPreviewMode(mode.id)}
            style={{
              ...mono, fontSize: 11.5, fontWeight: 650, cursor: 'pointer',
              minHeight: 34, padding: '6px 12px', borderRadius: 8,
              border: `1px solid ${selected ? accent : GENERAL.line.strong}`,
              background: selected ? `${accent}1F` : GENERAL.backgroundSurface,
              color: selected ? accent : GENERAL.slate,
            }}
          >
            {mode.label}
          </button>
        )
      })}
    </div>
  )
}

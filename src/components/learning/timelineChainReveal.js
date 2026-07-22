// Pure logic for the TimelineChain "reveal" variant — a passive, one-step-at-a-time
// vertical reveal. Kept separate from TimelineChain.jsx so it is unit-testable in a
// node environment; the .jsx is a thin renderer verified via Storybook.
//
// The reveal variant absorbs the useful behaviour of the former VisualNarrativeScreen:
// progressive reveal, a main statement with optional supporting explanation, inline
// highlighted phrases (structured, not HTML), numbered or icon markers, and a final
// takeaway. It is subject-agnostic — no history-specific styling or content lives here.

// A rich-text value is either a plain string or an array of segments. Each segment is
// { text, highlight? }. normalizeRichText always returns a segment array so the renderer
// never branches on the input shape and highlighting stays data-driven.
export function normalizeRichText(value) {
  if (value == null) return []
  if (typeof value === 'string') {
    return value === '' ? [] : [{ text: value, highlight: false }]
  }
  if (Array.isArray(value)) {
    return value
      .map(segment => (
        typeof segment === 'string'
          ? { text: segment, highlight: false }
          : { text: String(segment?.text ?? ''), highlight: Boolean(segment?.highlight) }
      ))
      .filter(segment => segment.text !== '')
  }
  return []
}

// Flatten a normalized segment array back to plain text — used for aria labels and
// accessible announcements.
export function segmentsToString(segments) {
  return segments.map(segment => segment.text).join('')
}

// Build the render model for a reveal-variant block. Assigns a 1-based numeric marker
// to every step and normalizes label/detail/takeaway rich text. A step keeps any
// supplied icon; the renderer shows the icon when present, otherwise the numeric marker.
// A reveal step's primary field is `statement` (a full sentence), deliberately NOT
// the heading key `label`: statements are body copy, not titles, so they must not be
// scanned by the sentence-case heading guard.
export function buildRevealModel(block = {}) {
  const steps = (block.steps || []).map((step, index) => ({
    id: step.id ?? `step-${index}`,
    marker: index + 1,
    icon: step.icon ?? null,
    statement: normalizeRichText(step.statement),
    detail: normalizeRichText(step.detail),
  }))

  return {
    title: block.title ?? null,
    intro: block.intro ?? null,
    source: block.source ?? null,
    steps,
    takeaway: normalizeRichText(block.takeaway),
  }
}

// The reveal starts with the first step visible (0 when there are no steps).
export function initialRevealCount(total) {
  return total > 0 ? 1 : 0
}

// One CTA press reveals exactly one additional step, never past the last.
export function nextRevealCount(current, total) {
  return Math.min(current + 1, total)
}

// Derive what the UI shows for a given visible count. `atEnd` means every step is
// revealed; only then does the takeaway show and the CTA switch from reveal → continue.
export function revealState({ total, visibleCount, hasTakeaway = false }) {
  const clamped = Math.max(0, Math.min(visibleCount, total))
  // An empty step list is trivially "at the end" so the CTA resolves to Continue
  // rather than a dead "Reveal next" that would soft-lock the screen.
  const atEnd = total === 0 || clamped >= total
  return {
    visibleCount: clamped,
    atEnd,
    showTakeaway: atEnd && hasTakeaway,
    cta: atEnd ? 'continue' : 'reveal',
  }
}

// ─── SpotTheError — pure scoring + evaluation logic ──────────────────────────
//
// All of SpotTheError's diagnosis is data-driven and side-effect free so it can
// be unit-tested without a browser. The component owns rendering and weakness
// logging; this file owns "was the selection/explanation/repair good enough?".
//
// No subject-specific knowledge lives here — every threshold and term list is
// authored on the block, never hardcoded to Biology.

export const DEFAULT_MIN_EXPLANATION = 12
export const DEFAULT_MIN_REPAIR = 10

// Split a statement into whitespace-delimited tokens, keeping each token's
// character span so an authored substring target can be mapped onto tokens.
export function tokenise(text) {
  const tokens = []
  const re = /\S+/g
  let m
  while ((m = re.exec(text || ''))) {
    tokens.push({ text: m[0], start: m.index, end: m.index + m[0].length })
  }
  return tokens
}

// Resolve the authored `errorTarget` substring to an inclusive token-index
// range { start, end }. Returns null when the target can't be located, so the
// component can fail safe rather than reward an unscorable selection.
export function resolveTargetRange(tokens, statement, errorTarget) {
  const needle = errorTarget || ''
  if (!needle || !statement) return null
  const charStart = statement.indexOf(needle)
  if (charStart === -1) return null
  const charEnd = charStart + needle.length

  let start = -1
  let end = -1
  tokens.forEach((tok, i) => {
    // Token overlaps the target character span.
    if (tok.end > charStart && tok.start < charEnd) {
      if (start === -1) start = i
      end = i
    }
  })
  return start === -1 ? null : { start, end }
}

// Enforce a single contiguous selection as the learner taps words.
//   • no selection → tapped word becomes the selection
//   • tap directly beside the range → extend by one word
//   • tap an endpoint of a multi-word range → shrink from that end
//   • tap the only selected word → clear
//   • tap an interior selected word → collapse to just that word
//   • tap a non-adjacent word → start a fresh single-word selection
// The returned range is always contiguous (or null), so the visible highlight
// and the scored phrase can never disagree.
export function nextContiguousSelection(current, index) {
  if (!current) return { start: index, end: index }
  const { start, end } = current
  const single = start === end

  if (index >= start && index <= end) {
    if (single) return null
    if (index === start) return { start: start + 1, end }
    if (index === end) return { start, end: end - 1 }
    return { start: index, end: index }
  }
  if (index === start - 1) return { start: index, end }
  if (index === end + 1) return { start, end: index }
  return { start: index, end: index }
}

export function selectionTokenText(tokens, selection) {
  if (!selection) return ''
  return tokens.slice(selection.start, selection.end + 1).map(t => t.text).join(' ')
}

export function targetTokenText(tokens, target) {
  if (!target) return ''
  return tokens.slice(target.start, target.end + 1).map(t => t.text).join(' ')
}

// A selection is correct when it covers (almost) the whole authored phrase
// without dragging in unrelated words. Single-word targets demand an exact
// hit; multi-word targets tolerate one missing/extra word so a natural phrase
// selection still counts. Selecting the whole sentence can never pass because
// `extra` blows past the allowance.
export function scoreSelection(selection, target) {
  if (!selection || !target) return false
  const interStart = Math.max(selection.start, target.start)
  const interEnd = Math.min(selection.end, target.end)
  const inter = Math.max(0, interEnd - interStart + 1)
  if (inter === 0) return false

  const targetLen = target.end - target.start + 1
  const selLen = selection.end - selection.start + 1
  const coverage = inter / targetLen
  const extra = selLen - inter

  const minCoverage = targetLen === 1 ? 1 : 0.8
  const maxExtra = targetLen === 1 ? 0 : 1
  return coverage >= minCoverage && extra <= maxExtra
}

function normalise(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function includesTerm(haystack, term) {
  const t = normalise(term)
  return t.length > 0 && normalise(haystack).includes(t)
}

// Resolve the authored explanation criteria, tolerating the legacy `keyTerms`
// array (treated as "any one of these terms").
function resolveExplanationCriteria(block) {
  if (block.explanationCriteria) return block.explanationCriteria
  if (Array.isArray(block.keyTerms) && block.keyTerms.length) {
    return { anyOf: block.keyTerms }
  }
  return null
}

// Evaluate the written explanation. `precise` gates on a length threshold AND
// authored terminology; `missing` reports which required idea was absent so the
// feedback can name it. With no authored criteria, terminology can't be judged
// and length alone decides completion (never correctness).
export function evaluateExplanation(text, block = {}) {
  const trimmed = String(text || '').trim()
  const minLength = block.minimumExplanationLength || DEFAULT_MIN_EXPLANATION
  const meetsLength = trimmed.length >= minLength

  const criteria = resolveExplanationCriteria(block)
  if (!criteria) {
    return { meetsLength, precise: meetsLength, missing: [] }
  }

  const missing = []
  let matchesTerms = true

  if (Array.isArray(criteria.anyOf) && criteria.anyOf.length) {
    const hit = criteria.anyOf.some(term => includesTerm(trimmed, term))
    if (!hit) {
      matchesTerms = false
      missing.push(criteria.anyOf[0])
    }
  }

  // allOf is an array of groups; each group needs at least one match.
  if (Array.isArray(criteria.allOf)) {
    for (const group of criteria.allOf) {
      const terms = Array.isArray(group) ? group : [group]
      const hit = terms.some(term => includesTerm(trimmed, term))
      if (!hit) {
        matchesTerms = false
        missing.push(terms[0])
      }
    }
  }

  return { meetsLength, precise: meetsLength && matchesTerms, missing }
}

// Evaluate the rewritten statement. Accuracy is driven by authored data:
// an accepted-rewrite list, a required-terms list, and/or a must-avoid list
// (typically the original wrong word). With no authored repair criteria,
// length is the completion bar and any sufficiently long rewrite is accepted.
export function evaluateRepair(text, block = {}) {
  const trimmed = String(text || '').trim()
  const minLength = block.minimumRepairLength || DEFAULT_MIN_REPAIR
  const meetsLength = trimmed.length >= minLength

  const acceptable = block.acceptableRepairs
  const required = block.repairKeyTerms
  const avoid = block.repairMustAvoid || []

  let matches = true
  if (Array.isArray(acceptable) && acceptable.length) {
    matches = acceptable.some(r => includesTerm(trimmed, r))
  } else if (Array.isArray(required) && required.length) {
    matches = required.every(t => includesTerm(trimmed, t))
  }

  const containsForbidden = Array.isArray(avoid) && avoid.some(t => includesTerm(trimmed, t))

  return { meetsLength, accurate: meetsLength && matches && !containsForbidden }
}

// Map the three independent outcomes to a specific, calm heading. Every
// combination resolves to exactly one line; the "completely incorrect" case
// can be overridden per-block via `missHeading`.
export function deriveFeedbackHeading({ selectionCorrect, explanationPrecise, repairAccurate, missHeading } = {}) {
  if (selectionCorrect && explanationPrecise && repairAccurate) {
    return 'You found it and fixed it.'
  }
  if (selectionCorrect && explanationPrecise && !repairAccurate) {
    return 'You diagnosed the problem, but the rewrite still needs fixing.'
  }
  if (selectionCorrect && !explanationPrecise) {
    return 'You found the right phrase.'
  }
  if (!selectionCorrect && explanationPrecise) {
    return 'Your explanation is heading in the right direction.'
  }
  return missHeading || 'Not quite — look again at what the statement claims.'
}

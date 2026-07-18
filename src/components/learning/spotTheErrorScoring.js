// ─── SpotTheError — pure scoring + evaluation logic ──────────────────────────
//
// All of SpotTheError's diagnosis is data-driven and side-effect free so it can
// be unit-tested without a browser. The component owns rendering and weakness
// logging; this file owns selection, explanation and missing-phrase scoring.
//
// No subject-specific knowledge lives here — every threshold and accepted answer
// is authored on the block, never hardcoded to Biology.

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
    if (tok.end > charStart && tok.start < charEnd) {
      if (start === -1) start = i
      end = i
    }
  })
  return start === -1 ? null : { start, end }
}

// Enforce a single contiguous selection as the learner taps words.
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
// without dragging in unrelated words. Single-word targets demand an exact hit.
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

export function normaliseAnswer(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function includesTerm(haystack, term) {
  const t = normaliseAnswer(term)
  return t.length > 0 && normaliseAnswer(haystack).includes(t)
}

function resolveExplanationCriteria(block) {
  if (block.explanationCriteria) return block.explanationCriteria
  if (Array.isArray(block.keyTerms) && block.keyTerms.length) {
    return { anyOf: block.keyTerms }
  }
  return null
}

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

// Legacy full-rewrite evaluator retained for already-authored consumers and
// tests. SpotTheError now uses `evaluateCorrection` for its compact phrase slot.
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

// Return the original sentence split around the one authored incorrect phrase.
// The UI places the compact repair input between `before` and `after`.
export function splitStatementAtTarget(statement, errorTarget) {
  const source = String(statement || '')
  const target = String(errorTarget || '')
  if (!source || !target) return null
  const index = source.indexOf(target)
  if (index === -1) return null
  return {
    before: source.slice(0, index),
    target,
    after: source.slice(index + target.length),
  }
}

// If a legacy block only provides a full correct sentence, derive the exact
// replacement phrase when the rest of the sentence is unchanged.
export function deriveCorrectionFromVersion(block = {}) {
  const parts = splitStatementAtTarget(block.statement, block.errorTarget)
  const correctVersion = String(block.correctVersion || '')
  if (!parts || !correctVersion) return ''
  if (!correctVersion.startsWith(parts.before) || !correctVersion.endsWith(parts.after)) return ''
  const end = parts.after ? correctVersion.length - parts.after.length : correctVersion.length
  return correctVersion.slice(parts.before.length, end).trim()
}

export function resolveCorrectionAnswers(block = {}) {
  const primary = String(
    block.correctionAnswer
      || deriveCorrectionFromVersion(block)
      || block.repairKeyTerms?.[0]
      || block.acceptableRepairs?.[0]
      || '',
  ).trim()

  const candidates = [
    primary,
    ...(Array.isArray(block.correctionAlternatives) ? block.correctionAlternatives : []),
  ]

  // Legacy phrase-oriented fields remain acceptable fallbacks, but a modern
  // `correctionAnswer` keeps the contract explicit and avoids full-sentence input.
  if (!block.correctionAnswer) {
    if (Array.isArray(block.repairKeyTerms)) candidates.push(...block.repairKeyTerms)
    if (Array.isArray(block.acceptableRepairs)) candidates.push(...block.acceptableRepairs)
  }

  const seen = new Set()
  return candidates
    .map(answer => String(answer || '').trim())
    .filter(Boolean)
    .filter(answer => {
      const key = normaliseAnswer(answer)
      if (!key || seen.has(key)) return false
      seen.add(key)
      return true
    })
}

// Score the compact missing-word/phrase input. Matching is deliberately exact
// after case, punctuation and whitespace normalisation; this is a precise phrase
// repair, not a second free-writing task.
export function evaluateCorrection(text, block = {}) {
  const trimmed = String(text || '').trim()
  const accepted = resolveCorrectionAnswers(block)
  const normalised = normaliseAnswer(trimmed)
  const accurate = Boolean(normalised) && accepted.some(answer => normaliseAnswer(answer) === normalised)
  return {
    meetsLength: normalised.length > 0,
    accurate,
    accepted,
    expected: accepted[0] || '',
  }
}

export function buildCorrectedVersion(block = {}, correction) {
  if (block.correctVersion) return block.correctVersion
  const parts = splitStatementAtTarget(block.statement, block.errorTarget)
  if (!parts) return block.statement || ''
  return `${parts.before}${correction || ''}${parts.after}`
}

// Phase one only judges whether the learner located and explained the error.
export function deriveDiagnosisHeading({ selectionCorrect, explanationPrecise, missHeading } = {}) {
  if (selectionCorrect && explanationPrecise) {
    return 'You spotted the mistake and explained it well.'
  }
  if (selectionCorrect) {
    return 'You found the right phrase.'
  }
  if (explanationPrecise) {
    return 'Your explanation is heading in the right direction.'
  }
  return missHeading || 'Not quite — look again at what the statement claims.'
}

export function deriveCorrectionHeading({ repairAccurate, repairMissHeading } = {}) {
  if (repairAccurate) return 'You fixed the answer.'
  return repairMissHeading || 'Not quite — here is the precise correction.'
}

// Retained for compatibility with any external callers using the original
// combined outcome helper.
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

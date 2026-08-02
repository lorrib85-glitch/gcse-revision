// ─── Component catalogue schema ────────────────────────────────────────────
//
// BUILD-TIME GOVERNANCE DATA. This directory is never imported by the learner
// runtime — `tests/architecture/component-catalogue-integrity.test.js` proves
// it. Records are plain serialisable objects: no React, no browser APIs, no
// production modules.
//
// One component's catalogue-level identity is authored in exactly one record
// under `records/`. `docs/components/COMPONENT_REGISTRY.md` is generated from
// those records and must not be hand-edited.
//
// What this schema deliberately does NOT own (Phase 1 boundary):
//   - authorable screen and block types  → `src/data/screenRegistry.js`
//   - pedagogical function tags          → `src/data/componentFunctions.js`
//   - Component Lab routing              → `src/dev/componentReview/**`
// Those stay where they are until the runtime-projection phase migrates them.
// Do not duplicate them here.

export const SECTIONS = ['core', 'learning', 'feedback', 'layout', 'feature', 'support']

// `reusable`         — an author picks this against other learning components.
// `runtime`          — the runtime places it; an author never selects it.
// `support`          — a primitive other components compose.
// `feature`          — an app-level feature component outside chapter authoring.
// `component-family` — a record whose identity is the family it owns.
export const KINDS = ['reusable', 'runtime', 'support', 'feature', 'component-family']

export const LIFECYCLES = ['active', 'reviewing', 'parked', 'internal']

export const CRITICALITIES = ['standard', 'critical']

export const RHYTHM_ROLES = [
  'opening', 'teaching', 'exploration', 'practice', 'retrieval', 'repair', 'closing',
]

export const DECISION_STATUSES = ['complete', 'pending', 'not-applicable']

export const EVIDENCE_KINDS = ['test', 'story', 'review']

// Statuses this model no longer has. A record may not reintroduce file-level
// locking under any spelling: a rule can be constitutional, a file cannot.
export const FORBIDDEN_STATUS_TOKENS = ['locked', 'ring-fenced', 'ring fenced']

const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/
const POSIX_SRC_PATH = /^[a-zA-Z0-9._\-/]+$/

const isPlainObject = value =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const isNonEmptyString = value => typeof value === 'string' && value.trim().length > 0

const isStringArray = value => Array.isArray(value) && value.every(isNonEmptyString)

function checkPath(errors, label, value) {
  if (!isNonEmptyString(value)) {
    errors.push(`${label} must be a non-empty string`)
    return
  }
  if (!POSIX_SRC_PATH.test(value) || value.includes('\\')) {
    errors.push(`${label} must be a repo-relative posix path (got "${value}")`)
  }
  if (value.startsWith('/') || value.startsWith('./')) {
    errors.push(`${label} must not be absolute or dot-prefixed (got "${value}")`)
  }
}

function validateEvidence(errors, label, evidence) {
  if (!Array.isArray(evidence) || evidence.length === 0) {
    errors.push(`${label} needs at least one evidence entry`)
    return
  }
  evidence.forEach((item, i) => {
    const at = `${label}[${i}]`
    if (!isPlainObject(item)) {
      errors.push(`${at} must be an object`)
      return
    }
    if (!EVIDENCE_KINDS.includes(item.kind)) {
      errors.push(`${at}.kind must be one of ${EVIDENCE_KINDS.join(' | ')}`)
    }
    // A reference has to be specific enough to act on: a path, or a concise
    // statement of what the reviewer must check. "Reviewed" is not evidence.
    if (!isNonEmptyString(item.reference) || item.reference.trim().length < 12) {
      errors.push(`${at}.reference must be a path or a concise review requirement`)
    }
  })
}

function validateOwnership(errors, ownership) {
  if (!isPlainObject(ownership)) {
    errors.push('ownership must be an object')
    return
  }
  for (const key of ['internalDirectories', 'internalFiles']) {
    const list = ownership[key]
    if (!Array.isArray(list)) {
      errors.push(`ownership.${key} must be an array`)
      continue
    }
    list.forEach((entry, i) => {
      const at = `ownership.${key}[${i}]`
      if (!isPlainObject(entry)) {
        errors.push(`${at} must be an object`)
        return
      }
      checkPath(errors, `${at}.path`, entry.path)
      // A reason short enough to be a label is not a reason.
      if (!isNonEmptyString(entry.reason) || entry.reason.trim().length < 40) {
        errors.push(`${at}.reason must explain why the path is private (40+ chars)`)
      }
    })
  }
}

function validateDocumentation(errors, documentation) {
  if (!isPlainObject(documentation)) {
    errors.push('documentation must be an object')
    return
  }
  const {
    bestUsedFor, props, dataShape, dependencies, usedBy,
    usageBoundary, contractDoc, story, governanceRules, notes,
  } = documentation

  for (const [label, value] of Object.entries({ bestUsedFor, dataShape, usageBoundary })) {
    if (value !== null && !isNonEmptyString(value)) {
      errors.push(`documentation.${label} must be a non-empty string or null`)
    }
  }
  for (const [label, value] of Object.entries({ props, dependencies, usedBy, governanceRules, notes })) {
    if (!isStringArray(value)) {
      errors.push(`documentation.${label} must be an array of non-empty strings`)
    }
  }
  for (const [label, value] of Object.entries({ contractDoc, story })) {
    if (value !== null) checkPath(errors, `documentation.${label}`, value)
  }
}

function validateDecision(errors, record) {
  const { decision, kind } = record

  if (decision === null) {
    // An author never chooses a runtime shell or a support primitive against a
    // learning component, so those legitimately carry no Decision block.
    if (kind === 'reusable') {
      errors.push('decision is required for kind "reusable" (use status "pending" if unsettled)')
    }
    return
  }
  if (!isPlainObject(decision)) {
    errors.push('decision must be an object or null')
    return
  }
  if (!DECISION_STATUSES.includes(decision.status)) {
    errors.push(`decision.status must be one of ${DECISION_STATUSES.join(' | ')}`)
    return
  }

  const fields = ['useWhen', 'doNotUseWhen', 'chooseInstead', 'contentShape']

  if (decision.status === 'complete') {
    for (const field of fields) {
      if (!isNonEmptyString(decision[field])) {
        errors.push(`decision.${field} is required when decision.status is "complete"`)
      }
    }
    if (!Array.isArray(decision.rhythmRole) || decision.rhythmRole.length === 0) {
      errors.push('decision.rhythmRole must name at least one rhythm role')
    } else {
      for (const role of decision.rhythmRole) {
        if (!RHYTHM_ROLES.includes(role)) {
          errors.push(`decision.rhythmRole "${role}" is not a registered rhythm role`)
        }
      }
    }
  } else {
    // Never silently drop a Decision block: say why it is absent.
    if (!isNonEmptyString(decision.note) || decision.note.trim().length < 20) {
      errors.push(`decision.note must explain why status is "${decision.status}" (20+ chars)`)
    }
    for (const field of fields) {
      if (decision[field] !== null && !isNonEmptyString(decision[field])) {
        errors.push(`decision.${field} must be a non-empty string or null`)
      }
    }
    if (!Array.isArray(decision.rhythmRole)) {
      errors.push('decision.rhythmRole must be an array')
    }
  }
}

function validateContract(errors, contract) {
  if (!isPlainObject(contract)) {
    errors.push('contract must be an object')
    return
  }
  const { criticality, rationale, invariants, exclusivity, requiresProductDecision } = contract

  if (!CRITICALITIES.includes(criticality)) {
    errors.push(`contract.criticality must be one of ${CRITICALITIES.join(' | ')}`)
    return
  }
  if (!isStringArray(requiresProductDecision)) {
    errors.push('contract.requiresProductDecision must be an array of non-empty strings')
  }
  if (!Array.isArray(invariants)) {
    errors.push('contract.invariants must be an array')
    return
  }

  if (criticality === 'standard') {
    // The standard shape is deliberately empty. A component that genuinely
    // needs an invariant or an exclusivity rule is critical — that is the
    // whole distinction.
    if (rationale !== null) errors.push('contract.rationale must be null when criticality is "standard"')
    if (invariants.length !== 0) errors.push('contract.invariants must be empty when criticality is "standard"')
    if (exclusivity !== null) errors.push('contract.exclusivity must be null when criticality is "standard"')
    if (requiresProductDecision.length !== 0) {
      errors.push('contract.requiresProductDecision must be empty when criticality is "standard"')
    }
    return
  }

  if (!isNonEmptyString(rationale) || rationale.trim().length < 40) {
    errors.push('contract.rationale must say why accidental change is costly (40+ chars)')
  }
  if (invariants.length === 0) {
    errors.push('contract.criticality "critical" requires at least one invariant')
  }
  if (requiresProductDecision.length === 0) {
    errors.push('contract.requiresProductDecision must name at least one change that needs a product decision')
  }

  const seen = new Set()
  invariants.forEach((invariant, i) => {
    const at = `contract.invariants[${i}]`
    if (!isPlainObject(invariant)) {
      errors.push(`${at} must be an object`)
      return
    }
    if (!isNonEmptyString(invariant.id) || !KEBAB.test(invariant.id)) {
      errors.push(`${at}.id must be a stable kebab-case id`)
    } else if (seen.has(invariant.id)) {
      errors.push(`${at}.id "${invariant.id}" is duplicated within this record`)
    } else {
      seen.add(invariant.id)
    }
    if (!isNonEmptyString(invariant.statement) || invariant.statement.trim().length < 20) {
      errors.push(`${at}.statement must state a precise behaviour or product rule (20+ chars)`)
    }
    validateEvidence(errors, `${at}.evidence`, invariant.evidence)
  })

  if (exclusivity !== null) {
    if (!isPlainObject(exclusivity)) {
      errors.push('contract.exclusivity must be an object or null')
      return
    }
    if (!isNonEmptyString(exclusivity.pattern) || !KEBAB.test(exclusivity.pattern)) {
      errors.push('contract.exclusivity.pattern must be a stable kebab-case pattern name')
    }
    if (exclusivity.soleImplementation !== true) {
      errors.push('contract.exclusivity.soleImplementation must be true')
    }
    if (!isStringArray(exclusivity.prohibitedAlternatives) || exclusivity.prohibitedAlternatives.length === 0) {
      errors.push('contract.exclusivity.prohibitedAlternatives must name at least one prohibited alternative')
    }
    validateEvidence(errors, 'contract.exclusivity.evidence', exclusivity.evidence)
  }
}

export const COMPONENT_ROOT = 'src/components/'

/**
 * Where a component lives is already stated by `source`, so the catalogue does
 * not repeat it. The only genuinely new fact is *why* a component outside
 * `src/components/**` is governed at all — that is `outOfRootReason`, and it
 * must be null for everything in the normal home.
 */
function validateOutOfRootReason(errors, record) {
  const { outOfRootReason, source } = record
  const inComponentRoot = typeof source === 'string' && source.startsWith(COMPONENT_ROOT)

  if (inComponentRoot) {
    if (outOfRootReason !== null) {
      errors.push(`outOfRootReason must be null for a component under ${COMPONENT_ROOT}`)
    }
    return
  }
  if (!isNonEmptyString(outOfRootReason) || outOfRootReason.trim().length < 40) {
    errors.push(`outOfRootReason must say why a component outside ${COMPONENT_ROOT} is governed (40+ chars)`)
  }
}

const REQUIRED_KEYS = [
  'id', 'name', 'source', 'exportName', 'order', 'outOfRootReason', 'section', 'kind',
  'lifecycle', 'lifecycleReason', 'purpose', 'ownership', 'documentation',
  'decision', 'contract',
]

/**
 * Validate one catalogue record. Returns an array of human-readable problems;
 * an empty array means the record is valid.
 */
export function validateRecord(record) {
  const errors = []

  if (!isPlainObject(record)) return ['record must be a plain object']

  for (const key of REQUIRED_KEYS) {
    if (!(key in record)) errors.push(`missing required key "${key}"`)
  }
  for (const key of Object.keys(record)) {
    if (!REQUIRED_KEYS.includes(key)) errors.push(`unknown key "${key}"`)
  }
  if (errors.length) return errors

  if (!isNonEmptyString(record.id) || !KEBAB.test(record.id)) {
    errors.push('id must be a stable kebab-case identifier')
  }
  if (!isNonEmptyString(record.name)) errors.push('name must be a non-empty string')
  checkPath(errors, 'source', record.source)
  if (record.exportName !== null && !isNonEmptyString(record.exportName)) {
    errors.push('exportName must be a named export string or null')
  }
  if (!Number.isInteger(record.order) || record.order < 1) {
    errors.push('order must be a positive integer')
  }
  if (!SECTIONS.includes(record.section)) {
    errors.push(`section must be one of ${SECTIONS.join(' | ')}`)
  }
  if (!KINDS.includes(record.kind)) {
    errors.push(`kind must be one of ${KINDS.join(' | ')}`)
  }
  if (!LIFECYCLES.includes(record.lifecycle)) {
    errors.push(`lifecycle must be one of ${LIFECYCLES.join(' | ')}`)
  } else if (record.lifecycle === 'reviewing' || record.lifecycle === 'parked') {
    if (!isNonEmptyString(record.lifecycleReason) || record.lifecycleReason.trim().length < 20) {
      errors.push(`lifecycle "${record.lifecycle}" requires a short lifecycleReason (20+ chars)`)
    }
  } else if (record.lifecycleReason !== null && !isNonEmptyString(record.lifecycleReason)) {
    errors.push('lifecycleReason must be a non-empty string or null')
  }
  if (!isNonEmptyString(record.purpose) || record.purpose.trim().length < 30) {
    errors.push('purpose must describe what the component is (30+ chars)')
  }

  validateOutOfRootReason(errors, record)
  validateOwnership(errors, record.ownership)
  validateDocumentation(errors, record.documentation)
  validateDecision(errors, record)
  validateContract(errors, record.contract)

  return errors
}

/**
 * The identity a `source` occupies. One file may carry two public records only
 * when they are distinct named exports (e.g. TimelineChain / TimelineChainBlock).
 */
export function sourceIdentity(record) {
  return `${record.source}#${record.exportName ?? 'default'}`
}

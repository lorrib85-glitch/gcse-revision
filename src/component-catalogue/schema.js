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
// Phase 2 moved authorable screen and block types here: a record's `authoring`
// block is the authority for the types its component implements, and
// `src/data/generated/componentAuthoringRegistry.js` is generated from it.
// Phase 3 moved pedagogical classification here too: every authoring entry
// carries a `pedagogy` block (functions + interaction), validated against
// `pedagogyVocabulary.js`, and `src/data/generated/componentPedagogyRegistry.js`
// is generated from those blocks plus the compatibility and non-authoring
// registries.
//
// What this schema still deliberately does NOT own:
//   - Component Lab routing              → `src/dev/componentReview/**`
// That stays where it is until its own phase migrates it. Do not duplicate it
// here.

import { FUNCTION_TAGS, INTERACTION_CLASSES } from './pedagogyVocabulary.js'

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

// ─── Authoring entries ─────────────────────────────────────────────────────
//
// An authoring entry says: this type may appear in a chapter `screens` array,
// and this component implements it. The runtime projection is generated from
// these; `src/data/screenRegistry.js` no longer authors them.
//
// `handler` is the honest part. Most entries leave it null, meaning the
// record's own component implements the type. A non-null handler names a
// function *private to the record's own source file* — the nine block types
// implemented inside ScreenRenderer.jsx are real authoring types whose
// implementation is deliberately not a standalone reusable component. Naming
// the private handler is truthful; inventing a component record for it is not.

export const AUTHORING_LEVELS = ['screen', 'block']
export const AUTHORING_STATUSES = ['active', 'derived', 'legacy']
export const AUTHORING_LAYOUTS = ['content', 'full']
export const AUTHORING_CONTINUATIONS = ['player', 'component']
export const AUTHORING_HEADER_MODES = ['standard', 'cinematic']
export const REQUIREMENT_KINDS = ['array', 'object', 'string', 'number']

const TYPE_NAME = /^[a-zA-Z][a-zA-Z0-9]*$/
const HANDLER_NAME = /^[A-Z][A-Za-z0-9]*$/

function validateRequirement(errors, at, requirement) {
  if (!isPlainObject(requirement)) {
    errors.push(`${at} must be an object`)
    return
  }
  if (!isNonEmptyString(requirement.path)) errors.push(`${at}.path must be a non-empty string`)
  if (!REQUIREMENT_KINDS.includes(requirement.kind)) {
    errors.push(`${at}.kind must be one of ${REQUIREMENT_KINDS.join(' | ')}`)
  }
  for (const key of Object.keys(requirement)) {
    if (key !== 'path' && key !== 'kind') errors.push(`${at} has unknown key "${key}"`)
  }
}

const AUTHORING_ENTRY_KEYS = [
  'type', 'level', 'authoringName', 'layout', 'status', 'replacement',
  'required', 'requiredAny', 'continuation', 'headerMode', 'handler', 'pedagogy',
]

// The one optional entry key. `pedagogyExemption` exists only for the narrow
// container-derived case; every other key — pedagogy included — is mandatory
// on every entry.
const OPTIONAL_AUTHORING_ENTRY_KEYS = ['pedagogyExemption']

/**
 * Pedagogical classification of one authoring entry. Every entry carries
 * exactly one — the only escape is the container-derived exemption below,
 * for an entry whose classification genuinely comes from the authoring
 * entries it contains (the entry must structurally require a `blocks` array
 * to qualify, so the exemption cannot spread to ordinary types).
 */
function validatePedagogy(errors, at, entry) {
  const { pedagogy, pedagogyExemption } = entry

  if (pedagogyExemption !== undefined) {
    if (!isPlainObject(pedagogyExemption)) {
      errors.push(`${at}.pedagogyExemption must be an object when present`)
      return
    }
    for (const key of Object.keys(pedagogyExemption)) {
      if (key !== 'kind' && key !== 'reason') errors.push(`${at}.pedagogyExemption has unknown key "${key}"`)
    }
    if (pedagogyExemption.kind !== 'container-derived') {
      errors.push(`${at}.pedagogyExemption.kind must be "container-derived" — no other exemption kind is governed`)
    }
    if (!isNonEmptyString(pedagogyExemption.reason) || pedagogyExemption.reason.trim().length < 30) {
      errors.push(`${at}.pedagogyExemption.reason must say why classification is delegated (30+ chars)`)
    }
    if (pedagogy !== null) {
      errors.push(`${at} carries a pedagogyExemption, so pedagogy must be null`)
    }
    const requiresBlocks = (entry.required ?? []).some(
      requirement => requirement?.path === 'blocks' && requirement?.kind === 'array',
    )
    if (entry.level !== 'screen' || !requiresBlocks) {
      errors.push(`${at}.pedagogyExemption is only valid on a screen entry that requires a blocks array — this entry does not delegate to contained entries`)
    }
    return
  }

  if (pedagogy === undefined) return // required-ness is enforced by the presence of the key in AUTHORING_ENTRY_KEYS
  if (pedagogy === null) {
    errors.push(`${at}.pedagogy may be null only with a container-derived pedagogyExemption`)
    return
  }
  if (!isPlainObject(pedagogy)) {
    errors.push(`${at}.pedagogy must be an object`)
    return
  }
  for (const key of Object.keys(pedagogy)) {
    if (key !== 'functions' && key !== 'interaction') errors.push(`${at}.pedagogy has unknown key "${key}"`)
  }
  if (!Array.isArray(pedagogy.functions) || pedagogy.functions.length === 0) {
    errors.push(`${at}.pedagogy.functions must name at least one function tag`)
  } else {
    const seen = new Set()
    for (const fn of pedagogy.functions) {
      if (!FUNCTION_TAGS.includes(fn)) errors.push(`${at}.pedagogy.functions "${fn}" is not in the canonical vocabulary`)
      if (seen.has(fn)) errors.push(`${at}.pedagogy.functions duplicates "${fn}"`)
      seen.add(fn)
    }
  }
  if (!INTERACTION_CLASSES.includes(pedagogy.interaction)) {
    errors.push(`${at}.pedagogy.interaction must be one of ${INTERACTION_CLASSES.join(' | ')}`)
  }
}

function validateAuthoringEntry(errors, at, entry) {
  if (!isPlainObject(entry)) {
    errors.push(`${at} must be an object`)
    return
  }
  for (const key of AUTHORING_ENTRY_KEYS) {
    if (!(key in entry)) errors.push(`${at} is missing required key "${key}"`)
  }
  for (const key of Object.keys(entry)) {
    if (!AUTHORING_ENTRY_KEYS.includes(key) && !OPTIONAL_AUTHORING_ENTRY_KEYS.includes(key)) {
      errors.push(`${at} has unknown key "${key}"`)
    }
  }
  validatePedagogy(errors, at, entry)

  if (!isNonEmptyString(entry.type) || !TYPE_NAME.test(entry.type)) {
    errors.push(`${at}.type must be the camelCase type authors write`)
  }
  if (!AUTHORING_LEVELS.includes(entry.level)) {
    errors.push(`${at}.level must be one of ${AUTHORING_LEVELS.join(' | ')}`)
  }
  if (!isNonEmptyString(entry.authoringName)) {
    errors.push(`${at}.authoringName must be the canonical name an author reads`)
  }
  if (!AUTHORING_LAYOUTS.includes(entry.layout)) {
    errors.push(`${at}.layout must be one of ${AUTHORING_LAYOUTS.join(' | ')}`)
  }
  if (!AUTHORING_STATUSES.includes(entry.status)) {
    errors.push(`${at}.status must be one of ${AUTHORING_STATUSES.join(' | ')}`)
  }
  if (!AUTHORING_CONTINUATIONS.includes(entry.continuation)) {
    errors.push(`${at}.continuation must be one of ${AUTHORING_CONTINUATIONS.join(' | ')}`)
  }
  if (!AUTHORING_HEADER_MODES.includes(entry.headerMode)) {
    errors.push(`${at}.headerMode must be one of ${AUTHORING_HEADER_MODES.join(' | ')}`)
  }

  // A legacy entry has to say what to author instead; nothing else may.
  if (entry.status === 'legacy') {
    if (!isNonEmptyString(entry.replacement)) {
      errors.push(`${at}.replacement must name the type to author instead when status is "legacy"`)
    }
  } else if (entry.replacement !== null) {
    errors.push(`${at}.replacement must be null unless status is "legacy"`)
  }

  if (entry.handler !== null && !HANDLER_NAME.test(entry.handler ?? '')) {
    errors.push(`${at}.handler must be null or the PascalCase name of a handler private to this record's source`)
  }

  for (const key of ['required', 'requiredAny']) {
    if (!Array.isArray(entry[key])) {
      errors.push(`${at}.${key} must be an array`)
      continue
    }
    entry[key].forEach((item, i) => {
      if (key === 'required') {
        validateRequirement(errors, `${at}.required[${i}]`, item)
        return
      }
      if (!Array.isArray(item) || item.length === 0) {
        errors.push(`${at}.requiredAny[${i}] must be a non-empty array of alternatives`)
        return
      }
      item.forEach((alt, j) => validateRequirement(errors, `${at}.requiredAny[${i}][${j}]`, alt))
    })
  }
}

function validateAuthoring(errors, record) {
  const { authoring } = record
  if (authoring === null) return

  if (!isPlainObject(authoring)) {
    errors.push('authoring must be an object or null')
    return
  }
  for (const key of Object.keys(authoring)) {
    if (key !== 'entries' && key !== 'nonAuthorableHandlers') {
      errors.push(`authoring has unknown key "${key}"`)
    }
  }
  if (!Array.isArray(authoring.entries) || authoring.entries.length === 0) {
    errors.push('authoring.entries must be a non-empty array (use authoring: null instead)')
    return
  }
  authoring.entries.forEach((entry, i) =>
    validateAuthoringEntry(errors, `authoring.entries[${i}]`, entry))

  const seen = new Set()
  for (const entry of authoring.entries) {
    const key = `${entry.level}:${entry.type}`
    if (seen.has(key)) errors.push(`authoring.entries declares ${key} twice in one record`)
    seen.add(key)
  }

  // Only a record that owns private handlers may declare which of them are
  // deliberately not authorable — it is the same file's internal surface.
  const nonAuthorable = authoring.nonAuthorableHandlers ?? []
  if (!Array.isArray(nonAuthorable)) {
    errors.push('authoring.nonAuthorableHandlers must be an array')
    return
  }
  nonAuthorable.forEach((item, i) => {
    const at = `authoring.nonAuthorableHandlers[${i}]`
    if (!isPlainObject(item)) {
      errors.push(`${at} must be an object`)
      return
    }
    if (!HANDLER_NAME.test(item.name ?? '')) errors.push(`${at}.name must be a PascalCase handler name`)
    if (!isNonEmptyString(item.reason) || item.reason.trim().length < 30) {
      errors.push(`${at}.reason must say why the handler is not authorable (30+ chars)`)
    }
  })
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
  'decision', 'contract', 'authoring',
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
  validateAuthoring(errors, record)

  return errors
}

/**
 * The identity a `source` occupies. One file may carry two public records only
 * when they are distinct named exports (e.g. TimelineChain / TimelineChainBlock).
 */
export function sourceIdentity(record) {
  return `${record.source}#${record.exportName ?? 'default'}`
}

// Canonical chapter-progress keys and pure migration helpers.
//
// One learner-facing chapter is stored under gcse_chapter_<chapterId>. The
// previous gcse_module_<chapterId> keys remain readable during the migration
// window, but every merged result and every new write uses the chapter prefix.

export const CHAPTER_PROGRESS_KEY_PREFIX = 'gcse_chapter_'
export const LEGACY_CHAPTER_PROGRESS_KEY_PREFIX = 'gcse_module_'

export const LEGACY_CHAPTER_ID_MAP = Object.freeze({
  mod2: 'history-medicine-renaissance-medicine',
  mod3: 'history-medicine-surgery-anaesthetics',
  mod6: 'history-medicine-surgery-revolution',
  mod7: 'history-medicine-accidental-miracle',
  mod8: 'history-medicine-modern-medicine',
  mod9: 'history-medicine-cancer',
})

const LEGACY_IDS_BY_CANONICAL = Object.entries(LEGACY_CHAPTER_ID_MAP)
  .reduce((map, [legacyId, canonicalId]) => {
    if (!map[canonicalId]) map[canonicalId] = []
    map[canonicalId].push(legacyId)
    return map
  }, {})

export function canonicalChapterId(chapterId) {
  return LEGACY_CHAPTER_ID_MAP[chapterId] || chapterId
}

export function chapterProgressKey(chapterId) {
  return CHAPTER_PROGRESS_KEY_PREFIX + canonicalChapterId(chapterId)
}

export function legacyChapterProgressKey(chapterId) {
  return LEGACY_CHAPTER_PROGRESS_KEY_PREFIX + chapterId
}

export function chapterProgressKeyInfo(key) {
  let prefix
  let rawId
  if (key.startsWith(CHAPTER_PROGRESS_KEY_PREFIX)) {
    prefix = CHAPTER_PROGRESS_KEY_PREFIX
    rawId = key.slice(prefix.length)
  } else if (key.startsWith(LEGACY_CHAPTER_PROGRESS_KEY_PREFIX)) {
    prefix = LEGACY_CHAPTER_PROGRESS_KEY_PREFIX
    rawId = key.slice(prefix.length)
  } else {
    return null
  }

  const canonicalId = canonicalChapterId(rawId)
  const targetKey = CHAPTER_PROGRESS_KEY_PREFIX + canonicalId
  const isCanonical = key === targetKey
  const priority = isCanonical
    ? 3
    : prefix === CHAPTER_PROGRESS_KEY_PREFIX
      ? 2
      : rawId === canonicalId
        ? 1
        : 0

  return { key, prefix, rawId, canonicalId, targetKey, isCanonical, priority }
}

export function isChapterProgressKey(key) {
  return chapterProgressKeyInfo(key) !== null
}

export function chapterProgressSourceKeys(chapterId) {
  const canonicalId = canonicalChapterId(chapterId)
  const legacyIds = LEGACY_IDS_BY_CANONICAL[canonicalId] || []
  return [
    CHAPTER_PROGRESS_KEY_PREFIX + canonicalId,
    ...legacyIds.map(id => CHAPTER_PROGRESS_KEY_PREFIX + id),
    LEGACY_CHAPTER_PROGRESS_KEY_PREFIX + canonicalId,
    ...legacyIds.map(id => LEGACY_CHAPTER_PROGRESS_KEY_PREFIX + id),
  ]
}

function mergeBooleanField(merged, primary, secondary, field) {
  if (primary?.[field] !== undefined || secondary?.[field] !== undefined) {
    merged[field] = Boolean(primary?.[field] || secondary?.[field])
  }
}

function dedupeExact(entries) {
  const seen = new Set()
  const result = []
  for (const entry of entries) {
    const identity = JSON.stringify(entry)
    if (seen.has(identity)) continue
    seen.add(identity)
    result.push(entry)
  }
  return result
}

// Monotonic merge for two copies of the same chapter state. The primary state
// wins unknown-field ties, while progress-bearing fields can never rewind.
// Fields are only synthesised when at least one source actually contains them.
export function mergeChapterState(primary, secondary) {
  if (primary == null) return secondary ?? null
  if (secondary == null) return primary

  const merged = { ...secondary, ...primary }

  if (primary.screen !== undefined || secondary.screen !== undefined) {
    merged.screen = Math.max(Number(primary.screen) || 0, Number(secondary.screen) || 0)
  }

  for (const field of [
    'completed',
    'hookDone',
    'wylDone',
    'recallDone',
    'introDone',
  ]) {
    mergeBooleanField(merged, primary, secondary, field)
  }

  if (primary.timestamp !== undefined || secondary.timestamp !== undefined) {
    merged.timestamp = Math.max(Number(primary.timestamp) || 0, Number(secondary.timestamp) || 0)
  }

  if (primary.examinerAttempts !== undefined || secondary.examinerAttempts !== undefined) {
    merged.examinerAttempts = dedupeExact([
      ...(Array.isArray(primary.examinerAttempts) ? primary.examinerAttempts : []),
      ...(Array.isArray(secondary.examinerAttempts) ? secondary.examinerAttempts : []),
    ])
  }

  return merged
}

// Converts a storage/sync data map to canonical chapter keys. If several old
// and new copies exist, they are folded into exactly one monotonic state.
export function canonicalizeChapterProgressData(data) {
  const source = data || {}
  const result = {}
  const grouped = new Map()

  for (const [key, value] of Object.entries(source)) {
    const info = chapterProgressKeyInfo(key)
    if (!info) {
      result[key] = value
      continue
    }
    if (!grouped.has(info.targetKey)) grouped.set(info.targetKey, [])
    grouped.get(info.targetKey).push({ info, value })
  }

  for (const [targetKey, entries] of grouped) {
    entries.sort((a, b) => a.info.priority - b.info.priority)
    let state = null
    for (const entry of entries) {
      // Higher-priority entries are processed later and become primary.
      state = mergeChapterState(entry.value, state)
    }
    if (state !== null && state !== undefined) result[targetKey] = state
  }

  return result
}

export function hasNonCanonicalChapterProgressKeys(data) {
  return Object.keys(data || {}).some(key => {
    const info = chapterProgressKeyInfo(key)
    return info && !info.isCanonical
  })
}

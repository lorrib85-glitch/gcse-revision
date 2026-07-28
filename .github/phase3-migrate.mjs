import { readFileSync, writeFileSync, existsSync } from 'node:fs'

function read(path) {
  if (!existsSync(path)) throw new Error(`Missing file: ${path}`)
  return readFileSync(path, 'utf8')
}

function write(path, content) {
  writeFileSync(path, content)
}

function replaceExact(path, from, to, expected = 1) {
  const source = read(path)
  const count = source.split(from).length - 1
  if (count !== expected) {
    throw new Error(`${path}: expected ${expected} exact matches, found ${count}\n${from.slice(0, 180)}`)
  }
  write(path, source.split(from).join(to))
}

function replaceAllChecked(path, from, to, minimum = 1) {
  const source = read(path)
  const count = source.split(from).length - 1
  if (count < minimum) {
    throw new Error(`${path}: expected at least ${minimum} matches, found ${count}: ${from}`)
  }
  write(path, source.split(from).join(to))
}

function replaceRegex(path, pattern, to, expected = 1) {
  const source = read(path)
  const matches = [...source.matchAll(pattern)]
  if (matches.length !== expected) {
    throw new Error(`${path}: expected ${expected} regex matches, found ${matches.length}: ${pattern}`)
  }
  write(path, source.replace(pattern, to))
}

write('src/data/chapterProgress.js', `// Canonical chapter-progress keys and pure migration helpers.
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
`)

write('src/data/progressSync/canonicalProgressMerge.js', `// Canonical progress-snapshot merge.
//
// The existing merge engine still owns every non-chapter progress structure.
// This wrapper normalises old gcse_module_* keys first, then merges chapter
// state with the same monotonic contract used by local persistence.

import {
  mergeProgressData as mergeExistingProgressData,
  progressDataEqual,
} from './progressMerge.js'
import {
  canonicalizeChapterProgressData,
  isChapterProgressKey,
  mergeChapterState,
} from '../chapterProgress.js'

function splitProgressData(data) {
  const chapter = {}
  const other = {}
  for (const [key, value] of Object.entries(canonicalizeChapterProgressData(data))) {
    if (isChapterProgressKey(key)) chapter[key] = value
    else other[key] = value
  }
  return { chapter, other }
}

export function mergeProgressData(localData, cloudData, options = {}) {
  const local = splitProgressData(localData)
  const cloud = splitProgressData(cloudData)
  const merged = mergeExistingProgressData(local.other, cloud.other, options)

  const chapterKeys = new Set([
    ...Object.keys(local.chapter),
    ...Object.keys(cloud.chapter),
  ])
  for (const key of chapterKeys) {
    merged[key] = mergeChapterState(local.chapter[key], cloud.chapter[key])
  }

  return merged
}

export { progressDataEqual }
`)

replaceExact(
  'src/progress.js',
  "import { getJson, getObject, getArray, setJson, saveCritical, removeKey } from './lib/storage.js'\n",
  "import { getJson, getObject, getArray, setJson, saveCritical, removeKey } from './lib/storage.js'\nimport {\n  chapterProgressKey,\n  chapterProgressSourceKeys,\n  mergeChapterState,\n} from './data/chapterProgress.js'\n",
)

replaceRegex(
  'src/progress.js',
  /\/\/ ─── Legacy per-chapter screen progress names ─[\s\S]*?\/\/ ─── Chapter discovery ─/,
  `// ─── Per-chapter screen progress ───────────────────────────────────
// Canonical state lives under gcse_chapter_<id>. Reads fold any older
// gcse_module_<id> or legacy-id copies forward without losing monotonic state.

function readChapterSources(chapterId) {
  const canonicalKey = chapterProgressKey(chapterId)
  const found = []
  let state = null

  for (const key of chapterProgressSourceKeys(chapterId)) {
    const value = getJson(key, undefined)
    if (value === undefined) continue
    found.push(key)
    // The canonical copy is read first and remains primary for unknown fields.
    state = mergeChapterState(state, value)
  }

  return { canonicalKey, found, state: state || {} }
}

function removeMigratedChapterSources(canonicalKey, sourceKeys) {
  for (const key of sourceKeys) {
    if (key !== canonicalKey) removeKey(key)
  }
}

export function getChapterState(chapterId) {
  const { canonicalKey, found, state } = readChapterSources(chapterId)
  const needsMigration = found.some(key => key !== canonicalKey)

  if (needsMigration) {
    const migrated = setJson(canonicalKey, state)
    if (migrated) removeMigratedChapterSources(canonicalKey, found)
  }

  return state
}

export function saveChapterState(chapterId, state) {
  const { canonicalKey, found } = readChapterSources(chapterId)
  // Do not merge the existing canonical copy into a normal save: reviewing a
  // completed chapter may deliberately move its resume screen backwards while
  // retaining completed: true. Only fold still-unmigrated fallback copies in.
  const fallbackKeys = found.filter(key => key !== canonicalKey)
  let nextState = state
  for (const key of fallbackKeys) {
    nextState = mergeChapterState(nextState, getJson(key, undefined))
  }

  const saved = saveCritical(canonicalKey, nextState)
  if (saved) removeMigratedChapterSources(canonicalKey, fallbackKeys)
  return saved
}

export function getChapterPct(chapter) {
  if (!chapter || !chapter.screenCount) return 0
  const state = getChapterState(chapter.id)
  if (state.completed) return 100
  const screen = state.screen || 0
  return Math.min(100, Math.round((screen / chapter.screenCount) * 100))
}

// Temporary compatibility aliases. They execute the canonical chapter-key
// implementation, so even untouched Phase 4 runtime callers now write only
// gcse_chapter_* keys.
export const getModuleState = getChapterState
export const saveModuleState = saveChapterState
export const getModulePct = getChapterPct

// ─── Chapter discovery ─`,
)

replaceAllChecked('src/progress.js', 'getModulePct(chapter)', 'getChapterPct(chapter)', 2)

replaceRegex(
  'src/progress.js',
  /\n\/\/ ─── Legacy module ID migration shim ─[\s\S]*$/,
  '\n',
)

replaceExact(
  'src/data/progressSync/progressSync.js',
  "import { getJsonForScope, setJsonForScope, listKeysForScope, getRawJson, scopeForUser, GUEST_SCOPE } from '../../lib/storage.js'\n",
  "import { getJsonForScope, setJsonForScope, removeKeyForScope, listKeysForScope, getRawJson, scopeForUser, GUEST_SCOPE } from '../../lib/storage.js'\n",
)
replaceExact(
  'src/data/progressSync/progressSync.js',
  "import { mergeProgressData, progressDataEqual } from './progressMerge.js'\n",
  "import { mergeProgressData, progressDataEqual } from './canonicalProgressMerge.js'\n",
)
replaceExact(
  'src/data/progressSync/progressSync.js',
  "import { compactSnapshotForBudget } from './snapshotBudget.js'\n",
  "import { compactSnapshotForBudget } from './snapshotBudget.js'\nimport {\n  CHAPTER_PROGRESS_KEY_PREFIX,\n  LEGACY_CHAPTER_PROGRESS_KEY_PREFIX,\n  canonicalizeChapterProgressData,\n  chapterProgressKeyInfo,\n  hasNonCanonicalChapterProgressKeys,\n} from '../chapterProgress.js'\n",
)
replaceExact(
  'src/data/progressSync/progressSync.js',
  "export const DYNAMIC_KEY_PREFIXES = ['gcse_module_']",
  "export const DYNAMIC_KEY_PREFIXES = [CHAPTER_PROGRESS_KEY_PREFIX, LEGACY_CHAPTER_PROGRESS_KEY_PREFIX]",
)

replaceRegex(
  'src/data/progressSync/progressSync.js',
  /export function collectLocalProgressSnapshot\(scope = GUEST_SCOPE\) \{[\s\S]*?return \{ version: SNAPSHOT_VERSION, updatedAt: Date\.now\(\), data \}\n\}/,
  `export function collectLocalProgressSnapshot(scope = GUEST_SCOPE) {
  const rawData = {}
  const keys = [
    ...STATIC_PROGRESS_KEYS,
    ...DYNAMIC_KEY_PREFIXES.flatMap(prefix => listKeysForScope(scope, prefix)),
  ]
  for (const key of keys) {
    const value = getJsonForScope(scope, key, undefined)
    if (value !== undefined) rawData[key] = value
  }

  const data = canonicalizeChapterProgressData(rawData)

  // Migrate the scoped local copy opportunistically. A failed canonical write
  // never deletes its fallback, while the in-memory snapshot can still be
  // backed up safely under canonical keys.
  for (const [targetKey, value] of Object.entries(data)) {
    const sourceKeys = Object.keys(rawData).filter(key => {
      const info = chapterProgressKeyInfo(key)
      return info?.targetKey === targetKey && key !== targetKey
    })
    if (sourceKeys.length === 0) continue
    if (setJsonForScope(scope, targetKey, value)) {
      for (const key of sourceKeys) removeKeyForScope(scope, key)
    }
  }

  return { version: SNAPSHOT_VERSION, updatedAt: Date.now(), data }
}`,
)

replaceRegex(
  'src/data/progressSync/progressSync.js',
  /export function applyProgressSnapshot\(snapshot, \{ currentUid, scope = GUEST_SCOPE \} = \{\}\) \{[\s\S]*?return applied\n\}/,
  `export function applyProgressSnapshot(snapshot, { currentUid, scope = GUEST_SCOPE } = {}) {
  const rawData = snapshot?.data
  if (!rawData || typeof rawData !== 'object') return 0
  const data = canonicalizeChapterProgressData(rawData)
  let applied = 0

  for (const [key, value] of Object.entries(data)) {
    if (key === SYNC_META_KEY) continue
    if (key === 'riseUser' && currentUid) {
      // riseUser is the single global identity pointer (never scoped — see
      // storage.js). Two guards, both required: never adopt a snapshot
      // profile for a different account, and never overwrite whichever
      // account is actually signed in now if a stale reconcile completes.
      if (value?.uid && value.uid !== currentUid) continue
      const activeRiseUser = getRawJson('riseUser', null)
      if (activeRiseUser?.uid && activeRiseUser.uid !== currentUid) continue
    }

    const written = setJsonForScope(scope, key, value)
    if (!written) continue
    applied++

    const info = chapterProgressKeyInfo(key)
    if (!info) continue
    for (const prefix of DYNAMIC_KEY_PREFIXES) {
      for (const sourceKey of listKeysForScope(scope, prefix)) {
        const sourceInfo = chapterProgressKeyInfo(sourceKey)
        if (sourceInfo?.targetKey === key && sourceKey !== key) {
          removeKeyForScope(scope, sourceKey)
        }
      }
    }
  }

  return applied
}`,
)

replaceExact(
  'src/data/progressSync/progressSync.js',
  "  const cloud = await loadCloudProgress(user.uid)\n  const local = collectLocalProgressSnapshot(scope)\n",
  "  const cloud = await loadCloudProgress(user.uid)\n  const local = collectLocalProgressSnapshot(scope)\n  const cloudNeedsChapterMigration = Boolean(cloud && hasNonCanonicalChapterProgressKeys(cloud.data))\n",
)
replaceExact(
  'src/data/progressSync/progressSync.js',
  "  if (action === 'none') {\n",
  "  if (action === 'none' && !cloudNeedsChapterMigration) {\n",
)
replaceExact(
  'src/data/progressSync/progressSync.js',
  "  if (action === 'apply' || action === 'merge' || budget.compacted) {\n",
  "  if (action === 'apply' || action === 'merge' || cloudNeedsChapterMigration || budget.compacted) {\n",
)
replaceExact(
  'src/data/progressSync/progressSync.js',
  "  if (action === 'upload' || action === 'merge') {\n",
  "  if (action === 'upload' || action === 'merge' || cloudNeedsChapterMigration) {\n",
)

replaceExact(
  'src/data/progressSync/accountScope.js',
  "import { mergeProgressData } from './progressMerge.js'",
  "import { mergeProgressData } from './canonicalProgressMerge.js'",
)

replaceExact(
  'src/todaysPlan.js',
  "import { getModuleState, getInProgressChapter, todayStr, getScores } from './progress.js'",
  "import { getChapterState, getInProgressChapter, todayStr, getScores } from './progress.js'",
)
replaceAllChecked('src/todaysPlan.js', 'getModuleState(', 'getChapterState(', 1)
replaceExact(
  'src/todaysPlan.js',
  "reason: `${remaining} screen${remaining === 1 ? '' : 's'} left in this module.`,",
  "reason: `${remaining} screen${remaining === 1 ? '' : 's'} left in this chapter.`,",
)

replaceExact(
  'src/app/LegacyApp.jsx',
  "import { getProgress, recordActivity, getModuleState as safeGetModuleState, saveModuleState, getContinueModule } from '../progress.js'",
  "import { getProgress, recordActivity, getChapterState as safeGetChapterState, saveChapterState, getContinueChapter } from '../progress.js'",
)
replaceAllChecked('src/app/LegacyApp.jsx', 'safeGetModuleState', 'safeGetChapterState', 1)
replaceAllChecked('src/app/LegacyApp.jsx', 'saveModuleState', 'saveChapterState', 1)
replaceAllChecked('src/app/LegacyApp.jsx', 'getContinueModule', 'getContinueChapter', 1)

replaceExact(
  'src/components/layout/ModulePlayer.jsx',
  "import { recordActivity, MODULE_GROUPS, getModuleState, saveModuleState } from '../../progress.js'",
  "import { recordActivity, getChapterState, saveChapterState } from '../../progress.js'\nimport { MODULES } from '../../data/modules.js'",
)
replaceAllChecked('src/components/layout/ModulePlayer.jsx', 'getModuleState', 'getChapterState', 2)
replaceAllChecked('src/components/layout/ModulePlayer.jsx', 'saveModuleState', 'saveChapterState', 3)
replaceAllChecked('src/components/layout/ModulePlayer.jsx', 'MODULE_GROUPS', 'MODULES', 1)
replaceExact(
  'src/components/layout/ModulePlayer.jsx',
  '// We persist these inside the module state so resuming skips them correctly.',
  '// We persist these inside the chapter state so resuming skips them correctly.',
)

replaceExact(
  'src/features/subjects/Subjects.jsx',
  "import { MODULES, getModuleAvailability, MODULE_AVAILABILITY } from '../../modules.js'\nimport { getModuleState as safeGetModuleState, getModulePct as modPct, getContinueModule } from '../../progress.js'",
  "import { CHAPTERS, getChapterAvailability, CHAPTER_AVAILABILITY } from '../../chapters.js'\nimport { getChapterState as safeGetChapterState, getChapterPct as chapterPct, getContinueChapter } from '../../progress.js'",
)
replaceExact(
  'src/features/subjects/Subjects.jsx',
  "import { findTaggedScreen } from '../../data/tagModuleMap.js'",
  "import { findTaggedChapterScreen } from '../../data/tagChapterMap.js'",
)
for (const [from, to] of [
  ['MODULES', 'CHAPTERS'],
  ['getModuleAvailability', 'getChapterAvailability'],
  ['MODULE_AVAILABILITY', 'CHAPTER_AVAILABILITY'],
  ['safeGetModuleState', 'safeGetChapterState'],
  ['modPct', 'chapterPct'],
  ['getContinueModule', 'getContinueChapter'],
  ['findTaggedScreen', 'findTaggedChapterScreen'],
]) {
  replaceAllChecked('src/features/subjects/Subjects.jsx', from, to, 1)
}

replaceAllChecked('src/features/planner/dailyPlanner.js', 'MODULE_GROUPS', '__PARENT_MODULES__', 1)
replaceAllChecked('src/features/planner/dailyPlanner.js', 'MODULES', 'CHAPTERS', 1)
replaceAllChecked('src/features/planner/dailyPlanner.js', '__PARENT_MODULES__', 'PARENT_MODULES', 1)
replaceExact(
  'src/features/planner/dailyPlanner.js',
  "import { CHAPTERS, isModuleAvailable } from '../../modules.js'\nimport { PARENT_MODULES } from '../../progress.js'\nimport { getArray, getObject, setJson, saveCritical } from '../../lib/storage.js'",
  "import { CHAPTERS, isChapterAvailable } from '../../chapters.js'\nimport { MODULES as PARENT_MODULES } from '../../data/modules.js'\nimport { getChapterState } from '../../progress.js'\nimport { getArray, getObject, setJson, saveCritical } from '../../lib/storage.js'",
)
replaceAllChecked('src/features/planner/dailyPlanner.js', 'isModuleAvailable', 'isChapterAvailable', 1)
replaceAllChecked('src/features/planner/dailyPlanner.js', 'moduleStates', 'chapterStates', 1)
replaceRegex(
  'src/features/planner/dailyPlanner.js',
  /  const chapterStates = \{\}\n  CHAPTERS\.forEach\(m => \{\n    chapterStates\[m\.id\] = getObject\('gcse_module_' \+ m\.id\)\n  \}\)/,
  `  const chapterStates = {}
  CHAPTERS.forEach(chapter => {
    chapterStates[chapter.id] = getChapterState(chapter.id)
  })`,
)
replaceExact(
  'src/features/planner/dailyPlanner.js',
  'chapterStates:     { [moduleId]: { screen, completed, hookDone, wylDone, timestamp } },',
  'chapterStates:    { [chapterId]: { screen, completed, hookDone, wylDone, timestamp } },',
)

replaceExact(
  'scripts/contact-sheet.mjs',
  "import { MODULES } from '../src/modules.js'",
  "import { CHAPTERS } from '../src/chapters.js'",
)
replaceAllChecked('scripts/contact-sheet.mjs', 'MODULES', 'CHAPTERS', 2)
replaceExact(
  'scripts/contact-sheet.mjs',
  'localStorage.setItem(`guest::gcse_module_${id}`, JSON.stringify({',
  'localStorage.setItem(`guest::gcse_chapter_${id}`, JSON.stringify({',
)

replaceAllChecked('.storybook/preview.jsx', 'gcse_module_', 'gcse_chapter_', 2)

replaceExact(
  'src/data/progressSync/snapshotBudget.js',
  'NEVER compacted: gcse_progress (streak), gcse_module_* (completion),',
  'NEVER compacted: gcse_progress (streak), gcse_chapter_* (completion),',
)

replaceExact(
  'tests/architecture/legacy-content-imports.test.js',
  "        'src/features/planner/dailyPlanner.js',\n        'src/features/subjects/Subjects.jsx',\n",
  '',
)
replaceExact(
  'tests/architecture/legacy-content-imports.test.js',
  "        'src/features/subjects/Subjects.jsx',\n",
  '',
)
replaceRegex(
  'tests/architecture/legacy-content-imports.test.js',
  /\[\n        'src\/components\/layout\/ModulePlayer\.jsx',\n        'src\/features\/planner\/dailyPlanner\.js',\n      \]/,
  '[]',
)
replaceRegex(
  'tests/architecture/legacy-content-imports.test.js',
  /\[\n        'src\/app\/LegacyApp\.jsx',\n        'src\/features\/subjects\/Subjects\.jsx',\n      \]/,
  '[]',
)
replaceExact(
  'tests/architecture/legacy-content-imports.test.js',
  "\n})\n",
  `
  it('prevents new source callers from importing legacy chapter-progress names', () => {
    const violators = importViolators(
      /import\\s*\\{[^}]*(getModuleState|saveModuleState|getModulePct)[^}]*\\}\\s*from\\s*['"][^'"]*progress\\.js['"]/s,
      [],
    )

    expect(
      violators,
      \`New code must use getChapterState/saveChapterState/getChapterPct: \${violators.join(', ')}\`,
    ).toEqual([])
  })
})
`,
)

for (const path of [
  'tests/unit/journeys/learnerJourneys.test.js',
  'tests/unit/journeys/accountIsolationJourneys.test.js',
  'tests/unit/saveFailure/progressFailureIntegration.test.js',
]) {
  for (const [from, to] of [
    ['saveModuleState', 'saveChapterState'],
    ['getModuleState', 'getChapterState'],
    ['getModulePct', 'getChapterPct'],
    ['gcse_module_', 'gcse_chapter_'],
  ]) {
    const source = read(path)
    if (source.includes(from)) replaceAllChecked(path, from, to, 1)
  }
}

for (const path of [
  'tests/unit/progressSync/progressMerge.test.js',
  'tests/unit/progressSync/progressSync.test.js',
  'tests/unit/progressSync/snapshotBudget.test.js',
  'tests/unit/journeys/persistenceGrowthJourneys.test.js',
]) {
  if (read(path).includes('gcse_module_')) {
    replaceAllChecked(path, 'gcse_module_', 'gcse_chapter_', 1)
  }
}

replaceExact(
  'tests/unit/progressSync/progressMerge.test.js',
  "from '../../../src/data/progressSync/progressMerge.js'",
  "from '../../../src/data/progressSync/canonicalProgressMerge.js'",
)

replaceAllChecked('tests/unit/planner/dailyPlanner.test.js', 'moduleStates', 'chapterStates', 1)

replaceExact(
  'tests/unit/progressSync/accountScope.test.js',
  "expect(getJson('gcse_module_bio1', null)).toMatchObject({ screen: 5, completed: true })",
  "expect(getJson('gcse_chapter_bio1', null)).toMatchObject({ screen: 5, completed: true })",
)

replaceAllChecked(
  'tests/unit/progressSync/progressSync.test.js',
  "setJson: vi.fn((key, value) => { store[key] = value }),",
  "setJson: vi.fn((key, value) => { store[key] = value; return true }),",
  1,
)
replaceAllChecked(
  'tests/unit/progressSync/progressSync.test.js',
  "setJsonForScope: vi.fn((_scope, key, value) => { store[key] = value }),",
  "setJsonForScope: vi.fn((_scope, key, value) => { store[key] = value; return true }),",
  1,
)

write('tests/unit/progressSync/chapterProgressPersistence.test.js', `import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import {
  getChapterPct,
  getChapterState,
  getModuleState,
  saveChapterState,
  saveModuleState,
} from '../../../src/progress.js'
import { GUEST_SCOPE, setActiveScope } from '../../../src/lib/storage.js'

function installLocalStorage() {
  const store = {}
  globalThis.localStorage = {
    get length() { return Object.keys(store).length },
    key: index => Object.keys(store)[index] ?? null,
    getItem: key => (key in store ? store[key] : null),
    setItem: (key, value) => { store[key] = String(value) },
    removeItem: key => { delete store[key] },
    clear: () => { for (const key of Object.keys(store)) delete store[key] },
  }
  return store
}

let store

beforeEach(() => {
  store = installLocalStorage()
  setActiveScope(GUEST_SCOPE)
})

afterEach(() => setActiveScope(GUEST_SCOPE))

describe('canonical chapter progress persistence', () => {
  it('migrates a complete legacy state without losing opener or examiner data', () => {
    const state = {
      screen: 7,
      completed: true,
      hookDone: true,
      wylDone: true,
      recallDone: true,
      introDone: true,
      examinerAttempts: [{ questionId: 'q1', mark: 5 }],
    }
    store['guest::gcse_module_history-medicine-black-death'] = JSON.stringify(state)

    expect(getChapterState('history-medicine-black-death')).toEqual(state)
    expect(JSON.parse(store['guest::gcse_chapter_history-medicine-black-death'])).toEqual(state)
    expect(store['guest::gcse_module_history-medicine-black-death']).toBeUndefined()
  })

  it('folds canonical and legacy copies monotonically into one state', () => {
    store['guest::gcse_chapter_history-medicine-germ-theory'] = JSON.stringify({
      screen: 4,
      hookDone: true,
      examinerAttempts: [{ id: 'canonical' }],
      note: 'canonical wins unknown-field ties',
    })
    store['guest::gcse_module_history-medicine-germ-theory'] = JSON.stringify({
      screen: 9,
      completed: true,
      wylDone: true,
      recallDone: true,
      introDone: true,
      examinerAttempts: [{ id: 'legacy' }],
      note: 'legacy',
    })

    expect(getChapterState('history-medicine-germ-theory')).toEqual({
      screen: 9,
      completed: true,
      hookDone: true,
      wylDone: true,
      recallDone: true,
      introDone: true,
      examinerAttempts: [{ id: 'canonical' }, { id: 'legacy' }],
      note: 'canonical wins unknown-field ties',
    })
  })

  it('maps historical short ids directly to the current chapter id', () => {
    store['guest::gcse_module_mod8'] = JSON.stringify({ screen: 6, completed: true })

    expect(getChapterState('history-medicine-modern-medicine')).toEqual({
      screen: 6,
      completed: true,
    })
    expect(JSON.parse(store['guest::gcse_chapter_history-medicine-modern-medicine']))
      .toEqual({ screen: 6, completed: true })
    expect(store['guest::gcse_module_mod8']).toBeUndefined()
  })

  it('all canonical and compatibility saves write only gcse_chapter keys', () => {
    expect(saveChapterState('chapter-a', { screen: 2 })).toBe(true)
    expect(saveModuleState('chapter-b', { screen: 3 })).toBe(true)

    expect(JSON.parse(store['guest::gcse_chapter_chapter-a'])).toEqual({ screen: 2 })
    expect(JSON.parse(store['guest::gcse_chapter_chapter-b'])).toEqual({ screen: 3 })
    expect(Object.keys(store).some(key => key.includes('gcse_module_'))).toBe(false)
    expect(getModuleState('chapter-b')).toEqual({ screen: 3 })
  })

  it('keeps the fallback intact when canonical migration cannot be persisted', () => {
    store['guest::gcse_module_history-medicine-cancer'] = JSON.stringify({ screen: 8 })
    const originalSetItem = globalThis.localStorage.setItem
    globalThis.localStorage.setItem = (key, value) => {
      if (key.includes('gcse_chapter_')) {
        const error = new Error('full')
        error.name = 'QuotaExceededError'
        throw error
      }
      originalSetItem(key, value)
    }

    expect(getChapterState('history-medicine-cancer')).toEqual({ screen: 8 })
    expect(JSON.parse(store['guest::gcse_module_history-medicine-cancer'])).toEqual({ screen: 8 })
    expect(store['guest::gcse_chapter_history-medicine-cancer']).toBeUndefined()
  })

  it('calculates percentage from canonical state and keeps completion sticky', () => {
    const chapter = { id: 'chapter-pct', screenCount: 10 }
    saveChapterState(chapter.id, { screen: 4 })
    expect(getChapterPct(chapter)).toBe(40)
    saveChapterState(chapter.id, { screen: 1, completed: true })
    expect(getChapterPct(chapter)).toBe(100)
  })
})
`)

write('tests/unit/progressSync/chapterProgressMerge.test.js', `import { describe, expect, it } from 'vitest'
import {
  mergeProgressData,
  progressDataEqual,
} from '../../../src/data/progressSync/canonicalProgressMerge.js'

describe('chapter progress snapshot migration', () => {
  it('folds legacy and canonical copies into one canonical key', () => {
    const local = {
      'gcse_chapter_history-1': {
        screen: 4,
        hookDone: true,
        examinerAttempts: [{ id: 'local' }],
      },
    }
    const cloud = {
      'gcse_module_history-1': {
        screen: 9,
        completed: true,
        wylDone: true,
        recallDone: true,
        introDone: true,
        examinerAttempts: [{ id: 'cloud' }],
      },
    }

    const merged = mergeProgressData(local, cloud)
    expect(merged['gcse_chapter_history-1']).toEqual({
      screen: 9,
      completed: true,
      hookDone: true,
      wylDone: true,
      recallDone: true,
      introDone: true,
      examinerAttempts: [{ id: 'local' }, { id: 'cloud' }],
    })
    expect(merged['gcse_module_history-1']).toBeUndefined()
  })

  it('maps an old short id to the current canonical chapter key', () => {
    const merged = mergeProgressData(
      {},
      { gcse_module_mod8: { screen: 5, completed: true } },
    )
    expect(merged['gcse_chapter_history-medicine-modern-medicine'])
      .toEqual({ screen: 5, completed: true })
    expect(merged.gcse_module_mod8).toBeUndefined()
  })

  it('is idempotent after migration', () => {
    const migrated = mergeProgressData(
      { 'gcse_module_history-1': { screen: 6, completed: true } },
      {},
    )
    expect(progressDataEqual(mergeProgressData(migrated, migrated), migrated)).toBe(true)
  })
})
`)

write('tests/unit/progressSync/chapterProgressSnapshot.test.js', `import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  GUEST_SCOPE,
  getJson,
  setActiveScope,
  setJson,
} from '../../../src/lib/storage.js'

vi.mock('../../../src/auth/firebaseClient.js', () => ({
  firebaseEnabled: false,
  app: {},
}))

const {
  applyProgressSnapshot,
  collectLocalProgressSnapshot,
} = await import('../../../src/data/progressSync/progressSync.js')

function installLocalStorage() {
  const store = {}
  globalThis.localStorage = {
    get length() { return Object.keys(store).length },
    key: index => Object.keys(store)[index] ?? null,
    getItem: key => (key in store ? store[key] : null),
    setItem: (key, value) => { store[key] = String(value) },
    removeItem: key => { delete store[key] },
    clear: () => { for (const key of Object.keys(store)) delete store[key] },
  }
}

beforeEach(() => {
  installLocalStorage()
  setActiveScope(GUEST_SCOPE)
})

afterEach(() => setActiveScope(GUEST_SCOPE))

describe('progress snapshots use canonical chapter keys', () => {
  it('collects a legacy local key as canonical and migrates the local copy', () => {
    setJson('gcse_module_history-1', { screen: 4, hookDone: true })

    const snapshot = collectLocalProgressSnapshot(GUEST_SCOPE)

    expect(snapshot.data['gcse_chapter_history-1']).toEqual({ screen: 4, hookDone: true })
    expect(snapshot.data['gcse_module_history-1']).toBeUndefined()
    expect(getJson('gcse_chapter_history-1', null)).toEqual({ screen: 4, hookDone: true })
    expect(getJson('gcse_module_history-1', null)).toBeNull()
  })

  it('applies an old cloud key locally under the canonical name only', () => {
    applyProgressSnapshot({
      version: 1,
      updatedAt: 1,
      data: {
        'gcse_module_history-1': {
          screen: 7,
          completed: true,
          examinerAttempts: [{ id: 'q1' }],
        },
      },
    }, { scope: GUEST_SCOPE })

    expect(getJson('gcse_chapter_history-1', null)).toEqual({
      screen: 7,
      completed: true,
      examinerAttempts: [{ id: 'q1' }],
    })
    expect(getJson('gcse_module_history-1', null)).toBeNull()
  })
})
`)

replaceExact(
  'docs/system/CONTENT_HIERARCHY.md',
  'Phase 2 changes no storage keys and no learner-facing behaviour.',
  `Phase 3 makes \`gcse_chapter_<id>\` the canonical chapter-progress key.

During the migration window:

- \`getChapterState\` reads the canonical key first and folds forward any
  \`gcse_module_<id>\` or historical short-id copy;
- \`saveChapterState\` writes only the canonical key;
- compatibility APIs call the canonical implementation and therefore cannot
  create new legacy keys;
- local and cloud snapshots canonicalise cross-key duplicates with monotonic
  screen, completion, opener-gate and examiner-attempt preservation;
- a fallback key is removed only after its canonical replacement is safely
  persisted.

Existing chapter IDs remain unchanged and continue to be the learner-progress identity.`,
)

replaceExact(
  'docs/system/PROGRESS_SYNC_ARCHITECTURE.md',
  '## QuickFire ranking memory — per-answer persistence and multi-device merge',
  `## Chapter progress key migration

The canonical per-chapter key is now \`gcse_chapter_<chapterId>\`. During the
migration window, sync discovery reads both \`gcse_chapter_*\` and the older
\`gcse_module_*\` prefix. Before any merge or cloud write, old and new copies
for the same chapter are folded into one canonical state.

The fold is monotonic for resume screen, completion, opener gates and examiner
attempts. Local fallback keys are removed only after the canonical replacement
has persisted. Cloud snapshots restored from an older device are applied
locally under canonical keys and then written back canonically, so old devices
remain readable while upgraded devices cannot create new legacy keys.

## QuickFire ranking memory — per-answer persistence and multi-device merge`,
)

console.log('Phase 3 migration edits applied.')

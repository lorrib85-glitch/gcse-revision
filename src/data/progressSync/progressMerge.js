// ─── Progress merge — governed, per-key merge rules ──────────────────────────
//
// Whole-snapshot "pick a side" reconciliation (the old decideSyncAction did
// this: either upload local wholesale or apply cloud wholesale) silently
// discards real learner progress whenever both sides are meaningful — a
// guest's local work can be wiped by an older cloud doc on link, or a second
// device's real progress can be lost to whichever side happened to sync last.
//
// This module merges the two `.data` maps key by key, using an explicit rule
// chosen for what that key's value actually means — nothing falls through to
// a generic shallow merge. Every rule is idempotent: merge(x, x) === x (in
// content, not necessarily object identity), so re-running a sync after
// nothing changed writes nothing new and duplicates nothing.
//
// Pure, Firebase-free and storage-free — independently testable with plain
// fixtures. Deliberately does not import the learner mastery evidence engine
// under src/data/ (that package's consumers are allowlisted by an
// architecture test) — the mastery snapshot is merged here as an opaque,
// duck-typed value instead.

// ─── Generic helpers ──────────────────────────────────────────────────────────

function dedupeExact(entries) {
  const seen = new Set()
  const out = []
  for (const entry of entries) {
    if (entry == null) continue
    const key = JSON.stringify(entry)
    if (seen.has(key)) continue
    seen.add(key)
    out.push(entry)
  }
  return out
}

// Additive log merge: union two arrays of log entries, dropping exact
// duplicates (the same entry re-appearing after a previous sync), sorted
// newest-first by `field` (numeric for 'timestamp', string/lexicographic for
// date-like fields such as 'date' or 'completedAt'), optionally capped.
function mergeDedupedLog(a, b, field, limit) {
  const merged = dedupeExact([...(Array.isArray(a) ? a : []), ...(Array.isArray(b) ? b : [])])
  merged.sort(field === 'timestamp'
    ? (x, y) => (Number(y?.timestamp) || 0) - (Number(x?.timestamp) || 0)
    : (x, y) => String(y?.[field] ?? '').localeCompare(String(x?.[field] ?? '')))
  return typeof limit === 'number' ? merged.slice(0, limit) : merged
}

// Whole-object pick by an embedded date-like field — for single-record
// snapshots (last session, today's revisit note) where mixing fields from
// two different moments would be incoherent; the more recent record wins
// entirely.
function mergeByEmbeddedField(a, b, field) {
  if (!a) return b ?? null
  if (!b) return a
  return String(a[field] ?? '') >= String(b[field] ?? '') ? a : b
}

// Shallow settings-object merge — field union, ties broken by which side is
// treated as primary (the caller decides, based on overall snapshot recency).
function mergeShallow(a, b, preferA) {
  if (!a) return b ?? null
  if (!b) return a
  return preferA ? { ...b, ...a } : { ...a, ...b }
}

// ─── riseUser — session identity ──────────────────────────────────────────────
// Local is this device's just-established session identity and is always
// authoritative for the account currently signing in; cloud's copy of the
// profile only fills a gap, and never for a different account.

function mergeRiseUser(local, cloud, currentUid) {
  if (local && (!currentUid || !local.uid || local.uid === currentUid)) return local
  if (cloud && (!currentUid || !cloud.uid || cloud.uid === currentUid)) return cloud
  return local ?? null
}

// ─── gcse_progress — streak / activity record ─────────────────────────────────
// streak/lastActivityDate/lastSessionDate travel together (streak is only
// coherent alongside the date it was computed for) so they're taken as a
// group from whichever side has the more recent lastActivityDate.
// bestStreak is monotonic. Unknown fields (e.g. future additions) are unioned
// rather than dropped.

function mergeProgressRecord(a, b) {
  if (!a) return b ?? null
  if (!b) return a
  const fresher = String(a.lastActivityDate ?? '') >= String(b.lastActivityDate ?? '') ? a : b
  const other = fresher === a ? b : a
  const merged = { ...other, ...fresher }
  // Only synthesise bestStreak when at least one side actually has it — see
  // mergeModuleState for why an invented default would break merge(x, x) = x.
  if (a.bestStreak !== undefined || b.bestStreak !== undefined) {
    merged.bestStreak = Math.max(a.bestStreak || 0, b.bestStreak || 0)
  }
  return merged
}

// ─── gcse_module_<id> — per-module screen progress ─────────────────────────────
// Monotonic: a module never silently un-completes and the resume point never
// silently rewinds. The only way progress moves backward is an explicit
// learner reset action elsewhere in the app, never a sync.

// Only synthesises a field when at least one side actually has it — a real
// module-state write can be as small as { screen }, and inventing e.g.
// completed: false / timestamp: 0 the first time both sides agree would
// change the merged value on the very next merge of that same, unchanged
// object (merge(x, x) must equal x exactly, not just after an extra round).
function mergeModuleState(a, b) {
  if (!a) return b ?? null
  if (!b) return a
  const merged = { ...b, ...a }
  if (a.screen !== undefined || b.screen !== undefined) {
    merged.screen = Math.max(a.screen || 0, b.screen || 0)
  }
  if (a.completed !== undefined || b.completed !== undefined) {
    merged.completed = Boolean(a.completed || b.completed)
  }
  if (a.hookDone !== undefined || b.hookDone !== undefined) {
    merged.hookDone = Boolean(a.hookDone || b.hookDone)
  }
  if (a.wylDone !== undefined || b.wylDone !== undefined) {
    merged.wylDone = Boolean(a.wylDone || b.wylDone)
  }
  if (a.timestamp !== undefined || b.timestamp !== undefined) {
    merged.timestamp = Math.max(a.timestamp || 0, b.timestamp || 0)
  }
  return merged
}

// ─── gcse_planner_weakpoints ────────────────────────────────────────────────
// Identity is (subject, topic, skillTag) — NOT weakPointId, which is a random
// per-device id, so two devices independently tracking the same weak point
// would never collide on id and would duplicate forever. Within an identity,
// the sighting with the more recent lastSeenAt wins wholesale (mixing
// counters from a stale sighting with a status from a fresh one would
// misrepresent where the learner actually stands, and could resurrect a
// resolved weak point from stale data if merged field-by-field).

function weakPointIdentity(wp) {
  return `${wp.subject}|${wp.topic}|${wp.skillTag || ''}`
}

function mergeWeakPointSighting(a, b) {
  if (!a) return b
  if (!b) return a
  if (a.lastSeenAt !== b.lastSeenAt) return a.lastSeenAt > b.lastSeenAt ? a : b
  // True tie — deterministic, prefers the sighting with more accumulated
  // evidence so merge(x, x) stays stable regardless of argument order.
  const aEvidence = (a.timesFailed || 0) + (a.timesCorrectAfter || 0)
  const bEvidence = (b.timesFailed || 0) + (b.timesCorrectAfter || 0)
  return aEvidence >= bEvidence ? a : b
}

function mergeWeakPoints(a, b) {
  const grouped = new Map()
  for (const wp of [...(Array.isArray(a) ? a : []), ...(Array.isArray(b) ? b : [])]) {
    if (!wp) continue
    const id = weakPointIdentity(wp)
    if (!grouped.has(id)) grouped.set(id, [])
    grouped.get(id).push(wp)
  }
  const out = []
  for (const sightings of grouped.values()) {
    const winner = sightings.reduce((best, wp) => mergeWeakPointSighting(best, wp))
    const firstSeenAt = sightings.reduce((min, wp) => {
      if (!wp.firstSeenAt) return min
      return !min || wp.firstSeenAt < min ? wp.firstSeenAt : min
    }, null)
    out.push(firstSeenAt ? { ...winner, firstSeenAt } : winner)
  }
  return out
}

// ─── gcse_mastery_v1 — per-concept evidence snapshot ───────────────────────────
// Treated as an opaque, duck-typed { version, concepts: { [id]: evidence } }
// value — this file never imports the mastery engine itself. `attempts` and
// `correct`/`incorrect` are exact-sum invariants inside a single evidence
// record (attempts === correct + incorrect), so fields cannot be merged
// independently without risking an inconsistent record; instead, per concept,
// the richer whole evidence record wins (more attempts = more informed
// mastery), tie-broken by lastSeen. Concepts practiced independently on two
// devices in the same window are not event-merged — the fuller record is
// kept and the other device's concurrent session for that same concept is
// not folded in. This is a deliberate, documented simplification: an event-
// level merge would need per-event ids the current evidence format doesn't
// carry, and duplicating the summed-counter approach used elsewhere in this
// evidence format is not idempotent across repeated full-snapshot syncs.

function isMasteryStateLike(value) {
  return Boolean(value) && typeof value === 'object' && value.concepts && typeof value.concepts === 'object'
}

function mergeConceptEvidence(a, b) {
  if (!a) return b
  if (!b) return a
  if ((a.attempts || 0) !== (b.attempts || 0)) return (a.attempts || 0) > (b.attempts || 0) ? a : b
  return (a.lastSeen ?? -Infinity) >= (b.lastSeen ?? -Infinity) ? a : b
}

function mergeMasteryState(a, b) {
  const av = isMasteryStateLike(a) ? a : null
  const bv = isMasteryStateLike(b) ? b : null
  if (!av) return bv ?? a ?? null
  if (!bv) return av
  const concepts = { ...av.concepts }
  for (const [id, evidence] of Object.entries(bv.concepts)) {
    concepts[id] = mergeConceptEvidence(concepts[id], evidence)
  }
  return { ...av, concepts }
}

// ─── gcse_quickfire_memory_v1 — running accuracy buckets ──────────────────────
// { subjects: {[key]: {answered, correct, seedAnswered?, seedCorrect?}},
//   topics: {...} }. Each bucket is a lifetime running total, incremented by
// exactly 1 on-device per committed answer (QuickFireMode.jsx) — never
// re-derived from a round accumulator — so a full-snapshot merge must not
// sum the two sides' totals (that would double-count everything already
// reflected on both).
//
// Per-field max (mergeCountBucket, still used as the fallback below) is safe
// but lossy: if device A goes from a synced 10 to 13 and device B
// independently goes from that same synced 10 to 14, max() reports 14 —
// losing B's 3 answers and A's 4th. Where deduplicated evidence is
// available — gcse_qf_answer_log, a bounded log of {id, subject, topicKey,
// correct, at} appended alongside every bucket increment — that's used as
// the source of truth instead: mergedAnswered = seed + |unique events|.
// `seedAnswered`/`seedCorrect` freeze the bucket's value the first time an
// event was recorded for it on a given device — i.e. the last value both
// devices are expected to have agreed on before they started diverging — so
// two devices seeded from the same synced base (10 in the example above)
// reconstruct the true total (10 + |{3 unique} ∪ {4 unique}| = 17) without
// fabricating any event that wasn't actually logged. Buckets with no events
// on either side (pre-log legacy data, or a device that hasn't upgraded)
// fall back to the old max-merge, so historical aggregate-only records stay
// readable and nothing here invents history that was never stored.

function mergeCountBucket(a, b) {
  if (!a) return b
  if (!b) return a
  const merged = { ...b, ...a }
  // Only synthesise when at least one side actually has it — see
  // mergeModuleState for why an invented default would break merge(x, x) = x.
  if (a.answered !== undefined || b.answered !== undefined) {
    merged.answered = Math.max(a.answered || 0, b.answered || 0)
  }
  if (a.correct !== undefined || b.correct !== undefined) {
    merged.correct = Math.max(a.correct || 0, b.correct || 0)
  }
  return merged
}

// Dedupe two devices' answer-event logs by stable id (each event's id is
// generated once, on-device, at the moment the answer is committed — see
// qfAnswerEventId in quickFireMemory.js — so the same real-world answer
// always produces the same id, and a repeat sync of the same events is a
// no-op). Bounded so the log can't grow without limit across a long-lived
// account. Events that age past the cap are NOT lost: local compaction folds a
// device's own aged events into the per-device baseline below before they can
// be trimmed, so historical totals survive raw-event trimming.
export const QF_ANSWER_LOG_CAP = 4000
export const QF_ANSWER_LOG_RETAIN = 3000

function mergeQfAnswerLog(a, b) {
  const seen = new Set()
  const out = []
  for (const entry of [...(Array.isArray(a) ? a : []), ...(Array.isArray(b) ? b : [])]) {
    if (!entry?.id || seen.has(entry.id)) continue
    seen.add(entry.id)
    out.push(entry)
  }
  out.sort((x, y) => (Number(y.at) || 0) - (Number(x.at) || 0))
  return out
}

// ─── gcse_qf_baseline_v1 — merge-safe compacted evidence ──────────────────────
//
// A grow-only per-device accumulator (a G-Counter CRDT) recording answer
// events that have aged out of the raw log:
//   { version, folded: {[dev]: maxSeqFolded},
//     subjects: {[key]: {[dev]: {answered, correct}}}, topics: {...} }
//
// Every raw event carries its creating device id (`dev`) and a per-device
// monotonic sequence number (`seq`). A device folds only its OWN aged events
// into its own accumulator cell — its seqs are contiguous, so `folded[dev]`
// always denotes a true prefix and "seq <= folded[dev]" means "already in the
// baseline". Because each event increments exactly one device's cell, and
// cells merge by max (a monotonic prefix count), independent activity from two
// devices survives, the same event is never counted twice, repeated syncs are
// idempotent, and trimming raw events never reduces a total. Old aggregate-only
// records (no dev/seq) keep working via the seed/max fallback below; nothing is
// ever fabricated.

export function emptyQfBaseline() {
  return { version: 1, folded: {}, subjects: {}, topics: {} }
}

function cloneQfBaseline(b) {
  const src = (b && typeof b === 'object') ? b : null
  const out = emptyQfBaseline()
  if (!src) return out
  out.folded = { ...(src.folded || {}) }
  for (const mapName of ['subjects', 'topics']) {
    const map = src[mapName] || {}
    for (const key of Object.keys(map)) {
      out[mapName][key] = {}
      for (const dev of Object.keys(map[key] || {})) {
        const cell = map[key][dev] || {}
        out[mapName][key][dev] = { answered: cell.answered || 0, correct: cell.correct || 0 }
      }
    }
  }
  return out
}

function addFoldedCell(baseline, mapName, key, dev, correct) {
  const bucket = baseline[mapName][key] || (baseline[mapName][key] = {})
  const cell = bucket[dev] || (bucket[dev] = { answered: 0, correct: 0 })
  cell.answered += 1
  cell.correct += correct ? 1 : 0
}

// Fold events into a (cloned) baseline respecting per-device contiguity: per
// device, fold only events that extend the folded prefix (folded[dev]+1, +2,
// …) with no gap. Mutates the passed baseline; callers pass a clone.
function foldEventsContiguous(baseline, events) {
  const byDev = new Map()
  for (const e of events) {
    if (!e || e.dev == null || typeof e.seq !== 'number') continue // legacy events aren't foldable
    if (!byDev.has(e.dev)) byDev.set(e.dev, [])
    byDev.get(e.dev).push(e)
  }
  for (const [dev, devEvents] of byDev) {
    devEvents.sort((x, y) => x.seq - y.seq)
    let folded = baseline.folded[dev] || 0
    for (const e of devEvents) {
      if (e.seq <= folded) continue      // already folded
      if (e.seq !== folded + 1) break    // gap — stop this device here
      addFoldedCell(baseline, 'subjects', e.subject, dev, e.correct)
      addFoldedCell(baseline, 'topics', e.topicKey, dev, e.correct)
      folded = e.seq
    }
    baseline.folded[dev] = folded
  }
}

// Pure compaction used by quickFireMemory.js when the raw log exceeds the cap:
// fold this device's OWN overflow (oldest) events into the baseline, keep the
// newest `retain`. Foreign/legacy overflow is dropped without folding — a
// foreign event's owner folds it into the shared baseline when the owner trims,
// and a still-live copy re-unions on the next merge. Deterministic and
// idempotent: re-running on an already-compacted log (<= cap) changes nothing.
export function compactAnswerLog(log, baseline, deviceId, { cap = QF_ANSWER_LOG_CAP, retain = QF_ANSWER_LOG_RETAIN } = {}) {
  const arr = Array.isArray(log) ? log : []
  const sorted = [...arr].sort((x, y) => (Number(y?.at) || 0) - (Number(x?.at) || 0))
  if (sorted.length <= cap) {
    return { log: sorted, baseline: baseline ? cloneQfBaseline(baseline) : null, compacted: false }
  }
  const keep = sorted.slice(0, retain)
  const overflow = sorted.slice(retain).filter(e => e && e.dev === deviceId && typeof e.seq === 'number')
  const next = cloneQfBaseline(baseline)
  foldEventsContiguous(next, overflow)
  return { log: keep, baseline: next, compacted: true }
}

// Merge two devices' baselines: folded watermark and each (bucket, device)
// cell are monotonic prefix counts, so max per key is exact and idempotent.
function mergeQfBaseline(a, b) {
  if (!a && !b) return undefined
  const out = cloneQfBaseline(a)
  const bv = cloneQfBaseline(b)
  for (const dev of Object.keys(bv.folded)) {
    out.folded[dev] = Math.max(out.folded[dev] || 0, bv.folded[dev] || 0)
  }
  for (const mapName of ['subjects', 'topics']) {
    for (const key of Object.keys(bv[mapName])) {
      const outBucket = out[mapName][key] || (out[mapName][key] = {})
      for (const dev of Object.keys(bv[mapName][key])) {
        const c = bv[mapName][key][dev]
        const cur = outBucket[dev] || { answered: 0, correct: 0 }
        outBucket[dev] = { answered: Math.max(cur.answered, c.answered), correct: Math.max(cur.correct, c.correct) }
      }
    }
  }
  return out
}

// Drop events already represented in the baseline (seq <= folded[dev]); legacy
// events with no dev/seq are always kept. Also caps the surviving log.
function pruneFoldedEvents(log, folded = {}) {
  const kept = log.filter(e => {
    if (!e || e.dev == null || typeof e.seq !== 'number') return true
    return e.seq > (folded[e.dev] || 0)
  })
  return kept.slice(0, QF_ANSWER_LOG_CAP)
}

function eventsForBucketKey(events, mapName, key) {
  const field = mapName === 'subjects' ? 'subject' : 'topicKey'
  return events.filter(e => e[field] === key)
}

function foldedTotals(baseline, mapName, key) {
  const bucket = baseline?.[mapName]?.[key]
  let answered = 0, correct = 0
  if (bucket) {
    for (const dev of Object.keys(bucket)) {
      answered += bucket[dev].answered || 0
      correct += bucket[dev].correct || 0
    }
  }
  return { answered, correct }
}

// Seed-aware bucket merge for one subjects/topics map, given the already-
// deduplicated + pruned event log and the merged baseline. Reconstructs the
// true cross-device total as:
//   seed (last common base) + folded (aged-out events) + |unfolded events|
// Falls back to plain max-merge for any bucket with no seed and no folded/log
// evidence on either side (pre-log aggregate-only history).
function mergeBucketMapWithEvents(a, b, mapName, prunedLog, baseline) {
  const av = a || {}
  const bv = b || {}
  const keys = new Set([...Object.keys(av), ...Object.keys(bv)])
  const out = {}
  for (const key of keys) {
    const bucketA = av[key]
    const bucketB = bv[key]
    const events = eventsForBucketKey(prunedLog, mapName, key)
    const fold = foldedTotals(baseline, mapName, key)
    const seedAnswered = [bucketA?.seedAnswered, bucketB?.seedAnswered].filter(v => v !== undefined)
    const seedCorrect = [bucketA?.seedCorrect, bucketB?.seedCorrect].filter(v => v !== undefined)
    const maxMerged = mergeCountBucket(bucketA, bucketB)
    if ((events.length > 0 || fold.answered > 0) && seedAnswered.length > 0) {
      const seedA = Math.min(...seedAnswered)
      const seedC = seedCorrect.length > 0 ? Math.min(...seedCorrect) : 0
      const reconstructed = {
        ...(maxMerged || {}),
        seedAnswered: seedA,
        seedCorrect: seedC,
        answered: seedA + fold.answered + events.length,
        correct: seedC + fold.correct + events.filter(e => e.correct).length,
      }
      // Reconstruction is the true cross-device union when both sides carry
      // event/baseline evidence. But if the other side is a legacy
      // aggregate-only record whose raw total is higher (no seed, so it can't
      // be reconstructed), never regress below it — take the safer, higher
      // count via the plain max-merge, keeping that bucket's own paired
      // answered/correct so the correct <= answered invariant holds.
      out[key] = reconstructed.answered >= (maxMerged?.answered || 0) ? reconstructed : maxMerged
    } else {
      out[key] = maxMerged
    }
  }
  return out
}

// Merges gcse_quickfire_memory_v1 together with its companions
// gcse_qf_answer_log and gcse_qf_baseline_v1 (mergeProgressData special-cases
// the three together — see the dispatch loop below — because a correct bucket
// merge needs both sides' logs and baselines at once, not just both sides'
// bucket maps).
function mergeQuickFireMemory(a, b, prunedLog, baseline) {
  if (!a && !b) return null
  const av = a || { subjects: {}, topics: {} }
  const bv = b || { subjects: {}, topics: {} }
  return {
    subjects: mergeBucketMapWithEvents(av.subjects, bv.subjects, 'subjects', prunedLog, baseline),
    topics: mergeBucketMapWithEvents(av.topics, bv.topics, 'topics', prunedLog, baseline),
    updatedAt: String(av.updatedAt ?? '') >= String(bv.updatedAt ?? '') ? av.updatedAt : bv.updatedAt,
  }
}

// ─── gcse_qf_q_history — per-question attempt record ───────────────────────────
// { [questionId]: { attempts, correct, lastResult, lastAt } }. Same
// running-total shape as the QuickFire buckets above: attempts/correct are
// max-merged per question (safe by the same correct<=attempts invariant),
// and lastResult/lastAt are taken together from whichever side saw that
// question more recently (mixing a fresh lastAt with a stale lastResult
// would misreport whether the last attempt was right or wrong).

function mergeQuestionHistoryEntry(a, b) {
  if (!a) return b
  if (!b) return a
  const fresher = (a.lastAt || 0) >= (b.lastAt || 0) ? a : b
  return {
    attempts: Math.max(a.attempts || 0, b.attempts || 0),
    correct: Math.max(a.correct || 0, b.correct || 0),
    lastResult: fresher.lastResult ?? null,
    lastAt: fresher.lastAt ?? null,
  }
}

function mergeQfQuestionHistory(a, b) {
  const av = a || {}
  const bv = b || {}
  const keys = new Set([...Object.keys(av), ...Object.keys(bv)])
  const out = {}
  for (const key of keys) out[key] = mergeQuestionHistoryEntry(av[key], bv[key])
  return out
}

// ─── gcse_qf_best — best-ever QuickFire round ──────────────────────────────────
// A single record of the best round played, not a running total — the
// record with the higher `correct` wins wholesale (never regresses a
// personal best), tie-broken by date.

function mergeQfBest(a, b) {
  if (!a) return b ?? null
  if (!b) return a
  if ((a.correct || 0) !== (b.correct || 0)) return (a.correct || 0) > (b.correct || 0) ? a : b
  return String(a.date ?? '') >= String(b.date ?? '') ? a : b
}

// ─── Per-key dispatch ──────────────────────────────────────────────────────────

const TIMESTAMPED_LOG_KEYS = {
  gcse_wrong_answers: 500,
  gcse_correct_answers: 500,
  gcse_exam_techniques: 500,
  gcse_coach_type_results: 500,
}

function mergeProgressValue(key, local, cloud, { currentUid, preferLocalOnTie }) {
  if (key === 'riseUser') return mergeRiseUser(local, cloud, currentUid)
  if (key === 'gcse_scores') return mergeDedupedLog(local, cloud, 'date', 200)
  if (key in TIMESTAMPED_LOG_KEYS) return mergeDedupedLog(local, cloud, 'timestamp', TIMESTAMPED_LOG_KEYS[key])
  if (key === 'gcse_planner_paper_results') return mergeDedupedLog(local, cloud, 'completedAt')
  if (key === 'gcse_planner_weakpoints') return mergeWeakPoints(local, cloud)
  if (key === 'gcse_planner_rotation') return mergeShallow(local, cloud, preferLocalOnTie)
  if (key === 'gcse_planner_prefs') return mergeShallow(local, cloud, preferLocalOnTie)
  if (key === 'gcse_progress') return mergeProgressRecord(local, cloud)
  if (key === 'gcse_mastery_v1') return mergeMasteryState(local, cloud)
  // gcse_quickfire_memory_v1, gcse_qf_answer_log and gcse_qf_baseline_v1 are
  // handled together in mergeProgressData (below) — the bucket merge needs both
  // sides' logs AND baselines at once, which per-key dispatch can't see.
  if (key === 'gcse_quickfire_memory_v1' || key === 'gcse_qf_answer_log' || key === 'gcse_qf_baseline_v1') return undefined
  if (key === 'gcse_qf_q_history') return mergeQfQuestionHistory(local, cloud)
  if (key === 'gcse_qf_prev_session') return mergeByEmbeddedField(local, cloud, 'date')
  if (key === 'gcse_qf_best') return mergeQfBest(local, cloud)
  if (key === 'gcse_todays_plan_revisit') return mergeByEmbeddedField(local, cloud, 'date')
  if (key.startsWith('gcse_module_')) return mergeModuleState(local, cloud)

  // Unknown or legacy key not named above — never silently drop either
  // side's data. Prefer whichever value is present; if both are present,
  // fall back to the caller's deterministic tiebreak rather than a coin flip.
  if (local === undefined) return cloud
  if (cloud === undefined) return local
  return preferLocalOnTie ? local : cloud
}

// Merge two full `.data` maps (as stored on a progress snapshot) key by key.
// `currentUid` guards riseUser against adopting a different account's
// identity. `preferLocalOnTie` only affects the handful of non-additive
// settings-style keys with no embedded recency signal of their own (planner
// prefs/rotation, unrecognised legacy keys) — pass whichever side's overall
// snapshot is more recent; on a genuine tie the choice is inert because the
// content is expected to be identical.
export function mergeProgressData(localData, cloudData, { currentUid, preferLocalOnTie = true } = {}) {
  const local = localData || {}
  const cloud = cloudData || {}
  const keys = new Set([...Object.keys(local), ...Object.keys(cloud)])
  const merged = {}
  for (const key of keys) {
    merged[key] = mergeProgressValue(key, local[key], cloud[key], { currentUid, preferLocalOnTie })
  }
  // gcse_quickfire_memory_v1 + gcse_qf_answer_log + gcse_qf_baseline_v1 are a
  // linked trio — see the comment in mergeProgressValue. Only touch them if at
  // least one side actually had one of the three, so accounts that never used
  // QuickFire (or predate these keys) don't gain empty keys they never had.
  if (keys.has('gcse_quickfire_memory_v1') || keys.has('gcse_qf_answer_log') || keys.has('gcse_qf_baseline_v1')) {
    const mergedBaseline = mergeQfBaseline(local.gcse_qf_baseline_v1, cloud.gcse_qf_baseline_v1)
    // Dedupe both logs, then drop events already folded into the merged
    // baseline so nothing is counted twice (baseline + a lingering raw copy).
    const prunedLog = pruneFoldedEvents(
      mergeQfAnswerLog(local.gcse_qf_answer_log, cloud.gcse_qf_answer_log),
      mergedBaseline?.folded,
    )
    if (keys.has('gcse_qf_baseline_v1') && mergedBaseline !== undefined) merged.gcse_qf_baseline_v1 = mergedBaseline
    if (keys.has('gcse_qf_answer_log')) merged.gcse_qf_answer_log = prunedLog
    if (keys.has('gcse_quickfire_memory_v1')) {
      merged.gcse_quickfire_memory_v1 = mergeQuickFireMemory(
        local.gcse_quickfire_memory_v1, cloud.gcse_quickfire_memory_v1, prunedLog, mergedBaseline,
      )
    }
  }
  return merged
}

// Structural (key-order independent) equality for JSON-safe progress data —
// used to decide whether a merge actually changed anything, so a sync with
// nothing new to contribute writes nothing.
export function progressDataEqual(a, b) {
  if (a === b) return true
  if (typeof a !== typeof b || a === null || b === null) return a === b
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false
    return a.every((v, i) => progressDataEqual(v, b[i]))
  }
  if (typeof a === 'object') {
    const ka = Object.keys(a)
    const kb = Object.keys(b)
    if (ka.length !== kb.length) return false
    return ka.every(k => Object.prototype.hasOwnProperty.call(b, k) && progressDataEqual(a[k], b[k]))
  }
  return a === b
}

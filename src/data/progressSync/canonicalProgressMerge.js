// Canonical progress-snapshot merge.
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

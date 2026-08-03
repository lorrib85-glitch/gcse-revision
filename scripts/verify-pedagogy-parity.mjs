#!/usr/bin/env node
// ─── Phase 3 parity harness ─────────────────────────────────────────────────
//
// Proves the taxonomy authority flip changed nothing a consumer can observe,
// against the baselines captured at 5fd92ff before any Phase 3 work:
//
//   1. taxonomy parity  — FUNCTION_TAGS order, per-type functions order and
//      interaction, all three helper outputs per type, unknown-type
//      behaviour. Exactly the approved D1 removals may disappear and exactly
//      the approved D2 additions may appear; anything else fails.
//   2. quality parity   — the complete ordered quality output for all 60
//      chapters, byte-identical.
//
// Exits non-zero on any unexpected difference.

import { readFileSync } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

import {
  FUNCTION_TAGS, SCREEN_TYPE_FUNCTIONS, getTypeInfo, isPassive, isAssessed,
} from '../src/data/componentFunctions.js'
import {
  guardrailViolations, sentenceCaseViolations, violationFingerprints,
} from '../src/data/contentQualityChecks.js'
import { CHAPTER_CONTENT_LOADERS } from '../src/content/chapterContentRegistry.js'

const HERE = dirname(fileURLToPath(import.meta.url))
const BASELINES = resolve(HERE, '../.planning/phase-3-pedagogical-taxonomy/baselines')

// Approved deviations — D1 removals and D2 additions, nothing else.
const APPROVED_REMOVALS = ['choice', 'truefalse', 'connection']
const APPROVED_ADDITIONS = ['hotspot', 'timeline']

const failures = []
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b)

// ── 1. Taxonomy parity ──────────────────────────────────────────────────────
const baseline = JSON.parse(readFileSync(`${BASELINES}/taxonomy-baseline.json`, 'utf8'))

if (!same(baseline.FUNCTION_TAGS, [...FUNCTION_TAGS])) {
  failures.push('FUNCTION_TAGS changed (order or membership)')
}

const oldKeys = Object.keys(baseline.SCREEN_TYPE_FUNCTIONS)
const newKeys = Object.keys(SCREEN_TYPE_FUNCTIONS)
const removed = oldKeys.filter(k => !newKeys.includes(k)).sort()
const added = newKeys.filter(k => !oldKeys.includes(k)).sort()

if (!same(removed, [...APPROVED_REMOVALS].sort())) {
  failures.push(`removed keys ${JSON.stringify(removed)} !== approved ${JSON.stringify(APPROVED_REMOVALS.sort())}`)
}
if (!same(added, [...APPROVED_ADDITIONS].sort())) {
  failures.push(`added keys ${JSON.stringify(added)} !== approved ${JSON.stringify(APPROVED_ADDITIONS.sort())}`)
}

for (const type of oldKeys.filter(k => newKeys.includes(k))) {
  const before = baseline.SCREEN_TYPE_FUNCTIONS[type]
  const after = SCREEN_TYPE_FUNCTIONS[type]
  if (!same(before.functions, after.functions)) failures.push(`${type}: functions changed`)
  if (before.interaction !== after.interaction) failures.push(`${type}: interaction changed`)

  const helpers = baseline.helperOutputs[type]
  if (!same(helpers.getTypeInfo, getTypeInfo(type))) failures.push(`${type}: getTypeInfo output changed`)
  if (helpers.isPassive !== isPassive(type)) failures.push(`${type}: isPassive output changed`)
  if (helpers.isAssessed !== isAssessed(type)) failures.push(`${type}: isAssessed output changed`)
}

const unknown = baseline.unknownTypeBehaviour
if (getTypeInfo('nonexistent-type') !== unknown.getTypeInfo
  || isPassive('nonexistent-type') !== unknown.isPassive
  || isAssessed('nonexistent-type') !== unknown.isAssessed) {
  failures.push('unknown-type behaviour changed')
}
for (const type of APPROVED_REMOVALS) {
  if (getTypeInfo(type) !== null) failures.push(`${type}: expected null after approved removal`)
}
if (getTypeInfo('standard') !== null || isPassive('standard') || isAssessed('standard')) {
  failures.push('standard: container-derived exemption must keep it null/false/false')
}

// ── 2. Consumer-visible quality parity ──────────────────────────────────────
const qualityBaseline = readFileSync(`${BASELINES}/quality-output-baseline.json`, 'utf8')
const quality = {}
for (const id of Object.keys(CHAPTER_CONTENT_LOADERS).sort()) {
  const chapter = await CHAPTER_CONTENT_LOADERS[id]()
  const guardrails = guardrailViolations(chapter)
  const sentenceCase = sentenceCaseViolations(chapter)
  quality[id] = {
    guardrails,
    guardrailFingerprints: violationFingerprints(guardrails),
    sentenceCase,
    sentenceCaseFingerprints: violationFingerprints(sentenceCase),
  }
}
if (JSON.stringify(quality, null, 2) + '\n' !== qualityBaseline) {
  failures.push('quality output diverged from quality-output-baseline.json')
}

if (failures.length) {
  console.error('PARITY FAILURES:\n  - ' + failures.join('\n  - '))
  process.exit(1)
}
console.log(`parity — taxonomy identical for ${oldKeys.length - APPROVED_REMOVALS.length} retained types `
  + `(removed exactly ${APPROVED_REMOVALS.length}, added exactly ${APPROVED_ADDITIONS.length}); `
  + `quality output byte-identical for ${Object.keys(quality).length} chapters.`)

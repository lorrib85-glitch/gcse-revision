#!/usr/bin/env node
// On-demand content quality check for exactly one chapter — the technical
// pass content-review runs. Loads the chapter live via CHAPTER_CONTENT_LOADERS
// (the same map the app uses to open any chapter), so it works on any id
// with no static per-subject registry and no pre-registration/allowlist.
// The separate CI regression floor (tests/architecture/content-quality.test.js)
// enumerates every built chapter; this script deliberately does not.
//
// Usage: node scripts/check-content-quality.mjs <chapter-id>

import { CHAPTER_CONTENT_LOADERS } from '../src/content/chapterContentRegistry.js'
import { guardrailViolations, sentenceCaseViolations } from '../src/data/contentQualityChecks.js'

const [, , chapterId] = process.argv

if (!chapterId) {
  console.error('Usage: node scripts/check-content-quality.mjs <chapter-id>')
  process.exit(1)
}

const loader = CHAPTER_CONTENT_LOADERS[chapterId]
if (!loader) {
  console.error(`Unknown chapter id: ${chapterId}`)
  console.error(`Known ids: ${Object.keys(CHAPTER_CONTENT_LOADERS).sort().join(', ')}`)
  process.exit(1)
}

const episode = await loader()

if (!episode?.screens?.length) {
  console.log(`${chapterId}: no screens (stub) — nothing to check`)
  process.exit(0)
}

const guardrails = guardrailViolations(episode)
const sentenceCase = sentenceCaseViolations(episode)

console.log(`\n${chapterId} — content quality check (${episode.screens.length} screens)\n`)

console.log('Guardrails + readability:')
console.log(guardrails.length ? guardrails.map(v => `  - ${v.fingerprint}: ${v.message}`).join('\n') : '  none')

console.log('\nSentence case:')
console.log(sentenceCase.length ? sentenceCase.map(v => `  - ${v.fingerprint}: ${v.message}`).join('\n') : '  none')

console.log('')
process.exit(guardrails.length + sentenceCase.length > 0 ? 1 : 0)

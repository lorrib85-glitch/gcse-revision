#!/usr/bin/env node
// On-demand content quality check for exactly one module — the technical
// pass content-review runs. Loads the module live via MODULE_CONTENT_LOADERS
// (the same map the app uses to open any module), so it works on any id
// with no static per-subject registry and no pre-registration/allowlist.
// The separate CI regression floor (tests/architecture/content-quality.test.js)
// enumerates every built episode; this script deliberately does not.
//
// Usage: node scripts/check-content-quality.mjs <module-id>

import { MODULE_CONTENT_LOADERS } from '../src/content/moduleContentRegistry.js'
import { guardrailViolations, sentenceCaseViolations } from '../src/data/contentQualityChecks.js'

const [, , moduleId] = process.argv

if (!moduleId) {
  console.error('Usage: node scripts/check-content-quality.mjs <module-id>')
  process.exit(1)
}

const loader = MODULE_CONTENT_LOADERS[moduleId]
if (!loader) {
  console.error(`Unknown module id: ${moduleId}`)
  console.error(`Known ids: ${Object.keys(MODULE_CONTENT_LOADERS).sort().join(', ')}`)
  process.exit(1)
}

const episode = await loader()

if (!episode?.screens?.length) {
  console.log(`${moduleId}: no screens (stub) — nothing to check`)
  process.exit(0)
}

const guardrails = guardrailViolations(episode)
const sentenceCase = sentenceCaseViolations(episode)

console.log(`\n${moduleId} — content quality check (${episode.screens.length} screens)\n`)

console.log('Guardrails + readability:')
console.log(guardrails.length ? guardrails.map(v => `  - ${v}`).join('\n') : '  none')

console.log('\nSentence case:')
console.log(sentenceCase.length ? sentenceCase.map(v => `  - ${v}`).join('\n') : '  none')

console.log('')
process.exit(guardrails.length + sentenceCase.length > 0 ? 1 : 0)

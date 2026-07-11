// ─── Content quality checks ──────────────────────────────────────────────
// Pure functions computing readability, sentence-case and structural
// guardrail violations for a single episode object. No registry, no
// pre-registration — call these with any episode's content and get live
// results.
//
// Consumed by:
//   - scripts/check-content-quality.mjs — on-demand check for one module,
//     loaded via MODULE_CONTENT_LOADERS; this is what content-review runs.
//   - tests/architecture/content-quality.test.js — the separate CI
//     regression floor, which additionally enumerates every built episode
//     and keeps shrink-only grandfather allowlists. That enumeration is a
//     property of the regression-floor test, not of these functions.

import { isPassive, isAssessed } from './componentFunctions.js'

// Compulsory GCSE subject vocabulary, exempt from readability scoring.
// GCSE deliberately introduces difficult vocabulary — it stays, and must
// be explained on first use; it's the language AROUND it that must be
// plain. Extend per subject as content is built or reviewed.
export const EXAM_VOCABULARY = [
  // History — Medicine Through Time
  'miasma', 'humours', 'bloodletting', 'purging', 'apothecary',
  'physician', 'anatomy', 'dissection', 'inoculation', 'vaccination',
  'anaesthetic', 'antiseptic', 'aseptic', 'pasteurisation', 'penicillin',
  'chemotherapy', 'radiotherapy', 'diagnosis', 'epidemic', 'quarantine',
  'supernatural', 'astrology', 'flagellants', 'laissez-faire',
  // Science (seed list — extend in Phase 5 content work)
  'osmosis', 'diffusion', 'photosynthesis', 'respiration', 'mitosis',
  'enzyme', 'chromosome', 'organelle', 'eukaryotic', 'prokaryotic',
]

// Heuristic syllable count — adequate for a pass/fail floor, not linguistics.
function countSyllables(word) {
  const w = word.toLowerCase().replace(/[^a-z]/g, '')
  if (w.length <= 3) return 1
  const stripped = w.replace(/(?:[^laeiouy]e|ed)$/, '')
  const groups = stripped.match(/[aeiouy]{1,2}/g)
  return Math.max(1, groups ? groups.length : 1)
}

export function fleschKincaidGrade(text) {
  const plain = text
    .replace(/<[^>]+>/g, ' ') // strip inline HTML used by read blocks
    .replace(/[•▪–—]/g, '. ') // bullets act as sentence breaks
  const sentences = plain.split(/[.!?]+/).map(s => s.trim()).filter(Boolean)
  const words = plain.split(/\s+/).map(w => w.replace(/[^a-zA-Z'-]/g, '')).filter(Boolean)
  if (sentences.length === 0 || words.length === 0) return 0
  const syllables = words.reduce((sum, w) => sum + countSyllables(w), 0)
  return 0.39 * (words.length / sentences.length) + 11.8 * (syllables / words.length) - 15.59
}

// Replace exempt vocabulary with a one-syllable neutral token so the
// compulsory terms don't skew the score of the language around them.
export function stripExamVocabulary(text) {
  let out = text
  for (const term of EXAM_VOCABULARY) {
    out = out.replace(new RegExp(`\\b${term}\\b`, 'gi'), 'term')
  }
  return out
}

// Learner-facing strings on a screen: headings, subs, block text/labels,
// questions, options, explanations, feedback — walked recursively.
const TEXT_KEYS = new Set([
  'heading', 'sub', 'text', 'question', 'explanation', 'hint',
  'wrongFeedback', 'correctFeedback', 'detail', 'body', 'verdict',
  'significance', 'punchline', 'tagline', 'intro',
])

export function collectLearnerText(node, out = []) {
  if (typeof node !== 'object' || node === null) return out.join(' ')
  for (const [key, value] of Object.entries(node)) {
    if (typeof value === 'string' && TEXT_KEYS.has(key)) out.push(value)
    else if (typeof value === 'object') collectLearnerText(value, out)
  }
  return out.join(' ')
}

export const READABILITY_GRADE_CEILING = 7

function isPassiveScreen(screen) {
  const types = [screen.type, ...(screen.blocks ?? []).map(b => b.type)].filter(Boolean)
  if (types.length === 0) return true
  return types.every(t => isPassive(t))
}

function hasAssessedScreen(screens) {
  return screens.some(s =>
    [s.type, ...(s.blocks ?? []).map(b => b.type)].filter(Boolean).some(t => isAssessed(t)),
  )
}

// ⚙ guardrails from docs/system/CONTENT_BUILD_TEMPLATE.md: max 2 consecutive
// passive screens, every teaching stage has an assessed screen, sane
// stageNavigation, and per-screen readability against the grade ceiling.
export function guardrailViolations(ep) {
  const violations = []
  const screens = ep.screens ?? []

  let run = 0
  screens.forEach((s, i) => {
    run = isPassiveScreen(s) ? run + 1 : 0
    if (run === 3) violations.push(`3 consecutive passive screens ending at index ${i}`)
  })

  const stages = ep.stageNavigation ?? []
  stages.forEach((stage, i) => {
    if (i > 0 && stage.screenIndex <= stages[i - 1].screenIndex) {
      violations.push(`stageNavigation "${stage.id}" screenIndex not strictly increasing`)
    }
    if (stage.screenIndex < 0 || stage.screenIndex >= screens.length) {
      violations.push(`stageNavigation "${stage.id}" screenIndex out of bounds`)
    }
  })
  stages.slice(0, -1).forEach((stage, i) => {
    const end = stages[i + 1]?.screenIndex ?? screens.length
    const segment = screens.slice(stage.screenIndex, end)
    if (segment.length > 0 && !hasAssessedScreen(segment)) {
      violations.push(`teaching stage "${stage.id}" has no assessed screen`)
    }
  })

  screens.forEach((s, i) => {
    const text = stripExamVocabulary(collectLearnerText(s))
    if (text.split(/\s+/).filter(Boolean).length < 10) return // too short to score
    const grade = fleschKincaidGrade(text)
    if (grade > READABILITY_GRADE_CEILING) {
      violations.push(`screen ${i} readability grade ${grade.toFixed(1)} > ${READABILITY_GRADE_CEILING}`)
    }
  })

  return violations
}

// P7 sentence-case guard: CLAUDE.md requires sentence case for all
// titles/headings written into the codebase. Flags runs of 2+ consecutive
// capitalised non-first words in label/title/heading/sub fields that
// aren't a known proper noun/named term.
export const PROPER_NOUNS = [
  'Black Death', 'Great Plague', 'Great Stink', 'Zodiac Man',
  'Regimen Sanitatis', 'John Bradmore', 'Henry V', 'Alexandre Yersin',
  'Robert Koch', 'John Snow', 'Joseph Bazalgette', 'Robert Liston',
  'West End', 'William Morton', 'James Simpson', 'Queen Victoria',
  'William Halsted', 'Karl Landsteiner', 'Howard Florey', 'Ernst Chain',
  'Alexander Fleming', "St Mary's Hospital", 'Oxford University',
  'National Health Service', 'Aneurin Bevan', 'Nobel Prize',
  'Raymond Damadian', 'Rosalind Franklin', 'South Africa',
  'Magnetic Resonance Imaging', 'Public Health Act', 'Edwin Chadwick',
  'Royal Society', 'Royal College', 'Clement Attlee',
  'National Insurance Act', 'Medical Association', 'First World War',
  'Sir Robert Jones', 'Hugh Owen Thomas', 'Western Front',
  'Regimental Aid Post', 'Main Dressing Station', 'Advanced Dressing Station',
  'Casualty Clearing Station', "Queen Mary's Hospital", 'Swan-Neck Flask',
  'Spontaneous Generation', 'National Insurance', 'Human Body',
  'De Humani Corporis Fabrica', 'De Motu Cordis',
]

const TITLE_CASE_KEYS = new Set(['label', 'title', 'heading', 'sub'])

function isCapitalisedWord(word) {
  return /^[A-Z]/.test(word) && word.toLowerCase() !== word && word.toUpperCase() !== word
}

function isKnownProperNoun(w1, w2) {
  return PROPER_NOUNS.some(pn => pn.includes(w1) && pn.includes(w2))
}

function findTitleCaseRuns(text) {
  const words = text.split(/\s+/).filter(Boolean)
  const runs = []
  for (let i = 1; i < words.length - 1; i++) {
    const w1 = words[i].replace(/[^\w'-]/g, '')
    const w2 = words[i + 1].replace(/[^\w'-]/g, '')
    if (!w1 || !w2) continue
    if (isCapitalisedWord(w1) && isCapitalisedWord(w2) && !isKnownProperNoun(w1, w2)) {
      runs.push(`${w1} ${w2}`)
    }
  }
  return runs
}

function collectTitleCaseFields(node, out = []) {
  if (typeof node !== 'object' || node === null) return out
  for (const [key, value] of Object.entries(node)) {
    if (typeof value === 'string' && TITLE_CASE_KEYS.has(key)) out.push(value)
    else if (typeof value === 'object') collectTitleCaseFields(value, out)
  }
  return out
}

export function sentenceCaseViolations(ep) {
  const violations = []
  for (const field of collectTitleCaseFields(ep)) {
    for (const run of findTitleCaseRuns(field)) {
      violations.push(`"${run}" in "${field}"`)
    }
  }
  return violations
}

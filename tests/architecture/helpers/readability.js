import { EXAM_VOCABULARY } from './examVocabulary.js'

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

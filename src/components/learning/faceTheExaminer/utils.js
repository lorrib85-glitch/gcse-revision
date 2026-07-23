import { GENERAL } from '../../../constants/generalTheme.js'

export const IMAGES = {
  History: '/historybacker.webp',
  Biology: '/biologybacker.webp',
  Maths: '/mathsbacker.webp',
  Sociology: '/sociologybacker.webp',
  Chemistry: '/chemsistrybacker.webp',
  Physics: '/physicsbacker.webp',
  English: '/Englishbacker.webp',
}

export function annotationStyle(type, accent) {
  const colour = type === 'strong'
    ? GENERAL.feedbackCorrect
    : type === 'irrelevant'
      ? GENERAL.feedbackIncorrect
      : accent

  return {
    borderBottom: `1.5px solid ${colour}99`,
    color: 'inherit',
    opacity: type === 'irrelevant' ? 0.65 : 1,
  }
}

export function annotationDot(type, accent) {
  if (type === 'strong') return GENERAL.feedbackCorrect
  if (type === 'irrelevant') return GENERAL.feedbackIncorrect
  return accent
}

export const TAB_LABELS = {
  answer: 'Student answer',
  marking: 'Examiner view',
}

function warnAnnotation(message) {
  if (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production') {
    console.warn(message)
  }
}

export function findOccurrenceIndex(text = '', target = '', occurrence = 1) {
  if (!target) return -1

  const requestedOccurrence = Number.isInteger(occurrence) && occurrence > 0 ? occurrence : 1
  let cursor = 0
  let foundIndex = -1

  for (let current = 0; current < requestedOccurrence; current += 1) {
    foundIndex = text.indexOf(target, cursor)
    if (foundIndex === -1) return -1
    cursor = foundIndex + target.length
  }

  return foundIndex
}

export function resolveAnnotationRange(text = '', annotation = {}) {
  const target = String(annotation.target || '')
  const start = findOccurrenceIndex(text, target, annotation.occurrence)
  if (start === -1) return null

  return {
    annotation,
    start,
    end: start + target.length,
  }
}

export function buildAnnotatedSegments(text = '', annotations = []) {
  const source = String(text || '')
  const ranges = annotations
    .map(annotation => {
      const range = resolveAnnotationRange(source, annotation)
      if (!range) warnAnnotation(`FTE: annotation "${annotation.id}" target not found`)
      return range
    })
    .filter(Boolean)
    .sort((left, right) => left.start - right.start)

  let cursor = 0
  const segments = []

  ranges.forEach(range => {
    if (range.start < cursor) {
      warnAnnotation(`FTE: annotation "${range.annotation.id}" overlaps an earlier annotation`)
      return
    }

    if (range.start > cursor) {
      segments.push({ type: 'plain', text: source.slice(cursor, range.start) })
    }

    segments.push({
      type: 'ann',
      ann: range.annotation,
      text: source.slice(range.start, range.end),
    })
    cursor = range.end
  })

  if (cursor < source.length) segments.push({ type: 'plain', text: source.slice(cursor) })
  return segments
}

export function replaceAnnotatedTargets(text = '', annotations = [], edits = {}) {
  const source = String(text || '')
  const replacements = annotations
    .map(annotation => {
      const replacement = String(edits[annotation.id] || '').trim()
      if (!replacement) return null
      const range = resolveAnnotationRange(source, annotation)
      return range ? { ...range, replacement } : null
    })
    .filter(Boolean)
    .sort((left, right) => right.start - left.start)

  return replacements.reduce(
    (answer, replacement) => answer.slice(0, replacement.start) + replacement.replacement + answer.slice(replacement.end),
    source,
  )
}

export function getPrimaryImprovementAnnotation(annotations = [], preferredId) {
  const weakAnnotations = annotations.filter(annotation => annotation.type === 'weak')
  if (preferredId) {
    const preferred = weakAnnotations.find(annotation => annotation.id === preferredId)
    if (preferred) return preferred
  }
  return weakAnnotations[0] || null
}

export function buildAnswerSections(text = '', explicitSections = []) {
  const suppliedSections = Array.isArray(explicitSections)
    ? explicitSections
      .map((section, index) => ({
        label: String(section?.label || `Section ${index + 1}`),
        text: String(section?.text || '').trim(),
      }))
      .filter(section => section.text)
    : []

  if (suppliedSections.length > 0) return suppliedSections

  const clean = String(text || '').trim()
  if (!clean) return []

  const markerPattern = /\b(Firstly|Secondly|First|Second|One way|Another way),?/gi
  const matches = [...clean.matchAll(markerPattern)]
    .map(match => match.index)
    .filter(index => typeof index === 'number')
    .sort((left, right) => left - right)

  if (matches.length < 2) return [{ label: 'Student answer', text: clean }]

  const sections = []
  const intro = clean.slice(0, matches[0]).trim()
  if (intro) sections.push({ label: 'Opening judgement', text: intro })

  matches.forEach((start, index) => {
    const end = matches[index + 1] ?? clean.length
    sections.push({
      label: index === 0 ? 'Way 1' : `Way ${index + 1}`,
      text: clean.slice(start, end).trim(),
    })
  })

  return sections
}

export function markComparisonText(guessedMark, examinerMark) {
  if (guessedMark === null) return ''
  const diff = guessedMark - examinerMark
  if (diff === 0) return 'You matched the examiner.'
  if (Math.abs(diff) === 1) return 'You were close.'
  if (diff < 0) return 'You were harsher than the examiner.'
  return 'You were more generous than the examiner.'
}

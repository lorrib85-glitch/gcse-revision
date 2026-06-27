export const IMAGES = {
  History: '/historybacker.webp',
  Biology: '/biologybacker.webp',
  Maths: '/mathsbacker.webp',
  Sociology: '/sociologybacker.webp',
  Chemistry: '/chemsistrybacker.webp',
  Physics: '/physicsbacker.webp',
  English: '/Englishbacker.webp',
}

export const ANN_STYLES = {
  strong: { borderBottom: '1.5px solid rgba(143,214,163,0.55)', color: 'inherit' },
  weak: { borderBottom: '1.5px solid rgba(232,169,58,0.6)', color: 'inherit' },
  irrelevant: { borderBottom: '1.5px solid rgba(192,80,85,0.5)', color: 'inherit', opacity: 0.65 },
}

export const ANN_DOT = {
  strong: 'rgba(143,214,163,0.8)',
  weak: 'rgba(232,169,58,0.85)',
  irrelevant: 'rgba(192,80,85,0.7)',
}

export const TAB_LABELS = {
  answer: 'Model answer',
  marking: 'Examiner view',
}

export function buildAnnotatedSegments(text, annotations = []) {
  let cursor = 0
  const segments = []
  for (const ann of annotations) {
    const idx = text.indexOf(ann.target, cursor)
    if (idx === -1) {
      if (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production') {
        console.warn(`FTE: annotation "${ann.id}" target not found`)
      }
      continue
    }
    if (idx > cursor) segments.push({ type: 'plain', text: text.slice(cursor, idx) })
    segments.push({ type: 'ann', ann, text: ann.target })
    cursor = idx + ann.target.length
  }
  if (cursor < text.length) segments.push({ type: 'plain', text: text.slice(cursor) })
  return segments
}

export function buildAnswerSections(text = '') {
  const clean = text.trim()
  if (!clean) return []

  const markerPattern = /\b(Firstly|Secondly|First|Second|One way|Another way),?/gi
  const matches = [...clean.matchAll(markerPattern)]
    .map(match => match.index)
    .filter(index => typeof index === 'number')
    .sort((a, b) => a - b)

  if (matches.length < 2) return [{ label: 'Model answer', text: clean }]

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

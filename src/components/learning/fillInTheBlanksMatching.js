const MATHS_SYMBOL_PATTERN = /[+\-−×÷*\/=^²³%⁄]/
const NUMERIC_PATTERN = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i

function asString(value) {
  return value == null ? '' : String(value)
}

function normaliseSymbols(value) {
  return asString(value)
    .normalize('NFKC')
    .replace(/[−–—]/g, '-')
    .replace(/[×·]/g, '*')
    .replace(/÷/g, '/')
    .replace(/⁄/g, '/')
    .replace(/²/g, '^2')
    .replace(/³/g, '^3')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
}

function applyCase(value, caseSensitive) {
  return caseSensitive ? value : value.toLocaleLowerCase('en-GB')
}

export function normaliseTextAnswer(value, { caseSensitive = false } = {}) {
  const normalised = normaliseSymbols(value)
    .replace(/[^\p{L}\p{N}\s]/gu, '')
    .replace(/\s+/g, ' ')
    .trim()

  return applyCase(normalised, caseSensitive)
}

export function normaliseExactAnswer(value, { caseSensitive = false } = {}) {
  const normalised = normaliseSymbols(value)
    .replace(/\s+/g, '')
    .trim()

  return applyCase(normalised, caseSensitive)
}

export function parseNumericAnswer(value) {
  const normalised = normaliseSymbols(value)
    .replace(/,/g, '')
    .replace(/\s+/g, '')

  if (!normalised) return null

  if (normalised.endsWith('%')) {
    const percentage = normalised.slice(0, -1)
    if (!NUMERIC_PATTERN.test(percentage)) return null
    return Number(percentage) / 100
  }

  const fractionParts = normalised.split('/')
  if (fractionParts.length === 2) {
    const [numerator, denominator] = fractionParts
    if (!NUMERIC_PATTERN.test(numerator) || !NUMERIC_PATTERN.test(denominator)) return null
    const divisor = Number(denominator)
    if (divisor === 0) return null
    return Number(numerator) / divisor
  }

  if (!NUMERIC_PATTERN.test(normalised)) return null
  return Number(normalised)
}

export function resolveFillBlankMatchMode(sentence = {}) {
  if (sentence.matchMode) return sentence.matchMode

  const answer = asString(sentence.answer)
  return MATHS_SYMBOL_PATTERN.test(answer) ? 'numeric' : 'text'
}

function levenshtein(a, b) {
  const rows = a.length
  const columns = b.length
  const matrix = Array.from({ length: rows + 1 }, (_, row) =>
    Array.from({ length: columns + 1 }, (_, column) => (
      row === 0 ? column : column === 0 ? row : 0
    ))
  )

  for (let row = 1; row <= rows; row += 1) {
    for (let column = 1; column <= columns; column += 1) {
      matrix[row][column] = a[row - 1] === b[column - 1]
        ? matrix[row - 1][column - 1]
        : 1 + Math.min(
          matrix[row - 1][column],
          matrix[row][column - 1],
          matrix[row - 1][column - 1],
        )
    }
  }

  return matrix[rows][columns]
}

export function checkFillBlankAnswer(input, sentence = {}) {
  const targets = [sentence.answer, ...(sentence.acceptedAnswers || [])]
    .filter(value => value !== undefined && value !== null && asString(value).trim() !== '')

  if (!asString(input).trim() || targets.length === 0) return false

  const matchMode = resolveFillBlankMatchMode(sentence)
  const caseSensitive = sentence.caseSensitive === true

  if (matchMode === 'numeric') {
    const inputValue = parseNumericAnswer(input)
    if (inputValue === null) return false

    const tolerance = Number.isFinite(sentence.tolerance) ? sentence.tolerance : 1e-9
    return targets.some(target => {
      const targetValue = parseNumericAnswer(target)
      return targetValue !== null && Math.abs(inputValue - targetValue) <= tolerance
    })
  }

  if (matchMode === 'exact' || matchMode === 'formula') {
    const inputValue = normaliseExactAnswer(input, { caseSensitive })
    return targets.some(target => (
      inputValue === normaliseExactAnswer(target, { caseSensitive })
    ))
  }

  const inputValue = normaliseTextAnswer(input, { caseSensitive })
  if (!inputValue) return false

  return targets.some(target => {
    const targetValue = normaliseTextAnswer(target, { caseSensitive })
    if (inputValue === targetValue) return true
    if (sentence.allowTypos === false) return false

    const maxDistance = targetValue.length <= 4 ? 0 : targetValue.length <= 7 ? 1 : 2
    return levenshtein(inputValue, targetValue) <= maxDistance
  })
}

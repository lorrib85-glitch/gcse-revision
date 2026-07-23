import { describe, expect, it } from 'vitest'
import {
  buildAnnotatedSegments,
  buildAnswerSections,
  findOccurrenceIndex,
  getPrimaryImprovementAnnotation,
  replaceAnnotatedTargets,
} from '../../../src/components/learning/faceTheExaminer/utils.js'

describe('FaceTheExaminer annotation utilities', () => {
  it('finds the requested occurrence of repeated evidence', () => {
    const answer = 'Evidence matters. Evidence matters again.'
    expect(findOccurrenceIndex(answer, 'Evidence', 2)).toBe(18)
  })

  it('builds annotated segments in source order even when annotations are supplied out of order', () => {
    const answer = 'First point. Second point.'
    const annotations = [
      { id: 'second', target: 'Second point.', type: 'weak' },
      { id: 'first', target: 'First point.', type: 'strong' },
    ]

    expect(buildAnnotatedSegments(answer, annotations)).toEqual([
      { type: 'ann', ann: annotations[1], text: 'First point.' },
      { type: 'plain', text: ' ' },
      { type: 'ann', ann: annotations[0], text: 'Second point.' },
    ])
  })

  it('replaces the annotated sentence rather than appending an improvement after it', () => {
    const answer = 'The Church ran hospitals. Prayer was used.'
    const annotations = [
      { id: 'hospital', target: 'The Church ran hospitals.', type: 'weak' },
    ]

    expect(replaceAnnotatedTargets(answer, annotations, {
      hospital: 'The Church ran hospitals because caring for the sick was a Christian duty.',
    })).toBe('The Church ran hospitals because caring for the sick was a Christian duty. Prayer was used.')
  })

  it('uses the occurrence field when replacing repeated text', () => {
    const answer = 'This was important. This was important.'
    const annotations = [
      { id: 'second', target: 'This was important.', occurrence: 2, type: 'weak' },
    ]

    expect(replaceAnnotatedTargets(answer, annotations, {
      second: 'This mattered because it changed treatment.',
    })).toBe('This was important. This mattered because it changed treatment.')
  })
})

describe('FaceTheExaminer content normalisation', () => {
  it('prefers explicit cross-subject answer sections over English connective detection', () => {
    const sections = [
      { label: 'Method', text: 'Calculate the gradient.' },
      { label: 'Conclusion', text: 'The line is steeper.' },
    ]

    expect(buildAnswerSections('Ignored fallback text', sections)).toEqual(sections)
  })

  it('falls back to one neutral student-answer section', () => {
    expect(buildAnswerSections('A single paragraph.')).toEqual([
      { label: 'Student answer', text: 'A single paragraph.' },
    ])
  })

  it('uses the configured primary weakness when it exists', () => {
    const annotations = [
      { id: 'first', type: 'weak' },
      { id: 'preferred', type: 'weak' },
      { id: 'strong', type: 'strong' },
    ]

    expect(getPrimaryImprovementAnnotation(annotations, 'preferred')).toEqual(annotations[1])
  })
})

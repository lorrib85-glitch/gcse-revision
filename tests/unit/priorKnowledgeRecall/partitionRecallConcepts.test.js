import { describe, it, expect } from 'vitest'
import { partitionRecallConcepts } from '../../../src/components/learning/PriorKnowledgeRecall.jsx'

describe('partitionRecallConcepts', () => {
  it('puts every concept in missing and none in recalled when all scores are below 0.7', () => {
    const concepts = [
      { tag: 'hippocrates', label: 'Hippocrates', score: 0.1 },
      { tag: 'four-humours', label: 'Four humours', score: 0.2 },
      { tag: 'galen', label: 'Galen', score: 0.35 },
    ]

    const { recalled, missing } = partitionRecallConcepts(concepts)

    expect(recalled).toHaveLength(0)
    expect(missing.map(c => c.tag)).toEqual(['hippocrates', 'four-humours', 'galen'])
  })

  it('never places the same concept in both recalled and missing', () => {
    const concepts = [
      { tag: 'hippocrates', label: 'Hippocrates', score: 0.1 },
      { tag: 'four-humours', label: 'Four humours', score: 0.2 },
      { tag: 'galen', label: 'Galen', score: 0.35 },
      { tag: 'black-death', label: 'Black Death', score: 0.9 },
    ]

    const { recalled, missing } = partitionRecallConcepts(concepts)
    const recalledTags = new Set(recalled.map(c => c.tag))
    const overlap = missing.filter(c => recalledTags.has(c.tag))

    expect(overlap).toHaveLength(0)
    expect(recalled.map(c => c.tag)).toEqual(['black-death'])
  })

  it('treats a score exactly at the 0.7 threshold as recalled, not missing', () => {
    const concepts = [{ tag: 'galen', label: 'Galen', score: 0.7 }]

    const { recalled, missing } = partitionRecallConcepts(concepts)

    expect(recalled.map(c => c.tag)).toEqual(['galen'])
    expect(missing).toHaveLength(0)
  })
})

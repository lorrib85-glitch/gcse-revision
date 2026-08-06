import { describe, it, expect } from 'vitest'
import { COMPONENT_TEXT_LIMITS } from '../../src/constants/contentLimits.js'
import {
  CHAPTER_CONTENT_LOADERS,
} from '../../src/data/learnerCurriculum.js'

function collectFactorWebs(node, path = [], out = []) {
  if (Array.isArray(node)) {
    node.forEach((item, index) => collectFactorWebs(item, [...path, index], out))
    return out
  }

  if (!node || typeof node !== 'object') return out

  if (node.type === 'factorWeb') {
    out.push({ block: node, path: path.join('.') })
  }

  Object.entries(node).forEach(([key, value]) => {
    if (key === 'factors') return
    if (value && typeof value === 'object') collectFactorWebs(value, [...path, key], out)
  })

  return out
}

function visibleTitle(block) {
  return block.title || block.kicker || block.question || ''
}

describe('FactorWeb content limits', () => {
  it('keeps every registered FactorWeb within the governed mobile authoring limits', async () => {
    const violations = []

    for (const [chapterId, load] of Object.entries(CHAPTER_CONTENT_LOADERS)) {
      const episode = await load()
      const factorWebs = collectFactorWebs(episode)

      factorWebs.forEach(({ block, path }) => {
        const title = visibleTitle(block)
        const judgementTitle = block.judgementTitle || 'Which factor mattered most?'
        const centreLabel = block.centreLabel || block.centerLabel || 'Key factors'
        const factors = block.factors || []

        if (!title) {
          violations.push(`${chapterId}:${path} has no visible title`)
        } else if ([...title].length > COMPONENT_TEXT_LIMITS.factorWeb.title) {
          violations.push(
            `${chapterId}:${path} title is ${[...title].length} characters; maximum is ${COMPONENT_TEXT_LIMITS.factorWeb.title}: “${title}”`,
          )
        }

        if ([...judgementTitle].length > COMPONENT_TEXT_LIMITS.factorWeb.title) {
          violations.push(
            `${chapterId}:${path} judgementTitle is ${[...judgementTitle].length} characters; maximum is ${COMPONENT_TEXT_LIMITS.factorWeb.title}: “${judgementTitle}”`,
          )
        }

        if ([...centreLabel].length > COMPONENT_TEXT_LIMITS.factorWeb.centreLabel) {
          violations.push(
            `${chapterId}:${path} centreLabel is ${[...centreLabel].length} characters; maximum is ${COMPONENT_TEXT_LIMITS.factorWeb.centreLabel}: “${centreLabel}”`,
          )
        }

        if (factors.length < 4 || factors.length > 6) {
          violations.push(
            `${chapterId}:${path} has ${factors.length} factors; FactorWeb supports 4–6 for the governed split layout`,
          )
        }

        factors.forEach((factor, index) => {
          const nodeLabel = factor.shortTitle || factor.title || ''
          if (!factor.id) {
            violations.push(`${chapterId}:${path}.factors.${index} has no stable id`)
          }
          if (!nodeLabel) {
            violations.push(`${chapterId}:${path}.factors.${index} has no visible node label`)
          } else if ([...nodeLabel].length > COMPONENT_TEXT_LIMITS.factorWeb.nodeLabel) {
            violations.push(
              `${chapterId}:${path}.factors.${index} node label is ${[...nodeLabel].length} characters; maximum is ${COMPONENT_TEXT_LIMITS.factorWeb.nodeLabel}: “${nodeLabel}”`,
            )
          }
        })

        if ((block.centreImage || block.centerImage) && !(block.centreImageAlt || block.centerImageAlt)) {
          violations.push(`${chapterId}:${path} has a centre image without meaningful alt text`)
        }
      })
    }

    expect(
      violations,
      `FactorWeb content exceeds the governed mobile limits:\n${violations.join('\n')}`,
    ).toEqual([])
  })
})

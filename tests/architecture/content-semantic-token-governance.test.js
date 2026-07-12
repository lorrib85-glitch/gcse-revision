import { describe, it, expect } from 'vitest'
import { MODULES } from '../../src/modules.js'
import { MODULE_CONTENT_LOADERS } from '../../src/content/moduleContentRegistry.js'

const PRESENTATION_KEYS = new Set(['color', 'colorRgb', 'bg', 'colorLight'])

// Legacy content-data presentation ownership. Shrink only; new content should
// use semantic inputs such as tone/variant/theme key, not raw color/bg data.
const LEGACY_PRESENTATION_FIELDS = {
  'history-medicine-medieval-beliefs-causes': ['screens[19].blocks[0].columns[0].bg','screens[19].blocks[0].columns[0].color','screens[19].blocks[0].columns[1].bg','screens[19].blocks[0].columns[1].color','screens[23].columns[0].bg','screens[23].columns[0].color','screens[23].columns[0].colorRgb','screens[23].columns[1].bg','screens[23].columns[1].color','screens[23].columns[1].colorRgb'],
  'history-medicine-black-death': ['screens[9].columns[0].bg','screens[9].columns[0].color','screens[9].columns[0].colorRgb','screens[9].columns[1].bg','screens[9].columns[1].color','screens[9].columns[1].colorRgb','screens[17].columns[0].bg','screens[17].columns[0].color','screens[17].columns[0].colorRgb','screens[17].columns[1].bg','screens[17].columns[1].color','screens[17].columns[1].colorRgb'],
  'history-medicine-renaissance-medicine': ['screens[12].columns[0].bg','screens[12].columns[0].color','screens[12].columns[0].colorRgb','screens[12].columns[1].bg','screens[12].columns[1].color','screens[12].columns[1].colorRgb'],
  'history-medicine-vesalius-beginning-doubt': ['screens[8].blocks[0].columns[0].bg','screens[8].blocks[0].columns[0].color','screens[8].blocks[0].columns[1].bg','screens[8].blocks[0].columns[1].color'],
  'history-medicine-harvey-pare-renaissance-method': ['screens[8].columns[0].bg','screens[8].columns[0].color','screens[8].columns[0].colorRgb','screens[8].columns[1].bg','screens[8].columns[1].color','screens[8].columns[1].colorRgb'],
  'history-medicine-great-plague-1665': ['screens[8].columns[0].bg','screens[8].columns[0].color','screens[8].columns[0].colorRgb','screens[8].columns[1].bg','screens[8].columns[1].color','screens[8].columns[1].colorRgb'],
  'history-medicine-surgery-revolution': ['screens[4].blocks[3].columns[0].bg','screens[4].blocks[3].columns[0].color','screens[4].blocks[3].columns[1].bg','screens[4].blocks[3].columns[1].color','screens[7].blocks[0].people[0].color','screens[7].blocks[0].people[1].color','screens[7].blocks[0].people[2].color','screens[7].blocks[0].people[3].color','screens[7].blocks[0].people[4].color'],
  'history-medicine-accidental-miracle': ['screens[5].blocks[2].columns[0].bg','screens[5].blocks[2].columns[0].color','screens[5].blocks[2].columns[1].bg','screens[5].blocks[2].columns[1].color','screens[5].blocks[2].columns[2].bg','screens[5].blocks[2].columns[2].color'],
  'history-medicine-modern-medicine': ['screens[2].blocks[1].columns[0].bg','screens[2].blocks[1].columns[0].color','screens[2].blocks[1].columns[1].bg','screens[2].blocks[1].columns[1].color','screens[4].blocks[1].columns[0].bg','screens[4].blocks[1].columns[0].color','screens[4].blocks[1].columns[1].bg','screens[4].blocks[1].columns[1].color','screens[5].blocks[1].columns[0].bg','screens[5].blocks[1].columns[0].color','screens[5].blocks[1].columns[1].bg','screens[5].blocks[1].columns[1].color','screens[5].blocks[1].columns[2].bg','screens[5].blocks[1].columns[2].color'],
  'history-medicine-cancer': ['screens[3].blocks[2].columns[0].bg','screens[3].blocks[2].columns[0].color','screens[3].blocks[2].columns[1].bg','screens[3].blocks[2].columns[1].color','screens[6].blocks[1].columns[0].bg','screens[6].blocks[1].columns[0].color','screens[6].blocks[1].columns[1].bg','screens[6].blocks[1].columns[1].color'],
  soc1: ['screens[0].blocks[1].columns[0].bg','screens[0].blocks[1].columns[0].color','screens[0].blocks[1].columns[1].bg','screens[0].blocks[1].columns[1].color','screens[2].blocks[2].columns[0].bg','screens[2].blocks[2].columns[0].color','screens[2].blocks[2].columns[1].bg','screens[2].blocks[2].columns[1].color','screens[4].blocks[1].columns[0].bg','screens[4].blocks[1].columns[0].color','screens[4].blocks[1].columns[1].bg','screens[4].blocks[1].columns[1].color','screens[5].blocks[1].columns[0].bg','screens[5].blocks[1].columns[0].color','screens[5].blocks[1].columns[1].bg','screens[5].blocks[1].columns[1].color','screens[7].blocks[1].columns[0].bg','screens[7].blocks[1].columns[0].color','screens[7].blocks[1].columns[1].bg','screens[7].blocks[1].columns[1].color'],
  soc2: ['screens[3].blocks[1].columns[0].bg','screens[3].blocks[1].columns[0].color','screens[3].blocks[1].columns[1].bg','screens[3].blocks[1].columns[1].color','screens[7].blocks[1].columns[0].bg','screens[7].blocks[1].columns[0].color','screens[7].blocks[1].columns[1].bg','screens[7].blocks[1].columns[1].color','screens[7].blocks[1].columns[2].bg','screens[7].blocks[1].columns[2].color','screens[9].blocks[1].columns[0].bg','screens[9].blocks[1].columns[0].color','screens[9].blocks[1].columns[1].bg','screens[9].blocks[1].columns[1].color','screens[10].blocks[1].columns[0].bg','screens[10].blocks[1].columns[0].color','screens[10].blocks[1].columns[1].bg','screens[10].blocks[1].columns[1].color'],
  soc3: ['screens[1].blocks[1].columns[0].bg','screens[1].blocks[1].columns[0].color','screens[1].blocks[1].columns[1].bg','screens[1].blocks[1].columns[1].color','screens[1].blocks[1].columns[2].bg','screens[1].blocks[1].columns[2].color','screens[4].blocks[2].columns[0].bg','screens[4].blocks[2].columns[0].color','screens[4].blocks[2].columns[1].bg','screens[4].blocks[2].columns[1].color','screens[4].blocks[2].columns[2].bg','screens[4].blocks[2].columns[2].color'],
  soc4: ['screens[0].blocks[4].columns[0].bg','screens[0].blocks[4].columns[0].color','screens[0].blocks[4].columns[1].bg','screens[0].blocks[4].columns[1].color','screens[0].blocks[4].columns[2].bg','screens[0].blocks[4].columns[2].color','screens[0].blocks[4].columns[3].bg','screens[0].blocks[4].columns[3].color','screens[2].blocks[2].columns[0].bg','screens[2].blocks[2].columns[0].color','screens[2].blocks[2].columns[1].bg','screens[2].blocks[2].columns[1].color','screens[2].blocks[2].columns[2].bg','screens[2].blocks[2].columns[2].color','screens[3].blocks[2].columns[0].bg','screens[3].blocks[2].columns[0].color','screens[3].blocks[2].columns[1].bg','screens[3].blocks[2].columns[1].color','screens[4].blocks[3].columns[0].bg','screens[4].blocks[3].columns[0].color','screens[4].blocks[3].columns[1].bg','screens[4].blocks[3].columns[1].color'],
  soc6: ['screens[2].blocks[3].columns[0].bg','screens[2].blocks[3].columns[0].color','screens[2].blocks[3].columns[1].bg','screens[2].blocks[3].columns[1].color'],
}

function collectPresentationFields(node, path = 'screens', out = []) {
  if (!node || typeof node !== 'object') return out
  if (Array.isArray(node)) {
    node.forEach((item, index) => collectPresentationFields(item, `${path}[${index}]`, out))
    return out
  }
  for (const [key, value] of Object.entries(node)) {
    const nextPath = `${path}.${key}`
    if (PRESENTATION_KEYS.has(key)) out.push(nextPath)
    collectPresentationFields(value, nextPath, out)
  }
  return out
}

describe('Semantic content-data token governance', () => {
  it('prevents runtime screens/reveals/interactions from owning raw presentation fields', async () => {
    for (const mod of MODULES.filter(m => m.screenCount > 0)) {
      const content = await MODULE_CONTENT_LOADERS[mod.id]()
      const actual = collectPresentationFields(content.screens).sort()
      const expected = [...(LEGACY_PRESENTATION_FIELDS[mod.id] ?? [])].sort()
      expect(actual, `${mod.id} has raw presentation fields`).toEqual(expected)
    }
  })
})

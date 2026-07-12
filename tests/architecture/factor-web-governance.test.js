import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const root = resolve(process.cwd())
const read = (relativePath) => readFileSync(resolve(root, relativePath), 'utf8')

const componentPath = 'src/components/learning/FactorWeb.jsx'
const storyPath = 'src/components/learning/FactorWeb.stories.jsx'
const contractPath = 'docs/system/component-contracts/factor-web.md'

describe('FactorWeb governance', () => {
  const source = read(componentPath)

  it('uses the governed interaction shell and canonical screen-title route', () => {
    expect(source).toContain("import InteractionShell from '../layout/InteractionShell.jsx'")
    expect(source).toContain("import { ScreenTitle } from '../core/ScreenText.jsx'")
    expect(source).toContain('<InteractionShell subject={subject}>')
    expect(source).toContain('<ScreenTitle')
  })

  it('uses shared local progress and governed progression controls', () => {
    expect(source).toContain("import SequenceProgress from '../core/SequenceProgress.jsx'")
    expect(source).toContain('<SequenceProgress')
    expect(source).toContain('<ContinueCTA')
    expect(source).not.toMatch(/\{explored\.size\}\s*\/\s*\{factors\.length\}/)
    expect(source).not.toContain('factors explored</p>')
  })

  it('does not reintroduce the old tiny uppercase or emoji-driven treatment', () => {
    expect(source).not.toContain("textTransform: 'uppercase'")
    expect(source).not.toContain('TYPE.eyebrow')
    expect(source).not.toContain('cinematic-eyebrow')
    expect(source).not.toMatch(/fontFamily\s*:/)
    expect(source).not.toContain('{f.icon}')
    expect(source).not.toContain('WebkitLineClamp')
  })

  it('keeps the full question outside the centre node', () => {
    expect(source).toContain('const centreLabel =')
    expect(source).toContain('{centreLabel}')
    expect(source).toContain('{heading}')
    expect(source).not.toMatch(/<span[^>]*>[\s\S]*?\{block\.question\}[\s\S]*?<\/span>/)
  })

  it('keeps motion elements centred without letting Framer Motion overwrite their offset', () => {
    const centredOffsets = source.match(/translate:\s*'-50% -50%'/g) ?? []
    expect(
      centredOffsets,
      'The centre node and outer factor buttons must use the independent CSS translate property.',
    ).toHaveLength(2)

    expect(source).not.toContain("transform: 'translate(-50%, -50%)'")
    expect(source).toContain("overflowX: 'hidden'")
    expect(source).toContain("overscrollBehaviorX: 'none'")
  })

  it('has a governed contract and 390px gold stories', () => {
    const story = read(storyPath)
    const contract = read(contractPath)

    expect(story).toContain('GoldVesaliusCausation')
    expect(story).toContain('LongFactorLabels')
    expect(story).toContain("centreLabel: 'Challenge Galen'")

    expect(contract).toContain('Composition classification:')
    expect(contract).toContain('interaction-owns-screen')
    expect(contract).toContain('## 7. Gold example')
    expect(contract).toContain('## 9. Review checks')
  })
})

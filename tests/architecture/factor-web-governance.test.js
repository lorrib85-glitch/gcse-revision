import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const root = resolve(process.cwd())
const read = (relativePath) => readFileSync(resolve(root, relativePath), 'utf8')

const componentPath = 'src/components/learning/FactorWeb.jsx'
const storyPath = 'src/components/learning/FactorWeb.stories.jsx'
const contractPath = 'docs/system/component-contracts/factor-web.md'
const limitsPath = 'src/constants/contentLimits.js'

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

  it('does not reintroduce tiny uppercase, clamping or emoji-driven identity', () => {
    expect(source).not.toContain("textTransform: 'uppercase'")
    expect(source).not.toContain('TYPE.eyebrow')
    expect(source).not.toContain('cinematic-eyebrow')
    expect(source).not.toMatch(/fontFamily\s*:/)
    expect(source).not.toContain('{f.icon}')
    expect(source).not.toContain('WebkitLineClamp')
  })

  it('renders no eyebrow or duplicate label above either phase heading', () => {
    expect(source).not.toContain("{isJudgement ? 'Make your judgement' : block.kicker}")
    expect(source).not.toContain('(isJudgement || block.kicker)')
    expect(source).not.toContain('className="eyebrow"')
    expect(source).toContain('const explorationHeading = getFactorWebTitle(block)')

    const screenTitleCount = source.match(/<ScreenTitle/g) ?? []
    expect(screenTitleCount).toHaveLength(1)
  })

  it('supports a central historical focal asset without hardcoding topic imagery', () => {
    expect(source).toContain('const centreImage = block.centreImage || block.centerImage')
    expect(source).toContain('centreImageAlt')
    expect(source).toContain('function CentreFocal')
    expect(source).toContain('<CentreFocal')
    expect(source).not.toContain('/images/vesalius-1543.png')
    expect(source).not.toContain('/images/pasteur-1861.png')
  })

  it('keeps the full question outside the centre focal point', () => {
    expect(source).toContain('const centreLabel =')
    expect(source).toContain('{centreLabel}')
    expect(source).toContain('{heading}')
    expect(source).not.toMatch(/<span[^>]*>[\s\S]*?\{block\.question\}[\s\S]*?<\/span>/)
  })

  it('keeps motion elements centred without letting Framer Motion overwrite their offset', () => {
    const centredOffsets = source.match(/translate:\s*'-50% -50%'/g) ?? []
    expect(
      centredOffsets.length,
      'The focal point, atmosphere and outer factor buttons must use the independent CSS translate property.',
    ).toBeGreaterThanOrEqual(3)

    expect(source).not.toContain("transform: 'translate(-50%, -50%)'")
    expect(source).toContain("overflowX: 'hidden'")
    expect(source).toContain("overscrollBehaviorX: 'none'")
  })

  it('uses anchored connector geometry rather than lines running through the focal point', () => {
    expect(source).toContain('export function getFactorConnector')
    expect(source).toContain('connector.start.x')
    expect(source).toContain('connector.end.x')
    expect(source).toContain('<motion.circle')
  })

  it('defines explicit title and label limits as authoring constraints', () => {
    const limits = read(limitsPath)
    const contract = read(contractPath)

    expect(source).toContain('FACTOR_WEB_TITLE_MAX_LENGTH')
    expect(source).toContain('COMPONENT_TEXT_LIMITS.factorWeb.title')
    expect(limits).toContain('title: 42')
    expect(limits).toContain('centreLabel: 22')
    expect(limits).toContain('nodeLabel: 24')
    expect(contract).toContain('42 characters maximum')
    expect(contract).toContain('must fail governance')
    expect(contract).toContain('must not silently truncate')
  })

  it('has a governed contract and 390px gold stories', () => {
    const story = read(storyPath)
    const contract = read(contractPath)

    expect(story).toContain('GoldVesaliusCausation')
    expect(story).toContain('LongFactorLabels')
    expect(story).toContain("centreLabel: 'Vesalius'")
    expect(story).toContain("centreImage: '/images/vesalius-1543.png'")

    expect(contract).toContain('Composition classification:')
    expect(contract).toContain('interaction-owned')
    expect(contract).toContain('No eyebrows.')
    expect(contract).toContain('optional one-sentence framing paragraph')
    expect(contract).toContain('## 7. Gold example')
    expect(contract).toContain('## 9. Review checks')
  })
})

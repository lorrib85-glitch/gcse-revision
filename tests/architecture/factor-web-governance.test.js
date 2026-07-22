import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const root = resolve(process.cwd())
const read = relativePath => readFileSync(resolve(root, relativePath), 'utf8')

const componentPath = 'src/components/learning/FactorWeb.jsx'
const storyPath = 'src/components/learning/FactorWeb.stories.jsx'
const contractPath = 'docs/system/component-contracts/factor-web.md'
const limitsPath = 'src/constants/contentLimits.js'
const lockedComponentsPath = 'docs/components/LOCKED_COMPONENTS.md'
const componentRegistryPath = 'docs/components/COMPONENT_REGISTRY.md'
const goldRegisterPath = 'docs/system/GOLD_SCREEN_REGISTER.md'
const tokensPath = 'src/constants/factorWeb.js'

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

  it('uses a balanced two-column layout with three factors on each side when six are supplied', () => {
    expect(source).toContain('export function splitFactorColumns')
    expect(source).toContain('const midpoint = Math.ceil(factors.length / 2)')
    expect(source).toContain("side: 'left'")
    expect(source).toContain("side: 'right'")
    expect(source).toContain("getFactorSlot('left'")
    expect(source).toContain("getFactorSlot('right'")
  })

  it('supports a central historical image and a governed placeholder without hardcoding topic imagery', () => {
    expect(source).toContain('const centreImage = block.centreImage || block.centerImage')
    expect(source).toContain('centreImageAlt')
    expect(source).toContain('function CentreFocal')
    expect(source).toContain('<CentreFocal')
    expect(source).toContain('function FocalPlaceholderGlyph')
    expect(source).toContain('<FocalPlaceholderGlyph')
    expect(source).toContain('Image placeholder for ${centreLabel}')
    expect(source).not.toContain('/images/vesalius-1543.png')
    expect(source).not.toContain('/images/pasteur-1861.png')
  })

  it('keeps the full question outside the centre focal point and positions the label independently beneath the media', () => {
    expect(source).toContain('const centreLabel =')
    expect(source).toContain('{centreLabel}')
    expect(source).toContain('{heading}')
    expect(source).toContain('top: `calc(100% + ${FACTOR_WEB_LAYOUT.focalLabelGap}px)`')
    expect(source).not.toMatch(/<span[^>]*>[\s\S]*?\{block\.question\}[\s\S]*?<\/span>/)
  })

  it('centres the visible focal circle on the exact SVG coordinate used by connector geometry', () => {
    expect(source).toContain('left: `${FACTOR_WEB_LAYOUT.focalCenterX}%`')
    expect(source).toContain('top: `${FACTOR_WEB_LAYOUT.focalCenterY}%`')
    expect(source).toContain('width: `${FACTOR_WEB_LAYOUT.focalDiameter}%`')
    expect(source).toContain("translate: '-50% -50%'")
    expect(source).not.toContain('width: FACTOR_WEB_LAYOUT.focalSize')
    expect(source).not.toContain("transform: 'translate(-50%, -50%)'")
    expect(source).toContain("overflowX: 'hidden'")
    expect(source).toContain("overscrollBehaviorX: 'none'")
  })

  it('uses light curved connectors with one node-side anchor dot and no centre dots', () => {
    expect(source).toContain('export function getFactorConnectorPath')
    expect(source).toContain('FACTOR_WEB_LAYOUT.connectorControlOffset')
    expect(source).toContain('getFocalAnchorX')
    expect(source).toContain('FACTOR_WEB_LAYOUT.focalRadius - FACTOR_WEB_LAYOUT.connectorUnderlap')
    expect(source).toContain('<motion.path')

    const dotCount = source.match(/<motion\.circle/g) ?? []
    expect(dotCount).toHaveLength(1)
    expect(source).toContain('cx={slot.nodeAnchorX}')
    expect(source).not.toContain('cx={slot.focalAnchorX}')
  })

  it('sources geometry, visual intensity and choreography from dedicated tokens', () => {
    const tokens = read(tokensPath)

    expect(source).toContain('FACTOR_WEB_LAYOUT,')
    expect(source).toContain('FACTOR_WEB_MOTION,')
    expect(source).toContain('FACTOR_WEB_VISUAL,')
    expect(source).toContain('FACTOR_WEB_LAYOUT.nodeWidth')
    expect(source).toContain('FACTOR_WEB_LAYOUT.focalDiameter')
    expect(source).toContain('FACTOR_WEB_VISUAL.haloBlur')
    expect(source).toContain('FACTOR_WEB_VISUAL.connectorActiveOpacity')
    expect(source).toContain('FACTOR_WEB_MOTION.duration.standard')

    expect(tokens).toContain('rowsByCount')
    expect(tokens).toContain('focalRowsByCount')
    expect(tokens).toContain('focalDiameter: FOCAL_DIAMETER')
    expect(tokens).toContain('focalRadius: FOCAL_DIAMETER / 2')
    expect(tokens).toContain('connectorUnderlap: 0.6')
    expect(tokens).toContain('connectorIdleOpacity: 0.13')
    expect(tokens).toContain('connectorExploredOpacity: 0.28')
    expect(tokens).toContain('connectorActiveOpacity: 0.52')
    expect(tokens).toContain('connectorIdleWidth: 0.30')
    expect(tokens).toContain('connectorActiveWidth: 0.46')
    expect(tokens).toContain("durationSeconds(MOTION.duration.standard)")
  })

  it('uses shared neutral, line and shadow tokens rather than local colour recipes', () => {
    expect(source).toContain("import { GENERAL } from '../../constants/generalTheme.js'")
    expect(source).toContain('GENERAL.cinematic.textPrimary')
    expect(source).toContain('GENERAL.cinematic.textSecondary')
    expect(source).toContain('GENERAL.cinematic.textMuted')
    expect(source).toContain('GENERAL.line.soft')
    expect(source).toContain('GENERAL.line.medium')
    expect(source).toContain('GENERAL.surfaceTint')
    expect(source).toContain('GENERAL.shadow.raised')
    expect(source).toContain('GENERAL.shadow.overlay')
    expect(source).not.toMatch(/rgba\(245,245,245/)
    expect(source).not.toMatch(/rgba\(255,255,255/)
    expect(source).not.toContain('rgba(15,14,12')
  })

  it('uses a lighter body token for node copy', () => {
    expect(source).toContain("<span style={{ ...TYPE.bodySmall, color: 'inherit' }}>")
    expect(source).not.toContain("<span style={{ ...TYPE.label, color: 'inherit' }}>")
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
    expect(story).toContain('PlaceholderFocal')
    expect(story).toContain('LongFactorLabels')
    expect(story).toContain("centreLabel: 'Vesalius'")
    expect(story).toContain("centreImage: '/images/vesalius-factorweb-portrait.webp'")

    expect(contract).toContain('Composition classification:')
    expect(contract).toContain('interaction-owned')
    expect(contract).toContain('three on the left and three on the right')
    expect(contract).toContain('governed image placeholder')
    expect(contract).toContain('No eyebrows.')
    expect(contract).toContain('optional one-sentence framing paragraph')
    expect(contract).toContain('## 7. Gold example')
    expect(contract).toContain('## 9. Review checks')
  })

  it('locks the verified FactorWeb contract in the existing component governance docs', () => {
    const lockedComponents = read(lockedComponentsPath)
    const componentRegistry = read(componentRegistryPath)
    const goldRegister = read(goldRegisterPath)

    expect(lockedComponents).toContain('### FactorWeb')
    expect(lockedComponents).toContain('centre dots')
    expect(lockedComponents).toContain('SequenceProgress')
    expect(componentRegistry).toContain('### FactorWeb — **LOCKED**')
    expect(componentRegistry).toContain('docs/system/component-contracts/factor-web.md')
    expect(goldRegister).toContain('approved Vesalius portrait')
    expect(goldRegister).toContain('centre dots removed')
  })
})

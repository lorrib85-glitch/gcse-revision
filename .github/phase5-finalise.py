from pathlib import Path


def replace_once(text, old, new, label):
    count = text.count(old)
    if count != 1:
        raise SystemExit(f'{label}: expected one anchor, found {count}')
    return text.replace(old, new)


renderer_path = Path('src/components/layout/ScreenRenderer.jsx')
renderer = renderer_path.read_text()

renderer = replace_once(
    renderer,
    """      <p style={{
        ...TYPE.body,
        fontSize: '.95rem', lineHeight: 1.65, margin: 0, color: '#E0E6F0',
      }} dangerouslySetInnerHTML={{ __html: block.text }} />""",
    """      {block.text && (
        <p style={{
          ...TYPE.body,
          fontSize: '.95rem', lineHeight: 1.65, margin: 0, color: '#E0E6F0',
        }} dangerouslySetInnerHTML={{ __html: block.text }} />
      )}
      {Array.isArray(block.points) && (
        <ul style={{ margin: 0, paddingLeft: 20, color: '#E0E6F0' }}>
          {block.points.map((point, index) => (
            <li key={index} style={{ ...TYPE.body, fontSize: '.95rem', lineHeight: 1.65, marginBottom: 6 }}>
              {point}
            </li>
          ))}
        </ul>
      )}""",
    'keypoint points rendering',
)

renderer = replace_once(
    renderer,
    """  const scenario = block.scenarios[current]
""",
    """  const scenarios = Array.isArray(block.scenarios) ? block.scenarios : [block]
  const scenario = scenarios[current]
""",
    'scenario normalisation',
)
renderer = renderer.replace('current + 1 < block.scenarios.length', 'current + 1 < scenarios.length')
renderer = renderer.replace('score}/{block.scenarios.length}', 'score}/{scenarios.length}')
renderer = renderer.replace("score === block.scenarios.length", "score === scenarios.length")
renderer = renderer.replace('{current + 1}/{block.scenarios.length}', '{current + 1}/{scenarios.length}')
scenario_segment = renderer[renderer.index('function ScenarioBlock'):renderer.index('// ─── Single screen renderer')]
scenario_reference_count = scenario_segment.count('block.scenarios')
if scenario_reference_count != 2:
    raise SystemExit(
        f'ScenarioBlock: expected only the two normalisation references, found {scenario_reference_count}'
    )

renderer = replace_once(
    renderer,
    """export function ChapterSchemaError({ chapter, errors, onBack }) {
  return (
""",
    """export function ChapterSchemaError({ chapter, errors, onBack }) {
  const showDetails = import.meta.env.DEV
  return (
""",
    'schema error detail mode',
)
renderer = replace_once(
    renderer,
    """        <p style={{ ...TYPE.body, color: 'rgba(245,247,251,.72)', lineHeight: 1.6 }}>
          {chapter?.title || chapter?.id || 'Unknown chapter'} contains screen data that is not registered or is missing required fields.
        </p>
        <pre style={{
          whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', padding: 14, borderRadius: 12,
          background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.12)',
          color: '#FFD6DE', ...TYPE.bodySmall, lineHeight: 1.5,
        }}>{errors.map(error => `${error.code}: ${error.message}`).join('\n')}</pre>""",
    """        <p style={{ ...TYPE.body, color: 'rgba(245,247,251,.72)', lineHeight: 1.6 }}>
          {showDetails
            ? `${chapter?.title || chapter?.id || 'Unknown chapter'} contains screen data that is not registered or is missing required fields.`
            : 'This chapter needs a quick content update before it can continue. Please go back and choose another chapter.'}
        </p>
        {showDetails && (
          <pre style={{
            whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', padding: 14, borderRadius: 12,
            background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.12)',
            color: '#FFD6DE', ...TYPE.bodySmall, lineHeight: 1.5,
          }}>{errors.map(error => `${error.code}: ${error.message}`).join('\n')}</pre>
        )}""",
    'production-safe schema message',
)
renderer = replace_once(
    renderer,
    """function UnsupportedScreen({ screen, chapter, definition }) {
  const type = getScreenType(screen)
  if (!import.meta.env.DEV) return null
  return (
""",
    """function UnsupportedScreen({ screen, chapter, definition }) {
  const type = getScreenType(screen)
  return (
""",
    'unsupported screen recovery',
)
renderer_path.write_text(renderer)

test_path = Path('tests/unit/chapterPlayer/screenRenderer.test.jsx')
test_path.parent.mkdir(parents=True, exist_ok=True)
test_path.write_text("""import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { ScreenContentRenderer } from '../../../src/components/layout/ScreenRenderer.jsx'

describe('ScreenContentRenderer authored data variants', () => {
  it('renders a single scenario object without requiring a scenarios array', () => {
    const html = renderToStaticMarkup(
      <ScreenContentRenderer
        subject="Sociology"
        screen={{
          blocks: [{
            type: 'scenario',
            situation: 'A family makes a difficult choice.',
            options: ['Option A', 'Option B'],
            correctIndex: 0,
            explanation: 'The evidence supports option A.',
          }],
        }}
      />,
    )
    expect(html).toContain('A family makes a difficult choice.')
    expect(html).toContain('Option A')
  })

  it('renders point-list key points instead of producing an empty card', () => {
    const html = renderToStaticMarkup(
      <ScreenContentRenderer
        subject="History"
        screen={{ blocks: [{ type: 'keypoint', points: ['First governed point', 'Second governed point'] }] }}
      />,
    )
    expect(html).toContain('First governed point')
    expect(html).toContain('Second governed point')
  })
})
""")

architecture_path = Path('tests/architecture/screen-registry.test.js')
architecture = architecture_path.read_text()
anchor = """    expect(player).not.toContain('function ReadBlock')
  })
})
"""
replacement = """    expect(player).not.toContain('function ReadBlock')
  })

  it('keeps production failures recoverable and accepted data variants renderable', () => {
    const renderer = read('src/components/layout/ScreenRenderer.jsx')
    expect(renderer).not.toContain('function UnsupportedScreen({ screen, chapter, definition }) {\\n  const type = getScreenType(screen)\\n  if (!import.meta.env.DEV) return null')
    expect(renderer).toContain("const scenarios = Array.isArray(block.scenarios) ? block.scenarios : [block]")
    expect(renderer).toContain('Array.isArray(block.points)')
  })
})
"""
architecture_path.write_text(replace_once(architecture, anchor, replacement, 'architecture final-review contract'))

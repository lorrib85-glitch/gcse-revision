from pathlib import Path

path = Path('src/components/learning/BuilderBlock.jsx')
text = path.read_text()


def replace_once(old, new, label):
    global text
    if old not in text:
        raise SystemExit(f'{label} pattern not found')
    text = text.replace(old, new, 1)


replace_once(
    "import ContinueCTA from '../core/ContinueCTA.jsx'\n",
    "import ContinueCTA from '../core/ContinueCTA.jsx'\nimport { ScreenTitle, ScreenBody } from '../core/ScreenText.jsx'\n",
    'ScreenText import',
)

replace_once(
    """      `}</style>\n\n      <div\n        style={{\n          position: 'relative',\n""",
    """      `}</style>\n\n      <div style={{ marginBottom: SPACING.standard }}>\n        <ScreenTitle>{block.label || 'Build the equation'}</ScreenTitle>\n        <ScreenBody style={{ color: GENERAL.slate, margin: 0 }}>\n          {isCompleted ? 'You built the full relationship.' : instruction}\n        </ScreenBody>\n      </div>\n\n      <div\n        style={{\n          position: 'relative',\n""",
    'screen-level heading insertion',
)

replace_once(
    """          <header style={{ marginBottom: SPACING.compact }}>\n            <div style={{ ...TYPE.displayCard, color: GENERAL.softWhite, marginBottom: SPACING.micro }}>\n              {block.label || 'Build the equation'}\n            </div>\n            <p style={{ ...TYPE.bodySmall, color: GENERAL.slate, margin: 0 }}>\n              {isCompleted ? 'You built the full relationship.' : instruction}\n            </p>\n          </header>\n\n""",
    "",
    'embedded card heading removal',
)

path.write_text(text)

import WorkedExample from './WorkedExample'

export default {
  component: WorkedExample,
  tags: ['ai-generated'],
  parameters: {
    layout: 'padded',
    viewport: { defaultViewport: 'mobile1' },
    backgrounds: { default: 'dark', values: [{ name: 'dark', value: '#08090D' }] },
  },
}

// Gold — the Galen fever case: the rule (treat with the opposite) applied to
// one specific patient. Demonstrates application; it is NOT the rule summary
// (that is KeyPoint).
export const Gold = {
  name: 'Gold — the Galen fever case',
  args: {
    subject: 'History',
    chips: ['Fever', 'Red face', 'Sweating'],
    scenario: 'A patient arrives with a fever, a red face and heavy sweating.',
    working: 'Heat and wetness point to one humour in excess: too much blood, which is hot and wet.',
    result: (
      <>So the cure is to <span style={{ color: '#D69B45' }}>cool and dry</span> the body — the opposite qualities.</>
    ),
  },
}

// A maths worked example — shows the same case → apply → result shape works
// across subjects.
export const Maths = {
  name: 'Maths — solving an equation',
  args: {
    subject: 'Maths',
    chips: ['3x + 2 = 14'],
    scenario: 'Solve for x when 3x + 2 = 14.',
    working: 'Undo the +2 first: 3x = 12. Then undo the ×3: divide both sides by 3.',
    result: (
      <>x = <span style={{ color: '#7BA7D9' }}>4</span>.</>
    ),
  },
}

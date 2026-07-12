import TheoryCompareBlock from './TheoryCompareBlock.jsx'
import { SUBJECTS } from '../../constants/subjects.js'

export default {
  component: TheoryCompareBlock,
  tags: ['ai-generated'],
  parameters: {
    layout: 'fullscreen',
    viewport: { defaultViewport: 'mobile1' },
  },
  // Approximate the ContentShell frame the block renders inside (dark base,
  // 390px column, 16px inset) so the composed reading matches the real screen.
  decorators: [
    (Story) => (
      <div style={{ background: SUBJECTS.History.background, minHeight: '100vh' }}>
        <div style={{ maxWidth: 390, margin: '0 auto', padding: 16 }}>
          <Story />
        </div>
      </div>
    ),
  ],
}

// ─── Simple variant — unchanged, backwards-compatible (Black Death) ────────
const BLACK_DEATH_BLOCK = {
  type: 'theoryCompare',
  oldLabel: 'What people believed',
  oldTitle: 'Three explanations',
  oldPoints: [
    'Cause — God’s punishment, bad air, or astrology',
    'Carrier — bad smells, sinful behaviour, unlucky planets',
    'Spread — poisoned air or divine judgement spreading through communities',
  ],
  newLabel: 'What was actually happening',
  newTitle: 'One real cause',
  newPoints: [
    'Cause — Yersinia pestis bacteria',
    'Carrier — fleas living on black rats',
    'Spread — flea bites, infected rats, travel and trade routes',
  ],
  takeaway: 'They blamed God, miasma and the planets. The real cause was a bacterium carried by fleas on black rats.',
}

export const SimpleBlackDeath = {
  args: { block: BLACK_DEATH_BLOCK, subject: 'History' },
}

// ─── People variant — Galen vs Vesalius (Episode 3) ────────────────────────
const GALEN_VESALIUS_BLOCK = {
  type: 'theoryCompare',
  variant: 'people',
  title: 'Galen and Vesalius',
  heroImage: '/figures/history/medicine/renaissance/galen-vesalius-hero.png',
  heroImageAlt: 'Galen in Roman dress before classical ruins and animal anatomy sketches, standing back to back with Vesalius in Renaissance dress beside an anatomical book and a human skeleton',
  leftPerson: {
    name: 'Galen',
    subtitle: 'Ancient Roman doctor',
    image: '/figures/history/medicine/medieval/galen-portrait.png',
    imageAlt: 'Portrait of the ancient Roman doctor Galen',
  },
  rightPerson: {
    name: 'Vesalius',
    subtitle: 'Renaissance anatomist',
    image: '/images/vesalius-1543.png',
    imageAlt: 'Portrait of the Renaissance anatomist Andreas Vesalius',
  },
  comparisons: [
    {
      id: 'evidence-source',
      prompt: 'What did they study?',
      left: 'Relied mainly on animal dissection',
      right: 'Dissected real human bodies himself',
      explanation: 'Human dissection was severely restricted in Galen’s time, so he used animal bodies and assumed some features were the same in humans. Vesalius had greater access to human bodies and could check those claims directly.',
    },
    {
      id: 'method',
      prompt: 'How did they build knowledge?',
      left: 'Used observation, existing theory and animal anatomy',
      right: 'Checked ancient claims against direct human evidence',
      explanation: 'Vesalius did not reject old knowledge simply because it was old. He tested it. When the evidence disagreed with Galen’s books, he trusted what he could observe.',
    },
    {
      id: 'conclusions',
      prompt: 'What did they conclude?',
      rows: [
        { label: 'Jaw',        left: 'The human jaw had two bones',          right: 'The human jaw was one bone' },
        { label: 'Ribs',       left: 'Men had fewer ribs than women',        right: 'Men and women had the same number of ribs' },
        { label: 'Breastbone', left: 'The human breastbone had seven parts', right: 'The human breastbone had three main parts' },
      ],
      note: 'Vesalius identified around 300 errors in Galen’s anatomical writing.',
    },
    {
      id: 'impact',
      prompt: 'What was their impact?',
      left: 'His books shaped medical teaching for more than a thousand years',
      right: 'He showed that respected authority could be corrected by evidence',
      explanation: 'Vesalius improved knowledge of anatomy, but he did not immediately improve treatment. Doctors still used the Four Humours, bloodletting and purging.',
    },
  ],
  takeaway: 'Vesalius did not prove that everything Galen believed was wrong. He proved that old ideas should be checked against evidence.',
}

export const PeopleGalenVesalius = {
  args: { block: GALEN_VESALIUS_BLOCK, subject: 'History' },
}

// A single comparison with no explanation and no takeaway — the variant must
// render without either optional field.
export const PeopleMinimal = {
  args: {
    subject: 'History',
    block: {
      type: 'theoryCompare',
      variant: 'people',
      title: 'Two anatomists',
      leftPerson: { name: 'Galen', subtitle: 'Ancient Roman doctor', image: '/figures/history/medicine/medieval/galen-portrait.png', imageAlt: 'Portrait of Galen' },
      rightPerson: { name: 'Vesalius', subtitle: 'Renaissance anatomist', image: '/images/vesalius-1543.png', imageAlt: 'Portrait of Vesalius' },
      comparisons: [
        { id: 'evidence-source', prompt: 'What did they study?', left: 'Animal dissection', right: 'Human dissection' },
      ],
    },
  },
}

// Long but valid learner copy — must wrap without dangerous overflow at 390px.
export const PeopleLongCopy = {
  args: {
    subject: 'History',
    block: {
      ...GALEN_VESALIUS_BLOCK,
      comparisons: [
        {
          id: 'evidence-source',
          prompt: 'What did they study, and why did the conditions of their time shape the evidence they could gather?',
          left: 'Relied mainly on the dissection of animals such as pigs, monkeys and goats because human dissection was restricted',
          right: 'Dissected real human bodies himself in public anatomy theatres, checking each ancient claim against what he could actually see',
          explanation: 'Human dissection was severely restricted in Galen’s time, so he used animal bodies and assumed some features were the same in humans. Vesalius, working in Renaissance Italy where public dissection was increasingly accepted, had far greater access to human bodies and could check those inherited claims directly against the evidence in front of him.',
        },
      ],
    },
  },
}

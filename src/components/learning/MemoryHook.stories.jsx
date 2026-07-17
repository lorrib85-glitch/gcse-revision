import MemoryHook from './MemoryHook.jsx'
import { SUBJECTS } from '../../constants/subjects.js'

export default {
  component: MemoryHook,
  tags: ['ai-generated'],
  parameters: {
    layout: 'fullscreen',
    viewport: { defaultViewport: 'mobile1' },
  },
  // Approximate the ContentShell frame the block renders inside (dark base,
  // 390px column, 16px inset) so the composed reading matches the real screen.
  decorators: [
    (Story, ctx) => {
      const subject = ctx.args.subject || 'Biology'
      return (
        <div style={{ background: SUBJECTS[subject]?.background || '#08090D', minHeight: '100vh' }}>
          <div style={{ maxWidth: 390, margin: '0 auto', padding: 16 }}>
            <Story />
          </div>
        </div>
      )
    },
  ],
}

// ─── Gold — the virus "hacker" analogy with thumbnail ──────────────────────
// One hard idea, anchored by a memorable analogy, with a supporting image and
// the learner-edit affordance. Matches the design reference.
export const Gold = {
  args: {
    subject: 'Biology',
    block: {
      id: 'bio-virus-hacker',
      label: 'Memory hook',
      hook: "Think of a virus as a tiny 'hacker' that sneaks in, takes over, and makes copies of itself.",
      image: '/headers/bio-diseasewars.webp',
      imageAlt: 'Stylised virus particle in a dark, cinematic scene',
    },
  },
}

// ─── Text-only — no author image ───────────────────────────────────────────
export const TextOnly = {
  args: {
    subject: 'History',
    block: {
      id: 'hist-humours-orchestra',
      hook: 'Picture the four humours as an orchestra: health is when all four play in balance — illness is when one instrument drowns out the rest.',
    },
  },
}

// ─── Maths mnemonic — different subject accent ─────────────────────────────
export const MathsMnemonic = {
  args: {
    subject: 'Maths',
    block: {
      id: 'maths-soh-cah-toa',
      label: 'Memory hook',
      hook: 'SOH CAH TOA — Sine = Opposite/Hypotenuse, Cosine = Adjacent/Hypotenuse, Tangent = Opposite/Adjacent.',
    },
  },
}

// ─── Long copy — must wrap cleanly beside a thumbnail at 390px ─────────────
export const LongCopy = {
  args: {
    subject: 'Chemistry',
    block: {
      id: 'chem-oilrig',
      label: 'Memory hook',
      hook: 'OIL RIG: Oxidation Is Loss, Reduction Is Gain — of electrons. Whenever one substance loses electrons, another must gain them, so oxidation and reduction always happen together in a redox reaction.',
      image: '/headers/bio-energyforlife.webp',
      imageAlt: 'Abstract energy visual',
    },
  },
}

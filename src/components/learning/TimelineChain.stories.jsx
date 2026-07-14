import TimelineChain from './TimelineChain.jsx'

export default {
  title: 'Learning/TimelineChain',
  component: TimelineChain,
  parameters: { layout: 'fullscreen' },
}

export const GermTheory = {
  args: {
    subject: 'History',
    onContinue: () => {},
    block: {
      type: 'timelineChain',
      title: 'From germ theory to safe surgery',
      intro: 'Tap each step to see why it led to the next.',
      steps: [
        { id: 'pasteur', icon: 'microscope', label: 'Pasteur proves germ theory',
          detail: 'Pasteur showed that microbes in the air caused decay and disease. For the first time there was a real cause to fight, not just bad air.' },
        { id: 'lister', icon: 'antiseptic', label: 'Lister applies it to surgery',
          detail: 'If germs caused infection, killing them should prevent it. Lister used carbolic acid to kill microbes on wounds and instruments.' },
        { id: 'antiseptic', icon: 'shield', label: 'Antiseptic surgery cuts infection',
          detail: 'Deaths from infection after operations fell sharply. This proved germs — not miasma — caused surgical infection.' },
        { id: 'aseptic', icon: 'sterile', label: 'Aseptic surgery develops',
          detail: 'Surgeons now kept germs out entirely: sterilised instruments, gowns and gloves. Prevention replaced treatment.' },
      ],
    },
  },
}

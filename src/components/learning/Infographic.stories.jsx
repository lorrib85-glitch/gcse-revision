import Infographic from './Infographic'

export default {
  component: Infographic,
  tags: ['ai-generated'],
  parameters: {
    layout: 'fullscreen',
    viewport: { defaultViewport: 'mobile1' },
    backgrounds: { default: 'dark', values: [{ name: 'dark', value: '#08090D' }] },
  },
}

// Reserved diagram slot: the author supplies the infographic later; the caption
// briefs what it should show.
export const DiagramSlot = {
  name: 'Diagram slot (author supplies image)',
  args: {
    subject: 'History',
    heading: 'Every illness had an opposite',
    intro: 'Each humour sat where two qualities met — hot or cold, wet or dry. A patient\'s symptoms revealed which were in excess.',
    media: {
      kind: 'diagram',
      aspect: '4:3',
      caption: 'The four humours placed on hot–cold and wet–dry axes, with an arrow crossing to the opposite quadrant.',
    },
  },
}

// Progressive quadrant reveal, as used by the "Galen treated with opposites"
// screen in History Medicine Episode 1.
export const QuadrantReveal = {
  name: 'Image reveal (four humours)',
  args: {
    subject: 'History',
    heading: 'Galen treated with opposites',
    intro: "Galen took Hippocrates' theory of the Four Humours one step further. He believed illness happened when one humour became too dominant — so treatment should use the opposite qualities to restore balance.",
    media: {
      kind: 'imageReveal',
      aspect: '1:1',
      caption: {
        interval: 1500,
        images: {
          topLeft: '/figures/history/medicine/medieval/four-humours-blood.webp',
          topRight: '/figures/history/medicine/medieval/four-humours-yellow-bile.webp',
          bottomLeft: '/figures/history/medicine/medieval/four-humours-phlegm.webp',
          bottomRight: '/figures/history/medicine/medieval/four-humours-black-bile.webp',
        },
        alt: 'The four humours revealed one quadrant at a time: blood (hot and wet), yellow bile (hot and dry), phlegm (cold and wet) and black bile (cold and dry), with arrows crossing the centre to link each humour to its opposite',
        parts: ['topLeft', 'topRight', 'bottomLeft', 'bottomRight'],
        opposites: [
          ['topLeft', 'bottomRight'],
          ['topRight', 'bottomLeft'],
        ],
        finished: 'Hot was treated with cold. Wet was treated with dry. The aim was to restore balance.',
      },
    },
  },
}

import MediaPlaceholder from './MediaPlaceholder'

export default {
  component: MediaPlaceholder,
  tags: ['ai-generated'],
  parameters: {
    layout: 'padded',
    viewport: { defaultViewport: 'mobile1' },
    backgrounds: { default: 'dark', values: [{ name: 'dark', value: '#08090D' }] },
  },
}

// Reserved slot for a diagram the author will supply; the caption briefs it.
export const Diagram = {
  name: 'Diagram slot',
  args: {
    kind: 'diagram',
    aspect: '4:3',
    subject: 'History',
    caption: 'The four humours placed on hot–cold and wet–dry axes, with an arrow crossing to the opposite quadrant.',
  },
}

export const Image = {
  name: 'Image slot (16:9)',
  args: {
    kind: 'image',
    aspect: '16:9',
    subject: 'History',
    caption: 'A medieval physician inspecting a flask of urine by candlelight.',
  },
}

// Quadrant-by-quadrant image reveal with animated opposite-pair arrows,
// as used by the four-humours screen in History Medicine Episode 1.
export const FourHumoursReveal = {
  name: 'Image reveal (four humours)',
  args: {
    kind: 'imageReveal',
    aspect: '1:1',
    subject: 'History',
    caption: {
      intro: 'Watch the four humours build into one system.',
      interval: 600,
      images: {
        topLeft: '/figures/history/medicine/medieval/four-humours-blood.webp',
        topRight: '/figures/history/medicine/medieval/four-humours-yellow-bile.webp',
        bottomLeft: '/figures/history/medicine/medieval/four-humours-black-bile.webp',
        bottomRight: '/figures/history/medicine/medieval/four-humours-phlegm.webp',
      },
      alt: 'The four humours revealed one quadrant at a time, with arrows linking opposites',
      parts: ['topLeft', 'topRight', 'bottomLeft', 'bottomRight'],
      opposites: [
        ['topLeft', 'bottomLeft'],
        ['topRight', 'bottomRight'],
      ],
      finished: 'Each humour has an opposite — hot cancels cold, wet cancels dry.',
    },
  },
}

export const Portrait = {
  name: 'Portrait image slot (3:4)',
  args: {
    kind: 'image',
    aspect: '3:4',
    subject: 'Biology',
    caption: 'Labelled diagram of an animal cell showing nucleus, mitochondria and cell membrane.',
  },
}

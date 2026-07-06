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

export const Portrait = {
  name: 'Portrait image slot (3:4)',
  args: {
    kind: 'image',
    aspect: '3:4',
    subject: 'Biology',
    caption: 'Labelled diagram of an animal cell showing nucleus, mitochondria and cell membrane.',
  },
}

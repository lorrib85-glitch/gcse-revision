import QuoteAnalyser from './QuoteAnalyser'

export default {
  component: QuoteAnalyser,
  tags: ['ai-generated'],
  parameters: {
    layout: 'fullscreen',
    viewport: { defaultViewport: 'mobile1' },
  },
}

const MACBETH_BLOCK = {
  type: 'quoteAnalyser',
  quote: '"Stars, hide your fires; let not light see my black and deep desires."',
  location: 'Act I, Scene IV — Macbeth',
  backgroundImage: null,
  items: [
    {
      id: 'word-focus',
      icon: 'search',
      heading: 'Word focus',
      explainer: 'Dissect key words in the quote',
      content: {
        title: 'Key words unpacked',
        body: 'Shakespeare uses imperative verbs — "hide" and "let not" — to show Macbeth commanding even celestial bodies. "Stars" are usually symbols of fate and divine order; ordering them to hide reveals Macbeth\'s awareness that his ambitions violate the natural law. "Fires" connotes light, truth, and God\'s watchful eye. "Black and deep desires" is one of the most direct moments of self-knowledge in the play — dark imagery admitting guilt before the act.',
        keyWords: ['hide', 'fires', 'black', 'deep', 'desires'],
      },
    },
    {
      id: 'connotations',
      icon: 'feather',
      heading: 'Connotations',
      explainer: 'Explore implied meanings and tones',
      content: {
        title: 'Connotations',
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.',
      },
    },
    {
      id: 'methods',
      icon: 'mask',
      heading: 'Methods',
      explainer: 'Analyse literary devices',
      content: {
        title: 'Literary methods',
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      },
    },
    {
      id: 'interpretations',
      icon: 'bulb',
      heading: 'Interpretations',
      explainer: 'Consider different viewpoints',
      content: {
        title: 'Critical interpretations',
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.',
      },
    },
    {
      id: 'essay-builder',
      icon: 'flame',
      heading: 'Essay builder',
      explainer: 'Build a paragraph step by step',
      content: {
        title: 'Build your paragraph',
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi.',
      },
    },
  ],
}

export const MacbethQuote = {
  args: {
    block: MACBETH_BLOCK,
    subject: 'English',
    onContinue: () => console.log('continue'),
  },
}


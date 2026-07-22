// Macbeth runtime episode — quote analysis sample.
//
// The canonical Macbeth docs live in docs/content/english/Macbeth/.
// This file deliberately keeps the first runtime Macbeth chapter small for now:
// it wires the existing QuoteAnalyser sample into ModulePlayer so the chapter
// no longer falls through to the generic "coming soon" state.

export default {
  id: 'english-macbeth-power-ambition',
  subject: 'English',
  number: 1,
  title: 'Power and ambition',
  subtitle: 'Analyse a Macbeth quote like an examiner',
  era: 'AQA GCSE English Literature',
  icon: '🗡️',
  color: '#B84A3A',
  colorLight: 'rgba(184,74,58,.14)',
  series: 'macbeth',
  recallTags: ['english:macbeth', 'english:quote-analysis', 'english:ambition'],
  examTags: ['aqa:english-literature:macbeth', 'ao2', 'ambition'],
  assetKeys: [],

  stageNavigation: [
    {
      id: 'part-1',
      title: 'Quote analysis',
      description: 'Read the quote, test your interpretation, break down words and turn it into an exam sentence.',
      screenIndex: 0,
    },
    {
      id: 'part-2',
      title: 'Word choice',
      description: 'Focus on the words that carry AO2 marks.',
      screenIndex: 0,
    },
    {
      id: 'part-3',
      title: 'Meaning',
      description: 'Move from simple meaning to deeper interpretation.',
      screenIndex: 0,
    },
    {
      id: 'part-4',
      title: 'Exam move',
      description: 'Turn analysis into a usable AQA-style sentence.',
      screenIndex: 0,
    },
    {
      id: 'part-5',
      title: 'Scaffold',
      description: 'Practise the sentence structure students can reuse.',
      screenIndex: 0,
    },
    {
      id: 'part-6',
      title: 'Finish',
      description: 'Complete the quote-analysis sample.',
      screenIndex: 0,
    },
  ],

  screenCount: 1,
  screens: [
    {
      type: 'quoteAnalyser',
      stage: 'Quote analysis',
      label: 'Analyse the quote',
      tag: 'english:quote-analysis',
      quote: '"Stars, hide your fires; let not light see my black and deep desires."',
      location: 'Act 1, Scene 4 — Macbeth',
      backgroundImage: '/English/Macbeth/heroes/macbeth-generic-banner.svg',
      interpretationPrompt: 'What do you think Macbeth is revealing here?',
      interpretationPlaceholder: 'I think Macbeth is showing...',
      interpretationHints: ['What is he feeling?', 'What does he want?', 'Why might he hide it?'],
      analysisIdeas: [
        {
          idea: 'Macbeth feels guilt, shame or moral unease because he knows his ambition is wrong.',
          evidence: ['hide', 'black'],
        },
        {
          idea: 'He wants to conceal his ambition from other people, moral judgement or divine judgement.',
          evidence: ['hide your fires', 'let not light see'],
        },
        {
          idea: 'His ambition is already internal and self-driven before Lady Macbeth begins influencing him.',
          evidence: ['deep', 'desires'],
        },
        {
          idea: 'The contrast between light and darkness presents a conflict between goodness or judgement and corrupt ambition.',
          evidence: ['fires', 'light', 'black'],
        },
      ],
    },
  ],
}

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
      description: 'Set the scene, read the quote, test your interpretation and turn it into an exam sentence.',
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
      workTitle: 'Macbeth',
      speaker: 'Macbeth',
      sceneLabel: 'Act 1, Scene 4',
      quote: '"Stars, hide your fires; let not light see my black and deep desires."',
      location: 'Act 1, Scene 4 — Macbeth',
      backgroundImage: '/English/Macbeth/heroes/macbeth-generic-banner.svg',
      context: {
        label: 'The moment before',
        beats: [
          'King Duncan names Malcolm as the next heir to the throne.',
          'Macbeth realises Malcolm now stands between him and the crown.',
        ],
        transition: 'Macbeth turns his thoughts towards the stars…',
        continueLabel: 'Hear what Macbeth reveals',
      },
      quoteContinueLabel: 'What do you think it means?',
      interpretationLabel: 'Your interpretation',
      interpretationPrompt: 'What do you think this quote reveals?',
      interpretationInstruction: 'Use your own words. A rough idea is enough.',
      interpretationPlaceholder: 'Write your interpretation...',
      interpretationStarterHeading: 'Need a way in?',
      interpretationMoreLabel: 'More prompts',
      interpretationStarters: [
        'I think Macbeth is feeling…',
        'I think this because the word “…” suggests…',
        'Macbeth wants to hide…',
        'This reveals that Macbeth is…',
      ],
      interpretationSupport: {
        noAnswerTitle: 'Give me an idea to work with',
        noAnswerBody: 'That answer does not explain the quote yet. Try one sentence about what Macbeth feels, wants or is trying to hide.',
        starterHeading: 'Start with one of these:',
        sentenceStarters: [
          'Macbeth is feeling...',
          'He wants to hide...',
          'The word “black” suggests...',
        ],
        hint: 'Look closely at “hide” and “black”. What do those words suggest about Macbeth’s thoughts?',
        retryLabel: 'Try my answer again',
        hintLabel: 'Give me one hint',
      },
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
      wordAnalysis: {
        fires: {
          technique: 'Light imagery',
          meaning: 'Light suggests truth, judgement and divine order. Macbeth wants that light hidden because he knows his ambition should not be seen.',
          sentence: 'Shakespeare uses “fires” to show Macbeth trying to conceal ambition from moral and divine judgement.',
        },
        black: {
          technique: 'Colour imagery',
          meaning: '“Black” suggests moral darkness. Macbeth already recognises that what he wants is corrupt.',
          sentence: 'The colour imagery of “black” presents Macbeth’s ambition as morally corrupt and deliberately hidden.',
        },
        deep: {
          technique: 'Depth imagery',
          meaning: '“Deep” makes the ambition feel buried and rooted inside Macbeth rather than like a passing thought.',
          sentence: 'Shakespeare’s use of “deep” implies Macbeth’s ambition is hidden but already established in his mind.',
        },
        desires: {
          technique: 'Noun choice',
          meaning: '“Desires” shows that Macbeth actively wants power. His ambition exists before Lady Macbeth begins influencing him.',
          sentence: 'The noun “desires” reveals that Macbeth’s ambition is internal and self-driven.',
        },
      },
      meaningSections: [
        {
          label: 'What it means',
          body: 'Macbeth asks the stars to hide their light so his ambition cannot be seen. He already knows that what he wants is morally wrong.',
        },
        {
          label: 'Why it matters',
          body: 'Macbeth is not innocent or simply pushed into evil. He actively chooses to conceal a desire that already belongs to him.',
        },
        {
          label: 'Method and effect',
          body: 'Shakespeare contrasts light and darkness to show the conflict between judgement and hidden ambition.',
        },
      ],
      essayExample: 'Shakespeare uses light and dark imagery in “Stars, hide your fires” to show that Macbeth recognises his ambition is morally corrupt and wants to conceal it from judgement.',
    },
  ],
}

export * from './fixtures.base.js'

import {
  builderQuote as baseBuilderQuote,
  matchingTask as baseMatchingTask,
  quoteAnalyser as baseQuoteAnalyser,
} from './fixtures.base.js'

export const matchingTask = {
  ...baseMatchingTask,
  leftLabel: 'Belief',
  rightLabel: 'Response',
  backgroundImage: '/figures/history/medicine/black-death/plague-background.png',
}

export const builderQuote = {
  ...baseBuilderQuote,
  backgroundImage: '/English/Macbeth/heroes/macbeth-generic-banner.svg',
  backgroundOpacity: 0.82,
}

export const quoteAnalyser = {
  ...baseQuoteAnalyser,
  workTitle: 'Macbeth',
  speaker: 'Macbeth',
  sceneLabel: 'Act 1, Scene 4',
  backgroundImage: '/English/Macbeth/heroes/macbeth-generic-banner.svg',
  context: {
    beats: [
      'King Duncan names Malcolm as the next heir to the throne.',
      'Macbeth realises Malcolm now stands between him and the crown.',
    ],
    transition: 'Macbeth turns his thoughts towards the stars…',
  },
  quoteContinueLabel: 'What do you think it means?',
  interpretationPrompt: 'What do you think this quote reveals?',
  interpretationInstruction: 'Use your own words. A rough idea is enough.',
  interpretationPlaceholder: 'Write your interpretation...',
  interpretationStarterHeading: 'Need a way in?',
  interpretationStarters: [
    'I think Macbeth is feeling…',
    'I think this because the word “…” suggests…',
    'Macbeth wants to hide…',
    'This reveals that Macbeth is…',
  ],
  wordAnalysisNextStep: 'essay',
  wordAnalysisCompleteLabel: 'Use it in an essay',
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
    { idea: 'Macbeth feels guilt, shame or moral unease because he knows his ambition is wrong.', evidence: ['hide', 'black'] },
    { idea: 'He wants to conceal his ambition from other people, moral judgement or divine judgement.', evidence: ['hide your fires', 'let not light see'] },
    { idea: 'His ambition is already internal and self-driven before Lady Macbeth begins influencing him.', evidence: ['deep', 'desires'] },
    { idea: 'The contrast between light and darkness presents a conflict between goodness or judgement and corrupt ambition.', evidence: ['fires', 'light', 'black'] },
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
    { label: 'What it means', body: 'Macbeth asks the stars to hide their light so his ambition cannot be seen. He already knows that what he wants is morally wrong.' },
    { label: 'Why it matters', body: 'Macbeth is not innocent or simply pushed into evil. He actively chooses to conceal a desire that already belongs to him.' },
    { label: 'Method and effect', body: 'Shakespeare contrasts light and darkness to show the conflict between judgement and hidden ambition.' },
  ],
  essayExample: 'Shakespeare uses light and dark imagery in “Stars, hide your fires” to show that Macbeth recognises his ambition is morally corrupt and wants to conceal it from judgement.',
}

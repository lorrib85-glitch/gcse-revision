export * from './fixtures.base.js'

import {
  builderBlock as baseBuilderBlock,
  builderMaths as baseBuilderMaths,
  builderQuote as baseBuilderQuote,
  guidedExamResponse as baseGuidedExamResponse,
  matchingTask as baseMatchingTask,
  quoteAnalyser as baseQuoteAnalyser,
} from './fixtures.base.js'

export const matchingTask = {
  ...baseMatchingTask,
  leftLabel: 'Belief',
  rightLabel: 'Response',
  backgroundImage: '/figures/history/medicine/black-death/plague-background.png',
}

export const builderBlock = {
  ...baseBuilderBlock,
  backgroundImage: '/headers/bio-energyforlife.webp',
  backgroundOpacity: 0.72,
}

export const builderMaths = {
  ...baseBuilderMaths,
  backgroundImage: '/headers/maths-numbers.webp',
  backgroundOpacity: 0.7,
  numeric: true,
  workspaceLabel: 'Missing-value expression',
  slotGroupLabel: 'Expression',
  bankLabel: 'Value choices',
}

export const builderQuote = {
  ...baseBuilderQuote,
  layout: 'text',
  textStyle: 'literary',
  workspaceLabel: 'Quotation builder',
  slotGroupLabel: 'Quotation',
  completionNoun: 'quotation',
  completedInstruction: 'You restored the quotation.',
  successHeading: 'Quotation restored',
  backgroundImage: '/English/Macbeth/heroes/macbeth-generic-banner.svg',
  backgroundOpacity: 0.82,
}

export const builderConcept = {
  layout: 'text',
  textStyle: 'plain',
  label: 'Rebuild the concept',
  instruction: 'Choose the missing key terms to complete the definition.',
  template: 'Primary socialisation is the process through which children learn the {{0}} and {{1}} of their society.',
  slots: [null, null],
  pieces: ['norms', 'values', 'status', 'sanctions'],
  answer: ['norms', 'values'],
  hint: 'Think about the shared rules and beliefs children learn first within the family.',
  successText: 'Primary socialisation teaches children the norms and values of their society, mainly through the family.',
  workspaceLabel: 'Sociology concept builder',
  slotGroupLabel: 'Concept',
  bankLabel: 'Key terms',
  completionNoun: 'concept',
  completedInstruction: 'You rebuilt the concept.',
  successHeading: 'Concept complete',
  backgroundImage: '/headers/sociology-family.webp',
  backgroundOpacity: 0.72,
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

// Live Episode 3 shape — the cinematic person-to-person comparison reviewed in
// the Component Lab. TheoryCompare also serves belief-versus-reality and
// concept comparisons that supply no portraits.
export const theoryCompare = {
  type: 'theoryCompare',
  title: 'Galen and Vesalius',
  heroImage: '/figures/history/medicine/renaissance/galen-vesalius-hero.webp',
  heroImageAlt: 'Galen in Roman dress before classical ruins and animal anatomy sketches, standing back to back with Vesalius in Renaissance dress beside an anatomical book and a human skeleton',
  heroObjectPosition: 'center 24%',
  emphasisSide: 'right',
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
        { label: 'Jaw', left: 'The human jaw had two bones', right: 'The human jaw was one bone' },
        { label: 'Ribs', left: 'Men had fewer ribs than women', right: 'Men and women had the same number of ribs' },
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

// ─── GuidedExamResponse cross-subject review fixtures ────────────────────────

export const guidedExamResponse = {
  ...baseGuidedExamResponse,
  questionType: 'explain-why',
  supportMode: 'guided',
  introText: 'Write two developed reasons. Each one needs precise evidence and a clear link back to the question.',
  labels: {
    start: 'Start my answer',
    submit: 'Submit my answer',
    writingHeader: 'Build your explanation',
  },
  sections: [
    {
      id: 'reason-one',
      label: 'Reason 1',
      starter: 'One reason Vesalius could challenge Galen was...',
      inputPlaceholder: 'Develop your first reason…',
      hints: [
        'Choose one factor: human dissection, printing, humanism, anatomy theatres or the Reformation.',
        'Add precise evidence, then explain how it made Galen easier to challenge.',
      ],
    },
    {
      id: 'reason-two',
      label: 'Reason 2',
      starter: 'A second reason was...',
      inputPlaceholder: 'Develop a different reason…',
      hints: [
        'Pick a factor that is clearly different from your first reason.',
        'Use a named detail such as the 1543 book, then link it directly to the spread or acceptance of new ideas.',
      ],
    },
  ],
}

export const guidedExamResponseEnglish = {
  board: 'aqa',
  subject: 'english',
  subjectLabel: 'English literature',
  topic: 'Macbeth',
  questionType: 'literature-essay',
  supportMode: 'guided',
  beatText: 'Now build your own interpretation.',
  question: 'Starting with this speech, how does Shakespeare present Macbeth’s ambition? Write about this speech and the play as a whole. (30 marks)',
  marks: 30,
  introText: 'Build one clear interpretation, analyse Shakespeare’s methods and connect it to the wider play.',
  labels: {
    writingHeader: 'Build your analysis',
    start: 'Start my analysis',
    submit: 'Submit my analysis',
    rewrite: 'A sharper analytical line',
  },
  sources: [
    {
      label: 'Extract',
      attribution: 'Macbeth, Act 1 Scene 4',
      text: '“Stars, hide your fires;\nLet not light see my black and deep desires.”',
    },
  ],
  sections: [
    {
      id: 'interpretation',
      label: 'Your interpretation',
      starter: 'Shakespeare presents Macbeth’s ambition as...',
      inputPlaceholder: 'State your main interpretation…',
      hints: [
        'Decide whether his ambition appears secretive, dangerous, shameful or already powerful.',
        'Make the interpretation arguable rather than simply retelling what happens.',
      ],
    },
    {
      id: 'method',
      label: 'Evidence and method',
      starter: 'The phrase “...” suggests...',
      inputPlaceholder: 'Choose a quotation and analyse how it works…',
      hints: [
        'Zoom in on “hide”, “black” or “deep”. Name the method only when it helps your explanation.',
        'Explain what the word makes the audience understand about Macbeth.',
      ],
    },
    {
      id: 'whole-play',
      label: 'Across the play',
      starter: 'Elsewhere in the play, Shakespeare develops this idea when...',
      inputPlaceholder: 'Connect the interpretation to another moment…',
      hints: [
        'Choose a later moment where ambition changes Macbeth’s choices or relationships.',
        'Explain whether Shakespeare presents ambition differently by the end of the play.',
      ],
    },
  ],
  markScheme: `Mark against AQA GCSE English Literature principles.
AO1: a clear, developed response using relevant references.
AO2: analysis of Shakespeare's language, form and structure and their effects.
AO3: relevant understanding of ideas and context integrated into the argument.
Reward a coherent interpretation, precise quotation analysis and links across the play. Do not reward feature spotting without explanation.`,
}

export const guidedExamResponseScience = {
  board: 'aqa',
  subject: 'biology',
  subjectLabel: 'Biology',
  topic: 'Enzymes required practical',
  questionType: 'required-practical',
  supportMode: 'guided',
  beatText: 'Plan it like a scientist.',
  question: 'A student investigates the effect of temperature on the rate at which amylase breaks down starch. Explain how the student could obtain valid results and identify the end point. (6 marks)',
  marks: 6,
  introText: 'Describe a workable method, control the important variables and make the end point measurable.',
  labels: {
    writingHeader: 'Plan the investigation',
    start: 'Start my method',
    submit: 'Submit my method',
    rewrite: 'A clearer practical step',
  },
  sections: [
    {
      id: 'method',
      label: 'Method',
      inputPlaceholder: 'Describe the practical in a logical order…',
      hints: [
        'Include amylase, starch, iodine and a water bath set to a chosen temperature.',
        'Say how often samples are tested and what is recorded.',
      ],
    },
    {
      id: 'variables',
      label: 'Variables and validity',
      inputPlaceholder: 'Explain what must be controlled and repeated…',
      hints: [
        'Control pH, enzyme concentration, starch concentration and the volumes used.',
        'Repeat each temperature and calculate a mean, ignoring anomalous results only with justification.',
      ],
    },
    {
      id: 'end-point',
      label: 'End point',
      inputPlaceholder: 'Explain how the colour change shows completion…',
      hints: [
        'Iodine stays orange-brown when no starch remains.',
        'The time taken to reach that colour can be used to compare rate.',
      ],
    },
  ],
  markScheme: `Award up to 6 marks for a coherent required-practical method.
Credit: controlled temperatures using water baths; equal volumes and concentrations; controlled pH; regular sampling onto iodine; correct orange-brown end point; timing; repeats and a mean; a valid comparison of rate.
Do not credit vague statements such as "keep it fair" without naming the controlled variable or action.`,
}

export const guidedExamResponseMaths = {
  board: 'aqa',
  subject: 'maths',
  subjectLabel: 'Maths',
  topic: 'Solving linear equations',
  questionType: 'calculation',
  supportMode: 'light',
  question: 'Solve 3(x + 4) = 27. Show your working. (3 marks)',
  marks: 3,
  introText: 'Show each operation clearly so method marks are visible even if the final answer slips.',
  labels: {
    writingHeader: 'Show your method',
    start: 'Start working',
    submit: 'Check my solution',
    marking: 'Checking your solution…',
    rewrite: 'A clearer working line',
  },
  sections: [
    {
      id: 'working',
      label: 'Working',
      inputPlaceholder: 'Write one line of working at a time…',
      spellCheck: false,
      hints: ['Undo the multiplication by 3 before undoing the addition of 4.'],
    },
    {
      id: 'answer-check',
      label: 'Answer and check',
      inputPlaceholder: 'State x and substitute it back into the equation…',
      spellCheck: false,
      hints: ['Your value should make the left-hand side equal 27.'],
    },
  ],
  markScheme: `3 marks total.
1 mark for dividing both sides by 3 to obtain x + 4 = 9, or an equivalent valid method.
1 mark for subtracting 4 to obtain x = 5.
1 mark for the correct final answer, with a valid check accepted as confirmation.
Award method marks where clear working is shown even if a later arithmetic slip occurs.`,
}

export const guidedExamResponseSociology = {
  board: 'aqa',
  subject: 'sociology',
  subjectLabel: 'Sociology',
  topic: 'Families',
  questionType: 'evaluate',
  supportMode: 'guided',
  beatText: 'Build the argument, then weigh it up.',
  question: 'Evaluate the view that the family benefits all members of society. (20 marks)',
  marks: 20,
  introText: 'Use competing perspectives, evidence and a justified judgement rather than listing theories.',
  labels: {
    writingHeader: 'Build your evaluation',
    start: 'Start my argument',
    submit: 'Submit my evaluation',
    rewrite: 'A stronger evaluative line',
  },
  sections: [
    {
      id: 'supporting-view',
      label: 'Argument supporting the view',
      starter: 'Functionalists would argue that the family benefits society because...',
      inputPlaceholder: 'Develop the argument and use evidence…',
      hints: [
        'Use a named idea such as primary socialisation or stabilisation of adult personalities.',
        'Explain how the function is claimed to benefit both individuals and wider society.',
      ],
    },
    {
      id: 'challenge-view',
      label: 'Argument challenging the view',
      starter: 'However, this view can be challenged because...',
      inputPlaceholder: 'Use a contrasting perspective and explain it…',
      hints: [
        'Choose a Marxist or feminist criticism and identify who may not benefit.',
        'Use evidence or a named sociologist, then explain why it weakens the claim that everyone benefits.',
      ],
    },
    {
      id: 'judgement',
      label: 'Overall judgement',
      starter: 'Overall, the view is convincing to the extent that...',
      inputPlaceholder: 'Weigh the arguments and reach a justified conclusion…',
      hints: [
        'Do not simply repeat both sides. Decide which explanation is stronger and state why.',
        'Qualify your judgement: benefits may depend on gender, class, family type or the function being considered.',
      ],
    },
  ],
  markScheme: `20 marks. Reward accurate sociological knowledge, application to the question, developed analysis and evaluation.
High-level responses use named perspectives or sociologists, develop both supporting and challenging arguments, apply evidence and reach a reasoned judgement.
Do not reward a list of theories with no explanation of how they support or challenge the view.`,
}

// CalculationBreakdown — the reference worked example: solve 3(x − 4) = 2x + 7.
export const calculationBreakdown = {
  goalPrompt: 'Solve for x',
  problem: '3(x − 4) = 2x + 7',
  understand: {
    whatsHappening: 'We need to solve for x. That means we want x on its own on one side of the equation.',
    goal: 'Isolate x',
    check: {
      question: 'What is the goal of solving for x?',
      options: ['Make the equation bigger', 'Get x on its own', 'Remove the brackets'],
      correct: 1,
    },
  },
  steps: [
    {
      mode: 'worked',
      title: 'Expand the brackets',
      why: 'Multiply 3 by everything inside the brackets.',
      transform: { from: '3(x − 4) = 2x + 7', to: '3x − 12 = 2x + 7' },
      whyStep: 'Expanding the brackets removes the grouping so we can simplify each side.',
      check: {
        question: 'Is this expansion correct?',
        options: ['3x − 12 = 2x + 7', '3x + 4 = 2x + 7', '3x − 4 = 2x + 7'],
        correct: 0,
      },
      cta: 'Looks good',
    },
    {
      mode: 'worked',
      title: 'Subtract 2x from both sides',
      why: 'This keeps the equation balanced and moves the x terms together.',
      transform: { from: '3x − 12 = 2x + 7', leftOp: '− 2x', rightOp: '− 2x', to: 'x − 12 = 7' },
      whyStep: 'Taking 2x from each side keeps it balanced while collecting the x terms on one side.',
      check: {
        question: 'What should the equation look like after subtracting 2x?',
        options: ['x − 12 = 7', 'x = 19', '5x − 12 = 7'],
        correct: 0,
      },
      cta: 'Continue',
    },
    {
      mode: 'yourTurn',
      title: 'Add 12 to both sides',
      why: 'This will move −12 to the other side to cancel it out.',
      transform: { from: 'x − 12 = 7', leftOp: '+ 12', rightOp: '+ 12', to: 'x = 19' },
      answer: '19',
      resultExpr: 'x = 19',
      hint: 'Think: what happens when you add 12 to both sides? 7 + 12 = ?',
      cta: 'See the solution',
    },
  ],
  solution: {
    celebrateTitle: 'Well done!',
    celebrateSubtitle: 'You solved for x.',
    result: 'x = 19',
    why: 'Each step keeps the equation balanced. We isolate x to find its value.',
  },
}

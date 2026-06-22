// Episode file — owns the runtime teaching sequence for one episode.
//
// Future episode files follow this shape:
//   id          — matches src/modules.js metadata id
//   subject     — must match SUBJECT_MODULE_LOADERS key in LegacyApp.jsx
//   number      — ordering within the series (displayed in module cards)
//   series      — series identifier (future: 'medicine-through-time')
//   recallTags  — (future) weakness tags this episode generates
//   examTags    — (future) AQA exam topic tags
//   assetKeys   — (future) keys into assets.js for image resolution
//   hook, stageNavigation, outcomes, intro, recall, screens — runtime teaching data
//
// Actual image files live in public/history/medicine/.
// Asset path resolution lives in src/content/history/medicine/assets.js.
// Canonical content + architecture docs live in docs/content/history/medicine/.

export default {
  id: 'history-medicine-jenner-vaccination',
  subject: 'History',
  number: 5,
  title: 'The boy, the cow and the cure',
  subtitle: 'Edward Jenner and the birth of vaccination',
  era: 'c.1796–c.1853',
  icon: '🐄',
  color: '#BD7224',
  colorLight: 'rgba(189,114,36,.12)',
  // future fields — add when canonical content is authored:
  series: 'medicine-through-time',
  recallTags: [],
  examTags: [],
  assetKeys: [],
  hook: {
    statement: 'Edward Jenner invented vaccination by studying how the immune system fights disease.',
    isTrue: false,
    accentWords: ['the immune system'],
    backgroundImage: '/images/jenner-1796.png',
    explanation: "Jenner had never heard of the immune system — that idea didn't exist for almost another century. He worked from a simple farmyard observation, decades before anyone understood why it worked.",
    revealBeats: [
      'Jenner had no idea what a virus was, or what the immune system did.',
      'He noticed dairy workers who had caught cowpox never seemed to catch smallpox.',
      'In 1796, he scratched cowpox matter into eight-year-old James Phipps, then deliberately exposed him to smallpox.',
      'Phipps stayed healthy.',
      'By 1853, vaccination was made compulsory in England — decades before anyone understood why it worked.',
    ],
  },
  // TODO: module only has 1 screen — expand content before activating full stageNavigation.
  stageNavigation: [
    { id: 'part-1', title: 'Smallpox: The Killer Everyone Feared', description: 'Context: the disease and early variolation.', screenIndex: 0 },
    { id: 'part-2', title: 'Before Jenner: Risky Protection', description: 'Variolation as imperfect prevention.', screenIndex: 0 },
    { id: 'part-3', title: 'The Cowpox Clue', description: "Jenner's farmyard observation.", screenIndex: 0 },
    { id: 'part-4', title: 'From Experiment to Vaccination', description: 'The James Phipps trial and proof of concept.', screenIndex: 0 },
    { id: 'part-5', title: 'A Prevention Breakthrough', description: 'Spread and compulsory vaccination by 1853.', screenIndex: 0 },
    { id: 'part-6', title: 'Exam Prep: Why Vaccination Mattered', description: 'Exam practice and final application.', screenIndex: 0 },
  ],
  screens: [
    {
      tag: 'vaccination',
      label: 'Jenner',
      kicker: '1796',
      heading: 'Jenner develops the smallpox vaccine.',
      headerImage: '/images/jenner-1796.png',
      sub: 'The first vaccine — discovered by observation, not by understanding germs.',
      blocks: [
        { type: 'read', label: '💉 What Happened', text: '<strong>Edward Jenner</strong> noticed that milkmaids who caught <strong>cowpox</strong> rarely got <strong>smallpox</strong>. In 1796 he deliberately infected James Phipps — a boy — with cowpox, then exposed him to smallpox. The boy did not get ill. The <strong>smallpox vaccine</strong> was born.' },
        { type: 'keypoint', text: '<strong>Critical exam point:</strong> Jenner did not know about germs or the immune system. He worked by observation and experiment — not by understanding why it worked. Pasteur later explained the mechanism. This shows how <strong>chance observation + scientific method</strong> can lead to breakthroughs.' },
        { type: 'funfact', label: '😨 Controversy', text: 'Many people were horrified. Cartoons showed patients growing cow heads after vaccination. The Church opposed it. Parliament eventually made smallpox vaccination compulsory in 1853 — the first compulsory vaccination law in England.' },
        { type: 'quiz', question: "Why is Jenner's smallpox vaccine significant for understanding medical progress?", options: [
          { text: 'It proved that observation and experiment could produce breakthroughs even without understanding the cause', correct: true },
          { text: 'It proved that germ theory was correct', correct: false },
          { text: 'It showed that the Church supported scientific progress', correct: false },
        ], explanation: 'Jenner had no knowledge of germs or immunity — he used observation and careful experiment. His work paved the way for Pasteur, who later explained WHY vaccines work.' },
      ],
    },
  ],
}

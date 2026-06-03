// ─── Recovery Quizzes v1 ────────────────────────────────────────────────────
//
// Lightweight surgical interventions for weak spot recovery.
// NOT full modules — highly focused, short-duration concept repairs.
//
// Structure:
// {
//   id: unique quiz identifier,
//   subject: subject name,
//   estimatedTime: seconds,
//   topic: weak concept name,
//   questions: [ { type, question, options, correct, explanation } ],
// }
//
// Trigger: learner gets 2+ related questions wrong, or misses flagged core concept.
// Result: quick recall loop to repair the misconception.

export const recoveryQuizzes = {
  // ─── History: Medieval Medicine ─────────────────────────────────────────────

  'history-miasma-recovery-1': {
    id: 'history-miasma-recovery-1',
    subject: 'History',
    estimatedTime: 90,
    topic: 'Miasma theory',
    questions: [
      {
        type: 'choice',
        question: 'What did medieval doctors believe caused disease through miasma theory?',
        options: [
          'Bad air from rotting matter',
          'Imbalance in the four humours',
          'God\'s punishment for sin',
          'Planetary alignment',
        ],
        correct: 0,
        explanation: 'Miasma theory blamed bad air. It was wrong, but it was logical reasoning based on observation.',
      },
      {
        type: 'choice',
        question: 'Why was miasma theory considered "rational" even though it was incorrect?',
        options: [
          'Because the Church approved it',
          'Because it was based on observation and logical thinking about smell and disease',
          'Because scientists proved it in laboratories',
          'Because it matched germ theory exactly',
        ],
        correct: 1,
        explanation: 'Rational means based on logic and observation — not necessarily correct. People saw bad smells and sick people together, so they connected them.',
      },
      {
        type: 'choice',
        question: 'Which of these is NOT a reason why miasma theory seemed reasonable at the time?',
        options: [
          'Bad smells DID come from decaying matter',
          'Diseases WERE more common in foul-smelling areas',
          'Doctors had microscopes that proved the theory',
          'Miasma was based on logical observation of the environment',
        ],
        correct: 2,
        explanation: 'Doctors did NOT have microscopes. Miasma seemed reasonable because of what people could actually observe — bad smells and disease in the same places.',
      },
    ],
  },

  'history-four-humours-recovery-1': {
    id: 'history-four-humours-recovery-1',
    subject: 'History',
    estimatedTime: 90,
    topic: 'Four Humours theory',
    questions: [
      {
        type: 'choice',
        question: 'What were the Four Humours that medieval doctors believed existed in the body?',
        options: [
          'Fire, water, earth, and air',
          'Blood, phlegm, yellow bile, and black bile',
          'Heart, liver, brain, and lungs',
          'Hot, cold, wet, and dry',
        ],
        correct: 1,
        explanation: 'The Four Humours (blood, phlegm, yellow bile, black bile) were believed to control health. Illness meant imbalance.',
      },
      {
        type: 'choice',
        question: 'Why did medieval doctors use bloodletting as a treatment?',
        options: [
          'To cure infection',
          'Because they understood how blood carries oxygen',
          'To rebalance the humours by removing "excess blood"',
          'To make patients immune to disease',
        ],
        correct: 2,
        explanation: 'Doctors believed removing blood could restore balance and health. It was based on wrong theory, but made logical sense to them.',
      },
      {
        type: 'choice',
        question: 'What is the key reason the Four Humours theory failed as medicine?',
        options: [
          'The Church banned it',
          'It was based on an incorrect understanding of what caused disease',
          'People refused to believe it',
          'Doctors were too afraid to use it',
        ],
        correct: 1,
        explanation: 'Health was NOT caused by imbalanced humours. Without understanding real causes (bacteria, infection), the treatments could never work.',
      },
    ],
  },

  'history-religion-medicine-recovery-1': {
    id: 'history-religion-medicine-recovery-1',
    subject: 'History',
    estimatedTime: 90,
    topic: 'Religion\'s role in medieval medicine',
    questions: [
      {
        type: 'choice',
        question: 'How did religion influence medical treatment in medieval England?',
        options: [
          'The Church invented microscopes',
          'People used prayer, pilgrimage, and relics because they believed illness was God\'s punishment',
          'Religious leaders banned all medicine',
          'Doctors had to memorize the Bible',
        ],
        correct: 1,
        explanation: 'Religion taught that illness was punishment for sin. People prayed, made pilgrimages, and used relics hoping God would heal them.',
      },
      {
        type: 'choice',
        question: 'Why did religious treatments seem reasonable to medieval people?',
        options: [
          'Because prayers cured the Black Death',
          'Because science had proven God caused illness',
          'Because many people BELIEVED illness was God\'s punishment, so appeasing God seemed logical',
          'Because the Pope invented antibiotics',
        ],
        correct: 2,
        explanation: 'Religious treatments fit the belief system. If people genuinely believed God sent illness as punishment, then prayer and repentance were logical responses.',
      },
      {
        type: 'choice',
        question: 'What is the connection between medieval religious belief and medical failure?',
        options: [
          'Religion worked but doctors refused to use it',
          'Because people only prayed and never used medicine',
          'Prayer could not cure bacteria or treat actual infection, so no religious treatment actually worked',
          'The Church had better medicine than doctors',
        ],
        correct: 2,
        explanation: 'Religious treatments felt logical given medieval beliefs, but prayer cannot cure infection. Without understanding real causes, the treatments could not work.',
      },
    ],
  },

  // ─── History: Black Death ─────────────────────────────────────────────────

  'history-black-death-recovery-1': {
    id: 'history-black-death-recovery-1',
    subject: 'History',
    estimatedTime: 90,
    topic: 'Why medieval treatments failed against the Black Death',
    questions: [
      {
        type: 'choice',
        question: 'Why did medieval doctors fail to stop the Black Death?',
        options: [
          'They refused to try new treatments',
          'They did not understand the real cause (bacteria spread by fleas), so their treatments could never work',
          'They were not educated',
          'The plague was sent by aliens',
        ],
        correct: 1,
        explanation: 'Doctors believed in miasma, humours, and God\'s punishment. None of these explanations were correct. Without knowing about bacteria, they could not stop it.',
      },
      {
        type: 'choice',
        question: 'Which medieval medical treatment could have stopped the Black Death?',
        options: [
          'Bloodletting',
          'Prayer and pilgrimage',
          'Carrying posies of flowers',
          'None of them — you need antibiotics and sanitation to stop bacterial infection',
        ],
        correct: 3,
        explanation: 'Medieval treatments could NOT have worked because they were based on wrong theories. The plague is bacterial infection spread by fleas — prevention and antibiotics are needed.',
      },
      {
        type: 'choice',
        question: 'What does the failure of medieval medicine against the Black Death teach us?',
        options: [
          'Medieval doctors were stupid',
          'Medicine is useless',
          'Understanding the ACTUAL CAUSE of disease is essential to treating it',
          'Prayer is never helpful',
        ],
        correct: 2,
        explanation: 'The lesson: wrong cause = wrong cure, always. Medieval doctors were logical given their beliefs, but their beliefs about disease causes were fundamentally wrong.',
      },
    ],
  },

  // Placeholder for future subjects
  // Add Biology, Chemistry, Maths, English, Physics, Sociology quizzes here as needed
}

export default recoveryQuizzes

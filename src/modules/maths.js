// ─── Maths module content — full lesson data for Maths modules ───────────
// Loaded on demand (dynamic import) by App.jsx when a Maths module is opened.
// Metadata for browsing/cards lives in src/modules.js — keep that file's entries
// (id, subject, number, title, subtitle, era, icon, color, colorLight, headerImage,
// screenCount, screenTags) in sync if you add/remove a module here.

export const MATHS_MODULES = [
  {
    id: 'math1',
    subject: 'Maths',
    number: 1,
    title: 'Maths Survival Basics',
    subtitle: 'Number sense, negatives, BIDMAS',
    era: 'Foundation',
    icon: '🔢',
    color: '#4B90FF',
    colorLight: 'rgba(75,144,255,.12)',
    hook: {
      scenario: {
        location: 'Any exam hall',
        hint: 'A student stares at −8 and −3 on a number line. Which is bigger?',
      },
      statement: 'Negative numbers are always smaller than positive numbers.',
      isTrue: false,
      accentWords: ['always smaller'],
      explanation: "−3 is larger than −8. Negative numbers get smaller as they move further from zero. Direction matters, not just the minus sign.",
      wrongFeedback: 'Not quite. With negatives, think left and right — not just bigger digit.',
      correctFeedback: 'Right. −3 is bigger than −8 because it\'s further right on the number line.',
      loadingText: 'Let\'s see why on a number line…',
      bigQuestion: 'So how do we actually compare negative numbers?',
      revealHeader: 'Think left and right — not just bigger digit.',
      revealItems: [
        { emoji: '📍', label: 'Use a number line', detail: '−3 sits to the RIGHT of −8. Further right = bigger. Always.', color: '#4B90FF', bg: 'rgba(75,144,255,.08)' },
        { emoji: '🌡️', label: 'Real examples', detail: '−3°C is warmer than −8°C. £−3 means less debt than £−8. Position on the line tells you size.', color: '#4B90FF', bg: 'rgba(75,144,255,.08)' },
        { emoji: '⚠️', label: 'The common trap', detail: 'Students see −8 and think "8 is bigger than 3, so −8 is bigger." That\'s the trap. The minus flips it.', color: '#FF6B6B', bg: 'rgba(255,107,107,.08)' },
      ],
      punchline: 'Number line thinking beats digit thinking every time. That\'s the whole key.',
    },
    intro: {
      learningGoals: [
        'Move confidently on a number line — adding right, subtracting left',
        'Handle negative numbers without sign panic',
        'Use BIDMAS so calculations happen in the right order',
        'Estimate first, then check if calculator answers are sensible',
      ],
    },
    outcomes: {
      intro: 'Before anything else in maths makes sense, these fundamentals need to click. This chapter makes them click.',
      bullets: [
        'Work confidently with negative numbers without second-guessing yourself',
        'Apply BIDMAS correctly so you stop losing easy marks',
        'Handle rounding, estimation and significant figures under exam pressure',
        'See why these basics show up in almost every GCSE maths question',
      ],
    },

    recall: {
      questions: [
        { type: 'truefalse', question: '−3 is a greater value than −8.', isTrue: true },
        { type: 'choice', question: 'In BIDMAS, what do you always calculate first?', options: ['Any addition you can see', 'Whatever is inside brackets', 'Division before multiplication'], correct: 1 },
        { type: 'connection', question: 'Estimation matters in exams because...', options: [
          { text: 'It\'s always accurate enough to use as a final answer', icon: 'arrow' },
          { text: 'It helps you catch calculator errors before you write them down', icon: 'lightbulb' },
          { text: 'It replaces the need to do actual calculation', icon: 'warning' },
        ], correct: 1 },
      ],
    },
    screens: [
      {
        label: 'Number Line',
        kicker: 'Core Skill 1',
        heading: 'Adding moves right.',
        sub: 'On a number line, right means bigger. Left means smaller.',
        blocks: [
          { type: 'read', label: '💸 Why This Matters', text: 'Used for <strong>temperatures</strong>, <strong>bank balances</strong>, <strong>scores</strong> and exam checking.' },
          {
            type: 'numberline',
            startAt: -3,
            operations: [
              { label: 'Add 8', delta: 8 },
              { label: 'Subtract 5', delta: -5 },
            ],
            quiz: {
              q: 'Where would −2 + 6 land?',
              options: ['−8', '4', '8'],
              correct: 1,
              explanation: 'Start at −2. Adding 6 moves right. You land on 4.',
            },
            hints: ['Start at −3.', 'Adding means move right.', 'Move 8 spaces to the right.', 'You land on 5.'],
          },
        ],
      },
      {
        label: 'Movement Rules',
        kicker: 'Active Recall',
        heading: 'Complete the movement rules.',
        sub: 'Lock in the rules that matter all year.',
        blocks: [
          { type: 'read', label: '🎯 Why This Matters', text: 'This is the rule that stops <strong>negative-number mistakes</strong> in every topic — fractions, algebra, percentages.' },
          {
            type: 'fillblanks',
            sentences: [
              { before: 'Adding moves', after: '.', answer: 'right', hints: ['Think number line direction.', 'Positive movement goes this way →'] },
              { before: 'Subtracting moves', after: '.', answer: 'left', hints: ['Opposite of adding.', 'Think ← direction.'] },
              { before: 'Numbers further right are', after: '.', answer: 'bigger', hints: ['Look at a number line.', '5 is to the right of 2. Which is bigger?'] },
              { before: '−3 is bigger than −8 because it is closer to', after: '.', answer: 'zero', hints: ['Think about position on the number line.', 'Which is further right?'] },
            ],
            correctMsg: 'Nice. That rule matters all year.',
            wrongMsg: 'Check the number line: adding moves right, subtracting moves left.',
          },
        ],
      },
      {
        label: 'BIDMAS',
        kicker: 'Core Skill 2',
        heading: 'Calculations happen in layers.',
        sub: 'Some parts of a calculation must happen before others.',
        blocks: [
          { type: 'read', label: '🧮 Why This Matters', text: 'Used whenever <strong>calculators</strong>, <strong>formulas</strong> or <strong>multi-step sums</strong> appear. BIDMAS prevents wrong answers.' },
          {
            type: 'bidmas',
            expression: '3 + 4 × 2',
            question: 'Which part should happen first?',
            options: ['3 + 4', '4 × 2', '3 × 2'],
            correct: 1,
            steps: [
              { highlight: '4 × 2', becomes: '8', newExpr: '3 + 8' },
              { highlight: '3 + 8', becomes: '11', newExpr: '11' },
            ],
            wrongPath: ['❌ 3 + 4 = 7', '7 × 2 = 14 ✗'],
            correctPath: ['✅ 4 × 2 = 8', '3 + 8 = 11 ✓'],
            examTip: 'Brackets change everything. Calculators follow order rules exactly.',
          },
        ],
      },
      {
        label: 'Quiz',
        kicker: 'Practice',
        heading: 'Test yourself.',
        sub: 'Three levels. Work through them in order.',
        blocks: [
          { type: 'read', label: '⚡ Why This Matters', text: 'Quick practice helps your brain <strong>recognise patterns faster</strong>.' },
          {
            type: 'tieredquiz',
            tiers: [
              {
                label: 'Warm Up', emoji: '🟢',
                questions: [
                  { q: 'Which is bigger?', options: ['−7', '−2', 'They are equal'], correct: 1, feedback: '−2 is further right on the number line.', hint: 'Imagine a number line.' },
                  { q: 'Calculate: −4 + 9', options: ['−13', '5', '13'], correct: 1, feedback: 'Start at −4 and move right 9.', hint: 'Start at −4, adding means move right.' },
                  { q: 'What happens first in: 6 + 3 × 4', options: ['6 + 3', '3 × 4', '6 × 4'], correct: 1, feedback: 'Multiplication happens before addition (BIDMAS).', hint: 'Which operation has higher priority?' },
                ],
              },
              {
                label: 'Challenge', emoji: '🟡',
                questions: [
                  { q: 'Calculate: 12 − 19', options: ['7', '−7', '−31'], correct: 1, feedback: '12 − 12 = 0. Then 7 more left gives −7.', hint: 'You will cross zero going left.' },
                  { q: 'Calculate: 5 + 6²', options: ['121', '41', '66'], correct: 1, feedback: '6² = 36. Then 5 + 36 = 41. Powers before addition.', hint: 'Indices (powers) come before addition in BIDMAS.' },
                  { q: 'Estimate: 302 × 19 is closest to...', options: ['600', '6000', '60 000'], correct: 1, feedback: '302 ≈ 300, 19 ≈ 20. 300 × 20 = 6000.', hint: 'Round both numbers to 1 significant figure first.' },
                ],
              },
              {
                label: 'Boss Mode', emoji: '🔴',
                questions: [
                  { q: 'A calculator says: 12 × 4 = 0.48. What should you think?', options: ['Accept it', 'Impossible — should be about 50', 'Round it to 0.5'], correct: 1, feedback: '12 × 4 = 48. 0.48 is a decimal/place-value error.', hint: 'Estimate first: 12 × 4 is roughly 10 × 4 = 40.' },
                  { q: 'Which calculator input matches: 4(3 + 5)', options: ['4 × 3 + 5', '4 × (3 + 5)', '4 + 3 × 5'], correct: 1, feedback: 'Brackets force 3 + 5 to happen first.', hint: 'The brackets must be entered into the calculator too.' },
                  { q: 'Calculate: 2 × (7 + 3) − 4', options: ['10', '16', '24'], correct: 1, feedback: 'Brackets first: 7+3=10. Multiply: 2×10=20. Subtract: 20−4=16.', hint: 'Brackets first, then multiplication, then subtraction.' },
                ],
              },
            ],
          },
        ],
      },
      {
        label: 'Checkpoint',
        kicker: 'True or False',
        heading: 'Is this calculator answer possible?',
        sub: 'Impossible answers are warning lights.',
        blocks: [
          { type: 'read', label: '🚨 Why This Matters', text: 'Used to catch answers that <strong>cannot possibly be right</strong> — the most common reason for lost marks.' },
          {
            type: 'tfcheckpoint',
            statement: '12 × 4 = 0.48 could be correct.',
            isTrue: false,
            revealHeader: 'FALSE.',
            revealSub: '12 × 4 should be around 50.',
            breakdown: [
              '12 × 4 = 48',
              '0.48 is less than 1',
              '12 lots of 4 cannot be less than 1',
              'So the calculator entry went wrong',
            ],
            wrongDisplay: '0.48',
            rightDisplay: '48',
          },
        ],
      },
      {
        label: 'Simulator',
        kicker: 'Apply It',
        heading: 'The calculator is not your boss.',
        sub: 'Estimate first. Then decide if the answer is sensible.',
        blocks: [
          { type: 'read', label: '🧾 Why This Matters', text: 'Used when <strong>shopping</strong>, <strong>budgeting</strong> and checking exam answers.' },
          {
            type: 'simulator',
            scenarios: [
              {
                scenario: '9 cinema tickets cost £7 each.',
                display: '£6.30',
                answer: 'impossible',
                hints: ['One ticket costs £7.', 'Nine tickets must cost more than £7.', '9 × 7 = 63.'],
                breakdown: ['9 × 7 = 63', 'Total should be £63', '£6.30 is 10 times too small', 'Likely mistake: decimal point error'],
              },
              {
                scenario: 'A notebook costs £2.75. Jay buys 6. Estimate: 6 × £3 ≈ £18.',
                display: '£16.50',
                answer: 'possible',
                hints: ['Estimate: 6 × £3 = £18.', '£16.50 is close to £18.'],
                breakdown: ['6 × £2.75 = £16.50', '£16.50 is close to the £18 estimate', 'Sensible answer ✓'],
              },
              {
                scenario: 'A rectangle is 12 cm by 5 cm. The calculator shows the area.',
                display: '0.6 cm²',
                answer: 'impossible',
                hints: ['Area = length × width.', '12 × 5 = ?'],
                breakdown: ['12 × 5 = 60', '0.6 is far too small', 'Likely decimal point error'],
              },
            ],
          },
        ],
      },
      {
        label: 'Exam Practice',
        kicker: 'Exam Style',
        heading: 'Exam Practice',
        sub: 'Answer the questions. Get feedback on method, not just the final answer.',
        blocks: [
          { type: 'read', label: '📝 Why This Matters', text: 'Used to turn practice into <strong>marks</strong>. Method matters as much as the answer.' },
          {
            type: 'boss',
            tier: '🟢',
            label: 'Q1 — Number Line',
            question: 'Calculate: −6 + 14',
            markPoints: [
              'Answer: 8',
              'Method: start at −6, move right 14',
              'Award 1 mark for correct answer',
            ],
          },
          {
            type: 'boss',
            tier: '🟡',
            label: 'Q2 — BIDMAS',
            question: 'Calculate: 10 + 2 × 5',
            markPoints: [
              'Answer: 20',
              'Method: multiplication first — 2 × 5 = 10, then 10 + 10 = 20',
              'Common error: adding first gives 12 × 5 = 60 (wrong)',
              'Award 1 mark for correct answer with correct order shown',
            ],
          },
          {
            type: 'boss',
            tier: '🔴',
            label: 'Q3 — Estimation (2 marks)',
            question: 'A student calculates: 302 × 19 = 5738. Use estimation to decide whether this is sensible. Show your working.',
            markPoints: [
              '1 mark: estimate shown — 300 × 20 = 6000 (or equivalent)',
              '1 mark: conclusion — 5738 is close to 6000 so the answer is sensible',
              'Must show the estimate, not just say yes',
            ],
          },
        ],
      },
      {
        label: 'Final Rewind',
        kicker: 'Retrieval',
        heading: 'Final Rewind',
        sub: 'Strong maths comes from retrieval, not rereading.',
        blocks: [
          { type: 'read', label: '🔁 Why This Matters', text: 'Retrieval practice <strong>builds long-term memory</strong> faster than re-reading notes.' },
          {
            type: 'quiz',
            question: 'Adding on a number line moves:',
            options: [
              { text: 'left', correct: false },
              { text: 'right', correct: true },
              { text: 'nowhere', correct: false },
            ],
            explanation: 'Adding always moves right on the number line.',
          },
          {
            type: 'quiz',
            question: 'Subtracting moves:',
            options: [
              { text: 'left', correct: true },
              { text: 'right', correct: false },
              { text: 'up', correct: false },
            ],
            explanation: 'Subtracting always moves left on the number line.',
          },
          {
            type: 'quiz',
            question: 'What happens first in: 3 + 5 × 2?',
            options: [
              { text: '3 + 5', correct: false },
              { text: '5 × 2', correct: true },
              { text: '3 × 2', correct: false },
            ],
            explanation: 'Multiplication before addition — BIDMAS.',
          },
          {
            type: 'quiz',
            question: 'Why should you estimate before using a calculator?',
            options: [
              { text: 'To make the answer exactly right', correct: false },
              { text: 'To check if the answer is sensible', correct: true },
              { text: 'Calculators don\'t need checking', correct: false },
            ],
            explanation: 'Estimation catches impossible answers — decimal errors, wrong operations, misread displays.',
          },
          { type: 'keypoint', text: '<strong>Module complete.</strong> You now have the survival tools: move on a number line · follow BIDMAS · estimate before trusting answers.' },
        ],
      },
    ],
  },

  // ── Maths Module 2 ────────────────────────────────────────────────────────
  {
    id: 'math2',
    subject: 'Maths',
    number: 2,
    title: 'Fraction Foundations',
    subtitle: 'Numerator, denominator, equivalent fractions',
    era: 'Foundation',
    icon: '🍕',
    color: '#4B90FF',
    colorLight: 'rgba(75,144,255,.12)',
    hook: {
      scenario: {
        location: 'Any maths lesson',
        hint: 'A student sees 1/10 on the paper. They think it\'s bigger than 1/2 because 10 > 2.',
      },
      statement: 'A bigger denominator means a bigger fraction.',
      isTrue: false,
      accentWords: ['bigger denominator', 'bigger fraction'],
      explanation: "A bigger denominator means more pieces — so each piece is smaller. 1/10 is much less than 1/2. Think of it as slicing a pizza into more slices.",
      wrongFeedback: 'Think about slicing a pizza — more slices means each slice gets smaller, not bigger.',
      correctFeedback: '1/2 is bigger than 1/10. The denominator tells you piece size, not fraction size.',
      loadingText: 'Let\'s see why the bottom number is about piece size…',
      bigQuestion: 'So what does the denominator actually tell us?',
      revealHeader: 'Bigger denominator = smaller pieces.',
      revealVisual: 'denominatorBars',
      revealItems: [
        {
          emoji: '🍕',
          label: 'Denominator = piece size',
          detail: '1/2 has 2 pieces — each is huge. 1/10 has 10 pieces — each is tiny. Bigger denominator means more cuts, not more pizza.',
          color: '#4B90FF',
          bg: 'rgba(75,144,255,.08)',
        },
        {
          emoji: '📐',
          label: 'More cuts = tinier pieces',
          detail: 'Cutting a pizza into 10 slices makes each slice smaller than cutting into 2. The total pizza hasn\'t changed.',
          color: '#4B90FF',
          bg: 'rgba(75,144,255,.08)',
        },
        {
          emoji: '⚠️',
          label: 'The common trap',
          detail: 'Students see 10 and think "bigger number = bigger fraction." That\'s the trap. 10 just means 10 tinier pieces.',
          color: '#FF6B6B',
          bg: 'rgba(255,107,107,.08)',
        },
      ],
      punchline: 'The denominator is the piece size. Bigger denominator = smaller pieces.',
    },
    intro: {
      learningGoals: [
        'Read any fraction using numerator and denominator',
        'Understand why bigger denominators mean smaller pieces',
        'See that different fractions can show the same amount',
        'Simplify fractions without changing their value',
      ],
    },
    outcomes: {
      intro: "Fractions trip up more GCSE students than almost anything else. After this chapter, they shouldn't.",
      bullets: [
        'Add, subtract, multiply and divide fractions without a calculator',
        'Convert between fractions, decimals and percentages confidently',
        'Spot equivalent fractions and simplify them without thinking twice',
        'Apply fraction skills to problem-solving and exam questions',
      ],
    },

    recall: {
      questions: [
        { type: 'truefalse', question: '½ and 4/8 are equal in value.', isTrue: true },
        { type: 'choice', question: 'To multiply two fractions, you...', options: ['Add numerators and add denominators', 'Multiply numerators and multiply denominators', 'Flip the second fraction then add'], correct: 1 },
        { type: 'connection', question: 'Simplifying fractions matters because...', options: [
          { text: 'Examiners only accept the simplest form', icon: 'warning' },
          { text: 'It\'s the same value but much easier to work with', icon: 'lightbulb' },
          { text: 'It makes multiplication easier to check', icon: 'gear' },
        ], correct: 1 },
      ],
    },
    screens: [
      // Page 2 — What You'll Learn
      {
        label: 'Overview',
        kicker: 'Module Overview',
        heading: 'Fractions are sharing.',
        sub: 'They tell you how many equal parts exist — and how many are selected.',
        blocks: [
          {
            type: 'read',
            label: '🧠 Why This Matters',
            text: 'Fractions unlock <strong>percentages</strong>, <strong>ratio</strong> and <strong>algebra</strong> later. Everything connects back to this.',
          },
          {
            type: 'flipcards',
            cards: [
              {
                icon: '🔢',
                front: 'Numerator vs denominator',
                back: 'Top = selected parts. Bottom = total equal parts.',
                color: '#4B90FF',
              },
              {
                icon: '🔄',
                front: 'Equivalent fractions',
                back: 'Different fractions can show the same amount.',
                color: '#38D27A',
              },
              {
                icon: '✂️',
                front: 'Simplifying',
                back: 'Shrink the numbers without changing the amount.',
                color: '#F5B700',
              },
              {
                icon: '📏',
                front: 'Fraction size',
                back: 'Fractions are easier when you picture the pieces.',
                color: '#FF6B6B',
              },
            ],
          },
        ],
      },

      // Page 3 — Numerator & Denominator
      {
        label: 'The Parts',
        kicker: 'Core Skill 1',
        heading: 'The denominator splits. The numerator selects.',
        sub: 'Denominator first — it creates the equal pieces. Then numerator selects from them.',
        blocks: [
          {
            type: 'read',
            label: '🍫 Why This Matters',
            text: 'These words appear in <strong>every</strong> fraction question. Knowing them by sight saves time under pressure.',
          },
          {
            type: 'fracbar',
            fraction: { num: 3, den: 5 },
            quiz: {
              q: 'What does the denominator tell us?',
              options: ['selected parts', 'total equal parts', 'the biggest number'],
              correct: 1,
              explanation: 'The denominator tells us how many equal pieces the whole was split into.',
              hints: [
                'Look at the bottom number.',
                'The whole was split into this many pieces.',
                'The denominator shows total equal parts.',
              ],
            },
          },
        ],
      },

      // Page 4 — Fill In The Blanks
      {
        label: 'Rules',
        kicker: 'Active Recall',
        heading: 'Complete the fraction rules.',
        sub: 'Lock in the language before moving to visuals.',
        blocks: [
          {
            type: 'read',
            label: '🎯 Why This Matters',
            text: 'These words appear constantly in GCSE maths. <strong>Fluency with the terms</strong> stops you losing easy marks.',
          },
          {
            type: 'fillblanks',
            sentences: [
              {
                before: 'The denominator tells us the total',
                after: 'parts.',
                answer: 'equal',
                hints: [
                  'All pieces must be the same size.',
                  'The whole is split into parts of identical size.',
                ],
              },
              {
                before: 'The numerator tells us the',
                after: 'parts.',
                answer: 'selected',
                hints: [
                  'It counts how many pieces are chosen.',
                  'Think: how many pieces are shaded?',
                ],
              },
              {
                before: 'A bigger denominator means',
                after: 'pieces.',
                answer: 'smaller',
                hints: [
                  'Think about slicing a pizza into more parts.',
                  'More slices means each slice gets…',
                ],
              },
              {
                before: '1/2 is bigger than 1/10 because the pieces are',
                after: '.',
                answer: 'larger',
                hints: [
                  '1/2 has only 2 pieces — each must be big.',
                  'Which pizza slice would you rather have: half, or one-tenth?',
                ],
              },
            ],
            correctMsg: 'Nice. You\'re learning to picture the fraction, not memorise it.',
            wrongMsg: 'Think visually. More denominator pieces means each piece shrinks.',
          },
        ],
      },

      // Page 5 — Equivalent Fractions
      {
        label: 'Equivalent',
        kicker: 'Core Skill 2',
        heading: 'Same amount. Different fraction.',
        sub: 'Equivalent fractions look different but show the same amount.',
        blocks: [
          {
            type: 'read',
            label: '🔄 Why This Matters',
            text: 'Used before <strong>adding fractions</strong> and converting to <strong>percentages</strong>. This is the key idea behind both.',
          },
          {
            type: 'fractionsplitter',
            predictionPrompt: 'What do you think will happen if we split every piece again?',
            levels: [
              { num: 1, den: 2 },
              { num: 2, den: 4 },
              { num: 4, den: 8 },
            ],
            examTip: 'The denominator is the piece size. Changing it changes piece size, not the amount.',
          },
        ],
      },

      // Page 6 — Short Quiz
      {
        label: 'Quiz',
        kicker: 'Practice',
        heading: 'Test yourself.',
        sub: 'Three levels. Work through them in order.',
        blocks: [
          {
            type: 'read',
            label: '⚡ Why This Matters',
            text: 'Quick retrieval builds <strong>long-term memory</strong> faster than rereading.',
          },
          {
            type: 'tieredquiz',
            tiers: [
              {
                label: 'Warm Up', emoji: '🟢',
                questions: [
                  {
                    q: 'Which fraction is bigger?',
                    options: ['1/2', '1/8', 'They are equal'],
                    correct: 0,
                    feedback: 'Halves are larger pieces than eighths. 1/2 > 1/8.',
                    hint: 'Imagine cutting a pizza into 2 vs 8 slices. Which slice is bigger?',
                  },
                  {
                    q: 'What does denominator mean?',
                    options: ['selected parts', 'total equal parts', 'the biggest number'],
                    correct: 1,
                    feedback: 'Denominator = total equal parts the whole is split into.',
                    hint: 'It\'s the bottom number. It tells you how many pieces exist.',
                  },
                  {
                    q: 'Which fractions match?',
                    options: ['1/2 and 2/4', '1/2 and 1/4', '1/3 and 3/4'],
                    correct: 0,
                    feedback: '1/2 = 2/4. Both show the same amount — just split differently.',
                    hint: 'Think: which pair would shade the same amount on a fraction bar?',
                  },
                ],
              },
              {
                label: 'Challenge', emoji: '🟡',
                questions: [
                  {
                    q: 'Simplify: 6/8',
                    options: ['3/4', '6/4', '2/4'],
                    correct: 0,
                    feedback: '6÷2 = 3 and 8÷2 = 4. Divide both by 2 → 3/4.',
                    hint: 'What number divides into both 6 and 8?',
                  },
                  {
                    q: 'Which are equivalent?',
                    options: ['3/5 and 6/10', '3/5 and 3/10', '3/5 and 5/3'],
                    correct: 0,
                    feedback: '3×2=6 and 5×2=10. Both multiplied by 2 → 6/10 = 3/5.',
                    hint: 'Try multiplying numerator and denominator of 3/5 by 2.',
                  },
                  {
                    q: 'What happens when the denominator gets bigger?',
                    options: ['Pieces get smaller', 'Pieces get bigger', 'The fraction gets bigger'],
                    correct: 0,
                    feedback: 'More equal parts = each part is smaller. The whole hasn\'t changed.',
                    hint: 'Think about cutting something into more and more slices.',
                  },
                ],
              },
              {
                label: 'Boss Mode', emoji: '🔴',
                questions: [
                  {
                    q: 'Why does 1/2 = 2/4?',
                    options: [
                      'The pieces were split again but the amount stayed the same',
                      'Both numbers doubled so the fraction doubled',
                      'The denominator is bigger so it must be bigger',
                    ],
                    correct: 0,
                    feedback: 'Splitting pieces without changing the amount — that\'s the whole idea of equivalent fractions.',
                    hint: 'Picture a bar. Split each piece in half. Same shaded amount?',
                  },
                  {
                    q: 'Spot the mistake: 6/8 → 6/4',
                    options: [
                      'Only the denominator changed — both must divide by same number',
                      'The denominator should stay the same',
                      'You should multiply, not divide',
                    ],
                    correct: 0,
                    feedback: 'Simplifying means dividing BOTH numerator and denominator by the same number. Changing only one changes the value.',
                    hint: 'What happened to the numerator (6)? Did it change?',
                  },
                  {
                    q: 'Which is larger: 3/4 or 5/8?',
                    options: ['3/4', '5/8', 'They are equal'],
                    correct: 0,
                    feedback: '3/4 = 6/8. Compare: 6/8 > 5/8. So 3/4 is larger.',
                    hint: 'Convert 3/4 so both fractions have the same denominator.',
                  },
                ],
              },
            ],
          },
        ],
      },

      // Page 7 — True/False Checkpoint
      {
        label: 'Checkpoint',
        kicker: 'Checkpoint',
        heading: 'True or False?',
        sub: 'Catch fraction logic errors before the exam does.',
        blocks: [
          {
            type: 'read',
            label: '🚨 Why This Matters',
            text: 'Used to catch <strong>impossible fraction logic</strong> — the kind that loses marks silently.',
          },
          {
            type: 'tfcheckpoint',
            statement: '6/8 = 6/4',
            isTrue: false,
            revealHeader: 'Only the denominator changed.',
            revealSub: 'That changes the piece size AND the amount. Both numbers must change together.',
            breakdown: [
              '6/8 = 0.75 (three quarters of the whole)',
              '6/4 = 1.5 (one and a half — bigger than the whole!)',
              'Changing only the denominator changes the value entirely.',
            ],
            wrongDisplay: '6/4 = 1.5 ✗',
            rightDisplay: '6/8 = 3/4 ✓',
          },
        ],
      },

      // Page 8 — Fraction Builder Lab
      {
        label: 'Lab',
        kicker: 'Apply',
        heading: 'Build the same amount.',
        sub: 'Use the multiplier to create equivalent fractions.',
        blocks: [
          {
            type: 'read',
            label: '🧩 Why This Matters',
            text: 'This builds <strong>real fraction understanding</strong>, not memorised steps. You\'ll use this in simplifying and adding fractions.',
          },
          {
            type: 'fractionlab',
            tasks: [
              {
                label: 'Turn 1/2 into 2/4',
                from: { num: 1, den: 2 },
                to: { num: 2, den: 4 },
              },
              {
                label: 'Turn 2/3 into 4/6',
                from: { num: 2, den: 3 },
                to: { num: 4, den: 6 },
              },
              {
                label: 'Make a fraction equal to 1/2 using ×3',
                from: { num: 1, den: 2 },
                to: { num: 3, den: 6 },
              },
            ],
            hints: [
              'Multiply both the top AND bottom by the same number.',
              'The whole amount must stay identical — only the piece size changes.',
              'If ×2 doesn\'t work, try ×3 or ×4.',
            ],
          },
        ],
      },

      // Page 9 — Exam Practice
      {
        label: 'Exam',
        kicker: 'Exam Practice',
        heading: 'Exam Practice.',
        sub: 'Method matters as much as the answer.',
        blocks: [
          {
            type: 'read',
            label: '📝 Why This Matters',
            text: 'Used to turn understanding into <strong>GCSE marks</strong>. Knowing the method is what examiners reward.',
          },
          {
            type: 'examscored',
            questions: [
              {
                q: 'Simplify: 8/12',
                marks: 2,
                options: ['2/3', '4/6', '4/12', '8/6'],
                correct: 0,
                feedback: {
                  0: '✓ Both divided by 4 (the HCF). That\'s full simplification. (2 marks)',
                  1: 'You simplified partly — 4/6 still divides by 2. Try again: 4÷2=2, 6÷2=3 → 2/3. (1 mark)',
                  2: 'Only the denominator changed — both must divide by the same number.',
                  3: 'The denominator should get smaller when simplifying, not larger.',
                },
                modelAnswer: 'Find HCF of 8 and 12 (= 4). Divide both: 8÷4 = 2, 12÷4 = 3 → answer: 2/3',
              },
              {
                q: 'Which fraction is equivalent to 3/5?',
                marks: 1,
                options: ['6/10', '3/10', '5/3', '6/5'],
                correct: 0,
                feedback: {
                  0: '✓ 3×2=6 and 5×2=10. Same multiplier applied to both. (1 mark)',
                  1: 'Only the denominator was multiplied by 2. Both must multiply by the same number.',
                  2: 'That\'s the fraction flipped upside down — a completely different value.',
                  3: 'The numerator multiplied but the denominator didn\'t. Both must change together.',
                },
                modelAnswer: 'Multiply both by 2: 3×2/5×2 = 6/10. Check: 3/5 = 0.6 and 6/10 = 0.6 ✓',
              },
              {
                q: 'Explain why 1/2 = 2/4.',
                marks: 2,
                options: [
                  'The pieces were split again and the amount stayed the same',
                  'The numbers doubled so the fraction doubled',
                  'The denominator is bigger so it must be bigger',
                  'We added 1 to the top and 2 to the bottom',
                ],
                correct: 0,
                feedback: {
                  0: '✓ Splitting pieces without changing the amount — that\'s equivalent fractions. (2 marks)',
                  1: 'Both numbers doubled but the VALUE stayed the same — because the pieces were split too.',
                  2: 'Bigger denominator means smaller pieces, not bigger fraction.',
                  3: 'Adding different numbers to top and bottom changes the value — that\'s not simplifying or equivalence.',
                },
                modelAnswer: 'Both numerator and denominator were multiplied by 2. Each piece halved in size, but twice as many were selected — the shaded amount stays the same.',
              },
            ],
            examTip: 'Shrink the numbers, not the value. Simplifying changes the fraction label, not the amount.',
          },
        ],
      },

      // Page 10 — Final Rewind
      {
        label: 'Rewind',
        kicker: 'Retrieval',
        heading: 'Final Rewind.',
        sub: 'Strong maths comes from retrieval, not rereading.',
        blocks: [
          {
            type: 'read',
            label: '🔁 Why This Matters',
            text: 'Retrieval practice <strong>builds long-term memory</strong> faster than rereading notes.',
          },
          {
            type: 'quiz',
            question: 'What does denominator mean?',
            options: [
              { text: 'selected parts', correct: false },
              { text: 'total equal parts', correct: true },
              { text: 'the bottom number only', correct: false },
            ],
            explanation: 'Denominator = total equal parts the whole is split into. It defines the piece size.',
          },
          {
            type: 'quiz',
            question: 'Why are 1/2 and 2/4 equal?',
            options: [
              { text: 'Same amount, smaller pieces', correct: true },
              { text: 'The numbers doubled so the fraction doubled', correct: false },
              { text: 'Both have even numbers', correct: false },
            ],
            explanation: 'The pieces were halved in size but there are twice as many selected — the amount is identical.',
          },
          {
            type: 'quiz',
            question: 'What happens when the denominator gets bigger?',
            options: [
              { text: 'Pieces get smaller', correct: true },
              { text: 'Pieces get bigger', correct: false },
              { text: 'The fraction gets bigger', correct: false },
            ],
            explanation: 'More equal parts means each part must be smaller. The whole hasn\'t changed.',
          },
          {
            type: 'quiz',
            question: 'When simplifying a fraction, what changes?',
            options: [
              { text: 'Numbers change, amount stays same', correct: true },
              { text: 'Amount changes, numbers stay same', correct: false },
              { text: 'Both the numbers and amount change', correct: false },
            ],
            explanation: 'Simplifying changes the labels (numbers) but not the value. 6/8 and 3/4 are the same amount.',
          },
          {
            type: 'keypoint',
            text: '<strong>Module complete.</strong> You now understand: numerator vs denominator · equivalent fractions · simplifying · fraction size visually.',
          },
        ],
      },
    ],
  },
]

// ─── Sociology module content — full lesson data for Sociology modules ───────────
// Loaded on demand (dynamic import) by App.jsx when a Sociology module is opened.
// Metadata for browsing/cards lives in src/modules.js — keep that file's entries
// (id, subject, number, title, subtitle, era, icon, color, colorLight, headerImage,
// screenCount, screenTags) in sync if you add/remove a module here.

export const SOCIOLOGY_MODULES = [
  // ── Sociology Module 1 ────────────────────────────────────────────────────
  {
    id: 'soc1',
    subject: 'Sociology',
    number: 1,
    title: 'What Even is Sociology?',
    subtitle: 'Culture, norms, values and socialisation',
    era: 'AQA GCSE',
    icon: '👥',
    color: '#D96030',
    colorLight: 'rgba(217,96,48,.12)',
    hook: {
      atmosphericOpener: {
        bgImage: '/images/soc1-rules.png',
        heading: 'YOU ARE SURROUNDED BY RULES.',
        sub: 'Most of them are invisible.',
        cta: 'START INVESTIGATING',
      },
      scenario: {
        location: 'Any classroom',
        hint: 'A child raised completely alone from birth. No family. No school. No contact with anyone.',
      },
      statement: 'If a baby grew up completely alone, they would naturally know how to behave in society.',
      isTrue: false,
      accentWords: ['completely alone', 'naturally know'],
      explanation: "Feral children raised without socialisation have no language, no social norms, no sense of self. Everything we assume is 'natural' is actually learned.",
      wrongFeedback: 'Think about it — where do we actually learn how to shake hands, queue, say please, go to school?',
      correctFeedback: 'Correct. Humans are not born understanding society. We learn behaviour from other people.',
      loadingText: 'Sociology studies exactly how this learning happens…',
      bigQuestion: 'So how DO humans learn to behave in society?',
      revealHeader: 'Humans are shaped by society.',
      revealItems: [
        {
          emoji: '🧠',
          label: 'We are not born socialised',
          detail: 'A child raised without social contact would not know how to speak, queue, shake hands or behave in school.',
          color: '#D96030',
          bg: 'rgba(217,96,48,.08)',
        },
        {
          emoji: '👨‍👩‍👧',
          label: 'We learn from other people',
          detail: 'Family, school, friends and media all teach us the rules of society — usually without us even noticing.',
          color: '#D96030',
          bg: 'rgba(217,96,48,.08)',
        },
        {
          emoji: '🔍',
          label: 'Sociology studies this process',
          detail: 'Sociology looks for patterns in human behaviour. Why do people in different societies behave differently? What invisible rules govern us?',
          color: '#D96030',
          bg: 'rgba(217,96,48,.08)',
        },
      ],
      punchline: 'Humans are shaped by society. Sociology studies how and why.',
    },
    intro: {
      learningGoals: [
        'Define sociology, culture, norms and values',
        'Explain socialisation and its agencies',
        'Distinguish primary from secondary socialisation',
        'Identify and apply sanctions to real scenarios',
      ],
    },
    outcomes: {
      intro: 'Sociology asks a question most people never think to ask: why are we the way we are? This chapter gives you the tools to start answering it.',
      bullets: [
        'Explain the difference between nature and nurture in shaping who we are',
        "Describe what socialisation means — and why it's more powerful than most people realise",
        "See how culture, norms and values shape everything we think is 'normal'",
        'Understand why sociologists treat society itself as something worth questioning',
      ],
    },

    recall: {
      questions: [
        { type: 'truefalse', question: 'Children raised without socialisation still learn language naturally.', isTrue: false },
        { type: 'choice', question: 'Norms are best described as...', options: ['Laws enforced by the government', 'Shared unwritten rules about expected behaviour', 'Personal values people choose for themselves'], correct: 1 },
        { type: 'connection', question: 'Sociology argues our identities are mainly shaped by...', options: [
          { text: 'Genetics and biological instincts', icon: 'dna' },
          { text: 'Society, culture and the process of socialisation', icon: 'people' },
          { text: 'Entirely free individual choice', icon: 'arrow' },
        ], correct: 1 },
      ],
    },
    screens: [
      // Screen 1 — What Is Sociology?
      {
        label: 'What is Sociology?',
        kicker: 'Core Concept',
        heading: 'Sociology studies human behaviour in society.',
        sub: 'Sociologists look for patterns — why do people behave the way they do?',
        blocks: [
          {
            type: 'read',
            label: '🔍 Why This Matters',
            text: 'Every other topic in GCSE Sociology builds on this. <strong>Humans are shaped by society</strong> — sociology asks how.',
          },
          {
            type: 'topicpicker',
            question: 'Which topics would interest a sociologist? Tap all that apply.',
            items: [
              { label: 'Crime rates', correct: true },
              { label: 'Gender behaviour', correct: true },
              { label: 'School achievement', correct: true },
              { label: 'Volcanoes', correct: false },
              { label: 'Friendship groups', correct: true },
              { label: 'Weather systems', correct: false },
              { label: 'Social media trends', correct: true },
              { label: 'Tectonic plates', correct: false },
            ],
            explanation: 'Sociology focuses on people, behaviour and society. Natural phenomena like volcanoes and weather are studied by scientists, not sociologists.',
          },
        ],
      },

      // Screen 2 — Culture
      {
        label: 'Culture',
        kicker: 'Key Term',
        heading: 'Culture is a society\'s way of life.',
        sub: 'Different societies have different cultures. There is no single "normal."',
        blocks: [
          {
            type: 'read',
            label: '🌍 Why This Matters',
            text: 'Culture appears in almost every GCSE Sociology topic. You need to <strong>identify examples instantly</strong>.',
          },
          {
            type: 'flipcards',
            cards: [
              {
                icon: '🍜',
                front: 'Food customs',
                back: 'In Japan, slurping noodles shows appreciation. In the UK, it\'s considered rude. Same action — different cultural meaning.',
                color: '#D96030',
              },
              {
                icon: '🙏',
                front: 'Religious rituals',
                back: 'Prayer, worship, fasting, celebrations — all vary between cultures. Each reflects a society\'s shared beliefs.',
                color: '#D96030',
              },
              {
                icon: '👗',
                front: 'Clothing and dress',
                back: 'From school uniforms to traditional dress — what you wear signals your culture, group and identity.',
                color: '#D96030',
              },
              {
                icon: '💬',
                front: 'Language and communication',
                back: 'Even within English: slang, dialect, formality levels all vary. Language carries cultural identity.',
                color: '#D96030',
              },
            ],
          },
          {
            type: 'keypoint',
            text: '📌 <strong>Exam Master</strong>: If asked to "identify one example of culture" — give ONE clear example only. Do not over-explain.',
          },
        ],
      },

      // Screen 3 — Norms vs Values
      {
        label: 'Norms & Values',
        kicker: 'Key Terms',
        heading: 'Norms are rules. Values are beliefs.',
        sub: 'Students often confuse these. The difference is critical for AQA questions.',
        blocks: [
          {
            type: 'comic',
            panels: [
              {
                image: '/images/comic-soc1-norms.png',
                takeaway: 'Norms are unwritten rules — invisible, yet powerful. Break one and people notice immediately.',
              },
            ],
          },
          {
            type: 'read',
            label: '🎯 Why This Matters',
            text: '<strong>Norms</strong> and <strong>values</strong> appear in nearly every sociology question. Mix them up and you lose marks.',
          },
          {
            type: 'colsort',
            question: 'Sort each into the correct column.',
            columns: [
              { label: 'VALUES\nWhat society believes is important', color: '#4B90FF', bg: 'rgba(75,144,255,.07)' },
              { label: 'NORMS\nExpected behaviour', color: '#D96030', bg: 'rgba(217,96,48,.07)' },
            ],
            items: [
              { label: 'Honesty', col: 0, explanation: 'Honesty is a VALUE — society believes it is morally important.' },
              { label: 'Saying thank you', col: 1, explanation: 'Saying thank you is a NORM — it is expected behaviour in social situations.' },
              { label: 'Hard work', col: 0, explanation: 'Hard work is a VALUE — it is widely held as something society believes matters.' },
              { label: 'Queuing', col: 1, explanation: 'Queuing is a NORM — it is an unwritten rule of expected behaviour in the UK.' },
              { label: 'Respecting elders', col: 0, explanation: 'Respecting elders is a VALUE — it reflects a moral belief about how to treat people.' },
              { label: 'Removing hats indoors', col: 1, explanation: 'Removing hats indoors is a NORM — a behavioural expectation in certain contexts.' },
            ],
            explanation: 'Values = what society believes is right. Norms = how people are expected to behave. Remember: beliefs vs behaviour.',
          },
          {
            type: 'keypoint',
            text: '🧠 <strong>Memory anchor:</strong> Values are beliefs. Norms are rules. "Society <em>believes</em> in honesty" — that\'s a value. "People <em>are expected</em> to queue" — that\'s a norm.',
          },
        ],
      },

      // Screen 4 — Fill in the Blanks
      {
        label: 'Key Terms',
        kicker: 'Active Recall',
        heading: 'Lock in the language.',
        sub: 'Sociology marks depend on using the right words precisely.',
        blocks: [
          {
            type: 'read',
            label: '🎯 Why This Matters',
            text: 'These exact terms appear in <strong>every AQA Sociology paper</strong>. Getting them wrong loses you marks even when you understand the concept.',
          },
          {
            type: 'fillblanks',
            sentences: [
              {
                before: 'Sociology studies human',
                after: 'in society.',
                answer: 'behaviour',
                hints: ['It\'s what people do — their actions and actions.', 'Sociologists look for patterns in how people act.'],
              },
              {
                before: 'Sociologists look for',
                after: 'in behaviour.',
                answer: 'patterns',
                hints: ['They don\'t study one person — they look for trends across groups.', 'Repeated trends across society.'],
              },
              {
                before: 'Culture is a society\'s',
                after: 'of life.',
                answer: 'way',
                hints: ['The full phrase is "a society\'s ___ of life."', 'Think: lifestyle, customs, traditions — summed up in one word.'],
              },
              {
                before: 'Norms are the',
                after: 'rules of society.',
                answer: 'unwritten',
                hints: ['They\'re not laws — nobody wrote them down officially.', 'Invisible, informal, expected.'],
              },
            ],
            correctMsg: 'Good. These terms will appear repeatedly throughout your exam.',
            wrongMsg: 'Think about what the term actually means — then find the word that fits.',
          },
        ],
      },

      // Screen 5 — Invisible Rules / Sanctions
      {
        label: 'Invisible Rules',
        kicker: 'Norms + Deviance',
        heading: 'Breaking the invisible rules.',
        sub: 'Most social rules are never written down — but breaking them has real consequences.',
        blocks: [
          {
            type: 'read',
            label: '🚨 Why This Matters',
            text: 'Understanding <strong>norms</strong> and <strong>sanctions</strong> is essential for explaining social control in your exam answers.',
          },
          {
            type: 'colsort',
            question: 'Is this illegal, or does it just break social norms?',
            columns: [
              { label: 'ILLEGAL\nBreaks the law', color: '#FF5D73', bg: 'rgba(255,93,115,.07)' },
              { label: 'BREAKS NORMS\nSocially unacceptable', color: '#D96030', bg: 'rgba(217,96,48,.07)' },
            ],
            items: [
              { label: 'Staring at someone in a lift', col: 1, explanation: 'Staring in a lift breaks a social norm — it\'s awkward and rude, but not against the law.' },
              { label: 'Pyjamas at a wedding', col: 1, explanation: 'Wearing pyjamas to a wedding breaks dress-code norms, but isn\'t illegal.' },
              { label: 'Shoplifting', col: 0, explanation: 'Shoplifting is illegal — it breaks the law and can result in arrest.' },
              { label: 'Queue jumping', col: 1, explanation: 'Queue jumping is socially unacceptable in the UK — it breaks the norm of fair waiting.' },
              { label: 'Talking loudly in a cinema', col: 1, explanation: 'This breaks the norm of quiet respect during a film — very antisocial, but not illegal.' },
              { label: 'Assault', col: 0, explanation: 'Assault is a criminal offence — it breaks both legal and social rules.' },
            ],
            explanation: 'Norms are social rules — not laws. Breaking norms can still lead to negative sanctions (disapproval, exclusion) even without legal consequences.',
          },
        ],
      },

      // Screen 6 — Sanctions
      {
        label: 'Sanctions',
        kicker: 'Key Term',
        heading: 'How society controls behaviour.',
        sub: 'Positive sanctions reward conformity. Negative sanctions punish deviance.',
        blocks: [
          {
            type: 'read',
            label: '⚖️ Why This Matters',
            text: 'Sanctions are how society enforces <strong>norms and values</strong>. AQA regularly asks for examples of both types.',
          },
          {
            type: 'colsort',
            question: 'Positive or negative sanction?',
            columns: [
              { label: 'POSITIVE SANCTIONS\nRewards for following norms', color: '#4DFF88', bg: 'rgba(77,255,136,.07)' },
              { label: 'NEGATIVE SANCTIONS\nPunishments for breaking norms', color: '#FF5D73', bg: 'rgba(255,93,115,.07)' },
            ],
            items: [
              { label: 'Detention', col: 1, explanation: 'Detention is a negative sanction — a formal punishment for breaking school rules.' },
              { label: 'Praise from teacher', col: 0, explanation: 'Praise is a positive sanction — a reward that reinforces good behaviour.' },
              { label: 'Promotion at work', col: 0, explanation: 'Promotion is a positive sanction — rewarding someone for following workplace norms.' },
              { label: 'Prison', col: 1, explanation: 'Prison is a formal negative sanction — the most serious legal punishment.' },
              { label: 'Applause', col: 0, explanation: 'Applause is an informal positive sanction — social approval for behaviour that meets expectations.' },
              { label: 'Fine', col: 1, explanation: 'A fine is a formal negative sanction — a financial penalty for breaking rules.' },
            ],
            explanation: 'Positive sanctions encourage behaviour. Negative sanctions discourage it. Both enforce the norms and values of society.',
          },
          {
            type: 'keypoint',
            text: '📌 <strong>Exam tip:</strong> Always say whether a sanction is formal (official, e.g. law) or informal (social, e.g. disapproval). This adds detail examiners reward.',
          },
        ],
      },

      // Screen 7 — Socialisation
      {
        label: 'Socialisation',
        kicker: 'Core Concept',
        heading: 'Socialisation: learning to belong.',
        sub: 'The process by which we learn society\'s norms and values.',
        blocks: [
          {
            type: 'read',
            label: '🧠 Why This Matters',
            text: 'Socialisation is one of the most frequently tested concepts in AQA Sociology. <strong>Every agency, norm and value links back to it.</strong>',
          },
          {
            type: 'keypoint',
            text: '🔑 <strong>Socialisation</strong> is the process through which individuals learn the norms, values and culture of their society. It begins at birth and continues throughout life.',
          },
          {
            type: 'tfcheckpoint',
            statement: 'Socialisation only happens during childhood.',
            isTrue: false,
            revealHeader: 'Socialisation is lifelong.',
            revealSub: 'While it is most intense in childhood, socialisation continues throughout life — at work, in relationships, through media.',
            breakdown: [
              'Primary socialisation: early childhood, mainly through family',
              'Secondary socialisation: continues throughout life via school, peers, media, religion, work',
              'Even adults are socialised into new roles (e.g. becoming a parent or starting a job)',
            ],
          },
        ],
      },

      // Screen 8 — Primary vs Secondary
      {
        label: 'Primary vs Secondary',
        kicker: 'AQA Favourite',
        heading: 'Two phases. Same process.',
        sub: 'AQA regularly asks students to distinguish these — make the difference automatic.',
        blocks: [
          {
            type: 'read',
            label: '📋 Why This Matters',
            text: 'The distinction between primary and secondary socialisation is tested <strong>almost every year</strong> at GCSE. Get it automatic.',
          },
          {
            type: 'colsort',
            question: 'Primary or secondary socialisation?',
            columns: [
              { label: 'PRIMARY\nEarly childhood — mainly family', color: '#F5B700', bg: 'rgba(245,183,0,.07)' },
              { label: 'SECONDARY\nLater — wider society', color: '#D96030', bg: 'rgba(217,96,48,.07)' },
            ],
            items: [
              { label: 'Parents teaching manners', col: 0, explanation: 'Teaching manners is primary socialisation — done by family in early childhood.' },
              { label: 'TikTok trends', col: 1, explanation: 'TikTok is media — a key agency of secondary socialisation.' },
              { label: 'Learning language at home', col: 0, explanation: 'Language acquisition in the home is classic primary socialisation.' },
              { label: 'School rules', col: 1, explanation: 'School is an agency of secondary socialisation — it operates outside the family.' },
              { label: 'Friendship group pressure', col: 1, explanation: 'Peers are a secondary socialisation agency — they influence behaviour beyond the family.' },
              { label: 'Parents reading bedtime stories', col: 0, explanation: 'Family activities in early childhood = primary socialisation.' },
              { label: 'Workplace behaviour', col: 1, explanation: 'Learning workplace norms as an adult is secondary socialisation.' },
            ],
            explanation: 'Primary = early + family. Secondary = later + wider society (school, peers, media, religion, work). This contrast is the key AQA distinction.',
          },
          {
            type: 'keypoint',
            text: '🎯 <strong>Exam structure:</strong> "Primary socialisation happens in early childhood, usually through the family. Secondary socialisation occurs later and is influenced by wider society, such as school, peers and media."',
          },
        ],
      },

      // Screen 9 — Agencies of Socialisation
      {
        label: 'Agencies',
        kicker: 'Core Concept',
        heading: 'Who shapes us?',
        sub: 'Agencies of socialisation are the groups and institutions that teach us norms and values.',
        blocks: [
          {
            type: 'read',
            label: '👥 Why This Matters',
            text: 'AQA asks you to name, describe and apply agencies of socialisation. <strong>Every agency here has appeared on past papers.</strong>',
          },
          {
            type: 'agencywheel',
            agencies: [
              {
                icon: '👨‍👩‍👧',
                label: 'Family',
                reveals: [
                  'First and most powerful agency of socialisation',
                  'Teaches language, manners, values and basic norms',
                  'Primary socialisation — shapes identity from birth',
                ],
                examNote: 'Family = primary socialisation. Always the starting point.',
              },
              {
                icon: '🏫',
                label: 'School',
                reveals: [
                  'Teaches formal rules, academic expectations and social skills',
                  'Hidden curriculum: punctuality, conformity, respect for authority',
                  'Key agency of secondary socialisation',
                ],
                examNote: 'School = secondary socialisation + hidden curriculum.',
              },
              {
                icon: '👫',
                label: 'Peers',
                reveals: [
                  'Friendship groups become influential in adolescence',
                  'Peer pressure shapes fashion, language, behaviour and values',
                  'Can reinforce or challenge family norms',
                ],
                examNote: 'Peers = powerful secondary agency, especially for teenagers.',
              },
              {
                icon: '📱',
                label: 'Media',
                reveals: [
                  'TV, social media, music and advertising all shape norms',
                  'Creates beauty standards, gender expectations, trends',
                  'Increasingly dominant secondary socialisation agent',
                ],
                examNote: 'Media = secondary; always include examples (social media, TV, advertising).',
              },
              {
                icon: '🕌',
                label: 'Religion',
                reveals: [
                  'Teaches moral values, community norms and identity',
                  'Varies in influence depending on family religiosity',
                  'Can reinforce traditional gender roles and moral codes',
                ],
                examNote: 'Religion = secondary agent; most powerful when embedded in family life.',
              },
            ],
          },
        ],
      },

      // Screen 10 — Applied Sociology
      {
        label: 'Apply It',
        kicker: 'Application',
        heading: 'Spot the sociology.',
        sub: 'Apply your knowledge to real-world scenarios — exactly what AQA expects.',
        blocks: [
          {
            type: 'read',
            label: '🔬 Why This Matters',
            text: 'GCSE Sociology requires <strong>application</strong> — connecting concepts to real situations. This is where marks are won or lost.',
          },
          {
            type: 'appliedscenario',
            scenarios: [
              {
                scenario: 'Jake has started swearing because his friendship group think it\'s funny and impressive. His parents are shocked — he never used to do this at home.',
                question: 'Which agency of socialisation is influencing Jake\'s behaviour?',
                options: [
                  'Family',
                  'Peer group',
                  'Media',
                  'Religion',
                ],
                correct: 1,
                feedback: 'Correct. Jake\'s peer group is socialising his behaviour. Friends are an agency of secondary socialisation — they influence language, norms and values, especially in adolescence.',
                followUp: {
                  q: 'How does this show the difference between primary and secondary socialisation?',
                  answer: 'Jake\'s family (primary socialisation) taught him different norms. His peer group (secondary socialisation) is now contradicting those — showing that secondary agencies can challenge or override primary ones.',
                },
              },
              {
                scenario: 'Aisha receives a school award in assembly for working hard all term. Her classmates applaud and her teacher praises her publicly.',
                question: 'What type of sanction is Aisha receiving?',
                options: [
                  'Formal negative sanction',
                  'Informal negative sanction',
                  'Formal positive sanction',
                  'Informal positive sanction',
                ],
                correct: 2,
                feedback: 'The school award is a formal positive sanction — it\'s an official recognition (formal) that rewards behaviour following norms (positive). The applause is also informal positive reinforcement.',
                followUp: {
                  q: 'How does this sanction reinforce norms and values?',
                  answer: 'The sanction rewards Aisha for following the school\'s norm of hard work, which also reflects the wider social value placed on academic effort. This encourages other students to conform to the same expectations.',
                },
              },
              {
                scenario: 'In a traditional community, women are expected to dress modestly and take primary responsibility for childcare. Young women who deviate from this face disapproval from family and community members.',
                question: 'Which sociological concepts best explain what is happening here?',
                options: [
                  'Primary socialisation and formal sanctions',
                  'Culture, norms and negative sanctions',
                  'Secondary socialisation and positive sanctions',
                  'Values and formal sanctions',
                ],
                correct: 1,
                feedback: 'The community has its own culture with specific norms around gender behaviour. Women who deviate face informal negative sanctions (disapproval, exclusion). This shows how culture and norms are enforced through social control.',
                followUp: {
                  q: 'A sociologist would say behaviour here is socially constructed. What does this mean?',
                  answer: 'Socially constructed means the behaviour (women\'s roles) is not natural or inevitable — it has been created and maintained by society\'s norms and values over time. Different societies have very different norms about gender.',
                },
              },
            ],
          },
        ],
      },

      // Screen 11 — Exam Practice
      {
        label: 'Exam Practice',
        kicker: 'Exam Practice',
        heading: 'Exam Practice.',
        sub: 'Method and terminology matter as much as the answer.',
        blocks: [
          {
            type: 'read',
            label: '📝 Why This Matters',
            text: 'AQA rewards <strong>sociology terminology</strong>, <strong>clear examples</strong> and <strong>precise explanation</strong>. Generic answers lose marks.',
          },
          {
            type: 'examscored',
            questions: [
              {
                q: 'Identify one agency of secondary socialisation.',
                marks: 1,
                options: ['School', 'Family', 'Birth hospital', 'Genetics'],
                correct: 0,
                feedback: {
                  0: '✓ School is a key agency of secondary socialisation. (1 mark)',
                  1: 'Family is primary socialisation, not secondary. Secondary agencies operate outside the family.',
                  2: 'A birth hospital is not an agency of socialisation.',
                  3: 'Genetics are biological, not social. Sociology focuses on social influences.',
                },
                modelAnswer: 'School is an agency of secondary socialisation. (Media, peers or religion would also be accepted.)',
              },
              {
                q: 'Which statement best describes a social norm?',
                marks: 1,
                options: [
                  'A society\'s moral belief about what is important',
                  'An expected way of behaving in society',
                  'A legal rule enforced by the government',
                  'A personal preference about how to act',
                ],
                correct: 1,
                feedback: {
                  0: 'That\'s a value — what society believes is morally important. Norms are about behaviour, not beliefs.',
                  1: '✓ A norm is an expected way of behaving. It\'s a social rule, not necessarily a legal one. (1 mark)',
                  2: 'That\'s a law. Norms are social rules — breaking them leads to social sanctions, not necessarily legal ones.',
                  3: 'Personal preferences are not norms. Norms are shared social expectations, not individual choices.',
                },
                modelAnswer: 'A norm is an expected way of behaving in society — an unwritten social rule, such as queuing or saying thank you.',
              },
              {
                q: 'Describe one way schools socialise children. [2 marks]',
                marks: 2,
                options: [
                  'Schools teach children rules through rewards and punishments, reinforcing norms like punctuality and respect for authority.',
                  'Schools teach children reading and writing.',
                  'Schools are buildings where children go during the day.',
                  'Children learn from their parents before they go to school.',
                ],
                correct: 0,
                feedback: {
                  0: '✓ Identifies the mechanism (rules/sanctions), gives examples (punctuality, authority) and links to socialisation. (2 marks)',
                  1: 'This describes teaching, not socialisation. You need to explain how school teaches norms and values, not just academic skills.',
                  2: 'This is a description, not a sociological explanation. No sociology terminology used.',
                  3: 'This describes family (primary) socialisation, not school. Answer the question about school.',
                },
                modelAnswer: 'Schools socialise children by teaching them rules through sanctions — for example, detention for lateness reinforces the norm of punctuality. The hidden curriculum also teaches children to respect authority and conform to expectations.',
              },
            ],
            examTip: 'Always include: (1) the sociology term, (2) an example, (3) an explanation of how it works. This structure gets full marks.',
          },
        ],
      },

      // Screen 12 — Final Retrieval
      {
        label: 'Final Retrieval',
        kicker: 'Retrieval',
        heading: 'Final Retrieval Challenge.',
        sub: 'No topic headings. Mix everything. This is how real exams feel.',
        blocks: [
          {
            type: 'read',
            label: '🔁 Why This Matters',
            text: 'Mixing topics in retrieval is <strong>more effective</strong> than reviewing by subject. This is how AQA structures its papers.',
          },
          {
            type: 'tieredquiz',
            tiers: [
              {
                label: 'Definitions', emoji: '🟢',
                questions: [
                  {
                    q: 'What is socialisation?',
                    options: [
                      'The process of learning society\'s norms and values',
                      'Going out with friends',
                      'Teaching children to read',
                      'Following the law',
                    ],
                    correct: 0,
                    feedback: 'Socialisation is the process through which individuals learn the norms, values and culture of their society.',
                    hint: 'Think: how do we learn the invisible rules of society?',
                  },
                  {
                    q: 'Which of these is a positive sanction?',
                    options: ['Prison sentence', 'Detention', 'Public praise', 'A fine'],
                    correct: 2,
                    feedback: 'Praise is a positive sanction — a reward for conforming to norms.',
                    hint: 'Positive = reward. Which option rewards good behaviour?',
                  },
                  {
                    q: 'Peers are an agency of which type of socialisation?',
                    options: ['Primary', 'Secondary', 'Both equally', 'Neither'],
                    correct: 1,
                    feedback: 'Peers are a secondary socialisation agency — they influence behaviour outside the family environment.',
                    hint: 'Primary = family. Everything else is...',
                  },
                ],
              },
              {
                label: 'Application', emoji: '🟡',
                questions: [
                  {
                    q: 'A child learns table manners from their parents. Which concept does this illustrate?',
                    options: [
                      'Secondary socialisation through peers',
                      'Primary socialisation through family',
                      'Formal positive sanctions',
                      'Cultural deviance',
                    ],
                    correct: 1,
                    feedback: 'Table manners learned from parents = primary socialisation through the family.',
                    hint: 'Who is doing the teaching? What age/stage is this?',
                  },
                  {
                    q: '"Queuing is expected in the UK but not in all cultures." What sociological concept does this illustrate?',
                    options: [
                      'A formal sanction',
                      'A social value',
                      'A social norm',
                      'Primary socialisation',
                    ],
                    correct: 2,
                    feedback: 'Queuing is a norm — an expected behaviour. The fact it varies by culture shows norms are socially constructed.',
                    hint: 'Is it a belief (value) or a rule of behaviour (norm)?',
                  },
                  {
                    q: 'A student is suspended for fighting. Which sociological concept does this illustrate?',
                    options: [
                      'Positive informal sanction',
                      'Primary socialisation',
                      'Formal negative sanction',
                      'Cultural norm',
                    ],
                    correct: 2,
                    feedback: 'Suspension is a formal negative sanction — an official punishment for breaking school norms.',
                    hint: 'Is it reward or punishment? Is it official or informal?',
                  },
                ],
              },
              {
                label: 'Exam Assassin', emoji: '🔴',
                questions: [
                  {
                    q: 'Explain why sociologists argue that behaviour is socially constructed rather than natural.',
                    options: [
                      'Because different societies have different norms and values, showing behaviour is learned, not innate',
                      'Because humans are naturally good at following rules',
                      'Because laws are created by governments',
                      'Because babies are born knowing some behaviours instinctively',
                    ],
                    correct: 0,
                    feedback: 'Social construction means behaviour is shaped by society, not biology. Different cultures having different norms is the key evidence.',
                    hint: 'What does the existence of different cultures across the world tell us?',
                  },
                  {
                    q: 'Using sociological concepts, explain how the media acts as an agency of socialisation.',
                    options: [
                      'The media entertains people and keeps them informed about news',
                      'The media socialises people by transmitting norms, values and cultural expectations through content like advertising, TV and social media',
                      'The media is less important than family because it only reaches adults',
                      'The media teaches people academic skills',
                    ],
                    correct: 1,
                    feedback: 'Strong answer. The media transmits norms (e.g. beauty standards, gender roles) through its content — this is socialisation through a secondary agency.',
                    hint: 'How does what you watch/scroll shape what you think is normal?',
                  },
                ],
              },
            ],
          },
          {
            type: 'keypoint',
            text: '🎓 <strong>Module complete.</strong> You can now define sociology, culture, norms, values, socialisation and sanctions — and apply them to real scenarios. That\'s Module 1 of GCSE Sociology done.',
          },
        ],
      },
    ],
  },

  // ── Sociology Module 2 ────────────────────────────────────────────────────
  {
    id: 'soc2',
    subject: 'Sociology',
    number: 2,
    title: 'Marxism vs Functionalism',
    subtitle: 'Why does society work — conflict or cooperation?',
    era: 'AQA GCSE',
    icon: '⚔️',
    color: '#D96030',
    colorLight: 'rgba(217,96,48,.12)',
    hook: {
      atmosphericOpener: {
        heading: 'TWO SOCIOLOGISTS. ONE FACTORY. COMPLETELY DIFFERENT CONCLUSIONS.',
        sub: 'One sees a system built on exploitation. The other sees a system holding society together.',
        cta: 'FIND OUT WHO\'S RIGHT',
      },
      scenario: {
        location: 'A Victorian textile factory, 1848',
        hint: 'A factory owner earns £10,000 a year. The workers make £100. The factory could not run without the workers. But the workers could not eat without the factory.',
      },
      statement: 'Society is fair — hard work always leads to success.',
      isTrue: false,
      accentWords: ['hard work', 'always leads to success'],
      explanation: "Sociologists call this a myth. Your social class, gender, ethnicity and postcode predict your life chances far more reliably than effort alone.",
      wrongFeedback: 'Think about it: if hard work guaranteed success, why do some of the hardest workers earn the least?',
      correctFeedback: 'Exactly. Sociologists disagree strongly about this. Some say society is rigged. Others say it serves a purpose. Both views need explaining.',
      loadingText: 'Two theories. Two explanations. One question: why does society work?',
      bigQuestion: 'Is society fair — or does it just look that way?',
      revealHeader: 'Two sociologists. One question.',
      revealItems: [
        {
          emoji: '⚡',
          label: 'Karl Marx: society is based on conflict',
          detail: 'The rich exploit the poor. Capitalism benefits the powerful at the expense of the working class. This is not an accident — it is how the system was designed.',
          color: '#D96030',
          bg: 'rgba(217,96,48,.08)',
        },
        {
          emoji: '🏛️',
          label: 'Émile Durkheim: society is based on cooperation',
          detail: 'Different parts of society work together — like organs in a body. Institutions like school and family keep us united and stable.',
          color: '#D96030',
          bg: 'rgba(217,96,48,.08)',
        },
        {
          emoji: '❓',
          label: 'Both are answering the same question',
          detail: 'Why does society stay together? Your answer changes how you see school, family, poverty, crime and power. That is why this debate matters.',
          color: '#D96030',
          bg: 'rgba(217,96,48,.08)',
        },
      ],
      punchline: 'Marxism sees conflict. Functionalism sees cooperation. Both are trying to explain the same society.',
    },
    intro: {
      learningGoals: [
        'Explain the key ideas of Marxism and Functionalism',
        'Define capitalism, bourgeoisie, proletariat, social order and social cohesion',
        'Compare how each theory explains inequality and social institutions',
        'Apply both theories to real-world scenarios and AQA exam questions',
      ],
    },
    outcomes: {
      intro: 'Two sociologists walk into a factory. One sees cooperation. The other sees exploitation. This chapter explains why.',
      bullets: [
        'Explain what Marxists and Functionalists each believe society is for',
        'Describe the key ideas from Durkheim, Parsons, Marx and Engels',
        'See how these perspectives explain inequality in completely different ways',
        'Apply both lenses to real institutions like education and family',
      ],
    },

    recall: {
      questions: [
        { type: 'truefalse', question: 'Durkheim believed society was held together by shared values.', isTrue: true },
        { type: 'choice', question: 'Marxists believe social institutions mainly serve...', options: ['Everyone in society equally', 'The ruling class and their interests', 'Individual freedom and expression'], correct: 1 },
        { type: 'connection', question: 'Functionalism and Marxism disagree most about...', options: [
          { text: 'Whether education and family actually exist', icon: 'book' },
          { text: 'Whether society is built on cooperation or conflict', icon: 'people' },
          { text: 'The impact of technology on social change', icon: 'device' },
        ], correct: 1 },
      ],
    },
    screens: [

      // Screen 1 — Two Worlds
      {
        label: 'Two Worlds',
        kicker: 'Setting the Scene',
        heading: 'The same factory. Two completely different stories.',
        sub: 'Before we study the theories — feel the tension they were trying to explain.',
        blocks: [
          {
            type: 'read',
            label: '🏭 The Factory Owner',
            text: 'It is 1848. Thomas owns a textile mill in Manchester. He employs 200 workers, pays them £1 a week, and sells the cloth they make for enormous profit. He lives in a large house and sends his children to private school. He believes he deserves this. He took the risk. He built the business. He earned it.',
          },
          {
            type: 'read',
            label: '⚒️ The Worker',
            text: 'Sarah works 14 hours a day in Thomas\'s mill. She is paid just enough to survive — not enough to save. Her children work alongside her. She cannot afford schooling. She has no choice: there is no other employer. She believes if she works hard enough, one day things will be better.',
          },
          {
            type: 'keypoint',
            text: '❓ <strong>The question both Marx and Durkheim tried to answer:</strong> Is this situation inevitable? Is it fair? Is it necessary for society to function — or is it designed to keep the powerful in power?',
          },
        ],
      },

      // Screen 2 — True or False?
      {
        label: 'True or False?',
        kicker: 'Provocation',
        heading: 'Society is fair. Hard work leads to success.',
        sub: 'Tap your answer — then see what sociologists actually say.',
        blocks: [
          {
            type: 'tfcheckpoint',
            statement: 'Society is fair because hard work always leads to success.',
            isTrue: false,
            revealHeader: 'Sociologists strongly disagree.',
            revealSub: 'This is one of the biggest disputes in sociology. There is no simple answer — and that is exactly the point.',
            breakdown: [
              'Functionalists argue: society IS broadly fair. Meritocracy means talent and effort are rewarded.',
              'Marxists argue: society is NOT fair. Capitalism is designed to benefit the rich at the expense of workers.',
              'Both agree that inequality exists. They disagree about whether it is necessary or unjust.',
              'AQA expects you to explain BOTH views — not just give your personal opinion.',
            ],
          },
        ],
      },

      // Screen 3 — What You Will Learn
      {
        label: 'What You\'ll Learn',
        kicker: 'Module Roadmap',
        heading: 'Seven ideas. Two theories. One debate.',
        sub: 'These are the concepts you will master by the end of this module.',
        blocks: [
          {
            type: 'read',
            label: '🗺️ Your Learning Journey',
            text: 'This module teaches you to <strong>think like a sociologist</strong> — holding two opposing views in your head at the same time and using evidence to evaluate them. That skill alone is worth marks.',
          },
          {
            type: 'keypoint',
            text: '📚 <strong>Key concepts you will master:</strong><br/><br/>⚡ <strong>Marxism</strong> — conflict, exploitation, class struggle<br/>🏛️ <strong>Functionalism</strong> — social order, consensus, stability<br/>💰 <strong>Capitalism</strong> — the economic system both theorists studied<br/>👔 <strong>Bourgeoisie</strong> — the ruling class (factory owners, bosses)<br/>⚒️ <strong>Proletariat</strong> — the working class (employees, labourers)<br/>🤝 <strong>Social cohesion</strong> — what holds society together<br/>⚖️ <strong>Class conflict</strong> — the struggle between rich and poor',
          },
        ],
      },

      // Screen 4 — The Big Divide
      {
        label: 'The Big Divide',
        kicker: 'Marxism vs Functionalism',
        heading: 'Two theories. One society. Completely different conclusions.',
        sub: 'Sort each idea into the correct theory.',
        blocks: [
          {
            type: 'read',
            label: '⚔️ The Fundamental Split',
            text: '<strong>Marxism</strong> sees society as divided by class conflict — the rich exploit the poor, and social institutions (school, law, media) serve the interests of the powerful.<br/><br/><strong>Functionalism</strong> sees society as a system in which every part has a purpose — institutions create stability, shared values and social order that benefit everyone.',
          },
          {
            type: 'colsort',
            question: 'Sort each statement into the correct theory.',
            columns: [
              { label: 'MARXISM\nConflict and exploitation', color: '#FF5D73', bg: 'rgba(255,93,115,.07)' },
              { label: 'FUNCTIONALISM\nCooperation and order', color: '#4B90FF', bg: 'rgba(75,144,255,.07)' },
            ],
            items: [
              { label: 'Society is based on class conflict', col: 0, explanation: 'Marxism argues that class conflict — between bourgeoisie and proletariat — is the driving force of society.' },
              { label: 'Society is like a human body: all parts work together', col: 1, explanation: 'Functionalism uses the "organic analogy" — each institution (school, family, law) plays a role in keeping society healthy.' },
              { label: 'The ruling class controls the economy and the law', col: 0, explanation: 'Marx argued the bourgeoisie control not just the economy, but also the ideas, laws and institutions that justify their power.' },
              { label: 'Shared values hold society together', col: 1, explanation: 'Durkheim argued that social cohesion comes from a shared set of values — the "collective conscience" — that most people agree on.' },
              { label: 'Schools reinforce class inequality', col: 0, explanation: 'Marxists see education as a tool of the ruling class — teaching working-class children to accept their place and obey authority.' },
              { label: 'Schools prepare children for their role in society', col: 1, explanation: 'Functionalists argue schools serve society by transmitting values, developing skills and allocating people to appropriate occupational roles.' },
              { label: 'Capitalism exploits the working class', col: 0, explanation: 'Marx\'s central argument: capitalists profit by paying workers less than the value they produce — this is exploitation.' },
              { label: 'Inequality can be functional and necessary', col: 1, explanation: 'Functionalists (e.g. Davis and Moore) argue some inequality is needed to motivate talented people into the most important roles.' },
            ],
            explanation: 'The fundamental split: Marxism sees conflict and exploitation. Functionalism sees cooperation and necessity. Both are studying the same society — and reaching opposite conclusions.',
          },
        ],
      },

      // Screen 5 — Karl Marx
      {
        label: 'Karl Marx',
        kicker: 'Theorist',
        heading: 'Karl Marx (1818–1883)',
        headerImage: '/images/karl-marx.png',
        sub: 'The most influential and controversial thinker in sociology. You need to know his ideas precisely.',
        blocks: [
          {
            type: 'read',
            label: '📖 Who Was Marx?',
            text: 'Karl Marx was a German philosopher and economist writing in the 19th century. He watched the Industrial Revolution create enormous wealth — and enormous poverty — at the same time. He wanted to explain why. His answer: <strong>capitalism</strong> is a system designed to benefit the ruling class at the expense of workers. His ideas sparked revolutions. They still divide opinion today.',
          },
          {
            type: 'keypoint',
            text: '🔑 <strong>Marx\'s Three Core Ideas:</strong><br/><br/>💰 <strong>Capitalism</strong>: the economic system where businesses are privately owned and run for profit. Workers are paid wages; owners keep the profits.<br/><br/>👔 <strong>Bourgeoisie</strong>: the ruling class — the factory owners, landlords and capitalists who own the means of production.<br/><br/>⚒️ <strong>Proletariat</strong>: the working class — people who own nothing except their own labour, which they must sell to survive.',
          },
          {
            type: 'quiz',
            question: 'Marx called the factory owners and capitalists the "bourgeoisie." What makes them the ruling class?',
            options: [
              { text: 'They own the means of production — factories, land and capital', correct: true },
              { text: 'They are elected by the people to lead society', correct: false },
              { text: 'They work harder than anyone else in society', correct: false },
              { text: 'They have better education than the working class', correct: false },
            ],
            explanation: 'Bourgeoisie = ruling class because they OWN the means of production. Ownership gives them economic power — and from that flows political and social power too.',
          },
          {
            type: 'funfact',
            label: '💡 What Is "Exploitation"?',
            text: 'Marx argued that workers produce more value than they are paid for. If a worker earns £50 a day but produces goods worth £200, the extra £150 is <strong>surplus value</strong> — profit taken by the capitalist. Marx called this <strong>exploitation</strong>. It is not an accident or unfairness — it is how capitalism is designed to work.',
          },
        ],
      },

      // Screen 6 — Capitalism in Action
      {
        label: 'Capitalism in Action',
        kicker: 'Marx Applied',
        heading: 'Who really benefits from capitalism?',
        sub: 'Apply Marx\'s ideas to real scenarios. Think carefully — the answer is not always obvious.',
        blocks: [
          {
            type: 'read',
            label: '💰 The Logic of Profit',
            text: 'Under capitalism, the goal of business is <strong>profit</strong> — not worker welfare. Marx argued this creates a structural conflict: <strong>the interests of the bourgeoisie and the proletariat are always opposed.</strong> Higher wages = less profit. More profit = lower wages. One class always gains at the other\'s expense.',
          },
          {
            type: 'quiz',
            question: 'A factory cuts workers\' pay by 20% and increases the working day from 8 to 10 hours. The owner\'s profits double. Which Marxist concept best explains this?',
            options: [
              { text: 'Exploitation — workers produce more value than they are paid', correct: true },
              { text: 'Social cohesion — shared goals are holding the business together', correct: false },
              { text: 'Meritocracy — the owner earned more by working harder', correct: false },
              { text: 'Socialisation — workers are learning new norms', correct: false },
            ],
            explanation: 'This is exploitation: workers are producing more value but receiving less. The surplus goes to the owner as profit. This is Marx\'s core argument about how capitalism functions.',
          },
          {
            type: 'quiz',
            question: 'Marx said the proletariat suffer from "false consciousness." What does this mean?',
            options: [
              { text: 'Workers believe the system is fair, even though it exploits them', correct: true },
              { text: 'Workers are unaware that they are being watched by the government', correct: false },
              { text: 'Workers think they are working class when they are actually middle class', correct: false },
              { text: 'Workers dream about a communist revolution', correct: false },
            ],
            explanation: 'False consciousness: workers accept the capitalist system as natural and fair — even though it exploits them. They don\'t see their own exploitation. This is why, Marx argued, revolution hadn\'t already happened.',
          },
          {
            type: 'keypoint',
            text: '⚡ <strong>Marx\'s prediction:</strong> Eventually the proletariat would develop <strong>class consciousness</strong> — awareness of their shared exploitation. This would lead to revolution and the overthrow of capitalism.',
          },
        ],
      },

      // Screen 7 — Fill in the Blanks (REQUIRED)
      {
        label: 'Key Terms',
        kicker: 'Active Recall',
        heading: 'Lock in Marx\'s language.',
        sub: 'These exact words appear in AQA exam papers. Get them automatic.',
        blocks: [
          {
            type: 'read',
            label: '🎯 Why This Matters',
            text: 'AQA markers look for <strong>precise sociology terminology</strong>. "Rich people" is not the same as "bourgeoisie." Using the right word shows you understand the theory — and gains marks.',
          },
          {
            type: 'fillblanks',
            sentences: [
              {
                before: 'According to Marx, the',
                after: 'own the factories, land and capital.',
                answer: 'bourgeoisie',
                hints: ['The ruling class — starts with "b."', 'The French word Marx used for the factory-owning class.'],
              },
              {
                before: 'The working class who must sell their labour are called the',
                after: '.',
                answer: 'proletariat',
                hints: ['The opposite of bourgeoisie — starts with "p."', 'Workers who own nothing except their ability to work.'],
              },
              {
                before: 'Marx argued that capitalism is based on',
                after: '— paying workers less than the value they produce.',
                answer: 'exploitation',
                hints: ['The word for taking more than is fair.', 'Workers produce £200 of value but are paid £50 — the difference is...'],
              },
              {
                before: 'When workers do not recognise their own exploitation, Marx called this',
                after: '.',
                answer: 'false consciousness',
                hints: ['Two words. The second is "consciousness."', 'Workers believe the system is fair — but they are wrong. This is...'],
              },
              {
                before: 'Marx called the conflict between rich and poor',
                after: '.',
                answer: 'class conflict',
                hints: ['Two words. Both are very common in sociology.', 'The struggle between the bourgeoisie and the proletariat is called...'],
              },
            ],
            correctMsg: 'Good. These terms are the foundation of Marxist theory and will appear in your exam.',
            wrongMsg: 'Go back to the definitions — then try again with the exact term.',
          },
        ],
      },

      // Screen 8 — Class Conflict
      {
        label: 'Class Conflict',
        kicker: 'Marx Applied',
        heading: 'Who benefits? Sort these policies.',
        sub: 'Marx argued every social policy ultimately serves one class. Test that idea.',
        blocks: [
          {
            type: 'read',
            label: '⚔️ The Class Struggle',
            text: 'Marx said society is defined by the <strong>class struggle</strong> — a permanent conflict between the bourgeoisie (who want maximum profit) and the proletariat (who want fair pay and conditions). He argued that laws, schools, and media all serve the interests of the ruling class — whether people realise it or not.',
          },
          {
            type: 'colsort',
            question: 'Who does each policy primarily benefit — workers, owners, or both?',
            columns: [
              { label: 'BENEFITS WORKERS\nProletariat gains', color: '#4DFF88', bg: 'rgba(77,255,136,.07)' },
              { label: 'BENEFITS OWNERS\nBourgeoisie gains', color: '#FF5D73', bg: 'rgba(255,93,115,.07)' },
              { label: 'BENEFITS BOTH\nFunctionalist view', color: '#4B90FF', bg: 'rgba(75,144,255,.07)' },
            ],
            items: [
              { label: 'Minimum wage legislation', col: 0, explanation: 'A legal minimum wage limits how much owners can cut pay — directly benefiting workers. Marxists would still argue it is set too low to threaten profit.' },
              { label: 'Tax breaks for corporations', col: 1, explanation: 'Corporate tax cuts increase profits for shareholders and business owners — a classic example of the state serving bourgeois interests.' },
              { label: 'Zero-hours contracts', col: 1, explanation: 'Zero-hours contracts give employers maximum flexibility to cut costs — workers have no guaranteed income or job security.' },
              { label: 'Free universal healthcare', col: 2, explanation: 'Healthcare benefits workers by keeping them alive and healthy. But it also benefits owners — a healthy workforce is a productive one.' },
              { label: 'Laws against strikes', col: 1, explanation: 'Anti-strike legislation limits workers\' ability to organise — protecting the profit-making power of business owners.' },
              { label: 'Universal state education', col: 2, explanation: 'Education benefits workers (access to knowledge) but Marxists argue it mainly benefits owners by training an obedient, skilled workforce cheaply.' },
            ],
            explanation: 'Marxists see most policies as serving the bourgeoisie, even when they appear neutral. Functionalists disagree — they argue institutions serve society as a whole. This is the core debate.',
          },
        ],
      },

      // Screen 9 — Émile Durkheim
      {
        label: 'Émile Durkheim',
        kicker: 'Theorist',
        heading: 'Émile Durkheim (1858–1917)',
        headerImage: '/images/emile-durkheim.png',
        sub: 'The founder of Functionalism. He saw society as a system — and studied it scientifically.',
        blocks: [
          {
            type: 'read',
            label: '📖 Who Was Durkheim?',
            text: 'Émile Durkheim was a French sociologist who wanted to make sociology a proper scientific discipline. He argued that society is more than just a collection of individuals — it has its own structure, its own rules, and its own way of holding itself together. He called the shared beliefs and values that unite a society the <strong>collective conscience</strong>.',
          },
          {
            type: 'keypoint',
            text: '🔑 <strong>Durkheim\'s Three Core Ideas:</strong><br/><br/>🏛️ <strong>Social order</strong>: society stays stable because people share common values and follow shared norms.<br/><br/>🤝 <strong>Social cohesion</strong>: the sense of belonging and solidarity that holds society together. Without it, society breaks down.<br/><br/>⚙️ <strong>Social institutions</strong>: family, school, religion, law — each plays a specific role in maintaining stability. Like organs in a body.',
          },
          {
            type: 'quiz',
            question: 'Durkheim used the "organic analogy" to describe society. What does this mean?',
            options: [
              { text: 'Society is like a body — each institution plays a vital role in keeping it functioning', correct: true },
              { text: 'Society is like a garden — it grows naturally without interference', correct: false },
              { text: 'Society is made up of biological instincts that we inherit at birth', correct: false },
              { text: 'Society is like a machine — efficient but cold and without meaning', correct: false },
            ],
            explanation: 'The organic analogy compares society to a living body. Just as the heart, lungs and brain each have a specific function, so do family, school, law and religion. All parts must work together for society to survive.',
          },
          {
            type: 'funfact',
            label: '💡 Durkheim and Anomie',
            text: 'Durkheim coined the term <strong>anomie</strong> — a feeling of normlessness or disconnection when social norms break down. He used it to explain rising suicide rates in modern industrial societies. When social cohesion weakens, people lose their sense of purpose. This shows why, for Durkheim, <strong>shared values and norms are not optional — they are essential to human wellbeing.</strong>',
          },
        ],
      },

      // Screen 10 — Society's Foundations
      {
        label: 'Society\'s Foundations',
        kicker: 'Functionalism Applied',
        heading: 'What holds society together?',
        sub: 'Functionalists and Marxists look at the same institutions — and reach opposite conclusions.',
        blocks: [
          {
            type: 'read',
            label: '🏛️ Institutions in Conflict',
            text: 'Both theories agree that social institutions (school, family, law, media, religion) shape society. But they disagree completely about <em>whose interests</em> these institutions serve. Functionalists say they serve everyone. Marxists say they serve the ruling class.',
          },
          {
            type: 'colsort',
            question: 'Match each interpretation to the correct theory.',
            columns: [
              { label: 'MARXIST VIEW\nInstitutions serve the ruling class', color: '#FF5D73', bg: 'rgba(255,93,115,.07)' },
              { label: 'FUNCTIONALIST VIEW\nInstitutions serve society as a whole', color: '#4B90FF', bg: 'rgba(75,144,255,.07)' },
            ],
            items: [
              { label: 'Schools teach children to obey authority and accept inequality', col: 0, explanation: 'Marxists (e.g. Bowles and Gintis) argue the "hidden curriculum" of school — obedience, punctuality, accepting hierarchy — prepares workers to accept exploitation without question.' },
              { label: 'Schools socialise children into shared values and develop skills for society', col: 1, explanation: 'Functionalists (e.g. Parsons) see schools as performing vital functions: value transmission, skills development, role allocation — all benefiting society as a whole.' },
              { label: 'The law protects the property rights of the rich', col: 0, explanation: 'Marxists argue laws protecting private property serve bourgeois interests. Most crime laws punish the poor — while white-collar crime by the rich goes largely unpunished.' },
              { label: 'The law maintains social order and protects everyone equally', col: 1, explanation: 'Functionalists see law as a shared social contract — it reflects collective values and protects all members of society from harm and chaos.' },
              { label: 'Religion distracts workers from their exploitation ("opium of the people")', col: 0, explanation: 'Marx famously said religion was the "opium of the people" — it promises rewards in the afterlife and tells the poor to accept their suffering, keeping them docile and obedient.' },
              { label: 'Religion provides moral guidance and social solidarity', col: 1, explanation: 'Durkheim argued religion reinforces the collective conscience — shared rituals build social cohesion and remind people of their shared values and belonging.' },
            ],
            explanation: 'Same institutions. Completely different interpretations. That is the Marxism vs Functionalism debate in a nutshell.',
          },
        ],
      },

      // Screen 11 — Consensus vs Conflict
      {
        label: 'Consensus vs Conflict',
        kicker: 'The Core Contrast',
        heading: 'Consensus or conflict? Every sociologist picks a side.',
        sub: 'This distinction is the foundation of the whole debate. Make it automatic.',
        blocks: [
          {
            type: 'read',
            label: '⚔️ The Two Models',
            text: '<strong>Consensus theory</strong> (Functionalism): society is held together by shared values, cooperation and agreement. Most people broadly accept the rules and norms of their society — and benefit from doing so.<br/><br/><strong>Conflict theory</strong> (Marxism): society is held together by power and coercion. The ruling class maintains control through economic domination, ideology and force — not genuine agreement.',
          },
          {
            type: 'colsort',
            question: 'Is this a Marxist (conflict) or Functionalist (consensus) idea?',
            columns: [
              { label: 'CONFLICT THEORY\nMarxism', color: '#FF5D73', bg: 'rgba(255,93,115,.07)' },
              { label: 'CONSENSUS THEORY\nFunctionalism', color: '#4B90FF', bg: 'rgba(75,144,255,.07)' },
            ],
            items: [
              { label: 'Inequality is necessary to motivate people into important roles', col: 1, explanation: 'Davis and Moore (Functionalist) argued that higher rewards for important jobs motivate the most talented people to fill them. Inequality is functional.' },
              { label: 'The working class are prevented from realising their own exploitation', col: 0, explanation: 'Marx\'s concept of "false consciousness" — workers don\'t revolt because ruling-class ideology has convinced them the system is fair.' },
              { label: 'Every society needs a shared set of values to survive', col: 1, explanation: 'Durkheim\'s "collective conscience" — the shared moral values that bind society together. Without them, society falls apart.' },
              { label: 'Capitalism cannot be reformed — it must be overthrown', col: 0, explanation: 'Marx believed capitalism was too fundamentally exploitative to be fixed. Only revolution and a communist society would end exploitation.' },
              { label: 'Social change should be gradual and evolutionary, not revolutionary', col: 1, explanation: 'Functionalists see society as naturally self-regulating. Change happens slowly as society adapts — sudden revolution is dangerous and destabilising.' },
              { label: 'The ruling class shapes the ideas of the whole society to serve its interests', col: 0, explanation: 'This is Marx\'s concept of ideology — the ruling class controls not just the economy, but also the dominant ideas, values and beliefs of society.' },
            ],
            explanation: 'Consensus vs conflict is the master distinction of sociological theory. Marxism = conflict. Functionalism = consensus. Know this cold.',
          },
          {
            type: 'quiz',
            question: 'A Functionalist sociologist is asked: "Why do some people earn more than others?" What is the most likely answer?',
            options: [
              { text: 'Because some jobs are more important to society and require more skill and training', correct: true },
              { text: 'Because the ruling class controls wages and keeps workers poor on purpose', correct: false },
              { text: 'Because capitalism is designed to exploit the working class', correct: false },
              { text: 'Because the government sets pay levels to benefit powerful groups', correct: false },
            ],
            explanation: 'Functionalists use meritocracy and role allocation to explain inequality — important, skilled roles are rewarded more highly to ensure talented people fill them. This is the Davis and Moore thesis.',
          },
        ],
      },

      // Screen 12 — Who Would Agree?
      {
        label: 'Who Would Agree?',
        kicker: 'Apply the Theories',
        heading: 'Marx or Durkheim? Apply both theories.',
        sub: 'Three real-world scenarios. Which theory best explains each one?',
        blocks: [
          {
            type: 'read',
            label: '🔬 Why This Matters',
            text: 'AQA regularly gives you a real-world situation and asks you to apply sociological theory. You need to know which theory fits and <strong>why</strong> — not just which one to name.',
          },
          {
            type: 'appliedscenario',
            scenarios: [
              {
                scenario: 'A GCSE student from a working-class background attends a state school. Despite working hard, he gets lower grades than students from private schools who had tutors, better resources and more stable home lives. He does not get the university place he wanted.',
                question: 'Which theory best explains this outcome?',
                options: [
                  'Functionalism — his role in society has been allocated based on his abilities',
                  'Marxism — structural inequality in capitalism limits working-class achievement regardless of effort',
                  'Functionalism — the education system has given everyone an equal chance',
                  'Marxism — schools have deliberately failed him to keep him in his class position',
                ],
                correct: 1,
                feedback: 'Marxism explains this better: structural factors (class, resources, home environment) shaped the outcome — not just ability or effort. The education system reproduces class inequality rather than eliminating it.',
                followUp: {
                  q: 'How would a Functionalist respond to this scenario?',
                  answer: 'A Functionalist would argue the education system provided equal opportunity — his outcome reflects his level of ability and effort. They might acknowledge structural barriers exist but argue the system is broadly meritocratic and necessary for role allocation.',
                },
              },
              {
                scenario: 'A company introduces a compulsory team meeting every Monday where workers share goals and celebrate achievements. Workers report feeling more connected to each other and to the company. Productivity increases.',
                question: 'Which sociological concept best explains why this works?',
                options: [
                  'Class conflict — workers are being forced to cooperate against their interests',
                  'Social cohesion — shared rituals build solidarity and a sense of belonging',
                  'Exploitation — the company is extracting more surplus value by making workers feel loyal',
                  'False consciousness — workers don\'t realise they are being manipulated',
                ],
                correct: 1,
                feedback: 'Social cohesion: Durkheim argued that shared rituals and a sense of belonging are what hold groups together. The Monday meeting functions like a collective ritual — building solidarity and shared identity. A Functionalist would see this as a good thing.',
                followUp: {
                  q: 'How would Marx interpret the same scenario?',
                  answer: 'Marx would say this is ideological manipulation — the company is creating false consciousness, making workers feel loyal to a system that exploits them. Increased productivity means more surplus value extracted for the owner, not workers.',
                },
              },
              {
                scenario: 'The government cuts the top rate of income tax from 50% to 40% and raises VAT (a tax on all spending) from 17.5% to 20%. Wealthy people pay less. Everyone who buys goods pays more.',
                question: 'Which theory best explains this policy decision?',
                options: [
                  'Functionalism — lower tax on the wealthy encourages investment that benefits everyone',
                  'Marxism — the state acts in the interests of the ruling class, not the whole population',
                  'Functionalism — VAT ensures everyone contributes equally to public services',
                  'Marxism — the government is deliberately trying to trigger a class revolution',
                ],
                correct: 1,
                feedback: 'Marxism: Marx argued the state is not neutral — it represents the interests of the bourgeoisie. This tax change reduces the burden on the wealthy while increasing it on ordinary consumers. A Marxist would point to this as evidence that the state serves capital, not the people.',
                followUp: {
                  q: 'What would a Functionalist argue about this policy?',
                  answer: 'A Functionalist might argue that reducing tax on the wealthy encourages investment, job creation and economic growth — benefiting society as a whole. They would see the state as acting for the collective good, even if the immediate effects seem unequal.',
                },
              },
            ],
          },
        ],
      },

      // Screen 13 — Apply the Theory
      {
        label: 'Apply the Theory',
        kicker: 'Challenge',
        heading: '⚔️ Theory Challenge: Write Like a Sociologist',
        sub: 'Three questions. Written answers. AI examiner marks against AQA criteria.',
        blocks: [
          {
            type: 'read',
            label: '📝 The Challenge',
            text: 'These questions test <strong>application and analysis</strong> — the skills that separate B and C grades from A grades. Write your answer, then submit it. The AI examiner will mark it and show you a model answer.',
          },
          {
            type: 'boss',
            tier: '🟢',
            label: 'Warm Up',
            question: 'Define "bourgeoisie" and "proletariat." How does Marx say the relationship between them creates conflict?',
            markPoints: `- Bourgeoisie: the ruling class who own the means of production (factories, land, capital)
- Proletariat: the working class who own only their labour, which they must sell to survive
- Conflict arises because their interests are opposed: bourgeoisie want maximum profit; proletariat want maximum wages
- This creates a structural conflict — not a personal one — built into capitalism itself
- Award 1 mark per valid point (up to 4 marks)`,
          },
          {
            type: 'boss',
            tier: '🟡',
            label: 'Challenge',
            question: 'Explain how a Functionalist would interpret the role of the education system in society. How would a Marxist disagree?',
            markPoints: `- Functionalist: schools transmit shared values and norms (socialisation)
- Functionalist: schools develop skills for the economy (skills provision)
- Functionalist: schools allocate people to occupational roles based on ability (role allocation / meritocracy)
- Functionalist: this serves society as a whole — education is a beneficial institution (Parsons)
- Marxist: schools teach working-class children to be obedient and accept authority (hidden curriculum)
- Marxist: education reproduces class inequality — middle-class children get better outcomes
- Marxist: schools serve the bourgeoisie by training a compliant, skilled workforce cheaply (Bowles and Gintis)
- Award 1 mark per developed point (up to 6 marks)`,
          },
          {
            type: 'boss',
            tier: '🔴',
            label: 'Boss Mode',
            question: '"Marxism is more useful than Functionalism for understanding modern society." Evaluate this claim.',
            markPoints: `- Marxism strengths: explains persistent inequality, class differences in education and health, state policy favouring the wealthy
- Marxism evidence: wealth inequality has grown since the 1980s; top 1% own more than bottom 50%
- Marxism weakness: has not accurately predicted revolution in developed capitalist societies
- Marxism weakness: ignores other sources of inequality (gender, ethnicity, age) — focuses only on class
- Functionalism strengths: explains social stability, shared values, why most people accept social rules
- Functionalism weaknesses: ignores power and conflict; can appear to justify inequality as "necessary"
- Functionalism evaluated: conservative — tends to defend the status quo rather than question it
- Strong conclusion: both theories illuminate different aspects of society; neither alone is sufficient
- Award marks for: AO1 (knowledge), AO2 (application), AO3 (analysis and evaluation)`,
          },
        ],
      },

      // Screen 14 — Quick Fire Retrieval
      {
        label: 'Quick Fire Retrieval',
        kicker: 'Retrieval',
        heading: 'No headings. No hints. Just sociology.',
        sub: 'Mixed questions across both theories. This is how AQA exams feel.',
        blocks: [
          {
            type: 'read',
            label: '🔁 Why Retrieval Works',
            text: 'Testing yourself without notes <strong>builds stronger memory</strong> than rereading. Don\'t look back — just try. Getting it wrong now means you remember it in the exam.',
          },
          {
            type: 'tieredquiz',
            tiers: [
              {
                label: 'Definitions', emoji: '🟢',
                questions: [
                  {
                    q: 'What is the "proletariat" according to Marx?',
                    options: [
                      'The working class who sell their labour to survive',
                      'The ruling class who own the means of production',
                      'Politicians who govern on behalf of the people',
                      'Workers who have joined a trade union',
                    ],
                    correct: 0,
                    feedback: 'Proletariat = working class. They own nothing except their ability to work, which they must sell to the bourgeoisie to survive.',
                    hint: 'The opposite of bourgeoisie. Starts with "p."',
                  },
                  {
                    q: 'What does "social cohesion" mean?',
                    options: [
                      'The sense of belonging and solidarity that holds society together',
                      'The legal system that enforces rules in society',
                      'The process of learning norms and values',
                      'The conflict between different social classes',
                    ],
                    correct: 0,
                    feedback: 'Social cohesion is Durkheim\'s concept — the bonds of belonging and shared values that hold society together.',
                    hint: 'A Functionalist key term. What makes society stick together?',
                  },
                  {
                    q: 'Which sociologist is associated with the concept of "false consciousness"?',
                    options: [
                      'Karl Marx',
                      'Émile Durkheim',
                      'Talcott Parsons',
                      'Auguste Comte',
                    ],
                    correct: 0,
                    feedback: 'False consciousness is a Marxist concept — Marx argued workers accept capitalist exploitation because they don\'t see it as exploitation.',
                    hint: 'The conflict theorist who wrote the Communist Manifesto.',
                  },
                ],
              },
              {
                label: 'Application', emoji: '🟡',
                questions: [
                  {
                    q: 'A sociology student says: "Schools exist to give everyone an equal chance." Which theory does this view support?',
                    options: [
                      'Functionalism — meritocracy and role allocation benefit everyone',
                      'Marxism — schools reproduce class inequality',
                      'Neither — this is a factual statement, not a theory',
                      'Marxism — schools create false consciousness in working-class students',
                    ],
                    correct: 0,
                    feedback: 'Functionalists believe in meritocracy — schools should allocate people to roles based on ability, giving everyone a fair chance. This is a Functionalist view.',
                    hint: 'Which theory sees education as a fair, beneficial institution?',
                  },
                  {
                    q: 'Marx called religion the "opium of the people." What did he mean?',
                    options: [
                      'Religion distracts workers from their exploitation by promising rewards in the afterlife',
                      'Religion is addictive and makes people irrational',
                      'Religion is used by the government to keep people calm',
                      'Religion encourages people to work harder in hope of divine reward',
                    ],
                    correct: 0,
                    feedback: 'Marx saw religion as ideological — it tells the poor to accept their suffering and look forward to heaven rather than fighting exploitation on earth.',
                    hint: 'Opium was a painkiller — it made people accept pain rather than treating it.',
                  },
                  {
                    q: 'A Functionalist is asked why crime exists. What is the most likely answer?',
                    options: [
                      'Crime defines the boundaries of acceptable behaviour and reinforces social norms',
                      'Crime exists because the ruling class criminalises working-class behaviour',
                      'Crime is an inevitable result of capitalism and class inequality',
                      'Crime is purely random and has no social pattern',
                    ],
                    correct: 0,
                    feedback: 'Durkheim argued crime is actually functional — it defines the boundary between acceptable and unacceptable behaviour, reinforcing social norms. A small amount of crime is inevitable and even necessary.',
                    hint: 'Functionalists find a positive function for almost everything in society.',
                  },
                ],
              },
              {
                label: 'Exam Assassin', emoji: '🔴',
                questions: [
                  {
                    q: 'Evaluate the Functionalist view that social institutions benefit all members of society.',
                    options: [
                      'Functionalism ignores power — institutions often reflect and reinforce the interests of dominant groups, not everyone equally',
                      'Functionalism is wrong because society is always in conflict and never reaches consensus',
                      'Functionalism is correct because all institutions were designed with everyone\'s interests in mind',
                      'Functionalism cannot be evaluated because it is a matter of opinion',
                    ],
                    correct: 0,
                    feedback: 'The strongest evaluation of Functionalism is that it ignores power. Marxists point out that the same institutions (schools, law, media) function differently depending on your class position — they do not serve everyone equally.',
                    hint: 'What does Functionalism assume that Marxism disputes?',
                  },
                  {
                    q: 'Using both theories, explain why sociologists disagree about whether poverty is inevitable.',
                    options: [
                      'Functionalists argue some inequality motivates people into important roles; Marxists argue poverty is created by capitalism and serves the ruling class',
                      'Both theories agree poverty is inevitable because it is part of human nature',
                      'Functionalists say poverty is caused by laziness; Marxists say it is caused by crime',
                      'Neither theory addresses poverty — they only study culture and socialisation',
                    ],
                    correct: 0,
                    feedback: 'AQA loves this. Functionalists (Davis and Moore): inequality is necessary — high rewards motivate talent. Marxists: poverty is not natural — it is produced by a capitalist system designed to benefit the ruling class.',
                    hint: 'What does each theory say about inequality — is it necessary or unjust?',
                  },
                ],
              },
            ],
          },
        ],
      },

      // Screen 15 — Exam Master
      {
        label: 'Exam Master',
        kicker: 'AQA Technique',
        heading: 'Master the command words.',
        sub: 'AQA uses precise command words. Misread them and you lose marks — even if your sociology is right.',
        blocks: [
          {
            type: 'read',
            label: '📋 Command Words: What AQA Is Actually Asking',
            text: 'Every AQA Sociology question contains a <strong>command word</strong> that tells you exactly what to do. Using the wrong approach — describing when you should be evaluating, or listing when you should be explaining — loses marks regardless of your knowledge.',
          },
          {
            type: 'keypoint',
            text: '🎯 <strong>IDENTIFY</strong> (1 mark): Name the thing. One word or phrase. No explanation needed.<br/><br/>Example: <em>"Identify one feature of capitalism."</em><br/>Answer: <strong>Private ownership of the means of production.</strong> (That\'s it. Nothing more needed.)',
          },
          {
            type: 'keypoint',
            text: '📝 <strong>DESCRIBE</strong> (2–3 marks): Say what something is AND give detail. More than a definition — but no evaluation.<br/><br/>Example: <em>"Describe one way Marxists see social class."</em><br/>Answer: <strong>Marxists argue society is divided into two main classes — the bourgeoisie (who own the means of production) and the proletariat (who must sell their labour). The bourgeoisie exploit the proletariat by paying them less than the value they produce.</strong>',
          },
          {
            type: 'keypoint',
            text: '💡 <strong>EXPLAIN</strong> (4–6 marks): Give a reason AND develop it — show WHY. Include an example or evidence.<br/><br/>Example: <em>"Explain how Functionalists view the role of education."</em><br/>Answer: <strong>Functionalists argue education transmits shared values (socialisation), develops economic skills (skills provision) and allocates people to appropriate roles (role allocation). For example, Parsons argued school acts as a "bridge" between family and society, preparing children to function as adults.</strong>',
          },
          {
            type: 'keypoint',
            text: '⚖️ <strong>EVALUATE / "TO WHAT EXTENT"</strong> (8–12 marks): Give BOTH sides. Use evidence. Reach a conclusion.<br/><br/>Structure: <strong>Point → Evidence → Counter-argument → Evaluation → Conclusion</strong><br/><br/>For Marxism vs Functionalism questions: state one theory\'s view + evidence → state the other\'s view + evidence → evaluate which is more convincing and why.',
          },
          {
            type: 'examtip',
            tip: 'In any Marxism vs Functionalism question: always name the theorist (Marx / Durkheim / Parsons / Davis and Moore), state their view precisely, give ONE concrete example, then evaluate. That structure gets full marks.',
          },
        ],
      },

      // Screen 16 — GCSE Exam Practice
      {
        label: 'Exam Practice',
        kicker: 'Exam Practice',
        heading: 'GCSE Exam Practice.',
        sub: 'Real AQA-style questions. Mark yourself honestly.',
        blocks: [
          {
            type: 'read',
            label: '📝 AQA Sociology Paper',
            text: 'These questions follow AQA mark schemes. For each question: choose the best answer, then read the model answer and mark scheme to see exactly what gains marks.',
          },
          {
            type: 'examscored',
            questions: [
              {
                q: 'Identify one Marxist concept used to describe the working class. [1 mark]',
                marks: 1,
                options: ['Proletariat', 'Collective conscience', 'Social cohesion', 'Anomie'],
                correct: 0,
                feedback: {
                  0: '✓ Proletariat is Marx\'s term for the working class. (1 mark)',
                  1: 'Collective conscience is Durkheim\'s concept — the shared values and beliefs that unite society.',
                  2: 'Social cohesion is a Functionalist concept — the bonds that hold society together.',
                  3: 'Anomie is Durkheim\'s concept — the sense of normlessness when social norms break down.',
                },
                modelAnswer: 'Proletariat. (Or: working class, exploited class.)',
              },
              {
                q: 'Describe one way Marxists argue capitalism creates inequality. [2 marks]',
                marks: 2,
                options: [
                  'Marxists argue capitalism creates inequality through exploitation: the bourgeoisie pay workers less than the value they produce, keeping the surplus as profit.',
                  'Marxists say rich people exist because they work harder than poor people.',
                  'Inequality exists because some people are born with more intelligence than others.',
                  'Capitalism creates inequality by giving everyone different talents and abilities.',
                ],
                correct: 0,
                feedback: {
                  0: '✓ Identifies mechanism (exploitation), names both classes correctly, explains how surplus value creates inequality. (2 marks)',
                  1: 'This reflects a Functionalist or meritocratic view — not Marxism. Marxists argue the system, not effort, determines outcomes.',
                  2: 'This is a biological explanation — sociology focuses on social, not natural, causes of inequality.',
                  3: 'Capitalism doesn\'t distribute talents — this is not a sociological argument.',
                },
                modelAnswer: 'Marxists argue capitalism creates inequality through exploitation. The bourgeoisie (ruling class) own the means of production and pay the proletariat (working class) less than the value they produce. The surplus value becomes profit — wealth that flows upward, not downward.',
              },
              {
                q: 'Using sociological concepts, explain how Functionalists and Marxists disagree about the role of education. [6 marks]',
                marks: 6,
                options: [
                  'Functionalists argue education transmits shared values, develops skills and allocates people to roles based on ability (meritocracy) — serving society as a whole. Marxists (Bowles and Gintis) argue education reproduces class inequality through the hidden curriculum, teaching obedience and acceptance of hierarchy — serving the ruling class.',
                  'Functionalists think education is good. Marxists think it is bad. They disagree because they have different political views.',
                  'Both theories agree education socialises children, but they disagree about whether this is fair.',
                  'Functionalists say education is run by the government. Marxists say it is run by capitalists.',
                ],
                correct: 0,
                feedback: {
                  0: '✓ Names both theories, gives specific functions (value transmission, skills, role allocation), names Marxist theorists (Bowles and Gintis), identifies hidden curriculum, explains whose interests each theory says education serves. Strong answer. (6 marks)',
                  1: 'No sociology terminology, no theory explained, no evidence. This would receive 0 marks.',
                  2: 'Partially correct but too vague — which concepts? Which theorists? How exactly do they disagree?',
                  3: 'Factually incorrect and uses no sociological concepts. 0 marks.',
                },
                modelAnswer: 'Functionalists argue education serves three key functions: value transmission (teaching shared norms), skills provision (developing economic skills), and role allocation (placing people in appropriate jobs via meritocracy). Parsons argued school bridges family and wider society. Marxists, by contrast, argue education reproduces class inequality. Bowles and Gintis identified the "hidden curriculum" — obedience and acceptance of authority taught in school prepare working-class children to be docile workers. This serves the ruling class by producing a compliant workforce. The key disagreement: Functionalists see education as benefiting all of society; Marxists see it as serving the interests of the bourgeoisie.',
              },
            ],
            examTip: 'For 6-mark answers: name both theories, name specific theorists where possible, use sociological concepts precisely, and always explain HOW the institution serves (or doesn\'t serve) society.',
          },
        ],
      },

      // Screen 17 — Final Boss Fight (REQUIRED)
      {
        label: 'Final Boss',
        kicker: 'Challenge',
        heading: '⚔️ Final Boss Fight: Marx vs Durkheim',
        sub: 'Four rounds. No notes. Prove you can think like a sociologist.',
        blocks: [
          {
            type: 'read',
            label: '🔥 The Final Challenge',
            text: 'You have studied both theories. Now you must use them under pressure. Write your answers in the box — then submit for AI marking. You cannot see the model answer until you try.',
          },
          {
            type: 'boss',
            tier: '🟢',
            label: 'Round 1 — Rapid Fire',
            question: 'In one sentence each: (a) What is the bourgeoisie? (b) What is the proletariat? (c) What is social cohesion? (d) What is the collective conscience?',
            markPoints: `- Bourgeoisie: the ruling class who own the means of production (factories, land, capital) and live off the profits
- Proletariat: the working class who own only their labour, which they must sell to the bourgeoisie to survive
- Social cohesion: the bonds of belonging and shared values that hold society together (Durkheim)
- Collective conscience: the shared moral values and beliefs that unite the members of a society (Durkheim)
- Award 1 mark per accurate, precise definition (up to 4 marks)`,
          },
          {
            type: 'boss',
            tier: '🟡',
            label: 'Round 2 — Fix the Error',
            question: 'The following answer contains THREE errors. Identify and correct each one:\n\n"Durkheim was a Marxist who argued that capitalism creates class conflict. He believed that schools exploit the working class. His key concept was false consciousness — the idea that workers don\'t realise they are being exploited."',
            markPoints: `- Error 1: Durkheim was NOT a Marxist — he was a Functionalist. Marx was the conflict theorist.
- Error 2: Durkheim did not argue schools exploit workers — that is a Marxist (Bowles and Gintis) view. Durkheim argued schools transmit shared values and maintain social cohesion.
- Error 3: "False consciousness" is NOT Durkheim's concept — it is Marx's. Durkheim's key concepts include the collective conscience, social cohesion, anomie and the organic analogy.
- Award 2 marks per error correctly identified AND corrected (up to 6 marks)`,
          },
          {
            type: 'boss',
            tier: '🟡',
            label: 'Round 3 — Scenario Analysis',
            question: 'A large corporation pays its CEO £5 million a year while warehouse workers earn £22,000. Workers have no union. The CEO also sits on the government\'s business advisory board.\n\nApply BOTH Marxist and Functionalist theory to explain this situation. Which gives a more convincing explanation? Justify your answer.',
            markPoints: `- Marxist analysis: CEO/corporation = bourgeoisie; workers = proletariat selling their labour
- Workers are exploited — paid far less than the value they produce
- State serves ruling class — CEO on government board shows bourgeoisie influence on policy
- No union = workers cannot organise or develop class consciousness
- Functionalist analysis: high CEO pay reflects the importance and scarcity of the role (Davis and Moore)
- Corporation creates jobs — functional for the economy and society
- Government advisory board is functional — business expertise helps inform policy
- Evaluation: Marxism more convincing here because the pay gap is extreme, workers have no power to negotiate, and direct corporate influence on government aligns with Marxist predictions about how capitalism operates
- Award marks for: named theory, specific application, evidence/example, evaluation with justification`,
          },
          {
            type: 'boss',
            tier: '🔴',
            label: 'Round 4 — Boss Mode',
            question: '"Functionalism cannot explain inequality and therefore has limited value as a sociological theory." To what extent do you agree? Refer to Marxism in your answer.',
            markPoints: `- Agreement (Functionalism cannot explain inequality well):
  - Functionalism normalises inequality — Davis and Moore argue it is "functional" and necessary
  - Ignores how inequality is experienced — poverty and educational failure are not "functional" for those who suffer them
  - Cannot explain growing inequality in capitalist societies since the 1980s
  - Circular reasoning: institutions exist because they are functional — but this doesn't explain who benefits
- Disagreement (Functionalism does explain some aspects of inequality):
  - Role allocation explains why different jobs are paid differently in a meritocratic system
  - Functionalism explains why most people accept inequality rather than revolting against it
  - Durkheim's anomie explains what happens when inequality becomes too extreme (social breakdown)
- Marxism as an alternative:
  - Explains structural causes of inequality through capitalism and class conflict
  - Supported by evidence: widening wealth gap, working-class educational underachievement, state policy favouring corporations
  - Weakness: predicts revolution that has not happened in developed countries; ignores gender and ethnicity
- Balanced conclusion: Functionalism is limited in explaining inequality but valuable for understanding stability and consensus. Marxism is stronger on inequality but weaker on social cohesion. Neither theory alone is sufficient.
- Award marks for: AO1 knowledge, AO2 application to inequality, AO3 evaluation with evidence and counter-argument`,
          },
        ],
      },
    ],
  },

  // ── Sociology Module 3 ────────────────────────────────────────────────────
  {
    id: 'soc3',
    subject: 'Sociology',
    number: 3,
    title: 'Feminism, Power & Life Chances',
    subtitle: 'Who has power — and who gets left behind?',
    era: 'AQA GCSE',
    icon: '⚖️',
    color: '#D96030',
    colorLight: 'rgba(123,63,140,.12)',
    hook: {
      atmosphericOpener: {
        heading: 'WHO HAS POWER?',
        sub: '…and who gets left behind?',
        cta: 'INVESTIGATE SOCIETY',
      },
      scenario: {
        location: 'Any workplace, school, or social media feed',
        hint: 'Look at the leaders around you. Look at who does what at home. Look at which voices get heard and which ones don\'t. Sociologists see patterns in all of this.',
      },
      statement: 'Men and women are treated completely equally in modern society.',
      isTrue: false,
      accentWords: ['completely equally'],
      explanation: "Women still earn less, hold fewer positions of power and carry more domestic labour. The gap between formal equality and lived experience is precisely what this chapter examines.",
      wrongFeedback: 'Sociologists disagree. While legal equality has improved significantly, feminists argue that gender inequality persists in pay, representation, domestic labour and social expectations.',
      correctFeedback: 'Correct. Despite legal progress, sociologists — particularly feminists — argue that significant gender inequality persists in workplaces, homes, media and everyday social expectations.',
      loadingText: 'Mapping the power structures…',
      bigQuestion: 'If society isn\'t completely equal — who benefits, and why does it persist?',
      revealHeader: 'Gender shapes power, status and life chances.',
      revealItems: [
        {
          emoji: '⚡',
          label: 'Feminism: gender inequality shapes society',
          detail: 'Feminists argue that society often advantages men over women — in pay, leadership, media representation and domestic expectations. This is not accidental: it is built into social structures.',
          color: '#D96030',
          bg: 'rgba(217,96,48,.08)',
        },
        {
          emoji: '🏛️',
          label: 'Patriarchy: men hold more structural power',
          detail: 'Patriarchy describes a system in which men hold more power than women across social institutions — work, family, politics, media. Feminists study how patriarchy is maintained and challenged.',
          color: '#D96030',
          bg: 'rgba(217,96,48,.08)',
        },
        {
          emoji: '📊',
          label: 'Weber: power is more than just money',
          detail: 'Max Weber argued that inequality involves status and authority, not just economic class. This helps explain why gender, ethnicity and prestige can shape life chances independently of wealth.',
          color: '#D96030',
          bg: 'rgba(217,96,48,.08)',
        },
      ],
      punchline: 'Different groups experience society differently. Gender, class and status all shape who has power — and who doesn\'t.',
    },
    intro: {
      learningGoals: [
        'Define feminism and explain the concept of patriarchy',
        'Identify and apply gender roles to real-world examples',
        'Define life chances and explain what affects them',
        'Explain Weber\'s view that power involves status and authority, not just money',
        'Compare feminist, Marxist and functionalist perspectives on inequality',
        'Apply sociological perspectives to real-world scenarios',
      ],
    },
    outcomes: {
      intro: "Power isn't just about governments and armies. This chapter shows how it shapes everyday life — and who benefits.",
      bullets: [
        'Explain how different feminist perspectives understand gender inequality',
        'Describe what Weber meant by power, status and class',
        'See how life chances are shaped by gender, ethnicity and social class',
        'Apply these ideas to explain real patterns in education, work and health',
      ],
    },

    recall: {
      questions: [
        { type: 'truefalse', question: 'Weber argued class was the only factor shaping life chances.', isTrue: false },
        { type: 'choice', question: 'Radical feminists trace inequality back to...', options: ['Capitalism and economic exploitation', 'Patriarchy — male dominance built into every institution', 'Individual men\'s personal attitudes'], correct: 1 },
        { type: 'connection', question: 'Life chances depend on multiple factors because...', options: [
          { text: 'Sociologists just like to complicate things', icon: 'book' },
          { text: 'Gender, class and ethnicity each limit access differently', icon: 'people' },
          { text: 'It varies entirely by country and cannot be studied', icon: 'arrow' },
        ], correct: 1 },
      ],
    },
    screens: [

      // Screen 1 — What Is Feminism?
      {
        label: 'What Is Feminism?',
        kicker: 'Perspective',
        heading: 'Feminism: studying gender inequality.',
        headerImage: '/images/feminism-header.png',
        sub: 'A sociological perspective — not a political opinion. Feminism asks why gender still shapes power.',
        blocks: [
          {
            type: 'read',
            label: '🔍 The Feminist Perspective',
            text: '<strong>Feminism</strong> is a sociological perspective that focuses on gender inequality. Feminists argue that society often advantages men over women — in workplaces, families, media and social expectations.<br/><br/>Feminism does not claim all women have identical experiences, or that all men are advantaged in every situation. It identifies <em>patterns</em> in how gender shapes power and opportunity across society.',
          },
          {
            type: 'keypoint',
            text: '🔑 <strong>Three Core Feminist Concepts:</strong><br/><br/>⚡ <strong>Feminism</strong>: a sociological perspective focusing on gender inequality and the social structures that maintain it.<br/><br/>🏛️ <strong>Patriarchy</strong>: a system in which men hold more power than women across social institutions — work, family, law, media.<br/><br/>👥 <strong>Gender roles</strong>: expected behaviours, attitudes and characteristics linked to being male or female — taught through socialisation, not biologically fixed.',
          },
          {
            type: 'quiz',
            question: 'Which statement BEST describes the feminist perspective in sociology?',
            options: [
              { text: 'Feminism studies gender inequality and the social structures that maintain male advantage', correct: true },
              { text: 'Feminism argues that women are always more disadvantaged than men in every situation', correct: false },
              { text: 'Feminism is primarily a political movement with no connection to sociological theory', correct: false },
              { text: 'Feminism focuses only on legal rights rather than social structures and norms', correct: false },
            ],
            explanation: 'Feminism as a sociological perspective studies patterns of gender inequality — how social structures, norms and institutions maintain male advantage. It is not a claim about every individual situation, and it is distinct from (though connected to) political feminism.',
          },
        ],
      },

      // Screen 2 — Invisible Expectations (Gender Roles)
      {
        label: 'Invisible Expectations',
        kicker: 'Gender Roles',
        heading: 'The rules nobody wrote down.',
        sub: 'Gender roles shape what is expected of people — before they are old enough to question it.',
        blocks: [
          {
            type: 'read',
            label: '👥 What Are Gender Roles?',
            text: 'Gender roles are the expected behaviours, attitudes and characteristics that society associates with being male or female. They are not fixed — they vary between cultures and change over time. But within any given society, they shape what is considered "normal" or "appropriate" for men and women.',
          },
          {
            type: 'colsort',
            question: 'Sort each expectation: more expected of boys, more expected of girls, or expected of both equally?',
            columns: [
              { label: 'MORE FROM BOYS\nTraditional male expectations', color: '#4B90FF', bg: 'rgba(75,144,255,.07)' },
              { label: 'MORE FROM GIRLS\nTraditional female expectations', color: '#FF5D73', bg: 'rgba(255,93,115,.07)' },
              { label: 'EXPECTED OF BOTH\nNeutral expectations', color: '#4DFF88', bg: 'rgba(77,255,136,.07)' },
            ],
            items: [
              { label: '"Don\'t cry" or "man up"', col: 0, explanation: 'Boys are more commonly socialised to suppress emotional expression — a traditional male gender role that feminists argue is damaging and socially constructed.' },
              { label: '"Be caring and nurturing"', col: 1, explanation: 'Nurturing and care are disproportionately expected of girls and women — reflected in the fact that most childcare and domestic labour is still performed by women.' },
              { label: '"Look attractive at all times"', col: 1, explanation: 'Appearance-based expectations fall more heavily on girls and women — reflected in media, advertising and social pressure. Feminists argue this reflects and reinforces patriarchy.' },
              { label: '"Be competitive and dominant"', col: 0, explanation: 'Competitiveness and assertiveness are more strongly expected in boys — traits associated with leadership and success in professional contexts.' },
              { label: '"Be honest and trustworthy"', col: 2, explanation: 'Honesty and integrity are broadly expected of everyone — these are shared social values rather than gender-specific expectations.' },
              { label: '"Do the housework and cooking"', col: 1, explanation: 'Domestic labour expectations still fall disproportionately on women — even when both partners work full-time. Feminists call this the "dual burden."' },
            ],
            explanation: 'Sociologists call these patterns gender roles. They are learned through socialisation — not biologically determined. The fact that they vary between cultures and change over time proves they are socially constructed.',
          },
          {
            type: 'tfcheckpoint',
            statement: 'Gender roles are biological — men and women are naturally suited to different roles in society.',
            isTrue: false,
            revealHeader: 'Gender roles are socially constructed, not biologically fixed.',
            revealSub: 'They vary across cultures and change over time — proving they are created by society, not determined by biology.',
            breakdown: [
              'Feminists argue gender roles are taught through socialisation — family, school, media and peer groups.',
              'The same behaviour (e.g. assertiveness) is praised in men and criticised in women — showing the standard is socially, not biologically, set.',
              'Different cultures have different gender norms — if they were biological, they would be universal.',
              'Gender roles have changed significantly within living memory — biology doesn\'t change that quickly.',
            ],
          },
        ],
      },

      // Screen 3 — Patriarchy in Daily Life
      {
        label: 'Patriarchy',
        kicker: 'Applied',
        heading: 'Patriarchy isn\'t always obvious.',
        sub: 'Feminists argue patriarchy operates through everyday patterns — not just dramatic inequality.',
        blocks: [
          {
            type: 'read',
            label: '🏛️ How Patriarchy Shows Up',
            text: 'Patriarchy doesn\'t require deliberate sexism. Feminists argue it operates through social structures, norms and expectations that systematically advantage men over women — often in ways that feel normal or even natural.',
          },
          {
            type: 'appliedscenario',
            scenarios: [
              {
                scenario: 'A large company has 200 employees. 60% are women. But of the 20 senior leadership positions, 17 are held by men. The company says it promotes purely on merit.',
                question: 'What would a feminist sociologist say about this situation?',
                options: [
                  'This reflects natural differences in men\'s and women\'s abilities and ambitions',
                  'The pattern suggests patriarchal structures — not individual choices — are limiting women\'s progression',
                  'This is a Marxist issue about class inequality, not a feminist issue about gender',
                  'This is purely a coincidence and requires no sociological explanation',
                ],
                correct: 1,
                feedback: 'Feminists argue that systematic patterns — like women consistently underrepresented in leadership across multiple organisations — reflect patriarchal structures, not individual choices or merit alone. The "glass ceiling" describes the invisible barrier limiting women\'s career progression.',
                followUp: {
                  q: 'What term do sociologists use for the invisible barrier limiting women\'s career progression?',
                  answer: 'The "glass ceiling" — the metaphor describes how women can see the top positions but are prevented from reaching them by invisible structural and cultural barriers, not formal rules.',
                },
              },
              {
                scenario: 'In a household where both parents work full-time, the woman spends an average of 3 hours more per day on domestic tasks (cooking, cleaning, childcare) than the man.',
                question: 'Which feminist concept best explains this pattern?',
                options: [
                  'The dual burden — women face the "double shift" of paid work AND unpaid domestic labour',
                  'False consciousness — women have been persuaded to enjoy housework by capitalist ideology',
                  'Social cohesion — families function better when roles are clearly divided',
                  'Meritocracy — women choose domestic roles because they prefer them',
                ],
                correct: 0,
                feedback: 'The dual burden (or "double shift"): feminist sociologists use this term to describe how many women face two jobs — paid employment and unpaid domestic labour. This is a pattern, not a personal choice — it reflects the persistence of traditional gender roles even when women participate equally in paid work.',
                followUp: {
                  q: 'How does the "dual burden" challenge the idea that gender equality has been achieved?',
                  answer: 'Even when women achieve formal equality in the workplace, the unequal distribution of domestic labour means women often work significantly more hours in total than men. Formal equality in law does not automatically produce equality in practice.',
                },
              },
              {
                scenario: 'A study finds that a job application CV with a male name receives significantly more interview offers than an identical CV with a female name submitted to the same companies.',
                question: 'What does this evidence suggest about the job market?',
                options: [
                  'It suggests structural gender bias — identical qualifications are evaluated differently based on perceived gender',
                  'It proves that women are less qualified for most professional roles',
                  'It shows that employers deliberately discriminate, suggesting individual bad actors rather than structural issues',
                  'It is statistically insignificant and not evidence of any wider pattern',
                ],
                correct: 0,
                feedback: 'This type of study (a field experiment using paired CVs) provides strong evidence of structural gender bias. The identical qualifications receive different outcomes based only on the perceived gender of the applicant — suggesting the bias is embedded in evaluation processes, not just individual attitudes.',
                followUp: {
                  q: 'Why do feminists argue this is evidence of patriarchy rather than just individual prejudice?',
                  answer: 'Patriarchy describes systemic advantage — built into institutions and norms. The CV study shows bias operating at scale across many organisations, not just in a few prejudiced individuals. This systemic pattern is what feminists mean by patriarchal structures.',
                },
              },
            ],
          },
        ],
      },

      // Screen 4 — Fill in the Blanks (REQUIRED)
      {
        label: 'Key Terms',
        kicker: 'Active Recall',
        heading: 'Lock in the feminist vocabulary.',
        sub: 'These exact terms appear in AQA papers. Drag the correct word into each gap.',
        blocks: [
          {
            type: 'read',
            label: '🎯 Why This Matters',
            text: 'AQA markers reward <strong>precise terminology</strong>. "Unfairness" is not the same as "patriarchy." "Expectations" is not the same as "gender roles." Using the right term proves you understand the concept — and earns marks.',
          },
          {
            type: 'fillblanks',
            sentences: [
              {
                before: 'Feminists study gender',
                after: 'in society.',
                answer: 'inequality',
                hints: ['Not "unfairness" — the sociological term.', 'The word that means unequal treatment or unequal outcomes based on gender.'],
              },
              {
                before: 'A patriarchal society gives more power to',
                after: '.',
                answer: 'men',
                hints: ['Patriarchy = from the Greek "pater" (father). Which group holds more structural power?', 'The group that patriarchy systemically advantages.'],
              },
              {
                before: 'Gender roles are expected',
                after: 'linked to being male or female.',
                answer: 'behaviour',
                hints: ['Not "feelings" or "biology" — what people are expected to DO.', 'Actions, attitudes and characteristics expected of each gender.'],
              },
              {
                before: 'Life chances are the',
                after: 'people have access to in society.',
                answer: 'opportunities',
                hints: ['What you get access to — education, jobs, health, housing.', 'Weber\'s concept — the chances people have to access good things in life.'],
              },
              {
                before: 'Weber believed that power involves not just money, but also',
                after: 'and authority.',
                answer: 'status',
                hints: ['The respect or importance given to someone.', 'Weber\'s third dimension of inequality — between class (money) and authority (power).'],
              },
            ],
            correctMsg: 'Good. These five terms — inequality, patriarchy, gender roles, life chances, status — form the vocabulary of this module.',
            wrongMsg: 'Go back to the definitions and try again. Use the exact sociological term, not a paraphrase.',
          },
        ],
      },

      // Screen 5 — Life Chances
      {
        label: 'Life Chances',
        kicker: 'Key Concept',
        heading: 'Do all people have the same opportunities?',
        sub: 'Life chances are not distributed equally. Gender, class and status all play a role.',
        blocks: [
          {
            type: 'read',
            label: '📊 What Are Life Chances?',
            text: '<strong>Life chances</strong> are the opportunities people have to access the good things in life — education, income, health, housing, career progression. The concept was developed by Max Weber.<br/><br/>Sociologists argue that life chances are shaped by:<br/>• <strong>Social class</strong> — income, wealth, occupation<br/>• <strong>Gender</strong> — feminist sociologists show women face structural barriers<br/>• <strong>Ethnicity</strong> — racial inequality affects educational and economic outcomes<br/>• <strong>Status</strong> — the social respect attached to your role or identity',
          },
          {
            type: 'quiz',
            question: 'A woman from a working-class background has lower average earnings than a man from the same background, who in turn earns less than a man from a middle-class background. What does this suggest?',
            options: [
              { text: 'Both gender AND class affect life chances — they can combine to multiply disadvantage', correct: true },
              { text: 'Only gender matters — class has no influence on earnings', correct: false },
              { text: 'Only class matters — gender differences are explained entirely by class position', correct: false },
              { text: 'Life chances are determined purely by individual effort and talent', correct: false },
            ],
            explanation: 'Sociologists call this intersectionality — gender, class, ethnicity and other factors can combine and interact to shape life chances. Neither gender alone nor class alone fully explains the patterns. Multiple inequalities can reinforce each other.',
          },
          {
            type: 'colsort',
            question: 'How might gender affect each life chance? Sort into: advantage for men, advantage for women, or broadly equal.',
            columns: [
              { label: 'MEN OFTEN ADVANTAGED\nFeminist evidence', color: '#4B90FF', bg: 'rgba(75,144,255,.07)' },
              { label: 'WOMEN OFTEN ADVANTAGED\nCounter-evidence', color: '#FF5D73', bg: 'rgba(255,93,115,.07)' },
              { label: 'BROADLY EQUAL\nNeutral', color: '#4DFF88', bg: 'rgba(77,255,136,.07)' },
            ],
            items: [
              { label: 'Earnings in senior leadership roles', col: 0, explanation: 'Men dominate senior leadership across most sectors, leading to a gender pay gap — particularly pronounced at executive level. Feminists cite this as evidence of the glass ceiling.' },
              { label: 'University admission rates', col: 1, explanation: 'In the UK, women are now more likely than men to attend university — a significant reversal of historical patterns. This is often cited as evidence that gender inequality is complex and not always disadvantageous to women.' },
              { label: 'Risk of poverty in old age', col: 1, explanation: 'Women are more likely to experience poverty in retirement, partly because career breaks for childcare reduce pension contributions, and partly because women live longer on average.' },
              { label: 'Likelihood of holding elected office', col: 0, explanation: 'Men significantly outnumber women in elected political positions globally — the UK Parliament reached 35% female MPs only in 2019, after over 100 years of women\'s suffrage.' },
              { label: 'Likelihood of completing secondary education', col: 2, explanation: 'In the UK, girls and boys complete secondary education at broadly similar rates — though disparities remain globally and within specific ethnic groups.' },
              { label: 'Risk of domestic violence', col: 1, explanation: 'Women are significantly more likely to experience domestic violence than men — a major inequality in personal safety and life outcomes that feminists consistently highlight.' },
            ],
            explanation: 'Life chances and gender inequality are complex. Feminists don\'t claim women are disadvantaged in every area — they identify systematic patterns in which gender shapes opportunities, particularly in work, pay and safety.',
          },
        ],
      },

      // Screen 6 — Max Weber
      {
        label: 'Max Weber',
        kicker: 'Theorist',
        heading: 'Max Weber (1864–1920)',
        headerImage: '/images/max-weber.png',
        sub: 'Power is more than money. Status and authority matter too.',
        blocks: [
          {
            type: 'read',
            label: '📖 Who Was Weber?',
            text: 'Max Weber was a German sociologist writing at the same time as Durkheim. He agreed with Marx that class inequality mattered — but argued Marx was too focused on economics. Weber identified <strong>three distinct dimensions of inequality</strong> that could each affect life chances independently.',
          },
          {
            type: 'keypoint',
            text: '🔑 <strong>Weber\'s Three Dimensions of Inequality:</strong><br/><br/>💰 <strong>Class</strong>: economic inequality — income, wealth, occupation. This is what Marx focused on.<br/><br/>⭐ <strong>Status</strong>: the social respect or prestige given to a person or group. A teacher may have lower income than a footballer but higher social status in some contexts.<br/><br/>🏛️ <strong>Authority</strong>: legitimate power — the ability to influence others in recognised and accepted ways. A politician has authority that a billionaire may not.',
          },
          {
            type: 'quiz',
            question: 'A celebrity influencer has millions of followers and huge cultural influence, but earns less than a hedge fund manager who has little public recognition. Which Weberian concept best explains the influencer\'s power?',
            options: [
              { text: 'Status — social respect and cultural influence that operates independently of economic class', correct: true },
              { text: 'Class — because income is the only real measure of power in society', correct: false },
              { text: 'Authority — because the government has given the influencer legitimate power', correct: false },
              { text: 'Patriarchy — because gender determines the influencer\'s power level', correct: false },
            ],
            explanation: 'Weber\'s concept of status explains influence that doesn\'t come from money or formal power. A social media influencer\'s reach and cultural impact is a form of status-based power — exactly what Weber argued Marx overlooked by focusing only on economic class.',
          },
          {
            type: 'funfact',
            label: '💡 Weber vs Marx',
            text: 'Marx said: "Everything comes back to who owns the factories." Weber said: "It\'s more complicated than that." A poor but respected religious leader can have enormous power. A fabulously wealthy celebrity can have status but no political authority. Weber\'s multi-dimensional view allows sociologists to explain patterns of inequality that class alone cannot — including gender inequality.',
          },
        ],
      },

      // Screen 7 — Who Has Status?
      {
        label: 'Who Has Status?',
        kicker: 'Weber Applied',
        heading: 'Status can be earned, inherited or given.',
        sub: 'And it doesn\'t always come with money.',
        blocks: [
          {
            type: 'read',
            label: '⭐ Status Is Socially Constructed',
            text: 'Status is the respect or social prestige society gives to a person or group. But status isn\'t objective — it depends on what a society values. A doctor has high status in most societies. But in some contexts, a footballing celebrity has more cultural influence than a doctor. Status is <em>given</em> by society — and society can also take it away.',
          },
          {
            type: 'quiz',
            question: 'A doctor earns £80,000 a year. A professional footballer earns £5 million a year. Who has higher STATUS in Weber\'s sense?',
            options: [
              { text: 'It depends on which audience — both have high status in different social contexts', correct: true },
              { text: 'The footballer, because higher income always means higher status', correct: false },
              { text: 'The doctor, because income doesn\'t matter to status at all', correct: false },
              { text: 'Neither — status is irrelevant if you have wealth', correct: false },
            ],
            explanation: 'Status is context-dependent. Among medical professionals, a doctor has high status. In popular culture, the footballer may have far more cultural influence. Weber\'s point is that status operates somewhat independently of income — which is why you cannot reduce all inequality to class.',
          },
          {
            type: 'quiz',
            question: 'How does Weber\'s concept of status help explain gender inequality that Marx\'s class analysis cannot?',
            options: [
              { text: 'It explains why women can face lower status and less authority even when their income equals men\'s', correct: true },
              { text: 'It proves that gender inequality doesn\'t exist — only class inequality matters', correct: false },
              { text: 'It shows that women always have higher status than men in service industries', correct: false },
              { text: 'It replaces feminist analysis entirely with a more accurate economic explanation', correct: false },
            ],
            explanation: 'Weber\'s status concept explains inequalities that income statistics miss. A woman earning the same salary as a male colleague may still face lower social prestige, less authority in meetings and fewer promotion opportunities — status-based disadvantages that Marx\'s economic class analysis alone cannot capture.',
          },
          {
            type: 'examtip',
            label: '⚔️ Exam Assassin',
            tip: '"Weber believed power is more than just money." If an AQA question asks you to explain Weber\'s contribution — always use all three: class (economic), status (social respect) and authority (legitimate power). Then show how these dimensions can operate independently — and how gender, not just class, affects all three.',
          },
        ],
      },

      // Screen 8 — Who Would Agree? (Perspective Comparison)
      {
        label: 'Who Would Agree?',
        kicker: 'Perspectives',
        heading: 'Four perspectives. One society.',
        sub: 'Tap the perspective that would MOST agree with each statement.',
        blocks: [
          {
            type: 'read',
            label: '🔬 Applying Perspectives',
            text: 'AQA regularly asks you to identify which sociological perspective would explain a situation. You now know four: <strong>Feminism</strong>, <strong>Marxism</strong>, <strong>Functionalism</strong> and <strong>Weber</strong>. The skill is knowing not just the label — but WHY each perspective agrees.',
          },
          {
            type: 'appliedscenario',
            scenarios: [
              {
                scenario: 'A study finds that women in the UK earn on average 14.9% less than men for equivalent work. Feminists call this the gender pay gap and argue it reflects patriarchal structures in hiring, promotion and pay-setting.',
                question: 'Which perspective provides the MOST direct explanation for this pattern?',
                options: [
                  'Functionalism — the pay gap reflects different roles with different levels of social importance',
                  'Feminism — the pay gap is evidence of patriarchal structures that systematically disadvantage women',
                  'Marxism — the pay gap is purely about capitalist exploitation of the working class',
                  'Weber — the pay gap is explained entirely by differences in individual status',
                ],
                correct: 1,
                feedback: 'Feminism most directly addresses the gender pay gap — it identifies the patriarchal structures that maintain male advantage in pay, hiring and promotion. Marxism and Weber offer partial explanations, but feminism focuses specifically on gender as a dimension of inequality.',
                followUp: {
                  q: 'How would a Marxist DIFFER from a feminist in explaining the gender pay gap?',
                  answer: 'A Marxist would argue the pay gap is ultimately rooted in capitalist exploitation — employers benefit from paying women less, which also creates divisions in the working class that prevent class unity. A feminist would argue the pay gap exists because of patriarchy — male advantage built into social structures — which operates independently of capitalism and existed in non-capitalist societies too.',
                },
              },
              {
                scenario: 'A television presenter has no formal political power and a modest salary. But millions of people trust their opinions on politics, science and society — and their views visibly influence public debate.',
                question: 'Which sociologist\'s concept BEST explains this person\'s power?',
                options: [
                  'Marx — their power comes from their position in the economic system',
                  'Weber — their power comes from status and cultural influence, not income or formal authority',
                  'Durkheim — their power reflects the collective conscience of society',
                  'A feminist — their power reflects gender advantage in the media',
                ],
                correct: 1,
                feedback: 'Weber\'s concept of status explains influence that doesn\'t derive from formal authority or economic class. The presenter\'s power is cultural and reputational — a form of status-based influence that Marx\'s economic analysis misses entirely.',
                followUp: {
                  q: 'Why does Weber\'s concept of status matter for understanding gender inequality?',
                  answer: 'Status helps explain why women can face disadvantage even when formal barriers have been removed. Even if a woman earns as much as a male colleague, she may command less respect, receive less credit for achievements and be seen as less "naturally" authoritative — status-based inequality that income data alone doesn\'t capture.',
                },
              },
              {
                scenario: 'A researcher finds that children\'s toys are still heavily gendered: pink science sets marketed to girls emphasise "being pretty," while boys\' science kits emphasise "building and discovery." Both contain identical equipment.',
                question: 'Which concepts best explain what this research reveals?',
                options: [
                  'Life chances and class — the toys reflect economic inequality in the toy market',
                  'Gender roles and socialisation — toys teach children different expectations based on gender from an early age',
                  'The organic analogy — toys play a functional role in society\'s stability',
                  'False consciousness — children are unaware that they are being socialised by toy marketing',
                ],
                correct: 1,
                feedback: 'Gender roles and socialisation: toys are a key agency through which children learn what is expected of their gender. Identical equipment packaged differently communicates that boys should build and explore while girls should focus on appearance — a classic example of gender role socialisation in action.',
                followUp: {
                  q: 'How would a feminist sociologist link this to patriarchy?',
                  answer: 'Feminists would argue this toy marketing is an example of how patriarchy reproduces itself through socialisation — teaching girls to value appearance and boys to value achievement from an early age. This shapes life chances: girls who are directed toward appearance and away from STEM subjects from childhood face structural disadvantages in future careers.',
                },
              },
            ],
          },
        ],
      },

      // Screen 9 — Quick Fire Retrieval
      {
        label: 'Quick Fire Retrieval',
        kicker: 'Retrieval',
        heading: 'No headings. No hints. Just sociology.',
        sub: 'Questions across Modules 1, 2 and 3. This is how AQA papers feel.',
        blocks: [
          {
            type: 'read',
            label: '🔁 Why Retrieval Works',
            text: 'Testing yourself without notes builds long-term memory faster than re-reading. Mix topics — that\'s how AQA structures its papers and how strong exam answers are built.',
          },
          {
            type: 'tieredquiz',
            tiers: [
              {
                label: 'Definitions', emoji: '🟢',
                questions: [
                  {
                    q: 'What is "patriarchy"?',
                    options: [
                      'A system in which men hold more power than women across social institutions',
                      'A political movement arguing for complete gender equality',
                      'A religious institution that gives women authority over men',
                      'The idea that all inequality comes from economic class',
                    ],
                    correct: 0,
                    feedback: 'Patriarchy = a system in which men hold more structural power than women in social institutions (work, family, law, media). It is a sociological concept, not a political position.',
                    hint: 'From the Greek "pater" (father). What system does patriarchy describe?',
                  },
                  {
                    q: 'What does Weber mean by "status"?',
                    options: [
                      'The social respect or prestige given to a person or group, which operates independently of income',
                      'The economic position of a person determined by their income and wealth',
                      'The legal authority given to someone by the government',
                      'The amount of money someone earns from their job',
                    ],
                    correct: 0,
                    feedback: 'Status = social respect or prestige. A teacher may have less income than a footballer but higher status in some contexts. Weber argued status operates independently of class (income) — which is why you can\'t reduce all inequality to economics.',
                    hint: 'What Weber added to Marx\'s analysis — it\'s not money, it\'s...',
                  },
                  {
                    q: 'What are "life chances"?',
                    options: [
                      'The opportunities people have to access good outcomes in education, work, health and housing',
                      'The statistical probability of surviving to a certain age',
                      'The legal rights that citizens have in a democratic society',
                      'The number of career options available to someone based on their qualifications',
                    ],
                    correct: 0,
                    feedback: 'Life chances: the opportunities people have to access the good things in life — education, income, health, housing. Weber\'s concept. Shaped by class, gender, ethnicity and status.',
                    hint: 'What you get ACCESS to in life. Not just survival — opportunities.',
                  },
                ],
              },
              {
                label: 'Application', emoji: '🟡',
                questions: [
                  {
                    q: 'A woman is passed over for promotion despite better performance reviews than the male colleague who is promoted. Which sociological concept BEST explains this?',
                    options: [
                      'The glass ceiling — a feminist concept describing invisible barriers to women\'s career progression',
                      'Social cohesion — the workforce needs stability, so change is slow',
                      'False consciousness — the woman has not realised she is being exploited',
                      'The organic analogy — each part of the organisation plays a natural role',
                    ],
                    correct: 0,
                    feedback: 'The glass ceiling is the feminist term for the invisible structural barrier that prevents women from reaching the highest positions, even when their performance equals or exceeds male colleagues. It\'s structural, not individual — it operates across many organisations simultaneously.',
                    hint: 'A feminist concept about career progression. You can see the top but can\'t quite reach it.',
                  },
                  {
                    q: '"Patriarchy means women always earn less than men." What is wrong with this statement?',
                    options: [
                      'Patriarchy describes systemic structural advantage — not a rule that applies in every individual case. Some women earn more than some men.',
                      'The statement is correct — all women everywhere earn less than all men.',
                      'Patriarchy has nothing to do with earnings — it only refers to political power.',
                      'The statement is wrong because women are generally paid more than men in modern societies.',
                    ],
                    correct: 0,
                    feedback: 'Patriarchy describes a systematic pattern, not an absolute rule. Individual women can earn more than individual men. The feminist argument is about patterns across society — the gender pay gap, the glass ceiling, underrepresentation in leadership — not that every single man earns more than every single woman.',
                    hint: 'Patriarchy is a systemic concept. Does every individual case have to fit the pattern for the system to exist?',
                  },
                  {
                    q: 'From Module 2: How does Marxism DIFFER from Feminism in explaining inequality?',
                    options: [
                      'Marxism focuses on class and economic exploitation; Feminism focuses on gender and patriarchal structures',
                      'Marxism focuses on gender inequality; Feminism focuses on class exploitation',
                      'Both theories reach the same conclusions using different evidence',
                      'Marxism argues inequality doesn\'t exist; Feminism argues it does',
                    ],
                    correct: 0,
                    feedback: 'Marxism = class is the primary dimension of inequality (bourgeoisie exploits proletariat through capitalism). Feminism = gender is a distinct and important dimension of inequality (patriarchy maintains male advantage). Both identify inequality — they disagree about its primary cause and dimension.',
                    hint: 'What does each perspective focus on? What is each theory\'s primary explanation for inequality?',
                  },
                ],
              },
              {
                label: 'Exam Assassin', emoji: '🔴',
                questions: [
                  {
                    q: '"Feminism is more useful than Marxism for understanding modern inequality." Evaluate this claim.',
                    options: [
                      'Feminism better explains gender-based inequality and patterns Marx overlooked; Marxism better explains class-based economic exploitation. Modern inequality has multiple dimensions — neither alone is sufficient.',
                      'Feminism is completely correct and Marxism is entirely wrong about inequality.',
                      'Marxism is more useful because class is the only real form of inequality that exists.',
                      'Both perspectives are equally useful in all situations — there is no difference.',
                    ],
                    correct: 0,
                    feedback: 'The strongest evaluative answer acknowledges what each perspective does well, what each misses, and reaches a justified conclusion. Feminism illuminates gender inequality that Marxism underplays. Marxism illuminates class exploitation that early Feminism sometimes overlooked. Modern sociologists often combine both — intersectionality theory.',
                    hint: 'What does Feminism explain that Marxism can\'t? What does Marxism explain that Feminism can\'t? Then evaluate.',
                  },
                  {
                    q: 'Using Weber\'s concept of status, explain why removing formal legal discrimination may not be enough to achieve gender equality.',
                    options: [
                      'Legal equality removes formal barriers but status inequality can persist — women may still face lower social respect, less assumed authority and different evaluations of identical behaviour even when the law treats them equally.',
                      'Weber argued that legal equality is the only form of equality that matters — once laws are equal, inequality disappears.',
                      'Status is determined by income — so equal pay would automatically produce equal status.',
                      'Weber\'s analysis shows gender inequality does not exist once formal legal barriers are removed.',
                    ],
                    correct: 0,
                    feedback: 'This is exactly the kind of Weberian analysis AQA rewards. Legal equality (equal rights, anti-discrimination laws) removes formal barriers — but status inequality is socially constructed and can persist independently. Women can face lower assumed competence, less professional respect and less authority in the same roles as men, even when the law provides identical protection.',
                    hint: 'What does status mean? Can it exist independently of what the law says? Give a specific example.',
                  },
                ],
              },
            ],
          },
        ],
      },

      // Screen 10 — Exam Master
      {
        label: 'Exam Master',
        kicker: 'AQA Technique',
        heading: 'Know what each command word demands.',
        sub: 'Misread the command word and you lose marks — even with perfect sociology knowledge.',
        blocks: [
          {
            type: 'read',
            label: '📋 Command Words in AQA Sociology',
            text: 'Every AQA question contains a command word that tells you exactly what to do. Sociology students often describe when they should be explaining, or explain when they should be evaluating. The command word controls the structure of your answer.',
          },
          {
            type: 'keypoint',
            text: '📝 <strong>DESCRIBE / IDENTIFY</strong> (1–2 marks): State a feature or give an example. No explanation needed.<br/><br/>Example: <em>"Identify one example of a gender role."</em><br/>Answer: <strong>The expectation that women will do more domestic work than men.</strong> (Done. One example. No more.)',
          },
          {
            type: 'keypoint',
            text: '💡 <strong>EXPLAIN</strong> (3–4 marks): Give a reason AND show HOW or WHY. Use sociological concepts.<br/><br/>Example: <em>"Explain one way gender can affect life chances."</em><br/>Answer: <strong>Gender can affect life chances through the gender pay gap — women earn on average less than men for equivalent work. This is because patriarchal structures in hiring and promotion systematically disadvantage women, reducing their access to higher incomes and economic security.</strong>',
          },
          {
            type: 'keypoint',
            text: '⚖️ <strong>DISCUSS / "TO WHAT EXTENT"</strong> (6–12 marks): Give BOTH sides. Use evidence. Justify a conclusion.<br/><br/>Structure: <strong>Point 1 (one view + evidence) → Point 2 (opposing view + evidence) → Evaluation → Conclusion</strong><br/><br/>For feminist/Marxist/Weberian questions: state each perspective\'s view precisely, give a specific example, then evaluate which is more convincing and WHY.',
          },
          {
            type: 'examtip',
            tip: 'In any inequality question: name the perspective (feminist/Marxist/Weberian), state their specific claim, give ONE concrete example from real life, then explain HOW the example supports the claim. That four-part structure — perspective + claim + example + explanation — gets full marks.',
          },
        ],
      },

      // Screen 11 — GCSE Exam Practice
      {
        label: 'Exam Practice',
        kicker: 'Exam Practice',
        heading: 'GCSE Exam Practice.',
        sub: 'Real AQA-style questions. Mark yourself honestly.',
        blocks: [
          {
            type: 'read',
            label: '📝 AQA Sociology Paper — Inequality',
            text: 'These questions follow AQA mark schemes. For each question: choose the best answer, then read the model answer and mark scheme to see exactly what gains marks.',
          },
          {
            type: 'examscored',
            questions: [
              {
                q: 'Identify one example of a gender role. [1 mark]',
                marks: 1,
                options: [
                  'The expectation that women will take primary responsibility for childcare',
                  'The legal right to vote in democratic elections',
                  'The sociological concept of class consciousness',
                  'The idea that society needs shared values to function',
                ],
                correct: 0,
                feedback: {
                  0: '✓ A gender role — a specific, socially constructed expectation linked to gender. (1 mark)',
                  1: 'Voting rights are a legal/political concept, not a gender role. Gender roles are behavioural expectations.',
                  2: 'Class consciousness is a Marxist concept unrelated to gender roles.',
                  3: 'Shared values relate to Functionalism (Durkheim) — not gender roles.',
                },
                modelAnswer: 'The expectation that women will take primary responsibility for childcare (or: that men should not show emotion; that women should prioritise appearance).',
              },
              {
                q: 'Describe two features of a patriarchal society. [4 marks]',
                marks: 4,
                options: [
                  'First: men hold more power than women in social institutions such as work and politics. Second: gender roles are shaped by patriarchal norms — women are expected to take on domestic roles while men are expected to be breadwinners.',
                  'First: patriarchy means everyone is treated equally. Second: it was invented by Karl Marx to explain class inequality.',
                  'First: patriarchy is when women earn more than men. Second: it is a term for religious inequality.',
                  'First: patriarchal societies are always violent. Second: patriarchy only exists in traditional cultures.',
                ],
                correct: 0,
                feedback: {
                  0: '✓ Two clear, accurate features: structural male advantage in institutions + gendered role expectations reinforced by patriarchal norms. Uses terminology correctly. (4 marks)',
                  1: 'Factually incorrect. Patriarchy does not mean equality, and was not invented by Marx.',
                  2: 'Factually incorrect. Patriarchy is not about women earning more, and it is not about religion.',
                  3: 'Oversimplified and partially incorrect. Patriarchy is systemic, not always violent, and exists in modern societies.',
                },
                modelAnswer: 'First feature: men hold more power than women in key social institutions — in the UK, men hold the majority of senior leadership positions in business, politics and media. Second feature: gender roles in a patriarchal society direct women towards domestic and caring responsibilities — feminists argue the "dual burden" of paid work and unpaid domestic labour shows patriarchal norms persisting even as women enter the workforce.',
              },
              {
                q: 'Using sociological concepts, explain how gender can affect life chances. [6 marks]',
                marks: 6,
                options: [
                  'Gender affects life chances through structural disadvantages including the gender pay gap, the glass ceiling in career progression, and the dual burden of domestic labour. Feminist sociologists argue patriarchal structures systematically reduce women\'s access to high-earning careers and economic security. Weber\'s concept of status also explains why women may have less authority even in equivalent roles.',
                  'Gender affects life chances because women are naturally suited to different careers. Men are better at leadership so they earn more.',
                  'Gender used to affect life chances but laws have made everything equal now so it doesn\'t matter anymore.',
                  'Gender affects life chances through socialisation. Children learn different things from their parents.',
                ],
                correct: 0,
                feedback: {
                  0: '✓ Names feminist perspective, identifies multiple mechanisms (pay gap, glass ceiling, dual burden), links to patriarchy, adds Weber\'s status concept, explains HOW each mechanism affects life chances. Strong answer — uses multiple sociological concepts precisely. (6 marks)',
                  1: 'Based on biological determinism, not sociology. No sociological concepts, no evidence, no theoretical framework. 0 marks.',
                  2: 'Oversimplifies — legal equality does not automatically produce equality in practice. No examples or concepts. 1 mark at best.',
                  3: 'Identifies socialisation (correct) but does not explain how it affects life chances, doesn\'t use specific concepts or give evidence. 2 marks.',
                },
                modelAnswer: 'Gender can affect life chances in several ways. First, the gender pay gap means women earn less on average than men — feminist sociologists argue this reflects patriarchal structures in hiring, promotion and pay-setting. Second, the glass ceiling limits women\'s career progression — women are systematically underrepresented in senior leadership despite equal qualifications. Third, the dual burden means many women face both paid employment and disproportionate domestic responsibilities, limiting their time and energy for career development. Using Weber\'s concept of status, women may also command less social respect and authority in equivalent professional roles, further limiting their life chances. Together, these demonstrate that gender remains a significant structural factor shaping opportunities, not just individual preferences.',
              },
            ],
            examTip: 'For 6-mark sociology answers: name your perspective (feminist/Weberian), identify a specific mechanism (glass ceiling, dual burden, status gap), give a real-world example, and explain HOW it affects life chances. That structure — perspective + mechanism + example + explanation — covers every mark.',
          },
        ],
      },

      // Screen 12 — Final Boss Fight (REQUIRED)
      {
        label: 'Final Boss',
        kicker: 'Challenge',
        heading: '⚔️ Final Boss: Who Really Has Power?',
        sub: 'Four rounds. Apply everything. No single correct answer in Round 4 — the quality of your reasoning is what counts.',
        blocks: [
          {
            type: 'read',
            label: '🔥 The Final Challenge',
            text: 'Four rounds. Written answers. AI examiner marks against AQA criteria. You cannot see model answers until you try.',
          },
          {
            type: 'boss',
            tier: '🟢',
            label: 'Round 1 — Rapid Fire Definitions',
            question: 'Define each of the following in ONE precise sentence each: (a) Patriarchy (b) Life chances (c) Status (d) Gender roles',
            markPoints: `- Patriarchy: a system in which men hold more power than women across social institutions such as work, family, law and media
- Life chances: the opportunities people have to access good outcomes in education, income, health and housing — shaped by class, gender, ethnicity and status
- Status: the social respect or prestige given to a person or group, which can operate independently of economic income (Weber)
- Gender roles: expected behaviours, attitudes and characteristics that society associates with being male or female, learned through socialisation not biology
- Award 1 mark per accurate, concise definition (up to 4 marks)`,
          },
          {
            type: 'boss',
            tier: '🟡',
            label: 'Round 2 — Fix the Error',
            question: 'The following answer contains THREE errors. Identify and correct each one:\n\n"Feminists believe society is completely equal. They use the concept of class conflict to explain why men earn more than women. Max Weber argued that the only thing that matters for power is how much money you have."',
            markPoints: `- Error 1: Feminists do NOT believe society is completely equal — the opposite. Feminists argue society is characterised by gender inequality and patriarchy, which systematically advantages men over women.
- Error 2: Feminists do NOT use "class conflict" to explain gender inequality — that is a Marxist concept. Feminists use concepts like patriarchy, gender roles, the glass ceiling and the dual burden to explain gender-based inequality.
- Error 3: Weber did NOT argue that only money matters for power — the opposite. Weber explicitly argued that power has THREE dimensions: class (economic), status (social respect) and authority (legitimate power). His contribution was showing that inequality cannot be reduced to economics alone.
- Award 2 marks per error correctly identified AND corrected (up to 6 marks)`,
          },
          {
            type: 'boss',
            tier: '🟡',
            label: 'Round 3 — Scenario Analysis',
            question: 'A woman and a man apply for the same senior leadership position. Both have identical qualifications and performance records. The man is appointed. The woman is told she "needs more development." She later discovers the selection panel was all-male.\n\nApply feminist theory AND Weber\'s concept of status to explain what may have happened. Which provides the more convincing explanation?',
            markPoints: `- Feminist analysis: patriarchal structures may have influenced the decision — an all-male panel may unconsciously or consciously apply different criteria to male and female candidates (implicit bias)
- Glass ceiling: the pattern of women being passed over for senior roles despite equal qualifications reflects structural, not individual, barriers
- The "needs more development" feedback may reflect gendered expectations — assertiveness in men is read as leadership; in women it may be read negatively
- Weberian analysis: status inequality may explain why the woman was evaluated differently — she may command less assumed authority or credibility in the panel's eyes, independent of her qualifications
- Weber helps explain WHY implicit bias operates even when income is equal — it's about social respect and assumed authority, not just economic class
- Evaluation: feminist theory provides the more direct and comprehensive explanation — it identifies the patriarchal structure (all-male panel, institutional patterns) that shapes the specific outcome. Weber's status concept complements it by explaining the mechanism of implicit bias.
- Award marks for: named theory, specific application, explanation of mechanism, evaluation with justification`,
          },
          {
            type: 'boss',
            tier: '🔴',
            label: 'Round 4 — Power Showdown',
            question: '"Gender is the most important factor shaping people\'s life chances in modern society." To what extent do you agree?\n\nYou must refer to at least TWO other factors (e.g. class, ethnicity, status, education) and use sociological evidence. There is no single correct answer — your reasoning and use of sociology is what earns marks.',
            markPoints: `- Agreement — gender significantly shapes life chances:
  - Gender pay gap: women earn on average less than men across most sectors
  - Glass ceiling: women systematically underrepresented in senior leadership
  - Dual burden: domestic labour expectations limit women's career development
  - Safety: women face greater risk of domestic violence — a direct life chance impact
  - Feminist evidence: these patterns are systemic, not individual
- Class as an alternative/additional factor:
  - Marxists argue class (income, wealth, occupation) shapes life chances more profoundly than gender in many contexts
  - A wealthy woman may have better life chances than a poor man — suggesting class intersects with and can override gender
  - Social mobility data shows class background remains the strongest predictor of educational and economic outcomes in the UK
- Ethnicity as an additional factor:
  - BAME groups face compounded disadvantage in employment, housing and health
  - Intersectionality: a working-class woman of colour may face multiplicative disadvantage — gender + class + ethnicity combined
- Status and education:
  - Weber: status can shape life chances independent of income — a doctor and a footballer may earn similarly but have very different status-based opportunities
  - Education level remains a powerful predictor of life chances across genders
- Balanced conclusion: gender is a significant factor — feminist sociologists provide strong evidence of systemic disadvantage. But class, ethnicity and status all independently shape life chances, and they often interact. The most accurate answer acknowledges intersectionality — the combination of factors — rather than prioritising any single dimension.
- Award marks for: AO1 knowledge of multiple factors, AO2 specific evidence and examples, AO3 sustained evaluation with justified conclusion`,
          },
        ],
      },
    ],
  },

  // ─── SOC4 — Family & Households ───────────────────────────────────────────
  {
    id: 'soc4',
    subject: 'Sociology',
    number: 4,
    title: 'Family & Households',
    subtitle: 'Why families are more sociological than you realised.',
    era: 'AQA GCSE',
    icon: '🏠',
    color: '#D96030',
    colorLight: 'rgba(217,96,48,.12)',
    hook: {
      atmosphericOpener: {
        heading: 'WHAT MAKES A FAMILY?',
        sub: 'Families shape almost everything about us.',
        cta: 'START INVESTIGATING',
      },
      statement: '"Most families today are a mum, dad and two children living under one roof."',
      isTrue: false,
      accentWords: ['mum, dad and two children'],
      explanation: "The nuclear family is now a minority in Britain. Single-parent households, cohabitation, same-sex families and reconstituted families have fundamentally changed the picture.",
      wrongFeedback: 'Sociologists would strongly disagree. Family diversity is one of the defining features of modern British society.',
      correctFeedback: 'Correct. The nuclear family is no longer the majority household type in the UK.',
      loadingText: 'Sociology has a lot to say about this…',
      bigQuestion: 'So what does a family actually look like today?',
      revealHeader: 'Families come in many forms.',
      revealItems: [
        { emoji: '🌍', label: 'Family diversity', detail: 'Lone-parent families, reconstituted families, same-sex families and extended families are all recognised by sociologists as valid family structures.', color: '#D96030', bg: 'rgba(217,96,48,.08)' },
        { emoji: '📉', label: 'Changing families', detail: 'Marriage rates are falling. Divorce rates rose sharply through the 20th century. Cohabitation and single-person households are increasingly common.', color: '#D96030', bg: 'rgba(217,96,48,.08)' },
        { emoji: '⚖️', label: 'Feminist perspectives', detail: 'Feminists argue traditional family structures can reinforce gender inequality — with women bearing a disproportionate share of domestic labour and emotional work.', color: '#D96030', bg: 'rgba(217,96,48,.08)' },
      ],
      punchline: 'Sociology asks not just what a family is — but who benefits from it.',
    },
    intro: {
      learningGoals: [
        'Identify and define the main family types recognised by sociologists',
        'Explain what primary socialisation is and why it matters',
        'Describe the Functionalist view of family life',
        'Describe the Feminist critique of family inequality',
        'Explain how and why families have changed over time',
        'Apply sociological perspectives to real family scenarios',
      ],
    },
    outcomes: {
      intro: "The family seems natural. Sociology shows it's actually constructed — and has changed dramatically over time.",
      bullets: [
        'Describe how family structures in the UK have changed since 1960',
        "Explain what sociologists mean by 'the cereal packet family'",
        'See why Marxists and Feminists both critique the traditional family',
        'Apply functionalist and critical perspectives to modern family life',
      ],
    },

    recall: {
      questions: [
        { type: 'truefalse', question: 'The nuclear family has always been the most common family type.', isTrue: false },
        { type: 'choice', question: 'Functionalists see the family as mainly...', options: ['A source of conflict and gender inequality', 'Performing essential positive functions for society', 'A capitalist institution that exploits women'], correct: 1 },
        { type: 'connection', question: 'Feminist sociologists critique traditional family because...', options: [
          { text: 'They believe people should live alone instead', icon: 'house' },
          { text: 'It reinforces unequal gender roles and expectations', icon: 'people' },
          { text: 'Nuclear families are now statistically very rare', icon: 'warning' },
        ], correct: 1 },
      ],
    },
    screens: [

      // Screen 1 — Family Types
      {
        label: 'Family Types',
        kicker: 'Core Concept',
        heading: 'What even counts as a family?',
        sub: 'Most people think they know. Sociologists quickly realised it\'s more complicated than that.',
        blocks: [
          {
            type: 'read',
            label: '🏠 Defining the Family',
            text: 'Sociologists define the family as a <strong>social group</strong> sharing ties of kinship, marriage or adoption — often living together and providing emotional and economic support. But definitions vary across cultures, time periods and political perspectives.',
          },
          {
            type: 'appliedscenario',
            scenario: 'A married couple live with their two school-age children. Both parents work full-time.',
            question: 'Which family type does this describe?',
            options: [
              { text: 'Nuclear family', correct: true },
              { text: 'Extended family', correct: false },
              { text: 'Beanpole family', correct: false },
            ],
            feedback: 'The nuclear family consists of two parents and their dependent children — once considered the "norm" in Western society.',
            followUp: {
              q: 'Why did Functionalists consider the nuclear family ideal?',
              answer: 'Functionalists like Parsons argued the nuclear family provided clear roles — a breadwinner and homemaker — offering stability, primary socialisation and emotional support for children and adults.',
            },
          },
          {
            type: 'appliedscenario',
            scenario: 'A mother lives alone with her 10-year-old daughter after separating from her partner. The daughter\'s father visits at weekends.',
            question: 'Which family type does this describe?',
            options: [
              { text: 'Extended family', correct: false },
              { text: 'Lone-parent family', correct: true },
              { text: 'Reconstituted family', correct: false },
            ],
            feedback: 'Lone-parent families are now a major family type in the UK. Most are headed by women. They are not defined by what they lack — they are a distinct family structure with their own dynamics.',
            followUp: {
              q: 'What might a feminist sociologist highlight about lone-parent families?',
              answer: 'Feminists argue lone-parent families — predominantly headed by mothers — face structural disadvantages: lower incomes, reduced state support and the dual burden of combining paid work with full-time childcare.',
            },
          },
          {
            type: 'appliedscenario',
            scenario: 'Two fathers live with their adopted son and the son\'s biological grandmother, who provides regular childcare.',
            question: 'Which family type BEST describes this household?',
            options: [
              { text: 'Extended family — multiple generations sharing support', correct: true },
              { text: 'Nuclear family — two parents and one child', correct: false },
              { text: 'Lone-parent family — only one main carer', correct: false },
            ],
            feedback: 'When wider relatives live with or actively support a household, it moves toward an extended family — regardless of how the couple is composed. Family types can overlap.',
            followUp: {
              q: 'How does this example challenge traditional definitions of the family?',
              answer: 'It challenges definitions based on biological ties, gender roles and heterosexual norms — showing that family is a socially constructed concept that changes over time and across cultures.',
            },
          },
          {
            type: 'colsort',
            question: 'Match each family type to its correct definition.',
            columns: [
              { label: 'NUCLEAR\nTwo parents + dependent children only', color: '#D96030', bg: 'rgba(217,96,48,.07)' },
              { label: 'EXTENDED\nIncludes wider relatives', color: '#A0522D', bg: 'rgba(160,82,45,.07)' },
              { label: 'RECONSTITUTED\nBlended or step-family', color: '#8B6914', bg: 'rgba(139,105,20,.07)' },
              { label: 'BEANPOLE\nMany generations, few siblings', color: '#6B4E3D', bg: 'rgba(107,78,61,.07)' },
            ],
            items: [
              { label: 'Grandparents, parents and children living together', col: 1, explanation: 'Multiple generations under one roof — the defining feature of an extended family.' },
              { label: 'Two parents raising children from previous relationships', col: 2, explanation: 'A blended or reconstituted family — also called a step-family.' },
              { label: 'Great-grandparents still living, but only one or two children per generation', col: 3, explanation: 'Beanpole: long and thin — many generations alive simultaneously, but few siblings at each level.' },
              { label: 'Married couple with their dependent children, no other relatives', col: 0, explanation: 'The classic nuclear family — two parents and their children only.' },
            ],
            explanation: 'AQA regularly asks students to identify and describe family types. Definitions score marks. Examples alone do not.',
          },
        ],
      },

      // Screen 2 — Primary Socialisation
      {
        label: 'Socialisation',
        kicker: 'Core Concept',
        heading: 'Families teach us who to be.',
        sub: 'This is called primary socialisation. It starts from birth and never entirely stops.',
        blocks: [
          {
            type: 'read',
            label: '🧠 Primary Socialisation',
            text: '<strong>Primary socialisation</strong> is the process through which children learn the basic norms, values, language and behaviour of their society — mainly through the family. It is called "primary" because it is the <strong>first</strong> and most fundamental form of socialisation.',
          },
          {
            type: 'keypoint',
            heading: 'What Families Teach',
            points: [
              { emoji: '🗣️', label: 'Language', detail: 'Children learn to speak, name objects and communicate emotions through family interaction — before any formal education.' },
              { emoji: '🤝', label: 'Manners and behaviour', detail: '"Say thank you." "Share your toys." Families transmit the basic rules of social interaction from the earliest age.' },
              { emoji: '⚖️', label: 'Norms', detail: 'What is considered normal behaviour — mealtimes, routines, how to treat others — is learned at home first.' },
              { emoji: '💡', label: 'Values', detail: 'Deeper beliefs — honesty, respect, work ethic — are instilled through family life, often without being stated explicitly.' },
            ],
          },
          {
            type: 'funfact',
            heading: 'Primary Socialisation in Action',
            text: 'Parent: "Say thank you."\nChild: "Why?"\nParent: "Because civilisation would collapse."\n\nSociologists call this the transmission of norms and values. Parents just call it Tuesday.',
          },
          {
            type: 'quiz',
            question: 'Which of the following is learned through primary socialisation?',
            options: [
              { text: 'How to speak and communicate with others', correct: true },
              { text: 'The laws of thermodynamics', correct: false },
              { text: 'How to pass a driving test', correct: false },
              { text: 'GCSE exam technique', correct: false },
            ],
            correctMsg: 'Correct. Language and communication are among the earliest things learned through family interaction — the foundation of all socialisation.',
            wrongMsg: 'Primary socialisation is about norms, values, language and behaviour — all transmitted through the family in early childhood.',
          },
          {
            type: 'examtip',
            tip: 'AQA distinguishes primary socialisation (family, early childhood) from secondary socialisation (school, peers, media — later in life). Always specify which agency you are describing and which type of socialisation it represents.',
          },
        ],
      },

      // Screen 3 — Functionalist View
      {
        label: 'Functionalism',
        kicker: 'Sociological Perspectives',
        heading: 'Functionalists say families create stability.',
        sub: 'Everything in society exists for a reason. Families, according to Functionalists, exist for several.',
        blocks: [
          {
            type: 'read',
            label: '⚙️ The Functionalist View',
            text: '<strong>Functionalists</strong> see the family as a fundamental institution that benefits both individuals and society. Talcott Parsons identified two core functions of the nuclear family: <strong>primary socialisation</strong> of children, and <strong>the stabilisation of adult personalities</strong> — providing emotional support for adults recovering from the demands of work and public life.',
          },
          {
            type: 'keypoint',
            heading: 'Functions of the Family',
            points: [
              { emoji: '💬', label: 'Emotional support', detail: 'The family provides a safe emotional environment — what Parsons called a "warm bath" — where adults can recover from the stresses of work and public life.' },
              { emoji: '📖', label: 'Primary socialisation', detail: 'Children learn society\'s norms, values and culture through the family — the essential first step before entering wider institutions.' },
              { emoji: '🏠', label: 'Economic support', detail: 'Families pool resources, share costs and provide financial security — particularly for children, elderly and vulnerable members.' },
              { emoji: '🔄', label: 'Social stability', detail: 'By transmitting shared values across generations, families maintain social order and ensure society continues to function.' },
            ],
          },
          {
            type: 'colsort',
            question: 'Match each scenario to the family function it illustrates.',
            columns: [
              { label: 'EMOTIONAL SUPPORT\nComfort and stability', color: '#D96030', bg: 'rgba(217,96,48,.07)' },
              { label: 'SOCIALISATION\nTeaching norms and values', color: '#A0522D', bg: 'rgba(160,82,45,.07)' },
              { label: 'ECONOMIC SUPPORT\nSharing resources', color: '#8B6914', bg: 'rgba(139,105,20,.07)' },
            ],
            items: [
              { label: 'Parents comfort a child upset after school', col: 0, explanation: 'Emotional support — one of Parsons\' core functions. The family as a safe, private haven.' },
              { label: 'Parents teach their child to say please and thank you', col: 1, explanation: 'Primary socialisation — teaching the norms and values of society through everyday interaction.' },
              { label: 'Grandparents pay for a grandchild\'s school trip', col: 2, explanation: 'Economic support — families sharing financial resources across generations.' },
              { label: 'A stressed parent unwinds at home after a difficult day at work', col: 0, explanation: 'Parsons\' "warm bath" theory — the family stabilises adult personalities by providing a private emotional refuge from the demands of public life.' },
            ],
            explanation: 'Functionalists see every family function as serving a wider social purpose. For AQA, name the function and explain how it benefits society — not just that it does.',
          },
          {
            type: 'funfact',
            heading: 'The Warm Bath Theory',
            text: 'Talcott Parsons described the family as a "warm bath" — a place where stressed adults could emotionally recover.\n\nParent, still in work clothes at 8pm, making their third packed lunch while replying to school emails: "Absolutely. Very warm."',
          },
          {
            type: 'examtip',
            tip: 'Functionalists focus on what the family does FOR society. In any 6-mark answer: name Parsons, identify at least one function, explain HOW it benefits society — and acknowledge that not everyone agrees (feminists, Marxists).',
          },
        ],
      },

      // Screen 4 — Feminist View
      {
        label: 'Feminism',
        kicker: 'Sociological Perspectives',
        heading: 'Feminists say family life isn\'t always equal.',
        sub: 'The family can be a site of inequality as well as support. Feminists were among the first sociologists to say so.',
        blocks: [
          {
            type: 'read',
            label: '⚖️ The Feminist Critique',
            text: '<strong>Feminist sociologists</strong> argue that traditional family structure can reinforce gender inequality. Women have historically been expected to perform the majority of <strong>domestic labour</strong> (housework, childcare) and <strong>emotional labour</strong> (managing relationships and feelings in the household) — often unpaid and unrecognised.',
          },
          {
            type: 'keypoint',
            heading: 'Key Feminist Concepts',
            points: [
              { emoji: '🧹', label: 'Domestic labour', detail: 'Cooking, cleaning, childcare and household management. Ann Oakley (1974) found women performed the bulk of this even when working full-time.' },
              { emoji: '💭', label: 'Emotional labour', detail: 'The invisible work of managing the emotional wellbeing of family members — organising, remembering, worrying. Usually performed by women and rarely acknowledged.' },
              { emoji: '🎭', label: 'Gender role expectations', detail: 'Societal expectations around what men and women "should" do in family life — which feminists argue are socially constructed, not natural or inevitable.' },
              { emoji: '📊', label: 'The dual burden', detail: 'Many women face a "dual burden" — combining full-time paid employment with the majority of unpaid domestic work at home. Research consistently replicates Oakley\'s original finding.' },
            ],
          },
          {
            type: 'colsort',
            question: 'Is this domestic labour or emotional labour?',
            columns: [
              { label: 'DOMESTIC LABOUR\nPhysical household tasks', color: '#D96030', bg: 'rgba(217,96,48,.07)' },
              { label: 'EMOTIONAL LABOUR\nManaging feelings and relationships', color: '#8B6914', bg: 'rgba(139,105,20,.07)' },
            ],
            items: [
              { label: 'Cooking dinner every evening', col: 0, explanation: 'Domestic labour — a physical, time-consuming task that Oakley found was disproportionately performed by women.' },
              { label: 'Remembering every family member\'s social commitments', col: 1, explanation: 'Emotional and organisational labour — the mental load of tracking what everyone needs.' },
              { label: 'Cleaning and organising the home', col: 0, explanation: 'Domestic labour — one of the core tasks examined in Oakley\'s research.' },
              { label: 'Mediating arguments between siblings', col: 1, explanation: 'Emotional labour — managing family relationships is invisible but exhausting work.' },
              { label: 'Organising school admin, uniforms and appointments', col: 1, explanation: 'The "mental load" — planning and organising that goes largely unseen but falls disproportionately on women.' },
            ],
            explanation: 'Feminists distinguish these to show that inequality in family life extends beyond visible housework to the invisible management of emotional and organisational life.',
          },
          {
            type: 'funfact',
            heading: 'Invisible Labour',
            text: 'Dad: "Just tell me what needs doing."\n\nMum, mentally holding the shopping list, three school letters, the dentist appointment, who\'s upset with whom and why, and the emotional stability of the entire household:\n\n"Sure."',
          },
          {
            type: 'examtip',
            tip: 'AQA often asks to compare Functionalist and Feminist views. Functionalists say the family benefits everyone equally. Feminists say it benefits men more — and at women\'s expense. Structure: state the view → name a sociologist → give evidence.',
          },
        ],
      },

      // Screen 5 — New Right
      {
        label: 'New Right',
        kicker: 'Sociological Perspectives',
        heading: 'The New Right: family breakdown and the welfare state.',
        sub: 'Charles Murray argued welfare dependency was creating a damaging underclass. A controversial but exam-essential perspective.',
        headerImage: '/images/charles-murray.png',
        blocks: [
          {
            type: 'read',
            label: '🏛️ The New Right Perspective',
            text: 'The <strong>New Right</strong> is a conservative sociological perspective that emerged in the 1970s–80s. Thinkers like <strong>Charles Murray</strong> and <strong>David Marsland</strong> argue that the traditional nuclear family — with a married male breadwinner and female carer — is the ideal structure for a stable society. They believe state welfare has undermined this ideal by removing the need for two-parent families.',
          },
          {
            type: 'keypoint',
            heading: 'Key New Right Ideas',
            points: [
              { emoji: '👤', label: 'Charles Murray', detail: 'Murray (1984) argued welfare benefits created a growing "underclass" — a group dependent on state support with weakened work ethic and family structure. He saw rising lone-parent families as evidence of moral and social decline.' },
              { emoji: '🏛️', label: 'David Marsland', detail: 'Marsland argued universal welfare was too generous and created a "dependency culture" — removing individual and family responsibility. He called for targeted, not universal, welfare provision.' },
              { emoji: '💍', label: 'The nuclear family ideal', detail: 'New Right thinkers see the traditional nuclear family as the best environment for raising children and maintaining social stability. Other family forms are seen as less effective.' },
              { emoji: '⚠️', label: 'The underclass', detail: 'Murray\'s concept: a section of society characterised by welfare dependency, absent fathers, high crime rates and rejection of mainstream values. He blamed welfare, not structural inequality.' },
            ],
          },
          {
            type: 'misconception',
            mistakes: [
              {
                wrong: 'The New Right simply hates poor people.',
                right: 'The New Right frames its argument as concern for social stability.',
                reason: 'Murray and Marsland argue welfare harms the people it claims to help by creating long-term dependency. Whether or not you agree, this is the logic you need to explain in an exam — not a personal attack.',
              },
              {
                wrong: 'The New Right is the same as Functionalism.',
                right: 'Both favour the nuclear family, but for different reasons.',
                reason: 'Functionalists focus on socialisation and stability. The New Right focuses on welfare dependency and moral responsibility. They are distinct perspectives in AQA Sociology.',
              },
            ],
          },
          {
            type: 'colsort',
            question: 'Is this a New Right or Feminist argument?',
            columns: [
              { label: 'NEW RIGHT\nConservative — traditional family ideal', color: '#3B82FF', bg: 'rgba(59,130,255,.07)' },
              { label: 'FEMINIST\nCritique of family inequality', color: '#D96030', bg: 'rgba(217,96,48,.07)' },
            ],
            items: [
              { label: 'Welfare creates dependency and weakens family structure', col: 0, explanation: 'New Right — Murray\'s core argument about welfare undermining the traditional family.' },
              { label: 'The family reinforces patriarchy and unpaid female labour', col: 1, explanation: 'Feminist — Oakley and others argue the family benefits men at women\'s expense.' },
              { label: 'The nuclear family is the ideal structure for raising children', col: 0, explanation: 'New Right — they see the two-parent married family as best for stability and socialisation.' },
              { label: 'Women face a dual burden of paid and unpaid work', col: 1, explanation: 'Feminist — the dual burden is a feminist concept about inequality within families.' },
              { label: 'Lone-parent families contribute to social problems', col: 0, explanation: 'New Right — Murray linked single parenthood to the underclass and welfare dependency.' },
            ],
            explanation: 'New Right = traditional values, anti-welfare. Feminist = equality critique, domestic labour. Both evaluate the family but from opposite political standpoints.',
          },
          {
            type: 'examtip',
            tip: 'AQA regularly asks you to compare perspectives on the family. New Right vs Feminist is a classic pairing: both evaluate the family critically, but reach opposite conclusions. New Right: family breakdown is caused by welfare. Feminist: family inequality is caused by patriarchy.',
          },
        ],
      },

      // Screen 6 — Changing Families
      {
        label: 'Changing Families',
        kicker: 'Social Change',
        heading: 'Families look very different from 100 years ago.',
        sub: 'And 50 years ago. And probably 20 years ago. Families change faster than sociologists can write about them.',
        blocks: [
          {
            type: 'read',
            label: '📈 Key Changes in Family Life',
            text: 'Over the last century, British family life has changed significantly. <strong>Marriage rates</strong> have declined, <strong>divorce rates</strong> rose sharply after the 1969 Divorce Reform Act, <strong>cohabitation</strong> has increased, and family structures have diversified considerably. The nuclear family is no longer the majority household form.',
          },
          {
            type: 'keypoint',
            heading: 'New Family Types to Know',
            points: [
              { emoji: '🌳', label: 'Beanpole family', detail: 'Long and thin — many generations alive simultaneously (great-grandparents through to grandchildren) but few siblings at each level. The result of longer lifespans and lower birth rates.' },
              { emoji: '🪃', label: 'Boomerang family', detail: 'Adult children who leave home and then return — usually due to housing costs, student debt or relationship breakdown. Increasingly common in the UK.' },
              { emoji: '👶', label: 'Child-centred family', detail: 'Modern families increasingly organise life around children\'s needs and wellbeing — rather than around adult work obligations or extended family duty.' },
            ],
          },
          {
            type: 'funfact',
            heading: 'The Boomerang Family',
            text: 'Adult child: "I\'m just staying temporarily."\n\nParents, three years later, eating around a 27-year-old\'s vinyl collection and discontinued gym equipment:\n\n"Of course you are."',
          },
          {
            type: 'keypoint',
            heading: 'Why Families Have Changed',
            points: [
              { emoji: '⚖️', label: 'Legal changes', detail: 'The 1969 Divorce Reform Act made divorce significantly easier. The 2004 Civil Partnership Act and 2014 Marriage Act extended marriage rights to same-sex couples.' },
              { emoji: '💼', label: 'Women in the workforce', detail: 'Rising female employment from the 1960s onwards changed family dynamics, reducing financial dependence on male partners.' },
              { emoji: '🏥', label: 'Longer life expectancy', detail: 'People live longer — creating beanpole structures with more generations alive simultaneously.' },
              { emoji: '💸', label: 'Economic pressures', detail: 'Housing costs, student debt and job insecurity have driven both the rise of the boomerang family and later family formation.' },
            ],
          },
          {
            type: 'quiz',
            question: 'What is a beanpole family?',
            options: [
              { text: 'A family with many siblings at each generation', correct: false },
              { text: 'A family with many generations alive but few siblings at each level', correct: true },
              { text: 'A family where adult children return home', correct: false },
              { text: 'A nuclear family with nearby extended relatives', correct: false },
            ],
            correctMsg: 'Exactly. Long and thin — like a beanpole. Many generations simultaneously alive, very few siblings at each level.',
            wrongMsg: 'The beanpole family is defined by its vertical structure: many generations alive at once, but few siblings at each level. It\'s caused by longer lifespans and declining birth rates. The boomerang family is where adult children return home.',
          },
          {
            type: 'examtip',
            tip: 'Beanpole family comes up constantly in AQA papers. Memorise the definition exactly: many generations alive simultaneously, few siblings at each level — caused by longer lifespans and declining birth rates.',
          },
        ],
      },

      // Screen 6 — Fill in the Blanks
      {
        label: 'Fill the Gaps',
        kicker: 'Retrieval Practice',
        heading: 'Fill in the blanks.',
        sub: 'Drag the correct word into each gap. Three words in the bank are decoys.',
        blocks: [
          {
            type: 'fillblanks',
            sentences: [
              { before: 'A beanpole family has many', answer: 'generations', after: 'alive simultaneously.' },
              { before: 'Primary socialisation teaches children the norms and', answer: 'values', after: 'of their society.' },
              { before: 'A reconstituted family is also called a', answer: 'blended', after: 'family.' },
              { before: 'Feminists argue women perform a disproportionate amount of', answer: 'domestic', after: 'labour.' },
              { before: 'An adult child returning to live with parents is part of a', answer: 'boomerang', after: 'family.' },
            ],
            wordBank: ['generations', 'values', 'blended', 'domestic', 'boomerang', 'weather', 'chemistry', 'nuclear'],
          },
        ],
      },

      // Screen 7 — Who Would Agree?
      {
        label: 'Perspectives',
        kicker: 'Apply Your Knowledge',
        heading: 'Who would agree?',
        sub: 'Three perspectives. One statement. Think before you choose.',
        blocks: [
          {
            type: 'appliedscenario',
            scenario: '"The family performs essential functions for society — providing socialisation, emotional support and stability for both individuals and the wider social order."',
            question: 'Which sociological perspective would most agree with this?',
            options: [
              { text: 'Functionalism', correct: true },
              { text: 'Feminism', correct: false },
              { text: 'Marxism', correct: false },
            ],
            feedback: 'Functionalists view the family as a positive institution that benefits both individuals and society. This view is closely associated with Talcott Parsons.',
            followUp: {
              q: 'How would a feminist challenge this statement?',
              answer: 'A feminist would argue the family serves society at the expense of women — the emotional support and socialisation described are largely performed by women, often unpaid and unrecognised. The family benefits men more than it benefits everyone equally.',
            },
          },
          {
            type: 'appliedscenario',
            scenario: '"Domestic labour and emotional work in families falls disproportionately on women — even when both partners work full-time."',
            question: 'Which perspective is this most associated with?',
            options: [
              { text: 'Functionalism', correct: false },
              { text: 'Feminism', correct: true },
              { text: 'New Right', correct: false },
            ],
            feedback: 'This is a core feminist argument, supported by Ann Oakley\'s research. Feminists argue the family reproduces gender inequality through the unequal division of domestic and emotional labour.',
            followUp: {
              q: 'Name one piece of evidence that supports this argument.',
              answer: 'Ann Oakley (1974) found that even when women worked full-time, they still performed the majority of housework and childcare — demonstrating that paid employment had not led to equality in the home.',
            },
          },
          {
            type: 'appliedscenario',
            scenario: '"Families support capitalism by reproducing a compliant workforce and absorbing the costs of care that the state does not cover."',
            question: 'Which perspective does this statement reflect?',
            options: [
              { text: 'Functionalism', correct: false },
              { text: 'Feminism', correct: false },
              { text: 'Marxism', correct: true },
            ],
            feedback: 'Marxists argue the family serves the interests of capitalism — reproducing labour power, socialising workers to accept inequality and providing unpaid care that would otherwise cost the state.',
            followUp: {
              q: 'How does the Marxist view differ from the Functionalist view of the family?',
              answer: 'Functionalists argue the family benefits everyone in society equally. Marxists argue it primarily benefits the ruling class and capitalism — maintaining inequality and providing free labour and care.',
            },
          },
          {
            type: 'examtip',
            tip: 'Link each perspective to a key thinker: Functionalism → Parsons; Feminism → Oakley; Marxism → Engels or Zaretsky. Named sociologists lift a 4-mark answer to the top band.',
          },
        ],
      },

      // Screen 8 — Quick Fire Retrieval
      {
        label: 'Quick Fire',
        kicker: 'Retrieval Practice',
        heading: 'Quick fire. No notes.',
        sub: 'Speed matters. Retrieval under pressure is exactly what the exam tests.',
        blocks: [
          {
            type: 'tieredquiz',
            rounds: [
              {
                label: '🟢 Round 1 — Definitions',
                questions: [
                  {
                    q: 'TRUE or FALSE: A beanpole family has many siblings at each generation.',
                    options: ['True', 'False'],
                    correct: 1,
                    explanation: 'False. A beanpole family has many generations alive simultaneously but FEW siblings at each level — long and thin, not wide.',
                  },
                  {
                    q: 'Which family type includes step-parents and children from previous relationships?',
                    options: ['Nuclear family', 'Reconstituted family', 'Beanpole family', 'Extended family'],
                    correct: 1,
                    explanation: 'A reconstituted (or blended) family is formed when adults with children from previous relationships form a new family unit.',
                  },
                  {
                    q: 'Primary socialisation mainly occurs through which institution?',
                    options: ['School', 'The family', 'The media', 'Religion'],
                    correct: 1,
                    explanation: 'Primary socialisation is the first and most fundamental form — taking place through the family in early childhood.',
                  },
                ],
              },
              {
                label: '🟡 Round 2 — Apply It',
                questions: [
                  {
                    q: 'Which sociologist is associated with the feminist study of domestic labour?',
                    options: ['Talcott Parsons', 'Ann Oakley', 'Karl Marx', 'Max Weber'],
                    correct: 1,
                    explanation: 'Ann Oakley\'s 1974 study found women bear a disproportionate share of domestic labour even when working full-time — the key feminist reference on family inequality.',
                  },
                  {
                    q: 'Which family function did Parsons describe as the "warm bath"?',
                    options: ['Primary socialisation', 'Economic support', 'Stabilisation of adult personalities', 'Social control'],
                    correct: 2,
                    explanation: 'Parsons used the "warm bath" metaphor to describe how the family allows stressed adults to relax and feel emotionally restored — stabilising their personalities.',
                  },
                  {
                    q: 'An adult child moves back home due to housing costs. What family type does this illustrate?',
                    options: ['Beanpole family', 'Boomerang family', 'Extended family', 'Child-centred family'],
                    correct: 1,
                    explanation: 'The boomerang family describes adult children who return to the parental home — driven by housing costs, student debt and economic pressures.',
                  },
                ],
              },
              {
                label: '🔴 Round 3 — Exam Ready',
                questions: [
                  {
                    q: 'A feminist argues the family is a site of gender oppression. Which BEST supports this?',
                    options: [
                      'Children learn norms through family life',
                      'Women perform most domestic and emotional labour without recognition',
                      'Families provide economic support to all members',
                      'The nuclear family provides stability for society',
                    ],
                    correct: 1,
                    explanation: 'Feminists argue the family oppresses women through the unequal division of domestic and emotional labour — unpaid, invisible and disproportionately performed by women.',
                  },
                  {
                    q: 'Which statement reflects a FUNCTIONALIST view of the family?',
                    options: [
                      'The family reinforces gender inequality through domestic labour',
                      'The family serves the interests of capitalism above all else',
                      'The family provides essential functions that benefit society as a whole',
                      'Family diversity shows the nuclear family is no longer relevant',
                    ],
                    correct: 2,
                    explanation: 'Functionalists see the family as a positive institution performing essential social functions — socialisation, emotional support, stability — for the benefit of all.',
                  },
                ],
              },
            ],
          },
        ],
      },

      // Screen 9 — Exam Master
      {
        label: 'Exam Master',
        kicker: 'Exam Skills',
        heading: 'Exam technique that actually scores marks.',
        sub: 'Different command words need different approaches. Know which is which.',
        blocks: [
          {
            type: 'keypoint',
            heading: 'Command Words',
            points: [
              { emoji: '1️⃣', label: 'IDENTIFY — 1 mark', detail: 'One word or short phrase. No explanation needed. "Identify one family type." → Nuclear family.' },
              { emoji: '2️⃣', label: 'DESCRIBE — 2 marks', detail: 'Give a feature or example with enough detail. State the thing + a brief description of what it involves.' },
              { emoji: '3️⃣', label: 'EXPLAIN — 4 marks', detail: 'Say HOW or WHY. State a point, develop it with reasoning, and give an example or evidence. Avoid vague opinion.' },
              { emoji: '4️⃣', label: 'DISCUSS — 6 marks', detail: 'Multiple perspectives, named sociologists, evidence on both sides, and a conclusion. Both views must genuinely appear.' },
            ],
          },
          {
            type: 'examtip',
            tip: 'The most common mistake: describing a perspective without naming it. "Some people think families create stability" scores 0. "Functionalists, such as Parsons, argue that families…" begins to score marks immediately.',
          },
          {
            type: 'examtip',
            tip: 'For 6-mark "describe one difference" questions: state the difference clearly, then develop each side separately. Do NOT blend both views into one confused paragraph — examiners cannot award marks for arguments they can\'t identify.',
          },
        ],
      },

      // Screen 10 — GCSE Exam Practice
      {
        label: 'Exam Practice',
        kicker: 'GCSE Questions',
        heading: 'GCSE exam practice.',
        sub: 'Real question styles. Real mark schemes. No revision notes.',
        blocks: [
          {
            type: 'examscored',
            questions: [
              {
                marks: 1,
                question: 'Identify one type of family.',
                placeholder: 'Name one family type...',
                modelAnswer: 'Nuclear family / lone-parent family / extended family / reconstituted family / beanpole family',
                keywords: ['nuclear', 'lone', 'extended', 'reconstituted', 'beanpole', 'single', 'blended'],
                tip: '1-mark questions need one accurate term. No explanation required.',
              },
              {
                marks: 2,
                question: 'Describe two functions of the family.',
                placeholder: 'Write your two functions here...',
                modelAnswer: 'Primary socialisation — teaching children norms and values. Emotional support — providing a safe environment where adults and children feel supported and emotionally stable.',
                keywords: ['socialisation', 'emotional', 'support', 'economic', 'stability', 'norms', 'values', 'function', 'parsons'],
                tip: 'Two separate points, each with a brief description — not just a label.',
              },
              {
                marks: 4,
                question: 'Explain one way families socialise children.',
                placeholder: 'State a way → explain how → give an example...',
                modelAnswer: 'Families socialise children through the teaching of norms and values — this is called primary socialisation. Parents model expected behaviour such as politeness and sharing, and use positive and negative sanctions to reinforce it. For example, praising a child for saying thank you (positive sanction) or withdrawing a privilege for bad behaviour (negative sanction). This process ensures children learn to participate in society before they enter institutions like school.',
                keywords: ['norms', 'values', 'socialisation', 'primary', 'sanctions', 'positive', 'negative', 'behaviour', 'family', 'children'],
                tip: 'Four marks = point + development + example + link back. Use sociological terms throughout.',
              },
              {
                marks: 6,
                question: 'Describe one difference between Functionalist and Feminist views of the family.',
                placeholder: 'Functionalists argue... Feminists argue... The key difference is...',
                modelAnswer: 'Functionalists, such as Talcott Parsons, argue that the family benefits all members of society equally — providing primary socialisation, emotional support and stability. The family is seen as a positive institution performing essential functions. By contrast, Feminists, such as Ann Oakley, argue the family can be a site of gender inequality. Oakley\'s research showed women perform the majority of domestic and emotional labour — unpaid and unrecognised — even when working full-time. The key difference is that Functionalists focus on what the family does for society, while Feminists focus on what the family does to women. Feminists argue the family maintains patriarchy by reinforcing traditional gender roles.',
                keywords: ['functionalist', 'feminist', 'parsons', 'oakley', 'domestic', 'labour', 'inequality', 'socialisation', 'gender', 'patriarchy', 'difference'],
                tip: 'Six marks = named sociologists from both sides, evidence, clear statement of the difference, and a final evaluative comment.',
              },
            ],
          },
        ],
      },

      // Screen 11 — Final Boss
      {
        label: 'Final Boss',
        kicker: 'Boss Fight',
        heading: 'Final Boss: What really makes a family?',
        sub: 'Four rounds. Everything from this module. No notes.',
        blocks: [
          {
            type: 'boss',
            rounds: [
              {
                label: 'Round 1 — Rapid Fire',
                emoji: '⚡',
                color: '#D96030',
                questions: [
                  { q: 'What is a beanpole family?', answer: 'Many generations alive simultaneously but few siblings at each level — a long, thin family structure caused by longer lifespans and declining birth rates.' },
                  { q: 'What is primary socialisation?', answer: 'The process through which children learn society\'s norms, values and behaviour — mainly through the family, in early childhood.' },
                  { q: 'Name one function of the family according to Parsons.', answer: 'Primary socialisation of children / stabilisation of adult personalities ("warm bath").' },
                  { q: 'What did Ann Oakley research?', answer: 'Domestic labour — showing women perform the majority of housework and childcare even when working full-time.' },
                  { q: 'What is a reconstituted family?', answer: 'A blended or step-family — formed when adults with children from previous relationships form a new family unit.' },
                  { q: 'What is emotional labour?', answer: 'The invisible work of managing family members\' emotions, relationships and wellbeing — largely performed by women and rarely recognised.' },
                ],
              },
              {
                label: 'Round 2 — Fix the Error',
                emoji: '🔧',
                color: '#8B6914',
                questions: [
                  {
                    q: '"A nuclear family includes grandparents living under the same roof."',
                    answer: 'Wrong. A nuclear family consists of two parents and their dependent children only. A household including grandparents would be an extended family.',
                  },
                  {
                    q: '"Functionalists argue the family mainly benefits women by reducing their domestic burden."',
                    answer: 'Wrong. Functionalists argue the family benefits ALL members of society equally. It is Feminists — not Functionalists — who argue women bear a disproportionate burden of domestic labour.',
                  },
                  {
                    q: '"A boomerang family has many generations alive at the same time but few siblings."',
                    answer: 'Wrong. This describes a beanpole family. A boomerang family describes adult children who leave home and then return — usually due to housing costs or financial pressures.',
                  },
                ],
              },
              {
                label: 'Round 3 — Scenario Analysis',
                emoji: '🔍',
                color: '#6B4E3D',
                questions: [
                  {
                    q: 'Two parents both work full-time. One still does most of the cooking, childcare, school admin and emotional support at home. Which sociological perspective would analyse this — and why?',
                    answer: 'A Feminist perspective. Feminists argue the family can be a site of gender inequality — with women performing a disproportionate share of domestic and emotional labour even when in full-time employment. Ann Oakley\'s research supports this. The scenario illustrates the "dual burden" — paid work plus unpaid domestic work.',
                  },
                  {
                    q: 'A sociologist observes that families teach children to accept authority, follow rules and work hard. A Functionalist and a Marxist are both interested in this finding — but reach opposite conclusions. What would each say?',
                    answer: 'Functionalist: teaching children to accept authority is a positive function — it prepares them for life in an ordered society and ensures social stability. Marxist: teaching children to accept authority primarily benefits capitalism — it creates a compliant workforce that accepts hierarchy and inequality without question.',
                  },
                ],
              },
              {
                label: 'Round 4 — Final Showdown',
                emoji: '👑',
                color: '#D96030',
                questions: [
                  {
                    q: 'What is the most important role of the family — emotional support, primary socialisation, social stability, or economic support? Choose one and defend your answer using evidence and sociological terminology.',
                    answer: 'No single correct answer. Strong responses: name a sociological perspective that supports the chosen function, reference a specific sociologist, explain HOW the function operates and acknowledge that other functions also have a claim.',
                  },
                ],
              },
            ],
          },
        ],
      },

    ],
  },

  // soc6
  {
    id: 'soc6',
    subject: 'Sociology',
    number: 6,
    title: 'Family Researchers & Theory Battles',
    subtitle: 'Who actually understands family life?',
    era: 'Core Theory',
    icon: '⚔️',
    color: '#D96030',
    colorLight: 'rgba(217,96,48,.12)',
    hook: {
      atmosphericOpener: {
        heading: 'EVERY SOCIOLOGIST THINKS YOUR FAMILY IS DIFFERENT.',
        sub: '…And they all think they\'re right.',
        cta: 'ENTER THE ARGUMENT',
      },
      statement: '"Family life today is now completely equal."',
      isTrue: false,
      accentWords: ['completely equal'],
      explanation: "Feminists, Marxists and the New Right all disagree on this. Research by Duncombe and Marsden, Oakley and others shows the division of labour in families is still far from equal.",
      wrongFeedback: 'Sociologists have been arguing about this for decades — the evidence suggests otherwise.',
      correctFeedback: 'Correct. Sociologists have been arguing about this for decades.',
      loadingText: 'Sociology has a lot to say about this...',
      bigQuestion: 'So whose version of family life is closest to reality?',
      revealHeader: 'Three researchers. Three very different answers.',
      revealItems: [
        { emoji: '🏛️', label: 'Parsons', detail: 'Believed families create social stability through clearly defined roles. Men provided financially; women provided emotional care.', color: '#D96030', bg: 'rgba(217,96,48,.08)' },
        { emoji: '🤝', label: 'Young & Willmott', detail: 'Argued family life became more equal — couples sharing tasks, decisions and domestic work in the symmetrical family.', color: '#D96030', bg: 'rgba(217,96,48,.08)' },
        { emoji: '👁️', label: 'Oakley', detail: 'Challenged this. Her research showed women still carried out the majority of domestic labour and emotional work, even in full-time employment.', color: '#D96030', bg: 'rgba(217,96,48,.08)' },
      ],
      punchline: 'Sociology is basically one long argument about who does the dishes.',
    },
    intro: {
      learningGoals: [
        'Explain Parsons\' functionalist view of family roles',
        'Define primary socialisation, expressive and instrumental roles',
        'Describe Young & Willmott\'s symmetrical family theory',
        'Evaluate Oakley\'s critique of domestic inequality',
        'Compare sociologist views on family equality',
        'Apply named sociologists confidently in exam answers',
      ],
    },
    outcomes: {
      intro: 'Behind every sociological claim is a method — and a debate about whether that method is actually trustworthy.',
      bullets: [
        'Describe the key sociological studies of family life',
        'Explain the difference between positivist and interpretivist research approaches',
        'See why researchers reach very different conclusions from the same data',
        'Evaluate the strengths and limitations of specific sociological studies',
      ],
    },

    recall: {
      questions: [
        { type: 'truefalse', question: 'Positivist sociologists prefer to work with quantitative data.', isTrue: true },
        { type: 'choice', question: 'Young and Willmott argued working-class families had...', options: ['Isolated nuclear units with few community ties', 'Strong extended family networks and mutual support', 'Mainly dysfunctional and conflictual relationships'], correct: 1 },
        { type: 'connection', question: 'Oakley\'s research challenged earlier studies because...', options: [
          { text: 'She used a much larger and more diverse sample', icon: 'people' },
          { text: 'She showed women still did most domestic work even when employed', icon: 'lightbulb' },
          { text: 'She proved the nuclear family was the ideal family form', icon: 'house' },
        ], correct: 1 },
      ],
    },
    screens: [

      // Screen 1 — The Three Sociologists
      {
        label: 'The Three Sociologists',
        kicker: 'Meet the Researchers',
        heading: 'Three Sociologists. Three Very Different Opinions.',
        sub: 'They all studied family life. They did not agree.',
        blocks: [
          {
            type: 'read',
            text: 'These three researchers spent careers studying family life — and reached very different conclusions. Understanding how they disagree is the whole point of this module.',
          },
          {
            type: 'flipcards',
            cards: [
              { icon: '🏛️', front: 'PARSONS', back: '"Families keep society stable. Everyone has a role — and it works."', color: '#D96030' },
              { icon: '🤝', front: 'YOUNG & WILLMOTT', back: '"Family life changed. Couples became more equal. We called it the symmetrical family."', color: '#C47828' },
              { icon: '👁️', front: 'OAKLEY', back: '"Equal? Really? Someone\'s still doing all the housework. And I think we both know who."', color: '#8B3A2A' },
            ],
          },
          {
            type: 'funfact',
            text: 'Somewhere in Britain right now somebody is saying: "I emptied the dishwasher yesterday." A Feminist sociologist is already writing this down.',
          },
        ],
      },

      // Screen 2 — Parsons: Primary Socialisation
      {
        label: 'Parsons',
        kicker: 'Talcott Parsons · Functionalism',
        heading: '"Families stop society falling apart."',
        sub: 'Parsons believed the family was doing essential work — quietly, constantly, invisibly.',
        headerImage: '/images/talcott-parsons.png',
        blocks: [
          {
            type: 'read',
            label: '🏛️ Talcott Parsons',
            text: 'Parsons looked at family life and concluded: without families, society would probably collapse. He believed families teach children how society works — what is acceptable, what is expected, how to behave. He called this <strong>primary socialisation</strong>.',
          },
          {
            type: 'keypoint',
            heading: 'Primary Socialisation',
            text: 'The process through which children first learn society\'s norms, values and expected behaviour — mostly from the family, before school or peers get involved.',
          },
          {
            type: 'flipcards',
            cards: [
              { icon: '🍽️', front: 'Manners', back: 'Please, thank you, queuing, not screaming at strangers. The basics. Parsons thought this was society-level stuff.', color: '#D96030' },
              { icon: '📏', front: 'Rules', back: 'Learning what is and isn\'t acceptable behaviour — so society can function without constant conflict.', color: '#C47828' },
              { icon: '🧠', front: 'Behaviour', back: 'Acting in ways that match social expectations. Parsons believed this started in the family, long before school.', color: '#D96030' },
              { icon: '🎖️', front: 'Respect', back: 'Recognising authority, hierarchy and other people\'s roles. The family is where this is first learned.', color: '#C47828' },
            ],
          },
          {
            type: 'examtip',
            tip: '<strong>Primary socialisation</strong> = learning norms and values from the family. The exam loves this phrase. Use it — and say <em>why</em> it matters: it creates social stability and prepares children for life in wider society.\n\n<em>Also known as: "Parents repeatedly telling you to stop licking supermarket trolleys."</em>',
          },
        ],
      },

      // Screen 3 — Parsons: The Roles
      {
        label: 'Parsons — The Roles',
        kicker: 'Talcott Parsons · Role Theory',
        heading: '"Everyone had a role. It worked."',
        sub: 'Parsons believed traditional family structures were functional — not unfair.',
        blocks: [
          {
            type: 'read',
            label: '⚖️ The Division',
            text: 'Parsons argued traditional families were stable because adults had different — but complementary — responsibilities. He identified two key roles.',
          },
          {
            type: 'keypoint',
            heading: 'Instrumental Role',
            text: 'The breadwinner role — focused on financial provision. Parsons associated this with men. Goal: keep the family economically stable.',
          },
          {
            type: 'keypoint',
            heading: 'Expressive Role',
            text: 'The emotional care role — providing warmth, support and stability. Parsons associated this with women. Goal: keep the family emotionally stable.',
          },
          {
            type: 'colsort',
            question: 'Sort these responsibilities into Parsons\' two roles.',
            columns: [
              { label: 'INSTRUMENTAL ROLE\nMoney & provision', color: '#C47828', bg: 'rgba(196,120,40,.07)' },
              { label: 'EXPRESSIVE ROLE\nEmotional care', color: '#D96030', bg: 'rgba(217,96,48,.07)' },
            ],
            items: [
              { label: 'Earning a wage', col: 0, explanation: 'The classic instrumental role — financial provision for the family.' },
              { label: 'Comforting a sick child', col: 1, explanation: 'Emotional care — the expressive role in action.' },
              { label: 'Paying rent and bills', col: 0, explanation: 'Economic stability — instrumental role.' },
              { label: 'Creating warmth and security at home', col: 1, explanation: 'The emotional environment of the family — expressive role.' },
              { label: 'Going out to work full-time', col: 0, explanation: 'Financial provision — instrumental.' },
              { label: 'Providing emotional support to family members', col: 1, explanation: 'Emotional labour — expressive role.' },
            ],
            explanation: 'Parsons saw these roles as complementary — each person specialising so the family unit functions effectively as a whole.',
          },
          {
            type: 'funfact',
            text: '**Adult:** "I had a terrible day."\n**Family:** "We made garlic bread."\n\nFunctionalists would argue this *is* the expressive role working correctly. Emotional comfort, delivered warm.',
          },
        ],
      },

      // Screen 4 — Young & Willmott: Symmetrical Family
      {
        label: 'Young & Willmott',
        kicker: 'Young & Willmott · 1973',
        heading: '"Families are changing. Finally."',
        sub: 'Young & Willmott thought Parsons\' world was already becoming history.',
        headerImage: '/images/young-willmott.png',
        blocks: [
          {
            type: 'read',
            label: '🤝 The Symmetrical Argument',
            text: 'Young and Willmott studied family life in the 1970s and argued something significant had shifted. Modern couples, they found, were <strong>sharing tasks more equally</strong> — spending more time together, making joint decisions, dividing housework and childcare more fairly.',
          },
          {
            type: 'keypoint',
            heading: 'Symmetrical Family',
            text: 'A family where domestic roles are shared more equally between partners — both may work, both contribute to housework and childcare. Young & Willmott argued this was the direction modern families were heading.',
          },
          {
            type: 'appliedscenario',
            scenario: 'Both adults in a household work full-time. They take turns cooking. Both attend parents\' evenings. They decide major purchases together.',
            question: 'Which sociologist would use this as evidence for their theory?',
            options: [
              { text: 'Young & Willmott — this is the symmetrical family.', correct: true },
              { text: 'Parsons — instrumental and expressive roles are both being fulfilled.', correct: false },
              { text: 'Oakley — this proves domestic inequality still exists.', correct: false },
            ],
            explanation: 'Young & Willmott would point to shared decision-making and joint task division as evidence of the symmetrical family emerging.',
          },
          {
            type: 'examtip',
            tip: '<strong>Symmetrical family</strong> = roles shared more equally. Young & Willmott (1973) argued this was the direction of change.\n\n<em>Basically: "Dad finally discovered the dishwasher."</em>\n\nBUT — Oakley fundamentally challenged this view. You\'ll meet her next.',
          },
        ],
      },

      // Screen 5 — Quick Retrieval
      {
        label: 'Quick Retrieval',
        kicker: 'Who Said It?',
        heading: 'Rapid Fire — Match the Researcher',
        sub: 'Three sociologists. Which one said what?',
        blocks: [
          {
            type: 'tieredquiz',
            rounds: [
              {
                label: 'Round 1 — Identify the Researcher',
                questions: [
                  {
                    q: '"Families create stability. Society needs them to function properly."',
                    options: ['Parsons', 'Oakley', 'Marx'],
                    correct: 0,
                    explanation: 'Parsons was a Functionalist who believed families were essential to social stability — providing primary socialisation and complementary roles.',
                  },
                  {
                    q: '"Family roles became more equal over time — we call this the symmetrical family."',
                    options: ['Young & Willmott', 'Parsons', 'Durkheim'],
                    correct: 0,
                    explanation: 'Young & Willmott\'s 1973 research coined the term "symmetrical family" to describe increasing equality in domestic roles.',
                  },
                  {
                    q: '"Women still perform the majority of domestic labour, even when working full-time."',
                    options: ['Oakley', 'Parsons', 'Weber'],
                    correct: 0,
                    explanation: 'Ann Oakley\'s feminist research directly challenged claims of equality — showing persistent domestic inequality in modern households.',
                  },
                  {
                    q: 'Which sociologist identified the instrumental and expressive roles?',
                    options: ['Parsons', 'Young & Willmott', 'Oakley'],
                    correct: 0,
                    explanation: 'Parsons developed the instrumental/expressive role distinction as part of his Functionalist theory of the family.',
                  },
                  {
                    q: 'Which researcher\'s work challenged the idea that family life had become fully equal?',
                    options: ['Oakley', 'Young & Willmott', 'Parsons'],
                    correct: 0,
                    explanation: 'Oakley\'s research showed that the symmetrical family was overstated — women still carried a disproportionate share of domestic and emotional labour.',
                  },
                ],
              },
            ],
          },
        ],
      },

      // Screen 6 — Oakley: Not So Equal
      {
        label: 'Oakley',
        kicker: 'Ann Oakley · Feminism',
        heading: '"Equal? Not exactly."',
        sub: 'Oakley looked at the same evidence and drew very different conclusions.',
        headerImage: '/images/ann-oakley.png',
        blocks: [
          {
            type: 'read',
            label: '👁️ Ann Oakley',
            text: 'Oakley looked at the evidence for the symmetrical family — and was unconvinced. Her research showed that even in modern households, women still carried out the majority of <strong>housework, childcare and emotional labour</strong>, often on top of full-time paid work.',
          },
          {
            type: 'keypoint',
            heading: 'Domestic Division of Labour',
            text: 'How household tasks are divided between people. Oakley\'s research showed this division remained unequal — women doing significantly more unpaid domestic work than men.',
          },
          {
            type: 'keypoint',
            heading: 'Patriarchy',
            text: 'A social system where men hold more power and authority. Oakley argued the family can reproduce patriarchy by reinforcing traditional gender roles — even when this is subtle or unspoken.',
          },
          {
            type: 'read',
            label: '🔍 Oakley\'s Challenge',
            text: 'Oakley basically asked one devastating question: <em>"If family life is equal now… why is one person still mentally tracking every birthday, every dentist appointment, every PE kit, every school email, every emotional need in the household?"</em><br><br>This invisible work — <strong>emotional labour</strong> — rarely gets counted in surveys about chores. Oakley argued it should.',
          },
          {
            type: 'examtip',
            tip: 'When evaluating Young & Willmott in an exam, use Oakley as your criticism:\n\n<em>"However, Oakley criticised this view, arguing that women still carried out a disproportionate share of the domestic division of labour — particularly emotional labour — even when in full-time employment."</em>\n\nThat\'s a named sociologist + named concept + clear evaluation. Examiners love it.',
          },
        ],
      },

      // Screen 7 — The Argument (satire reading)
      {
        label: 'The Argument',
        kicker: 'Sociology Meets Real Life',
        heading: 'This Is What The Research Actually Looks Like.',
        sub: 'Somewhere between the studies and the stats, actual humans are having this conversation.',
        blocks: [
          {
            type: 'read',
            label: '📢 Panel 1',
            text: '"We totally split the chores equally," said the man, proudly.',
          },
          {
            type: 'read',
            label: '📢 Panel 2',
            text: 'The woman was simultaneously: holding a toddler, answering a school email, mentally tracking that there was no milk, remembering it was PE tomorrow and planning three people\'s meals for the week.',
          },
          {
            type: 'read',
            label: '📢 Panel 3',
            text: '"I loaded one plate into the dishwasher," he added.',
          },
          {
            type: 'funfact',
            text: '<strong>Oakley would like a word.</strong>\n\nThis is what sociologists call the <em>invisibility of emotional labour</em> — the mental load of managing a household rarely shows up in surveys asking "who does the chores?"',
          },
          {
            type: 'quiz',
            question: 'What concept does Oakley use to describe the invisible work of managing a household\'s emotional needs?',
            options: [
              { text: 'Emotional labour', correct: true },
              { text: 'Expressive role', correct: false },
              { text: 'Symmetrical burden', correct: false },
              { text: 'Domestic symmetry', correct: false },
            ],
            explanation: 'Emotional labour — the work of managing feelings, relationships and needs within a household. Oakley argued this was systematically undervalued and predominantly performed by women.',
          },
        ],
      },

      // Screen 8 — Theory Battle
      {
        label: 'Theory Battle',
        kicker: 'Perspectives Collide',
        heading: 'Who would agree — "Modern family life is now equal"?',
        sub: 'Three sociologists. Three different verdicts.',
        blocks: [
          {
            type: 'appliedscenario',
            scenario: '"Modern family life is now fully equal — both partners share all responsibilities."',
            question: 'Young & Willmott would…',
            options: [
              { text: 'Agree — this matches their symmetrical family argument.', correct: true },
              { text: 'Disagree — they never claimed families were fully equal.', correct: false },
              { text: 'Partly agree — they thought equality was possible in theory.', correct: false },
            ],
            explanation: 'Young & Willmott\'s research directly supports this view. They argued the symmetrical family represented a major shift toward equality.',
          },
          {
            type: 'appliedscenario',
            scenario: '"Modern family life is now fully equal — both partners share all responsibilities."',
            question: 'Oakley would…',
            options: [
              { text: 'Disagree — women still carry a disproportionate domestic burden.', correct: true },
              { text: 'Agree — equality has been largely achieved.', correct: false },
              { text: 'Partly agree — but only for middle-class families.', correct: false },
            ],
            explanation: 'Oakley\'s entire research challenge was that equality was overstated. Women still did more housework, childcare and emotional labour — even in dual-income households.',
          },
          {
            type: 'appliedscenario',
            scenario: '"Modern family life is now fully equal — both partners share all responsibilities."',
            question: 'Parsons would…',
            options: [
              { text: 'Partly agree — but argue role specialisation still serves a function.', correct: true },
              { text: 'Fully agree — equality was always the goal.', correct: false },
              { text: 'Disagree — he wanted strict traditional roles maintained.', correct: false },
            ],
            explanation: 'Parsons thought role specialisation was functional — not necessarily about equality. He might acknowledge change, but argue distinct roles still serve a purpose.',
          },
          {
            type: 'funfact',
            text: 'Sociology gets interesting precisely when researchers disagree. The debate between Young & Willmott and Oakley is still running — updated every time someone says "I did the shopping <em>and</em> the school run <em>and</em> remembered everyone\'s packed lunch."',
          },
        ],
      },

      // Screen 9 — Fill the Gaps
      {
        label: 'Fill the Gaps',
        kicker: 'Key Concept Check',
        heading: 'Complete the sentences using the correct sociological terms.',
        sub: 'All distractors are real sociology vocabulary. Think carefully.',
        blocks: [
          {
            type: 'fillblanks',
            sentences: [
              {
                before: 'Parsons believed families create social',
                after: 'by teaching shared norms and values.',
                answer: 'stability',
                hints: ['The word means things stay ordered and predictable.', 'Parsons thought society needed this — starts with "s."'],
              },
              {
                before: 'Young & Willmott argued modern families had become more',
                after: '— sharing tasks and decisions equally.',
                answer: 'symmetrical',
                hints: ['Both sides are balanced — like a mirror image.', 'Starts with "s." Young & Willmott\'s key term.'],
              },
              {
                before: 'Oakley criticised the unequal domestic division of',
                after: '— arguing women still did far more unpaid work.',
                answer: 'labour',
                hints: ['The word for work and effort.', 'Domestic division of _____.'],
              },
              {
                before: 'Parsons believed women typically performed the',
                after: 'role — providing emotional care and support.',
                answer: 'expressive',
                hints: ['It\'s about expressing feelings and care.', 'The opposite of the instrumental role.'],
              },
              {
                before: 'Learning norms and values from the family is called primary',
                after: '.',
                answer: 'socialisation',
                hints: ['The process of learning how society works.', 'Primary _____. Happens in the family first.'],
              },
            ],
            wordBank: ['stability', 'symmetrical', 'labour', 'expressive', 'socialisation', 'patriarchy', 'capitalism', 'instrumental', 'isolated', 'deviant', 'stratification'],
          },
        ],
      },

      // Screen 10 — Exam Skills
      {
        label: 'Exam Skills',
        kicker: 'Level Up',
        heading: 'How to Sound Like a Sociologist in Exams',
        sub: 'Same knowledge. Very different marks.',
        blocks: [
          {
            type: 'read',
            label: '📉 The Weak Version',
            text: '"Some sociologists think families are equal and some don\'t."',
          },
          {
            type: 'read',
            label: '📈 Better — Named Sociologist',
            text: 'Young and Willmott argued modern families became more <strong>symmetrical</strong> — with roles shared more equally between partners.',
          },
          {
            type: 'read',
            label: '🏆 Strongest — Named + Evaluated',
            text: 'Young and Willmott argued modern families became more symmetrical. However, Oakley challenged this, arguing women still perform a disproportionate share of the <strong>domestic division of labour</strong> — particularly <strong>emotional labour</strong> — even when in full-time employment.',
          },
          {
            type: 'examtip',
            tip: '<strong>The formula examiners reward:</strong>\n\n1. <strong>Named sociologist</strong> → what they argued\n2. <strong>Key concept</strong> → used precisely\n3. <strong>Another named sociologist</strong> → challenge or comparison\n\nYou can apply this to literally any 4-mark or 6-mark Sociology question on family.',
          },
          {
            type: 'flashcards',
            cards: [
              { front: 'Parsons', back: 'Functionalist. Instrumental/expressive roles. Primary socialisation. Family = social stability.' },
              { front: 'Young & Willmott', back: '1973 study. Symmetrical family. Argued roles were becoming more equal.' },
              { front: 'Oakley', back: 'Feminist. Challenged equality claim. Domestic division of labour. Emotional labour. Patriarchy.' },
              { front: 'Symmetrical family', back: 'Young & Willmott\'s concept — shared domestic roles, joint decision-making, greater equality.' },
              { front: 'Domestic division of labour', back: 'Oakley\'s focus — who does the housework, childcare and emotional work.' },
              { front: 'Primary socialisation', back: 'Parsons\' concept — learning norms and values from family, before school or peers.' },
            ],
          },
        ],
      },

      // Screen 11 — GCSE Practice
      {
        label: 'GCSE Practice',
        kicker: 'Exam Questions',
        heading: 'Three questions. Real marks. Real feedback.',
        sub: 'Use named sociologists and key terminology in every answer.',
        blocks: [
          {
            type: 'boss',
            tier: '🟢',
            label: '2-Mark Question',
            question: 'Describe two features of a symmetrical family.',
            markPoints: `- Both partners share domestic tasks and housework more equally
- Both partners are likely to be in paid employment
- Joint decision-making between partners
- Named researcher Young & Willmott correctly linked
- Contrast with traditional unequal family roles noted`,
          },
          {
            type: 'boss',
            tier: '🟡',
            label: '4-Mark Question',
            question: 'Explain one criticism Oakley made of the view that modern family life has become equal.',
            markPoints: `- Identifies Oakley correctly as a Feminist sociologist
- States that Oakley argued women still perform more domestic labour
- References the domestic division of labour as unequal
- Mentions emotional labour or invisible unpaid work
- Challenges Young & Willmott's symmetrical family claim
- Provides specific evidence or example of ongoing inequality`,
          },
          {
            type: 'boss',
            tier: '🔴',
            label: '6-Mark Question',
            question: 'Describe one difference between Parsons\' and Oakley\'s views of family roles. [6 marks]',
            markPoints: `- Names Parsons as a Functionalist and states his view — instrumental/expressive roles or primary socialisation
- Names Oakley as a Feminist and states her view — unequal domestic division of labour / patriarchy
- Clearly identifies a specific difference between the two views
- Uses sociological terminology throughout (at least 2 key terms)
- Provides development or evidence for each sociologist's position
- Evaluative comment or connection to broader sociological debate`,
          },
        ],
      },

      // Screen 12 — Final Boss
      {
        label: 'Final Boss',
        kicker: 'Boss Fight',
        heading: 'Final Boss: Are families really equal now?',
        sub: 'Four rounds. Everything from this module. Split-screen showdown — Parsons vs Oakley.',
        blocks: [
          {
            type: 'boss',
            rounds: [
              {
                label: 'Round 1 — Rapid Fire',
                emoji: '⚡',
                color: '#D96030',
                questions: [
                  { q: 'What is the expressive role?', answer: 'The emotional care role in the family — providing warmth, support and stability. Parsons associated this with women.' },
                  { q: 'What is the symmetrical family?', answer: 'Young & Willmott\'s concept — a family where domestic roles are shared more equally between partners, both working and contributing to housework/childcare.' },
                  { q: 'What does patriarchy mean?', answer: 'A social system where men hold more power and authority. Oakley argued the family can reproduce patriarchy by reinforcing traditional gender roles.' },
                  { q: 'What did Oakley mean by domestic division of labour?', answer: 'How household tasks are divided. Oakley\'s research showed women still performed the majority of domestic work and emotional labour, even in full-time employment.' },
                  { q: 'What is primary socialisation?', answer: 'The process through which children first learn society\'s norms, values and expected behaviour — from the family, before school or peers.' },
                ],
              },
              {
                label: 'Round 2 — Fix the Error',
                emoji: '🔧',
                color: '#8B6914',
                questions: [
                  {
                    q: '"Oakley believed family roles had become fully equal and women were no longer disadvantaged."',
                    answer: 'Wrong. Oakley\'s entire argument was the opposite — she challenged the claim that equality had been achieved. Her research showed women still performed the majority of domestic labour and emotional work.',
                  },
                  {
                    q: '"Young & Willmott\'s symmetrical family means both partners do exactly 50% of all tasks."',
                    answer: 'Not quite. The symmetrical family describes a more equal sharing of roles and tasks — a shift from rigid traditional divisions. It doesn\'t mean perfectly identical contributions, but a greater balance than before.',
                  },
                  {
                    q: '"Parsons\' instrumental role means providing emotional support to the family."',
                    answer: 'Wrong. The instrumental role is about financial provision — earning money and ensuring economic stability. The expressive role is about emotional care.',
                  },
                ],
              },
              {
                label: 'Round 3 — Build the Argument',
                emoji: '🔍',
                color: '#6B4E3D',
                questions: [
                  {
                    q: 'A sociologist interviews 200 couples and finds women still do 70% of childcare and housework, even when both work full-time. Which sociologist predicted this — and which sociologist would be most challenged by it?',
                    answer: 'Oakley predicted this — her research showed persistent domestic inequality despite women entering the workforce. Young & Willmott would be most challenged, as it undermines their symmetrical family claim.',
                  },
                  {
                    q: 'A student writes: "Families are important." A sociology examiner marks this as insufficient. What should they write instead?',
                    answer: 'Should include: a named sociologist (e.g. Parsons), their specific argument (e.g. families provide primary socialisation and social stability), and a key concept (e.g. instrumental/expressive roles, domestic division of labour, symmetrical family).',
                  },
                ],
              },
              {
                label: 'Round 4 — Final Showdown',
                emoji: '👑',
                color: '#D96030',
                questions: [
                  {
                    q: 'Parsons or Oakley — whose view of family life is more convincing today? Argue your case using named evidence, sociological concepts, and at least one direct comparison between the two.',
                    answer: 'No single correct answer. Strong responses: clearly state which sociologist and why; use at least two key concepts accurately; reference specific research (Oakley\'s domestic labour findings / Parsons\' role theory); acknowledge the counterargument before rejecting or qualifying it; connect to contemporary evidence if possible.',
                  },
                ],
              },
            ],
          },
        ],
      },

    ],
  },
]

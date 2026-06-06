// ─── Full module content extracted from the 5 HTML modules ───────────────────
// Each module has: id, title, era, icon, color, screens[]
// Each screen has: label, kicker, heading, content (array of blocks)
// Block types: read, keypoint, quiz (mc), funfact, examtip, timeline, sort, reveal, flashcards

export const MODULES = [
  {
    id: 'history-medicine-medieval-beliefs-causes',
    subject: 'History',
    number: 1,
    title: 'Trust me, I\'m Following Jupiter',
    subtitle: 'Medieval Medicine: Beliefs and Causes of Disease',
    era: 'c.1250–c.1500',
    icon: '⚕️',
    color: '#F5B700',
    colorLight: '#f5e6d3',
    headerImage: '/headers/history-medicine-through-time.webp',

    hook: {
      statement: 'Medieval doctors removed blood to cure illness.',
      isTrue: true,
      accentWords: ['removed blood', 'cure illness'],
      backgroundImage: '/headers/history-medicine-bloodletting.png',
      explanation: 'True. Which is alarming, obviously. But to medieval doctors, bloodletting was not random cruelty. They believed illness happened when the body fell out of balance. So if they thought you had too much blood? They tried to remove some.',
      revealBeats: [
        'Which is alarming, obviously.',
        "But medieval doctors weren't being random.",
        'They believed illness happened when the body fell out of balance.',
        'So if they thought you had too much blood?',
        'They tried to remove some.',
      ],
    },

    outcomes: {
      bullets: [
        { text: 'Why removing blood seemed sensible',                icon: 'drop'     },
        { text: 'Why doctors checked the stars',                     icon: 'star'     },
        { text: 'Why praying was considered medicine',               icon: 'prayer'   },
        { text: 'Why intelligent people believed things that weren\'t true', icon: 'question' },
      ],
    },

    screens: [

      {
        type: 'visualNarrative',
        stage: 'Intro',
        label: 'Ancient Authorities',
        beats: [
          {
            image: '/figures/history/medicine/medieval/ancient-authorities-back-to-back.webp',
            label: 'ANCIENT AUTHORITIES',
            headline: 'Two dead Greeks ran medieval medicine.',
            body: 'When medieval doctors wanted answers, they looked to two men who had been dead for centuries.',
          },
          {
            image: '/figures/history/medicine/medieval/ancient-authorities-timeline.webp',
            imageOpacity: 1,
            facts: [
              'Medieval doctors learned medicine from ancient Greek and Roman writers.',
              'Especially Hippocrates and Galen.',
              'The Church copied and taught their books across Europe.',
              'Their ideas shaped medicine for over 1,000 years.',
            ],
            conclusion: "Doctors couldn't see germs.\n\nSo who else were they supposed to trust?",
          },
        ],
      },

      {
        type: 'conceptReveal',
        stage: 'Hippocrates',
        label: 'The Germ Problem',
        steps: [
          {
            eyebrow: 'What we know now',
            mainText: 'Today, we know many diseases are caused by bacteria or viruses.',
            supportText: 'Medieval people did not. No microscopes. No germ theory. No idea that tiny organisms could spread disease.',
            backgroundImage: '/figures/history/medicine/medieval/medieval-street.webp',
          },
          {
            mainText: 'But people still got sick.',
            supportText: 'So they needed explanations.',
            backgroundImage: '/figures/history/medicine/medieval/medieval-street.webp',
          },
        ],
      },

      {
        type: 'conceptReveal',
        stage: 'Hippocrates',
        label: 'The search for answers',
        steps: [
          {
            eyebrow: 'Enter Hippocrates',
            mainText: 'One Greek doctor thought he had found one.',
            backgroundImage: '/headers/history-medicine-germ-bridge.png',
          },
          {
            mainText: 'His name was Hippocrates.',
            supportText: 'One Greek doctor would shape medicine for the next 2,000 years.',
            backgroundImage: '/headers/history-medicine-germ-bridge.png',
          },
        ],
      },

      {
        type: 'keyFigureReveal',
        stage: 'Hippocrates',
        tag: 'four-humours',
        label: 'Hippocrates',
        portrait: '/figures/history/medicine/medieval/hippocrates-portrait.webp',
        name: 'Hippocrates',
        role: 'Ancient Greek doctor',
        sections: [
          {
            title: 'Who was he?',
            icon: 'ancient-figure',
            lines: [
              'One of the first doctors to argue that illness had natural causes rather than punishment from the gods.',
            ],
          },
          {
            title: 'Four humours',
            icon: 'medicine',
            lines: [
              'Hippocrates believed the body contained four humours:',
              'Blood · Phlegm · Yellow Bile · Black Bile',
              'Illness happened when these became unbalanced.',
            ],
          },
          {
            title: 'Observation',
            icon: 'knowledge',
            lines: [
              'Hippocrates believed doctors should observe symptoms carefully, examine patients closely, and keep records.',
              'He encouraged reasoning rather than magic or superstition.',
            ],
          },
          {
            title: 'Influence',
            icon: 'legacy',
            lines: [
              "His Four Humours theory was developed by Galen and remained influential for over 1,500 years.",
            ],
          },
        ],
      },

      {
        type: 'conceptReveal',
        stage: 'Hippocrates',
        label: 'The Four Humours',
        steps: [
          {
            eyebrow: 'The most important medieval idea',
            mainText: 'The Theory of the Four Humours.',
          },
          {
            mainText: 'Doctors believed the body contained four important fluids.',
            microPoints: ['Blood', 'Phlegm', 'Yellow bile', 'Black bile'],
          },
          {
            eyebrow: 'The logic',
            mainText: 'If these humours were balanced, you were healthy.',
          },
          {
            mainText: 'If they became unbalanced, you became ill.',
            supportText: 'Simple idea. Huge consequences.',
          },
        ],
      },

      {
        type: 'interactiveImage',
        stage: 'Hippocrates',
        id: 'four-humours-hotspot',
        label: 'Explore the Humours',
        title: 'Tap the Four Humours',
        introText: 'Medieval doctors believed the body contained four vital fluids. Each humour had its own qualities — and its own associated illness when it went out of balance.',
        image: '/figures/history/medicine/medieval/four-humours-body.webp',
        imageAlt: 'Medieval symbolic body diagram showing the positions of the Four Humours',
        ctaLabel: 'Explore the body',
        hotspots: [
          {
            id: 'blood', x: 18, y: 18,
            shortLabel: 'Blood', title: 'Blood', icon: '🩸',
            description: 'Linked with warmth, energy and a cheerful personality. Too much blood could be blamed for fever or a red face.',
            extraFact: 'If a physician diagnosed excess blood, they would use bloodletting — cutting a vein or applying leeches — to "restore balance."',
          },
          {
            id: 'phlegm', x: 82, y: 18,
            shortLabel: 'Phlegm', title: 'Phlegm', icon: '💧',
            description: 'Linked with coldness and calmness. Too much phlegm could be linked to coughs, colds and sluggishness.',
            extraFact: 'The word "phlegmatic" — meaning calm and unemotional — comes directly from this humour.',
          },
          {
            id: 'yellow_bile', x: 18, y: 82,
            shortLabel: 'Yellow Bile', title: 'Yellow Bile', icon: '🔥',
            description: 'Linked with heat and anger. Too much yellow bile could be blamed for fever or vomiting sickness.',
            extraFact: 'Someone described as "bilious" — irritable or short-tempered — is still using this ancient medical vocabulary today.',
          },
          {
            id: 'black_bile', x: 82, y: 82,
            shortLabel: 'Black Bile', title: 'Black Bile', icon: '🌙',
            description: 'Linked with sadness and melancholy. Too much black bile could be blamed for low mood or a wasting illness.',
            extraFact: 'The word "melancholy" comes from the Greek for "black bile." Medieval doctors thought depression was literally a bodily fluid problem.',
          },
        ],
      },

      {
        type: 'quickRecall',
        stage: 'Hippocrates',
        label: 'Hippocrates — quick check',
        questions: [
          {
            type: 'choice',
            question: 'What did Hippocrates believe caused illness?',
            options: ['Angry gods', 'Natural causes', 'Evil spirits', 'Witchcraft'],
            correct: 1,
            hint: 'Think about what made Hippocrates different from many people of his time.',
          },
          {
            type: 'choice',
            question: 'According to Hippocrates, illness happened when...',
            options: ['The gods were unhappy', 'The body lost too much blood', 'The Four Humours became unbalanced', 'Bad smells entered the body'],
            correct: 2,
            hint: 'Remember the four fluids you just explored.',
          },
          {
            type: 'choice',
            question: 'Why did Hippocrates create the Four Humours theory?',
            options: ['He could see germs causing disease', 'He wanted to explain why people became ill', 'The Church ordered him to create it', 'He copied it from Galen'],
            correct: 1,
            hint: "Think about the problem Hippocrates was trying to solve. If doctors couldn't see germs, what were they looking for instead?",
          },
        ],
      },

      {
        type: 'keyFigureReveal',
        stage: 'Galen',
        tag: 'galen',
        label: 'Galen',
        portrait: '/figures/history/medicine/medieval/galen-portrait.webp',
        name: 'Galen',
        role: 'Roman doctor and writer',
        significance: 'The doctor whose ideas dominated medicine for over 1,400 years.',
        sections: [
          {
            title: 'Gladiators & dissection',
            icon: 'war-conflict',
            lines: [
              'Galen spent years patching up wounded gladiators — giving him direct, hands-on experience of the human body.',
              'He also dissected animals extensively to study anatomy.',
              'This practical knowledge set him apart from most physicians of his time.',
            ],
          },
          {
            title: 'Four humours & Theory of Opposites',
            icon: 'bloodletting',
            lines: [
              "Galen promoted Hippocrates' Four Humours — Blood, Phlegm, Yellow Bile, Black Bile — and added his own contribution.",
              'He argued illness should be treated with its opposite: hot illness → cold remedy. Wet illness → dry remedy.',
              'This became known as the Theory of Opposites.',
            ],
          },
          {
            title: 'The squealing pig',
            icon: 'science',
            lines: [
              'Galen wanted to prove the brain — not the heart — controlled the body.',
              'He performed a public demonstration, cutting the vocal cord nerves of a squealing pig mid-cry.',
              'The pig fell instantly silent. The crowd was stunned. Galen\'s reputation was made.',
            ],
          },
          {
            title: 'Influence & limitations',
            icon: 'legacy',
            lines: [
              'Doctors followed his ideas for over 1,400 years.',
              'Some ideas were wrong because he studied animals, not humans.',
            ],
          },
        ],
      },

      {
        type: 'theoryLab',
        stage: 'Galen',
        label: 'Think Like Galen',

        title: 'Think Like Galen',

        theory: {
          heading: 'Theory of Opposites',
          tagline: 'If a patient seemed too hot, physicians tried to cool them down.',
          explanation: "Galen believed illness happened when the body became unbalanced.\n\nTo restore balance, treat the illness using the opposite quality.",
          grid: [
            { left: 'HOT', right: 'COLD' },
            { left: 'WET', right: 'DRY' },
          ],
        },

        scenario: {
          title: 'A Patient Arrives',
          image: '/figures/history/medicine/medieval/patient-arrives.png',
          symptoms: ['FEVER', 'RED FACE', 'SWEATING'],
          question: 'Which qualities dominate?',
          options: [
            { label: 'HOT + WET', correct: true },
            { label: 'HOT + DRY', correct: false },
            { label: 'COLD + WET', correct: false },
            { label: 'COLD + DRY', correct: false },
          ],
        },

        outcome: {
          diagnosis: 'HOT + WET',
          lines: ['Too much heat.', 'Too much moisture.'],
        },

        prescription: {
          question: 'What would Galen prescribe?',
          options: [
            { label: 'Cucumber',   correct: true,  image: '/figures/history/medicine/medieval/treatments/cucumber.png' },
            { label: 'Cold water', correct: true,  image: '/figures/history/medicine/medieval/treatments/cold-water.png' },
            { label: 'Dry bread',  correct: true,  image: '/figures/history/medicine/medieval/treatments/dry-bread.png' },
            { label: 'Salt',       correct: true,  image: '/figures/history/medicine/medieval/treatments/salt.png' },
            { label: 'Hot soup',   correct: false, image: '/figures/history/medicine/medieval/treatments/hot-soup.png' },
            { label: 'Warm wine',  correct: false, image: '/figures/history/medicine/medieval/treatments/warm-wine.png' },
          ],
          reveal: 'Galen treats illness with opposite qualities.',
        },

        evaluation: {
          transformation: { from: 'HOT + WET', to: 'COLD + DRY', result: 'BALANCE' },
          worked: ['Rest', 'Fluids', 'Cooling foods'],
          limitation: 'Disease is not caused by Four Humours.',
          verdict: "Some treatments accidentally helped patients recover, making Galen's theory seem trustworthy even though the explanation was wrong.",
          church: {
            image: '/figures/history/medicine/medieval/priest.png',
            heading: 'Supported by the Church',
            body: "Christians believed God created a perfect and balanced body. This matched Galen's ideas — so the Church preserved and promoted his work for centuries.",
          },
          significance: "This helped Galen's ideas remain influential for over 1,000 years.",
        },
      },

      {
        type: 'quickRecall',
        stage: 'Galen',
        label: 'Retrieval',
        questions: [
          {
            type: 'choice',
            question: 'What did the Theory of Opposites say about treatment?',
            options: ['Treat with something similar', 'Treat with something opposite', 'Wait for God to heal', 'Observe and do nothing'],
            correct: 1,
            explanation: "Galen's Theory of Opposites said treatments should oppose the cause — e.g. if there was too much blood, remove blood.",
          },
          {
            type: 'choice',
            question: 'How did religion explain why illness happened?',
            options: ['God sent illness as punishment or a test', 'Bad air caused all disease', 'The stars caused illness', 'Ancient books caused illness'],
            correct: 0,
            explanation: 'Medieval people believed illness could be punishment from God or a test of faith.',
          },
          {
            type: 'choice',
            question: "Why did Galen's ideas stay influential for so long?",
            options: ['The Church supported and promoted them', 'He had a laboratory', 'He used microscopes', 'He invented surgery'],
            correct: 0,
            explanation: "The Church preserved Galen's books and taught his ideas in universities, giving them institutional backing.",
          },
        ],
      },

      {
        type: 'visualLearning',
        stage: 'Medieval treatments',
        label: 'England, 1250',
        scenes: [
          {
            image: '/figures/history/medicine/medieval/vl-medieval-town.webp',
            headline: 'England, 1250',
            body: 'The ideas of Hippocrates and Galen had already existed for over 1,000 years.',
          },
          {
            image: '/figures/history/medicine/medieval/vl-church.webp',
            headline: 'The Church was everywhere',
            body: 'Almost everyone attended church. The Church shaped how people understood the world.',
          },
          {
            image: '/figures/history/medicine/medieval/vl-monks-books.webp',
            headline: 'Knowledge moved slowly',
            body: 'Books had to be copied by hand, often by monks. A single manuscript could take months to create.',
          },
          {
            image: '/figures/history/medicine/medieval/vl-university.webp',
            headline: 'Doctors learnt from books',
            body: 'Universities taught accepted medical ideas. Ancient writers like Galen were treated as authorities.',
          },
          {
            image: '/figures/history/medicine/medieval/vl-dissection.webp',
            headline: 'Testing ideas was difficult',
            body: 'Human dissection was rare and considered a sin by the Church. Doctors had few ways to challenge old beliefs.',
          },
          {
            finalReveal: true,
            headline: 'If everyone learns the same ideas…',
            body: '…those ideas can survive for centuries.',
          },
        ],
      },

      {
        type: 'guidedChoiceCarousel',
        stage: 'Medieval treatments',
        id: 'healer-carousel',
        tag: 'medieval-practitioners',
        label: 'Choose Your Healer',
        headline: 'Thomas has a fever.\nHe\'s coughing blood.',
        question: 'Who should he trust?',
        helperText: 'Swipe to explore your options.',
        promptVisual: { src: '/figures/history/medicine/medieval/thomas-doodle.webp', alt: 'Thomas' },
        options: [
          {
            title: 'Physician',
            image: '/figures/history/medicine/medieval/physician.webp',
            sections: [
              { heading: 'Favourite methods', items: ['Astrology', 'Urine charts', 'Four Humours'] },
              { heading: 'Cost', items: ['💰💰💰💰💰'] },
              { heading: 'Thomas confidence', items: ['⭐⭐⭐⭐⭐⭐☆☆☆☆'] },
            ],
            reaction: '"At least he looks expensive."',
            buttonText: 'Choose the Physician',
            nextScreenId: 'post-choice',
            revealLines: [
              "You chose the Physician.",
              "The good news? He's the most highly trained person in town.",
              "The bad news? You probably can't afford him.",
              "Physicians studied at university, spoke Latin and were treated like medical celebrities.",
              "Most ordinary people never saw one.",
              "Medieval medicine wasn't just about knowledge. It was about money.",
            ],
          },
          {
            title: 'Barber Surgeon',
            image: '/figures/history/medicine/medieval/barber-surgeon.webp',
            sections: [
              { heading: 'Favourite methods', items: ['Bloodletting', 'Tooth-pulling', 'Basic surgery'] },
              { heading: 'Cost', items: ['💰💰'] },
              { heading: 'Thomas confidence', items: ['⭐⭐⭐⭐☆☆☆☆☆☆'] },
            ],
            reaction: '"Why is he carrying a knife?"',
            buttonText: 'Choose the Barber Surgeon',
            nextScreenId: 'post-choice',
            revealLines: [
              "You chose the Surgeon.",
              "Need a tooth pulled? A wound stitched? A leg removed?",
              "This is your person.",
              "Surgeons dealt with the messy jobs physicians preferred not to touch.",
              "The catch?",
              "Many learned through experience rather than university study.",
              "In medieval medicine, practical skill and high status were not the same thing.",
            ],
          },
          {
            title: 'Wise Woman',
            image: '/figures/history/medicine/medieval/wise-woman.webp',
            sections: [
              { heading: 'Favourite methods', items: ['Herbs', 'Poultices', 'Traditional remedies'] },
              { heading: 'Cost', items: ['💰'] },
              { heading: 'Thomas confidence', items: ['⭐⭐⭐⭐⭐☆☆☆☆☆'] },
            ],
            reaction: '"Honestly, she seems the least terrifying."',
            buttonText: 'Choose the Wise Woman',
            nextScreenId: 'post-choice',
            revealLines: [
              "You chose the Wise Woman.",
              "No university degree. No fancy robes. No Latin.",
              "Yet she might be the person most villagers trust.",
              "Wise women used herbs, local remedies and knowledge passed down through generations.",
              "And unlike a physician...",
              "People could actually afford her.",
              "Most medieval healthcare happened in villages, not universities.",
            ],
          },
          {
            title: 'Priest',
            image: '/figures/history/medicine/medieval/priest.webp',
            sections: [
              { heading: 'Favourite methods', items: ['Prayer', 'Confession', 'Repentance'] },
              { heading: 'Cost', items: ['💰'] },
              { heading: 'Thomas confidence', items: ['⭐⭐⭐☆☆☆☆☆☆☆'] },
            ],
            reaction: '"I was hoping for medicine."',
            buttonText: 'Choose the Priest',
            nextScreenId: 'post-choice',
            revealLines: [
              "You chose the Priest.",
              "This might sound strange today... but many medieval people thought illness began with the soul, not the body.",
              "If disease was sent by God, prayer could be just as important as medicine.",
              "He might offer prayers, blessings or advice about sin and repentance.",
              "Religion shaped almost every part of medieval life — including medicine.",
            ],
          },
        ],
      },

      {
        type: 'conceptReveal',
        id: 'post-choice',
        stage: 'Medieval treatments',
        tag: 'miasma',
        label: 'Miasma — The Poisoned Air Theory',
        steps: [
          {
            eyebrow: 'Before germ theory',
            mainText: "If you couldn't see germs, you blamed what you could smell.",
            supportText: "Miasma — 'bad air' from rotting matter — was thought to carry disease. Medieval people noticed illness was worse near marshes, sewers, and rubbish heaps.",
          },
          {
            mainText: 'They were right about the location — wrong about the reason.',
            supportText: 'Dirty places really were more dangerous. But the killer was contaminated water and bacteria — not the smell itself.',
          },
          {
            mainText: 'The miasma theory lasted until the 1860s.',
            supportText: "Even in the Victorian era, doctors believed miasma caused cholera. It wasn't until Pasteur's germ theory that the truth emerged.",
          },
        ],
      },

      {
        type: 'interactiveImage',
        stage: 'Medieval treatments',
        id: 'zodiac-man-hotspot',
        label: 'Diagnose Like It\'s 1340',
        title: 'The Zodiac Man',
        introText: 'Tap the body parts to see how astrology was linked to medicine. Medieval physicians used charts like this to guide diagnosis and decide when to treat.',
        image: '/figures/history/medicine/medieval/zodiac-man.webp',
        imageAlt: 'Medieval Zodiac Man diagram linking zodiac signs to body parts',
        ctaLabel: 'Explore the Zodiac Man',
        hotspots: [
          {
            id: 'head', x: 50, y: 26,
            shortLabel: 'Head', title: 'Head — Aries', icon: '♈',
            description: 'Linked to Aries. Doctors believed zodiac signs influenced different body parts and that treatment should align with planetary positions.',
            extraFact: 'A physician might refuse to bleed a patient if the moon was in the sign governing that body part.',
          },
          {
            id: 'chest', x: 50, y: 37,
            shortLabel: 'Chest', title: 'Chest & Heart', icon: '♌',
            description: 'Associated with Leo and signs affecting the upper body. Timing of treatment — especially bloodletting — was sometimes chosen using these charts.',
            extraFact: 'Some medical texts included detailed astrological calendars showing the best and worst days for different treatments.',
          },
          {
            id: 'stomach', x: 50, y: 47,
            shortLabel: 'Stomach', title: 'Stomach & Digestion', icon: '♍',
            description: 'Linked to Virgo and digestion. The combination of humours and astrology created a complex system of overlapping explanations.',
            extraFact: 'Not every doctor relied equally on astrology — university-trained physicians used it more than barber surgeons or wise women.',
          },
          {
            id: 'legs', x: 50, y: 80,
            shortLabel: 'Legs & Feet', title: 'Legs & Feet — Pisces', icon: '♓',
            description: 'Linked to Pisces and lower-body signs. The Zodiac Man diagram appeared in medical manuscripts across Europe — it was mainstream learned medicine.',
            extraFact: 'The Zodiac Man diagram appeared in medical books across Europe — it was not a fringe idea. It was how educated physicians thought.',
          },
        ],
      },

      {
        type: 'visualLearning',
        stage: 'Medieval treatments',
        label: 'Causes of illness',
        scenes: [
          {
            image: '/headers/history-medicine-medieval-scripture.png',
            headline: 'So what did medieval people believe caused illness, and how did they treat them?',
          },
        ],
      },

      {
        type: 'visualNarrative',
        stage: 'Medieval treatments',
        label: 'The colour of your illness',
        beats: [
          {
            image: '/figures/history/medicine/medieval/uroscopy-chart.jpg',
            imagePosition: 'center center',
            imageFilter: 'brightness(1.1) saturate(0.85)',
            label: 'Diagnostic methods',
            headline: 'The colour\nof your illness.',
            body: 'Before a physician could treat you, they had to diagnose you.\nTheir most trusted tool? A flask of urine.',
          },
          {
            image: '/figures/history/medicine/medieval/uroscopy-chart.jpg',
            imagePosition: 'center 20%',
            imageOpacity: 0.55,
            facts: [
              'Physicians examined urine for colour, smell — and sometimes taste. This practice was called uroscopy.',
              'Urine was placed in a flask called a jordan and held to the light.',
              'A chart of up to 20 shades matched each colour to a specific humour and illness.',
              'Dark urine? Too much black bile. Cloudy? Excess phlegm. Nothing was random.',
            ],
            conclusion: 'Uroscopy shows the internal logic of humoural medicine:\nthe body was always a system in balance or imbalance.',
            source: 'Troubled Waters: Reading Urine in Medieval Medicine. The Public Domain Review (2023-04-19). Retrieved on 2025-03-27.',
          },
        ],
      },

      {
        type: 'medicalTheoryPrescription',
        stage: 'Medieval treatments',
        label: 'What caused illness?',
        contextName: 'Thomas',
        openingPractitioner: 'priest',
        theories: [
          {
            id: 'god-sin',
            label: 'God & Sin',
            shortLabel: 'God & Sin',
            icon: '/figures/history/medicine/medieval/icons/god-sin.png',
            scenePrompt: 'What does the priest think causes Thomas\'s illness?',
            introText: 'Different people had different explanations.',
            explanation: 'The priest believes Thomas may be ill because God is punishing him for his sins.',
            prescriptionPrompt: 'What treatments might the priest recommend for Thomas?',
            acceptedAnswers: [
              { canonical: 'Prayer',      accepted: ['prayer', 'pray', 'praying', 'prayers'] },
              { canonical: 'Pilgrimage',  accepted: ['pilgrimage', 'pilgrimages', 'go on pilgrimage', 'visit a shrine', 'shrine'] },
              { canonical: 'Confession',  accepted: ['confession', 'confess', 'repent', 'repentance', 'ask forgiveness', 'forgiveness'] },
            ],
            revealExplanation: 'People believed illness could be God\'s punishment. Prayer, confession and pilgrimage were used to seek God\'s forgiveness and restore health.',
          },
          {
            id: 'four-humours',
            label: 'The Four Humours',
            shortLabel: 'Four Humours',
            icon: '/figures/history/medicine/medieval/icons/four-humours.png',
            scenePrompt: 'What does the physician think causes Thomas\'s illness?',
            introText: 'A trained physician used ancient ideas from Hippocrates and Galen.',
            explanation: 'The physician believes Thomas is ill because his four humours are out of balance.',
            prescriptionPrompt: 'What treatments might rebalance the humours?',
            hint: 'Think about removing or rebalancing excess humours.',
            acceptedAnswers: [
              { canonical: 'Bloodletting',    accepted: ['bloodletting', 'blood letting', 'bleeding', 'let blood', 'remove blood', 'leeches', 'leech'] },
              { canonical: 'Purging',         accepted: ['purging', 'purge', 'vomiting', 'laxatives', 'make them sick', 'emetic'] },
              { canonical: 'Herbal remedies', accepted: ['herbal remedies', 'herbs', 'herbal medicine', 'plants', 'natural remedies', 'diet', 'rest'] },
            ],
            revealExplanation: 'Physicians believed illness happened when the humours became unbalanced. Treatments aimed to remove or rebalance the excess humour.',
          },
          {
            id: 'astrology',
            label: 'Astrology',
            shortLabel: 'Astrology',
            icon: '/figures/history/medicine/medieval/icons/astrology.png',
            scenePrompt: 'What does the astrologer think causes Thomas\'s illness?',
            introText: 'Some medieval medicine was linked to the stars and planets.',
            explanation: 'Some people believed the stars and planets affected health and when treatment should happen.',
            prescriptionPrompt: 'What might an astrologer recommend for Thomas?',
            hint: 'Think about charts and the timing of treatment.',
            acceptedAnswers: [
              { canonical: 'Astrology charts',         accepted: ['astrology charts', 'astrological charts', 'star charts', 'chart', 'zodiac chart', 'zodiac', 'stars', 'planets'] },
              { canonical: 'Treatment at the right time', accepted: ['right time', 'correct time', 'treatment timing', 'when stars are favourable', 'favourable stars', 'best time', 'timing'] },
            ],
            revealExplanation: 'Astrology was used to decide when treatment should happen, especially if the stars were believed to be favourable.',
          },
        ],
        finalMessage: 'Medieval medicine was a mixture of religion, ancient Greek ideas and astrology. Most people believed several explanations at the same time.',
      },

      {
        type: 'matchingTask',
        stage: 'Medieval treatments',
        label: 'Knowledge check',
        subject: 'History',
        title: 'Knowledge check',
        instruction: 'Match each medieval medicine term to its description.',
        weakAreaCategory: 'Medieval Medicine Key Concepts',
        backgroundImage: '/headers/history-medicine-medieval-scripture.png',
        pairs: [
          {
            id: 'urine-chart',
            term: 'Urine chart',
            answer: 'Used to identify which humour was believed to be out of balance.',
            weakGroup: 'Diagnosis',
          },
          {
            id: 'galen',
            term: 'Galen',
            answer: 'His ideas dominated medicine for over 1,000 years and were taught in medieval universities.',
            weakGroup: 'People',
          },
          {
            id: 'four-humours',
            term: 'Four humours',
            answer: 'Health depended on keeping four bodily liquids in balance.',
            weakGroup: 'Beliefs',
          },
          {
            id: 'theory-of-opposites',
            term: 'Theory of opposites',
            answer: 'Illness should be treated using qualities opposite to the symptoms.',
            weakGroup: 'Beliefs',
          },
          {
            id: 'physician',
            term: 'Physician',
            answer: 'A highly educated medical expert who diagnosed illness.',
            weakGroup: 'Diagnosis',
          },
          {
            id: 'wise-woman',
            term: 'Wise woman',
            answer: 'Relied on practical experience and herbal remedies rather than university training.',
            weakGroup: 'People',
          },
          {
            id: 'astrology',
            term: 'Astrology',
            answer: 'The belief that planets and stars could influence health.',
            weakGroup: 'Beliefs',
          },
        ],
        completion: {
          title: 'Knowledge secured',
          body: 'You have connected the key ideas that shaped medieval medicine.\n\nThese beliefs influenced how illness was diagnosed and treated for hundreds of years.',
        },
      },

      {
        type: 'naturalSupernaturalSwipe',
        stage: 'Rational vs supernatural',
        label: 'Supernatural vs Natural Causes',
        columns: [
          { label: 'SUPERNATURAL\nBased on religion or belief', color: '#A89070', colorRgb: '168,144,112', bg: 'rgba(168,144,112,.07)' },
          { label: 'RATIONAL\nBased on observation or logic', color: '#D69B45', colorRgb: '214,155,69', bg: 'rgba(214,155,69,.07)' },
        ],
        items: [
          { label: 'Praying for God to remove illness', col: 0, explanation: 'Supernatural — based on religious belief that illness was God\'s punishment for sin.' },
          { label: 'Four Humours — illness caused by imbalance of fluids', col: 1, explanation: 'Rational — based on observation and logic, even though the theory was wrong.' },
          { label: 'Visiting holy shrines and relics to be cured', col: 0, explanation: 'Supernatural — relying on faith and the power of sacred objects.' },
          { label: 'Miasma — bad air from rotting matter causes disease', col: 1, explanation: 'Rational — based on observation. People noticed disease was common in dirty, smelly places.' },
          { label: 'Planetary alignment determines when to treat patients', col: 0, explanation: 'Supernatural — astrology relied on celestial forces rather than observation of the body.' },
          { label: 'Bloodletting to rebalance the humours', col: 1, explanation: 'Rational — based on the Four Humours theory. Wrong, but logically consistent with medieval beliefs.' },
        ],
        explanation: 'Medieval medicine mixed both approaches. Rational ideas came from Hippocrates and Galen — supernatural ones from the Church. Both shaped how doctors thought and treated patients.',
      },

      {
        type: 'quickRecall',
        stage: 'Rational vs supernatural',
        label: 'Retrieval',
        questions: [
          {
            type: 'choice',
            question: 'What was uroscopy used for?',
            options: ['Diagnosing illness from urine', 'Bloodletting', 'Making herbal remedies', 'Consulting the stars'],
            correct: 0,
            explanation: 'Physicians examined urine to determine which humour was out of balance.',
          },
          {
            type: 'choice',
            question: 'Which practitioner was most likely to use herbal remedies?',
            options: ['Wise woman', 'Physician', 'Barber surgeon', 'Astrologer'],
            correct: 0,
            explanation: 'Wise women relied on traditional herbal knowledge — practical, community-based medicine.',
          },
          {
            type: 'choice',
            question: 'Why did medieval people visit holy shrines as a treatment?',
            options: ['If illness came from God, faith could cure it', 'Shrines had herbal gardens', 'Physicians recommended it', 'It was cheaper than herbs'],
            correct: 0,
            explanation: 'A religious explanation of illness led to religious treatments — prayer and pilgrimage were logical responses.',
          },
        ],
      },

      {
        stage: 'Rational vs supernatural',
        label: 'Fill the Gap',
        kicker: 'Four Humours',
        heading: 'Fill the Medieval Logic Gap',
        sub: 'Complete the sentences.',
        blocks: [
          {
            type: 'fillblanks',
            sentences: [
              {
                before: 'Medieval doctors believed illness was caused by an',
                after: 'of the Four Humours.',
                answer: 'imbalance',
                feedback: 'Correct — an imbalance of the humours was believed to cause illness.',
                hints: ['Think: when something is out of balance, it is an...', 'Starts with "i" — the body was no longer in balance.'],
              },
              {
                before: 'The Four Humours were blood, phlegm, yellow bile and',
                after: 'bile.',
                answer: 'black',
                feedback: 'Correct — black bile was one of the Four Humours, linked with melancholy.',
                hints: ['This humour was linked with sadness and melancholy.', 'One of the darkest colours — starts with "b."'],
              },
              {
                before: 'If the humours were balanced, the person was considered',
                after: '.',
                answer: 'healthy',
                feedback: 'Correct — balance between the humours meant good health; illness meant imbalance.',
                hints: ['The opposite of ill.', 'Balance = being in good health.'],
              },
            ],
          },
        ],
      },

      {
        type: 'examinerExplains',
        stage: 'Exam prep',
        examinerExplains: {
          opening: "Before you face the examiner, here's what they actually reward.",
          tips: [
            {
              heading: 'Use the exact terms',
              body: 'Four humours, miasma, Theory of Opposites, bloodletting. Named terms signal precise knowledge and earn marks — vague language loses them.',
            },
            {
              heading: 'Explain the logic, not just the fact',
              body: "Don't just state what medieval doctors did. Explain why it seemed rational to them — the examiner wants to see you understand the thinking, not just the action.",
            },
            {
              heading: 'Link cause to treatment',
              body: "Examiners want the full chain: Galen argued illness = imbalance of humours → treatment must restore balance → bloodletting follows logically. Show the reasoning.",
            },
            {
              heading: 'Address change and continuity',
              body: 'Why did these ideas persist for 1,000 years? The Church, lack of alternatives, and the authority of ancient texts. If a question asks why ideas survived — answer with all three.',
            },
          ],
          closing: "Now show them what you know.",
        },
      },

      {
        type: 'faceExaminer',
        stage: 'Exam prep',
        label: 'Face the Examiner',
        examiner: {
          type: '8-mark-explain',
          board: 'edexcel',
          subject: 'history',
          topic: 'medieval-medicine',
          difficulty: 'standard',

          question: 'Explain two ways in which religion influenced medical treatment in medieval England. [8 marks]',
          marks: 8,
          mark: 5,
          summary: 'Some understanding of religious influence shown, but both points need more developed explanation to reach Level 3.',

          markScheme: `Level 3 (6–8 marks): Detailed explanation of two ways with developed reasoning linking religious belief to specific treatments or practices.
Level 2 (3–5 marks): Some explanation of religious influence, but at least one point lacks development.
Level 1 (1–2 marks): Simple identification of religious practices with little or no explanation.
Award marks for any two of (each requiring explanation not just identification):
- Church controlled hospitals/monasteries — explanation must include WHY (belief in Christian duty/God's will/charity)
- Prayer, fasting, pilgrimage as treatments — must link to belief that sin caused disease
- Four Humours theory endorsed by Church — must show HOW this influenced practical treatment
- Physicians trained in Church schools, only Church-approved ideas studied
Do NOT award marks for identifying practices without explaining the religious reasoning.`,

          sampleAnswer: `Religion had a big influence on medical treatment in medieval England. Firstly, the Church ran hospitals and monasteries where sick people could go to get help. Monks and nuns would look after the sick because they believed it was their Christian duty to help others. Secondly, doctors in medieval times believed that illness was caused by God as punishment for sins. This meant that treatments often involved prayer and going on pilgrimages to holy sites, because people thought that if they showed their faith to God, He would cure them. Some people also fasted or confessed their sins as a form of treatment.`,

          annotations: [
            {
              id: 'ann1',
              target: 'the Church ran hospitals and monasteries where sick people could go to get help.',
              occurrence: 1,
              type: 'weak',
              comment: 'Identified but underdeveloped — WHY did the Church do this?',
            },
            {
              id: 'ann2',
              target: 'Monks and nuns would look after the sick because they believed it was their Christian duty to help others.',
              occurrence: 1,
              type: 'strong',
              comment: 'Good — links practice to religious belief.',
            },
            {
              id: 'ann3',
              target: 'illness was caused by God as punishment for sins.',
              occurrence: 1,
              type: 'strong',
              comment: 'Accurate causal link.',
            },
            {
              id: 'ann4',
              target: 'because people thought that if they showed their faith to God, He would cure them.',
              occurrence: 1,
              type: 'weak',
              comment: 'Vague — needs a specific named example (e.g. Canterbury).',
            },
            {
              id: 'ann5',
              target: 'Some people also fasted or confessed their sins as a form of treatment.',
              occurrence: 1,
              type: 'irrelevant',
              comment: 'Third point — only two ways required; this adds no new marks.',
            },
          ],

          improvementPrompts: {
            ann1: {
              prompt: '+ Explain WHY the Church ran hospitals',
              placeholder: 'e.g. The Church believed caring for the sick was a religious duty — a way of serving God and earning salvation...',
            },
            ann4: {
              prompt: '+ Add a specific example of pilgrimage as treatment',
              placeholder: 'e.g. Pilgrims travelled to the shrine of Thomas Becket at Canterbury Cathedral, believing holy relics could cure disease...',
            },
          },

          criteriaOptions: [
            'Accurate knowledge',
            'Two clear ways',
            'Specific evidence',
            'Explains the impact',
            'Developed explanation',
            'Too vague',
            'Repeats the point',
            'Missing second way',
          ],
        },
      },

      {
        type: 'quickRecall',
        stage: 'Exam prep',
        label: 'Who Said What?',
        questions: [
          {
            type: 'choice',
            question: 'Who is linked with developing the Four Humours?',
            options: ['Hippocrates', 'Pasteur', 'Vesalius', 'Lister'],
            correct: 0,
            explanation: 'Hippocrates developed the Four Humours theory and encouraged observation of patients.',
          },
          {
            type: 'choice',
            question: 'Who developed the Theory of Opposites?',
            options: ['Galen', 'Nightingale', 'Jenner', 'Koch'],
            correct: 0,
            explanation: 'Galen built on Hippocrates and developed the Theory of Opposites.',
          },
          {
            type: 'choice',
            question: 'What did both Hippocrates and Galen become in medieval medicine?',
            options: ['Ancient authorities', 'Surgeons', 'Plague doctors', 'Monks'],
            correct: 0,
            explanation: 'Medieval doctors trusted ancient authorities heavily — their texts were treated almost like scripture.',
          },
        ],
      },

    ],
  },

  // ─── The Black Death, 1348–1349 ───────────────────────────────────────────
  {
    id: 'history-medicine-black-death',
    subject: 'History',
    number: 2,
    title: 'Death comes from the east',
    subtitle: 'The Black Death, 1348–1349',
    era: 'c.1348–c.1350',
    icon: '☠️',
    color: '#8C3A2A',
    colorLight: 'rgba(140,58,42,0.12)',
    headerImage: '/figures/history/medicine/black-death/plague-background.png',

    hook: {
      statement: 'Medieval doctors had no useful treatment for the Black Death.',
      isTrue: true,
      accentWords: ['no useful treatment'],
      backgroundImage: '/figures/history/medicine/black-death/plague-background.png',
      explanation: 'True. Medieval doctors tried everything they knew — bloodletting, purging, prayer, burning herbs. None of it worked. The actual cause — bacteria spread by fleas on rats — would not be discovered for another 500 years.',
      revealBeats: [
        'True.',
        'Medieval doctors tried everything they knew.',
        'Bloodletting. Purging. Prayer. Burning aromatic herbs against the smell.',
        'None of it worked.',
        'The actual cause — bacteria spread by fleas on rats — would not be discovered for another 500 years.',
      ],
    },

    outcomes: {
      bullets: [
        { text: 'Where the Black Death came from and how it spread',  icon: 'map'      },
        { text: 'What medieval people believed caused it',            icon: 'question' },
        { text: 'Why those beliefs led to useless treatments',        icon: 'medicine' },
        { text: 'How the plague changed England forever',             icon: 'legacy'   },
      ],
    },

    screens: [

      // ── Section 1: Intro / Recall / Roadmap ─────────────────────────────────

      {
        type: 'priorKnowledgeRecall',
        chapterTitle: 'Medieval medicine: beliefs and causes of disease',
        prompt: 'What do you remember from the last chapter?',
        backgroundImage: '/figures/history/medicine/black-death/plague-background.png',
        sourceContent: `GCSE History: Medieval Medicine — Beliefs and Causes of Disease (c.1250–c.1500)

Key figures:
Hippocrates (ancient Greek doctor) argued illness had natural causes, not punishment from gods. He promoted observation of symptoms, recording of cases, and logical reasoning. His Four Humours theory said health depended on balance between four bodily fluids: blood, phlegm, yellow bile, and black bile. Imbalance caused disease.

Galen (Roman doctor, c.129–216 AD) built on Hippocrates. He treated gladiators, dissected animals, and wrote medical books copied and taught in universities for over 1,400 years. His Theory of Opposites: treat illness with its opposite quality — a hot, feverish illness with cold remedies; a cold, wet condition with warm, dry treatments. Galen made errors (blood made in liver; heart septum had holes), but the Church backed his authority so he was rarely questioned.

Causes of disease — four main theories:
1. Four Humours: disease caused by imbalance of blood, phlegm, yellow bile, or black bile.
2. God and sin: illness was God's punishment for sin, or a test of faith. Treatments: prayer, confession, repentance, pilgrimage, fasting, visiting holy relics.
3. Miasma: bad air from rotting matter, sewers, marshes caused disease. The smell itself was believed to carry illness.
4. Astrology: planets and zodiac signs influenced the body. Physicians used the Zodiac Man diagram and astrological calendars to time treatments. The Paris Medical Faculty blamed the Black Death on a triple conjunction of Saturn, Jupiter, and Mars in 1345.

Medical practitioners:
- Physician: university-trained, expensive, used Latin, diagnosed via uroscopy (examining urine colour using a jordan flask and urine charts) and astrological charts.
- Barber surgeon: practical tradesman, moderate cost, performed bloodletting (removing blood by cutting a vein or applying leeches), tooth-pulling, and minor surgery.
- Wise woman: no formal training, cheapest option, used herbal remedies and poultices. Most accessible to ordinary people in villages.
- Priest: offered spiritual treatment — prayer, blessing, repentance. Believed illness began with sin.

Treatments:
- Bloodletting: removing blood (by cutting or leeches) to restore humoral balance.
- Purging: inducing vomiting or diarrhoea to expel excess humours.
- Herbal remedies, diet change, rest: cooling foods (cucumber) for fever; dry foods for cold conditions.
- Prayer, pilgrimage, confession, fasting: for illness believed to be caused by God.

The Church's role:
The Church ran hospitals (St Bartholomew's, founded 1123) and copied ancient medical texts in monasteries. It preserved and promoted Galen's work because his ideas of bodily balance fitted Christian views of perfect divine design. The Church discouraged human dissection (belief in bodily resurrection) and made questioning Galen's authority difficult. This slowed medical progress significantly.

Why medieval ideas survived so long:
The Church preserved ancient texts and backed Galen's authority. Without microscopes or germ theory, no better explanation existed. Humoral logic was internally consistent — wrong premises, logical conclusions. Some treatments accidentally helped (rest, fluids, herbal remedies), making the flawed theory seem credible. Multiple explanations coexisted — people believed God, humours, miasma, and astrology simultaneously.`,
        concepts: [
          { tag: 'hippocrates',             label: 'Hippocrates' },
          { tag: 'four-humours',            label: 'Four humours' },
          { tag: 'galen',                   label: 'Galen' },
          { tag: 'theory-of-opposites',     label: 'Theory of Opposites' },
          { tag: 'miasma',                  label: 'Miasma theory' },
          { tag: 'god-punishment',          label: 'God and sin' },
          { tag: 'astrology',               label: 'Astrology and the zodiac man' },
          { tag: 'bloodletting',            label: 'Bloodletting' },
          { tag: 'church-role',             label: 'Church\'s role in medicine' },
          { tag: 'supernatural-vs-natural', label: 'Supernatural vs natural causes' },
          { tag: 'why-ideas-survived',      label: 'Why medieval ideas survived so long' },
        ],
      },

      // ── Section 2: The arrival ───────────────────────────────────────────────

      {
        type: 'visualNarrative',
        stage: 'The arrival',
        label: 'England, 1348',
        beats: [
          {
            image: '/figures/history/medicine/black-death/medieval-town.png',
            label: 'ENGLAND, 1348',
            headline: 'Something is coming.',
            body: 'Rumours had been arriving for months. A terrible sickness. Killing everyone it touched.',
          },
          {
            image: '/figures/history/medicine/black-death/empty-town.png',
            imageOpacity: 0.6,
            facts: [
              'In June 1348, ships docked at Melcombe in Dorset.',
              'Within weeks, people began to die.',
              'The disease moved fast — through towns, villages, and monasteries.',
              'By 1350, it had reached Scotland.',
            ],
            conclusion: 'No one knew what it was.\n\nNo one knew how to stop it.',
          },
        ],
      },

      {
        type: 'visualLearning',
        stage: 'The arrival',
        label: 'Where did it come from?',
        scenes: [
          {
            image: '/figures/history/medicine/black-death/medieval-town.png',
            headline: 'It began in central Asia.',
            body: 'Possibly in the late 1330s. From there, it moved west along the trade routes that connected Asia to Europe.',
          },
          {
            image: '/figures/history/medicine/black-death/medieval-town.png',
            headline: 'Trade routes carried death.',
            body: 'Ships moving across the Mediterranean brought infected rats and fleas from port to port. By 1347, it had reached Sicily and southern Europe.',
          },
          {
            image: '/figures/history/medicine/black-death/medieval-town.png',
            headline: 'England, 1348.',
            body: 'Arriving through southern ports, the plague spread north. It reached London by autumn 1348 and had swept the country by 1350.',
          },
          {
            finalReveal: true,
            headline: 'Nowhere was safe.',
            body: 'The plague killed an estimated one-third of Europe\'s population — roughly 25 million people — in just four years.',
          },
        ],
      },

      {
        type: 'visualLearning',
        stage: 'The arrival',
        label: 'The scale of the disaster',
        scenes: [
          {
            image: '/figures/history/medicine/black-death/empty-town.png',
            headline: 'In England, between one-third and one-half of the entire population died.',
            body: 'In some villages, no one survived. Whole communities ceased to exist.',
          },
          {
            image: '/figures/history/medicine/black-death/empty-town.png',
            headline: 'Bodies piled up faster than they could be buried.',
            body: 'Mass graves — plague pits — were dug outside towns. Normal burial rites became impossible.',
          },
          {
            image: '/figures/history/medicine/black-death/empty-town.png',
            headline: 'Three types. All deadly.',
            body: 'Bubonic (swellings in groin and armpit, spread by flea bites). Pneumonic (lung infection, spread through the air). Septicaemic (blood poisoning, almost always fatal).',
          },
          {
            finalReveal: true,
            headline: 'The symptoms were unmistakeable.',
            body: 'Egg-sized swellings. Fever. Blackened skin. Death within days. Medieval people had never seen anything like it.',
          },
        ],
      },

      {
        type: 'progressionTimeline',
        stage: 'The arrival',
        label: 'Symptoms of the plague',
        title: 'How the plague killed',
        description: 'Follow the progression of bubonic plague through the body.',
        stages: [
          { day: '1–2',  label: 'Flea bite',        description: 'A flea carrying Yersinia pestis bacteria bites the skin. The bacteria enter the lymphatic system.' },
          { day: '3–5',  label: 'Buboes form',       description: 'Painful egg-sized swellings (buboes) appear in lymph nodes — groin, armpit, or neck.' },
          { day: '5–7',  label: 'High fever',        description: 'Severe fever, chills, headache and extreme exhaustion as the body fights a losing battle.' },
          { day: '7–10', label: 'Black patches',     description: 'Black patches of dead tissue appear on the skin. Internal bleeding causes dark discolouration.' },
          { day: '10+',  label: 'Death or survival', description: 'Most victims died within 10 days. A small number survived, possibly due to natural immunity.' },
        ],
      },

      // ── Section 3: Medieval explanations ────────────────────────────────────

      {
        type: 'guidedChoiceCarousel',
        stage: 'Medieval explanations',
        id: 'plague-belief-carousel',
        tag: 'plague-explanations',
        label: 'What would you believe?',
        headline: 'Agnes has the plague.\nHer village is terrified.',
        question: 'You have no microscope. No germ theory. What do you think caused this?',
        helperText: 'Swipe to explore the explanations.',
        promptVisual: { src: '/figures/history/medicine/black-death/medieval-town.png', alt: 'Medieval village during the plague' },
        options: [
          {
            title: 'God\'s punishment',
            image: '/headers/history-medicine-medieval-scripture.png',
            sections: [
              { heading: 'The logic',        items: ['Sin brings punishment', 'Only God can cure it', 'Repentance = recovery'] },
              { heading: 'Who believed this', items: ['Church', 'Most ordinary people', 'Priests'] },
              { heading: 'Treatments',       items: ['Prayer', 'Fasting', 'Flagellation'] },
            ],
            reaction: '"The Lord is punishing us for our sins."',
            buttonText: 'Choose God\'s punishment',
            nextScreenId: 'plague-beliefs-reveal',
            revealLines: [
              'You chose God\'s punishment.',
              'To a medieval person, this was not superstition — it was logical.',
              'If God controls everything and the plague kills thousands, then God must have sent it.',
              'The response was prayer, fasting, pilgrimage, and confession.',
              'Some went further: flagellants marched through towns, whipping themselves publicly.',
              'None of it stopped the plague.',
            ],
          },
          {
            title: 'Miasma — bad air',
            image: '/figures/history/medicine/black-death/miasma.png',
            sections: [
              { heading: 'The logic',        items: ['Bad smells carry disease', 'Plague smells terrible', 'Clean the air = stop the plague'] },
              { heading: 'Who believed this', items: ['Physicians', 'Educated people', 'City authorities'] },
              { heading: 'Treatments',       items: ['Burning herbs', 'Flowers and posies', 'Opening windows'] },
            ],
            reaction: '"The air near the plague pits reeks. It must be poisoned."',
            buttonText: 'Choose miasma',
            nextScreenId: 'plague-beliefs-reveal',
            revealLines: [
              'You chose miasma.',
              'This was the most scientific view available.',
              'People noticed plague was worse near sewers, rubbish heaps, and plague pits.',
              'They were right about the location. Wrong about the cause.',
              'It wasn\'t the smell — it was fleas and bacteria.',
              'People carried flowers, burned aromatic wood, and some physicians wore beaked masks stuffed with herbs.',
            ],
          },
          {
            title: 'Planetary alignment',
            image: '/headers/history-medicine-germ-bridge.png',
            sections: [
              { heading: 'The logic',        items: ['Planets influence health', 'Bad alignment = disease', 'Saturn, Jupiter, Mars'] },
              { heading: 'Who believed this', items: ['University physicians', 'Paris Medical Faculty', 'Astrologers'] },
              { heading: 'Treatments',       items: ['Wait for favourable stars', 'Consult charts', 'Avoid bad days'] },
            ],
            reaction: '"Saturn, Jupiter and Mars aligned in Aquarius. This poisoned the air."',
            buttonText: 'Choose planetary alignment',
            nextScreenId: 'plague-beliefs-reveal',
            revealLines: [
              'You chose planetary alignment.',
              'In 1348, the Paris Medical Faculty officially blamed the plague on a triple conjunction of Saturn, Jupiter and Mars in Aquarius in 1345.',
              'This was mainstream medicine — the official view of Europe\'s most respected medical institution.',
              'If the stars caused the plague, you couldn\'t cure it by treating the body.',
              'You had to wait for the stars to change.',
            ],
          },
        ],
      },

      {
        type: 'visualLearning',
        id: 'plague-beliefs-reveal',
        stage: 'Medieval explanations',
        label: 'What medieval people believed',
        scenes: [
          {
            image: '/figures/history/medicine/black-death/plague-background.png',
            headline: 'Medieval people had three main explanations for the Black Death.',
            body: 'God\'s punishment, miasma — bad air — and planetary alignment. Each came with its own treatment.',
          },
          {
            image: '/headers/history-medicine-medieval-scripture.png',
            headline: 'God was punishing humanity for its sins.',
            body: 'This led to prayer, fasting, pilgrimage, and confession. Flagellants publicly whipped themselves to demonstrate suffering and seek mercy.',
          },
          {
            image: '/figures/history/medicine/black-death/miasma.png',
            headline: 'Miasma — the smell of disease.',
            body: 'Bad air from decaying matter was thought to carry the plague. People burned aromatic herbs and carried posies of flowers to counteract it.',
          },
          {
            image: '/headers/history-medicine-germ-bridge.png',
            headline: 'The stars were aligned in the wrong positions.',
            body: 'In 1348, the Paris Medical Faculty officially blamed the Black Death on a triple conjunction of Saturn, Jupiter, and Mars in Aquarius in 1345.',
          },
          {
            finalReveal: true,
            headline: 'All three explanations were wrong.',
            body: 'They were internally logical, given what was known. The actual cause would not be discovered for another 500 years.',
          },
        ],
      },

      {
        type: 'matchingTask',
        stage: 'Medieval explanations',
        label: 'Beliefs and responses',
        subject: 'History',
        title: 'Beliefs and responses',
        instruction: 'Match each plague explanation to its treatment.',
        weakAreaCategory: 'Black Death Beliefs',
        backgroundImage: '/figures/history/medicine/black-death/plague-background.png',
        pairs: [
          { id: 'god-prayer',    term: 'God\'s punishment',      answer: 'Prayer, fasting, pilgrimage, and flagellation to seek God\'s forgiveness.' },
          { id: 'miasma-herbs',  term: 'Miasma — bad air',       answer: 'Burning aromatic herbs and carrying posies of flowers to counteract the smell.' },
          { id: 'stars-charts',  term: 'Planetary alignment',    answer: 'Consulting astrological charts and waiting for favourable star positions.' },
          { id: 'humours-blood', term: 'Imbalance of humours',   answer: 'Bloodletting and purging to restore balance between the Four Humours.' },
        ],
      },

      {
        type: 'visualLearning',
        stage: 'Medieval explanations',
        label: 'The actual cause',
        scenes: [
          {
            image: '/figures/history/medicine/black-death/plague-background.png',
            headline: 'The actual cause was invisible to medieval eyes.',
            body: 'Not God. Not bad air. Not the stars.',
          },
          {
            image: '/figures/history/medicine/black-death/medieval-town.png',
            headline: 'Black rats travelled on trading ships.',
            body: 'The ships that brought goods from Asia also carried black rats — and the fleas that lived on them.',
          },
          {
            image: '/figures/history/medicine/black-death/medieval-town.png',
            headline: 'Fleas carried the bacteria.',
            body: 'Fleas fed on infected rats. When the rats died, the fleas moved to human hosts. The bite transferred Yersinia pestis bacteria into the bloodstream.',
          },
          {
            finalReveal: true,
            headline: 'This would not be discovered until 1894.',
            body: 'Alexandre Yersin identified the bacteria in Hong Kong during a plague outbreak — almost 550 years after the Black Death hit England.',
          },
        ],
      },

      {
        type: 'quickRecall',
        stage: 'Medieval explanations',
        label: 'Causes and beliefs check',
        questions: [
          {
            type: 'choice',
            question: 'What did the Paris Medical Faculty blame for the Black Death?',
            options: ['A triple conjunction of Saturn, Jupiter and Mars', 'God\'s punishment for sin', 'Miasma from plague pits', 'Bad food and water'],
            correct: 0,
            explanation: 'The Paris Medical Faculty officially blamed the Black Death on the conjunction of Saturn, Jupiter and Mars in Aquarius in 1345.',
          },
          {
            type: 'choice',
            question: 'What actually caused the Black Death?',
            options: ['Yersinia pestis bacteria spread by fleas on rats', 'Bad air from rotting matter', 'God\'s punishment for sin', 'Imbalance of the Four Humours'],
            correct: 0,
            explanation: 'Yersinia pestis bacteria were carried by fleas that lived on black rats. When infected rats died, the fleas moved to human hosts.',
          },
          {
            type: 'choice',
            question: 'Why did people carry posies of flowers during the plague?',
            options: ['To ward off miasma — the bad air believed to cause disease', 'As offerings to God', 'Because flowers contained a natural remedy', 'To mark houses where plague had struck'],
            correct: 0,
            explanation: 'People believed miasma (bad air) spread the plague. Sweet-smelling flowers and herbs were thought to counteract the poisoned air.',
          },
        ],
      },

      // ── Section 4: Treatments ────────────────────────────────────────────────

      {
        type: 'collectionExplorer',
        stage: 'Treatments and prevention',
        label: 'Plague treatments',
        title: 'Plague treatments',
        description: 'Tap each item to discover what medieval people tried against the plague.',
        backgroundImage: '/figures/history/medicine/black-death/plague-background.png',
        items: [
          {
            id: 'flagellants',
            label: 'Flagellants',
            x: 18, y: 22,
            reveals: [
              { text: 'Flagellants were groups of people who marched between towns, whipping themselves publicly as an act of penance.' },
              { text: 'They believed God had sent the plague as punishment for sin. By suffering publicly, they hoped to show God their repentance and earn mercy.' },
              { text: 'The Church eventually condemned flagellant groups in 1349 — they had become too large and too independent of priestly authority.' },
            ],
          },
          {
            id: 'posies',
            label: 'Posies and herbs',
            x: 75, y: 18,
            reveals: [
              { text: 'People carried small bunches of sweet-smelling flowers and herbs — posies — because they believed miasma (bad air) carried the plague.' },
              { text: 'Breathing pleasant smells was thought to counteract the poisoned air. Rosemary, lavender and rue were popular choices.' },
              { text: 'Some physicians wore beaked masks stuffed with aromatic herbs when treating plague patients. The beak held the herbs near the face.' },
            ],
          },
          {
            id: 'bloodletting',
            label: 'Bloodletting',
            x: 28, y: 60,
            reveals: [
              { text: 'Physicians continued to prescribe bloodletting during the plague — removing blood to restore the body\'s humoral balance.' },
              { text: 'Within the Four Humours system, this made sense: if the body was overwhelmed, excess of one humour might be responsible.' },
              { text: 'Bloodletting weakened already ill patients and almost certainly made their condition worse. The theory was wrong, but internally consistent.' },
            ],
          },
          {
            id: 'burning-fires',
            label: 'Burning fires',
            x: 72, y: 62,
            reveals: [
              { text: 'City authorities ordered large fires to be lit in streets and open spaces, believing the smoke would cleanse the air of miasma.' },
              { text: 'Aromatic wood such as oak was favoured. Some towns kept fires burning continuously during outbreaks.' },
              { text: 'This was a rational response given the miasma theory — but entirely useless against Yersinia pestis bacteria.' },
            ],
          },
          {
            id: 'fleeing',
            label: 'Fleeing the city',
            x: 50, y: 83,
            reveals: [
              { text: 'Wealthy people fled to the countryside when plague struck. Without understanding the real cause, this sometimes helped — they left the fleas behind.' },
              { text: 'But they could carry infected fleas with them, spreading the plague to new areas.' },
              { text: 'The poor could not afford to flee. They stayed in crowded conditions and died at much higher rates.' },
            ],
          },
        ],
        synthesis: {
          heading: 'What all these treatments had in common',
          points: [
            'Every treatment was based on a wrong understanding of the cause.',
            'None of them addressed Yersinia pestis bacteria or the fleas that carried it.',
            'Medieval people were not stupid — they were reasoning logically from wrong premises.',
          ],
          examTakeaway: 'Wrong cause → wrong treatment. Every time.',
        },
      },

      {
        type: 'matchingTask',
        stage: 'Treatments and prevention',
        label: 'Treatment to belief',
        subject: 'History',
        title: 'Treatment to belief',
        instruction: 'Match each plague treatment to the belief that drove it.',
        weakAreaCategory: 'Black Death Treatments',
        backgroundImage: '/figures/history/medicine/black-death/plague-background.png',
        pairs: [
          { id: 'flagellants-god',    term: 'Flagellants whipping themselves',  answer: 'God sent the plague as punishment — public suffering might earn His forgiveness.' },
          { id: 'posies-miasma',      term: 'Carrying posies of flowers',       answer: 'Miasma — sweet smells were thought to counteract the poisoned bad air.' },
          { id: 'bloodletting-hum',   term: 'Bloodletting',                     answer: 'Four Humours — removing blood was meant to restore the body\'s natural balance.' },
          { id: 'fires-miasma',       term: 'Burning fires in the streets',     answer: 'Miasma — smoke was thought to cleanse infected air and stop disease spreading.' },
        ],
      },

      // ── Section 5: Living through the plague ────────────────────────────────

      {
        type: 'visualNarrative',
        stage: 'Life during the plague',
        label: 'A village in 1349',
        beats: [
          {
            image: '/figures/history/medicine/black-death/medieval-town.png',
            label: 'ENGLAND, 1349',
            headline: 'A village at the edge of the epidemic.',
            body: 'Three months ago, everything was normal. Then a traveller arrived.',
          },
          {
            image: '/figures/history/medicine/black-death/empty-town.png',
            imageOpacity: 0.65,
            facts: [
              'The priest died first, then the blacksmith.',
              'Farmers abandoned their fields to flee.',
              'Landlords found no one to work their land.',
              'Church bells rang almost without stopping — too many dead for individual funerals.',
            ],
            conclusion: 'For a year, normal life stopped.\n\nThe world that emerged would look very different.',
          },
        ],
      },

      {
        type: 'visualLearning',
        stage: 'Life during the plague',
        label: 'Rich and poor',
        scenes: [
          {
            image: '/figures/history/medicine/black-death/rich-vs-poor.png',
            headline: 'The plague did not kill equally.',
            body: 'Wealthy people could flee to the countryside. The poor, crowded into towns and unable to leave, died in far greater numbers.',
          },
          {
            image: '/figures/history/medicine/black-death/empty-town.png',
            headline: 'Villages were abandoned.',
            body: 'Entire communities disappeared. Hundreds of settlements in England were deserted. The evidence survives today as earthwork humps in fields.',
          },
          {
            image: '/headers/history-medicine-medieval-scripture.png',
            headline: 'The Church was badly hit.',
            body: 'Priests and monks died in huge numbers — often because they stayed to care for the sick. In some areas, up to half of all clergy died.',
          },
          {
            finalReveal: true,
            headline: 'The scale of death was unlike anything in living memory.',
            body: 'England after 1350 was a fundamentally different place. The old social order had been shaken to its foundations.',
          },
        ],
      },

      // ── Section 6: The aftermath ─────────────────────────────────────────────

      {
        type: 'visualLearning',
        stage: 'The aftermath',
        label: 'What changed after the plague',
        scenes: [
          {
            image: '/figures/history/medicine/black-death/labour-shortage.png',
            headline: 'The Black Death created a labour shortage.',
            body: 'So many people died that there were not enough labourers to farm the land. For the first time, surviving peasants could demand higher wages.',
          },
          {
            image: '/figures/history/medicine/black-death/labour-shortage.png',
            headline: 'Wages rose. Conditions improved.',
            body: 'Landlords had to offer better pay and conditions to attract workers. Many peasants moved from one lord to another, seeking the best deal.',
          },
          {
            image: '/figures/history/medicine/black-death/flagellants.png',
            headline: 'The Church\'s authority weakened.',
            body: 'Prayers had not stopped the plague. Many people lost faith in the Church\'s ability to protect them. The Church\'s moral authority began to crack.',
          },
          {
            finalReveal: true,
            headline: 'The seeds of social change.',
            body: 'The combination of labour power, weakened Church authority and social disruption helped lay the groundwork for the Peasants\' Revolt of 1381.',
          },
        ],
      },

      {
        stage: 'The aftermath',
        label: 'The causal chain',
        kicker: 'Change and continuity',
        heading: 'Why the Black Death changed England',
        sub: 'Follow the chain of cause and effect.',
        blocks: [
          {
            type: 'explainReveal',
            intro: 'The Black Death didn\'t just kill people. It set in motion a chain of changes that reshaped English society.',
            atmosphereImage: '/figures/history/medicine/black-death/labour-shortage.png',
            steps: [
              {
                id: 'population-falls',
                statement: 'Between one-third and one-half of England\'s population died.',
                emphasis: 'That meant far fewer workers to farm the land.',
                detail: 'In some regions, entire villages disappeared. Landlords suddenly had too much land and too few people to work it.',
              },
              {
                id: 'labour-shortage',
                statement: 'The labour shortage gave surviving peasants rare bargaining power.',
                emphasis: 'For the first time, they could demand higher wages.',
                detail: 'This directly challenged the feudal system, in which peasants were bound to their lord and could not negotiate their conditions.',
              },
              {
                id: 'church-weakened',
                statement: 'The Church had promised that faith could protect the faithful.',
                emphasis: 'It hadn\'t. The Church lost credibility.',
                detail: 'Priests and monks died in huge numbers, often while tending to the sick. If God\'s own servants couldn\'t be protected, what did that say about God\'s power?',
              },
              {
                id: 'social-change',
                statement: 'A weaker Church and empowered peasants created instability.',
                emphasis: 'This contributed to the Peasants\' Revolt of 1381.',
                detail: 'When landlords tried to reimpose pre-plague labour conditions, the revolt showed how much England had changed. The old order could not simply be restored.',
              },
            ],
            reflectionPrompt: 'How did population decline lead to social and religious change?',
          },
        ],
      },

      {
        type: 'naturalSupernaturalSwipe',
        stage: 'The aftermath',
        label: 'Changed or stayed the same?',
        columns: [
          { label: 'CHANGED\nAfter the Black Death',         color: '#4CAF7D', colorRgb: '76,175,125',  bg: 'rgba(76,175,125,.07)'  },
          { label: 'STAYED THE SAME\nAfter the Black Death', color: '#8C3A2A', colorRgb: '140,58,42',   bg: 'rgba(140,58,42,.07)'   },
        ],
        items: [
          { label: 'Peasant wages — labourers could now demand higher pay',          col: 0, explanation: 'Changed — the labour shortage gave survivors real bargaining power for the first time.' },
          { label: 'Medical explanations — doctors still blamed miasma and God',     col: 1, explanation: 'Stayed the same — medieval doctors used exactly the same explanations after the plague as before. Medicine did not change.' },
          { label: 'Church authority — many people lost faith in its power',         col: 0, explanation: 'Changed — prayer had not stopped the plague. The Church\'s spiritual authority was visibly damaged.' },
          { label: 'The Four Humours — still taught in universities after 1350',     col: 1, explanation: 'Stayed the same — the humoral system remained the basis of medical teaching. The plague gave doctors no new tools.' },
          { label: 'Feudal labour obligations — many peasants refused to comply',    col: 0, explanation: 'Changed — surviving peasants used their scarcity to resist returning to pre-plague conditions.' },
          { label: 'Medical treatments — bloodletting, herbs and prayer continued', col: 1, explanation: 'Stayed the same — without understanding the real cause, treatments could not improve.' },
        ],
        explanation: 'The Black Death changed society dramatically — but it changed medicine almost not at all. The same theories and treatments continued for another 300 years.',
      },

      {
        type: 'cinematic',
        stage: 'The aftermath',
        label: 'Medicine stayed the same',
        fallbackImage: '/figures/history/medicine/black-death/not-much-changed.png',
        year: 'c.1350',
        paragraphs: [
          'The Black Death killed up to half of England.',
          'It weakened the Church. It empowered the poor. It destabilised the feudal system.',
          'But it did not change medicine.',
          'Doctors looked at the plague and saw exactly what they expected to see: God\'s punishment, miasma, bad planetary alignment.',
          'They already had their explanations. The plague just confirmed them.',
          'The real cause — bacteria spread by fleas on rats — would not be discovered for another 546 years.',
        ],
      },

      {
        type: 'quickRecall',
        stage: 'The aftermath',
        label: 'Aftermath check',
        questions: [
          {
            type: 'choice',
            question: 'Why did peasant wages rise after the Black Death?',
            options: ['There were not enough workers to farm the land', 'The king ordered wage increases', 'The Church paid workers more', 'Trade increased'],
            correct: 0,
            explanation: 'The population fall created a labour shortage. Surviving peasants could demand better wages because landowners needed workers and had to compete for them.',
          },
          {
            type: 'choice',
            question: 'How did the Black Death affect the Church\'s authority?',
            options: ['It weakened it — prayer had failed to stop the plague', 'It strengthened it — people prayed more', 'It had no effect', 'It made the Church wealthier'],
            correct: 0,
            explanation: 'Many people lost faith in the Church because prayer had not protected the faithful. Clergy died in large numbers, damaging the Church\'s image of spiritual power.',
          },
          {
            type: 'choice',
            question: 'What happened to medical theory after the Black Death?',
            options: ['It barely changed — the same explanations continued', 'Doctors discovered the true cause', 'Germ theory was developed', 'The Church banned the Four Humours theory'],
            correct: 0,
            explanation: 'Without microscopes or germ theory, medieval doctors continued using the same explanations after the plague as before. Medical thinking did not change.',
          },
        ],
      },

      // ── Section 6: Summary & Examiner ──────────────────────────────────────────

      {
        type: 'visualLearning',
        stage: 'Exam prep',
        label: 'The story so far',
        scenes: [
          {
            image: '/figures/history/medicine/black-death/plague-background.png',
            headline: 'The Black Death reached England in 1348.',
            body: 'People did not know what caused it.',
          },
          {
            image: '/figures/history/medicine/black-death/miasma.png',
            headline: 'Medieval people blamed three things.',
            body: 'God — as punishment for sin. Miasma — poisonous air. Astrology — planetary alignment.',
          },
          {
            image: '/figures/history/medicine/black-death/labour-shortage.png',
            headline: 'Their treatments reflected those beliefs.',
            body: 'Prayer, flagellation, burning herbs, bloodletting. None of it worked.',
          },
          {
            image: '/figures/history/medicine/black-death/not-much-changed.png',
            headline: 'The Black Death changed society dramatically.',
            body: 'Labour shortage, higher wages, weaker Church authority. But medicine changed very little.',
          },
          {
            finalReveal: true,
            headline: 'Now let\'s make sure you can explain this — not just describe it.',
            body: 'The examiner rewards explanation. Not description.',
          },
        ],
      },

      {
        type: 'examinerExplains',
        stage: 'Exam prep',
        label: 'How examiners think',
        examinerExplains: {
          opening: 'Many students lose marks because they stop too early. They identify a consequence — but they don\'t explain why it mattered.',
          tips: [
            {
              heading: 'Top-mark answers keep going',
              body: 'They explain: This happened... which meant that... which led to... which resulted in... Each phrase builds the causal chain that earns marks.',
            },
            {
              heading: 'Two phrases unlock higher marks',
              body: '"This meant that..." and "Which led to..." signal to the examiner that you understand causation, not just description. Use them deliberately.',
            },
            {
              heading: 'Know the actual cause — and contrast it',
              body: 'Yersinia pestis bacteria spread by fleas on black rats. Examiners credit students who know this AND contrast it with what medieval people believed.',
            },
            {
              heading: 'Separate social change from medical change',
              body: 'The plague changed society (wages, Church authority) but not medicine. Don\'t confuse the two — a key distinction for 8-mark questions.',
            },
          ],
          closing: 'Show the examiner you understand why — not just what.',
        },
      },

      {
        stage: 'Exam prep',
        label: 'Building a stronger explanation',
        kicker: 'Examiner technique',
        heading: 'Building a stronger explanation',
        sub: 'Follow the causal chain step by step.',
        blocks: [
          {
            type: 'explainReveal',
            intro: 'Strong history answers explain consequences — they don\'t just describe events. Here\'s the technique applied to the Black Death.',
            atmosphereImage: '/figures/history/medicine/black-death/labour-shortage.png',
            steps: [
              {
                id: 'step-event',
                statement: 'Start with the event:',
                emphasis: 'The Black Death killed around one-third of England\'s population.',
                detail: 'This is your opening fact. Precise — not "lots of people died".',
              },
              {
                id: 'step-1',
                statement: 'This meant that...',
                emphasis: 'There were fewer workers available.',
                detail: 'Connect the event to the immediate consequence. First "this meant that" phrase.',
              },
              {
                id: 'step-2',
                statement: 'Which led to...',
                emphasis: 'Labour shortages.',
                detail: 'Name the consequence specifically. Don\'t stop here — keep the chain going.',
              },
              {
                id: 'step-3',
                statement: 'This meant that...',
                emphasis: 'Surviving workers became more valuable.',
                detail: 'Second "this meant that" phrase. Examiners reward this pattern.',
              },
              {
                id: 'step-4',
                statement: 'Which led to...',
                emphasis: 'Higher wages and better conditions.',
                detail: 'The economic result — follow through to the outcome.',
              },
              {
                id: 'step-5',
                statement: 'As a result...',
                emphasis: 'Society began to change. The feudal system was challenged.',
                detail: 'The significance. Top-level answer: shows why it mattered beyond the immediate event.',
              },
            ],
            reflectionPrompt: 'Notice how each step explains the consequence. This is what examiners reward.',
          },
        ],
      },

      {
        type: 'examinerExplains',
        stage: 'Exam prep',
        label: 'Common mistakes',
        examinerExplains: {
          opening: 'Before you practise, here are the four most common mistakes on Black Death questions.',
          tips: [
            {
              heading: 'Mistake 1 — description only',
              body: '"The Black Death killed lots of people." This identifies what happened but explains nothing. No marks for description alone.',
            },
            {
              heading: 'Mistake 2 — missing explanation',
              body: '"The Black Death caused higher wages." True — but the examiner needs the chain: why did it cause higher wages? Population fell → labour shortage → workers became scarce → wages rose.',
            },
            {
              heading: 'Mistake 3 — historically inaccurate',
              body: '"The Black Death improved medicine." This is wrong. Medicine changed very little. The same explanations (God, miasma, humours) continued after 1349. Writing this loses marks.',
            },
            {
              heading: 'Mistake 4 — forgetting medieval beliefs',
              body: 'Always include: God, miasma, and astrology. Medieval people used existing beliefs to explain the plague — they did not understand the real cause. Examiners check for this.',
            },
          ],
          closing: 'Avoid these and you\'re already ahead of most answers.',
        },
      },

      {
        type: 'faceExaminer',
        stage: 'Exam prep',
        label: 'Face the Examiner',
        examiner: {
          type: '4-mark-explain',
          board: 'edexcel',
          subject: 'history',
          topic: 'black-death',
          difficulty: 'standard',

          question: 'Explain one way religious beliefs affected responses to the Black Death. [4 marks]',
          marks: 4,
          mark: 1,
          summary: 'This identifies what happened but does not explain why. It needs the causal chain to reach higher marks.',

          markScheme: `Level 2 (3–4 marks): Developed explanation linking religious belief to a specific treatment or response, with the full chain (belief → response → why it followed logically).
Level 1 (1–2 marks): Simple identification of a religious response with little or no explanation of why it was chosen.
Award marks for any explained response including:
- Prayer, fasting or pilgrimage — must explain why (belief that illness = God's punishment for sin)
- Flagellants — must explain the religious logic (public suffering to earn God's mercy)
- Priests tending the sick — must link to Christian duty and belief in God's will
Do NOT award for identifying practices without explaining the religious reasoning.`,

          sampleAnswer: `People prayed during the Black Death.`,

          annotations: [
            {
              id: 'ann1',
              target: 'People prayed during the Black Death.',
              occurrence: 1,
              type: 'weak',
              comment: 'Identifies what happened — but does not explain why prayer was chosen, or what the religious belief was.',
            },
          ],

          improvementPrompts: {
            ann1: {
              prompt: '+ Explain WHY people prayed',
              placeholder: 'e.g. People prayed because they believed the plague was God\'s punishment for sin. If God had sent the disease, then prayer and repentance were the logical response — asking for God\'s forgiveness to end the plague...',
            },
          },

          criteriaOptions: [
            'Named the response',
            'Explained the belief',
            'Linked belief to treatment',
            'Used specific evidence',
            'Developed explanation',
            'Too vague',
            'Repeats the question',
            'Missing explanation',
          ],
        },
      },

      {
        stage: 'Exam prep',
        label: 'Improving the answer',
        kicker: 'Building to full marks',
        heading: 'Improving the answer',
        sub: 'See how each step adds marks.',
        blocks: [
          {
            type: 'explainReveal',
            intro: 'Here\'s how to turn a 1-mark sentence into a full 4-mark explanation.',
            atmosphereImage: '/headers/history-medicine-medieval-scripture.png',
            steps: [
              {
                id: 'original',
                statement: 'Weak answer — 1 mark:',
                emphasis: '"People prayed during the Black Death."',
                detail: 'Identifies what happened but explains nothing. No causal chain, no belief stated.',
              },
              {
                id: 'better',
                statement: 'Better — 2 marks:',
                emphasis: '"People prayed because they believed the disease was punishment from God."',
                detail: 'Now connects the action to the belief. The "because" is doing the work here.',
              },
              {
                id: 'best',
                statement: 'Strong answer — 4 marks:',
                emphasis: '"People prayed and performed acts of repentance — they hoped to persuade God to forgive humanity and end the plague."',
                detail: 'Explains the belief AND the intended consequence. Notice: it answers why it made sense, not just what they did.',
              },
            ],
            reflectionPrompt: 'The answer explains belief and consequence — not just what happened. That is what earns full marks.',
          },
        ],
      },

      {
        type: 'faceExaminer',
        stage: 'Exam prep',
        label: 'Face the Examiner — similarity',
        examiner: {
          type: '4-mark-explain',
          board: 'edexcel',
          subject: 'history',
          topic: 'black-death',
          difficulty: 'standard',

          question: 'Explain one similarity between medieval medicine and Black Death treatments. [4 marks]',
          marks: 4,
          mark: 4,
          summary: 'A strong answer — it identifies the similarity, names a specific example, and explains the reasoning.',

          markScheme: `Level 2 (3–4 marks): Identifies a valid similarity with developed explanation, using specific evidence.
Level 1 (1–2 marks): Simple identification of a similarity with little or no explanation.
Award marks for:
- Both relied on traditional beliefs rather than scientific evidence (e.g. Four Humours, miasma, God's punishment)
- Both used the same practitioners and treatments (physicians, bloodletting, prayer)
- Both lacked understanding of bacteria or germ theory
Explanation must connect the similarity to why it existed.`,

          sampleAnswer: `One similarity was that both relied on traditional beliefs rather than scientific evidence. For example, bloodletting was used before and during the Black Death because people continued to believe in the Four Humours. Medieval doctors responded to the plague using the same medical framework they had always used — they didn't change their approach because their explanation of disease hadn't changed.`,

          annotations: [
            {
              id: 'ann1',
              target: 'both relied on traditional beliefs rather than scientific evidence.',
              occurrence: 1,
              type: 'strong',
              comment: 'States the similarity clearly and accurately.',
            },
            {
              id: 'ann2',
              target: 'bloodletting was used before and during the Black Death because people continued to believe in the Four Humours.',
              occurrence: 1,
              type: 'strong',
              comment: 'Specific named example with explanation — this is what earns marks.',
            },
            {
              id: 'ann3',
              target: 'they didn\'t change their approach because their explanation of disease hadn\'t changed.',
              occurrence: 1,
              type: 'strong',
              comment: 'Excellent conclusion — explains WHY the similarity existed.',
            },
          ],

          improvementPrompts: {},

          criteriaOptions: [
            'Similarity clearly stated',
            'Specific named example',
            'Explained why similar',
            'Developed explanation',
            'Links to beliefs',
            'Too vague',
            'Missing example',
            'Missing explanation',
          ],
        },
      },

      {
        type: 'faceExaminer',
        stage: 'Exam prep',
        label: 'Face the Examiner — 8 marks',
        examiner: {
          type: '8-mark-explain',
          board: 'edexcel',
          subject: 'history',
          topic: 'black-death',
          difficulty: 'challenging',

          question: 'Explain two consequences of the Black Death in England. [8 marks]',
          marks: 8,
          mark: 4,
          summary: 'Identifies two consequences and understands the basic link to labour shortages and wages. Missing precise evidence, deeper explanation, and the "why it mattered" step.',

          markScheme: `Level 3 (6–8 marks): Detailed explanation of two consequences with developed reasoning, showing how the Black Death caused each one.
Level 2 (3–5 marks): Some explanation of two consequences, but at least one lacks development of the causal chain.
Level 1 (1–2 marks): Simple identification of consequences with little or no explanation.
Award marks for any two of (each requiring causal explanation):
- Labour shortage → higher wages → challenge to feudal system (must show the full chain)
- Church authority weakened → people lost faith → contributed to later social unrest (must explain why)
- Social disruption → Peasants' Revolt 1381 (must link Black Death to conditions that led to revolt)
- Deserted villages / economic disruption (must explain the mechanism)
Do NOT award for identifying consequences without explaining HOW the Black Death caused them.`,

          sampleAnswer: `One consequence of the Black Death was that lots of people died. This meant that there were fewer workers. Another consequence was that wages increased because there were fewer people available to work.`,

          annotations: [
            {
              id: 'ann1',
              target: 'lots of people died.',
              occurrence: 1,
              type: 'weak',
              comment: 'Vague — "lots of people" is not precise. How many? Around one-third.',
            },
            {
              id: 'ann2',
              target: 'This meant that there were fewer workers.',
              occurrence: 1,
              type: 'strong',
              comment: 'Good — identifies the immediate consequence. But the chain stops here.',
            },
            {
              id: 'ann3',
              target: 'wages increased because there were fewer people available to work.',
              occurrence: 1,
              type: 'weak',
              comment: 'Correct but underdeveloped — needs the full chain and why this mattered.',
            },
          ],

          improvementPrompts: {
            ann1: {
              prompt: '+ Add precise evidence',
              placeholder: 'e.g. Around one-third of England\'s population died — in some villages, no one survived...',
            },
            ann3: {
              prompt: '+ Explain why higher wages mattered',
              placeholder: 'e.g. This challenged the feudal system, where peasants were previously bound to their lord with no ability to negotiate conditions...',
            },
          },

          criteriaOptions: [
            'Two clear consequences',
            'Precise evidence used',
            'Causal chain explained',
            'Developed explanation',
            'Links to feudal system',
            'Too vague',
            'Missing causal chain',
            'Missing second consequence',
          ],
        },
      },

      {
        stage: 'Exam prep',
        label: 'Turning 4 marks into 8 marks',
        kicker: 'Upgrading the answer',
        heading: 'Turning 4 marks into 8 marks',
        sub: 'Insert these into the answer — step by step.',
        blocks: [
          {
            type: 'explainReveal',
            intro: 'The 4/8 answer was on the right track — it just stopped too soon. Here\'s what to add.',
            atmosphereImage: '/figures/history/medicine/black-death/labour-shortage.png',
            steps: [
              {
                id: 'precise',
                statement: 'Insert precise evidence:',
                emphasis: '"Around one-third of England\'s population died."',
                detail: 'Replace "lots of people died" with specific scale. Examiners reward precision.',
              },
              {
                id: 'fewer-workers',
                statement: 'This meant that...',
                emphasis: 'There were far fewer workers available to farm the land.',
                detail: 'Immediate consequence — name it specifically, not just "fewer workers".',
              },
              {
                id: 'labour',
                statement: 'Which led to...',
                emphasis: 'Labour shortages.',
                detail: 'Name it. "Labour shortage" is the historical term — use it.',
              },
              {
                id: 'valuable',
                statement: 'Workers became more valuable.',
                emphasis: 'This is the mechanism — what changed in the relationship between workers and landowners.',
                detail: 'This step explains WHY wages could rise. Don\'t skip it.',
              },
              {
                id: 'wages',
                statement: 'Which led to...',
                emphasis: 'Higher wages and better conditions.',
                detail: 'The economic result. Follow through to the outcome.',
              },
              {
                id: 'significance',
                statement: 'This changed relationships between workers and landowners.',
                emphasis: 'Ask yourself: "So what happened next?"',
                detail: 'This is the significance. Connecting it to the feudal system earns top marks.',
              },
            ],
            reflectionPrompt: 'Ask yourself: "So what happened next?" — that question drives answers from 4 marks to 8.',
          },
        ],
      },

      {
        type: 'faceExaminer',
        stage: 'Exam prep',
        label: 'Face the Examiner — full marks',
        examiner: {
          type: '8-mark-explain',
          board: 'edexcel',
          subject: 'history',
          topic: 'black-death',
          difficulty: 'challenging',

          question: 'Explain two consequences of the Black Death in England. [8 marks]',
          marks: 8,
          mark: 8,
          summary: 'A full-mark answer — two consequences explained with precise evidence, causal chains, and clear explanation of why each consequence mattered.',

          markScheme: `Level 3 (6–8 marks): Detailed explanation of two consequences with developed reasoning, showing how the Black Death caused each one.
Level 2 (3–5 marks): Some explanation of two consequences, but at least one lacks development of the causal chain.
Level 1 (1–2 marks): Simple identification of consequences with little or no explanation.`,

          sampleAnswer: `One consequence of the Black Death was a shortage of workers. Around one-third of England's population died, meaning there were far fewer people available to work on farms. This led to labour shortages and made surviving workers more valuable. As a result, many workers could demand higher wages and better conditions. This challenged the feudal system, where peasants had previously been bound to their lord with no ability to negotiate.

Another consequence was social and economic change. Many villages lost large numbers of people and some settlements were abandoned entirely. Because workers were scarce, landowners had to compete for labour. This changed relationships between workers and landowners, and contributed to the social unrest that led to the Peasants' Revolt of 1381.`,

          annotations: [
            {
              id: 'ann1',
              target: 'Around one-third of England\'s population died',
              occurrence: 1,
              type: 'strong',
              comment: 'Precise evidence — "around one-third" is far stronger than "lots of people".',
            },
            {
              id: 'ann2',
              target: 'This led to labour shortages and made surviving workers more valuable.',
              occurrence: 1,
              type: 'strong',
              comment: 'Full causal chain: deaths → shortage → increased value of workers.',
            },
            {
              id: 'ann3',
              target: 'This challenged the feudal system, where peasants had previously been bound to their lord with no ability to negotiate.',
              occurrence: 1,
              type: 'strong',
              comment: 'Excellent — explains the significance. Shows why this consequence mattered.',
            },
            {
              id: 'ann4',
              target: 'contributed to the social unrest that led to the Peasants\' Revolt of 1381.',
              occurrence: 1,
              type: 'strong',
              comment: 'Strong conclusion — links consequence to longer-term historical significance.',
            },
          ],

          improvementPrompts: {},

          criteriaOptions: [
            'Two clear consequences',
            'Precise evidence used',
            'Causal chain explained',
            'Significance stated',
            'Links to feudal system',
            'Links to Peasants\' Revolt',
            'Developed explanation',
            'Strong conclusion',
          ],
        },
      },

      {
        type: 'quickRecall',
        stage: 'Exam prep',
        label: 'Final chapter challenge',
        questions: [
          {
            type: 'choice',
            question: 'What year did the Black Death reach England?',
            options: ['1348', '1350', '1345', '1381'],
            correct: 0,
            explanation: '1348 — ships arrived at Melcombe in Dorset in June 1348, bringing the plague to England.',
          },
          {
            type: 'choice',
            question: 'What was miasma?',
            options: ['Poisonous air believed to cause disease', 'Bacteria carried by fleas', 'God\'s punishment for sin', 'An imbalance of the Four Humours'],
            correct: 0,
            explanation: 'Miasma meant poisonous air from rotting matter. Not germs — the smell itself was thought to carry disease.',
          },
          {
            type: 'choice',
            question: 'Why did people pray during the Black Death?',
            options: ['They believed God had sent the disease as punishment for sin', 'Prayer was proven to cure plague', 'The Church ordered everyone to pray', 'They had no other option'],
            correct: 0,
            explanation: 'If illness was God\'s punishment, prayer and repentance were the logical response — they hoped God would forgive humanity and end the plague.',
          },
          {
            type: 'choice',
            question: 'What actually caused the Black Death?',
            options: ['Plague bacteria (Yersinia pestis) carried by fleas on rats', 'Poisonous air from plague pits', 'God\'s punishment for sin', 'Planetary alignment'],
            correct: 0,
            explanation: 'Yersinia pestis bacteria, carried by fleas on black rats. This was not discovered until 1894 — 546 years after the Black Death.',
          },
          {
            type: 'choice',
            question: 'What changed significantly after the Black Death?',
            options: ['Society — labour shortages led to higher wages', 'Medicine — doctors discovered the real cause', 'The Church — it became more powerful', 'Astrology — people stopped using it'],
            correct: 0,
            explanation: 'Society changed dramatically — labour shortages, higher wages, weakened Church authority. But medicine barely changed at all.',
          },
          {
            type: 'choice',
            question: 'What stayed the same after the Black Death?',
            options: ['Medical beliefs — the same explanations continued', 'Peasant wages — they stayed low', 'The Church\'s authority — it remained strong', 'Village populations — they recovered quickly'],
            correct: 0,
            explanation: 'Medical beliefs stayed the same — doctors continued to blame God, miasma, and humoral imbalance. The actual cause was not discovered until 1894.',
          },
        ],
      },

    ],
  },

  {
    id: 'mod2',
    subject: 'History',
    number: 3,
    title: 'Renaissance & the Plague',
    subtitle: 'Challenge & Continuity',
    era: 'c1500–c1700',
    icon: '🔬',
    color: '#D4950A',
    colorLight: 'rgba(212,149,10,.12)',
    hook: {
      scenario: {
        location: 'Italy, 1543',
        hint: 'A patient is dying. Two doctors can\'t agree on how to treat him.',
        intro: 'A patient is seriously ill. Two doctors disagree.',
        quotes: [
          { role: 'One doctor says:', text: '"Balance the Four Humours."' },
          { role: 'Another says:', text: '"We should dissect the body properly and study anatomy."' },
        ],
        bulletHeading: 'Meanwhile:',
        items: [
          'plague spreads through crowded streets',
          'people still carry flowers against bad air',
          "Galen's textbooks still control universities",
          'Medicine is beginning to change...',
        ],
      },
      statement: 'By the Renaissance, doctors had completely abandoned medieval medical ideas.',
      isTrue: false,
      accentWords: ['completely abandoned', 'medieval medical ideas'],
      explanation: "Renaissance thinkers like Vesalius corrected Galen's errors — but universities kept teaching the same old ideas for decades. Change was real, but it was slow.",
      wrongFeedback: "It feels like that — Vesalius was correcting Galen! But at universities, it was business as usual.",
      correctFeedback: "Exactly. Change happened at the edges. The core stayed medieval for much longer.",
      loadingText: 'The history is more complicated than it looks…',
      bigQuestion: 'So what actually changed — and what stayed the same?',
      revealHeader: 'Change was slow. Very slow.',
      revealItems: [
        {
          emoji: '🔬',
          label: 'Anatomy improved — but treatments didn\'t',
          detail: 'Vesalius corrected 300+ of Galen\'s errors (1543). Harvey proved blood circulates (1628). But doctors still bled patients and used purging. New knowledge, same old cures.',
          color: '#D4950A',
          bg: 'rgba(212,149,10,.08)',
        },
        {
          emoji: '📚',
          label: 'Galen still dominated universities',
          detail: "Medieval ideas weren't swept away overnight. Most physicians still swore by Galen. The printing press spread new ideas — but also spread old ones further.",
          color: '#C47828',
          bg: 'rgba(196,120,40,.08)',
        },
        {
          emoji: '💀',
          label: 'The Great Plague (1665) proved the limits',
          detail: "London lost 100,000 people in one outbreak. Despite all the Renaissance progress, nobody could explain or stop the plague. The tools weren't there yet.",
          color: '#FF5D73',
          bg: 'rgba(255,93,115,.08)',
        },
      ],
      punchline: 'Renaissance medicine changed knowledge, not treatment. This module explains why that gap mattered.',
    },
    intro: {
      learningGoals: [
        'Describe what changed in medicine during the Renaissance',
        'Explain the contributions of Vesalius, Harvey and Paré',
        'Explain why the Great Plague showed the limits of Renaissance medicine',
        'Assess how far the Renaissance was a turning point in the history of medicine',
      ],
    },
    outcomes: {
      intro: "You're about to see how Renaissance artists and scientists started dismantling a thousand years of medical dogma.",
      bullets: [
        "Explain what Vesalius discovered — and why the Church didn't like it",
        "Describe how Harvey's blood circulation theory changed everything",
        'Understand why the Plague kept killing even as knowledge improved',
        'See the gap between knowing more and being able to treat better',
      ],
    },

    screens: [
      {
        type: 'priorKnowledgeRecall',
        chapterTitle: 'Medieval medicine: beliefs and causes of disease',
        prompt: 'What do you remember from the last chapter?',
        backgroundImage: '/headers/history-medicine-through-time.png',
        sourceContent: `GCSE History: Medieval Medicine — Beliefs and Causes of Disease (c.1250–c.1500)

Key figures:
Hippocrates (ancient Greek doctor) argued illness had natural causes, not punishment from gods. He promoted observation of symptoms, recording of cases, and logical reasoning. His Four Humours theory said health depended on balance between four bodily fluids: blood, phlegm, yellow bile, and black bile. Imbalance caused disease.

Galen (Roman doctor, c.129–216 AD) built on Hippocrates. He treated gladiators, dissected animals, and wrote medical books copied and taught in universities for over 1,400 years. His Theory of Opposites: treat illness with its opposite quality — a hot, feverish illness with cold remedies; a cold, wet condition with warm, dry treatments. Galen made errors (blood made in liver; heart septum had holes), but the Church backed his authority so he was rarely questioned.

Causes of disease — four main theories:
1. Four Humours: disease caused by imbalance of blood, phlegm, yellow bile, or black bile.
2. God and sin: illness was God's punishment for sin, or a test of faith. Treatments: prayer, confession, repentance, pilgrimage, fasting, visiting holy relics.
3. Miasma: bad air from rotting matter, sewers, marshes caused disease. The smell itself was believed to carry illness.
4. Astrology: planets and zodiac signs influenced the body. Physicians used the Zodiac Man diagram and astrological calendars to time treatments. The Paris Medical Faculty blamed the Black Death on a triple conjunction of Saturn, Jupiter, and Mars in 1345.

Medical practitioners:
- Physician: university-trained, expensive, used Latin, diagnosed via uroscopy (examining urine colour using a jordan flask and urine charts) and astrological charts.
- Barber surgeon: practical tradesman, moderate cost, performed bloodletting (removing blood by cutting a vein or applying leeches), tooth-pulling, and minor surgery.
- Wise woman: no formal training, cheapest option, used herbal remedies and poultices. Most accessible to ordinary people in villages.
- Priest: offered spiritual treatment — prayer, blessing, repentance. Believed illness began with sin.

Treatments:
- Bloodletting: removing blood (by cutting or leeches) to restore humoral balance.
- Purging: inducing vomiting or diarrhoea to expel excess humours.
- Herbal remedies, diet change, rest: cooling foods (cucumber) for fever; dry foods for cold conditions.
- Prayer, pilgrimage, confession, fasting: for illness believed to be caused by God.

The Church's role:
The Church ran hospitals (St Bartholomew's, founded 1123) and copied ancient medical texts in monasteries. It preserved and promoted Galen's work because his ideas of bodily balance fitted Christian views of perfect divine design. The Church discouraged human dissection (belief in bodily resurrection) and made questioning Galen's authority difficult. This slowed medical progress significantly.

The Black Death (1348–49):
Arrived in England in 1348, killing roughly one-third of the population. Blamed on miasma, God's punishment, and planetary alignment. Actual cause: Yersinia pestis bacteria spread by fleas on rats — unknown for another 500 years. Medieval explanations were wrong but internally logical given available knowledge.

Why medieval ideas survived so long:
The Church preserved ancient texts and backed Galen's authority. Without microscopes or germ theory, no better explanation existed. Humoral logic was internally consistent — wrong premises, logical conclusions. Some treatments accidentally helped (rest, fluids, herbal remedies), making the flawed theory seem credible. Multiple explanations coexisted — people believed God, humours, miasma, and astrology simultaneously.`,
        concepts: [
          { tag: 'hippocrates',             label: 'Hippocrates' },
          { tag: 'four-humours',            label: 'Four humours' },
          { tag: 'galen',                   label: 'Galen' },
          { tag: 'theory-of-opposites',     label: 'Theory of Opposites' },
          { tag: 'miasma',                  label: 'Miasma theory' },
          { tag: 'god-punishment',          label: 'God and sin' },
          { tag: 'astrology',               label: 'Astrology and the zodiac man' },
          { tag: 'bloodletting',            label: 'Bloodletting' },
          { tag: 'uroscopy',                label: 'Uroscopy' },
          { tag: 'physician',               label: 'Physician' },
          { tag: 'barber-surgeon',          label: 'Barber surgeon' },
          { tag: 'wise-woman',              label: 'Wise woman' },
          { tag: 'church-role',             label: "Church's role in medicine" },
          { tag: 'black-death',             label: 'The Black Death (1348–49)' },
          { tag: 'supernatural-vs-natural', label: 'Supernatural vs natural causes' },
          { tag: 'herbal-remedies',         label: 'Herbal remedies and diet' },
          { tag: 'why-ideas-survived',      label: 'Why medieval ideas survived so long' },
        ],
      },
      // ── Section 2 — Learning Chunk 1: The Bridge ────────────────────────────

      {
        type: 'visualLearning',
        stage: 'The bridge',
        label: 'Echoes of medieval medicine',
        scenes: [
          {
            image: '/figures/history/medicine/medieval/vl-monks-books.webp',
            imagePosition: 'center top',
            headline: 'Medieval medicine\ndidn\'t disappear.',
            body: 'The Renaissance didn\'t erase a thousand years of thinking overnight.',
          },
          {
            image: '/figures/history/medicine/medieval/vl-monks-books.webp',
            imagePosition: 'center 30%',
            headline: 'Language survived.',
            body: '"Melancholy", "phlegmatic", "sanguine", "bilious" — all come from the Four Humours. These words still carry their medieval meaning.',
          },
          {
            image: '/figures/history/medicine/medieval/vl-monks-books.webp',
            imagePosition: 'center 60%',
            headline: 'Remedies survived.',
            body: 'Many herbal treatments used in the medieval period are still in use today. Some have since been proven effective by modern research.',
          },
          {
            finalReveal: true,
            headline: 'But something was\nabout to change.',
            body: 'The idea that disease could be studied, observed, and understood was about to collide with a new way of thinking about the world.',
          },
        ],
      },

      {
        type: 'conceptReveal',
        stage: 'The bridge',
        label: 'A world about to change',
        steps: [
          {
            eyebrow: 'c.1400–1600',
            mainText: 'The Renaissance encouraged artists, thinkers, and scientists to question ancient authority.',
            supportText: 'For centuries, Galen\'s word had been law. Now people asked: what if he was wrong?',
            backgroundImage: '/headers/history-medicine-germ-bridge.png',
          },
          {
            mainText: 'The printing press (1440s) meant new ideas could spread across Europe in months, not decades.',
            supportText: 'Previously, a single medical manuscript took months to copy by hand. Now a book could reach thousands.',
            backgroundImage: '/headers/history-medicine-germ-bridge.png',
          },
          {
            eyebrow: 'The key tension',
            mainText: 'Renaissance medicine changed knowledge far more than it changed treatment.',
            supportText: 'Doctors were discovering new truths about the body — but patients were still being bled and purged.',
            backgroundImage: '/headers/history-medicine-germ-bridge.png',
          },
        ],
      },

      {
        type: 'quickRecall',
        stage: 'The bridge',
        label: 'Before we go further',
        questions: [
          {
            type: 'choice',
            question: 'What theory said illness was caused by an imbalance of four bodily fluids?',
            options: ['The Four Humours', 'Miasma theory', 'Astrology', 'Germ theory'],
            correct: 0,
            explanation: 'The Four Humours — blood, phlegm, yellow bile, black bile — underpinned medieval medicine and Galen\'s teaching.',
          },
          {
            type: 'choice',
            question: 'Which ancient authority\'s ideas were still taught in Renaissance universities?',
            options: ['Galen', 'Vesalius', 'Pasteur', 'Harvey'],
            correct: 0,
            explanation: 'Galen\'s texts continued to dominate university medicine well into the Renaissance — even as new evidence emerged.',
          },
          {
            type: 'choice',
            question: 'Why did the Church preserve and promote Galen\'s medical ideas?',
            options: [
              'His idea of bodily balance fitted their view of God\'s perfect design',
              'He was a Christian doctor who referenced the Bible',
              'The Church paid him to write medical textbooks',
              'He was the only doctor who could speak Latin',
            ],
            correct: 0,
            explanation: 'Galen\'s concept of a body in perfect balance reinforced Christian ideas about divine order. The Church gave his authority serious backing.',
          },
        ],
      },

      // ── Section 3 — Learning Chunk 2: Vesalius ──────────────────────────────

      {
        type: 'keyFigureReveal',
        stage: 'Vesalius',
        tag: 'vesalius',
        label: 'Vesalius',
        portrait: '/images/vesalius-1543.png',
        name: 'Andreas Vesalius',
        role: 'Anatomist & Medical Revolutionary',
        sections: [
          {
            title: 'Who was he?',
            icon: 'ancient-figure',
            lines: [
              'A Flemish physician and anatomist working in Renaissance Italy.',
              'Unlike Galen, Vesalius dissected human bodies himself rather than relying on ancient texts or animal dissection.',
            ],
          },
          {
            title: 'De Humani Corporis Fabrica (1543)',
            icon: 'knowledge',
            lines: [
              'Published in the same year as Copernicus challenged the Earth-centred universe.',
              'A groundbreaking illustrated anatomy textbook based on direct human dissection.',
            ],
          },
          {
            title: 'What he found',
            icon: 'medicine',
            lines: [
              'Vesalius corrected over 300 errors in Galen\'s work.',
              'Key corrections: the jaw is one bone (not two), the septum of the heart has no holes, the liver does not have five lobes.',
            ],
          },
          {
            title: 'Why it mattered',
            icon: 'legacy',
            lines: [
              'Vesalius proved that direct observation was more reliable than trusting ancient authority.',
              'This principle — look and test, rather than accept — became the foundation of modern science.',
            ],
          },
        ],
      },

      {
        stage: 'Vesalius',
        label: 'The anatomy revolution',
        kicker: 'Breaking with Galen',
        heading: 'What Vesalius actually found',
        sub: 'And why it mattered for 400 years of medicine.',
        blocks: [
          {
            type: 'explainReveal',
            intro: 'Vesalius didn\'t just correct Galen — he changed how doctors thought knowledge should work.',
            atmosphereImage: '/headers/history-medicine-germ-bridge.png',
            steps: [
              {
                id: 'galens-errors',
                statement: 'Galen made hundreds of errors because he mostly dissected',
                emphasis: 'animals, not humans.',
                detail: 'Galen dissected pigs, monkeys and goats. He assumed human anatomy was identical. It wasn\'t.',
              },
              {
                id: 'vesalius-dissects',
                statement: 'Vesalius dissected human bodies and found',
                emphasis: 'over 300 mistakes in Galen\'s work.',
                detail: 'Including the jaw (one bone, not two) and the heart septum (no holes, despite Galen\'s claim).',
              },
              {
                id: 'authority-challenged',
                statement: 'For the first time, an ancient authority\'s work was challenged',
                emphasis: 'with observable, repeatable evidence.',
                detail: 'This was not just a correction of facts — it was a new method: observe, don\'t just accept.',
              },
              {
                id: 'knowledge-not-treatment',
                statement: 'But anatomy improved faster than treatment.',
                emphasis: 'Doctors still bled patients. The Four Humours still explained illness.',
                detail: 'Better knowledge of the body did not immediately mean better cures. That gap would last another century.',
              },
            ],
            reflectionPrompt: 'Why did correcting Galen\'s anatomy not immediately change how doctors treated patients?',
          },
        ],
      },

      {
        type: 'quickRecall',
        stage: 'Vesalius',
        label: 'Vesalius check',
        questions: [
          {
            type: 'choice',
            question: 'What was the name of Vesalius\'s 1543 anatomy textbook?',
            options: [
              'De Humani Corporis Fabrica',
              'De Rerum Natura',
              'Exercitatio Anatomica',
              'Ars Medica',
            ],
            correct: 0,
            explanation: 'De Humani Corporis Fabrica (On the Fabric of the Human Body) was based on direct human dissection and corrected over 300 of Galen\'s errors.',
          },
          {
            type: 'choice',
            question: 'Why had Galen made so many anatomical errors?',
            options: [
              'He dissected animals rather than human bodies',
              'He was not actually a doctor',
              'The Church forced him to write incorrect facts',
              'He copied earlier, less accurate writers',
            ],
            correct: 0,
            explanation: 'Galen dissected pigs, monkeys and goats and assumed human anatomy was the same. It wasn\'t.',
          },
          {
            type: 'choice',
            question: 'Despite correcting Galen\'s anatomy, what did most Renaissance doctors still use to treat illness?',
            options: [
              'Bloodletting and the Four Humours',
              'Surgery and antiseptics',
              'Germ theory and vaccines',
              'Chemical remedies from Paracelsus',
            ],
            correct: 0,
            explanation: 'New anatomical knowledge didn\'t immediately change treatments. Bloodletting and humoural theory persisted for decades after Vesalius.',
          },
        ],
      },

      // ── Section 4 — Learning Chunk 3: Harvey & Paré ─────────────────────────

      {
        type: 'conceptReveal',
        stage: 'Harvey and Paré',
        label: 'William Harvey',
        steps: [
          {
            eyebrow: '1628',
            mainText: 'Galen had claimed the liver constantly produced new blood — and the body used it up.',
            supportText: 'This explained why bloodletting seemed logical: too much blood? Remove some.',
            backgroundImage: '/headers/history-medicine-germ-bridge.png',
          },
          {
            mainText: 'Harvey proved that blood circulates continuously around the body, pumped by the heart.',
            supportText: 'He calculated the volume of blood in the body was too large to be made fresh each day — so it must be reused.',
            backgroundImage: '/headers/history-medicine-germ-bridge.png',
          },
          {
            eyebrow: 'The key limitation',
            mainText: 'Harvey could not explain what blood actually does — so treatments didn\'t immediately change.',
            supportText: 'Without knowing blood carries oxygen and removes waste, doctors had no reason to stop bloodletting.',
            backgroundImage: '/headers/history-medicine-germ-bridge.png',
          },
        ],
      },

      {
        type: 'conceptReveal',
        stage: 'Harvey and Paré',
        label: 'Ambroise Paré',
        steps: [
          {
            eyebrow: 'France, 1536',
            mainText: 'Ambroise Paré was a French military surgeon treating soldiers wounded in battle.',
            supportText: 'Gunshot wounds were treated by pouring boiling oil into them — believed to neutralise gunpowder poison.',
            backgroundImage: '/headers/history-medicine-germ-bridge.png',
          },
          {
            mainText: 'During one battle, Paré ran out of oil. He improvised with a soothing ointment made from egg yolk, rose oil and turpentine.',
            supportText: 'The next morning, patients treated with the ointment were in far less pain and recovering better.',
            backgroundImage: '/headers/history-medicine-germ-bridge.png',
          },
          {
            eyebrow: 'The legacy',
            mainText: 'Paré also stopped cauterising blood vessels with hot irons — he tied them off instead.',
            supportText: 'He designed artificial limbs and wrote surgical guides. His work reduced the horror of military surgery significantly.',
            backgroundImage: '/headers/history-medicine-germ-bridge.png',
          },
        ],
      },

      {
        type: 'matchingTask',
        stage: 'Harvey and Paré',
        label: 'Who did what?',
        subject: 'History',
        title: 'Match the figure to their contribution',
        instruction: 'Connect each Renaissance figure to their key contribution.',
        weakAreaCategory: 'Renaissance medicine key figures',
        backgroundImage: '/headers/history-medicine-germ-bridge.png',
        pairs: [
          {
            id: 'vesalius-correction',
            term: 'Vesalius (1543)',
            answer: 'Corrected over 300 of Galen\'s anatomical errors using direct human dissection.',
            weakGroup: 'Key figures',
          },
          {
            id: 'harvey-circulation',
            term: 'Harvey (1628)',
            answer: 'Proved blood circulates continuously around the body, pumped by the heart.',
            weakGroup: 'Key figures',
          },
          {
            id: 'pare-ointment',
            term: 'Paré (1536)',
            answer: 'Abandoned boiling oil for wound treatment after discovering a soothing ointment worked better.',
            weakGroup: 'Key figures',
          },
          {
            id: 'printing-press',
            term: 'Printing press',
            answer: 'Allowed new medical ideas to spread rapidly across Europe.',
            weakGroup: 'Context',
          },
          {
            id: 'knowledge-not-treatment',
            term: 'Knowledge vs treatment',
            answer: 'Renaissance medicine improved understanding of the body faster than it improved everyday treatments.',
            weakGroup: 'Themes',
          },
        ],
        completion: {
          title: 'Figures connected',
          body: 'Vesalius, Harvey and Paré each challenged a different part of Galen\'s legacy.\n\nBut all three showed the same thing: observation matters more than tradition.',
        },
      },

      // ── Section 5 — Learning Chunk 4: The Royal Society & Change vs Continuity

      {
        type: 'conceptReveal',
        stage: 'Change and continuity',
        label: 'The Royal Society',
        steps: [
          {
            eyebrow: '1660',
            mainText: 'The Royal Society was founded as a formal institution where experiments were shared, tested and debated.',
            supportText: 'Its motto: Nullius in Verba — "Take nobody\'s word for it." Evidence, not authority, was the new standard.',
            backgroundImage: '/headers/history-medicine-medieval-scripture.png',
          },
          {
            mainText: 'For the first time, scientific discoveries could be published, challenged, and built upon by others.',
            supportText: 'This network directly connected Vesalius, Harvey and the later work of Jenner, Pasteur and Koch.',
            backgroundImage: '/headers/history-medicine-medieval-scripture.png',
          },
          {
            eyebrow: 'Exam point',
            mainText: 'The Royal Society represents a shift in how knowledge itself was validated.',
            supportText: 'Not "Galen said it" but "we tested it, published it, and others repeated it." This is the foundation of modern medicine.',
            backgroundImage: '/headers/history-medicine-medieval-scripture.png',
          },
        ],
      },

      {
        type: 'visualNarrative',
        stage: 'Change and continuity',
        label: 'The Great Plague, 1665',
        beats: [
          {
            image: '/images/great-plague-1665.png',
            imagePosition: 'center center',
            imageFilter: 'brightness(0.85) saturate(0.7)',
            label: 'LONDON, 1665',
            headline: 'Despite everything,\nthe plague returned.',
            body: 'A hundred thousand dead. Anatomical breakthroughs meant nothing.\nPeople still blamed bad air, sin, and the stars.',
          },
          {
            image: '/images/great-plague-1665.png',
            imagePosition: 'center 30%',
            imageOpacity: 0.55,
            facts: [
              'The Great Plague killed around 100,000 people in London in 1665.',
              'Despite Renaissance advances, people still blamed miasma, the Four Humours, and God\'s punishment.',
              'The government\'s response was more organised than in 1348 — quarantine, pest houses, bills of mortality.',
              'The mayor ordered cats and dogs killed, believing they spread plague. Fewer cats meant more rats, more fleas, more plague.',
            ],
            conclusion: 'Renaissance medicine changed knowledge more than treatment.\nThe gap between understanding and curing would take two more centuries to close.',
          },
        ],
      },

      {
        type: 'naturalSupernaturalSwipe',
        stage: 'Change and continuity',
        label: 'Change vs continuity',
        columns: [
          { label: 'CHANGED\nNew in the Renaissance', color: '#D4950A', colorRgb: '212,149,10', bg: 'rgba(212,149,10,.07)' },
          { label: 'CONTINUED\nStayed the same', color: '#A89070', colorRgb: '168,144,112', bg: 'rgba(168,144,112,.07)' },
        ],
        items: [
          { label: 'Understanding of human anatomy', col: 0, explanation: 'Changed — Vesalius corrected over 300 of Galen\'s anatomical errors through direct human dissection.' },
          { label: 'Bloodletting as a treatment', col: 1, explanation: 'Continued — even after Harvey proved blood circulates, bloodletting persisted well into the 19th century.' },
          { label: 'How new ideas were validated', col: 0, explanation: 'Changed — the Royal Society demanded observation and experiment. "Take nobody\'s word for it."' },
          { label: 'Blaming plague on miasma and sin', col: 1, explanation: 'Continued — even in 1665, the Great Plague was still blamed on bad air and God\'s punishment.' },
          { label: 'Using herbal remedies and purging', col: 1, explanation: 'Continued — these treatments based on the Four Humours carried on throughout the Renaissance and beyond.' },
          { label: 'Knowledge that blood circulates', col: 0, explanation: 'Changed — Harvey\'s 1628 discovery overturned Galen\'s claim that the liver made new blood constantly.' },
        ],
        explanation: 'The Renaissance changed how doctors understood the body — but not how they treated patients. New knowledge co-existed with old practice for generations.',
      },

      {
        type: 'quickRecall',
        stage: 'Change and continuity',
        label: 'Chapter retrieval',
        questions: [
          {
            type: 'choice',
            question: 'Why did Harvey\'s discovery of blood circulation not immediately change treatments?',
            options: [
              'He could not explain what blood actually does, so no reason to abandon bloodletting',
              'The Church banned his work',
              'His results could not be repeated by other scientists',
              'Bloodletting was still the most effective treatment available',
            ],
            correct: 0,
            explanation: 'Harvey proved blood circulates but couldn\'t explain its function. Without knowing blood carries oxygen, doctors had no reason to abandon humoural treatments.',
          },
          {
            type: 'choice',
            question: 'What does the Great Plague of 1665 tell us about Renaissance medicine?',
            options: [
              'New anatomical knowledge had not improved understanding of disease causes',
              'Renaissance doctors successfully treated plague with herbal remedies',
              'The Church had been completely overthrown as a medical authority by 1665',
              'Germ theory had been discovered but not yet applied',
            ],
            correct: 0,
            explanation: 'People still blamed miasma, humours and God. Renaissance anatomy improved knowledge of the body — not knowledge of what caused disease.',
          },
          {
            type: 'choice',
            question: 'What did the Royal Society\'s motto "Nullius in Verba" represent?',
            options: [
              'Rejection of ancient authority — evidence and experiment must replace tradition',
              'Support for the Church\'s control over medical knowledge',
              'A declaration that surgery required royal permission',
              'A warning that doctors should not trust patients',
            ],
            correct: 0,
            explanation: '"Take nobody\'s word for it" — the Royal Society created a culture where observation, experiment and publication replaced trusting Galen.',
          },
        ],
      },

      // ── Section 6 — Summary & Examiner ──────────────────────────────────────

      {
        type: 'examinerExplains',
        stage: 'Exam prep',
        examinerExplains: {
          opening: "Renaissance medicine is exam gold — but students often lose marks by confusing change and continuity.",
          tips: [
            {
              heading: 'Know the difference: knowledge vs treatment',
              body: 'Vesalius and Harvey changed anatomy and understanding. But treatments — bloodletting, purging, herbal remedies — barely changed. The examiner wants this distinction.',
            },
            {
              heading: 'Name the figures, name the year',
              body: 'Vesalius 1543, Harvey 1628, Paré 1530s, Royal Society 1660, Great Plague 1665. These dates are signals of precision — use them.',
            },
            {
              heading: 'Explain why change was slow',
              body: 'Galen still dominated universities. The Church backed old ideas. Without germ theory, there was no alternative explanation for disease. Change happened at the edges, not overnight.',
            },
            {
              heading: 'Use the Great Plague as evidence of continuity',
              body: 'Despite the Renaissance, the 1665 plague showed people still blamed miasma and sin. This is the clearest evidence that new knowledge hadn\'t filtered into everyday treatment.',
            },
          ],
          closing: "Show the examiner you understand both the change and the limits of change.",
        },
      },

      {
        type: 'faceExaminer',
        stage: 'Exam prep',
        label: 'Face the Examiner',
        examiner: {
          type: '8-mark-explain',
          board: 'edexcel',
          subject: 'history',
          topic: 'renaissance-medicine',
          difficulty: 'standard',

          question: 'Explain two ways in which the work of Vesalius and Harvey changed medicine during the Renaissance. [8 marks]',
          marks: 8,
          mark: 5,
          summary: 'Both figures are mentioned and their discoveries stated. However, the answer needs to explain the significance and impact of each discovery more fully to reach Level 3.',

          markScheme: `Level 3 (6–8 marks): Detailed explanation of two ways with developed reasoning — must explain WHY each discovery was significant, not just what it was.
Level 2 (3–5 marks): Some explanation of change, but at least one point lacks development of significance or impact.
Level 1 (1–2 marks): Simple identification of discoveries with little explanation.
Award marks for any two of (each requiring explanation not just identification):
- Vesalius corrected anatomical errors — must explain WHY this mattered (proved direct observation beat ancient authority; challenged Galen's 1,400-year dominance)
- Harvey proved blood circulation — must link to what changed AND what didn't (knowledge improved but treatments persisted)
- Vesalius published De Fabrica — must explain impact (illustrated, spread via printing press, forced confrontation with Galen)
- Harvey used mathematical method — must explain significance (new approach: weighing, calculating, not just observing)
Do NOT award marks for naming discoveries without explaining their significance.`,

          sampleAnswer: `During the Renaissance, the work of Vesalius and Harvey changed medicine in important ways. Firstly, Vesalius corrected many of Galen's mistakes about human anatomy. He dissected human bodies himself and published his findings in De Humani Corporis Fabrica in 1543. He found over 300 errors in Galen's work, including facts about the jaw bone and the heart. This was important because it showed that ancient authorities could be wrong, and that doctors should rely on direct observation rather than just trusting old books. Secondly, Harvey proved in 1628 that blood circulates continuously around the body, pumped by the heart. This was different from Galen's idea that the liver constantly produced new blood. However, Harvey could not explain what blood actually did, so doctors continued to use old treatments like bloodletting.`,

          annotations: [
            {
              id: 'ann1',
              target: 'corrected many of Galen\'s mistakes about human anatomy.',
              occurrence: 1,
              type: 'weak',
              comment: 'Stated but needs development — which mistakes? Why did this matter?',
            },
            {
              id: 'ann2',
              target: 'He found over 300 errors in Galen\'s work, including facts about the jaw bone and the heart.',
              occurrence: 1,
              type: 'strong',
              comment: 'Specific — names the errors. Good knowledge.',
            },
            {
              id: 'ann3',
              target: 'it showed that ancient authorities could be wrong, and that doctors should rely on direct observation rather than just trusting old books.',
              occurrence: 1,
              type: 'strong',
              comment: 'Excellent — explains the significance, not just the fact.',
            },
            {
              id: 'ann4',
              target: 'Harvey could not explain what blood actually did, so doctors continued to use old treatments like bloodletting.',
              occurrence: 1,
              type: 'strong',
              comment: 'Very good — shows understanding of the limits of change.',
            },
          ],

          improvementPrompts: {
            ann1: {
              prompt: '+ Explain WHY correcting Galen\'s anatomy was significant',
              placeholder: 'e.g. Galen\'s work had been accepted for over 1,400 years without question. By proving him wrong, Vesalius established that evidence from direct observation was more reliable than ancient authority...',
            },
          },

          criteriaOptions: [
            'Accurate knowledge',
            'Two clear ways',
            'Specific evidence',
            'Explains the impact',
            'Developed explanation',
            'Too vague',
            'Repeats the point',
            'Missing the "why it mattered"',
          ],
        },
      },

    ]
  },

  {
    id: 'mod3',
    subject: 'History',
    number: 4,
    title: 'Surgery & Anatomy',
    subtitle: 'Hold Him Down and Hope',
    era: 'c1700–c1900',
    icon: '🩺',
    color: '#C47828',
    colorLight: 'rgba(196,120,40,.12)',
    hook: {
      scenario: {
        location: 'London, 1840',
        hint: 'A surgeon is about to operate. He hasn\'t washed his hands once today.',
      },
      statement: 'Before the 1840s, surgeons washed their hands and wore clean coats to prevent infection.',
      isTrue: false,
      accentWords: ['washed their hands', 'clean coats'],
      explanation: "Blood-stained coats were worn with pride — proof of experience. Nobody had discovered germ theory yet. Dirty hands killed more patients than the knife.",
      wrongFeedback: 'Actually, blood-stained coats were a badge of honour — experience, not hygiene.',
      correctFeedback: 'Right. Germs weren\'t even discovered yet. Nobody knew dirty hands were dangerous.',
      loadingText: 'The real operating theatre was horrifying…',
      bigQuestion: 'So what actually made surgery so deadly?',
      revealHeader: 'Three killers: pain, infection, blood loss.',
      revealItems: [
        { emoji: '😱', label: 'Pain — patients were fully conscious', detail: 'No anaesthetic meant patients screamed through every cut. Surgeons were judged on speed — Robert Liston could amputate a leg in 40 seconds.', color: '#C47828', bg: 'rgba(196,120,40,.08)' },
        { emoji: '🦠', label: 'Infection — nobody knew why wounds went bad', detail: 'Blood-stained coats, unwashed hands, unsterilised instruments. Surgeons carried bacteria from patient to patient without knowing it. Most patients died of post-op infection.', color: '#D4950A', bg: 'rgba(212,149,10,.08)' },
        { emoji: '🩸', label: 'Blood loss — no transfusions existed', detail: 'Major operations killed through blood loss alone. There were no blood groups, no transfusion techniques, no way to replace what was lost on the table.', color: '#B06520', bg: 'rgba(176,101,32,.08)' },
      ],
      punchline: 'Surgery improved because three separate problems were solved — pain, infection, bleeding — each by a different person.',
    },
    intro: {
      learningGoals: [
        'Explain why surgery before the 1840s was so dangerous',
        'Describe how anaesthetics changed surgery — and why they also created new problems',
        'Explain Lister\'s use of antiseptics and why surgeons resisted it at first',
        'Assess the relative importance of Simpson, Lister and Nightingale',
      ],
    },
    outcomes: {
      intro: 'Surgery before anaesthetics was essentially a horror show. This chapter explains how it became something close to medicine.',
      bullets: [
        'Describe what surgery was actually like before 1846',
        'Explain how anaesthetics changed the game — and created new problems',
        "See why Lister's carbolic acid was revolutionary and controversial at the same time",
        'Connect pain, infection and blood loss to surgical survival rates',
      ],
    },

    recall: {
      questions: [
        { type: 'truefalse', question: 'Before 1846, surgeons operated on fully conscious patients.', isTrue: true },
        { type: 'choice', question: 'Simpson discovered that chloroform could...', options: ['Kill bacteria during surgery', 'Make patients unconscious for operations', 'Speed up the healing of wounds'], correct: 1 },
        { type: 'connection', question: 'Lister used carbolic acid to...', options: [
          { text: 'Speed up the operating process', icon: 'gear' },
          { text: 'Kill the bacteria causing post-op infections', icon: 'germ' },
          { text: 'Numb patients before operations', icon: 'heart' },
        ], correct: 1 },
      ],
    },
    screens: [
      {
        label: 'The Problem',
        kicker: 'Core Problem',
        heading: 'Why Was Surgery Terrifying?',
        sub: 'Before modern surgery, the method was basically: "hold him down and hope."',
        blocks: [
          { type: 'read', label: '❌ Before improvements', text: 'No anaesthetic. No antiseptics. No blood transfusions. Infection was common. Surgeons were judged partly on speed — <strong>Robert Liston</strong> could amputate a leg in under 40 seconds in the 1840s.' },
          { type: 'read', label: '✅ After improvements', text: 'Anaesthetics reduced pain, antiseptics and aseptic surgery reduced infection, and transfusions reduced blood loss. Surgery became slower, cleaner and more precise.' },
          { type: 'funfact', label: '🤢 Gross Fact', text: 'Some surgeons wore blood-stained coats as a badge of experience. Basically: "Look how filthy I am, trust me with your open wound."' },
          { type: 'keypoint', text: 'Doctors slowly solved three huge problems: <strong>pain</strong>, <strong>infection</strong> and <strong>bleeding</strong>.' },
        ]
      },
      {
        tag: 'anaesthetics',
        label: 'Pain',
        kicker: 'Problem 1 · Pain',
        heading: 'Anaesthetics: Finally, Less Screaming',
        sub: 'Anaesthetics reduced pain so surgeons could operate more carefully and attempt longer, more complex procedures.',
        blocks: [
          { type: 'examtip', label: '🗡️ Exam Trap', text: '<strong>Anaesthetics did not fix surgery by themselves.</strong> They reduced pain, but longer operations could increase infection risk if surgeons still had dirty hands, tools and theatres.' },
          { type: 'quiz', question: 'Which detail best explains why chloroform became safer?', options: [
            { text: "John Snow's inhaler helped control how much chloroform patients received", correct: true },
            { text: 'People stopped caring about dosage', correct: false },
            { text: 'Ether was flammable', correct: false },
            { text: 'Robert Liston operated faster', correct: false },
          ], explanation: "Snow's inhaler is a strong technology factor: safer dosage increased trust." },
        ]
      },
      {
        label: 'Davy',
        kicker: '1799',
        heading: 'Humphry Davy: Laughing Gas',
        sub: 'The first hint that pain in surgery could one day be solved.',
        blocks: [
          { type: 'read', label: '🔬 The Discovery', text: '<strong>Humphry Davy</strong> discovered that inhaling <strong>nitrous oxide</strong> (laughing gas) reduced the sensation of pain. He even suggested it could be used during surgery. But surgeons ignored him — partly because it made people giggle, and partly because no one believed patients needed to be unconscious.' },
          { type: 'funfact', label: '😂 Why It Was Ignored', text: 'Nitrous oxide was seen as a party trick. It was used at "laughing gas shows" for entertainment. Serious surgeons didn\'t want to be associated with circus antics — so a potential breakthrough sat unused for 47 years.' },
        ]
      },
      {
        label: 'Morton',
        kicker: '1846',
        heading: 'William Morton: Ether',
        sub: 'The first successful public demonstration of surgical anaesthesia.',
        blocks: [
          { type: 'read', label: '🔬 The Discovery', text: '<strong>William Morton</strong>, an American dentist, publicly demonstrated that <strong>ether</strong> could render a patient unconscious during surgery in 1846. The news spread to Britain rapidly. For the first time, surgeons could operate without a patient screaming — but ether was flammable and caused nausea.' },
          { type: 'keypoint', text: 'Morton\'s demonstration was the turning point that made pain-free surgery a reality. But ether had serious limitations — the search for something better began immediately.' },
        ]
      },
      {
        label: 'Simpson',
        kicker: '1847',
        heading: 'James Simpson: Chloroform',
        sub: 'Better than ether — and discovered over a dinner party.',
        blocks: [
          { type: 'read', label: '🔬 The Discovery', text: '<strong>James Simpson</strong>, a Scottish obstetrician, was searching for something better than ether. In 1847, he and two colleagues inhaled various chemicals at a dinner party. They woke up under the table having discovered <strong>chloroform</strong> — more powerful, faster acting, and less flammable than ether. It allowed much longer operations.' },
          { type: 'funfact', label: '🍽️ The Dinner Party Method', text: 'Simpson\'s approach to drug discovery: invite friends over, try inhaling random chemicals, see who passes out. Pioneering science or a Victorian dare? Both, probably.' },
        ]
      },
      {
        label: 'Greener',
        kicker: '1848',
        heading: 'Hannah Greener: A Warning',
        sub: 'The new wonder drug had a dangerous side.',
        blocks: [
          { type: 'read', label: '⚠️ What Happened', text: '<strong>Hannah Greener</strong>, aged 15, died from an overdose of chloroform in 1848 — one year after its discovery. She had been given too much. Her death showed that anaesthetics were not automatically safe. The problem was dosage: there was no precise way to control how much a patient received.' },
          { type: 'examtip', label: '🗡️ Exam Insight', text: 'Hannah Greener\'s death is useful evidence that <strong>new medical advances create new problems</strong>. Examiners love this nuance — progress isn\'t simply positive.' },
        ]
      },
      {
        label: 'Snow',
        kicker: '1850s',
        heading: 'John Snow: Safer Dosage',
        sub: 'The man who solved cholera also made chloroform much safer.',
        blocks: [
          { type: 'read', label: '🔬 The Improvement', text: '<strong>John Snow</strong> — best known for tracing the 1854 cholera outbreak to a water pump — developed an <strong>inhaler</strong> that allowed surgeons to control exactly how much chloroform a patient received. Controlled dosage dramatically reduced the risk of overdose and death. Chloroform became far more trusted as a result.' },
          { type: 'keypoint', text: 'Snow\'s inhaler is a classic example of <strong>technology improving a previous advance</strong>. The discovery (chloroform) only became safe when the method of administering it was controlled.' },
        ]
      },
      {
        label: 'Victoria',
        kicker: '1853',
        heading: 'Queen Victoria: Royal Seal of Approval',
        sub: 'When the Queen used it in childbirth, public resistance collapsed.',
        blocks: [
          { type: 'read', label: '👑 The Endorsement', text: '<strong>Queen Victoria</strong> used chloroform during the birth of her eighth child in 1853 — and praised it publicly. Until this point, many religious figures argued that pain in childbirth was God\'s will and should not be numbed. The Queen\'s endorsement silenced most opposition overnight. Chloroform use spread rapidly.' },
          { type: 'examtip', label: '🗡️ Exam Factor', text: 'Victoria\'s endorsement is evidence of <strong>government/authority as a factor</strong> in medical change. Not a scientific discovery — but it removed the social and religious barrier to adoption.' },
        ]
      },
      {
        tag: 'antiseptic-surgery',
        label: 'Infection',
        kicker: 'Problem 2 · Infection',
        heading: 'Antiseptics: The Acid Febreze Era',
        sub: 'Anaesthetics helped pain, but created a new problem: longer operations meant more chance for infection.',
        blocks: [
          { type: 'read', label: '🦠 Pasteur → Lister', text: '<strong>Louis Pasteur\'s germ theory</strong> showed microorganisms caused decay and disease. <strong>Joseph Lister</strong> applied that idea to surgery in the 1860s by using <strong>carbolic acid</strong> to clean wounds, instruments, bandages and operating theatres.' },
          { type: 'funfact', label: '🤢 Horrible Histories Moment', text: 'Victorian surgeons after discovering carbolic acid: "What if we sprayed absolutely EVERYTHING with acid?" Patients. Bandages. Tables. Probably nearby pigeons.' },
          { type: 'keypoint', text: '<strong>Lister mattered because he used germ theory practically.</strong> He did not just know germs existed — he changed surgical methods to reduce infection.' },
          { type: 'quiz', question: "Why did Lister's methods matter?", options: [
            { text: 'He used carbolic acid to reduce infection using ideas from germ theory', correct: true },
            { text: 'He discovered ether', correct: false },
            { text: 'He invented blood groups', correct: false },
            { text: 'He proved pain was useful', correct: false },
          ], explanation: 'Pasteur gave the scientific idea; Lister turned it into surgical practice.' },
        ]
      },
      {
        label: 'Aseptic',
        kicker: 'Infection Gets Smarter',
        heading: 'Aseptic Surgery: Stop Germs Getting In',
        sub: 'Antiseptics killed germs afterwards. Aseptic surgery aimed to stop germs entering in the first place.',
        blocks: [
          { type: 'read', label: '🧴 Antiseptic vs Aseptic', text: '<strong>Antiseptic</strong>: kill germs after they appear. Lister\'s carbolic acid was antiseptic — useful but still messy. <strong>Aseptic</strong>: prevent germs entering in the first place. Surgeons began sterilising instruments, wearing gloves and masks, and using clean operating theatres.' },
          { type: 'examtip', label: '🗡️ Exam Sentence', text: 'Surgery became safer when science and technology worked together: anaesthetics reduced pain, antiseptics and aseptic surgery reduced infection, and blood groups made transfusions safer.' },
          { type: 'quiz', question: 'Which answer best explains how surgery became safer?', options: [
            { text: 'Pain, infection and blood loss were solved gradually through anaesthetics, antiseptics/aseptic methods and safer transfusions', correct: true },
            { text: 'Anaesthetics fixed every problem immediately', correct: false },
            { text: 'Surgery became safer because doctors stopped doing operations', correct: false },
            { text: 'Galen discovered blood groups', correct: false },
          ], explanation: 'Strong GCSE answer: surgery improved because several problems were solved in stages, not because of one magic discovery.' },
        ]
      },
      {
        label: 'Flashcards',
        kicker: 'Final Recap',
        heading: 'Flashcards',
        sub: 'Tap to flip. Lock in the key facts.',
        blocks: [
          { type: 'flashcards', cards: [
            { front: 'Anaesthetic', back: 'A substance that removes pain during surgery.' },
            { front: 'James Simpson', back: 'Discovered chloroform as a general anaesthetic (1847).' },
            { front: 'Hannah Greener', back: 'Died from chloroform overdose in 1848 — showed dosage danger.' },
            { front: 'Antiseptic', back: 'Kills germs that are already present. Lister used carbolic acid from 1867.' },
            { front: 'Aseptic', back: 'Prevents germs getting in. Sterilised instruments, gloves, clean theatres.' },
            { front: 'Joseph Lister', back: 'Applied germ theory to surgery using carbolic acid to fight infection.' },
            { front: 'Three surgery problems', back: 'Pain, infection, and bleeding — each solved separately.' },
          ]}
        ]
      },
    ]
  },

  {
    id: 'mod4',
    subject: 'History',
    number: 5,
    title: 'Germ Theory',
    subtitle: 'Pasteur, Koch & the Invisible Enemy',
    era: 'c1850–c1900',
    icon: '🦠',
    color: '#B06520',
    colorLight: 'rgba(176,101,32,.12)',
    hook: {
      scenario: {
        location: 'Paris, 1857',
        hint: 'Pasteur is in his lab — staring at a bottle of wine that\'s gone bad.',
      },
      statement: 'Louis Pasteur discovered germ theory by studying sick patients in hospitals.',
      isTrue: false,
      accentWords: ['sick patients in hospitals'],
      explanation: "Pasteur was a chemist, not a doctor. His breakthrough came from spoiled wine and sour beer — the biggest revolution in medical history started with a drinks problem.",
      wrongFeedback: 'He was a chemist, not a doctor. His breakthrough came from spoiled wine, not sick people.',
      correctFeedback: 'Exactly — it started with wine. The biggest medical revolution came from a drinks problem.',
      loadingText: 'Following the evidence…',
      bigQuestion: 'So how did wine lead to one of the biggest ideas in medical history?',
      revealHeader: 'It started with why wine went bad.',
      revealItems: [
        { emoji: '🍷', label: 'Wine → bacteria → disease', detail: 'Pasteur saw bacteria spoiling wine under a microscope. He realised microorganisms caused decay — and if they caused decay, maybe they caused disease too. He was right.', color: '#B06520', bg: 'rgba(176,101,32,.08)' },
        { emoji: '🧪', label: 'The swan-neck flask (1861)', detail: 'Pasteur boiled broth in a flask with a curved neck. Air got in — but dust and microbes didn\'t. The broth stayed fresh. This proved microbes came from outside, not from thin air.', color: '#C47828', bg: 'rgba(196,120,40,.08)' },
        { emoji: '🔬', label: 'Koch made it specific', detail: 'Pasteur proved microbes caused disease generally. Robert Koch went further — identifying the exact bacteria behind anthrax, TB and cholera. Suddenly medicine could target specific enemies.', color: '#D4950A', bg: 'rgba(212,149,10,.08)' },
      ],
      punchline: 'Germ theory changed everything — vaccines, antiseptics, antibiotics all follow from one chemist asking why his wine was off.',
    },
    outcomes: {
      intro: 'Two scientists, one idea, and the moment everything changed in medicine.',
      bullets: [
        "Explain Pasteur's germ theory in your own words",
        'Describe how Koch identified specific bacteria as disease causes',
        'See why this idea was so difficult for doctors to accept at first',
        'Link germ theory to the treatments and breakthroughs that followed',
      ],
    },

    recall: {
      questions: [
        { type: 'truefalse', question: 'Louis Pasteur was a trained doctor who worked in hospitals.', isTrue: false },
        { type: 'choice', question: 'Koch\'s biggest contribution was...', options: ['Creating the first vaccine', 'Linking specific bacteria to specific diseases', 'Disproving the germ theory'], correct: 1 },
        { type: 'connection', question: 'Germ theory transformed medicine because...', options: [
          { text: 'It immediately gave doctors new treatments', icon: 'flask' },
          { text: 'It explained WHY disease spread from person to person', icon: 'lightbulb' },
          { text: 'It replaced Galen overnight in hospitals', icon: 'book' },
        ], correct: 1 },
      ],
    },
    screens: [
      {
        tag: 'germ-theory',
        label: 'Old Ideas',
        kicker: 'Before Germ Theory',
        heading: 'Old Ideas Refused To Die',
        sub: 'Doctors did not just wake up one day and say "germs, obviously." Medicine had centuries of bad habits to unlearn.',
        blocks: [
          { type: 'read', label: '💨 Miasma', text: 'Disease was believed to be caused by bad air or foul smells. This seemed logical because disease was common in filthy places.' },
          { type: 'read', label: '🧪 Spontaneous Generation', text: 'People believed germs appeared naturally from decay or illness — as a symptom, not the cause. This is the opposite of germ theory.' },
          { type: 'examtip', label: '🗡️ Key Distinction', text: 'People knew microbes existed, but they did <strong>not</strong> believe microbes caused disease. They often thought germs appeared after illness had already started.' },
          { type: 'quiz', question: 'What did people believe about germs before germ theory?', options: [
            { text: 'Germs appeared as a result of disease, not the cause', correct: true },
            { text: 'Germs caused all disease', correct: false },
            { text: 'Germs were the same as the Four Humours', correct: false },
            { text: 'Germs came from bad surgery', correct: false },
          ], explanation: 'Spontaneous generation said germs appeared from decay — they were a symptom of illness, not its cause. Pasteur proved the opposite.' },
        ]
      },
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
          { type: 'quiz', question: 'Why is Jenner\'s smallpox vaccine significant for understanding medical progress?', options: [
            { text: 'It proved that observation and experiment could produce breakthroughs even without understanding the cause', correct: true },
            { text: 'It proved that germ theory was correct', correct: false },
            { text: 'It showed that the Church supported scientific progress', correct: false },
          ], explanation: 'Jenner had no knowledge of germs or immunity — he used observation and careful experiment. His work paved the way for Pasteur, who later explained WHY vaccines work.' },
        ],
      },
      {
        tag: 'pasteur',
        label: 'Pasteur',
        kicker: '1861',
        heading: 'Louis Pasteur: The Wine Detective',
        headerImage: '/images/pasteur-1861.png',
        sub: 'Global breakthrough begins with someone\'s drink being ruined.',
        blocks: [
          { type: 'read', label: '📖 Core Knowledge', text: '<strong>Louis Pasteur</strong> was a French chemist. In the 1850s, he investigated why wine went bad. Using a microscope, he saw bacteria in the wine and believed they were causing it to spoil. He heated the wine to kill the bacteria — a process later called <strong>pasteurisation</strong>.' },
          { type: 'read', label: '🧪 Swan-Neck Flask (1861)', text: 'Pasteur boiled broth in swan-neck flasks to kill existing microbes. The sealed flask stayed fresh. The flask exposed to air went bad. This showed microbes came from the air and caused decay — they did not appear through spontaneous generation. He published his findings in <strong>1861</strong>.' },
          { type: 'keypoint', text: 'In <strong>1861</strong>, Pasteur published his work on <strong>germ theory</strong>. This changed understanding of disease and opened the door to vaccines, antiseptic surgery and later antibiotics.' },
          { type: 'quiz', question: 'Why was Pasteur studying wine?', options: [
            { text: 'A winemaker asked him to investigate why wine was going off', correct: true },
            { text: 'He was trying to invent anaesthetic', correct: false },
            { text: 'He was identifying blood groups', correct: false },
            { text: 'He was treating the Great Plague', correct: false },
          ], explanation: 'Classic history: global breakthrough begins with someone\'s drink being ruined. Pasteur saw bacteria, linked them to spoilage, then applied this to disease.' },
        ]
      },
      {
        tag: 'koch',
        label: 'Koch',
        kicker: 'Key Person 2',
        heading: 'Robert Koch: "Cool, But WHICH Germ?"',
        sub: 'Pasteur showed microbes caused disease. Koch proved specific germs caused specific diseases.',
        blocks: [
          { type: 'read', label: '📖 Core Knowledge', text: '<strong>Robert Koch</strong> was a German doctor. He used <strong>industrial dyes</strong> to stain bacteria so they were easier to see under microscopes. He identified the bacteria behind three major killers — and each time, it made germ theory harder to ignore.' },
          { type: 'keypoint', text: 'Koch made germ theory more convincing because he linked <strong>specific bacteria</strong> to <strong>specific diseases</strong>. This was crucial for developing vaccines and treatments.' },
          { type: 'quiz', question: 'Why was Koch\'s work important?', options: [
            { text: 'He identified specific bacteria causing specific diseases, making germ theory more convincing', correct: true },
            { text: 'He proved miasma theory was correct', correct: false },
            { text: 'He invented the printing press', correct: false },
            { text: 'He performed the first operation under anaesthetic', correct: false },
          ], explanation: 'Pasteur proved microbes caused disease generally. Koch proved which specific microbe caused which specific disease — crucial for developing targeted treatments.' },
        ]
      },
      {
        label: 'Anthrax',
        kicker: '1876',
        heading: 'Koch Identifies Anthrax',
        sub: 'The first time a specific bacterium was definitively linked to a specific disease.',
        blocks: [
          { type: 'read', label: '🔬 The Discovery', text: '<strong>Robert Koch</strong> identified <em>Bacillus anthracis</em> — the bacterium causing anthrax — in 1876. He used industrial dyes to stain bacteria so they were visible under a microscope. This was the first time a specific microbe had been definitively linked to a specific disease, turning germ theory from an idea into a proven tool.' },
          { type: 'keypoint', text: 'Before Koch, germ theory was plausible. After 1876, it was <strong>proven</strong> — at least for anthrax. The method he used became the template for future discoveries.' },
        ]
      },
      {
        label: 'Tuberculosis',
        kicker: '1882',
        heading: 'Koch Identifies TB',
        sub: 'TB killed one in seven people in Europe. Now they knew what caused it.',
        blocks: [
          { type: 'read', label: '🔬 The Discovery', text: 'In <strong>1882</strong>, Koch identified the bacterium causing <strong>tuberculosis (TB)</strong> — one of the biggest killers in Europe. This single discovery made germ theory widely accepted because TB was so visible and deadly. Doctors could no longer dismiss the idea that invisible microbes caused disease.' },
          { type: 'examtip', label: '🗡️ Exam Link', text: 'TB identification mattered for the <strong>development of later treatments</strong>. You cannot treat a specific disease if you do not know its specific cause.' },
        ]
      },
      {
        label: 'Cholera',
        kicker: '1883',
        heading: 'Koch Identifies Cholera',
        sub: 'Cholera had swept across Europe in waves. Koch found out why.',
        blocks: [
          { type: 'read', label: '🔬 The Discovery', text: 'In <strong>1883</strong>, Koch identified the bacterium causing <strong>cholera</strong>. This built on John Snow\'s earlier work — Snow had proved cholera spread through contaminated water (1854) without knowing why. Koch found the actual cause. Together their work transformed public health and disease prevention.' },
          { type: 'keypoint', text: 'By 1883, Koch had linked three major diseases to specific bacteria. The age of targeted medicine had begun.' },
        ]
      },
      {
        label: 'Vaccines',
        kicker: 'Chance + Science',
        heading: 'Chicken Cholera: The Holiday Mistake',
        sub: 'Chance plays a role in science — but only when someone\'s there to recognise it.',
        blocks: [
          { type: 'funfact', label: '🐔 The Oops', text: 'In 1879, Pasteur\'s assistant <strong>Charles Chamberland</strong> left chicken cholera germs unrefrigerated before going on holiday. When the old germs were injected into chickens, they did not become ill. When fresh germs were injected later — still no illness. Pasteur had discovered a way to create vaccines using weakened germs.' },
          { type: 'read', label: '🐄 Link to Jenner', text: 'Jenner used cowpox to prevent smallpox, but did not fully understand why it worked. Pasteur understood weakened germs could produce immunity — so he could apply the process to other diseases. Later vaccines: anthrax and rabies.' },
          { type: 'quiz', question: "Why was Pasteur's chicken cholera discovery important?", options: [
            { text: 'It showed weakened germs could create immunity', correct: true },
            { text: 'It proved miasma was correct', correct: false },
            { text: 'It discovered blood groups', correct: false },
            { text: 'It invented chloroform', correct: false },
          ], explanation: 'Chance opened the door; Pasteur\'s scientific thinking made it useful. This shows how chance and individual genius work together.' },
        ]
      },
      {
        label: 'Impact',
        kicker: 'Why It Mattered',
        heading: 'Why Germ Theory Was Such A Big Deal',
        sub: 'It did not immediately cure everything. But it changed the direction of medicine permanently.',
        blocks: [
          { type: 'read', label: '🧼 Surgery', text: 'Lister used germ theory to develop antiseptic surgery with carbolic acid.' },
          { type: 'read', label: '💉 Vaccines', text: 'Pasteur used the idea of weakened germs to develop vaccines for other diseases.' },
          { type: 'read', label: '🏙️ Public Health', text: 'If germs caused disease, then clean water, sewage systems and hygiene mattered more.' },
          { type: 'keypoint', text: '<strong>Germ theory changed understanding of disease before it changed treatment.</strong> Knowledge improved first, then practical treatments followed.' },
          { type: 'quiz', question: 'Which is the strongest judgement about germ theory?', options: [
            { text: 'Germ theory transformed understanding and allowed later improvements in surgery, vaccines and public health', correct: true },
            { text: 'Germ theory immediately cured all diseases', correct: false },
            { text: 'Germ theory proved miasma was correct', correct: false },
            { text: 'Germ theory was only useful for wine', correct: false },
          ], explanation: 'The best exam answers show germ theory changed understanding first, then enabled practical improvements.' },
        ]
      },
      {
        label: 'Flashcards',
        kicker: 'Final Recap',
        heading: 'Flashcards',
        sub: 'Tap to flip. Lock in the key facts.',
        blocks: [
          { type: 'flashcards', cards: [
            { front: 'Spontaneous generation', back: 'The belief that germs appeared naturally from decay — not as the cause of disease.' },
            { front: 'Pasteur', back: 'French chemist who proved microbes caused decay. Swan-neck flask, 1861.' },
            { front: 'Swan-neck flask', back: 'Showed microbes came from air; broth stayed fresh when microbes were trapped.' },
            { front: 'Koch', back: 'Identified specific bacteria causing specific diseases. Anthrax 1876, TB 1882, cholera 1883.' },
            { front: 'Chicken cholera discovery', back: 'Weakened germs could create immunity. Led to vaccines for anthrax and rabies.' },
            { front: 'Germ theory impact', back: 'Changed understanding first — then enabled antiseptic surgery, vaccines and public health reform.' },
          ]}
        ]
      },
    ]
  },

  {
    id: 'mod5',
    subject: 'History',
    number: 6,
    title: 'Public Health',
    subtitle: 'Cities, Sewers & Slow Progress',
    era: 'c1800–c1900',
    icon: '🏭',
    color: '#9A5A18',
    colorLight: 'rgba(154,90,24,.12)',
    hook: {
      scenario: {
        location: 'London, 1854',
        hint: 'People are drawing water from a pump on Broad Street. Several neighbours have died this week.',
      },
      statement: 'Victorian Londoners knew that drinking from the Thames could spread cholera.',
      isTrue: false,
      accentWords: ['Thames', 'cholera'],
      explanation: "Most people blamed miasma — the smell of the river. It took one doctor, John Snow, to map deaths door-by-door in 1854 and prove the water itself was the killer.",
      wrongFeedback: 'Most people still blamed miasma — bad air from the river. The water itself seemed fine.',
      correctFeedback: 'Right — even as people died, most blamed smell, not water. It took one doctor to prove otherwise.',
      loadingText: 'Tracing the outbreak…',
      bigQuestion: 'So how did anyone figure out the water was the problem?',
      revealHeader: 'John Snow mapped every death.',
      revealItems: [
        { emoji: '🗺️', label: 'Snow\'s map changed medicine', detail: 'Dr John Snow plotted every cholera death on a street map of Soho. They clustered around one water pump on Broad Street. He removed the handle — the outbreak stopped. Data beat dogma.', color: '#9A5A18', bg: 'rgba(154,90,24,.08)' },
        { emoji: '🏙️', label: 'Cities were death traps', detail: 'Industrial towns packed thousands into slums with no sewage, shared privies and water drawn from rivers full of waste. Life expectancy in Manchester in 1840 was 28 years for labourers.', color: '#B06520', bg: 'rgba(176,101,32,.08)' },
        { emoji: '🚧', label: 'Government had to act — but didn\'t want to', detail: 'Laissez-faire politics meant the government resisted spending on sewers. It took the Great Stink of 1858 — when Parliament itself smelled the Thames — to force Bazalgette\'s sewer system through.', color: '#C47828', bg: 'rgba(196,120,40,.08)' },
      ],
      punchline: 'Public health improved not because government wanted to act — but because the smell reached Parliament.',
    },
    intro: {
      learningGoals: [
        'Explain why public health was so poor in industrial towns',
        'Describe Chadwick\'s 1842 report and why the government was slow to act',
        'Explain John Snow\'s role in proving cholera was waterborne',
        'Describe the 1875 Public Health Act and why it was a genuine turning point',
      ],
    },
    outcomes: {
      intro: "Knowing what causes disease is useless if society won't act on it. This chapter shows why change is always slower than science.",
      bullets: [
        'Explain why 19th-century cities were genuine death traps',
        'Describe the cholera outbreaks and what they finally revealed',
        'See why governments were so reluctant to improve public health',
        "Link Snow's map and the Broad Street pump to the birth of epidemiology",
      ],
    },

    recall: {
      questions: [
        { type: 'truefalse', question: 'John Snow proved cholera spread through water in 1854.', isTrue: true },
        { type: 'choice', question: 'Why did governments resist improving public health?', options: ['Scientists disagreed about the causes', 'It was costly and meant government interference', 'People refused to use sewers'], correct: 1 },
        { type: 'connection', question: 'The Great Stink of 1858 mattered because...', options: [
          { text: 'It killed enough MPs to force a vote', icon: 'warning' },
          { text: 'It forced Parliament to fund Bazalgette\'s sewer system', icon: 'people' },
          { text: 'It proved miasma theory was correct after all', icon: 'leaf' },
        ], correct: 1 },
      ],
    },
    screens: [
      {
        label: 'Cities Explode',
        kicker: 'Cause of the Problem',
        heading: 'Industrialisation: Cities Exploded',
        sub: 'From 1750, people moved from rural areas into towns and cities. The cities were not ready. Not even slightly.',
        blocks: [
          { type: 'read', label: '📖 Core Knowledge', text: 'Urban populations grew hugely, but public health systems did not grow with them. More people meant more waste, more overcrowding and faster disease spread. <strong>London</strong> grew from 1.09m to 5.57m between 1801 and 1901. Manchester, Birmingham and Glasgow saw similar explosions.' },
          { type: 'examtip', label: '🗡️ Exam Assassin', phrases: ['rapid urbanisation'], tip: 'Industrialisation caused towns to grow faster than housing, water supplies and sewage systems could cope.' },
          { type: 'read', label: '☠️ Six Ways Cities Killed You', text: '<strong>Cramped housing</strong> spread disease. <strong>Shared toilets</strong> and poor drainage built up waste near homes. <strong>Cesspits</strong> leaked into drinking water. <strong>Street pumps</strong> supplied contaminated water. <strong>Coal smoke</strong> damaged lungs. All of these worked together to spread disease rapidly.' },
          { type: 'quiz', question: 'Why did industrialisation cause a public health crisis?', options: [
            { text: 'Cities grew faster than housing, sanitation and water systems could cope', correct: true },
            { text: 'People chose to be unhealthy', correct: false },
            { text: 'Germ theory caused the problem', correct: false },
            { text: 'The government banned clean water', correct: false },
          ], explanation: 'Rapid urbanisation overwhelmed public health systems, causing disease to spread through overcrowding, poor sanitation and contaminated water.' },
        ]
      },
      {
        label: 'Cholera',
        kicker: 'Disease',
        heading: 'Cholera: The Killer Nobody Understood',
        sub: 'Cholera spread fast and killed through severe dehydration. People still blamed bad air.',
        blocks: [
          { type: 'read', label: '☠️ Cholera', text: 'Cholera first arrived in England in <strong>1831</strong>. It caused vomiting, diarrhoea, dehydration and often death. Major epidemics happened in <strong>1831, 1848, 1854 and 1866</strong>. Even during outbreaks, many people still believed <strong>miasma</strong> caused disease — which slowed acceptance of the waterborne explanation.' },
          { type: 'quiz', question: 'How was cholera actually spread?', options: [
            { text: 'Through contaminated food or water', correct: true },
            { text: 'By bad smells only', correct: false },
            { text: 'By too much coal smoke', correct: false },
            { text: 'By four humours becoming unbalanced', correct: false },
          ], explanation: 'Cholera was waterborne. The continuing belief in miasma slowed understanding of this — a key continuity point.' },
        ]
      },
      {
        label: 'Chadwick',
        kicker: 'Key Person 1',
        heading: 'Edwin Chadwick: "Please Clean Literally Anything"',
        sub: 'Chadwick investigated living conditions and used evidence to push for public health reform.',
        blocks: [
          { type: 'read', label: '📖 Core Knowledge', text: '<strong>Edwin Chadwick</strong> was a lawyer and social reformer. In <strong>1842</strong> he published the <em>Report on the Sanitary Conditions of the Labouring Population of Great Britain</em>. It showed that poor sanitation and poverty were linked to low life expectancy. Manchester labourers lived to 15–19; rural professionals lived to around 52.' },
          { type: 'keypoint', text: 'Chadwick still believed in <strong>miasma</strong> — his reasoning was partly wrong. But the reforms he wanted (clean water, drainage, sewers) would still save lives. <strong>Correct outcome from partly incorrect reasoning.</strong>' },
          { type: 'quiz', question: "Why is Chadwick's work a good exam example?", options: [
            { text: 'He used evidence to push for reforms that would save lives, even though his miasma reasoning was wrong', correct: true },
            { text: 'He proved germ theory first', correct: false },
            { text: 'He built the London sewer system', correct: false },
            { text: 'He invented the cholera vaccine', correct: false },
          ], explanation: 'Chadwick helped public health without understanding germ theory. Correct outcome from partly incorrect reasoning is a classic exam nuance.' },
        ]
      },
      {
        tag: 'john-snow',
        label: 'John Snow',
        kicker: 'Key Person 2',
        heading: 'John Snow: The Soho Water Mystery',
        sub: 'Snow worked like a detective. He mapped deaths, followed the evidence and challenged miasma.',
        blocks: [
          { type: 'read', label: '📖 Core Knowledge', text: 'During the <strong>1854 cholera outbreak</strong> in Soho, London, <strong>John Snow</strong> plotted cholera deaths on a map. He found they clustered around the <strong>Broad Street pump</strong>. He believed sewage from a nearby cesspit had contaminated the water. He had the pump handle removed, helping stop the outbreak.' },
          { type: 'funfact', label: '🍺 The Beer Drinkers Lived', text: 'Workers at a nearby brewery did not get cholera because they drank beer instead of water from the pump. History revision officially sponsored by weird but useful details.' },
          { type: 'keypoint', text: 'Snow proved cholera was <strong>waterborne</strong>, but could not yet explain germs scientifically. Many people continued to believe miasma until Pasteur\'s germ theory gave stronger evidence later.' },
          { type: 'quiz', question: "How did John Snow help stop the 1854 cholera outbreak?", options: [
            { text: 'He mapped deaths and had the Broad Street pump handle removed', correct: true },
            { text: 'He invented the cholera vaccine', correct: false },
            { text: 'He proved miasma caused cholera', correct: false },
            { text: 'He built the London sewers', correct: false },
          ], explanation: 'Snow\'s detective work showed the cluster around the pump. Removing the handle stopped people drinking contaminated water.' },
        ]
      },
      {
        tag: 'public-health',
        label: 'Government Acts',
        kicker: 'Government Action',
        heading: 'Public Health Acts: 1848 and 1875',
        sub: 'From optional and underfunded to compulsory. Progress was slow.',
        blocks: [
          { type: 'read', label: '📖 1848 Public Health Act', text: 'Created a <strong>Central Board of Health</strong>. Local authorities <em>could</em> set up local boards of health — but they were usually not compulsory. Areas with a mortality rate above 23 per 1,000 had to set one up. Funding was weak. Many councils did nothing.' },
          { type: 'read', label: '📖 1875 Public Health Act', text: 'Much stronger. Local authorities <strong>had to</strong>: provide clean water, build sewerage systems, and appoint medical officers to oversee public health. This showed a clear move away from laissez-faire attitudes.' },
          { type: 'examtip', label: '🗡️ Exam Assassin', text: '<strong>Laissez-faire</strong> means limited government interference. Many Victorians opposed public health laws because they disliked taxes, central control and being told what to do. The Times in 1852: "We prefer to take our chance with cholera than be bullied into health."' },
          { type: 'quiz', question: 'What was the key difference between the 1848 and 1875 Acts?', options: [
            { text: '1875 made local authorities take stronger compulsory action', correct: true },
            { text: '1848 was compulsory and 1875 was optional', correct: false },
            { text: '1875 banned microscopes', correct: false },
            { text: '1848 discovered cholera bacteria', correct: false },
          ], explanation: '1848 was important but weak and largely optional. 1875 was compulsory — a clear shift away from laissez-faire.' },
        ]
      },
      {
        label: 'Great Stink & Sewers',
        kicker: 'Turning Point',
        heading: 'The Great Stink & Bazalgette\'s Sewers',
        sub: 'In 1858, the Thames smelled so bad that Parliament shut down. Reform suddenly became urgent.',
        blocks: [
          { type: 'funfact', label: '🤢 1858', text: 'The river smelled so bad Parliament shut down. Poor people had suffered from filthy conditions for years. But once politicians personally had to smell the Thames, reform suddenly became urgent. Peak human behaviour.' },
          { type: 'read', label: '📖 Joseph Bazalgette', text: '<strong>Joseph Bazalgette</strong> designed London\'s new sewerage system after the Great Stink. Designed in <strong>1858</strong>, completed in <strong>1875</strong>. It removed sewage from the city and helped end major cholera outbreaks in London. Bazalgette was not a doctor — this shows public health improved through <strong>engineering and infrastructure</strong>.' },
          { type: 'keypoint', text: 'Public health improved through multiple factors: <strong>science, engineering, government action and evidence</strong> all mattered.' },
          { type: 'quiz', question: 'Why was the Great Stink a turning point?', options: [
            { text: 'When Parliament was directly affected by the smell, they finally acted on sewer reform', correct: true },
            { text: 'It proved miasma was correct', correct: false },
            { text: 'It killed half of London', correct: false },
            { text: 'It was caused by germ theory', correct: false },
          ], explanation: 'Poor people had suffered for years. The Great Stink shows how reform accelerated when elites were directly affected.' },
        ]
      },
      {
        label: 'Flashcards',
        kicker: 'Final Recap',
        heading: 'Flashcards',
        sub: 'Tap to flip. Lock in the key facts.',
        blocks: [
          { type: 'flashcards', cards: [
            { front: 'Rapid urbanisation', back: 'Cities grew faster than housing, water and sanitation could cope.' },
            { front: 'Edwin Chadwick', back: '1842 report linked poor sanitation to low life expectancy. Still believed in miasma.' },
            { front: 'Laissez-faire', back: 'Limited government interference. Many Victorians opposed public health laws.' },
            { front: '1848 Public Health Act', back: 'Created boards of health, but mostly optional and underfunded.' },
            { front: 'John Snow', back: 'Mapped 1854 Broad Street cholera deaths. Proved waterborne spread. Removed pump handle.' },
            { front: '1875 Public Health Act', back: 'Compulsory clean water, sewers and medical officers. Move away from laissez-faire.' },
            { front: 'Joseph Bazalgette', back: 'Designed London\'s sewer system after the Great Stink. Engineering saved lives.' },
            { front: 'Great Stink 1858', back: 'Parliament smelled the Thames. Led to sewer reform. Shows elites accelerate reform.' },
          ]}
        ]
      },
    ]
  },

  // ── History Module 6: The Surgery Revolution ─────────────────────────────────
  {
    id: 'mod6',
    subject: 'History',
    number: 7,
    title: 'The Surgery Revolution',
    subtitle: 'Pain, Infection & Survival (1840–1900)',
    era: 'c1840–c1900',
    icon: '🔪',
    color: '#7A4515',
    colorLight: 'rgba(122,69,21,.12)',
    hook: {
      atmosphericOpener: {
        heading: 'THE SURGEON WIPES HIS BLADE ON HIS APRON.',
        sub: 'The apron hasn\'t been washed in weeks. The crowd leans in. The patient is awake.',
        cta: 'STEP INTO THE THEATRE',
      },
      scenario: {
        location: 'A London operating theatre, 1840',
        hint: 'A surgeon is about to amputate a leg. He is wearing a blood-stained coat — a mark of experience. Spectators watch from tiered seats above. There is no anaesthetic. No antiseptic. Just speed, a saw, and luck.',
      },
      statement: 'Victorian surgeons often wore blood-covered coats with pride.',
      accentWords: ['blood-covered coats', 'pride'],
      explanation: "A filthy coat meant experience — the more blood, the more operations. Nobody knew this was also spreading infection. That changed with Lister and carbolic acid.",
      isTrue: true,
      wrongFeedback: 'It sounds shocking — but it\'s true. A filthy coat showed experience. The real danger wasn\'t the surgery. It was what came after.',
      correctFeedback: 'Correct. Many surgeons believed a dirty coat proved experience and toughness. The biggest killer wasn\'t the operation — it was infection afterwards.',
      loadingText: 'Examining the body of evidence…',
      bigQuestion: 'If surgery was this dangerous — why did anything ever improve?',
      revealHeader: 'Three revolutions changed surgery forever.',
      revealItems: [
        {
          emoji: '😴',
          label: 'Anaesthetics ended the screaming',
          detail: 'Before 1846, patients were awake for every cut. Speed was the only mercy. Ether and chloroform changed that — surgery became something patients could survive consciously.',
          color: '#9A5A18',
          bg: 'rgba(154,90,24,.08)',
        },
        {
          emoji: '🦠',
          label: 'Antiseptics ended the dying',
          detail: 'Anaesthetics saved pain but not lives. Patients still died of infection — gangrene, sepsis — after operations. Lister\'s carbolic acid spray, inspired by Pasteur, cut death rates dramatically.',
          color: '#9A5A18',
          bg: 'rgba(154,90,24,.08)',
        },
        {
          emoji: '⚡',
          label: 'Technology accelerated everything',
          detail: 'X-rays (1895), blood transfusions and sterile operating theatres turned surgery from a desperate last resort into a precise science. The transformation took just 60 years.',
          color: '#9A5A18',
          bg: 'rgba(154,90,24,.08)',
        },
      ],
      punchline: 'Modern surgery was hard-won. Three revolutions. Sixty years. Millions of lives.',
    },
    intro: {
      learningGoals: [
        'Explain why speed mattered in pre-anaesthetic surgery',
        'Describe the impact of anaesthetics on surgery (1846 onwards)',
        'Explain why infection — not pain — was the main killer',
        'Describe Lister\'s use of carbolic acid and its significance',
        'Distinguish antiseptic surgery from aseptic surgery',
        'Explain how X-rays and blood transfusions advanced medicine',
      ],
    },
    outcomes: {
      intro: 'Between 1840 and 1900, surgery transformed from butchery into medicine. This is exactly how it happened.',
      bullets: [
        'Explain why pain, infection and blood loss each limited surgery differently',
        "Describe Simpson's discovery — and why surgeons resisted it",
        "See why Lister's antiseptic approach eventually saved millions of lives",
        'Connect these three breakthroughs to the drop in operating-theatre deaths',
      ],
    },

    recall: {
      questions: [
        { type: 'truefalse', question: 'Joseph Lister was the first surgeon to use anaesthetics.', isTrue: false },
        { type: 'choice', question: 'Antiseptic surgery works by...', options: ['Numbing the patient during operations', 'Killing bacteria to prevent post-op infection', 'Stopping blood loss during surgery'], correct: 1 },
        { type: 'connection', question: 'Surgery survival rates improved most when...', options: [
          { text: 'Surgeons learned to work faster', icon: 'gear' },
          { text: 'Pain, infection and blood loss were each solved', icon: 'lightbulb' },
          { text: 'Hospitals were built larger and better lit', icon: 'house' },
        ], correct: 1 },
      ],
    },
    screens: [

      // Screen 1 — Speed Surgery
      {
        label: 'Speed Surgery',
        kicker: 'Before 1846',
        heading: 'The faster the surgeon, the better.',
        sub: 'Before anaesthetics, speed was the only mercy. This is what surgery looked like.',
        blocks: [
          {
            type: 'read',
            label: '🔪 Robert Liston: The Fastest Knife in the West End',
            text: 'Robert Liston was celebrated as Britain\'s greatest surgeon in the 1840s. He could amputate a leg in under 30 seconds. Spectators packed the viewing gallery above the operating theatre. Patients were held down by assistants. There was no anaesthetic. The louder you screamed, the longer it felt. Speed was mercy — it reduced the duration of agony.',
          },
          {
            type: 'funfact',
            label: '☠️ Very Bad Time To Be Alive',
            text: 'One of Liston\'s operations reportedly killed three people: the patient (from infection), his assistant (whose fingers Liston accidentally amputated in the rush), and a spectator who fainted and died of shock. The operation was technically a success. It had a 300% mortality rate.',
          },
          {
            type: 'quiz',
            question: 'Which problem made speed the most important skill in surgery before 1846?',
            options: [
              { text: 'Lack of gloves and protective equipment', correct: false },
              { text: 'Lack of anaesthetics — patients were fully conscious', correct: true },
              { text: 'Lack of microscopes to see inside the body', correct: false },
              { text: 'Lack of hospitals with enough space', correct: false },
            ],
            explanation: 'Without anaesthetics, patients were awake through every cut. The faster the operation, the less time they spent in agony. Speed was a surgical skill — not a risk.',
          },
          {
            type: 'keypoint',
            text: '🧠 <strong>Key Phrase:</strong> "Without anaesthetics, speed reduced suffering." — This is the phrase that explains pre-1846 surgery in AQA answers. Not: "surgeons were skilled." Use this.',
          },
          {
            type: 'examtip',
            label: '⚔️ Exam Assassin',
            tip: 'Precise contextual explanation scores more than dramatic description. Don\'t write "surgery was horrible." Write: "Without anaesthetics, patients were conscious throughout — so speed was critical to reduce the duration of pain."',
          },
        ],
      },

      // Screen 2 — Anaesthetics
      {
        label: 'Anaesthetics',
        kicker: '1846 onwards',
        heading: 'Patients could finally sleep through surgery.',
        sub: 'Ether and chloroform transformed what surgery could attempt. But they didn\'t solve everything.',
        blocks: [
          {
            type: 'read',
            label: '😴 The Transformation',
            text: '<strong>1846: Ether</strong> — an American dentist, William Morton, used ether as the first surgical anaesthetic. The news reached Britain within months.<br/><br/><strong>1847: Chloroform</strong> — James Simpson, a Scottish obstetrician, discovered chloroform was faster and more reliable than ether. He used it in childbirth.<br/><br/><strong>1853: Royal approval</strong> — Queen Victoria used chloroform during the birth of Prince Leopold. This removed religious objections and made anaesthetics socially acceptable.',
          },
          {
            type: 'keypoint',
            text: '⚡ <strong>The paradox of anaesthetics:</strong> Making surgery painless made it MORE dangerous in the short term. Surgeons could now attempt longer, more ambitious operations — but infection still killed. More surgery = more deaths from infection. The death rate initially <em>rose</em> after anaesthetics were introduced.',
          },
          {
            type: 'quiz',
            question: 'Which statement about the impact of anaesthetics is MOST accurate for an AQA answer?',
            options: [
              { text: 'Anaesthetics solved most surgical deaths', correct: false },
              { text: 'Anaesthetics made surgery painless but infection remained the main killer', correct: true },
              { text: 'Anaesthetics stopped surgical bleeding', correct: false },
              { text: 'Anaesthetics prevented post-operative gangrene', correct: false },
            ],
            explanation: 'Anaesthetics solved pain — not infection. Death rates from surgery didn\'t fall significantly until Lister tackled infection with antiseptics. This nuance is what AQA high-mark answers include.',
          },
          {
            type: 'examtip',
            label: '⚔️ Exam Assassin',
            tip: '"Improved pain control allowed surgeons to attempt more complex operations — but infection rates initially rose as a result." This nuance separates A-grade from B-grade answers.',
          },
        ],
      },

      // Screen 3 — Infection: The Real Killer
      {
        label: 'The Real Killer',
        kicker: 'Infection',
        heading: 'Patients survived surgery… then died afterwards.',
        sub: 'Pain wasn\'t the main killer. Infection was. And nobody knew why — yet.',
        blocks: [
          {
            type: 'read',
            label: '🦠 What Was Killing Patients?',
            text: 'In the 1840s–1860s, nearly half of patients who underwent major surgery died — not from the operation itself, but from infection in the days that followed. <strong>Gangrene</strong> (tissue death from bacterial infection), <strong>sepsis</strong> (blood poisoning) and <strong>pyaemia</strong> (pus in the blood) were the killers.<br/><br/>Surgeons had no idea why. They didn\'t wash hands between patients. They reused instruments without sterilising them. Some proudly wore the same apron all day — the more blood, the more experienced you appeared.',
          },
          {
            type: 'quiz',
            question: 'A patient survives an amputation but develops a fever and dies three days later. What is the MOST likely cause?',
            options: [
              { text: 'Pain — the operation was too stressful', correct: false },
              { text: 'Blood loss — they lost too much during surgery', correct: false },
              { text: 'Infection — bacteria entered the wound', correct: true },
              { text: 'Broken bones — from being restrained during surgery', correct: false },
            ],
            explanation: 'Infection was the primary cause of post-operative death throughout this period. Bacteria entered wounds through dirty instruments, unwashed hands and contaminated dressings. The patient surviving surgery was only half the battle.',
          },
          {
            type: 'funfact',
            label: '☠️ Very Bad Time To Be Alive',
            text: 'In some hospitals in the 1850s, a surgeon might operate on ten patients in a morning — using the same unwashed instruments throughout. The ward floors were caked in blood. Instruments were cleaned with sawdust at best. Surgeons sometimes operated with dried pus on their tools from the previous patient. The word "hospitalism" was coined to describe the epidemic of infection contracted in hospitals themselves.',
          },
          {
            type: 'keypoint',
            text: '🧠 <strong>Key Phrase:</strong> "Infection — not pain — was the main killer after surgery." Gangrene, sepsis and pyaemia killed more patients than the operations themselves. This is the central point of this entire module.',
          },
        ],
      },

      // Screen 4 — Lister vs Infection
      {
        label: 'Lister',
        kicker: '1867',
        heading: 'Joseph Lister changes surgery forever.',
        headerImage: '/images/lister-1865.png',
        sub: 'Lister applied Pasteur\'s germ theory directly to surgery. The results were dramatic.',
        blocks: [
          {
            type: 'read',
            label: '🧴 What Lister Did',
            text: '<strong>Joseph Lister</strong> read Pasteur\'s germ theory and made the connection: if microorganisms cause decay and disease, they must be causing post-operative infection too.<br/><br/>From 1865, Lister began spraying wounds with <strong>carbolic acid</strong> during and after surgery. He also soaked dressings, instruments and his own hands in carbolic solution.<br/><br/>The results were immediate. His ward\'s post-operative death rate fell from around 45% to below 15%. He published his findings in <em>The Lancet</em> in 1867.',
          },
          {
            type: 'fillblanks',
            sentences: [
              {
                before: 'Lister used',
                after: 'acid to kill germs during and after surgery.',
                answer: 'carbolic',
                hints: ['A chemical spray used to kill bacteria.', 'It begins with "c" — it\'s the acid derived from coal tar.'],
              },
              {
                before: 'Pasteur\'s',
                after: 'theory inspired Lister to apply germ-killing methods to surgery.',
                answer: 'germ',
                hints: ['What did Pasteur identify as the cause of disease?', 'Starts with "g" — microorganisms that cause disease.'],
              },
              {
                before: 'Lister\'s use of carbolic acid is called',
                after: 'surgery — killing germs that are already present.',
                answer: 'antiseptic',
                hints: ['Anti = against. Septic = relating to infection.', 'This type of surgery kills germs after they enter — starts with "a."'],
              },
            ],
            correctMsg: 'Good. Lister → carbolic acid → antiseptic surgery → link to Pasteur. This chain is worth marks.',
            wrongMsg: 'Think about what Lister used and why. Go back to the read section.',
          },
          {
            type: 'quiz',
            question: 'Why was Lister\'s work revolutionary for surgery?',
            options: [
              { text: 'He discovered that germs cause disease', correct: false },
              { text: 'He directly applied germ theory to surgery, dramatically reducing infection deaths', correct: true },
              { text: 'He invented anaesthetics for surgical procedures', correct: false },
              { text: 'He created X-rays to see inside patients\' bodies', correct: false },
            ],
            explanation: 'Lister didn\'t discover germ theory — Pasteur did. But Lister made the crucial leap: applying germ theory to surgery. This is the distinction AQA rewards. The link Pasteur → Lister is essential in high-mark answers.',
          },
          {
            type: 'examtip',
            label: '⚔️ Exam Assassin',
            tip: 'High-mark answers LINK individuals together. Don\'t just write "Lister used carbolic acid." Write: "Lister applied Pasteur\'s germ theory to surgery — recognising that the microorganisms Pasteur identified must be causing post-operative infection." That chain scores the top marks.',
          },
        ],
      },

      // Screen 5 — Aseptic Surgery
      {
        label: 'Aseptic Surgery',
        kicker: 'Prevention',
        heading: 'Stop germs entering. Don\'t just kill them after.',
        sub: 'Antiseptic surgery treated infection. Aseptic surgery prevented it. The difference saved millions.',
        blocks: [
          {
            type: 'read',
            label: '🏥 From Antiseptic to Aseptic',
            text: '<strong>Antiseptic surgery</strong> (Lister, 1867): kill germs that have already entered the wound. Use carbolic spray. Better than nothing — but carbolic acid was harsh on skin and tissue.<br/><br/><strong>Aseptic surgery</strong> (1880s–1900s): prevent germs entering in the first place. <strong>Steam sterilisation</strong> of all instruments. <strong>Rubber gloves</strong> (William Halsted, 1890). Surgical <strong>masks</strong> and <strong>gowns</strong>. Scrubbing hands and arms before surgery. Purpose-built, clean <strong>operating theatres</strong> with tiled walls that could be washed down.<br/><br/>The shift from antiseptic to aseptic represents surgery becoming genuinely modern.',
          },
          {
            type: 'quiz',
            question: 'Which improvement PREVENTED germs entering surgery rather than killing them once inside?',
            options: [
              { text: 'Carbolic acid spray — applied to open wounds during surgery', correct: false },
              { text: 'Chloroform — administered to unconscious patients before cutting', correct: false },
              { text: 'Rubber gloves — preventing skin bacteria from the surgeon\'s hands entering wounds', correct: true },
              { text: 'Ether — used to reduce pain during the operation', correct: false },
            ],
            explanation: 'Rubber gloves prevent contamination from entering — that is the definition of aseptic. Carbolic acid kills germs already present — that is antiseptic. Chloroform and ether are anaesthetics, not infection controls.',
          },
          {
            type: 'keypoint',
            text: '⚔️ <strong>Exam Assassin:</strong> "Antiseptic kills germs already in the wound. Aseptic prevents germs entering the wound in the first place." If you can explain this distinction with an example of each, you are scoring maximum marks on this topic.',
          },
          {
            type: 'colsort',
            question: 'Antiseptic or aseptic technique?',
            columns: [
              { label: 'ANTISEPTIC\nKills germs after entry', color: '#C47828', bg: 'rgba(196,120,40,.07)' },
              { label: 'ASEPTIC\nPrevents germs entering', color: '#4B90FF', bg: 'rgba(75,144,255,.07)' },
            ],
            items: [
              { label: 'Carbolic acid spray on an open wound', col: 0, explanation: 'Antiseptic — carbolic acid kills microorganisms already in contact with the wound. Lister\'s method.' },
              { label: 'Steam-sterilising surgical instruments before use', col: 1, explanation: 'Aseptic — sterilising before surgery prevents any bacteria being introduced via instruments.' },
              { label: 'Soaking bandages in carbolic solution', col: 0, explanation: 'Antiseptic — treating dressings with carbolic acid kills bacteria on contact with the wound.' },
              { label: 'Surgeon wearing rubber gloves', col: 1, explanation: 'Aseptic — gloves create a barrier that prevents the surgeon\'s skin bacteria entering the patient\'s wound.' },
              { label: 'Tiled, washable operating theatre walls', col: 1, explanation: 'Aseptic — a clean, sterilisable environment reduces the bacteria present before surgery even begins.' },
              { label: 'Washing wound with antiseptic solution after cutting', col: 0, explanation: 'Antiseptic — treating the wound after opening it kills bacteria that have already entered.' },
            ],
            explanation: 'Antiseptic = reactive (kill what\'s there). Aseptic = preventative (stop it getting in). Modern surgery relies on both.',
          },
        ],
      },

      // Screen 6 — Technology: X-Rays & Blood Transfusions
      {
        label: 'X-Rays & Blood',
        kicker: 'Technology',
        heading: 'Doctors could finally see inside the body.',
        sub: 'Two breakthroughs that changed what medicine could diagnose and treat.',
        blocks: [
          {
            type: 'read',
            label: '⚡ X-Rays (1895)',
            text: 'Wilhelm Röntgen discovered X-rays in 1895. Within a year, they were being used in hospitals across Europe. For the first time, surgeons could locate <strong>bullets, fractures and internal injuries</strong> without opening the body first. Operations became more precise — surgeons knew exactly what they were dealing with before the first cut.',
          },
          {
            type: 'read',
            label: '🩸 Blood Transfusions',
            text: 'Blood transfusions had been attempted since the 17th century but were unreliable and often fatal. The discovery of <strong>blood groups</strong> (ABO system, Karl Landsteiner, 1901) made safe transfusion possible. Surgeons could now replace blood lost during major operations — extending the range of surgery that patients could survive.',
          },
          {
            type: 'quiz',
            question: 'Which development MOST helped surgeons locate internal injuries without opening the body first?',
            options: [
              { text: 'Antiseptic carbolic spray — killed bacteria inside wounds', correct: false },
              { text: 'Blood transfusions — replaced blood lost during surgery', correct: false },
              { text: 'X-rays — revealed fractures, bullets and internal structures', correct: true },
              { text: 'Chloroform anaesthesia — kept patients unconscious longer', correct: false },
            ],
            explanation: 'X-rays allowed diagnosis without cutting — surgeons could see exactly what they needed to treat before operating. This made surgery more targeted, safer and more successful.',
          },
          {
            type: 'keypoint',
            text: '🧠 <strong>Technology Accelerated Progress:</strong><br/><br/>⚡ <strong>X-rays (1895)</strong> — internal diagnosis without surgery<br/>🩸 <strong>Blood groups (1901)</strong> — safe transfusions<br/>🏥 <strong>Purpose-built theatres</strong> — sterile environments<br/>🔬 <strong>Better microscopes</strong> — identifying specific pathogens<br/><br/>Each breakthrough built on the others. Progress was cumulative, not sudden.',
          },
        ],
      },

      // Screen 7 — Source Detective
      {
        label: 'Source Detective',
        kicker: 'Exam Skill',
        heading: 'What does this source REALLY suggest?',
        sub: 'AQA sources require inference — not description. Build the skill here.',
        blocks: [
          {
            type: 'read',
            label: '🔍 How to Analyse a Historical Source',
            text: 'AQA sources are not just there to be summarised. You must <strong>infer</strong> — what does the source suggest about conditions, attitudes or developments? Always link to your own knowledge to explain <strong>why</strong> the source shows what it shows.<br/><br/>A source showing a surgeon in a blood-stained coat doesn\'t just show you "it was dirty." It suggests that infection was not yet understood as a danger — otherwise, surgeons would have taken precautions.',
          },
          {
            type: 'quiz',
            question: 'A source shows a Victorian operating theatre: crowded spectators, a surgeon in a stained apron, no protective equipment, an unconscious patient. Which student gives the best historical inference?',
            options: [
              { text: 'Student A: "The source shows Lister invented surgery."', correct: false },
              { text: 'Student B: "The unconscious patient suggests anaesthetics were in use, but the absence of gloves or clean clothing indicates the germ theory of infection had not yet been applied to surgery."', correct: true },
              { text: 'Student C: "The surgeon looks experienced because his coat is dirty."', correct: false },
              { text: 'Student D: "The source tells us surgery was happening in a hospital."', correct: false },
            ],
            explanation: 'Student B uses the source as evidence — inferring from what IS and IS NOT present. The unconscious patient = anaesthetics used. No gloves/protective equipment = pre-Lister, pre-antiseptic era. This is how AQA top marks are earned.',
          },
          {
            type: 'examtip',
            label: '⚔️ Exam Assassin',
            tip: 'Never just describe what you can see. Always infer what it SUGGESTS — and explain WHY using your own knowledge. "The source suggests X because Y — this is supported by the fact that Z." That three-part structure scores maximum inference marks.',
          },
          {
            type: 'keypoint',
            text: '🧠 <strong>Source Analysis Formula:</strong><br/>"The source suggests [X] because [detail from source]. This is significant because [your own knowledge about the period]. However, the source cannot tell us [limitation]."',
          },
        ],
      },

      // Screen 8 — Timeline Challenge
      {
        label: 'Timeline Challenge',
        kicker: 'Interactive',
        heading: 'WHO DID WHAT?',
        sub: 'Match the person to their breakthrough.',
        blocks: [
          {
            type: 'timelinedrag',
            topicLabel: 'Medicine Through Time',
            heading: 'WHO DID WHAT?',
            sub: 'Drag each person to the achievement they are most famous for.',
            examTip: {
              title: 'EXAM ASSASSIN',
              body: 'Learn the individual + what changed.',
            },
            people: [
              { id: 'vesalius', name: 'ANDREAS VESALIUS', color: '#8B6914' },
              { id: 'harvey',   name: 'WILLIAM HARVEY',   color: '#6B4C9A' },
              { id: 'jenner',   name: 'EDWARD JENNER',    color: '#2D6A4F' },
              { id: 'simpson',  name: 'JAMES YOUNG SIMPSON', color: '#A63D2F' },
              { id: 'lister',   name: 'JOSEPH LISTER',    color: '#1A4A6B' },
            ],
            items: [
              {
                id: 'vesalius', date: '1543', icon: '📖',
                achievement: 'Wrote detailed anatomy books based on human dissection.',
                keyword: 'ANATOMY',
                answer: 'vesalius',
                reveal: 'Doctors began trusting direct observation instead of blindly following Galen.',
                hint: "Not them. 1543, anatomy books, proved Galen wrong. Think printing press + a man with a scalpel. 💀",
              },
              {
                id: 'harvey', date: '1628', icon: '🫀',
                achievement: 'Discovered the circulation of the blood.',
                keyword: 'CIRCULATION',
                answer: 'harvey',
                reveal: 'Understanding circulation transformed anatomy — but treatments took longer to catch up.',
                hint: "Wrong person. This slot is heart, pump, blood going round and round. 1628. Not anatomy books. 👀",
              },
              {
                id: 'jenner', date: '1796', icon: '💉',
                achievement: 'Developed the smallpox vaccine to prevent disease.',
                keyword: 'VACCINATION',
                answer: 'jenner',
                reveal: 'Vaccination became one of the biggest breakthroughs in medical history.',
                hint: "Nope. Milkmaids got cowpox, didn't get smallpox — someone noticed. Vaccines. Prevention. Not surgery. 💉",
              },
              {
                id: 'simpson', date: '1847', icon: '☠️',
                achievement: 'Pioneered the use of anaesthesia in surgery.',
                keyword: 'ANAESTHESIA',
                answer: 'simpson',
                reveal: 'Surgery became less terrifying because patients could be unconscious.',
                hint: "Not that one. This slot ended the screaming — patients out cold. Chloroform, 1847. Don't mix it up with the infection guy. 😴",
              },
              {
                id: 'lister', date: '1867', icon: '🧴',
                achievement: 'Introduced antiseptic surgery to prevent infection.',
                keyword: 'ANTISEPTIC SURGERY',
                answer: 'lister',
                reveal: 'Antiseptics massively reduced deadly post-surgery infections.',
                hint: "Wrong end. Carbolic acid. Sprayed it on wounds, on instruments, on surgeons. Last breakthrough on the timeline. 🧴",
              },
            ],
          },
        ],
      },

      // Screen 9 — Final Boss
      {
        label: 'Final Boss',
        kicker: 'Challenge',
        heading: '⚔️ Final Boss: Could This Patient Survive?',
        sub: 'Three questions. Written answers. AI examiner marks against AQA criteria.',
        blocks: [
          {
            type: 'read',
            label: '🔥 The Scenario',
            text: '1845: A patient needs a leg amputation. The theatre is unsterilised. The instruments were last used this morning. There is no anaesthetic. No antiseptic. No X-ray. Explain how surgery would change between 1845 and 1900 — and what those changes meant for this kind of patient.',
          },
          {
            type: 'boss',
            tier: '🟢',
            label: 'Round 1 — Core Knowledge',
            question: 'Explain why surgery before 1846 was so dangerous. Give at least TWO reasons.',
            markPoints: `- No anaesthetics: patients were conscious, causing severe pain and shock — surgeons had to operate as fast as possible
- No antiseptics or understanding of infection: dirty instruments, unwashed hands and contaminated dressings caused post-operative infection
- Infection (gangrene, sepsis, pyaemia) killed a high proportion of surgical patients
- No sterilisation of equipment — the same instruments used on multiple patients spread bacteria
- Speed was prioritised over precision — rushed surgery increased complications
- Award 1 mark per developed point (up to 4 marks)`,
          },
          {
            type: 'boss',
            tier: '🟡',
            label: 'Round 2 — Change and Causation',
            question: 'Explain how Lister\'s work transformed surgery between 1865 and 1900. Why does his connection to Pasteur matter for AQA marks?',
            markPoints: `- Lister applied Pasteur's germ theory to surgery: recognised microorganisms caused post-operative infection
- Introduced carbolic acid spray to wounds, instruments and dressings (antiseptic surgery) from 1865
- Published in The Lancet 1867 — spread the technique through the medical profession
- Post-operative death rate fell dramatically: from ~45% to below 15% on his ward
- Led eventually to aseptic surgery: sterilised instruments, rubber gloves, clean theatres, surgical gowns
- Link to Pasteur: Lister did not discover germ theory — he APPLIED it. The examiner rewards the chain: Pasteur → Lister → antiseptic surgery → aseptic surgery
- Award 1 mark per developed point (up to 6 marks)`,
          },
          {
            type: 'boss',
            tier: '🔴',
            label: 'Round 3 — Boss Mode',
            question: '"Anaesthetics were the most important development in surgery between 1840 and 1900." How far do you agree? Explain your answer.',
            markPoints: `- Agreement — anaesthetics were significant:
  - Ended conscious suffering during operations (ether 1846, chloroform 1847)
  - Allowed surgeons to attempt more complex, longer procedures
  - Removed a major barrier to surgical progress — patient movement and shock
  - Queen Victoria's use (1853) gave anaesthetics social respectability
- Disagreement — antiseptics/aseptics were more important:
  - Anaesthetics did NOT reduce death rates — infection still killed ~45% post-operatively
  - Death rates only fell when Lister introduced carbolic acid (1867)
  - Aseptic techniques completed the transformation — preventing germs rather than just killing them
  - Without tackling infection, surgery remained extremely dangerous despite being painless
- X-rays and blood transfusions: honourable mention — extended the range and safety of surgery but built on the antiseptic/aseptic foundations
- Strong conclusion: anaesthetics were a NECESSARY but INSUFFICIENT development. The most important shift was from dirty to clean surgery — Lister's antiseptics and the subsequent aseptic revolution. Anaesthetics enabled longer operations; antiseptics made them survivable.
- Award marks for: AO1 knowledge of both sides, AO2 using specific evidence, AO3 sustained argument with justified conclusion`,
          },
        ],
      },

      // Screen 9 — Retrieval + Reflection
      {
        label: 'Retrieval',
        kicker: 'Final Retrieval',
        heading: 'Lock it in. No notes.',
        sub: 'Six questions. Everything from this module. Answer before you check.',
        blocks: [
          {
            type: 'read',
            label: '🔁 Why This Matters',
            text: 'Retrieval practice — testing yourself without looking back — is the fastest way to build long-term memory. Do this seriously and these facts will still be there on exam day.',
          },
          {
            type: 'tieredquiz',
            tiers: [
              {
                label: 'Core Facts', emoji: '🟢',
                questions: [
                  {
                    q: 'Why did speed matter so much in surgery before 1846?',
                    options: [
                      'Because patients were conscious and every second in pain — speed was the only mercy',
                      'Because hospitals had to clear operating theatres quickly for more patients',
                      'Because blood loss was faster in longer operations',
                      'Because anaesthetic gases were only available for short periods',
                    ],
                    correct: 0,
                    feedback: 'No anaesthetics meant every second of surgery was agony. Speed reduced the duration of conscious suffering — it was literally merciful to be fast.',
                    hint: 'What did patients not have in 1845 that they had in 1847?',
                  },
                  {
                    q: 'What did Lister use to combat infection after surgery?',
                    options: [
                      'Carbolic acid spray applied to wounds and instruments',
                      'Ether gas pumped into the operating theatre',
                      'Boiling water to clean all instruments before use',
                      'Chloroform soaked into surgical dressings',
                    ],
                    correct: 0,
                    feedback: 'Lister used carbolic acid (phenol) — sprayed on wounds, soaked into dressings, and applied to instruments. This was antiseptic surgery.',
                    hint: 'Think: what acid begins with "c" and was derived from coal tar?',
                  },
                  {
                    q: 'What is the difference between antiseptic and aseptic surgery?',
                    options: [
                      'Antiseptic kills germs in the wound; aseptic prevents germs entering in the first place',
                      'Antiseptic prevents all germs; aseptic uses chemicals to reduce infection',
                      'Antiseptic is a type of anaesthetic; aseptic is a sterilisation technique',
                      'Antiseptic is the modern approach; aseptic was the Victorian approach',
                    ],
                    correct: 0,
                    feedback: 'Antiseptic = kill germs already present (Lister\'s carbolic acid). Aseptic = prevent germs entering (sterilised instruments, rubber gloves, sterile theatres). Know this cold.',
                    hint: 'Think about what each word means. Anti-septic = against infection. A-septic = without infection.',
                  },
                ],
              },
              {
                label: 'Application', emoji: '🟡',
                questions: [
                  {
                    q: 'Why did death rates from surgery not fall immediately after anaesthetics were introduced in 1846?',
                    options: [
                      'Because infection still killed patients after operations — anaesthetics only addressed pain',
                      'Because anaesthetics were not widely used until the 1880s',
                      'Because patients were still conscious during surgery in many hospitals',
                      'Because blood transfusions were not yet available to replace blood loss',
                    ],
                    correct: 0,
                    feedback: 'Anaesthetics solved pain — not infection. Post-operative death rates from gangrene, sepsis and pyaemia remained high until Lister\'s antiseptic methods reduced them from the late 1860s onward.',
                    hint: 'What was the main cause of death after operations — not during them?',
                  },
                  {
                    q: 'A surgeon in 1855 wears a dirty apron, reuses unsterilised instruments and never washes his hands. Which development would MOST reduce his patients\' death rate?',
                    options: [
                      'Adopting Lister\'s carbolic acid spray and antiseptic technique',
                      'Learning to operate more quickly',
                      'Using ether before each operation',
                      'Moving to a larger hospital with more assistants',
                    ],
                    correct: 0,
                    feedback: 'Lister\'s antiseptic technique would directly address the cause of most post-operative deaths — infection from contaminated instruments, hands and dressings. Speed and anaesthetics don\'t tackle infection.',
                    hint: 'Which development in this module specifically targeted infection from dirty equipment?',
                  },
                ],
              },
              {
                label: 'Exam Assassin', emoji: '🔴',
                questions: [
                  {
                    q: 'Explain why linking Pasteur and Lister is important in a high-mark AQA answer about surgery.',
                    options: [
                      'Because Lister did not discover germ theory himself — he applied Pasteur\'s discovery to surgery. The chain shows how scientific understanding transferred into medical practice.',
                      'Because Pasteur and Lister were colleagues who worked together in the same laboratory.',
                      'Because Pasteur invented antiseptics and Lister was the first surgeon to use them in operations.',
                      'Because both men proved that germs cause disease independently of each other.',
                    ],
                    correct: 0,
                    feedback: 'The Pasteur → Lister link demonstrates that Lister\'s achievement was APPLICATION, not discovery. AQA rewards answers that show how scientific knowledge (germ theory) led to medical change (antiseptic surgery). That\'s cause and consequence — the core of historical thinking.',
                    hint: 'Who discovered germ theory? Who applied it to surgery? What was the relationship between those two events?',
                  },
                  {
                    q: 'Evaluate which was more important: the introduction of anaesthetics OR the introduction of antiseptics. Identify the strongest argument.',
                    options: [
                      'Antiseptics were more important because anaesthetics reduced pain but did not reduce death rates — only tackling infection made surgery survivable.',
                      'Anaesthetics were more important because without them, surgery could not be attempted at all.',
                      'Both were equally important — neither alone was sufficient to make surgery safe.',
                      'X-rays were the most important because they allowed diagnosis without cutting.',
                    ],
                    correct: 0,
                    feedback: 'This is the strongest argument for AQA evaluation: anaesthetics were NECESSARY but INSUFFICIENT. Death rates only fell when infection was addressed. Antiseptics (and later aseptics) were what made surgery survivable — not merely less painful. Option C is also defensible, but option A is the sharpest evaluation.',
                    hint: 'Which development actually reduced the death rate from surgery? Which only reduced pain?',
                  },
                ],
              },
            ],
          },
          {
            type: 'keypoint',
            text: '🎓 <strong>You survived Victorian surgery.</strong> Statistically impressive.<br/><br/>You now understand one of the biggest turning points in medical history: why surgery was terrifying before 1840, how anaesthetics changed what was possible, why infection was the real killer, how Lister transformed surgery, the antiseptic/aseptic distinction, and how X-rays accelerated the revolution.<br/><br/>That\'s the Surgery Revolution done.',
          },
        ],
      },
    ],
  },

  // ── History Module 7: The War Against Infection ──────────────────────────────
  {
    id: 'mod7',
    subject: 'History',
    number: 8,
    title: 'The War Against Infection',
    subtitle: 'Magic Bullets, Penicillin & the Antibiotic Revolution',
    era: 'c1890–c1945',
    icon: '💊',
    color: '#7A4515',
    colorLight: 'rgba(122,69,21,.12)',
    hook: {
      atmosphericOpener: {
        heading: 'A SCIENTIST RETURNS FROM HOLIDAY. THERE IS MOULD ON HIS PETRI DISH.',
        sub: 'Most scientists would throw it away. This one paused. And changed medicine forever.',
        cta: 'INVESTIGATE THE DISH',
      },
      scenario: {
        location: 'St Mary\'s Hospital, London, 1928',
        hint: 'Alexander Fleming has returned from a summer holiday to find one of his bacterial cultures contaminated with mould. Bacteria near the mould are dying. It looks like a ruined experiment.',
      },
      statement: 'Alexander Fleming intentionally set out to invent penicillin.',
      accentWords: ['intentionally'],
      explanation: "Fleming returned from holiday to find mould on a contaminated dish. The bacteria near it were dying. He almost threw it away. The discovery was entirely accidental.",
      isTrue: false,
      wrongFeedback: 'Fleming\'s discovery was accidental — he noticed something unusual in a contaminated dish he was about to throw away. But the harder question is what happened AFTER the accident.',
      correctFeedback: 'Correct. Penicillin was discovered by accident. But turning it into a working medicine required years of research, teamwork and wartime funding. Luck was just the beginning.',
      loadingText: 'Culturing the evidence…',
      bigQuestion: 'If the discovery was accidental — who actually saved millions of lives?',
      revealHeader: 'Discovery was just the beginning.',
      revealItems: [
        {
          emoji: '🧫',
          label: 'Fleming noticed mould killing bacteria',
          detail: 'In 1928, a contaminated petri dish showed mould (Penicillium notatum) producing something that killed the surrounding bacteria. Fleming named the substance penicillin — but couldn\'t purify or stabilise it.',
          color: '#9A5A18',
          bg: 'rgba(154,90,24,.08)',
        },
        {
          emoji: '🔬',
          label: 'Florey and Chain turned it into medicine',
          detail: 'In 1940, Howard Florey and Ernst Chain at Oxford purified penicillin, tested it on mice, then humans. Their work transformed Fleming\'s observation into a usable drug.',
          color: '#9A5A18',
          bg: 'rgba(154,90,24,.08)',
        },
        {
          emoji: '⚔️',
          label: 'WWII forced mass production',
          detail: 'Without the wartime urgency of WWII, mass production would have taken decades longer. American factories produced millions of doses. By D-Day, penicillin was saving lives on the battlefield.',
          color: '#9A5A18',
          bg: 'rgba(154,90,24,.08)',
        },
      ],
      punchline: 'Accident + observation + teamwork + war = the antibiotic revolution. All four mattered.',
    },
    intro: {
      learningGoals: [
        'Explain why bacterial infection was so deadly before antibiotics',
        'Describe Ehrlich\'s magic bullet concept and Salvarsan 606',
        'Explain Fleming\'s accidental discovery of penicillin',
        'Explain why development by Florey and Chain mattered more than discovery',
        'Describe how WWII accelerated mass production of penicillin',
        'Evaluate the relative importance of individuals, teamwork, science and war',
      ],
    },
    outcomes: {
      intro: 'From magic bullets to penicillin, the 20th century declared war on infection — and started winning.',
      bullets: [
        "Explain what Ehrlich meant by a 'magic bullet' and why it mattered",
        'Describe how Fleming accidentally discovered penicillin',
        'See how Florey and Chain turned a lab curiosity into a life-saving drug',
        'Understand why antibiotic resistance is the next crisis',
      ],
    },

    recall: {
      questions: [
        { type: 'truefalse', question: 'Fleming set out deliberately to discover penicillin.', isTrue: false },
        { type: 'choice', question: 'Ehrlich called Salvarsan a \'magic bullet\' because...', options: ['It worked immediately with no side effects', 'It targeted syphilis specifically without harming the patient', 'It was his 606th experimental compound'], correct: 1 },
        { type: 'connection', question: 'Penicillin saved lives in WWII because...', options: [
          { text: 'It was cheap enough for every soldier', icon: 'arrow' },
          { text: 'Florey and Chain produced it at mass scale for troops', icon: 'flask' },
          { text: 'It cured all infections including viral ones', icon: 'germ' },
        ], correct: 1 },
      ],
    },
    screens: [

      // Screen 1 — Why Infection Was Still Terrifying
      {
        label: 'Infection Kills',
        kicker: 'Before 1900',
        heading: 'A tiny cut could kill you.',
        sub: 'Even after Lister\'s antiseptics, bacterial infection inside the body remained almost untreatable.',
        blocks: [
          {
            type: 'read',
            label: '🦠 The Problem Nobody Had Solved',
            text: 'By the late 1800s, surgeons had learned to prevent infection entering wounds. But once bacteria were <em>inside</em> the body — in the bloodstream, lungs or organs — there was almost nothing medicine could do. <strong>Tuberculosis, pneumonia, sepsis, syphilis</strong> and infected wounds killed millions every year. Doctors could name the bacteria. They could not stop them.',
          },
          {
            type: 'funfact',
            label: '☠️ Very Bad Time To Be Alive',
            text: 'Before antibiotics, a scratch from a rose thorn could be fatal if bacteria entered the bloodstream. Sepsis — blood poisoning — killed within days. Soldiers in WWI were more likely to die of infected wounds than from direct battle injuries. Even childbirth remained life-threatening from puerperal fever (bacterial infection after delivery).',
          },
          {
            type: 'quiz',
            question: 'By 1900, germ theory had proven what caused bacterial diseases. Why were so many people still dying from infection?',
            options: [
              { text: 'Surgery had completely solved infection problems', correct: false },
              { text: 'Effective treatments to kill bacteria inside the body did not yet exist', correct: true },
              { text: 'Most infections had become easy to treat with existing medicines', correct: false },
              { text: 'Germ theory had been rejected by most doctors', correct: false },
            ],
            explanation: 'Germ theory explained CAUSE — it did not provide CURE. Doctors knew what bacteria were doing but had no way to stop them once inside the body. This is the key distinction: discovery of cause ≠ effective treatment.',
          },
          {
            type: 'keypoint',
            text: '🧠 <strong>Key Phrase:</strong> "Discovery of causes ≠ effective treatment." This distinction — knowing what causes disease vs being able to treat it — is one of the most important analytical points in GCSE History of Medicine.',
          },
        ],
      },

      // Screen 2 — Ehrlich & Magic Bullets
      {
        tag: 'magic-bullet',
        label: 'Magic Bullets',
        kicker: '1909',
        heading: 'Could medicine target bacteria directly?',
        sub: 'Paul Ehrlich had an idea that changed how scientists thought about treatment forever.',
        blocks: [
          {
            type: 'read',
            label: '🎯 The Magic Bullet Concept',
            text: '<strong>Paul Ehrlich</strong> (1854–1915) was a German scientist who had a revolutionary idea: what if you could find a chemical that would seek out and destroy specific bacteria — without harming the patient? He called this concept a <strong>"magic bullet."</strong><br/><br/>Ehrlich\'s team systematically tested hundreds of chemical compounds. On the 606th attempt, they found one that worked against syphilis. He named it <strong>Salvarsan 606</strong> (later improved as Neosalvarsan 914). It was the first modern targeted treatment for a bacterial disease.',
          },
          {
            type: 'quiz',
            question: 'Why was Salvarsan called a "magic bullet"?',
            options: [
              { text: 'It worked instantly against all bacteria', correct: false },
              { text: 'It targeted syphilis bacteria specifically without killing the patient', correct: true },
              { text: 'It cured every known bacterial disease', correct: false },
              { text: 'It replaced the need for surgery in all cases', correct: false },
            ],
            explanation: 'Magic bullet = targeted treatment. Salvarsan worked specifically against the syphilis bacterium (Treponema pallidum) without destroying healthy tissue. The targeting concept — not just killing everything — was the breakthrough.',
          },
          {
            type: 'keypoint',
            text: '⚡ <strong>Ehrlich\'s significance:</strong> He proved that targeted chemical treatments were possible. Before Salvarsan, doctors had no effective treatment for syphilis. Ehrlich\'s method — systematic, scientific testing — became the model for pharmaceutical drug development.',
          },
          {
            type: 'examtip',
            label: '⚔️ Exam Assassin',
            tip: 'If a question asks about early 20th-century treatment breakthroughs — Ehrlich and Salvarsan 606 is your answer. Don\'t just say "magic bullet" — say: "Ehrlich\'s Salvarsan 606 (1909) was the first targeted chemical treatment, specifically attacking syphilis bacteria." Specificity scores marks.',
          },
        ],
      },

      // Screen 3 — Fleming's Accident
      {
        tag: 'penicillin',
        label: 'Fleming\'s Discovery',
        kicker: '1928',
        heading: 'The mould nobody cleaned up.',
        headerImage: '/images/fleming-1928.png',
        sub: 'The most important contaminated experiment in history.',
        blocks: [
          {
            type: 'read',
            label: '🧫 What Fleming Found',
            text: 'In September 1928, <strong>Alexander Fleming</strong> returned to his laboratory at St Mary\'s Hospital after a summer holiday. He noticed something unusual on one of his bacterial culture plates: a mould had contaminated it — and the bacteria surrounding the mould were dead.<br/><br/>The mould was <em>Penicillium notatum</em>. It was producing a substance that killed bacteria. Fleming named it <strong>penicillin</strong>.',
          },
          {
            type: 'quiz',
            question: 'Which combination of factors MOST explains how Fleming made his discovery?',
            options: [
              { text: 'Luck and observation — he noticed something unexpected and investigated it', correct: true },
              { text: 'Government funding and laboratory equipment', correct: false },
              { text: 'Surgical skill and medical training', correct: false },
              { text: 'Religious faith and patient care', correct: false },
            ],
            explanation: 'The contamination was accidental — luck. But recognising it as significant and investigating rather than discarding the dish — that was scientific observation. Both mattered. AQA loves asking about the combination.',
          },
          {
            type: 'funfact',
            label: '☠️ Very Bad Time To Be Alive',
            text: 'Fleming was actually studying influenza bacteria when the accident occurred. He had left a window open over the summer, allowing the mould spores to drift in. The laboratory conditions that allowed the discovery were considered sloppy and unprofessional. History\'s biggest breakthrough came from a messy lab and a holiday.',
          },
          {
            type: 'keypoint',
            text: '⚔️ <strong>Exam Assassin:</strong> "Luck alone did NOT create modern medicine." Fleming couldn\'t purify penicillin, couldn\'t make it stable, and couldn\'t produce enough to use clinically. His paper was largely ignored for over a decade. The discovery was just the first step.',
          },
        ],
      },

      // Screen 4 — Why Fleming Couldn't Finish the Job
      {
        label: 'Fleming\'s Limit',
        kicker: 'The Gap',
        heading: 'Discovery ≠ usable medicine.',
        sub: 'Fleming knew penicillin killed bacteria. He couldn\'t turn that into a treatment. Here\'s why.',
        blocks: [
          {
            type: 'read',
            label: '🔬 What Stopped Fleming',
            text: 'Fleming published his findings in 1929 but faced serious problems:<br/><br/>🧪 <strong>Instability</strong> — penicillin degraded rapidly and couldn\'t be kept stable enough for clinical use.<br/>🏭 <strong>Purification</strong> — extracting pure penicillin from the mould was extremely difficult with 1920s technology.<br/>💰 <strong>Funding</strong> — nobody invested significantly in developing it.<br/>⏳ <strong>Technology</strong> — the chemical techniques needed to work with penicillin didn\'t yet exist.<br/><br/>Fleming moved on. His 1929 paper was largely ignored for eleven years.',
          },
          {
            type: 'quiz',
            question: 'Why didn\'t penicillin become a usable medicine immediately after Fleming\'s discovery in 1928?',
            options: [
              { text: 'Fleming deliberately kept the discovery secret', correct: false },
              { text: 'It was extremely difficult to purify, stabilise and mass produce with existing technology', correct: true },
              { text: 'The government banned all antibiotic research', correct: false },
              { text: 'Germ theory was disproved shortly after the discovery', correct: false },
            ],
            explanation: 'Development is not the same as discovery. Fleming found the substance. Turning it into a stable, purifiable, mass-producible medicine required technology and expertise that didn\'t exist in 1928.',
          },
          {
            type: 'keypoint',
            text: '🧠 <strong>Key Phrase:</strong> "Development often matters more than discovery." This is a recurring theme in History of Medicine. Fleming gets the fame — but Florey and Chain did the harder work.',
          },
          {
            type: 'examtip',
            label: '⚔️ Exam Assassin',
            tip: 'If a question asks "Why did it take so long for penicillin to become a medicine?" — your answer should mention: purification difficulties, unstable mould extract, no mass production technology, and lack of funding. Not: "Fleming forgot about it."',
          },
        ],
      },

      // Screen 5 — Florey & Chain
      {
        label: 'Florey & Chain',
        kicker: '1940–1941',
        heading: 'The team that actually saved millions.',
        headerImage: '/images/florey-chain-1941.png',
        sub: 'In Oxford, two scientists picked up where Fleming left off — and changed everything.',
        blocks: [
          {
            type: 'read',
            label: '🔬 The Oxford Team',
            text: 'In 1939, <strong>Howard Florey</strong> (Australian) and <strong>Ernst Chain</strong> (German refugee) at Oxford University began systematically working on penicillin.<br/><br/><strong>1940:</strong> They purified penicillin and tested it on eight mice infected with deadly streptococcus bacteria. The treated mice survived. The untreated ones died.<br/><br/><strong>1941:</strong> First human trial — a policeman with fatal sepsis. Penicillin began working. Then supplies ran out. He died. But the principle was proven.<br/><br/>They published their results and lobbied urgently for mass production.',
          },
          {
            type: 'quiz',
            question: 'Which statement BEST explains why Florey and Chain matter more than Fleming for the development of penicillin?',
            options: [
              { text: 'They discovered that mould could kill bacteria', correct: false },
              { text: 'They purified penicillin, proved it worked clinically, and drove mass production', correct: true },
              { text: 'They invented antibiotics independently of Fleming', correct: false },
              { text: 'They were the first to use penicillin on patients in WWI', correct: false },
            ],
            explanation: 'Florey and Chain converted Fleming\'s 1928 observation into a usable, proven, clinically tested medicine. The mice experiment, the human trial, the purification — all Florey and Chain. Their work was arguably the more difficult and more important contribution.',
          },
          {
            type: 'funfact',
            label: '💡 A Wartime Workaround',
            text: 'During WWII, with penicillin desperately scarce, the Oxford team collected patients\' urine after treatment to extract and reuse the penicillin that passed through their bodies. Every molecule counted. Fleming, Florey and Chain all received the Nobel Prize in 1945.',
          },
          {
            type: 'keypoint',
            text: '⚔️ <strong>Exam Assassin:</strong> "Modern medicine usually depends on teams — not lone geniuses." Fleming made the observation. Florey and Chain did the development. American factories did the production. No single person created the antibiotic revolution.',
          },
        ],
      },

      // Screen 6 — WWII & Mass Production
      {
        tag: 'wwi-medicine',
        label: 'WWII & Production',
        kicker: '1941–1945',
        heading: 'War speeds everything up.',
        sub: 'Without WWII, widespread penicillin treatment would have taken decades longer.',
        blocks: [
          {
            type: 'read',
            label: '⚔️ The Wartime Catalyst',
            text: 'After the Oxford team proved penicillin worked, the challenge was scale. Britain was at war and lacked manufacturing capacity. Florey flew to America in 1941 to seek help.<br/><br/>American pharmaceutical companies — with government funding and wartime urgency — threw enormous resources at the problem. New fermentation techniques were developed. Deep-tank fermentation increased yields dramatically. By 1944, American factories were producing over 100 billion units of penicillin per month.<br/><br/>By D-Day (June 1944), Allied forces had enough penicillin to treat every infected wound on the battlefield.',
          },
          {
            type: 'quiz',
            question: 'Which factor MOST accelerated penicillin production from laboratory curiosity to mass-scale medicine?',
            options: [
              { text: 'The work of medieval monasteries preserving old texts', correct: false },
              { text: 'The individual genius of Alexander Fleming', correct: false },
              { text: 'World War II — creating urgent military demand and US government investment', correct: true },
              { text: 'The introduction of astrology-based medicine', correct: false },
            ],
            explanation: 'WWII created the demand, the funding and the urgency that transformed penicillin from a laboratory substance into a mass-produced medicine. Without the war, production would have been much slower. War accelerates medical progress — this is a key AQA theme.',
          },
          {
            type: 'colsort',
            question: 'Who was responsible for which stage of the penicillin story?',
            columns: [
              { label: 'DISCOVERY\n1928', color: '#C47828', bg: 'rgba(196,120,40,.07)' },
              { label: 'DEVELOPMENT\n1940–41', color: '#4B90FF', bg: 'rgba(75,144,255,.07)' },
              { label: 'MASS PRODUCTION\n1941–44', color: '#4DFF88', bg: 'rgba(77,255,136,.07)' },
            ],
            items: [
              { label: 'Alexander Fleming notices mould killing bacteria', col: 0, explanation: 'Fleming made the accidental observation in 1928 — the discovery phase.' },
              { label: 'Florey and Chain purify penicillin and test on mice', col: 1, explanation: 'Oxford team 1940 — the development phase, turning observation into proven medicine.' },
              { label: 'American pharmaceutical companies scale up factories', col: 2, explanation: 'US industry with wartime government funding — mass production phase, 1941–44.' },
              { label: 'First human trial proves penicillin works clinically', col: 1, explanation: 'Florey and Chain\'s 1941 human trial — part of the development phase.' },
              { label: 'WWII creates urgent military demand for antibiotics', col: 2, explanation: 'The war created the scale of demand that forced mass production to be achieved quickly.' },
              { label: 'Fleming publishes paper describing the mould\'s effect', col: 0, explanation: 'Fleming\'s 1929 publication — completing the discovery phase, though largely ignored at the time.' },
            ],
            explanation: 'Three distinct phases. Three different groups. No single person or stage created modern antibiotics — all three were essential.',
          },
        ],
      },

      // Screen 7 — Antibiotics Change the World
      {
        label: 'The Revolution',
        kicker: 'Impact',
        heading: 'For the first time, infection could be beaten.',
        sub: 'The scale of change is difficult to overstate. Medicine was transformed in a decade.',
        blocks: [
          {
            type: 'read',
            label: '💊 Before and After Antibiotics',
            text: '<strong>Before antibiotics:</strong><br/>Pneumonia killed ~30% of those infected. TB was a death sentence for millions. Syphilis caused madness and death. An infected wound after surgery was often fatal. Childbirth carried serious infection risk.<br/><br/><strong>After antibiotics:</strong><br/>Bacterial pneumonia became treatable. TB mortality collapsed. Syphilis was curable. Post-surgical infection could be managed. Maternal mortality from infection fell dramatically. Life expectancy across the developed world rose sharply from the late 1940s onward.',
          },
          {
            type: 'quiz',
            question: 'Which statement BEST explains why antibiotics mattered so much for medicine?',
            options: [
              { text: 'They dramatically reduced death rates from bacterial infections that had previously been untreatable', correct: true },
              { text: 'They replaced surgery in all medical procedures', correct: false },
              { text: 'They eliminated all disease from human populations', correct: false },
              { text: 'They ended the need for hospitals and medical staff', correct: false },
            ],
            explanation: 'Antibiotics solved the problem that had defeated medicine for centuries: killing bacteria inside the body without killing the patient. Death rates from treatable infections collapsed. This is what "revolutionary" means — not just improvement, but a fundamental change in what medicine could achieve.',
          },
          {
            type: 'keypoint',
            text: '🧠 <strong>Significance in one sentence:</strong> "Antibiotics were the first effective treatment for bacterial disease inside the body — transforming medicine from powerless in the face of infection to capable of defeating it." Use this construction in your exam answers.',
          },
          {
            type: 'examtip',
            label: '⚔️ Exam Assassin',
            tip: '"Focus on impact and significance, not just description." Don\'t write: "Penicillin was important because it helped people." Write: "Penicillin reduced death rates from bacterial infection dramatically, transforming conditions like pneumonia and sepsis from death sentences into treatable illnesses — representing the single biggest leap in medicine\'s ability to treat disease."',
          },
        ],
      },

      // Screen 8 — The NHS
      {
        label: 'The NHS',
        kicker: '1948',
        heading: 'Free healthcare for everyone.',
        headerImage: '/images/nhs-1948.png',
        sub: 'The National Health Service opened on 5 July 1948. It was built on the same belief as penicillin: that medicine should reach everyone.',
        blocks: [
          {
            type: 'read',
            label: '🏥 What Was the NHS?',
            text: 'The National Health Service was created by Aneurin Bevan under the Labour government in 1948. For the first time in British history, healthcare was <strong>free at the point of use</strong> — paid for through taxation, available to everyone regardless of income.<br/><br/>Before the NHS: if you couldn\'t afford a doctor, you didn\'t see one. Medicines cost money. Surgery could bankrupt a family. The war had demonstrated what organised, state-funded medicine could achieve. The NHS was built on that lesson.',
          },
          {
            type: 'quiz',
            question: 'Why was the creation of the NHS in 1948 significant for medicine in Britain?',
            options: [
              { text: 'It made healthcare free and universally accessible for the first time, removing cost as a barrier to treatment', correct: true },
              { text: 'It gave doctors the power to prescribe penicillin without government approval', correct: false },
              { text: 'It replaced all existing hospitals with new purpose-built NHS buildings', correct: false },
              { text: 'It ended the need for private medical insurance in Britain permanently', correct: false },
            ],
            explanation: 'The NHS removed cost as a barrier to healthcare. Before 1948, many working-class people avoided doctors because they couldn\'t afford fees. Universal free access meant medical breakthroughs like penicillin could reach everyone, not just those who could pay.',
          },
          {
            type: 'keypoint',
            text: '🧠 <strong>The NHS as a turning point:</strong> Medical breakthroughs like penicillin only save lives if people can <em>access</em> them. The NHS solved the access problem. It is why the antibiotic revolution benefited the whole population, not just the wealthy.',
          },
          {
            type: 'examtip',
            label: '⚔️ Exam Assassin',
            tip: 'If asked about factors in improving public health in the 20th century — always include the NHS (1948). It connects every medical breakthrough to universal access. Link it: "Penicillin was discovered in 1928 and mass-produced by the 1940s — but the NHS (1948) ensured everyone could access it, not just those who could afford private treatment."',
          },
        ],
      },

      // Screen 9 — Source Detective
      {
        label: 'Source Detective',
        kicker: 'Exam Skill',
        heading: 'What does this source suggest about penicillin?',
        sub: 'Inference — not description. Build the skill here.',
        blocks: [
          {
            type: 'read',
            label: '🔍 The Source Analysis Challenge',
            text: 'AQA sources on penicillin often show: wartime hospital wards, soldiers recovering, factory production lines, or newspaper headlines about the "wonder drug." The skill is to move beyond what you can <em>see</em> and explain what the source <em>suggests</em> — using your own knowledge to explain <em>why</em>.',
          },
          {
            type: 'quiz',
            question: 'A source shows a wartime military hospital: rows of soldiers in beds, nurses administering injections, clearly recovering. Which student gives the strongest historical inference?',
            options: [
              { text: 'Student A: "Penicillin was important and helped soldiers."', correct: false },
              { text: 'Student B: "The organised administration of treatment suggests penicillin was being systematically used by 1944 — the volume of patients implies mass production had been achieved."', correct: true },
              { text: 'Student C: "There are lots of soldiers in hospital which shows WWII was dangerous."', correct: false },
              { text: 'Student D: "The nurses are giving injections which shows medicine was good."', correct: false },
            ],
            explanation: 'Student B uses the source as evidence — inferring from specific details (organised, systematic, high volume) and linking to own knowledge (mass production, wartime context). Students A, C and D describe without inferring. This is the difference between 1 mark and 4 marks.',
          },
          {
            type: 'keypoint',
            text: '🧠 <strong>Source Analysis Formula:</strong> "The source suggests [X] because [specific detail]. This is supported by the fact that [own knowledge]. However, the source cannot tell us [limitation]." Three parts. Every time.',
          },
          {
            type: 'examtip',
            label: '⚔️ Exam Assassin',
            tip: '"Precise explanation beats vague praise." Student B scored higher not because they knew more — but because they explained MORE precisely. "Dramatically reduced deaths from bacterial infection" beats "was important." Precision wins marks.',
          },
        ],
      },

      // Screen 9 — Final Boss
      {
        label: 'Final Boss',
        kicker: 'Challenge',
        heading: '⚔️ Final Boss: Why Did Penicillin Succeed?',
        sub: 'Three questions. Written answers. AI examiner marks against AQA criteria.',
        blocks: [
          {
            type: 'read',
            label: '🔥 The Challenge',
            text: 'Explain why penicillin became a successful treatment by the 1940s. Your answers should connect Fleming, Florey and Chain, teamwork, technology, WWII and mass production. Write — then submit.',
          },
          {
            type: 'boss',
            tier: '🟢',
            label: 'Round 1 — Core Knowledge',
            question: 'Explain what Alexander Fleming discovered in 1928 and why it was not immediately useful as a medicine.',
            markPoints: `- Fleming discovered penicillin accidentally — a mould (Penicillium notatum) was killing surrounding bacteria on a contaminated culture plate
- He named the substance penicillin and published findings in 1929
- It was NOT immediately useful because: it couldn't be purified with available technology; it was chemically unstable; there was no way to produce enough for clinical use; funding was not provided
- Discovery ≠ usable medicine — the development stage was still required
- Award 1 mark per valid developed point (up to 4 marks)`,
          },
          {
            type: 'boss',
            tier: '🟡',
            label: 'Round 2 — Analysis',
            question: 'Explain why Florey and Chain\'s contribution to penicillin was arguably more important than Fleming\'s discovery.',
            markPoints: `- Florey and Chain purified penicillin using advanced chemical techniques (1940)
- They tested it systematically — first on mice, then on a human patient (1941)
- They proved it worked clinically — the first human trial demonstrated dramatic recovery
- They published results and actively lobbied for mass production and government/military funding
- Fleming could not solve purification, stability or production problems
- Without Florey and Chain, Fleming's observation would have remained a laboratory curiosity
- They drove the transition from discovery to usable medicine
- Award 1 mark per developed point (up to 6 marks)`,
          },
          {
            type: 'boss',
            tier: '🔴',
            label: 'Round 3 — Boss Mode',
            question: '"WWII was the most important reason penicillin became a successful treatment by the 1940s." How far do you agree? Explain your answer.',
            markPoints: `- Agreement — WWII was crucial:
  - Created urgent military demand — infected wounds were killing soldiers faster than bullets
  - American government provided enormous funding for pharmaceutical companies
  - New fermentation techniques developed under wartime pressure
  - By D-Day 1944: 100 billion units produced per month — enough for battlefield treatment
  - Without wartime urgency, mass production would have taken decades longer
- Disagreement — other factors equally or more important:
  - Fleming's 1928 observation was the essential starting point — without it, nothing else follows
  - Florey and Chain's 1940 purification and clinical trials were required BEFORE mass production was possible
  - Ehrlich's earlier work on magic bullets showed targeted chemical treatment was achievable — inspired the field
  - Science and technology (new fermentation, chemical engineering) were prerequisites for production
- Balanced conclusion: WWII was the accelerant — it provided the funding and urgency to scale production rapidly. But without Fleming's discovery and Florey/Chain's development, there was nothing to produce. All three stages were necessary. WWII was arguably the most important in turning medicine into mass treatment — but discovery and development came first.
- Award marks for: AO1 knowledge across multiple factors, AO2 specific evidence and examples, AO3 sustained evaluation with justified conclusion`,
          },
        ],
      },

      // Screen 10 — Retrieval + Reflection
      {
        label: 'Retrieval',
        kicker: 'Final Retrieval',
        heading: 'Lock it in. No notes.',
        sub: 'Six questions. Everything from this module. Answer before you check.',
        blocks: [
          {
            type: 'read',
            label: '🔁 Why Retrieval Works',
            text: 'Testing yourself without looking back builds long-term memory faster than rereading. These questions mix topics from across the whole module — exactly how AQA papers work.',
          },
          {
            type: 'tieredquiz',
            tiers: [
              {
                label: 'Core Facts', emoji: '🟢',
                questions: [
                  {
                    q: 'What did Paul Ehrlich call his concept of a chemical that targets specific bacteria?',
                    options: [
                      'A magic bullet',
                      'A penicillin compound',
                      'A germ antidote',
                      'A carbolic agent',
                    ],
                    correct: 0,
                    feedback: 'Magic bullet — a chemical that could target and destroy specific bacteria without harming the patient. Ehrlich\'s Salvarsan 606 (1909) was the first working example, treating syphilis.',
                    hint: 'Ehrlich wanted something that would "shoot" only the bacteria — like a targeted...',
                  },
                  {
                    q: 'How did Fleming discover penicillin?',
                    options: [
                      'Accidentally — he noticed mould killing bacteria on a contaminated culture plate',
                      'Deliberately — he designed an experiment to test whether mould could fight infection',
                      'Through a government-funded systematic research programme',
                      'By applying Ehrlich\'s magic bullet concept to mould cultures',
                    ],
                    correct: 0,
                    feedback: 'Fleming returned from holiday to find a contaminated dish where mould (Penicillium notatum) had killed surrounding bacteria. The discovery was accidental — the significance was noticed through careful observation.',
                    hint: 'He came back from holiday and found something he hadn\'t planned for...',
                  },
                  {
                    q: 'Which two scientists developed penicillin into a usable medicine?',
                    options: [
                      'Florey and Chain',
                      'Fleming and Ehrlich',
                      'Pasteur and Lister',
                      'Darwin and Koch',
                    ],
                    correct: 0,
                    feedback: 'Howard Florey and Ernst Chain at Oxford University purified penicillin, tested it on mice (1940), then humans (1941), and drove mass production. They shared the Nobel Prize with Fleming in 1945.',
                    hint: 'Oxford University, 1940 — two names, one Australian, one German refugee...',
                  },
                ],
              },
              {
                label: 'Application', emoji: '🟡',
                questions: [
                  {
                    q: 'A student writes: "Fleming discovered penicillin so he saved millions of lives." What is wrong with this answer?',
                    options: [
                      'It ignores the development work of Florey and Chain and the mass production driven by WWII — discovery alone didn\'t save lives',
                      'Fleming didn\'t actually discover penicillin — Florey did',
                      'Penicillin hasn\'t actually saved millions of lives',
                      'The answer is correct and nothing is wrong with it',
                    ],
                    correct: 0,
                    feedback: 'Fleming observed penicillin — but couldn\'t purify, stabilise or produce it. Florey and Chain developed it into medicine. WWII produced it at scale. All three stages were necessary. Attributing everything to one person misses the key analytical point.',
                    hint: 'What happened AFTER Fleming\'s discovery that actually got penicillin to patients?',
                  },
                  {
                    q: 'Why is the phrase "discovery of causes ≠ effective treatment" important in the history of infection?',
                    options: [
                      'Germ theory (1860s) identified bacteria as the cause of disease — but doctors couldn\'t kill bacteria inside the body until antibiotics in the 1940s',
                      'Medieval doctors knew what caused disease but chose not to treat it',
                      'Fleming discovered the cause of infection and immediately created a treatment',
                      'Ehrlich proved germ theory was wrong by discovering magic bullets',
                    ],
                    correct: 0,
                    feedback: 'This is one of the biggest analytical points in the module: 80 years passed between Pasteur identifying bacteria (1860s) and penicillin being mass-produced (1940s). Knowledge of cause did not mean ability to treat. That gap explains why so many people still died from infection in the late 19th and early 20th centuries.',
                    hint: 'When was germ theory established? When were antibiotics mass-produced? What happened in between?',
                  },
                ],
              },
              {
                label: 'Exam Assassin', emoji: '🔴',
                questions: [
                  {
                    q: 'Evaluate: which was more important for the development of penicillin — Fleming\'s discovery or Florey and Chain\'s development?',
                    options: [
                      'Florey and Chain were arguably more important: their purification, clinical trials and production drive converted a lab curiosity into medicine that saved lives. Without development, discovery was worthless.',
                      'Fleming was more important because without the initial discovery there would have been nothing to develop.',
                      'Both were equally important — you cannot evaluate which mattered more.',
                      'WWII was the most important factor because it provided the funding.',
                    ],
                    correct: 0,
                    feedback: 'This is the strongest evaluative answer. Option A acknowledges Fleming\'s necessity but argues development was harder and more consequential — and explains WHY. Option B is true but doesn\'t evaluate. Option C dodges evaluation. Option D is valid for a different question but doesn\'t address this one.',
                    hint: 'Which stage actually got penicillin into patients\' bodies? Which stage just identified the substance?',
                  },
                  {
                    q: '"War is a major factor in medical progress." Using penicillin as evidence, what is the strongest way to support this claim?',
                    options: [
                      'WWII created urgency and US government investment that scaled penicillin production from grams to tons within three years — something peacetime science could not have achieved in under a decade',
                      'War means more patients are injured, so doctors get more practice',
                      'Wars cause governments to care more about medicine generally',
                      'WWII meant more scientists were working in laboratories',
                    ],
                    correct: 0,
                    feedback: 'The strongest support for "war accelerates progress" is SPECIFIC: describe the scale of production change (grams → tons), the mechanism (US government investment + urgency), and the timeframe (three years). General statements about governments caring or doctors practicing don\'t demonstrate the specific mechanism.',
                    hint: 'Be specific: what exactly did WWII do to penicillin production? How quickly? What scale?',
                  },
                ],
              },
            ],
          },
          {
            type: 'keypoint',
            text: '🎓 <strong>You survived the age before antibiotics.</strong> That was genuinely difficult.<br/><br/>You now understand one of the greatest medical breakthroughs in history: why infection was still killing people despite germ theory, how Ehrlich\'s magic bullets opened the door, how Fleming made his accidental observation, why Florey and Chain did the harder work, and how WWII turned laboratory science into mass medicine.<br/><br/>That\'s the War Against Infection done.',
          },
        ],
      },
    ],
  },

  // ── History Module 8: Inside Modern Medicine ──────────────────────────────────
  {
    id: 'mod8',
    subject: 'History',
    number: 9,
    title: 'Inside Modern Medicine',
    subtitle: 'Scans, Transplants, DNA & The Future',
    era: 'c1945–present',
    icon: '🧬',
    color: '#1A5276',
    colorLight: 'rgba(26,82,118,.12)',
    hook: {
      atmosphericOpener: {
        heading: 'A SURGEON STUDIES A 3D SCAN. THE PATIENT IS NOT YET IN THE ROOM.',
        sub: 'Robotic arms hold the instruments. The incision will be 1cm. The patient goes home tomorrow.',
        cta: 'ENTER MODERN MEDICINE',
      },
      scenario: {
        location: 'A modern operating theatre, 2024',
        hint: 'A surgeon studies a full 3D body scan before making a single cut. Robotic surgical tools move with sub-millimetre precision. The patient\'s DNA has already flagged a genetic risk factor. To a doctor in 1900, this would feel like science fiction.',
      },
      statement: 'Modern medicine mainly improved because doctors became more intelligent.',
      isTrue: false,
      accentWords: ['more intelligent'],
      explanation: "Intelligence had almost nothing to do with it. Government investment, the NHS, technology, genetics and teamwork transformed what medicine could do — not cleverness.",
      wrongFeedback: 'Individual brilliance mattered — but it was technology, teamwork, government funding and communication that transformed medicine. No single person or factor did it alone.',
      correctFeedback: 'Correct. Modern medicine improved because of technology, scientific discoveries, government funding, computers, communication and teamwork — not simply because doctors became smarter.',
      loadingText: 'Scanning the evidence…',
      bigQuestion: 'If it wasn\'t intelligence alone — what actually transformed medicine?',
      revealHeader: 'Technology and teamwork transformed medicine.',
      revealItems: [
        {
          emoji: '🧬',
          label: 'DNA and genetics',
          detail: 'Understanding the genetic code of life allowed medicine to predict disease risk, develop targeted treatments and begin personalising medicine to the individual patient.',
          color: '#9A5A18',
          bg: 'rgba(154,90,24,.08)',
        },
        {
          emoji: '🖥️',
          label: 'Medical scanning technology',
          detail: 'X-rays, CT scans, MRI and ultrasound allowed doctors to see inside the body without cutting it open. Diagnosis became faster, safer and more accurate than ever before.',
          color: '#9A5A18',
          bg: 'rgba(154,90,24,.08)',
        },
        {
          emoji: '🤖',
          label: 'Precision surgery and robotics',
          detail: 'Keyhole and robotic surgery reduced incision size, recovery time and risk. Operations that once required weeks of recovery now take hours. Surgery became a science of precision, not just survival.',
          color: '#9A5A18',
          bg: 'rgba(154,90,24,.08)',
        },
      ],
      punchline: 'Modern medicine became powerful through science, technology, government support and teamwork — not individual genius alone.',
    },
    intro: {
      learningGoals: [
        'Explain how scanning technology transformed diagnosis',
        'Describe transplant surgery and why early attempts failed',
        'Explain the significance of keyhole and robotic surgery',
        'Explain the discovery of DNA and its significance for medicine',
        'Identify the ethical debates created by modern medical technology',
        'Evaluate which factors most transformed medicine after 1945',
      ],
    },
    outcomes: {
      intro: 'Scans, transplants, genetic sequencing — the 20th century changed what medicine could even imagine doing.',
      bullets: [
        'Describe how diagnostic technology changed the way doctors see inside the body',
        'Explain what finally made organ transplants possible',
        'See how DNA changed our understanding of disease and treatment',
        'Discuss the ethical questions that modern medicine has created',
      ],
    },

    recall: {
      questions: [
        { type: 'truefalse', question: 'The first successful organ transplant was a heart transplant.', isTrue: false },
        { type: 'choice', question: 'DNA\'s double helix was discovered by...', options: ['Einstein and Oppenheimer', 'Watson, Crick, Franklin and Wilkins', 'Koch and Pasteur'], correct: 1 },
        { type: 'connection', question: 'Modern medicine\'s biggest challenges are...', options: [
          { text: 'Lack of scientific knowledge and technology', icon: 'atom' },
          { text: 'Cost, access and difficult ethical decisions', icon: 'people' },
          { text: 'Too many competing treatments available', icon: 'warning' },
        ], correct: 1 },
      ],
    },
    screens: [

      // Screen 1 — Seeing Inside the Body
      {
        label: 'Medical Scanning',
        kicker: 'Diagnosis',
        heading: 'Doctors could finally see inside the body.',
        sub: 'For most of history, doctors guessed what was happening internally. Scanning technology changed everything.',
        blocks: [
          {
            type: 'read',
            label: '🔬 From Guesswork to Precision',
            text: 'Before modern scans, diagnosing internal problems meant:<br/>• Guessing based on symptoms<br/>• Exploratory surgery (opening the body to look)<br/>• Physical examination alone<br/><br/>Modern imaging changed diagnosis completely:<br/><br/>⚡ <strong>X-rays (1895)</strong> — revealed bone fractures and dense structures<br/>🔬 <strong>CT scans</strong> — detailed cross-section "slices" through the body; detect tumours, bleeds<br/>🧲 <strong>MRI scans</strong> — detailed soft tissue imaging; no radiation; sees muscles, brain, organs<br/>🌊 <strong>Ultrasound</strong> — uses sound waves; safe for monitoring unborn babies and soft tissue',
          },
          {
            type: 'quiz',
            question: 'Which development MOST improved doctors\' ability to diagnose internal problems safely?',
            options: [
              { text: 'Bloodletting — removing blood to rebalance the humours', correct: false },
              { text: 'MRI and CT scanning — revealing internal structures without surgery', correct: true },
              { text: 'Astrology — reading planetary alignments to predict illness', correct: false },
              { text: 'The Four Humours — balancing blood, phlegm and bile', correct: false },
            ],
            explanation: 'MRI and CT scanning transformed diagnosis by making the invisible visible — safely, without cutting the body open. Doctors could now detect tumours, bleeds and fractures that would previously have required exploratory surgery or remained undiagnosed.',
          },
          {
            type: 'keypoint',
            text: '⚔️ <strong>Exam Assassin:</strong> "Technology often improved diagnosis BEFORE treatment." Scans allowed doctors to find and understand conditions precisely — making subsequent treatment far more targeted and effective. Don\'t just say scans "helped doctors." Say: "Scanning technology transformed diagnosis by revealing internal conditions without surgical intervention, enabling earlier and more accurate treatment."',
          },
          {
            type: 'funfact',
            label: '🧬 MRI: An Accidental Revolution',
            text: 'MRI (Magnetic Resonance Imaging) was developed from nuclear physics research in the 1970s. Raymond Damadian built the first human MRI scanner in 1977. It took 5 hours to produce a single chest scan. Modern MRI machines produce high-resolution full-body images in minutes. The principle — using magnetic fields to detect hydrogen atoms in body tissue — came from physics, not medicine. This is a classic example of technology from one field transforming another.',
          },
        ],
      },

      // Screen 2 — Transplant Surgery
      {
        label: 'Transplants',
        kicker: 'Surgery',
        heading: 'Doctors could replace failing body parts.',
        sub: 'The idea was simple. The biology was not.',
        blocks: [
          {
            type: 'read',
            label: '🏥 From Impossible to Routine',
            text: 'The first heart transplant was performed by <strong>Christiaan Barnard</strong> in South Africa in 1967. The patient survived 18 days. Early attempts at organ transplantation faced one problem above all others: <strong>rejection</strong> — the immune system attacking the transplanted organ as foreign tissue.<br/><br/>The breakthrough came from <strong>immunosuppressant drugs</strong> (particularly cyclosporine, developed in the 1970s–80s), which suppressed the immune response enough for transplanted organs to survive. Today, heart, kidney, liver, lung and even face transplants are performed routinely.',
          },
          {
            type: 'quiz',
            question: 'Why did many early organ transplants fail?',
            options: [
              { text: 'Surgeons had no anaesthetics available during transplant operations', correct: false },
              { text: 'The patient\'s immune system attacked and rejected the transplanted organ', correct: true },
              { text: 'Transplant surgery was made illegal in most countries before 1970', correct: false },
              { text: 'Surgeons lacked the equipment needed to perform basic transplant procedures', correct: false },
            ],
            explanation: 'The immune system is designed to destroy foreign tissue — which includes transplanted organs. Early transplants often failed because the body treated the new organ as an infection. Immunosuppressant drugs solved this by reducing the immune response enough for the organ to establish itself.',
          },
          {
            type: 'keypoint',
            text: '🧠 <strong>The Transplant Chain:</strong> Surgery alone wasn\'t enough. Transplants required: surgical skill + anaesthetics + blood transfusions + immunosuppressant drugs + organ donor networks + refrigeration technology for organ transport. Modern medicine works in systems, not single solutions.',
          },
          {
            type: 'examtip',
            label: '⚔️ Exam Assassin',
            tip: '"Strong GCSE answers explain WHY developments succeeded." Don\'t just write "transplants worked because of better surgery." Write: "Organ transplant success rates improved dramatically after the development of cyclosporine (immunosuppressant drugs) in the 1970s, which prevented the immune system from rejecting the transplanted organ."',
          },
        ],
      },

      // Screen 3 — Keyhole & Robotic Surgery
      {
        label: 'Precision Surgery',
        kicker: 'Surgery',
        heading: 'Smaller cuts. Faster recovery. Better outcomes.',
        sub: 'Modern surgery stopped being about survival and started being about precision.',
        blocks: [
          {
            type: 'read',
            label: '🔪 The Revolution in Surgical Technique',
            text: '<strong>Traditional open surgery:</strong> large incisions, significant blood loss, weeks of recovery, high infection risk, visible scarring.<br/><br/><strong>Keyhole surgery (laparoscopy):</strong> tiny incisions (1–3cm), a camera (laparoscope) and miniaturised instruments inserted through small holes. The surgeon watches on a screen. Recovery time falls from weeks to days.<br/><br/><strong>Robotic surgery (da Vinci system, 1999):</strong> the surgeon controls robotic arms with sub-millimetre precision from a console. Robotic arms don\'t shake. They can access areas of the body human hands cannot reach. Used in prostate surgery, heart procedures, complex abdominal operations.',
          },
          {
            type: 'colsort',
            question: 'Traditional open surgery or modern keyhole/robotic surgery?',
            columns: [
              { label: 'TRADITIONAL SURGERY\nOpen, larger, slower recovery', color: '#C47828', bg: 'rgba(196,120,40,.07)' },
              { label: 'MODERN SURGERY\nPrecise, minimal, faster recovery', color: '#4B90FF', bg: 'rgba(75,144,255,.07)' },
            ],
            items: [
              { label: 'Large abdominal incision to access organs', col: 0, explanation: 'Open surgery requires large cuts — useful when the surgeon needs to see and work directly, but causes greater trauma and longer recovery.' },
              { label: 'Camera inserted through a 1cm incision', col: 1, explanation: 'Laparoscopy — keyhole surgery uses a tiny camera (laparoscope) so the surgeon can see without opening the body fully.' },
              { label: 'Weeks of recovery in hospital after procedure', col: 0, explanation: 'Traditional open surgery often requires extended hospital stays and lengthy recovery as large wounds heal.' },
              { label: 'Patient discharged within 24 hours of procedure', col: 1, explanation: 'Keyhole surgery\'s minimal tissue damage means most patients can go home the same day or the next morning.' },
              { label: 'Robotic arms controlled by surgeon from a console', col: 1, explanation: 'The da Vinci system allows sub-millimetre precision — robotic arms don\'t tremble and can access regions human hands cannot.' },
              { label: 'Significant scarring visible after recovery', col: 0, explanation: 'Larger incisions leave larger scars. This is cosmetically and physically more demanding on the patient.' },
            ],
            explanation: 'Keyhole and robotic surgery changed the goal of surgery from "survive the operation" to "recover quickly and return to normal life." Precision became as important as survival.',
          },
          {
            type: 'quiz',
            question: 'Which statement BEST explains the significance of keyhole surgery?',
            options: [
              { text: 'It completely removed all surgical risk from modern procedures', correct: false },
              { text: 'It dramatically reduced recovery time and tissue damage, improving patient outcomes', correct: true },
              { text: 'It replaced all traditional surgeons with robotic systems', correct: false },
              { text: 'It eliminated infection as a risk in post-operative care', correct: false },
            ],
            explanation: 'Keyhole surgery\'s significance is reduced trauma, faster recovery and better outcomes — not the elimination of risk. It reflects a shift in the goal of surgery: from survival to precision and quality of life.',
          },
        ],
      },

      // Screen 4 — DNA Discovery
      {
        label: 'DNA',
        kicker: '1953',
        heading: 'The code inside every cell.',
        sub: 'Watson, Crick and Franklin unlocked the instruction manual for life itself.',
        headerImage: '/images/watson-crick-1953.png',
        blocks: [
          {
            type: 'read',
            label: '🧬 What DNA Is and Why It Matters',
            text: 'In 1953, <strong>James Watson</strong> and <strong>Francis Crick</strong> published their model of the DNA double helix structure — based critically on X-ray crystallography data produced by <strong>Rosalind Franklin</strong> (whose contribution was not acknowledged at the time).<br/><br/>DNA (deoxyribonucleic acid) is the molecule that carries the genetic instructions for all living organisms. It explains:<br/>• How physical traits are inherited from parents<br/>• Why some diseases run in families<br/>• Why individuals respond differently to medicines<br/>• How cancer develops at a cellular level',
          },
          {
            type: 'fillblanks',
            sentences: [
              {
                before: 'The structure of DNA was described as a',
                after: 'helix.',
                answer: 'double',
                hints: ['It has two strands twisted together — a double...', 'Two spiralling strands. Double...'],
              },
              {
                before: 'Watson and Crick published their DNA model in',
                after: '.',
                answer: '1953',
                hints: ['Mid-20th century, after WWII.', 'Two years before the NHS had its 7th birthday.'],
              },
              {
                before: 'Understanding DNA helped explain how diseases can be',
                after: 'through families.',
                answer: 'inherited',
                hints: ['Passed from parent to child — like traits and conditions.', 'Think: family history of cancer, heart disease...'],
              },
            ],
            correctMsg: 'Good. DNA → double helix → 1953 → inherited disease. That chain scores marks.',
            wrongMsg: 'Look back at the DNA content and try again with the exact term.',
          },
          {
            type: 'quiz',
            question: 'Why was the discovery of DNA\'s structure important for medicine?',
            options: [
              { text: 'It explained inheritance and opened the way for understanding genetic disease and personalised treatment', correct: true },
              { text: 'It immediately cured every genetic disease known at the time', correct: false },
              { text: 'It replaced surgery as the primary form of medical treatment', correct: false },
              { text: 'It proved that infections were caused by DNA rather than bacteria', correct: false },
            ],
            explanation: 'DNA\'s significance is long-term: understanding the genetic code of life opened up genetic medicine, gene therapy, personalised treatment and understanding of inherited disease risk. It did not immediately cure anything — but it transformed the trajectory of medicine.',
          },
          {
            type: 'keypoint',
            text: '⚔️ <strong>Exam Assassin — Rosalind Franklin:</strong> Franklin\'s X-ray crystallography images of DNA (particularly "Photo 51") were essential to Watson and Crick\'s model. She died in 1958 and could not receive the Nobel Prize (awarded 1962 — only to living recipients). AQA may ask about her contribution and the ethical issues around attribution in scientific discovery.',
          },
        ],
      },

      // Screen 5 — Ethics & Modern Medicine
      {
        label: 'Medical Ethics',
        kicker: 'Debate',
        heading: 'Just because medicine CAN — should it?',
        sub: 'Modern technology creates possibilities that didn\'t exist before. Some of them are deeply uncomfortable.',
        blocks: [
          {
            type: 'read',
            label: '⚖️ New Power, New Questions',
            text: 'As medicine gained the ability to manipulate genes, grow embryonic stem cells, clone animals and use AI for diagnosis, society faced questions that had never existed before:<br/><br/>Should we select embryos based on genetic profiles? Who owns your DNA data? Should we extend human lifespan indefinitely? Can an AI algorithm replace a doctor\'s judgement? Who decides which patients get organ transplants?<br/><br/>These are not hypothetical questions — they are decisions being made right now.',
          },
          {
            type: 'colsort',
            question: 'Sort each consideration into: potential benefit or ethical concern.',
            columns: [
              { label: 'POTENTIAL BENEFIT\nWhat it could achieve', color: '#4DFF88', bg: 'rgba(77,255,136,.07)' },
              { label: 'ETHICAL CONCERN\nWhat worries people', color: '#FF5D73', bg: 'rgba(255,93,115,.07)' },
            ],
            items: [
              { label: 'Genetic testing could predict and prevent inherited disease', col: 0, explanation: 'Identifying genetic risk allows earlier intervention, monitoring and lifestyle changes that could prevent serious illness developing.' },
              { label: 'Genetic data could be used by insurers to deny coverage', col: 1, explanation: 'If insurance companies access your DNA profile, they might refuse coverage or charge higher premiums based on genetic risk — creating discrimination.' },
              { label: 'Stem cell research could repair damaged organs and tissue', col: 0, explanation: 'Embryonic stem cells can develop into any cell type — potentially regenerating damaged heart muscle, spinal cord or brain tissue.' },
              { label: 'Embryo research destroys potential human life', col: 1, explanation: 'Embryonic stem cell research requires destroying human embryos at an early stage — raising serious religious and ethical objections.' },
              { label: 'AI diagnosis could detect cancer earlier than human doctors', col: 0, explanation: 'AI systems trained on millions of scans can detect patterns and anomalies that human eyes miss, enabling earlier treatment when cancer is most curable.' },
              { label: 'AI errors could harm patients if misdiagnosis goes unchecked', col: 1, explanation: 'If AI systems make systematic errors and doctors defer to them without critical review, patients could be seriously harmed without adequate redress.' },
            ],
            explanation: 'Modern medicine creates genuine ethical dilemmas — not obvious villains and heroes. Every benefit listed here has a corresponding risk. AQA asks you to acknowledge BOTH sides.',
          },
          {
            type: 'quiz',
            question: 'Which statement BEST explains why modern medicine creates ethical debate?',
            options: [
              { text: 'Medicine became less effective in the 20th century, causing public distrust', correct: false },
              { text: 'New technology creates genuinely difficult decisions about how its power should be used', correct: true },
              { text: 'Doctors stopped following ethical guidelines after the NHS was created', correct: false },
              { text: 'Modern surgery is too dangerous to be ethically acceptable', correct: false },
            ],
            explanation: 'The ethical debates arise precisely BECAUSE medicine became more powerful — not less. Greater capability means greater responsibility. Decisions about genetic engineering, cloning and AI diagnosis require society to agree on values and limits that didn\'t previously need to exist.',
          },
          {
            type: 'examtip',
            label: '⚔️ Exam Assassin',
            tip: '"Top judgement answers explain BOTH advantages and concerns." If asked "Is genetic engineering beneficial?" — a one-sided answer loses marks. Structure it: "Genetic engineering offers [specific benefit] because [explanation]. However, it also raises concerns about [specific concern] because [explanation]. On balance, [your justified judgement]."',
          },
        ],
      },

      // Screen 6 — What Changed Medicine Most?
      {
        label: 'What Changed Most?',
        kicker: 'Synoptic',
        heading: 'What actually transformed modern medicine?',
        sub: 'No single factor did it. Build the connections.',
        blocks: [
          {
            type: 'read',
            label: '🔗 Linked Factors — Not Single Causes',
            text: 'AQA rewards students who explain <em>how factors connect</em> — not just who lists them. Modern medicine advanced because multiple factors worked together simultaneously:<br/><br/>🔬 <strong>Science</strong> gave medicine understanding (DNA, germ theory, immunology)<br/>⚡ <strong>Technology</strong> gave medicine tools (MRI, robotic surgery, genetic sequencing)<br/>🏛 <strong>Government</strong> gave medicine scale (NHS, research funding, regulation)<br/>⚔️ <strong>War</strong> accelerated medicine (penicillin production, blood transfusions, surgery)<br/>🤝 <strong>Teams</strong> replaced lone geniuses (Fleming + Florey + Chain + factories)',
          },
          {
            type: 'colsort',
            question: 'Match each development to its primary driving factor.',
            columns: [
              { label: 'TECHNOLOGY', color: '#4B90FF', bg: 'rgba(75,144,255,.07)' },
              { label: 'SCIENCE', color: '#4DFF88', bg: 'rgba(77,255,136,.07)' },
              { label: 'GOVERNMENT / TEAMWORK', color: '#C47828', bg: 'rgba(196,120,40,.07)' },
            ],
            items: [
              { label: 'MRI and CT scanning transforms diagnosis', col: 0, explanation: 'Medical scanning is fundamentally a technology achievement — applying physics and computing to produce images of internal body structures.' },
              { label: 'DNA structure unlocks understanding of inheritance', col: 1, explanation: 'The discovery of DNA\'s double helix is a scientific breakthrough — advancing fundamental biological knowledge rather than developing a tool or institution.' },
              { label: 'NHS provides universal access to all medical advances', col: 2, explanation: 'The NHS is a government institution — it didn\'t create medical breakthroughs, but it ensured the whole population could access them.' },
              { label: 'Robotic surgery enables sub-millimetre precision', col: 0, explanation: 'Robotic surgery systems are technology — engineering that extends human physical capability beyond what unaided hands can achieve.' },
              { label: 'Florey and Chain\'s team develops penicillin clinically', col: 2, explanation: 'The Oxford team exemplifies teamwork — multiple specialists working together, sharing knowledge across disciplines to solve a development problem.' },
              { label: 'Immunosuppressant drugs enable organ transplants', col: 1, explanation: 'Cyclosporine and similar drugs emerged from immunological science — understanding how the immune system works allowed scientists to modulate it safely.' },
            ],
            explanation: 'No single factor explains modern medicine. Technology, science and government/teamwork worked in parallel — each amplifying the others. AQA rewards answers that explain these links.',
          },
          {
            type: 'quiz',
            question: 'Which factor MOST accelerated modern medicine after 1945?',
            options: [
              { text: 'Medieval monasteries preserving ancient medical texts', correct: false },
              { text: 'Science and technology increasingly working together with government support', correct: true },
              { text: 'Bloodletting and traditional humoral treatments', correct: false },
              { text: 'Astrology providing medical guidance to practitioners', correct: false },
            ],
            explanation: 'Modern medicine accelerated because science and technology became mutually reinforcing — scientific discoveries created demand for new technologies, which enabled further scientific discoveries. Government funding (particularly through the NHS and research councils) gave this combination scale. No single factor alone explains the pace of change.',
          },
          {
            type: 'keypoint',
            text: '🧠 <strong>Synoptic Key Phrase:</strong> "Modern medicine improved because technology and science increasingly worked together, supported by government funding and teamwork — not because of any single discovery or individual." Use this construction when questions ask you to evaluate factors across the whole medicine course.',
          },
        ],
      },

      // Screen 7 — Source Detective
      {
        label: 'Source Detective',
        kicker: 'Exam Skill',
        heading: 'What does this source suggest about modern medicine?',
        sub: 'Final source analysis practice. Precision matters more than length.',
        blocks: [
          {
            type: 'read',
            label: '🔍 Reading Modern Sources',
            text: 'AQA sources on modern medicine often show: hospital environments, medical technology in use, patients recovering, research teams at work, or medical statistics. The skill is always the same — infer from specific details, link to your own knowledge, acknowledge limitations.',
          },
          {
            type: 'quiz',
            question: 'A source shows a modern hospital operating theatre: robotic surgical arms, screens displaying 3D body scans, a team of six specialists in sterile gowns. Which answer is STRONGER?',
            options: [
              { text: 'Student A: "Modern hospitals use a lot of technology."', correct: false },
              { text: 'Student B: "The presence of robotic surgical arms and 3D scan displays suggests that by the 21st century, surgery had become reliant on technology for both diagnosis and precision — a dramatic change from the 19th century when surgeons operated without any imaging guidance."', correct: true },
              { text: 'Student C: "The source tells us surgery is safer now than before."', correct: false },
              { text: 'Student D: "There are many doctors in the picture which shows medicine is teamwork."', correct: false },
            ],
            explanation: 'Student B uses specific details (robotic arms, 3D scan displays), links to own knowledge (comparison to 19th century surgery), and makes a precise inference about the period. Students A, C and D describe without inferring, or make observations without historical context.',
          },
          {
            type: 'keypoint',
            text: '🧠 <strong>Source Analysis Formula (Final Version):</strong><br/>"The source suggests [X] because [specific detail from source]. This is consistent with [own knowledge about the period]. The source is useful for understanding [specific aspect] but limited because [what it cannot tell us]."<br/><br/>Every source answer. Every time.',
          },
          {
            type: 'examtip',
            label: '⚔️ Exam Assassin',
            tip: '"Precise explanation beats vague description." Count the specific terms in your source answer. If you have fewer than three specific historical terms, add more. "Technology improved medicine" scores 1 mark. "MRI scanning enabled earlier diagnosis of tumours without surgical intervention, transforming cancer treatment outcomes" scores 4.',
          },
        ],
      },

      // Screen 8 — Final Boss
      {
        label: 'Final Boss',
        kicker: 'Challenge',
        heading: '⚔️ Final Boss: How Modern Is Modern Medicine?',
        sub: 'Three questions. Written answers. AI examiner marks against AQA criteria.',
        blocks: [
          {
            type: 'read',
            label: '🔥 The Challenge',
            text: 'Explain why medicine changed more rapidly after 1945 than in any earlier period. Your answers should connect: technology, scans, antibiotics, DNA, government funding and teamwork. Write — then submit.',
          },
          {
            type: 'boss',
            tier: '🟢',
            label: 'Round 1 — Core Knowledge',
            question: 'Explain how scanning technology transformed medical diagnosis. Give at least TWO examples of different scan types and what each revealed.',
            markPoints: `- X-rays (from 1895 onwards): revealed bones, fractures, bullets and dense structures without surgery
- CT scans: produced detailed cross-section images; able to detect tumours, internal bleeding, structural damage
- MRI scans: detailed soft tissue imaging using magnetic fields; no radiation; revealed brain conditions, muscle damage, organ problems
- Ultrasound: safe, uses sound waves; used for monitoring pregnancies and soft tissue without radiation risk
- Overall significance: diagnosis became faster, safer and more accurate; doctors could identify problems without exploratory surgery
- Award 1 mark per developed point (up to 4 marks)`,
          },
          {
            type: 'boss',
            tier: '🟡',
            label: 'Round 2 — Analysis',
            question: 'Explain why the discovery of DNA\'s structure in 1953 was significant for the long-term development of medicine.',
            markPoints: `- Watson and Crick published DNA double helix model in 1953 (with critical contribution from Rosalind Franklin's X-ray data)
- Explained the mechanism of inheritance — how genetic information passes from parent to child
- Opened understanding of genetic diseases: conditions like cystic fibrosis, Huntington's disease, BRCA cancer risk
- Foundation for genetic testing, gene therapy and personalised medicine
- Led to the Human Genome Project (completed 2003) — mapping every human gene
- Long-term significance: medicine became capable of understanding and potentially treating disease at its source (genetic level) rather than just managing symptoms
- Award 1 mark per developed point (up to 6 marks)`,
          },
          {
            type: 'boss',
            tier: '🔴',
            label: 'Round 3 — Boss Mode',
            question: '"Technology was the most important factor in transforming medicine after 1945." How far do you agree? Refer to at least TWO other factors in your answer.',
            markPoints: `- Agreement — technology was crucial:
  - Medical scanning (X-ray, CT, MRI, ultrasound) transformed diagnosis without surgery
  - Keyhole and robotic surgery reduced damage and recovery times dramatically
  - Computers and AI accelerated drug discovery, genetic analysis and diagnostic accuracy
  - DNA sequencing technology enabled the Human Genome Project and personalised medicine
- Science as an alternative factor:
  - DNA discovery (1953) was fundamentally a scientific breakthrough, not just technology
  - Understanding immunology enabled organ transplants (immunosuppressants)
  - Germ theory → antibiotics → modern pharmaceuticals: science created the foundations technology built on
- Government and teamwork as alternative factors:
  - NHS (1948) ensured medical advances reached the whole population, not just the wealthy
  - Government research funding (medical research councils, university funding) created the environment for breakthroughs
  - International scientific collaboration (Human Genome Project: 20 countries, 13 years) shows teamwork as essential
- Balanced conclusion: Technology was the most visible driver — and arguably the most distinctive feature of post-1945 medicine. But technology without science to inform it and government funding to support it would not have transformed medicine at the same pace. All three factors were necessary; technology was the accelerant but not the sole cause.
- Award marks for: AO1 knowledge of technology and other factors, AO2 specific examples and evidence, AO3 sustained evaluation with justified conclusion`,
          },
        ],
      },

      // Screen 9 — Retrieval + Reflection
      {
        label: 'Retrieval',
        kicker: 'Final Retrieval',
        heading: 'Lock it in. 700 years of medical history.',
        sub: 'Mixed questions across the whole module. No notes.',
        blocks: [
          {
            type: 'read',
            label: '🔁 The Final Test',
            text: 'This is retrieval without headings — exactly how AQA papers feel. The questions cover the whole module. Don\'t look back. Just try.',
          },
          {
            type: 'tieredquiz',
            tiers: [
              {
                label: 'Core Facts', emoji: '🟢',
                questions: [
                  {
                    q: 'What does MRI stand for, and what does it allow doctors to see?',
                    options: [
                      'Magnetic Resonance Imaging — detailed soft tissue images without radiation or surgery',
                      'Medical Radiographic Investigation — X-ray images of bones and fractures',
                      'Microscopic Robotic Insertion — robotic surgery through tiny incisions',
                      'Medical Research Imaging — genetic data visualised as a body map',
                    ],
                    correct: 0,
                    feedback: 'MRI = Magnetic Resonance Imaging. Uses magnetic fields (not radiation) to produce detailed images of soft tissue — muscles, brain, organs. A major advance over X-rays for non-bone diagnosis.',
                    hint: 'Magnetic. Resonance. Imaging. What does magnetic resonance detect?',
                  },
                  {
                    q: 'Why did many early organ transplants fail despite successful surgery?',
                    options: [
                      'The immune system rejected the transplanted organ as foreign tissue',
                      'Surgeons lacked the anaesthetics needed for long transplant operations',
                      'Transplant surgery was performed before blood transfusions were available',
                      'Hospitals did not have the refrigeration needed to store donor organs',
                    ],
                    correct: 0,
                    feedback: 'Rejection: the immune system attacked transplanted organs. Immunosuppressant drugs (especially cyclosporine from the 1970s) solved this by suppressing the immune response — allowing the organ to survive.',
                    hint: 'The immune system\'s job is to destroy foreign substances in the body. A transplanted organ is...',
                  },
                  {
                    q: 'Who published the structure of DNA in 1953?',
                    options: [
                      'Watson and Crick (with critical data from Rosalind Franklin)',
                      'Fleming and Florey',
                      'Lister and Pasteur',
                      'Darwin and Mendel',
                    ],
                    correct: 0,
                    feedback: 'Watson and Crick published the double helix model in 1953, based critically on Rosalind Franklin\'s X-ray crystallography images. All three contributed — but Franklin\'s role was not publicly acknowledged at the time.',
                    hint: 'Two men published it. One woman\'s data made it possible. 1953.',
                  },
                ],
              },
              {
                label: 'Application', emoji: '🟡',
                questions: [
                  {
                    q: 'A student writes: "Modern medicine improved because of better technology." What is missing from this answer?',
                    options: [
                      'Reference to other factors: science, government funding, teamwork — and specific examples linking them',
                      'A description of how technology works in medical settings',
                      'An argument that technology was actually unimportant',
                      'A date for when technology became available in hospitals',
                    ],
                    correct: 0,
                    feedback: 'AQA rewards linked-factor explanations. Technology mattered — but so did science (DNA, immunology), government (NHS, research funding) and teamwork (international collaboration). A complete answer names multiple factors and explains how they connected.',
                    hint: 'What does AQA reward that this answer lacks? Think: linked factors...',
                  },
                  {
                    q: 'Why is keyhole surgery more significant than traditional surgery in terms of patient outcomes?',
                    options: [
                      'It shifts the goal from survival to quality of life — patients recover faster, with less damage and can return to normal sooner',
                      'It completely eliminates all risk from surgical procedures',
                      'It allows surgery to be performed without anaesthetics or sterile conditions',
                      'It replaces the need for pre-operative diagnosis and imaging',
                    ],
                    correct: 0,
                    feedback: 'Keyhole surgery\'s significance is the shift in ambition: from "will the patient survive?" to "how quickly will the patient recover and return to normal?" Reduced incision size, less blood loss, shorter recovery — these improve outcomes beyond just survival.',
                    hint: 'The goal of surgery changed. It used to be about survival. Now it\'s about...',
                  },
                ],
              },
              {
                label: 'Exam Assassin', emoji: '🔴',
                questions: [
                  {
                    q: '"Medical ethics debates prove that modern medicine has gone too far." Evaluate this claim.',
                    options: [
                      'The claim overstates the case: ethical debates show medicine is powerful, not reckless. Debates about genetic engineering and AI diagnosis reflect serious attempts to use new capabilities responsibly — not evidence of excess.',
                      'The claim is correct: modern medicine has created too many ethical problems to be justified.',
                      'The claim is wrong because medical ethics does not exist as a real discipline.',
                      'The claim cannot be evaluated because ethics is purely subjective.',
                    ],
                    correct: 0,
                    feedback: 'The strongest evaluation reframes the claim: ethical debates are a SIGN of responsible engagement with powerful technology, not proof that medicine has "gone too far." This uses evaluation to challenge the framing of the question itself — the highest-order historical thinking skill.',
                    hint: 'Does the existence of ethical debate prove excess? Or does it prove something else?',
                  },
                  {
                    q: 'A question asks: "How significant was the NHS for medical progress in the 20th century?" What makes an answer score top marks?',
                    options: [
                      'It evaluates the NHS in relation to other factors, using specific examples to explain HOW the NHS amplified other medical advances rather than just describing what it did',
                      'It lists every medical advance made after 1948 and attributes them to the NHS',
                      'It argues the NHS was the single most important factor and dismisses other explanations',
                      'It describes the NHS\'s structure and funding arrangements in detail',
                    ],
                    correct: 0,
                    feedback: 'Top marks come from evaluation: the NHS didn\'t create penicillin or DNA research — but it ensured these advances reached everyone, not just those who could pay. "The NHS amplified existing medical advances by making them universally accessible" is a much stronger claim than "the NHS was very important." Specific, linked, evaluated.',
                    hint: 'What did the NHS DO with medical advances that already existed? How did it amplify their impact?',
                  },
                ],
              },
            ],
          },
          {
            type: 'keypoint',
            text: '🎓 <strong>You reached modern medicine.</strong><br/><br/>You just travelled through 700 years of medical history — from medieval herbalists blaming bad air, through Vesalius challenging Galen, Lister\'s carbolic spray, Fleming\'s contaminated dish, to robotic surgery and genetic sequencing.<br/><br/>Medicine became powerful through science, technology, government support and teamwork. No single person, discovery or era did it alone.<br/><br/>That\'s the history of medicine done.',
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // SCIENCE — Biology Week 1: Plant Cells & Photosynthesis
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'sci_bio_w1',
    subject: 'Biology',
    number: 1,
    title: 'Plant Cells & Photosynthesis',
    subtitle: 'Tiny factories, big chemistry',
    icon: '🌿',
    color: '#38D27A',
    colorLight: 'rgba(56,210,122,.15)',

    // ── Universal Hook ──────────────────────────────────────────────────────
    hook: {
      statement: 'The plant ate the soil.',
      isTrue: false,
      accentWords: ['ate the soil'],
      explanation: "Van Helmont's willow tree gained 74kg over 5 years. The soil lost just 57g. The mass had to come from somewhere else entirely — this chapter explains what.",
      storyLines: [
        'Belgium, 1648. A scientist plants a tiny willow tree.',
        'He weighs everything — the tree, the soil, the pot.',
        'Five years later, the tree has gained 74 kg.',
        'The soil? Lost less than 60 grams.',
      ],
      wrongFeedback: "That's actually what most people think. But the numbers don't add up...",
      correctFeedback: "Right. So where on earth did 74 kg of tree come from?",
      bigQuestion: 'So where did 74 kg of tree come from?',
      revealItems: [
        {
          emoji: '💨',
          label: 'Carbon dioxide',
          detail: 'Absorbed from the air through tiny pores in leaves. This is the main building block.',
          color: '#38D27A',
          bg: 'rgba(56,210,122,.08)',
        },
        {
          emoji: '💧',
          label: 'Water',
          detail: 'Pulled up from the soil through the roots. Used in the chemical reaction.',
          color: '#34D5FF',
          bg: 'rgba(52,213,255,.08)',
        },
        {
          emoji: '☀️',
          label: 'Light energy',
          detail: "Absorbed by chlorophyll in the leaves. Powers the whole reaction. Without it — nothing.",
          color: '#FFC857',
          bg: 'rgba(255,200,87,.08)',
        },
      ],
      punchline: "Plants build themselves from thin air. Literally. This week you find out exactly how.",
    },

    // ── Universal Intro ─────────────────────────────────────────────────────
    intro: {
      retrieval: {
        question: 'Before we start — what do you think photosynthesis actually produces?',
        options: [
          'Oxygen and water',
          'Glucose and oxygen',
          'Carbon dioxide and glucose',
          'Energy and starch',
        ],
        correctIndex: 1,
        explanation: 'Photosynthesis produces glucose (stored chemical energy) and oxygen (released as a by-product). The glucose is what the plant uses to grow, respire and build everything else.',
      },
      learningGoals: [
        'Name every organelle in a plant cell and explain its job',
        'Write the photosynthesis equation correctly using exam language',
        'Describe five different things plants do with glucose (SCARF)',
        'Spot and correct the wording mistakes that lose marks in the exam',
        'Explain why plants build mass from air, not soil',
      ],
    },

    outcomes: {
      intro: "You're about to understand exactly how plants turn light into food — and why this matters for all life on Earth.",
      bullets: [
        'Describe the key parts of a plant cell and what each one does',
        'Explain the photosynthesis equation and what it actually means',
        'See why chlorophyll is the molecule that makes life possible',
        'Connect photosynthesis to respiration and energy flow in ecosystems',
      ],
    },

    recall: {
      questions: [
        { type: 'truefalse', question: 'Animal cells have a cell wall as well as a cell membrane.', isTrue: false },
        { type: 'choice', question: 'In photosynthesis, plants absorb...', options: ['Oxygen and glucose from the air', 'Carbon dioxide and water using light energy', 'Nitrogen and minerals from the soil'], correct: 1 },
        { type: 'connection', question: 'Chloroplasts are found in plant cells because...', options: [
          { text: 'They make the plant appear green for camouflage', icon: 'leaf' },
          { text: 'They capture light energy to make glucose', icon: 'atom' },
          { text: 'They control what enters and exits the cell', icon: 'gear' },
        ], correct: 1 },
      ],
    },
    screens: [
      // ── SCREEN 0: Plant Cell Interactive Image ─────────────────────────────
      {
        type: 'interactiveImage',
        label: '🔬 Plant Cell Explorer',
        title: 'Inside a\nPlant Cell',
        introText: 'Plant cells contain specialised structures called organelles. Each one has a specific job that keeps the cell alive.',
        image: '/figures/plant-cell.webp',
        imageAlt: 'Illustration of a plant cell showing major organelles',
        ctaLabel: 'Explore cell',
        hotspots: [
          {
            id: 'cell_wall', x: 50, y: 6,
            shortLabel: 'Cell Wall', title: 'Cell Wall', icon: '🧱',
            description: 'Made of cellulose, the cell wall gives the plant cell a rigid, fixed shape. Animal cells do not have one. It provides structural support and prevents the cell from bursting.',
            extraFact: 'Without a cell wall, plant stems would collapse. This is why plants wilt when they lose water — the vacuole shrinks and the wall loses its rigid support.',
          },
          {
            id: 'cell_membrane', x: 50, y: 14,
            shortLabel: 'Cell Membrane', title: 'Cell Membrane', icon: '🚪',
            description: 'A thin, flexible layer that controls what enters and leaves the cell. Found in all cells — plant and animal. It is selectively permeable, meaning it lets some substances through but not others.',
            extraFact: 'Glucose produced in the chloroplasts must pass through the cell membrane to reach other cells in the plant.',
          },
          {
            id: 'cytoplasm', x: 44, y: 44,
            shortLabel: 'Cytoplasm', title: 'Cytoplasm', icon: '🌊',
            description: 'A jelly-like fluid that fills the cell and holds organelles in place. Most of the cell\'s chemical reactions take place here.',
            extraFact: 'Anaerobic respiration — the backup energy process that does not need oxygen — takes place entirely in the cytoplasm.',
          },
          {
            id: 'nucleus', x: 68, y: 28,
            shortLabel: 'Nucleus', title: 'Nucleus', icon: '🧬',
            description: 'The control centre of the cell. Contains DNA — the instructions for everything the cell does, including making proteins and dividing.',
            extraFact: 'The nucleus directs the production of enzymes needed for photosynthesis. Without it, the chloroplasts could not function properly.',
          },
          {
            id: 'chloroplast', x: 20, y: 68,
            shortLabel: 'Chloroplast', title: 'Chloroplast', icon: '☀️',
            description: 'Contains chlorophyll, a green pigment that absorbs light energy. Plant cells use this energy to carry out photosynthesis and produce glucose. Only found in cells exposed to light.',
            extraFact: 'Photosynthesis allows plants to make their own food using sunlight, water and CO₂ — releasing oxygen as a by-product.',
          },
          {
            id: 'vacuole', x: 30, y: 52,
            shortLabel: 'Permanent Vacuole', title: 'Large Permanent Vacuole', icon: '💧',
            description: 'A large, water-filled sac that keeps the cell firm (turgid). If the vacuole shrinks due to lack of water, the cell becomes flaccid and the plant wilts.',
            extraFact: 'The pressure of the full vacuole pushing against the cell wall creates turgor pressure, which gives plants their upright structure.',
          },
          {
            id: 'mitochondria', x: 22, y: 20,
            shortLabel: 'Mitochondria', title: 'Mitochondria', icon: '⚡',
            description: 'The site of aerobic respiration. Mitochondria release energy from glucose so the cell can do work — growing, moving, dividing, making proteins.',
            extraFact: 'Even though plant cells make glucose in chloroplasts, they still need mitochondria to convert that glucose into usable energy (ATP).',
          },
          {
            id: 'ribosomes', x: 55, y: 46,
            shortLabel: 'Ribosomes', title: 'Ribosomes', icon: '🔬',
            description: 'The site of protein synthesis. Ribosomes read instructions from DNA and assemble amino acids into proteins. Only visible under an electron microscope.',
            extraFact: 'All enzymes are proteins built by ribosomes. Every chemical reaction in the cell ultimately depends on them.',
          },
        ],
      },

      // ── SCREEN 2: Quick Recall ──────────────────────────────────────────────
      {
        label: 'Quick Check',
        kicker: 'Retrieval',
        heading: 'What Did You Just Learn?',
        sub: 'No notes. No hints. Just you and what stuck.',
        blocks: [
          {
            type: 'quiz',
            question: 'Which organelle absorbs light energy for photosynthesis?',
            options: [
              { text: 'Nucleus', correct: false },
              { text: 'Mitochondria', correct: false },
              { text: 'Chloroplast', correct: true },
              { text: 'Vacuole', correct: false },
            ],
            explanation: 'Chloroplasts contain chlorophyll, which absorbs light energy. They\'re only in plant cells — and only in cells that are green (like leaf cells, not root cells).',
          },
          {
            type: 'quiz',
            question: 'Which organelle releases energy from glucose?',
            options: [
              { text: 'Chloroplast', correct: false },
              { text: 'Mitochondria', correct: true },
              { text: 'Ribosomes', correct: false },
              { text: 'Cell wall', correct: false },
            ],
            explanation: 'Mitochondria are the site of aerobic respiration. They release energy from glucose so the cell can do work — moving, growing, making proteins.',
          },
          {
            type: 'quiz',
            question: 'What gives a plant cell its rigid, fixed shape?',
            options: [
              { text: 'Cell membrane', correct: false },
              { text: 'Vacuole', correct: false },
              { text: 'Cytoplasm', correct: false },
              { text: 'Cell wall', correct: true },
            ],
            explanation: 'The cell wall is made of cellulose and gives the plant cell a strong, fixed shape. The cell membrane is present too but is flexible, not rigid.',
          },
          {
            type: 'quiz',
            question: 'A plant cell is wilting. Which organelle has likely shrunk?',
            options: [
              { text: 'Nucleus', correct: false },
              { text: 'Mitochondria', correct: false },
              { text: 'Large vacuole', correct: true },
              { text: 'Ribosomes', correct: false },
            ],
            explanation: 'The large vacuole is filled with cell sap and keeps the cell turgid (firm). When a plant loses water, the vacuole shrinks, the cell loses pressure and the plant wilts.',
          },
        ]
      },

      // ── SCREEN 3: Misconceptions ────────────────────────────────────────────
      {
        label: 'Mistake Lab',
        kicker: 'Common Mistakes',
        heading: 'Sounds Right. Loses Marks.',
        sub: 'These are the phrases examiners see every year — and penalise every year.',
        blocks: [
          {
            type: 'misconception',
            label: 'Tap to see why each one fails',
            mistakes: [
              {
                wrong: 'Plants get food from the soil.',
                right: 'Plants make glucose by photosynthesis.',
                reason: 'Soil provides minerals (like nitrates), not food. Plants manufacture their own glucose using light energy — they are autotrophs.',
              },
              {
                wrong: 'Chloroplasts make sunlight.',
                right: 'Chloroplasts absorb light energy.',
                reason: '"Make" sunlight is physically impossible. The correct word is "absorb" — chlorophyll inside the chloroplast captures light energy from the sun.',
              },
              {
                wrong: 'Plants create energy during photosynthesis.',
                right: 'Plants transfer light energy into chemical energy (glucose).',
                reason: 'Energy cannot be created or destroyed — it is transferred. Examiners specifically penalise "create" and "make" energy. Always say "transfer" or "store".',
              },
              {
                wrong: 'Only leaves have chloroplasts.',
                right: 'Only green parts of the plant contain chloroplasts.',
                reason: 'Any green part of a plant (stems, unripe fruit, green petals) has chloroplasts. Non-green parts (roots, white flowers) do not — they can\'t photosynthesise.',
              },
            ],
          },
        ]
      },

      // ── SCREEN 4: Photosynthesis Equation Builder ───────────────────────────
      {
        label: 'The Equation',
        kicker: 'Photosynthesis',
        heading: 'Build The Recipe',
        sub: 'Photosynthesis is just cooking — light is the heat, glucose is the meal.',
        blocks: [
          {
            type: 'read',
            label: '📖 The Big Idea',
            text: 'Photosynthesis converts <strong>light energy</strong> into <strong>chemical energy</strong> stored in glucose. The plant takes two raw materials (carbon dioxide and water) and uses light to combine them into glucose and oxygen.',
          },
          {
            type: 'builder',
            label: 'Build the photosynthesis equation',
            slots: [null, null, null, null],
            operators: ['+', '→', '+'],
            pieces: ['carbon dioxide', 'water', 'glucose', 'oxygen', 'nitrogen', 'starch'],
            answer: ['carbon dioxide', 'water', 'glucose', 'oxygen'],
            hint: 'Two things go IN (reactants), two things come OUT (products). Light energy drives the reaction.',
            successText: 'Carbon dioxide + water → glucose + oxygen. Light energy drives the reaction. This is the foundation of almost all life on Earth.',
          },
          {
            type: 'keypoint',
            text: 'The word equation: <strong>carbon dioxide + water → glucose + oxygen</strong>. Light energy is needed. Chlorophyll absorbs it. This happens in the chloroplasts.',
          },
          {
            type: 'examtip',
            label: '🗡️ Exam Trap',
            tip: 'Students often say water is produced in photosynthesis. It is NOT. Water is a <strong>reactant</strong> (goes in). Oxygen is the gas that comes out.',
            phrases: ['carbon dioxide + water → glucose + oxygen', 'light energy required', 'in the chloroplasts'],
          },
        ]
      },

      // ── SCREEN 5: Glucose Uses (SCARF) ─────────────────────────────────────
      {
        label: 'Glucose Uses',
        kicker: 'What Plants Do With Glucose',
        heading: 'SCARF: Five Things Plants Do With Glucose',
        sub: 'Students think glucose just gives energy. It does five different things.',
        blocks: [
          {
            type: 'funfact',
            label: '🤯 Actually Interesting',
            text: 'Wood is made from glucose. The tree trunk, every branch, every leaf — almost all of it built from sugar that the tree made from thin air using sunlight. You\'re basically looking at crystallised light.',
          },
          {
            type: 'scarf',
            label: 'SCARF — tap each letter to reveal',
            items: [
              { letter: 'S', word: 'Starch', detail: 'Glucose is converted to starch for storage. Starch is insoluble so it doesn\'t affect osmosis. Stored in chloroplasts and other parts of the plant.' },
              { letter: 'C', word: 'Cellulose', detail: 'Used to make cellulose for cell walls. This gives the plant structural support. Wood is mostly cellulose.' },
              { letter: 'A', word: 'Amino acids', detail: 'Combined with nitrates from the soil to make amino acids, which are then used to build proteins. No nitrates = no proteins = stunted growth.' },
              { letter: 'R', word: 'Respiration', detail: 'Used in aerobic respiration to release energy for growth, reproduction, active transport and other cell processes.' },
              { letter: 'F', word: 'Fats and oils', detail: 'Some glucose is converted into lipids (fats and oils) for storage — especially in seeds. Seeds are often very high in fats.' },
            ],
          },
          {
            type: 'reveal',
            label: '⚡ Exam Recall Check',
            prompt: 'Without looking up — what does SCARF stand for in terms of glucose uses?',
            answer: 'S = Starch (storage). C = Cellulose (cell walls). A = Amino acids (proteins). R = Respiration (energy). F = Fats and oils (seed storage).',
          },
        ]
      },

      // ── SCREEN 6: Glucose Decision Game ────────────────────────────────────
      {
        label: 'Decision Game',
        kicker: 'Apply Your Knowledge',
        heading: 'Where Should The Glucose Go?',
        sub: 'Six scenarios. One right answer each time. No hints.',
        blocks: [
          {
            type: 'scenario',
            label: 'Glucose Decision',
            completionText: 'You can now link glucose uses to plant needs — a favourite AQA exam style question.',
            scenarios: [
              {
                situation: 'The plant needs stronger cell walls to support a new branch.',
                options: ['Starch', 'Cellulose', 'Respiration', 'Fats'],
                correctIndex: 1,
                explanation: 'Cellulose is used to build cell walls. It gives structural strength.',
              },
              {
                situation: 'The plant needs to store energy underground for winter.',
                options: ['Amino acids', 'Cellulose', 'Starch', 'Respiration'],
                correctIndex: 2,
                explanation: 'Starch is insoluble and used for long-term storage — in potatoes, for example.',
              },
              {
                situation: 'The plant is growing rapidly and needs to make new proteins.',
                options: ['Amino acids', 'Starch', 'Fats', 'Cellulose'],
                correctIndex: 0,
                explanation: 'Glucose combines with nitrates to form amino acids, which are linked together to make proteins.',
              },
              {
                situation: 'The plant needs energy for active transport of minerals.',
                options: ['Cellulose', 'Starch', 'Respiration', 'Fats'],
                correctIndex: 2,
                explanation: 'Respiration releases energy from glucose. Active transport needs this energy to move minerals against the concentration gradient.',
              },
              {
                situation: 'A seed needs to store lots of energy in a compact, dense form.',
                options: ['Starch', 'Fats and oils', 'Amino acids', 'Cellulose'],
                correctIndex: 1,
                explanation: 'Fats contain more energy per gram than starch. Seeds (like sunflower seeds) store fats for the germinating seedling to use.',
              },
            ],
          },
        ]
      },

      // ── SCREEN 7: Exam Assassin ─────────────────────────────────────────────
      {
        label: 'Exam Assassin',
        kicker: 'Exam Technique',
        heading: 'How To Actually Score Marks',
        sub: 'These aren\'t tips. These are the specific phrases that win and lose marks.',
        blocks: [
          {
            type: 'examtip',
            label: '🗡️ Tip 1 — Absorb, Not Collect',
            tip: 'Say <strong>"absorbs light energy"</strong> — not "collects sunlight" or "uses light". Examiners want the word ABSORB.',
            phrases: ['absorbs light energy', 'chlorophyll', 'chloroplast'],
          },
          {
            type: 'examtip',
            label: '🗡️ Tip 2 — Glucose, Not Food',
            tip: 'Photosynthesis produces <strong>glucose</strong>. Never "food" or "sugar" — use the specific term.',
            phrases: ['glucose', 'not food', 'not sugar'],
          },
          {
            type: 'examtip',
            label: '🗡️ Tip 3 — Transfer, Not Create',
            tip: 'Light energy is <strong>transferred</strong> into chemical energy. Never say plants "make", "create" or "produce" energy. Energy is conserved, not created.',
            phrases: ['energy is transferred', 'light energy → chemical energy', 'stored in glucose'],
          },
          {
            type: 'quiz',
            question: 'Which answer would score the mark?',
            options: [
              { text: 'Chloroplasts collect sunlight to make food for the plant.', correct: false },
              { text: 'Chloroplasts absorb light energy to produce glucose by photosynthesis.', correct: true },
              { text: 'Chloroplasts create energy from sunlight.', correct: false },
              { text: 'Chloroplasts make sugar using the sun.', correct: false },
            ],
            explanation: 'Option B uses the correct command words: "absorb", "light energy", "glucose", "photosynthesis". Every other option uses vague or incorrect language.',
          },
        ]
      },

      // ── SCREEN 8: Boss Battle ───────────────────────────────────────────────
      {
        label: 'Boss Battle',
        kicker: 'Challenge',
        heading: '⚔️ Boss Battle: Apply Everything',
        sub: 'Three questions. Free text. Marked by AI. No skipping.',
        blocks: [
          {
            type: 'read',
            label: '🔥 Real answers only.',
            text: 'Write your answer in the box — then submit it. The AI examiner will mark it against the actual mark scheme, tell you what you got right, what you missed, and show you a model answer. <strong>You have to try before you can see the model answer.</strong>',
          },
          {
            type: 'boss',
            tier: '🟢',
            label: 'Warm Up',
            question: 'A student says: "Plants get food from the soil." Explain why this is incorrect and give a better explanation.',
            markPoints: `- Plants do NOT get food/energy from the soil
- Plants make glucose through photosynthesis
- Photosynthesis uses carbon dioxide, water and light energy
- The soil only provides minerals/nitrates (not food/energy)
- Plants are producers/autotrophs — they make their own food`,
          },
          {
            type: 'boss',
            tier: '🟡',
            label: 'Challenge',
            question: 'A plant has damaged chloroplasts. Explain why this would affect the plant\'s growth, even if it has plenty of water and carbon dioxide.',
            markPoints: `- Damaged chloroplasts cannot absorb light energy properly
- Less/no photosynthesis can occur
- Less glucose is produced
- Less glucose means less energy available for growth (via respiration)
- Less glucose means fewer building materials: less cellulose for cell walls, fewer amino acids for proteins
- Plant grows more slowly or stops growing`,
          },
          {
            type: 'boss',
            tier: '🔴',
            label: 'Boss Mode',
            question: 'A gardener removes all the leaves from a healthy plant. Predict and explain what will happen to the plant over the following two weeks.',
            markPoints: `- Leaves contain chloroplasts — removing them stops photosynthesis
- No photosynthesis means no glucose being produced
- Plant cannot respire efficiently — less energy available
- Growth stops — no glucose for cellulose or protein synthesis
- Plant uses up stored starch reserves
- Plant weakens and may wilt or die
- Cannot replace damaged or dead cells
- Cannot produce new leaves without stored energy`,
          },
        ]
      },

      // ── SCREEN 9: Fast Recap ────────────────────────────────────────────────
      {
        label: 'Fast Recap',
        kicker: 'Final Retrieval',
        heading: 'Lock It In',
        sub: 'Tap every card. This is the stuff that will come up in Paper 1.',
        blocks: [
          {
            type: 'flashcards',
            cards: [
              { front: 'Chloroplast', back: 'Contains chlorophyll. Absorbs light energy for photosynthesis. Only in plant and algae cells.' },
              { front: 'Nucleus', back: 'Controls cell activities. Contains DNA (genetic instructions).' },
              { front: 'Mitochondria', back: 'Site of aerobic respiration. Releases energy from glucose.' },
              { front: 'Cell wall', back: 'Made of cellulose. Gives plant cells strength and a fixed shape.' },
              { front: 'Large vacuole', back: 'Filled with cell sap. Keeps cell turgid (firm). Not in animal cells.' },
              { front: 'Photosynthesis equation', back: 'carbon dioxide + water → glucose + oxygen. Light energy required. In chloroplasts.' },
              { front: 'SCARF', back: 'Starch · Cellulose · Amino acids · Respiration · Fats and oils. Five uses of glucose.' },
              { front: 'Ribosomes', back: 'Where proteins are made. Present in all cells. Too small for a light microscope.' },
              { front: 'Three things plant cells have that animal cells lack', back: 'Cell wall · Chloroplasts · Large permanent vacuole.' },
              { front: 'Energy in photosynthesis', back: 'Light energy is TRANSFERRED into chemical energy stored in glucose. Never "created".' },
            ]
          },
          {
            type: 'keypoint',
            text: '✅ <strong>You can now:</strong> name all plant cell organelles and their jobs, write the photosynthesis equation correctly, describe five uses of glucose using SCARF, and use the exact phrases that score marks in the exam.',
          },
        ]
      },
    ]
  },

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

  // ── History Module 9: Who Gets Healthcare? ────────────────────────────────────
  {
    id: 'mod9',
    subject: 'History',
    number: 10,
    title: 'Who Gets Healthcare?',
    subtitle: 'The NHS, Prevention & Modern Public Health',
    era: 'AQA GCSE',
    icon: '🏥',
    color: '#C47828',
    colorLight: 'rgba(196,120,40,.12)',
    hook: {
      atmosphericOpener: {
        heading: 'A WOMAN WALKS INTO A HOSPITAL. SHE HAS NO MONEY.',
        sub: 'In 1947, she would be turned away. In 1948, the door is open. What changed?',
        cta: 'FIND OUT',
      },
      scenario: {
        location: 'Britain, 5 July 1948',
        hint: 'For the first time in British history, every person — rich or poor — can see a doctor, dentist, or specialist without paying. Queues stretch around hospitals. People are crying.',
      },
      statement: '"Before the NHS, Britain had world-class hospitals available to everyone."',
      isTrue: false,
      accentWords: ['available to everyone'],
      explanation: "Before 1948, healthcare was fee-based. The poor often went untreated or died from conditions that money could have fixed. The NHS changed everything.",
      wrongFeedback: 'Before 1948, healthcare was not universal. Hospital treatment could cost money. The poor often went without. The NHS changed this permanently.',
      correctFeedback: 'Correct. Before 1948, healthcare depended heavily on your ability to pay. The NHS, launched in 1948, was the first system to make healthcare free at the point of use for everyone.',
      loadingText: 'Checking the records…',
      bigQuestion: 'If healthcare wasn\'t free — what happened to people who couldn\'t afford it?',
      revealHeader: 'The NHS changed who could get care.',
      revealItems: [
        {
          emoji: '🏛️',
          label: 'Government intervention',
          detail: 'The state stepped in because the market had failed. Before 1948, if you couldn\'t afford treatment, you went without. Government funding broke the link between wealth and healthcare access.',
          color: '#C47828',
          bg: 'rgba(196,120,40,.08)',
        },
        {
          emoji: '🏥',
          label: 'NHS creation',
          detail: 'On 5 July 1948, Aneurin Bevan launched the National Health Service. Free at the point of use. Funded by taxation. 480,000 staff on day one. Within a year: 187 million prescriptions, 8 million dental treatments.',
          color: '#C47828',
          bg: 'rgba(196,120,40,.08)',
        },
        {
          emoji: '💉',
          label: 'Prevention over cure',
          detail: 'Modern public health shifted from treating disease to preventing it. Vaccination programmes, anti-smoking campaigns and lifestyle regulation all became government responsibilities — because prevention is cheaper than cure.',
          color: '#C47828',
          bg: 'rgba(196,120,40,.08)',
        },
      ],
      punchline: 'Healthcare became a right, not a privilege. The NHS was just the beginning.',
    },
    intro: {
      learningGoals: [
        'Explain why the NHS was needed and what came before it',
        'Describe what "free at the point of use" means and why it mattered',
        'Explain Aneurin Bevan\'s role in creating the NHS',
        'Describe how vaccination and prevention became central to public health',
        'Explain why lifestyle diseases became a major challenge after 1950',
        'Evaluate the government\'s continuing role in shaping modern healthcare',
      ],
    },
    outcomes: {
      intro: "Medicine only matters if people can access it. This chapter asks who actually gets healthcare — and who doesn't.",
      bullets: [
        'Explain why the NHS was created and what made it genuinely radical',
        'Describe how prevention became part of modern medicine',
        'See the tension between individual freedom and public health policy',
        'Evaluate how far medicine has actually improved ordinary lives',
      ],
    },

    recall: {
      questions: [
        { type: 'truefalse', question: 'The NHS was created in 1948 and is free at point of use.', isTrue: true },
        { type: 'choice', question: 'Beveridge\'s 1942 report proposed...', options: ['Privatising all hospitals and surgeries', 'A welfare state supporting people from cradle to grave', 'Making patients pay for prescriptions'], correct: 1 },
        { type: 'connection', question: 'Prevention matters in modern medicine because...', options: [
          { text: 'Treating illness costs far more than preventing it', icon: 'heart' },
          { text: 'Doctors prefer not to perform surgery', icon: 'gear' },
          { text: 'Hospitals are too full to treat anyone', icon: 'house' },
        ], correct: 0 },
      ],
    },
    screens: [

      // Screen 1 — Before the NHS
      {
        label: 'Before the NHS',
        kicker: 'Pre-1948 Britain',
        heading: 'Healthcare depended on what you could afford.',
        blocks: [
          {
            type: 'read',
            label: '📖 Core Knowledge',
            text: 'Before 1948, accessing healthcare in Britain was not straightforward. Voluntary and charity hospitals provided some free care, but many required fees or proof of need. The <strong>Poor Law Amendment Act (1834)</strong> had created workhouse infirmaries for the destitute — grim, stigmatised places. <strong>Lloyd George\'s National Insurance Act (1911)</strong> extended basic medical cover to some working men, but not their families, and not the unemployed. If you were too poor to pay and too "comfortable" to qualify for charity, you might simply go without. Illness could mean financial ruin for a working family. A serious condition — appendicitis, childbirth complications, tuberculosis — could bankrupt parents and orphan children.',
          },
          {
            type: 'quiz',
            question: 'Which statement best explains why the NHS was revolutionary?',
            options: [
              { text: 'It ended all disease in Britain', correct: false },
              { text: 'Healthcare became universal — everyone could access it regardless of income', correct: true },
              { text: 'Surgery disappeared because doctors stopped charging', correct: false },
              { text: 'The government banned private medicine entirely', correct: false },
            ],
            explanation: 'The NHS was revolutionary because it removed cost as a barrier to healthcare. For the first time, illness did not mean financial catastrophe — treatment was available to everyone.',
          },
          {
            type: 'keypoint',
            text: '🧠 <strong>Three things about pre-NHS healthcare:</strong><br/>1. <strong>Expensive</strong> — doctors, medicines and hospital stays all cost money most people did not have.<br/>2. <strong>Inconsistent</strong> — quality and availability varied enormously by area and income.<br/>3. <strong>Charity-dependent</strong> — the poor relied on voluntary hospitals that were underfunded and stigmatised.',
          },
          {
            type: 'examtip',
            label: '⚔️ Exam Assassin',
            tip: 'Always explain WHY change was needed — not just that it happened. Don\'t write: "The NHS was created in 1948." Write: "The NHS was created in 1948 because millions of people could not afford healthcare — illness often meant financial ruin for working-class families, and the existing patchwork of charity and insurance left huge gaps in coverage."',
          },
        ],
      },

      // Screen 2 — Birth of the NHS (1948)
      {
        label: 'Birth of the NHS',
        kicker: '5 July 1948',
        heading: 'A new idea changes Britain.',
        headerImage: '/images/nhs-1948.png',
        blocks: [
          {
            type: 'read',
            label: '📖 Core Knowledge',
            text: 'On <strong>5 July 1948</strong>, Aneurin Bevan — Minister of Health under the Labour government of Clement Attlee — launched the National Health Service. The founding principle was simple but radical: healthcare should be <strong>free at the point of use</strong>, available to everyone, funded by National Insurance contributions and general taxation.<br/><br/>The scale was extraordinary. On day one, <strong>480,000 staff</strong> were employed. The hospitals — previously a patchwork of charity, municipal and private institutions — were nationalised overnight. Within the first year: <strong>187 million prescriptions</strong> had been issued and <strong>8 million dental treatments</strong> provided, many to people who had never seen a dentist in their lives.',
          },
          {
            type: 'keypoint',
            text: '🏥 <strong>Four founding principles of the NHS:</strong><br/>1. <strong>Free at the point of use</strong> — no charge when you need treatment.<br/>2. <strong>Funded by taxation</strong> — paid for collectively through National Insurance.<br/>3. <strong>Aneurin Bevan</strong> — the Minister of Health who drove it through parliament.<br/>4. <strong>Universal coverage</strong> — every person in Britain, regardless of wealth or status.',
          },
          {
            type: 'quiz',
            question: 'Which factor MOST explains why the NHS was created in 1948?',
            options: [
              { text: 'Britain wanted to close hospitals and reduce costs', correct: false },
              { text: 'The government believed healthcare should be universal — a right, not a privilege', correct: true },
              { text: 'Germ theory had proven that doctors were no longer needed', correct: false },
              { text: 'Doctors voluntarily stopped charging patients for their services', correct: false },
            ],
            explanation: 'The NHS was built on the principle that healthcare is a right. The wartime experience of organised, state-funded medicine had shown what government action could achieve — and political will existed to make it permanent.',
          },
          {
            type: 'examtip',
            label: '⚔️ Exam Assassin',
            tip: 'Always explain WHY governments introduced reforms — not just that they did. For the NHS: (1) pre-existing inequity, (2) wartime lesson about state-organised medicine, (3) political will of the 1945 Labour landslide, (4) Beveridge Report (1942) recommending a welfare state. These are the CAUSES — not just the date.',
          },
        ],
      },

      // Screen 3 — Resistance & Reality
      {
        label: 'Resistance & Reality',
        kicker: 'The Fight to Create It',
        heading: 'Doctors didn\'t want it. Bevan pushed it through anyway.',
        blocks: [
          {
            type: 'read',
            label: '📖 Core Knowledge',
            text: 'Creating the NHS was not straightforward. The <strong>British Medical Association (BMA)</strong> — the professional organisation representing doctors — mounted fierce opposition. Doctors feared losing their professional independence, becoming "state servants" and seeing their incomes fall under a nationalised system. The BMA held ballots and campaigned against the proposals.<br/><br/>Bevan\'s response was pragmatic. He later said he had <strong>"stuffed their mouths with gold"</strong> — he offered doctors merit awards (bonus payments for excellence), allowed them to keep private patients in NHS hospitals (pay beds), and preserved their clinical independence. The opposition was overcome. On <strong>5 July 1948</strong>, queues stretched around hospitals as people registered with GPs for the first time. Dentists were overwhelmed. The demand for glasses cleaned out opticians\' stocks.',
          },
          {
            type: 'appliedscenario',
            scenarios: [
              {
                scenario: 'A doctor in 1946 says: "I didn\'t spend years training to become a state servant answering to government bureaucrats."',
                question: 'Which group opposed the NHS and why?',
                options: [
                  'Patients opposed it because they preferred paying for treatment',
                  'The BMA opposed it, fearing loss of professional independence and income',
                  'The government opposed its own creation because of cost',
                  'Nurses opposed it because they wanted to work in private hospitals',
                ],
                correct: 1,
                feedback: 'The British Medical Association (BMA) led opposition to the NHS, primarily fearing that doctors would lose income and professional independence by becoming state employees. The public was broadly supportive — most people wanted free healthcare.',
                followUp: {
                  q: 'How did Bevan overcome opposition from the BMA?',
                  answer: 'Bevan offered merit awards (bonus payments) for excellence, allowed private pay beds in NHS hospitals, and preserved clinical independence. He "stuffed their mouths with gold" — giving doctors financial incentives to join. By 1948, enough doctors had signed up for the service to launch.',
                },
              },
            ],
          },
          {
            type: 'fillblanks',
            sentences: [
              {
                before: 'The NHS was launched by',
                after: 'Bevan, the Minister of Health, on 5 July 1948.',
                answer: 'Aneurin',
                hints: ['His first name. Welsh politician and passionate advocate for working people.', 'Begins with "A" — first name of the Minister of Health who created the NHS.'],
              },
              {
                before: 'The',
                after: '(BMA) opposed the NHS, fearing loss of income and professional independence.',
                answer: 'British Medical Association',
                hints: ['The professional organisation representing doctors in Britain.', 'Three words: British _______ Association.'],
              },
              {
                before: 'The NHS was founded on the principle that healthcare should be free at the',
                after: 'of use, available to everyone regardless of income.',
                answer: 'point',
                hints: ['Free at the _____ of use — the moment you need it, it costs nothing.', 'A short word meaning the moment or place something happens.'],
              },
            ],
            correctMsg: 'Correct. Bevan, BMA opposition, free at the point of use — these three elements are the core of any NHS creation question.',
            wrongMsg: 'Review the reading section — these are the core facts about the creation of the NHS.',
          },
          {
            type: 'examtip',
            label: '⚔️ Exam Assassin',
            tip: 'Exam trap — don\'t say "everyone opposed the NHS" or "no one opposed it." The BMA did; the public largely supported it. The distinction matters: opposition came from the medical profession (fearing income loss), not from patients (who wanted free care). Being precise about WHO opposed it and WHY earns the marks.',
          },
        ],
      },

      // Screen 4 — Vaccination & Prevention
      {
        label: 'Vaccination & Prevention',
        kicker: 'Prevention Over Cure',
        heading: 'Stop the disease before it starts.',
        blocks: [
          {
            type: 'read',
            label: '📖 Core Knowledge',
            text: 'After 1948, vaccination programmes expanded dramatically as the NHS provided the infrastructure for mass public health campaigns. Key milestones:<br/><br/>💉 <strong>Polio vaccine (Salk, 1955)</strong> — a massive public campaign immunised children across Britain. Polio cases collapsed.<br/>💉 <strong>MMR vaccine (1988)</strong> — combined measles, mumps and rubella into one injection. Childhood disease rates fell sharply.<br/>🌍 <strong>Smallpox eradicated globally (1980)</strong> — the result of a worldwide WHO vaccination campaign, the only human disease ever eradicated.<br/><br/>Government mass vaccination campaigns represent the state acting as a public health actor — coordinating, funding and delivering prevention at a scale no individual or charity could achieve. The principle: <strong>prevention is cheaper than cure</strong>.',
          },
          {
            type: 'keypoint',
            text: '💉 <strong>Three things about vaccination programmes after 1948:</strong><br/>1. <strong>Reduced infectious disease</strong> — polio, measles, smallpox all declined dramatically.<br/>2. <strong>Government-funded</strong> — only the state could organise and pay for mass vaccination.<br/>3. <strong>Prevention paradigm shift</strong> — focus moved from treating sick patients to stopping people getting sick in the first place.',
          },
          {
            type: 'colsort',
            question: 'Treatment or Prevention?',
            columns: [
              { label: 'TREATMENT\nAfter disease strikes', color: '#C47828', bg: 'rgba(196,120,40,.07)' },
              { label: 'PREVENTION\nBefore disease strikes', color: '#4B90FF', bg: 'rgba(75,144,255,.07)' },
            ],
            items: [
              { label: 'Antibiotics for a bacterial infection', col: 0, explanation: 'Antibiotics treat an existing infection — this is treatment, not prevention.' },
              { label: 'Surgery to remove an infected appendix', col: 0, explanation: 'Surgery responds to a medical emergency — this is treatment.' },
              { label: 'Chemotherapy for cancer', col: 0, explanation: 'Chemotherapy treats existing cancer — this is treatment.' },
              { label: 'National childhood vaccination programme', col: 1, explanation: 'Vaccination prevents disease before it occurs — the definition of prevention.' },
              { label: 'Government anti-smoking campaign', col: 1, explanation: 'Anti-smoking campaigns aim to prevent lung disease before it develops.' },
              { label: 'Adding fluoride to water to prevent tooth decay', col: 1, explanation: 'Fluoride in water prevents dental decay — a public health prevention measure.' },
            ],
            explanation: 'The distinction between treatment and prevention is a key AQA theme. Modern public health increasingly emphasises prevention — stopping disease before it requires expensive treatment.',
          },
          {
            type: 'quiz',
            question: 'Which statement best explains why vaccination programmes were important?',
            options: [
              { text: 'They eliminated all disease from Britain', correct: false },
              { text: 'They reduced the spread of infectious disease across whole populations', correct: true },
              { text: 'They replaced the need for all doctors and hospitals', correct: false },
              { text: 'They ended all surgical procedures by the 1960s', correct: false },
            ],
            explanation: 'Vaccination works at the population level — herd immunity means that when enough people are vaccinated, even the unvaccinated are protected. This is why government-funded mass campaigns were so powerful.',
          },
          {
            type: 'examtip',
            label: '⚔️ Exam Assassin',
            tip: 'Prevention became increasingly important after 1900 — this is a key continuity/change theme in AQA Medicine in Britain. Show you understand the shift: "Before 1900, medicine focused on treating disease. After 1900 — and especially after 1948 — prevention through vaccination and public health campaigns became central." That\'s a change argument worth marks.',
          },
        ],
      },

      // Screen 5 — Lifestyle Diseases
      {
        label: 'Lifestyle Diseases',
        kicker: 'Modern Health Challenges',
        heading: 'The biggest threats changed.',
        blocks: [
          {
            type: 'read',
            label: '📖 Core Knowledge',
            text: 'By the mid-20th century, infectious diseases like cholera and tuberculosis were declining — thanks to antibiotics, vaccination and better living conditions. New killers emerged in their place:<br/><br/>❤️ <strong>Heart disease</strong> — linked to diet, lack of exercise and smoking.<br/>🚬 <strong>Lung cancer</strong> — the <strong>1962 Royal College of Physicians report</strong> formally linked smoking to cancer, triggering major government action.<br/>🍬 <strong>Obesity and diabetes</strong> — rising from processed food, sedentary lifestyles.<br/><br/>Government responses came in waves:<br/>📌 <strong>1983</strong> — seat belt law (reducing road death and injury).<br/>📌 <strong>2007</strong> — smoking ban in enclosed public spaces.<br/>📌 <strong>2018</strong> — sugar tax (Soft Drinks Industry Levy) to reduce childhood obesity.<br/><br/>These are <strong>lifestyle diseases</strong> — caused by behaviour and environment, not just bacteria — requiring a different kind of government response.',
          },
          {
            type: 'keypoint',
            text: '❤️ <strong>Four points on lifestyle disease era:</strong><br/>1. <strong>New threats after 1950</strong> — heart disease, lung cancer, obesity replaced infectious killers.<br/>2. <strong>Smoking-cancer link</strong> — 1962 RCP report was the turning point.<br/>3. <strong>Government regulation</strong> — seat belts, smoking bans, sugar taxes show the state controlling behaviour.<br/>4. <strong>Prevention still central</strong> — campaigns aimed at changing behaviour before disease develops.',
          },
          {
            type: 'quiz',
            question: 'Why did lifestyle diseases become a bigger focus after 1950?',
            options: [
              { text: 'Infectious diseases became less dominant as antibiotics and vaccines reduced their impact', correct: true },
              { text: 'Surgery disappeared so new problems had to be found', correct: false },
              { text: 'Germ theory was proven wrong in the 1950s', correct: false },
              { text: 'All hospitals closed after 1948', correct: false },
            ],
            explanation: 'As antibiotics and vaccines controlled infectious diseases, the remaining major killers were those linked to behaviour and environment. The epidemiological transition — from infectious to chronic disease — is a key change in modern medicine.',
          },
          {
            type: 'appliedscenario',
            scenarios: [
              {
                scenario: 'A government health campaign in 2007 bans smoking in all enclosed public spaces in England, citing evidence that secondhand smoke causes cancer and heart disease.',
                question: 'Which factor best explains this government decision?',
                options: [
                  'Germ theory — bacteria were found in cigarette smoke',
                  'Government intervention in lifestyle disease — using legislation to protect public health',
                  'Vaccination — the smoking ban was a form of immunisation',
                  'The Welfare State — the ban was about saving money on housing',
                ],
                correct: 1,
                feedback: 'The smoking ban is a clear example of government intervention in lifestyle disease. Armed with scientific evidence (the link between smoking, secondhand smoke and cancer/heart disease), the government used legislation to change behaviour and protect public health.',
                followUp: {
                  q: 'What role did evidence play in the government\'s decision to ban smoking?',
                  answer: 'Scientific evidence — from the 1962 RCP report onwards — established the causal link between smoking and cancer/heart disease. Government action followed evidence: once the link was proven beyond doubt, legislative pressure grew. This is the same model as Snow\'s cholera map and the 1875 Public Health Act — evidence drives government action.',
                },
              },
            ],
          },
          {
            type: 'examtip',
            label: '⚔️ Exam Assassin',
            tip: 'Change over time questions reward comparison between periods. "Before 1900, the main threats were infectious diseases like cholera and TB. After 1950, the main threats became lifestyle diseases like heart disease and lung cancer — requiring a different kind of government response: not sewers and vaccines, but seat belt laws and smoking bans." That comparative structure scores highly.',
          },
        ],
      },

      // Screen 6 — Government Never Stopped
      {
        label: 'Government Never Stopped',
        kicker: 'Continuing Intervention',
        heading: 'The state didn\'t create the NHS and walk away.',
        blocks: [
          {
            type: 'read',
            label: '📖 Core Knowledge',
            text: 'Creating the NHS in 1948 was not the end of government involvement in healthcare — it was the beginning of a permanent, expanding role. Modern governments continue shaping public health across multiple fronts:<br/><br/>🔍 <strong>NHS cancer screening programmes</strong> — breast, cervical and bowel cancer caught early when treatment is most effective.<br/>🧠 <strong>Mental health campaigns</strong> — reducing stigma, expanding NHS mental health provision.<br/>🏃 <strong>Childhood obesity strategy</strong> — school food standards, advertising restrictions, sugar tax.<br/>💉 <strong>COVID-19 vaccination rollout (2020–21)</strong> — the fastest mass vaccination campaign in history: over 15 million doses in the first two months.<br/><br/>Government remains the dominant factor in healthcare access, funding, research and prevention — not because markets cannot provide care, but because universal access requires public funding.',
          },
          {
            type: 'colsort',
            question: 'Government action or individual choice?',
            columns: [
              { label: 'GOVERNMENT ACTION\nState-organised public health', color: '#C47828', bg: 'rgba(196,120,40,.07)' },
              { label: 'INDIVIDUAL CHOICE\nPersonal decisions about health', color: '#4B90FF', bg: 'rgba(75,144,255,.07)' },
            ],
            items: [
              { label: 'NHS cancer screening programme for over-50s', col: 0, explanation: 'A government-organised screening programme — the state proactively checks citizens\' health.' },
              { label: 'National childhood vaccination programme', col: 0, explanation: 'Government-funded and organised — vaccination programmes only work at scale through state action.' },
              { label: 'Smoking ban in enclosed public spaces (2007)', col: 0, explanation: 'Legislation passed by government — restricting individual behaviour to protect public health.' },
              { label: 'Personal decision about daily diet', col: 1, explanation: 'What individuals choose to eat is primarily an individual choice, though government campaigns aim to influence it.' },
              { label: 'Paying for a private gym membership', col: 1, explanation: 'Private gym membership is an individual lifestyle choice — not government-organised.' },
              { label: 'Choosing whether to smoke', col: 1, explanation: 'The decision to smoke remains an individual choice, though the government restricts where smoking is permitted.' },
            ],
            explanation: 'Modern public health involves both government action and individual responsibility. AQA questions often ask you to evaluate the relative importance of these — government action tends to be the dominant factor in large-scale improvements.',
          },
          {
            type: 'quiz',
            question: 'Which factor MOST influenced modern public health improvements in Britain after 1948?',
            options: [
              { text: 'Medieval monastic healing traditions', correct: false },
              { text: 'Government intervention — funding, legislation and public health campaigns', correct: true },
              { text: 'Astrological medicine and herbal remedies', correct: false },
              { text: 'Bloodletting and the four humours', correct: false },
            ],
            explanation: 'Government intervention — through the NHS, vaccination programmes, legislation (smoking bans, seat belt laws) and public health campaigns — was the dominant factor in improving British public health after 1948.',
          },
          {
            type: 'examtip',
            label: '⚔️ Exam Assassin',
            tip: 'Government action is a major recurring factor in medical progress — from Bazalgette\'s sewers (1858) to the NHS (1948) to COVID vaccines (2020). If an exam question asks about factors driving improvement, government action should always appear in your answer — with specific examples. Vague references to "the government" score nothing; "the 2007 smoking ban reduced deaths from secondhand smoke exposure" scores marks.',
          },
        ],
      },

      // Screen 7 — Factor Web
      {
        label: 'Factor Web',
        kicker: 'Synoptic Thinking',
        heading: 'Everything connects. What matters most?',
        sub: 'Modern medicine didn\'t improve through one thing. It improved through everything at once.',
        blocks: [
          {
            type: 'tieredquiz',
            tiers: [
              {
                label: 'Definitions',
                emoji: '🟢',
                questions: [
                  {
                    q: 'When was the NHS launched?',
                    options: [
                      '5 July 1948',
                      '11 November 1918',
                      '4 August 1914',
                      '1 January 1900',
                    ],
                    correct: 0,
                    feedback: '5 July 1948 — the date the National Health Service launched in Britain under Aneurin Bevan.',
                    hint: 'Post-WWII Britain. Summer of 1948. A Labour government minister named Bevan.',
                  },
                  {
                    q: 'What does "free at the point of use" mean?',
                    options: [
                      'Healthcare is free in certain hospitals only',
                      'You pay nothing when you need treatment — costs are covered by taxation',
                      'Doctors work for free as volunteers',
                      'Only emergency treatment is free',
                    ],
                    correct: 1,
                    feedback: '"Free at the point of use" means that when you need treatment, you pay nothing. The cost is met collectively through taxation and National Insurance — not at the moment you walk through the door.',
                    hint: 'The "point" is when you actually need treatment. What do you pay at that moment?',
                  },
                  {
                    q: 'Which of these is an example of a lifestyle disease?',
                    options: [
                      'Cholera — spread through contaminated water',
                      'Lung cancer — linked to smoking behaviour',
                      'Smallpox — spread through contact with infected people',
                      'Bubonic plague — spread by rat fleas',
                    ],
                    correct: 1,
                    feedback: 'Lung cancer (linked to smoking) is a lifestyle disease — caused primarily by behaviour, not bacteria or viruses. Cholera, smallpox and plague are infectious diseases caused by pathogens.',
                    hint: 'Lifestyle diseases are caused by behaviour and environment — not by microorganisms.',
                  },
                ],
              },
              {
                label: 'Apply It',
                emoji: '🟡',
                questions: [
                  {
                    q: 'Which factor was MOST important in creating the NHS?',
                    options: [
                      'Scientific discovery of DNA',
                      'Government political will and belief that healthcare should be universal',
                      'Accidental discovery of penicillin',
                      'Medieval traditions of monastic medicine',
                    ],
                    correct: 1,
                    feedback: 'The NHS required political will — a government that believed healthcare should be a universal right. The 1945 Labour election victory gave Bevan the mandate to create it. Scientific discovery and individual brilliance were not the main factors here.',
                    hint: 'The NHS was a political decision, not a scientific one. What did the government believe?',
                  },
                  {
                    q: 'What made mass vaccination effective as a public health tool?',
                    options: [
                      'Vaccines were invented by medieval monks',
                      'Government funding and organisation enabled vaccination at a scale that achieved herd immunity',
                      'Individual doctors independently vaccinated their own patients',
                      'Vaccination replaced surgery for all conditions',
                    ],
                    correct: 1,
                    feedback: 'Mass vaccination works through scale — herd immunity requires a high percentage of the population to be vaccinated. Only government-organised, government-funded campaigns could achieve this. Individual effort could not.',
                    hint: 'Why does vaccination need to happen at MASS scale? What does "herd immunity" require?',
                  },
                  {
                    q: 'Which of these is an example of PREVENTION rather than TREATMENT?',
                    options: [
                      'Prescribing antibiotics for pneumonia',
                      'Offering childhood MMR vaccinations through the NHS',
                      'Performing surgery to remove a tumour',
                      'Prescribing insulin for a diabetic patient',
                    ],
                    correct: 1,
                    feedback: 'MMR vaccination prevents measles, mumps and rubella before they develop. Antibiotics, surgery and insulin all treat conditions that already exist. Prevention stops disease; treatment responds to it.',
                    hint: 'Prevention happens BEFORE the disease. Treatment happens AFTER.',
                  },
                ],
              },
              {
                label: 'Exam Ready',
                emoji: '🔴',
                questions: [
                  {
                    q: 'Which factor was MOST important in improving public health in Britain after 1900?',
                    options: [
                      'Government intervention — NHS, vaccination programmes, legislation — reached the whole population at once',
                      'Individual scientists whose discoveries led to cures',
                      'War — which accelerated medical research in all areas',
                      'Technology — scanning and robotic surgery improved outcomes',
                    ],
                    correct: 0,
                    feedback: 'While scientists, war and technology all mattered, government intervention had the broadest reach. The NHS made every medical breakthrough accessible to all — not just those who could pay. Vaccination programmes protected whole populations. Legislation changed mass behaviour. Government action is the factor that connected everything else to the public.',
                    hint: 'Which factor reached EVERYONE in Britain — not just those who could afford it or those in a particular field?',
                  },
                  {
                    q: 'Which statement best explains the modern challenge of lifestyle diseases?',
                    options: [
                      'Lifestyle diseases are caused by bacteria that appeared after 1950',
                      'As infectious diseases were controlled, chronic diseases linked to behaviour became the leading cause of death — requiring regulation and prevention rather than cures',
                      'Lifestyle diseases only affect wealthy people who can afford to overeat',
                      'Lifestyle diseases replaced all other disease after the invention of the NHS',
                    ],
                    correct: 1,
                    feedback: 'The epidemiological transition — from infectious to chronic disease — is the key analytical point. As antibiotics and vaccines controlled cholera, TB and smallpox, heart disease, cancer and obesity rose. These require behaviour change and regulation, not just medical treatment.',
                    hint: 'What changed AFTER infectious diseases were controlled? What filled the gap?',
                  },
                ],
              },
            ],
          },
        ],
      },

      // Screen 8 — Exam Master
      {
        label: 'Exam Master',
        kicker: 'Exam Skills',
        heading: 'How to answer NHS and modern health questions.',
        blocks: [
          {
            type: 'keypoint',
            text: '📝 <strong>AQA command words for this topic:</strong><br/>• <strong>Explain</strong> — give reasons, not just facts. Use "because" and "therefore."<br/>• <strong>Describe</strong> — give specific detail: dates, names, statistics.<br/>• <strong>How far do you agree</strong> — argue BOTH sides, reach a conclusion.<br/>• <strong>Why was X significant</strong> — say what changed, who benefited, why it mattered long-term.',
          },
          {
            type: 'examtip',
            label: '⚔️ Exam Assassin',
            tip: 'For "explain why" questions about the NHS: say WHAT it did + WHY that mattered + WHO benefited. Not just "the NHS was free." Instead: "The NHS made healthcare free at the point of use (WHAT), removing cost as a barrier to treatment (WHY), meaning working-class families could access doctors, dentists and specialists they previously could not afford (WHO)." Three parts. Every time.',
          },
          {
            type: 'examscored',
            question: 'Explain why the creation of the NHS in 1948 was significant. [4 marks]',
            markScheme: [
              'Award 1 mark for each valid developed point (up to 4 marks)',
              'Healthcare became free at the point of use — removing cost as a barrier to treatment',
              'The NHS was universal — covering all people in Britain regardless of income or employment status',
              'The NHS made medical breakthroughs (e.g. penicillin, vaccines) accessible to everyone, not just those who could pay',
              'The NHS transformed what illness meant for working-class families — no longer financial ruin, just illness',
              'The NHS employed 480,000 staff on day one, creating the infrastructure for mass public health',
              'Within a year, 187 million prescriptions and 8 million dental treatments showed the scale of unmet need it addressed',
            ],
            modelAnswer: 'The creation of the NHS in 1948 was significant because it made healthcare free at the point of use for the first time in British history. Before 1948, the poor often could not afford doctors, dentists or hospital treatment — illness could mean financial ruin for working-class families. The NHS removed this barrier: treatment was now a right, not a privilege. This was significant because it meant medical advances like antibiotics and vaccines reached everyone, not just those who could pay. On day one, 480,000 staff were employed, and within a year 187 million prescriptions had been issued — showing the enormous scale of need that had previously gone unmet.',
            isWarm: true,
          },
        ],
      },

      // Screen 9 — Final Boss
      {
        label: 'Final Boss',
        kicker: 'Boss Mode',
        heading: 'Three tiers. One chance to show everything.',
        blocks: [
          {
            type: 'boss',
            tier: '🟢',
            label: 'Round 1 — Core Knowledge',
            question: 'What was the NHS and when was it created? Name the person most responsible for its creation and explain one reason it was significant.',
            markPoints: `- The NHS (National Health Service) was created on 5 July 1948
- Aneurin Bevan was Minister of Health and the individual most responsible for driving it through parliament
- Significance: it made healthcare free at the point of use — the first time in British history that all people could access treatment regardless of income
- Significance (alternative): the scale was extraordinary — 480,000 staff on day one; 187 million prescriptions in the first year — showing enormous unmet need was now being addressed
- Award 1 mark per valid developed point (up to 4 marks)`,
          },
          {
            type: 'boss',
            tier: '🟡',
            label: 'Round 2 — Explain & Analyse',
            question: 'Explain how the government\'s role in healthcare changed between 1900 and 2000. Use at least two examples.',
            markPoints: `- 1900: limited government role — National Insurance Act 1911 (Lloyd George) covered some working men but not families; charity and voluntary hospitals filled gaps; no universal provision
- 1948: transformative intervention — NHS created universal, free healthcare; all hospitals nationalised; 480,000 staff; funded through taxation
- Post-1948: government expanded into prevention — mass vaccination programmes (polio 1955, MMR 1988); public health campaigns
- Late 20th century: lifestyle disease regulation — 1983 seat belt law; 2007 smoking ban; 2018 sugar tax
- Pattern of change: from minimal, means-tested support → universal treatment → active prevention and behaviour regulation
- Award 1 mark per valid developed point with example; 2 marks for each well-explained change with specific detail`,
          },
          {
            type: 'boss',
            tier: '🔴',
            label: 'Round 3 — Boss Mode',
            question: '"Government action was the most important factor in improving healthcare in Britain after 1900." How far do you agree? Use evidence from across the period.',
            markPoints: `- AGREEMENT — government action was decisive:
  - NHS (1948): made healthcare universal and free — removed cost as barrier, reached the whole population
  - Mass vaccination campaigns: only government could fund and organise at the scale required for herd immunity (polio 1955, MMR 1988, COVID 2020-21)
  - Lifestyle legislation: smoking ban (2007), seat belt law (1983), sugar tax (2018) — changed mass behaviour through law
  - Government as funder: NHS enabled access to ALL medical breakthroughs — without it, antibiotics, scans, transplants reached only the wealthy
- COUNTERARGUMENT — other factors also important:
  - Science and technology: DNA discovery, scanning technology, antibiotics — government did not discover these; individual scientists and teams did
  - Individual geniuses: Fleming, Florey, Chain, Watson and Crick — government action without their discoveries would have had nothing to distribute
  - Chance: Fleming's accidental discovery — no government planned this
  - War: WWII accelerated penicillin production — an external factor, not government planning
- CONCLUSION: Government action was crucial as the mechanism that distributed and applied other improvements — but it relied on science, technology and individuals to have something worth distributing. The strongest argument for government primacy: without the NHS, advances in medicine reached only those who could pay. Government action made improvement universal. Award marks for: sustained argument, specific evidence for and against, justified conclusion`,
          },
        ],
      },

      // Screen 10 — Retrieval
      {
        label: 'Retrieval',
        kicker: 'Retrieval',
        heading: 'Lock it in. No hints.',
        blocks: [
          {
            type: 'flashcards',
            cards: [
              { front: 'NHS creation date', back: '5 July 1948 — launched by Aneurin Bevan under the Labour government of Clement Attlee.' },
              { front: 'Aneurin Bevan', back: 'Minister of Health 1945–51. Drove the NHS through parliament against BMA opposition. Said he "stuffed their mouths with gold."' },
              { front: 'Free at the point of use', back: 'The founding NHS principle: when you need treatment, you pay nothing. Funded by National Insurance and taxation.' },
              { front: 'BMA opposition to the NHS', back: 'The British Medical Association (doctors\' professional body) opposed the NHS — fearing loss of income and independence. Bevan overcame this with merit awards and private pay beds.' },
              { front: 'Salk polio vaccine', back: '1955 — Jonas Salk\'s vaccine against polio. Government-funded mass campaign in Britain. Polio cases collapsed within years.' },
              { front: 'Lifestyle disease examples', back: 'Heart disease, lung cancer (linked to smoking), obesity, type 2 diabetes — caused by behaviour and environment, not bacteria.' },
              { front: 'Smoking ban year', back: '2007 — smoking banned in all enclosed public spaces in England. Evidence-driven: 1962 RCP report had linked smoking to cancer.' },
              { front: 'Prevention vs treatment', back: 'Prevention stops disease before it occurs (vaccination, campaigns). Treatment responds after disease develops (antibiotics, surgery). Prevention is generally cheaper.' },
              { front: 'Government as a factor in medicine', back: 'Government action is the thread connecting all medical progress to the public: sewers, NHS, vaccination, legislation. Without state funding and organisation, advances reach only the wealthy.' },
              { front: 'COVID-19 vaccination rollout', back: '2020–21. The fastest mass vaccination programme in history — over 15 million doses in the first two months. A modern example of government as the key public health actor.' },
            ],
          },
          {
            type: 'quiz',
            question: 'Which factor was MOST important in improving healthcare access for the whole British population after 1900?',
            options: [
              { text: 'Individual scientific genius — Fleming, Florey, Chain and others', correct: false },
              { text: 'Government intervention — creating the NHS, funding vaccination and passing health legislation', correct: true },
              { text: 'Charitable donations to voluntary hospitals', correct: false },
              { text: 'Technological invention of X-rays and scanning', correct: false },
            ],
            explanation: 'Scientific genius, technology and charity all contributed — but government intervention was the mechanism that made improvements universal. The NHS reached everyone; penicillin without the NHS reached only those who could pay. Government action turned discoveries into universal benefits.',
          },
        ],
      },

    ],
  },
  // ─── Biology — Placeholder topic group modules ───────────────────────────────

  {
    id: 'bio_building_life', subject: 'Biology', number: 2,
    title: 'Building Life', subtitle: 'Cells, Microscopes & Division',
    icon: '🔬', color: '#65E6C6', colorLight: 'rgba(101,230,198,.15)',
    hook: {
      statement: 'Every cell in your body contains the same DNA.',
      isTrue: true,
      accentWords: ['every cell', 'same DNA'],
      explanation: "Every cell — brain to big toe — carries identical DNA. What differs is which genes are switched on or off.",
    },
    outcomes: {
      intro: 'Every living thing starts with a cell. Understanding how cells are built is the foundation for all of the biology that follows.',
      bullets: [
        'Identify the key organelles in plant and animal cells',
        'Explain how microscopes changed our understanding of life',
        'Describe the stages of cell division and why it matters',
        'See how substances move in and out of cells',
      ],
    },

    recall: {
      questions: [
        { type: 'truefalse', question: 'Plant cells have both a cell membrane and a cell wall.', isTrue: true },
        { type: 'choice', question: 'Mitosis produces cells that are...', options: ['Genetically different from the parent cell', 'Genetically identical to the parent cell', 'Half the chromosome count of the parent'], correct: 1 },
        { type: 'connection', question: 'Cell membranes matter because...', options: [
          { text: 'They make the cell rigid and give it shape', icon: 'gear' },
          { text: 'They control precisely what enters and leaves the cell', icon: 'arrow' },
          { text: 'They produce energy for the cell to use', icon: 'atom' },
        ], correct: 1 },
      ],
    },
    screens: [
      {
        id: 's1', label: 'Overview', kicker: 'Topic Group 1',
        heading: 'Building Life',
        content: [
          { type: 'keypoint', text: 'All living things are made of <strong>cells</strong> — the basic unit of life. Understanding how cells are built, how we see them, and how they divide is the foundation of all biology.' },
          { type: 'read', label: 'Modules in this group', text: '<strong>Cells: The Tiny Factories</strong> — structure, organelles and their functions.<br><strong>Microscopes & Magnification</strong> — how scientists see cells and calculate scale.<br><strong>Cell Division & Stem Cells</strong> — mitosis, meiosis and the ethics of stem cell research.<br><strong>Moving Stuff In & Out</strong> — diffusion, osmosis and active transport.' },
          { type: 'keypoint', text: '🚧 Individual module content is being built. This topic group launches soon.' },
        ],
      },
    ],
  },

  {
    id: 'bio_human_machine', subject: 'Biology', number: 3,
    title: 'The Human Machine', subtitle: 'Organs, Digestion & Circulation',
    icon: '🫀', color: '#E87B5F', colorLight: 'rgba(232,123,95,.15)',
    hook: {
      statement: 'Your heart beats around 100,000 times a day.',
      isTrue: true,
      accentWords: ['100,000 times a day'],
      explanation: "At 70 beats per minute, your heart beats roughly 100,800 times every day — about 3 billion times in a lifetime.",
    },
    outcomes: {
      intro: 'Your body is a machine of extraordinary complexity. This chapter shows how its major systems actually work.',
      bullets: [
        'Explain how cells organise into tissues, organs and systems',
        'Describe the process of digestion from mouth to absorption',
        'See how the heart and blood vessels deliver oxygen to every cell',
        'Understand how plants transport water and nutrients through their structures',
      ],
    },

    recall: {
      questions: [
        { type: 'truefalse', question: 'Enzymes are permanently destroyed when they catalyse a reaction.', isTrue: false },
        { type: 'choice', question: 'The heart pumps blood to...', options: ['Only the lungs for oxygenation', 'Both the lungs and the entire body simultaneously', 'Only the brain and major organs'], correct: 1 },
        { type: 'connection', question: 'The digestive system breaks down food so that...', options: [
          { text: 'It can be stored safely as body fat', icon: 'leaf' },
          { text: 'Nutrients can cross into the bloodstream and reach cells', icon: 'heart' },
          { text: 'The body can produce more digestive enzymes', icon: 'flask' },
        ], correct: 1 },
      ],
    },
    screens: [
      {
        id: 's1', label: 'Overview', kicker: 'Topic Group 2',
        heading: 'The Human Machine',
        content: [
          { type: 'keypoint', text: 'Cells don\'t work alone — they group into <strong>tissues, organs and organ systems</strong> to power everything your body does.' },
          { type: 'read', label: 'Modules in this group', text: '<strong>Cells → Tissues → Organs</strong> — levels of organisation.<br><strong>Digestion & Enzymes</strong> — gut biology, catalysts and absorption.<br><strong>Blood, Heart & Circulation</strong> — the body\'s delivery system.<br><strong>Plant Transport Systems</strong> — xylem, phloem and stomata.' },
          { type: 'keypoint', text: '🚧 Individual module content is being built. This topic group launches soon.' },
        ],
      },
    ],
  },

  {
    id: 'bio_disease_wars', subject: 'Biology', number: 4,
    title: 'Disease Wars', subtitle: 'Pathogens, Immunity & Treatment',
    icon: '🦠', color: '#E84F6B', colorLight: 'rgba(232,79,107,.15)',
    hook: {
      statement: 'Antibiotics can kill a virus.',
      isTrue: false,
      accentWords: ['Antibiotics', 'kill a virus'],
      explanation: "Antibiotics only work on bacteria. Viruses live inside your own cells — which makes them much harder to target.",
    },
    outcomes: {
      intro: 'Your body is under constant attack. This chapter shows how pathogens invade — and how your immune system fights back.',
      bullets: [
        'Identify the types of pathogen and how each causes disease',
        'Explain how the immune system recognises and destroys invaders',
        'Describe how vaccines and antibiotics work — and where they fail',
        'See why lifestyle factors drive non-communicable diseases',
      ],
    },

    recall: {
      questions: [
        { type: 'truefalse', question: 'Bacteria and viruses are the same category of pathogen.', isTrue: false },
        { type: 'choice', question: 'Vaccines protect us by...', options: ['Directly killing pathogens in the body', 'Training the immune system to recognise threats', 'Replacing cells damaged by infection'], correct: 1 },
        { type: 'connection', question: 'Antibiotic resistance is a growing crisis because...', options: [
          { text: 'Antibiotics are becoming too expensive to produce', icon: 'flask' },
          { text: 'Bacteria evolve to survive antibiotic treatment over time', icon: 'germ' },
          { text: 'Antibiotics cause severe allergic reactions in most people', icon: 'warning' },
        ], correct: 1 },
      ],
    },
    screens: [
      {
        id: 's1', label: 'Overview', kicker: 'Topic Group 3',
        heading: 'Disease Wars',
        content: [
          { type: 'keypoint', text: 'Your body is under constant attack from <strong>pathogens</strong> — bacteria, viruses, fungi and protists. Understanding how disease spreads and how we fight it is critical for the exam.' },
          { type: 'read', label: 'Modules in this group', text: '<strong>Pathogens & Disease</strong> — types of pathogen and how disease spreads.<br><strong>The Immune System</strong> — phagocytes, lymphocytes and antibodies.<br><strong>Treating Disease & Antibiotics</strong> — drugs, vaccines and clinical trials.<br><strong>Non-Communicable Diseases</strong> — cancer, cardiovascular disease and lifestyle factors.' },
          { type: 'keypoint', text: '🚧 Individual module content is being built. This topic group launches soon.' },
        ],
      },
    ],
  },

  {
    id: 'bio_control_systems', subject: 'Biology', number: 5,
    title: 'Control Systems', subtitle: 'Nerves, Hormones & Reproduction',
    icon: '🧠', color: '#9B8BE8', colorLight: 'rgba(155,139,232,.15)',
    hook: {
      statement: 'Your nervous system sends signals faster than a Formula 1 car.',
      isTrue: true,
      accentWords: ['faster than a Formula 1 car'],
      explanation: "Nerve impulses travel at up to 120 m/s — over 430 km/h. The fastest F1 car tops out around 370 km/h.",
    },
    outcomes: {
      intro: 'Your body coordinates millions of signals every second. This chapter shows the two systems doing that work.',
      bullets: [
        'Explain how electrical nerve impulses carry information rapidly',
        'Describe how hormones regulate blood glucose, growth and reproduction',
        'See how reflex arcs protect you before your brain even registers danger',
        'Understand how the menstrual cycle is hormonally controlled',
      ],
    },

    recall: {
      questions: [
        { type: 'truefalse', question: 'Hormones travel through the nervous system to reach target organs.', isTrue: false },
        { type: 'choice', question: 'Reflex arcs bypass the brain because...', options: ['The brain is damaged in stressful situations', 'Faster responses to danger happen without conscious thought', 'The spinal cord is more reliable than the brain'], correct: 1 },
        { type: 'connection', question: 'Insulin is important because...', options: [
          { text: 'It fights bacterial infections in the bloodstream', icon: 'germ' },
          { text: 'It regulates blood glucose to keep cells working properly', icon: 'heart' },
          { text: 'It accelerates nerve signal transmission speed', icon: 'arrow' },
        ], correct: 1 },
      ],
    },
    screens: [
      {
        id: 's1', label: 'Overview', kicker: 'Topic Group 5',
        heading: 'Control Systems',
        content: [
          { type: 'keypoint', text: 'Your body uses two communication systems — the <strong>nervous system</strong> (electrical, fast) and the <strong>endocrine system</strong> (chemical, slower) — to coordinate everything.' },
          { type: 'read', label: 'Modules in this group', text: '<strong>The Nervous System</strong> — neurons, synapses, reflex arcs and the brain.<br><strong>Hormones & Blood Glucose</strong> — insulin, glucagon, diabetes and the menstrual cycle.<br><strong>Reproduction & Fertility</strong> — sexual vs asexual reproduction, IVF and FSH.' },
          { type: 'keypoint', text: '🚧 Individual module content is being built. This topic group launches soon.' },
        ],
      },
    ],
  },

  {
    id: 'bio_genetics_evolution', subject: 'Biology', number: 6,
    title: 'Genetics & Evolution', subtitle: 'DNA, Inheritance & Natural Selection',
    icon: '🧬', color: '#7EC8E3', colorLight: 'rgba(126,200,227,.15)',
    hook: {
      statement: 'Humans share 50% of their DNA with a banana.',
      isTrue: true,
      accentWords: ['50%', 'DNA with a banana'],
      explanation: "Around half of human DNA is shared with bananas — because both species share the basic cellular machinery for copying DNA and producing energy.",
    },
    outcomes: {
      intro: 'DNA is the instruction manual for life. This chapter shows how it gets read, inherited — and sometimes rewritten.',
      bullets: [
        'Explain how DNA encodes the instructions for building proteins',
        'Use Punnett squares to predict the probability of inherited traits',
        'Describe how natural selection drives evolution over generations',
        'Evaluate the science and ethics of genetic engineering',
      ],
    },

    recall: {
      questions: [
        { type: 'truefalse', question: 'Every cell in your body contains a full copy of your DNA.', isTrue: true },
        { type: 'choice', question: 'Natural selection favours individuals who are...', options: ['The largest members of the species', 'Best adapted to survive and reproduce in their environment', 'The slowest to reproduce'], correct: 1 },
        { type: 'connection', question: 'DNA mutations can drive evolution because...', options: [
          { text: 'Mutations always make the organism stronger immediately', icon: 'dna' },
          { text: 'Some mutations provide survival advantages in a changing environment', icon: 'leaf' },
          { text: 'They affect every member of the species simultaneously', icon: 'people' },
        ], correct: 1 },
      ],
    },
    screens: [
      {
        id: 's1', label: 'Overview', kicker: 'Topic Group 6',
        heading: 'Genetics & Evolution',
        content: [
          { type: 'keypoint', text: '<strong>DNA</strong> carries the instructions for building every living thing. Understanding how traits are inherited — and how species change over time — is some of the most fascinating science at GCSE.' },
          { type: 'read', label: 'Modules in this group', text: '<strong>DNA & The Genome</strong> — structure, genes, alleles and protein synthesis.<br><strong>Inheritance & Genetic Crosses</strong> — Punnett squares, probability and genetic disorders.<br><strong>Evolution & Natural Selection</strong> — Darwin, evidence and speciation.<br><strong>Genetic Engineering</strong> — CRISPR, GM crops and the ethics of gene editing.' },
          { type: 'keypoint', text: '🚧 Individual module content is being built. This topic group launches soon.' },
        ],
      },
    ],
  },

  {
    id: 'bio_ecosystems_group', subject: 'Biology', number: 7,
    title: 'Ecosystems', subtitle: 'Food Chains, Biodiversity & Conservation',
    icon: '🌿', color: '#68C18A', colorLight: 'rgba(104,193,138,.15)',
    hook: {
      statement: 'Removing a single species from an ecosystem rarely matters.',
      isTrue: false,
      accentWords: ['single species', 'rarely matters'],
      explanation: "Remove a keystone species — like wolves from Yellowstone — and the whole ecosystem can collapse through a chain reaction called a trophic cascade.",
    },
    outcomes: {
      intro: 'Nothing in nature exists in isolation. This chapter shows how species depend on each other — and what happens when that balance breaks.',
      bullets: [
        'Describe how energy flows through food chains and food webs',
        'Explain how species adapt to survive in specific environments',
        'See why biodiversity matters — and what threatens it',
        'Evaluate the real impact of human activity on ecosystems',
      ],
    },

    recall: {
      questions: [
        { type: 'truefalse', question: 'Producers are animals that hunt and eat other animals.', isTrue: false },
        { type: 'choice', question: 'Biodiversity matters because...', options: ['It makes ecosystems more visually impressive', 'More species makes ecosystems more stable and resilient', 'It prevents any species from dominating another'], correct: 1 },
        { type: 'connection', question: 'Removing a keystone species causes ecosystem collapse because...', options: [
          { text: 'It leaves more food for remaining animals to fight over', icon: 'warning' },
          { text: 'Other species depend on it in ways that cascade through the whole web', icon: 'leaf' },
          { text: 'It only affects the predators that fed on it directly', icon: 'arrow' },
        ], correct: 1 },
      ],
    },
    screens: [
      {
        id: 's1', label: 'Overview', kicker: 'Topic Group 7',
        heading: 'Ecosystems',
        content: [
          { type: 'keypoint', text: 'Every organism exists within an <strong>ecosystem</strong> — a web of interdependent relationships. This topic group covers how energy flows, how species adapt, and what happens when humans interfere.' },
          { type: 'read', label: 'Modules in this group', text: '<strong>Ecosystems & Food Chains</strong> — producers, consumers, energy transfer and pyramids.<br><strong>Adaptations & Biodiversity</strong> — how species are shaped by their environment.<br><strong>Human Impact & Conservation</strong> — deforestation, pollution, rewilding and the IUCN.' },
          { type: 'keypoint', text: '🚧 Individual module content is being built. This topic group launches soon.' },
        ],
      },
    ],
  },

  // ─── Chemistry — Placeholder topic group modules ──────────────────────────────

  {
    id: 'chem_matter_atoms', subject: 'Chemistry', number: 1,
    title: 'Matter & Atoms', subtitle: 'Elements, Bonding & Giant Structures',
    icon: '⚛️', color: '#9B59E8', colorLight: 'rgba(155,89,232,.15)',
    hook: {
      statement: 'An atom is mostly empty space.',
      isTrue: true,
      accentWords: ['mostly empty space'],
      explanation: "If an atom's nucleus were the size of a pea, the electrons would orbit 500 metres away. Everything in between is empty.",
    },
    outcomes: {
      intro: 'Everything you can touch, see or breathe is made of atoms. This chapter shows what that actually means.',
      bullets: [
        'Describe the structure of an atom and what each particle does',
        'Explain the patterns in the Periodic Table and why they exist',
        'See how ionic, covalent and metallic bonding work differently',
        'Describe the properties of giant structures like diamond, graphite and metals',
      ],
    },

    recall: {
      questions: [
        { type: 'truefalse', question: 'Atoms of the same element always have the same number of protons.', isTrue: true },
        { type: 'choice', question: 'In ionic bonding, electrons are...', options: ['Shared equally between atoms', 'Transferred completely from one atom to another', 'Released into the surrounding atmosphere'], correct: 1 },
        { type: 'connection', question: 'Diamond and graphite behave so differently because...', options: [
          { text: 'They contain different numbers of protons in their nuclei', icon: 'atom' },
          { text: 'Their carbon atoms are arranged in completely different structures', icon: 'gear' },
          { text: 'Diamond contains more carbon atoms per cubic centimetre', icon: 'flask' },
        ], correct: 1 },
      ],
    },
    screens: [
      {
        id: 's1', label: 'Overview', kicker: 'Group 1',
        heading: 'Matter & Atoms',
        content: [
          { type: 'keypoint', text: 'Everything is made of <strong>atoms</strong>. Understanding atomic structure, how atoms bond, and the patterns in the Periodic Table is the foundation of all chemistry.' },
          { type: 'read', label: 'Modules in this group', text: '<strong>Atoms & Elements</strong> — protons, neutrons, electrons and atomic number.<br><strong>The Periodic Table</strong> — groups, periods, trends and key element groups.<br><strong>Bonding Basics</strong> — ionic, covalent and metallic bonding.<br><strong>Giant Structures & Materials</strong> — diamond, graphite, metals and polymers.' },
          { type: 'keypoint', text: '🚧 Individual module content is being built. This topic group launches soon.' },
        ],
      },
    ],
  },

  {
    id: 'chem_reactions', subject: 'Chemistry', number: 2,
    title: 'Chemical Reactions', subtitle: 'Equations, Acids & Electrolysis',
    icon: '🧪', color: '#C459E8', colorLight: 'rgba(196,89,232,.15)',
    hook: {
      statement: 'You can neutralise an acid by adding more acid.',
      isTrue: false,
      accentWords: ['neutralise', 'adding more acid'],
      explanation: "You neutralise an acid with an alkali. Adding more acid makes it more acidic. Neutralisation needs opposite pH — acid meets base.",
    },
    outcomes: {
      intro: 'Chemistry is really just atoms rearranging themselves. This chapter shows you how to track — and predict — those rearrangements.',
      bullets: [
        'Write and balance chemical equations from scratch',
        'Explain what happens during acid-base reactions',
        'Describe how electrolysis splits compounds using electricity',
        'Understand energy changes in exothermic and endothermic reactions',
      ],
    },

    recall: {
      questions: [
        { type: 'truefalse', question: 'A balanced equation has more atoms on the right than the left.', isTrue: false },
        { type: 'choice', question: 'Neutralisation reactions always produce...', options: ['Only water as a product', 'A salt and water together', 'Carbon dioxide and water'], correct: 1 },
        { type: 'connection', question: 'Electrolysis is used industrially to...', options: [
          { text: 'Speed up reactions that would otherwise be too slow', icon: 'arrow' },
          { text: 'Extract and purify metals like aluminium from their ores', icon: 'atom' },
          { text: 'Create entirely new chemical elements in the lab', icon: 'flask' },
        ], correct: 1 },
      ],
    },
    screens: [
      {
        id: 's1', label: 'Overview', kicker: 'Group 2',
        heading: 'Chemical Reactions',
        content: [
          { type: 'keypoint', text: 'Chemical reactions rearrange atoms. Learning to write balanced equations, understand acid-base chemistry, and explain electrolysis are core exam skills.' },
          { type: 'read', label: 'Modules in this group', text: '<strong>Reactions & Equations</strong> — balancing equations, types of reaction, state symbols.<br><strong>Acids, Alkalis & Salts</strong> — pH, neutralisation, making salts and titration.<br><strong>Electrolysis</strong> — electrodes, half-equations and industrial uses.<br><strong>Energy Changes</strong> — exothermic, endothermic, bond energies and Hess\'s law.' },
          { type: 'keypoint', text: '🚧 Individual module content is being built. This topic group launches soon.' },
        ],
      },
    ],
  },

  {
    id: 'chem_rates_organic', subject: 'Chemistry', number: 3,
    title: 'Rates & Organic Chemistry', subtitle: 'Rates, Equilibria, Hydrocarbons & Fuels',
    icon: '🛢️', color: '#8B59E8', colorLight: 'rgba(139,89,232,.15)',
    hook: {
      statement: 'Crude oil took millions of years to form.',
      isTrue: true,
      accentWords: ['millions of years'],
      explanation: "Crude oil formed from marine organisms buried 300–400 million years ago. We're burning in decades what took geological ages to create.",
    },
    outcomes: {
      intro: 'Crude oil built the modern world. This chapter shows where it came from, what it contains, and what happens when it burns.',
      bullets: [
        'Explain how temperature, concentration and catalysts affect reaction rate',
        'Describe what reversible reactions and equilibrium mean in practice',
        'See how fractional distillation separates crude oil into useful fractions',
        'Understand cracking — and why alkenes are more useful than alkanes',
      ],
    },

    recall: {
      questions: [
        { type: 'truefalse', question: 'Increasing temperature always slows down a chemical reaction.', isTrue: false },
        { type: 'choice', question: 'Fractional distillation separates crude oil based on...', options: ['The colour of different hydrocarbon fractions', 'The boiling points of different hydrocarbons', 'The size of molecules only'], correct: 1 },
        { type: 'connection', question: 'Cracking long-chain hydrocarbons is commercially valuable because...', options: [
          { text: 'It produces more crude oil from existing reserves', icon: 'warning' },
          { text: 'It creates shorter, more useful molecules like petrol and ethene', icon: 'flask' },
          { text: 'It removes toxic impurities from petroleum products', icon: 'leaf' },
        ], correct: 1 },
      ],
    },
    screens: [
      {
        id: 's1', label: 'Overview', kicker: 'Group 3',
        heading: 'Rates & Organic Chemistry',
        content: [
          { type: 'keypoint', text: '<strong>Crude oil</strong> is the basis of most fuels and plastics. Understanding how reactions speed up, reach equilibrium, and how organic compounds are separated is crucial for the exam.' },
          { type: 'read', label: 'Modules in this group', text: '<strong>Rates of Reaction</strong> — concentration, temperature, surface area and catalysts.<br><strong>Reversible Reactions</strong> — equilibrium, Le Chatelier\'s principle and the Haber process.<br><strong>Hydrocarbons & Crude Oil</strong> — alkanes, alkenes, fractional distillation.<br><strong>Cracking & Fuels</strong> — thermal cracking, catalytic cracking and combustion.' },
          { type: 'keypoint', text: '🚧 Individual module content is being built. This topic group launches soon.' },
        ],
      },
    ],
  },

  {
    id: 'chem_earth', subject: 'Chemistry', number: 4,
    title: 'Earth Chemistry', subtitle: 'Atmosphere, Climate & Resources',
    icon: '🌍', color: '#5980E8', colorLight: 'rgba(89,128,232,.15)',
    hook: {
      statement: "Earth's atmosphere has always been 21% oxygen.",
      isTrue: false,
      accentWords: ['always been 21% oxygen'],
      explanation: "The early atmosphere was mostly carbon dioxide and nitrogen — no oxygen at all. Cyanobacteria slowly built it up over billions of years through photosynthesis.",
    },
    outcomes: {
      intro: 'The atmosphere we breathe is a chemical achievement 4 billion years in the making. This chapter shows how fragile that achievement is.',
      bullets: [
        "Describe how Earth's atmosphere evolved from volcanic gases",
        'Explain the greenhouse effect and how human activity intensifies it',
        'See how life cycle assessment measures environmental impact',
        "Evaluate approaches to using Earth's resources more sustainably",
      ],
    },

    recall: {
      questions: [
        { type: 'truefalse', question: 'Earth\'s early atmosphere contained almost no free oxygen.', isTrue: true },
        { type: 'choice', question: 'The greenhouse effect causes warming because...', options: ['It destroys the ozone layer allowing UV in', 'Greenhouse gases trap heat that would otherwise escape into space', 'The sun\'s radiation has been steadily increasing'], correct: 1 },
        { type: 'connection', question: 'Life cycle assessment matters because...', options: [
          { text: 'Companies are legally required to display it on products', icon: 'warning' },
          { text: 'It measures environmental impact across a product\'s entire life', icon: 'leaf' },
          { text: 'It calculates the exact financial cost of manufacturing', icon: 'gear' },
        ], correct: 1 },
      ],
    },
    screens: [
      {
        id: 's1', label: 'Overview', kicker: 'Group 4',
        heading: 'Earth Chemistry',
        content: [
          { type: 'keypoint', text: 'The chemistry of our planet keeps life possible — but human activity is changing it. This group covers how the atmosphere evolved, why climate is changing, and how we can use resources more sustainably.' },
          { type: 'read', label: 'Modules in this group', text: '<strong>Earth\'s Atmosphere</strong> — evolution of the atmosphere, gases and their proportions.<br><strong>Climate Change</strong> — greenhouse gases, global warming and impacts.<br><strong>Using Resources</strong> — life cycle assessment, sustainable development and potable water.' },
          { type: 'keypoint', text: '🚧 Individual module content is being built. This topic group launches soon.' },
        ],
      },
    ],
  },
]

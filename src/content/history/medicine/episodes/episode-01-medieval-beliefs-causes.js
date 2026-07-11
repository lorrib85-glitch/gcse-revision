// Episode file — owns the runtime teaching sequence for one episode.
//
// Actual image files live in public/history/medicine/.
// Asset path resolution lives in src/content/history/medicine/assets.js.
// Canonical content + architecture docs live in docs/content/history/medicine/.

export default {
  id: 'history-medicine-medieval-beliefs-causes',
  subject: 'History',
  number: 1,
  title: 'Trust me, I\'m Following Jupiter',
  subtitle: 'Medieval Medicine: Beliefs and Causes of Disease',
  era: 'c.1250–c.1500',
  icon: '⚕️',
  color: '#F5B700',
  colorLight: '#f5e6d3',
  series: 'medicine-through-time',
  recallTags: [],   // not consumed by any app logic — do not add decorative tags
  examTags: [],     // not consumed by any app logic — do not add decorative tags
  assetKeys: [],

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

  stageNavigation: [
    { id: 'part-1', title: 'Strange Ideas, Serious Medicine', description: 'Intro hook, prior recall and roadmap.', screenIndex: 0 },
    { id: 'part-2', title: 'What Made People Sick?', description: 'Religious, astrological, miasma and humoural explanations.', screenIndex: 1 },
    { id: 'part-3', title: 'Why Galen Ruled the Room', description: 'Hippocrates, Galen, Church authority and book learning.', screenIndex: 7 },
    { id: 'part-4', title: 'The Medieval Treatment Toolkit', description: 'Physicians, barber surgeons, apothecaries, hospitals and prevention.', screenIndex: 11 },
    { id: 'part-5', title: 'Why the System Survived', description: 'Continuity, agents of change/continuity and the coherent-but-wrong system.', screenIndex: 24 },
    { id: 'part-6', title: 'Exam Prep: Explain the Grip of Galen', description: 'Examiner traps, mark-scheme thinking and exam practice.', screenIndex: 27 },
  ],

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
          image: '/figures/history/medicine/medieval/hippocrates-card-who-was-he.webp',
          imagePosition: 'center center',
          lines: [
            'One of the first doctors to argue that illness had natural causes, not just supernatural ones.',
          ],
        },
        {
          title: 'Four humours',
          icon: 'medicine',
          image: '/figures/history/medicine/medieval/hippocrates-card-four-humours.webp',
          imagePosition: 'center center',
          lines: [
            'Hippocrates believed the body contained four humours:',
            'Blood · Phlegm · Yellow bile · Black bile',
            'Illness happened when these became unbalanced.',
          ],
        },
        {
          title: 'Observation',
          icon: 'knowledge',
          image: '/figures/history/medicine/medieval/hippocrates-card-observation.webp',
          imagePosition: 'center center',
          lines: [
            'Hippocrates believed doctors should observe symptoms carefully, examine patients closely, and keep records.',
            'He encouraged reasoning rather than magic or superstition.',
          ],
        },
        {
          title: 'Influence',
          icon: 'legacy',
          image: '/figures/history/medicine/medieval/hippocrates-card-influence.webp',
          imagePosition: 'center center',
          lines: [
            "Galen developed Hippocrates' Four Humours theory.",
            'Medieval physicians learned these ideas from books, so they stayed influential for over 1,500 years.',
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
          mainText: 'The Theory of the Four Humours.',
        },
        {
          mainText: 'Doctors believed the body contained four important fluids.',
          microPoints: ['Blood', 'Phlegm', 'Yellow bile', 'Black bile'],
        },
        {
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
      portrait: '/figures/history/medicine/medieval/galen-portrait.png',
      portraitPosition: 'center 25%',
      cardBackground: '/figures/history/medicine/medieval/galen-parchment.png',
      name: 'Galen',
      role: 'Roman doctor and writer',
      significance: 'The doctor whose ideas dominated medicine for over 1,400 years.',
      sections: [
        {
          title: 'Gladiators & dissection',
          icon: 'war-conflict',
          image: '/figures/history/medicine/medieval/galen-gladiators.png',
          imagePosition: 'center 55%',
          lines: [
            'Galen spent years patching up wounded gladiators — giving him direct, hands-on experience of the human body.',
            'He also dissected animals extensively to study anatomy.',
            'This practical knowledge set him apart from most physicians of his time.',
          ],
        },
        {
          title: 'Theory of the four humours',
          icon: 'bloodletting',
          image: '/figures/history/medicine/medieval/galen-teaching.png',
          imagePosition: 'center center',
          lines: [
            "Galen promoted Hippocrates' Four Humours — Blood, Phlegm, Yellow bile, Black bile — and added his own contribution.",
            'He argued illness should be treated with its opposite: hot illness → cold remedy. Wet illness → dry remedy.',
          ],
          quote: 'Health exists when the four humours are in perfect balance.',
        },
        {
          title: 'The squealing pig',
          icon: 'science',
          image: '/figures/history/medicine/medieval/galen-dissection.png',
          imagePosition: 'center 35%',
          lines: [
            'Galen wanted to prove the brain — not the heart — controlled the body.',
            'He performed a public demonstration, cutting the vocal cord nerves of a squealing pig mid-cry.',
            'The pig fell instantly silent. The crowd was stunned. Galen\'s reputation was made.',
          ],
        },
        {
          title: 'Influence & lasting legacy',
          icon: 'legacy',
          lines: [
            'Galen\'s writings became the most authoritative medical texts in the medieval world.',
            'His ideas influenced doctors for more than a millennium.',
          ],
          takeaway: 'He laid the foundations for modern anatomy and medical research — even though some ideas were wrong because he studied animals, not humans.',
        },
      ],
    },

    {
      stage: 'Galen',
      label: 'The Theory of Opposites',
      shell: 'teach',
      heading: 'Every illness had an opposite',
      sub: 'Each humour sat where two qualities met — hot or cold, wet or dry. A patient\'s symptoms revealed which were in excess.',
      blocks: [
        {
          type: 'mediaPlaceholder',
          kind: 'diagram',
          aspect: '4:3',
          caption: 'The four humours placed on hot–cold and wet–dry axes, with an arrow crossing to the opposite quadrant.',
        },
      ],
    },

    {
      type: 'symptomQualityDiagnostic',
      stage: 'Galen',
      label: 'Symptom to treatment',
      qualities: [
        { quality: 'hot', symptoms: ['Fever', 'Red face', 'Flushed skin'] },
        { quality: 'cold', symptoms: ['Pale skin', 'Chills', 'Shivering'] },
        { quality: 'wet', symptoms: ['Sweating', 'Runny nose', 'Watery eyes'] },
        { quality: 'dry', symptoms: ['Cracked lips', 'Dry cough', 'Thirst'] },
      ],
      patient: {
        title: 'A patient arrives',
        symptoms: ['Fever', 'Phlegm cough'],
      },
      quadrantQuestion: 'Which qualities dominate?',
      quadrantOptions: [
        { label: 'Hot + wet', correct: true },
        { label: 'Hot + dry', correct: false },
        { label: 'Cold + wet', correct: false },
        { label: 'Cold + dry', correct: false },
      ],
      diagnosis: { label: 'Hot + wet' },
      treatmentQuestion: 'What would Galen prescribe to cool and dry this patient?',
      treatmentOptions: [
        {
          label: 'Cucumber and dry bread',
          correct: true,
          explanation: 'Cold and dry qualities pull the body back towards balance against the hot, wet excess.',
        },
        {
          label: 'Hot soup and warm wine',
          correct: false,
          explanation: 'Hot and wet — the same qualities causing the illness, not the opposite.',
        },
        {
          label: 'Warm blankets and a thick stew',
          correct: false,
          explanation: 'Still adds heat, when the patient needs cooling.',
        },
        {
          label: 'Cold milk and steamed vegetables',
          correct: false,
          explanation: "Cold is right, but this is still moist — it doesn't dry the body.",
        },
      ],
      oppositeRecall: { from: 'Hot + wet', to: 'Cold + dry', result: 'Balance' },
      closing: {
        worked: ['Rest', 'Fluids', 'Cooling foods'],
        limitation: 'Disease is not actually caused by an imbalance of the four humours.',
        verdict: 'Patients who rested, drank fluids and ate cooling foods often did recover. To Galen, and to the doctors who followed him, that recovery looked like proof the theory worked, even though the humours had nothing to do with it.',
        church: {
          heading: 'Supported by the Church',
          body: "Christians believed God created a perfect and balanced body. This matched Galen's ideas, so the Church preserved and promoted his work for centuries.",
        },
        significance: "That's why the Theory of Opposites survived for over 1,400 years. It wasn't blind faith. It was a theory that seemed to keep working, treatment after treatment, patient after patient.",
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
        {
          type: 'choice',
          question: 'Which humour did Galen link with hot and wet qualities?',
          options: ['Blood', 'Phlegm', 'Yellow bile', 'Black bile'],
          correct: 0,
          explanation: 'Blood carried hot and wet qualities. A patient with too much blood showed heat and wetness, like the fever and sweating in the case you just diagnosed.',
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
          title: 'Apothecary',
          image: '/figures/history/medicine/medieval/apothecary.png',
          sections: [
            { heading: 'Favourite methods', items: ['Mixing remedies', 'Herbal medicine', 'Purging'] },
            { heading: 'Cost', items: ['💰💰💰'] },
            { heading: 'Thomas confidence', items: ['⭐⭐⭐⭐⭐☆☆☆☆☆'] },
          ],
          reaction: '"At least this one smells nice."',
          buttonText: 'Choose the Apothecary',
          nextScreenId: 'post-choice',
          revealLines: [
            "You chose the Apothecary.",
            "Think of him as a medieval pharmacist.",
            "He mixes herbs, spices and other ingredients into ready-made remedies — and sells them straight from his shop.",
            "Cheaper than a physician, and no appointment needed.",
            "Physicians weren't keen on him.",
            "He was competition. And he sometimes sold the poisons used for purging — something physicians saw as breaking their oath to do no harm.",
            "For most people in town, the apothecary's shop was where medicine actually happened.",
          ],
        },
        {
          title: 'Care at home',
          subtitle: 'Family remedies and home nursing',
          image: '/figures/history/medicine/medieval/care-at-home.webp',
          sections: [
            { heading: 'Methods', items: ['Herbal remedies', 'Rest and nursing', 'Food and drink', 'Family remedies'] },
            { heading: 'Cost', items: ['💰'] },
            { heading: 'Thomas confidence', items: ['⭐⭐⭐⭐☆'] },
          ],
          reaction: '"His family can help straight away."',
          buttonText: 'Choose care at home',
          nextScreenId: 'post-choice',
          revealLines: [
            'Most treatment started at home.',
            'For ordinary people, family care was often the first line of treatment.',
            'Women often played a major role using herbs, nursing and remedies passed down through experience.',
            'Professional treatment was expensive, so home care mattered most.',
            'Medieval medicine was not only about doctors. It was also about access, money and everyday care.',
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
    },

    {
      type: 'collectionExplorer',
      stage: 'Prevention and care',
      id: 'staying-well-1400',
      label: 'Staying Well in 1400',
      title: 'Staying well in 1400',
      description: 'Tap each object to find out how people tried to stay healthy — before anyone knew about germs.',
      backgroundImage: '/figures/history/medicine/medieval/medieval-street.webp',
      items: [
        {
          id: 'regimen-sanitatis',
          x: 22, y: 38,
          label: "A physician's lifestyle chart",
          reveals: [
            { text: "A wealthy merchant keeps a written chart pinned to his wall — instructions for exactly how to eat, sleep and bathe." },
            { text: "This is a Regimen Sanitatis: a physician's personal guide to diet, exercise, sleep and bathing, written to keep a patient's humours in balance." },
            { text: "Prevention followed the same logic as treatment. If the Four Humours explained illness, keeping them balanced through daily habits should stop illness before it started." },
            { text: "A personalised Regimen Sanitatis came from a physician — which meant it cost money. Only the wealthy could afford this kind of tailored advice. Prevention, like treatment, depended on wealth." },
            { text: "The Regimen Sanitatis shows the Four Humours shaped how people lived, not just how doctors treated illness. Diet, sleep and bathing were all part of the same theory." },
          ],
        },
        {
          id: 'stewes',
          x: 70, y: 60,
          label: 'A public bathhouse',
          reveals: [
            { text: "Down a side street, steam rises from a public bathhouse — and anyone can walk in." },
            { text: "These are stewes: medieval public baths. Unlike a Regimen Sanitatis, they were free to use." },
            { text: 'Bathing fitted both major theories of disease. It rebalanced "wet" and "dry" qualities under the Four Humours, and washed away the dirt thought to cause bad-smelling, disease-carrying air.' },
            { text: "Don't assume medieval people never washed. Public baths existed in towns and were used regularly — the idea of total medieval filth is exaggerated." },
            { text: "Medieval prevention wasn't only for the wealthy. Stewes were open to most people — though, as with most aspects of medieval care, the rich still had better individual options." },
          ],
        },
        {
          id: 'purifying-air',
          x: 45, y: 22,
          label: 'A bunch of dried herbs',
          reveals: [
            { text: "A woman walking through town presses a small bunch of dried flowers to her nose." },
            { text: 'This is "purifying the air" — carrying sweet-smelling herbs (a posy) and ringing bells to keep the air moving, both believed to protect against miasma.' },
            { text: "If bad-smelling air carried disease, then good smells and moving air should push it away. This is a direct application of miasma theory to daily life." },
            { text: 'This wasn\'t random superstition. Miasma theory came from Hippocrates and Galen — so "purifying the air" meant following respected medical authority, not folk magic.' },
            { text: "Miasma theory shaped everyday behaviour directly. Belief about the cause of illness determined how people tried to prevent it." },
          ],
        },
        {
          id: 'clean-water',
          x: 82, y: 80,
          label: 'A water pipe',
          reveals: [
            { text: "In Gloucester, water runs through lead pipes straight into a wealthy household. Across the country in Hull, a cart waits outside to empty the cesspit." },
            { text: 'Some towns invested in clean water and waste removal. Gloucester used lead pipes and an aqueduct — though mainly for the rich. Hull used "night carts" to empty cesspits.' },
            { text: "Removing waste and securing clean water were genuine attempts at prevention, separate from humours, miasma or astrology — based on the observation that dirty places bred illness." },
            { text: "Don't picture every medieval town as equally dirty or equally clean. Provision varied hugely, and depended heavily on wealth." },
            { text: "Practical public health measures — street cleaning, clean water, waste removal — reduced disease for real, even though the people providing them understood illness through miasma, not germ theory." },
          ],
        },
      ],
      synthesis: {
        heading: 'Prevention followed belief',
        points: [
          'A Regimen Sanitatis followed the Four Humours — diet, sleep and bathing kept the body in balance.',
          'Sweet herbs and ringing bells followed miasma theory — pushing away the bad air believed to carry disease.',
          'Stewes and clean water schemes show some genuine, practical progress — town by town, and unevenly.',
          "Wealth decided how much prevention you could afford, from a private Regimen Sanitatis to Gloucester's lead pipes.",
        ],
        examTakeaway: 'Every prevention method connects back to a belief about the cause of disease. Miasma drove street cleaning; the Four Humours drove dietary advice; religious belief drove confession and prayer. The belief determined the prevention.',
      },
    },

    {
      stage: 'Prevention and care',
      label: 'Whose job was it to stay healthy?',
      kicker: 'Public health',
      heading: 'Whose job was it to stay healthy?',
      sub: 'Sort each example by who was responsible for it.',
      blocks: [
        {
          type: 'colsort',
          question: 'Government action or individual responsibility?',
          columns: [
            { label: 'GOVERNMENT / TOWN\nOrganised by authorities', color: '#D69B45', bg: 'rgba(214,155,69,.07)' },
            { label: 'INDIVIDUAL / FAMILY\nPersonal choices and money', color: '#A89070', bg: 'rgba(168,144,112,.07)' },
          ],
          items: [
            { label: "Edward III's 1352 law banning littering in London's streets", col: 0, explanation: 'Government action — a royal law aimed at the whole city.' },
            { label: '12 rakers employed to clear London\'s streets by 1370', col: 0, explanation: 'Government action — the town paid workers to keep streets clear.' },
            { label: 'Hull\'s "night carts" emptying cesspits', col: 0, explanation: 'Government action — an organised town service.' },
            { label: "Public latrines built in London, with butchers ordered to remove their waste", col: 0, explanation: 'Government action — a rule enforced on traders by the town.' },
            { label: 'Carrying sweet-smelling herbs to ward off bad air', col: 1, explanation: 'Individual choice — a personal precaution anyone could take.' },
            { label: "Gloucester's lead pipes bringing fresh water to wealthy homes", col: 1, explanation: 'Paid for by wealthy individuals — clean water was a privilege of money, not a service for everyone.' },
            { label: "Following a physician's Regimen Sanitatis", col: 1, explanation: 'Individual choice — and only for those who could pay for the advice.' },
            { label: 'Ringing bells to keep the air moving near your home', col: 1, explanation: 'Individual choice — a household precaution based on miasma theory.' },
          ],
          explanation: 'Most organised public health came from towns and government — but usually only once a problem became impossible to ignore. For most people, staying healthy day to day was still down to what they believed and what they could afford.',
        },
      ],
    },

    {
      type: 'interactiveImage',
      stage: 'Prevention and care',
      id: 'medieval-hospitals',
      label: 'A Walk Through Medieval London',
      title: 'A walk through medieval London',
      introText: 'By 1400, England had over 500 hospitals. Tap each one to find out what really happened inside.',
      image: '/figures/history/medicine/medieval/vl-church.webp',
      imageAlt: 'A medieval church and hospital building in London',
      ctaLabel: 'Step inside',
      hotspots: [
        {
          id: 'st-barts', x: 30, y: 35,
          shortLabel: "St Bartholomew's", title: "St Bartholomew's, 1123", icon: '🏥',
          description: "Founded in 1123, St Bartholomew's was the first hospital in England. By 1400, over 500 hospitals existed across the country — most run by the Church, often inside monasteries, or paid for by wealthy donors.",
          extraFact: "St Bartholomew's Hospital is still treating patients in London today — nearly 900 years after it was founded.",
        },
        {
          id: 'care-not-cure', x: 62, y: 52,
          shortLabel: 'Inside the ward', title: 'Care, not cure', icon: '🛏️',
          description: "Most hospitals offered food, warmth, clean bedding and prayer. Monks and nuns looked after patients as a religious duty. What they didn't offer was a cure.",
          extraFact: "Patients with infectious or terminal illnesses were often turned away. If nothing could be done for a condition, the hospital had no role for them.",
        },
        {
          id: 'lazar-house', x: 80, y: 28,
          shortLabel: 'The Lazar House', title: 'The Lazar House', icon: '⛪',
          description: 'A Lazar House was a separate hospital for people with leprosy, run by the Church and kept apart from the rest of the town.',
          extraFact: 'Keeping leprosy sufferers apart shows medieval people understood some diseases could pass between people — even without knowing why.',
        },
        {
          id: 'endowment', x: 48, y: 75,
          shortLabel: 'Who paid for this?', title: 'Money left in a will', icon: '📜',
          description: "Hospitals were expensive to run. Many were funded by an endowment — money a wealthy person left in their will, often to help guarantee their soul's place in heaven.",
          extraFact: 'For the donor, funding a hospital was also a religious investment. Caring for the sick was believed to count in your favour with God.',
        },
      ],
    },

    {
      stage: 'Prevention and care',
      label: 'How John Bradmore saved a prince',
      kicker: 'Surgery in wartime',
      heading: 'How John Bradmore saved a prince',
      sub: '1403. An arrow. A teenage prince. A surgeon with no anaesthetic, no antiseptic — and no idea why either would matter.',
      blocks: [
        {
          type: 'explainReveal',
          intro: 'At the Battle of Shrewsbury in 1403, a 16-year-old prince — later Henry V — was hit in the face by an arrow. The arrowhead broke off and lodged deep in the bone. Here is how his surgeon, John Bradmore, saved his life.',
          atmosphereImage: '/figures/history/medicine/medieval/barber-surgeon.webp',
          steps: [
            {
              id: 'problem',
              statement: 'The arrowhead',
              emphasis: "was lodged six inches deep in bone, behind the prince's nose.",
              detail: 'Pulling it out the way it went in would tear the wound wider and risk killing him.',
            },
            {
              id: 'tool',
              statement: 'Bradmore designed a tool —',
              emphasis: 'a hollow metal screw that could grip the inside of the arrowhead and draw it out in a straight line.',
              detail: 'No textbook described this. It was a practical solution to a problem no one had written about.',
            },
            {
              id: 'antiseptic',
              statement: 'Before removing it,',
              emphasis: 'Bradmore washed the wound with wine and treated it with honey.',
              detail: 'Wine acted as an antiseptic and honey helped clean the wound — though Bradmore had no idea why either worked. He knew, from experience, that they helped.',
            },
            {
              id: 'recovery',
              statement: 'The prince survived,',
              emphasis: 'recovering over several weeks — though the scar stayed with him for life.',
              detail: 'Many soldiers with similar wounds died, not from the injury itself but from infection afterwards. This patient was one of the lucky ones.',
            },
          ],
          reflectionPrompt: "Bradmore had no university training in this. His tool, his wine, his honey — all came from practical experience treating soldiers, not from Galen's books. War created a space where practical skill counted more than ancient authority.",
        },
      ],
    },

    {
      type: 'matchingTask',
      stage: 'Prevention and care',
      label: 'Words from a medieval medicine chest',
      subject: 'History',
      title: 'Words from a medieval medicine chest',
      instruction: 'Match each term to its description.',
      weakAreaCategory: 'Medieval Medicine Key Concepts',
      backgroundImage: '/headers/history-medicine-medieval-scripture.png',
      pairs: [
        {
          id: 'apothecary',
          term: 'Apothecary',
          answer: 'Like a pharmacist — mixed and sold ready-made herbal remedies; disliked by physicians as cheaper competition.',
          weakGroup: 'People',
        },
        {
          id: 'vademecum',
          term: 'Vademecum',
          answer: 'A book of diagnoses that a physician carried with them.',
          weakGroup: 'Tools and methods',
        },
        {
          id: 'lazar-house',
          term: 'Lazar House',
          answer: 'A separate hospital for people with leprosy, run by the Church.',
          weakGroup: 'Hospitals',
        },
        {
          id: 'endowment',
          term: 'Endowment',
          answer: "Money left in a wealthy person's will to help fund a hospital.",
          weakGroup: 'Hospitals',
        },
        {
          id: 'rakers',
          term: 'Rakers',
          answer: 'Workers paid by a town to clear the streets of waste — there were 12 in London by 1370.',
          weakGroup: 'Public health',
        },
        {
          id: 'theriaca',
          term: 'Theriaca',
          answer: 'A herbal remedy made from many different spices, used to treat almost any illness.',
          weakGroup: 'Treatments',
        },
        {
          id: 'trepanning',
          term: 'Trepanning',
          answer: 'Drilling a hole in the skull — originally to release demons believed to cause mental illness.',
          weakGroup: 'Treatments',
        },
      ],
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
      stage: 'How much did medicine change?',
      label: 'Common traps',
      kicker: 'Before the big essay',
      heading: 'Three statements. Look closely.',
      sub: 'Each one sounds true. Decide before you read on.',
      blocks: [
        {
          type: 'misconceptionCheck',
          statements: [
            {
              statement: 'Hippocrates invented the Theory of Opposites.',
              answer: false,
              reveal: 'Hippocrates created the Theory of the Four Humours — the idea that the body contains four substances that must stay balanced. It was Galen, writing centuries later, who built on this and added the Theory of Opposites.',
              examTrap: 'Mixing up Hippocrates and Galen is one of the most common errors in this topic. If a question names a theory, check which physician it belongs to before you write.',
            },
            {
              statement: 'Medieval hospitals existed to cure the sick.',
              answer: false,
              reveal: 'Most hospitals offered "care, not cure" — food, warmth, clean bedding and prayer. Patients with infectious or terminal illnesses were often turned away, because the hospital had nothing it could do for them.',
              examTrap: 'If a question asks about the purpose of medieval hospitals, "curing illness" is the wrong answer. The correct framing is care, charity and religious duty.',
            },
            {
              statement: 'Bloodletting and purging were known to be useless, even at the time.',
              answer: false,
              reveal: 'To medieval doctors, bloodletting and purging looked like they worked. A patient who vomited or sneezed appeared to be expelling an excess humour — visible "evidence" the treatment was succeeding.',
              examTrap: "When a question asks why people used a treatment, don't answer as if they knew it was pointless. Explain why it seemed logical to them, based on what they could see.",
            },
          ],
        },
      ],
    },

    {
      type: 'conceptReveal',
      id: 'core-takeaway',
      stage: 'How much did medicine change?',
      tag: 'core-takeaway',
      label: 'So how much actually changed?',
      steps: [
        {
          mainText: 'Between 1250 and 1500, medical knowledge barely moved.',
          supportText: 'Every idea in this chapter — the Four Humours, miasma, astrology — was a logical response to the evidence people could see. Sneezing looked like the body curing itself. Disease really was worse near swamps and rubbish. These ideas made sense.',
        },
        {
          mainText: 'So why did these ideas survive for over a thousand years, unchanged?',
          supportText: "The Church controlled education, books and training. Physicians studied only Galen, because Galen was the only writer the Church approved. Dissection was banned — bodies had to stay whole for the soul — so no one could find evidence against Galen, even by accident.",
        },
        {
          mainText: "Even when evidence did contradict Galen, it didn't count.",
          supportText: 'On the rare occasions a dissection showed something Galen hadn\'t described, doctors explained it away as "an imperfect body" — not as a mistake in Galen\'s work. Authority came first. Evidence came second.',
        },
        {
          mainText: 'One area moved faster: surgery.',
          supportText: "John Bradmore's tool for removing an arrowhead came from battlefield experience, not a Church-approved textbook. War sat outside the university system — so practical skill could develop where ancient authority didn't reach.",
        },
        {
          mainText: "People weren't stupid. Their ideas were logical, given what they knew.",
          supportText: "What stopped medicine changing wasn't a shortage of good thinking — it was a shortage of permission to test it.",
        },
      ],
    },

    {
      type: 'quickRecall',
      stage: 'How much did medicine change?',
      label: 'Who said what?',
      questions: [
        {
          type: 'choice',
          question: 'Who developed the Four Humours theory?',
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

    {
      type: 'connectionMap',
      stage: 'How much did medicine change?',
      label: 'The web of medieval belief',
      title: 'The web of medieval belief',
      subtitle: 'Everything you need to explain why illness happened in medieval England',
      instruction: 'Tap each belief to consolidate your understanding',
      centreLabel: 'Why people got ill',
      nodes: [
        {
          id: 'supernatural',
          label: "God's punishment",
          shortLabel: "God's will",
          explanation: "Illness as divine punishment was the dominant explanation for most people. Sinful behaviour angered God, who sent disease as retribution. This made prayer, confession and pilgrimage — not medicine — the logical response.",
          retrievalQuestion: "Why did believing illness was God's punishment lead to prayer rather than treatment?",
          retrievalAnswer: "If the cause of illness was sin, removing the sin through prayer and confession was the logical cure — addressing the spiritual root, not the physical symptom.",
        },
        {
          id: 'astrology',
          label: 'Stars and planets',
          shortLabel: 'Astrology',
          explanation: "Physicians believed the alignment of celestial bodies controlled bodily health. Doctors consulted zodiac charts before bloodletting or prescribing. The Black Death of 1348 was partly blamed on a conjunction of Saturn, Jupiter and Mars in 1345.",
          retrievalQuestion: 'Why did medieval doctors use zodiac charts?',
          retrievalAnswer: "They believed planetary positions controlled the humours and which body parts could be safely treated on different days — consulting the chart was part of diagnosis.",
        },
        {
          id: 'humours',
          label: 'Four humours',
          shortLabel: 'Humours',
          explanation: "Galen's theory of the four humours — blood, phlegm, yellow bile and black bile — was the dominant rational explanation for disease. Illness meant the humours were out of balance; treatment aimed to restore equilibrium through bloodletting, purging, vomiting or dietary change.",
          retrievalQuestion: 'Name the four humours.',
          retrievalAnswer: 'Blood, phlegm, yellow bile and black bile.',
        },
        {
          id: 'miasma',
          label: 'Bad air (miasma)',
          shortLabel: 'Bad air',
          explanation: "Miasma theory held that foul-smelling air caused disease. People carried posies of herbs, burned aromatics and avoided marshy areas. Miasma theory actually produced some public health benefits — clearing rubbish reduced disease even though the reasoning was wrong.",
          retrievalQuestion: 'How did miasma theory accidentally improve public health?',
          retrievalAnswer: "Removing foul-smelling rubbish and waste — done to remove 'bad air' — actually reduced real disease vectors (rats, contaminated water, flies) even though the reasoning was mistaken.",
        },
        {
          id: 'galen',
          label: "Galen's authority",
          shortLabel: 'Galen',
          explanation: "Galen's writings were endorsed by the Church as truth. Medical schools taught only his texts. Challenging Galen risked punishment. His authority meant medical ideas were frozen for over 1,000 years.",
          retrievalQuestion: "Why was it dangerous for medieval doctors to challenge Galen?",
          retrievalAnswer: "The Church endorsed Galen's ideas — questioning them was tantamount to questioning the Church, risking punishment and loss of livelihood.",
        },
        {
          id: 'experience',
          label: 'Practical experience',
          shortLabel: 'Folk cures',
          explanation: "Outside the physician-dominated world, wise women, apothecaries and housewives used centuries of accumulated herbal knowledge. Some genuinely worked: willow bark contains salicin, a compound related to modern aspirin. This practical layer of medicine coexisted with all the theories above.",
          retrievalQuestion: 'Why did some herbal remedies work even though their users had no understanding of disease?',
          retrievalAnswer: 'Some plants contain pharmacologically active compounds — willow bark contains salicin (related to aspirin), and garlic has mild antimicrobial properties — so the remedies worked through chemistry, not theory.',
        },
      ],
    },

    {
      type: 'examinerExplains',
      stage: 'Exam prep',
      label: 'What the examiner rewards',
      examinerExplains: {
        opening: "Here's what examiners actually reward.",
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
            body: "Show the full chain: Galen argued illness = imbalance of humours → treatment must restore balance → bloodletting follows logically. That reasoning is what earns marks.",
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
      type: 'guidedExamResponse',
      stage: 'Exam prep',
      label: 'Write the big essay',
      exam: {
        board: 'edexcel',
        subject: 'history',
        topic: 'medieval-medicine',
        beatText: 'One last test. The biggest question in this chapter.',
        question: '"The role of the Church was the main reason why there was little change in care and treatment in the years c1250–c1500." How far do you agree? Explain your answer. (16 marks)',
        marks: 16,
        sections: [
          {
            label: 'Agree — the Church controlled medicine',
            starter: 'The Church was the main reason for the lack of change because...',
            placeholder: '...it controlled medical training, so physicians studied only Galen for over 1,000 years. It also banned dissection, which meant...',
          },
          {
            label: 'Disagree — other factors mattered too',
            starter: 'However, the Church was not the only reason, because...',
            placeholder: '...most people were treated at home using herbal remedies, which had little link to the Church. Also, some change did happen outside Church control — for example...',
          },
          {
            label: 'Your judgement',
            starter: 'Overall, I think the Church...',
            placeholder: '...was / was not the main reason, because... [give your overall judgement and back it up with your strongest point]',
          },
        ],
        markScheme: `Total: 16 marks (AO1: 6, AO2: 10) — assesses analysis and judgement of how far the Church's role explains the lack of change in care and treatment, c1250–c1500.

Stimulus points given in the exam: medical training; herbal remedies.

FOR — the Church was the main reason:
- The Church controlled medical training: universities taught only Galen's ideas, approved because they fitted belief in the soul.
- Because training stayed Galen-based, physicians kept using bleeding, purging and the Theory of Opposites for over 1,000 years.
- The Church taught that illness was sent by God as punishment for sin, which discouraged the search for other causes.
- Church-run hospitals focused on "care not cure" — prayer and charity, not medical treatment.
- The Church banned dissection, so no anatomical evidence could ever challenge Galen.

AGAINST — other factors also explain the lack of change:
- Most people were treated at home, mainly by women using herbal remedies — this had no direct link to the Church.
- Some herbal remedies genuinely worked for minor illness, regardless of what the Church taught.
- The scientific method needed to test or disprove old ideas did not exist yet — the Church didn't need to block progress that wasn't possible anyway.
- Apothecaries sold remedies based on physicians' ideas — a knock-on effect of medical training, not something the Church controlled directly.
- Some practical progress did happen outside Church control — for example wartime surgery (John Bradmore) and town public health measures (London's rakers, Edward III's 1352 law).

LEVEL DESCRIPTORS:
Level 1 (1-4 marks): Simple or generalised statements, little development. A judgement may be missing or simply asserted without support.
Level 2 (5-8 marks): Some analysis, but development is limited and reasoning is not sustained. A judgement is given but not well supported. CAPPED AT 7/16 if the answer does not go beyond the stimulus points (medical training, herbal remedies).
Level 3 (9-12 marks): Sustained analysis focused on the question, generally well-reasoned. A judgement is given and justified, though some of the reasoning behind it may be implicit. CAPPED AT 11/16 if the answer does not go beyond the stimulus points.
Level 4 (13-16 marks): Consistent, coherent and sustained analytical reasoning throughout, with wide-ranging and precisely selected own knowledge. A judgement is reached and fully justified by the analysis. Level 4 is not available unless the answer goes beyond the stimulus points — own additional knowledge is essential.

Strong Level 4 conclusion: the Church was the dominant reason physician-led medicine stayed the same — but most medieval healthcare happened outside that system entirely, in homes and via apothecaries, where the Church's control was weaker or absent. The strongest answers separate "why did physician-led treatment stay the same" (Church-dominated) from "why did medicine in general barely change" (the Church, plus the simple absence of any alternative way of testing ideas).`,
      },
    },

  ],
}


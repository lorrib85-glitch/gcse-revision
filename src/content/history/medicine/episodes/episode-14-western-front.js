// Episode file — owns the runtime teaching sequence for one episode.
//
// Actual image files live in public/figures/history/medicine/western-front/.
// Asset path resolution lives in src/content/history/medicine/assets.js.
// Canonical content + architecture docs live in docs/content/history/medicine/.

export default {
  id: 'history-medicine-western-front',
  subject: 'History',
  number: 14,
  title: 'Hell in the trenches',
  subtitle: 'Medicine on the Western Front',
  era: 'c.1914–c.1918',
  icon: '⚔️',
  color: '#5A6A4A',
  colorLight: 'rgba(90,106,74,.12)',
  series: 'medicine-through-time',
  recallTags: [],
  examTags: [],
  assetKeys: [],

  hook: {
    statement: 'The Thomas splint was invented during the First World War.',
    isTrue: false,
    accentWords: ['First World War'],
    backgroundImage: '/figures/history/medicine/western-front/trench-soldiers.png',
    explanation: 'False. The Thomas splint was designed before the war by Hugh Owen Thomas. What changed during the First World War was its use. Sir Robert Jones championed it on the Western Front, and it helped reduce deaths from fractured femurs from about 80% to about 20%.',
    revealBeats: [
      'It was not invented in the trenches.',
      'It already existed before the war.',
      'The war made doctors use it at scale.',
      'That is the real story of Western Front medicine:',
      'old ideas, new urgency, huge consequences.',
    ],
  },

  outcomes: {
    bullets: [
      { text: 'Why the Western Front was such a difficult place to treat wounds', icon: 'war-conflict' },
      { text: 'How the chain of evacuation moved wounded soldiers from trench to hospital', icon: 'journey' },
      { text: 'How Thomas splints, blood transfusions, X-rays and plastic surgery changed treatment', icon: 'science' },
      { text: 'How to answer Western Front source questions in the exam', icon: 'exam' },
    ],
  },

  stageNavigation: [
    { id: 'part-1', title: 'Medicine Under Fire', description: 'Intro recall and roadmap.', screenIndex: 0 },
    { id: 'part-2', title: 'Why the Western Front Was So Deadly', description: 'Trench conditions and medical challenges.', screenIndex: 1 },
    { id: 'part-3', title: 'From Trench to Treatment', description: 'The evacuation chain from frontline to base hospital.', screenIndex: 4 },
    { id: 'part-4', title: 'New Problems, New Methods', description: 'Medical breakthroughs driven by wartime need.', screenIndex: 6 },
    { id: 'part-5', title: 'War Speeds Up Medicine', description: 'Source skills and the long-term impact of war on medicine.', screenIndex: 10 },
    { id: 'part-6', title: 'Exam Prep: Historic Environment Mastery', description: 'Examiner technique for Q1, Q2(a) and Q2(b).', screenIndex: 13 },
  ],

  screens: [

    // ── Section 1: Intro / Recall / Roadmap ──────────────────────────────────

    {
      type: 'priorKnowledgeRecall',
      tag: 'prior-knowledge-western-front',
      chapterTitle: 'Surgery and medicine before the First World War',
      recallPrompts: ['Surgery', 'Anaesthetics', 'Antiseptics', 'Blood loss', 'War'],
      backgroundImage: '/figures/history/medicine/western-front/trench-soldiers.png',
      sourceContent: `GCSE History: Medicine on the Western Front — Prior Knowledge

Before the Western Front, surgery had improved significantly since the mid-nineteenth century.

Key developments before 1914:
- Anaesthetics: Ether used by Morton in 1846; chloroform used by Simpson. Anaesthetics reduced pain and allowed longer, more complex surgery.
- Antiseptic surgery: Joseph Lister developed antiseptic techniques using carbolic acid in the 1860s. Infection rates fell. Aseptic surgery (creating sterile environments) developed further.
- Germ theory: Pasteur (1861) and Koch identified bacteria as causes of specific diseases. This changed how doctors understood infection.
- Blood loss: Despite improvements, blood loss remained a major problem in surgery. Transfusions were only possible if a donor was present.
- X-rays: Wilhelm Röntgen discovered X-rays in 1895. By 1914 they were used in hospitals to locate bullets and fractures.

War as an agent of change:
War creates urgent demand for faster, better treatment. The First World War produced enormous numbers of wounded men with injuries on a scale doctors had not faced before: broken bones, blood loss, gas attacks, infections, facial injuries, and shell shock.`,
      concepts: [
        { tag: 'anaesthetics',       label: 'Anaesthetics reduced pain in surgery' },
        { tag: 'antiseptic-surgery', label: 'Lister and antiseptic surgery reduced infection' },
        { tag: 'bleeding-problem',   label: 'Blood loss was still a major surgery problem' },
        { tag: 'penicillin',         label: 'Penicillin became important later through wartime mass production' },
        { tag: 'war-agent-change',   label: 'War can speed up medical change' },
      ],
    },

    // ── Section 2: The Western Front and trench conditions ───────────────────

    {
      type: 'visualLearning',
      tag: 'western-front-context',
      stage: 'The Western Front',
      label: 'The Western Front',
      scenes: [
        {
          image: '/figures/history/medicine/western-front/trench-soldiers.png',
          headline: 'A line of trenches across Europe',
          body: 'The Western Front stretched across northern France and Belgium. British, French, Belgian and allied forces faced German forces across a huge trench system.',
        },
        {
          image: '/figures/history/medicine/western-front/trench-soldiers.png', // TODO: /figures/history/medicine/western-front/trench-system.webp
          headline: 'The trench system',
          body: 'Soldiers did not just live in one trench. There were front line trenches, support trenches about 60–90 metres behind, reserve trenches, and communication trenches linking them.',
        },
        {
          image: '/figures/history/medicine/western-front/stretcher-bearers.png', // TODO: /figures/history/medicine/western-front/wounded-evacuation.webp
          headline: 'Medicine under pressure',
          body: 'Machine guns, artillery, gas attacks and shrapnel created injuries on a scale doctors had never faced before.',
        },
        {
          image: '/figures/history/medicine/western-front/ramc-aid-post.png', // TODO: /figures/history/medicine/western-front/medical-post.webp
          headline: 'The core problem',
          body: 'How do you treat thousands of wounded men in mud, cold, shellfire and chaos?',
        },
        {
          finalReveal: true,
          headline: 'The Western Front was medicine under impossible conditions.',
          body: 'Every improvement was forced by an emergency that could not wait.',
        },
      ],
    },

    {
      type: 'collectionExplorer',
      tag: 'trench-conditions',
      stage: 'Trench conditions',
      id: 'trench-conditions-explorer',
      label: 'What made treatment so difficult?',
      title: 'What made treatment so difficult?',
      description: 'The trenches did not just create wounds. They created disease, infection and mental trauma. Tap each to find out more.',
      backgroundImage: '/figures/history/medicine/western-front/trench-soldiers.png',
      synthesis: {
        heading: 'Three types of problem',
        points: [
          'Weapons caused direct injuries: shrapnel, gas attacks, bullets, head wounds.',
          'Living conditions caused disease: trench foot and trench fever from mud, cold and lice.',
          'Psychological trauma caused shell shock — which was poorly understood and barely treated.',
        ],
        examTakeaway: 'The trenches made medicine harder in three ways: more injuries, dirtier wounds, and slower evacuation. Shell shock is the key limitation point for any "how much did medicine improve?" question.',
      },
      items: [
        {
          id: 'trench-foot',
          x: 18, y: 28,
          label: 'Trench foot',
          reveals: [
            { text: 'Standing for days in cold, wet mud could damage soldiers\' feet.' },
            { text: 'Severe cases developed gangrene and sometimes needed amputation.' },
            { text: 'Prevention included rubbing whale oil on feet and regular foot inspections by medical officers.' },
          ],
        },
        {
          id: 'trench-fever',
          x: 60, y: 28,
          label: 'Trench fever',
          reveals: [
            { text: 'Body lice spread trench fever. It caused flu-like symptoms and weakened soldiers for weeks.' },
            { text: 'It was not usually fatal, but it kept thousands of men away from fighting.' },
            { text: 'Exam point: this shows how living conditions created medical problems, not just weapons.' },
          ],
        },
        {
          id: 'shell-shock',
          x: 18, y: 52,
          label: 'Shell shock',
          reveals: [
            { text: 'Constant bombardment, fear and trauma caused symptoms such as anxiety, nightmares, tremors and paralysis.' },
            { text: 'Some soldiers were court-martialled before shell shock was gradually recognised as a medical condition.' },
            { text: 'Exam point: shell shock is the key limitation — it shows psychological trauma was still not well understood.' },
          ],
        },
        {
          id: 'gas-attacks',
          x: 60, y: 52,
          label: 'Gas attacks',
          reveals: [
            { text: 'Chlorine, phosgene and mustard gas could cause burns, blindness and lung damage.' },
            { text: 'Gas masks were developed as protection — showing how new weapons forced new medical responses.' },
            { text: 'Mustard gas was the most feared: it penetrated clothing and caused blisters, blindness and internal damage.' },
          ],
        },
        {
          id: 'shrapnel',
          x: 18, y: 75,
          label: 'Shrapnel wounds',
          reveals: [
            { text: 'Artillery and high-velocity bullets caused deep, dirty wounds.' },
            { text: 'Mud and bacteria made infection more likely. Tetanus and gas gangrene were serious risks.' },
            { text: 'The combination of industrial weapons and muddy conditions made infection far worse than in earlier wars.' },
          ],
        },
        {
          id: 'head-injuries',
          x: 60, y: 75,
          label: 'Head and facial injuries',
          reveals: [
            { text: 'Steel helmets were introduced in 1915 and reduced skull deaths, but brain and facial injuries remained common.' },
            { text: 'Specialist units developed to treat head and facial wounds — eventually leading to plastic surgery.' },
            { text: 'Harold Gillies developed new skin graft techniques at Queen Mary\'s Hospital, Sidcup to treat severe facial injuries.' },
          ],
        },
      ],
    },

    {
      type: 'quickRecall',
      tag: 'trench-conditions-recall',
      stage: 'Trench conditions',
      label: 'Trench conditions — quick check',
      questions: [
        {
          type: 'choice',
          question: 'What caused trench foot?',
          options: [
            'Standing for long periods in cold, wet conditions',
            'Breathing mustard gas',
            'Eating contaminated food',
            'Blood loss after surgery',
          ],
          correct: 0,
          explanation: 'Trench foot was caused by cold, wet conditions. Severe cases could lead to gangrene and amputation.',
        },
        {
          type: 'choice',
          question: 'What spread trench fever?',
          options: [
            'Mosquitoes',
            'Body lice',
            'Dirty surgical tools',
            'Gas masks',
          ],
          correct: 1,
          explanation: 'Trench fever was spread by body lice and caused flu-like symptoms.',
        },
        {
          type: 'choice',
          question: 'Why is shell shock a useful limitation point in exam answers?',
          options: [
            'It was completely cured by 1918',
            'It showed that some conditions were still poorly understood',
            'It only affected officers',
            'It was caused by infected wounds',
          ],
          correct: 1,
          explanation: 'Shell shock was gradually recognised, but it was poorly understood and treatment was limited.',
        },
        {
          type: 'choice',
          question: 'Which weapon caused burns, blindness and lung damage?',
          options: [
            'Machine guns',
            'Mustard gas',
            'Rifles',
            'Steel helmets',
          ],
          correct: 1,
          explanation: 'Gas attacks, including mustard gas, could damage the lungs, eyes and skin.',
        },
        {
          type: 'choice',
          question: 'Why did muddy conditions make wounds more dangerous?',
          options: [
            'They made soldiers sleep more',
            'They contaminated wounds with bacteria',
            'They stopped soldiers feeling pain',
            'They made gas masks useless',
          ],
          correct: 1,
          explanation: 'Mud and bacteria increased the risk of infection, including tetanus and gas gangrene.',
        },
      ],
    },

    // ── Section 3: Chain of evacuation ──────────────────────────────────────

    {
      type: 'timelineChain',
      variant: 'reveal',
      tag: 'chain-of-evacuation',
      stage: 'Chain of evacuation',
      label: 'From trench to hospital',
      title: 'From trench to hospital',
      intro: 'A wounded soldier did not go straight to a hospital — he moved through a chain of evacuation, five stages, each one further from the fighting.',
      steps: [
        {
          id: 'stretcher-bearers',
          statement: 'Stretcher bearers',
          detail: 'Stretcher bearers carried wounded men from the front line. This was dangerous, slow and physically exhausting, especially under shellfire and through mud.',
        },
        {
          id: 'rap',
          statement: 'Regimental Aid Post (RAP)',
          detail: 'The RAP was close to the front line, staffed by a medical officer. It gave basic first aid. Minor wounds could be treated so the soldier returned to fight. Serious cases were sent further back.',
        },
        {
          id: 'dressing-station',
          statement: 'Advanced / Main Dressing Station',
          detail: 'About 400 metres behind the line. Treated more serious injuries in tents or abandoned buildings. Staffed by medical officers, orderlies and stretcher bearers.',
        },
        {
          id: 'ccs',
          statement: 'Casualty Clearing Station (CCS)',
          detail: 'Larger field hospitals, often near railways. Performed most surgery on the Western Front. Sorted patients by urgency — this is called triage.',
        },
        {
          id: 'base-hospital',
          statement: 'Base Hospital',
          detail: 'Base hospitals were on the French coast. They provided longer-term treatment and could send soldiers back to Britain.',
        },
      ],
      takeaway: 'Exam warning: Q1 often asks for two features of a stage in this chain. You need precise details — not vague comments.',
    },

    {
      type: 'orderedRouteTask',
      tag: 'chain-of-evacuation-recall',
      stage: 'Chain of evacuation',
      label: 'Rebuild the evacuation chain',
      subject: 'History',
      title: 'Rebuild the evacuation chain',
      titleHighlight: 'evacuation chain',
      subtitle: 'Tap a job, then choose its stage.',
      prompt: 'Where did this happen?',
      weakGroup: 'Evacuation chain',
      completionText: 'Five stages, each one further from the fighting. Q1 often asks for two features of one stage — precise details like these win the marks.',
      backgroundImage: '/headers/history-medicine-trenches.png',
      stages: [
        {
          id: 's-bearers',
          icon: 'helmet',
          title: 'Stretcher bearers',
          clue: 'From the front line',
          answerId: 'a-bearers',
        },
        {
          id: 's-rap',
          icon: 'cross',
          title: 'Regimental Aid Post',
          clue: 'Close to the front',
          answerId: 'a-rap',
        },
        {
          id: 's-ads',
          icon: 'hut',
          title: 'Advanced / Main Dressing Station',
          clue: 'About 400 metres back',
          answerId: 'a-ads',
        },
        {
          id: 's-ccs',
          icon: 'train',
          title: 'Casualty Clearing Station',
          clue: 'Near railways',
          answerId: 'a-ccs',
        },
        {
          id: 's-base',
          icon: 'ship',
          title: 'Base Hospital',
          clue: 'On the French coast',
          answerId: 'a-base',
        },
      ],
      answers: [
        { id: 'a-bearers', text: 'First to reach the wounded, carrying them out through mud and shellfire' },
        { id: 'a-rap',     text: 'Gave basic first aid so minor wounds could return to the fight' },
        { id: 'a-ads',     text: 'Treated more serious injuries in tents and abandoned buildings' },
        { id: 'a-ccs',     text: 'Performed most surgery on the Western Front and sorted the wounded by triage' },
        { id: 'a-base',    text: 'Gave longer-term treatment and sent the most serious cases back to Britain' },
      ],
    },

    // ── Section 4: Medical developments ─────────────────────────────────────

    {
      type: 'visualLearning',
      tag: 'medical-developments',
      stage: 'Medical developments',
      label: 'Breakthroughs and limits',
      scenes: [
        {
          image: '/figures/history/medicine/western-front/trench-soldiers.png',
          headline: 'War created the problem',
          body: 'The Western Front produced huge numbers of wounded men with broken bones, blood loss, infections, shrapnel wounds and facial injuries.',
        },
        {
          image: '/figures/history/medicine/western-front/ramc-aid-post.png',
          headline: 'Doctors had to adapt',
          body: 'Battlefield medicine developed because old methods were not enough for industrial-scale war.',
        },
        {
          image: '/figures/history/medicine/western-front/ramc-aid-post.png',
          headline: 'Four developments mattered most',
          body: 'Thomas splints, blood transfusions, mobile X-rays and plastic surgery all improved treatment.',
        },
        {
          image: '/figures/history/medicine/western-front/trench-soldiers.png',
          headline: 'But progress was uneven',
          body: 'Some problems improved dramatically. Others, like shell shock, remained poorly understood.',
        },
        {
          finalReveal: true,
          headline: 'The Western Front shows both progress and limitation.',
          body: 'A strong exam answer always needs both sides.',
        },
      ],
    },

    {
      tag: 'thomas-splint',
      stage: 'Medical developments',
      label: 'The splint that saved thousands',
      kicker: 'Thomas splint',
      heading: 'The splint that saved thousands',
      sub: 'A fractured femur was a death sentence — until doctors used this.',
      blocks: [
        {
          type: 'explainReveal',
          intro: 'A fractured femur — a broken thigh bone — was one of the deadliest injuries on the Western Front. Here is how one existing device changed the death rate dramatically.',
          atmosphereImage: '/figures/history/medicine/western-front/ramc-aid-post.png',
          steps: [
            {
              id: 'problem',
              statement: 'The problem:',
              emphasis: 'moving a soldier with a fractured femur caused more damage and severe blood loss.',
              detail: 'Before systematic treatment, around 80% of soldiers with fractured femurs died.',
            },
            {
              id: 'solution',
              statement: 'The Thomas splint',
              emphasis: 'kept the leg completely still during evacuation.',
              detail: 'It reduced movement, bleeding and further damage. It could be applied in the field and used throughout the chain of evacuation.',
            },
            {
              id: 'result',
              statement: 'The result:',
              emphasis: 'deaths from fractured femurs fell from about 80% to about 20%.',
              detail: 'This is one of the clearest measurable improvements in Western Front medicine.',
            },
            {
              id: 'key-point',
              statement: 'The sophistication point:',
              emphasis: 'the splint was not invented during the war.',
              detail: 'Hugh Owen Thomas designed it before the war. Sir Robert Jones championed its use on the Western Front. This shows war accelerating the use of an existing idea — not creating a new one.',
            },
            {
              id: 'exam-angle',
              statement: 'Exam angle:',
              emphasis: '80% → 20% is the most powerful statistic in this module.',
              detail: 'Use it to show measurable progress. Then show sophistication by noting the splint already existed — war changed the scale of use, not the invention.',
            },
          ],
          reflectionPrompt: 'The Thomas splint shows war as an agent of change — not by inventing new medicine, but by forcing doctors to use existing medicine at scale.',
        },
      ],
    },

    {
      tag: 'blood-transfusions',
      stage: 'Medical developments',
      label: 'The beginning of blood banks',
      kicker: 'Blood transfusions',
      heading: 'The beginning of blood banks',
      sub: 'Blood loss killed thousands. Storing blood changed everything.',
      blocks: [
        {
          type: 'explainReveal',
          intro: 'Before the war, blood loss was still one of surgery\'s biggest unsolved problems. The Western Front forced a breakthrough.',
          atmosphereImage: '/figures/history/medicine/western-front/ramc-aid-post.png',
          steps: [
            {
              id: 'old-problem',
              statement: 'The old problem:',
              emphasis: 'blood loss was still a major killer even after anaesthetics and antiseptics improved surgery.',
              detail: 'Surgeons could operate without pain and infection, but could not replace the blood patients lost.',
            },
            {
              id: 'early-transfusions',
              statement: 'Early transfusions',
              emphasis: 'usually needed a donor to be present.',
              detail: 'Blood was transferred using a syringe and tube. This was slow and impractical on a battlefield.',
            },
            {
              id: 'breakthrough',
              statement: 'Scientists including Lewisohn, Weil, Rous and Turner',
              emphasis: 'developed methods for storing blood outside the body.',
              detail: 'Adding sodium citrate prevented blood from clotting. This made storage possible.',
            },
            {
              id: 'cambrai',
              statement: 'Lawrence Robertson pioneered blood transfusions on the Western Front.',
              emphasis: 'A blood depot was set up before the Battle of Cambrai in 1917.',
              detail: 'Doctors could now prepare stored blood before a battle — not just react to casualties after they arrived.',
            },
            {
              id: 'significance',
              statement: 'Why it mattered:',
              emphasis: 'stored blood meant doctors could treat large numbers of casualties far more quickly.',
              detail: 'This was the beginning of blood banking — a system that later made complex surgery and organ transplants possible.',
            },
            {
              id: 'legacy',
              statement: 'The long-term legacy:',
              emphasis: 'blood banks that developed from Western Front necessity became a permanent part of modern medicine.',
              detail: 'The Western Front helped solve one of surgery\'s oldest problems: how to replace blood lost during treatment.',
            },
          ],
          reflectionPrompt: 'Key names: Lawrence Robertson (pioneered transfusions on the Western Front); Lewisohn, Weil, Rous, Turner (developed storage methods). Key date: Cambrai, 1917.',
        },
      ],
    },

    {
      tag: 'medical-developments-recall',
      stage: 'Medical developments',
      label: 'Progress or problem?',
      kicker: 'True or false?',
      heading: 'Progress or problem?',
      sub: 'Western Front medicine improved quickly — but not everything was solved.',
      blocks: [
        {
          type: 'misconceptionCheck',
          statements: [
            {
              statement: 'Mobile X-rays helped doctors locate bullets and shrapnel without exploratory surgery.',
              answer: true,
              reveal: 'True. Mobile X-rays improved diagnosis close to the front line and reduced the need for exploratory operations.',
              examTrap: 'Mobile X-rays are often left out of lists of Western Front improvements. Always include them alongside the Thomas splint and blood transfusions.',
            },
            {
              statement: 'Harold Gillies helped develop plastic surgery for facial injuries.',
              answer: true,
              reveal: 'True. Gillies developed skin graft techniques at Queen Mary\'s Hospital, Sidcup, treating soldiers with severe facial injuries.',
              examTrap: 'If you mention plastic surgery in an exam, add the location: Queen Mary\'s Hospital, Sidcup. It shows precise knowledge.',
            },
            {
              statement: 'The Thomas splint was invented during the First World War.',
              answer: false,
              reveal: 'False. It was designed before the war by Hugh Owen Thomas. Sir Robert Jones championed its use on the Western Front.',
              examTrap: 'Examiners test this directly. The improvement was in scale of use — not invention. This distinction is important for "explain why" questions.',
            },
            {
              statement: 'Blood transfusions were straightforward from the start of the war.',
              answer: false,
              reveal: 'False. At first, donors had to be present. Blood storage was a wartime breakthrough developed by scientists including Lewisohn, Weil, Rous and Turner, with Robertson pioneering its use on the Front.',
              examTrap: 'Avoid saying blood transfusions "just got better" — explain the specific step change: storage made it possible to prepare blood in advance of casualties.',
            },
            {
              statement: 'Shell shock was fully understood and well treated by 1918.',
              answer: false,
              reveal: 'False. Shell shock was gradually recognised as real, but treatment was limited and some soldiers were court-martialled for symptoms caused by the condition.',
              examTrap: 'Shell shock is the key "limitation" point for this topic. Always include it in answers about what medicine did NOT achieve on the Western Front.',
            },
            {
              statement: 'The Western Front shows war acting as an agent of medical change.',
              answer: true,
              reveal: 'True. The scale of casualties forced faster innovation in evacuation, surgery, transfusion and specialist treatment.',
              examTrap: 'When using "war as an agent of change", be specific. Name what war created pressure for: Thomas splints, blood storage, the evacuation chain.',
            },
          ],
        },
      ],
    },

    // ── Section 5: Source skills ─────────────────────────────────────────────

    {
      type: 'visualLearning',
      tag: 'source-utility',
      stage: 'Source skills',
      label: 'How to judge source utility',
      scenes: [
        {
          image: '/figures/history/medicine/western-front/trench-soldiers.png',
          headline: 'The Western Front is different',
          body: 'This is the only Medicine module where the exam uses sources. Q2(a) asks how useful two sources are for an enquiry into a specific aspect of the Western Front.',
        },
        {
          image: '/figures/history/medicine/western-front/ramc-aid-post.png',
          headline: 'Three things a strong answer needs',
          body: 'Content: what does the source actually show or say?\nProvenance: who made it, when, and why?\nContextual knowledge: what do you know that supports, challenges or adds to the source?',
        },
        {
          image: '/figures/history/medicine/western-front/stretcher-bearers.png',
          headline: 'Generic provenance does not score well',
          body: 'Weak: "It is useful because it is from the time."\n\nBetter: "It is useful because it was written by a surgeon working on the Western Front, so the writer had direct medical experience."',
        },
        {
          image: '/figures/history/medicine/western-front/ramc-aid-post.png',
          headline: 'Common source types in this topic',
          body: 'Private diary: honest but limited to one person\'s experience.\nOfficial army record: precise details but may omit failures.\nPhotograph: real conditions but could be staged.\nMedical report: expert and detailed but focused on clinical evidence.',
        },
        {
          finalReveal: true,
          headline: 'Content + provenance + contextual knowledge = utility.',
          body: 'Use all three every time. Then add a limitation.',
        },
      ],
    },

    {
      type: 'conceptReveal',
      tag: 'source-follow-up',
      stage: 'Source skills',
      label: 'How to answer Q2(b)',
      steps: [
        {
          mainText: 'Q2(b) asks how you would follow up a source to find out more.',
          supportText: 'This is a technique question worth 4 marks. It has four linked parts.',
        },
        {
          mainText: 'Select a specific detail from the source.',
          supportText: 'Pick one thing the source shows or says — not a vague summary of the whole thing.',
        },
        {
          mainText: 'Turn that detail into a focused enquiry question.',
          supportText: 'Ask a question that the detail raises but does not fully answer.',
        },
        {
          mainText: 'Name the source type you would use next.',
          supportText: 'Be specific: army medical records, surgical reports, RAMC records — not "the internet" or "another source".',
        },
        {
          mainText: 'Explain how that source would help answer your question.',
          supportText: 'Link it directly to your enquiry question — what could it tell you that the original source cannot?',
        },
        {
          mainText: 'Detail: "I could only transfuse an occasional patient."',
          supportText: 'Question: Why were blood transfusions difficult to carry out on the Western Front?\nSource type: Army medical records about blood transfusions in 1917.\nHow it helps: They could show how often transfusions were used, what equipment was available, and whether blood storage had improved by that stage of the war.',
        },
      ],
    },

    {
      type: 'quickRecall',
      tag: 'western-front-core-recall',
      stage: 'Core recall',
      label: 'Western Front — core recall',
      questions: [
        {
          type: 'choice',
          question: 'Where was the Western Front?',
          options: [
            'Northern France and Belgium',
            'Southern Italy and Greece',
            'Eastern Germany and Poland',
            'North Africa',
          ],
          correct: 0,
          explanation: 'The Western Front stretched across northern France and Belgium.',
        },
        {
          type: 'choice',
          question: 'Which stage of the chain of evacuation performed most surgery?',
          options: [
            'Regimental Aid Post',
            'Advanced Dressing Station',
            'Casualty Clearing Station',
            'Base Hospital',
          ],
          correct: 2,
          explanation: 'Casualty Clearing Stations performed most surgery and were often near railways.',
        },
        {
          type: 'choice',
          question: 'What did the Thomas splint help treat?',
          options: [
            'Fractured femurs',
            'Shell shock',
            'Trench fever',
            'Gas burns',
          ],
          correct: 0,
          explanation: 'The Thomas splint immobilised fractured femurs and helped reduce deaths from about 80% to about 20%.',
        },
        {
          type: 'choice',
          question: 'What happened before the Battle of Cambrai in 1917?',
          options: [
            'A blood depot was set up',
            'The NHS was founded',
            'Penicillin was mass produced',
            'The first vaccine was discovered',
          ],
          correct: 0,
          explanation: 'A blood depot before Cambrai showed that blood could be stored and prepared for large numbers of casualties.',
        },
        {
          type: 'choice',
          question: 'Which person is linked to plastic surgery and skin grafts?',
          options: [
            'Harold Gillies',
            'Edward Jenner',
            'Joseph Lister',
            'Louis Pasteur',
          ],
          correct: 0,
          explanation: 'Harold Gillies developed skin graft techniques for facial injuries at Queen Mary\'s Hospital, Sidcup.',
        },
        {
          type: 'choice',
          question: 'What are the three things needed to judge source utility?',
          options: [
            'Content, provenance and contextual knowledge',
            'Date, handwriting and spelling',
            'Cause, consequence and change',
            'Paragraphs, quotes and conclusion',
          ],
          correct: 0,
          explanation: 'For Q2(a), evaluate content, provenance and contextual knowledge.',
        },
        {
          type: 'choice',
          question: 'Why is shell shock an important limitation point?',
          options: [
            'It was fully cured by doctors',
            'It shows psychological trauma was still poorly understood',
            'It was caused by blood loss',
            'It only happened after the war',
          ],
          correct: 1,
          explanation: 'Shell shock was gradually recognised, but it was poorly understood and treatment remained limited.',
        },
        {
          type: 'choice',
          question: 'Which agent of change is most prominent in this module?',
          options: [
            'War',
            'Religion',
            'Chance',
            'The Church',
          ],
          correct: 0,
          explanation: 'War was the dominant agent of change because the scale of casualties forced faster medical innovation.',
        },
      ],
    },

    // ── Section 6: Summary & Examiner ────────────────────────────────────────

    {
      type: 'examinerExplains',
      tag: 'describe-two-features',
      stage: 'Exam prep',
      label: 'How to answer Q1',
      examinerExplains: {
        opening: 'Q1 is usually worth 4 marks. You need two features. Each feature needs a clear point and one supporting detail.',
        tips: [
          {
            heading: 'The formula',
            body: 'Feature + precise supporting detail = 2 marks. Do that twice = 4 marks. Keep each feature short and focused — one idea only.',
          },
          {
            heading: 'Worked example: dressing stations',
            body: 'Feature 1: Dressing stations were usually behind the front line. Detail: ADS/MDS sites were around 400 metres behind the line, in tents or abandoned buildings.\n\nFeature 2: They treated and sorted wounded soldiers. Detail: Minor injuries could be treated, while serious cases were sent further down the chain to Casualty Clearing Stations.',
          },
          {
            heading: 'Common mistake',
            body: 'Do not give two details about the same feature and call them two features.\n\nWeak: "Dressing stations were in tents. Dressing stations were in abandoned buildings."\n\nBetter: Feature 1 — they were behind the line. Feature 2 — they treated and sorted injuries.',
          },
          {
            heading: 'Use precise evidence',
            body: 'Vague: "Soldiers were treated there."\nPrecise: "Minor injuries were treated and the soldier returned to duty, while serious cases were sent to Casualty Clearing Stations for surgery."',
          },
        ],
        closing: 'Two features. Two precise details. Four marks.',
      },
    },

    {
      type: 'faceExaminer',
      tag: 'describe-two-features',
      stage: 'Exam prep',
      label: 'Face the examiner — Q1',
      examiner: {
        type: '4-mark-describe',
        board: 'edexcel',
        subject: 'history',
        topic: 'western-front',
        difficulty: 'standard',

        question: 'Describe two features of blood transfusions on the Western Front. [4 marks]',
        marks: 4,
        mark: 2,
        summary: 'A partial answer. It mentions one correct feature but only vaguely — no supporting detail. The second feature is missing.',

        markScheme: `Award 2 marks for each developed feature (up to 4 marks total).
Each feature requires: (a) a clear point and (b) a specific supporting detail.
Award marks for any two of:
- At first a donor had to be present — detail: blood transferred using syringe and tube
- Blood storage became possible during the war — detail: sodium citrate stopped blood clotting
- Lawrence Robertson pioneered transfusions — detail: developed techniques on the Western Front
- Blood depot set up before Cambrai 1917 — detail: blood prepared in advance of casualties
- Transfusions helped treat blood loss/shock — detail: patients could be treated before surgery
Do NOT award for vague descriptions without supporting detail.`,

        sampleAnswer: `Blood transfusions on the Western Front were difficult at first because the donor had to be present. Doctors also improved blood transfusions during the war.`,

        annotations: [
          {
            id: 'ann1',
            target: 'the donor had to be present.',
            occurrence: 1,
            type: 'strong',
            comment: 'A correct feature — identified clearly. Now it needs a supporting detail.',
          },
          {
            id: 'ann2',
            target: 'Doctors also improved blood transfusions during the war.',
            occurrence: 1,
            type: 'weak',
            comment: 'Second point is vague. "Improved" needs a specific development — blood storage, Robertson, or Cambrai 1917.',
          },
        ],

        improvementPrompts: {
          ann1: {
            prompt: '+ Add a precise supporting detail',
            placeholder: 'e.g. Blood was transferred using a syringe and tube, which made transfusions slow and impractical on a battlefield...',
          },
          ann2: {
            prompt: '+ Replace the vague improvement with a specific one',
            placeholder: 'e.g. By 1917, scientists had developed ways to store blood outside the body. A blood depot was set up before the Battle of Cambrai, meaning doctors could prepare blood in advance of casualties...',
          },
        },

        criteriaOptions: [
          'Two separate features',
          'Precise supporting detail',
          'Accurate evidence',
          'Named person or date',
          'Second feature missing',
          'Too vague',
          'Repeats the same feature',
          'No supporting detail',
        ],
      },
    },

    {
      type: 'examinerExplains',
      tag: 'source-utility-exam',
      stage: 'Exam prep',
      label: 'How to answer Q2(a)',
      examinerExplains: {
        opening: 'Q2(a) asks how useful two sources are for an enquiry. A strong answer does not just say what the source shows — it explains usefulness using content, provenance and contextual knowledge.',
        tips: [
          {
            heading: 'Content point',
            body: 'Say what the source shows about the enquiry. Tie it to specific details in the source, not a general description.',
          },
          {
            heading: 'Provenance point',
            body: 'Who made it? When? Why? A surgeon\'s diary in 1917 carries weight because the writer had direct medical experience. Provenance should be linked to the enquiry — not just named.',
          },
          {
            heading: 'Contextual knowledge',
            body: 'Add what you know that supports or challenges the source. For blood transfusions: Robertson, Cambrai 1917, blood storage, donor present, syringe and tube. This shows the examiner you are using your knowledge actively.',
          },
          {
            heading: 'Limitation point',
            body: 'Identify what the source cannot show. A single diary gives one surgeon\'s experience — not the whole Western Front picture. Always add a limitation for full marks.',
          },
        ],
        closing: 'Source says + source was made by/for + what I know = utility. Always add a limitation.',
      },
    },

    {
      type: 'faceExaminer',
      tag: 'source-utility-exam',
      stage: 'Exam prep',
      label: 'Face the examiner — Q2(a)',
      examiner: {
        type: '8-mark-source',
        board: 'edexcel',
        subject: 'history',
        topic: 'western-front',
        difficulty: 'standard',

        question: 'How useful would a surgeon\'s diary from 1917 be for an enquiry into blood transfusions on the Western Front? [8 marks]',
        marks: 8,
        mark: 5,
        summary: 'Some useful content covered, but provenance is named rather than analysed, and contextual knowledge is thin. No limitation point.',

        markScheme: `Level 3 (6–8 marks): Analyses utility using content, provenance AND contextual knowledge. Limitation identified. Specific evidence used throughout.
Level 2 (3–5 marks): Utility addressed through content and some provenance or contextual knowledge, but not all three fully developed.
Level 1 (1–2 marks): Simple description of what the source shows with minimal analysis of utility.
Award credit for:
- Content: transfusions described, difficulties mentioned, blood loss treated
- Provenance: surgeon, 1917, direct medical experience, first-hand
- Contextual knowledge: Robertson, Cambrai 1917, blood storage, sodium citrate, donor present, syringe/tube
- Limitation: one surgeon, one location, may not represent the whole Western Front`,

        sampleAnswer: `A surgeon's diary from 1917 would be useful because it could describe how blood transfusions were carried out on the Western Front. It might explain the problems doctors faced. The diary was written by a surgeon so it is based on real experience. This fits with what we know about blood transfusions improving during the war.`,

        annotations: [
          {
            id: 'ann1',
            target: 'it could describe how blood transfusions were carried out on the Western Front.',
            occurrence: 1,
            type: 'strong',
            comment: 'Content point — linked to the enquiry clearly.',
          },
          {
            id: 'ann2',
            target: 'written by a surgeon so it is based on real experience.',
            occurrence: 1,
            type: 'weak',
            comment: 'Provenance mentioned but not analysed. WHY does a surgeon\'s experience make it useful for THIS enquiry? Develop: the writer had direct experience of treating patients with blood loss in battlefield conditions.',
          },
          {
            id: 'ann3',
            target: 'This fits with what we know about blood transfusions improving during the war.',
            occurrence: 1,
            type: 'weak',
            comment: 'Contextual knowledge is vague. Name specific evidence: Robertson, Cambrai 1917, blood storage, sodium citrate, donor having to be present.',
          },
        ],

        improvementPrompts: {
          ann2: {
            prompt: '+ Develop the provenance point',
            placeholder: 'e.g. Because the writer was a surgeon working on the Western Front in 1917, he would have direct experience of the problems of transfusing patients under battlefield conditions — including the difficulties of having a donor present...',
          },
          ann3: {
            prompt: '+ Add specific contextual knowledge',
            placeholder: 'e.g. This fits with our knowledge that Lawrence Robertson pioneered blood transfusions on the Western Front, and that a blood depot was set up before the Battle of Cambrai in 1917, allowing stored blood to be prepared in advance of casualties...',
          },
        },

        criteriaOptions: [
          'Content linked to enquiry',
          'Provenance analysed',
          'Contextual knowledge used',
          'Limitation identified',
          'Named evidence',
          'Provenance only named',
          'No contextual knowledge',
          'No limitation point',
        ],
      },
    },

    {
      type: 'examinerExplains',
      tag: 'source-follow-up',
      stage: 'Exam prep',
      label: 'How to answer Q2(b)',
      examinerExplains: {
        opening: 'Q2(b) is worth 4 marks. You need four linked parts: a detail from the source, a question you would ask, the source type you would use, and how that source would help.',
        tips: [
          {
            heading: 'Step 1: select a detail',
            body: 'Pick one specific detail from the source. For example: "The source says the surgeon could only transfuse occasional patients."',
          },
          {
            heading: 'Step 2: ask a focused question',
            body: 'Turn the detail into an enquiry question. For example: "Why were blood transfusions difficult to carry out on the Western Front?"',
          },
          {
            heading: 'Step 3: name the source type',
            body: 'Say exactly what kind of source you would use. Specific: "Army medical records about blood transfusions in 1917." Not: "the internet" or "a book".',
          },
          {
            heading: 'Step 4: explain how it helps',
            body: '"RAMC medical records could show how often transfusions were used, what equipment was available, and whether blood storage had improved by that stage of the war." Link it directly to your question.',
          },
        ],
        closing: 'Keep all four parts linked to the same detail you started with. Do not drift to a different topic.',
      },
    },

    {
      type: 'conceptReveal',
      tag: null,
      stage: 'Western Front judgement',
      label: 'How much did medicine improve?',
      steps: [
        {
          mainText: 'The Western Front caused huge suffering — but it also accelerated medical change.',
          supportText: 'War was the dominant agent of change. The scale of casualties forced faster innovation than peacetime medicine would ever have demanded.',
        },
        {
          mainText: 'Thomas splints cut femur deaths from 80% to 20%.',
          microPoints: [
            'Blood transfusions improved — blood storage began with Cambrai, 1917',
            'Mobile X-rays located bullets and shrapnel without surgery',
            'Harold Gillies developed plastic surgery at Queen Mary\'s Hospital, Sidcup',
            'The chain of evacuation organised treatment from trench to base hospital',
          ],
        },
        {
          mainText: 'Not everything was solved.',
          microPoints: [
            'Mud and bacteria still caused infection',
            'Evacuation was slow and dangerous under fire',
            'Shell shock was poorly understood — some soldiers were court-martialled',
            'Many improvements came only after enormous casualties',
          ],
        },
        {
          mainText: 'The Western Front did not make medicine safe.',
          supportText: 'It made medicine faster, more organised and more experimental — because war created urgent pressure that could not wait.',
        },
        {
          mainText: 'Can you explain the Western Front in three sentences?',
          supportText: '1. Why treatment was difficult.\n2. One way medicine improved.\n3. One limitation that remained.',
        },
      ],
    },

  ],
}

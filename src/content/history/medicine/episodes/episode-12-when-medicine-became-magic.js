// LEGACY ID NOTE:
//   This episode preserves legacy id 'mod8' exactly as it exists in the codebase.
//   Metadata (number, title, subtitle, era) in this file follows src/modules.js as the
//   single source of truth. The inline history.js draft had stale/diverged values:
//     number:   10  → corrected to 12
//     title:    'Inside modern medicine'  → corrected to 'When medicine became magic'
//     subtitle: 'Scans, transplants, DNA & the future'  → corrected to 'NHS & modern medicine'
//     era:      'c1945–present'  → corrected to 'c.1948–present' (dots added; start year corrected)
//   Screen content is verbatim from the inline block — nothing rewritten or expanded.

const episode = {
  id: 'mod8',
  subject: 'History',
  number: 12,
  title: 'When medicine became magic',
  subtitle: 'NHS & modern medicine',
  era: 'c.1948–present',
  icon: '🧬',
  color: '#1A5276',
  colorLight: 'rgba(26,82,118,.12)',
  series: 'medicine-through-time',
  recallTags: [],
  examTags: [],
  assetKeys: [],
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
  // TODO: mod8 focuses on technology rather than NHS access; Part 4 index is approximate.
  stageNavigation: [
    { id: 'part-1', title: 'Medicine Starts Looking Inside', description: 'Medical scanning and new diagnostic tools.', screenIndex: 0 },
    { id: 'part-2', title: 'Diagnosis Gets Powerful', description: 'Transplants and high-tech treatment breakthroughs.', screenIndex: 1 },
    { id: 'part-3', title: 'Treatment Becomes High-Tech', description: 'Precision surgery, DNA and genetic medicine.', screenIndex: 2 },
    { id: 'part-4', title: 'The NHS Changes Access', description: 'Medical ethics and society\'s new challenges.', screenIndex: 3 },
    { id: 'part-5', title: 'Progress With New Problems', description: 'Ethics, limits and unintended consequences of modern medicine.', screenIndex: 4 },
    { id: 'part-6', title: 'Exam Prep: Modern Medicine\'s Big Leap', description: 'Exam practice and final application.', screenIndex: 6 },
  ],
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
}

export default episode

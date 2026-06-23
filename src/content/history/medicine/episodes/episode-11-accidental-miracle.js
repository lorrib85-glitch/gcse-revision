// Episode file — owns the runtime teaching sequence for one episode.
//
// Actual image files live in public/history/medicine/.
// Asset path resolution lives in src/content/history/medicine/assets.js.
// Canonical content + architecture docs live in docs/content/history/medicine/.
//
// LEGACY ID NOTE:
//   This episode preserves legacy id 'mod7' exactly as it exists in the codebase.
//   Metadata (number, era) in this file follows src/modules.js as the single source
//   of truth; the inline history.js draft had stale values (number: 9,
//   era: 'c1890–c1945' without dots) which have been normalised to match the
//   corrected modules.js values during extraction.
//   The 'wwi-medicine' screenTag on the WWII production screen (index 5) is
//   preserved verbatim from src/modules.js — do not rename.
//   If ID migration from 'mod7' to a canonical slug is ever required, that must be
//   handled as a separate, explicit ID migration task with a full impact audit
//   across all affected files.

export const episode = {
  id: 'mod7',
  subject: 'History',
  number: 11,
  title: 'The accidental miracle',
  subtitle: 'Magic bullets, penicillin & the antibiotic revolution',
  era: 'c.1890–c.1945',
  icon: '💊',
  color: '#7A4515',
  colorLight: 'rgba(122,69,21,.12)',
  series: 'medicine-through-time',
  recallTags: [],
  examTags: [],
  assetKeys: [],
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
  stageNavigation: [
    { id: 'part-1', title: 'The Mould That Shouldn\'t Matter', description: 'The infection problem and early magic bullet attempts.', screenIndex: 0 },
    { id: 'part-2', title: 'Before Antibiotics: Infection Wins', description: 'Ehrlich\'s magic bullets and the search for a cure.', screenIndex: 1 },
    { id: 'part-3', title: 'Fleming Notices the Accident', description: 'The mould, the petri dish and the accidental discovery.', screenIndex: 2 },
    { id: 'part-4', title: 'Florey, Chain and Mass Production', description: 'Oxford team, WWII catalyst and industrial production.', screenIndex: 4 },
    { id: 'part-5', title: 'A New Age of Treatment', description: 'The antibiotic revolution and the NHS.', screenIndex: 6 },
    { id: 'part-6', title: 'Exam Prep: Accident or Team Effort?', description: 'Exam practice and final application.', screenIndex: 8 },
  ],
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

    // Screen 10 — Final Boss
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

    // Screen 11 — Retrieval + Reflection
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
}

export default episode

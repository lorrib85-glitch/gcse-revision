// ─── AQA GCSE Chemistry Foundation — Questions by topic ──────────────────────
// 8464/C/1F: Chemistry Paper 1 | 8464/C/2F: Chemistry Paper 2
// Sources: JUN22, JUN23, JUN24 past papers
// Images rendered from actual AQA past paper pages

import { CHEM_IMAGES } from './chemImages.js'

export const CHEMISTRY_TOPIC_GROUPS = [

  // ── ATOMIC STRUCTURE ──────────────────────────────────────────────────────
  {
    id: 'chem_atomic',
    label: 'Atomic Structure & Periodic Table',
    icon: '⚛️',
    color: '#38D27A',
    bg: 'rgba(56,210,122,.12)',
    border: 'rgba(56,210,122,.28)',
    description: 'Protons, neutrons, electrons, electronic structure, isotopes, relative atomic mass, Group 1 trends.',
    paper: 'Paper 1',
    calculator: false,
    skillTip: 'Remember: atomic number = protons = electrons (in a neutral atom). Mass number = protons + neutrons. Ions have gained or lost electrons. Group 1 elements get MORE reactive down the group.',
    questions: [
      {
        id: 'ch_at1', source: 'P1 JUN24', marks: 1, type: 'mc',
        q: 'What name is given to Group 1 elements?',
        options: ['Alkali metals', 'Halogens', 'Noble gases', 'Transition metals'],
        correctIndex: 0,
        ms: 'Alkali metals\n[1 mark — B1]',
      },
      {
        id: 'ch_at2', source: 'P1 JUN24', marks: 1, type: 'mc',
        q: 'What is the radius of a potassium atom?',
        options: ['0.2 cm', '0.2 mm', '0.2 nm', '0.2 m'],
        correctIndex: 2,
        ms: '0.2 nm\n[1 mark — B1]\nAtoms are measured in nanometres (nm) — about 0.1–0.5 nm.',
      },
      {
        id: 'ch_at3', source: 'P1 JUN24', marks: 1, type: 'mc',
        q: 'What name is given to the number of protons in an atom?',
        options: ['Atomic number', 'Group number', 'Mass number', 'Period number'],
        correctIndex: 0,
        ms: 'Atomic number\n[1 mark — B1]',
      },
      {
        id: 'ch_at4', source: 'P1 JUN24', marks: 2,
        q: 'Table 1 shows the name and relative charge of some particles:\n\nProton: +1\nNeutron: ?\nElectron: −1\n\nComplete Table 1 — what is the relative charge on a neutron?',
        ms: 'Neutron: 0 (zero charge)\n[2 marks: B1 for 0, B1 for recognising proton = +1 if not given]',
      },
      {
        id: 'ch_at5', source: 'P1 JUN24', marks: 1, type: 'mc',
        imageKey: 'p1j24_ion',
        q: 'The electronic structure of potassium is 2,8,8,1.\nFigure 1 (shown above) represents the electronic structure of a potassium ION.\n\nWhat is the charge on a potassium ion?',
        options: ['−1', '0', '+1', '+2'],
        correctIndex: 2,
        ms: '+1\n[1 mark — B1]\nPotassium loses one electron to form K⁺.',
      },
      {
        id: 'ch_at6', source: 'P1 JUN24', marks: 1, type: 'mc',
        q: 'Potassium has two isotopes:\n39K (93% abundance) and 41K (7% abundance).\n\nHow is the relative atomic mass (Ar) of potassium calculated?',
        options: [
          'Ar = ((39 × 7) + (41 × 93)) ÷ 100',
          'Ar = ((39 × 93) + (41 × 7)) ÷ 100',
          'Ar = ((39 × 41) + (93 × 7)) ÷ 100',
          'Ar = (39 + 41) ÷ 2',
        ],
        correctIndex: 1,
        ms: 'Ar = ((39 × 93) + (41 × 7)) ÷ 100\n[1 mark — B1]\nMultiply each mass by its % abundance, add together, divide by 100.',
      },
      {
        id: 'ch_at7', source: 'P1 JUN22', marks: 1, type: 'mc',
        q: 'What are the Group 1 elements known as?',
        options: ['Alkali metals', 'Halogens', 'Noble gases', 'Transition metals'],
        correctIndex: 0,
        ms: 'Alkali metals\n[1 mark — B1]',
      },
      {
        id: 'ch_at8', source: 'P1 JUN22', marks: 3,
        imageKey: 'p1j22_melt_pts',
        q: 'Figure 2 (shown above) shows the melting points of some Group 1 elements as a bar chart.\n\nDescribe the trend in the melting points of the Group 1 elements shown in Figure 2.',
        ms: 'The melting point decreases as you go down Group 1 (from lithium to caesium).\n[3 marks]\nB1: decreases / goes down\nB1: as atomic number increases / as you go down the group\nB1: specific values or reference to the trend from Figure 2 (e.g. lithium ~180°C, caesium ~29°C)',
      },
      {
        id: 'ch_at9', source: 'P1 JUN22', marks: 1,
        imageKey: 'p1j22_melt_pts',
        q: 'Use Figure 2 (shown above) to find the melting point of caesium.',
        ms: 'Accept any value in the range 28–30°C\n[1 mark — B1 for reading from the graph correctly]',
      },
    ],
  },

  // ── BONDING & STRUCTURE ───────────────────────────────────────────────────
  {
    id: 'chem_bonding',
    label: 'Bonding, Structure & Properties',
    icon: '🔗',
    color: '#38D27A',
    bg: 'rgba(56,210,122,.12)',
    border: 'rgba(56,210,122,.28)',
    description: 'Covalent bonding, dot and cross diagrams, giant covalent structures, ionic bonding, metallic bonding, fullerenes, polymers.',
    paper: 'Paper 1',
    calculator: false,
    skillTip: 'Covalent = sharing electrons (non-metals). Ionic = transfer electrons (metal + non-metal). Metallic = sea of delocalised electrons. Giant structures have high melting points because MANY bonds must be broken. Simple molecular = low mp because weak intermolecular forces (not covalent bonds) break.',
    questions: [
      {
        id: 'ch_bn1', source: 'P1 JUN24', marks: 1, type: 'mc',
        imageKey: 'p1j24_fullerene',
        q: 'Figure 4 (above) represents the structure of a fullerene.\n\nWhere are fullerenes used?',
        options: ['In electronic components', 'In self-heating cans', 'In sports injury packs', 'In building materials'],
        correctIndex: 0,
        ms: 'In electronic components\n[1 mark — B1]',
      },
      {
        id: 'ch_bn2', source: 'P1 JUN24', marks: 2,
        imageKey: 'p1j24_fullerene',
        q: 'Figure 4 (above) shows a fullerene.\n\nDescribe the structure of this fullerene.',
        ms: 'Any two from:\n• Made of carbon atoms\n• Carbon atoms arranged in rings / hexagons and pentagons\n• Forms a hollow ball / cage structure\n• Each carbon atom is bonded to three other carbon atoms\n[2 marks — B1 each, max 2]',
      },
      {
        id: 'ch_bn3', source: 'P1 JUN24', marks: 1, type: 'mc',
        q: 'In graphite, each carbon atom forms covalent bonds.\n\nHow many covalent bonds does each carbon atom form in graphite?',
        options: ['1', '2', '3', '4'],
        correctIndex: 2,
        ms: '3\n[1 mark — B1]\nEach carbon in graphite bonds to 3 others in a layered hexagonal structure. The 4th electron is delocalised — this is why graphite conducts electricity.',
      },
      {
        id: 'ch_bn4', source: 'P1 JUN24', marks: 1,
        q: 'Graphite conducts electricity.\n\nWhich particles carry electrical charge through graphite?',
        ms: 'Electrons (delocalised electrons)\n[1 mark — B1]\nAllow: free electrons / delocalised electrons\nDo NOT accept: ions',
      },
      {
        id: 'ch_bn5', source: 'P1 JUN22', marks: 1, type: 'mc',
        q: 'What type of structure is silicon dioxide?',
        options: ['Giant covalent', 'Ionic lattice', 'Simple molecular', 'Metallic'],
        correctIndex: 0,
        ms: 'Giant covalent\n[1 mark — B1]\nSiO₂ has a giant covalent structure — very high melting point, does not conduct electricity.',
      },
      {
        id: 'ch_bn6', source: 'P1 JUN22', marks: 1, type: 'mc',
        q: 'The structure of fullerenes is based on:',
        options: ['hexagons', 'octagons', 'squares', 'triangles'],
        correctIndex: 0,
        ms: 'hexagons\n[1 mark — B1]',
      },
      {
        id: 'ch_bn7', source: 'P1 JUN22', marks: 1, type: 'mc',
        imageKey: 'p1j22_fullerene',
        q: 'The fullerene molecule shown in Figure 7 (above) is used for:',
        options: ['Electronics', 'Hand warmers', 'Sports injury packs', 'Reinforcing materials'],
        correctIndex: 0,
        ms: 'Electronics\n[1 mark — B1]\nThis is C60 (buckminsterfullerene) — used in electronics and as a lubricant.',
      },
      {
        id: 'ch_bn8', source: 'P1 JUN22', marks: 1, type: 'mc',
        q: 'What holds the atoms together in a polymer chain?',
        options: ['Covalent bonds', 'Ionic bonds', 'Metallic bonds', 'Hydrogen bonds'],
        correctIndex: 0,
        ms: 'Covalent bonds\n[1 mark — B1]',
      },
      {
        id: 'ch_bn9', source: 'P1 JUN22', marks: 1, type: 'mc',
        q: 'In a polymer, the polymer chains are held together by ___ forces.\n\nChoose: atomic / intermolecular / macromolecular',
        options: ['atomic', 'intermolecular', 'macromolecular', 'covalent'],
        correctIndex: 1,
        ms: 'intermolecular\n[1 mark — B1]\nWeak intermolecular forces between chains = low melting points for many polymers.',
      },
      {
        id: 'ch_bn10', source: 'P1 JUN22', marks: 3,
        q: 'Explain why magnesium alloy is harder than pure magnesium metal.\n\n[Hint: In magnesium metal, the atoms are all the same size arranged in regular layers. In the alloy, some magnesium atoms are replaced by copper atoms which are a different size.]',
        ms: 'B1: In pure magnesium, the layers of atoms can slide over each other easily\nB1: In the alloy, the different-sized copper atoms disrupt / distort the regular arrangement of layers\nB1: This prevents the layers from sliding, making the alloy harder / stronger\n[3 marks]',
      },
      {
        id: 'ch_bn11', source: 'P1 JUN22', marks: 3,
        q: 'Sodium chloride (NaCl) conducts electricity when MOLTEN but NOT when solid.\n\nExplain why.',
        ms: 'B1: In solid NaCl, the ions are held in a fixed lattice / cannot move\nB1: When molten, the ions are free to move\nB1: Moving ions carry the electrical charge / conduct electricity\n[3 marks]\nAllow: "ions are not free to move in the solid" for B1+B1',
      },
      {
        id: 'ch_bn12', source: 'P1 JUN22', marks: 2,
        q: 'Sodium metal conducts electricity when solid.\n\nExplain why.',
        ms: 'B1: Sodium has delocalised (free) electrons\nB1: These electrons are free to move and carry electrical charge\n[2 marks]',
      },
    ],
  },

  // ── QUANTITATIVE CHEMISTRY ────────────────────────────────────────────────
  {
    id: 'chem_quant',
    label: 'Quantitative Chemistry',
    icon: '🔢',
    color: '#38D27A',
    bg: 'rgba(56,210,122,.12)',
    border: 'rgba(56,210,122,.28)',
    description: 'Relative formula mass (Mr), calculating masses, conservation of mass, percentage composition.',
    paper: 'Paper 1',
    calculator: true,
    skillTip: 'Mr = add up all the relative atomic masses. For calculations: show your working — each step can earn a mark even if you get the final answer wrong. Always include units.',
    questions: [
      {
        id: 'ch_qu1', source: 'P1 JUN22', marks: 2,
        q: 'Calculate the relative formula mass (Mr) of magnesium fluoride (MgF₂).\n\nRelative atomic masses: F = 19, Mg = 24',
        ms: 'Mr = 24 + (2 × 19) = 24 + 38 = 62\n[2 marks]\nM1: correct method — adding Mg + 2×F\nA1: 62\n[Note: no units needed — Mr has no units]',
      },
      {
        id: 'ch_qu2', source: 'P2 JUN24', marks: 2,
        q: 'Calculate the relative formula mass (Mr) of carbon dioxide (CO₂).\n\nRelative atomic masses: C = 12, O = 16',
        ms: 'Mr = 12 + (2 × 16) = 12 + 32 = 44\n[2 marks]\nM1: correct method — C + 2×O\nA1: 44',
      },
      {
        id: 'ch_qu3', source: 'P1 JUN22', marks: 1,
        q: 'In a reaction, 3.65 g of hydrogen chloride reacts with 4.00 g of sodium hydroxide.\n1.80 g of water is produced.\n\nCalculate the mass of the other product (sodium chloride).',
        ms: 'Mass = (3.65 + 4.00) − 1.80 = 5.85 g\n[1 mark — B1 for 5.85 g]\nUse conservation of mass: total mass of reactants = total mass of products.',
      },
      {
        id: 'ch_qu4', source: 'P2 JUN23', marks: 3,
        q: '5.20 kg of crude oil contains 1.53 kg of LPG (Liquefied Petroleum Gas).\n\nCalculate the percentage (%) of LPG in 5.20 kg of crude oil.\nGive your answer to 3 significant figures.',
        ms: 'Percentage = (1.53 ÷ 5.20) × 100\n= 29.42...\n= 29.4%\n[3 marks]\nM1: 1.53 ÷ 5.20 × 100 (correct method)\nA1: 29.4(2...)\nA1: answer rounded to 3 significant figures = 29.4%',
      },
      {
        id: 'ch_qu5', source: 'P2 JUN23', marks: 2,
        q: 'A car emits 17.2 kg of carbon dioxide on a journey.\nThere are four people in the car.\n\nCalculate the mass of carbon dioxide emitted per person.',
        ms: 'Mass per person = 17.2 ÷ 4 = 4.3 kg\n[2 marks]\nM1: 17.2 ÷ 4\nA1: 4.3 kg',
      },
      {
        id: 'ch_qu6', source: 'P2 JUN24', marks: 2,
        q: 'Calculate the mass of aluminium packaging recycled in the UK each year.\n\n212 million kg of aluminium is used for packaging annually.\n68.0% is recycled.',
        ms: 'Mass = 212 × 0.680 = 144.16 ≈ 144 million kg\n[2 marks]\nM1: 212 × 68.0 ÷ 100 or 212 × 0.68\nA1: 144 (million kg) — accept 144.16',
      },
      {
        id: 'ch_qu7', source: 'P2 JUN24', marks: 4,
        q: 'An aluminium can has a mass of 15.8 g.\n1000 g = 1 kg\n\nCalculate the whole number of aluminium cans that can be made from 4.00 kg of aluminium.',
        ms: '4.00 kg = 4000 g\nNumber of cans = 4000 ÷ 15.8 = 253.16...\nWhole number = 253\n[4 marks]\nM1: convert kg to g (4000)\nM1: 4000 ÷ 15.8\nA1: 253.16...\nA1: 253 (whole number — do not round up)',
      },
    ],
  },

  // ── REACTION RATES & ENERGY ───────────────────────────────────────────────
  {
    id: 'chem_rates',
    label: 'Reaction Rates & Energy Changes',
    icon: '⚡',
    color: '#38D27A',
    bg: 'rgba(56,210,122,.12)',
    border: 'rgba(56,210,122,.28)',
    description: 'Factors affecting rate of reaction, activation energy, exothermic and endothermic reactions, catalysts, required practical investigations.',
    paper: 'Paper 1',
    calculator: true,
    skillTip: 'Rate of reaction increases with: higher temperature, higher concentration, smaller particle size (more surface area), catalyst. Exothermic = releases energy (temperature increases). Endothermic = absorbs energy (temperature decreases).',
    questions: [
      {
        id: 'ch_rt1', source: 'P1 JUN24', marks: 1, type: 'mc',
        q: 'A student investigated temperature changes when zinc was added to copper sulfate solution.\n\nThe student varied the mass of zinc.\nWhat type of variable is the mass of zinc?',
        options: ['Control', 'Dependent', 'Independent', 'Random'],
        correctIndex: 2,
        ms: 'Independent\n[1 mark — B1]\nIndependent = what you change. Dependent = what you measure. Control = what you keep the same.',
      },
      {
        id: 'ch_rt2', source: 'P1 JUN24', marks: 2,
        q: 'In a zinc + copper sulfate experiment, Table 3 shows:\n• Starting temperature: 21°C\n• Figure 6 (thermometer) shows the highest temperature reached\n\nUse the image above to read the thermometer. Calculate the temperature increase.',
        imageKey: 'p1j24_thermometer',
        ms: 'Highest temperature = 34°C (read from thermometer in Figure 6)\nTemperature increase = 34 − 21 = 13°C\n[2 marks]\nB1: correct reading from thermometer (accept ±0.5°C)\nB1ft: correct subtraction using their thermometer reading',
      },
      {
        id: 'ch_rt3', source: 'P1 JUN24', marks: 2,
        q: 'Table 4 shows temperature increase results for 1.0 g of zinc:\nExperiment 1: 7.8°C\nExperiment 2: 7.3°C\nExperiment 3: 7.7°C\n\nCalculate value B (the mean temperature increase).',
        ms: 'B = (7.8 + 7.3 + 7.7) ÷ 3 = 22.8 ÷ 3 = 7.6°C\n[2 marks]\nM1: sum of three values ÷ 3 (correct method)\nA1: 7.6°C',
      },
      {
        id: 'ch_rt4', source: 'P1 JUN24', marks: 2,
        q: 'Table 4 shows results for 3.0 g of zinc:\nExperiment 1: 20.4°C\nExperiment 2: 12.9°C\nExperiment 3: 20.2°C\n\nOne result is anomalous. Which result is it? Suggest one reason why.',
        ms: 'Anomalous result: Experiment 2 (12.9°C)\nReason: any one from:\n• Not all the zinc reacted / zinc not fully in contact with solution\n• The solution was not stirred properly\n• Incorrect measurement of zinc\n• Heat lost to surroundings / insulation poor\n[2 marks — B1 + B1]',
      },
      {
        id: 'ch_rt5', source: 'P1 JUN24', marks: 1,
        q: 'In the zinc + copper sulfate experiment, the temperature of the solution increases.\n\nIs this reaction exothermic or endothermic?',
        ms: 'Exothermic\n[1 mark — B1]\nTemperature increases → energy released to surroundings → exothermic.',
      },
      {
        id: 'ch_rt6', source: 'P1 JUN22', marks: 2,
        q: 'Zinc reacts with copper sulfate solution.\nCopper does not react with zinc sulfate solution.\n\nExplain this observation using the reactivity series.',
        ms: 'B1: Zinc is more reactive than copper (so zinc displaces copper from its salt solution)\nB1: Copper is less reactive than zinc (so copper cannot displace zinc from zinc sulfate)\n[2 marks]\nAllow: copper is less reactive than magnesium (both answers accepted)',
      },
    ],
  },

  // ── EXTRACTION & REACTIONS ────────────────────────────────────────────────
  {
    id: 'chem_extraction',
    label: 'Acids, Salts & Extraction of Metals',
    icon: '🧪',
    color: '#38D27A',
    bg: 'rgba(56,210,122,.12)',
    border: 'rgba(56,210,122,.28)',
    description: 'Acids and alkalis, neutralisation, salt production, reactivity series, extraction of metals, electrolysis.',
    paper: 'Paper 1',
    calculator: false,
    skillTip: 'Acid + alkali → salt + water (neutralisation). Metal extraction method depends on reactivity: more reactive = electrolysis of molten compound; less reactive = reduction with carbon. Electrolysis: positive ions attracted to negative electrode (cathode).',
    questions: [
      {
        id: 'ch_ex1', source: 'P1 JUN22', marks: 1,
        q: 'Balance the equation for magnesium reacting with oxygen:\n\n_Mg + O₂ → 2MgO',
        ms: '2Mg + O₂ → 2MgO\n[1 mark — B1 for 2 in front of Mg]',
      },
      {
        id: 'ch_ex2', source: 'P1 JUN22', marks: 1, type: 'mc',
        q: 'Argon is a noble gas.\nExplain why no product is formed when magnesium and argon are heated together.',
        options: [
          'Argon has a full outer shell of electrons and does not react',
          'Argon is too heavy to react with magnesium',
          'Magnesium is not reactive enough',
          'The temperature is too low',
        ],
        correctIndex: 0,
        ms: 'Argon has a full outer shell of electrons and does not react\n[B1]\nNoble gases are chemically inert because they have full outer electron shells.',
      },
      {
        id: 'ch_ex3', source: 'P1 JUN22', marks: 1,
        imageKey: 'p1j22_reactivity',
        q: 'Figure 10 (above) shows a reactivity series.\n\nMetals D and E are unidentified.\n\nMetal D is above sodium. Metal E is between carbon and iron.\n\nDraw a line from each metal to its extraction method:\n• Extracted by electrolysis of a molten ionic compound\n• Extracted from its oxide by reduction with carbon\n• Removed from the Earth as the metal itself',
        ms: 'Metal D → extracted by electrolysis of a molten ionic compound (above sodium — very reactive)\nMetal E → extracted from its oxide by reduction with carbon (between carbon and iron)\n[2 marks — B1 each correct line]',
      },
      {
        id: 'ch_ex4', source: 'P1 JUN22', marks: 3,
        q: 'Excess copper carbonate is added to sulfuric acid.\n\nGive THREE observations you would make.',
        ms: 'Any three from:\n• Green / blue-green solid (copper carbonate) dissolves / disappears\n• Bubbling / fizzing / effervescence\n• Solution turns blue (copper sulfate forms)\n• Some green solid remains at end (excess copper carbonate)\n• Temperature increases slightly\n[3 marks — B1 each, max 3]',
      },
      {
        id: 'ch_ex5', source: 'P1 JUN22', marks: 1, type: 'mc',
        q: 'What type of reaction is copper carbonate + sulfuric acid → copper sulfate + water + carbon dioxide?',
        options: ['Neutralisation', 'Combustion', 'Oxidation', 'Displacement'],
        correctIndex: 0,
        ms: 'Neutralisation\n[1 mark — B1]\nAcid + metal carbonate → salt + water + carbon dioxide = neutralisation reaction.',
      },
      {
        id: 'ch_ex6', source: 'P1 JUN22', marks: 1,
        q: 'After the copper carbonate + sulfuric acid reaction, the pH of the solution at the end is neutral.\n\nWhat is the pH at the end of the reaction?',
        ms: 'pH = 7\n[1 mark — B1]\nNeutral solution has pH = 7.',
      },
    ],
  },

  // ── SEPARATING MIXTURES & ANALYSIS ───────────────────────────────────────
  {
    id: 'chem_separation',
    label: 'Separating Mixtures & Chemical Analysis',
    icon: '🔍',
    color: '#38D27A',
    bg: 'rgba(56,210,122,.12)',
    border: 'rgba(56,210,122,.28)',
    description: 'Filtration, crystallisation, distillation, chromatography, Rf values, testing for gases and ions.',
    paper: 'Paper 1 & 2',
    calculator: true,
    skillTip: 'Rf value = distance moved by substance ÷ distance moved by solvent front. Always ≤ 1. Chromatography: start line must be drawn in PENCIL (not pen — ink would dissolve). Filtration separates insoluble solid from liquid.',
    questions: [
      {
        id: 'ch_sep1', source: 'P1 JUN24', marks: 1,
        imageKey: 'p1j24_chrom',
        q: 'Figure 7 (above) shows apparatus used to separate dyes in black ink.\n\nWhat is the name of this method?',
        ms: 'Chromatography\n[1 mark — B1]\nAllow: paper chromatography',
      },
      {
        id: 'ch_sep2', source: 'P1 JUN24', marks: 1, type: 'mc',
        q: 'Three liquids G, H and I are separated using distillation.\n\nBoiling points: G = 56°C, H = 78°C, I = 100°C\n\nWhich liquid collects FIRST in the conical flask?',
        options: ['G', 'H', 'I', 'All at the same time'],
        correctIndex: 0,
        ms: 'G\n[1 mark — B1]\nThe liquid with the lowest boiling point vaporises and condenses first.',
      },
      {
        id: 'ch_sep3', source: 'P1 JUN24', marks: 2,
        q: 'In distillation, match each description to the correct process name:\n\n• Liquid changes to vapour\n• Vapour changes to liquid',
        ms: 'Liquid changes to vapour → Evaporating\nVapour changes to liquid → Condensing\n[2 marks — B1 each]',
      },
      {
        id: 'ch_sep4', source: 'P2 JUN24', marks: 4,
        imageKey: 'p2j23_methane_pie',
        q: 'Figure 2 (above) shows a chromatogram of printer ink.\n\nUsing the Rf equation:\nRf = distance moved by colour ÷ distance moved by solvent\n\nDetermine the Rf value of the red colour.\nShow your working.',
        ms: 'From the chromatogram:\nDistance moved by red colour = approx 4.77 cm (read from diagram)\nDistance moved by solvent = approx 5.30 cm\nRf = 4.77 ÷ 5.30 = 0.9 (to 1 d.p.)\n[4 marks]\nB1: correctly reading distance of red colour from start line\nB1: correctly reading distance of solvent front from start line\nM1: applying Rf = colour distance ÷ solvent distance\nA1: 0.9 (accept readings from diagram ± 0.5mm tolerance)',
      },
      {
        id: 'ch_sep5', source: 'P2 JUN24', marks: 2,
        q: 'Anhydrous copper sulfate can be used to test for water.\n\nComplete the sentence:\nWhen water is added to anhydrous copper sulfate, the colour changes from ___ to ___.',
        ms: 'From: white\nTo: blue\n[2 marks — B1 each]\nAnhydrous CuSO₄ is white. Hydrated CuSO₄ (with water) is blue.',
      },
      {
        id: 'ch_sep6', source: 'P2 JUN24', marks: 2,
        q: 'Describe the test for chlorine gas.\nGive the result.',
        ms: 'Test: Place damp litmus paper (or damp red/blue litmus) into the gas\nResult: The litmus paper is bleached (turns white)\n[2 marks — B1 test + B1 result]\nAllow: damp universal indicator paper → turns white / bleached',
      },
    ],
  },

  // ── ATMOSPHERE & RESOURCES ────────────────────────────────────────────────
  {
    id: 'chem_atmosphere',
    label: 'Earth\'s Atmosphere & Resources',
    icon: '🌍',
    color: '#38D27A',
    bg: 'rgba(56,210,122,.12)',
    border: 'rgba(56,210,122,.28)',
    description: 'Composition of atmosphere, greenhouse gases, climate change, crude oil, fractional distillation, cracking, potable water.',
    paper: 'Paper 2',
    calculator: true,
    skillTip: 'Current atmosphere: 78% N₂, 21% O₂, ~0.04% CO₂. Greenhouse gases trap heat: CO₂, methane, water vapour. Crude oil = mixture of hydrocarbons separated by fractional distillation (different boiling points). Potable water = safe to drink (not pure — contains dissolved minerals).',
    questions: [
      {
        id: 'ch_atm1', source: 'P2 JUN23', marks: 1, type: 'mc',
        q: 'Crude oil is a finite resource.\n\nWhat is a finite resource?',
        options: ['A limited resource', 'A renewable resource', 'A sustainable resource', 'An unlimited resource'],
        correctIndex: 0,
        ms: 'A limited resource\n[1 mark — B1]',
      },
      {
        id: 'ch_atm2', source: 'P2 JUN23', marks: 1, type: 'mc',
        q: 'What is crude oil formed from?',
        options: ['Plankton', 'Volcanoes', 'Water', 'Coal'],
        correctIndex: 0,
        ms: 'Plankton\n[1 mark — B1]\nCrude oil formed from dead marine organisms (plankton) over millions of years under heat and pressure.',
      },
      {
        id: 'ch_atm3', source: 'P2 JUN23', marks: 1, type: 'mc',
        q: 'What type of substance is crude oil?',
        options: ['Compound', 'Element', 'Mixture', 'Pure substance'],
        correctIndex: 2,
        ms: 'Mixture\n[1 mark — B1]\nCrude oil is a mixture of hydrocarbons — it can be separated by physical methods.',
      },
      {
        id: 'ch_atm4', source: 'P2 JUN23', marks: 2,
        q: 'In fractional distillation, crude oil is heated so the hydrocarbons ___.\nThe fractions collect as the hydrocarbons cool and ___.\n\nChoose from: condense / evaporate / freeze / melt',
        ms: 'First blank: evaporate\nSecond blank: condense\n[2 marks — B1 each]',
      },
      {
        id: 'ch_atm5', source: 'P2 JUN23', marks: 1, type: 'mc',
        q: 'What is used in the test for hydrogen gas?',
        options: ['Burning splint', 'Glowing splint', 'Limewater', 'Damp litmus paper'],
        correctIndex: 0,
        ms: 'Burning splint\n[1 mark — B1]\nHydrogen burns with a squeaky pop when a burning splint is applied.',
      },
      {
        id: 'ch_atm6', source: 'P2 JUN23', marks: 1, type: 'mc',
        imageKey: 'p2j23_co2',
        q: 'Figure 1 (above) shows the concentration of CO₂ in Earth\'s atmosphere from 1960 to 2020.\n\nHow has the concentration of carbon dioxide changed from 1960 to 2020?',
        options: ['Decreased', 'Stayed the same', 'Increased', 'Fluctuated'],
        correctIndex: 2,
        ms: 'Increased\n[1 mark — B1]',
      },
      {
        id: 'ch_atm7', source: 'P2 JUN23', marks: 1, type: 'mc',
        q: 'Which gas has the highest percentage in the Earth\'s atmosphere today?\n\nUse Table 1 (Earth: Argon 0.90%, CO₂ 0.04%, Nitrogen 78%, Oxygen 21%)',
        options: ['Argon', 'Carbon dioxide', 'Nitrogen', 'Oxygen'],
        correctIndex: 2,
        ms: 'Nitrogen\n[1 mark — B1]\n78% of Earth\'s atmosphere is nitrogen.',
      },
      {
        id: 'ch_atm8', source: 'P2 JUN23', marks: 3,
        q: 'Calculate how many times more CO₂ there is in Mars\' atmosphere than Earth\'s.\n\nMars CO₂: 95% | Earth CO₂: 0.04%\n\nGive your answer in standard form.',
        ms: '95 ÷ 0.04 = 2375\n= 2.375 × 10³\n≈ 2.4 × 10³ (to 2 s.f.)\n[3 marks]\nM1: 95 ÷ 0.04 (correct method)\nA1: 2375\nA1: correct standard form answer from their calculation',
      },
      {
        id: 'ch_atm9', source: 'P2 JUN23', marks: 1, type: 'mc',
        q: 'Name the process in trees that uses carbon dioxide.',
        options: ['Combustion', 'Fermentation', 'Photosynthesis', 'Respiration'],
        correctIndex: 2,
        ms: 'Photosynthesis\n[1 mark — B1]',
      },
      {
        id: 'ch_atm10', source: 'P2 JUN23', marks: 2,
        imageKey: 'p2j23_methane_pie',
        q: 'Figure 3 (above) shows sources of methane emissions as a pie chart.\n\nDetermine the percentage of methane emissions from landfill.\nAlso give two conclusions about the annual change in forest area.',
        ms: 'Landfill percentage: 6% (read from pie chart)\n[1 mark — B1 for 6%]\n\nTwo conclusions about forest area (from Figure 2):\nAny two from:\n• Forest area increases in Africa\n• Forest area increases in Europe\n• Forest area decreases in South America\n• Forest area decreases in Asia\n[2 marks — B1 each]',
      },
      {
        id: 'ch_atm11', source: 'P2 JUN23', marks: 1, type: 'mc',
        q: 'Why is potable water sterilised?',
        options: ['To improve the taste', 'To kill bacteria', 'To remove dissolved solids', 'To reduce mineral content'],
        correctIndex: 1,
        ms: 'To kill bacteria\n[1 mark — B1]',
      },
      {
        id: 'ch_atm12', source: 'P2 JUN23', marks: 1,
        q: 'Equilibrium is reached when the forward and reverse reactions occur at the same ___.\n\nComplete the sentence.',
        ms: 'rate\n[1 mark — B1]\nAt dynamic equilibrium: rate of forward reaction = rate of reverse reaction.',
      },
      {
        id: 'ch_atm13', source: 'P2 JUN24', marks: 2, type: 'mc_multi',
        q: 'The approximate percentage of CO₂ in Earth\'s EARLY atmosphere was 95%.\n\nWhich TWO reasons explain why the percentage of CO₂ has decreased since then?',
        options: ['Combustion of fuels', 'Deforestation', 'Dissolving in oceans', 'Photosynthesis', 'Respiration'],
        correctIndices: [2, 3],
        ms: 'Dissolving in oceans AND Photosynthesis\n[2 marks — B1 each]\nCO₂ dissolved in early oceans and was absorbed by early plants/algae through photosynthesis.',
      },
      {
        id: 'ch_atm14', source: 'P2 JUN24', marks: 1, type: 'mc',
        q: 'Which of the following is also a greenhouse gas (besides CO₂)?',
        options: ['Argon', 'Methane', 'Nitrogen', 'Oxygen'],
        correctIndex: 1,
        ms: 'Methane\n[1 mark — B1]\nGreenhouse gases: CO₂, methane (CH₄), water vapour, nitrous oxide.',
      },
    ],
  },
]

// ─── Flat lookup ──────────────────────────────────────────────────────────────
export const ALL_CHEMISTRY_QUESTIONS = CHEMISTRY_TOPIC_GROUPS.flatMap(g =>
  g.questions.map(q => ({
    ...q,
    topicId:    g.id,
    topicLabel: g.label,
    topicColor: g.color,
    isCalc:     g.calculator,
    skillTip:   g.skillTip,
  }))
)

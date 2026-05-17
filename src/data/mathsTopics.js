// ─── AQA GCSE Maths Foundation — Questions organised by topic ─────────────────
// All questions drawn verbatim from AQA past papers (JUN22, JUN23, NOV21–23)
// Diagrams rendered as inline SVG. API grading via /api/grade.

// ─── Formula sheet ────────────────────────────────────────────────────────────
export const FORMULA_SHEET = [
  {
    section: 'Area & Volume',
    formulae: [
      { name: 'Area of trapezium',       f: '½(a + b)h'          },
      { name: 'Volume of prism',         f: 'area of cross-section × length' },
      { name: 'Volume of sphere',        f: '4/3 πr³'            },
      { name: 'Surface area of sphere',  f: '4πr²'               },
      { name: 'Volume of cone',          f: '1/3 πr²h'           },
      { name: 'Curved surface of cone',  f: 'πrl'                },
    ],
  },
  {
    section: 'Trigonometry',
    formulae: [
      { name: 'Sine rule',       f: 'a/sin A = b/sin B = c/sin C' },
      { name: 'Cosine rule',     f: 'a² = b² + c² − 2bc cos A'   },
      { name: 'Area of triangle',f: '½ ab sin C'                  },
    ],
  },
  {
    section: 'Quadratics',
    formulae: [
      { name: 'Quadratic formula', f: 'x = (−b ± √(b²−4ac)) / 2a' },
    ],
  },
  {
    section: 'Other',
    formulae: [
      { name: 'Compound interest', f: 'P(1 + r/100)ⁿ'        },
      { name: 'Speed',             f: 'Speed = Distance ÷ Time' },
      { name: 'Density',           f: 'Density = Mass ÷ Volume' },
      { name: 'Pressure',          f: 'Pressure = Force ÷ Area' },
    ],
  },
]

// ─── Inline SVG diagrams ──────────────────────────────────────────────────────
export const DIAGRAMS = {
  rect_with_hole: `<svg viewBox="0 0 240 150" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;display:block;margin:10px auto">
    <rect x="10" y="10" width="200" height="120" fill="rgba(59,130,255,.05)" stroke="#9CA8C7" stroke-width="2"/>
    <rect x="70" y="42" width="80" height="50" fill="#10182B" stroke="#9CA8C7" stroke-width="1.5" stroke-dasharray="5,3"/>
    <line x1="10" y1="135" x2="210" y2="135" stroke="none"/>
    <text x="108" y="148" fill="#9CA8C7" font-size="11" text-anchor="middle" font-family="Inter,sans-serif">20 cm</text>
    <text x="218" y="75" fill="#9CA8C7" font-size="11" font-family="Inter,sans-serif">15 cm</text>
    <text x="108" y="70" fill="#9CA8C7" font-size="10" text-anchor="middle" font-family="Inter,sans-serif">10 cm</text>
    <text x="108" y="92" fill="#9CA8C7" font-size="10" text-anchor="middle" font-family="Inter,sans-serif">6 cm</text>
    <text x="12" y="24" fill="#9D5CFF" font-size="9" font-family="Inter,sans-serif">Not drawn accurately</text>
  </svg>`,

  angle_lines: `<svg viewBox="0 0 220 190" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;display:block;margin:10px auto">
    <circle cx="110" cy="110" r="3" fill="#9CA8C7"/>
    <line x1="20" y1="110" x2="200" y2="110" stroke="#9CA8C7" stroke-width="1.8"/>
    <line x1="110" y1="110" x2="48" y2="28" stroke="#9CA8C7" stroke-width="1.8"/>
    <line x1="110" y1="110" x2="185" y2="32" stroke="#9CA8C7" stroke-width="1.8"/>
    <text x="14" y="115" fill="#9CA8C7" font-size="12" font-family="Inter,sans-serif">A</text>
    <text x="202" y="115" fill="#9CA8C7" font-size="12" font-family="Inter,sans-serif">C</text>
    <text x="114" y="120" fill="#9CA8C7" font-size="12" font-family="Inter,sans-serif">B</text>
    <text x="40" y="25" fill="#9CA8C7" font-size="12" font-family="Inter,sans-serif">D</text>
    <text x="182" y="26" fill="#9CA8C7" font-size="12" font-family="Inter,sans-serif">E</text>
    <text x="80" y="98" fill="#F5B700" font-size="9" font-family="Inter,sans-serif">EBD=5×ABE</text>
    <text x="118" y="98" fill="#F5B700" font-size="9" font-family="Inter,sans-serif">DBC=3×ABE</text>
    <text x="12" y="15" fill="#9D5CFF" font-size="9" font-family="Inter,sans-serif">Not drawn accurately</text>
  </svg>`,

  octagon_angle: `<svg viewBox="0 0 220 190" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;display:block;margin:10px auto">
    <polygon points="110,18 158,38 180,90 158,148 110,168 62,148 40,90 62,38" fill="none" stroke="#9CA8C7" stroke-width="1.8"/>
    <line x1="180" y1="90" x2="215" y2="90" stroke="#9CA8C7" stroke-width="1.5" stroke-dasharray="4,3"/>
    <path d="M185,90 A18,18 0 0,0 200,72" fill="none" stroke="#9D5CFF" stroke-width="1.8"/>
    <text x="202" y="71" fill="#9D5CFF" font-size="14" font-family="Inter,sans-serif" font-weight="bold">x</text>
    <text x="12" y="15" fill="#9D5CFF" font-size="9" font-family="Inter,sans-serif">Not drawn accurately (assume octagon)</text>
  </svg>`,

  hemisphere_bowl: `<svg viewBox="0 0 220 140" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;display:block;margin:10px auto">
    <path d="M22,80 Q110,-15 198,80" fill="none" stroke="#9CA8C7" stroke-width="2"/>
    <line x1="22" y1="80" x2="198" y2="80" stroke="#9CA8C7" stroke-width="2"/>
    <path d="M38,80 Q110,30 182,80 Z" fill="rgba(59,130,255,.12)" stroke="#3B82FF" stroke-width="1.2"/>
    <line x1="110" y1="80" x2="198" y2="80" stroke="#F5B700" stroke-width="1.5"/>
    <text x="148" y="75" fill="#F5B700" font-size="11" font-family="Inter,sans-serif">r = 12 cm</text>
    <text x="70" y="60" fill="#3B82FF" font-size="10" font-family="Inter,sans-serif">Water</text>
    <text x="30" y="115" fill="#9CA8C7" font-size="10" font-family="Inter,sans-serif">325 cm³/s for 8 seconds</text>
    <text x="12" y="15" fill="#9D5CFF" font-size="9" font-family="Inter,sans-serif">Volume of sphere = 4/3 πr³</text>
  </svg>`,

  isosceles_tri: `<svg viewBox="0 0 210 170" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;display:block;margin:10px auto">
    <polygon points="105,15 185,148 25,148" fill="none" stroke="#9CA8C7" stroke-width="2"/>
    <line x1="64" y1="80" x2="60" y2="90" stroke="#9CA8C7" stroke-width="1.5"/>
    <line x1="70" y1="77" x2="66" y2="87" stroke="#9CA8C7" stroke-width="1.5"/>
    <line x1="146" y1="77" x2="150" y2="87" stroke="#9CA8C7" stroke-width="1.5"/>
    <line x1="152" y1="80" x2="156" y2="90" stroke="#9CA8C7" stroke-width="1.5"/>
    <text x="100" y="10" fill="#9CA8C7" font-size="12" font-family="Inter,sans-serif">A</text>
    <text x="188" y="156" fill="#9CA8C7" font-size="12" font-family="Inter,sans-serif">B</text>
    <text x="14" y="156" fill="#9CA8C7" font-size="12" font-family="Inter,sans-serif">C</text>
    <text x="30" y="80" fill="#F5B700" font-size="10" font-family="Inter,sans-serif">AB = AC</text>
    <text x="55" y="164" fill="#9CA8C7" font-size="10" font-family="Inter,sans-serif">Perimeter = 22 cm, BC = ?</text>
    <text x="12" y="15" fill="#9D5CFF" font-size="9" font-family="Inter,sans-serif">Not drawn accurately</text>
  </svg>`,

  triangle_3y: `<svg viewBox="0 0 210 170" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;display:block;margin:10px auto">
    <polygon points="105,15 188,148 22,148" fill="none" stroke="#9CA8C7" stroke-width="2"/>
    <text x="96" y="38" fill="#9D5CFF" font-size="14" font-family="Inter,sans-serif" font-weight="bold">x</text>
    <text x="162" y="140" fill="#F5B700" font-size="13" font-family="Inter,sans-serif" font-weight="bold">y</text>
    <text x="30" y="140" fill="#F5B700" font-size="13" font-family="Inter,sans-serif" font-weight="bold">y</text>
    <text x="65" y="164" fill="#9CA8C7" font-size="11" font-family="Inter,sans-serif">x = 3y, find y</text>
    <text x="12" y="15" fill="#9D5CFF" font-size="9" font-family="Inter,sans-serif">Not drawn accurately</text>
  </svg>`,

  number_line_pos: `<svg viewBox="0 0 270 62" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;display:block;margin:10px auto">
    <line x1="18" y1="32" x2="252" y2="32" stroke="#9CA8C7" stroke-width="2"/>
    ${[0,10,20,30,40,50,60].map((v,i)=>`<line x1="${18+i*33}" y1="26" x2="${18+i*33}" y2="38" stroke="#9CA8C7" stroke-width="1.5"/><text x="${14+i*33}" y="52" fill="#9CA8C7" font-size="11" font-family="Inter,sans-serif">${v}</text>`).join('')}
    <line x1="112" y1="20" x2="112" y2="38" stroke="#F5B700" stroke-width="2.5"/>
    <text x="105" y="16" fill="#F5B700" font-size="13" font-family="Inter,sans-serif" font-weight="bold">X</text>
  </svg>`,

  number_line_neg: `<svg viewBox="0 0 270 62" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;display:block;margin:10px auto">
    <line x1="18" y1="32" x2="252" y2="32" stroke="#9CA8C7" stroke-width="2"/>
    ${[-3,-2,-1,0,1,2,3].map((v,i)=>`<line x1="${18+i*33}" y1="26" x2="${18+i*33}" y2="38" stroke="#9CA8C7" stroke-width="1.5"/><text x="${v<0?10+i*33:14+i*33}" y="52" fill="#9CA8C7" font-size="11" font-family="Inter,sans-serif">${v}</text>`).join('')}
    <line x1="85" y1="20" x2="85" y2="38" stroke="#9D5CFF" stroke-width="2.5"/>
    <text x="78" y="16" fill="#9D5CFF" font-size="13" font-family="Inter,sans-serif" font-weight="bold">Y</text>
  </svg>`,

  similar_rects: `<svg viewBox="0 0 230 120" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;display:block;margin:10px auto">
    <rect x="10" y="20" width="80" height="50" fill="none" stroke="#9CA8C7" stroke-width="2"/>
    <text x="48" y="14" fill="#9CA8C7" font-size="11" text-anchor="middle" font-family="Inter,sans-serif">8 cm</text>
    <text x="96" y="48" fill="#9CA8C7" font-size="11" font-family="Inter,sans-serif">5 cm</text>
    <rect x="122" y="20" width="96" height="60" fill="none" stroke="#9CA8C7" stroke-width="2"/>
    <text x="170" y="14" fill="#9CA8C7" font-size="11" text-anchor="middle" font-family="Inter,sans-serif">19.2 cm</text>
    <text x="220" y="53" fill="#9CA8C7" font-size="11" font-family="Inter,sans-serif">12 cm</text>
    <text x="10" y="110" fill="#9D5CFF" font-size="9" font-family="Inter,sans-serif">Show these rectangles are similar</text>
  </svg>`,

  venn_af: `<svg viewBox="0 0 230 165" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;display:block;margin:10px auto">
    <rect x="8" y="8" width="212" height="148" fill="none" stroke="#9CA8C7" stroke-width="1.5" rx="4"/>
    <text x="14" y="22" fill="#9CA8C7" font-size="10" font-family="Inter,sans-serif">ξ = 98 students</text>
    <circle cx="88" cy="92" r="46" fill="rgba(157,92,255,.1)" stroke="#9D5CFF" stroke-width="1.5"/>
    <circle cx="140" cy="92" r="46" fill="rgba(59,130,255,.1)" stroke="#3B82FF" stroke-width="1.5"/>
    <text x="56" y="76" fill="#9D5CFF" font-size="13" font-family="Inter,sans-serif" font-weight="bold">A</text>
    <text x="162" y="76" fill="#3B82FF" font-size="13" font-family="Inter,sans-serif" font-weight="bold">F</text>
    <text x="60" y="96" fill="#F5F7FB" font-size="14" font-family="Inter,sans-serif" font-weight="bold">10</text>
    <text x="104" y="96" fill="#F5F7FB" font-size="14" font-family="Inter,sans-serif" font-weight="bold">25</text>
    <text x="152" y="96" fill="#F5F7FB" font-size="14" font-family="Inter,sans-serif" font-weight="bold">16</text>
    <text x="192" y="145" fill="#9CA8C7" font-size="13" font-family="Inter,sans-serif" font-weight="bold">48</text>
    <text x="10" y="158" fill="#5A6480" font-size="9" font-family="Inter,sans-serif">A=Art  F=French  (Joel's diagram — find 2 errors)</text>
  </svg>`,

  translation_grid: `<svg viewBox="0 0 230 210" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;display:block;margin:10px auto">
    ${Array.from({length:10},(_,i)=>`<line x1="20" y1="${20+i*20}" x2="210" y2="${20+i*20}" stroke="#2A3552" stroke-width="1"/>`).join('')}
    ${Array.from({length:10},(_,i)=>`<line x1="${20+i*20}" y1="20" x2="${20+i*20}" y2="200" stroke="#2A3552" stroke-width="1"/>`).join('')}
    <polygon points="40,60 80,60 80,80 60,80 60,100 40,100" fill="rgba(157,92,255,.15)" stroke="#9D5CFF" stroke-width="2"/>
    <text x="50" y="83" fill="#9D5CFF" font-size="12" font-family="Inter,sans-serif" font-weight="bold">A</text>
    <polygon points="120,120 160,120 160,140 140,140 140,160 120,160" fill="rgba(59,130,255,.15)" stroke="#3B82FF" stroke-width="2"/>
    <text x="130" y="143" fill="#3B82FF" font-size="12" font-family="Inter,sans-serif" font-weight="bold">B</text>
    <line x1="80" y1="80" x2="118" y2="118" stroke="#5A6480" stroke-width="1" stroke-dasharray="3,3"/>
  </svg>`,
}

// ─── Topic groups ─────────────────────────────────────────────────────────────
// Each topic has: id, label, icon, colour, description, calculator flag,
// and an array of questions from AQA past papers.

export const MATHS_TOPIC_GROUPS = [
  {
    id: 'number',
    label: 'Number',
    icon: '123',
    color: '#3B82FF',
    bg: 'rgba(59,130,255,.12)',
    border: 'rgba(59,130,255,.28)',
    description: 'Multiples, factors, primes, powers, negative numbers, place value',
    calculator: false,
    questions: [
      {
        id: 'n1', qNum: '1(a)', source: 'JUN23 P1', marks: 1,
        q: 'Here is a list of numbers:\n\n  14  9  20  29  3  45  33\n\nWhich number is a multiple of 4?',
        ms: '20\n[B1]',
      },
      {
        id: 'n2', qNum: '1(b)', source: 'JUN23 P1', marks: 1,
        q: 'Here is a list of numbers:\n\n  14  9  20  29  3  45  33\n\nWhich number is a square number?',
        ms: '9\n[B1]',
      },
      {
        id: 'n3', qNum: '1(c)', source: 'JUN23 P1', marks: 1,
        q: 'Here is a list of numbers:\n\n  14  9  20  29  3  45  33\n\nWhich TWO numbers have a total of 43?',
        ms: '14 and 29 (either order)\n[B1]',
      },
      {
        id: 'n4', qNum: '1(d)', source: 'JUN23 P1', marks: 1,
        q: 'Here is a list of numbers:\n\n  14  9  20  29  3  45  33\n\nWork out: largest number in the list ÷ smallest number in the list',
        ms: '15\n[B1]',
      },
      {
        id: 'n5', qNum: '1(a)', source: 'JUN22 P1', marks: 1, type: 'mc',
        q: 'Circle the answer to 150 ÷ 5',
        options: ['3', '30', '300', '3000'], correctIndex: 1,
        ms: '30\n[B1]',
      },
      {
        id: 'n6', qNum: '3', source: 'JUN22 P1', marks: 3,
        q: 'By rounding each number to the nearest 10, estimate the value of:\n\n  31 × 18\n\nShow your working.',
        ms: '600\n[B1: 30 (rounding 31), B1: 20 (rounding 18), B1ft: 30×20=600]',
      },
      {
        id: 'n7', qNum: '18', source: 'JUN22 P1', marks: 2,
        q: 'Work out 80 000 000 ÷ 200\n\nGive your answer in standard form.',
        ms: '4 × 10⁵\n[B2: 4×10⁵\nB1: 400 000 correct but not in standard form]',
      },
      {
        id: 'n8', qNum: '18', source: 'JUN23 P1', marks: 3,
        q: 'Two prime numbers are multiplied together. The answer is an even number between 50 and 60.\n\nComplete the calculation:\n\n  ___ × ___ = ___',
        ms: '2 × 29 = 58\n[B3: all five conditions met (both prime, both evaluated, even, in range 50-60)\nB2: four conditions met\nB1: three conditions met]',
      },
    ],
  },

  {
    id: 'negatives',
    label: 'Negative Numbers',
    icon: '±',
    color: '#FF5C7A',
    bg: 'rgba(255,92,122,.12)',
    border: 'rgba(255,92,122,.28)',
    description: 'Directed numbers, multiplying and dividing negatives, powers',
    calculator: false,
    questions: [
      {
        id: 'neg1', qNum: '3(a)', source: 'JUN23 P1', marks: 1,
        q: 'Work out:  (−4) × (−3)',
        ms: '12 (or +12)\n[B1]',
      },
      {
        id: 'neg2', qNum: '3(b)', source: 'JUN23 P1', marks: 1,
        q: 'Work out:  6 × (−5)',
        ms: '−30\n[B1]',
      },
      {
        id: 'neg3', qNum: '3(c)', source: 'JUN23 P1', marks: 1,
        q: 'Work out:  (−8)²',
        ms: '64 (or +64)\n[B1 — note: squaring a negative gives a positive]',
      },
      {
        id: 'neg4', qNum: '3(d)', source: 'JUN23 P1', marks: 1,
        q: 'Work out:  10³',
        ms: '1000\n[B1]',
      },
      {
        id: 'neg5', qNum: '1(b)', source: 'JUN22 P1', marks: 1, type: 'mc',
        q: 'Circle the answer to:  5 − 7',
        options: ['−12', '−2', '2', '12'], correctIndex: 1,
        ms: '−2\n[B1]',
      },
      {
        id: 'neg6', qNum: '1(c)', source: 'JUN22 P1', marks: 1, type: 'mc',
        q: 'Circle the answer to:  −3 × 3',
        options: ['−9', '−6', '6', '9'], correctIndex: 0,
        ms: '−9\n[B1]',
      },
      {
        id: 'neg7', qNum: '1(a)', source: 'JUN23 P2', marks: 1, diagramKey: 'number_line_neg',
        q: 'Here is a number line from −3 to +3.\n[See diagram]\n\nWhat number is at Y?',
        ms: '−2\n[B1]',
      },
    ],
  },

  {
    id: 'fractions',
    label: 'Fractions',
    icon: '½',
    color: '#9D5CFF',
    bg: 'rgba(157,92,255,.12)',
    border: 'rgba(157,92,255,.28)',
    description: 'Simplifying, adding, subtracting, multiplying, dividing fractions and mixed numbers',
    calculator: false,
    questions: [
      {
        id: 'fr1', qNum: '4', source: 'JUN23 P1', marks: 2,
        q: 'Write 18 out of 30 as a fraction in its simplest form.',
        ms: '3/5\n[B2: 3/5\nB1: 18/30 or any correct unsimplified equivalent]',
      },
      {
        id: 'fr2', qNum: '6(a)', source: 'JUN23 P1', marks: 1,
        q: 'Write 3²⁄₅ as an improper fraction.',
        ms: '17/5\n[B1 — accept any correct improper fraction, ignore attempts to simplify]',
      },
      {
        id: 'fr3', qNum: '6(b)', source: 'JUN23 P1', marks: 1,
        q: 'Write 0.19 as a fraction.',
        ms: '19/100\n[B1 — accept any equivalent fraction, ignore incorrect simplification after correct answer]',
      },
      {
        id: 'fr4', qNum: '12', source: 'JUN22 P1', marks: 2,
        q: 'Work out:  11/18 − 1/3',
        ms: '5/18\n[M1: correct common denominator (18ths) → 11/18 − 6/18\nA1: 5/18]',
      },
      {
        id: 'fr5', qNum: '25', source: 'JUN23 P1', marks: 4,
        q: 'Work out:  2⅓ ÷ 4/5\n\nGive your answer as a mixed number.',
        ms: '2 11/12\n[M1: convert 2⅓ to improper fraction → 7/3\nM1: multiply by reciprocal → 7/3 × 5/4\nA1: 35/12\nA1ft: 2 11/12 as mixed number]',
      },
      {
        id: 'fr6', qNum: '10(a)', source: 'JUN23 P2', marks: 2,
        q: 'There are 1020 books in a box.\n\n2/5 of the books are blue.\n\nHow many books are blue?',
        ms: '408\n[M1: 1020 ÷ 5 (= 204) or ×2 seen\nA1: 408\nSC1: 612 (3/5 used instead)]',
      },
      {
        id: 'fr7', qNum: '10(b)', source: 'JUN23 P2', marks: 1,
        q: 'There are green pens and red pens in a box.\nThe ratio of green : red = 4 : 3\n\nWhat fraction of the pens are green?',
        ms: '4/7\n[B1 — do not accept decimal or percentage]',
      },
      {
        id: 'fr8', qNum: '10(a)', source: 'JUN22 P1', marks: 2,
        q: 'A triangle has sides 120 mm, 120 mm and 40 mm.\n\nWork out:\n  length of shortest side ÷ length of longest side\n\nGive your answer as a fraction in its simplest form.',
        ms: '1/3\n[B2: 1/3\nB1: 40/120 or equivalent unsimplified fraction]',
      },
    ],
  },

  {
    id: 'percentages',
    label: 'Percentages',
    icon: '%',
    color: '#FF8A1F',
    bg: 'rgba(255,138,31,.12)',
    border: 'rgba(255,138,31,.28)',
    description: 'Percentage of amounts, increase/decrease, percentage change, best value',
    calculator: true,
    questions: [
      {
        id: 'pc1', qNum: '12', source: 'JUN23 P1', marks: 1,
        q: 'Monthly electricity bills:\n• October: £120\n• November: £240\n\nWrite down the percentage increase from October to November.',
        ms: '100%\n[B1]',
      },
      {
        id: 'pc2', qNum: '15', source: 'JUN23 P1', marks: 3, diagramKey: 'rect_with_hole',
        q: 'A large rectangle (20 cm × 15 cm) has a rectangular hole (10 cm × 6 cm) cut out.\n[See diagram — the shaded area is the large rectangle minus the hole]\n\nWork out the percentage of the large rectangle that is shaded.',
        ms: '70%\n[M1: large area = 20×15=300 or small area = 10×6=60\nM1dep: (300−60)÷300 or 240÷300\nA1: 70%\nSC2: 44.4% (used perimeter method)]',
      },
      {
        id: 'pc3', qNum: '13', source: 'JUN23 P2', marks: 4,
        q: '28 is increased by 25%.\n40 is decreased by 15%.\n\nWhich answer is bigger? Show all your working.',
        ms: '28 increased by 25% = 35 (bigger)\n[M1: 28×0.25=7 or 40×0.15=6\nM1dep: 28+7=35 or 40−6=34 (one calculation correct)\nM1dep: both calculations correct\nA1: 35 with 34 also seen]',
      },
      {
        id: 'pc4', qNum: '9', source: 'JUN22 P1', marks: 4,
        q: 'Shona has 14 dresses.\n50% of these dresses are red.\nShe gives 5 of her red dresses to a charity shop.\nShe buys 1 new red dress.\n\nWhat percentage of the dresses she now has are red?',
        ms: '30%\n[M1: 50%×14=7 red dresses initially\nM1: 14−5+1=10 total dresses and 7−5+1=3 red\nA1: 3/10\nB1ft: 30% (correct conversion of their fraction)]',
      },
      {
        id: 'pc5', qNum: '10(c)', source: 'JUN23 P2', marks: 2,
        q: 'There are some calculators in a box.\n• 220 are scientific.\n• 30 are not scientific.\n\nWhat percentage of the calculators are scientific?',
        ms: '88%\n[M1: 220÷250 (×100) or 0.88\nA1: 88]',
      },
      {
        id: 'pc6', qNum: '5(b)', source: 'JUN23 P2', marks: 4,
        q: 'Two shops sell bottles of apple juice:\n• Shop X: pack of 4 bottles, was £2.50, now 10% off\n• Shop Z: pack of 12 bottles for £7\n\nAt which shop is it cheaper to buy 24 bottles? Show your working.',
        ms: 'Shop X is cheaper (£13.50 vs £14.00)\n[M1: 2.50×0.1=0.25 or 0.9 multiplier for Shop X\nM1dep: (2.50−0.25)×6=13.50 or 2.25×6 for Shop X total for 24\nM1: 7×2=14 for Shop Z total for 24\nA1: X with 13.5(0) and 14 both seen]',
      },
    ],
  },

  {
    id: 'ratio',
    label: 'Ratio & Proportion',
    icon: ':',
    color: '#34D5FF',
    bg: 'rgba(52,213,255,.12)',
    border: 'rgba(52,213,255,.28)',
    description: 'Sharing in ratios, equivalent ratios, proportion, best value',
    calculator: false,
    questions: [
      {
        id: 'r1', qNum: '19', source: 'JUN23 P1', marks: 4,
        q: 'Andrew and Bruce share some money in the ratio 5 : 6.\n\nBruce gets £96.\n\nAndrew gives ¼ of his share to Carl.\nBruce gives ⅔ of his share to Carl.\n\nHow much money does Carl receive in total?',
        ms: '£84\n[M1: 5/6×96 or 80 (Andrew\'s share)\nM1dep: 1/4×80=20 (Andrew gives to Carl)\nM1: 2/3×96=64 (Bruce gives to Carl)\nA1: 84]',
      },
      {
        id: 'r2', qNum: '12', source: 'JUN23 P2', marks: 2, type: 'mc',
        q: 'Kai says that 3 : 2 is an equivalent ratio to 9 : 6.\nJo says that 1.5 : 1 is an equivalent ratio to 9 : 6.\n\nWho is correct?',
        options: ['Both of them', 'Kai only', 'Jo only', 'Neither of them'],
        correctIndex: 0,
        ms: 'Both of them\n[B2: ticks "Both" AND gives valid reason for Kai (÷3 or ×3 link) AND valid reason for Jo (÷6 or ×6 link)\nB1: ticks "Both" with valid reason for one of them]',
      },
      {
        id: 'r3', qNum: '11', source: 'JUN23 P1', marks: 2,
        q: 'Convert 7 gallons to litres.\n\nUse:  1 gallon = 4.5 litres',
        ms: '31.5 litres\n[M1: 4.5×7\nA1: 31.5]',
      },
      {
        id: 'r4', qNum: '17', source: 'JUN23 P2', marks: 4,
        q: 'Jess saves 2p, 5p and 10p coins.\nShe has:\n• 45 ten-pence coins\n• 8 times as many 2p coins as 10p coins\n• £17.70 in total\n\nWork out:  total value of 2p coins : total value of 5p coins\n\nGive your answer in its simplest form.',
        ms: '6 : 5\n[M1: 45×8=360 (number of 2p coins)\nM1dep: 360×2=720p = £7.20 (value of 2p coins)\nM1dep: £17.70−£7.20−£4.50=£6.00 (value of 5p coins)\nA1: 6:5]',
      },
    ],
  },

  {
    id: 'algebra',
    label: 'Algebra',
    icon: 'xⁿ',
    color: '#4DFF88',
    bg: 'rgba(77,255,136,.1)',
    border: 'rgba(77,255,136,.25)',
    description: 'Substitution, expanding brackets, factorising, rearranging, forming equations',
    calculator: false,
    questions: [
      {
        id: 'al1', qNum: '8(a)', source: 'JUN23 P1', marks: 2,
        q: 'T = 5P − W\n\nWork out the value of T when P = 4 and W = 2.',
        ms: 'T = 18\n[M1: 5×4=20\nA1: 18]',
      },
      {
        id: 'al2', qNum: '8(b)', source: 'JUN23 P1', marks: 3,
        q: 'T = 5P − W\n\nWork out the value of P when T = −40 and W = 10.\n\nShow your working.',
        ms: 'P = −6\n[M1: −40+10=−30 or −40=5P−10\nM1dep: ÷5\nA1: −6\nSC2: −10 with −50 seen in working]',
      },
      {
        id: 'al3', qNum: '22', source: 'JUN23 P1', marks: 2,
        q: 'Expand and simplify fully:\n\n  5(3x + 4) − 2(x − 1)',
        ms: '13x + 22\n[B2: correct answer\nB1: 15x+20 seen, or −2x+2 seen, or 13x+a (any a), or bx+22 (any b)]',
      },
      {
        id: 'al4', qNum: '14', source: 'JUN23 P2', marks: 1,
        q: 'Factorise:  12a + 15b',
        ms: '3(4a + 5b)\n[B1 — condone missing final bracket]',
      },
      {
        id: 'al5', qNum: '24', source: 'JUN23 P1', marks: 5,
        q: 'Sunita is x years old.\nBeth is one year younger than Sunita.\nJoel is double Sunita\'s age.\n\nThe mean of their three ages is 5.\n\nHow old is Joel?\n\nYou must show your working.',
        ms: 'Joel is 8\n[M1: 5×3=15 (total of ages)\nM1: expressions x−1 and 2x\nM1dep: x+(x−1)+2x=15 or 4x−1=15\nM1dep: x=4 (solving)\nA1: 8]',
      },
      {
        id: 'al6', qNum: '2', source: 'JUN22 P1', marks: 1, type: 'mc',
        q: 'P is double r.\n\nCircle the correct formula.',
        options: ['P = r/2', 'P = r + 2', 'P = r − 2', 'P = 2r'],
        correctIndex: 3,
        ms: 'P = 2r\n[B1]',
      },
    ],
  },

  {
    id: 'sequences',
    label: 'Sequences',
    icon: '…',
    color: '#C18CFF',
    bg: 'rgba(193,140,255,.12)',
    border: 'rgba(193,140,255,.28)',
    description: 'Term-to-term rules, nth term, arithmetic sequences',
    calculator: false,
    questions: [
      {
        id: 'seq1', qNum: '16', source: 'JUN23 P2', marks: 2,
        q: 'A linear sequence starts:\n\n  7  10  13  16  …\n\nWork out an expression for the nth term of the sequence.',
        ms: '3n + 4\n[B2: correct answer (accept 4 + 3n)\nB1: 3n seen (with any constant)]',
      },
      {
        id: 'seq2', qNum: '13(a)', source: 'JUN22 P1', marks: 3,
        q: 'The term-to-term rule for a sequence is:\n\n  multiply by 2\n\nThe 3rd term of the sequence is 46.\n\nWork out the 1st term. Give your answer as a decimal.',
        ms: '11.5\n[M1: 46÷2=23 (working backwards one step)\nM1dep: 23÷2\nA1: 11.5]',
      },
      {
        id: 'seq3', qNum: '13(b)', source: 'JUN22 P1', marks: 3,
        q: 'The term-to-term rule for a different sequence is:\n\n  subtract k\n\nThe 1st term is 34.\nThe 4th term is 10.\n\nWork out the value of k.',
        ms: 'k = 8\n[M1: 34−10=24 or setting up 3k=24\nM1dep: ÷3\nA1: 8\nSC2: −8]',
      },
    ],
  },

  {
    id: 'inequalities',
    label: 'Inequalities',
    icon: '≤',
    color: '#FFC857',
    bg: 'rgba(255,200,87,.1)',
    border: 'rgba(255,200,87,.25)',
    description: 'Writing, solving and representing inequalities on number lines',
    calculator: false,
    questions: [
      {
        id: 'ineq1', qNum: '15', source: 'JUN23 P2', marks: 2,
        q: 'Write down all the integers that satisfy the inequality:\n\n  −3 ≤ x < 2',
        ms: '−3, −2, −1, 0, 1\n[B2: all 5 correct with none incorrect\nB1: 4 correct with none incorrect, or 5 correct with exactly 1 incorrect]',
      },
    ],
  },

  {
    id: 'angles',
    label: 'Angles & Geometry',
    icon: '∠',
    color: '#38D27A',
    bg: 'rgba(56,210,122,.12)',
    border: 'rgba(56,210,122,.28)',
    description: 'Angles on lines, in triangles, polygons, parallel lines, bearings',
    calculator: false,
    questions: [
      {
        id: 'ang1', qNum: '17', source: 'JUN23 P1', marks: 3, diagramKey: 'angle_lines',
        q: 'ABC, BD and BE are straight lines.\n[See diagram]\n\nangle EBD = 5 × angle ABE\nangle DBC = 3 × angle ABE\n\nWork out the size of angle EBD.',
        ms: '100°\n[M1: 1+5+3=9 parts, or x+5x+3x with angles on line\nM1dep: 180÷9=20 (one part)\nA1: 100]',
      },
      {
        id: 'ang2', qNum: '4', source: 'JUN22 P1', marks: 3, diagramKey: 'isosceles_tri',
        q: 'In this isosceles triangle, AB = AC.\n[See diagram]\n\nThe perimeter of the triangle is 22 cm.\n\nWork out the length of AB.',
        ms: '9 cm\n[M1: 22−4=18 or 22÷2=11 or 4÷2=2\nM1dep: 18÷2 or 11−2\nA1: 9\nSC1: 20 or 14]',
      },
      {
        id: 'ang3', qNum: '10(b)', source: 'JUN22 P1', marks: 3, diagramKey: 'triangle_3y',
        q: 'In a triangle, x = 3y.\n[See diagram — x is the top angle, y is each base angle]\n\nWork out the size of angle y.',
        ms: 'y = 17°\n[M1: 180−112=68 or 3y+y+112=180 (angles in triangle)\nM1dep: 68÷4\nA1: 17]',
      },
      {
        id: 'ang4', qNum: '19(a)', source: 'JUN23 P2', marks: 2, diagramKey: 'octagon_angle',
        q: 'Part of a regular polygon is shown. Assume it is an octagon.\n[See diagram]\n\nWork out the size of angle x.',
        ms: '45°\n[M1: 360÷8=45 (exterior angle) or interior angle=(8−2)×180÷8=135 then 180−135\nA1: 45]',
      },
      {
        id: 'ang5', qNum: '19(b)', source: 'JUN23 P2', marks: 1, type: 'mc',
        q: 'The polygon actually has MORE sides than an octagon.\nWhat does this mean about the size of angle x?',
        options: [
          'It is more than 45°',
          'It is the same as 45°',
          'It is less than 45°',
          'It could be any of the above',
        ],
        correctIndex: 2,
        ms: 'It is less than 45°\n[B1 — more sides → larger interior angles → smaller exterior angle x]',
      },
    ],
  },

  {
    id: 'area_volume',
    label: 'Area & Volume',
    icon: '□',
    color: '#F5B700',
    bg: 'rgba(245,183,0,.12)',
    border: 'rgba(245,183,0,.28)',
    description: 'Area of shapes, surface area, volume of 3D solids including spheres',
    calculator: true,
    questions: [
      {
        id: 'av1', qNum: '15', source: 'JUN23 P1', marks: 3, diagramKey: 'rect_with_hole',
        q: 'A large rectangle (20 cm × 15 cm) has a rectangular hole (10 cm × 6 cm) cut out.\n[See diagram]\n\nWork out the area of the shaded region.',
        ms: '240 cm²\n[M1: 20×15=300 or 10×6=60\nM1dep: 300−60\nA1: 240]',
      },
      {
        id: 'av2', qNum: '21', source: 'JUN23 P2', marks: 4, diagramKey: 'hemisphere_bowl',
        q: 'A bowl is a hemisphere with radius 12 cm.\nWater is poured in at 325 cm³ per second for 8 seconds.\n\nVolume of a sphere = 4/3 πr³\n\nDoes the water fill more than 70% of the bowl?\nYou must show your working.',
        ms: 'Yes — approximately 71.8%\nVolume of hemisphere = ½ × 4/3 × π × 12³ ≈ 3619 cm³\nVolume of water = 325 × 8 = 2600 cm³\n2600 ÷ 3619 ≈ 71.8% > 70% ✓\n[M1: 4/3 × π × 12³ or 2304π seen\nM1dep: ÷2 for hemisphere → 1152π\nM1: 325×8=2600\nA1: Yes with correct working showing >70%]',
      },
    ],
  },

  {
    id: 'similarity',
    label: 'Similarity & Scale',
    icon: '⤢',
    color: '#70B8FF',
    bg: 'rgba(112,184,255,.12)',
    border: 'rgba(112,184,255,.28)',
    description: 'Similar shapes, scale factors, proving similarity',
    calculator: false,
    questions: [
      {
        id: 'sim1', qNum: '22', source: 'JUN23 P2', marks: 2, diagramKey: 'similar_rects',
        q: 'Show that these two rectangles are similar.\n[See diagram: 8 cm × 5 cm and 19.2 cm × 12 cm]',
        ms: '8÷5 = 1.6 and 19.2÷12 = 1.6, so the sides are in the same ratio → similar.\n[M1: correct ratio of a valid pair of corresponding sides, e.g. 8÷5 or 19.2÷12\nA1: both ratios evaluated and shown equal (1.6)]',
      },
    ],
  },

  {
    id: 'transforms',
    label: 'Transformations',
    icon: '↔',
    color: '#FF4FC3',
    bg: 'rgba(255,79,195,.12)',
    border: 'rgba(255,79,195,.28)',
    description: 'Translations, reflections, rotations, enlargements, vectors',
    calculator: false,
    questions: [
      {
        id: 'tr1', qNum: '14', source: 'JUN22 P1', marks: 2,
        q: 'Work out the translation vector that maps shape A to shape B on the grid.\n\nShape A is at approximately (1,2). Shape B is at approximately (4,1) after moving 7 right and 2 down.\n\nWrite your answer as a column vector.',
        ms: '(7 on top, −2 below) — 7 right and 2 down\n[B2: correct column vector\nB1: one component correct\nSC1: (−7, 2)]',
      },
      {
        id: 'tr2', qNum: '20', source: 'JUN23 P2', marks: 2, diagramKey: 'translation_grid',
        q: 'Write down the translation vector that maps shape A onto shape B.\n[See diagram]',
        ms: '(4 on top, −3 below) — 4 right and 3 down\n[B2: correct column vector\nB1: one component correct\nSC1: (−4, 3)]',
      },
    ],
  },

  {
    id: 'statistics',
    label: 'Statistics & Data',
    icon: '📊',
    color: '#6BFFB0',
    bg: 'rgba(107,255,176,.1)',
    border: 'rgba(107,255,176,.25)',
    description: 'Mean, median, mode, range, averages, scatter graphs, outliers',
    calculator: false,
    questions: [
      {
        id: 'st1', qNum: '8(a)', source: 'JUN22 P1', marks: 2,
        q: 'For a set of five numbers:\n• the mode is 8\n• the median is 12\n\nWrite down ONE possible set of five numbers.',
        ms: 'Any valid set, e.g. 8, 8, 12, 15, 20\n[B2: both mode=8 AND median=12 conditions met\nB1: one condition met]',
      },
      {
        id: 'st2', qNum: '8(b)', source: 'JUN22 P1', marks: 1,
        q: 'Here are the heights (cm) of some children:\n\n  98  103  91  85  159  102  91\n\nWhich value is an outlier?',
        ms: '159 cm\n[B1]',
      },
      {
        id: 'st3', qNum: '14', source: 'JUN23 P1', marks: 3,
        q: 'Here is data about people visiting a gym one week:\n\n              % of visitors  Mean hours  Range of hours\nMembers:           64             4              6\nGuests:            36            2.5             8\n\nMake THREE comparisons between members and guests.',
        ms: 'Any three from:\n1. PROPORTION: There were more members than guests (64% vs 36%)\n2. AVERAGE: Members visited for longer on average (mean 4h vs 2.5h)\n3. SPREAD: Guest visiting times were more spread out (range 8h vs 6h)\n[B1 each — must reference the correct statistic and direction of comparison]',
      },
    ],
  },

  {
    id: 'probability',
    label: 'Probability',
    icon: '🎲',
    color: '#FF8A1F',
    bg: 'rgba(255,138,31,.12)',
    border: 'rgba(255,138,31,.28)',
    description: 'Basic probability, listing outcomes, Venn diagrams, expected frequency',
    calculator: false,
    questions: [
      {
        id: 'prob1', qNum: '15', source: 'JUN22 P1', marks: 4,
        q: 'In a bag there are only red, blue and green discs.\nThere are 10 red discs.\n\nWhen one disc is picked at random:\n• P(red) = 1/8\n• P(blue) = 2/5\n\nHow many green discs are in the bag?',
        ms: '38 green discs\n[M1: 10×8=80 (total discs)\nM1dep: 2/5×80=32 (blue discs)\nM1dep: 80−32−10=38\nA1: 38]',
      },
      {
        id: 'prob2', qNum: '20', source: 'JUN22 P1', marks: 2, diagramKey: 'venn_af',
        q: 'In a group of 98 students:\n• 25 study both Art and French\n• 10 study Art but not French\n• 41 study French\n\n[See diagram — Joel\'s Venn diagram has errors]\n\nMake TWO criticisms of Joel\'s diagram.',
        ms: 'Criticism 1: The circles are not labelled (A for Art, F for French missing)\nCriticism 2: The numbers do not add up to 98 — the value 48 outside both circles should be 47 (since 10+25+16=51, meaning 98−51=47 are in neither)\n[B1 each]',
      },
      {
        id: 'prob3', qNum: '18(b)', source: 'JUN23 P2', marks: 1,
        q: 'A game uses a dice (1–6) and a spinner with expressions 2x, 3x, and x².\nThe score is the dice number substituted into the spinner expression.\n\nThe possible scores are:\n  2x:  2, 4, 6, 8, 10, 12\n  3x:  3, 6, 9, 12, 15, 18\n  x²:  1, 4, 9, 16, 25, 36\n\nA player wins if their score is 10 or more.\n\nWork out the probability that they win.',
        ms: '8/18 = 4/9\nScores ≥10: from 2x: 10,12 (2); from 3x: 12,15,18 (3); from x²: 16,25,36 (3) = 8 winning scores out of 18 total\n[B1 — accept 8/18, 4/9, 0.44(4...) or 44.4%]',
      },
    ],
  },

  {
    id: 'speed_density',
    label: 'Speed, Density & Pressure',
    icon: '⚡',
    color: '#3B82FF',
    bg: 'rgba(59,130,255,.12)',
    border: 'rgba(59,130,255,.28)',
    description: 'Speed = distance/time, density = mass/volume, pressure = force/area',
    calculator: true,
    questions: [
      {
        id: 'spd1', qNum: '16', source: 'JUN23 P1', marks: 3,
        q: 'Liz travels 18 miles in 20 minutes.\n\nWork out her average speed in miles per hour.',
        ms: '54 mph\n[M1: 60÷20=3 (converting 20 min to fraction of hour) or 20÷60=1/3\nM1dep: 18×3 or full method\nA1: 54]',
      },
      {
        id: 'spd2', qNum: '9(b)', source: 'JUN23 P2', marks: 3,
        q: 'A TV series has ten episodes:\n• Nine episodes are each 50 minutes long\n• One episode is 1 hour 42 minutes long\n\nWork out the total length of the series.\nGive your answer in hours and minutes.',
        ms: '9 hours 12 minutes\n[M1: 9×50=450 min (or 7h 30min)\nM1dep: 450+102=552 min (add the long episode)\nA1: 9h 12min\nSC2: 9h 32min (added 7h 50min + 1h 42min)]',
      },
    ],
  },

  {
    id: 'money_worded',
    label: 'Money & Worded Problems',
    icon: '£',
    color: '#4DFF88',
    bg: 'rgba(77,255,136,.1)',
    border: 'rgba(77,255,136,.25)',
    description: 'Multi-step money problems, best buys, real-life maths',
    calculator: true,
    questions: [
      {
        id: 'mw1', qNum: '5', source: 'JUN23 P1', marks: 4,
        q: 'At a shop:\n• Normal price of one pen = 24p\n• Normal price of one calculator = £7\n\nSpecial offers:\n• Pens: half the normal price\n• Calculators: £1.50 less than normal price\n\nWork out the total price of 5 pens and 1 calculator using the special offers.',
        ms: '£6.10\n[M1: 24÷2=12p or 7−1.50=£5.50\nM1dep: 5×12p=60p=£0.60 (total pens)\nM1dep: 0.60+5.50 full method for total\nA1: 6.10\nSC3: £65.50 (worked in mixed units)]',
      },
      {
        id: 'mw2', qNum: '7', source: 'JUN22 P1', marks: 4,
        q: 'Cost per 100 grams:\n• Cereal: 49p\n• Pasta: 14p\n\nLeah buys 400 g of cereal and 250 g of pasta.\n\nWork out the total cost in £.',
        ms: '£2.31\n[M1: 0.49×4=1.96 or 49×4=196\nA1: £1.96 or 196p\nM1: 0.14×2.5=0.35 or 14×2.5=35\nA1: £2.31]',
      },
      {
        id: 'mw3', qNum: '5(a)', source: 'JUN23 P2', marks: 2,
        q: 'A shop sells bottles of orange juice. Each bottle costs 75p.\n\nWork out the greatest number of bottles that can be bought with £5.',
        ms: '6 bottles\n[M1: 5÷0.75 or 500÷75 or 6.6… or building up 75×6=450\nA1: 6]',
      },
      {
        id: 'mw4', qNum: '9(a)', source: 'JUN23 P2', marks: 2,
        q: 'The cost of a TV streaming service is:\n• £6 per month for the first 4 months\n• £11 per month for the remaining 8 months\n\nWork out the total cost for the year.',
        ms: '£112\n[M1: 6×4=24 or 11×8=88\nA1: 112]',
      },
      {
        id: 'mw5', qNum: '11(a)', source: 'JUN22 P1', marks: 2,
        q: 'Mobile phone insurance monthly costs:\n\n            Damage    Loss\nCompany A:  £8.65     £12.20\nCompany B:  £7.25     £14.10\n\nWork out the difference in monthly cost between Damage and Loss cover with Company A.',
        ms: '£3.55\n[M1: 12.20−8.65\nA1: 3.55]',
      },
      {
        id: 'mw6', qNum: '11(b)', source: 'JUN22 P1', marks: 3,
        q: 'Mobile phone insurance — Damage cover with Company B costs £7.25/month.\n\nHow much in total will Ben pay for one full year?',
        ms: '£87.00\n[M1: 7.25×12 (correct method)\nM1dep: correct multiplication attempt\nA1: 87]',
      },
    ],
  },

  {
    id: 'bidmas',
    label: 'Order of Operations',
    icon: 'B÷',
    color: '#FF5C7A',
    bg: 'rgba(255,92,122,.12)',
    border: 'rgba(255,92,122,.28)',
    description: 'BIDMAS/BODMAS, brackets, priority rules',
    calculator: false,
    questions: [
      {
        id: 'bid1', qNum: '10', source: 'JUN23 P1', marks: 3,
        q: 'Here are two calculations:\n• A:  8 × 3 + 2\n• B:  21 − (15 − 4)\n\nWork out:  answer to A  ×  answer to B',
        ms: '260\n[B1: A=26 (8×3+2, applying BIDMAS: multiply first)\nB1: B=10 (21−11, brackets first)\nB1ft: 260 (their A × their B)]',
      },
      {
        id: 'bid2', qNum: '11(c)', source: 'JUN23 P2', marks: 1,
        q: 'Marek wants to buy a headset costing £35. He has £19 and plans to save the rest in two equal weekly amounts.\n\nHe writes:  35 − 19 ÷ 2\n\nWhat is wrong with his method?',
        ms: 'He needs brackets around (35 − 19). Without brackets, BIDMAS means 19÷2 is done first, giving 35−9.5=25.5 instead of the correct (35−19)÷2=8.\n[B1 — must reference order of operations or brackets; "it gives the wrong answer" alone is B0]',
      },
      {
        id: 'bid3', qNum: '6(b)', source: 'JUN22 P1', marks: 2,
        q: 'Work out:  60 ÷ 2 + 4',
        ms: '34\n[B2: 34\nB1: 30 seen (60÷2 calculated correctly)]',
      },
    ],
  },

  {
    id: 'powers',
    label: 'Powers & Indices',
    icon: 'xⁿ',
    color: '#9D5CFF',
    bg: 'rgba(157,92,255,.12)',
    border: 'rgba(157,92,255,.28)',
    description: 'Index laws, standard form, prime factor decomposition, roots',
    calculator: false,
    questions: [
      {
        id: 'pw1', qNum: '21', source: 'JUN23 P1', marks: 3,
        q: '2ᵃ × 3 × 5² = 600\n\nWork out the value of a.\nYou must show your working.',
        ms: 'a = 3\n[M1: 5²=25 or 3×25=75 or 600÷3=200 or 600÷25=24\nM1dep: 600÷75=8 or 600÷(3×25)\nA1: 3 (since 2³=8)]',
      },
      {
        id: 'pw2', qNum: '19(a)', source: 'JUN22 P1', marks: 2,
        q: 'Work out:  3¹² ÷ 3⁷\n\nGive your answer as a whole number.',
        ms: '243\n[B2: 243\nB1: 3⁵ seen as index form]',
      },
      {
        id: 'pw3', qNum: '19(b)', source: 'JUN22 P1', marks: 2,
        q: 'Simplify:  8 × 2⁶ × 2⁴\n\nGive your answer as a power of 2.',
        ms: '2¹³\n[B2: 2¹³\nB1: 8=2³ seen, or 2¹⁰ (for 2⁶×2⁴) seen, or 8192 seen]',
      },
      {
        id: 'pw4', qNum: '18', source: 'JUN22 P1', marks: 2,
        q: 'Work out:  80 000 000 ÷ 200\n\nGive your answer in standard form.',
        ms: '4 × 10⁵\n[B2: 4×10⁵\nB1: 400 000 correct but not in standard form]',
      },
    ],
  },
]

// ─── Flat lookup by id (for wildcard / search) ────────────────────────────────
export const ALL_MATHS_QUESTIONS = MATHS_TOPIC_GROUPS.flatMap(g =>
  g.questions.map(q => ({ ...q, topicId: g.id, topicLabel: g.label, topicColor: g.color, isCalc: g.calculator }))
)

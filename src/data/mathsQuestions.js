// ─── AQA GCSE Maths Foundation — Past Paper Questions ────────────────────────
// Sources: JUN22, JUN23 Papers 1 (Non-Calc) and 2 (Calculator)
// Content reproduced verbatim from AQA past papers for educational use.
// Diagrams rendered as inline SVG where figures appear in originals.

export const MATHS_FORMULA_SHEET = [
  {
    category: 'Area & Volume',
    items: [
      { name: 'Area of trapezium', formula: '½(a + b)h', latex: '\\frac{1}{2}(a+b)h' },
      { name: 'Volume of prism', formula: 'area of cross-section × length', latex: '\\text{area} \\times \\text{length}' },
      { name: 'Volume of sphere', formula: '4/3 πr³', latex: '\\frac{4}{3}\\pi r^3' },
      { name: 'Surface area of sphere', formula: '4πr²', latex: '4\\pi r^2' },
      { name: 'Volume of cone', formula: '1/3 πr²h', latex: '\\frac{1}{3}\\pi r^2 h' },
      { name: 'Curved SA of cone', formula: 'πrl', latex: '\\pi r l' },
    ]
  },
  {
    category: 'Trigonometry',
    items: [
      { name: 'Sine rule', formula: 'a/sin A = b/sin B = c/sin C', latex: '\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C}' },
      { name: 'Cosine rule', formula: 'a² = b² + c² − 2bc cos A', latex: 'a^2 = b^2 + c^2 - 2bc\\cos A' },
      { name: 'Area of triangle', formula: '½ ab sin C', latex: '\\frac{1}{2}ab\\sin C' },
    ]
  },
  {
    category: 'Quadratic Formula',
    items: [
      { name: 'Quadratic formula', formula: 'x = (−b ± √(b² − 4ac)) / 2a', latex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}' },
    ]
  },
  {
    category: 'Other',
    items: [
      { name: 'Compound interest', formula: 'P(1 + r/100)ⁿ', latex: 'P\\left(1 + \\frac{r}{100}\\right)^n' },
      { name: 'Speed', formula: 'distance / time', latex: '\\text{speed} = \\frac{\\text{distance}}{\\text{time}}' },
      { name: 'Density', formula: 'mass / volume', latex: '\\text{density} = \\frac{\\text{mass}}{\\text{volume}}' },
      { name: 'Pressure', formula: 'force / area', latex: '\\text{pressure} = \\frac{\\text{force}}{\\text{area}}' },
    ]
  },
]

// ─── SVG Diagram components (inline) ─────────────────────────────────────────
// These reproduce figures that appear in the original exam papers as diagrams.

export const MATHS_DIAGRAMS = {
  // JUN23 P1: Q15 — rectangle with hole
  rect_with_hole: `<svg viewBox="0 0 220 140" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;display:block;margin:12px auto">
    <rect x="10" y="10" width="200" height="120" fill="none" stroke="#9CA8C7" stroke-width="2"/>
    <rect x="60" y="40" width="80" height="50" fill="#1A2338" stroke="#9CA8C7" stroke-width="1.5" stroke-dasharray="4,3"/>
    <line x1="10" y1="130" x2="210" y2="130" stroke="#9CA8C7" stroke-width="1"/>
    <text x="100" y="145" fill="#9CA8C7" font-size="11" text-anchor="middle" font-family="Inter,sans-serif">20 cm</text>
    <text x="215" y="75" fill="#9CA8C7" font-size="11" font-family="Inter,sans-serif">15 cm</text>
    <text x="100" y="70" fill="#9CA8C7" font-size="11" text-anchor="middle" font-family="Inter,sans-serif">10 cm</text>
    <text x="105" y="93" fill="#9CA8C7" font-size="10" text-anchor="middle" font-family="Inter,sans-serif">6 cm</text>
    <text x="5" y="10" fill="#9D5CFF" font-size="10" font-family="Inter,sans-serif">Not drawn accurately</text>
  </svg>`,

  // JUN23 P1: Q17 — angle diagram (ABC, BD, BE straight lines)
  angle_lines: `<svg viewBox="0 0 200 180" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;display:block;margin:12px auto">
    <circle cx="100" cy="100" r="3" fill="#9CA8C7"/>
    <text x="104" y="107" fill="#9CA8C7" font-size="12" font-family="Inter,sans-serif">B</text>
    <!-- Line A–C (horizontal) -->
    <line x1="20" y1="100" x2="185" y2="100" stroke="#9CA8C7" stroke-width="1.5"/>
    <text x="14" y="104" fill="#9CA8C7" font-size="12" font-family="Inter,sans-serif">A</text>
    <text x="186" y="104" fill="#9CA8C7" font-size="12" font-family="Inter,sans-serif">C</text>
    <!-- Line D (upward-left) -->
    <line x1="100" y1="100" x2="40" y2="25" stroke="#9CA8C7" stroke-width="1.5"/>
    <text x="34" y="22" fill="#9CA8C7" font-size="12" font-family="Inter,sans-serif">D</text>
    <!-- Line E (upward-right) -->
    <line x1="100" y1="100" x2="170" y2="30" stroke="#9CA8C7" stroke-width="1.5"/>
    <text x="168" y="24" fill="#9CA8C7" font-size="12" font-family="Inter,sans-serif">E</text>
    <!-- Angle labels -->
    <text x="74" y="88" fill="#F5B700" font-size="9" font-family="Inter,sans-serif">EBD</text>
    <text x="112" y="85" fill="#F5B700" font-size="9" font-family="Inter,sans-serif">DBC</text>
    <text x="108" y="97" fill="#9D5CFF" font-size="9" font-family="Inter,sans-serif">ABE</text>
    <text x="5" y="15" fill="#9D5CFF" font-size="10" font-family="Inter,sans-serif">Not drawn accurately</text>
  </svg>`,

  // JUN23 P2: Q19 — octagon exterior angle
  octagon_angle: `<svg viewBox="0 0 200 180" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;display:block;margin:12px auto">
    <polygon points="100,20 155,40 175,95 155,150 100,170 45,150 25,95 45,40" fill="none" stroke="#9CA8C7" stroke-width="1.8"/>
    <!-- Extend one side to show exterior angle -->
    <line x1="175" y1="95" x2="210" y2="95" stroke="#9CA8C7" stroke-width="1.5" stroke-dasharray="4,3"/>
    <!-- Arc for angle x -->
    <path d="M 175,95 Q 205,80 200,70" fill="none" stroke="#9D5CFF" stroke-width="1.5"/>
    <text x="196" y="68" fill="#9D5CFF" font-size="13" font-family="Inter,sans-serif" font-weight="bold">x</text>
    <text x="5" y="15" fill="#9D5CFF" font-size="10" font-family="Inter,sans-serif">Not drawn accurately</text>
  </svg>`,

  // JUN23 P2: Q21 — hemisphere bowl
  hemisphere: `<svg viewBox="0 0 200 130" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;display:block;margin:12px auto">
    <!-- Bowl outline (half ellipse) -->
    <path d="M 20,70 Q 110,-20 190,70" fill="none" stroke="#9CA8C7" stroke-width="2"/>
    <!-- Base line -->
    <line x1="20" y1="70" x2="190" y2="70" stroke="#9CA8C7" stroke-width="2"/>
    <!-- Water fill -->
    <path d="M 35,70 Q 110,25 175,70 Z" fill="rgba(59,130,255,.15)" stroke="#3B82FF" stroke-width="1"/>
    <!-- Radius arrow -->
    <line x1="110" y1="70" x2="190" y2="70" stroke="#F5B700" stroke-width="1.5" marker-end="url(#arr)"/>
    <text x="140" y="85" fill="#F5B700" font-size="12" font-family="Inter,sans-serif">r = 12 cm</text>
    <!-- Water label -->
    <text x="90" y="58" fill="#3B82FF" font-size="10" font-family="Inter,sans-serif">Water</text>
    <text x="50" y="110" fill="#9CA8C7" font-size="10" font-family="Inter,sans-serif">325 cm³/s for 8 seconds</text>
    <defs><marker id="arr" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 z" fill="#F5B700"/></marker></defs>
  </svg>`,

  // JUN22 P1: Q10 — isosceles triangle
  isosceles_triangle: `<svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;display:block;margin:12px auto">
    <polygon points="100,15 175,140 25,140" fill="none" stroke="#9CA8C7" stroke-width="2"/>
    <!-- Equal sides tick marks -->
    <line x1="62" y1="77" x2="58" y2="85" stroke="#9CA8C7" stroke-width="1.5"/>
    <line x1="68" y1="73" x2="64" y2="81" stroke="#9CA8C7" stroke-width="1.5"/>
    <line x1="138" y1="73" x2="142" y2="81" stroke="#9CA8C7" stroke-width="1.5"/>
    <line x1="144" y1="77" x2="148" y2="85" stroke="#9CA8C7" stroke-width="1.5"/>
    <!-- Labels -->
    <text x="95" y="10" fill="#9CA8C7" font-size="12" font-family="Inter,sans-serif">A</text>
    <text x="178" y="148" fill="#9CA8C7" font-size="12" font-family="Inter,sans-serif">B</text>
    <text x="15" y="148" fill="#9CA8C7" font-size="12" font-family="Inter,sans-serif">C</text>
    <text x="85" y="155" fill="#9CA8C7" font-size="11" font-family="Inter,sans-serif">BC = ?cm</text>
    <text x="5" y="12" fill="#9D5CFF" font-size="10" font-family="Inter,sans-serif">Not drawn accurately</text>
    <text x="30" y="80" fill="#F5B700" font-size="10" font-family="Inter,sans-serif">AB = AC</text>
    <text x="60" y="155" fill="#9CA8C7" font-size="10" font-family="Inter,sans-serif">Perimeter = 22 cm</text>
  </svg>`,

  // JUN22 P1: Q10b — triangle with angles
  triangle_angles: `<svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;display:block;margin:12px auto">
    <polygon points="100,15 180,140 20,140" fill="none" stroke="#9CA8C7" stroke-width="2"/>
    <!-- Angle labels -->
    <text x="88" y="40" fill="#F5B700" font-size="12" font-family="Inter,sans-serif">x</text>
    <text x="158" y="132" fill="#9D5CFF" font-size="12" font-family="Inter,sans-serif">y</text>
    <text x="28" y="132" fill="#9D5CFF" font-size="12" font-family="Inter,sans-serif">y</text>
    <text x="70" y="160" fill="#9CA8C7" font-size="11" font-family="Inter,sans-serif">x = 3y</text>
    <text x="5" y="12" fill="#9D5CFF" font-size="10" font-family="Inter,sans-serif">Not drawn accurately</text>
  </svg>`,

  // JUN22 P2: Scatter graph (Q16 - graph of y = 7 - 3x)
  linear_graph: `<svg viewBox="0 0 220 200" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;display:block;margin:12px auto">
    <!-- Axes -->
    <line x1="30" y1="10" x2="30" y2="180" stroke="#9CA8C7" stroke-width="1.5"/>
    <line x1="30" y1="180" x2="210" y2="180" stroke="#9CA8C7" stroke-width="1.5"/>
    <!-- Grid -->
    ${[1,2,3,4,5,6].map(i => `<line x1="30" y1="${180-i*25}" x2="210" y2="${180-i*25}" stroke="#2A3552" stroke-width="1"/><text x="16" y="${185-i*25}" fill="#5A6480" font-size="10" font-family="Inter,sans-serif">${i*2}</text>`).join('')}
    ${[1,2,3,4,5,6].map(i => `<line x1="${30+i*28}" y1="10" x2="${30+i*28}" y2="180" stroke="#2A3552" stroke-width="1"/><text x="${26+i*28}" y="194" fill="#5A6480" font-size="10" font-family="Inter,sans-serif">${i}</text>`).join('')}
    <!-- y = 7 - 3x line -->
    <line x1="30" y1="5" x2="30+2.33*28" y2="180" stroke="#F5B700" stroke-width="2"/>
    <line x1="30" y1="5" x2="117" y2="180" stroke="#F5B700" stroke-width="2"/>
    <text x="35" y="20" fill="#F5B700" font-size="11" font-family="Inter,sans-serif">y = 7 – 3x</text>
    <!-- Axis labels -->
    <text x="22" y="8" fill="#9CA8C7" font-size="11" font-family="Inter,sans-serif">y</text>
    <text x="212" y="184" fill="#9CA8C7" font-size="11" font-family="Inter,sans-serif">x</text>
    <text x="60" y="194" fill="#9CA8C7" font-size="9" font-family="Inter,sans-serif">(Draw y = 2x + 1 on this grid)</text>
  </svg>`,

  // JUN23 P2: Q20 — translation grid (shape A and B)
  translation_grid: `<svg viewBox="0 0 220 200" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;display:block;margin:12px auto">
    <!-- Grid -->
    ${Array.from({length:9}, (_,i) => `<line x1="20" y1="${20+i*20}" x2="210" y2="${20+i*20}" stroke="#2A3552" stroke-width="1"/>`).join('')}
    ${Array.from({length:10}, (_,i) => `<line x1="${20+i*20}" y1="20" x2="${20+i*20}" y2="180" stroke="#2A3552" stroke-width="1"/>`).join('')}
    <!-- Shape A -->
    <polygon points="40,60 80,60 80,80 60,80 60,100 40,100" fill="rgba(157,92,255,.15)" stroke="#9D5CFF" stroke-width="2"/>
    <text x="52" y="82" fill="#9D5CFF" font-size="12" font-family="Inter,sans-serif">A</text>
    <!-- Shape B (translated right 4, down 3 => +80, +60) -->
    <polygon points="120,120 160,120 160,140 140,140 140,160 120,160" fill="rgba(59,130,255,.15)" stroke="#3B82FF" stroke-width="2"/>
    <text x="132" y="143" fill="#3B82FF" font-size="12" font-family="Inter,sans-serif">B</text>
    <!-- Arrow -->
    <line x1="80" y1="80" x2="118" y2="118" stroke="#9CA8C7" stroke-width="1" stroke-dasharray="3,3"/>
  </svg>`,

  // JUN23 P2: Q22 — similar rectangles
  similar_rects: `<svg viewBox="0 0 220 120" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;display:block;margin:12px auto">
    <!-- Rectangle 1 -->
    <rect x="10" y="20" width="80" height="50" fill="none" stroke="#9CA8C7" stroke-width="2"/>
    <text x="45" y="15" fill="#9CA8C7" font-size="11" text-anchor="middle" font-family="Inter,sans-serif">8 cm</text>
    <text x="96" y="48" fill="#9CA8C7" font-size="11" font-family="Inter,sans-serif">5 cm</text>
    <!-- Rectangle 2 -->
    <rect x="120" y="20" width="96" height="60" fill="none" stroke="#9CA8C7" stroke-width="2"/>
    <text x="168" y="15" fill="#9CA8C7" font-size="11" text-anchor="middle" font-family="Inter,sans-serif">19.2 cm</text>
    <text x="218" y="53" fill="#9CA8C7" font-size="11" font-family="Inter,sans-serif">12 cm</text>
    <text x="5" y="110" fill="#9D5CFF" font-size="10" font-family="Inter,sans-serif">Not drawn accurately — show these are similar</text>
  </svg>`,

  // JUN22 P1: Q16 — Venn diagram (A and F)
  venn_diagram: `<svg viewBox="0 0 220 160" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;display:block;margin:12px auto">
    <!-- Outer box -->
    <rect x="10" y="10" width="200" height="140" fill="none" stroke="#9CA8C7" stroke-width="1.5" rx="4"/>
    <text x="15" y="24" fill="#9CA8C7" font-size="11" font-family="Inter,sans-serif">ξ = 98 students</text>
    <!-- Circle A -->
    <circle cx="85" cy="90" r="45" fill="rgba(157,92,255,.1)" stroke="#9D5CFF" stroke-width="1.5"/>
    <text x="55" y="75" fill="#9D5CFF" font-size="12" font-family="Inter,sans-serif">A</text>
    <!-- Circle F -->
    <circle cx="135" cy="90" r="45" fill="rgba(59,130,255,.1)" stroke="#3B82FF" stroke-width="1.5"/>
    <text x="162" y="75" fill="#3B82FF" font-size="12" font-family="Inter,sans-serif">F</text>
    <!-- Values -->
    <text x="58" y="93" fill="#F5F7FB" font-size="14" font-family="Inter,sans-serif" font-weight="bold">10</text>
    <text x="100" y="93" fill="#F5F7FB" font-size="14" font-family="Inter,sans-serif" font-weight="bold">25</text>
    <text x="148" y="93" fill="#F5F7FB" font-size="14" font-family="Inter,sans-serif" font-weight="bold">16</text>
    <text x="184" y="130" fill="#9CA8C7" font-size="12" font-family="Inter,sans-serif">48</text>
    <text x="40" y="150" fill="#9D5CFF" font-size="9" font-family="Inter,sans-serif">A = Art   F = French   (Joel's diagram — find 2 errors)</text>
  </svg>`,

  // Number line for P2 JUN23 Q1a
  number_line_a: `<svg viewBox="0 0 260 60" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;display:block;margin:12px auto">
    <line x1="20" y1="30" x2="240" y2="30" stroke="#9CA8C7" stroke-width="2"/>
    ${[0,10,20,30,40,50,60].map((v,i) => `<line x1="${20+i*32}" y1="24" x2="${20+i*32}" y2="36" stroke="#9CA8C7" stroke-width="1.5"/><text x="${16+i*32}" y="50" fill="#9CA8C7" font-size="11" font-family="Inter,sans-serif">${v}</text>`).join('')}
    <!-- X marker -->
    <line x1="108" y1="18" x2="108" y2="36" stroke="#F5B700" stroke-width="2"/>
    <text x="103" y="15" fill="#F5B700" font-size="13" font-family="Inter,sans-serif" font-weight="bold">X</text>
  </svg>`,

  // Number line b (negative) JUN23 P2 Q1b
  number_line_b: `<svg viewBox="0 0 260 60" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;display:block;margin:12px auto">
    <line x1="20" y1="30" x2="240" y2="30" stroke="#9CA8C7" stroke-width="2"/>
    ${[-3,-2,-1,0,1,2,3].map((v,i) => `<line x1="${20+i*32}" y1="24" x2="${20+i*32}" y2="36" stroke="#9CA8C7" stroke-width="1.5"/><text x="${v<0?13+i*32:16+i*32}" y="50" fill="#9CA8C7" font-size="11" font-family="Inter,sans-serif">${v}</text>`).join('')}
    <!-- Y marker -->
    <line x1="92" y1="18" x2="92" y2="36" stroke="#9D5CFF" stroke-width="2"/>
    <text x="87" y="15" fill="#9D5CFF" font-size="13" font-family="Inter,sans-serif" font-weight="bold">Y</text>
  </svg>`,
}

// ─── Question Bank ────────────────────────────────────────────────────────────

export const MATHS_QUESTIONS = {

  // ── PAPER 1: NON-CALCULATOR ───────────────────────────────────────────────

  p1_jun23: {
    label: 'Paper 1 – Non-Calculator (Jun 2023)',
    paper: 'P1',
    calculator: false,
    questions: [
      {
        id: 'j23p1_1a', qNum: '1(a)', marks: 1, type: 'written',
        q: 'Here is a list of numbers:\n\n14  9  20  29  3  45  33\n\nWhich number in the list is a multiple of 4?',
        ms: '20\n[B1]',
        topic: 'Number',
      },
      {
        id: 'j23p1_1b', qNum: '1(b)', marks: 1, type: 'written',
        q: 'Here is a list of numbers:\n\n14  9  20  29  3  45  33\n\nWhich number in the list is a square number?',
        ms: '9\n[B1]',
        topic: 'Number',
      },
      {
        id: 'j23p1_1c', qNum: '1(c)', marks: 1, type: 'written',
        q: 'Here is a list of numbers:\n\n14  9  20  29  3  45  33\n\nWhich TWO numbers in the list have a total of 43?',
        ms: '14 and 29 (either order)\n[B1]',
        topic: 'Number',
      },
      {
        id: 'j23p1_1d', qNum: '1(d)', marks: 1, type: 'written',
        q: 'Here is a list of numbers:\n\n14  9  20  29  3  45  33\n\nWork out: largest number in the list ÷ smallest number in the list',
        ms: '15\n[B1]',
        topic: 'Number',
      },
      {
        id: 'j23p1_3a', qNum: '3(a)', marks: 1, type: 'written',
        q: 'Work out (−4) × (−3)',
        ms: '12 (or +12)\n[B1]',
        topic: 'Negative numbers',
      },
      {
        id: 'j23p1_3b', qNum: '3(b)', marks: 1, type: 'written',
        q: 'Work out 6 × (−5)',
        ms: '−30\n[B1]',
        topic: 'Negative numbers',
      },
      {
        id: 'j23p1_3c', qNum: '3(c)', marks: 1, type: 'written',
        q: 'Work out (−8)²',
        ms: '64 (or +64)\n[B1]',
        topic: 'Negative numbers',
      },
      {
        id: 'j23p1_3d', qNum: '3(d)', marks: 1, type: 'written',
        q: 'Work out 10³',
        ms: '1000\n[B1]',
        topic: 'Powers',
      },
      {
        id: 'j23p1_4', qNum: '4', marks: 2, type: 'written',
        q: 'Write 18 out of 30 as a fraction in its simplest form.',
        ms: '3/5\n[B2: B1 for 18/30 or any unsimplified equivalent]',
        topic: 'Fractions',
      },
      {
        id: 'j23p1_5', qNum: '5', marks: 4, type: 'written',
        q: 'At a shop:\n• the normal price of one pen is 24p\n• the normal price of one calculator is £7\n\nThe shop has these special offers:\n• Pens: Half the normal price\n• Calculators: £1.50 less than the normal price\n\nWork out the total price of 5 pens and 1 calculator using the special offers.',
        ms: '£6.10\n[M1: 24÷2 or 12 or 7−1.50 or 5.50\nM1: 5×12 or 60 (pence) or 2.10 or 210p\nM1dep: full method for total cost\nA1: 6.10 or 610p]',
        topic: 'Money & percentages',
      },
      {
        id: 'j23p1_6a', qNum: '6(a)', marks: 1, type: 'written',
        q: 'Write 3²/₅ as an improper fraction.',
        ms: '17/5\n[B1]',
        topic: 'Fractions',
      },
      {
        id: 'j23p1_6b', qNum: '6(b)', marks: 1, type: 'written',
        q: 'Write 0.19 as a fraction.',
        ms: '19/100\n[B1]',
        topic: 'Fractions & decimals',
      },
      {
        id: 'j23p1_8a', qNum: '8(a)', marks: 2, type: 'written',
        q: 'T = 5P − W\n\nWork out the value of T when P = 4 and W = 2.',
        ms: 'T = 18\n[M1: 5×4 or 20\nA1: 18]',
        topic: 'Algebra – substitution',
      },
      {
        id: 'j23p1_8b', qNum: '8(b)', marks: 3, type: 'written',
        q: 'T = 5P − W\n\nWork out the value of P when T = −40 and W = 10.',
        ms: 'P = −6\n[M1: −40+10 or −30, or −40=5P−10\nM1dep: ÷5\nA1: −6\nSC2: −10 with −50 seen]',
        topic: 'Algebra – rearranging',
      },
      {
        id: 'j23p1_10', qNum: '10', marks: 3, type: 'written',
        q: 'Here are two calculations:\n• A:  8 × 3 + 2\n• B:  21 − (15 − 4)\n\nWork out: answer to A × answer to B',
        ms: '260\n[B1: A=26, B1: B=10, B1ft: 260]',
        topic: 'Order of operations (BIDMAS)',
      },
      {
        id: 'j23p1_11', qNum: '11', marks: 2, type: 'written',
        q: 'Convert 7 gallons to litres.\n\nUse: 1 gallon = 4.5 litres',
        ms: '31.5 litres\n[M1: 4.5×7 or 45×7\nA1: 31.5]',
        topic: 'Units & conversion',
      },
      {
        id: 'j23p1_12', qNum: '12', marks: 1, type: 'written',
        q: 'The table shows monthly payments for electricity:\n• October: £120\n• November: £240\n\nWrite down the percentage increase from October to November.',
        ms: '100%\n[B1]',
        topic: 'Percentages',
      },
      {
        id: 'j23p1_15', qNum: '15', marks: 3, type: 'written',
        diagramKey: 'rect_with_hole',
        q: 'A large rectangle (20 cm × 15 cm) has a rectangular hole (10 cm × 6 cm) cut out.\n\n[See diagram]\n\nWork out the percentage of the large rectangle that is shaded.',
        ms: '70%\n[M1: 2×3 or 6 (small area), or 4×5 or 20 (large area)\nM1dep: (20−6)÷20 or 14/20\nA1: 70\nSC2: 44.4% (uses perimeter)]',
        topic: 'Area & percentages',
      },
      {
        id: 'j23p1_16', qNum: '16', marks: 3, type: 'written',
        q: 'Liz travels 18 miles in 20 minutes.\n\nWork out her average speed in miles per hour.',
        ms: '54 mph\n[M1: 60÷20 or 3 (conversion factor)\nM1dep: 3×18 or full method\nA1: 54]',
        topic: 'Speed, distance, time',
      },
      {
        id: 'j23p1_17', qNum: '17', marks: 3, type: 'written',
        diagramKey: 'angle_lines',
        q: 'ABC, BD and BE are straight lines.\n[See diagram]\n\nangle EBD = 5 × angle ABE\nangle DBC = 3 × angle ABE\n\nWork out the size of angle EBD.',
        ms: '100°\n[M1: 1 and 5 and 3 (or 9 parts) or x + 5x + 3x\nM1dep: 180÷9 or 20 (for one part)\nA1: 100]',
        topic: 'Angles on a straight line',
      },
      {
        id: 'j23p1_18', qNum: '18', marks: 3, type: 'written',
        q: 'Two prime numbers are multiplied together. The answer is an even number between 50 and 60.\n\nComplete the calculation:\n\n__ × __ = __',
        ms: '2 × 29 = 58\n[B3 for all conditions met;\nB2: 4 conditions (prime, prime, even, in range);\nB1: 3 conditions]',
        topic: 'Prime numbers',
      },
      {
        id: 'j23p1_19', qNum: '19', marks: 4, type: 'written',
        q: 'Andrew and Bruce share some money in the ratio 5 : 6.\n\nBruce gets £96.\n\nAndrew gives ¼ of his share to Carl.\nBruce gives ⅔ of his share to Carl.\n\nHow much money does Carl receive?',
        ms: '£84\n[M1: 5/6×96 or 80 (Andrew\'s share)\nM1dep: 1/4×80 or 20\nM1: 2/3×96 or 64\nA1: 84]',
        topic: 'Ratio & fractions',
      },
      {
        id: 'j23p1_21', qNum: '21', marks: 3, type: 'written',
        q: '2ᵃ × 3 × 5² = 600\n\nWork out the value of a. You must show your working.',
        ms: 'a = 3\n[M1: 5²=25 or 3×25=75 or 600÷3 or 200 or 600÷25 or 24\nM1dep: 600÷75 or 8\nA1: 3]',
        topic: 'Powers & prime factors',
      },
      {
        id: 'j23p1_22', qNum: '22', marks: 2, type: 'written',
        q: 'Expand and simplify fully:  5(3x + 4) − 2(x − 1)',
        ms: '13x + 22\n[B2: correct answer;\nB1: 15x+20 or −2x+2 or 13x+a or bx+22]',
        topic: 'Algebra – expanding brackets',
      },
      {
        id: 'j23p1_24', qNum: '24', marks: 5, type: 'written',
        q: 'Sunita is x years old.\nBeth is one year younger than Sunita.\nJoel is double Sunita\'s age.\n\nThe mean of their ages is 5.\n\nHow old is Joel?',
        ms: 'Joel is 8 years old\n[M1: 5×3=15\nM1: expressions x−1 and 2x\nM1dep: x+(x−1)+2x=15 or 4x−1=15\nM1dep: x=4\nA1: 8]',
        topic: 'Algebra – forming equations',
      },
      {
        id: 'j23p1_25', qNum: '25', marks: 4, type: 'written',
        q: 'Work out:  2⅓ ÷ 4/5\n\nGive your answer as a mixed number.',
        ms: '2 11/12\n[M1: 7/3 (improper fraction)\nM1: ×5/4 (multiply by reciprocal)\nA1: 35/12\nA1ft: 2 11/12]',
        topic: 'Fractions – division',
      },
    ]
  },

  // ── PAPER 2: CALCULATOR ───────────────────────────────────────────────────

  p2_jun23: {
    label: 'Paper 2 – Calculator (Jun 2023)',
    paper: 'P2',
    calculator: true,
    questions: [
      {
        id: 'j23p2_1a', qNum: '1(a)', marks: 1, type: 'written',
        diagramKey: 'number_line_a',
        q: 'Here is a number line (0 to 60 in steps of 10).\n[See diagram]\n\nWhat number is at X?',
        ms: '35\n[B1 — mark the answer line; if blank, answer may be seen on diagram]',
        topic: 'Number – number lines',
      },
      {
        id: 'j23p2_1b', qNum: '1(b)', marks: 1, type: 'written',
        diagramKey: 'number_line_b',
        q: 'Here is a different number line (−3 to +3).\n[See diagram]\n\nWhat number is at Y?',
        ms: '−2\n[B1]',
        topic: 'Number – number lines',
      },
      {
        id: 'j23p2_5a', qNum: '5(a)', marks: 2, type: 'written',
        q: 'A shop sells bottles of orange juice. Each bottle costs 75p.\n\nWork out the greatest number of bottles that can be bought with £5.',
        ms: '6 bottles\n[M1: 5÷0.75 or 500÷75 or 6.6… or 75×6=450\nA1: 6]',
        topic: 'Money',
      },
      {
        id: 'j23p2_5b', qNum: '5(b)', marks: 4, type: 'written',
        q: 'Two shops sell bottles of apple juice:\n• Shop X: pack of 4 bottles, was £2.50, now 10% off\n• Shop Z: pack of 12 bottles for £7\n\nAt which shop is it cheaper to buy 24 bottles? Show your working.',
        ms: 'Shop X (£13.50 vs £14.00)\n[M1: 2.5×0.1 or 0.25 (discount) or 0.9 (multiplier)\nM1dep: (2.5−0.25)×6 or 2.25×6 or 13.5 (Shop X total)\nM1: 7×2 or 14 (Shop Z)\nA1: X with 13.5 and 14 seen]',
        topic: 'Percentages & best value',
      },
      {
        id: 'j23p2_9a', qNum: '9(a)', marks: 2, type: 'written',
        q: 'The cost of a TV streaming service is:\n• £6 per month for the first 4 months\n• then £11 per month for the rest of the year.\n\nWork out the total cost for the year.',
        ms: '£112\n[M1: 6×4 or 24 or 11×8 or 88\nA1: 112]',
        topic: 'Money',
      },
      {
        id: 'j23p2_9b', qNum: '9(b)', marks: 3, type: 'written',
        q: 'A TV series has ten episodes.\n• Nine episodes are each 50 minutes long.\n• One episode is 1 hour 42 minutes long.\n\nWork out the total length of the series. Give your answer in hours and minutes.',
        ms: '9 hours 12 minutes\n[M1: 9×50=450 or 7h 30min\nM1: 60+42=102 or adding both together\nA1: 9h 12min]',
        topic: 'Time calculations',
      },
      {
        id: 'j23p2_10a', qNum: '10(a)', marks: 2, type: 'written',
        q: 'There are 1020 books in a box.\n\n2/5 of the books are blue.\n\nHow many are blue?',
        ms: '408\n[M1: 1020÷5 (×2) or 204\nA1: 408]',
        topic: 'Fractions of amounts',
      },
      {
        id: 'j23p2_10b', qNum: '10(b)', marks: 1, type: 'written',
        q: 'There are green pens and red pens in a box.\nThe ratio of green : red = 4 : 3\n\nWhat fraction of the pens are green?',
        ms: '4/7\n[B1]',
        topic: 'Ratio to fractions',
      },
      {
        id: 'j23p2_10c', qNum: '10(c)', marks: 2, type: 'written',
        q: 'There are some calculators in a box.\n• 220 are scientific.\n• 30 are not.\n\nWhat percentage of the calculators are scientific?',
        ms: '88%\n[M1: 220÷250 (×100) or 0.88\nA1: 88]',
        topic: 'Percentages',
      },
      {
        id: 'j23p2_11c', qNum: '11(c)', marks: 1, type: 'written',
        q: 'Marek wants to save for a headset that costs £35. He already has £19. He plans to save the rest in two equal amounts.\n\nHe uses this method:\n\n   35 − 19 ÷ 2\n\nWhat is wrong with his method?',
        ms: 'He needs brackets around (35 − 19). Without brackets, BIDMAS means 19÷2 is calculated first, giving the wrong answer of 25.5 instead of 8.\n[B1 for any valid explanation referencing brackets or order of operations]',
        topic: 'Order of operations',
      },
      {
        id: 'j23p2_13', qNum: '13', marks: 4, type: 'written',
        q: '28 is increased by 25%.\n40 is decreased by 15%.\n\nWhich answer is bigger? Show how you decide.',
        ms: '28 increased by 25% = 35; 40 decreased by 15% = 34. So 35 is bigger.\n[M1: 28×0.25 or 7, or 40×0.15 or 6\nM1dep: 28+7 or 35 or 40−6 or 34\nM1dep: both calculated\nA1: 35 with 34 seen]',
        topic: 'Percentage increase & decrease',
      },
      {
        id: 'j23p2_14', qNum: '14', marks: 1, type: 'written',
        q: 'Factorise:  12a + 15b',
        ms: '3(4a + 5b)\n[B1]',
        topic: 'Algebra – factorising',
      },
      {
        id: 'j23p2_15', qNum: '15', marks: 2, type: 'written',
        q: 'Write down all the integers that satisfy the inequality:\n\n   −3 ≤ x < 2',
        ms: '−3, −2, −1, 0, 1\n[B2: all 5 correct and none incorrect\nB1: 4 correct and none incorrect, or 5 correct with 1 incorrect]',
        topic: 'Inequalities',
      },
      {
        id: 'j23p2_16', qNum: '16', marks: 2, type: 'written',
        q: 'A linear sequence starts:\n\n   7  10  13  16\n\nWork out an expression for the nth term of the sequence.',
        ms: '3n + 4\n[B2: correct answer\nB1: 3n (+ any number) or 3n (− any number)]',
        topic: 'Sequences – nth term',
      },
      {
        id: 'j23p2_19a', qNum: '19(a)', marks: 2, type: 'written',
        diagramKey: 'octagon_angle',
        q: 'Part of a regular polygon is shown. [See diagram]\n\nAssume the polygon is an octagon.\n\nWork out the size of angle x.',
        ms: '45°\n[M1: 360÷8 or (8−2)×180÷8 = 135, then 180−135\nA1: 45]',
        topic: 'Angles – polygons',
      },
      {
        id: 'j23p2_19b', qNum: '19(b)', marks: 1, type: 'mc',
        q: 'In fact, the polygon has MORE sides than an octagon.\nWhat does this mean about the size of angle x?',
        options: [
          'It is more than the answer to part (a)',
          'It is the same as the answer to part (a)',
          'It is less than the answer to part (a)',
          'It could be any of the above',
        ],
        correctIndex: 2,
        ms: 'It is less than the answer to part (a)\n[B1 — more sides → larger interior angles → smaller exterior angle x]',
        topic: 'Angles – polygons',
      },
      {
        id: 'j23p2_20', qNum: '20', marks: 2, type: 'written',
        diagramKey: 'translation_grid',
        q: 'Write down the translation vector that maps shape A onto shape B.\n[See diagram]',
        ms: 'Vector: (4 on top, −3 below) — i.e., 4 right and 3 down\n[B2: correct column vector\nB1: one component correct\nSC1: (−4, 3)]',
        topic: 'Transformations – translation',
      },
      {
        id: 'j23p2_21', qNum: '21', marks: 4, type: 'written',
        diagramKey: 'hemisphere',
        q: 'Volume of a sphere = 4/3 πr³\n\nA bowl is a hemisphere with radius 12 cm.\nWater is poured into the bowl at 325 cm³ per second for 8 seconds.\n\nDoes the water fill more than 70% of the bowl? You must show your working.',
        ms: 'Yes — 72% (approx)\nVolume of hemisphere = ½ × 4/3 × π × 12³ ≈ 3619 cm³\nVolume of water = 325 × 8 = 2600 cm³\n2600 ÷ 3619 ≈ 0.718 = 71.8% > 70%\n[M1: 4/3×π×12³ or 2304π\nM1: ×0.7 for 70% or 325×8=2600\nM1dep: compare\nA1: Yes with correct values (71–73%)]',
        topic: 'Volume – spheres',
      },
      {
        id: 'j23p2_22', qNum: '22', marks: 2, type: 'written',
        diagramKey: 'similar_rects',
        q: 'Show that these two rectangles are similar.\n[See diagram: 8 cm × 5 cm and 19.2 cm × 12 cm]',
        ms: '8÷5 = 1.6 and 19.2÷12 = 1.6 (same scale factor), so they are similar.\nOR: 8/5 = 19.2/12 ✓\n[M1: ratio of a valid pair of sides\nA1: showing both pairs equal the same value]',
        topic: 'Similarity',
      },
    ]
  },

  // ── PAPER 1: NON-CALCULATOR JUN22 ────────────────────────────────────────

  p1_jun22: {
    label: 'Paper 1 – Non-Calculator (Jun 2022)',
    paper: 'P1',
    calculator: false,
    questions: [
      {
        id: 'j22p1_1a', qNum: '1(a)', marks: 1, type: 'mc',
        q: 'Circle the answer to 150 ÷ 5',
        options: ['3', '30', '300', '3000'],
        correctIndex: 1,
        ms: '30\n[B1]',
        topic: 'Number – division',
      },
      {
        id: 'j22p1_1b', qNum: '1(b)', marks: 1, type: 'mc',
        q: 'Circle the answer to 5 − 7',
        options: ['−12', '−2', '2', '12'],
        correctIndex: 1,
        ms: '−2\n[B1]',
        topic: 'Negative numbers',
      },
      {
        id: 'j22p1_1c', qNum: '1(c)', marks: 1, type: 'mc',
        q: 'Circle the answer to −3 × 3',
        options: ['−9', '−6', '6', '9'],
        correctIndex: 0,
        ms: '−9\n[B1]',
        topic: 'Negative numbers',
      },
      {
        id: 'j22p1_2', qNum: '2', marks: 1, type: 'mc',
        q: 'P is double r. Circle the correct formula.',
        options: ['P = r/2', 'P = r + 2', 'P = r − 2', 'P = 2r'],
        correctIndex: 3,
        ms: 'P = 2r\n[B1]',
        topic: 'Algebra – formulae',
      },
      {
        id: 'j22p1_3', qNum: '3', marks: 3, type: 'written',
        q: 'By rounding each number to the nearest 10, estimate the value of:\n\n   31 × 18',
        ms: '600\n[B1: 30, B1: 20, B1ft: 30×20=600]',
        topic: 'Estimation & rounding',
      },
      {
        id: 'j22p1_4', qNum: '4', marks: 3, type: 'written',
        diagramKey: 'isosceles_triangle',
        q: 'In an isosceles triangle, AB = AC.\n[See diagram]\n\nThe perimeter of the triangle is 22 cm.\n\nWork out the length of AB.',
        ms: 'AB = 9 cm\n[M1: 22−4=18 or 22÷2=11 or 4÷2=2\nM1dep: 18÷2\nA1: 9\nSC1: 20 or 14]',
        topic: 'Isosceles triangles & perimeter',
      },
      {
        id: 'j22p1_7', qNum: '7', marks: 4, type: 'written',
        q: 'Cost per 100 grams:\n• Cereal: 49p\n• Pasta: 14p\n\nLeah buys 400 grams of cereal and 250 grams of pasta.\n\nWork out the total cost in £.',
        ms: '£2.31\n[M1: 0.49×4 or 1.96 (or 196p)\nA1: 1.96\nM1: 0.14×2.5 or 0.35 (or 35p)\nA1: 2.31]',
        topic: 'Money & proportional reasoning',
      },
      {
        id: 'j22p1_8a', qNum: '8(a)', marks: 2, type: 'written',
        q: 'For a set of five numbers:\n• the mode is 8\n• the median is 12\n\nWork out ONE possible set of five numbers.',
        ms: 'Any 5 numbers where mode=8 and median=12 e.g. 8, 8, 12, 15, 20\n[B2: both conditions met\nB1: one condition met]',
        topic: 'Statistics – mean, mode, median',
      },
      {
        id: 'j22p1_8b', qNum: '8(b)', marks: 1, type: 'written',
        q: 'Here are the heights (cm) of some children:\n\n   98  103  91  85  159  102  91\n\nWhich height is an outlier?',
        ms: '159 cm\n[B1]',
        topic: 'Statistics – outliers',
      },
      {
        id: 'j22p1_9', qNum: '9', marks: 4, type: 'written',
        q: 'Shona has 14 dresses.\n50% of these dresses are red.\nShe gives 5 of her red dresses to a charity shop.\nShe buys 1 new red dress.\n\nWhat percentage of the dresses she has now are red?',
        ms: '30%\n[M1: 50%×14=7 (red dresses initially)\nM1: 14−5+1=10 (total dresses) and 7−5+1=3 (red)\nA1: 3/10\nB1ft: 30%]',
        topic: 'Percentages',
      },
      {
        id: 'j22p1_10a', qNum: '10(a)', marks: 2, type: 'written',
        q: 'Here is an isosceles triangle with sides 120 mm, 120 mm and 40 mm.\n\nWork out: (length of shortest side) ÷ (length of longest side)\n\nGive your answer as a fraction in its simplest form.',
        ms: '1/3\n[B2: 1/3\nB1: 40/120 or equivalent unsimplified]',
        topic: 'Fractions & ratio',
      },
      {
        id: 'j22p1_10b', qNum: '10(b)', marks: 3, type: 'written',
        diagramKey: 'triangle_angles',
        q: 'In a triangle, x = 3y.\n[See diagram — triangle with angle x at top and angle y at each base]\n\nWork out the size of angle y.',
        ms: 'y = 17°\n[M1: 180−112=68 or 3y+y+112=180\nM1dep: 68÷4\nA1: 17]',
        topic: 'Angles in triangles',
      },
      {
        id: 'j22p1_11a', qNum: '11(a)', marks: 2, type: 'written',
        q: 'Companies A and B sell phone insurance:\n\n            Damage    Loss\nCompany A:  £8.65     £12.20\nCompany B:  £7.25     £14.10\n\nWork out the difference in monthly cost for the two types of cover with Company A.',
        ms: '£3.55\n[M1: 12.20−8.65\nA1: 3.55]',
        topic: 'Money',
      },
      {
        id: 'j22p1_11b', qNum: '11(b)', marks: 3, type: 'written',
        q: 'Ben wants Damage cover with Company B (£7.25/month).\n\nHow much in total will he pay for one year?',
        ms: '£87.00\n[M1: 7.25×12\nM1dep: correct method\nA1: 87]',
        topic: 'Money & multiplication',
      },
      {
        id: 'j22p1_12', qNum: '12', marks: 2, type: 'written',
        q: 'Work out:  11/18 − 1/3',
        ms: '5/18\n[M1: convert to common denominator (18ths) — 11/18 − 6/18\nA1: 5/18]',
        topic: 'Fractions – subtraction',
      },
      {
        id: 'j22p1_13a', qNum: '13(a)', marks: 3, type: 'written',
        q: 'The term-to-term rule for a sequence is "multiply by 2".\nThe 3rd term of the sequence is 46.\n\nWork out the 1st term. Give your answer as a decimal.',
        ms: '11.5\n[M1: 46÷2 or 23\nM1dep: 23÷2\nA1: 11.5]',
        topic: 'Sequences',
      },
      {
        id: 'j22p1_13b', qNum: '13(b)', marks: 3, type: 'written',
        q: 'The term-to-term rule for a different sequence is "subtract k".\nThe 1st term is 34.\nThe 4th term is 10.\n\nWork out the value of k.',
        ms: 'k = 8\n[M1: 34−10=24 or 10+k expressions\nM1dep: 24÷3 or 3k=24\nA1: 8\nSC2: −8]',
        topic: 'Sequences',
      },
      {
        id: 'j22p1_15', qNum: '15', marks: 4, type: 'written',
        q: 'In a bag there are only red, blue and green discs.\nThere are 10 red discs.\n\nWhen one disc is picked at random:\n• P(red) = 1/8\n• P(blue) = 2/5\n\nHow many green discs are in the bag?',
        ms: '38 green discs\n[M1: 10×8=80 (total)\nM1: 2/5×80=32 (blue)\nM1dep: 80−32−10=38\nA1: 38]',
        topic: 'Probability',
      },
      {
        id: 'j22p1_18', qNum: '18', marks: 2, type: 'written',
        q: 'Work out:  80 000 000 ÷ 200\n\nGive your answer in standard form.',
        ms: '4 × 10⁵\n[B2: 4×10⁵\nB1: 400 000 (correct but not in standard form)]',
        topic: 'Standard form',
      },
      {
        id: 'j22p1_19a', qNum: '19(a)', marks: 2, type: 'written',
        q: 'Work out:  3¹² ÷ 3⁷\n\nGive your answer as a whole number.',
        ms: '243\n[B2: 243\nB1: 3⁵ or 35 as an index expression]',
        topic: 'Powers & indices',
      },
      {
        id: 'j22p1_19b', qNum: '19(b)', marks: 2, type: 'written',
        q: 'Simplify:  8 × 2⁶ × 2⁴\n\nGive your answer as a power of 2.',
        ms: '2¹³\n[B2: 2¹³\nB1: 8=2³ seen, or 2¹⁰ seen, or 8192 seen]',
        topic: 'Powers & indices',
      },
      {
        id: 'j22p1_20', qNum: '20', marks: 2, type: 'written',
        diagramKey: 'venn_diagram',
        q: 'In a group of 98 students:\n• 25 study both Art and French\n• 10 study Art but not French\n• 41 study French\n\n[See diagram — Joel\'s Venn diagram]\n\nMake TWO criticisms of Joel\'s diagram.',
        ms: 'Criticism 1: The circles are not labelled (A and F labels missing).\nCriticism 2: The numbers do not add up to 98 — the value 48 (outside both circles) should be 47 (since 10+25+16=51, not 52).\n[B1 each]',
        topic: 'Venn diagrams',
      },
    ]
  },
}

// ─── All topics for filtering ─────────────────────────────────────────────────
export const MATHS_TOPICS = [
  'All topics',
  'Number',
  'Negative numbers',
  'Fractions',
  'Fractions & decimals',
  'Fractions – division',
  'Fractions & ratio',
  'Percentages',
  'Percentage increase & decrease',
  'Powers',
  'Powers & prime factors',
  'Powers & indices',
  'Standard form',
  'Algebra – substitution',
  'Algebra – rearranging',
  'Algebra – expanding brackets',
  'Algebra – factorising',
  'Algebra – formulae',
  'Sequences',
  'Sequences – nth term',
  'Inequalities',
  'Angles on a straight line',
  'Angles in triangles',
  'Angles – polygons',
  'Area & percentages',
  'Volume – spheres',
  'Similarity',
  'Transformations – translation',
  'Statistics – mean, mode, median',
  'Statistics – outliers',
  'Probability',
  'Speed, distance, time',
  'Money',
  'Money & percentages',
  'Ratio & fractions',
  'Units & conversion',
  'Order of operations (BIDMAS)',
  'Estimation & rounding',
  'Time calculations',
  'Isosceles triangles & perimeter',
]

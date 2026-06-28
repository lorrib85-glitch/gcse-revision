export default {
  "id": "math4",
  "subject": "Maths",
  "number": 4,
  "title": "BIDMAS and calculator control",
  "subtitle": "Order of operations, bracket entry and estimation",
  "era": "Number survival kit",
  "icon": "🧮",
  "color": "#2DD4BF",
  "colorLight": "rgba(45,212,191,.12)",
  "headerImage": "/headers/maths-numbers.webp",

  "module": "number-survival-kit",
  "moduleNumber": 1,
  "chapterNumber": 4,
  "aqaLinks": ["N3", "N6", "N7"],
  "mapsToMathsGroups": ["maths_bidmas"],
  "weaknessTags": ["maths:bidmas", "maths:calculator-control"],
  "prerequisiteChapters": ["math1", "math2", "math3"],

  "hook": {
    "scenario": {
      "location": "AQA Foundation Paper 1 (non-calculator)",
      "hint": "A student evaluates 4 + 3 × 2 and writes 14."
    },
    "statement": "4 + 3 × 2 = 14",
    "isTrue": false,
    "accentWords": ["4 + 3 × 2", "14"],
    "explanation": "Multiplication comes before addition in BIDMAS. 3 × 2 = 6 first. Then 4 + 6 = 10. The answer 14 comes from working left-to-right: (4 + 3) × 2 = 14 — but there are no brackets here. BIDMAS gives 10.",
    "wrongFeedback": "Multiplication before addition. 3 × 2 = 6 first, then 4 + 6 = 10.",
    "correctFeedback": "Right. 3 × 2 = 6 first (multiplication before addition), then 4 + 6 = 10.",
    "loadingText": "Let's see exactly how BIDMAS controls the order — and why the calculator can lie if you don't use brackets…",
    "bigQuestion": "Why do we need an agreed order of operations — and what happens when you ignore it?",
    "revealHeader": "BIDMAS: the agreed order every mathematician follows.",
    "revealItems": [
      {
        "emoji": "📐",
        "label": "B — Brackets first",
        "detail": "Whatever is inside brackets is calculated first, regardless of what operations are inside. (2 + 3) × 4 = 5 × 4 = 20. Without brackets: 2 + 3 × 4 = 2 + 12 = 14. Brackets change the answer."
      },
      {
        "emoji": "🔢",
        "label": "I — Indices (powers and roots) second",
        "detail": "Powers and square roots come before × ÷ + −. So 3 + 2² = 3 + 4 = 7, not 5² = 25."
      },
      {
        "emoji": "⚖️",
        "label": "D and M together, left to right",
        "detail": "Division and Multiplication have equal priority — work left to right. 12 ÷ 4 × 3 = 3 × 3 = 9, not 12 ÷ 12 = 1. Same for Addition and Subtraction: equal priority, left to right."
      }
    ],
    "punchline": "BIDMAS is the universal agreement about order. Miss it and every multi-operation calculation can give the wrong answer."
  },

  "intro": {
    "learningGoals": [
      "Apply BIDMAS to evaluate any expression in the correct order",
      "Recognise that Division/Multiplication and Addition/Subtraction have equal priority within each pair",
      "Enter expressions into a calculator correctly using brackets",
      "Use estimation (rounding to 1 s.f.) to check answers"
    ]
  },

  "outcomes": {
    "intro": "BIDMAS underpins every multi-step maths calculation. It appears directly in AQA Foundation Paper 1 and is embedded in algebra, formula substitution and calculator questions throughout the course.",
    "bullets": [
      "Evaluate expressions in the correct BIDMAS order every time",
      "Apply the equal-priority rule: D and M left-to-right; A and S left-to-right",
      "Use calculator brackets to ensure the machine computes in the right order",
      "Estimate using 1 significant figure to sense-check any calculation"
    ]
  },

  "recall": {
    "questions": [
      {
        "type": "truefalse",
        "question": "In 60 ÷ 2 + 4, the division must be done before the addition.",
        "isTrue": true
      },
      {
        "type": "choice",
        "question": "Work out 3 + 4² − 1",
        "options": ["48", "18", "50"],
        "correct": 1
      },
      {
        "type": "connection",
        "question": "12 ÷ 4 × 3 = ?",
        "options": [
          { "text": "1 (division first, then multiply)", "icon": "warning" },
          { "text": "9 (left-to-right: 12÷4=3, then 3×3=9)", "icon": "lightbulb" },
          { "text": "16 (multiply first)", "icon": "arrow" }
        ],
        "correct": 1
      }
    ]
  },

  "screens": [
    {
      "tag": "maths:bidmas",
      "label": "The order trap",
      "kicker": "Section 1 — Why it matters",
      "heading": "Why 4 + 3 × 2 = 10, not 14.",
      "sub": "Every multi-operation calculation depends on BIDMAS. Get the order wrong and every answer is wrong.",
      "blocks": [
        {
          "type": "read",
          "label": "The exam stake",
          "text": "BIDMAS errors are embedded in <strong>every multi-step AQA question</strong>. Formula substitution, solving equations, area calculations, and probability all require correct order of operations. An ordering error at step 1 makes every subsequent step wrong — losing all accuracy marks."
        },
        {
          "type": "quiz",
          "question": "Work out 60 ÷ 2 + 4",
          "options": [
            { "text": "10 (added 2 and 4 first)", "correct": false },
            { "text": "34 (division before addition: 60÷2=30, 30+4=34)", "correct": true },
            { "text": "30 (ignored the +4)", "correct": false }
          ],
          "explanation": "BIDMAS: division before addition. 60 ÷ 2 = 30 first. Then 30 + 4 = 34. Working left-to-right without BIDMAS gives 60 ÷ 6 = 10 — the most common wrong answer."
        },
        {
          "type": "examtip",
          "tip": "<strong>Series pillar: Number sense.</strong> Before evaluating any expression, scan it for the highest-priority operation. Brackets override everything. Then indices. Then division/multiplication. Then addition/subtraction."
        }
      ]
    },

    {
      "tag": null,
      "label": "Prior knowledge",
      "kicker": "Section 2 — Check your foundations",
      "heading": "What do you already know?",
      "sub": "These questions check the building blocks for this chapter.",
      "blocks": [
        {
          "type": "read",
          "label": "Prerequisite skills",
          "text": "This chapter requires: <strong>the four operations from Ch2</strong> (calculation fluency), <strong>negative numbers from Ch3</strong> (expressions can contain negatives), and <strong>basic powers and roots</strong> (indices is the I in BIDMAS)."
        },
        {
          "type": "quiz",
          "question": "Work out 3²",
          "options": [
            { "text": "6 (doubled instead of squared)", "correct": false },
            { "text": "9 (3 × 3)", "correct": true },
            { "text": "8 (confused with 2³)", "correct": false }
          ],
          "explanation": "3² = 3 × 3 = 9. A power means 'multiply the base by itself that many times'. 3² = 3 × 3 = 9."
        },
        {
          "type": "quiz",
          "question": "Work out 24 ÷ 4",
          "options": [
            { "text": "4", "correct": false },
            { "text": "6", "correct": true },
            { "text": "8", "correct": false }
          ],
          "explanation": "24 ÷ 4 = 6. Check: 6 × 4 = 24. ✓"
        }
      ]
    },

    {
      "tag": "maths:bidmas",
      "label": "BIDMAS order",
      "kicker": "Section 3 — Core idea",
      "heading": "The BIDMAS hierarchy.",
      "sub": "Six levels. Always work from the highest level down.",
      "blocks": [
        {
          "type": "read",
          "label": "The full order",
          "text": "<strong>B</strong> — Brackets: (…) first, regardless of content<br/><strong>I</strong> — Indices: powers (2³) and roots (√9)<br/><strong>DM</strong> — Division and Multiplication: equal priority, left-to-right<br/><strong>AS</strong> — Addition and Subtraction: equal priority, left-to-right<br/><br/>Alternative names: BODMAS (Order instead of Indices), PEMDAS (US) — same rules, different letters."
        },
        {
          "type": "quiz",
          "question": "Work out 2 + 3 × 4",
          "options": [
            { "text": "20 (left-to-right: (2+3)×4)", "correct": false },
            { "text": "14 (multiplication before addition: 3×4=12, 2+12=14)", "correct": true },
            { "text": "10 (reversed the operation)", "correct": false }
          ],
          "explanation": "Multiplication before addition. 3 × 4 = 12 first. Then 2 + 12 = 14."
        },
        {
          "type": "quiz",
          "question": "Work out 3 + 2² × 4",
          "options": [
            { "text": "100 (left-to-right)", "correct": false },
            { "text": "19 (indices then ×: 2²=4, 4×4=16, 3+16=19)", "correct": true },
            { "text": "23 (wrong order)", "correct": false }
          ],
          "explanation": "Indices first: 2² = 4. Then multiplication: 4 × 4 = 16. Then addition: 3 + 16 = 19."
        }
      ]
    },

    {
      "tag": "maths:bidmas",
      "label": "Equal priority: DM and AS",
      "kicker": "Section 3 — Core idea",
      "heading": "Division and multiplication have equal priority.",
      "sub": "This is the most commonly misunderstood part of BIDMAS — D before M is wrong.",
      "blocks": [
        {
          "type": "read",
          "label": "The equal-priority rule",
          "text": "<strong>Division and Multiplication (DM) have equal priority.</strong> When both appear in an expression with no brackets, work <em>left-to-right</em>. Do NOT always do division before multiplication.<br/><br/>Similarly, <strong>Addition and Subtraction (AS) have equal priority</strong> — work left-to-right.<br/><br/>Example: 12 ÷ 4 × 3<br/>Left-to-right: 12 ÷ 4 = 3, then 3 × 3 = 9 ✓<br/>Wrong: 12 ÷ (4 × 3) = 12 ÷ 12 = 1 ✗"
        },
        {
          "type": "quiz",
          "question": "Work out 12 ÷ 4 × 3",
          "options": [
            { "text": "1 (divided first, then multiplied the divisor)", "correct": false },
            { "text": "9 (left-to-right: 12÷4=3, then 3×3=9)", "correct": true },
            { "text": "144 (multiplied first)", "correct": false }
          ],
          "explanation": "D and M have equal priority — work left-to-right. 12 ÷ 4 = 3 (first, because it's first on the left). Then 3 × 3 = 9."
        },
        {
          "type": "quiz",
          "question": "Work out 10 − 3 + 2",
          "options": [
            { "text": "5 (subtracted both from 10)", "correct": false },
            { "text": "9 (left-to-right: 10−3=7, 7+2=9)", "correct": true },
            { "text": "10 − 5 = 5", "correct": false }
          ],
          "explanation": "A and S have equal priority — work left-to-right. 10 − 3 = 7 first. Then 7 + 2 = 9. Not 10 − (3 + 2) = 5."
        }
      ]
    },

    {
      "tag": "maths:bidmas",
      "label": "Brackets change everything",
      "kicker": "Section 3 — Core idea",
      "heading": "Brackets override the entire hierarchy.",
      "sub": "Brackets are the most powerful symbol in BIDMAS — they force a sub-calculation first.",
      "blocks": [
        {
          "type": "read",
          "label": "What brackets do",
          "text": "Brackets tell you: <em>calculate this sub-expression first, regardless of what operations are outside</em>. This means you can 'force' addition to happen before multiplication:<br/><br/>Without brackets: 2 + 3 × 4 = 2 + 12 = 14<br/>With brackets: (2 + 3) × 4 = 5 × 4 = 20<br/><br/>The brackets completely change the answer."
        },
        {
          "type": "quiz",
          "question": "Work out (6 + 2) × (10 − 3)",
          "options": [
            { "text": "26 (ignored brackets)", "correct": false },
            { "text": "56 ((6+2)=8; (10−3)=7; 8×7=56)", "correct": true },
            { "text": "62 (concatenated digits)", "correct": false }
          ],
          "explanation": "Brackets first: (6 + 2) = 8 and (10 − 3) = 7. Then 8 × 7 = 56."
        },
        {
          "type": "fillblanks",
          "sentences": [
            {
              "before": "(3 + 7) × 2 =",
              "after": "",
              "answer": "20",
              "hints": [
                "Brackets first: 3 + 7 = ?",
                "3 + 7 = 10. Then 10 × 2 = 20."
              ]
            },
            {
              "before": "3 + 7 × 2 =",
              "after": "",
              "answer": "17",
              "hints": [
                "No brackets. Multiplication before addition.",
                "7 × 2 = 14. Then 3 + 14 = 17."
              ]
            }
          ],
          "correctMsg": "Good — brackets change the value of an expression.",
          "wrongMsg": "Remember: with brackets, calculate inside them first. Without brackets, multiplication before addition."
        }
      ]
    },

    {
      "tag": "maths:calculator-control",
      "label": "Calculator bracket entry",
      "kicker": "Section 3 — Core idea",
      "heading": "Entering expressions into a calculator correctly.",
      "sub": "A calculator follows BIDMAS — but only if you tell it the correct expression.",
      "blocks": [
        {
          "type": "read",
          "label": "Why the calculator can give wrong answers",
          "text": "Calculators apply BIDMAS automatically — but they evaluate the expression you type, not what you mean. A common error: calculating (6 + 8) ÷ 2.<br/><br/><strong>Wrong entry:</strong> 6 + 8 ÷ 2 → calculator computes 6 + 4 = 10 (divides 8 by 2 first)<br/><strong>Correct entry:</strong> (6 + 8) ÷ 2 → calculator computes 14 ÷ 2 = 7 ✓<br/><br/>Rule: any time you want to divide by (or multiply by) a sum, you MUST put brackets around that sum."
        },
        {
          "type": "quiz",
          "question": "You want to calculate (3 + 7) ÷ (2 + 3) on a calculator. Which entry gives the correct result?",
          "options": [
            { "text": "3 + 7 ÷ 2 + 3 (no brackets)", "correct": false },
            { "text": "(3 + 7) ÷ (2 + 3) (both sums in brackets)", "correct": true },
            { "text": "3 + 7 ÷ (2 + 3) (only denominator in brackets)", "correct": false }
          ],
          "explanation": "Both the numerator and denominator must be in brackets: (3 + 7) ÷ (2 + 3) = 10 ÷ 5 = 2. Without the first bracket, the calculator computes 3 + [7 ÷ 5] + 3 = 4.4 ≠ 2."
        },
        {
          "type": "quiz",
          "question": "A student types 24 ÷ 6 × 2 into a calculator. What does it display?",
          "options": [
            { "text": "2 (calculator does 6×2 first)", "correct": false },
            { "text": "8 (calculator works left-to-right: 24÷6=4, 4×2=8)", "correct": true },
            { "text": "72 (calculator multiplies 24 by 6 somehow)", "correct": false }
          ],
          "explanation": "Calculators apply BIDMAS, so DM left-to-right: 24 ÷ 6 = 4 first, then 4 × 2 = 8."
        }
      ]
    },

    {
      "tag": "maths:bidmas",
      "label": "Worked example",
      "kicker": "Section 4 — Examiner method",
      "heading": "Full worked example.",
      "sub": "Show every step. One BIDMAS error can cascade through every subsequent mark.",
      "blocks": [
        {
          "type": "read",
          "label": "The question",
          "text": "<strong>Work out: 3 × (4 + 1)² − 6 ÷ 2</strong><br/><em>(2 marks)</em>"
        },
        {
          "type": "read",
          "label": "Step 1 — Brackets",
          "text": "(4 + 1) = 5"
        },
        {
          "type": "read",
          "label": "Step 2 — Indices",
          "text": "5² = 25"
        },
        {
          "type": "read",
          "label": "Step 3 — Multiplication and Division (left-to-right)",
          "text": "3 × 25 = 75 &nbsp;&nbsp;·&nbsp;&nbsp; 6 ÷ 2 = 3"
        },
        {
          "type": "read",
          "label": "Step 4 — Subtraction",
          "text": "75 − 3 = 72<br/><br/><em>Mark scheme: 1M for correct BIDMAS sequence (brackets then indices); 1A for 72</em>"
        },
        {
          "type": "quiz",
          "question": "Apply the same method: 2 × (3 + 2)² − 4 × 3",
          "options": [
            { "text": "38 (2×25=50, 4×3=12, 50−12=38)", "correct": true },
            { "text": "98 (wrong order)", "correct": false },
            { "text": "46 (arithmetic error)", "correct": false }
          ],
          "explanation": "Brackets: (3+2)=5. Indices: 5²=25. Multiply: 2×25=50; 4×3=12. Subtract: 50−12=38."
        }
      ]
    },

    {
      "tag": null,
      "label": "Guided practice",
      "kicker": "Section 5 — Practice with support",
      "heading": "Complete the expressions.",
      "sub": "Apply BIDMAS step by step.",
      "blocks": [
        {
          "type": "read",
          "label": "Method reminder",
          "text": "Scan the expression before calculating. Identify the highest-priority operation. Work systematically: B → I → DM (left-to-right) → AS (left-to-right)."
        },
        {
          "type": "fillblanks",
          "sentences": [
            {
              "before": "5 + 3 × 4 =",
              "after": "",
              "answer": "17",
              "hints": [
                "Multiplication before addition.",
                "3 × 4 = 12. Then 5 + 12 = 17."
              ]
            },
            {
              "before": "(5 + 3) × 4 =",
              "after": "",
              "answer": "32",
              "hints": [
                "Brackets first.",
                "5 + 3 = 8. Then 8 × 4 = 32."
              ]
            },
            {
              "before": "18 ÷ 3 × 2 =",
              "after": "",
              "answer": "12",
              "hints": [
                "D and M equal priority — work left-to-right.",
                "18 ÷ 3 = 6. Then 6 × 2 = 12."
              ]
            }
          ],
          "correctMsg": "Good — BIDMAS applied in the right order.",
          "wrongMsg": "Check your order: B → I → DM (left-to-right) → AS (left-to-right)."
        }
      ]
    },

    {
      "tag": "maths:bidmas",
      "label": "Spot the error",
      "kicker": "Section 6 — Common mistake",
      "heading": "Find and fix the error.",
      "sub": "This error pattern appears directly in AQA mark scheme notes.",
      "blocks": [
        {
          "type": "read",
          "label": "The student's working",
          "text": "A student works out 8 + 4 ÷ 2 and writes:<br/><strong>8 + 4 ÷ 2 = 12 ÷ 2 = 6</strong>"
        },
        {
          "type": "misconceptionCheck",
          "statements": [
            {
              "statement": "The student is correct: 8 + 4 ÷ 2 = 6",
              "answer": false,
              "reveal": "FALSE. BIDMAS requires division before addition. 4 ÷ 2 = 2 first. Then 8 + 2 = 10. The student added 8 + 4 = 12 first (left-to-right without BIDMAS), then divided by 2. The correct answer is 10.",
              "examTrap": "Working purely left-to-right without applying BIDMAS is the most frequent cause of wrong answers on multi-operation questions."
            }
          ]
        },
        {
          "type": "quiz",
          "question": "What is the correct answer to 8 + 4 ÷ 2?",
          "options": [
            { "text": "6 (left-to-right: added first)", "correct": false },
            { "text": "10 (division first: 4÷2=2, then 8+2=10)", "correct": true },
            { "text": "8 (ignored the 4÷2)", "correct": false }
          ],
          "explanation": "BIDMAS: division before addition. 4 ÷ 2 = 2. Then 8 + 2 = 10."
        }
      ]
    },

    {
      "tag": null,
      "label": "Maths in the wild",
      "kicker": "Section 7 — Real-world application",
      "heading": "BIDMAS in formulas and everyday calculation.",
      "sub": "Every formula in GCSE Maths — area, speed, probability — relies on correct order of operations.",
      "blocks": [
        {
          "type": "read",
          "label": "Why order of operations matters outside the exam",
          "text": "Every scientific formula uses BIDMAS implicitly. Speed = distance ÷ time. Area of a trapezium = (a + b) ÷ 2 × h (the brackets matter). A calculator programmed with a formula will give wrong results if you enter the values in the wrong order."
        },
        {
          "type": "scenario",
          "situation": "The area of a trapezium is A = (a + b) / 2 × h. For a trapezium with a = 5, b = 9, h = 4:",
          "question": "What is the area?",
          "options": [
            { "text": "13.5 (forgot to multiply by h)", "correct": false },
            { "text": "28 ((5+9)÷2 × 4 = 7 × 4 = 28)", "correct": true },
            { "text": "56 (did not divide by 2)", "correct": false }
          ],
          "correctMsg": "(5 + 9) = 14. 14 ÷ 2 = 7. 7 × 4 = 28 cm². Brackets around (a+b) are essential.",
          "wrongMsg": "Follow the formula: (a + b) first (brackets), then ÷ 2, then × h."
        },
        {
          "type": "scenario",
          "situation": "Estimate the answer to 382 ÷ 19.4 by rounding each number to 1 significant figure.",
          "question": "What is a good estimate?",
          "options": [
            { "text": "40 (rounded to the wrong s.f.)", "correct": false },
            { "text": "20 (400 ÷ 20 = 20)", "correct": true },
            { "text": "200 (division not applied)", "correct": false }
          ],
          "correctMsg": "382 ≈ 400 (1 s.f.). 19.4 ≈ 20 (1 s.f.). 400 ÷ 20 = 20. ✓",
          "wrongMsg": "Round each number to 1 significant figure first, then divide. 382 → 400. 19.4 → 20. 400 ÷ 20 = 20."
        }
      ]
    },

    {
      "tag": null,
      "label": "Retrieval",
      "kicker": "Section 8 — Retrieval practice",
      "heading": "Retrieval practice.",
      "sub": "Quick questions to lock in today's learning.",
      "blocks": [
        {
          "type": "read",
          "label": "Why retrieval matters",
          "text": "Retrieving knowledge immediately after learning doubles long-term retention. Answer without looking back."
        },
        {
          "type": "quiz",
          "question": "Work out 5 + 2³",
          "options": [
            { "text": "13 (added 5+2 first)", "correct": false },
            { "text": "13 — wait, which 13? (5 + 8 = 13 ✓)", "correct": true },
            { "text": "27 (3×(5+2)×something)", "correct": false }
          ],
          "explanation": "Indices before addition. 2³ = 8. Then 5 + 8 = 13."
        },
        {
          "type": "quiz",
          "question": "Work out 20 ÷ 4 × 2",
          "options": [
            { "text": "2.5 (multiplied 4×2 first)", "correct": false },
            { "text": "10 (left-to-right: 20÷4=5, 5×2=10)", "correct": true },
            { "text": "40 (did not divide)", "correct": false }
          ],
          "explanation": "D and M equal priority, left-to-right. 20 ÷ 4 = 5 first. Then 5 × 2 = 10."
        },
        {
          "type": "quiz",
          "question": "Work out (3 + 5)² ÷ 4",
          "options": [
            { "text": "16 ((3+5)²=64, 64÷4=16)", "correct": true },
            { "text": "28 (wrong order)", "correct": false },
            { "text": "34 (arithmetic error)", "correct": false }
          ],
          "explanation": "Brackets: 3 + 5 = 8. Indices: 8² = 64. Division: 64 ÷ 4 = 16."
        }
      ]
    },

    {
      "tag": "maths:calculator-control",
      "label": "Exam practice",
      "kicker": "Section 9 — AQA exam style",
      "heading": "Exam-style questions.",
      "sub": "AQA wording, method marks shown. Answer before reading the mark scheme.",
      "blocks": [
        {
          "type": "read",
          "label": "AQA exam pattern",
          "text": "BIDMAS questions on AQA Foundation appear in two forms: (1) direct evaluation of a multi-operation expression (1–2 marks), and (2) formula substitution where order determines the answer (2–3 marks). The most common wrong answer is always the result of working left-to-right without applying BIDMAS."
        },
        {
          "type": "boss",
          "tier": "🟢",
          "label": "Q1 — Direct evaluation (1 mark)",
          "question": "Work out 3 + 4 × 5",
          "markPoints": [
            "Answer: 23",
            "Award 1 mark for 23",
            "Common error: 35 (left-to-right: (3+4)×5)"
          ]
        },
        {
          "type": "boss",
          "tier": "🟡",
          "label": "Q2 — Multi-step BIDMAS (2 marks)",
          "question": "Work out (6 + 2)² ÷ (10 − 6)",
          "markPoints": [
            "Step 1: brackets: (6+2)=8; (10−6)=4",
            "Step 2: index: 8²=64",
            "Step 3: divide: 64÷4=16",
            "1 method mark for correct order (brackets then index); 1 accuracy for 16",
            "Common error: 2² ÷ 4 = 1 (adding 6+2=8 treated as a single term incorrectly)"
          ]
        },
        {
          "type": "boss",
          "tier": "🔴",
          "label": "Q3 — Calculator entry (2 marks, AO3)",
          "question": "Use your calculator to work out:\n(4.7 + 8.3) ÷ (2.6 × 0.5)\nWrite down all the figures on your calculator display.",
          "markPoints": [
            "Answer: (4.7+8.3) = 13; (2.6×0.5) = 1.3; 13 ÷ 1.3 = 10",
            "1 method mark for correct bracket entry structure",
            "1 accuracy mark for 10",
            "Common error: typing 4.7 + 8.3 ÷ 2.6 × 0.5 = 4.7 + 1.596... = 6.3 (no brackets, BIDMAS gives wrong grouping)"
          ]
        }
      ]
    },

    {
      "tag": null,
      "label": "Chapter complete",
      "kicker": "Section 10 — Confidence check",
      "heading": "Chapter 4 done.",
      "sub": "Key rules. Top traps. What comes next.",
      "blocks": [
        {
          "type": "read",
          "label": "Key rules for BIDMAS",
          "text": "1. <strong>Order:</strong> B → I → DM (left-to-right) → AS (left-to-right).<br/>2. <strong>D and M are equal:</strong> work left-to-right when both appear — do not always divide first.<br/>3. <strong>Brackets on a calculator:</strong> any sum in a numerator or denominator needs brackets.<br/>4. <strong>Estimation check:</strong> round to 1 significant figure to sense-check any multi-step calculation."
        },
        {
          "type": "read",
          "label": "Top 3 errors from AQA mark schemes",
          "text": "1. <strong>Left-to-right without BIDMAS:</strong> 8 + 4 ÷ 2 = 6 instead of 10.<br/>2. <strong>D before M regardless:</strong> 12 ÷ 4 × 3 = 1 instead of 9 — D and M are equal priority.<br/>3. <strong>Missing calculator brackets:</strong> (6 + 8) ÷ 2 entered as 6 + 8 ÷ 2 → calculator gives 10 instead of 7."
        },
        {
          "type": "examtip",
          "tip": "<strong>Exam habit:</strong> After any multi-step calculation, do a quick estimate (round everything to 1 s.f.) to check your answer is in the right ballpark. An estimate of 20 when your answer is 200 flags an error without needing the exact calculation."
        },
        {
          "type": "keypoint",
          "text": "<strong>Chapter 4 complete.</strong> You can now: evaluate any expression in the correct BIDMAS order · handle equal-priority D/M and A/S correctly · enter fractions and complex expressions into a calculator with the right brackets · estimate using 1 significant figure.<br/><br/>Next: Chapter 5 — Rounding, estimating and checking. BIDMAS and estimation go hand-in-hand in multi-step calculations."
        }
      ]
    }
  ],

  "series": "foundations",
  "recallTags": ["maths:bidmas", "maths:calculator-control"],
  "examTags": ["N3", "N6", "N7"],
  "assetKeys": [],
  "stageNavigation": [
    { "id": "s1",  "title": "The order trap",         "description": "Why 4+3×2 = 10, not 14",                  "screenIndex": 0 },
    { "id": "s2",  "title": "Prior knowledge",         "description": "Powers and division recall",                "screenIndex": 1 },
    { "id": "s3",  "title": "BIDMAS order",            "description": "B → I → DM → AS",                          "screenIndex": 2 },
    { "id": "s4",  "title": "Equal priority",          "description": "D and M left-to-right",                     "screenIndex": 3 },
    { "id": "s5",  "title": "Brackets",                "description": "Brackets override the hierarchy",            "screenIndex": 4 },
    { "id": "s6",  "title": "Calculator entry",        "description": "Bracket entry for fractions and sums",       "screenIndex": 5 },
    { "id": "s7",  "title": "Worked example",          "description": "Multi-operation expression step by step",    "screenIndex": 6 },
    { "id": "s8",  "title": "Guided practice",         "description": "Fill in the expressions",                   "screenIndex": 7 },
    { "id": "s9",  "title": "Spot the error",          "description": "Fix the left-to-right mistake",             "screenIndex": 8 },
    { "id": "s10", "title": "Real world",              "description": "Formulas and estimation",                    "screenIndex": 9 },
    { "id": "s11", "title": "Retrieval",               "description": "Lock it in with quick questions",            "screenIndex": 10 },
    { "id": "s12", "title": "Exam practice",           "description": "AQA-style BIDMAS questions",                 "screenIndex": 11 },
    { "id": "s13", "title": "Chapter complete",        "description": "Key rules and what comes next",              "screenIndex": 12 }
  ]
}

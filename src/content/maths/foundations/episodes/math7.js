export default {
  "id": "math7",
  "subject": "Maths",
  "number": 7,
  "title": "Powers, roots and standard form",
  "subtitle": "Indices, roots, powers of 10 and scientific notation",
  "era": "Number survival kit",
  "icon": "10ˣ",
  "color": "#2DD4BF",
  "colorLight": "rgba(45,212,191,.12)",
  "headerImage": "/headers/maths-numbers.webp",

  "module": "number-survival-kit",
  "moduleNumber": 1,
  "chapterNumber": 7,
  "aqaLinks": ["N6", "N7", "N9"],
  "mapsToMathsGroups": ["maths_indices"],
  "weaknessTags": ["maths:indices", "maths:standard-form", "maths:powers-roots"],
  "prerequisiteChapters": ["math4", "math5", "math6"],

  "hook": {
    "scenario": {
      "location": "AQA Foundation calculator display",
      "hint": "The distance from Earth to the Sun is about 149,600,000,000 m. A calculator may show this as 1.496E11."
    },
    "statement": "12 × 10⁴ is written in standard form",
    "isTrue": false,
    "accentWords": ["12 × 10⁴", "standard form"],
    "explanation": "Standard form must be A × 10ⁿ where 1 ≤ A < 10. Here A = 12, which is too big. 12 × 10⁴ = 1.2 × 10⁵.",
    "wrongFeedback": "Check the number before the ×10 power. In standard form, A must be at least 1 and less than 10. 12 is too large.",
    "correctFeedback": "Right. 12 × 10⁴ is not standard form. Correct form: 1.2 × 10⁵.",
    "loadingText": "Let's decode powers, roots and calculator E notation…",
    "bigQuestion": "How do tiny and enormous numbers fit neatly on one line?",
    "revealHeader": "Standard form is a compact number language.",
    "revealItems": [
      {
        "emoji": "☀️",
        "label": "Huge numbers",
        "detail": "149,600,000,000 can be written as 1.496 × 10¹¹. The 10¹¹ tells you the decimal point moves 11 places."
      },
      {
        "emoji": "🧫",
        "label": "Tiny numbers",
        "detail": "0.000037 can be written as 3.7 × 10⁻⁵. A negative power of 10 means a small positive number, not a negative number."
      },
      {
        "emoji": "🧮",
        "label": "Calculator display",
        "detail": "1.496E11 means 1.496 × 10¹¹. 6.5E-3 means 6.5 × 10⁻³."
      }
    ],
    "punchline": "In standard form, the front number must always be from 1 up to, but not including, 10."
  },

  "intro": {
    "learningGoals": [
      "Recall square numbers, cube numbers, square roots and cube roots",
      "Use positive integer index laws for the same base",
      "Convert large and small numbers to and from standard form",
      "Interpret calculator E notation",
      "Calculate with numbers in standard form and adjust the answer if needed"
    ]
  },

  "outcomes": {
    "intro": "Powers, roots and standard form appear in number questions, calculator displays, science contexts and later algebra. This chapter turns long strings of zeros into controlled notation.",
    "bullets": [
      "Know key squares and cubes by memory",
      "Apply index laws only when the bases are the same",
      "Use 1 ≤ A < 10 to check standard form",
      "Use positive powers of 10 for large numbers and negative powers for small numbers",
      "Read calculator displays such as 3.82E6 correctly"
    ]
  },

  "recall": {
    "questions": [
      {
        "type": "truefalse",
        "question": "12 × 10⁴ is in standard form.",
        "isTrue": false
      },
      {
        "type": "choice",
        "question": "What is √144?",
        "options": ["12", "72", "14"],
        "correct": 0
      },
      {
        "type": "connection",
        "question": "A calculator display of 3.82E6 means...",
        "options": [
          { "text": "3.82 × 10⁶", "icon": "lightbulb" },
          { "text": "3.82 × 6", "icon": "warning" },
          { "text": "3.82 − 6", "icon": "arrow" }
        ],
        "correct": 0
      }
    ]
  },

  "screens": [
    {
      "tag": "maths:standard-form",
      "label": "Standard form trap",
      "kicker": "Section 1 — Why it matters",
      "heading": "Why is 12 × 10⁴ not standard form?",
      "sub": "The A part must be between 1 and 10. This is the main rule students forget.",
      "blocks": [
        {
          "type": "read",
          "label": "The exam stake",
          "text": "Standard form questions often give easy marks for correct notation, but the answer must be in the form <strong>A × 10ⁿ</strong> where <strong>1 ≤ A &lt; 10</strong>. If A is 10 or more, the answer is not fully correct."
        },
        {
          "type": "misconceptionCheck",
          "statements": [
            {
              "statement": "12 × 10⁴ is in standard form because it uses a power of 10.",
              "answer": false,
              "reveal": "FALSE. Standard form needs A × 10ⁿ with 1 ≤ A < 10. Here A = 12, so it is too large. 12 × 10⁴ = 1.2 × 10⁵.",
              "examTrap": "Always check the front number after any standard form conversion or calculation."
            }
          ]
        },
        {
          "type": "quiz",
          "question": "Which is written in standard form?",
          "options": [
            { "text": "14.2 × 10³", "correct": false },
            { "text": "1.42 × 10⁴", "correct": true },
            { "text": "0.142 × 10⁵", "correct": false }
          ],
          "explanation": "Only 1.42 is at least 1 and less than 10. So 1.42 × 10⁴ is in standard form."
        }
      ]
    },

    {
      "tag": null,
      "label": "Prior knowledge",
      "kicker": "Section 2 — Check your foundations",
      "heading": "Powers build on earlier chapters.",
      "sub": "You have already met indices in BIDMAS and prime factorisation.",
      "blocks": [
        {
          "type": "read",
          "label": "Prerequisite skills",
          "text": "Chapter 4 taught that indices are evaluated before multiplication and addition. Chapter 6 used index form in prime factorisation, such as 60 = 2² × 3 × 5. Now we use powers directly."
        },
        {
          "type": "quiz",
          "question": "Write 60 as a product of prime factors in index form.",
          "options": [
            { "text": "2² × 3 × 5", "correct": true },
            { "text": "4 × 15", "correct": false },
            { "text": "2 × 2 × 3 × 5²", "correct": false }
          ],
          "explanation": "60 = 2 × 2 × 3 × 5 = 2² × 3 × 5."
        },
        {
          "type": "quiz",
          "question": "How many zeros are in 10⁶?",
          "options": [
            { "text": "5", "correct": false },
            { "text": "6", "correct": true },
            { "text": "10", "correct": false }
          ],
          "explanation": "10⁶ = 1,000,000, which has 6 zeros."
        }
      ]
    },

    {
      "tag": "maths:powers-roots",
      "label": "Squares and cubes",
      "kicker": "Section 3 — Core idea",
      "heading": "Squares and cubes are powers you must recognise.",
      "sub": "Roots undo powers.",
      "blocks": [
        {
          "type": "read",
          "label": "Squares, cubes and roots",
          "text": "A square is a number multiplied by itself: 6² = 6 × 6 = 36.<br/>A cube is a number multiplied by itself three times: 4³ = 4 × 4 × 4 = 64.<br/>A square root undoes squaring: √36 = 6. A cube root undoes cubing: ∛64 = 4."
        },
        {
          "type": "quiz",
          "question": "Work out √225.",
          "options": [
            { "text": "15", "correct": true },
            { "text": "25", "correct": false },
            { "text": "112.5", "correct": false }
          ],
          "explanation": "15² = 225, so √225 = 15."
        },
        {
          "type": "quiz",
          "question": "Work out ∛27.",
          "options": [
            { "text": "3", "correct": true },
            { "text": "9", "correct": false },
            { "text": "13.5", "correct": false }
          ],
          "explanation": "3³ = 3 × 3 × 3 = 27, so ∛27 = 3."
        }
      ]
    },

    {
      "tag": "maths:indices",
      "label": "Index laws",
      "kicker": "Section 3 — Core idea",
      "heading": "Index laws only work with the same base.",
      "sub": "Multiply: add indices. Divide: subtract indices. Power of a power: multiply indices.",
      "blocks": [
        {
          "type": "read",
          "label": "The three laws",
          "text": "For the same base:<br/><strong>aᵐ × aⁿ = aᵐ⁺ⁿ</strong><br/><strong>aᵐ ÷ aⁿ = aᵐ⁻ⁿ</strong><br/><strong>(aᵐ)ⁿ = aᵐˣⁿ</strong><br/><br/>But the base must be identical. 2³ × 3² cannot become 6⁵."
        },
        {
          "type": "quiz",
          "question": "Simplify 2³ × 2⁴.",
          "options": [
            { "text": "2⁷", "correct": true },
            { "text": "4⁷", "correct": false },
            { "text": "2¹²", "correct": false }
          ],
          "explanation": "Same base, multiply, so add the indices: 2³ × 2⁴ = 2⁷."
        },
        {
          "type": "quiz",
          "question": "Simplify (3²)⁴.",
          "options": [
            { "text": "3⁶", "correct": false },
            { "text": "3⁸", "correct": true },
            { "text": "12⁶", "correct": false }
          ],
          "explanation": "Power of a power: multiply the indices. 2 × 4 = 8, so (3²)⁴ = 3⁸."
        }
      ]
    },

    {
      "tag": "maths:standard-form",
      "label": "Standard form definition",
      "kicker": "Section 3 — Core idea",
      "heading": "A × 10ⁿ, where 1 ≤ A < 10.",
      "sub": "The power tells you how far the decimal point moves.",
      "blocks": [
        {
          "type": "read",
          "label": "Large and small numbers",
          "text": "Large numbers use a positive power of 10:<br/>8,300,000 = <strong>8.3 × 10⁶</strong>.<br/><br/>Small numbers use a negative power of 10:<br/>0.000037 = <strong>3.7 × 10⁻⁵</strong>.<br/><br/>A negative power does not mean the number is negative. It means it is small."
        },
        {
          "type": "quiz",
          "question": "Write 8,300,000 in standard form.",
          "options": [
            { "text": "83 × 10⁵", "correct": false },
            { "text": "8.3 × 10⁶", "correct": true },
            { "text": "0.83 × 10⁷", "correct": false }
          ],
          "explanation": "A must be between 1 and 10, so use 8.3. To get back to 8,300,000, move the decimal 6 places right: 8.3 × 10⁶."
        },
        {
          "type": "quiz",
          "question": "Write 0.000037 in standard form.",
          "options": [
            { "text": "3.7 × 10⁻⁵", "correct": true },
            { "text": "3.7 × 10⁵", "correct": false },
            { "text": "37 × 10⁻⁶", "correct": false }
          ],
          "explanation": "Move from 0.000037 to 3.7 by moving 5 places right, so the power is −5. Answer: 3.7 × 10⁻⁵."
        }
      ]
    },

    {
      "tag": "maths:standard-form",
      "label": "Back to ordinary numbers",
      "kicker": "Section 3 — Core idea",
      "heading": "Convert from standard form carefully.",
      "sub": "Positive power moves right. Negative power moves left.",
      "blocks": [
        {
          "type": "read",
          "label": "Moving the decimal point",
          "text": "If the power is positive, move the decimal point right.<br/>4.2 × 10³ = 4200.<br/><br/>If the power is negative, move the decimal point left.<br/>6.5 × 10⁻³ = 0.0065."
        },
        {
          "type": "quiz",
          "question": "Write 4.2 × 10³ as an ordinary number.",
          "options": [
            { "text": "4200", "correct": true },
            { "text": "0.0042", "correct": false },
            { "text": "42,000", "correct": false }
          ],
          "explanation": "10³ means move the decimal 3 places right: 4.2 → 4200."
        },
        {
          "type": "quiz",
          "question": "A calculator shows 3.82E6. What is the ordinary number?",
          "options": [
            { "text": "3,820,000", "correct": true },
            { "text": "382", "correct": false },
            { "text": "0.00000382", "correct": false }
          ],
          "explanation": "E6 means × 10⁶. So 3.82E6 = 3.82 × 10⁶ = 3,820,000."
        }
      ]
    },

    {
      "tag": "maths:standard-form",
      "label": "Standard form arithmetic",
      "kicker": "Section 3 — Core idea",
      "heading": "Calculate, then check A.",
      "sub": "If A is not between 1 and 10, adjust the answer.",
      "blocks": [
        {
          "type": "read",
          "label": "Multiplying and dividing standard form",
          "text": "Multiply or divide the front numbers. Then use index laws on the powers of 10.<br/><br/>Example: (3 × 10⁴) × (4 × 10³) = 12 × 10⁷. But 12 is too large for standard form, so adjust: <strong>1.2 × 10⁸</strong>."
        },
        {
          "type": "quiz",
          "question": "Work out (3 × 10⁴) × (2 × 10³) in standard form.",
          "options": [
            { "text": "6 × 10⁷", "correct": true },
            { "text": "5 × 10⁷", "correct": false },
            { "text": "6 × 10¹²", "correct": false }
          ],
          "explanation": "3×2=6 and 10⁴×10³ = 10⁷. A = 6 is already between 1 and 10, so the answer is 6 × 10⁷."
        },
        {
          "type": "quiz",
          "question": "Work out (8 × 10⁷) ÷ (2 × 10²) in standard form.",
          "options": [
            { "text": "4 × 10⁵", "correct": true },
            { "text": "4 × 10⁶", "correct": false },
            { "text": "6 × 10⁹", "correct": false }
          ],
          "explanation": "8÷2=4 and 10⁷÷10² = 10⁵. Answer: 4 × 10⁵. This is the common power-of-10 trap."
        }
      ]
    },

    {
      "tag": "maths:standard-form",
      "label": "Worked example",
      "kicker": "Section 4 — Examiner method",
      "heading": "Division in standard form.",
      "sub": "Use ordinary arithmetic or standard form — but check the power carefully.",
      "blocks": [
        {
          "type": "read",
          "label": "The question",
          "text": "<strong>Work out 80,000,000 ÷ 200. Give your answer in standard form.</strong>"
        },
        {
          "type": "read",
          "label": "Method 1 — ordinary numbers",
          "text": "80,000,000 ÷ 200 = 400,000.<br/>400,000 in standard form is <strong>4 × 10⁵</strong>."
        },
        {
          "type": "read",
          "label": "Method 2 — standard form",
          "text": "80,000,000 = 8 × 10⁷ and 200 = 2 × 10².<br/>(8 × 10⁷) ÷ (2 × 10²) = 4 × 10⁷⁻² = <strong>4 × 10⁵</strong>.<br/><br/>Common error: 4 × 10⁶ — off by one power of 10."
        },
        {
          "type": "quiz",
          "question": "What is the correct standard form answer for 80,000,000 ÷ 200?",
          "options": [
            { "text": "4 × 10⁵", "correct": true },
            { "text": "4 × 10⁶", "correct": false },
            { "text": "4 × 10⁹", "correct": false }
          ],
          "explanation": "80,000,000 ÷ 200 = 400,000 = 4 × 10⁵."
        }
      ]
    },

    {
      "tag": null,
      "label": "Guided practice",
      "kicker": "Section 5 — Practice with support",
      "heading": "Fill in the missing values.",
      "sub": "Practise roots, conversions and standard form calculations.",
      "blocks": [
        {
          "type": "fillblanks",
          "sentences": [
            {
              "before": "√225 =",
              "after": ".",
              "answer": "15",
              "hints": ["Which number squared gives 225?", "15 × 15 = 225."]
            },
            {
              "before": "0.000037 in standard form is 3.7 × 10^",
              "after": ".",
              "answer": "-5",
              "hints": ["Small numbers use negative powers of 10.", "Move from 3.7 back to 0.000037: 5 places left."]
            },
            {
              "before": "4.2 × 10³ as an ordinary number is",
              "after": ".",
              "answer": "4200",
              "hints": ["Positive power means move right.", "Move 4.2 three places right."]
            },
            {
              "before": "(3 × 10⁴) × (2 × 10³) = 6 × 10^",
              "after": ".",
              "answer": "7",
              "hints": ["Multiply the front numbers: 3 × 2 = 6.", "Add the powers: 4 + 3 = 7."]
            }
          ],
          "correctMsg": "Good — you are checking both the front number and the power of 10.",
          "wrongMsg": "Ask: is this roots, index laws, converting, or standard form arithmetic? Then use the matching rule."
        }
      ]
    },

    {
      "tag": "maths:standard-form",
      "label": "Spot the error",
      "kicker": "Section 6 — Common mistake",
      "heading": "Fix the standard form answer.",
      "sub": "A must be between 1 and 10.",
      "blocks": [
        {
          "type": "read",
          "label": "The student's answer",
          "text": "A student converts 149,600,000 to standard form and writes:<br/><strong>14.96 × 10⁷</strong>"
        },
        {
          "type": "misconceptionCheck",
          "statements": [
            {
              "statement": "14.96 × 10⁷ is written correctly in standard form.",
              "answer": false,
              "reveal": "FALSE. 14.96 is greater than 10, so it is not standard form. Move the decimal one place left: 1.496. To keep the value the same, increase the power by 1: 1.496 × 10⁸.",
              "examTrap": "If A ≥ 10, divide A by 10 and add 1 to the power."
            }
          ]
        },
        {
          "type": "quiz",
          "question": "Correct 14.96 × 10⁷ into standard form.",
          "options": [
            { "text": "1.496 × 10⁸", "correct": true },
            { "text": "149.6 × 10⁶", "correct": false },
            { "text": "1.496 × 10⁷", "correct": false }
          ],
          "explanation": "Move 14.96 to 1.496 by dividing by 10, so increase the power from 7 to 8."
        }
      ]
    },

    {
      "tag": null,
      "label": "Maths in the wild",
      "kicker": "Section 7 — Real-world application",
      "heading": "Tiny measurements, huge shortcuts.",
      "sub": "Science uses standard form because ordinary decimals get ridiculous fast.",
      "blocks": [
        {
          "type": "scenario",
          "situation": "A bacterium is approximately 3 × 10⁻⁶ m in diameter. A human hair is approximately 7 × 10⁻⁵ m wide.",
          "question": "About how many times wider is the hair than the bacterium?",
          "options": [
            { "text": "About 2.3 times", "correct": false },
            { "text": "About 23 times", "correct": true },
            { "text": "About 230 times", "correct": false }
          ],
          "correctMsg": "(7 × 10⁻⁵) ÷ (3 × 10⁻⁶) = (7÷3) × 10¹ ≈ 2.33 × 10 = 23.3, so about 23 times wider.",
          "wrongMsg": "Divide the widths. When dividing powers of 10, subtract the indices: −5 − (−6) = 1."
        },
        {
          "type": "scenario",
          "situation": "The distance from Earth to the Sun is about 1.496 × 10¹¹ m.",
          "question": "What does the power 11 tell you?",
          "options": [
            { "text": "Move the decimal point 11 places right to get the ordinary number", "correct": true },
            { "text": "The number is negative", "correct": false },
            { "text": "There are exactly 11 digits after the decimal point", "correct": false }
          ],
          "correctMsg": "A positive power of 10 tells you to move the decimal point right when converting back to an ordinary large number.",
          "wrongMsg": "Positive powers of 10 represent large numbers. Negative powers represent small positive numbers."
        }
      ]
    },

    {
      "tag": null,
      "label": "Retrieval",
      "kicker": "Section 8 — Retrieval practice",
      "heading": "Retrieval practice.",
      "sub": "Mixed questions from Chapters 4–7.",
      "blocks": [
        {
          "type": "quiz",
          "question": "Find the HCF of 36 and 48.",
          "options": [
            { "text": "12", "correct": true },
            { "text": "24", "correct": false },
            { "text": "6", "correct": false }
          ],
          "explanation": "From Chapter 6: the highest common factor of 36 and 48 is 12."
        },
        {
          "type": "quiz",
          "question": "Round 3.465 to 2 decimal places.",
          "options": [
            { "text": "3.46", "correct": false },
            { "text": "3.47", "correct": true },
            { "text": "3.5", "correct": false }
          ],
          "explanation": "To 2 d.p., keep 3.46 and look at the third decimal digit: 5, so round up to 3.47."
        },
        {
          "type": "quiz",
          "question": "Simplify 2³ × 2⁴.",
          "options": [
            { "text": "2⁷", "correct": true },
            { "text": "2¹²", "correct": false },
            { "text": "4⁷", "correct": false }
          ],
          "explanation": "Same base, multiply, add indices: 3 + 4 = 7."
        }
      ]
    },

    {
      "tag": "maths:indices",
      "label": "Exam practice",
      "kicker": "Section 9 — AQA exam style",
      "heading": "Exam-style questions.",
      "sub": "AQA-style wording, method marks shown. Answer before reading the mark scheme.",
      "blocks": [
        {
          "type": "boss",
          "tier": "🟢",
          "label": "Q1 — Root recall (1 mark)",
          "question": "Work out ∛27.",
          "markPoints": [
            "Answer: 3",
            "Reason: 3³ = 27",
            "Common error: 9, from confusing cube root with square root-style thinking"
          ]
        },
        {
          "type": "boss",
          "tier": "🟡",
          "label": "Q2 — Index law (2 marks)",
          "question": "Simplify 8 × 2⁶ × 2⁴. Give your answer as a power of 2.",
          "markPoints": [
            "Rewrite 8 as 2³",
            "2³ × 2⁶ × 2⁴ = 2¹³",
            "Common error: leaving answer as 8 × 2¹⁰ rather than a single power of 2"
          ]
        },
        {
          "type": "boss",
          "tier": "🔴",
          "label": "Q3 — Standard form correction (2 marks)",
          "question": "Explain why 12 × 10⁴ is not written in standard form, and write it correctly.",
          "markPoints": [
            "A must satisfy 1 ≤ A < 10",
            "12 is greater than 10, so it is not standard form",
            "Correct answer: 1.2 × 10⁵"
          ]
        }
      ]
    },

    {
      "tag": null,
      "label": "Chapter complete",
      "kicker": "Section 10 — Confidence check",
      "heading": "Chapter 7 done.",
      "sub": "Key rules. Top traps. What comes next.",
      "blocks": [
        {
          "type": "read",
          "label": "Key rules for powers and standard form",
          "text": "1. <strong>Square:</strong> x² = x × x. <strong>Cube:</strong> x³ = x × x × x.<br/>2. <strong>Roots undo powers:</strong> √225 = 15 and ∛27 = 3.<br/>3. <strong>Index laws:</strong> same base only — multiply add indices, divide subtract indices, power of power multiply indices.<br/>4. <strong>Standard form:</strong> A × 10ⁿ where 1 ≤ A &lt; 10.<br/>5. <strong>Positive n:</strong> large number. <strong>Negative n:</strong> small positive number.<br/>6. <strong>Calculator E:</strong> E means ×10 to a power."
        },
        {
          "type": "read",
          "label": "Top 3 errors",
          "text": "1. <strong>A too large:</strong> writing 12 × 10⁴ instead of 1.2 × 10⁵.<br/>2. <strong>Power off by one:</strong> 80,000,000 ÷ 200 = 4 × 10⁵, not 4 × 10⁶.<br/>3. <strong>Root mistake:</strong> √(16 + 9) = √25 = 5, not √16 + √9 = 7."
        },
        {
          "type": "examtip",
          "tip": "<strong>Exam habit:</strong> After every standard form calculation, check the front number. If it is not between 1 and 10, adjust the power."
        },
        {
          "type": "keypoint",
          "text": "<strong>Chapter 7 complete.</strong> You can now: use squares, cubes and roots · apply index laws · read calculator E notation · convert to and from standard form · calculate with standard form.<br/><br/>Next: Chapter 8 — Fractions that actually make sense."
        }
      ]
    }
  ],

  "series": "foundations",
  "recallTags": ["maths:indices", "maths:standard-form", "maths:powers-roots"],
  "examTags": ["N6", "N7", "N9"],
  "assetKeys": [],
  "stageNavigation": [
    { "id": "s1", "title": "Standard form trap", "description": "A must be between 1 and 10", "screenIndex": 0 },
    { "id": "s2", "title": "Prior knowledge", "description": "Powers from BIDMAS and primes", "screenIndex": 1 },
    { "id": "s3", "title": "Squares and cubes", "description": "Roots undo powers", "screenIndex": 2 },
    { "id": "s4", "title": "Index laws", "description": "Same base only", "screenIndex": 3 },
    { "id": "s5", "title": "Standard form definition", "description": "Large and small numbers", "screenIndex": 4 },
    { "id": "s6", "title": "Ordinary numbers", "description": "Convert back from standard form", "screenIndex": 5 },
    { "id": "s7", "title": "Standard form arithmetic", "description": "Calculate and adjust A", "screenIndex": 6 },
    { "id": "s8", "title": "Worked example", "description": "80,000,000 ÷ 200", "screenIndex": 7 },
    { "id": "s9", "title": "Guided practice", "description": "Roots and standard form blanks", "screenIndex": 8 },
    { "id": "s10", "title": "Spot the error", "description": "Fix A greater than 10", "screenIndex": 9 },
    { "id": "s11", "title": "Real world", "description": "Science and tiny measurements", "screenIndex": 10 },
    { "id": "s12", "title": "Retrieval", "description": "Mixed questions from Ch4–Ch7", "screenIndex": 11 },
    { "id": "s13", "title": "Exam practice", "description": "AQA-style powers questions", "screenIndex": 12 },
    { "id": "s14", "title": "Chapter complete", "description": "Key rules and next step", "screenIndex": 13 }
  ]
}

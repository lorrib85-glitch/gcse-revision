export default {
  "id": "math1",
  "subject": "Maths",
  "number": 1,
  "title": "Maths Survival Basics",
  "subtitle": "Number sense, negatives, BIDMAS",
  "era": "Foundation",
  "icon": "🔢",
  "color": "#4B90FF",
  "colorLight": "rgba(75,144,255,.12)",
  "hook": {
    "scenario": {
      "location": "Any exam hall",
      "hint": "A student stares at −8 and −3 on a number line. Which is bigger?"
    },
    "statement": "Negative numbers are always smaller than positive numbers.",
    "isTrue": false,
    "accentWords": [
      "always smaller"
    ],
    "explanation": "−3 is larger than −8. Negative numbers get smaller as they move further from zero. Direction matters, not just the minus sign.",
    "wrongFeedback": "Not quite. With negatives, think left and right — not just bigger digit.",
    "correctFeedback": "Right. −3 is bigger than −8 because it's further right on the number line.",
    "loadingText": "Let's see why on a number line…",
    "bigQuestion": "So how do we actually compare negative numbers?",
    "revealHeader": "Think left and right — not just bigger digit.",
    "revealItems": [
      {
        "emoji": "📍",
        "label": "Use a number line",
        "detail": "−3 sits to the RIGHT of −8. Further right = bigger. Always."
      },
      {
        "emoji": "🌡️",
        "label": "Real examples",
        "detail": "−3°C is warmer than −8°C. £−3 means less debt than £−8. Position on the line tells you size."
      },
      {
        "emoji": "⚠️",
        "label": "The common trap",
        "detail": "Students see −8 and think \"8 is bigger than 3, so −8 is bigger.\" That's the trap. The minus flips it."
      }
    ],
    "punchline": "Number line thinking beats digit thinking every time. That's the whole key."
  },
  "intro": {
    "learningGoals": [
      "Move confidently on a number line — adding right, subtracting left",
      "Handle negative numbers without sign panic",
      "Use BIDMAS so calculations happen in the right order",
      "Estimate first, then check if calculator answers are sensible"
    ]
  },
  "outcomes": {
    "intro": "Before anything else in maths makes sense, these fundamentals need to click. This chapter makes them click.",
    "bullets": [
      "Work confidently with negative numbers without second-guessing yourself",
      "Apply BIDMAS correctly so you stop losing easy marks",
      "Handle rounding, estimation and significant figures under exam pressure",
      "See why these basics show up in almost every GCSE maths question"
    ]
  },
  "recall": {
    "questions": [
      {
        "type": "truefalse",
        "question": "−3 is a greater value than −8.",
        "isTrue": true
      },
      {
        "type": "choice",
        "question": "In BIDMAS, what do you always calculate first?",
        "options": [
          "Any addition you can see",
          "Whatever is inside brackets",
          "Division before multiplication"
        ],
        "correct": 1
      },
      {
        "type": "connection",
        "question": "Estimation matters in exams because...",
        "options": [
          {
            "text": "It's always accurate enough to use as a final answer",
            "icon": "arrow"
          },
          {
            "text": "It helps you catch calculator errors before you write them down",
            "icon": "lightbulb"
          },
          {
            "text": "It replaces the need to do actual calculation",
            "icon": "warning"
          }
        ],
        "correct": 1
      }
    ]
  },
  "screens": [
    {
      "label": "Number Line",
      "kicker": "Core Skill 1",
      "heading": "Adding moves right.",
      "sub": "On a number line, right means bigger. Left means smaller.",
      "blocks": [
        {
          "type": "read",
          "label": "Why this matters",
          "text": "Used for <strong>temperatures</strong>, <strong>bank balances</strong>, <strong>scores</strong> and exam checking."
        },
        {
          "type": "quiz",
          "question": "Where would −2 + 6 land on the number line?",
          "options": [
            {"text": "−8", "correct": false},
            {"text": "4", "correct": true},
            {"text": "8", "correct": false}
          ],
          "explanation": "Start at −2. Adding 6 moves right. You land on 4."
        },
        {
          "type": "quiz",
          "question": "Starting at −3, add 8 then subtract 5. Where do you land?",
          "options": [
            {"text": "0", "correct": true},
            {"text": "6", "correct": false},
            {"text": "−10", "correct": false}
          ],
          "explanation": "−3 + 8 = 5. Then 5 − 5 = 0. Adding moves right, subtracting moves left."
        }
      ]
    },
    {
      "label": "Movement Rules",
      "kicker": "Active Recall",
      "heading": "Complete the movement rules.",
      "sub": "Lock in the rules that matter all year.",
      "blocks": [
        {
          "type": "read",
          "label": "Why this matters",
          "text": "This is the rule that stops <strong>negative-number mistakes</strong> in every topic — fractions, algebra, percentages."
        },
        {
          "type": "fillblanks",
          "sentences": [
            {
              "before": "Adding moves",
              "after": ".",
              "answer": "right",
              "hints": [
                "Think number line direction.",
                "Positive movement goes this way →"
              ]
            },
            {
              "before": "Subtracting moves",
              "after": ".",
              "answer": "left",
              "hints": [
                "Opposite of adding.",
                "Think ← direction."
              ]
            },
            {
              "before": "Numbers further right are",
              "after": ".",
              "answer": "bigger",
              "hints": [
                "Look at a number line.",
                "5 is to the right of 2. Which is bigger?"
              ]
            },
            {
              "before": "−3 is bigger than −8 because it is closer to",
              "after": ".",
              "answer": "zero",
              "hints": [
                "Think about position on the number line.",
                "Which is further right?"
              ]
            }
          ],
          "correctMsg": "Nice. That rule matters all year.",
          "wrongMsg": "Check the number line: adding moves right, subtracting moves left."
        }
      ]
    },
    {
      "label": "BIDMAS",
      "kicker": "Core Skill 2",
      "heading": "Calculations happen in layers.",
      "sub": "Some parts of a calculation must happen before others.",
      "blocks": [
        {
          "type": "read",
          "label": "Why this matters",
          "text": "Used whenever <strong>calculators</strong>, <strong>formulas</strong> or <strong>multi-step sums</strong> appear. BIDMAS prevents wrong answers."
        },
        {
          "type": "quiz",
          "question": "In the expression 3 + 4 × 2, which part should happen first?",
          "options": [
            {"text": "3 + 4", "correct": false},
            {"text": "4 × 2", "correct": true},
            {"text": "3 × 2", "correct": false}
          ],
          "explanation": "Multiplication before addition (BIDMAS). 4 × 2 = 8, then 3 + 8 = 11. Not 7 × 2 = 14."
        },
        {
          "type": "examtip",
          "tip": "Brackets change everything. Always: <strong>B</strong>rackets → <strong>I</strong>ndices → <strong>D</strong>ivision → <strong>M</strong>ultiplication → <strong>A</strong>ddition → <strong>S</strong>ubtraction. Calculators follow this exactly — but only if you enter the brackets correctly."
        }
      ]
    },
    {
      "label": "Quiz",
      "kicker": "Practice",
      "heading": "Test yourself.",
      "sub": "Three levels. Work through them in order.",
      "blocks": [
        {
          "type": "read",
          "label": "Why this matters",
          "text": "Quick practice helps your brain <strong>recognise patterns faster</strong>."
        },
        {
          "type": "tieredquiz",
          "tiers": [
            {
              "label": "Warm Up",
              "emoji": "🟢",
              "questions": [
                {
                  "q": "Which is bigger?",
                  "options": [
                    "−7",
                    "−2",
                    "They are equal"
                  ],
                  "correct": 1,
                  "feedback": "−2 is further right on the number line.",
                  "hint": "Imagine a number line."
                },
                {
                  "q": "Calculate: −4 + 9",
                  "options": [
                    "−13",
                    "5",
                    "13"
                  ],
                  "correct": 1,
                  "feedback": "Start at −4 and move right 9.",
                  "hint": "Start at −4, adding means move right."
                },
                {
                  "q": "What happens first in: 6 + 3 × 4",
                  "options": [
                    "6 + 3",
                    "3 × 4",
                    "6 × 4"
                  ],
                  "correct": 1,
                  "feedback": "Multiplication happens before addition (BIDMAS).",
                  "hint": "Which operation has higher priority?"
                }
              ]
            },
            {
              "label": "Challenge",
              "emoji": "🟡",
              "questions": [
                {
                  "q": "Calculate: 12 − 19",
                  "options": [
                    "7",
                    "−7",
                    "−31"
                  ],
                  "correct": 1,
                  "feedback": "12 − 12 = 0. Then 7 more left gives −7.",
                  "hint": "You will cross zero going left."
                },
                {
                  "q": "Calculate: 5 + 6²",
                  "options": [
                    "121",
                    "41",
                    "66"
                  ],
                  "correct": 1,
                  "feedback": "6² = 36. Then 5 + 36 = 41. Powers before addition.",
                  "hint": "Indices (powers) come before addition in BIDMAS."
                },
                {
                  "q": "Estimate: 302 × 19 is closest to...",
                  "options": [
                    "600",
                    "6000",
                    "60 000"
                  ],
                  "correct": 1,
                  "feedback": "302 ≈ 300, 19 ≈ 20. 300 × 20 = 6000.",
                  "hint": "Round both numbers to 1 significant figure first."
                }
              ]
            },
            {
              "label": "Boss Mode",
              "emoji": "🔴",
              "questions": [
                {
                  "q": "A calculator says: 12 × 4 = 0.48. What should you think?",
                  "options": [
                    "Accept it",
                    "Impossible — should be about 50",
                    "Round it to 0.5"
                  ],
                  "correct": 1,
                  "feedback": "12 × 4 = 48. 0.48 is a decimal/place-value error.",
                  "hint": "Estimate first: 12 × 4 is roughly 10 × 4 = 40."
                },
                {
                  "q": "Which calculator input matches: 4(3 + 5)",
                  "options": [
                    "4 × 3 + 5",
                    "4 × (3 + 5)",
                    "4 + 3 × 5"
                  ],
                  "correct": 1,
                  "feedback": "Brackets force 3 + 5 to happen first.",
                  "hint": "The brackets must be entered into the calculator too."
                },
                {
                  "q": "Calculate: 2 × (7 + 3) − 4",
                  "options": [
                    "10",
                    "16",
                    "24"
                  ],
                  "correct": 1,
                  "feedback": "Brackets first: 7+3=10. Multiply: 2×10=20. Subtract: 20−4=16.",
                  "hint": "Brackets first, then multiplication, then subtraction."
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "label": "Checkpoint",
      "kicker": "True or False",
      "heading": "Is this calculator answer possible?",
      "sub": "Impossible answers are warning lights.",
      "blocks": [
        {
          "type": "read",
          "label": "Why this matters",
          "text": "Used to catch answers that <strong>cannot possibly be right</strong> — the most common reason for lost marks."
        },
        {
          "type": "misconceptionCheck",
          "statements": [
            {
              "statement": "12 × 4 = 0.48 could be correct.",
              "answer": false,
              "reveal": "FALSE. 12 × 4 should be around 50. 12 × 4 = 48. 0.48 is less than 1. 12 lots of 4 cannot be less than 1. So the calculator entry went wrong.",
              "examTrap": null
            }
          ]
        }
      ]
    },
    {
      "label": "Simulator",
      "kicker": "Apply It",
      "heading": "The calculator is not your boss.",
      "sub": "Estimate first. Then decide if the answer is sensible.",
      "blocks": [
        {
          "type": "read",
          "label": "Why this matters",
          "text": "Used when <strong>shopping</strong>, <strong>budgeting</strong> and checking exam answers."
        },
        {
          "type": "scenario",
          "situation": "9 cinema tickets cost £7 each. The calculator shows: £6.30",
          "question": "Is this calculator answer sensible?",
          "options": [
            {"text": "Impossible — 9 × 7 = 63, not 6.30", "correct": true},
            {"text": "Possible — it's close enough", "correct": false},
            {"text": "Possible — decimals can appear in prices", "correct": false}
          ],
          "correctMsg": "9 × 7 = 63. Total should be £63. £6.30 is 10 times too small — likely a decimal point error.",
          "wrongMsg": "Estimate first: one ticket costs £7. Nine tickets must cost more than £7. 9 × 7 = 63."
        },
        {
          "type": "scenario",
          "situation": "A notebook costs £2.75. Jay buys 6. The calculator shows: £16.50",
          "question": "Is this calculator answer sensible?",
          "options": [
            {"text": "Possible — estimate is 6 × £3 = £18, which is close", "correct": true},
            {"text": "Impossible — it should be exactly £18", "correct": false},
            {"text": "Impossible — the answer is too small", "correct": false}
          ],
          "correctMsg": "6 × £2.75 = £16.50. Estimate: 6 × £3 = £18. £16.50 is close — sensible answer.",
          "wrongMsg": "Round first: 6 × £3 ≈ £18. Is £16.50 close to £18?"
        },
        {
          "type": "scenario",
          "situation": "A rectangle is 12 cm by 5 cm. The calculator shows the area as 0.6 cm².",
          "question": "Is this calculator answer sensible?",
          "options": [
            {"text": "Impossible — area = 12 × 5 = 60 cm²", "correct": true},
            {"text": "Possible — area is usually less than 1 cm² for small shapes", "correct": false},
            {"text": "Possible — it depends on the units", "correct": false}
          ],
          "correctMsg": "Area = 12 × 5 = 60 cm². 0.6 is far too small — likely a decimal point error.",
          "wrongMsg": "Area = length × width. What is 12 × 5?"
        }
      ]
    },
    {
      "label": "Exam Practice",
      "kicker": "Exam Style",
      "heading": "Exam practice.",
      "sub": "Answer the questions. Get feedback on method, not just the final answer.",
      "blocks": [
        {
          "type": "read",
          "label": "Why this matters",
          "text": "Used to turn practice into <strong>marks</strong>. Method matters as much as the answer."
        },
        {
          "type": "boss",
          "tier": "🟢",
          "label": "Q1 — Number Line",
          "question": "Calculate: −6 + 14",
          "markPoints": [
            "Answer: 8",
            "Method: start at −6, move right 14",
            "Award 1 mark for correct answer"
          ]
        },
        {
          "type": "boss",
          "tier": "🟡",
          "label": "Q2 — BIDMAS",
          "question": "Calculate: 10 + 2 × 5",
          "markPoints": [
            "Answer: 20",
            "Method: multiplication first — 2 × 5 = 10, then 10 + 10 = 20",
            "Common error: adding first gives 12 × 5 = 60 (wrong)",
            "Award 1 mark for correct answer with correct order shown"
          ]
        },
        {
          "type": "boss",
          "tier": "🔴",
          "label": "Q3 — Estimation (2 marks)",
          "question": "A student calculates: 302 × 19 = 5738. Use estimation to decide whether this is sensible. Show your working.",
          "markPoints": [
            "1 mark: estimate shown — 300 × 20 = 6000 (or equivalent)",
            "1 mark: conclusion — 5738 is close to 6000 so the answer is sensible",
            "Must show the estimate, not just say yes"
          ]
        }
      ]
    },
    {
      "label": "Final Rewind",
      "kicker": "Retrieval",
      "heading": "Final rewind",
      "sub": "Strong maths comes from retrieval, not rereading.",
      "blocks": [
        {
          "type": "read",
          "label": "Why this matters",
          "text": "Retrieval practice <strong>builds long-term memory</strong> faster than re-reading notes."
        },
        {
          "type": "quiz",
          "question": "Adding on a number line moves:",
          "options": [
            {
              "text": "left",
              "correct": false
            },
            {
              "text": "right",
              "correct": true
            },
            {
              "text": "nowhere",
              "correct": false
            }
          ],
          "explanation": "Adding always moves right on the number line."
        },
        {
          "type": "quiz",
          "question": "Subtracting moves:",
          "options": [
            {
              "text": "left",
              "correct": true
            },
            {
              "text": "right",
              "correct": false
            },
            {
              "text": "up",
              "correct": false
            }
          ],
          "explanation": "Subtracting always moves left on the number line."
        },
        {
          "type": "quiz",
          "question": "What happens first in: 3 + 5 × 2?",
          "options": [
            {
              "text": "3 + 5",
              "correct": false
            },
            {
              "text": "5 × 2",
              "correct": true
            },
            {
              "text": "3 × 2",
              "correct": false
            }
          ],
          "explanation": "Multiplication before addition — BIDMAS."
        },
        {
          "type": "quiz",
          "question": "Why should you estimate before using a calculator?",
          "options": [
            {
              "text": "To make the answer exactly right",
              "correct": false
            },
            {
              "text": "To check if the answer is sensible",
              "correct": true
            },
            {
              "text": "Calculators don't need checking",
              "correct": false
            }
          ],
          "explanation": "Estimation catches impossible answers — decimal errors, wrong operations, misread displays."
        },
        {
          "type": "keypoint",
          "text": "<strong>Module complete.</strong> You now have the survival tools: move on a number line · follow BIDMAS · estimate before trusting answers."
        }
      ]
    }
  ],
  "series": "foundations",
  "recallTags": [],
  "examTags": [],
  "assetKeys": [],
  "stageNavigation": [
    { "id": "part-1", "title": "Number lines", "description": "How the number line works", "screenIndex": 0 },
    { "id": "part-2", "title": "Movement rules", "description": "Adding right, subtracting left", "screenIndex": 1 },
    { "id": "part-3", "title": "BIDMAS", "description": "Order of calculations", "screenIndex": 2 },
    { "id": "part-4", "title": "Practice quiz", "description": "Retrieval across all skills", "screenIndex": 3 },
    { "id": "part-5", "title": "Calculator sense", "description": "Spotting impossible answers", "screenIndex": 4 },
    { "id": "part-6", "title": "Exam practice", "description": "Mark-scheme style questions", "screenIndex": 6 }
  ]
}

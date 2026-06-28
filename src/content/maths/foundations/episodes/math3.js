export default {
  "id": "math3",
  "subject": "Maths",
  "number": 3,
  "title": "Negative numbers without panic",
  "subtitle": "Sign rules, subtracting negatives and ordering on a number line",
  "era": "Number survival kit",
  "icon": "➖",
  "color": "#2DD4BF",
  "colorLight": "rgba(45,212,191,.12)",
  "headerImage": "/headers/maths-numbers.webp",

  "module": "number-survival-kit",
  "moduleNumber": 1,
  "chapterNumber": 3,
  "aqaLinks": ["N1", "N2"],
  "mapsToMathsGroups": [],
  "weaknessTags": ["maths:negative-numbers", "maths:ordering-negatives"],
  "prerequisiteChapters": ["math1", "math2"],

  "hook": {
    "scenario": {
      "location": "AQA Foundation Paper 1 (non-calculator)",
      "hint": "A student works out −3 + −5 and writes 2."
    },
    "statement": "−3 + −5 = 2",
    "isTrue": false,
    "accentWords": ["−3 + −5", "2"],
    "explanation": "Both numbers are negative. Adding two negatives moves further into negative territory — you don't cancel. −3 + −5 = −8. The answer 2 comes from subtracting the digits: 5 − 3 = 2 — but that's the wrong operation entirely.",
    "wrongFeedback": "Both signs are negative. Adding two negative numbers gives a more negative result. −3 + −5 = −8.",
    "correctFeedback": "Right. −3 + −5 = −8. Two negatives added together go further negative, not positive.",
    "loadingText": "Let's see why negative number arithmetic has just two rules that handle everything…",
    "bigQuestion": "Why does subtracting a negative give you more — not less?",
    "revealHeader": "Two sign rules handle every negative number calculation.",
    "revealItems": [
      {
        "emoji": "➕",
        "label": "Same signs → positive product/quotient",
        "detail": "Negative × negative = positive. Negative ÷ negative = positive. (+) × (+) = positive. This is the rule that surprises students: (−3) × (−4) = +12."
      },
      {
        "emoji": "➖",
        "label": "Different signs → negative product/quotient",
        "detail": "Positive × negative = negative. Negative × positive = negative. (+) × (−) = (−). And (−) × (+) = (−). One of each sign means negative."
      },
      {
        "emoji": "🌡️",
        "label": "Subtracting a negative = adding",
        "detail": "5 − (−3) = 5 + 3 = 8. The two minus signs cancel to make a plus. Temperature: 'rises from −6°C by 11°' means −6 + 11 = 5. 'Drops from 2°C past zero by 5°' means 2 − 5 = −3."
      }
    ],
    "punchline": "Negative numbers obey two sign rules — learn those two rules and every negative calculation is manageable."
  },

  "intro": {
    "learningGoals": [
      "Apply the two sign rules for multiplying and dividing with negatives",
      "Add and subtract negative numbers using the number line",
      "Interpret 'subtract a negative' as addition",
      "Order a mixed set of positive and negative numbers correctly"
    ]
  },

  "outcomes": {
    "intro": "Negative numbers appear across every AQA paper — in ordering tasks, temperature/finance contexts, and index/algebra questions. The sign rules are tested directly.",
    "bullets": [
      "Know the two sign rules: same signs → positive; different signs → negative",
      "Work out additions and subtractions that involve negative numbers",
      "Recognise that subtracting a negative is the same as adding the positive",
      "Order any list of negative and positive numbers correctly using the number line"
    ]
  },

  "recall": {
    "questions": [
      {
        "type": "truefalse",
        "question": "−3 × −4 = −12",
        "isTrue": false
      },
      {
        "type": "choice",
        "question": "Work out 5 − (−3)",
        "options": ["2", "8", "−2"],
        "correct": 1
      },
      {
        "type": "connection",
        "question": "The temperature is −6°C and rises by 11°. The new temperature is…",
        "options": [
          { "text": "−17°C", "icon": "warning" },
          { "text": "5°C", "icon": "lightbulb" },
          { "text": "−5°C", "icon": "arrow" }
        ],
        "correct": 1
      }
    ]
  },

  "screens": [
    {
      "tag": "maths:negative-numbers",
      "label": "The sign trap",
      "kicker": "Section 1 — Why it matters",
      "heading": "What's wrong with −3 + −5 = 2?",
      "sub": "Negative number errors are among the most common on AQA Foundation papers.",
      "blocks": [
        {
          "type": "read",
          "label": "The exam stake",
          "text": "Negative numbers appear on <strong>every AQA Foundation paper</strong>. Errors with signs cost marks in ordering tasks, temperature questions, algebra and probability. The root cause is almost always one of two things: confusing addition with subtraction, or forgetting what happens to signs when you multiply or divide."
        },
        {
          "type": "quiz",
          "question": "Work out −3 + −5",
          "options": [
            { "text": "2 (subtracted the digits)", "correct": false },
            { "text": "−8 (added two negatives)", "correct": true },
            { "text": "8 (dropped the signs)", "correct": false }
          ],
          "explanation": "Both numbers are negative. Adding two negatives moves further left on the number line: start at −3, move 5 more to the left → −8. The answer 2 comes from incorrectly subtracting 3 from 5."
        },
        {
          "type": "examtip",
          "tip": "<strong>Series pillar: Number sense.</strong> Before any negative number calculation, identify which operation is being applied. Mixing up addition and multiplication sign rules is the most common source of errors — these two rules are completely separate."
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
          "text": "This chapter requires: <strong>the number line from Ch1</strong> (negative numbers sit left of zero), <strong>addition and subtraction of whole numbers from Ch2</strong>, and <strong>basic multiplication facts</strong> (for sign rules in multiplication)."
        },
        {
          "type": "quiz",
          "question": "Which number is further left on the number line?",
          "options": [
            { "text": "−2", "correct": false },
            { "text": "−9", "correct": true },
            { "text": "0", "correct": false }
          ],
          "explanation": "Left means smaller (more negative). −9 is further left than −2. −2 is between −9 and 0."
        },
        {
          "type": "quiz",
          "question": "What is 3 × 4?",
          "options": [
            { "text": "7", "correct": false },
            { "text": "12", "correct": true },
            { "text": "34", "correct": false }
          ],
          "explanation": "3 × 4 = 12. Knowing multiplication facts is needed before we apply sign rules — the sign is separate from the size of the answer."
        }
      ]
    },

    {
      "tag": "maths:negative-numbers",
      "label": "Sign rules for × and ÷",
      "kicker": "Section 3 — Core idea",
      "heading": "Two sign rules for multiplying and dividing.",
      "sub": "These two rules apply to both × and ÷. Memorise them — they're tested on every paper.",
      "blocks": [
        {
          "type": "read",
          "label": "The two rules",
          "text": "<strong>Rule 1 — Same signs give positive:</strong><br/>(+) × (+) = (+) &nbsp;·&nbsp; (−) × (−) = (+) &nbsp;·&nbsp; (−) ÷ (−) = (+)<br/><br/><strong>Rule 2 — Different signs give negative:</strong><br/>(+) × (−) = (−) &nbsp;·&nbsp; (−) × (+) = (−) &nbsp;·&nbsp; (+) ÷ (−) = (−)<br/><br/><em>Memory trick: 'same sign = happy (positive), different sign = unhappy (negative)'</em>"
        },
        {
          "type": "quiz",
          "question": "Work out (−3) × (−4)",
          "options": [
            { "text": "−12 (negative × negative = negative)", "correct": false },
            { "text": "12 (negative × negative = positive)", "correct": true },
            { "text": "7 (added instead)", "correct": false }
          ],
          "explanation": "Both signs are negative — same signs → positive. (−3) × (−4) = +12 = 12. The digit part: 3 × 4 = 12. The sign part: (−) × (−) = (+)."
        },
        {
          "type": "quiz",
          "question": "Work out (−20) ÷ 4",
          "options": [
            { "text": "5", "correct": false },
            { "text": "−5", "correct": true },
            { "text": "−80", "correct": false }
          ],
          "explanation": "Different signs → negative. 20 ÷ 4 = 5. The sign: (−) ÷ (+) = (−). Answer: −5."
        }
      ]
    },

    {
      "tag": "maths:ordering-negatives",
      "label": "Adding and subtracting negatives",
      "kicker": "Section 3 — Core idea",
      "heading": "Adding and subtracting: use the number line.",
      "sub": "Addition and subtraction with negatives follows the number line, not the sign rules above.",
      "blocks": [
        {
          "type": "read",
          "label": "How to add and subtract negatives",
          "text": "<strong>Adding a positive:</strong> move right on the number line.<br/><strong>Adding a negative:</strong> move left (same as subtracting the positive).<br/><strong>Subtracting a positive:</strong> move left.<br/><strong>Subtracting a negative:</strong> move right — the two minuses cancel → move right (same as adding).<br/><br/>Key result: <strong>a − (−b) = a + b</strong>"
        },
        {
          "type": "quiz",
          "question": "Work out 5 − (−3)",
          "options": [
            { "text": "2", "correct": false },
            { "text": "8", "correct": true },
            { "text": "−2", "correct": false }
          ],
          "explanation": "Subtracting a negative = adding the positive: 5 − (−3) = 5 + 3 = 8. On the number line: start at 5, subtract negative means move right by 3 → land on 8."
        },
        {
          "type": "quiz",
          "question": "Work out −4 − 3",
          "options": [
            { "text": "−7", "correct": true },
            { "text": "−1", "correct": false },
            { "text": "1", "correct": false }
          ],
          "explanation": "−4 then subtract 3 more: move 3 left from −4 → −7. This is different from subtracting a negative — here you are subtracting a positive from a negative."
        }
      ]
    },

    {
      "tag": "maths:negative-numbers",
      "label": "Squaring negatives",
      "kicker": "Section 3 — Core idea",
      "heading": "(−4)² is not the same as −4².",
      "sub": "This distinction is a common trap on AQA papers — and it connects directly to BIDMAS.",
      "blocks": [
        {
          "type": "read",
          "label": "The distinction",
          "text": "<strong>(−4)² means: square the whole thing including the sign.</strong><br/>(−4)² = (−4) × (−4) = +16 (same signs → positive)<br/><br/><strong>−4² means: square the 4 first, then apply the minus sign.</strong><br/>−4² = −(4 × 4) = −16 (the minus sign is NOT part of the base being squared)"
        },
        {
          "type": "quiz",
          "question": "Work out (−5)²",
          "options": [
            { "text": "−25 (negative squared stays negative)", "correct": false },
            { "text": "25 (negative × negative = positive)", "correct": true },
            { "text": "10 (doubled instead of squared)", "correct": false }
          ],
          "explanation": "(−5)² = (−5) × (−5). Same signs → positive. 5 × 5 = 25. Answer: +25."
        },
        {
          "type": "misconceptionCheck",
          "statements": [
            {
              "statement": "(−8)² = −64 because squaring a negative gives a negative.",
              "answer": false,
              "reveal": "FALSE. (−8)² = (−8) × (−8). Same signs → positive. 8 × 8 = 64. So (−8)² = +64. Squaring a negative always gives a positive — because it's negative × negative.",
              "examTrap": "This trap appears in AQA mark schemes as the expected wrong answer whenever (−a)² is tested."
            }
          ]
        }
      ]
    },

    {
      "tag": "maths:negative-numbers",
      "label": "Temperature context",
      "kicker": "Section 3 — Core idea",
      "heading": "Real-world negatives: temperature.",
      "sub": "AQA regularly sets negative number questions in a temperature or finance context.",
      "blocks": [
        {
          "type": "read",
          "label": "Why temperature is the go-to context",
          "text": "Temperature questions are ideal for negatives because the direction is physical: colder = more negative = further left. 'The temperature rises by 11°C from −6°C' means start at −6 and add 11: −6 + 11 = 5°C. 'Falls by 8°C from 3°C' means 3 − 8 = −5°C."
        },
        {
          "type": "scenario",
          "situation": "At midnight, the temperature in Moscow is −6°C. By noon it has risen by 11°C.",
          "question": "What is the noon temperature?",
          "options": [
            { "text": "−17°C", "correct": false },
            { "text": "5°C", "correct": true },
            { "text": "−5°C", "correct": false }
          ],
          "correctMsg": "−6 + 11 = 5°C. Start at −6, move 11 right: −6, −5, −4, −3, −2, −1, 0, 1, 2, 3, 4, 5. ✓",
          "wrongMsg": "Start at −6 and add 11 by moving right on the number line. Count: −6 + 6 = 0, then +5 more = 5°C."
        },
        {
          "type": "scenario",
          "situation": "A diver is at −15 m. She descends a further 8 m.",
          "question": "What is her new depth?",
          "options": [
            { "text": "−7 m", "correct": false },
            { "text": "−23 m", "correct": true },
            { "text": "23 m", "correct": false }
          ],
          "correctMsg": "−15 − 8 = −23 m. Descending = going more negative. 15 + 8 = 23, so depth = −23 m.",
          "wrongMsg": "Descending means going further negative. −15 − 8: subtract 8 from −15 → −23."
        }
      ]
    },

    {
      "tag": "maths:negative-numbers",
      "label": "Worked example",
      "kicker": "Section 4 — Examiner method",
      "heading": "Full worked example.",
      "sub": "Show every step. Method marks are always available even if the final answer is wrong.",
      "blocks": [
        {
          "type": "read",
          "label": "The question",
          "text": "<strong>Work out: (−3) × 4 + (−2)²</strong><br/><em>(2 marks)</em>"
        },
        {
          "type": "read",
          "label": "Step 1 — Square first (indices before × in BIDMAS)",
          "text": "(−2)² = (−2) × (−2) = +4 &nbsp;&nbsp; [same signs → positive]"
        },
        {
          "type": "read",
          "label": "Step 2 — Multiply",
          "text": "(−3) × 4 = −12 &nbsp;&nbsp; [different signs → negative]"
        },
        {
          "type": "read",
          "label": "Step 3 — Add",
          "text": "−12 + 4 = −8<br/><br/><em>Mark scheme: 1M for correct sign rule applied to (−3) × 4; 1A for −8</em>"
        },
        {
          "type": "quiz",
          "question": "Apply the same method: (−2) × (−3) + (−1)²",
          "options": [
            { "text": "7 (both products positive)", "correct": true },
            { "text": "−5 (sign errors)", "correct": false },
            { "text": "5 (subtracted instead)", "correct": false }
          ],
          "explanation": "(−1)² = +1. (−2) × (−3) = +6. 6 + 1 = 7."
        }
      ]
    },

    {
      "tag": null,
      "label": "Guided practice",
      "kicker": "Section 5 — Practice with support",
      "heading": "Fill in the answers.",
      "sub": "Apply the sign rules to each calculation.",
      "blocks": [
        {
          "type": "read",
          "label": "Method reminder",
          "text": "<strong>× and ÷:</strong> same signs → positive; different signs → negative.<br/><strong>+ and −:</strong> use the number line; subtracting a negative = adding the positive."
        },
        {
          "type": "fillblanks",
          "sentences": [
            {
              "before": "(−6) × (−3) =",
              "after": "",
              "answer": "18",
              "hints": [
                "Same signs → positive. 6 × 3 = ?",
                "6 × 3 = 18. Same signs → +18."
              ]
            },
            {
              "before": "−12 ÷ 4 =",
              "after": "",
              "answer": "-3",
              "hints": [
                "Different signs → negative. 12 ÷ 4 = ?",
                "12 ÷ 4 = 3. Different signs → −3."
              ]
            },
            {
              "before": "3 − (−7) =",
              "after": "",
              "answer": "10",
              "hints": [
                "Subtracting a negative = adding the positive.",
                "3 − (−7) = 3 + 7 = 10."
              ]
            }
          ],
          "correctMsg": "Good — sign rules applied correctly.",
          "wrongMsg": "Check: are the signs the same or different? For addition/subtraction, are you subtracting a negative (which means add)?"
        }
      ]
    },

    {
      "tag": "maths:negative-numbers",
      "label": "Spot the error",
      "kicker": "Section 6 — Common mistake",
      "heading": "Find and fix the error.",
      "sub": "This mistake appears repeatedly in AQA mark scheme notes.",
      "blocks": [
        {
          "type": "read",
          "label": "The student's working",
          "text": "A student works out (−8)² and writes:<br/><strong>(−8)² = −64</strong><br/><em>'Because squaring a negative keeps it negative'</em>"
        },
        {
          "type": "misconceptionCheck",
          "statements": [
            {
              "statement": "The student is correct: (−8)² = −64",
              "answer": false,
              "reveal": "FALSE. (−8)² = (−8) × (−8). Same signs → positive. 8 × 8 = 64. (−8)² = +64. Squaring a negative number ALWAYS gives a positive result — it is the number multiplied by itself, and negative × negative = positive.",
              "examTrap": "AQA mark schemes list '−64' as the expected wrong answer for this type of question. Do not confuse (−8)² = +64 with −8² = −64 (where the minus sign is not inside the bracket)."
            }
          ]
        },
        {
          "type": "quiz",
          "question": "What is the correct value of (−8)²?",
          "options": [
            { "text": "−64", "correct": false },
            { "text": "64", "correct": true },
            { "text": "−16", "correct": false }
          ],
          "explanation": "(−8)² = (−8) × (−8) = +64. Same signs → positive."
        }
      ]
    },

    {
      "tag": null,
      "label": "Maths in the wild",
      "kicker": "Section 7 — Real-world application",
      "heading": "Negatives in everyday contexts.",
      "sub": "AQA often wraps negative number calculations in financial or scientific contexts.",
      "blocks": [
        {
          "type": "read",
          "label": "Where negatives appear in real life",
          "text": "Negative numbers model: temperatures below zero, depths below sea level, bank overdrafts, floors below ground in a building, time before an event (T-minus), and altitude below sea level. All follow the same rules."
        },
        {
          "type": "scenario",
          "situation": "A bank account has a balance of −£45 (overdrawn by £45). The account holder deposits £60.",
          "question": "What is the new balance?",
          "options": [
            { "text": "−£105", "correct": false },
            { "text": "£15", "correct": true },
            { "text": "£105", "correct": false }
          ],
          "correctMsg": "−45 + 60 = 15. Start at −45, add 60: first 45 to reach 0, then 15 more → £15.",
          "wrongMsg": "Start at −45 and add 60. Move right: −45 + 45 = 0, then + 15 more = +15."
        },
        {
          "type": "scenario",
          "situation": "The temperature is 3°C. Overnight it drops by 11°C.",
          "question": "What is the overnight low?",
          "options": [
            { "text": "8°C", "correct": false },
            { "text": "−8°C", "correct": true },
            { "text": "14°C", "correct": false }
          ],
          "correctMsg": "3 − 11 = −8°C. Start at 3, move 11 left: 3, 2, 1, 0, −1, −2, −3, −4, −5, −6, −7, −8. ✓",
          "wrongMsg": "Dropping = moving left. 3 − 11: first 3 to reach 0, then 8 more left = −8°C."
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
          "question": "Work out (−5) × (−3)",
          "options": [
            { "text": "−15", "correct": false },
            { "text": "15", "correct": true },
            { "text": "−8", "correct": false }
          ],
          "explanation": "Same signs → positive. 5 × 3 = 15. Answer: +15."
        },
        {
          "type": "quiz",
          "question": "Work out 2 − (−6)",
          "options": [
            { "text": "−4", "correct": false },
            { "text": "8", "correct": true },
            { "text": "4", "correct": false }
          ],
          "explanation": "Subtracting a negative = adding: 2 − (−6) = 2 + 6 = 8."
        },
        {
          "type": "quiz",
          "question": "Work out (−4)²",
          "options": [
            { "text": "−16", "correct": false },
            { "text": "−8", "correct": false },
            { "text": "16", "correct": true }
          ],
          "explanation": "(−4)² = (−4) × (−4). Same signs → positive. 4 × 4 = 16."
        }
      ]
    },

    {
      "tag": "maths:ordering-negatives",
      "label": "Exam practice",
      "kicker": "Section 9 — AQA exam style",
      "heading": "Exam-style questions.",
      "sub": "AQA wording, method marks shown. Answer before reading the mark scheme.",
      "blocks": [
        {
          "type": "read",
          "label": "AQA exam pattern",
          "text": "Negative number questions on AQA Foundation Paper 1 test: (1) direct calculation with sign rules, (2) ordering in context, and (3) multi-step problems combining operations. Method marks are available for correct sign rule application even if the final answer is wrong."
        },
        {
          "type": "boss",
          "tier": "🟢",
          "label": "Q1 — Calculation (1 mark)",
          "question": "Work out (−3) × (−5)",
          "markPoints": [
            "Answer: 15",
            "Award 1 mark for 15 (positive)",
            "Common error: −15 (same signs applied as negative)"
          ]
        },
        {
          "type": "boss",
          "tier": "🟡",
          "label": "Q2 — Ordering with negatives (2 marks)",
          "question": "Write these numbers in order, starting with the smallest:\n−0.5, 1.2, −3, 0, −1.8",
          "markPoints": [
            "Answer: −3, −1.8, −0.5, 0, 1.2",
            "1 method mark: negatives correctly ordered relative to each other (−3 < −1.8 < −0.5)",
            "1 accuracy mark: full correct order including 0 and 1.2",
            "Common error: ordering by digit size — writing −0.5 < −1.8 < −3"
          ]
        },
        {
          "type": "boss",
          "tier": "🔴",
          "label": "Q3 — Temperature context (3 marks, AO2)",
          "question": "The temperature at 6 am is −9°C. By noon it has risen by 14°C. By midnight it falls by 8°C from the noon temperature.\nWhat is the midnight temperature?\nShow all your working.",
          "markPoints": [
            "Step 1: noon temperature = −9 + 14 = 5°C (1 mark)",
            "Step 2: midnight = 5 − 8 = −3°C (1 method mark for method; 1 accuracy for −3°C)",
            "Award 3 marks for −3°C with full working shown",
            "Common error: calculating −9 + 14 − 8 = −3 in one step is acceptable for full marks if clear"
          ]
        }
      ]
    },

    {
      "tag": null,
      "label": "Chapter complete",
      "kicker": "Section 10 — Confidence check",
      "heading": "Chapter 3 done.",
      "sub": "Key rules. Top traps. What comes next.",
      "blocks": [
        {
          "type": "read",
          "label": "Key rules for negative numbers",
          "text": "1. <strong>× and ÷:</strong> same signs → positive; different signs → negative.<br/>2. <strong>Subtracting a negative:</strong> a − (−b) = a + b (two minuses make a plus).<br/>3. <strong>(−a)²:</strong> always positive — negative × negative = positive.<br/>4. <strong>Ordering:</strong> further from zero = smaller (more negative)."
        },
        {
          "type": "read",
          "label": "Top 3 errors from AQA mark schemes",
          "text": "1. <strong>Sign rule confusion:</strong> (−3) × (−4) = −12 — forgetting same signs give positive.<br/>2. <strong>Squaring error:</strong> (−8)² = −64 — squaring a negative always gives positive.<br/>3. <strong>Ordering by digit size:</strong> writing −0.5 &lt; −3 because 0.5 &lt; 3 — the minus sign flips the order."
        },
        {
          "type": "examtip",
          "tip": "<strong>Exam habit:</strong> On any negative number calculation, identify the operation first (is it × ÷ or + −?). The sign rules for × ÷ and the number line rules for + − are completely separate — don't mix them up."
        },
        {
          "type": "keypoint",
          "text": "<strong>Chapter 3 complete.</strong> You can now: apply sign rules for × and ÷ · add and subtract negative numbers · interpret subtracting a negative as adding · square a negative correctly · order negatives on a number line.<br/><br/>Next: Chapter 4 — BIDMAS and calculator control. Negative numbers feed directly into BIDMAS when expressions contain multiple operations."
        }
      ]
    }
  ],

  "series": "foundations",
  "recallTags": ["maths:negative-numbers", "maths:ordering-negatives"],
  "examTags": ["N1", "N2"],
  "assetKeys": [],
  "stageNavigation": [
    { "id": "s1",  "title": "The sign trap",        "description": "Why −3 + −5 ≠ 2",                         "screenIndex": 0 },
    { "id": "s2",  "title": "Prior knowledge",       "description": "Number line and multiplication facts",      "screenIndex": 1 },
    { "id": "s3",  "title": "Sign rules × ÷",        "description": "Same signs positive; different signs negative", "screenIndex": 2 },
    { "id": "s4",  "title": "Adding & subtracting",  "description": "Number line and subtracting a negative",    "screenIndex": 3 },
    { "id": "s5",  "title": "Squaring negatives",    "description": "(−a)² vs −a²",                             "screenIndex": 4 },
    { "id": "s6",  "title": "Temperature context",   "description": "Real-world negatives",                      "screenIndex": 5 },
    { "id": "s7",  "title": "Worked example",        "description": "Multi-operation negative calculation",      "screenIndex": 6 },
    { "id": "s8",  "title": "Guided practice",       "description": "Fill in the answers",                       "screenIndex": 7 },
    { "id": "s9",  "title": "Spot the error",        "description": "Fix the (−8)² mistake",                    "screenIndex": 8 },
    { "id": "s10", "title": "Real world",            "description": "Bank balances and temperatures",             "screenIndex": 9 },
    { "id": "s11", "title": "Retrieval",             "description": "Lock it in with quick questions",            "screenIndex": 10 },
    { "id": "s12", "title": "Exam practice",         "description": "AQA-style negative number questions",        "screenIndex": 11 },
    { "id": "s13", "title": "Chapter complete",      "description": "Key rules and what comes next",              "screenIndex": 12 }
  ]
}

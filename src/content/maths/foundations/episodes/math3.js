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
    "loadingText": "Let's see why negative number arithmetic is less scary when you separate the rules…",
    "bigQuestion": "Why does subtracting a negative give you more — not less?",
    "revealHeader": "Negative numbers use two different rule sets.",
    "revealItems": [
      {
        "emoji": "×",
        "label": "For × and ÷",
        "detail": "Same signs give a positive answer. Different signs give a negative answer. Example: (−3) × (−4) = +12."
      },
      {
        "emoji": "↔",
        "label": "For + and −",
        "detail": "Use the number line. Adding a negative moves left. Subtracting a negative moves right because a − (−b) = a + b."
      },
      {
        "emoji": "()²",
        "label": "Brackets matter",
        "detail": "(−4)² = +16 because the whole negative number is squared. But −4² = −16 because only the 4 is squared first."
      }
    ],
    "punchline": "Do not mix the rules: × and ÷ use sign rules; + and − use the number line."
  },

  "intro": {
    "learningGoals": [
      "Order negative integers and decimals on a number line",
      "Add and subtract negative numbers using movement left and right",
      "Apply the sign rules for multiplying and dividing with negatives",
      "Explain why (−a)² and −a² are different",
      "Use negatives in temperature, money and coordinate contexts"
    ]
  },

  "outcomes": {
    "intro": "Negative numbers appear regularly across AQA Foundation papers — in ordering tasks, temperature and finance contexts, coordinates, indices and algebra.",
    "bullets": [
      "Know the sign rule: same signs → positive; different signs → negative",
      "Work out additions and subtractions that involve negative numbers",
      "Recognise that subtracting a negative is the same as adding the positive",
      "Order negative and positive values correctly using the number line",
      "Avoid the common bracket trap with squared negatives"
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
      "sub": "Negative number errors are common because students mix up different sign rules.",
      "blocks": [
        {
          "type": "read",
          "label": "The exam stake",
          "text": "Negative numbers appear regularly across AQA Foundation papers. Errors with signs can cost marks in ordering tasks, temperature questions, algebra and coordinates. The root cause is usually one of two things: confusing addition with subtraction, or applying multiplication sign rules to the wrong type of calculation."
        },
        {
          "type": "quiz",
          "question": "Work out −3 + −5",
          "options": [
            { "text": "2 (subtracted the digits)", "correct": false },
            { "text": "−8 (added two negatives)", "correct": true },
            { "text": "8 (dropped the signs)", "correct": false }
          ],
          "explanation": "Both numbers are negative. Adding two negatives moves further left on the number line: start at −3, move 5 more to the left → −8."
        },
        {
          "type": "examtip",
          "tip": "<strong>Exam habit:</strong> Before any negative number calculation, identify the operation first. The rules for × and ÷ are different from the number-line rules for + and −."
        }
      ]
    },

    {
      "tag": null,
      "label": "Prior knowledge",
      "kicker": "Section 2 — Check your foundations",
      "heading": "What do you already know?",
      "sub": "These questions check the building blocks from Chapters 1 and 2.",
      "blocks": [
        {
          "type": "read",
          "label": "Prerequisite skills",
          "text": "This chapter needs <strong>the number line from Chapter 1</strong>, <strong>the four operations from Chapter 2</strong>, and <strong>basic multiplication facts</strong>."
        },
        {
          "type": "quiz",
          "question": "Which number is further left on the number line?",
          "options": [
            { "text": "−2", "correct": false },
            { "text": "−9", "correct": true },
            { "text": "0", "correct": false }
          ],
          "explanation": "Left means smaller. −9 is further left than −2, so −9 < −2."
        },
        {
          "type": "quiz",
          "question": "What is 3 × 4?",
          "options": [
            { "text": "7", "correct": false },
            { "text": "12", "correct": true },
            { "text": "34", "correct": false }
          ],
          "explanation": "3 × 4 = 12. First find the size of the answer, then apply the sign rule."
        }
      ]
    },

    {
      "tag": "maths:ordering-negatives",
      "label": "Ordering negatives",
      "kicker": "Section 3 — Core idea",
      "heading": "The further left, the smaller.",
      "sub": "Negative numbers feel backwards until you picture the number line.",
      "blocks": [
        {
          "type": "read",
          "label": "How to order negatives",
          "text": "On a number line, values get bigger as you move right and smaller as you move left. That means −10 is smaller than −2 because −10 is further left. For negative decimals, −0.35 is smaller than −0.3 because it is further left."
        },
        {
          "type": "quiz",
          "question": "Order from smallest to largest: −0.5, −3, 0, −1.8",
          "options": [
            { "text": "−3, −1.8, −0.5, 0", "correct": true },
            { "text": "−0.5, −1.8, −3, 0", "correct": false },
            { "text": "0, −0.5, −1.8, −3", "correct": false }
          ],
          "explanation": "Smallest means furthest left: −3, then −1.8, then −0.5, then 0."
        },
        {
          "type": "quiz",
          "question": "Which is true?",
          "options": [
            { "text": "−0.3 < −0.35", "correct": false },
            { "text": "−0.3 > −0.35", "correct": true },
            { "text": "−0.3 = −0.35", "correct": false }
          ],
          "explanation": "−0.3 is closer to zero, so it is further right and therefore bigger than −0.35."
        }
      ]
    },

    {
      "tag": "maths:negative-numbers",
      "label": "Sign rules × ÷",
      "kicker": "Section 3 — Core idea",
      "heading": "Two sign rules for multiplying and dividing.",
      "sub": "Same signs give positive. Different signs give negative.",
      "blocks": [
        {
          "type": "read",
          "label": "The two rules",
          "text": "<strong>Rule 1 — Same signs give positive:</strong><br/>(+) × (+) = (+) &nbsp;·&nbsp; (−) × (−) = (+) &nbsp;·&nbsp; (−) ÷ (−) = (+)<br/><br/><strong>Rule 2 — Different signs give negative:</strong><br/>(+) × (−) = (−) &nbsp;·&nbsp; (−) × (+) = (−) &nbsp;·&nbsp; (+) ÷ (−) = (−)<br/><br/>Memory trick: <strong>same signs smile, different signs disagree.</strong>"
        },
        {
          "type": "quiz",
          "question": "Work out (−3) × (−4)",
          "options": [
            { "text": "−12", "correct": false },
            { "text": "12", "correct": true },
            { "text": "7", "correct": false }
          ],
          "explanation": "Same signs → positive. 3 × 4 = 12, so (−3) × (−4) = 12."
        },
        {
          "type": "quiz",
          "question": "Work out (−20) ÷ 4",
          "options": [
            { "text": "5", "correct": false },
            { "text": "−5", "correct": true },
            { "text": "−80", "correct": false }
          ],
          "explanation": "Different signs → negative. 20 ÷ 4 = 5, so (−20) ÷ 4 = −5."
        },
        {
          "type": "quiz",
          "question": "Work out (−18) ÷ (−3)",
          "options": [
            { "text": "−6", "correct": false },
            { "text": "6", "correct": true },
            { "text": "15", "correct": false }
          ],
          "explanation": "Same signs → positive. 18 ÷ 3 = 6, so (−18) ÷ (−3) = 6."
        }
      ]
    },

    {
      "tag": "maths:negative-numbers",
      "label": "Adding and subtracting",
      "kicker": "Section 3 — Core idea",
      "heading": "For + and −, use the number line.",
      "sub": "Do not use the multiplication sign rules here.",
      "blocks": [
        {
          "type": "read",
          "label": "How to add and subtract negatives",
          "text": "<strong>Adding a positive:</strong> move right.<br/><strong>Adding a negative:</strong> move left.<br/><strong>Subtracting a positive:</strong> move left.<br/><strong>Subtracting a negative:</strong> move right — the two minuses make a plus.<br/><br/>Key result: <strong>a − (−b) = a + b</strong>"
        },
        {
          "type": "quiz",
          "question": "Work out 5 − (−3)",
          "options": [
            { "text": "2", "correct": false },
            { "text": "8", "correct": true },
            { "text": "−2", "correct": false }
          ],
          "explanation": "Subtracting a negative = adding the positive: 5 − (−3) = 5 + 3 = 8."
        },
        {
          "type": "quiz",
          "question": "Work out −4 − 3",
          "options": [
            { "text": "−7", "correct": true },
            { "text": "−1", "correct": false },
            { "text": "1", "correct": false }
          ],
          "explanation": "Start at −4 and move 3 left. You land on −7."
        },
        {
          "type": "quiz",
          "question": "A point starts at x = −2. It moves 5 spaces right. What is the new x-coordinate?",
          "options": [
            { "text": "−7", "correct": false },
            { "text": "3", "correct": true },
            { "text": "−3", "correct": false }
          ],
          "explanation": "Moving right means adding. −2 + 5 = 3. This is a small preview of coordinates later in the course."
        }
      ]
    },

    {
      "tag": "maths:negative-numbers",
      "label": "Squaring negatives",
      "kicker": "Section 3 — Core idea",
      "heading": "(−4)² is not the same as −4².",
      "sub": "Brackets decide whether the negative sign is being squared.",
      "blocks": [
        {
          "type": "read",
          "label": "The distinction",
          "text": "<strong>(−4)² means square the whole negative number.</strong><br/>(−4)² = (−4) × (−4) = +16<br/><br/><strong>−4² means square the 4 first, then apply the minus sign.</strong><br/>−4² = −(4 × 4) = −16<br/><br/>The brackets protect the negative sign."
        },
        {
          "type": "quiz",
          "question": "Work out (−5)²",
          "options": [
            { "text": "−25", "correct": false },
            { "text": "25", "correct": true },
            { "text": "10", "correct": false }
          ],
          "explanation": "(−5)² = (−5) × (−5). Same signs → positive. Answer: 25."
        },
        {
          "type": "quiz",
          "question": "Work out −5²",
          "options": [
            { "text": "−25", "correct": true },
            { "text": "25", "correct": false },
            { "text": "−10", "correct": false }
          ],
          "explanation": "Without brackets, the square applies to 5 first: −5² = −(5²) = −25."
        }
      ]
    },

    {
      "tag": "maths:negative-numbers",
      "label": "Temperature worked example",
      "kicker": "Section 4 — Examiner method",
      "heading": "Temperature rise across zero.",
      "sub": "This is the cleanest way to understand subtracting a negative.",
      "blocks": [
        {
          "type": "read",
          "label": "The question",
          "text": "<strong>At midnight it is −6°C. By noon it is 11°C. What is the rise in temperature?</strong><br/><em>(2 marks)</em>"
        },
        {
          "type": "read",
          "label": "Step 1 — Set up the change",
          "text": "Rise = final temperature − starting temperature.<br/>So rise = 11 − (−6)."
        },
        {
          "type": "read",
          "label": "Step 2 — Subtracting a negative",
          "text": "11 − (−6) = 11 + 6 = <strong>17°C</strong>.<br/><br/><em>Mark scheme pattern: method for setting up the rise, accuracy for 17°C.</em>"
        },
        {
          "type": "quiz",
          "question": "The temperature rises from −4°C to 9°C. What is the rise?",
          "options": [
            { "text": "5°C", "correct": false },
            { "text": "13°C", "correct": true },
            { "text": "−13°C", "correct": false }
          ],
          "explanation": "Rise = 9 − (−4) = 9 + 4 = 13°C."
        }
      ]
    },

    {
      "tag": null,
      "label": "Guided practice",
      "kicker": "Section 5 — Practice with support",
      "heading": "Fill in the answers.",
      "sub": "Apply the right rule for each calculation.",
      "blocks": [
        {
          "type": "read",
          "label": "Method reminder",
          "text": "<strong>× and ÷:</strong> same signs → positive; different signs → negative.<br/><strong>+ and −:</strong> use the number line; subtracting a negative = adding the positive.<br/><strong>Squares:</strong> brackets decide whether the negative sign is squared."
        },
        {
          "type": "fillblanks",
          "sentences": [
            {
              "before": "(−6) × (−3) =",
              "after": "",
              "answer": "18",
              "hints": ["Same signs → positive. 6 × 3 = 18.", "Negative × negative gives positive."]
            },
            {
              "before": "−12 ÷ 4 =",
              "after": "",
              "answer": "-3",
              "hints": ["Different signs → negative. 12 ÷ 4 = 3.", "So the answer is −3."]
            },
            {
              "before": "3 − (−7) =",
              "after": "",
              "answer": "10",
              "hints": ["Subtracting a negative = adding the positive.", "3 − (−7) = 3 + 7 = 10."]
            },
            {
              "before": "(−6)² =",
              "after": "",
              "answer": "36",
              "hints": ["The negative sign is inside the brackets.", "(−6)² = (−6) × (−6) = +36."]
            },
            {
              "before": "−6² =",
              "after": "",
              "answer": "-36",
              "hints": ["There are no brackets protecting the negative sign.", "−6² = −(6²) = −36."]
            }
          ],
          "correctMsg": "Good — you used the right rule for the operation.",
          "wrongMsg": "First ask: is this × or ÷, + or −, or a square with brackets? Then use the matching rule."
        }
      ]
    },

    {
      "tag": "maths:negative-numbers",
      "label": "Spot the error",
      "kicker": "Section 6 — Common mistake",
      "heading": "Find and fix the error.",
      "sub": "This is a common mark-losing bracket mistake.",
      "blocks": [
        {
          "type": "read",
          "label": "The student's working",
          "text": "A student works out (−8)² and writes:<br/><strong>(−8)² = −64</strong><br/><em>'Because squaring a negative keeps it negative.'</em>"
        },
        {
          "type": "misconceptionCheck",
          "statements": [
            {
              "statement": "The student is correct: (−8)² = −64.",
              "answer": false,
              "reveal": "FALSE. (−8)² = (−8) × (−8). Same signs → positive. 8 × 8 = 64. So (−8)² = +64.",
              "examTrap": "Do not confuse (−8)² = +64 with −8² = −64. The brackets change what is being squared."
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
      "sub": "Temperatures, debts, depths and profits all use the same number-line logic.",
      "blocks": [
        {
          "type": "read",
          "label": "Where negatives appear in real life",
          "text": "Negative numbers model: temperatures below zero, depths below sea level, bank overdrafts, floors below ground, profit/loss, and positions left or below an origin on a coordinate grid."
        },
        {
          "type": "scenario",
          "situation": "A bank account has a balance of −£45. The account holder deposits £60.",
          "question": "What is the new balance?",
          "options": [
            { "text": "−£105", "correct": false },
            { "text": "£15", "correct": true },
            { "text": "£105", "correct": false }
          ],
          "correctMsg": "−45 + 60 = 15. First 45 gets back to zero, then 15 is left over.",
          "wrongMsg": "Start at −45 and add 60. You move right on the number line."
        },
        {
          "type": "scenario",
          "situation": "A company's quarterly profits are −£2400, −£1800, +£950 and +£3200.",
          "question": "What is the total profit or loss across the four quarters?",
          "options": [
            { "text": "£50 profit", "correct": false },
            { "text": "£50 loss", "correct": true },
            { "text": "£4150 loss", "correct": false }
          ],
          "correctMsg": "Negative quarters: −2400 + −1800 = −4200. Positive quarters: 950 + 3200 = 4150. Total: −4200 + 4150 = −50, so the company made a £50 loss.",
          "wrongMsg": "Group the negatives and positives first. The losses total £4200; the profits total £4150. Losses are £50 bigger."
        }
      ]
    },

    {
      "tag": "maths:negative-numbers",
      "label": "Mixed calculation",
      "kicker": "Section 8 — Stretch retrieval",
      "heading": "When negatives meet several operations.",
      "sub": "This previews Chapter 4, so go slowly and show each step.",
      "blocks": [
        {
          "type": "read",
          "label": "The question",
          "text": "<strong>Work out: (−3) × 4 + (−2)²</strong><br/><em>(2 marks)</em>"
        },
        {
          "type": "read",
          "label": "Step by step",
          "text": "(−2)² = +4<br/>(−3) × 4 = −12<br/>Then −12 + 4 = <strong>−8</strong>.<br/><br/>This is a preview of BIDMAS. In Chapter 4, you will practise order of operations properly."
        },
        {
          "type": "quiz",
          "question": "Apply the same method: (−2) × (−3) + (−1)²",
          "options": [
            { "text": "7", "correct": true },
            { "text": "−5", "correct": false },
            { "text": "5", "correct": false }
          ],
          "explanation": "(−2) × (−3) = +6 and (−1)² = +1, so 6 + 1 = 7."
        }
      ]
    },

    {
      "tag": null,
      "label": "Retrieval",
      "kicker": "Section 8 — Retrieval practice",
      "heading": "Retrieval practice.",
      "sub": "Quick questions from Chapters 1–3.",
      "blocks": [
        {
          "type": "read",
          "label": "Why retrieval matters",
          "text": "Mixing old and new questions helps your brain learn when to use each rule, instead of just copying the last method it saw."
        },
        {
          "type": "quiz",
          "question": "Work out (−5) × (−3)",
          "options": [
            { "text": "−15", "correct": false },
            { "text": "15", "correct": true },
            { "text": "−8", "correct": false }
          ],
          "explanation": "Same signs → positive. 5 × 3 = 15."
        },
        {
          "type": "quiz",
          "question": "Order from smallest: −4.5, −4, −4.05, 0",
          "options": [
            { "text": "−4.5, −4.05, −4, 0", "correct": true },
            { "text": "−4, −4.05, −4.5, 0", "correct": false },
            { "text": "0, −4, −4.05, −4.5", "correct": false }
          ],
          "explanation": "Smallest means furthest left. −4.5 is less than −4.05, which is less than −4."
        },
        {
          "type": "quiz",
          "question": "Work out 248 × 7",
          "options": [
            { "text": "1736", "correct": true },
            { "text": "1636", "correct": false },
            { "text": "1746", "correct": false }
          ],
          "explanation": "8×7=56, write 6 carry 5. 4×7=28+5=33, write 3 carry 3. 2×7=14+3=17. Answer: 1736."
        }
      ]
    },

    {
      "tag": "maths:ordering-negatives",
      "label": "Exam practice",
      "kicker": "Section 9 — AQA exam style",
      "heading": "Exam-style questions.",
      "sub": "AQA-style wording, method marks shown. Answer before reading the mark scheme.",
      "blocks": [
        {
          "type": "read",
          "label": "AQA exam pattern",
          "text": "Negative number questions often test direct calculation, ordering in context, or a short multi-step problem. Correct method can still earn credit if one arithmetic slip happens."
        },
        {
          "type": "boss",
          "tier": "🟢",
          "label": "Q1 — Calculation (1 mark)",
          "question": "Work out (−3) × (−5)",
          "markPoints": [
            "Answer: 15",
            "Same signs give a positive answer",
            "Common error: −15"
          ]
        },
        {
          "type": "boss",
          "tier": "🟡",
          "label": "Q2 — Ordering with negatives (2 marks)",
          "question": "Write these numbers in order, starting with the smallest:\n−0.5, 1.2, −3, 0, −1.8",
          "markPoints": [
            "Answer: −3, −1.8, −0.5, 0, 1.2",
            "Method: negatives correctly ordered relative to each other",
            "Common error: ordering by digit size rather than number-line position"
          ]
        },
        {
          "type": "boss",
          "tier": "🔴",
          "label": "Q3 — Explain the bracket trap (2 marks, AO2)",
          "question": "Explain why (−5)² is not equal to −25.",
          "markPoints": [
            "(−5)² means (−5) × (−5)",
            "Negative × negative = positive",
            "Therefore (−5)² = 25, not −25"
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
          "text": "1. <strong>× and ÷:</strong> same signs → positive; different signs → negative.<br/>2. <strong>+ and −:</strong> use the number line; subtracting a negative means add.<br/>3. <strong>(−a)²:</strong> positive because the negative sign is squared too.<br/>4. <strong>−a²:</strong> negative because the minus sign is outside the square.<br/>5. <strong>Ordering:</strong> further left = smaller, even if the digit looks bigger."
        },
        {
          "type": "read",
          "label": "Top 3 errors from AQA mark schemes",
          "text": "1. <strong>Sign rule confusion:</strong> writing (−3) × (−4) = −12.<br/>2. <strong>Double-negative error:</strong> treating 5 − (−3) as 5 − 3.<br/>3. <strong>Bracket error:</strong> treating (−8)² and −8² as the same thing."
        },
        {
          "type": "examtip",
          "tip": "<strong>Exam habit:</strong> Identify the operation first. Is it × or ÷, + or −, or a square with brackets? Then use the matching rule."
        },
        {
          "type": "keypoint",
          "text": "<strong>Chapter 3 complete.</strong> You can now: order negatives · add and subtract with negatives · apply sign rules for × and ÷ · divide two negatives · handle squared negatives · use negatives in temperature, finance and coordinate-style contexts.<br/><br/>Next: Chapter 4 — BIDMAS and calculator control. Negative numbers feed directly into order-of-operations questions."
        }
      ]
    }
  ],

  "series": "foundations",
  "recallTags": ["maths:negative-numbers", "maths:ordering-negatives"],
  "examTags": ["N1", "N2"],
  "assetKeys": [],
  "stageNavigation": [
    { "id": "s1",  "title": "The sign trap", "description": "Why −3 + −5 ≠ 2", "screenIndex": 0 },
    { "id": "s2",  "title": "Prior knowledge", "description": "Number line and multiplication facts", "screenIndex": 1 },
    { "id": "s3",  "title": "Ordering negatives", "description": "Further left means smaller", "screenIndex": 2 },
    { "id": "s4",  "title": "Sign rules × ÷", "description": "Same signs positive; different signs negative", "screenIndex": 3 },
    { "id": "s5",  "title": "Adding and subtracting", "description": "Number line and subtracting a negative", "screenIndex": 4 },
    { "id": "s6",  "title": "Squaring negatives", "description": "(−a)² vs −a²", "screenIndex": 5 },
    { "id": "s7",  "title": "Temperature worked example", "description": "Rise across zero", "screenIndex": 6 },
    { "id": "s8",  "title": "Guided practice", "description": "Fill in signed calculations", "screenIndex": 7 },
    { "id": "s9",  "title": "Spot the error", "description": "Fix the (−8)² mistake", "screenIndex": 8 },
    { "id": "s10", "title": "Real world", "description": "Finance, debt and negatives", "screenIndex": 9 },
    { "id": "s11", "title": "Mixed calculation", "description": "Preview BIDMAS carefully", "screenIndex": 10 },
    { "id": "s12", "title": "Retrieval", "description": "Mixed questions from Ch1–Ch3", "screenIndex": 11 },
    { "id": "s13", "title": "Exam practice", "description": "AQA-style negative number questions", "screenIndex": 12 },
    { "id": "s14", "title": "Chapter complete", "description": "Key rules and what comes next", "screenIndex": 13 }
  ]
}

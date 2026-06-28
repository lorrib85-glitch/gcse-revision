export default {
  "id": "math5",
  "subject": "Maths",
  "number": 5,
  "title": "Rounding, estimating and checking",
  "subtitle": "Decimal places, significant figures, error intervals and estimation",
  "era": "Number survival kit",
  "icon": "≈",
  "color": "#2DD4BF",
  "colorLight": "rgba(45,212,191,.12)",
  "headerImage": "/headers/maths-numbers.webp",

  "module": "number-survival-kit",
  "moduleNumber": 1,
  "chapterNumber": 5,
  "aqaLinks": ["N2", "N14", "N15"],
  "mapsToMathsGroups": ["maths_rounding"],
  "weaknessTags": ["maths:rounding", "maths:significant-figures", "maths:estimation"],
  "prerequisiteChapters": ["math1", "math2", "math4"],

  "hook": {
    "scenario": {
      "location": "AQA Foundation Paper 1 (non-calculator)",
      "hint": "A student rounds 0.0473 to 2 significant figures and writes 0.04."
    },
    "statement": "0.0473 rounded to 2 significant figures is 0.04",
    "isTrue": false,
    "accentWords": ["0.0473", "0.04"],
    "explanation": "Significant figures count from the first non-zero digit. In 0.0473, the first significant figure is 4 and the second is 7. To 2 s.f., the answer is 0.047. Writing 0.04 keeps only one significant figure.",
    "wrongFeedback": "Count significant figures from the first non-zero digit. In 0.0473, the significant figures are 4, 7, 3. To 2 s.f., keep 4 and 7 → 0.047.",
    "correctFeedback": "Right. 0.04 is only 1 s.f. To 2 s.f. the answer is 0.047.",
    "loadingText": "Let's separate decimal places, significant figures and estimates…",
    "bigQuestion": "How can a rough estimate save marks when your exact answer goes wrong?",
    "revealHeader": "Rounding is about precision — estimation is about checking.",
    "revealItems": [
      {
        "emoji": "📍",
        "label": "Decimal places",
        "detail": "Decimal places count positions after the decimal point. 3.456 to 2 d.p. = 3.46 because the third decimal digit is 6."
      },
      {
        "emoji": "⭐",
        "label": "Significant figures",
        "detail": "Significant figures count from the first non-zero digit. In 0.0473, the 4 is the first significant figure and the 7 is the second."
      },
      {
        "emoji": "≈",
        "label": "Estimation earns marks",
        "detail": "For estimation, round every number to 1 significant figure first, then calculate. Showing the rounded values is often where the method marks live."
      }
    ],
    "punchline": "Decimal places count from the point. Significant figures count from the first non-zero digit. Estimates round everything first."
  },

  "intro": {
    "learningGoals": [
      "Round numbers to a given number of decimal places",
      "Round numbers to a given number of significant figures",
      "Estimate calculations by rounding all values to 1 significant figure",
      "Use estimation to check whether an answer is sensible",
      "Write error intervals for rounded and truncated values"
    ]
  },

  "outcomes": {
    "intro": "Rounding, estimation and error intervals appear regularly across AQA Foundation papers. They are useful because they help you control accuracy and spot impossible answers.",
    "bullets": [
      "Round accurately to decimal places and significant figures",
      "Estimate by rounding every number first, not just some numbers",
      "Show rounded values clearly so method marks can be awarded",
      "Write rounding error intervals using lower ≤ x < upper",
      "Distinguish rounding from truncation"
    ]
  },

  "recall": {
    "questions": [
      {
        "type": "truefalse",
        "question": "3.456 rounded to 2 decimal places is 3.45",
        "isTrue": false
      },
      {
        "type": "choice",
        "question": "Round 5,836 to 2 significant figures",
        "options": ["5,800", "5,840", "5,900"],
        "correct": 0
      },
      {
        "type": "connection",
        "question": "A number is rounded to the nearest 10 and the result is 40. What is the error interval?",
        "options": [
          { "text": "30 ≤ x < 50", "icon": "warning" },
          { "text": "35 ≤ x < 45", "icon": "lightbulb" },
          { "text": "35 < x < 45", "icon": "arrow" }
        ],
        "correct": 1
      }
    ]
  },

  "screens": [
    {
      "tag": "maths:significant-figures",
      "label": "The s.f. trap",
      "kicker": "Section 1 — Why it matters",
      "heading": "Decimal places vs significant figures.",
      "sub": "These look similar, but the counting starts in different places.",
      "blocks": [
        {
          "type": "read",
          "label": "The exam stake",
          "text": "Rounding and estimation questions appear regularly on AQA Foundation papers. The common mistake is confusing decimal places, which count after the decimal point, with significant figures, which count from the first non-zero digit."
        },
        {
          "type": "quiz",
          "question": "Round 3.456 to 2 decimal places.",
          "options": [
            { "text": "3.45", "correct": false },
            { "text": "3.46", "correct": true },
            { "text": "3.5", "correct": false }
          ],
          "explanation": "2 decimal places means keep 2 digits after the decimal point. The 3rd digit is 6, so round the hundredths digit up: 3.46."
        },
        {
          "type": "quiz",
          "question": "Round 0.0473 to 2 significant figures.",
          "options": [
            { "text": "0.04", "correct": false },
            { "text": "0.047", "correct": true },
            { "text": "0.05", "correct": false }
          ],
          "explanation": "Leading zeros do not count. The first two significant figures are 4 and 7. The next digit is 3, so keep 7: 0.047."
        },
        {
          "type": "examtip",
          "tip": "<strong>Exam habit:</strong> Underline whether the question says d.p. or s.f. before you start. Most wrong answers come from using the wrong counting rule."
        }
      ]
    },

    {
      "tag": null,
      "label": "Prior knowledge",
      "kicker": "Section 2 — Check your foundations",
      "heading": "What do you already know?",
      "sub": "This chapter uses place value, the four operations and BIDMAS control.",
      "blocks": [
        {
          "type": "read",
          "label": "Prerequisite skills",
          "text": "You need <strong>place value from Chapter 1</strong> to identify columns, <strong>calculation fluency from Chapter 2</strong> for estimates, and <strong>BIDMAS from Chapter 4</strong> so you know not to round midway through a calculation."
        },
        {
          "type": "quiz",
          "question": "In 24,862, what is the value of the digit 4?",
          "options": [
            { "text": "4", "correct": false },
            { "text": "4000", "correct": true },
            { "text": "40,000", "correct": false }
          ],
          "explanation": "24,862 has 2 ten-thousands and 4 thousands. The value of the 4 is 4000."
        },
        {
          "type": "quiz",
          "question": "Round 247 to the nearest 10.",
          "options": [
            { "text": "240", "correct": false },
            { "text": "250", "correct": true },
            { "text": "300", "correct": false }
          ],
          "explanation": "Nearest 10: look at the ones digit. 7 is 5 or more, so 247 rounds up to 250."
        }
      ]
    },

    {
      "tag": "maths:rounding",
      "label": "Rounding to d.p.",
      "kicker": "Section 3 — Core idea",
      "heading": "Rounding to decimal places.",
      "sub": "Count after the decimal point, then look one digit further.",
      "blocks": [
        {
          "type": "read",
          "label": "The method",
          "text": "<strong>Step 1:</strong> Count the required number of digits after the decimal point.<br/><strong>Step 2:</strong> Look at the next digit.<br/><strong>Step 3:</strong> If the next digit is 5 or more, round up. If it is 4 or less, keep the target digit the same.<br/><br/>Example: 7.348 to 2 d.p. → look at the third decimal digit, 8 → 7.35."
        },
        {
          "type": "quiz",
          "question": "Round 12.765 to 1 decimal place.",
          "options": [
            { "text": "12.7", "correct": false },
            { "text": "12.8", "correct": true },
            { "text": "13.0", "correct": false }
          ],
          "explanation": "1 d.p. means keep the tenths digit. Look at the hundredths digit: 6, so 12.765 rounds to 12.8."
        },
        {
          "type": "quiz",
          "question": "Round 4.302 to 2 decimal places.",
          "options": [
            { "text": "4.31", "correct": false },
            { "text": "4.30", "correct": true },
            { "text": "4.3", "correct": false }
          ],
          "explanation": "2 d.p. means show two digits after the decimal. The third decimal digit is 2, so keep the 0. Answer: 4.30."
        }
      ]
    },

    {
      "tag": "maths:significant-figures",
      "label": "Significant figures",
      "kicker": "Section 3 — Core idea",
      "heading": "Rounding to significant figures.",
      "sub": "Start from the first non-zero digit — not from the decimal point.",
      "blocks": [
        {
          "type": "read",
          "label": "What counts as significant",
          "text": "Start counting from the first non-zero digit.<br/><br/>In <strong>5,836</strong>: 5 is 1st s.f., 8 is 2nd, 3 is 3rd.<br/>In <strong>0.00372</strong>: the leading zeros do not count. 3 is 1st s.f., 7 is 2nd, 2 is 3rd.<br/>In <strong>0.400</strong>: trailing zeros after the decimal can be significant because they show precision."
        },
        {
          "type": "quiz",
          "question": "Round 24,862 to 3 significant figures.",
          "options": [
            { "text": "24,800", "correct": false },
            { "text": "24,900", "correct": true },
            { "text": "25,000", "correct": false }
          ],
          "explanation": "The first three significant figures are 2, 4 and 8. The next digit is 6, so the 8 rounds up to 9. Answer: 24,900."
        },
        {
          "type": "quiz",
          "question": "Round 0.005846 to 3 significant figures.",
          "options": [
            { "text": "0.00584", "correct": false },
            { "text": "0.00585", "correct": true },
            { "text": "0.006", "correct": false }
          ],
          "explanation": "Ignore leading zeros. The first three significant figures are 5, 8 and 4. The next digit is 6, so 4 rounds up to 5: 0.00585."
        }
      ]
    },

    {
      "tag": "maths:estimation",
      "label": "Estimation",
      "kicker": "Section 3 — Core idea",
      "heading": "Estimation: round everything first.",
      "sub": "A proper estimate shows the rounded values before calculating.",
      "blocks": [
        {
          "type": "read",
          "label": "The estimation method",
          "text": "<strong>Step 1:</strong> Round every number to 1 significant figure.<br/><strong>Step 2:</strong> Calculate using the rounded values.<br/><strong>Step 3:</strong> Compare with the exact answer if you have one.<br/><br/>Example: 382 × 4.7 ≈ 400 × 5 = 2000."
        },
        {
          "type": "quiz",
          "question": "Estimate 487 ÷ 23 by rounding each number to 1 significant figure.",
          "options": [
            { "text": "24", "correct": false },
            { "text": "25", "correct": true },
            { "text": "10", "correct": false }
          ],
          "explanation": "487 ≈ 500 and 23 ≈ 20. So 487 ÷ 23 ≈ 500 ÷ 20 = 25."
        },
        {
          "type": "quiz",
          "question": "Estimate (31.4 × 18.6) ÷ (5.1 × 1.9).",
          "options": [
            { "text": "60", "correct": true },
            { "text": "6", "correct": false },
            { "text": "600", "correct": false }
          ],
          "explanation": "31.4 ≈ 30, 18.6 ≈ 20, 5.1 ≈ 5 and 1.9 ≈ 2. So (30 × 20) ÷ (5 × 2) = 600 ÷ 10 = 60."
        }
      ]
    },

    {
      "tag": "maths:estimation",
      "label": "Checking answers",
      "kicker": "Section 3 — Core idea",
      "heading": "Use estimates to catch nonsense answers.",
      "sub": "Estimation is not just a separate topic — it is your calculator-error alarm.",
      "blocks": [
        {
          "type": "read",
          "label": "Do not round too early",
          "text": "Use estimation before or after a calculation to check whether the answer is sensible. But in an exact calculation, do <strong>not</strong> round intermediate values early — that can change the final answer and lose accuracy marks."
        },
        {
          "type": "quiz",
          "question": "A student calculates 4.79 × 20.3 ÷ 9.76 and gets about 100. Is this reasonable?",
          "options": [
            { "text": "Yes — 100 is close enough", "correct": false },
            { "text": "No — estimate gives about 10", "correct": true },
            { "text": "No — estimate gives about 1000", "correct": false }
          ],
          "explanation": "Estimate: 4.79 ≈ 5, 20.3 ≈ 20, 9.76 ≈ 10. So 5 × 20 ÷ 10 = 10. An answer near 100 is not reasonable."
        },
        {
          "type": "examtip",
          "tip": "<strong>Exam habit:</strong> Write the rounded values in estimation questions. In exact questions, keep full accuracy until the final answer unless the question tells you to round."
        }
      ]
    },

    {
      "tag": "maths:rounding",
      "label": "Error intervals",
      "kicker": "Section 3 — Core idea",
      "heading": "Error intervals for rounded values.",
      "sub": "A rounded value is really a range of possible original values.",
      "blocks": [
        {
          "type": "read",
          "label": "Rounding: lower bound and upper bound",
          "text": "If a number rounds to 40 to the nearest 10, it could have been from 35 up to but not including 45.<br/>Error interval: <strong>35 ≤ x &lt; 45</strong>.<br/><br/>The lower bound is included. The upper bound is excluded because 45 would round up to 50."
        },
        {
          "type": "quiz",
          "question": "A length, L, is measured as 6.4 cm to 1 decimal place. Write the error interval for L.",
          "options": [
            { "text": "6.35 < L < 6.45", "correct": false },
            { "text": "6.35 ≤ L < 6.45", "correct": true },
            { "text": "6.3 ≤ L < 6.5", "correct": false }
          ],
          "explanation": "Nearest 0.1 means half a unit is 0.05. Lower = 6.35 included. Upper = 6.45 excluded."
        },
        {
          "type": "quiz",
          "question": "A rod is measured as 12 mm to the nearest mm. What is the error interval?",
          "options": [
            { "text": "11.5 ≤ l < 12.5", "correct": true },
            { "text": "11 ≤ l < 13", "correct": false },
            { "text": "11.5 < l ≤ 12.5", "correct": false }
          ],
          "explanation": "Nearest 1 mm means half a unit is 0.5 mm. The interval is 11.5 ≤ l < 12.5."
        }
      ]
    },

    {
      "tag": "maths:rounding",
      "label": "Rounding vs truncation",
      "kicker": "Section 3 — Core idea",
      "heading": "Truncation is not rounding.",
      "sub": "Truncation cuts digits off. It does not look at the next digit.",
      "blocks": [
        {
          "type": "read",
          "label": "Truncation method",
          "text": "<strong>Rounding</strong> looks at the next digit and may round up.<br/><strong>Truncation</strong> simply cuts off extra digits.<br/><br/>Example: 4.79 truncated to 1 d.p. = 4.7, not 4.8. If a number is truncated to 1 d.p. and gives 3.4, the interval is <strong>3.4 ≤ x &lt; 3.5</strong>."
        },
        {
          "type": "quiz",
          "question": "A number n is truncated to 1 decimal place to give 3.4. Write the error interval.",
          "options": [
            { "text": "3.35 ≤ n < 3.45", "correct": false },
            { "text": "3.4 ≤ n < 3.5", "correct": true },
            { "text": "3.4 < n < 3.5", "correct": false }
          ],
          "explanation": "Truncation starts at the truncated value. All values from 3.4 up to but not including 3.5 truncate to 3.4."
        },
        {
          "type": "quiz",
          "question": "Truncate 4.79 to 1 decimal place.",
          "options": [
            { "text": "4.7", "correct": true },
            { "text": "4.8", "correct": false },
            { "text": "5.0", "correct": false }
          ],
          "explanation": "Truncation cuts off after 1 decimal place. It does not round up, so 4.79 becomes 4.7."
        }
      ]
    },

    {
      "tag": "maths:estimation",
      "label": "Worked example",
      "kicker": "Section 4 — Examiner method",
      "heading": "Full estimation worked example.",
      "sub": "Show rounded values first — that is where marks are often earned.",
      "blocks": [
        {
          "type": "read",
          "label": "The question",
          "text": "<strong>Estimate the value of:</strong><br/><br/>(31.4 × 18.6) ÷ (5.1 × 1.9)<br/><em>Show your working.</em>"
        },
        {
          "type": "read",
          "label": "Step 1 — Round every value to 1 s.f.",
          "text": "31.4 ≈ 30<br/>18.6 ≈ 20<br/>5.1 ≈ 5<br/>1.9 ≈ 2"
        },
        {
          "type": "read",
          "label": "Step 2 — Calculate the estimate",
          "text": "(30 × 20) ÷ (5 × 2) = 600 ÷ 10 = <strong>60</strong>.<br/><br/><em>Mark scheme pattern: credit for rounded values, credit for correct use of those values, then accuracy for the estimate.</em>"
        },
        {
          "type": "quiz",
          "question": "Estimate (8.9 × 3.1) ÷ 1.95 using 1 significant figure rounding.",
          "options": [
            { "text": "14", "correct": true },
            { "text": "1.4", "correct": false },
            { "text": "28", "correct": false }
          ],
          "explanation": "8.9 ≈ 9, 3.1 ≈ 3 and 1.95 ≈ 2. So 9 × 3 ÷ 2 = 27 ÷ 2 = 13.5, which is about 14."
        }
      ]
    },

    {
      "tag": null,
      "label": "Guided practice",
      "kicker": "Section 5 — Practice with support",
      "heading": "Fill in the rounded values.",
      "sub": "Mix decimal places, significant figures and estimation.",
      "blocks": [
        {
          "type": "read",
          "label": "Method reminder",
          "text": "<strong>D.p.:</strong> count after the decimal point.<br/><strong>S.f.:</strong> count from the first non-zero digit.<br/><strong>Estimation:</strong> round every number first."
        },
        {
          "type": "fillblanks",
          "sentences": [
            {
              "before": "7.562 rounded to 1 decimal place =",
              "after": "",
              "answer": "7.6",
              "hints": ["1 d.p. means keep the tenths digit.", "The next digit is 6, so round up."]
            },
            {
              "before": "24,862 rounded to 3 significant figures =",
              "after": "",
              "answer": "24900",
              "hints": ["The first three significant figures are 2, 4 and 8.", "The next digit is 6, so 8 rounds up to 9."]
            },
            {
              "before": "0.005846 rounded to 3 significant figures =",
              "after": "",
              "answer": "0.00585",
              "hints": ["Leading zeros do not count.", "5, 8 and 4 are the first three significant figures; the next digit is 6."]
            },
            {
              "before": "Estimate 612 × 0.48 using 1 s.f.: 600 ×",
              "after": "= 300.",
              "answer": "0.5",
              "hints": ["612 rounds to 600.", "0.48 rounds to 0.5."]
            }
          ],
          "correctMsg": "Good — you chose the correct rounding rule for each question.",
          "wrongMsg": "Check what the question asks for first: d.p., s.f., estimate, or error interval."
        }
      ]
    },

    {
      "tag": "maths:rounding",
      "label": "Spot the error",
      "kicker": "Section 6 — Common mistake",
      "heading": "Fix the error interval.",
      "sub": "The upper bound is the classic trap.",
      "blocks": [
        {
          "type": "read",
          "label": "The student's answer",
          "text": "A student writes the error interval for a length measured as 8 cm to the nearest cm as:<br/><strong>7.5 ≤ l ≤ 8.5</strong>"
        },
        {
          "type": "misconceptionCheck",
          "statements": [
            {
              "statement": "7.5 ≤ l ≤ 8.5 is correct for 8 cm to the nearest cm.",
              "answer": false,
              "reveal": "FALSE. The lower bound 7.5 is included, because 7.5 rounds to 8. But 8.5 rounds up to 9, so it is not included. The correct interval is 7.5 ≤ l < 8.5.",
              "examTrap": "For rounded values, the lower bound uses ≤ and the upper bound uses <."
            }
          ]
        },
        {
          "type": "quiz",
          "question": "Correct error interval for l = 8 cm to the nearest cm:",
          "options": [
            { "text": "7.5 ≤ l < 8.5", "correct": true },
            { "text": "7.5 < l < 8.5", "correct": false },
            { "text": "7 ≤ l < 9", "correct": false }
          ],
          "explanation": "Half a centimetre either side: 7.5 is included, 8.5 is excluded."
        }
      ]
    },

    {
      "tag": null,
      "label": "Maths in the wild",
      "kicker": "Section 7 — Real-world application",
      "heading": "Rounding in measurement and estimates.",
      "sub": "Measurements are not exact unless the question says they are.",
      "blocks": [
        {
          "type": "read",
          "label": "Why error intervals matter",
          "text": "If a measurement is rounded, the real value could be a little smaller or a little larger. Error intervals show the full possible range. This matters in science experiments, manufacturing, construction and medical measurements."
        },
        {
          "type": "scenario",
          "situation": "A manufacturer makes bolts measuring 12 mm to the nearest mm.",
          "question": "Which interval shows the possible actual lengths, l?",
          "options": [
            { "text": "11.5 ≤ l < 12.5", "correct": true },
            { "text": "11 ≤ l < 13", "correct": false },
            { "text": "12 ≤ l < 13", "correct": false }
          ],
          "correctMsg": "Nearest mm means half a millimetre either side. The interval is 11.5 ≤ l < 12.5.",
          "wrongMsg": "Use half the rounding unit: 0.5 mm below and 0.5 mm above. The upper bound is excluded."
        },
        {
          "type": "scenario",
          "situation": "A jar holds 480 ml, measured to the nearest 10 ml.",
          "question": "Write the error interval for the volume, V.",
          "options": [
            { "text": "470 ≤ V < 490", "correct": false },
            { "text": "475 ≤ V < 485", "correct": true },
            { "text": "475 < V < 485", "correct": false }
          ],
          "correctMsg": "Nearest 10 ml means half a unit is 5 ml. Error interval: 475 ≤ V < 485.",
          "wrongMsg": "Half of 10 is 5. Lower bound included; upper bound excluded."
        }
      ]
    },

    {
      "tag": null,
      "label": "Retrieval",
      "kicker": "Section 8 — Retrieval practice",
      "heading": "Retrieval practice.",
      "sub": "Quick questions from Chapters 1–5.",
      "blocks": [
        {
          "type": "read",
          "label": "Why mixed retrieval works",
          "text": "Mixing old and new skills helps you remember which method to use. These questions revisit place value, negatives, BIDMAS and estimation."
        },
        {
          "type": "quiz",
          "question": "Round 0.0846 to 2 significant figures.",
          "options": [
            { "text": "0.08", "correct": false },
            { "text": "0.085", "correct": true },
            { "text": "0.0846", "correct": false }
          ],
          "explanation": "Leading zeros do not count. The first two significant figures are 8 and 4. The next digit is 6, so round up to 0.085."
        },
        {
          "type": "quiz",
          "question": "Work out (−4) × 3.",
          "options": [
            { "text": "−12", "correct": true },
            { "text": "12", "correct": false },
            { "text": "−7", "correct": false }
          ],
          "explanation": "Different signs give a negative answer. 4 × 3 = 12, so (−4) × 3 = −12."
        },
        {
          "type": "quiz",
          "question": "Work out 3² + 4 × 2 − (6 ÷ 2).",
          "options": [
            { "text": "14", "correct": true },
            { "text": "20", "correct": false },
            { "text": "5", "correct": false }
          ],
          "explanation": "BIDMAS: 3² = 9, 4 × 2 = 8, 6 ÷ 2 = 3. Then 9 + 8 − 3 = 14."
        }
      ]
    },

    {
      "tag": "maths:significant-figures",
      "label": "Exam practice",
      "kicker": "Section 9 — AQA exam style",
      "heading": "Exam-style questions.",
      "sub": "AQA-style wording, method marks shown. Answer before reading the mark scheme.",
      "blocks": [
        {
          "type": "read",
          "label": "AQA exam pattern",
          "text": "Rounding questions usually give one mark for the correct rounded answer. Estimation questions reward showing rounded values. Error interval questions often award separate credit for the lower and upper bounds."
        },
        {
          "type": "boss",
          "tier": "🟢",
          "label": "Q1 — Rounding to s.f. (1 mark)",
          "question": "Round 0.00583 to 2 significant figures.",
          "markPoints": [
            "Answer: 0.0058",
            "Leading zeros do not count as significant figures",
            "Common error: 0.006, which is 1 significant figure"
          ]
        },
        {
          "type": "boss",
          "tier": "🟡",
          "label": "Q2 — Error interval (2 marks)",
          "question": "A length, l cm, is measured as 3.7 cm to 1 decimal place. Write the error interval for l.",
          "markPoints": [
            "Answer: 3.65 ≤ l < 3.75",
            "Lower bound: 3.7 − 0.05 = 3.65, included",
            "Upper bound: 3.7 + 0.05 = 3.75, excluded"
          ]
        },
        {
          "type": "boss",
          "tier": "🔴",
          "label": "Q3 — Explain the error (2 marks, AO2)",
          "question": "A student rounds 0.00562 to 3 significant figures and gets 0.006. Explain the error.",
          "markPoints": [
            "Leading zeros do not count",
            "The first three significant figures are 5, 6 and 2",
            "There is no next digit to make 2 round up, so the answer should be 0.00562"
          ]
        }
      ]
    },

    {
      "tag": null,
      "label": "Chapter complete",
      "kicker": "Section 10 — Confidence check",
      "heading": "Chapter 5 done.",
      "sub": "Key rules. Top traps. What comes next.",
      "blocks": [
        {
          "type": "read",
          "label": "Key rules for rounding and estimation",
          "text": "1. <strong>D.p.:</strong> count after the decimal point.<br/>2. <strong>S.f.:</strong> count from the first non-zero digit.<br/>3. <strong>Estimation:</strong> round every number to 1 s.f. first, then calculate.<br/>4. <strong>Checking:</strong> use estimates to spot impossible exact answers.<br/>5. <strong>Error interval for rounding:</strong> lower ≤ x &lt; upper.<br/>6. <strong>Truncation:</strong> cut off digits; do not round up."
        },
        {
          "type": "read",
          "label": "Top 3 errors",
          "text": "1. <strong>D.p. vs s.f. confusion:</strong> 0.0473 to 2 s.f. is 0.047, not 0.04.<br/>2. <strong>Partial estimation:</strong> rounding only one number instead of all values.<br/>3. <strong>Error interval upper bound:</strong> writing ≤ for the upper bound instead of &lt;."
        },
        {
          "type": "examtip",
          "tip": "<strong>Exam habit:</strong> In estimation questions, show the rounded values. In error intervals, remember the upper bound is excluded."
        },
        {
          "type": "keypoint",
          "text": "<strong>Chapter 5 complete.</strong> You can now: round to d.p. and s.f. · estimate by rounding all values · check answers using estimates · write error intervals · distinguish rounding from truncation.<br/><br/>Next: Chapter 6 — Factors, multiples and primes."
        }
      ]
    }
  ],

  "series": "foundations",
  "recallTags": ["maths:rounding", "maths:significant-figures", "maths:estimation"],
  "examTags": ["N2", "N14", "N15"],
  "assetKeys": [],
  "stageNavigation": [
    { "id": "s1", "title": "The s.f. trap", "description": "Decimal places vs significant figures", "screenIndex": 0 },
    { "id": "s2", "title": "Prior knowledge", "description": "Place value and rounding basics", "screenIndex": 1 },
    { "id": "s3", "title": "Rounding to d.p.", "description": "Count after the decimal point", "screenIndex": 2 },
    { "id": "s4", "title": "Significant figures", "description": "Count from first non-zero digit", "screenIndex": 3 },
    { "id": "s5", "title": "Estimation", "description": "Round everything first", "screenIndex": 4 },
    { "id": "s6", "title": "Checking answers", "description": "Use estimates as an alarm", "screenIndex": 5 },
    { "id": "s7", "title": "Error intervals", "description": "Lower included, upper excluded", "screenIndex": 6 },
    { "id": "s8", "title": "Rounding vs truncation", "description": "Cutting off is not rounding", "screenIndex": 7 },
    { "id": "s9", "title": "Worked example", "description": "Estimation marks step by step", "screenIndex": 8 },
    { "id": "s10", "title": "Guided practice", "description": "Rounding and estimation blanks", "screenIndex": 9 },
    { "id": "s11", "title": "Spot the error", "description": "Fix the upper-bound trap", "screenIndex": 10 },
    { "id": "s12", "title": "Real world", "description": "Measurement and uncertainty", "screenIndex": 11 },
    { "id": "s13", "title": "Retrieval", "description": "Mixed questions from Ch1–Ch5", "screenIndex": 12 },
    { "id": "s14", "title": "Exam practice", "description": "AQA-style rounding questions", "screenIndex": 13 },
    { "id": "s15", "title": "Chapter complete", "description": "Key rules and what comes next", "screenIndex": 14 }
  ]
}

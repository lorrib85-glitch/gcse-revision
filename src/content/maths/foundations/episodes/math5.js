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
  "weaknessTags": ["maths:rounding", "maths:significant-figures"],
  "prerequisiteChapters": ["math1", "math2"],

  "hook": {
    "scenario": {
      "location": "AQA Foundation Paper 1 (non-calculator)",
      "hint": "A student rounds 0.0473 to 2 significant figures and writes 0.04."
    },
    "statement": "0.0473 rounded to 2 significant figures is 0.04",
    "isTrue": false,
    "accentWords": ["0.0473", "0.04"],
    "explanation": "Significant figures count from the first non-zero digit. In 0.0473, the first significant figure is 4 (in the hundredths place) and the second is 7 (thousandths). To 2 s.f.: 0.047 (the 3 in the ten-thousandths place rounds down). Writing 0.04 is rounding to 1 s.f., not 2 — it keeps only the 4.",
    "wrongFeedback": "Count significant figures from the first non-zero digit. In 0.0473, sig figs are 4, 7, 3. To 2 s.f.: keep 4 and 7 → 0.047.",
    "correctFeedback": "Right. 0.04 is 1 s.f. To 2 s.f. the answer is 0.047 (the 4 and the 7 are the two significant figures).",
    "loadingText": "Let's see exactly what 'significant figures' means — and how it differs from decimal places…",
    "bigQuestion": "How do you know whether the examiner wants decimal places or significant figures — and what's the difference?",
    "revealHeader": "Decimal places count positions after the point. Significant figures count from the first non-zero digit.",
    "revealItems": [
      {
        "emoji": "📍",
        "label": "Decimal places (d.p.)",
        "detail": "Count positions after the decimal point. 3.456 to 2 d.p. = 3.46 (look at the 3rd decimal: 6 ≥ 5, so round up the 2nd decimal). Leading zeros after the decimal point count as decimal places."
      },
      {
        "emoji": "⭐",
        "label": "Significant figures (s.f.)",
        "detail": "Count from the first non-zero digit. In 0.0473: first s.f. = 4, second = 7, third = 3. To 2 s.f.: 0.047. In 5,836: first s.f. = 5, second = 8, third = 3, fourth = 6. To 2 s.f.: 5,800."
      },
      {
        "emoji": "📐",
        "label": "Estimation uses 1 s.f.",
        "detail": "For estimation: round every number to 1 significant figure, then calculate. 382 × 4.7 ≈ 400 × 5 = 2000. Always round ALL numbers — not just some — before estimating."
      }
    ],
    "punchline": "Rounding to d.p. counts after the decimal. Rounding to s.f. counts from the first non-zero digit. Never confuse the two."
  },

  "intro": {
    "learningGoals": [
      "Round any number to a given number of decimal places",
      "Round any number to a given number of significant figures",
      "Estimate answers by rounding all values to 1 significant figure",
      "Find error intervals for rounded and truncated values"
    ]
  },

  "outcomes": {
    "intro": "Rounding and estimation questions appear on every AQA Foundation paper. Significant figures and error intervals are directly tested. Estimation is also embedded in multi-step problems as a checking skill.",
    "bullets": [
      "Round accurately to any given number of decimal places or significant figures",
      "Estimate any calculation by rounding all numbers to 1 s.f. first",
      "Write error intervals for rounded values (lower ≤ x < upper)",
      "Write error intervals for truncated values (lower ≤ x < lower + unit)"
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
      "tag": "maths:rounding",
      "label": "The s.f. trap",
      "kicker": "Section 1 — Why it matters",
      "heading": "Decimal places vs significant figures.",
      "sub": "Confusing these two is one of the most common errors on AQA Foundation papers.",
      "blocks": [
        {
          "type": "read",
          "label": "The exam stake",
          "text": "Rounding and estimation appear in <strong>at least 2 questions on every AQA Foundation paper</strong>. The most common error is confusing decimal places (count positions after the decimal) with significant figures (count from the first non-zero digit). One mark is typically lost by students who apply the wrong rule."
        },
        {
          "type": "quiz",
          "question": "Round 3.456 to 2 decimal places.",
          "options": [
            { "text": "3.45 (truncated — didn't look at the next digit)", "correct": false },
            { "text": "3.46 (2 d.p.: look at 3rd decimal digit = 6 ≥ 5, round up)", "correct": true },
            { "text": "3.5 (rounded to 1 d.p.)", "correct": false }
          ],
          "explanation": "2 decimal places means keep 2 digits after the decimal point. The 3rd digit is 6 ≥ 5, so round up the 2nd digit: 5 → 6. Answer: 3.46."
        },
        {
          "type": "examtip",
          "tip": "<strong>Series pillar: Number sense.</strong> The key question before rounding: 'Is the examiner asking for decimal places or significant figures?' The two rules start from different reference points — after the decimal vs the first non-zero digit."
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
          "text": "This chapter requires: <strong>place value from Ch1</strong> (identifying the column to round to), <strong>number line awareness</strong> (which way to round up vs round down), and <strong>basic multiplication from Ch2</strong> (for estimation calculations)."
        },
        {
          "type": "quiz",
          "question": "In 3.456, which digit is in the hundredths column?",
          "options": [
            { "text": "4 (tenths)", "correct": false },
            { "text": "5 (hundredths)", "correct": true },
            { "text": "6 (thousandths)", "correct": false }
          ],
          "explanation": "3.456: tenths = 4, hundredths = 5, thousandths = 6. The 5 is in the hundredths column (second place after the decimal)."
        },
        {
          "type": "quiz",
          "question": "Which is closer to 30: 27 or 34?",
          "options": [
            { "text": "27 (3 away from 30)", "correct": true },
            { "text": "34 (4 away from 30)", "correct": false },
            { "text": "They are equally close", "correct": false }
          ],
          "explanation": "27 is 3 away from 30. 34 is 4 away from 30. 27 is closer. This logic underpins rounding: choose the nearer value."
        }
      ]
    },

    {
      "tag": "maths:rounding",
      "label": "Rounding to d.p.",
      "kicker": "Section 3 — Core idea",
      "heading": "Rounding to decimal places.",
      "sub": "Three steps: identify the target column, look at the next digit, round up or keep.",
      "blocks": [
        {
          "type": "read",
          "label": "The method",
          "text": "<strong>Step 1:</strong> Identify the target column (e.g. '2 decimal places' = 2nd column after the decimal).<br/><strong>Step 2:</strong> Look at the digit in the next column (one to the right).<br/><strong>Step 3:</strong> If that digit is 5 or more, round up the target digit by 1. If it is 4 or less, keep the target digit the same (round down).<br/><br/>Example: 7.348 to 2 d.p. → look at 3rd decimal: 8 ≥ 5 → round up → 7.35"
        },
        {
          "type": "quiz",
          "question": "Round 12.765 to 1 decimal place.",
          "options": [
            { "text": "12.7 (looked at wrong digit)", "correct": false },
            { "text": "12.8 (2nd decimal = 6 ≥ 5, round up)", "correct": true },
            { "text": "13.0 (over-rounded)", "correct": false }
          ],
          "explanation": "1 d.p. means 1 digit after the decimal. Look at the 2nd decimal: 6 ≥ 5 → round up the 1st decimal from 7 to 8. Answer: 12.8."
        },
        {
          "type": "quiz",
          "question": "Round 4.302 to 2 decimal places.",
          "options": [
            { "text": "4.31 (rounded up incorrectly)", "correct": false },
            { "text": "4.30 (2nd decimal = 0; look at 3rd = 2 < 5 → keep 0)", "correct": true },
            { "text": "4.3 (dropped the trailing zero)", "correct": false }
          ],
          "explanation": "2 d.p.: keep 2 digits after decimal. Look at 3rd decimal: 2 < 5 → round down → keep 0. Answer: 4.30. Note: AQA requires you to write 4.30 (not 4.3) when 2 d.p. is specified — the trailing zero shows precision."
        }
      ]
    },

    {
      "tag": "maths:significant-figures",
      "label": "Significant figures",
      "kicker": "Section 3 — Core idea",
      "heading": "Rounding to significant figures.",
      "sub": "Significant figures count from the first non-zero digit — leading zeros do not count.",
      "blocks": [
        {
          "type": "read",
          "label": "What makes a figure 'significant'",
          "text": "<strong>Start counting from the first non-zero digit.</strong><br/><br/>In <strong>5,836</strong>: 1st s.f. = 5; 2nd = 8; 3rd = 3; 4th = 6.<br/>In <strong>0.0473</strong>: leading zeros are NOT significant — 1st s.f. = 4; 2nd = 7; 3rd = 3.<br/>In <strong>0.400</strong>: 1st s.f. = 4; trailing zeros after decimal are significant — 2nd = 0; 3rd = 0.<br/><br/>Rounding uses the same 'look at the next digit' rule as for d.p."
        },
        {
          "type": "quiz",
          "question": "Round 5,836 to 2 significant figures.",
          "options": [
            { "text": "5,800 (1st s.f.=5, 2nd s.f.=8; look at 3rd=3 < 5 → round down)", "correct": true },
            { "text": "5,840 (kept 3 s.f. by mistake)", "correct": false },
            { "text": "5,900 (rounded up 3rd digit by mistake)", "correct": false }
          ],
          "explanation": "2 s.f. in 5,836: keep 5 and 8. Next digit = 3 < 5 → round down. Result: 5,800 (zeros fill the other columns but are not significant)."
        },
        {
          "type": "quiz",
          "question": "Round 0.0473 to 2 significant figures.",
          "options": [
            { "text": "0.04 (only 1 s.f. — stopped at 4)", "correct": false },
            { "text": "0.047 (2 s.f.: 4 and 7; next digit = 3 < 5 → round down)", "correct": true },
            { "text": "0.05 (rounded 4 up to 5)", "correct": false }
          ],
          "explanation": "Leading zeros are not significant. 1st s.f. = 4 (hundredths), 2nd s.f. = 7 (thousandths). Next digit = 3 < 5 → keep 7. Answer: 0.047."
        }
      ]
    },

    {
      "tag": "maths:rounding",
      "label": "Estimation",
      "kicker": "Section 3 — Core idea",
      "heading": "Estimation: round everything to 1 significant figure.",
      "sub": "AQA estimation questions always ask you to show your rounded values — not just the answer.",
      "blocks": [
        {
          "type": "read",
          "label": "The estimation method",
          "text": "<strong>Step 1:</strong> Round every number in the calculation to 1 significant figure.<br/><strong>Step 2:</strong> Carry out the calculation using the rounded values.<br/><strong>Step 3:</strong> Show your working — AQA awards a method mark for the rounded values even if the final answer is wrong.<br/><br/>Example: estimate 382 × 4.7<br/>382 ≈ 400 &nbsp;·&nbsp; 4.7 ≈ 5 &nbsp;·&nbsp; 400 × 5 = 2,000"
        },
        {
          "type": "quiz",
          "question": "Estimate 487 ÷ 23 by rounding each number to 1 significant figure.",
          "options": [
            { "text": "24 (used exact values)", "correct": false },
            { "text": "25 (500 ÷ 20 = 25)", "correct": true },
            { "text": "10 (rounded to wrong s.f.)", "correct": false }
          ],
          "explanation": "487 ≈ 500 (1 s.f.). 23 ≈ 20 (1 s.f.). 500 ÷ 20 = 25. Show: 500 ÷ 20 for the method mark."
        },
        {
          "type": "quiz",
          "question": "Estimate (62 × 38) ÷ 19",
          "options": [
            { "text": "120 (60 × 40 = 2400; 2400 ÷ 20 = 120)", "correct": true },
            { "text": "124 (used exact values)", "correct": false },
            { "text": "600 (forgot to divide)", "correct": false }
          ],
          "explanation": "62 ≈ 60. 38 ≈ 40. 19 ≈ 20. Calculation: 60 × 40 = 2,400. 2,400 ÷ 20 = 120."
        }
      ]
    },

    {
      "tag": "maths:rounding",
      "label": "Error intervals",
      "kicker": "Section 3 — Core idea",
      "heading": "Error intervals for rounded and truncated values.",
      "sub": "An error interval states the range of values a rounded or truncated number could have been.",
      "blocks": [
        {
          "type": "read",
          "label": "Rounding: lower bound and upper bound",
          "text": "<strong>Rounding to the nearest 10:</strong><br/>If a number rounds to 40, it could have been anywhere from 35 up to (but not including) 45.<br/>Error interval: <strong>35 ≤ x &lt; 45</strong> (the lower bound is included; the upper bound is excluded because 45 itself rounds to 50).<br/><br/><strong>Rounding to 1 d.p.:</strong><br/>If a number rounds to 2.3, error interval: <strong>2.25 ≤ x &lt; 2.35</strong>.<br/>Half a unit below, half a unit above — lower included, upper excluded."
        },
        {
          "type": "quiz",
          "question": "A length, L, is measured as 6.4 cm to 1 decimal place. Write the error interval for L.",
          "options": [
            { "text": "6.35 < L < 6.45 (both bounds excluded)", "correct": false },
            { "text": "6.35 ≤ L < 6.45 (lower included, upper excluded)", "correct": true },
            { "text": "6.3 ≤ L < 6.5 (wrong unit)", "correct": false }
          ],
          "explanation": "Rounded to 1 d.p. (nearest 0.1). Half a unit = 0.05. Lower: 6.4 − 0.05 = 6.35 (included). Upper: 6.4 + 0.05 = 6.45 (excluded — 6.45 would round to 6.5). Error interval: 6.35 ≤ L < 6.45."
        },
        {
          "type": "read",
          "label": "Truncation: a different kind of error interval",
          "text": "<strong>Truncation</strong> means cutting off digits without rounding — always rounds toward zero.<br/><br/>If a number is <em>truncated</em> to give 4.7, the actual value is at least 4.7 but less than 4.8:<br/>Error interval: <strong>4.7 ≤ x &lt; 4.8</strong><br/><br/>Key difference from rounding: the lower bound is the truncated value itself (not half a unit below it)."
        }
      ]
    },

    {
      "tag": "maths:rounding",
      "label": "Worked example",
      "kicker": "Section 4 — Examiner method",
      "heading": "Full worked example.",
      "sub": "Show your rounded values — AQA awards marks for the method even if arithmetic goes wrong.",
      "blocks": [
        {
          "type": "read",
          "label": "The question",
          "text": "<strong>Use approximation to estimate the value of:</strong><br/><br/>√(97.4) × 51.3<br/>          ————————<br/>             4.8<br/><br/><em>(2 marks)</em>"
        },
        {
          "type": "read",
          "label": "Step 1 — Round each number to 1 significant figure",
          "text": "97.4 ≈ 100 &nbsp;&nbsp; 51.3 ≈ 50 &nbsp;&nbsp; 4.8 ≈ 5"
        },
        {
          "type": "read",
          "label": "Step 2 — Work out the simplified expression",
          "text": "√100 × 50 ÷ 5 = 10 × 50 ÷ 5 = 100<br/><br/><em>Mark scheme: 1M for correct rounding to 1 s.f. and correct structure; 1A for 100<br/>(Answer of 102.8... from exact calculation scores 0 — 'approximate' is required)</em>"
        },
        {
          "type": "quiz",
          "question": "Estimate (√81.6 × 29.7) ÷ 9.8 using 1 significant figure rounding.",
          "options": [
            { "text": "30 (√100=10; 10×30=300; 300÷10=30)", "correct": true },
            { "text": "3 (forgot to account for all terms)", "correct": false },
            { "text": "90 (arithmetic error)", "correct": false }
          ],
          "explanation": "81.6 ≈ 100 → √100 = 10. 29.7 ≈ 30. 9.8 ≈ 10. Calculation: 10 × 30 ÷ 10 = 30."
        }
      ]
    },

    {
      "tag": null,
      "label": "Guided practice",
      "kicker": "Section 5 — Practice with support",
      "heading": "Fill in the rounded values.",
      "sub": "Apply the rounding rules for d.p. and s.f.",
      "blocks": [
        {
          "type": "read",
          "label": "Method reminder",
          "text": "<strong>D.p.:</strong> count after the decimal point; look at the next digit.<br/><strong>S.f.:</strong> count from the first non-zero digit; look at the next digit.<br/><strong>Both:</strong> ≥ 5 round up; < 5 round down (keep same)."
        },
        {
          "type": "fillblanks",
          "sentences": [
            {
              "before": "7.562 rounded to 1 decimal place =",
              "after": "",
              "answer": "7.6",
              "hints": [
                "1 d.p. means 1 digit after the decimal. Look at the 2nd decimal digit.",
                "2nd decimal = 6 ≥ 5 → round up. 7.5 → 7.6."
              ]
            },
            {
              "before": "4,720 rounded to 2 significant figures =",
              "after": "",
              "answer": "4700",
              "hints": [
                "1st s.f. = 4, 2nd s.f. = 7. Look at the 3rd digit.",
                "3rd digit = 2 < 5 → round down. Keep 4 and 7: 4,700."
              ]
            },
            {
              "before": "0.00852 rounded to 2 significant figures =",
              "after": "",
              "answer": "0.0085",
              "hints": [
                "Leading zeros are not significant. 1st s.f. = 8, 2nd s.f. = 5.",
                "3rd digit = 2 < 5 → round down. 0.0085."
              ]
            }
          ],
          "correctMsg": "Good — d.p. and s.f. applied correctly.",
          "wrongMsg": "Check: are you counting from the decimal point (d.p.) or from the first non-zero digit (s.f.)?"
        }
      ]
    },

    {
      "tag": "maths:rounding",
      "label": "Spot the error",
      "kicker": "Section 6 — Common mistake",
      "heading": "Find and fix the error.",
      "sub": "This error pattern appears directly in AQA mark scheme notes.",
      "blocks": [
        {
          "type": "read",
          "label": "The student's working",
          "text": "A student estimates 382 ÷ 19 and writes:<br/><strong>382 ÷ 19 ≈ 382 ÷ 20 = 19.1</strong>"
        },
        {
          "type": "misconceptionCheck",
          "statements": [
            {
              "statement": "The student's estimate of 19.1 is a valid approximation.",
              "answer": false,
              "reveal": "FALSE. The student rounded 19 to 20 (to 1 s.f.) but left 382 as the exact value. Estimation requires rounding ALL numbers to 1 significant figure first. 382 ≈ 400. Then 400 ÷ 20 = 20. The answer 19.1 is essentially an exact calculation, not an estimate. AQA marks require the rounded values to be shown.",
              "examTrap": "AQA mark schemes penalise estimates where only some numbers are rounded. The instruction 'use approximation' always means round every number to 1 s.f."
            }
          ]
        },
        {
          "type": "quiz",
          "question": "Using 1 significant figure throughout, the correct estimate for 382 ÷ 19 is:",
          "options": [
            { "text": "19.1 (exact calculation)", "correct": false },
            { "text": "20 (400 ÷ 20 = 20)", "correct": true },
            { "text": "15 (wrong rounding)", "correct": false }
          ],
          "explanation": "382 ≈ 400 (1 s.f.). 19 ≈ 20 (1 s.f.). 400 ÷ 20 = 20."
        }
      ]
    },

    {
      "tag": null,
      "label": "Maths in the wild",
      "kicker": "Section 7 — Real-world application",
      "heading": "Rounding in measurement and estimation.",
      "sub": "Rounding and error intervals model the uncertainty in all real-world measurements.",
      "blocks": [
        {
          "type": "read",
          "label": "Why error intervals matter",
          "text": "Every measurement in science, engineering, and everyday life has an implied precision. If a doctor says a patient is 1.8 m tall 'to the nearest 0.1 m', the actual height could be anywhere from 1.75 m to just under 1.85 m. The error interval captures that range."
        },
        {
          "type": "scenario",
          "situation": "A plank of wood is measured as 2.4 m to the nearest 0.1 m. A second plank is 1.8 m to the nearest 0.1 m.",
          "question": "What is the minimum possible total length of both planks combined?",
          "options": [
            { "text": "4.2 m (added the rounded values)", "correct": false },
            { "text": "4.1 m (used lower bounds: 2.35 + 1.75 = 4.10)", "correct": true },
            { "text": "4.3 m (used upper bounds)", "correct": false }
          ],
          "correctMsg": "Lower bounds: 2.35 + 1.75 = 4.10 m. This is the minimum because both planks could be at their smallest possible values.",
          "wrongMsg": "For minimum total, use lower bounds: 2.4 − 0.05 = 2.35 and 1.8 − 0.05 = 1.75. Total: 2.35 + 1.75 = 4.10 m."
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
          "correctMsg": "Nearest 10 ml: half a unit = 5. Lower: 480 − 5 = 475 (included). Upper: 480 + 5 = 485 (excluded). Error interval: 475 ≤ V < 485.",
          "wrongMsg": "Half a unit below: 480 − 5 = 475 (≤ because 475 rounds to 480). Half a unit above: 480 + 5 = 485 (< because 485 rounds to 490)."
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
          "question": "Round 0.0846 to 2 significant figures.",
          "options": [
            { "text": "0.08 (only 1 s.f.)", "correct": false },
            { "text": "0.085 (2 s.f.: first non-zero = 8, second = 4; next = 6 ≥ 5 → round up)", "correct": true },
            { "text": "0.0846 (no rounding applied)", "correct": false }
          ],
          "explanation": "Leading zeros not significant. 1st s.f. = 8, 2nd s.f. = 4. Look at 3rd s.f. = 6 ≥ 5 → round up 4 to 5. Answer: 0.085."
        },
        {
          "type": "quiz",
          "question": "A value is rounded to the nearest whole number and gives 7. Write the error interval.",
          "options": [
            { "text": "6.5 ≤ x < 7.5", "correct": true },
            { "text": "6 ≤ x < 8", "correct": false },
            { "text": "6.5 < x < 7.5", "correct": false }
          ],
          "explanation": "Nearest whole number: half a unit = 0.5. Lower: 7 − 0.5 = 6.5 (included). Upper: 7 + 0.5 = 7.5 (excluded). Interval: 6.5 ≤ x < 7.5."
        },
        {
          "type": "quiz",
          "question": "Estimate 612 × 0.48 using 1 significant figure rounding.",
          "options": [
            { "text": "300 (600 × 0.5 = 300)", "correct": true },
            { "text": "294 (exact value)", "correct": false },
            { "text": "3,000 (wrong rounding of 0.48)", "correct": false }
          ],
          "explanation": "612 ≈ 600. 0.48 ≈ 0.5. 600 × 0.5 = 300."
        }
      ]
    },

    {
      "tag": "maths:significant-figures",
      "label": "Exam practice",
      "kicker": "Section 9 — AQA exam style",
      "heading": "Exam-style questions.",
      "sub": "AQA wording, method marks shown. Answer before reading the mark scheme.",
      "blocks": [
        {
          "type": "read",
          "label": "AQA exam pattern",
          "text": "Rounding/estimation questions on AQA Foundation award marks as follows: (1) d.p. and s.f. rounding — B1 for correct answer; (2) estimation — M1 for rounding all values to 1 s.f., A1 for correct estimate (must show rounded values); (3) error intervals — B1 for lower bound, B1 for upper bound (two separate marks)."
        },
        {
          "type": "boss",
          "tier": "🟢",
          "label": "Q1 — Rounding to s.f. (1 mark)",
          "question": "Round 0.005 83 to 2 significant figures.",
          "markPoints": [
            "Answer: 0.0058",
            "1 mark for 0.0058",
            "Common error: 0.006 (rounded to 1 s.f.) or 0.00583 (rounded to 3 s.f.)"
          ]
        },
        {
          "type": "boss",
          "tier": "🟡",
          "label": "Q2 — Estimation (2 marks)",
          "question": "Use approximation to estimate:\n√(49.2) × 31.8\n——————————\n      9.7",
          "markPoints": [
            "49.2 ≈ 49 → √49 = 7 (or 49.2 ≈ 50 → √50 ≈ 7 is acceptable)",
            "31.8 ≈ 30; 9.7 ≈ 10",
            "Estimate: 7 × 30 ÷ 10 = 21",
            "1M for rounding all numbers to 1 s.f. (or recognising √49=7); 1A for 21",
            "Common error: using exact values → scores 0"
          ]
        },
        {
          "type": "boss",
          "tier": "🔴",
          "label": "Q3 — Error interval (2 marks)",
          "question": "A time, T seconds, is measured as 14 seconds to the nearest second.\nWrite the error interval for T.",
          "markPoints": [
            "Error interval: 13.5 ≤ T < 14.5",
            "1 mark for lower bound 13.5 (or 13.5 ≤ T); 1 mark for upper bound 14.5 (or T < 14.5)",
            "Must use correct inequality symbols: lower bound ≤ (included), upper bound < (excluded)",
            "Common error: 13.5 < T < 14.5 (both open — incorrect for rounding)"
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
          "text": "1. <strong>D.p.:</strong> count after the decimal; look at the next digit; ≥ 5 round up.<br/>2. <strong>S.f.:</strong> count from first non-zero digit; same rounding rule.<br/>3. <strong>Estimation:</strong> round ALL numbers to 1 s.f. — show rounded values for the method mark.<br/>4. <strong>Error interval (rounding):</strong> lower ≤ x &lt; upper; half a unit either side.<br/>5. <strong>Error interval (truncation):</strong> lower ≤ x &lt; lower + 1 unit (no subtraction from lower)."
        },
        {
          "type": "read",
          "label": "Top 3 errors from AQA mark schemes",
          "text": "1. <strong>D.p. vs s.f. confusion:</strong> 0.0473 to 2 s.f. = 0.04 instead of 0.047.<br/>2. <strong>Partial estimation:</strong> rounding only one number — must round ALL values to 1 s.f.<br/>3. <strong>Wrong inequality for error interval:</strong> 13.5 &lt; T &lt; 14.5 (both open) — lower is ≤, upper is &lt;."
        },
        {
          "type": "examtip",
          "tip": "<strong>Exam habit:</strong> When asked to estimate, always write down the rounded values before calculating — AQA awards a method mark for them separately. If your arithmetic then goes wrong you still get M1."
        },
        {
          "type": "keypoint",
          "text": "<strong>Chapter 5 complete.</strong> You can now: round to d.p. and s.f. correctly · estimate any calculation using 1 s.f. rounding · write error intervals for rounded and truncated values · avoid the most common s.f. trap (leading zeros).<br/><br/>Next: Chapter 6 — Factors, multiples and primes. The rounding skills from this chapter combine with number work in Module 2 ratio and proportion."
        }
      ]
    }
  ],

  "series": "foundations",
  "recallTags": ["maths:rounding", "maths:significant-figures"],
  "examTags": ["N2", "N14", "N15"],
  "assetKeys": [],
  "stageNavigation": [
    { "id": "s1",  "title": "The s.f. trap",       "description": "D.p. vs significant figures",                 "screenIndex": 0 },
    { "id": "s2",  "title": "Prior knowledge",      "description": "Place value and number line",                 "screenIndex": 1 },
    { "id": "s3",  "title": "Decimal places",       "description": "Rounding to d.p. — three-step method",        "screenIndex": 2 },
    { "id": "s4",  "title": "Significant figures",  "description": "Count from first non-zero digit",             "screenIndex": 3 },
    { "id": "s5",  "title": "Estimation",           "description": "Round all values to 1 s.f.",                  "screenIndex": 4 },
    { "id": "s6",  "title": "Error intervals",      "description": "Bounds for rounded and truncated values",     "screenIndex": 5 },
    { "id": "s7",  "title": "Worked example",       "description": "Estimation with a square root",               "screenIndex": 6 },
    { "id": "s8",  "title": "Guided practice",      "description": "Fill in the rounded values",                  "screenIndex": 7 },
    { "id": "s9",  "title": "Spot the error",       "description": "Fix the partial estimation mistake",          "screenIndex": 8 },
    { "id": "s10", "title": "Real world",           "description": "Measurement and error intervals",             "screenIndex": 9 },
    { "id": "s11", "title": "Retrieval",            "description": "Lock it in with quick questions",             "screenIndex": 10 },
    { "id": "s12", "title": "Exam practice",        "description": "AQA-style rounding questions",                "screenIndex": 11 },
    { "id": "s13", "title": "Chapter complete",     "description": "Key rules and what comes next",               "screenIndex": 12 }
  ]
}

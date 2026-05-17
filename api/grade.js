export const config = { runtime: 'edge' }

const SYSTEM_PROMPT = `You are an experienced AQA GCSE History examiner. Your job is to mark student answers against the mark scheme and give constructive, encouraging feedback aimed at a teenager.

You will receive:
- The exam question
- The number of marks available
- The mark scheme guidance
- The student's answer

Respond in this exact JSON format with no other text:
{
  "marksAwarded": <number>,
  "marksAvailable": <number>,
  "summary": "<one sentence overall verdict, warm but honest>",
  "achieved": ["<point they made well>", "<another point>"],
  "missed": ["<key point they missed>", "<another missed point>"],
  "examinerTip": "<one specific, actionable improvement tip>",
  "grade": "<Excellent|Good|Developing|Needs Work>"
}

Marking guidelines:
- Be fair and generous where the student shows understanding, even if phrasing isn't perfect
- For 4-mark questions: award 1-2 marks per developed point (point + supporting detail)
- For 12-mark questions: award marks for number of developed points with evidence and explanation
- For 16-mark questions: award marks for argument, counter-argument, evidence and judgement
- Never award more than the marks available
- If the answer is blank or very short, award 0 and be encouraging not harsh
- Keep feedback concise — max 2 items in achieved and missed arrays
- The examinerTip should be one concrete thing they can do differently next time`

const MARK_SCHEMES = {
  // ── History: Medieval Medicine ──────────────────────────────────────────────
  'Describe two features of medieval hospitals. [4 marks]': `
Award up to 2 marks per feature (1 for identifying, 1 for development/supporting detail).
Features could include: run by the Church/monks/nuns; focused on care and prayer rather than curing disease; St Bartholomew's Hospital (1123) as example; patients prayed and received basic care; hospitals were places of rest not medical treatment; staffed by religious orders.`,

  'Explain why the Church both helped and hindered medicine in the Middle Ages. [12 marks]': `
Award marks for developed points with evidence and explanation.
Helped: preserved and taught Galen's texts in universities; ran hospitals like St Bartholomew's (1123); provided care for sick; trained physicians.
Hindered: discouraged dissection (body needed to be whole for resurrection); treated Galen's work as unquestionable; linked illness to sin/God's punishment; discouraged new thinking.
Strong answers will explain the mechanism not just list points.`,

  'How far was the Black Death a turning point in the history of medicine? Explain your answer. [16 marks]': `
Award marks for: argument that it was a turning point (exposed limits of medieval medicine, prompted some public health action); counter-argument (beliefs and treatments barely changed, humours still dominant after 1349, no new understanding of disease); balanced judgement.
Strong answers: specific evidence (1348 arrival, 1/3 of population died, miasma/God's punishment blamed, flagellants), explain why change/continuity happened, reach a clear supported judgement.`,

  '"The main reason medieval medicine made little progress was the influence of the Church." How far do you agree? Explain your answer. [16 marks]': `
Agree: Church backed Galen, discouraged dissection, linked illness to God, trained physicians in outdated ideas.
Disagree: other factors — lack of technology, four humours theory itself, tradition and conservatism, limited scientific method, Galen's own authority.
Strong answers: argue both sides with specific evidence, reach a clear judgement about which factor was most important and why.`,

  // ── History: Renaissance ───────────────────────────────────────────────────
  "Describe two features of Vesalius\\'s contribution to medicine. [4 marks]": `
Award up to 2 marks per feature.
Features: corrected over 300 of Galen's errors; used human dissection himself; published De Fabrica (1543); proved jaw is one bone not two; showed septum of heart had no holes; encouraged observation over ancient authority.`,

  "Explain why Harvey\\'s discovery of blood circulation did not immediately lead to better treatments. [12 marks]": `
Award marks for developed explanation.
Key points: Harvey proved blood circulates but couldn't explain what blood does; doctors still used bloodletting because they didn't know what else to do; understanding doesn't automatically change treatment; conservative medical profession; lack of technology to apply knowledge.
Strong answers explain the mechanism — why understanding and treatment are separate things.`,

  'How far did the Renaissance change medicine? Explain your answer. [16 marks]': `
Changed: Vesalius corrected anatomy, Harvey proved circulation, Paré improved surgery, printing press spread ideas, observation valued over authority.
Continuity: treatments barely changed, humours still used, bleeding/purging continued, most people still saw wise women/barber surgeons, Great Plague 1665 shows disease understanding remained poor.
Strong answers: balanced argument with specific evidence, clear judgement on extent of change.`,

  // ── History: Surgery ───────────────────────────────────────────────────────
  'Describe two problems with surgery before the 1840s. [4 marks]': `
Award up to 2 marks per problem.
Problems: no anaesthetic so patients conscious and in pain; no antiseptics so infection common (surgical fever); no blood transfusions so blood loss often fatal; dirty instruments and hands spread infection; surgeons judged on speed not care.`,

  'Explain why anaesthetics both helped and created new problems for surgery. [12 marks]': `
Helped: removed pain, patients could stay still, surgeons could work more carefully, longer and more complex operations possible.
Problems created: longer operations increased exposure to infection; overconfidence led to more ambitious surgery before antiseptics existed; chloroform could be fatal if overdosed (Hannah Greener, 1848).
Strong answers explain the mechanism of both effects with specific evidence.`,

  "Explain how important Lister\\'s use of antiseptics was in improving surgery. [16 marks]": `
Important: carbolic acid dramatically reduced infection deaths; applied Pasteur's germ theory practically; changed surgical practice; aseptic surgery followed.
Limits: other factors also improved surgery — anaesthetics (Simpson 1847), blood groups (Landsteiner 1901), aseptic methods went further than Lister; initial resistance from surgeons.
Strong answers: weigh Lister's importance against other factors, reach supported judgement.`,

  // ── History: Germ Theory ───────────────────────────────────────────────────
  'Describe two features of Pasteur\'s germ theory. [4 marks]': `
Award up to 2 marks per feature.
Features: proved micro-organisms cause disease/decay; swan-neck flask experiment (1861); overturned spontaneous generation; showed microbes come from air not appear spontaneously; led to pasteurisation; opened door to vaccines and antiseptics.`,

  "Explain why Koch\\'s work was important for the development of medicine. [12 marks]": `
Key points: identified specific bacteria causing specific diseases (anthrax 1876, TB 1882, cholera 1883); developed staining techniques; made germ theory more convincing; enabled development of targeted treatments and vaccines; built on Pasteur's general germ theory with specific proof.
Strong answers explain why specificity mattered — knowing which germ caused which disease enabled targeted treatment.`,

  '"Pasteur\'s germ theory was the most important development in medicine in the 19th century." How far do you agree? Explain your answer. [16 marks]': `
Agree: germ theory underpinned antiseptic surgery, vaccines, public health reform; changed direction of all medicine; Pasteur's swan-neck flask 1861 was pivotal.
Disagree: other developments also important — anaesthetics (Simpson 1847), public health acts (1848, 1875), Koch's specific discoveries, Lister's antiseptics, Snow's waterborne cholera proof.
Strong answers: weigh germ theory against other factors with specific evidence, reach clear supported judgement.`,

  // ── History: Public Health ─────────────────────────────────────────────────
  'Describe two features of the 1875 Public Health Act. [4 marks]': `
Award up to 2 marks per feature.
Features: compulsory clean water supply; compulsory sewage systems; local authorities had to appoint medical officers of health; made sanitation improvements mandatory not optional; shift away from laissez-faire; built on the weaker 1848 Act.`,

  'Explain why the government was slow to improve public health in the early 19th century. [12 marks]': `
Key reasons: laissez-faire attitude (government should not interfere); cost — ratepayers didn't want to pay for improvements; miasma theory meant people didn't fully understand disease spread; vested interests (landlords, water companies); local not national responsibility; 1848 Act was optional not compulsory.
Strong answers explain the mechanism of each factor with evidence.`,

  'How far was the Great Stink of 1858 a turning point in the history of public health? [16 marks]': `
Was a turning point: Parliament directly affected so reform became urgent; led to Bazalgette's sewer system; reduced cholera outbreaks in London; showed engineering could solve public health problems.
Not a turning point/other factors: Chadwick's 1842 report laid groundwork; Snow's 1854 pump handle removal proved waterborne spread; 1848 Act already existed; 1875 Act was arguably more significant nationally.
Strong answers: balanced argument, specific evidence, clear judgement on extent of turning point.`,
}

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'API key not configured' }), { status: 500 })
  }

  let body
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), { status: 400 })
  }

  const { question, answer, marks } = body
  if (!question || !answer || !marks) {
    return new Response(JSON.stringify({ error: 'Missing question, answer or marks' }), { status: 400 })
  }

  if (answer.trim().length < 5) {
    return new Response(JSON.stringify({
      marksAwarded: 0, marksAvailable: marks,
      summary: "You haven't written an answer yet — give it a go first!",
      achieved: [], missed: ['No answer provided'],
      examinerTip: 'Even a rough attempt is worth writing. Get your ideas down first, then refine.',
      grade: 'Needs Work'
    }), { status: 200, headers: { 'Content-Type': 'application/json' } })
  }

  const markScheme = MARK_SCHEMES[question] || `Award marks fairly for ${marks}-mark question based on relevance, accuracy and development of points.`

  const userMessage = `Question: ${question}

Marks available: ${marks}

Mark scheme guidance:
${markScheme}

Student's answer:
${answer}`

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5',
        max_tokens: 600,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userMessage }],
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      return new Response(JSON.stringify({ error: `API error: ${err}` }), { status: 500 })
    }

    const data = await response.json()
    const text = data.content?.[0]?.text || ''

    let result
    try {
      result = JSON.parse(text)
    } catch {
      // Try to extract JSON if Claude added extra text
      const match = text.match(/\{[\s\S]*\}/)
      if (match) result = JSON.parse(match[0])
      else throw new Error('Could not parse response')
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
}

export const config = { runtime: 'edge' }

const SYSTEM_PROMPT = `You are a rigorous GCSE examiner re-marking an answer that a student has improved.

You will receive: the exam question, marks available, the mark scheme, the original answer with its baseline mark, the student's edited answer (which has their additions inserted), and a map of what edits they made.

Your job is to award a new mark for the edited answer. Apply these rules strictly:
- Only increase the mark if the student's additions genuinely satisfy mark scheme criteria that were not met in the original answer
- If additions repeat what was already said, are vague, or fail to develop the point, do NOT increase the mark — keep it the same as the baseline
- Never award more marks than are available
- Be rigorous: a student cannot earn marks by padding; they must address specific mark scheme requirements
- Explain the change (or lack of change) briefly and specifically — reference the mark scheme

Respond ONLY in this exact JSON format with no other text:
{
  "marksAwarded": <number>,
  "marksAvailable": <number>,
  "delta": <number — difference from originalMark, can be 0>,
  "verdict": "<one sentence: what changed and why, or why the mark stayed the same>",
  "improved": ["<specific thing that earned a mark>"],
  "stillMissing": ["<specific mark scheme point still not addressed>"]
}`

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'API key not configured' }), { status: 500 })
  }

  let body
  try { body = await req.json() } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), { status: 400 })
  }

  const { question, originalAnswer, editedAnswer, marks, markScheme, subject, board, type, originalMark, studentEdits } = body

  if (!question || !editedAnswer || !marks) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 })
  }

  if (!markScheme || !markScheme.trim()) {
    return new Response(JSON.stringify({ error: 'Cannot re-mark: mark scheme data missing.' }), { status: 400 })
  }

  const userMessage = `Question: ${question}

Marks available: ${marks}
Question type: ${type || 'extended response'}
Subject: ${subject || 'unknown'} (${board || 'exam board not specified'})

Mark scheme:
${markScheme}

Original answer (baseline mark: ${originalMark ?? 'unknown'}/${marks}):
${originalAnswer || editedAnswer}

Student's improved answer (with additions inserted):
${editedAnswer}

What the student added:
${Object.entries(studentEdits || {}).map(([id, text]) => `- ${id}: "${text}"`).join('\n') || 'No edits recorded'}`

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 800,
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

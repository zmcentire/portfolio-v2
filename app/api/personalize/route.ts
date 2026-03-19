import { NextRequest } from 'next/server'

const BASE_BIO = `
Zach McEntire is a Full-Stack and AI Engineer with 5+ years of technical leadership in customer-facing roles spanning Technical Support and Technical Account Management. 

He builds agentic systems, cloud-native APIs, and the support tooling that keeps them running. He has a deep commitment to developer experience and customer success.

Key experience:
- Shipped TigerData: an agentic AI fitness tracker using Claude tool-use agents, TimescaleDB hypertables, FastAPI, and Railway deployment
- Built front-end components (navigation, menus, action cards) for Poly Platform in Angular/TypeScript
- Developed HotZone: a Firebase-backed field resource app for firefighters and paramedics
- Python and Bash scripting for custom integrations and data ingest routines
- Strong network, security, and enterprise IT knowledge across Windows, macOS, and Linux

Technical stack: React, Next.js, Angular, TypeScript, Python, FastAPI, Node.js, C#/.NET, Claude API, TimescaleDB, MongoDB, Firebase, GitHub Actions, Railway, Vercel
`.trim()

export async function POST(req: NextRequest) {
  const { jobDescription } = await req.json()

  if (!jobDescription?.trim()) {
    return new Response('Job description is required', { status: 400 })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return new Response('API key not configured', { status: 500 })
  }

  const prompt = `You are a professional resume writer helping a software engineer tailor their bio for a specific job.

Here is Zach's base bio and experience:
${BASE_BIO}

Here is the job description he is applying to:
${jobDescription}

Rewrite Zach's professional summary (3-4 sentences max) to:
1. Mirror the language and priorities used in the job description
2. Lead with the most relevant experience for THIS specific role
3. Highlight the 2-3 most relevant technical skills from his stack
4. Sound natural and confident — not keyword-stuffed
5. Be written in third person

Return ONLY the rewritten summary with no preamble, no explanation, no labels.`

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type':      'application/json',
      'x-api-key':         apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model:      'claude-sonnet-4-20250514',
      max_tokens: 400,
      stream:     true,
      messages:   [{ role: 'user', content: prompt }],
    }),
  })

  if (!response.ok) {
    return new Response('Claude API error', { status: 500 })
  }

  // Stream the SSE response directly to the client
  const { readable, writable } = new TransformStream()
  const writer = writable.getWriter()
  const encoder = new TextEncoder()
  const decoder = new TextDecoder()

  ;(async () => {
    const reader = response.body!.getReader()
    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6)
          if (data === '[DONE]') continue

          try {
            const parsed = JSON.parse(data)
            if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
              await writer.write(encoder.encode(parsed.delta.text))
            }
          } catch {
            // skip malformed lines
          }
        }
      }
    } finally {
      await writer.close()
    }
  })()

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}

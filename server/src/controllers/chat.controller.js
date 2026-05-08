import { GoogleGenerativeAI } from '@google/generative-ai'

let cachedModel = null

const getModel = () => {
  if (cachedModel) return cachedModel
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY not set in .env')
  }
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  cachedModel = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash-lite',
    systemInstruction: SYSTEM_PROMPT,
  })
  return cachedModel
}

const SYSTEM_PROMPT = `You are AOS Assistant, a friendly chat assistant for Ashmif Office Solutions (AOSL), a Mombasa-based software studio.

ABOUT AOSL:
- Based in Mombasa, Kenya
- Builds custom software: web apps, mobile apps, websites, and backends
- Stack: React, Next.js, Laravel, Node.js, React Native, Flutter, Java, Python, PostgreSQL

OUR LIVE PRODUCTS:
1. SmartRealtors (properties.ashmif.com) — Property management. Automates rent collection, sends reminders, generates invoices, tracks vacant units and balances, produces disbursement reports. For landlords, agencies, property managers.

2. SmartFreight (consolidation.ashmif.com) — Logistics for freight consolidators. Manifest management, real-time shipment tracking, digital bills of lading, delivery orders, smart invoicing, reports & analytics.

3. Medisynq (medisynq.app) — Hospital management. Patient records (EMR), appointments, billing, pharmacy, lab/diagnostics, staff management.

4. FinSynq (finsynq.ashmif.com) — Microfinance, SACCO, chama platform. Member onboarding, loan management, savings tracking, repayments, compliance reports.

5. Clasynx (clasynx.ashmif.com) — School management. Student records, fee management, timetables, exams/grading, parent portal, staff payroll.

OUR SERVICES:
- Web applications (React, Next.js, Laravel, Node)
- Mobile apps (React Native, Flutter, Kotlin, Swift)
- Marketing websites (Next.js, Astro, WordPress)
- Backend & APIs (Node, Java, Python, PostgreSQL)

HOW WE WORK: Discovery → Design → Build (weekly demos) → Ship & Support.

GUIDELINES:
- Keep responses short and conversational. Usually 2–4 sentences.
- Use plain prose. No markdown headers, no bullet lists unless absolutely necessary.
- For project inquiries, direct people to the contact form at ashmif.com/contact.
- For job inquiries, direct people to ashmif.com/careers.
- Don't invent features. Be honest about what you don't know.
- Don't help with general coding or unrelated topics — politely redirect.
- Be warm. Use natural language.`

export const chat = async (req, res) => {
  try {
    const { messages } = req.body

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages array required' })
    }

    // Cap at last 20, ensure conversation starts with user (Gemini requires this)
    const recent = messages.slice(-20)
    const startIdx = recent.findIndex((m) => m.role === 'user')
    const trimmed = (startIdx >= 0 ? recent.slice(startIdx) : []).map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: String(m.content || '').slice(0, 2000) }],
    }))

    if (trimmed.length === 0) {
      return res.status(400).json({ error: 'No valid messages' })
    }

    // Last message is the prompt; rest is history
    const history = trimmed.slice(0, -1)
    const lastMessage = trimmed[trimmed.length - 1].parts[0].text

    const model = getModel()
    const chatSession = model.startChat({ history })
    const result = await chatSession.sendMessage(lastMessage)
    const reply = result.response.text().trim()

    res.json({ reply })
  } catch (err) {
    console.error('=== Chat error ===')
    console.error('Message:', err.message)
    console.error('Status:', err.status || err.statusCode || 'unknown')
    console.error('Full error:', err)
    res.status(500).json({
      error:
        'Sorry, I had trouble responding. Please try again or contact us directly.',
    })
  }
}

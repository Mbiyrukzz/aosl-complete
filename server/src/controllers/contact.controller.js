import { sendEmail } from '../services/email.service.js'
import {
  internalNotificationEmail,
  acknowledgementEmail,
} from '../services/email-templates.js'

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

export const submitContact = async (req, res) => {
  try {
    const { name, email, company, budget, message } = req.body

    // Validation
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return res.status(400).json({
        error: 'Name, email, and message are required',
      })
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid email address' })
    }

    if (name.length > 100 || message.length > 5000) {
      return res.status(400).json({ error: 'Input too long' })
    }

    // Honeypot — if a bot fills the hidden 'website' field, silently accept
    // (don't tell them they were caught) but don't actually send anything
    if (req.body.website) {
      return res.json({ success: true })
    }

    const payload = {
      name: name.trim(),
      email: email.trim(),
      company: company?.trim() || '',
      budget: budget?.trim() || '',
      message: message.trim(),
    }

    const toAddress = process.env.CONTACT_TO_EMAIL || process.env.GMAIL_USER

    // Send both emails in parallel
    const internal = internalNotificationEmail(payload)
    const ack = acknowledgementEmail(payload)

    await Promise.all([
      sendEmail({
        to: toAddress,
        subject: internal.subject,
        html: internal.html,
        text: internal.text,
        replyTo: payload.email, // ← so you can hit reply and respond directly
      }),
      sendEmail({
        to: payload.email,
        subject: ack.subject,
        html: ack.html,
        text: ack.text,
      }),
    ])

    res.json({ success: true })
  } catch (err) {
    console.error('Contact form error:', err)
    res.status(500).json({
      error: 'Failed to send message. Please email us directly.',
    })
  }
}

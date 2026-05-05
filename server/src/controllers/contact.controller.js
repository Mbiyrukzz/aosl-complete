import { sendEmail } from '../services/email.service.js'
import {
  internalNotificationEmail,
  acknowledgementEmail,
} from '../services/email-templates.js'

export const submitContact = async (req, res) => {
  try {
    const { name, email, phone, projectType, message, website } = req.body

    // Honeypot — bots fill hidden fields
    if (website && website.trim() !== '') {
      return res.status(200).json({ success: true }) // pretend success
    }

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return res
        .status(400)
        .json({ error: 'Name, email, and message are required' })
    }

    const payload = {
      name: name.trim(),
      email: email.trim(),
      phone: phone?.trim() || '',
      projectType: projectType?.trim() || '',
      message: message.trim(),
      submittedAt: new Date(),
    }

    // Respond immediately — don't make user wait for email
    res.status(200).json({ success: true })

    // Fire-and-forget emails (errors logged, never crash response)
    const toAddress = process.env.CONTACT_TO_EMAIL || process.env.GMAIL_USER

    if (!toAddress) {
      console.error('❌ CONTACT_TO_EMAIL/GMAIL_USER not set — skipping email')
      return
    }

    Promise.allSettled([
      sendEmail({
        to: toAddress,
        subject: `New contact from ${payload.name}`,
        html: internalNotificationEmail(payload),
        text: `${payload.name} <${payload.email}>\n\n${payload.message}`,
        replyTo: payload.email,
      }),
      sendEmail({
        to: payload.email,
        subject: `We received your message — Ashmif Office Solutions`,
        html: acknowledgementEmail(payload),
        text: `Hi ${payload.name},\n\nThanks for reaching out. We'll get back to you within 24 hours.\n\n— Ashmif Office Solutions`,
      }),
    ]).then((results) => {
      results.forEach((result, i) => {
        const label = i === 0 ? 'internal notification' : 'acknowledgement'
        if (result.status === 'rejected') {
          console.error(
            `❌ ${label} email failed:`,
            result.reason?.message || result.reason,
          )
        } else {
          console.log(`✓ ${label} email sent`)
        }
      })
    })
  } catch (err) {
    console.error('submitContact error:', err)
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to submit contact form' })
    }
  }
}

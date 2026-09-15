import nodemailer from 'nodemailer'

let cachedTransport = null

const getTransport = () => {
  if (cachedTransport) return cachedTransport

  const user = process.env.GMAIL_USER
  const pass = process.env.GMAIL_APP_PASSWORD

  if (!user || !pass) {
    throw new Error('GMAIL_USER and GMAIL_APP_PASSWORD must be set in .env')
  }

 cachedTransport = nodemailer.createTransport({
  host: 'mail.privateemail.com',
  port: 465,
  secure: true,
  auth: { user, pass },
})

  return cachedTransport
}

export const verifyEmail = async () => {
  try {
    const transport = getTransport()
    await transport.verify()
    console.log('✓ Email transport ready')
    return true
  } catch (err) {
    console.error('❌ Email transport failed:', err.message)
    console.error(
      '   Check: GMAIL_USER, GMAIL_APP_PASSWORD (no spaces), 2FA enabled',
    )
    return false
  }
}

export const sendEmail = async ({ to, subject, html, text, replyTo }) => {
  if (typeof html !== 'string' && html !== undefined) {
    throw new Error(
      `sendEmail: html must be a string, got ${typeof html} (${JSON.stringify(html).slice(0, 80)}...)`,
    )
  }
  if (typeof text !== 'string' && text !== undefined) {
    throw new Error(`sendEmail: text must be a string, got ${typeof text}`)
  }
  if (typeof subject !== 'string') {
    throw new Error(
      `sendEmail: subject must be a string, got ${typeof subject}`,
    )
  }

  const transport = getTransport()
  const from = `"Ashmif Office Solutions" <${process.env.GMAIL_USER}>`

  console.log(`📧 Attempting send: to=${to} from=${from}`)

  const info = await transport.sendMail({
    from,
    to,
    subject,
    html,
    text,
    ...(replyTo ? { replyTo } : {}),
  })

  console.log('📧 SMTP response:', {
    messageId: info.messageId,
    response: info.response,
    accepted: info.accepted,
    rejected: info.rejected,
  })

  return info
}

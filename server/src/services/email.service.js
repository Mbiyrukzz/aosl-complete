import nodemailer from 'nodemailer'

let transporter = null

const getTransporter = () => {
  if (transporter) return transporter

  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    throw new Error('GMAIL_USER and GMAIL_APP_PASSWORD must be set in .env')
  }

  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  })

  return transporter
}

export const sendEmail = async ({ to, subject, html, text, replyTo }) => {
  const t = getTransporter()
  const from = `"Ashmif Office Solutions" <${process.env.GMAIL_USER}>`

  return t.sendMail({
    from,
    to,
    subject,
    html,
    text,
    replyTo,
  })
}

// Verify connection on startup so we know early if creds are wrong
export const verifyEmail = async () => {
  try {
    const t = getTransporter()
    await t.verify()
    console.log('✓ Email transport ready')
    return true
  } catch (err) {
    console.error('❌ Email transport failed:', err.message)
    return false
  }
}

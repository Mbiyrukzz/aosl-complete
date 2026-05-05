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
    service: 'gmail',
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
  const transport = getTransport()
  const from = `"Ashmif Office Solutions" <${process.env.GMAIL_USER}>`

  const info = await transport.sendMail({
    from,
    to,
    subject,
    html,
    text,
    ...(replyTo ? { replyTo } : {}),
  })

  return info
}

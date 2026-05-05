export const internalNotificationEmail = ({
  name,
  email,
  company,
  budget,
  message,
}) => {
  const subject = `New contact form: ${name}${company ? ` (${company})` : ''}`

  const html = `
    <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #111;">
      <div style="border-bottom: 2px solid #0a0a0a; padding-bottom: 16px; margin-bottom: 24px;">
        <h1 style="margin: 0; font-size: 22px; letter-spacing: -0.02em;">New contact form submission</h1>
        <p style="margin: 6px 0 0; color: #6b7280; font-size: 14px;">Someone wants to start a project with you.</p>
      </div>

      <table style="width: 100%; font-size: 15px; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #6b7280; width: 110px;">From</td>
          <td style="padding: 8px 0; font-weight: 500;">${name}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280;">Email</td>
          <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #3b82f6;">${email}</a></td>
        </tr>
        ${
          company
            ? `
        <tr>
          <td style="padding: 8px 0; color: #6b7280;">Company</td>
          <td style="padding: 8px 0;">${company}</td>
        </tr>`
            : ''
        }
        ${
          budget
            ? `
        <tr>
          <td style="padding: 8px 0; color: #6b7280;">Budget</td>
          <td style="padding: 8px 0;">${budget}</td>
        </tr>`
            : ''
        }
      </table>

      <div style="margin-top: 24px; padding: 16px; background: #f9fafb; border-radius: 8px; border-left: 3px solid #3b82f6;">
        <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;">Message</div>
        <div style="white-space: pre-wrap; line-height: 1.6;">${escapeHtml(message)}</div>
      </div>

      <p style="margin-top: 24px; font-size: 13px; color: #6b7280;">
        Reply to this email to respond directly to ${name}.
      </p>
    </div>
  `

  const text = `
New contact form submission

From: ${name}
Email: ${email}
${company ? `Company: ${company}\n` : ''}${budget ? `Budget: ${budget}\n` : ''}
Message:
${message}

Reply to this email to respond directly.
  `.trim()

  return { subject, html, text }
}

export const acknowledgementEmail = ({ name }) => {
  const subject = `Thanks for reaching out — we'll be in touch`

  const html = `
    <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #111;">
      <h1 style="font-size: 24px; letter-spacing: -0.02em; margin: 0 0 12px;">
        Got it, ${escapeHtml(name)}.
      </h1>
      <p style="font-size: 16px; line-height: 1.6; color: #374151;">
        Thanks for reaching out to <strong>Ashmif Office Solutions</strong>.
        We've received your message and will get back to you within one
        business day.
      </p>

      <div style="margin: 28px 0; padding: 20px; background: #0a0a0a; color: #fff; border-radius: 8px;">
        <div style="font-size: 13px; opacity: 0.6; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;">
          What happens next
        </div>
        <ol style="margin: 0; padding-left: 20px; line-height: 1.7;">
          <li>One of our team will review your message</li>
          <li>We'll reply with questions or schedule a call</li>
          <li>Together we'll figure out if we're a fit</li>
        </ol>
      </div>

      <p style="font-size: 14px; color: #6b7280; margin: 0;">
        In the meantime, feel free to check our work or reply to this email
        directly with anything else you'd like us to know.
      </p>

      <p style="font-size: 14px; color: #6b7280; margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e7eb;">
        <strong style="color: #111;">Ashmif Office Solutions</strong><br>
        Nairobi, Kenya<br>
        <a href="mailto:hello@ashmif.solutions" style="color: #3b82f6;">hello@ashmif.solutions</a>
      </p>
    </div>
  `

  const text = `
Got it, ${name}.

Thanks for reaching out to Ashmif Office Solutions. We've received your
message and will get back to you within one business day.

What happens next:
1. One of our team will review your message
2. We'll reply with questions or schedule a call
3. Together we'll figure out if we're a fit

— Ashmif Office Solutions
hello@ashmif.solutions
  `.trim()

  return { subject, html, text }
}

// Tiny HTML escape so user input doesn't break the HTML email
const escapeHtml = (str = '') =>
  str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

export const escapeHtml = (str = '') =>
  String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')

const wrap = (innerHtml) => `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body style="margin:0;padding:24px;background:#f6f7f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#111827;">
    <table role="presentation" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;border:1px solid #e5e7eb;overflow:hidden;">
      <tr>
        <td style="padding:28px 32px;">
          ${innerHtml}
        </td>
      </tr>
      <tr>
        <td style="padding:18px 32px;background:#f9fafb;border-top:1px solid #e5e7eb;color:#6b7280;font-size:12px;">
          Ashmif Office Solutions &middot; Nairobi, Kenya
        </td>
      </tr>
    </table>
  </body>
</html>`

/**
 * Notification email sent to your team when someone submits the contact form.
 * MUST return a string (HTML body) — not an object.
 */
export const internalNotificationEmail = (payload) => {
  const name = escapeHtml(payload.name)
  const email = escapeHtml(payload.email)
  const phone = escapeHtml(payload.phone || '')
  const projectType = escapeHtml(payload.projectType || '')
  const message = escapeHtml(payload.message).replace(/\n/g, '<br/>')

  const inner = `
    <h2 style="margin:0 0 8px 0;font-size:18px;color:#111827;">New contact form submission</h2>
    <p style="margin:0 0 20px 0;color:#6b7280;font-size:14px;">From the AOSL website</p>

    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;font-size:14px;color:#111827;">
      <tr>
        <td style="padding:8px 0;color:#6b7280;width:120px;">Name</td>
        <td style="padding:8px 0;font-weight:600;">${name}</td>
      </tr>
      <tr>
        <td style="padding:8px 0;color:#6b7280;">Email</td>
        <td style="padding:8px 0;"><a href="mailto:${email}" style="color:#3b82f6;text-decoration:none;">${email}</a></td>
      </tr>
      ${phone ? `<tr><td style="padding:8px 0;color:#6b7280;">Phone</td><td style="padding:8px 0;">${phone}</td></tr>` : ''}
      ${projectType ? `<tr><td style="padding:8px 0;color:#6b7280;">Project type</td><td style="padding:8px 0;">${projectType}</td></tr>` : ''}
    </table>

    <div style="margin-top:24px;padding:16px;background:#f9fafb;border-radius:8px;border:1px solid #e5e7eb;">
      <div style="font-size:12px;color:#6b7280;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.05em;">Message</div>
      <div style="font-size:14px;line-height:1.6;color:#111827;">${message}</div>
    </div>

    <p style="margin:24px 0 0 0;color:#6b7280;font-size:13px;">
      Reply directly to this email to respond to ${name}.
    </p>
  `

  return wrap(inner)
}

/**
 * Acknowledgement email sent to the visitor confirming we received their message.
 * MUST return a string.
 */
export const acknowledgementEmail = (payload) => {
  const name = escapeHtml(payload.name)

  const inner = `
    <h2 style="margin:0 0 12px 0;font-size:20px;color:#111827;">Thanks, ${name}!</h2>
    <p style="margin:0 0 16px 0;font-size:15px;line-height:1.6;color:#374151;">
      We've received your message and one of us will get back to you within
      <strong>24 hours</strong>. If your project is urgent, you can also reach us
      on WhatsApp.
    </p>

    <p style="margin:0 0 24px 0;font-size:14px;color:#6b7280;line-height:1.6;">
      In the meantime, feel free to check out some of our recent work or learn
      more about how we approach projects.
    </p>

    <a href="https://ashmif.solutions"
       style="display:inline-block;padding:10px 18px;background:#111827;color:#ffffff;text-decoration:none;border-radius:8px;font-size:14px;font-weight:600;">
      Visit our site
    </a>

    <p style="margin:32px 0 0 0;font-size:13px;color:#6b7280;">
      &mdash; The Ashmif Office Solutions team
    </p>
  `

  return wrap(inner)
}

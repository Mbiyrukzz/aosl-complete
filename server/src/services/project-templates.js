const shell = (bodyHtml) => `
<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;color:#1a1a1a;max-width:600px;margin:0 auto;padding:20px">
  <div style="text-align:center;margin-bottom:24px">
    <h2 style="margin:0;color:#1a1a1a">ASHMIF OFFICE SOLUTIONS LTD</h2>
    <p style="margin:4px 0;color:#6b7280;font-size:13px">hello@ashmif.com · 0758-839-829 · www.ashmif.com</p>
  </div>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin-bottom:24px"/>
  ${bodyHtml}
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0"/>
  <p style="font-size:12px;color:#6b7280;text-align:center">Ashmif Office Solutions Ltd · P.O. Box · Mombasa, Kenya · www.ashmif.com</p>
</body></html>`

const actionButton = (actionUrl, actionLabel) =>
  actionUrl
    ? `<div style="text-align:center;margin:28px 0">
        <a href="${actionUrl}" style="background:#111827;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">${actionLabel || 'View project'}</a>
      </div>`
    : ''

export const projectCreatedEmail = ({
  name,
  projectTitle,
  companyName,
  message,
  actionUrl,
  actionLabel,
}) => shell(`
  <p>Dear ${name || 'there'},</p>
  <p>We're pleased to let you know that a new project has been started for <strong>${companyName || 'your company'}</strong>:</p>
  <p style="font-size:16px;font-weight:700;margin:16px 0">${projectTitle}</p>
  <p>${message}</p>
  ${actionButton(actionUrl, actionLabel)}
  <p style="font-size:13px;color:#6b7280">Log in to your client portal at any time to follow its progress.</p>
`)

export const projectStatusUpdateEmail = ({
  name,
  projectTitle,
  message,
  actionUrl,
  actionLabel,
}) => shell(`
  <p>Dear ${name || 'there'},</p>
  <p>There's an update on your project <strong>${projectTitle}</strong>:</p>
  <p>${message}</p>
  ${actionButton(actionUrl, actionLabel)}
`)

export const projectCommentEmail = ({
  name,
  projectTitle,
  message,
  actionUrl,
  actionLabel,
}) => shell(`
  <p>Dear ${name || 'there'},</p>
  <p>A new update has been posted on <strong>${projectTitle}</strong>:</p>
  <p style="background:#f3f4f6;padding:12px 16px;border-radius:8px">${message}</p>
  ${actionButton(actionUrl, actionLabel)}
`)
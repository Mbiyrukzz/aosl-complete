import { escapeHtml } from './email-templates.js'

const wrap = (innerHtml, accentColor = '#6366f1') => `<!DOCTYPE html>
<html><head><meta charset="utf-8"/></head>
<body style="margin:0;padding:24px;background:#f6f7f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#111827;">
  <table role="presentation" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;border:1px solid #e5e7eb;overflow:hidden;">
    <tr><td style="height:4px;background:${accentColor};"></td></tr>
    <tr><td style="padding:28px 32px;">${innerHtml}</td></tr>
    <tr><td style="padding:18px 32px;background:#f9fafb;border-top:1px solid #e5e7eb;color:#6b7280;font-size:12px;">
      Ashmif Office Solutions · Mombasa, Kenya
    </td></tr>
  </table>
</body></html>`

const ctaButton = (url, label, color = '#111827') => `
  <p style="margin:24px 0;">
    <a href="${escapeHtml(url)}" style="display:inline-block;padding:11px 22px;background:${color};color:#fff;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px;">
      ${escapeHtml(label || 'Open')}
    </a>
  </p>`

export const reminderEmail = ({
  name,
  title,
  message,
  actionUrl,
  actionLabel,
}) => {
  const inner = `
    <h2 style="margin:0 0 12px 0;font-size:20px;">${escapeHtml(title)}</h2>
    <p style="margin:0 0 8px 0;font-size:14px;color:#6b7280;">Hi ${escapeHtml(name)},</p>
    <p style="margin:0 0 8px 0;font-size:15px;line-height:1.6;color:#374151;white-space:pre-wrap;">${escapeHtml(message)}</p>
    ${actionUrl ? ctaButton(actionUrl, actionLabel) : ''}
    <p style="margin:24px 0 0 0;font-size:13px;color:#6b7280;">— The Ashmif team</p>
  `
  return wrap(inner)
}

export const invoiceReminderEmail = ({
  name,
  title,
  message,
  actionUrl,
  actionLabel,
}) => {
  const inner = `
    <div style="display:inline-block;padding:4px 10px;background:rgba(245,158,11,0.12);color:#d97706;border-radius:999px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:14px;">
      Invoice
    </div>
    <h2 style="margin:0 0 12px 0;font-size:20px;">${escapeHtml(title)}</h2>
    <p style="margin:0 0 8px 0;font-size:14px;color:#6b7280;">Hi ${escapeHtml(name)},</p>
    <p style="margin:0 0 8px 0;font-size:15px;line-height:1.6;color:#374151;white-space:pre-wrap;">${escapeHtml(message)}</p>
    ${actionUrl ? ctaButton(actionUrl, actionLabel || 'View invoice', '#d97706') : ''}
  `
  return wrap(inner, '#f59e0b')
}

export const packageExpiryEmail = ({
  name,
  title,
  message,
  actionUrl,
  actionLabel,
}) => {
  const inner = `
    <div style="display:inline-block;padding:4px 10px;background:rgba(99,102,241,0.12);color:#6366f1;border-radius:999px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:14px;">
      Package expiry
    </div>
    <h2 style="margin:0 0 12px 0;font-size:20px;">${escapeHtml(title)}</h2>
    <p style="margin:0 0 8px 0;font-size:14px;color:#6b7280;">Hi ${escapeHtml(name)},</p>
    <p style="margin:0 0 8px 0;font-size:15px;line-height:1.6;color:#374151;white-space:pre-wrap;">${escapeHtml(message)}</p>
    ${actionUrl ? ctaButton(actionUrl, actionLabel || 'Renew now') : ''}
  `
  return wrap(inner, '#6366f1')
}

export const domainRenewalEmail = ({
  name,
  title,
  message,
  actionUrl,
  actionLabel,
}) => {
  const inner = `
    <div style="display:inline-block;padding:4px 10px;background:rgba(239,68,68,0.12);color:#ef4444;border-radius:999px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:14px;">
      Domain renewal
    </div>
    <h2 style="margin:0 0 12px 0;font-size:20px;">${escapeHtml(title)}</h2>
    <p style="margin:0 0 8px 0;font-size:14px;color:#6b7280;">Hi ${escapeHtml(name)},</p>
    <p style="margin:0 0 8px 0;font-size:15px;line-height:1.6;color:#374151;white-space:pre-wrap;">${escapeHtml(message)}</p>
    ${actionUrl ? ctaButton(actionUrl, actionLabel || 'Renew domain', '#ef4444') : ''}
  `
  return wrap(inner, '#ef4444')
}

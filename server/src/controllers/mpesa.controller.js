import 'dotenv/config'
import { Payment } from '../models/Payment.js'
import { Site } from '../models/Site.js'

const DISPATCH_SECRET = process.env.MPESA_DISPATCH_SECRET

const extractPrefix = (accountNumber = '') =>
  accountNumber.split('-')[0].toUpperCase()

// Safaricom sends TransTime as "yyyyMMddHHmmss", e.g. "20260901143022"
const parseMpesaTimestamp = (raw) => {
  if (!raw || raw.length !== 14) return null
  const y = raw.slice(0, 4)
  const mo = raw.slice(4, 6)
  const d = raw.slice(6, 8)
  const h = raw.slice(8, 10)
  const mi = raw.slice(10, 12)
  const s = raw.slice(12, 14)
  return new Date(`${y}-${mo}-${d}T${h}:${mi}:${s}`)
}

async function forward(url, payload) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 5000)

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Dispatch-Secret': DISPATCH_SECRET,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })
    clearTimeout(timeout)

    const text = await res.text()
    if (!res.ok) {
      console.error(
        `[mpesa] Forward returned ${res.status}: ${text.slice(0, 300)}`,
      )
    }
    return JSON.parse(text)
  } catch (err) {
    clearTimeout(timeout)
    throw err
  }
}

// ── Validation ───────────────────────────────────────────────────────────
// Shared by every paybill this app dispatches for (ashmif SR/PR and the
// HQ/MLD paybill) — the route path Safaricom hits determines nothing about
// behaviour here, only the BillRefNumber prefix does.
export const mpesaValidation = async (req, res) => {
  const payload = req.body
  const prefix = extractPrefix(payload.BillRefNumber)
  const site = await Site.findOne({ prefix, active: true })

  if (!site) {
    console.error(
      `[mpesa] Unknown/inactive prefix "${prefix}" at validation`,
      payload,
    )
    return res.json({ ResultCode: 'C2B00012', ResultDesc: 'Rejected' })
  }

  if (site.type === 'local') {
    return res.json({ ResultCode: 0, ResultDesc: 'Accepted' })
  }

  try {
    const result = await forward(site.validationUrl, payload)
    return res.json(result)
  } catch (err) {
    console.error(
      `[mpesa] Validation forward to ${prefix} failed:`,
      err.message,
    )
    // Fail-open only for a genuine forwarding error, not an unknown prefix
    return res.json({ ResultCode: 0, ResultDesc: 'Accepted' })
  }
}

// ── Confirmation ─────────────────────────────────────────────────────────
export const mpesaConfirmation = async (req, res) => {
  const payload = req.body
  const prefix = extractPrefix(payload.BillRefNumber)
  const site = await Site.findOne({ prefix })

  const paymentRecord = {
    transId: payload.TransID,
    businessShortCode: payload.BusinessShortCode,
    billRefNumber: payload.BillRefNumber,
    amount: payload.TransAmount,
    msisdn: payload.MSISDN,
    firstName: payload.FirstName,
    transTime: payload.TransTime,
    transactionDate: parseMpesaTimestamp(payload.TransTime),
    site: prefix,
    rawPayload: payload,
  }

  if (!site || !site.active) {
    await Payment.create({
      ...paymentRecord,
      forwardStatus: 'unmatched',
    }).catch(() => {})
    console.error(`[mpesa] Unknown/inactive prefix "${prefix}"`, payload)
    return res.json({ ResultCode: 0, ResultDesc: 'Accepted' })
  }

  if (site.type === 'local') {
    await handleLocalPayment(payload, req.io)
    await Payment.create({ ...paymentRecord, forwardStatus: 'local' }).catch(
      () => {},
    )
    return res.json({ ResultCode: 0, ResultDesc: 'Accepted' })
  }

  let forwardStatus = 'forwarded'
  try {
    await forward(site.confirmationUrl, payload)
  } catch (err) {
    forwardStatus = 'failed'
    console.error(
      `[mpesa] Confirmation forward to ${prefix} failed:`,
      err.message,
    )
  }

  await Payment.create({
    ...paymentRecord,
    forwardedTo: site.confirmationUrl,
    forwardStatus,
  }).catch((err) =>
    console.error('[mpesa] Failed to save Payment record:', err.message),
  )

  return res.json({ ResultCode: 0, ResultDesc: 'Accepted' })
}

async function handleLocalPayment(payload, io) {
  if (io) io.to('staff').emit('mpesa:payment_received', payload)
}

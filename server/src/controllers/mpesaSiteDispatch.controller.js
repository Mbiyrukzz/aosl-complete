import 'dotenv/config'
import { Site } from '../models/Site.js'
import { Payment } from '../models/Payment.js'

const DISPATCH_SECRET = process.env.MPESA_DISPATCH_SECRET

const extractPrefix = (accountNumber = '') =>
  accountNumber.split('-')[0].toUpperCase()

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
        `[sites] Forward returned ${res.status}: ${text.slice(0, 300)}`,
      )
    }
    return JSON.parse(text)
  } catch (err) {
    clearTimeout(timeout)
    throw err
  }
}

export const siteValidation = async (req, res) => {
  const payload = req.body
  const prefix = extractPrefix(payload.BillRefNumber)
  const site = await Site.findOne({ prefix, active: true })

  if (!site) {
    console.error(
      `[sites] Unknown/inactive prefix "${prefix}" at validation`,
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
      `[sites] Validation forward to ${prefix} failed:`,
      err.message,
    )
    return res.json({ ResultCode: 0, ResultDesc: 'Accepted' }) // fail-open only for forwarding errors
  }
}

export const siteConfirmation = async (req, res) => {
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
    site: prefix,
    rawPayload: payload,
  }

  if (!site || !site.active) {
    await Payment.create({
      ...paymentRecord,
      forwardStatus: 'unmatched',
    }).catch(() => {})
    console.error(`[sites] Unknown/inactive prefix "${prefix}"`, payload)
    return res.json({ ResultCode: 0, ResultDesc: 'Accepted' })
  }

  if (site.type === 'local') {
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
      `[sites] Confirmation forward to ${prefix} failed:`,
      err.message,
    )
  }

  await Payment.create({
    ...paymentRecord,
    forwardedTo: site.confirmationUrl,
    forwardStatus,
  }).catch((err) =>
    console.error('[sites] Failed to save Payment:', err.message),
  )

  return res.json({ ResultCode: 0, ResultDesc: 'Accepted' })
}

import 'dotenv/config'

const TALKSASA_ENDPOINT = 'https://sms.ashmif.com/api/v3/sms/send'
const TALKSASA_API_TOKEN = process.env.TALKSASA_API_TOKEN
// Alphanumeric sender ID, max 11 chars — the registered name recipients see
// as the sender, e.g. "ASHMIF"
const TALKSASA_SENDER_ID = process.env.TALKSASA_SENDER_ID

/**
 * Send a plain-text SMS via Talksasa.
 * @param {string} recipient - MSISDN, e.g. "254712345678". Comma-separate for multiple.
 * @param {string} message
 */
export async function sendSms(recipient, message) {
  if (!TALKSASA_API_TOKEN || !TALKSASA_SENDER_ID) {
    console.error(
      '[sms] TALKSASA_API_TOKEN / TALKSASA_SENDER_ID not configured — skipping SMS',
    )
    return null
  }

  try {
    const res = await fetch(TALKSASA_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${TALKSASA_API_TOKEN}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        recipient,
        sender_id: TALKSASA_SENDER_ID,
        type: 'plain',
        message,
      }),
    })

    const data = await res.json()
    if (data.status !== 'success') {
      console.error('[sms] Talksasa send failed:', data.message)
    }
    return data
  } catch (err) {
    console.error('[sms] Talksasa request error:', err.message)
    return null
  }
}

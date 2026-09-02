import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const BASE_URL =
  process.env.MPESA_ENV === 'production'
    ? 'https://api.safaricom.co.ke'
    : 'https://sandbox.safaricom.co.ke'

async function getDarajaAccessToken() {
  console.log('KEY:', process.env.MPESA_CONSUMER_KEY)
  console.log('SECRET:', process.env.MPESA_CONSUMER_SECRET)
  const credentials = Buffer.from(
    `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`,
  ).toString('base64')

  const res = await fetch(
    `${BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
    {
      headers: { Authorization: `Basic ${credentials}` },
    },
  )

  const body = await res.text()

  if (!res.ok) {
    console.error(`Daraja OAuth error ${res.status}:`, body)
    throw new Error(`Failed to get Daraja token: ${res.status}`)
  }

  const data = JSON.parse(body)
  return data.access_token
}

async function registerUrls() {
  const token = await getDarajaAccessToken()

  const res = await fetch(`${BASE_URL}/mpesa/c2b/v1/registerurl`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ShortCode: process.env.MPESA_SHORTCODE,
      ResponseType: 'Completed',
      ConfirmationURL: process.env.MPESA_CONFIRMATION_URL,
      ValidationURL: process.env.MPESA_VALIDATION_URL,
    }),
  })

  const data = await res.json()
  console.log('RegisterURL response:', data)
}

registerUrls().catch((err) => {
  console.error('Failed to register URLs:', err)
  process.exit(1)
})

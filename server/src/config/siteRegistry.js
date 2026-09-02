const required = [
  'MPESA_SITE_SR_VALIDATION_URL',
  'MPESA_SITE_SR_CONFIRMATION_URL',
  'MPESA_SITE_PR_VALIDATION_URL',
  'MPESA_SITE_PR_CONFIRMATION_URL',
  'MPESA_DISPATCH_SECRET',
]
const missing = required.filter((key) => !process.env[key])
if (missing.length)
  console.error(`❌ Missing required env vars: ${missing.join(', ')}`)

export const siteRegistry = {
  SR: {
    type: 'external',
    validationUrl: process.env.MPESA_SITE_SR_VALIDATION_URL,
    confirmationUrl: process.env.MPESA_SITE_SR_CONFIRMATION_URL,
  },
  PR: {
    type: 'external',
    validationUrl: process.env.MPESA_SITE_PR_VALIDATION_URL,
    confirmationUrl: process.env.MPESA_SITE_PR_CONFIRMATION_URL,
  },
  AOSL: { type: 'local' },
}

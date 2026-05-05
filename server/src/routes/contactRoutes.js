import { rateLimit } from '../middleware/rateLimit.js'
import { submitContact } from '../controllers/contact.controller.js'

export const submitContactRoute = {
  path: '/contact',
  method: 'post',
  middleware: [
    // Public route — no auth needed. Rate limit to prevent spam.
    rateLimit({ windowMs: 10 * 60_000, max: 3 }), // 3 per 10 minutes per IP
  ],
  handler: submitContact,
}

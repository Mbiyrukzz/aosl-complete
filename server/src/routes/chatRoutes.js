import { chat } from '../controllers/chat.controller.js'
import { rateLimit } from '../middleware/rateLimit.js'

export const chatRoute = {
  path: '/chat',
  method: 'post',
  middleware: [rateLimit({ windowMs: 60_000, max: 20 })], // 20 msgs/min per IP
  handler: chat,
}

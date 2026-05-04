import { verifyFirebaseToken } from '../middleware/verifyFirebaseToken.js'
import { getMe } from '../controllers/auth.controller.js'

const meRoute = {
  path: '/auth/me',
  method: 'get',
  middleware: [verifyFirebaseToken],
  handler: getMe,
}

export { meRoute }

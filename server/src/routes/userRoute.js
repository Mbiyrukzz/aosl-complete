import { verifyFirebaseToken } from '../middleware/verifyFirebaseToken.js'

const profileRoute = {
  path: '/users/profile',
  method: 'get',
  middleware: [verifyFirebaseToken],
  handler: (req, res) => {
    res.json({ message: 'profile route', user: req.user })
  },
}

export { profileRoute }

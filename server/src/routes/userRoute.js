import { verifyFirebaseToken } from '../middleware/verifyFirebaseToken.js'
import { isStaff } from '../middleware/isStaff.js'
import { listStaff } from '../controllers/users.controller.js'

export const profileRoute = {
  path: '/users/profile',
  method: 'get',
  middleware: [verifyFirebaseToken],
  handler: (req, res) => {
    res.json({ message: 'profile route', user: req.user })
  },
}

export const listStaffRoute = {
  path: '/users/staff',
  method: 'get',
  middleware: [verifyFirebaseToken, isStaff],
  handler: listStaff,
}

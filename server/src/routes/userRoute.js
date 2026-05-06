import { isStaff } from '../middleware/isStaff.js'
import {
  listStaff,
  createClient,
  listAllUsers,
  updateUserRole,
} from '../controllers/users.controller.js'

import { verifyFirebaseToken } from '../middleware/verifyFirebaseToken.js'
import { isAdmin } from '../middleware/isAdmin.js'

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

export const createClientRoute = {
  path: '/admin/clients',
  method: 'post',
  middleware: [verifyFirebaseToken, isAdmin],
  handler: createClient,
}

export const listAllUsersRoute = {
  path: '/admin/clients',
  method: 'get',
  middleware: [verifyFirebaseToken, isAdmin],
  handler: listAllUsers,
}

export const updateUserRoleRoute = {
  path: '/admin/clients/:id/role',
  method: 'patch',
  middleware: [verifyFirebaseToken, isAdmin],
  handler: updateUserRole,
}

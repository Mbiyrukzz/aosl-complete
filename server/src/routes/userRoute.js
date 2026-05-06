import { isStaff } from '../middleware/isStaff.js'
import {
  listStaff,
  createClient,
  listAllUsers,
  updateUserRole,
  getMyProfile,
  updateMyProfile,
  uploadAvatar,
  syncEmail,
} from '../controllers/users.controller.js'
import { verifyFirebaseToken } from '../middleware/verifyFirebaseToken.js'
import { isAdmin } from '../middleware/isAdmin.js'
import { avatarUpload } from '../middleware/upload.js'

export const profileRoute = {
  path: '/users/me',
  method: 'get',
  middleware: [verifyFirebaseToken],
  handler: getMyProfile,
}

export const updateProfileRoute = {
  path: '/users/me',
  method: 'patch',
  middleware: [verifyFirebaseToken],
  handler: updateMyProfile,
}

export const uploadAvatarRoute = {
  path: '/users/me/avatar',
  method: 'post',
  middleware: [verifyFirebaseToken, avatarUpload.single('avatar')],
  handler: uploadAvatar,
}

export const syncEmailRoute = {
  path: '/users/me/sync-email',
  method: 'post',
  middleware: [verifyFirebaseToken],
  handler: syncEmail,
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

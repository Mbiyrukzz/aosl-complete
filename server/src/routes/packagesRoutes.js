import { verifyFirebaseToken } from '../middleware/verifyFirebaseToken.js'
import { isAdmin } from '../middleware/isAdmin.js'
import {
  createPackage,
  listPackages,
  updatePackage,
  deletePackage,
  listMyPackages,
  getPackage,
  getMyPackage,
} from '../controllers/packages.controller.js'

export const createPackageRoute = {
  path: '/admin/packages',
  method: 'post',
  middleware: [verifyFirebaseToken, isAdmin],
  handler: createPackage,
}
export const listPackagesRoute = {
  path: '/admin/packages',
  method: 'get',
  middleware: [verifyFirebaseToken, isAdmin],
  handler: listPackages,
}
export const updatePackageRoute = {
  path: '/admin/packages/:id',
  method: 'patch',
  middleware: [verifyFirebaseToken, isAdmin],
  handler: updatePackage,
}
export const deletePackageRoute = {
  path: '/admin/packages/:id',
  method: 'delete',
  middleware: [verifyFirebaseToken, isAdmin],
  handler: deletePackage,
}
export const myPackagesRoute = {
  path: '/me/packages',
  method: 'get',
  middleware: [verifyFirebaseToken],
  handler: listMyPackages,
}

export const getPackageRoute = {
  path: '/admin/packages/:id',
  method: 'get',
  middleware: [verifyFirebaseToken, isAdmin],
  handler: getPackage,
}

export const myPackageDetailRoute = {
  path: '/me/packages/:id',
  method: 'get',
  middleware: [verifyFirebaseToken],
  handler: getMyPackage,
}

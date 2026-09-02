import { verifyFirebaseToken } from '../middleware/verifyFirebaseToken.js'
import { isStaff } from '../middleware/isStaff.js'
import { isAdmin } from '../middleware/isAdmin.js'
import {
  listSites,
  getSite,
  createSite,
  updateSite,
  deleteSite,
} from '../controllers/sites.controller.js'

export const listSitesRoute = {
  path: '/admin/sites',
  method: 'get',
  middleware: [verifyFirebaseToken, isStaff], // staff can view, only admin can mutate
  handler: listSites,
}

export const getSiteRoute = {
  path: '/admin/sites/:id',
  method: 'get',
  middleware: [verifyFirebaseToken, isStaff],
  handler: getSite,
}

export const createSiteRoute = {
  path: '/admin/sites',
  method: 'post',
  middleware: [verifyFirebaseToken, isAdmin],
  handler: createSite,
}

export const updateSiteRoute = {
  path: '/admin/sites/:id',
  method: 'patch',
  middleware: [verifyFirebaseToken, isAdmin],
  handler: updateSite,
}

export const deleteSiteRoute = {
  path: '/admin/sites/:id',
  method: 'delete',
  middleware: [verifyFirebaseToken, isAdmin],
  handler: deleteSite,
}

import { verifyFirebaseToken } from '../middleware/verifyFirebaseToken.js'
import { isAdmin } from '../middleware/isAdmin.js'
import { isStaff } from '../middleware/isStaff.js'
import {
  createCompany,
  listCompanies,
  getCompany,
  updateCompany,
  deleteCompany,
  getMyCompany,
} from '../controllers/companies.controller.js'

export const createCompanyRoute = {
  path: '/admin/companies',
  method: 'post',
  middleware: [verifyFirebaseToken, isAdmin],
  handler: createCompany,
}

export const listCompaniesRoute = {
  path: '/admin/companies',
  method: 'get',
  middleware: [verifyFirebaseToken, isStaff], // staff can read
  handler: listCompanies,
}

export const getMyCompanyRoute = {
  path: '/companies/mine',
  method: 'get',
  middleware: [verifyFirebaseToken],
  handler: getMyCompany,
}

export const getCompanyRoute = {
  path: '/admin/companies/:id',
  method: 'get',
  middleware: [verifyFirebaseToken, isStaff],
  handler: getCompany,
}

export const updateCompanyRoute = {
  path: '/admin/companies/:id',
  method: 'patch',
  middleware: [verifyFirebaseToken, isAdmin],
  handler: updateCompany,
}

export const deleteCompanyRoute = {
  path: '/admin/companies/:id',
  method: 'delete',
  middleware: [verifyFirebaseToken, isAdmin],
  handler: deleteCompany,
}

import { verifyFirebaseToken } from '../middleware/verifyFirebaseToken.js'
import { isStaff } from '../middleware/isStaff.js'
import {
  listPayments,
  getPayment,
} from '../controllers/adminPayments.controller.js'

export const adminListPaymentsRoute = {
  path: '/admin/payments',
  method: 'get',
  middleware: [verifyFirebaseToken, isStaff],
  handler: listPayments,
}

export const adminGetPaymentRoute = {
  path: '/admin/payments/:id',
  method: 'get',
  middleware: [verifyFirebaseToken, isStaff],
  handler: getPayment,
}

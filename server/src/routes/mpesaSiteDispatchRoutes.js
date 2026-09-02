// routes/mpesaSiteDispatch.routes.js
import {
  siteValidation,
  siteConfirmation,
} from '../controllers/mpesaSiteDispatch.controller.js'

// Public — Safaricom calls these directly. Mounted under /api  existing convention,
// so the URLs you register with Daraja for the HQ/MLD paybill are:
//   {ngrok}/api/payments/sites/validation
//   {ngrok}/api/payments/sites/confirmation
export const siteValidationRoute = {
  path: '/payments/sites/validation',
  method: 'post',
  middleware: [],
  handler: siteValidation,
}

export const siteConfirmationRoute = {
  path: '/payments/sites/confirmation',
  method: 'post',
  middleware: [],
  handler: siteConfirmation,
}

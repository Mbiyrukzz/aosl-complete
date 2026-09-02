import {
  mpesaValidation,
  mpesaConfirmation,
} from '../controllers/mpesa.controller.js'

// ── ashmif paybill (SR / PR) ────────────────────────────────────────────
// Registered with Daraja as:
//   https://ashmif.com/api/payments/validation
//   https://ashmif.com/api/payments/confirmation
export const paymentsValidationRoute = {
  path: '/payments/validation',
  method: 'post',
  middleware: [],
  handler: mpesaValidation,
}

export const paymentsConfirmationRoute = {
  path: '/payments/confirmation',
  method: 'post',
  middleware: [],
  handler: mpesaConfirmation,
}

// ── HQ / MLD paybill ─────────────────────────────────────────────────────
// A distinct paybill/shortcode, registered separately with Daraja as:
//   https://ashmif.com/api/payments/sites/validation
//   https://ashmif.com/api/payments/sites/confirmation
// Same handler — the BillRefNumber prefix (HQ vs MLD) is resolved against
// the Site collection inside mpesaValidation/mpesaConfirmation, not by
// which route was hit.
export const paymentsSitesValidationRoute = {
  path: '/payments/sites/validation',
  method: 'post',
  middleware: [],
  handler: mpesaValidation,
}

export const paymentsSitesConfirmationRoute = {
  path: '/payments/sites/confirmation',
  method: 'post',
  middleware: [],
  handler: mpesaConfirmation,
}

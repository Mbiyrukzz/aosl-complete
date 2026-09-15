import { verifyFirebaseToken } from '../middleware/verifyFirebaseToken.js'
import { isStaff } from '../middleware/isStaff.js'
import { isAdmin } from '../middleware/isAdmin.js'
import { invoiceUpload } from '../middleware/upload.js' // ✅ use PDF-specific uploader
import {
  listQuotations,
  getQuotation,
  createQuotation,
  updateQuotation,
  deleteQuotation,
  sendQuotation,
  convertQuotation,
  listInvoices,
  getInvoice,
  createInvoice,
  updateInvoice,
  uploadInvoicePDF,
  sendInvoice,
  getAccountsStats,
  listMyInvoices,
  storeInvoicePDF,
  markInvoicePaid,
  getInvoiceReceipt,
  getReceipt,
  storeReceiptPDF,
} from '../controllers/accounts.controller.js'

/* ── Quotations ────────────────────────────────────────────── */

export const listQuotationsRoute = {
  path: '/accounts/quotations',
  method: 'get',
  middleware: [verifyFirebaseToken, isStaff],
  handler: listQuotations,
}

export const getQuotationRoute = {
  path: '/accounts/quotations/:id',
  method: 'get',
  middleware: [verifyFirebaseToken, isStaff],
  handler: getQuotation,
}

export const createQuotationRoute = {
  path: '/accounts/quotations',
  method: 'post',
  middleware: [verifyFirebaseToken, isStaff],
  handler: createQuotation,
}

export const updateQuotationRoute = {
  path: '/accounts/quotations/:id',
  method: 'patch',
  middleware: [verifyFirebaseToken, isStaff],
  handler: updateQuotation,
}

export const deleteQuotationRoute = {
  path: '/accounts/quotations/:id',
  method: 'delete',
  middleware: [verifyFirebaseToken, isAdmin],
  handler: deleteQuotation,
}

export const sendQuotationRoute = {
  path: '/accounts/quotations/:id/send',
  method: 'post',
  middleware: [verifyFirebaseToken, isStaff],
  handler: sendQuotation,
}

export const convertQuotationRoute = {
  path: '/accounts/quotations/:id/convert',
  method: 'post',
  middleware: [verifyFirebaseToken, isStaff],
  handler: convertQuotation,
}

/* ── Invoices ──────────────────────────────────────────────── */

export const listInvoicesRoute = {
  path: '/accounts/invoices',
  method: 'get',
  middleware: [verifyFirebaseToken, isStaff],
  handler: listInvoices,
}

export const getInvoiceRoute = {
  path: '/accounts/invoices/:id',
  method: 'get',
  middleware: [verifyFirebaseToken, isStaff],
  handler: getInvoice,
}

export const createInvoiceRoute = {
  path: '/accounts/invoices',
  method: 'post',
  middleware: [verifyFirebaseToken, isStaff],
  handler: createInvoice,
}

export const updateInvoiceRoute = {
  path: '/accounts/invoices/:id',
  method: 'patch',
  middleware: [verifyFirebaseToken, isStaff],
  handler: updateInvoice,
}


export const uploadInvoicePDFRoute = {
  path: '/accounts/invoices/upload',
  method: 'post',
  middleware: [
    verifyFirebaseToken,
    isStaff,
    invoiceUpload.single('invoice'), // ✅ PDF-only multer instance
  ],
  handler: uploadInvoicePDF,
}

export const sendInvoiceRoute = {
  path: '/accounts/invoices/:id/send',
  method: 'post',
  middleware: [verifyFirebaseToken, isStaff],
  handler: sendInvoice,
}

/* ── Stats ─────────────────────────────────────────────────── */

export const accountsStatsRoute = {
  path: '/accounts/stats',
  method: 'get',
  middleware: [verifyFirebaseToken, isStaff],
  handler: getAccountsStats,
}


export const myInvoicesRoute = {
  path: '/me/invoices',
  method: 'get',
  middleware: [verifyFirebaseToken],
  handler: listMyInvoices,
}

export const storeInvoicePdfRoute = {
  path: '/accounts/invoices/:id/store-pdf',
  method: 'post',
  middleware: [verifyFirebaseToken, isStaff],
  handler: storeInvoicePDF,
}

export const   markInvoicePaidRoute = {
  path: '/accounts/invoices/:id/mark-paid',
  method: 'post',
  middleware: [verifyFirebaseToken, isStaff],
  handler: markInvoicePaid,
}

export const getInvoiceReceiptRoute = {
  path: '/accounts/invoices/:id/receipt',
  method: 'get',
  middleware: [verifyFirebaseToken, isStaff],
  handler: getInvoiceReceipt,
}

export const getReceiptRoute = {
  path: '/accounts/invoices/:id/receipt',
  method: 'get',
  middleware: [verifyFirebaseToken, isStaff],
  handler: getReceipt,
}

export const storeReceiptPDFRoute = {
  path: '/accounts/receipts/:id/store-pdf',
  method: 'post',
  middleware: [verifyFirebaseToken, isStaff],
  handler: storeReceiptPDF,
}
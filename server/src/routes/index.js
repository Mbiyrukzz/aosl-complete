import { healthRoute } from './healthRoute.js'
import { meRoute } from './authRoutes.js'
import {
  createClientRoute,
  getClientDetailRoute,
  listAllUsersRoute,
  listStaffRoute,
  listClientsRoute,
  profileRoute,
  syncEmailRoute,
  updateProfileRoute,
  updateUserRoleRoute,
  uploadAvatarRoute,
} from './userRoute.js'
import {
  listIssuesRoute,
  listAllIssuesRoute,
  getIssueRoute,
  createIssueRoute,
  updateIssueStatusRoute,
  assignIssueRoute,
  addCommentRoute,
  shareIssueRoute,
  editCommentRoute,
  deleteCommentRoute,
  deleteIssueRoute,
} from './issuesRoutes.js'
import {
  listNotificationsRoute,
  markAllNotificationsReadRoute,
  markNotificationReadRoute,
} from './notificationRoutes.js'
import { submitContactRoute } from './contactRoutes.js'
import {
  createJobRoute,
  deleteApplicationRoute,
  deleteJobRoute,
  getJobRoute,
  listAllJobsRoute,
  listApplicationsRoute,
  listOpenJobsRoute,
  submitApplicationRoute,
  updateApplicationStatusRoute,
  updateJobRoute,
} from './jobsRoutes.js'
import { chatRoute } from './chatRoutes.js'
import {
  createReminderRoute,
  deleteReminderRoute,
  listRemindersRoute,
  markAllReadRoute,
  myNotificationsRoute,
  myRemindersRoute,
  updateReminderRoute,
} from './remindersRoutes.js'
import {
  createPackageRoute,
  deletePackageRoute,
  getPackageRoute,
  listPackagesRoute,
  myPackageDetailRoute,
  myPackagesRoute,
  updatePackageRoute,
} from './packagesRoutes.js'
import {
  deleteCompanyRoute,
  createCompanyRoute,
  getCompanyRoute,
  listCompaniesRoute,
  updateCompanyRoute,
  getMyCompanyRoute,
} from './companiesRoutes.js'
import {
  accountsStatsRoute,
  convertQuotationRoute,
  createInvoiceRoute,
  createQuotationRoute,
  deleteQuotationRoute,
  getInvoiceRoute,
  getQuotationRoute,
  listInvoicesRoute,
  listQuotationsRoute,
  sendInvoiceRoute,
  sendQuotationRoute,
  updateInvoiceRoute,
  updateQuotationRoute,
  uploadInvoicePDFRoute,
  myInvoicesRoute,
  storeInvoicePdfRoute,
  markInvoicePaidRoute,
  getInvoiceReceiptRoute,
  getReceiptRoute,
  storeReceiptPDFRoute,
  unmarkInvoicePaidRoute,
} from './Accountsroutes.js'
import {
  paymentsConfirmationRoute,
  paymentsSitesConfirmationRoute,
  paymentsSitesValidationRoute,
  paymentsValidationRoute,
} from './paymentsRoutes.js'
import {
  createSiteRoute,
  deleteSiteRoute,
  getSiteRoute,
  listSitesRoute,
  updateSiteRoute,
} from './sitesRoutes.js'
import {
  adminGetPaymentRoute,
  adminListPaymentsRoute,
} from './adminPaymentsRoutes.js'
import { addProjectUpdateRoute, createProjectRoute, deleteProjectRoute, getProjectRoute, listProjectsRoute, myProjectDetailRoute, myProjectsRoute, updateProjectRoute } from './projectsRoutes.js'


const routes = [
  healthRoute,

  meRoute,
  profileRoute,
  updateProfileRoute,
  uploadAvatarRoute,
  syncEmailRoute,
  listStaffRoute,
  listClientsRoute,
  createClientRoute,
  getClientDetailRoute,
  listAllUsersRoute,
  updateUserRoleRoute,

  createCompanyRoute,
  listCompaniesRoute,
  getCompanyRoute,
  getMyCompanyRoute,
  updateCompanyRoute,
  deleteCompanyRoute,

  listIssuesRoute,
  listAllIssuesRoute,
  getIssueRoute,
  createIssueRoute,
  updateIssueStatusRoute,
  deleteIssueRoute,
  assignIssueRoute,
  addCommentRoute,
  editCommentRoute,
  deleteCommentRoute,
  shareIssueRoute,

  listNotificationsRoute,
  markNotificationReadRoute,
  markAllNotificationsReadRoute,

  submitContactRoute,

  listOpenJobsRoute,
  getJobRoute,
  submitApplicationRoute,
  listAllJobsRoute,
  createJobRoute,
  updateJobRoute,
  deleteJobRoute,

  listApplicationsRoute,
  updateApplicationStatusRoute,
  deleteApplicationRoute,

  chatRoute,

  createReminderRoute,
  listRemindersRoute,
  updateReminderRoute,
  deleteReminderRoute,
  myRemindersRoute,

  myNotificationsRoute,
  markNotificationReadRoute,
  markAllReadRoute,

  createPackageRoute,
  listPackagesRoute,
  updatePackageRoute,
  deletePackageRoute,
  myPackagesRoute,
  getPackageRoute,
  myPackageDetailRoute,

  accountsStatsRoute,
  listQuotationsRoute,
  getQuotationRoute,
  createQuotationRoute,
  updateQuotationRoute,
  deleteQuotationRoute,
  sendQuotationRoute,
  convertQuotationRoute,
  listInvoicesRoute,
  createInvoiceRoute,
  uploadInvoicePDFRoute,
  getInvoiceRoute,
  updateInvoiceRoute,
  sendInvoiceRoute,
  myInvoicesRoute,
  storeInvoicePdfRoute,
  markInvoicePaidRoute,
  getInvoiceReceiptRoute,
  getReceiptRoute,
  storeReceiptPDFRoute,
  unmarkInvoicePaidRoute,

  paymentsValidationRoute,
  paymentsConfirmationRoute,
  paymentsSitesValidationRoute,
  paymentsSitesConfirmationRoute,

    createProjectRoute,
  listProjectsRoute,
  getProjectRoute,
  updateProjectRoute,
  addProjectUpdateRoute,
  deleteProjectRoute,
  myProjectsRoute,
  myProjectDetailRoute,

  listSitesRoute,
  getSiteRoute,
  createSiteRoute,
  updateSiteRoute,
  deleteSiteRoute,

  adminListPaymentsRoute,
  adminGetPaymentRoute,
]

export default routes

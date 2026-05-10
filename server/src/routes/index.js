import { healthRoute } from './healthRoute.js'
import { meRoute } from './authRoutes.js'
import {
  createClientRoute,
  listAllUsersRoute,
  listStaffRoute,
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
  listPackagesRoute,
  myPackagesRoute,
  updatePackageRoute,
} from './packagesRoutes.js'
import {
  deleteCompanyRoute,
  createCompanyRoute,
  getCompanyRoute,
  listCompaniesRoute,
  updateCompanyRoute,
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
} from './Accountsroutes.js'

const routes = [
  healthRoute,

  meRoute,
  profileRoute,
  updateProfileRoute,
  uploadAvatarRoute,
  syncEmailRoute,
  listStaffRoute,
  createClientRoute,
  listAllUsersRoute,
  updateUserRoleRoute,

  createCompanyRoute,
  listCompaniesRoute,
  getCompanyRoute,
  updateCompanyRoute,
  deleteCompanyRoute,

  listIssuesRoute,
  listAllIssuesRoute,
  getIssueRoute,
  createIssueRoute,
  updateIssueStatusRoute,
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

  listQuotationsRoute,
  getQuotationRoute,
  createQuotationRoute,
  updateQuotationRoute,
  deleteQuotationRoute,
  sendQuotationRoute,

  convertQuotationRoute,
  listInvoicesRoute,
  getInvoiceRoute,
  createInvoiceRoute,
  updateInvoiceRoute,
  uploadInvoicePDFRoute,
  sendInvoiceRoute,
  accountsStatsRoute,
]

export default routes

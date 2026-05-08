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
  getIssueRoute,
  createIssueRoute,
  updateIssueStatusRoute,
  assignIssueRoute,
  addCommentRoute,
  shareIssueRoute,
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
import { deleteApplication } from '../controllers/applications.controller.js'
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

  listIssuesRoute,
  getIssueRoute,
  createIssueRoute,
  updateIssueStatusRoute,
  assignIssueRoute,
  addCommentRoute,

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
]

export default routes

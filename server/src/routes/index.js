import { healthRoute } from './healthRoute.js'
import { meRoute } from './authRoutes.js'
import {
  createClientRoute,
  listAllUsersRoute,
  listStaffRoute,
  profileRoute,
  updateUserRoleRoute,
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

const routes = [
  healthRoute,
  meRoute,
  profileRoute,
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
]

export default routes

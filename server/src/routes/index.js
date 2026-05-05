import { healthRoute } from './healthRoute.js'
import { meRoute } from './authRoutes.js'
import { listStaffRoute, profileRoute } from './userRoute.js'
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
  deleteJobRoute,
  getJobRoute,
  listAllJobsRoute,
  listApplicationsRoute,
  listOpenJobsRoute,
  submitApplicationRoute,
  updateApplicationStatusRoute,
  updateJobRoute,
} from './jobsRoutes.js'

const routes = [
  healthRoute,
  meRoute,
  profileRoute,
  listStaffRoute,
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
]

export default routes

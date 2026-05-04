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
]

export default routes

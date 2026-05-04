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
} from './issuesRoutes.js'

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
]

export default routes

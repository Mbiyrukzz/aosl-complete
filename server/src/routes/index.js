import { healthRoute } from './healthRoute.js'
import { meRoute } from './authRoutes.js'
import { profileRoute } from './userRoute.js'
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
  listIssuesRoute,
  getIssueRoute,
  createIssueRoute,
  updateIssueStatusRoute,
  assignIssueRoute,
  addCommentRoute,
]

export default routes

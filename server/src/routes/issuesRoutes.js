import { verifyFirebaseToken } from '../middleware/verifyFirebaseToken.js'
import { isStaff } from '../middleware/isStaff.js'
import {
  listIssues,
  listAllIssues,
  getIssue,
  createIssue,
  updateIssueStatus,
  assignIssue,
  addComment,
  shareIssue,
} from '../controllers/issues.controller.js'
import { upload } from '../middleware/upload.js'

export const listIssuesRoute = {
  path: '/issues',
  method: 'get',
  middleware: [verifyFirebaseToken],
  handler: listIssues,
}

// Admin-only: tier-sorted aggregation with company populated
export const listAllIssuesRoute = {
  path: '/admin/issues',
  method: 'get',
  middleware: [verifyFirebaseToken, isStaff],
  handler: listAllIssues,
}

export const getIssueRoute = {
  path: '/issues/:id',
  method: 'get',
  middleware: [verifyFirebaseToken],
  handler: getIssue,
}

export const createIssueRoute = {
  path: '/issues',
  method: 'post',
  middleware: [verifyFirebaseToken, upload.array('attachments', 5)],
  handler: createIssue,
}

export const updateIssueStatusRoute = {
  path: '/issues/:id/status',
  method: 'patch',
  middleware: [verifyFirebaseToken, isStaff],
  handler: updateIssueStatus,
}

export const assignIssueRoute = {
  path: '/issues/:id/assign',
  method: 'patch',
  middleware: [verifyFirebaseToken, isStaff],
  handler: assignIssue,
}

export const addCommentRoute = {
  path: '/issues/:id/comments',
  method: 'post',
  middleware: [verifyFirebaseToken],
  handler: addComment,
}

export const shareIssueRoute = {
  path: '/issues/:id/share',
  method: 'post',
  middleware: [verifyFirebaseToken],
  handler: shareIssue,
}

import { verifyFirebaseToken } from '../middleware/verifyFirebaseToken.js'
import { isStaff } from '../middleware/isStaff.js'
import {
  listIssues,
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

export const getIssueRoute = {
  path: '/issues/:id',
  method: 'get',
  middleware: [verifyFirebaseToken],
  handler: getIssue,
}

export const createIssueRoute = {
  path: '/issues',
  method: 'post',
  middleware: [verifyFirebaseToken, upload.array('attachments', 5)], // limit to 5 files
  handler: createIssue,
}

export const updateIssueStatusRoute = {
  path: '/issues/:id/status',
  method: 'patch',
  middleware: [verifyFirebaseToken, isStaff], // only staff can change status
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

import { verifyFirebaseToken } from '../middleware/verifyFirebaseToken.js'
import { isStaff } from '../middleware/isStaff.js'
import { rateLimit } from '../middleware/rateLimit.js'
import { cvUpload } from '../middleware/upload.js'
import {
  listOpenJobs,
  listAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
} from '../controllers/jobs.controller.js'
import {
  submitApplication,
  listApplications,
  updateApplicationStatus,
} from '../controllers/applications.controller.js'

// Public
export const listOpenJobsRoute = {
  path: '/jobs',
  method: 'get',
  middleware: [],
  handler: listOpenJobs,
}

export const getJobRoute = {
  path: '/jobs/:id',
  method: 'get',
  middleware: [],
  handler: getJob,
}

export const submitApplicationRoute = {
  path: '/applications',
  method: 'post',
  middleware: [
    rateLimit({ windowMs: 10 * 60_000, max: 5 }),
    cvUpload.single('cv'),
  ],
  handler: submitApplication,
}

// Admin
export const listAllJobsRoute = {
  path: '/admin/jobs',
  method: 'get',
  middleware: [verifyFirebaseToken, isStaff],
  handler: listAllJobs,
}

export const createJobRoute = {
  path: '/admin/jobs',
  method: 'post',
  middleware: [verifyFirebaseToken, isStaff],
  handler: createJob,
}

export const updateJobRoute = {
  path: '/admin/jobs/:id',
  method: 'patch',
  middleware: [verifyFirebaseToken, isStaff],
  handler: updateJob,
}

export const deleteJobRoute = {
  path: '/admin/jobs/:id',
  method: 'delete',
  middleware: [verifyFirebaseToken, isStaff],
  handler: deleteJob,
}

export const listApplicationsRoute = {
  path: '/admin/applications',
  method: 'get',
  middleware: [verifyFirebaseToken, isStaff],
  handler: listApplications,
}

export const updateApplicationStatusRoute = {
  path: '/admin/applications/:id/status',
  method: 'patch',
  middleware: [verifyFirebaseToken, isStaff],
  handler: updateApplicationStatus,
}

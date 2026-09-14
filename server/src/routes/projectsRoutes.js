import { verifyFirebaseToken } from '../middleware/verifyFirebaseToken.js'
import { isStaff } from '../middleware/isStaff.js'
import { isAdmin } from '../middleware/isAdmin.js'
import {
  createProject,
  listProjects,
  getProject,
  updateProject,
  addProjectUpdate,
  deleteProject,
  listMyProjects,
  getMyProjectDetail,
} from '../controllers/projects.controller.js'

export const createProjectRoute = {
  path: '/admin/projects',
  method: 'post',
  middleware: [verifyFirebaseToken, isStaff],
  handler: createProject,
}

export const listProjectsRoute = {
  path: '/admin/projects',
  method: 'get',
  middleware: [verifyFirebaseToken, isStaff],
  handler: listProjects,
}

export const getProjectRoute = {
  path: '/admin/projects/:id',
  method: 'get',
  middleware: [verifyFirebaseToken, isStaff],
  handler: getProject,
}

export const updateProjectRoute = {
  path: '/admin/projects/:id',
  method: 'patch',
  middleware: [verifyFirebaseToken, isStaff],
  handler: updateProject,
}

export const addProjectUpdateRoute = {
  path: '/admin/projects/:id/updates',
  method: 'post',
  middleware: [verifyFirebaseToken, isStaff],
  handler: addProjectUpdate,
}

export const deleteProjectRoute = {
  path: '/admin/projects/:id',
  method: 'delete',
  middleware: [verifyFirebaseToken, isAdmin],
  handler: deleteProject,
}

export const myProjectsRoute = {
  path: '/projects/mine',
  method: 'get',
  middleware: [verifyFirebaseToken],
  handler: listMyProjects,
}

export const myProjectDetailRoute = {
  path: '/projects/mine/:id',
  method: 'get',
  middleware: [verifyFirebaseToken],
  handler: getMyProjectDetail,
}
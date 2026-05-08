import { verifyFirebaseToken } from '../middleware/verifyFirebaseToken.js'
import { isAdmin } from '../middleware/isAdmin.js'
import {
  createReminder,
  listReminders,
  updateReminder,
  deleteReminder,
  listMyReminders,
  listMyNotifications,
  markNotificationRead,
  markAllRead,
} from '../controllers/reminders.controller.js'

// Admin
export const createReminderRoute = {
  path: '/admin/reminders',
  method: 'post',
  middleware: [verifyFirebaseToken, isAdmin],
  handler: createReminder,
}
export const listRemindersRoute = {
  path: '/admin/reminders',
  method: 'get',
  middleware: [verifyFirebaseToken, isAdmin],
  handler: listReminders,
}
export const updateReminderRoute = {
  path: '/admin/reminders/:id',
  method: 'patch',
  middleware: [verifyFirebaseToken, isAdmin],
  handler: updateReminder,
}
export const deleteReminderRoute = {
  path: '/admin/reminders/:id',
  method: 'delete',
  middleware: [verifyFirebaseToken, isAdmin],
  handler: deleteReminder,
}

// Client
export const myRemindersRoute = {
  path: '/me/reminders',
  method: 'get',
  middleware: [verifyFirebaseToken],
  handler: listMyReminders,
}
export const myNotificationsRoute = {
  path: '/me/notifications',
  method: 'get',
  middleware: [verifyFirebaseToken],
  handler: listMyNotifications,
}
export const markNotificationReadRoute = {
  path: '/me/notifications/:id/read',
  method: 'patch',
  middleware: [verifyFirebaseToken],
  handler: markNotificationRead,
}
export const markAllReadRoute = {
  path: '/me/notifications/read-all',
  method: 'patch',
  middleware: [verifyFirebaseToken],
  handler: markAllRead,
}

import { verifyFirebaseToken } from '../middleware/verifyFirebaseToken.js'
import {
  listNotifications,
  markRead,
  markAllRead,
} from '../controllers/notifications.controller.js'

export const listNotificationsRoute = {
  path: '/notifications',
  method: 'get',
  middleware: [verifyFirebaseToken],
  handler: listNotifications,
}

export const markNotificationReadRoute = {
  path: '/notifications/:id/read',
  method: 'patch',
  middleware: [verifyFirebaseToken],
  handler: markRead,
}

export const markAllNotificationsReadRoute = {
  path: '/notifications/read-all',
  method: 'patch',
  middleware: [verifyFirebaseToken],
  handler: markAllRead,
}

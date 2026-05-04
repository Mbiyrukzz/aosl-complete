import { Notification } from '../models/Notification.js'

export const createNotification = async (io, payload) => {
  if (payload.recipient === payload.actorUid) {
    console.log(`⏭️  Skipping self-notification for ${payload.recipient}`)
    return null
  }

  try {
    const notification = await Notification.create(payload)
    if (io) {
      console.log(`📨 Emitting notification:new to user:${payload.recipient}`)
      const sockets = await io.in(`user:${payload.recipient}`).fetchSockets()
      console.log(`   ${sockets.length} socket(s) in that room`)
      io.to(`user:${payload.recipient}`).emit(
        'notification:new',
        notification.toObject(),
      )
    }
    return notification
  } catch (err) {
    console.error('createNotification error:', err)
    return null
  }
}

export const createNotificationsBulk = async (io, payloads) => {
  // Filter out self-notifications
  const filtered = payloads.filter((p) => p.recipient !== p.actorUid)
  if (filtered.length === 0) return []

  try {
    const docs = await Notification.insertMany(filtered)
    if (io) {
      docs.forEach((doc) => {
        io.to(`user:${doc.recipient}`).emit('notification:new', doc.toObject())
      })
    }
    return docs
  } catch (err) {
    console.error('createNotificationsBulk error:', err)
    return []
  }
}

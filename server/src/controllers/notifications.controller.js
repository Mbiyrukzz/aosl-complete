import { Notification } from '../models/Notification.js'

export const listNotifications = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 20, 50)
    const onlyUnread = req.query.unread === 'true'

    const filter = { recipient: req.user.uid }
    if (onlyUnread) filter.read = false

    const [notifications, unreadCount] = await Promise.all([
      Notification.find(filter).sort({ createdAt: -1 }).limit(limit).lean(),
      Notification.countDocuments({ recipient: req.user.uid, read: false }),
    ])

    res.json({ notifications, unreadCount })
  } catch (err) {
    console.error('listNotifications error:', err)
    res.status(500).json({ error: 'Failed to fetch notifications' })
  }
}

export const markRead = async (req, res) => {
  try {
    const { id } = req.params
    const updated = await Notification.findOneAndUpdate(
      { _id: id, recipient: req.user.uid }, // ownership check baked in
      { read: true },
      { new: true },
    ).lean()

    if (!updated) return res.status(404).json({ error: 'Not found' })
    res.json({ notification: updated })
  } catch (err) {
    console.error('markRead error:', err)
    res.status(500).json({ error: 'Failed to update' })
  }
}

export const markAllRead = async (req, res) => {
  try {
    const result = await Notification.updateMany(
      { recipient: req.user.uid, read: false },
      { read: true },
    )
    res.json({ modifiedCount: result.modifiedCount })
  } catch (err) {
    console.error('markAllRead error:', err)
    res.status(500).json({ error: 'Failed to update' })
  }
}

import { Reminder } from '../models/Reminder.js'
import { User } from '../models/User.js'
import { Notification } from '../models/Notification.js'

// Admin: create a reminder
export const createReminder = async (req, res) => {
  try {
    const {
      userId,
      title,
      message,
      category,
      scheduledFor,
      recurrence = 'none',
      recurrenceEndDate = null,
      channels = { email: true, whatsapp: false, inApp: true },
    } = req.body

    if (!userId || !title?.trim() || !message?.trim() || !scheduledFor) {
      return res
        .status(400)
        .json({
          error: 'userId, title, message, and scheduledFor are required',
        })
    }

    const targetUser = await User.findById(userId).lean()
    if (!targetUser) return res.status(404).json({ error: 'User not found' })

    const reminder = await Reminder.create({
      userId,
      title: title.trim(),
      message: message.trim(),
      category: category || 'general',
      scheduledFor: new Date(scheduledFor),
      recurrence,
      recurrenceEndDate: recurrenceEndDate ? new Date(recurrenceEndDate) : null,
      channels,
      status: 'scheduled',
      createdBy: req.user.uid,
    })

    res.status(201).json({ reminder: reminder.toObject() })
  } catch (err) {
    console.error('createReminder error:', err)
    res.status(500).json({ error: 'Failed to create reminder' })
  }
}

// Admin: list reminders with filters
export const listReminders = async (req, res) => {
  try {
    const filter = {}
    if (req.query.userId) filter.userId = req.query.userId
    if (req.query.status && req.query.status !== 'all')
      filter.status = req.query.status
    if (req.query.category && req.query.category !== 'all')
      filter.category = req.query.category

    const reminders = await Reminder.find(filter)
      .sort({ scheduledFor: 1 })
      .limit(500)
      .populate('userId', 'displayName email')
      .lean()

    res.json({ reminders })
  } catch (err) {
    console.error('listReminders error:', err)
    res.status(500).json({ error: 'Failed to fetch reminders' })
  }
}

// Admin: update reminder (only if still scheduled)
export const updateReminder = async (req, res) => {
  try {
    const allowed = [
      'title',
      'message',
      'category',
      'scheduledFor',
      'recurrence',
      'recurrenceEndDate',
      'channels',
      'status',
    ]
    const updates = {}
    for (const k of allowed)
      if (req.body[k] !== undefined) updates[k] = req.body[k]

    const reminder = await Reminder.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).lean()

    if (!reminder) return res.status(404).json({ error: 'Reminder not found' })
    res.json({ reminder })
  } catch (err) {
    console.error('updateReminder error:', err)
    res.status(500).json({ error: 'Failed to update reminder' })
  }
}

// Admin: delete reminder
export const deleteReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findByIdAndDelete(req.params.id).lean()
    if (!reminder) return res.status(404).json({ error: 'Reminder not found' })
    res.json({ success: true })
  } catch (err) {
    console.error('deleteReminder error:', err)
    res.status(500).json({ error: 'Failed to delete reminder' })
  }
}

// Client: their own reminders (upcoming)
export const listMyReminders = async (req, res) => {
  try {
    const me = await User.findOne({ uid: req.user.uid }).lean()
    if (!me) return res.status(404).json({ error: 'Profile not found' })

    const reminders = await Reminder.find({
      userId: me._id,
      status: { $in: ['scheduled', 'sent'] },
    })
      .sort({ scheduledFor: 1 })
      .limit(50)
      .lean()

    res.json({ reminders })
  } catch (err) {
    console.error('listMyReminders error:', err)
    res.status(500).json({ error: 'Failed to fetch reminders' })
  }
}

// Client: their notification history (activity feed)
export const listMyNotifications = async (req, res) => {
  try {
    const me = await User.findOne({ uid: req.user.uid }).lean()
    if (!me) return res.status(404).json({ error: 'Profile not found' })

    const notifications = await Notification.find({ userId: me._id })
      .sort({ createdAt: -1 })
      .limit(100)
      .lean()

    const unreadCount = await Notification.countDocuments({
      userId: me._id,
      'delivery.inApp.readAt': null,
    })

    res.json({ notifications, unreadCount })
  } catch (err) {
    console.error('listMyNotifications error:', err)
    res.status(500).json({ error: 'Failed to fetch notifications' })
  }
}

// Client: mark notification as read
export const markNotificationRead = async (req, res) => {
  try {
    const me = await User.findOne({ uid: req.user.uid }).lean()
    if (!me) return res.status(404).json({ error: 'Profile not found' })

    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: me._id },
      { 'delivery.inApp.readAt': new Date() },
      { new: true },
    ).lean()

    if (!notification)
      return res.status(404).json({ error: 'Notification not found' })

    res.json({ notification })
  } catch (err) {
    console.error('markNotificationRead error:', err)
    res.status(500).json({ error: 'Failed to mark as read' })
  }
}

// Client: mark all as read
export const markAllRead = async (req, res) => {
  try {
    const me = await User.findOne({ uid: req.user.uid }).lean()
    if (!me) return res.status(404).json({ error: 'Profile not found' })

    await Notification.updateMany(
      { userId: me._id, 'delivery.inApp.readAt': null },
      { 'delivery.inApp.readAt': new Date() },
    )

    res.json({ success: true })
  } catch (err) {
    console.error('markAllRead error:', err)
    res.status(500).json({ error: 'Failed to mark all read' })
  }
}

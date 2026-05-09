import { Reminder } from '../models/Reminder.js'
import { User } from '../models/User.js'
import { Company } from '../models/Company.js'
import { Notification } from '../models/Notification.js'

// Admin: create a reminder (company-targeted)
export const createReminder = async (req, res) => {
  try {
    const {
      companyId,
      userId, // optional — narrow to one user
      title,
      message,
      category,
      scheduledFor,
      recurrence = 'none',
      recurrenceEndDate = null,
      channels = { email: true, whatsapp: false, inApp: true },
    } = req.body

    if (!companyId || !title?.trim() || !message?.trim() || !scheduledFor) {
      return res.status(400).json({
        error: 'companyId, title, message, and scheduledFor are required',
      })
    }

    const company = await Company.findById(companyId).lean()
    if (!company) return res.status(404).json({ error: 'Company not found' })

    // If userId provided, validate they belong to that company
    if (userId) {
      const user = await User.findById(userId).lean()
      if (!user) return res.status(404).json({ error: 'User not found' })
      if (
        !user.companyId ||
        user.companyId.toString() !== companyId.toString()
      ) {
        return res
          .status(400)
          .json({ error: 'User does not belong to that company' })
      }
    }

    const reminder = await Reminder.create({
      companyId,
      userId: userId || null,
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

    const populated = await Reminder.findById(reminder._id)
      .populate('companyId', 'name tier')
      .populate('userId', 'displayName email')
      .lean()

    res.status(201).json({ reminder: populated })
  } catch (err) {
    console.error('createReminder error:', err)
    res.status(500).json({ error: 'Failed to create reminder' })
  }
}

// Admin: list reminders with filters
export const listReminders = async (req, res) => {
  try {
    const filter = {}
    if (req.query.companyId) filter.companyId = req.query.companyId
    if (req.query.status && req.query.status !== 'all')
      filter.status = req.query.status
    if (req.query.category && req.query.category !== 'all')
      filter.category = req.query.category

    const reminders = await Reminder.find(filter)
      .sort({ scheduledFor: 1 })
      .limit(500)
      .populate('companyId', 'name tier')
      .populate('userId', 'displayName email')
      .lean()

    res.json({ reminders })
  } catch (err) {
    console.error('listReminders error:', err)
    res.status(500).json({ error: 'Failed to fetch reminders' })
  }
}

// Admin: update reminder
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
      'userId', // can change targeting after creation
    ]
    const updates = {}
    for (const k of allowed)
      if (req.body[k] !== undefined) updates[k] = req.body[k]

    const reminder = await Reminder.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    })
      .populate('companyId', 'name tier')
      .populate('userId', 'displayName email')
      .lean()

    if (!reminder) return res.status(404).json({ error: 'Reminder not found' })
    res.json({ reminder })
  } catch (err) {
    console.error('updateReminder error:', err)
    res.status(500).json({ error: 'Failed to update reminder' })
  }
}

// Admin: delete
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

// Client: their own reminders (filtered to their company; userId-targeted ones must match them)
export const listMyReminders = async (req, res) => {
  try {
    const me = await User.findOne({ uid: req.user.uid }).lean()
    if (!me) return res.status(404).json({ error: 'Profile not found' })
    if (!me.companyId) return res.json({ reminders: [] })

    const reminders = await Reminder.find({
      companyId: me.companyId,
      // Either company-wide (userId null) OR specifically targeted at me
      $or: [{ userId: null }, { userId: me._id }],
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

// Client: notification feed (unchanged — already keyed by recipient/userId)
export const listMyNotifications = async (req, res) => {
  try {
    const me = await User.findOne({ uid: req.user.uid }).lean()
    if (!me) return res.status(404).json({ error: 'Profile not found' })

    const notifications = await Notification.find({ recipient: req.user.uid })
      .sort({ createdAt: -1 })
      .limit(100)
      .lean()

    const unreadCount = await Notification.countDocuments({
      recipient: req.user.uid,
      read: false,
    })

    res.json({ notifications, unreadCount })
  } catch (err) {
    console.error('listMyNotifications error:', err)
    res.status(500).json({ error: 'Failed to fetch notifications' })
  }
}

// Client: mark single notification as read
export const markNotificationRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user.uid },
      { read: true },
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
    await Notification.updateMany(
      { recipient: req.user.uid, read: false },
      { read: true },
    )
    res.json({ success: true })
  } catch (err) {
    console.error('markAllRead error:', err)
    res.status(500).json({ error: 'Failed to mark all read' })
  }
}

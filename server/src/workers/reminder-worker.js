import { Reminder } from '../models/Reminder.js'
import { dispatch } from '../services/notification-dispatcher.service.js'

const RECURRENCE_DAYS = {
  daily: 1,
  weekly: 7,
  monthly: 30,
  yearly: 365,
}

const advanceDate = (date, recurrence) => {
  const next = new Date(date)
  if (recurrence === 'daily') next.setDate(next.getDate() + 1)
  else if (recurrence === 'weekly') next.setDate(next.getDate() + 7)
  else if (recurrence === 'monthly') next.setMonth(next.getMonth() + 1)
  else if (recurrence === 'yearly') next.setFullYear(next.getFullYear() + 1)
  return next
}

export const processDueReminders = async () => {
  const now = new Date()
  const due = await Reminder.find({
    status: 'scheduled',
    scheduledFor: { $lte: now },
  }).limit(50) // bound batch size to keep each tick fast

  if (due.length === 0) return

  console.log(`[reminder-worker] processing ${due.length} reminder(s)`)

  for (const reminder of due) {
    reminder.lastAttemptAt = now

    try {
      await dispatch({
        userId: reminder.userId,
        title: reminder.title,
        message: reminder.message,
        category: reminder.category,
        channels: reminder.channels,
        reminderId: reminder._id,
      })

      // Handle recurrence: schedule next occurrence or mark sent
      if (reminder.recurrence !== 'none') {
        const nextDate = advanceDate(reminder.scheduledFor, reminder.recurrence)

        if (
          reminder.recurrenceEndDate &&
          nextDate > reminder.recurrenceEndDate
        ) {
          reminder.status = 'sent' // recurrence finished
          reminder.sentAt = now
        } else {
          reminder.scheduledFor = nextDate // queue next occurrence
        }
      } else {
        reminder.status = 'sent'
        reminder.sentAt = now
      }
      reminder.lastError = ''
    } catch (err) {
      console.error(
        `[reminder-worker] failed reminder ${reminder._id}:`,
        err.message,
      )
      reminder.status = 'failed'
      reminder.lastError = err.message
    }

    await reminder.save()
  }
}

// Start the worker — call once at server startup
let intervalHandle = null

export const startReminderWorker = (intervalMs = 60_000) => {
  if (intervalHandle) return
  // Run once immediately, then on schedule
  processDueReminders().catch((err) =>
    console.error('[reminder-worker] initial run failed:', err),
  )
  intervalHandle = setInterval(() => {
    processDueReminders().catch((err) =>
      console.error('[reminder-worker] tick failed:', err),
    )
  }, intervalMs)
  console.log(`✓ Reminder worker started (every ${intervalMs / 1000}s)`)
}

export const stopReminderWorker = () => {
  if (intervalHandle) {
    clearInterval(intervalHandle)
    intervalHandle = null
  }
}

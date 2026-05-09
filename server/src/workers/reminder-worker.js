import { Reminder } from '../models/Reminder.js'
import {
  dispatch,
  dispatchReminderToCompany,
} from '../services/notification-dispatcher.service.js'

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
  }).limit(50)

  if (due.length === 0) return

  console.log(`[reminder-worker] processing ${due.length} reminder(s)`)

  for (const reminder of due) {
    reminder.lastAttemptAt = now

    try {
      // ← changed: fans out to whole company (or specific user if userId is set)
      const notifications = await dispatchReminderToCompany(reminder)

      if (notifications.length === 0) {
        throw new Error('No recipients')
      }

      // Recurrence logic stays the same
      if (reminder.recurrence !== 'none') {
        const nextDate = advanceDate(reminder.scheduledFor, reminder.recurrence)
        if (
          reminder.recurrenceEndDate &&
          nextDate > reminder.recurrenceEndDate
        ) {
          reminder.status = 'sent'
          reminder.sentAt = now
        } else {
          reminder.scheduledFor = nextDate
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

import { Issue } from '../models/Issue.js'
import { User } from '../models/User.js'
import { createNotificationsBulk } from '../services/notifications.service.js'

/**
 * Finds every open/in-progress issue whose SLA deadline has passed and
 * hasn't been escalated yet, then:
 *   1. Bumps priority → urgent
 *   2. Sets escalated = true  (prevents re-firing on the next tick)
 *   3. Sends an in-app notification + socket emit to every admin/staff user
 */
export const processSLABreaches = async (io) => {
  const now = new Date()

  const breached = await Issue.find({
    slaDeadline: { $lte: now },
    escalated: false,
    status: { $in: ['open', 'in_progress'] },
  })
    .select('_id title companyTier companyId slaDeadline priority')
    .lean()

  if (breached.length === 0) return

  console.log(`[sla-worker] ${breached.length} SLA breach(es) to escalate`)

  // Fetch all staff/admin uids once — shared across all breached issues
  const staffUsers = await User.find({ role: { $in: ['staff', 'admin'] } })
    .select('uid')
    .lean()

  if (staffUsers.length === 0) {
    console.warn(
      '[sla-worker] No staff/admin users found — skipping notifications',
    )
  }

  for (const issue of breached) {
    // 1. Escalate in DB atomically — double-check escalated=false to avoid
    //    a race if two server instances run the worker simultaneously
    const updated = await Issue.findOneAndUpdate(
      { _id: issue._id, escalated: false },
      { priority: 'urgent', escalated: true },
      { new: true },
    )

    if (!updated) {
      // Another process beat us to it — skip
      continue
    }

    // 2. Emit issue:updated so any open AdminIssues page refreshes instantly
    if (io) {
      io.to('staff').emit('issue:updated', updated.toObject())
    }

    if (staffUsers.length === 0) continue

    // 3. Build tier label for the notification message
    const tierTag = issue.companyTier
      ? ` [${issue.companyTier.toUpperCase()}]`
      : ''

    const overdueMinutes = Math.round(
      (now - new Date(issue.slaDeadline)) / 60000,
    )
    const overdueLabel =
      overdueMinutes < 60
        ? `${overdueMinutes}m overdue`
        : `${Math.round(overdueMinutes / 60)}h overdue`

    // 4. Notify all staff — one notification per staff member per issue
    const payloads = staffUsers.map((s) => ({
      recipient: s.uid,
      type: 'sla_breach',
      issueId: issue._id,
      issueTitle: issue.title,
      actorUid: 'system',
      actorEmail: 'system',
      message: `SLA breached${tierTag} — "${issue.title}" is ${overdueLabel}. Priority escalated to urgent.`,
    }))

    await createNotificationsBulk(io, payloads)

    console.log(
      `[sla-worker] escalated issue ${issue._id} (${issue.companyTier ?? 'no tier'}, ${overdueLabel})`,
    )
  }
}

let intervalHandle = null

/**
 * Call once at server startup. Passes `io` through so escalation
 * notifications reach connected admins in real time.
 *
 * @param {import('socket.io').Server} io
 * @param {number} intervalMs  default 5 minutes
 */
export const startSLAWorker = (io, intervalMs = 5 * 60 * 1000) => {
  if (intervalHandle) return

  // Run immediately on startup to catch any breaches that accumulated
  // while the server was down
  processSLABreaches(io).catch((err) =>
    console.error('[sla-worker] initial run failed:', err),
  )

  intervalHandle = setInterval(() => {
    processSLABreaches(io).catch((err) =>
      console.error('[sla-worker] tick failed:', err),
    )
  }, intervalMs)

  console.log(
    `✓ SLA escalation worker started (every ${intervalMs / 60_000}min)`,
  )
}

export const stopSLAWorker = () => {
  if (intervalHandle) {
    clearInterval(intervalHandle)
    intervalHandle = null
  }
}
